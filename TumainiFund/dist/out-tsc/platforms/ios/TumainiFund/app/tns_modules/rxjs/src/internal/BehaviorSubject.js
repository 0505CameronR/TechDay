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
var Subject_1 = require("./Subject");
var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
/**
 * A variant of Subject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 *
 * @class BehaviorSubject<T>
 */
var BehaviorSubject = /** @class */ (function (_super) {
    __extends(BehaviorSubject, _super);
    function BehaviorSubject(_value) {
        var _this = _super.call(this) || this;
        _this._value = _value;
        return _this;
    }
    Object.defineProperty(BehaviorSubject.prototype, "value", {
        get: function () {
            return this.getValue();
        },
        enumerable: true,
        configurable: true
    });
    /** @deprecated This is an internal implementation detail, do not use. */
    BehaviorSubject.prototype._subscribe = function (subscriber) {
        var subscription = _super.prototype._subscribe.call(this, subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    };
    BehaviorSubject.prototype.getValue = function () {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return this._value;
        }
    };
    BehaviorSubject.prototype.next = function (value) {
        _super.prototype.next.call(this, this._value = value);
    };
    return BehaviorSubject;
}(Subject_1.Subject));
exports.BehaviorSubject = BehaviorSubject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmVoYXZpb3JTdWJqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvQmVoYXZpb3JTdWJqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHFDQUFvQztBQUlwQywwRUFBeUU7QUFFekU7Ozs7O0dBS0c7QUFDSDtJQUF3QyxtQ0FBVTtJQUVoRCx5QkFBb0IsTUFBUztRQUE3QixZQUNFLGlCQUFPLFNBQ1I7UUFGbUIsWUFBTSxHQUFOLE1BQU0sQ0FBRzs7SUFFN0IsQ0FBQztJQUVELHNCQUFJLGtDQUFLO2FBQVQ7WUFDRSxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN6QixDQUFDOzs7T0FBQTtJQUVELHlFQUF5RTtJQUN6RSxvQ0FBVSxHQUFWLFVBQVcsVUFBeUI7UUFDbEMsSUFBTSxZQUFZLEdBQUcsaUJBQU0sVUFBVSxZQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELElBQUksWUFBWSxJQUFJLENBQW9CLFlBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDNUQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsa0NBQVEsR0FBUjtRQUNFLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEIsTUFBTSxJQUFJLGlEQUF1QixFQUFFLENBQUM7U0FDckM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFRCw4QkFBSSxHQUFKLFVBQUssS0FBUTtRQUNYLGlCQUFNLElBQUksWUFBQyxJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDSCxzQkFBQztBQUFELENBQUMsQUFoQ0QsQ0FBd0MsaUJBQU8sR0FnQzlDO0FBaENZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxpa2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcblxuLyoqXG4gKiBBIHZhcmlhbnQgb2YgU3ViamVjdCB0aGF0IHJlcXVpcmVzIGFuIGluaXRpYWwgdmFsdWUgYW5kIGVtaXRzIGl0cyBjdXJyZW50XG4gKiB2YWx1ZSB3aGVuZXZlciBpdCBpcyBzdWJzY3JpYmVkIHRvLlxuICpcbiAqIEBjbGFzcyBCZWhhdmlvclN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEJlaGF2aW9yU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3ZhbHVlOiBUKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIGdldCB2YWx1ZSgpOiBUIHtcbiAgICByZXR1cm4gdGhpcy5nZXRWYWx1ZSgpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgaWYgKHN1YnNjcmlwdGlvbiAmJiAhKDxTdWJzY3JpcHRpb25MaWtlPnN1YnNjcmlwdGlvbikuY2xvc2VkKSB7XG4gICAgICBzdWJzY3JpYmVyLm5leHQodGhpcy5fdmFsdWUpO1xuICAgIH1cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgZ2V0VmFsdWUoKTogVCB7XG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHRocm93IHRoaXMudGhyb3duRXJyb3I7XG4gICAgfSBlbHNlIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLl92YWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgc3VwZXIubmV4dCh0aGlzLl92YWx1ZSA9IHZhbHVlKTtcbiAgfVxufVxuIl19