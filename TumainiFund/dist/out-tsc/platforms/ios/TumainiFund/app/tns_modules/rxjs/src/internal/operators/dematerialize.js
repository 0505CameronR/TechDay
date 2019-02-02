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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVtYXRlcmlhbGl6ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZW1hdGVyaWFsaXplLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQUkzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMENHO0FBQ0gsU0FBZ0IsYUFBYTtJQUMzQixPQUFPLFNBQVMsNkJBQTZCLENBQUMsTUFBbUM7UUFDL0UsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUkscUJBQXFCLEVBQUUsQ0FBQyxDQUFDO0lBQ2xELENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCxzQ0FJQztBQUVEO0lBQUE7SUFJQSxDQUFDO0lBSEMsb0NBQUksR0FBSixVQUFLLFVBQTJCLEVBQUUsTUFBVztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx1QkFBdUIsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQW1FLDJDQUFhO0lBQzlFLGlDQUFZLFdBQTRCO2VBQ3RDLGtCQUFNLFdBQVcsQ0FBQztJQUNwQixDQUFDO0lBRVMsdUNBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDSCw4QkFBQztBQUFELENBQUMsQUFSRCxDQUFtRSx1QkFBVSxHQVE1RSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vTm90aWZpY2F0aW9uJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQ29udmVydHMgYW4gT2JzZXJ2YWJsZSBvZiB7QGxpbmsgTm90aWZpY2F0aW9ufSBvYmplY3RzIGludG8gdGhlIGVtaXNzaW9uc1xuICogdGhhdCB0aGV5IHJlcHJlc2VudC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VW53cmFwcyB7QGxpbmsgTm90aWZpY2F0aW9ufSBvYmplY3RzIGFzIGFjdHVhbCBgbmV4dGAsXG4gKiBgZXJyb3JgIGFuZCBgY29tcGxldGVgIGVtaXNzaW9ucy4gVGhlIG9wcG9zaXRlIG9mIHtAbGluayBtYXRlcmlhbGl6ZX0uPC9zcGFuPlxuICpcbiAqICFbXShkZW1hdGVyaWFsaXplLnBuZylcbiAqXG4gKiBgZGVtYXRlcmlhbGl6ZWAgaXMgYXNzdW1lZCB0byBvcGVyYXRlIGFuIE9ic2VydmFibGUgdGhhdCBvbmx5IGVtaXRzXG4gKiB7QGxpbmsgTm90aWZpY2F0aW9ufSBvYmplY3RzIGFzIGBuZXh0YCBlbWlzc2lvbnMsIGFuZCBkb2VzIG5vdCBlbWl0IGFueVxuICogYGVycm9yYC4gU3VjaCBPYnNlcnZhYmxlIGlzIHRoZSBvdXRwdXQgb2YgYSBgbWF0ZXJpYWxpemVgIG9wZXJhdGlvbi4gVGhvc2VcbiAqIG5vdGlmaWNhdGlvbnMgYXJlIHRoZW4gdW53cmFwcGVkIHVzaW5nIHRoZSBtZXRhZGF0YSB0aGV5IGNvbnRhaW4sIGFuZCBlbWl0dGVkXG4gKiBhcyBgbmV4dGAsIGBlcnJvcmAsIGFuZCBgY29tcGxldGVgIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiBVc2UgdGhpcyBvcGVyYXRvciBpbiBjb25qdW5jdGlvbiB3aXRoIHtAbGluayBtYXRlcmlhbGl6ZX0uXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29udmVydCBhbiBPYnNlcnZhYmxlIG9mIE5vdGlmaWNhdGlvbnMgdG8gYW4gYWN0dWFsIE9ic2VydmFibGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG5vdGlmQSA9IG5ldyBOb3RpZmljYXRpb24oJ04nLCAnQScpO1xuICogY29uc3Qgbm90aWZCID0gbmV3IE5vdGlmaWNhdGlvbignTicsICdCJyk7XG4gKiBjb25zdCBub3RpZkUgPSBuZXcgTm90aWZpY2F0aW9uKCdFJywgdW5kZWZpbmVkLFxuICogICBuZXcgVHlwZUVycm9yKCd4LnRvVXBwZXJDYXNlIGlzIG5vdCBhIGZ1bmN0aW9uJylcbiAqICk7XG4gKiBjb25zdCBtYXRlcmlhbGl6ZWQgPSBvZihub3RpZkEsIG5vdGlmQiwgbm90aWZFKTtcbiAqIGNvbnN0IHVwcGVyQ2FzZSA9IG1hdGVyaWFsaXplZC5waXBlKGRlbWF0ZXJpYWxpemUoKSk7XG4gKiB1cHBlckNhc2Uuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbjpcbiAqIC8vIEFcbiAqIC8vIEJcbiAqIC8vIFR5cGVFcnJvcjogeC50b1VwcGVyQ2FzZSBpcyBub3QgYSBmdW5jdGlvblxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgTm90aWZpY2F0aW9ufVxuICogQHNlZSB7QGxpbmsgbWF0ZXJpYWxpemV9XG4gKlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGFuZCBub3RpZmljYXRpb25zXG4gKiBlbWJlZGRlZCBpbiBOb3RpZmljYXRpb24gb2JqZWN0cyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgZGVtYXRlcmlhbGl6ZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbWF0ZXJpYWxpemU8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxOb3RpZmljYXRpb248VD4sIFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlbWF0ZXJpYWxpemVPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxOb3RpZmljYXRpb248VD4+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBEZU1hdGVyaWFsaXplT3BlcmF0b3IoKSk7XG4gIH07XG59XG5cbmNsYXNzIERlTWF0ZXJpYWxpemVPcGVyYXRvcjxUIGV4dGVuZHMgTm90aWZpY2F0aW9uPGFueT4sIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZU1hdGVyaWFsaXplU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlTWF0ZXJpYWxpemVTdWJzY3JpYmVyPFQgZXh0ZW5kcyBOb3RpZmljYXRpb248YW55Pj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIHZhbHVlLm9ic2VydmUodGhpcy5kZXN0aW5hdGlvbik7XG4gIH1cbn1cbiJdfQ==