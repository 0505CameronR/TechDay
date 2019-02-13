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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3luYy10ZXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi96b25lLXNwZWMvc3luYy10ZXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVIO0lBR0UsMEJBQVksVUFBa0I7UUFGOUIsWUFBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFHckIsSUFBSSxDQUFDLElBQUksR0FBRyxtQkFBbUIsR0FBRyxVQUFVLENBQUM7SUFDL0MsQ0FBQztJQU1ELHlDQUFjLEdBQWQsVUFBZSxRQUFzQixFQUFFLE9BQWEsRUFBRSxNQUFZLEVBQUUsSUFBVTtRQUM1RSxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxXQUFXO2dCQUNkLE1BQU0sSUFBSSxLQUFLLENBQUMsaUJBQWUsSUFBSSxDQUFDLE1BQU0sOEJBQTJCLENBQUMsQ0FBQztZQUN6RSxLQUFLLFdBQVc7Z0JBQ2QsSUFBSSxHQUFHLFFBQVEsQ0FBQyxZQUFZLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMzQyxNQUFNO1NBQ1Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUF0QkQsSUFzQkM7QUFFRCxvRUFBb0U7QUFDcEUsc0JBQXNCO0FBQ3JCLElBQVksQ0FBQyxrQkFBa0IsQ0FBQyxHQUFHLGdCQUFnQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5jbGFzcyBTeW5jVGVzdFpvbmVTcGVjIGltcGxlbWVudHMgWm9uZVNwZWMge1xuICBydW5ab25lID0gWm9uZS5jdXJyZW50O1xuXG4gIGNvbnN0cnVjdG9yKG5hbWVQcmVmaXg6IHN0cmluZykge1xuICAgIHRoaXMubmFtZSA9ICdzeW5jVGVzdFpvbmUgZm9yICcgKyBuYW1lUHJlZml4O1xuICB9XG5cbiAgLy8gWm9uZVNwZWMgaW1wbGVtZW50YXRpb24gYmVsb3cuXG5cbiAgbmFtZTogc3RyaW5nO1xuXG4gIG9uU2NoZWR1bGVUYXNrKGRlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgdGFzazogVGFzayk6IFRhc2sge1xuICAgIHN3aXRjaCAodGFzay50eXBlKSB7XG4gICAgICBjYXNlICdtaWNyb1Rhc2snOlxuICAgICAgY2FzZSAnbWFjcm9UYXNrJzpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgY2FsbCAke3Rhc2suc291cmNlfSBmcm9tIHdpdGhpbiBhIHN5bmMgdGVzdC5gKTtcbiAgICAgIGNhc2UgJ2V2ZW50VGFzayc6XG4gICAgICAgIHRhc2sgPSBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIHJldHVybiB0YXNrO1xuICB9XG59XG5cbi8vIEV4cG9ydCB0aGUgY2xhc3Mgc28gdGhhdCBuZXcgaW5zdGFuY2VzIGNhbiBiZSBjcmVhdGVkIHdpdGggcHJvcGVyXG4vLyBjb25zdHJ1Y3RvciBwYXJhbXMuXG4oWm9uZSBhcyBhbnkpWydTeW5jVGVzdFpvbmVTcGVjJ10gPSBTeW5jVGVzdFpvbmVTcGVjO1xuIl19