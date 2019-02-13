"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var find_1 = require("../operators/find");
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
function findIndex(predicate, thisArg) {
    return function (source) { return source.lift(new find_1.FindValueOperator(predicate, source, true, thisArg)); };
}
exports.findIndex = findIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZEluZGV4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZmluZEluZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsMENBQXNEO0FBRXREOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQ0c7QUFDSCxTQUFnQixTQUFTLENBQUksU0FBc0UsRUFDdEUsT0FBYTtJQUN4QyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSx3QkFBaUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBb0IsRUFBdkYsQ0FBdUYsQ0FBQztBQUM1SCxDQUFDO0FBSEQsOEJBR0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBGaW5kVmFsdWVPcGVyYXRvciB9IGZyb20gJy4uL29wZXJhdG9ycy9maW5kJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG4vKipcbiAqIEVtaXRzIG9ubHkgdGhlIGluZGV4IG9mIHRoZSBmaXJzdCB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0XG4gKiBtZWV0cyBzb21lIGNvbmRpdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBmaW5kfSwgYnV0IGVtaXRzIHRoZSBpbmRleCBvZiB0aGVcbiAqIGZvdW5kIHZhbHVlLCBub3QgdGhlIHZhbHVlIGl0c2VsZi48L3NwYW4+XG4gKlxuICogIVtdKGZpbmRJbmRleC5wbmcpXG4gKlxuICogYGZpbmRJbmRleGAgc2VhcmNoZXMgZm9yIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IG1hdGNoZXNcbiAqIHRoZSBzcGVjaWZpZWQgY29uZGl0aW9uIGVtYm9kaWVkIGJ5IHRoZSBgcHJlZGljYXRlYCwgYW5kIHJldHVybnMgdGhlXG4gKiAoemVyby1iYXNlZCkgaW5kZXggb2YgdGhlIGZpcnN0IG9jY3VycmVuY2UgaW4gdGhlIHNvdXJjZS4gVW5saWtlXG4gKiB7QGxpbmsgZmlyc3R9LCB0aGUgYHByZWRpY2F0ZWAgaXMgcmVxdWlyZWQgaW4gYGZpbmRJbmRleGAsIGFuZCBkb2VzIG5vdCBlbWl0XG4gKiBhbiBlcnJvciBpZiBhIHZhbGlkIHZhbHVlIGlzIG5vdCBmb3VuZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IHRoZSBpbmRleCBvZiBmaXJzdCBjbGljayB0aGF0IGhhcHBlbnMgb24gYSBESVYgZWxlbWVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKGZpbmRJbmRleChldiA9PiBldi50YXJnZXQudGFnTmFtZSA9PT0gJ0RJVicpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmaWx0ZXJ9XG4gKiBAc2VlIHtAbGluayBmaW5kfVxuICogQHNlZSB7QGxpbmsgZmlyc3R9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IGJvb2xlYW59IHByZWRpY2F0ZVxuICogQSBmdW5jdGlvbiBjYWxsZWQgd2l0aCBlYWNoIGl0ZW0gdG8gdGVzdCBmb3IgY29uZGl0aW9uIG1hdGNoaW5nLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBBbiBvcHRpb25hbCBhcmd1bWVudCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIGB0aGlzYFxuICogaW4gdGhlIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiB0aGUgaW5kZXggb2YgdGhlIGZpcnN0IGl0ZW0gdGhhdFxuICogbWF0Y2hlcyB0aGUgY29uZGl0aW9uLlxuICogQG1ldGhvZCBmaW5kXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZEluZGV4PFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNBcmc/OiBhbnkpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIG51bWJlcj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IEZpbmRWYWx1ZU9wZXJhdG9yKHByZWRpY2F0ZSwgc291cmNlLCB0cnVlLCB0aGlzQXJnKSkgYXMgT2JzZXJ2YWJsZTxhbnk+O1xufVxuIl19