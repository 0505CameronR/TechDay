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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmYXVsdElmRW1wdHkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVmYXVsdElmRW1wdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBTTNDLG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQ0c7QUFDSCxTQUFnQixjQUFjLENBQU8sWUFBc0I7SUFBdEIsNkJBQUEsRUFBQSxtQkFBc0I7SUFDekQsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLENBQUMsWUFBWSxDQUFDLENBQXNCLEVBQTFFLENBQTBFLENBQUM7QUFDL0csQ0FBQztBQUZELHdDQUVDO0FBRUQ7SUFFRSxnQ0FBb0IsWUFBZTtRQUFmLGlCQUFZLEdBQVosWUFBWSxDQUFHO0lBQ25DLENBQUM7SUFFRCxxQ0FBSSxHQUFKLFVBQUssVUFBNkIsRUFBRSxNQUFXO1FBQzdDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUE2Qyw0Q0FBYTtJQUd4RCxrQ0FBWSxXQUE4QixFQUFVLFlBQWU7UUFBbkUsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFGbUQsa0JBQVksR0FBWixZQUFZLENBQUc7UUFGM0QsYUFBTyxHQUFZLElBQUksQ0FBQzs7SUFJaEMsQ0FBQztJQUVTLHdDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLEtBQUssQ0FBQztRQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDO0lBRVMsNENBQVMsR0FBbkI7UUFDRSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzFDO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBbEJELENBQTZDLHVCQUFVLEdBa0J0RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT3BlcmF0b3JGdW5jdGlvbiwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZhdWx0SWZFbXB0eTxUPihkZWZhdWx0VmFsdWU/OiBUKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRJZkVtcHR5PFQsIFI+KGRlZmF1bHRWYWx1ZT86IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogRW1pdHMgYSBnaXZlbiB2YWx1ZSBpZiB0aGUgc291cmNlIE9ic2VydmFibGUgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgYW55XG4gKiBgbmV4dGAgdmFsdWUsIG90aGVyd2lzZSBtaXJyb3JzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SWYgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHR1cm5zIG91dCB0byBiZSBlbXB0eSwgdGhlblxuICogdGhpcyBvcGVyYXRvciB3aWxsIGVtaXQgYSBkZWZhdWx0IHZhbHVlLjwvc3Bhbj5cbiAqXG4gKiAhW10oZGVmYXVsdElmRW1wdHkucG5nKVxuICpcbiAqIGBkZWZhdWx0SWZFbXB0eWAgZW1pdHMgdGhlIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBvciBhXG4gKiBzcGVjaWZpZWQgZGVmYXVsdCB2YWx1ZSBpZiB0aGUgc291cmNlIE9ic2VydmFibGUgaXMgZW1wdHkgKGNvbXBsZXRlcyB3aXRob3V0XG4gKiBoYXZpbmcgZW1pdHRlZCBhbnkgYG5leHRgIHZhbHVlKS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBJZiBubyBjbGlja3MgaGFwcGVuIGluIDUgc2Vjb25kcywgdGhlbiBlbWl0IFwibm8gY2xpY2tzXCJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBjbGlja3NCZWZvcmVGaXZlID0gY2xpY2tzLnBpcGUodGFrZVVudGlsKGludGVydmFsKDUwMDApKSk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3NCZWZvcmVGaXZlLnBpcGUoZGVmYXVsdElmRW1wdHkoJ25vIGNsaWNrcycpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBlbXB0eX1cbiAqIEBzZWUge0BsaW5rIGxhc3R9XG4gKlxuICogQHBhcmFtIHthbnl9IFtkZWZhdWx0VmFsdWU9bnVsbF0gVGhlIGRlZmF1bHQgdmFsdWUgdXNlZCBpZiB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGlzIGVtcHR5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGVpdGhlciB0aGUgc3BlY2lmaWVkXG4gKiBgZGVmYXVsdFZhbHVlYCBpZiB0aGUgc291cmNlIE9ic2VydmFibGUgZW1pdHMgbm8gaXRlbXMsIG9yIHRoZSB2YWx1ZXMgZW1pdHRlZFxuICogYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBkZWZhdWx0SWZFbXB0eVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmF1bHRJZkVtcHR5PFQsIFI+KGRlZmF1bHRWYWx1ZTogUiA9IG51bGwpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGVmYXVsdElmRW1wdHlPcGVyYXRvcihkZWZhdWx0VmFsdWUpKSBhcyBPYnNlcnZhYmxlPFQgfCBSPjtcbn1cblxuY2xhc3MgRGVmYXVsdElmRW1wdHlPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQgfCBSPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkZWZhdWx0VmFsdWU6IFIpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUIHwgUj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGVmYXVsdElmRW1wdHlTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZGVmYXVsdFZhbHVlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIERlZmF1bHRJZkVtcHR5U3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGlzRW1wdHk6IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQgfCBSPiwgcHJpdmF0ZSBkZWZhdWx0VmFsdWU6IFIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLmlzRW1wdHkgPSBmYWxzZTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0VtcHR5KSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5kZWZhdWx0VmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==