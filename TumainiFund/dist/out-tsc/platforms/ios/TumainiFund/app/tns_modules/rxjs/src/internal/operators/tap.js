import { Subscriber } from '../Subscriber';
import { noop } from '../util/noop';
import { isFunction } from '../util/isFunction';
/* tslint:enable:max-line-length */
/**
 * Perform a side effect for every emission on the source Observable, but return
 * an Observable that is identical to the source.
 *
 * <span class="informal">Intercepts each emission on the source and runs a
 * function, but returns an output which is identical to the source as long as errors don't occur.</span>
 *
 * ![](do.png)
 *
 * Returns a mirrored Observable of the source Observable, but modified so that
 * the provided Observer is called to perform a side effect for every value,
 * error, and completion emitted by the source. Any errors that are thrown in
 * the aforementioned Observer or handlers are safely sent down the error path
 * of the output Observable.
 *
 * This operator is useful for debugging your Observables for the correct values
 * or performing other side effects.
 *
 * Note: this is different to a `subscribe` on the Observable. If the Observable
 * returned by `tap` is not subscribed, the side effects specified by the
 * Observer will never happen. `tap` therefore simply spies on existing
 * execution, it does not trigger an execution to happen like `subscribe` does.
 *
 * ## Example
 * Map every click to the clientX position of that click, while also logging the click event
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { tap, map } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const positions = clicks.pipe(
 *   tap(ev => console.log(ev)),
 *   map(ev => ev.clientX),
 * );
 * positions.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link map}
 * @see {@link Observable#subscribe}
 *
 * @param {Observer|function} [nextOrObserver] A normal Observer object or a
 * callback for `next`.
 * @param {function} [error] Callback for errors in the source.
 * @param {function} [complete] Callback for the completion of the source.
 * @return {Observable} An Observable identical to the source, but runs the
 * specified Observer or callback(s) for each item.
 * @name tap
 */
export function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
class DoOperator {
    constructor(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    call(subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class TapSubscriber extends Subscriber {
    constructor(destination, observerOrNext, error, complete) {
        super(destination);
        this._tapNext = noop;
        this._tapError = noop;
        this._tapComplete = noop;
        this._tapError = error || noop;
        this._tapComplete = complete || noop;
        if (isFunction(observerOrNext)) {
            this._context = this;
            this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            this._context = observerOrNext;
            this._tapNext = observerOrNext.next || noop;
            this._tapError = observerOrNext.error || noop;
            this._tapComplete = observerOrNext.complete || noop;
        }
    }
    _next(value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    }
    _error(err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    }
    _complete() {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3RhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRzNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFDcEMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBV2hELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0ErQ0c7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUFJLGNBQXNELEVBQ3RELEtBQXdCLEVBQ3hCLFFBQXFCO0lBQzFDLE9BQU8sU0FBUyxtQkFBbUIsQ0FBQyxNQUFxQjtRQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLFVBQVU7SUFDZCxZQUFvQixjQUFzRCxFQUN0RCxLQUF3QixFQUN4QixRQUFxQjtRQUZyQixtQkFBYyxHQUFkLGNBQWMsQ0FBd0M7UUFDdEQsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDeEIsYUFBUSxHQUFSLFFBQVEsQ0FBYTtJQUN6QyxDQUFDO0lBQ0QsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxhQUFhLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxjQUFjLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztJQUN6RyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBRUgsTUFBTSxhQUFpQixTQUFRLFVBQWE7SUFTMUMsWUFBWSxXQUEwQixFQUMxQixjQUEwRCxFQUMxRCxLQUF5QixFQUN6QixRQUFxQjtRQUM3QixLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFWZixhQUFRLEdBQXlCLElBQUksQ0FBQztRQUV0QyxjQUFTLEdBQXlCLElBQUksQ0FBQztRQUV2QyxpQkFBWSxHQUFpQixJQUFJLENBQUM7UUFPdEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxLQUFLLElBQUksSUFBSSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxJQUFJLElBQUksQ0FBQztRQUNyQyxJQUFJLFVBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUNyQixJQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztTQUNoQzthQUFNLElBQUksY0FBYyxFQUFFO1lBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1lBQy9CLElBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksSUFBSSxJQUFJLENBQUM7WUFDNUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQztZQUM5QyxJQUFJLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDO1NBQ3JEO0lBQ0gsQ0FBQztJQUVILEtBQUssQ0FBQyxLQUFRO1FBQ1osSUFBSTtZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBUTtRQUNiLElBQUk7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUk7WUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7U0FDekM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgUGFydGlhbE9ic2VydmVyLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYSBjb21wbGV0ZSBjYWxsYmFjayAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihuZXh0OiBudWxsIHwgdW5kZWZpbmVkLCBlcnJvcjogbnVsbCB8IHVuZGVmaW5lZCwgY29tcGxldGU6ICgpID0+IHZvaWQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYW4gZXJyb3IgY2FsbGJhY2sgKi9cbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4obmV4dDogbnVsbCB8IHVuZGVmaW5lZCwgZXJyb3I6IChlcnJvcjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYSBjb21wbGV0ZSBjYWxsYmFjayAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQsIGVycm9yOiBudWxsIHwgdW5kZWZpbmVkLCBjb21wbGV0ZTogKCkgPT4gdm9pZCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4obmV4dD86ICh4OiBUKSA9PiB2b2lkLCBlcnJvcj86IChlOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4ob2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUGVyZm9ybSBhIHNpZGUgZWZmZWN0IGZvciBldmVyeSBlbWlzc2lvbiBvbiB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCByZXR1cm5cbiAqIGFuIE9ic2VydmFibGUgdGhhdCBpcyBpZGVudGljYWwgdG8gdGhlIHNvdXJjZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SW50ZXJjZXB0cyBlYWNoIGVtaXNzaW9uIG9uIHRoZSBzb3VyY2UgYW5kIHJ1bnMgYVxuICogZnVuY3Rpb24sIGJ1dCByZXR1cm5zIGFuIG91dHB1dCB3aGljaCBpcyBpZGVudGljYWwgdG8gdGhlIHNvdXJjZSBhcyBsb25nIGFzIGVycm9ycyBkb24ndCBvY2N1ci48L3NwYW4+XG4gKlxuICogIVtdKGRvLnBuZylcbiAqXG4gKiBSZXR1cm5zIGEgbWlycm9yZWQgT2JzZXJ2YWJsZSBvZiB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCBtb2RpZmllZCBzbyB0aGF0XG4gKiB0aGUgcHJvdmlkZWQgT2JzZXJ2ZXIgaXMgY2FsbGVkIHRvIHBlcmZvcm0gYSBzaWRlIGVmZmVjdCBmb3IgZXZlcnkgdmFsdWUsXG4gKiBlcnJvciwgYW5kIGNvbXBsZXRpb24gZW1pdHRlZCBieSB0aGUgc291cmNlLiBBbnkgZXJyb3JzIHRoYXQgYXJlIHRocm93biBpblxuICogdGhlIGFmb3JlbWVudGlvbmVkIE9ic2VydmVyIG9yIGhhbmRsZXJzIGFyZSBzYWZlbHkgc2VudCBkb3duIHRoZSBlcnJvciBwYXRoXG4gKiBvZiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogVGhpcyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGRlYnVnZ2luZyB5b3VyIE9ic2VydmFibGVzIGZvciB0aGUgY29ycmVjdCB2YWx1ZXNcbiAqIG9yIHBlcmZvcm1pbmcgb3RoZXIgc2lkZSBlZmZlY3RzLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgZGlmZmVyZW50IHRvIGEgYHN1YnNjcmliZWAgb24gdGhlIE9ic2VydmFibGUuIElmIHRoZSBPYnNlcnZhYmxlXG4gKiByZXR1cm5lZCBieSBgdGFwYCBpcyBub3Qgc3Vic2NyaWJlZCwgdGhlIHNpZGUgZWZmZWN0cyBzcGVjaWZpZWQgYnkgdGhlXG4gKiBPYnNlcnZlciB3aWxsIG5ldmVyIGhhcHBlbi4gYHRhcGAgdGhlcmVmb3JlIHNpbXBseSBzcGllcyBvbiBleGlzdGluZ1xuICogZXhlY3V0aW9uLCBpdCBkb2VzIG5vdCB0cmlnZ2VyIGFuIGV4ZWN1dGlvbiB0byBoYXBwZW4gbGlrZSBgc3Vic2NyaWJlYCBkb2VzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE1hcCBldmVyeSBjbGljayB0byB0aGUgY2xpZW50WCBwb3NpdGlvbiBvZiB0aGF0IGNsaWNrLCB3aGlsZSBhbHNvIGxvZ2dpbmcgdGhlIGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRhcCwgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBwb3NpdGlvbnMgPSBjbGlja3MucGlwZShcbiAqICAgdGFwKGV2ID0+IGNvbnNvbGUubG9nKGV2KSksXG4gKiAgIG1hcChldiA9PiBldi5jbGllbnRYKSxcbiAqICk7XG4gKiBwb3NpdGlvbnMuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgbWFwfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZSNzdWJzY3JpYmV9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZlcnxmdW5jdGlvbn0gW25leHRPck9ic2VydmVyXSBBIG5vcm1hbCBPYnNlcnZlciBvYmplY3Qgb3IgYVxuICogY2FsbGJhY2sgZm9yIGBuZXh0YC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtlcnJvcl0gQ2FsbGJhY2sgZm9yIGVycm9ycyBpbiB0aGUgc291cmNlLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBsZXRlXSBDYWxsYmFjayBmb3IgdGhlIGNvbXBsZXRpb24gb2YgdGhlIHNvdXJjZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgaWRlbnRpY2FsIHRvIHRoZSBzb3VyY2UsIGJ1dCBydW5zIHRoZVxuICogc3BlY2lmaWVkIE9ic2VydmVyIG9yIGNhbGxiYWNrKHMpIGZvciBlYWNoIGl0ZW0uXG4gKiBAbmFtZSB0YXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRhcDxUPihuZXh0T3JPYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgoeDogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgICAgICAgICAgIGVycm9yPzogKGU6IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHRhcE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBEb09wZXJhdG9yKG5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpKTtcbiAgfTtcbn1cblxuY2xhc3MgRG9PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBuZXh0T3JPYnNlcnZlcj86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgoeDogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIHByaXZhdGUgZXJyb3I/OiAoZTogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICB9XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgVGFwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm5leHRPck9ic2VydmVyLCB0aGlzLmVycm9yLCB0aGlzLmNvbXBsZXRlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cblxuY2xhc3MgVGFwU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIF9jb250ZXh0OiBhbnk7XG5cbiAgcHJpdmF0ZSBfdGFwTmV4dDogKCh2YWx1ZTogVCkgPT4gdm9pZCkgPSBub29wO1xuXG4gIHByaXZhdGUgX3RhcEVycm9yOiAoKGVycjogYW55KSA9PiB2b2lkKSA9IG5vb3A7XG5cbiAgcHJpdmF0ZSBfdGFwQ29tcGxldGU6ICgoKSA9PiB2b2lkKSA9IG5vb3A7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIG9ic2VydmVyT3JOZXh0PzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksXG4gICAgICAgICAgICAgIGVycm9yPzogKGU/OiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCkge1xuICAgICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgICAgdGhpcy5fdGFwRXJyb3IgPSBlcnJvciB8fCBub29wO1xuICAgICAgdGhpcy5fdGFwQ29tcGxldGUgPSBjb21wbGV0ZSB8fCBub29wO1xuICAgICAgaWYgKGlzRnVuY3Rpb24ob2JzZXJ2ZXJPck5leHQpKSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSB0aGlzO1xuICAgICAgICB0aGlzLl90YXBOZXh0ID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICB9IGVsc2UgaWYgKG9ic2VydmVyT3JOZXh0KSB7XG4gICAgICAgIHRoaXMuX2NvbnRleHQgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgICAgdGhpcy5fdGFwTmV4dCA9IG9ic2VydmVyT3JOZXh0Lm5leHQgfHwgbm9vcDtcbiAgICAgICAgdGhpcy5fdGFwRXJyb3IgPSBvYnNlcnZlck9yTmV4dC5lcnJvciB8fCBub29wO1xuICAgICAgICB0aGlzLl90YXBDb21wbGV0ZSA9IG9ic2VydmVyT3JOZXh0LmNvbXBsZXRlIHx8IG5vb3A7XG4gICAgICB9XG4gICAgfVxuXG4gIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3RhcE5leHQuY2FsbCh0aGlzLl9jb250ZXh0LCB2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBfZXJyb3IoZXJyOiBhbnkpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fdGFwRXJyb3IuY2FsbCh0aGlzLl9jb250ZXh0LCBlcnIpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gIH1cblxuICBfY29tcGxldGUoKSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3RhcENvbXBsZXRlLmNhbGwodGhpcy5fY29udGV4dCwgKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19