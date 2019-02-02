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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC91dGlsL3N1YnNjcmliZVRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRTNDLHVEQUFzRDtBQUN0RCwyREFBMEQ7QUFDMUQsNkRBQTREO0FBQzVELGlFQUFnRTtBQUNoRSw2Q0FBNEM7QUFDNUMseUNBQXdDO0FBQ3hDLHVDQUFzQztBQUN0QywrQ0FBaUU7QUFDakUsbURBQXVFO0FBRzFELFFBQUEsV0FBVyxHQUFHLFVBQUksTUFBMEI7SUFDdkQsSUFBSSxNQUFNLFlBQVksdUJBQVUsRUFBRTtRQUNoQyxPQUFPLFVBQUMsVUFBeUI7WUFDN0IsSUFBSSxNQUFNLENBQUMsU0FBUyxFQUFFO2dCQUN0QixVQUFVLENBQUMsSUFBSSxDQUFFLE1BQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdkMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUN0QixPQUFPLFNBQVMsQ0FBQzthQUNsQjtpQkFBTTtnQkFDTCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDLENBQUM7S0FDSDtTQUFNLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLHVCQUFpQixDQUFDLEtBQUssVUFBVSxFQUFFO1FBQ3BFLE9BQU8sNkNBQXFCLENBQUMsTUFBYSxDQUFDLENBQUM7S0FDN0M7U0FBTSxJQUFJLHlCQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxtQ0FBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQztTQUFNLElBQUkscUJBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM1QixPQUFPLHVDQUFrQixDQUFDLE1BQXNCLENBQUMsQ0FBQztLQUNuRDtTQUFNLElBQUksTUFBTSxJQUFJLE9BQU8sTUFBTSxDQUFDLG1CQUFlLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDbEUsT0FBTyx5Q0FBbUIsQ0FBQyxNQUFhLENBQUMsQ0FBQztLQUMzQztTQUFNO1FBQ0wsSUFBTSxLQUFLLEdBQUcsbUJBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLE1BQUksTUFBTSxNQUFHLENBQUM7UUFDckUsSUFBTSxHQUFHLEdBQUcsa0JBQWdCLEtBQUssa0NBQStCO2NBQzVELDhEQUE4RCxDQUFDO1FBQ25FLE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi9zdWJzY3JpYmVUb0FycmF5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9Qcm9taXNlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4vaXNQcm9taXNlJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi9pc09iamVjdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvID0gPFQ+KHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFQ+KSA9PiB7XG4gIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgcmV0dXJuIChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuX2lzU2NhbGFyKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgocmVzdWx0IGFzIGFueSkudmFsdWUpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9vYnNlcnZhYmxlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb09ic2VydmFibGUocmVzdWx0IGFzIGFueSk7XG4gIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocmVzdWx0KSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb0FycmF5KHJlc3VsdCk7XG4gIH0gZWxzZSBpZiAoaXNQcm9taXNlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9Qcm9taXNlKHJlc3VsdCBhcyBQcm9taXNlPGFueT4pO1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9JdGVyYWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2YWx1ZSA9IGlzT2JqZWN0KHJlc3VsdCkgPyAnYW4gaW52YWxpZCBvYmplY3QnIDogYCcke3Jlc3VsdH0nYDtcbiAgICBjb25zdCBtc2cgPSBgWW91IHByb3ZpZGVkICR7dmFsdWV9IHdoZXJlIGEgc3RyZWFtIHdhcyBleHBlY3RlZC5gXG4gICAgICArICcgWW91IGNhbiBwcm92aWRlIGFuIE9ic2VydmFibGUsIFByb21pc2UsIEFycmF5LCBvciBJdGVyYWJsZS4nO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKTtcbiAgfVxufTtcbiJdfQ==