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
var tryCatch_1 = require("../util/tryCatch");
var errorObject_1 = require("../util/errorObject");
var subscribeToResult_1 = require("../util/subscribeToResult");
var OuterSubscriber_1 = require("../OuterSubscriber");
var InnerSubscriber_1 = require("../InnerSubscriber");
/**
 * Applies an accumulator function over the source Observable where the
 * accumulator function itself returns an Observable, then each intermediate
 * Observable returned is merged into the output Observable.
 *
 * <span class="informal">It's like {@link scan}, but the Observables returned
 * by the accumulator are merged into the outer Observable.</span>
 *
 * ## Example
 * Count the number of click events
 * ```javascript
 * const click$ = fromEvent(document, 'click');
 * const one$ = click$.pipe(mapTo(1));
 * const seed = 0;
 * const count$ = one$.pipe(
 *   mergeScan((acc, one) => of(acc + one), seed),
 * );
 * count$.subscribe(x => console.log(x));
 *
 * // Results:
 * 1
 * 2
 * 3
 * 4
 * // ...and so on for each click
 * ```
 *
 * @param {function(acc: R, value: T): Observable<R>} accumulator
 * The accumulator function called on each source value.
 * @param seed The initial accumulation value.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of
 * input Observables being subscribed to concurrently.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method mergeScan
 * @owner Observable
 */
function mergeScan(accumulator, seed, concurrent) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    return function (source) { return source.lift(new MergeScanOperator(accumulator, seed, concurrent)); };
}
exports.mergeScan = mergeScan;
var MergeScanOperator = /** @class */ (function () {
    function MergeScanOperator(accumulator, seed, concurrent) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    MergeScanOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
    };
    return MergeScanOperator;
}());
exports.MergeScanOperator = MergeScanOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MergeScanSubscriber = /** @class */ (function (_super) {
    __extends(MergeScanSubscriber, _super);
    function MergeScanSubscriber(destination, accumulator, acc, concurrent) {
        var _this = _super.call(this, destination) || this;
        _this.accumulator = accumulator;
        _this.acc = acc;
        _this.concurrent = concurrent;
        _this.hasValue = false;
        _this.hasCompleted = false;
        _this.buffer = [];
        _this.active = 0;
        _this.index = 0;
        return _this;
    }
    MergeScanSubscriber.prototype._next = function (value) {
        if (this.active < this.concurrent) {
            var index = this.index++;
            var ish = tryCatch_1.tryCatch(this.accumulator)(this.acc, value);
            var destination = this.destination;
            if (ish === errorObject_1.errorObject) {
                destination.error(errorObject_1.errorObject.e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    MergeScanSubscriber.prototype._innerSub = function (ish, value, index) {
        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
        var destination = this.destination;
        destination.add(innerSubscriber);
        subscribeToResult_1.subscribeToResult(this, ish, value, index, innerSubscriber);
    };
    MergeScanSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
        this.unsubscribe();
    };
    MergeScanSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        var destination = this.destination;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    };
    MergeScanSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        var destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    };
    return MergeScanSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.MergeScanSubscriber = MergeScanSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VTY2FuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvbWVyZ2VTY2FuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUlBLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFDbEQsK0RBQThEO0FBQzlELHNEQUFxRDtBQUNyRCxzREFBcUQ7QUFHckQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUNHO0FBQ0gsU0FBZ0IsU0FBUyxDQUFPLFdBQXFELEVBQ3JELElBQU8sRUFDUCxVQUE2QztJQUE3QywyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7SUFDM0UsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsV0FBVyxFQUFFLElBQUksRUFBRSxVQUFVLENBQUMsQ0FBQyxFQUFqRSxDQUFpRSxDQUFDO0FBQ3RHLENBQUM7QUFKRCw4QkFJQztBQUVEO0lBQ0UsMkJBQW9CLFdBQXFELEVBQ3JELElBQU8sRUFDUCxVQUFrQjtRQUZsQixnQkFBVyxHQUFYLFdBQVcsQ0FBMEM7UUFDckQsU0FBSSxHQUFKLElBQUksQ0FBRztRQUNQLGVBQVUsR0FBVixVQUFVLENBQVE7SUFDdEMsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksbUJBQW1CLENBQzdDLFVBQVUsRUFBRSxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxJ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NENBQWMsR0FBZCxVQUFlLFFBQXNCO1FBQ25DLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQTJCLENBQUM7UUFDckQsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUM3QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDZCxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDNUI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDakQsSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLEtBQUssRUFBRTtnQkFDM0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQ2pDO1lBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUF2RUQsQ0FBK0MsaUNBQWUsR0F1RTdEO0FBdkVZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEFwcGxpZXMgYW4gYWNjdW11bGF0b3IgZnVuY3Rpb24gb3ZlciB0aGUgc291cmNlIE9ic2VydmFibGUgd2hlcmUgdGhlXG4gKiBhY2N1bXVsYXRvciBmdW5jdGlvbiBpdHNlbGYgcmV0dXJucyBhbiBPYnNlcnZhYmxlLCB0aGVuIGVhY2ggaW50ZXJtZWRpYXRlXG4gKiBPYnNlcnZhYmxlIHJldHVybmVkIGlzIG1lcmdlZCBpbnRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBzY2FufSwgYnV0IHRoZSBPYnNlcnZhYmxlcyByZXR1cm5lZFxuICogYnkgdGhlIGFjY3VtdWxhdG9yIGFyZSBtZXJnZWQgaW50byB0aGUgb3V0ZXIgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIyMgRXhhbXBsZVxuICogQ291bnQgdGhlIG51bWJlciBvZiBjbGljayBldmVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrJCA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBvbmUkID0gY2xpY2skLnBpcGUobWFwVG8oMSkpO1xuICogY29uc3Qgc2VlZCA9IDA7XG4gKiBjb25zdCBjb3VudCQgPSBvbmUkLnBpcGUoXG4gKiAgIG1lcmdlU2NhbigoYWNjLCBvbmUpID0+IG9mKGFjYyArIG9uZSksIHNlZWQpLFxuICogKTtcbiAqIGNvdW50JC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0czpcbiAqIDFcbiAqIDJcbiAqIDNcbiAqIDRcbiAqIC8vIC4uLmFuZCBzbyBvbiBmb3IgZWFjaCBjbGlja1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihhY2M6IFIsIHZhbHVlOiBUKTogT2JzZXJ2YWJsZTxSPn0gYWNjdW11bGF0b3JcbiAqIFRoZSBhY2N1bXVsYXRvciBmdW5jdGlvbiBjYWxsZWQgb24gZWFjaCBzb3VyY2UgdmFsdWUuXG4gKiBAcGFyYW0gc2VlZCBUaGUgaW5pdGlhbCBhY2N1bXVsYXRpb24gdmFsdWUuXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvbmN1cnJlbnQ9TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXSBNYXhpbXVtIG51bWJlciBvZlxuICogaW5wdXQgT2JzZXJ2YWJsZXMgYmVpbmcgc3Vic2NyaWJlZCB0byBjb25jdXJyZW50bHkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fSBBbiBvYnNlcnZhYmxlIG9mIHRoZSBhY2N1bXVsYXRlZCB2YWx1ZXMuXG4gKiBAbWV0aG9kIG1lcmdlU2NhblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG1lcmdlU2NhbjxULCBSPihhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VlZDogUixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgTWVyZ2VTY2FuT3BlcmF0b3IoYWNjdW11bGF0b3IsIHNlZWQsIGNvbmN1cnJlbnQpKTtcbn1cblxuZXhwb3J0IGNsYXNzIE1lcmdlU2Nhbk9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjY3VtdWxhdG9yOiAoYWNjOiBSLCB2YWx1ZTogVCkgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNlZWQ6IFIsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29uY3VycmVudDogbnVtYmVyKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgTWVyZ2VTY2FuU3Vic2NyaWJlcihcbiAgICAgIHN1YnNjcmliZXIsIHRoaXMuYWNjdW11bGF0b3IsIHRoaXMuc2VlZCwgdGhpcy5jb25jdXJyZW50XG4gICAgKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBNZXJnZVNjYW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBoYXNWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGJ1ZmZlcjogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBhY3RpdmU6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBpbmRleDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBhY2M6IFIsXG4gICAgICAgICAgICAgIHByaXZhdGUgY29uY3VycmVudDogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hY3RpdmUgPCB0aGlzLmNvbmN1cnJlbnQpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgICAgY29uc3QgaXNoID0gdHJ5Q2F0Y2godGhpcy5hY2N1bXVsYXRvcikodGhpcy5hY2MsIHZhbHVlKTtcbiAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcbiAgICAgIGlmIChpc2ggPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgIGRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmUrKztcbiAgICAgICAgdGhpcy5faW5uZXJTdWIoaXNoLCB2YWx1ZSwgaW5kZXgpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIF9pbm5lclN1Yihpc2g6IGFueSwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmliZVRvUmVzdWx0PFQsIFI+KHRoaXMsIGlzaCwgdmFsdWUsIGluZGV4LCBpbm5lclN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSAwICYmIHRoaXMuYnVmZmVyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgaWYgKHRoaXMuaGFzVmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dCh0aGlzLmFjYyk7XG4gICAgICB9XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICB0aGlzLmFjYyA9IGlubmVyVmFsdWU7XG4gICAgdGhpcy5oYXNWYWx1ZSA9IHRydWU7XG4gICAgZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLnJlbW92ZShpbm5lclN1Yik7XG4gICAgdGhpcy5hY3RpdmUtLTtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuX25leHQoYnVmZmVyLnNoaWZ0KCkpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5hY3RpdmUgPT09IDAgJiYgdGhpcy5oYXNDb21wbGV0ZWQpIHtcbiAgICAgIGlmICh0aGlzLmhhc1ZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5hY2MpO1xuICAgICAgfVxuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19