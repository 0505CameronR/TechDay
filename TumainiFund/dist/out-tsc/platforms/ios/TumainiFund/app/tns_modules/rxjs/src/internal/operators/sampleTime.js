import { Subscriber } from '../Subscriber';
import { async } from '../scheduler/async';
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
 * import { fromEvent } from 'rxjs';
 * import { sampleTime } from 'rxjs/operators';
 *
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
export function sampleTime(period, scheduler = async) {
    return (source) => source.lift(new SampleTimeOperator(period, scheduler));
}
class SampleTimeOperator {
    constructor(period, scheduler) {
        this.period = period;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new SampleTimeSubscriber(subscriber, this.period, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SampleTimeSubscriber extends Subscriber {
    constructor(destination, period, scheduler) {
        super(destination);
        this.period = period;
        this.scheduler = scheduler;
        this.hasValue = false;
        this.add(scheduler.schedule(dispatchNotification, period, { subscriber: this, period }));
    }
    _next(value) {
        this.lastValue = value;
        this.hasValue = true;
    }
    notifyNext() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.lastValue);
        }
    }
}
function dispatchNotification(state) {
    let { subscriber, period } = state;
    subscriber.notifyNext();
    this.schedule(state, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlVGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zYW1wbGVUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlDRztBQUNILE1BQU0sVUFBVSxVQUFVLENBQUksTUFBYyxFQUFFLFlBQTJCLEtBQUs7SUFDNUUsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztBQUMzRixDQUFDO0FBRUQsTUFBTSxrQkFBa0I7SUFDdEIsWUFBb0IsTUFBYyxFQUNkLFNBQXdCO1FBRHhCLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQzVDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQzdGLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLG9CQUF3QixTQUFRLFVBQWE7SUFJakQsWUFBWSxXQUEwQixFQUNsQixNQUFjLEVBQ2QsU0FBd0I7UUFDMUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRkQsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFKNUMsYUFBUSxHQUFZLEtBQUssQ0FBQztRQU14QixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsb0JBQW9CLEVBQUUsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxVQUFVO1FBQ1IsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN2QztJQUNILENBQUM7Q0FDRjtBQUVELFNBQVMsb0JBQW9CLENBQWdDLEtBQVU7SUFDckUsSUFBSSxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDbkMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIHRoZSBtb3N0IHJlY2VudGx5IGVtaXR0ZWQgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aGluXG4gKiBwZXJpb2RpYyB0aW1lIGludGVydmFscy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+U2FtcGxlcyB0aGUgc291cmNlIE9ic2VydmFibGUgYXQgcGVyaW9kaWMgdGltZVxuICogaW50ZXJ2YWxzLCBlbWl0dGluZyB3aGF0IGl0IHNhbXBsZXMuPC9zcGFuPlxuICpcbiAqICFbXShzYW1wbGVUaW1lLnBuZylcbiAqXG4gKiBgc2FtcGxlVGltZWAgcGVyaW9kaWNhbGx5IGxvb2tzIGF0IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhbmQgZW1pdHMgd2hpY2hldmVyXG4gKiB2YWx1ZSBpdCBoYXMgbW9zdCByZWNlbnRseSBlbWl0dGVkIHNpbmNlIHRoZSBwcmV2aW91cyBzYW1wbGluZywgdW5sZXNzIHRoZVxuICogc291cmNlIGhhcyBub3QgZW1pdHRlZCBhbnl0aGluZyBzaW5jZSB0aGUgcHJldmlvdXMgc2FtcGxpbmcuIFRoZSBzYW1wbGluZ1xuICogaGFwcGVucyBwZXJpb2RpY2FsbHkgaW4gdGltZSBldmVyeSBgcGVyaW9kYCBtaWxsaXNlY29uZHMgKG9yIHRoZSB0aW1lIHVuaXRcbiAqIGRlZmluZWQgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgIGFyZ3VtZW50KS4gVGhlIHNhbXBsaW5nIHN0YXJ0cyBhcyBzb29uIGFzXG4gKiB0aGUgb3V0cHV0IE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFdmVyeSBzZWNvbmQsIGVtaXQgdGhlIG1vc3QgcmVjZW50IGNsaWNrIGF0IG1vc3Qgb25jZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBzYW1wbGVUaW1lIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShzYW1wbGVUaW1lKDEwMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdFRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZVRpbWV9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlVGltZX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gcGVyaW9kIFRoZSBzYW1wbGluZyBwZXJpb2QgZXhwcmVzc2VkIGluIG1pbGxpc2Vjb25kcyBvciB0aGVcbiAqIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHNhbXBsaW5nLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSByZXN1bHRzIG9mIHNhbXBsaW5nIHRoZVxuICogdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGF0IHRoZSBzcGVjaWZpZWQgdGltZSBpbnRlcnZhbC5cbiAqIEBtZXRob2Qgc2FtcGxlVGltZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNhbXBsZVRpbWU8VD4ocGVyaW9kOiBudW1iZXIsIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTYW1wbGVUaW1lT3BlcmF0b3IocGVyaW9kLCBzY2hlZHVsZXIpKTtcbn1cblxuY2xhc3MgU2FtcGxlVGltZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBlcmlvZDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTYW1wbGVUaW1lU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnBlcmlvZCwgdGhpcy5zY2hlZHVsZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU2FtcGxlVGltZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgbGFzdFZhbHVlOiBUO1xuICBoYXNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBlcmlvZDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2hOb3RpZmljYXRpb24sIHBlcmlvZCwgeyBzdWJzY3JpYmVyOiB0aGlzLCBwZXJpb2QgfSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmhhc1ZhbHVlID0gdHJ1ZTtcbiAgfVxuXG4gIG5vdGlmeU5leHQoKSB7XG4gICAgaWYgKHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMuaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLmxhc3RWYWx1ZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTm90aWZpY2F0aW9uPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGxldCB7IHN1YnNjcmliZXIsIHBlcmlvZCB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubm90aWZ5TmV4dCgpO1xuICB0aGlzLnNjaGVkdWxlKHN0YXRlLCBwZXJpb2QpO1xufVxuIl19