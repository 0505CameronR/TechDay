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
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * ![](scan.png)
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * ## Example
 * Count the number of click events
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const ones = clicks.pipe(mapTo(1));
 * const seed = 0;
 * const count = ones.pipe(scan((acc, one) => acc + one, seed));
 * count.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: R, value: T, index: number): R} accumulator
 * The accumulator function called on each source value.
 * @param {T|R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
function scan(accumulator, seed) {
    var hasSeed = false;
    // providing a seed of `undefined` *should* be valid and trigger
    // hasSeed! so don't use `seed !== undefined` checks!
    // For this reason, we have to check it here at the original call site
    // otherwise inside Operator/Subscriber we won't know if `undefined`
    // means they didn't provide anything or if they literally provided `undefined`
    if (arguments.length >= 2) {
        hasSeed = true;
    }
    return function scanOperatorFunction(source) {
        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
    };
}
exports.scan = scan;
var ScanOperator = /** @class */ (function () {
    function ScanOperator(accumulator, seed, hasSeed) {
        if (hasSeed === void 0) { hasSeed = false; }
        this.accumulator = accumulator;
        this.seed = seed;
        this.hasSeed = hasSeed;
    }
    ScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
    };
    return ScanOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ScanSubscriber = /** @class */ (function (_super) {
    __extends(ScanSubscriber, _super);
    function ScanSubscriber(destination, accumulator, _seed, hasSeed) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this._seed = _seed;
        _this.hasSeed = hasSeed;
        _this.index = 0;
        return _this;
    }
    Object.defineProperty(ScanSubscriber.prototype, "seed", {
        get: function () {
            return this._seed;
        },
        set: function (value) {
            this.hasSeed = true;
            this._seed = value;
        },
        enumerable: true,
        configurable: true
    });
    ScanSubscriber.prototype._next = function (value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    };
    ScanSubscriber.prototype._tryNext = function (value) {
        var index = this.index++;
        var result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    };
    return ScanSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zY2FuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQU8zQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDRztBQUNILFNBQWdCLElBQUksQ0FBTyxXQUFtRCxFQUFFLElBQVk7SUFDMUYsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQ3BCLGdFQUFnRTtJQUNoRSxxREFBcUQ7SUFDckQsc0VBQXNFO0lBQ3RFLG9FQUFvRTtJQUNwRSwrRUFBK0U7SUFDL0UsSUFBSSxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUN6QixPQUFPLEdBQUcsSUFBSSxDQUFDO0tBQ2hCO0lBRUQsT0FBTyxTQUFTLG9CQUFvQixDQUFDLE1BQXFCO1FBQ3hELE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLFlBQVksQ0FBQyxXQUFXLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDbkUsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWRELG9CQWNDO0FBRUQ7SUFDRSxzQkFBb0IsV0FBbUQsRUFBVSxJQUFZLEVBQVUsT0FBd0I7UUFBeEIsd0JBQUEsRUFBQSxlQUF3QjtRQUEzRyxnQkFBVyxHQUFYLFdBQVcsQ0FBd0M7UUFBVSxTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVUsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7SUFBRyxDQUFDO0lBRW5JLDJCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksY0FBYyxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7SUFDckcsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQU5ELElBTUM7QUFFRDs7OztHQUlHO0FBQ0g7SUFBbUMsa0NBQWE7SUFZOUMsd0JBQVksV0FBMEIsRUFBVSxXQUFtRCxFQUFVLEtBQVksRUFDckcsT0FBZ0I7UUFEcEMsWUFFRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFIK0MsaUJBQVcsR0FBWCxXQUFXLENBQXdDO1FBQVUsV0FBSyxHQUFMLEtBQUssQ0FBTztRQUNyRyxhQUFPLEdBQVAsT0FBTyxDQUFTO1FBWjVCLFdBQUssR0FBVyxDQUFDLENBQUM7O0lBYzFCLENBQUM7SUFaRCxzQkFBSSxnQ0FBSTthQUFSO1lBQ0UsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1FBQ3BCLENBQUM7YUFFRCxVQUFTLEtBQVk7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7WUFDcEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDckIsQ0FBQzs7O09BTEE7SUFZUyw4QkFBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxLQUFLLENBQUM7WUFDbEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFTyxpQ0FBUSxHQUFoQixVQUFpQixLQUFRO1FBQ3ZCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQixJQUFJLE1BQVcsQ0FBQztRQUNoQixJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdkQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQXJDRCxDQUFtQyx1QkFBVSxHQXFDNUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbjxUPihhY2N1bXVsYXRvcjogKGFjYzogVCwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFQsIHNlZWQ/OiBUKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHNjYW48VD4oYWNjdW11bGF0b3I6IChhY2M6IFRbXSwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFRbXSwgc2VlZD86IFRbXSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBzY2FuPFQsIFI+KGFjY3VtdWxhdG9yOiAoYWNjOiBSLCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUiwgc2VlZD86IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBBcHBsaWVzIGFuIGFjY3VtdWxhdG9yIGZ1bmN0aW9uIG92ZXIgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBhbmQgcmV0dXJucyBlYWNoXG4gKiBpbnRlcm1lZGlhdGUgcmVzdWx0LCB3aXRoIGFuIG9wdGlvbmFsIHNlZWQgdmFsdWUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgcmVkdWNlfSwgYnV0IGVtaXRzIHRoZSBjdXJyZW50XG4gKiBhY2N1bXVsYXRpb24gd2hlbmV2ZXIgdGhlIHNvdXJjZSBlbWl0cyBhIHZhbHVlLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2Nhbi5wbmcpXG4gKlxuICogQ29tYmluZXMgdG9nZXRoZXIgYWxsIHZhbHVlcyBlbWl0dGVkIG9uIHRoZSBzb3VyY2UsIHVzaW5nIGFuIGFjY3VtdWxhdG9yXG4gKiBmdW5jdGlvbiB0aGF0IGtub3dzIGhvdyB0byBqb2luIGEgbmV3IHNvdXJjZSB2YWx1ZSBpbnRvIHRoZSBhY2N1bXVsYXRpb24gZnJvbVxuICogdGhlIHBhc3QuIElzIHNpbWlsYXIgdG8ge0BsaW5rIHJlZHVjZX0sIGJ1dCBlbWl0cyB0aGUgaW50ZXJtZWRpYXRlXG4gKiBhY2N1bXVsYXRpb25zLlxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGFwcGxpZXMgYSBzcGVjaWZpZWQgYGFjY3VtdWxhdG9yYCBmdW5jdGlvbiB0byBlYWNoXG4gKiBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLiBJZiBhIGBzZWVkYCB2YWx1ZSBpcyBzcGVjaWZpZWQsIHRoZW5cbiAqIHRoYXQgdmFsdWUgd2lsbCBiZSB1c2VkIGFzIHRoZSBpbml0aWFsIHZhbHVlIGZvciB0aGUgYWNjdW11bGF0b3IuIElmIG5vIHNlZWRcbiAqIHZhbHVlIGlzIHNwZWNpZmllZCwgdGhlIGZpcnN0IGl0ZW0gb2YgdGhlIHNvdXJjZSBpcyB1c2VkIGFzIHRoZSBzZWVkLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2xpY2sgZXZlbnRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgb25lcyA9IGNsaWNrcy5waXBlKG1hcFRvKDEpKTtcbiAqIGNvbnN0IHNlZWQgPSAwO1xuICogY29uc3QgY291bnQgPSBvbmVzLnBpcGUoc2NhbigoYWNjLCBvbmUpID0+IGFjYyArIG9uZSwgc2VlZCkpO1xuICogY291bnQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZXhwYW5kfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICogQHNlZSB7QGxpbmsgcmVkdWNlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oYWNjOiBSLCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IFJ9IGFjY3VtdWxhdG9yXG4gKiBUaGUgYWNjdW11bGF0b3IgZnVuY3Rpb24gY2FsbGVkIG9uIGVhY2ggc291cmNlIHZhbHVlLlxuICogQHBhcmFtIHtUfFJ9IFtzZWVkXSBUaGUgaW5pdGlhbCBhY2N1bXVsYXRpb24gdmFsdWUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fSBBbiBvYnNlcnZhYmxlIG9mIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZXMuXG4gKiBAbWV0aG9kIHNjYW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzY2FuPFQsIFI+KGFjY3VtdWxhdG9yOiAoYWNjOiBSLCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUiwgc2VlZD86IFQgfCBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIGxldCBoYXNTZWVkID0gZmFsc2U7XG4gIC8vIHByb3ZpZGluZyBhIHNlZWQgb2YgYHVuZGVmaW5lZGAgKnNob3VsZCogYmUgdmFsaWQgYW5kIHRyaWdnZXJcbiAgLy8gaGFzU2VlZCEgc28gZG9uJ3QgdXNlIGBzZWVkICE9PSB1bmRlZmluZWRgIGNoZWNrcyFcbiAgLy8gRm9yIHRoaXMgcmVhc29uLCB3ZSBoYXZlIHRvIGNoZWNrIGl0IGhlcmUgYXQgdGhlIG9yaWdpbmFsIGNhbGwgc2l0ZVxuICAvLyBvdGhlcndpc2UgaW5zaWRlIE9wZXJhdG9yL1N1YnNjcmliZXIgd2Ugd29uJ3Qga25vdyBpZiBgdW5kZWZpbmVkYFxuICAvLyBtZWFucyB0aGV5IGRpZG4ndCBwcm92aWRlIGFueXRoaW5nIG9yIGlmIHRoZXkgbGl0ZXJhbGx5IHByb3ZpZGVkIGB1bmRlZmluZWRgXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID49IDIpIHtcbiAgICBoYXNTZWVkID0gdHJ1ZTtcbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiBzY2FuT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IFNjYW5PcGVyYXRvcihhY2N1bXVsYXRvciwgc2VlZCwgaGFzU2VlZCkpO1xuICB9O1xufVxuXG5jbGFzcyBTY2FuT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYWNjdW11bGF0b3I6IChhY2M6IFIsIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCBwcml2YXRlIHNlZWQ/OiBUIHwgUiwgcHJpdmF0ZSBoYXNTZWVkOiBib29sZWFuID0gZmFsc2UpIHt9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFNjYW5TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuYWNjdW11bGF0b3IsIHRoaXMuc2VlZCwgdGhpcy5oYXNTZWVkKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNjYW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgZ2V0IHNlZWQoKTogVCB8IFIge1xuICAgIHJldHVybiB0aGlzLl9zZWVkO1xuICB9XG5cbiAgc2V0IHNlZWQodmFsdWU6IFQgfCBSKSB7XG4gICAgdGhpcy5oYXNTZWVkID0gdHJ1ZTtcbiAgICB0aGlzLl9zZWVkID0gdmFsdWU7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPiwgcHJpdmF0ZSBhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsIHByaXZhdGUgX3NlZWQ6IFQgfCBSLFxuICAgICAgICAgICAgICBwcml2YXRlIGhhc1NlZWQ6IGJvb2xlYW4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzU2VlZCkge1xuICAgICAgdGhpcy5zZWVkID0gdmFsdWU7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5fdHJ5TmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfdHJ5TmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5hY2N1bXVsYXRvcig8Uj50aGlzLnNlZWQsIHZhbHVlLCBpbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfVxuICAgIHRoaXMuc2VlZCA9IHJlc3VsdDtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQocmVzdWx0KTtcbiAgfVxufVxuIl19