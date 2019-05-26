import { Subscription } from '../Subscription';
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
 * import { fromEvent, interval } from 'rxjs';
 * import { bufferWhen } from 'rxjs/operators';
 *
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
        let closingNotifier;
        try {
            const { closingSelector } = this;
            closingNotifier = closingSelector();
        }
        catch (err) {
            return this.error(err);
        }
        closingSubscription = new Subscription();
        this.closingSubscription = closingSubscription;
        this.add(closingSubscription);
        this.subscribing = true;
        closingSubscription.add(subscribeToResult(this, closingNotifier));
        this.subscribing = false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyV2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9idWZmZXJXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBSSxlQUFzQztJQUNsRSxPQUFPLFVBQVUsTUFBcUI7UUFDcEMsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxrQkFBa0I7SUFFdEIsWUFBb0IsZUFBc0M7UUFBdEMsb0JBQWUsR0FBZixlQUFlLENBQXVCO0lBQzFELENBQUM7SUFFRCxJQUFJLENBQUMsVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN0RixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxvQkFBd0IsU0FBUSxlQUF1QjtJQUszRCxZQUFZLFdBQTRCLEVBQVUsZUFBc0M7UUFDdEYsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRDZCLG9CQUFlLEdBQWYsZUFBZSxDQUF1QjtRQUhoRixnQkFBVyxHQUFZLEtBQUssQ0FBQztRQUtuQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxTQUFTO1FBQ2pCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxNQUFNLEVBQUU7WUFDVixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUNELEtBQUssQ0FBQyxTQUFTLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLFlBQVk7UUFDVixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztRQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztJQUMzQixDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNqQjthQUFNO1lBQ0wsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO1NBQ25CO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixJQUFJLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFbkMsSUFBSSxtQkFBbUIsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7WUFDakMsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbkM7UUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFakIsSUFBSSxlQUFlLENBQUM7UUFDcEIsSUFBSTtZQUNGLE1BQU0sRUFBRSxlQUFlLEVBQUUsR0FBRyxJQUFJLENBQUM7WUFDakMsZUFBZSxHQUFHLGVBQWUsRUFBRSxDQUFDO1NBQ3JDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDeEI7UUFDRCxtQkFBbUIsR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3pDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztRQUMvQyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDeEIsbUJBQW1CLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLElBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzLCB1c2luZyBhIGZhY3RvcnkgZnVuY3Rpb24gb2YgY2xvc2luZ1xuICogT2JzZXJ2YWJsZXMgdG8gZGV0ZXJtaW5lIHdoZW4gdG8gY2xvc2UsIGVtaXQsIGFuZCByZXNldCB0aGUgYnVmZmVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Db2xsZWN0cyB2YWx1ZXMgZnJvbSB0aGUgcGFzdCBhcyBhbiBhcnJheS4gV2hlbiBpdFxuICogc3RhcnRzIGNvbGxlY3RpbmcgdmFsdWVzLCBpdCBjYWxscyBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXRcbiAqIHRlbGxzIHdoZW4gdG8gY2xvc2UgdGhlIGJ1ZmZlciBhbmQgcmVzdGFydCBjb2xsZWN0aW5nLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyV2hlbi5wbmcpXG4gKlxuICogT3BlbnMgYSBidWZmZXIgaW1tZWRpYXRlbHksIHRoZW4gY2xvc2VzIHRoZSBidWZmZXIgd2hlbiB0aGUgb2JzZXJ2YWJsZVxuICogcmV0dXJuZWQgYnkgY2FsbGluZyBgY2xvc2luZ1NlbGVjdG9yYCBmdW5jdGlvbiBlbWl0cyBhIHZhbHVlLiBXaGVuIGl0IGNsb3Nlc1xuICogdGhlIGJ1ZmZlciwgaXQgaW1tZWRpYXRlbHkgb3BlbnMgYSBuZXcgYnVmZmVyIGFuZCByZXBlYXRzIHRoZSBwcm9jZXNzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBFbWl0IGFuIGFycmF5IG9mIHRoZSBsYXN0IGNsaWNrcyBldmVyeSBbMS01XSByYW5kb20gc2Vjb25kc1xuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IGJ1ZmZlcldoZW4gfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyV2hlbigoKSA9PlxuICogICBpbnRlcnZhbCgxMDAwICsgTWF0aC5yYW5kb20oKSAqIDQwMDApXG4gKiApKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqXG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKiBAc2VlIHtAbGluayBidWZmZXJDb3VudH1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRpbWV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUb2dnbGV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dXaGVufVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogT2JzZXJ2YWJsZX0gY2xvc2luZ1NlbGVjdG9yIEEgZnVuY3Rpb24gdGhhdCB0YWtlcyBub1xuICogYXJndW1lbnRzIGFuZCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBzaWduYWxzIGJ1ZmZlciBjbG9zdXJlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUW10+fSBBbiBvYnNlcnZhYmxlIG9mIGFycmF5cyBvZiBidWZmZXJlZCB2YWx1ZXMuXG4gKiBAbWV0aG9kIGJ1ZmZlcldoZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJXaGVuPFQ+KGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIChzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IEJ1ZmZlcldoZW5PcGVyYXRvcihjbG9zaW5nU2VsZWN0b3IpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyV2hlbk9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyV2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jbG9zaW5nU2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyV2hlblN1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgYW55PiB7XG4gIHByaXZhdGUgYnVmZmVyOiBUW107XG4gIHByaXZhdGUgc3Vic2NyaWJpbmc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBjbG9zaW5nU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPiwgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLm9wZW5CdWZmZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRoaXMuYnVmZmVyLnB1c2godmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBpZiAoYnVmZmVyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICB9XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmJ1ZmZlciA9IG51bGw7XG4gICAgdGhpcy5zdWJzY3JpYmluZyA9IGZhbHNlO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5vcGVuQnVmZmVyKCk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpYmluZykge1xuICAgICAgdGhpcy5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9wZW5CdWZmZXIoKTtcbiAgICB9XG4gIH1cblxuICBvcGVuQnVmZmVyKCkge1xuICAgIGxldCB7IGNsb3NpbmdTdWJzY3JpcHRpb24gfSA9IHRoaXM7XG5cbiAgICBpZiAoY2xvc2luZ1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5yZW1vdmUoY2xvc2luZ1N1YnNjcmlwdGlvbik7XG4gICAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgaWYgKHRoaXMuYnVmZmVyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICB9XG5cbiAgICB0aGlzLmJ1ZmZlciA9IFtdO1xuXG4gICAgbGV0IGNsb3NpbmdOb3RpZmllcjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBjbG9zaW5nU2VsZWN0b3IgfSA9IHRoaXM7XG4gICAgICBjbG9zaW5nTm90aWZpZXIgPSBjbG9zaW5nU2VsZWN0b3IoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHJldHVybiB0aGlzLmVycm9yKGVycik7XG4gICAgfVxuICAgIGNsb3NpbmdTdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgdGhpcy5jbG9zaW5nU3Vic2NyaXB0aW9uID0gY2xvc2luZ1N1YnNjcmlwdGlvbjtcbiAgICB0aGlzLmFkZChjbG9zaW5nU3Vic2NyaXB0aW9uKTtcbiAgICB0aGlzLnN1YnNjcmliaW5nID0gdHJ1ZTtcbiAgICBjbG9zaW5nU3Vic2NyaXB0aW9uLmFkZChzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIpKTtcbiAgICB0aGlzLnN1YnNjcmliaW5nID0gZmFsc2U7XG4gIH1cbn1cbiJdfQ==