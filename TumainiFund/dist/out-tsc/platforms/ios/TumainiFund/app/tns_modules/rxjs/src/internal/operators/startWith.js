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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhcnRXaXRoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3N0YXJ0V2l0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLHFEQUFvRDtBQUNwRCwrQ0FBOEM7QUFDOUMsNkNBQTRDO0FBQzVDLCtDQUE4RDtBQUM5RCxtREFBa0Q7QUFZbEQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0JHO0FBQ0gsU0FBZ0IsU0FBUztJQUFPLGVBQWtDO1NBQWxDLFVBQWtDLEVBQWxDLHFCQUFrQyxFQUFsQyxJQUFrQztRQUFsQywwQkFBa0M7O0lBQ2hFLE9BQU8sVUFBQyxNQUFxQjtRQUMzQixJQUFJLFNBQVMsR0FBa0IsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBSSx5QkFBVyxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQzFCLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUNiO2FBQU07WUFDTCxTQUFTLEdBQUcsSUFBSSxDQUFDO1NBQ2xCO1FBRUQsSUFBTSxHQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUN6QixJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDM0IsT0FBTyxlQUFZLENBQUMsZUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQU0sQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ3BEO2FBQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLE9BQU8sZUFBWSxDQUFDLHFCQUFTLENBQUMsS0FBWSxFQUFFLFNBQVMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTCxPQUFPLGVBQVksQ0FBSSxhQUFLLENBQUMsU0FBUyxDQUFRLEVBQUUsTUFBTSxDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDO0FBbEJELDhCQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGZyb21BcnJheSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbUFycmF5JztcbmltcG9ydCB7IHNjYWxhciB9IGZyb20gJy4uL29ic2VydmFibGUvc2NhbGFyJztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBjb25jYXQgYXMgY29uY2F0U3RhdGljIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9jb25jYXQnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQ+KHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQgPSBUPih2MTogRCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0V2l0aDxULCBEID0gVCwgRSA9IFQ+KHYxOiBELCB2MjogRSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQgfCBFPjtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRCA9IFQsIEUgPSBULCBGID0gVD4odjE6IEQsIHYyOiBFLCB2MzogRiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQgfCBFIHwgRj47XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQgPSBULCBFID0gVCwgRiA9IFQsIEcgPSBUPih2MTogRCwgdjI6ICBFLCB2MzogRiwgdjQ6IEcsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBEIHwgRSB8IEYgfCBHPjtcbmV4cG9ydCBmdW5jdGlvbiBzdGFydFdpdGg8VCwgRCA9IFQsIEUgPSBULCBGID0gVCwgRyA9IFQsIEggPSBUPih2MTogRCwgdjI6IEUsIHYzOiBGLCB2NDogRywgdjU6IEgsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBEIHwgRSB8IEYgfCBHIHwgSD47XG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQgPSBULCBFID0gVCwgRiA9IFQsIEcgPSBULCBIID0gVCwgSSA9IFQ+KHYxOiBELCB2MjogRSwgdjM6IEYsIHY0OiBHLCB2NTogSCwgdjY6IEksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBEIHwgRSB8IEYgfCBHIHwgSCB8IEk+O1xuZXhwb3J0IGZ1bmN0aW9uIHN0YXJ0V2l0aDxULCBEID0gVD4oLi4uYXJyYXk6IEFycmF5PEQgfCBTY2hlZHVsZXJMaWtlPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IEQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbXMgeW91IHNwZWNpZnkgYXMgYXJndW1lbnRzIGJlZm9yZSBpdCBiZWdpbnMgdG8gZW1pdFxuICogaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZpcnN0IGVtaXRzIGl0cyBhcmd1bWVudHMgaW4gb3JkZXIsIGFuZCB0aGVuIGFueVxuICogZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZS48L3NwYW4+XG4gKlxuICogIVtdKHN0YXJ0V2l0aC5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBTdGFydCB0aGUgY2hhaW4gb2YgZW1pc3Npb25zIHdpdGggYFwiZmlyc3RcImAsIGBcInNlY29uZFwiYFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqICAgb2YoXCJmcm9tIHNvdXJjZVwiKVxuICogICAgLnBpcGUoc3RhcnRXaXRoKFwiZmlyc3RcIiwgXCJzZWNvbmRcIikpXG4gKiAgICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIHJlc3VsdHM6XG4gKiAvLyAgIFwiZmlyc3RcIlxuICogLy8gICBcInNlY29uZFwiXG4gKiAvLyAgIFwiZnJvbSBzb3VyY2VcIlxuICogYGBgXG4gKlxuICogQHBhcmFtIHsuLi5UfSB2YWx1ZXMgLSBJdGVtcyB5b3Ugd2FudCB0aGUgbW9kaWZpZWQgT2JzZXJ2YWJsZSB0byBlbWl0IGZpcnN0LlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSAtIEEge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc2NoZWR1bGluZ1xuICogdGhlIGVtaXNzaW9ucyBvZiB0aGUgYG5leHRgIG5vdGlmaWNhdGlvbnMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGl0ZW1zIGluIHRoZSBzcGVjaWZpZWQgSXRlcmFibGUgYW5kIHRoZW4gZW1pdHMgdGhlIGl0ZW1zXG4gKiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2Qgc3RhcnRXaXRoXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc3RhcnRXaXRoPFQsIEQ+KC4uLmFycmF5OiBBcnJheTxUIHwgU2NoZWR1bGVyTGlrZT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBEPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgbGV0IHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPmFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIGlmIChpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgICBhcnJheS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGxlbiA9PT0gMSAmJiAhc2NoZWR1bGVyKSB7XG4gICAgICByZXR1cm4gY29uY2F0U3RhdGljKHNjYWxhcihhcnJheVswXSBhcyBUKSwgc291cmNlKTtcbiAgICB9IGVsc2UgaWYgKGxlbiA+IDApIHtcbiAgICAgIHJldHVybiBjb25jYXRTdGF0aWMoZnJvbUFycmF5KGFycmF5IGFzIFRbXSwgc2NoZWR1bGVyKSwgc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbmNhdFN0YXRpYzxUPihlbXB0eShzY2hlZHVsZXIpIGFzIGFueSwgc291cmNlKTtcbiAgICB9XG4gIH07XG59XG4iXX0=