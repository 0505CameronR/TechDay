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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93VG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1RvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzQ0FBcUM7QUFDckMsZ0RBQStDO0FBQy9DLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFDbEQsc0RBQXFEO0FBRXJELCtEQUE4RDtBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q0c7QUFDSCxTQUFnQixZQUFZLENBQU8sUUFBdUIsRUFDdkIsZUFBa0Q7SUFDbkYsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQU8sUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDLEVBQXRFLENBQXNFLENBQUM7QUFDM0csQ0FBQztBQUhELG9DQUdDO0FBRUQ7SUFFRSw4QkFBb0IsUUFBdUIsRUFDdkIsZUFBa0Q7UUFEbEQsYUFBUSxHQUFSLFFBQVEsQ0FBZTtRQUN2QixvQkFBZSxHQUFmLGVBQWUsQ0FBbUM7SUFDdEUsQ0FBQztJQUVELG1DQUFJLEdBQUosVUFBSyxVQUFxQyxFQUFFLE1BQVc7UUFDckQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksc0JBQXNCLENBQ2hELFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQ2hELENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFYRCxJQVdDO0FBT0Q7Ozs7R0FJRztBQUNIO0lBQTJDLDBDQUF1QjtJQUloRSxnQ0FBWSxXQUFzQyxFQUM5QixRQUF1QixFQUN2QixlQUFrRDtRQUZ0RSxZQUdF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SUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQVEsS0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRU8sNENBQVcsR0FBbkIsVUFBb0IsS0FBYTtRQUMvQixJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoQixPQUFPO1NBQ1I7UUFFTyxJQUFBLHdCQUFRLENBQVU7UUFDMUIsSUFBTSxPQUFPLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLElBQUEsdUJBQU0sRUFBRSxtQ0FBWSxDQUFhO1FBQ3pDLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNsQixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUNILDZCQUFDO0FBQUQsQ0FBQyxBQTdIRCxDQUEyQyxpQ0FBZSxHQTZIekQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgc3RhcnRpbmcgZnJvbVxuICogYW4gZW1pc3Npb24gZnJvbSBgb3BlbmluZ3NgIGFuZCBlbmRpbmcgd2hlbiB0aGUgb3V0cHV0IG9mIGBjbG9zaW5nU2VsZWN0b3JgXG4gKiBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBidWZmZXJUb2dnbGV9LCBidXQgZW1pdHMgYSBuZXN0ZWRcbiAqIE9ic2VydmFibGUgaW5zdGVhZCBvZiBhbiBhcnJheS48L3NwYW4+XG4gKlxuICogIVtdKHdpbmRvd1RvZ2dsZS5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyB3aW5kb3dzIHRoYXQgY29udGFpbiB0aG9zZSBpdGVtc1xuICogZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYmV0d2VlbiB0aGUgdGltZSB3aGVuIHRoZSBgb3BlbmluZ3NgXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGFuIGl0ZW0gYW5kIHdoZW4gdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgYnlcbiAqIGBjbG9zaW5nU2VsZWN0b3JgIGVtaXRzIGFuIGl0ZW0uXG4gKlxuICogIyMgRXhhbXBsZVxuICogRXZlcnkgb3RoZXIgc2Vjb25kLCBlbWl0IHRoZSBjbGljayBldmVudHMgZnJvbSB0aGUgbmV4dCA1MDBtc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IG9wZW5pbmdzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShcbiAqICAgd2luZG93VG9nZ2xlKG9wZW5pbmdzLCBpID0+IGkgJSAyID8gaW50ZXJ2YWwoNTAwKSA6IGVtcHR5KCkpLFxuICogICBtZXJnZUFsbCgpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB3aW5kb3d9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dDb3VudH1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RpbWV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dXaGVufVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZTxPPn0gb3BlbmluZ3MgQW4gb2JzZXJ2YWJsZSBvZiBub3RpZmljYXRpb25zIHRvIHN0YXJ0IG5ld1xuICogd2luZG93cy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IE8pOiBPYnNlcnZhYmxlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiB0aGUgdmFsdWUgZW1pdHRlZCBieSB0aGUgYG9wZW5pbmdzYCBvYnNlcnZhYmxlIGFuZCByZXR1cm5zIGFuIE9ic2VydmFibGUsXG4gKiB3aGljaCwgd2hlbiBpdCBlbWl0cyAoZWl0aGVyIGBuZXh0YCBvciBgY29tcGxldGVgKSwgc2lnbmFscyB0aGF0IHRoZVxuICogYXNzb2NpYXRlZCB3aW5kb3cgc2hvdWxkIGNvbXBsZXRlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gb2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBpbiB0dXJuXG4gKiBhcmUgT2JzZXJ2YWJsZXMuXG4gKiBAbWV0aG9kIHdpbmRvd1RvZ2dsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1RvZ2dsZTxULCBPPihvcGVuaW5nczogT2JzZXJ2YWJsZTxPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBXaW5kb3dUb2dnbGVPcGVyYXRvcjxULCBPPihvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSk7XG59XG5cbmNsYXNzIFdpbmRvd1RvZ2dsZU9wZXJhdG9yPFQsIE8+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgT2JzZXJ2YWJsZTxUPj4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3BlbmluZ3M6IE9ic2VydmFibGU8Tz4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBXaW5kb3dUb2dnbGVTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5vcGVuaW5ncywgdGhpcy5jbG9zaW5nU2VsZWN0b3JcbiAgICApKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgV2luZG93Q29udGV4dDxUPiB7XG4gIHdpbmRvdzogU3ViamVjdDxUPjtcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaW5kb3dUb2dnbGVTdWJzY3JpYmVyPFQsIE8+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIGFueT4ge1xuICBwcml2YXRlIGNvbnRleHRzOiBXaW5kb3dDb250ZXh0PFQ+W10gPSBbXTtcbiAgcHJpdmF0ZSBvcGVuU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb3BlbmluZ3M6IE9ic2VydmFibGU8Tz4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQodGhpcy5vcGVuU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb3BlbmluZ3MsIG9wZW5pbmdzIGFzIGFueSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgeyBjb250ZXh0cyB9ID0gdGhpcztcbiAgICBpZiAoY29udGV4dHMpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29udGV4dHNbaV0ud2luZG93Lm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcblxuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG5cbiAgICBpZiAoY29udGV4dHMpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaW5kZXhdO1xuICAgICAgICBjb250ZXh0LndpbmRvdy5lcnJvcihlcnIpO1xuICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCB7IGNvbnRleHRzIH0gPSB0aGlzO1xuICAgIHRoaXMuY29udGV4dHMgPSBudWxsO1xuICAgIGlmIChjb250ZXh0cykge1xuICAgICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaW5kZXhdO1xuICAgICAgICBjb250ZXh0LndpbmRvdy5jb21wbGV0ZSgpO1xuICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgaWYgKGNvbnRleHRzKSB7XG4gICAgICBjb25zdCBsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpbmRleF07XG4gICAgICAgIGNvbnRleHQud2luZG93LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBhbnksIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcblxuICAgIGlmIChvdXRlclZhbHVlID09PSB0aGlzLm9wZW5pbmdzKSB7XG5cbiAgICAgIGNvbnN0IHsgY2xvc2luZ1NlbGVjdG9yIH0gPSB0aGlzO1xuICAgICAgY29uc3QgY2xvc2luZ05vdGlmaWVyID0gdHJ5Q2F0Y2goY2xvc2luZ1NlbGVjdG9yKShpbm5lclZhbHVlKTtcblxuICAgICAgaWYgKGNsb3NpbmdOb3RpZmllciA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB3aW5kb3cgPSBuZXcgU3ViamVjdDxUPigpO1xuICAgICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSB7IHdpbmRvdywgc3Vic2NyaXB0aW9uIH07XG4gICAgICAgIHRoaXMuY29udGV4dHMucHVzaChjb250ZXh0KTtcbiAgICAgICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIsIGNvbnRleHQgYXMgYW55KTtcblxuICAgICAgICBpZiAoaW5uZXJTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICAgICAgdGhpcy5jbG9zZVdpbmRvdyh0aGlzLmNvbnRleHRzLmxlbmd0aCAtIDEpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICg8YW55PiBpbm5lclN1YnNjcmlwdGlvbikuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgICAgc3Vic2NyaXB0aW9uLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQod2luZG93KTtcblxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmNsb3NlV2luZG93KHRoaXMuY29udGV4dHMuaW5kZXhPZihvdXRlclZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmVycm9yKGVycik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lcjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgaWYgKGlubmVyICE9PSB0aGlzLm9wZW5TdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuY2xvc2VXaW5kb3codGhpcy5jb250ZXh0cy5pbmRleE9mKCg8YW55PiBpbm5lcikuY29udGV4dCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2xvc2VXaW5kb3coaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIGlmIChpbmRleCA9PT0gLTEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGNvbnRleHRzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpbmRleF07XG4gICAgY29uc3QgeyB3aW5kb3csIHN1YnNjcmlwdGlvbiB9ID0gY29udGV4dDtcbiAgICBjb250ZXh0cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIHdpbmRvdy5jb21wbGV0ZSgpO1xuICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=