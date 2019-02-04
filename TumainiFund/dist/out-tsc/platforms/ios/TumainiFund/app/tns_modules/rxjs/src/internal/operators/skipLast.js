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
/**
 * Skip the last `count` values emitted by the source Observable.
 *
 * ![](skipLast.png)
 *
 * `skipLast` returns an Observable that accumulates a queue with a length
 * enough to store the first `count` values. As more values are received,
 * values are taken from the front of the queue and produced on the result
 * sequence. This causes values to be delayed.
 *
 * ## Example
 * Skip the last 2 values of an Observable with many values
 * ```javascript
 * const many = range(1, 5);
 * const skipLastTwo = many.pipe(skipLast(2));
 * skipLastTwo.subscribe(x => console.log(x));
 *
 * // Results in:
 * // 1 2 3
 * ```
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipWhile}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `skipLast(i)`, it throws
 * ArgumentOutOrRangeError if `i < 0`.
 *
 * @param {number} count Number of elements to skip from the end of the source Observable.
 * @returns {Observable<T>} An Observable that skips the last count values
 * emitted by the source Observable.
 * @method skipLast
 * @owner Observable
 */
function skipLast(count) {
    return function (source) { return source.lift(new SkipLastOperator(count)); };
}
exports.skipLast = skipLast;
var SkipLastOperator = /** @class */ (function () {
    function SkipLastOperator(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    SkipLastOperator.prototype.call = function (subscriber, source) {
        if (this._skipCount === 0) {
            // If we don't want to skip any values then just subscribe
            // to Subscriber without any further logic.
            return source.subscribe(new Subscriber_1.Subscriber(subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    };
    return SkipLastOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SkipLastSubscriber = /** @class */ (function (_super) {
    __extends(SkipLastSubscriber, _super);
    function SkipLastSubscriber(destination, _skipCount) {
        var _this = _super.call(this, destination) || this;
        _this._skipCount = _skipCount;
        _this._count = 0;
        _this._ring = new Array(_skipCount);
        return _this;
    }
    SkipLastSubscriber.prototype._next = function (value) {
        var skipCount = this._skipCount;
        var count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            var currentIndex = count % skipCount;
            var ring = this._ring;
            var oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    };
    return SkipLastSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcExhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBQzNDLDJFQUEwRTtBQUkxRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtDRztBQUNILFNBQWdCLFFBQVEsQ0FBSSxLQUFhO0lBQ3ZDLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXhDLENBQXdDLENBQUM7QUFDN0UsQ0FBQztBQUZELDRCQUVDO0FBRUQ7SUFDRSwwQkFBb0IsVUFBa0I7UUFBbEIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNwQyxJQUFJLElBQUksQ0FBQyxVQUFVLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sSUFBSSxpREFBdUIsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLElBQUksSUFBSSxDQUFDLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDekIsMERBQTBEO1lBQzFELDJDQUEyQztZQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM5RTtJQUNILENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFoQkQsSUFnQkM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBb0Msc0NBQWE7SUFJL0MsNEJBQVksV0FBMEIsRUFBVSxVQUFrQjtRQUFsRSxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQUgrQyxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtRQUYxRCxZQUFNLEdBQVcsQ0FBQyxDQUFDO1FBSXpCLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxLQUFLLENBQUksVUFBVSxDQUFDLENBQUM7O0lBQ3hDLENBQUM7SUFFUyxrQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFNUIsSUFBSSxLQUFLLEdBQUcsU0FBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzNCO2FBQU07WUFDTCxJQUFNLFlBQVksR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDO1lBQ3ZDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDeEIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBeEJELENBQW9DLHVCQUFVLEdBd0I3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgfSBmcm9tICcuLi91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBTa2lwIHRoZSBsYXN0IGBjb3VudGAgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqICFbXShza2lwTGFzdC5wbmcpXG4gKlxuICogYHNraXBMYXN0YCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBhY2N1bXVsYXRlcyBhIHF1ZXVlIHdpdGggYSBsZW5ndGhcbiAqIGVub3VnaCB0byBzdG9yZSB0aGUgZmlyc3QgYGNvdW50YCB2YWx1ZXMuIEFzIG1vcmUgdmFsdWVzIGFyZSByZWNlaXZlZCxcbiAqIHZhbHVlcyBhcmUgdGFrZW4gZnJvbSB0aGUgZnJvbnQgb2YgdGhlIHF1ZXVlIGFuZCBwcm9kdWNlZCBvbiB0aGUgcmVzdWx0XG4gKiBzZXF1ZW5jZS4gVGhpcyBjYXVzZXMgdmFsdWVzIHRvIGJlIGRlbGF5ZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU2tpcCB0aGUgbGFzdCAyIHZhbHVlcyBvZiBhbiBPYnNlcnZhYmxlIHdpdGggbWFueSB2YWx1ZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG1hbnkgPSByYW5nZSgxLCA1KTtcbiAqIGNvbnN0IHNraXBMYXN0VHdvID0gbWFueS5waXBlKHNraXBMYXN0KDIpKTtcbiAqIHNraXBMYXN0VHdvLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gMSAyIDNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHNraXB9XG4gKiBAc2VlIHtAbGluayBza2lwVW50aWx9XG4gKiBAc2VlIHtAbGluayBza2lwV2hpbGV9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICpcbiAqIEB0aHJvd3Mge0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yfSBXaGVuIHVzaW5nIGBza2lwTGFzdChpKWAsIGl0IHRocm93c1xuICogQXJndW1lbnRPdXRPclJhbmdlRXJyb3IgaWYgYGkgPCAwYC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY291bnQgTnVtYmVyIG9mIGVsZW1lbnRzIHRvIHNraXAgZnJvbSB0aGUgZW5kIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgc2tpcHMgdGhlIGxhc3QgY291bnQgdmFsdWVzXG4gKiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2Qgc2tpcExhc3RcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBza2lwTGFzdDxUPihjb3VudDogbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTa2lwTGFzdE9wZXJhdG9yKGNvdW50KSk7XG59XG5cbmNsYXNzIFNraXBMYXN0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NraXBDb3VudDogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMuX3NraXBDb3VudCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcjtcbiAgICB9XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgaWYgKHRoaXMuX3NraXBDb3VudCA9PT0gMCkge1xuICAgICAgLy8gSWYgd2UgZG9uJ3Qgd2FudCB0byBza2lwIGFueSB2YWx1ZXMgdGhlbiBqdXN0IHN1YnNjcmliZVxuICAgICAgLy8gdG8gU3Vic2NyaWJlciB3aXRob3V0IGFueSBmdXJ0aGVyIGxvZ2ljLlxuICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFN1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU2tpcExhc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuX3NraXBDb3VudCkpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU2tpcExhc3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgX3Jpbmc6IFRbXTtcbiAgcHJpdmF0ZSBfY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIHByaXZhdGUgX3NraXBDb3VudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMuX3JpbmcgPSBuZXcgQXJyYXk8VD4oX3NraXBDb3VudCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBza2lwQ291bnQgPSB0aGlzLl9za2lwQ291bnQ7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLl9jb3VudCsrO1xuXG4gICAgaWYgKGNvdW50IDwgc2tpcENvdW50KSB7XG4gICAgICB0aGlzLl9yaW5nW2NvdW50XSA9IHZhbHVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjdXJyZW50SW5kZXggPSBjb3VudCAlIHNraXBDb3VudDtcbiAgICAgIGNvbnN0IHJpbmcgPSB0aGlzLl9yaW5nO1xuICAgICAgY29uc3Qgb2xkVmFsdWUgPSByaW5nW2N1cnJlbnRJbmRleF07XG5cbiAgICAgIHJpbmdbY3VycmVudEluZGV4XSA9IHZhbHVlO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KG9sZFZhbHVlKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==