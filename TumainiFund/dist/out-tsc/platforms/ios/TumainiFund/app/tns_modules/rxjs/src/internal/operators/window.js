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
 * import { fromEvent, interval } from 'rxjs';
 * import { window, mergeAll, map take } from 'rxjs/operators';
 *
 *  const clicks = fromEvent(document, 'click');
 *  const sec = interval(1000);
 *  const result = clicks.pipe(
 *      window(sec),
 *      map(win => win.pipe(take(2))), // each window has at most 2 emissions
 *      mergeAll(),              // flatten the Observable-of-Observables
 *  );
 *  result.subscribe(x => console.log(x));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvdy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMENHO0FBQ0gsTUFBTSxVQUFVLE1BQU0sQ0FBSSxnQkFBaUM7SUFDekQsT0FBTyxTQUFTLHNCQUFzQixDQUFDLE1BQXFCO1FBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7SUFDM0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sY0FBYztJQUVsQixZQUFvQixnQkFBaUM7UUFBakMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFpQjtJQUNyRCxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxNQUFNLGdCQUFnQixHQUFHLElBQUksZ0JBQWdCLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDMUQsTUFBTSxrQkFBa0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDOUQsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRTtZQUM5QixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztTQUNsRjtRQUNELE9BQU8sa0JBQWtCLENBQUM7SUFDNUIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sZ0JBQW9CLFNBQVEsZUFBdUI7SUFJdkQsWUFBWSxXQUFzQztRQUNoRCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFIYixXQUFNLEdBQWUsSUFBSSxPQUFPLEVBQUssQ0FBQztRQUk1QyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVSxFQUFFLFFBQWlDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFpQztRQUM5QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzFCLENBQUM7SUFFUyxNQUFNLENBQUMsR0FBUTtRQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUVPLFVBQVU7UUFDaEIsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN2QjtRQUNELE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBSyxDQUFDO1FBQ2pELFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuXG4vKipcbiAqIEJyYW5jaCBvdXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBhcyBhIG5lc3RlZCBPYnNlcnZhYmxlIHdoZW5ldmVyXG4gKiBgd2luZG93Qm91bmRhcmllc2AgZW1pdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyfSwgYnV0IGVtaXRzIGEgbmVzdGVkIE9ic2VydmFibGVcbiAqIGluc3RlYWQgb2YgYW4gYXJyYXkuPC9zcGFuPlxuICpcbiAqICFbXSh3aW5kb3cucG5nKVxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdpbmRvd3Mgb2YgaXRlbXMgaXQgY29sbGVjdHMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGUgb3V0cHV0IE9ic2VydmFibGUgZW1pdHMgY29ubmVjdGVkLCBub24tb3ZlcmxhcHBpbmdcbiAqIHdpbmRvd3MuIEl0IGVtaXRzIHRoZSBjdXJyZW50IHdpbmRvdyBhbmQgb3BlbnMgYSBuZXcgb25lIHdoZW5ldmVyIHRoZVxuICogT2JzZXJ2YWJsZSBgd2luZG93Qm91bmRhcmllc2AgZW1pdHMgYW4gaXRlbS4gQmVjYXVzZSBlYWNoIHdpbmRvdyBpcyBhblxuICogT2JzZXJ2YWJsZSwgdGhlIG91dHB1dCBpcyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEluIGV2ZXJ5IHdpbmRvdyBvZiAxIHNlY29uZCBlYWNoLCBlbWl0IGF0IG1vc3QgMiBjbGljayBldmVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHdpbmRvdywgbWVyZ2VBbGwsIG1hcCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqICBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogIGNvbnN0IHNlYyA9IGludGVydmFsKDEwMDApO1xuICogIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKFxuICogICAgICB3aW5kb3coc2VjKSxcbiAqICAgICAgbWFwKHdpbiA9PiB3aW4ucGlwZSh0YWtlKDIpKSksIC8vIGVhY2ggd2luZG93IGhhcyBhdCBtb3N0IDIgZW1pc3Npb25zXG4gKiAgICAgIG1lcmdlQWxsKCksICAgICAgICAgICAgICAvLyBmbGF0dGVuIHRoZSBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gKiAgKTtcbiAqICByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKiBAc2VlIHtAbGluayB3aW5kb3dDb3VudH1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RpbWV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUb2dnbGV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dXaGVufVxuICogQHNlZSB7QGxpbmsgYnVmZmVyfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZTxhbnk+fSB3aW5kb3dCb3VuZGFyaWVzIEFuIE9ic2VydmFibGUgdGhhdCBjb21wbGV0ZXMgdGhlXG4gKiBwcmV2aW91cyB3aW5kb3cgYW5kIHN0YXJ0cyBhIG5ldyB3aW5kb3cuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPE9ic2VydmFibGU8VD4+fSBBbiBPYnNlcnZhYmxlIG9mIHdpbmRvd3MsIHdoaWNoIGFyZVxuICogT2JzZXJ2YWJsZXMgZW1pdHRpbmcgdmFsdWVzIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2Qgd2luZG93XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gd2luZG93PFQ+KHdpbmRvd0JvdW5kYXJpZXM6IE9ic2VydmFibGU8YW55Pik6IE9wZXJhdG9yRnVuY3Rpb248VCwgT2JzZXJ2YWJsZTxUPj4ge1xuICByZXR1cm4gZnVuY3Rpb24gd2luZG93T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFdpbmRvd09wZXJhdG9yKHdpbmRvd0JvdW5kYXJpZXMpKTtcbiAgfTtcbn1cblxuY2xhc3MgV2luZG93T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBPYnNlcnZhYmxlPFQ+PiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSB3aW5kb3dCb3VuZGFyaWVzOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIGNvbnN0IHdpbmRvd1N1YnNjcmliZXIgPSBuZXcgV2luZG93U3Vic2NyaWJlcihzdWJzY3JpYmVyKTtcbiAgICBjb25zdCBzb3VyY2VTdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHdpbmRvd1N1YnNjcmliZXIpO1xuICAgIGlmICghc291cmNlU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgd2luZG93U3Vic2NyaWJlci5hZGQoc3Vic2NyaWJlVG9SZXN1bHQod2luZG93U3Vic2NyaWJlciwgdGhpcy53aW5kb3dCb3VuZGFyaWVzKSk7XG4gICAgfVxuICAgIHJldHVybiBzb3VyY2VTdWJzY3JpcHRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFdpbmRvd1N1YnNjcmliZXI8VD4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgYW55PiB7XG5cbiAgcHJpdmF0ZSB3aW5kb3c6IFN1YmplY3Q8VD4gPSBuZXcgU3ViamVjdDxUPigpO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIGRlc3RpbmF0aW9uLm5leHQodGhpcy53aW5kb3cpO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5vcGVuV2luZG93KCk7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcihlcnJvcik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuZXJyb3IoZXJyKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMud2luZG93LmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgdGhpcy53aW5kb3cgPSBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuV2luZG93KCk6IHZvaWQgIHtcbiAgICBjb25zdCBwcmV2V2luZG93ID0gdGhpcy53aW5kb3c7XG4gICAgaWYgKHByZXZXaW5kb3cpIHtcbiAgICAgIHByZXZXaW5kb3cuY29tcGxldGUoKTtcbiAgICB9XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuICAgIGNvbnN0IG5ld1dpbmRvdyA9IHRoaXMud2luZG93ID0gbmV3IFN1YmplY3Q8VD4oKTtcbiAgICBkZXN0aW5hdGlvbi5uZXh0KG5ld1dpbmRvdyk7XG4gIH1cbn1cbiJdfQ==