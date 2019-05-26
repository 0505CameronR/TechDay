import { Subscriber } from '../Subscriber';
import { ArgumentOutOfRangeError } from '../util/ArgumentOutOfRangeError';
/**
 * Skip the last `count` values emitted by the source Observable.
 *
 * ![](skipLast.png)
 *
 * `skipLast` returns an Observable that accumulates a queue with a length
 * enough to store the first `count` values. As more values are received,
 * values are taken from the front of the queue and produced on the result
 * sequence. This causes values to be delayed.
 *
 * ## Example
 * Skip the last 2 values of an Observable with many values
 * ```javascript
 * import { range } from 'rxjs';
 * import { skipLast } from 'rxjs/operators';
 *
 * const many = range(1, 5);
 * const skipLastTwo = many.pipe(skipLast(2));
 * skipLastTwo.subscribe(x => console.log(x));
 *
 * // Results in:
 * // 1 2 3
 * ```
 *
 * @see {@link skip}
 * @see {@link skipUntil}
 * @see {@link skipWhile}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `skipLast(i)`, it throws
 * ArgumentOutOrRangeError if `i < 0`.
 *
 * @param {number} count Number of elements to skip from the end of the source Observable.
 * @returns {Observable<T>} An Observable that skips the last count values
 * emitted by the source Observable.
 * @method skipLast
 * @owner Observable
 */
export function skipLast(count) {
    return (source) => source.lift(new SkipLastOperator(count));
}
class SkipLastOperator {
    constructor(_skipCount) {
        this._skipCount = _skipCount;
        if (this._skipCount < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber, source) {
        if (this._skipCount === 0) {
            // If we don't want to skip any values then just subscribe
            // to Subscriber without any further logic.
            return source.subscribe(new Subscriber(subscriber));
        }
        else {
            return source.subscribe(new SkipLastSubscriber(subscriber, this._skipCount));
        }
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SkipLastSubscriber extends Subscriber {
    constructor(destination, _skipCount) {
        super(destination);
        this._skipCount = _skipCount;
        this._count = 0;
        this._ring = new Array(_skipCount);
    }
    _next(value) {
        const skipCount = this._skipCount;
        const count = this._count++;
        if (count < skipCount) {
            this._ring[count] = value;
        }
        else {
            const currentIndex = count % skipCount;
            const ring = this._ring;
            const oldValue = ring[currentIndex];
            ring[currentIndex] = value;
            this.destination.next(oldValue);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2tpcExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2tpcExhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUkxRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUksS0FBYTtJQUN2QyxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQztBQUVELE1BQU0sZ0JBQWdCO0lBQ3BCLFlBQW9CLFVBQWtCO1FBQWxCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFDcEMsSUFBSSxJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLElBQUksdUJBQXVCLENBQUM7U0FDbkM7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLDBEQUEwRDtZQUMxRCwyQ0FBMkM7WUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7U0FDckQ7YUFBTTtZQUNMLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztTQUM5RTtJQUNILENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGtCQUFzQixTQUFRLFVBQWE7SUFJL0MsWUFBWSxXQUEwQixFQUFVLFVBQWtCO1FBQ2hFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUQyQixlQUFVLEdBQVYsVUFBVSxDQUFRO1FBRjFELFdBQU0sR0FBVyxDQUFDLENBQUM7UUFJekIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLEtBQUssQ0FBSSxVQUFVLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFNUIsSUFBSSxLQUFLLEdBQUcsU0FBUyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1NBQzNCO2FBQU07WUFDTCxNQUFNLFlBQVksR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDO1lBQ3ZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDeEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBRXBDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDakM7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yIH0gZnJvbSAnLi4vdXRpbC9Bcmd1bWVudE91dE9mUmFuZ2VFcnJvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogU2tpcCB0aGUgbGFzdCBgY291bnRgIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiAhW10oc2tpcExhc3QucG5nKVxuICpcbiAqIGBza2lwTGFzdGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgYWNjdW11bGF0ZXMgYSBxdWV1ZSB3aXRoIGEgbGVuZ3RoXG4gKiBlbm91Z2ggdG8gc3RvcmUgdGhlIGZpcnN0IGBjb3VudGAgdmFsdWVzLiBBcyBtb3JlIHZhbHVlcyBhcmUgcmVjZWl2ZWQsXG4gKiB2YWx1ZXMgYXJlIHRha2VuIGZyb20gdGhlIGZyb250IG9mIHRoZSBxdWV1ZSBhbmQgcHJvZHVjZWQgb24gdGhlIHJlc3VsdFxuICogc2VxdWVuY2UuIFRoaXMgY2F1c2VzIHZhbHVlcyB0byBiZSBkZWxheWVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFNraXAgdGhlIGxhc3QgMiB2YWx1ZXMgb2YgYW4gT2JzZXJ2YWJsZSB3aXRoIG1hbnkgdmFsdWVzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyByYW5nZSB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgc2tpcExhc3QgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgbWFueSA9IHJhbmdlKDEsIDUpO1xuICogY29uc3Qgc2tpcExhc3RUd28gPSBtYW55LnBpcGUoc2tpcExhc3QoMikpO1xuICogc2tpcExhc3RUd28uc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW46XG4gKiAvLyAxIDIgM1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgc2tpcH1cbiAqIEBzZWUge0BsaW5rIHNraXBVbnRpbH1cbiAqIEBzZWUge0BsaW5rIHNraXBXaGlsZX1cbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKlxuICogQHRocm93cyB7QXJndW1lbnRPdXRPZlJhbmdlRXJyb3J9IFdoZW4gdXNpbmcgYHNraXBMYXN0KGkpYCwgaXQgdGhyb3dzXG4gKiBBcmd1bWVudE91dE9yUmFuZ2VFcnJvciBpZiBgaSA8IDBgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBOdW1iZXIgb2YgZWxlbWVudHMgdG8gc2tpcCBmcm9tIHRoZSBlbmQgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybnMge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBza2lwcyB0aGUgbGFzdCBjb3VudCB2YWx1ZXNcbiAqIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBza2lwTGFzdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNraXBMYXN0PFQ+KGNvdW50OiBudW1iZXIpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFNraXBMYXN0T3BlcmF0b3IoY291bnQpKTtcbn1cblxuY2xhc3MgU2tpcExhc3RPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfc2tpcENvdW50OiBudW1iZXIpIHtcbiAgICBpZiAodGhpcy5fc2tpcENvdW50IDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBpZiAodGhpcy5fc2tpcENvdW50ID09PSAwKSB7XG4gICAgICAvLyBJZiB3ZSBkb24ndCB3YW50IHRvIHNraXAgYW55IHZhbHVlcyB0aGVuIGp1c3Qgc3Vic2NyaWJlXG4gICAgICAvLyB0byBTdWJzY3JpYmVyIHdpdGhvdXQgYW55IGZ1cnRoZXIgbG9naWMuXG4gICAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTa2lwTGFzdFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5fc2tpcENvdW50KSk7XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTa2lwTGFzdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBfcmluZzogVFtdO1xuICBwcml2YXRlIF9jb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgcHJpdmF0ZSBfc2tpcENvdW50OiBudW1iZXIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5fcmluZyA9IG5ldyBBcnJheTxUPihfc2tpcENvdW50KTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHNraXBDb3VudCA9IHRoaXMuX3NraXBDb3VudDtcbiAgICBjb25zdCBjb3VudCA9IHRoaXMuX2NvdW50Kys7XG5cbiAgICBpZiAoY291bnQgPCBza2lwQ291bnQpIHtcbiAgICAgIHRoaXMuX3JpbmdbY291bnRdID0gdmFsdWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGN1cnJlbnRJbmRleCA9IGNvdW50ICUgc2tpcENvdW50O1xuICAgICAgY29uc3QgcmluZyA9IHRoaXMuX3Jpbmc7XG4gICAgICBjb25zdCBvbGRWYWx1ZSA9IHJpbmdbY3VycmVudEluZGV4XTtcblxuICAgICAgcmluZ1tjdXJyZW50SW5kZXhdID0gdmFsdWU7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQob2xkVmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19