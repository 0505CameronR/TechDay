import { Observable } from '../Observable';
import { isPromise } from '../util/isPromise';
import { isArrayLike } from '../util/isArrayLike';
import { isInteropObservable } from '../util/isInteropObservable';
import { isIterable } from '../util/isIterable';
import { fromArray } from './fromArray';
import { fromPromise } from './fromPromise';
import { fromIterable } from './fromIterable';
import { fromObservable } from './fromObservable';
import { subscribeTo } from '../util/subscribeTo';
/**
 * Creates an Observable from an Array, an array-like object, a Promise, an iterable object, or an Observable-like object.
 *
 * <span class="informal">Converts almost anything to an Observable.</span>
 *
 * ![](from.png)
 *
 * `from` converts various other objects and data types into Observables. It also converts a Promise, an array-like, or an
 * <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#iterable" target="_blank">iterable</a>
 * object into an Observable that emits the items in that promise, array, or iterable. A String, in this context, is treated
 * as an array of characters. Observable-like objects (contains a function named with the ES2015 Symbol for Observable) can also be
 * converted through this operator.
 *
 * ## Examples
 * ### Converts an array to an Observable
 * ```javascript
 * import { from } from 'rxjs/observable/from';
 *
 * const array = [10, 20, 30];
 * const result = from(array);
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 10 20 30
 * ```
 *
 * ---
 *
 * ### Convert an infinite iterable (from a generator) to an Observable
 * ```javascript
 * import { take } from 'rxjs/operators';
 * import { from } from 'rxjs/observable/from';
 *
 * function* generateDoubles(seed) {
 *    let i = seed;
 *    while (true) {
 *      yield i;
 *      i = 2 * i; // double it
 *    }
 * }
 *
 * const iterator = generateDoubles(3);
 * const result = from(iterator).pipe(take(10));
 *
 * result.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 3 6 12 24 48 96 192 384 768 1536
 * ```
 *
 * ---
 *
 * ### with async scheduler
 * ```javascript
 * import { from } from 'rxjs/observable/from';
 * import { async } from 'rxjs/scheduler/async';
 *
 * console.log('start');
 *
 * const array = [10, 20, 30];
 * const result = from(array, async);
 *
 * result.subscribe(x => console.log(x));
 *
 * console.log('end');
 *
 * // Logs:
 * // start end 10 20 30
 * ```
 *
 * @see {@link fromEvent}
 * @see {@link fromEventPattern}
 * @see {@link fromPromise}
 *
 * @param {ObservableInput<T>} A subscription object, a Promise, an Observable-like,
 * an Array, an iterable, or an array-like object to be converted.
 * @param {SchedulerLike} An optional {@link SchedulerLike} on which to schedule the emission of values.
 * @return {Observable<T>}
 * @name from
 * @owner Observable
 */
export function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof Observable) {
            return input;
        }
        return new Observable(subscribeTo(input));
    }
    if (input != null) {
        if (isInteropObservable(input)) {
            return fromObservable(input, scheduler);
        }
        else if (isPromise(input)) {
            return fromPromise(input, scheduler);
        }
        else if (isArrayLike(input)) {
            return fromArray(input, scheduler);
        }
        else if (isIterable(input) || typeof input === 'string') {
            return fromIterable(input, scheduler);
        }
    }
    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbEQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDbEUsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFDeEMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDOUMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQU1sRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUZHO0FBRUgsTUFBTSxVQUFVLElBQUksQ0FBSSxLQUF5QixFQUFFLFNBQXlCO0lBQzFFLElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxJQUFJLEtBQUssWUFBWSxVQUFVLEVBQUU7WUFDL0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSxVQUFVLENBQUksV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7S0FDOUM7SUFFRCxJQUFJLEtBQUssSUFBSSxJQUFJLEVBQUU7UUFDakIsSUFBSSxtQkFBbUIsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM5QixPQUFPLGNBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekM7YUFBTSxJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUMzQixPQUFPLFdBQVcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDdEM7YUFBTSxJQUFJLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDcEM7YUFBTyxJQUFJLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7WUFDMUQsT0FBTyxZQUFZLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7SUFFRCxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc1Byb21pc2UgfSBmcm9tICcuLi91dGlsL2lzUHJvbWlzZSc7XG5pbXBvcnQgeyBpc0FycmF5TGlrZSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheUxpa2UnO1xuaW1wb3J0IHsgaXNJbnRlcm9wT2JzZXJ2YWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJbnRlcm9wT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0l0ZXJhYmxlIH0gZnJvbSAnLi4vdXRpbC9pc0l0ZXJhYmxlJztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IGZyb21Qcm9taXNlIH0gZnJvbSAnLi9mcm9tUHJvbWlzZSc7XG5pbXBvcnQgeyBmcm9tSXRlcmFibGUgfSBmcm9tICcuL2Zyb21JdGVyYWJsZSc7XG5pbXBvcnQgeyBmcm9tT2JzZXJ2YWJsZSB9IGZyb20gJy4vZnJvbU9ic2VydmFibGUnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG8gfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gZnJvbTxUPihpbnB1dDogT2JzZXJ2YWJsZUlucHV0PE9ic2VydmFibGVJbnB1dDxUPj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPE9ic2VydmFibGU8VD4+O1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBmcm9tIGFuIEFycmF5LCBhbiBhcnJheS1saWtlIG9iamVjdCwgYSBQcm9taXNlLCBhbiBpdGVyYWJsZSBvYmplY3QsIG9yIGFuIE9ic2VydmFibGUtbGlrZSBvYmplY3QuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbnZlcnRzIGFsbW9zdCBhbnl0aGluZyB0byBhbiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10oZnJvbS5wbmcpXG4gKlxuICogYGZyb21gIGNvbnZlcnRzIHZhcmlvdXMgb3RoZXIgb2JqZWN0cyBhbmQgZGF0YSB0eXBlcyBpbnRvIE9ic2VydmFibGVzLiBJdCBhbHNvIGNvbnZlcnRzIGEgUHJvbWlzZSwgYW4gYXJyYXktbGlrZSwgb3IgYW5cbiAqIDxhIGhyZWY9XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9JdGVyYXRpb25fcHJvdG9jb2xzI2l0ZXJhYmxlXCIgdGFyZ2V0PVwiX2JsYW5rXCI+aXRlcmFibGU8L2E+XG4gKiBvYmplY3QgaW50byBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGl0ZW1zIGluIHRoYXQgcHJvbWlzZSwgYXJyYXksIG9yIGl0ZXJhYmxlLiBBIFN0cmluZywgaW4gdGhpcyBjb250ZXh0LCBpcyB0cmVhdGVkXG4gKiBhcyBhbiBhcnJheSBvZiBjaGFyYWN0ZXJzLiBPYnNlcnZhYmxlLWxpa2Ugb2JqZWN0cyAoY29udGFpbnMgYSBmdW5jdGlvbiBuYW1lZCB3aXRoIHRoZSBFUzIwMTUgU3ltYm9sIGZvciBPYnNlcnZhYmxlKSBjYW4gYWxzbyBiZVxuICogY29udmVydGVkIHRocm91Z2ggdGhpcyBvcGVyYXRvci5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbnZlcnRzIGFuIGFycmF5IHRvIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzL29ic2VydmFibGUvZnJvbSc7XG4gKlxuICogY29uc3QgYXJyYXkgPSBbMTAsIDIwLCAzMF07XG4gKiBjb25zdCByZXN1bHQgPSBmcm9tKGFycmF5KTtcbiAqXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAxMCAyMCAzMFxuICogYGBgXG4gKlxuICogLS0tXG4gKlxuICogIyMjIENvbnZlcnQgYW4gaW5maW5pdGUgaXRlcmFibGUgKGZyb20gYSBnZW5lcmF0b3IpIHRvIGFuIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuICpcbiAqIGZ1bmN0aW9uKiBnZW5lcmF0ZURvdWJsZXMoc2VlZCkge1xuICogICAgbGV0IGkgPSBzZWVkO1xuICogICAgd2hpbGUgKHRydWUpIHtcbiAqICAgICAgeWllbGQgaTtcbiAqICAgICAgaSA9IDIgKiBpOyAvLyBkb3VibGUgaXRcbiAqICAgIH1cbiAqIH1cbiAqXG4gKiBjb25zdCBpdGVyYXRvciA9IGdlbmVyYXRlRG91YmxlcygzKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGZyb20oaXRlcmF0b3IpLnBpcGUodGFrZSgxMCkpO1xuICpcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDMgNiAxMiAyNCA0OCA5NiAxOTIgMzg0IDc2OCAxNTM2XG4gKiBgYGBcbiAqXG4gKiAtLS1cbiAqXG4gKiAjIyMgd2l0aCBhc3luYyBzY2hlZHVsZXJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb20gfSBmcm9tICdyeGpzL29ic2VydmFibGUvZnJvbSc7XG4gKiBpbXBvcnQgeyBhc3luYyB9IGZyb20gJ3J4anMvc2NoZWR1bGVyL2FzeW5jJztcbiAqXG4gKiBjb25zb2xlLmxvZygnc3RhcnQnKTtcbiAqXG4gKiBjb25zdCBhcnJheSA9IFsxMCwgMjAsIDMwXTtcbiAqIGNvbnN0IHJlc3VsdCA9IGZyb20oYXJyYXksIGFzeW5jKTtcbiAqXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIGNvbnNvbGUubG9nKCdlbmQnKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gc3RhcnQgZW5kIDEwIDIwIDMwXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnR9XG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufVxuICogQHNlZSB7QGxpbmsgZnJvbVByb21pc2V9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXQ8VD59IEEgc3Vic2NyaXB0aW9uIG9iamVjdCwgYSBQcm9taXNlLCBhbiBPYnNlcnZhYmxlLWxpa2UsXG4gKiBhbiBBcnJheSwgYW4gaXRlcmFibGUsIG9yIGFuIGFycmF5LWxpa2Ugb2JqZWN0IHRvIGJlIGNvbnZlcnRlZC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gQW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IG9uIHdoaWNoIHRvIHNjaGVkdWxlIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fVxuICogQG5hbWUgZnJvbVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gZnJvbTxUPihpbnB1dDogT2JzZXJ2YWJsZUlucHV0PFQ+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgT2JzZXJ2YWJsZSkge1xuICAgICAgcmV0dXJuIGlucHV0O1xuICAgIH1cbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlVG8oaW5wdXQpKTtcbiAgfVxuXG4gIGlmIChpbnB1dCAhPSBudWxsKSB7XG4gICAgaWYgKGlzSW50ZXJvcE9ic2VydmFibGUoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbU9ic2VydmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSBlbHNlIGlmIChpc1Byb21pc2UoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbVByb21pc2UoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSBlbHNlIGlmIChpc0FycmF5TGlrZShpbnB1dCkpIHtcbiAgICAgIHJldHVybiBmcm9tQXJyYXkoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfSAgZWxzZSBpZiAoaXNJdGVyYWJsZShpbnB1dCkgfHwgdHlwZW9mIGlucHV0ID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZyb21JdGVyYWJsZShpbnB1dCwgc2NoZWR1bGVyKTtcbiAgICB9XG4gIH1cblxuICB0aHJvdyBuZXcgVHlwZUVycm9yKChpbnB1dCAhPT0gbnVsbCAmJiB0eXBlb2YgaW5wdXQgfHwgaW5wdXQpICsgJyBpcyBub3Qgb2JzZXJ2YWJsZScpO1xufVxuIl19