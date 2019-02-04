"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var TimeoutError_1 = require("../util/TimeoutError");
var timeoutWith_1 = require("./timeoutWith");
var throwError_1 = require("../observable/throwError");
/**
 *
 * Errors if Observable does not emit a value in given time span.
 *
 * <span class="informal">Timeouts on Observable that doesn't emit values fast enough.</span>
 *
 * ![](timeout.png)
 *
 * `timeout` operator accepts as an argument either a number or a Date.
 *
 * If number was provided, it returns an Observable that behaves like a source
 * Observable, unless there is a period of time where there is no value emitted.
 * So if you provide `100` as argument and first value comes after 50ms from
 * the moment of subscription, this value will be simply re-emitted by the resulting
 * Observable. If however after that 100ms passes without a second value being emitted,
 * stream will end with an error and source Observable will be unsubscribed.
 * These checks are performed throughout whole lifecycle of Observable - from the moment
 * it was subscribed to, until it completes or errors itself. Thus every value must be
 * emitted within specified period since previous value.
 *
 * If provided argument was Date, returned Observable behaves differently. It throws
 * if Observable did not complete before provided Date. This means that periods between
 * emission of particular values do not matter in this case. If Observable did not complete
 * before provided Date, source Observable will be unsubscribed. Other than that, resulting
 * stream behaves just as source Observable.
 *
 * `timeout` accepts also a Scheduler as a second parameter. It is used to schedule moment (or moments)
 * when returned Observable will check if source stream emitted value or completed.
 *
 * ## Examples
 * Check if ticks are emitted within certain timespan
 * ```javascript
 * const seconds = interval(1000);
 *
 * seconds.pipe(timeout(1100))      // Let's use bigger timespan to be safe,
 *                                  // since `interval` might fire a bit later then scheduled.
 * .subscribe(
 *     value => console.log(value), // Will emit numbers just as regular `interval` would.
 *     err => console.log(err),     // Will never be called.
 * );
 *
 * seconds.pipe(timeout(900))
 * .subscribe(
 *     value => console.log(value), // Will never be called.
 *     err => console.log(err),     // Will emit error before even first value is emitted,
 *                                  // since it did not arrive within 900ms period.
 * );
 * ```
 *
 * Use Date to check if Observable completed
 * ```javascript
 * const seconds = interval(1000);
 *
 * seconds.pipe(
 *   timeout(new Date("December 17, 2020 03:24:00")),
 * )
 * .subscribe(
 *     value => console.log(value), // Will emit values as regular `interval` would
 *                                  // until December 17, 2020 at 03:24:00.
 *     err => console.log(err)      // On December 17, 2020 at 03:24:00 it will emit an error,
 *                                  // since Observable did not complete by then.
 * );
 * ```
 * @see {@link timeoutWith}
 *
 * @param {number|Date} due Number specifying period within which Observable must emit values
 *                          or Date specifying before when Observable should complete
 * @param {SchedulerLike} [scheduler] Scheduler controlling when timeout checks occur.
 * @return {Observable<T>} Observable that mirrors behaviour of source, unless timeout checks fail.
 * @method timeout
 * @owner Observable
 */
function timeout(due, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return timeoutWith_1.timeoutWith(due, throwError_1.throwError(new TimeoutError_1.TimeoutError()), scheduler);
}
exports.timeout = timeout;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBSzNDLHFEQUFvRDtBQUVwRCw2Q0FBNEM7QUFDNUMsdURBQXNEO0FBRXREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVFRztBQUNILFNBQWdCLE9BQU8sQ0FBSSxHQUFrQixFQUNsQixTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDekQsT0FBTyx5QkFBVyxDQUFDLEdBQUcsRUFBRSx1QkFBVSxDQUFDLElBQUksMkJBQVksRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDckUsQ0FBQztBQUhELDBCQUdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNEYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUaW1lb3V0RXJyb3IgfSBmcm9tICcuLi91dGlsL1RpbWVvdXRFcnJvcic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHRpbWVvdXRXaXRoIH0gZnJvbSAnLi90aW1lb3V0V2l0aCc7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcblxuLyoqXG4gKlxuICogRXJyb3JzIGlmIE9ic2VydmFibGUgZG9lcyBub3QgZW1pdCBhIHZhbHVlIGluIGdpdmVuIHRpbWUgc3Bhbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGltZW91dHMgb24gT2JzZXJ2YWJsZSB0aGF0IGRvZXNuJ3QgZW1pdCB2YWx1ZXMgZmFzdCBlbm91Z2guPC9zcGFuPlxuICpcbiAqICFbXSh0aW1lb3V0LnBuZylcbiAqXG4gKiBgdGltZW91dGAgb3BlcmF0b3IgYWNjZXB0cyBhcyBhbiBhcmd1bWVudCBlaXRoZXIgYSBudW1iZXIgb3IgYSBEYXRlLlxuICpcbiAqIElmIG51bWJlciB3YXMgcHJvdmlkZWQsIGl0IHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGJlaGF2ZXMgbGlrZSBhIHNvdXJjZVxuICogT2JzZXJ2YWJsZSwgdW5sZXNzIHRoZXJlIGlzIGEgcGVyaW9kIG9mIHRpbWUgd2hlcmUgdGhlcmUgaXMgbm8gdmFsdWUgZW1pdHRlZC5cbiAqIFNvIGlmIHlvdSBwcm92aWRlIGAxMDBgIGFzIGFyZ3VtZW50IGFuZCBmaXJzdCB2YWx1ZSBjb21lcyBhZnRlciA1MG1zIGZyb21cbiAqIHRoZSBtb21lbnQgb2Ygc3Vic2NyaXB0aW9uLCB0aGlzIHZhbHVlIHdpbGwgYmUgc2ltcGx5IHJlLWVtaXR0ZWQgYnkgdGhlIHJlc3VsdGluZ1xuICogT2JzZXJ2YWJsZS4gSWYgaG93ZXZlciBhZnRlciB0aGF0IDEwMG1zIHBhc3NlcyB3aXRob3V0IGEgc2Vjb25kIHZhbHVlIGJlaW5nIGVtaXR0ZWQsXG4gKiBzdHJlYW0gd2lsbCBlbmQgd2l0aCBhbiBlcnJvciBhbmQgc291cmNlIE9ic2VydmFibGUgd2lsbCBiZSB1bnN1YnNjcmliZWQuXG4gKiBUaGVzZSBjaGVja3MgYXJlIHBlcmZvcm1lZCB0aHJvdWdob3V0IHdob2xlIGxpZmVjeWNsZSBvZiBPYnNlcnZhYmxlIC0gZnJvbSB0aGUgbW9tZW50XG4gKiBpdCB3YXMgc3Vic2NyaWJlZCB0bywgdW50aWwgaXQgY29tcGxldGVzIG9yIGVycm9ycyBpdHNlbGYuIFRodXMgZXZlcnkgdmFsdWUgbXVzdCBiZVxuICogZW1pdHRlZCB3aXRoaW4gc3BlY2lmaWVkIHBlcmlvZCBzaW5jZSBwcmV2aW91cyB2YWx1ZS5cbiAqXG4gKiBJZiBwcm92aWRlZCBhcmd1bWVudCB3YXMgRGF0ZSwgcmV0dXJuZWQgT2JzZXJ2YWJsZSBiZWhhdmVzIGRpZmZlcmVudGx5LiBJdCB0aHJvd3NcbiAqIGlmIE9ic2VydmFibGUgZGlkIG5vdCBjb21wbGV0ZSBiZWZvcmUgcHJvdmlkZWQgRGF0ZS4gVGhpcyBtZWFucyB0aGF0IHBlcmlvZHMgYmV0d2VlblxuICogZW1pc3Npb24gb2YgcGFydGljdWxhciB2YWx1ZXMgZG8gbm90IG1hdHRlciBpbiB0aGlzIGNhc2UuIElmIE9ic2VydmFibGUgZGlkIG5vdCBjb21wbGV0ZVxuICogYmVmb3JlIHByb3ZpZGVkIERhdGUsIHNvdXJjZSBPYnNlcnZhYmxlIHdpbGwgYmUgdW5zdWJzY3JpYmVkLiBPdGhlciB0aGFuIHRoYXQsIHJlc3VsdGluZ1xuICogc3RyZWFtIGJlaGF2ZXMganVzdCBhcyBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiBgdGltZW91dGAgYWNjZXB0cyBhbHNvIGEgU2NoZWR1bGVyIGFzIGEgc2Vjb25kIHBhcmFtZXRlci4gSXQgaXMgdXNlZCB0byBzY2hlZHVsZSBtb21lbnQgKG9yIG1vbWVudHMpXG4gKiB3aGVuIHJldHVybmVkIE9ic2VydmFibGUgd2lsbCBjaGVjayBpZiBzb3VyY2Ugc3RyZWFtIGVtaXR0ZWQgdmFsdWUgb3IgY29tcGxldGVkLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBDaGVjayBpZiB0aWNrcyBhcmUgZW1pdHRlZCB3aXRoaW4gY2VydGFpbiB0aW1lc3BhblxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgc2Vjb25kcyA9IGludGVydmFsKDEwMDApO1xuICpcbiAqIHNlY29uZHMucGlwZSh0aW1lb3V0KDExMDApKSAgICAgIC8vIExldCdzIHVzZSBiaWdnZXIgdGltZXNwYW4gdG8gYmUgc2FmZSxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIGBpbnRlcnZhbGAgbWlnaHQgZmlyZSBhIGJpdCBsYXRlciB0aGVuIHNjaGVkdWxlZC5cbiAqIC5zdWJzY3JpYmUoXG4gKiAgICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLCAvLyBXaWxsIGVtaXQgbnVtYmVycyBqdXN0IGFzIHJlZ3VsYXIgYGludGVydmFsYCB3b3VsZC5cbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgIC8vIFdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogKTtcbiAqXG4gKiBzZWNvbmRzLnBpcGUodGltZW91dCg5MDApKVxuICogLnN1YnNjcmliZShcbiAqICAgICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksIC8vIFdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpLCAgICAgLy8gV2lsbCBlbWl0IGVycm9yIGJlZm9yZSBldmVuIGZpcnN0IHZhbHVlIGlzIGVtaXR0ZWQsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBpdCBkaWQgbm90IGFycml2ZSB3aXRoaW4gOTAwbXMgcGVyaW9kLlxuICogKTtcbiAqIGBgYFxuICpcbiAqIFVzZSBEYXRlIHRvIGNoZWNrIGlmIE9ic2VydmFibGUgY29tcGxldGVkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBzZWNvbmRzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKlxuICogc2Vjb25kcy5waXBlKFxuICogICB0aW1lb3V0KG5ldyBEYXRlKFwiRGVjZW1iZXIgMTcsIDIwMjAgMDM6MjQ6MDBcIikpLFxuICogKVxuICogLnN1YnNjcmliZShcbiAqICAgICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksIC8vIFdpbGwgZW1pdCB2YWx1ZXMgYXMgcmVndWxhciBgaW50ZXJ2YWxgIHdvdWxkXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB1bnRpbCBEZWNlbWJlciAxNywgMjAyMCBhdCAwMzoyNDowMC5cbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSAgICAgIC8vIE9uIERlY2VtYmVyIDE3LCAyMDIwIGF0IDAzOjI0OjAwIGl0IHdpbGwgZW1pdCBhbiBlcnJvcixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIE9ic2VydmFibGUgZGlkIG5vdCBjb21wbGV0ZSBieSB0aGVuLlxuICogKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgdGltZW91dFdpdGh9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gZHVlIE51bWJlciBzcGVjaWZ5aW5nIHBlcmlvZCB3aXRoaW4gd2hpY2ggT2JzZXJ2YWJsZSBtdXN0IGVtaXQgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgRGF0ZSBzcGVjaWZ5aW5nIGJlZm9yZSB3aGVuIE9ic2VydmFibGUgc2hvdWxkIGNvbXBsZXRlXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciBjb250cm9sbGluZyB3aGVuIHRpbWVvdXQgY2hlY2tzIG9jY3VyLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgYmVoYXZpb3VyIG9mIHNvdXJjZSwgdW5sZXNzIHRpbWVvdXQgY2hlY2tzIGZhaWwuXG4gKiBAbWV0aG9kIHRpbWVvdXRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0PFQ+KGR1ZTogbnVtYmVyIHwgRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIHRpbWVvdXRXaXRoKGR1ZSwgdGhyb3dFcnJvcihuZXcgVGltZW91dEVycm9yKCkpLCBzY2hlZHVsZXIpO1xufVxuIl19