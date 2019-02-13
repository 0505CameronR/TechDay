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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * ![](window.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * Observable `windowBoundaries` emits an item. Because each window is an
 * Observable, the output is a higher-order Observable.
 *
 * ## Example
 * In every window of 1 second each, emit at most 2 click events
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const interval = interval(1000);
 * const result = clicks.pipe(
 *   window(interval),
 *   map(win => win.take(2)), // each window has at most 2 emissions
 *   mergeAll(),              // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param {Observable<any>} windowBoundaries An Observable that completes the
 * previous window and starts a new window.
 * @return {Observable<Observable<T>>} An Observable of windows, which are
 * Observables emitting values of the source Observable.
 * @method window
 * @owner Observable
 */
function window(windowBoundaries) {
    return function windowOperatorFunction(source) {
        return source.lift(new WindowOperator(windowBoundaries));
    };
}
exports.window = window;
var WindowOperator = /** @class */ (function () {
    function WindowOperator(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    WindowOperator.prototype.call = function (subscriber, source) {
        var windowSubscriber = new WindowSubscriber(subscriber);
        var sourceSubscription = source.subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(subscribeToResult_1.subscribeToResult(windowSubscriber, this.windowBoundaries));
        }
        return sourceSubscription;
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
    function WindowSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.window = new Subject_1.Subject();
        destination.next(_this.window);
        return _this;
    }
    WindowSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    };
    WindowSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    WindowSubscriber.prototype.notifyComplete = function (innerSub) {
        this._complete();
    };
    WindowSubscriber.prototype._next = function (value) {
        this.window.next(value);
    };
    WindowSubscriber.prototype._error = function (err) {
        this.window.error(err);
        this.destination.error(err);
    };
    WindowSubscriber.prototype._complete = function () {
        this.window.complete();
        this.destination.complete();
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    WindowSubscriber.prototype._unsubscribe = function () {
        this.window = null;
    };
    WindowSubscriber.prototype.openWindow = function () {
        var prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        var destination = this.destination;
        var newWindow = this.window = new Subject_1.Subject();
        destination.next(newWindow);
    };
    return WindowSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHNDQUFxQztBQUVyQyxzREFBcUQ7QUFFckQsK0RBQThEO0FBRzlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxTQUFnQixNQUFNLENBQUksZ0JBQWlDO0lBQ3pELE9BQU8sU0FBUyxzQkFBc0IsQ0FBQyxNQUFxQjtRQUMxRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQzNELENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCx3QkFJQztBQUVEO0lBRUUsd0JBQW9CLGdCQUFpQztRQUFqQyxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWlCO0lBQ3JELENBQUM7SUFFRCw2QkFBSSxHQUFKLFVBQUssVUFBcUMsRUFBRSxNQUFXO1FBQ3JELElBQU0sZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRCxJQUFNLGtCQUFrQixHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFO1lBQzlCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxxQ0FBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO1NBQ2xGO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQztJQUM1QixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFrQyxvQ0FBdUI7SUFJdkQsMEJBQVksV0FBc0M7UUFBbEQsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FFbkI7UUFMTyxZQUFNLEdBQWUsSUFBSSxpQkFBTyxFQUFLLENBQUM7UUFJNUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7O0lBQ2hDLENBQUM7SUFFRCxxQ0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWUsRUFDOUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUFpQztRQUMxQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELHNDQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBaUM7UUFDdkQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQseUNBQWMsR0FBZCxVQUFlLFFBQWlDO1FBQzlDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNuQixDQUFDO0lBRVMsZ0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxpQ0FBTSxHQUFoQixVQUFpQixHQUFRO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFUyxvQ0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLHVDQUFZLEdBQVo7UUFDRSxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztJQUNyQixDQUFDO0lBRU8scUNBQVUsR0FBbEI7UUFDRSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO1FBQ0QsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksaUJBQU8sRUFBSyxDQUFDO1FBQ2pELFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQW5ERCxDQUFrQyxpQ0FBZSxHQW1EaEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgd2hlbmV2ZXJcbiAqIGB3aW5kb3dCb3VuZGFyaWVzYCBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBidWZmZXJ9LCBidXQgZW1pdHMgYSBuZXN0ZWQgT2JzZXJ2YWJsZVxuICogaW5zdGVhZCBvZiBhbiBhcnJheS48L3NwYW4+XG4gKlxuICogIVtdKHdpbmRvdy5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyBjb25uZWN0ZWQsIG5vbi1vdmVybGFwcGluZ1xuICogd2luZG93cy4gSXQgZW1pdHMgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBvcGVucyBhIG5ldyBvbmUgd2hlbmV2ZXIgdGhlXG4gKiBPYnNlcnZhYmxlIGB3aW5kb3dCb3VuZGFyaWVzYCBlbWl0cyBhbiBpdGVtLiBCZWNhdXNlIGVhY2ggd2luZG93IGlzIGFuXG4gKiBPYnNlcnZhYmxlLCB0aGUgb3V0cHV0IGlzIGEgaGlnaGVyLW9yZGVyIE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogSW4gZXZlcnkgd2luZG93IG9mIDEgc2Vjb25kIGVhY2gsIGVtaXQgYXQgbW9zdCAyIGNsaWNrIGV2ZW50c1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGludGVydmFsID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShcbiAqICAgd2luZG93KGludGVydmFsKSxcbiAqICAgbWFwKHdpbiA9PiB3aW4udGFrZSgyKSksIC8vIGVhY2ggd2luZG93IGhhcyBhdCBtb3N0IDIgZW1pc3Npb25zXG4gKiAgIG1lcmdlQWxsKCksICAgICAgICAgICAgICAvLyBmbGF0dGVuIHRoZSBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgd2luZG93Q291bnR9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUaW1lfVxuICogQHNlZSB7QGxpbmsgd2luZG93VG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgd2luZG93V2hlbn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGU8YW55Pn0gd2luZG93Qm91bmRhcmllcyBBbiBPYnNlcnZhYmxlIHRoYXQgY29tcGxldGVzIHRoZVxuICogcHJldmlvdXMgd2luZG93IGFuZCBzdGFydHMgYSBuZXcgd2luZG93LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gT2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBhcmVcbiAqIE9ic2VydmFibGVzIGVtaXR0aW5nIHZhbHVlcyBvZiB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHdpbmRvd1xuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvdzxUPih3aW5kb3dCb3VuZGFyaWVzOiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdpbmRvd09wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBXaW5kb3dPcGVyYXRvcih3aW5kb3dCb3VuZGFyaWVzKSk7XG4gIH07XG59XG5cbmNsYXNzIFdpbmRvd09wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgT2JzZXJ2YWJsZTxUPj4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgd2luZG93Qm91bmRhcmllczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICBjb25zdCB3aW5kb3dTdWJzY3JpYmVyID0gbmV3IFdpbmRvd1N1YnNjcmliZXIoc3Vic2NyaWJlcik7XG4gICAgY29uc3Qgc291cmNlU3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZSh3aW5kb3dTdWJzY3JpYmVyKTtcbiAgICBpZiAoIXNvdXJjZVN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIHdpbmRvd1N1YnNjcmliZXIuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHdpbmRvd1N1YnNjcmliZXIsIHRoaXMud2luZG93Qm91bmRhcmllcykpO1xuICAgIH1cbiAgICByZXR1cm4gc291cmNlU3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaW5kb3dTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIGFueT4ge1xuXG4gIHByaXZhdGUgd2luZG93OiBTdWJqZWN0PFQ+ID0gbmV3IFN1YmplY3Q8VD4oKTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICBkZXN0aW5hdGlvbi5uZXh0KHRoaXMud2luZG93KTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMub3BlbldpbmRvdygpO1xuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSwgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5fY29tcGxldGUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMud2luZG93Lm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMud2luZG93LmVycm9yKGVycik7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMud2luZG93ID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgb3BlbldpbmRvdygpOiB2b2lkICB7XG4gICAgY29uc3QgcHJldldpbmRvdyA9IHRoaXMud2luZG93O1xuICAgIGlmIChwcmV2V2luZG93KSB7XG4gICAgICBwcmV2V2luZG93LmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBjb25zdCBuZXdXaW5kb3cgPSB0aGlzLndpbmRvdyA9IG5ldyBTdWJqZWN0PFQ+KCk7XG4gICAgZGVzdGluYXRpb24ubmV4dChuZXdXaW5kb3cpO1xuICB9XG59XG4iXX0=