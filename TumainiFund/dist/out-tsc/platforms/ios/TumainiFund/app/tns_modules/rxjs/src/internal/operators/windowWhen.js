import { Subject } from '../Subject';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
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
        const closingNotifier = tryCatch(this.closingSelector)();
        if (closingNotifier === errorObject) {
            const err = errorObject.e;
            this.destination.error(err);
            this.window.error(err);
        }
        else {
            this.add(this.closingNotification = subscribeToResult(this, closingNotifier));
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy93aW5kb3dXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFFckMsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUNsRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsTUFBTSxVQUFVLFVBQVUsQ0FBSSxlQUFzQztJQUNsRSxPQUFPLFNBQVMsMEJBQTBCLENBQUMsTUFBcUI7UUFDOUQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFJLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sY0FBYztJQUNsQixZQUFvQixlQUFzQztRQUF0QyxvQkFBZSxHQUFmLGVBQWUsQ0FBdUI7SUFDMUQsQ0FBQztJQUVELElBQUksQ0FBQyxVQUFxQyxFQUFFLE1BQVc7UUFDckQsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksZ0JBQWdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO0lBQ2xGLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGdCQUFvQixTQUFRLGVBQXVCO0lBSXZELFlBQXNCLFdBQXNDLEVBQ3hDLGVBQXNDO1FBQ3hELEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUZDLGdCQUFXLEdBQVgsV0FBVyxDQUEyQjtRQUN4QyxvQkFBZSxHQUFmLGVBQWUsQ0FBdUI7UUFFeEQsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ3BCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWUsRUFDOUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUFpQztRQUMxQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFRCxXQUFXLENBQUMsS0FBVSxFQUFFLFFBQWlDO1FBQ3ZELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFpQztRQUM5QyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzVCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxQixDQUFDO0lBRVMsTUFBTSxDQUFDLEdBQVE7UUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLDhCQUE4QixFQUFFLENBQUM7SUFDeEMsQ0FBQztJQUVTLFNBQVM7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyw4QkFBOEIsRUFBRSxDQUFDO0lBQ3hDLENBQUM7SUFFTyw4QkFBOEI7UUFDcEMsSUFBSSxJQUFJLENBQUMsbUJBQW1CLEVBQUU7WUFDNUIsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ3hDO0lBQ0gsQ0FBQztJQUVPLFVBQVUsQ0FBQyxXQUFvQyxJQUFJO1FBQ3pELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN0QixRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDeEI7UUFFRCxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQy9CLElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO1FBRUQsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBSyxDQUFDO1FBQzlDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRTlCLE1BQU0sZUFBZSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLEVBQUUsQ0FBQztRQUN6RCxJQUFJLGVBQWUsS0FBSyxXQUFXLEVBQUU7WUFDbkMsTUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN4QjthQUFNO1lBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7U0FDL0U7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnJhbmNoIG91dCB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIGFzIGEgbmVzdGVkIE9ic2VydmFibGUgdXNpbmcgYVxuICogZmFjdG9yeSBmdW5jdGlvbiBvZiBjbG9zaW5nIE9ic2VydmFibGVzIHRvIGRldGVybWluZSB3aGVuIHRvIHN0YXJ0IGEgbmV3XG4gKiB3aW5kb3cuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyV2hlbn0sIGJ1dCBlbWl0cyBhIG5lc3RlZFxuICogT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGFuIGFycmF5Ljwvc3Bhbj5cbiAqXG4gKiAhW10od2luZG93V2hlbi5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2luZG93cyBvZiBpdGVtcyBpdCBjb2xsZWN0cyBmcm9tIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUuIFRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBlbWl0cyBjb25uZWN0ZWQsIG5vbi1vdmVybGFwcGluZyB3aW5kb3dzLlxuICogSXQgZW1pdHMgdGhlIGN1cnJlbnQgd2luZG93IGFuZCBvcGVucyBhIG5ldyBvbmUgd2hlbmV2ZXIgdGhlIE9ic2VydmFibGVcbiAqIHByb2R1Y2VkIGJ5IHRoZSBzcGVjaWZpZWQgYGNsb3NpbmdTZWxlY3RvcmAgZnVuY3Rpb24gZW1pdHMgYW4gaXRlbS4gVGhlIGZpcnN0XG4gKiB3aW5kb3cgaXMgb3BlbmVkIGltbWVkaWF0ZWx5IHdoZW4gc3Vic2NyaWJpbmcgdG8gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgb25seSB0aGUgZmlyc3QgdHdvIGNsaWNrcyBldmVudHMgaW4gZXZlcnkgd2luZG93IG9mIFsxLTVdIHJhbmRvbSBzZWNvbmRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoXG4gKiAgIHdpbmRvd1doZW4oKCkgPT4gaW50ZXJ2YWwoMTAwMCArIE1hdGgucmFuZG9tKCkgKiA0MDAwKSksXG4gKiAgIG1hcCh3aW4gPT4gd2luLnBpcGUodGFrZSgyKSkpLCAgICAgLy8gZWFjaCB3aW5kb3cgaGFzIGF0IG1vc3QgMiBlbWlzc2lvbnNcbiAqICAgbWVyZ2VBbGwoKSwgICAgICAgICAgICAgICAgICAgICAgICAvLyBmbGF0dGVuIHRoZSBPYnNlcnZhYmxlLW9mLU9ic2VydmFibGVzXG4gKiApO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHdpbmRvd31cbiAqIEBzZWUge0BsaW5rIHdpbmRvd0NvdW50fVxuICogQHNlZSB7QGxpbmsgd2luZG93VGltZX1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBPYnNlcnZhYmxlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzIG5vXG4gKiBhcmd1bWVudHMgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IHNpZ25hbHMgKG9uIGVpdGhlciBgbmV4dGAgb3JcbiAqIGBjb21wbGV0ZWApIHdoZW4gdG8gY2xvc2UgdGhlIHByZXZpb3VzIHdpbmRvdyBhbmQgc3RhcnQgYSBuZXcgb25lLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gb2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBpbiB0dXJuXG4gKiBhcmUgT2JzZXJ2YWJsZXMuXG4gKiBAbWV0aG9kIHdpbmRvd1doZW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3aW5kb3dXaGVuPFQ+KGNsb3NpbmdTZWxlY3RvcjogKCkgPT4gT2JzZXJ2YWJsZTxhbnk+KTogT3BlcmF0b3JGdW5jdGlvbjxULCBPYnNlcnZhYmxlPFQ+PiB7XG4gIHJldHVybiBmdW5jdGlvbiB3aW5kb3dXaGVuT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFdpbmRvd09wZXJhdG9yPFQ+KGNsb3NpbmdTZWxlY3RvcikpO1xuICB9O1xufVxuXG5jbGFzcyBXaW5kb3dPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPE9ic2VydmFibGU8VD4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFdpbmRvd1N1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jbG9zaW5nU2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgV2luZG93U3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBhbnk+IHtcbiAgcHJpdmF0ZSB3aW5kb3c6IFN1YmplY3Q8VD47XG4gIHByaXZhdGUgY2xvc2luZ05vdGlmaWNhdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICgpID0+IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICB0aGlzLm9wZW5XaW5kb3coKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogYW55LFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgYW55Pik6IHZvaWQge1xuICAgIHRoaXMub3BlbldpbmRvdyhpbm5lclN1Yik7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLl9lcnJvcihlcnJvcik7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcbiAgICB0aGlzLm9wZW5XaW5kb3coaW5uZXJTdWIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuZXJyb3IoZXJyKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgdGhpcy51bnN1YnNjcmliZUNsb3NpbmdOb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy53aW5kb3cuY29tcGxldGUoKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgdGhpcy51bnN1YnNjcmliZUNsb3NpbmdOb3RpZmljYXRpb24oKTtcbiAgfVxuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmVDbG9zaW5nTm90aWZpY2F0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNsb3NpbmdOb3RpZmljYXRpb24pIHtcbiAgICAgIHRoaXMuY2xvc2luZ05vdGlmaWNhdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb3BlbldpbmRvdyhpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4gPSBudWxsKTogdm9pZCB7XG4gICAgaWYgKGlubmVyU3ViKSB7XG4gICAgICB0aGlzLnJlbW92ZShpbm5lclN1Yik7XG4gICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHByZXZXaW5kb3cgPSB0aGlzLndpbmRvdztcbiAgICBpZiAocHJldldpbmRvdykge1xuICAgICAgcHJldldpbmRvdy5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbmRvdyA9IHRoaXMud2luZG93ID0gbmV3IFN1YmplY3Q8VD4oKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQod2luZG93KTtcblxuICAgIGNvbnN0IGNsb3NpbmdOb3RpZmllciA9IHRyeUNhdGNoKHRoaXMuY2xvc2luZ1NlbGVjdG9yKSgpO1xuICAgIGlmIChjbG9zaW5nTm90aWZpZXIgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICBjb25zdCBlcnIgPSBlcnJvck9iamVjdC5lO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgdGhpcy53aW5kb3cuZXJyb3IoZXJyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hZGQodGhpcy5jbG9zaW5nTm90aWZpY2F0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgY2xvc2luZ05vdGlmaWVyKSk7XG4gICAgfVxuICB9XG59XG4iXX0=