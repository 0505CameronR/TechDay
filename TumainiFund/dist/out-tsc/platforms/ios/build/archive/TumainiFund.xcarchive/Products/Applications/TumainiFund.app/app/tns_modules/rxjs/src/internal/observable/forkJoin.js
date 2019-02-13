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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZm9ya0pvaW4uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZm9ya0pvaW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQTJDO0FBRTNDLDJDQUEwQztBQUMxQyxpQ0FBZ0M7QUFDaEMsK0RBQThEO0FBQzlELHNEQUFxRDtBQUdyRCx3Q0FBdUM7QUF1QnZDLG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyR0c7QUFDSCxTQUFnQixRQUFRO0lBQ3RCLGlCQUF1RTtTQUF2RSxVQUF1RSxFQUF2RSxxQkFBdUUsRUFBdkUsSUFBdUU7UUFBdkUsNEJBQXVFOztJQUd2RSxJQUFJLGNBQXdCLENBQUM7SUFDN0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxLQUFLLFVBQVUsRUFBRTtRQUNyRCxrQkFBa0I7UUFDbEIsY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLEVBQWMsQ0FBQztLQUM1QztJQUVELG1EQUFtRDtJQUNuRCw4REFBOEQ7SUFDOUQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxpQkFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1FBQy9DLE9BQU8sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUE4QixDQUFDO0tBQ25EO0lBRUQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN4QixPQUFPLGFBQUssQ0FBQztLQUNkO0lBRUQsSUFBSSxjQUFjLEVBQUU7UUFDbEIsa0JBQWtCO1FBQ2xCLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FDM0IsU0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsY0FBYyxlQUFJLElBQUksR0FBdEIsQ0FBdUIsQ0FBQyxDQUNyQyxDQUFDO0tBQ0g7SUFFRCxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFBLFVBQVU7UUFDOUIsT0FBTyxJQUFJLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxPQUFvQyxDQUFDLENBQUM7SUFDbEYsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBOUJELDRCQThCQztBQUNEOzs7O0dBSUc7QUFDSDtJQUF1QyxzQ0FBcUI7SUFLMUQsNEJBQVksV0FBMEIsRUFDbEIsT0FBa0M7UUFEdEQsWUFFRSxrQkFBTSxXQUFXLENBQUMsU0FhbkI7UUFkbUIsYUFBTyxHQUFQLE9BQU8sQ0FBMkI7UUFMOUMsZUFBUyxHQUFHLENBQUMsQ0FBQztRQUVkLGdCQUFVLEdBQUcsQ0FBQyxDQUFDO1FBTXJCLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDM0IsS0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUU3QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQzVCLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMxQixJQUFNLGlCQUFpQixHQUFHLHFDQUFpQixDQUFDLEtBQUksRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBRW5FLElBQUksaUJBQWlCLEVBQUU7Z0JBQ3JCLEtBQUksQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQzthQUM3QjtTQUNGOztJQUNILENBQUM7SUFFRCx1Q0FBVSxHQUFWLFVBQVcsVUFBZSxFQUFFLFVBQWEsRUFDOUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxHQUFHLFVBQVUsQ0FBQztRQUNyQyxJQUFJLENBQUUsUUFBZ0IsQ0FBQyxTQUFTLEVBQUU7WUFDL0IsUUFBZ0IsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ25DLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFFRCwyQ0FBYyxHQUFkLFVBQWUsUUFBK0I7UUFDdEMsSUFBQSxTQUEwQyxFQUF4Qyw0QkFBVyxFQUFFLDBCQUFVLEVBQUUsa0JBQWUsQ0FBQztRQUNqRCxJQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO1FBRTFCLElBQUksQ0FBRSxRQUFnQixDQUFDLFNBQVMsRUFBRTtZQUNoQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBRWpCLElBQUksSUFBSSxDQUFDLFNBQVMsS0FBSyxHQUFHLEVBQUU7WUFDMUIsT0FBTztTQUNSO1FBRUQsSUFBSSxVQUFVLEtBQUssR0FBRyxFQUFFO1lBQ3RCLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDMUI7UUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQXJERCxDQUF1QyxpQ0FBZSxHQXFEckQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IEVNUFRZIH0gZnJvbSAnLi9lbXB0eSc7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vLyBmb3JrSm9pbihbYSQsIGIkLCBjJF0pO1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD5dKTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+XSk6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzPihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQ+KHNvdXJjZXM6IFtPYnNlcnZhYmxlSW5wdXQ8VD4sIE9ic2VydmFibGVJbnB1dDxUMj4sIE9ic2VydmFibGVJbnB1dDxUMz4sIE9ic2VydmFibGVJbnB1dDxUND5dKTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNF0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDU+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUNCwgVDUsIFQ2Pihzb3VyY2VzOiBbT2JzZXJ2YWJsZUlucHV0PFQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDI+LCBPYnNlcnZhYmxlSW5wdXQ8VDM+LCBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCBPYnNlcnZhYmxlSW5wdXQ8VDU+LCBPYnNlcnZhYmxlSW5wdXQ8VDY+XSk6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1LCBUNl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KHNvdXJjZXM6IEFycmF5PE9ic2VydmFibGVJbnB1dDxUPj4pOiBPYnNlcnZhYmxlPFRbXT47XG5cbi8vIGZvcmtKb2luKGEkLCBiJCwgYyQpXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VD4odjE6IE9ic2VydmFibGVJbnB1dDxUPik6IE9ic2VydmFibGU8VFtdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4pOiBPYnNlcnZhYmxlPFtULCBUMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW48VCwgVDIsIFQzLCBUND4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDRdPjtcbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxULCBUMiwgVDMsIFQ0LCBUNT4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0LCBUNV0+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBkZXByZWNhdGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gZm9ya0pvaW4oLi4uYXJnczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT58RnVuY3Rpb24+KTogT2JzZXJ2YWJsZTxhbnk+O1xuZXhwb3J0IGZ1bmN0aW9uIGZvcmtKb2luPFQ+KC4uLnNvdXJjZXM6IE9ic2VydmFibGVJbnB1dDxUPltdKTogT2JzZXJ2YWJsZTxUW10+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBKb2lucyBsYXN0IHZhbHVlcyBlbWl0dGVkIGJ5IHBhc3NlZCBPYnNlcnZhYmxlcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2FpdCBmb3IgT2JzZXJ2YWJsZXMgdG8gY29tcGxldGUgYW5kIHRoZW4gY29tYmluZSBsYXN0IHZhbHVlcyB0aGV5IGVtaXR0ZWQuPC9zcGFuPlxuICpcbiAqICFbXShmb3JrSm9pbi5wbmcpXG4gKlxuICogYGZvcmtKb2luYCBpcyBhbiBvcGVyYXRvciB0aGF0IHRha2VzIGFueSBudW1iZXIgb2YgT2JzZXJ2YWJsZXMgd2hpY2ggY2FuIGJlIHBhc3NlZCBlaXRoZXIgYXMgYW4gYXJyYXlcbiAqIG9yIGRpcmVjdGx5IGFzIGFyZ3VtZW50cy4gSWYgbm8gaW5wdXQgT2JzZXJ2YWJsZXMgYXJlIHByb3ZpZGVkLCByZXN1bHRpbmcgc3RyZWFtIHdpbGwgY29tcGxldGVcbiAqIGltbWVkaWF0ZWx5LlxuICpcbiAqIGBmb3JrSm9pbmAgd2lsbCB3YWl0IGZvciBhbGwgcGFzc2VkIE9ic2VydmFibGVzIHRvIGNvbXBsZXRlIGFuZCB0aGVuIGl0IHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIGxhc3RcbiAqIHZhbHVlcyBmcm9tIGNvcnJlc3BvbmRpbmcgT2JzZXJ2YWJsZXMuIFNvIGlmIHlvdSBwYXNzIGBuYCBPYnNlcnZhYmxlcyB0byB0aGUgb3BlcmF0b3IsIHJlc3VsdGluZ1xuICogYXJyYXkgd2lsbCBoYXZlIGBuYCB2YWx1ZXMsIHdoZXJlIGZpcnN0IHZhbHVlIGlzIHRoZSBsYXN0IHRoaW5nIGVtaXR0ZWQgYnkgdGhlIGZpcnN0IE9ic2VydmFibGUsXG4gKiBzZWNvbmQgdmFsdWUgaXMgdGhlIGxhc3QgdGhpbmcgZW1pdHRlZCBieSB0aGUgc2Vjb25kIE9ic2VydmFibGUgYW5kIHNvIG9uLiBUaGF0IG1lYW5zIGBmb3JrSm9pbmAgd2lsbFxuICogbm90IGVtaXQgbW9yZSB0aGFuIG9uY2UgYW5kIGl0IHdpbGwgY29tcGxldGUgYWZ0ZXIgdGhhdC4gSWYgeW91IG5lZWQgdG8gZW1pdCBjb21iaW5lZCB2YWx1ZXMgbm90IG9ubHlcbiAqIGF0IHRoZSBlbmQgb2YgbGlmZWN5Y2xlIG9mIHBhc3NlZCBPYnNlcnZhYmxlcywgYnV0IGFsc28gdGhyb3VnaG91dCBpdCwgdHJ5IG91dCB7QGxpbmsgY29tYmluZUxhdGVzdH1cbiAqIG9yIHtAbGluayB6aXB9IGluc3RlYWQuXG4gKlxuICogSW4gb3JkZXIgZm9yIHJlc3VsdGluZyBhcnJheSB0byBoYXZlIHRoZSBzYW1lIGxlbmd0aCBhcyB0aGUgbnVtYmVyIG9mIGlucHV0IE9ic2VydmFibGVzLCB3aGVuZXZlciBhbnkgb2ZcbiAqIHRoYXQgT2JzZXJ2YWJsZXMgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgYW55IHZhbHVlLCBgZm9ya0pvaW5gIHdpbGwgY29tcGxldGUgYXQgdGhhdCBtb21lbnQgYXMgd2VsbFxuICogYW5kIGl0IHdpbGwgbm90IGVtaXQgYW55dGhpbmcgZWl0aGVyLCBldmVuIGlmIGl0IGFscmVhZHkgaGFzIHNvbWUgbGFzdCB2YWx1ZXMgZnJvbSBvdGhlciBPYnNlcnZhYmxlcy5cbiAqIENvbnZlcnNlbHksIGlmIHRoZXJlIGlzIGFuIE9ic2VydmFibGUgdGhhdCBuZXZlciBjb21wbGV0ZXMsIGBmb3JrSm9pbmAgd2lsbCBuZXZlciBjb21wbGV0ZSBhcyB3ZWxsLFxuICogdW5sZXNzIGF0IGFueSBwb2ludCBzb21lIG90aGVyIE9ic2VydmFibGUgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgdmFsdWUsIHdoaWNoIGJyaW5ncyB1cyBiYWNrIHRvXG4gKiB0aGUgcHJldmlvdXMgY2FzZS4gT3ZlcmFsbCwgaW4gb3JkZXIgZm9yIGBmb3JrSm9pbmAgdG8gZW1pdCBhIHZhbHVlLCBhbGwgT2JzZXJ2YWJsZXMgcGFzc2VkIGFzIGFyZ3VtZW50c1xuICogaGF2ZSB0byBlbWl0IHNvbWV0aGluZyBhdCBsZWFzdCBvbmNlIGFuZCBjb21wbGV0ZS5cbiAqXG4gKiBJZiBhbnkgaW5wdXQgT2JzZXJ2YWJsZSBlcnJvcnMgYXQgc29tZSBwb2ludCwgYGZvcmtKb2luYCB3aWxsIGVycm9yIGFzIHdlbGwgYW5kIGFsbCBvdGhlciBPYnNlcnZhYmxlc1xuICogd2lsbCBiZSBpbW1lZGlhdGVseSB1bnN1YnNjcmliZWQuXG4gKlxuICogT3B0aW9uYWxseSBgZm9ya0pvaW5gIGFjY2VwdHMgcHJvamVjdCBmdW5jdGlvbiwgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHZhbHVlcyB3aGljaCBub3JtYWxseVxuICogd291bGQgbGFuZCBpbiBlbWl0dGVkIGFycmF5LiBXaGF0ZXZlciBpcyByZXR1cm5lZCBieSBwcm9qZWN0IGZ1bmN0aW9uLCB3aWxsIGFwcGVhciBpbiBvdXRwdXRcbiAqIE9ic2VydmFibGUgaW5zdGVhZC4gVGhpcyBtZWFucyB0aGF0IGRlZmF1bHQgcHJvamVjdCBjYW4gYmUgdGhvdWdodCBvZiBhcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIGFsbCBpdHMgYXJndW1lbnRzIGFuZCBwdXRzIHRoZW0gaW50byBhbiBhcnJheS4gTm90ZSB0aGF0IHByb2plY3QgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb25seVxuICogd2hlbiBvdXRwdXQgT2JzZXJ2YWJsZSBpcyBzdXBwb3NlZCB0byBlbWl0IGEgcmVzdWx0LlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgVXNlIGZvcmtKb2luIHdpdGggb3BlcmF0b3IgZW1pdHRpbmcgaW1tZWRpYXRlbHlcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZvcmtKb2luLCBvZiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgb2YoMSwgMiwgMywgNCksXG4gKiAgIG9mKDUsIDYsIDcsIDgpLFxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBbNCwgOF1cbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIlxuICogYGBgXG4gKlxuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIG9wZXJhdG9yIGVtaXR0aW5nIGFmdGVyIHNvbWUgdGltZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZm9ya0pvaW4sIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9ic2VydmFibGUgPSBmb3JrSm9pbihcbiAqICAgaW50ZXJ2YWwoMTAwMCkucGlwZSh0YWtlKDMpKSwgLy8gZW1pdCAwLCAxLCAyIGV2ZXJ5IHNlY29uZCBhbmQgY29tcGxldGVcbiAqICAgaW50ZXJ2YWwoNTAwKS5waXBlKHRha2UoNCkpLCAgLy8gZW1pdCAwLCAxLCAyLCAzIGV2ZXJ5IGhhbGYgYSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiApO1xuICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhpcyBpcyBob3cgaXQgZW5kcyEnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFsyLCAzXSBhZnRlciAzIHNlY29uZHNcbiAqIC8vIFwiVGhpcyBpcyBob3cgaXQgZW5kcyFcIiBpbW1lZGlhdGVseSBhZnRlclxuICogYGBgXG4gKlxuICogIyMjIFVzZSBmb3JrSm9pbiB3aXRoIHByb2plY3QgZnVuY3Rpb25cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZvcmtKb2luLCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnNlcnZhYmxlID0gZm9ya0pvaW4oXG4gKiAgIGludGVydmFsKDEwMDApLnBpcGUodGFrZSgzKSksIC8vIGVtaXQgMCwgMSwgMiBldmVyeSBzZWNvbmQgYW5kIGNvbXBsZXRlXG4gKiAgIGludGVydmFsKDUwMCkucGlwZSh0YWtlKDQpKSwgIC8vIGVtaXQgMCwgMSwgMiwgMyBldmVyeSBoYWxmIGEgc2Vjb25kIGFuZCBjb21wbGV0ZVxuICogKS5waXBlKFxuICogICBtYXAoKFtuLCBtXSkgPT4gbiArIG0pLFxuICogKTtcbiAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoaXMgaXMgaG93IGl0IGVuZHMhJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyA1IGFmdGVyIDMgc2Vjb25kc1xuICogLy8gXCJUaGlzIGlzIGhvdyBpdCBlbmRzIVwiIGltbWVkaWF0ZWx5IGFmdGVyXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBjb21iaW5lTGF0ZXN0fVxuICogQHNlZSB7QGxpbmsgemlwfVxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZUlucHV0fSBzb3VyY2VzIEFueSBudW1iZXIgb2YgT2JzZXJ2YWJsZXMgcHJvdmlkZWQgZWl0aGVyIGFzIGFuIGFycmF5IG9yIGFzIGFuIGFyZ3VtZW50c1xuICogcGFzc2VkIGRpcmVjdGx5IHRvIHRoZSBvcGVyYXRvci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IFtwcm9qZWN0XSBGdW5jdGlvbiB0aGF0IHRha2VzIHZhbHVlcyBlbWl0dGVkIGJ5IGlucHV0IE9ic2VydmFibGVzIGFuZCByZXR1cm5zIHZhbHVlXG4gKiB0aGF0IHdpbGwgYXBwZWFyIGluIHJlc3VsdGluZyBPYnNlcnZhYmxlIGluc3RlYWQgb2YgZGVmYXVsdCBhcnJheS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IE9ic2VydmFibGUgZW1pdHRpbmcgZWl0aGVyIGFuIGFycmF5IG9mIGxhc3QgdmFsdWVzIGVtaXR0ZWQgYnkgcGFzc2VkIE9ic2VydmFibGVzXG4gKiBvciB2YWx1ZSBmcm9tIHByb2plY3QgZnVuY3Rpb24uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmb3JrSm9pbjxUPihcbiAgLi4uc291cmNlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgT2JzZXJ2YWJsZUlucHV0PFQ+W10gfCBGdW5jdGlvbj5cbik6IE9ic2VydmFibGU8VFtdPiB7XG5cbiAgbGV0IHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbjtcbiAgaWYgKHR5cGVvZiBzb3VyY2VzW3NvdXJjZXMubGVuZ3RoIC0gMV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXN1bHRTZWxlY3RvciA9IHNvdXJjZXMucG9wKCkgYXMgRnVuY3Rpb247XG4gIH1cblxuICAvLyBpZiB0aGUgZmlyc3QgYW5kIG9ubHkgb3RoZXIgYXJndW1lbnQgaXMgYW4gYXJyYXlcbiAgLy8gYXNzdW1lIGl0J3MgYmVlbiBjYWxsZWQgd2l0aCBgZm9ya0pvaW4oW29iczEsIG9iczIsIG9iczNdKWBcbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAxICYmIGlzQXJyYXkoc291cmNlc1swXSkpIHtcbiAgICBzb3VyY2VzID0gc291cmNlc1swXSBhcyBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+O1xuICB9XG5cbiAgaWYgKHNvdXJjZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIEVNUFRZO1xuICB9XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgcmV0dXJuIGZvcmtKb2luKHNvdXJjZXMpLnBpcGUoXG4gICAgICBtYXAoYXJncyA9PiByZXN1bHRTZWxlY3RvciguLi5hcmdzKSlcbiAgICApO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlKHN1YnNjcmliZXIgPT4ge1xuICAgIHJldHVybiBuZXcgRm9ya0pvaW5TdWJzY3JpYmVyKHN1YnNjcmliZXIsIHNvdXJjZXMgYXMgQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+Pik7XG4gIH0pO1xufVxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEZvcmtKb2luU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgY29tcGxldGVkID0gMDtcbiAgcHJpdmF0ZSB2YWx1ZXM6IFRbXTtcbiAgcHJpdmF0ZSBoYXZlVmFsdWVzID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2VzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuXG4gICAgY29uc3QgbGVuID0gc291cmNlcy5sZW5ndGg7XG4gICAgdGhpcy52YWx1ZXMgPSBuZXcgQXJyYXkobGVuKTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnN0IHNvdXJjZSA9IHNvdXJjZXNbaV07XG4gICAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIHNvdXJjZSwgbnVsbCwgaSk7XG5cbiAgICAgIGlmIChpbm5lclN1YnNjcmlwdGlvbikge1xuICAgICAgICB0aGlzLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBhbnksIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIHRoaXMudmFsdWVzW291dGVySW5kZXhdID0gaW5uZXJWYWx1ZTtcbiAgICBpZiAoIShpbm5lclN1YiBhcyBhbnkpLl9oYXNWYWx1ZSkge1xuICAgICAgKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlID0gdHJ1ZTtcbiAgICAgIHRoaXMuaGF2ZVZhbHVlcysrO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgVD4pOiB2b2lkIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uLCBoYXZlVmFsdWVzLCB2YWx1ZXMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gdmFsdWVzLmxlbmd0aDtcblxuICAgIGlmICghKGlubmVyU3ViIGFzIGFueSkuX2hhc1ZhbHVlKSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29tcGxldGVkKys7XG5cbiAgICBpZiAodGhpcy5jb21wbGV0ZWQgIT09IGxlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmIChoYXZlVmFsdWVzID09PSBsZW4pIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWVzKTtcbiAgICB9XG5cbiAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=