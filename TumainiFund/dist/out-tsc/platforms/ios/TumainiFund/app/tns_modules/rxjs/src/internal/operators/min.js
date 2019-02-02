"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var reduce_1 = require("./reduce");
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
function min(comparer) {
    var min = (typeof comparer === 'function')
        ? function (x, y) { return comparer(x, y) < 0 ? x : y; }
        : function (x, y) { return x < y ? x : y; };
    return reduce_1.reduce(min);
}
exports.min = min;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21pbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFrQztBQUdsQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUNILFNBQWdCLEdBQUcsQ0FBSSxRQUFpQztJQUN0RCxJQUFNLEdBQUcsR0FBc0IsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7UUFDN0QsQ0FBQyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBMUIsQ0FBMEI7UUFDdEMsQ0FBQyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQztJQUM1QixPQUFPLGVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBTEQsa0JBS0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogVGhlIE1pbiBvcGVyYXRvciBvcGVyYXRlcyBvbiBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbnVtYmVycyAob3IgaXRlbXMgdGhhdCBjYW4gYmUgY29tcGFyZWQgd2l0aCBhIHByb3ZpZGVkIGZ1bmN0aW9uKSxcbiAqIGFuZCB3aGVuIHNvdXJjZSBPYnNlcnZhYmxlIGNvbXBsZXRlcyBpdCBlbWl0cyBhIHNpbmdsZSBpdGVtOiB0aGUgaXRlbSB3aXRoIHRoZSBzbWFsbGVzdCB2YWx1ZS5cbiAqXG4gKiAhW10obWluLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogR2V0IHRoZSBtaW5pbWFsIHZhbHVlIG9mIGEgc2VyaWVzIG9mIG51bWJlcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDUsIDQsIDcsIDIsIDgpLnBpcGUoXG4gKiAgIG1pbigpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gLT4gMlxuICogYGBgXG4gKlxuICogVXNlIGEgY29tcGFyZXIgZnVuY3Rpb24gdG8gZ2V0IHRoZSBtaW5pbWFsIGl0ZW1cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICBhZ2U6IG51bWJlcixcbiAqICAgbmFtZTogc3RyaW5nXG4gKiB9XG4gKiBvZjxQZXJzb24+KFxuICogICB7YWdlOiA3LCBuYW1lOiAnRm9vJ30sXG4gKiAgIHthZ2U6IDUsIG5hbWU6ICdCYXInfSxcbiAqICAge2FnZTogOSwgbmFtZTogJ0JlZXInfSxcbiAqICkucGlwZShcbiAqICAgbWluPFBlcnNvbj4oIChhOiBQZXJzb24sIGI6IFBlcnNvbikgPT4gYS5hZ2UgPCBiLmFnZSA/IC0xIDogMSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKCh4OiBQZXJzb24pID0+IGNvbnNvbGUubG9nKHgubmFtZSkpOyAvLyAtPiAnQmFyJ1xuICogYGBgXG4gKiBAc2VlIHtAbGluayBtYXh9XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmVyXSAtIE9wdGlvbmFsIGNvbXBhcmVyIGZ1bmN0aW9uIHRoYXQgaXQgd2lsbCB1c2UgaW5zdGVhZCBvZiBpdHMgZGVmYXVsdCB0byBjb21wYXJlIHRoZVxuICogdmFsdWUgb2YgdHdvIGl0ZW1zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxSPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW0gd2l0aCB0aGUgc21hbGxlc3QgdmFsdWUuXG4gKiBAbWV0aG9kIG1pblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1pbjxUPihjb21wYXJlcj86ICh4OiBULCB5OiBUKSA9PiBudW1iZXIpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICBjb25zdCBtaW46ICh4OiBULCB5OiBUKSA9PiBUID0gKHR5cGVvZiBjb21wYXJlciA9PT0gJ2Z1bmN0aW9uJylcbiAgICA/ICh4LCB5KSA9PiBjb21wYXJlcih4LCB5KSA8IDAgPyB4IDogeVxuICAgIDogKHgsIHkpID0+IHggPCB5ID8geCA6IHk7XG4gIHJldHVybiByZWR1Y2UobWluKTtcbn1cbiJdfQ==