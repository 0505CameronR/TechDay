"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isScheduler_1 = require("../util/isScheduler");
var of_1 = require("./of");
var from_1 = require("./from");
var concatAll_1 = require("../operators/concatAll");
/* tslint:enable:max-line-length */
/**
 * Creates an output Observable which sequentially emits all values from given
 * Observable and then moves on to the next.
 *
 * <span class="informal">Concatenates multiple Observables together by
 * sequentially emitting their values, one Observable after the other.</span>
 *
 * ![](concat.png)
 *
 * `concat` joins multiple Observables together, by subscribing to them one at a time and
 * merging their results into the output Observable. You can pass either an array of
 * Observables, or put them directly as arguments. Passing an empty array will result
 * in Observable that completes immediately.
 *
 * `concat` will subscribe to first input Observable and emit all its values, without
 * changing or affecting them in any way. When that Observable completes, it will
 * subscribe to then next Observable passed and, again, emit its values. This will be
 * repeated, until the operator runs out of Observables. When last input Observable completes,
 * `concat` will complete as well. At any given moment only one Observable passed to operator
 * emits values. If you would like to emit values from passed Observables concurrently, check out
 * {@link merge} instead, especially with optional `concurrent` parameter. As a matter of fact,
 * `concat` is an equivalent of `merge` operator with `concurrent` parameter set to `1`.
 *
 * Note that if some input Observable never completes, `concat` will also never complete
 * and Observables following the one that did not complete will never be subscribed. On the other
 * hand, if some Observable simply completes immediately after it is subscribed, it will be
 * invisible for `concat`, which will just move on to the next Observable.
 *
 * If any Observable in chain errors, instead of passing control to the next Observable,
 * `concat` will error immediately as well. Observables that would be subscribed after
 * the one that emitted error, never will.
 *
 * If you pass to `concat` the same Observable many times, its stream of values
 * will be "replayed" on every subscription, which means you can repeat given Observable
 * as many times as you like. If passing the same Observable to `concat` 1000 times becomes tedious,
 * you can always use {@link repeat}.
 *
 * ## Examples
 * ### Concatenate a timer counting from 0 to 3 with a synchronous sequence from 1 to 10
 * ```javascript
 * const timer = interval(1000).pipe(take(4));
 * const sequence = range(1, 10);
 * const result = concat(timer, sequence);
 * result.subscribe(x => console.log(x));
 *
 * // results in:
 * // 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3 -immediate-> 1 ... 10
 * ```
 *
 * ### Concatenate an array of 3 Observables
 * ```javascript
 * const timer1 = interval(1000).pipe(take(10));
 * const timer2 = interval(2000).pipe(take(6));
 * const timer3 = interval(500).pipe(take(10));
 * const result = concat([timer1, timer2, timer3]); // note that array is passed
 * result.subscribe(x => console.log(x));
 *
 * // results in the following:
 * // (Prints to console sequentially)
 * // -1000ms-> 0 -1000ms-> 1 -1000ms-> ... 9
 * // -2000ms-> 0 -2000ms-> 1 -2000ms-> ... 5
 * // -500ms-> 0 -500ms-> 1 -500ms-> ... 9
 * ```
 *
 * ### Concatenate the same Observable to repeat it
 * ```javascript
 * const timer = interval(1000).pipe(take(2));
 * *
 * concat(timer, timer) // concatenating the same Observable!
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('...and it is done!')
 * );
 *
 * // Logs:
 * // 0 after 1s
 * // 1 after 2s
 * // 0 after 3s
 * // 1 after 4s
 * // "...and it is done!" also after 4s
 * ```
 *
 * @see {@link concatAll}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 *
 * @param {ObservableInput} input1 An input Observable to concatenate with others.
 * @param {ObservableInput} input2 An input Observable to concatenate with others.
 * More than one input Observables may be given as argument.
 * @param {SchedulerLike} [scheduler=null] An optional {@link SchedulerLike} to schedule each
 * Observable subscription on.
 * @return {Observable} All values of each passed Observable merged into a
 * single Observable, in order, in serial fashion.
 * @static true
 * @name concat
 * @owner Observable
 */
function concat() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    if (observables.length === 1 || (observables.length === 2 && isScheduler_1.isScheduler(observables[1]))) {
        return from_1.from(observables[0]);
    }
    return concatAll_1.concatAll()(of_1.of.apply(void 0, observables));
}
exports.concat = concat;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb25jYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxtREFBa0Q7QUFDbEQsMkJBQTBCO0FBQzFCLCtCQUE4QjtBQUM5QixvREFBbUQ7QUFXbkQsbUNBQW1DO0FBQ25DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUdHO0FBQ0gsU0FBZ0IsTUFBTTtJQUFPLHFCQUEyRDtTQUEzRCxVQUEyRCxFQUEzRCxxQkFBMkQsRUFBM0QsSUFBMkQ7UUFBM0QsZ0NBQTJEOztJQUN0RixJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUkseUJBQVcsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3pGLE9BQU8sV0FBSSxDQUFNLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2xDO0lBQ0QsT0FBTyxxQkFBUyxFQUFLLENBQUMsT0FBRSxlQUFJLFdBQVcsRUFBRSxDQUFDO0FBQzVDLENBQUM7QUFMRCx3QkFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2YnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7XG5pbXBvcnQgeyBjb25jYXRBbGwgfSBmcm9tICcuLi9vcGVyYXRvcnMvY29uY2F0QWxsJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMj47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNT47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQ+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PFQ+IHwgU2NoZWR1bGVyTGlrZSlbXSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFI+KC4uLm9ic2VydmFibGVzOiAoT2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlKVtdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKipcbiAqIENyZWF0ZXMgYW4gb3V0cHV0IE9ic2VydmFibGUgd2hpY2ggc2VxdWVudGlhbGx5IGVtaXRzIGFsbCB2YWx1ZXMgZnJvbSBnaXZlblxuICogT2JzZXJ2YWJsZSBhbmQgdGhlbiBtb3ZlcyBvbiB0byB0aGUgbmV4dC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29uY2F0ZW5hdGVzIG11bHRpcGxlIE9ic2VydmFibGVzIHRvZ2V0aGVyIGJ5XG4gKiBzZXF1ZW50aWFsbHkgZW1pdHRpbmcgdGhlaXIgdmFsdWVzLCBvbmUgT2JzZXJ2YWJsZSBhZnRlciB0aGUgb3RoZXIuPC9zcGFuPlxuICpcbiAqICFbXShjb25jYXQucG5nKVxuICpcbiAqIGBjb25jYXRgIGpvaW5zIG11bHRpcGxlIE9ic2VydmFibGVzIHRvZ2V0aGVyLCBieSBzdWJzY3JpYmluZyB0byB0aGVtIG9uZSBhdCBhIHRpbWUgYW5kXG4gKiBtZXJnaW5nIHRoZWlyIHJlc3VsdHMgaW50byB0aGUgb3V0cHV0IE9ic2VydmFibGUuIFlvdSBjYW4gcGFzcyBlaXRoZXIgYW4gYXJyYXkgb2ZcbiAqIE9ic2VydmFibGVzLCBvciBwdXQgdGhlbSBkaXJlY3RseSBhcyBhcmd1bWVudHMuIFBhc3NpbmcgYW4gZW1wdHkgYXJyYXkgd2lsbCByZXN1bHRcbiAqIGluIE9ic2VydmFibGUgdGhhdCBjb21wbGV0ZXMgaW1tZWRpYXRlbHkuXG4gKlxuICogYGNvbmNhdGAgd2lsbCBzdWJzY3JpYmUgdG8gZmlyc3QgaW5wdXQgT2JzZXJ2YWJsZSBhbmQgZW1pdCBhbGwgaXRzIHZhbHVlcywgd2l0aG91dFxuICogY2hhbmdpbmcgb3IgYWZmZWN0aW5nIHRoZW0gaW4gYW55IHdheS4gV2hlbiB0aGF0IE9ic2VydmFibGUgY29tcGxldGVzLCBpdCB3aWxsXG4gKiBzdWJzY3JpYmUgdG8gdGhlbiBuZXh0IE9ic2VydmFibGUgcGFzc2VkIGFuZCwgYWdhaW4sIGVtaXQgaXRzIHZhbHVlcy4gVGhpcyB3aWxsIGJlXG4gKiByZXBlYXRlZCwgdW50aWwgdGhlIG9wZXJhdG9yIHJ1bnMgb3V0IG9mIE9ic2VydmFibGVzLiBXaGVuIGxhc3QgaW5wdXQgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsXG4gKiBgY29uY2F0YCB3aWxsIGNvbXBsZXRlIGFzIHdlbGwuIEF0IGFueSBnaXZlbiBtb21lbnQgb25seSBvbmUgT2JzZXJ2YWJsZSBwYXNzZWQgdG8gb3BlcmF0b3JcbiAqIGVtaXRzIHZhbHVlcy4gSWYgeW91IHdvdWxkIGxpa2UgdG8gZW1pdCB2YWx1ZXMgZnJvbSBwYXNzZWQgT2JzZXJ2YWJsZXMgY29uY3VycmVudGx5LCBjaGVjayBvdXRcbiAqIHtAbGluayBtZXJnZX0gaW5zdGVhZCwgZXNwZWNpYWxseSB3aXRoIG9wdGlvbmFsIGBjb25jdXJyZW50YCBwYXJhbWV0ZXIuIEFzIGEgbWF0dGVyIG9mIGZhY3QsXG4gKiBgY29uY2F0YCBpcyBhbiBlcXVpdmFsZW50IG9mIGBtZXJnZWAgb3BlcmF0b3Igd2l0aCBgY29uY3VycmVudGAgcGFyYW1ldGVyIHNldCB0byBgMWAuXG4gKlxuICogTm90ZSB0aGF0IGlmIHNvbWUgaW5wdXQgT2JzZXJ2YWJsZSBuZXZlciBjb21wbGV0ZXMsIGBjb25jYXRgIHdpbGwgYWxzbyBuZXZlciBjb21wbGV0ZVxuICogYW5kIE9ic2VydmFibGVzIGZvbGxvd2luZyB0aGUgb25lIHRoYXQgZGlkIG5vdCBjb21wbGV0ZSB3aWxsIG5ldmVyIGJlIHN1YnNjcmliZWQuIE9uIHRoZSBvdGhlclxuICogaGFuZCwgaWYgc29tZSBPYnNlcnZhYmxlIHNpbXBseSBjb21wbGV0ZXMgaW1tZWRpYXRlbHkgYWZ0ZXIgaXQgaXMgc3Vic2NyaWJlZCwgaXQgd2lsbCBiZVxuICogaW52aXNpYmxlIGZvciBgY29uY2F0YCwgd2hpY2ggd2lsbCBqdXN0IG1vdmUgb24gdG8gdGhlIG5leHQgT2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiBhbnkgT2JzZXJ2YWJsZSBpbiBjaGFpbiBlcnJvcnMsIGluc3RlYWQgb2YgcGFzc2luZyBjb250cm9sIHRvIHRoZSBuZXh0IE9ic2VydmFibGUsXG4gKiBgY29uY2F0YCB3aWxsIGVycm9yIGltbWVkaWF0ZWx5IGFzIHdlbGwuIE9ic2VydmFibGVzIHRoYXQgd291bGQgYmUgc3Vic2NyaWJlZCBhZnRlclxuICogdGhlIG9uZSB0aGF0IGVtaXR0ZWQgZXJyb3IsIG5ldmVyIHdpbGwuXG4gKlxuICogSWYgeW91IHBhc3MgdG8gYGNvbmNhdGAgdGhlIHNhbWUgT2JzZXJ2YWJsZSBtYW55IHRpbWVzLCBpdHMgc3RyZWFtIG9mIHZhbHVlc1xuICogd2lsbCBiZSBcInJlcGxheWVkXCIgb24gZXZlcnkgc3Vic2NyaXB0aW9uLCB3aGljaCBtZWFucyB5b3UgY2FuIHJlcGVhdCBnaXZlbiBPYnNlcnZhYmxlXG4gKiBhcyBtYW55IHRpbWVzIGFzIHlvdSBsaWtlLiBJZiBwYXNzaW5nIHRoZSBzYW1lIE9ic2VydmFibGUgdG8gYGNvbmNhdGAgMTAwMCB0aW1lcyBiZWNvbWVzIHRlZGlvdXMsXG4gKiB5b3UgY2FuIGFsd2F5cyB1c2Uge0BsaW5rIHJlcGVhdH0uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDb25jYXRlbmF0ZSBhIHRpbWVyIGNvdW50aW5nIGZyb20gMCB0byAzIHdpdGggYSBzeW5jaHJvbm91cyBzZXF1ZW5jZSBmcm9tIDEgdG8gMTBcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDQpKTtcbiAqIGNvbnN0IHNlcXVlbmNlID0gcmFuZ2UoMSwgMTApO1xuICogY29uc3QgcmVzdWx0ID0gY29uY2F0KHRpbWVyLCBzZXF1ZW5jZSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHMgaW46XG4gKiAvLyAwIC0xMDAwbXMtPiAxIC0xMDAwbXMtPiAyIC0xMDAwbXMtPiAzIC1pbW1lZGlhdGUtPiAxIC4uLiAxMFxuICogYGBgXG4gKlxuICogIyMjIENvbmNhdGVuYXRlIGFuIGFycmF5IG9mIDMgT2JzZXJ2YWJsZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyMSA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgxMCkpO1xuICogY29uc3QgdGltZXIyID0gaW50ZXJ2YWwoMjAwMCkucGlwZSh0YWtlKDYpKTtcbiAqIGNvbnN0IHRpbWVyMyA9IGludGVydmFsKDUwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQoW3RpbWVyMSwgdGltZXIyLCB0aW1lcjNdKTsgLy8gbm90ZSB0aGF0IGFycmF5IGlzIHBhc3NlZFxuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyByZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyAoUHJpbnRzIHRvIGNvbnNvbGUgc2VxdWVudGlhbGx5KVxuICogLy8gLTEwMDBtcy0+IDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IC4uLiA5XG4gKiAvLyAtMjAwMG1zLT4gMCAtMjAwMG1zLT4gMSAtMjAwMG1zLT4gLi4uIDVcbiAqIC8vIC01MDBtcy0+IDAgLTUwMG1zLT4gMSAtNTAwbXMtPiAuLi4gOVxuICogYGBgXG4gKlxuICogIyMjIENvbmNhdGVuYXRlIHRoZSBzYW1lIE9ic2VydmFibGUgdG8gcmVwZWF0IGl0XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0aW1lciA9IGludGVydmFsKDEwMDApLnBpcGUodGFrZSgyKSk7XG4gKiAqXG4gKiBjb25jYXQodGltZXIsIHRpbWVyKSAvLyBjb25jYXRlbmF0aW5nIHRoZSBzYW1lIE9ic2VydmFibGUhXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJy4uLmFuZCBpdCBpcyBkb25lIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwIGFmdGVyIDFzXG4gKiAvLyAxIGFmdGVyIDJzXG4gKiAvLyAwIGFmdGVyIDNzXG4gKiAvLyAxIGFmdGVyIDRzXG4gKiAvLyBcIi4uLmFuZCBpdCBpcyBkb25lIVwiIGFsc28gYWZ0ZXIgNHNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbmNhdEFsbH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcH1cbiAqIEBzZWUge0BsaW5rIGNvbmNhdE1hcFRvfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBpbnB1dDEgQW4gaW5wdXQgT2JzZXJ2YWJsZSB0byBjb25jYXRlbmF0ZSB3aXRoIG90aGVycy5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZUlucHV0fSBpbnB1dDIgQW4gaW5wdXQgT2JzZXJ2YWJsZSB0byBjb25jYXRlbmF0ZSB3aXRoIG90aGVycy5cbiAqIE1vcmUgdGhhbiBvbmUgaW5wdXQgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIGFyZ3VtZW50LlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPW51bGxdIEFuIG9wdGlvbmFsIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBzY2hlZHVsZSBlYWNoXG4gKiBPYnNlcnZhYmxlIHN1YnNjcmlwdGlvbiBvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFsbCB2YWx1ZXMgb2YgZWFjaCBwYXNzZWQgT2JzZXJ2YWJsZSBtZXJnZWQgaW50byBhXG4gKiBzaW5nbGUgT2JzZXJ2YWJsZSwgaW4gb3JkZXIsIGluIHNlcmlhbCBmYXNoaW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBjb25jYXRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgaWYgKG9ic2VydmFibGVzLmxlbmd0aCA9PT0gMSB8fCAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAyICYmIGlzU2NoZWR1bGVyKG9ic2VydmFibGVzWzFdKSkpIHtcbiAgICByZXR1cm4gZnJvbSg8YW55Pm9ic2VydmFibGVzWzBdKTtcbiAgfVxuICByZXR1cm4gY29uY2F0QWxsPFI+KCkob2YoLi4ub2JzZXJ2YWJsZXMpKTtcbn1cbiJdfQ==