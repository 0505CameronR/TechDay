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
var Observable_1 = require("../Observable");
var asap_1 = require("../scheduler/asap");
var isNumeric_1 = require("../util/isNumeric");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var SubscribeOnObservable = /** @class */ (function (_super) {
    __extends(SubscribeOnObservable, _super);
    function SubscribeOnObservable(source, delayTime, scheduler) {
        if (delayTime === void 0) { delayTime = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.delayTime = delayTime;
        _this.scheduler = scheduler;
        if (!isNumeric_1.isNumeric(delayTime) || delayTime < 0) {
            _this.delayTime = 0;
        }
        if (!scheduler || typeof scheduler.schedule !== 'function') {
            _this.scheduler = asap_1.asap;
        }
        return _this;
    }
    /** @nocollapse */
    SubscribeOnObservable.create = function (source, delay, scheduler) {
        if (delay === void 0) { delay = 0; }
        if (scheduler === void 0) { scheduler = asap_1.asap; }
        return new SubscribeOnObservable(source, delay, scheduler);
    };
    /** @nocollapse */
    SubscribeOnObservable.dispatch = function (arg) {
        var source = arg.source, subscriber = arg.subscriber;
        return this.add(source.subscribe(subscriber));
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    SubscribeOnObservable.prototype._subscribe = function (subscriber) {
        var delay = this.delayTime;
        var source = this.source;
        var scheduler = this.scheduler;
        return scheduler.schedule(SubscribeOnObservable.dispatch, delay, {
            source: source, subscriber: subscriber
        });
    };
    return SubscribeOnObservable;
}(Observable_1.Observable));
exports.SubscribeOnObservable = SubscribeOnObservable;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlT25PYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9TdWJzY3JpYmVPbk9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0EsNENBQTJDO0FBQzNDLDBDQUF5QztBQUN6QywrQ0FBOEM7QUFPOUM7Ozs7R0FJRztBQUNIO0lBQThDLHlDQUFhO0lBWXpELCtCQUFtQixNQUFxQixFQUNwQixTQUFxQixFQUNyQixTQUErQjtRQUQvQiwwQkFBQSxFQUFBLGFBQXFCO1FBQ3JCLDBCQUFBLEVBQUEsWUFBMkIsV0FBSTtRQUZuRCxZQUdFLGlCQUFPLFNBT1I7UUFWa0IsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUNwQixlQUFTLEdBQVQsU0FBUyxDQUFZO1FBQ3JCLGVBQVMsR0FBVCxTQUFTLENBQXNCO1FBRWpELElBQUksQ0FBQyxxQkFBUyxDQUFDLFNBQVMsQ0FBQyxJQUFJLFNBQVMsR0FBRyxDQUFDLEVBQUU7WUFDMUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7U0FDcEI7UUFDRCxJQUFJLENBQUMsU0FBUyxJQUFJLE9BQU8sU0FBUyxDQUFDLFFBQVEsS0FBSyxVQUFVLEVBQUU7WUFDMUQsS0FBSSxDQUFDLFNBQVMsR0FBRyxXQUFJLENBQUM7U0FDdkI7O0lBQ0gsQ0FBQztJQXJCRCxrQkFBa0I7SUFDWCw0QkFBTSxHQUFiLFVBQWlCLE1BQXFCLEVBQUUsS0FBaUIsRUFBRSxTQUErQjtRQUFsRCxzQkFBQSxFQUFBLFNBQWlCO1FBQUUsMEJBQUEsRUFBQSxZQUEyQixXQUFJO1FBQ3hGLE9BQU8sSUFBSSxxQkFBcUIsQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFFRCxrQkFBa0I7SUFDWCw4QkFBUSxHQUFmLFVBQTZDLEdBQW1CO1FBQ3RELElBQUEsbUJBQU0sRUFBRSwyQkFBVSxDQUFTO1FBQ25DLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQWNELHlFQUF5RTtJQUN6RSwwQ0FBVSxHQUFWLFVBQVcsVUFBeUI7UUFDbEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUM3QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFakMsT0FBTyxTQUFTLENBQUMsUUFBUSxDQUFtQixxQkFBcUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFO1lBQ2pGLE1BQU0sUUFBQSxFQUFFLFVBQVUsWUFBQTtTQUNuQixDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0gsNEJBQUM7QUFBRCxDQUFDLEFBbENELENBQThDLHVCQUFVLEdBa0N2RDtBQWxDWSxzREFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgYXNhcCB9IGZyb20gJy4uL3NjaGVkdWxlci9hc2FwJztcbmltcG9ydCB7IGlzTnVtZXJpYyB9IGZyb20gJy4uL3V0aWwvaXNOdW1lcmljJztcblxuZXhwb3J0IGludGVyZmFjZSBEaXNwYXRjaEFyZzxUPiB7XG4gIHNvdXJjZTogT2JzZXJ2YWJsZTxUPjtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKiBAaGlkZSB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJzY3JpYmVPbk9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcbiAgLyoqIEBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjcmVhdGU8VD4oc291cmNlOiBPYnNlcnZhYmxlPFQ+LCBkZWxheTogbnVtYmVyID0gMCwgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXNhcCk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBuZXcgU3Vic2NyaWJlT25PYnNlcnZhYmxlKHNvdXJjZSwgZGVsYXksIHNjaGVkdWxlcik7XG4gIH1cblxuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgYXJnOiBEaXNwYXRjaEFyZzxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3QgeyBzb3VyY2UsIHN1YnNjcmliZXIgfSA9IGFyZztcbiAgICByZXR1cm4gdGhpcy5hZGQoc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGRlbGF5VGltZTogbnVtYmVyID0gMCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc2FwKSB7XG4gICAgc3VwZXIoKTtcbiAgICBpZiAoIWlzTnVtZXJpYyhkZWxheVRpbWUpIHx8IGRlbGF5VGltZSA8IDApIHtcbiAgICAgIHRoaXMuZGVsYXlUaW1lID0gMDtcbiAgICB9XG4gICAgaWYgKCFzY2hlZHVsZXIgfHwgdHlwZW9mIHNjaGVkdWxlci5zY2hlZHVsZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5zY2hlZHVsZXIgPSBhc2FwO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgY29uc3QgZGVsYXkgPSB0aGlzLmRlbGF5VGltZTtcbiAgICBjb25zdCBzb3VyY2UgPSB0aGlzLnNvdXJjZTtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcblxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hBcmc8YW55Pj4oU3Vic2NyaWJlT25PYnNlcnZhYmxlLmRpc3BhdGNoLCBkZWxheSwge1xuICAgICAgc291cmNlLCBzdWJzY3JpYmVyXG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==