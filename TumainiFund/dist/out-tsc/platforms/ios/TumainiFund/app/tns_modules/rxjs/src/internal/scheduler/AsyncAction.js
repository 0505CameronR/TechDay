import { Action } from './Action';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AsyncAction extends Action {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.pending = false;
    }
    schedule(state, delay = 0) {
        if (this.closed) {
            return this;
        }
        // Always replace the current state with the new state.
        this.state = state;
        const id = this.id;
        const scheduler = this.scheduler;
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
    }
    requestAsyncId(scheduler, id, delay = 0) {
        return setInterval(scheduler.flush.bind(scheduler, this), delay);
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If this action is rescheduled with the same delay time, don't clear the interval id.
        if (delay !== null && this.delay === delay && this.pending === false) {
            return id;
        }
        // Otherwise, if the action's delay time is different from the current delay,
        // or the action has been rescheduled before it's executed, clear the interval id
        clearInterval(id);
    }
    /**
     * Immediately executes this action and the `work` it contains.
     * @return {any}
     */
    execute(state, delay) {
        if (this.closed) {
            return new Error('executing a cancelled action');
        }
        this.pending = false;
        const error = this._execute(state, delay);
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
    }
    _execute(state, delay) {
        let errored = false;
        let errorValue = undefined;
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
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const id = this.id;
        const scheduler = this.scheduler;
        const actions = scheduler.actions;
        const index = actions.indexOf(this);
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvQXN5bmNBY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUtsQzs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLFdBQWUsU0FBUSxNQUFTO0lBTzNDLFlBQXNCLFNBQXlCLEVBQ3pCLElBQW1EO1FBQ3ZFLEtBQUssQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFGSCxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQUN6QixTQUFJLEdBQUosSUFBSSxDQUErQztRQUgvRCxZQUFPLEdBQVksS0FBSyxDQUFDO0lBS25DLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBUyxFQUFFLFFBQWdCLENBQUM7UUFFMUMsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsT0FBTyxJQUFJLENBQUM7U0FDYjtRQUVELHVEQUF1RDtRQUN2RCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUVuQixNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsRUFBRSxDQUFDO1FBQ25CLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7UUFFakMsRUFBRTtRQUNGLGlDQUFpQztRQUNqQyxFQUFFO1FBQ0YsMkVBQTJFO1FBQzNFLG9FQUFvRTtRQUNwRSwyRUFBMkU7UUFDM0UscUVBQXFFO1FBQ3JFLEVBQUU7UUFDRiw0RUFBNEU7UUFDNUUsNEVBQTRFO1FBQzVFLHNFQUFzRTtRQUN0RSx5RUFBeUU7UUFDekUsd0VBQXdFO1FBQ3hFLHVDQUF1QztRQUN2QyxFQUFFO1FBQ0YseUVBQXlFO1FBQ3pFLDRFQUE0RTtRQUM1RSxvRUFBb0U7UUFD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LEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztRQUNuQixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUM7UUFDbEMsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQyxJQUFJLENBQUMsSUFBSSxHQUFJLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztRQUNsQixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztRQUV0QixJQUFJLEtBQUssS0FBSyxDQUFDLENBQUMsRUFBRTtZQUNoQixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztTQUMxQjtRQUVELElBQUksRUFBRSxJQUFJLElBQUksRUFBRTtZQUNkLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3BEO1FBRUQsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7SUFDcEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQWN0aW9uIH0gZnJvbSAnLi9BY3Rpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IEFzeW5jU2NoZWR1bGVyIH0gZnJvbSAnLi9Bc3luY1NjaGVkdWxlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQXN5bmNBY3Rpb248VD4gZXh0ZW5kcyBBY3Rpb248VD4ge1xuXG4gIHB1YmxpYyBpZDogYW55O1xuICBwdWJsaWMgc3RhdGU6IFQ7XG4gIHB1YmxpYyBkZWxheTogbnVtYmVyO1xuICBwcm90ZWN0ZWQgcGVuZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLy8gQWx3YXlzIHJlcGxhY2UgdGhlIGN1cnJlbnQgc3RhdGUgd2l0aCB0aGUgbmV3IHN0YXRlLlxuICAgIHRoaXMuc3RhdGUgPSBzdGF0ZTtcblxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcbiAgICBjb25zdCBzY2hlZHVsZXIgPSB0aGlzLnNjaGVkdWxlcjtcblxuICAgIC8vXG4gICAgLy8gSW1wb3J0YW50IGltcGxlbWVudGF0aW9uIG5vdGU6XG4gICAgLy9cbiAgICAvLyBBY3Rpb25zIG9ubHkgZXhlY3V0ZSBvbmNlIGJ5IGRlZmF1bHQsIHVubGVzcyByZXNjaGVkdWxlZCBmcm9tIHdpdGhpbiB0aGVcbiAgICAvLyBzY2hlZHVsZWQgY2FsbGJhY2suIFRoaXMgYWxsb3dzIHVzIHRvIGltcGxlbWVudCBzaW5nbGUgYW5kIHJlcGVhdFxuICAgIC8vIGFjdGlvbnMgdmlhIHRoZSBzYW1lIGNvZGUgcGF0aCwgd2l0aG91dCBhZGRpbmcgQVBJIHN1cmZhY2UgYXJlYSwgYXMgd2VsbFxuICAgIC8vIGFzIG1pbWljIHRyYWRpdGlvbmFsIHJlY3Vyc2lvbiBidXQgYWNyb3NzIGFzeW5jaHJvbm91cyBib3VuZGFyaWVzLlxuICAgIC8vXG4gICAgLy8gSG93ZXZlciwgSlMgcnVudGltZXMgYW5kIHRpbWVycyBkaXN0aW5ndWlzaCBiZXR3ZWVuIGludGVydmFscyBhY2hpZXZlZCBieVxuICAgIC8vIHNlcmlhbCBgc2V0VGltZW91dGAgY2FsbHMgdnMuIGEgc2luZ2xlIGBzZXRJbnRlcnZhbGAgY2FsbC4gQW4gaW50ZXJ2YWwgb2ZcbiAgICAvLyBzZXJpYWwgYHNldFRpbWVvdXRgIGNhbGxzIGNhbiBiZSBpbmRpdmlkdWFsbHkgZGVsYXllZCwgd2hpY2ggZGVsYXlzXG4gICAgLy8gc2NoZWR1bGluZyB0aGUgbmV4dCBgc2V0VGltZW91dGAsIGFuZCBzbyBvbi4gYHNldEludGVydmFsYCBhdHRlbXB0cyB0b1xuICAgIC8vIGd1YXJhbnRlZSB0aGUgaW50ZXJ2YWwgY2FsbGJhY2sgd2lsbCBiZSBpbnZva2VkIG1vcmUgcHJlY2lzZWx5IHRvIHRoZVxuICAgIC8vIGludGVydmFsIHBlcmlvZCwgcmVnYXJkbGVzcyBvZiBsb2FkLlxuICAgIC8vXG4gICAgLy8gVGhlcmVmb3JlLCB3ZSB1c2UgYHNldEludGVydmFsYCB0byBzY2hlZHVsZSBzaW5nbGUgYW5kIHJlcGVhdCBhY3Rpb25zLlxuICAgIC8vIElmIHRoZSBhY3Rpb24gcmVzY2hlZHVsZXMgaXRzZWxmIHdpdGggdGhlIHNhbWUgZGVsYXksIHRoZSBpbnRlcnZhbCBpcyBub3RcbiAgICAvLyBjYW5jZWxlZC4gSWYgdGhlIGFjdGlvbiBkb2Vzbid0IHJlc2NoZWR1bGUsIG9yIHJlc2NoZWR1bGVzIHdpdGggYVxuICAgIC8vIGRpZmZlcmVudCBkZWxheSwgdGhlIGludGVydmFsIHdpbGwgYmUgY2FuY2VsZWQgYWZ0ZXIgc2NoZWR1bGVkIGNhbGxiYWNrXG4gICAgLy8gZXhlY3V0aW9uLlxuICAgIC8vXG4gICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgIHRoaXMuaWQgPSB0aGlzLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG5cbiAgICAvLyBTZXQgdGhlIHBlbmRpbmcgZmxhZyBpbmRpY2F0aW5nIHRoYXQgdGhpcyBhY3Rpb24gaGFzIGJlZW4gc2NoZWR1bGVkLCBvclxuICAgIC8vIGhhcyByZWN1cnNpdmVseSByZXNjaGVkdWxlZCBpdHNlbGYuXG4gICAgdGhpcy5wZW5kaW5nID0gdHJ1ZTtcblxuICAgIHRoaXMuZGVsYXkgPSBkZWxheTtcbiAgICAvLyBJZiB0aGlzIGFjdGlvbiBoYXMgYWxyZWFkeSBhbiBhc3luYyBJZCwgZG9uJ3QgcmVxdWVzdCBhIG5ldyBvbmUuXG4gICAgdGhpcy5pZCA9IHRoaXMuaWQgfHwgdGhpcy5yZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXIsIHRoaXMuaWQsIGRlbGF5KTtcblxuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogQXN5bmNTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgcmV0dXJuIHNldEludGVydmFsKHNjaGVkdWxlci5mbHVzaC5iaW5kKHNjaGVkdWxlciwgdGhpcyksIGRlbGF5KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXI6IEFzeW5jU2NoZWR1bGVyLCBpZDogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgLy8gSWYgdGhpcyBhY3Rpb24gaXMgcmVzY2hlZHVsZWQgd2l0aCB0aGUgc2FtZSBkZWxheSB0aW1lLCBkb24ndCBjbGVhciB0aGUgaW50ZXJ2YWwgaWQuXG4gICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIHRoaXMuZGVsYXkgPT09IGRlbGF5ICYmIHRoaXMucGVuZGluZyA9PT0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCBpZiB0aGUgYWN0aW9uJ3MgZGVsYXkgdGltZSBpcyBkaWZmZXJlbnQgZnJvbSB0aGUgY3VycmVudCBkZWxheSxcbiAgICAvLyBvciB0aGUgYWN0aW9uIGhhcyBiZWVuIHJlc2NoZWR1bGVkIGJlZm9yZSBpdCdzIGV4ZWN1dGVkLCBjbGVhciB0aGUgaW50ZXJ2YWwgaWRcbiAgICBjbGVhckludGVydmFsKGlkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbW1lZGlhdGVseSBleGVjdXRlcyB0aGlzIGFjdGlvbiBhbmQgdGhlIGB3b3JrYCBpdCBjb250YWlucy5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgcHVibGljIGV4ZWN1dGUoc3RhdGU6IFQsIGRlbGF5OiBudW1iZXIpOiBhbnkge1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gbmV3IEVycm9yKCdleGVjdXRpbmcgYSBjYW5jZWxsZWQgYWN0aW9uJyk7XG4gICAgfVxuXG4gICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgY29uc3QgZXJyb3IgPSB0aGlzLl9leGVjdXRlKHN0YXRlLCBkZWxheSk7XG4gICAgaWYgKGVycm9yKSB7XG4gICAgICByZXR1cm4gZXJyb3I7XG4gICAgfSBlbHNlIGlmICh0aGlzLnBlbmRpbmcgPT09IGZhbHNlICYmIHRoaXMuaWQgIT0gbnVsbCkge1xuICAgICAgLy8gRGVxdWV1ZSBpZiB0aGUgYWN0aW9uIGRpZG4ndCByZXNjaGVkdWxlIGl0c2VsZi4gRG9uJ3QgY2FsbFxuICAgICAgLy8gdW5zdWJzY3JpYmUoKSwgYmVjYXVzZSB0aGUgYWN0aW9uIGNvdWxkIHJlc2NoZWR1bGUgbGF0ZXIuXG4gICAgICAvLyBGb3IgZXhhbXBsZTpcbiAgICAgIC8vIGBgYFxuICAgICAgLy8gc2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uIGRvV29yayhjb3VudGVyKSB7XG4gICAgICAvLyAgIC8qIC4uLiBJJ20gYSBidXN5IHdvcmtlciBiZWUgLi4uICovXG4gICAgICAvLyAgIHZhciBvcmlnaW5hbEFjdGlvbiA9IHRoaXM7XG4gICAgICAvLyAgIC8qIHdhaXQgMTAwbXMgYmVmb3JlIHJlc2NoZWR1bGluZyB0aGUgYWN0aW9uICovXG4gICAgICAvLyAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgLy8gICAgIG9yaWdpbmFsQWN0aW9uLnNjaGVkdWxlKGNvdW50ZXIgKyAxKTtcbiAgICAgIC8vICAgfSwgMTAwKTtcbiAgICAgIC8vIH0sIDEwMDApO1xuICAgICAgLy8gYGBgXG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZCh0aGlzLnNjaGVkdWxlciwgdGhpcy5pZCwgbnVsbCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9leGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICBsZXQgZXJyb3JlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGxldCBlcnJvclZhbHVlOiBhbnkgPSB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMud29yayhzdGF0ZSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgZXJyb3JlZCA9IHRydWU7XG4gICAgICBlcnJvclZhbHVlID0gISFlICYmIGUgfHwgbmV3IEVycm9yKGUpO1xuICAgIH1cbiAgICBpZiAoZXJyb3JlZCkge1xuICAgICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICAgICAgcmV0dXJuIGVycm9yVmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG5cbiAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgY29uc3QgYWN0aW9ucyA9IHNjaGVkdWxlci5hY3Rpb25zO1xuICAgIGNvbnN0IGluZGV4ID0gYWN0aW9ucy5pbmRleE9mKHRoaXMpO1xuXG4gICAgdGhpcy53b3JrICA9IG51bGw7XG4gICAgdGhpcy5zdGF0ZSA9IG51bGw7XG4gICAgdGhpcy5wZW5kaW5nID0gZmFsc2U7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBudWxsO1xuXG4gICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgYWN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cblxuICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICB0aGlzLmlkID0gdGhpcy5yZWN5Y2xlQXN5bmNJZChzY2hlZHVsZXIsIGlkLCBudWxsKTtcbiAgICB9XG5cbiAgICB0aGlzLmRlbGF5ID0gbnVsbDtcbiAgfVxufVxuIl19