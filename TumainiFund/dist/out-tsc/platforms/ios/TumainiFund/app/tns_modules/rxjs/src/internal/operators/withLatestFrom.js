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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2l0aExhdGVzdEZyb20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvd2l0aExhdGVzdEZyb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esc0RBQXFEO0FBRXJELCtEQUE4RDtBQWtCOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0NHO0FBQ0gsU0FBZ0IsY0FBYztJQUFPLGNBQXFFO1NBQXJFLFVBQXFFLEVBQXJFLHFCQUFxRSxFQUFyRSxJQUFxRTtRQUFyRSx5QkFBcUU7O0lBQ3hHLE9BQU8sVUFBQyxNQUFxQjtRQUMzQixJQUFJLE9BQVksQ0FBQztRQUNqQixJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEtBQUssVUFBVSxFQUFFO1lBQy9DLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDdEI7UUFDRCxJQUFNLFdBQVcsR0FBc0IsSUFBSSxDQUFDO1FBQzVDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUMsQ0FBQztBQUNKLENBQUM7QUFURCx3Q0FTQztBQUVEO0lBQ0UsZ0NBQW9CLFdBQThCLEVBQzlCLE9BQTZDO1FBRDdDLGdCQUFXLEdBQVgsV0FBVyxDQUFtQjtRQUM5QixZQUFPLEdBQVAsT0FBTyxDQUFzQztJQUNqRSxDQUFDO0lBRUQscUNBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxVQUFVLEVBQUUs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cGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFI+KHByb2plY3Q6ICh2MTogVCkgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBwcm9qZWN0OiAodjE6IFQsIHYyOiBUMikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHByb2plY3Q6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMpID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFQyLCBUMywgVDQsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHByb2plY3Q6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCkgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBUNCwgVDUsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBwcm9qZWN0OiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSkgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4sIHByb2plY3Q6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1LCB2NjogVDYpID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IDtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFQyLCBUMz4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgVDIsIFQzLCBUND4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgW1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBUMiwgVDMsIFQ0LCBUNT4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT4gO1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIHdpdGhMYXRlc3RGcm9tPFQsIFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiB3aXRoTGF0ZXN0RnJvbTxULCBSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSwgcHJvamVjdDogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbWJpbmVzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIG90aGVyIE9ic2VydmFibGVzIHRvIGNyZWF0ZSBhbiBPYnNlcnZhYmxlXG4gKiB3aG9zZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgbGF0ZXN0IHZhbHVlcyBvZiBlYWNoLCBvbmx5IHdoZW4gdGhlXG4gKiBzb3VyY2UgZW1pdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldoZW5ldmVyIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlLCBpdFxuICogY29tcHV0ZXMgYSBmb3JtdWxhIHVzaW5nIHRoYXQgdmFsdWUgcGx1cyB0aGUgbGF0ZXN0IHZhbHVlcyBmcm9tIG90aGVyIGlucHV0XG4gKiBPYnNlcnZhYmxlcywgdGhlbiBlbWl0cyB0aGUgb3V0cHV0IG9mIHRoYXQgZm9ybXVsYS48L3NwYW4+XG4gKlxuICogIVtdKHdpdGhMYXRlc3RGcm9tLnBuZylcbiAqXG4gKiBgd2l0aExhdGVzdEZyb21gIGNvbWJpbmVzIGVhY2ggdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgKHRoZVxuICogaW5zdGFuY2UpIHdpdGggdGhlIGxhdGVzdCB2YWx1ZXMgZnJvbSB0aGUgb3RoZXIgaW5wdXQgT2JzZXJ2YWJsZXMgb25seSB3aGVuXG4gKiB0aGUgc291cmNlIGVtaXRzIGEgdmFsdWUsIG9wdGlvbmFsbHkgdXNpbmcgYSBgcHJvamVjdGAgZnVuY3Rpb24gdG8gZGV0ZXJtaW5lXG4gKiB0aGUgdmFsdWUgdG8gYmUgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuIEFsbCBpbnB1dCBPYnNlcnZhYmxlcyBtdXN0XG4gKiBlbWl0IGF0IGxlYXN0IG9uZSB2YWx1ZSBiZWZvcmUgdGhlIG91dHB1dCBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhIHZhbHVlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE9uIGV2ZXJ5IGNsaWNrIGV2ZW50LCBlbWl0IGFuIGFycmF5IHdpdGggdGhlIGxhdGVzdCB0aW1lciBldmVudCBwbHVzIHRoZSBjbGljayBldmVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHRpbWVyID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZSh3aXRoTGF0ZXN0RnJvbSh0aW1lcikpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlSW5wdXR9IG90aGVyIEFuIGlucHV0IE9ic2VydmFibGUgdG8gY29tYmluZSB3aXRoIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIE1vcmUgdGhhbiBvbmUgaW5wdXQgT2JzZXJ2YWJsZXMgbWF5IGJlIGdpdmVuIGFzIGFyZ3VtZW50LlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3Byb2plY3RdIFByb2plY3Rpb24gZnVuY3Rpb24gZm9yIGNvbWJpbmluZyB2YWx1ZXNcbiAqIHRvZ2V0aGVyLiBSZWNlaXZlcyBhbGwgdmFsdWVzIGluIG9yZGVyIG9mIHRoZSBPYnNlcnZhYmxlcyBwYXNzZWQsIHdoZXJlIHRoZVxuICogZmlyc3QgcGFyYW1ldGVyIGlzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuIChlLmcuXG4gKiBgYS5waXBlKHdpdGhMYXRlc3RGcm9tKGIsIGMpLCBtYXAoKFthMSwgYjEsIGMxXSkgPT4gYTEgKyBiMSArIGMxKSlgKS4gSWYgdGhpcyBpcyBub3RcbiAqIHBhc3NlZCwgYXJyYXlzIHdpbGwgYmUgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIHByb2plY3RlZCB2YWx1ZXMgZnJvbSB0aGUgbW9zdCByZWNlbnRcbiAqIHZhbHVlcyBmcm9tIGVhY2ggaW5wdXQgT2JzZXJ2YWJsZSwgb3IgYW4gYXJyYXkgb2YgdGhlIG1vc3QgcmVjZW50IHZhbHVlcyBmcm9tXG4gKiBlYWNoIGlucHV0IE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHdpdGhMYXRlc3RGcm9tXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2l0aExhdGVzdEZyb208VCwgUj4oLi4uYXJnczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgbGV0IHByb2plY3Q6IGFueTtcbiAgICBpZiAodHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcHJvamVjdCA9IGFyZ3MucG9wKCk7XG4gICAgfVxuICAgIGNvbnN0IG9ic2VydmFibGVzID0gPE9ic2VydmFibGU8YW55PltdPmFyZ3M7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBXaXRoTGF0ZXN0RnJvbU9wZXJhdG9yKG9ic2VydmFibGVzLCBwcm9qZWN0KSk7XG4gIH07XG59XG5cbmNsYXNzIFdpdGhMYXRlc3RGcm9tT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8YW55PltdLFxuICAgICAgICAgICAgICBwcml2YXRlIHByb2plY3Q/OiAoLi4udmFsdWVzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxSPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFdpdGhMYXRlc3RGcm9tU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm9ic2VydmFibGVzLCB0aGlzLnByb2plY3QpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgV2l0aExhdGVzdEZyb21TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSB2YWx1ZXM6IGFueVtdO1xuICBwcml2YXRlIHRvUmVzcG9uZDogbnVtYmVyW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdD86ICguLi52YWx1ZXM6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFI+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcbiAgICB0aGlzLnZhbHVlcyA9IG5ldyBBcnJheShsZW4pO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy50b1Jlc3BvbmQucHVzaChpKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgb2JzZXJ2YWJsZSA9IG9ic2VydmFibGVzW2ldO1xuICAgICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4odGhpcywgb2JzZXJ2YWJsZSwgPGFueT5vYnNlcnZhYmxlLCBpKSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1tvdXRlckluZGV4XSA9IGlubmVyVmFsdWU7XG4gICAgY29uc3QgdG9SZXNwb25kID0gdGhpcy50b1Jlc3BvbmQ7XG4gICAgaWYgKHRvUmVzcG9uZC5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBmb3VuZCA9IHRvUmVzcG9uZC5pbmRleE9mKG91dGVySW5kZXgpO1xuICAgICAgaWYgKGZvdW5kICE9PSAtMSkge1xuICAgICAgICB0b1Jlc3BvbmQuc3BsaWNlKGZvdW5kLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpIHtcbiAgICAvLyBub29wXG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICBpZiAodGhpcy50b1Jlc3BvbmQubGVuZ3RoID09PSAwKSB7XG4gICAgICBjb25zdCBhcmdzID0gW3ZhbHVlLCAuLi50aGlzLnZhbHVlc107XG4gICAgICBpZiAodGhpcy5wcm9qZWN0KSB7XG4gICAgICAgIHRoaXMuX3RyeVByb2plY3QoYXJncyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYXJncyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdHJ5UHJvamVjdChhcmdzOiBhbnlbXSkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcm9qZWN0LmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQocmVzdWx0KTtcbiAgfVxufVxuIl19