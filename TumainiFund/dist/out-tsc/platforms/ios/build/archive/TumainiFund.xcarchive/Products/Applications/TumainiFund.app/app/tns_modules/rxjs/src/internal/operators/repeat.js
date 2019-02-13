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
var empty_1 = require("../observable/empty");
/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times.
 *
 * ![](repeat.png)
 *
 * @param {number} [count] The number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} An Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
function repeat(count) {
    if (count === void 0) { count = -1; }
    return function (source) {
        if (count === 0) {
            return empty_1.empty();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
exports.repeat = repeat;
var RepeatOperator = /** @class */ (function () {
    function RepeatOperator(count, source) {
        this.count = count;
        this.source = source;
    }
    RepeatOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    };
    return RepeatOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatSubscriber = /** @class */ (function (_super) {
    __extends(RepeatSubscriber, _super);
    function RepeatSubscriber(destination, count, source) {
        var _this = _super.call(this, destination) || this;
        _this.count = count;
        _this.source = source;
        return _this;
    }
    RepeatSubscriber.prototype.complete = function () {
        if (!this.isStopped) {
            var _a = this, source = _a.source, count = _a.count;
            if (count === 0) {
                return _super.prototype.complete.call(this);
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    };
    return RepeatSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcmVwZWF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUUzQyw2Q0FBNEM7QUFHNUM7Ozs7Ozs7Ozs7O0dBV0c7QUFDSCxTQUFnQixNQUFNLENBQUksS0FBa0I7SUFBbEIsc0JBQUEsRUFBQSxTQUFpQixDQUFDO0lBQzFDLE9BQU8sVUFBQyxNQUFxQjtRQUMzQixJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDZixPQUFPLGFBQUssRUFBRSxDQUFDO1NBQ2hCO2FBQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ3BCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQ3BEO2FBQU07WUFDTCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsS0FBSyxHQUFHLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO1NBQzNEO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVZELHdCQVVDO0FBRUQ7SUFDRSx3QkFBb0IsS0FBYSxFQUNiLE1BQXFCO1FBRHJCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQ3pDLENBQUM7SUFDRCw2QkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQWtDLG9DQUFhO0lBQzdDLDBCQUFZLFdBQTRCLEVBQ3BCLEtBQWEsRUFDYixNQUFxQjtRQUZ6QyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUhtQixXQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsWUFBTSxHQUFOLE1BQU0sQ0FBZTs7SUFFekMsQ0FBQztJQUNELG1DQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNiLElBQUEsU0FBd0IsRUFBdEIsa0JBQU0sRUFBRSxnQkFBYyxDQUFDO1lBQy9CLElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtnQkFDZixPQUFPLGlCQUFNLFFBQVEsV0FBRSxDQUFDO2FBQ3pCO2lCQUFNLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDeEI7WUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBakJELENBQWtDLHVCQUFVLEdBaUIzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCByZXBlYXRzIHRoZSBzdHJlYW0gb2YgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYXQgbW9zdCBjb3VudCB0aW1lcy5cbiAqXG4gKiAhW10ocmVwZWF0LnBuZylcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvdW50XSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBpdGVtcyBhcmUgcmVwZWF0ZWQsIGEgY291bnQgb2YgMCB3aWxsIHlpZWxkXG4gKiBhbiBlbXB0eSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IHJlcGVhdHMgdGhlIHN0cmVhbSBvZiBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhdCBtb3N0XG4gKiBjb3VudCB0aW1lcy5cbiAqIEBtZXRob2QgcmVwZWF0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0PFQ+KGNvdW50OiBudW1iZXIgPSAtMSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICB9IGVsc2UgaWYgKGNvdW50IDwgMCkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBSZXBlYXRPcGVyYXRvcigtMSwgc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgUmVwZWF0T3BlcmF0b3IoY291bnQgLSAxLCBzb3VyY2UpKTtcbiAgICB9XG4gIH07XG59XG5cbmNsYXNzIFJlcGVhdE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBSZXBlYXRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY291bnQsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFJlcGVhdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBjb21wbGV0ZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IHNvdXJjZSwgY291bnQgfSA9IHRoaXM7XG4gICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgICB9IGVsc2UgaWYgKGNvdW50ID4gLTEpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IGNvdW50IC0gMTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZS5zdWJzY3JpYmUodGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCkpO1xuICAgIH1cbiAgfVxufVxuIl19