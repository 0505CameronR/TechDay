"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var observable_1 = require("../symbol/observable");
var subscribeToObservable_1 = require("../util/subscribeToObservable");
function fromObservable(input, scheduler) {
    if (!scheduler) {
        return new Observable_1.Observable(subscribeToObservable_1.subscribeToObservable(input));
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            var sub = new Subscription_1.Subscription();
            sub.add(scheduler.schedule(function () {
                var observable = input[observable_1.observable]();
                sub.add(observable.subscribe({
                    next: function (value) { sub.add(scheduler.schedule(function () { return subscriber.next(value); })); },
                    error: function (err) { sub.add(scheduler.schedule(function () { return subscriber.error(err); })); },
                    complete: function () { sub.add(scheduler.schedule(function () { return subscriber.complete(); })); },
                }));
            }));
            return sub;
        });
    }
}
exports.fromObservable = fromObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbU9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2Zyb21PYnNlcnZhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUMvQyxtREFBdUU7QUFDdkUsdUVBQXNFO0FBR3RFLFNBQWdCLGNBQWMsQ0FBSSxLQUEyQixFQUFFLFNBQXdCO0lBQ3JGLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxPQUFPLElBQUksdUJBQVUsQ0FBSSw2Q0FBcUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0tBQ3hEO1NBQU07UUFDTCxPQUFPLElBQUksdUJBQVUsQ0FBSSxVQUFBLFVBQVU7WUFDakMsSUFBTSxHQUFHLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7WUFDL0IsR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO2dCQUN6QixJQUFNLFVBQVUsR0FBb0IsS0FBSyxDQUFDLHVCQUFpQixDQUFDLEVBQUUsQ0FBQztnQkFDL0QsR0FBRyxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDO29CQUMzQixJQUFJLFlBQUMsS0FBSyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBdEIsQ0FBc0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUMxRSxLQUFLLFlBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUN4RSxRQUFRLGdCQUFLLEdBQUcsQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3pFLENBQUMsQ0FBQyxDQUFDO1lBQ04sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFqQkQsd0NBaUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBJbnRlcm9wT2JzZXJ2YWJsZSwgU2NoZWR1bGVyTGlrZSwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbU9ic2VydmFibGU8VD4oaW5wdXQ6IEludGVyb3BPYnNlcnZhYmxlPFQ+LCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG9PYnNlcnZhYmxlKGlucHV0KSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qgc3ViID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4ge1xuICAgICAgICBjb25zdCBvYnNlcnZhYmxlOiBTdWJzY3JpYmFibGU8VD4gPSBpbnB1dFtTeW1ib2xfb2JzZXJ2YWJsZV0oKTtcbiAgICAgICAgc3ViLmFkZChvYnNlcnZhYmxlLnN1YnNjcmliZSh7XG4gICAgICAgICAgbmV4dCh2YWx1ZSkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLm5leHQodmFsdWUpKSk7IH0sXG4gICAgICAgICAgZXJyb3IoZXJyKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyKSkpOyB9LFxuICAgICAgICAgIGNvbXBsZXRlKCkgeyBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTsgfSxcbiAgICAgICAgfSkpO1xuICAgICAgfSkpO1xuICAgICAgcmV0dXJuIHN1YjtcbiAgICB9KTtcbiAgfVxufVxuIl19