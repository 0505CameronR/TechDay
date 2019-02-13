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
var ArgumentOutOfRangeError_1 = require("../util/ArgumentOutOfRangeError");
var empty_1 = require("../observable/empty");
/**
 * Emits only the last `count` values emitted by the source Observable.
 *
 * <span class="informal">Remembers the latest `count` values, then emits those
 * only when the source completes.</span>
 *
 * ![](takeLast.png)
 *
 * `takeLast` returns an Observable that emits at most the last `count` values
 * emitted by the source Observable. If the source emits fewer than `count`
 * values then all of its values are emitted. This operator must wait until the
 * `complete` notification emission from the source in order to emit the `next`
 * values on the output Observable, because otherwise it is impossible to know
 * whether or not more values will be emitted on the source. For this reason,
 * all values are emitted synchronously, followed by the complete notification.
 *
 * ## Example
 * Take the last 3 values of an Observable with many values
 * ```javascript
 * const many = range(1, 100);
 * const lastThree = many.pipe(takeLast(3));
 * lastThree.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `takeLast(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of values to emit from the end of
 * the sequence of values emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits at most the last count
 * values emitted by the source Observable.
 * @method takeLast
 * @owner Observable
 */
function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        if (count === 0) {
            return empty_1.empty();
        }
        else {
            return source.lift(new TakeLastOperator(count));
        }
    };
}
exports.takeLast = takeLast;
var TakeLastOperator = /** @class */ (function () {
    function TakeLastOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeLastOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
    };
    return TakeLastOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeLastSubscriber = /** @class */ (function (_super) {
    __extends(TakeLastSubscriber, _super);
    function TakeLastSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.ring = new Array();
        _this.count = 0;
        return _this;
    }
    TakeLastSubscriber.prototype._next = function (value) {
        var ring = this.ring;
        var total = this.total;
        var count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            var index = count % total;
            ring[index] = value;
        }
    };
    TakeLastSubscriber.prototype._complete = function () {
        var destination = this.destination;
        var count = this.count;
        if (count > 0) {
            var total = this.count >= this.total ? this.total : this.count;
            var ring = this.ring;
            for (var i = 0; i < total; i++) {
                var idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    };
    return TakeLastSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZUxhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90YWtlTGFzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFDM0MsMkVBQTBFO0FBQzFFLDZDQUE0QztBQUk1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxTQUFnQixRQUFRLENBQUksS0FBYTtJQUN2QyxPQUFPLFNBQVMsd0JBQXdCLENBQUMsTUFBcUI7UUFDNUQsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxhQUFLLEVBQUUsQ0FBQztTQUNoQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFSRCw0QkFRQztBQUVEO0lBQ0UsMEJBQW9CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQy9CLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxJQUFJLGlEQUF1QixDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELCtCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQW9DLHNDQUFhO0lBSS9DLDRCQUFZLFdBQTBCLEVBQVUsS0FBYTtRQUE3RCxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUYrQyxXQUFLLEdBQUwsS0FBSyxDQUFRO1FBSHJELFVBQUksR0FBYSxJQUFJLEtBQUssRUFBRSxDQUFDO1FBQzdCLFdBQUssR0FBVyxDQUFDLENBQUM7O0lBSTFCLENBQUM7SUFFUyxrQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUzQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7YUFBTTtZQUNMLElBQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFUyxzQ0FBUyxHQUFuQjtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV2QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDakUsSUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QixJQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzdCO1NBQ0Y7UUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXJDRCxDQUFvQyx1QkFBVSxHQXFDN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9Bcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4uL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIG9ubHkgdGhlIGxhc3QgYGNvdW50YCB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlJlbWVtYmVycyB0aGUgbGF0ZXN0IGBjb3VudGAgdmFsdWVzLCB0aGVuIGVtaXRzIHRob3NlXG4gKiBvbmx5IHdoZW4gdGhlIHNvdXJjZSBjb21wbGV0ZXMuPC9zcGFuPlxuICpcbiAqICFbXSh0YWtlTGFzdC5wbmcpXG4gKlxuICogYHRha2VMYXN0YCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhdCBtb3N0IHRoZSBsYXN0IGBjb3VudGAgdmFsdWVzXG4gKiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgdGhlIHNvdXJjZSBlbWl0cyBmZXdlciB0aGFuIGBjb3VudGBcbiAqIHZhbHVlcyB0aGVuIGFsbCBvZiBpdHMgdmFsdWVzIGFyZSBlbWl0dGVkLiBUaGlzIG9wZXJhdG9yIG11c3Qgd2FpdCB1bnRpbCB0aGVcbiAqIGBjb21wbGV0ZWAgbm90aWZpY2F0aW9uIGVtaXNzaW9uIGZyb20gdGhlIHNvdXJjZSBpbiBvcmRlciB0byBlbWl0IHRoZSBgbmV4dGBcbiAqIHZhbHVlcyBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUsIGJlY2F1c2Ugb3RoZXJ3aXNlIGl0IGlzIGltcG9zc2libGUgdG8ga25vd1xuICogd2hldGhlciBvciBub3QgbW9yZSB2YWx1ZXMgd2lsbCBiZSBlbWl0dGVkIG9uIHRoZSBzb3VyY2UuIEZvciB0aGlzIHJlYXNvbixcbiAqIGFsbCB2YWx1ZXMgYXJlIGVtaXR0ZWQgc3luY2hyb25vdXNseSwgZm9sbG93ZWQgYnkgdGhlIGNvbXBsZXRlIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBUYWtlIHRoZSBsYXN0IDMgdmFsdWVzIG9mIGFuIE9ic2VydmFibGUgd2l0aCBtYW55IHZhbHVlc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbWFueSA9IHJhbmdlKDEsIDEwMCk7XG4gKiBjb25zdCBsYXN0VGhyZWUgPSBtYW55LnBpcGUodGFrZUxhc3QoMykpO1xuICogbGFzdFRocmVlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKiBAc2VlIHtAbGluayB0YWtlVW50aWx9XG4gKiBAc2VlIHtAbGluayB0YWtlV2hpbGV9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICpcbiAqIEB0aHJvd3Mge0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yfSBXaGVuIHVzaW5nIGB0YWtlTGFzdChpKWAsIGl0IGRlbGl2ZXJzIGFuXG4gKiBBcmd1bWVudE91dE9yUmFuZ2VFcnJvciB0byB0aGUgT2JzZXJ2ZXIncyBgZXJyb3JgIGNhbGxiYWNrIGlmIGBpIDwgMGAuXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IFRoZSBtYXhpbXVtIG51bWJlciBvZiB2YWx1ZXMgdG8gZW1pdCBmcm9tIHRoZSBlbmQgb2ZcbiAqIHRoZSBzZXF1ZW5jZSBvZiB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYXQgbW9zdCB0aGUgbGFzdCBjb3VudFxuICogdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCB0YWtlTGFzdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRha2VMYXN0PFQ+KGNvdW50OiBudW1iZXIpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gdGFrZUxhc3RPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIGlmIChjb3VudCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgVGFrZUxhc3RPcGVyYXRvcihjb3VudCkpO1xuICAgIH1cbiAgfTtcbn1cblxuY2xhc3MgVGFrZUxhc3RPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB0b3RhbDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMudG90YWwgPCAwKSB7XG4gICAgICB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3I7XG4gICAgfVxuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBUYWtlTGFzdFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy50b3RhbCkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUYWtlTGFzdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSByaW5nOiBBcnJheTxUPiA9IG5ldyBBcnJheSgpO1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LCBwcml2YXRlIHRvdGFsOiBudW1iZXIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCByaW5nID0gdGhpcy5yaW5nO1xuICAgIGNvbnN0IHRvdGFsID0gdGhpcy50b3RhbDtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMuY291bnQrKztcblxuICAgIGlmIChyaW5nLmxlbmd0aCA8IHRvdGFsKSB7XG4gICAgICByaW5nLnB1c2godmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBpbmRleCA9IGNvdW50ICUgdG90YWw7XG4gICAgICByaW5nW2luZGV4XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGxldCBjb3VudCA9IHRoaXMuY291bnQ7XG5cbiAgICBpZiAoY291bnQgPiAwKSB7XG4gICAgICBjb25zdCB0b3RhbCA9IHRoaXMuY291bnQgPj0gdGhpcy50b3RhbCA/IHRoaXMudG90YWwgOiB0aGlzLmNvdW50O1xuICAgICAgY29uc3QgcmluZyAgPSB0aGlzLnJpbmc7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG90YWw7IGkrKykge1xuICAgICAgICBjb25zdCBpZHggPSAoY291bnQrKykgJSB0b3RhbDtcbiAgICAgICAgZGVzdGluYXRpb24ubmV4dChyaW5nW2lkeF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==