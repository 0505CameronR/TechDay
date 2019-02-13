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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWluLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvbWluLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsbUNBQWtDO0FBR2xDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUNHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFJLFFBQWlDO0lBQ3RELElBQU0sR0FBRyxHQUFzQixDQUFDLE9BQU8sUUFBUSxLQUFLLFVBQVUsQ0FBQztRQUM3RCxDQUFDLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUExQixDQUEwQjtRQUN0QyxDQUFDLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxDQUFDO0lBQzVCLE9BQU8sZUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUM7QUFMRCxrQkFLQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlZHVjZSB9IGZyb20gJy4vcmVkdWNlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBUaGUgTWluIG9wZXJhdG9yIG9wZXJhdGVzIG9uIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBudW1iZXJzIChvciBpdGVtcyB0aGF0IGNhbiBiZSBjb21wYXJlZCB3aXRoIGEgcHJvdmlkZWQgZnVuY3Rpb24pLFxuICogYW5kIHdoZW4gc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIGl0IGVtaXRzIGEgc2luZ2xlIGl0ZW06IHRoZSBpdGVtIHdpdGggdGhlIHNtYWxsZXN0IHZhbHVlLlxuICpcbiAqICFbXShtaW4ucG5nKVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBHZXQgdGhlIG1pbmltYWwgdmFsdWUgb2YgYSBzZXJpZXMgb2YgbnVtYmVyc1xuICogYGBgamF2YXNjcmlwdFxuICogb2YoNSwgNCwgNywgMiwgOCkucGlwZShcbiAqICAgbWluKCksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpOyAvLyAtPiAyXG4gKiBgYGBcbiAqXG4gKiBVc2UgYSBjb21wYXJlciBmdW5jdGlvbiB0byBnZXQgdGhlIG1pbmltYWwgaXRlbVxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgIGFnZTogbnVtYmVyLFxuICogICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqIG9mPFBlcnNvbj4oXG4gKiAgIHthZ2U6IDcsIG5hbWU6ICdGb28nfSxcbiAqICAge2FnZTogNSwgbmFtZTogJ0Jhcid9LFxuICogICB7YWdlOiA5LCBuYW1lOiAnQmVlcid9LFxuICogKS5waXBlKFxuICogICBtaW48UGVyc29uPiggKGE6IFBlcnNvbiwgYjogUGVyc29uKSA9PiBhLmFnZSA8IGIuYWdlID8gLTEgOiAxKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoKHg6IFBlcnNvbikgPT4gY29uc29sZS5sb2coeC5uYW1lKSk7IC8vIC0+ICdCYXInXG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIG1heH1cbiAqXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBbY29tcGFyZXJdIC0gT3B0aW9uYWwgY29tcGFyZXIgZnVuY3Rpb24gdGhhdCBpdCB3aWxsIHVzZSBpbnN0ZWFkIG9mIGl0cyBkZWZhdWx0IHRvIGNvbXBhcmUgdGhlXG4gKiB2YWx1ZSBvZiB0d28gaXRlbXMuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbSB3aXRoIHRoZSBzbWFsbGVzdCB2YWx1ZS5cbiAqIEBtZXRob2QgbWluXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gbWluPFQ+KGNvbXBhcmVyPzogKHg6IFQsIHk6IFQpID0+IG51bWJlcik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIGNvbnN0IG1pbjogKHg6IFQsIHk6IFQpID0+IFQgPSAodHlwZW9mIGNvbXBhcmVyID09PSAnZnVuY3Rpb24nKVxuICAgID8gKHgsIHkpID0+IGNvbXBhcmVyKHgsIHkpIDwgMCA/IHggOiB5XG4gICAgOiAoeCwgeSkgPT4geCA8IHkgPyB4IDogeTtcbiAgcmV0dXJuIHJlZHVjZShtaW4pO1xufVxuIl19