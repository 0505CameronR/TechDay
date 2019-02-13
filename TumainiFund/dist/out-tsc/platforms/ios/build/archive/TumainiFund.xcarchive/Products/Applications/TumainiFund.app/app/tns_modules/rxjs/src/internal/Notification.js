"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var empty_1 = require("./observable/empty");
var of_1 = require("./observable/of");
var throwError_1 = require("./observable/throwError");
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
var Notification = /** @class */ (function () {
    function Notification(kind, value, error) {
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
    Notification.prototype.observe = function (observer) {
        switch (this.kind) {
            case 'N':
                return observer.next && observer.next(this.value);
            case 'E':
                return observer.error && observer.error(this.error);
            case 'C':
                return observer.complete && observer.complete();
        }
    };
    /**
     * Given some {@link Observer} callbacks, deliver the value represented by the
     * current Notification to the correctly corresponding callback.
     * @param {function(value: T): void} next An Observer `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.do = function (next, error, complete) {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return next && next(this.value);
            case 'E':
                return error && error(this.error);
            case 'C':
                return complete && complete();
        }
    };
    /**
     * Takes an Observer or its individual callback functions, and calls `observe`
     * or `do` methods accordingly.
     * @param {Observer|function(value: T): void} nextOrObserver An Observer or
     * the `next` callback.
     * @param {function(err: any): void} [error] An Observer `error` callback.
     * @param {function(): void} [complete] An Observer `complete` callback.
     * @return {any}
     */
    Notification.prototype.accept = function (nextOrObserver, error, complete) {
        if (nextOrObserver && typeof nextOrObserver.next === 'function') {
            return this.observe(nextOrObserver);
        }
        else {
            return this.do(nextOrObserver, error, complete);
        }
    };
    /**
     * Returns a simple Observable that just delivers the notification represented
     * by this Notification instance.
     * @return {any}
     */
    Notification.prototype.toObservable = function () {
        var kind = this.kind;
        switch (kind) {
            case 'N':
                return of_1.of(this.value);
            case 'E':
                return throwError_1.throwError(this.error);
            case 'C':
                return empty_1.empty();
        }
        throw new Error('unexpected notification kind value');
    };
    /**
     * A shortcut to create a Notification instance of the type `next` from a
     * given value.
     * @param {T} value The `next` value.
     * @return {Notification<T>} The "next" Notification representing the
     * argument.
     * @nocollapse
     */
    Notification.createNext = function (value) {
        if (typeof value !== 'undefined') {
            return new Notification('N', value);
        }
        return Notification.undefinedValueNotification;
    };
    /**
     * A shortcut to create a Notification instance of the type `error` from a
     * given error.
     * @param {any} [err] The `error` error.
     * @return {Notification<T>} The "error" Notification representing the
     * argument.
     * @nocollapse
     */
    Notification.createError = function (err) {
        return new Notification('E', undefined, err);
    };
    /**
     * A shortcut to create a Notification instance of the type `complete`.
     * @return {Notification<any>} The valueless "complete" Notification.
     * @nocollapse
     */
    Notification.createComplete = function () {
        return Notification.completeNotification;
    };
    Notification.completeNotification = new Notification('C');
    Notification.undefinedValueNotification = new Notification('N', undefined);
    return Notification;
}());
exports.Notification = Notification;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTm90aWZpY2F0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9Ob3RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSw0Q0FBMkM7QUFDM0Msc0NBQXFDO0FBQ3JDLHNEQUFxRDtBQUVyRDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0g7SUFHRSxzQkFBbUIsSUFBWSxFQUFTLEtBQVMsRUFBUyxLQUFXO1FBQWxELFNBQUksR0FBSixJQUFJLENBQVE7UUFBUyxVQUFLLEdBQUwsS0FBSyxDQUFJO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBTTtRQUNuRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksS0FBSyxHQUFHLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCw4QkFBTyxHQUFQLFVBQVEsUUFBNEI7UUFDbEMsUUFBUSxJQUFJLENBQUMsSUFBSSxFQUFFO1lBQ2pCLEtBQUssR0FBRztnQkFDTixPQUFPLFFBQVEsQ0FBQyxJQUFJLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEQsS0FBSyxHQUFHO2dCQUNOLE9BQU8sUUFBUSxDQUFDLEtBQUssSUFBSSxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN0RCxLQUFLLEdBQUc7Z0JBQ04sT0FBTyxRQUFRLENBQUMsUUFBUSxJQUFJLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUNuRDtJQUNILENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gseUJBQUUsR0FBRixVQUFHLElBQXdCLEVBQUUsS0FBMEIsRUFBRSxRQUFxQjtRQUM1RSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxHQUFHO2dCQUNOLE9BQU8sSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEMsS0FBSyxHQUFHO2dCQUNOLE9BQU8sS0FBSyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDcEMsS0FBSyxHQUFHO2dCQUNOLE9BQU8sUUFBUSxJQUFJLFFBQVEsRUFBRSxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVEOzs7Ozs7OztPQVFHO0lBQ0gsNkJBQU0sR0FBTixVQUFPLGNBQXlELEVBQUUsS0FBMEIsRUFBRSxRQUFxQjtRQUNqSCxJQUFJLGNBQWMsSUFBSSxPQUE0QixjQUFlLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUNyRixPQUFPLElBQUksQ0FBQyxPQUFPLENBQXFCLGNBQWMsQ0FBQyxDQUFDO1NBQ3pEO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQyxFQUFFLENBQXFCLGNBQWMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDckU7SUFDSCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILG1DQUFZLEdBQVo7UUFDRSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQ3ZCLFFBQVEsSUFBSSxFQUFFO1lBQ1osS0FBSyxHQUFHO2dCQUNOLE9BQU8sT0FBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixLQUFLLEdBQUc7Z0JBQ04sT0FBTyx1QkFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxLQUFLLEdBQUc7Z0JBQ04sT0FBTyxhQUFLLEVBQUUsQ0FBQztTQUNsQjtRQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBS0Q7Ozs7Ozs7T0FPRztJQUNJLHVCQUFVLEdBQWpCLFVBQXFCLEtBQVE7UUFDM0IsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7WUFDaEMsT0FBTyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDckM7UUFDRCxPQUFPLFlBQVksQ0FBQywwQkFBMEIsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7Ozs7Ozs7T0FPRztJQUNJLHdCQUFXLEdBQWxCLFVBQXNCLEdBQVM7UUFDN0IsT0FBTyxJQUFJLFlBQVksQ0FBQyxHQUFHLEVBQUUsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ksMkJBQWMsR0FBckI7UUFDRSxPQUFPLFlBQVksQ0FBQyxvQkFBb0IsQ0FBQztJQUMzQyxDQUFDO0lBckNjLGlDQUFvQixHQUFzQixJQUFJLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNoRSx1Q0FBMEIsR0FBc0IsSUFBSSxZQUFZLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBcUNsRyxtQkFBQztDQUFBLEFBcEhELElBb0hDO0FBcEhZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUGFydGlhbE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IG9mIH0gZnJvbSAnLi9vYnNlcnZhYmxlL29mJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5cbi8qKlxuICogUmVwcmVzZW50cyBhIHB1c2gtYmFzZWQgZXZlbnQgb3IgdmFsdWUgdGhhdCBhbiB7QGxpbmsgT2JzZXJ2YWJsZX0gY2FuIGVtaXQuXG4gKiBUaGlzIGNsYXNzIGlzIHBhcnRpY3VsYXJseSB1c2VmdWwgZm9yIG9wZXJhdG9ycyB0aGF0IG1hbmFnZSBub3RpZmljYXRpb25zLFxuICogbGlrZSB7QGxpbmsgbWF0ZXJpYWxpemV9LCB7QGxpbmsgZGVtYXRlcmlhbGl6ZX0sIHtAbGluayBvYnNlcnZlT259LCBhbmRcbiAqIG90aGVycy4gQmVzaWRlcyB3cmFwcGluZyB0aGUgYWN0dWFsIGRlbGl2ZXJlZCB2YWx1ZSwgaXQgYWxzbyBhbm5vdGF0ZXMgaXRcbiAqIHdpdGggbWV0YWRhdGEgb2YsIGZvciBpbnN0YW5jZSwgd2hhdCB0eXBlIG9mIHB1c2ggbWVzc2FnZSBpdCBpcyAoYG5leHRgLFxuICogYGVycm9yYCwgb3IgYGNvbXBsZXRlYCkuXG4gKlxuICogQHNlZSB7QGxpbmsgbWF0ZXJpYWxpemV9XG4gKiBAc2VlIHtAbGluayBkZW1hdGVyaWFsaXplfVxuICogQHNlZSB7QGxpbmsgb2JzZXJ2ZU9ufVxuICpcbiAqIEBjbGFzcyBOb3RpZmljYXRpb248VD5cbiAqL1xuZXhwb3J0IGNsYXNzIE5vdGlmaWNhdGlvbjxUPiB7XG4gIGhhc1ZhbHVlOiBib29sZWFuO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBraW5kOiBzdHJpbmcsIHB1YmxpYyB2YWx1ZT86IFQsIHB1YmxpYyBlcnJvcj86IGFueSkge1xuICAgIHRoaXMuaGFzVmFsdWUgPSBraW5kID09PSAnTic7XG4gIH1cblxuICAvKipcbiAgICogRGVsaXZlcnMgdG8gdGhlIGdpdmVuIGBvYnNlcnZlcmAgdGhlIHZhbHVlIHdyYXBwZWQgYnkgdGhpcyBOb3RpZmljYXRpb24uXG4gICAqIEBwYXJhbSB7T2JzZXJ2ZXJ9IG9ic2VydmVyXG4gICAqIEByZXR1cm5cbiAgICovXG4gIG9ic2VydmUob2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPik6IGFueSB7XG4gICAgc3dpdGNoICh0aGlzLmtpbmQpIHtcbiAgICAgIGNhc2UgJ04nOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIubmV4dCAmJiBvYnNlcnZlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgY2FzZSAnRSc6XG4gICAgICAgIHJldHVybiBvYnNlcnZlci5lcnJvciAmJiBvYnNlcnZlci5lcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gb2JzZXJ2ZXIuY29tcGxldGUgJiYgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2l2ZW4gc29tZSB7QGxpbmsgT2JzZXJ2ZXJ9IGNhbGxiYWNrcywgZGVsaXZlciB0aGUgdmFsdWUgcmVwcmVzZW50ZWQgYnkgdGhlXG4gICAqIGN1cnJlbnQgTm90aWZpY2F0aW9uIHRvIHRoZSBjb3JyZWN0bHkgY29ycmVzcG9uZGluZyBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IHZvaWR9IG5leHQgQW4gT2JzZXJ2ZXIgYG5leHRgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKGVycjogYW55KTogdm9pZH0gW2Vycm9yXSBBbiBPYnNlcnZlciBgZXJyb3JgIGNhbGxiYWNrLlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IHZvaWR9IFtjb21wbGV0ZV0gQW4gT2JzZXJ2ZXIgYGNvbXBsZXRlYCBjYWxsYmFjay5cbiAgICogQHJldHVybiB7YW55fVxuICAgKi9cbiAgZG8obmV4dDogKHZhbHVlOiBUKSA9PiB2b2lkLCBlcnJvcj86IChlcnI6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogYW55IHtcbiAgICBjb25zdCBraW5kID0gdGhpcy5raW5kO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBuZXh0ICYmIG5leHQodGhpcy52YWx1ZSk7XG4gICAgICBjYXNlICdFJzpcbiAgICAgICAgcmV0dXJuIGVycm9yICYmIGVycm9yKHRoaXMuZXJyb3IpO1xuICAgICAgY2FzZSAnQyc6XG4gICAgICAgIHJldHVybiBjb21wbGV0ZSAmJiBjb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUYWtlcyBhbiBPYnNlcnZlciBvciBpdHMgaW5kaXZpZHVhbCBjYWxsYmFjayBmdW5jdGlvbnMsIGFuZCBjYWxscyBgb2JzZXJ2ZWBcbiAgICogb3IgYGRvYCBtZXRob2RzIGFjY29yZGluZ2x5LlxuICAgKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9uKHZhbHVlOiBUKTogdm9pZH0gbmV4dE9yT2JzZXJ2ZXIgQW4gT2JzZXJ2ZXIgb3JcbiAgICogdGhlIGBuZXh0YCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbihlcnI6IGFueSk6IHZvaWR9IFtlcnJvcl0gQW4gT2JzZXJ2ZXIgYGVycm9yYCBjYWxsYmFjay5cbiAgICogQHBhcmFtIHtmdW5jdGlvbigpOiB2b2lkfSBbY29tcGxldGVdIEFuIE9ic2VydmVyIGBjb21wbGV0ZWAgY2FsbGJhY2suXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIGFjY2VwdChuZXh0T3JPYnNlcnZlcjogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh2YWx1ZTogVCkgPT4gdm9pZCksIGVycm9yPzogKGVycjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICBpZiAobmV4dE9yT2JzZXJ2ZXIgJiYgdHlwZW9mICg8UGFydGlhbE9ic2VydmVyPFQ+Pm5leHRPck9ic2VydmVyKS5uZXh0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gdGhpcy5vYnNlcnZlKDxQYXJ0aWFsT2JzZXJ2ZXI8VD4+bmV4dE9yT2JzZXJ2ZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kbyg8KHZhbHVlOiBUKSA9PiB2b2lkPm5leHRPck9ic2VydmVyLCBlcnJvciwgY29tcGxldGUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGEgc2ltcGxlIE9ic2VydmFibGUgdGhhdCBqdXN0IGRlbGl2ZXJzIHRoZSBub3RpZmljYXRpb24gcmVwcmVzZW50ZWRcbiAgICogYnkgdGhpcyBOb3RpZmljYXRpb24gaW5zdGFuY2UuXG4gICAqIEByZXR1cm4ge2FueX1cbiAgICovXG4gIHRvT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBraW5kID0gdGhpcy5raW5kO1xuICAgIHN3aXRjaCAoa2luZCkge1xuICAgICAgY2FzZSAnTic6XG4gICAgICAgIHJldHVybiBvZih0aGlzLnZhbHVlKTtcbiAgICAgIGNhc2UgJ0UnOlxuICAgICAgICByZXR1cm4gdGhyb3dFcnJvcih0aGlzLmVycm9yKTtcbiAgICAgIGNhc2UgJ0MnOlxuICAgICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICB9XG4gICAgdGhyb3cgbmV3IEVycm9yKCd1bmV4cGVjdGVkIG5vdGlmaWNhdGlvbiBraW5kIHZhbHVlJyk7XG4gIH1cblxuICBwcml2YXRlIHN0YXRpYyBjb21wbGV0ZU5vdGlmaWNhdGlvbjogTm90aWZpY2F0aW9uPGFueT4gPSBuZXcgTm90aWZpY2F0aW9uKCdDJyk7XG4gIHByaXZhdGUgc3RhdGljIHVuZGVmaW5lZFZhbHVlTm90aWZpY2F0aW9uOiBOb3RpZmljYXRpb248YW55PiA9IG5ldyBOb3RpZmljYXRpb24oJ04nLCB1bmRlZmluZWQpO1xuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgbmV4dGAgZnJvbSBhXG4gICAqIGdpdmVuIHZhbHVlLlxuICAgKiBAcGFyYW0ge1R9IHZhbHVlIFRoZSBgbmV4dGAgdmFsdWUuXG4gICAqIEByZXR1cm4ge05vdGlmaWNhdGlvbjxUPn0gVGhlIFwibmV4dFwiIE5vdGlmaWNhdGlvbiByZXByZXNlbnRpbmcgdGhlXG4gICAqIGFyZ3VtZW50LlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZU5leHQ8VD4odmFsdWU6IFQpOiBOb3RpZmljYXRpb248VD4ge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignTicsIHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIE5vdGlmaWNhdGlvbi51bmRlZmluZWRWYWx1ZU5vdGlmaWNhdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgZXJyb3JgIGZyb20gYVxuICAgKiBnaXZlbiBlcnJvci5cbiAgICogQHBhcmFtIHthbnl9IFtlcnJdIFRoZSBgZXJyb3JgIGVycm9yLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248VD59IFRoZSBcImVycm9yXCIgTm90aWZpY2F0aW9uIHJlcHJlc2VudGluZyB0aGVcbiAgICogYXJndW1lbnQuXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlRXJyb3I8VD4oZXJyPzogYW55KTogTm90aWZpY2F0aW9uPFQ+IHtcbiAgICByZXR1cm4gbmV3IE5vdGlmaWNhdGlvbignRScsIHVuZGVmaW5lZCwgZXJyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHNob3J0Y3V0IHRvIGNyZWF0ZSBhIE5vdGlmaWNhdGlvbiBpbnN0YW5jZSBvZiB0aGUgdHlwZSBgY29tcGxldGVgLlxuICAgKiBAcmV0dXJuIHtOb3RpZmljYXRpb248YW55Pn0gVGhlIHZhbHVlbGVzcyBcImNvbXBsZXRlXCIgTm90aWZpY2F0aW9uLlxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZUNvbXBsZXRlKCk6IE5vdGlmaWNhdGlvbjxhbnk+IHtcbiAgICByZXR1cm4gTm90aWZpY2F0aW9uLmNvbXBsZXRlTm90aWZpY2F0aW9uO1xuICB9XG59XG4iXX0=