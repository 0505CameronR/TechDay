import { reduce } from './reduce';
/**
 * The Min operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
 * and when source Observable completes it emits a single item: the item with the smallest value.
 *
 * ![](min.png)
 *
 * ## Examples
 * Get the minimal value of a series of numbers
 * ```javascript
 * of(5, 4, 7, 2, 8).pipe(
 *   min(),
 * )
 * .subscribe(x => console.log(x)); // -> 2
 * ```
 *
 * Use a comparer function to get the minimal item
 * ```typescript
 * interface Person {
 *   age: number,
 *   name: string
 * }
 * of<Person>(
 *   {age: 7, name: 'Foo'},
 *   {age: 5, name: 'Bar'},
 *   {age: 9, name: 'Beer'},
 * ).pipe(
 *   min<Person>( (a: Person, b: Person) => a.age < b.age ? -1 : 1),
 * )
 * .subscribe((x: Person) => console.log(x.name)); // -> 'Bar'
 * ```
 * @see {@link max}
 *
 * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
 * value of two items.
 * @return {Observable<R>} An Observable that emits item with the smallest value.
 * @method min
 * @owner Observable
 */
export function min(comparer) {
    const min = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) < 0 ? x : y
        : (x, y) => x < y ? x : y;
    return reduce(min);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUNHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBSSxRQUFpQztJQUN0RCxNQUFNLEdBQUcsR0FBc0IsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi9yZWR1Y2UnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBNaW4gb3BlcmF0b3Igb3BlcmF0ZXMgb24gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG51bWJlcnMgKG9yIGl0ZW1zIHRoYXQgY2FuIGJlIGNvbXBhcmVkIHdpdGggYSBwcm92aWRlZCBmdW5jdGlvbiksXG4gKiBhbmQgd2hlbiBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgaXQgZW1pdHMgYSBzaW5nbGUgaXRlbTogdGhlIGl0ZW0gd2l0aCB0aGUgc21hbGxlc3QgdmFsdWUuXG4gKlxuICogIVtdKG1pbi5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIEdldCB0aGUgbWluaW1hbCB2YWx1ZSBvZiBhIHNlcmllcyBvZiBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZig1LCA0LCA3LCAyLCA4KS5waXBlKFxuICogICBtaW4oKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIC0+IDJcbiAqIGBgYFxuICpcbiAqIFVzZSBhIGNvbXBhcmVyIGZ1bmN0aW9uIHRvIGdldCB0aGUgbWluaW1hbCBpdGVtXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgYWdlOiBudW1iZXIsXG4gKiAgIG5hbWU6IHN0cmluZ1xuICogfVxuICogb2Y8UGVyc29uPihcbiAqICAge2FnZTogNywgbmFtZTogJ0Zvbyd9LFxuICogICB7YWdlOiA1LCBuYW1lOiAnQmFyJ30sXG4gKiAgIHthZ2U6IDksIG5hbWU6ICdCZWVyJ30sXG4gKiApLnBpcGUoXG4gKiAgIG1pbjxQZXJzb24+KCAoYTogUGVyc29uLCBiOiBQZXJzb24pID0+IGEuYWdlIDwgYi5hZ2UgPyAtMSA6IDEpLFxuICogKVxuICogLnN1YnNjcmliZSgoeDogUGVyc29uKSA9PiBjb25zb2xlLmxvZyh4Lm5hbWUpKTsgLy8gLT4gJ0JhcidcbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgbWF4fVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlcl0gLSBPcHRpb25hbCBjb21wYXJlciBmdW5jdGlvbiB0aGF0IGl0IHdpbGwgdXNlIGluc3RlYWQgb2YgaXRzIGRlZmF1bHQgdG8gY29tcGFyZSB0aGVcbiAqIHZhbHVlIG9mIHR3byBpdGVtcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8Uj59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtIHdpdGggdGhlIHNtYWxsZXN0IHZhbHVlLlxuICogQG1ldGhvZCBtaW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtaW48VD4oY29tcGFyZXI/OiAoeDogVCwgeTogVCkgPT4gbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgY29uc3QgbWluOiAoeDogVCwgeTogVCkgPT4gVCA9ICh0eXBlb2YgY29tcGFyZXIgPT09ICdmdW5jdGlvbicpXG4gICAgPyAoeCwgeSkgPT4gY29tcGFyZXIoeCwgeSkgPCAwID8geCA6IHlcbiAgICA6ICh4LCB5KSA9PiB4IDwgeSA/IHggOiB5O1xuICByZXR1cm4gcmVkdWNlKG1pbik7XG59XG4iXX0=