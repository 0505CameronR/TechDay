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
 * import { empty } from 'rxjs';
 * import { startWith } from 'rxjs/operators';
 *
 * const result = empty().pipe(startWith(7));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * ### Map and flatten only odd numbers to the sequence 'a', 'b', 'c'
 * ```javascript
 * import { empty, interval } from 'rxjs';
 * import { mergeMap } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2VtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0M7OztHQUdHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksVUFBVSxDQUFRLFVBQVUsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNERztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsU0FBeUI7SUFDN0MsT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO0FBQ3ZELENBQUM7QUFFRCxNQUFNLFVBQVUsY0FBYyxDQUFDLFNBQXdCO0lBQ3JELE9BQU8sSUFBSSxVQUFVLENBQVEsVUFBVSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDOUYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogVGhlIHNhbWUgT2JzZXJ2YWJsZSBpbnN0YW5jZSByZXR1cm5lZCBieSBhbnkgY2FsbCB0byB7QGxpbmsgZW1wdHl9IHdpdGhvdXQgYVxuICogYHNjaGVkdWxlcmAuIEl0IGlzIHByZWZlcnJhYmxlIHRvIHVzZSB0aGlzIG92ZXIgYGVtcHR5KClgLlxuICovXG5leHBvcnQgY29uc3QgRU1QVFkgPSBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzdWJzY3JpYmVyLmNvbXBsZXRlKCkpO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgaW1tZWRpYXRlbHlcbiAqIGVtaXRzIGEgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5KdXN0IGVtaXRzICdjb21wbGV0ZScsIGFuZCBub3RoaW5nIGVsc2UuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGVtcHR5LnBuZylcbiAqXG4gKiBUaGlzIHN0YXRpYyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBvbmx5XG4gKiBlbWl0cyB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLiBJdCBjYW4gYmUgdXNlZCBmb3IgY29tcG9zaW5nIHdpdGggb3RoZXJcbiAqIE9ic2VydmFibGVzLCBzdWNoIGFzIGluIGEge0BsaW5rIG1lcmdlTWFwfS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIGNvbXBsZXRlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBlbXB0eSB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgc3RhcnRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IHJlc3VsdCA9IGVtcHR5KCkucGlwZShzdGFydFdpdGgoNykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBNYXAgYW5kIGZsYXR0ZW4gb25seSBvZGQgbnVtYmVycyB0byB0aGUgc2VxdWVuY2UgJ2EnLCAnYicsICdjJ1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZW1wdHksIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBpbnRlcnZhbCQgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIHJlc3VsdCA9IGludGVydmFsJC5waXBlKFxuICogICBtZXJnZU1hcCh4ID0+IHggJSAyID09PSAxID8gb2YoJ2EnLCAnYicsICdjJykgOiBlbXB0eSgpKSxcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyB0byB0aGUgY29uc29sZTpcbiAqIC8vIHggaXMgZXF1YWwgdG8gdGhlIGNvdW50IG9uIHRoZSBpbnRlcnZhbCBlZygwLDEsMiwzLC4uLilcbiAqIC8vIHggd2lsbCBvY2N1ciBldmVyeSAxMDAwbXNcbiAqIC8vIGlmIHggJSAyIGlzIGVxdWFsIHRvIDEgcHJpbnQgYWJjXG4gKiAvLyBpZiB4ICUgMiBpcyBub3QgZXF1YWwgdG8gMSBub3RoaW5nIHdpbGwgYmUgb3V0cHV0XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgY29tcGxldGUgbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gXCJlbXB0eVwiIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGNvbXBsZXRlXG4gKiBub3RpZmljYXRpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGVtcHR5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICogQGRlcHJlY2F0ZWQgRGVwcmVjYXRlZCBpbiBmYXZvciBvZiB1c2luZyB7QGxpbmsgaW5kZXgvRU1QVFl9IGNvbnN0YW50LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZW1wdHkoc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICByZXR1cm4gc2NoZWR1bGVyID8gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyKSA6IEVNUFRZO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZW1wdHlTY2hlZHVsZWQoc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxuZXZlcj4oc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoKCkgPT4gc3Vic2NyaWJlci5jb21wbGV0ZSgpKSk7XG59XG4iXX0=