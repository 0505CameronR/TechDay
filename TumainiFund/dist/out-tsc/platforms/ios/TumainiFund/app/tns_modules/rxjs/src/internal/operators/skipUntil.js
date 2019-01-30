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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcFVudGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3NraXBVbnRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzREFBcUQ7QUFDckQsc0RBQXFEO0FBQ3JELCtEQUE4RDtBQUk5RDs7Ozs7Ozs7Ozs7R0FXRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxRQUF5QjtJQUNwRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDO0FBQ2pGLENBQUM7QUFGRCw4QkFFQztBQUVEO0lBQ0UsMkJBQW9CLFFBQXlCO1FBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO0lBQzdDLENBQUM7SUFFRCxnQ0FBSSxHQUFKLFVBQUssV0FBMEIsRUFBRSxNQUFXO1FBQzFDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUMvRSxDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF3Qyx1Q0FBcUI7SUFLM0QsNkJBQVksV0FBMEIsRUFBRSxRQUE4QjtRQUF0RSxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUtuQjtRQVRPLGNBQVEsR0FBWSxLQUFLLENBQUM7UUFLaEMsSUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLEtBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDeEUsS0FBSSxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUMxQixLQUFJLENBQUMsaUJBQWlCLEdBQUcsZUFBZSxDQUFDO1FBQ3pDLHFDQUFpQixDQUFDLEtBQUksRUFBRSxRQUFRLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxlQUFlLENBQUMsQ0FBQzs7SUFDM0UsQ0FBQztJQUVTLG1DQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsaUJBQU0sS0FBSyxZQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELHdDQUFVLEdBQVYsVUFBVyxVQUFhLEVBQUUsVUFBYSxFQUM1QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRCw0Q0FBYyxHQUFkO1FBQ0UsZ0JBQWdCO0lBQ2xCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUEvQkQsQ0FBd0MsaUNBQWUsR0ErQnREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMsIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgc2tpcHMgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdW50aWwgYSBzZWNvbmQgT2JzZXJ2YWJsZSBlbWl0cyBhbiBpdGVtLlxuICpcbiAqICFbXShza2lwVW50aWwucG5nKVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gbm90aWZpZXIgLSBUaGUgc2Vjb25kIE9ic2VydmFibGUgdGhhdCBoYXMgdG8gZW1pdCBhbiBpdGVtIGJlZm9yZSB0aGUgc291cmNlIE9ic2VydmFibGUncyBlbGVtZW50cyBiZWdpbiB0b1xuICogYmUgbWlycm9yZWQgYnkgdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IHNraXBzIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHVudGlsIHRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBlbWl0c1xuICogYW4gaXRlbSwgdGhlbiBlbWl0cyB0aGUgcmVtYWluaW5nIGl0ZW1zLlxuICogQG1ldGhvZCBza2lwVW50aWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBza2lwVW50aWw8VD4obm90aWZpZXI6IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2tpcFVudGlsT3BlcmF0b3Iobm90aWZpZXIpKTtcbn1cblxuY2xhc3MgU2tpcFVudGlsT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpZXI6IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU2tpcFVudGlsU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgdGhpcy5ub3RpZmllcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTa2lwVW50aWxTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIGhhc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgaW5uZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPiwgbm90aWZpZXI6IE9ic2VydmFibGVJbnB1dDxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGNvbnN0IGlubmVyU3Vic2NyaWJlciA9IG5ldyBJbm5lclN1YnNjcmliZXIodGhpcywgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgIHRoaXMuYWRkKGlubmVyU3Vic2NyaWJlcik7XG4gICAgdGhpcy5pbm5lclN1YnNjcmlwdGlvbiA9IGlubmVyU3Vic2NyaWJlcjtcbiAgICBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBub3RpZmllciwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGlubmVyU3Vic2NyaWJlcik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy5oYXNWYWx1ZSkge1xuICAgICAgc3VwZXIuX25leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gICAgaWYgKHRoaXMuaW5uZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuaW5uZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpIHtcbiAgICAvKiBkbyBub3RoaW5nICovXG4gIH1cbn1cbiJdfQ==