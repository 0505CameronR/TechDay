import { Scheduler } from '../Scheduler';
export class AsyncScheduler extends Scheduler {
    constructor(SchedulerAction, now = Scheduler.now) {
        super(SchedulerAction, () => {
            if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
                return AsyncScheduler.delegate.now();
            }
            else {
                return now();
            }
        });
        this.actions = [];
        /**
         * A flag to indicate whether the Scheduler is currently executing a batch of
         * queued actions.
         * @type {boolean}
         * @deprecated internal use only
         */
        this.active = false;
        /**
         * An internal ID used to track the latest asynchronous task such as those
         * coming from `setTimeout`, `setInterval`, `requestAnimationFrame`, and
         * others.
         * @type {any}
         * @deprecated internal use only
         */
        this.scheduled = undefined;
    }
    schedule(work, delay = 0, state) {
        if (AsyncScheduler.delegate && AsyncScheduler.delegate !== this) {
            return AsyncScheduler.delegate.schedule(work, delay, state);
        }
        else {
            return super.schedule(work, delay, state);
        }
    }
    flush(action) {
        const { actions } = this;
        if (this.active) {
            actions.push(action);
            return;
        }
        let error;
        this.active = true;
        do {
            if (error = action.execute(action.state, action.delay)) {
                break;
            }
        } while (action = actions.shift()); // exhaust the scheduler queue
        this.active = false;
        if (error) {
            while (action = actions.shift()) {
                action.unsubscribe();
            }
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNTY2hlZHVsZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvQXN5bmNTY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQU16QyxNQUFNLE9BQU8sY0FBZSxTQUFRLFNBQVM7SUFtQjNDLFlBQVksZUFBOEIsRUFDOUIsTUFBb0IsU0FBUyxDQUFDLEdBQUc7UUFDM0MsS0FBSyxDQUFDLGVBQWUsRUFBRSxHQUFHLEVBQUU7WUFDMUIsSUFBSSxjQUFjLENBQUMsUUFBUSxJQUFJLGNBQWMsQ0FBQyxRQUFRLEtBQUssSUFBSSxFQUFFO2dCQUMvRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDdEM7aUJBQU07Z0JBQ0wsT0FBTyxHQUFHLEVBQUUsQ0FBQzthQUNkO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUF6QkUsWUFBTyxHQUE0QixFQUFFLENBQUM7UUFDN0M7Ozs7O1dBS0c7UUFDSSxXQUFNLEdBQVksS0FBSyxDQUFDO1FBQy9COzs7Ozs7V0FNRztRQUNJLGNBQVMsR0FBUSxTQUFTLENBQUM7SUFXbEMsQ0FBQztJQUVNLFFBQVEsQ0FBSSxJQUFtRCxFQUFFLFFBQWdCLENBQUMsRUFBRSxLQUFTO1FBQ2xHLElBQUksY0FBYyxDQUFDLFFBQVEsSUFBSSxjQUFjLENBQUMsUUFBUSxLQUFLLElBQUksRUFBRTtZQUMvRCxPQUFPLGNBQWMsQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDN0Q7YUFBTTtZQUNMLE9BQU8sS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzNDO0lBQ0gsQ0FBQztJQUVNLEtBQUssQ0FBQyxNQUF3QjtRQUVuQyxNQUFNLEVBQUMsT0FBTyxFQUFDLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE9BQU8sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDckIsT0FBTztTQUNSO1FBRUQsSUFBSSxLQUFVLENBQUM7UUFDZixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUVuQixHQUFHO1lBQ0QsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBRTtnQkFDdEQsTUFBTTthQUNQO1NBQ0YsUUFBUSxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsOEJBQThCO1FBRWxFLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBRXBCLElBQUksS0FBSyxFQUFFO1lBQ1QsT0FBTyxNQUFNLEdBQUcsT0FBTyxDQUFDLEtBQUssRUFBRSxFQUFFO2dCQUMvQixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDdEI7WUFDRCxNQUFNLEtBQUssQ0FBQztTQUNiO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vQWN0aW9uJztcbmltcG9ydCB7IEFzeW5jQWN0aW9uIH0gZnJvbSAnLi9Bc3luY0FjdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG5leHBvcnQgY2xhc3MgQXN5bmNTY2hlZHVsZXIgZXh0ZW5kcyBTY2hlZHVsZXIge1xuICBwdWJsaWMgc3RhdGljIGRlbGVnYXRlPzogU2NoZWR1bGVyO1xuICBwdWJsaWMgYWN0aW9uczogQXJyYXk8QXN5bmNBY3Rpb248YW55Pj4gPSBbXTtcbiAgLyoqXG4gICAqIEEgZmxhZyB0byBpbmRpY2F0ZSB3aGV0aGVyIHRoZSBTY2hlZHVsZXIgaXMgY3VycmVudGx5IGV4ZWN1dGluZyBhIGJhdGNoIG9mXG4gICAqIHF1ZXVlZCBhY3Rpb25zLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICogQGRlcHJlY2F0ZWQgaW50ZXJuYWwgdXNlIG9ubHlcbiAgICovXG4gIHB1YmxpYyBhY3RpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIEFuIGludGVybmFsIElEIHVzZWQgdG8gdHJhY2sgdGhlIGxhdGVzdCBhc3luY2hyb25vdXMgdGFzayBzdWNoIGFzIHRob3NlXG4gICAqIGNvbWluZyBmcm9tIGBzZXRUaW1lb3V0YCwgYHNldEludGVydmFsYCwgYHJlcXVlc3RBbmltYXRpb25GcmFtZWAsIGFuZFxuICAgKiBvdGhlcnMuXG4gICAqIEB0eXBlIHthbnl9XG4gICAqIEBkZXByZWNhdGVkIGludGVybmFsIHVzZSBvbmx5XG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGVkOiBhbnkgPSB1bmRlZmluZWQ7XG5cbiAgY29uc3RydWN0b3IoU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQWN0aW9uLFxuICAgICAgICAgICAgICBub3c6ICgpID0+IG51bWJlciA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICBzdXBlcihTY2hlZHVsZXJBY3Rpb24sICgpID0+IHtcbiAgICAgIGlmIChBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAmJiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZSAhPT0gdGhpcykge1xuICAgICAgICByZXR1cm4gQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUubm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbm93KCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgc2NoZWR1bGU8VD4od29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLCBkZWxheTogbnVtYmVyID0gMCwgc3RhdGU/OiBUKTogU3Vic2NyaXB0aW9uIHtcbiAgICBpZiAoQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgJiYgQXN5bmNTY2hlZHVsZXIuZGVsZWdhdGUgIT09IHRoaXMpIHtcbiAgICAgIHJldHVybiBBc3luY1NjaGVkdWxlci5kZWxlZ2F0ZS5zY2hlZHVsZSh3b3JrLCBkZWxheSwgc3RhdGUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuc2NoZWR1bGUod29yaywgZGVsYXksIHN0YXRlKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgZmx1c2goYWN0aW9uOiBBc3luY0FjdGlvbjxhbnk+KTogdm9pZCB7XG5cbiAgICBjb25zdCB7YWN0aW9uc30gPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgICBhY3Rpb25zLnB1c2goYWN0aW9uKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgZXJyb3I6IGFueTtcbiAgICB0aGlzLmFjdGl2ZSA9IHRydWU7XG5cbiAgICBkbyB7XG4gICAgICBpZiAoZXJyb3IgPSBhY3Rpb24uZXhlY3V0ZShhY3Rpb24uc3RhdGUsIGFjdGlvbi5kZWxheSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKTsgLy8gZXhoYXVzdCB0aGUgc2NoZWR1bGVyIHF1ZXVlXG5cbiAgICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xuXG4gICAgaWYgKGVycm9yKSB7XG4gICAgICB3aGlsZSAoYWN0aW9uID0gYWN0aW9ucy5zaGlmdCgpKSB7XG4gICAgICAgIGFjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=