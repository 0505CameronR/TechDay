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
/**
 * Groups pairs of consecutive emissions together and emits them as an array of
 * two values.
 *
 * <span class="informal">Puts the current value and previous value together as
 * an array, and emits that.</span>
 *
 * ![](pairwise.png)
 *
 * The Nth emission from the source Observable will cause the output Observable
 * to emit an array [(N-1)th, Nth] of the previous and the current value, as a
 * pair. For this reason, `pairwise` emits on the second and subsequent
 * emissions from the source Observable, but not on the first emission, because
 * there is no previous value in that case.
 *
 * ## Example
 * On every click (starting from the second), emit the relative distance to the previous click
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const pairs = clicks.pipe(pairwise());
 * const distance = pairs.pipe(
 *   map(pair => {
 *     const x0 = pair[0].clientX;
 *     const y0 = pair[0].clientY;
 *     const x1 = pair[1].clientX;
 *     const y1 = pair[1].clientY;
 *     return Math.sqrt(Math.pow(x0 - x1, 2) + Math.pow(y0 - y1, 2));
 *   }),
 * );
 * distance.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 *
 * @return {Observable<Array<T>>} An Observable of pairs (as arrays) of
 * consecutive values from the source Observable.
 * @method pairwise
 * @owner Observable
 */
function pairwise() {
    return function (source) { return source.lift(new PairwiseOperator()); };
}
exports.pairwise = pairwise;
var PairwiseOperator = /** @class */ (function () {
    function PairwiseOperator() {
    }
    PairwiseOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new PairwiseSubscriber(subscriber));
    };
    return PairwiseOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var PairwiseSubscriber = /** @class */ (function (_super) {
    __extends(PairwiseSubscriber, _super);
    function PairwiseSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasPrev = false;
        return _this;
    }
    PairwiseSubscriber.prototype._next = function (value) {
        if (this.hasPrev) {
            this.destination.next([this.prev, value]);
        }
        else {
            this.hasPrev = true;
        }
        this.prev = value;
    };
    return PairwiseSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcndpc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcGFpcndpc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBRzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxTQUFnQixRQUFRO0lBQ3RCLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixFQUFFLENBQUMsRUFBbkMsQ0FBbUMsQ0FBQztBQUN4RSxDQUFDO0FBRkQsNEJBRUM7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUhDLCtCQUFJLEdBQUosVUFBSyxVQUE4QixFQUFFLE1BQVc7UUFDOUMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFvQyxzQ0FBYTtJQUkvQyw0QkFBWSxXQUErQjtRQUEzQyxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUpPLGFBQU8sR0FBWSxLQUFLLENBQUM7O0lBSWpDLENBQUM7SUFFRCxrQ0FBSyxHQUFMLFVBQU0sS0FBUTtRQUNaLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0wsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7UUFFRCxJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztJQUNwQixDQUFDO0lBQ0gseUJBQUM7QUFBRCxDQUFDLEFBakJELENBQW9DLHVCQUFVLEdBaUI3QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBHcm91cHMgcGFpcnMgb2YgY29uc2VjdXRpdmUgZW1pc3Npb25zIHRvZ2V0aGVyIGFuZCBlbWl0cyB0aGVtIGFzIGFuIGFycmF5IG9mXG4gKiB0d28gdmFsdWVzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5QdXRzIHRoZSBjdXJyZW50IHZhbHVlIGFuZCBwcmV2aW91cyB2YWx1ZSB0b2dldGhlciBhc1xuICogYW4gYXJyYXksIGFuZCBlbWl0cyB0aGF0Ljwvc3Bhbj5cbiAqXG4gKiAhW10ocGFpcndpc2UucG5nKVxuICpcbiAqIFRoZSBOdGggZW1pc3Npb24gZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2lsbCBjYXVzZSB0aGUgb3V0cHV0IE9ic2VydmFibGVcbiAqIHRvIGVtaXQgYW4gYXJyYXkgWyhOLTEpdGgsIE50aF0gb2YgdGhlIHByZXZpb3VzIGFuZCB0aGUgY3VycmVudCB2YWx1ZSwgYXMgYVxuICogcGFpci4gRm9yIHRoaXMgcmVhc29uLCBgcGFpcndpc2VgIGVtaXRzIG9uIHRoZSBzZWNvbmQgYW5kIHN1YnNlcXVlbnRcbiAqIGVtaXNzaW9ucyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IG5vdCBvbiB0aGUgZmlyc3QgZW1pc3Npb24sIGJlY2F1c2VcbiAqIHRoZXJlIGlzIG5vIHByZXZpb3VzIHZhbHVlIGluIHRoYXQgY2FzZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBPbiBldmVyeSBjbGljayAoc3RhcnRpbmcgZnJvbSB0aGUgc2Vjb25kKSwgZW1pdCB0aGUgcmVsYXRpdmUgZGlzdGFuY2UgdG8gdGhlIHByZXZpb3VzIGNsaWNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcGFpcnMgPSBjbGlja3MucGlwZShwYWlyd2lzZSgpKTtcbiAqIGNvbnN0IGRpc3RhbmNlID0gcGFpcnMucGlwZShcbiAqICAgbWFwKHBhaXIgPT4ge1xuICogICAgIGNvbnN0IHgwID0gcGFpclswXS5jbGllbnRYO1xuICogICAgIGNvbnN0IHkwID0gcGFpclswXS5jbGllbnRZO1xuICogICAgIGNvbnN0IHgxID0gcGFpclsxXS5jbGllbnRYO1xuICogICAgIGNvbnN0IHkxID0gcGFpclsxXS5jbGllbnRZO1xuICogICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coeDAgLSB4MSwgMikgKyBNYXRoLnBvdyh5MCAtIHkxLCAyKSk7XG4gKiAgIH0pLFxuICogKTtcbiAqIGRpc3RhbmNlLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICpcbiAqIEByZXR1cm4ge09ic2VydmFibGU8QXJyYXk8VD4+fSBBbiBPYnNlcnZhYmxlIG9mIHBhaXJzIChhcyBhcnJheXMpIG9mXG4gKiBjb25zZWN1dGl2ZSB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHBhaXJ3aXNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcGFpcndpc2U8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxULCBbVCwgVF0+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBQYWlyd2lzZU9wZXJhdG9yKCkpO1xufVxuXG5jbGFzcyBQYWlyd2lzZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgW1QsIFRdPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbVCwgVF0+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFBhaXJ3aXNlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFBhaXJ3aXNlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHByZXY6IFQ7XG4gIHByaXZhdGUgaGFzUHJldjogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFtULCBUXT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc1ByZXYpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChbdGhpcy5wcmV2LCB2YWx1ZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmhhc1ByZXYgPSB0cnVlO1xuICAgIH1cblxuICAgIHRoaXMucHJldiA9IHZhbHVlO1xuICB9XG59XG4iXX0=