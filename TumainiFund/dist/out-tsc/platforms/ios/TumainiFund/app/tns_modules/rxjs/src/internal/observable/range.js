import { Observable } from '../Observable';
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
 * import { range } from 'rxjs';
 *
 * const numbers = range(1, 10);
 * numbers.subscribe(x => console.log(x));
 * ```
 * @see {@link timer}
 * @see {@link index/interval}
 *
 * @param {number} [start=0] The value of the first integer in the sequence.
 * @param {number} count The number of sequential integers to generate.
 * @param {SchedulerLike} [scheduler] A {@link SchedulerLike} to use for scheduling
 * the emissions of the notifications.
 * @return {Observable} An Observable of numbers that emits a finite range of
 * sequential integers.
 * @static true
 * @name range
 * @owner Observable
 */
export function range(start = 0, count, scheduler) {
    return new Observable(subscriber => {
        if (count === undefined) {
            count = start;
            start = 0;
        }
        let index = 0;
        let current = start;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                index, count, start, subscriber
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
/** @internal */
export function dispatch(state) {
    const { start, index, count, subscriber } = state;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlDRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUMsUUFBZ0IsQ0FBQyxFQUNqQixLQUFjLEVBQ2QsU0FBeUI7SUFDN0MsT0FBTyxJQUFJLFVBQVUsQ0FBUyxVQUFVLENBQUMsRUFBRTtRQUN6QyxJQUFJLEtBQUssS0FBSyxTQUFTLEVBQUU7WUFDdkIsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNkLEtBQUssR0FBRyxDQUFDLENBQUM7U0FDWDtRQUVELElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFO2dCQUNyQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVO2FBQ2hDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxHQUFHO2dCQUNELElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFO29CQUNwQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLE1BQU07aUJBQ1A7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ3JCLE1BQU07aUJBQ1A7YUFDRixRQUFRLElBQUksRUFBRTtTQUNoQjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGdCQUFnQjtBQUNoQixNQUFNLFVBQVUsUUFBUSxDQUE2QixLQUFVO0lBQzdELE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFbEQsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixPQUFPO0tBQ1I7SUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXZCLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUNyQixPQUFPO0tBQ1I7SUFFRCxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDeEIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbmNlIG9mIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkXG4gKiByYW5nZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIGluIGEgcmFuZ2UuPC9zcGFuPlxuICpcbiAqICFbXShyYW5nZS5wbmcpXG4gKlxuICogYHJhbmdlYCBvcGVyYXRvciBlbWl0cyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdlcnMsIGluIG9yZGVyLCB3aGVyZSB5b3VcbiAqIHNlbGVjdCB0aGUgYHN0YXJ0YCBvZiB0aGUgcmFuZ2UgYW5kIGl0cyBgbGVuZ3RoYC4gQnkgZGVmYXVsdCwgdXNlcyBub1xuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb25zIHN5bmNocm9ub3VzbHksIGJ1dCBtYXkgdXNlXG4gKiBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcmVndWxhdGUgdGhvc2UgZGVsaXZlcmllcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyB0aGUgbnVtYmVycyAxIHRvIDEwPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgcmFuZ2UgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCBudW1iZXJzID0gcmFuZ2UoMSwgMTApO1xuICogbnVtYmVycy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIHRpbWVyfVxuICogQHNlZSB7QGxpbmsgaW5kZXgvaW50ZXJ2YWx9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydD0wXSBUaGUgdmFsdWUgb2YgdGhlIGZpcnN0IGludGVnZXIgaW4gdGhlIHNlcXVlbmNlLlxuICogQHBhcmFtIHtudW1iZXJ9IGNvdW50IFRoZSBudW1iZXIgb2Ygc2VxdWVudGlhbCBpbnRlZ2VycyB0byBnZW5lcmF0ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBub3RpZmljYXRpb25zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBudW1iZXJzIHRoYXQgZW1pdHMgYSBmaW5pdGUgcmFuZ2Ugb2ZcbiAqIHNlcXVlbnRpYWwgaW50ZWdlcnMuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHJhbmdlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZ2Uoc3RhcnQ6IG51bWJlciA9IDAsXG4gICAgICAgICAgICAgICAgICAgICAgY291bnQ/OiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8bnVtYmVyPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxudW1iZXI+KHN1YnNjcmliZXIgPT4ge1xuICAgIGlmIChjb3VudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb3VudCA9IHN0YXJ0O1xuICAgICAgc3RhcnQgPSAwO1xuICAgIH1cblxuICAgIGxldCBpbmRleCA9IDA7XG4gICAgbGV0IGN1cnJlbnQgPSBzdGFydDtcblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgaW5kZXgsIGNvdW50LCBzdGFydCwgc3Vic2NyaWJlclxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvIHtcbiAgICAgICAgaWYgKGluZGV4KysgPj0gY291bnQpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KGN1cnJlbnQrKyk7XG4gICAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9IHdoaWxlICh0cnVlKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9KTtcbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGNvbnN0IHsgc3RhcnQsIGluZGV4LCBjb3VudCwgc3Vic2NyaWJlciB9ID0gc3RhdGU7XG5cbiAgaWYgKGluZGV4ID49IGNvdW50KSB7XG4gICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHN1YnNjcmliZXIubmV4dChzdGFydCk7XG5cbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3RhdGUuaW5kZXggPSBpbmRleCArIDE7XG4gIHN0YXRlLnN0YXJ0ID0gc3RhcnQgKyAxO1xuXG4gIHRoaXMuc2NoZWR1bGUoc3RhdGUpO1xufVxuIl19