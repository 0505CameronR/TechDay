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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93Q291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy93aW5kb3dDb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFFM0Msc0NBQXFDO0FBR3JDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdERztBQUNILFNBQWdCLFdBQVcsQ0FBSSxVQUFrQixFQUNsQixnQkFBNEI7SUFBNUIsaUNBQUEsRUFBQSxvQkFBNEI7SUFDekQsT0FBTyxTQUFTLDJCQUEyQixDQUFDLE1BQXFCO1FBQy9ELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixDQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUxELGtDQUtDO0FBRUQ7SUFFRSw2QkFBb0IsVUFBa0IsRUFDbEIsZ0JBQXdCO1FBRHhCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO0lBQzVDLENBQUM7SUFFRCxrQ0FBSSxHQUFKLFVBQUssVUFBcUMsRUFBRSxNQUFXO1FBQ3JELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHFCQUFxQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQVRELElBU0M7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LElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQXhERCxDQUF1Qyx1QkFBVSxHQXdEaEQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgd2l0aCBlYWNoXG4gKiBuZXN0ZWQgT2JzZXJ2YWJsZSBlbWl0dGluZyBhdCBtb3N0IGB3aW5kb3dTaXplYCB2YWx1ZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyQ291bnR9LCBidXQgZW1pdHMgYSBuZXN0ZWRcbiAqIE9ic2VydmFibGUgaW5zdGVhZCBvZiBhbiBhcnJheS48L3NwYW4+XG4gKlxuICogIVtdKHdpbmRvd0NvdW50LnBuZylcbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB3aW5kb3dzIG9mIGl0ZW1zIGl0IGNvbGxlY3RzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gVGhlIG91dHB1dCBPYnNlcnZhYmxlIGVtaXRzIHdpbmRvd3MgZXZlcnkgYHN0YXJ0V2luZG93RXZlcnlgXG4gKiBpdGVtcywgZWFjaCBjb250YWluaW5nIG5vIG1vcmUgdGhhbiBgd2luZG93U2l6ZWAgaXRlbXMuIFdoZW4gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBjb21wbGV0ZXMgb3IgZW5jb3VudGVycyBhbiBlcnJvciwgdGhlIG91dHB1dCBPYnNlcnZhYmxlIGVtaXRzXG4gKiB0aGUgY3VycmVudCB3aW5kb3cgYW5kIHByb3BhZ2F0ZXMgdGhlIG5vdGlmaWNhdGlvbiBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIElmIGBzdGFydFdpbmRvd0V2ZXJ5YCBpcyBub3QgcHJvdmlkZWQsIHRoZW4gbmV3IHdpbmRvd3MgYXJlXG4gKiBzdGFydGVkIGltbWVkaWF0ZWx5IGF0IHRoZSBzdGFydCBvZiB0aGUgc291cmNlIGFuZCB3aGVuIGVhY2ggd2luZG93IGNvbXBsZXRlc1xuICogd2l0aCBzaXplIGB3aW5kb3dTaXplYC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogSWdub3JlIGV2ZXJ5IDNyZCBjbGljayBldmVudCwgc3RhcnRpbmcgZnJvbSB0aGUgZmlyc3Qgb25lXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoXG4gKiAgIHdpbmRvd0NvdW50KDMpKSxcbiAqICAgbWFwKHdpbiA9PiB3aW4uc2tpcCgxKSksIC8vIHNraXAgZmlyc3Qgb2YgZXZlcnkgMyBjbGlja3NcbiAqICAgbWVyZ2VBbGwoKSwgICAgICAgICAgICAgIC8vIGZsYXR0ZW4gdGhlIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogSWdub3JlIGV2ZXJ5IDNyZCBjbGljayBldmVudCwgc3RhcnRpbmcgZnJvbSB0aGUgdGhpcmQgb25lXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoXG4gKiAgIHdpbmRvd0NvdW50KDIsIDMpLFxuICogICBtZXJnZUFsbCgpLCAgICAgICAgICAgICAgLy8gZmxhdHRlbiB0aGUgT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlc1xuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB3aW5kb3d9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUaW1lfVxuICogQHNlZSB7QGxpbmsgd2luZG93VG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgd2luZG93V2hlbn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSB3aW5kb3dTaXplIFRoZSBtYXhpbXVtIG51bWJlciBvZiB2YWx1ZXMgZW1pdHRlZCBieSBlYWNoXG4gKiB3aW5kb3cuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0V2luZG93RXZlcnldIEludGVydmFsIGF0IHdoaWNoIHRvIHN0YXJ0IGEgbmV3IHdpbmRvdy5cbiAqIEZvciBleGFtcGxlIGlmIGBzdGFydFdpbmRvd0V2ZXJ5YCBpcyBgMmAsIHRoZW4gYSBuZXcgd2luZG93IHdpbGwgYmUgc3RhcnRlZFxuICogb24gZXZlcnkgb3RoZXIgdmFsdWUgZnJvbSB0aGUgc291cmNlLiBBIG5ldyB3aW5kb3cgaXMgc3RhcnRlZCBhdCB0aGVcbiAqIGJlZ2lubmluZyBvZiB0aGUgc291cmNlIGJ5IGRlZmF1bHQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPE9ic2VydmFibGU8VD4+fSBBbiBPYnNlcnZhYmxlIG9mIHdpbmRvd3MsIHdoaWNoIGluIHR1cm5cbiAqIGFyZSBPYnNlcnZhYmxlIG9mIHZhbHVlcy5cbiAqIEBtZXRob2Qgd2luZG93Q291bnRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dDb3VudDxUPih3aW5kb3dTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnRXaW5kb3dFdmVyeTogbnVtYmVyID0gMCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgT2JzZXJ2YWJsZTxUPj4ge1xuICByZXR1cm4gZnVuY3Rpb24gd2luZG93Q291bnRPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgV2luZG93Q291bnRPcGVyYXRvcjxUPih3aW5kb3dTaXplLCBzdGFydFdpbmRvd0V2ZXJ5KSk7XG4gIH07XG59XG5cbmNsYXNzIFdpbmRvd0NvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBPYnNlcnZhYmxlPFQ+PiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3aW5kb3dTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc3RhcnRXaW5kb3dFdmVyeTogbnVtYmVyKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgV2luZG93Q291bnRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMud2luZG93U2l6ZSwgdGhpcy5zdGFydFdpbmRvd0V2ZXJ5KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFdpbmRvd0NvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHdpbmRvd3M6IFN1YmplY3Q8VD5bXSA9IFsgbmV3IFN1YmplY3Q8VD4oKSBdO1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB3aW5kb3dTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc3RhcnRXaW5kb3dFdmVyeTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGRlc3RpbmF0aW9uLm5leHQodGhpcy53aW5kb3dzWzBdKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGNvbnN0IHN0YXJ0V2luZG93RXZlcnkgPSAodGhpcy5zdGFydFdpbmRvd0V2ZXJ5ID4gMCkgPyB0aGlzLnN0YXJ0V2luZG93RXZlcnkgOiB0aGlzLndpbmRvd1NpemU7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGNvbnN0IHdpbmRvd1NpemUgPSB0aGlzLndpbmRvd1NpemU7XG4gICAgY29uc3Qgd2luZG93cyA9IHRoaXMud2luZG93cztcbiAgICBjb25zdCBsZW4gPSB3aW5kb3dzLmxlbmd0aDtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICF0aGlzLmNsb3NlZDsgaSsrKSB7XG4gICAgICB3aW5kb3dzW2ldLm5leHQodmFsdWUpO1xuICAgIH1cbiAgICBjb25zdCBjID0gdGhpcy5jb3VudCAtIHdpbmRvd1NpemUgKyAxO1xuICAgIGlmIChjID49IDAgJiYgYyAlIHN0YXJ0V2luZG93RXZlcnkgPT09IDAgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICB3aW5kb3dzLnNoaWZ0KCkuY29tcGxldGUoKTtcbiAgICB9XG4gICAgaWYgKCsrdGhpcy5jb3VudCAlIHN0YXJ0V2luZG93RXZlcnkgPT09IDAgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICBjb25zdCB3aW5kb3cgPSBuZXcgU3ViamVjdDxUPigpO1xuICAgICAgd2luZG93cy5wdXNoKHdpbmRvdyk7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHdpbmRvdyk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSkge1xuICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLndpbmRvd3M7XG4gICAgaWYgKHdpbmRvd3MpIHtcbiAgICAgIHdoaWxlICh3aW5kb3dzLmxlbmd0aCA+IDAgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgIHdpbmRvd3Muc2hpZnQoKS5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IHdpbmRvd3MgPSB0aGlzLndpbmRvd3M7XG4gICAgaWYgKHdpbmRvd3MpIHtcbiAgICAgIHdoaWxlICh3aW5kb3dzLmxlbmd0aCA+IDAgJiYgIXRoaXMuY2xvc2VkKSB7XG4gICAgICAgIHdpbmRvd3Muc2hpZnQoKS5jb21wbGV0ZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuY291bnQgPSAwO1xuICAgIHRoaXMud2luZG93cyA9IG51bGw7XG4gIH1cbn1cbiJdfQ==