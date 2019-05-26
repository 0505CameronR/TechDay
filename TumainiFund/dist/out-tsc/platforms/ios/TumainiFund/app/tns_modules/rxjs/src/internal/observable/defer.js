import { Observable } from '../Observable';
import { from } from './from'; // lol
import { empty } from './empty';
/**
 * Creates an Observable that, on subscribe, calls an Observable factory to
 * make an Observable for each new Observer.
 *
 * <span class="informal">Creates the Observable lazily, that is, only when it
 * is subscribed.
 * </span>
 *
 * ![](defer.png)
 *
 * `defer` allows you to create the Observable only when the Observer
 * subscribes, and create a fresh Observable for each Observer. It waits until
 * an Observer subscribes to it, and then it generates an Observable,
 * typically with an Observable factory function. It does this afresh for each
 * subscriber, so although each subscriber may think it is subscribing to the
 * same Observable, in fact each subscriber gets its own individual
 * Observable.
 *
 * ## Example
 * ### Subscribe to either an Observable of clicks or an Observable of interval, at random
 * ```javascript
 * import { defer, fromEvent, interval } from 'rxjs';
 *
 * const clicksOrInterval = defer(function () {
 *   return Math.random() > 0.5
 *     ? fromEvent(document, 'click')
 *     : interval(1000);
 * });
 * clicksOrInterval.subscribe(x => console.log(x));
 *
 * // Results in the following behavior:
 * // If the result of Math.random() is greater than 0.5 it will listen
 * // for clicks anywhere on the "document"; when document is clicked it
 * // will log a MouseEvent object to the console. If the result is less
 * // than 0.5 it will emit ascending numbers, one every second(1000ms).
 * ```
 *
 * @see {@link Observable}
 *
 * @param {function(): SubscribableOrPromise} observableFactory The Observable
 * factory function to invoke for each Observer that subscribes to the output
 * Observable. May also return a Promise, which will be converted on the fly
 * to an Observable.
 * @return {Observable} An Observable whose Observers' subscriptions trigger
 * an invocation of the given Observable factory function.
 * @static true
 * @name defer
 * @owner Observable
 */
export function defer(observableFactory) {
    return new Observable(subscriber => {
        let input;
        try {
            input = observableFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        const source = input ? from(input) : empty();
        return source.subscribe(subscriber);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RlZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQyxDQUFDLE1BQU07QUFDckMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsTUFBTSxVQUFVLEtBQUssQ0FBaUMsaUJBQWlDO0lBQ3JGLE9BQU8sSUFBSSxVQUFVLENBQXFCLFVBQVUsQ0FBQyxFQUFFO1FBQ3JELElBQUksS0FBZSxDQUFDO1FBQ3BCLElBQUk7WUFDRixLQUFLLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztTQUM3QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlLCBPYnNlcnZlZFZhbHVlT2YsIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nOyAvLyBsb2xcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQsIG9uIHN1YnNjcmliZSwgY2FsbHMgYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IHRvXG4gKiBtYWtlIGFuIE9ic2VydmFibGUgZm9yIGVhY2ggbmV3IE9ic2VydmVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5DcmVhdGVzIHRoZSBPYnNlcnZhYmxlIGxhemlseSwgdGhhdCBpcywgb25seSB3aGVuIGl0XG4gKiBpcyBzdWJzY3JpYmVkLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShkZWZlci5wbmcpXG4gKlxuICogYGRlZmVyYCBhbGxvd3MgeW91IHRvIGNyZWF0ZSB0aGUgT2JzZXJ2YWJsZSBvbmx5IHdoZW4gdGhlIE9ic2VydmVyXG4gKiBzdWJzY3JpYmVzLCBhbmQgY3JlYXRlIGEgZnJlc2ggT2JzZXJ2YWJsZSBmb3IgZWFjaCBPYnNlcnZlci4gSXQgd2FpdHMgdW50aWxcbiAqIGFuIE9ic2VydmVyIHN1YnNjcmliZXMgdG8gaXQsIGFuZCB0aGVuIGl0IGdlbmVyYXRlcyBhbiBPYnNlcnZhYmxlLFxuICogdHlwaWNhbGx5IHdpdGggYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLiBJdCBkb2VzIHRoaXMgYWZyZXNoIGZvciBlYWNoXG4gKiBzdWJzY3JpYmVyLCBzbyBhbHRob3VnaCBlYWNoIHN1YnNjcmliZXIgbWF5IHRoaW5rIGl0IGlzIHN1YnNjcmliaW5nIHRvIHRoZVxuICogc2FtZSBPYnNlcnZhYmxlLCBpbiBmYWN0IGVhY2ggc3Vic2NyaWJlciBnZXRzIGl0cyBvd24gaW5kaXZpZHVhbFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgU3Vic2NyaWJlIHRvIGVpdGhlciBhbiBPYnNlcnZhYmxlIG9mIGNsaWNrcyBvciBhbiBPYnNlcnZhYmxlIG9mIGludGVydmFsLCBhdCByYW5kb21cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGRlZmVyLCBmcm9tRXZlbnQsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKlxuICogY29uc3QgY2xpY2tzT3JJbnRlcnZhbCA9IGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAqICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjVcbiAqICAgICA/IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJylcbiAqICAgICA6IGludGVydmFsKDEwMDApO1xuICogfSk7XG4gKiBjbGlja3NPckludGVydmFsLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3I6XG4gKiAvLyBJZiB0aGUgcmVzdWx0IG9mIE1hdGgucmFuZG9tKCkgaXMgZ3JlYXRlciB0aGFuIDAuNSBpdCB3aWxsIGxpc3RlblxuICogLy8gZm9yIGNsaWNrcyBhbnl3aGVyZSBvbiB0aGUgXCJkb2N1bWVudFwiOyB3aGVuIGRvY3VtZW50IGlzIGNsaWNrZWQgaXRcbiAqIC8vIHdpbGwgbG9nIGEgTW91c2VFdmVudCBvYmplY3QgdG8gdGhlIGNvbnNvbGUuIElmIHRoZSByZXN1bHQgaXMgbGVzc1xuICogLy8gdGhhbiAwLjUgaXQgd2lsbCBlbWl0IGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykuXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBvYnNlcnZhYmxlRmFjdG9yeSBUaGUgT2JzZXJ2YWJsZVxuICogZmFjdG9yeSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggT2JzZXJ2ZXIgdGhhdCBzdWJzY3JpYmVzIHRvIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIE1heSBhbHNvIHJldHVybiBhIFByb21pc2UsIHdoaWNoIHdpbGwgYmUgY29udmVydGVkIG9uIHRoZSBmbHlcbiAqIHRvIGFuIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHdob3NlIE9ic2VydmVycycgc3Vic2NyaXB0aW9ucyB0cmlnZ2VyXG4gKiBhbiBpbnZvY2F0aW9uIG9mIHRoZSBnaXZlbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGRlZmVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmZXI8TyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+PihvYnNlcnZhYmxlRmFjdG9yeTogKCkgPT4gTyB8IHZvaWQpOiBPYnNlcnZhYmxlPE9ic2VydmVkVmFsdWVPZjxPPj4ge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGU8T2JzZXJ2ZWRWYWx1ZU9mPE8+PihzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgaW5wdXQ6IE8gfCB2b2lkO1xuICAgIHRyeSB7XG4gICAgICBpbnB1dCA9IG9ic2VydmFibGVGYWN0b3J5KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2UgPSBpbnB1dCA/IGZyb20oaW5wdXQpIDogZW1wdHkoKTtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfSk7XG59XG4iXX0=