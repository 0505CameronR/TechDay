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
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowWhen.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping windows.
 * It emits the current window and opens a new one whenever the Observable
 * produced by the specified `closingSelector` function emits an item. The first
 * window is opened immediately when subscribing to the output Observable.
 *
 * ## Example
 * Emit only the first two clicks events in every window of [1-5] random seconds
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   windowWhen(() => interval(1000 + Math.random() * 4000)),
 *   map(win => win.pipe(take(2))),     // each window has at most 2 emissions
 *   mergeAll(),                        // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals (on either `next` or
 * `complete`) when to close the previous window and start a new one.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowWhen
 * @owner Observable
 */
function windowWhen(closingSelector) {
    return function windowWhenOperatorFunction(source) {
        return source.lift(new WindowOperator(closingSelector));
    };
}
exports.windowWhen = windowWhen;
var WindowOperator = /** @class */ (function () {
    function WindowOperator(closingSelector) {
        this.closingSelector = closingSelector;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    };
    return WindowOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowSubscriber = /** @class */ (function (_super) {
    __extends(WindowSubscriber, _super);
    function WindowSubscriber(destination, closingSelector) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.closingSelector = closingSelector;
        _this.openWindow();
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this.openWindow(innerSub);
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    };
    WindowSubscriber.prototype.unsubscribeClosingNotification = function () {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    };
    WindowSubscriber.prototype.openWindow = function (innerSub) {
        if (innerSub === void 0) { innerSub = null; }
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var window = this.window = new Subject_1.Subject();
        this.destination.next(window);
        var closingNotifier = tryCatch_1.tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject_1.errorObject) {
            var err = errorObject_1.errorObject.e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = subscribeToResult_1.subscribeToResult(this, closingNotifier));
        }
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1doZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esc0NBQXFDO0FBRXJDLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFDbEQsc0RBQXFEO0FBRXJELCtEQUE4RDtBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Q0c7QUFDSCxTQUFnQixVQUFVLENBQUksZUFBc0M7SUFDbEUsT0FBTyxTQUFTLDBCQUEwQixDQUFDLE1BQXFCO1FBQzlELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCxnQ0FJQztBQUVEO0lBQ0Usd0JBQW9CLGVBQXNDO1FBQXRDLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtJQUMxRCxDQUFDO0lBRUQsNkJBQUksR0FBSixVQUFLLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDbEYsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBa0Msb0NBQXVCO0lBSXZELDBCQUFzQixXQUFzQyxFQUN4QyxlQUFzQztRQUQxRCxZQUVFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQUpxQixpQkFBVyxHQUFYLFdBQVcsQ0FBMkI7UUFDeEMscUJBQWUsR0FBZixlQUFlLENBQXVCO1FBRXhELEtBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQzs7SUFDcEIsQ0FBQztJQUVELHFDQUFVLEdBQVYsVUFBVyxVQUFhLEVBQUUsVUFBZSxFQUM5QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQWlDO1FBQzFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELHNDQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBaUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQseUNBQWMsR0FBZCxVQUFlLFFBQWlDO1FBQzlDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVTLGdDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVMsaUNBQU0sR0FBaEIsVUFBaUIsR0FBUTtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRVMsb0NBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDNUIsSUFBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVPLHlEQUE4QixHQUF0QztRQUNFLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFTyxxQ0FBVSxHQUFsQixVQUFtQixRQUF3QztRQUF4Qyx5QkFBQSxFQUFBLGVBQXdDO1FBQ3pELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDeEI7UUFFRCxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO1FBRUQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGlCQUFPLEVBQUssQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixJQUFNLGVBQWUsR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDO1FBQ3pELElBQUksZUFBZSxLQUFLLHlCQUFXLEVBQUU7WUFDbkMsSUFBTSxHQUFHLEdBQUcseUJBQVcsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7YUFBTTtZQUNMLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLHFDQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1NBQy9FO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQXJFRCxDQUFrQyxpQ0FBZSxHQXFFaEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgdXNpbmcgYVxuICogZmFjdG9yeSBmdW5jdGlvbiBvZiBjbG9zaW5nIE9ic2VydmFibGVzIHRvIGRldGVybWluZSB3aGVuIHRvIHN0YXJ0IGEgbmV3XG4gKiB3aW5kb3cuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyV2hlbn0sIGJ1dCBlbWl0cyBhIG5lc3RlZFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGFuIGFycmF5Ljwvc3Bhbj5cbiAqXG4gKiAhW10od2luZG93V2hlbi5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyBjb25uZWN0ZWQsIG5vbi1vdmVybGFwcGluZyB3aW5kb3dzLlxuICogSXQgZW1pdHMgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBvcGVucyBhIG5ldyBvbmUgd2hlbmV2ZXIgdGhlIE9ic2VydmFibGVcbiAqIHByb2R1Y2VkIGJ5IHRoZSBzcGVjaWZpZWQgYGNsb3NpbmdTZWxlY3RvcmAgZnVuY3Rpb24gZW1pdHMgYW4gaXRlbS4gVGhlIGZpcnN0XG4gKiB3aW5kb3cgaXMgb3BlbmVkIGltbWVkaWF0ZWx5IHdoZW4gc3Vic2NyaWJpbmcgdG8gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgb25seSB0aGUgZmlyc3QgdHdvIGNsaWNrcyBldmVudHMgaW4gZXZlcnkgd2luZG93IG9mIFsxLTVdIHJhbmRvbSBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoXG4gKiAgIHdpbmRvd1doZW4oKCkgPT4gaW50ZXJ2YWwoMTAwMCArIE1hdGgucmFuZG9tKCkgKiA0MDAwKSksXG4gKiAgIG1hcCh3aW4gPT4gd2luLnBpcGUodGFrZSgyKSkpLCAgICAgLy8gZWFjaCB3aW5kb3cgaGFzIGF0IG1vc3QgMiBlbWlzc2lvbnNcbiAqICAgbWVyZ2VBbGwoKSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBmbGF0dGVuIHRoZSBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHdpbmRvd31cbiAqIEBzZWUge0BsaW5rIHdpbmRvd0NvdW50fVxuICogQHNlZSB7QGxpbmsgd2luZG93VGltZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBPYnNlcnZhYmxlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHNpZ25hbHMgKG9uIGVpdGhlciBgbmV4dGAgb3JcbiAqIGBjb21wbGV0ZWApIHdoZW4gdG8gY2xvc2UgdGhlIHByZXZpb3VzIHdpbmRvdyBhbmQgc3RhcnQgYSBuZXcgb25lLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gb2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBpbiB0dXJuXG4gKiBhcmUgT2JzZXJ2YWJsZXMuXG4gKiBAbWV0aG9kIHdpbmRvd1doZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dXaGVuPFQ+KGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBPYnNlcnZhYmxlPFQ+PiB7XG4gIHJldHVybiBmdW5jdGlvbiB3aW5kb3dXaGVuT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFdpbmRvd09wZXJhdG9yPFQ+KGNsb3NpbmdTZWxlY3RvcikpO1xuICB9O1xufVxuXG5jbGFzcyBXaW5kb3dPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFdpbmRvd1N1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jbG9zaW5nU2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgV2luZG93U3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBhbnk+IHtcbiAgcHJpdmF0ZSB3aW5kb3c6IFN1YmplY3Q8VD47XG4gIHByaXZhdGUgY2xvc2luZ05vdGlmaWNhdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLm9wZW5XaW5kb3coKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMub3BlbldpbmRvdyhpbm5lclN1Yik7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcihlcnJvcik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLm9wZW5XaW5kb3coaW5uZXJTdWIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuZXJyb3IoZXJyKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZUNsb3NpbmdOb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuY29tcGxldGUoKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZUNsb3NpbmdOb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVDbG9zaW5nTm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb3NpbmdOb3RpZmljYXRpb24pIHtcbiAgICAgIHRoaXMuY2xvc2luZ05vdGlmaWNhdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb3BlbldpbmRvdyhpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKGlubmVyU3ViKSB7XG4gICAgICB0aGlzLnJlbW92ZShpbm5lclN1Yik7XG4gICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZXaW5kb3cgPSB0aGlzLndpbmRvdztcbiAgICBpZiAocHJldldpbmRvdykge1xuICAgICAgcHJldldpbmRvdy5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMud2luZG93ID0gbmV3IFN1YmplY3Q8VD4oKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQod2luZG93KTtcblxuICAgIGNvbnN0IGNsb3NpbmdOb3RpZmllciA9IHRyeUNhdGNoKHRoaXMuY2xvc2luZ1NlbGVjdG9yKSgpO1xuICAgIGlmIChjbG9zaW5nTm90aWZpZXIgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICBjb25zdCBlcnIgPSBlcnJvck9iamVjdC5lO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgdGhpcy53aW5kb3cuZXJyb3IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGQodGhpcy5jbG9zaW5nTm90aWZpY2F0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgY2xvc2luZ05vdGlmaWVyKSk7XG4gICAgfVxuICB9XG59XG4iXX0=