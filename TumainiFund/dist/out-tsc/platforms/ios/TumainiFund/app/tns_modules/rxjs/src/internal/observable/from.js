"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var isPromise_1 = require("../util/isPromise");
var isArrayLike_1 = require("../util/isArrayLike");
var isInteropObservable_1 = require("../util/isInteropObservable");
var isIterable_1 = require("../util/isIterable");
var fromArray_1 = require("./fromArray");
var fromPromise_1 = require("./fromPromise");
var fromIterable_1 = require("./fromIterable");
var fromObservable_1 = require("./fromObservable");
var subscribeTo_1 = require("../util/subscribeTo");
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
function from(input, scheduler) {
    if (!scheduler) {
        if (input instanceof Observable_1.Observable) {
            return input;
        }
        return new Observable_1.Observable(subscribeTo_1.subscribeTo(input));
    }
    if (input != null) {
        if (isInteropObservable_1.isInteropObservable(input)) {
            return fromObservable_1.fromObservable(input, scheduler);
        }
        else if (isPromise_1.isPromise(input)) {
            return fromPromise_1.fromPromise(input, scheduler);
        }
        else if (isArrayLike_1.isArrayLike(input)) {
            return fromArray_1.fromArray(input, scheduler);
        }
        else if (isIterable_1.isIterable(input) || typeof input === 'string') {
            return fromIterable_1.fromIterable(input, scheduler);
        }
    }
    throw new TypeError((input !== null && typeof input || input) + ' is not observable');
}
exports.from = from;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUMzQywrQ0FBOEM7QUFDOUMsbURBQWtEO0FBQ2xELG1FQUFrRTtBQUNsRSxpREFBZ0Q7QUFDaEQseUNBQXdDO0FBQ3hDLDZDQUE0QztBQUM1QywrQ0FBOEM7QUFDOUMsbURBQWtEO0FBQ2xELG1EQUFrRDtBQU1sRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUZHO0FBRUgsU0FBZ0IsSUFBSSxDQUFJLEtBQXlCLEVBQUUsU0FBeUI7SUFDMUUsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLElBQUksS0FBSyxZQUFZLHVCQUFVLEVBQUU7WUFDL0IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE9BQU8sSUFBSSx1QkFBVSxDQUFJLHlCQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUM5QztJQUVELElBQUksS0FBSyxJQUFJLElBQUksRUFBRTtRQUNqQixJQUFJLHlDQUFtQixDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzlCLE9BQU8sK0JBQWMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDekM7YUFBTSxJQUFJLHFCQUFTLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsT0FBTyx5QkFBVyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQztTQUN0QzthQUFNLElBQUkseUJBQVcsQ0FBQyxLQUFLLENBQUMsRUFBRTtZQUM3QixPQUFPLHFCQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3BDO2FBQU8sSUFBSSx1QkFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtZQUMxRCxPQUFPLDJCQUFZLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDO0tBQ0Y7SUFFRCxNQUFNLElBQUksU0FBUyxDQUFDLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxPQUFPLEtBQUssSUFBSSxLQUFLLENBQUMsR0FBRyxvQkFBb0IsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFyQkQsb0JBcUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNQcm9taXNlIH0gZnJvbSAnLi4vdXRpbC9pc1Byb21pc2UnO1xuaW1wb3J0IHsgaXNBcnJheUxpa2UgfSBmcm9tICcuLi91dGlsL2lzQXJyYXlMaWtlJztcbmltcG9ydCB7IGlzSW50ZXJvcE9ic2VydmFibGUgfSBmcm9tICcuLi91dGlsL2lzSW50ZXJvcE9ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNJdGVyYWJsZSB9IGZyb20gJy4uL3V0aWwvaXNJdGVyYWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBmcm9tUHJvbWlzZSB9IGZyb20gJy4vZnJvbVByb21pc2UnO1xuaW1wb3J0IHsgZnJvbUl0ZXJhYmxlIH0gZnJvbSAnLi9mcm9tSXRlcmFibGUnO1xuaW1wb3J0IHsgZnJvbU9ic2VydmFibGUgfSBmcm9tICcuL2Zyb21PYnNlcnZhYmxlJztcbmltcG9ydCB7IHN1YnNjcmliZVRvIH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUbyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tPFQ+KGlucHV0OiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxPYnNlcnZhYmxlSW5wdXQ8VD4+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+PjtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgZnJvbSBhbiBBcnJheSwgYW4gYXJyYXktbGlrZSBvYmplY3QsIGEgUHJvbWlzZSwgYW4gaXRlcmFibGUgb2JqZWN0LCBvciBhbiBPYnNlcnZhYmxlLWxpa2Ugb2JqZWN0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db252ZXJ0cyBhbG1vc3QgYW55dGhpbmcgdG8gYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKGZyb20ucG5nKVxuICpcbiAqIGBmcm9tYCBjb252ZXJ0cyB2YXJpb3VzIG90aGVyIG9iamVjdHMgYW5kIGRhdGEgdHlwZXMgaW50byBPYnNlcnZhYmxlcy4gSXQgYWxzbyBjb252ZXJ0cyBhIFByb21pc2UsIGFuIGFycmF5LWxpa2UsIG9yIGFuXG4gKiA8YSBocmVmPVwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvSXRlcmF0aW9uX3Byb3RvY29scyNpdGVyYWJsZVwiIHRhcmdldD1cIl9ibGFua1wiPml0ZXJhYmxlPC9hPlxuICogb2JqZWN0IGludG8gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtcyBpbiB0aGF0IHByb21pc2UsIGFycmF5LCBvciBpdGVyYWJsZS4gQSBTdHJpbmcsIGluIHRoaXMgY29udGV4dCwgaXMgdHJlYXRlZFxuICogYXMgYW4gYXJyYXkgb2YgY2hhcmFjdGVycy4gT2JzZXJ2YWJsZS1saWtlIG9iamVjdHMgKGNvbnRhaW5zIGEgZnVuY3Rpb24gbmFtZWQgd2l0aCB0aGUgRVMyMDE1IFN5bWJvbCBmb3IgT2JzZXJ2YWJsZSkgY2FuIGFsc28gYmVcbiAqIGNvbnZlcnRlZCB0aHJvdWdoIHRoaXMgb3BlcmF0b3IuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDb252ZXJ0cyBhbiBhcnJheSB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuICpcbiAqIGNvbnN0IGFycmF5ID0gWzEwLCAyMCwgMzBdO1xuICogY29uc3QgcmVzdWx0ID0gZnJvbShhcnJheSk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMTAgMjAgMzBcbiAqIGBgYFxuICpcbiAqIC0tLVxuICpcbiAqICMjIyBDb252ZXJ0IGFuIGluZmluaXRlIGl0ZXJhYmxlIChmcm9tIGEgZ2VuZXJhdG9yKSB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICogaW1wb3J0IHsgZnJvbSB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tJztcbiAqXG4gKiBmdW5jdGlvbiogZ2VuZXJhdGVEb3VibGVzKHNlZWQpIHtcbiAqICAgIGxldCBpID0gc2VlZDtcbiAqICAgIHdoaWxlICh0cnVlKSB7XG4gKiAgICAgIHlpZWxkIGk7XG4gKiAgICAgIGkgPSAyICogaTsgLy8gZG91YmxlIGl0XG4gKiAgICB9XG4gKiB9XG4gKlxuICogY29uc3QgaXRlcmF0b3IgPSBnZW5lcmF0ZURvdWJsZXMoMyk7XG4gKiBjb25zdCByZXN1bHQgPSBmcm9tKGl0ZXJhdG9yKS5waXBlKHRha2UoMTApKTtcbiAqXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAzIDYgMTIgMjQgNDggOTYgMTkyIDM4NCA3NjggMTUzNlxuICogYGBgXG4gKlxuICogLS0tXG4gKlxuICogIyMjIHdpdGggYXN5bmMgc2NoZWR1bGVyXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tIH0gZnJvbSAncnhqcy9vYnNlcnZhYmxlL2Zyb20nO1xuICogaW1wb3J0IHsgYXN5bmMgfSBmcm9tICdyeGpzL3NjaGVkdWxlci9hc3luYyc7XG4gKlxuICogY29uc29sZS5sb2coJ3N0YXJ0Jyk7XG4gKlxuICogY29uc3QgYXJyYXkgPSBbMTAsIDIwLCAzMF07XG4gKiBjb25zdCByZXN1bHQgPSBmcm9tKGFycmF5LCBhc3luYyk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiBjb25zb2xlLmxvZygnZW5kJyk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIHN0YXJ0IGVuZCAxMCAyMCAzMFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50fVxuICogQHNlZSB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn1cbiAqIEBzZWUge0BsaW5rIGZyb21Qcm9taXNlfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0PFQ+fSBBIHN1YnNjcmlwdGlvbiBvYmplY3QsIGEgUHJvbWlzZSwgYW4gT2JzZXJ2YWJsZS1saWtlLFxuICogYW4gQXJyYXksIGFuIGl0ZXJhYmxlLCBvciBhbiBhcnJheS1saWtlIG9iamVjdCB0byBiZSBjb252ZXJ0ZWQuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IEFuIG9wdGlvbmFsIHtAbGluayBTY2hlZHVsZXJMaWtlfSBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn1cbiAqIEBuYW1lIGZyb21cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb208VD4oaW5wdXQ6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIGlmIChpbnB1dCBpbnN0YW5jZW9mIE9ic2VydmFibGUpIHtcbiAgICAgIHJldHVybiBpbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZVRvKGlucHV0KSk7XG4gIH1cblxuICBpZiAoaW5wdXQgIT0gbnVsbCkge1xuICAgIGlmIChpc0ludGVyb3BPYnNlcnZhYmxlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21PYnNlcnZhYmxlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNQcm9taXNlKGlucHV0KSkge1xuICAgICAgcmV0dXJuIGZyb21Qcm9taXNlKGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheUxpa2UoaW5wdXQpKSB7XG4gICAgICByZXR1cm4gZnJvbUFycmF5KGlucHV0LCBzY2hlZHVsZXIpO1xuICAgIH0gIGVsc2UgaWYgKGlzSXRlcmFibGUoaW5wdXQpIHx8IHR5cGVvZiBpbnB1dCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBmcm9tSXRlcmFibGUoaW5wdXQsIHNjaGVkdWxlcik7XG4gICAgfVxuICB9XG5cbiAgdGhyb3cgbmV3IFR5cGVFcnJvcigoaW5wdXQgIT09IG51bGwgJiYgdHlwZW9mIGlucHV0IHx8IGlucHV0KSArICcgaXMgbm90IG9ic2VydmFibGUnKTtcbn1cbiJdfQ==