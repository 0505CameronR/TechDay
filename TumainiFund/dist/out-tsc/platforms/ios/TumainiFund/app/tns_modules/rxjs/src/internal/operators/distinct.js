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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBR0Esc0RBQXFEO0FBRXJELCtEQUE4RDtBQUc5RDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbURHO0FBQ0gsU0FBZ0IsUUFBUSxDQUFPLFdBQTZCLEVBQzdCLE9BQXlCO0lBQ3RELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUF2RCxDQUF1RCxDQUFDO0FBQzVGLENBQUM7QUFIRCw0QkFHQztBQUVEO0lBQ0UsMEJBQW9CLFdBQTRCLEVBQVUsT0FBd0I7UUFBOUQsZ0JBQVcsR0FBWCxXQUFXLENBQWlCO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7SUFDbEYsQ0FBQztJQUVELCtCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBOEMsc0NBQXFCO0lBR2pFLDRCQUFZLFdBQTBCLEVBQVUsV0FBNEIsRUFBRSxPQUF3QjtRQUF0RyxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUtuQjtRQU4rQyxpQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFGcEUsWUFBTSxHQUFHLElBQUksR0FBRyxFQUFLLENBQUM7UUFLNUIsSUFBSSxPQUFPLEVBQUU7WUFDWCxLQUFJLENBQUMsR0FBRyxDQUFDLHFDQUFpQixDQUFDLEtBQUksRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO1NBQzVDOztJQUNILENBQUM7SUFFRCx1Q0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFRCx3Q0FBVyxHQUFYLFVBQVksS0FBVSxFQUFFLFFBQStCO1FBQ3JELElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDckIsQ0FBQztJQUVTLGtDQUFLLEdBQWYsVUFBZ0IsS0FBUTtRQUN0QixJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7WUFDcEIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjthQUFNO1lBQ0wsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDbEM7SUFDSCxDQUFDO0lBRU8sNENBQWUsR0FBdkIsVUFBd0IsS0FBUTtRQUM5QixJQUFJLEdBQU0sQ0FBQztRQUNILElBQUEsOEJBQVcsQ0FBVTtRQUM3QixJQUFJO1lBQ0YsR0FBRyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDL0I7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLENBQUM7SUFDakMsQ0FBQztJQUVPLDBDQUFhLEdBQXJCLFVBQXNCLEdBQVEsRUFBRSxLQUFRO1FBQzlCLElBQUEsb0JBQU0sQ0FBVTtRQUN4QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBSSxHQUFHLENBQUMsRUFBRTtZQUN2QixNQUFNLENBQUMsR0FBRyxDQUFJLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVILHlCQUFDO0FBQUQsQ0FBQyxBQWpERCxDQUE4QyxpQ0FBZSxHQWlENUQ7QUFqRFksZ0RBQWtCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgYXJlIGRpc3RpbmN0IGJ5IGNvbXBhcmlzb24gZnJvbSBwcmV2aW91cyBpdGVtcy5cbiAqXG4gKiBJZiBhIGtleVNlbGVjdG9yIGZ1bmN0aW9uIGlzIHByb3ZpZGVkLCB0aGVuIGl0IHdpbGwgcHJvamVjdCBlYWNoIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBvYnNlcnZhYmxlIGludG8gYSBuZXcgdmFsdWUgdGhhdCBpdCB3aWxsXG4gKiBjaGVjayBmb3IgZXF1YWxpdHkgd2l0aCBwcmV2aW91c2x5IHByb2plY3RlZCB2YWx1ZXMuIElmIGEga2V5U2VsZWN0b3IgZnVuY3Rpb24gaXMgbm90IHByb3ZpZGVkLCBpdCB3aWxsIHVzZSBlYWNoIHZhbHVlIGZyb20gdGhlXG4gKiBzb3VyY2Ugb2JzZXJ2YWJsZSBkaXJlY3RseSB3aXRoIGFuIGVxdWFsaXR5IGNoZWNrIGFnYWluc3QgcHJldmlvdXMgdmFsdWVzLlxuICpcbiAqIEluIEphdmFTY3JpcHQgcnVudGltZXMgdGhhdCBzdXBwb3J0IGBTZXRgLCB0aGlzIG9wZXJhdG9yIHdpbGwgdXNlIGEgYFNldGAgdG8gaW1wcm92ZSBwZXJmb3JtYW5jZSBvZiB0aGUgZGlzdGluY3QgdmFsdWUgY2hlY2tpbmcuXG4gKlxuICogSW4gb3RoZXIgcnVudGltZXMsIHRoaXMgb3BlcmF0b3Igd2lsbCB1c2UgYSBtaW5pbWFsIGltcGxlbWVudGF0aW9uIG9mIGBTZXRgIHRoYXQgcmVsaWVzIG9uIGFuIGBBcnJheWAgYW5kIGBpbmRleE9mYCB1bmRlciB0aGVcbiAqIGhvb2QsIHNvIHBlcmZvcm1hbmNlIHdpbGwgZGVncmFkZSBhcyBtb3JlIHZhbHVlcyBhcmUgY2hlY2tlZCBmb3IgZGlzdGluY3Rpb24uIEV2ZW4gaW4gbmV3ZXIgYnJvd3NlcnMsIGEgbG9uZy1ydW5uaW5nIGBkaXN0aW5jdGBcbiAqIHVzZSBtaWdodCByZXN1bHQgaW4gbWVtb3J5IGxlYWtzLiBUbyBoZWxwIGFsbGV2aWF0ZSB0aGlzIGluIHNvbWUgc2NlbmFyaW9zLCBhbiBvcHRpb25hbCBgZmx1c2hlc2AgcGFyYW1ldGVyIGlzIGFsc28gcHJvdmlkZWQgc29cbiAqIHRoYXQgdGhlIGludGVybmFsIGBTZXRgIGNhbiBiZSBcImZsdXNoZWRcIiwgYmFzaWNhbGx5IGNsZWFyaW5nIGl0IG9mIHZhbHVlcy5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogQSBzaW1wbGUgZXhhbXBsZSB3aXRoIG51bWJlcnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKDEsIDEsIDIsIDIsIDIsIDEsIDIsIDMsIDQsIDMsIDIsIDEpLnBpcGUoXG4gKiAgICAgZGlzdGluY3QoKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpOyAvLyAxLCAyLCAzLCA0XG4gKiBgYGBcbiAqXG4gKiBBbiBleGFtcGxlIHVzaW5nIGEga2V5U2VsZWN0b3IgZnVuY3Rpb25cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGludGVyZmFjZSBQZXJzb24ge1xuICogICAgYWdlOiBudW1iZXIsXG4gKiAgICBuYW1lOiBzdHJpbmdcbiAqIH1cbiAqXG4gKiBvZjxQZXJzb24+KFxuICogICAgIHsgYWdlOiA0LCBuYW1lOiAnRm9vJ30sXG4gKiAgICAgeyBhZ2U6IDcsIG5hbWU6ICdCYXInfSxcbiAqICAgICB7IGFnZTogNSwgbmFtZTogJ0Zvbyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3QoKHA6IFBlcnNvbikgPT4gcC5uYW1lKSxcbiAqICAgKVxuICogICAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIGRpc3BsYXlzOlxuICogLy8geyBhZ2U6IDQsIG5hbWU6ICdGb28nIH1cbiAqIC8vIHsgYWdlOiA3LCBuYW1lOiAnQmFyJyB9XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0VW50aWxDaGFuZ2VkfVxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbEtleUNoYW5nZWR9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2tleVNlbGVjdG9yXSBPcHRpb25hbCBmdW5jdGlvbiB0byBzZWxlY3Qgd2hpY2ggdmFsdWUgeW91IHdhbnQgdG8gY2hlY2sgYXMgZGlzdGluY3QuXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IFtmbHVzaGVzXSBPcHRpb25hbCBPYnNlcnZhYmxlIGZvciBmbHVzaGluZyB0aGUgaW50ZXJuYWwgSGFzaFNldCBvZiB0aGUgb3BlcmF0b3IuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCBkaXN0aW5jdCB2YWx1ZXMuXG4gKiBAbWV0aG9kIGRpc3RpbmN0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3Q8VCwgSz4oa2V5U2VsZWN0b3I/OiAodmFsdWU6IFQpID0+IEssXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmx1c2hlcz86IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRGlzdGluY3RPcGVyYXRvcihrZXlTZWxlY3RvciwgZmx1c2hlcykpO1xufVxuXG5jbGFzcyBEaXN0aW5jdE9wZXJhdG9yPFQsIEs+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIHByaXZhdGUgZmx1c2hlczogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERpc3RpbmN0U3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmtleVNlbGVjdG9yLCB0aGlzLmZsdXNoZXMpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIERpc3RpbmN0U3Vic2NyaWJlcjxULCBLPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgdmFsdWVzID0gbmV3IFNldDxLPigpO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LCBwcml2YXRlIGtleVNlbGVjdG9yOiAodmFsdWU6IFQpID0+IEssIGZsdXNoZXM6IE9ic2VydmFibGU8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcblxuICAgIGlmIChmbHVzaGVzKSB7XG4gICAgICB0aGlzLmFkZChzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBmbHVzaGVzKSk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBULFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlcy5jbGVhcigpO1xuICB9XG5cbiAgbm90aWZ5RXJyb3IoZXJyb3I6IGFueSwgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIHRoaXMuX2Vycm9yKGVycm9yKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmtleVNlbGVjdG9yKSB7XG4gICAgICB0aGlzLl91c2VLZXlTZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX2ZpbmFsaXplTmV4dCh2YWx1ZSwgdmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3VzZUtleVNlbGVjdG9yKHZhbHVlOiBUKTogdm9pZCB7XG4gICAgbGV0IGtleTogSztcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIHRyeSB7XG4gICAgICBrZXkgPSB0aGlzLmtleVNlbGVjdG9yKHZhbHVlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuX2ZpbmFsaXplTmV4dChrZXksIHZhbHVlKTtcbiAgfVxuXG4gIHByaXZhdGUgX2ZpbmFsaXplTmV4dChrZXk6IEt8VCwgdmFsdWU6IFQpIHtcbiAgICBjb25zdCB7IHZhbHVlcyB9ID0gdGhpcztcbiAgICBpZiAoIXZhbHVlcy5oYXMoPEs+a2V5KSkge1xuICAgICAgdmFsdWVzLmFkZCg8Sz5rZXkpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9XG4gIH1cblxufVxuIl19