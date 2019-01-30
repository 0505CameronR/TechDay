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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Converts a higher-order Observable into a first-order Observable by dropping
 * inner Observables while the previous inner Observable has not yet completed.
 *
 * <span class="informal">Flattens an Observable-of-Observables by dropping the
 * next inner Observables while the current inner is still executing.</span>
 *
 * ![](exhaust.png)
 *
 * `exhaust` subscribes to an Observable that emits Observables, also known as a
 * higher-order Observable. Each time it observes one of these emitted inner
 * Observables, the output Observable begins emitting the items emitted by that
 * inner Observable. So far, it behaves like {@link mergeAll}. However,
 * `exhaust` ignores every new inner Observable if the previous Observable has
 * not yet completed. Once that one completes, it will accept and flatten the
 * next inner Observable and repeat this process.
 *
 * ## Example
 * Run a finite timer for each click, only if there is no currently active timer
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const higherOrder = clicks.pipe(
 *   map((ev) => interval(1000).pipe(take(5))),
 * );
 * const result = higherOrder.pipe(exhaust());
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link switchAll}
 * @see {@link switchMap}
 * @see {@link mergeAll}
 * @see {@link exhaustMap}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable that takes a source of Observables and propagates the first observable
 * exclusively until it completes before subscribing to the next.
 * @method exhaust
 * @owner Observable
 */
function exhaust() {
    return function (source) { return source.lift(new SwitchFirstOperator()); };
}
exports.exhaust = exhaust;
var SwitchFirstOperator = /** @class */ (function () {
    function SwitchFirstOperator() {
    }
    SwitchFirstOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchFirstSubscriber(subscriber));
    };
    return SwitchFirstOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchFirstSubscriber = /** @class */ (function (_super) {
    __extends(SwitchFirstSubscriber, _super);
    function SwitchFirstSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasCompleted = false;
        _this.hasSubscription = false;
        return _this;
    }
    SwitchFirstSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.hasSubscription = true;
            this.add(subscribeToResult_1.subscribeToResult(this, value));
        }
    };
    SwitchFirstSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
    };
    SwitchFirstSubscriber.prototype.notifyComplete = function (innerSub) {
        this.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return SwitchFirstSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhoYXVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9leGhhdXN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUlBLHNEQUFxRDtBQUNyRCwrREFBOEQ7QUFNOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFDSCxTQUFnQixPQUFPO0lBQ3JCLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG1CQUFtQixFQUFLLENBQUMsRUFBekMsQ0FBeUMsQ0FBQztBQUM5RSxDQUFDO0FBRkQsMEJBRUM7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUhDLGtDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUkscUJBQXFCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBQ0gsMEJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF1Qyx5Q0FBcUI7SUFJMUQsK0JBQVksV0FBMEI7UUFBdEMsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFMTyxrQkFBWSxHQUFZLEtBQUssQ0FBQztRQUM5QixxQkFBZSxHQUFZLEtBQUssQ0FBQzs7SUFJekMsQ0FBQztJQUVTLHFDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN6QixJQUFJLENBQUMsZUFBZSxHQUFHLElBQUksQ0FBQztZQUM1QixJQUFJLENBQUMsR0FBRyxDQUFDLHFDQUFpQixDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzFDO0lBQ0gsQ0FBQztJQUVTLHlDQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUM7UUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUU7WUFDekIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCw4Q0FBYyxHQUFkLFVBQWUsUUFBc0I7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN0QixJQUFJLENBQUMsZUFBZSxHQUFHLEtBQUssQ0FBQztRQUM3QixJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUE3QkQsQ0FBdUMsaUNBQWUsR0E2QnJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBleGhhdXN0PFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPjtcbmV4cG9ydCBmdW5jdGlvbiBleGhhdXN0PFI+KCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBSPjtcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGhpZ2hlci1vcmRlciBPYnNlcnZhYmxlIGludG8gYSBmaXJzdC1vcmRlciBPYnNlcnZhYmxlIGJ5IGRyb3BwaW5nXG4gKiBpbm5lciBPYnNlcnZhYmxlcyB3aGlsZSB0aGUgcHJldmlvdXMgaW5uZXIgT2JzZXJ2YWJsZSBoYXMgbm90IHlldCBjb21wbGV0ZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMgYnkgZHJvcHBpbmcgdGhlXG4gKiBuZXh0IGlubmVyIE9ic2VydmFibGVzIHdoaWxlIHRoZSBjdXJyZW50IGlubmVyIGlzIHN0aWxsIGV4ZWN1dGluZy48L3NwYW4+XG4gKlxuICogIVtdKGV4aGF1c3QucG5nKVxuICpcbiAqIGBleGhhdXN0YCBzdWJzY3JpYmVzIHRvIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBPYnNlcnZhYmxlcywgYWxzbyBrbm93biBhcyBhXG4gKiBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZS4gRWFjaCB0aW1lIGl0IG9ic2VydmVzIG9uZSBvZiB0aGVzZSBlbWl0dGVkIGlubmVyXG4gKiBPYnNlcnZhYmxlcywgdGhlIG91dHB1dCBPYnNlcnZhYmxlIGJlZ2lucyBlbWl0dGluZyB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGF0XG4gKiBpbm5lciBPYnNlcnZhYmxlLiBTbyBmYXIsIGl0IGJlaGF2ZXMgbGlrZSB7QGxpbmsgbWVyZ2VBbGx9LiBIb3dldmVyLFxuICogYGV4aGF1c3RgIGlnbm9yZXMgZXZlcnkgbmV3IGlubmVyIE9ic2VydmFibGUgaWYgdGhlIHByZXZpb3VzIE9ic2VydmFibGUgaGFzXG4gKiBub3QgeWV0IGNvbXBsZXRlZC4gT25jZSB0aGF0IG9uZSBjb21wbGV0ZXMsIGl0IHdpbGwgYWNjZXB0IGFuZCBmbGF0dGVuIHRoZVxuICogbmV4dCBpbm5lciBPYnNlcnZhYmxlIGFuZCByZXBlYXQgdGhpcyBwcm9jZXNzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIFJ1biBhIGZpbml0ZSB0aW1lciBmb3IgZWFjaCBjbGljaywgb25seSBpZiB0aGVyZSBpcyBubyBjdXJyZW50bHkgYWN0aXZlIHRpbWVyXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShcbiAqICAgbWFwKChldikgPT4gaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDUpKSksXG4gKiApO1xuICogY29uc3QgcmVzdWx0ID0gaGlnaGVyT3JkZXIucGlwZShleGhhdXN0KCkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXRBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXB9XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqIEBzZWUge0BsaW5rIGV4aGF1c3RNYXB9XG4gKiBAc2VlIHtAbGluayB6aXBBbGx9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IHRha2VzIGEgc291cmNlIG9mIE9ic2VydmFibGVzIGFuZCBwcm9wYWdhdGVzIHRoZSBmaXJzdCBvYnNlcnZhYmxlXG4gKiBleGNsdXNpdmVseSB1bnRpbCBpdCBjb21wbGV0ZXMgYmVmb3JlIHN1YnNjcmliaW5nIHRvIHRoZSBuZXh0LlxuICogQG1ldGhvZCBleGhhdXN0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhoYXVzdDxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgVD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFN3aXRjaEZpcnN0T3BlcmF0b3I8VD4oKSk7XG59XG5cbmNsYXNzIFN3aXRjaEZpcnN0T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU3dpdGNoRmlyc3RTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU3dpdGNoRmlyc3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBoYXNTdWJzY3JpcHRpb246IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuaGFzU3Vic2NyaXB0aW9uID0gdHJ1ZTtcbiAgICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIHZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgaWYgKCF0aGlzLmhhc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICB0aGlzLnJlbW92ZShpbm5lclN1Yik7XG4gICAgdGhpcy5oYXNTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgICBpZiAodGhpcy5oYXNDb21wbGV0ZWQpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==