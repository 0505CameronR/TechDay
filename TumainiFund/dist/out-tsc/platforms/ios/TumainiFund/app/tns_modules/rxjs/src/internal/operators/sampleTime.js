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
var async_1 = require("../scheduler/async");
/**
 * Emits the most recently emitted value from the source Observable within
 * periodic time intervals.
 *
 * <span class="informal">Samples the source Observable at periodic time
 * intervals, emitting what it samples.</span>
 *
 * ![](sampleTime.png)
 *
 * `sampleTime` periodically looks at the source Observable and emits whichever
 * value it has most recently emitted since the previous sampling, unless the
 * source has not emitted anything since the previous sampling. The sampling
 * happens periodically in time every `period` milliseconds (or the time unit
 * defined by the optional `scheduler` argument). The sampling starts as soon as
 * the output Observable is subscribed.
 *
 * ## Example
 * Every second, emit the most recent click at most once
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(sampleTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {number} period The sampling period expressed in milliseconds or the
 * time unit determined internally by the optional `scheduler`.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the sampling.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable at the specified time interval.
 * @method sampleTime
 * @owner Observable
 */
function sampleTime(period, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) { return source.lift(new SampleTimeOperator(period, scheduler)); };
}
exports.sampleTime = sampleTime;
var SampleTimeOperator = /** @class */ (function () {
    function SampleTimeOperator(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    SampleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    };
    return SampleTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SampleTimeSubscriber = /** @class */ (function (_super) {
    __extends(SampleTimeSubscriber, _super);
    function SampleTimeSubscriber(destination, period, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.period = period;
        _this.scheduler = scheduler;
        _this.hasValue = false;
        _this.add(scheduler.schedule(dispatchNotification, period, { subscriber: _this, period: period }));
        return _this;
    }
    SampleTimeSubscriber.prototype._next = function (value) {
        this.lastValue = value;
        this.hasValue = true;
    };
    SampleTimeSubscriber.prototype.notifyNext = function () {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    };
    return SampleTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNotification(state) {
    var subscriber = state.subscriber, period = state.period;
    subscriber.notifyNext();
    this.schedule(state, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlVGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zYW1wbGVUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQUMzQyw0Q0FBMkM7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0NHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFJLE1BQWMsRUFBRSxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDNUUsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQXRELENBQXNELENBQUM7QUFDM0YsQ0FBQztBQUZELGdDQUVDO0FBRUQ7SUFDRSw0QkFBb0IsTUFBYyxFQUNkLFNBQXdCO1FBRHhCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQzVDLENBQUM7SUFFRCxpQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXNDLHdDQUFhO0lBSWpELDhCQUFZLFdBQTBCLEVBQ2xCLE1BQWMsRUFDZCxTQUF3QjtRQUY1QyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQUptQixZQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZUFBUyxHQUFULFNBQVMsQ0FBZTtRQUo1QyxjQUFRLEdBQVksS0FBSyxDQUFDO1FBTXhCLEtBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsRUFBRSxVQUFVLEVBQUUsS0FBSSxFQUFFLE1BQU0sUUFBQSxFQUFFLENBQUMsQ0FBQyxDQUFDOztJQUMzRixDQUFDO0lBRVMsb0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCx5Q0FBVSxHQUFWO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUF0QkQsQ0FBc0MsdUJBQVUsR0FzQi9DO0FBRUQsU0FBUyxvQkFBb0IsQ0FBZ0MsS0FBVTtJQUMvRCxJQUFBLDZCQUFVLEVBQUUscUJBQU0sQ0FBVztJQUNuQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRW1pdHMgdGhlIG1vc3QgcmVjZW50bHkgZW1pdHRlZCB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoaW5cbiAqIHBlcmlvZGljIHRpbWUgaW50ZXJ2YWxzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5TYW1wbGVzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhdCBwZXJpb2RpYyB0aW1lXG4gKiBpbnRlcnZhbHMsIGVtaXR0aW5nIHdoYXQgaXQgc2FtcGxlcy48L3NwYW4+XG4gKlxuICogIVtdKHNhbXBsZVRpbWUucG5nKVxuICpcbiAqIGBzYW1wbGVUaW1lYCBwZXJpb2RpY2FsbHkgbG9va3MgYXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBlbWl0cyB3aGljaGV2ZXJcbiAqIHZhbHVlIGl0IGhhcyBtb3N0IHJlY2VudGx5IGVtaXR0ZWQgc2luY2UgdGhlIHByZXZpb3VzIHNhbXBsaW5nLCB1bmxlc3MgdGhlXG4gKiBzb3VyY2UgaGFzIG5vdCBlbWl0dGVkIGFueXRoaW5nIHNpbmNlIHRoZSBwcmV2aW91cyBzYW1wbGluZy4gVGhlIHNhbXBsaW5nXG4gKiBoYXBwZW5zIHBlcmlvZGljYWxseSBpbiB0aW1lIGV2ZXJ5IGBwZXJpb2RgIG1pbGxpc2Vjb25kcyAob3IgdGhlIHRpbWUgdW5pdFxuICogZGVmaW5lZCBieSB0aGUgb3B0aW9uYWwgYHNjaGVkdWxlcmAgYXJndW1lbnQpLiBUaGUgc2FtcGxpbmcgc3RhcnRzIGFzIHNvb24gYXNcbiAqIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEV2ZXJ5IHNlY29uZCwgZW1pdCB0aGUgbW9zdCByZWNlbnQgY2xpY2sgYXQgbW9zdCBvbmNlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoc2FtcGxlVGltZSgxMDAwKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXRUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2VUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKiBAc2VlIHtAbGluayBzYW1wbGV9XG4gKiBAc2VlIHtAbGluayB0aHJvdHRsZVRpbWV9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHBlcmlvZCBUaGUgc2FtcGxpbmcgcGVyaW9kIGV4cHJlc3NlZCBpbiBtaWxsaXNlY29uZHMgb3IgdGhlXG4gKiB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBpbnRlcm5hbGx5IGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yXG4gKiBtYW5hZ2luZyB0aGUgdGltZXJzIHRoYXQgaGFuZGxlIHRoZSBzYW1wbGluZy5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgcmVzdWx0cyBvZiBzYW1wbGluZyB0aGVcbiAqIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhdCB0aGUgc3BlY2lmaWVkIHRpbWUgaW50ZXJ2YWwuXG4gKiBAbWV0aG9kIHNhbXBsZVRpbWVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGVUaW1lPFQ+KHBlcmlvZDogbnVtYmVyLCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2FtcGxlVGltZU9wZXJhdG9yKHBlcmlvZCwgc2NoZWR1bGVyKSk7XG59XG5cbmNsYXNzIFNhbXBsZVRpbWVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwZXJpb2Q6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU2FtcGxlVGltZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wZXJpb2QsIHRoaXMuc2NoZWR1bGVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNhbXBsZVRpbWVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGxhc3RWYWx1ZTogVDtcbiAgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwZXJpb2Q6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoTm90aWZpY2F0aW9uLCBwZXJpb2QsIHsgc3Vic2NyaWJlcjogdGhpcywgcGVyaW9kIH0pKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gIH1cblxuICBub3RpZnlOZXh0KCkge1xuICAgIGlmICh0aGlzLmhhc1ZhbHVlKSB7XG4gICAgICB0aGlzLmhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5sYXN0VmFsdWUpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5vdGlmaWNhdGlvbjxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248YW55Piwgc3RhdGU6IGFueSkge1xuICBsZXQgeyBzdWJzY3JpYmVyLCBwZXJpb2QgfSA9IHN0YXRlO1xuICBzdWJzY3JpYmVyLm5vdGlmeU5leHQoKTtcbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgcGVyaW9kKTtcbn1cbiJdfQ==