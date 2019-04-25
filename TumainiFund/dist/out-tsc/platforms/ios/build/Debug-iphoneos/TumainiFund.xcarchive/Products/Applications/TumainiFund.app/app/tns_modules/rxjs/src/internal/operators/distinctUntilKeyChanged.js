import { distinctUntilChanged } from './distinctUntilChanged';
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
export function distinctUntilKeyChanged(key, compare) {
    return distinctUntilChanged((x, y) => compare ? compare(x[key], y[key]) : x[key] === y[key]);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbEtleUNoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3RVbnRpbEtleUNoYW5nZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErREc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQXVCLEdBQU0sRUFBRSxPQUF1QztJQUMzRyxPQUFPLG9CQUFvQixDQUFDLENBQUMsQ0FBSSxFQUFFLENBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAnLi9kaXN0aW5jdFVudGlsQ2hhbmdlZCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkPFQ+KGtleToga2V5b2YgVCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZDxULCBLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLLCBjb21wYXJlOiAoeDogVFtLXSwgeTogVFtLXSkgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgYXJlIGRpc3RpbmN0IGJ5IGNvbXBhcmlzb24gZnJvbSB0aGUgcHJldmlvdXMgaXRlbSxcbiAqIHVzaW5nIGEgcHJvcGVydHkgYWNjZXNzZWQgYnkgdXNpbmcgdGhlIGtleSBwcm92aWRlZCB0byBjaGVjayBpZiB0aGUgdHdvIGl0ZW1zIGFyZSBkaXN0aW5jdC5cbiAqXG4gKiBJZiBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIHRoZW4gaXQgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSB0byB0ZXN0IGZvciB3aGV0aGVyIG9yIG5vdCB0aGF0IHZhbHVlIHNob3VsZCBiZSBlbWl0dGVkLlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQsIGFuIGVxdWFsaXR5IGNoZWNrIGlzIHVzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogQW4gZXhhbXBsZSBjb21wYXJpbmcgdGhlIG5hbWUgb2YgcGVyc29uc1xuICogYGBgdHlwZXNjcmlwdFxuICogIGludGVyZmFjZSBQZXJzb24ge1xuICogICAgIGFnZTogbnVtYmVyLFxuICogICAgIG5hbWU6IHN0cmluZ1xuICogIH1cbiAqXG4gKiBvZjxQZXJzb24+KFxuICogICAgIHsgYWdlOiA0LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDcsIG5hbWU6ICdCYXInfSxcbiAqICAgICB7IGFnZTogNSwgbmFtZTogJ0Zvbyd9LFxuICogICAgIHsgYWdlOiA2LCBuYW1lOiAnRm9vJ30sXG4gKiAgICkucGlwZShcbiAqICAgICBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCgnbmFtZScpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbycgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIC8vIHsgYWdlOiA1LCBuYW1lOiAnRm9vJyB9XG4gKiBgYGBcbiAqXG4gKiBBbiBleGFtcGxlIGNvbXBhcmluZyB0aGUgZmlyc3QgbGV0dGVycyBvZiB0aGUgbmFtZVxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICAgYWdlOiBudW1iZXIsXG4gKiAgICAgbmFtZTogc3RyaW5nXG4gKiAgfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28xJ30sXG4gKiAgICAgeyBhZ2U6IDcsIG5hbWU6ICdCYXInfSxcbiAqICAgICB7IGFnZTogNSwgbmFtZTogJ0ZvbzInfSxcbiAqICAgICB7IGFnZTogNiwgbmFtZTogJ0ZvbzMnfSxcbiAqICAgKS5waXBlKFxuICogICAgIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkKCduYW1lJywgKHg6IHN0cmluZywgeTogc3RyaW5nKSA9PiB4LnN1YnN0cmluZygwLCAzKSA9PT0geS5zdWJzdHJpbmcoMCwgMykpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbzEnIH1cbiAqIC8vIHsgYWdlOiA3LCBuYW1lOiAnQmFyJyB9XG4gKiAvLyB7IGFnZTogNSwgbmFtZTogJ0ZvbzInIH1cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0fVxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbENoYW5nZWR9XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSBTdHJpbmcga2V5IGZvciBvYmplY3QgcHJvcGVydHkgbG9va3VwIG9uIGVhY2ggaXRlbS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wYXJlXSBPcHRpb25hbCBjb21wYXJpc29uIGZ1bmN0aW9uIGNhbGxlZCB0byB0ZXN0IGlmIGFuIGl0ZW0gaXMgZGlzdGluY3QgZnJvbSB0aGUgcHJldmlvdXMgaXRlbSBpbiB0aGUgc291cmNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggZGlzdGluY3QgdmFsdWVzIGJhc2VkIG9uIHRoZSBrZXkgc3BlY2lmaWVkLlxuICogQG1ldGhvZCBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkPFQsIEsgZXh0ZW5kcyBrZXlvZiBUPihrZXk6IEssIGNvbXBhcmU/OiAoeDogVFtLXSwgeTogVFtLXSkgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBkaXN0aW5jdFVudGlsQ2hhbmdlZCgoeDogVCwgeTogVCkgPT4gY29tcGFyZSA/IGNvbXBhcmUoeFtrZXldLCB5W2tleV0pIDogeFtrZXldID09PSB5W2tleV0pO1xufVxuIl19