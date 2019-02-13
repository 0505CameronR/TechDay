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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvaW50ZXJ2YWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MsNENBQTJDO0FBRTNDLCtDQUE4QztBQUc5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQ0c7QUFDSCxTQUFnQixRQUFRLENBQUMsTUFBVSxFQUNWLFNBQWdDO0lBRGhDLHVCQUFBLEVBQUEsVUFBVTtJQUNWLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUN2RCxJQUFJLENBQUMscUJBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDWjtJQUVELElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxTQUFTLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtRQUMxRCxTQUFTLEdBQUcsYUFBSyxDQUFDO0tBQ25CO0lBRUQsT0FBTyxJQUFJLHVCQUFVLENBQVMsVUFBQSxVQUFVO1FBQ3RDLFVBQVUsQ0FBQyxHQUFHLENBQ1osU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsVUFBVSxZQUFBLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxNQUFNLFFBQUEsRUFBRSxDQUFDLENBQ3pFLENBQUM7UUFDRixPQUFPLFVBQVUsQ0FBQztJQUNwQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFoQkQsNEJBZ0JDO0FBRUQsU0FBUyxRQUFRLENBQXVDLEtBQW9CO0lBQ2xFLElBQUEsNkJBQVUsRUFBRSx1QkFBTyxFQUFFLHFCQUFNLENBQVc7SUFDOUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxZQUFBLEVBQUUsT0FBTyxFQUFFLE9BQU8sR0FBRyxDQUFDLEVBQUUsTUFBTSxRQUFBLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUN0RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHNlcXVlbnRpYWwgbnVtYmVycyBldmVyeSBzcGVjaWZpZWRcbiAqIGludGVydmFsIG9mIHRpbWUsIG9uIGEgc3BlY2lmaWVkIHtAbGluayBTY2hlZHVsZXJMaWtlfS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgaW5jcmVtZW50YWwgbnVtYmVycyBwZXJpb2RpY2FsbHkgaW4gdGltZS5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10oaW50ZXJ2YWwucG5nKVxuICpcbiAqIGBpbnRlcnZhbGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYW4gaW5maW5pdGUgc2VxdWVuY2Ugb2ZcbiAqIGFzY2VuZGluZyBpbnRlZ2Vycywgd2l0aCBhIGNvbnN0YW50IGludGVydmFsIG9mIHRpbWUgb2YgeW91ciBjaG9vc2luZ1xuICogYmV0d2VlbiB0aG9zZSBlbWlzc2lvbnMuIFRoZSBmaXJzdCBlbWlzc2lvbiBpcyBub3Qgc2VudCBpbW1lZGlhdGVseSwgYnV0XG4gKiBvbmx5IGFmdGVyIHRoZSBmaXJzdCBwZXJpb2QgaGFzIHBhc3NlZC4gQnkgZGVmYXVsdCwgdGhpcyBvcGVyYXRvciB1c2VzIHRoZVxuICogYGFzeW5jYCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcHJvdmlkZSBhIG5vdGlvbiBvZiB0aW1lLCBidXQgeW91IG1heSBwYXNzIGFueVxuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIGl0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXRzIGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kICgxMDAwbXMpIHVwIHRvIHRoZSBudW1iZXIgM1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgbnVtYmVycyA9IGludGVydmFsKDEwMDApO1xuICpcbiAqIGNvbnN0IHRha2VGb3VyTnVtYmVycyA9IG51bWJlcnMucGlwZSh0YWtlKDQpKTtcbiAqXG4gKiB0YWtlRm91ck51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ05leHQ6ICcsIHgpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gTmV4dDogMFxuICogLy8gTmV4dDogMVxuICogLy8gTmV4dDogMlxuICogLy8gTmV4dDogM1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgdGltZXJ9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3BlcmlvZD0wXSBUaGUgaW50ZXJ2YWwgc2l6ZSBpbiBtaWxsaXNlY29uZHMgKGJ5IGRlZmF1bHQpXG4gKiBvciB0aGUgdGltZSB1bml0IGRldGVybWluZWQgYnkgdGhlIHNjaGVkdWxlcidzIGNsb2NrLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9uIG9mIHZhbHVlcywgYW5kIHByb3ZpZGluZyBhIG5vdGlvbiBvZiBcInRpbWVcIi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbnRpYWwgbnVtYmVyIGVhY2ggdGltZVxuICogaW50ZXJ2YWwuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGludGVydmFsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaW50ZXJ2YWwocGVyaW9kID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIGlmICghaXNOdW1lcmljKHBlcmlvZCkgfHwgcGVyaW9kIDwgMCkge1xuICAgIHBlcmlvZCA9IDA7XG4gIH1cblxuICBpZiAoIXNjaGVkdWxlciB8fCB0eXBlb2Ygc2NoZWR1bGVyLnNjaGVkdWxlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgc2NoZWR1bGVyID0gYXN5bmM7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGU8bnVtYmVyPihzdWJzY3JpYmVyID0+IHtcbiAgICBzdWJzY3JpYmVyLmFkZChcbiAgICAgIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgcGVyaW9kLCB7IHN1YnNjcmliZXIsIGNvdW50ZXI6IDAsIHBlcmlvZCB9KVxuICAgICk7XG4gICAgcmV0dXJuIHN1YnNjcmliZXI7XG4gIH0pO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaCh0aGlzOiBTY2hlZHVsZXJBY3Rpb248SW50ZXJ2YWxTdGF0ZT4sIHN0YXRlOiBJbnRlcnZhbFN0YXRlKSB7XG4gIGNvbnN0IHsgc3Vic2NyaWJlciwgY291bnRlciwgcGVyaW9kIH0gPSBzdGF0ZTtcbiAgc3Vic2NyaWJlci5uZXh0KGNvdW50ZXIpO1xuICB0aGlzLnNjaGVkdWxlKHsgc3Vic2NyaWJlciwgY291bnRlcjogY291bnRlciArIDEsIHBlcmlvZCB9LCBwZXJpb2QpO1xufVxuXG5pbnRlcmZhY2UgSW50ZXJ2YWxTdGF0ZSB7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8bnVtYmVyPjtcbiAgY291bnRlcjogbnVtYmVyO1xuICBwZXJpb2Q6IG51bWJlcjtcbn1cbiJdfQ==