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
var Subscription_1 = require("../Subscription");
/**
 * A unit of work to be executed in a `scheduler`. An action is typically
 * created from within a {@link SchedulerLike} and an RxJS user does not need to concern
 * themselves about creating and manipulating an Action.
 *
 * ```ts
 * class Action<T> extends Subscription {
 *   new (scheduler: Scheduler, work: (state?: T) => void);
 *   schedule(state?: T, delay: number = 0): Subscription;
 * }
 * ```
 *
 * @class Action<T>
 */
var Action = /** @class */ (function (_super) {
    __extends(Action, _super);
    function Action(scheduler, work) {
        return _super.call(this) || this;
    }
    /**
     * Schedules this action on its parent {@link SchedulerLike} for execution. May be passed
     * some context object, `state`. May happen at some point in the future,
     * according to the `delay` parameter, if specified.
     * @param {T} [state] Some contextual data that the `work` function uses when
     * called by the Scheduler.
     * @param {number} [delay] Time to wait before executing the work, where the
     * time unit is implicit and defined by the Scheduler.
     * @return {void}
     */
    Action.prototype.schedule = function (state, delay) {
        if (delay === void 0) { delay = 0; }
        return this;
    };
    return Action;
}(Subscription_1.Subscription));
exports.Action = Action;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvQWN0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLGdEQUErQztBQUcvQzs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0g7SUFBK0IsMEJBQVk7SUFDekMsZ0JBQVksU0FBb0IsRUFBRSxJQUFtRDtlQUNuRixpQkFBTztJQUNULENBQUM7SUFDRDs7Ozs7Ozs7O09BU0c7SUFDSSx5QkFBUSxHQUFmLFVBQWdCLEtBQVMsRUFBRSxLQUFpQjtRQUFqQixzQkFBQSxFQUFBLFNBQWlCO1FBQzFDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUNILGFBQUM7QUFBRCxDQUFDLEFBakJELENBQStCLDJCQUFZLEdBaUIxQztBQWpCWSx3QkFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEEgdW5pdCBvZiB3b3JrIHRvIGJlIGV4ZWN1dGVkIGluIGEgYHNjaGVkdWxlcmAuIEFuIGFjdGlvbiBpcyB0eXBpY2FsbHlcbiAqIGNyZWF0ZWQgZnJvbSB3aXRoaW4gYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gYW5kIGFuIFJ4SlMgdXNlciBkb2VzIG5vdCBuZWVkIHRvIGNvbmNlcm5cbiAqIHRoZW1zZWx2ZXMgYWJvdXQgY3JlYXRpbmcgYW5kIG1hbmlwdWxhdGluZyBhbiBBY3Rpb24uXG4gKlxuICogYGBgdHNcbiAqIGNsYXNzIEFjdGlvbjxUPiBleHRlbmRzIFN1YnNjcmlwdGlvbiB7XG4gKiAgIG5ldyAoc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6IChzdGF0ZT86IFQpID0+IHZvaWQpO1xuICogICBzY2hlZHVsZShzdGF0ZT86IFQsIGRlbGF5OiBudW1iZXIgPSAwKTogU3Vic2NyaXB0aW9uO1xuICogfVxuICogYGBgXG4gKlxuICogQGNsYXNzIEFjdGlvbjxUPlxuICovXG5leHBvcnQgY2xhc3MgQWN0aW9uPFQ+IGV4dGVuZHMgU3Vic2NyaXB0aW9uIHtcbiAgY29uc3RydWN0b3Ioc2NoZWR1bGVyOiBTY2hlZHVsZXIsIHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCkge1xuICAgIHN1cGVyKCk7XG4gIH1cbiAgLyoqXG4gICAqIFNjaGVkdWxlcyB0aGlzIGFjdGlvbiBvbiBpdHMgcGFyZW50IHtAbGluayBTY2hlZHVsZXJMaWtlfSBmb3IgZXhlY3V0aW9uLiBNYXkgYmUgcGFzc2VkXG4gICAqIHNvbWUgY29udGV4dCBvYmplY3QsIGBzdGF0ZWAuIE1heSBoYXBwZW4gYXQgc29tZSBwb2ludCBpbiB0aGUgZnV0dXJlLFxuICAgKiBhY2NvcmRpbmcgdG8gdGhlIGBkZWxheWAgcGFyYW1ldGVyLCBpZiBzcGVjaWZpZWQuXG4gICAqIEBwYXJhbSB7VH0gW3N0YXRlXSBTb21lIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBgd29ya2AgZnVuY3Rpb24gdXNlcyB3aGVuXG4gICAqIGNhbGxlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcGFyYW0ge251bWJlcn0gW2RlbGF5XSBUaW1lIHRvIHdhaXQgYmVmb3JlIGV4ZWN1dGluZyB0aGUgd29yaywgd2hlcmUgdGhlXG4gICAqIHRpbWUgdW5pdCBpcyBpbXBsaWNpdCBhbmQgZGVmaW5lZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlKHN0YXRlPzogVCwgZGVsYXk6IG51bWJlciA9IDApOiBTdWJzY3JpcHRpb24ge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG59XG4iXX0=