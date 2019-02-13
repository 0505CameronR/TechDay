import { Subject } from '../Subject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Branch out the source Observable values as a nested Observable whenever
 * `windowBoundaries` emits.
 *
 * <span class="informal">It's like {@link buffer}, but emits a nested Observable
 * instead of an array.</span>
 *
 * ![](window.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping
 * windows. It emits the current window and opens a new one whenever the
 * Observable `windowBoundaries` emits an item. Because each window is an
 * Observable, the output is a higher-order Observable.
 *
 * ## Example
 * In every window of 1 second each, emit at most 2 click events
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const interval = interval(1000);
 * const result = clicks.pipe(
 *   window(interval),
 *   map(win => win.take(2)), // each window has at most 2 emissions
 *   mergeAll(),              // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link windowWhen}
 * @see {@link buffer}
 *
 * @param {Observable<any>} windowBoundaries An Observable that completes the
 * previous window and starts a new window.
 * @return {Observable<Observable<T>>} An Observable of windows, which are
 * Observables emitting values of the source Observable.
 * @method window
 * @owner Observable
 */
export function window(windowBoundaries) {
    return function windowOperatorFunction(source) {
        return source.lift(new WindowOperator(windowBoundaries));
    };
}
class WindowOperator {
    constructor(windowBoundaries) {
        this.windowBoundaries = windowBoundaries;
    }
    call(subscriber, source) {
        const windowSubscriber = new WindowSubscriber(subscriber);
        const sourceSubscription = source.subscribe(windowSubscriber);
        if (!sourceSubscription.closed) {
            windowSubscriber.add(subscribeToResult(windowSubscriber, this.windowBoundaries));
        }
        return sourceSubscription;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.window = new Subject();
        destination.next(this.window);
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow();
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this._complete();
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        this.window = null;
    }
    openWindow() {
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const destination = this.destination;
        const newWindow = this.window = new Subject();
        destination.next(newWindow);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUNHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBSSxnQkFBaUM7SUFDekQsT0FBTyxTQUFTLHNCQUFzQixDQUFDLE1BQXFCO1FBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sY0FBYztJQUVsQixZQUFvQixnQkFBaUM7UUFBakMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtJQUNyRCxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxNQUFNLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUM5QixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUNsRjtRQUNELE9BQU8sa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sZ0JBQW9CLFNBQVEsZUFBdUI7SUFJdkQsWUFBWSxXQUFzQztRQUNoRCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFIYixXQUFNLEdBQWUsSUFBSSxPQUFPLEVBQUssQ0FBQztRQUk1QyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVSxFQUFFLFFBQWlDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFpQztRQUM5QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxNQUFNLENBQUMsR0FBUTtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN2QjtRQUNELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBSyxDQUFDO1FBQ2pELFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuXG4vKipcbiAqIEJyYW5jaCBvdXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBhcyBhIG5lc3RlZCBPYnNlcnZhYmxlIHdoZW5ldmVyXG4gKiBgd2luZG93Qm91bmRhcmllc2AgZW1pdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyfSwgYnV0IGVtaXRzIGEgbmVzdGVkIE9ic2VydmFibGVcbiAqIGluc3RlYWQgb2YgYW4gYXJyYXkuPC9zcGFuPlxuICpcbiAqICFbXSh3aW5kb3cucG5nKVxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdpbmRvd3Mgb2YgaXRlbXMgaXQgY29sbGVjdHMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGUgb3V0cHV0IE9ic2VydmFibGUgZW1pdHMgY29ubmVjdGVkLCBub24tb3ZlcmxhcHBpbmdcbiAqIHdpbmRvd3MuIEl0IGVtaXRzIHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgb3BlbnMgYSBuZXcgb25lIHdoZW5ldmVyIHRoZVxuICogT2JzZXJ2YWJsZSBgd2luZG93Qm91bmRhcmllc2AgZW1pdHMgYW4gaXRlbS4gQmVjYXVzZSBlYWNoIHdpbmRvdyBpcyBhblxuICogT2JzZXJ2YWJsZSwgdGhlIG91dHB1dCBpcyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEluIGV2ZXJ5IHdpbmRvdyBvZiAxIHNlY29uZCBlYWNoLCBlbWl0IGF0IG1vc3QgMiBjbGljayBldmVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBpbnRlcnZhbCA9IGludGVydmFsKDEwMDApO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoXG4gKiAgIHdpbmRvdyhpbnRlcnZhbCksXG4gKiAgIG1hcCh3aW4gPT4gd2luLnRha2UoMikpLCAvLyBlYWNoIHdpbmRvdyBoYXMgYXQgbW9zdCAyIGVtaXNzaW9uc1xuICogICBtZXJnZUFsbCgpLCAgICAgICAgICAgICAgLy8gZmxhdHRlbiB0aGUgT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlc1xuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIHdpbmRvd0NvdW50fVxuICogQHNlZSB7QGxpbmsgd2luZG93VGltZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1doZW59XG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlPGFueT59IHdpbmRvd0JvdW5kYXJpZXMgQW4gT2JzZXJ2YWJsZSB0aGF0IGNvbXBsZXRlcyB0aGVcbiAqIHByZXZpb3VzIHdpbmRvdyBhbmQgc3RhcnRzIGEgbmV3IHdpbmRvdy5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8T2JzZXJ2YWJsZTxUPj59IEFuIE9ic2VydmFibGUgb2Ygd2luZG93cywgd2hpY2ggYXJlXG4gKiBPYnNlcnZhYmxlcyBlbWl0dGluZyB2YWx1ZXMgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCB3aW5kb3dcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3c8VD4od2luZG93Qm91bmRhcmllczogT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBPYnNlcnZhYmxlPFQ+PiB7XG4gIHJldHVybiBmdW5jdGlvbiB3aW5kb3dPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgV2luZG93T3BlcmF0b3Iod2luZG93Qm91bmRhcmllcykpO1xuICB9O1xufVxuXG5jbGFzcyBXaW5kb3dPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIE9ic2VydmFibGU8VD4+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdpbmRvd0JvdW5kYXJpZXM6IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgY29uc3Qgd2luZG93U3Vic2NyaWJlciA9IG5ldyBXaW5kb3dTdWJzY3JpYmVyKHN1YnNjcmliZXIpO1xuICAgIGNvbnN0IHNvdXJjZVN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUod2luZG93U3Vic2NyaWJlcik7XG4gICAgaWYgKCFzb3VyY2VTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICB3aW5kb3dTdWJzY3JpYmVyLmFkZChzdWJzY3JpYmVUb1Jlc3VsdCh3aW5kb3dTdWJzY3JpYmVyLCB0aGlzLndpbmRvd0JvdW5kYXJpZXMpKTtcbiAgICB9XG4gICAgcmV0dXJuIHNvdXJjZVN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgV2luZG93U3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBhbnk+IHtcblxuICBwcml2YXRlIHdpbmRvdzogU3ViamVjdDxUPiA9IG5ldyBTdWJqZWN0PFQ+KCk7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgZGVzdGluYXRpb24ubmV4dCh0aGlzLndpbmRvdyk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLm9wZW5XaW5kb3coKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycm9yOiBhbnksIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMuX2Vycm9yKGVycm9yKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMuX2NvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5lcnJvcihlcnIpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuY29tcGxldGUoKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLndpbmRvdyA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIG9wZW5XaW5kb3coKTogdm9pZCAge1xuICAgIGNvbnN0IHByZXZXaW5kb3cgPSB0aGlzLndpbmRvdztcbiAgICBpZiAocHJldldpbmRvdykge1xuICAgICAgcHJldldpbmRvdy5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgY29uc3QgbmV3V2luZG93ID0gdGhpcy53aW5kb3cgPSBuZXcgU3ViamVjdDxUPigpO1xuICAgIGRlc3RpbmF0aW9uLm5leHQobmV3V2luZG93KTtcbiAgfVxufVxuIl19