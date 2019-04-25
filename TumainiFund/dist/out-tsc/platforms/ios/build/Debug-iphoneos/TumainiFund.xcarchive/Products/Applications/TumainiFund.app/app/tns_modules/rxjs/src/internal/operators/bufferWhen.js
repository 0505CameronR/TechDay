import { Subscription } from '../Subscription';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Buffers the source Observable values, using a factory function of closing
 * Observables to determine when to close, emit, and reset the buffer.
 *
 * <span class="informal">Collects values from the past as an array. When it
 * starts collecting values, it calls a function that returns an Observable that
 * tells when to close the buffer and restart collecting.</span>
 *
 * ![](bufferWhen.png)
 *
 * Opens a buffer immediately, then closes the buffer when the observable
 * returned by calling `closingSelector` function emits a value. When it closes
 * the buffer, it immediately opens a new buffer and repeats the process.
 *
 * ## Example
 *
 * Emit an array of the last clicks every [1-5] random seconds
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferWhen(() =>
 *   interval(1000 + Math.random() * 4000)
 * ));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link windowWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals buffer closure.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferWhen
 * @owner Observable
 */
export function bufferWhen(closingSelector) {
    return function (source) {
        return source.lift(new BufferWhenOperator(closingSelector));
    };
}
class BufferWhenOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferWhenSubscriber(subscriber, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferWhenSubscriber extends OuterSubscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.closingSelector = closingSelector;
        this.subscribing = false;
        this.openBuffer();
    }
    _next(value) {
        this.buffer.push(value);
    }
    _complete() {
        const buffer = this.buffer;
        if (buffer) {
            this.destination.next(buffer);
        }
        super._complete();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        this.buffer = null;
        this.subscribing = false;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openBuffer();
    }
    notifyComplete() {
        if (this.subscribing) {
            this.complete();
        }
        else {
            this.openBuffer();
        }
    }
    openBuffer() {
        let { closingSubscription } = this;
        if (closingSubscription) {
            this.remove(closingSubscription);
            closingSubscription.unsubscribe();
        }
        const buffer = this.buffer;
        if (this.buffer) {
            this.destination.next(buffer);
        }
        this.buffer = [];
        const closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            this.error(errorObject.e);
        }
        else {
            closingSubscription = new Subscription();
            this.closingSubscription = closingSubscription;
            this.add(closingSubscription);
            this.subscribing = true;
            closingSubscription.add(subscribeToResult(this, closingNotifier));
            this.subscribing = false;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyV2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzQ0c7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFJLGVBQXNDO0lBQ2xFLE9BQU8sVUFBVSxNQUFxQjtRQUNwQyxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLGtCQUFrQjtJQUV0QixZQUFvQixlQUFzQztRQUF0QyxvQkFBZSxHQUFmLGVBQWUsQ0FBdUI7SUFDMUQsQ0FBQztJQUVELElBQUksQ0FBQyxVQUEyQixFQUFFLE1BQVc7UUFDM0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLG9CQUF3QixTQUFRLGVBQXVCO0lBSzNELFlBQVksV0FBNEIsRUFBVSxlQUFzQztRQUN0RixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFENkIsb0JBQWUsR0FBZixlQUFlLENBQXVCO1FBSGhGLGdCQUFXLEdBQVksS0FBSyxDQUFDO1FBS25DLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLFNBQVM7UUFDakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBQ0QsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsWUFBWTtRQUNWLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ25CLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWUsRUFDOUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUFpQztRQUMxQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ2pCO2FBQU07WUFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQsVUFBVTtRQUVSLElBQUksRUFBRSxtQkFBbUIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUVuQyxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztZQUNqQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNuQztRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsQ0FBQztRQUVqQixNQUFNLGVBQWUsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUM7UUFFekQsSUFBSSxlQUFlLEtBQUssV0FBVyxFQUFFO1lBQ25DLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNCO2FBQU07WUFDTCxtQkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ3pDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztZQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7WUFDeEIsbUJBQW1CLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1lBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJ1ZmZlcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcywgdXNpbmcgYSBmYWN0b3J5IGZ1bmN0aW9uIG9mIGNsb3NpbmdcbiAqIE9ic2VydmFibGVzIHRvIGRldGVybWluZSB3aGVuIHRvIGNsb3NlLCBlbWl0LCBhbmQgcmVzZXQgdGhlIGJ1ZmZlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29sbGVjdHMgdmFsdWVzIGZyb20gdGhlIHBhc3QgYXMgYW4gYXJyYXkuIFdoZW4gaXRcbiAqIHN0YXJ0cyBjb2xsZWN0aW5nIHZhbHVlcywgaXQgY2FsbHMgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiB0ZWxscyB3aGVuIHRvIGNsb3NlIHRoZSBidWZmZXIgYW5kIHJlc3RhcnQgY29sbGVjdGluZy48L3NwYW4+XG4gKlxuICogIVtdKGJ1ZmZlcldoZW4ucG5nKVxuICpcbiAqIE9wZW5zIGEgYnVmZmVyIGltbWVkaWF0ZWx5LCB0aGVuIGNsb3NlcyB0aGUgYnVmZmVyIHdoZW4gdGhlIG9ic2VydmFibGVcbiAqIHJldHVybmVkIGJ5IGNhbGxpbmcgYGNsb3NpbmdTZWxlY3RvcmAgZnVuY3Rpb24gZW1pdHMgYSB2YWx1ZS4gV2hlbiBpdCBjbG9zZXNcbiAqIHRoZSBidWZmZXIsIGl0IGltbWVkaWF0ZWx5IG9wZW5zIGEgbmV3IGJ1ZmZlciBhbmQgcmVwZWF0cyB0aGUgcHJvY2Vzcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogRW1pdCBhbiBhcnJheSBvZiB0aGUgbGFzdCBjbGlja3MgZXZlcnkgWzEtNV0gcmFuZG9tIHNlY29uZHNcbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJXaGVuKCgpID0+XG4gKiAgIGludGVydmFsKDEwMDAgKyBNYXRoLnJhbmRvbSgpICogNDAwMClcbiAqICkpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVGltZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1doZW59XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBPYnNlcnZhYmxlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHNpZ25hbHMgYnVmZmVyIGNsb3N1cmUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFRbXT59IEFuIG9ic2VydmFibGUgb2YgYXJyYXlzIG9mIGJ1ZmZlcmVkIHZhbHVlcy5cbiAqIEBtZXRob2QgYnVmZmVyV2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlcldoZW48VD4oY2xvc2luZ1NlbGVjdG9yOiAoKSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbXT4ge1xuICByZXR1cm4gZnVuY3Rpb24gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgQnVmZmVyV2hlbk9wZXJhdG9yKGNsb3NpbmdTZWxlY3RvcikpO1xuICB9O1xufVxuXG5jbGFzcyBCdWZmZXJXaGVuT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUW10+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VFtdPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBCdWZmZXJXaGVuU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNsb3NpbmdTZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJXaGVuU3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBhbnk+IHtcbiAgcHJpdmF0ZSBidWZmZXI6IFRbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpYmluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGNsb3NpbmdTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUW10+LCBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMub3BlbkJ1ZmZlcigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy5idWZmZXIucHVzaCh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuYnVmZmVyID0gbnVsbDtcbiAgICB0aGlzLnN1YnNjcmliaW5nID0gZmFsc2U7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLm9wZW5CdWZmZXIoKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnN1YnNjcmliaW5nKSB7XG4gICAgICB0aGlzLmNvbXBsZXRlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub3BlbkJ1ZmZlcigpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5CdWZmZXIoKSB7XG5cbiAgICBsZXQgeyBjbG9zaW5nU3Vic2NyaXB0aW9uIH0gPSB0aGlzO1xuXG4gICAgaWYgKGNsb3NpbmdTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMucmVtb3ZlKGNsb3NpbmdTdWJzY3JpcHRpb24pO1xuICAgICAgY2xvc2luZ1N1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmICh0aGlzLmJ1ZmZlcikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgdGhpcy5idWZmZXIgPSBbXTtcblxuICAgIGNvbnN0IGNsb3NpbmdOb3RpZmllciA9IHRyeUNhdGNoKHRoaXMuY2xvc2luZ1NlbGVjdG9yKSgpO1xuXG4gICAgaWYgKGNsb3NpbmdOb3RpZmllciA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgIHRoaXMuZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICB0aGlzLmNsb3NpbmdTdWJzY3JpcHRpb24gPSBjbG9zaW5nU3Vic2NyaXB0aW9uO1xuICAgICAgdGhpcy5hZGQoY2xvc2luZ1N1YnNjcmlwdGlvbik7XG4gICAgICB0aGlzLnN1YnNjcmliaW5nID0gdHJ1ZTtcbiAgICAgIGNsb3NpbmdTdWJzY3JpcHRpb24uYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGNsb3NpbmdOb3RpZmllcikpO1xuICAgICAgdGhpcy5zdWJzY3JpYmluZyA9IGZhbHNlO1xuICAgIH1cbiAgfVxufVxuIl19