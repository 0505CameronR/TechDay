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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0ZXJpYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvbWF0ZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUcvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThDRztBQUNILFNBQWdCLFdBQVc7SUFDekIsT0FBTyxTQUFTLDJCQUEyQixDQUFDLE1BQXFCO1FBQy9ELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixFQUFFLENBQUMsQ0FBQztJQUNoRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBSkQsa0NBSUM7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUhDLGtDQUFJLEdBQUosVUFBSyxVQUF1QyxFQUFFLE1BQVc7UUFDdkQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUkscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF1Qyx5Q0FBYTtJQUNsRCwrQkFBWSxXQUF3QztlQUNsRCxrQkFBTSxXQUFXLENBQUM7SUFDcEIsQ0FBQztJQUVTLHFDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQywyQkFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFFUyxzQ0FBTSxHQUFoQixVQUFpQixHQUFRO1FBQ3ZCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsV0FBVyxDQUFDLElBQUksQ0FBQywyQkFBWSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ2hELFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRVMseUNBQVMsR0FBbkI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLFdBQVcsQ0FBQyxJQUFJLENBQUMsMkJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ2hELFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBcEJELENBQXVDLHVCQUFVLEdBb0JoRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhbGwgb2YgdGhlIG5vdGlmaWNhdGlvbnMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgYXMgYG5leHRgXG4gKiBlbWlzc2lvbnMgbWFya2VkIHdpdGggdGhlaXIgb3JpZ2luYWwgdHlwZXMgd2l0aGluIHtAbGluayBOb3RpZmljYXRpb259XG4gKiBvYmplY3RzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XcmFwcyBgbmV4dGAsIGBlcnJvcmAgYW5kIGBjb21wbGV0ZWAgZW1pc3Npb25zIGluXG4gKiB7QGxpbmsgTm90aWZpY2F0aW9ufSBvYmplY3RzLCBlbWl0dGVkIGFzIGBuZXh0YCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKG1hdGVyaWFsaXplLnBuZylcbiAqXG4gKiBgbWF0ZXJpYWxpemVgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgYG5leHRgIG5vdGlmaWNhdGlvbiBmb3IgZWFjaFxuICogYG5leHRgLCBgZXJyb3JgLCBvciBgY29tcGxldGVgIGVtaXNzaW9uIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gV2hlbiB0aGVcbiAqIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIGBjb21wbGV0ZWAsIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSB3aWxsIGVtaXQgYG5leHRgIGFzXG4gKiBhIE5vdGlmaWNhdGlvbiBvZiB0eXBlIFwiY29tcGxldGVcIiwgYW5kIHRoZW4gaXQgd2lsbCBlbWl0IGBjb21wbGV0ZWAgYXMgd2VsbC5cbiAqIFdoZW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIGBlcnJvcmAsIHRoZSBvdXRwdXQgd2lsbCBlbWl0IGBuZXh0YCBhcyBhXG4gKiBOb3RpZmljYXRpb24gb2YgdHlwZSBcImVycm9yXCIsIGFuZCB0aGVuIGBjb21wbGV0ZWAuXG4gKlxuICogVGhpcyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIHByb2R1Y2luZyBtZXRhZGF0YSBvZiB0aGUgc291cmNlIE9ic2VydmFibGUsIHRvXG4gKiBiZSBjb25zdW1lZCBhcyBgbmV4dGAgZW1pc3Npb25zLiBVc2UgaXQgaW4gY29uanVuY3Rpb24gd2l0aFxuICoge0BsaW5rIGRlbWF0ZXJpYWxpemV9LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbnZlcnQgYSBmYXVsdHkgT2JzZXJ2YWJsZSB0byBhbiBPYnNlcnZhYmxlIG9mIE5vdGlmaWNhdGlvbnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGxldHRlcnMgPSBvZignYScsICdiJywgMTMsICdkJyk7XG4gKiBjb25zdCB1cHBlckNhc2UgPSBsZXR0ZXJzLnBpcGUobWFwKHggPT4geC50b1VwcGVyQ2FzZSgpKSk7XG4gKiBjb25zdCBtYXRlcmlhbGl6ZWQgPSB1cHBlckNhc2UucGlwZShtYXRlcmlhbGl6ZSgpKTtcbiAqIG1hdGVyaWFsaXplZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nOlxuICogLy8gLSBOb3RpZmljYXRpb24ge2tpbmQ6IFwiTlwiLCB2YWx1ZTogXCJBXCIsIGVycm9yOiB1bmRlZmluZWQsIGhhc1ZhbHVlOiB0cnVlfVxuICogLy8gLSBOb3RpZmljYXRpb24ge2tpbmQ6IFwiTlwiLCB2YWx1ZTogXCJCXCIsIGVycm9yOiB1bmRlZmluZWQsIGhhc1ZhbHVlOiB0cnVlfVxuICogLy8gLSBOb3RpZmljYXRpb24ge2tpbmQ6IFwiRVwiLCB2YWx1ZTogdW5kZWZpbmVkLCBlcnJvcjogVHlwZUVycm9yOlxuICogLy8gICB4LnRvVXBwZXJDYXNlIGlzIG5vdCBhIGZ1bmN0aW9uIGF0IE1hcFN1YnNjcmliZXIubGV0dGVycy5tYXAueFxuICogLy8gICBbYXMgcHJvamVjdF0gKGh0dHA6Ly8x4oCmLCBoYXNWYWx1ZTogZmFsc2V9XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBOb3RpZmljYXRpb259XG4gKiBAc2VlIHtAbGluayBkZW1hdGVyaWFsaXplfVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGU8Tm90aWZpY2F0aW9uPFQ+Pn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzXG4gKiB7QGxpbmsgTm90aWZpY2F0aW9ufSBvYmplY3RzIHRoYXQgd3JhcCB0aGUgb3JpZ2luYWwgZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSB3aXRoIG1ldGFkYXRhLlxuICogQG1ldGhvZCBtYXRlcmlhbGl6ZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1hdGVyaWFsaXplPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgTm90aWZpY2F0aW9uPFQ+PiB7XG4gIHJldHVybiBmdW5jdGlvbiBtYXRlcmlhbGl6ZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBNYXRlcmlhbGl6ZU9wZXJhdG9yKCkpO1xuICB9O1xufVxuXG5jbGFzcyBNYXRlcmlhbGl6ZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgTm90aWZpY2F0aW9uPFQ+PiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxOb3RpZmljYXRpb248VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE1hdGVyaWFsaXplU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIE1hdGVyaWFsaXplU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxOb3RpZmljYXRpb248VD4+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KSB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGRlc3RpbmF0aW9uLm5leHQoTm90aWZpY2F0aW9uLmNyZWF0ZUVycm9yKGVycikpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5uZXh0KE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpKTtcbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=