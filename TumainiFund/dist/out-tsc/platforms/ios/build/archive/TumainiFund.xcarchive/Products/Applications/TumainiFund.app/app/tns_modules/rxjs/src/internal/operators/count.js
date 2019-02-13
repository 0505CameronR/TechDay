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
 * Counts the number of emissions on the source and emits that number when the
 * source completes.
 *
 * <span class="informal">Tells how many values were emitted, when the source
 * completes.</span>
 *
 * ![](count.png)
 *
 * `count` transforms an Observable that emits values into an Observable that
 * emits a single value that represents the number of values emitted by the
 * source Observable. If the source Observable terminates with an error, `count`
 * will pass this error notification along without emitting a value first. If
 * the source Observable does not terminate at all, `count` will neither emit
 * a value nor terminate. This operator takes an optional `predicate` function
 * as argument, in which case the output emission will represent the number of
 * source values that matched `true` with the `predicate`.
 *
 * ## Examples
 *
 * Counts how many seconds have passed before the first click happened
 * ```javascript
 * const seconds = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const secondsBeforeClick = seconds.pipe(takeUntil(clicks));
 * const result = secondsBeforeClick.pipe(count());
 * result.subscribe(x => console.log(x));
 * ```
 *
 * Counts how many odd numbers are there between 1 and 7
 * ```javascript
 * const numbers = range(1, 7);
 * const result = numbers.pipe(count(i => i % 2 === 1));
 * result.subscribe(x => console.log(x));
 * // Results in:
 * // 4
 * ```
 *
 * @see {@link max}
 * @see {@link min}
 * @see {@link reduce}
 *
 * @param {function(value: T, i: number, source: Observable<T>): boolean} [predicate] A
 * boolean function to select what values are to be counted. It is provided with
 * arguments of:
 * - `value`: the value from the source Observable.
 * - `index`: the (zero-based) "index" of the value from the source Observable.
 * - `source`: the source Observable instance itself.
 * @return {Observable} An Observable of one number that represents the count as
 * described above.
 * @method count
 * @owner Observable
 */
function count(predicate) {
    return function (source) { return source.lift(new CountOperator(predicate, source)); };
}
exports.count = count;
var CountOperator = /** @class */ (function () {
    function CountOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    CountOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new CountSubscriber(subscriber, this.predicate, this.source));
    };
    return CountOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var CountSubscriber = /** @class */ (function (_super) {
    __extends(CountSubscriber, _super);
    function CountSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.count = 0;
        _this.index = 0;
        return _this;
    }
    CountSubscriber.prototype._next = function (value) {
        if (this.predicate) {
            this._tryPredicate(value);
        }
        else {
            this.count++;
        }
    };
    CountSubscriber.prototype._tryPredicate = function (value) {
        var result;
        try {
            result = this.predicate(value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (result) {
            this.count++;
        }
    };
    CountSubscriber.prototype._complete = function () {
        this.destination.next(this.count);
        this.destination.complete();
    };
    return CountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9jb3VudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSw0Q0FBMkM7QUFDM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvREc7QUFFSCxTQUFnQixLQUFLLENBQUksU0FBdUU7SUFDOUYsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFqRCxDQUFpRCxDQUFDO0FBQ3RGLENBQUM7QUFGRCxzQkFFQztBQUVEO0lBQ0UsdUJBQW9CLFNBQXVFLEVBQ3ZFLE1BQXNCO1FBRHRCLGNBQVMsR0FBVCxTQUFTLENBQThEO1FBQ3ZFLFdBQU0sR0FBTixNQUFNLENBQWdCO0lBQzFDLENBQUM7SUFFRCw0QkFBSSxHQUFKLFVBQUssVUFBOEIsRUFBRSxNQUFXO1FBQzlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFpQyxtQ0FBYTtJQUk1Qyx5QkFBWSxXQUE2QixFQUNyQixTQUF1RSxFQUN2RSxNQUFzQjtRQUYxQyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUhtQixlQUFTLEdBQVQsU0FBUyxDQUE4RDtRQUN2RSxZQUFNLEdBQU4sTUFBTSxDQUFnQjtRQUxsQyxXQUFLLEdBQVcsQ0FBQyxDQUFDO1FBQ2xCLFdBQUssR0FBVyxDQUFDLENBQUM7O0lBTTFCLENBQUM7SUFFUywrQkFBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ2xCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDM0I7YUFBTTtZQUNMLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVPLHVDQUFhLEdBQXJCLFVBQXNCLEtBQVE7UUFDNUIsSUFBSSxNQUFXLENBQUM7UUFFaEIsSUFBSTtZQUNGLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzNEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM1QixPQUFPO1NBQ1I7UUFFRCxJQUFJLE1BQU0sRUFBRTtZQUNWLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO0lBQ0gsQ0FBQztJQUVTLG1DQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQXJDRCxDQUFpQyx1QkFBVSxHQXFDMUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmVyLCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuLyoqXG4gKiBDb3VudHMgdGhlIG51bWJlciBvZiBlbWlzc2lvbnMgb24gdGhlIHNvdXJjZSBhbmQgZW1pdHMgdGhhdCBudW1iZXIgd2hlbiB0aGVcbiAqIHNvdXJjZSBjb21wbGV0ZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlRlbGxzIGhvdyBtYW55IHZhbHVlcyB3ZXJlIGVtaXR0ZWQsIHdoZW4gdGhlIHNvdXJjZVxuICogY29tcGxldGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10oY291bnQucG5nKVxuICpcbiAqIGBjb3VudGAgdHJhbnNmb3JtcyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdmFsdWVzIGludG8gYW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiBlbWl0cyBhIHNpbmdsZSB2YWx1ZSB0aGF0IHJlcHJlc2VudHMgdGhlIG51bWJlciBvZiB2YWx1ZXMgZW1pdHRlZCBieSB0aGVcbiAqIHNvdXJjZSBPYnNlcnZhYmxlLiBJZiB0aGUgc291cmNlIE9ic2VydmFibGUgdGVybWluYXRlcyB3aXRoIGFuIGVycm9yLCBgY291bnRgXG4gKiB3aWxsIHBhc3MgdGhpcyBlcnJvciBub3RpZmljYXRpb24gYWxvbmcgd2l0aG91dCBlbWl0dGluZyBhIHZhbHVlIGZpcnN0LiBJZlxuICogdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGRvZXMgbm90IHRlcm1pbmF0ZSBhdCBhbGwsIGBjb3VudGAgd2lsbCBuZWl0aGVyIGVtaXRcbiAqIGEgdmFsdWUgbm9yIHRlcm1pbmF0ZS4gVGhpcyBvcGVyYXRvciB0YWtlcyBhbiBvcHRpb25hbCBgcHJlZGljYXRlYCBmdW5jdGlvblxuICogYXMgYXJndW1lbnQsIGluIHdoaWNoIGNhc2UgdGhlIG91dHB1dCBlbWlzc2lvbiB3aWxsIHJlcHJlc2VudCB0aGUgbnVtYmVyIG9mXG4gKiBzb3VyY2UgdmFsdWVzIHRoYXQgbWF0Y2hlZCBgdHJ1ZWAgd2l0aCB0aGUgYHByZWRpY2F0ZWAuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiBDb3VudHMgaG93IG1hbnkgc2Vjb25kcyBoYXZlIHBhc3NlZCBiZWZvcmUgdGhlIGZpcnN0IGNsaWNrIGhhcHBlbmVkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBzZWNvbmRzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgc2Vjb25kc0JlZm9yZUNsaWNrID0gc2Vjb25kcy5waXBlKHRha2VVbnRpbChjbGlja3MpKTtcbiAqIGNvbnN0IHJlc3VsdCA9IHNlY29uZHNCZWZvcmVDbGljay5waXBlKGNvdW50KCkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIENvdW50cyBob3cgbWFueSBvZGQgbnVtYmVycyBhcmUgdGhlcmUgYmV0d2VlbiAxIGFuZCA3XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBudW1iZXJzID0gcmFuZ2UoMSwgNyk7XG4gKiBjb25zdCByZXN1bHQgPSBudW1iZXJzLnBpcGUoY291bnQoaSA9PiBpICUgMiA9PT0gMSkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIC8vIFJlc3VsdHMgaW46XG4gKiAvLyA0XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXh9XG4gKiBAc2VlIHtAbGluayBtaW59XG4gKiBAc2VlIHtAbGluayByZWR1Y2V9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgaTogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBib29sZWFufSBbcHJlZGljYXRlXSBBXG4gKiBib29sZWFuIGZ1bmN0aW9uIHRvIHNlbGVjdCB3aGF0IHZhbHVlcyBhcmUgdG8gYmUgY291bnRlZC4gSXQgaXMgcHJvdmlkZWQgd2l0aFxuICogYXJndW1lbnRzIG9mOlxuICogLSBgdmFsdWVgOiB0aGUgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiAtIGBpbmRleGA6IHRoZSAoemVyby1iYXNlZCkgXCJpbmRleFwiIG9mIHRoZSB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIC0gYHNvdXJjZWA6IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBpbnN0YW5jZSBpdHNlbGYuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIG9uZSBudW1iZXIgdGhhdCByZXByZXNlbnRzIHRoZSBjb3VudCBhc1xuICogZGVzY3JpYmVkIGFib3ZlLlxuICogQG1ldGhvZCBjb3VudFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gY291bnQ8VD4ocHJlZGljYXRlPzogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIG51bWJlcj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IENvdW50T3BlcmF0b3IocHJlZGljYXRlLCBzb3VyY2UpKTtcbn1cblxuY2xhc3MgQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIG51bWJlcj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByZWRpY2F0ZT86ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZT86IE9ic2VydmFibGU8VD4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxudW1iZXI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IENvdW50U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnByZWRpY2F0ZSwgdGhpcy5zb3VyY2UpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgY291bnQ6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPG51bWJlcj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJlZGljYXRlPzogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnByZWRpY2F0ZSkge1xuICAgICAgdGhpcy5fdHJ5UHJlZGljYXRlKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3RyeVByZWRpY2F0ZSh2YWx1ZTogVCkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcblxuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByZWRpY2F0ZSh2YWx1ZSwgdGhpcy5pbmRleCsrLCB0aGlzLnNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdCkge1xuICAgICAgdGhpcy5jb3VudCsrO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHRoaXMuY291bnQpO1xuICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19