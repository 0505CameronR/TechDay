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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3Vic2NyaWJlT25PYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL1N1YnNjcmliZU9uT2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSw0Q0FBMkM7QUFDM0MsMENBQXlDO0FBQ3pDLCtDQUE4QztBQU85Qzs7OztHQUlHO0FBQ0g7SUFBOEMseUNBQWE7SUFZekQsK0JBQW1CLE1BQXFCLEVBQ3BCLFNBQXFCLEVBQ3JCLFNBQStCO1FBRC9CLDBCQUFBLEVBQUEsYUFBcUI7UUFDckIsMEJBQUEsRUFBQSxZQUEyQixXQUFJO1FBRm5ELFlBR0UsaUJBQU8sU0FPUjtRQVZrQixZQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3BCLGVBQVMsR0FBVCxTQUFTLENBQVk7UUFDckIsZUFBUyxHQUFULFNBQVMsQ0FBc0I7UUFFakQsSUFBSSxDQUFDLHFCQUFTLENBQUMsU0FBUyxDQUFDLElBQUksU0FBUyxHQUFHLENBQUMsRUFBRTtZQUMxQyxLQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxTQUFTLElBQUksT0FBTyxTQUFTLENBQUMsUUFBUSxLQUFLLFVBQVUsRUFBRTtZQUMxRCxLQUFJLENBQUMsU0FBUyxHQUFHLFdBQUksQ0FBQztTQUN2Qjs7SUFDSCxDQUFDO0lBckJELGtCQUFrQjtJQUNYLDRCQUFNLEdBQWIsVUFBaUIsTUFBcUIsRUFBRSxLQUFpQixFQUFFLFNBQStCO1FBQWxELHNCQUFBLEVBQUEsU0FBaUI7UUFBRSwwQkFBQSxFQUFBLFlBQTJCLFdBQUk7UUFDeEYsT0FBTyxJQUFJLHFCQUFxQixDQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDN0QsQ0FBQztJQUVELGtCQUFrQjtJQUNYLDhCQUFRLEdBQWYsVUFBNkMsR0FBbUI7UUFDdEQsSUFBQSxtQkFBTSxFQUFFLDJCQUFVLENBQVM7UUFDbkMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBY0QseUVBQXlFO0lBQ3pFLDBDQUFVLEdBQVYsVUFBVyxVQUF5QjtRQUNsQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzdCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztRQUVqQyxPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQW1CLHFCQUFxQixDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUU7WUFDakYsTUFBTSxRQUFBLEVBQUUsVUFBVSxZQUFBO1NBQ25CLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFsQ0QsQ0FBOEMsdUJBQVUsR0FrQ3ZEO0FBbENZLHNEQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlckxpa2UsIFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBhc2FwIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzYXAnO1xuaW1wb3J0IHsgaXNOdW1lcmljIH0gZnJvbSAnLi4vdXRpbC9pc051bWVyaWMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIERpc3BhdGNoQXJnPFQ+IHtcbiAgc291cmNlOiBPYnNlcnZhYmxlPFQ+O1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqIEBoaWRlIHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmliZU9uT2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuICAvKiogQG5vY29sbGFwc2UgKi9cbiAgc3RhdGljIGNyZWF0ZTxUPihzb3VyY2U6IE9ic2VydmFibGU8VD4sIGRlbGF5OiBudW1iZXIgPSAwLCBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSBhc2FwKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBTdWJzY3JpYmVPbk9ic2VydmFibGUoc291cmNlLCBkZWxheSwgc2NoZWR1bGVyKTtcbiAgfVxuXG4gIC8qKiBAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBhcmc6IERpc3BhdGNoQXJnPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCB7IHNvdXJjZSwgc3Vic2NyaWJlciB9ID0gYXJnO1xuICAgIHJldHVybiB0aGlzLmFkZChzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZGVsYXlUaW1lOiBudW1iZXIgPSAwLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzYXApIHtcbiAgICBzdXBlcigpO1xuICAgIGlmICghaXNOdW1lcmljKGRlbGF5VGltZSkgfHwgZGVsYXlUaW1lIDwgMCkge1xuICAgICAgdGhpcy5kZWxheVRpbWUgPSAwO1xuICAgIH1cbiAgICBpZiAoIXNjaGVkdWxlciB8fCB0eXBlb2Ygc2NoZWR1bGVyLnNjaGVkdWxlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnNjaGVkdWxlciA9IGFzYXA7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICBjb25zdCBkZWxheSA9IHRoaXMuZGVsYXlUaW1lO1xuICAgIGNvbnN0IHNvdXJjZSA9IHRoaXMuc291cmNlO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEFyZzxhbnk+PihTdWJzY3JpYmVPbk9ic2VydmFibGUuZGlzcGF0Y2gsIGRlbGF5LCB7XG4gICAgICBzb3VyY2UsIHN1YnNjcmliZXJcbiAgICB9KTtcbiAgfVxufVxuIl19