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
 * Emits values emitted by the source Observable so long as each value satisfies
 * the given `predicate`, and then completes as soon as this `predicate` is not
 * satisfied.
 *
 * <span class="informal">Takes values from the source only while they pass the
 * condition given. When the first value does not satisfy, it completes.</span>
 *
 * ![](takeWhile.png)
 *
 * `takeWhile` subscribes and begins mirroring the source Observable. Each value
 * emitted on the source is given to the `predicate` function which returns a
 * boolean, representing a condition to be satisfied by the source values. The
 * output Observable emits the source values until such time as the `predicate`
 * returns false, at which point `takeWhile` stops mirroring the source
 * Observable and completes the output Observable.
 *
 * ## Example
 * Emit click events only while the clientX property is greater than 200
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(takeWhile(ev => ev.clientX > 200));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates a value emitted by the source Observable and returns a boolean.
 * Also takes the (zero-based) index as the second argument.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
function takeWhile(predicate) {
    return function (source) { return source.lift(new TakeWhileOperator(predicate)); };
}
exports.takeWhile = takeWhile;
var TakeWhileOperator = /** @class */ (function () {
    function TakeWhileOperator(predicate) {
        this.predicate = predicate;
    }
    TakeWhileOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    };
    return TakeWhileOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeWhileSubscriber = /** @class */ (function (_super) {
    __extends(TakeWhileSubscriber, _super);
    function TakeWhileSubscriber(destination, predicate) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.index = 0;
        return _this;
    }
    TakeWhileSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        var result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    };
    TakeWhileSubscriber.prototype.nextOrComplete = function (value, predicateResult) {
        var destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            destination.complete();
        }
    };
    return TakeWhileSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVdoaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVdoaWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQU0zQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxTQUFnQixTQUFTLENBQUksU0FBK0M7SUFDMUUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBN0MsQ0FBNkMsQ0FBQztBQUNsRixDQUFDO0FBRkQsOEJBRUM7QUFFRDtJQUNFLDJCQUFvQixTQUErQztRQUEvQyxjQUFTLEdBQVQsU0FBUyxDQUFzQztJQUNuRSxDQUFDO0lBRUQsZ0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBcUMsdUNBQWE7SUFHaEQsNkJBQVksV0FBMEIsRUFDbEIsU0FBK0M7UUFEbkUsWUFFRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFGbUIsZUFBUyxHQUFULFNBQVMsQ0FBc0M7UUFIM0QsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFLMUIsQ0FBQztJQUVTLG1DQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksTUFBZSxDQUFDO1FBQ3BCLElBQUk7WUFDRixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDOUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVPLDRDQUFjLEdBQXRCLFVBQXVCLEtBQVEsRUFBRSxlQUF3QjtRQUN2RCxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQzVCLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7YUFBTTtZQUNMLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUE1QkQsQ0FBcUMsdUJBQVUsR0E0QjlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VCwgUyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiB2YWx1ZSBpcyBTKTogT3BlcmF0b3JGdW5jdGlvbjxULCBTPjtcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5cbi8qKlxuICogRW1pdHMgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHNvIGxvbmcgYXMgZWFjaCB2YWx1ZSBzYXRpc2ZpZXNcbiAqIHRoZSBnaXZlbiBgcHJlZGljYXRlYCwgYW5kIHRoZW4gY29tcGxldGVzIGFzIHNvb24gYXMgdGhpcyBgcHJlZGljYXRlYCBpcyBub3RcbiAqIHNhdGlzZmllZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGFrZXMgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBvbmx5IHdoaWxlIHRoZXkgcGFzcyB0aGVcbiAqIGNvbmRpdGlvbiBnaXZlbi4gV2hlbiB0aGUgZmlyc3QgdmFsdWUgZG9lcyBub3Qgc2F0aXNmeSwgaXQgY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZVdoaWxlLnBuZylcbiAqXG4gKiBgdGFrZVdoaWxlYCBzdWJzY3JpYmVzIGFuZCBiZWdpbnMgbWlycm9yaW5nIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gRWFjaCB2YWx1ZVxuICogZW1pdHRlZCBvbiB0aGUgc291cmNlIGlzIGdpdmVuIHRvIHRoZSBgcHJlZGljYXRlYCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFcbiAqIGJvb2xlYW4sIHJlcHJlc2VudGluZyBhIGNvbmRpdGlvbiB0byBiZSBzYXRpc2ZpZWQgYnkgdGhlIHNvdXJjZSB2YWx1ZXMuIFRoZVxuICogb3V0cHV0IE9ic2VydmFibGUgZW1pdHMgdGhlIHNvdXJjZSB2YWx1ZXMgdW50aWwgc3VjaCB0aW1lIGFzIHRoZSBgcHJlZGljYXRlYFxuICogcmV0dXJucyBmYWxzZSwgYXQgd2hpY2ggcG9pbnQgYHRha2VXaGlsZWAgc3RvcHMgbWlycm9yaW5nIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYW5kIGNvbXBsZXRlcyB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdCBjbGljayBldmVudHMgb25seSB3aGlsZSB0aGUgY2xpZW50WCBwcm9wZXJ0eSBpcyBncmVhdGVyIHRoYW4gMjAwXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUodGFrZVdoaWxlKGV2ID0+IGV2LmNsaWVudFggPiAyMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZUxhc3R9XG4gKiBAc2VlIHtAbGluayB0YWtlVW50aWx9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBib29sZWFufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0aGF0XG4gKiBldmFsdWF0ZXMgYSB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhbmQgcmV0dXJucyBhIGJvb2xlYW4uXG4gKiBBbHNvIHRha2VzIHRoZSAoemVyby1iYXNlZCkgaW5kZXggYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBzbyBsb25nIGFzIGVhY2ggdmFsdWUgc2F0aXNmaWVzIHRoZSBjb25kaXRpb24gZGVmaW5lZCBieSB0aGVcbiAqIGBwcmVkaWNhdGVgLCB0aGVuIGNvbXBsZXRlcy5cbiAqIEBtZXRob2QgdGFrZVdoaWxlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFrZVdoaWxlPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBUYWtlV2hpbGVPcGVyYXRvcihwcmVkaWNhdGUpKTtcbn1cblxuY2xhc3MgVGFrZVdoaWxlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFrZVdoaWxlU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnByZWRpY2F0ZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUYWtlV2hpbGVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgbGV0IHJlc3VsdDogYm9vbGVhbjtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcmVkaWNhdGUodmFsdWUsIHRoaXMuaW5kZXgrKyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLm5leHRPckNvbXBsZXRlKHZhbHVlLCByZXN1bHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXh0T3JDb21wbGV0ZSh2YWx1ZTogVCwgcHJlZGljYXRlUmVzdWx0OiBib29sZWFuKTogdm9pZCB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGlmIChCb29sZWFuKHByZWRpY2F0ZVJlc3VsdCkpIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19