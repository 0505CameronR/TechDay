"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reduce_1 = require("./reduce");
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
function max(comparer) {
    var max = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) > 0 ? x : y; }
        : function (x, y) { return x > y ? x : y; };
    return reduce_1.reduce(max);
}
exports.max = max;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21heC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUdsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxTQUFnQixHQUFHLENBQUksUUFBaUM7SUFDdEQsSUFBTSxHQUFHLEdBQXNCLENBQUMsT0FBTyxRQUFRLEtBQUssVUFBVSxDQUFDO1FBQzdELENBQUMsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQTFCLENBQTBCO1FBQ3RDLENBQUMsQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssT0FBQSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBYixDQUFhLENBQUM7SUFFNUIsT0FBTyxlQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQztBQU5ELGtCQU1DIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVkdWNlIH0gZnJvbSAnLi9yZWR1Y2UnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFRoZSBNYXggb3BlcmF0b3Igb3BlcmF0ZXMgb24gYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG51bWJlcnMgKG9yIGl0ZW1zIHRoYXQgY2FuIGJlIGNvbXBhcmVkIHdpdGggYSBwcm92aWRlZCBmdW5jdGlvbiksXG4gKiBhbmQgd2hlbiBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgaXQgZW1pdHMgYSBzaW5nbGUgaXRlbTogdGhlIGl0ZW0gd2l0aCB0aGUgbGFyZ2VzdCB2YWx1ZS5cbiAqXG4gKiAhW10obWF4LnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogR2V0IHRoZSBtYXhpbWFsIHZhbHVlIG9mIGEgc2VyaWVzIG9mIG51bWJlcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDUsIDQsIDcsIDIsIDgpLnBpcGUoXG4gKiAgIG1heCgpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gLT4gOFxuICogYGBgXG4gKlxuICogVXNlIGEgY29tcGFyZXIgZnVuY3Rpb24gdG8gZ2V0IHRoZSBtYXhpbWFsIGl0ZW1cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICBhZ2U6IG51bWJlcixcbiAqICAgbmFtZTogc3RyaW5nXG4gKiB9XG4gKiBvZjxQZXJzb24+KFxuICogICB7YWdlOiA3LCBuYW1lOiAnRm9vJ30sXG4gKiAgIHthZ2U6IDUsIG5hbWU6ICdCYXInfSxcbiAqICAge2FnZTogOSwgbmFtZTogJ0JlZXInfSxcbiAqICkucGlwZShcbiAqICAgbWF4PFBlcnNvbj4oKGE6IFBlcnNvbiwgYjogUGVyc29uKSA9PiBhLmFnZSA8IGIuYWdlID8gLTEgOiAxKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoKHg6IFBlcnNvbikgPT4gY29uc29sZS5sb2coeC5uYW1lKSk7IC8vIC0+ICdCZWVyJ1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWlufVxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtjb21wYXJlcl0gLSBPcHRpb25hbCBjb21wYXJlciBmdW5jdGlvbiB0aGF0IGl0IHdpbGwgdXNlIGluc3RlYWQgb2YgaXRzIGRlZmF1bHQgdG8gY29tcGFyZSB0aGVcbiAqIHZhbHVlIG9mIHR3byBpdGVtcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtIHdpdGggdGhlIGxhcmdlc3QgdmFsdWUuXG4gKiBAbWV0aG9kIG1heFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1heDxUPihjb21wYXJlcj86ICh4OiBULCB5OiBUKSA9PiBudW1iZXIpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICBjb25zdCBtYXg6ICh4OiBULCB5OiBUKSA9PiBUID0gKHR5cGVvZiBjb21wYXJlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICA/ICh4LCB5KSA9PiBjb21wYXJlcih4LCB5KSA+IDAgPyB4IDogeVxuICAgIDogKHgsIHkpID0+IHggPiB5ID8geCA6IHk7XG5cbiAgcmV0dXJuIHJlZHVjZShtYXgpO1xufVxuIl19