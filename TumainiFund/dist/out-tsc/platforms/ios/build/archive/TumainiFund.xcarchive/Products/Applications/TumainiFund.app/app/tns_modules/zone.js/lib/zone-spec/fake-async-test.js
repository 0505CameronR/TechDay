/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (global) {
    var OriginalDate = global.Date;
    var FakeDate = /** @class */ (function () {
        function FakeDate() {
            if (arguments.length === 0) {
                var d = new OriginalDate();
                d.setTime(FakeDate.now());
                return d;
            }
            else {
                var args = Array.prototype.slice.call(arguments);
                return new (OriginalDate.bind.apply(OriginalDate, [void 0].concat(args)))();
            }
        }
        FakeDate.now = function () {
            var fakeAsyncTestZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
            if (fakeAsyncTestZoneSpec) {
                return fakeAsyncTestZoneSpec.getCurrentRealTime() + fakeAsyncTestZoneSpec.getCurrentTime();
            }
            return OriginalDate.now.apply(this, arguments);
        };
        return FakeDate;
    }());
    FakeDate.UTC = OriginalDate.UTC;
    FakeDate.parse = OriginalDate.parse;
    // keep a reference for zone patched timer function
    var timers = {
        setTimeout: global.setTimeout,
        setInterval: global.setInterval,
        clearTimeout: global.clearTimeout,
        clearInterval: global.clearInterval
    };
    var Scheduler = /** @class */ (function () {
        function Scheduler() {
            // Next scheduler id.
            this.nextId = 1;
            // Scheduler queue with the tuple of end time and callback function - sorted by end time.
            this._schedulerQueue = [];
            // Current simulated time in millis.
            this._currentTime = 0;
            // Current real time in millis.
            this._currentRealTime = OriginalDate.now();
        }
        Scheduler.prototype.getCurrentTime = function () {
            return this._currentTime;
        };
        Scheduler.prototype.getCurrentRealTime = function () {
            return this._currentRealTime;
        };
        Scheduler.prototype.setCurrentRealTime = function (realTime) {
            this._currentRealTime = realTime;
        };
        Scheduler.prototype.scheduleFunction = function (cb, delay, args, isPeriodic, isRequestAnimationFrame, id) {
            if (args === void 0) { args = []; }
            if (isPeriodic === void 0) { isPeriodic = false; }
            if (isRequestAnimationFrame === void 0) { isRequestAnimationFrame = false; }
            if (id === void 0) { id = -1; }
            var currentId = id < 0 ? this.nextId++ : id;
            var endTime = this._currentTime + delay;
            // Insert so that scheduler queue remains sorted by end time.
            var newEntry = {
                endTime: endTime,
                id: currentId,
                func: cb,
                args: args,
                delay: delay,
                isPeriodic: isPeriodic,
                isRequestAnimationFrame: isRequestAnimationFrame
            };
            var i = 0;
            for (; i < this._schedulerQueue.length; i++) {
                var currentEntry = this._schedulerQueue[i];
                if (newEntry.endTime < currentEntry.endTime) {
                    break;
                }
            }
            this._schedulerQueue.splice(i, 0, newEntry);
            return currentId;
        };
        Scheduler.prototype.removeScheduledFunctionWithId = function (id) {
            for (var i = 0; i < this._schedulerQueue.length; i++) {
                if (this._schedulerQueue[i].id == id) {
                    this._schedulerQueue.splice(i, 1);
                    break;
                }
            }
        };
        Scheduler.prototype.tick = function (millis, doTick) {
            if (millis === void 0) { millis = 0; }
            var finalTime = this._currentTime + millis;
            var lastCurrentTime = 0;
            if (this._schedulerQueue.length === 0 && doTick) {
                doTick(millis);
                return;
            }
            while (this._schedulerQueue.length > 0) {
                var current = this._schedulerQueue[0];
                if (finalTime < current.endTime) {
                    // Done processing the queue since it's sorted by endTime.
                    break;
                }
                else {
                    // Time to run scheduled function. Remove it from the head of queue.
                    var current_1 = this._schedulerQueue.shift();
                    lastCurrentTime = this._currentTime;
                    this._currentTime = current_1.endTime;
                    if (doTick) {
                        doTick(this._currentTime - lastCurrentTime);
                    }
                    var retval = current_1.func.apply(global, current_1.args);
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
        };
        Scheduler.prototype.flush = function (limit, flushPeriodic, doTick) {
            if (limit === void 0) { limit = 20; }
            if (flushPeriodic === void 0) { flushPeriodic = false; }
            if (flushPeriodic) {
                return this.flushPeriodic(doTick);
            }
            else {
                return this.flushNonPeriodic(limit, doTick);
            }
        };
        Scheduler.prototype.flushPeriodic = function (doTick) {
            if (this._schedulerQueue.length === 0) {
                return 0;
            }
            // Find the last task currently queued in the scheduler queue and tick
            // till that time.
            var startTime = this._currentTime;
            var lastTask = this._schedulerQueue[this._schedulerQueue.length - 1];
            this.tick(lastTask.endTime - startTime, doTick);
            return this._currentTime - startTime;
        };
        Scheduler.prototype.flushNonPeriodic = function (limit, doTick) {
            var startTime = this._currentTime;
            var lastCurrentTime = 0;
            var count = 0;
            while (this._schedulerQueue.length > 0) {
                count++;
                if (count > limit) {
                    throw new Error('flush failed after reaching the limit of ' + limit +
                        ' tasks. Does your code use a polling timeout?');
                }
                // flush only non-periodic timers.
                // If the only remaining tasks are periodic(or requestAnimationFrame), finish flushing.
                if (this._schedulerQueue.filter(function (task) { return !task.isPeriodic && !task.isRequestAnimationFrame; })
                    .length === 0) {
                    break;
                }
                var current = this._schedulerQueue.shift();
                lastCurrentTime = this._currentTime;
                this._currentTime = current.endTime;
                if (doTick) {
                    // Update any secondary schedulers like Jasmine mock Date.
                    doTick(this._currentTime - lastCurrentTime);
                }
                var retval = current.func.apply(global, current.args);
                if (!retval) {
                    // Uncaught exception in the current scheduled function. Stop processing the queue.
                    break;
                }
            }
            return this._currentTime - startTime;
        };
        return Scheduler;
    }());
    var FakeAsyncTestZoneSpec = /** @class */ (function () {
        function FakeAsyncTestZoneSpec(namePrefix, trackPendingRequestAnimationFrame, macroTaskOptions) {
            if (trackPendingRequestAnimationFrame === void 0) { trackPendingRequestAnimationFrame = false; }
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
        FakeAsyncTestZoneSpec.assertInZone = function () {
            if (Zone.current.get('FakeAsyncTestZoneSpec') == null) {
                throw new Error('The code should be running in the fakeAsync zone to call this function');
            }
        };
        FakeAsyncTestZoneSpec.prototype._fnAndFlush = function (fn, completers) {
            var _this = this;
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                fn.apply(global, args);
                if (_this._lastError === null) { // Success
                    if (completers.onSuccess != null) {
                        completers.onSuccess.apply(global);
                    }
                    // Flush microtasks only on success.
                    _this.flushMicrotasks();
                }
                else { // Failure
                    if (completers.onError != null) {
                        completers.onError.apply(global);
                    }
                }
                // Return true if there were no errors, false otherwise.
                return _this._lastError === null;
            };
        };
        FakeAsyncTestZoneSpec._removeTimer = function (timers, id) {
            var index = timers.indexOf(id);
            if (index > -1) {
                timers.splice(index, 1);
            }
        };
        FakeAsyncTestZoneSpec.prototype._dequeueTimer = function (id) {
            var _this = this;
            return function () {
                FakeAsyncTestZoneSpec._removeTimer(_this.pendingTimers, id);
            };
        };
        FakeAsyncTestZoneSpec.prototype._requeuePeriodicTimer = function (fn, interval, args, id) {
            var _this = this;
            return function () {
                // Requeue the timer callback if it's not been canceled.
                if (_this.pendingPeriodicTimers.indexOf(id) !== -1) {
                    _this._scheduler.scheduleFunction(fn, interval, args, true, false, id);
                }
            };
        };
        FakeAsyncTestZoneSpec.prototype._dequeuePeriodicTimer = function (id) {
            var _this = this;
            return function () {
                FakeAsyncTestZoneSpec._removeTimer(_this.pendingPeriodicTimers, id);
            };
        };
        FakeAsyncTestZoneSpec.prototype._setTimeout = function (fn, delay, args, isTimer) {
            if (isTimer === void 0) { isTimer = true; }
            var removeTimerFn = this._dequeueTimer(this._scheduler.nextId);
            // Queue the callback and dequeue the timer on success and error.
            var cb = this._fnAndFlush(fn, { onSuccess: removeTimerFn, onError: removeTimerFn });
            var id = this._scheduler.scheduleFunction(cb, delay, args, false, !isTimer);
            if (isTimer) {
                this.pendingTimers.push(id);
            }
            return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearTimeout = function (id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._setInterval = function (fn, interval, args) {
            var id = this._scheduler.nextId;
            var completers = { onSuccess: null, onError: this._dequeuePeriodicTimer(id) };
            var cb = this._fnAndFlush(fn, completers);
            // Use the callback created above to requeue on success.
            completers.onSuccess = this._requeuePeriodicTimer(cb, interval, args, id);
            // Queue the callback and dequeue the periodic timer only on error.
            this._scheduler.scheduleFunction(cb, interval, args, true);
            this.pendingPeriodicTimers.push(id);
            return id;
        };
        FakeAsyncTestZoneSpec.prototype._clearInterval = function (id) {
            FakeAsyncTestZoneSpec._removeTimer(this.pendingPeriodicTimers, id);
            this._scheduler.removeScheduledFunctionWithId(id);
        };
        FakeAsyncTestZoneSpec.prototype._resetLastErrorAndThrow = function () {
            var error = this._lastError || this._uncaughtPromiseErrors[0];
            this._uncaughtPromiseErrors.length = 0;
            this._lastError = null;
            throw error;
        };
        FakeAsyncTestZoneSpec.prototype.getCurrentTime = function () {
            return this._scheduler.getCurrentTime();
        };
        FakeAsyncTestZoneSpec.prototype.getCurrentRealTime = function () {
            return this._scheduler.getCurrentRealTime();
        };
        FakeAsyncTestZoneSpec.prototype.setCurrentRealTime = function (realTime) {
            this._scheduler.setCurrentRealTime(realTime);
        };
        FakeAsyncTestZoneSpec.patchDate = function () {
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
        };
        FakeAsyncTestZoneSpec.resetDate = function () {
            if (global['Date'] === FakeDate) {
                global['Date'] = OriginalDate;
            }
        };
        FakeAsyncTestZoneSpec.checkTimerPatch = function () {
            if (global.setTimeout !== timers.setTimeout) {
                global.setTimeout = timers.setTimeout;
                global.clearTimeout = timers.clearTimeout;
            }
            if (global.setInterval !== timers.setInterval) {
                global.setInterval = timers.setInterval;
                global.clearInterval = timers.clearInterval;
            }
        };
        FakeAsyncTestZoneSpec.prototype.lockDatePatch = function () {
            this.patchDateLocked = true;
            FakeAsyncTestZoneSpec.patchDate();
        };
        FakeAsyncTestZoneSpec.prototype.unlockDatePatch = function () {
            this.patchDateLocked = false;
            FakeAsyncTestZoneSpec.resetDate();
        };
        FakeAsyncTestZoneSpec.prototype.tick = function (millis, doTick) {
            if (millis === void 0) { millis = 0; }
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            this._scheduler.tick(millis, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
        };
        FakeAsyncTestZoneSpec.prototype.flushMicrotasks = function () {
            var _this = this;
            FakeAsyncTestZoneSpec.assertInZone();
            var flushErrors = function () {
                if (_this._lastError !== null || _this._uncaughtPromiseErrors.length) {
                    // If there is an error stop processing the microtask queue and rethrow the error.
                    _this._resetLastErrorAndThrow();
                }
            };
            while (this._microtasks.length > 0) {
                var microtask = this._microtasks.shift();
                microtask.func.apply(microtask.target, microtask.args);
            }
            flushErrors();
        };
        FakeAsyncTestZoneSpec.prototype.flush = function (limit, flushPeriodic, doTick) {
            FakeAsyncTestZoneSpec.assertInZone();
            this.flushMicrotasks();
            var elapsed = this._scheduler.flush(limit, flushPeriodic, doTick);
            if (this._lastError !== null) {
                this._resetLastErrorAndThrow();
            }
            return elapsed;
        };
        FakeAsyncTestZoneSpec.prototype.onScheduleTask = function (delegate, current, target, task) {
            switch (task.type) {
                case 'microTask':
                    var args = task.data && task.data.args;
                    // should pass additional arguments to callback if have any
                    // currently we know process.nextTick will have such additional
                    // arguments
                    var additionalArgs = void 0;
                    if (args) {
                        var callbackIndex = task.data.cbIdx;
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
                            var macroTaskOption = this.findMacroTaskOption(task);
                            if (macroTaskOption) {
                                var args_1 = task.data && task.data['args'];
                                var delay = args_1 && args_1.length > 1 ? args_1[1] : 0;
                                var callbackArgs = macroTaskOption.callbackArgs ? macroTaskOption.callbackArgs : args_1;
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
        };
        FakeAsyncTestZoneSpec.prototype.onCancelTask = function (delegate, current, target, task) {
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
                    var macroTaskOption = this.findMacroTaskOption(task);
                    if (macroTaskOption) {
                        var handleId = task.data['handleId'];
                        return macroTaskOption.isPeriodic ? this._clearInterval(handleId) :
                            this._clearTimeout(handleId);
                    }
                    return delegate.cancelTask(target, task);
            }
        };
        FakeAsyncTestZoneSpec.prototype.onInvoke = function (delegate, current, target, callback, applyThis, applyArgs, source) {
            try {
                FakeAsyncTestZoneSpec.patchDate();
                return delegate.invoke(target, callback, applyThis, applyArgs, source);
            }
            finally {
                if (!this.patchDateLocked) {
                    FakeAsyncTestZoneSpec.resetDate();
                }
            }
        };
        FakeAsyncTestZoneSpec.prototype.findMacroTaskOption = function (task) {
            if (!this.macroTaskOptions) {
                return null;
            }
            for (var i = 0; i < this.macroTaskOptions.length; i++) {
                var macroTaskOption = this.macroTaskOptions[i];
                if (macroTaskOption.source === task.source) {
                    return macroTaskOption;
                }
            }
            return null;
        };
        FakeAsyncTestZoneSpec.prototype.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error) {
            this._lastError = error;
            return false; // Don't propagate error to parent zone.
        };
        return FakeAsyncTestZoneSpec;
    }());
    // Export the class so that new instances can be created with proper
    // constructor params.
    Zone['FakeAsyncTestZoneSpec'] = FakeAsyncTestZoneSpec;
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1hc3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi96b25lLXNwZWMvZmFrZS1hc3luYy10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILENBQUMsVUFBUyxNQUFXO0lBdUJyQixJQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2pDO1FBQ0U7WUFDRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO2dCQUMxQixJQUFNLENBQUMsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO2dCQUM3QixDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO2dCQUMxQixPQUFPLENBQUMsQ0FBQzthQUNWO2lCQUFNO2dCQUNMLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFDbkQsWUFBVyxZQUFZLFlBQVosWUFBWSxrQkFBSSxJQUFJLE1BQUU7YUFDbEM7UUFDSCxDQUFDO1FBRU0sWUFBRyxHQUFWO1lBQ0UsSUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO1lBQ3hFLElBQUkscUJBQXFCLEVBQUU7Z0JBQ3pCLE9BQU8scUJBQXFCLENBQUMsa0JBQWtCLEVBQUUsR0FBRyxxQkFBcUIsQ0FBQyxjQUFjLEVBQUUsQ0FBQzthQUM1RjtZQUNELE9BQU8sWUFBWSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMs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QyxDQUFDO2dCQUNqRCxJQUFJLGVBQWUsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLE1BQU0sRUFBRTtvQkFDMUMsT0FBTyxlQUFlLENBQUM7aUJBQ3hCO2FBQ0Y7WUFDRCxPQUFPLElBQUksQ0FBQztRQUNkLENBQUM7UUFFRCw2Q0FBYSxHQUFiLFVBQWMsa0JBQWdDLEVBQUUsV0FBaUIsRUFBRSxVQUFnQixFQUFFLEtBQVU7WUFFN0YsSUFBSSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUM7WUFDeEIsT0FBTyxLQUFLLENBQUMsQ0FBRSx3Q0FBd0M7UUFDekQsQ0FBQztRQUNILDRCQUFDO0lBQUQsQ0FBQyxBQXRWRCxJQXNWQztJQUVELG9FQUFvRTtJQUNwRSxzQkFBc0I7SUFDckIsSUFBWSxDQUFDLHVCQUF1QixDQUFDLEdBQUcscUJBQXFCLENBQUM7QUFDL0QsQ0FBQyxDQUFDLENBQUMsT0FBTyxNQUFNLEtBQUssUUFBUSxJQUFJLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsOiBhbnkpIHtcbmludGVyZmFjZSBTY2hlZHVsZWRGdW5jdGlvbiB7XG4gIGVuZFRpbWU6IG51bWJlcjtcbiAgaWQ6IG51bWJlcjtcbiAgZnVuYzogRnVuY3Rpb247XG4gIGFyZ3M6IGFueVtdO1xuICBkZWxheTogbnVtYmVyO1xuICBpc1BlcmlvZGljOiBib29sZWFuO1xuICBpc1JlcXVlc3RBbmltYXRpb25GcmFtZTogYm9vbGVhbjtcbn1cblxuaW50ZXJmYWNlIE1pY3JvVGFza1NjaGVkdWxlZEZ1bmN0aW9uIHtcbiAgZnVuYzogRnVuY3Rpb247XG4gIGFyZ3M/OiBhbnlbXTtcbiAgdGFyZ2V0OiBhbnk7XG59XG5cbmludGVyZmFjZSBNYWNyb1Rhc2tPcHRpb25zIHtcbiAgc291cmNlOiBzdHJpbmc7XG4gIGlzUGVyaW9kaWM/OiBib29sZWFuO1xuICBjYWxsYmFja0FyZ3M/OiBhbnk7XG59XG5cbmNvbnN0IE9yaWdpbmFsRGF0ZSA9IGdsb2JhbC5EYXRlO1xuY2xhc3MgRmFrZURhdGUge1xuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY29uc3QgZCA9IG5ldyBPcmlnaW5hbERhdGUoKTtcbiAgICAgIGQuc2V0VGltZShGYWtlRGF0ZS5ub3coKSk7XG4gICAgICByZXR1cm4gZDtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICByZXR1cm4gbmV3IE9yaWdpbmFsRGF0ZSguLi5hcmdzKTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgbm93KCkge1xuICAgIGNvbnN0IGZha2VBc3luY1Rlc3Rab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgIGlmIChmYWtlQXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgIHJldHVybiBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMuZ2V0Q3VycmVudFJlYWxUaW1lKCkgKyBmYWtlQXN5bmNUZXN0Wm9uZVNwZWMuZ2V0Q3VycmVudFRpbWUoKTtcbiAgICB9XG4gICAgcmV0dXJuIE9yaWdpbmFsRGF0ZS5ub3cuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfVxufVxuXG4oRmFrZURhdGUgYXMgYW55KS5VVEMgPSBPcmlnaW5hbERhdGUuVVRDO1xuKEZha2VEYXRlIGFzIGFueSkucGFyc2UgPSBPcmlnaW5hbERhdGUucGFyc2U7XG5cbi8vIGtlZXAgYSByZWZlcmVuY2UgZm9yIHpvbmUgcGF0Y2hlZCB0aW1lciBmdW5jdGlvblxuY29uc3QgdGltZXJzID0ge1xuICBzZXRUaW1lb3V0OiBnbG9iYWwuc2V0VGltZW91dCxcbiAgc2V0SW50ZXJ2YWw6IGdsb2JhbC5zZXRJbnRlcnZhbCxcbiAgY2xlYXJUaW1lb3V0OiBnbG9iYWwuY2xlYXJUaW1lb3V0LFxuICBjbGVhckludGVydmFsOiBnbG9iYWwuY2xlYXJJbnRlcnZhbFxufTtcblxuY2xhc3MgU2NoZWR1bGVyIHtcbiAgLy8gTmV4dCBzY2hlZHVsZXIgaWQuXG4gIHB1YmxpYyBuZXh0SWQ6IG51bWJlciA9IDE7XG5cbiAgLy8gU2NoZWR1bGVyIHF1ZXVlIHdpdGggdGhlIHR1cGxlIG9mIGVuZCB0aW1lIGFuZCBjYWxsYmFjayBmdW5jdGlvbiAtIHNvcnRlZCBieSBlbmQgdGltZS5cbiAgcHJpdmF0ZSBfc2NoZWR1bGVyUXVldWU6IFNjaGVkdWxlZEZ1bmN0aW9uW10gPSBbXTtcbiAgLy8gQ3VycmVudCBzaW11bGF0ZWQgdGltZSBpbiBtaWxsaXMuXG4gIHByaXZhdGUgX2N1cnJlbnRUaW1lOiBudW1iZXIgPSAwO1xuICAvLyBDdXJyZW50IHJlYWwgdGltZSBpbiBtaWxsaXMuXG4gIHByaXZhdGUgX2N1cnJlbnRSZWFsVGltZTogbnVtYmVyID0gT3JpZ2luYWxEYXRlLm5vdygpO1xuXG4gIGNvbnN0cnVjdG9yKCkge31cblxuICBnZXRDdXJyZW50VGltZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fY3VycmVudFRpbWU7XG4gIH1cblxuICBnZXRDdXJyZW50UmVhbFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRSZWFsVGltZTtcbiAgfVxuXG4gIHNldEN1cnJlbnRSZWFsVGltZShyZWFsVGltZTogbnVtYmVyKSB7XG4gICAgdGhpcy5fY3VycmVudFJlYWxUaW1lID0gcmVhbFRpbWU7XG4gIH1cblxuICBzY2hlZHVsZUZ1bmN0aW9uKFxuICAgICAgY2I6IEZ1bmN0aW9uLCBkZWxheTogbnVtYmVyLCBhcmdzOiBhbnlbXSA9IFtdLCBpc1BlcmlvZGljOiBib29sZWFuID0gZmFsc2UsXG4gICAgICBpc1JlcXVlc3RBbmltYXRpb25GcmFtZTogYm9vbGVhbiA9IGZhbHNlLCBpZDogbnVtYmVyID0gLTEpOiBudW1iZXIge1xuICAgIGxldCBjdXJyZW50SWQ6IG51bWJlciA9IGlkIDwgMCA/IHRoaXMubmV4dElkKysgOiBpZDtcbiAgICBsZXQgZW5kVGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lICsgZGVsYXk7XG5cbiAgICAvLyBJbnNlcnQgc28gdGhhdCBzY2hlZHVsZXIgcXVldWUgcmVtYWlucyBzb3J0ZWQgYnkgZW5kIHRpbWUuXG4gICAgbGV0IG5ld0VudHJ5OiBTY2hlZHVsZWRGdW5jdGlvbiA9IHtcbiAgICAgIGVuZFRpbWU6IGVuZFRpbWUsXG4gICAgICBpZDogY3VycmVudElkLFxuICAgICAgZnVuYzogY2IsXG4gICAgICBhcmdzOiBhcmdzLFxuICAgICAgZGVsYXk6IGRlbGF5LFxuICAgICAgaXNQZXJpb2RpYzogaXNQZXJpb2RpYyxcbiAgICAgIGlzUmVxdWVzdEFuaW1hdGlvbkZyYW1lOiBpc1JlcXVlc3RBbmltYXRpb25GcmFtZVxuICAgIH07XG4gICAgbGV0IGkgPSAwO1xuICAgIGZvciAoOyBpIDwgdGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxldCBjdXJyZW50RW50cnkgPSB0aGlzLl9zY2hlZHVsZXJRdWV1ZVtpXTtcbiAgICAgIGlmIChuZXdFbnRyeS5lbmRUaW1lIDwgY3VycmVudEVudHJ5LmVuZFRpbWUpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuX3NjaGVkdWxlclF1ZXVlLnNwbGljZShpLCAwLCBuZXdFbnRyeSk7XG4gICAgcmV0dXJuIGN1cnJlbnRJZDtcbiAgfVxuXG4gIHJlbW92ZVNjaGVkdWxlZEZ1bmN0aW9uV2l0aElkKGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fc2NoZWR1bGVyUXVldWVbaV0uaWQgPT0gaWQpIHtcbiAgICAgICAgdGhpcy5fc2NoZWR1bGVyUXVldWUuc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICB0aWNrKG1pbGxpczogbnVtYmVyID0gMCwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IHZvaWQge1xuICAgIGxldCBmaW5hbFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZSArIG1pbGxpcztcbiAgICBsZXQgbGFzdEN1cnJlbnRUaW1lID0gMDtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoID09PSAwICYmIGRvVGljaykge1xuICAgICAgZG9UaWNrKG1pbGxpcyk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHdoaWxlICh0aGlzLl9zY2hlZHVsZXJRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgY3VycmVudCA9IHRoaXMuX3NjaGVkdWxlclF1ZXVlWzBdO1xuICAgICAgaWYgKGZpbmFsVGltZSA8IGN1cnJlbnQuZW5kVGltZSkge1xuICAgICAgICAvLyBEb25lIHByb2Nlc3NpbmcgdGhlIHF1ZXVlIHNpbmNlIGl0J3Mgc29ydGVkIGJ5IGVuZFRpbWUuXG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gVGltZSB0byBydW4gc2NoZWR1bGVkIGZ1bmN0aW9uLiBSZW1vdmUgaXQgZnJvbSB0aGUgaGVhZCBvZiBxdWV1ZS5cbiAgICAgICAgbGV0IGN1cnJlbnQgPSB0aGlzLl9zY2hlZHVsZXJRdWV1ZS5zaGlmdCgpITtcbiAgICAgICAgbGFzdEN1cnJlbnRUaW1lID0gdGhpcy5fY3VycmVudFRpbWU7XG4gICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gY3VycmVudC5lbmRUaW1lO1xuICAgICAgICBpZiAoZG9UaWNrKSB7XG4gICAgICAgICAgZG9UaWNrKHRoaXMuX2N1cnJlbnRUaW1lIC0gbGFzdEN1cnJlbnRUaW1lKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmV0dmFsID0gY3VycmVudC5mdW5jLmFwcGx5KGdsb2JhbCwgY3VycmVudC5hcmdzKTtcbiAgICAgICAgaWYgKCFyZXR2YWwpIHtcbiAgICAgICAgICAvLyBVbmNhdWdodCBleGNlcHRpb24gaW4gdGhlIGN1cnJlbnQgc2NoZWR1bGVkIGZ1bmN0aW9uLiBTdG9wIHByb2Nlc3NpbmcgdGhlIHF1ZXVlLlxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGxhc3RDdXJyZW50VGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lO1xuICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gZmluYWxUaW1lO1xuICAgIGlmIChkb1RpY2spIHtcbiAgICAgIGRvVGljayh0aGlzLl9jdXJyZW50VGltZSAtIGxhc3RDdXJyZW50VGltZSk7XG4gICAgfVxuICB9XG5cbiAgZmx1c2gobGltaXQgPSAyMCwgZmx1c2hQZXJpb2RpYyA9IGZhbHNlLCBkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBpZiAoZmx1c2hQZXJpb2RpYykge1xuICAgICAgcmV0dXJuIHRoaXMuZmx1c2hQZXJpb2RpYyhkb1RpY2spO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5mbHVzaE5vblBlcmlvZGljKGxpbWl0LCBkb1RpY2spO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZmx1c2hQZXJpb2RpYyhkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBpZiAodGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gMDtcbiAgICB9XG4gICAgLy8gRmluZCB0aGUgbGFzdCB0YXNrIGN1cnJlbnRseSBxdWV1ZWQgaW4gdGhlIHNjaGVkdWxlciBxdWV1ZSBhbmQgdGlja1xuICAgIC8vIHRpbGwgdGhhdCB0aW1lLlxuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lO1xuICAgIGNvbnN0IGxhc3RUYXNrID0gdGhpcy5fc2NoZWR1bGVyUXVldWVbdGhpcy5fc2NoZWR1bGVyUXVldWUubGVuZ3RoIC0gMV07XG4gICAgdGhpcy50aWNrKGxhc3RUYXNrLmVuZFRpbWUgLSBzdGFydFRpbWUsIGRvVGljayk7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnRUaW1lIC0gc3RhcnRUaW1lO1xuICB9XG5cbiAgcHJpdmF0ZSBmbHVzaE5vblBlcmlvZGljKGxpbWl0OiBudW1iZXIsIGRvVGljaz86IChlbGFwc2VkOiBudW1iZXIpID0+IHZvaWQpOiBudW1iZXIge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHRoaXMuX2N1cnJlbnRUaW1lO1xuICAgIGxldCBsYXN0Q3VycmVudFRpbWUgPSAwO1xuICAgIGxldCBjb3VudCA9IDA7XG4gICAgd2hpbGUgKHRoaXMuX3NjaGVkdWxlclF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvdW50Kys7XG4gICAgICBpZiAoY291bnQgPiBsaW1pdCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAnZmx1c2ggZmFpbGVkIGFmdGVyIHJlYWNoaW5nIHRoZSBsaW1pdCBvZiAnICsgbGltaXQgK1xuICAgICAgICAgICAgJyB0YXNrcy4gRG9lcyB5b3VyIGNvZGUgdXNlIGEgcG9sbGluZyB0aW1lb3V0PycpO1xuICAgICAgfVxuXG4gICAgICAvLyBmbHVzaCBvbmx5IG5vbi1wZXJpb2RpYyB0aW1lcnMuXG4gICAgICAvLyBJZiB0aGUgb25seSByZW1haW5pbmcgdGFza3MgYXJlIHBlcmlvZGljKG9yIHJlcXVlc3RBbmltYXRpb25GcmFtZSksIGZpbmlzaCBmbHVzaGluZy5cbiAgICAgIGlmICh0aGlzLl9zY2hlZHVsZXJRdWV1ZS5maWx0ZXIodGFzayA9PiAhdGFzay5pc1BlcmlvZGljICYmICF0YXNrLmlzUmVxdWVzdEFuaW1hdGlvbkZyYW1lKVxuICAgICAgICAgICAgICAubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBjdXJyZW50ID0gdGhpcy5fc2NoZWR1bGVyUXVldWUuc2hpZnQoKSE7XG4gICAgICBsYXN0Q3VycmVudFRpbWUgPSB0aGlzLl9jdXJyZW50VGltZTtcbiAgICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gY3VycmVudC5lbmRUaW1lO1xuICAgICAgaWYgKGRvVGljaykge1xuICAgICAgICAvLyBVcGRhdGUgYW55IHNlY29uZGFyeSBzY2hlZHVsZXJzIGxpa2UgSmFzbWluZSBtb2NrIERhdGUuXG4gICAgICAgIGRvVGljayh0aGlzLl9jdXJyZW50VGltZSAtIGxhc3RDdXJyZW50VGltZSk7XG4gICAgICB9XG4gICAgICBjb25zdCByZXR2YWwgPSBjdXJyZW50LmZ1bmMuYXBwbHkoZ2xvYmFsLCBjdXJyZW50LmFyZ3MpO1xuICAgICAgaWYgKCFyZXR2YWwpIHtcbiAgICAgICAgLy8gVW5jYXVnaHQgZXhjZXB0aW9uIGluIHRoZSBjdXJyZW50IHNjaGVkdWxlZCBmdW5jdGlvbi4gU3RvcCBwcm9jZXNzaW5nIHRoZSBxdWV1ZS5cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJyZW50VGltZSAtIHN0YXJ0VGltZTtcbiAgfVxufVxuXG5jbGFzcyBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMgaW1wbGVtZW50cyBab25lU3BlYyB7XG4gIHN0YXRpYyBhc3NlcnRJblpvbmUoKTogdm9pZCB7XG4gICAgaWYgKFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpID09IG51bGwpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIGNvZGUgc2hvdWxkIGJlIHJ1bm5pbmcgaW4gdGhlIGZha2VBc3luYyB6b25lIHRvIGNhbGwgdGhpcyBmdW5jdGlvbicpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3NjaGVkdWxlcjogU2NoZWR1bGVyID0gbmV3IFNjaGVkdWxlcigpO1xuICBwcml2YXRlIF9taWNyb3Rhc2tzOiBNaWNyb1Rhc2tTY2hlZHVsZWRGdW5jdGlvbltdID0gW107XG4gIHByaXZhdGUgX2xhc3RFcnJvcjogRXJyb3J8bnVsbCA9IG51bGw7XG4gIHByaXZhdGUgX3VuY2F1Z2h0UHJvbWlzZUVycm9yczoge3JlamVjdGlvbjogYW55fVtdID1cbiAgICAgIChQcm9taXNlIGFzIGFueSlbKFpvbmUgYXMgYW55KS5fX3N5bWJvbF9fKCd1bmNhdWdodFByb21pc2VFcnJvcnMnKV07XG5cbiAgcGVuZGluZ1BlcmlvZGljVGltZXJzOiBudW1iZXJbXSA9IFtdO1xuICBwZW5kaW5nVGltZXJzOiBudW1iZXJbXSA9IFtdO1xuXG4gIHByaXZhdGUgcGF0Y2hEYXRlTG9ja2VkID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgICBuYW1lUHJlZml4OiBzdHJpbmcsIHByaXZhdGUgdHJhY2tQZW5kaW5nUmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gZmFsc2UsXG4gICAgICBwcml2YXRlIG1hY3JvVGFza09wdGlvbnM/OiBNYWNyb1Rhc2tPcHRpb25zW10pIHtcbiAgICB0aGlzLm5hbWUgPSAnZmFrZUFzeW5jVGVzdFpvbmUgZm9yICcgKyBuYW1lUHJlZml4O1xuICAgIC8vIGluIGNhc2UgdXNlciBjYW4ndCBhY2Nlc3MgdGhlIGNvbnN0cnVjdGlvbiBvZiBGYWtlQXN5bmNUZXN0U3BlY1xuICAgIC8vIHVzZXIgY2FuIGFsc28gZGVmaW5lIG1hY3JvVGFza09wdGlvbnMgYnkgZGVmaW5lIGEgZ2xvYmFsIHZhcmlhYmxlLlxuICAgIGlmICghdGhpcy5tYWNyb1Rhc2tPcHRpb25zKSB7XG4gICAgICB0aGlzLm1hY3JvVGFza09wdGlvbnMgPSBnbG9iYWxbWm9uZS5fX3N5bWJvbF9fKCdGYWtlQXN5bmNUZXN0TWFjcm9UYXNrJyldO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX2ZuQW5kRmx1c2goZm46IEZ1bmN0aW9uLCBjb21wbGV0ZXJzOiB7b25TdWNjZXNzPzogRnVuY3Rpb24sIG9uRXJyb3I/OiBGdW5jdGlvbn0pOlxuICAgICAgRnVuY3Rpb24ge1xuICAgIHJldHVybiAoLi4uYXJnczogYW55W10pOiBib29sZWFuID0+IHtcbiAgICAgIGZuLmFwcGx5KGdsb2JhbCwgYXJncyk7XG5cbiAgICAgIGlmICh0aGlzLl9sYXN0RXJyb3IgPT09IG51bGwpIHsgIC8vIFN1Y2Nlc3NcbiAgICAgICAgaWYgKGNvbXBsZXRlcnMub25TdWNjZXNzICE9IG51bGwpIHtcbiAgICAgICAgICBjb21wbGV0ZXJzLm9uU3VjY2Vzcy5hcHBseShnbG9iYWwpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEZsdXNoIG1pY3JvdGFza3Mgb25seSBvbiBzdWNjZXNzLlxuICAgICAgICB0aGlzLmZsdXNoTWljcm90YXNrcygpO1xuICAgICAgfSBlbHNlIHsgIC8vIEZhaWx1cmVcbiAgICAgICAgaWYgKGNvbXBsZXRlcnMub25FcnJvciAhPSBudWxsKSB7XG4gICAgICAgICAgY29tcGxldGVycy5vbkVycm9yLmFwcGx5KGdsb2JhbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIFJldHVybiB0cnVlIGlmIHRoZXJlIHdlcmUgbm8gZXJyb3JzLCBmYWxzZSBvdGhlcndpc2UuXG4gICAgICByZXR1cm4gdGhpcy5fbGFzdEVycm9yID09PSBudWxsO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBfcmVtb3ZlVGltZXIodGltZXJzOiBudW1iZXJbXSwgaWQ6IG51bWJlcik6IHZvaWQge1xuICAgIGxldCBpbmRleCA9IHRpbWVycy5pbmRleE9mKGlkKTtcbiAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgdGltZXJzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfZGVxdWV1ZVRpbWVyKGlkOiBudW1iZXIpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5fcmVtb3ZlVGltZXIodGhpcy5wZW5kaW5nVGltZXJzLCBpZCk7XG4gICAgfTtcbiAgfVxuXG4gIHByaXZhdGUgX3JlcXVldWVQZXJpb2RpY1RpbWVyKGZuOiBGdW5jdGlvbiwgaW50ZXJ2YWw6IG51bWJlciwgYXJnczogYW55W10sIGlkOiBudW1iZXIpOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIC8vIFJlcXVldWUgdGhlIHRpbWVyIGNhbGxiYWNrIGlmIGl0J3Mgbm90IGJlZW4gY2FuY2VsZWQuXG4gICAgICBpZiAodGhpcy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMuaW5kZXhPZihpZCkgIT09IC0xKSB7XG4gICAgICAgIHRoaXMuX3NjaGVkdWxlci5zY2hlZHVsZUZ1bmN0aW9uKGZuLCBpbnRlcnZhbCwgYXJncywgdHJ1ZSwgZmFsc2UsIGlkKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBfZGVxdWV1ZVBlcmlvZGljVGltZXIoaWQ6IG51bWJlcik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLl9yZW1vdmVUaW1lcih0aGlzLnBlbmRpbmdQZXJpb2RpY1RpbWVycywgaWQpO1xuICAgIH07XG4gIH1cblxuICBwcml2YXRlIF9zZXRUaW1lb3V0KGZuOiBGdW5jdGlvbiwgZGVsYXk6IG51bWJlciwgYXJnczogYW55W10sIGlzVGltZXIgPSB0cnVlKTogbnVtYmVyIHtcbiAgICBsZXQgcmVtb3ZlVGltZXJGbiA9IHRoaXMuX2RlcXVldWVUaW1lcih0aGlzLl9zY2hlZHVsZXIubmV4dElkKTtcbiAgICAvLyBRdWV1ZSB0aGUgY2FsbGJhY2sgYW5kIGRlcXVldWUgdGhlIHRpbWVyIG9uIHN1Y2Nlc3MgYW5kIGVycm9yLlxuICAgIGxldCBjYiA9IHRoaXMuX2ZuQW5kRmx1c2goZm4sIHtvblN1Y2Nlc3M6IHJlbW92ZVRpbWVyRm4sIG9uRXJyb3I6IHJlbW92ZVRpbWVyRm59KTtcbiAgICBsZXQgaWQgPSB0aGlzLl9zY2hlZHVsZXIuc2NoZWR1bGVGdW5jdGlvbihjYiwgZGVsYXksIGFyZ3MsIGZhbHNlLCAhaXNUaW1lcik7XG4gICAgaWYgKGlzVGltZXIpIHtcbiAgICAgIHRoaXMucGVuZGluZ1RpbWVycy5wdXNoKGlkKTtcbiAgICB9XG4gICAgcmV0dXJuIGlkO1xuICB9XG5cbiAgcHJpdmF0ZSBfY2xlYXJUaW1lb3V0KGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuX3JlbW92ZVRpbWVyKHRoaXMucGVuZGluZ1RpbWVycywgaWQpO1xuICAgIHRoaXMuX3NjaGVkdWxlci5yZW1vdmVTY2hlZHVsZWRGdW5jdGlvbldpdGhJZChpZCk7XG4gIH1cblxuICBwcml2YXRlIF9zZXRJbnRlcnZhbChmbjogRnVuY3Rpb24sIGludGVydmFsOiBudW1iZXIsIGFyZ3M6IGFueVtdKTogbnVtYmVyIHtcbiAgICBsZXQgaWQgPSB0aGlzLl9zY2hlZHVsZXIubmV4dElkO1xuICAgIGxldCBjb21wbGV0ZXJzID0ge29uU3VjY2VzczogbnVsbCBhcyBhbnksIG9uRXJyb3I6IHRoaXMuX2RlcXVldWVQZXJpb2RpY1RpbWVyKGlkKX07XG4gICAgbGV0IGNiID0gdGhpcy5fZm5BbmRGbHVzaChmbiwgY29tcGxldGVycyk7XG5cbiAgICAvLyBVc2UgdGhlIGNhbGxiYWNrIGNyZWF0ZWQgYWJvdmUgdG8gcmVxdWV1ZSBvbiBzdWNjZXNzLlxuICAgIGNvbXBsZXRlcnMub25TdWNjZXNzID0gdGhpcy5fcmVxdWV1ZVBlcmlvZGljVGltZXIoY2IsIGludGVydmFsLCBhcmdzLCBpZCk7XG5cbiAgICAvLyBRdWV1ZSB0aGUgY2FsbGJhY2sgYW5kIGRlcXVldWUgdGhlIHBlcmlvZGljIHRpbWVyIG9ubHkgb24gZXJyb3IuXG4gICAgdGhpcy5fc2NoZWR1bGVyLnNjaGVkdWxlRnVuY3Rpb24oY2IsIGludGVydmFsLCBhcmdzLCB0cnVlKTtcbiAgICB0aGlzLnBlbmRpbmdQZXJpb2RpY1RpbWVycy5wdXNoKGlkKTtcbiAgICByZXR1cm4gaWQ7XG4gIH1cblxuICBwcml2YXRlIF9jbGVhckludGVydmFsKGlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuX3JlbW92ZVRpbWVyKHRoaXMucGVuZGluZ1BlcmlvZGljVGltZXJzLCBpZCk7XG4gICAgdGhpcy5fc2NoZWR1bGVyLnJlbW92ZVNjaGVkdWxlZEZ1bmN0aW9uV2l0aElkKGlkKTtcbiAgfVxuXG4gIHByaXZhdGUgX3Jlc2V0TGFzdEVycm9yQW5kVGhyb3coKTogdm9pZCB7XG4gICAgbGV0IGVycm9yID0gdGhpcy5fbGFzdEVycm9yIHx8IHRoaXMuX3VuY2F1Z2h0UHJvbWlzZUVycm9yc1swXTtcbiAgICB0aGlzLl91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoID0gMDtcbiAgICB0aGlzLl9sYXN0RXJyb3IgPSBudWxsO1xuICAgIHRocm93IGVycm9yO1xuICB9XG5cbiAgZ2V0Q3VycmVudFRpbWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3NjaGVkdWxlci5nZXRDdXJyZW50VGltZSgpO1xuICB9XG5cbiAgZ2V0Q3VycmVudFJlYWxUaW1lKCkge1xuICAgIHJldHVybiB0aGlzLl9zY2hlZHVsZXIuZ2V0Q3VycmVudFJlYWxUaW1lKCk7XG4gIH1cblxuICBzZXRDdXJyZW50UmVhbFRpbWUocmVhbFRpbWU6IG51bWJlcikge1xuICAgIHRoaXMuX3NjaGVkdWxlci5zZXRDdXJyZW50UmVhbFRpbWUocmVhbFRpbWUpO1xuICB9XG5cbiAgc3RhdGljIHBhdGNoRGF0ZSgpIHtcbiAgICBpZiAoZ2xvYmFsWydEYXRlJ10gPT09IEZha2VEYXRlKSB7XG4gICAgICAvLyBhbHJlYWR5IHBhdGNoZWRcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZ2xvYmFsWydEYXRlJ10gPSBGYWtlRGF0ZTtcbiAgICBGYWtlRGF0ZS5wcm90b3R5cGUgPSBPcmlnaW5hbERhdGUucHJvdG90eXBlO1xuXG4gICAgLy8gdHJ5IGNoZWNrIGFuZCByZXNldCB0aW1lcnNcbiAgICAvLyBiZWNhdXNlIGphc21pbmUuY2xvY2soKS5pbnN0YWxsKCkgbWF5XG4gICAgLy8gaGF2ZSByZXBsYWNlZCB0aGUgZ2xvYmFsIHRpbWVyXG4gICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLmNoZWNrVGltZXJQYXRjaCgpO1xuICB9XG5cbiAgc3RhdGljIHJlc2V0RGF0ZSgpIHtcbiAgICBpZiAoZ2xvYmFsWydEYXRlJ10gPT09IEZha2VEYXRlKSB7XG4gICAgICBnbG9iYWxbJ0RhdGUnXSA9IE9yaWdpbmFsRGF0ZTtcbiAgICB9XG4gIH1cblxuICBzdGF0aWMgY2hlY2tUaW1lclBhdGNoKCkge1xuICAgIGlmIChnbG9iYWwuc2V0VGltZW91dCAhPT0gdGltZXJzLnNldFRpbWVvdXQpIHtcbiAgICAgIGdsb2JhbC5zZXRUaW1lb3V0ID0gdGltZXJzLnNldFRpbWVvdXQ7XG4gICAgICBnbG9iYWwuY2xlYXJUaW1lb3V0ID0gdGltZXJzLmNsZWFyVGltZW91dDtcbiAgICB9XG4gICAgaWYgKGdsb2JhbC5zZXRJbnRlcnZhbCAhPT0gdGltZXJzLnNldEludGVydmFsKSB7XG4gICAgICBnbG9iYWwuc2V0SW50ZXJ2YWwgPSB0aW1lcnMuc2V0SW50ZXJ2YWw7XG4gICAgICBnbG9iYWwuY2xlYXJJbnRlcnZhbCA9IHRpbWVycy5jbGVhckludGVydmFsO1xuICAgIH1cbiAgfVxuXG4gIGxvY2tEYXRlUGF0Y2goKSB7XG4gICAgdGhpcy5wYXRjaERhdGVMb2NrZWQgPSB0cnVlO1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5wYXRjaERhdGUoKTtcbiAgfVxuICB1bmxvY2tEYXRlUGF0Y2goKSB7XG4gICAgdGhpcy5wYXRjaERhdGVMb2NrZWQgPSBmYWxzZTtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMucmVzZXREYXRlKCk7XG4gIH1cblxuICB0aWNrKG1pbGxpczogbnVtYmVyID0gMCwgZG9UaWNrPzogKGVsYXBzZWQ6IG51bWJlcikgPT4gdm9pZCk6IHZvaWQge1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5hc3NlcnRJblpvbmUoKTtcbiAgICB0aGlzLmZsdXNoTWljcm90YXNrcygpO1xuICAgIHRoaXMuX3NjaGVkdWxlci50aWNrKG1pbGxpcywgZG9UaWNrKTtcbiAgICBpZiAodGhpcy5fbGFzdEVycm9yICE9PSBudWxsKSB7XG4gICAgICB0aGlzLl9yZXNldExhc3RFcnJvckFuZFRocm93KCk7XG4gICAgfVxuICB9XG5cbiAgZmx1c2hNaWNyb3Rhc2tzKCk6IHZvaWQge1xuICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5hc3NlcnRJblpvbmUoKTtcbiAgICBjb25zdCBmbHVzaEVycm9ycyA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLl9sYXN0RXJyb3IgIT09IG51bGwgfHwgdGhpcy5fdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgICAvLyBJZiB0aGVyZSBpcyBhbiBlcnJvciBzdG9wIHByb2Nlc3NpbmcgdGhlIG1pY3JvdGFzayBxdWV1ZSBhbmQgcmV0aHJvdyB0aGUgZXJyb3IuXG4gICAgICAgIHRoaXMuX3Jlc2V0TGFzdEVycm9yQW5kVGhyb3coKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHdoaWxlICh0aGlzLl9taWNyb3Rhc2tzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBtaWNyb3Rhc2sgPSB0aGlzLl9taWNyb3Rhc2tzLnNoaWZ0KCkhO1xuICAgICAgbWljcm90YXNrLmZ1bmMuYXBwbHkobWljcm90YXNrLnRhcmdldCwgbWljcm90YXNrLmFyZ3MpO1xuICAgIH1cbiAgICBmbHVzaEVycm9ycygpO1xuICB9XG5cbiAgZmx1c2gobGltaXQ/OiBudW1iZXIsIGZsdXNoUGVyaW9kaWM/OiBib29sZWFuLCBkb1RpY2s/OiAoZWxhcHNlZDogbnVtYmVyKSA9PiB2b2lkKTogbnVtYmVyIHtcbiAgICBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMuYXNzZXJ0SW5ab25lKCk7XG4gICAgdGhpcy5mbHVzaE1pY3JvdGFza3MoKTtcbiAgICBjb25zdCBlbGFwc2VkID0gdGhpcy5fc2NoZWR1bGVyLmZsdXNoKGxpbWl0LCBmbHVzaFBlcmlvZGljLCBkb1RpY2spO1xuICAgIGlmICh0aGlzLl9sYXN0RXJyb3IgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuX3Jlc2V0TGFzdEVycm9yQW5kVGhyb3coKTtcbiAgICB9XG4gICAgcmV0dXJuIGVsYXBzZWQ7XG4gIH1cblxuICAvLyBab25lU3BlYyBpbXBsZW1lbnRhdGlvbiBiZWxvdy5cblxuICBuYW1lOiBzdHJpbmc7XG5cbiAgcHJvcGVydGllczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7J0Zha2VBc3luY1Rlc3Rab25lU3BlYyc6IHRoaXN9O1xuXG4gIG9uU2NoZWR1bGVUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgdGFzazogVGFzayk6IFRhc2sge1xuICAgIHN3aXRjaCAodGFzay50eXBlKSB7XG4gICAgICBjYXNlICdtaWNyb1Rhc2snOlxuICAgICAgICBsZXQgYXJncyA9IHRhc2suZGF0YSAmJiAodGFzay5kYXRhIGFzIGFueSkuYXJncztcbiAgICAgICAgLy8gc2hvdWxkIHBhc3MgYWRkaXRpb25hbCBhcmd1bWVudHMgdG8gY2FsbGJhY2sgaWYgaGF2ZSBhbnlcbiAgICAgICAgLy8gY3VycmVudGx5IHdlIGtub3cgcHJvY2Vzcy5uZXh0VGljayB3aWxsIGhhdmUgc3VjaCBhZGRpdGlvbmFsXG4gICAgICAgIC8vIGFyZ3VtZW50c1xuICAgICAgICBsZXQgYWRkaXRpb25hbEFyZ3M6IGFueVtdfHVuZGVmaW5lZDtcbiAgICAgICAgaWYgKGFyZ3MpIHtcbiAgICAgICAgICBsZXQgY2FsbGJhY2tJbmRleCA9ICh0YXNrLmRhdGEgYXMgYW55KS5jYklkeDtcbiAgICAgICAgICBpZiAodHlwZW9mIGFyZ3MubGVuZ3RoID09PSAnbnVtYmVyJyAmJiBhcmdzLmxlbmd0aCA+IGNhbGxiYWNrSW5kZXggKyAxKSB7XG4gICAgICAgICAgICBhZGRpdGlvbmFsQXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3MsIGNhbGxiYWNrSW5kZXggKyAxKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fbWljcm90YXNrcy5wdXNoKHtcbiAgICAgICAgICBmdW5jOiB0YXNrLmludm9rZSxcbiAgICAgICAgICBhcmdzOiBhZGRpdGlvbmFsQXJncyxcbiAgICAgICAgICB0YXJnZXQ6IHRhc2suZGF0YSAmJiAodGFzay5kYXRhIGFzIGFueSkudGFyZ2V0XG4gICAgICAgIH0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ21hY3JvVGFzayc6XG4gICAgICAgIHN3aXRjaCAodGFzay5zb3VyY2UpIHtcbiAgICAgICAgICBjYXNlICdzZXRUaW1lb3V0JzpcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCB0YXNrLmRhdGEhWydkZWxheSddISxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMikpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2V0SW1tZWRpYXRlJzpcbiAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRUaW1lb3V0KFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCAwLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMSkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnc2V0SW50ZXJ2YWwnOlxuICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldEludGVydmFsKFxuICAgICAgICAgICAgICAgIHRhc2suaW52b2tlLCB0YXNrLmRhdGEhWydkZWxheSddISxcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCgodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSwgMikpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAnWE1MSHR0cFJlcXVlc3Quc2VuZCc6XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ0Nhbm5vdCBtYWtlIFhIUnMgZnJvbSB3aXRoaW4gYSBmYWtlIGFzeW5jIHRlc3QuIFJlcXVlc3QgVVJMOiAnICtcbiAgICAgICAgICAgICAgICAodGFzay5kYXRhIGFzIGFueSlbJ3VybCddKTtcbiAgICAgICAgICBjYXNlICdyZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgICAgIGNhc2UgJ3dlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICAgICAgY2FzZSAnbW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgICAgICAgIC8vIFNpbXVsYXRlIGEgcmVxdWVzdEFuaW1hdGlvbkZyYW1lIGJ5IHVzaW5nIGEgc2V0VGltZW91dCB3aXRoIDE2IG1zLlxuICAgICAgICAgICAgLy8gKDYwIGZyYW1lcyBwZXIgc2Vjb25kKVxuICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldFRpbWVvdXQoXG4gICAgICAgICAgICAgICAgdGFzay5pbnZva2UsIDE2LCAodGFzay5kYXRhIGFzIGFueSlbJ2FyZ3MnXSxcbiAgICAgICAgICAgICAgICB0aGlzLnRyYWNrUGVuZGluZ1JlcXVlc3RBbmltYXRpb25GcmFtZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgLy8gdXNlciBjYW4gZGVmaW5lIHdoaWNoIG1hY3JvVGFzayB0aGV5IHdhbnQgdG8gc3VwcG9ydCBieSBwYXNzaW5nXG4gICAgICAgICAgICAvLyBtYWNyb1Rhc2tPcHRpb25zXG4gICAgICAgICAgICBjb25zdCBtYWNyb1Rhc2tPcHRpb24gPSB0aGlzLmZpbmRNYWNyb1Rhc2tPcHRpb24odGFzayk7XG4gICAgICAgICAgICBpZiAobWFjcm9UYXNrT3B0aW9uKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGFyZ3MgPSB0YXNrLmRhdGEgJiYgKHRhc2suZGF0YSBhcyBhbnkpWydhcmdzJ107XG4gICAgICAgICAgICAgIGNvbnN0IGRlbGF5ID0gYXJncyAmJiBhcmdzLmxlbmd0aCA+IDEgPyBhcmdzWzFdIDogMDtcbiAgICAgICAgICAgICAgbGV0IGNhbGxiYWNrQXJncyA9IG1hY3JvVGFza09wdGlvbi5jYWxsYmFja0FyZ3MgPyBtYWNyb1Rhc2tPcHRpb24uY2FsbGJhY2tBcmdzIDogYXJncztcbiAgICAgICAgICAgICAgaWYgKCEhbWFjcm9UYXNrT3B0aW9uLmlzUGVyaW9kaWMpIHtcbiAgICAgICAgICAgICAgICAvLyBwZXJpb2RpYyBtYWNyb1Rhc2ssIHVzZSBzZXRJbnRlcnZhbCB0byBzaW11bGF0ZVxuICAgICAgICAgICAgICAgIHRhc2suZGF0YSFbJ2hhbmRsZUlkJ10gPSB0aGlzLl9zZXRJbnRlcnZhbCh0YXNrLmludm9rZSwgZGVsYXksIGNhbGxiYWNrQXJncyk7XG4gICAgICAgICAgICAgICAgdGFzay5kYXRhIS5pc1BlcmlvZGljID0gdHJ1ZTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBub3QgcGVyaW9kaWMsIHVzZSBzZXRUaW1lb3V0IHRvIHNpbXVsYXRlXG4gICAgICAgICAgICAgICAgdGFzay5kYXRhIVsnaGFuZGxlSWQnXSA9IHRoaXMuX3NldFRpbWVvdXQodGFzay5pbnZva2UsIGRlbGF5LCBjYWxsYmFja0FyZ3MpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIG1hY3JvVGFzayBzY2hlZHVsZWQgaW4gZmFrZSBhc3luYyB0ZXN0OiAnICsgdGFzay5zb3VyY2UpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnZXZlbnRUYXNrJzpcbiAgICAgICAgdGFzayA9IGRlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXQsIHRhc2spO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cblxuICBvbkNhbmNlbFRhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrKTogYW55IHtcbiAgICBzd2l0Y2ggKHRhc2suc291cmNlKSB7XG4gICAgICBjYXNlICdzZXRUaW1lb3V0JzpcbiAgICAgIGNhc2UgJ3JlcXVlc3RBbmltYXRpb25GcmFtZSc6XG4gICAgICBjYXNlICd3ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWUnOlxuICAgICAgY2FzZSAnbW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lJzpcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NsZWFyVGltZW91dCg8bnVtYmVyPnRhc2suZGF0YSFbJ2hhbmRsZUlkJ10pO1xuICAgICAgY2FzZSAnc2V0SW50ZXJ2YWwnOlxuICAgICAgICByZXR1cm4gdGhpcy5fY2xlYXJJbnRlcnZhbCg8bnVtYmVyPnRhc2suZGF0YSFbJ2hhbmRsZUlkJ10pO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gdXNlciBjYW4gZGVmaW5lIHdoaWNoIG1hY3JvVGFzayB0aGV5IHdhbnQgdG8gc3VwcG9ydCBieSBwYXNzaW5nXG4gICAgICAgIC8vIG1hY3JvVGFza09wdGlvbnNcbiAgICAgICAgY29uc3QgbWFjcm9UYXNrT3B0aW9uID0gdGhpcy5maW5kTWFjcm9UYXNrT3B0aW9uKHRhc2spO1xuICAgICAgICBpZiAobWFjcm9UYXNrT3B0aW9uKSB7XG4gICAgICAgICAgY29uc3QgaGFuZGxlSWQ6IG51bWJlciA9IDxudW1iZXI+dGFzay5kYXRhIVsnaGFuZGxlSWQnXTtcbiAgICAgICAgICByZXR1cm4gbWFjcm9UYXNrT3B0aW9uLmlzUGVyaW9kaWMgPyB0aGlzLl9jbGVhckludGVydmFsKGhhbmRsZUlkKSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2xlYXJUaW1lb3V0KGhhbmRsZUlkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXQsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIG9uSW52b2tlKFxuICAgICAgZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCBjYWxsYmFjazogRnVuY3Rpb24sIGFwcGx5VGhpczogYW55LFxuICAgICAgYXBwbHlBcmdzPzogYW55W10sIHNvdXJjZT86IHN0cmluZyk6IGFueSB7XG4gICAgdHJ5IHtcbiAgICAgIEZha2VBc3luY1Rlc3Rab25lU3BlYy5wYXRjaERhdGUoKTtcbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5pbnZva2UodGFyZ2V0LCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIGlmICghdGhpcy5wYXRjaERhdGVMb2NrZWQpIHtcbiAgICAgICAgRmFrZUFzeW5jVGVzdFpvbmVTcGVjLnJlc2V0RGF0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZpbmRNYWNyb1Rhc2tPcHRpb24odGFzazogVGFzaykge1xuICAgIGlmICghdGhpcy5tYWNyb1Rhc2tPcHRpb25zKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLm1hY3JvVGFza09wdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IG1hY3JvVGFza09wdGlvbiA9IHRoaXMubWFjcm9UYXNrT3B0aW9uc1tpXTtcbiAgICAgIGlmIChtYWNyb1Rhc2tPcHRpb24uc291cmNlID09PSB0YXNrLnNvdXJjZSkge1xuICAgICAgICByZXR1cm4gbWFjcm9UYXNrT3B0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG9uSGFuZGxlRXJyb3IocGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCBlcnJvcjogYW55KTpcbiAgICAgIGJvb2xlYW4ge1xuICAgIHRoaXMuX2xhc3RFcnJvciA9IGVycm9yO1xuICAgIHJldHVybiBmYWxzZTsgIC8vIERvbid0IHByb3BhZ2F0ZSBlcnJvciB0byBwYXJlbnQgem9uZS5cbiAgfVxufVxuXG4vLyBFeHBvcnQgdGhlIGNsYXNzIHNvIHRoYXQgbmV3IGluc3RhbmNlcyBjYW4gYmUgY3JlYXRlZCB3aXRoIHByb3BlclxuLy8gY29uc3RydWN0b3IgcGFyYW1zLlxuKFpvbmUgYXMgYW55KVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ10gPSBGYWtlQXN5bmNUZXN0Wm9uZVNwZWM7XG59KSh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JyAmJiB3aW5kb3cgfHwgdHlwZW9mIHNlbGYgPT09ICdvYmplY3QnICYmIHNlbGYgfHwgZ2xvYmFsKTtcbiJdfQ==