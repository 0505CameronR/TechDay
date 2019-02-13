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
var TaskTrackingZoneSpec = /** @class */ (function () {
    function TaskTrackingZoneSpec() {
        this.name = 'TaskTrackingZone';
        this.microTasks = [];
        this.macroTasks = [];
        this.eventTasks = [];
        this.properties = { 'TaskTrackingZone': this };
    }
    TaskTrackingZoneSpec.get = function () {
        return Zone.current.get('TaskTrackingZone');
    };
    TaskTrackingZoneSpec.prototype.getTasksFor = function (type) {
        switch (type) {
            case 'microTask':
                return this.microTasks;
            case 'macroTask':
                return this.macroTasks;
            case 'eventTask':
                return this.eventTasks;
        }
        throw new Error('Unknown task format: ' + type);
    };
    TaskTrackingZoneSpec.prototype.onScheduleTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        task['creationLocation'] = new Error("Task '" + task.type + "' from '" + task.source + "'.");
        var tasks = this.getTasksFor(task.type);
        tasks.push(task);
        return parentZoneDelegate.scheduleTask(targetZone, task);
    };
    TaskTrackingZoneSpec.prototype.onCancelTask = function (parentZoneDelegate, currentZone, targetZone, task) {
        var tasks = this.getTasksFor(task.type);
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.cancelTask(targetZone, task);
    };
    TaskTrackingZoneSpec.prototype.onInvokeTask = function (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
        if (task.type === 'eventTask')
            return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
        var tasks = this.getTasksFor(task.type);
        for (var i = 0; i < tasks.length; i++) {
            if (tasks[i] == task) {
                tasks.splice(i, 1);
                break;
            }
        }
        return parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs);
    };
    TaskTrackingZoneSpec.prototype.clearEvents = function () {
        while (this.eventTasks.length) {
            Zone.current.cancelTask(this.eventTasks[0]);
        }
    };
    return TaskTrackingZoneSpec;
}());
// Export the class so that new instances can be created with proper
// constructor params.
Zone['TaskTrackingZoneSpec'] = TaskTrackingZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFzay10cmFja2luZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvem9uZS1zcGVjL3Rhc2stdHJhY2tpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7O0dBS0c7QUFDSDtJQUFBO1FBQ0UsU0FBSSxHQUFHLGtCQUFrQixDQUFDO1FBQzFCLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFDeEIsZUFBVSxHQUFXLEVBQUUsQ0FBQztRQUN4QixlQUFVLEdBQVcsRUFBRSxDQUFDO1FBQ3hCLGVBQVUsR0FBeUIsRUFBQyxrQkFBa0IsRUFBRSxJQUFJLEVBQUMsQ0FBQztJQTBEaEUsQ0FBQztJQXhEUSx3QkFBRyxHQUFWO1FBQ0UsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTywwQ0FBVyxHQUFuQixVQUFvQixJQUFZO1FBQzlCLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxXQUFXO2dCQUNkLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQztZQUN6QixLQUFLLFdBQVc7Z0JBQ2QsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3pCLEtBQUssV0FBVztnQkFDZCxPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7U0FDMUI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCw2Q0FBYyxHQUFkLFVBQWUsa0JBQWdDLEVBQUUsV0FBaUIsRUFBRSxVQUFnQixFQUFFLElBQVU7UUFFN0YsSUFBWSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsV0FBUyxJQUFJLENBQUMsSUFBSSxnQkFBVyxJQUFJLENBQUMsTUFBTSxPQUFJLENBQUMsQ0FBQztRQUM1RixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2pCLE9BQU8sa0JBQWtCLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRUQsMkNBQVksR0FBWixVQUFhLGtCQUFnQyxFQUFFLFdBQWlCLEVBQUUsVUFBZ0IsRUFBRSxJQUFVO1FBRTVGLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3JDLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRTtnQkFDcEIsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ25CLE1BQU07YUFDUDtTQUNGO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCwyQ0FBWSxHQUFaLFVBQ0ksa0JBQWdDLEVBQUUsV0FBaUIsRUFBRSxVQUFnQixFQUFFLElBQVUsRUFDakYsU0FBYyxFQUFFLFNBQWM7UUFDaEMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFdBQVc7WUFDM0IsT0FBTyxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0UsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDckMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNwQixLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFDbkIsTUFBTTthQUNQO1NBQ0Y7UUFDRCxPQUFPLGtCQUFrQixDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBRUQsMENBQVcsR0FBWDtRQUNFLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7WUFDN0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzdDO0lBQ0gsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQS9ERCxJQStEQztBQUVELG9FQUFvRTtBQUNwRSxzQkFBc0I7QUFDckIsSUFBWSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsb0JBQW9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogQSBgVGFza1RyYWNraW5nWm9uZVNwZWNgIGFsbG93cyBvbmUgdG8gdHJhY2sgYWxsIG91dHN0YW5kaW5nIFRhc2tzLlxuICpcbiAqIFRoaXMgaXMgdXNlZnVsIGluIHRlc3RzLiBGb3IgZXhhbXBsZSB0byBzZWUgd2hpY2ggdGFza3MgYXJlIHByZXZlbnRpbmcgYSB0ZXN0IGZyb20gY29tcGxldGluZ1xuICogb3IgYW4gYXV0b21hdGVkIHdheSBvZiByZWxlYXNpbmcgYWxsIG9mIHRoZSBldmVudCBsaXN0ZW5lcnMgYXQgdGhlIGVuZCBvZiB0aGUgdGVzdC5cbiAqL1xuY2xhc3MgVGFza1RyYWNraW5nWm9uZVNwZWMgaW1wbGVtZW50cyBab25lU3BlYyB7XG4gIG5hbWUgPSAnVGFza1RyYWNraW5nWm9uZSc7XG4gIG1pY3JvVGFza3M6IFRhc2tbXSA9IFtdO1xuICBtYWNyb1Rhc2tzOiBUYXNrW10gPSBbXTtcbiAgZXZlbnRUYXNrczogVGFza1tdID0gW107XG4gIHByb3BlcnRpZXM6IHtba2V5OiBzdHJpbmddOiBhbnl9ID0geydUYXNrVHJhY2tpbmdab25lJzogdGhpc307XG5cbiAgc3RhdGljIGdldCgpIHtcbiAgICByZXR1cm4gWm9uZS5jdXJyZW50LmdldCgnVGFza1RyYWNraW5nWm9uZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRUYXNrc0Zvcih0eXBlOiBzdHJpbmcpOiBUYXNrW10ge1xuICAgIHN3aXRjaCAodHlwZSkge1xuICAgICAgY2FzZSAnbWljcm9UYXNrJzpcbiAgICAgICAgcmV0dXJuIHRoaXMubWljcm9UYXNrcztcbiAgICAgIGNhc2UgJ21hY3JvVGFzayc6XG4gICAgICAgIHJldHVybiB0aGlzLm1hY3JvVGFza3M7XG4gICAgICBjYXNlICdldmVudFRhc2snOlxuICAgICAgICByZXR1cm4gdGhpcy5ldmVudFRhc2tzO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gdGFzayBmb3JtYXQ6ICcgKyB0eXBlKTtcbiAgfVxuXG4gIG9uU2NoZWR1bGVUYXNrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgdGFzazogVGFzayk6XG4gICAgICBUYXNrIHtcbiAgICAodGFzayBhcyBhbnkpWydjcmVhdGlvbkxvY2F0aW9uJ10gPSBuZXcgRXJyb3IoYFRhc2sgJyR7dGFzay50eXBlfScgZnJvbSAnJHt0YXNrLnNvdXJjZX0nLmApO1xuICAgIGNvbnN0IHRhc2tzID0gdGhpcy5nZXRUYXNrc0Zvcih0YXNrLnR5cGUpO1xuICAgIHRhc2tzLnB1c2godGFzayk7XG4gICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0Wm9uZSwgdGFzayk7XG4gIH1cblxuICBvbkNhbmNlbFRhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrKTpcbiAgICAgIGFueSB7XG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmdldFRhc2tzRm9yKHRhc2sudHlwZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRhc2tzW2ldID09IHRhc2spIHtcbiAgICAgICAgdGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5jYW5jZWxUYXNrKHRhcmdldFpvbmUsIHRhc2spO1xuICB9XG5cbiAgb25JbnZva2VUYXNrKFxuICAgICAgcGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrLFxuICAgICAgYXBwbHlUaGlzOiBhbnksIGFwcGx5QXJnczogYW55KTogYW55IHtcbiAgICBpZiAodGFzay50eXBlID09PSAnZXZlbnRUYXNrJylcbiAgICAgIHJldHVybiBwYXJlbnRab25lRGVsZWdhdGUuaW52b2tlVGFzayh0YXJnZXRab25lLCB0YXNrLCBhcHBseVRoaXMsIGFwcGx5QXJncyk7XG4gICAgY29uc3QgdGFza3MgPSB0aGlzLmdldFRhc2tzRm9yKHRhc2sudHlwZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKHRhc2tzW2ldID09IHRhc2spIHtcbiAgICAgICAgdGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgfVxuXG4gIGNsZWFyRXZlbnRzKCkge1xuICAgIHdoaWxlICh0aGlzLmV2ZW50VGFza3MubGVuZ3RoKSB7XG4gICAgICBab25lLmN1cnJlbnQuY2FuY2VsVGFzayh0aGlzLmV2ZW50VGFza3NbMF0pO1xuICAgIH1cbiAgfVxufVxuXG4vLyBFeHBvcnQgdGhlIGNsYXNzIHNvIHRoYXQgbmV3IGluc3RhbmNlcyBjYW4gYmUgY3JlYXRlZCB3aXRoIHByb3BlclxuLy8gY29uc3RydWN0b3IgcGFyYW1zLlxuKFpvbmUgYXMgYW55KVsnVGFza1RyYWNraW5nWm9uZVNwZWMnXSA9IFRhc2tUcmFja2luZ1pvbmVTcGVjO1xuIl19