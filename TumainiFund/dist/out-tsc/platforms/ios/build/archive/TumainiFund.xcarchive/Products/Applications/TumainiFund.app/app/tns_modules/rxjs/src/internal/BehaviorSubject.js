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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmVoYXZpb3JTdWJqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9CZWhhdmlvclN1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEscUNBQW9DO0FBSXBDLDBFQUF5RTtBQUV6RTs7Ozs7R0FLRztBQUNIO0lBQXdDLG1DQUFVO0lBRWhELHlCQUFvQixNQUFTO1FBQTdCLFlBQ0UsaUJBQU8sU0FDUjtRQUZtQixZQUFNLEdBQU4sTUFBTSxDQUFHOztJQUU3QixDQUFDO0lBRUQsc0JBQUksa0NBQUs7YUFBVDtZQUNFLE9BQU8sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3pCLENBQUM7OztPQUFBO0lBRUQseUVBQXlFO0lBQ3pFLG9DQUFVLEdBQVYsVUFBVyxVQUF5QjtRQUNsQyxJQUFNLFlBQVksR0FBRyxpQkFBTSxVQUFVLFlBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsSUFBSSxZQUFZLElBQUksQ0FBb0IsWUFBYSxDQUFDLE1BQU0sRUFBRTtZQUM1RCxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5QjtRQUNELE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE1BQU0sSUFBSSxDQUFDLFdBQVcsQ0FBQztTQUN4QjthQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN0QixNQUFNLElBQUksaURBQXVCLEVBQUUsQ0FBQztTQUNyQzthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3BCO0lBQ0gsQ0FBQztJQUVELDhCQUFJLEdBQUosVUFBSyxLQUFRO1FBQ1gsaUJBQU0sSUFBSSxZQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQWhDRCxDQUF3QyxpQkFBTyxHQWdDOUM7QUFoQ1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgcmVxdWlyZXMgYW4gaW5pdGlhbCB2YWx1ZSBhbmQgZW1pdHMgaXRzIGN1cnJlbnRcbiAqIHZhbHVlIHdoZW5ldmVyIGl0IGlzIHN1YnNjcmliZWQgdG8uXG4gKlxuICogQGNsYXNzIEJlaGF2aW9yU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQmVoYXZpb3JTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmFsdWU6IFQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICBpZiAoc3Vic2NyaXB0aW9uICYmICEoPFN1YnNjcmlwdGlvbkxpa2U+c3Vic2NyaXB0aW9uKS5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLl92YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBUIHtcbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy50aHJvd25FcnJvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBzdXBlci5uZXh0KHRoaXMuX3ZhbHVlID0gdmFsdWUpO1xuICB9XG59XG4iXX0=