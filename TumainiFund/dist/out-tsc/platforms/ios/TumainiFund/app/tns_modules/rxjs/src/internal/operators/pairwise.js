import { Subscriber } from '../Subscriber';
/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * ![](pairwise.png)
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * ## Example
 * On every click (starting from the second), emit the relative distance to the previous click
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { pairwise, map } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const pairs = clicks.pipe(pairwise());
 * const distance = pairs.pipe(
 *   map(pair => {
 *     const x0 = pair[0].clientX;
 *     const y0 = pair[0].clientY;
 *     const x1 = pair[1].clientX;
 *     const y1 = pair[1].clientY;
 *     return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 *   }),
 * );
 * distance.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
export function pairwise() {
    return (source) => source.lift(new PairwiseOperator());
}
class PairwiseOperator {
    call(subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class PairwiseSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
        this.hasPrev = false;
    }
    _next(value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcndpc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGFpcndpc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMENHO0FBQ0gsTUFBTSxVQUFVLFFBQVE7SUFDdEIsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7QUFDeEUsQ0FBQztBQUVELE1BQU0sZ0JBQWdCO0lBQ3BCLElBQUksQ0FBQyxVQUE4QixFQUFFLE1BQVc7UUFDOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxrQkFBc0IsU0FBUSxVQUFhO0lBSS9DLFlBQVksV0FBK0I7UUFDekMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSGIsWUFBTyxHQUFZLEtBQUssQ0FBQztJQUlqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLEtBQVE7UUFDWixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDM0M7YUFBTTtZQUNMLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1NBQ3JCO1FBRUQsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7SUFDcEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEdyb3VwcyBwYWlycyBvZiBjb25zZWN1dGl2ZSBlbWlzc2lvbnMgdG9nZXRoZXIgYW5kIGVtaXRzIHRoZW0gYXMgYW4gYXJyYXkgb2ZcbiAqIHR3byB2YWx1ZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlB1dHMgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHByZXZpb3VzIHZhbHVlIHRvZ2V0aGVyIGFzXG4gKiBhbiBhcnJheSwgYW5kIGVtaXRzIHRoYXQuPC9zcGFuPlxuICpcbiAqICFbXShwYWlyd2lzZS5wbmcpXG4gKlxuICogVGhlIE50aCBlbWlzc2lvbiBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aWxsIGNhdXNlIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZVxuICogdG8gZW1pdCBhbiBhcnJheSBbKE4tMSl0aCwgTnRoXSBvZiB0aGUgcHJldmlvdXMgYW5kIHRoZSBjdXJyZW50IHZhbHVlLCBhcyBhXG4gKiBwYWlyLiBGb3IgdGhpcyByZWFzb24sIGBwYWlyd2lzZWAgZW1pdHMgb24gdGhlIHNlY29uZCBhbmQgc3Vic2VxdWVudFxuICogZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgbm90IG9uIHRoZSBmaXJzdCBlbWlzc2lvbiwgYmVjYXVzZVxuICogdGhlcmUgaXMgbm8gcHJldmlvdXMgdmFsdWUgaW4gdGhhdCBjYXNlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE9uIGV2ZXJ5IGNsaWNrIChzdGFydGluZyBmcm9tIHRoZSBzZWNvbmQpLCBlbWl0IHRoZSByZWxhdGl2ZSBkaXN0YW5jZSB0byB0aGUgcHJldmlvdXMgY2xpY2tcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb21FdmVudCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgcGFpcndpc2UsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcGFpcnMgPSBjbGlja3MucGlwZShwYWlyd2lzZSgpKTtcbiAqIGNvbnN0IGRpc3RhbmNlID0gcGFpcnMucGlwZShcbiAqICAgbWFwKHBhaXIgPT4ge1xuICogICAgIGNvbnN0IHgwID0gcGFpclswXS5jbGllbnRYO1xuICogICAgIGNvbnN0IHkwID0gcGFpclswXS5jbGllbnRZO1xuICogICAgIGNvbnN0IHgxID0gcGFpclsxXS5jbGllbnRYO1xuICogICAgIGNvbnN0IHkxID0gcGFpclsxXS5jbGllbnRZO1xuICogICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDAgLSB4MSwgMikgKyBNYXRoLnBvdyh5MCAtIHkxLCAyKSk7XG4gKiAgIH0pLFxuICogKTtcbiAqIGRpc3RhbmNlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGU8QXJyYXk8VD4+fSBBbiBPYnNlcnZhYmxlIG9mIHBhaXJzIChhcyBhcnJheXMpIG9mXG4gKiBjb25zZWN1dGl2ZSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHBhaXJ3aXNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFpcndpc2U8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxULCBbVCwgVF0+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBQYWlyd2lzZU9wZXJhdG9yKCkpO1xufVxuXG5jbGFzcyBQYWlyd2lzZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgW1QsIFRdPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbVCwgVF0+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFBhaXJ3aXNlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFBhaXJ3aXNlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHByZXY6IFQ7XG4gIHByaXZhdGUgaGFzUHJldjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFtULCBUXT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc1ByZXYpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChbdGhpcy5wcmV2LCB2YWx1ZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhc1ByZXYgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMucHJldiA9IHZhbHVlO1xuICB9XG59XG4iXX0=