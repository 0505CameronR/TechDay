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
var throttle_1 = require("./throttle");
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for `duration` milliseconds, then repeats this process.
 *
 * <span class="informal">Lets a value pass, then ignores source values for the
 * next `duration` milliseconds.</span>
 *
 * ![](throttleTime.png)
 *
 * `throttleTime` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled. After `duration` milliseconds (or the time unit determined
 * internally by the optional `scheduler`) has passed, the timer is disabled,
 * and this process repeats for the next source value. Optionally takes a
 * {@link SchedulerLike} for managing timers.
 *
 * ## Example
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(throttleTime(1000));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link auditTime}
 * @see {@link debounceTime}
 * @see {@link delay}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {number} duration Time to wait before emitting another value after
 * emitting the last value, measured in milliseconds or the time unit determined
 * internally by the optional `scheduler`.
 * @param {SchedulerLike} [scheduler=async] The {@link SchedulerLike} to use for
 * managing the timers that handle the throttling.
 * @param {Object} config a configuration object to define `leading` and
 * `trailing` behavior. Defaults to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttleTime
 * @owner Observable
 */
function throttleTime(duration, scheduler, config) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    if (config === void 0) { config = throttle_1.defaultThrottleConfig; }
    return function (source) { return source.lift(new ThrottleTimeOperator(duration, scheduler, config.leading, config.trailing)); };
}
exports.throttleTime = throttleTime;
var ThrottleTimeOperator = /** @class */ (function () {
    function ThrottleTimeOperator(duration, scheduler, leading, trailing) {
        this.duration = duration;
        this.scheduler = scheduler;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleTimeSubscriber(subscriber, this.duration, this.scheduler, this.leading, this.trailing));
    };
    return ThrottleTimeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ThrottleTimeSubscriber = /** @class */ (function (_super) {
    __extends(ThrottleTimeSubscriber, _super);
    function ThrottleTimeSubscriber(destination, duration, scheduler, leading, trailing) {
        var _this = _super.call(this, destination) || this;
        _this.duration = duration;
        _this.scheduler = scheduler;
        _this.leading = leading;
        _this.trailing = trailing;
        _this._hasTrailingValue = false;
        _this._trailingValue = null;
        return _this;
    }
    ThrottleTimeSubscriber.prototype._next = function (value) {
        if (this.throttled) {
            if (this.trailing) {
                this._trailingValue = value;
                this._hasTrailingValue = true;
            }
        }
        else {
            this.add(this.throttled = this.scheduler.schedule(dispatchNext, this.duration, { subscriber: this }));
            if (this.leading) {
                this.destination.next(value);
            }
        }
    };
    ThrottleTimeSubscriber.prototype._complete = function () {
        if (this._hasTrailingValue) {
            this.destination.next(this._trailingValue);
            this.destination.complete();
        }
        else {
            this.destination.complete();
        }
    };
    ThrottleTimeSubscriber.prototype.clearThrottle = function () {
        var throttled = this.throttled;
        if (throttled) {
            if (this.trailing && this._hasTrailingValue) {
                this.destination.next(this._trailingValue);
                this._trailingValue = null;
                this._hasTrailingValue = false;
            }
            throttled.unsubscribe();
            this.remove(throttled);
            this.throttled = null;
        }
    };
    return ThrottleTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchNext(arg) {
    var subscriber = arg.subscriber;
    subscriber.clearThrottle();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGVUaW1lLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGVUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUUzQyw0Q0FBMkM7QUFFM0MsdUNBQW1FO0FBR25FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsU0FBZ0IsWUFBWSxDQUFJLFFBQWdCLEVBQ2hCLFNBQWdDLEVBQ2hDLE1BQThDO0lBRDlDLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUNoQyx1QkFBQSxFQUFBLFNBQXlCLGdDQUFxQjtJQUM1RSxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsQ0FBQyxRQUFRLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTNGLENBQTJGLENBQUM7QUFDaEksQ0FBQztBQUpELG9DQUlDO0FBRUQ7SUFDRSw4QkFBb0IsUUFBZ0IsRUFDaEIsU0FBd0IsRUFDeEIsT0FBZ0IsRUFDaEIsUUFBaUI7UUFIakIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsYUFBUSxHQUFSLFFBQVEsQ0FBUztJQUNyQyxDQUFDO0lBRUQsbUNBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ3JCLElBQUksc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDbkcsQ0FBQztJQUNKLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLDBDQUFhO0lBS25ELGdDQUFZLFdBQTBCLEVBQ2xCLFFBQWdCLEVBQ2hCLFNBQXdCLEVBQ3hCLE9BQWdCLEVBQ2hCLFFBQWlCO1FBSnJDLFlBS0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBTG1CLGNBQVEsR0FBUixRQUFRLENBQVE7UUFDaEIsZUFBUyxHQUFULFNBQVMsQ0FBZTtRQUN4QixhQUFPLEdBQVAsT0FBTyxDQUFTO1FBQ2hCLGNBQVEsR0FBUixRQUFRLENBQVM7UUFQN0IsdUJBQWlCLEdBQVksS0FBSyxDQUFDO1FBQ25DLG9CQUFjLEdBQU0sSUFBSSxDQUFDOztJQVFqQyxDQUFDO0lBRVMsc0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSyxDQUFDO2dCQUM1QixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO2FBQy9CO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBaUIsWUFBWSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RILElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDOUI7U0FDRjtJQUNILENBQUM7SUFFUywwQ0FBUyxHQUFuQjtRQUNFLElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELDhDQUFhLEdBQWI7UUFDRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtnQkFDM0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztnQkFDM0IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLEtBQUssQ0FBQzthQUNoQztZQUNELFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ3ZCO0lBQ0gsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQWpERCxDQUF3Qyx1QkFBVSxHQWlEakQ7QUFNRCxTQUFTLFlBQVksQ0FBSSxHQUFtQjtJQUNsQyxJQUFBLDJCQUFVLENBQVM7SUFDM0IsVUFBVSxDQUFDLGFBQWEsRUFBRSxDQUFDO0FBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBUaHJvdHRsZUNvbmZpZywgZGVmYXVsdFRocm90dGxlQ29uZmlnIH0gZnJvbSAnLi90aHJvdHRsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogRW1pdHMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgdGhlbiBpZ25vcmVzIHN1YnNlcXVlbnQgc291cmNlXG4gKiB2YWx1ZXMgZm9yIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzLCB0aGVuIHJlcGVhdHMgdGhpcyBwcm9jZXNzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5MZXRzIGEgdmFsdWUgcGFzcywgdGhlbiBpZ25vcmVzIHNvdXJjZSB2YWx1ZXMgZm9yIHRoZVxuICogbmV4dCBgZHVyYXRpb25gIG1pbGxpc2Vjb25kcy48L3NwYW4+XG4gKlxuICogIVtdKHRocm90dGxlVGltZS5wbmcpXG4gKlxuICogYHRocm90dGxlVGltZWAgZW1pdHMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGVcbiAqIHdoZW4gaXRzIGludGVybmFsIHRpbWVyIGlzIGRpc2FibGVkLCBhbmQgaWdub3JlcyBzb3VyY2UgdmFsdWVzIHdoZW4gdGhlIHRpbWVyXG4gKiBpcyBlbmFibGVkLiBJbml0aWFsbHksIHRoZSB0aW1lciBpcyBkaXNhYmxlZC4gQXMgc29vbiBhcyB0aGUgZmlyc3Qgc291cmNlXG4gKiB2YWx1ZSBhcnJpdmVzLCBpdCBpcyBmb3J3YXJkZWQgdG8gdGhlIG91dHB1dCBPYnNlcnZhYmxlLCBhbmQgdGhlbiB0aGUgdGltZXJcbiAqIGlzIGVuYWJsZWQuIEFmdGVyIGBkdXJhdGlvbmAgbWlsbGlzZWNvbmRzIChvciB0aGUgdGltZSB1bml0IGRldGVybWluZWRcbiAqIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgKSBoYXMgcGFzc2VkLCB0aGUgdGltZXIgaXMgZGlzYWJsZWQsXG4gKiBhbmQgdGhpcyBwcm9jZXNzIHJlcGVhdHMgZm9yIHRoZSBuZXh0IHNvdXJjZSB2YWx1ZS4gT3B0aW9uYWxseSB0YWtlcyBhXG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gZm9yIG1hbmFnaW5nIHRpbWVycy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IGNsaWNrcyBhdCBhIHJhdGUgb2YgYXQgbW9zdCBvbmUgY2xpY2sgcGVyIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKHRocm90dGxlVGltZSgxMDAwKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXRUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2VUaW1lfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKiBAc2VlIHtAbGluayBzYW1wbGVUaW1lfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGV9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGR1cmF0aW9uIFRpbWUgdG8gd2FpdCBiZWZvcmUgZW1pdHRpbmcgYW5vdGhlciB2YWx1ZSBhZnRlclxuICogZW1pdHRpbmcgdGhlIGxhc3QgdmFsdWUsIG1lYXN1cmVkIGluIG1pbGxpc2Vjb25kcyBvciB0aGUgdGltZSB1bml0IGRldGVybWluZWRcbiAqIGludGVybmFsbHkgYnkgdGhlIG9wdGlvbmFsIGBzY2hlZHVsZXJgLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyPWFzeW5jXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3JcbiAqIG1hbmFnaW5nIHRoZSB0aW1lcnMgdGhhdCBoYW5kbGUgdGhlIHRocm90dGxpbmcuXG4gKiBAcGFyYW0ge09iamVjdH0gY29uZmlnIGEgY29uZmlndXJhdGlvbiBvYmplY3QgdG8gZGVmaW5lIGBsZWFkaW5nYCBhbmRcbiAqIGB0cmFpbGluZ2AgYmVoYXZpb3IuIERlZmF1bHRzIHRvIGB7IGxlYWRpbmc6IHRydWUsIHRyYWlsaW5nOiBmYWxzZSB9YC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBwZXJmb3JtcyB0aGUgdGhyb3R0bGUgb3BlcmF0aW9uIHRvXG4gKiBsaW1pdCB0aGUgcmF0ZSBvZiBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlLlxuICogQG1ldGhvZCB0aHJvdHRsZVRpbWVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZVRpbWU8VD4oZHVyYXRpb246IG51bWJlcixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogVGhyb3R0bGVDb25maWcgPSBkZWZhdWx0VGhyb3R0bGVDb25maWcpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFRocm90dGxlVGltZU9wZXJhdG9yKGR1cmF0aW9uLCBzY2hlZHVsZXIsIGNvbmZpZy5sZWFkaW5nLCBjb25maWcudHJhaWxpbmcpKTtcbn1cblxuY2xhc3MgVGhyb3R0bGVUaW1lT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZHVyYXRpb246IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgbGVhZGluZzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0cmFpbGluZzogYm9vbGVhbikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKFxuICAgICAgbmV3IFRocm90dGxlVGltZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kdXJhdGlvbiwgdGhpcy5zY2hlZHVsZXIsIHRoaXMubGVhZGluZywgdGhpcy50cmFpbGluZylcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUaHJvdHRsZVRpbWVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgdGhyb3R0bGVkOiBTdWJzY3JpcHRpb247XG4gIHByaXZhdGUgX2hhc1RyYWlsaW5nVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBfdHJhaWxpbmdWYWx1ZTogVCA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb246IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgIHByaXZhdGUgbGVhZGluZzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0cmFpbGluZzogYm9vbGVhbikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLnRocm90dGxlZCkge1xuICAgICAgaWYgKHRoaXMudHJhaWxpbmcpIHtcbiAgICAgICAgdGhpcy5fdHJhaWxpbmdWYWx1ZSA9IHZhbHVlO1xuICAgICAgICB0aGlzLl9oYXNUcmFpbGluZ1ZhbHVlID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGQodGhpcy50aHJvdHRsZWQgPSB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEFyZzxUPj4oZGlzcGF0Y2hOZXh0LCB0aGlzLmR1cmF0aW9uLCB7IHN1YnNjcmliZXI6IHRoaXMgfSkpO1xuICAgICAgaWYgKHRoaXMubGVhZGluZykge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuX2hhc1RyYWlsaW5nVmFsdWUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLl90cmFpbGluZ1ZhbHVlKTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFyVGhyb3R0bGUoKSB7XG4gICAgY29uc3QgdGhyb3R0bGVkID0gdGhpcy50aHJvdHRsZWQ7XG4gICAgaWYgKHRocm90dGxlZCkge1xuICAgICAgaWYgKHRoaXMudHJhaWxpbmcgJiYgdGhpcy5faGFzVHJhaWxpbmdWYWx1ZSkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5fdHJhaWxpbmdWYWx1ZSk7XG4gICAgICAgIHRoaXMuX3RyYWlsaW5nVmFsdWUgPSBudWxsO1xuICAgICAgICB0aGlzLl9oYXNUcmFpbGluZ1ZhbHVlID0gZmFsc2U7XG4gICAgICB9XG4gICAgICB0aHJvdHRsZWQudW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMucmVtb3ZlKHRocm90dGxlZCk7XG4gICAgICB0aGlzLnRocm90dGxlZCA9IG51bGw7XG4gICAgfVxuICB9XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEFyZzxUPiB7XG4gIHN1YnNjcmliZXI6IFRocm90dGxlVGltZVN1YnNjcmliZXI8VD47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dDxUPihhcmc6IERpc3BhdGNoQXJnPFQ+KSB7XG4gIGNvbnN0IHsgc3Vic2NyaWJlciB9ID0gYXJnO1xuICBzdWJzY3JpYmVyLmNsZWFyVGhyb3R0bGUoKTtcbn1cbiJdfQ==