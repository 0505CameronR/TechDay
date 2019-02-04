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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25FcnJvclJlc3VtZU5leHQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL29uRXJyb3JSZXN1bWVOZXh0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRTNDLCtCQUE4QjtBQUM5QiwyQ0FBMEM7QUFDMUMsaUNBQWdDO0FBV2hDLG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBERztBQUNILFNBQWdCLGlCQUFpQjtJQUFPLGlCQUVxRDtTQUZyRCxVQUVxRCxFQUZyRCxxQkFFcUQsRUFGckQsSUFFcUQ7UUFGckQsNEJBRXFEOztJQUUzRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sYUFBSyxDQUFDO0tBQ2Q7SUFFTyxJQUFBLGtCQUFLLEVBQUUsNEJBQVksQ0FBYTtJQUV4QyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLGlCQUFPLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDMUMsT0FBTyxpQkFBaUIsZUFBSSxLQUFLLEVBQUU7S0FDcEM7SUFFRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFBLFVBQVU7UUFDOUIsSUFBTSxPQUFPLEdBQUcsY0FBTSxPQUFBLFVBQVUsQ0FBQyxHQUFHLENBQ2xDLGlCQUFpQixlQUFJLFNBQVMsRUFBRSxTQUFTLENBQUMsVUFBVSxDQUFDLENBQ3RELEVBRnFCLENBRXJCLENBQUM7UUFFRixPQUFPLFdBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDM0IsSUFBSSxZQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2QyxLQUFLLEVBQUUsT0FBTztZQUNkLFFBQVEsRUFBRSxPQUFPO1NBQ2xCLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXpCRCw4Q0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8Uj4odjogT2JzZXJ2YWJsZUlucHV0PFI+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBUNCwgUj4odjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VDIsIFQzLCBUNCwgVDUsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxUMiwgVDMsIFQ0LCBUNSwgVDYsIFI+KHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBvbkVycm9yUmVzdW1lTmV4dDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSk6IE9ic2VydmFibGU8Uj47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFdoZW4gYW55IG9mIHRoZSBwcm92aWRlZCBPYnNlcnZhYmxlIGVtaXRzIGFuIGNvbXBsZXRlIG9yIGVycm9yIG5vdGlmaWNhdGlvbiwgaXQgaW1tZWRpYXRlbHkgc3Vic2NyaWJlcyB0byB0aGUgbmV4dCBvbmVcbiAqIHRoYXQgd2FzIHBhc3NlZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RXhlY3V0ZSBzZXJpZXMgb2YgT2JzZXJ2YWJsZXMgbm8gbWF0dGVyIHdoYXQsIGV2ZW4gaWYgaXQgbWVhbnMgc3dhbGxvd2luZyBlcnJvcnMuPC9zcGFuPlxuICpcbiAqICFbXShvbkVycm9yUmVzdW1lTmV4dC5wbmcpXG4gKlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YCBXaWxsIHN1YnNjcmliZSB0byBlYWNoIG9ic2VydmFibGUgc291cmNlIGl0IGlzIHByb3ZpZGVkLCBpbiBvcmRlci5cbiAqIElmIHRoZSBzb3VyY2UgaXQncyBzdWJzY3JpYmVkIHRvIGVtaXRzIGFuIGVycm9yIG9yIGNvbXBsZXRlcywgaXQgd2lsbCBtb3ZlIHRvIHRoZSBuZXh0IHNvdXJjZVxuICogd2l0aG91dCBlcnJvci5cbiAqXG4gKiBJZiBgb25FcnJvclJlc3VtZU5leHRgIGlzIHByb3ZpZGVkIG5vIGFyZ3VtZW50cywgb3IgYSBzaW5nbGUsIGVtcHR5IGFycmF5LCBpdCB3aWxsIHJldHVybiB7QGxpbmsgaW5kZXgvRU1QVFl9LlxuICpcbiAqIGBvbkVycm9yUmVzdW1lTmV4dGAgaXMgYmFzaWNhbGx5IHtAbGluayBjb25jYXR9LCBvbmx5IGl0IHdpbGwgY29udGludWUsIGV2ZW4gaWYgb25lIG9mIGl0c1xuICogc291cmNlcyBlbWl0cyBhbiBlcnJvci5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlcmUgaXMgbm8gd2F5IHRvIGhhbmRsZSBhbnkgZXJyb3JzIHRocm93biBieSBzb3VyY2VzIHZpYSB0aGUgcmVzdXVsdCBvZlxuICogYG9uRXJyb3JSZXN1bWVOZXh0YC4gSWYgeW91IHdhbnQgdG8gaGFuZGxlIGVycm9ycyB0aHJvd24gaW4gYW55IGdpdmVuIHNvdXJjZSwgeW91IGNhblxuICogYWx3YXlzIHVzZSB0aGUge0BsaW5rIGNhdGNoRXJyb3J9IG9wZXJhdG9yIG9uIHRoZW0gYmVmb3JlIHBhc3NpbmcgdGhlbSBpbnRvIGBvbkVycm9yUmVzdW1lTmV4dGAuXG4gKlxuICogIyMgRXhhbXBsZVxuICogU3Vic2NyaWJlIHRvIHRoZSBuZXh0IE9ic2VydmFibGUgYWZ0ZXIgbWFwIGZhaWxzPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgb25FcnJvclJlc3VtZU5leHQsIG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtYXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogb25FcnJvclJlc3VtZU5leHQoXG4gKiAgb2YoMSwgMiwgMywgMCkucGlwZShcbiAqICAgIG1hcCh4ID0+IHtcbiAqICAgICAgaWYgKHggPT09IDApIHRocm93IEVycm9yKCk7XG4gKiAgICAgIHJldHVybiAxMCAvIHg7XG4gKiAgICB9KVxuICogICksXG4gKiAgb2YoMSwgMiwgMyksXG4gKiApXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWwgPT4gY29uc29sZS5sb2codmFsKSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksICAgICAgICAgIC8vIFdpbGwgbmV2ZXIgYmUgY2FsbGVkLlxuICogICAoKSA9PiBjb25zb2xlLmxvZygnZG9uZScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMTBcbiAqIC8vIDVcbiAqIC8vIDMuMzMzMzMzMzMzMzMzMzMzNVxuICogLy8gMVxuICogLy8gMlxuICogLy8gM1xuICogLy8gXCJkb25lXCJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbmNhdH1cbiAqIEBzZWUge0BsaW5rIGNhdGNoRXJyb3J9XG4gKlxuICogQHBhcmFtIHsuLi5PYnNlcnZhYmxlSW5wdXR9IHNvdXJjZXMgT2JzZXJ2YWJsZXMgKG9yIGFueXRoaW5nIHRoYXQgKmlzKiBvYnNlcnZhYmxlKSBwYXNzZWQgZWl0aGVyIGRpcmVjdGx5IG9yIGFzIGFuIGFycmF5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGNvbmNhdGVuYXRlcyBhbGwgc291cmNlcywgb25lIGFmdGVyIHRoZSBvdGhlcixcbiAqIGlnbm9yaW5nIGFsbCBlcnJvcnMsIHN1Y2ggdGhhdCBhbnkgZXJyb3IgY2F1c2VzIGl0IHRvIG1vdmUgb24gdG8gdGhlIG5leHQgc291cmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gb25FcnJvclJlc3VtZU5leHQ8VCwgUj4oLi4uc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55Pj4gfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPiB7XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgY29uc3QgWyBmaXJzdCwgLi4ucmVtYWluZGVyIF0gPSBzb3VyY2VzO1xuXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KGZpcnN0KSkge1xuICAgIHJldHVybiBvbkVycm9yUmVzdW1lTmV4dCguLi5maXJzdCk7XG4gIH1cblxuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgY29uc3Qgc3ViTmV4dCA9ICgpID0+IHN1YnNjcmliZXIuYWRkKFxuICAgICAgb25FcnJvclJlc3VtZU5leHQoLi4ucmVtYWluZGVyKS5zdWJzY3JpYmUoc3Vic2NyaWJlcilcbiAgICApO1xuXG4gICAgcmV0dXJuIGZyb20oZmlyc3QpLnN1YnNjcmliZSh7XG4gICAgICBuZXh0KHZhbHVlKSB7IHN1YnNjcmliZXIubmV4dCh2YWx1ZSk7IH0sXG4gICAgICBlcnJvcjogc3ViTmV4dCxcbiAgICAgIGNvbXBsZXRlOiBzdWJOZXh0LFxuICAgIH0pO1xuICB9KTtcbn1cbiJdfQ==