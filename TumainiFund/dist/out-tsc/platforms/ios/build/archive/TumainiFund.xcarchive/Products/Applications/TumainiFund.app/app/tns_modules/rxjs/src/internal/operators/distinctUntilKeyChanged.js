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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbEtleUNoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsS2V5Q2hhbmdlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtEQUE4RDtBQU05RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStERztBQUNILFNBQWdCLHVCQUF1QixDQUF1QixHQUFNLEVBQUUsT0FBdUM7SUFDM0csT0FBTywyQ0FBb0IsQ0FBQyxVQUFDLENBQUksRUFBRSxDQUFJLElBQUssT0FBQSxPQUFPLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQXJELENBQXFELENBQUMsQ0FBQztBQUNyRyxDQUFDO0FBRkQsMERBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCB9IGZyb20gJy4vZGlzdGluY3RVbnRpbENoYW5nZWQnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZDxUPihrZXk6IGtleW9mIFQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbEtleUNoYW5nZWQ8VCwgSyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgY29tcGFyZTogKHg6IFRbS10sIHk6IFRbS10pID0+IGJvb2xlYW4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFsbCBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IGFyZSBkaXN0aW5jdCBieSBjb21wYXJpc29uIGZyb20gdGhlIHByZXZpb3VzIGl0ZW0sXG4gKiB1c2luZyBhIHByb3BlcnR5IGFjY2Vzc2VkIGJ5IHVzaW5nIHRoZSBrZXkgcHJvdmlkZWQgdG8gY2hlY2sgaWYgdGhlIHR3byBpdGVtcyBhcmUgZGlzdGluY3QuXG4gKlxuICogSWYgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCB0aGVuIGl0IHdpbGwgYmUgY2FsbGVkIGZvciBlYWNoIGl0ZW0gdG8gdGVzdCBmb3Igd2hldGhlciBvciBub3QgdGhhdCB2YWx1ZSBzaG91bGQgYmUgZW1pdHRlZC5cbiAqXG4gKiBJZiBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLCBhbiBlcXVhbGl0eSBjaGVjayBpcyB1c2VkIGJ5IGRlZmF1bHQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIEFuIGV4YW1wbGUgY29tcGFyaW5nIHRoZSBuYW1lIG9mIHBlcnNvbnNcbiAqIGBgYHR5cGVzY3JpcHRcbiAqICBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgICBhZ2U6IG51bWJlcixcbiAqICAgICBuYW1lOiBzdHJpbmdcbiAqICB9XG4gKlxuICogb2Y8UGVyc29uPihcbiAqICAgICB7IGFnZTogNCwgbmFtZTogJ0Zvbyd9LFxuICogICAgIHsgYWdlOiA3LCBuYW1lOiAnQmFyJ30sXG4gKiAgICAgeyBhZ2U6IDUsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNiwgbmFtZTogJ0Zvbyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoJ25hbWUnKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBhZ2U6IDQsIG5hbWU6ICdGb28nIH1cbiAqIC8vIHsgYWdlOiA3LCBuYW1lOiAnQmFyJyB9XG4gKiAvLyB7IGFnZTogNSwgbmFtZTogJ0ZvbycgfVxuICogYGBgXG4gKlxuICogQW4gZXhhbXBsZSBjb21wYXJpbmcgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlIG5hbWVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICAgIGFnZTogbnVtYmVyLFxuICogICAgIG5hbWU6IHN0cmluZ1xuICogIH1cbiAqXG4gKiBvZjxQZXJzb24+KFxuICogICAgIHsgYWdlOiA0LCBuYW1lOiAnRm9vMSd9LFxuICogICAgIHsgYWdlOiA3LCBuYW1lOiAnQmFyJ30sXG4gKiAgICAgeyBhZ2U6IDUsIG5hbWU6ICdGb28yJ30sXG4gKiAgICAgeyBhZ2U6IDYsIG5hbWU6ICdGb28zJ30sXG4gKiAgICkucGlwZShcbiAqICAgICBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCgnbmFtZScsICh4OiBzdHJpbmcsIHk6IHN0cmluZykgPT4geC5zdWJzdHJpbmcoMCwgMykgPT09IHkuc3Vic3RyaW5nKDAsIDMpKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBhZ2U6IDQsIG5hbWU6ICdGb28xJyB9XG4gKiAvLyB7IGFnZTogNywgbmFtZTogJ0JhcicgfVxuICogLy8geyBhZ2U6IDUsIG5hbWU6ICdGb28yJyB9XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdH1cbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0VW50aWxDaGFuZ2VkfVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBrZXkgU3RyaW5nIGtleSBmb3Igb2JqZWN0IHByb3BlcnR5IGxvb2t1cCBvbiBlYWNoIGl0ZW0uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29tcGFyZV0gT3B0aW9uYWwgY29tcGFyaXNvbiBmdW5jdGlvbiBjYWxsZWQgdG8gdGVzdCBpZiBhbiBpdGVtIGlzIGRpc3RpbmN0IGZyb20gdGhlIHByZXZpb3VzIGl0ZW0gaW4gdGhlIHNvdXJjZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIGRpc3RpbmN0IHZhbHVlcyBiYXNlZCBvbiB0aGUga2V5IHNwZWNpZmllZC5cbiAqIEBtZXRob2QgZGlzdGluY3RVbnRpbEtleUNoYW5nZWRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZDxULCBLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLLCBjb21wYXJlPzogKHg6IFRbS10sIHk6IFRbS10pID0+IGJvb2xlYW4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZGlzdGluY3RVbnRpbENoYW5nZWQoKHg6IFQsIHk6IFQpID0+IGNvbXBhcmUgPyBjb21wYXJlKHhba2V5XSwgeVtrZXldKSA6IHhba2V5XSA9PT0geVtrZXldKTtcbn1cbiJdfQ==