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
var Subscription_1 = require("../Subscription");
var subscribeToResult_1 = require("../util/subscribeToResult");
var OuterSubscriber_1 = require("../OuterSubscriber");
/**
 * Buffers the source Observable values starting from an emission from
 * `openings` and ending when the output of `closingSelector` emits.
 *
 * <span class="informal">Collects values from the past as an array. Starts
 * collecting only when `opening` emits, and calls the `closingSelector`
 * function to get an Observable that tells when to close the buffer.</span>
 *
 * ![](bufferToggle.png)
 *
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * a Subscribable or Promise returned by the `closingSelector` function emits.
 *
 * ## Example
 *
 * Every other second, emit the click events from the next 500ms
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const openings = interval(1000);
 * const buffered = clicks.pipe(bufferToggle(openings, i =>
 *   i % 2 ? interval(500) : empty()
 * ));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferWhen}
 * @see {@link windowToggle}
 *
 * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
 * buffers.
 * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns a Subscribable or Promise,
 * which, when it emits, signals that the associated buffer should be emitted
 * and cleared.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferToggle
 * @owner Observable
 */
function bufferToggle(openings, closingSelector) {
    return function bufferToggleOperatorFunction(source) {
        return source.lift(new BufferToggleOperator(openings, closingSelector));
    };
}
exports.bufferToggle = bufferToggle;
var BufferToggleOperator = /** @class */ (function () {
    function BufferToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    BufferToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return BufferToggleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferToggleSubscriber = /** @class */ (function (_super) {
    __extends(BufferToggleSubscriber, _super);
    function BufferToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.openings = openings;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(subscribeToResult_1.subscribeToResult(_this, openings));
        return _this;
    }
    BufferToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        for (var i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    };
    BufferToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._error.call(this, err);
    };
    BufferToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        while (contexts.length > 0) {
            var context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        _super.prototype._complete.call(this);
    };
    BufferToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    };
    BufferToggleSubscriber.prototype.notifyComplete = function (innerSub) {
        this.closeBuffer(innerSub.context);
    };
    BufferToggleSubscriber.prototype.openBuffer = function (value) {
        try {
            var closingSelector = this.closingSelector;
            var closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    };
    BufferToggleSubscriber.prototype.closeBuffer = function (context) {
        var contexts = this.contexts;
        if (contexts && context) {
            var buffer = context.buffer, subscription = context.subscription;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    };
    BufferToggleSubscriber.prototype.trySubscribe = function (closingNotifier) {
        var contexts = this.contexts;
        var buffer = [];
        var subscription = new Subscription_1.Subscription();
        var context = { buffer: buffer, subscription: subscription };
        contexts.push(context);
        var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    };
    return BufferToggleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyVG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyVG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLGdEQUErQztBQUMvQywrREFBOEQ7QUFDOUQsc0RBQXFEO0FBSXJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ0c7QUFDSCxTQUFnQixZQUFZLENBQzFCLFFBQWtDLEVBQ2xDLGVBQXlEO0lBRXpELE9BQU8sU0FBUyw0QkFBNEIsQ0FBQyxNQUFxQjtRQUNoRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsQ0FBTyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDLENBQUM7QUFDSixDQUFDO0FBUEQsb0NBT0M7QUFFRDtJQUVFLDhCQUFvQixRQUFrQyxFQUNsQyxlQUF5RDtRQUR6RCxhQUFRLEdBQVIsUUFBUSxDQUEwQjtRQUNsQyxvQkFBZSxHQUFmLGVBQWUsQ0FBMEM7SUFDN0UsQ0FBQztJQUVELG1DQUFJLEdBQUosVUFBSyxVQUEyQixFQUFFLE1BQVc7UUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksc0JBQXNCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDdkcsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7QUFPRDs7OztHQUlHO0FBQ0g7SUFBMkMsMENBQXFCO0lBRzlELGdDQUFZLFdBQTRCLEVBQ3BCLFFBQWtDLEVBQ2xDLGVBQWdFO1FBRnBGLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBRW5CO1FBSm1CLGNBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLHFCQUFlLEdBQWYsZUFBZSxDQUFpRDtRQUo1RSxjQUFRLEdBQTRCLEVBQUUsQ0FBQztRQU03QyxLQUFJLENBQUMsR0FBRyxDQUFDLHFDQUFpQixDQUFDLEtBQUksRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDOztJQUM5QyxDQUFDO0lBRVMsc0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQztRQUM1QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVCLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUVTLHVDQUFNLEdBQWhCLFVBQWlCLEdBQVE7UUFDdkIsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUMvQixPQUFPLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQzFCLElBQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNqQyxPQUFPLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsaUJBQU0sTUFBTSxZQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BCLENBQUM7SUFFUywwQ0FBUyxHQUFuQjtRQUNFLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDL0IsT0FBTyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMxQixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbkMsT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDdEIsT0FBTyxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7U0FDN0I7UUFDRCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztRQUNyQixpQkFBTSxTQUFTLFdBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsMkNBQVUsR0FBVixVQUFXLFVBQWUsRUFBRSxVQUFhLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCwrQ0FBYyxHQUFkLFVBQWUsUUFBK0I7UUFDNUMsSUFBSSxDQUFDLFdBQVcsQ0FBUSxRQUFTLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVPLDJDQUFVLEdBQWxCLFVBQW1CLEtBQVE7UUFDekIsSUFBSTtZQUNGLElBQU0sZUFBZSxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7WUFDN0MsSUFBTSxlQUFlLEdBQUcsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7WUFDMUQsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsZUFBZSxDQUFDLENBQUM7YUFDcEM7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFTyw0Q0FBVyxHQUFuQixVQUFvQixPQUF5QjtRQUMzQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQUksUUFBUSxJQUFJLE9BQU8sRUFBRTtZQUNmLElBQUEsdUJBQU0sRUFBRSxtQ0FBWSxDQUFhO1lBQ3pDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLFFBQVEsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM5QyxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQzFCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUM1QjtJQUNILENBQUM7SUFFTyw2Q0FBWSxHQUFwQixVQUFxQixlQUFvQjtRQUN2QyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBRS9CLElBQU0sTUFBTSxHQUFhLEVBQUUsQ0FBQztRQUM1QixJQUFNLFlBQVksR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztRQUN4QyxJQUFNLE9BQU8sR0FBRyxFQUFFLE1BQU0sUUFBQSxFQUFFLFlBQVksY0FBQSxFQUFFLENBQUM7UUFDekMsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUV2QixJQUFNLGlCQUFpQixHQUFHLHFDQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLEVBQU8sT0FBTyxDQUFDLENBQUM7UUFFakYsSUFBSSxDQUFDLGlCQUFpQixJQUFJLGlCQUFpQixDQUFDLE1BQU0sRUFBRTtZQUNsRCxJQUFJLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDRSxpQkFBa0IsQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBRTVDLElBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztZQUM1QixZQUFZLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBaEdELENBQTJDLGlDQUFlLEdBZ0d6RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIFN1YnNjcmliYWJsZU9yUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBCdWZmZXJzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgc3RhcnRpbmcgZnJvbSBhbiBlbWlzc2lvbiBmcm9tXG4gKiBgb3BlbmluZ3NgIGFuZCBlbmRpbmcgd2hlbiB0aGUgb3V0cHV0IG9mIGBjbG9zaW5nU2VsZWN0b3JgIGVtaXRzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db2xsZWN0cyB2YWx1ZXMgZnJvbSB0aGUgcGFzdCBhcyBhbiBhcnJheS4gU3RhcnRzXG4gKiBjb2xsZWN0aW5nIG9ubHkgd2hlbiBgb3BlbmluZ2AgZW1pdHMsIGFuZCBjYWxscyB0aGUgYGNsb3NpbmdTZWxlY3RvcmBcbiAqIGZ1bmN0aW9uIHRvIGdldCBhbiBPYnNlcnZhYmxlIHRoYXQgdGVsbHMgd2hlbiB0byBjbG9zZSB0aGUgYnVmZmVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyVG9nZ2xlLnBuZylcbiAqXG4gKiBCdWZmZXJzIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgYnkgb3BlbmluZyB0aGUgYnVmZmVyIHZpYSBzaWduYWxzIGZyb20gYW5cbiAqIE9ic2VydmFibGUgcHJvdmlkZWQgdG8gYG9wZW5pbmdzYCwgYW5kIGNsb3NpbmcgYW5kIHNlbmRpbmcgdGhlIGJ1ZmZlcnMgd2hlblxuICogYSBTdWJzY3JpYmFibGUgb3IgUHJvbWlzZSByZXR1cm5lZCBieSB0aGUgYGNsb3NpbmdTZWxlY3RvcmAgZnVuY3Rpb24gZW1pdHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIEV2ZXJ5IG90aGVyIHNlY29uZCwgZW1pdCB0aGUgY2xpY2sgZXZlbnRzIGZyb20gdGhlIG5leHQgNTAwbXNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgb3BlbmluZ3MgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyVG9nZ2xlKG9wZW5pbmdzLCBpID0+XG4gKiAgIGkgJSAyID8gaW50ZXJ2YWwoNTAwKSA6IGVtcHR5KClcbiAqICkpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYnVmZmVyfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyQ291bnR9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUaW1lfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqXG4gKiBAcGFyYW0ge1N1YnNjcmliYWJsZU9yUHJvbWlzZTxPPn0gb3BlbmluZ3MgQSBTdWJzY3JpYmFibGUgb3IgUHJvbWlzZSBvZiBub3RpZmljYXRpb25zIHRvIHN0YXJ0IG5ld1xuICogYnVmZmVycy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IE8pOiBTdWJzY3JpYmFibGVPclByb21pc2V9IGNsb3NpbmdTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIHRoZSB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBgb3BlbmluZ3NgIG9ic2VydmFibGUgYW5kIHJldHVybnMgYSBTdWJzY3JpYmFibGUgb3IgUHJvbWlzZSxcbiAqIHdoaWNoLCB3aGVuIGl0IGVtaXRzLCBzaWduYWxzIHRoYXQgdGhlIGFzc29jaWF0ZWQgYnVmZmVyIHNob3VsZCBiZSBlbWl0dGVkXG4gKiBhbmQgY2xlYXJlZC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gb2JzZXJ2YWJsZSBvZiBhcnJheXMgb2YgYnVmZmVyZWQgdmFsdWVzLlxuICogQG1ldGhvZCBidWZmZXJUb2dnbGVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb2dnbGU8VCwgTz4oXG4gIG9wZW5pbmdzOiBTdWJzY3JpYmFibGVPclByb21pc2U8Tz4sXG4gIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PlxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1ZmZlclRvZ2dsZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJUb2dnbGVPcGVyYXRvcjxULCBPPihvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSk7XG4gIH07XG59XG5cbmNsYXNzIEJ1ZmZlclRvZ2dsZU9wZXJhdG9yPFQsIE8+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvcGVuaW5nczogU3Vic2NyaWJhYmxlT3JQcm9taXNlPE8+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyVG9nZ2xlU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm9wZW5pbmdzLCB0aGlzLmNsb3NpbmdTZWxlY3RvcikpO1xuICB9XG59XG5cbmludGVyZmFjZSBCdWZmZXJDb250ZXh0PFQ+IHtcbiAgYnVmZmVyOiBUW107XG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyVG9nZ2xlU3Vic2NyaWJlcjxULCBPPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBPPiB7XG4gIHByaXZhdGUgY29udGV4dHM6IEFycmF5PEJ1ZmZlckNvbnRleHQ8VD4+ID0gW107XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvcGVuaW5nczogU3Vic2NyaWJhYmxlT3JQcm9taXNlPE8+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PiB8IHZvaWQpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb3BlbmluZ3MpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcbiAgICBjb25zdCBsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29udGV4dHNbaV0uYnVmZmVyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG4gICAgd2hpbGUgKGNvbnRleHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5zaGlmdCgpO1xuICAgICAgY29udGV4dC5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGNvbnRleHQuYnVmZmVyID0gbnVsbDtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgc3VwZXIuX2Vycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcbiAgICB3aGlsZSAoY29udGV4dHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRzLnNoaWZ0KCk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoY29udGV4dC5idWZmZXIpO1xuICAgICAgY29udGV4dC5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGNvbnRleHQuYnVmZmVyID0gbnVsbDtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogTyxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIE8+KTogdm9pZCB7XG4gICAgb3V0ZXJWYWx1ZSA/IHRoaXMuY2xvc2VCdWZmZXIob3V0ZXJWYWx1ZSkgOiB0aGlzLm9wZW5CdWZmZXIoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIE8+KTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZUJ1ZmZlcigoPGFueT4gaW5uZXJTdWIpLmNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuQnVmZmVyKHZhbHVlOiBPKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3NpbmdTZWxlY3RvciA9IHRoaXMuY2xvc2luZ1NlbGVjdG9yO1xuICAgICAgY29uc3QgY2xvc2luZ05vdGlmaWVyID0gY2xvc2luZ1NlbGVjdG9yLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgaWYgKGNsb3NpbmdOb3RpZmllcikge1xuICAgICAgICB0aGlzLnRyeVN1YnNjcmliZShjbG9zaW5nTm90aWZpZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlQnVmZmVyKGNvbnRleHQ6IEJ1ZmZlckNvbnRleHQ8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG5cbiAgICBpZiAoY29udGV4dHMgJiYgY29udGV4dCkge1xuICAgICAgY29uc3QgeyBidWZmZXIsIHN1YnNjcmlwdGlvbiB9ID0gY29udGV4dDtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgY29udGV4dHMuc3BsaWNlKGNvbnRleHRzLmluZGV4T2YoY29udGV4dCksIDEpO1xuICAgICAgdGhpcy5yZW1vdmUoc3Vic2NyaXB0aW9uKTtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5U3Vic2NyaWJlKGNsb3NpbmdOb3RpZmllcjogYW55KTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dHMgPSB0aGlzLmNvbnRleHRzO1xuXG4gICAgY29uc3QgYnVmZmVyOiBBcnJheTxUPiA9IFtdO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCBjb250ZXh0ID0geyBidWZmZXIsIHN1YnNjcmlwdGlvbiB9O1xuICAgIGNvbnRleHRzLnB1c2goY29udGV4dCk7XG5cbiAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGNsb3NpbmdOb3RpZmllciwgPGFueT5jb250ZXh0KTtcblxuICAgIGlmICghaW5uZXJTdWJzY3JpcHRpb24gfHwgaW5uZXJTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLmNsb3NlQnVmZmVyKGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAoPGFueT4gaW5uZXJTdWJzY3JpcHRpb24pLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgICB0aGlzLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==