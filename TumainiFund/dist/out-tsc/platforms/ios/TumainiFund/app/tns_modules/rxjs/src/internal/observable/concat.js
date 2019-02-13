import { isScheduler } from '../util/isScheduler';
import { of } from './of';
import { from } from './from';
import { concatAll } from '../operators/concatAll';
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
export function concat(...observables) {
    if (observables.length === 1 || (observables.length === 2 && isScheduler(observables[1]))) {
        return from(observables[0]);
    }
    return concatAll()(of(...observables));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9jb25jYXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxFQUFFLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDMUIsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFXbkQsbUNBQW1DO0FBQ25DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUdHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBTyxHQUFHLFdBQXdEO0lBQ3RGLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUN6RixPQUFPLElBQUksQ0FBTSxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNsQztJQUNELE9BQU8sU0FBUyxFQUFLLENBQUMsRUFBRSxDQUFDLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztBQUM1QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vZic7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGNvbmNhdEFsbCB9IGZyb20gJy4uL29wZXJhdG9ycy9jb25jYXRBbGwnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0PFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Piwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2PjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VD4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8VD4gfCBTY2hlZHVsZXJMaWtlKVtdKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiBjb25jYXQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IChPYnNlcnZhYmxlSW5wdXQ8YW55PiB8IFNjaGVkdWxlckxpa2UpW10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKlxuICogQ3JlYXRlcyBhbiBvdXRwdXQgT2JzZXJ2YWJsZSB3aGljaCBzZXF1ZW50aWFsbHkgZW1pdHMgYWxsIHZhbHVlcyBmcm9tIGdpdmVuXG4gKiBPYnNlcnZhYmxlIGFuZCB0aGVuIG1vdmVzIG9uIHRvIHRoZSBuZXh0LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db25jYXRlbmF0ZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIgYnlcbiAqIHNlcXVlbnRpYWxseSBlbWl0dGluZyB0aGVpciB2YWx1ZXMsIG9uZSBPYnNlcnZhYmxlIGFmdGVyIHRoZSBvdGhlci48L3NwYW4+XG4gKlxuICogIVtdKGNvbmNhdC5wbmcpXG4gKlxuICogYGNvbmNhdGAgam9pbnMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG9nZXRoZXIsIGJ5IHN1YnNjcmliaW5nIHRvIHRoZW0gb25lIGF0IGEgdGltZSBhbmRcbiAqIG1lcmdpbmcgdGhlaXIgcmVzdWx0cyBpbnRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gWW91IGNhbiBwYXNzIGVpdGhlciBhbiBhcnJheSBvZlxuICogT2JzZXJ2YWJsZXMsIG9yIHB1dCB0aGVtIGRpcmVjdGx5IGFzIGFyZ3VtZW50cy4gUGFzc2luZyBhbiBlbXB0eSBhcnJheSB3aWxsIHJlc3VsdFxuICogaW4gT2JzZXJ2YWJsZSB0aGF0IGNvbXBsZXRlcyBpbW1lZGlhdGVseS5cbiAqXG4gKiBgY29uY2F0YCB3aWxsIHN1YnNjcmliZSB0byBmaXJzdCBpbnB1dCBPYnNlcnZhYmxlIGFuZCBlbWl0IGFsbCBpdHMgdmFsdWVzLCB3aXRob3V0XG4gKiBjaGFuZ2luZyBvciBhZmZlY3RpbmcgdGhlbSBpbiBhbnkgd2F5LiBXaGVuIHRoYXQgT2JzZXJ2YWJsZSBjb21wbGV0ZXMsIGl0IHdpbGxcbiAqIHN1YnNjcmliZSB0byB0aGVuIG5leHQgT2JzZXJ2YWJsZSBwYXNzZWQgYW5kLCBhZ2FpbiwgZW1pdCBpdHMgdmFsdWVzLiBUaGlzIHdpbGwgYmVcbiAqIHJlcGVhdGVkLCB1bnRpbCB0aGUgb3BlcmF0b3IgcnVucyBvdXQgb2YgT2JzZXJ2YWJsZXMuIFdoZW4gbGFzdCBpbnB1dCBPYnNlcnZhYmxlIGNvbXBsZXRlcyxcbiAqIGBjb25jYXRgIHdpbGwgY29tcGxldGUgYXMgd2VsbC4gQXQgYW55IGdpdmVuIG1vbWVudCBvbmx5IG9uZSBPYnNlcnZhYmxlIHBhc3NlZCB0byBvcGVyYXRvclxuICogZW1pdHMgdmFsdWVzLiBJZiB5b3Ugd291bGQgbGlrZSB0byBlbWl0IHZhbHVlcyBmcm9tIHBhc3NlZCBPYnNlcnZhYmxlcyBjb25jdXJyZW50bHksIGNoZWNrIG91dFxuICoge0BsaW5rIG1lcmdlfSBpbnN0ZWFkLCBlc3BlY2lhbGx5IHdpdGggb3B0aW9uYWwgYGNvbmN1cnJlbnRgIHBhcmFtZXRlci4gQXMgYSBtYXR0ZXIgb2YgZmFjdCxcbiAqIGBjb25jYXRgIGlzIGFuIGVxdWl2YWxlbnQgb2YgYG1lcmdlYCBvcGVyYXRvciB3aXRoIGBjb25jdXJyZW50YCBwYXJhbWV0ZXIgc2V0IHRvIGAxYC5cbiAqXG4gKiBOb3RlIHRoYXQgaWYgc29tZSBpbnB1dCBPYnNlcnZhYmxlIG5ldmVyIGNvbXBsZXRlcywgYGNvbmNhdGAgd2lsbCBhbHNvIG5ldmVyIGNvbXBsZXRlXG4gKiBhbmQgT2JzZXJ2YWJsZXMgZm9sbG93aW5nIHRoZSBvbmUgdGhhdCBkaWQgbm90IGNvbXBsZXRlIHdpbGwgbmV2ZXIgYmUgc3Vic2NyaWJlZC4gT24gdGhlIG90aGVyXG4gKiBoYW5kLCBpZiBzb21lIE9ic2VydmFibGUgc2ltcGx5IGNvbXBsZXRlcyBpbW1lZGlhdGVseSBhZnRlciBpdCBpcyBzdWJzY3JpYmVkLCBpdCB3aWxsIGJlXG4gKiBpbnZpc2libGUgZm9yIGBjb25jYXRgLCB3aGljaCB3aWxsIGp1c3QgbW92ZSBvbiB0byB0aGUgbmV4dCBPYnNlcnZhYmxlLlxuICpcbiAqIElmIGFueSBPYnNlcnZhYmxlIGluIGNoYWluIGVycm9ycywgaW5zdGVhZCBvZiBwYXNzaW5nIGNvbnRyb2wgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSxcbiAqIGBjb25jYXRgIHdpbGwgZXJyb3IgaW1tZWRpYXRlbHkgYXMgd2VsbC4gT2JzZXJ2YWJsZXMgdGhhdCB3b3VsZCBiZSBzdWJzY3JpYmVkIGFmdGVyXG4gKiB0aGUgb25lIHRoYXQgZW1pdHRlZCBlcnJvciwgbmV2ZXIgd2lsbC5cbiAqXG4gKiBJZiB5b3UgcGFzcyB0byBgY29uY2F0YCB0aGUgc2FtZSBPYnNlcnZhYmxlIG1hbnkgdGltZXMsIGl0cyBzdHJlYW0gb2YgdmFsdWVzXG4gKiB3aWxsIGJlIFwicmVwbGF5ZWRcIiBvbiBldmVyeSBzdWJzY3JpcHRpb24sIHdoaWNoIG1lYW5zIHlvdSBjYW4gcmVwZWF0IGdpdmVuIE9ic2VydmFibGVcbiAqIGFzIG1hbnkgdGltZXMgYXMgeW91IGxpa2UuIElmIHBhc3NpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byBgY29uY2F0YCAxMDAwIHRpbWVzIGJlY29tZXMgdGVkaW91cyxcbiAqIHlvdSBjYW4gYWx3YXlzIHVzZSB7QGxpbmsgcmVwZWF0fS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENvbmNhdGVuYXRlIGEgdGltZXIgY291bnRpbmcgZnJvbSAwIHRvIDMgd2l0aCBhIHN5bmNocm9ub3VzIHNlcXVlbmNlIGZyb20gMSB0byAxMFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoNCkpO1xuICogY29uc3Qgc2VxdWVuY2UgPSByYW5nZSgxLCAxMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQodGltZXIsIHNlcXVlbmNlKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gcmVzdWx0cyBpbjpcbiAqIC8vIDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IDIgLTEwMDBtcy0+IDMgLWltbWVkaWF0ZS0+IDEgLi4uIDEwXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgYW4gYXJyYXkgb2YgMyBPYnNlcnZhYmxlc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdGltZXIxID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDEwKSk7XG4gKiBjb25zdCB0aW1lcjIgPSBpbnRlcnZhbCgyMDAwKS5waXBlKHRha2UoNikpO1xuICogY29uc3QgdGltZXIzID0gaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoMTApKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNvbmNhdChbdGltZXIxLCB0aW1lcjIsIHRpbWVyM10pOyAvLyBub3RlIHRoYXQgYXJyYXkgaXMgcGFzc2VkXG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIChQcmludHMgdG8gY29uc29sZSBzZXF1ZW50aWFsbHkpXG4gKiAvLyAtMTAwMG1zLT4gMCAtMTAwMG1zLT4gMSAtMTAwMG1zLT4gLi4uIDlcbiAqIC8vIC0yMDAwbXMtPiAwIC0yMDAwbXMtPiAxIC0yMDAwbXMtPiAuLi4gNVxuICogLy8gLTUwMG1zLT4gMCAtNTAwbXMtPiAxIC01MDBtcy0+IC4uLiA5XG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29uY2F0ZW5hdGUgdGhlIHNhbWUgT2JzZXJ2YWJsZSB0byByZXBlYXQgaXRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDIpKTtcbiAqICpcbiAqIGNvbmNhdCh0aW1lciwgdGltZXIpIC8vIGNvbmNhdGVuYXRpbmcgdGhlIHNhbWUgT2JzZXJ2YWJsZSFcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnLi4uYW5kIGl0IGlzIGRvbmUhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDAgYWZ0ZXIgMXNcbiAqIC8vIDEgYWZ0ZXIgMnNcbiAqIC8vIDAgYWZ0ZXIgM3NcbiAqIC8vIDEgYWZ0ZXIgNHNcbiAqIC8vIFwiLi4uYW5kIGl0IGlzIGRvbmUhXCIgYWxzbyBhZnRlciA0c1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0QWxsfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwfVxuICogQHNlZSB7QGxpbmsgY29uY2F0TWFwVG99XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MSBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IGlucHV0MiBBbiBpbnB1dCBPYnNlcnZhYmxlIHRvIGNvbmNhdGVuYXRlIHdpdGggb3RoZXJzLlxuICogTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnQuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9bnVsbF0gQW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHNjaGVkdWxlIGVhY2hcbiAqIE9ic2VydmFibGUgc3Vic2NyaXB0aW9uIG9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQWxsIHZhbHVlcyBvZiBlYWNoIHBhc3NlZCBPYnNlcnZhYmxlIG1lcmdlZCBpbnRvIGFcbiAqIHNpbmdsZSBPYnNlcnZhYmxlLCBpbiBvcmRlciwgaW4gc2VyaWFsIGZhc2hpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGNvbmNhdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8Uj4ge1xuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxIHx8IChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDIgJiYgaXNTY2hlZHVsZXIob2JzZXJ2YWJsZXNbMV0pKSkge1xuICAgIHJldHVybiBmcm9tKDxhbnk+b2JzZXJ2YWJsZXNbMF0pO1xuICB9XG4gIHJldHVybiBjb25jYXRBbGw8Uj4oKShvZiguLi5vYnNlcnZhYmxlcykpO1xufVxuIl19