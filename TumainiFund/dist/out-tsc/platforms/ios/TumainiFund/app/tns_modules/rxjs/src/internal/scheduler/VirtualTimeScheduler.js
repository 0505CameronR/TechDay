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
var AsyncScheduler_1 = require("./AsyncScheduler");
var VirtualTimeScheduler = /** @class */ (function (_super) {
    __extends(VirtualTimeScheduler, _super);
    function VirtualTimeScheduler(SchedulerAction, maxFrames) {
        if (SchedulerAction === void 0) { SchedulerAction = VirtualAction; }
        if (maxFrames === void 0) { maxFrames = Number.POSITIVE_INFINITY; }
        var _this = _super.call(this, SchedulerAction, function () { return _this.frame; }) || this;
        _this.maxFrames = maxFrames;
        _this.frame = 0;
        _this.index = -1;
        return _this;
    }
    /**
     * Prompt the Scheduler to execute all of its queued actions, therefore
     * clearing its queue.
     * @return {void}
     */
    VirtualTimeScheduler.prototype.flush = function () {
        var _a = this, actions = _a.actions, maxFrames = _a.maxFrames;
        var error, action;
        while ((action = actions.shift()) && (this.frame = action.delay) <= maxFrames) {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        }
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    };
    VirtualTimeScheduler.frameTimeFactor = 10;
    return VirtualTimeScheduler;
}(AsyncScheduler_1.AsyncScheduler));
exports.VirtualTimeScheduler = VirtualTimeScheduler;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @nodoc
 */
var VirtualAction = /** @class */ (function (_super) {
    __extends(VirtualAction, _super);
    function VirtualAction(scheduler, work, index) {
        if (index === void 0) { index = scheduler.index += 1; }
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.index = index;
        _this.active = true;
        _this.index = scheduler.index = index;
        return _this;
    }
    VirtualAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (!this.id) {
            return _super.prototype.schedule.call(this, state, delay);
        }
        this.active = false;
        // If an action is rescheduled, we save allocations by mutating its state,
        // pushing it to the end of the scheduler queue, and recycling the action.
        // But since the VirtualTimeScheduler is used for testing, VirtualActions
        // must be immutable so they can be inspected later.
        var action = new VirtualAction(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
    };
    VirtualAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        this.delay = scheduler.frame + delay;
        var actions = scheduler.actions;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
    };
    VirtualAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return undefined;
    };
    VirtualAction.prototype._execute = function (state, delay) {
        if (this.active === true) {
            return _super.prototype._execute.call(this, state, delay);
        }
    };
    VirtualAction.sortActions = function (a, b) {
        if (a.delay === b.delay) {
            if (a.index === b.index) {
                return 0;
            }
            else if (a.index > b.index) {
                return 1;
            }
            else {
                return -1;
            }
        }
        else if (a.delay > b.delay) {
            return 1;
        }
        else {
            return -1;
        }
    };
    return VirtualAction;
}(AsyncAction_1.AsyncAction));
exports.VirtualAction = VirtualAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlydHVhbFRpbWVTY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQTRDO0FBRTVDLG1EQUFrRDtBQUdsRDtJQUEwQyx3Q0FBYztJQU90RCw4QkFBWSxlQUEwRCxFQUNuRCxTQUE0QztRQURuRCxnQ0FBQSxFQUFBLGtCQUFzQyxhQUFvQjtRQUNuRCwwQkFBQSxFQUFBLFlBQW9CLE1BQU0sQ0FBQyxpQkFBaUI7UUFEL0QsWUFFRSxrQkFBTSxlQUFlLEVBQUUsY0FBTSxPQUFBLEtBQUksQ0FBQyxLQUFLLEVBQVYsQ0FBVSxDQUFDLFNBQ3pDO1FBRmtCLGVBQVMsR0FBVCxTQUFTLENBQW1DO1FBSnhELFdBQUssR0FBVyxDQUFDLENBQUM7UUFDbEIsV0FBSyxHQUFXLENBQUMsQ0FBQyxDQUFDOztJQUsxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLG9DQUFLLEdBQVo7UUFFUSxJQUFBLFNBQTJCLEVBQTFCLG9CQUFPLEVBQUUsd0JBQWlCLENBQUM7UUFDbEMsSUFBSSxLQUFVLEVBQUUsTUFBd0IsQ0FBQztRQUV6QyxPQUFPLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksU0FBUyxFQUFFO1lBQzdFLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUU7Z0JBQ3RELE1BQU07YUFDUDtTQUNGO1FBRUQsSUFBSSxLQUFLLEVB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LENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUM1QixPQUFPLENBQUMsQ0FBQztTQUNWO2FBQU07WUFDTCxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQ1g7SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBMURELENBQXNDLHlCQUFXLEdBMERoRDtBQTFEWSxzQ0FBYSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUaW1lU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgZnJhbWVUaW1lRmFjdG9yOiBudW1iZXIgPSAxMDtcblxuICBwdWJsaWMgZnJhbWU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IoU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQXN5bmNBY3Rpb24gPSBWaXJ0dWFsQWN0aW9uIGFzIGFueSxcbiAgICAgICAgICAgICAgcHVibGljIG1heEZyYW1lczogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgc3VwZXIoU2NoZWR1bGVyQWN0aW9uLCAoKSA9PiB0aGlzLmZyYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tcHQgdGhlIFNjaGVkdWxlciB0byBleGVjdXRlIGFsbCBvZiBpdHMgcXVldWVkIGFjdGlvbnMsIHRoZXJlZm9yZVxuICAgKiBjbGVhcmluZyBpdHMgcXVldWUuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBwdWJsaWMgZmx1c2goKTogdm9pZCB7XG5cbiAgICBjb25zdCB7YWN0aW9ucywgbWF4RnJhbWVzfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnksIGFjdGlvbjogQXN5bmNBY3Rpb248YW55PjtcblxuICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSAmJiAodGhpcy5mcmFtZSA9IGFjdGlvbi5kZWxheSkgPD0gbWF4RnJhbWVzKSB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSB7XG4gICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBub2RvY1xuICovXG5leHBvcnQgY2xhc3MgVmlydHVhbEFjdGlvbjxUPiBleHRlbmRzIEFzeW5jQWN0aW9uPFQ+IHtcblxuICBwcm90ZWN0ZWQgYWN0aXZlOiBib29sZWFuID0gdHJ1ZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBWaXJ0dWFsVGltZVNjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIGluZGV4OiBudW1iZXIgPSBzY2hlZHVsZXIuaW5kZXggKz0gMSkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gICAgdGhpcy5pbmRleCA9IHNjaGVkdWxlci5pbmRleCA9IGluZGV4O1xuICB9XG5cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICghdGhpcy5pZCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxuICAgIHRoaXMuYWN0aXZlID0gZmFsc2U7XG4gICAgLy8gSWYgYW4gYWN0aW9uIGlzIHJlc2NoZWR1bGVkLCB3ZSBzYXZlIGFsbG9jYXRpb25zIGJ5IG11dGF0aW5nIGl0cyBzdGF0ZSxcbiAgICAvLyBwdXNoaW5nIGl0IHRvIHRoZSBlbmQgb2YgdGhlIHNjaGVkdWxlciBxdWV1ZSwgYW5kIHJlY3ljbGluZyB0aGUgYWN0aW9uLlxuICAgIC8vIEJ1dCBzaW5jZSB0aGUgVmlydHVhbFRpbWVTY2hlZHVsZXIgaXMgdXNlZCBmb3IgdGVzdGluZywgVmlydHVhbEFjdGlvbnNcbiAgICAvLyBtdXN0IGJlIGltbXV0YWJsZSBzbyB0aGV5IGNhbiBiZSBpbnNwZWN0ZWQgbGF0ZXIuXG4gICAgY29uc3QgYWN0aW9uID0gbmV3IFZpcnR1YWxBY3Rpb24odGhpcy5zY2hlZHVsZXIsIHRoaXMud29yayk7XG4gICAgdGhpcy5hZGQoYWN0aW9uKTtcbiAgICByZXR1cm4gYWN0aW9uLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyOiBWaXJ0dWFsVGltZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICB0aGlzLmRlbGF5ID0gc2NoZWR1bGVyLmZyYW1lICsgZGVsYXk7XG4gICAgY29uc3Qge2FjdGlvbnN9ID0gc2NoZWR1bGVyO1xuICAgIGFjdGlvbnMucHVzaCh0aGlzKTtcbiAgICAoYWN0aW9ucyBhcyBBcnJheTxWaXJ0dWFsQWN0aW9uPFQ+Pikuc29ydChWaXJ0dWFsQWN0aW9uLnNvcnRBY3Rpb25zKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2V4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gdHJ1ZSkge1xuICAgICAgcmV0dXJuIHN1cGVyLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHN0YXRpYyBzb3J0QWN0aW9uczxUPihhOiBWaXJ0dWFsQWN0aW9uPFQ+LCBiOiBWaXJ0dWFsQWN0aW9uPFQ+KSB7XG4gICAgaWYgKGEuZGVsYXkgPT09IGIuZGVsYXkpIHtcbiAgICAgIGlmIChhLmluZGV4ID09PSBiLmluZGV4KSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIGlmIChhLmluZGV4ID4gYi5pbmRleCkge1xuICAgICAgICByZXR1cm4gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiAtMTtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKGEuZGVsYXkgPiBiLmRlbGF5KSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIC0xO1xuICAgIH1cbiAgfVxufVxuIl19