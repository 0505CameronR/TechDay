"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var isScheduler_1 = require("../util/isScheduler");
var fromArray_1 = require("./fromArray");
var empty_1 = require("./empty");
var scalar_1 = require("./scalar");
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
function of() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var scheduler = args[args.length - 1];
    if (isScheduler_1.isScheduler(scheduler)) {
        args.pop();
    }
    else {
        scheduler = undefined;
    }
    switch (args.length) {
        case 0:
            return empty_1.empty(scheduler);
        case 1:
            return scheduler ? fromArray_1.fromArray(args, scheduler) : scalar_1.scalar(args[0]);
        default:
            return fromArray_1.fromArray(args, scheduler);
    }
}
exports.of = of;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib2YuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL29mLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbURBQWtEO0FBQ2xELHlDQUF3QztBQUN4QyxpQ0FBZ0M7QUFDaEMsbUNBQWtDO0FBaUJsQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpREc7QUFFSCxTQUFnQixFQUFFO0lBQUksY0FBaUM7U0FBakMsVUFBaUMsRUFBakMscUJBQWlDLEVBQWpDLElBQWlDO1FBQWpDLHlCQUFpQzs7SUFDckQsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFrQixDQUFDO0lBQ3ZELElBQUkseUJBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtRQUMxQixJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDWjtTQUFNO1FBQ0wsU0FBUyxHQUFHLFNBQVMsQ0FBQztLQUN2QjtJQUNELFFBQVEsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNuQixLQUFLLENBQUM7WUFDSixPQUFPLGFBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUMxQixLQUFLLENBQUM7WUFDSixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMscUJBQVMsQ0FBQyxJQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLGVBQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFNLENBQUMsQ0FBQztRQUM5RTtZQUNFLE9BQU8scUJBQVMsQ0FBQyxJQUFXLEVBQUUsU0FBUyxDQUFDLENBQUM7S0FDNUM7QUFDSCxDQUFDO0FBZkQsZ0JBZUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4vZnJvbUFycmF5JztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBzY2FsYXIgfSBmcm9tICcuL3NjYWxhcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KGE6IFQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyPihhOiBULCBiOiBUMiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyPjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDM+KGE6IFQsIGI6IFQyLCBjOiBUMywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDM+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQ+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQ+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDY+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDc+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOlxuICBPYnNlcnZhYmxlPFQgfCBUMiB8IFQzIHwgVDQgfCBUNSB8IFQ2IHwgVDc+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQsIFQyLCBUMywgVDQsIFQ1LCBUNiwgVDcsIFQ4PihhOiBULCBiOiBUMiwgYzogVDMsIGQ6IFQ0LCBlOiBUNSwgZjogVDYsIGc6IFQ3LCBoOiBUOCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNyB8IFQ4PjtcbmV4cG9ydCBmdW5jdGlvbiBvZjxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFQ3LCBUOCwgVDk+KGE6IFQsIGI6IFQyLCBjOiBUMywgZDogVDQsIGU6IFQ1LCBmOiBUNiwgZzogVDcsIGg6IFQ4LCBpOiBUOSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6XG4gIE9ic2VydmFibGU8VCB8IFQyIHwgVDMgfCBUNCB8IFQ1IHwgVDYgfCBUNyB8IFQ4IHwgVDk+O1xuZXhwb3J0IGZ1bmN0aW9uIG9mPFQ+KC4uLmFyZ3M6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENvbnZlcnRzIHRoZSBhcmd1bWVudHMgdG8gYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RWFjaCBhcmd1bWVudCBiZWNvbWVzIGEgYG5leHRgIG5vdGlmaWNhdGlvbi48L3NwYW4+XG4gKlxuICogIVtdKG9mLnBuZylcbiAqXG4gKiBVbmxpa2Uge0BsaW5rIGZyb219LCBpdCBkb2VzIG5vdCBkbyBhbnkgZmxhdHRlbmluZyBhbmQgZW1pdHMgZWFjaCBhcmd1bWVudCBpbiB3aG9sZVxuICogYXMgYSBzZXBhcmF0ZSBgbmV4dGAgbm90aWZpY2F0aW9uLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogRW1pdCB0aGUgdmFsdWVzIGAxMCwgMjAsIDMwYFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEwLCAyMCwgMzApXG4gKiAuc3Vic2NyaWJlKFxuICogICBuZXh0ID0+IGNvbnNvbGUubG9nKCduZXh0OicsIG5leHQpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coJ2Vycm9yOicsIGVyciksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd0aGUgZW5kJyksXG4gKiApO1xuICogLy8gcmVzdWx0OlxuICogLy8gJ25leHQ6IDEwJ1xuICogLy8gJ25leHQ6IDIwJ1xuICogLy8gJ25leHQ6IDMwJ1xuICpcbiAqIGBgYFxuICpcbiAqIEVtaXQgdGhlIGFycmF5IGBbMSwyLDNdYFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKFsxLDIsM10pXG4gKiAuc3Vic2NyaWJlKFxuICogICBuZXh0ID0+IGNvbnNvbGUubG9nKCduZXh0OicsIG5leHQpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coJ2Vycm9yOicsIGVyciksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd0aGUgZW5kJyksXG4gKiApO1xuICogLy8gcmVzdWx0OlxuICogLy8gJ25leHQ6IFsxLDIsM10nXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgcmFuZ2V9XG4gKlxuICogQHBhcmFtIHsuLi5UfSB2YWx1ZXMgQSBjb21tYSBzZXBhcmF0ZWQgbGlzdCBvZiBhcmd1bWVudHMgeW91IHdhbnQgdG8gYmUgZW1pdHRlZFxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBhcmd1bWVudHNcbiAqIGRlc2NyaWJlZCBhYm92ZSBhbmQgdGhlbiBjb21wbGV0ZXMuXG4gKiBAbWV0aG9kIG9mXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBvZjxUPiguLi5hcmdzOiBBcnJheTxUIHwgU2NoZWR1bGVyTGlrZT4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgbGV0IHNjaGVkdWxlciA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXSBhcyBTY2hlZHVsZXJMaWtlO1xuICBpZiAoaXNTY2hlZHVsZXIoc2NoZWR1bGVyKSkge1xuICAgIGFyZ3MucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgc2NoZWR1bGVyID0gdW5kZWZpbmVkO1xuICB9XG4gIHN3aXRjaCAoYXJncy5sZW5ndGgpIHtcbiAgICBjYXNlIDA6XG4gICAgICByZXR1cm4gZW1wdHkoc2NoZWR1bGVyKTtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gc2NoZWR1bGVyID8gZnJvbUFycmF5KGFyZ3MgYXMgVFtdLCBzY2hlZHVsZXIpIDogc2NhbGFyKGFyZ3NbMF0gYXMgVCk7XG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmcm9tQXJyYXkoYXJncyBhcyBUW10sIHNjaGVkdWxlcik7XG4gIH1cbn1cbiJdfQ==