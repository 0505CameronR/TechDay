import { Subscriber } from '../Subscriber';
import { async } from '../scheduler/async';
import { defaultThrottleConfig } from './throttle';
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for `duration` milliseconds, then repeats this process.
 *
 * <span class="informal">Lets a value pass, then ignores source values for the
 * next `duration` milliseconds.</span>
 *
 * ![](throttleTime.png)
 *
 * `throttleTime` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled. After `duration` milliseconds (or the time unit determined
 * internally by the optional `scheduler`) has passed, the timer is disabled,
 * and this process repeats for the next source value. Optionally takes a
 * {@link SchedulerLike} for managing timers.
 *
 * ## Example
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(throttleTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {number} duration Time to wait before emitting another value after
 * emitting the last value, measured in milliseconds or the time unit determined
 * internally by the optional `scheduler`.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the throttling.
 * @param {Object} config a configuration object to define `leading` and
 * `trailing` behavior. Defaults to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttleTime
 * @owner Observable
 */
export function throttleTime(duration, scheduler = async, config = defaultThrottleConfig) {
    return (source) => source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing));
}
class ThrottleTimeOperator {
    constructor(duration, scheduler, leading, trailing) {
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
    }
    call(subscriber, source) {
        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ThrottleTimeSubscriber extends Subscriber {
    constructor(destination, duration, scheduler, leading, trailing) {
        super(destination);
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
        this._hasTrailingValue = false;
        this._trailingValue = null;
    }
    _next(value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
        }
    }
    _complete() {
        if (this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this.destination.complete();
        }
        else {
            this.destination.complete();
        }
    }
    clearThrottle() {
        const throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    }
}
function dispatchNext(arg) {
    const { subscriber } = arg;
    subscriber.clearThrottle();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGVUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rocm90dGxlVGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUUzQyxPQUFPLEVBQWtCLHFCQUFxQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR25FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBSSxRQUFnQixFQUNoQixZQUEyQixLQUFLLEVBQ2hDLFNBQXlCLHFCQUFxQjtJQUM1RSxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNoSSxDQUFDO0FBRUQsTUFBTSxvQkFBb0I7SUFDeEIsWUFBb0IsUUFBZ0IsRUFDaEIsU0FBd0IsRUFDeEIsT0FBZ0IsRUFDaEIsUUFBaUI7UUFIakIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUNyQyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ3JCLElBQUksc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDbkcsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLHNCQUEwQixTQUFRLFVBQWE7SUFLbkQsWUFBWSxXQUEwQixFQUNsQixRQUFnQixFQUNoQixTQUF3QixFQUN4QixPQUFnQixFQUNoQixRQUFpQjtRQUNuQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFKRCxhQUFRLEdBQVIsUUFBUSxDQUFRO1FBQ2hCLGNBQVMsR0FBVCxTQUFTLENBQWU7UUFDeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO1FBUDdCLHNCQUFpQixHQUFZLEtBQUssQ0FBQztRQUNuQyxtQkFBYyxHQUFNLElBQUksQ0FBQztJQVFqQyxDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLGNBQWMsR0FBRyxLQUFLLENBQUM7Z0JBQzVCLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLENBQUM7YUFDL0I7U0FDRjthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFpQixZQUFZLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLFVBQVUsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEgsSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUM5QjtTQUNGO0lBQ0gsQ0FBQztJQUVTLFNBQVM7UUFDakIsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1lBQzNDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQsYUFBYTtRQUNYLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFDakMsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO2dCQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzNDLElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDO2dCQUMzQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsS0FBSyxDQUFDO2FBQ2hDO1lBQ0QsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDdkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDdkI7SUFDSCxDQUFDO0NBQ0Y7QUFNRCxTQUFTLFlBQVksQ0FBSSxHQUFtQjtJQUMxQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsR0FBRyxDQUFDO0lBQzNCLFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVGhyb3R0bGVDb25maWcsIGRlZmF1bHRUaHJvdHRsZUNvbmZpZyB9IGZyb20gJy4vdGhyb3R0bGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUsIHRoZW4gaWdub3JlcyBzdWJzZXF1ZW50IHNvdXJjZVxuICogdmFsdWVzIGZvciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcywgdGhlbiByZXBlYXRzIHRoaXMgcHJvY2Vzcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TGV0cyBhIHZhbHVlIHBhc3MsIHRoZW4gaWdub3JlcyBzb3VyY2UgdmFsdWVzIGZvciB0aGVcbiAqIG5leHQgYGR1cmF0aW9uYCBtaWxsaXNlY29uZHMuPC9zcGFuPlxuICpcbiAqICFbXSh0aHJvdHRsZVRpbWUucG5nKVxuICpcbiAqIGB0aHJvdHRsZVRpbWVgIGVtaXRzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlXG4gKiB3aGVuIGl0cyBpbnRlcm5hbCB0aW1lciBpcyBkaXNhYmxlZCwgYW5kIGlnbm9yZXMgc291cmNlIHZhbHVlcyB3aGVuIHRoZSB0aW1lclxuICogaXMgZW5hYmxlZC4gSW5pdGlhbGx5LCB0aGUgdGltZXIgaXMgZGlzYWJsZWQuIEFzIHNvb24gYXMgdGhlIGZpcnN0IHNvdXJjZVxuICogdmFsdWUgYXJyaXZlcywgaXQgaXMgZm9yd2FyZGVkIHRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYW5kIHRoZW4gdGhlIHRpbWVyXG4gKiBpcyBlbmFibGVkLiBBZnRlciBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcyAob3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkXG4gKiBpbnRlcm5hbGx5IGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYCkgaGFzIHBhc3NlZCwgdGhlIHRpbWVyIGlzIGRpc2FibGVkLFxuICogYW5kIHRoaXMgcHJvY2VzcyByZXBlYXRzIGZvciB0aGUgbmV4dCBzb3VyY2UgdmFsdWUuIE9wdGlvbmFsbHkgdGFrZXMgYVxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGZvciBtYW5hZ2luZyB0aW1lcnMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdCBjbGlja3MgYXQgYSByYXRlIG9mIGF0IG1vc3Qgb25lIGNsaWNrIHBlciBzZWNvbmRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZSh0aHJvdHRsZVRpbWUoMTAwMCkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGF1ZGl0VGltZX1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlVGltZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICogQHNlZSB7QGxpbmsgc2FtcGxlVGltZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdXJhdGlvbiBUaW1lIHRvIHdhaXQgYmVmb3JlIGVtaXR0aW5nIGFub3RoZXIgdmFsdWUgYWZ0ZXJcbiAqIGVtaXR0aW5nIHRoZSBsYXN0IHZhbHVlLCBtZWFzdXJlZCBpbiBtaWxsaXNlY29uZHMgb3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkXG4gKiBpbnRlcm5hbGx5IGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yXG4gKiBtYW5hZ2luZyB0aGUgdGltZXJzIHRoYXQgaGFuZGxlIHRoZSB0aHJvdHRsaW5nLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIGRlZmluZSBgbGVhZGluZ2AgYW5kXG4gKiBgdHJhaWxpbmdgIGJlaGF2aW9yLiBEZWZhdWx0cyB0byBgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogZmFsc2UgfWAuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgcGVyZm9ybXMgdGhlIHRocm90dGxlIG9wZXJhdGlvbiB0b1xuICogbGltaXQgdGhlIHJhdGUgb2YgZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZS5cbiAqIEBtZXRob2QgdGhyb3R0bGVUaW1lXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGVUaW1lPFQ+KGR1cmF0aW9uOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IFRocm90dGxlQ29uZmlnID0gZGVmYXVsdFRocm90dGxlQ29uZmlnKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBUaHJvdHRsZVRpbWVPcGVyYXRvcihkdXJhdGlvbiwgc2NoZWR1bGVyLCBjb25maWcubGVhZGluZywgY29uZmlnLnRyYWlsaW5nKSk7XG59XG5cbmNsYXNzIFRocm90dGxlVGltZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICBwcml2YXRlIGxlYWRpbmc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdHJhaWxpbmc6IGJvb2xlYW4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShcbiAgICAgIG5ldyBUaHJvdHRsZVRpbWVTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZHVyYXRpb24sIHRoaXMuc2NoZWR1bGVyLCB0aGlzLmxlYWRpbmcsIHRoaXMudHJhaWxpbmcpXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGhyb3R0bGVUaW1lU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHRocm90dGxlZDogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9oYXNUcmFpbGluZ1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgX3RyYWlsaW5nVmFsdWU6IFQgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlLFxuICAgICAgICAgICAgICBwcml2YXRlIGxlYWRpbmc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdHJhaWxpbmc6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy50aHJvdHRsZWQpIHtcbiAgICAgIGlmICh0aGlzLnRyYWlsaW5nKSB7XG4gICAgICAgIHRoaXMuX3RyYWlsaW5nVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgdGhpcy5faGFzVHJhaWxpbmdWYWx1ZSA9IHRydWU7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkKHRoaXMudGhyb3R0bGVkID0gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hBcmc8VD4+KGRpc3BhdGNoTmV4dCwgdGhpcy5kdXJhdGlvbiwgeyBzdWJzY3JpYmVyOiB0aGlzIH0pKTtcbiAgICAgIGlmICh0aGlzLmxlYWRpbmcpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGlmICh0aGlzLl9oYXNUcmFpbGluZ1ZhbHVlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5fdHJhaWxpbmdWYWx1ZSk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhclRocm90dGxlKCkge1xuICAgIGNvbnN0IHRocm90dGxlZCA9IHRoaXMudGhyb3R0bGVkO1xuICAgIGlmICh0aHJvdHRsZWQpIHtcbiAgICAgIGlmICh0aGlzLnRyYWlsaW5nICYmIHRoaXMuX2hhc1RyYWlsaW5nVmFsdWUpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHRoaXMuX3RyYWlsaW5nVmFsdWUpO1xuICAgICAgICB0aGlzLl90cmFpbGluZ1ZhbHVlID0gbnVsbDtcbiAgICAgICAgdGhpcy5faGFzVHJhaWxpbmdWYWx1ZSA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgdGhyb3R0bGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnJlbW92ZSh0aHJvdHRsZWQpO1xuICAgICAgdGhpcy50aHJvdHRsZWQgPSBudWxsO1xuICAgIH1cbiAgfVxufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hBcmc8VD4ge1xuICBzdWJzY3JpYmVyOiBUaHJvdHRsZVRpbWVTdWJzY3JpYmVyPFQ+O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQ8VD4oYXJnOiBEaXNwYXRjaEFyZzxUPikge1xuICBjb25zdCB7IHN1YnNjcmliZXIgfSA9IGFyZztcbiAgc3Vic2NyaWJlci5jbGVhclRocm90dGxlKCk7XG59XG4iXX0=