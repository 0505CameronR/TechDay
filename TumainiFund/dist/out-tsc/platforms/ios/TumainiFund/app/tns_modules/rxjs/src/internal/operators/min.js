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
 * import { of } from 'rxjs';
 * import { min } from 'rxjs/operators';
 *
 * of(5, 4, 7, 2, 8).pipe(
 *   min(),
 * )
 * .subscribe(x => console.log(x)); // -> 2
 * ```
 *
 * Use a comparer function to get the minimal item
 * ```typescript
 * import { of } from 'rxjs';
 * import { min } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsTUFBTSxVQUFVLEdBQUcsQ0FBSSxRQUFpQztJQUN0RCxNQUFNLEdBQUcsR0FBc0IsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7UUFDN0QsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUM1QixPQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi9yZWR1Y2UnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBNaW4gb3BlcmF0b3Igb3BlcmF0ZXMgb24gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG51bWJlcnMgKG9yIGl0ZW1zIHRoYXQgY2FuIGJlIGNvbXBhcmVkIHdpdGggYSBwcm92aWRlZCBmdW5jdGlvbiksXG4gKiBhbmQgd2hlbiBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgaXQgZW1pdHMgYSBzaW5nbGUgaXRlbTogdGhlIGl0ZW0gd2l0aCB0aGUgc21hbGxlc3QgdmFsdWUuXG4gKlxuICogIVtdKG1pbi5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIEdldCB0aGUgbWluaW1hbCB2YWx1ZSBvZiBhIHNlcmllcyBvZiBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWluIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIG9mKDUsIDQsIDcsIDIsIDgpLnBpcGUoXG4gKiAgIG1pbigpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gLT4gMlxuICogYGBgXG4gKlxuICogVXNlIGEgY29tcGFyZXIgZnVuY3Rpb24gdG8gZ2V0IHRoZSBtaW5pbWFsIGl0ZW1cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtaW4gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgIGFnZTogbnVtYmVyLFxuICogICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqIG9mPFBlcnNvbj4oXG4gKiAgIHthZ2U6IDcsIG5hbWU6ICdGb28nfSxcbiAqICAge2FnZTogNSwgbmFtZTogJ0Jhcid9LFxuICogICB7YWdlOiA5LCBuYW1lOiAnQmVlcid9LFxuICogKS5waXBlKFxuICogICBtaW48UGVyc29uPiggKGE6IFBlcnNvbiwgYjogUGVyc29uKSA9PiBhLmFnZSA8IGIuYWdlID8gLTEgOiAxKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoKHg6IFBlcnNvbikgPT4gY29uc29sZS5sb2coeC5uYW1lKSk7IC8vIC0+ICdCYXInXG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIG1heH1cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyZXJdIC0gT3B0aW9uYWwgY29tcGFyZXIgZnVuY3Rpb24gdGhhdCBpdCB3aWxsIHVzZSBpbnN0ZWFkIG9mIGl0cyBkZWZhdWx0IHRvIGNvbXBhcmUgdGhlXG4gKiB2YWx1ZSBvZiB0d28gaXRlbXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbSB3aXRoIHRoZSBzbWFsbGVzdCB2YWx1ZS5cbiAqIEBtZXRob2QgbWluXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWluPFQ+KGNvbXBhcmVyPzogKHg6IFQsIHk6IFQpID0+IG51bWJlcik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGNvbnN0IG1pbjogKHg6IFQsIHk6IFQpID0+IFQgPSAodHlwZW9mIGNvbXBhcmVyID09PSAnZnVuY3Rpb24nKVxuICAgID8gKHgsIHkpID0+IGNvbXBhcmVyKHgsIHkpIDwgMCA/IHggOiB5XG4gICAgOiAoeCwgeSkgPT4geCA8IHkgPyB4IDogeTtcbiAgcmV0dXJuIHJlZHVjZShtaW4pO1xufVxuIl19