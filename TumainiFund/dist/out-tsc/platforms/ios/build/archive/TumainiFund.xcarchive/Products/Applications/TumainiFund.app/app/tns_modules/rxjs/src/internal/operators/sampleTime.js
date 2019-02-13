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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlVGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3NhbXBsZVRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBQzNDLDRDQUEyQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxTQUFnQixVQUFVLENBQUksTUFBYyxFQUFFLFNBQWdDO0lBQWhDLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUM1RSxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBdEQsQ0FBc0QsQ0FBQztBQUMzRixDQUFDO0FBRkQsZ0NBRUM7QUFFRDtJQUNFLDRCQUFvQixNQUFjLEVBQ2QsU0FBd0I7UUFEeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGNBQVMsR0FBVCxTQUFTLENBQWU7SUFDNUMsQ0FBQztJQUVELGlDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBc0Msd0NBQWE7SUFJakQsOEJBQVksV0FBMEIsRUFDbEIsTUFBYyxFQUNkLFNBQXdCO1FBRjVDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBRW5CO1FBSm1CLFlBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxlQUFTLEdBQVQsU0FBUyxDQUFlO1FBSjVDLGNBQVEsR0FBWSxLQUFLLENBQUM7UUFNeEIsS0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLG9CQUFvQixFQUFFLE1BQU0sRUFBRSxFQUFFLFVBQVUsRUFBRSxLQUFJLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUM7O0lBQzNGLENBQUM7SUFFUyxvQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLENBQUM7UUFDdkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7SUFDdkIsQ0FBQztJQUVELHlDQUFVLEdBQVY7UUFDRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQXRCRCxDQUFzQyx1QkFBVSxHQXNCL0M7QUFFRCxTQUFTLG9CQUFvQixDQUFnQyxLQUFVO0lBQy9ELElBQUEsNkJBQVUsRUFBRSxxQkFBTSxDQUFXO0lBQ25DLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyB0aGUgbW9zdCByZWNlbnRseSBlbWl0dGVkIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGhpblxuICogcGVyaW9kaWMgdGltZSBpbnRlcnZhbHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlNhbXBsZXMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGF0IHBlcmlvZGljIHRpbWVcbiAqIGludGVydmFscywgZW1pdHRpbmcgd2hhdCBpdCBzYW1wbGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2FtcGxlVGltZS5wbmcpXG4gKlxuICogYHNhbXBsZVRpbWVgIHBlcmlvZGljYWxseSBsb29rcyBhdCB0aGUgc291cmNlIE9ic2VydmFibGUgYW5kIGVtaXRzIHdoaWNoZXZlclxuICogdmFsdWUgaXQgaGFzIG1vc3QgcmVjZW50bHkgZW1pdHRlZCBzaW5jZSB0aGUgcHJldmlvdXMgc2FtcGxpbmcsIHVubGVzcyB0aGVcbiAqIHNvdXJjZSBoYXMgbm90IGVtaXR0ZWQgYW55dGhpbmcgc2luY2UgdGhlIHByZXZpb3VzIHNhbXBsaW5nLiBUaGUgc2FtcGxpbmdcbiAqIGhhcHBlbnMgcGVyaW9kaWNhbGx5IGluIHRpbWUgZXZlcnkgYHBlcmlvZGAgbWlsbGlzZWNvbmRzIChvciB0aGUgdGltZSB1bml0XG4gKiBkZWZpbmVkIGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYCBhcmd1bWVudCkuIFRoZSBzYW1wbGluZyBzdGFydHMgYXMgc29vbiBhc1xuICogdGhlIG91dHB1dCBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRXZlcnkgc2Vjb25kLCBlbWl0IHRoZSBtb3N0IHJlY2VudCBjbGljayBhdCBtb3N0IG9uY2VcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShzYW1wbGVUaW1lKDEwMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdFRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZVRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlVGltZX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcGVyaW9kIFRoZSBzYW1wbGluZyBwZXJpb2QgZXhwcmVzc2VkIGluIG1pbGxpc2Vjb25kcyBvciB0aGVcbiAqIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHNhbXBsaW5nLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHRzIG9mIHNhbXBsaW5nIHRoZVxuICogdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGF0IHRoZSBzcGVjaWZpZWQgdGltZSBpbnRlcnZhbC5cbiAqIEBtZXRob2Qgc2FtcGxlVGltZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZVRpbWU8VD4ocGVyaW9kOiBudW1iZXIsIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTYW1wbGVUaW1lT3BlcmF0b3IocGVyaW9kLCBzY2hlZHVsZXIpKTtcbn1cblxuY2xhc3MgU2FtcGxlVGltZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlcmlvZDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTYW1wbGVUaW1lU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnBlcmlvZCwgdGhpcy5zY2hlZHVsZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU2FtcGxlVGltZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgbGFzdFZhbHVlOiBUO1xuICBoYXNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBlcmlvZDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2hOb3RpZmljYXRpb24sIHBlcmlvZCwgeyBzdWJzY3JpYmVyOiB0aGlzLCBwZXJpb2QgfSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmhhc1ZhbHVlID0gdHJ1ZTtcbiAgfVxuXG4gIG5vdGlmeU5leHQoKSB7XG4gICAgaWYgKHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMuaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLmxhc3RWYWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTm90aWZpY2F0aW9uPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGxldCB7IHN1YnNjcmliZXIsIHBlcmlvZCB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubm90aWZ5TmV4dCgpO1xuICB0aGlzLnNjaGVkdWxlKHN0YXRlLCBwZXJpb2QpO1xufVxuIl19