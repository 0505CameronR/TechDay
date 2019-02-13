import { not } from '../util/not';
import { filter } from './filter';
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
export function partition(predicate, thisArg) {
    return (source) => [
        filter(predicate, thisArg)(source),
        filter(not(predicate, thisArg))(source)
    ];
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFydGl0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3BhcnRpdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFJbEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQ0c7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFJLFNBQStDLEVBQy9DLE9BQWE7SUFDeEMsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDO1FBQ2xDLE1BQU0sQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBUSxDQUFDLENBQUMsTUFBTSxDQUFDO0tBQ2IsQ0FBQztBQUN0QyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgbm90IH0gZnJvbSAnLi4vdXRpbC9ub3QnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVW5hcnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBTcGxpdHMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGludG8gdHdvLCBvbmUgd2l0aCB2YWx1ZXMgdGhhdCBzYXRpc2Z5IGFcbiAqIHByZWRpY2F0ZSwgYW5kIGFub3RoZXIgd2l0aCB2YWx1ZXMgdGhhdCBkb24ndCBzYXRpc2Z5IHRoZSBwcmVkaWNhdGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgZmlsdGVyfSwgYnV0IHJldHVybnMgdHdvIE9ic2VydmFibGVzOlxuICogb25lIGxpa2UgdGhlIG91dHB1dCBvZiB7QGxpbmsgZmlsdGVyfSwgYW5kIHRoZSBvdGhlciB3aXRoIHZhbHVlcyB0aGF0IGRpZCBub3RcbiAqIHBhc3MgdGhlIGNvbmRpdGlvbi48L3NwYW4+XG4gKlxuICogIVtdKHBhcnRpdGlvbi5wbmcpXG4gKlxuICogYHBhcnRpdGlvbmAgb3V0cHV0cyBhbiBhcnJheSB3aXRoIHR3byBPYnNlcnZhYmxlcyB0aGF0IHBhcnRpdGlvbiB0aGUgdmFsdWVzXG4gKiBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aHJvdWdoIHRoZSBnaXZlbiBgcHJlZGljYXRlYCBmdW5jdGlvbi4gVGhlIGZpcnN0XG4gKiBPYnNlcnZhYmxlIGluIHRoYXQgYXJyYXkgZW1pdHMgc291cmNlIHZhbHVlcyBmb3Igd2hpY2ggdGhlIHByZWRpY2F0ZSBhcmd1bWVudFxuICogcmV0dXJucyB0cnVlLiBUaGUgc2Vjb25kIE9ic2VydmFibGUgZW1pdHMgc291cmNlIHZhbHVlcyBmb3Igd2hpY2ggdGhlXG4gKiBwcmVkaWNhdGUgcmV0dXJucyBmYWxzZS4gVGhlIGZpcnN0IGJlaGF2ZXMgbGlrZSB7QGxpbmsgZmlsdGVyfSBhbmQgdGhlIHNlY29uZFxuICogYmVoYXZlcyBsaWtlIHtAbGluayBmaWx0ZXJ9IHdpdGggdGhlIHByZWRpY2F0ZSBuZWdhdGVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFBhcnRpdGlvbiBjbGljayBldmVudHMgaW50byB0aG9zZSBvbiBESVYgZWxlbWVudHMgYW5kIHRob3NlIGVsc2V3aGVyZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHBhcnRzID0gY2xpY2tzLnBpcGUocGFydGl0aW9uKGV2ID0+IGV2LnRhcmdldC50YWdOYW1lID09PSAnRElWJykpO1xuICogY29uc3QgY2xpY2tzT25EaXZzID0gcGFydHNbMF07XG4gKiBjb25zdCBjbGlja3NFbHNld2hlcmUgPSBwYXJ0c1sxXTtcbiAqIGNsaWNrc09uRGl2cy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnRElWIGNsaWNrZWQ6ICcsIHgpKTtcbiAqIGNsaWNrc0Vsc2V3aGVyZS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnT3RoZXIgY2xpY2tlZDogJywgeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZmlsdGVyfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBib29sZWFufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0aGF0XG4gKiBldmFsdWF0ZXMgZWFjaCB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgaXQgcmV0dXJucyBgdHJ1ZWAsXG4gKiB0aGUgdmFsdWUgaXMgZW1pdHRlZCBvbiB0aGUgZmlyc3QgT2JzZXJ2YWJsZSBpbiB0aGUgcmV0dXJuZWQgYXJyYXksIGlmXG4gKiBgZmFsc2VgIHRoZSB2YWx1ZSBpcyBlbWl0dGVkIG9uIHRoZSBzZWNvbmQgT2JzZXJ2YWJsZSBpbiB0aGUgYXJyYXkuIFRoZVxuICogYGluZGV4YCBwYXJhbWV0ZXIgaXMgdGhlIG51bWJlciBgaWAgZm9yIHRoZSBpLXRoIHNvdXJjZSBlbWlzc2lvbiB0aGF0IGhhc1xuICogaGFwcGVuZWQgc2luY2UgdGhlIHN1YnNjcmlwdGlvbiwgc3RhcnRpbmcgZnJvbSB0aGUgbnVtYmVyIGAwYC5cbiAqIEBwYXJhbSB7YW55fSBbdGhpc0FyZ10gQW4gb3B0aW9uYWwgYXJndW1lbnQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiBgdGhpc2BcbiAqIGluIHRoZSBgcHJlZGljYXRlYCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge1tPYnNlcnZhYmxlPFQ+LCBPYnNlcnZhYmxlPFQ+XX0gQW4gYXJyYXkgd2l0aCB0d28gT2JzZXJ2YWJsZXM6IG9uZVxuICogd2l0aCB2YWx1ZXMgdGhhdCBwYXNzZWQgdGhlIHByZWRpY2F0ZSwgYW5kIGFub3RoZXIgd2l0aCB2YWx1ZXMgdGhhdCBkaWQgbm90XG4gKiBwYXNzIHRoZSBwcmVkaWNhdGUuXG4gKiBAbWV0aG9kIHBhcnRpdGlvblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnRpdGlvbjxUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IFVuYXJ5RnVuY3Rpb248T2JzZXJ2YWJsZTxUPiwgW09ic2VydmFibGU8VD4sIE9ic2VydmFibGU8VD5dPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBbXG4gICAgZmlsdGVyKHByZWRpY2F0ZSwgdGhpc0FyZykoc291cmNlKSxcbiAgICBmaWx0ZXIobm90KHByZWRpY2F0ZSwgdGhpc0FyZykgYXMgYW55KShzb3VyY2UpXG4gIF0gYXMgW09ic2VydmFibGU8VD4sIE9ic2VydmFibGU8VD5dO1xufVxuIl19