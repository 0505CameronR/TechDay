import { SubjectSubscriber } from '../Subject';
import { Observable } from '../Observable';
import { Subscriber } from '../Subscriber';
import { Subscription } from '../Subscription';
import { refCount as higherOrderRefCount } from '../operators/refCount';
/**
 * @class ConnectableObservable<T>
 */
export class ConnectableObservable extends Observable {
    constructor(source, subjectFactory) {
        super();
        this.source = source;
        this.subjectFactory = subjectFactory;
        this._refCount = 0;
        /** @internal */
        this._isComplete = false;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        return this.getSubject().subscribe(subscriber);
    }
    getSubject() {
        const subject = this._subject;
        if (!subject || subject.isStopped) {
            this._subject = this.subjectFactory();
        }
        return this._subject;
    }
    connect() {
        let connection = this._connection;
        if (!connection) {
            this._isComplete = false;
            connection = this._connection = new Subscription();
            connection.add(this.source
                .subscribe(new ConnectableSubscriber(this.getSubject(), this)));
            if (connection.closed) {
                this._connection = null;
                connection = Subscription.EMPTY;
            }
            else {
                this._connection = connection;
            }
        }
        return connection;
    }
    refCount() {
        return higherOrderRefCount()(this);
    }
}
const connectableProto = ConnectableObservable.prototype;
export const connectableObservableDescriptor = {
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
class ConnectableSubscriber extends SubjectSubscriber {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _error(err) {
        this._unsubscribe();
        super._error(err);
    }
    _complete() {
        this.connectable._isComplete = true;
        this._unsubscribe();
        super._complete();
    }
    _unsubscribe() {
        const connectable = this.connectable;
        if (connectable) {
            this.connectable = null;
            const connection = connectable._connection;
            connectable._refCount = 0;
            connectable._subject = null;
            connectable._connection = null;
            if (connection) {
                connection.unsubscribe();
            }
        }
    }
}
class RefCountOperator {
    constructor(connectable) {
        this.connectable = connectable;
    }
    call(subscriber, source) {
        const { connectable } = this;
        connectable._refCount++;
        const refCounter = new RefCountSubscriber(subscriber, connectable);
        const subscription = source.subscribe(refCounter);
        if (!refCounter.closed) {
            refCounter.connection = connectable.connect();
        }
        return subscription;
    }
}
class RefCountSubscriber extends Subscriber {
    constructor(destination, connectable) {
        super(destination);
        this.connectable = connectable;
    }
    _unsubscribe() {
        const { connectable } = this;
        if (!connectable) {
            this.connection = null;
            return;
        }
        this.connectable = null;
        const refCount = connectable._refCount;
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
        const { connection } = this;
        const sharedConnection = connectable._connection;
        this.connection = null;
        if (sharedConnection && (!connection || sharedConnection === connection)) {
            sharedConnection.unsubscribe();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29ubmVjdGFibGVPYnNlcnZhYmxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFXLGlCQUFpQixFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXhELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLFFBQVEsSUFBSSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBRXhFOztHQUVHO0FBQ0gsTUFBTSxPQUFPLHFCQUF5QixTQUFRLFVBQWE7SUFRekQsWUFBbUIsTUFBcUIsRUFDbEIsY0FBZ0M7UUFDcEQsS0FBSyxFQUFFLENBQUM7UUFGUyxXQUFNLEdBQU4sTUFBTSxDQUFlO1FBQ2xCLG1CQUFjLEdBQWQsY0FBYyxDQUFrQjtRQU41QyxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRWhDLGdCQUFnQjtRQUNoQixnQkFBVyxHQUFHLEtBQUssQ0FBQztJQUtwQixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLFVBQVUsQ0FBQyxVQUF5QjtRQUNsQyxPQUFPLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDakQsQ0FBQztJQUVTLFVBQVU7UUFDbEIsTUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztRQUM5QixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDakMsSUFBSSxDQUFDLFFBQVEs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QUMsRUFBRTtZQUNqQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixPQUFPO1NBQ1I7UUFFTSxXQUFZLENBQUMsU0FBUyxHQUFHLFFBQVEsR0FBRyxDQUFDLENBQUM7UUFDN0MsSUFBSSxRQUFRLEdBQUcsQ0FBQyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDO1lBQ3ZCLE9BQU87U0FDUjtRQUVELEdBQUc7UUFDSCx3RUFBd0U7UUFDeEUsd0VBQXdFO1FBQ3hFLHlFQUF5RTtRQUN6RSwyRUFBMkU7UUFDM0UsMEVBQTBFO1FBQzFFLHlFQUF5RTtRQUN6RSxlQUFlO1FBQ2YsTUFBTTtRQUNOLHFCQUFxQjtRQUNyQixlQUFlO1FBQ2YsZ0JBQWdCO1FBQ2hCLGFBQWE7UUFDYixpQkFBaUI7UUFDakIsTUFBTTtRQUNOLDRFQUE0RTtRQUM1RSxvRUFBb0U7UUFDcEUsZ0RBQWdEO1FBQ2hELDRFQUE0RTtRQUM1RSw2QkFBNkI7UUFDN0IsMkVBQTJFO1FBQzNFLDZDQUE2QztRQUM3QyxHQUFHO1FBQ0gsTUFBTSxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM1QixNQUFNLGdCQUFnQixHQUFVLFdBQVksQ0FBQyxXQUFXLENBQUM7UUFDekQsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBSSxnQkFBZ0IsSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLGdCQUFnQixLQUFLLFVBQVUsQ0FBQyxFQUFFO1lBQ3hFLGdCQUFnQixDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQ2hDO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3ViamVjdCwgU3ViamVjdFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyByZWZDb3VudCBhcyBoaWdoZXJPcmRlclJlZkNvdW50IH0gZnJvbSAnLi4vb3BlcmF0b3JzL3JlZkNvdW50JztcblxuLyoqXG4gKiBAY2xhc3MgQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IHtcblxuICBwcm90ZWN0ZWQgX3N1YmplY3Q6IFN1YmplY3Q8VD47XG4gIHByb3RlY3RlZCBfcmVmQ291bnQ6IG51bWJlciA9IDA7XG4gIHByb3RlY3RlZCBfY29ubmVjdGlvbjogU3Vic2NyaXB0aW9uO1xuICAvKiogQGludGVybmFsICovXG4gIF9pc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHNvdXJjZTogT2JzZXJ2YWJsZTxUPixcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIHN1YmplY3RGYWN0b3J5OiAoKSA9PiBTdWJqZWN0PFQ+KSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0U3ViamVjdCgpLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXRTdWJqZWN0KCk6IFN1YmplY3Q8VD4ge1xuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzLl9zdWJqZWN0O1xuICAgIGlmICghc3ViamVjdCB8fCBzdWJqZWN0LmlzU3RvcHBlZCkge1xuICAgICAgdGhpcy5fc3ViamVjdCA9IHRoaXMuc3ViamVjdEZhY3RvcnkoKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX3N1YmplY3Q7XG4gIH1cblxuICBjb25uZWN0KCk6IFN1YnNjcmlwdGlvbiB7XG4gICAgbGV0IGNvbm5lY3Rpb24gPSB0aGlzLl9jb25uZWN0aW9uO1xuICAgIGlmICghY29ubmVjdGlvbikge1xuICAgICAgdGhpcy5faXNDb21wbGV0ZSA9IGZhbHNlO1xuICAgICAgY29ubmVjdGlvbiA9IHRoaXMuX2Nvbm5lY3Rpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBjb25uZWN0aW9uLmFkZCh0aGlzLnNvdXJjZVxuICAgICAgICAuc3Vic2NyaWJlKG5ldyBDb25uZWN0YWJsZVN1YnNjcmliZXIodGhpcy5nZXRTdWJqZWN0KCksIHRoaXMpKSk7XG4gICAgICBpZiAoY29ubmVjdGlvbi5jbG9zZWQpIHtcbiAgICAgICAgdGhpcy5fY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICAgIGNvbm5lY3Rpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9jb25uZWN0aW9uID0gY29ubmVjdGlvbjtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvbm5lY3Rpb247XG4gIH1cblxuICByZWZDb3VudCgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICByZXR1cm4gaGlnaGVyT3JkZXJSZWZDb3VudCgpKHRoaXMpIGFzIE9ic2VydmFibGU8VD47XG4gIH1cbn1cblxuY29uc3QgY29ubmVjdGFibGVQcm90byA9IDxhbnk+Q29ubmVjdGFibGVPYnNlcnZhYmxlLnByb3RvdHlwZTtcblxuZXhwb3J0IGNvbnN0IGNvbm5lY3RhYmxlT2JzZXJ2YWJsZURlc2NyaXB0b3I6IFByb3BlcnR5RGVzY3JpcHRvck1hcCA9IHtcbiAgb3BlcmF0b3I6IHsgdmFsdWU6IG51bGwgfSxcbiAgX3JlZkNvdW50OiB7IHZhbHVlOiAwLCB3cml0YWJsZTogdHJ1ZSB9LFxuICBfc3ViamVjdDogeyB2YWx1ZTogbnVsbCwgd3JpdGFibGU6IHRydWUgfSxcbiAgX2Nvbm5lY3Rpb246IHsgdmFsdWU6IG51bGwsIHdyaXRhYmxlOiB0cnVlIH0sXG4gIF9zdWJzY3JpYmU6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uX3N1YnNjcmliZSB9LFxuICBfaXNDb21wbGV0ZTogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5faXNDb21wbGV0ZSwgd3JpdGFibGU6IHRydWUgfSxcbiAgZ2V0U3ViamVjdDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5nZXRTdWJqZWN0IH0sXG4gIGNvbm5lY3Q6IHsgdmFsdWU6IGNvbm5lY3RhYmxlUHJvdG8uY29ubmVjdCB9LFxuICByZWZDb3VudDogeyB2YWx1ZTogY29ubmVjdGFibGVQcm90by5yZWZDb3VudCB9XG59O1xuXG5jbGFzcyBDb25uZWN0YWJsZVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJqZWN0U3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJqZWN0PFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbm5lY3RhYmxlOiBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cbiAgcHJvdGVjdGVkIF9lcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlKCk7XG4gICAgc3VwZXIuX2Vycm9yKGVycik7XG4gIH1cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLmNvbm5lY3RhYmxlLl9pc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICB0aGlzLl91bnN1YnNjcmliZSgpO1xuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG4gIHByb3RlY3RlZCBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgY29ubmVjdGFibGUgPSA8YW55PnRoaXMuY29ubmVjdGFibGU7XG4gICAgaWYgKGNvbm5lY3RhYmxlKSB7XG4gICAgICB0aGlzLmNvbm5lY3RhYmxlID0gbnVsbDtcbiAgICAgIGNvbnN0IGNvbm5lY3Rpb24gPSBjb25uZWN0YWJsZS5fY29ubmVjdGlvbjtcbiAgICAgIGNvbm5lY3RhYmxlLl9yZWZDb3VudCA9IDA7XG4gICAgICBjb25uZWN0YWJsZS5fc3ViamVjdCA9IG51bGw7XG4gICAgICBjb25uZWN0YWJsZS5fY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICBpZiAoY29ubmVjdGlvbikge1xuICAgICAgICBjb25uZWN0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmNsYXNzIFJlZkNvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY29ubmVjdGFibGU6IENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPikge1xuICB9XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgKDxhbnk+IGNvbm5lY3RhYmxlKS5fcmVmQ291bnQrKztcblxuICAgIGNvbnN0IHJlZkNvdW50ZXIgPSBuZXcgUmVmQ291bnRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIGNvbm5lY3RhYmxlKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHJlZkNvdW50ZXIpO1xuXG4gICAgaWYgKCFyZWZDb3VudGVyLmNsb3NlZCkge1xuICAgICAgKDxhbnk+IHJlZkNvdW50ZXIpLmNvbm5lY3Rpb24gPSBjb25uZWN0YWJsZS5jb25uZWN0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxufVxuXG5jbGFzcyBSZWZDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcblxuICBwcml2YXRlIGNvbm5lY3Rpb246IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb25uZWN0YWJsZTogQ29ubmVjdGFibGVPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF91bnN1YnNjcmliZSgpIHtcblxuICAgIGNvbnN0IHsgY29ubmVjdGFibGUgfSA9IHRoaXM7XG4gICAgaWYgKCFjb25uZWN0YWJsZSkge1xuICAgICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLmNvbm5lY3RhYmxlID0gbnVsbDtcbiAgICBjb25zdCByZWZDb3VudCA9ICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50O1xuICAgIGlmIChyZWZDb3VudCA8PSAwKSB7XG4gICAgICB0aGlzLmNvbm5lY3Rpb24gPSBudWxsO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICg8YW55PiBjb25uZWN0YWJsZSkuX3JlZkNvdW50ID0gcmVmQ291bnQgLSAxO1xuICAgIGlmIChyZWZDb3VudCA+IDEpIHtcbiAgICAgIHRoaXMuY29ubmVjdGlvbiA9IG51bGw7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8vXG4gICAgLy8gQ29tcGFyZSB0aGUgbG9jYWwgUmVmQ291bnRTdWJzY3JpYmVyJ3MgY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gdG8gdGhlXG4gICAgLy8gY29ubmVjdGlvbiBTdWJzY3JpcHRpb24gb24gdGhlIHNoYXJlZCBDb25uZWN0YWJsZU9ic2VydmFibGUuIEluIGNhc2VzXG4gICAgLy8gd2hlcmUgdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSBzb3VyY2Ugc3luY2hyb25vdXNseSBlbWl0cyB2YWx1ZXMsIGFuZFxuICAgIC8vIHRoZSBSZWZDb3VudFN1YnNjcmliZXIncyBkb3duc3RyZWFtIE9ic2VydmVycyBzeW5jaHJvbm91c2x5IHVuc3Vic2NyaWJlLFxuICAgIC8vIGV4ZWN1dGlvbiBjb250aW51ZXMgdG8gaGVyZSBiZWZvcmUgdGhlIFJlZkNvdW50T3BlcmF0b3IgaGFzIGEgY2hhbmNlIHRvXG4gICAgLy8gc3VwcGx5IHRoZSBSZWZDb3VudFN1YnNjcmliZXIgd2l0aCB0aGUgc2hhcmVkIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uLlxuICAgIC8vIEZvciBleGFtcGxlOlxuICAgIC8vIGBgYFxuICAgIC8vIHJhbmdlKDAsIDEwKS5waXBlKFxuICAgIC8vICAgcHVibGlzaCgpLFxuICAgIC8vICAgcmVmQ291bnQoKSxcbiAgICAvLyAgIHRha2UoNSksXG4gICAgLy8gKS5zdWJzY3JpYmUoKTtcbiAgICAvLyBgYGBcbiAgICAvLyBJbiBvcmRlciB0byBhY2NvdW50IGZvciB0aGlzIGNhc2UsIFJlZkNvdW50U3Vic2NyaWJlciBzaG91bGQgb25seSBkaXNwb3NlXG4gICAgLy8gdGhlIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSdzIHNoYXJlZCBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBpZiB0aGVcbiAgICAvLyBjb25uZWN0aW9uIFN1YnNjcmlwdGlvbiBleGlzdHMsICphbmQqIGVpdGhlcjpcbiAgICAvLyAgIGEuIFJlZkNvdW50U3Vic2NyaWJlciBkb2Vzbid0IGhhdmUgYSByZWZlcmVuY2UgdG8gdGhlIHNoYXJlZCBjb25uZWN0aW9uXG4gICAgLy8gICAgICBTdWJzY3JpcHRpb24geWV0LCBvcixcbiAgICAvLyAgIGIuIFJlZkNvdW50U3Vic2NyaWJlcidzIGNvbm5lY3Rpb24gU3Vic2NyaXB0aW9uIHJlZmVyZW5jZSBpcyBpZGVudGljYWxcbiAgICAvLyAgICAgIHRvIHRoZSBzaGFyZWQgY29ubmVjdGlvbiBTdWJzY3JpcHRpb25cbiAgICAvLy9cbiAgICBjb25zdCB7IGNvbm5lY3Rpb24gfSA9IHRoaXM7XG4gICAgY29uc3Qgc2hhcmVkQ29ubmVjdGlvbiA9ICg8YW55PiBjb25uZWN0YWJsZSkuX2Nvbm5lY3Rpb247XG4gICAgdGhpcy5jb25uZWN0aW9uID0gbnVsbDtcblxuICAgIGlmIChzaGFyZWRDb25uZWN0aW9uICYmICghY29ubmVjdGlvbiB8fCBzaGFyZWRDb25uZWN0aW9uID09PSBjb25uZWN0aW9uKSkge1xuICAgICAgc2hhcmVkQ29ubmVjdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxufVxuIl19