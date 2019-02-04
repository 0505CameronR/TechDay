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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyVGltZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJUaW1lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUUzQyw0Q0FBMkM7QUFFM0MsbURBQWtEO0FBT2xELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrREc7QUFDSCxTQUFnQixVQUFVLENBQUksY0FBc0I7SUFDbEQsSUFBSSxNQUFNLEdBQVcsU0FBUyxDQUFDLE1BQU0sQ0FBQztJQUV0QyxJQUFJLFNBQVMsR0FBa0IsYUFBSyxDQUFDO0lBQ3JDLElBQUkseUJBQVcsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ2hELFNBQVMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM1QyxNQUFNLEVBQUUsQ0FBQztLQUNWO0lBRUQsSUFBSSxzQkFBc0IsR0FBVyxJQUFJLENBQUM7SUFDMUMsSUFBSSxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ2Ysc0JBQXNCLEdBQUcsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBRUQsSUFBSSxhQUFhLEdBQVcsTUFBTSxDQUFDLGlCQUFpQixDQUFDO0lBQ3JELElBQUksTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNmLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7SUFFRCxPQUFPLFNBQVMsMEJBQTBCLENBQUMsTUFBcUI7UUFDOUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENB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InNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgYXN5bmMgfSBmcm9tICcuLi9zY2hlZHVsZXIvYXN5bmMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRpbWU8VD4oYnVmZmVyVGltZVNwYW46IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUaW1lPFQ+KGJ1ZmZlclRpbWVTcGFuOiBudW1iZXIsIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWw6IG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbXT47XG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVGltZTxUPihidWZmZXJUaW1lU3BhbjogbnVtYmVyLCBidWZmZXJDcmVhdGlvbkludGVydmFsOiBudW1iZXIgfCBudWxsIHwgdW5kZWZpbmVkLCBtYXhCdWZmZXJTaXplOiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbXT47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIEJ1ZmZlcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBmb3IgYSBzcGVjaWZpYyB0aW1lIHBlcmlvZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29sbGVjdHMgdmFsdWVzIGZyb20gdGhlIHBhc3QgYXMgYW4gYXJyYXksIGFuZCBlbWl0c1xuICogdGhvc2UgYXJyYXlzIHBlcmlvZGljYWxseSBpbiB0aW1lLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyVGltZS5wbmcpXG4gKlxuICogQnVmZmVycyB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIGZvciBhIHNwZWNpZmljIHRpbWUgZHVyYXRpb24gYGJ1ZmZlclRpbWVTcGFuYC5cbiAqIFVubGVzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWxgIGlzIGdpdmVuLCBpdCBlbWl0cyBhbmRcbiAqIHJlc2V0cyB0aGUgYnVmZmVyIGV2ZXJ5IGBidWZmZXJUaW1lU3BhbmAgbWlsbGlzZWNvbmRzLiBJZlxuICogYGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWxgIGlzIGdpdmVuLCB0aGlzIG9wZXJhdG9yIG9wZW5zIHRoZSBidWZmZXIgZXZlcnlcbiAqIGBidWZmZXJDcmVhdGlvbkludGVydmFsYCBtaWxsaXNlY29uZHMgYW5kIGNsb3NlcyAoZW1pdHMgYW5kIHJlc2V0cykgdGhlXG4gKiBidWZmZXIgZXZlcnkgYGJ1ZmZlclRpbWVTcGFuYCBtaWxsaXNlY29uZHMuIFdoZW4gdGhlIG9wdGlvbmFsIGFyZ3VtZW50XG4gKiBgbWF4QnVmZmVyU2l6ZWAgaXMgc3BlY2lmaWVkLCB0aGUgYnVmZmVyIHdpbGwgYmUgY2xvc2VkIGVpdGhlciBhZnRlclxuICogYGJ1ZmZlclRpbWVTcGFuYCBtaWxsaXNlY29uZHMgb3Igd2hlbiBpdCBjb250YWlucyBgbWF4QnVmZmVyU2l6ZWAgZWxlbWVudHMuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBFdmVyeSBzZWNvbmQsIGVtaXQgYW4gYXJyYXkgb2YgdGhlIHJlY2VudCBjbGljayBldmVudHNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJUaW1lKDEwMDApKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEV2ZXJ5IDUgc2Vjb25kcywgZW1pdCB0aGUgY2xpY2sgZXZlbnRzIGZyb20gdGhlIG5leHQgMiBzZWNvbmRzXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyVGltZSgyMDAwLCA1MDAwKSk7XG4gKiBidWZmZXJlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKiBAc2VlIHtAbGluayBidWZmZXJDb3VudH1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUaW1lfVxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBidWZmZXJUaW1lU3BhbiBUaGUgYW1vdW50IG9mIHRpbWUgdG8gZmlsbCBlYWNoIGJ1ZmZlciBhcnJheS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbYnVmZmVyQ3JlYXRpb25JbnRlcnZhbF0gVGhlIGludGVydmFsIGF0IHdoaWNoIHRvIHN0YXJ0IG5ld1xuICogYnVmZmVycy5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbWF4QnVmZmVyU2l6ZV0gVGhlIG1heGltdW0gYnVmZmVyIHNpemUuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXI9YXN5bmNdIFRoZSBzY2hlZHVsZXIgb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlXG4gKiBpbnRlcnZhbHMgdGhhdCBkZXRlcm1pbmUgYnVmZmVyIGJvdW5kYXJpZXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFRbXT59IEFuIG9ic2VydmFibGUgb2YgYXJyYXlzIG9mIGJ1ZmZlcmVkIHZhbHVlcy5cbiAqIEBtZXRob2QgYnVmZmVyVGltZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlclRpbWU8VD4oYnVmZmVyVGltZVNwYW46IG51bWJlcik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPiB7XG4gIGxldCBsZW5ndGg6IG51bWJlciA9IGFyZ3VtZW50cy5sZW5ndGg7XG5cbiAgbGV0IHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jO1xuICBpZiAoaXNTY2hlZHVsZXIoYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXSkpIHtcbiAgICBzY2hlZHVsZXIgPSBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGxlbmd0aC0tO1xuICB9XG5cbiAgbGV0IGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWw6IG51bWJlciA9IG51bGw7XG4gIGlmIChsZW5ndGggPj0gMikge1xuICAgIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwgPSBhcmd1bWVudHNbMV07XG4gIH1cblxuICBsZXQgbWF4QnVmZmVyU2l6ZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICBpZiAobGVuZ3RoID49IDMpIHtcbiAgICBtYXhCdWZmZXJTaXplID0gYXJndW1lbnRzWzJdO1xuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1ZmZlclRpbWVPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgQnVmZmVyVGltZU9wZXJhdG9yPFQ+KGJ1ZmZlclRpbWVTcGFuLCBidWZmZXJDcmVhdGlvbkludGVydmFsLCBtYXhCdWZmZXJTaXplLCBzY2hlZHVsZXIpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyVGltZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnVmZmVyVGltZVNwYW46IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBidWZmZXJDcmVhdGlvbkludGVydmFsOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgbWF4QnVmZmVyU2l6ZTogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSkge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyVGltZVN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLmJ1ZmZlclRpbWVTcGFuLCB0aGlzLmJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwsIHRoaXMubWF4QnVmZmVyU2l6ZSwgdGhpcy5zY2hlZHVsZXJcbiAgICApKTtcbiAgfVxufVxuXG5jbGFzcyBDb250ZXh0PFQ+IHtcbiAgYnVmZmVyOiBUW10gPSBbXTtcbiAgY2xvc2VBY3Rpb246IFN1YnNjcmlwdGlvbjtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoQ3JlYXRlQXJnPFQ+IHtcbiAgYnVmZmVyVGltZVNwYW46IG51bWJlcjtcbiAgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbDogbnVtYmVyO1xuICBzdWJzY3JpYmVyOiBCdWZmZXJUaW1lU3Vic2NyaWJlcjxUPjtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hDbG9zZUFyZzxUPiB7XG4gIHN1YnNjcmliZXI6IEJ1ZmZlclRpbWVTdWJzY3JpYmVyPFQ+O1xuICBjb250ZXh0OiBDb250ZXh0PFQ+O1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyVGltZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBjb250ZXh0czogQXJyYXk8Q29udGV4dDxUPj4gPSBbXTtcbiAgcHJpdmF0ZSB0aW1lc3Bhbk9ubHk6IGJvb2xlYW47XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBidWZmZXJUaW1lU3BhbjogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWw6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBtYXhCdWZmZXJTaXplOiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGNvbnN0IGNvbnRleHQgPSB0aGlzLm9wZW5Db250ZXh0KCk7XG4gICAgdGhpcy50aW1lc3Bhbk9ubHkgPSBidWZmZXJDcmVhdGlvbkludGVydmFsID09IG51bGwgfHwgYnVmZmVyQ3JlYXRpb25JbnRlcnZhbCA8IDA7XG4gICAgaWYgKHRoaXMudGltZXNwYW5Pbmx5KSB7XG4gICAgICBjb25zdCB0aW1lU3Bhbk9ubHlTdGF0ZSA9IHsgc3Vic2NyaWJlcjogdGhpcywgY29udGV4dCwgYnVmZmVyVGltZVNwYW4gfTtcbiAgICAgIHRoaXMuYWRkKGNvbnRleHQuY2xvc2VBY3Rpb24gPSBzY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2hCdWZmZXJUaW1lU3Bhbk9ubHksIGJ1ZmZlclRpbWVTcGFuLCB0aW1lU3Bhbk9ubHlTdGF0ZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBjbG9zZVN0YXRlID0geyBzdWJzY3JpYmVyOiB0aGlzLCBjb250ZXh0IH07XG4gICAgICBjb25zdCBjcmVhdGlvblN0YXRlOiBEaXNwYXRjaENyZWF0ZUFyZzxUPiA9IHsgYnVmZmVyVGltZVNwYW4sIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwsIHN1YnNjcmliZXI6IHRoaXMsIHNjaGVkdWxlciB9O1xuICAgICAgdGhpcy5hZGQoY29udGV4dC5jbG9zZUFjdGlvbiA9IHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaENsb3NlQXJnPFQ+PihkaXNwYXRjaEJ1ZmZlckNsb3NlLCBidWZmZXJUaW1lU3BhbiwgY2xvc2VTdGF0ZSkpO1xuICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoQ3JlYXRlQXJnPFQ+PihkaXNwYXRjaEJ1ZmZlckNyZWF0aW9uLCBidWZmZXJDcmVhdGlvbkludGVydmFsLCBjcmVhdGlvblN0YXRlKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgY29udGV4dHMgPSB0aGlzLmNvbnRleHRzO1xuICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICBsZXQgZmlsbGVkQnVmZmVyQ29udGV4dDogQ29udGV4dDxUPjtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaV07XG4gICAgICBjb25zdCBidWZmZXIgPSBjb250ZXh0LmJ1ZmZlcjtcbiAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgIGlmIChidWZmZXIubGVuZ3RoID09IHRoaXMubWF4QnVmZmVyU2l6ZSkge1xuICAgICAgICBmaWxsZWRCdWZmZXJDb250ZXh0ID0gY29udGV4dDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZmlsbGVkQnVmZmVyQ29udGV4dCkge1xuICAgICAgdGhpcy5vbkJ1ZmZlckZ1bGwoZmlsbGVkQnVmZmVyQ29udGV4dCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSkge1xuICAgIHRoaXMuY29udGV4dHMubGVuZ3RoID0gMDtcbiAgICBzdXBlci5fZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3QgeyBjb250ZXh0cywgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgd2hpbGUgKGNvbnRleHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5zaGlmdCgpO1xuICAgICAgZGVzdGluYXRpb24ubmV4dChjb250ZXh0LmJ1ZmZlcik7XG4gICAgfVxuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgb25CdWZmZXJGdWxsKGNvbnRleHQ6IENvbnRleHQ8VD4pIHtcbiAgICB0aGlzLmNsb3NlQ29udGV4dChjb250ZXh0KTtcbiAgICBjb25zdCBjbG9zZUFjdGlvbiA9IGNvbnRleHQuY2xvc2VBY3Rpb247XG4gICAgY2xvc2VBY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLnJlbW92ZShjbG9zZUFjdGlvbik7XG5cbiAgICBpZiAoIXRoaXMuY2xvc2VkICYmIHRoaXMudGltZXNwYW5Pbmx5KSB7XG4gICAgICBjb250ZXh0ID0gdGhpcy5vcGVuQ29udGV4dCgpO1xuICAgICAgY29uc3QgYnVmZmVyVGltZVNwYW4gPSB0aGlzLmJ1ZmZlclRpbWVTcGFuO1xuICAgICAgY29uc3QgdGltZVNwYW5Pbmx5U3RhdGUgPSB7IHN1YnNjcmliZXI6IHRoaXMsIGNvbnRleHQsIGJ1ZmZlclRpbWVTcGFuIH07XG4gICAgICB0aGlzLmFkZChjb250ZXh0LmNsb3NlQWN0aW9uID0gdGhpcy5zY2hlZHVsZXIuc2NoZWR1bGUoZGlzcGF0Y2hCdWZmZXJUaW1lU3Bhbk9ubHksIGJ1ZmZlclRpbWVTcGFuLCB0aW1lU3Bhbk9ubHlTdGF0ZSkpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5Db250ZXh0KCk6IENvbnRleHQ8VD4ge1xuICAgIGNvbnN0IGNvbnRleHQ6IENvbnRleHQ8VD4gPSBuZXcgQ29udGV4dDxUPigpO1xuICAgIHRoaXMuY29udGV4dHMucHVzaChjb250ZXh0KTtcbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIGNsb3NlQ29udGV4dChjb250ZXh0OiBDb250ZXh0PFQ+KSB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGNvbnRleHQuYnVmZmVyKTtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG5cbiAgICBjb25zdCBzcGxpY2VJbmRleCA9IGNvbnRleHRzID8gY29udGV4dHMuaW5kZXhPZihjb250ZXh0KSA6IC0xO1xuICAgIGlmIChzcGxpY2VJbmRleCA+PSAwKSB7XG4gICAgICBjb250ZXh0cy5zcGxpY2UoY29udGV4dHMuaW5kZXhPZihjb250ZXh0KSwgMSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQnVmZmVyVGltZVNwYW5Pbmx5KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LCBzdGF0ZTogYW55KSB7XG4gIGNvbnN0IHN1YnNjcmliZXI6IEJ1ZmZlclRpbWVTdWJzY3JpYmVyPGFueT4gPSBzdGF0ZS5zdWJzY3JpYmVyO1xuXG4gIGNvbnN0IHByZXZDb250ZXh0ID0gc3RhdGUuY29udGV4dDtcbiAgaWYgKHByZXZDb250ZXh0KSB7XG4gICAgc3Vic2NyaWJlci5jbG9zZUNvbnRleHQocHJldkNvbnRleHQpO1xuICB9XG5cbiAgaWYgKCFzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHN0YXRlLmNvbnRleHQgPSBzdWJzY3JpYmVyLm9wZW5Db250ZXh0KCk7XG4gICAgc3RhdGUuY29udGV4dC5jbG9zZUFjdGlvbiA9IHRoaXMuc2NoZWR1bGUoc3RhdGUsIHN0YXRlLmJ1ZmZlclRpbWVTcGFuKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEJ1ZmZlckNyZWF0aW9uPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEaXNwYXRjaENyZWF0ZUFyZzxUPj4sIHN0YXRlOiBEaXNwYXRjaENyZWF0ZUFyZzxUPikge1xuICBjb25zdCB7IGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwsIGJ1ZmZlclRpbWVTcGFuLCBzdWJzY3JpYmVyLCBzY2hlZHVsZXIgfSA9IHN0YXRlO1xuICBjb25zdCBjb250ZXh0ID0gc3Vic2NyaWJlci5vcGVuQ29udGV4dCgpO1xuICBjb25zdCBhY3Rpb24gPSA8U2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoQ3JlYXRlQXJnPFQ+Pj50aGlzO1xuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgc3Vic2NyaWJlci5hZGQoY29udGV4dC5jbG9zZUFjdGlvbiA9IHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaENsb3NlQXJnPFQ+PihkaXNwYXRjaEJ1ZmZlckNsb3NlLCBidWZmZXJUaW1lU3BhbiwgeyBzdWJzY3JpYmVyLCBjb250ZXh0IH0pKTtcbiAgICBhY3Rpb24uc2NoZWR1bGUoc3RhdGUsIGJ1ZmZlckNyZWF0aW9uSW50ZXJ2YWwpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoQnVmZmVyQ2xvc2U8VD4oYXJnOiBEaXNwYXRjaENsb3NlQXJnPFQ+KSB7XG4gIGNvbnN0IHsgc3Vic2NyaWJlciwgY29udGV4dCB9ID0gYXJnO1xuICBzdWJzY3JpYmVyLmNsb3NlQ29udGV4dChjb250ZXh0KTtcbn1cbiJdfQ==