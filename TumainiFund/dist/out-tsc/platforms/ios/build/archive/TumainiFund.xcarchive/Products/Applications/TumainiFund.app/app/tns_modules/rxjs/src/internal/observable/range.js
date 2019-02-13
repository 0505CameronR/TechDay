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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvcmFuZ2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSw0Q0FBMkM7QUFFM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxTQUFnQixLQUFLLENBQUMsS0FBaUIsRUFDakIsS0FBaUIsRUFDakIsU0FBeUI7SUFGekIsc0JBQUEsRUFBQSxTQUFpQjtJQUNqQixzQkFBQSxFQUFBLFNBQWlCO0lBRXJDLE9BQU8sSUFBSSx1QkFBVSxDQUFTLFVBQUEsVUFBVTtRQUN0QyxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFFcEIsSUFBSSxTQUFTLEVBQUU7WUFDYixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRTtnQkFDckMsS0FBSyxPQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsS0FBSyxPQUFBLEVBQUUsVUFBVSxZQUFBO2FBQ2hDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxHQUFHO2dCQUNELElBQUksS0FBSyxFQUFFLElBQUksS0FBSyxFQUFFO29CQUNwQixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7b0JBQ3RCLE1BQU07aUJBQ1A7Z0JBQ0QsVUFBVSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLFVBQVUsQ0FBQyxNQUFNLEVBQUU7b0JBQ3JCLE1BQU07aUJBQ1A7YUFDRixRQUFRLElBQUksRUFBRTtTQUNoQjtRQUVELE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTFCRCxzQkEwQkM7QUFFRCxnQkFBZ0I7QUFDaEIsU0FBZ0IsUUFBUSxDQUE2QixLQUFVO0lBQ3JELElBQUEsbUJBQUssRUFBRSxtQkFBSyxFQUFFLG1CQUFLLEVBQUUsNkJBQVUsQ0FBVztJQUVsRCxJQUFJLEtBQUssSUFBSSxLQUFLLEVBQUU7UUFDbEIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RCLE9BQU87S0FDUjtJQUVELFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFFdkIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLE9BQU87S0FDUjtJQUVELEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQztJQUN4QixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssR0FBRyxDQUFDLENBQUM7SUFFeEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixDQUFDO0FBbEJELDRCQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNlcXVlbmNlIG9mIG51bWJlcnMgd2l0aGluIGEgc3BlY2lmaWVkXG4gKiByYW5nZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgYSBzZXF1ZW5jZSBvZiBudW1iZXJzIGluIGEgcmFuZ2UuPC9zcGFuPlxuICpcbiAqICFbXShyYW5nZS5wbmcpXG4gKlxuICogYHJhbmdlYCBvcGVyYXRvciBlbWl0cyBhIHJhbmdlIG9mIHNlcXVlbnRpYWwgaW50ZWdlcnMsIGluIG9yZGVyLCB3aGVyZSB5b3VcbiAqIHNlbGVjdCB0aGUgYHN0YXJ0YCBvZiB0aGUgcmFuZ2UgYW5kIGl0cyBgbGVuZ3RoYC4gQnkgZGVmYXVsdCwgdXNlcyBub1xuICoge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFuZCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb25zIHN5bmNocm9ub3VzbHksIGJ1dCBtYXkgdXNlXG4gKiBhbiBvcHRpb25hbCB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gcmVndWxhdGUgdGhvc2UgZGVsaXZlcmllcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0cyB0aGUgbnVtYmVycyAxIHRvIDEwPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHJhbmdlKDEsIDEwKTtcbiAqIG51bWJlcnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB0aW1lcn1cbiAqIEBzZWUge0BsaW5rIGluZGV4L2ludGVydmFsfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnQ9MF0gVGhlIHZhbHVlIG9mIHRoZSBmaXJzdCBpbnRlZ2VyIGluIHRoZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY291bnQ9MF0gVGhlIG51bWJlciBvZiBzZXF1ZW50aWFsIGludGVnZXJzIHRvIGdlbmVyYXRlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbnMgb2YgdGhlIG5vdGlmaWNhdGlvbnMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIG51bWJlcnMgdGhhdCBlbWl0cyBhIGZpbml0ZSByYW5nZSBvZlxuICogc2VxdWVudGlhbCBpbnRlZ2Vycy5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcmFuZ2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYW5nZShzdGFydDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBjb3VudDogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxudW1iZXI+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPG51bWJlcj4oc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGluZGV4ID0gMDtcbiAgICBsZXQgY3VycmVudCA9IHN0YXJ0O1xuXG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaCwgMCwge1xuICAgICAgICBpbmRleCwgY291bnQsIHN0YXJ0LCBzdWJzY3JpYmVyXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG8ge1xuICAgICAgICBpZiAoaW5kZXgrKyA+PSBjb3VudCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBzdWJzY3JpYmVyLm5leHQoY3VycmVudCsrKTtcbiAgICAgICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0gd2hpbGUgKHRydWUpO1xuICAgIH1cblxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH0pO1xufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2godGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sIHN0YXRlOiBhbnkpIHtcbiAgY29uc3QgeyBzdGFydCwgaW5kZXgsIGNvdW50LCBzdWJzY3JpYmVyIH0gPSBzdGF0ZTtcblxuICBpZiAoaW5kZXggPj0gY291bnQpIHtcbiAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgc3Vic2NyaWJlci5uZXh0KHN0YXJ0KTtcblxuICBpZiAoc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBzdGF0ZS5pbmRleCA9IGluZGV4ICsgMTtcbiAgc3RhdGUuc3RhcnQgPSBzdGFydCArIDE7XG5cbiAgdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iXX0=