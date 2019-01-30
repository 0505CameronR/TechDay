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
var Subject_1 = require("../Subject");
/**
 * Branch out the source Observable values as a nested Observable with each
 * nested Observable emitting at most `windowSize` values.
 *
 * <span class="informal">It's like {@link bufferCount}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowCount.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows every `startWindowEvery`
 * items, each containing no more than `windowSize` items. When the source
 * Observable completes or encounters an error, the output Observable emits
 * the current window and propagates the notification from the source
 * Observable. If `startWindowEvery` is not provided, then new windows are
 * started immediately at the start of the source and when each window completes
 * with size `windowSize`.
 *
 * ## Examples
 * Ignore every 3rd click event, starting from the first one
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   windowCount(3)),
 *   map(win => win.skip(1)), // skip first of every 3 clicks
 *   mergeAll(),              // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * Ignore every 3rd click event, starting from the third one
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   windowCount(2, 3),
 *   mergeAll(),              // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link bufferCount}
 *
 * @param {number} windowSize The maximum number of values emitted by each
 * window.
 * @param {number} [startWindowEvery] Interval at which to start a new window.
 * For example if `startWindowEvery` is `2`, then a new window will be started
 * on every other value from the source. A new window is started at the
 * beginning of the source by default.
 * @return {Observable<Observable<T>>} An Observable of windows, which in turn
 * are Observable of values.
 * @method windowCount
 * @owner Observable
 */
function windowCount(windowSize, startWindowEvery) {
    if (startWindowEvery === void 0) { startWindowEvery = 0; }
    return function windowCountOperatorFunction(source) {
        return source.lift(new WindowCountOperator(windowSize, startWindowEvery));
    };
}
exports.windowCount = windowCount;
var WindowCountOperator = /** @class */ (function () {
    function WindowCountOperator(windowSize, startWindowEvery) {
        this.windowSize = windowSize;
        this.startWindowEvery = startWindowEvery;
    }
    WindowCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WindowCountSubscriber(subscriber, this.windowSize, this.startWindowEvery));
    };
    return WindowCountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WindowCountSubscriber = /** @class */ (function (_super) {
    __extends(WindowCountSubscriber, _super);
    function WindowCountSubscriber(destination, windowSize, startWindowEvery) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.windowSize = windowSize;
        _this.startWindowEvery = startWindowEvery;
        _this.windows = [new Subject_1.Subject()];
        _this.count = 0;
        destination.next(_this.windows[0]);
        return _this;
    }
    WindowCountSubscriber.prototype._next = function (value) {
        var startWindowEvery = (this.startWindowEvery > 0) ? this.startWindowEvery : this.windowSize;
        var destination = this.destination;
        var windowSize = this.windowSize;
        var windows = this.windows;
        var len = windows.length;
        for (var i = 0; i < len && !this.closed; i++) {
            windows[i].next(value);
        }
        var c = this.count - windowSize + 1;
        if (c >= 0 && c % startWindowEvery === 0 && !this.closed) {
            windows.shift().complete();
        }
        if (++this.count % startWindowEvery === 0 && !this.closed) {
            var window_1 = new Subject_1.Subject();
            windows.push(window_1);
            destination.next(window_1);
        }
    };
    WindowCountSubscriber.prototype._error = function (err) {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().error(err);
            }
        }
        this.destination.error(err);
    };
    WindowCountSubscriber.prototype._complete = function () {
        var windows = this.windows;
        if (windows) {
            while (windows.length > 0 && !this.closed) {
                windows.shift().complete();
            }
        }
        this.destination.complete();
    };
    WindowCountSubscriber.prototype._unsubscribe = function () {
        this.count = 0;
        this.windows = null;
    };
    return WindowCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93Q291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvd2luZG93Q291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBRTNDLHNDQUFxQztBQUdyQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3REc7QUFDSCxTQUFnQixXQUFXLENBQUksVUFBa0IsRUFDbEIsZ0JBQTRCO0lBQTVCLGlDQUFBLEVBQUEsb0JBQTRCO0lBQ3pELE9BQU8sU0FBUywyQkFBMkIsQ0FBQyxNQUFxQjtRQUMvRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNKLENBQUM7QUFMRCxrQ0FLQztBQUVEO0lBRUUsNkJBQW9CLFVBQWtCLEVBQ2xCLGdCQUF3QjtRQUR4QixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtJQUM1QyxDQUFDO0lBRUQsa0NBQUksR0FBSixVQUFLLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFURCxJQVNDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXVDLHlDQUFhO0lBSWxELCtCQUFzQixXQUFzQyxFQUN4QyxVQUFrQixFQUNsQixnQkFBd0I7UUFG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SUFDSCw0QkFBQztBQUFELENBQUMsQUF4REQsQ0FBdUMsdUJBQVUsR0F3RGhEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJyYW5jaCBvdXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBhcyBhIG5lc3RlZCBPYnNlcnZhYmxlIHdpdGggZWFjaFxuICogbmVzdGVkIE9ic2VydmFibGUgZW1pdHRpbmcgYXQgbW9zdCBgd2luZG93U2l6ZWAgdmFsdWVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIGJ1ZmZlckNvdW50fSwgYnV0IGVtaXRzIGEgbmVzdGVkXG4gKiBPYnNlcnZhYmxlIGluc3RlYWQgb2YgYW4gYXJyYXkuPC9zcGFuPlxuICpcbiAqICFbXSh3aW5kb3dDb3VudC5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyB3aW5kb3dzIGV2ZXJ5IGBzdGFydFdpbmRvd0V2ZXJ5YFxuICogaXRlbXMsIGVhY2ggY29udGFpbmluZyBubyBtb3JlIHRoYW4gYHdpbmRvd1NpemVgIGl0ZW1zLiBXaGVuIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgY29tcGxldGVzIG9yIGVuY291bnRlcnMgYW4gZXJyb3IsIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0c1xuICogdGhlIGN1cnJlbnQgd2luZG93IGFuZCBwcm9wYWdhdGVzIHRoZSBub3RpZmljYXRpb24gZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBJZiBgc3RhcnRXaW5kb3dFdmVyeWAgaXMgbm90IHByb3ZpZGVkLCB0aGVuIG5ldyB3aW5kb3dzIGFyZVxuICogc3RhcnRlZCBpbW1lZGlhdGVseSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNvdXJjZSBhbmQgd2hlbiBlYWNoIHdpbmRvdyBjb21wbGV0ZXNcbiAqIHdpdGggc2l6ZSBgd2luZG93U2l6ZWAuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIElnbm9yZSBldmVyeSAzcmQgY2xpY2sgZXZlbnQsIHN0YXJ0aW5nIGZyb20gdGhlIGZpcnN0IG9uZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKFxuICogICB3aW5kb3dDb3VudCgzKSksXG4gKiAgIG1hcCh3aW4gPT4gd2luLnNraXAoMSkpLCAvLyBza2lwIGZpcnN0IG9mIGV2ZXJ5IDMgY2xpY2tzXG4gKiAgIG1lcmdlQWxsKCksICAgICAgICAgICAgICAvLyBmbGF0dGVuIHRoZSBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIElnbm9yZSBldmVyeSAzcmQgY2xpY2sgZXZlbnQsIHN0YXJ0aW5nIGZyb20gdGhlIHRoaXJkIG9uZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKFxuICogICB3aW5kb3dDb3VudCgyLCAzKSxcbiAqICAgbWVyZ2VBbGwoKSwgICAgICAgICAgICAgIC8vIGZsYXR0ZW4gdGhlIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgd2luZG93fVxuICogQHNlZSB7QGxpbmsgd2luZG93VGltZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1doZW59XG4gKiBAc2VlIHtAbGluayBidWZmZXJDb3VudH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gd2luZG93U2l6ZSBUaGUgbWF4aW11bSBudW1iZXIgb2YgdmFsdWVzIGVtaXR0ZWQgYnkgZWFjaFxuICogd2luZG93LlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydFdpbmRvd0V2ZXJ5XSBJbnRlcnZhbCBhdCB3aGljaCB0byBzdGFydCBhIG5ldyB3aW5kb3cuXG4gKiBGb3IgZXhhbXBsZSBpZiBgc3RhcnRXaW5kb3dFdmVyeWAgaXMgYDJgLCB0aGVuIGEgbmV3IHdpbmRvdyB3aWxsIGJlIHN0YXJ0ZWRcbiAqIG9uIGV2ZXJ5IG90aGVyIHZhbHVlIGZyb20gdGhlIHNvdXJjZS4gQSBuZXcgd2luZG93IGlzIHN0YXJ0ZWQgYXQgdGhlXG4gKiBiZWdpbm5pbmcgb2YgdGhlIHNvdXJjZSBieSBkZWZhdWx0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gT2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBpbiB0dXJuXG4gKiBhcmUgT2JzZXJ2YWJsZSBvZiB2YWx1ZXMuXG4gKiBAbWV0aG9kIHdpbmRvd0NvdW50XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2luZG93Q291bnQ8VD4od2luZG93U2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0V2luZG93RXZlcnk6IG51bWJlciA9IDApOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdpbmRvd0NvdW50T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFdpbmRvd0NvdW50T3BlcmF0b3I8VD4od2luZG93U2l6ZSwgc3RhcnRXaW5kb3dFdmVyeSkpO1xuICB9O1xufVxuXG5jbGFzcyBXaW5kb3dDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgT2JzZXJ2YWJsZTxUPj4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgd2luZG93U2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHN0YXJ0V2luZG93RXZlcnk6IG51bWJlcikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFdpbmRvd0NvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLndpbmRvd1NpemUsIHRoaXMuc3RhcnRXaW5kb3dFdmVyeSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaW5kb3dDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSB3aW5kb3dzOiBTdWJqZWN0PFQ+W10gPSBbIG5ldyBTdWJqZWN0PFQ+KCkgXTtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb246IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgd2luZG93U2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHN0YXJ0V2luZG93RXZlcnk6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICBkZXN0aW5hdGlvbi5uZXh0KHRoaXMud2luZG93c1swXSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBjb25zdCBzdGFydFdpbmRvd0V2ZXJ5ID0gKHRoaXMuc3RhcnRXaW5kb3dFdmVyeSA+IDApID8gdGhpcy5zdGFydFdpbmRvd0V2ZXJ5IDogdGhpcy53aW5kb3dTaXplO1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBjb25zdCB3aW5kb3dTaXplID0gdGhpcy53aW5kb3dTaXplO1xuICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLndpbmRvd3M7XG4gICAgY29uc3QgbGVuID0gd2luZG93cy5sZW5ndGg7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhdGhpcy5jbG9zZWQ7IGkrKykge1xuICAgICAgd2luZG93c1tpXS5uZXh0KHZhbHVlKTtcbiAgICB9XG4gICAgY29uc3QgYyA9IHRoaXMuY291bnQgLSB3aW5kb3dTaXplICsgMTtcbiAgICBpZiAoYyA+PSAwICYmIGMgJSBzdGFydFdpbmRvd0V2ZXJ5ID09PSAwICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgd2luZG93cy5zaGlmdCgpLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIGlmICgrK3RoaXMuY291bnQgJSBzdGFydFdpbmRvd0V2ZXJ5ID09PSAwICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgY29uc3Qgd2luZG93ID0gbmV3IFN1YmplY3Q8VD4oKTtcbiAgICAgIHdpbmRvd3MucHVzaCh3aW5kb3cpO1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh3aW5kb3cpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCB3aW5kb3dzID0gdGhpcy53aW5kb3dzO1xuICAgIGlmICh3aW5kb3dzKSB7XG4gICAgICB3aGlsZSAod2luZG93cy5sZW5ndGggPiAwICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgICB3aW5kb3dzLnNoaWZ0KCkuZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCB3aW5kb3dzID0gdGhpcy53aW5kb3dzO1xuICAgIGlmICh3aW5kb3dzKSB7XG4gICAgICB3aGlsZSAod2luZG93cy5sZW5ndGggPiAwICYmICF0aGlzLmNsb3NlZCkge1xuICAgICAgICB3aW5kb3dzLnNoaWZ0KCkuY29tcGxldGUoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLndpbmRvd3MgPSBudWxsO1xuICB9XG59XG4iXX0=