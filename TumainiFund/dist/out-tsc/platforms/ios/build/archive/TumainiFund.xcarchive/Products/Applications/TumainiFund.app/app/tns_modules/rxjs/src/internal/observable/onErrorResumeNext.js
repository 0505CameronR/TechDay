"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var from_1 = require("./from");
var isArray_1 = require("../util/isArray");
var empty_1 = require("./empty");
/* tslint:enable:max-line-length */
/**
 * When any of the provided Observable emits an complete or error notification, it immediately subscribes to the next one
 * that was passed.
 *
 * <span class="informal">Execute series of Observables no matter what, even if it means swallowing errors.</span>
 *
 * ![](onErrorResumeNext.png)
 *
 * `onErrorResumeNext` Will subscribe to each observable source it is provided, in order.
 * If the source it's subscribed to emits an error or completes, it will move to the next source
 * without error.
 *
 * If `onErrorResumeNext` is provided no arguments, or a single, empty array, it will return {@link index/EMPTY}.
 *
 * `onErrorResumeNext` is basically {@link concat}, only it will continue, even if one of its
 * sources emits an error.
 *
 * Note that there is no way to handle any errors thrown by sources via the resuult of
 * `onErrorResumeNext`. If you want to handle errors thrown in any given source, you can
 * always use the {@link catchError} operator on them before passing them into `onErrorResumeNext`.
 *
 * ## Example
 * Subscribe to the next Observable after map fails</caption>
 * ```javascript
 * import { onErrorResumeNext, of } from 'rxjs';
 * import { map } from 'rxjs/operators';
 *
 * onErrorResumeNext(
 *  of(1, 2, 3, 0).pipe(
 *    map(x => {
 *      if (x === 0) throw Error();
 *      return 10 / x;
 *    })
 *  ),
 *  of(1, 2, 3),
 * )
 * .subscribe(
 *   val => console.log(val),
 *   err => console.log(err),          // Will never be called.
 *   () => console.log('done'),
 * );
 *
 * // Logs:
 * // 10
 * // 5
 * // 3.3333333333333335
 * // 1
 * // 2
 * // 3
 * // "done"
 * ```
 *
 * @see {@link concat}
 * @see {@link catchError}
 *
 * @param {...ObservableInput} sources Observables (or anything that *is* observable) passed either directly or as an array.
 * @return {Observable} An Observable that concatenates all sources, one after the other,
 * ignoring all errors, such that any error causes it to move on to the next source.
 */
function onErrorResumeNext() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    if (sources.length === 0) {
        return empty_1.EMPTY;
    }
    var first = sources[0], remainder = sources.slice(1);
    if (sources.length === 1 && isArray_1.isArray(first)) {
        return onErrorResumeNext.apply(void 0, first);
    }
    return new Observable_1.Observable(function (subscriber) {
        var subNext = function () { return subscriber.add(onErrorResumeNext.apply(void 0, remainder).subscribe(subscriber)); };
        return from_1.from(first).subscribe({
            next: function (value) { subscriber.next(value); },
            error: subNext,
            complete: subNext,
        });
    });
}
exports.onErrorResumeNext = onErrorResumeNext;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25FcnJvclJlc3VtZU5leHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvb25FcnJvclJlc3VtZU5leHQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsK0JBQThCO0FBQzlCLDJDQUEwQztBQUMxQyxpQ0FBZ0M7QUFXaEMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMERHO0FBQ0gsU0FBZ0IsaUJBQWlCO0lBQU8saUJBRXFEO1NBRnJELFVBRXFELEVBRnJELHFCQUVxRCxFQUZyRCxJQUVxRDtRQUZyRCw0QkFFcUQ7O0lBRTNGLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxhQUFLLENBQUM7S0FDZDtJQUVPLElBQUEsa0JBQUssRUFBRSw0QkFBWSxDQUFhO0lBRXhDLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksaUJBQU8sQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMxQyxPQUFPLGlCQUFpQixlQUFJLEtBQUssRUFBRTtLQUNwQztJQUVELE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQUEsVUFBVTtRQUM5QixJQUFNLE9BQU8sR0FBRyxjQUFNLE9BQUEsVUFBVSxDQUFDLEdBQUcsQ0FDbEMsaUJBQWlCLGVBQUksU0FBUyxFQUFFLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FDdEQsRUFGcUIsQ0FFckIsQ0FBQztRQUVGLE9BQU8sV0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLFNBQVMsQ0FBQztZQUMzQixJQUFJLFlBQUMsS0FBSyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3ZDLEtBQUssRUFBRSxPQUFPO1lBQ2QsUUFBUSxFQUFFLE9BQU87U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBekJELDhDQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPih2OiBPYnNlcnZhYmxlSW5wdXQ8Uj4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBSPih2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBUNSwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFQyLCBUMywgVDQsIFQ1LCBUNiwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIG9uRXJyb3JSZXN1bWVOZXh0PFI+KGFycmF5OiBPYnNlcnZhYmxlSW5wdXQ8YW55PltdKTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogV2hlbiBhbnkgb2YgdGhlIHByb3ZpZGVkIE9ic2VydmFibGUgZW1pdHMgYW4gY29tcGxldGUgb3IgZXJyb3Igbm90aWZpY2F0aW9uLCBpdCBpbW1lZGlhdGVseSBzdWJzY3JpYmVzIHRvIHRoZSBuZXh0IG9uZVxuICogdGhhdCB3YXMgcGFzc2VkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5FeGVjdXRlIHNlcmllcyBvZiBPYnNlcnZhYmxlcyBubyBtYXR0ZXIgd2hhdCwgZXZlbiBpZiBpdCBtZWFucyBzd2FsbG93aW5nIGVycm9ycy48L3NwYW4+XG4gKlxuICogIVtdKG9uRXJyb3JSZXN1bWVOZXh0LnBuZylcbiAqXG4gKiBgb25FcnJvclJlc3VtZU5leHRgIFdpbGwgc3Vic2NyaWJlIHRvIGVhY2ggb2JzZXJ2YWJsZSBzb3VyY2UgaXQgaXMgcHJvdmlkZWQsIGluIG9yZGVyLlxuICogSWYgdGhlIHNvdXJjZSBpdCdzIHN1YnNjcmliZWQgdG8gZW1pdHMgYW4gZXJyb3Igb3IgY29tcGxldGVzLCBpdCB3aWxsIG1vdmUgdG8gdGhlIG5leHQgc291cmNlXG4gKiB3aXRob3V0IGVycm9yLlxuICpcbiAqIElmIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgcHJvdmlkZWQgbm8gYXJndW1lbnRzLCBvciBhIHNpbmdsZSwgZW1wdHkgYXJyYXksIGl0IHdpbGwgcmV0dXJuIHtAbGluayBpbmRleC9FTVBUWX0uXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBpcyBiYXNpY2FsbHkge0BsaW5rIGNvbmNhdH0sIG9ubHkgaXQgd2lsbCBjb250aW51ZSwgZXZlbiBpZiBvbmUgb2YgaXRzXG4gKiBzb3VyY2VzIGVtaXRzIGFuIGVycm9yLlxuICpcbiAqIE5vdGUgdGhhdCB0aGVyZSBpcyBubyB3YXkgdG8gaGFuZGxlIGFueSBlcnJvcnMgdGhyb3duIGJ5IHNvdXJjZXMgdmlhIHRoZSByZXN1dWx0IG9mXG4gKiBgb25FcnJvclJlc3VtZU5leHRgLiBJZiB5b3Ugd2FudCB0byBoYW5kbGUgZXJyb3JzIHRocm93biBpbiBhbnkgZ2l2ZW4gc291cmNlLCB5b3UgY2FuXG4gKiBhbHdheXMgdXNlIHRoZSB7QGxpbmsgY2F0Y2hFcnJvcn0gb3BlcmF0b3Igb24gdGhlbSBiZWZvcmUgcGFzc2luZyB0aGVtIGludG8gYG9uRXJyb3JSZXN1bWVOZXh0YC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdWJzY3JpYmUgdG8gdGhlIG5leHQgT2JzZXJ2YWJsZSBhZnRlciBtYXAgZmFpbHM8L2NhcHRpb24+XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvbkVycm9yUmVzdW1lTmV4dCwgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvbkVycm9yUmVzdW1lTmV4dChcbiAqICBvZigxLCAyLCAzLCAwKS5waXBlKFxuICogICAgbWFwKHggPT4ge1xuICogICAgICBpZiAoeCA9PT0gMCkgdGhyb3cgRXJyb3IoKTtcbiAqICAgICAgcmV0dXJuIDEwIC8geDtcbiAqICAgIH0pXG4gKiAgKSxcbiAqICBvZigxLCAyLCAzKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbCA9PiBjb25zb2xlLmxvZyh2YWwpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSwgICAgICAgICAgLy8gV2lsbCBuZXZlciBiZSBjYWxsZWQuXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdkb25lJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAxMFxuICogLy8gNVxuICogLy8gMy4zMzMzMzMzMzMzMzMzMzM1XG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyAzXG4gKiAvLyBcImRvbmVcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29uY2F0fVxuICogQHNlZSB7QGxpbmsgY2F0Y2hFcnJvcn1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gc291cmNlcyBPYnNlcnZhYmxlcyAob3IgYW55dGhpbmcgdGhhdCAqaXMqIG9ic2VydmFibGUpIHBhc3NlZCBlaXRoZXIgZGlyZWN0bHkgb3IgYXMgYW4gYXJyYXkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgY29uY2F0ZW5hdGVzIGFsbCBzb3VyY2VzLCBvbmUgYWZ0ZXIgdGhlIG90aGVyLFxuICogaWdub3JpbmcgYWxsIGVycm9ycywgc3VjaCB0aGF0IGFueSBlcnJvciBjYXVzZXMgaXQgdG8gbW92ZSBvbiB0byB0aGUgbmV4dCBzb3VyY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxULCBSPiguLi5zb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+PiB8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+IHtcblxuICBpZiAoc291cmNlcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gRU1QVFk7XG4gIH1cblxuICBjb25zdCBbIGZpcnN0LCAuLi5yZW1haW5kZXIgXSA9IHNvdXJjZXM7XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoZmlyc3QpKSB7XG4gICAgcmV0dXJuIG9uRXJyb3JSZXN1bWVOZXh0KC4uLmZpcnN0KTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBzdWJOZXh0ID0gKCkgPT4gc3Vic2NyaWJlci5hZGQoXG4gICAgICBvbkVycm9yUmVzdW1lTmV4dCguLi5yZW1haW5kZXIpLnN1YnNjcmliZShzdWJzY3JpYmVyKVxuICAgICk7XG5cbiAgICByZXR1cm4gZnJvbShmaXJzdCkuc3Vic2NyaWJlKHtcbiAgICAgIG5leHQodmFsdWUpIHsgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTsgfSxcbiAgICAgIGVycm9yOiBzdWJOZXh0LFxuICAgICAgY29tcGxldGU6IHN1Yk5leHQsXG4gICAgfSk7XG4gIH0pO1xufVxuIl19