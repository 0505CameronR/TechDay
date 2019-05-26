import { QueueAction } from './QueueAction';
import { QueueScheduler } from './QueueScheduler';
/**
 *
 * Queue Scheduler
 *
 * <span class="informal">Put every next task on a queue, instead of executing it immediately</span>
 *
 * `queue` scheduler, when used with delay, behaves the same as {@link asyncScheduler} scheduler.
 *
 * When used without delay, it schedules given task synchronously - executes it right when
 * it is scheduled. However when called recursively, that is when inside the scheduled task,
 * another task is scheduled with queue scheduler, instead of executing immediately as well,
 * that task will be put on a queue and wait for current one to finish.
 *
 * This means that when you execute task with `queue` scheduler, you are sure it will end
 * before any other task scheduled with that scheduler will start.
 *
 * ## Examples
 * Schedule recursively first, then do something
 * ```javascript
 * import { queueScheduler } from 'rxjs';
 *
 * queueScheduler.schedule(() => {
 *   queueScheduler.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
 *
 *   console.log('first');
 * });
 *
 * // Logs:
 * // "first"
 * // "second"
 * ```
 *
 * Reschedule itself recursively
 * ```javascript
 * import { queueScheduler } from 'rxjs';
 *
 * queueScheduler.schedule(function(state) {
 *   if (state !== 0) {
 *     console.log('before', state);
 *     this.schedule(state - 1); // `this` references currently executing Action,
 *                               // which we reschedule with new state
 *     console.log('after', state);
 *   }
 * }, 0, 3);
 *
 * // In scheduler that runs recursively, you would expect:
 * // "before", 3
 * // "before", 2
 * // "before", 1
 * // "after", 1
 * // "after", 2
 * // "after", 3
 *
 * // But with queue it logs:
 * // "before", 3
 * // "after", 3
 * // "before", 2
 * // "after", 2
 * // "before", 1
 * // "after", 1
 * ```
 *
 * @static true
 * @name queue
 * @owner Scheduler
 */
export const queue = new QueueScheduler(QueueAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM1QyxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUVHO0FBRUgsTUFBTSxDQUFDLE1BQU0sS0FBSyxHQUFHLElBQUksY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUXVldWVBY3Rpb24gfSBmcm9tICcuL1F1ZXVlQWN0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIFF1ZXVlIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QdXQgZXZlcnkgbmV4dCB0YXNrIG9uIGEgcXVldWUsIGluc3RlYWQgb2YgZXhlY3V0aW5nIGl0IGltbWVkaWF0ZWx5PC9zcGFuPlxuICpcbiAqIGBxdWV1ZWAgc2NoZWR1bGVyLCB3aGVuIHVzZWQgd2l0aCBkZWxheSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiBXaGVuIHVzZWQgd2l0aG91dCBkZWxheSwgaXQgc2NoZWR1bGVzIGdpdmVuIHRhc2sgc3luY2hyb25vdXNseSAtIGV4ZWN1dGVzIGl0IHJpZ2h0IHdoZW5cbiAqIGl0IGlzIHNjaGVkdWxlZC4gSG93ZXZlciB3aGVuIGNhbGxlZCByZWN1cnNpdmVseSwgdGhhdCBpcyB3aGVuIGluc2lkZSB0aGUgc2NoZWR1bGVkIHRhc2ssXG4gKiBhbm90aGVyIHRhc2sgaXMgc2NoZWR1bGVkIHdpdGggcXVldWUgc2NoZWR1bGVyLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpbW1lZGlhdGVseSBhcyB3ZWxsLFxuICogdGhhdCB0YXNrIHdpbGwgYmUgcHV0IG9uIGEgcXVldWUgYW5kIHdhaXQgZm9yIGN1cnJlbnQgb25lIHRvIGZpbmlzaC5cbiAqXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2hlbiB5b3UgZXhlY3V0ZSB0YXNrIHdpdGggYHF1ZXVlYCBzY2hlZHVsZXIsIHlvdSBhcmUgc3VyZSBpdCB3aWxsIGVuZFxuICogYmVmb3JlIGFueSBvdGhlciB0YXNrIHNjaGVkdWxlZCB3aXRoIHRoYXQgc2NoZWR1bGVyIHdpbGwgc3RhcnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNjaGVkdWxlIHJlY3Vyc2l2ZWx5IGZpcnN0LCB0aGVuIGRvIHNvbWV0aGluZ1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgcXVldWVTY2hlZHVsZXIgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBxdWV1ZVNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiB7XG4gKiAgIHF1ZXVlU2NoZWR1bGVyLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdzZWNvbmQnKSk7IC8vIHdpbGwgbm90IGhhcHBlbiBub3csIGJ1dCB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlXG4gKlxuICogICBjb25zb2xlLmxvZygnZmlyc3QnKTtcbiAqIH0pO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqIC8vIFwic2Vjb25kXCJcbiAqIGBgYFxuICpcbiAqIFJlc2NoZWR1bGUgaXRzZWxmIHJlY3Vyc2l2ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBxdWV1ZVNjaGVkdWxlciB9IGZyb20gJ3J4anMnO1xuICpcbiAqIHF1ZXVlU2NoZWR1bGVyLnNjaGVkdWxlKGZ1bmN0aW9uKHN0YXRlKSB7XG4gKiAgIGlmIChzdGF0ZSAhPT0gMCkge1xuICogICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBzdGF0ZSk7XG4gKiAgICAgdGhpcy5zY2hlZHVsZShzdGF0ZSAtIDEpOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdlIHJlc2NoZWR1bGUgd2l0aCBuZXcgc3RhdGVcbiAqICAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCBzdGF0ZSk7XG4gKiAgIH1cbiAqIH0sIDAsIDMpO1xuICpcbiAqIC8vIEluIHNjaGVkdWxlciB0aGF0IHJ1bnMgcmVjdXJzaXZlbHksIHlvdSB3b3VsZCBleHBlY3Q6XG4gKiAvLyBcImJlZm9yZVwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMlxuICogLy8gXCJhZnRlclwiLCAzXG4gKlxuICogLy8gQnV0IHdpdGggcXVldWUgaXQgbG9nczpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYWZ0ZXJcIiwgM1xuICogLy8gXCJiZWZvcmVcIiwgMlxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcXVldWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgcXVldWUgPSBuZXcgUXVldWVTY2hlZHVsZXIoUXVldWVBY3Rpb24pO1xuIl19