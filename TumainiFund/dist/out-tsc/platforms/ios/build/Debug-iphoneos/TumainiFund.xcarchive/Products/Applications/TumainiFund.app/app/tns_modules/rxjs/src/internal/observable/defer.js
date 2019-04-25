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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RlZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQyxDQUFDLE1BQU07QUFDckMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUVoQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQThDRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUksaUJBQXdEO0lBQy9FLE9BQU8sSUFBSSxVQUFVLENBQUMsVUFBVSxDQUFDLEVBQUU7UUFDakMsSUFBSSxLQUFzQyxDQUFDO1FBQzNDLElBQUk7WUFDRixLQUFLLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztTQUM3QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELE1BQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4vZnJvbSc7IC8vIGxvbFxuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuL2VtcHR5JztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCwgb24gc3Vic2NyaWJlLCBjYWxscyBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgdG9cbiAqIG1ha2UgYW4gT2JzZXJ2YWJsZSBmb3IgZWFjaCBuZXcgT2JzZXJ2ZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZXMgdGhlIE9ic2VydmFibGUgbGF6aWx5LCB0aGF0IGlzLCBvbmx5IHdoZW4gaXRcbiAqIGlzIHN1YnNjcmliZWQuXG4gKiA8L3NwYW4+XG4gKlxuICogIVtdKGRlZmVyLnBuZylcbiAqXG4gKiBgZGVmZXJgIGFsbG93cyB5b3UgdG8gY3JlYXRlIHRoZSBPYnNlcnZhYmxlIG9ubHkgd2hlbiB0aGUgT2JzZXJ2ZXJcbiAqIHN1YnNjcmliZXMsIGFuZCBjcmVhdGUgYSBmcmVzaCBPYnNlcnZhYmxlIGZvciBlYWNoIE9ic2VydmVyLiBJdCB3YWl0cyB1bnRpbFxuICogYW4gT2JzZXJ2ZXIgc3Vic2NyaWJlcyB0byBpdCwgYW5kIHRoZW4gaXQgZ2VuZXJhdGVzIGFuIE9ic2VydmFibGUsXG4gKiB0eXBpY2FsbHkgd2l0aCBhbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uIEl0IGRvZXMgdGhpcyBhZnJlc2ggZm9yIGVhY2hcbiAqIHN1YnNjcmliZXIsIHNvIGFsdGhvdWdoIGVhY2ggc3Vic2NyaWJlciBtYXkgdGhpbmsgaXQgaXMgc3Vic2NyaWJpbmcgdG8gdGhlXG4gKiBzYW1lIE9ic2VydmFibGUsIGluIGZhY3QgZWFjaCBzdWJzY3JpYmVyIGdldHMgaXRzIG93biBpbmRpdmlkdWFsXG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqICMjIyBTdWJzY3JpYmUgdG8gZWl0aGVyIGFuIE9ic2VydmFibGUgb2YgY2xpY2tzIG9yIGFuIE9ic2VydmFibGUgb2YgaW50ZXJ2YWwsIGF0IHJhbmRvbVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzT3JJbnRlcnZhbCA9IGRlZmVyKGZ1bmN0aW9uICgpIHtcbiAqICAgcmV0dXJuIE1hdGgucmFuZG9tKCkgPiAwLjVcbiAqICAgICA/IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJylcbiAqICAgICA6IGludGVydmFsKDEwMDApO1xuICogfSk7XG4gKiBjbGlja3NPckludGVydmFsLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluIHRoZSBmb2xsb3dpbmcgYmVoYXZpb3I6XG4gKiAvLyBJZiB0aGUgcmVzdWx0IG9mIE1hdGgucmFuZG9tKCkgaXMgZ3JlYXRlciB0aGFuIDAuNSBpdCB3aWxsIGxpc3RlblxuICogLy8gZm9yIGNsaWNrcyBhbnl3aGVyZSBvbiB0aGUgXCJkb2N1bWVudFwiOyB3aGVuIGRvY3VtZW50IGlzIGNsaWNrZWQgaXRcbiAqIC8vIHdpbGwgbG9nIGEgTW91c2VFdmVudCBvYmplY3QgdG8gdGhlIGNvbnNvbGUuIElmIHRoZSByZXN1bHQgaXMgbGVzc1xuICogLy8gdGhhbiAwLjUgaXQgd2lsbCBlbWl0IGFzY2VuZGluZyBudW1iZXJzLCBvbmUgZXZlcnkgc2Vjb25kKDEwMDBtcykuXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBvYnNlcnZhYmxlRmFjdG9yeSBUaGUgT2JzZXJ2YWJsZVxuICogZmFjdG9yeSBmdW5jdGlvbiB0byBpbnZva2UgZm9yIGVhY2ggT2JzZXJ2ZXIgdGhhdCBzdWJzY3JpYmVzIHRvIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIE1heSBhbHNvIHJldHVybiBhIFByb21pc2UsIHdoaWNoIHdpbGwgYmUgY29udmVydGVkIG9uIHRoZSBmbHlcbiAqIHRvIGFuIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHdob3NlIE9ic2VydmVycycgc3Vic2NyaXB0aW9ucyB0cmlnZ2VyXG4gKiBhbiBpbnZvY2F0aW9uIG9mIHRoZSBnaXZlbiBPYnNlcnZhYmxlIGZhY3RvcnkgZnVuY3Rpb24uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGRlZmVyXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmZXI8VD4ob2JzZXJ2YWJsZUZhY3Rvcnk6ICgpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiB8IHZvaWQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCBpbnB1dDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+IHwgdm9pZDtcbiAgICB0cnkge1xuICAgICAgaW5wdXQgPSBvYnNlcnZhYmxlRmFjdG9yeSgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgY29uc3Qgc291cmNlID0gaW5wdXQgPyBmcm9tKGlucHV0KSA6IGVtcHR5KCk7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH0pO1xufSJdfQ==