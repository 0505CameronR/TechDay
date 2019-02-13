import { async } from '../scheduler/async';
import { isDate } from '../util/isDate';
import { Subscriber } from '../Subscriber';
import { Notification } from '../Notification';
/**
 * Delays the emission of items from the source Observable by a given timeout or
 * until a given Date.
 *
 * <span class="informal">Time shifts each item by some specified amount of
 * milliseconds.</span>
 *
 * ![](delay.png)
 *
 * If the delay argument is a Number, this operator time shifts the source
 * Observable by that amount of time expressed in milliseconds. The relative
 * time intervals between the values are preserved.
 *
 * If the delay argument is a Date, this operator time shifts the start of the
 * Observable execution until the given date occurs.
 *
 * ## Examples
 * Delay each click by one second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const delayedClicks = clicks.pipe(delay(1000)); // each click emitted after 1 second
 * delayedClicks.subscribe(x => console.log(x));
 * ```
 *
 * Delay all clicks until a future date happens
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const date = new Date('March 15, 2050 12:00:00'); // in the future
 * const delayedClicks = clicks.pipe(delay(date)); // click emitted only after that date
 * delayedClicks.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 *
 * @param {number|Date} delay The delay duration in milliseconds (a `number`) or
 * a `Date` until which the emission of the source items is delayed.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the time-shift for each item.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified timeout or Date.
 * @method delay
 * @owner Observable
 */
export function delay(delay, scheduler = async) {
    const absoluteDelay = isDate(delay);
    const delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return (source) => source.lift(new DelayOperator(delayFor, scheduler));
}
class DelayOperator {
    constructor(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DelaySubscriber extends Subscriber {
    constructor(destination, delay, scheduler) {
        super(destination);
        this.delay = delay;
        this.scheduler = scheduler;
        this.queue = [];
        this.active = false;
        this.errored = false;
    }
    static dispatch(state) {
        const source = state.source;
        const queue = source.queue;
        const scheduler = state.scheduler;
        const destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            const delay = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay);
        }
        else {
            this.unsubscribe();
            source.active = false;
        }
    }
    _schedule(scheduler) {
        this.active = true;
        const destination = this.destination;
        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    }
    scheduleNotification(notification) {
        if (this.errored === true) {
            return;
        }
        const scheduler = this.scheduler;
        const message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    }
    _next(value) {
        this.scheduleNotification(Notification.createNext(value));
    }
    _error(err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
        this.unsubscribe();
    }
    _complete() {
        this.scheduleNotification(Notification.createComplete());
        this.unsubscribe();
    }
}
class DelayMessage {
    constructor(time, notification) {
        this.time = time;
        this.notification = notification;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV4QyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUkvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJDRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUksS0FBa0IsRUFDbEIsWUFBMkIsS0FBSztJQUN2RCxNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsTUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFTLEtBQUssQ0FBQyxDQUFDO0lBQ3RGLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFFRCxNQUFNLGFBQWE7SUFDakIsWUFBb0IsS0FBYSxFQUNiLFNBQXdCO1FBRHhCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQzVDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FB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QUM7SUFDNUQsQ0FBQztJQUVTLE1BQU0sQ0FBQyxHQUFRO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsb0JBQW9CLENBQUMsWUFBWSxDQUFDLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7Q0FDRjtBQUVELE1BQU0sWUFBWTtJQUNoQixZQUE0QixJQUFZLEVBQ1osWUFBNkI7UUFEN0IsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUNaLGlCQUFZLEdBQVosWUFBWSxDQUFpQjtJQUN6RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBpc0RhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBEZWxheXMgdGhlIGVtaXNzaW9uIG9mIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGEgZ2l2ZW4gdGltZW91dCBvclxuICogdW50aWwgYSBnaXZlbiBEYXRlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5UaW1lIHNoaWZ0cyBlYWNoIGl0ZW0gYnkgc29tZSBzcGVjaWZpZWQgYW1vdW50IG9mXG4gKiBtaWxsaXNlY29uZHMuPC9zcGFuPlxuICpcbiAqICFbXShkZWxheS5wbmcpXG4gKlxuICogSWYgdGhlIGRlbGF5IGFyZ3VtZW50IGlzIGEgTnVtYmVyLCB0aGlzIG9wZXJhdG9yIHRpbWUgc2hpZnRzIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYnkgdGhhdCBhbW91bnQgb2YgdGltZSBleHByZXNzZWQgaW4gbWlsbGlzZWNvbmRzLiBUaGUgcmVsYXRpdmVcbiAqIHRpbWUgaW50ZXJ2YWxzIGJldHdlZW4gdGhlIHZhbHVlcyBhcmUgcHJlc2VydmVkLlxuICpcbiAqIElmIHRoZSBkZWxheSBhcmd1bWVudCBpcyBhIERhdGUsIHRoaXMgb3BlcmF0b3IgdGltZSBzaGlmdHMgdGhlIHN0YXJ0IG9mIHRoZVxuICogT2JzZXJ2YWJsZSBleGVjdXRpb24gdW50aWwgdGhlIGdpdmVuIGRhdGUgb2NjdXJzLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBEZWxheSBlYWNoIGNsaWNrIGJ5IG9uZSBzZWNvbmRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBkZWxheWVkQ2xpY2tzID0gY2xpY2tzLnBpcGUoZGVsYXkoMTAwMCkpOyAvLyBlYWNoIGNsaWNrIGVtaXR0ZWQgYWZ0ZXIgMSBzZWNvbmRcbiAqIGRlbGF5ZWRDbGlja3Muc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogRGVsYXkgYWxsIGNsaWNrcyB1bnRpbCBhIGZ1dHVyZSBkYXRlIGhhcHBlbnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBkYXRlID0gbmV3IERhdGUoJ01hcmNoIDE1LCAyMDUwIDEyOjAwOjAwJyk7IC8vIGluIHRoZSBmdXR1cmVcbiAqIGNvbnN0IGRlbGF5ZWRDbGlja3MgPSBjbGlja3MucGlwZShkZWxheShkYXRlKSk7IC8vIGNsaWNrIGVtaXR0ZWQgb25seSBhZnRlciB0aGF0IGRhdGVcbiAqIGRlbGF5ZWRDbGlja3Muc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVib3VuY2VUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVsYXlXaGVufVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfERhdGV9IGRlbGF5IFRoZSBkZWxheSBkdXJhdGlvbiBpbiBtaWxsaXNlY29uZHMgKGEgYG51bWJlcmApIG9yXG4gKiBhIGBEYXRlYCB1bnRpbCB3aGljaCB0aGUgZW1pc3Npb24gb2YgdGhlIHNvdXJjZSBpdGVtcyBpcyBkZWxheWVkLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHRpbWUtc2hpZnQgZm9yIGVhY2ggaXRlbS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBkZWxheXMgdGhlIGVtaXNzaW9ucyBvZiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGJ5IHRoZSBzcGVjaWZpZWQgdGltZW91dCBvciBEYXRlLlxuICogQG1ldGhvZCBkZWxheVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5PFQ+KGRlbGF5OiBudW1iZXJ8RGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGNvbnN0IGFic29sdXRlRGVsYXkgPSBpc0RhdGUoZGVsYXkpO1xuICBjb25zdCBkZWxheUZvciA9IGFic29sdXRlRGVsYXkgPyAoK2RlbGF5IC0gc2NoZWR1bGVyLm5vdygpKSA6IE1hdGguYWJzKDxudW1iZXI+ZGVsYXkpO1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERlbGF5T3BlcmF0b3IoZGVsYXlGb3IsIHNjaGVkdWxlcikpO1xufVxuXG5jbGFzcyBEZWxheU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlbGF5OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERlbGF5U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmRlbGF5LCB0aGlzLnNjaGVkdWxlcikpO1xuICB9XG59XG5cbmludGVyZmFjZSBEZWxheVN0YXRlPFQ+IHtcbiAgc291cmNlOiBEZWxheVN1YnNjcmliZXI8VD47XG4gIGRlc3RpbmF0aW9uOiBQYXJ0aWFsT2JzZXJ2ZXI8VD47XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZTtcbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlbGF5U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHF1ZXVlOiBBcnJheTxEZWxheU1lc3NhZ2U8VD4+ID0gW107XG4gIHByaXZhdGUgYWN0aXZlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZXJyb3JlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIHByaXZhdGUgc3RhdGljIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEZWxheVN0YXRlPFQ+Piwgc3RhdGU6IERlbGF5U3RhdGU8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBzb3VyY2UgPSBzdGF0ZS5zb3VyY2U7XG4gICAgY29uc3QgcXVldWUgPSBzb3VyY2UucXVldWU7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gc3RhdGUuc2NoZWR1bGVyO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gc3RhdGUuZGVzdGluYXRpb247XG5cbiAgICB3aGlsZSAocXVldWUubGVuZ3RoID4gMCAmJiAocXVldWVbMF0udGltZSAtIHNjaGVkdWxlci5ub3coKSkgPD0gMCkge1xuICAgICAgcXVldWUuc2hpZnQoKS5ub3RpZmljYXRpb24ub2JzZXJ2ZShkZXN0aW5hdGlvbik7XG4gICAgfVxuXG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGRlbGF5ID0gTWF0aC5tYXgoMCwgcXVldWVbMF0udGltZSAtIHNjaGVkdWxlci5ub3coKSk7XG4gICAgICB0aGlzLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHNvdXJjZS5hY3RpdmUgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkZWxheTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgX3NjaGVkdWxlKHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGVsYXlTdGF0ZTxUPj4oRGVsYXlTdWJzY3JpYmVyLmRpc3BhdGNoLCB0aGlzLmRlbGF5LCB7XG4gICAgICBzb3VyY2U6IHRoaXMsIGRlc3RpbmF0aW9uOiB0aGlzLmRlc3RpbmF0aW9uLCBzY2hlZHVsZXI6IHNjaGVkdWxlclxuICAgIH0pKTtcbiAgfVxuXG4gIHByaXZhdGUgc2NoZWR1bGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248VD4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5lcnJvcmVkID09PSB0cnVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgY29uc3QgbWVzc2FnZSA9IG5ldyBEZWxheU1lc3NhZ2Uoc2NoZWR1bGVyLm5vdygpICsgdGhpcy5kZWxheSwgbm90aWZpY2F0aW9uKTtcbiAgICB0aGlzLnF1ZXVlLnB1c2gobWVzc2FnZSk7XG5cbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLl9zY2hlZHVsZShzY2hlZHVsZXIpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuc2NoZWR1bGVOb3RpZmljYXRpb24oTm90aWZpY2F0aW9uLmNyZWF0ZU5leHQodmFsdWUpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICB0aGlzLmVycm9yZWQgPSB0cnVlO1xuICAgIHRoaXMucXVldWUgPSBbXTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICB0aGlzLnNjaGVkdWxlTm90aWZpY2F0aW9uKE5vdGlmaWNhdGlvbi5jcmVhdGVDb21wbGV0ZSgpKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cblxuY2xhc3MgRGVsYXlNZXNzYWdlPFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRpbWU6IG51bWJlcixcbiAgICAgICAgICAgICAgcHVibGljIHJlYWRvbmx5IG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPFQ+KSB7XG4gIH1cbn1cbiJdfQ==