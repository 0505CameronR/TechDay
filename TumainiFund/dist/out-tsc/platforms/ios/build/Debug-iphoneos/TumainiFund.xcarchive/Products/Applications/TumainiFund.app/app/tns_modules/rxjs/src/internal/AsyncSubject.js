import { Subject } from './Subject';
import { Subscription } from './Subscription';
/**
 * A variant of Subject that only emits a value when it completes. It will emit
 * its latest value to all its observers on completion.
 *
 * @class AsyncSubject<T>
 */
export class AsyncSubject extends Subject {
    constructor() {
        super(...arguments);
        this.value = null;
        this.hasNext = false;
        this.hasCompleted = false;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.hasCompleted && this.hasNext) {
            subscriber.next(this.value);
            subscriber.complete();
            return Subscription.EMPTY;
        }
        return super._subscribe(subscriber);
    }
    next(value) {
        if (!this.hasCompleted) {
            this.value = value;
            this.hasNext = true;
        }
    }
    error(error) {
        if (!this.hasCompleted) {
            super.error(error);
        }
    }
    complete() {
        this.hasCompleted = true;
        if (this.hasNext) {
            super.next(this.value);
        }
        super.complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQXN5bmNTdWJqZWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvQXN5bmNTdWJqZWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxXQUFXLENBQUM7QUFFcEMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLFlBQWdCLFNBQVEsT0FBVTtJQUEvQzs7UUFDVSxVQUFLLEdBQU0sSUFBSSxDQUFDO1FBQ2hCLFlBQU8sR0FBWSxLQUFLLENBQUM7UUFDekIsaUJBQVksR0FBWSxLQUFLLENBQUM7SUFtQ3hDLENBQUM7SUFqQ0MseUVBQXlFO0lBQ3pFLFVBQVUsQ0FBQyxVQUEyQjtRQUNwQyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsVUFBVSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbkMsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDO1NBQzNCO2FBQU0sSUFBSSxJQUFJLENBQUMsWUFBWSxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDNUMsVUFBVSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDNUIsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ3RCLE9BQU8sWUFBWSxDQUFDLEtBQUssQ0FBQztTQUMzQjtRQUNELE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRUQsSUFBSSxDQUFDLEtBQVE7UUFDWCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtZQUN0QixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztZQUNuQixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztTQUNyQjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsS0FBVTtRQUNkLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNoQixLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN4QjtRQUNELEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUNuQixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgb25seSBlbWl0cyBhIHZhbHVlIHdoZW4gaXQgY29tcGxldGVzLiBJdCB3aWxsIGVtaXRcbiAqIGl0cyBsYXRlc3QgdmFsdWUgdG8gYWxsIGl0cyBvYnNlcnZlcnMgb24gY29tcGxldGlvbi5cbiAqXG4gKiBAY2xhc3MgQXN5bmNTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBBc3luY1N1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZTogVCA9IG51bGw7XG4gIHByaXZhdGUgaGFzTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGhhc0NvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzQ29tcGxldGVkICYmIHRoaXMuaGFzTmV4dCkge1xuICAgICAgc3Vic2NyaWJlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9XG4gICAgcmV0dXJuIHN1cGVyLl9zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgICAgdGhpcy5oYXNOZXh0ID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnJvcjogYW55KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc0NvbXBsZXRlZCkge1xuICAgICAgc3VwZXIuZXJyb3IoZXJyb3IpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuaGFzQ29tcGxldGVkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5oYXNOZXh0KSB7XG4gICAgICBzdXBlci5uZXh0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgICBzdXBlci5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=