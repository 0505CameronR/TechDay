"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentOutOfRangeError_1 = require("../util/ArgumentOutOfRangeError");
var filter_1 = require("./filter");
var throwIfEmpty_1 = require("./throwIfEmpty");
var defaultIfEmpty_1 = require("./defaultIfEmpty");
var take_1 = require("./take");
/**
 * Emits the single value at the specified `index` in a sequence of emissions
 * from the source Observable.
 *
 * <span class="informal">Emits only the i-th value, then completes.</span>
 *
 * ![](elementAt.png)
 *
 * `elementAt` returns an Observable that emits the item at the specified
 * `index` in the source Observable, or a default value if that `index` is out
 * of range and the `default` argument is provided. If the `default` argument is
 * not given and the `index` is out of range, the output Observable will emit an
 * `ArgumentOutOfRangeError` error.
 *
 * ## Example
 * Emit only the third click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(elementAt(2));
 * result.subscribe(x => console.log(x));
 *
 * // Results in:
 * // click 1 = nothing
 * // click 2 = nothing
 * // click 3 = MouseEvent object logged to console
 * ```
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link skip}
 * @see {@link single}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
 * Observable has completed before emitting the i-th `next` notification.
 *
 * @param {number} index Is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {T} [defaultValue] The default value returned for missing indices.
 * @return {Observable} An Observable that emits a single item, if it is found.
 * Otherwise, will emit the default value if given. If not, then emits an error.
 * @method elementAt
 * @owner Observable
 */
function elementAt(index, defaultValue) {
    if (index < 0) {
        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
    }
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(filter_1.filter(function (v, i) { return i === index; }), take_1.take(1), hasDefaultValue
        ? defaultIfEmpty_1.defaultIfEmpty(defaultValue)
        : throwIfEmpty_1.throwIfEmpty(function () { return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError(); })); };
}
exports.elementAt = elementAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudEF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2VsZW1lbnRBdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDJFQUEwRTtBQUcxRSxtQ0FBa0M7QUFDbEMsK0NBQThDO0FBQzlDLG1EQUFrRDtBQUNsRCwrQkFBOEI7QUFFOUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFJLEtBQWEsRUFBRSxZQUFnQjtJQUMxRCxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7UUFBRSxNQUFNLElBQUksaURBQXVCLEVBQUUsQ0FBQztLQUFFO0lBQ3ZELElBQU0sZUFBZSxHQUFHLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxDQUFDO0lBQzlDLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FDM0MsZUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsS0FBSyxLQUFLLEVBQVgsQ0FBVyxDQUFDLEVBQzdCLFdBQUksQ0FBQyxDQUFDLENBQUMsRUFDUCxlQUFlO1FBQ2IsQ0FBQyxDQUFDLCtCQUFjLENBQUMsWUFBWSxDQUFDO1FBQzlCLENBQUMsQ0FBQywyQkFBWSxDQUFDLGNBQU0sT0FBQSxJQUFJLGlEQUF1QixFQUFFLEVBQTdCLENBQTZCLENBQUMsQ0FDdEQsRUFOaUMsQ0FNakMsQ0FBQztBQUNKLENBQUM7QUFWRCw4QkFVQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IgfSBmcm9tICcuLi91dGlsL0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZpbHRlciB9IGZyb20gJy4vZmlsdGVyJztcbmltcG9ydCB7IHRocm93SWZFbXB0eSB9IGZyb20gJy4vdGhyb3dJZkVtcHR5JztcbmltcG9ydCB7IGRlZmF1bHRJZkVtcHR5IH0gZnJvbSAnLi9kZWZhdWx0SWZFbXB0eSc7XG5pbXBvcnQgeyB0YWtlIH0gZnJvbSAnLi90YWtlJztcblxuLyoqXG4gKiBFbWl0cyB0aGUgc2luZ2xlIHZhbHVlIGF0IHRoZSBzcGVjaWZpZWQgYGluZGV4YCBpbiBhIHNlcXVlbmNlIG9mIGVtaXNzaW9uc1xuICogZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkVtaXRzIG9ubHkgdGhlIGktdGggdmFsdWUsIHRoZW4gY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10oZWxlbWVudEF0LnBuZylcbiAqXG4gKiBgZWxlbWVudEF0YCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbSBhdCB0aGUgc3BlY2lmaWVkXG4gKiBgaW5kZXhgIGluIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgb3IgYSBkZWZhdWx0IHZhbHVlIGlmIHRoYXQgYGluZGV4YCBpcyBvdXRcbiAqIG9mIHJhbmdlIGFuZCB0aGUgYGRlZmF1bHRgIGFyZ3VtZW50IGlzIHByb3ZpZGVkLiBJZiB0aGUgYGRlZmF1bHRgIGFyZ3VtZW50IGlzXG4gKiBub3QgZ2l2ZW4gYW5kIHRoZSBgaW5kZXhgIGlzIG91dCBvZiByYW5nZSwgdGhlIG91dHB1dCBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhblxuICogYEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yYCBlcnJvci5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IG9ubHkgdGhlIHRoaXJkIGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoZWxlbWVudEF0KDIpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIGNsaWNrIDEgPSBub3RoaW5nXG4gKiAvLyBjbGljayAyID0gbm90aGluZ1xuICogLy8gY2xpY2sgMyA9IE1vdXNlRXZlbnQgb2JqZWN0IGxvZ2dlZCB0byBjb25zb2xlXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmaXJzdH1cbiAqIEBzZWUge0BsaW5rIGxhc3R9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICogQHNlZSB7QGxpbmsgc2luZ2xlfVxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqXG4gKiBAdGhyb3dzIHtBcmd1bWVudE91dE9mUmFuZ2VFcnJvcn0gV2hlbiB1c2luZyBgZWxlbWVudEF0KGkpYCwgaXQgZGVsaXZlcnMgYW5cbiAqIEFyZ3VtZW50T3V0T3JSYW5nZUVycm9yIHRvIHRoZSBPYnNlcnZlcidzIGBlcnJvcmAgY2FsbGJhY2sgaWYgYGkgPCAwYCBvciB0aGVcbiAqIE9ic2VydmFibGUgaGFzIGNvbXBsZXRlZCBiZWZvcmUgZW1pdHRpbmcgdGhlIGktdGggYG5leHRgIG5vdGlmaWNhdGlvbi5cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSXMgdGhlIG51bWJlciBgaWAgZm9yIHRoZSBpLXRoIHNvdXJjZSBlbWlzc2lvbiB0aGF0IGhhc1xuICogaGFwcGVuZWQgc2luY2UgdGhlIHN1YnNjcmlwdGlvbiwgc3RhcnRpbmcgZnJvbSB0aGUgbnVtYmVyIGAwYC5cbiAqIEBwYXJhbSB7VH0gW2RlZmF1bHRWYWx1ZV0gVGhlIGRlZmF1bHQgdmFsdWUgcmV0dXJuZWQgZm9yIG1pc3NpbmcgaW5kaWNlcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhIHNpbmdsZSBpdGVtLCBpZiBpdCBpcyBmb3VuZC5cbiAqIE90aGVyd2lzZSwgd2lsbCBlbWl0IHRoZSBkZWZhdWx0IHZhbHVlIGlmIGdpdmVuLiBJZiBub3QsIHRoZW4gZW1pdHMgYW4gZXJyb3IuXG4gKiBAbWV0aG9kIGVsZW1lbnRBdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVsZW1lbnRBdDxUPihpbmRleDogbnVtYmVyLCBkZWZhdWx0VmFsdWU/OiBUKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgaWYgKGluZGV4IDwgMCkgeyB0aHJvdyBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IoKTsgfVxuICBjb25zdCBoYXNEZWZhdWx0VmFsdWUgPSBhcmd1bWVudHMubGVuZ3RoID49IDI7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UucGlwZShcbiAgICBmaWx0ZXIoKHYsIGkpID0+IGkgPT09IGluZGV4KSxcbiAgICB0YWtlKDEpLFxuICAgIGhhc0RlZmF1bHRWYWx1ZVxuICAgICAgPyBkZWZhdWx0SWZFbXB0eShkZWZhdWx0VmFsdWUpXG4gICAgICA6IHRocm93SWZFbXB0eSgoKSA9PiBuZXcgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3IoKSksXG4gICk7XG59XG4iXX0=