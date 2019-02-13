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
var async_1 = require("../scheduler/async");
var Subscriber_1 = require("../Subscriber");
var isScheduler_1 = require("../util/isScheduler");
/* tslint:enable:max-line-length */
/**
 * Buffers the source Observable values for a specific time period.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * those arrays periodically in time.</span>
 *
 * ![](bufferTime.png)
 *
 * Buffers values from the source for a specific time duration `bufferTimeSpan`.
 * Unless the optional argument `bufferCreationInterval` is given, it emits and
 * resets the buffer every `bufferTimeSpan` milliseconds. If
 * `bufferCreationInterval` is given, this operator opens the buffer every
 * `bufferCreationInterval` milliseconds and closes (emits and resets) the
 * buffer every `bufferTimeSpan` milliseconds. When the optional argument
 * `maxBufferSize` is specified, the buffer will be closed either after
 * `bufferTimeSpan` milliseconds or when it contains `maxBufferSize` elements.
 *
 * ## Examples
 *
 * Every second, emit an array of the recent click events
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferTime(1000));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * Every 5 seconds, emit the click events from the next 2 seconds
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferTime(2000, 5000));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link windowTime}
 *
 * @param {number} bufferTimeSpan The amount of time to fill each buffer array.
 * @param {number} [bufferCreationInterval] The interval at which to start new
 * buffers.
 * @param {number} [maxBufferSize] The maximum buffer size.
 * @param {SchedulerLike} [scheduler=async] The scheduler on which to schedule the
 * intervals that determine buffer boundaries.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferTime
 * @owner Observable
 */
function bufferTime(bufferTimeSpan) {
    var length = arguments.length;
    var scheduler = async_1.async;
    if (isScheduler_1.isScheduler(arguments[arguments.length - 1])) {
        scheduler = arguments[arguments.length - 1];
        length--;
    }
    var bufferCreationInterval = null;
    if (length >= 2) {
        bufferCreationInterval = arguments[1];
    }
    var maxBufferSize = Number.POSITIVE_INFINITY;
    if (length >= 3) {
        maxBufferSize = arguments[2];
    }
    return function bufferTimeOperatorFunction(source) {
        return source.lift(new BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler));
    };
}
exports.bufferTime = bufferTime;
var BufferTimeOperator = /** @class */ (function () {
    function BufferTimeOperator(bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        this.bufferTimeSpan = bufferTimeSpan;
        this.bufferCreationInterval = bufferCreationInterval;
        this.maxBufferSize = maxBufferSize;
        this.scheduler = scheduler;
    }
    BufferTimeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new BufferTimeSubscriber(subscriber, this.bufferTimeSpan, this.bufferCreationInterval, this.maxBufferSize, this.scheduler));
    };
    return BufferTimeOperator;
}());
var Context = /** @class */ (function () {
    function Context() {
        this.buffer = [];
    }
    return Context;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var BufferTimeSubscriber = /** @class */ (function (_super) {
    __extends(BufferTimeSubscriber, _super);
    function BufferTimeSubscriber(destination, bufferTimeSpan, bufferCreationInterval, maxBufferSize, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.bufferTimeSpan = bufferTimeSpan;
        _this.bufferCreationInterval = bufferCreationInterval;
        _this.maxBufferSize = maxBufferSize;
        _this.scheduler = scheduler;
        _this.contexts = [];
        var context = _this.openContext();
        _this.timespanOnly = bufferCreationInterval == null || bufferCreationInterval < 0;
        if (_this.timespanOnly) {
            var timeSpanOnlyState = { subscriber: _this, context: context, bufferTimeSpan: bufferTimeSpan };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
        else {
            var closeState = { subscriber: _this, context: context };
            var creationState = { bufferTimeSpan: bufferTimeSpan, bufferCreationInterval: bufferCreationInterval, subscriber: _this, scheduler: scheduler };
            _this.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, closeState));
            _this.add(scheduler.schedule(dispatchBufferCreation, bufferCreationInterval, creationState));
        }
        return _this;
    }
    BufferTimeSubscriber.prototype._next = function (value) {
        var contexts = this.contexts;
        var len = contexts.length;
        var filledBufferContext;
        for (var i = 0; i < len; i++) {
            var context = contexts[i];
            var buffer = context.buffer;
            buffer.push(value);
            if (buffer.length == this.maxBufferSize) {
                filledBufferContext = context;
            }
        }
        if (filledBufferContext) {
            this.onBufferFull(filledBufferContext);
        }
    };
    BufferTimeSubscriber.prototype._error = function (err) {
        this.contexts.length = 0;
        _super.prototype._error.call(this, err);
    };
    BufferTimeSubscriber.prototype._complete = function () {
        var _a = this, contexts = _a.contexts, destination = _a.destination;
        while (contexts.length > 0) {
            var context = contexts.shift();
            destination.next(context.buffer);
        }
        _super.prototype._complete.call(this);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    BufferTimeSubscriber.prototype._unsubscribe = function () {
        this.contexts = null;
    };
    BufferTimeSubscriber.prototype.onBufferFull = function (context) {
        this.closeContext(context);
        var closeAction = context.closeAction;
        closeAction.unsubscribe();
        this.remove(closeAction);
        if (!this.closed && this.timespanOnly) {
            context = this.openContext();
            var bufferTimeSpan = this.bufferTimeSpan;
            var timeSpanOnlyState = { subscriber: this, context: context, bufferTimeSpan: bufferTimeSpan };
            this.add(context.closeAction = this.scheduler.schedule(dispatchBufferTimeSpanOnly, bufferTimeSpan, timeSpanOnlyState));
        }
    };
    BufferTimeSubscriber.prototype.openContext = function () {
        var context = new Context();
        this.contexts.push(context);
        return context;
    };
    BufferTimeSubscriber.prototype.closeContext = function (context) {
        this.destination.next(context.buffer);
        var contexts = this.contexts;
        var spliceIndex = contexts ? contexts.indexOf(context) : -1;
        if (spliceIndex >= 0) {
            contexts.splice(contexts.indexOf(context), 1);
        }
    };
    return BufferTimeSubscriber;
}(Subscriber_1.Subscriber));
function dispatchBufferTimeSpanOnly(state) {
    var subscriber = state.subscriber;
    var prevContext = state.context;
    if (prevContext) {
        subscriber.closeContext(prevContext);
    }
    if (!subscriber.closed) {
        state.context = subscriber.openContext();
        state.context.closeAction = this.schedule(state, state.bufferTimeSpan);
    }
}
function dispatchBufferCreation(state) {
    var bufferCreationInterval = state.bufferCreationInterval, bufferTimeSpan = state.bufferTimeSpan, subscriber = state.subscriber, scheduler = state.scheduler;
    var context = subscriber.openContext();
    var action = this;
    if (!subscriber.closed) {
        subscriber.add(context.closeAction = scheduler.schedule(dispatchBufferClose, bufferTimeSpan, { subscriber: subscriber, context: context }));
        action.schedule(state, bufferCreationInterval);
    }
}
function dispatchBufferClose(arg) {
    var subscriber = arg.subscriber, context = arg.context;
    subscriber.closeContext(context);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyVGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2J1ZmZlclRpbWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBRTNDLDRDQUEyQztBQUUzQyxtREFBa0Q7QUFPbEQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtERztBQUNILFNBQWdCLFVBQVUsQ0FBSSxjQUFzQjtJQUNsRCxJQUFJLE1BQU0sR0FBVyxTQUFTLENBQUMsTUFBTSxDQUFDO0lBRXRDLElBQUksU0FBUyxHQUFrQixhQUFLLENBQUM7SUFDckMsSUFBSSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDaEQsU0FBUyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQzVDLE1BQU0sRUFBRSxDQUFDO0tBQ1Y7SUFFRCxJQUFJLHNCQUFzQixHQUFXLElBQUksQ0FBQztJQUMxQyxJQUFJLE1BQU0sSUFBSSxDQUFDLEVBQUU7UUFDZixzQkFBc0IsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdkM7SUFFRCxJQUFJLGFBQWEsR0FBVyxNQUFNLENBQUMsaUJBQWlCLENBQUM7SUFDckQsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2YsYUFBYSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUM5QjtJ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QSwyQkFBVSxFQUFFLHFCQUFPLENBQVM7SUFDcEMsVUFBVSxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVGltZTxUPihidWZmZXJUaW1lU3BhbjogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRpbWU8VD4oYnVmZmVyVGltZVNwYW46IG51bWJlciwgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbDogbnVtYmVyIHwgbnVsbCB8IHVuZGVmaW5lZCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUaW1lPFQ+KGJ1ZmZlclRpbWVTcGFuOiBudW1iZXIsIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWw6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsIG1heEJ1ZmZlclNpemU6IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGZvciBhIHNwZWNpZmljIHRpbWUgcGVyaW9kLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db2xsZWN0cyB2YWx1ZXMgZnJvbSB0aGUgcGFzdCBhcyBhbiBhcnJheSwgYW5kIGVtaXRzXG4gKiB0aG9zZSBhcnJheXMgcGVyaW9kaWNhbGx5IGluIHRpbWUuPC9zcGFuPlxuICpcbiAqICFbXShidWZmZXJUaW1lLnBuZylcbiAqXG4gKiBCdWZmZXJzIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgZm9yIGEgc3BlY2lmaWMgdGltZSBkdXJhdGlvbiBgYnVmZmVyVGltZVNwYW5gLlxuICogVW5sZXNzIHRoZSBvcHRpb25hbCBhcmd1bWVudCBgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbGAgaXMgZ2l2ZW4sIGl0IGVtaXRzIGFuZFxuICogcmVzZXRzIHRoZSBidWZmZXIgZXZlcnkgYGJ1ZmZlclRpbWVTcGFuYCBtaWxsaXNlY29uZHMuIElmXG4gKiBgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbGAgaXMgZ2l2ZW4sIHRoaXMgb3BlcmF0b3Igb3BlbnMgdGhlIGJ1ZmZlciBldmVyeVxuICogYGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWxgIG1pbGxpc2Vjb25kcyBhbmQgY2xvc2VzIChlbWl0cyBhbmQgcmVzZXRzKSB0aGVcbiAqIGJ1ZmZlciBldmVyeSBgYnVmZmVyVGltZVNwYW5gIG1pbGxpc2Vjb25kcy4gV2hlbiB0aGUgb3B0aW9uYWwgYXJndW1lbnRcbiAqIGBtYXhCdWZmZXJTaXplYCBpcyBzcGVjaWZpZWQsIHRoZSBidWZmZXIgd2lsbCBiZSBjbG9zZWQgZWl0aGVyIGFmdGVyXG4gKiBgYnVmZmVyVGltZVNwYW5gIG1pbGxpc2Vjb25kcyBvciB3aGVuIGl0IGNvbnRhaW5zIGBtYXhCdWZmZXJTaXplYCBlbGVtZW50cy5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqIEV2ZXJ5IHNlY29uZCwgZW1pdCBhbiBhcnJheSBvZiB0aGUgcmVjZW50IGNsaWNrIGV2ZW50c1xuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBidWZmZXJlZCA9IGNsaWNrcy5waXBlKGJ1ZmZlclRpbWUoMTAwMCkpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogRXZlcnkgNSBzZWNvbmRzLCBlbWl0IHRoZSBjbGljayBldmVudHMgZnJvbSB0aGUgbmV4dCAyIHNlY29uZHNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJUaW1lKDIwMDAsIDUwMDApKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RpbWV9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGJ1ZmZlclRpbWVTcGFuIFRoZSBhbW91bnQgb2YgdGltZSB0byBmaWxsIGVhY2ggYnVmZmVyIGFycmF5LlxuICogQHBhcmFtIHtudW1iZXJ9IFtidWZmZXJDcmVhdGlvbkludGVydmFsXSBUaGUgaW50ZXJ2YWwgYXQgd2hpY2ggdG8gc3RhcnQgbmV3XG4gKiBidWZmZXJzLlxuICogQHBhcmFtIHtudW1iZXJ9IFttYXhCdWZmZXJTaXplXSBUaGUgbWF4aW11bSBidWZmZXIgc2l6ZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1hc3luY10gVGhlIHNjaGVkdWxlciBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGVcbiAqIGludGVydmFscyB0aGF0IGRldGVybWluZSBidWZmZXIgYm91bmRhcmllcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gb2JzZXJ2YWJsZSBvZiBhcnJheXMgb2YgYnVmZmVyZWQgdmFsdWVzLlxuICogQG1ldGhvZCBidWZmZXJUaW1lXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVGltZTxUPihidWZmZXJUaW1lU3BhbjogbnVtYmVyKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgbGV0IGxlbmd0aDogbnVtYmVyID0gYXJndW1lbnRzLmxlbmd0aDtcblxuICBsZXQgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmM7XG4gIGlmIChpc1NjaGVkdWxlcihhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdKSkge1xuICAgIHNjaGVkdWxlciA9IGFyZ3VtZW50c1thcmd1bWVudHMubGVuZ3RoIC0gMV07XG4gICAgbGVuZ3RoLS07XG4gIH1cblxuICBsZXQgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbDogbnVtYmVyID0gbnVsbDtcbiAgaWYgKGxlbmd0aCA+PSAyKSB7XG4gICAgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCA9IGFyZ3VtZW50c1sxXTtcbiAgfVxuXG4gIGxldCBtYXhCdWZmZXJTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFk7XG4gIGlmIChsZW5ndGggPj0gMykge1xuICAgIG1heEJ1ZmZlclNpemUgPSBhcmd1bWVudHNbMl07XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gYnVmZmVyVGltZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJUaW1lT3BlcmF0b3I8VD4oYnVmZmVyVGltZVNwYW4sIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwsIG1heEJ1ZmZlclNpemUsIHNjaGVkdWxlcikpO1xuICB9O1xufVxuXG5jbGFzcyBCdWZmZXJUaW1lT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUW10+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBidWZmZXJUaW1lU3BhbjogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWw6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtYXhCdWZmZXJTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VFtdPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBCdWZmZXJUaW1lU3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMuYnVmZmVyVGltZVNwYW4sIHRoaXMuYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCwgdGhpcy5tYXhCdWZmZXJTaXplLCB0aGlzLnNjaGVkdWxlclxuICAgICkpO1xuICB9XG59XG5cbmNsYXNzIENvbnRleHQ8VD4ge1xuICBidWZmZXI6IFRbXSA9IFtdO1xuICBjbG9zZUFjdGlvbjogU3Vic2NyaXB0aW9uO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hDcmVhdGVBcmc8VD4ge1xuICBidWZmZXJUaW1lU3BhbjogbnVtYmVyO1xuICBidWZmZXJDcmVhdGlvbkludGVydmFsOiBudW1iZXI7XG4gIHN1YnNjcmliZXI6IEJ1ZmZlclRpbWVTdWJzY3JpYmVyPFQ+O1xuICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2U7XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaENsb3NlQXJnPFQ+IHtcbiAgc3Vic2NyaWJlcjogQnVmZmVyVGltZVN1YnNjcmliZXI8VD47XG4gIGNvbnRleHQ6IENvbnRleHQ8VD47XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJUaW1lU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGNvbnRleHRzOiBBcnJheTxDb250ZXh0PFQ+PiA9IFtdO1xuICBwcml2YXRlIHRpbWVzcGFuT25seTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUW10+LFxuICAgICAgICAgICAgICBwcml2YXRlIGJ1ZmZlclRpbWVTcGFuOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIG1heEJ1ZmZlclNpemU6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXMub3BlbkNvbnRleHQoKTtcbiAgICB0aGlzLnRpbWVzcGFuT25seSA9IGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwgPT0gbnVsbCB8fCBidWZmZXJDcmVhdGlvbkludGVydmFsIDwgMDtcbiAgICBpZiAodGhpcy50aW1lc3Bhbk9ubHkpIHtcbiAgICAgIGNvbnN0IHRpbWVTcGFuT25seVN0YXRlID0geyBzdWJzY3JpYmVyOiB0aGlzLCBjb250ZXh0LCBidWZmZXJUaW1lU3BhbiB9O1xuICAgICAgdGhpcy5hZGQoY29udGV4dC5jbG9zZUFjdGlvbiA9IHNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaEJ1ZmZlclRpbWVTcGFuT25seSwgYnVmZmVyVGltZVNwYW4sIHRpbWVTcGFuT25seVN0YXRlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGNsb3NlU3RhdGUgPSB7IHN1YnNjcmliZXI6IHRoaXMsIGNvbnRleHQgfTtcbiAgICAgIGNvbnN0IGNyZWF0aW9uU3RhdGU6IERpc3BhdGNoQ3JlYXRlQXJnPFQ+ID0geyBidWZmZXJUaW1lU3BhbiwgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCwgc3Vic2NyaWJlcjogdGhpcywgc2NoZWR1bGVyIH07XG4gICAgICB0aGlzLmFkZChjb250ZXh0LmNsb3NlQWN0aW9uID0gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoQ2xvc2VBcmc8VD4+KGRpc3BhdGNoQnVmZmVyQ2xvc2UsIGJ1ZmZlclRpbWVTcGFuLCBjbG9zZVN0YXRlKSk7XG4gICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hDcmVhdGVBcmc8VD4+KGRpc3BhdGNoQnVmZmVyQ3JlYXRpb24sIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwsIGNyZWF0aW9uU3RhdGUpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG4gICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgIGxldCBmaWxsZWRCdWZmZXJDb250ZXh0OiBDb250ZXh0PFQ+O1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpXTtcbiAgICAgIGNvbnN0IGJ1ZmZlciA9IGNvbnRleHQuYnVmZmVyO1xuICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPT0gdGhpcy5tYXhCdWZmZXJTaXplKSB7XG4gICAgICAgIGZpbGxlZEJ1ZmZlckNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmaWxsZWRCdWZmZXJDb250ZXh0KSB7XG4gICAgICB0aGlzLm9uQnVmZmVyRnVsbChmaWxsZWRCdWZmZXJDb250ZXh0KTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KSB7XG4gICAgdGhpcy5jb250ZXh0cy5sZW5ndGggPSAwO1xuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCB7IGNvbnRleHRzLCBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICB3aGlsZSAoY29udGV4dHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRzLnNoaWZ0KCk7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KGNvbnRleHQuYnVmZmVyKTtcbiAgICB9XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmNvbnRleHRzID0gbnVsbDtcbiAgfVxuXG4gIHByb3RlY3RlZCBvbkJ1ZmZlckZ1bGwoY29udGV4dDogQ29udGV4dDxUPikge1xuICAgIHRoaXMuY2xvc2VDb250ZXh0KGNvbnRleHQpO1xuICAgIGNvbnN0IGNsb3NlQWN0aW9uID0gY29udGV4dC5jbG9zZUFjdGlvbjtcbiAgICBjbG9zZUFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMucmVtb3ZlKGNsb3NlQWN0aW9uKTtcblxuICAgIGlmICghdGhpcy5jbG9zZWQgJiYgdGhpcy50aW1lc3Bhbk9ubHkpIHtcbiAgICAgIGNvbnRleHQgPSB0aGlzLm9wZW5Db250ZXh0KCk7XG4gICAgICBjb25zdCBidWZmZXJUaW1lU3BhbiA9IHRoaXMuYnVmZmVyVGltZVNwYW47XG4gICAgICBjb25zdCB0aW1lU3Bhbk9ubHlTdGF0ZSA9IHsgc3Vic2NyaWJlcjogdGhpcywgY29udGV4dCwgYnVmZmVyVGltZVNwYW4gfTtcbiAgICAgIHRoaXMuYWRkKGNvbnRleHQuY2xvc2VBY3Rpb24gPSB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZShkaXNwYXRjaEJ1ZmZlclRpbWVTcGFuT25seSwgYnVmZmVyVGltZVNwYW4sIHRpbWVTcGFuT25seVN0YXRlKSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbkNvbnRleHQoKTogQ29udGV4dDxUPiB7XG4gICAgY29uc3QgY29udGV4dDogQ29udGV4dDxUPiA9IG5ldyBDb250ZXh0PFQ+KCk7XG4gICAgdGhpcy5jb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuICAgIHJldHVybiBjb250ZXh0O1xuICB9XG5cbiAgY2xvc2VDb250ZXh0KGNvbnRleHQ6IENvbnRleHQ8VD4pIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoY29udGV4dC5idWZmZXIpO1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcblxuICAgIGNvbnN0IHNwbGljZUluZGV4ID0gY29udGV4dHMgPyBjb250ZXh0cy5pbmRleE9mKGNvbnRleHQpIDogLTE7XG4gICAgaWYgKHNwbGljZUluZGV4ID49IDApIHtcbiAgICAgIGNvbnRleHRzLnNwbGljZShjb250ZXh0cy5pbmRleE9mKGNvbnRleHQpLCAxKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hCdWZmZXJUaW1lU3Bhbk9ubHkodGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sIHN0YXRlOiBhbnkpIHtcbiAgY29uc3Qgc3Vic2NyaWJlcjogQnVmZmVyVGltZVN1YnNjcmliZXI8YW55PiA9IHN0YXRlLnN1YnNjcmliZXI7XG5cbiAgY29uc3QgcHJldkNvbnRleHQgPSBzdGF0ZS5jb250ZXh0O1xuICBpZiAocHJldkNvbnRleHQpIHtcbiAgICBzdWJzY3JpYmVyLmNsb3NlQ29udGV4dChwcmV2Q29udGV4dCk7XG4gIH1cblxuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgc3RhdGUuY29udGV4dCA9IHN1YnNjcmliZXIub3BlbkNvbnRleHQoKTtcbiAgICBzdGF0ZS5jb250ZXh0LmNsb3NlQWN0aW9uID0gdGhpcy5zY2hlZHVsZShzdGF0ZSwgc3RhdGUuYnVmZmVyVGltZVNwYW4pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQnVmZmVyQ3JlYXRpb248VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoQ3JlYXRlQXJnPFQ+Piwgc3RhdGU6IERpc3BhdGNoQ3JlYXRlQXJnPFQ+KSB7XG4gIGNvbnN0IHsgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCwgYnVmZmVyVGltZVNwYW4sIHN1YnNjcmliZXIsIHNjaGVkdWxlciB9ID0gc3RhdGU7XG4gIGNvbnN0IGNvbnRleHQgPSBzdWJzY3JpYmVyLm9wZW5Db250ZXh0KCk7XG4gIGNvbnN0IGFjdGlvbiA9IDxTY2hlZHVsZXJBY3Rpb248RGlzcGF0Y2hDcmVhdGVBcmc8VD4+PnRoaXM7XG4gIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICBzdWJzY3JpYmVyLmFkZChjb250ZXh0LmNsb3NlQWN0aW9uID0gc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoQ2xvc2VBcmc8VD4+KGRpc3BhdGNoQnVmZmVyQ2xvc2UsIGJ1ZmZlclRpbWVTcGFuLCB7IHN1YnNjcmliZXIsIGNvbnRleHQgfSkpO1xuICAgIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hCdWZmZXJDbG9zZTxUPihhcmc6IERpc3BhdGNoQ2xvc2VBcmc8VD4pIHtcbiAgY29uc3QgeyBzdWJzY3JpYmVyLCBjb250ZXh0IH0gPSBhcmc7XG4gIHN1YnNjcmliZXIuY2xvc2VDb250ZXh0KGNvbnRleHQpO1xufVxuIl19