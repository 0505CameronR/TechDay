import { Subscriber } from '../Subscriber';
import { ArgumentOutOfRangeError } from '../util/ArgumentOutOfRangeError';
import { empty } from '../observable/empty';
/**
 * Emits only the last `count` values emitted by the source Observable.
 *
 * <span class="informal">Remembers the latest `count` values, then emits those
 * only when the source completes.</span>
 *
 * ![](takeLast.png)
 *
 * `takeLast` returns an Observable that emits at most the last `count` values
 * emitted by the source Observable. If the source emits fewer than `count`
 * values then all of its values are emitted. This operator must wait until the
 * `complete` notification emission from the source in order to emit the `next`
 * values on the output Observable, because otherwise it is impossible to know
 * whether or not more values will be emitted on the source. For this reason,
 * all values are emitted synchronously, followed by the complete notification.
 *
 * ## Example
 * Take the last 3 values of an Observable with many values
 * ```javascript
 * const many = range(1, 100);
 * const lastThree = many.pipe(takeLast(3));
 * lastThree.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeUntil}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @throws {ArgumentOutOfRangeError} When using `takeLast(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0`.
 *
 * @param {number} count The maximum number of values to emit from the end of
 * the sequence of values emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits at most the last count
 * values emitted by the source Observable.
 * @method takeLast
 * @owner Observable
 */
export function takeLast(count) {
    return function takeLastOperatorFunction(source) {
        if (count === 0) {
            return empty();
        }
        else {
            return source.lift(new TakeLastOperator(count));
        }
    };
}
class TakeLastOperator {
    constructor(total) {
        this.total = total;
        if (this.total < 0) {
            throw new ArgumentOutOfRangeError;
        }
    }
    call(subscriber, source) {
        return source.subscribe(new TakeLastSubscriber(subscriber, this.total));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeLastSubscriber extends Subscriber {
    constructor(destination, total) {
        super(destination);
        this.total = total;
        this.ring = new Array();
        this.count = 0;
    }
    _next(value) {
        const ring = this.ring;
        const total = this.total;
        const count = this.count++;
        if (ring.length < total) {
            ring.push(value);
        }
        else {
            const index = count % total;
            ring[index] = value;
        }
    }
    _complete() {
        const destination = this.destination;
        let count = this.count;
        if (count > 0) {
            const total = this.count >= this.total ? this.total : this.count;
            const ring = this.ring;
            for (let i = 0; i < total; i++) {
                const idx = (count++) % total;
                destination.next(ring[idx]);
            }
        }
        destination.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZUxhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZUxhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUMxRSxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFJNUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0NHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBSSxLQUFhO0lBQ3ZDLE9BQU8sU0FBUyx3QkFBd0IsQ0FBQyxNQUFxQjtRQUM1RCxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7WUFDZixPQUFPLEtBQUssRUFBRSxDQUFDO1NBQ2hCO2FBQU07WUFDTCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sZ0JBQWdCO0lBQ3BCLFlBQW9CLEtBQWE7UUFBYixVQUFLLEdBQUwsS0FBSyxDQUFRO1FBQy9CLElBQUksSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDbEIsTUFBTSxJQUFJLHVCQUF1QixDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUVELElBQUksQ0FBQyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGtCQUFzQixTQUFRLFVBQWE7SUFJL0MsWUFBWSxXQUEwQixFQUFVLEtBQWE7UUFDM0QsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRDJCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFIckQsU0FBSSxHQUFhLElBQUksS0FBSyxFQUFFLENBQUM7UUFDN0IsVUFBSyxHQUFXLENBQUMsQ0FBQztJQUkxQixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUUzQixJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxFQUFFO1lBQ3ZCLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEI7YUFBTTtZQUNMLE1BQU0sS0FBSyxHQUFHLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDNUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFUyxTQUFTO1FBQ2pCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUV2QixJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUU7WUFDYixNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDakUsTUFBTSxJQUFJLEdBQUksSUFBSSxDQUFDLElBQUksQ0FBQztZQUV4QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QixNQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUM5QixXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO2FBQzdCO1NBQ0Y7UUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciB9IGZyb20gJy4uL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyBvbmx5IHRoZSBsYXN0IGBjb3VudGAgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5SZW1lbWJlcnMgdGhlIGxhdGVzdCBgY291bnRgIHZhbHVlcywgdGhlbiBlbWl0cyB0aG9zZVxuICogb25seSB3aGVuIHRoZSBzb3VyY2UgY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZUxhc3QucG5nKVxuICpcbiAqIGB0YWtlTGFzdGAgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYXQgbW9zdCB0aGUgbGFzdCBgY291bnRgIHZhbHVlc1xuICogZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuIElmIHRoZSBzb3VyY2UgZW1pdHMgZmV3ZXIgdGhhbiBgY291bnRgXG4gKiB2YWx1ZXMgdGhlbiBhbGwgb2YgaXRzIHZhbHVlcyBhcmUgZW1pdHRlZC4gVGhpcyBvcGVyYXRvciBtdXN0IHdhaXQgdW50aWwgdGhlXG4gKiBgY29tcGxldGVgIG5vdGlmaWNhdGlvbiBlbWlzc2lvbiBmcm9tIHRoZSBzb3VyY2UgaW4gb3JkZXIgdG8gZW1pdCB0aGUgYG5leHRgXG4gKiB2YWx1ZXMgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLCBiZWNhdXNlIG90aGVyd2lzZSBpdCBpcyBpbXBvc3NpYmxlIHRvIGtub3dcbiAqIHdoZXRoZXIgb3Igbm90IG1vcmUgdmFsdWVzIHdpbGwgYmUgZW1pdHRlZCBvbiB0aGUgc291cmNlLiBGb3IgdGhpcyByZWFzb24sXG4gKiBhbGwgdmFsdWVzIGFyZSBlbWl0dGVkIHN5bmNocm9ub3VzbHksIGZvbGxvd2VkIGJ5IHRoZSBjb21wbGV0ZSBub3RpZmljYXRpb24uXG4gKlxuICogIyMgRXhhbXBsZVxuICogVGFrZSB0aGUgbGFzdCAzIHZhbHVlcyBvZiBhbiBPYnNlcnZhYmxlIHdpdGggbWFueSB2YWx1ZXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG1hbnkgPSByYW5nZSgxLCAxMDApO1xuICogY29uc3QgbGFzdFRocmVlID0gbWFueS5waXBlKHRha2VMYXN0KDMpKTtcbiAqIGxhc3RUaHJlZS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZVVudGlsfVxuICogQHNlZSB7QGxpbmsgdGFrZVdoaWxlfVxuICogQHNlZSB7QGxpbmsgc2tpcH1cbiAqXG4gKiBAdGhyb3dzIHtBcmd1bWVudE91dE9mUmFuZ2VFcnJvcn0gV2hlbiB1c2luZyBgdGFrZUxhc3QoaSlgLCBpdCBkZWxpdmVycyBhblxuICogQXJndW1lbnRPdXRPclJhbmdlRXJyb3IgdG8gdGhlIE9ic2VydmVyJ3MgYGVycm9yYCBjYWxsYmFjayBpZiBgaSA8IDBgLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBjb3VudCBUaGUgbWF4aW11bSBudW1iZXIgb2YgdmFsdWVzIHRvIGVtaXQgZnJvbSB0aGUgZW5kIG9mXG4gKiB0aGUgc2VxdWVuY2Ugb2YgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGF0IG1vc3QgdGhlIGxhc3QgY291bnRcbiAqIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgdGFrZUxhc3RcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YWtlTGFzdDxUPihjb3VudDogbnVtYmVyKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRha2VMYXN0T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFRha2VMYXN0T3BlcmF0b3IoY291bnQpKTtcbiAgICB9XG4gIH07XG59XG5cbmNsYXNzIFRha2VMYXN0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgdG90YWw6IG51bWJlcikge1xuICAgIGlmICh0aGlzLnRvdGFsIDwgMCkge1xuICAgICAgdGhyb3cgbmV3IEFyZ3VtZW50T3V0T2ZSYW5nZUVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFrZUxhc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMudG90YWwpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGFrZUxhc3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgcmluZzogQXJyYXk8VD4gPSBuZXcgQXJyYXkoKTtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPiwgcHJpdmF0ZSB0b3RhbDogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgcmluZyA9IHRoaXMucmluZztcbiAgICBjb25zdCB0b3RhbCA9IHRoaXMudG90YWw7XG4gICAgY29uc3QgY291bnQgPSB0aGlzLmNvdW50Kys7XG5cbiAgICBpZiAocmluZy5sZW5ndGggPCB0b3RhbCkge1xuICAgICAgcmluZy5wdXNoKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSBjb3VudCAlIHRvdGFsO1xuICAgICAgcmluZ1tpbmRleF0gPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBsZXQgY291bnQgPSB0aGlzLmNvdW50O1xuXG4gICAgaWYgKGNvdW50ID4gMCkge1xuICAgICAgY29uc3QgdG90YWwgPSB0aGlzLmNvdW50ID49IHRoaXMudG90YWwgPyB0aGlzLnRvdGFsIDogdGhpcy5jb3VudDtcbiAgICAgIGNvbnN0IHJpbmcgID0gdGhpcy5yaW5nO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvdGFsOyBpKyspIHtcbiAgICAgICAgY29uc3QgaWR4ID0gKGNvdW50KyspICUgdG90YWw7XG4gICAgICAgIGRlc3RpbmF0aW9uLm5leHQocmluZ1tpZHhdKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=