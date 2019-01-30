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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzdGluY3RVbnRpbENoYW5nZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGlzdGluY3RVbnRpbENoYW5nZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsNENBQTJDO0FBQzNDLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFPbEQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENHO0FBQ0gsU0FBZ0Isb0JBQW9CLENBQU8sT0FBaUMsRUFBRSxXQUF5QjtJQUNyRyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSw0QkFBNEIsQ0FBTyxPQUFPLEVBQUUsV0FBVyxDQUFDLENBQUMsRUFBekUsQ0FBeUUsQ0FBQztBQUM5RyxDQUFDO0FBRkQsb0RBRUM7QUFFRDtJQUNFLHNDQUFvQixPQUFnQyxFQUNoQyxXQUF3QjtRQUR4QixZQUFPLEdBQVAsT0FBTyxDQUF5QjtRQUNoQyxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtJQUM1QyxDQUFDO0lBRUQsMkNBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSw4QkFBOEIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUMxRyxDQUFDO0lBQ0gsbUNBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFtRCxrREFBYTtJQUk5RCx3Q0FBWSxXQUEwQixFQUMxQixPQUFnQyxFQUN4QixXQUF3QjtRQUY1QyxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxTQUluQjtRQUxtQixpQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUpwQyxZQUFNLEdBQVksS0FBSyxDQUFDO1FBTTlCLElBQUksT0FBTyxPQUFPLEtBQUssVUFBVSxFQUFFO1lBQ2pDLEtBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1NBQ3hCOztJQUNILENBQUM7SUFFTyxnREFBTyxHQUFmLFVBQWdCLENBQU0sRUFBRSxDQUFNO1FBQzVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNqQixDQUFDO0lBRVMsOENBQUssR0FBZixVQUFnQixLQUFRO1FBRXRCLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBSSxHQUFHLEdBQVEsS0FBSyxDQUFDO1FBRXJCLElBQUksV0FBVyxFQUFFO1lBQ2YsR0FBRyxHQUFHLG1CQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLElBQUksR0FBRyxLQUFLLHlCQUFXLEVBQUU7Z0JBQ3ZCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QztTQUNGO1FBRUQsSUFBSSxNQUFNLEdBQVEsS0FBSyxDQUFDO1FBRXhCLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sR0FBRyxtQkFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1lBQy9DLElBQUksTUFBTSxLQUFLLHlCQUFXLEVBQUU7Z0JBQzFCLE9BQU8sSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMseUJBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUM5QztTQUNGO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUVELElBQUksT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEtBQUssRUFBRTtZQUM3QixJQUFJLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztZQUNmLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUNILHFDQUFDO0FBQUQsQ0FBQyxBQTdDRCxDQUFtRCx1QkFBVSxHQTZDNUQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBkaXN0aW5jdFVudGlsQ2hhbmdlZDxUPihjb21wYXJlPzogKHg6IFQsIHk6IFQpID0+IGJvb2xlYW4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbENoYW5nZWQ8VCwgSz4oY29tcGFyZTogKHg6IEssIHk6IEspID0+IGJvb2xlYW4sIGtleVNlbGVjdG9yOiAoeDogVCkgPT4gSyk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHRoYXQgYXJlIGRpc3RpbmN0IGJ5IGNvbXBhcmlzb24gZnJvbSB0aGUgcHJldmlvdXMgaXRlbS5cbiAqXG4gKiBJZiBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gaXMgcHJvdmlkZWQsIHRoZW4gaXQgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2ggaXRlbSB0byB0ZXN0IGZvciB3aGV0aGVyIG9yIG5vdCB0aGF0IHZhbHVlIHNob3VsZCBiZSBlbWl0dGVkLlxuICpcbiAqIElmIGEgY29tcGFyYXRvciBmdW5jdGlvbiBpcyBub3QgcHJvdmlkZWQsIGFuIGVxdWFsaXR5IGNoZWNrIGlzIHVzZWQgYnkgZGVmYXVsdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBBIHNpbXBsZSBleGFtcGxlIHdpdGggbnVtYmVyc1xuICogYGBgamF2YXNjcmlwdFxuICogb2YoMSwgMSwgMiwgMiwgMiwgMSwgMSwgMiwgMywgMywgNCkucGlwZShcbiAqICAgICBkaXN0aW5jdFVudGlsQ2hhbmdlZCgpLFxuICogICApXG4gKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIDEsIDIsIDEsIDIsIDMsIDRcbiAqIGBgYFxuICpcbiAqIEFuIGV4YW1wbGUgdXNpbmcgYSBjb21wYXJlIGZ1bmN0aW9uXG4gKiBgYGB0eXBlc2NyaXB0XG4gKiBpbnRlcmZhY2UgUGVyc29uIHtcbiAqICAgIGFnZTogbnVtYmVyLFxuICogICAgbmFtZTogc3RyaW5nXG4gKiB9XG4gKlxuICogb2Y8UGVyc29uPihcbiAqICAgICB7IGFnZTogNCwgbmFtZTogJ0Zvbyd9LFxuICogICAgIHsgYWdlOiA3LCBuYW1lOiAnQmFyJ30sXG4gKiAgICAgeyBhZ2U6IDUsIG5hbWU6ICdGb28nfSxcbiAqICAgICB7IGFnZTogNiwgbmFtZTogJ0Zvbyd9LFxuICogICApLnBpcGUoXG4gKiAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKHA6IFBlcnNvbiwgcTogUGVyc29uKSA9PiBwLm5hbWUgPT09IHEubmFtZSksXG4gKiAgIClcbiAqICAgLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBkaXNwbGF5czpcbiAqIC8vIHsgYWdlOiA0LCBuYW1lOiAnRm9vJyB9XG4gKiAvLyB7IGFnZTogNywgbmFtZTogJ0JhcicgfVxuICogLy8geyBhZ2U6IDUsIG5hbWU6ICdGb28nIH1cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGRpc3RpbmN0fVxuICogQHNlZSB7QGxpbmsgZGlzdGluY3RVbnRpbEtleUNoYW5nZWR9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gW2NvbXBhcmVdIE9wdGlvbmFsIGNvbXBhcmlzb24gZnVuY3Rpb24gY2FsbGVkIHRvIHRlc3QgaWYgYW4gaXRlbSBpcyBkaXN0aW5jdCBmcm9tIHRoZSBwcmV2aW91cyBpdGVtIGluIHRoZSBzb3VyY2UuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCBkaXN0aW5jdCB2YWx1ZXMuXG4gKiBAbWV0aG9kIGRpc3RpbmN0VW50aWxDaGFuZ2VkXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZGlzdGluY3RVbnRpbENoYW5nZWQ8VCwgSz4oY29tcGFyZT86ICh4OiBLLCB5OiBLKSA9PiBib29sZWFuLCBrZXlTZWxlY3Rvcj86ICh4OiBUKSA9PiBLKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBEaXN0aW5jdFVudGlsQ2hhbmdlZE9wZXJhdG9yPFQsIEs+KGNvbXBhcmUsIGtleVNlbGVjdG9yKSk7XG59XG5cbmNsYXNzIERpc3RpbmN0VW50aWxDaGFuZ2VkT3BlcmF0b3I8VCwgSz4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29tcGFyZTogKHg6IEssIHk6IEspID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUga2V5U2VsZWN0b3I6ICh4OiBUKSA9PiBLKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IERpc3RpbmN0VW50aWxDaGFuZ2VkU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmNvbXBhcmUsIHRoaXMua2V5U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRGlzdGluY3RVbnRpbENoYW5nZWRTdWJzY3JpYmVyPFQsIEs+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUga2V5OiBLO1xuICBwcml2YXRlIGhhc0tleTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBjb21wYXJlOiAoeDogSywgeTogSykgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBrZXlTZWxlY3RvcjogKHg6IFQpID0+IEspIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgaWYgKHR5cGVvZiBjb21wYXJlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY29tcGFyZSh4OiBhbnksIHk6IGFueSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB4ID09PSB5O1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG5cbiAgICBjb25zdCBrZXlTZWxlY3RvciA9IHRoaXMua2V5U2VsZWN0b3I7XG4gICAgbGV0IGtleTogYW55ID0gdmFsdWU7XG5cbiAgICBpZiAoa2V5U2VsZWN0b3IpIHtcbiAgICAgIGtleSA9IHRyeUNhdGNoKHRoaXMua2V5U2VsZWN0b3IpKHZhbHVlKTtcbiAgICAgIGlmIChrZXkgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IGFueSA9IGZhbHNlO1xuXG4gICAgaWYgKHRoaXMuaGFzS2V5KSB7XG4gICAgICByZXN1bHQgPSB0cnlDYXRjaCh0aGlzLmNvbXBhcmUpKHRoaXMua2V5LCBrZXkpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaGFzS2V5ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoQm9vbGVhbihyZXN1bHQpID09PSBmYWxzZSkge1xuICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19