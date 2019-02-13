"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var QueueAction_1 = require("./QueueAction");
var QueueScheduler_1 = require("./QueueScheduler");
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
 * Rx.Scheduler.queue.schedule(() => {
 *   Rx.Scheduler.queue.schedule(() => console.log('second')); // will not happen now, but will be put on a queue
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
 * Rx.Scheduler.queue.schedule(function(state) {
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
exports.queue = new QueueScheduler_1.QueueScheduler(QueueAction_1.QueueAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9xdWV1ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFFbEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2REc7QUFFVSxRQUFBLEtBQUssR0FBRyxJQUFJLCtCQUFjLENBQUMseUJBQVcsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUXVldWVBY3Rpb24gfSBmcm9tICcuL1F1ZXVlQWN0aW9uJztcbmltcG9ydCB7IFF1ZXVlU2NoZWR1bGVyIH0gZnJvbSAnLi9RdWV1ZVNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIFF1ZXVlIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QdXQgZXZlcnkgbmV4dCB0YXNrIG9uIGEgcXVldWUsIGluc3RlYWQgb2YgZXhlY3V0aW5nIGl0IGltbWVkaWF0ZWx5PC9zcGFuPlxuICpcbiAqIGBxdWV1ZWAgc2NoZWR1bGVyLCB3aGVuIHVzZWQgd2l0aCBkZWxheSwgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlci5cbiAqXG4gKiBXaGVuIHVzZWQgd2l0aG91dCBkZWxheSwgaXQgc2NoZWR1bGVzIGdpdmVuIHRhc2sgc3luY2hyb25vdXNseSAtIGV4ZWN1dGVzIGl0IHJpZ2h0IHdoZW5cbiAqIGl0IGlzIHNjaGVkdWxlZC4gSG93ZXZlciB3aGVuIGNhbGxlZCByZWN1cnNpdmVseSwgdGhhdCBpcyB3aGVuIGluc2lkZSB0aGUgc2NoZWR1bGVkIHRhc2ssXG4gKiBhbm90aGVyIHRhc2sgaXMgc2NoZWR1bGVkIHdpdGggcXVldWUgc2NoZWR1bGVyLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpbW1lZGlhdGVseSBhcyB3ZWxsLFxuICogdGhhdCB0YXNrIHdpbGwgYmUgcHV0IG9uIGEgcXVldWUgYW5kIHdhaXQgZm9yIGN1cnJlbnQgb25lIHRvIGZpbmlzaC5cbiAqXG4gKiBUaGlzIG1lYW5zIHRoYXQgd2hlbiB5b3UgZXhlY3V0ZSB0YXNrIHdpdGggYHF1ZXVlYCBzY2hlZHVsZXIsIHlvdSBhcmUgc3VyZSBpdCB3aWxsIGVuZFxuICogYmVmb3JlIGFueSBvdGhlciB0YXNrIHNjaGVkdWxlZCB3aXRoIHRoYXQgc2NoZWR1bGVyIHdpbGwgc3RhcnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNjaGVkdWxlIHJlY3Vyc2l2ZWx5IGZpcnN0LCB0aGVuIGRvIHNvbWV0aGluZ1xuICogYGBgamF2YXNjcmlwdFxuICogUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IHtcbiAqICAgUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdzZWNvbmQnKSk7IC8vIHdpbGwgbm90IGhhcHBlbiBub3csIGJ1dCB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlXG4gKlxuICogICBjb25zb2xlLmxvZygnZmlyc3QnKTtcbiAqIH0pO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImZpcnN0XCJcbiAqIC8vIFwic2Vjb25kXCJcbiAqIGBgYFxuICpcbiAqIFJlc2NoZWR1bGUgaXRzZWxmIHJlY3Vyc2l2ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIucXVldWUuc2NoZWR1bGUoZnVuY3Rpb24oc3RhdGUpIHtcbiAqICAgaWYgKHN0YXRlICE9PSAwKSB7XG4gKiAgICAgY29uc29sZS5sb2coJ2JlZm9yZScsIHN0YXRlKTtcbiAqICAgICB0aGlzLnNjaGVkdWxlKHN0YXRlIC0gMSk7IC8vIGB0aGlzYCByZWZlcmVuY2VzIGN1cnJlbnRseSBleGVjdXRpbmcgQWN0aW9uLFxuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gd2hpY2ggd2UgcmVzY2hlZHVsZSB3aXRoIG5ldyBzdGF0ZVxuICogICAgIGNvbnNvbGUubG9nKCdhZnRlcicsIHN0YXRlKTtcbiAqICAgfVxuICogfSwgMCwgMyk7XG4gKlxuICogLy8gSW4gc2NoZWR1bGVyIHRoYXQgcnVucyByZWN1cnNpdmVseSwgeW91IHdvdWxkIGV4cGVjdDpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYmVmb3JlXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDNcbiAqXG4gKiAvLyBCdXQgd2l0aCBxdWV1ZSBpdCBsb2dzOlxuICogLy8gXCJiZWZvcmVcIiwgM1xuICogLy8gXCJhZnRlclwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImFmdGVyXCIsIDJcbiAqIC8vIFwiYmVmb3JlXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMVxuICogYGBgXG4gKlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBxdWV1ZVxuICogQG93bmVyIFNjaGVkdWxlclxuICovXG5cbmV4cG9ydCBjb25zdCBxdWV1ZSA9IG5ldyBRdWV1ZVNjaGVkdWxlcihRdWV1ZUFjdGlvbik7XG4iXX0=