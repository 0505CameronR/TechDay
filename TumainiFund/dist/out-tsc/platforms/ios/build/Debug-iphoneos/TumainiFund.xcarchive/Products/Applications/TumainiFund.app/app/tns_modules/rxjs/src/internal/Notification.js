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
        this.hasValue = kind === 'N';
    }
    /**
     * Delivers to the given `observer` the value wrapped by this Notification.
     * @param {Observer} observer
     * @return
     */
    observe(observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
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
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
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
            case 'N':
                return of(this.value);
            case 'E':
                return throwError(this.error);
            case 'C':
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
            return new Notification('N', value);
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
        return new Notification('E', undefined, err);
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
Notification.completeNotification = new Notification('C');
Notification.undefinedValueNotification = new Notification('N', undefined);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvTm90aWZpY2F0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDckMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRXJEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLE9BQU8sWUFBWTtJQUd2QixZQUFtQixJQUFZLEVBQVMsS0FBUyxFQUFTLEtBQVc7UUFBbEQsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFTLFVBQUssR0FBTCxLQUFLLENBQUk7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFNO1FBQ25FLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxLQUFLLEdBQUcsQ0FBQztJQUMvQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILE9BQU8sQ0FBQyxRQUE0QjtRQUNsQyxRQUFRLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDakIsS0FBSyxHQUFHO2dCQUNOLE9BQU8sUUFBUSxDQUFDLElBQUksSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwRCxLQUFLLEdBQUc7Z0JBQ04sT0FBTyxRQUFRLENBQUMsS0FBSyxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RELEtBQUssR0FBRztnQkFDTixPQUFPLFFBQVEsQ0FBQyxRQUFRLElBQUksUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ25EO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7O09BT0c7SUFDSCxFQUFFLENBQUMsSUFBd0IsRUFBRSxLQUEwQixFQUFFLFFBQXFCO1FBQzVFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsUUFBUSxJQUFJLEVBQUU7WUFDWixLQUFLLEdBQUc7Z0JBQ04sT0FBTyxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNsQyxLQUFLLEdBQUc7Z0JBQ04sT0FBTyxLQUFLLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNwQyxLQUFLLEdBQUc7Z0JBQ04sT0FBTyxRQUFRLElBQUksUUFBUSxFQUFFLENBQUM7U0FDakM7SUFDSCxDQUFDO0lBRUQ7Ozs7Ozs7O09BUUc7SUFDSCxNQUFNLENBQUMsY0FBeUQsRUFBRSxLQUEwQixFQUFFLFFBQXFCO1FBQ2pILElBQUksY0FBYyxJQUFJLE9BQTRCLGNBQWUsQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1lBQ3JGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBcUIsY0FBYyxDQUFDLENBQUM7U0FDekQ7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLEVBQUUsQ0FBcUIsY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQztTQUNyRTtJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsWUFBWTtRQUNWLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsUUFBUSxJQUFJLEVBQUU7WUFDWixLQUFLLEdBQUc7Z0JBQ04sT0FBTyxFQUFFLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hCLEtBQUssR0FBRztnQkFDTixPQUFPLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsS0FBSyxHQUFHO2dCQUNOLE9BQU8sS0FBSyxFQUFFLENBQUM7U0FDbEI7UUFDRCxNQUFNLElBQUksS0FBSyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUtEOzs7Ozs7O09BT0c7SUFDSCxNQUFNLENBQUMsVUFBVSxDQUFJLEtBQVE7UUFDM0IsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7WUFDaEMsT0FBTyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNILE1BQU0sQ0FBQyxXQUFXLENBQUksR0FBUztRQUM3QixPQUFPLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsY0FBYztRQUNuQixPQUFPLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQztJQUMzQyxDQUFDOztBQXJDYyxpQ0FBb0IsR0FBc0IsSUFBSSxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDaEUsdUNBQTBCLEdBQXNCLElBQUksWUFBWSxDQUFDLEdBQUcsRUFBRSxTQUFTLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFBhcnRpYWxPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vb2JzZXJ2YWJsZS9lbXB0eSc7XG5pbXBvcnQgeyBvZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9vZic7XG5pbXBvcnQgeyB0aHJvd0Vycm9yIH0gZnJvbSAnLi9vYnNlcnZhYmxlL3Rocm93RXJyb3InO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBwdXNoLWJhc2VkIGV2ZW50IG9yIHZhbHVlIHRoYXQgYW4ge0BsaW5rIE9ic2VydmFibGV9IGNhbiBlbWl0LlxuICogVGhpcyBjbGFzcyBpcyBwYXJ0aWN1bGFybHkgdXNlZnVsIGZvciBvcGVyYXRvcnMgdGhhdCBtYW5hZ2Ugbm90aWZpY2F0aW9ucyxcbiAqIGxpa2Uge0BsaW5rIG1hdGVyaWFsaXplfSwge0BsaW5rIGRlbWF0ZXJpYWxpemV9LCB7QGxpbmsgb2JzZXJ2ZU9ufSwgYW5kXG4gKiBvdGhlcnMuIEJlc2lkZXMgd3JhcHBpbmcgdGhlIGFjdHVhbCBkZWxpdmVyZWQgdmFsdWUsIGl0IGFsc28gYW5ub3RhdGVzIGl0XG4gKiB3aXRoIG1ldGFkYXRhIG9mLCBmb3IgaW5zdGFuY2UsIHdoYXQgdHlwZSBvZiBwdXNoIG1lc3NhZ2UgaXQgaXMgKGBuZXh0YCxcbiAqIGBlcnJvcmAsIG9yIGBjb21wbGV0ZWApLlxuICpcbiAqIEBzZWUge0BsaW5rIG1hdGVyaWFsaXplfVxuICogQHNlZSB7QGxpbmsgZGVtYXRlcmlhbGl6ZX1cbiAqIEBzZWUge0BsaW5rIG9ic2VydmVPbn1cbiAqXG4gKiBAY2xhc3MgTm90aWZpY2F0aW9uPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBOb3RpZmljYXRpb248VD4ge1xuICBoYXNWYWx1ZTogYm9vbGVhbjtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMga2luZDogc3RyaW5nLCBwdWJsaWMgdmFsdWU/OiBULCBwdWJsaWMgZXJyb3I/OiBhbnkpIHtcbiAgICB0aGlzLmhhc1ZhbHVlID0ga2luZCA9PT0gJ04nO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGl2ZXJzIHRvIHRoZSBnaXZlbiBgb2JzZXJ2ZXJgIHRoZSB2YWx1ZSB3cmFwcGVkIGJ5IHRoaXMgTm90aWZpY2F0aW9uLlxuICAgKiBAcGFyYW0ge09ic2VydmVyfSBvYnNlcnZlclxuICAgKiBAcmV0dXJuXG4gICAqL1xuICBvYnNlcnZlKG9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4pOiBhbnkge1xuICAgIHN3aXRjaCAodGhpcy5raW5kKSB7XG4gICAgICBjYXNlICdOJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLm5leHQgJiYgb2JzZXJ2ZXIubmV4dCh0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuZXJyb3IgJiYgb2JzZXJ2ZXIuZXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIG9ic2VydmVyLmNvbXBsZXRlICYmIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdpdmVuIHNvbWUge0BsaW5rIE9ic2VydmVyfSBjYWxsYmFja3MsIGRlbGl2ZXIgdGhlIHZhbHVlIHJlcHJlc2VudGVkIGJ5IHRoZVxuICAgKiBjdXJyZW50IE5vdGlmaWNhdGlvbiB0byB0aGUgY29ycmVjdGx5IGNvcnJlc3BvbmRpbmcgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiB2b2lkfSBuZXh0IEFuIE9ic2VydmVyIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGRvKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IGFueSB7XG4gICAgY29uc3Qga2luZCA9IHRoaXMua2luZDtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gbmV4dCAmJiBuZXh0KHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiBlcnJvciAmJiBlcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gY29tcGxldGUgJiYgY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGFrZXMgYW4gT2JzZXJ2ZXIgb3IgaXRzIGluZGl2aWR1YWwgY2FsbGJhY2sgZnVuY3Rpb25zLCBhbmQgY2FsbHMgYG9ic2VydmVgXG4gICAqIG9yIGBkb2AgbWV0aG9kcyBhY2NvcmRpbmdseS5cbiAgICogQHBhcmFtIHtPYnNlcnZlcnxmdW5jdGlvbih2YWx1ZTogVCk6IHZvaWR9IG5leHRPck9ic2VydmVyIEFuIE9ic2VydmVyIG9yXG4gICAqIHRoZSBgbmV4dGAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oZXJyOiBhbnkpOiB2b2lkfSBbZXJyb3JdIEFuIE9ic2VydmVyIGBlcnJvcmAgY2FsbGJhY2suXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oKTogdm9pZH0gW2NvbXBsZXRlXSBBbiBPYnNlcnZlciBgY29tcGxldGVgIGNhbGxiYWNrLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICBhY2NlcHQobmV4dE9yT2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLCBlcnJvcj86IChlcnI6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gICAgaWYgKG5leHRPck9ic2VydmVyICYmIHR5cGVvZiAoPFBhcnRpYWxPYnNlcnZlcjxUPj5uZXh0T3JPYnNlcnZlcikubmV4dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIHRoaXMub2JzZXJ2ZSg8UGFydGlhbE9ic2VydmVyPFQ+Pm5leHRPck9ic2VydmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZG8oPCh2YWx1ZTogVCkgPT4gdm9pZD5uZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhIHNpbXBsZSBPYnNlcnZhYmxlIHRoYXQganVzdCBkZWxpdmVycyB0aGUgbm90aWZpY2F0aW9uIHJlcHJlc2VudGVkXG4gICAqIGJ5IHRoaXMgTm90aWZpY2F0aW9uIGluc3RhbmNlLlxuICAgKiBAcmV0dXJuIHthbnl9XG4gICAqL1xuICB0b09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3Qga2luZCA9IHRoaXMua2luZDtcbiAgICBzd2l0Y2ggKGtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gb2YodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIHRocm93RXJyb3IodGhpcy5lcnJvcik7XG4gICAgICBjYXNlICdDJzpcbiAgICAgICAgcmV0dXJuIGVtcHR5KCk7XG4gICAgfVxuICAgIHRocm93IG5ldyBFcnJvcigndW5leHBlY3RlZCBub3RpZmljYXRpb24ga2luZCB2YWx1ZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgY29tcGxldGVOb3RpZmljYXRpb246IE5vdGlmaWNhdGlvbjxhbnk+ID0gbmV3IE5vdGlmaWNhdGlvbignQycpO1xuICBwcml2YXRlIHN0YXRpYyB1bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4gPSBuZXcgTm90aWZpY2F0aW9uKCdOJywgdW5kZWZpbmVkKTtcblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYG5leHRgIGZyb20gYVxuICAgKiBnaXZlbiB2YWx1ZS5cbiAgICogQHBhcmFtIHtUfSB2YWx1ZSBUaGUgYG5leHRgIHZhbHVlLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248VD59IFRoZSBcIm5leHRcIiBOb3RpZmljYXRpb24gcmVwcmVzZW50aW5nIHRoZVxuICAgKiBhcmd1bWVudC5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVOZXh0PFQ+KHZhbHVlOiBUKTogTm90aWZpY2F0aW9uPFQ+IHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ04nLCB2YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBOb3RpZmljYXRpb24udW5kZWZpbmVkVmFsdWVOb3RpZmljYXRpb247XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYGVycm9yYCBmcm9tIGFcbiAgICogZ2l2ZW4gZXJyb3IuXG4gICAqIEBwYXJhbSB7YW55fSBbZXJyXSBUaGUgYGVycm9yYCBlcnJvci5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPFQ+fSBUaGUgXCJlcnJvclwiIE5vdGlmaWNhdGlvbiByZXByZXNlbnRpbmcgdGhlXG4gICAqIGFyZ3VtZW50LlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUVycm9yPFQ+KGVycj86IGFueSk6IE5vdGlmaWNhdGlvbjxUPiB7XG4gICAgcmV0dXJuIG5ldyBOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsIGVycik7XG4gIH1cblxuICAvKipcbiAgICogQSBzaG9ydGN1dCB0byBjcmVhdGUgYSBOb3RpZmljYXRpb24gaW5zdGFuY2Ugb2YgdGhlIHR5cGUgYGNvbXBsZXRlYC5cbiAgICogQHJldHVybiB7Tm90aWZpY2F0aW9uPGFueT59IFRoZSB2YWx1ZWxlc3MgXCJjb21wbGV0ZVwiIE5vdGlmaWNhdGlvbi5cbiAgICogQG5vY29sbGFwc2VcbiAgICovXG4gIHN0YXRpYyBjcmVhdGVDb21wbGV0ZSgpOiBOb3RpZmljYXRpb248YW55PiB7XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi5jb21wbGV0ZU5vdGlmaWNhdGlvbjtcbiAgfVxufVxuIl19