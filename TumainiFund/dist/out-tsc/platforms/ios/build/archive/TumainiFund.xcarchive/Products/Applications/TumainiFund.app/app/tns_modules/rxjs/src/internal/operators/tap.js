"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
var noop_1 = require("../util/noop");
var isFunction_1 = require("../util/isFunction");
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
function tap(nextOrObserver, error, complete) {
    return function tapOperatorFunction(source) {
        return source.lift(new DoOperator(nextOrObserver, error, complete));
    };
}
exports.tap = tap;
var DoOperator = /** @class */ (function () {
    function DoOperator(nextOrObserver, error, complete) {
        this.nextOrObserver = nextOrObserver;
        this.error = error;
        this.complete = complete;
    }
    DoOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new TapSubscriber(subscriber, this.nextOrObserver, this.error, this.complete));
    };
    return DoOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TapSubscriber = /** @class */ (function (_super) {
    __extends(TapSubscriber, _super);
    function TapSubscriber(destination, observerOrNext, error, complete) {
        var _this = _super.call(this, destination) || this;
        _this._tapNext = noop_1.noop;
        _this._tapError = noop_1.noop;
        _this._tapComplete = noop_1.noop;
        _this._tapError = error || noop_1.noop;
        _this._tapComplete = complete || noop_1.noop;
        if (isFunction_1.isFunction(observerOrNext)) {
            _this._context = _this;
            _this._tapNext = observerOrNext;
        }
        else if (observerOrNext) {
            _this._context = observerOrNext;
            _this._tapNext = observerOrNext.next || noop_1.noop;
            _this._tapError = observerOrNext.error || noop_1.noop;
            _this._tapComplete = observerOrNext.complete || noop_1.noop;
        }
        return _this;
    }
    TapSubscriber.prototype._next = function (value) {
        try {
            this._tapNext.call(this._context, value);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(value);
    };
    TapSubscriber.prototype._error = function (err) {
        try {
            this._tapError.call(this._context, err);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.error(err);
    };
    TapSubscriber.prototype._complete = function () {
        try {
            this._tapComplete.call(this._context);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        return this.destination.complete();
    };
    return TapSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQUczQyxxQ0FBb0M7QUFDcEMsaURBQWdEO0FBS2hELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q0c7QUFDSCxTQUFnQixHQUFHLENBQUksY0FBc0QsRUFDdEQsS0FBd0IsRUFDeEIsUUFBcUI7SUFDMUMsT0FBTyxTQUFTLG1CQUFtQixDQUFDLE1BQXFCO1FBQ3ZELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFVBQVUsQ0FBQyxjQUFjLEVBQUUsS0FBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDdEUsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQU5ELGtCQU1DO0FBRUQ7SUFDRSxvQkFBb0IsY0FBc0QsRUFDdEQsS0FBd0IsRUFDeEIsUUFBcUI7UUFGckIsbUJBQWMsR0FBZCxjQUFjLENBQXdDO1FBQ3RELFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQWE7SUFDekMsQ0FBQztJQUNELHlCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksYUFBYSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDekcsQ0FBQztJQUNILGlCQUFDO0FBQUQsQ0FBQyxBQVJELElBUUM7QUFFRDs7OztHQUlHO0FBRUg7SUFBK0IsaUNBQWE7SUFTMUMsdUJBQVksV0FBMEIsRUFDMUIsY0FBMEQsRUFDMUQsS0FBeUIsRUFDekIsUUFBcUI7UUFIakMsWUFJSSxrQkFBTSxXQUFXLENBQUMsU0FZbkI7UUF0QkssY0FBUSxHQUF5QixXQUFJLENBQUM7UUFFdEMsZUFBUyxHQUF5QixXQUFJLENBQUM7UUFFdkMsa0JBQVksR0FBaUIsV0FBSSxDQUFDO1FBT3RDLEtBQUksQ0FBQyxTQUFTLEdBQUcsS0FBSyxJQUFJLFdBQUksQ0FBQztRQUMvQixLQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsSUFBSSxXQUFJLENBQUM7UUFDckMsSUFBSSx1QkFBVSxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQzlCLEtBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSSxDQUFDO1lBQ3JCLEtBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1NBQ2hDO2FBQU0sSUFBSSxjQUFjLEVBQUU7WUFDekIsS0FBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUM7WUFDL0IsS0FBSSxDQUFDLFFBQVEsR0FBRyxjQUFjLENBQUMsSUFBSSxJQUFJLFdBQUksQ0FBQztZQUM1QyxLQUFJLENBQUMsU0FBUyxHQUFHLGNBQWMsQ0FBQyxLQUFLLElBQUksV0FBSSxDQUFDO1lBQzlDLEtBQUksQ0FBQyxZQUFZLEdBQUcsY0FBYyxDQUFDLFFBQVEsSUFBSSxXQUFJLENBQUM7U0FDckQ7O0lBQ0gsQ0FBQztJQUVILDZCQUFLLEdBQUwsVUFBTSxLQUFRO1FBQ1osSUFBSTtZQUNGLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDMUM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCw4QkFBTSxHQUFOLFVBQU8sR0FBUTtRQUNiLElBQUk7WUFDRixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1NBQ3pDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQsaUNBQVMsR0FBVDtRQUNFLElBQUk7WUFDRixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFHLENBQUM7U0FDekM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNyQyxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBeERELENBQStCLHVCQUFVLEdBd0R4QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBub29wIH0gZnJvbSAnLi4vdXRpbC9ub29wJztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4obmV4dD86ICh4OiBUKSA9PiB2b2lkLCBlcnJvcj86IChlOiBhbnkpID0+IHZvaWQsIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4ob2JzZXJ2ZXI6IFBhcnRpYWxPYnNlcnZlcjxUPik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUGVyZm9ybSBhIHNpZGUgZWZmZWN0IGZvciBldmVyeSBlbWlzc2lvbiBvbiB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCByZXR1cm5cbiAqIGFuIE9ic2VydmFibGUgdGhhdCBpcyBpZGVudGljYWwgdG8gdGhlIHNvdXJjZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SW50ZXJjZXB0cyBlYWNoIGVtaXNzaW9uIG9uIHRoZSBzb3VyY2UgYW5kIHJ1bnMgYVxuICogZnVuY3Rpb24sIGJ1dCByZXR1cm5zIGFuIG91dHB1dCB3aGljaCBpcyBpZGVudGljYWwgdG8gdGhlIHNvdXJjZSBhcyBsb25nIGFzIGVycm9ycyBkb24ndCBvY2N1ci48L3NwYW4+XG4gKlxuICogIVtdKGRvLnBuZylcbiAqXG4gKiBSZXR1cm5zIGEgbWlycm9yZWQgT2JzZXJ2YWJsZSBvZiB0aGUgc291cmNlIE9ic2VydmFibGUsIGJ1dCBtb2RpZmllZCBzbyB0aGF0XG4gKiB0aGUgcHJvdmlkZWQgT2JzZXJ2ZXIgaXMgY2FsbGVkIHRvIHBlcmZvcm0gYSBzaWRlIGVmZmVjdCBmb3IgZXZlcnkgdmFsdWUsXG4gKiBlcnJvciwgYW5kIGNvbXBsZXRpb24gZW1pdHRlZCBieSB0aGUgc291cmNlLiBBbnkgZXJyb3JzIHRoYXQgYXJlIHRocm93biBpblxuICogdGhlIGFmb3JlbWVudGlvbmVkIE9ic2VydmVyIG9yIGhhbmRsZXJzIGFyZSBzYWZlbHkgc2VudCBkb3duIHRoZSBlcnJvciBwYXRoXG4gKiBvZiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogVGhpcyBvcGVyYXRvciBpcyB1c2VmdWwgZm9yIGRlYnVnZ2luZyB5b3VyIE9ic2VydmFibGVzIGZvciB0aGUgY29ycmVjdCB2YWx1ZXNcbiAqIG9yIHBlcmZvcm1pbmcgb3RoZXIgc2lkZSBlZmZlY3RzLlxuICpcbiAqIE5vdGU6IHRoaXMgaXMgZGlmZmVyZW50IHRvIGEgYHN1YnNjcmliZWAgb24gdGhlIE9ic2VydmFibGUuIElmIHRoZSBPYnNlcnZhYmxlXG4gKiByZXR1cm5lZCBieSBgdGFwYCBpcyBub3Qgc3Vic2NyaWJlZCwgdGhlIHNpZGUgZWZmZWN0cyBzcGVjaWZpZWQgYnkgdGhlXG4gKiBPYnNlcnZlciB3aWxsIG5ldmVyIGhhcHBlbi4gYHRhcGAgdGhlcmVmb3JlIHNpbXBseSBzcGllcyBvbiBleGlzdGluZ1xuICogZXhlY3V0aW9uLCBpdCBkb2VzIG5vdCB0cmlnZ2VyIGFuIGV4ZWN1dGlvbiB0byBoYXBwZW4gbGlrZSBgc3Vic2NyaWJlYCBkb2VzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE1hcCBldmVyeSBjbGljayB0byB0aGUgY2xpZW50WCBwb3NpdGlvbiBvZiB0aGF0IGNsaWNrLCB3aGlsZSBhbHNvIGxvZ2dpbmcgdGhlIGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcG9zaXRpb25zID0gY2xpY2tzLnBpcGUoXG4gKiAgIHRhcChldiA9PiBjb25zb2xlLmxvZyhldikpLFxuICogICBtYXAoZXYgPT4gZXYuY2xpZW50WCksXG4gKiApO1xuICogcG9zaXRpb25zLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1hcH1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGUjc3Vic2NyaWJlfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2ZXJ8ZnVuY3Rpb259IFtuZXh0T3JPYnNlcnZlcl0gQSBub3JtYWwgT2JzZXJ2ZXIgb2JqZWN0IG9yIGFcbiAqIGNhbGxiYWNrIGZvciBgbmV4dGAuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbZXJyb3JdIENhbGxiYWNrIGZvciBlcnJvcnMgaW4gdGhlIHNvdXJjZS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtjb21wbGV0ZV0gQ2FsbGJhY2sgZm9yIHRoZSBjb21wbGV0aW9uIG9mIHRoZSBzb3VyY2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIGlkZW50aWNhbCB0byB0aGUgc291cmNlLCBidXQgcnVucyB0aGVcbiAqIHNwZWNpZmllZCBPYnNlcnZlciBvciBjYWxsYmFjayhzKSBmb3IgZWFjaCBpdGVtLlxuICogQG5hbWUgdGFwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0YXA8VD4obmV4dE9yT2JzZXJ2ZXI/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHg6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICAgICAgICAgICBlcnJvcj86IChlOiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiBmdW5jdGlvbiB0YXBPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgRG9PcGVyYXRvcihuZXh0T3JPYnNlcnZlciwgZXJyb3IsIGNvbXBsZXRlKSk7XG4gIH07XG59XG5cbmNsYXNzIERvT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmV4dE9yT2JzZXJ2ZXI/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHg6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBwcml2YXRlIGVycm9yPzogKGU6IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgfVxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFRhcFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5uZXh0T3JPYnNlcnZlciwgdGhpcy5lcnJvciwgdGhpcy5jb21wbGV0ZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5cbmNsYXNzIFRhcFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBfY29udGV4dDogYW55O1xuXG4gIHByaXZhdGUgX3RhcE5leHQ6ICgodmFsdWU6IFQpID0+IHZvaWQpID0gbm9vcDtcblxuICBwcml2YXRlIF90YXBFcnJvcjogKChlcnI6IGFueSkgPT4gdm9pZCkgPSBub29wO1xuXG4gIHByaXZhdGUgX3RhcENvbXBsZXRlOiAoKCkgPT4gdm9pZCkgPSBub29wO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBvYnNlcnZlck9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgICBlcnJvcj86IChlPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpIHtcbiAgICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICAgIHRoaXMuX3RhcEVycm9yID0gZXJyb3IgfHwgbm9vcDtcbiAgICAgIHRoaXMuX3RhcENvbXBsZXRlID0gY29tcGxldGUgfHwgbm9vcDtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKG9ic2VydmVyT3JOZXh0KSkge1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gdGhpcztcbiAgICAgICAgdGhpcy5fdGFwTmV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgfSBlbHNlIGlmIChvYnNlcnZlck9yTmV4dCkge1xuICAgICAgICB0aGlzLl9jb250ZXh0ID0gb2JzZXJ2ZXJPck5leHQ7XG4gICAgICAgIHRoaXMuX3RhcE5leHQgPSBvYnNlcnZlck9yTmV4dC5uZXh0IHx8IG5vb3A7XG4gICAgICAgIHRoaXMuX3RhcEVycm9yID0gb2JzZXJ2ZXJPck5leHQuZXJyb3IgfHwgbm9vcDtcbiAgICAgICAgdGhpcy5fdGFwQ29tcGxldGUgPSBvYnNlcnZlck9yTmV4dC5jb21wbGV0ZSB8fCBub29wO1xuICAgICAgfVxuICAgIH1cblxuICBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl90YXBOZXh0LmNhbGwodGhpcy5fY29udGV4dCwgdmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICB9XG5cbiAgX2Vycm9yKGVycjogYW55KSB7XG4gICAgdHJ5IHtcbiAgICAgIHRoaXMuX3RhcEVycm9yLmNhbGwodGhpcy5fY29udGV4dCwgZXJyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgX2NvbXBsZXRlKCkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl90YXBDb21wbGV0ZS5jYWxsKHRoaXMuX2NvbnRleHQsICk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==