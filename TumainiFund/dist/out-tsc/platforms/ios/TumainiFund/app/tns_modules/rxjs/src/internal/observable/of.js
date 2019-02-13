import { isScheduler } from '../util/isScheduler';
import { fromArray } from './fromArray';
import { empty } from './empty';
import { scalar } from './scalar';
/* tslint:enable:max-line-length */
/**
 * Converts the arguments to an observable sequence.
 *
 * <span class="informal">Each argument becomes a `next` notification.</span>
 *
 * ![](of.png)
 *
 * Unlike {@link from}, it does not do any flattening and emits each argument in whole
 * as a separate `next` notification.
 *
 * ## Examples
 *
 * Emit the values `10, 20, 30`
 *
 * ```javascript
 * of(10, 20, 30)
 * .subscribe(
 *   next => console.log('next:', next),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'next: 10'
 * // 'next: 20'
 * // 'next: 30'
 *
 * ```
 *
 * Emit the array `[1,2,3]`
 *
 * ```javascript
 * of([1,2,3])
 * .subscribe(
 *   next => console.log('next:', next),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'next: [1,2,3]'
 * ```
 *
 * @see {@link from}
 * @see {@link range}
 *
 * @param {...T} values A comma separated list of arguments you want to be emitted
 * @return {Observable} An Observable that emits the arguments
 * described above and then completes.
 * @method of
 * @owner Observable
 */
export function of(...args) {
    let scheduler = args[args.length - 1];
    if (isScheduler(scheduler)) {
        args.pop();
    }
    else {
        scheduler = undefined;
    }
    switch (args.length) {
        case 0:
            return empty(scheduler);
        case 1:
            return scheduler ? fromArray(args, scheduler) : scalar(args[0]);
        default:
            return fromArray(args, scheduler);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL29mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQWlCbEMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaURHO0FBRUgsTUFBTSxVQUFVLEVBQUUsQ0FBSSxHQUFHLElBQThCO0lBQ3JELElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBa0IsQ0FBQztJQUN2RCxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDWjtTQUFNO1FBQ0wsU0FBUyxHQUFHLFNBQVMsQ0FBQztLQUN2QjtJQUNELFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNuQixLQUFLLENBQUM7WUFDSixPQUFPLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQixLQUFLLENBQUM7WUFDSixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQU0sQ0FBQyxDQUFDO1FBQzlFO1lBQ0UsT0FBTyxTQUFTLENBQUMsSUFBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0tBQzVDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IHNjYWxhciB9IGZyb20gJy4vc2NhbGFyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oYTogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDI+KGE6IFQsIGI6IFQyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMz4oYTogVCwgYjogVDIsIGM6IFQzLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUND4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUND47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDU+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDU+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNj47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNz4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNz47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VCwgVDIsIFQzLCBUNCwgVDUsIFQ2LCBUNywgVDg+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIGg6IFQ4LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDg+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDcsIFQ4LCBUOT4oYTogVCwgYjogVDIsIGM6IFQzLCBkOiBUNCwgZTogVDUsIGY6IFQ2LCBnOiBUNywgaDogVDgsIGk6IFQ5LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTpcbiAgT2JzZXJ2YWJsZTxUIHwgVDIgfCBUMyB8IFQ0IHwgVDUgfCBUNiB8IFQ3IHwgVDggfCBUOT47XG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29udmVydHMgdGhlIGFyZ3VtZW50cyB0byBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FYWNoIGFyZ3VtZW50IGJlY29tZXMgYSBgbmV4dGAgbm90aWZpY2F0aW9uLjwvc3Bhbj5cbiAqXG4gKiAhW10ob2YucG5nKVxuICpcbiAqIFVubGlrZSB7QGxpbmsgZnJvbX0sIGl0IGRvZXMgbm90IGRvIGFueSBmbGF0dGVuaW5nIGFuZCBlbWl0cyBlYWNoIGFyZ3VtZW50IGluIHdob2xlXG4gKiBhcyBhIHNlcGFyYXRlIGBuZXh0YCBub3RpZmljYXRpb24uXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBFbWl0IHRoZSB2YWx1ZXMgYDEwLCAyMCwgMzBgXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoMTAsIDIwLCAzMClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogMTAnXG4gKiAvLyAnbmV4dDogMjAnXG4gKiAvLyAnbmV4dDogMzAnXG4gKlxuICogYGBgXG4gKlxuICogRW1pdCB0aGUgYXJyYXkgYFsxLDIsM11gXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoWzEsMiwzXSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogWzEsMiwzXSdcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayByYW5nZX1cbiAqXG4gKiBAcGFyYW0gey4uLlR9IHZhbHVlcyBBIGNvbW1hIHNlcGFyYXRlZCBsaXN0IG9mIGFyZ3VtZW50cyB5b3Ugd2FudCB0byBiZSBlbWl0dGVkXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGFyZ3VtZW50c1xuICogZGVzY3JpYmVkIGFib3ZlIGFuZCB0aGVuIGNvbXBsZXRlcy5cbiAqIEBtZXRob2Qgb2ZcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KC4uLmFyZ3M6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VD4ge1xuICBsZXQgc2NoZWR1bGVyID0gYXJnc1thcmdzLmxlbmd0aCAtIDFdIGFzIFNjaGVkdWxlckxpa2U7XG4gIGlmIChpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgYXJncy5wb3AoKTtcbiAgfSBlbHNlIHtcbiAgICBzY2hlZHVsZXIgPSB1bmRlZmluZWQ7XG4gIH1cbiAgc3dpdGNoIChhcmdzLmxlbmd0aCkge1xuICAgIGNhc2UgMDpcbiAgICAgIHJldHVybiBlbXB0eShzY2hlZHVsZXIpO1xuICAgIGNhc2UgMTpcbiAgICAgIHJldHVybiBzY2hlZHVsZXIgPyBmcm9tQXJyYXkoYXJncyBhcyBUW10sIHNjaGVkdWxlcikgOiBzY2FsYXIoYXJnc1swXSBhcyBUKTtcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKTtcbiAgfVxufVxuIl19