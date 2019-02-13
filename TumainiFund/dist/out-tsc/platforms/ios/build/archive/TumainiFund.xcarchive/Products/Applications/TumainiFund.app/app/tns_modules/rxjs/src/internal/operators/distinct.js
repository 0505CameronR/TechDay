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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Returns an Observable that emits all items emitted by the source Observable that are distinct by comparison from previous items.
 *
 * If a keySelector function is provided, then it will project each value from the source observable into a new value that it will
 * check for equality with previously projected values. If a keySelector function is not provided, it will use each value from the
 * source observable directly with an equality check against previous values.
 *
 * In JavaScript runtimes that support `Set`, this operator will use a `Set` to improve performance of the distinct value checking.
 *
 * In other runtimes, this operator will use a minimal implementation of `Set` that relies on an `Array` and `indexOf` under the
 * hood, so performance will degrade as more values are checked for distinction. Even in newer browsers, a long-running `distinct`
 * use might result in memory leaks. To help alleviate this in some scenarios, an optional `flushes` parameter is also provided so
 * that the internal `Set` can be "flushed", basically clearing it of values.
 *
 * ## Examples
 * A simple example with numbers
 * ```javascript
 * of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1).pipe(
 *     distinct(),
 *   )
 *   .subscribe(x => console.log(x)); // 1, 2, 3, 4
 * ```
 *
 * An example using a keySelector function
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
 *   ).pipe(
 *     distinct((p: Person) => p.name),
 *   )
 *   .subscribe(x => console.log(x));
 *
 * // displays:
 * // { age: 4, name: 'Foo' }
 * // { age: 7, name: 'Bar' }
 * ```
 * @see {@link distinctUntilChanged}
 * @see {@link distinctUntilKeyChanged}
 *
 * @param {function} [keySelector] Optional function to select which value you want to check as distinct.
 * @param {Observable} [flushes] Optional Observable for flushing the internal HashSet of the operator.
 * @return {Observable} An Observable that emits items from the source Observable with distinct values.
 * @method distinct
 * @owner Observable
 */
function distinct(keySelector, flushes) {
    return function (source) { return source.lift(new DistinctOperator(keySelector, flushes)); };
}
exports.distinct = distinct;
var DistinctOperator = /** @class */ (function () {
    function DistinctOperator(keySelector, flushes) {
        this.keySelector = keySelector;
        this.flushes = flushes;
    }
    DistinctOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new DistinctSubscriber(subscriber, this.keySelector, this.flushes));
    };
    return DistinctOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var DistinctSubscriber = /** @class */ (function (_super) {
    __extends(DistinctSubscriber, _super);
    function DistinctSubscriber(destination, keySelector, flushes) {
        var _this = _super.call(this, destination) || this;
        _this.keySelector = keySelector;
        _this.values = new Set();
        if (flushes) {
            _this.add(subscribeToResult_1.subscribeToResult(_this, flushes));
        }
        return _this;
    }
    DistinctSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values.clear();
    };
    DistinctSubscriber.prototype.notifyError = function (error, innerSub) {
        this._error(error);
    };
    DistinctSubscriber.prototype._next = function (value) {
        if (this.keySelector) {
            this._useKeySelector(value);
        }
        else {
            this._finalizeNext(value, value);
        }
    };
    DistinctSubscriber.prototype._useKeySelector = function (value) {
        var key;
        var destination = this.destination;
        try {
            key = this.keySelector(value);
        }
        catch (err) {
            destination.error(err);
            return;
        }
        this._finalizeNext(key, value);
    };
    DistinctSubscriber.prototype._finalizeNext = function (key, value) {
        var values = this.values;
        if (!values.has(key)) {
            values.add(key);
            this.destination.next(value);
        }
    };
    return DistinctSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.DistinctSubscriber = DistinctSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9kaXN0aW5jdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFHQSxzREFBcUQ7QUFFckQsK0RBQThEO0FBRzlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtREc7QUFDSCxTQUFnQixRQUFRLENBQU8sV0FBNkIsRUFDN0IsT0FBeUI7SUFDdEQsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsV0FBVyxFQUFFLE9BQU8sQ0FBQyxDQUFDLEVBQXZELENBQXVELENBQUM7QUFDNUYsQ0FBQztBQUhELDRCQUdDO0FBRUQ7SUFDRSwwQkFBb0IsV0FBNEIsRUFBVSxPQUF3QjtRQUE5RCxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFBVSxZQUFPLEdBQVAsT0FBTyxDQUFpQjtJQUNsRixDQUFDO0lBRUQsK0JBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUM5RixDQUFDO0lBQ0gsdUJBQUM7QUFBRCxDQUFDLEFBUEQsSUFPQztBQUVEOzs7O0dBSUc7QUFDSDtJQUE4QyxzQ0FBcUI7SUFHakUsNEJBQVksV0FBMEIsRUFBVSxXQUE0QixFQUFFLE9BQXdCO1FBQXRHLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBS25CO1FBTitDLGlCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQUZwRSxZQUFNLEdBQUcsSUFBSSxHQUFHLEVBQUssQ0FBQztRQUs1QixJQUFJLE9BQU8sRUFBRTtZQUNYLEtBQUksQ0FBQyxHQUFHLENBQUMscUNBQWlCLENBQUMsS0FBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDNUM7O0lBQ0gsQ0FBQztJQUVELHVDQUFVLEdBQVYsVUFBVyxVQUFhLEVBQUUsVUFBYSxFQUM1QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVELHdDQUFXLEdBQVgsVUFBWSxLQUFVLEVBQUUsUUFBK0I7UUFDckQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRVMsa0NBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO2FBQU07WUFDTCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUNsQztJQUNILENBQUM7SUFFTyw0Q0FBZSxHQUF2QixVQUF3QixLQUFRO1FBQzlCLElBQUksR0FBTSxDQUFDO1FBQ0gsSUFBQSw4QkFBVyxDQUFVO1FBQzdCLElBQUk7WUFDRixHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUMvQjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN2QixPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRU8sMENBQWEsR0FBckIsVUFBc0IsR0FBUSxFQUFFLEtBQVE7UUFDOUIsSUFBQSxvQkFBTSxDQUFVO1FBQ3hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFJLEdBQUcsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sQ0FBQyxHQUFHLENBQUksR0FBRyxDQUFDLENBQUM7WUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUgseUJBQUM7QUFBRCxDQUFDLEFBakRELENBQThDLGlDQUFlLEdBaUQ1RDtBQWpEWSxnREFBa0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhbGwgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdGhhdCBhcmUgZGlzdGluY3QgYnkgY29tcGFyaXNvbiBmcm9tIHByZXZpb3VzIGl0ZW1zLlxuICpcbiAqIElmIGEga2V5U2VsZWN0b3IgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIHRoZW4gaXQgd2lsbCBwcm9qZWN0IGVhY2ggdmFsdWUgZnJvbSB0aGUgc291cmNlIG9ic2VydmFibGUgaW50byBhIG5ldyB2YWx1ZSB0aGF0IGl0IHdpbGxcbiAqIGNoZWNrIGZvciBlcXVhbGl0eSB3aXRoIHByZXZpb3VzbHkgcHJvamVjdGVkIHZhbHVlcy4gSWYgYSBrZXlTZWxlY3RvciBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQsIGl0IHdpbGwgdXNlIGVhY2ggdmFsdWUgZnJvbSB0aGVcbiAqIHNvdXJjZSBvYnNlcnZhYmxlIGRpcmVjdGx5IHdpdGggYW4gZXF1YWxpdHkgY2hlY2sgYWdhaW5zdCBwcmV2aW91cyB2YWx1ZXMuXG4gKlxuICogSW4gSmF2YVNjcmlwdCBydW50aW1lcyB0aGF0IHN1cHBvcnQgYFNldGAsIHRoaXMgb3BlcmF0b3Igd2lsbCB1c2UgYSBgU2V0YCB0byBpbXByb3ZlIHBlcmZvcm1hbmNlIG9mIHRoZSBkaXN0aW5jdCB2YWx1ZSBjaGVja2luZy5cbiAqXG4gKiBJbiBvdGhlciBydW50aW1lcywgdGhpcyBvcGVyYXRvciB3aWxsIHVzZSBhIG1pbmltYWwgaW1wbGVtZW50YXRpb24gb2YgYFNldGAgdGhhdCByZWxpZXMgb24gYW4gYEFycmF5YCBhbmQgYGluZGV4T2ZgIHVuZGVyIHRoZVxuICogaG9vZCwgc28gcGVyZm9ybWFuY2Ugd2lsbCBkZWdyYWRlIGFzIG1vcmUgdmFsdWVzIGFyZSBjaGVja2VkIGZvciBkaXN0aW5jdGlvbi4gRXZlbiBpbiBuZXdlciBicm93c2VycywgYSBsb25nLXJ1bm5pbmcgYGRpc3RpbmN0YFxuICogdXNlIG1pZ2h0IHJlc3VsdCBpbiBtZW1vcnkgbGVha3MuIFRvIGhlbHAgYWxsZXZpYXRlIHRoaXMgaW4gc29tZSBzY2VuYXJpb3MsIGFuIG9wdGlvbmFsIGBmbHVzaGVzYCBwYXJhbWV0ZXIgaXMgYWxzbyBwcm92aWRlZCBzb1xuICogdGhhdCB0aGUgaW50ZXJuYWwgYFNldGAgY2FuIGJlIFwiZmx1c2hlZFwiLCBiYXNpY2FsbHkgY2xlYXJpbmcgaXQgb2YgdmFsdWVzLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiBBIHNpbXBsZSBleGFtcGxlIHdpdGggbnVtYmVyc1xuICogYGBgamF2YXNjcmlwdFxuICogb2YoMSwgMSwgMiwgMiwgMiwgMSwgMiwgMywgNCwgMywgMiwgMSkucGlwZShcbiAqICAgICBkaXN0aW5jdCgpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIDEsIDIsIDMsIDRcbiAqIGBgYFxuICpcbiAqIEFuIGV4YW1wbGUgdXNpbmcgYSBrZXlTZWxlY3RvciBmdW5jdGlvblxuICogYGBgdHlwZXNjcmlwdFxuICogaW50ZXJmYWNlIFBlcnNvbiB7XG4gKiAgICBhZ2U6IG51bWJlcixcbiAqICAgIG5hbWU6IHN0cmluZ1xuICogfVxuICpcbiAqIG9mPFBlcnNvbj4oXG4gKiAgICAgeyBhZ2U6IDQsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNywgbmFtZTogJ0Jhcid9LFxuICogICAgIHsgYWdlOiA1LCBuYW1lOiAnRm9vJ30sXG4gKiAgICkucGlwZShcbiAqICAgICBkaXN0aW5jdCgocDogUGVyc29uKSA9PiBwLm5hbWUpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gZGlzcGxheXM6XG4gKiAvLyB7IGFnZTogNCwgbmFtZTogJ0ZvbycgfVxuICogLy8geyBhZ2U6IDcsIG5hbWU6ICdCYXInIH1cbiAqIGBgYFxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbENoYW5nZWR9XG4gKiBAc2VlIHtAbGluayBkaXN0aW5jdFVudGlsS2V5Q2hhbmdlZH1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBba2V5U2VsZWN0b3JdIE9wdGlvbmFsIGZ1bmN0aW9uIHRvIHNlbGVjdCB3aGljaCB2YWx1ZSB5b3Ugd2FudCB0byBjaGVjayBhcyBkaXN0aW5jdC5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW2ZsdXNoZXNdIE9wdGlvbmFsIE9ic2VydmFibGUgZm9yIGZsdXNoaW5nIHRoZSBpbnRlcm5hbCBIYXNoU2V0IG9mIHRoZSBvcGVyYXRvci5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aXRoIGRpc3RpbmN0IHZhbHVlcy5cbiAqIEBtZXRob2QgZGlzdGluY3RcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdDxULCBLPihrZXlTZWxlY3Rvcj86ICh2YWx1ZTogVCkgPT4gSyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmbHVzaGVzPzogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEaXN0aW5jdE9wZXJhdG9yKGtleVNlbGVjdG9yLCBmbHVzaGVzKSk7XG59XG5cbmNsYXNzIERpc3RpbmN0T3BlcmF0b3I8VCwgSz4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgcHJpdmF0ZSBmbHVzaGVzOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGlzdGluY3RTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMua2V5U2VsZWN0b3IsIHRoaXMuZmx1c2hlcykpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgRGlzdGluY3RTdWJzY3JpYmVyPFQsIEs+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZXMgPSBuZXcgU2V0PEs+KCk7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIHByaXZhdGUga2V5U2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gSywgZmx1c2hlczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuXG4gICAgaWYgKGZsdXNoZXMpIHtcbiAgICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGZsdXNoZXMpKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzLmNsZWFyKCk7XG4gIH1cblxuICBub3RpZnlFcnJvcihlcnJvcjogYW55LCBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgdGhpcy5fZXJyb3IoZXJyb3IpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKHRoaXMua2V5U2VsZWN0b3IpIHtcbiAgICAgIHRoaXMuX3VzZUtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fZmluYWxpemVOZXh0KHZhbHVlLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdXNlS2V5U2VsZWN0b3IodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQga2V5OiBLO1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgdHJ5IHtcbiAgICAgIGtleSA9IHRoaXMua2V5U2VsZWN0b3IodmFsdWUpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5fZmluYWxpemVOZXh0KGtleSwgdmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBfZmluYWxpemVOZXh0KGtleTogS3xULCB2YWx1ZTogVCkge1xuICAgIGNvbnN0IHsgdmFsdWVzIH0gPSB0aGlzO1xuICAgIGlmICghdmFsdWVzLmhhcyg8Sz5rZXkpKSB7XG4gICAgICB2YWx1ZXMuYWRkKDxLPmtleSk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG59XG4iXX0=