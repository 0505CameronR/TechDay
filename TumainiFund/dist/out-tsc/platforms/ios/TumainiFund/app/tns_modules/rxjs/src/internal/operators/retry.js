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
/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will resubscribe to the source Observable for a maximum of `count` resubscriptions (given
 * as a number parameter) rather than propagating the `error` call.
 *
 * ![](retry.png)
 *
 * Any and all items emitted by the source Observable will be emitted by the resulting Observable, even those emitted
 * during failed subscriptions. For example, if an Observable fails at first but emits [1, 2] then succeeds the second
 * time and emits: [1, 2, 3, 4, 5] then the complete stream of emissions and notifications
 * would be: [1, 2, 1, 2, 3, 4, 5, `complete`].
 * @param {number} count - Number of retry attempts before failing.
 * @return {Observable} The source Observable modified with the retry logic.
 * @method retry
 * @owner Observable
 */
function retry(count) {
    if (count === void 0) { count = -1; }
    return function (source) { return source.lift(new RetryOperator(count, source)); };
}
exports.retry = retry;
var RetryOperator = /** @class */ (function () {
    function RetryOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RetryOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetrySubscriber(subscriber, this.count, this.source));
    };
    return RetryOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetrySubscriber = /** @class */ (function (_super) {
    __extends(RetrySubscriber, _super);
    function RetrySubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RetrySubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.error.call(this, err);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RetrySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBSzNDOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQUNILFNBQWdCLEtBQUssQ0FBSSxLQUFrQjtJQUFsQixzQkFBQSxFQUFBLFNBQWlCLENBQUM7SUFDekMsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUE3QyxDQUE2QyxDQUFDO0FBQ2xGLENBQUM7QUFGRCxzQkFFQztBQUVEO0lBQ0UsdUJBQW9CLEtBQWEsRUFDYixNQUFxQjtRQURyQixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsV0FBTSxHQUFOLE1BQU0sQ0FBZTtJQUN6QyxDQUFDO0lBRUQsNEJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDcEYsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBaUMsbUNBQWE7SUFDNUMseUJBQVksV0FBNEIsRUFDcEIsS0FBYSxFQUNiLE1BQXFCO1FBRnpDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLFdBQUssR0FBTCxLQUFLLENBQVE7UUFDYixZQUFNLEdBQU4sTUFBTSxDQUFlOztJQUV6QyxDQUFDO0lBQ0QsK0JBQUssR0FBTCxVQUFNLEdBQVE7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNiLElBQUEsU0FBd0IsRUFBdEIsa0JBQU0sRUFBRSxnQkFBYyxDQUFDO1lBQy9CLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDZixPQUFPLGlCQUFNLEtBQUssWUFBQyxHQUFHLENBQUMsQ0FBQzthQUN6QjtpQkFBTSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtnQkFDckIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO2FBQ3hCO1lBQ0QsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQWpCRCxDQUFpQyx1QkFBVSxHQWlCMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBhbiBgZXJyb3JgLiBJZiB0aGUgc291cmNlIE9ic2VydmFibGVcbiAqIGNhbGxzIGBlcnJvcmAsIHRoaXMgbWV0aG9kIHdpbGwgcmVzdWJzY3JpYmUgdG8gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGZvciBhIG1heGltdW0gb2YgYGNvdW50YCByZXN1YnNjcmlwdGlvbnMgKGdpdmVuXG4gKiBhcyBhIG51bWJlciBwYXJhbWV0ZXIpIHJhdGhlciB0aGFuIHByb3BhZ2F0aW5nIHRoZSBgZXJyb3JgIGNhbGwuXG4gKlxuICogIVtdKHJldHJ5LnBuZylcbiAqXG4gKiBBbnkgYW5kIGFsbCBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aWxsIGJlIGVtaXR0ZWQgYnkgdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLCBldmVuIHRob3NlIGVtaXR0ZWRcbiAqIGR1cmluZyBmYWlsZWQgc3Vic2NyaXB0aW9ucy4gRm9yIGV4YW1wbGUsIGlmIGFuIE9ic2VydmFibGUgZmFpbHMgYXQgZmlyc3QgYnV0IGVtaXRzIFsxLCAyXSB0aGVuIHN1Y2NlZWRzIHRoZSBzZWNvbmRcbiAqIHRpbWUgYW5kIGVtaXRzOiBbMSwgMiwgMywgNCwgNV0gdGhlbiB0aGUgY29tcGxldGUgc3RyZWFtIG9mIGVtaXNzaW9ucyBhbmQgbm90aWZpY2F0aW9uc1xuICogd291bGQgYmU6IFsxLCAyLCAxLCAyLCAzLCA0LCA1LCBgY29tcGxldGVgXS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCAtIE51bWJlciBvZiByZXRyeSBhdHRlbXB0cyBiZWZvcmUgZmFpbGluZy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IFRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBtb2RpZmllZCB3aXRoIHRoZSByZXRyeSBsb2dpYy5cbiAqIEBtZXRob2QgcmV0cnlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXRyeTxUPihjb3VudDogbnVtYmVyID0gLTEpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFJldHJ5T3BlcmF0b3IoY291bnQsIHNvdXJjZSkpO1xufVxuXG5jbGFzcyBSZXRyeU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFJldHJ5U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNvdW50LCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBSZXRyeVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgc291cmNlLCBjb3VudCB9ID0gdGhpcztcbiAgICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuZXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSBpZiAoY291bnQgPiAtMSkge1xuICAgICAgICB0aGlzLmNvdW50ID0gY291bnQgLSAxO1xuICAgICAgfVxuICAgICAgc291cmNlLnN1YnNjcmliZSh0aGlzLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKSk7XG4gICAgfVxuICB9XG59XG4iXX0=