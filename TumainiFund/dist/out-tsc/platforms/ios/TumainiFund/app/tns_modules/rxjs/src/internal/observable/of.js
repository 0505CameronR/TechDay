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
 * import { of } from 'rxjs';
 *
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
 * import { of } from 'rxjs';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL29mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDaEMsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFVBQVUsQ0FBQztBQWlCbEMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFERztBQUVILE1BQU0sVUFBVSxFQUFFLENBQUksR0FBRyxJQUE4QjtJQUNyRCxJQUFJLFNBQVMsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQWtCLENBQUM7SUFDdkQsSUFBSSxXQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7UUFDMUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0tBQ1o7U0FBTTtRQUNMLFNBQVMsR0FBRyxTQUFTLENBQUM7S0FDdkI7SUFDRCxRQUFRLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDbkIsS0FBSyxDQUFDO1lBQ0osT0FBTyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDMUIsS0FBSyxDQUFDO1lBQ0osT0FBTyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLENBQUMsQ0FBQztRQUM5RTtZQUNFLE9BQU8sU0FBUyxDQUFDLElBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztLQUM1QztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBzY2FsYXIgfSBmcm9tICcuL3NjYWxhcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KGE6IFQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyPihhOiBULCBiOiBUMiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDM+KGE6IFQsIGI6IFQyLCBjOiBUMywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDM+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQ+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDY+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDc+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDc+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDcsIFQ4PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBoOiBUOCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNyB8IFQ4PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3LCBUOCwgVDk+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIGg6IFQ4LCBpOiBUOSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNyB8IFQ4IHwgVDk+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KC4uLmFyZ3M6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBhcmd1bWVudHMgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RWFjaCBhcmd1bWVudCBiZWNvbWVzIGEgYG5leHRgIG5vdGlmaWNhdGlvbi48L3NwYW4+XG4gKlxuICogIVtdKG9mLnBuZylcbiAqXG4gKiBVbmxpa2Uge0BsaW5rIGZyb219LCBpdCBkb2VzIG5vdCBkbyBhbnkgZmxhdHRlbmluZyBhbmQgZW1pdHMgZWFjaCBhcmd1bWVudCBpbiB3aG9sZVxuICogYXMgYSBzZXBhcmF0ZSBgbmV4dGAgbm90aWZpY2F0aW9uLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogRW1pdCB0aGUgdmFsdWVzIGAxMCwgMjAsIDMwYFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogb2YoMTAsIDIwLCAzMClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIG5leHQgPT4gY29uc29sZS5sb2coJ25leHQ6JywgbmV4dCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnbmV4dDogMTAnXG4gKiAvLyAnbmV4dDogMjAnXG4gKiAvLyAnbmV4dDogMzAnXG4gKlxuICogYGBgXG4gKlxuICogRW1pdCB0aGUgYXJyYXkgYFsxLDIsM11gXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBvZihbMSwyLDNdKVxuICogLnN1YnNjcmliZShcbiAqICAgbmV4dCA9PiBjb25zb2xlLmxvZygnbmV4dDonLCBuZXh0KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICduZXh0OiBbMSwyLDNdJ1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIHJhbmdlfVxuICpcbiAqIEBwYXJhbSB7Li4uVH0gdmFsdWVzIEEgY29tbWEgc2VwYXJhdGVkIGxpc3Qgb2YgYXJndW1lbnRzIHlvdSB3YW50IHRvIGJlIGVtaXR0ZWRcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgYXJndW1lbnRzXG4gKiBkZXNjcmliZWQgYWJvdmUgYW5kIHRoZW4gY29tcGxldGVzLlxuICogQG1ldGhvZCBvZlxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gb2Y8VD4oLi4uYXJnczogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogT2JzZXJ2YWJsZTxUPiB7XG4gIGxldCBzY2hlZHVsZXIgPSBhcmdzW2FyZ3MubGVuZ3RoIC0gMV0gYXMgU2NoZWR1bGVyTGlrZTtcbiAgaWYgKGlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICBhcmdzLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIHNjaGVkdWxlciA9IHVuZGVmaW5lZDtcbiAgfVxuICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgY2FzZSAwOlxuICAgICAgcmV0dXJuIGVtcHR5KHNjaGVkdWxlcik7XG4gICAgY2FzZSAxOlxuICAgICAgcmV0dXJuIHNjaGVkdWxlciA/IGZyb21BcnJheShhcmdzIGFzIFRbXSwgc2NoZWR1bGVyKSA6IHNjYWxhcihhcmdzWzBdIGFzIFQpO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZnJvbUFycmF5KGFyZ3MgYXMgVFtdLCBzY2hlZHVsZXIpO1xuICB9XG59XG4iXX0=