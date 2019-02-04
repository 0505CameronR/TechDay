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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25FcnJvclJlc3VtZU5leHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvb25FcnJvclJlc3VtZU5leHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsMkNBQTBDO0FBSTFDLDJDQUEwQztBQUMxQyxzREFBcUQ7QUFDckQsc0RBQXFEO0FBQ3JELCtEQUE4RDtBQVc5RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnRUc7QUFFSCxTQUFnQixpQkFBaUI7SUFBTyxxQkFFOEM7U0FGOUMsVUFFOEMsRUFGOUMscUJBRThDLEVBRjlDLElBRThDO1FBRjlDLGdDQUU4Qzs7SUFDcEYsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3ZELFdBQVcsR0FBMkIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3REO0lBRUQsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQXlCLENBQU8sV0FBVyxDQUFDLENBQUMsRUFBN0QsQ0FBNkQsQ0FBQztBQUNsRyxDQUFDO0FBUkQsOENBUUM7QUFXRCxtQ0FBbUM7QUFFbkMsU0FBZ0IsdUJBQXVCO0lBQU8scUJBRStDO1NBRi9DLFVBRStDLEVBRi9DLHFCQUUrQyxFQUYvQyxJQUUrQztRQUYvQyxnQ0FFK0M7O0lBQzNGLElBQUksTUFBTSxHQUF5QixJQUFJLENBQUM7SUFFeEMsSUFBSSxXQUFXLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQ3ZELFdBQVcsR0FBZ0MsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzNEO0lBQ0QsTUFBTSxHQUFHLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUU3QixPQUFPLFdBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUkseUJBQXlCLENBQU8sV0FBVyxDQUFDLENBQUMsQ0FBQztBQUNuRixDQUFDO0FBWEQsMERBV0M7QUFFRDtJQUNFLG1DQUFvQixXQUF3QztRQUF4QyxnQkFBVyxHQUFYLFdBQVcsQ0FBNkI7SUFDNUQsQ0FBQztJQUVELHdDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksMkJBQTJCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFDSCxnQ0FBQztBQUFELENBQUMsQUFQRCxJQU9DO0FBRUQ7SUFBZ0QsK0NBQXFCO0lBQ25FLHFDQUFzQixXQUEwQixFQUM1QixXQUF3QztRQUQ1RCxZQUVFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUhxQixpQkFBVyxHQUFYLFdBQVcsQ0FBZTtRQUM1QixpQkFBVyxHQUFYLFdBQVcsQ0FBNkI7O0lBRTVELENBQUM7SUFFRCxpREFBVyxHQUFYLFVBQVksS0FBVSxFQUFFLFFBQWlDO1FBQ3ZELElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO0lBQy9CLENBQUM7SUFFRCxvREFBYyxHQUFkLFVBQWUsUUFBaUM7UUFDOUMsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVTLDRDQUFNLEdBQWhCLFVBQWlCLEdBQVE7UUFDdkIsSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUywrQ0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzdCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRU8sMkRBQXFCLEdBQTdCO1FBQ0UsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUN0QyxJQUFJLElBQUksRUFBRTtZQUNSLElBQU0sZUFBZSxHQUFHLElBQUksaUNBQWUsQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ3hFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUEyQixDQUFDO1lBQ3JELFdBQVcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7WUFDakMscUNBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQ3RFO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUNILGtDQUFDO0FBQUQsQ0FBQyxBQW5DRCxDQUFnRCxpQ0FBZSxHQW1DOUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPih2OiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFQyLCBUMywgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBUMiwgVDMsIFQ0LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiA7XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+IHwgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgUj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBXaGVuIGFueSBvZiB0aGUgcHJvdmlkZWQgT2JzZXJ2YWJsZSBlbWl0cyBhbiBjb21wbGV0ZSBvciBlcnJvciBub3RpZmljYXRpb24sIGl0IGltbWVkaWF0ZWx5IHN1YnNjcmliZXMgdG8gdGhlIG5leHQgb25lXG4gKiB0aGF0IHdhcyBwYXNzZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkV4ZWN1dGUgc2VyaWVzIG9mIE9ic2VydmFibGVzIG5vIG1hdHRlciB3aGF0LCBldmVuIGlmIGl0IG1lYW5zIHN3YWxsb3dpbmcgZXJyb3JzLjwvc3Bhbj5cbiAqXG4gKiAhW10ob25FcnJvclJlc3VtZU5leHQucG5nKVxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgYW4gb3BlcmF0b3IgdGhhdCBhY2NlcHRzIGEgc2VyaWVzIG9mIE9ic2VydmFibGVzLCBwcm92aWRlZCBlaXRoZXIgZGlyZWN0bHkgYXNcbiAqIGFyZ3VtZW50cyBvciBhcyBhbiBhcnJheS4gSWYgbm8gc2luZ2xlIE9ic2VydmFibGUgaXMgcHJvdmlkZWQsIHJldHVybmVkIE9ic2VydmFibGUgd2lsbCBzaW1wbHkgYmVoYXZlIHRoZSBzYW1lXG4gKiBhcyB0aGUgc291cmNlLlxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgc3RhcnRzIGJ5IHN1YnNjcmliaW5nIGFuZCByZS1lbWl0dGluZyB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBXaGVuIGl0cyBzdHJlYW0gb2YgdmFsdWVzIGVuZHMgLSBubyBtYXR0ZXIgaWYgT2JzZXJ2YWJsZSBjb21wbGV0ZWQgb3IgZW1pdHRlZCBhbiBlcnJvciAtIGBvbkVycm9yUmVzdW1lTmV4dGBcbiAqIHdpbGwgc3Vic2NyaWJlIHRvIHRoZSBmaXJzdCBPYnNlcnZhYmxlIHRoYXQgd2FzIHBhc3NlZCBhcyBhbiBhcmd1bWVudCB0byB0aGUgbWV0aG9kLiBJdCB3aWxsIHN0YXJ0IHJlLWVtaXR0aW5nXG4gKiBpdHMgdmFsdWVzIGFzIHdlbGwgYW5kIC0gYWdhaW4gLSB3aGVuIHRoYXQgc3RyZWFtIGVuZHMsIGBvbkVycm9yUmVzdW1lTmV4dGAgd2lsbCBwcm9jZWVkIHRvIHN1YnNjcmliaW5nIHlldCBhbm90aGVyXG4gKiBPYnNlcnZhYmxlIGluIHByb3ZpZGVkIHNlcmllcywgbm8gbWF0dGVyIGlmIHByZXZpb3VzIE9ic2VydmFibGUgY29tcGxldGVkIG9yIGVuZGVkIHdpdGggYW4gZXJyb3IuIFRoaXMgd2lsbFxuICogYmUgaGFwcGVuaW5nIHVudGlsIHRoZXJlIGlzIG5vIG1vcmUgT2JzZXJ2YWJsZXMgbGVmdCBpbiB0aGUgc2VyaWVzLCBhdCB3aGljaCBwb2ludCByZXR1cm5lZCBPYnNlcnZhYmxlIHdpbGxcbiAqIGNvbXBsZXRlIC0gZXZlbiBpZiB0aGUgbGFzdCBzdWJzY3JpYmVkIHN0cmVhbSBlbmRlZCB3aXRoIGFuIGVycm9yLlxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgY2FuIGJlIHRoZXJlZm9yZSB0aG91Z2h0IG9mIGFzIHZlcnNpb24gb2Yge0BsaW5rIGNvbmNhdH0gb3BlcmF0b3IsIHdoaWNoIGlzIG1vcmUgcGVybWlzc2l2ZVxuICogd2hlbiBpdCBjb21lcyB0byB0aGUgZXJyb3JzIGVtaXR0ZWQgYnkgaXRzIGlucHV0IE9ic2VydmFibGVzLiBXaGlsZSBgY29uY2F0YCBzdWJzY3JpYmVzIHRvIHRoZSBuZXh0IE9ic2VydmFibGVcbiAqIGluIHNlcmllcyBvbmx5IGlmIHByZXZpb3VzIG9uZSBzdWNjZXNzZnVsbHkgY29tcGxldGVkLCBgb25FcnJvclJlc3VtZU5leHRgIHN1YnNjcmliZXMgZXZlbiBpZiBpdCBlbmRlZCB3aXRoXG4gKiBhbiBlcnJvci5cbiAqXG4gKiBOb3RlIHRoYXQgeW91IGRvIG5vdCBnZXQgYW55IGFjY2VzcyB0byBlcnJvcnMgZW1pdHRlZCBieSB0aGUgT2JzZXJ2YWJsZXMuIEluIHBhcnRpY3VsYXIgZG8gbm90XG4gKiBleHBlY3QgdGhlc2UgZXJyb3JzIHRvIGFwcGVhciBpbiBlcnJvciBjYWxsYmFjayBwYXNzZWQgdG8ge0BsaW5rIE9ic2VydmFibGUjc3Vic2NyaWJlfS4gSWYgeW91IHdhbnQgdG8gdGFrZVxuICogc3BlY2lmaWMgYWN0aW9ucyBiYXNlZCBvbiB3aGF0IGVycm9yIHdhcyBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUsIHlvdSBzaG91bGQgdHJ5IG91dCB7QGxpbmsgY2F0Y2hFcnJvcn0gaW5zdGVhZC5cbiAqXG4gKlxuICogIyMgRXhhbXBsZVxuICogU3Vic2NyaWJlIHRvIHRoZSBuZXh0IE9ic2VydmFibGUgYWZ0ZXIgbWFwIGZhaWxzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZigxLCAyLCAzLCAwKS5waXBlKFxuICogICBtYXAoeCA9PiB7XG4gKiAgICAgICBpZiAoeCA9PT0gMCkgeyB0aHJvdyBFcnJvcigpOyB9XG4gICAgICAgICByZXR1cm4gMTAgLyB4O1xuICogICB9KSxcbiAqICAgb25FcnJvclJlc3VtZU5leHQob2YoMSwgMiwgMykpLFxuICogKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsID0+IGNvbnNvbGUubG9nKHZhbCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpLCAgICAgICAgICAvLyBXaWxsIG5ldmVyIGJlIGNhbGxlZC5cbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoYXRcXCdzIGl0IScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAxMFxuICogLy8gNVxuICogLy8gMy4zMzMzMzMzMzMzMzMzMzM1XG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyAzXG4gKiAvLyBcInRoYXQncyBpdCFcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0fVxuICogQHNlZSB7QGxpbmsgY2F0Y2hFcnJvcn1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gb2JzZXJ2YWJsZXMgT2JzZXJ2YWJsZXMgcGFzc2VkIGVpdGhlciBkaXJlY3RseSBvciBhcyBhbiBhcnJheS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB2YWx1ZXMgZnJvbSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IC0gaWYgaXQgZXJyb3JzIC0gc3Vic2NyaWJlc1xuICogdG8gdGhlIG5leHQgcGFzc2VkIE9ic2VydmFibGUgYW5kIHNvIG9uLCB1bnRpbCBpdCBjb21wbGV0ZXMgb3IgcnVucyBvdXQgb2YgT2JzZXJ2YWJsZXMuXG4gKiBAbWV0aG9kIG9uRXJyb3JSZXN1bWVOZXh0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPiguLi5uZXh0U291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKCguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICBpZiAobmV4dFNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobmV4dFNvdXJjZXNbMF0pKSB7XG4gICAgbmV4dFNvdXJjZXMgPSA8QXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pj5uZXh0U291cmNlc1swXTtcbiAgfVxuXG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgT25FcnJvclJlc3VtZU5leHRPcGVyYXRvcjxULCBSPihuZXh0U291cmNlcykpO1xufVxuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dFN0YXRpYzxSPih2OiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFQyLCBUMywgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dFN0YXRpYzxUMiwgVDMsIFQ0LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dFN0YXRpYzxUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0U3RhdGljPFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dFN0YXRpYzxULCBSPiguLi5uZXh0U291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPiB7XG4gIGxldCBzb3VyY2U6IE9ic2VydmFibGVJbnB1dDxhbnk+ID0gbnVsbDtcblxuICBpZiAobmV4dFNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkobmV4dFNvdXJjZXNbMF0pKSB7XG4gICAgbmV4dFNvdXJjZXMgPSA8QXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4+Pm5leHRTb3VyY2VzWzBdO1xuICB9XG4gIHNvdXJjZSA9IG5leHRTb3VyY2VzLnNoaWZ0KCk7XG5cbiAgcmV0dXJuIGZyb20oc291cmNlLCBudWxsKS5saWZ0KG5ldyBPbkVycm9yUmVzdW1lTmV4dE9wZXJhdG9yPFQsIFI+KG5leHRTb3VyY2VzKSk7XG59XG5cbmNsYXNzIE9uRXJyb3JSZXN1bWVOZXh0T3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmV4dFNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE9uRXJyb3JSZXN1bWVOZXh0U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm5leHRTb3VyY2VzKSk7XG4gIH1cbn1cblxuY2xhc3MgT25FcnJvclJlc3VtZU5leHRTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIG5leHRTb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvTmV4dFNvdXJjZSgpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb05leHRTb3VyY2UoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLnN1YnNjcmliZVRvTmV4dFNvdXJjZSgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5zdWJzY3JpYmVUb05leHRTb3VyY2UoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvTmV4dFNvdXJjZSgpOiB2b2lkIHtcbiAgICBjb25zdCBuZXh0ID0gdGhpcy5uZXh0U291cmNlcy5zaGlmdCgpO1xuICAgIGlmIChuZXh0KSB7XG4gICAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgICBkZXN0aW5hdGlvbi5hZGQoaW5uZXJTdWJzY3JpYmVyKTtcbiAgICAgIHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG5leHQsIHVuZGVmaW5lZCwgdW5kZWZpbmVkLCBpbm5lclN1YnNjcmliZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=