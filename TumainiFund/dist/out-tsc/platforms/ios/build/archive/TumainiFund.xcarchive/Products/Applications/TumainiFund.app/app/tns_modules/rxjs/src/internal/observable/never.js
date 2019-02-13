"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var noop_1 = require("../util/noop");
/**
 * An Observable that emits no items to the Observer and never completes.
 *
 * ![](never.png)
 *
 * A simple Observable that emits neither values nor errors nor the completion
 * notification. It can be used for testing purposes or for composing with other
 * Observables. Please note that by never emitting a complete notification, this
 * Observable keeps the subscription from being disposed automatically.
 * Subscriptions need to be manually disposed.
 *
 * ##  Example
 * ### Emit the number 7, then never emit anything else (not even complete)
 * ```javascript
 * function info() {
 *   console.log('Will not be called');
 * }
 * const result = NEVER.pipe(startWith(7));
 * result.subscribe(x => console.log(x), info, info);
 *
 * ```
 *
 * @see {@link Observable}
 * @see {@link index/EMPTY}
 * @see {@link of}
 * @see {@link throwError}
 */
exports.NEVER = new Observable_1.Observable(noop_1.noop);
/**
 * @deprecated Deprecated in favor of using {@link NEVER} constant.
 */
function never() {
    return exports.NEVER;
}
exports.never = never;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvbmV2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFDM0MscUNBQW9DO0FBRXBDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNVLFFBQUEsS0FBSyxHQUFHLElBQUksdUJBQVUsQ0FBUSxXQUFJLENBQUMsQ0FBQztBQUVqRDs7R0FFRztBQUNILFNBQWdCLEtBQUs7SUFDbkIsT0FBTyxhQUFLLENBQUM7QUFDZixDQUFDO0FBRkQsc0JBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcblxuLyoqXG4gKiBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbm8gaXRlbXMgdG8gdGhlIE9ic2VydmVyIGFuZCBuZXZlciBjb21wbGV0ZXMuXG4gKlxuICogIVtdKG5ldmVyLnBuZylcbiAqXG4gKiBBIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbmVpdGhlciB2YWx1ZXMgbm9yIGVycm9ycyBub3IgdGhlIGNvbXBsZXRpb25cbiAqIG5vdGlmaWNhdGlvbi4gSXQgY2FuIGJlIHVzZWQgZm9yIHRlc3RpbmcgcHVycG9zZXMgb3IgZm9yIGNvbXBvc2luZyB3aXRoIG90aGVyXG4gKiBPYnNlcnZhYmxlcy4gUGxlYXNlIG5vdGUgdGhhdCBieSBuZXZlciBlbWl0dGluZyBhIGNvbXBsZXRlIG5vdGlmaWNhdGlvbiwgdGhpc1xuICogT2JzZXJ2YWJsZSBrZWVwcyB0aGUgc3Vic2NyaXB0aW9uIGZyb20gYmVpbmcgZGlzcG9zZWQgYXV0b21hdGljYWxseS5cbiAqIFN1YnNjcmlwdGlvbnMgbmVlZCB0byBiZSBtYW51YWxseSBkaXNwb3NlZC5cbiAqXG4gKiAjIyAgRXhhbXBsZVxuICogIyMjIEVtaXQgdGhlIG51bWJlciA3LCB0aGVuIG5ldmVyIGVtaXQgYW55dGhpbmcgZWxzZSAobm90IGV2ZW4gY29tcGxldGUpXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBpbmZvKCkge1xuICogICBjb25zb2xlLmxvZygnV2lsbCBub3QgYmUgY2FsbGVkJyk7XG4gKiB9XG4gKiBjb25zdCByZXN1bHQgPSBORVZFUi5waXBlKHN0YXJ0V2l0aCg3KSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGluZm8sIGluZm8pO1xuICpcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBpbmRleC9FTVBUWX1cbiAqIEBzZWUge0BsaW5rIG9mfVxuICogQHNlZSB7QGxpbmsgdGhyb3dFcnJvcn1cbiAqL1xuZXhwb3J0IGNvbnN0IE5FVkVSID0gbmV3IE9ic2VydmFibGU8bmV2ZXI+KG5vb3ApO1xuXG4vKipcbiAqIEBkZXByZWNhdGVkIERlcHJlY2F0ZWQgaW4gZmF2b3Igb2YgdXNpbmcge0BsaW5rIE5FVkVSfSBjb25zdGFudC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5ldmVyICgpIHtcbiAgcmV0dXJuIE5FVkVSO1xufVxuIl19