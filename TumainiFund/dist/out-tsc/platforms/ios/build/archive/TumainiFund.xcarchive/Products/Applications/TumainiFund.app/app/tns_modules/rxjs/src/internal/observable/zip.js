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
var fromArray_1 = require("./fromArray");
var isArray_1 = require("../util/isArray");
var Subscriber_1 = require("../Subscriber");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
var iterator_1 = require("../../internal/symbol/iterator");
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are calculated from the values, in order, of each
 * of its input Observables.
 *
 * If the latest parameter is a function, this function is used to compute the created value from the input values.
 * Otherwise, an array of the input values is returned.
 *
 * ## Example
 * Combine age and name from different sources
 * ```javascript
 * let age$ = of<number>(27, 25, 29);
 * let name$ = of<string>('Foo', 'Bar', 'Beer');
 * let isDev$ = of<boolean>(true, true, false);
 *
 * zip(age$, name$, isDev$).pipe(
 *   map((age: number, name: string, isDev: boolean) => ({ age, name, isDev })),
 * )
 * .subscribe(x => console.log(x));
 *
 * // outputs
 * // { age: 27, name: 'Foo', isDev: true }
 * // { age: 25, name: 'Bar', isDev: true }
 * // { age: 29, name: 'Beer', isDev: false }
 * ```
 * @param observables
 * @return {Observable<R>}
 * @static true
 * @name zip
 * @owner Observable
 */
function zip() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    var resultSelector = observables[observables.length - 1];
    if (typeof resultSelector === 'function') {
        observables.pop();
    }
    return fromArray_1.fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
}
exports.zip = zip;
var ZipOperator = /** @class */ (function () {
    function ZipOperator(resultSelector) {
        this.resultSelector = resultSelector;
    }
    ZipOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
    };
    return ZipOperator;
}());
exports.ZipOperator = ZipOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipSubscriber = /** @class */ (function (_super) {
    __extends(ZipSubscriber, _super);
    function ZipSubscriber(destination, resultSelector, values) {
        if (values === void 0) { values = Object.create(null); }
        var _this = _super.call(this, destination) || this;
        _this.iterators = [];
        _this.active = 0;
        _this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
        _this.values = values;
        return _this;
    }
    ZipSubscriber.prototype._next = function (value) {
        var iterators = this.iterators;
        if (isArray_1.isArray(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[iterator_1.iterator] === 'function') {
            iterators.push(new StaticIterator(value[iterator_1.iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    };
    ZipSubscriber.prototype._complete = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        this.unsubscribe();
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                var destination = this.destination;
                destination.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--; // not an observable
            }
        }
    };
    ZipSubscriber.prototype.notifyInactive = function () {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    };
    ZipSubscriber.prototype.checkIterators = function () {
        var iterators = this.iterators;
        var len = iterators.length;
        var destination = this.destination;
        // abort if not all of them have values
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        var shouldComplete = false;
        var args = [];
        for (var i = 0; i < len; i++) {
            var iterator = iterators[i];
            var result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    };
    ZipSubscriber.prototype._tryresultSelector = function (args) {
        var result;
        try {
            result = this.resultSelector.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    };
    return ZipSubscriber;
}(Subscriber_1.Subscriber));
exports.ZipSubscriber = ZipSubscriber;
var StaticIterator = /** @class */ (function () {
    function StaticIterator(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    StaticIterator.prototype.hasValue = function () {
        return true;
    };
    StaticIterator.prototype.next = function () {
        var result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    };
    StaticIterator.prototype.hasCompleted = function () {
        var nextResult = this.nextResult;
        return nextResult && nextResult.done;
    };
    return StaticIterator;
}());
var StaticArrayIterator = /** @class */ (function () {
    function StaticArrayIterator(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    StaticArrayIterator.prototype[iterator_1.iterator] = function () {
        return this;
    };
    StaticArrayIterator.prototype.next = function (value) {
        var i = this.index++;
        var array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    };
    StaticArrayIterator.prototype.hasValue = function () {
        return this.array.length > this.index;
    };
    StaticArrayIterator.prototype.hasCompleted = function () {
        return this.array.length === this.index;
    };
    return StaticArrayIterator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ZipBufferIterator = /** @class */ (function (_super) {
    __extends(ZipBufferIterator, _super);
    function ZipBufferIterator(destination, parent, observable) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        _this.observable = observable;
        _this.stillUnsubscribed = true;
        _this.buffer = [];
        _this.isComplete = false;
        return _this;
    }
    ZipBufferIterator.prototype[iterator_1.iterator] = function () {
        return this;
    };
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    ZipBufferIterator.prototype.next = function () {
        var buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    };
    ZipBufferIterator.prototype.hasValue = function () {
        return this.buffer.length > 0;
    };
    ZipBufferIterator.prototype.hasCompleted = function () {
        return this.buffer.length === 0 && this.isComplete;
    };
    ZipBufferIterator.prototype.notifyComplete = function () {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    };
    ZipBufferIterator.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    };
    ZipBufferIterator.prototype.subscribe = function (value, index) {
        return subscribeToResult_1.subscribeToResult(this, this.observable, this, index);
    };
    return ZipBufferIterator;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3ppcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSx5Q0FBd0M7QUFDeEMsMkNBQTBDO0FBRzFDLDRDQUEyQztBQUUzQyxzREFBcUQ7QUFFckQsK0RBQThEO0FBQzlELDJEQUE2RTtBQWdDN0UsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTZCRztBQUNILFNBQWdCLEdBQUc7SUFBTyxxQkFBNEU7U0FBNUUsVUFBNEUsRUFBNUUscUJBQTRFLEVBQTVFLElBQTRFO1FBQTVFLGdDQUE0RTs7SUFDcEcsSUFBTSxjQUFjLEdBQWdDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLElBQUksT0FBTyxjQUFjLEtBQUssVUFBVSxFQUFFO1FBQ3hDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNuQjtJQUNELE9BQU8scUJBQVMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksV0FBVyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7QUFDakYsQ0FBQztBQU5ELGtCQU1DO0FBRUQ7SUFJRSxxQkFBWSxjQUE2QztRQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsMEJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxhQUFhLENBQUMs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QUFVLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFyREQsQ0FBc0MsaUNBQWUsR0FxRHBEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgUGFydGlhbE9ic2VydmVyIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IGl0ZXJhdG9yIGFzIFN5bWJvbF9pdGVyYXRvciB9IGZyb20gJy4uLy4uL2ludGVybmFsL3N5bWJvbC9pdGVyYXRvcic7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCkgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMikgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VCwgVDIsIFQzLCBUNCwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCkgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNSwgUj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHJlc3VsdFNlbGVjdG9yOiAodjE6IFQsIHYyOiBUMiwgdjM6IFQzLCB2NDogVDQsIHY1OiBUNSkgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBUMiwgVDMsIFQ0LCBUNSwgVDYsIFI+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4sIHY1OiBPYnNlcnZhYmxlSW5wdXQ8VDU+LCB2NjogT2JzZXJ2YWJsZUlucHV0PFQ2PiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogVCwgdjI6IFQyLCB2MzogVDMsIHY0OiBUNCwgdjU6IFQ1LCB2NjogVDYpID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyPih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPik6IE9ic2VydmFibGU8W1QsIFQyXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMz4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQ+KHYxOiBPYnNlcnZhYmxlSW5wdXQ8VD4sIHYyOiBPYnNlcnZhYmxlSW5wdXQ8VDI+LCB2MzogT2JzZXJ2YWJsZUlucHV0PFQzPiwgdjQ6IE9ic2VydmFibGVJbnB1dDxUND4pOiBPYnNlcnZhYmxlPFtULCBUMiwgVDMsIFQ0XT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1Pih2MTogT2JzZXJ2YWJsZUlucHV0PFQ+LCB2MjogT2JzZXJ2YWJsZUlucHV0PFQyPiwgdjM6IE9ic2VydmFibGVJbnB1dDxUMz4sIHY0OiBPYnNlcnZhYmxlSW5wdXQ8VDQ+LCB2NTogT2JzZXJ2YWJsZUlucHV0PFQ1Pik6IE9ic2VydmFibGU8W1QsIFQyLCBUMywgVDQsIFQ1XT47XG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFQyLCBUMywgVDQsIFQ1LCBUNj4odjE6IE9ic2VydmFibGVJbnB1dDxUPiwgdjI6IE9ic2VydmFibGVJbnB1dDxUMj4sIHYzOiBPYnNlcnZhYmxlSW5wdXQ8VDM+LCB2NDogT2JzZXJ2YWJsZUlucHV0PFQ0PiwgdjU6IE9ic2VydmFibGVJbnB1dDxUNT4sIHY2OiBPYnNlcnZhYmxlSW5wdXQ8VDY+KTogT2JzZXJ2YWJsZTxbVCwgVDIsIFQzLCBUNCwgVDUsIFQ2XT47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8VD4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxUPltdKTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSk6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PFQ+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxUPikgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxSPihhcnJheTogT2JzZXJ2YWJsZUlucHV0PGFueT5bXSwgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuXG5leHBvcnQgZnVuY3Rpb24gemlwPFQ+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8VD4+KTogT2JzZXJ2YWJsZTxUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxULCBSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PFQ+IHwgKCguLi52YWx1ZXM6IEFycmF5PFQ+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxSPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZUlucHV0PGFueT4gfCAoKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUik+KTogT2JzZXJ2YWJsZTxSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQ29tYmluZXMgbXVsdGlwbGUgT2JzZXJ2YWJsZXMgdG8gY3JlYXRlIGFuIE9ic2VydmFibGUgd2hvc2UgdmFsdWVzIGFyZSBjYWxjdWxhdGVkIGZyb20gdGhlIHZhbHVlcywgaW4gb3JkZXIsIG9mIGVhY2hcbiAqIG9mIGl0cyBpbnB1dCBPYnNlcnZhYmxlcy5cbiAqXG4gKiBJZiB0aGUgbGF0ZXN0IHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uLCB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY29tcHV0ZSB0aGUgY3JlYXRlZCB2YWx1ZSBmcm9tIHRoZSBpbnB1dCB2YWx1ZXMuXG4gKiBPdGhlcndpc2UsIGFuIGFycmF5IG9mIHRoZSBpbnB1dCB2YWx1ZXMgaXMgcmV0dXJuZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29tYmluZSBhZ2UgYW5kIG5hbWUgZnJvbSBkaWZmZXJlbnQgc291cmNlc1xuICogYGBgamF2YXNjcmlwdFxuICogbGV0IGFnZSQgPSBvZjxudW1iZXI+KDI3LCAyNSwgMjkpO1xuICogbGV0IG5hbWUkID0gb2Y8c3RyaW5nPignRm9vJywgJ0JhcicsICdCZWVyJyk7XG4gKiBsZXQgaXNEZXYkID0gb2Y8Ym9vbGVhbj4odHJ1ZSwgdHJ1ZSwgZmFsc2UpO1xuICpcbiAqIHppcChhZ2UkLCBuYW1lJCwgaXNEZXYkKS5waXBlKFxuICogICBtYXAoKGFnZTogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIGlzRGV2OiBib29sZWFuKSA9PiAoeyBhZ2UsIG5hbWUsIGlzRGV2IH0pKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gb3V0cHV0c1xuICogLy8geyBhZ2U6IDI3LCBuYW1lOiAnRm9vJywgaXNEZXY6IHRydWUgfVxuICogLy8geyBhZ2U6IDI1LCBuYW1lOiAnQmFyJywgaXNEZXY6IHRydWUgfVxuICogLy8geyBhZ2U6IDI5LCBuYW1lOiAnQmVlcicsIGlzRGV2OiBmYWxzZSB9XG4gKiBgYGBcbiAqIEBwYXJhbSBvYnNlcnZhYmxlc1xuICogQHJldHVybiB7T2JzZXJ2YWJsZTxSPn1cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgemlwXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gemlwPFQsIFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgY29uc3QgcmVzdWx0U2VsZWN0b3IgPSA8KCguLi55czogQXJyYXk8YW55PikgPT4gUik+IG9ic2VydmFibGVzW29ic2VydmFibGVzLmxlbmd0aCAtIDFdO1xuICBpZiAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSB7XG4gICAgb2JzZXJ2YWJsZXMucG9wKCk7XG4gIH1cbiAgcmV0dXJuIGZyb21BcnJheShvYnNlcnZhYmxlcywgdW5kZWZpbmVkKS5saWZ0KG5ldyBaaXBPcGVyYXRvcihyZXN1bHRTZWxlY3RvcikpO1xufVxuXG5leHBvcnQgY2xhc3MgWmlwT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG5cbiAgcmVzdWx0U2VsZWN0b3I6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFI7XG5cbiAgY29uc3RydWN0b3IocmVzdWx0U2VsZWN0b3I/OiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKSB7XG4gICAgdGhpcy5yZXN1bHRTZWxlY3RvciA9IHJlc3VsdFNlbGVjdG9yO1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFppcFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5yZXN1bHRTZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgWmlwU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIHZhbHVlczogYW55O1xuICBwcml2YXRlIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSO1xuICBwcml2YXRlIGl0ZXJhdG9yczogTG9va0FoZWFkSXRlcmF0b3I8YW55PltdID0gW107XG4gIHByaXZhdGUgYWN0aXZlID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPixcbiAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I/OiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSLFxuICAgICAgICAgICAgICB2YWx1ZXM6IGFueSA9IE9iamVjdC5jcmVhdGUobnVsbCkpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5yZXN1bHRTZWxlY3RvciA9ICh0eXBlb2YgcmVzdWx0U2VsZWN0b3IgPT09ICdmdW5jdGlvbicpID8gcmVzdWx0U2VsZWN0b3IgOiBudWxsO1xuICAgIHRoaXMudmFsdWVzID0gdmFsdWVzO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBhbnkpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSB0aGlzLml0ZXJhdG9ycztcbiAgICBpZiAoaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBTdGF0aWNBcnJheUl0ZXJhdG9yKHZhbHVlKSk7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWVbU3ltYm9sX2l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFN0YXRpY0l0ZXJhdG9yKHZhbHVlW1N5bWJvbF9pdGVyYXRvcl0oKSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgWmlwQnVmZmVySXRlcmF0b3IodGhpcy5kZXN0aW5hdGlvbiwgdGhpcywgdmFsdWUpKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGNvbnN0IGxlbiA9IGl0ZXJhdG9ycy5sZW5ndGg7XG5cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG5cbiAgICBpZiAobGVuID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5hY3RpdmUgPSBsZW47XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGl0ZXJhdG9yOiBaaXBCdWZmZXJJdGVyYXRvcjxhbnksIGFueT4gPSA8YW55Pml0ZXJhdG9yc1tpXTtcbiAgICAgIGlmIChpdGVyYXRvci5zdGlsbFVuc3Vic2NyaWJlZCkge1xuICAgICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb24gYXMgU3Vic2NyaXB0aW9uO1xuICAgICAgICBkZXN0aW5hdGlvbi5hZGQoaXRlcmF0b3Iuc3Vic2NyaWJlKGl0ZXJhdG9yLCBpKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmFjdGl2ZS0tOyAvLyBub3QgYW4gb2JzZXJ2YWJsZVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUluYWN0aXZlKCkge1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgaWYgKHRoaXMuYWN0aXZlID09PSAwKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgY2hlY2tJdGVyYXRvcnMoKSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgY29uc3QgbGVuID0gaXRlcmF0b3JzLmxlbmd0aDtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICAvLyBhYm9ydCBpZiBub3QgYWxsIG9mIHRoZW0gaGF2ZSB2YWx1ZXNcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3IgPSBpdGVyYXRvcnNbaV07XG4gICAgICBpZiAodHlwZW9mIGl0ZXJhdG9yLmhhc1ZhbHVlID09PSAnZnVuY3Rpb24nICYmICFpdGVyYXRvci5oYXNWYWx1ZSgpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc2hvdWxkQ29tcGxldGUgPSBmYWxzZTtcbiAgICBjb25zdCBhcmdzOiBhbnlbXSA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvciA9IGl0ZXJhdG9yc1tpXTtcbiAgICAgIGxldCByZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG5cbiAgICAgIC8vIGNoZWNrIHRvIHNlZSBpZiBpdCdzIGNvbXBsZXRlZCBub3cgdGhhdCB5b3UndmUgZ290dGVuXG4gICAgICAvLyB0aGUgbmV4dCB2YWx1ZS5cbiAgICAgIGlmIChpdGVyYXRvci5oYXNDb21wbGV0ZWQoKSkge1xuICAgICAgICBzaG91bGRDb21wbGV0ZSA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXN1bHQuZG9uZSkge1xuICAgICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFyZ3MucHVzaChyZXN1bHQudmFsdWUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnJlc3VsdFNlbGVjdG9yKSB7XG4gICAgICB0aGlzLl90cnlyZXN1bHRTZWxlY3RvcihhcmdzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdGluYXRpb24ubmV4dChhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAoc2hvdWxkQ29tcGxldGUpIHtcbiAgICAgIGRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF90cnlyZXN1bHRTZWxlY3RvcihhcmdzOiBhbnlbXSkge1xuICAgIGxldCByZXN1bHQ6IGFueTtcbiAgICB0cnkge1xuICAgICAgcmVzdWx0ID0gdGhpcy5yZXN1bHRTZWxlY3Rvci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cblxuaW50ZXJmYWNlIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IGV4dGVuZHMgSXRlcmF0b3I8VD4ge1xuICBoYXNWYWx1ZSgpOiBib29sZWFuO1xuICBoYXNDb21wbGV0ZWQoKTogYm9vbGVhbjtcbn1cblxuY2xhc3MgU3RhdGljSXRlcmF0b3I8VD4gaW1wbGVtZW50cyBMb29rQWhlYWRJdGVyYXRvcjxUPiB7XG4gIHByaXZhdGUgbmV4dFJlc3VsdDogSXRlcmF0b3JSZXN1bHQ8VD47XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBpdGVyYXRvcjogSXRlcmF0b3I8VD4pIHtcbiAgICB0aGlzLm5leHRSZXN1bHQgPSBpdGVyYXRvci5uZXh0KCk7XG4gIH1cblxuICBoYXNWYWx1ZSgpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMubmV4dFJlc3VsdDtcbiAgICB0aGlzLm5leHRSZXN1bHQgPSB0aGlzLml0ZXJhdG9yLm5leHQoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIGNvbnN0IG5leHRSZXN1bHQgPSB0aGlzLm5leHRSZXN1bHQ7XG4gICAgcmV0dXJuIG5leHRSZXN1bHQgJiYgbmV4dFJlc3VsdC5kb25lO1xuICB9XG59XG5cbmNsYXNzIFN0YXRpY0FycmF5SXRlcmF0b3I8VD4gaW1wbGVtZW50cyBMb29rQWhlYWRJdGVyYXRvcjxUPiB7XG4gIHByaXZhdGUgaW5kZXggPSAwO1xuICBwcml2YXRlIGxlbmd0aCA9IDA7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhcnJheTogVFtdKSB7XG4gICAgdGhpcy5sZW5ndGggPSBhcnJheS5sZW5ndGg7XG4gIH1cblxuICBbU3ltYm9sX2l0ZXJhdG9yXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIG5leHQodmFsdWU/OiBhbnkpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgY29uc3QgaSA9IHRoaXMuaW5kZXgrKztcbiAgICBjb25zdCBhcnJheSA9IHRoaXMuYXJyYXk7XG4gICAgcmV0dXJuIGkgPCB0aGlzLmxlbmd0aCA/IHsgdmFsdWU6IGFycmF5W2ldLCBkb25lOiBmYWxzZSB9IDogeyB2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZSB9O1xuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoID4gdGhpcy5pbmRleDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5sZW5ndGggPT09IHRoaXMuaW5kZXg7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFppcEJ1ZmZlckl0ZXJhdG9yPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBzdGlsbFVuc3Vic2NyaWJlZCA9IHRydWU7XG4gIGJ1ZmZlcjogVFtdID0gW107XG4gIGlzQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogUGFydGlhbE9ic2VydmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHBhcmVudDogWmlwU3Vic2NyaWJlcjxULCBSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgW1N5bWJvbF9pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBOT1RFOiB0aGVyZSBpcyBhY3R1YWxseSBhIG5hbWUgY29sbGlzaW9uIGhlcmUgd2l0aCBTdWJzY3JpYmVyLm5leHQgYW5kIEl0ZXJhdG9yLm5leHRcbiAgLy8gICAgdGhpcyBpcyBsZWdpdCBiZWNhdXNlIGBuZXh0KClgIHdpbGwgbmV2ZXIgYmUgY2FsbGVkIGJ5IGEgc3Vic2NyaXB0aW9uIGluIHRoaXMgY2FzZS5cbiAgbmV4dCgpOiBJdGVyYXRvclJlc3VsdDxUPiB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0NvbXBsZXRlKSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogbnVsbCwgZG9uZTogdHJ1ZSB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4geyB2YWx1ZTogYnVmZmVyLnNoaWZ0KCksIGRvbmU6IGZhbHNlIH07XG4gICAgfVxuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA+IDA7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYnVmZmVyLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmlzQ29tcGxldGU7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZSgpIHtcbiAgICBpZiAodGhpcy5idWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgIHRoaXMucGFyZW50Lm5vdGlmeUluYWN0aXZlKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFI+KTogdm9pZCB7XG4gICAgdGhpcy5idWZmZXIucHVzaChpbm5lclZhbHVlKTtcbiAgICB0aGlzLnBhcmVudC5jaGVja0l0ZXJhdG9ycygpO1xuICB9XG5cbiAgc3Vic2NyaWJlKHZhbHVlOiBhbnksIGluZGV4OiBudW1iZXIpIHtcbiAgICByZXR1cm4gc3Vic2NyaWJlVG9SZXN1bHQ8YW55LCBhbnk+KHRoaXMsIHRoaXMub2JzZXJ2YWJsZSwgdGhpcywgaW5kZXgpO1xuICB9XG59XG4iXX0=