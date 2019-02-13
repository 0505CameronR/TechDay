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
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * ![](sample.png)
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * ## Example
 * On every click, sample the most recent "seconds" timer
 * ```javascript
 * const seconds = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = seconds.pipe(sample(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
function sample(notifier) {
    return function (source) { return source.lift(new SampleOperator(notifier)); };
}
exports.sample = sample;
var SampleOperator = /** @class */ (function () {
    function SampleOperator(notifier) {
        this.notifier = notifier;
    }
    SampleOperator.prototype.call = function (subscriber, source) {
        var sampleSubscriber = new SampleSubscriber(subscriber);
        var subscription = source.subscribe(sampleSubscriber);
        subscription.add(subscribeToResult_1.subscribeToResult(sampleSubscriber, this.notifier));
        return subscription;
    };
    return SampleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleSubscriber = /** @class */ (function (_super) {
    __extends(SampleSubscriber, _super);
    function SampleSubscriber() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.hasValue = false;
        return _this;
    }
    SampleSubscriber.prototype._next = function (value) {
        this.value = value;
        this.hasValue = true;
    };
    SampleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    };
    SampleSubscriber.prototype.notifyComplete = function () {
        this.emitValue();
    };
    SampleSubscriber.prototype.emitValue = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    };
    return SampleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2FtcGxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFJOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILFNBQWdCLE1BQU0sQ0FBSSxRQUF5QjtJQUNqRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBekMsQ0FBeUMsQ0FBQztBQUM5RSxDQUFDO0FBRkQsd0JBRUM7QUFFRDtJQUNFLHdCQUFvQixRQUF5QjtRQUF6QixhQUFRLEdBQVIsUUFBUSxDQUFpQjtJQUM3QyxDQUFDO0lBRUQsNkJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxJQUFNLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsSUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hELFlBQVksQ0FBQyxHQUFHLENBQUMscUNBQWlCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDckUsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBcUMsb0NBQXFCO0lBQTFEO1FBQUEscUVBeUJDO1FBdkJTLGNBQVEsR0FBWSxLQUFLLENBQUM7O0lBdUJwQyxDQUFDO0lBckJXLGdDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztJQUN2QixDQUFDO0lBRUQscUNBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCx5Q0FBYyxHQUFkO1FBQ0UsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxvQ0FBUyxHQUFUO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNuQztJQUNILENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUF6QkQsQ0FBcUMsaUNBQWUsR0F5Qm5EIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyB0aGUgbW9zdCByZWNlbnRseSBlbWl0dGVkIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdoZW5ldmVyXG4gKiBhbm90aGVyIE9ic2VydmFibGUsIHRoZSBgbm90aWZpZXJgLCBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBzYW1wbGVUaW1lfSwgYnV0IHNhbXBsZXMgd2hlbmV2ZXJcbiAqIHRoZSBgbm90aWZpZXJgIE9ic2VydmFibGUgZW1pdHMgc29tZXRoaW5nLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2FtcGxlLnBuZylcbiAqXG4gKiBXaGVuZXZlciB0aGUgYG5vdGlmaWVyYCBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUgb3IgY29tcGxldGVzLCBgc2FtcGxlYFxuICogbG9va3MgYXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBlbWl0cyB3aGljaGV2ZXIgdmFsdWUgaXQgaGFzIG1vc3QgcmVjZW50bHlcbiAqIGVtaXR0ZWQgc2luY2UgdGhlIHByZXZpb3VzIHNhbXBsaW5nLCB1bmxlc3MgdGhlIHNvdXJjZSBoYXMgbm90IGVtaXR0ZWRcbiAqIGFueXRoaW5nIHNpbmNlIHRoZSBwcmV2aW91cyBzYW1wbGluZy4gVGhlIGBub3RpZmllcmAgaXMgc3Vic2NyaWJlZCB0byBhcyBzb29uXG4gKiBhcyB0aGUgb3V0cHV0IE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBPbiBldmVyeSBjbGljaywgc2FtcGxlIHRoZSBtb3N0IHJlY2VudCBcInNlY29uZHNcIiB0aW1lclxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgc2Vjb25kcyA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IHNlY29uZHMucGlwZShzYW1wbGUoY2xpY2tzKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXR9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZX1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZVRpbWV9XG4gKiBAc2VlIHtAbGluayB0aHJvdHRsZX1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGU8YW55Pn0gbm90aWZpZXIgVGhlIE9ic2VydmFibGUgdG8gdXNlIGZvciBzYW1wbGluZyB0aGVcbiAqIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHRzIG9mIHNhbXBsaW5nIHRoZVxuICogdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdoZW5ldmVyIHRoZSBub3RpZmllciBPYnNlcnZhYmxlXG4gKiBlbWl0cyB2YWx1ZSBvciBjb21wbGV0ZXMuXG4gKiBAbWV0aG9kIHNhbXBsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZTxUPihub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTYW1wbGVPcGVyYXRvcihub3RpZmllcikpO1xufVxuXG5jbGFzcyBTYW1wbGVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3Qgc2FtcGxlU3Vic2NyaWJlciA9IG5ldyBTYW1wbGVTdWJzY3JpYmVyKHN1YnNjcmliZXIpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoc2FtcGxlU3Vic2NyaWJlcik7XG4gICAgc3Vic2NyaXB0aW9uLmFkZChzdWJzY3JpYmVUb1Jlc3VsdChzYW1wbGVTdWJzY3JpYmVyLCB0aGlzLm5vdGlmaWVyKSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU2FtcGxlU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgdmFsdWU6IFQ7XG4gIHByaXZhdGUgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZW1pdFZhbHVlKCk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmVtaXRWYWx1ZSgpO1xuICB9XG5cbiAgZW1pdFZhbHVlKCkge1xuICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICB0aGlzLmhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy52YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=