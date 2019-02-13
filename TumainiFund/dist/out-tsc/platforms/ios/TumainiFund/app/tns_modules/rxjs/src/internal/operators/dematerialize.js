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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtYXRlcmlhbGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZW1hdGVyaWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFJM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBDRztBQUNILE1BQU0sVUFBVSxhQUFhO0lBQzNCLE9BQU8sU0FBUyw2QkFBNkIsQ0FBQyxNQUFtQztRQUMvRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0scUJBQXFCO0lBQ3pCLElBQUksQ0FBQyxVQUEyQixFQUFFLE1BQVc7UUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksdUJBQXVCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSx1QkFBcUQsU0FBUSxVQUFhO0lBQzlFLFlBQVksV0FBNEI7UUFDdEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixLQUFLLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE5vdGlmaWNhdGlvbiB9IGZyb20gJy4uL05vdGlmaWNhdGlvbic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIENvbnZlcnRzIGFuIE9ic2VydmFibGUgb2Yge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBpbnRvIHRoZSBlbWlzc2lvbnNcbiAqIHRoYXQgdGhleSByZXByZXNlbnQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVud3JhcHMge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBhcyBhY3R1YWwgYG5leHRgLFxuICogYGVycm9yYCBhbmQgYGNvbXBsZXRlYCBlbWlzc2lvbnMuIFRoZSBvcHBvc2l0ZSBvZiB7QGxpbmsgbWF0ZXJpYWxpemV9Ljwvc3Bhbj5cbiAqXG4gKiAhW10oZGVtYXRlcmlhbGl6ZS5wbmcpXG4gKlxuICogYGRlbWF0ZXJpYWxpemVgIGlzIGFzc3VtZWQgdG8gb3BlcmF0ZSBhbiBPYnNlcnZhYmxlIHRoYXQgb25seSBlbWl0c1xuICoge0BsaW5rIE5vdGlmaWNhdGlvbn0gb2JqZWN0cyBhcyBgbmV4dGAgZW1pc3Npb25zLCBhbmQgZG9lcyBub3QgZW1pdCBhbnlcbiAqIGBlcnJvcmAuIFN1Y2ggT2JzZXJ2YWJsZSBpcyB0aGUgb3V0cHV0IG9mIGEgYG1hdGVyaWFsaXplYCBvcGVyYXRpb24uIFRob3NlXG4gKiBub3RpZmljYXRpb25zIGFyZSB0aGVuIHVud3JhcHBlZCB1c2luZyB0aGUgbWV0YWRhdGEgdGhleSBjb250YWluLCBhbmQgZW1pdHRlZFxuICogYXMgYG5leHRgLCBgZXJyb3JgLCBhbmQgYGNvbXBsZXRlYCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogVXNlIHRoaXMgb3BlcmF0b3IgaW4gY29uanVuY3Rpb24gd2l0aCB7QGxpbmsgbWF0ZXJpYWxpemV9LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbnZlcnQgYW4gT2JzZXJ2YWJsZSBvZiBOb3RpZmljYXRpb25zIHRvIGFuIGFjdHVhbCBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBub3RpZkEgPSBuZXcgTm90aWZpY2F0aW9uKCdOJywgJ0EnKTtcbiAqIGNvbnN0IG5vdGlmQiA9IG5ldyBOb3RpZmljYXRpb24oJ04nLCAnQicpO1xuICogY29uc3Qgbm90aWZFID0gbmV3IE5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCxcbiAqICAgbmV3IFR5cGVFcnJvcigneC50b1VwcGVyQ2FzZSBpcyBub3QgYSBmdW5jdGlvbicpXG4gKiApO1xuICogY29uc3QgbWF0ZXJpYWxpemVkID0gb2Yobm90aWZBLCBub3RpZkIsIG5vdGlmRSk7XG4gKiBjb25zdCB1cHBlckNhc2UgPSBtYXRlcmlhbGl6ZWQucGlwZShkZW1hdGVyaWFsaXplKCkpO1xuICogdXBwZXJDYXNlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW46XG4gKiAvLyBBXG4gKiAvLyBCXG4gKiAvLyBUeXBlRXJyb3I6IHgudG9VcHBlckNhc2UgaXMgbm90IGEgZnVuY3Rpb25cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE5vdGlmaWNhdGlvbn1cbiAqIEBzZWUge0BsaW5rIG1hdGVyaWFsaXplfVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBhbmQgbm90aWZpY2F0aW9uc1xuICogZW1iZWRkZWQgaW4gTm90aWZpY2F0aW9uIG9iamVjdHMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIGRlbWF0ZXJpYWxpemVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZW1hdGVyaWFsaXplPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248Tm90aWZpY2F0aW9uPFQ+LCBUPiB7XG4gIHJldHVybiBmdW5jdGlvbiBkZW1hdGVyaWFsaXplT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8Tm90aWZpY2F0aW9uPFQ+Pikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgRGVNYXRlcmlhbGl6ZU9wZXJhdG9yKCkpO1xuICB9O1xufVxuXG5jbGFzcyBEZU1hdGVyaWFsaXplT3BlcmF0b3I8VCBleHRlbmRzIE5vdGlmaWNhdGlvbjxhbnk+LCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGVNYXRlcmlhbGl6ZVN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZU1hdGVyaWFsaXplU3Vic2NyaWJlcjxUIGV4dGVuZHMgTm90aWZpY2F0aW9uPGFueT4+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB2YWx1ZS5vYnNlcnZlKHRoaXMuZGVzdGluYXRpb24pO1xuICB9XG59XG4iXX0=