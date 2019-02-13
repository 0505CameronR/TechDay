import { reduce } from './reduce';
/**
 * The Max operator operates on an Observable that emits numbers (or items that can be compared with a provided function),
 * and when source Observable completes it emits a single item: the item with the largest value.
 *
 * ![](max.png)
 *
 * ## Examples
 * Get the maximal value of a series of numbers
 * ```javascript
 * of(5, 4, 7, 2, 8).pipe(
 *   max(),
 * )
 * .subscribe(x => console.log(x)); // -> 8
 * ```
 *
 * Use a comparer function to get the maximal item
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
 *   max<Person>((a: Person, b: Person) => a.age < b.age ? -1 : 1),
 * )
 * .subscribe((x: Person) => console.log(x.name)); // -> 'Beer'
 * ```
 *
 * @see {@link min}
 *
 * @param {Function} [comparer] - Optional comparer function that it will use instead of its default to compare the
 * value of two items.
 * @return {Observable} An Observable that emits item with the largest value.
 * @method max
 * @owner Observable
 */
export function max(comparer) {
    const max = (typeof comparer === 'function')
        ? (x, y) => comparer(x, y) > 0 ? x : y
        : (x, y) => x > y ? x : y;
    return reduce(max);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21heC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUksUUFBaUM7SUFDdEQsTUFBTSxHQUFHLEdBQXNCLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgTWF4IG9wZXJhdG9yIG9wZXJhdGVzIG9uIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBudW1iZXJzIChvciBpdGVtcyB0aGF0IGNhbiBiZSBjb21wYXJlZCB3aXRoIGEgcHJvdmlkZWQgZnVuY3Rpb24pLFxuICogYW5kIHdoZW4gc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIGl0IGVtaXRzIGEgc2luZ2xlIGl0ZW06IHRoZSBpdGVtIHdpdGggdGhlIGxhcmdlc3QgdmFsdWUuXG4gKlxuICogIVtdKG1heC5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIEdldCB0aGUgbWF4aW1hbCB2YWx1ZSBvZiBhIHNlcmllcyBvZiBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZig1LCA0LCA3LCAyLCA4KS5waXBlKFxuICogICBtYXgoKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIC0+IDhcbiAqIGBgYFxuICpcbiAqIFVzZSBhIGNvbXBhcmVyIGZ1bmN0aW9uIHRvIGdldCB0aGUgbWF4aW1hbCBpdGVtXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgYWdlOiBudW1iZXIsXG4gKiAgIG5hbWU6IHN0cmluZ1xuICogfVxuICogb2Y8UGVyc29uPihcbiAqICAge2FnZTogNywgbmFtZTogJ0Zvbyd9LFxuICogICB7YWdlOiA1LCBuYW1lOiAnQmFyJ30sXG4gKiAgIHthZ2U6IDksIG5hbWU6ICdCZWVyJ30sXG4gKiApLnBpcGUoXG4gKiAgIG1heDxQZXJzb24+KChhOiBQZXJzb24sIGI6IFBlcnNvbikgPT4gYS5hZ2UgPCBiLmFnZSA/IC0xIDogMSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKCh4OiBQZXJzb24pID0+IGNvbnNvbGUubG9nKHgubmFtZSkpOyAvLyAtPiAnQmVlcidcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1pbn1cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyZXJdIC0gT3B0aW9uYWwgY29tcGFyZXIgZnVuY3Rpb24gdGhhdCBpdCB3aWxsIHVzZSBpbnN0ZWFkIG9mIGl0cyBkZWZhdWx0IHRvIGNvbXBhcmUgdGhlXG4gKiB2YWx1ZSBvZiB0d28gaXRlbXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbSB3aXRoIHRoZSBsYXJnZXN0IHZhbHVlLlxuICogQG1ldGhvZCBtYXhcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXg8VD4oY29tcGFyZXI/OiAoeDogVCwgeTogVCkgPT4gbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgY29uc3QgbWF4OiAoeDogVCwgeTogVCkgPT4gVCA9ICh0eXBlb2YgY29tcGFyZXIgPT09ICdmdW5jdGlvbicpXG4gICAgPyAoeCwgeSkgPT4gY29tcGFyZXIoeCwgeSkgPiAwID8geCA6IHlcbiAgICA6ICh4LCB5KSA9PiB4ID4geSA/IHggOiB5O1xuXG4gIHJldHVybiByZWR1Y2UobWF4KTtcbn1cbiJdfQ==