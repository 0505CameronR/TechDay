"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var subscribeToArray_1 = require("./subscribeToArray");
var subscribeToPromise_1 = require("./subscribeToPromise");
var subscribeToIterable_1 = require("./subscribeToIterable");
var subscribeToObservable_1 = require("./subscribeToObservable");
var isArrayLike_1 = require("./isArrayLike");
var isPromise_1 = require("./isPromise");
var isObject_1 = require("./isObject");
var iterator_1 = require("../symbol/iterator");
var observable_1 = require("../symbol/observable");
exports.subscribeTo = function (result) {
    if (result instanceof Observable_1.Observable) {
        return function (subscriber) {
            if (result._isScalar) {
                subscriber.next(result.value);
                subscriber.complete();
                return undefined;
            }
            else {
                return result.subscribe(subscriber);
            }
        };
    }
    else if (result && typeof result[observable_1.observable] === 'function') {
        return subscribeToObservable_1.subscribeToObservable(result);
    }
    else if (isArrayLike_1.isArrayLike(result)) {
        return subscribeToArray_1.subscribeToArray(result);
    }
    else if (isPromise_1.isPromise(result)) {
        return subscribeToPromise_1.subscribeToPromise(result);
    }
    else if (result && typeof result[iterator_1.iterator] === 'function') {
        return subscribeToIterable_1.subscribeToIterable(result);
    }
    else {
        var value = isObject_1.isObject(result) ? 'an invalid object' : "'" + result + "'";
        var msg = "You provided " + value + " where a stream was expected."
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3V0aWwvc3Vic2NyaWJlVG8udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsdURBQXNEO0FBQ3RELDJEQUEwRDtBQUMxRCw2REFBNEQ7QUFDNUQsaUVBQWdFO0FBQ2hFLDZDQUE0QztBQUM1Qyx5Q0FBd0M7QUFDeEMsdUNBQXNDO0FBQ3RDLCtDQUFpRTtBQUNqRSxtREFBdUU7QUFHMUQsUUFBQSxXQUFXLEdBQUcsVUFBSSxNQUEwQjtJQUN2RCxJQUFJLE1BQU0sWUFBWSx1QkFBVSxFQUFFO1FBQ2hDLE9BQU8sVUFBQyxVQUF5QjtZQUM3QixJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7Z0JBQ3RCLFVBQVUsQ0FBQyxJQUFJLENBQUUsTUFBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUN2QyxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3RCLE9BQU8sU0FBUyxDQUFDO2FBQ2xCO2lCQUFNO2dCQUNMLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUMsQ0FBQztLQUNIO1NBQU0sSUFBSSxNQUFNLElBQUksT0FBTyxNQUFNLENBQUMsdUJBQWlCLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDcEUsT0FBTyw2Q0FBcUIsQ0FBQyxNQUFhLENBQUMsQ0FBQztLQUM3QztTQUFNLElBQUkseUJBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM5QixPQUFPLG1DQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0tBQ2pDO1NBQU0sSUFBSSxxQkFBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzVCLE9BQU8sdUNBQWtCLENBQUMsTUFBc0IsQ0FBQyxDQUFDO0tBQ25EO1NBQU0sSUFBSSxNQUFNLElBQUksT0FBTyxNQUFNLENBQUMsbUJBQWUsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUNsRSxPQUFPLHlDQUFtQixDQUFDLE1BQWEsQ0FBQyxDQUFDO0tBQzNDO1NBQU07UUFDTCxJQUFNLEtBQUssR0FBRyxtQkFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsTUFBSSxNQUFNLE1BQUcsQ0FBQztRQUNyRSxJQUFNLEdBQUcsR0FBRyxrQkFBZ0IsS0FBSyxrQ0FBK0I7Y0FDNUQsOERBQThELENBQUM7UUFDbkUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHN1YnNjcmliZVRvQXJyYXkgfSBmcm9tICcuL3N1YnNjcmliZVRvQXJyYXknO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9Qcm9taXNlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb1Byb21pc2UnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9JdGVyYWJsZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9JdGVyYWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4vaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL2lzT2JqZWN0JztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG8gPSA8VD4ocmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4pID0+IHtcbiAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICByZXR1cm4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5faXNTY2FsYXIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KChyZXN1bHQgYXMgYW55KS52YWx1ZSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX29ic2VydmFibGVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvT2JzZXJ2YWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvQXJyYXkocmVzdWx0KTtcbiAgfSBlbHNlIGlmIChpc1Byb21pc2UocmVzdWx0KSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb1Byb21pc2UocmVzdWx0IGFzIFByb21pc2U8YW55Pik7XG4gIH0gZWxzZSBpZiAocmVzdWx0ICYmIHR5cGVvZiByZXN1bHRbU3ltYm9sX2l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb0l0ZXJhYmxlKHJlc3VsdCBhcyBhbnkpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHZhbHVlID0gaXNPYmplY3QocmVzdWx0KSA/ICdhbiBpbnZhbGlkIG9iamVjdCcgOiBgJyR7cmVzdWx0fSdgO1xuICAgIGNvbnN0IG1zZyA9IGBZb3UgcHJvdmlkZWQgJHt2YWx1ZX0gd2hlcmUgYSBzdHJlYW0gd2FzIGV4cGVjdGVkLmBcbiAgICAgICsgJyBZb3UgY2FuIHByb3ZpZGUgYW4gT2JzZXJ2YWJsZSwgUHJvbWlzZSwgQXJyYXksIG9yIEl0ZXJhYmxlLic7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihtc2cpO1xuICB9XG59O1xuIl19