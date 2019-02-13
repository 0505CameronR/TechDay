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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tYmluZUFsbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2NvbWJpbmVBbGwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBb0U7QUFRcEU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ0c7QUFDSCxTQUFnQixVQUFVLENBQU8sT0FBc0M7SUFDckUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkscUNBQXFCLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBL0MsQ0FBK0MsQ0FBQztBQUNwRixDQUFDO0FBRkQsZ0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21iaW5lTGF0ZXN0T3BlcmF0b3IgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbWJpbmVMYXRlc3QnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUFsbDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBjb21iaW5lQWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVBbGw8VCwgUj4ocHJvamVjdDogKC4uLnZhbHVlczogVFtdKSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbWJpbmVBbGw8Uj4ocHJvamVjdDogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBSPjtcbi8qKlxuICogRmxhdHRlbnMgYW4gT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcyBieSBhcHBseWluZyB7QGxpbmsgY29tYmluZUxhdGVzdH0gd2hlbiB0aGUgT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcyBjb21wbGV0ZXMuXG4gKlxuICogIVtdKGNvbWJpbmVBbGwucG5nKVxuICpcbiAqIGBjb21iaW5lQWxsYCB0YWtlcyBhbiBPYnNlcnZhYmxlIG9mIE9ic2VydmFibGVzLCBhbmQgY29sbGVjdHMgYWxsIE9ic2VydmFibGVzIGZyb20gaXQuIE9uY2UgdGhlIG91dGVyIE9ic2VydmFibGUgY29tcGxldGVzLFxuICogaXQgc3Vic2NyaWJlcyB0byBhbGwgY29sbGVjdGVkIE9ic2VydmFibGVzIGFuZCBjb21iaW5lcyB0aGVpciB2YWx1ZXMgdXNpbmcgdGhlIHtAbGluayBjb21iaW5lTGF0ZXN0fTwvYT4gc3RyYXRlZ3ksIHN1Y2ggdGhhdDpcbiAqXG4gKiAqIEV2ZXJ5IHRpbWUgYW4gaW5uZXIgT2JzZXJ2YWJsZSBlbWl0cywgdGhlIG91dHB1dCBPYnNlcnZhYmxlIGVtaXRzXG4gKiAqIFdoZW4gdGhlIHJldHVybmVkIG9ic2VydmFibGUgZW1pdHMsIGl0IGVtaXRzIGFsbCBvZiB0aGUgbGF0ZXN0IHZhbHVlcyBieTpcbiAqICAgICogSWYgYSBgcHJvamVjdGAgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIGl0IGlzIGNhbGxlZCB3aXRoIGVhY2ggcmVjZW50IHZhbHVlIGZyb20gZWFjaCBpbm5lciBPYnNlcnZhYmxlIGluIHdoYXRldmVyIG9yZGVyIHRoZXlcbiAqICAgICAgYXJyaXZlZCwgYW5kIHRoZSByZXN1bHQgb2YgdGhlIGBwcm9qZWN0YCBmdW5jdGlvbiBpcyB3aGF0IGlzIGVtaXR0ZWQgYnkgdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICogICAgKiBJZiB0aGVyZSBpcyBubyBgcHJvamVjdGAgZnVuY3Rpb24sIGFuIGFycmF5IG9mIGFsbCB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGlzIGVtaXR0ZWQgYnkgdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIC0tLVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgTWFwIHR3byBjbGljayBldmVudHMgdG8gYSBmaW5pdGUgaW50ZXJ2YWwgT2JzZXJ2YWJsZSwgdGhlbiBhcHBseSBgY29tYmluZUFsbGBcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG1hcCwgY29tYmluZUFsbCwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqIGltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gJ3J4anMvb2JzZXJ2YWJsZS9mcm9tRXZlbnQnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBoaWdoZXJPcmRlciA9IGNsaWNrcy5waXBlKFxuICogICBtYXAoZXYgPT5cbiAqICAgICAgaW50ZXJ2YWwoTWF0aC5yYW5kb20oKSAqIDIwMDApLnBpcGUodGFrZSgzKSlcbiAqICAgKSxcbiAqICAgdGFrZSgyKVxuICogKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGhpZ2hlck9yZGVyLnBpcGUoXG4gKiAgIGNvbWJpbmVBbGwoKVxuICogKTtcbiAqXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlQWxsfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oLi4udmFsdWVzOiBBcnJheTxhbnk+KX0gQW4gb3B0aW9uYWwgZnVuY3Rpb24gdG8gbWFwIHRoZSBtb3N0IHJlY2VudCB2YWx1ZXMgZnJvbSBlYWNoIGlubmVyIE9ic2VydmFibGUgaW50byBhIG5ldyByZXN1bHQuXG4gKiBUYWtlcyBlYWNoIG9mIHRoZSBtb3N0IHJlY2VudCB2YWx1ZXMgZnJvbSBlYWNoIGNvbGxlY3RlZCBpbm5lciBPYnNlcnZhYmxlIGFzIGFyZ3VtZW50cywgaW4gb3JkZXIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fVxuICogQG5hbWUgY29tYmluZUFsbFxuICovXG5leHBvcnQgZnVuY3Rpb24gY29tYmluZUFsbDxULCBSPihwcm9qZWN0PzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IENvbWJpbmVMYXRlc3RPcGVyYXRvcihwcm9qZWN0KSk7XG59XG4iXX0=