import { OuterSubscriber } from '../OuterSubscriber';
import { InnerSubscriber } from '../InnerSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/* tslint:enable:max-line-length */
/**
 * Catches errors on the observable to be handled by returning a new observable or throwing an error.
 *
 * ![](catch.png)
 *
 * ## Examples
 * Continues with a different Observable when there's an error
 *
 * ```javascript
 * import { of } from 'rxjs';
 * import { map, catchError } from 'rxjs/operators';
 *
 * of(1, 2, 3, 4, 5).pipe(
 *     map(n => {
 *   	   if (n == 4) {
 * 	       throw 'four!';
 *       }
 *	     return n;
 *     }),
 *     catchError(err => of('I', 'II', 'III', 'IV', 'V')),
 *   )
 *   .subscribe(x => console.log(x));
 *   // 1, 2, 3, I, II, III, IV, V
 * ```
 *
 * Retries the caught source Observable again in case of error, similar to retry() operator
 *
 * ```javascript
 * import { of } from 'rxjs';
 * import { map, catchError, take } from 'rxjs/operators';
 *
 * of(1, 2, 3, 4, 5).pipe(
 *     map(n => {
 *   	   if (n === 4) {
 *   	     throw 'four!';
 *       }
 * 	     return n;
 *     }),
 *     catchError((err, caught) => caught),
 *     take(30),
 *   )
 *   .subscribe(x => console.log(x));
 *   // 1, 2, 3, 1, 2, 3, ...
 * ```
 *
 * Throws a new error when the source Observable throws an error
 *
 * ```javascript
 * import { of } from 'rxjs';
 * import { map, catchError } from 'rxjs/operators';
 *
 * of(1, 2, 3, 4, 5).pipe(
 *     map(n => {
 *       if (n == 4) {
 *         throw 'four!';
 *       }
 *       return n;
 *     }),
 *     catchError(err => {
 *       throw 'error in source. Details: ' + err;
 *     }),
 *   )
 *   .subscribe(
 *     x => console.log(x),
 *     err => console.log(err)
 *   );
 *   // 1, 2, 3, error in source. Details: four!
 * ```
 *
 *  @param {function} selector a function that takes as arguments `err`, which is the error, and `caught`, which
 *  is the source observable, in case you'd like to "retry" that observable by returning it again. Whatever observable
 *  is returned by the `selector` will be used to continue the observable chain.
 * @return {Observable} An observable that originates from either the source or the observable returned by the
 *  catch `selector` function.
 * @name catchError
 */
export function catchError(selector) {
    return function catchErrorOperatorFunction(source) {
        const operator = new CatchOperator(selector);
        const caught = source.lift(operator);
        return (operator.caught = caught);
    };
}
class CatchOperator {
    constructor(selector) {
        this.selector = selector;
    }
    call(subscriber, source) {
        return source.subscribe(new CatchSubscriber(subscriber, this.selector, this.caught));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class CatchSubscriber extends OuterSubscriber {
    constructor(destination, selector, caught) {
        super(destination);
        this.selector = selector;
        this.caught = caught;
    }
    // NOTE: overriding `error` instead of `_error` because we don't want
    // to have this flag this subscriber as `isStopped`. We can mimic the
    // behavior of the RetrySubscriber (from the `retry` operator), where
    // we unsubscribe from our source chain, reset our Subscriber flags,
    // then subscribe to the selector result.
    error(err) {
        if (!this.isStopped) {
            let result;
            try {
                result = this.selector(err, this.caught);
            }
            catch (err2) {
                super.error(err2);
                return;
            }
            this._unsubscribeAndRecycle();
            const innerSubscriber = new InnerSubscriber(this, undefined, undefined);
            this.add(innerSubscriber);
            subscribeToResult(this, result, undefined, undefined, innerSubscriber);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2F0Y2hFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9jYXRjaEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBLE9BQU8sRUFBQyxlQUFlLEVBQUMsTUFBTSxvQkFBb0IsQ0FBQztBQUNuRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sMkJBQTJCLENBQUM7QUFLNUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyRUc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUN4QixRQUFnRDtJQUVoRCxPQUFPLFNBQVMsMEJBQTBCLENBQUMsTUFBcUI7UUFDOUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0MsTUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsUUFBUSxDQUFDLE1BQU0sR0FBRyxNQUF1QixDQUFDLENBQUM7SUFDckQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sYUFBYTtJQUdqQixZQUFvQixRQUFxRTtRQUFyRSxhQUFRLEdBQVIsUUFBUSxDQUE2RDtJQUN6RixDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sZUFBc0IsU0FBUSxlQUF5QjtJQUMzRCxZQUFZLFdBQTRCLEVBQ3BCLFFBQXFFLEVBQ3JFLE1BQXFCO1FBQ3ZDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUZELGFBQVEsR0FBUixRQUFRLENBQTZEO1FBQ3JFLFdBQU0sR0FBTixNQUFNLENBQWU7SUFFekMsQ0FBQztJQUVELHFFQUFxRTtJQUNyRSxxRUFBcUU7SUFDckUscUVBQXFFO0lBQ3JFLG9FQUFvRTtJQUNwRSx5Q0FBeUM7SUFDekMsS0FBSyxDQUFDLEdBQVE7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixJQUFJLE1BQVcsQ0FBQztZQUNoQixJQUFJO2dCQUNGLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7YUFDMUM7WUFBQyxPQUFPLElBQUksRUFBRTtnQkFDYixLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNsQixPQUFPO2FBQ1I7WUFDRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixNQUFNLGVBQWUsR0FBRyxJQUFJLGVBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLElBQUksQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDMUIsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3hFO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPcGVyYXRvcn0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHtTdWJzY3JpYmVyfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbmltcG9ydCB7T3V0ZXJTdWJzY3JpYmVyfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7c3Vic2NyaWJlVG9SZXN1bHR9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHtPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24sIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2ZWRWYWx1ZU9mfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhdGNoRXJyb3I8VCwgTyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+PihzZWxlY3RvcjogKGVycjogYW55LCBjYXVnaHQ6IE9ic2VydmFibGU8VD4pID0+IE8pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBPYnNlcnZlZFZhbHVlT2Y8Tz4+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDYXRjaGVzIGVycm9ycyBvbiB0aGUgb2JzZXJ2YWJsZSB0byBiZSBoYW5kbGVkIGJ5IHJldHVybmluZyBhIG5ldyBvYnNlcnZhYmxlIG9yIHRocm93aW5nIGFuIGVycm9yLlxuICpcbiAqICFbXShjYXRjaC5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIENvbnRpbnVlcyB3aXRoIGEgZGlmZmVyZW50IE9ic2VydmFibGUgd2hlbiB0aGVyZSdzIGFuIGVycm9yXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IG1hcCwgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvZigxLCAyLCAzLCA0LCA1KS5waXBlKFxuICogICAgIG1hcChuID0+IHtcbiAqICAgXHQgICBpZiAobiA9PSA0KSB7XG4gKiBcdCAgICAgICB0aHJvdyAnZm91ciEnO1xuICogICAgICAgfVxuICpcdCAgICAgcmV0dXJuIG47XG4gKiAgICAgfSksXG4gKiAgICAgY2F0Y2hFcnJvcihlcnIgPT4gb2YoJ0knLCAnSUknLCAnSUlJJywgJ0lWJywgJ1YnKSksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqICAgLy8gMSwgMiwgMywgSSwgSUksIElJSSwgSVYsIFZcbiAqIGBgYFxuICpcbiAqIFJldHJpZXMgdGhlIGNhdWdodCBzb3VyY2UgT2JzZXJ2YWJsZSBhZ2FpbiBpbiBjYXNlIG9mIGVycm9yLCBzaW1pbGFyIHRvIHJldHJ5KCkgb3BlcmF0b3JcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIG9mKDEsIDIsIDMsIDQsIDUpLnBpcGUoXG4gKiAgICAgbWFwKG4gPT4ge1xuICogICBcdCAgIGlmIChuID09PSA0KSB7XG4gKiAgIFx0ICAgICB0aHJvdyAnZm91ciEnO1xuICogICAgICAgfVxuICogXHQgICAgIHJldHVybiBuO1xuICogICAgIH0pLFxuICogICAgIGNhdGNoRXJyb3IoKGVyciwgY2F1Z2h0KSA9PiBjYXVnaHQpLFxuICogICAgIHRha2UoMzApLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiAgIC8vIDEsIDIsIDMsIDEsIDIsIDMsIC4uLlxuICogYGBgXG4gKlxuICogVGhyb3dzIGEgbmV3IGVycm9yIHdoZW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRocm93cyBhbiBlcnJvclxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtYXAsIGNhdGNoRXJyb3IgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogb2YoMSwgMiwgMywgNCwgNSkucGlwZShcbiAqICAgICBtYXAobiA9PiB7XG4gKiAgICAgICBpZiAobiA9PSA0KSB7XG4gKiAgICAgICAgIHRocm93ICdmb3VyISc7XG4gKiAgICAgICB9XG4gKiAgICAgICByZXR1cm4gbjtcbiAqICAgICB9KSxcbiAqICAgICBjYXRjaEVycm9yKGVyciA9PiB7XG4gKiAgICAgICB0aHJvdyAnZXJyb3IgaW4gc291cmNlLiBEZXRhaWxzOiAnICsgZXJyO1xuICogICAgIH0pLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoXG4gKiAgICAgeCA9PiBjb25zb2xlLmxvZyh4KSxcbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKVxuICogICApO1xuICogICAvLyAxLCAyLCAzLCBlcnJvciBpbiBzb3VyY2UuIERldGFpbHM6IGZvdXIhXG4gKiBgYGBcbiAqXG4gKiAgQHBhcmFtIHtmdW5jdGlvbn0gc2VsZWN0b3IgYSBmdW5jdGlvbiB0aGF0IHRha2VzIGFzIGFyZ3VtZW50cyBgZXJyYCwgd2hpY2ggaXMgdGhlIGVycm9yLCBhbmQgYGNhdWdodGAsIHdoaWNoXG4gKiAgaXMgdGhlIHNvdXJjZSBvYnNlcnZhYmxlLCBpbiBjYXNlIHlvdSdkIGxpa2UgdG8gXCJyZXRyeVwiIHRoYXQgb2JzZXJ2YWJsZSBieSByZXR1cm5pbmcgaXQgYWdhaW4uIFdoYXRldmVyIG9ic2VydmFibGVcbiAqICBpcyByZXR1cm5lZCBieSB0aGUgYHNlbGVjdG9yYCB3aWxsIGJlIHVzZWQgdG8gY29udGludWUgdGhlIG9ic2VydmFibGUgY2hhaW4uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHRoYXQgb3JpZ2luYXRlcyBmcm9tIGVpdGhlciB0aGUgc291cmNlIG9yIHRoZSBvYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZVxuICogIGNhdGNoIGBzZWxlY3RvcmAgZnVuY3Rpb24uXG4gKiBAbmFtZSBjYXRjaEVycm9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYXRjaEVycm9yPFQsIE8gZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55Pj4oXG4gIHNlbGVjdG9yOiAoZXJyOiBhbnksIGNhdWdodDogT2JzZXJ2YWJsZTxUPikgPT4gT1xuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgT2JzZXJ2ZWRWYWx1ZU9mPE8+PiB7XG4gIHJldHVybiBmdW5jdGlvbiBjYXRjaEVycm9yT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQgfCBPYnNlcnZlZFZhbHVlT2Y8Tz4+IHtcbiAgICBjb25zdCBvcGVyYXRvciA9IG5ldyBDYXRjaE9wZXJhdG9yKHNlbGVjdG9yKTtcbiAgICBjb25zdCBjYXVnaHQgPSBzb3VyY2UubGlmdChvcGVyYXRvcik7XG4gICAgcmV0dXJuIChvcGVyYXRvci5jYXVnaHQgPSBjYXVnaHQgYXMgT2JzZXJ2YWJsZTxUPik7XG4gIH07XG59XG5cbmNsYXNzIENhdGNoT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUIHwgUj4ge1xuICBjYXVnaHQ6IE9ic2VydmFibGU8VD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBzZWxlY3RvcjogKGVycjogYW55LCBjYXVnaHQ6IE9ic2VydmFibGU8VD4pID0+IE9ic2VydmFibGVJbnB1dDxUIHwgUj4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBDYXRjaFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5zZWxlY3RvciwgdGhpcy5jYXVnaHQpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQ2F0Y2hTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQgfCBSPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc2VsZWN0b3I6IChlcnI6IGFueSwgY2F1Z2h0OiBPYnNlcnZhYmxlPFQ+KSA9PiBPYnNlcnZhYmxlSW5wdXQ8VCB8IFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNhdWdodDogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIC8vIE5PVEU6IG92ZXJyaWRpbmcgYGVycm9yYCBpbnN0ZWFkIG9mIGBfZXJyb3JgIGJlY2F1c2Ugd2UgZG9uJ3Qgd2FudFxuICAvLyB0byBoYXZlIHRoaXMgZmxhZyB0aGlzIHN1YnNjcmliZXIgYXMgYGlzU3RvcHBlZGAuIFdlIGNhbiBtaW1pYyB0aGVcbiAgLy8gYmVoYXZpb3Igb2YgdGhlIFJldHJ5U3Vic2NyaWJlciAoZnJvbSB0aGUgYHJldHJ5YCBvcGVyYXRvciksIHdoZXJlXG4gIC8vIHdlIHVuc3Vic2NyaWJlIGZyb20gb3VyIHNvdXJjZSBjaGFpbiwgcmVzZXQgb3VyIFN1YnNjcmliZXIgZmxhZ3MsXG4gIC8vIHRoZW4gc3Vic2NyaWJlIHRvIHRoZSBzZWxlY3RvciByZXN1bHQuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgbGV0IHJlc3VsdDogYW55O1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmVzdWx0ID0gdGhpcy5zZWxlY3RvcihlcnIsIHRoaXMuY2F1Z2h0KTtcbiAgICAgIH0gY2F0Y2ggKGVycjIpIHtcbiAgICAgICAgc3VwZXIuZXJyb3IoZXJyMik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgICAgY29uc3QgaW5uZXJTdWJzY3JpYmVyID0gbmV3IElubmVyU3Vic2NyaWJlcih0aGlzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgICB0aGlzLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgICAgc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgcmVzdWx0LCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW5uZXJTdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==