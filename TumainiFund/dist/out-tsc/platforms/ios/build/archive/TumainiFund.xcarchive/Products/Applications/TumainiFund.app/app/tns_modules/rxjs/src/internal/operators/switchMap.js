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
var InnerSubscriber_1 = require("../InnerSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
var map_1 = require("./map");
var from_1 = require("../observable/from");
/* tslint:enable:max-line-length */
/**
 * Projects each source value to an Observable which is merged in the output
 * Observable, emitting values only from the most recently projected Observable.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables.</span>
 *
 * ![](switchMap.png)
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. Each time it observes one of these
 * inner Observables, the output Observable begins emitting the items emitted by
 * that inner Observable. When a new inner Observable is emitted, `switchMap`
 * stops emitting items from the earlier-emitted inner Observable and begins
 * emitting items from the new one. It continues to behave like this for
 * subsequent inner Observables.
 *
 * ## Example
 * Rerun an interval Observable on every click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(switchMap((ev) => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link concatMap}
 * @see {@link exhaustMap}
 * @see {@link mergeMap}
 * @see {@link switchAll}
 * @see {@link switchMapTo}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @return {Observable} An Observable that emits the result of applying the
 * projection function (and the optional deprecated `resultSelector`) to each item
 * emitted by the source Observable and taking only the values from the most recently
 * projected inner Observable.
 * @method switchMap
 * @owner Observable
 */
function switchMap(project, resultSelector) {
    if (typeof resultSelector === 'function') {
        return function (source) { return source.pipe(switchMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
    }
    return function (source) { return source.lift(new SwitchMapOperator(project)); };
}
exports.switchMap = switchMap;
var SwitchMapOperator = /** @class */ (function () {
    function SwitchMapOperator(project) {
        this.project = project;
    }
    SwitchMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SwitchMapSubscriber(subscriber, this.project));
    };
    return SwitchMapOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SwitchMapSubscriber = /** @class */ (function (_super) {
    __extends(SwitchMapSubscriber, _super);
    function SwitchMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.index = 0;
        return _this;
    }
    SwitchMapSubscriber.prototype._next = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (error) {
            this.destination.error(error);
            return;
        }
        this._innerSub(result, value, index);
    };
    SwitchMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscription = this.innerSubscription;
        if (innerSubscription) {
            innerSubscription.unsubscribe();
        }
        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
        var destination = this.destination;
        destination.add(innerSubscriber);
        this.innerSubscription = subscribeToResult_1.subscribeToResult(this, result, value, index, innerSubscriber);
    };
    SwitchMapSubscriber.prototype._complete = function () {
        var innerSubscription = this.innerSubscription;
        if (!innerSubscription || innerSubscription.closed) {
            _super.prototype._complete.call(this);
        }
        this.unsubscribe();
    };
    SwitchMapSubscriber.prototype._unsubscribe = function () {
        this.innerSubscription = null;
    };
    SwitchMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var destination = this.destination;
        destination.remove(innerSub);
        this.innerSubscription = null;
        if (this.isStopped) {
            _super.prototype._complete.call(this);
        }
    };
    SwitchMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    return SwitchMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoTWFwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc3dpdGNoTWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUlBLHNEQUFxRDtBQUNyRCxzREFBcUQ7QUFDckQsK0RBQThEO0FBRTlELDZCQUE0QjtBQUM1QiwyQ0FBMEM7QUFRMUMsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlDRztBQUNILFNBQWdCLFNBQVMsQ0FDdkIsT0FBd0QsRUFDeEQsY0FBNEY7SUFFNUYsSUFBSSxPQUFPLGNBQWMsS0FBSyxVQUFVLEVBQUU7UUFDeEMsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUMzQyxTQUFTLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzFDLFNBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxFQUFFLElBQUssT0FBQSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FDNUMsRUFGbUIsQ0FFbkIsQ0FBQyxDQUNILEVBSmlDLENBSWpDLENBQUM7S0FDSDtJQUNELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQTND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cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuaW1wb3J0IHsgZnJvbSB9IGZyb20gJy4uL29ic2VydmFibGUvZnJvbSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGlubmVyIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoTWFwPFQsIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LCByZXN1bHRTZWxlY3RvcjogdW5kZWZpbmVkKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgaW5uZXIgbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hNYXA8VCwgSSwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8ST4sIHJlc3VsdFNlbGVjdG9yOiAob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogSSwgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIpID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBQcm9qZWN0cyBlYWNoIHNvdXJjZSB2YWx1ZSB0byBhbiBPYnNlcnZhYmxlIHdoaWNoIGlzIG1lcmdlZCBpbiB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLCBlbWl0dGluZyB2YWx1ZXMgb25seSBmcm9tIHRoZSBtb3N0IHJlY2VudGx5IHByb2plY3RlZCBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5NYXBzIGVhY2ggdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSwgdGhlbiBmbGF0dGVucyBhbGwgb2ZcbiAqIHRoZXNlIGlubmVyIE9ic2VydmFibGVzLjwvc3Bhbj5cbiAqXG4gKiAhW10oc3dpdGNoTWFwLnBuZylcbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBpdGVtcyBiYXNlZCBvbiBhcHBseWluZyBhIGZ1bmN0aW9uIHRoYXQgeW91XG4gKiBzdXBwbHkgdG8gZWFjaCBpdGVtIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB3aGVyZSB0aGF0IGZ1bmN0aW9uXG4gKiByZXR1cm5zIGFuIChzby1jYWxsZWQgXCJpbm5lclwiKSBPYnNlcnZhYmxlLiBFYWNoIHRpbWUgaXQgb2JzZXJ2ZXMgb25lIG9mIHRoZXNlXG4gKiBpbm5lciBPYnNlcnZhYmxlcywgdGhlIG91dHB1dCBPYnNlcnZhYmxlIGJlZ2lucyBlbWl0dGluZyB0aGUgaXRlbXMgZW1pdHRlZCBieVxuICogdGhhdCBpbm5lciBPYnNlcnZhYmxlLiBXaGVuIGEgbmV3IGlubmVyIE9ic2VydmFibGUgaXMgZW1pdHRlZCwgYHN3aXRjaE1hcGBcbiAqIHN0b3BzIGVtaXR0aW5nIGl0ZW1zIGZyb20gdGhlIGVhcmxpZXItZW1pdHRlZCBpbm5lciBPYnNlcnZhYmxlIGFuZCBiZWdpbnNcbiAqIGVtaXR0aW5nIGl0ZW1zIGZyb20gdGhlIG5ldyBvbmUuIEl0IGNvbnRpbnVlcyB0byBiZWhhdmUgbGlrZSB0aGlzIGZvclxuICogc3Vic2VxdWVudCBpbm5lciBPYnNlcnZhYmxlcy5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBSZXJ1biBhbiBpbnRlcnZhbCBPYnNlcnZhYmxlIG9uIGV2ZXJ5IGNsaWNrIGV2ZW50XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoc3dpdGNoTWFwKChldikgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBleGhhdXN0TWFwfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hBbGx9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXBUb31cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCA/aW5kZXg6IG51bWJlcik6IE9ic2VydmFibGVJbnB1dH0gcHJvamVjdCBBIGZ1bmN0aW9uXG4gKiB0aGF0LCB3aGVuIGFwcGxpZWQgdG8gYW4gaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgcmV0dXJucyBhblxuICogT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZVxuICogcHJvamVjdGlvbiBmdW5jdGlvbiAoYW5kIHRoZSBvcHRpb25hbCBkZXByZWNhdGVkIGByZXN1bHRTZWxlY3RvcmApIHRvIGVhY2ggaXRlbVxuICogZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYW5kIHRha2luZyBvbmx5IHRoZSB2YWx1ZXMgZnJvbSB0aGUgbW9zdCByZWNlbnRseVxuICogcHJvamVjdGVkIGlubmVyIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIHN3aXRjaE1hcFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaE1hcDxULCBJLCBSPihcbiAgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8ST4sXG4gIHJlc3VsdFNlbGVjdG9yPzogKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSLFxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBJfFI+IHtcbiAgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UucGlwZShcbiAgICAgIHN3aXRjaE1hcCgoYSwgaSkgPT4gZnJvbShwcm9qZWN0KGEsIGkpKS5waXBlKFxuICAgICAgICBtYXAoKGIsIGlpKSA9PiByZXN1bHRTZWxlY3RvcihhLCBiLCBpLCBpaSkpXG4gICAgICApKVxuICAgICk7XG4gIH1cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBTd2l0Y2hNYXBPcGVyYXRvcihwcm9qZWN0KSk7XG59XG5cbmNsYXNzIFN3aXRjaE1hcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU3dpdGNoTWFwU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLnByb2plY3QpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgU3dpdGNoTWFwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG4gIHByaXZhdGUgaW5uZXJTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCkge1xuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxSPjtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcm9qZWN0KHZhbHVlLCBpbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyb3IpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLl9pbm5lclN1YihyZXN1bHQsIHZhbHVlLCBpbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9pbm5lclN1YihyZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxSPiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpIHtcbiAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHRoaXMuaW5uZXJTdWJzY3JpcHRpb247XG4gICAgaWYgKGlubmVyU3Vic2NyaXB0aW9uKSB7XG4gICAgICBpbm5lclN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgIHRoaXMuaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCByZXN1bHQsIHZhbHVlLCBpbmRleCwgaW5uZXJTdWJzY3JpYmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3Qge2lubmVyU3Vic2NyaXB0aW9ufSA9IHRoaXM7XG4gICAgaWYgKCFpbm5lclN1YnNjcmlwdGlvbiB8fCBpbm5lclN1YnNjcmlwdGlvbi5jbG9zZWQpIHtcbiAgICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuaW5uZXJTdWJzY3JpcHRpb24gPSBudWxsO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgZGVzdGluYXRpb24ucmVtb3ZlKGlubmVyU3ViKTtcbiAgICB0aGlzLmlubmVyU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==