"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var combineLatest_1 = require("../observable/combineLatest");
/**
 * Flattens an Observable-of-Observables by applying {@link combineLatest} when the Observable-of-Observables completes.
 *
 * ![](combineAll.png)
 *
 * `combineAll` takes an Observable of Observables, and collects all Observables from it. Once the outer Observable completes,
 * it subscribes to all collected Observables and combines their values using the {@link combineLatest}</a> strategy, such that:
 *
 * * Every time an inner Observable emits, the output Observable emits
 * * When the returned observable emits, it emits all of the latest values by:
 *    * If a `project` function is provided, it is called with each recent value from each inner Observable in whatever order they
 *      arrived, and the result of the `project` function is what is emitted by the output Observable.
 *    * If there is no `project` function, an array of all the most recent values is emitted by the output Observable.
 *
 * ---
 *
 * ## Examples
 * ### Map two click events to a finite interval Observable, then apply `combineAll`
 * ```javascript
 * import { map, combineAll, take } from 'rxjs/operators';
 * import { fromEvent } from 'rxjs/observable/fromEvent';
 *
 * const clicks = fromEvent(document, 'click');
 * const higherOrder = clicks.pipe(
 *   map(ev =>
 *      interval(Math.random() * 2000).pipe(take(3))
 *   ),
 *   take(2)
 * );
 * const result = higherOrder.pipe(
 *   combineAll()
 * );
 *
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link mergeAll}
 *
 * @param {function(...values: Array<any>)} An optional function to map the most recent values from each inner Observable into a new result.
 * Takes each of the most recent values from each collected inner Observable as arguments, in order.
 * @return {Observable<T>}
 * @name combineAll
 */
function combineAll(project) {
    return function (source) { return source.lift(new combineLatest_1.CombineLatestOperator(project)); };
}
exports.combineAll = combineAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZUFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9jb21iaW5lQWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkRBQW9FO0FBUXBFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFPLE9BQXNDO0lBQ3JFLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHFDQUFxQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQS9DLENBQStDLENBQUM7QUFDcEYsQ0FBQztBQUZELGdDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tYmluZUxhdGVzdE9wZXJhdG9yIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb21iaW5lTGF0ZXN0JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFRbXT47XG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQWxsPFQsIFI+KHByb2plY3Q6ICguLi52YWx1ZXM6IFRbXSkgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBSPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQWxsPFI+KHByb2plY3Q6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG4vKipcbiAqIEZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMgYnkgYXBwbHlpbmcge0BsaW5rIGNvbWJpbmVMYXRlc3R9IHdoZW4gdGhlIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMgY29tcGxldGVzLlxuICpcbiAqICFbXShjb21iaW5lQWxsLnBuZylcbiAqXG4gKiBgY29tYmluZUFsbGAgdGFrZXMgYW4gT2JzZXJ2YWJsZSBvZiBPYnNlcnZhYmxlcywgYW5kIGNvbGxlY3RzIGFsbCBPYnNlcnZhYmxlcyBmcm9tIGl0LiBPbmNlIHRoZSBvdXRlciBPYnNlcnZhYmxlIGNvbXBsZXRlcyxcbiAqIGl0IHN1YnNjcmliZXMgdG8gYWxsIGNvbGxlY3RlZCBPYnNlcnZhYmxlcyBhbmQgY29tYmluZXMgdGhlaXIgdmFsdWVzIHVzaW5nIHRoZSB7QGxpbmsgY29tYmluZUxhdGVzdH08L2E+IHN0cmF0ZWd5LCBzdWNoIHRoYXQ6XG4gKlxuICogKiBFdmVyeSB0aW1lIGFuIGlubmVyIE9ic2VydmFibGUgZW1pdHMsIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0c1xuICogKiBXaGVuIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIGVtaXRzLCBpdCBlbWl0cyBhbGwgb2YgdGhlIGxhdGVzdCB2YWx1ZXMgYnk6XG4gKiAgICAqIElmIGEgYHByb2plY3RgIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCBpdCBpcyBjYWxsZWQgd2l0aCBlYWNoIHJlY2VudCB2YWx1ZSBmcm9tIGVhY2ggaW5uZXIgT2JzZXJ2YWJsZSBpbiB3aGF0ZXZlciBvcmRlciB0aGV5XG4gKiAgICAgIGFycml2ZWQsIGFuZCB0aGUgcmVzdWx0IG9mIHRoZSBgcHJvamVjdGAgZnVuY3Rpb24gaXMgd2hhdCBpcyBlbWl0dGVkIGJ5IHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqICAgICogSWYgdGhlcmUgaXMgbm8gYHByb2plY3RgIGZ1bmN0aW9uLCBhbiBhcnJheSBvZiBhbGwgdGhlIG1vc3QgcmVjZW50IHZhbHVlcyBpcyBlbWl0dGVkIGJ5IHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiAtLS1cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIE1hcCB0d28gY2xpY2sgZXZlbnRzIHRvIGEgZmluaXRlIGludGVydmFsIE9ic2VydmFibGUsIHRoZW4gYXBwbHkgYGNvbWJpbmVBbGxgXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBtYXAsIGNvbWJpbmVBbGwsIHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzL29ic2VydmFibGUvZnJvbUV2ZW50JztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShcbiAqICAgbWFwKGV2ID0+XG4gKiAgICAgIGludGVydmFsKE1hdGgucmFuZG9tKCkgKiAyMDAwKS5waXBlKHRha2UoMykpXG4gKiAgICksXG4gKiAgIHRha2UoMilcbiAqICk7XG4gKiBjb25zdCByZXN1bHQgPSBoaWdoZXJPcmRlci5waXBlKFxuICogICBjb21iaW5lQWxsKClcbiAqICk7XG4gKlxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKC4uLnZhbHVlczogQXJyYXk8YW55Pil9IEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIG1hcCB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGZyb20gZWFjaCBpbm5lciBPYnNlcnZhYmxlIGludG8gYSBuZXcgcmVzdWx0LlxuICogVGFrZXMgZWFjaCBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGZyb20gZWFjaCBjb2xsZWN0ZWQgaW5uZXIgT2JzZXJ2YWJsZSBhcyBhcmd1bWVudHMsIGluIG9yZGVyLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn1cbiAqIEBuYW1lIGNvbWJpbmVBbGxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVBbGw8VCwgUj4ocHJvamVjdD86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBDb21iaW5lTGF0ZXN0T3BlcmF0b3IocHJvamVjdCkpO1xufVxuIl19