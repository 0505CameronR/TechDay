"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var Notification_1 = require("../Notification");
/**
 * Represents all of the notifications from the source Observable as `next`
 * emissions marked with their original types within {@link Notification}
 * objects.
 *
 * <span class="informal">Wraps `next`, `error` and `complete` emissions in
 * {@link Notification} objects, emitted as `next` on the output Observable.
 * </span>
 *
 * ![](materialize.png)
 *
 * `materialize` returns an Observable that emits a `next` notification for each
 * `next`, `error`, or `complete` emission of the source Observable. When the
 * source Observable emits `complete`, the output Observable will emit `next` as
 * a Notification of type "complete", and then it will emit `complete` as well.
 * When the source Observable emits `error`, the output will emit `next` as a
 * Notification of type "error", and then `complete`.
 *
 * This operator is useful for producing metadata of the source Observable, to
 * be consumed as `next` emissions. Use it in conjunction with
 * {@link dematerialize}.
 *
 * ## Example
 * Convert a faulty Observable to an Observable of Notifications
 * ```javascript
 * const letters = of('a', 'b', 13, 'd');
 * const upperCase = letters.pipe(map(x => x.toUpperCase()));
 * const materialized = upperCase.pipe(materialize());
 * materialized.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // - Notification {kind: "N", value: "A", error: undefined, hasValue: true}
 * // - Notification {kind: "N", value: "B", error: undefined, hasValue: true}
 * // - Notification {kind: "E", value: undefined, error: TypeError:
 * //   x.toUpperCase is not a function at MapSubscriber.letters.map.x
 * //   [as project] (http://1…, hasValue: false}
 * ```
 *
 * @see {@link Notification}
 * @see {@link dematerialize}
 *
 * @return {Observable<Notification<T>>} An Observable that emits
 * {@link Notification} objects that wrap the original emissions from the source
 * Observable with metadata.
 * @method materialize
 * @owner Observable
 */
function materialize() {
    return function materializeOperatorFunction(source) {
        return source.lift(new MaterializeOperator());
    };
}
exports.materialize = materialize;
var MaterializeOperator = /** @class */ (function () {
    function MaterializeOperator() {
    }
    MaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MaterializeSubscriber(subscriber));
    };
    return MaterializeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MaterializeSubscriber = /** @class */ (function (_super) {
    __extends(MaterializeSubscriber, _super);
    function MaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    MaterializeSubscriber.prototype._next = function (value) {
        this.destination.next(Notification_1.Notification.createNext(value));
    };
    MaterializeSubscriber.prototype._error = function (err) {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createError(err));
        destination.complete();
    };
    MaterializeSubscriber.prototype._complete = function () {
        var destination = this.destination;
        destination.next(Notification_1.Notification.createComplete());
        destination.complete();
    };
    return MaterializeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9tYXRlcmlhbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBRy9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENHO0FBQ0gsU0FBZ0IsV0FBVztJQUN6QixPQUFPLFNBQVMsMkJBQTJCLENBQUMsTUFBcUI7UUFDL0QsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQW1CLEVBQUUsQ0FBQyxDQUFDO0lBQ2hELENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCxrQ0FJQztBQUVEO0lBQUE7SUFJQSxDQUFDO0lBSEMsa0NBQUksR0FBSixVQUFLLFVBQXVDLEVBQUUsTUFBVztRQUN2RCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ2pFLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXVDLHlDQUFhO0lBQ2xELCtCQUFZLFdBQXdDO2VBQ2xELGtCQUFNLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBRVMscUNBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLDJCQUFZLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVTLHNDQUFNLEdBQWhCLFVBQWlCLEdBQVE7UUFDdkIsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxXQUFXLENBQUMsSUFBSSxDQUFDLDJCQUFZLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEQsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFFUyx5Q0FBUyxHQUFuQjtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsV0FBVyxDQUFDLElBQUksQ0FBQywyQkFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDaEQsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFwQkQsQ0FBdUMsdUJBQVUsR0FvQmhEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXByZXNlbnRzIGFsbCBvZiB0aGUgbm90aWZpY2F0aW9ucyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhcyBgbmV4dGBcbiAqIGVtaXNzaW9ucyBtYXJrZWQgd2l0aCB0aGVpciBvcmlnaW5hbCB0eXBlcyB3aXRoaW4ge0BsaW5rIE5vdGlmaWNhdGlvbn1cbiAqIG9iamVjdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldyYXBzIGBuZXh0YCwgYGVycm9yYCBhbmQgYGNvbXBsZXRlYCBlbWlzc2lvbnMgaW5cbiAqIHtAbGluayBOb3RpZmljYXRpb259IG9iamVjdHMsIGVtaXR0ZWQgYXMgYG5leHRgIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10obWF0ZXJpYWxpemUucG5nKVxuICpcbiAqIGBtYXRlcmlhbGl6ZWAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBgbmV4dGAgbm90aWZpY2F0aW9uIGZvciBlYWNoXG4gKiBgbmV4dGAsIGBlcnJvcmAsIG9yIGBjb21wbGV0ZWAgZW1pc3Npb24gb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBXaGVuIHRoZVxuICogc291cmNlIE9ic2VydmFibGUgZW1pdHMgYGNvbXBsZXRlYCwgdGhlIG91dHB1dCBPYnNlcnZhYmxlIHdpbGwgZW1pdCBgbmV4dGAgYXNcbiAqIGEgTm90aWZpY2F0aW9uIG9mIHR5cGUgXCJjb21wbGV0ZVwiLCBhbmQgdGhlbiBpdCB3aWxsIGVtaXQgYGNvbXBsZXRlYCBhcyB3ZWxsLlxuICogV2hlbiB0aGUgc291cmNlIE9ic2VydmFibGUgZW1pdHMgYGVycm9yYCwgdGhlIG91dHB1dCB3aWxsIGVtaXQgYG5leHRgIGFzIGFcbiAqIE5vdGlmaWNhdGlvbiBvZiB0eXBlIFwiZXJyb3JcIiwgYW5kIHRoZW4gYGNvbXBsZXRlYC5cbiAqXG4gKiBUaGlzIG9wZXJhdG9yIGlzIHVzZWZ1bCBmb3IgcHJvZHVjaW5nIG1ldGFkYXRhIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgdG9cbiAqIGJlIGNvbnN1bWVkIGFzIGBuZXh0YCBlbWlzc2lvbnMuIFVzZSBpdCBpbiBjb25qdW5jdGlvbiB3aXRoXG4gKiB7QGxpbmsgZGVtYXRlcmlhbGl6ZX0uXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29udmVydCBhIGZhdWx0eSBPYnNlcnZhYmxlIHRvIGFuIE9ic2VydmFibGUgb2YgTm90aWZpY2F0aW9uc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbGV0dGVycyA9IG9mKCdhJywgJ2InLCAxMywgJ2QnKTtcbiAqIGNvbnN0IHVwcGVyQ2FzZSA9IGxldHRlcnMucGlwZShtYXAoeCA9PiB4LnRvVXBwZXJDYXNlKCkpKTtcbiAqIGNvbnN0IG1hdGVyaWFsaXplZCA9IHVwcGVyQ2FzZS5waXBlKG1hdGVyaWFsaXplKCkpO1xuICogbWF0ZXJpYWxpemVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmc6XG4gKiAvLyAtIE5vdGlmaWNhdGlvbiB7a2luZDogXCJOXCIsIHZhbHVlOiBcIkFcIiwgZXJyb3I6IHVuZGVmaW5lZCwgaGFzVmFsdWU6IHRydWV9XG4gKiAvLyAtIE5vdGlmaWNhdGlvbiB7a2luZDogXCJOXCIsIHZhbHVlOiBcIkJcIiwgZXJyb3I6IHVuZGVmaW5lZCwgaGFzVmFsdWU6IHRydWV9XG4gKiAvLyAtIE5vdGlmaWNhdGlvbiB7a2luZDogXCJFXCIsIHZhbHVlOiB1bmRlZmluZWQsIGVycm9yOiBUeXBlRXJyb3I6XG4gKiAvLyAgIHgudG9VcHBlckNhc2UgaXMgbm90IGEgZnVuY3Rpb24gYXQgTWFwU3Vic2NyaWJlci5sZXR0ZXJzLm1hcC54XG4gKiAvLyAgIFthcyBwcm9qZWN0XSAoaHR0cDovLzHigKYsIGhhc1ZhbHVlOiBmYWxzZX1cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE5vdGlmaWNhdGlvbn1cbiAqIEBzZWUge0BsaW5rIGRlbWF0ZXJpYWxpemV9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxOb3RpZmljYXRpb248VD4+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHNcbiAqIHtAbGluayBOb3RpZmljYXRpb259IG9iamVjdHMgdGhhdCB3cmFwIHRoZSBvcmlnaW5hbCBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIHdpdGggbWV0YWRhdGEuXG4gKiBAbWV0aG9kIG1hdGVyaWFsaXplXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF0ZXJpYWxpemU8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxULCBOb3RpZmljYXRpb248VD4+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1hdGVyaWFsaXplT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IE1hdGVyaWFsaXplT3BlcmF0b3IoKSk7XG4gIH07XG59XG5cbmNsYXNzIE1hdGVyaWFsaXplT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBOb3RpZmljYXRpb248VD4+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE5vdGlmaWNhdGlvbjxUPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgTWF0ZXJpYWxpemVTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgTWF0ZXJpYWxpemVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPE5vdGlmaWNhdGlvbjxUPj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgZGVzdGluYXRpb24ubmV4dChOb3RpZmljYXRpb24uY3JlYXRlRXJyb3IoZXJyKSk7XG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGRlc3RpbmF0aW9uLm5leHQoTm90aWZpY2F0aW9uLmNyZWF0ZUNvbXBsZXRlKCkpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==