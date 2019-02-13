"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncAction_1 = require("./AsyncAction");
var AsyncScheduler_1 = require("./AsyncScheduler");
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
 * const task = () => console.log('it works!');
 *
 * Rx.Scheduler.async.schedule(task, 2000);
 *
 * // After 2 seconds logs:
 * // "it works!"
 * ```
 *
 * Use async scheduler to repeat task in intervals
 * ```javascript
 * function task(state) {
 *   console.log(state);
 *   this.schedule(state + 1, 1000); // `this` references currently executing Action,
 *                                   // which we reschedule with new state and delay
 * }
 *
 * Rx.Scheduler.async.schedule(task, 3000, 0);
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
exports.async = new AsyncScheduler_1.AsyncScheduler(AsyncAction_1.AsyncAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9hc3luYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZDRztBQUVVLFFBQUEsS0FBSyxHQUFHLElBQUksK0JBQWMsQ0FBQyx5QkFBVyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc3luY0FjdGlvbiB9IGZyb20gJy4vQXN5bmNBY3Rpb24nO1xuaW1wb3J0IHsgQXN5bmNTY2hlZHVsZXIgfSBmcm9tICcuL0FzeW5jU2NoZWR1bGVyJztcblxuLyoqXG4gKlxuICogQXN5bmMgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlNjaGVkdWxlIHRhc2sgYXMgaWYgeW91IHVzZWQgc2V0VGltZW91dCh0YXNrLCBkdXJhdGlvbik8L3NwYW4+XG4gKlxuICogYGFzeW5jYCBzY2hlZHVsZXIgc2NoZWR1bGVzIHRhc2tzIGFzeW5jaHJvbm91c2x5LCBieSBwdXR0aW5nIHRoZW0gb24gdGhlIEphdmFTY3JpcHRcbiAqIGV2ZW50IGxvb3AgcXVldWUuIEl0IGlzIGJlc3QgdXNlZCB0byBkZWxheSB0YXNrcyBpbiB0aW1lIG9yIHRvIHNjaGVkdWxlIHRhc2tzIHJlcGVhdGluZ1xuICogaW4gaW50ZXJ2YWxzLlxuICpcbiAqIElmIHlvdSBqdXN0IHdhbnQgdG8gXCJkZWZlclwiIHRhc2ssIHRoYXQgaXMgdG8gcGVyZm9ybSBpdCByaWdodCBhZnRlciBjdXJyZW50bHlcbiAqIGV4ZWN1dGluZyBzeW5jaHJvbm91cyBjb2RlIGVuZHMgKGNvbW1vbmx5IGFjaGlldmVkIGJ5IGBzZXRUaW1lb3V0KGRlZmVycmVkVGFzaywgMClgKSxcbiAqIGJldHRlciBjaG9pY2Ugd2lsbCBiZSB0aGUge0BsaW5rIGFzYXBTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogVXNlIGFzeW5jIHNjaGVkdWxlciB0byBkZWxheSB0YXNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCB0YXNrID0gKCkgPT4gY29uc29sZS5sb2coJ2l0IHdvcmtzIScpO1xuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAyMDAwKTtcbiAqXG4gKiAvLyBBZnRlciAyIHNlY29uZHMgbG9nczpcbiAqIC8vIFwiaXQgd29ya3MhXCJcbiAqIGBgYFxuICpcbiAqIFVzZSBhc3luYyBzY2hlZHVsZXIgdG8gcmVwZWF0IHRhc2sgaW4gaW50ZXJ2YWxzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiB0YXNrKHN0YXRlKSB7XG4gKiAgIGNvbnNvbGUubG9nKHN0YXRlKTtcbiAqICAgdGhpcy5zY2hlZHVsZShzdGF0ZSArIDEsIDEwMDApOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGljaCB3ZSByZXNjaGVkdWxlIHdpdGggbmV3IHN0YXRlIGFuZCBkZWxheVxuICogfVxuICpcbiAqIFJ4LlNjaGVkdWxlci5hc3luYy5zY2hlZHVsZSh0YXNrLCAzMDAwLCAwKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMCBhZnRlciAzc1xuICogLy8gMSBhZnRlciA0c1xuICogLy8gMiBhZnRlciA1c1xuICogLy8gMyBhZnRlciA2c1xuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhc3luY1xuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBhc3luYyA9IG5ldyBBc3luY1NjaGVkdWxlcihBc3luY0FjdGlvbik7XG4iXX0=