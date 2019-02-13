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
var Subject_1 = require("../Subject");
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will emit the Throwable that caused the error to the Observable returned from `notifier`.
 * If that Observable calls `complete` or `error` then this method will call `complete` or `error` on the child
 * subscription. Otherwise this method will resubscribe to the source Observable.
 *
 * ![](retryWhen.png)
 *
 * @param {function(errors: Observable): Observable} notifier - Receives an Observable of notifications with which a
 * user can `complete` or `error`, aborting the retry.
 * @return {Observable} The source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
function retryWhen(notifier) {
    return function (source) { return source.lift(new RetryWhenOperator(notifier, source)); };
}
exports.retryWhen = retryWhen;
var RetryWhenOperator = /** @class */ (function () {
    function RetryWhenOperator(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    RetryWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    };
    return RetryWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RetryWhenSubscriber = /** @class */ (function (_super) {
    __extends(RetryWhenSubscriber, _super);
    function RetryWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        return _this;
    }
    RetryWhenSubscriber.prototype.error = function (err) {
        if (!this.isStopped) {
            var errors = this.errors;
            var retries = this.retries;
            var retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject_1.Subject();
                retries = tryCatch_1.tryCatch(this.notifier)(errors);
                if (retries === errorObject_1.errorObject) {
                    return _super.prototype.error.call(this, errorObject_1.errorObject.e);
                }
                retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    RetryWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, errors = _a.errors, retriesSubscription = _a.retriesSubscription;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    RetryWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        this.source.subscribe(this);
    };
    return RetryWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcmV0cnlXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNDQUFxQztBQUVyQyw2Q0FBNEM7QUFDNUMsbURBQWtEO0FBRWxELHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFJOUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxRQUFzRDtJQUNqRixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBcEQsQ0FBb0QsQ0FBQztBQUN6RixDQUFDO0FBRkQsOEJBRUM7QUFFRDtJQUNFLDJCQUFzQixRQUFzRCxFQUN0RCxNQUFxQjtRQURyQixhQUFRLEdBQVIsUUFBUSxDQUE4QztRQUN0RCxXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQzNDLENBQUM7SUFFRCxnQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQXdDLHVDQUFxQjtJQU0zRCw2QkFBWSxXQUEwQixFQUNsQixRQUFzRCxFQUN0RCxNQUFxQjtRQUZ6QyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUhtQixjQUFRLEdBQVIsUUFBUSxDQUE4QztRQUN0RCxZQUFNLEdBQU4sTUFBTSxDQUFlOztJQUV6QyxDQUFDO0lBRUQsbUNBQUssR0FBTCxVQUFNLEdBQVE7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUVuQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pCLElBQUksT0FBTyxHQUFRLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFFbkQsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixNQUFNLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7Z0JBQ3ZCLE9BQU8sR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxPQUFPLEtBQUsseUJBQVcsRUFBRTtvQkFDM0IsT0FBTyxpQkFBTSxLQUFLLFlBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbkM7Z0JBQ0QsbUJBQW1CLEdBQUcscUNBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2FBQ3hEO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUNuQixJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO2FBQ2pDO1lBRUQsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFFOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7WUFDckIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7WUFDdkIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLG1CQUFtQixDQUFDO1lBRS9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLDBDQUFZLEdBQVo7UUFDUSxJQUFBLFNBQXNDLEVBQXBDLGtCQUFNLEVBQUUsNENBQTRCLENBQUM7UUFDN0MsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFDRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDaEMsSUFBQSxnQ0FBWSxDQUFVO1FBRTlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBRWpDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFsRUQsQ0FBd0MsaUNBQWUsR0FrRXREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9lcnJvck9iamVjdCc7XG5cbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcblxuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBhbiBgZXJyb3JgLiBJZiB0aGUgc291cmNlIE9ic2VydmFibGVcbiAqIGNhbGxzIGBlcnJvcmAsIHRoaXMgbWV0aG9kIHdpbGwgZW1pdCB0aGUgVGhyb3dhYmxlIHRoYXQgY2F1c2VkIHRoZSBlcnJvciB0byB0aGUgT2JzZXJ2YWJsZSByZXR1cm5lZCBmcm9tIGBub3RpZmllcmAuXG4gKiBJZiB0aGF0IE9ic2VydmFibGUgY2FsbHMgYGNvbXBsZXRlYCBvciBgZXJyb3JgIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBjYWxsIGBjb21wbGV0ZWAgb3IgYGVycm9yYCBvbiB0aGUgY2hpbGRcbiAqIHN1YnNjcmlwdGlvbi4gT3RoZXJ3aXNlIHRoaXMgbWV0aG9kIHdpbGwgcmVzdWJzY3JpYmUgdG8gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqICFbXShyZXRyeVdoZW4ucG5nKVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oZXJyb3JzOiBPYnNlcnZhYmxlKTogT2JzZXJ2YWJsZX0gbm90aWZpZXIgLSBSZWNlaXZlcyBhbiBPYnNlcnZhYmxlIG9mIG5vdGlmaWNhdGlvbnMgd2l0aCB3aGljaCBhXG4gKiB1c2VyIGNhbiBgY29tcGxldGVgIG9yIGBlcnJvcmAsIGFib3J0aW5nIHRoZSByZXRyeS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IFRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBtb2RpZmllZCB3aXRoIHJldHJ5IGxvZ2ljLlxuICogQG1ldGhvZCByZXRyeVdoZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXRyeVdoZW48VD4obm90aWZpZXI6IChlcnJvcnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBSZXRyeVdoZW5PcGVyYXRvcihub3RpZmllciwgc291cmNlKSk7XG59XG5cbmNsYXNzIFJldHJ5V2hlbk9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgbm90aWZpZXI6IChlcnJvcnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFJldHJ5V2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5ub3RpZmllciwgdGhpcy5zb3VyY2UpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgUmV0cnlXaGVuU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG5cbiAgcHJpdmF0ZSBlcnJvcnM6IFN1YmplY3Q8YW55PjtcbiAgcHJpdmF0ZSByZXRyaWVzOiBPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgcmV0cmllc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIG5vdGlmaWVyOiAoZXJyb3JzOiBPYnNlcnZhYmxlPGFueT4pID0+IE9ic2VydmFibGU8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcblxuICAgICAgbGV0IGVycm9ycyA9IHRoaXMuZXJyb3JzO1xuICAgICAgbGV0IHJldHJpZXM6IGFueSA9IHRoaXMucmV0cmllcztcbiAgICAgIGxldCByZXRyaWVzU3Vic2NyaXB0aW9uID0gdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uO1xuXG4gICAgICBpZiAoIXJldHJpZXMpIHtcbiAgICAgICAgZXJyb3JzID0gbmV3IFN1YmplY3QoKTtcbiAgICAgICAgcmV0cmllcyA9IHRyeUNhdGNoKHRoaXMubm90aWZpZXIpKGVycm9ycyk7XG4gICAgICAgIGlmIChyZXRyaWVzID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICAgIHJldHVybiBzdXBlci5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgICAgfVxuICAgICAgICByZXRyaWVzU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgcmV0cmllcyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmVycm9ycyA9IG51bGw7XG4gICAgICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuXG4gICAgICB0aGlzLmVycm9ycyA9IGVycm9ycztcbiAgICAgIHRoaXMucmV0cmllcyA9IHJldHJpZXM7XG4gICAgICB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gPSByZXRyaWVzU3Vic2NyaXB0aW9uO1xuXG4gICAgICBlcnJvcnMubmV4dChlcnIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgZXJyb3JzLCByZXRyaWVzU3Vic2NyaXB0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChlcnJvcnMpIHtcbiAgICAgIGVycm9ycy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5lcnJvcnMgPSBudWxsO1xuICAgIH1cbiAgICBpZiAocmV0cmllc1N1YnNjcmlwdGlvbikge1xuICAgICAgcmV0cmllc1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5yZXRyaWVzID0gbnVsbDtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgY29uc3QgeyBfdW5zdWJzY3JpYmUgfSA9IHRoaXM7XG5cbiAgICB0aGlzLl91bnN1YnNjcmliZSA9IG51bGw7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUgPSBfdW5zdWJzY3JpYmU7XG5cbiAgICB0aGlzLnNvdXJjZS5zdWJzY3JpYmUodGhpcyk7XG4gIH1cbn1cbiJdfQ==