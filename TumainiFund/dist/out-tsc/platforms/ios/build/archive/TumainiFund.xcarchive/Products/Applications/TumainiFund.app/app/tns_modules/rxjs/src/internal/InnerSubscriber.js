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
var Subscriber_1 = require("./Subscriber");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var InnerSubscriber = /** @class */ (function (_super) {
    __extends(InnerSubscriber, _super);
    function InnerSubscriber(parent, outerValue, outerIndex) {
        var _this = _super.call(this) || this;
        _this.parent = parent;
        _this.outerValue = outerValue;
        _this.outerIndex = outerIndex;
        _this.index = 0;
        return _this;
    }
    InnerSubscriber.prototype._next = function (value) {
        this.parent.notifyNext(this.outerValue, value, this.outerIndex, this.index++, this);
    };
    InnerSubscriber.prototype._error = function (error) {
        this.parent.notifyError(error, this);
        this.unsubscribe();
    };
    InnerSubscriber.prototype._complete = function () {
        this.parent.notifyComplete(this);
        this.unsubscribe();
    };
    return InnerSubscriber;
}(Subscriber_1.Subscriber));
exports.InnerSubscriber = InnerSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSW5uZXJTdWJzY3JpYmVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9Jbm5lclN1YnNjcmliZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsMkNBQTBDO0FBRzFDOzs7O0dBSUc7QUFDSDtJQUEyQyxtQ0FBYTtJQUd0RCx5QkFBb0IsTUFBNkIsRUFBUyxVQUFhLEVBQVMsVUFBa0I7UUFBbEcsWUFDRSxpQkFBTyxTQUNSO1FBRm1CLFlBQU0sR0FBTixNQUFNLENBQXVCO1FBQVMsZ0JBQVUsR0FBVixVQUFVLENBQUc7UUFBUyxnQkFBVSxHQUFWLFVBQVUsQ0FBUTtRQUYxRixXQUFLLEdBQUcsQ0FBQyxDQUFDOztJQUlsQixDQUFDO0lBRVMsK0JBQUssR0FBZixVQUFnQixLQUFRO1FBQ3RCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFUyxnQ0FBTSxHQUFoQixVQUFpQixLQUFVO1FBQ3pCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVTLG1DQUFTLEdBQW5CO1FBQ0UsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDakMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFwQkQsQ0FBMkMsdUJBQVUsR0FvQnBEO0FBcEJZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuL091dGVyU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgSW5uZXJTdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgU3Vic2NyaWJlcjxSPiB7XG4gIHByaXZhdGUgaW5kZXggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgcGFyZW50OiBPdXRlclN1YnNjcmliZXI8VCwgUj4sIHB1YmxpYyBvdXRlclZhbHVlOiBULCBwdWJsaWMgb3V0ZXJJbmRleDogbnVtYmVyKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogUik6IHZvaWQge1xuICAgIHRoaXMucGFyZW50Lm5vdGlmeU5leHQodGhpcy5vdXRlclZhbHVlLCB2YWx1ZSwgdGhpcy5vdXRlckluZGV4LCB0aGlzLmluZGV4KyssIHRoaXMpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5RXJyb3IoZXJyb3IsIHRoaXMpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUoKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5wYXJlbnQubm90aWZ5Q29tcGxldGUodGhpcyk7XG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuICB9XG59XG4iXX0=