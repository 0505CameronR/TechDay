"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An execution context and a data structure to order tasks and schedule their
 * execution. Provides a notion of (potentially virtual) time, through the
 * `now()` getter method.
 *
 * Each unit of work in a Scheduler is called an `Action`.
 *
 * ```ts
 * class Scheduler {
 *   now(): number;
 *   schedule(work, delay?, state?): Subscription;
 * }
 * ```
 *
 * @class Scheduler
 * @deprecated Scheduler is an internal implementation detail of RxJS, and
 * should not be used directly. Rather, create your own class and implement
 * {@link SchedulerLike}
 */
var Scheduler = /** @class */ (function () {
    function Scheduler(SchedulerAction, now) {
        if (now === void 0) { now = Scheduler.now; }
        this.SchedulerAction = SchedulerAction;
        this.now = now;
    }
    /**
     * Schedules a function, `work`, for execution. May happen at some point in
     * the future, according to the `delay` parameter, if specified. May be passed
     * some context object, `state`, which will be passed to the `work` function.
     *
     * The given arguments will be processed an stored as an Action object in a
     * queue of actions.
     *
     * @param {function(state: ?T): ?Subscription} work A function representing a
     * task, or some unit of work to be executed by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler itself.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @return {Subscription} A subscription in order to be able to unsubscribe
     * the scheduled work.
     */
    Scheduler.prototype.schedule = function (work, delay, state) {
        if (delay === void 0) { delay = 0; }
        return new this.SchedulerAction(this, work).schedule(state, delay);
    };
    /**
     * Note: the extra arrow function wrapper is to make testing by overriding
     * Date.now easier.
     * @nocollapse
     */
    Scheduler.now = function () { return Date.now(); };
    return Scheduler;
}());
exports.Scheduler = Scheduler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9TY2hlZHVsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQTs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0g7SUFTRSxtQkFBb0IsZUFBOEIsRUFDdEMsR0FBaUM7UUFBakMsb0JBQUEsRUFBQSxNQUFvQixTQUFTLENBQUMsR0FBRztRQUR6QixvQkFBZSxHQUFmLGVBQWUsQ0FBZTtRQUVoRCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBWUQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSw0QkFBUSxHQUFmLFVBQW1CLElBQW1ELEVBQUUsS0FBaUIsRUFBRSxLQUFTO1FBQTVCLHNCQUFBLEVBQUEsU0FBaUI7UUFDdkYsT0FBTyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUksSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQXpDRDs7OztPQUlHO0lBQ1csYUFBRyxHQUFpQixjQUFNLE9BQUEsSUFBSSxDQUFDLEdBQUcsRUFBRSxFQUFWLENBQVUsQ0FBQztJQXFDckQsZ0JBQUM7Q0FBQSxBQTVDRCxJQTRDQztBQTVDWSw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFjdGlvbiB9IGZyb20gJy4vc2NoZWR1bGVyL0FjdGlvbic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuL3R5cGVzJztcblxuLyoqXG4gKiBBbiBleGVjdXRpb24gY29udGV4dCBhbmQgYSBkYXRhIHN0cnVjdHVyZSB0byBvcmRlciB0YXNrcyBhbmQgc2NoZWR1bGUgdGhlaXJcbiAqIGV4ZWN1dGlvbi4gUHJvdmlkZXMgYSBub3Rpb24gb2YgKHBvdGVudGlhbGx5IHZpcnR1YWwpIHRpbWUsIHRocm91Z2ggdGhlXG4gKiBgbm93KClgIGdldHRlciBtZXRob2QuXG4gKlxuICogRWFjaCB1bml0IG9mIHdvcmsgaW4gYSBTY2hlZHVsZXIgaXMgY2FsbGVkIGFuIGBBY3Rpb25gLlxuICpcbiAqIGBgYHRzXG4gKiBjbGFzcyBTY2hlZHVsZXIge1xuICogICBub3coKTogbnVtYmVyO1xuICogICBzY2hlZHVsZSh3b3JrLCBkZWxheT8sIHN0YXRlPyk6IFN1YnNjcmlwdGlvbjtcbiAqIH1cbiAqIGBgYFxuICpcbiAqIEBjbGFzcyBTY2hlZHVsZXJcbiAqIEBkZXByZWNhdGVkIFNjaGVkdWxlciBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwgb2YgUnhKUywgYW5kXG4gKiBzaG91bGQgbm90IGJlIHVzZWQgZGlyZWN0bHkuIFJhdGhlciwgY3JlYXRlIHlvdXIgb3duIGNsYXNzIGFuZCBpbXBsZW1lbnRcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfVxuICovXG5leHBvcnQgY2xhc3MgU2NoZWR1bGVyIGltcGxlbWVudHMgU2NoZWR1bGVyTGlrZSB7XG5cbiAgLyoqXG4gICAqIE5vdGU6IHRoZSBleHRyYSBhcnJvdyBmdW5jdGlvbiB3cmFwcGVyIGlzIHRvIG1ha2UgdGVzdGluZyBieSBvdmVycmlkaW5nXG4gICAqIERhdGUubm93IGVhc2llci5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgbm93OiAoKSA9PiBudW1iZXIgPSAoKSA9PiBEYXRlLm5vdygpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgU2NoZWR1bGVyQWN0aW9uOiB0eXBlb2YgQWN0aW9uLFxuICAgICAgICAgICAgICBub3c6ICgpID0+IG51bWJlciA9IFNjaGVkdWxlci5ub3cpIHtcbiAgICB0aGlzLm5vdyA9IG5vdztcbiAgfVxuXG4gIC8qKlxuICAgKiBBIGdldHRlciBtZXRob2QgdGhhdCByZXR1cm5zIGEgbnVtYmVyIHJlcHJlc2VudGluZyB0aGUgY3VycmVudCB0aW1lXG4gICAqIChhdCB0aGUgdGltZSB0aGlzIGZ1bmN0aW9uIHdhcyBjYWxsZWQpIGFjY29yZGluZyB0byB0aGUgc2NoZWR1bGVyJ3Mgb3duXG4gICAqIGludGVybmFsIGNsb2NrLlxuICAgKiBAcmV0dXJuIHtudW1iZXJ9IEEgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyB0aGUgY3VycmVudCB0aW1lLiBNYXkgb3IgbWF5IG5vdFxuICAgKiBoYXZlIGEgcmVsYXRpb24gdG8gd2FsbC1jbG9jayB0aW1lLiBNYXkgb3IgbWF5IG5vdCByZWZlciB0byBhIHRpbWUgdW5pdFxuICAgKiAoZS5nLiBtaWxsaXNlY29uZHMpLlxuICAgKi9cbiAgcHVibGljIG5vdzogKCkgPT4gbnVtYmVyO1xuXG4gIC8qKlxuICAgKiBTY2hlZHVsZXMgYSBmdW5jdGlvbiwgYHdvcmtgLCBmb3IgZXhlY3V0aW9uLiBNYXkgaGFwcGVuIGF0IHNvbWUgcG9pbnQgaW5cbiAgICogdGhlIGZ1dHVyZSwgYWNjb3JkaW5nIHRvIHRoZSBgZGVsYXlgIHBhcmFtZXRlciwgaWYgc3BlY2lmaWVkLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAsIHdoaWNoIHdpbGwgYmUgcGFzc2VkIHRvIHRoZSBgd29ya2AgZnVuY3Rpb24uXG4gICAqXG4gICAqIFRoZSBnaXZlbiBhcmd1bWVudHMgd2lsbCBiZSBwcm9jZXNzZWQgYW4gc3RvcmVkIGFzIGFuIEFjdGlvbiBvYmplY3QgaW4gYVxuICAgKiBxdWV1ZSBvZiBhY3Rpb25zLlxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKHN0YXRlOiA/VCk6ID9TdWJzY3JpcHRpb259IHdvcmsgQSBmdW5jdGlvbiByZXByZXNlbnRpbmcgYVxuICAgKiB0YXNrLCBvciBzb21lIHVuaXQgb2Ygd29yayB0byBiZSBleGVjdXRlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyIGl0c2VsZi5cbiAgICogQHBhcmFtIHtUfSBbc3RhdGVdIFNvbWUgY29udGV4dHVhbCBkYXRhIHRoYXQgdGhlIGB3b3JrYCBmdW5jdGlvbiB1c2VzIHdoZW5cbiAgICogY2FsbGVkIGJ5IHRoZSBTY2hlZHVsZXIuXG4gICAqIEByZXR1cm4ge1N1YnNjcmlwdGlvbn0gQSBzdWJzY3JpcHRpb24gaW4gb3JkZXIgdG8gYmUgYWJsZSB0byB1bnN1YnNjcmliZVxuICAgKiB0aGUgc2NoZWR1bGVkIHdvcmsuXG4gICAqL1xuICBwdWJsaWMgc2NoZWR1bGU8VD4od29yazogKHRoaXM6IFNjaGVkdWxlckFjdGlvbjxUPiwgc3RhdGU/OiBUKSA9PiB2b2lkLCBkZWxheTogbnVtYmVyID0gMCwgc3RhdGU/OiBUKTogU3Vic2NyaXB0aW9uIHtcbiAgICByZXR1cm4gbmV3IHRoaXMuU2NoZWR1bGVyQWN0aW9uPFQ+KHRoaXMsIHdvcmspLnNjaGVkdWxlKHN0YXRlLCBkZWxheSk7XG4gIH1cbn1cbiJdfQ==