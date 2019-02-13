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
 * Converts an Observable of {@link Notification} objects into the emissions
 * that they represent.
 *
 * <span class="informal">Unwraps {@link Notification} objects as actual `next`,
 * `error` and `complete` emissions. The opposite of {@link materialize}.</span>
 *
 * ![](dematerialize.png)
 *
 * `dematerialize` is assumed to operate an Observable that only emits
 * {@link Notification} objects as `next` emissions, and does not emit any
 * `error`. Such Observable is the output of a `materialize` operation. Those
 * notifications are then unwrapped using the metadata they contain, and emitted
 * as `next`, `error`, and `complete` on the output Observable.
 *
 * Use this operator in conjunction with {@link materialize}.
 *
 * ## Example
 * Convert an Observable of Notifications to an actual Observable
 * ```javascript
 * const notifA = new Notification('N', 'A');
 * const notifB = new Notification('N', 'B');
 * const notifE = new Notification('E', undefined,
 *   new TypeError('x.toUpperCase is not a function')
 * );
 * const materialized = of(notifA, notifB, notifE);
 * const upperCase = materialized.pipe(dematerialize());
 * upperCase.subscribe(x => console.log(x), e => console.error(e));
 *
 * // Results in:
 * // A
 * // B
 * // TypeError: x.toUpperCase is not a function
 * ```
 *
 * @see {@link Notification}
 * @see {@link materialize}
 *
 * @return {Observable} An Observable that emits items and notifications
 * embedded in Notification objects emitted by the source Observable.
 * @method dematerialize
 * @owner Observable
 */
function dematerialize() {
    return function dematerializeOperatorFunction(source) {
        return source.lift(new DeMaterializeOperator());
    };
}
exports.dematerialize = dematerialize;
var DeMaterializeOperator = /** @class */ (function () {
    function DeMaterializeOperator() {
    }
    DeMaterializeOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DeMaterializeSubscriber(subscriber));
    };
    return DeMaterializeOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DeMaterializeSubscriber = /** @class */ (function (_super) {
    __extends(DeMaterializeSubscriber, _super);
    function DeMaterializeSubscriber(destination) {
        return _super.call(this, destination) || this;
    }
    DeMaterializeSubscriber.prototype._next = function (value) {
        value.observe(this.destination);
    };
    return DeMaterializeSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtYXRlcmlhbGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2RlbWF0ZXJpYWxpemUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBSTNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ0c7QUFDSCxTQUFnQixhQUFhO0lBQzNCLE9BQU8sU0FBUyw2QkFBNkIsQ0FBQyxNQUFtQztRQUMvRSxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBcUIsRUFBRSxDQUFDLENBQUM7SUFDbEQsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUpELHNDQUlDO0FBRUQ7SUFBQTtJQUlBLENBQUM7SUFIQyxvQ0FBSSxHQUFKLFVBQUssVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUNILDRCQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBbUUsMkNBQWE7SUFDOUUsaUNBQVksV0FBNEI7ZUFDdEMsa0JBQU0sV0FBVyxDQUFDO0lBQ3BCLENBQUM7SUFFUyx1Q0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQVJELENBQW1FLHVCQUFVLEdBUTVFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBOb3RpZmljYXRpb24gfSBmcm9tICcuLi9Ob3RpZmljYXRpb24nO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBDb252ZXJ0cyBhbiBPYnNlcnZhYmxlIG9mIHtAbGluayBOb3RpZmljYXRpb259IG9iamVjdHMgaW50byB0aGUgZW1pc3Npb25zXG4gKiB0aGF0IHRoZXkgcmVwcmVzZW50LlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5VbndyYXBzIHtAbGluayBOb3RpZmljYXRpb259IG9iamVjdHMgYXMgYWN0dWFsIGBuZXh0YCxcbiAqIGBlcnJvcmAgYW5kIGBjb21wbGV0ZWAgZW1pc3Npb25zLiBUaGUgb3Bwb3NpdGUgb2Yge0BsaW5rIG1hdGVyaWFsaXplfS48L3NwYW4+XG4gKlxuICogIVtdKGRlbWF0ZXJpYWxpemUucG5nKVxuICpcbiAqIGBkZW1hdGVyaWFsaXplYCBpcyBhc3N1bWVkIHRvIG9wZXJhdGUgYW4gT2JzZXJ2YWJsZSB0aGF0IG9ubHkgZW1pdHNcbiAqIHtAbGluayBOb3RpZmljYXRpb259IG9iamVjdHMgYXMgYG5leHRgIGVtaXNzaW9ucywgYW5kIGRvZXMgbm90IGVtaXQgYW55XG4gKiBgZXJyb3JgLiBTdWNoIE9ic2VydmFibGUgaXMgdGhlIG91dHB1dCBvZiBhIGBtYXRlcmlhbGl6ZWAgb3BlcmF0aW9uLiBUaG9zZVxuICogbm90aWZpY2F0aW9ucyBhcmUgdGhlbiB1bndyYXBwZWQgdXNpbmcgdGhlIG1ldGFkYXRhIHRoZXkgY29udGFpbiwgYW5kIGVtaXR0ZWRcbiAqIGFzIGBuZXh0YCwgYGVycm9yYCwgYW5kIGBjb21wbGV0ZWAgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLlxuICpcbiAqIFVzZSB0aGlzIG9wZXJhdG9yIGluIGNvbmp1bmN0aW9uIHdpdGgge0BsaW5rIG1hdGVyaWFsaXplfS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb252ZXJ0IGFuIE9ic2VydmFibGUgb2YgTm90aWZpY2F0aW9ucyB0byBhbiBhY3R1YWwgT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgbm90aWZBID0gbmV3IE5vdGlmaWNhdGlvbignTicsICdBJyk7XG4gKiBjb25zdCBub3RpZkIgPSBuZXcgTm90aWZpY2F0aW9uKCdOJywgJ0InKTtcbiAqIGNvbnN0IG5vdGlmRSA9IG5ldyBOb3RpZmljYXRpb24oJ0UnLCB1bmRlZmluZWQsXG4gKiAgIG5ldyBUeXBlRXJyb3IoJ3gudG9VcHBlckNhc2UgaXMgbm90IGEgZnVuY3Rpb24nKVxuICogKTtcbiAqIGNvbnN0IG1hdGVyaWFsaXplZCA9IG9mKG5vdGlmQSwgbm90aWZCLCBub3RpZkUpO1xuICogY29uc3QgdXBwZXJDYXNlID0gbWF0ZXJpYWxpemVkLnBpcGUoZGVtYXRlcmlhbGl6ZSgpKTtcbiAqIHVwcGVyQ2FzZS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gQVxuICogLy8gQlxuICogLy8gVHlwZUVycm9yOiB4LnRvVXBwZXJDYXNlIGlzIG5vdCBhIGZ1bmN0aW9uXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBOb3RpZmljYXRpb259XG4gKiBAc2VlIHtAbGluayBtYXRlcmlhbGl6ZX1cbiAqXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgYW5kIG5vdGlmaWNhdGlvbnNcbiAqIGVtYmVkZGVkIGluIE5vdGlmaWNhdGlvbiBvYmplY3RzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBkZW1hdGVyaWFsaXplXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVtYXRlcmlhbGl6ZTxUPigpOiBPcGVyYXRvckZ1bmN0aW9uPE5vdGlmaWNhdGlvbjxUPiwgVD4ge1xuICByZXR1cm4gZnVuY3Rpb24gZGVtYXRlcmlhbGl6ZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPE5vdGlmaWNhdGlvbjxUPj4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IERlTWF0ZXJpYWxpemVPcGVyYXRvcigpKTtcbiAgfTtcbn1cblxuY2xhc3MgRGVNYXRlcmlhbGl6ZU9wZXJhdG9yPFQgZXh0ZW5kcyBOb3RpZmljYXRpb248YW55PiwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERlTWF0ZXJpYWxpemVTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRGVNYXRlcmlhbGl6ZVN1YnNjcmliZXI8VCBleHRlbmRzIE5vdGlmaWNhdGlvbjxhbnk+PiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdmFsdWUub2JzZXJ2ZSh0aGlzLmRlc3RpbmF0aW9uKTtcbiAgfVxufVxuIl19