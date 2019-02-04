"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var async_1 = require("../scheduler/async");
var isNumeric_1 = require("../util/isNumeric");
/**
 * Creates an Observable that emits sequential numbers every specified
 * interval of time, on a specified {@link SchedulerLike}.
 *
 * <span class="informal">Emits incremental numbers periodically in time.
 * </span>
 *
 * ![](interval.png)
 *
 * `interval` returns an Observable that emits an infinite sequence of
 * ascending integers, with a constant interval of time of your choosing
 * between those emissions. The first emission is not sent immediately, but
 * only after the first period has passed. By default, this operator uses the
 * `async` {@link SchedulerLike} to provide a notion of time, but you may pass any
 * {@link SchedulerLike} to it.
 *
 * ## Example
 * Emits ascending numbers, one every second (1000ms) up to the number 3
 * ```javascript
 * import { interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const numbers = interval(1000);
 *
 * const takeFourNumbers = numbers.pipe(take(4));
 *
 * takeFourNumbers.subscribe(x => console.log('Next: ', x));
 *
 * // Logs:
 * // Next: 0
 * // Next: 1
 * // Next: 2
 * // Next: 3
 * ```
 *
 * @see {@link timer}
 * @see {@link delay}
 *
 * @param {number} [period=0] The interval size in milliseconds (by default)
 * or the time unit determined by the scheduler's clock.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for scheduling
 * the emission of values, and providing a notion of "time".
 * @return {Observable} An Observable that emits a sequential number each time
 * interval.
 * @static true
 * @name interval
 * @owner Observable
 */
function interval(period, scheduler) {
    if (period === void 0) { period = 0; }
    if (scheduler === void 0) { scheduler = async_1.async; }
    if (!isNumeric_1.isNumeric(period) || period < 0) {
        period = 0;
    }
    if (!scheduler || typeof scheduler.schedule !== 'function') {
        scheduler = async_1.async;
    }
    return new Observable_1.Observable(function (subscriber) {
        subscriber.add(scheduler.schedule(dispatch, period, { subscriber: subscriber, counter: 0, period: period }));
        return subscriber;
    });
}
exports.interval = interval;
function dispatch(state) {
    var subscriber = state.subscriber, counter = state.counter, period = state.period;
    subscriber.next(counter);
    this.schedule({ subscriber: subscriber, counter: counter + 1, period: period }, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2ludGVydmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLDRDQUEyQztBQUUzQywrQ0FBOEM7QUFHOUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0NHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFDLE1BQVUsRUFDVixTQUFnQztJQURoQyx1QkFBQSxFQUFBLFVBQVU7SUFDViwwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDdkQsSUFBSSxDQUFDLHFCQUFTLENBQUMsTUFBTSxDQUFDLElBQUksTUFBTSxHQUFHLENBQUMsRUFBRTtRQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFFRCxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sU0FBUyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7UUFDMUQsU0FBUyxHQUFHLGFBQUssQ0FBQztLQUNuQjtJQUVELE9BQU8sSUFBSSx1QkFBVSxDQUFTLFVBQUEsVUFBVTtRQUN0QyxVQUFVLENBQUMsR0FBRyxDQUNaLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLE1BQU0sRUFBRSxFQUFFLFVBQVUsWUFBQSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxRQUFBLEVBQUUsQ0FBQyxDQUN6RSxDQUFDO1FBQ0YsT0FBTyxVQUFVLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBaEJELDRCQWdCQztBQUVELFNBQVMsUUFBUSxDQUF1QyxLQUFvQjtJQUNsRSxJQUFBLDZCQUFVLEVBQUUsdUJBQU8sRUFBRSxxQkFBTSxDQUFXO0lBQzlDLFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE1BQU0sUUFBQSxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDdEUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4uL3V0aWwvaXNOdW1lcmljJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBzZXF1ZW50aWFsIG51bWJlcnMgZXZlcnkgc3BlY2lmaWVkXG4gKiBpbnRlcnZhbCBvZiB0aW1lLCBvbiBhIHNwZWNpZmllZCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGluY3JlbWVudGFsIG51bWJlcnMgcGVyaW9kaWNhbGx5IGluIHRpbWUuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGludGVydmFsLnBuZylcbiAqXG4gKiBgaW50ZXJ2YWxgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFuIGluZmluaXRlIHNlcXVlbmNlIG9mXG4gKiBhc2NlbmRpbmcgaW50ZWdlcnMsIHdpdGggYSBjb25zdGFudCBpbnRlcnZhbCBvZiB0aW1lIG9mIHlvdXIgY2hvb3NpbmdcbiAqIGJldHdlZW4gdGhvc2UgZW1pc3Npb25zLiBUaGUgZmlyc3QgZW1pc3Npb24gaXMgbm90IHNlbnQgaW1tZWRpYXRlbHksIGJ1dFxuICogb25seSBhZnRlciB0aGUgZmlyc3QgcGVyaW9kIGhhcyBwYXNzZWQuIEJ5IGRlZmF1bHQsIHRoaXMgb3BlcmF0b3IgdXNlcyB0aGVcbiAqIGBhc3luY2Age0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHByb3ZpZGUgYSBub3Rpb24gb2YgdGltZSwgYnV0IHlvdSBtYXkgcGFzcyBhbnlcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBpdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCAoMTAwMG1zKSB1cCB0byB0aGUgbnVtYmVyIDNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG51bWJlcnMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqXG4gKiBjb25zdCB0YWtlRm91ck51bWJlcnMgPSBudW1iZXJzLnBpcGUodGFrZSg0KSk7XG4gKlxuICogdGFrZUZvdXJOdW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdOZXh0OiAnLCB4KSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIE5leHQ6IDBcbiAqIC8vIE5leHQ6IDFcbiAqIC8vIE5leHQ6IDJcbiAqIC8vIE5leHQ6IDNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHRpbWVyfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtwZXJpb2Q9MF0gVGhlIGludGVydmFsIHNpemUgaW4gbWlsbGlzZWNvbmRzIChieSBkZWZhdWx0KVxuICogb3IgdGhlIHRpbWUgdW5pdCBkZXRlcm1pbmVkIGJ5IHRoZSBzY2hlZHVsZXIncyBjbG9jay5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbiBvZiB2YWx1ZXMsIGFuZCBwcm92aWRpbmcgYSBub3Rpb24gb2YgXCJ0aW1lXCIuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW50aWFsIG51bWJlciBlYWNoIHRpbWVcbiAqIGludGVydmFsLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBpbnRlcnZhbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVydmFsKHBlcmlvZCA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPYnNlcnZhYmxlPG51bWJlcj4ge1xuICBpZiAoIWlzTnVtZXJpYyhwZXJpb2QpIHx8IHBlcmlvZCA8IDApIHtcbiAgICBwZXJpb2QgPSAwO1xuICB9XG5cbiAgaWYgKCFzY2hlZHVsZXIgfHwgdHlwZW9mIHNjaGVkdWxlci5zY2hlZHVsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHNjaGVkdWxlciA9IGFzeW5jO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgc3Vic2NyaWJlci5hZGQoXG4gICAgICBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIHBlcmlvZCwgeyBzdWJzY3JpYmVyLCBjb3VudGVyOiAwLCBwZXJpb2QgfSlcbiAgICApO1xuICAgIHJldHVybiBzdWJzY3JpYmVyO1xuICB9KTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPEludGVydmFsU3RhdGU+LCBzdGF0ZTogSW50ZXJ2YWxTdGF0ZSkge1xuICBjb25zdCB7IHN1YnNjcmliZXIsIGNvdW50ZXIsIHBlcmlvZCB9ID0gc3RhdGU7XG4gIHN1YnNjcmliZXIubmV4dChjb3VudGVyKTtcbiAgdGhpcy5zY2hlZHVsZSh7IHN1YnNjcmliZXIsIGNvdW50ZXI6IGNvdW50ZXIgKyAxLCBwZXJpb2QgfSwgcGVyaW9kKTtcbn1cblxuaW50ZXJmYWNlIEludGVydmFsU3RhdGUge1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPG51bWJlcj47XG4gIGNvdW50ZXI6IG51bWJlcjtcbiAgcGVyaW9kOiBudW1iZXI7XG59XG4iXX0=