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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVib3VuY2VUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVib3VuY2VUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQUUzQyw0Q0FBMkM7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNILFNBQWdCLFlBQVksQ0FBSSxPQUFlLEVBQUUsU0FBZ0M7SUFBaEMsMEJBQUEsRUFBQSxZQUEyQixhQUFLO0lBQy9FLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFvQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDO0FBQzlGLENBQUM7QUFGRCxvQ0FFQztBQUVEO0lBQ0UsOEJBQW9CLE9BQWUsRUFBVSxTQUF3QjtRQUFqRCxZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQVUsY0FBUyxHQUFULFNBQVMsQ0FBZTtJQUNyRSxDQUFDO0lBRUQsbUNBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNoRyxDQUFDO0lBQ0gsMkJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF3QywwQ0FBYTtJQUtuRCxnQ0FBWSxXQUEwQixFQUNsQixPQUFlLEVBQ2YsU0FBd0I7UUFGNUMsWUFHRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFIbUIsYUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLGVBQVMsR0FBVCxTQUFTLENBQWU7UUFOcEMsMkJBQXFCLEdBQWlCLElBQUksQ0FBQztRQUMzQyxlQUFTLEdBQU0sSUFBSSxDQUFDO1FBQ3BCLGNBQVEsR0FBWSxLQUFLLENBQUM7O0lBTWxDLENBQUM7SUFFUyxzQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDbkcsQ0FBQztJQUVTLDBDQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELDhDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFFckIsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ1QsSUFBQSwwQkFBUyxDQUFVO1lBQzNCLCtDQUErQztZQUMvQyxxREFBcUQ7WUFDckQsb0RBQW9EO1lBQ3BELDhDQUE4QztZQUM5QyxrQ0FBa0M7WUFDbEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7WUFDdEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRU8sOENBQWEsR0FBckI7UUFDRSxJQUFNLHFCQUFxQixHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUV6RCxJQUFJLHFCQUFxQixLQUFLLElBQUksRUFBRTtZQUNsQyxJQUFJLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7WUFDbkMscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDcEMsSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksQ0FBQztTQUNuQztJQUNILENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUFoREQsQ0FBd0MsdUJBQVUsR0FnRGpEO0FBRUQsU0FBUyxZQUFZLENBQUMsVUFBdUM7SUFDM0QsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRW1pdHMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBvbmx5IGFmdGVyIGEgcGFydGljdWxhciB0aW1lIHNwYW5cbiAqIGhhcyBwYXNzZWQgd2l0aG91dCBhbm90aGVyIHNvdXJjZSBlbWlzc2lvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBkZWxheX0sIGJ1dCBwYXNzZXMgb25seSB0aGUgbW9zdFxuICogcmVjZW50IHZhbHVlIGZyb20gZWFjaCBidXJzdCBvZiBlbWlzc2lvbnMuPC9zcGFuPlxuICpcbiAqICFbXShkZWJvdW5jZVRpbWUucG5nKVxuICpcbiAqIGBkZWJvdW5jZVRpbWVgIGRlbGF5cyB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCBkcm9wc1xuICogcHJldmlvdXMgcGVuZGluZyBkZWxheWVkIGVtaXNzaW9ucyBpZiBhIG5ldyB2YWx1ZSBhcnJpdmVzIG9uIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoaXMgb3BlcmF0b3Iga2VlcHMgdHJhY2sgb2YgdGhlIG1vc3QgcmVjZW50IHZhbHVlIGZyb20gdGhlXG4gKiBzb3VyY2UgT2JzZXJ2YWJsZSwgYW5kIGVtaXRzIHRoYXQgb25seSB3aGVuIGBkdWVUaW1lYCBlbm91Z2ggdGltZSBoYXMgcGFzc2VkXG4gKiB3aXRob3V0IGFueSBvdGhlciB2YWx1ZSBhcHBlYXJpbmcgb24gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJZiBhIG5ldyB2YWx1ZVxuICogYXBwZWFycyBiZWZvcmUgYGR1ZVRpbWVgIHNpbGVuY2Ugb2NjdXJzLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbCBiZSBkcm9wcGVkXG4gKiBhbmQgd2lsbCBub3QgYmUgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogVGhpcyBpcyBhIHJhdGUtbGltaXRpbmcgb3BlcmF0b3IsIGJlY2F1c2UgaXQgaXMgaW1wb3NzaWJsZSBmb3IgbW9yZSB0aGFuIG9uZVxuICogdmFsdWUgdG8gYmUgZW1pdHRlZCBpbiBhbnkgdGltZSB3aW5kb3cgb2YgZHVyYXRpb24gYGR1ZVRpbWVgLCBidXQgaXQgaXMgYWxzb1xuICogYSBkZWxheS1saWtlIG9wZXJhdG9yIHNpbmNlIG91dHB1dCBlbWlzc2lvbnMgZG8gbm90IG9jY3VyIGF0IHRoZSBzYW1lIHRpbWUgYXNcbiAqIHRoZXkgZGlkIG9uIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gT3B0aW9uYWxseSB0YWtlcyBhIHtAbGluayBTY2hlZHVsZXJMaWtlfSBmb3JcbiAqIG1hbmFnaW5nIHRpbWVycy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IHRoZSBtb3N0IHJlY2VudCBjbGljayBhZnRlciBhIGJ1cnN0IG9mIGNsaWNrc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKGRlYm91bmNlVGltZSgxMDAwKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXRUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2V9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZVRpbWV9XG4gKiBAc2VlIHtAbGluayB0aHJvdHRsZVRpbWV9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGR1ZVRpbWUgVGhlIHRpbWVvdXQgZHVyYXRpb24gaW4gbWlsbGlzZWNvbmRzIChvciB0aGUgdGltZVxuICogdW5pdCBkZXRlcm1pbmVkIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgKSBmb3IgdGhlIHdpbmRvdyBvZlxuICogdGltZSByZXF1aXJlZCB0byB3YWl0IGZvciBlbWlzc2lvbiBzaWxlbmNlIGJlZm9yZSBlbWl0dGluZyB0aGUgbW9zdCByZWNlbnRcbiAqIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yXG4gKiBtYW5hZ2luZyB0aGUgdGltZXJzIHRoYXQgaGFuZGxlIHRoZSB0aW1lb3V0IGZvciBlYWNoIHZhbHVlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGRlbGF5cyB0aGUgZW1pc3Npb25zIG9mIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYnkgdGhlIHNwZWNpZmllZCBgZHVlVGltZWAsIGFuZCBtYXkgZHJvcCBzb21lIHZhbHVlcyBpZiB0aGV5IG9jY3VyXG4gKiB0b28gZnJlcXVlbnRseS5cbiAqIEBtZXRob2QgZGVib3VuY2VUaW1lXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVib3VuY2VUaW1lPFQ+KGR1ZVRpbWU6IG51bWJlciwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERlYm91bmNlVGltZU9wZXJhdG9yKGR1ZVRpbWUsIHNjaGVkdWxlcikpO1xufVxuXG5jbGFzcyBEZWJvdW5jZVRpbWVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkdWVUaW1lOiBudW1iZXIsIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERlYm91bmNlVGltZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kdWVUaW1lLCB0aGlzLnNjaGVkdWxlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZWJvdW5jZVRpbWVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgZGVib3VuY2VkU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24gPSBudWxsO1xuICBwcml2YXRlIGxhc3RWYWx1ZTogVCA9IG51bGw7XG4gIHByaXZhdGUgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdWVUaW1lOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy5jbGVhckRlYm91bmNlKCk7XG4gICAgdGhpcy5sYXN0VmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLmhhc1ZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLmFkZCh0aGlzLmRlYm91bmNlZFN1YnNjcmlwdGlvbiA9IHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlKGRpc3BhdGNoTmV4dCwgdGhpcy5kdWVUaW1lLCB0aGlzKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIHRoaXMuZGVib3VuY2VkTmV4dCgpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIGRlYm91bmNlZE5leHQoKTogdm9pZCB7XG4gICAgdGhpcy5jbGVhckRlYm91bmNlKCk7XG5cbiAgICBpZiAodGhpcy5oYXNWYWx1ZSkge1xuICAgICAgY29uc3QgeyBsYXN0VmFsdWUgfSA9IHRoaXM7XG4gICAgICAvLyBUaGlzIG11c3QgYmUgZG9uZSAqYmVmb3JlKiBwYXNzaW5nIHRoZSB2YWx1ZVxuICAgICAgLy8gYWxvbmcgdG8gdGhlIGRlc3RpbmF0aW9uIGJlY2F1c2UgaXQncyBwb3NzaWJsZSBmb3JcbiAgICAgIC8vIHRoZSB2YWx1ZSB0byBzeW5jaHJvbm91c2x5IHJlLWVudGVyIHRoaXMgb3BlcmF0b3JcbiAgICAgIC8vIHJlY3Vyc2l2ZWx5IHdoZW4gc2NoZWR1bGVkIHdpdGggdGhpbmdzIGxpa2VcbiAgICAgIC8vIFZpcnR1YWxTY2hlZHVsZXIvVGVzdFNjaGVkdWxlci5cbiAgICAgIHRoaXMubGFzdFZhbHVlID0gbnVsbDtcbiAgICAgIHRoaXMuaGFzVmFsdWUgPSBmYWxzZTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChsYXN0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJEZWJvdW5jZSgpOiB2b2lkIHtcbiAgICBjb25zdCBkZWJvdW5jZWRTdWJzY3JpcHRpb24gPSB0aGlzLmRlYm91bmNlZFN1YnNjcmlwdGlvbjtcblxuICAgIGlmIChkZWJvdW5jZWRTdWJzY3JpcHRpb24gIT09IG51bGwpIHtcbiAgICAgIHRoaXMucmVtb3ZlKGRlYm91bmNlZFN1YnNjcmlwdGlvbik7XG4gICAgICBkZWJvdW5jZWRTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuZGVib3VuY2VkU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hOZXh0KHN1YnNjcmliZXI6IERlYm91bmNlVGltZVN1YnNjcmliZXI8YW55Pikge1xuICBzdWJzY3JpYmVyLmRlYm91bmNlZE5leHQoKTtcbn1cbiJdfQ==