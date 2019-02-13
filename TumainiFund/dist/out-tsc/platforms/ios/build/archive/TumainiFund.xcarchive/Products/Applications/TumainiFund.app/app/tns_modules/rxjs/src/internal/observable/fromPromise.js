"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var subscribeToPromise_1 = require("../util/subscribeToPromise");
function fromPromise(input, scheduler) {
    if (!scheduler) {
        return new Observable_1.Observable(subscribeToPromise_1.subscribeToPromise(input));
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            var sub = new Subscription_1.Subscription();
            sub.add(scheduler.schedule(function () { return input.then(function (value) {
                sub.add(scheduler.schedule(function () {
                    subscriber.next(value);
                    sub.add(scheduler.schedule(function () { return subscriber.complete(); }));
                }));
            }, function (err) {
                sub.add(scheduler.schedule(function () { return subscriber.error(err); }));
            }); }));
            return sub;
        });
    }
}
exports.fromPromise = fromPromise;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbVByb21pc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbVByb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsZ0RBQStDO0FBQy9DLGlFQUFnRTtBQUVoRSxTQUFnQixXQUFXLENBQUksS0FBcUIsRUFBRSxTQUF5QjtJQUM3RSxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLHVCQUFVLENBQUksdUNBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNyRDtTQUFNO1FBQ0wsT0FBTyxJQUFJLHVCQUFVLENBQUksVUFBQSxVQUFVO1lBQ2pDLElBQU0sR0FBRyxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFDO1lBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsS0FBSyxDQUFDLElBQUksQ0FDekMsVUFBQSxLQUFLO2dCQUNILEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztvQkFDekIsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDdkIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDO2dCQUMzRCxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxFQUNELFVBQUEsR0FBRztnQkFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsY0FBTSxPQUFBLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDO1lBQzNELENBQUMsQ0FDRixFQVZnQyxDQVVoQyxDQUFDLENBQUMsQ0FBQztZQUNKLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFwQkQsa0NBb0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Byb21pc2UgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUHJvbWlzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tUHJvbWlzZTxUPihpbnB1dDogUHJvbWlzZUxpa2U8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9Qcm9taXNlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gaW5wdXQudGhlbihcbiAgICAgICAgdmFsdWUgPT4ge1xuICAgICAgICAgIHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHtcbiAgICAgICAgICAgIHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7XG4gICAgICAgICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbiAgICAgICAgICB9KSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVyciA9PiB7XG4gICAgICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKSk7XG4gICAgICAgIH1cbiAgICAgICkpKTtcbiAgICAgIHJldHVybiBzdWI7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==