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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUXVldWVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9RdWV1ZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEM7QUFLNUM7Ozs7R0FJRztBQUNIO0lBQW9DLCtCQUFjO0lBRWhELHFCQUFzQixTQUF5QixFQUN6QixJQUFtRDtRQUR6RSxZQUVFLGtCQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FDdkI7UUFIcUIsZUFBUyxHQUFULFNBQVMsQ0FBZ0I7UUFDekIsVUFBSSxHQUFKLElBQUksQ0FBK0M7O0lBRXpFLENBQUM7SUFFTSw4QkFBUSxHQUFmLFVBQWdCLEtBQVMsRUFBRSxLQUFpQjtRQUFqQixzQkFBQSxFQUFBLFNBQWlCO1FBQzFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNiLE9BQU8saUJBQU0sUUFBUSxZQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUNELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNCLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVNLDZCQUFPLEdBQWQsVUFBZSxLQUFRLEVBQUUsS0FBYTtRQUNwQyxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztZQUNqQyxpQkFBTSxPQUFPLFlBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDN0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUU7SUFDakMsQ0FBQztJQUVTLG9DQUFjLEdBQXhCLFVBQXlCLFNBQXlCLEVBQUUsRUFBUSxFQUFFLEtBQWlCO1FBQWpCLHNCQUFBLEVBQUEsU0FBaUI7UUFDN0Usc0VBQXNFO1FBQ3RFLHNFQUFzRTtRQUN0RSwyQ0FBMkM7UUFDM0MsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQ3ZFLE9BQU8saUJBQU0sY0FBYyxZQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkQ7UUFDRCwyREFBMkQ7UUFDM0QsT0FBTyxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFDSCxrQkFBQztBQUFELENBQUMsQUFqQ0QsQ0FBb0MseUJBQVcsR0FpQzlDO0FBakNZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBRdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vUXVldWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFF1ZXVlQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IFF1ZXVlU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gICAgdGhpcy5kZWxheSA9IGRlbGF5O1xuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgICB0aGlzLnNjaGVkdWxlci5mbHVzaCh0aGlzKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHB1YmxpYyBleGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICByZXR1cm4gKGRlbGF5ID4gMCB8fCB0aGlzLmNsb3NlZCkgP1xuICAgICAgc3VwZXIuZXhlY3V0ZShzdGF0ZSwgZGVsYXkpIDpcbiAgICAgIHRoaXMuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KSA7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBRdWV1ZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlIGZsdXNoIHRoZSBzY2hlZHVsZXIgc3RhcnRpbmcgd2l0aCB0aGlzIGFjdGlvbi5cbiAgICByZXR1cm4gc2NoZWR1bGVyLmZsdXNoKHRoaXMpO1xuICB9XG59XG4iXX0=