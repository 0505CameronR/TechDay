import { Subscriber } from '../Subscriber';
/**
 * Converts an Observable of {@link Notification} objects into the emissions
 * that they represent.
 *
 * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
 * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
 *
 * ![](dematerialize.png)
 *
 * `dematerialize` is assumed to operate an Observable that only emits
 * {@link Notification} objects as `next` emissions, and does not emit any
 * `error`. Such Observable is the output of a `materialize` operation. Those
 * notifications are then unwrapped using the metadata they contain, and emitted
 * as `next`, `error`, and `complete` on the output Observable.
 *
 * Use this operator in conjunction with {@link materialize}.
 *
 * ## Example
 * Convert an Observable of Notifications to an actual Observable
 * ```javascript
 * import { of, Notification } from 'rxjs';
 * import { dematerialize } from 'rxjs/operators';
 *
 * const notifA = new Notification('N', 'A');
 * const notifB = new Notification('N', 'B');
 * const notifE = new Notification('E', undefined,
 *   new TypeError('x.toUpperCase is not a function')
 * );
 * const materialized = of(notifA, notifB, notifE);
 * const upperCase = materialized.pipe(dematerialize());
 * upperCase.subscribe(x => console.log(x), e => console.error(e));
 *
 * // Results in:
 * // A
 * // B
 * // TypeError: x.toUpperCase is not a function
 * ```
 *
 * @see {@link Notification}
 * @see {@link materialize}
 *
 * @return {Observable} An Observable that emits items and notifications
 * embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
export function dematerialize() {
    return function dematerializeOperatorFunction(source) {
        return source.lift(new DeMaterializeOperator());
    };
}
class DeMaterializeOperator {
    call(subscriber, source) {
        return source.subscribe(new DeMaterializeSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DeMaterializeSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
    }
    _next(value) {
        value.observe(this.destination);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtYXRlcmlhbGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZW1hdGVyaWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUNILE1BQU0sVUFBVSxhQUFhO0lBQzNCLE9BQU8sU0FBUyw2QkFBNkIsQ0FBQyxNQUFtQztRQUMvRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0scUJBQXFCO0lBQ3pCLElBQUksQ0FBQyxVQUEyQixFQUFFLE1BQVc7UUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBcUQsU0FBUSxVQUFhO0lBQzlFLFlBQVksV0FBNEI7UUFDdEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIENvbnZlcnRzIGFuIE9ic2VydmFibGUgb2Yge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBpbnRvIHRoZSBlbWlzc2lvbnNcbiAqIHRoYXQgdGhleSByZXByZXNlbnQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVud3JhcHMge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBhcyBhY3R1YWwgYG5leHRgLFxuICogYGVycm9yYCBhbmQgYGNvbXBsZXRlYCBlbWlzc2lvbnMuIFRoZSBvcHBvc2l0ZSBvZiB7QGxpbmsgbWF0ZXJpYWxpemV9Ljwvc3Bhbj5cbiAqXG4gKiAhW10oZGVtYXRlcmlhbGl6ZS5wbmcpXG4gKlxuICogYGRlbWF0ZXJpYWxpemVgIGlzIGFzc3VtZWQgdG8gb3BlcmF0ZSBhbiBPYnNlcnZhYmxlIHRoYXQgb25seSBlbWl0c1xuICoge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBhcyBgbmV4dGAgZW1pc3Npb25zLCBhbmQgZG9lcyBub3QgZW1pdCBhbnlcbiAqIGBlcnJvcmAuIFN1Y2ggT2JzZXJ2YWJsZSBpcyB0aGUgb3V0cHV0IG9mIGEgYG1hdGVyaWFsaXplYCBvcGVyYXRpb24uIFRob3NlXG4gKiBub3RpZmljYXRpb25zIGFyZSB0aGVuIHVud3JhcHBlZCB1c2luZyB0aGUgbWV0YWRhdGEgdGhleSBjb250YWluLCBhbmQgZW1pdHRlZFxuICogYXMgYG5leHRgLCBgZXJyb3JgLCBhbmQgYGNvbXBsZXRlYCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogVXNlIHRoaXMgb3BlcmF0b3IgaW4gY29uanVuY3Rpb24gd2l0aCB7QGxpbmsgbWF0ZXJpYWxpemV9LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbnZlcnQgYW4gT2JzZXJ2YWJsZSBvZiBOb3RpZmljYXRpb25zIHRvIGFuIGFjdHVhbCBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiwgTm90aWZpY2F0aW9uIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBkZW1hdGVyaWFsaXplIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG5vdGlmQSA9IG5ldyBOb3RpZmljYXRpb24oJ04nLCAnQScpO1xuICogY29uc3Qgbm90aWZCID0gbmV3IE5vdGlmaWNhdGlvbignTicsICdCJyk7XG4gKiBjb25zdCBub3RpZkUgPSBuZXcgTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLFxuICogICBuZXcgVHlwZUVycm9yKCd4LnRvVXBwZXJDYXNlIGlzIG5vdCBhIGZ1bmN0aW9uJylcbiAqICk7XG4gKiBjb25zdCBtYXRlcmlhbGl6ZWQgPSBvZihub3RpZkEsIG5vdGlmQiwgbm90aWZFKTtcbiAqIGNvbnN0IHVwcGVyQ2FzZSA9IG1hdGVyaWFsaXplZC5waXBlKGRlbWF0ZXJpYWxpemUoKSk7XG4gKiB1cHBlckNhc2Uuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIEFcbiAqIC8vIEJcbiAqIC8vIFR5cGVFcnJvcjogeC50b1VwcGVyQ2FzZSBpcyBub3QgYSBmdW5jdGlvblxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgTm90aWZpY2F0aW9ufVxuICogQHNlZSB7QGxpbmsgbWF0ZXJpYWxpemV9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGFuZCBub3RpZmljYXRpb25zXG4gKiBlbWJlZGRlZCBpbiBOb3RpZmljYXRpb24gb2JqZWN0cyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgZGVtYXRlcmlhbGl6ZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbWF0ZXJpYWxpemU8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxOb3RpZmljYXRpb248VD4sIFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbWF0ZXJpYWxpemVPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxOb3RpZmljYXRpb248VD4+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBEZU1hdGVyaWFsaXplT3BlcmF0b3IoKSk7XG4gIH07XG59XG5cbmNsYXNzIERlTWF0ZXJpYWxpemVPcGVyYXRvcjxUIGV4dGVuZHMgTm90aWZpY2F0aW9uPGFueT4sIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZU1hdGVyaWFsaXplU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlTWF0ZXJpYWxpemVTdWJzY3JpYmVyPFQgZXh0ZW5kcyBOb3RpZmljYXRpb248YW55Pj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHZhbHVlLm9ic2VydmUodGhpcy5kZXN0aW5hdGlvbik7XG4gIH1cbn1cbiJdfQ==