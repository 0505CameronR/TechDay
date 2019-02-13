"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var subscribeToArray_1 = require("../util/subscribeToArray");
function fromArray(input, scheduler) {
    if (!scheduler) {
        return new Observable_1.Observable(subscribeToArray_1.subscribeToArray(input));
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            var sub = new Subscription_1.Subscription();
            var i = 0;
            sub.add(scheduler.schedule(function () {
                if (i === input.length) {
                    subscriber.complete();
                    return;
                }
                subscriber.next(input[i++]);
                if (!subscriber.closed) {
                    sub.add(this.schedule());
                }
            }));
            return sub;
        });
    }
}
exports.fromArray = fromArray;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbUFycmF5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21BcnJheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUUzQyxnREFBK0M7QUFDL0MsNkRBQTREO0FBRTVELFNBQWdCLFNBQVMsQ0FBSSxLQUFtQixFQUFFLFNBQXlCO0lBQ3pFLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxPQUFPLElBQUksdUJBQVUsQ0FBSSxtQ0FBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ25EO1NBQU07UUFDTCxPQUFPLElBQUksdUJBQVUsQ0FBSSxVQUFBLFVBQVU7WUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7WUFDL0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixJQUFJLENBQUMsS0FBSyxLQUFLLENBQUMsTUFBTSxFQUFFO29CQUN0QixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLE9BQU87aUJBQ1I7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtvQkFDdEIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztpQkFDMUI7WUFDSCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQXBCRCw4QkFvQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHN1YnNjcmliZVRvQXJyYXkgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvQXJyYXknO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbUFycmF5PFQ+KGlucHV0OiBBcnJheUxpa2U8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9BcnJheShpbnB1dCkpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHN1YiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGxldCBpID0gMDtcbiAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKGkgPT09IGlucHV0Lmxlbmd0aCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGlucHV0W2krK10pO1xuICAgICAgICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgc3ViLmFkZCh0aGlzLnNjaGVkdWxlKCkpO1xuICAgICAgICB9XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xuICB9XG59XG4iXX0=