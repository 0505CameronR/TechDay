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
    else if (!!result && typeof result[Symbol_observable] === 'function') {
        return subscribeToObservable(result);
    }
    else if (isArrayLike(result)) {
        return subscribeToArray(result);
    }
    else if (isPromise(result)) {
        return subscribeToPromise(result);
    }
    else if (!!result && typeof result[Symbol_iterator] === 'function') {
        return subscribeToIterable(result);
    }
    else {
        const value = isObject(result) ? 'an invalid object' : `'${result}'`;
        const msg = `You provided ${value} where a stream was expected.`
            + ' You can provide an Observable, Promise, Array, or Iterable.';
        throw new TypeError(msg);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3Vic2NyaWJlVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC91dGlsL3N1YnNjcmliZVRvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdEQsT0FBTyxFQUFFLGtCQUFrQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDMUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDaEUsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDdEMsT0FBTyxFQUFFLFFBQVEsSUFBSSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNqRSxPQUFPLEVBQUUsVUFBVSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFHdkUsTUFBTSxDQUFDLE1BQU0sV0FBVyxHQUFHLENBQUksTUFBMEIsRUFBRSxFQUFFO0lBQzNELElBQUksTUFBTSxZQUFZLFVBQVUsRUFBRTtRQUNoQyxPQUFPLENBQUMsVUFBeUIsRUFBRSxFQUFFO1lBQ2pDLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRTtnQkFDdEIsVUFBVSxDQUFDLElBQUksQ0FBRSxNQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3ZDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdEIsT0FBTyxTQUFTLENBQUM7YUFDbEI7aUJBQU07Z0JBQ0wsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDO0tBQ0g7U0FBTSxJQUFJLENBQUMsQ0FBQyxNQUFNLElBQUksT0FBTyxNQUFNLENBQUMsaUJBQWlCLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDdEUsT0FBTyxxQkFBcUIsQ0FBQyxNQUFhLENBQUMsQ0FBQztLQUM3QztTQUFNLElBQUksV0FBVyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQzlCLE9BQU8sZ0JBQWdCLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakM7U0FBTSxJQUFJLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUM1QixPQUFPLGtCQUFrQixDQUFDLE1BQXNCLENBQUMsQ0FBQztLQUNuRDtTQUFNLElBQUksQ0FBQyxDQUFDLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDcEUsT0FBTyxtQkFBbUIsQ0FBQyxNQUFhLENBQUMsQ0FBQztLQUMzQztTQUFNO1FBQ0wsTUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQztRQUNyRSxNQUFNLEdBQUcsR0FBRyxnQkFBZ0IsS0FBSywrQkFBK0I7Y0FDNUQsOERBQThELENBQUM7UUFDbkUsTUFBTSxJQUFJLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHN1YnNjcmliZVRvQXJyYXkgfSBmcm9tICcuL3N1YnNjcmliZVRvQXJyYXknO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9Qcm9taXNlIH0gZnJvbSAnLi9zdWJzY3JpYmVUb1Byb21pc2UnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9JdGVyYWJsZSB9IGZyb20gJy4vc3Vic2NyaWJlVG9JdGVyYWJsZSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb09ic2VydmFibGUgfSBmcm9tICcuL3N1YnNjcmliZVRvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4vaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNPYmplY3QgfSBmcm9tICcuL2lzT2JqZWN0JztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uL3N5bWJvbC9pdGVyYXRvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG5leHBvcnQgY29uc3Qgc3Vic2NyaWJlVG8gPSA8VD4ocmVzdWx0OiBPYnNlcnZhYmxlSW5wdXQ8VD4pID0+IHtcbiAgaWYgKHJlc3VsdCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICByZXR1cm4gKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IHtcbiAgICAgICAgaWYgKHJlc3VsdC5faXNTY2FsYXIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KChyZXN1bHQgYXMgYW55KS52YWx1ZSk7XG4gICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiByZXN1bHQuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfVxuICAgIH07XG4gIH0gZWxzZSBpZiAoISFyZXN1bHQgJiYgdHlwZW9mIHJlc3VsdFtTeW1ib2xfb2JzZXJ2YWJsZV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9PYnNlcnZhYmxlKHJlc3VsdCBhcyBhbnkpO1xuICB9IGVsc2UgaWYgKGlzQXJyYXlMaWtlKHJlc3VsdCkpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9BcnJheShyZXN1bHQpO1xuICB9IGVsc2UgaWYgKGlzUHJvbWlzZShyZXN1bHQpKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUHJvbWlzZShyZXN1bHQgYXMgUHJvbWlzZTxhbnk+KTtcbiAgfSBlbHNlIGlmICghIXJlc3VsdCAmJiB0eXBlb2YgcmVzdWx0W1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9JdGVyYWJsZShyZXN1bHQgYXMgYW55KTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCB2YWx1ZSA9IGlzT2JqZWN0KHJlc3VsdCkgPyAnYW4gaW52YWxpZCBvYmplY3QnIDogYCcke3Jlc3VsdH0nYDtcbiAgICBjb25zdCBtc2cgPSBgWW91IHByb3ZpZGVkICR7dmFsdWV9IHdoZXJlIGEgc3RyZWFtIHdhcyBleHBlY3RlZC5gXG4gICAgICArICcgWW91IGNhbiBwcm92aWRlIGFuIE9ic2VydmFibGUsIFByb21pc2UsIEFycmF5LCBvciBJdGVyYWJsZS4nO1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobXNnKTtcbiAgfVxufTtcbiJdfQ==