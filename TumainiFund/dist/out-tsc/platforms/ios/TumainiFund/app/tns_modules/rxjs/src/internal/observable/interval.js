import { Observable } from '../Observable';
import { async } from '../scheduler/async';
import { isNumeric } from '../util/isNumeric';
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
export function interval(period = 0, scheduler = async) {
    if (!isNumeric(period) || period < 0) {
        period = 0;
    }
    if (!scheduler || typeof scheduler.schedule !== 'function') {
        scheduler = async;
    }
    return new Observable(subscriber => {
        subscriber.add(scheduler.schedule(dispatch, period, { subscriber, counter: 0, period }));
        return subscriber;
    });
}
function dispatch(state) {
    const { subscriber, counter, period } = state;
    subscriber.next(counter);
    this.schedule({ subscriber, counter: counter + 1, period }, period);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW50ZXJ2YWwuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2ludGVydmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUc5Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQ0c7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ1YsWUFBMkIsS0FBSztJQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxJQUFJLE1BQU0sR0FBRyxDQUFDLEVBQUU7UUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNaO0lBRUQsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLFNBQVMsQ0FBQyxRQUFRLEtBQUssVUFBVSxFQUFFO1FBQzFELFNBQVMsR0FBRyxLQUFLLENBQUM7S0FDbkI7SUFFRCxPQUFPLElBQUksVUFBVSxDQUFTLFVBQVUsQ0FBQyxFQUFFO1FBQ3pDLFVBQVUsQ0FBQyxHQUFHLENBQ1osU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FDekUsQ0FBQztRQUNGLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUF1QyxLQUFvQjtJQUMxRSxNQUFNLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDOUMsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxPQUFPLEdBQUcsQ0FBQyxFQUFFLE1BQU0sRUFBRSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3RFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc051bWVyaWMgfSBmcm9tICcuLi91dGlsL2lzTnVtZXJpYyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgc2VxdWVudGlhbCBudW1iZXJzIGV2ZXJ5IHNwZWNpZmllZFxuICogaW50ZXJ2YWwgb2YgdGltZSwgb24gYSBzcGVjaWZpZWQge0BsaW5rIFNjaGVkdWxlckxpa2V9LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FbWl0cyBpbmNyZW1lbnRhbCBudW1iZXJzIHBlcmlvZGljYWxseSBpbiB0aW1lLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShpbnRlcnZhbC5wbmcpXG4gKlxuICogYGludGVydmFsYCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbiBpbmZpbml0ZSBzZXF1ZW5jZSBvZlxuICogYXNjZW5kaW5nIGludGVnZXJzLCB3aXRoIGEgY29uc3RhbnQgaW50ZXJ2YWwgb2YgdGltZSBvZiB5b3VyIGNob29zaW5nXG4gKiBiZXR3ZWVuIHRob3NlIGVtaXNzaW9ucy4gVGhlIGZpcnN0IGVtaXNzaW9uIGlzIG5vdCBzZW50IGltbWVkaWF0ZWx5LCBidXRcbiAqIG9ubHkgYWZ0ZXIgdGhlIGZpcnN0IHBlcmlvZCBoYXMgcGFzc2VkLiBCeSBkZWZhdWx0LCB0aGlzIG9wZXJhdG9yIHVzZXMgdGhlXG4gKiBgYXN5bmNgIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byBwcm92aWRlIGEgbm90aW9uIG9mIHRpbWUsIGJ1dCB5b3UgbWF5IHBhc3MgYW55XG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gaXQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdHMgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQgKDEwMDBtcykgdXAgdG8gdGhlIG51bWJlciAzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBudW1iZXJzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKlxuICogY29uc3QgdGFrZUZvdXJOdW1iZXJzID0gbnVtYmVycy5waXBlKHRha2UoNCkpO1xuICpcbiAqIHRha2VGb3VyTnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnTmV4dDogJywgeCkpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBOZXh0OiAwXG4gKiAvLyBOZXh0OiAxXG4gKiAvLyBOZXh0OiAyXG4gKiAvLyBOZXh0OiAzXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGRlbGF5fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbcGVyaW9kPTBdIFRoZSBpbnRlcnZhbCBzaXplIGluIG1pbGxpc2Vjb25kcyAoYnkgZGVmYXVsdClcbiAqIG9yIHRoZSB0aW1lIHVuaXQgZGV0ZXJtaW5lZCBieSB0aGUgc2NoZWR1bGVyJ3MgY2xvY2suXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb24gb2YgdmFsdWVzLCBhbmQgcHJvdmlkaW5nIGEgbm90aW9uIG9mIFwidGltZVwiLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgc2VxdWVudGlhbCBudW1iZXIgZWFjaCB0aW1lXG4gKiBpbnRlcnZhbC5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaW50ZXJ2YWxcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnZhbChwZXJpb2QgPSAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgaWYgKCFpc051bWVyaWMocGVyaW9kKSB8fCBwZXJpb2QgPCAwKSB7XG4gICAgcGVyaW9kID0gMDtcbiAgfVxuXG4gIGlmICghc2NoZWR1bGVyIHx8IHR5cGVvZiBzY2hlZHVsZXIuc2NoZWR1bGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICBzY2hlZHVsZXIgPSBhc3luYztcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIHN1YnNjcmliZXIuYWRkKFxuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoLCBwZXJpb2QsIHsgc3Vic2NyaWJlciwgY291bnRlcjogMCwgcGVyaW9kIH0pXG4gICAgKTtcbiAgICByZXR1cm4gc3Vic2NyaWJlcjtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxJbnRlcnZhbFN0YXRlPiwgc3RhdGU6IEludGVydmFsU3RhdGUpIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb3VudGVyLCBwZXJpb2QgfSA9IHN0YXRlO1xuICBzdWJzY3JpYmVyLm5leHQoY291bnRlcik7XG4gIHRoaXMuc2NoZWR1bGUoeyBzdWJzY3JpYmVyLCBjb3VudGVyOiBjb3VudGVyICsgMSwgcGVyaW9kIH0sIHBlcmlvZCk7XG59XG5cbmludGVyZmFjZSBJbnRlcnZhbFN0YXRlIHtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+O1xuICBjb3VudGVyOiBudW1iZXI7XG4gIHBlcmlvZDogbnVtYmVyO1xufVxuIl19