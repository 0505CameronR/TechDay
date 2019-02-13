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
/* tslint:enable:max-line-length */
/**
 * Filter items emitted by the source Observable by only emitting those that
 * satisfy a specified predicate.
 *
 * <span class="informal">Like
 * [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter),
 * it only emits a value from the source if it passes a criterion function.</span>
 *
 * ![](filter.png)
 *
 * Similar to the well-known `Array.prototype.filter` method, this operator
 * takes values from the source Observable, passes them through a `predicate`
 * function and only emits those values that yielded `true`.
 *
 * ## Example
 * Emit only click events whose target was a DIV element
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const clicksOnDivs = clicks.pipe(filter(ev => ev.target.tagName === 'DIV'));
 * clicksOnDivs.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link distinct}
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 * @see {@link ignoreElements}
 * @see {@link partition}
 * @see {@link skip}
 *
 * @param {function(value: T, index: number): boolean} predicate A function that
 * evaluates each value emitted by the source Observable. If it returns `true`,
 * the value is emitted, if `false` the value is not passed to the output
 * Observable. The `index` parameter is the number `i` for the i-th source
 * emission that has happened since the subscription, starting from the number
 * `0`.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable} An Observable of values from the source that were
 * allowed by the `predicate` function.
 * @method filter
 * @owner Observable
 */
function filter(predicate, thisArg) {
    return function filterOperatorFunction(source) {
        return source.lift(new FilterOperator(predicate, thisArg));
    };
}
exports.filter = filter;
var FilterOperator = /** @class */ (function () {
    function FilterOperator(predicate, thisArg) {
        this.predicate = predicate;
        this.thisArg = thisArg;
    }
    FilterOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FilterSubscriber(subscriber, this.predicate, this.thisArg));
    };
    return FilterOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FilterSubscriber = /** @class */ (function (_super) {
    __extends(FilterSubscriber, _super);
    function FilterSubscriber(destination, predicate, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.thisArg = thisArg;
        _this.count = 0;
        return _this;
    }
    // the try catch block below is left specifically for
    // optimization and perf reasons. a tryCatcher is not necessary here.
    FilterSubscriber.prototype._next = function (value) {
        var result;
        try {
            result = this.predicate.call(this.thisArg, value, this.count++);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.destination.next(value);
        }
    };
    return FilterSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZmlsdGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDRDQUEyQztBQVMzQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsU0FBZ0IsTUFBTSxDQUFJLFNBQStDLEVBQy9DLE9BQWE7SUFDckMsT0FBTyxTQUFTLHNCQUFzQixDQUFDLE1BQXFCO1FBQzFELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM3RCxDQUFDLENBQUM7QUFDSixDQUFDO0FBTEQsd0JBS0M7QUFFRDtJQUNFLHdCQUFvQixTQUErQyxFQUMvQyxPQUFhO1FBRGIsY0FBUyxHQUFULFNBQVMsQ0FBc0M7UUFDL0MsWUFBTyxHQUFQLE9BQU8sQ0FBTTtJQUNqQyxDQUFDO0lBRUQsNkJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMxRixDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFrQyxvQ0FBYTtJQUk3QywwQkFBWSxXQUEwQixFQUNsQixTQUErQyxFQUMvQyxPQUFZO1FBRmhDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGVBQVMsR0FBVCxTQUFTLENBQXNDO1FBQy9DLGFBQU8sR0FBUCxPQUFPLENBQUs7UUFKaEMsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFNbEIsQ0FBQztJQUVELHFEQUFxRDtJQUNyRCxxRUFBcUU7SUFDM0QsZ0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksTUFBVyxDQUFDO1FBQ2hCLElBQUk7WUFDRixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDakU7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVCLE9BQU87U0FDUjtRQUNELElBQUksTUFBTSxFQUFFO1lBQ1YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBeEJELENBQWtDLHVCQUFVLEdBd0IzQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXI8VCwgUyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiB2YWx1ZSBpcyBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUz47XG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBGaWx0ZXIgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYnkgb25seSBlbWl0dGluZyB0aG9zZSB0aGF0XG4gKiBzYXRpc2Z5IGEgc3BlY2lmaWVkIHByZWRpY2F0ZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TGlrZVxuICogW0FycmF5LnByb3RvdHlwZS5maWx0ZXIoKV0oaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvQXJyYXkvZmlsdGVyKSxcbiAqIGl0IG9ubHkgZW1pdHMgYSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgaWYgaXQgcGFzc2VzIGEgY3JpdGVyaW9uIGZ1bmN0aW9uLjwvc3Bhbj5cbiAqXG4gKiAhW10oZmlsdGVyLnBuZylcbiAqXG4gKiBTaW1pbGFyIHRvIHRoZSB3ZWxsLWtub3duIGBBcnJheS5wcm90b3R5cGUuZmlsdGVyYCBtZXRob2QsIHRoaXMgb3BlcmF0b3JcbiAqIHRha2VzIHZhbHVlcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgcGFzc2VzIHRoZW0gdGhyb3VnaCBhIGBwcmVkaWNhdGVgXG4gKiBmdW5jdGlvbiBhbmQgb25seSBlbWl0cyB0aG9zZSB2YWx1ZXMgdGhhdCB5aWVsZGVkIGB0cnVlYC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBFbWl0IG9ubHkgY2xpY2sgZXZlbnRzIHdob3NlIHRhcmdldCB3YXMgYSBESVYgZWxlbWVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGNsaWNrc09uRGl2cyA9IGNsaWNrcy5waXBlKGZpbHRlcihldiA9PiBldi50YXJnZXQudGFnTmFtZSA9PT0gJ0RJVicpKTtcbiAqIGNsaWNrc09uRGl2cy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdH1cbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0VW50aWxDaGFuZ2VkfVxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbEtleUNoYW5nZWR9XG4gKiBAc2VlIHtAbGluayBpZ25vcmVFbGVtZW50c31cbiAqIEBzZWUge0BsaW5rIHBhcnRpdGlvbn1cbiAqIEBzZWUge0BsaW5rIHNraXB9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IGJvb2xlYW59IHByZWRpY2F0ZSBBIGZ1bmN0aW9uIHRoYXRcbiAqIGV2YWx1YXRlcyBlYWNoIHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJZiBpdCByZXR1cm5zIGB0cnVlYCxcbiAqIHRoZSB2YWx1ZSBpcyBlbWl0dGVkLCBpZiBgZmFsc2VgIHRoZSB2YWx1ZSBpcyBub3QgcGFzc2VkIHRvIHRoZSBvdXRwdXRcbiAqIE9ic2VydmFibGUuIFRoZSBgaW5kZXhgIHBhcmFtZXRlciBpcyB0aGUgbnVtYmVyIGBpYCBmb3IgdGhlIGktdGggc291cmNlXG4gKiBlbWlzc2lvbiB0aGF0IGhhcyBoYXBwZW5lZCBzaW5jZSB0aGUgc3Vic2NyaXB0aW9uLCBzdGFydGluZyBmcm9tIHRoZSBudW1iZXJcbiAqIGAwYC5cbiAqIEBwYXJhbSB7YW55fSBbdGhpc0FyZ10gQW4gb3B0aW9uYWwgYXJndW1lbnQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiBgdGhpc2BcbiAqIGluIHRoZSBgcHJlZGljYXRlYCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgb2YgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSB0aGF0IHdlcmVcbiAqIGFsbG93ZWQgYnkgdGhlIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLlxuICogQG1ldGhvZCBmaWx0ZXJcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaWx0ZXI8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNBcmc/OiBhbnkpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gZnVuY3Rpb24gZmlsdGVyT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IEZpbHRlck9wZXJhdG9yKHByZWRpY2F0ZSwgdGhpc0FyZykpO1xuICB9O1xufVxuXG5jbGFzcyBGaWx0ZXJPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aGlzQXJnPzogYW55KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEZpbHRlclN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcmVkaWNhdGUsIHRoaXMudGhpc0FyZykpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBGaWx0ZXJTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG5cbiAgY291bnQ6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdGhpc0FyZzogYW55KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgLy8gdGhlIHRyeSBjYXRjaCBibG9jayBiZWxvdyBpcyBsZWZ0IHNwZWNpZmljYWxseSBmb3JcbiAgLy8gb3B0aW1pemF0aW9uIGFuZCBwZXJmIHJlYXNvbnMuIGEgdHJ5Q2F0Y2hlciBpcyBub3QgbmVjZXNzYXJ5IGhlcmUuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcmVkaWNhdGUuY2FsbCh0aGlzLnRoaXNBcmcsIHZhbHVlLCB0aGlzLmNvdW50KyspO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAocmVzdWx0KSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19