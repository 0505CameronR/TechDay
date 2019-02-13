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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9maW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBQyxVQUFVLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFPekM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUNHO0FBQ0gsTUFBTSxVQUFVLElBQUksQ0FBSSxTQUFzRSxFQUN0RSxPQUFhO0lBQ25DLElBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxFQUFFO1FBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNwRDtJQUNELE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsU0FBUyxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQThCLENBQUM7QUFDdkksQ0FBQztBQUVELE1BQU0sT0FBTyxpQkFBaUI7SUFDNUIsWUFBb0IsU0FBc0UsRUFDdEUsTUFBcUIsRUFDckIsVUFBbUIsRUFDbkIsT0FBYTtRQUhiLGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFNO0lBQ2pDLENBQUM7SUFFRCxJQUFJLENBQUMsUUFBdUIsRUFBRSxNQUFXO1FBQ3ZDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN6SCxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxPQUFPLG1CQUF1QixTQUFRLFVBQWE7SUFHdkQsWUFBWSxXQUEwQixFQUNsQixTQUFzRSxFQUN0RSxNQUFxQixFQUNyQixVQUFtQixFQUNuQixPQUFhO1FBQy9CLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUpELGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFdBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsZUFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixZQUFPLEdBQVAsT0FBTyxDQUFNO1FBTnpCLFVBQUssR0FBVyxDQUFDLENBQUM7SUFRMUIsQ0FBQztJQUVPLGNBQWMsQ0FBQyxLQUFVO1FBQy9CLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFckMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQztRQUNsQyxNQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDM0IsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxRSxJQUFJLE1BQU0sRUFBRTtnQkFDVixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDdEQ7U0FDRjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge09ic2VydmFibGV9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHtPcGVyYXRvcn0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHtTdWJzY3JpYmVyfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7T3BlcmF0b3JGdW5jdGlvbn0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgZnVuY3Rpb24gZmluZDxULCBTIGV4dGVuZHMgVD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gdmFsdWUgaXMgUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBTIHwgdW5kZWZpbmVkPjtcbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgdW5kZWZpbmVkPjtcbi8qKlxuICogRW1pdHMgb25seSB0aGUgZmlyc3QgdmFsdWUgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBtZWV0cyBzb21lXG4gKiBjb25kaXRpb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZpbmRzIHRoZSBmaXJzdCB2YWx1ZSB0aGF0IHBhc3NlcyBzb21lIHRlc3QgYW5kIGVtaXRzXG4gKiB0aGF0Ljwvc3Bhbj5cbiAqXG4gKiAhW10oZmluZC5wbmcpXG4gKlxuICogYGZpbmRgIHNlYXJjaGVzIGZvciB0aGUgZmlyc3QgaXRlbSBpbiB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBtYXRjaGVzIHRoZVxuICogc3BlY2lmaWVkIGNvbmRpdGlvbiBlbWJvZGllZCBieSB0aGUgYHByZWRpY2F0ZWAsIGFuZCByZXR1cm5zIHRoZSBmaXJzdFxuICogb2NjdXJyZW5jZSBpbiB0aGUgc291cmNlLiBVbmxpa2Uge0BsaW5rIGZpcnN0fSwgdGhlIGBwcmVkaWNhdGVgIGlzIHJlcXVpcmVkXG4gKiBpbiBgZmluZGAsIGFuZCBkb2VzIG5vdCBlbWl0IGFuIGVycm9yIGlmIGEgdmFsaWQgdmFsdWUgaXMgbm90IGZvdW5kLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEZpbmQgYW5kIGVtaXQgdGhlIGZpcnN0IGNsaWNrIHRoYXQgaGFwcGVucyBvbiBhIERJViBlbGVtZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoZmluZChldiA9PiBldi50YXJnZXQudGFnTmFtZSA9PT0gJ0RJVicpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmaWx0ZXJ9XG4gKiBAc2VlIHtAbGluayBmaXJzdH1cbiAqIEBzZWUge0BsaW5rIGZpbmRJbmRleH1cbiAqIEBzZWUge0BsaW5rIHRha2V9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogYm9vbGVhbn0gcHJlZGljYXRlXG4gKiBBIGZ1bmN0aW9uIGNhbGxlZCB3aXRoIGVhY2ggaXRlbSB0byB0ZXN0IGZvciBjb25kaXRpb24gbWF0Y2hpbmcuXG4gKiBAcGFyYW0ge2FueX0gW3RoaXNBcmddIEFuIG9wdGlvbmFsIGFyZ3VtZW50IHRvIGRldGVybWluZSB0aGUgdmFsdWUgb2YgYHRoaXNgXG4gKiBpbiB0aGUgYHByZWRpY2F0ZWAgZnVuY3Rpb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBBbiBPYnNlcnZhYmxlIG9mIHRoZSBmaXJzdCBpdGVtIHRoYXQgbWF0Y2hlcyB0aGVcbiAqIGNvbmRpdGlvbi5cbiAqIEBtZXRob2QgZmluZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNBcmc/OiBhbnkpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCB1bmRlZmluZWQ+IHtcbiAgaWYgKHR5cGVvZiBwcmVkaWNhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdwcmVkaWNhdGUgaXMgbm90IGEgZnVuY3Rpb24nKTtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IEZpbmRWYWx1ZU9wZXJhdG9yKHByZWRpY2F0ZSwgc291cmNlLCBmYWxzZSwgdGhpc0FyZykpIGFzIE9ic2VydmFibGU8VCB8IHVuZGVmaW5lZD47XG59XG5cbmV4cG9ydCBjbGFzcyBGaW5kVmFsdWVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQgfCBudW1iZXIgfCB1bmRlZmluZWQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB5aWVsZEluZGV4OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRoaXNBcmc/OiBhbnkpIHtcbiAgfVxuXG4gIGNhbGwob2JzZXJ2ZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRmluZFZhbHVlU3Vic2NyaWJlcihvYnNlcnZlciwgdGhpcy5wcmVkaWNhdGUsIHRoaXMuc291cmNlLCB0aGlzLnlpZWxkSW5kZXgsIHRoaXMudGhpc0FyZykpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgRmluZFZhbHVlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHlpZWxkSW5kZXg6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdGhpc0FyZz86IGFueSkge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByaXZhdGUgbm90aWZ5Q29tcGxldGUodmFsdWU6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3Qge3ByZWRpY2F0ZSwgdGhpc0FyZ30gPSB0aGlzO1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBwcmVkaWNhdGUuY2FsbCh0aGlzQXJnIHx8IHRoaXMsIHZhbHVlLCBpbmRleCwgdGhpcy5zb3VyY2UpO1xuICAgICAgaWYgKHJlc3VsdCkge1xuICAgICAgICB0aGlzLm5vdGlmeUNvbXBsZXRlKHRoaXMueWllbGRJbmRleCA/IGluZGV4IDogdmFsdWUpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5ub3RpZnlDb21wbGV0ZSh0aGlzLnlpZWxkSW5kZXggPyAtMSA6IHVuZGVmaW5lZCk7XG4gIH1cbn1cbiJdfQ==