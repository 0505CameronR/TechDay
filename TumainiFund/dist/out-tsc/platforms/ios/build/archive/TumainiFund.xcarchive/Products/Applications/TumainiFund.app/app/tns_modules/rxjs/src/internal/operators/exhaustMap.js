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
 * Observable only if the previous projected Observable has completed.
 *
 * <span class="informal">Maps each value to an Observable, then flattens all of
 * these inner Observables using {@link exhaust}.</span>
 *
 * ![](exhaustMap.png)
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an (so-called "inner") Observable. When it projects a source value to
 * an Observable, the output Observable begins emitting the items emitted by
 * that projected Observable. However, `exhaustMap` ignores every new projected
 * Observable if the previous projected Observable has not yet completed. Once
 * that one completes, it will accept and flatten the next projected Observable
 * and repeat this process.
 *
 * ## Example
 * Run a finite timer for each click, only if there is no currently active timer
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(
 *   exhaustMap((ev) => interval(1000).pipe(take(5))),
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link concatMap}
 * @see {@link exhaust}
 * @see {@link mergeMap}
 * @see {@link switchMap}
 *
 * @param {function(value: T, ?index: number): ObservableInput} project A function
 * that, when applied to an item emitted by the source Observable, returns an
 * Observable.
 * @return {Observable} An Observable containing projected Observables
 * of each item of the source, ignoring projected Observables that start before
 * their preceding Observable has completed.
 * @method exhaustMap
 * @owner Observable
 */
function exhaustMap(project, resultSelector) {
    if (resultSelector) {
        // DEPRECATED PATH
        return function (source) { return source.pipe(exhaustMap(function (a, i) { return from_1.from(project(a, i)).pipe(map_1.map(function (b, ii) { return resultSelector(a, b, i, ii); })); })); };
    }
    return function (source) {
        return source.lift(new ExhauseMapOperator(project));
    };
}
exports.exhaustMap = exhaustMap;
var ExhauseMapOperator = /** @class */ (function () {
    function ExhauseMapOperator(project) {
        this.project = project;
    }
    ExhauseMapOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ExhaustMapSubscriber(subscriber, this.project));
    };
    return ExhauseMapOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ExhaustMapSubscriber = /** @class */ (function (_super) {
    __extends(ExhaustMapSubscriber, _super);
    function ExhaustMapSubscriber(destination, project) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.hasSubscription = false;
        _this.hasCompleted = false;
        _this.index = 0;
        return _this;
    }
    ExhaustMapSubscriber.prototype._next = function (value) {
        if (!this.hasSubscription) {
            this.tryNext(value);
        }
    };
    ExhaustMapSubscriber.prototype.tryNext = function (value) {
        var result;
        var index = this.index++;
        try {
            result = this.project(value, index);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.hasSubscription = true;
        this._innerSub(result, value, index);
    };
    ExhaustMapSubscriber.prototype._innerSub = function (result, value, index) {
        var innerSubscriber = new InnerSubscriber_1.InnerSubscriber(this, undefined, undefined);
        var destination = this.destination;
        destination.add(innerSubscriber);
        subscribeToResult_1.subscribeToResult(this, result, value, index, innerSubscriber);
    };
    ExhaustMapSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (!this.hasSubscription) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    ExhaustMapSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.destination.next(innerValue);
    };
    ExhaustMapSubscriber.prototype.notifyError = function (err) {
        this.destination.error(err);
    };
    ExhaustMapSubscriber.prototype.notifyComplete = function (innerSub) {
        var destination = this.destination;
        destination.remove(innerSub);
        this.hasSubscription = false;
        if (this.hasCompleted) {
            this.destination.complete();
        }
    };
    return ExhaustMapSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhoYXVzdE1hcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2V4aGF1c3RNYXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBSUEsc0RBQXFEO0FBQ3JELHNEQUFxRDtBQUNyRCwrREFBOEQ7QUFFOUQsNkJBQTRCO0FBQzVCLDJDQUEwQztBQVExQyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsU0FBZ0IsVUFBVSxDQUN4QixPQUF3RCxFQUN4RCxjQUE0RjtJQUU1RixJQUFJLGNBQWMsRUFBRTtRQUNsQixrQkFBa0I7UUFDbEIsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUMzQyxVQUFVLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsV0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQzNDLFNBQUcsQ0FBQyxVQUFDLENBQUMsRUFBRSxFQUFFLElBQUssT0FBQSxjQUFjLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEVBQTNCLENBQTJCLENBQUMsQ0FDNUMsRUFGb0IsQ0FFcEIsQ0FBQyxDQUNILEVBSmlDLENBSWpDLENBQUM7S0FDSDtJQUNELE9BQU8sVUFBQyxNQUFxQjtRQUMzQixPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUE1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QUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUNILDJCQUFDO0FBQUQsQ0FBQyxBQS9ERCxDQUF5QyxpQ0FBZSxHQStEdkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gZXhoYXVzdE1hcDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZC4gVXNlIGlubmVyIG1hcCBpbnN0ZWFkLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4aGF1c3RNYXA8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIHJlc3VsdFNlbGVjdG9yOiB1bmRlZmluZWQpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQuIFVzZSBpbm5lciBtYXAgaW5zdGVhZC4gKi9cbmV4cG9ydCBmdW5jdGlvbiBleGhhdXN0TWFwPFQsIEksIFI+KHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PEk+LCByZXN1bHRTZWxlY3RvcjogKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUHJvamVjdHMgZWFjaCBzb3VyY2UgdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSB3aGljaCBpcyBtZXJnZWQgaW4gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBvbmx5IGlmIHRoZSBwcmV2aW91cyBwcm9qZWN0ZWQgT2JzZXJ2YWJsZSBoYXMgY29tcGxldGVkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5NYXBzIGVhY2ggdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSwgdGhlbiBmbGF0dGVucyBhbGwgb2ZcbiAqIHRoZXNlIGlubmVyIE9ic2VydmFibGVzIHVzaW5nIHtAbGluayBleGhhdXN0fS48L3NwYW4+XG4gKlxuICogIVtdKGV4aGF1c3RNYXAucG5nKVxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGl0ZW1zIGJhc2VkIG9uIGFwcGx5aW5nIGEgZnVuY3Rpb24gdGhhdCB5b3VcbiAqIHN1cHBseSB0byBlYWNoIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIHdoZXJlIHRoYXQgZnVuY3Rpb25cbiAqIHJldHVybnMgYW4gKHNvLWNhbGxlZCBcImlubmVyXCIpIE9ic2VydmFibGUuIFdoZW4gaXQgcHJvamVjdHMgYSBzb3VyY2UgdmFsdWUgdG9cbiAqIGFuIE9ic2VydmFibGUsIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBiZWdpbnMgZW1pdHRpbmcgdGhlIGl0ZW1zIGVtaXR0ZWQgYnlcbiAqIHRoYXQgcHJvamVjdGVkIE9ic2VydmFibGUuIEhvd2V2ZXIsIGBleGhhdXN0TWFwYCBpZ25vcmVzIGV2ZXJ5IG5ldyBwcm9qZWN0ZWRcbiAqIE9ic2VydmFibGUgaWYgdGhlIHByZXZpb3VzIHByb2plY3RlZCBPYnNlcnZhYmxlIGhhcyBub3QgeWV0IGNvbXBsZXRlZC4gT25jZVxuICogdGhhdCBvbmUgY29tcGxldGVzLCBpdCB3aWxsIGFjY2VwdCBhbmQgZmxhdHRlbiB0aGUgbmV4dCBwcm9qZWN0ZWQgT2JzZXJ2YWJsZVxuICogYW5kIHJlcGVhdCB0aGlzIHByb2Nlc3MuXG4gKlxuICogIyMgRXhhbXBsZVxuICogUnVuIGEgZmluaXRlIHRpbWVyIGZvciBlYWNoIGNsaWNrLCBvbmx5IGlmIHRoZXJlIGlzIG5vIGN1cnJlbnRseSBhY3RpdmUgdGltZXJcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShcbiAqICAgZXhoYXVzdE1hcCgoZXYpID0+IGludGVydmFsKDEwMDApLnBpcGUodGFrZSg1KSkpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBleGhhdXN0fVxuICogQHNlZSB7QGxpbmsgbWVyZ2VNYXB9XG4gKiBAc2VlIHtAbGluayBzd2l0Y2hNYXB9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCwgP2luZGV4OiBudW1iZXIpOiBPYnNlcnZhYmxlSW5wdXR9IHByb2plY3QgQSBmdW5jdGlvblxuICogdGhhdCwgd2hlbiBhcHBsaWVkIHRvIGFuIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUsIHJldHVybnMgYW5cbiAqIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIGNvbnRhaW5pbmcgcHJvamVjdGVkIE9ic2VydmFibGVzXG4gKiBvZiBlYWNoIGl0ZW0gb2YgdGhlIHNvdXJjZSwgaWdub3JpbmcgcHJvamVjdGVkIE9ic2VydmFibGVzIHRoYXQgc3RhcnQgYmVmb3JlXG4gKiB0aGVpciBwcmVjZWRpbmcgT2JzZXJ2YWJsZSBoYXMgY29tcGxldGVkLlxuICogQG1ldGhvZCBleGhhdXN0TWFwXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXhoYXVzdE1hcDxULCBJLCBSPihcbiAgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8ST4sXG4gIHJlc3VsdFNlbGVjdG9yPzogKG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IEksIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyKSA9PiBSLFxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBJfFI+IHtcbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5waXBlKFxuICAgICAgZXhoYXVzdE1hcCgoYSwgaSkgPT4gZnJvbShwcm9qZWN0KGEsIGkpKS5waXBlKFxuICAgICAgICBtYXAoKGIsIGlpKSA9PiByZXN1bHRTZWxlY3RvcihhLCBiLCBpLCBpaSkpLFxuICAgICAgKSksXG4gICAgKTtcbiAgfVxuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT5cbiAgICBzb3VyY2UubGlmdChuZXcgRXhoYXVzZU1hcE9wZXJhdG9yKHByb2plY3QpKTtcbn1cblxuY2xhc3MgRXhoYXVzZU1hcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRXhoYXVzdE1hcFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5wcm9qZWN0KSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEV4aGF1c3RNYXBTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgcHJpdmF0ZSBoYXNTdWJzY3JpcHRpb24gPSBmYWxzZTtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBpbmRleCA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaGFzU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLnRyeU5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5TmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxSPjtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5wcm9qZWN0KHZhbHVlLCBpbmRleCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuaGFzU3Vic2NyaXB0aW9uID0gdHJ1ZTtcbiAgICB0aGlzLl9pbm5lclN1YihyZXN1bHQsIHZhbHVlLCBpbmRleCk7XG4gIH1cblxuICBwcml2YXRlIF9pbm5lclN1YihyZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxSPiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBpbm5lclN1YnNjcmliZXIgPSBuZXcgSW5uZXJTdWJzY3JpYmVyKHRoaXMsIHVuZGVmaW5lZCwgdW5kZWZpbmVkKTtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChpbm5lclN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmliZVRvUmVzdWx0PFQsIFI+KHRoaXMsIHJlc3VsdCwgdmFsdWUsIGluZGV4LCBpbm5lclN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgaWYgKCF0aGlzLmhhc1N1YnNjcmlwdGlvbikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgZGVzdGluYXRpb24ucmVtb3ZlKGlubmVyU3ViKTtcblxuICAgIHRoaXMuaGFzU3Vic2NyaXB0aW9uID0gZmFsc2U7XG4gICAgaWYgKHRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=