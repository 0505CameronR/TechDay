import { Observable } from '../Observable';
import { subscribeToArray } from './subscribeToArray';
import { subscribeToPromise } from './subscribeToPromise';
import { subscribeToIterable } from './subscribeToIterable';
import { subscribeToObservable } from './subscribeToObservable';
import { isArrayLike } from './isArrayLike';
import { isPromise } from './isPromise';
import { isObject } from './isObject';
import { iterator as Symbol_iterator } from '../symbol/iterator';
import { observable as Symbol_observable } from '../symbol/observable';
export const subscribeTo = (result) => {
    if (result instanceof Observable) {
        return (subscriber) => {
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
    else if (result && typeof result[Symbol_observable] === 'function') {
        return subscribeToObservable(result);
    }
    else if (isArrayLike(result)) {
        return subscribeToArray(result);
    }
    else if (isPromise(result)) {
        return subscribeToPromise(result);
    }
    else if (result && typeof result[Symbol_iterator] === 'function') {
        return subscribeToIterable(result);
    }
    else {
        const value = isObject(result) ? 'an invalid object' : `'${result}'`;
        const msg = `You provided ${value} where a stream was expected.`
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC91dGlsL3N1YnNjcmliZVRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLFFBQVEsSUFBSSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHdkUsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUksTUFBMEIsRUFBRSxFQUFFO0lBQzNELElBQUksTUFBTSxZQUFZLFVBQVUsRUFBRTtRQUNoQyxPQUFPLENBQUMsVUFBeUIsRUFBRSxFQUFFO1lBQ2pDLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDdEIsVUFBVSxDQUFDLElBQUksQ0FBRSxNQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsT0FBTyxTQUFTLENBQUM7YUFDbEI7aUJBQU07Z0JBQ0wsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDO0tBQ0g7U0FBTSxJQUFJLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUNwRSxPQUFPLHFCQUFxQixDQUFDLE1BQWEsQ0FBQyxDQUFDO0tBQzdDO1NBQU0sSUFBSSxXQUFXLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQztTQUFNLElBQUksU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzVCLE9BQU8sa0JBQWtCLENBQUMsTUFBc0IsQ0FBQyxDQUFDO0tBQ25EO1NBQU0sSUFBSSxNQUFNLElBQUksT0FBTyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssVUFBVSxFQUFFO1FBQ2xFLE9BQU8sbUJBQW1CLENBQUMsTUFBYSxDQUFDLENBQUM7S0FDM0M7U0FBTTtRQUNMLE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxHQUFHLENBQUM7UUFDckUsTUFBTSxHQUFHLEdBQUcsZ0JBQWdCLEtBQUssK0JBQStCO2NBQzVELDhEQUE4RCxDQUFDO1FBQ25FLE1BQU0sSUFBSSxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDMUI7QUFDSCxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb0FycmF5IH0gZnJvbSAnLi9zdWJzY3JpYmVUb0FycmF5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUHJvbWlzZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9Qcm9taXNlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvSXRlcmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvSXRlcmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9PYnNlcnZhYmxlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzUHJvbWlzZSB9IGZyb20gJy4vaXNQcm9taXNlJztcbmltcG9ydCB7IGlzT2JqZWN0IH0gZnJvbSAnLi9pc09iamVjdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi9zeW1ib2wvaXRlcmF0b3InO1xuaW1wb3J0IHsgb2JzZXJ2YWJsZSBhcyBTeW1ib2xfb2JzZXJ2YWJsZSB9IGZyb20gJy4uL3N5bWJvbC9vYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuZXhwb3J0IGNvbnN0IHN1YnNjcmliZVRvID0gPFQ+KHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFQ+KSA9PiB7XG4gIGlmIChyZXN1bHQgaW5zdGFuY2VvZiBPYnNlcnZhYmxlKSB7XG4gICAgcmV0dXJuIChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiB7XG4gICAgICAgIGlmIChyZXN1bHQuX2lzU2NhbGFyKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCgocmVzdWx0IGFzIGFueSkudmFsdWUpO1xuICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gcmVzdWx0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH1cbiAgICB9O1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9vYnNlcnZhYmxlXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb09ic2VydmFibGUocmVzdWx0IGFzIGFueSk7XG4gIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UocmVzdWx0KSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVUb0FycmF5KHJlc3VsdCk7XG4gIH0gZWxzZSBpZiAoaXNQcm9taXNlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9Qcm9taXNlKHJlc3VsdCBhcyBQcm9taXNlPGFueT4pO1xuICB9IGVsc2UgaWYgKHJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9JdGVyYWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2YWx1ZSA9IGlzT2JqZWN0KHJlc3VsdCkgPyAnYW4gaW52YWxpZCBvYmplY3QnIDogYCcke3Jlc3VsdH0nYDtcbiAgICBjb25zdCBtc2cgPSBgWW91IHByb3ZpZGVkICR7dmFsdWV9IHdoZXJlIGEgc3RyZWFtIHdhcyBleHBlY3RlZC5gXG4gICAgICArICcgWW91IGNhbiBwcm92aWRlIGFuIE9ic2VydmFibGUsIFByb21pc2UsIEFycmF5LCBvciBJdGVyYWJsZS4nO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKTtcbiAgfVxufTtcbiJdfQ==