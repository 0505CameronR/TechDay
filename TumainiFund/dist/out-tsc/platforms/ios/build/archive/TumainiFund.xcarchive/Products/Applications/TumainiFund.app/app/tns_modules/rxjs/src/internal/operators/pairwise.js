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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcndpc2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9wYWlyd2lzZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDRztBQUNILFNBQWdCLFFBQVE7SUFDdEIsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDO0FBQ3hFLENBQUM7QUFGRCw0QkFFQztBQUVEO0lBQUE7SUFJQSxDQUFDO0lBSEMsK0JBQUksR0FBSixVQUFLLFVBQThCLEVBQUUsTUFBVztRQUM5QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCx1QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQW9DLHNDQUFhO0lBSS9DLDRCQUFZLFdBQStCO1FBQTNDLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSk8sYUFBTyxHQUFZLEtBQUssQ0FBQzs7SUFJakMsQ0FBQztJQUVELGtDQUFLLEdBQUwsVUFBTSxLQUFRO1FBQ1osSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1NBQzNDO2FBQU07WUFDTCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNyQjtRQUVELElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFqQkQsQ0FBb0MsdUJBQVUsR0FpQjdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEdyb3VwcyBwYWlycyBvZiBjb25zZWN1dGl2ZSBlbWlzc2lvbnMgdG9nZXRoZXIgYW5kIGVtaXRzIHRoZW0gYXMgYW4gYXJyYXkgb2ZcbiAqIHR3byB2YWx1ZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlB1dHMgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHByZXZpb3VzIHZhbHVlIHRvZ2V0aGVyIGFzXG4gKiBhbiBhcnJheSwgYW5kIGVtaXRzIHRoYXQuPC9zcGFuPlxuICpcbiAqICFbXShwYWlyd2lzZS5wbmcpXG4gKlxuICogVGhlIE50aCBlbWlzc2lvbiBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aWxsIGNhdXNlIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZVxuICogdG8gZW1pdCBhbiBhcnJheSBbKE4tMSl0aCwgTnRoXSBvZiB0aGUgcHJldmlvdXMgYW5kIHRoZSBjdXJyZW50IHZhbHVlLCBhcyBhXG4gKiBwYWlyLiBGb3IgdGhpcyByZWFzb24sIGBwYWlyd2lzZWAgZW1pdHMgb24gdGhlIHNlY29uZCBhbmQgc3Vic2VxdWVudFxuICogZW1pc3Npb25zIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBidXQgbm90IG9uIHRoZSBmaXJzdCBlbWlzc2lvbiwgYmVjYXVzZVxuICogdGhlcmUgaXMgbm8gcHJldmlvdXMgdmFsdWUgaW4gdGhhdCBjYXNlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIE9uIGV2ZXJ5IGNsaWNrIChzdGFydGluZyBmcm9tIHRoZSBzZWNvbmQpLCBlbWl0IHRoZSByZWxhdGl2ZSBkaXN0YW5jZSB0byB0aGUgcHJldmlvdXMgY2xpY2tcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBwYWlycyA9IGNsaWNrcy5waXBlKHBhaXJ3aXNlKCkpO1xuICogY29uc3QgZGlzdGFuY2UgPSBwYWlycy5waXBlKFxuICogICBtYXAocGFpciA9PiB7XG4gKiAgICAgY29uc3QgeDAgPSBwYWlyWzBdLmNsaWVudFg7XG4gKiAgICAgY29uc3QgeTAgPSBwYWlyWzBdLmNsaWVudFk7XG4gKiAgICAgY29uc3QgeDEgPSBwYWlyWzFdLmNsaWVudFg7XG4gKiAgICAgY29uc3QgeTEgPSBwYWlyWzFdLmNsaWVudFk7XG4gKiAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh4MCAtIHgxLCAyKSArIE1hdGgucG93KHkwIC0geTEsIDIpKTtcbiAqICAgfSksXG4gKiApO1xuICogZGlzdGFuY2Uuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYnVmZmVyfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyQ291bnR9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxBcnJheTxUPj59IEFuIE9ic2VydmFibGUgb2YgcGFpcnMgKGFzIGFycmF5cykgb2ZcbiAqIGNvbnNlY3V0aXZlIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgcGFpcndpc2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWlyd2lzZTxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFtULCBUXT4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFBhaXJ3aXNlT3BlcmF0b3IoKSk7XG59XG5cbmNsYXNzIFBhaXJ3aXNlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBbVCwgVF0+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFtULCBUXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUGFpcndpc2VTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgUGFpcndpc2VTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgcHJldjogVDtcbiAgcHJpdmF0ZSBoYXNQcmV2OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8W1QsIFRdPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaGFzUHJldikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KFt0aGlzLnByZXYsIHZhbHVlXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFzUHJldiA9IHRydWU7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2ID0gdmFsdWU7XG4gIH1cbn1cbiJdfQ==