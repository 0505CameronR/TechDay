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
var InnerSubscriber_1 = require("../InnerSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Returns an Observable that skips items emitted by the source Observable until a second Observable emits an item.
 *
 * ![](skipUntil.png)
 *
 * @param {Observable} notifier - The second Observable that has to emit an item before the source Observable's elements begin to
 * be mirrored by the resulting Observable.
 * @return {Observable<T>} An Observable that skips items from the source Observable until the second Observable emits
 * an item, then emits the remaining items.
 * @method skipUntil
 * @owner Observable
 */
function skipUntil(notifier) {
    return function (source) { return source.lift(new SkipUntilOperator(notifier)); };
}
exports.skipUntil = skipUntil;
var SkipUntilOperator = /** @class */ (function () {
    function SkipUntilOperator(notifier) {
        this.notifier = notifier;
    }
    SkipUntilOperator.prototype.call = function (destination, source) {
        return source.subscribe(new SkipUntilSubscriber(destination, this.notifier));
    };
    return SkipUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipUntilSubscriber = /** @class */ (function (_super) {
    __extends(SkipUntilSubscriber, _super);
    function SkipUntilSubscriber(destination, notifier) {
        var _this = _super.call(this, destination) || this;
        _this.hasValue = false;
        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(_this, undefined, undefined);
        _this.add(innerSubscriber);
        _this.innerSubscription = innerSubscriber;
        subscribeToResult_1.subscribeToResult(_this, notifier, undefined, undefined, innerSubscriber);
        return _this;
    }
    SkipUntilSubscriber.prototype._next = function (value) {
        if (this.hasValue) {
            _super.prototype._next.call(this, value);
        }
    };
    SkipUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.hasValue = true;
        if (this.innerSubscription) {
            this.innerSubscription.unsubscribe();
        }
    };
    SkipUntilSubscriber.prototype.notifyComplete = function () {
        /* do nothing */
    };
    return SkipUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcFVudGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcFVudGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNEQUFxRDtBQUNyRCxzREFBcUQ7QUFDckQsK0RBQThEO0FBSTlEOzs7Ozs7Ozs7OztHQVdHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFJLFFBQXlCO0lBQ3BELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTVDLENBQTRDLENBQUM7QUFDakYsQ0FBQztBQUZELDhCQUVDO0FBRUQ7SUFDRSwyQkFBb0IsUUFBeUI7UUFBekIsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDN0MsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxXQUEwQixFQUFFLE1BQVc7UUFDMUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksbUJBQW1CLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLHVDQUFxQjtJQUszRCw2QkFBWSxXQUEwQixFQUFFLFFBQThCO1FBQXRFLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBS25CO1FBVE8sY0FBUSxHQUFZLEtBQUssQ0FBQztRQUtoQyxJQUFNLGVBQWUsR0FBRyxJQUFJLGlDQUFlLENBQUMsS0FBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUN4RSxLQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzFCLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxlQUFlLENBQUM7UUFDekMscUNBQWlCLENBQUMsS0FBSSxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDOztJQUMzRSxDQUFDO0lBRVMsbUNBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixpQkFBTSxLQUFLLFlBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3RDO0lBQ0gsQ0FBQztJQUVELDRDQUFjLEdBQWQ7UUFDRSxnQkFBZ0I7SUFDbEIsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQS9CRCxDQUF3QyxpQ0FBZSxHQStCdEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYywgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBza2lwcyBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB1bnRpbCBhIHNlY29uZCBPYnNlcnZhYmxlIGVtaXRzIGFuIGl0ZW0uXG4gKlxuICogIVtdKHNraXBVbnRpbC5wbmcpXG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBub3RpZmllciAtIFRoZSBzZWNvbmQgT2JzZXJ2YWJsZSB0aGF0IGhhcyB0byBlbWl0IGFuIGl0ZW0gYmVmb3JlIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSdzIGVsZW1lbnRzIGJlZ2luIHRvXG4gKiBiZSBtaXJyb3JlZCBieSB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgc2tpcHMgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgdW50aWwgdGhlIHNlY29uZCBPYnNlcnZhYmxlIGVtaXRzXG4gKiBhbiBpdGVtLCB0aGVuIGVtaXRzIHRoZSByZW1haW5pbmcgaXRlbXMuXG4gKiBAbWV0aG9kIHNraXBVbnRpbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNraXBVbnRpbDxUPihub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTa2lwVW50aWxPcGVyYXRvcihub3RpZmllcikpO1xufVxuXG5jbGFzcyBTa2lwVW50aWxPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTa2lwVW50aWxTdWJzY3JpYmVyKGRlc3RpbmF0aW9uLCB0aGlzLm5vdGlmaWVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNraXBVbnRpbFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuXG4gIHByaXZhdGUgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbm5lclN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LCBub3RpZmllcjogT2JzZXJ2YWJsZUlucHV0PGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgY29uc3QgaW5uZXJTdWJzY3JpYmVyID0gbmV3IElubmVyU3Vic2NyaWJlcih0aGlzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgdGhpcy5hZGQoaW5uZXJTdWJzY3JpYmVyKTtcbiAgICB0aGlzLmlubmVyU3Vic2NyaXB0aW9uID0gaW5uZXJTdWJzY3JpYmVyO1xuICAgIHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG5vdGlmaWVyLCB1bmRlZmluZWQsIHVuZGVmaW5lZCwgaW5uZXJTdWJzY3JpYmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICBzdXBlci5fbmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmhhc1ZhbHVlID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5pbm5lclN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5pbm5lclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCkge1xuICAgIC8qIGRvIG5vdGhpbmcgKi9cbiAgfVxufVxuIl19