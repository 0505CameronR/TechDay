"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fromArray_1 = require("../observable/fromArray");
var scalar_1 = require("../observable/scalar");
var empty_1 = require("../observable/empty");
var concat_1 = require("../observable/concat");
var isScheduler_1 = require("../util/isScheduler");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments before it begins to emit
 * items emitted by the source Observable.
 *
 * <span class="informal">First emits its arguments in order, and then any
 * emissions from the source.</span>
 *
 * ![](startWith.png)
 *
 * ## Examples
 *
 * Start the chain of emissions with `"first"`, `"second"`
 *
 * ```javascript
 *   of("from source")
 *    .pipe(startWith("first", "second"))
 *    .subscribe(x => console.log(x));
 *
 * // results:
 * //   "first"
 * //   "second"
 * //   "from source"
 * ```
 *
 * @param {...T} values - Items you want the modified Observable to emit first.
 * @param {SchedulerLike} [scheduler] - A {@link SchedulerLike} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items in the specified Iterable and then emits the items
 * emitted by the source Observable.
 * @method startWith
 * @owner Observable
 */
function startWith() {
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
            return concat_1.concat(scalar_1.scalar(array[0]), source);
        }
        else if (len > 0) {
            return concat_1.concat(fromArray_1.fromArray(array, scheduler), source);
        }
        else {
            return concat_1.concat(empty_1.empty(scheduler), source);
        }
    };
}
exports.startWith = startWith;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRXaXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc3RhcnRXaXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EscURBQW9EO0FBQ3BELCtDQUE4QztBQUM5Qyw2Q0FBNEM7QUFDNUMsK0NBQThEO0FBQzlELG1EQUFrRDtBQVlsRCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQkc7QUFDSCxTQUFnQixTQUFTO0lBQU8sZUFBa0M7U0FBbEMsVUFBa0MsRUFBbEMscUJBQWtDLEVBQWxDLElBQWtDO1FBQWxDLDBCQUFrQzs7SUFDaEUsT0FBTyxVQUFDLE1BQXFCO1FBQzNCLElBQUksU0FBUyxHQUFrQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFJLHlCQUFXLENBQUMsU0FBUyxDQUFDLEVBQUU7WUFDMUIsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1NBQ2I7YUFBTTtZQUNMLFNBQVMsR0FBRyxJQUFJLENBQUM7U0FDbEI7UUFFRCxJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO1FBQ3pCLElBQUksR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUMzQixPQUFPLGVBQVksQ0FBQyxlQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDcEQ7YUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDbEIsT0FBTyxlQUFZLENBQUMscUJBQVMsQ0FBQyxLQUFZLEVBQUUsU0FBUyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDakU7YUFBTTtZQUNMLE9BQU8sZUFBWSxDQUFJLGFBQUssQ0FBQyxTQUFTLENBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQztTQUN6RDtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFsQkQsOEJBa0JDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tQXJyYXknO1xuaW1wb3J0IHsgc2NhbGFyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9zY2FsYXInO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IGNvbmNhdCBhcyBjb25jYXRTdGF0aWMgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbmNhdCc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VD4oc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRCA9IFQ+KHYxOiBELCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRD47XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQgPSBULCBFID0gVD4odjE6IEQsIHYyOiBFLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRCB8IEU+O1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0V2l0aDxULCBEID0gVCwgRSA9IFQsIEYgPSBUPih2MTogRCwgdjI6IEUsIHYzOiBGLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRCB8IEUgfCBGPjtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRCA9IFQsIEUgPSBULCBGID0gVCwgRyA9IFQ+KHYxOiBELCB2MjogIEUsIHYzOiBGLCB2NDogRywgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQgfCBFIHwgRiB8IEc+O1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0V2l0aDxULCBEID0gVCwgRSA9IFQsIEYgPSBULCBHID0gVCwgSCA9IFQ+KHYxOiBELCB2MjogRSwgdjM6IEYsIHY0OiBHLCB2NTogSCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQgfCBFIHwgRiB8IEcgfCBIPjtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRCA9IFQsIEUgPSBULCBGID0gVCwgRyA9IFQsIEggPSBULCBJID0gVD4odjE6IEQsIHYyOiBFLCB2MzogRiwgdjQ6IEcsIHY1OiBILCB2NjogSSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQgfCBFIHwgRiB8IEcgfCBIIHwgST47XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQgPSBUPiguLi5hcnJheTogQXJyYXk8RCB8IFNjaGVkdWxlckxpa2U+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgRD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtcyB5b3Ugc3BlY2lmeSBhcyBhcmd1bWVudHMgYmVmb3JlIGl0IGJlZ2lucyB0byBlbWl0XG4gKiBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Rmlyc3QgZW1pdHMgaXRzIGFyZ3VtZW50cyBpbiBvcmRlciwgYW5kIHRoZW4gYW55XG4gKiBlbWlzc2lvbnMgZnJvbSB0aGUgc291cmNlLjwvc3Bhbj5cbiAqXG4gKiAhW10oc3RhcnRXaXRoLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqIFN0YXJ0IHRoZSBjaGFpbiBvZiBlbWlzc2lvbnMgd2l0aCBgXCJmaXJzdFwiYCwgYFwic2Vjb25kXCJgXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogICBvZihcImZyb20gc291cmNlXCIpXG4gKiAgICAucGlwZShzdGFydFdpdGgoXCJmaXJzdFwiLCBcInNlY29uZFwiKSlcbiAqICAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gcmVzdWx0czpcbiAqIC8vICAgXCJmaXJzdFwiXG4gKiAvLyAgIFwic2Vjb25kXCJcbiAqIC8vICAgXCJmcm9tIHNvdXJjZVwiXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gey4uLlR9IHZhbHVlcyAtIEl0ZW1zIHlvdSB3YW50IHRoZSBtb2RpZmllZCBPYnNlcnZhYmxlIHRvIGVtaXQgZmlyc3QuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIC0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBgbmV4dGAgbm90aWZpY2F0aW9ucy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbXMgaW4gdGhlIHNwZWNpZmllZCBJdGVyYWJsZSBhbmQgdGhlbiBlbWl0cyB0aGUgaXRlbXNcbiAqIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBzdGFydFdpdGhcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRD4oLi4uYXJyYXk6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHtcbiAgICBsZXQgc2NoZWR1bGVyID0gPFNjaGVkdWxlckxpa2U+YXJyYXlbYXJyYXkubGVuZ3RoIC0gMV07XG4gICAgaWYgKGlzU2NoZWR1bGVyKHNjaGVkdWxlcikpIHtcbiAgICAgIGFycmF5LnBvcCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBzY2hlZHVsZXIgPSBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICBpZiAobGVuID09PSAxICYmICFzY2hlZHVsZXIpIHtcbiAgICAgIHJldHVybiBjb25jYXRTdGF0aWMoc2NhbGFyKGFycmF5WzBdIGFzIFQpLCBzb3VyY2UpO1xuICAgIH0gZWxzZSBpZiAobGVuID4gMCkge1xuICAgICAgcmV0dXJuIGNvbmNhdFN0YXRpYyhmcm9tQXJyYXkoYXJyYXkgYXMgVFtdLCBzY2hlZHVsZXIpLCBzb3VyY2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gY29uY2F0U3RhdGljPFQ+KGVtcHR5KHNjaGVkdWxlcikgYXMgYW55LCBzb3VyY2UpO1xuICAgIH1cbiAgfTtcbn1cbiJdfQ==