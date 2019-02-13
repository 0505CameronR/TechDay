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
var EmptyError_1 = require("../util/EmptyError");
/**
 * Returns an Observable that emits the single item emitted by the source Observable that matches a specified
 * predicate, if that Observable emits one such item. If the source Observable emits more than one such item or no
 * items, notify of an IllegalArgumentException or NoSuchElementException respectively. If the source Observable
 * emits items but none match the specified predicate then `undefined` is emiited.
 *
 * ![](single.png)
 *
 * @throws {EmptyError} Delivers an EmptyError to the Observer's `error`
 * callback if the Observable completes before any `next` notification was sent.
 * @param {Function} predicate - A predicate function to evaluate items emitted by the source Observable.
 * @return {Observable<T>} An Observable that emits the single item emitted by the source Observable that matches
 * the predicate or `undefined` when no items match.
 *
 * @method single
 * @owner Observable
 */
function single(predicate) {
    return function (source) { return source.lift(new SingleOperator(predicate, source)); };
}
exports.single = single;
var SingleOperator = /** @class */ (function () {
    function SingleOperator(predicate, source) {
        this.predicate = predicate;
        this.source = source;
    }
    SingleOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new SingleSubscriber(subscriber, this.predicate, this.source));
    };
    return SingleOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var SingleSubscriber = /** @class */ (function (_super) {
    __extends(SingleSubscriber, _super);
    function SingleSubscriber(destination, predicate, source) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.seenValue = false;
        _this.index = 0;
        return _this;
    }
    SingleSubscriber.prototype.applySingleValue = function (value) {
        if (this.seenValue) {
            this.destination.error('Sequence contains more than one element');
        }
        else {
            this.seenValue = true;
            this.singleValue = value;
        }
    };
    SingleSubscriber.prototype._next = function (value) {
        var index = this.index++;
        if (this.predicate) {
            this.tryNext(value, index);
        }
        else {
            this.applySingleValue(value);
        }
    };
    SingleSubscriber.prototype.tryNext = function (value, index) {
        try {
            if (this.predicate(value, index, this.source)) {
                this.applySingleValue(value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    SingleSubscriber.prototype._complete = function () {
        var destination = this.destination;
        if (this.index > 0) {
            destination.next(this.seenValue ? this.singleValue : undefined);
            destination.complete();
        }
        else {
            destination.error(new EmptyError_1.EmptyError);
        }
    };
    return SingleSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2luZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2luZ2xlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUEyQztBQUMzQyxpREFBZ0Q7QUFJaEQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSCxTQUFnQixNQUFNLENBQUksU0FBdUU7SUFDL0YsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLFNBQVMsRUFBRSxNQUFNLENBQUMsQ0FBQyxFQUFsRCxDQUFrRCxDQUFDO0FBQ3ZGLENBQUM7QUFGRCx3QkFFQztBQUVEO0lBQ0Usd0JBQW9CLFNBQXVFLEVBQ3ZFLE1BQXNCO1FBRHRCLGNBQVMsR0FBVCxTQUFTLENBQThEO1FBQ3ZFLFdBQU0sR0FBTixNQUFNLENBQWdCO0lBQzFDLENBQUM7SUFFRCw2QkFBSSxHQUFKLFVBQUssVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3pGLENBQUM7SUFDSCxxQkFBQztBQUFELENBQUMsQUFSRCxJQVFDO0FBRUQ7Ozs7R0FJRztBQUNIO0lBQWtDLG9DQUFhO0lBSzdDLDBCQUFZLFdBQXdCLEVBQ2hCLFNBQXVFLEVBQ3ZFLE1BQXNCO1FBRjFDLFlBR0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBSG1CLGVBQVMsR0FBVCxTQUFTLENBQThEO1FBQ3ZFLFlBQU0sR0FBTixNQUFNLENBQWdCO1FBTmxDLGVBQVMsR0FBWSxLQUFLLENBQUM7UUFFM0IsV0FBSyxHQUFXLENBQUMsQ0FBQzs7SUFNMUIsQ0FBQztJQUVPLDJDQUFnQixHQUF4QixVQUF5QixLQUFRO1FBQy9CLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyx5Q0FBeUMsQ0FBQyxDQUFDO1NBQ25FO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztZQUN0QixJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztTQUMxQjtJQUNILENBQUM7SUFFUyxnQ0FBSyxHQUFmLFVBQWdCLEtBQVE7UUFDdEIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBRTNCLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzlCO0lBQ0gsQ0FBQztJQUVPLGtDQUFPLEdBQWYsVUFBZ0IsS0FBUSxFQUFFLEtBQWE7UUFDckMsSUFBSTtZQUNGLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtnQkFDN0MsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQzlCO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVTLG9DQUFTLEdBQW5CO1FBQ0UsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUVyQyxJQUFJLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxFQUFFO1lBQ2xCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDaEUsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3hCO2FBQU07WUFDTCxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksdUJBQVUsQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQWxERCxDQUFrQyx1QkFBVSxHQWtEM0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IEVtcHR5RXJyb3IgfSBmcm9tICcuLi91dGlsL0VtcHR5RXJyb3InO1xuXG5pbXBvcnQgeyBPYnNlcnZlciwgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBzaW5nbGUgaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IG1hdGNoZXMgYSBzcGVjaWZpZWRcbiAqIHByZWRpY2F0ZSwgaWYgdGhhdCBPYnNlcnZhYmxlIGVtaXRzIG9uZSBzdWNoIGl0ZW0uIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBtb3JlIHRoYW4gb25lIHN1Y2ggaXRlbSBvciBub1xuICogaXRlbXMsIG5vdGlmeSBvZiBhbiBJbGxlZ2FsQXJndW1lbnRFeGNlcHRpb24gb3IgTm9TdWNoRWxlbWVudEV4Y2VwdGlvbiByZXNwZWN0aXZlbHkuIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogZW1pdHMgaXRlbXMgYnV0IG5vbmUgbWF0Y2ggdGhlIHNwZWNpZmllZCBwcmVkaWNhdGUgdGhlbiBgdW5kZWZpbmVkYCBpcyBlbWlpdGVkLlxuICpcbiAqICFbXShzaW5nbGUucG5nKVxuICpcbiAqIEB0aHJvd3Mge0VtcHR5RXJyb3J9IERlbGl2ZXJzIGFuIEVtcHR5RXJyb3IgdG8gdGhlIE9ic2VydmVyJ3MgYGVycm9yYFxuICogY2FsbGJhY2sgaWYgdGhlIE9ic2VydmFibGUgY29tcGxldGVzIGJlZm9yZSBhbnkgYG5leHRgIG5vdGlmaWNhdGlvbiB3YXMgc2VudC5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHByZWRpY2F0ZSAtIEEgcHJlZGljYXRlIGZ1bmN0aW9uIHRvIGV2YWx1YXRlIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBzaW5nbGUgaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IG1hdGNoZXNcbiAqIHRoZSBwcmVkaWNhdGUgb3IgYHVuZGVmaW5lZGAgd2hlbiBubyBpdGVtcyBtYXRjaC5cbiAqXG4gKiBAbWV0aG9kIHNpbmdsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNpbmdsZTxUPihwcmVkaWNhdGU/OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2luZ2xlT3BlcmF0b3IocHJlZGljYXRlLCBzb3VyY2UpKTtcbn1cblxuY2xhc3MgU2luZ2xlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcHJlZGljYXRlPzogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTaW5nbGVTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJlZGljYXRlLCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTaW5nbGVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgc2VlblZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc2luZ2xlVmFsdWU6IFQ7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByZWRpY2F0ZT86ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZT86IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcml2YXRlIGFwcGx5U2luZ2xlVmFsdWUodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zZWVuVmFsdWUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoJ1NlcXVlbmNlIGNvbnRhaW5zIG1vcmUgdGhhbiBvbmUgZWxlbWVudCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnNlZW5WYWx1ZSA9IHRydWU7XG4gICAgICB0aGlzLnNpbmdsZVZhbHVlID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4Kys7XG5cbiAgICBpZiAodGhpcy5wcmVkaWNhdGUpIHtcbiAgICAgIHRoaXMudHJ5TmV4dCh2YWx1ZSwgaW5kZXgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmFwcGx5U2luZ2xlVmFsdWUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5TmV4dCh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBpZiAodGhpcy5wcmVkaWNhdGUodmFsdWUsIGluZGV4LCB0aGlzLnNvdXJjZSkpIHtcbiAgICAgICAgdGhpcy5hcHBseVNpbmdsZVZhbHVlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGRlc3RpbmF0aW9uID0gdGhpcy5kZXN0aW5hdGlvbjtcblxuICAgIGlmICh0aGlzLmluZGV4ID4gMCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh0aGlzLnNlZW5WYWx1ZSA/IHRoaXMuc2luZ2xlVmFsdWUgOiB1bmRlZmluZWQpO1xuICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdGluYXRpb24uZXJyb3IobmV3IEVtcHR5RXJyb3IpO1xuICAgIH1cbiAgfVxufVxuIl19