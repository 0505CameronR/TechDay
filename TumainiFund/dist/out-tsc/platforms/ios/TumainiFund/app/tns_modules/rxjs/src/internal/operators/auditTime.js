import { async } from '../scheduler/async';
import { audit } from './audit';
import { timer } from '../observable/timer';
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
 * import { fromEvent } from 'rxjs';
 * import { auditTime } from 'rxjs/operators';
 *
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
export function auditTime(duration, scheduler = async) {
    return audit(() => timer(duration, scheduler));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaXRUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2F1ZGl0VGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUksUUFBZ0IsRUFBRSxZQUEyQixLQUFLO0lBQzdFLE9BQU8sS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUNqRCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgYXVkaXQgfSBmcm9tICcuL2F1ZGl0JztcbmltcG9ydCB7IHRpbWVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS90aW1lcic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogSWdub3JlcyBzb3VyY2UgdmFsdWVzIGZvciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcywgdGhlbiBlbWl0cyB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0aGVuIHJlcGVhdHMgdGhpcyBwcm9jZXNzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XaGVuIGl0IHNlZXMgYSBzb3VyY2UgdmFsdWVzLCBpdCBpZ25vcmVzIHRoYXQgcGx1c1xuICogdGhlIG5leHQgb25lcyBmb3IgYGR1cmF0aW9uYCBtaWxsaXNlY29uZHMsIGFuZCB0aGVuIGl0IGVtaXRzIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWUgZnJvbSB0aGUgc291cmNlLjwvc3Bhbj5cbiAqXG4gKiAhW10oYXVkaXRUaW1lLnBuZylcbiAqXG4gKiBgYXVkaXRUaW1lYCBpcyBzaW1pbGFyIHRvIGB0aHJvdHRsZVRpbWVgLCBidXQgZW1pdHMgdGhlIGxhc3QgdmFsdWUgZnJvbSB0aGVcbiAqIHNpbGVuY2VkIHRpbWUgd2luZG93LCBpbnN0ZWFkIG9mIHRoZSBmaXJzdCB2YWx1ZS4gYGF1ZGl0VGltZWAgZW1pdHMgdGhlIG1vc3RcbiAqIHJlY2VudCB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUgYXMgc29vbiBhc1xuICogaXRzIGludGVybmFsIHRpbWVyIGJlY29tZXMgZGlzYWJsZWQsIGFuZCBpZ25vcmVzIHNvdXJjZSB2YWx1ZXMgd2hpbGUgdGhlXG4gKiB0aW1lciBpcyBlbmFibGVkLiBJbml0aWFsbHksIHRoZSB0aW1lciBpcyBkaXNhYmxlZC4gQXMgc29vbiBhcyB0aGUgZmlyc3RcbiAqIHNvdXJjZSB2YWx1ZSBhcnJpdmVzLCB0aGUgdGltZXIgaXMgZW5hYmxlZC4gQWZ0ZXIgYGR1cmF0aW9uYCBtaWxsaXNlY29uZHMgKG9yXG4gKiB0aGUgdGltZSB1bml0IGRldGVybWluZWQgaW50ZXJuYWxseSBieSB0aGUgb3B0aW9uYWwgYHNjaGVkdWxlcmApIGhhcyBwYXNzZWQsXG4gKiB0aGUgdGltZXIgaXMgZGlzYWJsZWQsIHRoZW4gdGhlIG1vc3QgcmVjZW50IHNvdXJjZSB2YWx1ZSBpcyBlbWl0dGVkIG9uIHRoZVxuICogb3V0cHV0IE9ic2VydmFibGUsIGFuZCB0aGlzIHByb2Nlc3MgcmVwZWF0cyBmb3IgdGhlIG5leHQgc291cmNlIHZhbHVlLlxuICogT3B0aW9uYWxseSB0YWtlcyBhIHtAbGluayBTY2hlZHVsZXJMaWtlfSBmb3IgbWFuYWdpbmcgdGltZXJzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBFbWl0IGNsaWNrcyBhdCBhIHJhdGUgb2YgYXQgbW9zdCBvbmUgY2xpY2sgcGVyIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBhdWRpdFRpbWUgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKGF1ZGl0VGltZSgxMDAwKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXR9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZVRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZVRpbWV9XG4gKiBAc2VlIHtAbGluayB0aHJvdHRsZVRpbWV9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRpbWUgdG8gd2FpdCBiZWZvcmUgZW1pdHRpbmcgdGhlIG1vc3QgcmVjZW50IHNvdXJjZVxuICogdmFsdWUsIG1lYXN1cmVkIGluIG1pbGxpc2Vjb25kcyBvciB0aGUgdGltZSB1bml0IGRldGVybWluZWQgaW50ZXJuYWxseVxuICogYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHJhdGUtbGltaXRpbmcgYmVoYXZpb3IuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgcGVyZm9ybXMgcmF0ZS1saW1pdGluZyBvZlxuICogZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBhdWRpdFRpbWVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdWRpdFRpbWU8VD4oZHVyYXRpb246IG51bWJlciwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gYXVkaXQoKCkgPT4gdGltZXIoZHVyYXRpb24sIHNjaGVkdWxlcikpO1xufVxuIl19