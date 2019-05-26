import { AsapAction } from './AsapAction';
import { AsapScheduler } from './AsapScheduler';
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
 * import { asapScheduler, asyncScheduler } from 'rxjs';
 *
 * asyncScheduler.schedule(() => console.log('async')); // scheduling 'async' first...
 * asapScheduler.schedule(() => console.log('asap'));
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
export const asap = new AsapScheduler(AsapAction);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXNhcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3NjaGVkdWxlci9hc2FwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDMUMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRWhEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ0c7QUFFSCxNQUFNLENBQUMsTUFBTSxJQUFJLEdBQUcsSUFBSSxhQUFhLENBQUMsVUFBVSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBc2FwQWN0aW9uIH0gZnJvbSAnLi9Bc2FwQWN0aW9uJztcbmltcG9ydCB7IEFzYXBTY2hlZHVsZXIgfSBmcm9tICcuL0FzYXBTY2hlZHVsZXInO1xuXG4vKipcbiAqXG4gKiBBc2FwIFNjaGVkdWxlclxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QZXJmb3JtIHRhc2sgYXMgZmFzdCBhcyBpdCBjYW4gYmUgcGVyZm9ybWVkIGFzeW5jaHJvbm91c2x5PC9zcGFuPlxuICpcbiAqIGBhc2FwYCBzY2hlZHVsZXIgYmVoYXZlcyB0aGUgc2FtZSBhcyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IHNjaGVkdWxlciB3aGVuIHlvdSB1c2UgaXQgdG8gZGVsYXkgdGFza1xuICogaW4gdGltZS4gSWYgaG93ZXZlciB5b3Ugc2V0IGRlbGF5IHRvIGAwYCwgYGFzYXBgIHdpbGwgd2FpdCBmb3IgY3VycmVudCBzeW5jaHJvbm91c2x5IGV4ZWN1dGluZ1xuICogY29kZSB0byBlbmQgYW5kIHRoZW4gaXQgd2lsbCB0cnkgdG8gZXhlY3V0ZSBnaXZlbiB0YXNrIGFzIGZhc3QgYXMgcG9zc2libGUuXG4gKlxuICogYGFzYXBgIHNjaGVkdWxlciB3aWxsIGRvIGl0cyBiZXN0IHRvIG1pbmltaXplIHRpbWUgYmV0d2VlbiBlbmQgb2YgY3VycmVudGx5IGV4ZWN1dGluZyBjb2RlXG4gKiBhbmQgc3RhcnQgb2Ygc2NoZWR1bGVkIHRhc2suIFRoaXMgbWFrZXMgaXQgYmVzdCBjYW5kaWRhdGUgZm9yIHBlcmZvcm1pbmcgc28gY2FsbGVkIFwiZGVmZXJyaW5nXCIuXG4gKiBUcmFkaXRpb25hbGx5IHRoaXMgd2FzIGFjaGlldmVkIGJ5IGNhbGxpbmcgYHNldFRpbWVvdXQoZGVmZXJyZWRUYXNrLCAwKWAsIGJ1dCB0aGF0IHRlY2huaXF1ZSBpbnZvbHZlc1xuICogc29tZSAoYWx0aG91Z2ggbWluaW1hbCkgdW53YW50ZWQgZGVsYXkuXG4gKlxuICogTm90ZSB0aGF0IHVzaW5nIGBhc2FwYCBzY2hlZHVsZXIgZG9lcyBub3QgbmVjZXNzYXJpbHkgbWVhbiB0aGF0IHlvdXIgdGFzayB3aWxsIGJlIGZpcnN0IHRvIHByb2Nlc3NcbiAqIGFmdGVyIGN1cnJlbnRseSBleGVjdXRpbmcgY29kZS4gSW4gcGFydGljdWxhciwgaWYgc29tZSB0YXNrIHdhcyBhbHNvIHNjaGVkdWxlZCB3aXRoIGBhc2FwYCBiZWZvcmUsXG4gKiB0aGF0IHRhc2sgd2lsbCBleGVjdXRlIGZpcnN0LiBUaGF0IGJlaW5nIHNhaWQsIGlmIHlvdSBuZWVkIHRvIHNjaGVkdWxlIHRhc2sgYXN5bmNocm9ub3VzbHksIGJ1dFxuICogYXMgc29vbiBhcyBwb3NzaWJsZSwgYGFzYXBgIHNjaGVkdWxlciBpcyB5b3VyIGJlc3QgYmV0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvbXBhcmUgYXN5bmMgYW5kIGFzYXAgc2NoZWR1bGVyPFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgYXNhcFNjaGVkdWxlciwgYXN5bmNTY2hlZHVsZXIgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBhc3luY1NjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnYXN5bmMnKSk7IC8vIHNjaGVkdWxpbmcgJ2FzeW5jJyBmaXJzdC4uLlxuICogYXNhcFNjaGVkdWxlci5zY2hlZHVsZSgoKSA9PiBjb25zb2xlLmxvZygnYXNhcCcpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJhc2FwXCJcbiAqIC8vIFwiYXN5bmNcIlxuICogLy8gLi4uIGJ1dCAnYXNhcCcgZ29lcyBmaXJzdCFcbiAqIGBgYFxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBhc2FwXG4gKiBAb3duZXIgU2NoZWR1bGVyXG4gKi9cblxuZXhwb3J0IGNvbnN0IGFzYXAgPSBuZXcgQXNhcFNjaGVkdWxlcihBc2FwQWN0aW9uKTtcbiJdfQ==