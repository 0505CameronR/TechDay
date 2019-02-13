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
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Buffers the source Observable values until `closingNotifier` emits.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when another Observable emits.</span>
 *
 * ![](buffer.png)
 *
 * Buffers the incoming Observable values until the given `closingNotifier`
 * Observable emits a value, at which point it emits the buffer on the output
 * Observable and starts a new buffer internally, awaiting the next time
 * `closingNotifier` emits.
 *
 * ## Example
 *
 * On every click, emit array of most recent interval events
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const interval = interval(1000);
 * const buffered = interval.pipe(buffer(clicks));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link window}
 *
 * @param {Observable<any>} closingNotifier An Observable that signals the
 * buffer to be emitted on the output Observable.
 * @return {Observable<T[]>} An Observable of buffers, which are arrays of
 * values.
 * @method buffer
 * @owner Observable
 */
function buffer(closingNotifier) {
    return function bufferOperatorFunction(source) {
        return source.lift(new BufferOperator(closingNotifier));
    };
}
exports.buffer = buffer;
var BufferOperator = /** @class */ (function () {
    function BufferOperator(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    BufferOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    };
    return BufferOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSubscriber = /** @class */ (function (_super) {
    __extends(BufferSubscriber, _super);
    function BufferSubscriber(destination, closingNotifier) {
        var _this = _super.call(this, destination) || this;
        _this.buffer = [];
        _this.add(subscribeToResult_1.subscribeToResult(_this, closingNotifier));
        return _this;
    }
    BufferSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    };
    return BufferSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFHOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILFNBQWdCLE1BQU0sQ0FBSSxlQUFnQztJQUN4RCxPQUFPLFNBQVMsc0JBQXNCLENBQUMsTUFBcUI7UUFDMUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELHdCQUlDO0FBRUQ7SUFFRSx3QkFBb0IsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO0lBQ3BELENBQUM7SUFFRCw2QkFBSSxHQUFKLFVBQUssVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFrQyxvQ0FBdUI7SUFHdkQsMEJBQVksV0FBNEIsRUFBRSxlQUFnQztRQUExRSxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQUxPLFlBQU0sR0FBUSxFQUFFLENBQUM7UUFJdkIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxxQ0FBaUIsQ0FBQyxLQUFJLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQzs7SUFDckQsQ0FBQztJQUVTLGdDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQscUNBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBbkJELENBQWtDLGlDQUFlLEdBbUJoRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBCdWZmZXJzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgdW50aWwgYGNsb3NpbmdOb3RpZmllcmAgZW1pdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbGxlY3RzIHZhbHVlcyBmcm9tIHRoZSBwYXN0IGFzIGFuIGFycmF5LCBhbmQgZW1pdHNcbiAqIHRoYXQgYXJyYXkgb25seSB3aGVuIGFub3RoZXIgT2JzZXJ2YWJsZSBlbWl0cy48L3NwYW4+XG4gKlxuICogIVtdKGJ1ZmZlci5wbmcpXG4gKlxuICogQnVmZmVycyB0aGUgaW5jb21pbmcgT2JzZXJ2YWJsZSB2YWx1ZXMgdW50aWwgdGhlIGdpdmVuIGBjbG9zaW5nTm90aWZpZXJgXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIGF0IHdoaWNoIHBvaW50IGl0IGVtaXRzIHRoZSBidWZmZXIgb24gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBhbmQgc3RhcnRzIGEgbmV3IGJ1ZmZlciBpbnRlcm5hbGx5LCBhd2FpdGluZyB0aGUgbmV4dCB0aW1lXG4gKiBgY2xvc2luZ05vdGlmaWVyYCBlbWl0cy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogT24gZXZlcnkgY2xpY2ssIGVtaXQgYXJyYXkgb2YgbW9zdCByZWNlbnQgaW50ZXJ2YWwgZXZlbnRzXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGludGVydmFsID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBidWZmZXJlZCA9IGludGVydmFsLnBpcGUoYnVmZmVyKGNsaWNrcykpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYnVmZmVyQ291bnR9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUaW1lfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd31cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGU8YW55Pn0gY2xvc2luZ05vdGlmaWVyIEFuIE9ic2VydmFibGUgdGhhdCBzaWduYWxzIHRoZVxuICogYnVmZmVyIHRvIGJlIGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUW10+fSBBbiBPYnNlcnZhYmxlIG9mIGJ1ZmZlcnMsIHdoaWNoIGFyZSBhcnJheXMgb2ZcbiAqIHZhbHVlcy5cbiAqIEBtZXRob2QgYnVmZmVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyPFQ+KGNsb3NpbmdOb3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1ZmZlck9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJPcGVyYXRvcjxUPihjbG9zaW5nTm90aWZpZXIpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUW10+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsb3NpbmdOb3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VFtdPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBCdWZmZXJTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY2xvc2luZ05vdGlmaWVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEJ1ZmZlclN1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgYW55PiB7XG4gIHByaXZhdGUgYnVmZmVyOiBUW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUW10+LCBjbG9zaW5nTm90aWZpZXI6IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLmFkZChzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuYnVmZmVyLnB1c2godmFsdWUpO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgfVxufVxuIl19