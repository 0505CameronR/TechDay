import { async } from '../scheduler/async';
import { scan } from './scan';
import { defer } from '../observable/defer';
import { map } from './map';
/**
 *
 * Emits an object containing the current value, and the time that has
 * passed between emitting the current value and the previous value, which is
 * calculated by using the provided `scheduler`'s `now()` method to retrieve
 * the current time at each emission, then calculating the difference. The `scheduler`
 * defaults to {@link asyncScheduler}, so by default, the `interval` will be in
 * milliseconds.
 *
 *
 * ![](timeinterval.png)
 *
 * ## Examples
 * Emit inteval between current value with the last value
 *
 * ```javascript
 * const seconds = interval(1000);
 *
 * seconds.pipe(timeinterval())
 * .subscribe(
 *     value => console.log(value),
 *     err => console.log(err),
 * );
 *
 * seconds.pipe(timeout(900))
 * .subscribe(
 *     value => console.log(value),
 *     err => console.log(err),
 * );
 *
 * // NOTE: The values will never be this precise,
 * // intervals created with `interval` or `setInterval`
 * // are non-deterministic.
 *
 * // {value: 0, interval: 1000}
 * // {value: 1, interval: 1000}
 * // {value: 2, interval: 1000}
 * ```
 *
 * @param {SchedulerLike} [scheduler] Scheduler used to get the current time.
 * @return {Observable<{ interval: number, value: T }>} Observable that emit infomation about value and interval
 * @method timeInterval
 */
export function timeInterval(scheduler = async) {
    return (source) => defer(() => {
        return source.pipe(
        // TODO(benlesh): correct these typings.
        scan(({ current }, value) => ({ value, current: scheduler.now(), last: current }), { current: scheduler.now(), value: undefined, last: undefined }), map(({ current, last, value }) => new TimeInterval(value, current - last)));
    });
}
// TODO(benlesh): make this an interface, export the interface, but not the implemented class,
// there's no reason users should be manually creating this type.
/**
 * @deprecated exposed API, use as interface only.
 */
export class TimeInterval {
    constructor(value, interval) {
        this.value = value;
        this.interval = interval;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZUludGVydmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3RpbWVJbnRlcnZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFM0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDNUMsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLE9BQU8sQ0FBQztBQUU1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMENHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBSSxZQUEyQixLQUFLO0lBQzlELE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFO1FBQzNDLE9BQU8sTUFBTSxDQUFDLElBQUk7UUFDaEIsd0NBQXdDO1FBQ3hDLElBQUksQ0FDRixDQUFDLEVBQUUsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQzVFLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFHLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FDMUQsRUFDUixHQUFHLENBQXVCLENBQUMsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsQ0FBQyxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQ2pHLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCw4RkFBOEY7QUFDOUYsaUVBQWlFO0FBRWpFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLFlBQVk7SUFDdkIsWUFBbUIsS0FBUSxFQUFTLFFBQWdCO1FBQWpDLFVBQUssR0FBTCxLQUFLLENBQUc7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztDQUN6RCIsInNvdXJjZXNDb250ZW50IjpbIlxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHNjYW4gfSBmcm9tICcuL3NjYW4nO1xuaW1wb3J0IHsgZGVmZXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2RlZmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4vbWFwJztcblxuLyoqXG4gKlxuICogRW1pdHMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGN1cnJlbnQgdmFsdWUsIGFuZCB0aGUgdGltZSB0aGF0IGhhc1xuICogcGFzc2VkIGJldHdlZW4gZW1pdHRpbmcgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHRoZSBwcmV2aW91cyB2YWx1ZSwgd2hpY2ggaXNcbiAqIGNhbGN1bGF0ZWQgYnkgdXNpbmcgdGhlIHByb3ZpZGVkIGBzY2hlZHVsZXJgJ3MgYG5vdygpYCBtZXRob2QgdG8gcmV0cmlldmVcbiAqIHRoZSBjdXJyZW50IHRpbWUgYXQgZWFjaCBlbWlzc2lvbiwgdGhlbiBjYWxjdWxhdGluZyB0aGUgZGlmZmVyZW5jZS4gVGhlIGBzY2hlZHVsZXJgXG4gKiBkZWZhdWx0cyB0byB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9LCBzbyBieSBkZWZhdWx0LCB0aGUgYGludGVydmFsYCB3aWxsIGJlIGluXG4gKiBtaWxsaXNlY29uZHMuXG4gKlxuICpcbiAqICFbXSh0aW1laW50ZXJ2YWwucG5nKVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBFbWl0IGludGV2YWwgYmV0d2VlbiBjdXJyZW50IHZhbHVlIHdpdGggdGhlIGxhc3QgdmFsdWVcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBzZWNvbmRzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKlxuICogc2Vjb25kcy5waXBlKHRpbWVpbnRlcnZhbCgpKVxuICogLnN1YnNjcmliZShcbiAqICAgICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksXG4gKiApO1xuICpcbiAqIHNlY29uZHMucGlwZSh0aW1lb3V0KDkwMCkpXG4gKiAuc3Vic2NyaWJlKFxuICogICAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSxcbiAqICk7XG4gKlxuICogLy8gTk9URTogVGhlIHZhbHVlcyB3aWxsIG5ldmVyIGJlIHRoaXMgcHJlY2lzZSxcbiAqIC8vIGludGVydmFscyBjcmVhdGVkIHdpdGggYGludGVydmFsYCBvciBgc2V0SW50ZXJ2YWxgXG4gKiAvLyBhcmUgbm9uLWRldGVybWluaXN0aWMuXG4gKlxuICogLy8ge3ZhbHVlOiAwLCBpbnRlcnZhbDogMTAwMH1cbiAqIC8vIHt2YWx1ZTogMSwgaW50ZXJ2YWw6IDEwMDB9XG4gKiAvLyB7dmFsdWU6IDIsIGludGVydmFsOiAxMDAwfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgdXNlZCB0byBnZXQgdGhlIGN1cnJlbnQgdGltZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8eyBpbnRlcnZhbDogbnVtYmVyLCB2YWx1ZTogVCB9Pn0gT2JzZXJ2YWJsZSB0aGF0IGVtaXQgaW5mb21hdGlvbiBhYm91dCB2YWx1ZSBhbmQgaW50ZXJ2YWxcbiAqIEBtZXRob2QgdGltZUludGVydmFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lSW50ZXJ2YWw8VD4oc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRpbWVJbnRlcnZhbDxUPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gZGVmZXIoKCkgPT4ge1xuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIC8vIFRPRE8oYmVubGVzaCk6IGNvcnJlY3QgdGhlc2UgdHlwaW5ncy5cbiAgICAgIHNjYW4oXG4gICAgICAgICh7IGN1cnJlbnQgfSwgdmFsdWUpID0+ICh7IHZhbHVlLCBjdXJyZW50OiBzY2hlZHVsZXIubm93KCksIGxhc3Q6IGN1cnJlbnQgfSksXG4gICAgICAgIHsgY3VycmVudDogc2NoZWR1bGVyLm5vdygpLCB2YWx1ZTogdW5kZWZpbmVkLCAgbGFzdDogdW5kZWZpbmVkIH1cbiAgICAgICkgYXMgYW55LFxuICAgICAgbWFwPGFueSwgVGltZUludGVydmFsPFQ+PigoeyBjdXJyZW50LCBsYXN0LCB2YWx1ZSB9KSA9PiBuZXcgVGltZUludGVydmFsKHZhbHVlLCBjdXJyZW50IC0gbGFzdCkpLFxuICAgICk7XG4gIH0pO1xufVxuXG4vLyBUT0RPKGJlbmxlc2gpOiBtYWtlIHRoaXMgYW4gaW50ZXJmYWNlLCBleHBvcnQgdGhlIGludGVyZmFjZSwgYnV0IG5vdCB0aGUgaW1wbGVtZW50ZWQgY2xhc3MsXG4vLyB0aGVyZSdzIG5vIHJlYXNvbiB1c2VycyBzaG91bGQgYmUgbWFudWFsbHkgY3JlYXRpbmcgdGhpcyB0eXBlLlxuXG4vKipcbiAqIEBkZXByZWNhdGVkIGV4cG9zZWQgQVBJLCB1c2UgYXMgaW50ZXJmYWNlIG9ubHkuXG4gKi9cbmV4cG9ydCBjbGFzcyBUaW1lSW50ZXJ2YWw8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IFQsIHB1YmxpYyBpbnRlcnZhbDogbnVtYmVyKSB7fVxufVxuIl19