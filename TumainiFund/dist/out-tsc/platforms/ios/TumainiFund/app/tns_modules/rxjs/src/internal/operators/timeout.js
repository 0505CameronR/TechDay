import { async } from '../scheduler/async';
import { TimeoutError } from '../util/TimeoutError';
import { timeoutWith } from './timeoutWith';
import { throwError } from '../observable/throwError';
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
export function timeout(due, scheduler = async) {
    return timeoutWith(due, throwError(new TimeoutError()), scheduler);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUszQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFFcEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sMEJBQTBCLENBQUM7QUFFdEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUVHO0FBQ0gsTUFBTSxVQUFVLE9BQU8sQ0FBSSxHQUFrQixFQUNsQixZQUEyQixLQUFLO0lBQ3pELE9BQU8sV0FBVyxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUMsSUFBSSxZQUFZLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc0RhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFRpbWVvdXRFcnJvciB9IGZyb20gJy4uL3V0aWwvVGltZW91dEVycm9yJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgdGltZW91dFdpdGggfSBmcm9tICcuL3RpbWVvdXRXaXRoJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuXG4vKipcbiAqXG4gKiBFcnJvcnMgaWYgT2JzZXJ2YWJsZSBkb2VzIG5vdCBlbWl0IGEgdmFsdWUgaW4gZ2l2ZW4gdGltZSBzcGFuLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5UaW1lb3V0cyBvbiBPYnNlcnZhYmxlIHRoYXQgZG9lc24ndCBlbWl0IHZhbHVlcyBmYXN0IGVub3VnaC48L3NwYW4+XG4gKlxuICogIVtdKHRpbWVvdXQucG5nKVxuICpcbiAqIGB0aW1lb3V0YCBvcGVyYXRvciBhY2NlcHRzIGFzIGFuIGFyZ3VtZW50IGVpdGhlciBhIG51bWJlciBvciBhIERhdGUuXG4gKlxuICogSWYgbnVtYmVyIHdhcyBwcm92aWRlZCwgaXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgYmVoYXZlcyBsaWtlIGEgc291cmNlXG4gKiBPYnNlcnZhYmxlLCB1bmxlc3MgdGhlcmUgaXMgYSBwZXJpb2Qgb2YgdGltZSB3aGVyZSB0aGVyZSBpcyBubyB2YWx1ZSBlbWl0dGVkLlxuICogU28gaWYgeW91IHByb3ZpZGUgYDEwMGAgYXMgYXJndW1lbnQgYW5kIGZpcnN0IHZhbHVlIGNvbWVzIGFmdGVyIDUwbXMgZnJvbVxuICogdGhlIG1vbWVudCBvZiBzdWJzY3JpcHRpb24sIHRoaXMgdmFsdWUgd2lsbCBiZSBzaW1wbHkgcmUtZW1pdHRlZCBieSB0aGUgcmVzdWx0aW5nXG4gKiBPYnNlcnZhYmxlLiBJZiBob3dldmVyIGFmdGVyIHRoYXQgMTAwbXMgcGFzc2VzIHdpdGhvdXQgYSBzZWNvbmQgdmFsdWUgYmVpbmcgZW1pdHRlZCxcbiAqIHN0cmVhbSB3aWxsIGVuZCB3aXRoIGFuIGVycm9yIGFuZCBzb3VyY2UgT2JzZXJ2YWJsZSB3aWxsIGJlIHVuc3Vic2NyaWJlZC5cbiAqIFRoZXNlIGNoZWNrcyBhcmUgcGVyZm9ybWVkIHRocm91Z2hvdXQgd2hvbGUgbGlmZWN5Y2xlIG9mIE9ic2VydmFibGUgLSBmcm9tIHRoZSBtb21lbnRcbiAqIGl0IHdhcyBzdWJzY3JpYmVkIHRvLCB1bnRpbCBpdCBjb21wbGV0ZXMgb3IgZXJyb3JzIGl0c2VsZi4gVGh1cyBldmVyeSB2YWx1ZSBtdXN0IGJlXG4gKiBlbWl0dGVkIHdpdGhpbiBzcGVjaWZpZWQgcGVyaW9kIHNpbmNlIHByZXZpb3VzIHZhbHVlLlxuICpcbiAqIElmIHByb3ZpZGVkIGFyZ3VtZW50IHdhcyBEYXRlLCByZXR1cm5lZCBPYnNlcnZhYmxlIGJlaGF2ZXMgZGlmZmVyZW50bHkuIEl0IHRocm93c1xuICogaWYgT2JzZXJ2YWJsZSBkaWQgbm90IGNvbXBsZXRlIGJlZm9yZSBwcm92aWRlZCBEYXRlLiBUaGlzIG1lYW5zIHRoYXQgcGVyaW9kcyBiZXR3ZWVuXG4gKiBlbWlzc2lvbiBvZiBwYXJ0aWN1bGFyIHZhbHVlcyBkbyBub3QgbWF0dGVyIGluIHRoaXMgY2FzZS4gSWYgT2JzZXJ2YWJsZSBkaWQgbm90IGNvbXBsZXRlXG4gKiBiZWZvcmUgcHJvdmlkZWQgRGF0ZSwgc291cmNlIE9ic2VydmFibGUgd2lsbCBiZSB1bnN1YnNjcmliZWQuIE90aGVyIHRoYW4gdGhhdCwgcmVzdWx0aW5nXG4gKiBzdHJlYW0gYmVoYXZlcyBqdXN0IGFzIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqIGB0aW1lb3V0YCBhY2NlcHRzIGFsc28gYSBTY2hlZHVsZXIgYXMgYSBzZWNvbmQgcGFyYW1ldGVyLiBJdCBpcyB1c2VkIHRvIHNjaGVkdWxlIG1vbWVudCAob3IgbW9tZW50cylcbiAqIHdoZW4gcmV0dXJuZWQgT2JzZXJ2YWJsZSB3aWxsIGNoZWNrIGlmIHNvdXJjZSBzdHJlYW0gZW1pdHRlZCB2YWx1ZSBvciBjb21wbGV0ZWQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIENoZWNrIGlmIHRpY2tzIGFyZSBlbWl0dGVkIHdpdGhpbiBjZXJ0YWluIHRpbWVzcGFuXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBzZWNvbmRzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKlxuICogc2Vjb25kcy5waXBlKHRpbWVvdXQoMTEwMCkpICAgICAgLy8gTGV0J3MgdXNlIGJpZ2dlciB0aW1lc3BhbiB0byBiZSBzYWZlLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgYGludGVydmFsYCBtaWdodCBmaXJlIGEgYml0IGxhdGVyIHRoZW4gc2NoZWR1bGVkLlxuICogLnN1YnNjcmliZShcbiAqICAgICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksIC8vIFdpbGwgZW1pdCBudW1iZXJzIGp1c3QgYXMgcmVndWxhciBgaW50ZXJ2YWxgIHdvdWxkLlxuICogICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpLCAgICAgLy8gV2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiApO1xuICpcbiAqIHNlY29uZHMucGlwZSh0aW1lb3V0KDkwMCkpXG4gKiAuc3Vic2NyaWJlKFxuICogICAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSwgLy8gV2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiAgICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksICAgICAvLyBXaWxsIGVtaXQgZXJyb3IgYmVmb3JlIGV2ZW4gZmlyc3QgdmFsdWUgaXMgZW1pdHRlZCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNpbmNlIGl0IGRpZCBub3QgYXJyaXZlIHdpdGhpbiA5MDBtcyBwZXJpb2QuXG4gKiApO1xuICogYGBgXG4gKlxuICogVXNlIERhdGUgdG8gY2hlY2sgaWYgT2JzZXJ2YWJsZSBjb21wbGV0ZWRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHNlY29uZHMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqXG4gKiBzZWNvbmRzLnBpcGUoXG4gKiAgIHRpbWVvdXQobmV3IERhdGUoXCJEZWNlbWJlciAxNywgMjAyMCAwMzoyNDowMFwiKSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKFxuICogICAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSwgLy8gV2lsbCBlbWl0IHZhbHVlcyBhcyByZWd1bGFyIGBpbnRlcnZhbGAgd291bGRcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVudGlsIERlY2VtYmVyIDE3LCAyMDIwIGF0IDAzOjI0OjAwLlxuICogICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpICAgICAgLy8gT24gRGVjZW1iZXIgMTcsIDIwMjAgYXQgMDM6MjQ6MDAgaXQgd2lsbCBlbWl0IGFuIGVycm9yLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgT2JzZXJ2YWJsZSBkaWQgbm90IGNvbXBsZXRlIGJ5IHRoZW4uXG4gKiApO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB0aW1lb3V0V2l0aH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcnxEYXRlfSBkdWUgTnVtYmVyIHNwZWNpZnlpbmcgcGVyaW9kIHdpdGhpbiB3aGljaCBPYnNlcnZhYmxlIG11c3QgZW1pdCB2YWx1ZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBvciBEYXRlIHNwZWNpZnlpbmcgYmVmb3JlIHdoZW4gT2JzZXJ2YWJsZSBzaG91bGQgY29tcGxldGVcbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIGNvbnRyb2xsaW5nIHdoZW4gdGltZW91dCBjaGVja3Mgb2NjdXIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyBiZWhhdmlvdXIgb2Ygc291cmNlLCB1bmxlc3MgdGltZW91dCBjaGVja3MgZmFpbC5cbiAqIEBtZXRob2QgdGltZW91dFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXQ8VD4oZHVlOiBudW1iZXIgfCBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gdGltZW91dFdpdGgoZHVlLCB0aHJvd0Vycm9yKG5ldyBUaW1lb3V0RXJyb3IoKSksIHNjaGVkdWxlcik7XG59XG4iXX0=