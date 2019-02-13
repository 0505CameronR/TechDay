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
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from the previous item.
 *
 * If a comparator function is provided, then it will be called for each item to test for whether or not that value should be emitted.
 *
 * If a comparator function is not provided, an equality check is used by default.
 *
 * ## Example
 * A simple example with numbers
 * ```javascript
 * of(1, 1, 2, 2, 2, 1, 1, 2, 3, 3, 4).pipe(
 *     distinctUntilChanged(),
 *   )
 *   .subscribe(x => console.log(x)); // 1, 2, 1, 2, 3, 4
 * ```
 *
 * An example using a compare function
 * ```typescript
 * interface Person {
 *    age: number,
 *    name: string
 * }
 *
 * of<Person>(
 *     { age: 4, name: 'Foo'},
 *     { age: 7, name: 'Bar'},
 *     { age: 5, name: 'Foo'},
 *     { age: 6, name: 'Foo'},
 *   ).pipe(
 *     distinctUntilChanged((p: Person, q: Person) => p.name === q.name),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * // { age: 5, name: 'Foo' }
 * ```
 *
 * @see {@link distinct}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [compare] Optional comparison function called to test if an item is distinct from the previous item in the source.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinctUntilChanged
 * @owner Observable
 */
function distinctUntilChanged(compare, keySelector) {
    return function (source) { return source.lift(new DistinctUntilChangedOperator(compare, keySelector)); };
}
exports.distinctUntilChanged = distinctUntilChanged;
var DistinctUntilChangedOperator = /** @class */ (function () {
    function DistinctUntilChangedOperator(compare, keySelector) {
        this.compare = compare;
        this.keySelector = keySelector;
    }
    DistinctUntilChangedOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctUntilChangedSubscriber(subscriber, this.compare, this.keySelector));
    };
    return DistinctUntilChangedOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctUntilChangedSubscriber = /** @class */ (function (_super) {
    __extends(DistinctUntilChangedSubscriber, _super);
    function DistinctUntilChangedSubscriber(destination, compare, keySelector) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.hasKey = false;
        if (typeof compare === 'function') {
            _this.compare = compare;
        }
        return _this;
    }
    DistinctUntilChangedSubscriber.prototype.compare = function (x, y) {
        return x === y;
    };
    DistinctUntilChangedSubscriber.prototype._next = function (value) {
        var keySelector = this.keySelector;
        var key = value;
        if (keySelector) {
            key = tryCatch_1.tryCatch(this.keySelector)(value);
            if (key === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        var result = false;
        if (this.hasKey) {
            result = tryCatch_1.tryCatch(this.compare)(this.key, key);
            if (result === errorObject_1.errorObject) {
                return this.destination.error(errorObject_1.errorObject.e);
            }
        }
        else {
            this.hasKey = true;
        }
        if (Boolean(result) === false) {
            this.key = key;
            this.destination.next(value);
        }
    };
    return DistinctUntilChangedSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbENoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdFVudGlsQ2hhbmdlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFDM0MsNkNBQTRDO0FBQzVDLG1EQUFrRDtBQU9sRCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFDSCxTQUFnQixvQkFBb0IsQ0FBTyxPQUFpQyxFQUFFLFdBQXlCO0lBQ3JHLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLDRCQUE0QixDQUFPLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxFQUF6RSxDQUF5RSxDQUFDO0FBQzlHLENBQUM7QUFGRCxvREFFQztBQUVEO0lBQ0Usc0NBQW9CLE9BQWdDLEVBQ2hDLFdBQXdCO1FBRHhCLFlBQU8sR0FBUCxPQUFPLENBQXlCO1FBQ2hDLGdCQUFXLEdBQVgsV0FBVyxDQUFhO0lBQzVDLENBQUM7SUFFRCwyQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLDhCQUE4QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQzFHLENBQUM7SUFDSCxtQ0FBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQW1ELGtEQUFhO0lBSTlELHdDQUFZLFdBQTBCLEVBQzFCLE9BQWdDLEVBQ3hCLFdBQXdCO1FBRjVDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBSW5CO1FBTG1CLGlCQUFXLEdBQVgsV0FBVyxDQUFhO1FBSnBDLFlBQU0sR0FBWSxLQUFLLENBQUM7UUFNOUIsSUFBSSxPQUFPLE9BQU8sS0FBSyxVQUFVLEVBQUU7WUFDakMsS0FBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7U0FDeEI7O0lBQ0gsQ0FBQztJQUVPLGdEQUFPLEdBQWYsVUFBZ0IsQ0FBTSxFQUFFLENBQU07UUFDNUIsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFUyw4Q0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFFdEIsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFJLEdBQUcsR0FBUSxLQUFLLENBQUM7UUFFckIsSUFBSSxXQUFXLEVBQUU7WUFDZixHQUFHLEdBQUcsbUJBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEMsSUFBSSxHQUFHLEtBQUsseUJBQVcsRUFBRTtnQkFDdkIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Y7UUFFRCxJQUFJLE1BQU0sR0FBUSxLQUFLLENBQUM7UUFFeEIsSUFBSSxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ2YsTUFBTSxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDL0MsSUFBSSxNQUFNLEtBQUsseUJBQVcsRUFBRTtnQkFDMUIsT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyx5QkFBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQzlDO1NBQ0Y7YUFBTTtZQUNMLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1NBQ3BCO1FBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssS0FBSyxFQUFFO1lBQzdCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1lBQ2YsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBQ0gscUNBQUM7QUFBRCxDQUFDLEFBN0NELENBQW1ELHVCQUFVLEdBNkM1RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgdHJ5Q2F0Y2ggfSBmcm9tICcuLi91dGlsL3RyeUNhdGNoJztcbmltcG9ydCB7IGVycm9yT2JqZWN0IH0gZnJvbSAnLi4vdXRpbC9lcnJvck9iamVjdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3RpbmN0VW50aWxDaGFuZ2VkPFQ+KGNvbXBhcmU/OiAoeDogVCwgeTogVCkgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsQ2hhbmdlZDxULCBLPihjb21wYXJlOiAoeDogSywgeTogSykgPT4gYm9vbGVhbiwga2V5U2VsZWN0b3I6ICh4OiBUKSA9PiBLKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbGwgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBhcmUgZGlzdGluY3QgYnkgY29tcGFyaXNvbiBmcm9tIHRoZSBwcmV2aW91cyBpdGVtLlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBwcm92aWRlZCwgdGhlbiBpdCB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaCBpdGVtIHRvIHRlc3QgZm9yIHdoZXRoZXIgb3Igbm90IHRoYXQgdmFsdWUgc2hvdWxkIGJlIGVtaXR0ZWQuXG4gKlxuICogSWYgYSBjb21wYXJhdG9yIGZ1bmN0aW9uIGlzIG5vdCBwcm92aWRlZCwgYW4gZXF1YWxpdHkgY2hlY2sgaXMgdXNlZCBieSBkZWZhdWx0LlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEEgc2ltcGxlIGV4YW1wbGUgd2l0aCBudW1iZXJzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZigxLCAxLCAyLCAyLCAyLCAxLCAxLCAyLCAzLCAzLCA0KS5waXBlKFxuICogICAgIGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTsgLy8gMSwgMiwgMSwgMiwgMywgNFxuICogYGBgXG4gKlxuICogQW4gZXhhbXBsZSB1c2luZyBhIGNvbXBhcmUgZnVuY3Rpb25cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICAgYWdlOiBudW1iZXIsXG4gKiAgICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqXG4gKiBvZjxQZXJzb24+KFxuICogICAgIHsgYWdlOiA0LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDcsIG5hbWU6ICdCYXInfSxcbiAqICAgICB7IGFnZTogNSwgbmFtZTogJ0Zvbyd9LFxuICogICAgIHsgYWdlOiA2LCBuYW1lOiAnRm9vJ30sXG4gKiAgICkucGlwZShcbiAqICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgocDogUGVyc29uLCBxOiBQZXJzb24pID0+IHAubmFtZSA9PT0gcS5uYW1lKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBhZ2U6IDQsIG5hbWU6ICdGb28nIH1cbiAqIC8vIHsgYWdlOiA3LCBuYW1lOiAnQmFyJyB9XG4gKiAvLyB7IGFnZTogNSwgbmFtZTogJ0ZvbycgfVxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGlzdGluY3R9XG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29tcGFyZV0gT3B0aW9uYWwgY29tcGFyaXNvbiBmdW5jdGlvbiBjYWxsZWQgdG8gdGVzdCBpZiBhbiBpdGVtIGlzIGRpc3RpbmN0IGZyb20gdGhlIHByZXZpb3VzIGl0ZW0gaW4gdGhlIHNvdXJjZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIGRpc3RpbmN0IHZhbHVlcy5cbiAqIEBtZXRob2QgZGlzdGluY3RVbnRpbENoYW5nZWRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsQ2hhbmdlZDxULCBLPihjb21wYXJlPzogKHg6IEssIHk6IEspID0+IGJvb2xlYW4sIGtleVNlbGVjdG9yPzogKHg6IFQpID0+IEspOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERpc3RpbmN0VW50aWxDaGFuZ2VkT3BlcmF0b3I8VCwgSz4oY29tcGFyZSwga2V5U2VsZWN0b3IpKTtcbn1cblxuY2xhc3MgRGlzdGluY3RVbnRpbENoYW5nZWRPcGVyYXRvcjxULCBLPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wYXJlOiAoeDogSywgeTogSykgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBrZXlTZWxlY3RvcjogKHg6IFQpID0+IEspIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGlzdGluY3RVbnRpbENoYW5nZWRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY29tcGFyZSwgdGhpcy5rZXlTZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEaXN0aW5jdFVudGlsQ2hhbmdlZFN1YnNjcmliZXI8VCwgSz4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBrZXk6IEs7XG4gIHByaXZhdGUgaGFzS2V5OiBib29sZWFuID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIGNvbXBhcmU6ICh4OiBLLCB5OiBLKSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIGtleVNlbGVjdG9yOiAoeDogVCkgPT4gSykge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICBpZiAodHlwZW9mIGNvbXBhcmUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmU7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjb21wYXJlKHg6IGFueSwgeTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHggPT09IHk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcblxuICAgIGNvbnN0IGtleVNlbGVjdG9yID0gdGhpcy5rZXlTZWxlY3RvcjtcbiAgICBsZXQga2V5OiBhbnkgPSB2YWx1ZTtcblxuICAgIGlmIChrZXlTZWxlY3Rvcikge1xuICAgICAga2V5ID0gdHJ5Q2F0Y2godGhpcy5rZXlTZWxlY3RvcikodmFsdWUpO1xuICAgICAgaWYgKGtleSA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHJlc3VsdDogYW55ID0gZmFsc2U7XG5cbiAgICBpZiAodGhpcy5oYXNLZXkpIHtcbiAgICAgIHJlc3VsdCA9IHRyeUNhdGNoKHRoaXMuY29tcGFyZSkodGhpcy5rZXksIGtleSk7XG4gICAgICBpZiAocmVzdWx0ID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oYXNLZXkgPSB0cnVlO1xuICAgIH1cblxuICAgIGlmIChCb29sZWFuKHJlc3VsdCkgPT09IGZhbHNlKSB7XG4gICAgICB0aGlzLmtleSA9IGtleTtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=