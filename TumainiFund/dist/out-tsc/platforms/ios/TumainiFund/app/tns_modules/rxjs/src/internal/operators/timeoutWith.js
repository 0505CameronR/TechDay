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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:enable:max-line-length */
/**
 *
 * Errors if Observable does not emit a value in given time span, in case of which
 * subscribes to the second Observable.
 *
 * <span class="informal">It's a version of `timeout` operator that let's you specify fallback Observable.</span>
 *
 * ![](timeoutWith.png)
 *
 * `timeoutWith` is a variation of `timeout` operator. It behaves exactly the same,
 * still accepting as a first argument either a number or a Date, which control - respectively -
 * when values of source Observable should be emitted or when it should complete.
 *
 * The only difference is that it accepts a second, required parameter. This parameter
 * should be an Observable which will be subscribed when source Observable fails any timeout check.
 * So whenever regular `timeout` would emit an error, `timeoutWith` will instead start re-emitting
 * values from second Observable. Note that this fallback Observable is not checked for timeouts
 * itself, so it can emit values and complete at arbitrary points in time. From the moment of a second
 * subscription, Observable returned from `timeoutWith` simply mirrors fallback stream. When that
 * stream completes, it completes as well.
 *
 * Scheduler, which in case of `timeout` is provided as as second argument, can be still provided
 * here - as a third, optional parameter. It still is used to schedule timeout checks and -
 * as a consequence - when second Observable will be subscribed, since subscription happens
 * immediately after failing check.
 *
 * ## Example
 * Add fallback observable
 * ```javascript
 * const seconds = interval(1000);
 * const minutes = interval(60 * 1000);
 *
 * seconds.pipe(timeoutWith(900, minutes))
 *   .subscribe(
 *     value => console.log(value), // After 900ms, will start emitting `minutes`,
 *                                  // since first value of `seconds` will not arrive fast enough.
 *     err => console.log(err),     // Would be called after 900ms in case of `timeout`,
 *                                  // but here will never be called.
 *   );
 * ```
 *
 * @param {number|Date} due Number specifying period within which Observable must emit values
 *                          or Date specifying before when Observable should complete
 * @param {Observable<T>} withObservable Observable which will be subscribed if source fails timeout check.
 * @param {SchedulerLike} [scheduler] Scheduler controlling when timeout checks occur.
 * @return {Observable<T>} Observable that mirrors behaviour of source or, when timeout check fails, of an Observable
 *                          passed as a second parameter.
 * @method timeoutWith
 * @owner Observable
 */
function timeoutWith(due, withObservable, scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) {
        var absoluteTimeout = isDate_1.isDate(due);
        var waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
exports.timeoutWith = timeoutWith;
var TimeoutWithOperator = /** @class */ (function () {
    function TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    TimeoutWithOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    };
    return TimeoutWithOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TimeoutWithSubscriber = /** @class */ (function (_super) {
    __extends(TimeoutWithSubscriber, _super);
    function TimeoutWithSubscriber(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.absoluteTimeout = absoluteTimeout;
        _this.waitFor = waitFor;
        _this.withObservable = withObservable;
        _this.scheduler = scheduler;
        _this.action = null;
        _this.scheduleTimeout();
        return _this;
    }
    TimeoutWithSubscriber.dispatchTimeout = function (subscriber) {
        var withObservable = subscriber.withObservable;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(subscribeToResult_1.subscribeToResult(subscriber, withObservable));
    };
    TimeoutWithSubscriber.prototype.scheduleTimeout = function () {
        var action = this.action;
        if (action) {
            // Recycle the action if we've already scheduled one. All the production
            // Scheduler Actions mutate their state/delay time and return themeselves.
            // VirtualActions are immutable, so they create and return a clone. In this
            // case, we need to set the action reference to the most recent VirtualAction,
            // to ensure that's the one we clone from next time.
            this.action = action.schedule(this, this.waitFor);
        }
        else {
            this.add(this.action = this.scheduler.schedule(TimeoutWithSubscriber.dispatchTimeout, this.waitFor, this));
        }
    };
    TimeoutWithSubscriber.prototype._next = function (value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        _super.prototype._next.call(this, value);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    TimeoutWithSubscriber.prototype._unsubscribe = function () {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    };
    return TimeoutWithSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dFdpdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZW91dFdpdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBRTNDLHlDQUF3QztBQUN4QyxzREFBcUQ7QUFDckQsK0RBQThEO0FBSzlELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlERztBQUNILFNBQWdCLFdBQVcsQ0FBTyxHQUFrQixFQUNsQixjQUFrQyxFQUNsQyxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDaEUsT0FBTyxVQUFDLE1BQXFCO1FBQzNCLElBQUksZUFBZSxHQUFHLGVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNsQyxJQUFJLE9BQU8sR0FBRyxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQVMsR0FBRyxDQUFDLENBQUM7UUFDakYsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksbUJBQW1CLENBQUMsT0FBTyxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUNuRyxDQUFDLENBQUM7QUFDSixDQUFDO0FBUkQsa0NBUUM7QUFFRDtJQUNFLDZCQUFvQixPQUFlLEVBQ2YsZUFBd0IsRUFDeEIsY0FBb0MsRUFDcEMsU0FBd0I7UUFIeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG9CQUFlLEdBQWYsZUFBZSxDQUFTO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQzVDLENBQUM7SUFFRCxrQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHFCQUFxQixDQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FDcEYsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQVpELElBWUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBMEMseUNBQXFCO0lBSTdELCtCQUFZLFdBQTBCLEVBQ2xCLGVBQXdCLEVBQ3hCLE9BQWUsRUFDZixjQUFvQyxFQUNwQyxTQUF3QjtRQUo1QyxZQUtFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQU5tQixxQkFBZSxHQUFmLGVBQWUsQ0FBUztRQUN4QixhQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2Ysb0JBQWMsR0FBZCxjQUFjLENBQXNCO1FBQ3BDLGVBQVMsR0FBVCxTQUFTLENBQWU7UUFOcEMsWUFBTSxHQUFpRCxJQUFJLENBQUM7UUFRbEUsS0FBSSxDQUFDLGVBQWUsRUFBRSxDQUFDOztJQUN6QixDQUFDO0lBRWMscUNBQWUsR0FBOUIsVUFBcUMsVUFBdUM7UUFDbEUsSUFBQSwwQ0FBYyxDQUFnQjtRQUMvQixVQUFXLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM1QyxVQUFVLENBQUMsR0FBRyxDQUFDLHFDQUFpQixDQUFDLFVBQVUsRUFBRSxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFTywrQ0FBZSxHQUF2QjtRQUNVLElBQUEsb0JBQU0sQ0FBVTtRQUN4QixJQUFJLE1BQU0sRUFBRTtZQUNWLHdFQUF3RTtZQUN4RSwwRUFBMEU7WUFDMUUsMkVBQTJFO1lBQzNFLDhFQUE4RTtZQUM5RSxvREFBb0Q7WUFDcEQsSUFBSSxDQUFDLE1BQU0sR0FBbUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDO1NBQ3BHO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQW1ELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM1RixxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQ3pELENBQUMsQ0FBQztTQUNMO0lBQ0gsQ0FBQztJQUVTLHFDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDeEI7UUFDRCxpQkFBTSxLQUFLLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSw0Q0FBWSxHQUFaO1FBQ0UsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQWhERCxDQUEwQyxpQ0FBZSxHQWdEeEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzRGF0ZSB9IGZyb20gJy4uL3V0aWwvaXNEYXRlJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dFdpdGg8VCwgUj4oZHVlOiBudW1iZXIgfCBEYXRlLCB3aXRoT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZUlucHV0PFI+LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqXG4gKiBFcnJvcnMgaWYgT2JzZXJ2YWJsZSBkb2VzIG5vdCBlbWl0IGEgdmFsdWUgaW4gZ2l2ZW4gdGltZSBzcGFuLCBpbiBjYXNlIG9mIHdoaWNoXG4gKiBzdWJzY3JpYmVzIHRvIHRoZSBzZWNvbmQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBhIHZlcnNpb24gb2YgYHRpbWVvdXRgIG9wZXJhdG9yIHRoYXQgbGV0J3MgeW91IHNwZWNpZnkgZmFsbGJhY2sgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKHRpbWVvdXRXaXRoLnBuZylcbiAqXG4gKiBgdGltZW91dFdpdGhgIGlzIGEgdmFyaWF0aW9uIG9mIGB0aW1lb3V0YCBvcGVyYXRvci4gSXQgYmVoYXZlcyBleGFjdGx5IHRoZSBzYW1lLFxuICogc3RpbGwgYWNjZXB0aW5nIGFzIGEgZmlyc3QgYXJndW1lbnQgZWl0aGVyIGEgbnVtYmVyIG9yIGEgRGF0ZSwgd2hpY2ggY29udHJvbCAtIHJlc3BlY3RpdmVseSAtXG4gKiB3aGVuIHZhbHVlcyBvZiBzb3VyY2UgT2JzZXJ2YWJsZSBzaG91bGQgYmUgZW1pdHRlZCBvciB3aGVuIGl0IHNob3VsZCBjb21wbGV0ZS5cbiAqXG4gKiBUaGUgb25seSBkaWZmZXJlbmNlIGlzIHRoYXQgaXQgYWNjZXB0cyBhIHNlY29uZCwgcmVxdWlyZWQgcGFyYW1ldGVyLiBUaGlzIHBhcmFtZXRlclxuICogc2hvdWxkIGJlIGFuIE9ic2VydmFibGUgd2hpY2ggd2lsbCBiZSBzdWJzY3JpYmVkIHdoZW4gc291cmNlIE9ic2VydmFibGUgZmFpbHMgYW55IHRpbWVvdXQgY2hlY2suXG4gKiBTbyB3aGVuZXZlciByZWd1bGFyIGB0aW1lb3V0YCB3b3VsZCBlbWl0IGFuIGVycm9yLCBgdGltZW91dFdpdGhgIHdpbGwgaW5zdGVhZCBzdGFydCByZS1lbWl0dGluZ1xuICogdmFsdWVzIGZyb20gc2Vjb25kIE9ic2VydmFibGUuIE5vdGUgdGhhdCB0aGlzIGZhbGxiYWNrIE9ic2VydmFibGUgaXMgbm90IGNoZWNrZWQgZm9yIHRpbWVvdXRzXG4gKiBpdHNlbGYsIHNvIGl0IGNhbiBlbWl0IHZhbHVlcyBhbmQgY29tcGxldGUgYXQgYXJiaXRyYXJ5IHBvaW50cyBpbiB0aW1lLiBGcm9tIHRoZSBtb21lbnQgb2YgYSBzZWNvbmRcbiAqIHN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tIGB0aW1lb3V0V2l0aGAgc2ltcGx5IG1pcnJvcnMgZmFsbGJhY2sgc3RyZWFtLiBXaGVuIHRoYXRcbiAqIHN0cmVhbSBjb21wbGV0ZXMsIGl0IGNvbXBsZXRlcyBhcyB3ZWxsLlxuICpcbiAqIFNjaGVkdWxlciwgd2hpY2ggaW4gY2FzZSBvZiBgdGltZW91dGAgaXMgcHJvdmlkZWQgYXMgYXMgc2Vjb25kIGFyZ3VtZW50LCBjYW4gYmUgc3RpbGwgcHJvdmlkZWRcbiAqIGhlcmUgLSBhcyBhIHRoaXJkLCBvcHRpb25hbCBwYXJhbWV0ZXIuIEl0IHN0aWxsIGlzIHVzZWQgdG8gc2NoZWR1bGUgdGltZW91dCBjaGVja3MgYW5kIC1cbiAqIGFzIGEgY29uc2VxdWVuY2UgLSB3aGVuIHNlY29uZCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZCwgc2luY2Ugc3Vic2NyaXB0aW9uIGhhcHBlbnNcbiAqIGltbWVkaWF0ZWx5IGFmdGVyIGZhaWxpbmcgY2hlY2suXG4gKlxuICogIyMgRXhhbXBsZVxuICogQWRkIGZhbGxiYWNrIG9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IHNlY29uZHMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IG1pbnV0ZXMgPSBpbnRlcnZhbCg2MCAqIDEwMDApO1xuICpcbiAqIHNlY29uZHMucGlwZSh0aW1lb3V0V2l0aCg5MDAsIG1pbnV0ZXMpKVxuICogICAuc3Vic2NyaWJlKFxuICogICAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSwgLy8gQWZ0ZXIgOTAwbXMsIHdpbGwgc3RhcnQgZW1pdHRpbmcgYG1pbnV0ZXNgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgZmlyc3QgdmFsdWUgb2YgYHNlY29uZHNgIHdpbGwgbm90IGFycml2ZSBmYXN0IGVub3VnaC5cbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgIC8vIFdvdWxkIGJlIGNhbGxlZCBhZnRlciA5MDBtcyBpbiBjYXNlIG9mIGB0aW1lb3V0YCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBoZXJlIHdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICApO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gZHVlIE51bWJlciBzcGVjaWZ5aW5nIHBlcmlvZCB3aXRoaW4gd2hpY2ggT2JzZXJ2YWJsZSBtdXN0IGVtaXQgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgRGF0ZSBzcGVjaWZ5aW5nIGJlZm9yZSB3aGVuIE9ic2VydmFibGUgc2hvdWxkIGNvbXBsZXRlXG4gKiBAcGFyYW0ge09ic2VydmFibGU8VD59IHdpdGhPYnNlcnZhYmxlIE9ic2VydmFibGUgd2hpY2ggd2lsbCBiZSBzdWJzY3JpYmVkIGlmIHNvdXJjZSBmYWlscyB0aW1lb3V0IGNoZWNrLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgY29udHJvbGxpbmcgd2hlbiB0aW1lb3V0IGNoZWNrcyBvY2N1ci5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIGJlaGF2aW91ciBvZiBzb3VyY2Ugb3IsIHdoZW4gdGltZW91dCBjaGVjayBmYWlscywgb2YgYW4gT2JzZXJ2YWJsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhIHNlY29uZCBwYXJhbWV0ZXIuXG4gKiBAbWV0aG9kIHRpbWVvdXRXaXRoXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dFdpdGg8VCwgUj4oZHVlOiBudW1iZXIgfCBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgbGV0IGFic29sdXRlVGltZW91dCA9IGlzRGF0ZShkdWUpO1xuICAgIGxldCB3YWl0Rm9yID0gYWJzb2x1dGVUaW1lb3V0ID8gKCtkdWUgLSBzY2hlZHVsZXIubm93KCkpIDogTWF0aC5hYnMoPG51bWJlcj5kdWUpO1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgVGltZW91dFdpdGhPcGVyYXRvcih3YWl0Rm9yLCBhYnNvbHV0ZVRpbWVvdXQsIHdpdGhPYnNlcnZhYmxlLCBzY2hlZHVsZXIpKTtcbiAgfTtcbn1cblxuY2xhc3MgVGltZW91dFdpdGhPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3YWl0Rm9yOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgYWJzb2x1dGVUaW1lb3V0OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGltZW91dFdpdGhTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5hYnNvbHV0ZVRpbWVvdXQsIHRoaXMud2FpdEZvciwgdGhpcy53aXRoT2JzZXJ2YWJsZSwgdGhpcy5zY2hlZHVsZXJcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIGFjdGlvbjogU2NoZWR1bGVyQWN0aW9uPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4gPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGFic29sdXRlVGltZW91dDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB3YWl0Rm9yOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnNjaGVkdWxlVGltZW91dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZGlzcGF0Y2hUaW1lb3V0PFQsIFI+KHN1YnNjcmliZXI6IFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHsgd2l0aE9ic2VydmFibGUgfSA9IHN1YnNjcmliZXI7XG4gICAgKDxhbnk+IHN1YnNjcmliZXIpLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTtcbiAgICBzdWJzY3JpYmVyLmFkZChzdWJzY3JpYmVUb1Jlc3VsdChzdWJzY3JpYmVyLCB3aXRoT2JzZXJ2YWJsZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZVRpbWVvdXQoKTogdm9pZCB7XG4gICAgY29uc3QgeyBhY3Rpb24gfSA9IHRoaXM7XG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgLy8gUmVjeWNsZSB0aGUgYWN0aW9uIGlmIHdlJ3ZlIGFscmVhZHkgc2NoZWR1bGVkIG9uZS4gQWxsIHRoZSBwcm9kdWN0aW9uXG4gICAgICAvLyBTY2hlZHVsZXIgQWN0aW9ucyBtdXRhdGUgdGhlaXIgc3RhdGUvZGVsYXkgdGltZSBhbmQgcmV0dXJuIHRoZW1lc2VsdmVzLlxuICAgICAgLy8gVmlydHVhbEFjdGlvbnMgYXJlIGltbXV0YWJsZSwgc28gdGhleSBjcmVhdGUgYW5kIHJldHVybiBhIGNsb25lLiBJbiB0aGlzXG4gICAgICAvLyBjYXNlLCB3ZSBuZWVkIHRvIHNldCB0aGUgYWN0aW9uIHJlZmVyZW5jZSB0byB0aGUgbW9zdCByZWNlbnQgVmlydHVhbEFjdGlvbixcbiAgICAgIC8vIHRvIGVuc3VyZSB0aGF0J3MgdGhlIG9uZSB3ZSBjbG9uZSBmcm9tIG5leHQgdGltZS5cbiAgICAgIHRoaXMuYWN0aW9uID0gKDxTY2hlZHVsZXJBY3Rpb248VGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+Pj4gYWN0aW9uLnNjaGVkdWxlKHRoaXMsIHRoaXMud2FpdEZvcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZCh0aGlzLmFjdGlvbiA9ICg8U2NoZWR1bGVyQWN0aW9uPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4+IHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4oXG4gICAgICAgIFRpbWVvdXRXaXRoU3Vic2NyaWJlci5kaXNwYXRjaFRpbWVvdXQsIHRoaXMud2FpdEZvciwgdGhpc1xuICAgICAgKSkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hYnNvbHV0ZVRpbWVvdXQpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgfVxuICAgIHN1cGVyLl9uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuYWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG4gICAgdGhpcy53aXRoT2JzZXJ2YWJsZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==