"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var from_1 = require("./from"); // from from from! LAWL
var empty_1 = require("./empty");
/**
 * Creates an Observable that uses a resource which will be disposed at the same time as the Observable.
 *
 * <span class="informal">Use it when you catch yourself cleaning up after an Observable.</span>
 *
 * `using` is a factory operator, which accepts two functions. First function returns a disposable resource.
 * It can be an arbitrary object that implements `unsubscribe` method. Second function will be injected with
 * that object and should return an Observable. That Observable can use resource object during its execution.
 * Both functions passed to `using` will be called every time someone subscribes - neither an Observable nor
 * resource object will be shared in any way between subscriptions.
 *
 * When Observable returned by `using` is subscribed, Observable returned from the second function will be subscribed
 * as well. All its notifications (nexted values, completion and error events) will be emitted unchanged by the output
 * Observable. If however someone unsubscribes from the Observable or source Observable completes or errors by itself,
 * the `unsubscribe` method on resource object will be called. This can be used to do any necessary clean up, which
 * otherwise would have to be handled by hand. Note that complete or error notifications are not emitted when someone
 * cancels subscription to an Observable via `unsubscribe`, so `using` can be used as a hook, allowing you to make
 * sure that all resources which need to exist during an Observable execution will be disposed at appropriate time.
 *
 * @see {@link defer}
 *
 * @param {function(): ISubscription} resourceFactory A function which creates any resource object
 * that implements `unsubscribe` method.
 * @param {function(resource: ISubscription): Observable<T>} observableFactory A function which
 * creates an Observable, that can use injected resource object.
 * @return {Observable<T>} An Observable that behaves the same as Observable returned by `observableFactory`, but
 * which - when completed, errored or unsubscribed - will also call `unsubscribe` on created resource object.
 */
function using(resourceFactory, observableFactory) {
    return new Observable_1.Observable(function (subscriber) {
        var resource;
        try {
            resource = resourceFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var result;
        try {
            result = observableFactory(resource);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = result ? from_1.from(result) : empty_1.EMPTY;
        var subscription = source.subscribe(subscriber);
        return function () {
            subscription.unsubscribe();
            if (resource) {
                resource.unsubscribe();
            }
        };
    });
}
exports.using = using;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvdXNpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsK0JBQThCLENBQUMsdUJBQXVCO0FBQ3RELGlDQUFnQztBQUVoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkJHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFJLGVBQTRDLEVBQzVDLGlCQUFpRjtJQUN4RyxPQUFPLElBQUksdUJBQVUsQ0FBSSxVQUFBLFVBQVU7UUFDakMsSUFBSSxRQUErQixDQUFDO1FBRXBDLElBQUk7WUFDRixRQUFRLEdBQUcsZUFBZSxFQUFFLENBQUM7U0FDOUI7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLE1BQWlDLENBQUM7UUFDdEMsSUFBSTtZQUNGLE1BQU0sR0FBRyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUN0QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUVELElBQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFLLENBQUM7UUFDN0MsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNsRCxPQUFPO1lBQ0wsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzNCLElBQUksUUFBUSxFQUFFO2dCQUNaLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUN4QjtRQUNILENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTdCRCxzQkE2QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBVbnN1YnNjcmliYWJsZSwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7IC8vIGZyb20gZnJvbSBmcm9tISBMQVdMXG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IHVzZXMgYSByZXNvdXJjZSB3aGljaCB3aWxsIGJlIGRpc3Bvc2VkIGF0IHRoZSBzYW1lIHRpbWUgYXMgdGhlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCB3aGVuIHlvdSBjYXRjaCB5b3Vyc2VsZiBjbGVhbmluZyB1cCBhZnRlciBhbiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgdXNpbmdgIGlzIGEgZmFjdG9yeSBvcGVyYXRvciwgd2hpY2ggYWNjZXB0cyB0d28gZnVuY3Rpb25zLiBGaXJzdCBmdW5jdGlvbiByZXR1cm5zIGEgZGlzcG9zYWJsZSByZXNvdXJjZS5cbiAqIEl0IGNhbiBiZSBhbiBhcmJpdHJhcnkgb2JqZWN0IHRoYXQgaW1wbGVtZW50cyBgdW5zdWJzY3JpYmVgIG1ldGhvZC4gU2Vjb25kIGZ1bmN0aW9uIHdpbGwgYmUgaW5qZWN0ZWQgd2l0aFxuICogdGhhdCBvYmplY3QgYW5kIHNob3VsZCByZXR1cm4gYW4gT2JzZXJ2YWJsZS4gVGhhdCBPYnNlcnZhYmxlIGNhbiB1c2UgcmVzb3VyY2Ugb2JqZWN0IGR1cmluZyBpdHMgZXhlY3V0aW9uLlxuICogQm90aCBmdW5jdGlvbnMgcGFzc2VkIHRvIGB1c2luZ2Agd2lsbCBiZSBjYWxsZWQgZXZlcnkgdGltZSBzb21lb25lIHN1YnNjcmliZXMgLSBuZWl0aGVyIGFuIE9ic2VydmFibGUgbm9yXG4gKiByZXNvdXJjZSBvYmplY3Qgd2lsbCBiZSBzaGFyZWQgaW4gYW55IHdheSBiZXR3ZWVuIHN1YnNjcmlwdGlvbnMuXG4gKlxuICogV2hlbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGB1c2luZ2AgaXMgc3Vic2NyaWJlZCwgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tIHRoZSBzZWNvbmQgZnVuY3Rpb24gd2lsbCBiZSBzdWJzY3JpYmVkXG4gKiBhcyB3ZWxsLiBBbGwgaXRzIG5vdGlmaWNhdGlvbnMgKG5leHRlZCB2YWx1ZXMsIGNvbXBsZXRpb24gYW5kIGVycm9yIGV2ZW50cykgd2lsbCBiZSBlbWl0dGVkIHVuY2hhbmdlZCBieSB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLiBJZiBob3dldmVyIHNvbWVvbmUgdW5zdWJzY3JpYmVzIGZyb20gdGhlIE9ic2VydmFibGUgb3Igc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIG9yIGVycm9ycyBieSBpdHNlbGYsXG4gKiB0aGUgYHVuc3Vic2NyaWJlYCBtZXRob2Qgb24gcmVzb3VyY2Ugb2JqZWN0IHdpbGwgYmUgY2FsbGVkLiBUaGlzIGNhbiBiZSB1c2VkIHRvIGRvIGFueSBuZWNlc3NhcnkgY2xlYW4gdXAsIHdoaWNoXG4gKiBvdGhlcndpc2Ugd291bGQgaGF2ZSB0byBiZSBoYW5kbGVkIGJ5IGhhbmQuIE5vdGUgdGhhdCBjb21wbGV0ZSBvciBlcnJvciBub3RpZmljYXRpb25zIGFyZSBub3QgZW1pdHRlZCB3aGVuIHNvbWVvbmVcbiAqIGNhbmNlbHMgc3Vic2NyaXB0aW9uIHRvIGFuIE9ic2VydmFibGUgdmlhIGB1bnN1YnNjcmliZWAsIHNvIGB1c2luZ2AgY2FuIGJlIHVzZWQgYXMgYSBob29rLCBhbGxvd2luZyB5b3UgdG8gbWFrZVxuICogc3VyZSB0aGF0IGFsbCByZXNvdXJjZXMgd2hpY2ggbmVlZCB0byBleGlzdCBkdXJpbmcgYW4gT2JzZXJ2YWJsZSBleGVjdXRpb24gd2lsbCBiZSBkaXNwb3NlZCBhdCBhcHByb3ByaWF0ZSB0aW1lLlxuICpcbiAqIEBzZWUge0BsaW5rIGRlZmVyfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogSVN1YnNjcmlwdGlvbn0gcmVzb3VyY2VGYWN0b3J5IEEgZnVuY3Rpb24gd2hpY2ggY3JlYXRlcyBhbnkgcmVzb3VyY2Ugb2JqZWN0XG4gKiB0aGF0IGltcGxlbWVudHMgYHVuc3Vic2NyaWJlYCBtZXRob2QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHJlc291cmNlOiBJU3Vic2NyaXB0aW9uKTogT2JzZXJ2YWJsZTxUPn0gb2JzZXJ2YWJsZUZhY3RvcnkgQSBmdW5jdGlvbiB3aGljaFxuICogY3JlYXRlcyBhbiBPYnNlcnZhYmxlLCB0aGF0IGNhbiB1c2UgaW5qZWN0ZWQgcmVzb3VyY2Ugb2JqZWN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGJlaGF2ZXMgdGhlIHNhbWUgYXMgT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgb2JzZXJ2YWJsZUZhY3RvcnlgLCBidXRcbiAqIHdoaWNoIC0gd2hlbiBjb21wbGV0ZWQsIGVycm9yZWQgb3IgdW5zdWJzY3JpYmVkIC0gd2lsbCBhbHNvIGNhbGwgYHVuc3Vic2NyaWJlYCBvbiBjcmVhdGVkIHJlc291cmNlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHVzaW5nPFQ+KHJlc291cmNlRmFjdG9yeTogKCkgPT4gVW5zdWJzY3JpYmFibGUgfCB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgIG9ic2VydmFibGVGYWN0b3J5OiAocmVzb3VyY2U6IFVuc3Vic2NyaWJhYmxlIHwgdm9pZCkgPT4gT2JzZXJ2YWJsZUlucHV0PFQ+IHwgdm9pZCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IHJlc291cmNlOiBVbnN1YnNjcmliYWJsZSB8IHZvaWQ7XG5cbiAgICB0cnkge1xuICAgICAgcmVzb3VyY2UgPSByZXNvdXJjZUZhY3RvcnkoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFQ+IHwgdm9pZDtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gb2JzZXJ2YWJsZUZhY3RvcnkocmVzb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICBjb25zdCBzb3VyY2UgPSByZXN1bHQgPyBmcm9tKHJlc3VsdCkgOiBFTVBUWTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGlmIChyZXNvdXJjZSkge1xuICAgICAgICByZXNvdXJjZS51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH0pO1xufVxuIl19