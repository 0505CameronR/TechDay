import { Immediate } from '../util/Immediate';
import { AsyncAction } from './AsyncAction';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class AsapAction extends AsyncAction {
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
        // If a microtask has already been scheduled, don't schedule another
        // one. If a microtask hasn't been scheduled yet, schedule one now. Return
        // the current scheduled microtask id.
        return scheduler.scheduled || (scheduler.scheduled = Immediate.setImmediate(scheduler.flush.bind(scheduler, null)));
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        // If delay exists and is greater than 0, or if the delay is null (the
        // action wasn't rescheduled) but was originally scheduled as an async
        // action, then recycle as an async action.
        if ((delay !== null && delay > 0) || (delay === null && this.delay > 0)) {
            return super.recycleAsyncId(scheduler, id, delay);
        }
        // If the scheduler queue is empty, cancel the requested microtask and
        // set the scheduled flag to undefined so the next AsapAction will schedule
        // its own.
        if (scheduler.actions.length === 0) {
            Immediate.clearImmediate(id);
            scheduler.scheduled = undefined;
        }
        // Return undefined so the action knows to request a new async id if it's rescheduled.
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXNhcEFjdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9Bc2FwQWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzVDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sVUFBYyxTQUFRLFdBQWM7SUFFL0MsWUFBc0IsU0FBd0IsRUFDeEIsSUFBbUQ7UUFDdkUsS0FBSyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUZILGNBQVMsR0FBVCxTQUFTLENBQWU7UUFDeEIsU0FBSSxHQUFKLElBQUksQ0FBK0M7SUFFekUsQ0FBQztJQUVTLGNBQWMsQ0FBQyxTQUF3QixFQUFFLEVBQVEsRUFBRSxRQUFnQixDQUFDO1FBQzVFLDBEQUEwRDtRQUMxRCxJQUFJLEtBQUssS0FBSyxJQUFJLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUMvQixPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuRDtRQUNELHFEQUFxRDtRQUNyRCxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QixvRUFBb0U7UUFDcEUsMEVBQTBFO1FBQzFFLHNDQUFzQztRQUN0QyxPQUFPLFNBQVMsQ0FBQyxTQUFTLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQyxZQUFZLENBQ3pFLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FDdEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNTLGNBQWMsQ0FBQyxTQUF3QixFQUFFLEVBQVEsRUFBRSxRQUFnQixDQUFDO1FBQzVFLHNFQUFzRTtRQUN0RSxzRUFBc0U7UUFDdEUsMkNBQTJDO1FBQzNDLElBQUksQ0FBQyxLQUFLLEtBQUssSUFBSSxJQUFJLEtBQUssR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssS0FBSyxJQUFJLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsRUFBRTtZQUN2RSxPQUFPLEtBQUssQ0FBQyxjQUFjLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNuRDtRQUNELHNFQUFzRTtRQUN0RSwyRUFBMkU7UUFDM0UsV0FBVztRQUNYLElBQUksU0FBUyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLFNBQVMsQ0FBQyxjQUFjLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDN0IsU0FBUyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7U0FDakM7UUFDRCxzRkFBc0Y7UUFDdEYsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW1tZWRpYXRlIH0gZnJvbSAnLi4vdXRpbC9JbW1lZGlhdGUnO1xuaW1wb3J0IHsgQXN5bmNBY3Rpb24gfSBmcm9tICcuL0FzeW5jQWN0aW9uJztcbmltcG9ydCB7IEFzYXBTY2hlZHVsZXIgfSBmcm9tICcuL0FzYXBTY2hlZHVsZXInO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBBc2FwQWN0aW9uPFQ+IGV4dGVuZHMgQXN5bmNBY3Rpb248VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBzY2hlZHVsZXI6IEFzYXBTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogQXNhcFNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICAvLyBJZiBkZWxheSBpcyBncmVhdGVyIHRoYW4gMCwgcmVxdWVzdCBhcyBhbiBhc3luYyBhY3Rpb24uXG4gICAgaWYgKGRlbGF5ICE9PSBudWxsICYmIGRlbGF5ID4gMCkge1xuICAgICAgcmV0dXJuIHN1cGVyLnJlcXVlc3RBc3luY0lkKHNjaGVkdWxlciwgaWQsIGRlbGF5KTtcbiAgICB9XG4gICAgLy8gUHVzaCB0aGUgYWN0aW9uIHRvIHRoZSBlbmQgb2YgdGhlIHNjaGVkdWxlciBxdWV1ZS5cbiAgICBzY2hlZHVsZXIuYWN0aW9ucy5wdXNoKHRoaXMpO1xuICAgIC8vIElmIGEgbWljcm90YXNrIGhhcyBhbHJlYWR5IGJlZW4gc2NoZWR1bGVkLCBkb24ndCBzY2hlZHVsZSBhbm90aGVyXG4gICAgLy8gb25lLiBJZiBhIG1pY3JvdGFzayBoYXNuJ3QgYmVlbiBzY2hlZHVsZWQgeWV0LCBzY2hlZHVsZSBvbmUgbm93LiBSZXR1cm5cbiAgICAvLyB0aGUgY3VycmVudCBzY2hlZHVsZWQgbWljcm90YXNrIGlkLlxuICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGVkIHx8IChzY2hlZHVsZXIuc2NoZWR1bGVkID0gSW1tZWRpYXRlLnNldEltbWVkaWF0ZShcbiAgICAgIHNjaGVkdWxlci5mbHVzaC5iaW5kKHNjaGVkdWxlciwgbnVsbClcbiAgICApKTtcbiAgfVxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBBc2FwU2NoZWR1bGVyLCBpZD86IGFueSwgZGVsYXk6IG51bWJlciA9IDApOiBhbnkge1xuICAgIC8vIElmIGRlbGF5IGV4aXN0cyBhbmQgaXMgZ3JlYXRlciB0aGFuIDAsIG9yIGlmIHRoZSBkZWxheSBpcyBudWxsICh0aGVcbiAgICAvLyBhY3Rpb24gd2Fzbid0IHJlc2NoZWR1bGVkKSBidXQgd2FzIG9yaWdpbmFsbHkgc2NoZWR1bGVkIGFzIGFuIGFzeW5jXG4gICAgLy8gYWN0aW9uLCB0aGVuIHJlY3ljbGUgYXMgYW4gYXN5bmMgYWN0aW9uLlxuICAgIGlmICgoZGVsYXkgIT09IG51bGwgJiYgZGVsYXkgPiAwKSB8fCAoZGVsYXkgPT09IG51bGwgJiYgdGhpcy5kZWxheSA+IDApKSB7XG4gICAgICByZXR1cm4gc3VwZXIucmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyLCBpZCwgZGVsYXkpO1xuICAgIH1cbiAgICAvLyBJZiB0aGUgc2NoZWR1bGVyIHF1ZXVlIGlzIGVtcHR5LCBjYW5jZWwgdGhlIHJlcXVlc3RlZCBtaWNyb3Rhc2sgYW5kXG4gICAgLy8gc2V0IHRoZSBzY2hlZHVsZWQgZmxhZyB0byB1bmRlZmluZWQgc28gdGhlIG5leHQgQXNhcEFjdGlvbiB3aWxsIHNjaGVkdWxlXG4gICAgLy8gaXRzIG93bi5cbiAgICBpZiAoc2NoZWR1bGVyLmFjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICBJbW1lZGlhdGUuY2xlYXJJbW1lZGlhdGUoaWQpO1xuICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlZCA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgLy8gUmV0dXJuIHVuZGVmaW5lZCBzbyB0aGUgYWN0aW9uIGtub3dzIHRvIHJlcXVlc3QgYSBuZXcgYXN5bmMgaWQgaWYgaXQncyByZXNjaGVkdWxlZC5cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG59XG4iXX0=