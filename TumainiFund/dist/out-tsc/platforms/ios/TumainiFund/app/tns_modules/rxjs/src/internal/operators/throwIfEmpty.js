"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tap_1 = require("./tap");
var EmptyError_1 = require("../util/EmptyError");
/**
 * If the source observable completes without emitting a value, it will emit
 * an error. The error will be created at that time by the optional
 * `errorFactory` argument, otherwise, the error will be {@link EmptyError}.
 *
 * ![](throwIfEmpty.png)
 *
 * ## Example
 * ```javascript
 * const click$ = fromEvent(button, 'click');
 *
 * clicks$.pipe(
 *   takeUntil(timer(1000)),
 *   throwIfEmpty(
 *     () => new Error('the button was not clicked within 1 second')
 *   ),
 * )
 * .subscribe({
 *   next() { console.log('The button was clicked'); },
 *   error(err) { console.error(err); },
 * });
 * ```
 *
 * @param {Function} [errorFactory] A factory function called to produce the
 * error to be thrown when the source observable completes without emitting a
 * value.
 */
exports.throwIfEmpty = function (errorFactory) {
    if (errorFactory === void 0) { errorFactory = defaultErrorFactory; }
    return tap_1.tap({
        hasValue: false,
        next: function () { this.hasValue = true; },
        complete: function () {
            if (!this.hasValue) {
                throw errorFactory();
            }
        }
    });
};
function defaultErrorFactory() {
    return new EmptyError_1.EmptyError();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3dJZkVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rocm93SWZFbXB0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUE0QjtBQUM1QixpREFBZ0Q7QUFHaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ1UsUUFBQSxZQUFZLEdBQ3ZCLFVBQUksWUFBK0M7SUFBL0MsNkJBQUEsRUFBQSxrQ0FBK0M7SUFBSyxPQUFBLFNBQUcsQ0FBSTtRQUM3RCxRQUFRLEVBQUUsS0FBSztRQUNmLElBQUksZ0JBQUssSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLFFBQVE7WUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDbEIsTUFBTSxZQUFZLEVBQUUsQ0FBQzthQUN0QjtRQUNILENBQUM7S0FDSyxDQUFDO0FBUitDLENBUS9DLENBQUM7QUFFWixTQUFTLG1CQUFtQjtJQUMxQixPQUFPLElBQUksdUJBQVUsRUFBRSxDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0YXAgfSBmcm9tICcuL3RhcCc7XG5pbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgc291cmNlIG9ic2VydmFibGUgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgYSB2YWx1ZSwgaXQgd2lsbCBlbWl0XG4gKiBhbiBlcnJvci4gVGhlIGVycm9yIHdpbGwgYmUgY3JlYXRlZCBhdCB0aGF0IHRpbWUgYnkgdGhlIG9wdGlvbmFsXG4gKiBgZXJyb3JGYWN0b3J5YCBhcmd1bWVudCwgb3RoZXJ3aXNlLCB0aGUgZXJyb3Igd2lsbCBiZSB7QGxpbmsgRW1wdHlFcnJvcn0uXG4gKlxuICogIVtdKHRocm93SWZFbXB0eS5wbmcpXG4gKlxuICogIyMgRXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2skID0gZnJvbUV2ZW50KGJ1dHRvbiwgJ2NsaWNrJyk7XG4gKlxuICogY2xpY2tzJC5waXBlKFxuICogICB0YWtlVW50aWwodGltZXIoMTAwMCkpLFxuICogICB0aHJvd0lmRW1wdHkoXG4gKiAgICAgKCkgPT4gbmV3IEVycm9yKCd0aGUgYnV0dG9uIHdhcyBub3QgY2xpY2tlZCB3aXRoaW4gMSBzZWNvbmQnKVxuICogICApLFxuICogKVxuICogLnN1YnNjcmliZSh7XG4gKiAgIG5leHQoKSB7IGNvbnNvbGUubG9nKCdUaGUgYnV0dG9uIHdhcyBjbGlja2VkJyk7IH0sXG4gKiAgIGVycm9yKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH0sXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlcnJvckZhY3RvcnldIEEgZmFjdG9yeSBmdW5jdGlvbiBjYWxsZWQgdG8gcHJvZHVjZSB0aGVcbiAqIGVycm9yIHRvIGJlIHRocm93biB3aGVuIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhXG4gKiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRocm93SWZFbXB0eSA9XG4gIDxUPihlcnJvckZhY3Rvcnk6ICgoKSA9PiBhbnkpID0gZGVmYXVsdEVycm9yRmFjdG9yeSkgPT4gdGFwPFQ+KHtcbiAgICBoYXNWYWx1ZTogZmFsc2UsXG4gICAgbmV4dCgpIHsgdGhpcy5oYXNWYWx1ZSA9IHRydWU7IH0sXG4gICAgY29tcGxldGUoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JGYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfVxuICB9IGFzIGFueSk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRFcnJvckZhY3RvcnkoKSB7XG4gIHJldHVybiBuZXcgRW1wdHlFcnJvcigpO1xufVxuIl19