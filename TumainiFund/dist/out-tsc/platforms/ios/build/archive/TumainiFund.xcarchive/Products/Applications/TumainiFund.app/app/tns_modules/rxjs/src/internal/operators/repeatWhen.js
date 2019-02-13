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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3JlcGVhdFdoZW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esc0NBQXFDO0FBRXJDLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFFbEQsc0RBQXFEO0FBRXJELCtEQUE4RDtBQUk5RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFJLFFBQTZEO0lBQ3pGLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTdDLENBQTZDLENBQUM7QUFDbEYsQ0FBQztBQUZELGdDQUVDO0FBRUQ7SUFDRSw0QkFBc0IsUUFBNkQ7UUFBN0QsYUFBUSxHQUFSLFFBQVEsQ0FBcUQ7SUFDbkYsQ0FBQztJQUVELGlDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF5Qyx3Q0FBcUI7SUFPNUQsOEJBQVksV0FBMEIsRUFDbEIsUUFBNkQsRUFDN0QsTUFBcUI7UUFGekMsWUFHRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFIbUIsY0FBUSxHQUFSLFFBQVEsQ0FBcUQ7UUFDN0QsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUpqQywrQkFBeUIsR0FBWSxJQUFJLENBQUM7O0lBTWxELENBQUM7SUFFRCx5Q0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCw2Q0FBYyxHQUFkLFVBQWUsUUFBK0I7UUFDNUMsSUFBSSxJQUFJLENBQUMseUJBQXlCLEtBQUssS0FBSyxFQUFFO1lBQzVDLE9BQU8saUJBQU0sUUFBUSxXQUFFLENBQUM7U0FDekI7SUFDSCxDQUFDO0lBRUQsdUNBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyx5QkFBeUIsR0FBRyxLQUFLLENBQUM7UUFFdkMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO2FBQzNCO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsSUFBSSxJQUFJLENBQUMsbUJBQW1CLENBQUMsTUFBTSxFQUFFO2dCQUNoRSxPQUFPLGlCQUFNLFFBQVEsV0FBRSxDQUFDO2FBQ3pCO1lBRUQsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7WUFDOUIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUMzQjtJQUNILENBQUM7SUFFRCx5RUFBeUU7SUFDekUsMkNBQVksR0FBWjtRQUNRLElBQUEsU0FBNkMsRUFBM0MsZ0NBQWEsRUFBRSw0Q0FBNEIsQ0FBQztRQUNwRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFDRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLHFEQUFzQixHQUF0QjtRQUNVLElBQUEsZ0NBQVksQ0FBVTtRQUU5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixpQkFBTSxzQkFBc0IsV0FBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGlEQUFrQixHQUExQjtRQUNFLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxpQkFBTyxFQUFFLENBQUM7UUFDbkMsSUFBTSxPQUFPLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzVELElBQUksT0FBTyxLQUFLLHlCQUFXLEVBQUU7WUFDM0IsT0FBTyxpQkFBTSxRQUFRLFdBQUUsQ0FBQztTQUN6QjtRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxxQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDOUQsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQTVFRCxDQUF5QyxpQ0FBZSxHQTRFdkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGEgYGNvbXBsZXRlYC4gSWYgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBjYWxscyBgY29tcGxldGVgLCB0aGlzIG1ldGhvZCB3aWxsIGVtaXQgdG8gdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSBgbm90aWZpZXJgLiBJZiB0aGF0IE9ic2VydmFibGVcbiAqIGNhbGxzIGBjb21wbGV0ZWAgb3IgYGVycm9yYCwgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGNhbGwgYGNvbXBsZXRlYCBvciBgZXJyb3JgIG9uIHRoZSBjaGlsZCBzdWJzY3JpcHRpb24uIE90aGVyd2lzZVxuICogdGhpcyBtZXRob2Qgd2lsbCByZXN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogIVtdKHJlcGVhdFdoZW4ucG5nKVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24obm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZSk6IE9ic2VydmFibGV9IG5vdGlmaWVyIC0gUmVjZWl2ZXMgYW4gT2JzZXJ2YWJsZSBvZiBub3RpZmljYXRpb25zIHdpdGhcbiAqIHdoaWNoIGEgdXNlciBjYW4gYGNvbXBsZXRlYCBvciBgZXJyb3JgLCBhYm9ydGluZyB0aGUgcmVwZXRpdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IFRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBtb2RpZmllZCB3aXRoIHJlcGVhdCBsb2dpYy5cbiAqIEBtZXRob2QgcmVwZWF0V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdFdoZW48VD4obm90aWZpZXI6IChub3RpZmljYXRpb25zOiBPYnNlcnZhYmxlPGFueT4pID0+IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgUmVwZWF0V2hlbk9wZXJhdG9yKG5vdGlmaWVyKSk7XG59XG5cbmNsYXNzIFJlcGVhdFdoZW5PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG5vdGlmaWVyOiAobm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmVwZWF0V2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5ub3RpZmllciwgc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFJlcGVhdFdoZW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIG5vdGlmaWNhdGlvbnM6IFN1YmplY3Q8YW55PjtcbiAgcHJpdmF0ZSByZXRyaWVzOiBPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgcmV0cmllc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIHNvdXJjZUlzQmVpbmdTdWJzY3JpYmVkVG86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIG5vdGlmaWVyOiAobm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLnNvdXJjZUlzQmVpbmdTdWJzY3JpYmVkVG8gPSB0cnVlO1xuICAgIHRoaXMuc291cmNlLnN1YnNjcmliZSh0aGlzKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgdGhpcy5zb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvID0gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBpZiAoIXRoaXMucmV0cmllcykge1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvUmV0cmllcygpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gfHwgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgbm90aWZpY2F0aW9ucywgcmV0cmllc1N1YnNjcmlwdGlvbiB9ID0gdGhpcztcbiAgICBpZiAobm90aWZpY2F0aW9ucykge1xuICAgICAgbm90aWZpY2F0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHJldHJpZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHJldHJpZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMucmV0cmllcyA9IG51bGw7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTogU3Vic2NyaWJlcjxUPiB7XG4gICAgY29uc3QgeyBfdW5zdWJzY3JpYmUgfSA9IHRoaXM7XG5cbiAgICB0aGlzLl91bnN1YnNjcmliZSA9IG51bGw7XG4gICAgc3VwZXIuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlID0gX3Vuc3Vic2NyaWJlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvUmV0cmllcygpIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBuZXcgU3ViamVjdCgpO1xuICAgIGNvbnN0IHJldHJpZXMgPSB0cnlDYXRjaCh0aGlzLm5vdGlmaWVyKSh0aGlzLm5vdGlmaWNhdGlvbnMpO1xuICAgIGlmIChyZXRyaWVzID09PSBlcnJvck9iamVjdCkge1xuICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMucmV0cmllcyA9IHJldHJpZXM7XG4gICAgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgcmV0cmllcyk7XG4gIH1cbn1cbiJdfQ==