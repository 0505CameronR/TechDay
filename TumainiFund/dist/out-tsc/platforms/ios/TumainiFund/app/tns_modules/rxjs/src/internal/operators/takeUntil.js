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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits a value. Then, it completes.</span>
 *
 * ![](takeUntil.png)
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value, the output Observable stops mirroring the source Observable
 * and completes. If the `notifier` doesn't emit any value and completes
 * then `takeUntil` will pass all values.
 *
 * ## Example
 * Tick every second until the first click happens
 * ```javascript
 * const interval = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = interval.pipe(takeUntil(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
}
exports.takeUntil = takeUntil;
var TakeUntilOperator = /** @class */ (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
        var notifierSubscription = subscribeToResult_1.subscribeToResult(takeUntilSubscriber, this.notifier);
        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
            takeUntilSubscriber.add(notifierSubscription);
            return source.subscribe(takeUntilSubscriber);
        }
        return takeUntilSubscriber;
    };
    return TakeUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeUntilSubscriber = /** @class */ (function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.seenValue = false;
        return _this;
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.seenValue = true;
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVVudGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2VVbnRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFJQSxzREFBcUQ7QUFFckQsK0RBQThEO0FBSTlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ0c7QUFDSCxTQUFnQixTQUFTLENBQUksUUFBeUI7SUFDcEQsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBNUMsQ0FBNEMsQ0FBQztBQUNqRixDQUFDO0FBRkQsOEJBRUM7QUFFRDtJQUNFLDJCQUFvQixRQUF5QjtRQUF6QixhQUFRLEdBQVIsUUFBUSxDQUFpQjtJQUM3QyxDQUFDO0lBRUQsZ0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxJQUFNLG1CQUFtQixHQUFHLElBQUksbUJBQW1CLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDaEUsSUFBTSxvQkFBb0IsR0FBRyxxQ0FBaUIsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDbkYsSUFBSSxvQkFBb0IsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRTtZQUMxRCxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUM5QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsbUJBQW1CLENBQUMsQ0FBQztTQUM5QztRQUNELE9BQU8sbUJBQW1CLENBQUM7SUFDN0IsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQWJELElBYUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBd0MsdUNBQXFCO0lBRzNELDZCQUFZLFdBQTRCO1FBQXhDLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSkQsZUFBUyxHQUFHLEtBQUssQ0FBQzs7SUFJbEIsQ0FBQztJQUVELHdDQUFVLEdBQVYsVUFBVyxVQUFhLEVBQUUsVUFBYSxFQUM1QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNsQixDQUFDO0lBRUQsNENBQWMsR0FBZDtRQUNFLE9BQU87SUFDVCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBakJELENBQXdDLGlDQUFlLEdBaUJ0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyB0aGUgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHVudGlsIGEgYG5vdGlmaWVyYFxuICogT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5MZXRzIHZhbHVlcyBwYXNzIHVudGlsIGEgc2Vjb25kIE9ic2VydmFibGUsXG4gKiBgbm90aWZpZXJgLCBlbWl0cyBhIHZhbHVlLiBUaGVuLCBpdCBjb21wbGV0ZXMuPC9zcGFuPlxuICpcbiAqICFbXSh0YWtlVW50aWwucG5nKVxuICpcbiAqIGB0YWtlVW50aWxgIHN1YnNjcmliZXMgYW5kIGJlZ2lucyBtaXJyb3JpbmcgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJdCBhbHNvXG4gKiBtb25pdG9ycyBhIHNlY29uZCBPYnNlcnZhYmxlLCBgbm90aWZpZXJgIHRoYXQgeW91IHByb3ZpZGUuIElmIHRoZSBgbm90aWZpZXJgXG4gKiBlbWl0cyBhIHZhbHVlLCB0aGUgb3V0cHV0IE9ic2VydmFibGUgc3RvcHMgbWlycm9yaW5nIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogYW5kIGNvbXBsZXRlcy4gSWYgdGhlIGBub3RpZmllcmAgZG9lc24ndCBlbWl0IGFueSB2YWx1ZSBhbmQgY29tcGxldGVzXG4gKiB0aGVuIGB0YWtlVW50aWxgIHdpbGwgcGFzcyBhbGwgdmFsdWVzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFRpY2sgZXZlcnkgc2Vjb25kIHVudGlsIHRoZSBmaXJzdCBjbGljayBoYXBwZW5zXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBpbnRlcnZhbCA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGludGVydmFsLnBpcGUodGFrZVVudGlsKGNsaWNrcykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKiBAc2VlIHtAbGluayB0YWtlTGFzdH1cbiAqIEBzZWUge0BsaW5rIHRha2VXaGlsZX1cbiAqIEBzZWUge0BsaW5rIHNraXB9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBub3RpZmllciBUaGUgT2JzZXJ2YWJsZSB3aG9zZSBmaXJzdCBlbWl0dGVkIHZhbHVlIHdpbGxcbiAqIGNhdXNlIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvZiBgdGFrZVVudGlsYCB0byBzdG9wIGVtaXR0aW5nIHZhbHVlcyBmcm9tIHRoZVxuICogc291cmNlIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgdW50aWwgc3VjaCB0aW1lIGFzIGBub3RpZmllcmAgZW1pdHMgaXRzIGZpcnN0IHZhbHVlLlxuICogQG1ldGhvZCB0YWtlVW50aWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YWtlVW50aWw8VD4obm90aWZpZXI6IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgVGFrZVVudGlsT3BlcmF0b3Iobm90aWZpZXIpKTtcbn1cblxuY2xhc3MgVGFrZVVudGlsT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpZXI6IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIGNvbnN0IHRha2VVbnRpbFN1YnNjcmliZXIgPSBuZXcgVGFrZVVudGlsU3Vic2NyaWJlcihzdWJzY3JpYmVyKTtcbiAgICBjb25zdCBub3RpZmllclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRha2VVbnRpbFN1YnNjcmliZXIsIHRoaXMubm90aWZpZXIpO1xuICAgIGlmIChub3RpZmllclN1YnNjcmlwdGlvbiAmJiAhdGFrZVVudGlsU3Vic2NyaWJlci5zZWVuVmFsdWUpIHtcbiAgICAgIHRha2VVbnRpbFN1YnNjcmliZXIuYWRkKG5vdGlmaWVyU3Vic2NyaXB0aW9uKTtcbiAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKHRha2VVbnRpbFN1YnNjcmliZXIpO1xuICAgIH1cbiAgICByZXR1cm4gdGFrZVVudGlsU3Vic2NyaWJlcjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGFrZVVudGlsU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHNlZW5WYWx1ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPGFueT4sICkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5zZWVuVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIC8vIG5vb3BcbiAgfVxufVxuIl19