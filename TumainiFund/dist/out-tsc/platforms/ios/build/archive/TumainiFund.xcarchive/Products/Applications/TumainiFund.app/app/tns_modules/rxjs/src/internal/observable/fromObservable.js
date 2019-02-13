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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbU9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbU9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBQy9DLG1EQUF1RTtBQUN2RSx1RUFBc0U7QUFHdEUsU0FBZ0IsY0FBYyxDQUFJLEtBQTJCLEVBQUUsU0FBd0I7SUFDckYsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLE9BQU8sSUFBSSx1QkFBVSxDQUFJLDZDQUFxQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDeEQ7U0FBTTtRQUNMLE9BQU8sSUFBSSx1QkFBVSxDQUFJLFVBQUEsVUFBVTtZQUNqQyxJQUFNLEdBQUcsR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztZQUMvQixHQUFHLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7Z0JBQ3pCLElBQU0sVUFBVSxHQUFvQixLQUFLLENBQUMsdUJBQWlCLENBQUMsRUFBRSxDQUFDO2dCQUMvRCxHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUM7b0JBQzNCLElBQUksWUFBQyxLQUFLLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUF0QixDQUFzQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQzFFLEtBQUssWUFBQyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ3hFLFFBQVEsZ0JBQUssR0FBRyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLGNBQU0sT0FBQSxVQUFVLENBQUMsUUFBUSxFQUFFLEVBQXJCLENBQXFCLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDekUsQ0FBQyxDQUFDLENBQUM7WUFDTixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osT0FBTyxHQUFHLENBQUM7UUFDYixDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQWpCRCx3Q0FpQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEludGVyb3BPYnNlcnZhYmxlLCBTY2hlZHVsZXJMaWtlLCBTdWJzY3JpYmFibGUgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tT2JzZXJ2YWJsZTxUPihpbnB1dDogSW50ZXJvcE9ic2VydmFibGU8VD4sIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVUb09ic2VydmFibGUoaW5wdXQpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBzdWIgPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWIuYWRkKHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IG9ic2VydmFibGU6IFN1YnNjcmliYWJsZTxUPiA9IGlucHV0W1N5bWJvbF9vYnNlcnZhYmxlXSgpO1xuICAgICAgICBzdWIuYWRkKG9ic2VydmFibGUuc3Vic2NyaWJlKHtcbiAgICAgICAgICBuZXh0KHZhbHVlKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIubmV4dCh2YWx1ZSkpKTsgfSxcbiAgICAgICAgICBlcnJvcihlcnIpIHsgc3ViLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5lcnJvcihlcnIpKSk7IH0sXG4gICAgICAgICAgY29tcGxldGUoKSB7IHN1Yi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IHN1YnNjcmliZXIuY29tcGxldGUoKSkpOyB9LFxuICAgICAgICB9KSk7XG4gICAgICB9KSk7XG4gICAgICByZXR1cm4gc3ViO1xuICAgIH0pO1xuICB9XG59XG4iXX0=