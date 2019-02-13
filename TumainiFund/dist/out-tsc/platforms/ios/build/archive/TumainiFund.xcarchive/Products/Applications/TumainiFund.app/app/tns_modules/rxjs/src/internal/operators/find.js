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
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * ![](find.png)
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * ## Example
 * Find and emit the first click that happens on a DIV element
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(find(ev => ev.target.tagName === 'DIV'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
}
exports.find = find;
var FindValueOperator = /** @class */ (function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    FindValueOperator.prototype.call = function (observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    };
    return FindValueOperator;
}());
exports.FindValueOperator = FindValueOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FindValueSubscriber = /** @class */ (function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.yieldIndex = yieldIndex;
        _this.thisArg = thisArg;
        _this.index = 0;
        return _this;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
        this.unsubscribe();
    };
    FindValueSubscriber.prototype._next = function (value) {
        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
        var index = this.index++;
        try {
            var result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    FindValueSubscriber.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
}(Subscriber_1.Subscriber));
exports.FindValueSubscriber = FindValueSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2ZpbmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQXlDO0FBT3pDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1DRztBQUNILFNBQWdCLElBQUksQ0FBSSxTQUFzRSxFQUN0RSxPQUFhO0lBQ25DLElBQUksT0FBTyxTQUFTLEtBQUssVUFBVSxFQUFFO1FBQ25DLE1BQU0sSUFBSSxTQUFTLENBQUMsNkJBQTZCLENBQUMsQ0FBQztLQUNwRDtJQUNELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFNBQVMsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUE4QixFQUFsRyxDQUFrRyxDQUFDO0FBQ3ZJLENBQUM7QUFORCxvQkFNQztBQUVEO0lBQ0UsMkJBQW9CLFNBQXNFLEVBQ3RFLE1BQXFCLEVBQ3JCLFVBQW1CLEVBQ25CLE9BQWE7UUFIYixjQUFTLEdBQVQsU0FBUyxDQUE2RDtRQUN0RSxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ3JCLGVBQVUsR0FBVixVQUFVLENBQVM7UUFDbkIsWUFBTyxHQUFQLE9BQU8sQ0FBTTtJQUNqQyxDQUFDO0lBRUQsZ0NBQUksR0FBSixVQUFLLFFBQXVCLEVBQUUsTUFBVztRQUN2QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDekgsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQVZELElBVUM7QUFWWSw4Q0FBaUI7QUFZOUI7Ozs7R0FJRztBQUNIO0lBQTRDLHVDQUFhO0lBR3ZELDZCQUFZLFdBQTBCLEVBQ2xCLFNBQXNFLEVBQ3RFLE1BQXFCLEVBQ3JCLFVBQW1CLEVBQ25CLE9BQWE7UUFKakMsWUFLRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFMbUIsZUFBUyxHQUFULFNBQVMsQ0FBNkQ7UUFDdEUsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixnQkFBVSxHQUFWLFVBQVUsQ0FBUztRQUNuQixhQUFPLEdBQVAsT0FBTyxDQUFNO1FBTnpCLFdBQUssR0FBVyxDQUFDLENBQUM7O0lBUTFCLENBQUM7SUFFTyw0Q0FBYyxHQUF0QixVQUF1QixLQUFVO1FBQy9CLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFFckMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN4QixXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFUyxtQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDaEIsSUFBQSxTQUEyQixFQUExQix3QkFBUyxFQUFFLG9CQUFlLENBQUM7UUFDbEMsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzNCLElBQUk7WUFDRixJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUUsSUFBSSxNQUFNLEVBQUU7Z0JBQ1YsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3REO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVTLHVDQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUNILDBCQUFDO0FBQUQsQ0FBQyxBQW5DRCxDQUE0Qyx1QkFBVSxHQW1DckQ7QUFuQ1ksa0RBQW1CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPYnNlcnZhYmxlfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7T3BlcmF0b3J9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7U3Vic2NyaWJlcn0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQge09wZXJhdG9yRnVuY3Rpb259IGZyb20gJy4uL3R5cGVzJztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VCwgUyBleHRlbmRzIFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHZhbHVlIGlzIFMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUyB8IHVuZGVmaW5lZD47XG5leHBvcnQgZnVuY3Rpb24gZmluZDxUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IHVuZGVmaW5lZD47XG4vKipcbiAqIEVtaXRzIG9ubHkgdGhlIGZpcnN0IHZhbHVlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgbWVldHMgc29tZVxuICogY29uZGl0aW9uLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5GaW5kcyB0aGUgZmlyc3QgdmFsdWUgdGhhdCBwYXNzZXMgc29tZSB0ZXN0IGFuZCBlbWl0c1xuICogdGhhdC48L3NwYW4+XG4gKlxuICogIVtdKGZpbmQucG5nKVxuICpcbiAqIGBmaW5kYCBzZWFyY2hlcyBmb3IgdGhlIGZpcnN0IGl0ZW0gaW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgbWF0Y2hlcyB0aGVcbiAqIHNwZWNpZmllZCBjb25kaXRpb24gZW1ib2RpZWQgYnkgdGhlIGBwcmVkaWNhdGVgLCBhbmQgcmV0dXJucyB0aGUgZmlyc3RcbiAqIG9jY3VycmVuY2UgaW4gdGhlIHNvdXJjZS4gVW5saWtlIHtAbGluayBmaXJzdH0sIHRoZSBgcHJlZGljYXRlYCBpcyByZXF1aXJlZFxuICogaW4gYGZpbmRgLCBhbmQgZG9lcyBub3QgZW1pdCBhbiBlcnJvciBpZiBhIHZhbGlkIHZhbHVlIGlzIG5vdCBmb3VuZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBGaW5kIGFuZCBlbWl0IHRoZSBmaXJzdCBjbGljayB0aGF0IGhhcHBlbnMgb24gYSBESVYgZWxlbWVudFxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGNsaWNrcy5waXBlKGZpbmQoZXYgPT4gZXYudGFyZ2V0LnRhZ05hbWUgPT09ICdESVYnKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZmlsdGVyfVxuICogQHNlZSB7QGxpbmsgZmlyc3R9XG4gKiBAc2VlIHtAbGluayBmaW5kSW5kZXh9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IGJvb2xlYW59IHByZWRpY2F0ZVxuICogQSBmdW5jdGlvbiBjYWxsZWQgd2l0aCBlYWNoIGl0ZW0gdG8gdGVzdCBmb3IgY29uZGl0aW9uIG1hdGNoaW5nLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBBbiBvcHRpb25hbCBhcmd1bWVudCB0byBkZXRlcm1pbmUgdGhlIHZhbHVlIG9mIGB0aGlzYFxuICogaW4gdGhlIGBwcmVkaWNhdGVgIGZ1bmN0aW9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSBvZiB0aGUgZmlyc3QgaXRlbSB0aGF0IG1hdGNoZXMgdGhlXG4gKiBjb25kaXRpb24uXG4gKiBAbWV0aG9kIGZpbmRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBUIHwgdW5kZWZpbmVkPiB7XG4gIGlmICh0eXBlb2YgcHJlZGljYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcigncHJlZGljYXRlIGlzIG5vdCBhIGZ1bmN0aW9uJyk7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBGaW5kVmFsdWVPcGVyYXRvcihwcmVkaWNhdGUsIHNvdXJjZSwgZmFsc2UsIHRoaXNBcmcpKSBhcyBPYnNlcnZhYmxlPFQgfCB1bmRlZmluZWQ+O1xufVxuXG5leHBvcnQgY2xhc3MgRmluZFZhbHVlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUIHwgbnVtYmVyIHwgdW5kZWZpbmVkPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgeWllbGRJbmRleDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aGlzQXJnPzogYW55KSB7XG4gIH1cblxuICBjYWxsKG9ic2VydmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEZpbmRWYWx1ZVN1YnNjcmliZXIob2JzZXJ2ZXIsIHRoaXMucHJlZGljYXRlLCB0aGlzLnNvdXJjZSwgdGhpcy55aWVsZEluZGV4LCB0aGlzLnRoaXNBcmcpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEZpbmRWYWx1ZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB5aWVsZEluZGV4OiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRoaXNBcmc/OiBhbnkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcml2YXRlIG5vdGlmeUNvbXBsZXRlKHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHtwcmVkaWNhdGUsIHRoaXNBcmd9ID0gdGhpcztcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gcHJlZGljYXRlLmNhbGwodGhpc0FyZyB8fCB0aGlzLCB2YWx1ZSwgaW5kZXgsIHRoaXMuc291cmNlKTtcbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5ub3RpZnlDb21wbGV0ZSh0aGlzLnlpZWxkSW5kZXggPyBpbmRleCA6IHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMubm90aWZ5Q29tcGxldGUodGhpcy55aWVsZEluZGV4ID8gLTEgOiB1bmRlZmluZWQpO1xuICB9XG59XG4iXX0=