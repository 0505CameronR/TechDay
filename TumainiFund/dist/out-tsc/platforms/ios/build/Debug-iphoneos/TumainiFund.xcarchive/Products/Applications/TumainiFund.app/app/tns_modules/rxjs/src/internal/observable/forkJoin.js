import { Observable } from '../Observable';
import { isArray } from '../util/isArray';
import { EMPTY } from './empty';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
import { map } from '../operators/map';
/* tslint:enable:max-line-length */
/**
 * Joins last values emitted by passed Observables.
 *
 * <span class="informal">Wait for Observables to complete and then combine last values they emitted.</span>
 *
 * ![](forkJoin.png)
 *
 * `forkJoin` is an operator that takes any number of Observables which can be passed either as an array
 * or directly as arguments. If no input Observables are provided, resulting stream will complete
 * immediately.
 *
 * `forkJoin` will wait for all passed Observables to complete and then it will emit an array with last
 * values from corresponding Observables. So if you pass `n` Observables to the operator, resulting
 * array will have `n` values, where first value is the last thing emitted by the first Observable,
 * second value is the last thing emitted by the second Observable and so on. That means `forkJoin` will
 * not emit more than once and it will complete after that. If you need to emit combined values not only
 * at the end of lifecycle of passed Observables, but also throughout it, try out {@link combineLatest}
 * or {@link zip} instead.
 *
 * In order for resulting array to have the same length as the number of input Observables, whenever any of
 * that Observables completes without emitting any value, `forkJoin` will complete at that moment as well
 * and it will not emit anything either, even if it already has some last values from other Observables.
 * Conversely, if there is an Observable that never completes, `forkJoin` will never complete as well,
 * unless at any point some other Observable completes without emitting value, which brings us back to
 * the previous case. Overall, in order for `forkJoin` to emit a value, all Observables passed as arguments
 * have to emit something at least once and complete.
 *
 * If any input Observable errors at some point, `forkJoin` will error as well and all other Observables
 * will be immediately unsubscribed.
 *
 * Optionally `forkJoin` accepts project function, that will be called with values which normally
 * would land in emitted array. Whatever is returned by project function, will appear in output
 * Observable instead. This means that default project can be thought of as a function that takes
 * all its arguments and puts them into an array. Note that project function will be called only
 * when output Observable is supposed to emit a result.
 *
 * ## Examples
 * ### Use forkJoin with operator emitting immediately
 * ```javascript
 * import { forkJoin, of } from 'rxjs';
 *
 * const observable = forkJoin(
 *   of(1, 2, 3, 4),
 *   of(5, 6, 7, 8),
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // [4, 8]
 * // "This is how it ends!"
 * ```
 *
 * ### Use forkJoin with operator emitting after some time
 * ```javascript
 * import { forkJoin, interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const observable = forkJoin(
 *   interval(1000).pipe(take(3)), // emit 0, 1, 2 every second and complete
 *   interval(500).pipe(take(4)),  // emit 0, 1, 2, 3 every half a second and complete
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // [2, 3] after 3 seconds
 * // "This is how it ends!" immediately after
 * ```
 *
 * ### Use forkJoin with project function
 * ```javascript
 * import { forkJoin, interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const observable = forkJoin(
 *   interval(1000).pipe(take(3)), // emit 0, 1, 2 every second and complete
 *   interval(500).pipe(take(4)),  // emit 0, 1, 2, 3 every half a second and complete
 * ).pipe(
 *   map(([n, m]) => n + m),
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // 5 after 3 seconds
 * // "This is how it ends!" immediately after
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 *
 * @param {...ObservableInput} sources Any number of Observables provided either as an array or as an arguments
 * passed directly to the operator.
 * @param {function} [project] Function that takes values emitted by input Observables and returns value
 * that will appear in resulting Observable instead of default array.
 * @return {Observable} Observable emitting either an array of last values emitted by passed Observables
 * or value from project function.
 */
export function forkJoin(...sources) {
    let resultSelector;
    if (typeof sources[sources.length - 1] === 'function') {
        // DEPRECATED PATH
        resultSelector = sources.pop();
    }
    // if the first and only other argument is an array
    // assume it's been called with `forkJoin([obs1, obs2, obs3])`
    if (sources.length === 1 && isArray(sources[0])) {
        sources = sources[0];
    }
    if (sources.length === 0) {
        return EMPTY;
    }
    if (resultSelector) {
        // DEPRECATED PATH
        return forkJoin(sources).pipe(map(args => resultSelector(...args)));
    }
    return new Observable(subscriber => {
        return new ForkJoinSubscriber(subscriber, sources);
    });
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ForkJoinSubscriber extends OuterSubscriber {
    constructor(destination, sources) {
        super(destination);
        this.sources = sources;
        this.completed = 0;
        this.haveValues = 0;
        const len = sources.length;
        this.values = new Array(len);
        for (let i = 0; i < len; i++) {
            const source = sources[i];
            const innerSubscription = subscribeToResult(this, source, null, i);
            if (innerSubscription) {
                this.add(innerSubscription);
            }
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    }
    notifyComplete(innerSub) {
        const { destination, haveValues, values } = this;
        const len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            destination.next(values);
        }
        destination.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ya0pvaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2ZvcmtKb2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDaEMsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBR3JELE9BQU8sRUFBRSxHQUFHLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQXVCdkMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJHRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQ3RCLEdBQUcsT0FBb0U7SUFHdkUsSUFBSSxjQUF3QixDQUFDO0lBQzdCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDckQsa0JBQWtCO1FBQ2xCLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFjLENBQUM7S0FDNUM7SUFFRCxtREFBbUQ7SUFDbkQsOERBQThEO0lBQzlELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUE4QixDQUFDO0tBQ25EO0lBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLEtBQUssQ0FBQztLQUNkO0lBRUQsSUFBSSxjQUFjLEVBQUU7UUFDbEIsa0JBQWtCO1FBQ2xCLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDM0IsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FDckMsQ0FBQztLQUNIO0lBRUQsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRTtRQUNqQyxPQUFPLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLE9BQW9DLENBQUMsQ0FBQztJQUNsRixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFDRDs7OztHQUlHO0FBQ0gsTUFBTSxrQkFBeUIsU0FBUSxlQUFxQjtJQUsxRCxZQUFZLFdBQTBCLEVBQ2xCLE9BQWtDO1FBQ3BELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQURELFlBQU8sR0FBUCxPQUFPLENBQTJCO1FBTDlDLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFFZCxlQUFVLEdBQUcsQ0FBQyxDQUFDO1FBTXJCLE1BQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVCLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixNQUFNLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRW5FLElBQUksaUJBQWlCLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUM3QjtTQUNGO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUFlLEVBQUUsVUFBYSxFQUM5QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQ3JDLElBQUksQ0FBRSxRQUFnQixDQUFDLFNBQVMsRUFBRTtZQUMvQixRQUFnQixDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDbkMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUErQjtRQUM1QyxNQUFNLEVBQUUsV0FBVyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDakQsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUUxQixJQUFJLENBQUUsUUFBZ0IsQ0FBQyxTQUFTLEVBQUU7WUFDaEMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELElBQUksVUFBVSxLQUFLLEdBQUcsRUFBRTtZQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFCO1FBRUQsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8vIGZvcmtKb2luKFthJCwgYiQsIGMkXSk7XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPl0pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDI+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj5dKTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDM+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUND4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDU+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND4sIE9ic2VydmFibGVJbnB1dDxUNT4sIE9ic2VydmFibGVJbnB1dDxUNj5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik6IE9ic2VydmFibGU8VFtdPjtcblxuLy8gZm9ya0pvaW4oYSQsIGIkLCBjJClcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+KTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPik6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcblxuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIGRlcHJlY2F0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbiguLi5hcmdzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PnxGdW5jdGlvbj4pOiBPYnNlcnZhYmxlPGFueT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oLi4uc291cmNlczogT2JzZXJ2YWJsZUlucHV0PFQ+W10pOiBPYnNlcnZhYmxlPFRbXT47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEpvaW5zIGxhc3QgdmFsdWVzIGVtaXR0ZWQgYnkgcGFzc2VkIE9ic2VydmFibGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XYWl0IGZvciBPYnNlcnZhYmxlcyB0byBjb21wbGV0ZSBhbmQgdGhlbiBjb21iaW5lIGxhc3QgdmFsdWVzIHRoZXkgZW1pdHRlZC48L3NwYW4+XG4gKlxuICogIVtdKGZvcmtKb2luLnBuZylcbiAqXG4gKiBgZm9ya0pvaW5gIGlzIGFuIG9wZXJhdG9yIHRoYXQgdGFrZXMgYW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyB3aGljaCBjYW4gYmUgcGFzc2VkIGVpdGhlciBhcyBhbiBhcnJheVxuICogb3IgZGlyZWN0bHkgYXMgYXJndW1lbnRzLiBJZiBubyBpbnB1dCBPYnNlcnZhYmxlcyBhcmUgcHJvdmlkZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBjb21wbGV0ZVxuICogaW1tZWRpYXRlbHkuXG4gKlxuICogYGZvcmtKb2luYCB3aWxsIHdhaXQgZm9yIGFsbCBwYXNzZWQgT2JzZXJ2YWJsZXMgdG8gY29tcGxldGUgYW5kIHRoZW4gaXQgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggbGFzdFxuICogdmFsdWVzIGZyb20gY29ycmVzcG9uZGluZyBPYnNlcnZhYmxlcy4gU28gaWYgeW91IHBhc3MgYG5gIE9ic2VydmFibGVzIHRvIHRoZSBvcGVyYXRvciwgcmVzdWx0aW5nXG4gKiBhcnJheSB3aWxsIGhhdmUgYG5gIHZhbHVlcywgd2hlcmUgZmlyc3QgdmFsdWUgaXMgdGhlIGxhc3QgdGhpbmcgZW1pdHRlZCBieSB0aGUgZmlyc3QgT2JzZXJ2YWJsZSxcbiAqIHNlY29uZCB2YWx1ZSBpcyB0aGUgbGFzdCB0aGluZyBlbWl0dGVkIGJ5IHRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBhbmQgc28gb24uIFRoYXQgbWVhbnMgYGZvcmtKb2luYCB3aWxsXG4gKiBub3QgZW1pdCBtb3JlIHRoYW4gb25jZSBhbmQgaXQgd2lsbCBjb21wbGV0ZSBhZnRlciB0aGF0LiBJZiB5b3UgbmVlZCB0byBlbWl0IGNvbWJpbmVkIHZhbHVlcyBub3Qgb25seVxuICogYXQgdGhlIGVuZCBvZiBsaWZlY3ljbGUgb2YgcGFzc2VkIE9ic2VydmFibGVzLCBidXQgYWxzbyB0aHJvdWdob3V0IGl0LCB0cnkgb3V0IHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogb3Ige0BsaW5rIHppcH0gaW5zdGVhZC5cbiAqXG4gKiBJbiBvcmRlciBmb3IgcmVzdWx0aW5nIGFycmF5IHRvIGhhdmUgdGhlIHNhbWUgbGVuZ3RoIGFzIHRoZSBudW1iZXIgb2YgaW5wdXQgT2JzZXJ2YWJsZXMsIHdoZW5ldmVyIGFueSBvZlxuICogdGhhdCBPYnNlcnZhYmxlcyBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhbnkgdmFsdWUsIGBmb3JrSm9pbmAgd2lsbCBjb21wbGV0ZSBhdCB0aGF0IG1vbWVudCBhcyB3ZWxsXG4gKiBhbmQgaXQgd2lsbCBub3QgZW1pdCBhbnl0aGluZyBlaXRoZXIsIGV2ZW4gaWYgaXQgYWxyZWFkeSBoYXMgc29tZSBsYXN0IHZhbHVlcyBmcm9tIG90aGVyIE9ic2VydmFibGVzLlxuICogQ29udmVyc2VseSwgaWYgdGhlcmUgaXMgYW4gT2JzZXJ2YWJsZSB0aGF0IG5ldmVyIGNvbXBsZXRlcywgYGZvcmtKb2luYCB3aWxsIG5ldmVyIGNvbXBsZXRlIGFzIHdlbGwsXG4gKiB1bmxlc3MgYXQgYW55IHBvaW50IHNvbWUgb3RoZXIgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyB2YWx1ZSwgd2hpY2ggYnJpbmdzIHVzIGJhY2sgdG9cbiAqIHRoZSBwcmV2aW91cyBjYXNlLiBPdmVyYWxsLCBpbiBvcmRlciBmb3IgYGZvcmtKb2luYCB0byBlbWl0IGEgdmFsdWUsIGFsbCBPYnNlcnZhYmxlcyBwYXNzZWQgYXMgYXJndW1lbnRzXG4gKiBoYXZlIHRvIGVtaXQgc29tZXRoaW5nIGF0IGxlYXN0IG9uY2UgYW5kIGNvbXBsZXRlLlxuICpcbiAqIElmIGFueSBpbnB1dCBPYnNlcnZhYmxlIGVycm9ycyBhdCBzb21lIHBvaW50LCBgZm9ya0pvaW5gIHdpbGwgZXJyb3IgYXMgd2VsbCBhbmQgYWxsIG90aGVyIE9ic2VydmFibGVzXG4gKiB3aWxsIGJlIGltbWVkaWF0ZWx5IHVuc3Vic2NyaWJlZC5cbiAqXG4gKiBPcHRpb25hbGx5IGBmb3JrSm9pbmAgYWNjZXB0cyBwcm9qZWN0IGZ1bmN0aW9uLCB0aGF0IHdpbGwgYmUgY2FsbGVkIHdpdGggdmFsdWVzIHdoaWNoIG5vcm1hbGx5XG4gKiB3b3VsZCBsYW5kIGluIGVtaXR0ZWQgYXJyYXkuIFdoYXRldmVyIGlzIHJldHVybmVkIGJ5IHByb2plY3QgZnVuY3Rpb24sIHdpbGwgYXBwZWFyIGluIG91dHB1dFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkLiBUaGlzIG1lYW5zIHRoYXQgZGVmYXVsdCBwcm9qZWN0IGNhbiBiZSB0aG91Z2h0IG9mIGFzIGEgZnVuY3Rpb24gdGhhdCB0YWtlc1xuICogYWxsIGl0cyBhcmd1bWVudHMgYW5kIHB1dHMgdGhlbSBpbnRvIGFuIGFycmF5LiBOb3RlIHRoYXQgcHJvamVjdCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBvbmx5XG4gKiB3aGVuIG91dHB1dCBPYnNlcnZhYmxlIGlzIHN1cHBvc2VkIHRvIGVtaXQgYSByZXN1bHQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBvcGVyYXRvciBlbWl0dGluZyBpbW1lZGlhdGVseVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBvZigxLCAyLCAzLCA0KSxcbiAqICAgb2YoNSwgNiwgNywgOCksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFs0LCA4XVxuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggb3BlcmF0b3IgZW1pdHRpbmcgYWZ0ZXIgc29tZSB0aW1lXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMykpLCAvLyBlbWl0IDAsIDEsIDIgZXZlcnkgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogICBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSg0KSksICAvLyBlbWl0IDAsIDEsIDIsIDMgZXZlcnkgaGFsZiBhIHNlY29uZCBhbmQgY29tcGxldGVcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gWzIsIDNdIGFmdGVyIDMgc2Vjb25kc1xuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggcHJvamVjdCBmdW5jdGlvblxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDMpKSwgLy8gZW1pdCAwLCAxLCAyIGV2ZXJ5IHNlY29uZCBhbmQgY29tcGxldGVcbiAqICAgaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoNCkpLCAgLy8gZW1pdCAwLCAxLCAyLCAzIGV2ZXJ5IGhhbGYgYSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiApLnBpcGUoXG4gKiAgIG1hcCgoW24sIG1dKSA9PiBuICsgbSksXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDUgYWZ0ZXIgMyBzZWNvbmRzXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCIgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayB6aXB9XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IHNvdXJjZXMgQW55IG51bWJlciBvZiBPYnNlcnZhYmxlcyBwcm92aWRlZCBlaXRoZXIgYXMgYW4gYXJyYXkgb3IgYXMgYW4gYXJndW1lbnRzXG4gKiBwYXNzZWQgZGlyZWN0bHkgdG8gdGhlIG9wZXJhdG9yLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW3Byb2plY3RdIEZ1bmN0aW9uIHRoYXQgdGFrZXMgdmFsdWVzIGVtaXR0ZWQgYnkgaW5wdXQgT2JzZXJ2YWJsZXMgYW5kIHJldHVybnMgdmFsdWVcbiAqIHRoYXQgd2lsbCBhcHBlYXIgaW4gcmVzdWx0aW5nIE9ic2VydmFibGUgaW5zdGVhZCBvZiBkZWZhdWx0IGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gT2JzZXJ2YWJsZSBlbWl0dGluZyBlaXRoZXIgYW4gYXJyYXkgb2YgbGFzdCB2YWx1ZXMgZW1pdHRlZCBieSBwYXNzZWQgT2JzZXJ2YWJsZXNcbiAqIG9yIHZhbHVlIGZyb20gcHJvamVjdCBmdW5jdGlvbi5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KFxuICAuLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4gfCBPYnNlcnZhYmxlSW5wdXQ8VD5bXSB8IEZ1bmN0aW9uPlxuKTogT2JzZXJ2YWJsZTxUW10+IHtcblxuICBsZXQgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uO1xuICBpZiAodHlwZW9mIHNvdXJjZXNbc291cmNlcy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJlc3VsdFNlbGVjdG9yID0gc291cmNlcy5wb3AoKSBhcyBGdW5jdGlvbjtcbiAgfVxuXG4gIC8vIGlmIHRoZSBmaXJzdCBhbmQgb25seSBvdGhlciBhcmd1bWVudCBpcyBhbiBhcnJheVxuICAvLyBhc3N1bWUgaXQncyBiZWVuIGNhbGxlZCB3aXRoIGBmb3JrSm9pbihbb2JzMSwgb2JzMiwgb2JzM10pYFxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShzb3VyY2VzWzBdKSkge1xuICAgIHNvdXJjZXMgPSBzb3VyY2VzWzBdIGFzIEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj47XG4gIH1cblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZm9ya0pvaW4oc291cmNlcykucGlwZShcbiAgICAgIG1hcChhcmdzID0+IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpKVxuICAgICk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgcmV0dXJuIG5ldyBGb3JrSm9pblN1YnNjcmliZXIoc3Vic2NyaWJlciwgc291cmNlcyBhcyBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTtcbiAgfSk7XG59XG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRm9ya0pvaW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSBjb21wbGV0ZWQgPSAwO1xuICBwcml2YXRlIHZhbHVlczogVFtdO1xuICBwcml2YXRlIGhhdmVWYWx1ZXMgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG5cbiAgICBjb25zdCBsZW4gPSBzb3VyY2VzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29uc3Qgc291cmNlID0gc291cmNlc1tpXTtcbiAgICAgIGNvbnN0IGlubmVyU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgc291cmNlLCBudWxsLCBpKTtcblxuICAgICAgaWYgKGlubmVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICAgIHRoaXMuYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogVCxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZXNbb3V0ZXJJbmRleF0gPSBpbm5lclZhbHVlO1xuICAgIGlmICghKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlKSB7XG4gICAgICAoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUgPSB0cnVlO1xuICAgICAgdGhpcy5oYXZlVmFsdWVzKys7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24sIGhhdmVWYWx1ZXMsIHZhbHVlcyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSB2YWx1ZXMubGVuZ3RoO1xuXG4gICAgaWYgKCEoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5jb21wbGV0ZWQrKztcblxuICAgIGlmICh0aGlzLmNvbXBsZXRlZCAhPT0gbGVuKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKGhhdmVWYWx1ZXMgPT09IGxlbikge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZXMpO1xuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==