/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class ProxyZoneSpec {
    constructor(defaultSpecDelegate = null) {
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
    static get() {
        return Zone.current.get('ProxyZoneSpec');
    }
    static isLoaded() {
        return ProxyZoneSpec.get() instanceof ProxyZoneSpec;
    }
    static assertPresent() {
        if (!ProxyZoneSpec.isLoaded()) {
            throw new Error(`Expected to be running in 'ProxyZone', but it was not found.`);
        }
        return ProxyZoneSpec.get();
    }
    setDelegate(delegateSpec) {
        const isNewDelegate = this._delegateSpec !== delegateSpec;
        this._delegateSpec = delegateSpec;
        this.propertyKeys && this.propertyKeys.forEach((key) => delete this.properties[key]);
        this.propertyKeys = null;
        if (delegateSpec && delegateSpec.properties) {
            this.propertyKeys = Object.keys(delegateSpec.properties);
            this.propertyKeys.forEach((k) => this.properties[k] = delegateSpec.properties[k]);
        }
        // if set a new delegateSpec, shoulde check whether need to
        // trigger hasTask or not
        if (isNewDelegate && this.lastTaskState &&
            (this.lastTaskState.macroTask || this.lastTaskState.microTask)) {
            this.isNeedToTriggerHasTask = true;
        }
    }
    getDelegate() {
        return this._delegateSpec;
    }
    resetDelegate() {
        const delegateSpec = this.getDelegate();
        this.setDelegate(this.defaultSpecDelegate);
    }
    tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone) {
        if (this.isNeedToTriggerHasTask && this.lastTaskState) {
            // last delegateSpec has microTask or macroTask
            // should call onHasTask in current delegateSpec
            this.isNeedToTriggerHasTask = false;
            this.onHasTask(parentZoneDelegate, currentZone, targetZone, this.lastTaskState);
        }
    }
    removeFromTasks(task) {
        if (!this.tasks) {
            return;
        }
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i] === task) {
                this.tasks.splice(i, 1);
                return;
            }
        }
    }
    getAndClearPendingTasksInfo() {
        if (this.tasks.length === 0) {
            return '';
        }
        const taskInfo = this.tasks.map((task) => {
            const dataInfo = task.data &&
                Object.keys(task.data)
                    .map((key) => {
                    return key + ':' + task.data[key];
                })
                    .join(',');
            return `type: ${task.type}, source: ${task.source}, args: {${dataInfo}}`;
        });
        const pendingTasksInfo = '--Pendng async tasks are: [' + taskInfo + ']';
        // clear tasks
        this.tasks = [];
        return pendingTasksInfo;
    }
    onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec) {
        if (this._delegateSpec && this._delegateSpec.onFork) {
            return this._delegateSpec.onFork(parentZoneDelegate, currentZone, targetZone, zoneSpec);
        }
        else {
            return parentZoneDelegate.fork(targetZone, zoneSpec);
        }
    }
    onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source) {
        if (this._delegateSpec && this._delegateSpec.onIntercept) {
            return this._delegateSpec.onIntercept(parentZoneDelegate, currentZone, targetZone, delegate, source);
        }
        else {
            return parentZoneDelegate.intercept(targetZone, delegate, source);
        }
    }
    onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
        this.tryTriggerHasTask(parentZoneDelegate, currentZone, targetZone);
        if (this._delegateSpec && this._delegateSpec.onInvoke) {
            return this._delegateSpec.onInvoke(parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source);
        }
        else {
            return parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source);
        }
    }
    onHandleError(parentZoneDelegate, currentZone, targetZone, error) {
        if (this._delegateSpec && this._delegateSpec.onHandleError) {
            return this._delegateSpec.onHandleError(parentZoneDelegate, currentZone, targetZone, error);
        }
        else {
            return parentZoneDelegate.handleError(targetZone, error);
        }
    }
    onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
        if (task.type !== 'eventTask') {
            this.tasks.push(task);
        }
        if (this._delegateSpec && this._delegateSpec.onScheduleTask) {
            return this._delegateSpec.onScheduleTask(parentZoneDelegate, currentZone, targetZone, task);
        }
        else {
            return parentZoneDelegate.scheduleTask(targetZone, task);
        }
    }
    onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
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
    }
    onCancelTask(parentZoneDelegate, currentZone, targetZone, task) {
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
    }
    onHasTask(delegate, current, target, hasTaskState) {
        this.lastTaskState = hasTaskState;
        if (this._delegateSpec && this._delegateSpec.onHasTask) {
            this._delegateSpec.onHasTask(delegate, current, target, hasTaskState);
        }
        else {
            delegate.hasTask(target, hasTaskState);
        }
    }
}
// Export the class so that new instances can be created with proper
// constructor params.
Zone['ProxyZoneSpec'] = ProxyZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJveHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi96b25lLXNwZWMvcHJveHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsTUFBTSxhQUFhO0lBNEJqQixZQUFvQixzQkFBcUMsSUFBSTtRQUF6Qyx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXNCO1FBM0I3RCxTQUFJLEdBQVcsV0FBVyxDQUFDO1FBRW5CLGtCQUFhLEdBQWtCLElBQUksQ0FBQztRQUU1QyxlQUFVLEdBQXVCLEVBQUMsZUFBZSxFQUFFLElBQUksRUFBQyxDQUFDO1FBQ3pELGlCQUFZLEdBQWtCLElBQUksQ0FBQztRQUVuQyxrQkFBYSxHQUFzQixJQUFJLENBQUM7UUFDeEMsMkJBQXNCLEdBQUcsS0FBSyxDQUFDO1FBRXZCLFVBQUssR0FBVyxFQUFFLENBQUM7UUFrQnpCLElBQUksQ0FBQyxXQUFXLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBakJELE1BQU0sQ0FBQyxHQUFHO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsTUFBTSxDQUFDLFFBQVE7UUFDYixPQUFPLGFBQWEsQ0FBQyxHQUFHLEVBQUUsWUFBWSxhQUFhLENBQUM7SUFDdEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxhQUFhO1FBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDN0IsTUFBTSxJQUFJLEtBQUssQ0FBQyw4REFBOEQsQ0FBQyxDQUFDO1NBQ2pGO1FBQ0QsT0FBTyxhQUFhLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQU1ELFdBQVcsQ0FBQyxZQUEyQjtRQUNyQyxNQUFNLGFBQWEsR0FB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LElBQUksQ0FBQyxhQUFhLENBQUMsWUFBWSxFQUFFO1lBQ3pELE9BQU8sSUFBSSxDQUFDLGFBQWEsQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztTQUMzRjthQUFNO1lBQ0wsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3hEO0lBQ0gsQ0FBQztJQUVELFNBQVMsQ0FBQyxRQUFzQixFQUFFLE9BQWEsRUFBRSxNQUFZLEVBQUUsWUFBMEI7UUFDdkYsSUFBSSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7UUFDbEMsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFO1lBQ3RELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLFFBQVEsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFlBQVksQ0FBQyxDQUFDO1NBQ3ZFO2FBQU07WUFDTCxRQUFRLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxZQUFZLENBQUMsQ0FBQztTQUN4QztJQUNILENBQUM7Q0FDRjtBQUVELG9FQUFvRTtBQUNwRSxzQkFBc0I7QUFDckIsSUFBWSxDQUFDLGVBQWUsQ0FBQyxHQUFHLGFBQWEsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmNsYXNzIFByb3h5Wm9uZVNwZWMgaW1wbGVtZW50cyBab25lU3BlYyB7XG4gIG5hbWU6IHN0cmluZyA9ICdQcm94eVpvbmUnO1xuXG4gIHByaXZhdGUgX2RlbGVnYXRlU3BlYzogWm9uZVNwZWN8bnVsbCA9IG51bGw7XG5cbiAgcHJvcGVydGllczoge1trOiBzdHJpbmddOiBhbnl9ID0geydQcm94eVpvbmVTcGVjJzogdGhpc307XG4gIHByb3BlcnR5S2V5czogc3RyaW5nW118bnVsbCA9IG51bGw7XG5cbiAgbGFzdFRhc2tTdGF0ZTogSGFzVGFza1N0YXRlfG51bGwgPSBudWxsO1xuICBpc05lZWRUb1RyaWdnZXJIYXNUYXNrID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSB0YXNrczogVGFza1tdID0gW107XG5cbiAgc3RhdGljIGdldCgpOiBQcm94eVpvbmVTcGVjIHtcbiAgICByZXR1cm4gWm9uZS5jdXJyZW50LmdldCgnUHJveHlab25lU3BlYycpO1xuICB9XG5cbiAgc3RhdGljIGlzTG9hZGVkKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBQcm94eVpvbmVTcGVjLmdldCgpIGluc3RhbmNlb2YgUHJveHlab25lU3BlYztcbiAgfVxuXG4gIHN0YXRpYyBhc3NlcnRQcmVzZW50KCk6IFByb3h5Wm9uZVNwZWMge1xuICAgIGlmICghUHJveHlab25lU3BlYy5pc0xvYWRlZCgpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEV4cGVjdGVkIHRvIGJlIHJ1bm5pbmcgaW4gJ1Byb3h5Wm9uZScsIGJ1dCBpdCB3YXMgbm90IGZvdW5kLmApO1xuICAgIH1cbiAgICByZXR1cm4gUHJveHlab25lU3BlYy5nZXQoKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVmYXVsdFNwZWNEZWxlZ2F0ZTogWm9uZVNwZWN8bnVsbCA9IG51bGwpIHtcbiAgICB0aGlzLnNldERlbGVnYXRlKGRlZmF1bHRTcGVjRGVsZWdhdGUpO1xuICB9XG5cbiAgc2V0RGVsZWdhdGUoZGVsZWdhdGVTcGVjOiBab25lU3BlY3xudWxsKSB7XG4gICAgY29uc3QgaXNOZXdEZWxlZ2F0ZSA9IHRoaXMuX2RlbGVnYXRlU3BlYyAhPT0gZGVsZWdhdGVTcGVjO1xuICAgIHRoaXMuX2RlbGVnYXRlU3BlYyA9IGRlbGVnYXRlU3BlYztcbiAgICB0aGlzLnByb3BlcnR5S2V5cyAmJiB0aGlzLnByb3BlcnR5S2V5cy5mb3JFYWNoKChrZXkpID0+IGRlbGV0ZSB0aGlzLnByb3BlcnRpZXNba2V5XSk7XG4gICAgdGhpcy5wcm9wZXJ0eUtleXMgPSBudWxsO1xuICAgIGlmIChkZWxlZ2F0ZVNwZWMgJiYgZGVsZWdhdGVTcGVjLnByb3BlcnRpZXMpIHtcbiAgICAgIHRoaXMucHJvcGVydHlLZXlzID0gT2JqZWN0LmtleXMoZGVsZWdhdGVTcGVjLnByb3BlcnRpZXMpO1xuICAgICAgdGhpcy5wcm9wZXJ0eUtleXMuZm9yRWFjaCgoaykgPT4gdGhpcy5wcm9wZXJ0aWVzW2tdID0gZGVsZWdhdGVTcGVjLnByb3BlcnRpZXMhW2tdKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0IGEgbmV3IGRlbGVnYXRlU3BlYywgc2hvdWxkZSBjaGVjayB3aGV0aGVyIG5lZWQgdG9cbiAgICAvLyB0cmlnZ2VyIGhhc1Rhc2sgb3Igbm90XG4gICAgaWYgKGlzTmV3RGVsZWdhdGUgJiYgdGhpcy5sYXN0VGFza1N0YXRlICYmXG4gICAgICAgICh0aGlzLmxhc3RUYXNrU3RhdGUubWFjcm9UYXNrIHx8IHRoaXMubGFzdFRhc2tTdGF0ZS5taWNyb1Rhc2spKSB7XG4gICAgICB0aGlzLmlzTmVlZFRvVHJpZ2dlckhhc1Rhc2sgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGdldERlbGVnYXRlKCkge1xuICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWM7XG4gIH1cblxuXG4gIHJlc2V0RGVsZWdhdGUoKSB7XG4gICAgY29uc3QgZGVsZWdhdGVTcGVjID0gdGhpcy5nZXREZWxlZ2F0ZSgpO1xuICAgIHRoaXMuc2V0RGVsZWdhdGUodGhpcy5kZWZhdWx0U3BlY0RlbGVnYXRlKTtcbiAgfVxuXG4gIHRyeVRyaWdnZXJIYXNUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSkge1xuICAgIGlmICh0aGlzLmlzTmVlZFRvVHJpZ2dlckhhc1Rhc2sgJiYgdGhpcy5sYXN0VGFza1N0YXRlKSB7XG4gICAgICAvLyBsYXN0IGRlbGVnYXRlU3BlYyBoYXMgbWljcm9UYXNrIG9yIG1hY3JvVGFza1xuICAgICAgLy8gc2hvdWxkIGNhbGwgb25IYXNUYXNrIGluIGN1cnJlbnQgZGVsZWdhdGVTcGVjXG4gICAgICB0aGlzLmlzTmVlZFRvVHJpZ2dlckhhc1Rhc2sgPSBmYWxzZTtcbiAgICAgIHRoaXMub25IYXNUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIHRoaXMubGFzdFRhc2tTdGF0ZSk7XG4gICAgfVxuICB9XG5cbiAgcmVtb3ZlRnJvbVRhc2tzKHRhc2s6IFRhc2spIHtcbiAgICBpZiAoIXRoaXMudGFza3MpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy50YXNrc1tpXSA9PT0gdGFzaykge1xuICAgICAgICB0aGlzLnRhc2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldEFuZENsZWFyUGVuZGluZ1Rhc2tzSW5mbygpIHtcbiAgICBpZiAodGhpcy50YXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiAnJztcbiAgICB9XG4gICAgY29uc3QgdGFza0luZm8gPSB0aGlzLnRhc2tzLm1hcCgodGFzazogVGFzaykgPT4ge1xuICAgICAgY29uc3QgZGF0YUluZm8gPSB0YXNrLmRhdGEgJiZcbiAgICAgICAgICBPYmplY3Qua2V5cyh0YXNrLmRhdGEpXG4gICAgICAgICAgICAgIC5tYXAoKGtleTogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGtleSArICc6JyArICh0YXNrLmRhdGEgYXMgYW55KVtrZXldO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuam9pbignLCcpO1xuICAgICAgcmV0dXJuIGB0eXBlOiAke3Rhc2sudHlwZX0sIHNvdXJjZTogJHt0YXNrLnNvdXJjZX0sIGFyZ3M6IHske2RhdGFJbmZvfX1gO1xuICAgIH0pO1xuICAgIGNvbnN0IHBlbmRpbmdUYXNrc0luZm8gPSAnLS1QZW5kbmcgYXN5bmMgdGFza3MgYXJlOiBbJyArIHRhc2tJbmZvICsgJ10nO1xuICAgIC8vIGNsZWFyIHRhc2tzXG4gICAgdGhpcy50YXNrcyA9IFtdO1xuXG4gICAgcmV0dXJuIHBlbmRpbmdUYXNrc0luZm87XG4gIH1cblxuICBvbkZvcmsocGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB6b25lU3BlYzogWm9uZVNwZWMpOlxuICAgICAgWm9uZSB7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25Gb3JrKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uRm9yayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCB6b25lU3BlYyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuZm9yayh0YXJnZXRab25lLCB6b25lU3BlYyk7XG4gICAgfVxuICB9XG5cblxuICBvbkludGVyY2VwdChcbiAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZGVsZWdhdGU6IEZ1bmN0aW9uLFxuICAgICAgc291cmNlOiBzdHJpbmcpOiBGdW5jdGlvbiB7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnRlcmNlcHQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnRlcmNlcHQoXG4gICAgICAgICAgcGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIHNvdXJjZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuaW50ZXJjZXB0KHRhcmdldFpvbmUsIGRlbGVnYXRlLCBzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG5cbiAgb25JbnZva2UoXG4gICAgICBwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIGRlbGVnYXRlOiBGdW5jdGlvbixcbiAgICAgIGFwcGx5VGhpczogYW55LCBhcHBseUFyZ3M/OiBhbnlbXSwgc291cmNlPzogc3RyaW5nKTogYW55IHtcbiAgICB0aGlzLnRyeVRyaWdnZXJIYXNUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUpO1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW52b2tlKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW52b2tlKFxuICAgICAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIGRlbGVnYXRlLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2UodGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgIH1cbiAgfVxuXG4gIG9uSGFuZGxlRXJyb3IocGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCBlcnJvcjogYW55KTpcbiAgICAgIGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLl9kZWxlZ2F0ZVNwZWMgJiYgdGhpcy5fZGVsZWdhdGVTcGVjLm9uSGFuZGxlRXJyb3IpIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25IYW5kbGVFcnJvcihwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCBlcnJvcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuaGFuZGxlRXJyb3IodGFyZ2V0Wm9uZSwgZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2NoZWR1bGVUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgdGFzazogVGFzayk6XG4gICAgICBUYXNrIHtcbiAgICBpZiAodGFzay50eXBlICE9PSAnZXZlbnRUYXNrJykge1xuICAgICAgdGhpcy50YXNrcy5wdXNoKHRhc2spO1xuICAgIH1cbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vblNjaGVkdWxlVGFzaykge1xuICAgICAgcmV0dXJuIHRoaXMuX2RlbGVnYXRlU3BlYy5vblNjaGVkdWxlVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCB0YXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgfVxuICB9XG5cbiAgb25JbnZva2VUYXNrKFxuICAgICAgcGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrLFxuICAgICAgYXBwbHlUaGlzOiBhbnksIGFwcGx5QXJnczogYW55KTogYW55IHtcbiAgICBpZiAodGFzay50eXBlICE9PSAnZXZlbnRUYXNrJykge1xuICAgICAgdGhpcy5yZW1vdmVGcm9tVGFza3ModGFzayk7XG4gICAgfVxuICAgIHRoaXMudHJ5VHJpZ2dlckhhc1Rhc2socGFyZW50Wm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZSwgdGFyZ2V0Wm9uZSk7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25JbnZva2VUYXNrKSB7XG4gICAgICByZXR1cm4gdGhpcy5fZGVsZWdhdGVTcGVjLm9uSW52b2tlVGFzayhcbiAgICAgICAgICBwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lLCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuaW52b2tlVGFzayh0YXJnZXRab25lLCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgfVxuICB9XG5cbiAgb25DYW5jZWxUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgdGFzazogVGFzayk6XG4gICAgICBhbnkge1xuICAgIGlmICh0YXNrLnR5cGUgIT09ICdldmVudFRhc2snKSB7XG4gICAgICB0aGlzLnJlbW92ZUZyb21UYXNrcyh0YXNrKTtcbiAgICB9XG4gICAgdGhpcy50cnlUcmlnZ2VySGFzVGFzayhwYXJlbnRab25lRGVsZWdhdGUsIGN1cnJlbnRab25lLCB0YXJnZXRab25lKTtcbiAgICBpZiAodGhpcy5fZGVsZWdhdGVTcGVjICYmIHRoaXMuX2RlbGVnYXRlU3BlYy5vbkNhbmNlbFRhc2spIHtcbiAgICAgIHJldHVybiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25DYW5jZWxUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmUsIHRhcmdldFpvbmUsIHRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgfVxuICB9XG5cbiAgb25IYXNUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgaGFzVGFza1N0YXRlOiBIYXNUYXNrU3RhdGUpOiB2b2lkIHtcbiAgICB0aGlzLmxhc3RUYXNrU3RhdGUgPSBoYXNUYXNrU3RhdGU7XG4gICAgaWYgKHRoaXMuX2RlbGVnYXRlU3BlYyAmJiB0aGlzLl9kZWxlZ2F0ZVNwZWMub25IYXNUYXNrKSB7XG4gICAgICB0aGlzLl9kZWxlZ2F0ZVNwZWMub25IYXNUYXNrKGRlbGVnYXRlLCBjdXJyZW50LCB0YXJnZXQsIGhhc1Rhc2tTdGF0ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGVnYXRlLmhhc1Rhc2sodGFyZ2V0LCBoYXNUYXNrU3RhdGUpO1xuICAgIH1cbiAgfVxufVxuXG4vLyBFeHBvcnQgdGhlIGNsYXNzIHNvIHRoYXQgbmV3IGluc3RhbmNlcyBjYW4gYmUgY3JlYXRlZCB3aXRoIHByb3BlclxuLy8gY29uc3RydWN0b3IgcGFyYW1zLlxuKFpvbmUgYXMgYW55KVsnUHJveHlab25lU3BlYyddID0gUHJveHlab25lU3BlYztcbiJdfQ==