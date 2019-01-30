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
 * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
 * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
 * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
 * this method will resubscribe to the source Observable.
 *
 * ![](repeatWhen.png)
 *
 * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
 * which a user can `complete` or `error`, aborting the repetition.
 * @return {Observable} The source Observable modified with repeat logic.
 * @method repeatWhen
 * @owner Observable
 */
function repeatWhen(notifier) {
    return function (source) { return source.lift(new RepeatWhenOperator(notifier)); };
}
exports.repeatWhen = repeatWhen;
var RepeatWhenOperator = /** @class */ (function () {
    function RepeatWhenOperator(notifier) {
        this.notifier = notifier;
    }
    RepeatWhenOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
    };
    return RepeatWhenOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RepeatWhenSubscriber = /** @class */ (function (_super) {
    __extends(RepeatWhenSubscriber, _super);
    function RepeatWhenSubscriber(destination, notifier, source) {
        var _this = _super.call(this, destination) || this;
        _this.notifier = notifier;
        _this.source = source;
        _this.sourceIsBeingSubscribedTo = true;
        return _this;
    }
    RepeatWhenSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    };
    RepeatWhenSubscriber.prototype.notifyComplete = function (innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return _super.prototype.complete.call(this);
        }
    };
    RepeatWhenSubscriber.prototype.complete = function () {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return _super.prototype.complete.call(this);
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    RepeatWhenSubscriber.prototype._unsubscribe = function () {
        var _a = this, notifications = _a.notifications, retriesSubscription = _a.retriesSubscription;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    RepeatWhenSubscriber.prototype._unsubscribeAndRecycle = function () {
        var _unsubscribe = this._unsubscribe;
        this._unsubscribe = null;
        _super.prototype._unsubscribeAndRecycle.call(this);
        this._unsubscribe = _unsubscribe;
        return this;
    };
    RepeatWhenSubscriber.prototype.subscribeToRetries = function () {
        this.notifications = new Subject_1.Subject();
        var retries = tryCatch_1.tryCatch(this.notifier)(this.notifications);
        if (retries === errorObject_1.errorObject) {
            return _super.prototype.complete.call(this);
        }
        this.retries = retries;
        this.retriesSubscription = subscribeToResult_1.subscribeToResult(this, retries);
    };
    return RepeatWhenSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9yZXBlYXRXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLHNDQUFxQztBQUVyQyw2Q0FBNEM7QUFDNUMsbURBQWtEO0FBRWxELHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFJOUQ7Ozs7Ozs7Ozs7Ozs7R0FhRztBQUNILFNBQWdCLFVBQVUsQ0FBSSxRQUE2RDtJQUN6RixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUE3QyxDQUE2QyxDQUFDO0FBQ2xGLENBQUM7QUFGRCxnQ0FFQztBQUVEO0lBQ0UsNEJBQXNCLFFBQTZEO1FBQTdELGFBQVEsR0FBUixRQUFRLENBQXFEO0lBQ25GLENBQUM7SUFFRCxpQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBeUMsd0NBQXFCO0lBTzVELDhCQUFZLFdBQTBCLEVBQ2xCLFFBQTZELEVBQzdELE1BQXFCO1FBRnpDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGNBQVEsR0FBUixRQUFRLENBQXFEO1FBQzdELFlBQU0sR0FBTixNQUFNLENBQWU7UUFKakMsK0JBQXlCLEdBQVksSUFBSSxDQUFDOztJQU1sRCxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLHlCQUF5QixHQUFHLElBQUksQ0FBQztRQUN0QyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsNkNBQWMsR0FBZCxVQUFlLFFBQStCO1FBQzVDLElBQUksSUFBSSxDQUFDLHlCQUF5QixLQUFLLEtBQUssRUFBRTtZQUM1QyxPQUFPLGlCQUFNLFFBQVEsV0FBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELHVDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMseUJBQXlCLEdBQUcsS0FBSyxDQUFDO1FBRXZDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRTtnQkFDaEUsT0FBTyxpQkFBTSxRQUFRLFdBQUUsQ0FBQzthQUN6QjtZQUVELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDM0I7SUFDSCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLDJDQUFZLEdBQVo7UUFDUSxJQUFBLFNBQTZDLEVBQTNDLGdDQUFhLEVBQUUsNENBQTRCLENBQUM7UUFDcEQsSUFBSSxhQUFhLEVBQUU7WUFDakIsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQzVCLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDO1NBQzNCO1FBQ0QsSUFBSSxtQkFBbUIsRUFBRTtZQUN2QixtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNsQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1NBQ2pDO1FBQ0QsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7SUFDdEIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxxREFBc0IsR0FBdEI7UUFDVSxJQUFBLGdDQUFZLENBQVU7UUFFOUIsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsaUJBQU0sc0JBQXNCLFdBQUUsQ0FBQztRQUMvQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUVqQyxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxpREFBa0IsR0FBMUI7UUFDRSxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksaUJBQU8sRUFBRSxDQUFDO1FBQ25DLElBQU0sT0FBTyxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUM1RCxJQUFJLE9BQU8sS0FBSyx5QkFBVyxFQUFFO1lBQzNCLE9BQU8saUJBQU0sUUFBUSxXQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsbUJBQW1CLEdBQUcscUNBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUE1RUQsQ0FBeUMsaUNBQWUsR0E0RXZEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9lcnJvck9iamVjdCc7XG5cbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcblxuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiBhIGBjb21wbGV0ZWAuIElmIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgY2FsbHMgYGNvbXBsZXRlYCwgdGhpcyBtZXRob2Qgd2lsbCBlbWl0IHRvIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gYG5vdGlmaWVyYC4gSWYgdGhhdCBPYnNlcnZhYmxlXG4gKiBjYWxscyBgY29tcGxldGVgIG9yIGBlcnJvcmAsIHRoZW4gdGhpcyBtZXRob2Qgd2lsbCBjYWxsIGBjb21wbGV0ZWAgb3IgYGVycm9yYCBvbiB0aGUgY2hpbGQgc3Vic2NyaXB0aW9uLiBPdGhlcndpc2VcbiAqIHRoaXMgbWV0aG9kIHdpbGwgcmVzdWJzY3JpYmUgdG8gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqICFbXShyZXBlYXRXaGVuLnBuZylcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKG5vdGlmaWNhdGlvbnM6IE9ic2VydmFibGUpOiBPYnNlcnZhYmxlfSBub3RpZmllciAtIFJlY2VpdmVzIGFuIE9ic2VydmFibGUgb2Ygbm90aWZpY2F0aW9ucyB3aXRoXG4gKiB3aGljaCBhIHVzZXIgY2FuIGBjb21wbGV0ZWAgb3IgYGVycm9yYCwgYWJvcnRpbmcgdGhlIHJlcGV0aXRpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBUaGUgc291cmNlIE9ic2VydmFibGUgbW9kaWZpZWQgd2l0aCByZXBlYXQgbG9naWMuXG4gKiBAbWV0aG9kIHJlcGVhdFdoZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZXBlYXRXaGVuPFQ+KG5vdGlmaWVyOiAobm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFJlcGVhdFdoZW5PcGVyYXRvcihub3RpZmllcikpO1xufVxuXG5jbGFzcyBSZXBlYXRXaGVuT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBub3RpZmllcjogKG5vdGlmaWNhdGlvbnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFJlcGVhdFdoZW5TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMubm90aWZpZXIsIHNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBSZXBlYXRXaGVuU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG5cbiAgcHJpdmF0ZSBub3RpZmljYXRpb25zOiBTdWJqZWN0PGFueT47XG4gIHByaXZhdGUgcmV0cmllczogT2JzZXJ2YWJsZTxhbnk+O1xuICBwcml2YXRlIHJldHJpZXNTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBzb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBub3RpZmllcjogKG5vdGlmaWNhdGlvbnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5zb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvID0gdHJ1ZTtcbiAgICB0aGlzLnNvdXJjZS5zdWJzY3JpYmUodGhpcyk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc291cmNlSXNCZWluZ1N1YnNjcmliZWRUbyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBzdXBlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCkge1xuICAgIHRoaXMuc291cmNlSXNCZWluZ1N1YnNjcmliZWRUbyA9IGZhbHNlO1xuXG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgaWYgKCF0aGlzLnJldHJpZXMpIHtcbiAgICAgICAgdGhpcy5zdWJzY3JpYmVUb1JldHJpZXMoKTtcbiAgICAgIH1cbiAgICAgIGlmICghdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uIHx8IHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zLm5leHQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IG5vdGlmaWNhdGlvbnMsIHJldHJpZXNTdWJzY3JpcHRpb24gfSA9IHRoaXM7XG4gICAgaWYgKG5vdGlmaWNhdGlvbnMpIHtcbiAgICAgIG5vdGlmaWNhdGlvbnMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMubm90aWZpY2F0aW9ucyA9IG51bGw7XG4gICAgfVxuICAgIGlmIChyZXRyaWVzU3Vic2NyaXB0aW9uKSB7XG4gICAgICByZXRyaWVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnJldHJpZXMgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk6IFN1YnNjcmliZXI8VD4ge1xuICAgIGNvbnN0IHsgX3Vuc3Vic2NyaWJlIH0gPSB0aGlzO1xuXG4gICAgdGhpcy5fdW5zdWJzY3JpYmUgPSBudWxsO1xuICAgIHN1cGVyLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTtcbiAgICB0aGlzLl91bnN1YnNjcmliZSA9IF91bnN1YnNjcmliZTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb1JldHJpZXMoKSB7XG4gICAgdGhpcy5ub3RpZmljYXRpb25zID0gbmV3IFN1YmplY3QoKTtcbiAgICBjb25zdCByZXRyaWVzID0gdHJ5Q2F0Y2godGhpcy5ub3RpZmllcikodGhpcy5ub3RpZmljYXRpb25zKTtcbiAgICBpZiAocmV0cmllcyA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgIHJldHVybiBzdXBlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnJldHJpZXMgPSByZXRyaWVzO1xuICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIHJldHJpZXMpO1xuICB9XG59XG4iXX0=