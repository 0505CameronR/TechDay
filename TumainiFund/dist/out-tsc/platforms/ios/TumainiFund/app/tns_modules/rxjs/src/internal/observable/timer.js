import { Observable } from '../Observable';
import { async } from '../scheduler/async';
import { isNumeric } from '../util/isNumeric';
import { isScheduler } from '../util/isScheduler';
/**
 * Creates an Observable that starts emitting after an `dueTime` and
 * emits ever increasing numbers after each `period` of time thereafter.
 *
 * <span class="informal">Its like {@link index/interval}, but you can specify when
 * should the emissions start.</span>
 *
 * ![](timer.png)
 *
 * `timer` returns an Observable that emits an infinite sequence of ascending
 * integers, with a constant interval of time, `period` of your choosing
 * between those emissions. The first emission happens after the specified
 * `dueTime`. The initial delay may be a `Date`. By default, this
 * operator uses the {@link asyncScheduler} {@link SchedulerLike} to provide a notion of time, but you
 * may pass any {@link SchedulerLike} to it. If `period` is not specified, the output
 * Observable emits only one value, `0`. Otherwise, it emits an infinite
 * sequence.
 *
 * ## Examples
 * ### Emits ascending numbers, one every second (1000ms), starting after 3 seconds
 * ```javascript
 * import { timer } from 'rxjs';
 *
 * const numbers = timer(3000, 1000);
 * numbers.subscribe(x => console.log(x));
 * ```
 *
 * ### Emits one number after five seconds
 * ```javascript
 * import { timer } from 'rxjs';
 *
 * const numbers = timer(5000);
 * numbers.subscribe(x => console.log(x));
 * ```
 * @see {@link index/interval}
 * @see {@link delay}
 *
 * @param {number|Date} [dueTime] The initial delay time specified as a Date object or as an integer denoting
 * milliseconds to wait before emitting the first value of 0`.
 * @param {number|SchedulerLike} [periodOrScheduler] The period of time between emissions of the
 * subsequent numbers.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for scheduling
 * the emission of values, and providing a notion of "time".
 * @return {Observable} An Observable that emits a `0` after the
 * `dueTime` and ever increasing numbers after each `period` of time
 * thereafter.
 * @static true
 * @name timer
 * @owner Observable
 */
export function timer(dueTime = 0, periodOrScheduler, scheduler) {
    let period = -1;
    if (isNumeric(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    }
    else if (isScheduler(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!isScheduler(scheduler)) {
        scheduler = async;
    }
    return new Observable(subscriber => {
        const due = isNumeric(dueTime)
            ? dueTime
            : (+dueTime - scheduler.now());
        return scheduler.schedule(dispatch, due, {
            index: 0, period, subscriber
        });
    });
}
function dispatch(state) {
    const { index, period, subscriber } = state;
    subscriber.next(index);
    if (subscriber.closed) {
        return;
    }
    else if (period === -1) {
        return subscriber.complete();
    }
    state.index = index + 1;
    this.schedule(state, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3RpbWVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFHbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFVBQXlCLENBQUMsRUFDMUIsaUJBQTBDLEVBQzFDLFNBQXlCO0lBQzdDLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLElBQUksU0FBUyxDQUFDLGlCQUFpQixDQUFDLEVBQUU7UUFDaEMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7S0FDMUU7U0FBTSxJQUFJLFdBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1FBQ3pDLFNBQVMsR0FBRyxpQkFBd0IsQ0FBQztLQUN0QztJQUVELElBQUksQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDM0IsU0FBUyxHQUFHLEtBQUssQ0FBQztLQUNuQjtJQUVELE9BQU8sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDakMsTUFBTSxHQUFHLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQztZQUM1QixDQUFDLENBQUUsT0FBa0I7WUFDckIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFFakMsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxHQUFHLEVBQUU7WUFDdkMsS0FBSyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsVUFBVTtTQUM3QixDQUFDLENBQUM7SUFDTCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFRRCxTQUFTLFFBQVEsQ0FBb0MsS0FBaUI7SUFDcEUsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLEdBQUcsS0FBSyxDQUFDO0lBQzVDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLE9BQU87S0FDUjtTQUFNLElBQUksTUFBTSxLQUFLLENBQUMsQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO0tBQzlCO0lBRUQsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQ3hCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQy9CLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IHN0YXJ0cyBlbWl0dGluZyBhZnRlciBhbiBgZHVlVGltZWAgYW5kXG4gKiBlbWl0cyBldmVyIGluY3JlYXNpbmcgbnVtYmVycyBhZnRlciBlYWNoIGBwZXJpb2RgIG9mIHRpbWUgdGhlcmVhZnRlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXRzIGxpa2Uge0BsaW5rIGluZGV4L2ludGVydmFsfSwgYnV0IHlvdSBjYW4gc3BlY2lmeSB3aGVuXG4gKiBzaG91bGQgdGhlIGVtaXNzaW9ucyBzdGFydC48L3NwYW4+XG4gKlxuICogIVtdKHRpbWVyLnBuZylcbiAqXG4gKiBgdGltZXJgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mIGFzY2VuZGluZ1xuICogaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lLCBgcGVyaW9kYCBvZiB5b3VyIGNob29zaW5nXG4gKiBiZXR3ZWVuIHRob3NlIGVtaXNzaW9ucy4gVGhlIGZpcnN0IGVtaXNzaW9uIGhhcHBlbnMgYWZ0ZXIgdGhlIHNwZWNpZmllZFxuICogYGR1ZVRpbWVgLiBUaGUgaW5pdGlhbCBkZWxheSBtYXkgYmUgYSBgRGF0ZWAuIEJ5IGRlZmF1bHQsIHRoaXNcbiAqIG9wZXJhdG9yIHVzZXMgdGhlIHtAbGluayBhc3luY1NjaGVkdWxlcn0ge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHByb3ZpZGUgYSBub3Rpb24gb2YgdGltZSwgYnV0IHlvdVxuICogbWF5IHBhc3MgYW55IHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBpdC4gSWYgYHBlcmlvZGAgaXMgbm90IHNwZWNpZmllZCwgdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBlbWl0cyBvbmx5IG9uZSB2YWx1ZSwgYDBgLiBPdGhlcndpc2UsIGl0IGVtaXRzIGFuIGluZmluaXRlXG4gKiBzZXF1ZW5jZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIEVtaXRzIGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kICgxMDAwbXMpLCBzdGFydGluZyBhZnRlciAzIHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRpbWVyIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDMwMDAsIDEwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgRW1pdHMgb25lIG51bWJlciBhZnRlciBmaXZlIHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHRpbWVyIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDUwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gW2R1ZVRpbWVdIFRoZSBpbml0aWFsIGRlbGF5IHRpbWUgc3BlY2lmaWVkIGFzIGEgRGF0ZSBvYmplY3Qgb3IgYXMgYW4gaW50ZWdlciBkZW5vdGluZ1xuICogbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGVtaXR0aW5nIHRoZSBmaXJzdCB2YWx1ZSBvZiAwYC5cbiAqIEBwYXJhbSB7bnVtYmVyfFNjaGVkdWxlckxpa2V9IFtwZXJpb2RPclNjaGVkdWxlcl0gVGhlIHBlcmlvZCBvZiB0aW1lIGJldHdlZW4gZW1pc3Npb25zIG9mIHRoZVxuICogc3Vic2VxdWVudCBudW1iZXJzLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHZhbHVlcywgYW5kIHByb3ZpZGluZyBhIG5vdGlvbiBvZiBcInRpbWVcIi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIGAwYCBhZnRlciB0aGVcbiAqIGBkdWVUaW1lYCBhbmQgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lXG4gKiB0aGVyZWFmdGVyLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aW1lclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWU6IG51bWJlciB8IERhdGUgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZE9yU2NoZWR1bGVyPzogbnVtYmVyIHwgU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgbGV0IHBlcmlvZCA9IC0xO1xuICBpZiAoaXNOdW1lcmljKHBlcmlvZE9yU2NoZWR1bGVyKSkge1xuICAgIHBlcmlvZCA9IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcikgPCAxICYmIDEgfHwgTnVtYmVyKHBlcmlvZE9yU2NoZWR1bGVyKTtcbiAgfSBlbHNlIGlmIChpc1NjaGVkdWxlcihwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBwZXJpb2RPclNjaGVkdWxlciBhcyBhbnk7XG4gIH1cblxuICBpZiAoIWlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBkdWUgPSBpc051bWVyaWMoZHVlVGltZSlcbiAgICAgID8gKGR1ZVRpbWUgYXMgbnVtYmVyKVxuICAgICAgOiAoK2R1ZVRpbWUgLSBzY2hlZHVsZXIubm93KCkpO1xuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgZHVlLCB7XG4gICAgICBpbmRleDogMCwgcGVyaW9kLCBzdWJzY3JpYmVyXG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVGltZXJTdGF0ZSB7XG4gIGluZGV4OiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUaW1lclN0YXRlPiwgc3RhdGU6IFRpbWVyU3RhdGUpIHtcbiAgY29uc3QgeyBpbmRleCwgcGVyaW9kLCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcbiAgc3Vic2NyaWJlci5uZXh0KGluZGV4KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAocGVyaW9kID09PSAtMSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgcGVyaW9kKTtcbn1cbiJdfQ==