import { Subscriber } from '../Subscriber';
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * ## Example
 * A simple example with numbers
 * ```javascript
 * import { of } from 'rxjs';
 * import { distinctUntilChanged } from 'rxjs/operators';
 *
 * of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4).pipe(
 *     distinctUntilChanged(),
 *   )
 *   .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4
 * ```
 *
 * An example using a compare function
 * ```typescript
 * import { of } from 'rxjs';
 * import { distinctUntilChanged } from 'rxjs/operators';
 *
 * interface Person {
 *    age: number,
 *    name: string
 * }
 *
 * of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'},
 *     { age: 6, name: 'Foo'},
 *   ).pipe(
 *     distinctUntilChanged((p: Person, q: Person) => p.name === q.name),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 * ```
 *
 * @see {@link distinct}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
export function distinctUntilChanged(compare, keySelector) {
    return (source) => source.lift(new DistinctUntilChangedOperator(compare, keySelector));
}
class DistinctUntilChangedOperator {
    constructor(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    call(subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DistinctUntilChangedSubscriber extends Subscriber {
    constructor(destination, compare, keySelector) {
        super(destination);
        this.keySelector = keySelector;
        this.hasKey = false;
        if (typeof compare === 'function') {
            this.compare = compare;
        }
    }
    compare(x, y) {
        return x === y;
    }
    _next(value) {
        let key;
        try {
            const { keySelector } = this;
            key = keySelector ? keySelector(value) : value;
        }
        catch (err) {
            return this.destination.error(err);
        }
        let result = false;
        if (this.hasKey) {
            try {
                const { compare } = this;
                result = compare(this.key, key);
            }
            catch (err) {
                return this.destination.error(err);
            }
        }
        else {
            this.hasKey = true;
        }
        if (!result) {
            this.key = key;
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbENoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3RVbnRpbENoYW5nZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQU8zQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvREc7QUFDSCxNQUFNLFVBQVUsb0JBQW9CLENBQU8sT0FBaUMsRUFBRSxXQUF5QjtJQUNyRyxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDRCQUE0QixDQUFPLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxDQUFDO0FBQzlHLENBQUM7QUFFRCxNQUFNLDRCQUE0QjtJQUNoQyxZQUFvQixPQUFnQyxFQUNoQyxXQUF3QjtRQUR4QixZQUFPLEdBQVAsT0FBTyxDQUF5QjtRQUNoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUM1QyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSw4QkFBOEIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMxRyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSw4QkFBcUMsU0FBUSxVQUFhO0lBSTlELFlBQVksV0FBMEIsRUFDMUIsT0FBZ0MsRUFDeEIsV0FBd0I7UUFDMUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBREQsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFKcEMsV0FBTSxHQUFZLEtBQUssQ0FBQztRQU05QixJQUFJLE9BQU8sT0FBTyxLQUFLLFVBQVUsRUFBRTtZQUNqQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztTQUN4QjtJQUNILENBQUM7SUFFTyxPQUFPLENBQUMsQ0FBTSxFQUFFLENBQU07UUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLEdBQVEsQ0FBQztRQUNiLElBQUk7WUFDRixNQUFNLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDO1lBQzdCLEdBQUcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1NBQ2hEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3BDO1FBQ0QsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUk7Z0JBQ0YsTUFBTSxFQUFFLE9BQU8sRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDekIsTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUNELElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDWCxJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkPFQ+KGNvbXBhcmU/OiAoeDogVCwgeTogVCkgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsQ2hhbmdlZDxULCBLPihjb21wYXJlOiAoeDogSywgeTogSykgPT4gYm9vbGVhbiwga2V5U2VsZWN0b3I6ICh4OiBUKSA9PiBLKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbGwgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBhcmUgZGlzdGluY3QgYnkgY29tcGFyaXNvbiBmcm9tIHRoZSBwcmV2aW91cyBpdGVtLlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBwcm92aWRlZCwgdGhlbiBpdCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIHRvIHRlc3QgZm9yIHdoZXRoZXIgb3Igbm90IHRoYXQgdmFsdWUgc2hvdWxkIGJlIGVtaXR0ZWQuXG4gKlxuICogSWYgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGlzIG5vdCBwcm92aWRlZCwgYW4gZXF1YWxpdHkgY2hlY2sgaXMgdXNlZCBieSBkZWZhdWx0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEEgc2ltcGxlIGV4YW1wbGUgd2l0aCBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogb2YoMSwgMSwgMiwgMiwgMiwgMSwgMSwgMiwgMywgMywgNCkucGlwZShcbiAqICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIDEsIDIsIDEsIDIsIDMsIDRcbiAqIGBgYFxuICpcbiAqIEFuIGV4YW1wbGUgdXNpbmcgYSBjb21wYXJlIGZ1bmN0aW9uXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgZGlzdGluY3RVbnRpbENoYW5nZWQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICBhZ2U6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZ1xuICogfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDYsIG5hbWU6ICdGb28nfSxcbiAqICAgKS5waXBlKFxuICogICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKChwOiBQZXJzb24sIHE6IFBlcnNvbikgPT4gcC5uYW1lID09PSBxLm5hbWUpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbycgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIC8vIHsgYWdlOiA1LCBuYW1lOiAnRm9vJyB9XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdH1cbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0VW50aWxLZXlDaGFuZ2VkfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wYXJlXSBPcHRpb25hbCBjb21wYXJpc29uIGZ1bmN0aW9uIGNhbGxlZCB0byB0ZXN0IGlmIGFuIGl0ZW0gaXMgZGlzdGluY3QgZnJvbSB0aGUgcHJldmlvdXMgaXRlbSBpbiB0aGUgc291cmNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdpdGggZGlzdGluY3QgdmFsdWVzLlxuICogQG1ldGhvZCBkaXN0aW5jdFVudGlsQ2hhbmdlZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkPFQsIEs+KGNvbXBhcmU/OiAoeDogSywgeTogSykgPT4gYm9vbGVhbiwga2V5U2VsZWN0b3I/OiAoeDogVCkgPT4gSyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGlzdGluY3RVbnRpbENoYW5nZWRPcGVyYXRvcjxULCBLPihjb21wYXJlLCBrZXlTZWxlY3RvcikpO1xufVxuXG5jbGFzcyBEaXN0aW5jdFVudGlsQ2hhbmdlZE9wZXJhdG9yPFQsIEs+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvbXBhcmU6ICh4OiBLLCB5OiBLKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAoeDogVCkgPT4gSykge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEaXN0aW5jdFVudGlsQ2hhbmdlZFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jb21wYXJlLCB0aGlzLmtleVNlbGVjdG9yKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERpc3RpbmN0VW50aWxDaGFuZ2VkU3Vic2NyaWJlcjxULCBLPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGtleTogSztcbiAgcHJpdmF0ZSBoYXNLZXk6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgY29tcGFyZTogKHg6IEssIHk6IEspID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh4OiBUKSA9PiBLKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGlmICh0eXBlb2YgY29tcGFyZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5jb21wYXJlID0gY29tcGFyZTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNvbXBhcmUoeDogYW55LCB5OiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4geCA9PT0geTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGxldCBrZXk6IGFueTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBrZXlTZWxlY3RvciB9ID0gdGhpcztcbiAgICAgIGtleSA9IGtleVNlbGVjdG9yID8ga2V5U2VsZWN0b3IodmFsdWUpIDogdmFsdWU7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuaGFzS2V5KSB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IGNvbXBhcmUgfSA9IHRoaXM7XG4gICAgICAgIHJlc3VsdCA9IGNvbXBhcmUodGhpcy5rZXksIGtleSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXNLZXkgPSB0cnVlO1xuICAgIH1cbiAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19