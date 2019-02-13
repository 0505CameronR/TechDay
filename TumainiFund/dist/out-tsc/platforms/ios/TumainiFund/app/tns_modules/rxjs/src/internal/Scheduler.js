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
export class Scheduler {
    constructor(SchedulerAction, now = Scheduler.now) {
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
    schedule(work, delay = 0, state) {
        return new this.SchedulerAction(this, work).schedule(state, delay);
    }
}
/**
 * Note: the extra arrow function wrapper is to make testing by overriding
 * Date.now easier.
 * @nocollapse
 */
Scheduler.now = () => Date.now();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2NoZWR1bGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvU2NoZWR1bGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUlBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFDSCxNQUFNLE9BQU8sU0FBUztJQVNwQixZQUFvQixlQUE4QixFQUN0QyxNQUFvQixTQUFTLENBQUMsR0FBRztRQUR6QixvQkFBZSxHQUFmLGVBQWUsQ0FBZTtRQUVoRCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztJQUNqQixDQUFDO0lBWUQ7Ozs7Ozs7Ozs7Ozs7Ozs7T0FnQkc7SUFDSSxRQUFRLENBQUksSUFBbUQsRUFBRSxRQUFnQixDQUFDLEVBQUUsS0FBUztRQUNsRyxPQUFPLElBQUksSUFBSSxDQUFDLGVBQWUsQ0FBSSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUMsUUFBUSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN4RSxDQUFDOztBQXpDRDs7OztHQUlHO0FBQ1csYUFBRyxHQUFpQixHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBY3Rpb24gfSBmcm9tICcuL3NjaGVkdWxlci9BY3Rpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi90eXBlcyc7XG5cbi8qKlxuICogQW4gZXhlY3V0aW9uIGNvbnRleHQgYW5kIGEgZGF0YSBzdHJ1Y3R1cmUgdG8gb3JkZXIgdGFza3MgYW5kIHNjaGVkdWxlIHRoZWlyXG4gKiBleGVjdXRpb24uIFByb3ZpZGVzIGEgbm90aW9uIG9mIChwb3RlbnRpYWxseSB2aXJ0dWFsKSB0aW1lLCB0aHJvdWdoIHRoZVxuICogYG5vdygpYCBnZXR0ZXIgbWV0aG9kLlxuICpcbiAqIEVhY2ggdW5pdCBvZiB3b3JrIGluIGEgU2NoZWR1bGVyIGlzIGNhbGxlZCBhbiBgQWN0aW9uYC5cbiAqXG4gKiBgYGB0c1xuICogY2xhc3MgU2NoZWR1bGVyIHtcbiAqICAgbm93KCk6IG51bWJlcjtcbiAqICAgc2NoZWR1bGUod29yaywgZGVsYXk/LCBzdGF0ZT8pOiBTdWJzY3JpcHRpb247XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAY2xhc3MgU2NoZWR1bGVyXG4gKiBAZGVwcmVjYXRlZCBTY2hlZHVsZXIgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsIG9mIFJ4SlMsIGFuZFxuICogc2hvdWxkIG5vdCBiZSB1c2VkIGRpcmVjdGx5LiBSYXRoZXIsIGNyZWF0ZSB5b3VyIG93biBjbGFzcyBhbmQgaW1wbGVtZW50XG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX1cbiAqL1xuZXhwb3J0IGNsYXNzIFNjaGVkdWxlciBpbXBsZW1lbnRzIFNjaGVkdWxlckxpa2Uge1xuXG4gIC8qKlxuICAgKiBOb3RlOiB0aGUgZXh0cmEgYXJyb3cgZnVuY3Rpb24gd3JhcHBlciBpcyB0byBtYWtlIHRlc3RpbmcgYnkgb3ZlcnJpZGluZ1xuICAgKiBEYXRlLm5vdyBlYXNpZXIuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIG5vdzogKCkgPT4gbnVtYmVyID0gKCkgPT4gRGF0ZS5ub3coKTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIFNjaGVkdWxlckFjdGlvbjogdHlwZW9mIEFjdGlvbixcbiAgICAgICAgICAgICAgbm93OiAoKSA9PiBudW1iZXIgPSBTY2hlZHVsZXIubm93KSB7XG4gICAgdGhpcy5ub3cgPSBub3c7XG4gIH1cblxuICAvKipcbiAgICogQSBnZXR0ZXIgbWV0aG9kIHRoYXQgcmV0dXJucyBhIG51bWJlciByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgdGltZVxuICAgKiAoYXQgdGhlIHRpbWUgdGhpcyBmdW5jdGlvbiB3YXMgY2FsbGVkKSBhY2NvcmRpbmcgdG8gdGhlIHNjaGVkdWxlcidzIG93blxuICAgKiBpbnRlcm5hbCBjbG9jay5cbiAgICogQHJldHVybiB7bnVtYmVyfSBBIG51bWJlciB0aGF0IHJlcHJlc2VudHMgdGhlIGN1cnJlbnQgdGltZS4gTWF5IG9yIG1heSBub3RcbiAgICogaGF2ZSBhIHJlbGF0aW9uIHRvIHdhbGwtY2xvY2sgdGltZS4gTWF5IG9yIG1heSBub3QgcmVmZXIgdG8gYSB0aW1lIHVuaXRcbiAgICogKGUuZy4gbWlsbGlzZWNvbmRzKS5cbiAgICovXG4gIHB1YmxpYyBub3c6ICgpID0+IG51bWJlcjtcblxuICAvKipcbiAgICogU2NoZWR1bGVzIGEgZnVuY3Rpb24sIGB3b3JrYCwgZm9yIGV4ZWN1dGlvbi4gTWF5IGhhcHBlbiBhdCBzb21lIHBvaW50IGluXG4gICAqIHRoZSBmdXR1cmUsIGFjY29yZGluZyB0byB0aGUgYGRlbGF5YCBwYXJhbWV0ZXIsIGlmIHNwZWNpZmllZC4gTWF5IGJlIHBhc3NlZFxuICAgKiBzb21lIGNvbnRleHQgb2JqZWN0LCBgc3RhdGVgLCB3aGljaCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgYHdvcmtgIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBUaGUgZ2l2ZW4gYXJndW1lbnRzIHdpbGwgYmUgcHJvY2Vzc2VkIGFuIHN0b3JlZCBhcyBhbiBBY3Rpb24gb2JqZWN0IGluIGFcbiAgICogcXVldWUgb2YgYWN0aW9ucy5cbiAgICpcbiAgICogQHBhcmFtIHtmdW5jdGlvbihzdGF0ZTogP1QpOiA/U3Vic2NyaXB0aW9ufSB3b3JrIEEgZnVuY3Rpb24gcmVwcmVzZW50aW5nIGFcbiAgICogdGFzaywgb3Igc29tZSB1bml0IG9mIHdvcmsgdG8gYmUgZXhlY3V0ZWQgYnkgdGhlIFNjaGVkdWxlci5cbiAgICogQHBhcmFtIHtudW1iZXJ9IFtkZWxheV0gVGltZSB0byB3YWl0IGJlZm9yZSBleGVjdXRpbmcgdGhlIHdvcmssIHdoZXJlIHRoZVxuICAgKiB0aW1lIHVuaXQgaXMgaW1wbGljaXQgYW5kIGRlZmluZWQgYnkgdGhlIFNjaGVkdWxlciBpdHNlbGYuXG4gICAqIEBwYXJhbSB7VH0gW3N0YXRlXSBTb21lIGNvbnRleHR1YWwgZGF0YSB0aGF0IHRoZSBgd29ya2AgZnVuY3Rpb24gdXNlcyB3aGVuXG4gICAqIGNhbGxlZCBieSB0aGUgU2NoZWR1bGVyLlxuICAgKiBAcmV0dXJuIHtTdWJzY3JpcHRpb259IEEgc3Vic2NyaXB0aW9uIGluIG9yZGVyIHRvIGJlIGFibGUgdG8gdW5zdWJzY3JpYmVcbiAgICogdGhlIHNjaGVkdWxlZCB3b3JrLlxuICAgKi9cbiAgcHVibGljIHNjaGVkdWxlPFQ+KHdvcms6ICh0aGlzOiBTY2hlZHVsZXJBY3Rpb248VD4sIHN0YXRlPzogVCkgPT4gdm9pZCwgZGVsYXk6IG51bWJlciA9IDAsIHN0YXRlPzogVCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLlNjaGVkdWxlckFjdGlvbjxUPih0aGlzLCB3b3JrKS5zY2hlZHVsZShzdGF0ZSwgZGVsYXkpO1xuICB9XG59XG4iXX0=