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
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * ![](ignoreElements.png)
 *
 * ## Examples
 * ### Ignores emitted values, reacts to observable's completion.
 * ```javascript
 * of('you', 'talking', 'to', 'me').pipe(
 *   ignoreElements(),
 * )
 * .subscribe(
 *   word => console.log(word),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'the end'
 * ```
 * @return {Observable} An empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
exports.ignoreElements = ignoreElements;
var IgnoreElementsOperator = /** @class */ (function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    };
    return IgnoreElementsOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IgnoreElementsSubscriber = /** @class */ (function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
        // Do nothing
    };
    return IgnoreElementsSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9pZ25vcmVFbGVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0gsU0FBZ0IsY0FBYztJQUM1QixPQUFPLFNBQVMsOEJBQThCLENBQUMsTUFBdUI7UUFDcEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQztBQUNKLENBQUM7QUFKRCx3Q0FJQztBQUVEO0lBQUE7SUFJQSxDQUFDO0lBSEMscUNBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSx3QkFBd0IsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTBDLDRDQUFhO0lBQXZEOztJQUlBLENBQUM7SUFIVyx3Q0FBSyxHQUFmLFVBQWdCLE1BQVM7UUFDdkIsYUFBYTtJQUNmLENBQUM7SUFDSCwrQkFBQztBQUFELENBQUMsQUFKRCxDQUEwQyx1QkFBVSxHQUluRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBJZ25vcmVzIGFsbCBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhbmQgb25seSBwYXNzZXMgY2FsbHMgb2YgYGNvbXBsZXRlYCBvciBgZXJyb3JgLlxuICpcbiAqICFbXShpZ25vcmVFbGVtZW50cy5wbmcpXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBJZ25vcmVzIGVtaXR0ZWQgdmFsdWVzLCByZWFjdHMgdG8gb2JzZXJ2YWJsZSdzIGNvbXBsZXRpb24uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZigneW91JywgJ3RhbGtpbmcnLCAndG8nLCAnbWUnKS5waXBlKFxuICogICBpZ25vcmVFbGVtZW50cygpLFxuICogKVxuICogLnN1YnNjcmliZShcbiAqICAgd29yZCA9PiBjb25zb2xlLmxvZyh3b3JkKSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICd0aGUgZW5kJ1xuICogYGBgXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBlbXB0eSBPYnNlcnZhYmxlIHRoYXQgb25seSBjYWxscyBgY29tcGxldGVgXG4gKiBvciBgZXJyb3JgLCBiYXNlZCBvbiB3aGljaCBvbmUgaXMgY2FsbGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgaWdub3JlRWxlbWVudHNcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmVFbGVtZW50cygpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgbmV2ZXI+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yZUVsZW1lbnRzT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8YW55Pikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgSWdub3JlRWxlbWVudHNPcGVyYXRvcigpKTtcbiAgfTtcbn1cblxuY2xhc3MgSWdub3JlRWxlbWVudHNPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IElnbm9yZUVsZW1lbnRzU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIElnbm9yZUVsZW1lbnRzU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcm90ZWN0ZWQgX25leHQodW51c2VkOiBUKTogdm9pZCB7XG4gICAgLy8gRG8gbm90aGluZ1xuICB9XG59XG4iXX0=