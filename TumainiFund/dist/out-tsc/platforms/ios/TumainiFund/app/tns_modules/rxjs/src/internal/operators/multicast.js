"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConnectableObservable_1 = require("../observable/ConnectableObservable");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the results of invoking a specified selector on items
 * emitted by a ConnectableObservable that shares a single subscription to the underlying stream.
 *
 * ![](multicast.png)
 *
 * @param {Function|Subject} subjectOrSubjectFactory - Factory function to create an intermediate subject through
 * which the source sequence's elements will be multicast to the selector function
 * or Subject to push source elements into.
 * @param {Function} [selector] - Optional selector function that can use the multicasted source stream
 * as many times as needed, without causing multiple subscriptions to the source stream.
 * Subscribers to the given source will receive all notifications of the source from the
 * time of the subscription forward.
 * @return {Observable} An Observable that emits the results of invoking the selector
 * on the items emitted by a `ConnectableObservable` that shares a single subscription to
 * the underlying stream.
 * @method multicast
 * @owner Observable
 */
function multicast(subjectOrSubjectFactory, selector) {
    return function multicastOperatorFunction(source) {
        var subjectFactory;
        if (typeof subjectOrSubjectFactory === 'function') {
            subjectFactory = subjectOrSubjectFactory;
        }
        else {
            subjectFactory = function subjectFactory() {
                return subjectOrSubjectFactory;
            };
        }
        if (typeof selector === 'function') {
            return source.lift(new MulticastOperator(subjectFactory, selector));
        }
        var connectable = Object.create(source, ConnectableObservable_1.connectableObservableDescriptor);
        connectable.source = source;
        connectable.subjectFactory = subjectFactory;
        return connectable;
    };
}
exports.multicast = multicast;
var MulticastOperator = /** @class */ (function () {
    function MulticastOperator(subjectFactory, selector) {
        this.subjectFactory = subjectFactory;
        this.selector = selector;
    }
    MulticastOperator.prototype.call = function (subscriber, source) {
        var selector = this.selector;
        var subject = this.subjectFactory();
        var subscription = selector(subject).subscribe(subscriber);
        subscription.add(source.subscribe(subject));
        return subscription;
    };
    return MulticastOperator;
}());
exports.MulticastOperator = MulticastOperator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGljYXN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL211bHRpY2FzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLDZFQUE2RztBQVM3RyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILFNBQWdCLFNBQVMsQ0FBTyx1QkFBd0QsRUFDeEQsUUFBbUQ7SUFDakYsT0FBTyxTQUFTLHlCQUF5QixDQUFDLE1BQXFCO1FBQzdELElBQUksY0FBZ0MsQ0FBQztRQUNyQyxJQUFJLE9BQU8sdUJBQXVCLEtBQUssVUFBVSxFQUFFO1lBQ2pELGNBQWMsR0FBcUIsdUJBQXVCLENBQUM7U0FDNUQ7YUFBTTtZQUNMLGNBQWMsR0FBRyxTQUFTLGNBQWM7Z0JBQ3RDLE9BQW1CLHVCQUF1QixDQUFDO1lBQzdDLENBQUMsQ0FBQztTQUNIO1FBRUQsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDbEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsY0FBYyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7U0FDckU7UUFFRCxJQUFNLFdBQVcsR0FBUSxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSx1REFBK0IsQ0FBQyxDQUFDO1FBQ2hGLFdBQVcsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQzVCLFdBQVcsQ0FBQyxjQUFjLEdBQUcsY0FBYyxDQUFDO1FBRTVDLE9BQWtDLFdBQVcsQ0FBQztJQUNoRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBdEJELDhCQXNCQztBQUVEO0lBQ0UsMkJBQW9CLGNBQWdDLEVBQ2hDLFFBQWtEO1FBRGxELG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQUNoQyxhQUFRLEdBQVIsUUFBUSxDQUEwQztJQUN0RSxDQUFDO0lBQ0QsZ0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUNqQyxJQUFBLHdCQUFRLENBQVU7UUFDMUIsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3RDLElBQU0sWUFBWSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDN0QsWUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDNUMsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFYWSw4Q0FBaUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgY29ubmVjdGFibGVPYnNlcnZhYmxlRGVzY3JpcHRvciB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmltcG9ydCB7IEZhY3RvcnlPclZhbHVlLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIE9wZXJhdG9yRnVuY3Rpb24sIFVuYXJ5RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpY2FzdDxUPihzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeTogRmFjdG9yeU9yVmFsdWU8U3ViamVjdDxUPj4pOiBVbmFyeUZ1bmN0aW9uPE9ic2VydmFibGU8VD4sIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPj47XG5leHBvcnQgZnVuY3Rpb24gbXVsdGljYXN0PFQ+KFN1YmplY3RGYWN0b3J5OiAodGhpczogT2JzZXJ2YWJsZTxUPikgPT4gU3ViamVjdDxUPik6IFVuYXJ5RnVuY3Rpb248T2JzZXJ2YWJsZTxUPiwgQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+PjtcbmV4cG9ydCBmdW5jdGlvbiBtdWx0aWNhc3Q8VD4oU3ViamVjdEZhY3Rvcnk6ICh0aGlzOiBPYnNlcnZhYmxlPFQ+KSA9PiBTdWJqZWN0PFQ+LCBzZWxlY3Rvcj86IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBtdWx0aWNhc3Q8VCwgUj4oU3ViamVjdEZhY3Rvcnk6ICh0aGlzOiBPYnNlcnZhYmxlPFQ+KSA9PiBTdWJqZWN0PFQ+KTogVW5hcnlGdW5jdGlvbjxPYnNlcnZhYmxlPFQ+LCBDb25uZWN0YWJsZU9ic2VydmFibGU8Uj4+O1xuZXhwb3J0IGZ1bmN0aW9uIG11bHRpY2FzdDxULCBSPihTdWJqZWN0RmFjdG9yeTogKHRoaXM6IE9ic2VydmFibGU8VD4pID0+IFN1YmplY3Q8VD4sIHNlbGVjdG9yPzogT3BlcmF0b3JGdW5jdGlvbjxULCBSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHRzIG9mIGludm9raW5nIGEgc3BlY2lmaWVkIHNlbGVjdG9yIG9uIGl0ZW1zXG4gKiBlbWl0dGVkIGJ5IGEgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHRoYXQgc2hhcmVzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiB0byB0aGUgdW5kZXJseWluZyBzdHJlYW0uXG4gKlxuICogIVtdKG11bHRpY2FzdC5wbmcpXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbnxTdWJqZWN0fSBzdWJqZWN0T3JTdWJqZWN0RmFjdG9yeSAtIEZhY3RvcnkgZnVuY3Rpb24gdG8gY3JlYXRlIGFuIGludGVybWVkaWF0ZSBzdWJqZWN0IHRocm91Z2hcbiAqIHdoaWNoIHRoZSBzb3VyY2Ugc2VxdWVuY2UncyBlbGVtZW50cyB3aWxsIGJlIG11bHRpY2FzdCB0byB0aGUgc2VsZWN0b3IgZnVuY3Rpb25cbiAqIG9yIFN1YmplY3QgdG8gcHVzaCBzb3VyY2UgZWxlbWVudHMgaW50by5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtzZWxlY3Rvcl0gLSBPcHRpb25hbCBzZWxlY3RvciBmdW5jdGlvbiB0aGF0IGNhbiB1c2UgdGhlIG11bHRpY2FzdGVkIHNvdXJjZSBzdHJlYW1cbiAqIGFzIG1hbnkgdGltZXMgYXMgbmVlZGVkLCB3aXRob3V0IGNhdXNpbmcgbXVsdGlwbGUgc3Vic2NyaXB0aW9ucyB0byB0aGUgc291cmNlIHN0cmVhbS5cbiAqIFN1YnNjcmliZXJzIHRvIHRoZSBnaXZlbiBzb3VyY2Ugd2lsbCByZWNlaXZlIGFsbCBub3RpZmljYXRpb25zIG9mIHRoZSBzb3VyY2UgZnJvbSB0aGVcbiAqIHRpbWUgb2YgdGhlIHN1YnNjcmlwdGlvbiBmb3J3YXJkLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHRzIG9mIGludm9raW5nIHRoZSBzZWxlY3RvclxuICogb24gdGhlIGl0ZW1zIGVtaXR0ZWQgYnkgYSBgQ29ubmVjdGFibGVPYnNlcnZhYmxlYCB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG9cbiAqIHRoZSB1bmRlcmx5aW5nIHN0cmVhbS5cbiAqIEBtZXRob2QgbXVsdGljYXN0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGljYXN0PFQsIFI+KHN1YmplY3RPclN1YmplY3RGYWN0b3J5OiBTdWJqZWN0PFQ+IHwgKCgpID0+IFN1YmplY3Q8VD4pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3Rvcj86IChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG11bHRpY2FzdE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgbGV0IHN1YmplY3RGYWN0b3J5OiAoKSA9PiBTdWJqZWN0PFQ+O1xuICAgIGlmICh0eXBlb2Ygc3ViamVjdE9yU3ViamVjdEZhY3RvcnkgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHN1YmplY3RGYWN0b3J5ID0gPCgpID0+IFN1YmplY3Q8VD4+c3ViamVjdE9yU3ViamVjdEZhY3Rvcnk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YmplY3RGYWN0b3J5ID0gZnVuY3Rpb24gc3ViamVjdEZhY3RvcnkoKSB7XG4gICAgICAgIHJldHVybiA8U3ViamVjdDxUPj5zdWJqZWN0T3JTdWJqZWN0RmFjdG9yeTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBzZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBNdWx0aWNhc3RPcGVyYXRvcihzdWJqZWN0RmFjdG9yeSwgc2VsZWN0b3IpKTtcbiAgICB9XG5cbiAgICBjb25zdCBjb25uZWN0YWJsZTogYW55ID0gT2JqZWN0LmNyZWF0ZShzb3VyY2UsIGNvbm5lY3RhYmxlT2JzZXJ2YWJsZURlc2NyaXB0b3IpO1xuICAgIGNvbm5lY3RhYmxlLnNvdXJjZSA9IHNvdXJjZTtcbiAgICBjb25uZWN0YWJsZS5zdWJqZWN0RmFjdG9yeSA9IHN1YmplY3RGYWN0b3J5O1xuXG4gICAgcmV0dXJuIDxDb25uZWN0YWJsZU9ic2VydmFibGU8Uj4+IGNvbm5lY3RhYmxlO1xuICB9O1xufVxuXG5leHBvcnQgY2xhc3MgTXVsdGljYXN0T3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc3ViamVjdEZhY3Rvcnk6ICgpID0+IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc2VsZWN0b3I6IChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGU8Uj4pIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICBjb25zdCB7IHNlbGVjdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLnN1YmplY3RGYWN0b3J5KCk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc2VsZWN0b3Ioc3ViamVjdCkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmlwdGlvbi5hZGQoc291cmNlLnN1YnNjcmliZShzdWJqZWN0KSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuIl19