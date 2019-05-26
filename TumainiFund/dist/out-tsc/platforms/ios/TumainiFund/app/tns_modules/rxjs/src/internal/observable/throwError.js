import { Observable } from '../Observable';
/**
 * Creates an Observable that emits no items to the Observer and immediately
 * emits an error notification.
 *
 * <span class="informal">Just emits 'error', and nothing else.
 * </span>
 *
 * ![](throw.png)
 *
 * This static operator is useful for creating a simple Observable that only
 * emits the error notification. It can be used for composing with other
 * Observables, such as in a {@link mergeMap}.
 *
 * ## Examples
 * ### Emit the number 7, then emit an error
 * ```javascript
 * import { throwError, concat, of } from 'rxjs';
 *
 * const result = concat(of(7), throwError(new Error('oops!')));
 * result.subscribe(x => console.log(x), e => console.error(e));
 *
 * // Logs:
 * // 7
 * // Error: oops!
 * ```
 *
 * ---
 *
 * ### Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 2
 * ```javascript
 * import { throwError, interval, of } from 'rxjs';
 * import { mergeMap } from 'rxjs/operators';
 *
 * interval(1000).pipe(
 *   mergeMap(x => x === 2
 *     ? throwError('Twos are bad')
 *     : of('a', 'b', 'c')
 *   ),
 * ).subscribe(x => console.log(x), e => console.error(e));
 *
 * // Logs:
 * // a
 * // b
 * // c
 * // a
 * // b
 * // c
 * // Twos are bad
 * ```
 *
 * @see {@link Observable}
 * @see {@link empty}
 * @see {@link never}
 * @see {@link of}
 *
 * @param {any} error The particular Error to pass to the error notification.
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emission of the error notification.
 * @return {Observable} An error Observable: emits only the error notification
 * using the given error argument.
 * @static true
 * @name throwError
 * @owner Observable
 */
export function throwError(error, scheduler) {
    if (!scheduler) {
        return new Observable(subscriber => subscriber.error(error));
    }
    else {
        return new Observable(subscriber => scheduler.schedule(dispatch, 0, { error, subscriber }));
    }
}
function dispatch({ error, subscriber }) {
    subscriber.error(error);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3dFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvdGhyb3dFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErREc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFDLEtBQVUsRUFBRSxTQUF5QjtJQUM5RCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUM5RDtTQUFNO1FBQ0wsT0FBTyxJQUFJLFVBQVUsQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDN0Y7QUFDSCxDQUFDO0FBT0QsU0FBUyxRQUFRLENBQUMsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFlO0lBQ2xELFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBpbW1lZGlhdGVseVxuICogZW1pdHMgYW4gZXJyb3Igbm90aWZpY2F0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5KdXN0IGVtaXRzICdlcnJvcicsIGFuZCBub3RoaW5nIGVsc2UuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKHRocm93LnBuZylcbiAqXG4gKiBUaGlzIHN0YXRpYyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBvbmx5XG4gKiBlbWl0cyB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLiBJdCBjYW4gYmUgdXNlZCBmb3IgY29tcG9zaW5nIHdpdGggb3RoZXJcbiAqIE9ic2VydmFibGVzLCBzdWNoIGFzIGluIGEge0BsaW5rIG1lcmdlTWFwfS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIGVtaXQgYW4gZXJyb3JcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRocm93RXJyb3IsIGNvbmNhdCwgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQob2YoNyksIHRocm93RXJyb3IobmV3IEVycm9yKCdvb3BzIScpKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDdcbiAqIC8vIEVycm9yOiBvb3BzIVxuICogYGBgXG4gKlxuICogLS0tXG4gKlxuICogIyMjIE1hcCBhbmQgZmxhdHRlbiBudW1iZXJzIHRvIHRoZSBzZXF1ZW5jZSAnYScsICdiJywgJ2MnLCBidXQgdGhyb3cgYW4gZXJyb3IgZm9yIDJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRocm93RXJyb3IsIGludGVydmFsLCBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWVyZ2VNYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJ2YWwoMTAwMCkucGlwZShcbiAqICAgbWVyZ2VNYXAoeCA9PiB4ID09PSAyXG4gKiAgICAgPyB0aHJvd0Vycm9yKCdUd29zIGFyZSBiYWQnKVxuICogICAgIDogb2YoJ2EnLCAnYicsICdjJylcbiAqICAgKSxcbiAqICkuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIGFcbiAqIC8vIGJcbiAqIC8vIGNcbiAqIC8vIGFcbiAqIC8vIGJcbiAqIC8vIGNcbiAqIC8vIFR3b3MgYXJlIGJhZFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqIEBzZWUge0BsaW5rIGVtcHR5fVxuICogQHNlZSB7QGxpbmsgbmV2ZXJ9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqXG4gKiBAcGFyYW0ge2FueX0gZXJyb3IgVGhlIHBhcnRpY3VsYXIgRXJyb3IgdG8gcGFzcyB0byB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gZXJyb3IgT2JzZXJ2YWJsZTogZW1pdHMgb25seSB0aGUgZXJyb3Igbm90aWZpY2F0aW9uXG4gKiB1c2luZyB0aGUgZ2l2ZW4gZXJyb3IgYXJndW1lbnQuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHRocm93RXJyb3JcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvd0Vycm9yKGVycm9yOiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPG5ldmVyPiB7XG4gIGlmICghc2NoZWR1bGVyKSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4gc3Vic2NyaWJlci5lcnJvcihlcnJvcikpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwgeyBlcnJvciwgc3Vic2NyaWJlciB9KSk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoQXJnIHtcbiAgZXJyb3I6IGFueTtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaCh7IGVycm9yLCBzdWJzY3JpYmVyIH06IERpc3BhdGNoQXJnKSB7XG4gIHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpO1xufVxuIl19