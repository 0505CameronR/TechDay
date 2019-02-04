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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZUxhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZUxhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBQzNDLDJFQUEwRTtBQUMxRSw2Q0FBNEM7QUFJNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0NHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFJLEtBQWE7SUFDdkMsT0FBTyxTQUFTLHdCQUF3QixDQUFDLE1BQXFCO1FBQzVELElBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtZQUNmLE9BQU8sYUFBSyxFQUFFLENBQUM7U0FDaEI7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDakQ7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBUkQsNEJBUUM7QUFFRDtJQUNFLDBCQUFvQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxpREFBdUIsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBVkQsSUFVQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFvQyxzQ0FBYTtJQUkvQyw0QkFBWSxXQUEwQixFQUFVLEtBQWE7UUFBN0QsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFGK0MsV0FBSyxHQUFMLEtBQUssQ0FBUTtRQUhyRCxVQUFJLEdBQWEsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUM3QixXQUFLLEdBQVcsQ0FBQyxDQUFDOztJQUkxQixDQUFDO0lBRVMsa0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUN6QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssRUFBRTtZQUN2QixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2xCO2FBQU07WUFDTCxJQUFNLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQzVCLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRVMsc0NBQVMsR0FBbkI7UUFDRSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFdkIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2IsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ2pFLElBQU0sSUFBSSxHQUFJLElBQUksQ0FBQyxJQUFJLENBQUM7WUFFeEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDOUIsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQzthQUM3QjtTQUNGO1FBRUQsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFyQ0QsQ0FBb0MsdUJBQVUsR0FxQzdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciB9IGZyb20gJy4uL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyBvbmx5IHRoZSBsYXN0IGBjb3VudGAgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5SZW1lbWJlcnMgdGhlIGxhdGVzdCBgY291bnRgIHZhbHVlcywgdGhlbiBlbWl0cyB0aG9zZVxuICogb25seSB3aGVuIHRoZSBzb3VyY2UgY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZUxhc3QucG5nKVxuICpcbiAqIGB0YWtlTGFzdGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYXQgbW9zdCB0aGUgbGFzdCBgY291bnRgIHZhbHVlc1xuICogZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuIElmIHRoZSBzb3VyY2UgZW1pdHMgZmV3ZXIgdGhhbiBgY291bnRgXG4gKiB2YWx1ZXMgdGhlbiBhbGwgb2YgaXRzIHZhbHVlcyBhcmUgZW1pdHRlZC4gVGhpcyBvcGVyYXRvciBtdXN0IHdhaXQgdW50aWwgdGhlXG4gKiBgY29tcGxldGVgIG5vdGlmaWNhdGlvbiBlbWlzc2lvbiBmcm9tIHRoZSBzb3VyY2UgaW4gb3JkZXIgdG8gZW1pdCB0aGUgYG5leHRgXG4gKiB2YWx1ZXMgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLCBiZWNhdXNlIG90aGVyd2lzZSBpdCBpcyBpbXBvc3NpYmxlIHRvIGtub3dcbiAqIHdoZXRoZXIgb3Igbm90IG1vcmUgdmFsdWVzIHdpbGwgYmUgZW1pdHRlZCBvbiB0aGUgc291cmNlLiBGb3IgdGhpcyByZWFzb24sXG4gKiBhbGwgdmFsdWVzIGFyZSBlbWl0dGVkIHN5bmNocm9ub3VzbHksIGZvbGxvd2VkIGJ5IHRoZSBjb21wbGV0ZSBub3RpZmljYXRpb24uXG4gKlxuICogIyMgRXhhbXBsZVxuICogVGFrZSB0aGUgbGFzdCAzIHZhbHVlcyBvZiBhbiBPYnNlcnZhYmxlIHdpdGggbWFueSB2YWx1ZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG1hbnkgPSByYW5nZSgxLCAxMDApO1xuICogY29uc3QgbGFzdFRocmVlID0gbWFueS5waXBlKHRha2VMYXN0KDMpKTtcbiAqIGxhc3RUaHJlZS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZVVudGlsfVxuICogQHNlZSB7QGxpbmsgdGFrZVdoaWxlfVxuICogQHNlZSB7QGxpbmsgc2tpcH1cbiAqXG4gKiBAdGhyb3dzIHtBcmd1bWVudE91dE9mUmFuZ2VFcnJvcn0gV2hlbiB1c2luZyBgdGFrZUxhc3QoaSlgLCBpdCBkZWxpdmVycyBhblxuICogQXJndW1lbnRPdXRPclJhbmdlRXJyb3IgdG8gdGhlIE9ic2VydmVyJ3MgYGVycm9yYCBjYWxsYmFjayBpZiBgaSA8IDBgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgdmFsdWVzIHRvIGVtaXQgZnJvbSB0aGUgZW5kIG9mXG4gKiB0aGUgc2VxdWVuY2Ugb2YgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGF0IG1vc3QgdGhlIGxhc3QgY291bnRcbiAqIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgdGFrZUxhc3RcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YWtlTGFzdDxUPihjb3VudDogbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRha2VMYXN0T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFRha2VMYXN0T3BlcmF0b3IoY291bnQpKTtcbiAgICB9XG4gIH07XG59XG5cbmNsYXNzIFRha2VMYXN0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdG90YWw6IG51bWJlcikge1xuICAgIGlmICh0aGlzLnRvdGFsIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFrZUxhc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMudG90YWwpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGFrZUxhc3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgcmluZzogQXJyYXk8VD4gPSBuZXcgQXJyYXkoKTtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgcHJpdmF0ZSB0b3RhbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgcmluZyA9IHRoaXMucmluZztcbiAgICBjb25zdCB0b3RhbCA9IHRoaXMudG90YWw7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmNvdW50Kys7XG5cbiAgICBpZiAocmluZy5sZW5ndGggPCB0b3RhbCkge1xuICAgICAgcmluZy5wdXNoKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSBjb3VudCAlIHRvdGFsO1xuICAgICAgcmluZ1tpbmRleF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBsZXQgY291bnQgPSB0aGlzLmNvdW50O1xuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmNvdW50ID49IHRoaXMudG90YWwgPyB0aGlzLnRvdGFsIDogdGhpcy5jb3VudDtcbiAgICAgIGNvbnN0IHJpbmcgID0gdGhpcy5yaW5nO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcbiAgICAgICAgY29uc3QgaWR4ID0gKGNvdW50KyspICUgdG90YWw7XG4gICAgICAgIGRlc3RpbmF0aW9uLm5leHQocmluZ1tpZHhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=