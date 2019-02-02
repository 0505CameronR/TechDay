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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVldWUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9zY2hlZHVsZXIvcXVldWUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2Q0FBNEM7QUFDNUMsbURBQWtEO0FBRWxEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkRHO0FBRVUsUUFBQSxLQUFLLEdBQUcsSUFBSSwrQkFBYyxDQUFDLHlCQUFXLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFF1ZXVlQWN0aW9uIH0gZnJvbSAnLi9RdWV1ZUFjdGlvbic7XG5pbXBvcnQgeyBRdWV1ZVNjaGVkdWxlciB9IGZyb20gJy4vUXVldWVTY2hlZHVsZXInO1xuXG4vKipcbiAqXG4gKiBRdWV1ZSBTY2hlZHVsZXJcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+UHV0IGV2ZXJ5IG5leHQgdGFzayBvbiBhIHF1ZXVlLCBpbnN0ZWFkIG9mIGV4ZWN1dGluZyBpdCBpbW1lZGlhdGVseTwvc3Bhbj5cbiAqXG4gKiBgcXVldWVgIHNjaGVkdWxlciwgd2hlbiB1c2VkIHdpdGggZGVsYXksIGJlaGF2ZXMgdGhlIHNhbWUgYXMge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBzY2hlZHVsZXIuXG4gKlxuICogV2hlbiB1c2VkIHdpdGhvdXQgZGVsYXksIGl0IHNjaGVkdWxlcyBnaXZlbiB0YXNrIHN5bmNocm9ub3VzbHkgLSBleGVjdXRlcyBpdCByaWdodCB3aGVuXG4gKiBpdCBpcyBzY2hlZHVsZWQuIEhvd2V2ZXIgd2hlbiBjYWxsZWQgcmVjdXJzaXZlbHksIHRoYXQgaXMgd2hlbiBpbnNpZGUgdGhlIHNjaGVkdWxlZCB0YXNrLFxuICogYW5vdGhlciB0YXNrIGlzIHNjaGVkdWxlZCB3aXRoIHF1ZXVlIHNjaGVkdWxlciwgaW5zdGVhZCBvZiBleGVjdXRpbmcgaW1tZWRpYXRlbHkgYXMgd2VsbCxcbiAqIHRoYXQgdGFzayB3aWxsIGJlIHB1dCBvbiBhIHF1ZXVlIGFuZCB3YWl0IGZvciBjdXJyZW50IG9uZSB0byBmaW5pc2guXG4gKlxuICogVGhpcyBtZWFucyB0aGF0IHdoZW4geW91IGV4ZWN1dGUgdGFzayB3aXRoIGBxdWV1ZWAgc2NoZWR1bGVyLCB5b3UgYXJlIHN1cmUgaXQgd2lsbCBlbmRcbiAqIGJlZm9yZSBhbnkgb3RoZXIgdGFzayBzY2hlZHVsZWQgd2l0aCB0aGF0IHNjaGVkdWxlciB3aWxsIHN0YXJ0LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBTY2hlZHVsZSByZWN1cnNpdmVseSBmaXJzdCwgdGhlbiBkbyBzb21ldGhpbmdcbiAqIGBgYGphdmFzY3JpcHRcbiAqIFJ4LlNjaGVkdWxlci5xdWV1ZS5zY2hlZHVsZSgoKSA9PiB7XG4gKiAgIFJ4LlNjaGVkdWxlci5xdWV1ZS5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnc2Vjb25kJykpOyAvLyB3aWxsIG5vdCBoYXBwZW4gbm93LCBidXQgd2lsbCBiZSBwdXQgb24gYSBxdWV1ZVxuICpcbiAqICAgY29uc29sZS5sb2coJ2ZpcnN0Jyk7XG4gKiB9KTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJmaXJzdFwiXG4gKiAvLyBcInNlY29uZFwiXG4gKiBgYGBcbiAqXG4gKiBSZXNjaGVkdWxlIGl0c2VsZiByZWN1cnNpdmVseVxuICogYGBgamF2YXNjcmlwdFxuICogUnguU2NoZWR1bGVyLnF1ZXVlLnNjaGVkdWxlKGZ1bmN0aW9uKHN0YXRlKSB7XG4gKiAgIGlmIChzdGF0ZSAhPT0gMCkge1xuICogICAgIGNvbnNvbGUubG9nKCdiZWZvcmUnLCBzdGF0ZSk7XG4gKiAgICAgdGhpcy5zY2hlZHVsZShzdGF0ZSAtIDEpOyAvLyBgdGhpc2AgcmVmZXJlbmNlcyBjdXJyZW50bHkgZXhlY3V0aW5nIEFjdGlvbixcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoaWNoIHdlIHJlc2NoZWR1bGUgd2l0aCBuZXcgc3RhdGVcbiAqICAgICBjb25zb2xlLmxvZygnYWZ0ZXInLCBzdGF0ZSk7XG4gKiAgIH1cbiAqIH0sIDAsIDMpO1xuICpcbiAqIC8vIEluIHNjaGVkdWxlciB0aGF0IHJ1bnMgcmVjdXJzaXZlbHksIHlvdSB3b3VsZCBleHBlY3Q6XG4gKiAvLyBcImJlZm9yZVwiLCAzXG4gKiAvLyBcImJlZm9yZVwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIC8vIFwiYWZ0ZXJcIiwgMlxuICogLy8gXCJhZnRlclwiLCAzXG4gKlxuICogLy8gQnV0IHdpdGggcXVldWUgaXQgbG9nczpcbiAqIC8vIFwiYmVmb3JlXCIsIDNcbiAqIC8vIFwiYWZ0ZXJcIiwgM1xuICogLy8gXCJiZWZvcmVcIiwgMlxuICogLy8gXCJhZnRlclwiLCAyXG4gKiAvLyBcImJlZm9yZVwiLCAxXG4gKiAvLyBcImFmdGVyXCIsIDFcbiAqIGBgYFxuICpcbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgcXVldWVcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgcXVldWUgPSBuZXcgUXVldWVTY2hlZHVsZXIoUXVldWVBY3Rpb24pO1xuIl19