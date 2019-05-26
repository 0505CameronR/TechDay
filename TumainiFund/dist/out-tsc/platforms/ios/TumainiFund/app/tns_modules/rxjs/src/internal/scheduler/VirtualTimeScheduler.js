import { AsyncAction } from './AsyncAction';
import { AsyncScheduler } from './AsyncScheduler';
export class VirtualTimeScheduler extends AsyncScheduler {
    constructor(SchedulerAction = VirtualAction, maxFrames = Number.POSITIVE_INFINITY) {
        super(SchedulerAction, () => this.frame);
        this.maxFrames = maxFrames;
        this.frame = 0;
        this.index = -1;
    }
    /**
     * Prompt the Scheduler to execute all of its queued actions, therefore
     * clearing its queue.
     * @return {void}
     */
    flush() {
        const { actions, maxFrames } = this;
        let error, action;
        while ((action = actions[0]) && action.delay <= maxFrames) {
            actions.shift();
            this.frame = action.delay;
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
    }
}
VirtualTimeScheduler.frameTimeFactor = 10;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @nodoc
 */
export class VirtualAction extends AsyncAction {
    constructor(scheduler, work, index = scheduler.index += 1) {
        super(scheduler, work);
        this.scheduler = scheduler;
        this.work = work;
        this.index = index;
        this.active = true;
        this.index = scheduler.index = index;
    }
    schedule(state, delay = 0) {
        if (!this.id) {
            return super.schedule(state, delay);
        }
        this.active = false;
        // If an action is rescheduled, we save allocations by mutating its state,
        // pushing it to the end of the scheduler queue, and recycling the action.
        // But since the VirtualTimeScheduler is used for testing, VirtualActions
        // must be immutable so they can be inspected later.
        const action = new VirtualAction(this.scheduler, this.work);
        this.add(action);
        return action.schedule(state, delay);
    }
    requestAsyncId(scheduler, id, delay = 0) {
        this.delay = scheduler.frame + delay;
        const { actions } = scheduler;
        actions.push(this);
        actions.sort(VirtualAction.sortActions);
        return true;
    }
    recycleAsyncId(scheduler, id, delay = 0) {
        return undefined;
    }
    _execute(state, delay) {
        if (this.active === true) {
            return super._execute(state, delay);
        }
    }
    static sortActions(a, b) {
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
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVmlydHVhbFRpbWVTY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvVmlydHVhbFRpbWVTY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUU1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFHbEQsTUFBTSxPQUFPLG9CQUFxQixTQUFRLGNBQWM7SUFPdEQsWUFBWSxrQkFBc0MsYUFBb0IsRUFDbkQsWUFBb0IsTUFBTSxDQUFDLGlCQUFpQjtRQUM3RCxLQUFLLENBQUMsZUFBZSxFQUFFLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUR4QixjQUFTLEdBQVQsU0FBUyxDQUFtQztRQUp4RCxVQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFVBQUssR0FBVyxDQUFDLENBQUMsQ0FBQztJQUsxQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUs7UUFFVixNQUFNLEVBQUMsT0FBTyxFQUFFLFNBQVMsRUFBQyxHQUFHLElBQUksQ0FBQztRQUNsQyxJQUFJLEtBQVUsRUFBRSxNQUF3QixDQUFDO1FBRXpDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssSUFBSSxTQUFTLEVBQUU7WUFDekQsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztZQUUxQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxFQUFFO2dCQUN0RCxNQUFNO2FBQ1A7U0FDRjtRQUVELElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUMvQixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEI7WUFDRCxNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQzs7QUFuQ2dCLG9DQUFlLEdBQVcsRUFBRSxDQUFDO0FBc0NoRDs7O0dBR0c7QUFDSCxNQUFNLE9BQU8sYUFBaUIsU0FBUSxXQUFjO0lBSWxELFlBQXNCLFNBQStCLEVBQy9CLElBQW1ELEVBQ25ELFFBQWdCLFNBQVMsQ0FBQyxLQUFLLElBQUksQ0FBQztRQUN4RCxLQUFLLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBSEgsY0FBUyxHQUFULFNBQVMsQ0FBc0I7UUFDL0IsU0FBSSxHQUFKLElBQUksQ0FBK0M7UUFDbkQsVUFBSyxHQUFMLEtBQUssQ0FBK0I7UUFKaEQsV0FBTSxHQUFZLElBQUksQ0FBQztRQU0vQixJQUFJLENBQUMsS0FBSyxHQUFHLFNBQVMsQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3ZDLENBQUM7SUFFTSxRQUFRLENBQUMsS0FBUyxFQUFFLFFBQWdCLENBQUM7UUFDMUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7WUFDWixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3JDO1FBQ0QsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7UUFDcEIsMEVBQTBFO1FBQzFFLDBFQUEwRTtRQUMxRSx5RUFBeUU7UUFDekUsb0RBQW9EO1FBQ3BELE1BQU0sTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzVELElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDakIsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN2QyxDQUFDO0lBRVMsY0FBYyxDQUFDLFNBQStCLEVBQUUsRUFBUSxFQUFFLFFBQWdCLENBQUM7UUFDbkYsSUFBSSxDQUFDLEtBQUssR0FBRyxTQUFTLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNyQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEdBQUcsU0FBUyxDQUFDO1FBQzVCLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEIsT0FBbUMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ3JFLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVTLGNBQWMsQ0FBQyxTQUErQixFQUFFLEVBQVEsRUFBRSxRQUFnQixDQUFDO1FBQ25GLE9BQU8sU0FBUyxDQUFDO0lBQ25CLENBQUM7SUFFUyxRQUFRLENBQUMsS0FBUSxFQUFFLEtBQWE7UUFDeEMsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLElBQUksRUFBRTtZQUN4QixPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVNLE1BQU0sQ0FBQyxXQUFXLENBQUksQ0FBbUIsRUFBRSxDQUFtQjtRQUNuRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRTtZQUN2QixJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDdkIsT0FBTyxDQUFDLENBQUM7YUFDVjtpQkFBTSxJQUFJLENBQUMsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRTtnQkFDNUIsT0FBTyxDQUFDLENBQUM7YUFDVjtpQkFBTTtnQkFDTCxPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7U0FDRjthQUFNLElBQUksQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFFO1lBQzVCLE9BQU8sQ0FBQyxDQUFDO1NBQ1Y7YUFBTTtZQUNMLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDWDtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGNsYXNzIFZpcnR1YWxUaW1lU2NoZWR1bGVyIGV4dGVuZHMgQXN5bmNTY2hlZHVsZXIge1xuXG4gIHByb3RlY3RlZCBzdGF0aWMgZnJhbWVUaW1lRmFjdG9yOiBudW1iZXIgPSAxMDtcblxuICBwdWJsaWMgZnJhbWU6IG51bWJlciA9IDA7XG4gIHB1YmxpYyBpbmRleDogbnVtYmVyID0gLTE7XG5cbiAgY29uc3RydWN0b3IoU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQXN5bmNBY3Rpb24gPSBWaXJ0dWFsQWN0aW9uIGFzIGFueSxcbiAgICAgICAgICAgICAgcHVibGljIG1heEZyYW1lczogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKSB7XG4gICAgc3VwZXIoU2NoZWR1bGVyQWN0aW9uLCAoKSA9PiB0aGlzLmZyYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcm9tcHQgdGhlIFNjaGVkdWxlciB0byBleGVjdXRlIGFsbCBvZiBpdHMgcXVldWVkIGFjdGlvbnMsIHRoZXJlZm9yZVxuICAgKiBjbGVhcmluZyBpdHMgcXVldWUuXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBwdWJsaWMgZmx1c2goKTogdm9pZCB7XG5cbiAgICBjb25zdCB7YWN0aW9ucywgbWF4RnJhbWVzfSA9IHRoaXM7XG4gICAgbGV0IGVycm9yOiBhbnksIGFjdGlvbjogQXN5bmNBY3Rpb248YW55PjtcblxuICAgIHdoaWxlICgoYWN0aW9uID0gYWN0aW9uc1swXSkgJiYgYWN0aW9uLmRlbGF5IDw9IG1heEZyYW1lcykge1xuICAgICAgYWN0aW9ucy5zaGlmdCgpO1xuICAgICAgdGhpcy5mcmFtZSA9IGFjdGlvbi5kZWxheTtcblxuICAgICAgaWYgKGVycm9yID0gYWN0aW9uLmV4ZWN1dGUoYWN0aW9uLnN0YXRlLCBhY3Rpb24uZGVsYXkpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChlcnJvcikge1xuICAgICAgd2hpbGUgKGFjdGlvbiA9IGFjdGlvbnMuc2hpZnQoKSkge1xuICAgICAgICBhY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAbm9kb2NcbiAqL1xuZXhwb3J0IGNsYXNzIFZpcnR1YWxBY3Rpb248VD4gZXh0ZW5kcyBBc3luY0FjdGlvbjxUPiB7XG5cbiAgcHJvdGVjdGVkIGFjdGl2ZTogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCB3b3JrOiAodGhpczogU2NoZWR1bGVyQWN0aW9uPFQ+LCBzdGF0ZT86IFQpID0+IHZvaWQsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gc2NoZWR1bGVyLmluZGV4ICs9IDEpIHtcbiAgICBzdXBlcihzY2hlZHVsZXIsIHdvcmspO1xuICAgIHRoaXMuaW5kZXggPSBzY2hlZHVsZXIuaW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHB1YmxpYyBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoIXRoaXMuaWQpIHtcbiAgICAgIHJldHVybiBzdXBlci5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuICAgIC8vIElmIGFuIGFjdGlvbiBpcyByZXNjaGVkdWxlZCwgd2Ugc2F2ZSBhbGxvY2F0aW9ucyBieSBtdXRhdGluZyBpdHMgc3RhdGUsXG4gICAgLy8gcHVzaGluZyBpdCB0byB0aGUgZW5kIG9mIHRoZSBzY2hlZHVsZXIgcXVldWUsIGFuZCByZWN5Y2xpbmcgdGhlIGFjdGlvbi5cbiAgICAvLyBCdXQgc2luY2UgdGhlIFZpcnR1YWxUaW1lU2NoZWR1bGVyIGlzIHVzZWQgZm9yIHRlc3RpbmcsIFZpcnR1YWxBY3Rpb25zXG4gICAgLy8gbXVzdCBiZSBpbW11dGFibGUgc28gdGhleSBjYW4gYmUgaW5zcGVjdGVkIGxhdGVyLlxuICAgIGNvbnN0IGFjdGlvbiA9IG5ldyBWaXJ0dWFsQWN0aW9uKHRoaXMuc2NoZWR1bGVyLCB0aGlzLndvcmspO1xuICAgIHRoaXMuYWRkKGFjdGlvbik7XG4gICAgcmV0dXJuIGFjdGlvbi5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHJlcXVlc3RBc3luY0lkKHNjaGVkdWxlcjogVmlydHVhbFRpbWVTY2hlZHVsZXIsIGlkPzogYW55LCBkZWxheTogbnVtYmVyID0gMCk6IGFueSB7XG4gICAgdGhpcy5kZWxheSA9IHNjaGVkdWxlci5mcmFtZSArIGRlbGF5O1xuICAgIGNvbnN0IHthY3Rpb25zfSA9IHNjaGVkdWxlcjtcbiAgICBhY3Rpb25zLnB1c2godGhpcyk7XG4gICAgKGFjdGlvbnMgYXMgQXJyYXk8VmlydHVhbEFjdGlvbjxUPj4pLnNvcnQoVmlydHVhbEFjdGlvbi5zb3J0QWN0aW9ucyk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwcm90ZWN0ZWQgcmVjeWNsZUFzeW5jSWQoc2NoZWR1bGVyOiBWaXJ0dWFsVGltZVNjaGVkdWxlciwgaWQ/OiBhbnksIGRlbGF5OiBudW1iZXIgPSAwKTogYW55IHtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9leGVjdXRlKHN0YXRlOiBULCBkZWxheTogbnVtYmVyKTogYW55IHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPT09IHRydWUpIHtcbiAgICAgIHJldHVybiBzdXBlci5fZXhlY3V0ZShzdGF0ZSwgZGVsYXkpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzdGF0aWMgc29ydEFjdGlvbnM8VD4oYTogVmlydHVhbEFjdGlvbjxUPiwgYjogVmlydHVhbEFjdGlvbjxUPikge1xuICAgIGlmIChhLmRlbGF5ID09PSBiLmRlbGF5KSB7XG4gICAgICBpZiAoYS5pbmRleCA9PT0gYi5pbmRleCkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSBpZiAoYS5pbmRleCA+IGIuaW5kZXgpIHtcbiAgICAgICAgcmV0dXJuIDE7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChhLmRlbGF5ID4gYi5kZWxheSkge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAtMTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==