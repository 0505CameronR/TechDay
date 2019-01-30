"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var audit_1 = require("./audit");
var timer_1 = require("../observable/timer");
/**
 * Ignores source values for `duration` milliseconds, then emits the most recent
 * value from the source Observable, then repeats this process.
 *
 * <span class="informal">When it sees a source values, it ignores that plus
 * the next ones for `duration` milliseconds, and then it emits the most recent
 * value from the source.</span>
 *
 * ![](auditTime.png)
 *
 * `auditTime` is similar to `throttleTime`, but emits the last value from the
 * silenced time window, instead of the first value. `auditTime` emits the most
 * recent value from the source Observable on the output Observable as soon as
 * its internal timer becomes disabled, and ignores source values while the
 * timer is enabled. Initially, the timer is disabled. As soon as the first
 * source value arrives, the timer is enabled. After `duration` milliseconds (or
 * the time unit determined internally by the optional `scheduler`) has passed,
 * the timer is disabled, then the most recent source value is emitted on the
 * output Observable, and this process repeats for the next source value.
 * Optionally takes a {@link SchedulerLike} for managing timers.
 *
 * ## Example
 *
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(auditTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} duration Time to wait before emitting the most recent source
 * value, measured in milliseconds or the time unit determined internally
 * by the optional `scheduler`.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the rate-limiting behavior.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method auditTime
 * @owner Observable
 */
function auditTime(duration, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return audit_1.audit(function () { return timer_1.timer(duration, scheduler); });
}
exports.auditTime = auditTime;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaXRUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0VGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUMzQyxpQ0FBZ0M7QUFDaEMsNkNBQTRDO0FBRzVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q0c7QUFDSCxTQUFnQixTQUFTLENBQUksUUFBZ0IsRUFBRSxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDN0UsT0FBTyxhQUFLLENBQUMsY0FBTSxPQUFBLGFBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLEVBQTFCLENBQTBCLENBQUMsQ0FBQztBQUNqRCxDQUFDO0FBRkQsOEJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBhdWRpdCB9IGZyb20gJy4vYXVkaXQnO1xuaW1wb3J0IHsgdGltZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3RpbWVyJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBJZ25vcmVzIHNvdXJjZSB2YWx1ZXMgZm9yIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzLCB0aGVuIGVtaXRzIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUsIHRoZW4gcmVwZWF0cyB0aGlzIHByb2Nlc3MuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldoZW4gaXQgc2VlcyBhIHNvdXJjZSB2YWx1ZXMsIGl0IGlnbm9yZXMgdGhhdCBwbHVzXG4gKiB0aGUgbmV4dCBvbmVzIGZvciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcywgYW5kIHRoZW4gaXQgZW1pdHMgdGhlIG1vc3QgcmVjZW50XG4gKiB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UuPC9zcGFuPlxuICpcbiAqICFbXShhdWRpdFRpbWUucG5nKVxuICpcbiAqIGBhdWRpdFRpbWVgIGlzIHNpbWlsYXIgdG8gYHRocm90dGxlVGltZWAsIGJ1dCBlbWl0cyB0aGUgbGFzdCB2YWx1ZSBmcm9tIHRoZVxuICogc2lsZW5jZWQgdGltZSB3aW5kb3csIGluc3RlYWQgb2YgdGhlIGZpcnN0IHZhbHVlLiBgYXVkaXRUaW1lYCBlbWl0cyB0aGUgbW9zdFxuICogcmVjZW50IHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBhcyBzb29uIGFzXG4gKiBpdHMgaW50ZXJuYWwgdGltZXIgYmVjb21lcyBkaXNhYmxlZCwgYW5kIGlnbm9yZXMgc291cmNlIHZhbHVlcyB3aGlsZSB0aGVcbiAqIHRpbWVyIGlzIGVuYWJsZWQuIEluaXRpYWxseSwgdGhlIHRpbWVyIGlzIGRpc2FibGVkLiBBcyBzb29uIGFzIHRoZSBmaXJzdFxuICogc291cmNlIHZhbHVlIGFycml2ZXMsIHRoZSB0aW1lciBpcyBlbmFibGVkLiBBZnRlciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcyAob3JcbiAqIHRoZSB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBpbnRlcm5hbGx5IGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYCkgaGFzIHBhc3NlZCxcbiAqIHRoZSB0aW1lciBpcyBkaXNhYmxlZCwgdGhlbiB0aGUgbW9zdCByZWNlbnQgc291cmNlIHZhbHVlIGlzIGVtaXR0ZWQgb24gdGhlXG4gKiBvdXRwdXQgT2JzZXJ2YWJsZSwgYW5kIHRoaXMgcHJvY2VzcyByZXBlYXRzIGZvciB0aGUgbmV4dCBzb3VyY2UgdmFsdWUuXG4gKiBPcHRpb25hbGx5IHRha2VzIGEge0BsaW5rIFNjaGVkdWxlckxpa2V9IGZvciBtYW5hZ2luZyB0aW1lcnMuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIEVtaXQgY2xpY2tzIGF0IGEgcmF0ZSBvZiBhdCBtb3N0IG9uZSBjbGljayBwZXIgc2Vjb25kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoYXVkaXRUaW1lKDEwMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdH1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlVGltZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICogQHNlZSB7QGxpbmsgc2FtcGxlVGltZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlVGltZX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gZHVyYXRpb24gVGltZSB0byB3YWl0IGJlZm9yZSBlbWl0dGluZyB0aGUgbW9zdCByZWNlbnQgc291cmNlXG4gKiB2YWx1ZSwgbWVhc3VyZWQgaW4gbWlsbGlzZWNvbmRzIG9yIHRoZSB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBpbnRlcm5hbGx5XG4gKiBieSB0aGUgb3B0aW9uYWwgYHNjaGVkdWxlcmAuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvclxuICogbWFuYWdpbmcgdGhlIHRpbWVycyB0aGF0IGhhbmRsZSB0aGUgcmF0ZS1saW1pdGluZyBiZWhhdmlvci5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBwZXJmb3JtcyByYXRlLWxpbWl0aW5nIG9mXG4gKiBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIGF1ZGl0VGltZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGF1ZGl0VGltZTxUPihkdXJhdGlvbjogbnVtYmVyLCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBhdWRpdCgoKSA9PiB0aW1lcihkdXJhdGlvbiwgc2NoZWR1bGVyKSk7XG59XG4iXX0=