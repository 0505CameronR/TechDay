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
var from_1 = require("../observable/from");
var isArray_1 = require("../util/isArray");
var OuterSubscriber_1 = require("../OuterSubscriber");
var InnerSubscriber_1 = require("../InnerSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:enable:max-line-length */
/**
 * When any of the provided Observable emits an complete or error notification, it immediately subscribes to the next one
 * that was passed.
 *
 * <span class="informal">Execute series of Observables no matter what, even if it means swallowing errors.</span>
 *
 * ![](onErrorResumeNext.png)
 *
 * `onErrorResumeNext` is an operator that accepts a series of Observables, provided either directly as
 * arguments or as an array. If no single Observable is provided, returned Observable will simply behave the same
 * as the source.
 *
 * `onErrorResumeNext` returns an Observable that starts by subscribing and re-emitting values from the source Observable.
 * When its stream of values ends - no matter if Observable completed or emitted an error - `onErrorResumeNext`
 * will subscribe to the first Observable that was passed as an argument to the method. It will start re-emitting
 * its values as well and - again - when that stream ends, `onErrorResumeNext` will proceed to subscribing yet another
 * Observable in provided series, no matter if previous Observable completed or ended with an error. This will
 * be happening until there is no more Observables left in the series, at which point returned Observable will
 * complete - even if the last subscribed stream ended with an error.
 *
 * `onErrorResumeNext` can be therefore thought of as version of {@link concat} operator, which is more permissive
 * when it comes to the errors emitted by its input Observables. While `concat` subscribes to the next Observable
 * in series only if previous one successfully completed, `onErrorResumeNext` subscribes even if it ended with
 * an error.
 *
 * Note that you do not get any access to errors emitted by the Observables. In particular do not
 * expect these errors to appear in error callback passed to {@link Observable#subscribe}. If you want to take
 * specific actions based on what error was emitted by an Observable, you should try out {@link catchError} instead.
 *
 *
 * ## Example
 * Subscribe to the next Observable after map fails
 * ```javascript
 * of(1, 2, 3, 0).pipe(
 *   map(x => {
 *       if (x === 0) { throw Error(); }
         return 10 / x;
 *   }),
 *   onErrorResumeNext(of(1, 2, 3)),
 * )
 * .subscribe(
 *   val => console.log(val),
 *   err => console.log(err),          // Will never be called.
 *   () => console.log('that\'s it!')
 * );
 *
 * // Logs:
 * // 10
 * // 5
 * // 3.3333333333333335
 * // 1
 * // 2
 * // 3
 * // "that's it!"
 * ```
 *
 * @see {@link concat}
 * @see {@link catchError}
 *
 * @param {...ObservableInput} observables Observables passed either directly or as an array.
 * @return {Observable} An Observable that emits values from source Observable, but - if it errors - subscribes
 * to the next passed Observable and so on, until it completes or runs out of Observables.
 * @method onErrorResumeNext
 * @owner Observable
 */
function onErrorResumeNext() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i] = arguments[_i];
    }
    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    return function (source) { return source.lift(new OnErrorResumeNextOperator(nextSources)); };
}
exports.onErrorResumeNext = onErrorResumeNext;
/* tslint:enable:max-line-length */
function onErrorResumeNextStatic() {
    var nextSources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        nextSources[_i] = arguments[_i];
    }
    var source = null;
    if (nextSources.length === 1 && isArray_1.isArray(nextSources[0])) {
        nextSources = nextSources[0];
    }
    source = nextSources.shift();
    return from_1.from(source, null).lift(new OnErrorResumeNextOperator(nextSources));
}
exports.onErrorResumeNextStatic = onErrorResumeNextStatic;
var OnErrorResumeNextOperator = /** @class */ (function () {
    function OnErrorResumeNextOperator(nextSources) {
        this.nextSources = nextSources;
    }
    OnErrorResumeNextOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new OnErrorResumeNextSubscriber(subscriber, this.nextSources));
    };
    return OnErrorResumeNextOperator;
}());
var OnErrorResumeNextSubscriber = /** @class */ (function (_super) {
    __extends(OnErrorResumeNextSubscriber, _super);
    function OnErrorResumeNextSubscriber(destination, nextSources) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        _this.nextSources = nextSources;
        return _this;
    }
    OnErrorResumeNextSubscriber.prototype.notifyError = function (error, innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype.notifyComplete = function (innerSub) {
        this.subscribeToNextSource();
    };
    OnErrorResumeNextSubscriber.prototype._error = function (err) {
        this.subscribeToNextSource();
        this.unsubscribe();
    };
    OnErrorResumeNextSubscriber.prototype._complete = function () {
        this.subscribeToNextSource();
        this.unsubscribe();
    };
    OnErrorResumeNextSubscriber.prototype.subscribeToNextSource = function () {
        var next = this.nextSources.shift();
        if (next) {
            var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
            var destination = this.destination;
            destination.add(innerSubscriber);
            subscribeToResult_1.subscribeToResult(this, next, undefined, undefined, innerSubscriber);
        }
        else {
            this.destination.complete();
        }
    };
    return OnErrorResumeNextSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25FcnJvclJlc3VtZU5leHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9vbkVycm9yUmVzdW1lTmV4dC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBMEM7QUFJMUMsMkNBQTBDO0FBQzFDLHNEQUFxRDtBQUNyRCxzREFBcUQ7QUFDckQsK0RBQThEO0FBVzlELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdFRztBQUVILFNBQWdCLGlCQUFpQjtJQUFPLHFCQUU4QztTQUY5QyxVQUU4QyxFQUY5QyxxQkFFOEMsRUFGOUMsSUFFOEM7UUFGOUMsZ0NBRThDOztJQUNwRixJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGlCQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdkQsV0FBVyxHQUEyQixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDdEQ7SUFFRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBeUIsQ0FBTyxXQUFXLENBQUMsQ0FBQyxFQUE3RCxDQUE2RCxDQUFDO0FBQ2xHLENBQUM7QUFSRCw4Q0FRQztBQVdELG1DQUFtQztBQUVuQyxTQUFnQix1QkFBdUI7SUFBTyxxQkFFK0M7U0FGL0MsVUFFK0MsRUFGL0MscUJBRStDLEVBRi9DLElBRStDO1FBRi9DLGdDQUUrQzs7SUFDM0YsSUFBSSxNQUFNLEdBQXlCLElBQUksQ0FBQztJQUV4QyxJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGlCQUFPLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUU7UUFDdkQsV0FBVyxHQUFnQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDM0Q7SUFDRCxNQUFNLEdBQUcsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO0lBRTdCLE9BQU8sV0FBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSx5QkFBeUIsQ0FBTyxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQ25GLENBQUM7QUFYRCwwREFXQztBQUVEO0lBQ0UsbUNBQW9CLFdBQXdDO1FBQXhDLGdCQUFXLEdBQVgsV0FBVyxDQUE2QjtJQUM1RCxDQUFDO0lBRUQsd0NBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDekYsQ0FBQztJQUNILGdDQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDtJQUFnRCwrQ0FBcUI7SUFDbkUscUNBQXNCLFdBQTBCLEVBQzVCLFdBQXdDO1FBRDVELFlBRUUsa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSHFCLGlCQUFXLEdBQVgsV0FBVyxDQUFlO1FBQzVCLGlCQUFXLEdBQVgsV0FBVyxDQUE2Qjs7SUFFNUQsQ0FBQztJQUVELGlEQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBaUM7UUFDdkQsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELG9EQUFjLEdBQWQsVUFBZSxRQUFpQztRQUM5QyxJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztJQUMvQixDQUFDO0lBRVMsNENBQU0sR0FBaEIsVUFBaUIsR0FBUTtRQUN2QixJQUFJLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUM3QixJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVTLCtDQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTywyREFBcUIsR0FBN0I7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RDLElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBTSxlQUFlLEdBQUcsSUFBSSxpQ0FBZSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDeEUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQTJCLENBQUM7WUFDckQsV0FBVyxDQUFDLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztZQUNqQyxxQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsZUFBZSxDQUFDLENBQUM7U0FDdEU7YUFBTTtZQUNMLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBQ0gsa0NBQUM7QUFBRCxDQUFDLEFBbkNELENBQWdELGlDQUFlLEdBbUM5RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb20nO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFI+KHY6IE9ic2VydmFibGVJbnB1dDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgVDIsIFQzLCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFQyLCBUMywgVDQsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFQyLCBUMywgVDQsIFQ1LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IDtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFdoZW4gYW55IG9mIHRoZSBwcm92aWRlZCBPYnNlcnZhYmxlIGVtaXRzIGFuIGNvbXBsZXRlIG9yIGVycm9yIG5vdGlmaWNhdGlvbiwgaXQgaW1tZWRpYXRlbHkgc3Vic2NyaWJlcyB0byB0aGUgbmV4dCBvbmVcbiAqIHRoYXQgd2FzIHBhc3NlZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RXhlY3V0ZSBzZXJpZXMgb2YgT2JzZXJ2YWJsZXMgbm8gbWF0dGVyIHdoYXQsIGV2ZW4gaWYgaXQgbWVhbnMgc3dhbGxvd2luZyBlcnJvcnMuPC9zcGFuPlxuICpcbiAqICFbXShvbkVycm9yUmVzdW1lTmV4dC5wbmcpXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBpcyBhbiBvcGVyYXRvciB0aGF0IGFjY2VwdHMgYSBzZXJpZXMgb2YgT2JzZXJ2YWJsZXMsIHByb3ZpZGVkIGVpdGhlciBkaXJlY3RseSBhc1xuICogYXJndW1lbnRzIG9yIGFzIGFuIGFycmF5LiBJZiBubyBzaW5nbGUgT2JzZXJ2YWJsZSBpcyBwcm92aWRlZCwgcmV0dXJuZWQgT2JzZXJ2YWJsZSB3aWxsIHNpbXBseSBiZWhhdmUgdGhlIHNhbWVcbiAqIGFzIHRoZSBzb3VyY2UuXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBzdGFydHMgYnkgc3Vic2NyaWJpbmcgYW5kIHJlLWVtaXR0aW5nIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIFdoZW4gaXRzIHN0cmVhbSBvZiB2YWx1ZXMgZW5kcyAtIG5vIG1hdHRlciBpZiBPYnNlcnZhYmxlIGNvbXBsZXRlZCBvciBlbWl0dGVkIGFuIGVycm9yIC0gYG9uRXJyb3JSZXN1bWVOZXh0YFxuICogd2lsbCBzdWJzY3JpYmUgdG8gdGhlIGZpcnN0IE9ic2VydmFibGUgdGhhdCB3YXMgcGFzc2VkIGFzIGFuIGFyZ3VtZW50IHRvIHRoZSBtZXRob2QuIEl0IHdpbGwgc3RhcnQgcmUtZW1pdHRpbmdcbiAqIGl0cyB2YWx1ZXMgYXMgd2VsbCBhbmQgLSBhZ2FpbiAtIHdoZW4gdGhhdCBzdHJlYW0gZW5kcywgYG9uRXJyb3JSZXN1bWVOZXh0YCB3aWxsIHByb2NlZWQgdG8gc3Vic2NyaWJpbmcgeWV0IGFub3RoZXJcbiAqIE9ic2VydmFibGUgaW4gcHJvdmlkZWQgc2VyaWVzLCBubyBtYXR0ZXIgaWYgcHJldmlvdXMgT2JzZXJ2YWJsZSBjb21wbGV0ZWQgb3IgZW5kZWQgd2l0aCBhbiBlcnJvci4gVGhpcyB3aWxsXG4gKiBiZSBoYXBwZW5pbmcgdW50aWwgdGhlcmUgaXMgbm8gbW9yZSBPYnNlcnZhYmxlcyBsZWZ0IGluIHRoZSBzZXJpZXMsIGF0IHdoaWNoIHBvaW50IHJldHVybmVkIE9ic2VydmFibGUgd2lsbFxuICogY29tcGxldGUgLSBldmVuIGlmIHRoZSBsYXN0IHN1YnNjcmliZWQgc3RyZWFtIGVuZGVkIHdpdGggYW4gZXJyb3IuXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBjYW4gYmUgdGhlcmVmb3JlIHRob3VnaHQgb2YgYXMgdmVyc2lvbiBvZiB7QGxpbmsgY29uY2F0fSBvcGVyYXRvciwgd2hpY2ggaXMgbW9yZSBwZXJtaXNzaXZlXG4gKiB3aGVuIGl0IGNvbWVzIHRvIHRoZSBlcnJvcnMgZW1pdHRlZCBieSBpdHMgaW5wdXQgT2JzZXJ2YWJsZXMuIFdoaWxlIGBjb25jYXRgIHN1YnNjcmliZXMgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZVxuICogaW4gc2VyaWVzIG9ubHkgaWYgcHJldmlvdXMgb25lIHN1Y2Nlc3NmdWxseSBjb21wbGV0ZWQsIGBvbkVycm9yUmVzdW1lTmV4dGAgc3Vic2NyaWJlcyBldmVuIGlmIGl0IGVuZGVkIHdpdGhcbiAqIGFuIGVycm9yLlxuICpcbiAqIE5vdGUgdGhhdCB5b3UgZG8gbm90IGdldCBhbnkgYWNjZXNzIHRvIGVycm9ycyBlbWl0dGVkIGJ5IHRoZSBPYnNlcnZhYmxlcy4gSW4gcGFydGljdWxhciBkbyBub3RcbiAqIGV4cGVjdCB0aGVzZSBlcnJvcnMgdG8gYXBwZWFyIGluIGVycm9yIGNhbGxiYWNrIHBhc3NlZCB0byB7QGxpbmsgT2JzZXJ2YWJsZSNzdWJzY3JpYmV9LiBJZiB5b3Ugd2FudCB0byB0YWtlXG4gKiBzcGVjaWZpYyBhY3Rpb25zIGJhc2VkIG9uIHdoYXQgZXJyb3Igd2FzIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSwgeW91IHNob3VsZCB0cnkgb3V0IHtAbGluayBjYXRjaEVycm9yfSBpbnN0ZWFkLlxuICpcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdWJzY3JpYmUgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSBhZnRlciBtYXAgZmFpbHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDIsIDMsIDApLnBpcGUoXG4gKiAgIG1hcCh4ID0+IHtcbiAqICAgICAgIGlmICh4ID09PSAwKSB7IHRocm93IEVycm9yKCk7IH1cbiAgICAgICAgIHJldHVybiAxMCAvIHg7XG4gKiAgIH0pLFxuICogICBvbkVycm9yUmVzdW1lTmV4dChvZigxLCAyLCAzKSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWwgPT4gY29uc29sZS5sb2codmFsKSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksICAgICAgICAgIC8vIFdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhhdFxcJ3MgaXQhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDEwXG4gKiAvLyA1XG4gKiAvLyAzLjMzMzMzMzMzMzMzMzMzMzVcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIDNcbiAqIC8vIFwidGhhdCdzIGl0IVwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXR9XG4gKiBAc2VlIHtAbGluayBjYXRjaEVycm9yfVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBvYnNlcnZhYmxlcyBPYnNlcnZhYmxlcyBwYXNzZWQgZWl0aGVyIGRpcmVjdGx5IG9yIGFzIGFuIGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHZhbHVlcyBmcm9tIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgLSBpZiBpdCBlcnJvcnMgLSBzdWJzY3JpYmVzXG4gKiB0byB0aGUgbmV4dCBwYXNzZWQgT2JzZXJ2YWJsZSBhbmQgc28gb24sIHVudGlsIGl0IGNvbXBsZXRlcyBvciBydW5zIG91dCBvZiBPYnNlcnZhYmxlcy5cbiAqIEBtZXRob2Qgb25FcnJvclJlc3VtZU5leHRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFI+KC4uLm5leHRTb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+IHxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIGlmIChuZXh0U291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShuZXh0U291cmNlc1swXSkpIHtcbiAgICBuZXh0U291cmNlcyA9IDxBcnJheTxPYnNlcnZhYmxlPGFueT4+Pm5leHRTb3VyY2VzWzBdO1xuICB9XG5cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBPbkVycm9yUmVzdW1lTmV4dE9wZXJhdG9yPFQsIFI+KG5leHRTb3VyY2VzKSk7XG59XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFI+KHY6IE9ic2VydmFibGVJbnB1dDxSPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHRTdGF0aWM8VDIsIFQzLCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFQyLCBUMywgVDQsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFQyLCBUMywgVDQsIFQ1LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHRTdGF0aWM8VDIsIFQzLCBUNCwgVDUsIFQ2LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1PiwgdjY6IE9ic2VydmFibGVJbnB1dDxUNj4pOiBPYnNlcnZhYmxlPFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHRTdGF0aWM8Uj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHRTdGF0aWM8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFQsIFI+KC4uLm5leHRTb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgbGV0IHNvdXJjZTogT2JzZXJ2YWJsZUlucHV0PGFueT4gPSBudWxsO1xuXG4gIGlmIChuZXh0U291cmNlcy5sZW5ndGggPT09IDEgJiYgaXNBcnJheShuZXh0U291cmNlc1swXSkpIHtcbiAgICBuZXh0U291cmNlcyA9IDxBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4+bmV4dFNvdXJjZXNbMF07XG4gIH1cbiAgc291cmNlID0gbmV4dFNvdXJjZXMuc2hpZnQoKTtcblxuICByZXR1cm4gZnJvbShzb3VyY2UsIG51bGwpLmxpZnQobmV3IE9uRXJyb3JSZXN1bWVOZXh0T3BlcmF0b3I8VCwgUj4obmV4dFNvdXJjZXMpKTtcbn1cblxuY2xhc3MgT25FcnJvclJlc3VtZU5leHRPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZXh0U291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgT25FcnJvclJlc3VtZU5leHRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMubmV4dFNvdXJjZXMpKTtcbiAgfVxufVxuXG5jbGFzcyBPbkVycm9yUmVzdW1lTmV4dFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgbmV4dFNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycm9yOiBhbnksIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaWJlVG9OZXh0U291cmNlKCk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvTmV4dFNvdXJjZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuc3Vic2NyaWJlVG9OZXh0U291cmNlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvTmV4dFNvdXJjZSgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlVG9OZXh0U291cmNlKCk6IHZvaWQge1xuICAgIGNvbnN0IG5leHQgPSB0aGlzLm5leHRTb3VyY2VzLnNoaWZ0KCk7XG4gICAgaWYgKG5leHQpIHtcbiAgICAgIGNvbnN0IGlubmVyU3Vic2NyaWJlciA9IG5ldyBJbm5lclN1YnNjcmliZXIodGhpcywgdW5kZWZpbmVkLCB1bmRlZmluZWQpO1xuICAgICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICAgIGRlc3RpbmF0aW9uLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgICAgc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgbmV4dCwgdW5kZWZpbmVkLCB1bmRlZmluZWQsIGlubmVyU3Vic2NyaWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==