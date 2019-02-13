import { FindValueOperator } from '../operators/find';
/**
 * Emits only the index of the first value emitted by the source Observable that
 * meets some condition.
 *
 * <span class="informal">It's like {@link find}, but emits the index of the
 * found value, not the value itself.</span>
 *
 * ![](findIndex.png)
 *
 * `findIndex` searches for the first item in the source Observable that matches
 * the specified condition embodied by the `predicate`, and returns the
 * (zero-based) index of the first occurrence in the source. Unlike
 * {@link first}, the `predicate` is required in `findIndex`, and does not emit
 * an error if a valid value is not found.
 *
 * ## Example
 * Emit the index of first click that happens on a DIV element
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(findIndex(ev => ev.target.tagName === 'DIV'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link filter}
 * @see {@link find}
 * @see {@link first}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of the index of the first item that
 * matches the condition.
 * @method find
 * @owner Observable
 */
export function findIndex(predicate, thisArg) {
    return (source) => source.lift(new FindValueOperator(predicate, source, true, thisArg));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZEluZGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmRJbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV0RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0NHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBSSxTQUFzRSxFQUN0RSxPQUFhO0lBQ3hDLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQW9CLENBQUM7QUFDNUgsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEZpbmRWYWx1ZU9wZXJhdG9yIH0gZnJvbSAnLi4vb3BlcmF0b3JzL2ZpbmQnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbi8qKlxuICogRW1pdHMgb25seSB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXRcbiAqIG1lZXRzIHNvbWUgY29uZGl0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIGZpbmR9LCBidXQgZW1pdHMgdGhlIGluZGV4IG9mIHRoZVxuICogZm91bmQgdmFsdWUsIG5vdCB0aGUgdmFsdWUgaXRzZWxmLjwvc3Bhbj5cbiAqXG4gKiAhW10oZmluZEluZGV4LnBuZylcbiAqXG4gKiBgZmluZEluZGV4YCBzZWFyY2hlcyBmb3IgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgbWF0Y2hlc1xuICogdGhlIHNwZWNpZmllZCBjb25kaXRpb24gZW1ib2RpZWQgYnkgdGhlIGBwcmVkaWNhdGVgLCBhbmQgcmV0dXJucyB0aGVcbiAqICh6ZXJvLWJhc2VkKSBpbmRleCBvZiB0aGUgZmlyc3Qgb2NjdXJyZW5jZSBpbiB0aGUgc291cmNlLiBVbmxpa2VcbiAqIHtAbGluayBmaXJzdH0sIHRoZSBgcHJlZGljYXRlYCBpcyByZXF1aXJlZCBpbiBgZmluZEluZGV4YCwgYW5kIGRvZXMgbm90IGVtaXRcbiAqIGFuIGVycm9yIGlmIGEgdmFsaWQgdmFsdWUgaXMgbm90IGZvdW5kLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgdGhlIGluZGV4IG9mIGZpcnN0IGNsaWNrIHRoYXQgaGFwcGVucyBvbiBhIERJViBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoZmluZEluZGV4KGV2ID0+IGV2LnRhcmdldC50YWdOYW1lID09PSAnRElWJykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZpbHRlcn1cbiAqIEBzZWUge0BsaW5rIGZpbmR9XG4gKiBAc2VlIHtAbGluayBmaXJzdH1cbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogYm9vbGVhbn0gcHJlZGljYXRlXG4gKiBBIGZ1bmN0aW9uIGNhbGxlZCB3aXRoIGVhY2ggaXRlbSB0byB0ZXN0IGZvciBjb25kaXRpb24gbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge2FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIGFyZ3VtZW50IHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgYHRoaXNgXG4gKiBpbiB0aGUgYHByZWRpY2F0ZWAgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIHRoZSBpbmRleCBvZiB0aGUgZmlyc3QgaXRlbSB0aGF0XG4gKiBtYXRjaGVzIHRoZSBjb25kaXRpb24uXG4gKiBAbWV0aG9kIGZpbmRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kSW5kZXg8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgbnVtYmVyPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRmluZFZhbHVlT3BlcmF0b3IocHJlZGljYXRlLCBzb3VyY2UsIHRydWUsIHRoaXNBcmcpKSBhcyBPYnNlcnZhYmxlPGFueT47XG59XG4iXX0=