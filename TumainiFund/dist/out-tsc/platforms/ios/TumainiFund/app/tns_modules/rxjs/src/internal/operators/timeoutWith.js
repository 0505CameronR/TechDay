import { async } from '../scheduler/async';
import { isDate } from '../util/isDate';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
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
 * import { intrerval } from 'rxjs';
 * import { timeoutWith } from 'rxjs/operators';
 *
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
export function timeoutWith(due, withObservable, scheduler = async) {
    return (source) => {
        let absoluteTimeout = isDate(due);
        let waitFor = absoluteTimeout ? (+due - scheduler.now()) : Math.abs(due);
        return source.lift(new TimeoutWithOperator(waitFor, absoluteTimeout, withObservable, scheduler));
    };
}
class TimeoutWithOperator {
    constructor(waitFor, absoluteTimeout, withObservable, scheduler) {
        this.waitFor = waitFor;
        this.absoluteTimeout = absoluteTimeout;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new TimeoutWithSubscriber(subscriber, this.absoluteTimeout, this.waitFor, this.withObservable, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TimeoutWithSubscriber extends OuterSubscriber {
    constructor(destination, absoluteTimeout, waitFor, withObservable, scheduler) {
        super(destination);
        this.absoluteTimeout = absoluteTimeout;
        this.waitFor = waitFor;
        this.withObservable = withObservable;
        this.scheduler = scheduler;
        this.action = null;
        this.scheduleTimeout();
    }
    static dispatchTimeout(subscriber) {
        const { withObservable } = subscriber;
        subscriber._unsubscribeAndRecycle();
        subscriber.add(subscribeToResult(subscriber, withObservable));
    }
    scheduleTimeout() {
        const { action } = this;
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
    }
    _next(value) {
        if (!this.absoluteTimeout) {
            this.scheduleTimeout();
        }
        super._next(value);
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        this.action = null;
        this.scheduler = null;
        this.withObservable = null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZW91dFdpdGguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZW91dFdpdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFLOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0RHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBTyxHQUFrQixFQUNsQixjQUFrQyxFQUNsQyxZQUEyQixLQUFLO0lBQ2hFLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUU7UUFDL0IsSUFBSSxlQUFlLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xDLElBQUksT0FBTyxHQUFHLGVBQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxTQUFTLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBUyxHQUFHLENBQUMsQ0FBQztRQUNqRixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsZUFBZSxFQUFFLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO0lBQ25HLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLG1CQUFtQjtJQUN2QixZQUFvQixPQUFlLEVBQ2YsZUFBd0IsRUFDeEIsY0FBb0MsRUFDcEMsU0FBd0I7UUFIeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG9CQUFlLEdBQWYsZUFBZSxDQUFTO1FBQ3hCLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFlO0lBQzVDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHFCQUFxQixDQUMvQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FDcEYsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0scUJBQTRCLFNBQVEsZUFBcUI7SUFJN0QsWUFBWSxXQUEwQixFQUNsQixlQUF3QixFQUN4QixPQUFlLEVBQ2YsY0FBb0MsRUFDcEMsU0FBd0I7UUFDMUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSkQsb0JBQWUsR0FBZixlQUFlLENBQVM7UUFDeEIsWUFBTyxHQUFQLE9BQU8sQ0FBUTtRQUNmLG1CQUFjLEdBQWQsY0FBYyxDQUFzQjtRQUNwQyxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBTnBDLFdBQU0sR0FBaUQsSUFBSSxDQUFDO1FBUWxFLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRU8sTUFBTSxDQUFDLGVBQWUsQ0FBTyxVQUF1QztRQUMxRSxNQUFNLEVBQUUsY0FBYyxFQUFFLEdBQUcsVUFBVSxDQUFDO1FBQy9CLFVBQVcsQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzVDLFVBQVUsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVPLGVBQWU7UUFDckIsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLE1BQU0sRUFBRTtZQUNWLHdFQUF3RTtZQUN4RSwwRUFBMEU7WUFDMUUsMkVBQTJFO1lBQzNFLDhFQUE4RTtZQUM5RSxvREFBb0Q7WUFDcEQsSUFBSSxDQUFDLE1BQU0sR0FBbUQsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBRSxDQUFDO1NBQ3BHO2FBQU07WUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQW1ELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUM1RixxQkFBcUIsQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQ3pELENBQUMsQ0FBQztTQUNMO0lBQ0gsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFO1lBQ3pCLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUN4QjtRQUNELEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUM7SUFDN0IsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0RhdGUgfSBmcm9tICcuLi91dGlsL2lzRGF0ZSc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRpbWVvdXRXaXRoPFQsIFI+KGR1ZTogbnVtYmVyIHwgRGF0ZSwgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxSPiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKlxuICogRXJyb3JzIGlmIE9ic2VydmFibGUgZG9lcyBub3QgZW1pdCBhIHZhbHVlIGluIGdpdmVuIHRpbWUgc3BhbiwgaW4gY2FzZSBvZiB3aGljaFxuICogc3Vic2NyaWJlcyB0byB0aGUgc2Vjb25kIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgYSB2ZXJzaW9uIG9mIGB0aW1lb3V0YCBvcGVyYXRvciB0aGF0IGxldCdzIHlvdSBzcGVjaWZ5IGZhbGxiYWNrIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXSh0aW1lb3V0V2l0aC5wbmcpXG4gKlxuICogYHRpbWVvdXRXaXRoYCBpcyBhIHZhcmlhdGlvbiBvZiBgdGltZW91dGAgb3BlcmF0b3IuIEl0IGJlaGF2ZXMgZXhhY3RseSB0aGUgc2FtZSxcbiAqIHN0aWxsIGFjY2VwdGluZyBhcyBhIGZpcnN0IGFyZ3VtZW50IGVpdGhlciBhIG51bWJlciBvciBhIERhdGUsIHdoaWNoIGNvbnRyb2wgLSByZXNwZWN0aXZlbHkgLVxuICogd2hlbiB2YWx1ZXMgb2Ygc291cmNlIE9ic2VydmFibGUgc2hvdWxkIGJlIGVtaXR0ZWQgb3Igd2hlbiBpdCBzaG91bGQgY29tcGxldGUuXG4gKlxuICogVGhlIG9ubHkgZGlmZmVyZW5jZSBpcyB0aGF0IGl0IGFjY2VwdHMgYSBzZWNvbmQsIHJlcXVpcmVkIHBhcmFtZXRlci4gVGhpcyBwYXJhbWV0ZXJcbiAqIHNob3VsZCBiZSBhbiBPYnNlcnZhYmxlIHdoaWNoIHdpbGwgYmUgc3Vic2NyaWJlZCB3aGVuIHNvdXJjZSBPYnNlcnZhYmxlIGZhaWxzIGFueSB0aW1lb3V0IGNoZWNrLlxuICogU28gd2hlbmV2ZXIgcmVndWxhciBgdGltZW91dGAgd291bGQgZW1pdCBhbiBlcnJvciwgYHRpbWVvdXRXaXRoYCB3aWxsIGluc3RlYWQgc3RhcnQgcmUtZW1pdHRpbmdcbiAqIHZhbHVlcyBmcm9tIHNlY29uZCBPYnNlcnZhYmxlLiBOb3RlIHRoYXQgdGhpcyBmYWxsYmFjayBPYnNlcnZhYmxlIGlzIG5vdCBjaGVja2VkIGZvciB0aW1lb3V0c1xuICogaXRzZWxmLCBzbyBpdCBjYW4gZW1pdCB2YWx1ZXMgYW5kIGNvbXBsZXRlIGF0IGFyYml0cmFyeSBwb2ludHMgaW4gdGltZS4gRnJvbSB0aGUgbW9tZW50IG9mIGEgc2Vjb25kXG4gKiBzdWJzY3JpcHRpb24sIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSBgdGltZW91dFdpdGhgIHNpbXBseSBtaXJyb3JzIGZhbGxiYWNrIHN0cmVhbS4gV2hlbiB0aGF0XG4gKiBzdHJlYW0gY29tcGxldGVzLCBpdCBjb21wbGV0ZXMgYXMgd2VsbC5cbiAqXG4gKiBTY2hlZHVsZXIsIHdoaWNoIGluIGNhc2Ugb2YgYHRpbWVvdXRgIGlzIHByb3ZpZGVkIGFzIGFzIHNlY29uZCBhcmd1bWVudCwgY2FuIGJlIHN0aWxsIHByb3ZpZGVkXG4gKiBoZXJlIC0gYXMgYSB0aGlyZCwgb3B0aW9uYWwgcGFyYW1ldGVyLiBJdCBzdGlsbCBpcyB1c2VkIHRvIHNjaGVkdWxlIHRpbWVvdXQgY2hlY2tzIGFuZCAtXG4gKiBhcyBhIGNvbnNlcXVlbmNlIC0gd2hlbiBzZWNvbmQgT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQsIHNpbmNlIHN1YnNjcmlwdGlvbiBoYXBwZW5zXG4gKiBpbW1lZGlhdGVseSBhZnRlciBmYWlsaW5nIGNoZWNrLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEFkZCBmYWxsYmFjayBvYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBpbnRyZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRpbWVvdXRXaXRoIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IHNlY29uZHMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IG1pbnV0ZXMgPSBpbnRlcnZhbCg2MCAqIDEwMDApO1xuICpcbiAqIHNlY29uZHMucGlwZSh0aW1lb3V0V2l0aCg5MDAsIG1pbnV0ZXMpKVxuICogICAuc3Vic2NyaWJlKFxuICogICAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSwgLy8gQWZ0ZXIgOTAwbXMsIHdpbGwgc3RhcnQgZW1pdHRpbmcgYG1pbnV0ZXNgLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gc2luY2UgZmlyc3QgdmFsdWUgb2YgYHNlY29uZHNgIHdpbGwgbm90IGFycml2ZSBmYXN0IGVub3VnaC5cbiAqICAgICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgIC8vIFdvdWxkIGJlIGNhbGxlZCBhZnRlciA5MDBtcyBpbiBjYXNlIG9mIGB0aW1lb3V0YCxcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJ1dCBoZXJlIHdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICApO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtudW1iZXJ8RGF0ZX0gZHVlIE51bWJlciBzcGVjaWZ5aW5nIHBlcmlvZCB3aXRoaW4gd2hpY2ggT2JzZXJ2YWJsZSBtdXN0IGVtaXQgdmFsdWVzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgb3IgRGF0ZSBzcGVjaWZ5aW5nIGJlZm9yZSB3aGVuIE9ic2VydmFibGUgc2hvdWxkIGNvbXBsZXRlXG4gKiBAcGFyYW0ge09ic2VydmFibGU8VD59IHdpdGhPYnNlcnZhYmxlIE9ic2VydmFibGUgd2hpY2ggd2lsbCBiZSBzdWJzY3JpYmVkIGlmIHNvdXJjZSBmYWlscyB0aW1lb3V0IGNoZWNrLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgY29udHJvbGxpbmcgd2hlbiB0aW1lb3V0IGNoZWNrcyBvY2N1ci5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIGJlaGF2aW91ciBvZiBzb3VyY2Ugb3IsIHdoZW4gdGltZW91dCBjaGVjayBmYWlscywgb2YgYW4gT2JzZXJ2YWJsZVxuICogICAgICAgICAgICAgICAgICAgICAgICAgIHBhc3NlZCBhcyBhIHNlY29uZCBwYXJhbWV0ZXIuXG4gKiBAbWV0aG9kIHRpbWVvdXRXaXRoXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZW91dFdpdGg8VCwgUj4oZHVlOiBudW1iZXIgfCBEYXRlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgbGV0IGFic29sdXRlVGltZW91dCA9IGlzRGF0ZShkdWUpO1xuICAgIGxldCB3YWl0Rm9yID0gYWJzb2x1dGVUaW1lb3V0ID8gKCtkdWUgLSBzY2hlZHVsZXIubm93KCkpIDogTWF0aC5hYnMoPG51bWJlcj5kdWUpO1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgVGltZW91dFdpdGhPcGVyYXRvcih3YWl0Rm9yLCBhYnNvbHV0ZVRpbWVvdXQsIHdpdGhPYnNlcnZhYmxlLCBzY2hlZHVsZXIpKTtcbiAgfTtcbn1cblxuY2xhc3MgVGltZW91dFdpdGhPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3YWl0Rm9yOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgYWJzb2x1dGVUaW1lb3V0OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHdpdGhPYnNlcnZhYmxlOiBPYnNlcnZhYmxlSW5wdXQ8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGltZW91dFdpdGhTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5hYnNvbHV0ZVRpbWVvdXQsIHRoaXMud2FpdEZvciwgdGhpcy53aXRoT2JzZXJ2YWJsZSwgdGhpcy5zY2hlZHVsZXJcbiAgICApKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIGFjdGlvbjogU2NoZWR1bGVyQWN0aW9uPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4gPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGFic29sdXRlVGltZW91dDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB3YWl0Rm9yOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgd2l0aE9ic2VydmFibGU6IE9ic2VydmFibGVJbnB1dDxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLnNjaGVkdWxlVGltZW91dCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZGlzcGF0Y2hUaW1lb3V0PFQsIFI+KHN1YnNjcmliZXI6IFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHsgd2l0aE9ic2VydmFibGUgfSA9IHN1YnNjcmliZXI7XG4gICAgKDxhbnk+IHN1YnNjcmliZXIpLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTtcbiAgICBzdWJzY3JpYmVyLmFkZChzdWJzY3JpYmVUb1Jlc3VsdChzdWJzY3JpYmVyLCB3aXRoT2JzZXJ2YWJsZSkpO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZVRpbWVvdXQoKTogdm9pZCB7XG4gICAgY29uc3QgeyBhY3Rpb24gfSA9IHRoaXM7XG4gICAgaWYgKGFjdGlvbikge1xuICAgICAgLy8gUmVjeWNsZSB0aGUgYWN0aW9uIGlmIHdlJ3ZlIGFscmVhZHkgc2NoZWR1bGVkIG9uZS4gQWxsIHRoZSBwcm9kdWN0aW9uXG4gICAgICAvLyBTY2hlZHVsZXIgQWN0aW9ucyBtdXRhdGUgdGhlaXIgc3RhdGUvZGVsYXkgdGltZSBhbmQgcmV0dXJuIHRoZW1lc2VsdmVzLlxuICAgICAgLy8gVmlydHVhbEFjdGlvbnMgYXJlIGltbXV0YWJsZSwgc28gdGhleSBjcmVhdGUgYW5kIHJldHVybiBhIGNsb25lLiBJbiB0aGlzXG4gICAgICAvLyBjYXNlLCB3ZSBuZWVkIHRvIHNldCB0aGUgYWN0aW9uIHJlZmVyZW5jZSB0byB0aGUgbW9zdCByZWNlbnQgVmlydHVhbEFjdGlvbixcbiAgICAgIC8vIHRvIGVuc3VyZSB0aGF0J3MgdGhlIG9uZSB3ZSBjbG9uZSBmcm9tIG5leHQgdGltZS5cbiAgICAgIHRoaXMuYWN0aW9uID0gKDxTY2hlZHVsZXJBY3Rpb248VGltZW91dFdpdGhTdWJzY3JpYmVyPFQsIFI+Pj4gYWN0aW9uLnNjaGVkdWxlKHRoaXMsIHRoaXMud2FpdEZvcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFkZCh0aGlzLmFjdGlvbiA9ICg8U2NoZWR1bGVyQWN0aW9uPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4+IHRoaXMuc2NoZWR1bGVyLnNjaGVkdWxlPFRpbWVvdXRXaXRoU3Vic2NyaWJlcjxULCBSPj4oXG4gICAgICAgIFRpbWVvdXRXaXRoU3Vic2NyaWJlci5kaXNwYXRjaFRpbWVvdXQsIHRoaXMud2FpdEZvciwgdGhpc1xuICAgICAgKSkpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5hYnNvbHV0ZVRpbWVvdXQpIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVUaW1lb3V0KCk7XG4gICAgfVxuICAgIHN1cGVyLl9uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuYWN0aW9uID0gbnVsbDtcbiAgICB0aGlzLnNjaGVkdWxlciA9IG51bGw7XG4gICAgdGhpcy53aXRoT2JzZXJ2YWJsZSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==