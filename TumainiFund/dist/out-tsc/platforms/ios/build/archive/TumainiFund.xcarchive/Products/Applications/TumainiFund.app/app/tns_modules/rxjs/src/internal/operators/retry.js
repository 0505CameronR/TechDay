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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9yZXRyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFLM0M7Ozs7Ozs7Ozs7Ozs7OztHQWVHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFJLEtBQWtCO0lBQWxCLHNCQUFBLEVBQUEsU0FBaUIsQ0FBQztJQUN6QyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQTdDLENBQTZDLENBQUM7QUFDbEYsQ0FBQztBQUZELHNCQUVDO0FBRUQ7SUFDRSx1QkFBb0IsS0FBYSxFQUNiLE1BQXFCO1FBRHJCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQ3pDLENBQUM7SUFFRCw0QkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFpQyxtQ0FBYTtJQUM1Qyx5QkFBWSxXQUE0QixFQUNwQixLQUFhLEVBQ2IsTUFBcUI7UUFGekMsWUFHRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFIbUIsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFlBQU0sR0FBTixNQUFNLENBQWU7O0lBRXpDLENBQUM7SUFDRCwrQkFBSyxHQUFMLFVBQU0sR0FBUTtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2IsSUFBQSxTQUF3QixFQUF0QixrQkFBTSxFQUFFLGdCQUFjLENBQUM7WUFDL0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO2dCQUNmLE9BQU8saUJBQU0sS0FBSyxZQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ3pCO2lCQUFNLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO2dCQUNyQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7YUFDeEI7WUFDRCxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBakJELENBQWlDLHVCQUFVLEdBaUIxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGFuIGBlcnJvcmAuIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogY2FsbHMgYGVycm9yYCwgdGhpcyBtZXRob2Qgd2lsbCByZXN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUgZm9yIGEgbWF4aW11bSBvZiBgY291bnRgIHJlc3Vic2NyaXB0aW9ucyAoZ2l2ZW5cbiAqIGFzIGEgbnVtYmVyIHBhcmFtZXRlcikgcmF0aGVyIHRoYW4gcHJvcGFnYXRpbmcgdGhlIGBlcnJvcmAgY2FsbC5cbiAqXG4gKiAhW10ocmV0cnkucG5nKVxuICpcbiAqIEFueSBhbmQgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpbGwgYmUgZW1pdHRlZCBieSB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGUsIGV2ZW4gdGhvc2UgZW1pdHRlZFxuICogZHVyaW5nIGZhaWxlZCBzdWJzY3JpcHRpb25zLiBGb3IgZXhhbXBsZSwgaWYgYW4gT2JzZXJ2YWJsZSBmYWlscyBhdCBmaXJzdCBidXQgZW1pdHMgWzEsIDJdIHRoZW4gc3VjY2VlZHMgdGhlIHNlY29uZFxuICogdGltZSBhbmQgZW1pdHM6IFsxLCAyLCAzLCA0LCA1XSB0aGVuIHRoZSBjb21wbGV0ZSBzdHJlYW0gb2YgZW1pc3Npb25zIGFuZCBub3RpZmljYXRpb25zXG4gKiB3b3VsZCBiZTogWzEsIDIsIDEsIDIsIDMsIDQsIDUsIGBjb21wbGV0ZWBdLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IC0gTnVtYmVyIG9mIHJldHJ5IGF0dGVtcHRzIGJlZm9yZSBmYWlsaW5nLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBPYnNlcnZhYmxlIG1vZGlmaWVkIHdpdGggdGhlIHJldHJ5IGxvZ2ljLlxuICogQG1ldGhvZCByZXRyeVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5PFQ+KGNvdW50OiBudW1iZXIgPSAtMSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgUmV0cnlPcGVyYXRvcihjb3VudCwgc291cmNlKSk7XG59XG5cbmNsYXNzIFJldHJ5T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY291bnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmV0cnlTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY291bnQsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFJldHJ5U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBzb3VyY2UsIGNvdW50IH0gPSB0aGlzO1xuICAgICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICAgIHJldHVybiBzdXBlci5lcnJvcihlcnIpO1xuICAgICAgfSBlbHNlIGlmIChjb3VudCA+IC0xKSB7XG4gICAgICAgIHRoaXMuY291bnQgPSBjb3VudCAtIDE7XG4gICAgICB9XG4gICAgICBzb3VyY2Uuc3Vic2NyaWJlKHRoaXMuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==