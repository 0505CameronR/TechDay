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
/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * ![](bufferCount.png)
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * ## Examples
 *
 * Emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * On every click, emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2, 1));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
function bufferCount(bufferSize, startBufferEvery) {
    if (startBufferEvery === void 0) { startBufferEvery = null; }
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
exports.bufferCount = bufferCount;
var BufferCountOperator = /** @class */ (function () {
    function BufferCountOperator(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    BufferCountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    };
    return BufferCountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferCountSubscriber = /** @class */ (function (_super) {
    __extends(BufferCountSubscriber, _super);
    function BufferCountSubscriber(destination, bufferSize) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.buffer = [];
        return _this;
    }
    BufferCountSubscriber.prototype._next = function (value) {
        var buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    };
    BufferCountSubscriber.prototype._complete = function () {
        var buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        _super.prototype._complete.call(this);
    };
    return BufferCountSubscriber;
}(Subscriber_1.Subscriber));
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferSkipCountSubscriber = /** @class */ (function (_super) {
    __extends(BufferSkipCountSubscriber, _super);
    function BufferSkipCountSubscriber(destination, bufferSize, startBufferEvery) {
        var _this = _super.call(this, destination) || this;
        _this.bufferSize = bufferSize;
        _this.startBufferEvery = startBufferEvery;
        _this.buffers = [];
        _this.count = 0;
        return _this;
    }
    BufferSkipCountSubscriber.prototype._next = function (value) {
        var _a = this, bufferSize = _a.bufferSize, startBufferEvery = _a.startBufferEvery, buffers = _a.buffers, count = _a.count;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (var i = buffers.length; i--;) {
            var buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    };
    BufferSkipCountSubscriber.prototype._complete = function () {
        var _a = this, buffers = _a.buffers, destination = _a.destination;
        while (buffers.length > 0) {
            var buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        _super.prototype._complete.call(this);
    };
    return BufferSkipCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyQ291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyQ291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBSTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnREc7QUFDSCxTQUFnQixXQUFXLENBQUksVUFBa0IsRUFBRSxnQkFBK0I7SUFBL0IsaUNBQUEsRUFBQSx1QkFBK0I7SUFDaEYsT0FBTyxTQUFTLDJCQUEyQixDQUFDLE1BQXFCO1FBQy9ELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixDQUFJLFVBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELGtDQUlDO0FBRUQ7SUFHRSw2QkFBb0IsVUFBa0IsRUFBVSxnQkFBd0I7UUFBcEQsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBUTtRQUN0RSxJQUFJLENBQUMsZ0JBQWdCLElBQUksVUFBVSxLQUFLLGdCQUFnQixFQUFFO1lBQ3hELElBQUksQ0FBQyxlQUFlLEdBQUcscUJBQXFCLENBQUM7U0FDOUM7YUFBTTtZQUNMLElBQUksQ0FBQyxlQUFlLEdBQUcseUJBQXlCLENBQUM7U0FDbEQ7SUFDSCxDQUFDO0lBRUQsa0NBQUksR0FBSixVQUFLLFVBQTJCLEVBQUUsTUFBVztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFD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dCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIHVudGlsIHRoZSBzaXplIGhpdHMgdGhlIG1heGltdW1cbiAqIGBidWZmZXJTaXplYCBnaXZlbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29sbGVjdHMgdmFsdWVzIGZyb20gdGhlIHBhc3QgYXMgYW4gYXJyYXksIGFuZCBlbWl0c1xuICogdGhhdCBhcnJheSBvbmx5IHdoZW4gaXRzIHNpemUgcmVhY2hlcyBgYnVmZmVyU2l6ZWAuPC9zcGFuPlxuICpcbiAqICFbXShidWZmZXJDb3VudC5wbmcpXG4gKlxuICogQnVmZmVycyBhIG51bWJlciBvZiB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgYnkgYGJ1ZmZlclNpemVgIHRoZW5cbiAqIGVtaXRzIHRoZSBidWZmZXIgYW5kIGNsZWFycyBpdCwgYW5kIHN0YXJ0cyBhIG5ldyBidWZmZXIgZWFjaFxuICogYHN0YXJ0QnVmZmVyRXZlcnlgIHZhbHVlcy4gSWYgYHN0YXJ0QnVmZmVyRXZlcnlgIGlzIG5vdCBwcm92aWRlZCBvciBpc1xuICogYG51bGxgLCB0aGVuIG5ldyBidWZmZXJzIGFyZSBzdGFydGVkIGltbWVkaWF0ZWx5IGF0IHRoZSBzdGFydCBvZiB0aGUgc291cmNlXG4gKiBhbmQgd2hlbiBlYWNoIGJ1ZmZlciBjbG9zZXMgYW5kIGlzIGVtaXR0ZWQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBFbWl0IHRoZSBsYXN0IHR3byBjbGljayBldmVudHMgYXMgYW4gYXJyYXlcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJDb3VudCgyKSk7XG4gKiBidWZmZXJlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBPbiBldmVyeSBjbGljaywgZW1pdCB0aGUgbGFzdCB0d28gY2xpY2sgZXZlbnRzIGFzIGFuIGFycmF5XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyQ291bnQoMiwgMSkpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYnVmZmVyfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVGltZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKiBAc2VlIHtAbGluayBwYWlyd2lzZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd0NvdW50fVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBidWZmZXJTaXplIFRoZSBtYXhpbXVtIHNpemUgb2YgdGhlIGJ1ZmZlciBlbWl0dGVkLlxuICogQHBhcmFtIHtudW1iZXJ9IFtzdGFydEJ1ZmZlckV2ZXJ5XSBJbnRlcnZhbCBhdCB3aGljaCB0byBzdGFydCBhIG5ldyBidWZmZXIuXG4gKiBGb3IgZXhhbXBsZSBpZiBgc3RhcnRCdWZmZXJFdmVyeWAgaXMgYDJgLCB0aGVuIGEgbmV3IGJ1ZmZlciB3aWxsIGJlIHN0YXJ0ZWRcbiAqIG9uIGV2ZXJ5IG90aGVyIHZhbHVlIGZyb20gdGhlIHNvdXJjZS4gQSBuZXcgYnVmZmVyIGlzIHN0YXJ0ZWQgYXQgdGhlXG4gKiBiZWdpbm5pbmcgb2YgdGhlIHNvdXJjZSBieSBkZWZhdWx0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUW10+fSBBbiBPYnNlcnZhYmxlIG9mIGFycmF5cyBvZiBidWZmZXJlZCB2YWx1ZXMuXG4gKiBAbWV0aG9kIGJ1ZmZlckNvdW50XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyQ291bnQ8VD4oYnVmZmVyU2l6ZTogbnVtYmVyLCBzdGFydEJ1ZmZlckV2ZXJ5OiBudW1iZXIgPSBudWxsKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1ZmZlckNvdW50T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IEJ1ZmZlckNvdW50T3BlcmF0b3I8VD4oYnVmZmVyU2l6ZSwgc3RhcnRCdWZmZXJFdmVyeSkpO1xuICB9O1xufVxuXG5jbGFzcyBCdWZmZXJDb3VudE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG4gIHByaXZhdGUgc3Vic2NyaWJlckNsYXNzOiBhbnk7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBidWZmZXJTaXplOiBudW1iZXIsIHByaXZhdGUgc3RhcnRCdWZmZXJFdmVyeTogbnVtYmVyKSB7XG4gICAgaWYgKCFzdGFydEJ1ZmZlckV2ZXJ5IHx8IGJ1ZmZlclNpemUgPT09IHN0YXJ0QnVmZmVyRXZlcnkpIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlckNsYXNzID0gQnVmZmVyQ291bnRTdWJzY3JpYmVyO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJDbGFzcyA9IEJ1ZmZlclNraXBDb3VudFN1YnNjcmliZXI7XG4gICAgfVxuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IHRoaXMuc3Vic2NyaWJlckNsYXNzKHN1YnNjcmliZXIsIHRoaXMuYnVmZmVyU2l6ZSwgdGhpcy5zdGFydEJ1ZmZlckV2ZXJ5KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEJ1ZmZlckNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGJ1ZmZlcjogVFtdID0gW107XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPiwgcHJpdmF0ZSBidWZmZXJTaXplOiBudW1iZXIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcblxuICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcblxuICAgIGlmIChidWZmZXIubGVuZ3RoID09IHRoaXMuYnVmZmVyU2l6ZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICB9XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEJ1ZmZlclNraXBDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBidWZmZXJzOiBBcnJheTxUW10+ID0gW107XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPiwgcHJpdmF0ZSBidWZmZXJTaXplOiBudW1iZXIsIHByaXZhdGUgc3RhcnRCdWZmZXJFdmVyeTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgeyBidWZmZXJTaXplLCBzdGFydEJ1ZmZlckV2ZXJ5LCBidWZmZXJzLCBjb3VudCB9ID0gdGhpcztcblxuICAgIHRoaXMuY291bnQrKztcbiAgICBpZiAoY291bnQgJSBzdGFydEJ1ZmZlckV2ZXJ5ID09PSAwKSB7XG4gICAgICBidWZmZXJzLnB1c2goW10pO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSBidWZmZXJzLmxlbmd0aDsgaS0tOyApIHtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGJ1ZmZlcnNbaV07XG4gICAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PT0gYnVmZmVyU2l6ZSkge1xuICAgICAgICBidWZmZXJzLnNwbGljZShpLCAxKTtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCB7IGJ1ZmZlcnMsIGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuXG4gICAgd2hpbGUgKGJ1ZmZlcnMubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGJ1ZmZlciA9IGJ1ZmZlcnMuc2hpZnQoKTtcbiAgICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgICBkZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgICB9XG4gICAgfVxuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG5cbn1cbiJdfQ==