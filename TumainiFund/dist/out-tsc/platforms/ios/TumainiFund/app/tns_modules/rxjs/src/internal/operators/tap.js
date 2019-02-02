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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3RhcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFHM0MscUNBQW9DO0FBQ3BDLGlEQUFnRDtBQUtoRCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNENHO0FBQ0gsU0FBZ0IsR0FBRyxDQUFJLGNBQXNELEVBQ3RELEtBQXdCLEVBQ3hCLFFBQXFCO0lBQzFDLE9BQU8sU0FBUyxtQkFBbUIsQ0FBQyxNQUFxQjtRQUN2RCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxVQUFVLENBQUMsY0FBYyxFQUFFLEtBQUssRUFBRSxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3RFLENBQUMsQ0FBQztBQUNKLENBQUM7QUFORCxrQkFNQztBQUVEO0lBQ0Usb0JBQW9CLGNBQXNELEVBQ3RELEtBQXdCLEVBQ3hCLFFBQXFCO1FBRnJCLG1CQUFjLEdBQWQsY0FBYyxDQUF3QztRQUN0RCxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUN4QixhQUFRLEdBQVIsUUFBUSxDQUFhO0lBQ3pDLENBQUM7SUFDRCx5QkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGFBQWEsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGNBQWMsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3pHLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUVIO0lBQStCLGlDQUFhO0lBUzFDLHVCQUFZLFdBQTBCLEVBQzFCLGNBQTBELEVBQzFELEtBQXlCLEVBQ3pCLFFBQXFCO1FBSGpDLFlBSUksa0JBQU0sV0FBVyxDQUFDLFNBWW5CO1FBdEJLLGNBQVEsR0FBeUIsV0FBSSxDQUFDO1FBRXRDLGVBQVMsR0FBeUIsV0FBSSxDQUFDO1FBRXZDLGtCQUFZLEdBQWlCLFdBQUksQ0FBQztRQU90QyxLQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssSUFBSSxXQUFJLENBQUM7UUFDL0IsS0FBSSxDQUFDLFlBQVksR0FBRyxRQUFRLElBQUksV0FBSSxDQUFDO1FBQ3JDLElBQUksdUJBQVUsQ0FBQyxjQUFjLENBQUMsRUFBRTtZQUM5QixLQUFJLENBQUMsUUFBUSxHQUFHLEtBQUksQ0FBQztZQUNyQixLQUFJLENBQUMsUUFBUSxHQUFHLGNBQWMsQ0FBQztTQUNoQzthQUFNLElBQUksY0FBYyxFQUFFO1lBQ3pCLEtBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDO1lBQy9CLEtBQUksQ0FBQyxRQUFRLEdBQUcsY0FBYyxDQUFDLElBQUksSUFBSSxXQUFJLENBQUM7WUFDNUMsS0FBSSxDQUFDLFNBQVMsR0FBRyxjQUFjLENBQUMsS0FBSyxJQUFJLFdBQUksQ0FBQztZQUM5QyxLQUFJLENBQUMsWUFBWSxHQUFHLGNBQWMsQ0FBQyxRQUFRLElBQUksV0FBSSxDQUFDO1NBQ3JEOztJQUNILENBQUM7SUFFSCw2QkFBSyxHQUFMLFVBQU0sS0FBUTtRQUNaLElBQUk7WUFDRixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1NBQzFDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRUQsOEJBQU0sR0FBTixVQUFPLEdBQVE7UUFDYixJQUFJO1lBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLENBQUMsQ0FBQztTQUN6QztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELGlDQUFTLEdBQVQ7UUFDRSxJQUFJO1lBQ0YsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBRyxDQUFDO1NBQ3pDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFDRCxPQUFPLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDckMsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQXhERCxDQUErQix1QkFBVSxHQXdEeEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgUGFydGlhbE9ic2VydmVyLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5pbXBvcnQgeyBpc0Z1bmN0aW9uIH0gZnJvbSAnLi4vdXRpbC9pc0Z1bmN0aW9uJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gdGFwPFQ+KG5leHQ/OiAoeDogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZTogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gdGFwPFQ+KG9ic2VydmVyOiBQYXJ0aWFsT2JzZXJ2ZXI8VD4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIFBlcmZvcm0gYSBzaWRlIGVmZmVjdCBmb3IgZXZlcnkgZW1pc3Npb24gb24gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgcmV0dXJuXG4gKiBhbiBPYnNlcnZhYmxlIHRoYXQgaXMgaWRlbnRpY2FsIHRvIHRoZSBzb3VyY2UuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkludGVyY2VwdHMgZWFjaCBlbWlzc2lvbiBvbiB0aGUgc291cmNlIGFuZCBydW5zIGFcbiAqIGZ1bmN0aW9uLCBidXQgcmV0dXJucyBhbiBvdXRwdXQgd2hpY2ggaXMgaWRlbnRpY2FsIHRvIHRoZSBzb3VyY2UgYXMgbG9uZyBhcyBlcnJvcnMgZG9uJ3Qgb2NjdXIuPC9zcGFuPlxuICpcbiAqICFbXShkby5wbmcpXG4gKlxuICogUmV0dXJucyBhIG1pcnJvcmVkIE9ic2VydmFibGUgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgbW9kaWZpZWQgc28gdGhhdFxuICogdGhlIHByb3ZpZGVkIE9ic2VydmVyIGlzIGNhbGxlZCB0byBwZXJmb3JtIGEgc2lkZSBlZmZlY3QgZm9yIGV2ZXJ5IHZhbHVlLFxuICogZXJyb3IsIGFuZCBjb21wbGV0aW9uIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZS4gQW55IGVycm9ycyB0aGF0IGFyZSB0aHJvd24gaW5cbiAqIHRoZSBhZm9yZW1lbnRpb25lZCBPYnNlcnZlciBvciBoYW5kbGVycyBhcmUgc2FmZWx5IHNlbnQgZG93biB0aGUgZXJyb3IgcGF0aFxuICogb2YgdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIFRoaXMgb3BlcmF0b3IgaXMgdXNlZnVsIGZvciBkZWJ1Z2dpbmcgeW91ciBPYnNlcnZhYmxlcyBmb3IgdGhlIGNvcnJlY3QgdmFsdWVzXG4gKiBvciBwZXJmb3JtaW5nIG90aGVyIHNpZGUgZWZmZWN0cy5cbiAqXG4gKiBOb3RlOiB0aGlzIGlzIGRpZmZlcmVudCB0byBhIGBzdWJzY3JpYmVgIG9uIHRoZSBPYnNlcnZhYmxlLiBJZiB0aGUgT2JzZXJ2YWJsZVxuICogcmV0dXJuZWQgYnkgYHRhcGAgaXMgbm90IHN1YnNjcmliZWQsIHRoZSBzaWRlIGVmZmVjdHMgc3BlY2lmaWVkIGJ5IHRoZVxuICogT2JzZXJ2ZXIgd2lsbCBuZXZlciBoYXBwZW4uIGB0YXBgIHRoZXJlZm9yZSBzaW1wbHkgc3BpZXMgb24gZXhpc3RpbmdcbiAqIGV4ZWN1dGlvbiwgaXQgZG9lcyBub3QgdHJpZ2dlciBhbiBleGVjdXRpb24gdG8gaGFwcGVuIGxpa2UgYHN1YnNjcmliZWAgZG9lcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBNYXAgZXZlcnkgY2xpY2sgdG8gdGhlIGNsaWVudFggcG9zaXRpb24gb2YgdGhhdCBjbGljaywgd2hpbGUgYWxzbyBsb2dnaW5nIHRoZSBjbGljayBldmVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHBvc2l0aW9ucyA9IGNsaWNrcy5waXBlKFxuICogICB0YXAoZXYgPT4gY29uc29sZS5sb2coZXYpKSxcbiAqICAgbWFwKGV2ID0+IGV2LmNsaWVudFgpLFxuICogKTtcbiAqIHBvc2l0aW9ucy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXB9XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlI3N1YnNjcmliZX1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmVyfGZ1bmN0aW9ufSBbbmV4dE9yT2JzZXJ2ZXJdIEEgbm9ybWFsIE9ic2VydmVyIG9iamVjdCBvciBhXG4gKiBjYWxsYmFjayBmb3IgYG5leHRgLlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2Vycm9yXSBDYWxsYmFjayBmb3IgZXJyb3JzIGluIHRoZSBzb3VyY2UuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29tcGxldGVdIENhbGxiYWNrIGZvciB0aGUgY29tcGxldGlvbiBvZiB0aGUgc291cmNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBpZGVudGljYWwgdG8gdGhlIHNvdXJjZSwgYnV0IHJ1bnMgdGhlXG4gKiBzcGVjaWZpZWQgT2JzZXJ2ZXIgb3IgY2FsbGJhY2socykgZm9yIGVhY2ggaXRlbS5cbiAqIEBuYW1lIHRhcFxuICovXG5leHBvcnQgZnVuY3Rpb24gdGFwPFQ+KG5leHRPck9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh4OiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I/OiAoZTogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gdGFwT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IERvT3BlcmF0b3IobmV4dE9yT2JzZXJ2ZXIsIGVycm9yLCBjb21wbGV0ZSkpO1xuICB9O1xufVxuXG5jbGFzcyBEb09wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5leHRPck9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+IHwgKCh4OiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBlcnJvcj86IChlOiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBUYXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMubmV4dE9yT2JzZXJ2ZXIsIHRoaXMuZXJyb3IsIHRoaXMuY29tcGxldGUpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuXG5jbGFzcyBUYXBTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgX2NvbnRleHQ6IGFueTtcblxuICBwcml2YXRlIF90YXBOZXh0OiAoKHZhbHVlOiBUKSA9PiB2b2lkKSA9IG5vb3A7XG5cbiAgcHJpdmF0ZSBfdGFwRXJyb3I6ICgoZXJyOiBhbnkpID0+IHZvaWQpID0gbm9vcDtcblxuICBwcml2YXRlIF90YXBDb21wbGV0ZTogKCgpID0+IHZvaWQpID0gbm9vcDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgb2JzZXJ2ZXJPck5leHQ/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgICAgZXJyb3I/OiAoZT86IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgICAgY29tcGxldGU/OiAoKSA9PiB2b2lkKSB7XG4gICAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgICB0aGlzLl90YXBFcnJvciA9IGVycm9yIHx8IG5vb3A7XG4gICAgICB0aGlzLl90YXBDb21wbGV0ZSA9IGNvbXBsZXRlIHx8IG5vb3A7XG4gICAgICBpZiAoaXNGdW5jdGlvbihvYnNlcnZlck9yTmV4dCkpIHtcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IHRoaXM7XG4gICAgICAgIHRoaXMuX3RhcE5leHQgPSBvYnNlcnZlck9yTmV4dDtcbiAgICAgIH0gZWxzZSBpZiAob2JzZXJ2ZXJPck5leHQpIHtcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IG9ic2VydmVyT3JOZXh0O1xuICAgICAgICB0aGlzLl90YXBOZXh0ID0gb2JzZXJ2ZXJPck5leHQubmV4dCB8fCBub29wO1xuICAgICAgICB0aGlzLl90YXBFcnJvciA9IG9ic2VydmVyT3JOZXh0LmVycm9yIHx8IG5vb3A7XG4gICAgICAgIHRoaXMuX3RhcENvbXBsZXRlID0gb2JzZXJ2ZXJPck5leHQuY29tcGxldGUgfHwgbm9vcDtcbiAgICAgIH1cbiAgICB9XG5cbiAgX25leHQodmFsdWU6IFQpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fdGFwTmV4dC5jYWxsKHRoaXMuX2NvbnRleHQsIHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIF9lcnJvcihlcnI6IGFueSkge1xuICAgIHRyeSB7XG4gICAgICB0aGlzLl90YXBFcnJvci5jYWxsKHRoaXMuX2NvbnRleHQsIGVycik7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgfVxuXG4gIF9jb21wbGV0ZSgpIHtcbiAgICB0cnkge1xuICAgICAgdGhpcy5fdGFwQ29tcGxldGUuY2FsbCh0aGlzLl9jb250ZXh0LCApO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=