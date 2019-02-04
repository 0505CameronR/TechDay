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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi96b25lLXNwZWMvcHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0g7SUE0QkUsdUJBQW9CLG1CQUF5QztRQUF6QyxvQ0FBQSxFQUFBLDBCQUF5QztRQUF6Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBM0I3RCxTQUFJLEdBQVcsV0FBVyxDQUFDO1FBRW5CLGtCQUFhLEdBQWtCLElBQUksQ0FBQztRQUU1QyxlQUFVLEdBQXVCLEVBQUMsZUFBZSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3pELGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUVuQyxrQkFBYSxHQUFzQixJQUFJLENBQUM7UUFDeEMsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBRXZCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFrQnpCLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBakJNLGlCQUFHLEdBQVY7UUFDRSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFTSxzQkFBUSxHQUFmO1FBQ0UsT0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLFlBQVksYUFBYSxDQUFDO0lBQ3RELENBQUM7SUFFTSwyQkFBYSxHQUFwQjtRQUNFLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsT0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQU1ELG1DQUFXLEdBQVgsVUFBWSxZQUEyQjtRQUF2QyxpQkFlQztRQWRD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QUMsaUJBQWlCLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1FBQ3BFLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRTtZQUN6RCxPQUFPLElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxDQUFDLGtCQUFrQixFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7U0FDM0Y7YUFBTTtZQUNMLE9BQU8sa0JBQWtCLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFRCxpQ0FBUyxHQUFULFVBQVUsUUFBc0IsRUFBRSxPQUFhLEVBQUUsTUFBWSxFQUFFLFlBQTBCO1FBQ3ZGLElBQUksQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO1FBQ2xDLElBQUksSUFBSSxDQUFDLGFBQWEsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRTtZQUN0RCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztTQUN2RTthQUFNO1lBQ0wsUUFBUSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsWUFBWSxDQUFDLENBQUM7U0FDeEM7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBL0xELElBK0xDO0FBRUQsb0VBQW9FO0FBQ3BFLHNCQUFzQjtBQUNyQixJQUFZLENBQUMsZUFBZSxDQUFDLEdBQUcsYUFBYSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuY2xhc3MgUHJveHlab25lU3BlYyBpbXBsZW1lbnRzIFpvbmVTcGVjIHtcbiAgbmFtZTogc3RyaW5nID0gJ1Byb3h5Wm9uZSc7XG5cbiAgcHJpdmF0ZSBfZGVsZWdhdGVTcGVjOiBab25lU3BlY3xudWxsID0gbnVsbDtcblxuICBwcm9wZXJ0aWVzOiB7W2s6IHN0cmluZ106IGFueX0gPSB7J1Byb3h5Wm9uZVNwZWMnOiB0aGlzfTtcbiAgcHJvcGVydHlLZXlzOiBzdHJpbmdbXXxudWxsID0gbnVsbDtcblxuICBsYXN0VGFza1N0YXRlOiBIYXNUYXNrU3RhdGV8bnVsbCA9IG51bGw7XG4gIGlzTmVlZFRvVHJpZ2dlckhhc1Rhc2sgPSBmYWxzZTtcblxuICBwcml2YXRlIHRhc2tzOiBUYXNrW10gPSBbXTtcblxuICBzdGF0aWMgZ2V0KCk6IFByb3h5Wm9uZVNwZWMge1xuICAgIHJldHVybiBab25lLmN1cnJlbnQuZ2V0KCdQcm94eVpvbmVTcGVjJyk7XG4gIH1cblxuICBzdGF0aWMgaXNMb2FkZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIFByb3h5Wm9uZVNwZWMuZ2V0KCkgaW5zdGFuY2VvZiBQcm94eVpvbmVTcGVjO1xuICB9XG5cbiAgc3RhdGljIGFzc2VydFByZXNlbnQoKTogUHJveHlab25lU3BlYyB7XG4gICAgaWYgKCFQcm94eVpvbmVTcGVjLmlzTG9hZGVkKCkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgRXhwZWN0ZWQgdG8gYmUgcnVubmluZyBpbiAnUHJveHlab25lJywgYnV0IGl0IHdhcyBub3QgZm91bmQuYCk7XG4gICAgfVxuICAgIHJldHVybiBQcm94eVpvbmVTcGVjLmdldCgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkZWZhdWx0U3BlY0RlbGVnYXRlOiBab25lU3BlY3xudWxsID0gbnVsbCkge1xuICAgIHRoaXMuc2V0RGVsZWdhdGUoZGVmYXVsdFNwZWNEZWxlZ2F0ZSk7XG4gIH1cblxuICBzZXREZWxlZ2F0ZShkZWxlZ2F0ZVNwZWM6IFpvbmVTcGVjfG51bGwpIHtcbiAgICBjb25zdCBpc05ld0RlbGVnYXRlID0gdGhpcy5fZGVsZWdhdGVTcGVjICE9PSBkZWxlZ2F0ZVNwZWM7XG4gICAgdGhpcy5fZGVsZWdhdGVTcGVjID0gZGVsZWdhdGVTcGVjO1xuICAgIHRoaXMucHJvcGVydHlLZXlzICYmIHRoaXMucHJvcGVydHlLZXlzLmZvckVhY2goKGtleSkgPT4gZGVsZXRlIHRoaXMucHJvcGVydGllc1trZXldKTtcbiAgICB0aGlzLnByb3BlcnR5S2V5cyA9IG51bGw7XG4gICAgaWYgKGRlbGVnYXRlU3BlYyAmJiBkZWxlZ2F0ZVNwZWMucHJvcGVydGllcykge1xuICAgICAgdGhpcy5wcm9wZXJ0eUtleXMgPSBPYmplY3Qua2V5cyhkZWxlZ2F0ZVNwZWMucHJvcGVydGllcyk7XG4gICAgICB0aGlzLnByb3BlcnR5S2V5cy5mb3JFYWNoKChrKSA9PiB0aGlzLnByb3BlcnRpZXNba10gPSBkZWxlZ2F0ZVNwZWMucHJvcGVydGllcyFba10pO1xuICAgIH1cbiAgICAvLyBpZiBzZXQgYSBuZXcgZGVsZWdhdGVTcGVjLCBzaG91bGRlIGNoZWNrIHdoZXRoZXIgbmVlZCB0b1xuICAgIC8vIHRyaWdnZXIgaGFzVGFzayBvciBub3RcbiAgICBpZiAoaXNOZXdEZWxlZ2F0ZSAmJiB0aGlzLmxhc3RUYXNrU3RhdGUgJiZcbiAgICAgICAgKHRoaXMubGFzdFRhc2tTdGF0ZS5tYWNyb1Rhc2sgfHwgdGhpcy5sYXN0VGFza1N0YXRlLm1pY3JvVGFzaykpIHtcbiAgICAgIHRoaXMuaXNOZWVkVG9UcmlnZ2VySGFzVGFzayA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgZ2V0RGVsZWdhdGUoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYztcbiAgfVxuXG5cbiAgcmVzZXREZWxlZ2F0ZSgpIHtcbiAgICBjb25zdCBkZWxlZ2F0ZVNwZWMgPSB0aGlzLmdldERlbGVnYXRlKCk7XG4gICAgdGhpcy5zZXREZWxlZ2F0ZSh0aGlzLmRlZmF1bHRTcGVjRGVsZWdhdGUpO1xuICB9XG5cbiAgdHJ5VHJpZ2dlckhhc1Rhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lKSB7XG4gICAgaWYgKHRoaXMuaXNOZWVkVG9UcmlnZ2VySGFzVGFzayAmJiB0aGlzLmxhc3RUYXNrU3RhdGUpIHtcbiAgICAgIC8vIGxhc3QgZGVsZWdhdGVTcGVjIGhhcyBtaWNyb1Rhc2sgb3IgbWFjcm9UYXNrXG4gICAgICAvLyBzaG91bGQgY2FsbCBvbkhhc1Rhc2sgaW4gY3VycmVudCBkZWxlZ2F0ZVNwZWNcbiAgICAgIHRoaXMuaXNOZWVkVG9UcmlnZ2VySGFzVGFzayA9IGZhbHNlO1xuICAgICAgdGhpcy5vbkhhc1Rhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgdGhpcy5sYXN0VGFza1N0YXRlKTtcbiAgICB9XG4gIH1cblxuICByZW1vdmVGcm9tVGFza3ModGFzazogVGFzaykge1xuICAgIGlmICghdGhpcy50YXNrcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmICh0aGlzLnRhc2tzW2ldID09PSB0YXNrKSB7XG4gICAgICAgIHRoaXMudGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZ2V0QW5kQ2xlYXJQZW5kaW5nVGFza3NJbmZvKCkge1xuICAgIGlmICh0aGlzLnRhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuICcnO1xuICAgIH1cbiAgICBjb25zdCB0YXNrSW5mbyA9IHRoaXMudGFza3MubWFwKCh0YXNrOiBUYXNrKSA9PiB7XG4gICAgICBjb25zdCBkYXRhSW5mbyA9IHRhc2suZGF0YSAmJlxuICAgICAgICAgIE9iamVjdC5rZXlzKHRhc2suZGF0YSlcbiAgICAgICAgICAgICAgLm1hcCgoa2V5OiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4ga2V5ICsgJzonICsgKHRhc2suZGF0YSBhcyBhbnkpW2tleV07XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5qb2luKCcsJyk7XG4gICAgICByZXR1cm4gYHR5cGU6ICR7dGFzay50eXBlfSwgc291cmNlOiAke3Rhc2suc291cmNlfSwgYXJnczogeyR7ZGF0YUluZm99fWA7XG4gICAgfSk7XG4gICAgY29uc3QgcGVuZGluZ1Rhc2tzSW5mbyA9ICctLVBlbmRuZyBhc3luYyB0YXNrcyBhcmU6IFsnICsgdGFza0luZm8gKyAnXSc7XG4gICAgLy8gY2xlYXIgdGFza3NcbiAgICB0aGlzLnRhc2tzID0gW107XG5cbiAgICByZXR1cm4gcGVuZGluZ1Rhc2tzSW5mbztcbiAgfVxuXG4gIG9uRm9yayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHpvbmVTcGVjOiBab25lU3BlYyk6XG4gICAgICBab25lIHtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkZvcmspIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25Gb3JrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIHpvbmVTcGVjKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5mb3JrKHRhcmdldFpvbmUsIHpvbmVTcGVjKTtcbiAgICB9XG4gIH1cblxuXG4gIG9uSW50ZXJjZXB0KFxuICAgICAgcGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCBkZWxlZ2F0ZTogRnVuY3Rpb24sXG4gICAgICBzb3VyY2U6IHN0cmluZyk6IEZ1bmN0aW9uIHtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludGVyY2VwdCkge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludGVyY2VwdChcbiAgICAgICAgICBwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCBkZWxlZ2F0ZSwgc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnRlcmNlcHQodGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIHNvdXJjZSk7XG4gICAgfVxuICB9XG5cblxuICBvbkludm9rZShcbiAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZGVsZWdhdGU6IEZ1bmN0aW9uLFxuICAgICAgYXBwbHlUaGlzOiBhbnksIGFwcGx5QXJncz86IGFueVtdLCBzb3VyY2U/OiBzdHJpbmcpOiBhbnkge1xuICAgIHRoaXMudHJ5VHJpZ2dlckhhc1Rhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSk7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnZva2UpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnZva2UoXG4gICAgICAgICAgcGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmludm9rZSh0YXJnZXRab25lLCBkZWxlZ2F0ZSwgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSk7XG4gICAgfVxuICB9XG5cbiAgb25IYW5kbGVFcnJvcihwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIGVycm9yOiBhbnkpOlxuICAgICAgYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25IYW5kbGVFcnJvcikge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkhhbmRsZUVycm9yKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIGVycm9yKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0YXJnZXRab25lLCBlcnJvcik7XG4gICAgfVxuICB9XG5cbiAgb25TY2hlZHVsZVRhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrKTpcbiAgICAgIFRhc2sge1xuICAgIGlmICh0YXNrLnR5cGUgIT09ICdldmVudFRhc2snKSB7XG4gICAgICB0aGlzLnRhc2tzLnB1c2godGFzayk7XG4gICAgfVxuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uU2NoZWR1bGVUYXNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uU2NoZWR1bGVUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIHRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXRab25lLCB0YXNrKTtcbiAgICB9XG4gIH1cblxuICBvbkludm9rZVRhc2soXG4gICAgICBwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2ssXG4gICAgICBhcHBseVRoaXM6IGFueSwgYXBwbHlBcmdzOiBhbnkpOiBhbnkge1xuICAgIGlmICh0YXNrLnR5cGUgIT09ICdldmVudFRhc2snKSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21UYXNrcyh0YXNrKTtcbiAgICB9XG4gICAgdGhpcy50cnlUcmlnZ2VySGFzVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lKTtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkludm9rZVRhc2spIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnZva2VUYXNrKFxuICAgICAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICB9XG4gIH1cblxuICBvbkNhbmNlbFRhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrKTpcbiAgICAgIGFueSB7XG4gICAgaWYgKHRhc2sudHlwZSAhPT0gJ2V2ZW50VGFzaycpIHtcbiAgICAgIHRoaXMucmVtb3ZlRnJvbVRhc2tzKHRhc2spO1xuICAgIH1cbiAgICB0aGlzLnRyeVRyaWdnZXJIYXNUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUpO1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uQ2FuY2VsVGFzaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkNhbmNlbFRhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXRab25lLCB0YXNrKTtcbiAgICB9XG4gIH1cblxuICBvbkhhc1Rhc2soZGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudDogWm9uZSwgdGFyZ2V0OiBab25lLCBoYXNUYXNrU3RhdGU6IEhhc1Rhc2tTdGF0ZSk6IHZvaWQge1xuICAgIHRoaXMubGFzdFRhc2tTdGF0ZSA9IGhhc1Rhc2tTdGF0ZTtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkhhc1Rhc2spIHtcbiAgICAgIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkhhc1Rhc2soZGVsZWdhdGUsIGN1cnJlbnQsIHRhcmdldCwgaGFzVGFza1N0YXRlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVsZWdhdGUuaGFzVGFzayh0YXJnZXQsIGhhc1Rhc2tTdGF0ZSk7XG4gICAgfVxuICB9XG59XG5cbi8vIEV4cG9ydCB0aGUgY2xhc3Mgc28gdGhhdCBuZXcgaW5zdGFuY2VzIGNhbiBiZSBjcmVhdGVkIHdpdGggcHJvcGVyXG4vLyBjb25zdHJ1Y3RvciBwYXJhbXMuXG4oWm9uZSBhcyBhbnkpWydQcm94eVpvbmVTcGVjJ10gPSBQcm94eVpvbmVTcGVjO1xuIl19