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
var subscribeToResult_1 = require("../util/subscribeToResult");
/**
 * Emits the values emitted by the source Observable until a `notifier`
 * Observable emits a value.
 *
 * <span class="informal">Lets values pass until a second Observable,
 * `notifier`, emits a value. Then, it completes.</span>
 *
 * ![](takeUntil.png)
 *
 * `takeUntil` subscribes and begins mirroring the source Observable. It also
 * monitors a second Observable, `notifier` that you provide. If the `notifier`
 * emits a value, the output Observable stops mirroring the source Observable
 * and completes. If the `notifier` doesn't emit any value and completes
 * then `takeUntil` will pass all values.
 *
 * ## Example
 * Tick every second until the first click happens
 * ```javascript
 * const interval = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = interval.pipe(takeUntil(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link take}
 * @see {@link takeLast}
 * @see {@link takeWhile}
 * @see {@link skip}
 *
 * @param {Observable} notifier The Observable whose first emitted value will
 * cause the output Observable of `takeUntil` to stop emitting values from the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the values from the source
 * Observable until such time as `notifier` emits its first value.
 * @method takeUntil
 * @owner Observable
 */
function takeUntil(notifier) {
    return function (source) { return source.lift(new TakeUntilOperator(notifier)); };
}
exports.takeUntil = takeUntil;
var TakeUntilOperator = /** @class */ (function () {
    function TakeUntilOperator(notifier) {
        this.notifier = notifier;
    }
    TakeUntilOperator.prototype.call = function (subscriber, source) {
        var takeUntilSubscriber = new TakeUntilSubscriber(subscriber);
        var notifierSubscription = subscribeToResult_1.subscribeToResult(takeUntilSubscriber, this.notifier);
        if (notifierSubscription && !takeUntilSubscriber.seenValue) {
            takeUntilSubscriber.add(notifierSubscription);
            return source.subscribe(takeUntilSubscriber);
        }
        return takeUntilSubscriber;
    };
    return TakeUntilOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var TakeUntilSubscriber = /** @class */ (function (_super) {
    __extends(TakeUntilSubscriber, _super);
    function TakeUntilSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.seenValue = false;
        return _this;
    }
    TakeUntilSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.seenValue = true;
        this.complete();
    };
    TakeUntilSubscriber.prototype.notifyComplete = function () {
        // noop
    };
    return TakeUntilSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFrZVVudGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGFrZVVudGlsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUlBLHNEQUFxRDtBQUVyRCwrREFBOEQ7QUFJOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW9DRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxRQUF5QjtJQUNwRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUE1QyxDQUE0QyxDQUFDO0FBQ2pGLENBQUM7QUFGRCw4QkFFQztBQUVEO0lBQ0UsMkJBQW9CLFFBQXlCO1FBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO0lBQzdDLENBQUM7SUFFRCxnQ0FBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxtQkFBbUIsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUNoRSxJQUFNLG9CQUFvQixHQUFHLHFDQUFpQixDQUFDLG1CQUFtQixFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNuRixJQUFJLG9CQUFvQixJQUFJLENBQUMsbUJBQW1CLENBQUMsU0FBUyxFQUFFO1lBQzFELG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDO1lBQzlDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1NBQzlDO1FBQ0QsT0FBTyxtQkFBbUIsQ0FBQztJQUM3QixDQUFDO0lBQ0gsd0JBQUM7QUFBRCxDQUFDLEFBYkQsSUFhQztBQUVEOzs7O0dBSUc7QUFDSDtJQUF3Qyx1Q0FBcUI7SUFHM0QsNkJBQVksV0FBNEI7UUFBeEMsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FDbkI7UUFKRCxlQUFTLEdBQUcsS0FBSyxDQUFDOztJQUlsQixDQUFDO0lBRUQsd0NBQVUsR0FBVixVQUFXLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDdEIsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCw0Q0FBYyxHQUFkO1FBQ0UsT0FBTztJQUNULENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFqQkQsQ0FBd0MsaUNBQWUsR0FpQnREIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcblxuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIHRoZSB2YWx1ZXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgdW50aWwgYSBgbm90aWZpZXJgXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxldHMgdmFsdWVzIHBhc3MgdW50aWwgYSBzZWNvbmQgT2JzZXJ2YWJsZSxcbiAqIGBub3RpZmllcmAsIGVtaXRzIGEgdmFsdWUuIFRoZW4sIGl0IGNvbXBsZXRlcy48L3NwYW4+XG4gKlxuICogIVtdKHRha2VVbnRpbC5wbmcpXG4gKlxuICogYHRha2VVbnRpbGAgc3Vic2NyaWJlcyBhbmQgYmVnaW5zIG1pcnJvcmluZyB0aGUgc291cmNlIE9ic2VydmFibGUuIEl0IGFsc29cbiAqIG1vbml0b3JzIGEgc2Vjb25kIE9ic2VydmFibGUsIGBub3RpZmllcmAgdGhhdCB5b3UgcHJvdmlkZS4gSWYgdGhlIGBub3RpZmllcmBcbiAqIGVtaXRzIGEgdmFsdWUsIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBzdG9wcyBtaXJyb3JpbmcgdGhlIHNvdXJjZSBPYnNlcnZhYmxlXG4gKiBhbmQgY29tcGxldGVzLiBJZiB0aGUgYG5vdGlmaWVyYCBkb2Vzbid0IGVtaXQgYW55IHZhbHVlIGFuZCBjb21wbGV0ZXNcbiAqIHRoZW4gYHRha2VVbnRpbGAgd2lsbCBwYXNzIGFsbCB2YWx1ZXMuXG4gKlxuICogIyMgRXhhbXBsZVxuICogVGljayBldmVyeSBzZWNvbmQgdW50aWwgdGhlIGZpcnN0IGNsaWNrIGhhcHBlbnNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGludGVydmFsID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gaW50ZXJ2YWwucGlwZSh0YWtlVW50aWwoY2xpY2tzKSk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqIEBzZWUge0BsaW5rIHRha2VMYXN0fVxuICogQHNlZSB7QGxpbmsgdGFrZVdoaWxlfVxuICogQHNlZSB7QGxpbmsgc2tpcH1cbiAqXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IG5vdGlmaWVyIFRoZSBPYnNlcnZhYmxlIHdob3NlIGZpcnN0IGVtaXR0ZWQgdmFsdWUgd2lsbFxuICogY2F1c2UgdGhlIG91dHB1dCBPYnNlcnZhYmxlIG9mIGB0YWtlVW50aWxgIHRvIHN0b3AgZW1pdHRpbmcgdmFsdWVzIGZyb20gdGhlXG4gKiBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgdmFsdWVzIGZyb20gdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSB1bnRpbCBzdWNoIHRpbWUgYXMgYG5vdGlmaWVyYCBlbWl0cyBpdHMgZmlyc3QgdmFsdWUuXG4gKiBAbWV0aG9kIHRha2VVbnRpbFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRha2VVbnRpbDxUPihub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBUYWtlVW50aWxPcGVyYXRvcihub3RpZmllcikpO1xufVxuXG5jbGFzcyBUYWtlVW50aWxPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBub3RpZmllcjogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgdGFrZVVudGlsU3Vic2NyaWJlciA9IG5ldyBUYWtlVW50aWxTdWJzY3JpYmVyKHN1YnNjcmliZXIpO1xuICAgIGNvbnN0IG5vdGlmaWVyU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGFrZVVudGlsU3Vic2NyaWJlciwgdGhpcy5ub3RpZmllcik7XG4gICAgaWYgKG5vdGlmaWVyU3Vic2NyaXB0aW9uICYmICF0YWtlVW50aWxTdWJzY3JpYmVyLnNlZW5WYWx1ZSkge1xuICAgICAgdGFrZVVudGlsU3Vic2NyaWJlci5hZGQobm90aWZpZXJTdWJzY3JpcHRpb24pO1xuICAgICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUodGFrZVVudGlsU3Vic2NyaWJlcik7XG4gICAgfVxuICAgIHJldHVybiB0YWtlVW50aWxTdWJzY3JpYmVyO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUYWtlVW50aWxTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcbiAgc2VlblZhbHVlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PiwgKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLnNlZW5WYWx1ZSA9IHRydWU7XG4gICAgdGhpcy5jb21wbGV0ZSgpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKTogdm9pZCB7XG4gICAgLy8gbm9vcFxuICB9XG59XG4iXX0=