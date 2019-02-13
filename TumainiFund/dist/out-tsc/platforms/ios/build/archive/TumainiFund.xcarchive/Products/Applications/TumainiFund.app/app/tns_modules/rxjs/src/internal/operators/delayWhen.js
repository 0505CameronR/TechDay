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
var Observable_1 = require("../Observable");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:disable:max-line-length */
/**
 * Delays the emission of items from the source Observable by a given time span
 * determined by the emissions of another Observable.
 *
 * <span class="informal">It's like {@link delay}, but the time span of the
 * delay duration is determined by a second Observable.</span>
 *
 * ![](delayWhen.png)
 *
 * `delayWhen` time shifts each emitted value from the source Observable by a
 * time span determined by another Observable. When the source emits a value,
 * the `delayDurationSelector` function is called with the source value as
 * argument, and should return an Observable, called the "duration" Observable.
 * The source value is emitted on the output Observable only when the duration
 * Observable emits a value or completes.
 * The completion of the notifier triggering the emission of the source value
 * is deprecated behavior and will be removed in future versions.
 *
 * Optionally, `delayWhen` takes a second argument, `subscriptionDelay`, which
 * is an Observable. When `subscriptionDelay` emits its first value or
 * completes, the source Observable is subscribed to and starts behaving like
 * described in the previous paragraph. If `subscriptionDelay` is not provided,
 * `delayWhen` will subscribe to the source Observable as soon as the output
 * Observable is subscribed.
 *
 * ## Example
 * Delay each click by a random amount of time, between 0 and 5 seconds
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const delayedClicks = clicks.pipe(
 *   delayWhen(event => interval(Math.random() * 5000)),
 * );
 * delayedClicks.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link debounce}
 * @see {@link delay}
 *
 * @param {function(value: T, index: number): Observable} delayDurationSelector A function that
 * returns an Observable for each value emitted by the source Observable, which
 * is then used to delay the emission of that item on the output Observable
 * until the Observable returned from this function emits a value.
 * @param {Observable} subscriptionDelay An Observable that triggers the
 * subscription to the source Observable once it emits any value.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by an amount of time specified by the Observable returned by
 * `delayDurationSelector`.
 * @method delayWhen
 * @owner Observable
 */
function delayWhen(delayDurationSelector, subscriptionDelay) {
    if (subscriptionDelay) {
        return function (source) {
            return new SubscriptionDelayObservable(source, subscriptionDelay)
                .lift(new DelayWhenOperator(delayDurationSelector));
        };
    }
    return function (source) { return source.lift(new DelayWhenOperator(delayDurationSelector)); };
}
exports.delayWhen = delayWhen;
var DelayWhenOperator = /** @class */ (function () {
    function DelayWhenOperator(delayDurationSelector) {
        this.delayDurationSelector = delayDurationSelector;
    }
    DelayWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DelayWhenSubscriber(subscriber, this.delayDurationSelector));
    };
    return DelayWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DelayWhenSubscriber = /** @class */ (function (_super) {
    __extends(DelayWhenSubscriber, _super);
    function DelayWhenSubscriber(destination, delayDurationSelector) {
        var _this = _super.call(this, destination) || this;
        _this.delayDurationSelector = delayDurationSelector;
        _this.completed = false;
        _this.delayNotifierSubscriptions = [];
        _this.index = 0;
        return _this;
    }
    DelayWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(outerValue);
        this.removeSubscription(innerSub);
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DelayWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        var value = this.removeSubscription(innerSub);
        if (value) {
            this.destination.next(value);
        }
        this.tryComplete();
    };
    DelayWhenSubscriber.prototype._next = function (value) {
        var index = this.index++;
        try {
            var delayNotifier = this.delayDurationSelector(value, index);
            if (delayNotifier) {
                this.tryDelay(delayNotifier, value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    DelayWhenSubscriber.prototype._complete = function () {
        this.completed = true;
        this.tryComplete();
        this.unsubscribe();
    };
    DelayWhenSubscriber.prototype.removeSubscription = function (subscription) {
        subscription.unsubscribe();
        var subscriptionIdx = this.delayNotifierSubscriptions.indexOf(subscription);
        if (subscriptionIdx !== -1) {
            this.delayNotifierSubscriptions.splice(subscriptionIdx, 1);
        }
        return subscription.outerValue;
    };
    DelayWhenSubscriber.prototype.tryDelay = function (delayNotifier, value) {
        var notifierSubscription = subscribeToResult_1.subscribeToResult(this, delayNotifier, value);
        if (notifierSubscription && !notifierSubscription.closed) {
            var destination = this.destination;
            destination.add(notifierSubscription);
            this.delayNotifierSubscriptions.push(notifierSubscription);
        }
    };
    DelayWhenSubscriber.prototype.tryComplete = function () {
        if (this.completed && this.delayNotifierSubscriptions.length === 0) {
            this.destination.complete();
        }
    };
    return DelayWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelayObservable = /** @class */ (function (_super) {
    __extends(SubscriptionDelayObservable, _super);
    function SubscriptionDelayObservable(source, subscriptionDelay) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subscriptionDelay = subscriptionDelay;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    SubscriptionDelayObservable.prototype._subscribe = function (subscriber) {
        this.subscriptionDelay.subscribe(new SubscriptionDelaySubscriber(subscriber, this.source));
    };
    return SubscriptionDelayObservable;
}(Observable_1.Observable));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SubscriptionDelaySubscriber = /** @class */ (function (_super) {
    __extends(SubscriptionDelaySubscriber, _super);
    function SubscriptionDelaySubscriber(parent, source) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.source = source;
        _this.sourceSubscribed = false;
        return _this;
    }
    SubscriptionDelaySubscriber.prototype._next = function (unused) {
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype._error = function (err) {
        this.unsubscribe();
        this.parent.error(err);
    };
    SubscriptionDelaySubscriber.prototype._complete = function () {
        this.unsubscribe();
        this.subscribeToSource();
    };
    SubscriptionDelaySubscriber.prototype.subscribeToSource = function () {
        if (!this.sourceSubscribed) {
            this.sourceSubscribed = true;
            this.unsubscribe();
            this.source.subscribe(this.parent);
        }
    };
    return SubscriptionDelaySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVsYXlXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUMzQyw0Q0FBMkM7QUFFM0Msc0RBQXFEO0FBRXJELCtEQUE4RDtBQU85RCxvQ0FBb0M7QUFFcEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFDSCxTQUFnQixTQUFTLENBQUkscUJBQW1FLEVBQ25FLGlCQUFtQztJQUM5RCxJQUFJLGlCQUFpQixFQUFFO1FBQ3JCLE9BQU8sVUFBQyxNQUFxQjtZQUMzQixPQUFBLElBQUksMkJBQTJCLENBQUMsTUFBTSxFQUFFLGlCQUFpQixDQUFDO2lCQUN2RCxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBRHJELENBQ3FELENBQUM7S0FDekQ7SUFDRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEVBQXpELENBQXlELENBQUM7QUFDOUYsQ0FBQztBQVJELDhCQVFDO0FBRUQ7SUFDRSwyQkFBb0IscUJBQW1FO1FBQW5FLDBCQUFxQixHQUFyQixxQkFBcUIsQ0FBOEM7SUFDdkYsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksbUJBQW1C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QU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVTLCtDQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTyx1REFBaUIsR0FBekI7UUFDRSxJQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQzFCLElBQUksQ0FBQyxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNwQztJQUNILENBQUM7SUFDSCxrQ0FBQztBQUFELENBQUMsQUE1QkQsQ0FBNkMsdUJBQVUsR0E0QnREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCBJbiBmdXR1cmUgdmVyc2lvbnMsIGVtcHR5IG5vdGlmaWVycyB3aWxsIG5vIGxvbmdlciByZS1lbWl0IHRoZSBzb3VyY2UgdmFsdWUgb24gdGhlIG91dHB1dCBvYnNlcnZhYmxlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5V2hlbjxUPihkZWxheUR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZTxuZXZlcj4sIHN1YnNjcmlwdGlvbkRlbGF5PzogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5V2hlbjxUPihkZWxheUR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZTxhbnk+LCBzdWJzY3JpcHRpb25EZWxheT86IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIERlbGF5cyB0aGUgZW1pc3Npb24gb2YgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgYnkgYSBnaXZlbiB0aW1lIHNwYW5cbiAqIGRldGVybWluZWQgYnkgdGhlIGVtaXNzaW9ucyBvZiBhbm90aGVyIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgZGVsYXl9LCBidXQgdGhlIHRpbWUgc3BhbiBvZiB0aGVcbiAqIGRlbGF5IGR1cmF0aW9uIGlzIGRldGVybWluZWQgYnkgYSBzZWNvbmQgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKGRlbGF5V2hlbi5wbmcpXG4gKlxuICogYGRlbGF5V2hlbmAgdGltZSBzaGlmdHMgZWFjaCBlbWl0dGVkIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGFcbiAqIHRpbWUgc3BhbiBkZXRlcm1pbmVkIGJ5IGFub3RoZXIgT2JzZXJ2YWJsZS4gV2hlbiB0aGUgc291cmNlIGVtaXRzIGEgdmFsdWUsXG4gKiB0aGUgYGRlbGF5RHVyYXRpb25TZWxlY3RvcmAgZnVuY3Rpb24gaXMgY2FsbGVkIHdpdGggdGhlIHNvdXJjZSB2YWx1ZSBhc1xuICogYXJndW1lbnQsIGFuZCBzaG91bGQgcmV0dXJuIGFuIE9ic2VydmFibGUsIGNhbGxlZCB0aGUgXCJkdXJhdGlvblwiIE9ic2VydmFibGUuXG4gKiBUaGUgc291cmNlIHZhbHVlIGlzIGVtaXR0ZWQgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlIG9ubHkgd2hlbiB0aGUgZHVyYXRpb25cbiAqIE9ic2VydmFibGUgZW1pdHMgYSB2YWx1ZSBvciBjb21wbGV0ZXMuXG4gKiBUaGUgY29tcGxldGlvbiBvZiB0aGUgbm90aWZpZXIgdHJpZ2dlcmluZyB0aGUgZW1pc3Npb24gb2YgdGhlIHNvdXJjZSB2YWx1ZVxuICogaXMgZGVwcmVjYXRlZCBiZWhhdmlvciBhbmQgd2lsbCBiZSByZW1vdmVkIGluIGZ1dHVyZSB2ZXJzaW9ucy5cbiAqXG4gKiBPcHRpb25hbGx5LCBgZGVsYXlXaGVuYCB0YWtlcyBhIHNlY29uZCBhcmd1bWVudCwgYHN1YnNjcmlwdGlvbkRlbGF5YCwgd2hpY2hcbiAqIGlzIGFuIE9ic2VydmFibGUuIFdoZW4gYHN1YnNjcmlwdGlvbkRlbGF5YCBlbWl0cyBpdHMgZmlyc3QgdmFsdWUgb3JcbiAqIGNvbXBsZXRlcywgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQgdG8gYW5kIHN0YXJ0cyBiZWhhdmluZyBsaWtlXG4gKiBkZXNjcmliZWQgaW4gdGhlIHByZXZpb3VzIHBhcmFncmFwaC4gSWYgYHN1YnNjcmlwdGlvbkRlbGF5YCBpcyBub3QgcHJvdmlkZWQsXG4gKiBgZGVsYXlXaGVuYCB3aWxsIHN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUgYXMgc29vbiBhcyB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRGVsYXkgZWFjaCBjbGljayBieSBhIHJhbmRvbSBhbW91bnQgb2YgdGltZSwgYmV0d2VlbiAwIGFuZCA1IHNlY29uZHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBkZWxheWVkQ2xpY2tzID0gY2xpY2tzLnBpcGUoXG4gKiAgIGRlbGF5V2hlbihldmVudCA9PiBpbnRlcnZhbChNYXRoLnJhbmRvbSgpICogNTAwMCkpLFxuICogKTtcbiAqIGRlbGF5ZWRDbGlja3Muc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVib3VuY2V9XG4gKiBAc2VlIHtAbGluayBkZWxheX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogT2JzZXJ2YWJsZX0gZGVsYXlEdXJhdGlvblNlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdFxuICogcmV0dXJucyBhbiBPYnNlcnZhYmxlIGZvciBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB3aGljaFxuICogaXMgdGhlbiB1c2VkIHRvIGRlbGF5IHRoZSBlbWlzc2lvbiBvZiB0aGF0IGl0ZW0gb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlXG4gKiB1bnRpbCB0aGUgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tIHRoaXMgZnVuY3Rpb24gZW1pdHMgYSB2YWx1ZS5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gc3Vic2NyaXB0aW9uRGVsYXkgQW4gT2JzZXJ2YWJsZSB0aGF0IHRyaWdnZXJzIHRoZVxuICogc3Vic2NyaXB0aW9uIHRvIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBvbmNlIGl0IGVtaXRzIGFueSB2YWx1ZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBkZWxheXMgdGhlIGVtaXNzaW9ucyBvZiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGJ5IGFuIGFtb3VudCBvZiB0aW1lIHNwZWNpZmllZCBieSB0aGUgT2JzZXJ2YWJsZSByZXR1cm5lZCBieVxuICogYGRlbGF5RHVyYXRpb25TZWxlY3RvcmAuXG4gKiBAbWV0aG9kIGRlbGF5V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGF5V2hlbjxUPihkZWxheUR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWJzY3JpcHRpb25EZWxheT86IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGlmIChzdWJzY3JpcHRpb25EZWxheSkge1xuICAgIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PlxuICAgICAgbmV3IFN1YnNjcmlwdGlvbkRlbGF5T2JzZXJ2YWJsZShzb3VyY2UsIHN1YnNjcmlwdGlvbkRlbGF5KVxuICAgICAgICAubGlmdChuZXcgRGVsYXlXaGVuT3BlcmF0b3IoZGVsYXlEdXJhdGlvblNlbGVjdG9yKSk7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEZWxheVdoZW5PcGVyYXRvcihkZWxheUR1cmF0aW9uU2VsZWN0b3IpKTtcbn1cblxuY2xhc3MgRGVsYXlXaGVuT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZWxheVdoZW5TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZGVsYXlEdXJhdGlvblNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlbGF5V2hlblN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIGNvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGRlbGF5Tm90aWZpZXJTdWJzY3JpcHRpb25zOiBBcnJheTxTdWJzY3JpcHRpb24+ID0gW107XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQob3V0ZXJWYWx1ZSk7XG4gICAgdGhpcy5yZW1vdmVTdWJzY3JpcHRpb24oaW5uZXJTdWIpO1xuICAgIHRoaXMudHJ5Q29tcGxldGUoKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycm9yOiBhbnksIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcihlcnJvcik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0aGlzLnJlbW92ZVN1YnNjcmlwdGlvbihpbm5lclN1Yik7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLnRyeUNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgY29uc3QgZGVsYXlOb3RpZmllciA9IHRoaXMuZGVsYXlEdXJhdGlvblNlbGVjdG9yKHZhbHVlLCBpbmRleCk7XG4gICAgICBpZiAoZGVsYXlOb3RpZmllcikge1xuICAgICAgICB0aGlzLnRyeURlbGF5KGRlbGF5Tm90aWZpZXIsIHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY29tcGxldGVkID0gdHJ1ZTtcbiAgICB0aGlzLnRyeUNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSByZW1vdmVTdWJzY3JpcHRpb24oc3Vic2NyaXB0aW9uOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiBUIHtcbiAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcblxuICAgIGNvbnN0IHN1YnNjcmlwdGlvbklkeCA9IHRoaXMuZGVsYXlOb3RpZmllclN1YnNjcmlwdGlvbnMuaW5kZXhPZihzdWJzY3JpcHRpb24pO1xuICAgIGlmIChzdWJzY3JpcHRpb25JZHggIT09IC0xKSB7XG4gICAgICB0aGlzLmRlbGF5Tm90aWZpZXJTdWJzY3JpcHRpb25zLnNwbGljZShzdWJzY3JpcHRpb25JZHgsIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb24ub3V0ZXJWYWx1ZTtcbiAgfVxuXG4gIHByaXZhdGUgdHJ5RGVsYXkoZGVsYXlOb3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+LCB2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IG5vdGlmaWVyU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgZGVsYXlOb3RpZmllciwgdmFsdWUpO1xuXG4gICAgaWYgKG5vdGlmaWVyU3Vic2NyaXB0aW9uICYmICFub3RpZmllclN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgICBkZXN0aW5hdGlvbi5hZGQobm90aWZpZXJTdWJzY3JpcHRpb24pO1xuICAgICAgdGhpcy5kZWxheU5vdGlmaWVyU3Vic2NyaXB0aW9ucy5wdXNoKG5vdGlmaWVyU3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNvbXBsZXRlZCAmJiB0aGlzLmRlbGF5Tm90aWZpZXJTdWJzY3JpcHRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU3Vic2NyaXB0aW9uRGVsYXlPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6IE9ic2VydmFibGU8VD4sIHByaXZhdGUgc3Vic2NyaXB0aW9uRGVsYXk6IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9uRGVsYXkuc3Vic2NyaWJlKG5ldyBTdWJzY3JpcHRpb25EZWxheVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5zb3VyY2UpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU3Vic2NyaXB0aW9uRGVsYXlTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgc291cmNlU3Vic2NyaWJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBTdWJzY3JpYmVyPFQ+LCBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodW51c2VkOiBhbnkpIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvU291cmNlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KSB7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMucGFyZW50LmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnN1YnNjcmliZVRvU291cmNlKCk7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvU291cmNlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5zb3VyY2VTdWJzY3JpYmVkKSB7XG4gICAgICB0aGlzLnNvdXJjZVN1YnNjcmliZWQgPSB0cnVlO1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKHRoaXMucGFyZW50KTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==