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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3dJZkVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3dJZkVtcHR5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNkJBQTRCO0FBQzVCLGlEQUFnRDtBQUdoRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDVSxRQUFBLFlBQVksR0FDdkIsVUFBSSxZQUErQztJQUEvQyw2QkFBQSxFQUFBLGtDQUErQztJQUFLLE9BQUEsU0FBRyxDQUFJO1FBQzdELFFBQVEsRUFBRSxLQUFLO1FBQ2YsSUFBSSxnQkFBSyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDaEMsUUFBUTtZQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUNsQixNQUFNLFlBQVksRUFBRSxDQUFDO2FBQ3RCO1FBQ0gsQ0FBQztLQUNLLENBQUM7QUFSK0MsQ0FRL0MsQ0FBQztBQUVaLFNBQVMsbUJBQW1CO0lBQzFCLE9BQU8sSUFBSSx1QkFBVSxFQUFFLENBQUM7QUFDMUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHRhcCB9IGZyb20gJy4vdGFwJztcbmltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuLi91dGlsL0VtcHR5RXJyb3InO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIElmIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhIHZhbHVlLCBpdCB3aWxsIGVtaXRcbiAqIGFuIGVycm9yLiBUaGUgZXJyb3Igd2lsbCBiZSBjcmVhdGVkIGF0IHRoYXQgdGltZSBieSB0aGUgb3B0aW9uYWxcbiAqIGBlcnJvckZhY3RvcnlgIGFyZ3VtZW50LCBvdGhlcndpc2UsIHRoZSBlcnJvciB3aWxsIGJlIHtAbGluayBFbXB0eUVycm9yfS5cbiAqXG4gKiAhW10odGhyb3dJZkVtcHR5LnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGljayQgPSBmcm9tRXZlbnQoYnV0dG9uLCAnY2xpY2snKTtcbiAqXG4gKiBjbGlja3MkLnBpcGUoXG4gKiAgIHRha2VVbnRpbCh0aW1lcigxMDAwKSksXG4gKiAgIHRocm93SWZFbXB0eShcbiAqICAgICAoKSA9PiBuZXcgRXJyb3IoJ3RoZSBidXR0b24gd2FzIG5vdCBjbGlja2VkIHdpdGhpbiAxIHNlY29uZCcpXG4gKiAgICksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHtcbiAqICAgbmV4dCgpIHsgY29uc29sZS5sb2coJ1RoZSBidXR0b24gd2FzIGNsaWNrZWQnKTsgfSxcbiAqICAgZXJyb3IoZXJyKSB7IGNvbnNvbGUuZXJyb3IoZXJyKTsgfSxcbiAqIH0pO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2Vycm9yRmFjdG9yeV0gQSBmYWN0b3J5IGZ1bmN0aW9uIGNhbGxlZCB0byBwcm9kdWNlIHRoZVxuICogZXJyb3IgdG8gYmUgdGhyb3duIHdoZW4gdGhlIHNvdXJjZSBvYnNlcnZhYmxlIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIGFcbiAqIHZhbHVlLlxuICovXG5leHBvcnQgY29uc3QgdGhyb3dJZkVtcHR5ID1cbiAgPFQ+KGVycm9yRmFjdG9yeTogKCgpID0+IGFueSkgPSBkZWZhdWx0RXJyb3JGYWN0b3J5KSA9PiB0YXA8VD4oe1xuICAgIGhhc1ZhbHVlOiBmYWxzZSxcbiAgICBuZXh0KCkgeyB0aGlzLmhhc1ZhbHVlID0gdHJ1ZTsgfSxcbiAgICBjb21wbGV0ZSgpIHtcbiAgICAgIGlmICghdGhpcy5oYXNWYWx1ZSkge1xuICAgICAgICB0aHJvdyBlcnJvckZhY3RvcnkoKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gYXMgYW55KTtcblxuZnVuY3Rpb24gZGVmYXVsdEVycm9yRmFjdG9yeSgpIHtcbiAgcmV0dXJuIG5ldyBFbXB0eUVycm9yKCk7XG59XG4iXX0=