import { Subscriber } from '../Subscriber';
/**
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * ![](find.png)
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * ## Example
 * Find and emit the first click that happens on a DIV element
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { find } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(find(ev => ev.target.tagName === 'DIV'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
export function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return (source) => source.lift(new FindValueOperator(predicate, source, false, thisArg));
}
export class FindValueOperator {
    constructor(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    call(observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class FindValueSubscriber extends Subscriber {
    constructor(destination, predicate, source, yieldIndex, thisArg) {
        super(destination);
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
        this.index = 0;
    }
    notifyComplete(value) {
        const destination = this.destination;
        destination.next(value);
        destination.complete();
        this.unsubscribe();
    }
    _next(value) {
        const { predicate, thisArg } = this;
        const index = this.index++;
        try {
            const result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9maW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFPekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0NHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBSSxTQUFzRSxFQUN0RSxPQUFhO0lBQ25DLElBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxFQUFFO1FBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNwRDtJQUNELE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQThCLENBQUM7QUFDdkksQ0FBQztBQUVELE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBb0IsU0FBc0UsRUFDdEUsTUFBcUIsRUFDckIsVUFBbUIsRUFDbkIsT0FBYTtRQUhiLGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ2pDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBdUIsRUFBRSxNQUFXO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6SCxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLG1CQUF1QixTQUFRLFVBQWE7SUFHdkQsWUFBWSxXQUEwQixFQUNsQixTQUFzRSxFQUN0RSxNQUFxQixFQUNyQixVQUFtQixFQUNuQixPQUFhO1FBQy9CLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUpELGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFNO1FBTnpCLFVBQUssR0FBVyxDQUFDLENBQUM7SUFRMUIsQ0FBQztJQUVPLGNBQWMsQ0FBQyxLQUFVO1FBQy9CLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFckMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxJQUFJLE1BQU0sRUFBRTtnQkFDVixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEQ7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09ic2VydmFibGV9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHtPcGVyYXRvcn0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHtTdWJzY3JpYmVyfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7T3BlcmF0b3JGdW5jdGlvbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZDxULCBTIGV4dGVuZHMgVD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gdmFsdWUgaXMgUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBTIHwgdW5kZWZpbmVkPjtcbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgdW5kZWZpbmVkPjtcbi8qKlxuICogRW1pdHMgb25seSB0aGUgZmlyc3QgdmFsdWUgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBtZWV0cyBzb21lXG4gKiBjb25kaXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZpbmRzIHRoZSBmaXJzdCB2YWx1ZSB0aGF0IHBhc3NlcyBzb21lIHRlc3QgYW5kIGVtaXRzXG4gKiB0aGF0Ljwvc3Bhbj5cbiAqXG4gKiAhW10oZmluZC5wbmcpXG4gKlxuICogYGZpbmRgIHNlYXJjaGVzIGZvciB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBtYXRjaGVzIHRoZVxuICogc3BlY2lmaWVkIGNvbmRpdGlvbiBlbWJvZGllZCBieSB0aGUgYHByZWRpY2F0ZWAsIGFuZCByZXR1cm5zIHRoZSBmaXJzdFxuICogb2NjdXJyZW5jZSBpbiB0aGUgc291cmNlLiBVbmxpa2Uge0BsaW5rIGZpcnN0fSwgdGhlIGBwcmVkaWNhdGVgIGlzIHJlcXVpcmVkXG4gKiBpbiBgZmluZGAsIGFuZCBkb2VzIG5vdCBlbWl0IGFuIGVycm9yIGlmIGEgdmFsaWQgdmFsdWUgaXMgbm90IGZvdW5kLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEZpbmQgYW5kIGVtaXQgdGhlIGZpcnN0IGNsaWNrIHRoYXQgaGFwcGVucyBvbiBhIERJViBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IGZpbmQgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKGZpbmQoZXYgPT4gZXYudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZmlsdGVyfVxuICogQHNlZSB7QGxpbmsgZmlyc3R9XG4gKiBAc2VlIHtAbGluayBmaW5kSW5kZXh9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IGJvb2xlYW59IHByZWRpY2F0ZVxuICogQSBmdW5jdGlvbiBjYWxsZWQgd2l0aCBlYWNoIGl0ZW0gdG8gdGVzdCBmb3IgY29uZGl0aW9uIG1hdGNoaW5nLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBBbiBvcHRpb25hbCBhcmd1bWVudCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIGB0aGlzYFxuICogaW4gdGhlIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSBvZiB0aGUgZmlyc3QgaXRlbSB0aGF0IG1hdGNoZXMgdGhlXG4gKiBjb25kaXRpb24uXG4gKiBAbWV0aG9kIGZpbmRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgdW5kZWZpbmVkPiB7XG4gIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBGaW5kVmFsdWVPcGVyYXRvcihwcmVkaWNhdGUsIHNvdXJjZSwgZmFsc2UsIHRoaXNBcmcpKSBhcyBPYnNlcnZhYmxlPFQgfCB1bmRlZmluZWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgRmluZFZhbHVlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUIHwgbnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgeWllbGRJbmRleDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aGlzQXJnPzogYW55KSB7XG4gIH1cblxuICBjYWxsKG9ic2VydmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEZpbmRWYWx1ZVN1YnNjcmliZXIob2JzZXJ2ZXIsIHRoaXMucHJlZGljYXRlLCB0aGlzLnNvdXJjZSwgdGhpcy55aWVsZEluZGV4LCB0aGlzLnRoaXNBcmcpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbmRWYWx1ZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB5aWVsZEluZGV4OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRoaXNBcmc/OiBhbnkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcml2YXRlIG5vdGlmeUNvbXBsZXRlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHtwcmVkaWNhdGUsIHRoaXNBcmd9ID0gdGhpcztcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcHJlZGljYXRlLmNhbGwodGhpc0FyZyB8fCB0aGlzLCB2YWx1ZSwgaW5kZXgsIHRoaXMuc291cmNlKTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5ub3RpZnlDb21wbGV0ZSh0aGlzLnlpZWxkSW5kZXggPyBpbmRleCA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMubm90aWZ5Q29tcGxldGUodGhpcy55aWVsZEluZGV4ID8gLTEgOiB1bmRlZmluZWQpO1xuICB9XG59XG4iXX0=