/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var _global = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
var AsyncTestZoneSpec = /** @class */ (function () {
    function AsyncTestZoneSpec(finishCallback, failCallback, namePrefix) {
        this.finishCallback = finishCallback;
        this.failCallback = failCallback;
        this._pendingMicroTasks = false;
        this._pendingMacroTasks = false;
        this._alreadyErrored = false;
        this._isSync = false;
        this.runZone = Zone.current;
        this.unresolvedChainedPromiseCount = 0;
        this.supportWaitUnresolvedChainedPromise = false;
        this.name = 'asyncTestZone for ' + namePrefix;
        this.properties = { 'AsyncTestZoneSpec': this };
        this.supportWaitUnresolvedChainedPromise =
            _global[Zone.__symbol__('supportWaitUnResolvedChainedPromise')] === true;
    }
    AsyncTestZoneSpec.prototype.isUnresolvedChainedPromisePending = function () {
        return this.unresolvedChainedPromiseCount > 0;
    };
    AsyncTestZoneSpec.prototype._finishCallbackIfDone = function () {
        var _this = this;
        if (!(this._pendingMicroTasks || this._pendingMacroTasks ||
            (this.supportWaitUnresolvedChainedPromise && this.isUnresolvedChainedPromisePending()))) {
            // We do this because we would like to catch unhandled rejected promises.
            this.runZone.run(function () {
                setTimeout(function () {
                    if (!_this._alreadyErrored && !(_this._pendingMicroTasks || _this._pendingMacroTasks)) {
                        _this.finishCallback();
                    }
                }, 0);
            });
        }
    };
    AsyncTestZoneSpec.prototype.patchPromiseForTest = function () {
        if (!this.supportWaitUnresolvedChainedPromise) {
            return;
        }
        var patchPromiseForTest = Promise[Zone.__symbol__('patchPromiseForTest')];
        if (patchPromiseForTest) {
            patchPromiseForTest();
        }
    };
    AsyncTestZoneSpec.prototype.unPatchPromiseForTest = function () {
        if (!this.supportWaitUnresolvedChainedPromise) {
            return;
        }
        var unPatchPromiseForTest = Promise[Zone.__symbol__('unPatchPromiseForTest')];
        if (unPatchPromiseForTest) {
            unPatchPromiseForTest();
        }
    };
    AsyncTestZoneSpec.prototype.onScheduleTask = function (delegate, current, target, task) {
        if (task.type !== 'eventTask') {
            this._isSync = false;
        }
        if (task.type === 'microTask' && task.data && task.data instanceof Promise) {
            // check whether the promise is a chained promise
            if (task.data[AsyncTestZoneSpec.symbolParentUnresolved] === true) {
                // chained promise is being scheduled
                this.unresolvedChainedPromiseCount--;
            }
        }
        return delegate.scheduleTask(target, task);
    };
    AsyncTestZoneSpec.prototype.onInvokeTask = function (delegate, current, target, task, applyThis, applyArgs) {
        if (task.type !== 'eventTask') {
            this._isSync = false;
        }
        return delegate.invokeTask(target, task, applyThis, applyArgs);
    };
    AsyncTestZoneSpec.prototype.onCancelTask = function (delegate, current, target, task) {
        if (task.type !== 'eventTask') {
            this._isSync = false;
        }
        return delegate.cancelTask(target, task);
    };
    // Note - we need to use onInvoke at the moment to call finish when a test is
    // fully synchronous. TODO(juliemr): remove this when the logic for
    // onHasTask changes and it calls whenever the task queues are dirty.
    // updated by(JiaLiPassion), only call finish callback when no task
    // was scheduled/invoked/canceled.
    AsyncTestZoneSpec.prototype.onInvoke = function (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        var previousTaskCounts = null;
        try {
            this._isSync = true;
            return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        }
        finally {
            var afterTaskCounts = parentZoneDelegate._taskCounts;
            if (this._isSync) {
                this._finishCallbackIfDone();
            }
        }
    };
    AsyncTestZoneSpec.prototype.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error) {
        // Let the parent try to handle the error.
        var result = parentZoneDelegate.handleError(targetZone, error);
        if (result) {
            this.failCallback(error);
            this._alreadyErrored = true;
        }
        return false;
    };
    AsyncTestZoneSpec.prototype.onHasTask = function (delegate, current, target, hasTaskState) {
        delegate.hasTask(target, hasTaskState);
        if (hasTaskState.change == 'microTask') {
            this._pendingMicroTasks = hasTaskState.microTask;
            this._finishCallbackIfDone();
        }
        else if (hasTaskState.change == 'macroTask') {
            this._pendingMacroTasks = hasTaskState.macroTask;
            this._finishCallbackIfDone();
        }
    };
    AsyncTestZoneSpec.symbolParentUnresolved = Zone.__symbol__('parentUnresolved');
    return AsyncTestZoneSpec;
}());
// Export the class so that new instances can be created with proper
// constructor params.
Zone['AsyncTestZoneSpec'] = AsyncTestZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtdGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3pvbmUtc3BlYy9hc3luYy10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQU0sT0FBTyxHQUNULE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUM7QUFDN0Y7SUFZRSwyQkFDWSxjQUF3QixFQUFVLFlBQXNCLEVBQUUsVUFBa0I7UUFBNUUsbUJBQWMsR0FBZCxjQUFjLENBQVU7UUFBVSxpQkFBWSxHQUFaLFlBQVksQ0FBVTtRQVZwRSx1QkFBa0IsR0FBWSxLQUFLLENBQUM7UUFDcEMsdUJBQWtCLEdBQVksS0FBSyxDQUFDO1FBQ3BDLG9CQUFlLEdBQVksS0FBSyxDQUFDO1FBQ2pDLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsWUFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkIsa0NBQTZCLEdBQUcsQ0FBQyxDQUFDO1FBRWxDLHdDQUFtQyxHQUFHLEtBQUssQ0FBQztRQUkxQyxJQUFJLENBQUMsSUFBSSxHQUFHLG9CQUFvQixHQUFHLFVBQVUsQ0FBQztRQUM5QyxJQUFJLENBQUMsVUFBVSxHQUFHLEVBQUMsbUJBQW1CLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLG1DQUFtQztZQUNwQyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDO0lBQy9FLENBQUM7SUFFRCw2REFBaUMsR0FBakM7UUFDRSxPQUFPLElBQUksQ0FBQyw2QkFBNkIsR0FBRyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELGlEQUFx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QUFJLFlBQVksQ0FBQyxNQUFNLElBQUksV0FBVyxFQUFFO1lBQzdDLElBQUksQ0FBQyxrQkFBa0IsR0FBRyxZQUFZLENBQUMsU0FBUyxDQUFDO1lBQ2pELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQXJJTSx3Q0FBc0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFzSXRFLHdCQUFDO0NBQUEsQUF2SUQsSUF1SUM7QUFFRCxvRUFBb0U7QUFDcEUsc0JBQXNCO0FBQ3JCLElBQVksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLGlCQUFpQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuY29uc3QgX2dsb2JhbDogYW55ID1cbiAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgfHwgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgfHwgZ2xvYmFsO1xuY2xhc3MgQXN5bmNUZXN0Wm9uZVNwZWMgaW1wbGVtZW50cyBab25lU3BlYyB7XG4gIHN0YXRpYyBzeW1ib2xQYXJlbnRVbnJlc29sdmVkID0gWm9uZS5fX3N5bWJvbF9fKCdwYXJlbnRVbnJlc29sdmVkJyk7XG5cbiAgX3BlbmRpbmdNaWNyb1Rhc2tzOiBib29sZWFuID0gZmFsc2U7XG4gIF9wZW5kaW5nTWFjcm9UYXNrczogYm9vbGVhbiA9IGZhbHNlO1xuICBfYWxyZWFkeUVycm9yZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgX2lzU3luYzogYm9vbGVhbiA9IGZhbHNlO1xuICBydW5ab25lID0gWm9uZS5jdXJyZW50O1xuICB1bnJlc29sdmVkQ2hhaW5lZFByb21pc2VDb3VudCA9IDA7XG5cbiAgc3VwcG9ydFdhaXRVbnJlc29sdmVkQ2hhaW5lZFByb21pc2UgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIHByaXZhdGUgZmluaXNoQ2FsbGJhY2s6IEZ1bmN0aW9uLCBwcml2YXRlIGZhaWxDYWxsYmFjazogRnVuY3Rpb24sIG5hbWVQcmVmaXg6IHN0cmluZykge1xuICAgIHRoaXMubmFtZSA9ICdhc3luY1Rlc3Rab25lIGZvciAnICsgbmFtZVByZWZpeDtcbiAgICB0aGlzLnByb3BlcnRpZXMgPSB7J0FzeW5jVGVzdFpvbmVTcGVjJzogdGhpc307XG4gICAgdGhpcy5zdXBwb3J0V2FpdFVucmVzb2x2ZWRDaGFpbmVkUHJvbWlzZSA9XG4gICAgICAgIF9nbG9iYWxbWm9uZS5fX3N5bWJvbF9fKCdzdXBwb3J0V2FpdFVuUmVzb2x2ZWRDaGFpbmVkUHJvbWlzZScpXSA9PT0gdHJ1ZTtcbiAgfVxuXG4gIGlzVW5yZXNvbHZlZENoYWluZWRQcm9taXNlUGVuZGluZygpIHtcbiAgICByZXR1cm4gdGhpcy51bnJlc29sdmVkQ2hhaW5lZFByb21pc2VDb3VudCA+IDA7XG4gIH1cblxuICBfZmluaXNoQ2FsbGJhY2tJZkRvbmUoKSB7XG4gICAgaWYgKCEodGhpcy5fcGVuZGluZ01pY3JvVGFza3MgfHwgdGhpcy5fcGVuZGluZ01hY3JvVGFza3MgfHxcbiAgICAgICAgICAodGhpcy5zdXBwb3J0V2FpdFVucmVzb2x2ZWRDaGFpbmVkUHJvbWlzZSAmJiB0aGlzLmlzVW5yZXNvbHZlZENoYWluZWRQcm9taXNlUGVuZGluZygpKSkpIHtcbiAgICAgIC8vIFdlIGRvIHRoaXMgYmVjYXVzZSB3ZSB3b3VsZCBsaWtlIHRvIGNhdGNoIHVuaGFuZGxlZCByZWplY3RlZCBwcm9taXNlcy5cbiAgICAgIHRoaXMucnVuWm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICBpZiAoIXRoaXMuX2FscmVhZHlFcnJvcmVkICYmICEodGhpcy5fcGVuZGluZ01pY3JvVGFza3MgfHwgdGhpcy5fcGVuZGluZ01hY3JvVGFza3MpKSB7XG4gICAgICAgICAgICB0aGlzLmZpbmlzaENhbGxiYWNrKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9LCAwKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHBhdGNoUHJvbWlzZUZvclRlc3QoKSB7XG4gICAgaWYgKCF0aGlzLnN1cHBvcnRXYWl0VW5yZXNvbHZlZENoYWluZWRQcm9taXNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBhdGNoUHJvbWlzZUZvclRlc3QgPSAoUHJvbWlzZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygncGF0Y2hQcm9taXNlRm9yVGVzdCcpXTtcbiAgICBpZiAocGF0Y2hQcm9taXNlRm9yVGVzdCkge1xuICAgICAgcGF0Y2hQcm9taXNlRm9yVGVzdCgpO1xuICAgIH1cbiAgfVxuXG4gIHVuUGF0Y2hQcm9taXNlRm9yVGVzdCgpIHtcbiAgICBpZiAoIXRoaXMuc3VwcG9ydFdhaXRVbnJlc29sdmVkQ2hhaW5lZFByb21pc2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgdW5QYXRjaFByb21pc2VGb3JUZXN0ID0gKFByb21pc2UgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ3VuUGF0Y2hQcm9taXNlRm9yVGVzdCcpXTtcbiAgICBpZiAodW5QYXRjaFByb21pc2VGb3JUZXN0KSB7XG4gICAgICB1blBhdGNoUHJvbWlzZUZvclRlc3QoKTtcbiAgICB9XG4gIH1cblxuICAvLyBab25lU3BlYyBpbXBsZW1lbnRhdGlvbiBiZWxvdy5cblxuICBuYW1lOiBzdHJpbmc7XG5cbiAgcHJvcGVydGllczoge1trZXk6IHN0cmluZ106IGFueX07XG5cbiAgb25TY2hlZHVsZVRhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrKTogVGFzayB7XG4gICAgaWYgKHRhc2sudHlwZSAhPT0gJ2V2ZW50VGFzaycpIHtcbiAgICAgIHRoaXMuX2lzU3luYyA9IGZhbHNlO1xuICAgIH1cbiAgICBpZiAodGFzay50eXBlID09PSAnbWljcm9UYXNrJyAmJiB0YXNrLmRhdGEgJiYgdGFzay5kYXRhIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgLy8gY2hlY2sgd2hldGhlciB0aGUgcHJvbWlzZSBpcyBhIGNoYWluZWQgcHJvbWlzZVxuICAgICAgaWYgKCh0YXNrLmRhdGEgYXMgYW55KVtBc3luY1Rlc3Rab25lU3BlYy5zeW1ib2xQYXJlbnRVbnJlc29sdmVkXSA9PT0gdHJ1ZSkge1xuICAgICAgICAvLyBjaGFpbmVkIHByb21pc2UgaXMgYmVpbmcgc2NoZWR1bGVkXG4gICAgICAgIHRoaXMudW5yZXNvbHZlZENoYWluZWRQcm9taXNlQ291bnQtLTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXQsIHRhc2spO1xuICB9XG5cbiAgb25JbnZva2VUYXNrKFxuICAgICAgZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCB0YXNrOiBUYXNrLCBhcHBseVRoaXM6IGFueSxcbiAgICAgIGFwcGx5QXJnczogYW55KSB7XG4gICAgaWYgKHRhc2sudHlwZSAhPT0gJ2V2ZW50VGFzaycpIHtcbiAgICAgIHRoaXMuX2lzU3luYyA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGVsZWdhdGUuaW52b2tlVGFzayh0YXJnZXQsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgfVxuXG4gIG9uQ2FuY2VsVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIHRhc2s6IFRhc2spIHtcbiAgICBpZiAodGFzay50eXBlICE9PSAnZXZlbnRUYXNrJykge1xuICAgICAgdGhpcy5faXNTeW5jID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkZWxlZ2F0ZS5jYW5jZWxUYXNrKHRhcmdldCwgdGFzayk7XG4gIH1cblxuICAvLyBOb3RlIC0gd2UgbmVlZCB0byB1c2Ugb25JbnZva2UgYXQgdGhlIG1vbWVudCB0byBjYWxsIGZpbmlzaCB3aGVuIGEgdGVzdCBpc1xuICAvLyBmdWxseSBzeW5jaHJvbm91cy4gVE9ETyhqdWxpZW1yKTogcmVtb3ZlIHRoaXMgd2hlbiB0aGUgbG9naWMgZm9yXG4gIC8vIG9uSGFzVGFzayBjaGFuZ2VzIGFuZCBpdCBjYWxscyB3aGVuZXZlciB0aGUgdGFzayBxdWV1ZXMgYXJlIGRpcnR5LlxuICAvLyB1cGRhdGVkIGJ5KEppYUxpUGFzc2lvbiksIG9ubHkgY2FsbCBmaW5pc2ggY2FsbGJhY2sgd2hlbiBubyB0YXNrXG4gIC8vIHdhcyBzY2hlZHVsZWQvaW52b2tlZC9jYW5jZWxlZC5cbiAgb25JbnZva2UoXG4gICAgICBwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIGRlbGVnYXRlOiBGdW5jdGlvbixcbiAgICAgIGFwcGx5VGhpczogYW55LCBhcHBseUFyZ3M/OiBhbnlbXSwgc291cmNlPzogc3RyaW5nKTogYW55IHtcbiAgICBsZXQgcHJldmlvdXNUYXNrQ291bnRzOiBhbnkgPSBudWxsO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl9pc1N5bmMgPSB0cnVlO1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2UodGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICBjb25zdCBhZnRlclRhc2tDb3VudHM6IGFueSA9IChwYXJlbnRab25lRGVsZWdhdGUgYXMgYW55KS5fdGFza0NvdW50cztcbiAgICAgIGlmICh0aGlzLl9pc1N5bmMpIHtcbiAgICAgICAgdGhpcy5fZmluaXNoQ2FsbGJhY2tJZkRvbmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbkhhbmRsZUVycm9yKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZXJyb3I6IGFueSk6XG4gICAgICBib29sZWFuIHtcbiAgICAvLyBMZXQgdGhlIHBhcmVudCB0cnkgdG8gaGFuZGxlIHRoZSBlcnJvci5cbiAgICBjb25zdCByZXN1bHQgPSBwYXJlbnRab25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGFyZ2V0Wm9uZSwgZXJyb3IpO1xuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHRoaXMuZmFpbENhbGxiYWNrKGVycm9yKTtcbiAgICAgIHRoaXMuX2FscmVhZHlFcnJvcmVkID0gdHJ1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgb25IYXNUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgaGFzVGFza1N0YXRlOiBIYXNUYXNrU3RhdGUpIHtcbiAgICBkZWxlZ2F0ZS5oYXNUYXNrKHRhcmdldCwgaGFzVGFza1N0YXRlKTtcbiAgICBpZiAoaGFzVGFza1N0YXRlLmNoYW5nZSA9PSAnbWljcm9UYXNrJykge1xuICAgICAgdGhpcy5fcGVuZGluZ01pY3JvVGFza3MgPSBoYXNUYXNrU3RhdGUubWljcm9UYXNrO1xuICAgICAgdGhpcy5fZmluaXNoQ2FsbGJhY2tJZkRvbmUoKTtcbiAgICB9IGVsc2UgaWYgKGhhc1Rhc2tTdGF0ZS5jaGFuZ2UgPT0gJ21hY3JvVGFzaycpIHtcbiAgICAgIHRoaXMuX3BlbmRpbmdNYWNyb1Rhc2tzID0gaGFzVGFza1N0YXRlLm1hY3JvVGFzaztcbiAgICAgIHRoaXMuX2ZpbmlzaENhbGxiYWNrSWZEb25lKCk7XG4gICAgfVxuICB9XG59XG5cbi8vIEV4cG9ydCB0aGUgY2xhc3Mgc28gdGhhdCBuZXcgaW5zdGFuY2VzIGNhbiBiZSBjcmVhdGVkIHdpdGggcHJvcGVyXG4vLyBjb25zdHJ1Y3RvciBwYXJhbXMuXG4oWm9uZSBhcyBhbnkpWydBc3luY1Rlc3Rab25lU3BlYyddID0gQXN5bmNUZXN0Wm9uZVNwZWM7XG4iXX0=