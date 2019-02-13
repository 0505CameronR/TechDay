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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaXRUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYXVkaXRUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLGlDQUFnQztBQUNoQyw2Q0FBNEM7QUFHNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxRQUFnQixFQUFFLFNBQWdDO0lBQWhDLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUM3RSxPQUFPLGFBQUssQ0FBQyxjQUFNLE9BQUEsYUFBSyxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDO0FBQ2pELENBQUM7QUFGRCw4QkFFQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IGF1ZGl0IH0gZnJvbSAnLi9hdWRpdCc7XG5pbXBvcnQgeyB0aW1lciB9IGZyb20gJy4uL29ic2VydmFibGUvdGltZXInO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIElnbm9yZXMgc291cmNlIHZhbHVlcyBmb3IgYGR1cmF0aW9uYCBtaWxsaXNlY29uZHMsIHRoZW4gZW1pdHMgdGhlIG1vc3QgcmVjZW50XG4gKiB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgdGhlbiByZXBlYXRzIHRoaXMgcHJvY2Vzcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2hlbiBpdCBzZWVzIGEgc291cmNlIHZhbHVlcywgaXQgaWdub3JlcyB0aGF0IHBsdXNcbiAqIHRoZSBuZXh0IG9uZXMgZm9yIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzLCBhbmQgdGhlbiBpdCBlbWl0cyB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlIGZyb20gdGhlIHNvdXJjZS48L3NwYW4+XG4gKlxuICogIVtdKGF1ZGl0VGltZS5wbmcpXG4gKlxuICogYGF1ZGl0VGltZWAgaXMgc2ltaWxhciB0byBgdGhyb3R0bGVUaW1lYCwgYnV0IGVtaXRzIHRoZSBsYXN0IHZhbHVlIGZyb20gdGhlXG4gKiBzaWxlbmNlZCB0aW1lIHdpbmRvdywgaW5zdGVhZCBvZiB0aGUgZmlyc3QgdmFsdWUuIGBhdWRpdFRpbWVgIGVtaXRzIHRoZSBtb3N0XG4gKiByZWNlbnQgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlIGFzIHNvb24gYXNcbiAqIGl0cyBpbnRlcm5hbCB0aW1lciBiZWNvbWVzIGRpc2FibGVkLCBhbmQgaWdub3JlcyBzb3VyY2UgdmFsdWVzIHdoaWxlIHRoZVxuICogdGltZXIgaXMgZW5hYmxlZC4gSW5pdGlhbGx5LCB0aGUgdGltZXIgaXMgZGlzYWJsZWQuIEFzIHNvb24gYXMgdGhlIGZpcnN0XG4gKiBzb3VyY2UgdmFsdWUgYXJyaXZlcywgdGhlIHRpbWVyIGlzIGVuYWJsZWQuIEFmdGVyIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzIChvclxuICogdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgKSBoYXMgcGFzc2VkLFxuICogdGhlIHRpbWVyIGlzIGRpc2FibGVkLCB0aGVuIHRoZSBtb3N0IHJlY2VudCBzb3VyY2UgdmFsdWUgaXMgZW1pdHRlZCBvbiB0aGVcbiAqIG91dHB1dCBPYnNlcnZhYmxlLCBhbmQgdGhpcyBwcm9jZXNzIHJlcGVhdHMgZm9yIHRoZSBuZXh0IHNvdXJjZSB2YWx1ZS5cbiAqIE9wdGlvbmFsbHkgdGFrZXMgYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gZm9yIG1hbmFnaW5nIHRpbWVycy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogRW1pdCBjbGlja3MgYXQgYSByYXRlIG9mIGF0IG1vc3Qgb25lIGNsaWNrIHBlciBzZWNvbmRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShhdWRpdFRpbWUoMTAwMCkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGF1ZGl0fVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2VUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKiBAc2VlIHtAbGluayBzYW1wbGVUaW1lfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGVUaW1lfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaW1lIHRvIHdhaXQgYmVmb3JlIGVtaXR0aW5nIHRoZSBtb3N0IHJlY2VudCBzb3VyY2VcbiAqIHZhbHVlLCBtZWFzdXJlZCBpbiBtaWxsaXNlY29uZHMgb3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGludGVybmFsbHlcbiAqIGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yXG4gKiBtYW5hZ2luZyB0aGUgdGltZXJzIHRoYXQgaGFuZGxlIHRoZSByYXRlLWxpbWl0aW5nIGJlaGF2aW9yLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IHBlcmZvcm1zIHJhdGUtbGltaXRpbmcgb2ZcbiAqIGVtaXNzaW9ucyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgYXVkaXRUaW1lXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXVkaXRUaW1lPFQ+KGR1cmF0aW9uOiBudW1iZXIsIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGF1ZGl0KCgpID0+IHRpbWVyKGR1cmF0aW9uLCBzY2hlZHVsZXIpKTtcbn1cbiJdfQ==