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
var isArray_1 = require("../util/isArray");
var fromArray_1 = require("./fromArray");
var OuterSubscriber_1 = require("../OuterSubscriber");
var subscribeToResult_1 = require("../util/subscribeToResult");
function race() {
    var observables = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        observables[_i] = arguments[_i];
    }
    // if the only argument is an array, it was most likely called with
    // `race([obs1, obs2, ...])`
    if (observables.length === 1) {
        if (isArray_1.isArray(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return fromArray_1.fromArray(observables, undefined).lift(new RaceOperator());
}
exports.race = race;
var RaceOperator = /** @class */ (function () {
    function RaceOperator() {
    }
    RaceOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    };
    return RaceOperator;
}());
exports.RaceOperator = RaceOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var RaceSubscriber = /** @class */ (function (_super) {
    __extends(RaceSubscriber, _super);
    function RaceSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.hasFirst = false;
        _this.observables = [];
        _this.subscriptions = [];
        return _this;
    }
    RaceSubscriber.prototype._next = function (observable) {
        this.observables.push(observable);
    };
    RaceSubscriber.prototype._complete = function () {
        var observables = this.observables;
        var len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (var i = 0; i < len && !this.hasFirst; i++) {
                var observable = observables[i];
                var subscription = subscribeToResult_1.subscribeToResult(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    };
    RaceSubscriber.prototype.notifyNext = function (outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (var i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    var subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    };
    return RaceSubscriber;
}(OuterSubscriber_1.OuterSubscriber));
exports.RaceSubscriber = RaceSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9yYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUNBLDJDQUEwQztBQUMxQyx5Q0FBd0M7QUFLeEMsc0RBQXFEO0FBRXJELCtEQUE4RDtBQStCOUQsU0FBZ0IsSUFBSTtJQUFJLHFCQUErRDtTQUEvRCxVQUErRCxFQUEvRCxxQkFBK0QsRUFBL0QsSUFBK0Q7UUFBL0QsZ0NBQStEOztJQUNyRixtRUFBbUU7SUFDbkUsNEJBQTRCO0lBQzVCLElBQUksV0FBVyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDNUIsSUFBSSxpQkFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLFdBQVcsR0FBMkIsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3REO2FBQU07WUFDTCxPQUF3QixXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDeEM7S0FDRjtJQUVELE9BQU8scUJBQVMsQ0FBQyxXQUFXLEVBQUUsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxFQUFLLENBQUMsQ0FBQztBQUN2RSxDQUFDO0FBWkQsb0JBWUM7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUhDLDJCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksY0FBYyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDMUQsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQUpELElBSUM7QUFKWSxvQ0FBWTtBQU16Qjs7OztHQUlHO0FBQ0g7SUFBdUMsa0NBQXFCO0lBSzFELHdCQUFZLFdBQTBCO1FBQXRDLFlBQ0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBTk8sY0FBUSxHQUFZLEtBQUssQ0FBQztRQUMxQixpQkFBVyxHQUFzQixFQUFFLENBQUM7UUFDcEMsbUJBQWEsR0FBbUIsRUFBRSxDQUFDOztJQUkzQyxDQUFDO0lBRVMsOEJBQUssR0FBZixVQUFnQixVQUFlO1FBQzdCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFUyxrQ0FBUyxHQUFuQjtRQUNFLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDckMsSUFBTSxHQUFHLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUvQixJQUFJLEdBQUcsS0FBSyxDQUFDLEVBQUU7WUFDYixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO2FBQU07WUFDTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDOUMsSUFBSSxVQUFVLEdBQUcsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNoQyxJQUFJLFlBQVksR0FBRyxxQ0FBaUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxFQUFFLFVBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBRTdFLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtvQkFDdEIsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQ3ZDO2dCQUNELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDeEI7WUFDRCxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxtQ0FBVSxHQUFWLFVBQVcsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQztZQUVyQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtvQkFDcEIsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFFekMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO29CQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2lCQUMzQjthQUNGO1lBRUQsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBQ0gscUJBQUM7QUFBRCxDQUFDLEFBckRELENBQXVDLGlDQUFlLEdBcURyRDtBQXJEWSx3Q0FBYyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBmaXJzdCBzb3VyY2UgT2JzZXJ2YWJsZSB0byBlbWl0IGFuIGl0ZW0uXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFN1YnNjcmliZXMgdG8gdGhlIG9ic2VydmFibGUgdGhhdCB3YXMgdGhlIGZpcnN0IHRvIHN0YXJ0IGVtaXR0aW5nLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG9iczEgPSBpbnRlcnZhbCgxMDAwKS5waXBlKG1hcFRvKCdmYXN0IG9uZScpKTtcbiAqIGNvbnN0IG9iczIgPSBpbnRlcnZhbCgzMDAwKS5waXBlKG1hcFRvKCdtZWRpdW0gb25lJykpO1xuICogY29uc3Qgb2JzMyA9IGludGVydmFsKDUwMDApLnBpcGUobWFwVG8oJ3Nsb3cgb25lJykpO1xuICpcbiAqIHJhY2Uob2JzMywgb2JzMSwgb2JzMilcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHdpbm5lciA9PiBjb25zb2xlLmxvZyh3aW5uZXIpXG4gKiApO1xuICpcbiAqIC8vIHJlc3VsdDpcbiAqIC8vIGEgc2VyaWVzIG9mICdmYXN0IG9uZSdcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7Li4uT2JzZXJ2YWJsZXN9IC4uLm9ic2VydmFibGVzIHNvdXJjZXMgdXNlZCB0byByYWNlIGZvciB3aGljaCBPYnNlcnZhYmxlIGVtaXRzIGZpcnN0LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gYW4gT2JzZXJ2YWJsZSB0aGF0IG1pcnJvcnMgdGhlIG91dHB1dCBvZiB0aGUgZmlyc3QgT2JzZXJ2YWJsZSB0byBlbWl0IGFuIGl0ZW0uXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIHJhY2VcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByYWNlPFQ+KG9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlPFQ+Pik6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPihvYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pik6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxUPiB8IEFycmF5PE9ic2VydmFibGU8VD4+Pik6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5vYnNlcnZhYmxlczogQXJyYXk8T2JzZXJ2YWJsZTxhbnk+IHwgQXJyYXk8T2JzZXJ2YWJsZTxhbnk+Pj4pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgLy8gaWYgdGhlIG9ubHkgYXJndW1lbnQgaXMgYW4gYXJyYXksIGl0IHdhcyBtb3N0IGxpa2VseSBjYWxsZWQgd2l0aFxuICAvLyBgcmFjZShbb2JzMSwgb2JzMiwgLi4uXSlgXG4gIGlmIChvYnNlcnZhYmxlcy5sZW5ndGggPT09IDEpIHtcbiAgICBpZiAoaXNBcnJheShvYnNlcnZhYmxlc1swXSkpIHtcbiAgICAgIG9ic2VydmFibGVzID0gPEFycmF5PE9ic2VydmFibGU8YW55Pj4+b2JzZXJ2YWJsZXNbMF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiA8T2JzZXJ2YWJsZTxhbnk+Pm9ic2VydmFibGVzWzBdO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmcm9tQXJyYXkob2JzZXJ2YWJsZXMsIHVuZGVmaW5lZCkubGlmdChuZXcgUmFjZU9wZXJhdG9yPFQ+KCkpO1xufVxuXG5leHBvcnQgY2xhc3MgUmFjZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IFJhY2VTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFJhY2VTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFQ+IHtcbiAgcHJpdmF0ZSBoYXNGaXJzdDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbltdID0gW107XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQob2JzZXJ2YWJsZTogYW55KTogdm9pZCB7XG4gICAgdGhpcy5vYnNlcnZhYmxlcy5wdXNoKG9ic2VydmFibGUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBvYnNlcnZhYmxlcyA9IHRoaXMub2JzZXJ2YWJsZXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2YWJsZXMubGVuZ3RoO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhdGhpcy5oYXNGaXJzdDsgaSsrKSB7XG4gICAgICAgIGxldCBvYnNlcnZhYmxlID0gb2JzZXJ2YWJsZXNbaV07XG4gICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBvYnNlcnZhYmxlLCBvYnNlcnZhYmxlIGFzIGFueSwgaSk7XG5cbiAgICAgICAgaWYgKHRoaXMuc3Vic2NyaXB0aW9ucykge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5wdXNoKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5hZGQoc3Vic2NyaXB0aW9uKTtcbiAgICAgIH1cbiAgICAgIHRoaXMub2JzZXJ2YWJsZXMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogVCxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIFQ+KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0ZpcnN0KSB7XG4gICAgICB0aGlzLmhhc0ZpcnN0ID0gdHJ1ZTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnN1YnNjcmlwdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKGkgIT09IG91dGVySW5kZXgpIHtcbiAgICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gdGhpcy5zdWJzY3JpcHRpb25zW2ldO1xuXG4gICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgdGhpcy5yZW1vdmUoc3Vic2NyaXB0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBudWxsO1xuICAgIH1cblxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChpbm5lclZhbHVlKTtcbiAgfVxufVxuIl19