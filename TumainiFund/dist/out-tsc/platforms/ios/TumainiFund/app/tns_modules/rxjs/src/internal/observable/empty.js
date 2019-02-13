import { Observable } from '../Observable';
/**
 * The same Observable instance returned by any call to {@link empty} without a
 * `scheduler`. It is preferrable to use this over `empty()`.
 */
export const EMPTY = new Observable(subscriber => subscriber.complete());
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
export function empty(scheduler) {
    return scheduler ? emptyScheduled(scheduler) : EMPTY;
}
export function emptyScheduled(scheduler) {
    return new Observable(subscriber => scheduler.schedule(() => subscriber.complete()));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2VtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsU0FBeUI7SUFDN0MsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLFNBQXdCO0lBQ3JELE9BQU8sSUFBSSxVQUFVLENBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogVGhlIHNhbWUgT2JzZXJ2YWJsZSBpbnN0YW5jZSByZXR1cm5lZCBieSBhbnkgY2FsbCB0byB7QGxpbmsgZW1wdHl9IHdpdGhvdXQgYVxuICogYHNjaGVkdWxlcmAuIEl0IGlzIHByZWZlcnJhYmxlIHRvIHVzZSB0aGlzIG92ZXIgYGVtcHR5KClgLlxuICovXG5leHBvcnQgY29uc3QgRU1QVFkgPSBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgaW1tZWRpYXRlbHlcbiAqIGVtaXRzIGEgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5KdXN0IGVtaXRzICdjb21wbGV0ZScsIGFuZCBub3RoaW5nIGVsc2UuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGVtcHR5LnBuZylcbiAqXG4gKiBUaGlzIHN0YXRpYyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBvbmx5XG4gKiBlbWl0cyB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLiBJdCBjYW4gYmUgdXNlZCBmb3IgY29tcG9zaW5nIHdpdGggb3RoZXJcbiAqIE9ic2VydmFibGVzLCBzdWNoIGFzIGluIGEge0BsaW5rIG1lcmdlTWFwfS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIGNvbXBsZXRlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCByZXN1bHQgPSBlbXB0eSgpLnBpcGUoc3RhcnRXaXRoKDcpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgTWFwIGFuZCBmbGF0dGVuIG9ubHkgb2RkIG51bWJlcnMgdG8gdGhlIHNlcXVlbmNlICdhJywgJ2InLCAnYydcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGludGVydmFsJCA9IGludGVydmFsKDEwMDApO1xuICogcmVzdWx0ID0gaW50ZXJ2YWwkLnBpcGUoXG4gKiAgIG1lcmdlTWFwKHggPT4geCAlIDIgPT09IDEgPyBvZignYScsICdiJywgJ2MnKSA6IGVtcHR5KCkpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nIHRvIHRoZSBjb25zb2xlOlxuICogLy8geCBpcyBlcXVhbCB0byB0aGUgY291bnQgb24gdGhlIGludGVydmFsIGVnKDAsMSwyLDMsLi4uKVxuICogLy8geCB3aWxsIG9jY3VyIGV2ZXJ5IDEwMDBtc1xuICogLy8gaWYgeCAlIDIgaXMgZXF1YWwgdG8gMSBwcmludCBhYmNcbiAqIC8vIGlmIHggJSAyIGlzIG5vdCBlcXVhbCB0byAxIG5vdGhpbmcgd2lsbCBiZSBvdXRwdXRcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBuZXZlcn1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICogQHNlZSB7QGxpbmsgdGhyb3dFcnJvcn1cbiAqXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHRoZSBjb21wbGV0ZSBub3RpZmljYXRpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBcImVtcHR5XCIgT2JzZXJ2YWJsZTogZW1pdHMgb25seSB0aGUgY29tcGxldGVcbiAqIG5vdGlmaWNhdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgZW1wdHlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHVzaW5nIHtAbGluayBpbmRleC9FTVBUWX0gY29uc3RhbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBlbXB0eShzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gIHJldHVybiBzY2hlZHVsZXIgPyBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXIpIDogRU1QVFk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbXB0eVNjaGVkdWxlZChzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG5ldmVyPihzdWJzY3JpYmVyID0+IHNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpKTtcbn1cbiJdfQ==