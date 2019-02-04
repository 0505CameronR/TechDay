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
/**
 * Compares all values of two observables in sequence using an optional comparor function
 * and returns an observable of a single boolean value representing whether or not the two sequences
 * are equal.
 *
 * <span class="informal">Checks to see of all values emitted by both observables are equal, in order.</span>
 *
 * ![](sequenceEqual.png)
 *
 * `sequenceEqual` subscribes to two observables and buffers incoming values from each observable. Whenever either
 * observable emits a value, the value is buffered and the buffers are shifted and compared from the bottom
 * up; If any value pair doesn't match, the returned observable will emit `false` and complete. If one of the
 * observables completes, the operator will wait for the other observable to complete; If the other
 * observable emits before completing, the returned observable will emit `false` and complete. If one observable never
 * completes or emits after the other complets, the returned observable will never complete.
 *
 * ## Example
 * figure out if the Konami code matches
 * ```javascript
 * const codes = from([
 *   'ArrowUp',
 *   'ArrowUp',
 *   'ArrowDown',
 *   'ArrowDown',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'ArrowLeft',
 *   'ArrowRight',
 *   'KeyB',
 *   'KeyA',
 *   'Enter', // no start key, clearly.
 * ]);
 *
 * const keys = fromEvent(document, 'keyup').pipe(map(e => e.code));
 * const matches = keys.pipe(
 *   bufferCount(11, 1),
 *   mergeMap(
 *     last11 => from(last11).pipe(sequenceEqual(codes)),
 *   ),
 * );
 * matches.subscribe(matched => console.log('Successful cheat at Contra? ', matched));
 * ```
 *
 * @see {@link combineLatest}
 * @see {@link zip}
 * @see {@link withLatestFrom}
 *
 * @param {Observable} compareTo The observable sequence to compare the source sequence to.
 * @param {function} [comparor] An optional function to compare each value pair
 * @return {Observable} An Observable of a single boolean value representing whether or not
 * the values emitted by both observables were equal in sequence.
 * @method sequenceEqual
 * @owner Observable
 */
function sequenceEqual(compareTo, comparor) {
    return function (source) { return source.lift(new SequenceEqualOperator(compareTo, comparor)); };
}
exports.sequenceEqual = sequenceEqual;
var SequenceEqualOperator = /** @class */ (function () {
    function SequenceEqualOperator(compareTo, comparor) {
        this.compareTo = compareTo;
        this.comparor = comparor;
    }
    SequenceEqualOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SequenceEqualSubscriber(subscriber, this.compareTo, this.comparor));
    };
    return SequenceEqualOperator;
}());
exports.SequenceEqualOperator = SequenceEqualOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SequenceEqualSubscriber = /** @class */ (function (_super) {
    __extends(SequenceEqualSubscriber, _super);
    function SequenceEqualSubscriber(destination, compareTo, comparor) {
        var _this = _super.call(this, destination) || this;
        _this.compareTo = compareTo;
        _this.comparor = comparor;
        _this._a = [];
        _this._b = [];
        _this._oneComplete = false;
        _this.destination.add(compareTo.subscribe(new SequenceEqualCompareToSubscriber(destination, _this)));
        return _this;
    }
    SequenceEqualSubscriber.prototype._next = function (value) {
        if (this._oneComplete && this._b.length === 0) {
            this.emit(false);
        }
        else {
            this._a.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype._complete = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
        this.unsubscribe();
    };
    SequenceEqualSubscriber.prototype.checkValues = function () {
        var _c = this, _a = _c._a, _b = _c._b, comparor = _c.comparor;
        while (_a.length > 0 && _b.length > 0) {
            var a = _a.shift();
            var b = _b.shift();
            var areEqual = false;
            if (comparor) {
                areEqual = tryCatch_1.tryCatch(comparor)(a, b);
                if (areEqual === errorObject_1.errorObject) {
                    this.destination.error(errorObject_1.errorObject.e);
                }
            }
            else {
                areEqual = a === b;
            }
            if (!areEqual) {
                this.emit(false);
            }
        }
    };
    SequenceEqualSubscriber.prototype.emit = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
    };
    SequenceEqualSubscriber.prototype.nextB = function (value) {
        if (this._oneComplete && this._a.length === 0) {
            this.emit(false);
        }
        else {
            this._b.push(value);
            this.checkValues();
        }
    };
    SequenceEqualSubscriber.prototype.completeB = function () {
        if (this._oneComplete) {
            this.emit(this._a.length === 0 && this._b.length === 0);
        }
        else {
            this._oneComplete = true;
        }
    };
    return SequenceEqualSubscriber;
}(Subscriber_1.Subscriber));
exports.SequenceEqualSubscriber = SequenceEqualSubscriber;
var SequenceEqualCompareToSubscriber = /** @class */ (function (_super) {
    __extends(SequenceEqualCompareToSubscriber, _super);
    function SequenceEqualCompareToSubscriber(destination, parent) {
        var _this = _super.call(this, destination) || this;
        _this.parent = parent;
        return _this;
    }
    SequenceEqualCompareToSubscriber.prototype._next = function (value) {
        this.parent.nextB(value);
    };
    SequenceEqualCompareToSubscriber.prototype._error = function (err) {
        this.parent.error(err);
        this.unsubscribe();
    };
    SequenceEqualCompareToSubscriber.prototype._complete = function () {
        this.parent.completeB();
        this.unsubscribe();
    };
    return SequenceEqualCompareToSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VxdWVuY2VFcXVhbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zZXF1ZW5jZUVxdWFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQUUzQyw2Q0FBNEM7QUFDNUMsbURBQWtEO0FBSWxEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFERztBQUNILFNBQWdCLGFBQWEsQ0FBSSxTQUF3QixFQUN4QixRQUFrQztJQUNqRSxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxxQkFBcUIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUMsRUFBM0QsQ0FBMkQsQ0FBQztBQUNoRyxDQUFDO0FBSEQsc0NBR0M7QUFFRDtJQUNFLCtCQUFvQixTQUF3QixFQUN4QixRQUFpQztRQURqQyxjQUFTLEdBQVQsU0FBUyxDQUFlO1FBQ3hCLGFBQVEsR0FBUixRQUFRLENBQXlCO0lBQ3JELENBQUM7SUFFRCxvQ0FBSSxHQUFKLFVBQUssVUFBK0IsRUFBRSxNQUFXO1FBQy9DLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHVCQUF1QixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ2xHLENBQUM7SUFDSCw0QkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBUlksc0RBQXFCO0FBVWxDOzs7O0dBSUc7QUFDSDtJQUFtRCwyQ0FBYTtJQUs5RCxpQ0FBWSxXQUF3QixFQUNoQixTQUF3QixFQUN4QixRQUFpQztRQUZyRCxZQUdFLGtCQUFNLFdBQVcsQ0FBQyxT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LENBQUMsRUFBRSxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLEVBQUUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUM7U0FDekQ7YUFBTTtZQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1NBQzFCO0lBQ0gsQ0FBQztJQUNILDhCQUFDO0FBQUQsQ0FBQyxBQXhFRCxDQUFtRCx1QkFBVSxHQXdFNUQ7QUF4RVksMERBQXVCO0FBMEVwQztJQUFxRCxvREFBYTtJQUNoRSwwQ0FBWSxXQUF3QixFQUFVLE1BQXFDO1FBQW5GLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBRjZDLFlBQU0sR0FBTixNQUFNLENBQStCOztJQUVuRixDQUFDO0lBRVMsZ0RBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFUyxpREFBTSxHQUFoQixVQUFpQixHQUFRO1FBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsb0RBQVMsR0FBbkI7UUFDRSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBQ0gsdUNBQUM7QUFBRCxDQUFDLEFBbEJELENBQXFELHVCQUFVLEdBa0I5RCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHRyeUNhdGNoIH0gZnJvbSAnLi4vdXRpbC90cnlDYXRjaCc7XG5pbXBvcnQgeyBlcnJvck9iamVjdCB9IGZyb20gJy4uL3V0aWwvZXJyb3JPYmplY3QnO1xuXG5pbXBvcnQgeyBPYnNlcnZlciwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBDb21wYXJlcyBhbGwgdmFsdWVzIG9mIHR3byBvYnNlcnZhYmxlcyBpbiBzZXF1ZW5jZSB1c2luZyBhbiBvcHRpb25hbCBjb21wYXJvciBmdW5jdGlvblxuICogYW5kIHJldHVybnMgYW4gb2JzZXJ2YWJsZSBvZiBhIHNpbmdsZSBib29sZWFuIHZhbHVlIHJlcHJlc2VudGluZyB3aGV0aGVyIG9yIG5vdCB0aGUgdHdvIHNlcXVlbmNlc1xuICogYXJlIGVxdWFsLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5DaGVja3MgdG8gc2VlIG9mIGFsbCB2YWx1ZXMgZW1pdHRlZCBieSBib3RoIG9ic2VydmFibGVzIGFyZSBlcXVhbCwgaW4gb3JkZXIuPC9zcGFuPlxuICpcbiAqICFbXShzZXF1ZW5jZUVxdWFsLnBuZylcbiAqXG4gKiBgc2VxdWVuY2VFcXVhbGAgc3Vic2NyaWJlcyB0byB0d28gb2JzZXJ2YWJsZXMgYW5kIGJ1ZmZlcnMgaW5jb21pbmcgdmFsdWVzIGZyb20gZWFjaCBvYnNlcnZhYmxlLiBXaGVuZXZlciBlaXRoZXJcbiAqIG9ic2VydmFibGUgZW1pdHMgYSB2YWx1ZSwgdGhlIHZhbHVlIGlzIGJ1ZmZlcmVkIGFuZCB0aGUgYnVmZmVycyBhcmUgc2hpZnRlZCBhbmQgY29tcGFyZWQgZnJvbSB0aGUgYm90dG9tXG4gKiB1cDsgSWYgYW55IHZhbHVlIHBhaXIgZG9lc24ndCBtYXRjaCwgdGhlIHJldHVybmVkIG9ic2VydmFibGUgd2lsbCBlbWl0IGBmYWxzZWAgYW5kIGNvbXBsZXRlLiBJZiBvbmUgb2YgdGhlXG4gKiBvYnNlcnZhYmxlcyBjb21wbGV0ZXMsIHRoZSBvcGVyYXRvciB3aWxsIHdhaXQgZm9yIHRoZSBvdGhlciBvYnNlcnZhYmxlIHRvIGNvbXBsZXRlOyBJZiB0aGUgb3RoZXJcbiAqIG9ic2VydmFibGUgZW1pdHMgYmVmb3JlIGNvbXBsZXRpbmcsIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgZW1pdCBgZmFsc2VgIGFuZCBjb21wbGV0ZS4gSWYgb25lIG9ic2VydmFibGUgbmV2ZXJcbiAqIGNvbXBsZXRlcyBvciBlbWl0cyBhZnRlciB0aGUgb3RoZXIgY29tcGxldHMsIHRoZSByZXR1cm5lZCBvYnNlcnZhYmxlIHdpbGwgbmV2ZXIgY29tcGxldGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogZmlndXJlIG91dCBpZiB0aGUgS29uYW1pIGNvZGUgbWF0Y2hlc1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY29kZXMgPSBmcm9tKFtcbiAqICAgJ0Fycm93VXAnLFxuICogICAnQXJyb3dVcCcsXG4gKiAgICdBcnJvd0Rvd24nLFxuICogICAnQXJyb3dEb3duJyxcbiAqICAgJ0Fycm93TGVmdCcsXG4gKiAgICdBcnJvd1JpZ2h0JyxcbiAqICAgJ0Fycm93TGVmdCcsXG4gKiAgICdBcnJvd1JpZ2h0JyxcbiAqICAgJ0tleUInLFxuICogICAnS2V5QScsXG4gKiAgICdFbnRlcicsIC8vIG5vIHN0YXJ0IGtleSwgY2xlYXJseS5cbiAqIF0pO1xuICpcbiAqIGNvbnN0IGtleXMgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdrZXl1cCcpLnBpcGUobWFwKGUgPT4gZS5jb2RlKSk7XG4gKiBjb25zdCBtYXRjaGVzID0ga2V5cy5waXBlKFxuICogICBidWZmZXJDb3VudCgxMSwgMSksXG4gKiAgIG1lcmdlTWFwKFxuICogICAgIGxhc3QxMSA9PiBmcm9tKGxhc3QxMSkucGlwZShzZXF1ZW5jZUVxdWFsKGNvZGVzKSksXG4gKiAgICksXG4gKiApO1xuICogbWF0Y2hlcy5zdWJzY3JpYmUobWF0Y2hlZCA9PiBjb25zb2xlLmxvZygnU3VjY2Vzc2Z1bCBjaGVhdCBhdCBDb250cmE/ICcsIG1hdGNoZWQpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVMYXRlc3R9XG4gKiBAc2VlIHtAbGluayB6aXB9XG4gKiBAc2VlIHtAbGluayB3aXRoTGF0ZXN0RnJvbX1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IGNvbXBhcmVUbyBUaGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0byBjb21wYXJlIHRoZSBzb3VyY2Ugc2VxdWVuY2UgdG8uXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbY29tcGFyb3JdIEFuIG9wdGlvbmFsIGZ1bmN0aW9uIHRvIGNvbXBhcmUgZWFjaCB2YWx1ZSBwYWlyXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIGEgc2luZ2xlIGJvb2xlYW4gdmFsdWUgcmVwcmVzZW50aW5nIHdoZXRoZXIgb3Igbm90XG4gKiB0aGUgdmFsdWVzIGVtaXR0ZWQgYnkgYm90aCBvYnNlcnZhYmxlcyB3ZXJlIGVxdWFsIGluIHNlcXVlbmNlLlxuICogQG1ldGhvZCBzZXF1ZW5jZUVxdWFsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2VxdWVuY2VFcXVhbDxUPihjb21wYXJlVG86IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21wYXJvcj86IChhOiBULCBiOiBUKSA9PiBib29sZWFuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBib29sZWFuPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2VxdWVuY2VFcXVhbE9wZXJhdG9yKGNvbXBhcmVUbywgY29tcGFyb3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFNlcXVlbmNlRXF1YWxPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIGJvb2xlYW4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb21wYXJlVG86IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29tcGFyb3I6IChhOiBULCBiOiBUKSA9PiBib29sZWFuKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Ym9vbGVhbj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgU2VxdWVuY2VFcXVhbFN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5jb21wYXJlVG8sIHRoaXMuY29tcGFyb3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFNlcXVlbmNlRXF1YWxTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgX2E6IFRbXSA9IFtdO1xuICBwcml2YXRlIF9iOiBUW10gPSBbXTtcbiAgcHJpdmF0ZSBfb25lQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogT2JzZXJ2ZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29tcGFyZVRvOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbXBhcm9yOiAoYTogVCwgYjogVCkgPT4gYm9vbGVhbikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgICAodGhpcy5kZXN0aW5hdGlvbiBhcyBTdWJzY3JpcHRpb24pLmFkZChjb21wYXJlVG8uc3Vic2NyaWJlKG5ldyBTZXF1ZW5jZUVxdWFsQ29tcGFyZVRvU3Vic2NyaWJlcihkZXN0aW5hdGlvbiwgdGhpcykpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSAmJiB0aGlzLl9iLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5lbWl0KGZhbHNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fYS5wdXNoKHZhbHVlKTtcbiAgICAgIHRoaXMuY2hlY2tWYWx1ZXMoKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLl9vbmVDb21wbGV0ZSkge1xuICAgICAgdGhpcy5lbWl0KHRoaXMuX2EubGVuZ3RoID09PSAwICYmIHRoaXMuX2IubGVuZ3RoID09PSAwKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fb25lQ29tcGxldGUgPSB0cnVlO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBjaGVja1ZhbHVlcygpIHtcbiAgICBjb25zdCB7IF9hLCBfYiwgY29tcGFyb3IgfSA9IHRoaXM7XG4gICAgd2hpbGUgKF9hLmxlbmd0aCA+IDAgJiYgX2IubGVuZ3RoID4gMCkge1xuICAgICAgbGV0IGEgPSBfYS5zaGlmdCgpO1xuICAgICAgbGV0IGIgPSBfYi5zaGlmdCgpO1xuICAgICAgbGV0IGFyZUVxdWFsID0gZmFsc2U7XG4gICAgICBpZiAoY29tcGFyb3IpIHtcbiAgICAgICAgYXJlRXF1YWwgPSB0cnlDYXRjaChjb21wYXJvcikoYSwgYik7XG4gICAgICAgIGlmIChhcmVFcXVhbCA9PT0gZXJyb3JPYmplY3QpIHtcbiAgICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBhcmVFcXVhbCA9IGEgPT09IGI7XG4gICAgICB9XG4gICAgICBpZiAoIWFyZUVxdWFsKSB7XG4gICAgICAgIHRoaXMuZW1pdChmYWxzZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZW1pdCh2YWx1ZTogYm9vbGVhbikge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgfVxuXG4gIG5leHRCKHZhbHVlOiBUKSB7XG4gICAgaWYgKHRoaXMuX29uZUNvbXBsZXRlICYmIHRoaXMuX2EubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLmVtaXQoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9iLnB1c2godmFsdWUpO1xuICAgICAgdGhpcy5jaGVja1ZhbHVlcygpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlQigpIHtcbiAgICBpZiAodGhpcy5fb25lQ29tcGxldGUpIHtcbiAgICAgIHRoaXMuZW1pdCh0aGlzLl9hLmxlbmd0aCA9PT0gMCAmJiB0aGlzLl9iLmxlbmd0aCA9PT0gMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX29uZUNvbXBsZXRlID0gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgU2VxdWVuY2VFcXVhbENvbXBhcmVUb1N1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPFI+LCBwcml2YXRlIHBhcmVudDogU2VxdWVuY2VFcXVhbFN1YnNjcmliZXI8VCwgUj4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICB0aGlzLnBhcmVudC5uZXh0Qih2YWx1ZSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQuZXJyb3IoZXJyKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMucGFyZW50LmNvbXBsZXRlQigpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19