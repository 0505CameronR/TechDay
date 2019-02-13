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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGFibGVPYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0Q7QUFFeEQsNENBQTJDO0FBQzNDLDRDQUEyQztBQUMzQyxnREFBK0M7QUFFL0Msa0RBQXdFO0FBRXhFOztHQUVHO0FBQ0g7SUFBOEMseUNBQWE7SUFRekQsK0JBQW1CLE1BQXFCLEVBQ2xCLGNBQWdDO1FBRHRELFlBRUUsaUJBQU8sU0FDUjtRQUhrQixZQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ2xCLG9CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQU41QyxlQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRWhDLGdCQUFnQjtRQUNoQixpQkFBVyxHQUFHLEtBQUssQ0FBQzs7SUFLcEIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSwwQ0FBVSxHQUFWLFVBQVcsVUFBeUI7UUFDbEMsT0FBTyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFUywwQ0FBVSxHQUFwQjtRQUNFLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDOUIsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsU0FBUyxFQUFFO1lBQ2pDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQ3ZDO1FBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFD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Q0FBQztRQUMvQyxJQUFJLFFBQVEsSUFBSSxDQUFDLEVBQUU7WUFDakIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDdkIsT0FBTztTQUNSO1FBRU0sV0FBWSxDQUFDLFNBQVMsR0FBRyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQzdDLElBQUksUUFBUSxHQUFHLENBQUMsRUFBRTtZQUNoQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPO1NBQ1I7UUFFRCxHQUFHO1FBQ0gsd0VBQXdFO1FBQ3hFLHdFQUF3RTtRQUN4RSx5RUFBeUU7UUFDekUsMkVBQTJFO1FBQzNFLDBFQUEwRTtRQUMxRSx5RUFBeUU7UUFDekUsZUFBZTtRQUNmLE1BQU07UUFDTixxQkFBcUI7UUFDckIsZUFBZTtRQUNmLGdCQUFnQjtRQUNoQixhQUFhO1FBQ2IsaUJBQWlCO1FBQ2pCLE1BQU07UUFDTiw0RUFBNEU7UUFDNUUsb0VBQW9FO1FBQ3BFLGdEQUFnRDtRQUNoRCw0RUFBNEU7UUFDNUUsNkJBQTZCO1FBQzdCLDJFQUEyRTtRQUMzRSw2Q0FBNkM7UUFDN0MsR0FBRztRQUNLLElBQUEsNEJBQVUsQ0FBVTtRQUM1QixJQUFNLGdCQUFnQixHQUFVLFdBQVksQ0FBQyxXQUFXLENBQUM7UUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLGdCQUFnQixLQUFLLFVBQVUsQ0FBQyxFQUFFO1lBQ3hFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztJQUNILHlCQUFDO0FBQUQsQ0FBQyxBQTdERCxDQUFvQyx1QkFBVSxHQTZEN0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0LCBTdWJqZWN0U3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHJlZkNvdW50IGFzIGhpZ2hlck9yZGVyUmVmQ291bnQgfSBmcm9tICcuLi9vcGVyYXRvcnMvcmVmQ291bnQnO1xuXG4vKipcbiAqIEBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPiBleHRlbmRzIE9ic2VydmFibGU8VD4ge1xuXG4gIHByb3RlY3RlZCBfc3ViamVjdDogU3ViamVjdDxUPjtcbiAgcHJvdGVjdGVkIF9yZWZDb3VudDogbnVtYmVyID0gMDtcbiAgcHJvdGVjdGVkIF9jb25uZWN0aW9uOiBTdWJzY3JpcHRpb247XG4gIC8qKiBAaW50ZXJuYWwgKi9cbiAgX2lzQ29tcGxldGUgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcm90ZWN0ZWQgc3ViamVjdEZhY3Rvcnk6ICgpID0+IFN1YmplY3Q8VD4pIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pIHtcbiAgICByZXR1cm4gdGhpcy5nZXRTdWJqZWN0KCkuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldFN1YmplY3QoKTogU3ViamVjdDxUPiB7XG4gICAgY29uc3Qgc3ViamVjdCA9IHRoaXMuX3N1YmplY3Q7XG4gICAgaWYgKCFzdWJqZWN0IHx8IHN1YmplY3QuaXNTdG9wcGVkKSB7XG4gICAgICB0aGlzLl9zdWJqZWN0ID0gdGhpcy5zdWJqZWN0RmFjdG9yeSgpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fc3ViamVjdDtcbiAgfVxuXG4gIGNvbm5lY3QoKTogU3Vic2NyaXB0aW9uIHtcbiAgICBsZXQgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb247XG4gICAgaWYgKCFjb25uZWN0aW9uKSB7XG4gICAgICB0aGlzLl9pc0NvbXBsZXRlID0gZmFsc2U7XG4gICAgICBjb25uZWN0aW9uID0gdGhpcy5fY29ubmVjdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICAgIGNvbm5lY3Rpb24uYWRkKHRoaXMuc291cmNlXG4gICAgICAgIC5zdWJzY3JpYmUobmV3IENvbm5lY3RhYmxlU3Vic2NyaWJlcih0aGlzLmdldFN1YmplY3QoKSwgdGhpcykpKTtcbiAgICAgIGlmIChjb25uZWN0aW9uLmNsb3NlZCkge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgICAgY29ubmVjdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3Rpb24gPSBjb25uZWN0aW9uO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY29ubmVjdGlvbjtcbiAgfVxuXG4gIHJlZkNvdW50KCk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBoaWdoZXJPcmRlclJlZkNvdW50KCkodGhpcykgYXMgT2JzZXJ2YWJsZTxUPjtcbiAgfVxufVxuXG5jb25zdCBjb25uZWN0YWJsZVByb3RvID0gPGFueT5Db25uZWN0YWJsZU9ic2VydmFibGUucHJvdG90eXBlO1xuXG5leHBvcnQgY29uc3QgY29ubmVjdGFibGVPYnNlcnZhYmxlRGVzY3JpcHRvcjogUHJvcGVydHlEZXNjcmlwdG9yTWFwID0ge1xuICBvcGVyYXRvcjogeyB2YWx1ZTogbnVsbCB9LFxuICBfcmVmQ291bnQ6IHsgdmFsdWU6IDAsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9zdWJqZWN0OiB7IHZhbHVlOiBudWxsLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfY29ubmVjdGlvbjogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX3N1YnNjcmliZTogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5fc3Vic2NyaWJlIH0sXG4gIF9pc0NvbXBsZXRlOiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLl9pc0NvbXBsZXRlLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBnZXRTdWJqZWN0OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLmdldFN1YmplY3QgfSxcbiAgY29ubmVjdDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5jb25uZWN0IH0sXG4gIHJlZkNvdW50OiB7IHZhbHVlOiBjb25uZWN0YWJsZVByb3RvLnJlZkNvdW50IH1cbn07XG5cbmNsYXNzIENvbm5lY3RhYmxlU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YmplY3RTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YmplY3Q8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5fdW5zdWJzY3JpYmUoKTtcbiAgICBzdXBlci5fZXJyb3IoZXJyKTtcbiAgfVxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY29ubmVjdGFibGUuX2lzQ29tcGxldGUgPSB0cnVlO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCBjb25uZWN0YWJsZSA9IDxhbnk+dGhpcy5jb25uZWN0YWJsZTtcbiAgICBpZiAoY29ubmVjdGFibGUpIHtcbiAgICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgICAgY29uc3QgY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uO1xuICAgICAgY29ubmVjdGFibGUuX3JlZkNvdW50ID0gMDtcbiAgICAgIGNvbm5lY3RhYmxlLl9zdWJqZWN0ID0gbnVsbDtcbiAgICAgIGNvbm5lY3RhYmxlLl9jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIGlmIChjb25uZWN0aW9uKSB7XG4gICAgICAgIGNvbm5lY3Rpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuY2xhc3MgUmVmQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICAoPGFueT4gY29ubmVjdGFibGUpLl9yZWZDb3VudCsrO1xuXG4gICAgY29uc3QgcmVmQ291bnRlciA9IG5ldyBSZWZDb3VudFN1YnNjcmliZXIoc3Vic2NyaWJlciwgY29ubmVjdGFibGUpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUocmVmQ291bnRlcik7XG5cbiAgICBpZiAoIXJlZkNvdW50ZXIuY2xvc2VkKSB7XG4gICAgICAoPGFueT4gcmVmQ291bnRlcikuY29ubmVjdGlvbiA9IGNvbm5lY3RhYmxlLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuXG4gIHByaXZhdGUgY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX3Vuc3Vic2NyaWJlKCkge1xuXG4gICAgY29uc3QgeyBjb25uZWN0YWJsZSB9ID0gdGhpcztcbiAgICBpZiAoIWNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuY29ubmVjdGFibGUgPSBudWxsO1xuICAgIGNvbnN0IHJlZkNvdW50ID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQ7XG4gICAgaWYgKHJlZkNvdW50IDw9IDApIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQgPSByZWZDb3VudCAtIDE7XG4gICAgaWYgKHJlZkNvdW50ID4gMSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLy9cbiAgICAvLyBDb21wYXJlIHRoZSBsb2NhbCBSZWZDb3VudFN1YnNjcmliZXIncyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiB0byB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBvbiB0aGUgc2hhcmVkIENvbm5lY3RhYmxlT2JzZXJ2YWJsZS4gSW4gY2FzZXNcbiAgICAvLyB3aGVyZSB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlIHNvdXJjZSBzeW5jaHJvbm91c2x5IGVtaXRzIHZhbHVlcywgYW5kXG4gICAgLy8gdGhlIFJlZkNvdW50U3Vic2NyaWJlcidzIGRvd25zdHJlYW0gT2JzZXJ2ZXJzIHN5bmNocm9ub3VzbHkgdW5zdWJzY3JpYmUsXG4gICAgLy8gZXhlY3V0aW9uIGNvbnRpbnVlcyB0byBoZXJlIGJlZm9yZSB0aGUgUmVmQ291bnRPcGVyYXRvciBoYXMgYSBjaGFuY2UgdG9cbiAgICAvLyBzdXBwbHkgdGhlIFJlZkNvdW50U3Vic2NyaWJlciB3aXRoIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24uXG4gICAgLy8gRm9yIGV4YW1wbGU6XG4gICAgLy8gYGBgXG4gICAgLy8gcmFuZ2UoMCwgMTApLnBpcGUoXG4gICAgLy8gICBwdWJsaXNoKCksXG4gICAgLy8gICByZWZDb3VudCgpLFxuICAgIC8vICAgdGFrZSg1KSxcbiAgICAvLyApLnN1YnNjcmliZSgpO1xuICAgIC8vIGBgYFxuICAgIC8vIEluIG9yZGVyIHRvIGFjY291bnQgZm9yIHRoaXMgY2FzZSwgUmVmQ291bnRTdWJzY3JpYmVyIHNob3VsZCBvbmx5IGRpc3Bvc2VcbiAgICAvLyB0aGUgQ29ubmVjdGFibGVPYnNlcnZhYmxlJ3Mgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGlmIHRoZVxuICAgIC8vIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIGV4aXN0cywgKmFuZCogZWl0aGVyOlxuICAgIC8vICAgYS4gUmVmQ291bnRTdWJzY3JpYmVyIGRvZXNuJ3QgaGF2ZSBhIHJlZmVyZW5jZSB0byB0aGUgc2hhcmVkIGNvbm5lY3Rpb25cbiAgICAvLyAgICAgIFN1YnNjcmlwdGlvbiB5ZXQsIG9yLFxuICAgIC8vICAgYi4gUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gcmVmZXJlbmNlIGlzIGlkZW50aWNhbFxuICAgIC8vICAgICAgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvblxuICAgIC8vL1xuICAgIGNvbnN0IHsgY29ubmVjdGlvbiB9ID0gdGhpcztcbiAgICBjb25zdCBzaGFyZWRDb25uZWN0aW9uID0gKDxhbnk+IGNvbm5lY3RhYmxlKS5fY29ubmVjdGlvbjtcbiAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuXG4gICAgaWYgKHNoYXJlZENvbm5lY3Rpb24gJiYgKCFjb25uZWN0aW9uIHx8IHNoYXJlZENvbm5lY3Rpb24gPT09IGNvbm5lY3Rpb24pKSB7XG4gICAgICBzaGFyZWRDb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICB9XG59XG4iXX0=