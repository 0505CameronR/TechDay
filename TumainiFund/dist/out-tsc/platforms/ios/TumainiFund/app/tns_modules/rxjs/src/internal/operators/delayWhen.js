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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsYXlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2RlbGF5V2hlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFDM0MsNENBQTJDO0FBRTNDLHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFPOUQsb0NBQW9DO0FBRXBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaURHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFJLHFCQUFtRSxFQUNuRSxpQkFBbUM7SUFDOUQsSUFBSSxpQkFBaUIsRUFBRTtRQUNyQixPQUFPLFVBQUMsTUFBcUI7WUFDM0IsT0FBQSxJQUFJLDJCQUEyQixDQUFDLE1BQU0sRUFBRSxpQkFBaUIsQ0FBQztpQkFDdkQsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQztRQURyRCxDQUNxRCxDQUFDO0tBQ3pEO0lBQ0QsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxFQUF6RCxDQUF5RCxDQUFDO0FBQzlGLENBQUM7QUFSRCw4QkFRQztBQUVEO0lBQ0UsMkJBQW9CLHFCQUFtRTtRQUFuRSwwQkFBcUIsR0FBckIscUJBQXFCLENBQThDO0lBQ3ZGLENBQUM7SUFFRCxnQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLHVDQUFxQjtJQUszRCw2QkFBWSxXQUEwQixFQUNsQixxQkFBbUU7UUFEdkYsWUFFRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFGbUIsMkJBQXFCLEdBQXJCLHFCQUFxQixDQUE4QztRQUwvRSxlQUFTLEdBQVksS0FBSyxDQUFDO1FBQzNCLGdDQUEwQixHQUF3QixFQUFFLENBQUM7UUFDckQsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFLMUIsQ0FBQztJQUVELHdDQUFVLEdBQVYsVUFBVyxVQUFhLEVBQUUsVUFBZSxFQUM5QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNsQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELHlDQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBK0I7UUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsNENBQWMsR0FBZCxVQUFlLFFBQStCO1FBQzVDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNoRCxJQUFJLEtBQUssRUFBRTtZQUNULElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUyxtQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNCLElBQUk7WUFDRixJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBQy9ELElBQUksYUFBYSxFQUFFO2dCQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUNyQztTQUNGO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFUyx1Q0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVPLGdEQUFrQixHQUExQixVQUEyQixZQUFtQztRQUM1RCxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7UUFFM0IsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUM5RSxJQUFJLGVBQWUsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsMEJBQTBCLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM1RDtRQUVELE9BQU8sWUFBWSxDQUFDLFVBQVUsQ0FBQztJQUNqQyxDQUFDO0lBRU8sc0NBQVEsR0FBaEIsVUFBaUIsYUFBOEIsRUFBRSxLQUFRO1FBQ3ZELElBQU0sb0JBQW9CLEdBQUcscUNBQWlCLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUUzRSxJQUFJLG9CQUFvQixJQUFJLENBQUMsb0JBQW9CLENBQUMsTUFBTSxFQUFFO1lBQ3hELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUEyQixDQUFDO1lBQ3JELFdBQVcsQ0FBQyxHQUFHLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUN0QyxJQUFJLENBQUMsMEJBQTBCLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUM7U0FDNUQ7SUFDSCxDQUFDO0lBRU8seUNBQVcsR0FBbkI7UUFDRSxJQUFJLElBQUksQ0FBQyxTQUFTLElBQUksSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDbEUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUExRUQsQ0FBd0MsaUNBQWUsR0EwRXREO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTZDLCtDQUFhO0lBQ3hELHFDQUFtQixNQUFxQixFQUFVLGlCQUFrQztRQUFwRixZQUNFLGlCQUFPLFNBQ1I7UUFGa0IsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUFVLHVCQUFpQixHQUFqQixpQkFBaUIsQ0FBaUI7O0lBRXBGLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsZ0RBQVUsR0FBVixVQUFXLFVBQXlCO1FBQ2xDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDN0YsQ0FBQztJQUNILGtDQUFDO0FBQUQsQ0FBQyxBQVRELENBQTZDLHVCQUFVLEdBU3REO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTZDLCtDQUFhO0lBR3hELHFDQUFvQixNQUFxQixFQUFVLE1BQXFCO1FBQXhFLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixZQUFNLEdBQU4sTUFBTSxDQUFlO1FBQVUsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUZoRSxzQkFBZ0IsR0FBWSxLQUFLLENBQUM7O0lBSTFDLENBQUM7SUFFUywyQ0FBSyxHQUFmLFVBQWdCLE1BQVc7UUFDekIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVTLDRDQUFNLEdBQWhCLFVBQWlCLEdBQVE7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ25CLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFUywrQ0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNuQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRU8sdURBQWlCLEdBQXpCO1FBQ0UsSUFBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUMxQixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1lBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNuQixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDcEM7SUFDSCxDQUFDO0lBQ0gsa0NBQUM7QUFBRCxDQUFDLEFBNUJELENBQTZDLHVCQUFVLEdBNEJ0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgSW4gZnV0dXJlIHZlcnNpb25zLCBlbXB0eSBub3RpZmllcnMgd2lsbCBubyBsb25nZXIgcmUtZW1pdCB0aGUgc291cmNlIHZhbHVlIG9uIHRoZSBvdXRwdXQgb2JzZXJ2YWJsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheVdoZW48VD4oZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGU8bmV2ZXI+LCBzdWJzY3JpcHRpb25EZWxheT86IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkZWxheVdoZW48VD4oZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGU8YW55Piwgc3Vic2NyaXB0aW9uRGVsYXk/OiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBEZWxheXMgdGhlIGVtaXNzaW9uIG9mIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGEgZ2l2ZW4gdGltZSBzcGFuXG4gKiBkZXRlcm1pbmVkIGJ5IHRoZSBlbWlzc2lvbnMgb2YgYW5vdGhlciBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIGRlbGF5fSwgYnV0IHRoZSB0aW1lIHNwYW4gb2YgdGhlXG4gKiBkZWxheSBkdXJhdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IGEgc2Vjb25kIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXShkZWxheVdoZW4ucG5nKVxuICpcbiAqIGBkZWxheVdoZW5gIHRpbWUgc2hpZnRzIGVhY2ggZW1pdHRlZCB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBieSBhXG4gKiB0aW1lIHNwYW4gZGV0ZXJtaW5lZCBieSBhbm90aGVyIE9ic2VydmFibGUuIFdoZW4gdGhlIHNvdXJjZSBlbWl0cyBhIHZhbHVlLFxuICogdGhlIGBkZWxheUR1cmF0aW9uU2VsZWN0b3JgIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIHRoZSBzb3VyY2UgdmFsdWUgYXNcbiAqIGFyZ3VtZW50LCBhbmQgc2hvdWxkIHJldHVybiBhbiBPYnNlcnZhYmxlLCBjYWxsZWQgdGhlIFwiZHVyYXRpb25cIiBPYnNlcnZhYmxlLlxuICogVGhlIHNvdXJjZSB2YWx1ZSBpcyBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBvbmx5IHdoZW4gdGhlIGR1cmF0aW9uXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUgb3IgY29tcGxldGVzLlxuICogVGhlIGNvbXBsZXRpb24gb2YgdGhlIG5vdGlmaWVyIHRyaWdnZXJpbmcgdGhlIGVtaXNzaW9uIG9mIHRoZSBzb3VyY2UgdmFsdWVcbiAqIGlzIGRlcHJlY2F0ZWQgYmVoYXZpb3IgYW5kIHdpbGwgYmUgcmVtb3ZlZCBpbiBmdXR1cmUgdmVyc2lvbnMuXG4gKlxuICogT3B0aW9uYWxseSwgYGRlbGF5V2hlbmAgdGFrZXMgYSBzZWNvbmQgYXJndW1lbnQsIGBzdWJzY3JpcHRpb25EZWxheWAsIHdoaWNoXG4gKiBpcyBhbiBPYnNlcnZhYmxlLiBXaGVuIGBzdWJzY3JpcHRpb25EZWxheWAgZW1pdHMgaXRzIGZpcnN0IHZhbHVlIG9yXG4gKiBjb21wbGV0ZXMsIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkIHRvIGFuZCBzdGFydHMgYmVoYXZpbmcgbGlrZVxuICogZGVzY3JpYmVkIGluIHRoZSBwcmV2aW91cyBwYXJhZ3JhcGguIElmIGBzdWJzY3JpcHRpb25EZWxheWAgaXMgbm90IHByb3ZpZGVkLFxuICogYGRlbGF5V2hlbmAgd2lsbCBzdWJzY3JpYmUgdG8gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFzIHNvb24gYXMgdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIERlbGF5IGVhY2ggY2xpY2sgYnkgYSByYW5kb20gYW1vdW50IG9mIHRpbWUsIGJldHdlZW4gMCBhbmQgNSBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgZGVsYXllZENsaWNrcyA9IGNsaWNrcy5waXBlKFxuICogICBkZWxheVdoZW4oZXZlbnQgPT4gaW50ZXJ2YWwoTWF0aC5yYW5kb20oKSAqIDUwMDApKSxcbiAqICk7XG4gKiBkZWxheWVkQ2xpY2tzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlfVxuICogQHNlZSB7QGxpbmsgZGVsYXl9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IE9ic2VydmFibGV9IGRlbGF5RHVyYXRpb25TZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXRcbiAqIHJldHVybnMgYW4gT2JzZXJ2YWJsZSBmb3IgZWFjaCB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgd2hpY2hcbiAqIGlzIHRoZW4gdXNlZCB0byBkZWxheSB0aGUgZW1pc3Npb24gb2YgdGhhdCBpdGVtIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZVxuICogdW50aWwgdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSB0aGlzIGZ1bmN0aW9uIGVtaXRzIGEgdmFsdWUuXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IHN1YnNjcmlwdGlvbkRlbGF5IEFuIE9ic2VydmFibGUgdGhhdCB0cmlnZ2VycyB0aGVcbiAqIHN1YnNjcmlwdGlvbiB0byB0aGUgc291cmNlIE9ic2VydmFibGUgb25jZSBpdCBlbWl0cyBhbnkgdmFsdWUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZGVsYXlzIHRoZSBlbWlzc2lvbnMgb2YgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBieSBhbiBhbW91bnQgb2YgdGltZSBzcGVjaWZpZWQgYnkgdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgYnlcbiAqIGBkZWxheUR1cmF0aW9uU2VsZWN0b3JgLlxuICogQG1ldGhvZCBkZWxheVdoZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWxheVdoZW48VD4oZGVsYXlEdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uRGVsYXk/OiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICBpZiAoc3Vic2NyaXB0aW9uRGVsYXkpIHtcbiAgICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICAgIG5ldyBTdWJzY3JpcHRpb25EZWxheU9ic2VydmFibGUoc291cmNlLCBzdWJzY3JpcHRpb25EZWxheSlcbiAgICAgICAgLmxpZnQobmV3IERlbGF5V2hlbk9wZXJhdG9yKGRlbGF5RHVyYXRpb25TZWxlY3RvcikpO1xuICB9XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGVsYXlXaGVuT3BlcmF0b3IoZGVsYXlEdXJhdGlvblNlbGVjdG9yKSk7XG59XG5cbmNsYXNzIERlbGF5V2hlbk9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGVsYXlXaGVuU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmRlbGF5RHVyYXRpb25TZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZWxheVdoZW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBjb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBkZWxheU5vdGlmaWVyU3Vic2NyaXB0aW9uczogQXJyYXk8U3Vic2NyaXB0aW9uPiA9IFtdO1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGRlbGF5RHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KG91dGVyVmFsdWUpO1xuICAgIHRoaXMucmVtb3ZlU3Vic2NyaXB0aW9uKGlubmVyU3ViKTtcbiAgICB0aGlzLnRyeUNvbXBsZXRlKCk7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdGhpcy5yZW1vdmVTdWJzY3JpcHRpb24oaW5uZXJTdWIpO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gICAgdGhpcy50cnlDb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4Kys7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGRlbGF5Tm90aWZpZXIgPSB0aGlzLmRlbGF5RHVyYXRpb25TZWxlY3Rvcih2YWx1ZSwgaW5kZXgpO1xuICAgICAgaWYgKGRlbGF5Tm90aWZpZXIpIHtcbiAgICAgICAgdGhpcy50cnlEZWxheShkZWxheU5vdGlmaWVyLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbXBsZXRlZCA9IHRydWU7XG4gICAgdGhpcy50cnlDb21wbGV0ZSgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgcmVtb3ZlU3Vic2NyaXB0aW9uKHN1YnNjcmlwdGlvbjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogVCB7XG4gICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG5cbiAgICBjb25zdCBzdWJzY3JpcHRpb25JZHggPSB0aGlzLmRlbGF5Tm90aWZpZXJTdWJzY3JpcHRpb25zLmluZGV4T2Yoc3Vic2NyaXB0aW9uKTtcbiAgICBpZiAoc3Vic2NyaXB0aW9uSWR4ICE9PSAtMSkge1xuICAgICAgdGhpcy5kZWxheU5vdGlmaWVyU3Vic2NyaXB0aW9ucy5zcGxpY2Uoc3Vic2NyaXB0aW9uSWR4LCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uLm91dGVyVmFsdWU7XG4gIH1cblxuICBwcml2YXRlIHRyeURlbGF5KGRlbGF5Tm90aWZpZXI6IE9ic2VydmFibGU8YW55PiwgdmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBub3RpZmllclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGRlbGF5Tm90aWZpZXIsIHZhbHVlKTtcblxuICAgIGlmIChub3RpZmllclN1YnNjcmlwdGlvbiAmJiAhbm90aWZpZXJTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgICAgZGVzdGluYXRpb24uYWRkKG5vdGlmaWVyU3Vic2NyaXB0aW9uKTtcbiAgICAgIHRoaXMuZGVsYXlOb3RpZmllclN1YnNjcmlwdGlvbnMucHVzaChub3RpZmllclN1YnNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cnlDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb21wbGV0ZWQgJiYgdGhpcy5kZWxheU5vdGlmaWVyU3Vic2NyaXB0aW9ucy5sZW5ndGggPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFN1YnNjcmlwdGlvbkRlbGF5T2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBPYnNlcnZhYmxlPFQ+LCBwcml2YXRlIHN1YnNjcmlwdGlvbkRlbGF5OiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbkRlbGF5LnN1YnNjcmliZShuZXcgU3Vic2NyaXB0aW9uRGVsYXlTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFN1YnNjcmlwdGlvbkRlbGF5U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHNvdXJjZVN1YnNjcmliZWQ6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmVudDogU3Vic2NyaWJlcjxUPiwgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHVudXNlZDogYW55KSB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1NvdXJjZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSkge1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnBhcmVudC5lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zdWJzY3JpYmVUb1NvdXJjZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb1NvdXJjZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuc291cmNlU3Vic2NyaWJlZCkge1xuICAgICAgdGhpcy5zb3VyY2VTdWJzY3JpYmVkID0gdHJ1ZTtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuc291cmNlLnN1YnNjcmliZSh0aGlzLnBhcmVudCk7XG4gICAgfVxuICB9XG59XG4iXX0=