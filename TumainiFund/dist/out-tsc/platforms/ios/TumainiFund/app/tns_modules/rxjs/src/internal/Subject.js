import { Observable } from './Observable';
import { Subscriber } from './Subscriber';
import { Subscription } from './Subscription';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
import { SubjectSubscription } from './SubjectSubscription';
import { rxSubscriber as rxSubscriberSymbol } from '../internal/symbol/rxSubscriber';
/**
 * @class SubjectSubscriber<T>
 */
export class SubjectSubscriber extends Subscriber {
    constructor(destination) {
        super(destination);
        this.destination = destination;
    }
}
/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observables. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 *
 * @class Subject<T>
 */
export class Subject extends Observable {
    constructor() {
        super();
        this.observers = [];
        this.closed = false;
        this.isStopped = false;
        this.hasError = false;
        this.thrownError = null;
    }
    [rxSubscriberSymbol]() {
        return new SubjectSubscriber(this);
    }
    lift(operator) {
        const subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    }
    next(value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            const { observers } = this;
            const len = observers.length;
            const copy = observers.slice();
            for (let i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    }
    error(err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    }
    complete() {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        this.isStopped = true;
        const { observers } = this;
        const len = observers.length;
        const copy = observers.slice();
        for (let i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    }
    unsubscribe() {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _trySubscribe(subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else {
            return super._trySubscribe(subscriber);
        }
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription(this, subscriber);
        }
    }
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create customize Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return {Observable} Observable that the Subject casts to
     */
    asObservable() {
        const observable = new Observable();
        observable.source = this;
        return observable;
    }
}
/**@nocollapse */
Subject.create = (destination, source) => {
    return new AnonymousSubject(destination, source);
};
/**
 * @class AnonymousSubject<T>
 */
export class AnonymousSubject extends Subject {
    constructor(destination, source) {
        super();
        this.destination = destination;
        this.source = source;
    }
    next(value) {
        const { destination } = this;
        if (destination && destination.next) {
            destination.next(value);
        }
    }
    error(err) {
        const { destination } = this;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    }
    complete() {
        const { destination } = this;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        const { source } = this;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription.EMPTY;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL1N1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBQzFDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU5QyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQUN6RSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUM1RCxPQUFPLEVBQUUsWUFBWSxJQUFJLGtCQUFrQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFFckY7O0dBRUc7QUFDSCxNQUFNLE9BQU8saUJBQXFCLFNBQVEsVUFBYTtJQUNyRCxZQUFzQixXQUF1QjtRQUMzQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFEQyxnQkFBVyxHQUFYLFdBQVcsQ0FBWTtJQUU3QyxDQUFDO0NBQ0Y7QUFFRDs7Ozs7Ozs7R0FRRztBQUNILE1BQU0sT0FBTyxPQUFXLFNBQVEsVUFBYTtJQWdCM0M7UUFDRSxLQUFLLEVBQUUsQ0FBQztRQVhWLGNBQVMsR0FBa0IsRUFBRSxDQUFDO1FBRTlCLFdBQU0sR0FBRyxLQUFLLENBQUM7UUFFZixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBRWxCLGFBQVEsR0FBRyxLQUFLLENBQUM7UUFFakIsZ0JBQVcsR0FBUSxJQUFJLENBQUM7SUFJeEIsQ0FBQztJQWhCRCxDQUFDLGtCQUFrQixDQUFDO1FBQ2xCLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBcUJELElBQUksQ0FBSSxR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QzdCLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxJQUFJLEVBQUU7WUFDbkMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUN6QjtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsR0FBUTtRQUNaLE1BQU0sRUFBRSxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0IsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLEtBQUssRUFBRTtZQUNwQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFRCxRQUFRO1FBQ04sTUFBTSxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLFVBQVUsQ0FBQyxVQUF5QjtRQUNsQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLElBQUksTUFBTSxFQUFFO1lBQ1YsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztTQUMxQzthQUFNO1lBQ0wsT0FBTyxZQUFZLENBQUMsS0FBSyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZlciwgU3Vic2NyaXB0aW9uTGlrZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuaW1wb3J0IHsgU3ViamVjdFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3ViamVjdFN1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyByeFN1YnNjcmliZXIgYXMgcnhTdWJzY3JpYmVyU3ltYm9sIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL3J4U3Vic2NyaWJlcic7XG5cbi8qKlxuICogQGNsYXNzIFN1YmplY3RTdWJzY3JpYmVyPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb246IFN1YmplY3Q8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBBIFN1YmplY3QgaXMgYSBzcGVjaWFsIHR5cGUgb2YgT2JzZXJ2YWJsZSB0aGF0IGFsbG93cyB2YWx1ZXMgdG8gYmVcbiAqIG11bHRpY2FzdGVkIHRvIG1hbnkgT2JzZXJ2YWJsZXMuIFN1YmplY3RzIGFyZSBsaWtlIEV2ZW50RW1pdHRlcnMuXG4gKlxuICogRXZlcnkgU3ViamVjdCBpcyBhbiBPYnNlcnZhYmxlIGFuZCBhbiBPYnNlcnZlci4gWW91IGNhbiBzdWJzY3JpYmUgdG8gYVxuICogU3ViamVjdCwgYW5kIHlvdSBjYW4gY2FsbCBuZXh0IHRvIGZlZWQgdmFsdWVzIGFzIHdlbGwgYXMgZXJyb3IgYW5kIGNvbXBsZXRlLlxuICpcbiAqIEBjbGFzcyBTdWJqZWN0PFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBTdWJqZWN0PFQ+IGV4dGVuZHMgT2JzZXJ2YWJsZTxUPiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbkxpa2Uge1xuXG4gIFtyeFN1YnNjcmliZXJTeW1ib2xdKCkge1xuICAgIHJldHVybiBuZXcgU3ViamVjdFN1YnNjcmliZXIodGhpcyk7XG4gIH1cblxuICBvYnNlcnZlcnM6IE9ic2VydmVyPFQ+W10gPSBbXTtcblxuICBjbG9zZWQgPSBmYWxzZTtcblxuICBpc1N0b3BwZWQgPSBmYWxzZTtcblxuICBoYXNFcnJvciA9IGZhbHNlO1xuXG4gIHRocm93bkVycm9yOiBhbnkgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICAvKipAbm9jb2xsYXBzZSAqL1xuICBzdGF0aWMgY3JlYXRlOiBGdW5jdGlvbiA9IDxUPihkZXN0aW5hdGlvbjogT2JzZXJ2ZXI8VD4sIHNvdXJjZTogT2JzZXJ2YWJsZTxUPik6IEFub255bW91c1N1YmplY3Q8VD4gPT4ge1xuICAgIHJldHVybiBuZXcgQW5vbnltb3VzU3ViamVjdDxUPihkZXN0aW5hdGlvbiwgc291cmNlKTtcbiAgfVxuXG4gIGxpZnQ8Uj4ob3BlcmF0b3I6IE9wZXJhdG9yPFQsIFI+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgY29uc3Qgc3ViamVjdCA9IG5ldyBBbm9ueW1vdXNTdWJqZWN0KHRoaXMsIHRoaXMpO1xuICAgIHN1YmplY3Qub3BlcmF0b3IgPSA8YW55Pm9wZXJhdG9yO1xuICAgIHJldHVybiA8YW55PnN1YmplY3Q7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogVCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfVxuICAgIGlmICghdGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIGNvbnN0IHsgb2JzZXJ2ZXJzIH0gPSB0aGlzO1xuICAgICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29weVtpXS5uZXh0KHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBlcnJvcihlcnI6IGFueSkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuaGFzRXJyb3IgPSB0cnVlO1xuICAgIHRoaXMudGhyb3duRXJyb3IgPSBlcnI7XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIGNvbnN0IHsgb2JzZXJ2ZXJzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvcHlbaV0uZXJyb3IoZXJyKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIGNvbXBsZXRlKCkge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfVxuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICBjb25zdCB7IG9ic2VydmVycyB9ID0gdGhpcztcbiAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgIGNvbnN0IGNvcHkgPSBvYnNlcnZlcnMuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb3B5W2ldLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMub2JzZXJ2ZXJzLmxlbmd0aCA9IDA7XG4gIH1cblxuICB1bnN1YnNjcmliZSgpIHtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICAgIHRoaXMub2JzZXJ2ZXJzID0gbnVsbDtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHN1cGVyLl90cnlTdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgICAgcmV0dXJuIFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm9ic2VydmVycy5wdXNoKHN1YnNjcmliZXIpO1xuICAgICAgcmV0dXJuIG5ldyBTdWJqZWN0U3Vic2NyaXB0aW9uKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9ic2VydmFibGUgd2l0aCB0aGlzIFN1YmplY3QgYXMgdGhlIHNvdXJjZS4gWW91IGNhbiBkbyB0aGlzXG4gICAqIHRvIGNyZWF0ZSBjdXN0b21pemUgT2JzZXJ2ZXItc2lkZSBsb2dpYyBvZiB0aGUgU3ViamVjdCBhbmQgY29uY2VhbCBpdCBmcm9tXG4gICAqIGNvZGUgdGhhdCB1c2VzIHRoZSBPYnNlcnZhYmxlLlxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBPYnNlcnZhYmxlIHRoYXQgdGhlIFN1YmplY3QgY2FzdHMgdG9cbiAgICovXG4gIGFzT2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8VD4oKTtcbiAgICAoPGFueT5vYnNlcnZhYmxlKS5zb3VyY2UgPSB0aGlzO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG59XG5cbi8qKlxuICogQGNsYXNzIEFub255bW91c1N1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIEFub255bW91c1N1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRlc3RpbmF0aW9uPzogT2JzZXJ2ZXI8VD4sIHNvdXJjZT86IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc291cmNlID0gc291cmNlO1xuICB9XG5cbiAgbmV4dCh2YWx1ZTogVCkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLm5leHQpIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24uZXJyb3IpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBjb21wbGV0ZSgpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5jb21wbGV0ZSkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCB7IHNvdXJjZSB9ID0gdGhpcztcbiAgICBpZiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH1cbiAgfVxufVxuIl19