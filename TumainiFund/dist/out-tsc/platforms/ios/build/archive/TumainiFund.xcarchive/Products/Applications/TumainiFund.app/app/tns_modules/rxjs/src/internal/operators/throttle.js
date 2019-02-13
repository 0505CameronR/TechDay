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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
exports.defaultThrottleConfig = {
    leading: true,
    trailing: false
};
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * ![](throttle.png)
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * ## Example
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(throttle(ev => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @param {Object} config a configuration object to define `leading` and `trailing` behavior. Defaults
 * to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
function throttle(durationSelector, config) {
    if (config === void 0) { config = exports.defaultThrottleConfig; }
    return function (source) { return source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing)); };
}
exports.throttle = throttle;
var ThrottleOperator = /** @class */ (function () {
    function ThrottleOperator(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    ThrottleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    };
    return ThrottleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc
 * @ignore
 * @extends {Ignored}
 */
var ThrottleSubscriber = /** @class */ (function (_super) {
    __extends(ThrottleSubscriber, _super);
    function ThrottleSubscriber(destination, durationSelector, _leading, _trailing) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.durationSelector = durationSelector;
        _this._leading = _leading;
        _this._trailing = _trailing;
        _this._hasValue = false;
        return _this;
    }
    ThrottleSubscriber.prototype._next = function (value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    };
    ThrottleSubscriber.prototype.send = function () {
        var _a = this, _hasValue = _a._hasValue, _sendValue = _a._sendValue;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = null;
    };
    ThrottleSubscriber.prototype.throttle = function (value) {
        var duration = this.tryDurationSelector(value);
        if (duration) {
            this.add(this._throttled = subscribeToResult_1.subscribeToResult(this, duration));
        }
    };
    ThrottleSubscriber.prototype.tryDurationSelector = function (value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    };
    ThrottleSubscriber.prototype.throttlingDone = function () {
        var _a = this, _throttled = _a._throttled, _trailing = _a._trailing;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = null;
        if (_trailing) {
            this.send();
        }
    };
    ThrottleSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.throttlingDone();
    };
    ThrottleSubscriber.prototype.notifyComplete = function () {
        this.throttlingDone();
    };
    return ThrottleSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy90aHJvdHRsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFLQSxzREFBcUQ7QUFFckQsK0RBQThEO0FBU2pELFFBQUEscUJBQXFCLEdBQW1CO0lBQ25ELE9BQU8sRUFBRSxJQUFJO0lBQ2IsUUFBUSxFQUFFLEtBQUs7Q0FDaEIsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ0c7QUFDSCxTQUFnQixRQUFRLENBQUksZ0JBQTBELEVBQzFELE1BQThDO0lBQTlDLHVCQUFBLEVBQUEsU0FBeUIsNkJBQXFCO0lBQ3hFLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLGdCQUFnQixFQUFFLE1BQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQXBGLENBQW9GLENBQUM7QUFDekgsQ0FBQztBQUhELDRCQUdDO0FBRUQ7SUFDRSwwQkFBb0IsZ0JBQTBELEVBQzFELE9BQWdCLEVBQ2hCLFFBQWlCO1FBRmpCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEM7UUFDMUQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQ3JDLENBQUM7SUFFRCwrQkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDckIsSUFBSSxr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ImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFN1YnNjcmliYWJsZU9yUHJvbWlzZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGludGVyZmFjZSBUaHJvdHRsZUNvbmZpZyB7XG4gIGxlYWRpbmc/OiBib29sZWFuO1xuICB0cmFpbGluZz86IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjb25zdCBkZWZhdWx0VGhyb3R0bGVDb25maWc6IFRocm90dGxlQ29uZmlnID0ge1xuICBsZWFkaW5nOiB0cnVlLFxuICB0cmFpbGluZzogZmFsc2Vcbn07XG5cbi8qKlxuICogRW1pdHMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgdGhlbiBpZ25vcmVzIHN1YnNlcXVlbnQgc291cmNlXG4gKiB2YWx1ZXMgZm9yIGEgZHVyYXRpb24gZGV0ZXJtaW5lZCBieSBhbm90aGVyIE9ic2VydmFibGUsIHRoZW4gcmVwZWF0cyB0aGlzXG4gKiBwcm9jZXNzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIHRocm90dGxlVGltZX0sIGJ1dCB0aGUgc2lsZW5jaW5nXG4gKiBkdXJhdGlvbiBpcyBkZXRlcm1pbmVkIGJ5IGEgc2Vjb25kIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICFbXSh0aHJvdHRsZS5wbmcpXG4gKlxuICogYHRocm90dGxlYCBlbWl0cyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZVxuICogd2hlbiBpdHMgaW50ZXJuYWwgdGltZXIgaXMgZGlzYWJsZWQsIGFuZCBpZ25vcmVzIHNvdXJjZSB2YWx1ZXMgd2hlbiB0aGUgdGltZXJcbiAqIGlzIGVuYWJsZWQuIEluaXRpYWxseSwgdGhlIHRpbWVyIGlzIGRpc2FibGVkLiBBcyBzb29uIGFzIHRoZSBmaXJzdCBzb3VyY2VcbiAqIHZhbHVlIGFycml2ZXMsIGl0IGlzIGZvcndhcmRlZCB0byB0aGUgb3V0cHV0IE9ic2VydmFibGUsIGFuZCB0aGVuIHRoZSB0aW1lclxuICogaXMgZW5hYmxlZCBieSBjYWxsaW5nIHRoZSBgZHVyYXRpb25TZWxlY3RvcmAgZnVuY3Rpb24gd2l0aCB0aGUgc291cmNlIHZhbHVlLFxuICogd2hpY2ggcmV0dXJucyB0aGUgXCJkdXJhdGlvblwiIE9ic2VydmFibGUuIFdoZW4gdGhlIGR1cmF0aW9uIE9ic2VydmFibGUgZW1pdHMgYVxuICogdmFsdWUgb3IgY29tcGxldGVzLCB0aGUgdGltZXIgaXMgZGlzYWJsZWQsIGFuZCB0aGlzIHByb2Nlc3MgcmVwZWF0cyBmb3IgdGhlXG4gKiBuZXh0IHNvdXJjZSB2YWx1ZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IGNsaWNrcyBhdCBhIHJhdGUgb2YgYXQgbW9zdCBvbmUgY2xpY2sgcGVyIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKHRocm90dGxlKGV2ID0+IGludGVydmFsKDEwMDApKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYXVkaXR9XG4gKiBAc2VlIHtAbGluayBkZWJvdW5jZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5V2hlbn1cbiAqIEBzZWUge0BsaW5rIHNhbXBsZX1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlVGltZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBUKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBkdXJhdGlvblNlbGVjdG9yIEEgZnVuY3Rpb25cbiAqIHRoYXQgcmVjZWl2ZXMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgZm9yIGNvbXB1dGluZyB0aGUgc2lsZW5jaW5nXG4gKiBkdXJhdGlvbiBmb3IgZWFjaCBzb3VyY2UgdmFsdWUsIHJldHVybmVkIGFzIGFuIE9ic2VydmFibGUgb3IgYSBQcm9taXNlLlxuICogQHBhcmFtIHtPYmplY3R9IGNvbmZpZyBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0IHRvIGRlZmluZSBgbGVhZGluZ2AgYW5kIGB0cmFpbGluZ2AgYmVoYXZpb3IuIERlZmF1bHRzXG4gKiB0byBgeyBsZWFkaW5nOiB0cnVlLCB0cmFpbGluZzogZmFsc2UgfWAuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgcGVyZm9ybXMgdGhlIHRocm90dGxlIG9wZXJhdGlvbiB0b1xuICogbGltaXQgdGhlIHJhdGUgb2YgZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZS5cbiAqIEBtZXRob2QgdGhyb3R0bGVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aHJvdHRsZTxUPihkdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZzogVGhyb3R0bGVDb25maWcgPSBkZWZhdWx0VGhyb3R0bGVDb25maWcpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFRocm90dGxlT3BlcmF0b3IoZHVyYXRpb25TZWxlY3RvciwgY29uZmlnLmxlYWRpbmcsIGNvbmZpZy50cmFpbGluZykpO1xufVxuXG5jbGFzcyBUaHJvdHRsZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgbGVhZGluZzogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0cmFpbGluZzogYm9vbGVhbikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKFxuICAgICAgbmV3IFRocm90dGxlU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmR1cmF0aW9uU2VsZWN0b3IsIHRoaXMubGVhZGluZywgdGhpcy50cmFpbGluZylcbiAgICApO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvY1xuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFRocm90dGxlU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgX3Rocm90dGxlZDogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIF9zZW5kVmFsdWU6IFQ7XG4gIHByaXZhdGUgX2hhc1ZhbHVlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPG51bWJlcj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX2xlYWRpbmc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgX3RyYWlsaW5nOiBib29sZWFuKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5faGFzVmFsdWUgPSB0cnVlO1xuICAgIHRoaXMuX3NlbmRWYWx1ZSA9IHZhbHVlO1xuXG4gICAgaWYgKCF0aGlzLl90aHJvdHRsZWQpIHtcbiAgICAgIGlmICh0aGlzLl9sZWFkaW5nKSB7XG4gICAgICAgIHRoaXMuc2VuZCgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aHJvdHRsZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZW5kKCkge1xuICAgIGNvbnN0IHsgX2hhc1ZhbHVlLCBfc2VuZFZhbHVlIH0gPSB0aGlzO1xuICAgIGlmIChfaGFzVmFsdWUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChfc2VuZFZhbHVlKTtcbiAgICAgIHRoaXMudGhyb3R0bGUoX3NlbmRWYWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuX2hhc1ZhbHVlID0gZmFsc2U7XG4gICAgdGhpcy5fc2VuZFZhbHVlID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgdGhyb3R0bGUodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBkdXJhdGlvbiA9IHRoaXMudHJ5RHVyYXRpb25TZWxlY3Rvcih2YWx1ZSk7XG4gICAgaWYgKGR1cmF0aW9uKSB7XG4gICAgICB0aGlzLmFkZCh0aGlzLl90aHJvdHRsZWQgPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBkdXJhdGlvbikpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5RHVyYXRpb25TZWxlY3Rvcih2YWx1ZTogVCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb25TZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRocm90dGxpbmdEb25lKCkge1xuICAgIGNvbnN0IHsgX3Rocm90dGxlZCwgX3RyYWlsaW5nIH0gPSB0aGlzO1xuICAgIGlmIChfdGhyb3R0bGVkKSB7XG4gICAgICBfdGhyb3R0bGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuX3Rocm90dGxlZCA9IG51bGw7XG5cbiAgICBpZiAoX3RyYWlsaW5nKSB7XG4gICAgICB0aGlzLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMudGhyb3R0bGluZ0RvbmUoKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMudGhyb3R0bGluZ0RvbmUoKTtcbiAgfVxufVxuIl19