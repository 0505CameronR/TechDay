/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    const OriginalDate = global.Date;
    class FakeDate {
        constructor() {
            if (arguments.length === 0) {
                const d = new OriginalDate();
                d.setTime(FakeDate.now());
                return d;
            }
            else {
                const args = Array.prototype.slice.call(arguments);
                return new OriginalDate(...args);
            }
        }
        static now() {
            const fakeAsyncTestZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
            if (fakeAsyncTestZoneSpec) {
                return fakeAsyncTestZoneSpec.getCurrentRealTime() + fakeAsyncTestZoneSpec.getCurrentTime();
            }
            return OriginalDate.now.apply(this, arguments);
        }
    }
    FakeDate.UTC = OriginalDate.UTC;
    FakeDate.parse = OriginalDate.parse;
    // keep a reference for zone patched timer function
    const timers = {
        setTimeout: global.setTimeout,
        setInterval: global.setInterval,
        clearTimeout: global.clearTimeout,
        clearInterval: global.clearInterval
    };
    class Scheduler {
        constructor() {
            // Scheduler queue with the tuple of end time and callback function - sorted by end time.
            this._schedulerQueue = [];
            // Current simulated time in millis.
            this._currentTime = 0;
            // Current real time in millis.
            this._currentRealTime = OriginalDate.now();
        }
        getCurrentTime() {
            return this._currentTime;
        }
        getCurrentRealTime() {
            return this._currentRealTime;
        }
        setCurrentRealTime(realTime) {
            this._currentRealTime = realTime;
        }
        scheduleFunction(cb, delay, args = [], isPeriodic = false, isRequestAnimationFrame = false, id = -1) {
            let currentId = id < 0 ? Scheduler.nextId++ : id;
            let endTime = this._currentTime + delay;
            // Insert so that scheduler queue remains sorted by end time.
            let newEntry = {
                endTime: endTime,
                id: currentId,
                func: cb,
                args: args,
                delay: delay,
                isPeriodic: isPeriodic,
                isRequestAnimationFrame: isRequestAnimationFrame
            };
            let i = 0;
            for (; i < this._schedulerQueue.length; i++) {
                let currentEntry = this._schedulerQueue[i];
                if (newEntry.endTime < currentEntry.endTime) {
                    break;
                }
            }
            this._schedulerQueue.splice(i, 0, newEntry);
            return currentId;
        }
        removeScheduledFunctionWithId(id) {
            for (let i = 0; i < this._schedulerQueue.length; i++) {
                if (this._schedulerQueue[i].id == id) {
                    this._schedulerQueue.splice(i, 1);
                    break;
                }
            }
        }
        tick(millis = 0, doTick) {
            let finalTime = this._currentTime + millis;
            let lastCurrentTime = 0;
            if (this._schedulerQueue.length === 0 && doTick) {
                doTick(millis);
                return;
            }
            while (this._schedulerQueue.length > 0) {
                let current = this._schedulerQueue[0];
                if (finalTime < current.endTime) {
                    // Done processing the queue since it's sorted by endTime.
                    break;
                }
                else {
                    // Time to run scheduled function. Remove it from the head of queue.
                    let current = this._schedulerQueue.shift();
                    lastCurrentTime = this._currentTime;
                    this._currentTime = current.endTime;
                    if (doTick) {
                        doTick(this._currentTime - lastCurrentTime);
                    }
                    let retval = current.func.apply(global, current.args);
                    if (!retval) {
                        // Uncaught exception in the current scheduled function. Stop processing the queue.
                        break;
                    }
                }
            }
            lastCurrentTime = this._currentTime;
            this._currentTime = finalTime;
            if (doTick) {
                doTick(this._currentTime - lastCurrentTime);
            }
        }
        flush(limit = 20, flushPeriodic = false, doTick) {
            if (flushPeriodic) {
                return this.flushPeriodic(doTick);
            }
            else {
                return this.flushNonPeriodic(limit, doTick);
            }
        }
        flushPeriodic(doTick) {
            if (this._schedulerQueue.length === 0) {
                return 0;
            }
            // Find the last task currently queued in the scheduler queue and tick
            // till that time.
            const startTime = this._currentTime;
            const lastTask = this._schedulerQueue[this._schedulerQueue.length - 1];
            this.tick(lastTask.endTime - startTime, doTick);
            return this._currentTime - startTime;
        }
        flushNonPeriodic(limit, doTick) {
            const startTime = this._currentTime;
            let lastCurrentTime = 0;
            let count = 0;
            while (this._schedulerQueue.length > 0) {
                count++;
                if (count > limit) {
                    throw new Error('flush failed after reaching the limit of ' + limit +
                        ' tasks. Does your code use a polling timeout?');
                }
                // flush only non-periodic timers.
                // If the only remaining tasks are periodic(or requestAnimationFrame), finish flushing.
                if (this._schedulerQueue.filter(task => !task.isPeriodic && !task.isRequestAnimationFrame)
                    .length === 0) {
                    break;
                }
                const current = this._schedulerQueue.shift();
                lastCurrentTime = this._currentTime;
                this._currentTime = current.endTime;
                if (doTick) {
                    // Update any secondary schedulers like Jasmine mock Date.
                    doTick(this._currentTime - lastCurrentTime);
                }
                const retval = current.func.apply(global, current.args);
                if (!retval) {
                    // Uncaught exception in the current scheduled function. Stop processing the queue.
                    break;
                }
            }
            return this._currentTime - startTime;
        }
    }
    // Next scheduler id.
    Scheduler.nextId = 1;
    class FakeAsyncTestZoneSpec {
        constructor(namePrefix, trackPendingRequestAnimationFrame = false, macroTaskOptions) {
            this.trackPendingRequestAnimationFrame = trackPendingRequestAnimationFrame;
            this.macroTaskOptions = macroTaskOptions;
            this._scheduler = new Scheduler();
            this._microtasks = [];
            this._lastError = null;
            this._uncaughtPromiseErrors = Promise[Zone.__symbol__('uncaughtPromiseErrors')];
            this.pendingPeriodicTimers = [];
            this.pendingTimers = [];
            this.patchDateLocked = false;
            this.properties = { 'FakeAsyncTestZoneSpec': this };
            this.name = 'fakeAsyncTestZone for ' + namePrefix;
            // in case user can't access the construction of FakeAsyncTestSpec
            // user can also define macroTaskOptions by define a global variable.
            if (!this.macroTaskOptions) {
                this.macroTaskOptions = global[Zone.__symbol__('FakeAsyncTestMacroTask')];
            }
        }
        static assertInZone() {
            if (Zone.current.get('FakeAsyncTestZoneSpec') == null) {
                throw new Error('The code should be running in the fakeAsync zone to call this function');
            }
        }
        _fnAndFlush(fn, completers) {
            return (...args) => {
                fn.apply(global, args);
                if (this._lastError === null) { // Success
                    if (completers.onSuccess != null) {
                        completers.onSuccess.apply(global);
                    }
                    // Flush microtasks only on success.
                    this.flushMicrotasks();
                }
                else { // Failure
                    if (completers.onError != null) {
                        completers.onError.apply(global);
                    }
                }
                // Return true if there were no errors, false otherwise.
                return this._lastError === null;
            };
        }
        static _removeTimer(timers, id) {
            let index = timers.indexOf(id);
            if (index > -1) {
                timers.splice(index, 1);
            }
        }
        _dequeueTimer(id) {
            return () => {
                FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
            };
        }
        _requeuePeriodicTimer(fn, interval, args, id) {
            return () => {
                // Requeue the timer callback if it's not been canceled.
                if (this.pendingPeriodicTimers.indexOf(id) !== -1) {
                    this._scheduler.scheduleFunction(fn, interval, args, true, false, id);
                }
            };
        }
        _dequeuePeriodicTimer(id) {
            return () => {
                FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
            };
        }
        _setTimeout(fn, delay, args, isTimer = true) {
            let removeTimerFn = this._dequeueTimer(Scheduler.nextId);
            // Queue the callback and dequeue the timer on success and error.
            let cb = this._fnAndFlush(fn, { onSuccess: removeTimerFn, onError: removeTimerFn });
            let id = this._scheduler.scheduleFunction(cb, delay, args, false, !isTimer);
            if (isTimer) {
                this.pendingTimers.push(id);
            }
            return id;
        }
        _clearTimeout(id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        }
        _setInterval(fn, interval, args) {
            let id = Scheduler.nextId;
            let completers = { onSuccess: null, onError: this._dequeuePeriodicTimer(id) };
            let cb = this._fnAndFlush(fn, completers);
            // Use the callback created above to requeue on success.
            completers.onSuccess = this._requeuePeriodicTimer(cb, interval, args, id);
            // Queue the callback and dequeue the periodic timer only on error.
            this._scheduler.scheduleFunction(cb, interval, args, true);
            this.pendingPeriodicTimers.push(id);
            return id;
        }
        _clearInterval(id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        }
        _resetLastErrorAndThrow() {
            let error = this._lastError || this._uncaughtPromiseErrors[0];
            this._uncaughtPromiseErrors.length = 0;
            this._lastError = null;
            throw error;
        }
        getCurrentTime() {
            return this._scheduler.getCurrentTime();
        }
        getCurrentRealTime() {
            return this._scheduler.getCurrentRealTime();
        }
        setCurrentRealTime(realTime) {
            this._scheduler.setCurrentRealTime(realTime);
        }
        static patchDate() {
            if (!!global[Zone.__symbol__('disableDatePatching')]) {
                // we don't want to patch global Date
                // because in some case, global Date
                // is already being patched, we need to provide
                // an option to let user still use their
                // own version of Date.
                return;
            }
            if (global['Date'] === FakeDate) {
                // already patched
                return;
            }
            global['Date'] = FakeDate;
            FakeDate.prototype = OriginalDate.prototype;
            // try check and reset timers
            // because jasmine.clock().install() may
            // have replaced the global timer
            FakeAsyncTestZoneSpec.checkTimerPatch();
        }
        static resetDate() {
            if (global['Date'] === FakeDate) {
                global['Date'] = OriginalDate;
            }
        }
        static checkTimerPatch() {
            if (global.setTimeout !== timers.setTimeout) {
                global.setTimeout = timers.setTimeout;
                global.clearTimeout = timers.clearTimeout;
            }
            if (global.setInterval !== timers.setInterval) {
                global.setInterval = timers.setInterval;
                global.clearInterval = timers.clearInterval;
            }
        }
        lockDatePatch() {
            this.patchDateLocked = true;
            FakeAsyncTestZoneSpec.patchDate();
        }
        unlockDatePatch() {
            this.patchDateLocked = false;
            FakeAsyncTestZoneSpec.resetDate();
        }
        tick(millis = 0, doTick) {
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            this._scheduler.tick(millis, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
        }
        flushMicrotasks() {
            FakeAsyncTestZoneSpec.assertInZone();
            const flushErrors = () => {
                if (this._lastError !== null || this._uncaughtPromiseErrors.length) {
                    // If there is an error stop processing the microtask queue and rethrow the error.
                    this._resetLastErrorAndThrow();
                }
            };
            while (this._microtasks.length > 0) {
                let microtask = this._microtasks.shift();
                microtask.func.apply(microtask.target, microtask.args);
            }
            flushErrors();
        }
        flush(limit, flushPeriodic, doTick) {
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            const elapsed = this._scheduler.flush(limit, flushPeriodic, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
            return elapsed;
        }
        onScheduleTask(delegate, current, target, task) {
            switch (task.type) {
                case 'microTask':
                    let args = task.data && task.data.args;
                    // should pass additional arguments to callback if have any
                    // currently we know process.nextTick will have such additional
                    // arguments
                    let additionalArgs;
                    if (args) {
                        let callbackIndex = task.data.cbIdx;
                        if (typeof args.length === 'number' && args.length > callbackIndex + 1) {
                            additionalArgs = Array.prototype.slice.call(args, callbackIndex + 1);
                        }
                    }
                    this._microtasks.push({
                        func: task.invoke,
                        args: additionalArgs,
                        target: task.data && task.data.target
                    });
                    break;
                case 'macroTask':
                    switch (task.source) {
                        case 'setTimeout':
                            task.data['handleId'] = this._setTimeout(task.invoke, task.data['delay'], Array.prototype.slice.call(task.data['args'], 2));
                            break;
                        case 'setImmediate':
                            task.data['handleId'] = this._setTimeout(task.invoke, 0, Array.prototype.slice.call(task.data['args'], 1));
                            break;
                        case 'setInterval':
                            task.data['handleId'] = this._setInterval(task.invoke, task.data['delay'], Array.prototype.slice.call(task.data['args'], 2));
                            break;
                        case 'XMLHttpRequest.send':
                            throw new Error('Cannot make XHRs from within a fake async test. Request URL: ' +
                                task.data['url']);
                        case 'requestAnimationFrame':
                        case 'webkitRequestAnimationFrame':
                        case 'mozRequestAnimationFrame':
                            // Simulate a requestAnimationFrame by using a setTimeout with 16 ms.
                            // (60 frames per second)
                            task.data['handleId'] = this._setTimeout(task.invoke, 16, task.data['args'], this.trackPendingRequestAnimationFrame);
                            break;
                        default:
                            // user can define which macroTask they want to support by passing
                            // macroTaskOptions
                            const macroTaskOption = this.findMacroTaskOption(task);
                            if (macroTaskOption) {
                                const args = task.data && task.data['args'];
                                const delay = args && args.length > 1 ? args[1] : 0;
                                let callbackArgs = macroTaskOption.callbackArgs ? macroTaskOption.callbackArgs : args;
                                if (!!macroTaskOption.isPeriodic) {
                                    // periodic macroTask, use setInterval to simulate
                                    task.data['handleId'] = this._setInterval(task.invoke, delay, callbackArgs);
                                    task.data.isPeriodic = true;
                                }
                                else {
                                    // not periodic, use setTimeout to simulate
                                    task.data['handleId'] = this._setTimeout(task.invoke, delay, callbackArgs);
                                }
                                break;
                            }
                            throw new Error('Unknown macroTask scheduled in fake async test: ' + task.source);
                    }
                    break;
                case 'eventTask':
                    task = delegate.scheduleTask(target, task);
                    break;
            }
            return task;
        }
        onCancelTask(delegate, current, target, task) {
            switch (task.source) {
                case 'setTimeout':
                case 'requestAnimationFrame':
                case 'webkitRequestAnimationFrame':
                case 'mozRequestAnimationFrame':
                    return this._clearTimeout(task.data['handleId']);
                case 'setInterval':
                    return this._clearInterval(task.data['handleId']);
                default:
                    // user can define which macroTask they want to support by passing
                    // macroTaskOptions
                    const macroTaskOption = this.findMacroTaskOption(task);
                    if (macroTaskOption) {
                        const handleId = task.data['handleId'];
                        return macroTaskOption.isPeriodic ? this._clearInterval(handleId) :
                            this._clearTimeout(handleId);
                    }
                    return delegate.cancelTask(target, task);
            }
        }
        onInvoke(delegate, current, target, callback, applyThis, applyArgs, source) {
            try {
                FakeAsyncTestZoneSpec.patchDate();
                return delegate.invoke(target, callback, applyThis, applyArgs, source);
            }
            finally {
                if (!this.patchDateLocked) {
                    FakeAsyncTestZoneSpec.resetDate();
                }
            }
        }
        findMacroTaskOption(task) {
            if (!this.macroTaskOptions) {
                return null;
            }
            for (let i = 0; i < this.macroTaskOptions.length; i++) {
                const macroTaskOption = this.macroTaskOptions[i];
                if (macroTaskOption.source === task.source) {
                    return macroTaskOption;
                }
            }
            return null;
        }
        onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
            this._lastError = error;
            return false; // Don't propagate error to parent zone.
        }
    }
    // Export the class so that new instances can be created with proper
    // constructor params.
    Zone['FakeAsyncTestZoneSpec'] = FakeAsyncTestZoneSpec;
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1hc3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvem9uZS1zcGVjL2Zha2UtYXN5bmMtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxDQUFDLFVBQVMsTUFBVztJQXVCckIsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNqQyxNQUFNLFFBQVE7UUFDWjtZQUNFLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQzFCLE1BQU0sQ0FBQyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7Z0JBQzdCLENBQUMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7Z0JBQzFCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7aUJBQU07Z0JBQ0wsTUFBTSxJQUFJLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUNuRCxPQUFPLElBQUksWUFBWSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7YUFDbEM7UUFDSCxDQUFDO1FBRUQsTUFBTSxDQUFDLEdBQUc7WUFDUixNQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLHVCQUF1QixDQUFDLENBQUM7WUFDeEUsSUFBSSxxQkFBcUIsRUFBRTtnQkFDekIsT0FBTyxxQkFBcUIsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLHFCQUFxQixDQUFDLGNBQWMsRUFBRSxDQUFDO2FBQzVGO1lBQ0QsT0FBTyxZQUFZLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDakQsQ0FBQztLQUNGO0lBRUEsUUFBZ0IsQ0FBQyxH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QUFLLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuKGZ1bmN0aW9uKGdsb2JhbDogYW55KSB7XG5pbnRlcmZhY2UgU2NoZWR1bGVkRnVuY3Rpb24ge1xuICBlbmRUaW1lOiBudW1iZXI7XG4gIGlkOiBudW1iZXI7XG4gIGZ1bmM6IEZ1bmN0aW9uO1xuICBhcmdzOiBhbnlbXTtcbiAgZGVsYXk6IG51bWJlcjtcbiAgaXNQZXJpb2RpYzogYm9vbGVhbjtcbiAgaXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWU6IGJvb2xlYW47XG59XG5cbmludGVyZmFjZSBNaWNyb1Rhc2tTY2hlZHVsZWRGdW5jdGlvbiB7XG4gIGZ1bmM6IEZ1bmN0aW9uO1xuICBhcmdzPzogYW55W107XG4gIHRhcmdldDogYW55O1xufVxuXG5pbnRlcmZhY2UgTWFjcm9UYXNrT3B0aW9ucyB7XG4gIHNvdXJjZTogc3RyaW5nO1xuICBpc1BlcmlvZGljPzogYm9vbGVhbjtcbiAgY2FsbGJhY2tBcmdzPzogYW55O1xufVxuXG5jb25zdCBPcmlnaW5hbERhdGUgPSBnbG9iYWwuRGF0ZTtcbmNsYXNzIEZha2VEYXRlIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGQgPSBuZXcgT3JpZ2luYWxEYXRlKCk7XG4gICAgICBkLnNldFRpbWUoRmFrZURhdGUubm93KCkpO1xuICAgICAgcmV0dXJuIGQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgcmV0dXJuIG5ldyBPcmlnaW5hbERhdGUoLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIG5vdygpIHtcbiAgICBjb25zdCBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICBpZiAoZmFrZUFzeW5jVGVzdFpvbmVTcGVjKSB7XG4gICAgICByZXR1cm4gZmFrZUFzeW5jVGVzdFpvbmVTcGVjLmdldEN1cnJlbnRSZWFsVGltZSgpICsgZmFrZUFzeW5jVGVzdFpvbmVTcGVjLmdldEN1cnJlbnRUaW1lKCk7XG4gICAgfVxuICAgIHJldHVybiBPcmlnaW5hbERhdGUubm93LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH1cbn1cblxuKEZha2VEYXRlIGFzIGFueSkuVVRDID0gT3JpZ2luYWxEYXRlLlVUQztcbihGYWtlRGF0ZSBhcyBhbnkpLnBhcnNlID0gT3JpZ2luYWxEYXRlLnBhcnNlO1xuXG4vLyBrZWVwIGEgcmVmZXJlbmNlIGZvciB6b25lIHBhdGNoZWQgdGltZXIgZnVuY3Rpb25cbmNvbnN0IHRpbWVycyA9IHtcbiAgc2V0VGltZW91dDogZ2xvYmFsLnNldFRpbWVvdXQsXG4gIHNldEludGVydmFsOiBnbG9iYWwuc2V0SW50ZXJ2YWwsXG4gIGNsZWFyVGltZW91dDogZ2xvYmFsLmNsZWFyVGltZW91dCxcbiAgY2xlYXJJbnRlcnZhbDogZ2xvYmFsLmNsZWFySW50ZXJ2YWxcbn07XG5cbmNsYXNzIFNjaGVkdWxlciB7XG4gIC8vIE5leHQgc2NoZWR1bGVyIGlkLlxuICBwdWJsaWMgc3RhdGljIG5leHRJZDogbnVtYmVyID0gMTtcblxuICAvLyBTY2hlZHVsZXIgcXVldWUgd2l0aCB0aGUgdHVwbGUgb2YgZW5kIHRpbWUgYW5kIGNhbGxiYWNrIGZ1bmN0aW9uIC0gc29ydGVkIGJ5IGVuZCB0aW1lLlxuICBwcml2YXRlIF9zY2hlZHVsZXJRdWV1ZTogU2NoZWR1bGVkRnVuY3Rpb25bXSA9IFtdO1xuICAvLyBDdXJyZW50IHNpbXVsYXRlZCB0aW1lIGluIG1pbGxpcy5cbiAgcHJpdmF0ZSBfY3VycmVudFRpbWU6IG51bWJlciA9IDA7XG4gIC8vIEN1cnJlbnQgcmVhbCB0aW1lIGluIG1pbGxpcy5cbiAgcHJpdmF0ZSBfY3VycmVudFJlYWxUaW1lOiBudW1iZXIgPSBPcmlnaW5hbERhdGUubm93KCk7XG5cbiAgY29uc3RydWN0b3IoKSB7fVxuXG4gIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZTtcbiAgfVxuXG4gIGdldEN1cnJlbnRSZWFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFJlYWxUaW1lO1xuICB9XG5cbiAgc2V0Q3VycmVudFJlYWxUaW1lKHJlYWxUaW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLl9jdXJyZW50UmVhbFRpbWUgPSByZWFsVGltZTtcbiAgfVxuXG4gIHNjaGVkdWxlRnVuY3Rpb24oXG4gICAgICBjYjogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIsIGFyZ3M6IGFueVtdID0gW10sIGlzUGVyaW9kaWM6IGJvb2xlYW4gPSBmYWxzZSxcbiAgICAgIGlzUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiBib29sZWFuID0gZmFsc2UsIGlkOiBudW1iZXIgPSAtMSk6IG51bWJlciB7XG4gICAgbGV0IGN1cnJlbnRJZDogbnVtYmVyID0gaWQgPCAwID8gU2NoZWR1bGVyLm5leHRJZCsrIDogaWQ7XG4gICAgbGV0IGVuZFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZSArIGRlbGF5O1xuXG4gICAgLy8gSW5zZXJ0IHNvIHRoYXQgc2NoZWR1bGVyIHF1ZXVlIHJlbWFpbnMgc29ydGVkIGJ5IGVuZCB0aW1lLlxuICAgIGxldCBuZXdFbnRyeTogU2NoZWR1bGVkRnVuY3Rpb24gPSB7XG4gICAgICBlbmRUaW1lOiBlbmRUaW1lLFxuICAgICAgaWQ6IGN1cnJlbnRJZCxcbiAgICAgIGZ1bmM6IGNiLFxuICAgICAgYXJnczogYXJncyxcbiAgICAgIGRlbGF5OiBkZWxheSxcbiAgICAgIGlzUGVyaW9kaWM6IGlzUGVyaW9kaWMsXG4gICAgICBpc1JlcXVlc3RBbmltYXRpb25GcmFtZTogaXNSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICB9O1xuICAgIGxldCBpID0gMDtcbiAgICBmb3IgKDsgaSA8IHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsZXQgY3VycmVudEVudHJ5ID0gdGhpcy5fc2NoZWR1bGVyUXVldWVbaV07XG4gICAgICBpZiAobmV3RW50cnkuZW5kVGltZSA8IGN1cnJlbnRFbnRyeS5lbmRUaW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9zY2hlZHVsZXJRdWV1ZS5zcGxpY2UoaSwgMCwgbmV3RW50cnkpO1xuICAgIHJldHVybiBjdXJyZW50SWQ7XG4gIH1cblxuICByZW1vdmVTY2hlZHVsZWRGdW5jdGlvbldpdGhJZChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9zY2hlZHVsZXJRdWV1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlW2ldLmlkID09IGlkKSB7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlclF1ZXVlLnNwbGljZShpLCAxKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdGljayhtaWxsaXM6IG51bWJlciA9IDAsIGRvVGljaz86IChlbGFwc2VkOiBudW1iZXIpID0+IHZvaWQpOiB2b2lkIHtcbiAgICBsZXQgZmluYWxUaW1lID0gdGhpcy5fY3VycmVudFRpbWUgKyBtaWxsaXM7XG4gICAgbGV0IGxhc3RDdXJyZW50VGltZSA9IDA7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCA9PT0gMCAmJiBkb1RpY2spIHtcbiAgICAgIGRvVGljayhtaWxsaXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB3aGlsZSAodGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLl9zY2hlZHVsZXJRdWV1ZVswXTtcbiAgICAgIGlmIChmaW5hbFRpbWUgPCBjdXJyZW50LmVuZFRpbWUpIHtcbiAgICAgICAgLy8gRG9uZSBwcm9jZXNzaW5nIHRoZSBxdWV1ZSBzaW5jZSBpdCdzIHNvcnRlZCBieSBlbmRUaW1lLlxuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIFRpbWUgdG8gcnVuIHNjaGVkdWxlZCBmdW5jdGlvbi4gUmVtb3ZlIGl0IGZyb20gdGhlIGhlYWQgb2YgcXVldWUuXG4gICAgICAgIGxldCBjdXJyZW50ID0gdGhpcy5fc2NoZWR1bGVyUXVldWUuc2hpZnQoKSE7XG4gICAgICAgIGxhc3RDdXJyZW50VGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lO1xuICAgICAgICB0aGlzLl9jdXJyZW50VGltZSA9IGN1cnJlbnQuZW5kVGltZTtcbiAgICAgICAgaWYgKGRvVGljaykge1xuICAgICAgICAgIGRvVGljayh0aGlzLl9jdXJyZW50VGltZSAtIGxhc3RDdXJyZW50VGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJldHZhbCA9IGN1cnJlbnQuZnVuYy5hcHBseShnbG9iYWwsIGN1cnJlbnQuYXJncyk7XG4gICAgICAgIGlmICghcmV0dmFsKSB7XG4gICAgICAgICAgLy8gVW5jYXVnaHQgZXhjZXB0aW9uIGluIHRoZSBjdXJyZW50IHNjaGVkdWxlZCBmdW5jdGlvbi4gU3RvcCBwcm9jZXNzaW5nIHRoZSBxdWV1ZS5cbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBsYXN0Q3VycmVudFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICB0aGlzLl9jdXJyZW50VGltZSA9IGZpbmFsVGltZTtcbiAgICBpZiAoZG9UaWNrKSB7XG4gICAgICBkb1RpY2sodGhpcy5fY3VycmVudFRpbWUgLSBsYXN0Q3VycmVudFRpbWUpO1xuICAgIH1cbiAgfVxuXG4gIGZsdXNoKGxpbWl0ID0gMjAsIGZsdXNoUGVyaW9kaWMgPSBmYWxzZSwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgaWYgKGZsdXNoUGVyaW9kaWMpIHtcbiAgICAgIHJldHVybiB0aGlzLmZsdXNoUGVyaW9kaWMoZG9UaWNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZmx1c2hOb25QZXJpb2RpYyhsaW1pdCwgZG9UaWNrKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGZsdXNoUGVyaW9kaWMoZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IG51bWJlciB7XG4gICAgaWYgKHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIC8vIEZpbmQgdGhlIGxhc3QgdGFzayBjdXJyZW50bHkgcXVldWVkIGluIHRoZSBzY2hlZHVsZXIgcXVldWUgYW5kIHRpY2tcbiAgICAvLyB0aWxsIHRoYXQgdGltZS5cbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICBjb25zdCBsYXN0VGFzayA9IHRoaXMuX3NjaGVkdWxlclF1ZXVlW3RoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCAtIDFdO1xuICAgIHRoaXMudGljayhsYXN0VGFzay5lbmRUaW1lIC0gc3RhcnRUaW1lLCBkb1RpY2spO1xuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgfVxuXG4gIHByaXZhdGUgZmx1c2hOb25QZXJpb2RpYyhsaW1pdDogbnVtYmVyLCBkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBjb25zdCBzdGFydFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICBsZXQgbGFzdEN1cnJlbnRUaW1lID0gMDtcbiAgICBsZXQgY291bnQgPSAwO1xuICAgIHdoaWxlICh0aGlzLl9zY2hlZHVsZXJRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb3VudCsrO1xuICAgICAgaWYgKGNvdW50ID4gbGltaXQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgJ2ZsdXNoIGZhaWxlZCBhZnRlciByZWFjaGluZyB0aGUgbGltaXQgb2YgJyArIGxpbWl0ICtcbiAgICAgICAgICAgICcgdGFza3MuIERvZXMgeW91ciBjb2RlIHVzZSBhIHBvbGxpbmcgdGltZW91dD8nKTtcbiAgICAgIH1cblxuICAgICAgLy8gZmx1c2ggb25seSBub24tcGVyaW9kaWMgdGltZXJzLlxuICAgICAgLy8gSWYgdGhlIG9ubHkgcmVtYWluaW5nIHRhc2tzIGFyZSBwZXJpb2RpYyhvciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUpLCBmaW5pc2ggZmx1c2hpbmcuXG4gICAgICBpZiAodGhpcy5fc2NoZWR1bGVyUXVldWUuZmlsdGVyKHRhc2sgPT4gIXRhc2suaXNQZXJpb2RpYyAmJiAhdGFzay5pc1JlcXVlc3RBbmltYXRpb25GcmFtZSlcbiAgICAgICAgICAgICAgLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cblxuICAgICAgY29uc3QgY3VycmVudCA9IHRoaXMuX3NjaGVkdWxlclF1ZXVlLnNoaWZ0KCkhO1xuICAgICAgbGFzdEN1cnJlbnRUaW1lID0gdGhpcy5fY3VycmVudFRpbWU7XG4gICAgICB0aGlzLl9jdXJyZW50VGltZSA9IGN1cnJlbnQuZW5kVGltZTtcbiAgICAgIGlmIChkb1RpY2spIHtcbiAgICAgICAgLy8gVXBkYXRlIGFueSBzZWNvbmRhcnkgc2NoZWR1bGVycyBsaWtlIEphc21pbmUgbW9jayBEYXRlLlxuICAgICAgICBkb1RpY2sodGhpcy5fY3VycmVudFRpbWUgLSBsYXN0Q3VycmVudFRpbWUpO1xuICAgICAgfVxuICAgICAgY29uc3QgcmV0dmFsID0gY3VycmVudC5mdW5jLmFwcGx5KGdsb2JhbCwgY3VycmVudC5hcmdzKTtcbiAgICAgIGlmICghcmV0dmFsKSB7XG4gICAgICAgIC8vIFVuY2F1Z2h0IGV4Y2VwdGlvbiBpbiB0aGUgY3VycmVudCBzY2hlZHVsZWQgZnVuY3Rpb24uIFN0b3AgcHJvY2Vzc2luZyB0aGUgcXVldWUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFRpbWUgLSBzdGFydFRpbWU7XG4gIH1cbn1cblxuY2xhc3MgRmFrZUFzeW5jVGVzdFpvbmVTcGVjIGltcGxlbWVudHMgWm9uZVNwZWMge1xuICBzdGF0aWMgYXNzZXJ0SW5ab25lKCk6IHZvaWQge1xuICAgIGlmIChab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKSA9PSBudWxsKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9zY2hlZHVsZXI6IFNjaGVkdWxlciA9IG5ldyBTY2hlZHVsZXIoKTtcbiAgcHJpdmF0ZSBfbWljcm90YXNrczogTWljcm9UYXNrU2NoZWR1bGVkRnVuY3Rpb25bXSA9IFtdO1xuICBwcml2YXRlIF9sYXN0RXJyb3I6IEVycm9yfG51bGwgPSBudWxsO1xuICBwcml2YXRlIF91bmNhdWdodFByb21pc2VFcnJvcnM6IHtyZWplY3Rpb246IGFueX1bXSA9XG4gICAgICAoUHJvbWlzZSBhcyBhbnkpWyhab25lIGFzIGFueSkuX19zeW1ib2xfXygndW5jYXVnaHRQcm9taXNlRXJyb3JzJyldO1xuXG4gIHBlbmRpbmdQZXJpb2RpY1RpbWVyczogbnVtYmVyW10gPSBbXTtcbiAgcGVuZGluZ1RpbWVyczogbnVtYmVyW10gPSBbXTtcblxuICBwcml2YXRlIHBhdGNoRGF0ZUxvY2tlZCA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgICAgbmFtZVByZWZpeDogc3RyaW5nLCBwcml2YXRlIHRyYWNrUGVuZGluZ1JlcXVlc3RBbmltYXRpb25GcmFtZSA9IGZhbHNlLFxuICAgICAgcHJpdmF0ZSBtYWNyb1Rhc2tPcHRpb25zPzogTWFjcm9UYXNrT3B0aW9uc1tdKSB7XG4gICAgdGhpcy5uYW1lID0gJ2Zha2VBc3luY1Rlc3Rab25lIGZvciAnICsgbmFtZVByZWZpeDtcbiAgICAvLyBpbiBjYXNlIHVzZXIgY2FuJ3QgYWNjZXNzIHRoZSBjb25zdHJ1Y3Rpb24gb2YgRmFrZUFzeW5jVGVzdFNwZWNcbiAgICAvLyB1c2VyIGNhbiBhbHNvIGRlZmluZSBtYWNyb1Rhc2tPcHRpb25zIGJ5IGRlZmluZSBhIGdsb2JhbCB2YXJpYWJsZS5cbiAgICBpZiAoIXRoaXMubWFjcm9UYXNrT3B0aW9ucykge1xuICAgICAgdGhpcy5tYWNyb1Rhc2tPcHRpb25zID0gZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnRmFrZUFzeW5jVGVzdE1hY3JvVGFzaycpXTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9mbkFuZEZsdXNoKGZuOiBGdW5jdGlvbiwgY29tcGxldGVyczoge29uU3VjY2Vzcz86IEZ1bmN0aW9uLCBvbkVycm9yPzogRnVuY3Rpb259KTpcbiAgICAgIEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKTogYm9vbGVhbiA9PiB7XG4gICAgICBmbi5hcHBseShnbG9iYWwsIGFyZ3MpO1xuXG4gICAgICBpZiAodGhpcy5fbGFzdEVycm9yID09PSBudWxsKSB7ICAvLyBTdWNjZXNzXG4gICAgICAgIGlmIChjb21wbGV0ZXJzLm9uU3VjY2VzcyAhPSBudWxsKSB7XG4gICAgICAgICAgY29tcGxldGVycy5vblN1Y2Nlc3MuYXBwbHkoZ2xvYmFsKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBGbHVzaCBtaWNyb3Rhc2tzIG9ubHkgb24gc3VjY2Vzcy5cbiAgICAgICAgdGhpcy5mbHVzaE1pY3JvdGFza3MoKTtcbiAgICAgIH0gZWxzZSB7ICAvLyBGYWlsdXJlXG4gICAgICAgIGlmIChjb21wbGV0ZXJzLm9uRXJyb3IgIT0gbnVsbCkge1xuICAgICAgICAgIGNvbXBsZXRlcnMub25FcnJvci5hcHBseShnbG9iYWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBSZXR1cm4gdHJ1ZSBpZiB0aGVyZSB3ZXJlIG5vIGVycm9ycywgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgICAgcmV0dXJuIHRoaXMuX2xhc3RFcnJvciA9PT0gbnVsbDtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgX3JlbW92ZVRpbWVyKHRpbWVyczogbnVtYmVyW10sIGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBsZXQgaW5kZXggPSB0aW1lcnMuaW5kZXhPZihpZCk7XG4gICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgIHRpbWVycy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2RlcXVldWVUaW1lcihpZDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuX3JlbW92ZVRpbWVyKHRoaXMucGVuZGluZ1RpbWVycywgaWQpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9yZXF1ZXVlUGVyaW9kaWNUaW1lcihmbjogRnVuY3Rpb24sIGludGVydmFsOiBudW1iZXIsIGFyZ3M6IGFueVtdLCBpZDogbnVtYmVyKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICAvLyBSZXF1ZXVlIHRoZSB0aW1lciBjYWxsYmFjayBpZiBpdCdzIG5vdCBiZWVuIGNhbmNlbGVkLlxuICAgICAgaWYgKHRoaXMucGVuZGluZ1BlcmlvZGljVGltZXJzLmluZGV4T2YoaWQpICE9PSAtMSkge1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVGdW5jdGlvbihmbiwgaW50ZXJ2YWwsIGFyZ3MsIHRydWUsIGZhbHNlLCBpZCk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX2RlcXVldWVQZXJpb2RpY1RpbWVyKGlkOiBudW1iZXIpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5fcmVtb3ZlVGltZXIodGhpcy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMsIGlkKTtcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0VGltZW91dChmbjogRnVuY3Rpb24sIGRlbGF5OiBudW1iZXIsIGFyZ3M6IGFueVtdLCBpc1RpbWVyID0gdHJ1ZSk6IG51bWJlciB7XG4gICAgbGV0IHJlbW92ZVRpbWVyRm4gPSB0aGlzLl9kZXF1ZXVlVGltZXIoU2NoZWR1bGVyLm5leHRJZCk7XG4gICAgLy8gUXVldWUgdGhlIGNhbGxiYWNrIGFuZCBkZXF1ZXVlIHRoZSB0aW1lciBvbiBzdWNjZXNzIGFuZCBlcnJvci5cbiAgICBsZXQgY2IgPSB0aGlzLl9mbkFuZEZsdXNoKGZuLCB7b25TdWNjZXNzOiByZW1vdmVUaW1lckZuLCBvbkVycm9yOiByZW1vdmVUaW1lckZufSk7XG4gICAgbGV0IGlkID0gdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlRnVuY3Rpb24oY2IsIGRlbGF5LCBhcmdzLCBmYWxzZSwgIWlzVGltZXIpO1xuICAgIGlmIChpc1RpbWVyKSB7XG4gICAgICB0aGlzLnBlbmRpbmdUaW1lcnMucHVzaChpZCk7XG4gICAgfVxuICAgIHJldHVybiBpZDtcbiAgfVxuXG4gIHByaXZhdGUgX2NsZWFyVGltZW91dChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLl9yZW1vdmVUaW1lcih0aGlzLnBlbmRpbmdUaW1lcnMsIGlkKTtcbiAgICB0aGlzLl9zY2hlZHVsZXIucmVtb3ZlU2NoZWR1bGVkRnVuY3Rpb25XaXRoSWQoaWQpO1xuICB9XG5cbiAgcHJpdmF0ZSBfc2V0SW50ZXJ2YWwoZm46IEZ1bmN0aW9uLCBpbnRlcnZhbDogbnVtYmVyLCBhcmdzOiBhbnlbXSk6IG51bWJlciB7XG4gICAgbGV0IGlkID0gU2NoZWR1bGVyLm5leHRJZDtcbiAgICBsZXQgY29tcGxldGVycyA9IHtvblN1Y2Nlc3M6IG51bGwgYXMgYW55LCBvbkVycm9yOiB0aGlzLl9kZXF1ZXVlUGVyaW9kaWNUaW1lcihpZCl9O1xuICAgIGxldCBjYiA9IHRoaXMuX2ZuQW5kRmx1c2goZm4sIGNvbXBsZXRlcnMpO1xuXG4gICAgLy8gVXNlIHRoZSBjYWxsYmFjayBjcmVhdGVkIGFib3ZlIHRvIHJlcXVldWUgb24gc3VjY2Vzcy5cbiAgICBjb21wbGV0ZXJzLm9uU3VjY2VzcyA9IHRoaXMuX3JlcXVldWVQZXJpb2RpY1RpbWVyKGNiLCBpbnRlcnZhbCwgYXJncywgaWQpO1xuXG4gICAgLy8gUXVldWUgdGhlIGNhbGxiYWNrIGFuZCBkZXF1ZXVlIHRoZSBwZXJpb2RpYyB0aW1lciBvbmx5IG9uIGVycm9yLlxuICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZUZ1bmN0aW9uKGNiLCBpbnRlcnZhbCwgYXJncywgdHJ1ZSk7XG4gICAgdGhpcy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMucHVzaChpZCk7XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJJbnRlcnZhbChpZDogbnVtYmVyKTogdm9pZCB7XG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLl9yZW1vdmVUaW1lcih0aGlzLnBlbmRpbmdQZXJpb2RpY1RpbWVycywgaWQpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5yZW1vdmVTY2hlZHVsZWRGdW5jdGlvbldpdGhJZChpZCk7XG4gIH1cblxuICBwcml2YXRlIF9yZXNldExhc3RFcnJvckFuZFRocm93KCk6IHZvaWQge1xuICAgIGxldCBlcnJvciA9IHRoaXMuX2xhc3RFcnJvciB8fCB0aGlzLl91bmNhdWdodFByb21pc2VFcnJvcnNbMF07XG4gICAgdGhpcy5fdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCA9IDA7XG4gICAgdGhpcy5fbGFzdEVycm9yID0gbnVsbDtcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxuXG4gIGdldEN1cnJlbnRUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuZ2V0Q3VycmVudFRpbWUoKTtcbiAgfVxuXG4gIGdldEN1cnJlbnRSZWFsVGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fc2NoZWR1bGVyLmdldEN1cnJlbnRSZWFsVGltZSgpO1xuICB9XG5cbiAgc2V0Q3VycmVudFJlYWxUaW1lKHJlYWxUaW1lOiBudW1iZXIpIHtcbiAgICB0aGlzLl9zY2hlZHVsZXIuc2V0Q3VycmVudFJlYWxUaW1lKHJlYWxUaW1lKTtcbiAgfVxuXG4gIHN0YXRpYyBwYXRjaERhdGUoKSB7XG4gICAgaWYgKCEhZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnZGlzYWJsZURhdGVQYXRjaGluZycpXSkge1xuICAgICAgLy8gd2UgZG9uJ3Qgd2FudCB0byBwYXRjaCBnbG9iYWwgRGF0ZVxuICAgICAgLy8gYmVjYXVzZSBpbiBzb21lIGNhc2UsIGdsb2JhbCBEYXRlXG4gICAgICAvLyBpcyBhbHJlYWR5IGJlaW5nIHBhdGNoZWQsIHdlIG5lZWQgdG8gcHJvdmlkZVxuICAgICAgLy8gYW4gb3B0aW9uIHRvIGxldCB1c2VyIHN0aWxsIHVzZSB0aGVpclxuICAgICAgLy8gb3duIHZlcnNpb24gb2YgRGF0ZS5cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZ2xvYmFsWydEYXRlJ10gPT09IEZha2VEYXRlKSB7XG4gICAgICAvLyBhbHJlYWR5IHBhdGNoZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZ2xvYmFsWydEYXRlJ10gPSBGYWtlRGF0ZTtcbiAgICBGYWtlRGF0ZS5wcm90b3R5cGUgPSBPcmlnaW5hbERhdGUucHJvdG90eXBlO1xuXG4gICAgLy8gdHJ5IGNoZWNrIGFuZCByZXNldCB0aW1lcnNcbiAgICAvLyBiZWNhdXNlIGphc21pbmUuY2xvY2soKS5pbnN0YWxsKCkgbWF5XG4gICAgLy8gaGF2ZSByZXBsYWNlZCB0aGUgZ2xvYmFsIHRpbWVyXG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLmNoZWNrVGltZXJQYXRjaCgpO1xuICB9XG5cbiAgc3RhdGljIHJlc2V0RGF0ZSgpIHtcbiAgICBpZiAoZ2xvYmFsWydEYXRlJ10gPT09IEZha2VEYXRlKSB7XG4gICAgICBnbG9iYWxbJ0RhdGUnXSA9IE9yaWdpbmFsRGF0ZTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2hlY2tUaW1lclBhdGNoKCkge1xuICAgIGlmIChnbG9iYWwuc2V0VGltZW91dCAhPT0gdGltZXJzLnNldFRpbWVvdXQpIHtcbiAgICAgIGdsb2JhbC5zZXRUaW1lb3V0ID0gdGltZXJzLnNldFRpbWVvdXQ7XG4gICAgICBnbG9iYWwuY2xlYXJUaW1lb3V0ID0gdGltZXJzLmNsZWFyVGltZW91dDtcbiAgICB9XG4gICAgaWYgKGdsb2JhbC5zZXRJbnRlcnZhbCAhPT0gdGltZXJzLnNldEludGVydmFsKSB7XG4gICAgICBnbG9iYWwuc2V0SW50ZXJ2YWwgPSB0aW1lcnMuc2V0SW50ZXJ2YWw7XG4gICAgICBnbG9iYWwuY2xlYXJJbnRlcnZhbCA9IHRpbWVycy5jbGVhckludGVydmFsO1xuICAgIH1cbiAgfVxuXG4gIGxvY2tEYXRlUGF0Y2goKSB7XG4gICAgdGhpcy5wYXRjaERhdGVMb2NrZWQgPSB0cnVlO1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5wYXRjaERhdGUoKTtcbiAgfVxuICB1bmxvY2tEYXRlUGF0Y2goKSB7XG4gICAgdGhpcy5wYXRjaERhdGVMb2NrZWQgPSBmYWxzZTtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMucmVzZXREYXRlKCk7XG4gIH1cblxuICB0aWNrKG1pbGxpczogbnVtYmVyID0gMCwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IHZvaWQge1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5hc3NlcnRJblpvbmUoKTtcbiAgICB0aGlzLmZsdXNoTWljcm90YXNrcygpO1xuICAgIHRoaXMuX3NjaGVkdWxlci50aWNrKG1pbGxpcywgZG9UaWNrKTtcbiAgICBpZiAodGhpcy5fbGFzdEVycm9yICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXNldExhc3RFcnJvckFuZFRocm93KCk7XG4gICAgfVxuICB9XG5cbiAgZmx1c2hNaWNyb3Rhc2tzKCk6IHZvaWQge1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5hc3NlcnRJblpvbmUoKTtcbiAgICBjb25zdCBmbHVzaEVycm9ycyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9sYXN0RXJyb3IgIT09IG51bGwgfHwgdGhpcy5fdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciBzdG9wIHByb2Nlc3NpbmcgdGhlIG1pY3JvdGFzayBxdWV1ZSBhbmQgcmV0aHJvdyB0aGUgZXJyb3IuXG4gICAgICAgIHRoaXMuX3Jlc2V0TGFzdEVycm9yQW5kVGhyb3coKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlICh0aGlzLl9taWNyb3Rhc2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtaWNyb3Rhc2sgPSB0aGlzLl9taWNyb3Rhc2tzLnNoaWZ0KCkhO1xuICAgICAgbWljcm90YXNrLmZ1bmMuYXBwbHkobWljcm90YXNrLnRhcmdldCwgbWljcm90YXNrLmFyZ3MpO1xuICAgIH1cbiAgICBmbHVzaEVycm9ycygpO1xuICB9XG5cbiAgZmx1c2gobGltaXQ/OiBudW1iZXIsIGZsdXNoUGVyaW9kaWM/OiBib29sZWFuLCBkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuYXNzZXJ0SW5ab25lKCk7XG4gICAgdGhpcy5mbHVzaE1pY3JvdGFza3MoKTtcbiAgICBjb25zdCBlbGFwc2VkID0gdGhpcy5fc2NoZWR1bGVyLmZsdXNoKGxpbWl0LCBmbHVzaFBlcmlvZGljLCBkb1RpY2spO1xuICAgIGlmICh0aGlzLl9sYXN0RXJyb3IgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3Jlc2V0TGFzdEVycm9yQW5kVGhyb3coKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsYXBzZWQ7XG4gIH1cblxuICAvLyBab25lU3BlYyBpbXBsZW1lbnRhdGlvbiBiZWxvdy5cblxuICBuYW1lOiBzdHJpbmc7XG5cbiAgcHJvcGVydGllczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7J0Zha2VBc3luY1Rlc3Rab25lU3BlYyc6IHRoaXN9O1xuXG4gIG9uU2NoZWR1bGVUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgdGFzazogVGFzayk6IFRhc2sge1xuICAgIHN3aXRjaCAodGFzay50eXBlKSB7XG4gICAgICBjYXNlICdtaWNyb1Rhc2snOlxuICAgICAgICBsZXQgYXJncyA9IHRhc2suZGF0YSAmJiAodGFzay5kYXRhIGFzIGFueSkuYXJncztcbiAgICAgICAgLy8gc2hvdWxkIHBhc3MgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gY2FsbGJhY2sgaWYgaGF2ZSBhbnlcbiAgICAgICAgLy8gY3VycmVudGx5IHdlIGtub3cgcHJvY2Vzcy5uZXh0VGljayB3aWxsIGhhdmUgc3VjaCBhZGRpdGlvbmFsXG4gICAgICAgIC8vIGFyZ3VtZW50c1xuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3M6IGFueVtdfHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tJbmRleCA9ICh0YXNrLmRhdGEgYXMgYW55KS5jYklkeDtcbiAgICAgICAgICBpZiAodHlwZW9mIGFyZ3MubGVuZ3RoID09PSAnbnVtYmVyJyAmJiBhcmdzLmxlbmd0aCA+IGNhbGxiYWNrSW5kZXggKyAxKSB7XG4gICAgICAgICAgICBhZGRpdGlvbmFsQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIGNhbGxiYWNrSW5kZXggKyAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWljcm90YXNrcy5wdXNoKHtcbiAgICAgICAgICBmdW5jOiB0YXNrLmludm9rZSxcbiAgICAgICAgICBhcmdzOiBhZGRpdGlvbmFsQXJncyxcbiAgICAgICAgICB0YXJnZXQ6IHRhc2suZGF0YSAmJiAodGFzay5kYXRhIGFzIGFueSkudGFyZ2V0XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hY3JvVGFzayc6XG4gICAgICAgIHN3aXRjaCAodGFzay5zb3VyY2UpIHtcbiAgICAgICAgICBjYXNlICdzZXRUaW1lb3V0JzpcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCB0YXNrLmRhdGEhWydkZWxheSddISxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMikpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2V0SW1tZWRpYXRlJzpcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCAwLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2V0SW50ZXJ2YWwnOlxuICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldEludGVydmFsKFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCB0YXNrLmRhdGEhWydkZWxheSddISxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMikpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnWE1MSHR0cFJlcXVlc3Quc2VuZCc6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ0Nhbm5vdCBtYWtlIFhIUnMgZnJvbSB3aXRoaW4gYSBmYWtlIGFzeW5jIHRlc3QuIFJlcXVlc3QgVVJMOiAnICtcbiAgICAgICAgICAgICAgICAodGFzay5kYXRhIGFzIGFueSlbJ3VybCddKTtcbiAgICAgICAgICBjYXNlICdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgICAgIGNhc2UgJ3dlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICAgICAgY2FzZSAnbW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgICAgICAgIC8vIFNpbXVsYXRlIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJ5IHVzaW5nIGEgc2V0VGltZW91dCB3aXRoIDE2IG1zLlxuICAgICAgICAgICAgLy8gKDYwIGZyYW1lcyBwZXIgc2Vjb25kKVxuICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgdGFzay5pbnZva2UsIDE2LCAodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSxcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrUGVuZGluZ1JlcXVlc3RBbmltYXRpb25GcmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gdXNlciBjYW4gZGVmaW5lIHdoaWNoIG1hY3JvVGFzayB0aGV5IHdhbnQgdG8gc3VwcG9ydCBieSBwYXNzaW5nXG4gICAgICAgICAgICAvLyBtYWNyb1Rhc2tPcHRpb25zXG4gICAgICAgICAgICBjb25zdCBtYWNyb1Rhc2tPcHRpb24gPSB0aGlzLmZpbmRNYWNyb1Rhc2tPcHRpb24odGFzayk7XG4gICAgICAgICAgICBpZiAobWFjcm9UYXNrT3B0aW9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0YXNrLmRhdGEgJiYgKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ107XG4gICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gYXJncyAmJiBhcmdzLmxlbmd0aCA+IDEgPyBhcmdzWzFdIDogMDtcbiAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrQXJncyA9IG1hY3JvVGFza09wdGlvbi5jYWxsYmFja0FyZ3MgPyBtYWNyb1Rhc2tPcHRpb24uY2FsbGJhY2tBcmdzIDogYXJncztcbiAgICAgICAgICAgICAgaWYgKCEhbWFjcm9UYXNrT3B0aW9uLmlzUGVyaW9kaWMpIHtcbiAgICAgICAgICAgICAgICAvLyBwZXJpb2RpYyBtYWNyb1Rhc2ssIHVzZSBzZXRJbnRlcnZhbCB0byBzaW11bGF0ZVxuICAgICAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRJbnRlcnZhbCh0YXNrLmludm9rZSwgZGVsYXksIGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgICAgICAgdGFzay5kYXRhIS5pc1BlcmlvZGljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBub3QgcGVyaW9kaWMsIHVzZSBzZXRUaW1lb3V0IHRvIHNpbXVsYXRlXG4gICAgICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldFRpbWVvdXQodGFzay5pbnZva2UsIGRlbGF5LCBjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1hY3JvVGFzayBzY2hlZHVsZWQgaW4gZmFrZSBhc3luYyB0ZXN0OiAnICsgdGFzay5zb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXZlbnRUYXNrJzpcbiAgICAgICAgdGFzayA9IGRlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXQsIHRhc2spO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cblxuICBvbkNhbmNlbFRhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrKTogYW55IHtcbiAgICBzd2l0Y2ggKHRhc2suc291cmNlKSB7XG4gICAgICBjYXNlICdzZXRUaW1lb3V0JzpcbiAgICAgIGNhc2UgJ3JlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICBjYXNlICd3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgY2FzZSAnbW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsZWFyVGltZW91dCg8bnVtYmVyPnRhc2suZGF0YSFbJ2hhbmRsZUlkJ10pO1xuICAgICAgY2FzZSAnc2V0SW50ZXJ2YWwnOlxuICAgICAgICByZXR1cm4gdGhpcy5fY2xlYXJJbnRlcnZhbCg8bnVtYmVyPnRhc2suZGF0YSFbJ2hhbmRsZUlkJ10pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gdXNlciBjYW4gZGVmaW5lIHdoaWNoIG1hY3JvVGFzayB0aGV5IHdhbnQgdG8gc3VwcG9ydCBieSBwYXNzaW5nXG4gICAgICAgIC8vIG1hY3JvVGFza09wdGlvbnNcbiAgICAgICAgY29uc3QgbWFjcm9UYXNrT3B0aW9uID0gdGhpcy5maW5kTWFjcm9UYXNrT3B0aW9uKHRhc2spO1xuICAgICAgICBpZiAobWFjcm9UYXNrT3B0aW9uKSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlSWQ6IG51bWJlciA9IDxudW1iZXI+dGFzay5kYXRhIVsnaGFuZGxlSWQnXTtcbiAgICAgICAgICByZXR1cm4gbWFjcm9UYXNrT3B0aW9uLmlzUGVyaW9kaWMgPyB0aGlzLl9jbGVhckludGVydmFsKGhhbmRsZUlkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJUaW1lb3V0KGhhbmRsZUlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXQsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIG9uSW52b2tlKFxuICAgICAgZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCBjYWxsYmFjazogRnVuY3Rpb24sIGFwcGx5VGhpczogYW55LFxuICAgICAgYXBwbHlBcmdzPzogYW55W10sIHNvdXJjZT86IHN0cmluZyk6IGFueSB7XG4gICAgdHJ5IHtcbiAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5wYXRjaERhdGUoKTtcbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5pbnZva2UodGFyZ2V0LCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghdGhpcy5wYXRjaERhdGVMb2NrZWQpIHtcbiAgICAgICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLnJlc2V0RGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmRNYWNyb1Rhc2tPcHRpb24odGFzazogVGFzaykge1xuICAgIGlmICghdGhpcy5tYWNyb1Rhc2tPcHRpb25zKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hY3JvVGFza09wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1hY3JvVGFza09wdGlvbiA9IHRoaXMubWFjcm9UYXNrT3B0aW9uc1tpXTtcbiAgICAgIGlmIChtYWNyb1Rhc2tPcHRpb24uc291cmNlID09PSB0YXNrLnNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbWFjcm9UYXNrT3B0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG9uSGFuZGxlRXJyb3IocGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCBlcnJvcjogYW55KTpcbiAgICAgIGJvb2xlYW4ge1xuICAgIHRoaXMuX2xhc3RFcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBmYWxzZTsgIC8vIERvbid0IHByb3BhZ2F0ZSBlcnJvciB0byBwYXJlbnQgem9uZS5cbiAgfVxufVxuXG4vLyBFeHBvcnQgdGhlIGNsYXNzIHNvIHRoYXQgbmV3IGluc3RhbmNlcyBjYW4gYmUgY3JlYXRlZCB3aXRoIHByb3BlclxuLy8gY29uc3RydWN0b3IgcGFyYW1zLlxuKFpvbmUgYXMgYW55KVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ10gPSBGYWtlQXN5bmNUZXN0Wm9uZVNwZWM7XG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB3aW5kb3cgfHwgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGYgfHwgZ2xvYmFsKTtcbiJdfQ==