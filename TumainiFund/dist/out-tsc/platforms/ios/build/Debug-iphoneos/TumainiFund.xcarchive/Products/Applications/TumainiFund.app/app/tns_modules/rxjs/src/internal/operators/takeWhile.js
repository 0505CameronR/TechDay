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
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable so long as each value satisfies the condition defined by the
 * `predicate`, then completes.
 * @method takeWhile
 * @owner Observable
 */
export function takeWhile(predicate) {
    return (source) => source.lift(new TakeWhileOperator(predicate));
}
class TakeWhileOperator {
    constructor(predicate) {
        this.predicate = predicate;
    }
    call(subscriber, source) {
        return source.subscribe(new TakeWhileSubscriber(subscriber, this.predicate));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TakeWhileSubscriber extends Subscriber {
    constructor(destination, predicate) {
        super(destination);
        this.predicate = predicate;
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
            destination.complete();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVdoaWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rha2VXaGlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBTTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNDRztBQUNILE1BQU0sVUFBVSxTQUFTLENBQUksU0FBK0M7SUFDMUUsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLENBQUM7QUFFRCxNQUFNLGlCQUFpQjtJQUNyQixZQUFvQixTQUErQztRQUEvQyxjQUFTLEdBQVQsU0FBUyxDQUFzQztJQUNuRSxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sbUJBQXVCLFNBQVEsVUFBYTtJQUdoRCxZQUFZLFdBQTBCLEVBQ2xCLFNBQStDO1FBQ2pFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQURELGNBQVMsR0FBVCxTQUFTLENBQXNDO1FBSDNELFVBQUssR0FBVyxDQUFDLENBQUM7SUFLMUIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxNQUFlLENBQUM7UUFDcEIsSUFBSTtZQUNGLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQztTQUM5QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBRU8sY0FBYyxDQUFDLEtBQVEsRUFBRSxlQUF3QjtRQUN2RCxNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQUksT0FBTyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1lBQzVCLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekI7YUFBTTtZQUNMLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN4QjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gdGFrZVdoaWxlPFQsIFMgZXh0ZW5kcyBUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gdmFsdWUgaXMgUyk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUz47XG5leHBvcnQgZnVuY3Rpb24gdGFrZVdoaWxlPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuXG4vKipcbiAqIEVtaXRzIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBzbyBsb25nIGFzIGVhY2ggdmFsdWUgc2F0aXNmaWVzXG4gKiB0aGUgZ2l2ZW4gYHByZWRpY2F0ZWAsIGFuZCB0aGVuIGNvbXBsZXRlcyBhcyBzb29uIGFzIHRoaXMgYHByZWRpY2F0ZWAgaXMgbm90XG4gKiBzYXRpc2ZpZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlRha2VzIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2Ugb25seSB3aGlsZSB0aGV5IHBhc3MgdGhlXG4gKiBjb25kaXRpb24gZ2l2ZW4uIFdoZW4gdGhlIGZpcnN0IHZhbHVlIGRvZXMgbm90IHNhdGlzZnksIGl0IGNvbXBsZXRlcy48L3NwYW4+XG4gKlxuICogIVtdKHRha2VXaGlsZS5wbmcpXG4gKlxuICogYHRha2VXaGlsZWAgc3Vic2NyaWJlcyBhbmQgYmVnaW5zIG1pcnJvcmluZyB0aGUgc291cmNlIE9ic2VydmFibGUuIEVhY2ggdmFsdWVcbiAqIGVtaXR0ZWQgb24gdGhlIHNvdXJjZSBpcyBnaXZlbiB0byB0aGUgYHByZWRpY2F0ZWAgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyBhXG4gKiBib29sZWFuLCByZXByZXNlbnRpbmcgYSBjb25kaXRpb24gdG8gYmUgc2F0aXNmaWVkIGJ5IHRoZSBzb3VyY2UgdmFsdWVzLiBUaGVcbiAqIG91dHB1dCBPYnNlcnZhYmxlIGVtaXRzIHRoZSBzb3VyY2UgdmFsdWVzIHVudGlsIHN1Y2ggdGltZSBhcyB0aGUgYHByZWRpY2F0ZWBcbiAqIHJldHVybnMgZmFsc2UsIGF0IHdoaWNoIHBvaW50IGB0YWtlV2hpbGVgIHN0b3BzIG1pcnJvcmluZyB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGFuZCBjb21wbGV0ZXMgdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgY2xpY2sgZXZlbnRzIG9ubHkgd2hpbGUgdGhlIGNsaWVudFggcHJvcGVydHkgaXMgZ3JlYXRlciB0aGFuIDIwMFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKHRha2VXaGlsZShldiA9PiBldi5jbGllbnRYID4gMjAwKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqIEBzZWUge0BsaW5rIHRha2VMYXN0fVxuICogQHNlZSB7QGxpbmsgdGFrZVVudGlsfVxuICogQHNlZSB7QGxpbmsgc2tpcH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogYm9vbGVhbn0gcHJlZGljYXRlIEEgZnVuY3Rpb24gdGhhdFxuICogZXZhbHVhdGVzIGEgdmFsdWUgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYW5kIHJldHVybnMgYSBib29sZWFuLlxuICogQWxzbyB0YWtlcyB0aGUgKHplcm8tYmFzZWQpIGluZGV4IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgc28gbG9uZyBhcyBlYWNoIHZhbHVlIHNhdGlzZmllcyB0aGUgY29uZGl0aW9uIGRlZmluZWQgYnkgdGhlXG4gKiBgcHJlZGljYXRlYCwgdGhlbiBjb21wbGV0ZXMuXG4gKiBAbWV0aG9kIHRha2VXaGlsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRha2VXaGlsZTxUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgVGFrZVdoaWxlT3BlcmF0b3IocHJlZGljYXRlKSk7XG59XG5cbmNsYXNzIFRha2VXaGlsZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFRha2VXaGlsZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcmVkaWNhdGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgVGFrZVdoaWxlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGxldCByZXN1bHQ6IGJvb2xlYW47XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJlZGljYXRlKHZhbHVlLCB0aGlzLmluZGV4KyspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5uZXh0T3JDb21wbGV0ZSh2YWx1ZSwgcmVzdWx0KTtcbiAgfVxuXG4gIHByaXZhdGUgbmV4dE9yQ29tcGxldGUodmFsdWU6IFQsIHByZWRpY2F0ZVJlc3VsdDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICBpZiAoQm9vbGVhbihwcmVkaWNhdGVSZXN1bHQpKSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==