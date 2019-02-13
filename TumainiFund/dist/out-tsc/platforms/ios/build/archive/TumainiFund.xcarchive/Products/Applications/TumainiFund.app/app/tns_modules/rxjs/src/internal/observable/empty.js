"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
/**
 * The same Observable instance returned by any call to {@link empty} without a
 * `scheduler`. It is preferrable to use this over `empty()`.
 */
exports.EMPTY = new Observable_1.Observable(function (subscriber) { return subscriber.complete(); });
/**
 * Creates an Observable that emits no items to the Observer and immediately
 * emits a complete notification.
 *
 * <span class="informal">Just emits 'complete', and nothing else.
 * </span>
 *
 * ![](empty.png)
 *
 * This static operator is useful for creating a simple Observable that only
 * emits the complete notification. It can be used for composing with other
 * Observables, such as in a {@link mergeMap}.
 *
 * ## Examples
 * ### Emit the number 7, then complete
 * ```javascript
 * const result = empty().pipe(startWith(7));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * ### Map and flatten only odd numbers to the sequence 'a', 'b', 'c'
 * ```javascript
 * const interval$ = interval(1000);
 * result = interval$.pipe(
 *   mergeMap(x => x % 2 === 1 ? of('a', 'b', 'c') : empty()),
 * );
 * result.subscribe(x => console.log(x));
 *
 * // Results in the following to the console:
 * // x is equal to the count on the interval eg(0,1,2,3,...)
 * // x will occur every 1000ms
 * // if x % 2 is equal to 1 print abc
 * // if x % 2 is not equal to 1 nothing will be output
 * ```
 *
 * @see {@link Observable}
 * @see {@link never}
 * @see {@link of}
 * @see {@link throwError}
 *
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emission of the complete notification.
 * @return {Observable} An "empty" Observable: emits only the complete
 * notification.
 * @static true
 * @name empty
 * @owner Observable
 * @deprecated Deprecated in favor of using {@link index/EMPTY} constant.
 */
function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : exports.EMPTY;
}
exports.empty = empty;
function emptyScheduled(scheduler) {
    return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(function () { return subscriber.complete(); }); });
}
exports.emptyScheduled = emptyScheduled;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZW1wdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFHM0M7OztHQUdHO0FBQ1UsUUFBQSxLQUFLLEdBQUcsSUFBSSx1QkFBVSxDQUFRLFVBQUEsVUFBVSxJQUFJLE9BQUEsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNILFNBQWdCLEtBQUssQ0FBQyxTQUF5QjtJQUM3QyxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFLLENBQUM7QUFDdkQsQ0FBQztBQUZELHNCQUVDO0FBRUQsU0FBZ0IsY0FBYyxDQUFDLFNBQXdCO0lBQ3JELE9BQU8sSUFBSSx1QkFBVSxDQUFRLFVBQUEsVUFBVSxJQUFJLE9BQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxjQUFNLE9BQUEsVUFBVSxDQUFDLFFBQVEsRUFBRSxFQUFyQixDQUFxQixDQUFDLEVBQS9DLENBQStDLENBQUMsQ0FBQztBQUM5RixDQUFDO0FBRkQsd0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBzYW1lIE9ic2VydmFibGUgaW5zdGFuY2UgcmV0dXJuZWQgYnkgYW55IGNhbGwgdG8ge0BsaW5rIGVtcHR5fSB3aXRob3V0IGFcbiAqIGBzY2hlZHVsZXJgLiBJdCBpcyBwcmVmZXJyYWJsZSB0byB1c2UgdGhpcyBvdmVyIGBlbXB0eSgpYC5cbiAqL1xuZXhwb3J0IGNvbnN0IEVNUFRZID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKTtcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBubyBpdGVtcyB0byB0aGUgT2JzZXJ2ZXIgYW5kIGltbWVkaWF0ZWx5XG4gKiBlbWl0cyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SnVzdCBlbWl0cyAnY29tcGxldGUnLCBhbmQgbm90aGluZyBlbHNlLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShlbXB0eS5wbmcpXG4gKlxuICogVGhpcyBzdGF0aWMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBjcmVhdGluZyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgb25seVxuICogZW1pdHMgdGhlIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcywgc3VjaCBhcyBpbiBhIHtAbGluayBtZXJnZU1hcH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBjb21wbGV0ZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgcmVzdWx0ID0gZW1wdHkoKS5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogIyMjIE1hcCBhbmQgZmxhdHRlbiBvbmx5IG9kZCBudW1iZXJzIHRvIHRoZSBzZXF1ZW5jZSAnYScsICdiJywgJ2MnXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBpbnRlcnZhbCQgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIHJlc3VsdCA9IGludGVydmFsJC5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggJSAyID09PSAxID8gb2YoJ2EnLCAnYicsICdjJykgOiBlbXB0eSgpKSxcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyB0byB0aGUgY29uc29sZTpcbiAqIC8vIHggaXMgZXF1YWwgdG8gdGhlIGNvdW50IG9uIHRoZSBpbnRlcnZhbCBlZygwLDEsMiwzLC4uLilcbiAqIC8vIHggd2lsbCBvY2N1ciBldmVyeSAxMDAwbXNcbiAqIC8vIGlmIHggJSAyIGlzIGVxdWFsIHRvIDEgcHJpbnQgYWJjXG4gKiAvLyBpZiB4ICUgMiBpcyBub3QgZXF1YWwgdG8gMSBub3RoaW5nIHdpbGwgYmUgb3V0cHV0XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gXCJlbXB0eVwiIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGNvbXBsZXRlXG4gKiBub3RpZmljYXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGVtcHR5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiB1c2luZyB7QGxpbmsgaW5kZXgvRU1QVFl9IGNvbnN0YW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gc2NoZWR1bGVyID8gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSA6IEVNUFRZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7XG59XG4iXX0=