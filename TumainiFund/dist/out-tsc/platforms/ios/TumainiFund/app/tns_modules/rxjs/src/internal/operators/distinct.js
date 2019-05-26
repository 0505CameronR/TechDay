import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 *
 * If a keySelector function is provided, then it will project each value from the source observable into a new value that it will
 * check for equality with previously projected values. If a keySelector function is not provided, it will use each value from the
 * source observable directly with an equality check against previous values.
 *
 * In JavaScript runtimes that support `Set`, this operator will use a `Set` to improve performance of the distinct value checking.
 *
 * In other runtimes, this operator will use a minimal implementation of `Set` that relies on an `Array` and `indexOf` under the
 * hood, so performance will degrade as more values are checked for distinction. Even in newer browsers, a long-running `distinct`
 * use might result in memory leaks. To help alleviate this in some scenarios, an optional `flushes` parameter is also provided so
 * that the internal `Set` can be "flushed", basically clearing it of values.
 *
 * ## Examples
 * A simple example with numbers
 * ```javascript
 * import { of } from 'rxjs';
 * import { distinct } from 'rxjs/operators';
 *
 * of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1).pipe(
 *     distinct(),
 *   )
 *   .subscribe(x => console.log(x)); // 1, 2, 3, 4
 * ```
 *
 * An example using a keySelector function
 * ```typescript
 * import { of } from 'rxjs';
 * import { distinct } from 'rxjs/operators';
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
 *   ).pipe(
 *     distinct((p: Person) => p.name),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * ```
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [keySelector] Optional function to select which value you want to check as distinct.
 * @param {Observable} [flushes] Optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
export function distinct(keySelector, flushes) {
    return (source) => source.lift(new DistinctOperator(keySelector, flushes));
}
class DistinctOperator {
    constructor(keySelector, flushes) {
        this.keySelector = keySelector;
        this.flushes = flushes;
    }
    call(subscriber, source) {
        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class DistinctSubscriber extends OuterSubscriber {
    constructor(destination, keySelector, flushes) {
        super(destination);
        this.keySelector = keySelector;
        this.values = new Set();
        if (flushes) {
            this.add(subscribeToResult(this, flushes));
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.clear();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    _next(value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    }
    _useKeySelector(value) {
        let key;
        const { destination } = this;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    }
    _finalizeNext(key, value) {
        const { values } = this;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5REc7QUFDSCxNQUFNLFVBQVUsUUFBUSxDQUFPLFdBQTZCLEVBQzdCLE9BQXlCO0lBQ3RELE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7QUFDNUYsQ0FBQztBQUVELE1BQU0sZ0JBQWdCO0lBQ3BCLFlBQW9CLFdBQTRCLEVBQVUsT0FBd0I7UUFBOUQsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7SUFDbEYsQ0FBQztJQUVELElBQUksQ0FBQyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sT0FBTyxrQkFBeUIsU0FBUSxlQUFxQjtJQUdqRSxZQUFZLFdBQTBCLEVBQVUsV0FBNEIsRUFBRSxPQUF3QjtRQUNwRyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFEMkIsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBRnBFLFdBQU0sR0FBRyxJQUFJLEdBQUcsRUFBSyxDQUFDO1FBSzVCLElBQUksT0FBTyxFQUFFO1lBQ1gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztTQUM1QztJQUNILENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVSxFQUFFLFFBQStCO1FBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFTyxlQUFlLENBQUMsS0FBUTtRQUM5QixJQUFJLEdBQU0sQ0FBQztRQUNYLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSTtZQUNGLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQy9CO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTyxhQUFhLENBQUMsR0FBUSxFQUFFLEtBQVE7UUFDdEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBSSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgYXJlIGRpc3RpbmN0IGJ5IGNvbXBhcmlzb24gZnJvbSBwcmV2aW91cyBpdGVtcy5cbiAqXG4gKiBJZiBhIGtleVNlbGVjdG9yIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCB0aGVuIGl0IHdpbGwgcHJvamVjdCBlYWNoIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBvYnNlcnZhYmxlIGludG8gYSBuZXcgdmFsdWUgdGhhdCBpdCB3aWxsXG4gKiBjaGVjayBmb3IgZXF1YWxpdHkgd2l0aCBwcmV2aW91c2x5IHByb2plY3RlZCB2YWx1ZXMuIElmIGEga2V5U2VsZWN0b3IgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLCBpdCB3aWxsIHVzZSBlYWNoIHZhbHVlIGZyb20gdGhlXG4gKiBzb3VyY2Ugb2JzZXJ2YWJsZSBkaXJlY3RseSB3aXRoIGFuIGVxdWFsaXR5IGNoZWNrIGFnYWluc3QgcHJldmlvdXMgdmFsdWVzLlxuICpcbiAqIEluIEphdmFTY3JpcHQgcnVudGltZXMgdGhhdCBzdXBwb3J0IGBTZXRgLCB0aGlzIG9wZXJhdG9yIHdpbGwgdXNlIGEgYFNldGAgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSBvZiB0aGUgZGlzdGluY3QgdmFsdWUgY2hlY2tpbmcuXG4gKlxuICogSW4gb3RoZXIgcnVudGltZXMsIHRoaXMgb3BlcmF0b3Igd2lsbCB1c2UgYSBtaW5pbWFsIGltcGxlbWVudGF0aW9uIG9mIGBTZXRgIHRoYXQgcmVsaWVzIG9uIGFuIGBBcnJheWAgYW5kIGBpbmRleE9mYCB1bmRlciB0aGVcbiAqIGhvb2QsIHNvIHBlcmZvcm1hbmNlIHdpbGwgZGVncmFkZSBhcyBtb3JlIHZhbHVlcyBhcmUgY2hlY2tlZCBmb3IgZGlzdGluY3Rpb24uIEV2ZW4gaW4gbmV3ZXIgYnJvd3NlcnMsIGEgbG9uZy1ydW5uaW5nIGBkaXN0aW5jdGBcbiAqIHVzZSBtaWdodCByZXN1bHQgaW4gbWVtb3J5IGxlYWtzLiBUbyBoZWxwIGFsbGV2aWF0ZSB0aGlzIGluIHNvbWUgc2NlbmFyaW9zLCBhbiBvcHRpb25hbCBgZmx1c2hlc2AgcGFyYW1ldGVyIGlzIGFsc28gcHJvdmlkZWQgc29cbiAqIHRoYXQgdGhlIGludGVybmFsIGBTZXRgIGNhbiBiZSBcImZsdXNoZWRcIiwgYmFzaWNhbGx5IGNsZWFyaW5nIGl0IG9mIHZhbHVlcy5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogQSBzaW1wbGUgZXhhbXBsZSB3aXRoIG51bWJlcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBkaXN0aW5jdCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvZigxLCAxLCAyLCAyLCAyLCAxLCAyLCAzLCA0LCAzLCAyLCAxKS5waXBlKFxuICogICAgIGRpc3RpbmN0KCksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gMSwgMiwgMywgNFxuICogYGBgXG4gKlxuICogQW4gZXhhbXBsZSB1c2luZyBhIGtleVNlbGVjdG9yIGZ1bmN0aW9uXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgZGlzdGluY3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICBhZ2U6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZ1xuICogfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vJ30sXG4gKiAgICkucGlwZShcbiAqICAgICBkaXN0aW5jdCgocDogUGVyc29uKSA9PiBwLm5hbWUpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbycgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbENoYW5nZWR9XG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBba2V5U2VsZWN0b3JdIE9wdGlvbmFsIGZ1bmN0aW9uIHRvIHNlbGVjdCB3aGljaCB2YWx1ZSB5b3Ugd2FudCB0byBjaGVjayBhcyBkaXN0aW5jdC5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW2ZsdXNoZXNdIE9wdGlvbmFsIE9ic2VydmFibGUgZm9yIGZsdXNoaW5nIHRoZSBpbnRlcm5hbCBIYXNoU2V0IG9mIHRoZSBvcGVyYXRvci5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIGRpc3RpbmN0IHZhbHVlcy5cbiAqIEBtZXRob2QgZGlzdGluY3RcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdDxULCBLPihrZXlTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaGVzPzogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEaXN0aW5jdE9wZXJhdG9yKGtleVNlbGVjdG9yLCBmbHVzaGVzKSk7XG59XG5cbmNsYXNzIERpc3RpbmN0T3BlcmF0b3I8VCwgSz4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgcHJpdmF0ZSBmbHVzaGVzOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGlzdGluY3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMua2V5U2VsZWN0b3IsIHRoaXMuZmx1c2hlcykpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgRGlzdGluY3RTdWJzY3JpYmVyPFQsIEs+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZXMgPSBuZXcgU2V0PEs+KCk7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZmx1c2hlczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuXG4gICAgaWYgKGZsdXNoZXMpIHtcbiAgICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGZsdXNoZXMpKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzLmNsZWFyKCk7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMua2V5U2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuX3VzZUtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZmluYWxpemVOZXh0KHZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXNlS2V5U2VsZWN0b3IodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQga2V5OiBLO1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgdHJ5IHtcbiAgICAgIGtleSA9IHRoaXMua2V5U2VsZWN0b3IodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZmluYWxpemVOZXh0KGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmluYWxpemVOZXh0KGtleTogS3xULCB2YWx1ZTogVCkge1xuICAgIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzO1xuICAgIGlmICghdmFsdWVzLmhhcyg8Sz5rZXkpKSB7XG4gICAgICB2YWx1ZXMuYWRkKDxLPmtleSk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=