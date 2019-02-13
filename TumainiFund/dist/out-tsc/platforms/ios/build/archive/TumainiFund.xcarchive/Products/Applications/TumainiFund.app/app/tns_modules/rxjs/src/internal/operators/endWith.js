"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fromArray_1 = require("../observable/fromArray");
var scalar_1 = require("../observable/scalar");
var empty_1 = require("../observable/empty");
var concat_1 = require("../observable/concat");
var isScheduler_1 = require("../util/isScheduler");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments after it finishes emitting
 * items emitted by the source Observable.
 *
 * ![](endWith.png)
 *
 * ## Example
 * ### After the source observable completes, appends an emission and then completes too.
 *
 * ```javascript
 * of('hi', 'how are you?', 'sorry, I have to go now').pipe(
 *   endWith('goodbye!'),
 * )
 * .subscribe(word => console.log(word));
 * // result:
 * // 'hi'
 * // 'how are you?'
 * // 'sorry, I have to go now'
 * // 'goodbye!'
 * ```
 *
 * @param {...T} values - Items you want the modified Observable to emit last.
 * @param {SchedulerLike} [scheduler] - A {@link SchedulerLike} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items emitted by the source Observable
 *  and then emits the items in the specified Iterable.
 * @method endWith
 * @owner Observable
 */
function endWith() {
    var array = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        array[_i] = arguments[_i];
    }
    return function (source) {
        var scheduler = array[array.length - 1];
        if (isScheduler_1.isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        var len = array.length;
        if (len === 1 && !scheduler) {
            return concat_1.concat(source, scalar_1.scalar(array[0]));
        }
        else if (len > 0) {
            return concat_1.concat(source, fromArray_1.fromArray(array, scheduler));
        }
        else {
            return concat_1.concat(source, empty_1.empty(scheduler));
        }
    };
}
exports.endWith = endWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kV2l0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2VuZFdpdGgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxxREFBb0Q7QUFDcEQsK0NBQThDO0FBQzlDLDZDQUE0QztBQUM1QywrQ0FBOEQ7QUFDOUQsbURBQWtEO0FBWWxELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILFNBQWdCLE9BQU87SUFBSSxlQUFrQztTQUFsQyxVQUFrQyxFQUFsQyxxQkFBa0MsRUFBbEMsSUFBa0M7UUFBbEMsMEJBQWtDOztJQUMzRCxPQUFPLFVBQUMsTUFBcUI7UUFDM0IsSUFBSSxTQUFTLEdBQWtCLEtBQUssQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUkseUJBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDYjthQUFNO1lBQ0wsU0FBUyxHQUFHLElBQUksQ0FBQztTQUNsQjtRQUVELElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDekIsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNCLE9BQU8sZUFBWSxDQUFDLE1BQU0sRUFBRSxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxDQUFDLENBQUMsQ0FBQztTQUNwRDthQUFNLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNsQixPQUFPLGVBQVksQ0FBQyxNQUFNLEVBQUUscUJBQVMsQ0FBQyxLQUFZLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztTQUNqRTthQUFNO1lBQ0wsT0FBTyxlQUFZLENBQUksTUFBTSxFQUFFLGFBQUssQ0FBQyxTQUFTLENBQVEsQ0FBQyxDQUFDO1NBQ3pEO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWxCRCwwQkFrQkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBzY2FsYXIgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3NjYWxhcic7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4uL29ic2VydmFibGUvZW1wdHknO1xuaW1wb3J0IHsgY29uY2F0IGFzIGNvbmNhdFN0YXRpYyB9IGZyb20gJy4uL29ic2VydmFibGUvY29uY2F0JztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4oc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4odjE6IFQsIHYyOiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4odjE6IFQsIHYyOiBULCB2MzogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCB2MjogVCwgdjM6IFQsIHY0OiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4odjE6IFQsIHYyOiBULCB2MzogVCwgdjQ6IFQsIHY1OiBULCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4odjE6IFQsIHYyOiBULCB2MzogVCwgdjQ6IFQsIHY1OiBULCB2NjogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KC4uLmFycmF5OiBBcnJheTxUIHwgU2NoZWR1bGVyTGlrZT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtcyB5b3Ugc3BlY2lmeSBhcyBhcmd1bWVudHMgYWZ0ZXIgaXQgZmluaXNoZXMgZW1pdHRpbmdcbiAqIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqICFbXShlbmRXaXRoLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgQWZ0ZXIgdGhlIHNvdXJjZSBvYnNlcnZhYmxlIGNvbXBsZXRlcywgYXBwZW5kcyBhbiBlbWlzc2lvbiBhbmQgdGhlbiBjb21wbGV0ZXMgdG9vLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKCdoaScsICdob3cgYXJlIHlvdT8nLCAnc29ycnksIEkgaGF2ZSB0byBnbyBub3cnKS5waXBlKFxuICogICBlbmRXaXRoKCdnb29kYnllIScpLFxuICogKVxuICogLnN1YnNjcmliZSh3b3JkID0+IGNvbnNvbGUubG9nKHdvcmQpKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICdoaSdcbiAqIC8vICdob3cgYXJlIHlvdT8nXG4gKiAvLyAnc29ycnksIEkgaGF2ZSB0byBnbyBub3cnXG4gKiAvLyAnZ29vZGJ5ZSEnXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gey4uLlR9IHZhbHVlcyAtIEl0ZW1zIHlvdSB3YW50IHRoZSBtb2RpZmllZCBPYnNlcnZhYmxlIHRvIGVtaXQgbGFzdC5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gLSBBIHtAbGluayBTY2hlZHVsZXJMaWtlfSB0byB1c2UgZm9yIHNjaGVkdWxpbmdcbiAqIHRoZSBlbWlzc2lvbnMgb2YgdGhlIGBuZXh0YCBub3RpZmljYXRpb25zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogIGFuZCB0aGVuIGVtaXRzIHRoZSBpdGVtcyBpbiB0aGUgc3BlY2lmaWVkIEl0ZXJhYmxlLlxuICogQG1ldGhvZCBlbmRXaXRoXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZW5kV2l0aDxUPiguLi5hcnJheTogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBsZXQgc2NoZWR1bGVyID0gPFNjaGVkdWxlckxpa2U+YXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgaWYgKGlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICAgIGFycmF5LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAxICYmICFzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBjb25jYXRTdGF0aWMoc291cmNlLCBzY2FsYXIoYXJyYXlbMF0gYXMgVCkpO1xuICAgIH0gZWxzZSBpZiAobGVuID4gMCkge1xuICAgICAgcmV0dXJuIGNvbmNhdFN0YXRpYyhzb3VyY2UsIGZyb21BcnJheShhcnJheSBhcyBUW10sIHNjaGVkdWxlcikpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29uY2F0U3RhdGljPFQ+KHNvdXJjZSwgZW1wdHkoc2NoZWR1bGVyKSBhcyBhbnkpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==