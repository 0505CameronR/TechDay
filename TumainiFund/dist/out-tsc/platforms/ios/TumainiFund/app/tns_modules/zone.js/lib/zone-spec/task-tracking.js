/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A `TaskTrackingZoneSpec` allows one to track all outstanding Tasks.
 *
 * This is useful in tests. For example to see which tasks are preventing a test from completing
 * or an automated way of releasing all of the event listeners at the end of the test.
 */
class TaskTrackingZoneSpec {
    constructor() {
        this.name = 'TaskTrackingZone';
        this.microTasks = [];
        this.macroTasks = [];
        this.eventTasks = [];
        this.properties = { 'TaskTrackingZone': this };
    }
    static get() {
        return Zone.current.get('TaskTrackingZone');
    }
    getTasksFor(type) {
        switch (type) {
            case 'microTask':
                return this.microTasks;
            case 'macroTask':
                return this.macroTasks;
            case 'eventTask':
                return this.eventTasks;
        }
        throw new Error('Unknown task format: ' + type);
    }
    onScheduleTask(parentZoneDelegate, currentZone, targetZone, task) {
        task['creationLocation'] = new Error(`Task '${task.type}' from '${task.source}'.`);
        const tasks = this.getTasksFor(task.type);
        tasks.push(task);
        return parentZoneDelegate.scheduleTask(targetZone, task);
    }
    onCancelTask(parentZoneDelegate, currentZone, targetZone, task) {
        const tasks = this.getTasksFor(task.type);
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.cancelTask(targetZone, task);
    }
    onInvokeTask(parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (task.type === 'eventTask')
            return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        const tasks = this.getTasksFor(task.type);
        for (let i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
    }
    clearEvents() {
        while (this.eventTasks.length) {
            Zone.current.cancelTask(this.eventTasks[0]);
        }
    }
}
// Export the class so that new instances can be created with proper
// constructor params.
Zone['TaskTrackingZoneSpec'] = TaskTrackingZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay10cmFja2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3pvbmUtc3BlYy90YXNrLXRyYWNraW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIOzs7OztHQUtHO0FBQ0gsTUFBTSxvQkFBb0I7SUFBMUI7UUFDRSxTQUFJLEdBQUcsa0JBQWtCLENBQUM7UUFDMUIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsZUFBVSxHQUF5QixFQUFDLGtCQUFrQixFQUFFLElBQUksRUFBQyxDQUFDO0lBMERoRSxDQUFDO0lBeERDLE1BQU0sQ0FBQyxHQUFHO1FBQ1IsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTyxXQUFXLENBQUMsSUFBWTtRQUM5QixRQUFRLElBQUksRUFBRTtZQUNaLEtBQUssV0FBVztnQkFDZCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7WUFDekIsS0FBSyxXQUFXO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QixLQUFLLFdBQVc7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1NBQzFCO1FBQ0QsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsY0FBYyxDQUFDLGtCQUFnQyxFQUFFLFdBQWlCLEVBQUUsVUFBZ0IsRUFBRSxJQUFVO1FBRTdGLElBQVksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLFNBQVMsSUFBSSxDQUFDLElBQUksV0FBVyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztRQUM1RixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sa0JBQWtCLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsWUFBWSxDQUFDLGtCQUFnQyxFQUFFLFdBQWlCLEVBQUUsVUFBZ0IsRUFBRSxJQUFVO1FBRTVGLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDcEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU07YUFDUDtTQUNGO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxZQUFZLENBQ1Isa0JBQWdDLEVBQUUsV0FBaUIsRUFBRSxVQUFnQixFQUFFLElBQVUsRUFDakYsU0FBYyxFQUFFLFNBQWM7UUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVc7WUFDM0IsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0UsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsV0FBVztRQUNULE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztDQUNGO0FBRUQsb0VBQW9FO0FBQ3BFLHNCQUFzQjtBQUNyQixJQUFZLENBQUMsc0JBQXNCLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBBIGBUYXNrVHJhY2tpbmdab25lU3BlY2AgYWxsb3dzIG9uZSB0byB0cmFjayBhbGwgb3V0c3RhbmRpbmcgVGFza3MuXG4gKlxuICogVGhpcyBpcyB1c2VmdWwgaW4gdGVzdHMuIEZvciBleGFtcGxlIHRvIHNlZSB3aGljaCB0YXNrcyBhcmUgcHJldmVudGluZyBhIHRlc3QgZnJvbSBjb21wbGV0aW5nXG4gKiBvciBhbiBhdXRvbWF0ZWQgd2F5IG9mIHJlbGVhc2luZyBhbGwgb2YgdGhlIGV2ZW50IGxpc3RlbmVycyBhdCB0aGUgZW5kIG9mIHRoZSB0ZXN0LlxuICovXG5jbGFzcyBUYXNrVHJhY2tpbmdab25lU3BlYyBpbXBsZW1lbnRzIFpvbmVTcGVjIHtcbiAgbmFtZSA9ICdUYXNrVHJhY2tpbmdab25lJztcbiAgbWljcm9UYXNrczogVGFza1tdID0gW107XG4gIG1hY3JvVGFza3M6IFRhc2tbXSA9IFtdO1xuICBldmVudFRhc2tzOiBUYXNrW10gPSBbXTtcbiAgcHJvcGVydGllczoge1trZXk6IHN0cmluZ106IGFueX0gPSB7J1Rhc2tUcmFja2luZ1pvbmUnOiB0aGlzfTtcblxuICBzdGF0aWMgZ2V0KCkge1xuICAgIHJldHVybiBab25lLmN1cnJlbnQuZ2V0KCdUYXNrVHJhY2tpbmdab25lJyk7XG4gIH1cblxuICBwcml2YXRlIGdldFRhc2tzRm9yKHR5cGU6IHN0cmluZyk6IFRhc2tbXSB7XG4gICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICBjYXNlICdtaWNyb1Rhc2snOlxuICAgICAgICByZXR1cm4gdGhpcy5taWNyb1Rhc2tzO1xuICAgICAgY2FzZSAnbWFjcm9UYXNrJzpcbiAgICAgICAgcmV0dXJuIHRoaXMubWFjcm9UYXNrcztcbiAgICAgIGNhc2UgJ2V2ZW50VGFzayc6XG4gICAgICAgIHJldHVybiB0aGlzLmV2ZW50VGFza3M7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biB0YXNrIGZvcm1hdDogJyArIHR5cGUpO1xuICB9XG5cbiAgb25TY2hlZHVsZVRhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrKTpcbiAgICAgIFRhc2sge1xuICAgICh0YXNrIGFzIGFueSlbJ2NyZWF0aW9uTG9jYXRpb24nXSA9IG5ldyBFcnJvcihgVGFzayAnJHt0YXNrLnR5cGV9JyBmcm9tICcke3Rhc2suc291cmNlfScuYCk7XG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmdldFRhc2tzRm9yKHRhc2sudHlwZSk7XG4gICAgdGFza3MucHVzaCh0YXNrKTtcbiAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLnNjaGVkdWxlVGFzayh0YXJnZXRab25lLCB0YXNrKTtcbiAgfVxuXG4gIG9uQ2FuY2VsVGFzayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2spOlxuICAgICAgYW55IHtcbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuZ2V0VGFza3NGb3IodGFzay50eXBlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGFza3NbaV0gPT0gdGFzaykge1xuICAgICAgICB0YXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0Wm9uZSwgdGFzayk7XG4gIH1cblxuICBvbkludm9rZVRhc2soXG4gICAgICBwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2ssXG4gICAgICBhcHBseVRoaXM6IGFueSwgYXBwbHlBcmdzOiBhbnkpOiBhbnkge1xuICAgIGlmICh0YXNrLnR5cGUgPT09ICdldmVudFRhc2snKVxuICAgICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICBjb25zdCB0YXNrcyA9IHRoaXMuZ2V0VGFza3NGb3IodGFzay50eXBlKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGFza3NbaV0gPT0gdGFzaykge1xuICAgICAgICB0YXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFyZW50Wm9uZURlbGVnYXRlLmludm9rZVRhc2sodGFyZ2V0Wm9uZSwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICB9XG5cbiAgY2xlYXJFdmVudHMoKSB7XG4gICAgd2hpbGUgKHRoaXMuZXZlbnRUYXNrcy5sZW5ndGgpIHtcbiAgICAgIFpvbmUuY3VycmVudC5jYW5jZWxUYXNrKHRoaXMuZXZlbnRUYXNrc1swXSk7XG4gICAgfVxuICB9XG59XG5cbi8vIEV4cG9ydCB0aGUgY2xhc3Mgc28gdGhhdCBuZXcgaW5zdGFuY2VzIGNhbiBiZSBjcmVhdGVkIHdpdGggcHJvcGVyXG4vLyBjb25zdHJ1Y3RvciBwYXJhbXMuXG4oWm9uZSBhcyBhbnkpWydUYXNrVHJhY2tpbmdab25lU3BlYyddID0gVGFza1RyYWNraW5nWm9uZVNwZWM7XG4iXX0=