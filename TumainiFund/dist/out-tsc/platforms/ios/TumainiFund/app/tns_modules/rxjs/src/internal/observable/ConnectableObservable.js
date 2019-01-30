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
var Subject_1 = require("../Subject");
var Observable_1 = require("../Observable");
var Subscriber_1 = require("../Subscriber");
var Subscription_1 = require("../Subscription");
var refCount_1 = require("../operators/refCount");
/**
 * @class ConnectableObservable<T>
 */
var ConnectableObservable = /** @class */ (function (_super) {
    __extends(ConnectableObservable, _super);
    function ConnectableObservable(source, subjectFactory) {
        var _this = _super.call(this) || this;
        _this.source = source;
        _this.subjectFactory = subjectFactory;
        _this._refCount = 0;
        /** @internal */
        _this._isComplete = false;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    ConnectableObservable.prototype._subscribe = function (subscriber) {
        return this.getSubject().subscribe(subscriber);
    };
    ConnectableObservable.prototype.getSubject = function () {
        var subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    };
    ConnectableObservable.prototype.connect = function () {
        var connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new Subscription_1.Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription_1.Subscription.EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    };
    ConnectableObservable.prototype.refCount = function () {
        return refCount_1.refCount()(this);
    };
    return ConnectableObservable;
}(Observable_1.Observable));
exports.ConnectableObservable = ConnectableObservable;
var connectableProto = ConnectableObservable.prototype;
exports.connectableObservableDescriptor = {
    operator: { value: null },
    _refCount: { value: 0, writable: true },
    _subject: { value: null, writable: true },
    _connection: { value: null, writable: true },
    _subscribe: { value: connectableProto._subscribe },
    _isComplete: { value: connectableProto._isComplete, writable: true },
    getSubject: { value: connectableProto.getSubject },
    connect: { value: connectableProto.connect },
    refCount: { value: connectableProto.refCount }
};
var ConnectableSubscriber = /** @class */ (function (_super) {
    __extends(ConnectableSubscriber, _super);
    function ConnectableSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    ConnectableSubscriber.prototype._error = function (err) {
        this._unsubscribe();
        _super.prototype._error.call(this, err);
    };
    ConnectableSubscriber.prototype._complete = function () {
        this.connectable._isComplete = true;
        this._unsubscribe();
        _super.prototype._complete.call(this);
    };
    ConnectableSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            var connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    };
    return ConnectableSubscriber;
}(Subject_1.SubjectSubscriber));
var RefCountOperator = /** @class */ (function () {
    function RefCountOperator(connectable) {
        this.connectable = connectable;
    }
    RefCountOperator.prototype.call = function (subscriber, source) {
        var connectable = this.connectable;
        connectable._refCount++;
        var refCounter = new RefCountSubscriber(subscriber, connectable);
        var subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    };
    return RefCountOperator;
}());
var RefCountSubscriber = /** @class */ (function (_super) {
    __extends(RefCountSubscriber, _super);
    function RefCountSubscriber(destination, connectable) {
        var _this = _super.call(this, destination) || this;
        _this.connectable = connectable;
        return _this;
    }
    RefCountSubscriber.prototype._unsubscribe = function () {
        var connectable = this.connectable;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        var refCount = connectable._refCount;
        if (refCount <= 0) {
            this.connection = null;
            return;
        }
        connectable._refCount = refCount - 1;
        if (refCount > 1) {
            this.connection = null;
            return;
        }
        ///
        // Compare the local RefCountSubscriber's connection Subscription to the
        // connection Subscription on the shared ConnectableObservable. In cases
        // where the ConnectableObservable source synchronously emits values, and
        // the RefCountSubscriber's downstream Observers synchronously unsubscribe,
        // execution continues to here before the RefCountOperator has a chance to
        // supply the RefCountSubscriber with the shared connection Subscription.
        // For example:
        // ```
        // range(0, 10).pipe(
        //   publish(),
        //   refCount(),
        //   take(5),
        // ).subscribe();
        // ```
        // In order to account for this case, RefCountSubscriber should only dispose
        // the ConnectableObservable's shared connection Subscription if the
        // connection Subscription exists, *and* either:
        //   a. RefCountSubscriber doesn't have a reference to the shared connection
        //      Subscription yet, or,
        //   b. RefCountSubscriber's connection Subscription reference is identical
        //      to the shared connection Subscription
        ///
        var connection = this.connection;
        var sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    };
    return RefCountSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGFibGVPYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXdEO0FBRXhELDRDQUEyQztBQUMzQyw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBRS9DLGtEQUF3RTtBQUV4RTs7R0FFRztBQUNIO0lBQThDLHlDQUFhO0lBUXpELCtCQUFtQixNQUFxQixFQUNsQixjQUFnQztRQUR0RCxZQUVFLGlCQUFPLFNBQ1I7UUFIa0IsWUFBTSxHQUFOLE1BQU0sQ0FBZTtRQUNsQixvQkFBYyxHQUFkLGNBQWMsQ0FBa0I7UUFONUMsZUFBUyxHQUFXLENBQUMsQ0FBQztRQUVoQyxnQkFBZ0I7UUFDaEIsaUJBQVcsR0FBRyxLQUFLLENBQUM7O0lBS3BCLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsMENBQVUsR0FBVixVQUFXLFVBQXlCO1FBQ2xDLE9BQU8sSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRVMsMENBQVUsR0FBcEI7UUFDRSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzlCLElBQUksQ0FBQyxPQUFPLElBQUksT0FBTyxDQUFDLFNBQVMsRUFBRTtZQUNqQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztTQUN2QztRQUNELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDO0lBRUQsdUNBQU8sR0FBUDtRQUNFLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7UUFDbEMsSUFB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LE9BQU87U0FDUjtRQUVNLFdBQVksQ0FBQyxTQUFTLEdBQUcsUUFBUSxHQUFHLENBQUMsQ0FBQztRQUM3QyxJQUFJLFFBQVEsR0FBRyxDQUFDLEVBQUU7WUFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBRUQsR0FBRztRQUNILHdFQUF3RTtRQUN4RSx3RUFBd0U7UUFDeEUseUVBQXlFO1FBQ3pFLDJFQUEyRTtRQUMzRSwwRUFBMEU7UUFDMUUseUVBQXlFO1FBQ3pFLGVBQWU7UUFDZixNQUFNO1FBQ04scUJBQXFCO1FBQ3JCLGVBQWU7UUFDZixnQkFBZ0I7UUFDaEIsYUFBYTtRQUNiLGlCQUFpQjtRQUNqQixNQUFNO1FBQ04sNEVBQTRFO1FBQzVFLG9FQUFvRTtRQUNwRSxnREFBZ0Q7UUFDaEQsNEVBQTRFO1FBQzVFLDZCQUE2QjtRQUM3QiwyRUFBMkU7UUFDM0UsNkNBQTZDO1FBQzdDLEdBQUc7UUFDSyxJQUFBLDRCQUFVLENBQVU7UUFDNUIsSUFBTSxnQkFBZ0IsR0FBVSxXQUFZLENBQUMsV0FBVyxDQUFDO1FBQ3pELElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1FBRXZCLElBQUksZ0JBQWdCLElBQUksQ0FBQyxDQUFDLFVBQVUsSUFBSSxnQkFBZ0IsS0FBSyxVQUFVLENBQUMsRUFBRTtZQUN4RSxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNoQztJQUNILENBQUM7SUFDSCx5QkFBQztBQUFELENBQUMsQUE3REQsQ0FBb0MsdUJBQVUsR0E2RDdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCwgU3ViamVjdFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyByZWZDb3VudCBhcyBoaWdoZXJPcmRlclJlZkNvdW50IH0gZnJvbSAnLi4vb3BlcmF0b3JzL3JlZkNvdW50JztcblxuLyoqXG4gKiBAY2xhc3MgQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcblxuICBwcm90ZWN0ZWQgX3N1YmplY3Q6IFN1YmplY3Q8VD47XG4gIHByb3RlY3RlZCBfcmVmQ291bnQ6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBfY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuICAvKiogQGludGVybmFsICovXG4gIF9pc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHN1YmplY3RGYWN0b3J5OiAoKSA9PiBTdWJqZWN0PFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3ViamVjdCgpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRTdWJqZWN0KCk6IFN1YmplY3Q8VD4ge1xuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLl9zdWJqZWN0O1xuICAgIGlmICghc3ViamVjdCB8fCBzdWJqZWN0LmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuc3ViamVjdEZhY3RvcnkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3N1YmplY3Q7XG4gIH1cblxuICBjb25uZWN0KCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgbGV0IGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uO1xuICAgIGlmICghY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5faXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBjb25uZWN0aW9uLmFkZCh0aGlzLnNvdXJjZVxuICAgICAgICAuc3Vic2NyaWJlKG5ldyBDb25uZWN0YWJsZVN1YnNjcmliZXIodGhpcy5nZXRTdWJqZWN0KCksIHRoaXMpKSk7XG4gICAgICBpZiAoY29ubmVjdGlvbi5jbG9zZWQpIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIGNvbm5lY3Rpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gIH1cblxuICByZWZDb3VudCgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gaGlnaGVyT3JkZXJSZWZDb3VudCgpKHRoaXMpIGFzIE9ic2VydmFibGU8VD47XG4gIH1cbn1cblxuY29uc3QgY29ubmVjdGFibGVQcm90byA9IDxhbnk+Q29ubmVjdGFibGVPYnNlcnZhYmxlLnByb3RvdHlwZTtcblxuZXhwb3J0IGNvbnN0IGNvbm5lY3RhYmxlT2JzZXJ2YWJsZURlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvck1hcCA9IHtcbiAgb3BlcmF0b3I6IHsgdmFsdWU6IG51bGwgfSxcbiAgX3JlZkNvdW50OiB7IHZhbHVlOiAwLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfc3ViamVjdDogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX2Nvbm5lY3Rpb246IHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9zdWJzY3JpYmU6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uX3N1YnNjcmliZSB9LFxuICBfaXNDb21wbGV0ZTogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5faXNDb21wbGV0ZSwgd3JpdGFibGU6IHRydWUgfSxcbiAgZ2V0U3ViamVjdDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5nZXRTdWJqZWN0IH0sXG4gIGNvbm5lY3Q6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uY29ubmVjdCB9LFxuICByZWZDb3VudDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5yZWZDb3VudCB9XG59O1xuXG5jbGFzcyBDb25uZWN0YWJsZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJqZWN0U3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgc3VwZXIuX2Vycm9yKGVycik7XG4gIH1cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbm5lY3RhYmxlLl9pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgY29ubmVjdGFibGUgPSA8YW55PnRoaXMuY29ubmVjdGFibGU7XG4gICAgaWYgKGNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3RhYmxlID0gbnVsbDtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBjb25uZWN0YWJsZS5fY29ubmVjdGlvbjtcbiAgICAgIGNvbm5lY3RhYmxlLl9yZWZDb3VudCA9IDA7XG4gICAgICBjb25uZWN0YWJsZS5fc3ViamVjdCA9IG51bGw7XG4gICAgICBjb25uZWN0YWJsZS5fY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICBpZiAoY29ubmVjdGlvbikge1xuICAgICAgICBjb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICB9XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQrKztcblxuICAgIGNvbnN0IHJlZkNvdW50ZXIgPSBuZXcgUmVmQ291bnRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGNvbm5lY3RhYmxlKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHJlZkNvdW50ZXIpO1xuXG4gICAgaWYgKCFyZWZDb3VudGVyLmNsb3NlZCkge1xuICAgICAgKDxhbnk+IHJlZkNvdW50ZXIpLmNvbm5lY3Rpb24gPSBjb25uZWN0YWJsZS5jb25uZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG5jbGFzcyBSZWZDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcblxuICBwcml2YXRlIGNvbm5lY3Rpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgaWYgKCFjb25uZWN0YWJsZSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3RhYmxlID0gbnVsbDtcbiAgICBjb25zdCByZWZDb3VudCA9ICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50O1xuICAgIGlmIChyZWZDb3VudCA8PSAwKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50ID0gcmVmQ291bnQgLSAxO1xuICAgIGlmIChyZWZDb3VudCA+IDEpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8vXG4gICAgLy8gQ29tcGFyZSB0aGUgbG9jYWwgUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gdG8gdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gb24gdGhlIHNoYXJlZCBDb25uZWN0YWJsZU9ic2VydmFibGUuIEluIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSBzb3VyY2Ugc3luY2hyb25vdXNseSBlbWl0cyB2YWx1ZXMsIGFuZFxuICAgIC8vIHRoZSBSZWZDb3VudFN1YnNjcmliZXIncyBkb3duc3RyZWFtIE9ic2VydmVycyBzeW5jaHJvbm91c2x5IHVuc3Vic2NyaWJlLFxuICAgIC8vIGV4ZWN1dGlvbiBjb250aW51ZXMgdG8gaGVyZSBiZWZvcmUgdGhlIFJlZkNvdW50T3BlcmF0b3IgaGFzIGEgY2hhbmNlIHRvXG4gICAgLy8gc3VwcGx5IHRoZSBSZWZDb3VudFN1YnNjcmliZXIgd2l0aCB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uLlxuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJhbmdlKDAsIDEwKS5waXBlKFxuICAgIC8vICAgcHVibGlzaCgpLFxuICAgIC8vICAgcmVmQ291bnQoKSxcbiAgICAvLyAgIHRha2UoNSksXG4gICAgLy8gKS5zdWJzY3JpYmUoKTtcbiAgICAvLyBgYGBcbiAgICAvLyBJbiBvcmRlciB0byBhY2NvdW50IGZvciB0aGlzIGNhc2UsIFJlZkNvdW50U3Vic2NyaWJlciBzaG91bGQgb25seSBkaXNwb3NlXG4gICAgLy8gdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSdzIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBpZiB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBleGlzdHMsICphbmQqIGVpdGhlcjpcbiAgICAvLyAgIGEuIFJlZkNvdW50U3Vic2NyaWJlciBkb2Vzbid0IGhhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uXG4gICAgLy8gICAgICBTdWJzY3JpcHRpb24geWV0LCBvcixcbiAgICAvLyAgIGIuIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHJlZmVyZW5jZSBpcyBpZGVudGljYWxcbiAgICAvLyAgICAgIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb25cbiAgICAvLy9cbiAgICBjb25zdCB7IGNvbm5lY3Rpb24gfSA9IHRoaXM7XG4gICAgY29uc3Qgc2hhcmVkQ29ubmVjdGlvbiA9ICg8YW55PiBjb25uZWN0YWJsZSkuX2Nvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcblxuICAgIGlmIChzaGFyZWRDb25uZWN0aW9uICYmICghY29ubmVjdGlvbiB8fCBzaGFyZWRDb25uZWN0aW9uID09PSBjb25uZWN0aW9uKSkge1xuICAgICAgc2hhcmVkQ29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19