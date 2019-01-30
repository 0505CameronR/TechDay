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
var Subscriber_1 = require("../Subscriber");
var async_1 = require("../scheduler/async");
/**
 * Emits a value from the source Observable only after a particular time span
 * has passed without another source emission.
 *
 * <span class="informal">It's like {@link delay}, but passes only the most
 * recent value from each burst of emissions.</span>
 *
 * ![](debounceTime.png)
 *
 * `debounceTime` delays values emitted by the source Observable, but drops
 * previous pending delayed emissions if a new value arrives on the source
 * Observable. This operator keeps track of the most recent value from the
 * source Observable, and emits that only when `dueTime` enough time has passed
 * without any other value appearing on the source Observable. If a new value
 * appears before `dueTime` silence occurs, the previous value will be dropped
 * and will not be emitted on the output Observable.
 *
 * This is a rate-limiting operator, because it is impossible for more than one
 * value to be emitted in any time window of duration `dueTime`, but it is also
 * a delay-like operator since output emissions do not occur at the same time as
 * they did on the source Observable. Optionally takes a {@link SchedulerLike} for
 * managing timers.
 *
 * ## Example
 * Emit the most recent click after a burst of clicks
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(debounceTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttleTime}
 *
 * @param {number} dueTime The timeout duration in milliseconds (or the time
 * unit determined internally by the optional `scheduler`) for the window of
 * time required to wait for emission silence before emitting the most recent
 * source value.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the timeout for each value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified `dueTime`, and may drop some values if they occur
 * too frequently.
 * @method debounceTime
 * @owner Observable
 */
function debounceTime(dueTime, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) { return source.lift(new DebounceTimeOperator(dueTime, scheduler)); };
}
exports.debounceTime = debounceTime;
var DebounceTimeOperator = /** @class */ (function () {
    function DebounceTimeOperator(dueTime, scheduler) {
        this.dueTime = dueTime;
        this.scheduler = scheduler;
    }
    DebounceTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DebounceTimeSubscriber(subscriber, this.dueTime, this.scheduler));
    };
    return DebounceTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DebounceTimeSubscriber = /** @class */ (function (_super) {
    __extends(DebounceTimeSubscriber, _super);
    function DebounceTimeSubscriber(destination, dueTime, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.dueTime = dueTime;
        _this.scheduler = scheduler;
        _this.debouncedSubscription = null;
        _this.lastValue = null;
        _this.hasValue = false;
        return _this;
    }
    DebounceTimeSubscriber.prototype._next = function (value) {
        this.clearDebounce();
        this.lastValue = value;
        this.hasValue = true;
        this.add(this.debouncedSubscription = this.scheduler.schedule(dispatchNext, this.dueTime, this));
    };
    DebounceTimeSubscriber.prototype._complete = function () {
        this.debouncedNext();
        this.destination.complete();
    };
    DebounceTimeSubscriber.prototype.debouncedNext = function () {
        this.clearDebounce();
        if (this.hasValue) {
            var lastValue = this.lastValue;
            // This must be done *before* passing the value
            // along to the destination because it's possible for
            // the value to synchronously re-enter this operator
            // recursively when scheduled with things like
            // VirtualScheduler/TestScheduler.
            this.lastValue = null;
            this.hasValue = false;
            this.destination.next(lastValue);
        }
    };
    DebounceTimeSubscriber.prototype.clearDebounce = function () {
        var debouncedSubscription = this.debouncedSubscription;
        if (debouncedSubscription !== null) {
            this.remove(debouncedSubscription);
            debouncedSubscription.unsubscribe();
            this.debouncedSubscription = null;
        }
    };
    return DebounceTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(subscriber) {
    subscriber.debouncedNext();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVib3VuY2VUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2RlYm91bmNlVGltZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFFM0MsNENBQTJDO0FBRzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnREc7QUFDSCxTQUFnQixZQUFZLENBQUksT0FBZSxFQUFFLFNBQWdDO0lBQWhDLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUMvRSxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBekQsQ0FBeUQsQ0FBQztBQUM5RixDQUFDO0FBRkQsb0NBRUM7QUFFRDtJQUNFLDhCQUFvQixPQUFlLEVBQVUsU0FBd0I7UUFBakQsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWU7SUFDckUsQ0FBQztJQUVELG1DQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBd0MsMENBQWE7SUFLbkQsZ0NBQVksV0FBMEIsRUFDbEIsT0FBZSxFQUNmLFNBQXdCO1FBRjVDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixlQUFTLEdBQVQsU0FBUyxDQUFlO1FBTnBDLDJCQUFxQixHQUFpQixJQUFJLENBQUM7UUFDM0MsZUFBUyxHQUFNLElBQUksQ0FBQztRQUNwQixjQUFRLEdBQVksS0FBSyxDQUFDOztJQU1sQyxDQUFDO0lBRVMsc0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUM7SUFFUywwQ0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCw4Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBRXJCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNULElBQUEsMEJBQVMsQ0FBVTtZQUMzQiwrQ0FBK0M7WUFDL0MscURBQXFEO1lBQ3JELG9EQUFvRDtZQUNwRCw4Q0FBOEM7WUFDOUMsa0NBQWtDO1lBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1NBQ2xDO0lBQ0gsQ0FBQztJQUVPLDhDQUFhLEdBQXJCO1FBQ0UsSUFBTSxxQkFBcUIsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUM7UUFFekQsSUFBSSxxQkFBcUIsS0FBSyxJQUFJLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1lBQ25DLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3BDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBaERELENBQXdDLHVCQUFVLEdBZ0RqRDtBQUVELFNBQVMsWUFBWSxDQUFDLFVBQXVDO0lBQzNELFVBQVUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgb25seSBhZnRlciBhIHBhcnRpY3VsYXIgdGltZSBzcGFuXG4gKiBoYXMgcGFzc2VkIHdpdGhvdXQgYW5vdGhlciBzb3VyY2UgZW1pc3Npb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgZGVsYXl9LCBidXQgcGFzc2VzIG9ubHkgdGhlIG1vc3RcbiAqIHJlY2VudCB2YWx1ZSBmcm9tIGVhY2ggYnVyc3Qgb2YgZW1pc3Npb25zLjwvc3Bhbj5cbiAqXG4gKiAhW10oZGVib3VuY2VUaW1lLnBuZylcbiAqXG4gKiBgZGVib3VuY2VUaW1lYCBkZWxheXMgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgZHJvcHNcbiAqIHByZXZpb3VzIHBlbmRpbmcgZGVsYXllZCBlbWlzc2lvbnMgaWYgYSBuZXcgdmFsdWUgYXJyaXZlcyBvbiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGlzIG9wZXJhdG9yIGtlZXBzIHRyYWNrIG9mIHRoZSBtb3N0IHJlY2VudCB2YWx1ZSBmcm9tIHRoZVxuICogc291cmNlIE9ic2VydmFibGUsIGFuZCBlbWl0cyB0aGF0IG9ubHkgd2hlbiBgZHVlVGltZWAgZW5vdWdoIHRpbWUgaGFzIHBhc3NlZFxuICogd2l0aG91dCBhbnkgb3RoZXIgdmFsdWUgYXBwZWFyaW5nIG9uIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgYSBuZXcgdmFsdWVcbiAqIGFwcGVhcnMgYmVmb3JlIGBkdWVUaW1lYCBzaWxlbmNlIG9jY3VycywgdGhlIHByZXZpb3VzIHZhbHVlIHdpbGwgYmUgZHJvcHBlZFxuICogYW5kIHdpbGwgbm90IGJlIGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIFRoaXMgaXMgYSByYXRlLWxpbWl0aW5nIG9wZXJhdG9yLCBiZWNhdXNlIGl0IGlzIGltcG9zc2libGUgZm9yIG1vcmUgdGhhbiBvbmVcbiAqIHZhbHVlIHRvIGJlIGVtaXR0ZWQgaW4gYW55IHRpbWUgd2luZG93IG9mIGR1cmF0aW9uIGBkdWVUaW1lYCwgYnV0IGl0IGlzIGFsc29cbiAqIGEgZGVsYXktbGlrZSBvcGVyYXRvciBzaW5jZSBvdXRwdXQgZW1pc3Npb25zIGRvIG5vdCBvY2N1ciBhdCB0aGUgc2FtZSB0aW1lIGFzXG4gKiB0aGV5IGRpZCBvbiB0aGUgc291cmNlIE9ic2VydmFibGUuIE9wdGlvbmFsbHkgdGFrZXMgYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gZm9yXG4gKiBtYW5hZ2luZyB0aW1lcnMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdCB0aGUgbW9zdCByZWNlbnQgY2xpY2sgYWZ0ZXIgYSBidXJzdCBvZiBjbGlja3NcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShkZWJvdW5jZVRpbWUoMTAwMCkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGF1ZGl0VGltZX1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKiBAc2VlIHtAbGluayBzYW1wbGVUaW1lfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGVUaW1lfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBkdWVUaW1lIFRoZSB0aW1lb3V0IGR1cmF0aW9uIGluIG1pbGxpc2Vjb25kcyAob3IgdGhlIHRpbWVcbiAqIHVuaXQgZGV0ZXJtaW5lZCBpbnRlcm5hbGx5IGJ5IHRoZSBvcHRpb25hbCBgc2NoZWR1bGVyYCkgZm9yIHRoZSB3aW5kb3cgb2ZcbiAqIHRpbWUgcmVxdWlyZWQgdG8gd2FpdCBmb3IgZW1pc3Npb24gc2lsZW5jZSBiZWZvcmUgZW1pdHRpbmcgdGhlIG1vc3QgcmVjZW50XG4gKiBzb3VyY2UgdmFsdWUuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvclxuICogbWFuYWdpbmcgdGhlIHRpbWVycyB0aGF0IGhhbmRsZSB0aGUgdGltZW91dCBmb3IgZWFjaCB2YWx1ZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBkZWxheXMgdGhlIGVtaXNzaW9ucyBvZiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGJ5IHRoZSBzcGVjaWZpZWQgYGR1ZVRpbWVgLCBhbmQgbWF5IGRyb3Agc29tZSB2YWx1ZXMgaWYgdGhleSBvY2N1clxuICogdG9vIGZyZXF1ZW50bHkuXG4gKiBAbWV0aG9kIGRlYm91bmNlVGltZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlVGltZTxUPihkdWVUaW1lOiBudW1iZXIsIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEZWJvdW5jZVRpbWVPcGVyYXRvcihkdWVUaW1lLCBzY2hlZHVsZXIpKTtcbn1cblxuY2xhc3MgRGVib3VuY2VUaW1lT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHVlVGltZTogbnVtYmVyLCBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZWJvdW5jZVRpbWVTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZHVlVGltZSwgdGhpcy5zY2hlZHVsZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRGVib3VuY2VUaW1lU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGRlYm91bmNlZFN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgcHJpdmF0ZSBsYXN0VmFsdWU6IFQgPSBudWxsO1xuICBwcml2YXRlIGhhc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVlVGltZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuY2xlYXJEZWJvdW5jZSgpO1xuICAgIHRoaXMubGFzdFZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5hZGQodGhpcy5kZWJvdW5jZWRTdWJzY3JpcHRpb24gPSB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaE5leHQsIHRoaXMuZHVlVGltZSwgdGhpcykpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICB0aGlzLmRlYm91bmNlZE5leHQoKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBkZWJvdW5jZWROZXh0KCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJEZWJvdW5jZSgpO1xuXG4gICAgaWYgKHRoaXMuaGFzVmFsdWUpIHtcbiAgICAgIGNvbnN0IHsgbGFzdFZhbHVlIH0gPSB0aGlzO1xuICAgICAgLy8gVGhpcyBtdXN0IGJlIGRvbmUgKmJlZm9yZSogcGFzc2luZyB0aGUgdmFsdWVcbiAgICAgIC8vIGFsb25nIHRvIHRoZSBkZXN0aW5hdGlvbiBiZWNhdXNlIGl0J3MgcG9zc2libGUgZm9yXG4gICAgICAvLyB0aGUgdmFsdWUgdG8gc3luY2hyb25vdXNseSByZS1lbnRlciB0aGlzIG9wZXJhdG9yXG4gICAgICAvLyByZWN1cnNpdmVseSB3aGVuIHNjaGVkdWxlZCB3aXRoIHRoaW5ncyBsaWtlXG4gICAgICAvLyBWaXJ0dWFsU2NoZWR1bGVyL1Rlc3RTY2hlZHVsZXIuXG4gICAgICB0aGlzLmxhc3RWYWx1ZSA9IG51bGw7XG4gICAgICB0aGlzLmhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQobGFzdFZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFyRGVib3VuY2UoKTogdm9pZCB7XG4gICAgY29uc3QgZGVib3VuY2VkU3Vic2NyaXB0aW9uID0gdGhpcy5kZWJvdW5jZWRTdWJzY3JpcHRpb247XG5cbiAgICBpZiAoZGVib3VuY2VkU3Vic2NyaXB0aW9uICE9PSBudWxsKSB7XG4gICAgICB0aGlzLnJlbW92ZShkZWJvdW5jZWRTdWJzY3JpcHRpb24pO1xuICAgICAgZGVib3VuY2VkU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmRlYm91bmNlZFN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dChzdWJzY3JpYmVyOiBEZWJvdW5jZVRpbWVTdWJzY3JpYmVyPGFueT4pIHtcbiAgc3Vic2NyaWJlci5kZWJvdW5jZWROZXh0KCk7XG59XG4iXX0=