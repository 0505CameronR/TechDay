"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var not_1 = require("../util/not");
var filter_1 = require("./filter");
/**
 * Splits the source Observable into two, one with values that satisfy a
 * predicate, and another with values that don't satisfy the predicate.
 *
 * <span class="informal">It's like {@link filter}, but returns two Observables:
 * one like the output of {@link filter}, and the other with values that did not
 * pass the condition.</span>
 *
 * ![](partition.png)
 *
 * `partition` outputs an array with two Observables that partition the values
 * from the source Observable through the given `predicate` function. The first
 * Observable in that array emits source values for which the predicate argument
 * returns true. The second Observable emits source values for which the
 * predicate returns false. The first behaves like {@link filter} and the second
 * behaves like {@link filter} with the predicate negated.
 *
 * ## Example
 * Partition click events into those on DIV elements and those elsewhere
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const parts = clicks.pipe(partition(ev => ev.target.tagName === 'DIV'));
 * const clicksOnDivs = parts[0];
 * const clicksElsewhere = parts[1];
 * clicksOnDivs.subscribe(x => console.log('DIV clicked: ', x));
 * clicksElsewhere.subscribe(x => console.log('Other clicked: ', x));
 * ```
 *
 * @see {@link filter}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted on the first Observable in the returned array, if
 * `false` the value is emitted on the second Observable in the array. The
 * `index` parameter is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {[Observable<T>, Observable<T>]} An array with two Observables: one
 * with values that passed the predicate, and another with values that did not
 * pass the predicate.
 * @method partition
 * @owner Observable
 */
function partition(predicate, thisArg) {
    return function (source) { return [
        filter_1.filter(predicate, thisArg)(source),
        filter_1.filter(not_1.not(predicate, thisArg))(source)
    ]; };
}
exports.partition = partition;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGl0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGFydGl0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBQ2xDLG1DQUFrQztBQUlsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJDRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxTQUErQyxFQUMvQyxPQUFhO0lBQ3hDLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUE7UUFDaEMsZUFBTSxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQyxNQUFNLENBQUM7UUFDbEMsZUFBTSxDQUFDLFNBQUcsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFRLENBQUMsQ0FBQyxNQUFNLENBQUM7S0FDYixFQUhELENBR0MsQ0FBQztBQUN0QyxDQUFDO0FBTkQsOEJBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBub3QgfSBmcm9tICcuLi91dGlsL25vdCc7XG5pbXBvcnQgeyBmaWx0ZXIgfSBmcm9tICcuL2ZpbHRlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBVbmFyeUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFNwbGl0cyB0aGUgc291cmNlIE9ic2VydmFibGUgaW50byB0d28sIG9uZSB3aXRoIHZhbHVlcyB0aGF0IHNhdGlzZnkgYVxuICogcHJlZGljYXRlLCBhbmQgYW5vdGhlciB3aXRoIHZhbHVlcyB0aGF0IGRvbid0IHNhdGlzZnkgdGhlIHByZWRpY2F0ZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBmaWx0ZXJ9LCBidXQgcmV0dXJucyB0d28gT2JzZXJ2YWJsZXM6XG4gKiBvbmUgbGlrZSB0aGUgb3V0cHV0IG9mIHtAbGluayBmaWx0ZXJ9LCBhbmQgdGhlIG90aGVyIHdpdGggdmFsdWVzIHRoYXQgZGlkIG5vdFxuICogcGFzcyB0aGUgY29uZGl0aW9uLjwvc3Bhbj5cbiAqXG4gKiAhW10ocGFydGl0aW9uLnBuZylcbiAqXG4gKiBgcGFydGl0aW9uYCBvdXRwdXRzIGFuIGFycmF5IHdpdGggdHdvIE9ic2VydmFibGVzIHRoYXQgcGFydGl0aW9uIHRoZSB2YWx1ZXNcbiAqIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRocm91Z2ggdGhlIGdpdmVuIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLiBUaGUgZmlyc3RcbiAqIE9ic2VydmFibGUgaW4gdGhhdCBhcnJheSBlbWl0cyBzb3VyY2UgdmFsdWVzIGZvciB3aGljaCB0aGUgcHJlZGljYXRlIGFyZ3VtZW50XG4gKiByZXR1cm5zIHRydWUuIFRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBlbWl0cyBzb3VyY2UgdmFsdWVzIGZvciB3aGljaCB0aGVcbiAqIHByZWRpY2F0ZSByZXR1cm5zIGZhbHNlLiBUaGUgZmlyc3QgYmVoYXZlcyBsaWtlIHtAbGluayBmaWx0ZXJ9IGFuZCB0aGUgc2Vjb25kXG4gKiBiZWhhdmVzIGxpa2Uge0BsaW5rIGZpbHRlcn0gd2l0aCB0aGUgcHJlZGljYXRlIG5lZ2F0ZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogUGFydGl0aW9uIGNsaWNrIGV2ZW50cyBpbnRvIHRob3NlIG9uIERJViBlbGVtZW50cyBhbmQgdGhvc2UgZWxzZXdoZXJlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcGFydHMgPSBjbGlja3MucGlwZShwYXJ0aXRpb24oZXYgPT4gZXYudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSk7XG4gKiBjb25zdCBjbGlja3NPbkRpdnMgPSBwYXJ0c1swXTtcbiAqIGNvbnN0IGNsaWNrc0Vsc2V3aGVyZSA9IHBhcnRzWzFdO1xuICogY2xpY2tzT25EaXZzLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdESVYgY2xpY2tlZDogJywgeCkpO1xuICogY2xpY2tzRWxzZXdoZXJlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdPdGhlciBjbGlja2VkOiAnLCB4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmaWx0ZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IGJvb2xlYW59IHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRoYXRcbiAqIGV2YWx1YXRlcyBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJZiBpdCByZXR1cm5zIGB0cnVlYCxcbiAqIHRoZSB2YWx1ZSBpcyBlbWl0dGVkIG9uIHRoZSBmaXJzdCBPYnNlcnZhYmxlIGluIHRoZSByZXR1cm5lZCBhcnJheSwgaWZcbiAqIGBmYWxzZWAgdGhlIHZhbHVlIGlzIGVtaXR0ZWQgb24gdGhlIHNlY29uZCBPYnNlcnZhYmxlIGluIHRoZSBhcnJheS4gVGhlXG4gKiBgaW5kZXhgIHBhcmFtZXRlciBpcyB0aGUgbnVtYmVyIGBpYCBmb3IgdGhlIGktdGggc291cmNlIGVtaXNzaW9uIHRoYXQgaGFzXG4gKiBoYXBwZW5lZCBzaW5jZSB0aGUgc3Vic2NyaXB0aW9uLCBzdGFydGluZyBmcm9tIHRoZSBudW1iZXIgYDBgLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBBbiBvcHRpb25hbCBhcmd1bWVudCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIGB0aGlzYFxuICogaW4gdGhlIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLlxuICogQHJldHVybiB7W09ic2VydmFibGU8VD4sIE9ic2VydmFibGU8VD5dfSBBbiBhcnJheSB3aXRoIHR3byBPYnNlcnZhYmxlczogb25lXG4gKiB3aXRoIHZhbHVlcyB0aGF0IHBhc3NlZCB0aGUgcHJlZGljYXRlLCBhbmQgYW5vdGhlciB3aXRoIHZhbHVlcyB0aGF0IGRpZCBub3RcbiAqIHBhc3MgdGhlIHByZWRpY2F0ZS5cbiAqIEBtZXRob2QgcGFydGl0aW9uXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFydGl0aW9uPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogVW5hcnlGdW5jdGlvbjxPYnNlcnZhYmxlPFQ+LCBbT2JzZXJ2YWJsZTxUPiwgT2JzZXJ2YWJsZTxUPl0+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IFtcbiAgICBmaWx0ZXIocHJlZGljYXRlLCB0aGlzQXJnKShzb3VyY2UpLFxuICAgIGZpbHRlcihub3QocHJlZGljYXRlLCB0aGlzQXJnKSBhcyBhbnkpKHNvdXJjZSlcbiAgXSBhcyBbT2JzZXJ2YWJsZTxUPiwgT2JzZXJ2YWJsZTxUPl07XG59XG4iXX0=