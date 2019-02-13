import { Subscriber } from '../Subscriber';
/**
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * ![](count.png)
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting a value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * ## Examples
 *
 * Counts how many seconds have passed before the first click happened
 * ```javascript
 * const seconds = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
 * const result = secondsBeforeClick.pipe(count());
 * result.subscribe(x => console.log(x));
 * ```
 *
 * Counts how many odd numbers are there between 1 and 7
 * ```javascript
 * const numbers = range(1, 7);
 * const result = numbers.pipe(count(i => i % 2 === 1));
 * result.subscribe(x => console.log(x));
 * // Results in:
 * // 4
 * ```
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
export function count(predicate) {
    return (source) => source.lift(new CountOperator(predicate, source));
}
class CountOperator {
    constructor(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class CountSubscriber extends Subscriber {
    constructor(destination, predicate, source) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.count = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    }
    _tryPredicate(value) {
        let result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    }
    _complete() {
        this.destination.next(this.count);
        this.destination.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvY291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9ERztBQUVILE1BQU0sVUFBVSxLQUFLLENBQUksU0FBdUU7SUFDOUYsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDdEYsQ0FBQztBQUVELE1BQU0sYUFBYTtJQUNqQixZQUFvQixTQUF1RSxFQUN2RSxNQUFzQjtRQUR0QixjQUFTLEdBQVQsU0FBUyxDQUE4RDtRQUN2RSxXQUFNLEdBQU4sTUFBTSxDQUFnQjtJQUMxQyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQThCLEVBQUUsTUFBVztRQUM5QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDeEYsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sZUFBbUIsU0FBUSxVQUFhO0lBSTVDLFlBQVksV0FBNkIsRUFDckIsU0FBdUUsRUFDdkUsTUFBc0I7UUFDeEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRkQsY0FBUyxHQUFULFNBQVMsQ0FBOEQ7UUFDdkUsV0FBTSxHQUFOLE1BQU0sQ0FBZ0I7UUFMbEMsVUFBSyxHQUFXLENBQUMsQ0FBQztRQUNsQixVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBTTFCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMzQjthQUFNO1lBQ0wsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ2Q7SUFDSCxDQUFDO0lBRU8sYUFBYSxDQUFDLEtBQVE7UUFDNUIsSUFBSSxNQUFXLENBQUM7UUFFaEIsSUFBSTtZQUNGLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFFRCxJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVTLFNBQVM7UUFDakIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZlciwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbi8qKlxuICogQ291bnRzIHRoZSBudW1iZXIgb2YgZW1pc3Npb25zIG9uIHRoZSBzb3VyY2UgYW5kIGVtaXRzIHRoYXQgbnVtYmVyIHdoZW4gdGhlXG4gKiBzb3VyY2UgY29tcGxldGVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5UZWxscyBob3cgbWFueSB2YWx1ZXMgd2VyZSBlbWl0dGVkLCB3aGVuIHRoZSBzb3VyY2VcbiAqIGNvbXBsZXRlcy48L3NwYW4+XG4gKlxuICogIVtdKGNvdW50LnBuZylcbiAqXG4gKiBgY291bnRgIHRyYW5zZm9ybXMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHZhbHVlcyBpbnRvIGFuIE9ic2VydmFibGUgdGhhdFxuICogZW1pdHMgYSBzaW5nbGUgdmFsdWUgdGhhdCByZXByZXNlbnRzIHRoZSBudW1iZXIgb2YgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlXG4gKiBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRlcm1pbmF0ZXMgd2l0aCBhbiBlcnJvciwgYGNvdW50YFxuICogd2lsbCBwYXNzIHRoaXMgZXJyb3Igbm90aWZpY2F0aW9uIGFsb25nIHdpdGhvdXQgZW1pdHRpbmcgYSB2YWx1ZSBmaXJzdC4gSWZcbiAqIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBkb2VzIG5vdCB0ZXJtaW5hdGUgYXQgYWxsLCBgY291bnRgIHdpbGwgbmVpdGhlciBlbWl0XG4gKiBhIHZhbHVlIG5vciB0ZXJtaW5hdGUuIFRoaXMgb3BlcmF0b3IgdGFrZXMgYW4gb3B0aW9uYWwgYHByZWRpY2F0ZWAgZnVuY3Rpb25cbiAqIGFzIGFyZ3VtZW50LCBpbiB3aGljaCBjYXNlIHRoZSBvdXRwdXQgZW1pc3Npb24gd2lsbCByZXByZXNlbnQgdGhlIG51bWJlciBvZlxuICogc291cmNlIHZhbHVlcyB0aGF0IG1hdGNoZWQgYHRydWVgIHdpdGggdGhlIGBwcmVkaWNhdGVgLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogQ291bnRzIGhvdyBtYW55IHNlY29uZHMgaGF2ZSBwYXNzZWQgYmVmb3JlIHRoZSBmaXJzdCBjbGljayBoYXBwZW5lZFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgc2Vjb25kcyA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHNlY29uZHNCZWZvcmVDbGljayA9IHNlY29uZHMucGlwZSh0YWtlVW50aWwoY2xpY2tzKSk7XG4gKiBjb25zdCByZXN1bHQgPSBzZWNvbmRzQmVmb3JlQ2xpY2sucGlwZShjb3VudCgpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBDb3VudHMgaG93IG1hbnkgb2RkIG51bWJlcnMgYXJlIHRoZXJlIGJldHdlZW4gMSBhbmQgN1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgbnVtYmVycyA9IHJhbmdlKDEsIDcpO1xuICogY29uc3QgcmVzdWx0ID0gbnVtYmVycy5waXBlKGNvdW50KGkgPT4gaSAlIDIgPT09IDEpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gNFxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWF4fVxuICogQHNlZSB7QGxpbmsgbWlufVxuICogQHNlZSB7QGxpbmsgcmVkdWNlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGk6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogYm9vbGVhbn0gW3ByZWRpY2F0ZV0gQVxuICogYm9vbGVhbiBmdW5jdGlvbiB0byBzZWxlY3Qgd2hhdCB2YWx1ZXMgYXJlIHRvIGJlIGNvdW50ZWQuIEl0IGlzIHByb3ZpZGVkIHdpdGhcbiAqIGFyZ3VtZW50cyBvZjpcbiAqIC0gYHZhbHVlYDogdGhlIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogLSBgaW5kZXhgOiB0aGUgKHplcm8tYmFzZWQpIFwiaW5kZXhcIiBvZiB0aGUgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiAtIGBzb3VyY2VgOiB0aGUgc291cmNlIE9ic2VydmFibGUgaW5zdGFuY2UgaXRzZWxmLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBvbmUgbnVtYmVyIHRoYXQgcmVwcmVzZW50cyB0aGUgY291bnQgYXNcbiAqIGRlc2NyaWJlZCBhYm92ZS5cbiAqIEBtZXRob2QgY291bnRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGNvdW50PFQ+KHByZWRpY2F0ZT86ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBudW1iZXI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBDb3VudE9wZXJhdG9yKHByZWRpY2F0ZSwgc291cmNlKSk7XG59XG5cbmNsYXNzIENvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBudW1iZXI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmVkaWNhdGU/OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8bnVtYmVyPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcmVkaWNhdGUsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIENvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxudW1iZXI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByZWRpY2F0ZT86ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZT86IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wcmVkaWNhdGUpIHtcbiAgICAgIHRoaXMuX3RyeVByZWRpY2F0ZSh2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuY291bnQrKztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF90cnlQcmVkaWNhdGUodmFsdWU6IFQpIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG5cbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcmVkaWNhdGUodmFsdWUsIHRoaXMuaW5kZXgrKywgdGhpcy5zb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChyZXN1bHQpIHtcbiAgICAgIHRoaXMuY291bnQrKztcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLmNvdW50KTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==