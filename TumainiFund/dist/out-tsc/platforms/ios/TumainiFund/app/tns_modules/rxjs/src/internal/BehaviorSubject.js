import { Subject } from './Subject';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
/**
 * A variant of Subject that requires an initial value and emits its current
 * value whenever it is subscribed to.
 *
 * @class BehaviorSubject<T>
 */
export class BehaviorSubject extends Subject {
    constructor(_value) {
        super();
        this._value = _value;
    }
    get value() {
        return this.getValue();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        const subscription = super._subscribe(subscriber);
        if (subscription && !subscription.closed) {
            subscriber.next(this._value);
        }
        return subscription;
    }
    getValue() {
        if (this.hasError) {
            throw this.thrownError;
        }
        else if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return this._value;
        }
    }
    next(value) {
        super.next(this._value = value);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQmVoYXZpb3JTdWJqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvQmVoYXZpb3JTdWJqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFJcEMsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFekU7Ozs7O0dBS0c7QUFDSCxNQUFNLE9BQU8sZUFBbUIsU0FBUSxPQUFVO0lBRWhELFlBQW9CLE1BQVM7UUFDM0IsS0FBSyxFQUFFLENBQUM7UUFEVSxXQUFNLEdBQU4sTUFBTSxDQUFHO0lBRTdCLENBQUM7SUFFRCxJQUFJLEtBQUs7UUFDUCxPQUFPLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN6QixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLFVBQVUsQ0FBQyxVQUF5QjtRQUNsQyxNQUFNLFlBQVksR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ2xELElBQUksWUFBWSxJQUFJLENBQW9CLFlBQWEsQ0FBQyxNQUFNLEVBQUU7WUFDNUQsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDOUI7UUFDRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixNQUFNLElBQUksQ0FBQyxXQUFXLENBQUM7U0FDeEI7YUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLEVBQUU7WUFDdEIsTUFBTSxJQUFJLHVCQUF1QixFQUFFLENBQUM7U0FDckM7YUFBTTtZQUNMLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUNwQjtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsS0FBUTtRQUNYLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsQ0FBQztJQUNsQyxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgcmVxdWlyZXMgYW4gaW5pdGlhbCB2YWx1ZSBhbmQgZW1pdHMgaXRzIGN1cnJlbnRcbiAqIHZhbHVlIHdoZW5ldmVyIGl0IGlzIHN1YnNjcmliZWQgdG8uXG4gKlxuICogQGNsYXNzIEJlaGF2aW9yU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQmVoYXZpb3JTdWJqZWN0PFQ+IGV4dGVuZHMgU3ViamVjdDxUPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBfdmFsdWU6IFQpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgZ2V0IHZhbHVlKCk6IFQge1xuICAgIHJldHVybiB0aGlzLmdldFZhbHVlKCk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICBpZiAoc3Vic2NyaXB0aW9uICYmICEoPFN1YnNjcmlwdGlvbkxpa2U+c3Vic2NyaXB0aW9uKS5jbG9zZWQpIHtcbiAgICAgIHN1YnNjcmliZXIubmV4dCh0aGlzLl92YWx1ZSk7XG4gICAgfVxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBnZXRWYWx1ZSgpOiBUIHtcbiAgICBpZiAodGhpcy5oYXNFcnJvcikge1xuICAgICAgdGhyb3cgdGhpcy50aHJvd25FcnJvcjtcbiAgICB9IGVsc2UgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3ZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBzdXBlci5uZXh0KHRoaXMuX3ZhbHVlID0gdmFsdWUpO1xuICB9XG59XG4iXX0=