import { Subject } from '../Subject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Branch out the source Observable values as a nested Observable using a
 * factory function of closing Observables to determine when to start a new
 * window.
 *
 * <span class="informal">It's like {@link bufferWhen}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowWhen.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits connected, non-overlapping windows.
 * It emits the current window and opens a new one whenever the Observable
 * produced by the specified `closingSelector` function emits an item. The first
 * window is opened immediately when subscribing to the output Observable.
 *
 * ## Example
 * Emit only the first two clicks events in every window of [1-5] random seconds
 * ```javascript
 * import { fromEvent, interval } from 'rxjs';
 * import { windowWhen, map, mergeAll } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   windowWhen(() => interval(1000 + Math.random() * 4000)),
 *   map(win => win.pipe(take(2))),     // each window has at most 2 emissions
 *   mergeAll(),                        // flatten the Observable-of-Observables
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowToggle}
 * @see {@link bufferWhen}
 *
 * @param {function(): Observable} closingSelector A function that takes no
 * arguments and returns an Observable that signals (on either `next` or
 * `complete`) when to close the previous window and start a new one.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowWhen
 * @owner Observable
 */
export function windowWhen(closingSelector) {
    return function windowWhenOperatorFunction(source) {
        return source.lift(new WindowOperator(closingSelector));
    };
}
class WindowOperator {
    constructor(closingSelector) {
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowSubscriber(subscriber, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowSubscriber extends OuterSubscriber {
    constructor(destination, closingSelector) {
        super(destination);
        this.destination = destination;
        this.closingSelector = closingSelector;
        this.openWindow();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.openWindow(innerSub);
    }
    notifyError(error, innerSub) {
        this._error(error);
    }
    notifyComplete(innerSub) {
        this.openWindow(innerSub);
    }
    _next(value) {
        this.window.next(value);
    }
    _error(err) {
        this.window.error(err);
        this.destination.error(err);
        this.unsubscribeClosingNotification();
    }
    _complete() {
        this.window.complete();
        this.destination.complete();
        this.unsubscribeClosingNotification();
    }
    unsubscribeClosingNotification() {
        if (this.closingNotification) {
            this.closingNotification.unsubscribe();
        }
    }
    openWindow(innerSub = null) {
        if (innerSub) {
            this.remove(innerSub);
            innerSub.unsubscribe();
        }
        const prevWindow = this.window;
        if (prevWindow) {
            prevWindow.complete();
        }
        const window = this.window = new Subject();
        this.destination.next(window);
        let closingNotifier;
        try {
            const { closingSelector } = this;
            closingNotifier = closingSelector();
        }
        catch (e) {
            this.destination.error(e);
            this.window.error(e);
            return;
        }
        this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy93aW5kb3dXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILE1BQU0sVUFBVSxVQUFVLENBQUksZUFBc0M7SUFDbEUsT0FBTyxTQUFTLDBCQUEwQixDQUFDLE1BQXFCO1FBQzlELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBSSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLGNBQWM7SUFDbEIsWUFBb0IsZUFBc0M7UUFBdEMsb0JBQWUsR0FBZixlQUFlLENBQXVCO0lBQzFELENBQUM7SUFFRCxJQUFJLENBQUMsVUFBcUMsRUFBRSxNQUFXO1FBQ3JELE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUNsRixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxnQkFBb0IsU0FBUSxlQUF1QjtJQUl2RCxZQUFzQixXQUFzQyxFQUN4QyxlQUFzQztRQUN4RCxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFGQyxnQkFBVyxHQUFYLFdBQVcsQ0FBMkI7UUFDeEMsb0JBQWUsR0FBZixlQUFlLENBQXVCO1FBRXhELElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUNwQixDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFlLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBaUM7UUFDMUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQVUsRUFBRSxRQUFpQztRQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLENBQUM7SUFFRCxjQUFjLENBQUMsUUFBaUM7UUFDOUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVTLE1BQU0sQ0FBQyxHQUFRO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFUyxTQUFTO1FBQ2pCLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsOEJBQThCLEVBQUUsQ0FBQztJQUN4QyxDQUFDO0lBRU8sOEJBQThCO1FBQ3BDLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN4QztJQUNILENBQUM7SUFFTyxVQUFVLENBQUMsV0FBb0MsSUFBSTtRQUN6RCxJQUFJLFFBQVEsRUFBRTtZQUNaLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDdEIsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3hCO1FBRUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMvQixJQUFJLFVBQVUsRUFBRTtZQUNkLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUN2QjtRQUVELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUssQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixJQUFJLGVBQWUsQ0FBQztRQUNwQixJQUFJO1lBQ0YsTUFBTSxFQUFFLGVBQWUsRUFBRSxHQUFHLElBQUksQ0FBQztZQUNqQyxlQUFlLEdBQUcsZUFBZSxFQUFFLENBQUM7U0FDckM7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ2hGLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgdXNpbmcgYVxuICogZmFjdG9yeSBmdW5jdGlvbiBvZiBjbG9zaW5nIE9ic2VydmFibGVzIHRvIGRldGVybWluZSB3aGVuIHRvIHN0YXJ0IGEgbmV3XG4gKiB3aW5kb3cuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyV2hlbn0sIGJ1dCBlbWl0cyBhIG5lc3RlZFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGFuIGFycmF5Ljwvc3Bhbj5cbiAqXG4gKiAhW10od2luZG93V2hlbi5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyBjb25uZWN0ZWQsIG5vbi1vdmVybGFwcGluZyB3aW5kb3dzLlxuICogSXQgZW1pdHMgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBvcGVucyBhIG5ldyBvbmUgd2hlbmV2ZXIgdGhlIE9ic2VydmFibGVcbiAqIHByb2R1Y2VkIGJ5IHRoZSBzcGVjaWZpZWQgYGNsb3NpbmdTZWxlY3RvcmAgZnVuY3Rpb24gZW1pdHMgYW4gaXRlbS4gVGhlIGZpcnN0XG4gKiB3aW5kb3cgaXMgb3BlbmVkIGltbWVkaWF0ZWx5IHdoZW4gc3Vic2NyaWJpbmcgdG8gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgb25seSB0aGUgZmlyc3QgdHdvIGNsaWNrcyBldmVudHMgaW4gZXZlcnkgd2luZG93IG9mIFsxLTVdIHJhbmRvbSBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB3aW5kb3dXaGVuLCBtYXAsIG1lcmdlQWxsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShcbiAqICAgd2luZG93V2hlbigoKSA9PiBpbnRlcnZhbCgxMDAwICsgTWF0aC5yYW5kb20oKSAqIDQwMDApKSxcbiAqICAgbWFwKHdpbiA9PiB3aW4ucGlwZSh0YWtlKDIpKSksICAgICAvLyBlYWNoIHdpbmRvdyBoYXMgYXQgbW9zdCAyIGVtaXNzaW9uc1xuICogICBtZXJnZUFsbCgpLCAgICAgICAgICAgICAgICAgICAgICAgIC8vIGZsYXR0ZW4gdGhlIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXNcbiAqICk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgd2luZG93fVxuICogQHNlZSB7QGxpbmsgd2luZG93Q291bnR9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUaW1lfVxuICogQHNlZSB7QGxpbmsgd2luZG93VG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IE9ic2VydmFibGV9IGNsb3NpbmdTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXMgbm9cbiAqIGFyZ3VtZW50cyBhbmQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgc2lnbmFscyAob24gZWl0aGVyIGBuZXh0YCBvclxuICogYGNvbXBsZXRlYCkgd2hlbiB0byBjbG9zZSB0aGUgcHJldmlvdXMgd2luZG93IGFuZCBzdGFydCBhIG5ldyBvbmUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPE9ic2VydmFibGU8VD4+fSBBbiBvYnNlcnZhYmxlIG9mIHdpbmRvd3MsIHdoaWNoIGluIHR1cm5cbiAqIGFyZSBPYnNlcnZhYmxlcy5cbiAqIEBtZXRob2Qgd2luZG93V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1doZW48VD4oY2xvc2luZ1NlbGVjdG9yOiAoKSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdpbmRvd1doZW5PcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgV2luZG93T3BlcmF0b3I8VD4oY2xvc2luZ1NlbGVjdG9yKSk7XG4gIH07XG59XG5cbmNsYXNzIFdpbmRvd09wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgT2JzZXJ2YWJsZTxUPj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgV2luZG93U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNsb3NpbmdTZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaW5kb3dTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIGFueT4ge1xuICBwcml2YXRlIHdpbmRvdzogU3ViamVjdDxUPjtcbiAgcHJpdmF0ZSBjbG9zaW5nTm90aWZpY2F0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMub3BlbldpbmRvdygpO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBhbnk+KTogdm9pZCB7XG4gICAgdGhpcy5vcGVuV2luZG93KGlubmVyU3ViKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycm9yOiBhbnksIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMuX2Vycm9yKGVycm9yKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMub3BlbldpbmRvdyhpbm5lclN1Yik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5lcnJvcihlcnIpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlQ2xvc2luZ05vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLndpbmRvdy5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlQ2xvc2luZ05vdGlmaWNhdGlvbigpO1xuICB9XG5cbiAgcHJpdmF0ZSB1bnN1YnNjcmliZUNsb3NpbmdOb3RpZmljYXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2xvc2luZ05vdGlmaWNhdGlvbikge1xuICAgICAgdGhpcy5jbG9zaW5nTm90aWZpY2F0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBvcGVuV2luZG93KGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55PiA9IG51bGwpOiB2b2lkIHtcbiAgICBpZiAoaW5uZXJTdWIpIHtcbiAgICAgIHRoaXMucmVtb3ZlKGlubmVyU3ViKTtcbiAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgcHJldldpbmRvdyA9IHRoaXMud2luZG93O1xuICAgIGlmIChwcmV2V2luZG93KSB7XG4gICAgICBwcmV2V2luZG93LmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgd2luZG93ID0gdGhpcy53aW5kb3cgPSBuZXcgU3ViamVjdDxUPigpO1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh3aW5kb3cpO1xuXG4gICAgbGV0IGNsb3NpbmdOb3RpZmllcjtcbiAgICB0cnkge1xuICAgICAgY29uc3QgeyBjbG9zaW5nU2VsZWN0b3IgfSA9IHRoaXM7XG4gICAgICBjbG9zaW5nTm90aWZpZXIgPSBjbG9zaW5nU2VsZWN0b3IoKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGUpO1xuICAgICAgdGhpcy53aW5kb3cuZXJyb3IoZSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuYWRkKHRoaXMuY2xvc2luZ05vdGlmaWNhdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGNsb3NpbmdOb3RpZmllcikpO1xuICB9XG59XG4iXX0=