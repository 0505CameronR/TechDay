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
var Subscription_1 = require("./Subscription");
/**
 * A variant of Subject that only emits a value when it completes. It will emit
 * its latest value to all its observers on completion.
 *
 * @class AsyncSubject<T>
 */
var AsyncSubject = /** @class */ (function (_super) {
    __extends(AsyncSubject, _super);
    function AsyncSubject() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.value = null;
        _this.hasNext = false;
        _this.hasCompleted = false;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    AsyncSubject.prototype._subscribe = function (subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        return _super.prototype._subscribe.call(this, subscriber);
    };
    AsyncSubject.prototype.next = function (value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    };
    AsyncSubject.prototype.error = function (error) {
        if (!this.hasCompleted) {
            _super.prototype.error.call(this, error);
        }
    };
    AsyncSubject.prototype.complete = function () {
        this.hasCompleted = true;
        if (this.hasNext) {
            _super.prototype.next.call(this, this.value);
        }
        _super.prototype.complete.call(this);
    };
    return AsyncSubject;
}(Subject_1.Subject));
exports.AsyncSubject = AsyncSubject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNTdWJqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9Bc3luY1N1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQW9DO0FBRXBDLCtDQUE4QztBQUU5Qzs7Ozs7R0FLRztBQUNIO0lBQXFDLGdDQUFVO0lBQS9DO1FBQUEscUVBc0NDO1FBckNTLFdBQUssR0FBTSxJQUFJLENBQUM7UUFDaEIsYUFBTyxHQUFZLEtBQUssQ0FBQztRQUN6QixrQkFBWSxHQUFZLEtBQUssQ0FBQzs7SUFtQ3hDLENBQUM7SUFqQ0MseUVBQXlFO0lBQ3pFLGlDQUFVLEdBQVYsVUFBVyxVQUEyQjtRQUNwQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsT0FBTywyQkFBWSxDQUFDLEtBQUssQ0FBQztTQUMzQjthQUFNLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsT0FBTyxFQUFFO1lBQzVDLFVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzVCLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUN0QixPQUFPLDJCQUFZLENBQUMsS0FBSyxDQUFDO1NBQzNCO1FBQ0QsT0FBTyxpQkFBTSxVQUFVLFlBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELDJCQUFJLEdBQUosVUFBSyxLQUFRO1FBQ1gsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDbkIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDckI7SUFDSCxDQUFDO0lBRUQsNEJBQUssR0FBTCxVQUFNLEtBQVU7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixpQkFBTSxLQUFLLFlBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsK0JBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixpQkFBTSxJQUFJLFlBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO1FBQ0QsaUJBQU0sUUFBUSxXQUFFLENBQUM7SUFDbkIsQ0FBQztJQUNILG1CQUFDO0FBQUQsQ0FBQyxBQXRDRCxDQUFxQyxpQkFBTyxHQXNDM0M7QUF0Q1ksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgb25seSBlbWl0cyBhIHZhbHVlIHdoZW4gaXQgY29tcGxldGVzLiBJdCB3aWxsIGVtaXRcbiAqIGl0cyBsYXRlc3QgdmFsdWUgdG8gYWxsIGl0cyBvYnNlcnZlcnMgb24gY29tcGxldGlvbi5cbiAqXG4gKiBAY2xhc3MgQXN5bmNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY1N1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZTogVCA9IG51bGw7XG4gIHByaXZhdGUgaGFzTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuaGFzTmV4dCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5oYXNOZXh0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgc3VwZXIuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdXBlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBzdXBlci5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=