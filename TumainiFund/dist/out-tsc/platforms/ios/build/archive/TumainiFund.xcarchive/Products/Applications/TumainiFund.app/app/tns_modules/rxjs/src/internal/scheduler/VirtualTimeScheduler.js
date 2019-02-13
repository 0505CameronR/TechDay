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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlydHVhbFRpbWVTY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9WaXJ0dWFsVGltZVNjaGVkdWxlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEM7QUFFNUMsbURBQWtEO0FBR2xEO0lBQTBDLHdDQUFjO0lBT3RELDhCQUFZLGVBQTBELEVBQ25ELFNBQTRDO1FBRG5ELGdDQUFBLEVBQUEsa0JBQXNDLGFBQW9CO1FBQ25ELDBCQUFBLEVBQUEsWUFBb0IsTUFBTSxDQUFDLGlCQUFpQjtRQUQvRCxZQUVFLGtCQUFNLGVBQWUsRUFBRSxjQUFNLE9BQUEsS0FBSSxDQUFDLEtBQUssRUFBVixDQUFVLENBQUMsU0FDekM7UUFGa0IsZUFBUyxHQUFULFNBQVMsQ0FBbUM7UUFKeEQsV0FBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixXQUFLLEdBQVcsQ0FBQyxDQUFDLENBQUM7O0lBSzFCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksb0NBQUssR0FBWjtRQUVRLElBQUEsU0FBMkIsRUFBMUIsb0JBQU8sRUFBRSx3QkFBaUIsQ0FBQztRQUNsQyxJQUFJLEtBQVUsRUFBRSxNQUF3QixDQUFDO1FBRXpDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxTQUFTLEVBQUU7WUFDN0UsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENB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QkFDNUIsT0FBTyxDQUFDLENBQUM7YUFDVjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7U0FDRjthQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUExREQsQ0FBc0MseUJBQVcsR0EwRGhEO0FBMURZLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgY2xhc3MgVmlydHVhbFRpbWVTY2hlZHVsZXIgZXh0ZW5kcyBBc3luY1NjaGVkdWxlciB7XG5cbiAgcHJvdGVjdGVkIHN0YXRpYyBmcmFtZVRpbWVGYWN0b3I6IG51bWJlciA9IDEwO1xuXG4gIHB1YmxpYyBmcmFtZTogbnVtYmVyID0gMDtcbiAgcHVibGljIGluZGV4OiBudW1iZXIgPSAtMTtcblxuICBjb25zdHJ1Y3RvcihTY2hlZHVsZXJBY3Rpb246IHR5cGVvZiBBc3luY0FjdGlvbiA9IFZpcnR1YWxBY3Rpb24gYXMgYW55LFxuICAgICAgICAgICAgICBwdWJsaWMgbWF4RnJhbWVzOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICBzdXBlcihTY2hlZHVsZXJBY3Rpb24sICgpID0+IHRoaXMuZnJhbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByb21wdCB0aGUgU2NoZWR1bGVyIHRvIGV4ZWN1dGUgYWxsIG9mIGl0cyBxdWV1ZWQgYWN0aW9ucywgdGhlcmVmb3JlXG4gICAqIGNsZWFyaW5nIGl0cyBxdWV1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIHB1YmxpYyBmbHVzaCgpOiB2b2lkIHtcblxuICAgIGNvbnN0IHthY3Rpb25zLCBtYXhGcmFtZXN9ID0gdGhpcztcbiAgICBsZXQgZXJyb3I6IGFueSwgYWN0aW9uOiBBc3luY0FjdGlvbjxhbnk+O1xuXG4gICAgd2hpbGUgKChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpICYmICh0aGlzLmZyYW1lID0gYWN0aW9uLmRlbGF5KSA8PSBtYXhGcmFtZXMpIHtcbiAgICAgIGlmIChlcnJvciA9IGFjdGlvbi5leGVjdXRlKGFjdGlvbi5zdGF0ZSwgYWN0aW9uLmRlbGF5KSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZXJyb3IpIHtcbiAgICAgIHdoaWxlIChhY3Rpb24gPSBhY3Rpb25zLnNoaWZ0KCkpIHtcbiAgICAgICAgYWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQG5vZG9jXG4gKi9cbmV4cG9ydCBjbGFzcyBWaXJ0dWFsQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIHByb3RlY3RlZCBhY3RpdmU6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgaW5kZXg6IG51bWJlciA9IHNjaGVkdWxlci5pbmRleCArPSAxKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgICB0aGlzLmluZGV4ID0gc2NoZWR1bGVyLmluZGV4ID0gaW5kZXg7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKCF0aGlzLmlkKSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gICAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbiAgICAvLyBJZiBhbiBhY3Rpb24gaXMgcmVzY2hlZHVsZWQsIHdlIHNhdmUgYWxsb2NhdGlvbnMgYnkgbXV0YXRpbmcgaXRzIHN0YXRlLFxuICAgIC8vIHB1c2hpbmcgaXQgdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLCBhbmQgcmVjeWNsaW5nIHRoZSBhY3Rpb24uXG4gICAgLy8gQnV0IHNpbmNlIHRoZSBWaXJ0dWFsVGltZVNjaGVkdWxlciBpcyB1c2VkIGZvciB0ZXN0aW5nLCBWaXJ0dWFsQWN0aW9uc1xuICAgIC8vIG11c3QgYmUgaW1tdXRhYmxlIHNvIHRoZXkgY2FuIGJlIGluc3BlY3RlZCBsYXRlci5cbiAgICBjb25zdCBhY3Rpb24gPSBuZXcgVmlydHVhbEFjdGlvbih0aGlzLnNjaGVkdWxlciwgdGhpcy53b3JrKTtcbiAgICB0aGlzLmFkZChhY3Rpb24pO1xuICAgIHJldHVybiBhY3Rpb24uc2NoZWR1bGUoc3RhdGUsIGRlbGF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IFZpcnR1YWxUaW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHRoaXMuZGVsYXkgPSBzY2hlZHVsZXIuZnJhbWUgKyBkZWxheTtcbiAgICBjb25zdCB7YWN0aW9uc30gPSBzY2hlZHVsZXI7XG4gICAgYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIChhY3Rpb25zIGFzIEFycmF5PFZpcnR1YWxBY3Rpb248VD4+KS5zb3J0KFZpcnR1YWxBY3Rpb24uc29ydEFjdGlvbnMpO1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlY3ljbGVBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gc3VwZXIuX2V4ZWN1dGUoc3RhdGUsIGRlbGF5KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHNvcnRBY3Rpb25zPFQ+KGE6IFZpcnR1YWxBY3Rpb248VD4sIGI6IFZpcnR1YWxBY3Rpb248VD4pIHtcbiAgICBpZiAoYS5kZWxheSA9PT0gYi5kZWxheSkge1xuICAgICAgaWYgKGEuaW5kZXggPT09IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2UgaWYgKGEuaW5kZXggPiBiLmluZGV4KSB7XG4gICAgICAgIHJldHVybiAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYS5kZWxheSA+IGIuZGVsYXkpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gLTE7XG4gICAgfVxuICB9XG59XG4iXX0=