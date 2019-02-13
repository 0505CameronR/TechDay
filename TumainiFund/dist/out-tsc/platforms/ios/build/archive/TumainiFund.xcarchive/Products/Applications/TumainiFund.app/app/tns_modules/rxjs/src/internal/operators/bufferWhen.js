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
var Subscription_1 = require("../Subscription");
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Buffers the source Observable values, using a factory function of closing
 * Observables to determine when to close, emit, and reset the buffer.
 *
 * <span class="informal">Collects values from the past as an array. When it
 * starts collecting values, it calls a function that returns an Observable that
 * tells when to close the buffer and restart collecting.</span>
 *
 * ![](bufferWhen.png)
 *
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` function emits a value. When it closes
 * the buffer, it immediately opens a new buffer and repeats the process.
 *
 * ## Example
 *
 * Emit an array of the last clicks every [1-5] random seconds
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferWhen(() =>
 *   interval(1000 + Math.random() * 4000)
 * ));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link windowWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals buffer closure.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferWhen
 * @owner Observable
 */
function bufferWhen(closingSelector) {
    return function (source) {
        return source.lift(new BufferWhenOperator(closingSelector));
    };
}
exports.bufferWhen = bufferWhen;
var BufferWhenOperator = /** @class */ (function () {
    function BufferWhenOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    BufferWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    };
    return BufferWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferWhenSubscriber = /** @class */ (function (_super) {
    __extends(BufferWhenSubscriber, _super);
    function BufferWhenSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.closingSelector = closingSelector;
        _this.subscribing = false;
        _this.openBuffer();
        return _this;
    }
    BufferWhenSubscriber.prototype._next = function (value) {
        this.buffer.push(value);
    };
    BufferWhenSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    BufferWhenSubscriber.prototype._unsubscribe = function () {
        this.buffer = null;
        this.subscribing = false;
    };
    BufferWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    };
    BufferWhenSubscriber.prototype.notifyComplete = function () {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    };
    BufferWhenSubscriber.prototype.openBuffer = function () {
        var closingSubscription = this.closingSubscription;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        var buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
            this.error(errorObject_1.errorObject.e);
        }
        else {
            closingSubscription = new Subscription_1.Subscription();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(subscribeToResult_1.subscribeToResult(this, closingNotifier));
            this.subscribing = false;
        }
    };
    return BufferWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyV2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2J1ZmZlcldoZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsZ0RBQStDO0FBQy9DLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFDbEQsc0RBQXFEO0FBRXJELCtEQUE4RDtBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxTQUFnQixVQUFVLENBQUksZUFBc0M7SUFDbEUsT0FBTyxVQUFVLE1BQXFCO1FBQ3BDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELGdDQUlDO0FBRUQ7SUFFRSw0QkFBb0IsZUFBc0M7UUFBdEMsb0JBQWUsR0FBZixlQUFlLENBQXVCO0lBQzFELENBQUM7SUFFRCxpQ0FBSSxHQUFKLFVBQUssVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFzQyx3Q0FBdUI7SUFLM0QsOEJBQVksV0FBNEIsRUFBVSxlQUFzQztRQUF4RixZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQUhpRCxxQkFBZSxHQUFmLGVBQWUsQ0FBdUI7UUFIaEYsaUJBQVcsR0FBWSxLQUFLLENBQUM7UUFLbkMsS0FBSSxDQUFDLFVBQVUsRUFBRSxDQUFDOztJQUNwQixDQUFDO0lBRVMsb0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyx3Q0FBUyxHQUFuQjtRQUNFLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUNELGlCQUFNLFNBQVMsV0FBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsMkNBQVksR0FBWjtRQUNFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCx5Q0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWUsRUFDOUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUFpQztRQUMxQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELDZDQUFjLEdBQWQ7UUFDRSxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQseUNBQVUsR0FBVjtRQUVRLElBQUEsOENBQW1CLENBQVU7UUFFbkMsSUFBSSxtQkFBbUIsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7UUFFRCxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBTSxlQUFlLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztRQUV6RCxJQUFJLGVBQWUsS0FBSyx5QkFBVyxFQUFFO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsbUJBQW1CLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7WUFDekMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1lBQy9DLElBQUksQ0FBQyxHQUFHLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUM5QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztZQUN4QixtQkFBbUIsQ0FBQyxHQUFHLENBQUMscUNBQWlCLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbEUsSUFBSSxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7U0FDMUI7SUFDSCxDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBdkVELENBQXNDLGlDQUFlLEdBdUVwRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBCdWZmZXJzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMsIHVzaW5nIGEgZmFjdG9yeSBmdW5jdGlvbiBvZiBjbG9zaW5nXG4gKiBPYnNlcnZhYmxlcyB0byBkZXRlcm1pbmUgd2hlbiB0byBjbG9zZSwgZW1pdCwgYW5kIHJlc2V0IHRoZSBidWZmZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbGxlY3RzIHZhbHVlcyBmcm9tIHRoZSBwYXN0IGFzIGFuIGFycmF5LiBXaGVuIGl0XG4gKiBzdGFydHMgY29sbGVjdGluZyB2YWx1ZXMsIGl0IGNhbGxzIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdFxuICogdGVsbHMgd2hlbiB0byBjbG9zZSB0aGUgYnVmZmVyIGFuZCByZXN0YXJ0IGNvbGxlY3RpbmcuPC9zcGFuPlxuICpcbiAqICFbXShidWZmZXJXaGVuLnBuZylcbiAqXG4gKiBPcGVucyBhIGJ1ZmZlciBpbW1lZGlhdGVseSwgdGhlbiBjbG9zZXMgdGhlIGJ1ZmZlciB3aGVuIHRoZSBvYnNlcnZhYmxlXG4gKiByZXR1cm5lZCBieSBjYWxsaW5nIGBjbG9zaW5nU2VsZWN0b3JgIGZ1bmN0aW9uIGVtaXRzIGEgdmFsdWUuIFdoZW4gaXQgY2xvc2VzXG4gKiB0aGUgYnVmZmVyLCBpdCBpbW1lZGlhdGVseSBvcGVucyBhIG5ldyBidWZmZXIgYW5kIHJlcGVhdHMgdGhlIHByb2Nlc3MuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIEVtaXQgYW4gYXJyYXkgb2YgdGhlIGxhc3QgY2xpY2tzIGV2ZXJ5IFsxLTVdIHJhbmRvbSBzZWNvbmRzXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyV2hlbigoKSA9PlxuICogICBpbnRlcnZhbCgxMDAwICsgTWF0aC5yYW5kb20oKSAqIDQwMDApXG4gKiApKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqXG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKiBAc2VlIHtAbGluayBidWZmZXJDb3VudH1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRpbWV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUb2dnbGV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dXaGVufVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogT2JzZXJ2YWJsZX0gY2xvc2luZ1NlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuICogYXJndW1lbnRzIGFuZCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBzaWduYWxzIGJ1ZmZlciBjbG9zdXJlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUW10+fSBBbiBvYnNlcnZhYmxlIG9mIGFycmF5cyBvZiBidWZmZXJlZCB2YWx1ZXMuXG4gKiBAbWV0aG9kIGJ1ZmZlcldoZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJXaGVuPFQ+KGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IEJ1ZmZlcldoZW5PcGVyYXRvcihjbG9zaW5nU2VsZWN0b3IpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyV2hlbk9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyV2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jbG9zaW5nU2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyV2hlblN1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgYW55PiB7XG4gIHByaXZhdGUgYnVmZmVyOiBUW107XG4gIHByaXZhdGUgc3Vic2NyaWJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBjbG9zaW5nU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPiwgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLm9wZW5CdWZmZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuYnVmZmVyLnB1c2godmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBpZiAoYnVmZmVyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICB9XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5zdWJzY3JpYmluZyA9IGZhbHNlO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5vcGVuQnVmZmVyKCk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpYmluZykge1xuICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW5CdWZmZXIoKTtcbiAgICB9XG4gIH1cblxuICBvcGVuQnVmZmVyKCkge1xuXG4gICAgbGV0IHsgY2xvc2luZ1N1YnNjcmlwdGlvbiB9ID0gdGhpcztcblxuICAgIGlmIChjbG9zaW5nU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnJlbW92ZShjbG9zaW5nU3Vic2NyaXB0aW9uKTtcbiAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG5cbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBpZiAodGhpcy5idWZmZXIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgIH1cblxuICAgIHRoaXMuYnVmZmVyID0gW107XG5cbiAgICBjb25zdCBjbG9zaW5nTm90aWZpZXIgPSB0cnlDYXRjaCh0aGlzLmNsb3NpbmdTZWxlY3RvcikoKTtcblxuICAgIGlmIChjbG9zaW5nTm90aWZpZXIgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICB0aGlzLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgdGhpcy5jbG9zaW5nU3Vic2NyaXB0aW9uID0gY2xvc2luZ1N1YnNjcmlwdGlvbjtcbiAgICAgIHRoaXMuYWRkKGNsb3NpbmdTdWJzY3JpcHRpb24pO1xuICAgICAgdGhpcy5zdWJzY3JpYmluZyA9IHRydWU7XG4gICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLmFkZChzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIpKTtcbiAgICAgIHRoaXMuc3Vic2NyaWJpbmcgPSBmYWxzZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==