import { AsyncAction } from './AsyncAction';
import { AsyncScheduler } from './AsyncScheduler';
/**
 *
 * Async Scheduler
 *
 * <span class="informal">Schedule task as if you used setTimeout(task, duration)</span>
 *
 * `async` scheduler schedules tasks asynchronously, by putting them on the JavaScript
 * event loop queue. It is best used to delay tasks in time or to schedule tasks repeating
 * in intervals.
 *
 * If you just want to "defer" task, that is to perform it right after currently
 * executing synchronous code ends (commonly achieved by `setTimeout(deferredTask, 0)`),
 * better choice will be the {@link asapScheduler} scheduler.
 *
 * ## Examples
 * Use async scheduler to delay task
 * ```javascript
 * import { asyncScheduler } from 'rxjs';
 *
 * const task = () => console.log('it works!');
 *
 * asyncScheduler.schedule(task, 2000);
 *
 * // After 2 seconds logs:
 * // "it works!"
 * ```
 *
 * Use async scheduler to repeat task in intervals
 * ```javascript
 * import { asyncScheduler } from 'rxjs';
 *
 * function task(state) {
 *   console.log(state);
 *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
 *                                   // which we reschedule with new state and delay
 * }
 *
 * asyncScheduler.schedule(task, 3000, 0);
 *
 * // Logs:
 * // 0 after 3s
 * // 1 after 4s
 * // 2 after 5s
 * // 3 after 6s
 * ```
 *
 * @static true
 * @name async
 * @owner Scheduler
 */
export const async = new AsyncScheduler(AsyncAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFFSCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQUcsSUFBSSxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXN5bmMgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlNjaGVkdWxlIHRhc2sgYXMgaWYgeW91IHVzZWQgc2V0VGltZW91dCh0YXNrLCBkdXJhdGlvbik8L3NwYW4+XG4gKlxuICogYGFzeW5jYCBzY2hlZHVsZXIgc2NoZWR1bGVzIHRhc2tzIGFzeW5jaHJvbm91c2x5LCBieSBwdXR0aW5nIHRoZW0gb24gdGhlIEphdmFTY3JpcHRcbiAqIGV2ZW50IGxvb3AgcXVldWUuIEl0IGlzIGJlc3QgdXNlZCB0byBkZWxheSB0YXNrcyBpbiB0aW1lIG9yIHRvIHNjaGVkdWxlIHRhc2tzIHJlcGVhdGluZ1xuICogaW4gaW50ZXJ2YWxzLlxuICpcbiAqIElmIHlvdSBqdXN0IHdhbnQgdG8gXCJkZWZlclwiIHRhc2ssIHRoYXQgaXMgdG8gcGVyZm9ybSBpdCByaWdodCBhZnRlciBjdXJyZW50bHlcbiAqIGV4ZWN1dGluZyBzeW5jaHJvbm91cyBjb2RlIGVuZHMgKGNvbW1vbmx5IGFjaGlldmVkIGJ5IGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgKSxcbiAqIGJldHRlciBjaG9pY2Ugd2lsbCBiZSB0aGUge0BsaW5rIGFzYXBTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogVXNlIGFzeW5jIHNjaGVkdWxlciB0byBkZWxheSB0YXNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBhc3luY1NjaGVkdWxlciB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IHRhc2sgPSAoKSA9PiBjb25zb2xlLmxvZygnaXQgd29ya3MhJyk7XG4gKlxuICogYXN5bmNTY2hlZHVsZXIuc2NoZWR1bGUodGFzaywgMjAwMCk7XG4gKlxuICogLy8gQWZ0ZXIgMiBzZWNvbmRzIGxvZ3M6XG4gKiAvLyBcIml0IHdvcmtzIVwiXG4gKiBgYGBcbiAqXG4gKiBVc2UgYXN5bmMgc2NoZWR1bGVyIHRvIHJlcGVhdCB0YXNrIGluIGludGVydmFsc1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBmdW5jdGlvbiB0YXNrKHN0YXRlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAqICAgdGhpcy5zY2hlZHVsZShzdGF0ZSArIDEsIDEwMDApOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlIGFuZCBkZWxheVxuICogfVxuICpcbiAqIGFzeW5jU2NoZWR1bGVyLnNjaGVkdWxlKHRhc2ssIDMwMDAsIDApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwIGFmdGVyIDNzXG4gKiAvLyAxIGFmdGVyIDRzXG4gKiAvLyAyIGFmdGVyIDVzXG4gKiAvLyAzIGFmdGVyIDZzXG4gKiBgYGBcbiAqXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGFzeW5jXG4gKiBAb3duZXIgU2NoZWR1bGVyXG4gKi9cblxuZXhwb3J0IGNvbnN0IGFzeW5jID0gbmV3IEFzeW5jU2NoZWR1bGVyKEFzeW5jQWN0aW9uKTtcbiJdfQ==