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
/* tslint:enable:max-line-length */
/**
 * Combines the source Observable with other Observables to create an Observable
 * whose values are calculated from the latest values of each, only when the
 * source emits.
 *
 * <span class="informal">Whenever the source Observable emits a value, it
 * computes a formula using that value plus the latest values from other input
 * Observables, then emits the output of that formula.</span>
 *
 * ![](withLatestFrom.png)
 *
 * `withLatestFrom` combines each value from the source Observable (the
 * instance) with the latest values from the other input Observables only when
 * the source emits a value, optionally using a `project` function to determine
 * the value to be emitted on the output Observable. All input Observables must
 * emit at least one value before the output Observable will emit a value.
 *
 * ## Example
 * On every click event, emit an array with the latest timer event plus the click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const timer = interval(1000);
 * const result = clicks.pipe(withLatestFrom(timer));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link combineLatest}
 *
 * @param {ObservableInput} other An input Observable to combine with the source
 * Observable. More than one input Observables may be given as argument.
 * @param {Function} [project] Projection function for combining values
 * together. Receives all values in order of the Observables passed, where the
 * first parameter is a value from the source Observable. (e.g.
 * `a.pipe(withLatestFrom(b, c), map(([a1, b1, c1]) => a1 + b1 + c1))`). If this is not
 * passed, arrays will be emitted on the output Observable.
 * @return {Observable} An Observable of projected values from the most recent
 * values from each input Observable, or an array of the most recent values from
 * each input Observable.
 * @method withLatestFrom
 * @owner Observable
 */
function withLatestFrom() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (source) {
        var project;
        if (typeof args[args.length - 1] === 'function') {
            project = args.pop();
        }
        var observables = args;
        return source.lift(new WithLatestFromOperator(observables, project));
    };
}
exports.withLatestFrom = withLatestFrom;
var WithLatestFromOperator = /** @class */ (function () {
    function WithLatestFromOperator(observables, project) {
        this.observables = observables;
        this.project = project;
    }
    WithLatestFromOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new WithLatestFromSubscriber(subscriber, this.observables, this.project));
    };
    return WithLatestFromOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var WithLatestFromSubscriber = /** @class */ (function (_super) {
    __extends(WithLatestFromSubscriber, _super);
    function WithLatestFromSubscriber(destination, observables, project) {
        var _this = _super.call(this, destination) || this;
        _this.observables = observables;
        _this.project = project;
        _this.toRespond = [];
        var len = observables.length;
        _this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            _this.toRespond.push(i);
        }
        for (var i = 0; i < len; i++) {
            var observable = observables[i];
            _this.add(subscribeToResult_1.subscribeToResult(_this, observable, observable, i));
        }
        return _this;
    }
    WithLatestFromSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        var toRespond = this.toRespond;
        if (toRespond.length > 0) {
            var found = toRespond.indexOf(outerIndex);
            if (found !== -1) {
                toRespond.splice(found, 1);
            }
        }
    };
    WithLatestFromSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    WithLatestFromSubscriber.prototype._next = function (value) {
        if (this.toRespond.length === 0) {
            var args = [value].concat(this.values);
            if (this.project) {
                this._tryProject(args);
            }
            else {
                this.destination.next(args);
            }
        }
    };
    WithLatestFromSubscriber.prototype._tryProject = function (args) {
        var result;
        try {
            result = this.project.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return WithLatestFromSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aExhdGVzdEZyb20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy93aXRoTGF0ZXN0RnJvbS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzREFBcUQ7QUFFckQsK0RBQThEO0FBa0I5RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFDSCxTQUFnQixjQUFjO0lBQU8sY0FBcUU7U0FBckUsVUFBcUUsRUFBckUscUJBQXFFLEVBQXJFLElBQXFFO1FBQXJFLHlCQUFxRTs7SUFDeEcsT0FBTyxVQUFDLE1BQXFCO1FBQzNCLElBQUksT0FBWSxDQUFDO1FBQ2pCLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7WUFDL0MsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUN0QjtRQUNELElBQU0sV0FBVyxHQUFzQixJQUFJLENBQUM7UUFDNUMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDdkUsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQVRELHdDQVNDO0FBRUQ7SUFDRSxnQ0FBb0IsV0FBOEIsRUFDOUIsT0FBNkM7UUFEN0MsZ0JBQVcsR0FBWCxXQUFXLENBQW1CO1FBQzlCLFlBQU8sR0FBUCxPQUFPLENBQXNDO0lBQ2pFLENBQUM7SUFFRCxxQ0FBSSxHQUFKLFVB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QyxBQTNERCxDQUE2QyxpQ0FBZSxHQTJEM0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgUj4ocHJvamVjdDogKHYxOiBUKSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHByb2plY3Q6ICh2MTogVCwgdjI6IFQyKSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgVDMsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgcHJvamVjdDogKHYxOiBULCB2MjogVDIsIHYzOiBUMykgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBUNCwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgcHJvamVjdDogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0KSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHByb2plY3Q6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1KSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2PiwgcHJvamVjdDogKHYxOiBULCB2MjogVDIsIHYzOiBUMywgdjQ6IFQ0LCB2NTogVDUsIHY2OiBUNikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4gO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFQyPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgW1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgVDMsIFQ0Pih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFQyLCBUMywgVDQsIFQ1Pih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgW1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPiA7XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdLCBwcm9qZWN0OiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29tYmluZXMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggb3RoZXIgT2JzZXJ2YWJsZXMgdG8gY3JlYXRlIGFuIE9ic2VydmFibGVcbiAqIHdob3NlIHZhbHVlcyBhcmUgY2FsY3VsYXRlZCBmcm9tIHRoZSBsYXRlc3QgdmFsdWVzIG9mIGVhY2gsIG9ubHkgd2hlbiB0aGVcbiAqIHNvdXJjZSBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2hlbmV2ZXIgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUsIGl0XG4gKiBjb21wdXRlcyBhIGZvcm11bGEgdXNpbmcgdGhhdCB2YWx1ZSBwbHVzIHRoZSBsYXRlc3QgdmFsdWVzIGZyb20gb3RoZXIgaW5wdXRcbiAqIE9ic2VydmFibGVzLCB0aGVuIGVtaXRzIHRoZSBvdXRwdXQgb2YgdGhhdCBmb3JtdWxhLjwvc3Bhbj5cbiAqXG4gKiAhW10od2l0aExhdGVzdEZyb20ucG5nKVxuICpcbiAqIGB3aXRoTGF0ZXN0RnJvbWAgY29tYmluZXMgZWFjaCB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSAodGhlXG4gKiBpbnN0YW5jZSkgd2l0aCB0aGUgbGF0ZXN0IHZhbHVlcyBmcm9tIHRoZSBvdGhlciBpbnB1dCBPYnNlcnZhYmxlcyBvbmx5IHdoZW5cbiAqIHRoZSBzb3VyY2UgZW1pdHMgYSB2YWx1ZSwgb3B0aW9uYWxseSB1c2luZyBhIGBwcm9qZWN0YCBmdW5jdGlvbiB0byBkZXRlcm1pbmVcbiAqIHRoZSB2YWx1ZSB0byBiZSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS4gQWxsIGlucHV0IE9ic2VydmFibGVzIG11c3RcbiAqIGVtaXQgYXQgbGVhc3Qgb25lIHZhbHVlIGJlZm9yZSB0aGUgb3V0cHV0IE9ic2VydmFibGUgd2lsbCBlbWl0IGEgdmFsdWUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogT24gZXZlcnkgY2xpY2sgZXZlbnQsIGVtaXQgYW4gYXJyYXkgd2l0aCB0aGUgbGF0ZXN0IHRpbWVyIGV2ZW50IHBsdXMgdGhlIGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgdGltZXIgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKHdpdGhMYXRlc3RGcm9tKHRpbWVyKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGVJbnB1dH0gb3RoZXIgQW4gaW5wdXQgT2JzZXJ2YWJsZSB0byBjb21iaW5lIHdpdGggdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZS4gTW9yZSB0aGFuIG9uZSBpbnB1dCBPYnNlcnZhYmxlcyBtYXkgYmUgZ2l2ZW4gYXMgYXJndW1lbnQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbcHJvamVjdF0gUHJvamVjdGlvbiBmdW5jdGlvbiBmb3IgY29tYmluaW5nIHZhbHVlc1xuICogdG9nZXRoZXIuIFJlY2VpdmVzIGFsbCB2YWx1ZXMgaW4gb3JkZXIgb2YgdGhlIE9ic2VydmFibGVzIHBhc3NlZCwgd2hlcmUgdGhlXG4gKiBmaXJzdCBwYXJhbWV0ZXIgaXMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gKGUuZy5cbiAqIGBhLnBpcGUod2l0aExhdGVzdEZyb20oYiwgYyksIG1hcCgoW2ExLCBiMSwgYzFdKSA9PiBhMSArIGIxICsgYzEpKWApLiBJZiB0aGlzIGlzIG5vdFxuICogcGFzc2VkLCBhcnJheXMgd2lsbCBiZSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2YgcHJvamVjdGVkIHZhbHVlcyBmcm9tIHRoZSBtb3N0IHJlY2VudFxuICogdmFsdWVzIGZyb20gZWFjaCBpbnB1dCBPYnNlcnZhYmxlLCBvciBhbiBhcnJheSBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWVzIGZyb21cbiAqIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2Qgd2l0aExhdGVzdEZyb21cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBSPiguLi5hcmdzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBsZXQgcHJvamVjdDogYW55O1xuICAgIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBwcm9qZWN0ID0gYXJncy5wb3AoKTtcbiAgICB9XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSA8T2JzZXJ2YWJsZTxhbnk+W10+YXJncztcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFdpdGhMYXRlc3RGcm9tT3BlcmF0b3Iob2JzZXJ2YWJsZXMsIHByb2plY3QpKTtcbiAgfTtcbn1cblxuY2xhc3MgV2l0aExhdGVzdEZyb21PcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdD86ICguLi52YWx1ZXM6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgV2l0aExhdGVzdEZyb21TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMub2JzZXJ2YWJsZXMsIHRoaXMucHJvamVjdCkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaXRoTGF0ZXN0RnJvbVN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIHZhbHVlczogYW55W107XG4gIHByaXZhdGUgdG9SZXNwb25kOiBudW1iZXJbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPGFueT5bXSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9qZWN0PzogKC4uLnZhbHVlczogYW55W10pID0+IE9ic2VydmFibGU8Uj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2YWJsZXMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aGlzLnRvUmVzcG9uZC5wdXNoKGkpO1xuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBvYnNlcnZhYmxlID0gb2JzZXJ2YWJsZXNbaV07XG4gICAgICB0aGlzLmFkZChzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPih0aGlzLCBvYnNlcnZhYmxlLCA8YW55Pm9ic2VydmFibGUsIGkpKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW291dGVySW5kZXhdID0gaW5uZXJWYWx1ZTtcbiAgICBjb25zdCB0b1Jlc3BvbmQgPSB0aGlzLnRvUmVzcG9uZDtcbiAgICBpZiAodG9SZXNwb25kLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGZvdW5kID0gdG9SZXNwb25kLmluZGV4T2Yob3V0ZXJJbmRleCk7XG4gICAgICBpZiAoZm91bmQgIT09IC0xKSB7XG4gICAgICAgIHRvUmVzcG9uZC5zcGxpY2UoZm91bmQsIDEpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCkge1xuICAgIC8vIG5vb3BcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGlmICh0aGlzLnRvUmVzcG9uZC5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnN0IGFyZ3MgPSBbdmFsdWUsIC4uLnRoaXMudmFsdWVzXTtcbiAgICAgIGlmICh0aGlzLnByb2plY3QpIHtcbiAgICAgICAgdGhpcy5fdHJ5UHJvamVjdChhcmdzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChhcmdzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF90cnlQcm9qZWN0KGFyZ3M6IGFueVtdKSB7XG4gICAgbGV0IHJlc3VsdDogYW55O1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByb2plY3QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG4iXX0=