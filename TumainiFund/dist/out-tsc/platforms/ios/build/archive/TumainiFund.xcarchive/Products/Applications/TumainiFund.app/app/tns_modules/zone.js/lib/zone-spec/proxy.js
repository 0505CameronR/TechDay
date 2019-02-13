/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var ProxyZoneSpec = /** @class */ (function () {
    function ProxyZoneSpec(defaultSpecDelegate) {
        if (defaultSpecDelegate === void 0) { defaultSpecDelegate = null; }
        this.defaultSpecDelegate = defaultSpecDelegate;
        this.name = 'ProxyZone';
        this._delegateSpec = null;
        this.properties = { 'ProxyZoneSpec': this };
        this.propertyKeys = null;
        this.lastTaskState = null;
        this.isNeedToTriggerHasTask = false;
        this.tasks = [];
        this.setDelegate(defaultSpecDelegate);
    }
    ProxyZoneSpec.get = function () {
        return Zone.current.get('ProxyZoneSpec');
    };
    ProxyZoneSpec.isLoaded = function () {
        return ProxyZoneSpec.get() instanceof ProxyZoneSpec;
    };
    ProxyZoneSpec.assertPresent = function () {
        if (!ProxyZoneSpec.isLoaded()) {
            throw new Error("Expected to be running in 'ProxyZone', but it was not found.");
        }
        return ProxyZoneSpec.get();
    };
    ProxyZoneSpec.prototype.setDelegate = function (delegateSpec) {
        var _this = this;
        var isNewDelegate = this._delegateSpec !== delegateSpec;
        this._delegateSpec = delegateSpec;
        this.propertyKeys && this.propertyKeys.forEach(function (key) { return delete _this.properties[key]; });
        this.propertyKeys = null;
        if (delegateSpec && delegateSpec.properties) {
            this.propertyKeys = Object.keys(delegateSpec.properties);
            this.propertyKeys.forEach(function (k) { return _this.properties[k] = delegateSpec.properties[k]; });
        }
        // if set a new delegateSpec, shoulde check whether need to
        // trigger hasTask or not
        if (isNewDelegate && this.lastTaskState &&
            (this.lastTaskState.macroTask || this.lastTaskState.microTask)) {
            this.isNeedToTriggerHasTask = true;
        }
    };
    ProxyZoneSpec.prototype.getDelegate = function () {
        return this._delegateSpec;
    };
    ProxyZoneSpec.prototype.resetDelegate = function () {
        var delegateSpec = this.getDelegate();
        this.setDelegate(this.defaultSpecDelegate);
    };
    ProxyZoneSpec.prototype.tryTriggerHasTask = function (parentZoneDelegate, currentZone, targetZone) {
        if (this.isNeedToTriggerHasTask && this.lastTaskState) {
            // last delegateSpec has microTask or macroTask
            // should call onHasTask in current delegateSpec
            this.isNeedToTriggerHasTask = false;
            this.onHasTask(parentZoneDelegate, currentZone, targetZone, this.lastTaskState);
        }
    };
    ProxyZoneSpec.prototype.removeFromTasks = function (task) {
        if (!this.tasks) {
            return;
        }
        for (var i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i] === task) {
                this.tasks.splice(i, 1);
                return;
            }
        }
    };
    ProxyZoneSpec.prototype.getAndClearPendingTasksInfo = function () {
        if (this.tasks.length === 0) {
            return '';
        }
        var taskInfo = this.tasks.map(function (task) {
            var dataInfo = task.data &&
                Object.keys(task.data)
                    .map(function (key) {
                    return key + ':' + task.data[key];
                })
                    .join(',');
            return "type: " + task.type + ", source: " + task.source + ", args: {" + dataInfo + "}";
        });
        var pendingTasksInfo = '--Pendng async tasks are: [' + taskInfo + ']';
        // clear tasks
        this.tasks = [];
        return pendingTasksInfo;
    };
    ProxyZoneSpec.prototype.onFork = function (parentZoneDelegate, currentZone, targetZone, zoneSpec) {
        if (this._delegateSpec && this._delegateSpec.onFork) {
            return this._delegateSpec.onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec);
        }
        else {
            return parentZoneDelegate.fork(targetZone, zoneSpec);
        }
    };
    ProxyZoneSpec.prototype.onIntercept = function (parentZoneDelegate, currentZone, targetZone, delegate, source) {
        if (this._delegateSpec && this._delegateSpec.onIntercept) {
            return this._delegateSpec.onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source);
        }
        else {
            return parentZoneDelegate.intercept(targetZone, delegate, source);
        }
    };
    ProxyZoneSpec.prototype.onInvoke = function (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onInvoke) {
            return this._delegateSpec.onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source);
        }
        else {
            return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        }
    };
    ProxyZoneSpec.prototype.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error) {
        if (this._delegateSpec && this._delegateSpec.onHandleError) {
            return this._delegateSpec.onHandleError(parentZoneDelegate, currentZone, targetZone, error);
        }
        else {
            return parentZoneDelegate.handleError(targetZone, error);
        }
    };
    ProxyZoneSpec.prototype.onScheduleTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        if (task.type !== 'eventTask') {
            this.tasks.push(task);
        }
        if (this._delegateSpec && this._delegateSpec.onScheduleTask) {
            return this._delegateSpec.onScheduleTask(parentZoneDelegate, currentZone, targetZone, task);
        }
        else {
            return parentZoneDelegate.scheduleTask(targetZone, task);
        }
    };
    ProxyZoneSpec.prototype.onInvokeTask = function (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (task.type !== 'eventTask') {
            this.removeFromTasks(task);
        }
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onInvokeTask) {
            return this._delegateSpec.onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs);
        }
        else {
            return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        }
    };
    ProxyZoneSpec.prototype.onCancelTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        if (task.type !== 'eventTask') {
            this.removeFromTasks(task);
        }
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onCancelTask) {
            return this._delegateSpec.onCancelTask(parentZoneDelegate, currentZone, targetZone, task);
        }
        else {
            return parentZoneDelegate.cancelTask(targetZone, task);
        }
    };
    ProxyZoneSpec.prototype.onHasTask = function (delegate, current, target, hasTaskState) {
        this.lastTaskState = hasTaskState;
        if (this._delegateSpec && this._delegateSpec.onHasTask) {
            this._delegateSpec.onHasTask(delegate, current, target, hasTaskState);
        }
        else {
            delegate.hasTask(target, hasTaskState);
        }
    };
    return ProxyZoneSpec;
}());
// Export the class so that new instances can be created with proper
// constructor params.
Zone['ProxyZoneSpec'] = ProxyZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3pvbmUtc3BlYy9wcm94eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDtJQTRCRSx1QkFBb0IsbUJBQXlDO1FBQXpDLG9DQUFBLEVBQUEsMEJBQXlDO1FBQXpDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBc0I7UUEzQjdELFNBQUksR0FBVyxXQUFXLENBQUM7UUFFbkIsa0JBQWEsR0FBa0IsSUFBSSxDQUFDO1FBRTVDLGVBQVUsR0FBdUIsRUFBQyxlQUFlLEVBQUUsSUFBSSxFQUFDLENBQUM7UUFDekQsaUJBQVksR0FBa0IsSUFBSSxDQUFDO1FBRW5DLGtCQUFhLEdBQXNCLElBQUksQ0FBQztRQUN4QywyQkFBc0IsR0FBRyxLQUFLLENBQUM7UUFFdkIsVUFBSyxHQUFXLEVBQUUsQ0FBQztRQWtCekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFqQk0saUJBQUcsR0FBVjtRQUNFLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUVNLHNCQUFRLEdBQWY7UUFDRSxPQUFPLGFBQWEsQ0FBQyxHQUFHLEVBQUUsWUFBWSxhQUFhLENBQUM7SUFDdEQsQ0FBQztJQUVNLDJCQUFhLEdBQXBCO1FBQ0UsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsRUFBRTtZQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDhEQUE4RCxDQUFDLENBQUM7U0FDakY7UUFDRCxPQUFPLGFB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QUksS0FBSyxXQUFXLEVBQUU7WUFDN0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM1QjtRQUNELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxrQkFBa0IsRUFBRSxXQUFXLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDcEUsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRjthQUFNO1lBQ0wsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQztJQUVELGlDQUFTLEdBQVQsVUFBVSxRQUFzQixFQUFFLE9BQWEsRUFBRSxNQUFZLEVBQUUsWUFBMEI7UUFDdkYsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1lBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ3ZFO2FBQU07WUFDTCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztTQUN4QztJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUEvTEQsSUErTEM7QUFFRCxvRUFBb0U7QUFDcEUsc0JBQXNCO0FBQ3JCLElBQVksQ0FBQyxlQUFlLENBQUMsR0FBRyxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5jbGFzcyBQcm94eVpvbmVTcGVjIGltcGxlbWVudHMgWm9uZVNwZWMge1xuICBuYW1lOiBzdHJpbmcgPSAnUHJveHlab25lJztcblxuICBwcml2YXRlIF9kZWxlZ2F0ZVNwZWM6IFpvbmVTcGVjfG51bGwgPSBudWxsO1xuXG4gIHByb3BlcnRpZXM6IHtbazogc3RyaW5nXTogYW55fSA9IHsnUHJveHlab25lU3BlYyc6IHRoaXN9O1xuICBwcm9wZXJ0eUtleXM6IHN0cmluZ1tdfG51bGwgPSBudWxsO1xuXG4gIGxhc3RUYXNrU3RhdGU6IEhhc1Rhc2tTdGF0ZXxudWxsID0gbnVsbDtcbiAgaXNOZWVkVG9UcmlnZ2VySGFzVGFzayA9IGZhbHNlO1xuXG4gIHByaXZhdGUgdGFza3M6IFRhc2tbXSA9IFtdO1xuXG4gIHN0YXRpYyBnZXQoKTogUHJveHlab25lU3BlYyB7XG4gICAgcmV0dXJuIFpvbmUuY3VycmVudC5nZXQoJ1Byb3h5Wm9uZVNwZWMnKTtcbiAgfVxuXG4gIHN0YXRpYyBpc0xvYWRlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gUHJveHlab25lU3BlYy5nZXQoKSBpbnN0YW5jZW9mIFByb3h5Wm9uZVNwZWM7XG4gIH1cblxuICBzdGF0aWMgYXNzZXJ0UHJlc2VudCgpOiBQcm94eVpvbmVTcGVjIHtcbiAgICBpZiAoIVByb3h5Wm9uZVNwZWMuaXNMb2FkZWQoKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBFeHBlY3RlZCB0byBiZSBydW5uaW5nIGluICdQcm94eVpvbmUnLCBidXQgaXQgd2FzIG5vdCBmb3VuZC5gKTtcbiAgICB9XG4gICAgcmV0dXJuIFByb3h5Wm9uZVNwZWMuZ2V0KCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlZmF1bHRTcGVjRGVsZWdhdGU6IFpvbmVTcGVjfG51bGwgPSBudWxsKSB7XG4gICAgdGhpcy5zZXREZWxlZ2F0ZShkZWZhdWx0U3BlY0RlbGVnYXRlKTtcbiAgfVxuXG4gIHNldERlbGVnYXRlKGRlbGVnYXRlU3BlYzogWm9uZVNwZWN8bnVsbCkge1xuICAgIGNvbnN0IGlzTmV3RGVsZWdhdGUgPSB0aGlzLl9kZWxlZ2F0ZVNwZWMgIT09IGRlbGVnYXRlU3BlYztcbiAgICB0aGlzLl9kZWxlZ2F0ZVNwZWMgPSBkZWxlZ2F0ZVNwZWM7XG4gICAgdGhpcy5wcm9wZXJ0eUtleXMgJiYgdGhpcy5wcm9wZXJ0eUtleXMuZm9yRWFjaCgoa2V5KSA9PiBkZWxldGUgdGhpcy5wcm9wZXJ0aWVzW2tleV0pO1xuICAgIHRoaXMucHJvcGVydHlLZXlzID0gbnVsbDtcbiAgICBpZiAoZGVsZWdhdGVTcGVjICYmIGRlbGVnYXRlU3BlYy5wcm9wZXJ0aWVzKSB7XG4gICAgICB0aGlzLnByb3BlcnR5S2V5cyA9IE9iamVjdC5rZXlzKGRlbGVnYXRlU3BlYy5wcm9wZXJ0aWVzKTtcbiAgICAgIHRoaXMucHJvcGVydHlLZXlzLmZvckVhY2goKGspID0+IHRoaXMucHJvcGVydGllc1trXSA9IGRlbGVnYXRlU3BlYy5wcm9wZXJ0aWVzIVtrXSk7XG4gICAgfVxuICAgIC8vIGlmIHNldCBhIG5ldyBkZWxlZ2F0ZVNwZWMsIHNob3VsZGUgY2hlY2sgd2hldGhlciBuZWVkIHRvXG4gICAgLy8gdHJpZ2dlciBoYXNUYXNrIG9yIG5vdFxuICAgIGlmIChpc05ld0RlbGVnYXRlICYmIHRoaXMubGFzdFRhc2tTdGF0ZSAmJlxuICAgICAgICAodGhpcy5sYXN0VGFza1N0YXRlLm1hY3JvVGFzayB8fCB0aGlzLmxhc3RUYXNrU3RhdGUubWljcm9UYXNrKSkge1xuICAgICAgdGhpcy5pc05lZWRUb1RyaWdnZXJIYXNUYXNrID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBnZXREZWxlZ2F0ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjO1xuICB9XG5cblxuICByZXNldERlbGVnYXRlKCkge1xuICAgIGNvbnN0IGRlbGVnYXRlU3BlYyA9IHRoaXMuZ2V0RGVsZWdhdGUoKTtcbiAgICB0aGlzLnNldERlbGVnYXRlKHRoaXMuZGVmYXVsdFNwZWNEZWxlZ2F0ZSk7XG4gIH1cblxuICB0cnlUcmlnZ2VySGFzVGFzayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUpIHtcbiAgICBpZiAodGhpcy5pc05lZWRUb1RyaWdnZXJIYXNUYXNrICYmIHRoaXMubGFzdFRhc2tTdGF0ZSkge1xuICAgICAgLy8gbGFzdCBkZWxlZ2F0ZVNwZWMgaGFzIG1pY3JvVGFzayBvciBtYWNyb1Rhc2tcbiAgICAgIC8vIHNob3VsZCBjYWxsIG9uSGFzVGFzayBpbiBjdXJyZW50IGRlbGVnYXRlU3BlY1xuICAgICAgdGhpcy5pc05lZWRUb1RyaWdnZXJIYXNUYXNrID0gZmFsc2U7XG4gICAgICB0aGlzLm9uSGFzVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCB0aGlzLmxhc3RUYXNrU3RhdGUpO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZUZyb21UYXNrcyh0YXNrOiBUYXNrKSB7XG4gICAgaWYgKCF0aGlzLnRhc2tzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy50YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRoaXMudGFza3NbaV0gPT09IHRhc2spIHtcbiAgICAgICAgdGhpcy50YXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBnZXRBbmRDbGVhclBlbmRpbmdUYXNrc0luZm8oKSB7XG4gICAgaWYgKHRoaXMudGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGNvbnN0IHRhc2tJbmZvID0gdGhpcy50YXNrcy5tYXAoKHRhc2s6IFRhc2spID0+IHtcbiAgICAgIGNvbnN0IGRhdGFJbmZvID0gdGFzay5kYXRhICYmXG4gICAgICAgICAgT2JqZWN0LmtleXModGFzay5kYXRhKVxuICAgICAgICAgICAgICAubWFwKChrZXk6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgKyAnOicgKyAodGFzay5kYXRhIGFzIGFueSlba2V5XTtcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgLmpvaW4oJywnKTtcbiAgICAgIHJldHVybiBgdHlwZTogJHt0YXNrLnR5cGV9LCBzb3VyY2U6ICR7dGFzay5zb3VyY2V9LCBhcmdzOiB7JHtkYXRhSW5mb319YDtcbiAgICB9KTtcbiAgICBjb25zdCBwZW5kaW5nVGFza3NJbmZvID0gJy0tUGVuZG5nIGFzeW5jIHRhc2tzIGFyZTogWycgKyB0YXNrSW5mbyArICddJztcbiAgICAvLyBjbGVhciB0YXNrc1xuICAgIHRoaXMudGFza3MgPSBbXTtcblxuICAgIHJldHVybiBwZW5kaW5nVGFza3NJbmZvO1xuICB9XG5cbiAgb25Gb3JrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgem9uZVNwZWM6IFpvbmVTcGVjKTpcbiAgICAgIFpvbmUge1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uRm9yaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkZvcmsocGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgem9uZVNwZWMpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmZvcmsodGFyZ2V0Wm9uZSwgem9uZVNwZWMpO1xuICAgIH1cbiAgfVxuXG5cbiAgb25JbnRlcmNlcHQoXG4gICAgICBwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIGRlbGVnYXRlOiBGdW5jdGlvbixcbiAgICAgIHNvdXJjZTogc3RyaW5nKTogRnVuY3Rpb24ge1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW50ZXJjZXB0KSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW50ZXJjZXB0KFxuICAgICAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIGRlbGVnYXRlLCBzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmludGVyY2VwdCh0YXJnZXRab25lLCBkZWxlZ2F0ZSwgc291cmNlKTtcbiAgICB9XG4gIH1cblxuXG4gIG9uSW52b2tlKFxuICAgICAgcGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCBkZWxlZ2F0ZTogRnVuY3Rpb24sXG4gICAgICBhcHBseVRoaXM6IGFueSwgYXBwbHlBcmdzPzogYW55W10sIHNvdXJjZT86IHN0cmluZyk6IGFueSB7XG4gICAgdGhpcy50cnlUcmlnZ2VySGFzVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lKTtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludm9rZSkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludm9rZShcbiAgICAgICAgICBwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCBkZWxlZ2F0ZSwgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuaW52b2tlKHRhcmdldFpvbmUsIGRlbGVnYXRlLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICB9XG4gIH1cblxuICBvbkhhbmRsZUVycm9yKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZXJyb3I6IGFueSk6XG4gICAgICBib29sZWFuIHtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkhhbmRsZUVycm9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uSGFuZGxlRXJyb3IocGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgZXJyb3IpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmhhbmRsZUVycm9yKHRhcmdldFpvbmUsIGVycm9yKTtcbiAgICB9XG4gIH1cblxuICBvblNjaGVkdWxlVGFzayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2spOlxuICAgICAgVGFzayB7XG4gICAgaWYgKHRhc2sudHlwZSAhPT0gJ2V2ZW50VGFzaycpIHtcbiAgICAgIHRoaXMudGFza3MucHVzaCh0YXNrKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25TY2hlZHVsZVRhc2spIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25TY2hlZHVsZVRhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldFpvbmUsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIG9uSW52b2tlVGFzayhcbiAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgdGFzazogVGFzayxcbiAgICAgIGFwcGx5VGhpczogYW55LCBhcHBseUFyZ3M6IGFueSk6IGFueSB7XG4gICAgaWYgKHRhc2sudHlwZSAhPT0gJ2V2ZW50VGFzaycpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbVRhc2tzKHRhc2spO1xuICAgIH1cbiAgICB0aGlzLnRyeVRyaWdnZXJIYXNUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUpO1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW52b2tlVGFzaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludm9rZVRhc2soXG4gICAgICAgICAgcGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmludm9rZVRhc2sodGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIG9uQ2FuY2VsVGFzayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2spOlxuICAgICAgYW55IHtcbiAgICBpZiAodGFzay50eXBlICE9PSAnZXZlbnRUYXNrJykge1xuICAgICAgdGhpcy5yZW1vdmVGcm9tVGFza3ModGFzayk7XG4gICAgfVxuICAgIHRoaXMudHJ5VHJpZ2dlckhhc1Rhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSk7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25DYW5jZWxUYXNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uQ2FuY2VsVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCB0YXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5jYW5jZWxUYXNrKHRhcmdldFpvbmUsIHRhc2spO1xuICAgIH1cbiAgfVxuXG4gIG9uSGFzVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIGhhc1Rhc2tTdGF0ZTogSGFzVGFza1N0YXRlKTogdm9pZCB7XG4gICAgdGhpcy5sYXN0VGFza1N0YXRlID0gaGFzVGFza1N0YXRlO1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSGFzVGFzaykge1xuICAgICAgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSGFzVGFzayhkZWxlZ2F0ZSwgY3VycmVudCwgdGFyZ2V0LCBoYXNUYXNrU3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxlZ2F0ZS5oYXNUYXNrKHRhcmdldCwgaGFzVGFza1N0YXRlKTtcbiAgICB9XG4gIH1cbn1cblxuLy8gRXhwb3J0IHRoZSBjbGFzcyBzbyB0aGF0IG5ldyBpbnN0YW5jZXMgY2FuIGJlIGNyZWF0ZWQgd2l0aCBwcm9wZXJcbi8vIGNvbnN0cnVjdG9yIHBhcmFtcy5cbihab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXSA9IFByb3h5Wm9uZVNwZWM7XG4iXX0=