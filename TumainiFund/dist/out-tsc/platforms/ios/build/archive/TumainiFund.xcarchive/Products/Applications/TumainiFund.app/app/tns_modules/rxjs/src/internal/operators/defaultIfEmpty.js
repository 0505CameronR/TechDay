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
 * Emits a given value if the source Observable completes without emitting any
 * `next` value, otherwise mirrors the source Observable.
 *
 * <span class="informal">If the source Observable turns out to be empty, then
 * this operator will emit a default value.</span>
 *
 * ![](defaultIfEmpty.png)
 *
 * `defaultIfEmpty` emits the values emitted by the source Observable or a
 * specified default value if the source Observable is empty (completes without
 * having emitted any `next` value).
 *
 * ## Example
 * If no clicks happen in 5 seconds, then emit "no clicks"
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const clicksBeforeFive = clicks.pipe(takeUntil(interval(5000)));
 * const result = clicksBeforeFive.pipe(defaultIfEmpty('no clicks'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link empty}
 * @see {@link last}
 *
 * @param {any} [defaultValue=null] The default value used if the source
 * Observable is empty.
 * @return {Observable} An Observable that emits either the specified
 * `defaultValue` if the source Observable emits no items, or the values emitted
 * by the source Observable.
 * @method defaultIfEmpty
 * @owner Observable
 */
function defaultIfEmpty(defaultValue) {
    if (defaultValue === void 0) { defaultValue = null; }
    return function (source) { return source.lift(new DefaultIfEmptyOperator(defaultValue)); };
}
exports.defaultIfEmpty = defaultIfEmpty;
var DefaultIfEmptyOperator = /** @class */ (function () {
    function DefaultIfEmptyOperator(defaultValue) {
        this.defaultValue = defaultValue;
    }
    DefaultIfEmptyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DefaultIfEmptySubscriber(subscriber, this.defaultValue));
    };
    return DefaultIfEmptyOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DefaultIfEmptySubscriber = /** @class */ (function (_super) {
    __extends(DefaultIfEmptySubscriber, _super);
    function DefaultIfEmptySubscriber(destination, defaultValue) {
        var _this = _super.call(this, destination) || this;
        _this.defaultValue = defaultValue;
        _this.isEmpty = true;
        return _this;
    }
    DefaultIfEmptySubscriber.prototype._next = function (value) {
        this.isEmpty = false;
        this.destination.next(value);
    };
    DefaultIfEmptySubscriber.prototype._complete = function () {
        if (this.isEmpty) {
            this.destination.next(this.defaultValue);
        }
        this.destination.complete();
    };
    return DefaultIfEmptySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdElmRW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kZWZhdWx0SWZFbXB0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFFQSw0Q0FBMkM7QUFNM0MsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDRztBQUNILFNBQWdCLGNBQWMsQ0FBTyxZQUFzQjtJQUF0Qiw2QkFBQSxFQUFBLG1CQUFzQjtJQUN6RCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxZQUFZLENBQUMsQ0FBc0IsRUFBMUUsQ0FBMEUsQ0FBQztBQUMvRyxDQUFDO0FBRkQsd0NBRUM7QUFFRDtJQUVFLGdDQUFvQixZQUFlO1FBQWYsaUJBQVksR0FBWixZQUFZLENBQUc7SUFDbkMsQ0FBQztJQUVELHFDQUFJLEdBQUosVUFBSyxVQUE2QixFQUFFLE1BQVc7UUFDN0MsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksd0JBQXdCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3ZGLENBQUM7SUFDSCw2QkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQTZDLDRDQUFhO0lBR3hELGtDQUFZLFdBQThCLEVBQVUsWUFBZTtRQUFuRSxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUZtRCxrQkFBWSxHQUFaLFlBQVksQ0FBRztRQUYzRCxhQUFPLEdBQVksSUFBSSxDQUFDOztJQUloQyxDQUFDO0lBRVMsd0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFUyw0Q0FBUyxHQUFuQjtRQUNFLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7U0FDMUM7UUFDRCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDSCwrQkFBQztBQUFELENBQUMsQUFsQkQsQ0FBNkMsdUJBQVUsR0FrQnREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRJZkVtcHR5PFQ+KGRlZmF1bHRWYWx1ZT86IFQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdElmRW1wdHk8VCwgUj4oZGVmYXVsdFZhbHVlPzogUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBFbWl0cyBhIGdpdmVuIHZhbHVlIGlmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhbnlcbiAqIGBuZXh0YCB2YWx1ZSwgb3RoZXJ3aXNlIG1pcnJvcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JZiB0aGUgc291cmNlIE9ic2VydmFibGUgdHVybnMgb3V0IHRvIGJlIGVtcHR5LCB0aGVuXG4gKiB0aGlzIG9wZXJhdG9yIHdpbGwgZW1pdCBhIGRlZmF1bHQgdmFsdWUuPC9zcGFuPlxuICpcbiAqICFbXShkZWZhdWx0SWZFbXB0eS5wbmcpXG4gKlxuICogYGRlZmF1bHRJZkVtcHR5YCBlbWl0cyB0aGUgdmFsdWVzIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG9yIGFcbiAqIHNwZWNpZmllZCBkZWZhdWx0IHZhbHVlIGlmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBpcyBlbXB0eSAoY29tcGxldGVzIHdpdGhvdXRcbiAqIGhhdmluZyBlbWl0dGVkIGFueSBgbmV4dGAgdmFsdWUpLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIElmIG5vIGNsaWNrcyBoYXBwZW4gaW4gNSBzZWNvbmRzLCB0aGVuIGVtaXQgXCJubyBjbGlja3NcIlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGNsaWNrc0JlZm9yZUZpdmUgPSBjbGlja3MucGlwZSh0YWtlVW50aWwoaW50ZXJ2YWwoNTAwMCkpKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrc0JlZm9yZUZpdmUucGlwZShkZWZhdWx0SWZFbXB0eSgnbm8gY2xpY2tzJykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGVtcHR5fVxuICogQHNlZSB7QGxpbmsgbGFzdH1cbiAqXG4gKiBAcGFyYW0ge2FueX0gW2RlZmF1bHRWYWx1ZT1udWxsXSBUaGUgZGVmYXVsdCB2YWx1ZSB1c2VkIGlmIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgaXMgZW1wdHkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgZWl0aGVyIHRoZSBzcGVjaWZpZWRcbiAqIGBkZWZhdWx0VmFsdWVgIGlmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBubyBpdGVtcywgb3IgdGhlIHZhbHVlcyBlbWl0dGVkXG4gKiBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIGRlZmF1bHRJZkVtcHR5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdElmRW1wdHk8VCwgUj4oZGVmYXVsdFZhbHVlOiBSID0gbnVsbCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IFI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEZWZhdWx0SWZFbXB0eU9wZXJhdG9yKGRlZmF1bHRWYWx1ZSkpIGFzIE9ic2VydmFibGU8VCB8IFI+O1xufVxuXG5jbGFzcyBEZWZhdWx0SWZFbXB0eU9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVCB8IFI+IHtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRlZmF1bHRWYWx1ZTogUikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQgfCBSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBEZWZhdWx0SWZFbXB0eVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kZWZhdWx0VmFsdWUpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRGVmYXVsdElmRW1wdHlTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgaXNFbXB0eTogYm9vbGVhbiA9IHRydWU7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VCB8IFI+LCBwcml2YXRlIGRlZmF1bHRWYWx1ZTogUikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuaXNFbXB0eSA9IGZhbHNlO1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzRW1wdHkpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLmRlZmF1bHRWYWx1ZSk7XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19