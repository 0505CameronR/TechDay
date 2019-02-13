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
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
/* tslint:enable:max-line-length */
/**
 * Recursively projects each source value to an Observable which is merged in
 * the output Observable.
 *
 * <span class="informal">It's similar to {@link mergeMap}, but applies the
 * projection function to every source value as well as every output value.
 * It's recursive.</span>
 *
 * ![](expand.png)
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger. *Expand* will re-emit on the output
 * Observable every source value. Then, each output value is given to the
 * `project` function which returns an inner Observable to be merged on the
 * output Observable. Those output values resulting from the projection are also
 * given to the `project` function to produce new output values. This is how
 * *expand* behaves recursively.
 *
 * ## Example
 * Start emitting the powers of two on every click, at most 10 of them
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const powersOfTwo = clicks.pipe(
 *   mapTo(1),
 *   expand(x => of(2 * x).pipe(delay(1000))),
 *   take(10),
 * );
 * powersOfTwo.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 *
 * @param {function(value: T, index: number) => Observable} project A function
 * that, when applied to an item emitted by the source or the output Observable,
 * returns an Observable.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {SchedulerLike} [scheduler=null] The {@link SchedulerLike} to use for subscribing to
 * each projected inner Observable.
 * @return {Observable} An Observable that emits the source values and also
 * result of applying the projection function to each value emitted on the
 * output Observable and and merging the results of the Observables obtained
 * from this transformation.
 * @method expand
 * @owner Observable
 */
function expand(project, concurrent, scheduler) {
    if (concurrent === void 0) { concurrent = Number.POSITIVE_INFINITY; }
    if (scheduler === void 0) { scheduler = undefined; }
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return function (source) { return source.lift(new ExpandOperator(project, concurrent, scheduler)); };
}
exports.expand = expand;
var ExpandOperator = /** @class */ (function () {
    function ExpandOperator(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    ExpandOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    };
    return ExpandOperator;
}());
exports.ExpandOperator = ExpandOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ExpandSubscriber = /** @class */ (function (_super) {
    __extends(ExpandSubscriber, _super);
    function ExpandSubscriber(destination, project, concurrent, scheduler) {
        var _this = _super.call(this, destination) || this;
        _this.project = project;
        _this.concurrent = concurrent;
        _this.scheduler = scheduler;
        _this.index = 0;
        _this.active = 0;
        _this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            _this.buffer = [];
        }
        return _this;
    }
    ExpandSubscriber.dispatch = function (arg) {
        var subscriber = arg.subscriber, result = arg.result, value = arg.value, index = arg.index;
        subscriber.subscribeToProjection(result, value, index);
    };
    ExpandSubscriber.prototype._next = function (value) {
        var destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        var index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            var result = tryCatch_1.tryCatch(this.project)(value, index);
            if (result === errorObject_1.errorObject) {
                destination.error(errorObject_1.errorObject.e);
            }
            else if (!this.scheduler) {
                this.subscribeToProjection(result, value, index);
            }
            else {
                var state = { subscriber: this, result: result, value: value, index: index };
                var destination_1 = this.destination;
                destination_1.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
            }
        }
        else {
            this.buffer.push(value);
        }
    };
    ExpandSubscriber.prototype.subscribeToProjection = function (result, value, index) {
        this.active++;
        var destination = this.destination;
        destination.add(subscribeToResult_1.subscribeToResult(this, result, value, index));
    };
    ExpandSubscriber.prototype._complete = function () {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    };
    ExpandSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    };
    ExpandSubscriber.prototype.notifyComplete = function (innerSub) {
        var buffer = this.buffer;
        var destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    };
    return ExpandSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.ExpandSubscriber = ExpandSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZXhwYW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUdBLDZDQUE0QztBQUM1QyxtREFBa0Q7QUFFbEQsc0RBQXFEO0FBRXJELCtEQUE4RDtBQU05RCxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdERztBQUNILFNBQWdCLE1BQU0sQ0FBTyxPQUF3RCxFQUN4RCxVQUE2QyxFQUM3QyxTQUFvQztJQURwQywyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7SUFDN0MsMEJBQUEsRUFBQSxxQkFBb0M7SUFDL0QsVUFBVSxHQUFHLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUM7SUFFM0UsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBL0QsQ0FBK0QsQ0FBQztBQUNwRyxDQUFDO0FBTkQsd0JBTUM7QUFFRDtJQUNFLHdCQUFvQixPQUF3RCxFQUN4RCxVQUFrQixFQUNsQixTQUF3QjtRQUZ4QixZQUFPLEdBQVAsT0FBTyxDQUFpRDtRQUN4RCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQ2xCLGNBQVMsR0FBVCxTQUFTLENB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bXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmQ8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZDxUPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxUPiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvamVjdHMgZWFjaCBzb3VyY2UgdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSB3aGljaCBpcyBtZXJnZWQgaW5cbiAqIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBzaW1pbGFyIHRvIHtAbGluayBtZXJnZU1hcH0sIGJ1dCBhcHBsaWVzIHRoZVxuICogcHJvamVjdGlvbiBmdW5jdGlvbiB0byBldmVyeSBzb3VyY2UgdmFsdWUgYXMgd2VsbCBhcyBldmVyeSBvdXRwdXQgdmFsdWUuXG4gKiBJdCdzIHJlY3Vyc2l2ZS48L3NwYW4+XG4gKlxuICogIVtdKGV4cGFuZC5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgYmFzZWQgb24gYXBwbHlpbmcgYSBmdW5jdGlvbiB0aGF0IHlvdVxuICogc3VwcGx5IHRvIGVhY2ggaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgd2hlcmUgdGhhdCBmdW5jdGlvblxuICogcmV0dXJucyBhbiBPYnNlcnZhYmxlLCBhbmQgdGhlbiBtZXJnaW5nIHRob3NlIHJlc3VsdGluZyBPYnNlcnZhYmxlcyBhbmRcbiAqIGVtaXR0aW5nIHRoZSByZXN1bHRzIG9mIHRoaXMgbWVyZ2VyLiAqRXhwYW5kKiB3aWxsIHJlLWVtaXQgb24gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBldmVyeSBzb3VyY2UgdmFsdWUuIFRoZW4sIGVhY2ggb3V0cHV0IHZhbHVlIGlzIGdpdmVuIHRvIHRoZVxuICogYHByb2plY3RgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gaW5uZXIgT2JzZXJ2YWJsZSB0byBiZSBtZXJnZWQgb24gdGhlXG4gKiBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhvc2Ugb3V0cHV0IHZhbHVlcyByZXN1bHRpbmcgZnJvbSB0aGUgcHJvamVjdGlvbiBhcmUgYWxzb1xuICogZ2l2ZW4gdG8gdGhlIGBwcm9qZWN0YCBmdW5jdGlvbiB0byBwcm9kdWNlIG5ldyBvdXRwdXQgdmFsdWVzLiBUaGlzIGlzIGhvd1xuICogKmV4cGFuZCogYmVoYXZlcyByZWN1cnNpdmVseS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdGFydCBlbWl0dGluZyB0aGUgcG93ZXJzIG9mIHR3byBvbiBldmVyeSBjbGljaywgYXQgbW9zdCAxMCBvZiB0aGVtXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcG93ZXJzT2ZUd28gPSBjbGlja3MucGlwZShcbiAqICAgbWFwVG8oMSksXG4gKiAgIGV4cGFuZCh4ID0+IG9mKDIgKiB4KS5waXBlKGRlbGF5KDEwMDApKSksXG4gKiAgIHRha2UoMTApLFxuICogKTtcbiAqIHBvd2Vyc09mVHdvLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGV9IHByb2plY3QgQSBmdW5jdGlvblxuICogdGhhdCwgd2hlbiBhcHBsaWVkIHRvIGFuIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIG9yIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSxcbiAqIHJldHVybnMgYW4gT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlucHV0XG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc3Vic2NyaWJpbmcgdG9cbiAqIGVhY2ggcHJvamVjdGVkIGlubmVyIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHNvdXJjZSB2YWx1ZXMgYW5kIGFsc29cbiAqIHJlc3VsdCBvZiBhcHBseWluZyB0aGUgcHJvamVjdGlvbiBmdW5jdGlvbiB0byBlYWNoIHZhbHVlIGVtaXR0ZWQgb24gdGhlXG4gKiBvdXRwdXQgT2JzZXJ2YWJsZSBhbmQgYW5kIG1lcmdpbmcgdGhlIHJlc3VsdHMgb2YgdGhlIE9ic2VydmFibGVzIG9idGFpbmVkXG4gKiBmcm9tIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gKiBAbWV0aG9kIGV4cGFuZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSB1bmRlZmluZWQpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgY29uY3VycmVudCA9IChjb25jdXJyZW50IHx8IDApIDwgMSA/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSA6IGNvbmN1cnJlbnQ7XG5cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBFeHBhbmRPcGVyYXRvcihwcm9qZWN0LCBjb25jdXJyZW50LCBzY2hlZHVsZXIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEV4cGFuZE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBFeHBhbmRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJvamVjdCwgdGhpcy5jb25jdXJyZW50LCB0aGlzLnNjaGVkdWxlcikpO1xuICB9XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEFyZzxULCBSPiB7XG4gIHN1YnNjcmliZXI6IEV4cGFuZFN1YnNjcmliZXI8VCwgUj47XG4gIHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFI+O1xuICB2YWx1ZTogYW55O1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEV4cGFuZFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGFjdGl2ZTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBidWZmZXI6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgaWYgKGNvbmN1cnJlbnQgPCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuYnVmZmVyID0gW107XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZGlzcGF0Y2g8VCwgUj4oYXJnOiBEaXNwYXRjaEFyZzxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHtzdWJzY3JpYmVyLCByZXN1bHQsIHZhbHVlLCBpbmRleH0gPSBhcmc7XG4gICAgc3Vic2NyaWJlci5zdWJzY3JpYmVUb1Byb2plY3Rpb24ocmVzdWx0LCB2YWx1ZSwgaW5kZXgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICBpZiAoZGVzdGluYXRpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA8IHRoaXMuY29uY3VycmVudCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgICBsZXQgcmVzdWx0ID0gdHJ5Q2F0Y2godGhpcy5wcm9qZWN0KSh2YWx1ZSwgaW5kZXgpO1xuICAgICAgaWYgKHJlc3VsdCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZXJyb3JPYmplY3QuZSk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnNjaGVkdWxlcikge1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvUHJvamVjdGlvbihyZXN1bHQsIHZhbHVlLCBpbmRleCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZTogRGlzcGF0Y2hBcmc8VCwgUj4gPSB7IHN1YnNjcmliZXI6IHRoaXMsIHJlc3VsdCwgdmFsdWUsIGluZGV4IH07XG4gICAgICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb247XG4gICAgICAgIGRlc3RpbmF0aW9uLmFkZCh0aGlzLnNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEFyZzxULCBSPj4oRXhwYW5kU3Vic2NyaWJlci5kaXNwYXRjaCwgMCwgc3RhdGUpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdWJzY3JpYmVUb1Byb2plY3Rpb24ocmVzdWx0OiBhbnksIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmUrKztcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLmFkZChzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPih0aGlzLCByZXN1bHQsIHZhbHVlLCBpbmRleCkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmhhc0NvbXBsZXRlZCA9IHRydWU7XG4gICAgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUixcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5fbmV4dChpbm5lclZhbHVlKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBTdWJzY3JpcHRpb24pOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgIGRlc3RpbmF0aW9uLnJlbW92ZShpbm5lclN1Yik7XG4gICAgdGhpcy5hY3RpdmUtLTtcbiAgICBpZiAoYnVmZmVyICYmIGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9uZXh0KGJ1ZmZlci5zaGlmdCgpKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=