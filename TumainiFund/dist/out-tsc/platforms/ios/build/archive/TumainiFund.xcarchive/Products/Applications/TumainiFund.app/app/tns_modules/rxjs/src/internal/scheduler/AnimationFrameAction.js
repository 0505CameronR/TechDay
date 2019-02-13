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
var AnimationFrameAction = /** @class */ (function (_super) {
    __extends(AnimationFrameAction, _super);
    function AnimationFrameAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        return _this;
    }
    AnimationFrameAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return _super.prototype.requestAsyncId.call(this, scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If an animation frame has already been requested, don't request another
        // one. If an animation frame hasn't been requested yet, request one. Return
        // the current animation frame request id.
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(function () { return scheduler.flush(null); }));
    };
    AnimationFrameAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return _super.prototype.recycleAsyncId.call(this, scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested animation frame and
        // set the scheduled flag to undefined so the next AnimationFrameAction will
        // request its own.
        if (scheduler.actions.length === 0) {
            cancelAnimationFrame(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    };
    return AnimationFrameAction;
}(AsyncAction_1.AsyncAction));
exports.AnimationFrameAction = AnimationFrameAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0aW9uRnJhbWVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9BbmltYXRpb25GcmFtZUFjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBNEM7QUFJNUM7Ozs7R0FJRztBQUNIO0lBQTZDLHdDQUFjO0lBRXpELDhCQUFzQixTQUFrQyxFQUNsQyxJQUFtRDtRQUR6RSxZQUVFLGtCQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FDdkI7UUFIcUIsZUFBUyxHQUFULFNBQVMsQ0FBeUI7UUFDbEMsVUFBSSxHQUFKLElBQUksQ0FBK0M7O0lBRXpFLENBQUM7SUFFUyw2Q0FBYyxHQUF4QixVQUF5QixTQUFrQyxFQUFFLEVBQVEsRUFBRSxLQUFpQjtRQUFqQixzQkFBQSxFQUFBLFNBQWlCO1FBQ3RGLDBEQUEwRDtRQUMxRCxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUMvQixPQUFPLGlCQUFNLGNBQWMsWUFBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ25EO1FBQ0QscURBQXFEO1FBQ3JELFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLDBFQUEwRTtRQUMxRSw0RUFBNEU7UUFDNUUsMENBQTBDO1FBQzFDLE9BQU8sU0FBUyxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcscUJBQXFCLENBQ3hFLGNBQU0sT0FBQSxTQUFTLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFyQixDQUFxQixDQUFDLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBQ1MsNkNBQWMsR0FBeEIsVUFBeUIsU0FBa0MsRUFBRSxFQUFRLEVBQUUsS0FBaUI7UUFBakIsc0JBQUEsRUFBQSxTQUFpQjtRQUN0RixzRUFBc0U7UUFDdEUsc0VBQXNFO1FBQ3RFLDJDQUEyQztRQUMzQyxJQUFJLENBQUMsS0FBSyxLQUFLLElBQUksSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDdkUsT0FBTyxpQkFBTSxjQUFjLFlBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuRDtRQUNELDRFQUE0RTtRQUM1RSw0RUFBNEU7UUFDNUUsbUJBQW1CO1FBQ25CLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQ2pDO1FBQ0Qsc0ZBQXNGO1FBQ3RGLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFDSCwyQkFBQztBQUFELENBQUMsQUFyQ0QsQ0FBNkMseUJBQVcsR0FxQ3ZEO0FBckNZLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkZyYW1lQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGlzIGdyZWF0ZXIgdGhhbiAwLCByZXF1ZXN0IGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBQdXNoIHRoZSBhY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLlxuICAgIHNjaGVkdWxlci5hY3Rpb25zLnB1c2godGhpcyk7XG4gICAgLy8gSWYgYW4gYW5pbWF0aW9uIGZyYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkLCBkb24ndCByZXF1ZXN0IGFub3RoZXJcbiAgICAvLyBvbmUuIElmIGFuIGFuaW1hdGlvbiBmcmFtZSBoYXNuJ3QgYmVlbiByZXF1ZXN0ZWQgeWV0LCByZXF1ZXN0IG9uZS4gUmV0dXJuXG4gICAgLy8gdGhlIGN1cnJlbnQgYW5pbWF0aW9uIGZyYW1lIHJlcXVlc3QgaWQuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5zY2hlZHVsZWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoXG4gICAgICAoKSA9PiBzY2hlZHVsZXIuZmx1c2gobnVsbCkpKTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBlbXB0eSwgY2FuY2VsIHRoZSByZXF1ZXN0ZWQgYW5pbWF0aW9uIGZyYW1lIGFuZFxuICAgIC8vIHNldCB0aGUgc2NoZWR1bGVkIGZsYWcgdG8gdW5kZWZpbmVkIHNvIHRoZSBuZXh0IEFuaW1hdGlvbkZyYW1lQWN0aW9uIHdpbGxcbiAgICAvLyByZXF1ZXN0IGl0cyBvd24uXG4gICAgaWYgKHNjaGVkdWxlci5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpO1xuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHVuZGVmaW5lZCBzbyB0aGUgYWN0aW9uIGtub3dzIHRvIHJlcXVlc3QgYSBuZXcgYXN5bmMgaWQgaWYgaXQncyByZXNjaGVkdWxlZC5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=