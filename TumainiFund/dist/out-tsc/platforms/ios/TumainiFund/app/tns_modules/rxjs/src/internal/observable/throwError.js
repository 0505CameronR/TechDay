"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
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
 * ### Map and flatten numbers to the sequence 'a', 'b', 'c', but throw an error for 13
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
function throwError(error, scheduler) {
    if (!scheduler) {
        return new Observable_1.Observable(function (subscriber) { return subscriber.error(error); });
    }
    else {
        return new Observable_1.Observable(function (subscriber) { return scheduler.schedule(dispatch, 0, { error: error, subscriber: subscriber }); });
    }
}
exports.throwError = throwError;
function dispatch(_a) {
    var error = _a.error, subscriber = _a.subscriber;
    subscriber.error(error);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3dFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvdGhyb3dFcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUkzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0RHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLEtBQVUsRUFBRSxTQUF5QjtJQUM5RCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLHVCQUFVLENBQUMsVUFBQSxVQUFVLElBQUksT0FBQSxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUF2QixDQUF1QixDQUFDLENBQUM7S0FDOUQ7U0FBTTtRQUNMLE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQUEsVUFBVSxJQUFJLE9BQUEsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsVUFBVSxZQUFBLEVBQUUsQ0FBQyxFQUF0RCxDQUFzRCxDQUFDLENBQUM7S0FDN0Y7QUFDSCxDQUFDO0FBTkQsZ0NBTUM7QUFPRCxTQUFTLFFBQVEsQ0FBQyxFQUFrQztRQUFoQyxnQkFBSyxFQUFFLDBCQUFVO0lBQ25DLFVBQVUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBpbW1lZGlhdGVseVxuICogZW1pdHMgYW4gZXJyb3Igbm90aWZpY2F0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5KdXN0IGVtaXRzICdlcnJvcicsIGFuZCBub3RoaW5nIGVsc2UuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKHRocm93LnBuZylcbiAqXG4gKiBUaGlzIHN0YXRpYyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGNyZWF0aW5nIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBvbmx5XG4gKiBlbWl0cyB0aGUgZXJyb3Igbm90aWZpY2F0aW9uLiBJdCBjYW4gYmUgdXNlZCBmb3IgY29tcG9zaW5nIHdpdGggb3RoZXJcbiAqIE9ic2VydmFibGVzLCBzdWNoIGFzIGluIGEge0BsaW5rIG1lcmdlTWFwfS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIGVtaXQgYW4gZXJyb3JcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRocm93RXJyb3IsIGNvbmNhdCwgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCByZXN1bHQgPSBjb25jYXQob2YoNyksIHRocm93RXJyb3IobmV3IEVycm9yKCdvb3BzIScpKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDdcbiAqIC8vIEVycm9yOiBvb3BzIVxuICogYGBgXG4gKlxuICogLS0tXG4gKlxuICogIyMjIE1hcCBhbmQgZmxhdHRlbiBudW1iZXJzIHRvIHRoZSBzZXF1ZW5jZSAnYScsICdiJywgJ2MnLCBidXQgdGhyb3cgYW4gZXJyb3IgZm9yIDEzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyB0aHJvd0Vycm9yLCBpbnRlcnZhbCwgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IG1lcmdlTWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGludGVydmFsKDEwMDApLnBpcGUoXG4gKiAgIG1lcmdlTWFwKHggPT4geCA9PT0gMlxuICogICAgID8gdGhyb3dFcnJvcignVHdvcyBhcmUgYmFkJylcbiAqICAgICA6IG9mKCdhJywgJ2InLCAnYycpXG4gKiAgICksXG4gKiApLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBhXG4gKiAvLyBiXG4gKiAvLyBjXG4gKiAvLyBhXG4gKiAvLyBiXG4gKiAvLyBjXG4gKiAvLyBUd29zIGFyZSBiYWRcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBlbXB0eX1cbiAqIEBzZWUge0BsaW5rIG5ldmVyfVxuICogQHNlZSB7QGxpbmsgb2Z9XG4gKlxuICogQHBhcmFtIHthbnl9IGVycm9yIFRoZSBwYXJ0aWN1bGFyIEVycm9yIHRvIHBhc3MgdG8gdGhlIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdGhlIGVycm9yIG5vdGlmaWNhdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIGVycm9yIE9ic2VydmFibGU6IGVtaXRzIG9ubHkgdGhlIGVycm9yIG5vdGlmaWNhdGlvblxuICogdXNpbmcgdGhlIGdpdmVuIGVycm9yIGFyZ3VtZW50LlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aHJvd0Vycm9yXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3dFcnJvcihlcnJvcjogYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxuZXZlcj4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHN1YnNjcmliZXIuZXJyb3IoZXJyb3IpKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHsgZXJyb3IsIHN1YnNjcmliZXIgfSkpO1xuICB9XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEFyZyB7XG4gIGVycm9yOiBhbnk7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pjtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2goeyBlcnJvciwgc3Vic2NyaWJlciB9OiBEaXNwYXRjaEFyZykge1xuICBzdWJzY3JpYmVyLmVycm9yKGVycm9yKTtcbn1cbiJdfQ==