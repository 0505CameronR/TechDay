import { Subscriber } from '../Subscriber';
/**
 * Emits values emitted by the source Observable so long as each value satisfies
 * the given `predicate`, and then completes as soon as this `predicate` is not
 * satisfied.
 *
 * <span class="informal">Takes values from the source only while they pass the
 * condition given. When the first value does not satisfy, it completes.</span>
 *
 * ![](takeWhile.png)
 *
 * `takeWhile` subscribes and begins mirroring the source Observable. Each value
 * emitted on the source is given to the `predicate` function which returns a
 * boolean, representing a condition to be satisfied by the source values. The
 * output Observable emits the source values until such time as the `predicate`
 * returns false, at which point `takeWhile` stops mirroring the source
 * Observable and completes the output Observable.
 *
 * ## Example
 * Emit click events only while the clientX property is greater than 200
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { takeWhile } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(takeWhile(ev => ev.clientX > 200));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeUntil}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates a value emitted by the source Observable and returns a boolean.
 * Also takes the (zero-based) index as the second argument.
 * @param {boolean} inclusive When set to `true` the value that caused
 * `predicate` to return `false` will also be emitted.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
export function takeWhile(predicate, inclusive = false) {
    return (source) => source.lift(new TakeWhileOperator(predicate, inclusive));
}
class TakeWhileOperator {
    constructor(predicate, inclusive) {
        this.predicate = predicate;
        this.inclusive = inclusive;
    }
    call(subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate, this.inclusive));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeWhileSubscriber extends Subscriber {
    constructor(destination, predicate, inclusive) {
        super(destination);
        this.predicate = predicate;
        this.inclusive = inclusive;
        this.index = 0;
    }
    _next(value) {
        const destination = this.destination;
        let result;
        try {
            result = this.predicate(value, this.index++);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this.nextOrComplete(value, result);
    }
    nextOrComplete(value, predicateResult) {
        const destination = this.destination;
        if (Boolean(predicateResult)) {
            destination.next(value);
        }
        else {
            if (this.inclusive) {
                destination.next(value);
            }
            destination.complete();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVdoaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2VXaGlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkNHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FDckIsU0FBK0MsRUFDL0MsU0FBUyxHQUFHLEtBQUs7SUFDbkIsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDdEUsQ0FBQztBQUVELE1BQU0saUJBQWlCO0lBQ3JCLFlBQ1ksU0FBK0MsRUFDL0MsU0FBa0I7UUFEbEIsY0FBUyxHQUFULFNBQVMsQ0FBc0M7UUFDL0MsY0FBUyxHQUFULFNBQVMsQ0FBUztJQUFHLENBQUM7SUFFbEMsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQ25CLElBQUksbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDM0UsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sbUJBQXVCLFNBQVEsVUFBYTtJQUdoRCxZQUNJLFdBQTBCLEVBQ2xCLFNBQStDLEVBQy9DLFNBQWtCO1FBQzVCLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUZULGNBQVMsR0FBVCxTQUFTLENBQXNDO1FBQy9DLGNBQVMsR0FBVCxTQUFTLENBQVM7UUFMdEIsVUFBSyxHQUFXLENBQUMsQ0FBQztJQU8xQixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLE1BQWUsQ0FBQztRQUNwQixJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzlDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxjQUFjLENBQUMsS0FBUSxFQUFFLGVBQXdCO1FBQ3ZELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxPQUFPLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFDNUIsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6QjthQUFNO1lBQ0wsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNsQixXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3pCO1lBQ0QsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VCwgUyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiB2YWx1ZSBpcyBTKTogT3BlcmF0b3JGdW5jdGlvbjxULCBTPjtcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VCwgUyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiB2YWx1ZSBpcyBTLCBpbmNsdXNpdmU6IGZhbHNlKTogT3BlcmF0b3JGdW5jdGlvbjxULCBTPjtcbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4sIGluY2x1c2l2ZT86IGJvb2xlYW4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5cbi8qKlxuICogRW1pdHMgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHNvIGxvbmcgYXMgZWFjaCB2YWx1ZSBzYXRpc2ZpZXNcbiAqIHRoZSBnaXZlbiBgcHJlZGljYXRlYCwgYW5kIHRoZW4gY29tcGxldGVzIGFzIHNvb24gYXMgdGhpcyBgcHJlZGljYXRlYCBpcyBub3RcbiAqIHNhdGlzZmllZC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VGFrZXMgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBvbmx5IHdoaWxlIHRoZXkgcGFzcyB0aGVcbiAqIGNvbmRpdGlvbiBnaXZlbi4gV2hlbiB0aGUgZmlyc3QgdmFsdWUgZG9lcyBub3Qgc2F0aXNmeSwgaXQgY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10odGFrZVdoaWxlLnBuZylcbiAqXG4gKiBgdGFrZVdoaWxlYCBzdWJzY3JpYmVzIGFuZCBiZWdpbnMgbWlycm9yaW5nIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gRWFjaCB2YWx1ZVxuICogZW1pdHRlZCBvbiB0aGUgc291cmNlIGlzIGdpdmVuIHRvIHRoZSBgcHJlZGljYXRlYCBmdW5jdGlvbiB3aGljaCByZXR1cm5zIGFcbiAqIGJvb2xlYW4sIHJlcHJlc2VudGluZyBhIGNvbmRpdGlvbiB0byBiZSBzYXRpc2ZpZWQgYnkgdGhlIHNvdXJjZSB2YWx1ZXMuIFRoZVxuICogb3V0cHV0IE9ic2VydmFibGUgZW1pdHMgdGhlIHNvdXJjZSB2YWx1ZXMgdW50aWwgc3VjaCB0aW1lIGFzIHRoZSBgcHJlZGljYXRlYFxuICogcmV0dXJucyBmYWxzZSwgYXQgd2hpY2ggcG9pbnQgYHRha2VXaGlsZWAgc3RvcHMgbWlycm9yaW5nIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYW5kIGNvbXBsZXRlcyB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRW1pdCBjbGljayBldmVudHMgb25seSB3aGlsZSB0aGUgY2xpZW50WCBwcm9wZXJ0eSBpcyBncmVhdGVyIHRoYW4gMjAwXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2VXaGlsZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUodGFrZVdoaWxlKGV2ID0+IGV2LmNsaWVudFggPiAyMDApKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICogQHNlZSB7QGxpbmsgdGFrZUxhc3R9XG4gKiBAc2VlIHtAbGluayB0YWtlVW50aWx9XG4gKiBAc2VlIHtAbGluayBza2lwfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBib29sZWFufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiB0aGF0XG4gKiBldmFsdWF0ZXMgYSB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhbmQgcmV0dXJucyBhIGJvb2xlYW4uXG4gKiBBbHNvIHRha2VzIHRoZSAoemVyby1iYXNlZCkgaW5kZXggYXMgdGhlIHNlY29uZCBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gaW5jbHVzaXZlIFdoZW4gc2V0IHRvIGB0cnVlYCB0aGUgdmFsdWUgdGhhdCBjYXVzZWRcbiAqIGBwcmVkaWNhdGVgIHRvIHJldHVybiBgZmFsc2VgIHdpbGwgYWxzbyBiZSBlbWl0dGVkLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIHNvIGxvbmcgYXMgZWFjaCB2YWx1ZSBzYXRpc2ZpZXMgdGhlIGNvbmRpdGlvbiBkZWZpbmVkIGJ5IHRoZVxuICogYHByZWRpY2F0ZWAsIHRoZW4gY29tcGxldGVzLlxuICogQG1ldGhvZCB0YWtlV2hpbGVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YWtlV2hpbGU8VD4oXG4gICAgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4sXG4gICAgaW5jbHVzaXZlID0gZmFsc2UpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICAgICAgICAgICBzb3VyY2UubGlmdChuZXcgVGFrZVdoaWxlT3BlcmF0b3IocHJlZGljYXRlLCBpbmNsdXNpdmUpKTtcbn1cblxuY2xhc3MgVGFrZVdoaWxlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKFxuICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbixcbiAgICAgIHByaXZhdGUgaW5jbHVzaXZlOiBib29sZWFuKSB7fVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShcbiAgICAgICAgbmV3IFRha2VXaGlsZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcmVkaWNhdGUsIHRoaXMuaW5jbHVzaXZlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFRha2VXaGlsZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihcbiAgICAgIGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbixcbiAgICAgIHByaXZhdGUgaW5jbHVzaXZlOiBib29sZWFuKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW47XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJlZGljYXRlKHZhbHVlLCB0aGlzLmluZGV4KyspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uZXh0T3JDb21wbGV0ZSh2YWx1ZSwgcmVzdWx0KTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dE9yQ29tcGxldGUodmFsdWU6IFQsIHByZWRpY2F0ZVJlc3VsdDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBpZiAoQm9vbGVhbihwcmVkaWNhdGVSZXN1bHQpKSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMuaW5jbHVzaXZlKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==