import { AsyncAction } from './AsyncAction';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AnimationFrameAction extends AsyncAction {
    constructor(scheduler, work) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
    }
    requestAsyncId(scheduler, id, delay = 0) {
        // If delay is greater than 0, request as an async action.
        if (delay !== null && delay > 0) {
            return super.requestAsyncId(scheduler, id, delay);
        }
        // Push the action to the end of the scheduler queue.
        scheduler.actions.push(this);
        // If an animation frame has already been requested, don't request another
        // one. If an animation frame hasn't been requested yet, request one. Return
        // the current animation frame request id.
        return scheduler.scheduled || (scheduler.scheduled = requestAnimationFrame(() => scheduler.flush(null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return super.recycleAsyncId(scheduler, id, delay);
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQW5pbWF0aW9uRnJhbWVBY3Rpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvQW5pbWF0aW9uRnJhbWVBY3Rpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUk1Qzs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLG9CQUF3QixTQUFRLFdBQWM7SUFFekQsWUFBc0IsU0FBa0MsRUFDbEMsSUFBbUQ7UUFDdkUsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUZILGNBQVMsR0FBVCxTQUFTLENBQXlCO1FBQ2xDLFNBQUksR0FBSixJQUFJLENBQStDO0lBRXpFLENBQUM7SUFFUyxjQUFjLENBQUMsU0FBa0MsRUFBRSxFQUFRLEVBQUUsUUFBZ0IsQ0FBQztRQUN0RiwwREFBMEQ7UUFDMUQsSUFBSSxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDL0IsT0FBTyxLQUFLLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbkQ7UUFDRCxxREFBcUQ7UUFDckQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDN0IsMEVBQTBFO1FBQzFFLDRFQUE0RTtRQUM1RSwwQ0FBMEM7UUFDMUMsT0FBTyxTQUFTLENBQUMsU0FBUyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FDeEUsR0FBRyxFQUFFLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNTLGNBQWMsQ0FBQyxTQUFrQyxFQUFFLEVBQVEsRUFBRSxRQUFnQixDQUFDO1FBQ3RGLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN2RSxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuRDtRQUNELDRFQUE0RTtRQUM1RSw0RUFBNEU7UUFDNUUsbUJBQW1CO1FBQ25CLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLG9CQUFvQixDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLFNBQVMsQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDO1NBQ2pDO1FBQ0Qsc0ZBQXNGO1FBQ3RGLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBBbmltYXRpb25GcmFtZVNjaGVkdWxlciB9IGZyb20gJy4vQW5pbWF0aW9uRnJhbWVTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEFuaW1hdGlvbkZyYW1lQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgd29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoc2NoZWR1bGVyLCB3b3JrKTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZXF1ZXN0QXN5bmNJZChzY2hlZHVsZXI6IEFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGlzIGdyZWF0ZXIgdGhhbiAwLCByZXF1ZXN0IGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVxdWVzdEFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBQdXNoIHRoZSBhY3Rpb24gdG8gdGhlIGVuZCBvZiB0aGUgc2NoZWR1bGVyIHF1ZXVlLlxuICAgIHNjaGVkdWxlci5hY3Rpb25zLnB1c2godGhpcyk7XG4gICAgLy8gSWYgYW4gYW5pbWF0aW9uIGZyYW1lIGhhcyBhbHJlYWR5IGJlZW4gcmVxdWVzdGVkLCBkb24ndCByZXF1ZXN0IGFub3RoZXJcbiAgICAvLyBvbmUuIElmIGFuIGFuaW1hdGlvbiBmcmFtZSBoYXNuJ3QgYmVlbiByZXF1ZXN0ZWQgeWV0LCByZXF1ZXN0IG9uZS4gUmV0dXJuXG4gICAgLy8gdGhlIGN1cnJlbnQgYW5pbWF0aW9uIGZyYW1lIHJlcXVlc3QgaWQuXG4gICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZWQgfHwgKHNjaGVkdWxlci5zY2hlZHVsZWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoXG4gICAgICAoKSA9PiBzY2hlZHVsZXIuZmx1c2gobnVsbCkpKTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBBbmltYXRpb25GcmFtZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBleGlzdHMgYW5kIGlzIGdyZWF0ZXIgdGhhbiAwLCBvciBpZiB0aGUgZGVsYXkgaXMgbnVsbCAodGhlXG4gICAgLy8gYWN0aW9uIHdhc24ndCByZXNjaGVkdWxlZCkgYnV0IHdhcyBvcmlnaW5hbGx5IHNjaGVkdWxlZCBhcyBhbiBhc3luY1xuICAgIC8vIGFjdGlvbiwgdGhlbiByZWN5Y2xlIGFzIGFuIGFzeW5jIGFjdGlvbi5cbiAgICBpZiAoKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkgfHwgKGRlbGF5ID09PSBudWxsICYmIHRoaXMuZGVsYXkgPiAwKSkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlY3ljbGVBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gSWYgdGhlIHNjaGVkdWxlciBxdWV1ZSBpcyBlbXB0eSwgY2FuY2VsIHRoZSByZXF1ZXN0ZWQgYW5pbWF0aW9uIGZyYW1lIGFuZFxuICAgIC8vIHNldCB0aGUgc2NoZWR1bGVkIGZsYWcgdG8gdW5kZWZpbmVkIHNvIHRoZSBuZXh0IEFuaW1hdGlvbkZyYW1lQWN0aW9uIHdpbGxcbiAgICAvLyByZXF1ZXN0IGl0cyBvd24uXG4gICAgaWYgKHNjaGVkdWxlci5hY3Rpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgY2FuY2VsQW5pbWF0aW9uRnJhbWUoaWQpO1xuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHVuZGVmaW5lZCBzbyB0aGUgYWN0aW9uIGtub3dzIHRvIHJlcXVlc3QgYSBuZXcgYXN5bmMgaWQgaWYgaXQncyByZXNjaGVkdWxlZC5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=