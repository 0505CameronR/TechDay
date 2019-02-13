import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Buffers the source Observable values until `closingNotifier` emits.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when another Observable emits.</span>
 *
 * ![](buffer.png)
 *
 * Buffers the incoming Observable values until the given `closingNotifier`
 * Observable emits a value, at which point it emits the buffer on the output
 * Observable and starts a new buffer internally, awaiting the next time
 * `closingNotifier` emits.
 *
 * ## Example
 *
 * On every click, emit array of most recent interval events
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const interval = interval(1000);
 * const buffered = interval.pipe(buffer(clicks));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link window}
 *
 * @param {Observable<any>} closingNotifier An Observable that signals the
 * buffer to be emitted on the output Observable.
 * @return {Observable<T[]>} An Observable of buffers, which are arrays of
 * values.
 * @method buffer
 * @owner Observable
 */
export function buffer(closingNotifier) {
    return function bufferOperatorFunction(source) {
        return source.lift(new BufferOperator(closingNotifier));
    };
}
class BufferOperator {
    constructor(closingNotifier) {
        this.closingNotifier = closingNotifier;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferSubscriber(subscriber, this.closingNotifier));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferSubscriber extends OuterSubscriber {
    constructor(destination, closingNotifier) {
        super(destination);
        this.buffer = [];
        this.add(subscribeToResult(this, closingNotifier));
    }
    _next(value) {
        this.buffer.push(value);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const buffer = this.buffer;
        this.buffer = [];
        this.destination.next(buffer);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2J1ZmZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUksZUFBZ0M7SUFDeEQsT0FBTyxTQUFTLHNCQUFzQixDQUFDLE1BQXFCO1FBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLGNBQWM7SUFFbEIsWUFBb0IsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO0lBQ3BELENBQUM7SUFFRCxJQUFJLENBQUMsVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxnQkFBb0IsU0FBUSxlQUF1QjtJQUd2RCxZQUFZLFdBQTRCLEVBQUUsZUFBZ0M7UUFDeEUsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSGIsV0FBTSxHQUFRLEVBQUUsQ0FBQztRQUl2QixJQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIHVudGlsIGBjbG9zaW5nTm90aWZpZXJgIGVtaXRzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db2xsZWN0cyB2YWx1ZXMgZnJvbSB0aGUgcGFzdCBhcyBhbiBhcnJheSwgYW5kIGVtaXRzXG4gKiB0aGF0IGFycmF5IG9ubHkgd2hlbiBhbm90aGVyIE9ic2VydmFibGUgZW1pdHMuPC9zcGFuPlxuICpcbiAqICFbXShidWZmZXIucG5nKVxuICpcbiAqIEJ1ZmZlcnMgdGhlIGluY29taW5nIE9ic2VydmFibGUgdmFsdWVzIHVudGlsIHRoZSBnaXZlbiBgY2xvc2luZ05vdGlmaWVyYFxuICogT2JzZXJ2YWJsZSBlbWl0cyBhIHZhbHVlLCBhdCB3aGljaCBwb2ludCBpdCBlbWl0cyB0aGUgYnVmZmVyIG9uIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUgYW5kIHN0YXJ0cyBhIG5ldyBidWZmZXIgaW50ZXJuYWxseSwgYXdhaXRpbmcgdGhlIG5leHQgdGltZVxuICogYGNsb3NpbmdOb3RpZmllcmAgZW1pdHMuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIE9uIGV2ZXJ5IGNsaWNrLCBlbWl0IGFycmF5IG9mIG1vc3QgcmVjZW50IGludGVydmFsIGV2ZW50c1xuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBpbnRlcnZhbCA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgYnVmZmVyZWQgPSBpbnRlcnZhbC5waXBlKGJ1ZmZlcihjbGlja3MpKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVGltZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKiBAc2VlIHtAbGluayB3aW5kb3d9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlPGFueT59IGNsb3NpbmdOb3RpZmllciBBbiBPYnNlcnZhYmxlIHRoYXQgc2lnbmFscyB0aGVcbiAqIGJ1ZmZlciB0byBiZSBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gT2JzZXJ2YWJsZSBvZiBidWZmZXJzLCB3aGljaCBhcmUgYXJyYXlzIG9mXG4gKiB2YWx1ZXMuXG4gKiBAbWV0aG9kIGJ1ZmZlclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcjxUPihjbG9zaW5nTm90aWZpZXI6IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPiB7XG4gIHJldHVybiBmdW5jdGlvbiBidWZmZXJPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgQnVmZmVyT3BlcmF0b3I8VD4oY2xvc2luZ05vdGlmaWVyKSk7XG4gIH07XG59XG5cbmNsYXNzIEJ1ZmZlck9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbG9zaW5nTm90aWZpZXI6IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNsb3NpbmdOb3RpZmllcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIGFueT4ge1xuICBwcml2YXRlIGJ1ZmZlcjogVFtdID0gW107XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPiwgY2xvc2luZ05vdGlmaWVyOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgY2xvc2luZ05vdGlmaWVyKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpIHtcbiAgICB0aGlzLmJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIHRoaXMuYnVmZmVyID0gW107XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gIH1cbn1cbiJdfQ==