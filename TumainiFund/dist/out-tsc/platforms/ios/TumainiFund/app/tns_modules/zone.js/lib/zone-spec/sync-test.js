/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var SyncTestZoneSpec = /** @class */ (function () {
    function SyncTestZoneSpec(namePrefix) {
        this.runZone = Zone.current;
        this.name = 'syncTestZone for ' + namePrefix;
    }
    SyncTestZoneSpec.prototype.onScheduleTask = function (delegate, current, target, task) {
        switch (task.type) {
            case 'microTask':
            case 'macroTask':
                throw new Error("Cannot call " + task.source + " from within a sync test.");
            case 'eventTask':
                task = delegate.scheduleTask(target, task);
                break;
        }
        return task;
    };
    return SyncTestZoneSpec;
}());
// Export the class so that new instances can be created with proper
// constructor params.
Zone['SyncTestZoneSpec'] = SyncTestZoneSpec;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvem9uZS1zcGVjL3N5bmMtdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDtJQUdFLDBCQUFZLFVBQWtCO1FBRjlCLFlBQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBR3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsbUJBQW1CLEdBQUcsVUFBVSxDQUFDO0lBQy9DLENBQUM7SUFNRCx5Q0FBYyxHQUFkLFVBQWUsUUFBc0IsRUFBRSxPQUFhLEVBQUUsTUFBWSxFQUFFLElBQVU7UUFDNUUsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssV0FBVyxDQUFDO1lBQ2pCLEtBQUssV0FBVztnQkFDZCxNQUFNLElBQUksS0FBSyxDQUFDLGlCQUFlLElBQUksQ0FBQyxNQUFNLDhCQUEyQixDQUFDLENBQUM7WUFDekUsS0FBSyxXQUFXO2dCQUNkLElBQUksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDM0MsTUFBTTtTQUNUO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDZCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBdEJELElBc0JDO0FBRUQsb0VBQW9FO0FBQ3BFLHNCQUFzQjtBQUNyQixJQUFZLENBQUMsa0JBQWtCLENBQUMsR0FBRyxnQkFBZ0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuY2xhc3MgU3luY1Rlc3Rab25lU3BlYyBpbXBsZW1lbnRzIFpvbmVTcGVjIHtcbiAgcnVuWm9uZSA9IFpvbmUuY3VycmVudDtcblxuICBjb25zdHJ1Y3RvcihuYW1lUHJlZml4OiBzdHJpbmcpIHtcbiAgICB0aGlzLm5hbWUgPSAnc3luY1Rlc3Rab25lIGZvciAnICsgbmFtZVByZWZpeDtcbiAgfVxuXG4gIC8vIFpvbmVTcGVjIGltcGxlbWVudGF0aW9uIGJlbG93LlxuXG4gIG5hbWU6IHN0cmluZztcblxuICBvblNjaGVkdWxlVGFzayhkZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIHRhc2s6IFRhc2spOiBUYXNrIHtcbiAgICBzd2l0Y2ggKHRhc2sudHlwZSkge1xuICAgICAgY2FzZSAnbWljcm9UYXNrJzpcbiAgICAgIGNhc2UgJ21hY3JvVGFzayc6XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgQ2Fubm90IGNhbGwgJHt0YXNrLnNvdXJjZX0gZnJvbSB3aXRoaW4gYSBzeW5jIHRlc3QuYCk7XG4gICAgICBjYXNlICdldmVudFRhc2snOlxuICAgICAgICB0YXNrID0gZGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldCwgdGFzayk7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgICByZXR1cm4gdGFzaztcbiAgfVxufVxuXG4vLyBFeHBvcnQgdGhlIGNsYXNzIHNvIHRoYXQgbmV3IGluc3RhbmNlcyBjYW4gYmUgY3JlYXRlZCB3aXRoIHByb3BlclxuLy8gY29uc3RydWN0b3IgcGFyYW1zLlxuKFpvbmUgYXMgYW55KVsnU3luY1Rlc3Rab25lU3BlYyddID0gU3luY1Rlc3Rab25lU3BlYztcbiJdfQ==