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
 * Emits only the first `count` values emitted by the source Observable.
 *
 * <span class="informal">Takes the first `count` values from the source, then
 * completes.</span>
 *
 * ![](take.png)
 *
 * `take` returns an Observable that emits only the first `count` values emitted
 * by the source Observable. If the source emits fewer than `count` values then
 * all of its values are emitted. After that, it completes, regardless if the
 * source completes.
 *
 * ## Example
 * Take the first 5 seconds of an infinite 1-second interval Observable
 * ```javascript
 * import { interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const intervalCount = interval(1000);
 * const takeFive = intervalCount.pipe(take(5));
 * takeFive.subscribe(x => console.log(x));
 *
 * // Logs:
 * // 0
 * // 1
 * // 2
 * // 3
 * // 4
 * ```
 *
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `take(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of `next` values to emit.
 * @return {Observable<T>} An Observable that emits only the first `count`
 * values emitted by the source Observable, or all of the values from the source
 * if the source emits fewer than `count` values.
 * @method take
 * @owner Observable
 */
function take(count) {
    return function (source) {
        if (count === 0) {
            return empty_1.empty();
        }
        else {
            return source.lift(new TakeOperator(count));
        }
    };
}
exports.take = take;
var TakeOperator = /** @class */ (function () {
    function TakeOperator(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError;
        }
    }
    TakeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeSubscriber(subscriber, this.total));
    };
    return TakeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeSubscriber = /** @class */ (function (_super) {
    __extends(TakeSubscriber, _super);
    function TakeSubscriber(destination, total) {
        var _this = _super.call(this, destination) || this;
        _this.total = total;
        _this.count = 0;
        return _this;
    }
    TakeSubscriber.prototype._next = function (value) {
        var total = this.total;
        var count = ++this.count;
        if (count <= total) {
            this.destination.next(value);
            if (count === total) {
                this.destination.complete();
                this.unsubscribe();
            }
        }
    };
    return TakeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90YWtlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUMzQywyRUFBMEU7QUFDMUUsNkNBQTRDO0FBSTVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q0c7QUFDSCxTQUFnQixJQUFJLENBQUksS0FBYTtJQUNuQyxPQUFPLFVBQUMsTUFBcUI7UUFDM0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxhQUFLLEVBQUUsQ0FBQztTQUNoQjthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDN0M7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBUkQsb0JBUUM7QUFFRDtJQUNFLHNCQUFvQixLQUFhO1FBQWIsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUMvQixJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE1BQU0sSUFBSSxpREFBdUIsQ0FBQztTQUNuQztJQUNILENBQUM7SUFFRCwyQkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBZ0Msa0NBQWE7SUFHM0Msd0JBQVksV0FBMEIsRUFBVSxLQUFhO1FBQTdELFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBRitDLFdBQUssR0FBTCxLQUFLLENBQVE7UUFGckQsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFJMUIsQ0FBQztJQUVTLDhCQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLElBQU0sS0FBSyxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUMzQixJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7WUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDN0IsSUFBSSxLQUFLLEtBQUssS0FBSyxFQUFFO2dCQUNuQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO2dCQUM1QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDcEI7U0FDRjtJQUNILENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFsQkQsQ0FBZ0MsdUJBQVUsR0FrQnpDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciB9IGZyb20gJy4uL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyBvbmx5IHRoZSBmaXJzdCBgY291bnRgIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGFrZXMgdGhlIGZpcnN0IGBjb3VudGAgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSwgdGhlblxuICogY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZS5wbmcpXG4gKlxuICogYHRha2VgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG9ubHkgdGhlIGZpcnN0IGBjb3VudGAgdmFsdWVzIGVtaXR0ZWRcbiAqIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgdGhlIHNvdXJjZSBlbWl0cyBmZXdlciB0aGFuIGBjb3VudGAgdmFsdWVzIHRoZW5cbiAqIGFsbCBvZiBpdHMgdmFsdWVzIGFyZSBlbWl0dGVkLiBBZnRlciB0aGF0LCBpdCBjb21wbGV0ZXMsIHJlZ2FyZGxlc3MgaWYgdGhlXG4gKiBzb3VyY2UgY29tcGxldGVzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFRha2UgdGhlIGZpcnN0IDUgc2Vjb25kcyBvZiBhbiBpbmZpbml0ZSAxLXNlY29uZCBpbnRlcnZhbCBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBpbnRlcnZhbENvdW50ID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCB0YWtlRml2ZSA9IGludGVydmFsQ291bnQucGlwZSh0YWtlKDUpKTtcbiAqIHRha2VGaXZlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMFxuICogLy8gMVxuICogLy8gMlxuICogLy8gM1xuICogLy8gNFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgdGFrZUxhc3R9XG4gKiBAc2VlIHtAbGluayB0YWtlVW50aWx9XG4gKiBAc2VlIHtAbGluayB0YWtlV2hpbGV9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICpcbiAqIEB0aHJvd3Mge0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yfSBXaGVuIHVzaW5nIGB0YWtlKGkpYCwgaXQgZGVsaXZlcnMgYW5cbiAqIEFyZ3VtZW50T3V0T3JSYW5nZUVycm9yIHRvIHRoZSBPYnNlcnZlcidzIGBlcnJvcmAgY2FsbGJhY2sgaWYgYGkgPCAwYC5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gY291bnQgVGhlIG1heGltdW0gbnVtYmVyIG9mIGBuZXh0YCB2YWx1ZXMgdG8gZW1pdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBvbmx5IHRoZSBmaXJzdCBgY291bnRgXG4gKiB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIG9yIGFsbCBvZiB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZVxuICogaWYgdGhlIHNvdXJjZSBlbWl0cyBmZXdlciB0aGFuIGBjb3VudGAgdmFsdWVzLlxuICogQG1ldGhvZCB0YWtlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFrZTxUPihjb3VudDogbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFRha2VPcGVyYXRvcihjb3VudCkpO1xuICAgIH1cbiAgfTtcbn1cblxuY2xhc3MgVGFrZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRvdGFsOiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy50b3RhbCA8IDApIHtcbiAgICAgIHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcjtcbiAgICB9XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFRha2VTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMudG90YWwpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGFrZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgcHJpdmF0ZSB0b3RhbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnRvdGFsO1xuICAgIGNvbnN0IGNvdW50ID0gKyt0aGlzLmNvdW50O1xuICAgIGlmIChjb3VudCA8PSB0b3RhbCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICAgIGlmIChjb3VudCA9PT0gdG90YWwpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=