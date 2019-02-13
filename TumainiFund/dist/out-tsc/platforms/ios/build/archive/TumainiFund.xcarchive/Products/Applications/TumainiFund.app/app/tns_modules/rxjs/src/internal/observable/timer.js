"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var async_1 = require("../scheduler/async");
var isNumeric_1 = require("../util/isNumeric");
var isScheduler_1 = require("../util/isScheduler");
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
 * const numbers = timer(3000, 1000);
 * numbers.subscribe(x => console.log(x));
 * ```
 *
 * ### Emits one number after five seconds
 * ```javascript
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
function timer(dueTime, periodOrScheduler, scheduler) {
    if (dueTime === void 0) { dueTime = 0; }
    var period = -1;
    if (isNumeric_1.isNumeric(periodOrScheduler)) {
        period = Number(periodOrScheduler) < 1 && 1 || Number(periodOrScheduler);
    }
    else if (isScheduler_1.isScheduler(periodOrScheduler)) {
        scheduler = periodOrScheduler;
    }
    if (!isScheduler_1.isScheduler(scheduler)) {
        scheduler = async_1.async;
    }
    return new Observable_1.Observable(function (subscriber) {
        var due = isNumeric_1.isNumeric(dueTime)
            ? dueTime
            : (+dueTime - scheduler.now());
        return scheduler.schedule(dispatch, due, {
            index: 0, period: period, subscriber: subscriber
        });
    });
}
exports.timer = timer;
function dispatch(state) {
    var index = state.index, period = state.period, subscriber = state.subscriber;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvdGltZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsNENBQTJDO0FBQzNDLCtDQUE4QztBQUM5QyxtREFBa0Q7QUFHbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUNILFNBQWdCLEtBQUssQ0FBQyxPQUEwQixFQUMxQixpQkFBMEMsRUFDMUMsU0FBeUI7SUFGekIsd0JBQUEsRUFBQSxXQUEwQjtJQUc5QyxJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUNoQixJQUFJLHFCQUFTLENBQUMsaUJBQWlCLENBQUMsRUFBRTtRQUNoQyxNQUFNLEdBQUcsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztLQUMxRTtTQUFNLElBQUkseUJBQVcsQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO1FBQ3pDLFNBQVMsR0FBRyxpQkFBd0IsQ0FBQztLQUN0QztJQUVELElBQUksQ0FBQyx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1FBQzNCLFNBQVMsR0FBRyxhQUFLLENBQUM7S0FDbkI7SUFFRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFBLFVBQVU7UUFDOUIsSUFBTSxHQUFHLEdBQUcscUJBQVMsQ0FBQyxPQUFPLENBQUM7WUFDNUIsQ0FBQyxDQUFFLE9BQWtCO1lBQ3JCLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1FBRWpDLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsR0FBRyxFQUFFO1lBQ3ZDLEtBQUssRUFBRSxDQUFDLEVBQUUsTUFBTSxRQUFBLEVBQUUsVUFBVSxZQUFBO1NBQzdCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXZCRCxzQkF1QkM7QUFRRCxTQUFTLFFBQVEsQ0FBb0MsS0FBaUI7SUFDNUQsSUFBQSxtQkFBSyxFQUFFLHFCQUFNLEVBQUUsNkJBQVUsQ0FBVztJQUM1QyxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXZCLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUNyQixPQUFPO0tBQ1I7U0FBTSxJQUFJLE1BQU0sS0FBSyxDQUFDLENBQUMsRUFBRTtRQUN4QixPQUFPLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztLQUM5QjtJQUVELEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN4QixJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBzdGFydHMgZW1pdHRpbmcgYWZ0ZXIgYW4gYGR1ZVRpbWVgIGFuZFxuICogZW1pdHMgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lIHRoZXJlYWZ0ZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0cyBsaWtlIHtAbGluayBpbmRleC9pbnRlcnZhbH0sIGJ1dCB5b3UgY2FuIHNwZWNpZnkgd2hlblxuICogc2hvdWxkIHRoZSBlbWlzc2lvbnMgc3RhcnQuPC9zcGFuPlxuICpcbiAqICFbXSh0aW1lci5wbmcpXG4gKlxuICogYHRpbWVyYCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBpbmZpbml0ZSBzZXF1ZW5jZSBvZiBhc2NlbmRpbmdcbiAqIGludGVnZXJzLCB3aXRoIGEgY29uc3RhbnQgaW50ZXJ2YWwgb2YgdGltZSwgYHBlcmlvZGAgb2YgeW91ciBjaG9vc2luZ1xuICogYmV0d2VlbiB0aG9zZSBlbWlzc2lvbnMuIFRoZSBmaXJzdCBlbWlzc2lvbiBoYXBwZW5zIGFmdGVyIHRoZSBzcGVjaWZpZWRcbiAqIGBkdWVUaW1lYC4gVGhlIGluaXRpYWwgZGVsYXkgbWF5IGJlIGEgYERhdGVgLiBCeSBkZWZhdWx0LCB0aGlzXG4gKiBvcGVyYXRvciB1c2VzIHRoZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBwcm92aWRlIGEgbm90aW9uIG9mIHRpbWUsIGJ1dCB5b3VcbiAqIG1heSBwYXNzIGFueSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gaXQuIElmIGBwZXJpb2RgIGlzIG5vdCBzcGVjaWZpZWQsIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUgZW1pdHMgb25seSBvbmUgdmFsdWUsIGAwYC4gT3RoZXJ3aXNlLCBpdCBlbWl0cyBhbiBpbmZpbml0ZVxuICogc2VxdWVuY2UuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKSwgc3RhcnRpbmcgYWZ0ZXIgMyBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gdGltZXIoMzAwMCwgMTAwMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBFbWl0cyBvbmUgbnVtYmVyIGFmdGVyIGZpdmUgc2Vjb25kc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHRpbWVyKDUwMDApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gW2R1ZVRpbWVdIFRoZSBpbml0aWFsIGRlbGF5IHRpbWUgc3BlY2lmaWVkIGFzIGEgRGF0ZSBvYmplY3Qgb3IgYXMgYW4gaW50ZWdlciBkZW5vdGluZ1xuICogbWlsbGlzZWNvbmRzIHRvIHdhaXQgYmVmb3JlIGVtaXR0aW5nIHRoZSBmaXJzdCB2YWx1ZSBvZiAwYC5cbiAqIEBwYXJhbSB7bnVtYmVyfFNjaGVkdWxlckxpa2V9IFtwZXJpb2RPclNjaGVkdWxlcl0gVGhlIHBlcmlvZCBvZiB0aW1lIGJldHdlZW4gZW1pc3Npb25zIG9mIHRoZVxuICogc3Vic2VxdWVudCBudW1iZXJzLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHZhbHVlcywgYW5kIHByb3ZpZGluZyBhIG5vdGlvbiBvZiBcInRpbWVcIi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIGAwYCBhZnRlciB0aGVcbiAqIGBkdWVUaW1lYCBhbmQgZXZlciBpbmNyZWFzaW5nIG51bWJlcnMgYWZ0ZXIgZWFjaCBgcGVyaW9kYCBvZiB0aW1lXG4gKiB0aGVyZWFmdGVyLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB0aW1lclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVyKGR1ZVRpbWU6IG51bWJlciB8IERhdGUgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgIHBlcmlvZE9yU2NoZWR1bGVyPzogbnVtYmVyIHwgU2NoZWR1bGVyTGlrZSxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgbGV0IHBlcmlvZCA9IC0xO1xuICBpZiAoaXNOdW1lcmljKHBlcmlvZE9yU2NoZWR1bGVyKSkge1xuICAgIHBlcmlvZCA9IE51bWJlcihwZXJpb2RPclNjaGVkdWxlcikgPCAxICYmIDEgfHwgTnVtYmVyKHBlcmlvZE9yU2NoZWR1bGVyKTtcbiAgfSBlbHNlIGlmIChpc1NjaGVkdWxlcihwZXJpb2RPclNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBwZXJpb2RPclNjaGVkdWxlciBhcyBhbnk7XG4gIH1cblxuICBpZiAoIWlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBkdWUgPSBpc051bWVyaWMoZHVlVGltZSlcbiAgICAgID8gKGR1ZVRpbWUgYXMgbnVtYmVyKVxuICAgICAgOiAoK2R1ZVRpbWUgLSBzY2hlZHVsZXIubm93KCkpO1xuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgZHVlLCB7XG4gICAgICBpbmRleDogMCwgcGVyaW9kLCBzdWJzY3JpYmVyXG4gICAgfSk7XG4gIH0pO1xufVxuXG5pbnRlcmZhY2UgVGltZXJTdGF0ZSB7XG4gIGluZGV4OiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUaW1lclN0YXRlPiwgc3RhdGU6IFRpbWVyU3RhdGUpIHtcbiAgY29uc3QgeyBpbmRleCwgcGVyaW9kLCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcbiAgc3Vic2NyaWJlci5uZXh0KGluZGV4KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH0gZWxzZSBpZiAocGVyaW9kID09PSAtMSkge1xuICAgIHJldHVybiBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgcGVyaW9kKTtcbn1cbiJdfQ==