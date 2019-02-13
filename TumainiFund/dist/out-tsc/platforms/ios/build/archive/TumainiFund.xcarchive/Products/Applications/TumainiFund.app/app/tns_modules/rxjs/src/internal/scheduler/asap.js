"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsapAction_1 = require("./AsapAction");
var AsapScheduler_1 = require("./AsapScheduler");
/**
 *
 * Asap Scheduler
 *
 * <span class="informal">Perform task as fast as it can be performed asynchronously</span>
 *
 * `asap` scheduler behaves the same as {@link asyncScheduler} scheduler when you use it to delay task
 * in time. If however you set delay to `0`, `asap` will wait for current synchronously executing
 * code to end and then it will try to execute given task as fast as possible.
 *
 * `asap` scheduler will do its best to minimize time between end of currently executing code
 * and start of scheduled task. This makes it best candidate for performing so called "deferring".
 * Traditionally this was achieved by calling `setTimeout(deferredTask, 0)`, but that technique involves
 * some (although minimal) unwanted delay.
 *
 * Note that using `asap` scheduler does not necessarily mean that your task will be first to process
 * after currently executing code. In particular, if some task was also scheduled with `asap` before,
 * that task will execute first. That being said, if you need to schedule task asynchronously, but
 * as soon as possible, `asap` scheduler is your best bet.
 *
 * ## Example
 * Compare async and asap scheduler<
 * ```javascript
 * Rx.Scheduler.async.schedule(() => console.log('async')); // scheduling 'async' first...
 * Rx.Scheduler.asap.schedule(() => console.log('asap'));
 *
 * // Logs:
 * // "asap"
 * // "async"
 * // ... but 'asap' goes first!
 * ```
 * @static true
 * @name asap
 * @owner Scheduler
 */
exports.asap = new AsapScheduler_1.AsapScheduler(AsapAction_1.AsapAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvc2NoZWR1bGVyL2FzYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwyQ0FBMEM7QUFDMUMsaURBQWdEO0FBRWhEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0NHO0FBRVUsUUFBQSxJQUFJLEdBQUcsSUFBSSw2QkFBYSxDQUFDLHVCQUFVLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFzYXBBY3Rpb24gfSBmcm9tICcuL0FzYXBBY3Rpb24nO1xuaW1wb3J0IHsgQXNhcFNjaGVkdWxlciB9IGZyb20gJy4vQXNhcFNjaGVkdWxlcic7XG5cbi8qKlxuICpcbiAqIEFzYXAgU2NoZWR1bGVyXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlBlcmZvcm0gdGFzayBhcyBmYXN0IGFzIGl0IGNhbiBiZSBwZXJmb3JtZWQgYXN5bmNocm9ub3VzbHk8L3NwYW4+XG4gKlxuICogYGFzYXBgIHNjaGVkdWxlciBiZWhhdmVzIHRoZSBzYW1lIGFzIHtAbGluayBhc3luY1NjaGVkdWxlcn0gc2NoZWR1bGVyIHdoZW4geW91IHVzZSBpdCB0byBkZWxheSB0YXNrXG4gKiBpbiB0aW1lLiBJZiBob3dldmVyIHlvdSBzZXQgZGVsYXkgdG8gYDBgLCBgYXNhcGAgd2lsbCB3YWl0IGZvciBjdXJyZW50IHN5bmNocm9ub3VzbHkgZXhlY3V0aW5nXG4gKiBjb2RlIHRvIGVuZCBhbmQgdGhlbiBpdCB3aWxsIHRyeSB0byBleGVjdXRlIGdpdmVuIHRhc2sgYXMgZmFzdCBhcyBwb3NzaWJsZS5cbiAqXG4gKiBgYXNhcGAgc2NoZWR1bGVyIHdpbGwgZG8gaXRzIGJlc3QgdG8gbWluaW1pemUgdGltZSBiZXR3ZWVuIGVuZCBvZiBjdXJyZW50bHkgZXhlY3V0aW5nIGNvZGVcbiAqIGFuZCBzdGFydCBvZiBzY2hlZHVsZWQgdGFzay4gVGhpcyBtYWtlcyBpdCBiZXN0IGNhbmRpZGF0ZSBmb3IgcGVyZm9ybWluZyBzbyBjYWxsZWQgXCJkZWZlcnJpbmdcIi5cbiAqIFRyYWRpdGlvbmFsbHkgdGhpcyB3YXMgYWNoaWV2ZWQgYnkgY2FsbGluZyBgc2V0VGltZW91dChkZWZlcnJlZFRhc2ssIDApYCwgYnV0IHRoYXQgdGVjaG5pcXVlIGludm9sdmVzXG4gKiBzb21lIChhbHRob3VnaCBtaW5pbWFsKSB1bndhbnRlZCBkZWxheS5cbiAqXG4gKiBOb3RlIHRoYXQgdXNpbmcgYGFzYXBgIHNjaGVkdWxlciBkb2VzIG5vdCBuZWNlc3NhcmlseSBtZWFuIHRoYXQgeW91ciB0YXNrIHdpbGwgYmUgZmlyc3QgdG8gcHJvY2Vzc1xuICogYWZ0ZXIgY3VycmVudGx5IGV4ZWN1dGluZyBjb2RlLiBJbiBwYXJ0aWN1bGFyLCBpZiBzb21lIHRhc2sgd2FzIGFsc28gc2NoZWR1bGVkIHdpdGggYGFzYXBgIGJlZm9yZSxcbiAqIHRoYXQgdGFzayB3aWxsIGV4ZWN1dGUgZmlyc3QuIFRoYXQgYmVpbmcgc2FpZCwgaWYgeW91IG5lZWQgdG8gc2NoZWR1bGUgdGFzayBhc3luY2hyb25vdXNseSwgYnV0XG4gKiBhcyBzb29uIGFzIHBvc3NpYmxlLCBgYXNhcGAgc2NoZWR1bGVyIGlzIHlvdXIgYmVzdCBiZXQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29tcGFyZSBhc3luYyBhbmQgYXNhcCBzY2hlZHVsZXI8XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBSeC5TY2hlZHVsZXIuYXN5bmMuc2NoZWR1bGUoKCkgPT4gY29uc29sZS5sb2coJ2FzeW5jJykpOyAvLyBzY2hlZHVsaW5nICdhc3luYycgZmlyc3QuLi5cbiAqIFJ4LlNjaGVkdWxlci5hc2FwLnNjaGVkdWxlKCgpID0+IGNvbnNvbGUubG9nKCdhc2FwJykpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcImFzYXBcIlxuICogLy8gXCJhc3luY1wiXG4gKiAvLyAuLi4gYnV0ICdhc2FwJyBnb2VzIGZpcnN0IVxuICogYGBgXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGFzYXBcbiAqIEBvd25lciBTY2hlZHVsZXJcbiAqL1xuXG5leHBvcnQgY29uc3QgYXNhcCA9IG5ldyBBc2FwU2NoZWR1bGVyKEFzYXBBY3Rpb24pO1xuIl19