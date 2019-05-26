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
 * import { of } from 'rxjs';
 * import { distinctUntilKeyChanged } from 'rxjs/operators';
 *
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
 * import { of } from 'rxjs';
 * import { distinctUntilKeyChanged } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbEtleUNoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3RVbnRpbEtleUNoYW5nZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLG9CQUFvQixFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFNOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxRUc7QUFDSCxNQUFNLFVBQVUsdUJBQXVCLENBQXVCLEdBQU0sRUFBRSxPQUF1QztJQUMzRyxPQUFPLG9CQUFvQixDQUFDLENBQUMsQ0FBSSxFQUFFLENBQUksRUFBRSxFQUFFLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDckcsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGRpc3RpbmN0VW50aWxDaGFuZ2VkIH0gZnJvbSAnLi9kaXN0aW5jdFVudGlsQ2hhbmdlZCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkPFQ+KGtleToga2V5b2YgVCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZDxULCBLIGV4dGVuZHMga2V5b2YgVD4oa2V5OiBLLCBjb21wYXJlOiAoeDogVFtLXSwgeTogVFtLXSkgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgYXJlIGRpc3RpbmN0IGJ5IGNvbXBhcmlzb24gZnJvbSB0aGUgcHJldmlvdXMgaXRlbSxcbiAqIHVzaW5nIGEgcHJvcGVydHkgYWNjZXNzZWQgYnkgdXNpbmcgdGhlIGtleSBwcm92aWRlZCB0byBjaGVjayBpZiB0aGUgdHdvIGl0ZW1zIGFyZSBkaXN0aW5jdC5cbiAqXG4gKiBJZiBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIHRoZW4gaXQgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSB0byB0ZXN0IGZvciB3aGV0aGVyIG9yIG5vdCB0aGF0IHZhbHVlIHNob3VsZCBiZSBlbWl0dGVkLlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQsIGFuIGVxdWFsaXR5IGNoZWNrIGlzIHVzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogQW4gZXhhbXBsZSBjb21wYXJpbmcgdGhlIG5hbWUgb2YgcGVyc29uc1xuICogYGBgdHlwZXNjcmlwdFxuICogaW1wb3J0IHsgb2YgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqICBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgICBhZ2U6IG51bWJlcixcbiAqICAgICBuYW1lOiBzdHJpbmdcbiAqICB9XG4gKlxuICogb2Y8UGVyc29uPihcbiAqICAgICB7IGFnZTogNCwgbmFtZTogJ0Zvbyd9LFxuICogICAgIHsgYWdlOiA3LCBuYW1lOiAnQmFyJ30sXG4gKiAgICAgeyBhZ2U6IDUsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNiwgbmFtZTogJ0Zvbyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoJ25hbWUnKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBhZ2U6IDQsIG5hbWU6ICdGb28nIH1cbiAqIC8vIHsgYWdlOiA3LCBuYW1lOiAnQmFyJyB9XG4gKiAvLyB7IGFnZTogNSwgbmFtZTogJ0ZvbycgfVxuICogYGBgXG4gKlxuICogQW4gZXhhbXBsZSBjb21wYXJpbmcgdGhlIGZpcnN0IGxldHRlcnMgb2YgdGhlIG5hbWVcbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgICBhZ2U6IG51bWJlcixcbiAqICAgICBuYW1lOiBzdHJpbmdcbiAqICB9XG4gKlxuICogb2Y8UGVyc29uPihcbiAqICAgICB7IGFnZTogNCwgbmFtZTogJ0ZvbzEnfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vMid9LFxuICogICAgIHsgYWdlOiA2LCBuYW1lOiAnRm9vMyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbEtleUNoYW5nZWQoJ25hbWUnLCAoeDogc3RyaW5nLCB5OiBzdHJpbmcpID0+IHguc3Vic3RyaW5nKDAsIDMpID09PSB5LnN1YnN0cmluZygwLCAzKSksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgYWdlOiA0LCBuYW1lOiAnRm9vMScgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIC8vIHsgYWdlOiA1LCBuYW1lOiAnRm9vMicgfVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGlzdGluY3R9XG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdFVudGlsQ2hhbmdlZH1cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30ga2V5IFN0cmluZyBrZXkgZm9yIG9iamVjdCBwcm9wZXJ0eSBsb29rdXAgb24gZWFjaCBpdGVtLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBhcmVdIE9wdGlvbmFsIGNvbXBhcmlzb24gZnVuY3Rpb24gY2FsbGVkIHRvIHRlc3QgaWYgYW4gaXRlbSBpcyBkaXN0aW5jdCBmcm9tIHRoZSBwcmV2aW91cyBpdGVtIGluIHRoZSBzb3VyY2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCBkaXN0aW5jdCB2YWx1ZXMgYmFzZWQgb24gdGhlIGtleSBzcGVjaWZpZWQuXG4gKiBAbWV0aG9kIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbEtleUNoYW5nZWQ8VCwgSyBleHRlbmRzIGtleW9mIFQ+KGtleTogSywgY29tcGFyZT86ICh4OiBUW0tdLCB5OiBUW0tdKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCh4OiBULCB5OiBUKSA9PiBjb21wYXJlID8gY29tcGFyZSh4W2tleV0sIHlba2V5XSkgOiB4W2tleV0gPT09IHlba2V5XSk7XG59XG4iXX0=