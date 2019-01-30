"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var distinctUntilChanged_1 = require("./distinctUntilChanged");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item,
 * using a property accessed by using the key provided to check if the two items are distinct.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * ## Examples
 * An example comparing the name of persons
 * ```typescript
 *  interface Person {
 *     age: number,
 *     name: string
 *  }
 *
 * of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'},
 *     { age: 6, name: 'Foo'},
 *   ).pipe(
 *     distinctUntilKeyChanged('name'),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 * ```
 *
 * An example comparing the first letters of the name
 * ```typescript
 * interface Person {
 *     age: number,
 *     name: string
 *  }
 *
 * of<Person>(
 *     { age: 4, name: 'Foo1'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo2'},
 *     { age: 6, name: 'Foo3'},
 *   ).pipe(
 *     distinctUntilKeyChanged('name', (x: string, y: string) => x.substring(0, 3) === y.substring(0, 3)),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo1' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo2' }
 * ```
 *
 * @see {@link distinct}
 * @see {@link distinctUntilChanged}
 *
 * @param {string} key String key for object property lookup on each item.
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values based on the key specified.
 * @method distinctUntilKeyChanged
 * @owner Observable
 */
function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged_1.distinctUntilChanged(function (x, y) { return compare ? compare(x[key], y[key]) : x[key] === y[key]; });
}
exports.distinctUntilKeyChanged = distinctUntilKeyChanged;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbEtleUNoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3RVbnRpbEtleUNoYW5nZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrREFBOEQ7QUFNOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErREc7QUFDSCxTQUFnQix1QkFBdUIsQ0FBdUIsR0FBTSxFQUFFLE9BQXVDO0lBQzNHLE9BQU8sMkNBQW9CLENBQUMsVUFBQyxDQUFJLEVBQUUsQ0FBSSxJQUFLLE9BQUEsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFyRCxDQUFxRCxDQUFDLENBQUM7QUFDckcsQ0FBQztBQUZELDBEQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICcuL2Rpc3RpbmN0VW50aWxDaGFuZ2VkJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbEtleUNoYW5nZWQ8VD4oa2V5OiBrZXlvZiBUKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkPFQsIEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEssIGNvbXBhcmU6ICh4OiBUW0tdLCB5OiBUW0tdKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbGwgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBhcmUgZGlzdGluY3QgYnkgY29tcGFyaXNvbiBmcm9tIHRoZSBwcmV2aW91cyBpdGVtLFxuICogdXNpbmcgYSBwcm9wZXJ0eSBhY2Nlc3NlZCBieSB1c2luZyB0aGUga2V5IHByb3ZpZGVkIHRvIGNoZWNrIGlmIHRoZSB0d28gaXRlbXMgYXJlIGRpc3RpbmN0LlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBwcm92aWRlZCwgdGhlbiBpdCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIHRvIHRlc3QgZm9yIHdoZXRoZXIgb3Igbm90IHRoYXQgdmFsdWUgc2hvdWxkIGJlIGVtaXR0ZWQuXG4gKlxuICogSWYgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGlzIG5vdCBwcm92aWRlZCwgYW4gZXF1YWxpdHkgY2hlY2sgaXMgdXNlZCBieSBkZWZhdWx0LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBBbiBleGFtcGxlIGNvbXBhcmluZyB0aGUgbmFtZSBvZiBwZXJzb25zXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiAgaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICAgYWdlOiBudW1iZXIsXG4gKiAgICAgbmFtZTogc3RyaW5nXG4gKiAgfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDYsIG5hbWU6ICdGb28nfSxcbiAqICAgKS5waXBlKFxuICogICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCduYW1lJyksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgYWdlOiA0LCBuYW1lOiAnRm9vJyB9XG4gKiAvLyB7IGFnZTogNywgbmFtZTogJ0JhcicgfVxuICogLy8geyBhZ2U6IDUsIG5hbWU6ICdGb28nIH1cbiAqIGBgYFxuICpcbiAqIEFuIGV4YW1wbGUgY29tcGFyaW5nIHRoZSBmaXJzdCBsZXR0ZXJzIG9mIHRoZSBuYW1lXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgICBhZ2U6IG51bWJlcixcbiAqICAgICBuYW1lOiBzdHJpbmdcbiAqICB9XG4gKlxuICogb2Y8UGVyc29uPihcbiAqICAgICB7IGFnZTogNCwgbmFtZTogJ0ZvbzEnfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vMid9LFxuICogICAgIHsgYWdlOiA2LCBuYW1lOiAnRm9vMyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoJ25hbWUnLCAoeDogc3RyaW5nLCB5OiBzdHJpbmcpID0+IHguc3Vic3RyaW5nKDAsIDMpID09PSB5LnN1YnN0cmluZygwLCAzKSksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgYWdlOiA0LCBuYW1lOiAnRm9vMScgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIC8vIHsgYWdlOiA1LCBuYW1lOiAnRm9vMicgfVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGlzdGluY3R9XG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdFVudGlsQ2hhbmdlZH1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZm9yIG9iamVjdCBwcm9wZXJ0eSBsb29rdXAgb24gZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBhcmVdIE9wdGlvbmFsIGNvbXBhcmlzb24gZnVuY3Rpb24gY2FsbGVkIHRvIHRlc3QgaWYgYW4gaXRlbSBpcyBkaXN0aW5jdCBmcm9tIHRoZSBwcmV2aW91cyBpdGVtIGluIHRoZSBzb3VyY2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCBkaXN0aW5jdCB2YWx1ZXMgYmFzZWQgb24gdGhlIGtleSBzcGVjaWZpZWQuXG4gKiBAbWV0aG9kIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbEtleUNoYW5nZWQ8VCwgSyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgY29tcGFyZT86ICh4OiBUW0tdLCB5OiBUW0tdKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4OiBULCB5OiBUKSA9PiBjb21wYXJlID8gY29tcGFyZSh4W2tleV0sIHlba2V5XSkgOiB4W2tleV0gPT09IHlba2V5XSk7XG59XG4iXX0=