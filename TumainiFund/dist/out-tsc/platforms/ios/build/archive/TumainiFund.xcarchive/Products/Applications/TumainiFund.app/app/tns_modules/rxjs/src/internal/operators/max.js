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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF4LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvbWF4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILFNBQWdCLEdBQUcsQ0FBSSxRQUFpQztJQUN0RCxJQUFNLEdBQUcsR0FBc0IsQ0FBQyxPQUFPLFFBQVEsS0FBSyxVQUFVLENBQUM7UUFDN0QsQ0FBQyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLFFBQVEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBMUIsQ0FBMEI7UUFDdEMsQ0FBQyxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSyxPQUFBLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFiLENBQWEsQ0FBQztJQUU1QixPQUFPLGVBQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDO0FBTkQsa0JBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZWR1Y2UgfSBmcm9tICcuL3JlZHVjZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogVGhlIE1heCBvcGVyYXRvciBvcGVyYXRlcyBvbiBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgbnVtYmVycyAob3IgaXRlbXMgdGhhdCBjYW4gYmUgY29tcGFyZWQgd2l0aCBhIHByb3ZpZGVkIGZ1bmN0aW9uKSxcbiAqIGFuZCB3aGVuIHNvdXJjZSBPYnNlcnZhYmxlIGNvbXBsZXRlcyBpdCBlbWl0cyBhIHNpbmdsZSBpdGVtOiB0aGUgaXRlbSB3aXRoIHRoZSBsYXJnZXN0IHZhbHVlLlxuICpcbiAqICFbXShtYXgucG5nKVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBHZXQgdGhlIG1heGltYWwgdmFsdWUgb2YgYSBzZXJpZXMgb2YgbnVtYmVyc1xuICogYGBgamF2YXNjcmlwdFxuICogb2YoNSwgNCwgNywgMiwgOCkucGlwZShcbiAqICAgbWF4KCksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpOyAvLyAtPiA4XG4gKiBgYGBcbiAqXG4gKiBVc2UgYSBjb21wYXJlciBmdW5jdGlvbiB0byBnZXQgdGhlIG1heGltYWwgaXRlbVxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgIGFnZTogbnVtYmVyLFxuICogICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqIG9mPFBlcnNvbj4oXG4gKiAgIHthZ2U6IDcsIG5hbWU6ICdGb28nfSxcbiAqICAge2FnZTogNSwgbmFtZTogJ0Jhcid9LFxuICogICB7YWdlOiA5LCBuYW1lOiAnQmVlcid9LFxuICogKS5waXBlKFxuICogICBtYXg8UGVyc29uPigoYTogUGVyc29uLCBiOiBQZXJzb24pID0+IGEuYWdlIDwgYi5hZ2UgPyAtMSA6IDEpLFxuICogKVxuICogLnN1YnNjcmliZSgoeDogUGVyc29uKSA9PiBjb25zb2xlLmxvZyh4Lm5hbWUpKTsgLy8gLT4gJ0JlZXInXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtaW59XG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW2NvbXBhcmVyXSAtIE9wdGlvbmFsIGNvbXBhcmVyIGZ1bmN0aW9uIHRoYXQgaXQgd2lsbCB1c2UgaW5zdGVhZCBvZiBpdHMgZGVmYXVsdCB0byBjb21wYXJlIHRoZVxuICogdmFsdWUgb2YgdHdvIGl0ZW1zLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW0gd2l0aCB0aGUgbGFyZ2VzdCB2YWx1ZS5cbiAqIEBtZXRob2QgbWF4XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWF4PFQ+KGNvbXBhcmVyPzogKHg6IFQsIHk6IFQpID0+IG51bWJlcik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGNvbnN0IG1heDogKHg6IFQsIHk6IFQpID0+IFQgPSAodHlwZW9mIGNvbXBhcmVyID09PSAnZnVuY3Rpb24nKVxuICAgID8gKHgsIHkpID0+IGNvbXBhcmVyKHgsIHkpID4gMCA/IHggOiB5XG4gICAgOiAoeCwgeSkgPT4geCA+IHkgPyB4IDogeTtcblxuICByZXR1cm4gcmVkdWNlKG1heCk7XG59XG4iXX0=