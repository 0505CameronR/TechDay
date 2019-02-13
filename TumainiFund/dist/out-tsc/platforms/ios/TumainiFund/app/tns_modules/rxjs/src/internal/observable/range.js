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
export function range(start = 0, count = 0, scheduler) {
    return new Observable(subscriber => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3JhbmdlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFDLFFBQWdCLENBQUMsRUFDakIsUUFBZ0IsQ0FBQyxFQUNqQixTQUF5QjtJQUM3QyxPQUFPLElBQUksVUFBVSxDQUFTLFVBQVUsQ0FBQyxFQUFFO1FBQ3pDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQztRQUNkLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQztRQUVwQixJQUFJLFNBQVMsRUFBRTtZQUNiLE9BQU8sU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFO2dCQUNyQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVO2FBQ2hDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxHQUFHO2dCQUNELElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFO29CQUNwQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLE1BQU07aUJBQ1A7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ3JCLE1BQU07aUJBQ1A7YUFDRixRQUFRLElBQUksRUFBRTtTQUNoQjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELGdCQUFnQjtBQUNoQixNQUFNLFVBQVUsUUFBUSxDQUE2QixLQUFVO0lBQzdELE1BQU0sRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFFbEQsSUFBSSxLQUFLLElBQUksS0FBSyxFQUFFO1FBQ2xCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN0QixPQUFPO0tBQ1I7SUFFRCxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBRXZCLElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUNyQixPQUFPO0tBQ1I7SUFFRCxLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7SUFDeEIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBRXhCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDdkIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbmNlIG9mIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkXG4gKiByYW5nZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIGluIGEgcmFuZ2UuPC9zcGFuPlxuICpcbiAqICFbXShyYW5nZS5wbmcpXG4gKlxuICogYHJhbmdlYCBvcGVyYXRvciBlbWl0cyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdlcnMsIGluIG9yZGVyLCB3aGVyZSB5b3VcbiAqIHNlbGVjdCB0aGUgYHN0YXJ0YCBvZiB0aGUgcmFuZ2UgYW5kIGl0cyBgbGVuZ3RoYC4gQnkgZGVmYXVsdCwgdXNlcyBub1xuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb25zIHN5bmNocm9ub3VzbHksIGJ1dCBtYXkgdXNlXG4gKiBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcmVndWxhdGUgdGhvc2UgZGVsaXZlcmllcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyB0aGUgbnVtYmVycyAxIHRvIDEwPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHJhbmdlKDEsIDEwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnRlZ2VyIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY291bnQ9MF0gVGhlIG51bWJlciBvZiBzZXF1ZW50aWFsIGludGVnZXJzIHRvIGdlbmVyYXRlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbnMgb2YgdGhlIG5vdGlmaWNhdGlvbnMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIG51bWJlcnMgdGhhdCBlbWl0cyBhIGZpbml0ZSByYW5nZSBvZlxuICogc2VxdWVudGlhbCBpbnRlZ2Vycy5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFuZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudCA9IHN0YXJ0O1xuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwge1xuICAgICAgICBpbmRleCwgY291bnQsIHN0YXJ0LCBzdWJzY3JpYmVyXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoaW5kZXgrKyA+PSBjb3VudCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoY3VycmVudCsrKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sIHN0YXRlOiBhbnkpIHtcbiAgY29uc3QgeyBzdGFydCwgaW5kZXgsIGNvdW50LCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcblxuICBpZiAoaW5kZXggPj0gY291bnQpIHtcbiAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3Vic2NyaWJlci5uZXh0KHN0YXJ0KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgc3RhdGUuc3RhcnQgPSBzdGFydCArIDE7XG5cbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iXX0=