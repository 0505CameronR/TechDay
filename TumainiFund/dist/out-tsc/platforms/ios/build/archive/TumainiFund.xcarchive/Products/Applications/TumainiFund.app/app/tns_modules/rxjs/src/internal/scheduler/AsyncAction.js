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
var Action_1 = require("./Action");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var AsyncAction = /** @class */ (function (_super) {
    __extends(AsyncAction, _super);
    function AsyncAction(scheduler, work) {
        var _this = _super.call(this, scheduler, work) || this;
        _this.scheduler = scheduler;
        _this.work = work;
        _this.pending = false;
        return _this;
    }
    AsyncAction.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        var id = this.id;
        var scheduler = this.scheduler;
        //
        // Important implementation note:
        //
        // Actions only execute once by default, unless rescheduled from within the
        // scheduled callback. This allows us to implement single and repeat
        // actions via the same code path, without adding API surface area, as well
        // as mimic traditional recursion but across asynchronous boundaries.
        //
        // However, JS runtimes and timers distinguish between intervals achieved by
        // serial `setTimeout` calls vs. a single `setInterval` call. An interval of
        // serial `setTimeout` calls can be individually delayed, which delays
        // scheduling the next `setTimeout`, and so on. `setInterval` attempts to
        // guarantee the interval callback will be invoked more precisely to the
        // interval period, regardless of load.
        //
        // Therefore, we use `setInterval` to schedule single and repeat actions.
        // If the action reschedules itself with the same delay, the interval is not
        // canceled. If the action doesn't reschedule, or reschedules with a
        // different delay, the interval will be canceled after scheduled callback
        // execution.
        //
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, delay);
        }
        // Set the pending flag indicating that this action has been scheduled, or
        // has recursively rescheduled itself.
        this.pending = true;
        this.delay = delay;
        // If this action has already an async Id, don't request a new one.
        this.id = this.id || this.requestAsyncId(scheduler, this.id, delay);
        return this;
    };
    AsyncAction.prototype.requestAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    };
    AsyncAction.prototype.recycleAsyncId = function (scheduler, id, delay) {
        if (delay === void 0) { delay = 0; }
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        clearInterval(id);
    };
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    AsyncAction.prototype.execute = function (state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        var error = this._execute(state, delay);
        if (error) {
            return error;
        }
        else if (this.pending === false && this.id != null) {
            // Dequeue if the action didn't reschedule itself. Don't call
            // unsubscribe(), because the action could reschedule later.
            // For example:
            // ```
            // scheduler.schedule(function doWork(counter) {
            //   /* ... I'm a busy worker bee ... */
            //   var originalAction = this;
            //   /* wait 100ms before rescheduling the action */
            //   setTimeout(function () {
            //     originalAction.schedule(counter + 1);
            //   }, 100);
            // }, 1000);
            // ```
            this.id = this.recycleAsyncId(this.scheduler, this.id, null);
        }
    };
    AsyncAction.prototype._execute = function (state, delay) {
        var errored = false;
        var errorValue = undefined;
        try {
            this.work(state);
        }
        catch (e) {
            errored = true;
            errorValue = !!e && e || new Error(e);
        }
        if (errored) {
            this.unsubscribe();
            return errorValue;
        }
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    AsyncAction.prototype._unsubscribe = function () {
        var id = this.id;
        var scheduler = this.scheduler;
        var actions = scheduler.actions;
        var index = actions.indexOf(this);
        this.work = null;
        this.state = null;
        this.pending = false;
        this.scheduler = null;
        if (index !== -1) {
            actions.splice(index, 1);
        }
        if (id != null) {
            this.id = this.recycleAsyncId(scheduler, id, null);
        }
        this.delay = null;
    };
    return AsyncAction;
}(Action_1.Action));
exports.AsyncAction = AsyncAction;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9Bc3luY0FjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxtQ0FBa0M7QUFLbEM7Ozs7R0FJRztBQUNIO0lBQW9DLCtCQUFTO0lBTzNDLHFCQUFzQixTQUF5QixFQUN6QixJQUFtRDtRQUR6RSxZQUVFLGtCQUFNLFNBQVMsRUFBRSxJQUFJLENBQUMsU0FDdkI7UUFIcUIsZUFBUyxHQUFULFNBQVMsQ0FBZ0I7UUFDekIsVUFBSSxHQUFKLElBQUksQ0FBK0M7UUFIL0QsYUFBTyxHQUFZLEtBQUssQ0FBQzs7SUFLbkMsQ0FBQztJQUVNLDhCQUFRLEdBQWYsVUFBZ0IsS0FBUyxFQUFFLEtBQWlCO1FBQWpCLHNCQUFBLEVBQUEsU0FBaUI7UUFFMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFakMsRUFBRTtRQUNGLGlDQUFpQztRQUNqQyxFQUFFO1FBQ0YsMkVBQTJFO1FBQzNFLG9FQUFvRTtRQUNwRSwyRUFBMkU7UUFDM0UscUVBQXFFO1FBQ3JFLEVBQUU7UUFDRiw0RUFBNEU7UUFDNUUsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSx5RUFB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QyxDQUFDLENBQUMsQ0FBQztTQUN2QztRQUNELElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ25CLE9BQU8sVUFBVSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxrQ0FBWSxHQUFaO1FBRUUsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbEMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUVELElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQWhKRCxDQUFvQyxlQUFNLEdBZ0p6QztBQWhKWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBBc3luY1NjaGVkdWxlciB9IGZyb20gJy4vQXN5bmNTY2hlZHVsZXInO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFzeW5jQWN0aW9uPFQ+IGV4dGVuZHMgQWN0aW9uPFQ+IHtcblxuICBwdWJsaWMgaWQ6IGFueTtcbiAgcHVibGljIHN0YXRlOiBUO1xuICBwdWJsaWMgZGVsYXk6IG51bWJlcjtcbiAgcHJvdGVjdGVkIHBlbmRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlcixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKHNjaGVkdWxlciwgd29yayk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGUoc3RhdGU/OiBULCBkZWxheTogbnVtYmVyID0gMCk6IFN1YnNjcmlwdGlvbiB7XG5cbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8vIEFsd2F5cyByZXBsYWNlIHRoZSBjdXJyZW50IHN0YXRlIHdpdGggdGhlIG5ldyBzdGF0ZS5cbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG5cbiAgICAvL1xuICAgIC8vIEltcG9ydGFudCBpbXBsZW1lbnRhdGlvbiBub3RlOlxuICAgIC8vXG4gICAgLy8gQWN0aW9ucyBvbmx5IGV4ZWN1dGUgb25jZSBieSBkZWZhdWx0LCB1bmxlc3MgcmVzY2hlZHVsZWQgZnJvbSB3aXRoaW4gdGhlXG4gICAgLy8gc2NoZWR1bGVkIGNhbGxiYWNrLiBUaGlzIGFsbG93cyB1cyB0byBpbXBsZW1lbnQgc2luZ2xlIGFuZCByZXBlYXRcbiAgICAvLyBhY3Rpb25zIHZpYSB0aGUgc2FtZSBjb2RlIHBhdGgsIHdpdGhvdXQgYWRkaW5nIEFQSSBzdXJmYWNlIGFyZWEsIGFzIHdlbGxcbiAgICAvLyBhcyBtaW1pYyB0cmFkaXRpb25hbCByZWN1cnNpb24gYnV0IGFjcm9zcyBhc3luY2hyb25vdXMgYm91bmRhcmllcy5cbiAgICAvL1xuICAgIC8vIEhvd2V2ZXIsIEpTIHJ1bnRpbWVzIGFuZCB0aW1lcnMgZGlzdGluZ3Vpc2ggYmV0d2VlbiBpbnRlcnZhbHMgYWNoaWV2ZWQgYnlcbiAgICAvLyBzZXJpYWwgYHNldFRpbWVvdXRgIGNhbGxzIHZzLiBhIHNpbmdsZSBgc2V0SW50ZXJ2YWxgIGNhbGwuIEFuIGludGVydmFsIG9mXG4gICAgLy8gc2VyaWFsIGBzZXRUaW1lb3V0YCBjYWxscyBjYW4gYmUgaW5kaXZpZHVhbGx5IGRlbGF5ZWQsIHdoaWNoIGRlbGF5c1xuICAgIC8vIHNjaGVkdWxpbmcgdGhlIG5leHQgYHNldFRpbWVvdXRgLCBhbmQgc28gb24uIGBzZXRJbnRlcnZhbGAgYXR0ZW1wdHMgdG9cbiAgICAvLyBndWFyYW50ZWUgdGhlIGludGVydmFsIGNhbGxiYWNrIHdpbGwgYmUgaW52b2tlZCBtb3JlIHByZWNpc2VseSB0byB0aGVcbiAgICAvLyBpbnRlcnZhbCBwZXJpb2QsIHJlZ2FyZGxlc3Mgb2YgbG9hZC5cbiAgICAvL1xuICAgIC8vIFRoZXJlZm9yZSwgd2UgdXNlIGBzZXRJbnRlcnZhbGAgdG8gc2NoZWR1bGUgc2luZ2xlIGFuZCByZXBlYXQgYWN0aW9ucy5cbiAgICAvLyBJZiB0aGUgYWN0aW9uIHJlc2NoZWR1bGVzIGl0c2VsZiB3aXRoIHRoZSBzYW1lIGRlbGF5LCB0aGUgaW50ZXJ2YWwgaXMgbm90XG4gICAgLy8gY2FuY2VsZWQuIElmIHRoZSBhY3Rpb24gZG9lc24ndCByZXNjaGVkdWxlLCBvciByZXNjaGVkdWxlcyB3aXRoIGFcbiAgICAvLyBkaWZmZXJlbnQgZGVsYXksIHRoZSBpbnRlcnZhbCB3aWxsIGJlIGNhbmNlbGVkIGFmdGVyIHNjaGVkdWxlZCBjYWxsYmFja1xuICAgIC8vIGV4ZWN1dGlvbi5cbiAgICAvL1xuICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBkZWxheSk7XG4gICAgfVxuXG4gICAgLy8gU2V0IHRoZSBwZW5kaW5nIGZsYWcgaW5kaWNhdGluZyB0aGF0IHRoaXMgYWN0aW9uIGhhcyBiZWVuIHNjaGVkdWxlZCwgb3JcbiAgICAvLyBoYXMgcmVjdXJzaXZlbHkgcmVzY2hlZHVsZWQgaXRzZWxmLlxuICAgIHRoaXMucGVuZGluZyA9IHRydWU7XG5cbiAgICB0aGlzLmRlbGF5ID0gZGVsYXk7XG4gICAgLy8gSWYgdGhpcyBhY3Rpb24gaGFzIGFscmVhZHkgYW4gYXN5bmMgSWQsIGRvbid0IHJlcXVlc3QgYSBuZXcgb25lLlxuICAgIHRoaXMuaWQgPSB0aGlzLmlkIHx8IHRoaXMucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCB0aGlzLmlkLCBkZWxheSk7XG5cbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIHJldHVybiBzZXRJbnRlcnZhbChzY2hlZHVsZXIuZmx1c2guYmluZChzY2hlZHVsZXIsIHRoaXMpLCBkZWxheSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBBc3luY1NjaGVkdWxlciwgaWQ6IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIHRoaXMgYWN0aW9uIGlzIHJlc2NoZWR1bGVkIHdpdGggdGhlIHNhbWUgZGVsYXkgdGltZSwgZG9uJ3QgY2xlYXIgdGhlIGludGVydmFsIGlkLlxuICAgIGlmIChkZWxheSAhPT0gbnVsbCAmJiB0aGlzLmRlbGF5ID09PSBkZWxheSAmJiB0aGlzLnBlbmRpbmcgPT09IGZhbHNlKSB7XG4gICAgICByZXR1cm4gaWQ7XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgaWYgdGhlIGFjdGlvbidzIGRlbGF5IHRpbWUgaXMgZGlmZmVyZW50IGZyb20gdGhlIGN1cnJlbnQgZGVsYXksXG4gICAgLy8gb3IgdGhlIGFjdGlvbiBoYXMgYmVlbiByZXNjaGVkdWxlZCBiZWZvcmUgaXQncyBleGVjdXRlZCwgY2xlYXIgdGhlIGludGVydmFsIGlkXG4gICAgY2xlYXJJbnRlcnZhbChpZCk7XG4gIH1cblxuICAvKipcbiAgICogSW1tZWRpYXRlbHkgZXhlY3V0ZXMgdGhpcyBhY3Rpb24gYW5kIHRoZSBgd29ya2AgaXQgY29udGFpbnMuXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIHB1YmxpYyBleGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIG5ldyBFcnJvcignZXhlY3V0aW5nIGEgY2FuY2VsbGVkIGFjdGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgIGNvbnN0IGVycm9yID0gdGhpcy5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIGlmIChlcnJvcikge1xuICAgICAgcmV0dXJuIGVycm9yO1xuICAgIH0gZWxzZSBpZiAodGhpcy5wZW5kaW5nID09PSBmYWxzZSAmJiB0aGlzLmlkICE9IG51bGwpIHtcbiAgICAgIC8vIERlcXVldWUgaWYgdGhlIGFjdGlvbiBkaWRuJ3QgcmVzY2hlZHVsZSBpdHNlbGYuIERvbid0IGNhbGxcbiAgICAgIC8vIHVuc3Vic2NyaWJlKCksIGJlY2F1c2UgdGhlIGFjdGlvbiBjb3VsZCByZXNjaGVkdWxlIGxhdGVyLlxuICAgICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgICAvLyBgYGBcbiAgICAgIC8vIHNjaGVkdWxlci5zY2hlZHVsZShmdW5jdGlvbiBkb1dvcmsoY291bnRlcikge1xuICAgICAgLy8gICAvKiAuLi4gSSdtIGEgYnVzeSB3b3JrZXIgYmVlIC4uLiAqL1xuICAgICAgLy8gICB2YXIgb3JpZ2luYWxBY3Rpb24gPSB0aGlzO1xuICAgICAgLy8gICAvKiB3YWl0IDEwMG1zIGJlZm9yZSByZXNjaGVkdWxpbmcgdGhlIGFjdGlvbiAqL1xuICAgICAgLy8gICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vICAgICBvcmlnaW5hbEFjdGlvbi5zY2hlZHVsZShjb3VudGVyICsgMSk7XG4gICAgICAvLyAgIH0sIDEwMCk7XG4gICAgICAvLyB9LCAxMDAwKTtcbiAgICAgIC8vIGBgYFxuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQodGhpcy5zY2hlZHVsZXIsIHRoaXMuaWQsIG51bGwpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXhlY3V0ZShzdGF0ZTogVCwgZGVsYXk6IG51bWJlcik6IGFueSB7XG4gICAgbGV0IGVycm9yZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBsZXQgZXJyb3JWYWx1ZTogYW55ID0gdW5kZWZpbmVkO1xuICAgIHRyeSB7XG4gICAgICB0aGlzLndvcmsoc3RhdGUpO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGVycm9yZWQgPSB0cnVlO1xuICAgICAgZXJyb3JWYWx1ZSA9ICEhZSAmJiBlIHx8IG5ldyBFcnJvcihlKTtcbiAgICB9XG4gICAgaWYgKGVycm9yZWQpIHtcbiAgICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHJldHVybiBlcnJvclZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgaWQgPSB0aGlzLmlkO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgIGNvbnN0IGFjdGlvbnMgPSBzY2hlZHVsZXIuYWN0aW9ucztcbiAgICBjb25zdCBpbmRleCA9IGFjdGlvbnMuaW5kZXhPZih0aGlzKTtcblxuICAgIHRoaXMud29yayAgPSBudWxsO1xuICAgIHRoaXMuc3RhdGUgPSBudWxsO1xuICAgIHRoaXMucGVuZGluZyA9IGZhbHNlO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gbnVsbDtcblxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGFjdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB9XG5cbiAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgdGhpcy5pZCA9IHRoaXMucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgbnVsbCk7XG4gICAgfVxuXG4gICAgdGhpcy5kZWxheSA9IG51bGw7XG4gIH1cbn1cbiJdfQ==