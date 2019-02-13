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
var Subject_1 = require("../Subject");
var Subscription_1 = require("../Subscription");
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowToggle.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * ## Example
 * Every other second, emit the click events from the next 500ms
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const openings = interval(1000);
 * const result = clicks.pipe(
 *   windowToggle(openings, i => i % 2 ? interval(500) : empty()),
 *   mergeAll(),
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits (either `next` or `complete`), signals that the
 * associated window should complete.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowToggle
 * @owner Observable
 */
function windowToggle(openings, closingSelector) {
    return function (source) { return source.lift(new WindowToggleOperator(openings, closingSelector)); };
}
exports.windowToggle = windowToggle;
var WindowToggleOperator = /** @class */ (function () {
    function WindowToggleOperator(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    WindowToggleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    };
    return WindowToggleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowToggleSubscriber = /** @class */ (function (_super) {
    __extends(WindowToggleSubscriber, _super);
    function WindowToggleSubscriber(destination, openings, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.openings = openings;
        _this.closingSelector = closingSelector;
        _this.contexts = [];
        _this.add(_this.openSubscription = subscribeToResult_1.subscribeToResult(_this, openings, openings));
        return _this;
    }
    WindowToggleSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        if (contexts) {
            var len = contexts.length;
            for (var i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    };
    WindowToggleSubscriber.prototype._error = function (err) {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._error.call(this, err);
    };
    WindowToggleSubscriber.prototype._complete = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    WindowToggleSubscriber.prototype._unsubscribe = function () {
        var contexts = this.contexts;
        this.contexts = null;
        if (contexts) {
            var len = contexts.length;
            var index = -1;
            while (++index < len) {
                var context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    };
    WindowToggleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            var closingSelector = this.closingSelector;
            var closingNotifier = tryCatch_1.tryCatch(closingSelector)(innerValue);
            if (closingNotifier === errorObject_1.errorObject) {
                return this.error(errorObject_1.errorObject.e);
            }
            else {
                var window_1 = new Subject_1.Subject();
                var subscription = new Subscription_1.Subscription();
                var context = { window: window_1, subscription: subscription };
                this.contexts.push(context);
                var innerSubscription = subscribeToResult_1.subscribeToResult(this, closingNotifier, context);
                if (innerSubscription.closed) {
                    this.closeWindow(this.contexts.length - 1);
                }
                else {
                    innerSubscription.context = context;
                    subscription.add(innerSubscription);
                }
                this.destination.next(window_1);
            }
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    };
    WindowToggleSubscriber.prototype.notifyError = function (err) {
        this.error(err);
    };
    WindowToggleSubscriber.prototype.notifyComplete = function (inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    };
    WindowToggleSubscriber.prototype.closeWindow = function (index) {
        if (index === -1) {
            return;
        }
        var contexts = this.contexts;
        var context = contexts[index];
        var window = context.window, subscription = context.subscription;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    };
    return WindowToggleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93VG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93VG9nZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNDQUFxQztBQUNyQyxnREFBK0M7QUFDL0MsNkNBQTRDO0FBQzVDLG1EQUFrRDtBQUNsRCxzREFBcUQ7QUFFckQsK0RBQThEO0FBRzlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILFNBQWdCLFlBQVksQ0FBTyxRQUF1QixFQUN2QixlQUFrRDtJQUNuRixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxvQkFBb0IsQ0FBTyxRQUFRLEVBQUUsZUFBZSxDQUFDLENBQUMsRUFBdEUsQ0FBc0UsQ0FBQztBQUMzRyxDQUFDO0FBSEQsb0NBR0M7QUFFRDtJQUVFLDhCQUFvQixRQUF1QixFQUN2QixlQUFrRDtRQURsRCxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLG9CQUFlLEdBQWYsZUFBZSxDQUFtQztJQUN0RSxDQUFDO0lBRUQsbUNBQUksR0FBSixVQUFLLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBc0IsQ0FDaEQsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FDaEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQVhELElBV0M7QUFPRDs7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QUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDbEIsQ0FBQztJQUVELCtDQUFjLEdBQWQsVUFBZSxLQUFtQjtRQUNoQyxJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUU7WUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBUSxLQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUNoRTtJQUNILENBQUM7SUFFTyw0Q0FBVyxHQUFuQixVQUFvQixLQUFhO1FBQy9CLElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLE9BQU87U0FDUjtRQUVPLElBQUEsd0JBQVEsQ0FBVTtRQUMxQixJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsSUFBQSx1QkFBTSxFQUFFLG1DQUFZLENBQWE7UUFDekMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBN0hELENBQTJDLGlDQUFlLEdBNkh6RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBCcmFuY2ggb3V0IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgYXMgYSBuZXN0ZWQgT2JzZXJ2YWJsZSBzdGFydGluZyBmcm9tXG4gKiBhbiBlbWlzc2lvbiBmcm9tIGBvcGVuaW5nc2AgYW5kIGVuZGluZyB3aGVuIHRoZSBvdXRwdXQgb2YgYGNsb3NpbmdTZWxlY3RvcmBcbiAqIGVtaXRzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIGJ1ZmZlclRvZ2dsZX0sIGJ1dCBlbWl0cyBhIG5lc3RlZFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGFuIGFycmF5Ljwvc3Bhbj5cbiAqXG4gKiAhW10od2luZG93VG9nZ2xlLnBuZylcbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB3aW5kb3dzIG9mIGl0ZW1zIGl0IGNvbGxlY3RzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlIGVtaXRzIHdpbmRvd3MgdGhhdCBjb250YWluIHRob3NlIGl0ZW1zXG4gKiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBiZXR3ZWVuIHRoZSB0aW1lIHdoZW4gdGhlIGBvcGVuaW5nc2BcbiAqIE9ic2VydmFibGUgZW1pdHMgYW4gaXRlbSBhbmQgd2hlbiB0aGUgT2JzZXJ2YWJsZSByZXR1cm5lZCBieVxuICogYGNsb3NpbmdTZWxlY3RvcmAgZW1pdHMgYW4gaXRlbS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFdmVyeSBvdGhlciBzZWNvbmQsIGVtaXQgdGhlIGNsaWNrIGV2ZW50cyBmcm9tIHRoZSBuZXh0IDUwMG1zXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgb3BlbmluZ3MgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKFxuICogICB3aW5kb3dUb2dnbGUob3BlbmluZ3MsIGkgPT4gaSAlIDIgPyBpbnRlcnZhbCg1MDApIDogZW1wdHkoKSksXG4gKiAgIG1lcmdlQWxsKCksXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHdpbmRvd31cbiAqIEBzZWUge0BsaW5rIHdpbmRvd0NvdW50fVxuICogQHNlZSB7QGxpbmsgd2luZG93VGltZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1doZW59XG4gKiBAc2VlIHtAbGluayBidWZmZXJUb2dnbGV9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlPE8+fSBvcGVuaW5ncyBBbiBvYnNlcnZhYmxlIG9mIG5vdGlmaWNhdGlvbnMgdG8gc3RhcnQgbmV3XG4gKiB3aW5kb3dzLlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogTyk6IE9ic2VydmFibGV9IGNsb3NpbmdTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIHRoZSB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBgb3BlbmluZ3NgIG9ic2VydmFibGUgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSxcbiAqIHdoaWNoLCB3aGVuIGl0IGVtaXRzIChlaXRoZXIgYG5leHRgIG9yIGBjb21wbGV0ZWApLCBzaWduYWxzIHRoYXQgdGhlXG4gKiBhc3NvY2lhdGVkIHdpbmRvdyBzaG91bGQgY29tcGxldGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPE9ic2VydmFibGU8VD4+fSBBbiBvYnNlcnZhYmxlIG9mIHdpbmRvd3MsIHdoaWNoIGluIHR1cm5cbiAqIGFyZSBPYnNlcnZhYmxlcy5cbiAqIEBtZXRob2Qgd2luZG93VG9nZ2xlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2luZG93VG9nZ2xlPFQsIE8+KG9wZW5pbmdzOiBPYnNlcnZhYmxlPE8+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbG9zaW5nU2VsZWN0b3I6IChvcGVuVmFsdWU6IE8pID0+IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgT2JzZXJ2YWJsZTxUPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFdpbmRvd1RvZ2dsZU9wZXJhdG9yPFQsIE8+KG9wZW5pbmdzLCBjbG9zaW5nU2VsZWN0b3IpKTtcbn1cblxuY2xhc3MgV2luZG93VG9nZ2xlT3BlcmF0b3I8VCwgTz4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBPYnNlcnZhYmxlPFQ+PiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvcGVuaW5nczogT2JzZXJ2YWJsZTxPPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6IChvcGVuVmFsdWU6IE8pID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFdpbmRvd1RvZ2dsZVN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLm9wZW5pbmdzLCB0aGlzLmNsb3NpbmdTZWxlY3RvclxuICAgICkpO1xuICB9XG59XG5cbmludGVyZmFjZSBXaW5kb3dDb250ZXh0PFQ+IHtcbiAgd2luZG93OiBTdWJqZWN0PFQ+O1xuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFdpbmRvd1RvZ2dsZVN1YnNjcmliZXI8VCwgTz4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgYW55PiB7XG4gIHByaXZhdGUgY29udGV4dHM6IFdpbmRvd0NvbnRleHQ8VD5bXSA9IFtdO1xuICBwcml2YXRlIG9wZW5TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvcGVuaW5nczogT2JzZXJ2YWJsZTxPPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6IChvcGVuVmFsdWU6IE8pID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLmFkZCh0aGlzLm9wZW5TdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBvcGVuaW5ncywgb3BlbmluZ3MgYXMgYW55KSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBjb25zdCB7IGNvbnRleHRzIH0gPSB0aGlzO1xuICAgIGlmIChjb250ZXh0cykge1xuICAgICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb250ZXh0c1tpXS53aW5kb3cubmV4dCh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSkge1xuXG4gICAgY29uc3QgeyBjb250ZXh0cyB9ID0gdGhpcztcbiAgICB0aGlzLmNvbnRleHRzID0gbnVsbDtcblxuICAgIGlmIChjb250ZXh0cykge1xuICAgICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG5cbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpbmRleF07XG4gICAgICAgIGNvbnRleHQud2luZG93LmVycm9yKGVycik7XG4gICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgc3VwZXIuX2Vycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgaWYgKGNvbnRleHRzKSB7XG4gICAgICBjb25zdCBsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpbmRleF07XG4gICAgICAgIGNvbnRleHQud2luZG93LmNvbXBsZXRlKCk7XG4gICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBjb250ZXh0cyB9ID0gdGhpcztcbiAgICB0aGlzLmNvbnRleHRzID0gbnVsbDtcbiAgICBpZiAoY29udGV4dHMpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuICAgICAgd2hpbGUgKCsraW5kZXggPCBsZW4pIHtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRzW2luZGV4XTtcbiAgICAgICAgY29udGV4dC53aW5kb3cudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgY29udGV4dC5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuXG4gICAgaWYgKG91dGVyVmFsdWUgPT09IHRoaXMub3BlbmluZ3MpIHtcblxuICAgICAgY29uc3QgeyBjbG9zaW5nU2VsZWN0b3IgfSA9IHRoaXM7XG4gICAgICBjb25zdCBjbG9zaW5nTm90aWZpZXIgPSB0cnlDYXRjaChjbG9zaW5nU2VsZWN0b3IpKGlubmVyVmFsdWUpO1xuXG4gICAgICBpZiAoY2xvc2luZ05vdGlmaWVyID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBTdWJqZWN0PFQ+KCk7XG4gICAgICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgICAgY29uc3QgY29udGV4dCA9IHsgd2luZG93LCBzdWJzY3JpcHRpb24gfTtcbiAgICAgICAgdGhpcy5jb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuICAgICAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGNsb3NpbmdOb3RpZmllciwgY29udGV4dCBhcyBhbnkpO1xuXG4gICAgICAgIGlmIChpbm5lclN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgICAgICB0aGlzLmNsb3NlV2luZG93KHRoaXMuY29udGV4dHMubGVuZ3RoIC0gMSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgKDxhbnk+IGlubmVyU3Vic2NyaXB0aW9uKS5jb250ZXh0ID0gY29udGV4dDtcbiAgICAgICAgICBzdWJzY3JpcHRpb24uYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh3aW5kb3cpO1xuXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY2xvc2VXaW5kb3codGhpcy5jb250ZXh0cy5pbmRleE9mKG91dGVyVmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZXJyb3IoZXJyKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBpZiAoaW5uZXIgIT09IHRoaXMub3BlblN1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5jbG9zZVdpbmRvdyh0aGlzLmNvbnRleHRzLmluZGV4T2YoKDxhbnk+IGlubmVyKS5jb250ZXh0KSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZVdpbmRvdyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRzW2luZGV4XTtcbiAgICBjb25zdCB7IHdpbmRvdywgc3Vic2NyaXB0aW9uIH0gPSBjb250ZXh0O1xuICAgIGNvbnRleHRzLnNwbGljZShpbmRleCwgMSk7XG4gICAgd2luZG93LmNvbXBsZXRlKCk7XG4gICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gIH1cbn1cbiJdfQ==