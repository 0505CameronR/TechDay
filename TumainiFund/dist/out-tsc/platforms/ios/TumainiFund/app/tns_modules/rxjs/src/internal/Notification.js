import { empty } from './observable/empty';
import { of } from './observable/of';
import { throwError } from './observable/throwError';
/**
 * Represents a push-based event or value that an {@link Observable} can emit.
 * This class is particularly useful for operators that manage notifications,
 * like {@link materialize}, {@link dematerialize}, {@link observeOn}, and
 * others. Besides wrapping the actual delivered value, it also annotates it
 * with metadata of, for instance, what type of push message it is (`next`,
 * `error`, or `complete`).
 *
 * @see {@link materialize}
 * @see {@link dematerialize}
 * @see {@link observeOn}
 *
 * @class Notification<T>
 */
export class Notification {
    constructor(kind, value, error) {
        this.kind = kind;
        this.value = value;
        this.error = error;
        this.hasValue = kind === "N" /* NEXT */;
    }
    /**
     * Delivers to the given `observer` the value wrapped by this Notification.
     * @param {Observer} observer
     * @return
     */
    observe(observer) {
        switch (this.kind) {
            case "N" /* NEXT */:
                return observer.next && observer.next(this.value);
            case "E" /* ERROR */:
                return observer.error && observer.error(this.error);
            case "C" /* COMPLETE */:
                return observer.complete && observer.complete();
        }
    }
    /**
     * Given some {@link Observer} callbacks, deliver the value represented by the
     * current Notification to the correctly corresponding callback.
     * @param {function(value: T): void} next An Observer `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    do(next, error, complete) {
        const kind = this.kind;
        switch (kind) {
            case "N" /* NEXT */:
                return next && next(this.value);
            case "E" /* ERROR */:
                return error && error(this.error);
            case "C" /* COMPLETE */:
                return complete && complete();
        }
    }
    /**
     * Takes an Observer or its individual callback functions, and calls `observe`
     * or `do` methods accordingly.
     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
     * the `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    accept(nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    }
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     * @return {any}
     */
    toObservable() {
        const kind = this.kind;
        switch (kind) {
            case "N" /* NEXT */:
                return of(this.value);
            case "E" /* ERROR */:
                return throwError(this.error);
            case "C" /* COMPLETE */:
                return empty();
        }
        throw new Error('unexpected notification kind value');
    }
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     * @nocollapse
     */
    static createNext(value) {
        if (typeof value !== 'undefined') {
            return new Notification("N" /* NEXT */, value);
        }
        return Notification.undefinedValueNotification;
    }
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` error.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     * @nocollapse
     */
    static createError(err) {
        return new Notification("E" /* ERROR */, undefined, err);
    }
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     * @nocollapse
     */
    static createComplete() {
        return Notification.completeNotification;
    }
}
Notification.completeNotification = new Notification("C" /* COMPLETE */);
Notification.undefinedValueNotification = new Notification("N" /* NEXT */, undefined);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvTm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBUXJEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUd2QixZQUFtQixJQUFzQixFQUFTLEtBQVMsRUFBUyxLQUFXO1FBQTVELFNBQUksR0FBSixJQUFJLENBQWtCO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBSTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQU07UUFDN0UsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLG1CQUEwQixDQUFDO0lBQ2pELENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsT0FBTyxDQUFDLFFBQTRCO1FBQ2xDLFFBQVEsSUFBSSxDQUFDLElBQUksRUFBRTtZQUNqQjtnQkFDRSxPQUFPLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEQ7Z0JBQ0UsT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3REO2dCQUNFLE9BQU8sUUFBUSxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDbkQ7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILEVBQUUsQ0FBQyxJQUF3QixFQUFFLEtBQTBCLEVBQUUsUUFBcUI7UUFDNUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixRQUFRLElBQUksRUFBRTtZQUNaO2dCQUNFLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEM7Z0JBQ0UsT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQztnQkFDRSxPQUFPLFFBQVEsSUFBSSxRQUFRLEVBQUUsQ0FBQztTQUNqQztJQUNILENBQUM7SUFFRDs7Ozs7Ozs7T0FRRztJQUNILE1BQU0sQ0FBQyxjQUF5RCxFQUFFLEtBQTBCLEVBQUUsUUFBcUI7UUFDakgsSUFBSSxjQUFjLElBQUksT0FBNEIsY0FBZSxDQUFDLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDckYsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFxQixjQUFjLENBQUMsQ0FBQztTQUN6RDthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFxQixjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1NBQ3JFO0lBQ0gsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxZQUFZO1FBQ1YsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztRQUN2QixRQUFRLElBQUksRUFBRTtZQUNaO2dCQUNFLE9BQU8sRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QjtnQkFDRSxPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEM7Z0JBQ0UsT0FBTyxLQUFLLEVBQUUsQ0FBQztTQUNsQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBS0Q7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxVQUFVLENBQUksS0FBUTtRQUMzQixJQUFJLE9BQU8sS0FBSyxLQUFLLFdBQVcsRUFBRTtZQUNoQyxPQUFPLElBQUksWUFBWSxpQkFBd0IsS0FBSyxDQUFDLENBQUM7U0FDdkQ7UUFDRCxPQUFPLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxXQUFXLENBQUksR0FBUztRQUM3QixPQUFPLElBQUksWUFBWSxrQkFBeUIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ2xFLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLGNBQWM7UUFDbkIsT0FBTyxZQUFZLENBQUMsb0JBQW9CLENBQUM7SUFDM0MsQ0FBQzs7QUFyQ2MsaUNBQW9CLEdBQXNCLElBQUksWUFBWSxvQkFBMkIsQ0FBQztBQUN0Rix1Q0FBMEIsR0FBc0IsSUFBSSxZQUFZLGlCQUF3QixTQUFTLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuXG5leHBvcnQgY29uc3QgZW51bSBOb3RpZmljYXRpb25LaW5kIHtcbiAgTkVYVCA9ICdOJyxcbiAgRVJST1IgPSAnRScsXG4gIENPTVBMRVRFID0gJ0MnLFxufVxuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwdXNoLWJhc2VkIGV2ZW50IG9yIHZhbHVlIHRoYXQgYW4ge0BsaW5rIE9ic2VydmFibGV9IGNhbiBlbWl0LlxuICogVGhpcyBjbGFzcyBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBvcGVyYXRvcnMgdGhhdCBtYW5hZ2Ugbm90aWZpY2F0aW9ucyxcbiAqIGxpa2Uge0BsaW5rIG1hdGVyaWFsaXplfSwge0BsaW5rIGRlbWF0ZXJpYWxpemV9LCB7QGxpbmsgb2JzZXJ2ZU9ufSwgYW5kXG4gKiBvdGhlcnMuIEJlc2lkZXMgd3JhcHBpbmcgdGhlIGFjdHVhbCBkZWxpdmVyZWQgdmFsdWUsIGl0IGFsc28gYW5ub3RhdGVzIGl0XG4gKiB3aXRoIG1ldGFkYXRhIG9mLCBmb3IgaW5zdGFuY2UsIHdoYXQgdHlwZSBvZiBwdXNoIG1lc3NhZ2UgaXQgaXMgKGBuZXh0YCxcbiAqIGBlcnJvcmAsIG9yIGBjb21wbGV0ZWApLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hdGVyaWFsaXplfVxuICogQHNlZSB7QGxpbmsgZGVtYXRlcmlhbGl6ZX1cbiAqIEBzZWUge0BsaW5rIG9ic2VydmVPbn1cbiAqXG4gKiBAY2xhc3MgTm90aWZpY2F0aW9uPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb248VD4ge1xuICBoYXNWYWx1ZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMga2luZDogTm90aWZpY2F0aW9uS2luZCwgcHVibGljIHZhbHVlPzogVCwgcHVibGljIGVycm9yPzogYW55KSB7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IGtpbmQgPT09IE5vdGlmaWNhdGlvbktpbmQuTkVYVDtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxpdmVycyB0byB0aGUgZ2l2ZW4gYG9ic2VydmVyYCB0aGUgdmFsdWUgd3JhcHBlZCBieSB0aGlzIE5vdGlmaWNhdGlvbi5cbiAgICogQHBhcmFtIHtPYnNlcnZlcn0gb2JzZXJ2ZXJcbiAgICogQHJldHVyblxuICAgKi9cbiAgb2JzZXJ2ZShvYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+KTogYW55IHtcbiAgICBzd2l0Y2ggKHRoaXMua2luZCkge1xuICAgICAgY2FzZSBOb3RpZmljYXRpb25LaW5kLk5FWFQ6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5uZXh0ICYmIG9ic2VydmVyLm5leHQodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlIE5vdGlmaWNhdGlvbktpbmQuRVJST1I6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5lcnJvciAmJiBvYnNlcnZlci5lcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgTm90aWZpY2F0aW9uS2luZC5DT01QTEVURTpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLmNvbXBsZXRlICYmIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHNvbWUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFja3MsIGRlbGl2ZXIgdGhlIHZhbHVlIHJlcHJlc2VudGVkIGJ5IHRoZVxuICAgKiBjdXJyZW50IE5vdGlmaWNhdGlvbiB0byB0aGUgY29ycmVjdGx5IGNvcnJlc3BvbmRpbmcgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBuZXh0IEFuIE9ic2VydmVyIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGRvKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IGFueSB7XG4gICAgY29uc3Qga2luZCA9IHRoaXMua2luZDtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgTm90aWZpY2F0aW9uS2luZC5ORVhUOlxuICAgICAgICByZXR1cm4gbmV4dCAmJiBuZXh0KHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSBOb3RpZmljYXRpb25LaW5kLkVSUk9SOlxuICAgICAgICByZXR1cm4gZXJyb3IgJiYgZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlIE5vdGlmaWNhdGlvbktpbmQuQ09NUExFVEU6XG4gICAgICAgIHJldHVybiBjb21wbGV0ZSAmJiBjb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhbiBPYnNlcnZlciBvciBpdHMgaW5kaXZpZHVhbCBjYWxsYmFjayBmdW5jdGlvbnMsIGFuZCBjYWxscyBgb2JzZXJ2ZWBcbiAgICogb3IgYGRvYCBtZXRob2RzIGFjY29yZGluZ2x5LlxuICAgKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gbmV4dE9yT2JzZXJ2ZXIgQW4gT2JzZXJ2ZXIgb3JcbiAgICogdGhlIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGFjY2VwdChuZXh0T3JPYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksIGVycm9yPzogKGVycjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgJiYgdHlwZW9mICg8UGFydGlhbE9ic2VydmVyPFQ+Pm5leHRPck9ic2VydmVyKS5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+bmV4dE9yT2JzZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kbyg8KHZhbHVlOiBUKSA9PiB2b2lkPm5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb24gcmVwcmVzZW50ZWRcbiAgICogYnkgdGhpcyBOb3RpZmljYXRpb24gaW5zdGFuY2UuXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIHRvT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBraW5kID0gdGhpcy5raW5kO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSBOb3RpZmljYXRpb25LaW5kLk5FWFQ6XG4gICAgICAgIHJldHVybiBvZih0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgTm90aWZpY2F0aW9uS2luZC5FUlJPUjpcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlIE5vdGlmaWNhdGlvbktpbmQuQ09NUExFVEU6XG4gICAgICAgIHJldHVybiBlbXB0eSgpO1xuICAgIH1cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3VuZXhwZWN0ZWQgbm90aWZpY2F0aW9uIGtpbmQgdmFsdWUnKTtcbiAgfVxuXG4gIHByaXZhdGUgc3RhdGljIGNvbXBsZXRlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oTm90aWZpY2F0aW9uS2luZC5DT01QTEVURSk7XG4gIHByaXZhdGUgc3RhdGljIHVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oTm90aWZpY2F0aW9uS2luZC5ORVhULCB1bmRlZmluZWQpO1xuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgbmV4dGAgZnJvbSBhXG4gICAqIGdpdmVuIHZhbHVlLlxuICAgKiBAcGFyYW0ge1R9IHZhbHVlIFRoZSBgbmV4dGAgdmFsdWUuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxUPn0gVGhlIFwibmV4dFwiIE5vdGlmaWNhdGlvbiByZXByZXNlbnRpbmcgdGhlXG4gICAqIGFyZ3VtZW50LlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZU5leHQ8VD4odmFsdWU6IFQpOiBOb3RpZmljYXRpb248VD4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbihOb3RpZmljYXRpb25LaW5kLk5FWFQsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi51bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgZXJyb3JgIGZyb20gYVxuICAgKiBnaXZlbiBlcnJvci5cbiAgICogQHBhcmFtIHthbnl9IFtlcnJdIFRoZSBgZXJyb3JgIGVycm9yLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248VD59IFRoZSBcImVycm9yXCIgTm90aWZpY2F0aW9uIHJlcHJlc2VudGluZyB0aGVcbiAgICogYXJndW1lbnQuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlRXJyb3I8VD4oZXJyPzogYW55KTogTm90aWZpY2F0aW9uPFQ+IHtcbiAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbihOb3RpZmljYXRpb25LaW5kLkVSUk9SLCB1bmRlZmluZWQsIGVycik7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYGNvbXBsZXRlYC5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPGFueT59IFRoZSB2YWx1ZWxlc3MgXCJjb21wbGV0ZVwiIE5vdGlmaWNhdGlvbi5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVDb21wbGV0ZSgpOiBOb3RpZmljYXRpb248YW55PiB7XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi5jb21wbGV0ZU5vdGlmaWNhdGlvbjtcbiAgfVxufVxuIl19