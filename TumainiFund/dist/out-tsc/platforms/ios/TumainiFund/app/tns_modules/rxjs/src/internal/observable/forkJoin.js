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
var Observable_1 = require("../Observable");
var isArray_1 = require("../util/isArray");
var empty_1 = require("./empty");
var subscribeToResult_1 = require("../util/subscribeToResult");
var OuterSubscriber_1 = require("../OuterSubscriber");
var map_1 = require("../operators/map");
/* tslint:enable:max-line-length */
/**
 * Joins last values emitted by passed Observables.
 *
 * <span class="informal">Wait for Observables to complete and then combine last values they emitted.</span>
 *
 * ![](forkJoin.png)
 *
 * `forkJoin` is an operator that takes any number of Observables which can be passed either as an array
 * or directly as arguments. If no input Observables are provided, resulting stream will complete
 * immediately.
 *
 * `forkJoin` will wait for all passed Observables to complete and then it will emit an array with last
 * values from corresponding Observables. So if you pass `n` Observables to the operator, resulting
 * array will have `n` values, where first value is the last thing emitted by the first Observable,
 * second value is the last thing emitted by the second Observable and so on. That means `forkJoin` will
 * not emit more than once and it will complete after that. If you need to emit combined values not only
 * at the end of lifecycle of passed Observables, but also throughout it, try out {@link combineLatest}
 * or {@link zip} instead.
 *
 * In order for resulting array to have the same length as the number of input Observables, whenever any of
 * that Observables completes without emitting any value, `forkJoin` will complete at that moment as well
 * and it will not emit anything either, even if it already has some last values from other Observables.
 * Conversely, if there is an Observable that never completes, `forkJoin` will never complete as well,
 * unless at any point some other Observable completes without emitting value, which brings us back to
 * the previous case. Overall, in order for `forkJoin` to emit a value, all Observables passed as arguments
 * have to emit something at least once and complete.
 *
 * If any input Observable errors at some point, `forkJoin` will error as well and all other Observables
 * will be immediately unsubscribed.
 *
 * Optionally `forkJoin` accepts project function, that will be called with values which normally
 * would land in emitted array. Whatever is returned by project function, will appear in output
 * Observable instead. This means that default project can be thought of as a function that takes
 * all its arguments and puts them into an array. Note that project function will be called only
 * when output Observable is supposed to emit a result.
 *
 * ## Examples
 * ### Use forkJoin with operator emitting immediately
 * ```javascript
 * import { forkJoin, of } from 'rxjs';
 *
 * const observable = forkJoin(
 *   of(1, 2, 3, 4),
 *   of(5, 6, 7, 8),
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // [4, 8]
 * // "This is how it ends!"
 * ```
 *
 * ### Use forkJoin with operator emitting after some time
 * ```javascript
 * import { forkJoin, interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const observable = forkJoin(
 *   interval(1000).pipe(take(3)), // emit 0, 1, 2 every second and complete
 *   interval(500).pipe(take(4)),  // emit 0, 1, 2, 3 every half a second and complete
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // [2, 3] after 3 seconds
 * // "This is how it ends!" immediately after
 * ```
 *
 * ### Use forkJoin with project function
 * ```javascript
 * import { forkJoin, interval } from 'rxjs';
 * import { take } from 'rxjs/operators';
 *
 * const observable = forkJoin(
 *   interval(1000).pipe(take(3)), // emit 0, 1, 2 every second and complete
 *   interval(500).pipe(take(4)),  // emit 0, 1, 2, 3 every half a second and complete
 * ).pipe(
 *   map(([n, m]) => n + m),
 * );
 * observable.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('This is how it ends!'),
 * );
 *
 * // Logs:
 * // 5 after 3 seconds
 * // "This is how it ends!" immediately after
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 *
 * @param {...ObservableInput} sources Any number of Observables provided either as an array or as an arguments
 * passed directly to the operator.
 * @param {function} [project] Function that takes values emitted by input Observables and returns value
 * that will appear in resulting Observable instead of default array.
 * @return {Observable} Observable emitting either an array of last values emitted by passed Observables
 * or value from project function.
 */
function forkJoin() {
    var sources = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        sources[_i] = arguments[_i];
    }
    var resultSelector;
    if (typeof sources[sources.length - 1] === 'function') {
        // DEPRECATED PATH
        resultSelector = sources.pop();
    }
    // if the first and only other argument is an array
    // assume it's been called with `forkJoin([obs1, obs2, obs3])`
    if (sources.length === 1 && isArray_1.isArray(sources[0])) {
        sources = sources[0];
    }
    if (sources.length === 0) {
        return empty_1.EMPTY;
    }
    if (resultSelector) {
        // DEPRECATED PATH
        return forkJoin(sources).pipe(map_1.map(function (args) { return resultSelector.apply(void 0, args); }));
    }
    return new Observable_1.Observable(function (subscriber) {
        return new ForkJoinSubscriber(subscriber, sources);
    });
}
exports.forkJoin = forkJoin;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ForkJoinSubscriber = /** @class */ (function (_super) {
    __extends(ForkJoinSubscriber, _super);
    function ForkJoinSubscriber(destination, sources) {
        var _this = _super.call(this, destination) || this;
        _this.sources = sources;
        _this.completed = 0;
        _this.haveValues = 0;
        var len = sources.length;
        _this.values = new Array(len);
        for (var i = 0; i < len; i++) {
            var source = sources[i];
            var innerSubscription = subscribeToResult_1.subscribeToResult(_this, source, null, i);
            if (innerSubscription) {
                _this.add(innerSubscription);
            }
        }
        return _this;
    }
    ForkJoinSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.values[outerIndex] = innerValue;
        if (!innerSub._hasValue) {
            innerSub._hasValue = true;
            this.haveValues++;
        }
    };
    ForkJoinSubscriber.prototype.notifyComplete = function (innerSub) {
        var _a = this, destination = _a.destination, haveValues = _a.haveValues, values = _a.values;
        var len = values.length;
        if (!innerSub._hasValue) {
            destination.complete();
            return;
        }
        this.completed++;
        if (this.completed !== len) {
            return;
        }
        if (haveValues === len) {
            destination.next(values);
        }
        destination.complete();
    };
    return ForkJoinSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ya0pvaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2ZvcmtKb2luLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDRDQUEyQztBQUUzQywyQ0FBMEM7QUFDMUMsaUNBQWdDO0FBQ2hDLCtEQUE4RDtBQUM5RCxzREFBcUQ7QUFHckQsd0NBQXVDO0FBdUJ2QyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMkdHO0FBQ0gsU0FBZ0IsUUFBUTtJQUN0QixpQkFBdUU7U0FBdkUsVUFBdUUsRUFBdkUscUJBQXVFLEVBQXZFLElBQXVFO1FBQXZFLDRCQUF1RTs7SUFHdkUsSUFBSSxjQUF3QixDQUFDO0lBQzdCLElBQUksT0FBTyxPQUFPLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsS0FBSyxVQUFVLEVBQUU7UUFDckQsa0JBQWtCO1FBQ2xCLGNBQWMsR0FBRyxPQUFPLENBQUMsR0FBRyxFQUFjLENBQUM7S0FDNUM7SUFFRCxtREFBbUQ7SUFDbkQsOERBQThEO0lBQzlELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksaUJBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUMvQyxPQUFPLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBOEIsQ0FBQztLQUNuRDtJQUVELElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDeEIsT0FBTyxhQUFLLENBQUM7S0FDZDtJQUVELElBQUksY0FBYyxFQUFFO1FBQ2xCLGtCQUFrQjtRQUNsQixPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQzNCLFNBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLGNBQWMsZUFBSSxJQUFJLEdBQXRCLENBQXVCLENBQUMsQ0FDckMsQ0FBQztLQUNIO0lBRUQsT0FBTyxJQUFJLHVCQUFVLENBQUMsVUFBQSxVQUFVO1FBQzlCLE9BQU8sSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsT0FBb0MsQ0FBQyxDQUFDO0lBQ2xGLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTlCRCw0QkE4QkM7QUFDRDs7OztHQUlHO0FBQ0g7SUFBdUMsc0NBQXFCO0lBSzFELDRCQUFZLFdBQTBCLEVBQ2xCLE9BQWtDO1FBRHRELFlBRUUsa0JBQU0sV0FBVyxDQUFDLFNBYW5CO1FBZG1CLGFBQU8sR0FBUCxPQUFPLENBQTJCO1FBTDlDLGVBQVMsR0FBRyxDQUFDLENBQUM7UUFFZCxnQkFBVSxHQUFHLENBQUMsQ0FBQztRQU1yQixJQUFNLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO1FBQzNCLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFN0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUM1QixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDMUIsSUFBTSxpQkFBaUIsR0FBRyxxQ0FBaUIsQ0FBQyxLQUFJLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUVuRSxJQUFJLGlCQUFpQixFQUFFO2dCQUNyQixLQUFJLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7YUFDN0I7U0FDRjs7SUFDSCxDQUFDO0lBRUQsdUNBQVUsR0FBVixVQUFXLFVBQWUsRUFBRSxVQUFhLEVBQzlCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsR0FBRyxVQUFVLENBQUM7UUFDckMsSUFBSSxDQUFFLFFBQWdCLENBQUMsU0FBUyxFQUFFO1lBQy9CLFFBQWdCLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUNuQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDbkI7SUFDSCxDQUFDO0lBRUQsMkNBQWMsR0FBZCxVQUFlLFFBQStCO1FBQ3RDLElBQUEsU0FBMEMsRUFBeEMsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLGtCQUFlLENBQUM7UUFDakQsSUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztRQUUxQixJQUFJLENBQUUsUUFBZ0IsQ0FBQyxTQUFTLEVBQUU7WUFDaEMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUVELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUVqQixJQUFJLElBQUksQ0FBQyxTQUFTLEtBQUssR0FBRyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELElBQUksVUFBVSxLQUFLLEdBQUcsRUFBRTtZQUN0QixXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQzFCO1FBRUQsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ3pCLENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUFyREQsQ0FBdUMsaUNBQWUsR0FxRHJEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0IH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLy8gZm9ya0pvaW4oW2EkLCBiJCwgYyRdKTtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+XSk6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMj4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPl0pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMz4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDNdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNT4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0PiwgT2JzZXJ2YWJsZUlucHV0PFQ1Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4oc291cmNlczogW09ic2VydmFibGVJbnB1dDxUPiwgT2JzZXJ2YWJsZUlucHV0PFQyPiwgT2JzZXJ2YWJsZUlucHV0PFQzPiwgT2JzZXJ2YWJsZUlucHV0PFQ0PiwgT2JzZXJ2YWJsZUlucHV0PFQ1PiwgT2JzZXJ2YWJsZUlucHV0PFQ2Pl0pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNSwgVDZdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihzb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTogT2JzZXJ2YWJsZTxUW10+O1xuXG4vLyBmb3JrSm9pbihhJCwgYiQsIGMkKVxuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4pOiBPYnNlcnZhYmxlPFRbXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+KTogT2JzZXJ2YWJsZTxbVCwgVDJdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDM+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPik6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDU+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDVdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNSwgVDY+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgZGVwcmVjYXRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luKC4uLmFyZ3M6IEFycmF5PE9ic2VydmFibGVJbnB1dDxhbnk+fEZ1bmN0aW9uPik6IE9ic2VydmFibGU8YW55PjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPiguLi5zb3VyY2VzOiBPYnNlcnZhYmxlSW5wdXQ8VD5bXSk6IE9ic2VydmFibGU8VFtdPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogSm9pbnMgbGFzdCB2YWx1ZXMgZW1pdHRlZCBieSBwYXNzZWQgT2JzZXJ2YWJsZXMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPldhaXQgZm9yIE9ic2VydmFibGVzIHRvIGNvbXBsZXRlIGFuZCB0aGVuIGNvbWJpbmUgbGFzdCB2YWx1ZXMgdGhleSBlbWl0dGVkLjwvc3Bhbj5cbiAqXG4gKiAhW10oZm9ya0pvaW4ucG5nKVxuICpcbiAqIGBmb3JrSm9pbmAgaXMgYW4gb3BlcmF0b3IgdGhhdCB0YWtlcyBhbnkgbnVtYmVyIG9mIE9ic2VydmFibGVzIHdoaWNoIGNhbiBiZSBwYXNzZWQgZWl0aGVyIGFzIGFuIGFycmF5XG4gKiBvciBkaXJlY3RseSBhcyBhcmd1bWVudHMuIElmIG5vIGlucHV0IE9ic2VydmFibGVzIGFyZSBwcm92aWRlZCwgcmVzdWx0aW5nIHN0cmVhbSB3aWxsIGNvbXBsZXRlXG4gKiBpbW1lZGlhdGVseS5cbiAqXG4gKiBgZm9ya0pvaW5gIHdpbGwgd2FpdCBmb3IgYWxsIHBhc3NlZCBPYnNlcnZhYmxlcyB0byBjb21wbGV0ZSBhbmQgdGhlbiBpdCB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBsYXN0XG4gKiB2YWx1ZXMgZnJvbSBjb3JyZXNwb25kaW5nIE9ic2VydmFibGVzLiBTbyBpZiB5b3UgcGFzcyBgbmAgT2JzZXJ2YWJsZXMgdG8gdGhlIG9wZXJhdG9yLCByZXN1bHRpbmdcbiAqIGFycmF5IHdpbGwgaGF2ZSBgbmAgdmFsdWVzLCB3aGVyZSBmaXJzdCB2YWx1ZSBpcyB0aGUgbGFzdCB0aGluZyBlbWl0dGVkIGJ5IHRoZSBmaXJzdCBPYnNlcnZhYmxlLFxuICogc2Vjb25kIHZhbHVlIGlzIHRoZSBsYXN0IHRoaW5nIGVtaXR0ZWQgYnkgdGhlIHNlY29uZCBPYnNlcnZhYmxlIGFuZCBzbyBvbi4gVGhhdCBtZWFucyBgZm9ya0pvaW5gIHdpbGxcbiAqIG5vdCBlbWl0IG1vcmUgdGhhbiBvbmNlIGFuZCBpdCB3aWxsIGNvbXBsZXRlIGFmdGVyIHRoYXQuIElmIHlvdSBuZWVkIHRvIGVtaXQgY29tYmluZWQgdmFsdWVzIG5vdCBvbmx5XG4gKiBhdCB0aGUgZW5kIG9mIGxpZmVjeWNsZSBvZiBwYXNzZWQgT2JzZXJ2YWJsZXMsIGJ1dCBhbHNvIHRocm91Z2hvdXQgaXQsIHRyeSBvdXQge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBvciB7QGxpbmsgemlwfSBpbnN0ZWFkLlxuICpcbiAqIEluIG9yZGVyIGZvciByZXN1bHRpbmcgYXJyYXkgdG8gaGF2ZSB0aGUgc2FtZSBsZW5ndGggYXMgdGhlIG51bWJlciBvZiBpbnB1dCBPYnNlcnZhYmxlcywgd2hlbmV2ZXIgYW55IG9mXG4gKiB0aGF0IE9ic2VydmFibGVzIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIGFueSB2YWx1ZSwgYGZvcmtKb2luYCB3aWxsIGNvbXBsZXRlIGF0IHRoYXQgbW9tZW50IGFzIHdlbGxcbiAqIGFuZCBpdCB3aWxsIG5vdCBlbWl0IGFueXRoaW5nIGVpdGhlciwgZXZlbiBpZiBpdCBhbHJlYWR5IGhhcyBzb21lIGxhc3QgdmFsdWVzIGZyb20gb3RoZXIgT2JzZXJ2YWJsZXMuXG4gKiBDb252ZXJzZWx5LCBpZiB0aGVyZSBpcyBhbiBPYnNlcnZhYmxlIHRoYXQgbmV2ZXIgY29tcGxldGVzLCBgZm9ya0pvaW5gIHdpbGwgbmV2ZXIgY29tcGxldGUgYXMgd2VsbCxcbiAqIHVubGVzcyBhdCBhbnkgcG9pbnQgc29tZSBvdGhlciBPYnNlcnZhYmxlIGNvbXBsZXRlcyB3aXRob3V0IGVtaXR0aW5nIHZhbHVlLCB3aGljaCBicmluZ3MgdXMgYmFjayB0b1xuICogdGhlIHByZXZpb3VzIGNhc2UuIE92ZXJhbGwsIGluIG9yZGVyIGZvciBgZm9ya0pvaW5gIHRvIGVtaXQgYSB2YWx1ZSwgYWxsIE9ic2VydmFibGVzIHBhc3NlZCBhcyBhcmd1bWVudHNcbiAqIGhhdmUgdG8gZW1pdCBzb21ldGhpbmcgYXQgbGVhc3Qgb25jZSBhbmQgY29tcGxldGUuXG4gKlxuICogSWYgYW55IGlucHV0IE9ic2VydmFibGUgZXJyb3JzIGF0IHNvbWUgcG9pbnQsIGBmb3JrSm9pbmAgd2lsbCBlcnJvciBhcyB3ZWxsIGFuZCBhbGwgb3RoZXIgT2JzZXJ2YWJsZXNcbiAqIHdpbGwgYmUgaW1tZWRpYXRlbHkgdW5zdWJzY3JpYmVkLlxuICpcbiAqIE9wdGlvbmFsbHkgYGZvcmtKb2luYCBhY2NlcHRzIHByb2plY3QgZnVuY3Rpb24sIHRoYXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB2YWx1ZXMgd2hpY2ggbm9ybWFsbHlcbiAqIHdvdWxkIGxhbmQgaW4gZW1pdHRlZCBhcnJheS4gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgYnkgcHJvamVjdCBmdW5jdGlvbiwgd2lsbCBhcHBlYXIgaW4gb3V0cHV0XG4gKiBPYnNlcnZhYmxlIGluc3RlYWQuIFRoaXMgbWVhbnMgdGhhdCBkZWZhdWx0IHByb2plY3QgY2FuIGJlIHRob3VnaHQgb2YgYXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiBhbGwgaXRzIGFyZ3VtZW50cyBhbmQgcHV0cyB0aGVtIGludG8gYW4gYXJyYXkuIE5vdGUgdGhhdCBwcm9qZWN0IGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIG9ubHlcbiAqIHdoZW4gb3V0cHV0IE9ic2VydmFibGUgaXMgc3VwcG9zZWQgdG8gZW1pdCBhIHJlc3VsdC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIG9wZXJhdG9yIGVtaXR0aW5nIGltbWVkaWF0ZWx5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgb2YgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIG9mKDEsIDIsIDMsIDQpLFxuICogICBvZig1LCA2LCA3LCA4KSxcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gWzQsIDhdXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCJcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBvcGVyYXRvciBlbWl0dGluZyBhZnRlciBzb21lIHRpbWVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZvcmtKb2luLCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIGludGVydmFsKDEwMDApLnBpcGUodGFrZSgzKSksIC8vIGVtaXQgMCwgMSwgMiBldmVyeSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiAgIGludGVydmFsKDUwMCkucGlwZSh0YWtlKDQpKSwgIC8vIGVtaXQgMCwgMSwgMiwgMyBldmVyeSBoYWxmIGEgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBbMiwgM10gYWZ0ZXIgMyBzZWNvbmRzXG4gKiAvLyBcIlRoaXMgaXMgaG93IGl0IGVuZHMhXCIgaW1tZWRpYXRlbHkgYWZ0ZXJcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgZm9ya0pvaW4gd2l0aCBwcm9qZWN0IGZ1bmN0aW9uXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmb3JrSm9pbiwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3Qgb2JzZXJ2YWJsZSA9IGZvcmtKb2luKFxuICogICBpbnRlcnZhbCgxMDAwKS5waXBlKHRha2UoMykpLCAvLyBlbWl0IDAsIDEsIDIgZXZlcnkgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogICBpbnRlcnZhbCg1MDApLnBpcGUodGFrZSg0KSksICAvLyBlbWl0IDAsIDEsIDIsIDMgZXZlcnkgaGFsZiBhIHNlY29uZCBhbmQgY29tcGxldGVcbiAqICkucGlwZShcbiAqICAgbWFwKChbbiwgbV0pID0+IG4gKyBtKSxcbiAqICk7XG4gKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGlzIGlzIGhvdyBpdCBlbmRzIScpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gNSBhZnRlciAzIHNlY29uZHNcbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIiBpbW1lZGlhdGVseSBhZnRlclxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqIEBzZWUge0BsaW5rIHppcH1cbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVJbnB1dH0gc291cmNlcyBBbnkgbnVtYmVyIG9mIE9ic2VydmFibGVzIHByb3ZpZGVkIGVpdGhlciBhcyBhbiBhcnJheSBvciBhcyBhbiBhcmd1bWVudHNcbiAqIHBhc3NlZCBkaXJlY3RseSB0byB0aGUgb3BlcmF0b3IuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbcHJvamVjdF0gRnVuY3Rpb24gdGhhdCB0YWtlcyB2YWx1ZXMgZW1pdHRlZCBieSBpbnB1dCBPYnNlcnZhYmxlcyBhbmQgcmV0dXJucyB2YWx1ZVxuICogdGhhdCB3aWxsIGFwcGVhciBpbiByZXN1bHRpbmcgT2JzZXJ2YWJsZSBpbnN0ZWFkIG9mIGRlZmF1bHQgYXJyYXkuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBPYnNlcnZhYmxlIGVtaXR0aW5nIGVpdGhlciBhbiBhcnJheSBvZiBsYXN0IHZhbHVlcyBlbWl0dGVkIGJ5IHBhc3NlZCBPYnNlcnZhYmxlc1xuICogb3IgdmFsdWUgZnJvbSBwcm9qZWN0IGZ1bmN0aW9uLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4oXG4gIC4uLnNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPiB8IE9ic2VydmFibGVJbnB1dDxUPltdIHwgRnVuY3Rpb24+XG4pOiBPYnNlcnZhYmxlPFRbXT4ge1xuXG4gIGxldCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb247XG4gIGlmICh0eXBlb2Ygc291cmNlc1tzb3VyY2VzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmVzdWx0U2VsZWN0b3IgPSBzb3VyY2VzLnBvcCgpIGFzIEZ1bmN0aW9uO1xuICB9XG5cbiAgLy8gaWYgdGhlIGZpcnN0IGFuZCBvbmx5IG90aGVyIGFyZ3VtZW50IGlzIGFuIGFycmF5XG4gIC8vIGFzc3VtZSBpdCdzIGJlZW4gY2FsbGVkIHdpdGggYGZvcmtKb2luKFtvYnMxLCBvYnMyLCBvYnMzXSlgXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMSAmJiBpc0FycmF5KHNvdXJjZXNbMF0pKSB7XG4gICAgc291cmNlcyA9IHNvdXJjZXNbMF0gYXMgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+PjtcbiAgfVxuXG4gIGlmIChzb3VyY2VzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBFTVBUWTtcbiAgfVxuXG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgIHJldHVybiBmb3JrSm9pbihzb3VyY2VzKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gcmVzdWx0U2VsZWN0b3IoLi4uYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICByZXR1cm4gbmV3IEZvcmtKb2luU3Vic2NyaWJlcihzdWJzY3JpYmVyLCBzb3VyY2VzIGFzIEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pO1xuICB9KTtcbn1cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBGb3JrSm9pblN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgVD4ge1xuICBwcml2YXRlIGNvbXBsZXRlZCA9IDA7XG4gIHByaXZhdGUgdmFsdWVzOiBUW107XG4gIHByaXZhdGUgaGF2ZVZhbHVlcyA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcblxuICAgIGNvbnN0IGxlbiA9IHNvdXJjZXMubGVuZ3RoO1xuICAgIHRoaXMudmFsdWVzID0gbmV3IEFycmF5KGxlbik7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb25zdCBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBzb3VyY2UsIG51bGwsIGkpO1xuXG4gICAgICBpZiAoaW5uZXJTdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5hZGQoaW5uZXJTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogYW55LCBpbm5lclZhbHVlOiBULFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICB0aGlzLnZhbHVlc1tvdXRlckluZGV4XSA9IGlubmVyVmFsdWU7XG4gICAgaWYgKCEoaW5uZXJTdWIgYXMgYW55KS5faGFzVmFsdWUpIHtcbiAgICAgIChpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSA9IHRydWU7XG4gICAgICB0aGlzLmhhdmVWYWx1ZXMrKztcbiAgICB9XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiwgaGF2ZVZhbHVlcywgdmFsdWVzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IHZhbHVlcy5sZW5ndGg7XG5cbiAgICBpZiAoIShpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSkge1xuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbXBsZXRlZCsrO1xuXG4gICAgaWYgKHRoaXMuY29tcGxldGVkICE9PSBsZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoaGF2ZVZhbHVlcyA9PT0gbGVuKSB7XG4gICAgICBkZXN0aW5hdGlvbi5uZXh0KHZhbHVlcyk7XG4gICAgfVxuXG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxufVxuIl19