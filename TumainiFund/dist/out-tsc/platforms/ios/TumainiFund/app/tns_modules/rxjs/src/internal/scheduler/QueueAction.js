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
var AsyncAction_1 = require("./AsyncAction");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var QueueAction = /** @class */ (function (_super) {
    __extends(QueueAction, _super);
    function QueueAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    QueueAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (delay > 0) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.delay = delay;
        this.state = state;
        this.scheduler.flush(this);
        return this;
    };
    QueueAction.prototype.execute = function (state, delay) {
        return (delay > 0 || this.closed) ?
            _super.prototype.execute.call(this, state, delay) :
            this._execute(state, delay);
    };
    QueueAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Otherwise flush the scheduler starting with this action.
        return scheduler.flush(this);
    };
    return QueueAction;
}(AsyncAction_1.AsyncAction));
exports.QueueAction = QueueAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvUXVldWVBY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTRDO0FBSzVDOzs7O0dBSUc7QUFDSDtJQUFvQywrQkFBYztJQUVoRCxxQkFBc0IsU0FBeUIsRUFDekIsSUFBbUQ7UUFEekUsWUFFRSxrQkFBTSxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQ3ZCO1FBSHFCLGVBQVMsR0FBVCxTQUFTLENBQWdCO1FBQ3pCLFVBQUksR0FBSixJQUFJLENBQStDOztJQUV6RSxDQUFDO0lBRU0sOEJBQVEsR0FBZixVQUFnQixLQUFTLEVBQUUsS0FBaUI7UUFBakIsc0JBQUEsRUFBQSxTQUFpQjtRQUMxQyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixPQUFPLGlCQUFNLFFBQVEsWUFBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQixPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTSw2QkFBTyxHQUFkLFVBQWUsS0FBUSxFQUFFLEtBQWE7UUFDcEMsT0FBTyxDQUFDLEtBQUssR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7WUFDakMsaUJBQU0sT0FBTyxZQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFFO0lBQ2pDLENBQUM7SUFFUyxvQ0FBYyxHQUF4QixVQUF5QixTQUF5QixFQUFFLEVBQVEsRUFBRSxLQUFpQjtRQUFqQixzQkFBQSxFQUFBLFNBQWlCO1FBQzdFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN2RSxPQUFPLGlCQUFNLGNBQWMsWUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25EO1FBQ0QsMkRBQTJEO1FBQzNELE9BQU8sU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBakNELENBQW9DLHlCQUFXLEdBaUM5QztBQWpDWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgUXVldWVTY2hlZHVsZXIgfSBmcm9tICcuL1F1ZXVlU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBRdWV1ZUFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBRdWV1ZVNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKGRlbGF5ID4gMCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy5zY2hlZHVsZXIuZmx1c2godGhpcyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwdWJsaWMgZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgcmV0dXJuIChkZWxheSA+IDAgfHwgdGhpcy5jbG9zZWQpID9cbiAgICAgIHN1cGVyLmV4ZWN1dGUoc3RhdGUsIGRlbGF5KSA6XG4gICAgICB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSkgO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogUXVldWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgZGVsYXkgZXhpc3RzIGFuZCBpcyBncmVhdGVyIHRoYW4gMCwgb3IgaWYgdGhlIGRlbGF5IGlzIG51bGwgKHRoZVxuICAgIC8vIGFjdGlvbiB3YXNuJ3QgcmVzY2hlZHVsZWQpIGJ1dCB3YXMgb3JpZ2luYWxseSBzY2hlZHVsZWQgYXMgYW4gYXN5bmNcbiAgICAvLyBhY3Rpb24sIHRoZW4gcmVjeWNsZSBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKChkZWxheSAhPT0gbnVsbCAmJiBkZWxheSA+IDApIHx8IChkZWxheSA9PT0gbnVsbCAmJiB0aGlzLmRlbGF5ID4gMCkpIHtcbiAgICAgIHJldHVybiBzdXBlci5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSBmbHVzaCB0aGUgc2NoZWR1bGVyIHN0YXJ0aW5nIHdpdGggdGhpcyBhY3Rpb24uXG4gICAgcmV0dXJuIHNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgfVxufVxuIl19