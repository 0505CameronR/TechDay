"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
/**
 * Creates an Observable that emits a sequence of numbers within a specified
 * range.
 *
 * <span class="informal">Emits a sequence of numbers in a range.</span>
 *
 * ![](range.png)
 *
 * `range` operator emits a range of sequential integers, in order, where you
 * select the `start` of the range and its `length`. By default, uses no
 * {@link SchedulerLike} and just delivers the notifications synchronously, but may use
 * an optional {@link SchedulerLike} to regulate those deliveries.
 *
 * ## Example
 * Emits the numbers 1 to 10</caption>
 * ```javascript
 * const numbers = range(1, 10);
 * numbers.subscribe(x => console.log(x));
 * ```
 * @see {@link timer}
 * @see {@link index/interval}
 *
 * @param {number} [start=0] The value of the first integer in the sequence.
 * @param {number} [count=0] The number of sequential integers to generate.
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emissions of the notifications.
 * @return {Observable} An Observable of numbers that emits a finite range of
 * sequential integers.
 * @static true
 * @name range
 * @owner Observable
 */
function range(start, count, scheduler) {
    if (start === void 0) { start = 0; }
    if (count === void 0) { count = 0; }
    return new Observable_1.Observable(function (subscriber) {
        var index = 0;
        var current = start;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                index: index, count: count, start: start, subscriber: subscriber
            });
        }
        else {
            do {
                if (index++ >= count) {
                    subscriber.complete();
                    break;
                }
                subscriber.next(current++);
                if (subscriber.closed) {
                    break;
                }
            } while (true);
        }
        return undefined;
    });
}
exports.range = range;
/** @internal */
function dispatch(state) {
    var start = state.start, index = state.index, count = state.count, subscriber = state.subscriber;
    if (index >= count) {
        subscriber.complete();
        return;
    }
    subscriber.next(start);
    if (subscriber.closed) {
        return;
    }
    state.index = index + 1;
    state.start = start + 1;
    this.schedule(state);
}
exports.dispatch = dispatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTJDO0FBRTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0JHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFDLEtBQWlCLEVBQ2pCLEtBQWlCLEVBQ2pCLFNBQXlCO0lBRnpCLHNCQUFBLEVBQUEsU0FBaUI7SUFDakIsc0JBQUEsRUFBQSxTQUFpQjtJQUVyQyxPQUFPLElBQUksdUJBQVUsQ0FBUyxVQUFBLFVBQVU7UUFDdEMsSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2QsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksU0FBUyxFQUFFO1lBQ2IsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUU7Z0JBQ3JDLEtBQUssT0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLEtBQUssT0FBQSxFQUFFLFVBQVUsWUFBQTthQUNoQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsR0FBRztnQkFDRCxJQUFJLEtBQUssRUFBRSxJQUFJLEtBQUssRUFBRTtvQkFDcEIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO29CQUN0QixNQUFNO2lCQUNQO2dCQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO29CQUNyQixNQUFNO2lCQUNQO2FBQ0YsUUFBUSxJQUFJLEVBQUU7U0FDaEI7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUExQkQsc0JBMEJDO0FBRUQsZ0JBQWdCO0FBQ2hCLFNBQWdCLFFBQVEsQ0FBNkIsS0FBVTtJQUNyRCxJQUFBLG1CQUFLLEVBQUUsbUJBQUssRUFBRSxtQkFBSyxFQUFFLDZCQUFVLENBQVc7SUFFbEQsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixPQUFPO0tBQ1I7SUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXZCLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUNyQixPQUFPO0tBQ1I7SUFFRCxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDeEIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQztBQWxCRCw0QkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIHdpdGhpbiBhIHNwZWNpZmllZFxuICogcmFuZ2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIGEgc2VxdWVuY2Ugb2YgbnVtYmVycyBpbiBhIHJhbmdlLjwvc3Bhbj5cbiAqXG4gKiAhW10ocmFuZ2UucG5nKVxuICpcbiAqIGByYW5nZWAgb3BlcmF0b3IgZW1pdHMgYSByYW5nZSBvZiBzZXF1ZW50aWFsIGludGVnZXJzLCBpbiBvcmRlciwgd2hlcmUgeW91XG4gKiBzZWxlY3QgdGhlIGBzdGFydGAgb2YgdGhlIHJhbmdlIGFuZCBpdHMgYGxlbmd0aGAuIEJ5IGRlZmF1bHQsIHVzZXMgbm9cbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSBhbmQganVzdCBkZWxpdmVycyB0aGUgbm90aWZpY2F0aW9ucyBzeW5jaHJvbm91c2x5LCBidXQgbWF5IHVzZVxuICogYW4gb3B0aW9uYWwge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHJlZ3VsYXRlIHRob3NlIGRlbGl2ZXJpZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdHMgdGhlIG51bWJlcnMgMSB0byAxMDwvY2FwdGlvbj5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG51bWJlcnMgPSByYW5nZSgxLCAxMCk7XG4gKiBudW1iZXJzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgdGltZXJ9XG4gKiBAc2VlIHtAbGluayBpbmRleC9pbnRlcnZhbH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0PTBdIFRoZSB2YWx1ZSBvZiB0aGUgZmlyc3QgaW50ZWdlciBpbiB0aGUgc2VxdWVuY2UuXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvdW50PTBdIFRoZSBudW1iZXIgb2Ygc2VxdWVudGlhbCBpbnRlZ2VycyB0byBnZW5lcmF0ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBub3RpZmljYXRpb25zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBudW1iZXJzIHRoYXQgZW1pdHMgYSBmaW5pdGUgcmFuZ2Ugb2ZcbiAqIHNlcXVlbnRpYWwgaW50ZWdlcnMuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHJhbmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnQgPSBzdGFydDtcblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgaW5kZXgsIGNvdW50LCBzdGFydCwgc3Vic2NyaWJlclxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGluZGV4KysgPj0gY291bnQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGN1cnJlbnQrKyk7XG4gICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGNvbnN0IHsgc3RhcnQsIGluZGV4LCBjb3VudCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG5cbiAgaWYgKGluZGV4ID49IGNvdW50KSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN1YnNjcmliZXIubmV4dChzdGFydCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHN0YXRlLnN0YXJ0ID0gc3RhcnQgKyAxO1xuXG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIl19