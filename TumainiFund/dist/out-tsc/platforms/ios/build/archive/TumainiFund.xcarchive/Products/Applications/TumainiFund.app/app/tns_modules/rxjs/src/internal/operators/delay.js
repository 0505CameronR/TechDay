"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var isDate_1 = require("../util/isDate");
var Subscriber_1 = require("../Subscriber");
var Notification_1 = require("../Notification");
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
function delay(delay, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    var absoluteDelay = isDate_1.isDate(delay);
    var delayFor = absoluteDelay ? (+delay - scheduler.now()) : Math.abs(delay);
    return function (source) { return source.lift(new DelayOperator(delayFor, scheduler)); };
}
exports.delay = delay;
var DelayOperator = /** @class */ (function () {
    function DelayOperator(delay, scheduler) {
        this.delay = delay;
        this.scheduler = scheduler;
    }
    DelayOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelaySubscriber(subscriber, this.delay, this.scheduler));
    };
    return DelayOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelaySubscriber = /** @class */ (function (_super) {
    __extends(DelaySubscriber, _super);
    function DelaySubscriber(destination, delay, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.delay = delay;
        _this.scheduler = scheduler;
        _this.queue = [];
        _this.active = false;
        _this.errored = false;
        return _this;
    }
    DelaySubscriber.dispatch = function (state) {
        var source = state.source;
        var queue = source.queue;
        var scheduler = state.scheduler;
        var destination = state.destination;
        while (queue.length > 0 && (queue[0].time - scheduler.now()) <= 0) {
            queue.shift().notification.observe(destination);
        }
        if (queue.length > 0) {
            var delay_1 = Math.max(0, queue[0].time - scheduler.now());
            this.schedule(state, delay_1);
        }
        else {
            this.unsubscribe();
            source.active = false;
        }
    };
    DelaySubscriber.prototype._schedule = function (scheduler) {
        this.active = true;
        var destination = this.destination;
        destination.add(scheduler.schedule(DelaySubscriber.dispatch, this.delay, {
            source: this, destination: this.destination, scheduler: scheduler
        }));
    };
    DelaySubscriber.prototype.scheduleNotification = function (notification) {
        if (this.errored === true) {
            return;
        }
        var scheduler = this.scheduler;
        var message = new DelayMessage(scheduler.now() + this.delay, notification);
        this.queue.push(message);
        if (this.active === false) {
            this._schedule(scheduler);
        }
    };
    DelaySubscriber.prototype._next = function (value) {
        this.scheduleNotification(Notification_1.Notification.createNext(value));
    };
    DelaySubscriber.prototype._error = function (err) {
        this.errored = true;
        this.queue = [];
        this.destination.error(err);
        this.unsubscribe();
    };
    DelaySubscriber.prototype._complete = function () {
        this.scheduleNotification(Notification_1.Notification.createComplete());
        this.unsubscribe();
    };
    return DelaySubscriber;
}(Subscriber_1.Subscriber));
var DelayMessage = /** @class */ (function () {
    function DelayMessage(time, notification) {
        this.time = time;
        this.notification = notification;
    }
    return DelayMessage;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZWxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0Q0FBMkM7QUFDM0MseUNBQXdDO0FBRXhDLDRDQUEyQztBQUUzQyxnREFBK0M7QUFJL0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ0c7QUFDSCxTQUFnQixLQUFLLENBQUksS0FBa0IsRUFDbEIsU0FBZ0M7SUFBaEMsMEJBQUEsRUFBQSxZQUEyQixhQUFLO0lBQ3ZELElBQU0sYUFBYSxHQUFHLGVBQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQyxJQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVMsS0FBSyxDQUFDLENBQUM7SUFDdEYsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUFuRCxDQUFtRCxDQUFDO0FBQ3hGLENBQUM7QUFMRCxzQkFLQztBQUVEO0lBQ0UsdUJBQW9CLEtBQWEsRUFDYixTQUF3QjtRQUR4QixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQ2IsY0FBUyxHQUFULFNBQVMsQ0FBZTtJQUM1QyxDQUFDO0lBRUQsNEJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUs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QkFBb0IsQ0FBQywyQkFBWSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzVELENBQUM7SUFFUyxnQ0FBTSxHQUFoQixVQUFpQixHQUFRO1FBQ3ZCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsbUNBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsb0JBQW9CLENBQUMsMkJBQVksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0gsc0JBQUM7QUFBRCxDQUFDLEFBbkVELENBQWlDLHVCQUFVLEdBbUUxQztBQUVEO0lBQ0Usc0JBQTRCLElBQVksRUFDWixZQUE2QjtRQUQ3QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQ1osaUJBQVksR0FBWixZQUFZLENBQWlCO0lBQ3pELENBQUM7SUFDSCxtQkFBQztBQUFELENBQUMsQUFKRCxJQUlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgaXNEYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgUGFydGlhbE9ic2VydmVyLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRGVsYXlzIHRoZSBlbWlzc2lvbiBvZiBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBieSBhIGdpdmVuIHRpbWVvdXQgb3JcbiAqIHVudGlsIGEgZ2l2ZW4gRGF0ZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGltZSBzaGlmdHMgZWFjaCBpdGVtIGJ5IHNvbWUgc3BlY2lmaWVkIGFtb3VudCBvZlxuICogbWlsbGlzZWNvbmRzLjwvc3Bhbj5cbiAqXG4gKiAhW10oZGVsYXkucG5nKVxuICpcbiAqIElmIHRoZSBkZWxheSBhcmd1bWVudCBpcyBhIE51bWJlciwgdGhpcyBvcGVyYXRvciB0aW1lIHNoaWZ0cyB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGJ5IHRoYXQgYW1vdW50IG9mIHRpbWUgZXhwcmVzc2VkIGluIG1pbGxpc2Vjb25kcy4gVGhlIHJlbGF0aXZlXG4gKiB0aW1lIGludGVydmFscyBiZXR3ZWVuIHRoZSB2YWx1ZXMgYXJlIHByZXNlcnZlZC5cbiAqXG4gKiBJZiB0aGUgZGVsYXkgYXJndW1lbnQgaXMgYSBEYXRlLCB0aGlzIG9wZXJhdG9yIHRpbWUgc2hpZnRzIHRoZSBzdGFydCBvZiB0aGVcbiAqIE9ic2VydmFibGUgZXhlY3V0aW9uIHVudGlsIHRoZSBnaXZlbiBkYXRlIG9jY3Vycy5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogRGVsYXkgZWFjaCBjbGljayBieSBvbmUgc2Vjb25kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgZGVsYXllZENsaWNrcyA9IGNsaWNrcy5waXBlKGRlbGF5KDEwMDApKTsgLy8gZWFjaCBjbGljayBlbWl0dGVkIGFmdGVyIDEgc2Vjb25kXG4gKiBkZWxheWVkQ2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIERlbGF5IGFsbCBjbGlja3MgdW50aWwgYSBmdXR1cmUgZGF0ZSBoYXBwZW5zXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgZGF0ZSA9IG5ldyBEYXRlKCdNYXJjaCAxNSwgMjA1MCAxMjowMDowMCcpOyAvLyBpbiB0aGUgZnV0dXJlXG4gKiBjb25zdCBkZWxheWVkQ2xpY2tzID0gY2xpY2tzLnBpcGUoZGVsYXkoZGF0ZSkpOyAvLyBjbGljayBlbWl0dGVkIG9ubHkgYWZ0ZXIgdGhhdCBkYXRlXG4gKiBkZWxheWVkQ2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlVGltZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5V2hlbn1cbiAqXG4gKiBAcGFyYW0ge251bWJlcnxEYXRlfSBkZWxheSBUaGUgZGVsYXkgZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIChhIGBudW1iZXJgKSBvclxuICogYSBgRGF0ZWAgdW50aWwgd2hpY2ggdGhlIGVtaXNzaW9uIG9mIHRoZSBzb3VyY2UgaXRlbXMgaXMgZGVsYXllZC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yXG4gKiBtYW5hZ2luZyB0aGUgdGltZXJzIHRoYXQgaGFuZGxlIHRoZSB0aW1lLXNoaWZ0IGZvciBlYWNoIGl0ZW0uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZGVsYXlzIHRoZSBlbWlzc2lvbnMgb2YgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBieSB0aGUgc3BlY2lmaWVkIHRpbWVvdXQgb3IgRGF0ZS5cbiAqIEBtZXRob2QgZGVsYXlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheTxUPihkZWxheTogbnVtYmVyfERhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICBjb25zdCBhYnNvbHV0ZURlbGF5ID0gaXNEYXRlKGRlbGF5KTtcbiAgY29uc3QgZGVsYXlGb3IgPSBhYnNvbHV0ZURlbGF5ID8gKCtkZWxheSAtIHNjaGVkdWxlci5ub3coKSkgOiBNYXRoLmFicyg8bnVtYmVyPmRlbGF5KTtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEZWxheU9wZXJhdG9yKGRlbGF5Rm9yLCBzY2hlZHVsZXIpKTtcbn1cblxuY2xhc3MgRGVsYXlPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkZWxheTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZWxheVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kZWxheSwgdGhpcy5zY2hlZHVsZXIpKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgRGVsYXlTdGF0ZTxUPiB7XG4gIHNvdXJjZTogRGVsYXlTdWJzY3JpYmVyPFQ+O1xuICBkZXN0aW5hdGlvbjogUGFydGlhbE9ic2VydmVyPFQ+O1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZWxheVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBxdWV1ZTogQXJyYXk8RGVsYXlNZXNzYWdlPFQ+PiA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGVycm9yZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBwcml2YXRlIHN0YXRpYyBkaXNwYXRjaDxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RGVsYXlTdGF0ZTxUPj4sIHN0YXRlOiBEZWxheVN0YXRlPFQ+KTogdm9pZCB7XG4gICAgY29uc3Qgc291cmNlID0gc3RhdGUuc291cmNlO1xuICAgIGNvbnN0IHF1ZXVlID0gc291cmNlLnF1ZXVlO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHN0YXRlLnNjaGVkdWxlcjtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHN0YXRlLmRlc3RpbmF0aW9uO1xuXG4gICAgd2hpbGUgKHF1ZXVlLmxlbmd0aCA+IDAgJiYgKHF1ZXVlWzBdLnRpbWUgLSBzY2hlZHVsZXIubm93KCkpIDw9IDApIHtcbiAgICAgIHF1ZXVlLnNoaWZ0KCkubm90aWZpY2F0aW9uLm9ic2VydmUoZGVzdGluYXRpb24pO1xuICAgIH1cblxuICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBkZWxheSA9IE1hdGgubWF4KDAsIHF1ZXVlWzBdLnRpbWUgLSBzY2hlZHVsZXIubm93KCkpO1xuICAgICAgdGhpcy5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgICBzb3VyY2UuYWN0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZGVsYXk6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcml2YXRlIF9zY2hlZHVsZShzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpOiB2b2lkIHtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERlbGF5U3RhdGU8VD4+KERlbGF5U3Vic2NyaWJlci5kaXNwYXRjaCwgdGhpcy5kZWxheSwge1xuICAgICAgc291cmNlOiB0aGlzLCBkZXN0aW5hdGlvbjogdGhpcy5kZXN0aW5hdGlvbiwgc2NoZWR1bGVyOiBzY2hlZHVsZXJcbiAgICB9KSk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlTm90aWZpY2F0aW9uKG5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPFQ+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZXJyb3JlZCA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgIGNvbnN0IG1lc3NhZ2UgPSBuZXcgRGVsYXlNZXNzYWdlKHNjaGVkdWxlci5ub3coKSArIHRoaXMuZGVsYXksIG5vdGlmaWNhdGlvbik7XG4gICAgdGhpcy5xdWV1ZS5wdXNoKG1lc3NhZ2UpO1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5fc2NoZWR1bGUoc2NoZWR1bGVyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB0aGlzLnNjaGVkdWxlTm90aWZpY2F0aW9uKE5vdGlmaWNhdGlvbi5jcmVhdGVOZXh0KHZhbHVlKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KSB7XG4gICAgdGhpcy5lcnJvcmVkID0gdHJ1ZTtcbiAgICB0aGlzLnF1ZXVlID0gW107XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgdGhpcy5zY2hlZHVsZU5vdGlmaWNhdGlvbihOb3RpZmljYXRpb24uY3JlYXRlQ29tcGxldGUoKSk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG59XG5cbmNsYXNzIERlbGF5TWVzc2FnZTxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSB0aW1lOiBudW1iZXIsXG4gICAgICAgICAgICAgIHB1YmxpYyByZWFkb25seSBub3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxUPikge1xuICB9XG59XG4iXX0=