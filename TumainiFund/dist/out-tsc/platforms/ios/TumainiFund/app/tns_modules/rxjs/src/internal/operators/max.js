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
 * import { of } from 'rxjs';
 * import { max } from 'rxjs/operators';
 *
 * of(5, 4, 7, 2, 8).pipe(
 *   max(),
 * )
 * .subscribe(x => console.log(x)); // -> 8
 * ```
 *
 * Use a comparer function to get the maximal item
 * ```typescript
 * import { of } from 'rxjs';
 * import { max } from 'rxjs/operators';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21heC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQUksUUFBaUM7SUFDdEQsTUFBTSxHQUFHLEdBQXNCLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFFNUIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgTWF4IG9wZXJhdG9yIG9wZXJhdGVzIG9uIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBudW1iZXJzIChvciBpdGVtcyB0aGF0IGNhbiBiZSBjb21wYXJlZCB3aXRoIGEgcHJvdmlkZWQgZnVuY3Rpb24pLFxuICogYW5kIHdoZW4gc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIGl0IGVtaXRzIGEgc2luZ2xlIGl0ZW06IHRoZSBpdGVtIHdpdGggdGhlIGxhcmdlc3QgdmFsdWUuXG4gKlxuICogIVtdKG1heC5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIEdldCB0aGUgbWF4aW1hbCB2YWx1ZSBvZiBhIHNlcmllcyBvZiBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWF4IH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIG9mKDUsIDQsIDcsIDIsIDgpLnBpcGUoXG4gKiAgIG1heCgpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gLT4gOFxuICogYGBgXG4gKlxuICogVXNlIGEgY29tcGFyZXIgZnVuY3Rpb24gdG8gZ2V0IHRoZSBtYXhpbWFsIGl0ZW1cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtYXggfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgIGFnZTogbnVtYmVyLFxuICogICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqIG9mPFBlcnNvbj4oXG4gKiAgIHthZ2U6IDcsIG5hbWU6ICdGb28nfSxcbiAqICAge2FnZTogNSwgbmFtZTogJ0Jhcid9LFxuICogICB7YWdlOiA5LCBuYW1lOiAnQmVlcid9LFxuICogKS5waXBlKFxuICogICBtYXg8UGVyc29uPigoYTogUGVyc29uLCBiOiBQZXJzb24pID0+IGEuYWdlIDwgYi5hZ2UgPyAtMSA6IDEpLFxuICogKVxuICogLnN1YnNjcmliZSgoeDogUGVyc29uKSA9PiBjb25zb2xlLmxvZyh4Lm5hbWUpKTsgLy8gLT4gJ0JlZXInXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtaW59XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmVyXSAtIE9wdGlvbmFsIGNvbXBhcmVyIGZ1bmN0aW9uIHRoYXQgaXQgd2lsbCB1c2UgaW5zdGVhZCBvZiBpdHMgZGVmYXVsdCB0byBjb21wYXJlIHRoZVxuICogdmFsdWUgb2YgdHdvIGl0ZW1zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW0gd2l0aCB0aGUgbGFyZ2VzdCB2YWx1ZS5cbiAqIEBtZXRob2QgbWF4XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4PFQ+KGNvbXBhcmVyPzogKHg6IFQsIHk6IFQpID0+IG51bWJlcik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGNvbnN0IG1heDogKHg6IFQsIHk6IFQpID0+IFQgPSAodHlwZW9mIGNvbXBhcmVyID09PSAnZnVuY3Rpb24nKVxuICAgID8gKHgsIHkpID0+IGNvbXBhcmVyKHgsIHkpID4gMCA/IHggOiB5XG4gICAgOiAoeCwgeSkgPT4geCA+IHkgPyB4IDogeTtcblxuICByZXR1cm4gcmVkdWNlKG1heCk7XG59XG4iXX0=