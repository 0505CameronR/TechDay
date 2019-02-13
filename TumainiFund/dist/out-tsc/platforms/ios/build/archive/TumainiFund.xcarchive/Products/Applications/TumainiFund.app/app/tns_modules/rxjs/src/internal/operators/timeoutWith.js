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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dFdpdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aW1lb3V0V2l0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFFM0MseUNBQXdDO0FBQ3hDLHNEQUFxRDtBQUNyRCwrREFBOEQ7QUFLOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaURHO0FBQ0gsU0FBZ0IsV0FBVyxDQUFPLEdBQWtCLEVBQ2xCLGNBQWtDLEVBQ2xDLFNBQWdDO0lBQWhDLDBCQUFBLEVBQUEsWUFBMkIsYUFBSztJQUNoRSxPQUFPLFVBQUMsTUFBcUI7UUFDM0IsSUFBSSxlQUFlLEdBQUcsZUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBUyxHQUFHLENBQUMsQ0FBQztRQUNqRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQztBQUNKLENBQUM7QUFSRCxrQ0FRQztBQUVEO0lBQ0UsNkJBQW9CLE9BQWUsRUFDZixlQUF3QixFQUN4QixjQUFvQyxFQUNwQyxTQUF3QjtRQUh4QixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2Ysb0JBQWUsR0FBZixlQUFlLENBQVM7UUFDeEIsbUJBQWMsR0FBZCxjQUFjLENBQXNCO1FBQ3BDLGNBQVMsR0FBVCxTQUFTLENBQWU7SUFDNUMsQ0FBQztJQUVELGtDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUkscUJBQXFCLENBQy9DLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUNwRixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBWkQsSUFZQztBQUVEOzs7O0dBSUc7QUFDSDtJQUEwQyx5Q0FBcUI7SUFJN0QsK0JBQVksV0FBMEIsRUFDbEIsZUFBd0IsRUFDeEIsT0FBZSxFQUNmLGNBQW9DLEVBQ3BDLFNBQXdCO1FBSjVDLFlBS0Usa0JBQU0sV0FBVyxDQUFDLFNBRW5CO1FBTm1CLHFCQUFlLEdBQWYsZUFBZSxDQUFTO1FBQ3hCLGFBQU8sR0FBUCxPQUFPLENBQVE7UUFDZixvQkFBYyxHQUFkLGNBQWMsQ0FBc0I7UUFDcEMsZUFBUyxHQUFULFNBQVMsQ0FBZTtRQU5wQyxZQUFNLEdBQWlELElBQUksQ0FBQztRQVFsRSxLQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7O0lBQ3pCLENBQUM7SUFFYyxxQ0FBZSxHQUE5QixVQUFxQyxVQUF1QztRQUNsRSxJQUFBLDBDQUFjLENBQWdCO1FBQy9CLFVBQVcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzVDLFVBQVUsQ0FBQyxHQUFHLENBQUMscUNBQWlCLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVPLCtDQUFlLEdBQXZCO1FBQ1UsSUFBQSxvQkFBTSxDQUFVO1FBQ3hCLElBQUksTUFBTSxFQUFFO1lBQ1Ysd0VBQXdFO1lBQ3hFLDBFQUEwRTtZQUMxRSwyRUFBMkU7WUFDM0UsOEVBQThFO1lBQzlFLG9EQUFvRDtZQUNwRCxJQUFJLENBQUMsTUFBTSxHQUFtRCxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFFLENBQUM7U0FDcEc7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBbUQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQzVGLHFCQUFxQixDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FDekQsQ0FBQyxDQUFDO1NBQ0w7SUFDSCxDQUFDO0lBRVMscUNBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtRQUNELGlCQUFNLEtBQUssWUFBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLDRDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUN0QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQztJQUM3QixDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBaERELENBQTBDLGlDQUFlLEdBZ0R4RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgaXNEYXRlIH0gZnJvbSAnLi4vdXRpbC9pc0RhdGUnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24sIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0V2l0aDxULCBSPihkdWU6IG51bWJlciB8IERhdGUsIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICpcbiAqIEVycm9ycyBpZiBPYnNlcnZhYmxlIGRvZXMgbm90IGVtaXQgYSB2YWx1ZSBpbiBnaXZlbiB0aW1lIHNwYW4sIGluIGNhc2Ugb2Ygd2hpY2hcbiAqIHN1YnNjcmliZXMgdG8gdGhlIHNlY29uZCBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGEgdmVyc2lvbiBvZiBgdGltZW91dGAgb3BlcmF0b3IgdGhhdCBsZXQncyB5b3Ugc3BlY2lmeSBmYWxsYmFjayBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10odGltZW91dFdpdGgucG5nKVxuICpcbiAqIGB0aW1lb3V0V2l0aGAgaXMgYSB2YXJpYXRpb24gb2YgYHRpbWVvdXRgIG9wZXJhdG9yLiBJdCBiZWhhdmVzIGV4YWN0bHkgdGhlIHNhbWUsXG4gKiBzdGlsbCBhY2NlcHRpbmcgYXMgYSBmaXJzdCBhcmd1bWVudCBlaXRoZXIgYSBudW1iZXIgb3IgYSBEYXRlLCB3aGljaCBjb250cm9sIC0gcmVzcGVjdGl2ZWx5IC1cbiAqIHdoZW4gdmFsdWVzIG9mIHNvdXJjZSBPYnNlcnZhYmxlIHNob3VsZCBiZSBlbWl0dGVkIG9yIHdoZW4gaXQgc2hvdWxkIGNvbXBsZXRlLlxuICpcbiAqIFRoZSBvbmx5IGRpZmZlcmVuY2UgaXMgdGhhdCBpdCBhY2NlcHRzIGEgc2Vjb25kLCByZXF1aXJlZCBwYXJhbWV0ZXIuIFRoaXMgcGFyYW1ldGVyXG4gKiBzaG91bGQgYmUgYW4gT2JzZXJ2YWJsZSB3aGljaCB3aWxsIGJlIHN1YnNjcmliZWQgd2hlbiBzb3VyY2UgT2JzZXJ2YWJsZSBmYWlscyBhbnkgdGltZW91dCBjaGVjay5cbiAqIFNvIHdoZW5ldmVyIHJlZ3VsYXIgYHRpbWVvdXRgIHdvdWxkIGVtaXQgYW4gZXJyb3IsIGB0aW1lb3V0V2l0aGAgd2lsbCBpbnN0ZWFkIHN0YXJ0IHJlLWVtaXR0aW5nXG4gKiB2YWx1ZXMgZnJvbSBzZWNvbmQgT2JzZXJ2YWJsZS4gTm90ZSB0aGF0IHRoaXMgZmFsbGJhY2sgT2JzZXJ2YWJsZSBpcyBub3QgY2hlY2tlZCBmb3IgdGltZW91dHNcbiAqIGl0c2VsZiwgc28gaXQgY2FuIGVtaXQgdmFsdWVzIGFuZCBjb21wbGV0ZSBhdCBhcmJpdHJhcnkgcG9pbnRzIGluIHRpbWUuIEZyb20gdGhlIG1vbWVudCBvZiBhIHNlY29uZFxuICogc3Vic2NyaXB0aW9uLCBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gYHRpbWVvdXRXaXRoYCBzaW1wbHkgbWlycm9ycyBmYWxsYmFjayBzdHJlYW0uIFdoZW4gdGhhdFxuICogc3RyZWFtIGNvbXBsZXRlcywgaXQgY29tcGxldGVzIGFzIHdlbGwuXG4gKlxuICogU2NoZWR1bGVyLCB3aGljaCBpbiBjYXNlIG9mIGB0aW1lb3V0YCBpcyBwcm92aWRlZCBhcyBhcyBzZWNvbmQgYXJndW1lbnQsIGNhbiBiZSBzdGlsbCBwcm92aWRlZFxuICogaGVyZSAtIGFzIGEgdGhpcmQsIG9wdGlvbmFsIHBhcmFtZXRlci4gSXQgc3RpbGwgaXMgdXNlZCB0byBzY2hlZHVsZSB0aW1lb3V0IGNoZWNrcyBhbmQgLVxuICogYXMgYSBjb25zZXF1ZW5jZSAtIHdoZW4gc2Vjb25kIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLCBzaW5jZSBzdWJzY3JpcHRpb24gaGFwcGVuc1xuICogaW1tZWRpYXRlbHkgYWZ0ZXIgZmFpbGluZyBjaGVjay5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBBZGQgZmFsbGJhY2sgb2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgc2Vjb25kcyA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgbWludXRlcyA9IGludGVydmFsKDYwICogMTAwMCk7XG4gKlxuICogc2Vjb25kcy5waXBlKHRpbWVvdXRXaXRoKDkwMCwgbWludXRlcykpXG4gKiAgIC5zdWJzY3JpYmUoXG4gKiAgICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLCAvLyBBZnRlciA5MDBtcywgd2lsbCBzdGFydCBlbWl0dGluZyBgbWludXRlc2AsXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBzaW5jZSBmaXJzdCB2YWx1ZSBvZiBgc2Vjb25kc2Agd2lsbCBub3QgYXJyaXZlIGZhc3QgZW5vdWdoLlxuICogICAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpLCAgICAgLy8gV291bGQgYmUgY2FsbGVkIGFmdGVyIDkwMG1zIGluIGNhc2Ugb2YgYHRpbWVvdXRgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gYnV0IGhlcmUgd2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiAgICk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge251bWJlcnxEYXRlfSBkdWUgTnVtYmVyIHNwZWNpZnlpbmcgcGVyaW9kIHdpdGhpbiB3aGljaCBPYnNlcnZhYmxlIG11c3QgZW1pdCB2YWx1ZXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICBvciBEYXRlIHNwZWNpZnlpbmcgYmVmb3JlIHdoZW4gT2JzZXJ2YWJsZSBzaG91bGQgY29tcGxldGVcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZTxUPn0gd2l0aE9ic2VydmFibGUgT2JzZXJ2YWJsZSB3aGljaCB3aWxsIGJlIHN1YnNjcmliZWQgaWYgc291cmNlIGZhaWxzIHRpbWVvdXQgY2hlY2suXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciBjb250cm9sbGluZyB3aGVuIHRpbWVvdXQgY2hlY2tzIG9jY3VyLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgYmVoYXZpb3VyIG9mIHNvdXJjZSBvciwgd2hlbiB0aW1lb3V0IGNoZWNrIGZhaWxzLCBvZiBhbiBPYnNlcnZhYmxlXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgcGFzc2VkIGFzIGEgc2Vjb25kIHBhcmFtZXRlci5cbiAqIEBtZXRob2QgdGltZW91dFdpdGhcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lb3V0V2l0aDxULCBSPihkdWU6IG51bWJlciB8IERhdGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc3luYyk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IFI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBsZXQgYWJzb2x1dGVUaW1lb3V0ID0gaXNEYXRlKGR1ZSk7XG4gICAgbGV0IHdhaXRGb3IgPSBhYnNvbHV0ZVRpbWVvdXQgPyAoK2R1ZSAtIHNjaGVkdWxlci5ub3coKSkgOiBNYXRoLmFicyg8bnVtYmVyPmR1ZSk7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBUaW1lb3V0V2l0aE9wZXJhdG9yKHdhaXRGb3IsIGFic29sdXRlVGltZW91dCwgd2l0aE9ic2VydmFibGUsIHNjaGVkdWxlcikpO1xuICB9O1xufVxuXG5jbGFzcyBUaW1lb3V0V2l0aE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdhaXRGb3I6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBhYnNvbHV0ZVRpbWVvdXQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBUaW1lb3V0V2l0aFN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLmFic29sdXRlVGltZW91dCwgdGhpcy53YWl0Rm9yLCB0aGlzLndpdGhPYnNlcnZhYmxlLCB0aGlzLnNjaGVkdWxlclxuICAgICkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuXG4gIHByaXZhdGUgYWN0aW9uOiBTY2hlZHVsZXJBY3Rpb248VGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+PiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgYWJzb2x1dGVUaW1lb3V0OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHdhaXRGb3I6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB3aXRoT2JzZXJ2YWJsZTogT2JzZXJ2YWJsZUlucHV0PGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMuc2NoZWR1bGVUaW1lb3V0KCk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBkaXNwYXRjaFRpbWVvdXQ8VCwgUj4oc3Vic2NyaWJlcjogVGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgY29uc3QgeyB3aXRoT2JzZXJ2YWJsZSB9ID0gc3Vic2NyaWJlcjtcbiAgICAoPGFueT4gc3Vic2NyaWJlcikuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgIHN1YnNjcmliZXIuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHN1YnNjcmliZXIsIHdpdGhPYnNlcnZhYmxlKSk7XG4gIH1cblxuICBwcml2YXRlIHNjaGVkdWxlVGltZW91dCgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGFjdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoYWN0aW9uKSB7XG4gICAgICAvLyBSZWN5Y2xlIHRoZSBhY3Rpb24gaWYgd2UndmUgYWxyZWFkeSBzY2hlZHVsZWQgb25lLiBBbGwgdGhlIHByb2R1Y3Rpb25cbiAgICAgIC8vIFNjaGVkdWxlciBBY3Rpb25zIG11dGF0ZSB0aGVpciBzdGF0ZS9kZWxheSB0aW1lIGFuZCByZXR1cm4gdGhlbWVzZWx2ZXMuXG4gICAgICAvLyBWaXJ0dWFsQWN0aW9ucyBhcmUgaW1tdXRhYmxlLCBzbyB0aGV5IGNyZWF0ZSBhbmQgcmV0dXJuIGEgY2xvbmUuIEluIHRoaXNcbiAgICAgIC8vIGNhc2UsIHdlIG5lZWQgdG8gc2V0IHRoZSBhY3Rpb24gcmVmZXJlbmNlIHRvIHRoZSBtb3N0IHJlY2VudCBWaXJ0dWFsQWN0aW9uLFxuICAgICAgLy8gdG8gZW5zdXJlIHRoYXQncyB0aGUgb25lIHdlIGNsb25lIGZyb20gbmV4dCB0aW1lLlxuICAgICAgdGhpcy5hY3Rpb24gPSAoPFNjaGVkdWxlckFjdGlvbjxUaW1lb3V0V2l0aFN1YnNjcmliZXI8VCwgUj4+PiBhY3Rpb24uc2NoZWR1bGUodGhpcywgdGhpcy53YWl0Rm9yKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYWRkKHRoaXMuYWN0aW9uID0gKDxTY2hlZHVsZXJBY3Rpb248VGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+Pj4gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGU8VGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+PihcbiAgICAgICAgVGltZW91dFdpdGhTdWJzY3JpYmVyLmRpc3BhdGNoVGltZW91dCwgdGhpcy53YWl0Rm9yLCB0aGlzXG4gICAgICApKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmFic29sdXRlVGltZW91dCkge1xuICAgICAgdGhpcy5zY2hlZHVsZVRpbWVvdXQoKTtcbiAgICB9XG4gICAgc3VwZXIuX25leHQodmFsdWUpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5hY3Rpb24gPSBudWxsO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbnVsbDtcbiAgICB0aGlzLndpdGhPYnNlcnZhYmxlID0gbnVsbDtcbiAgfVxufVxuIl19