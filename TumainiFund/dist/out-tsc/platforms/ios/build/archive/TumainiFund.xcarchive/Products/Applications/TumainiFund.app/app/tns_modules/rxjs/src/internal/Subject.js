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
var Observable_1 = require("./Observable");
var Subscriber_1 = require("./Subscriber");
var Subscription_1 = require("./Subscription");
var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
var SubjectSubscription_1 = require("./SubjectSubscription");
var rxSubscriber_1 = require("../internal/symbol/rxSubscriber");
/**
 * @class SubjectSubscriber<T>
 */
var SubjectSubscriber = /** @class */ (function (_super) {
    __extends(SubjectSubscriber, _super);
    function SubjectSubscriber(destination) {
        var _this = _super.call(this, destination) || this;
        _this.destination = destination;
        return _this;
    }
    return SubjectSubscriber;
}(Subscriber_1.Subscriber));
exports.SubjectSubscriber = SubjectSubscriber;
/**
 * A Subject is a special type of Observable that allows values to be
 * multicasted to many Observables. Subjects are like EventEmitters.
 *
 * Every Subject is an Observable and an Observer. You can subscribe to a
 * Subject, and you can call next to feed values as well as error and complete.
 *
 * @class Subject<T>
 */
var Subject = /** @class */ (function (_super) {
    __extends(Subject, _super);
    function Subject() {
        var _this = _super.call(this) || this;
        _this.observers = [];
        _this.closed = false;
        _this.isStopped = false;
        _this.hasError = false;
        _this.thrownError = null;
        return _this;
    }
    Subject.prototype[rxSubscriber_1.rxSubscriber] = function () {
        return new SubjectSubscriber(this);
    };
    Subject.prototype.lift = function (operator) {
        var subject = new AnonymousSubject(this, this);
        subject.operator = operator;
        return subject;
    };
    Subject.prototype.next = function (value) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        if (!this.isStopped) {
            var observers = this.observers;
            var len = observers.length;
            var copy = observers.slice();
            for (var i = 0; i < len; i++) {
                copy[i].next(value);
            }
        }
    };
    Subject.prototype.error = function (err) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.hasError = true;
        this.thrownError = err;
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].error(err);
        }
        this.observers.length = 0;
    };
    Subject.prototype.complete = function () {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        this.isStopped = true;
        var observers = this.observers;
        var len = observers.length;
        var copy = observers.slice();
        for (var i = 0; i < len; i++) {
            copy[i].complete();
        }
        this.observers.length = 0;
    };
    Subject.prototype.unsubscribe = function () {
        this.isStopped = true;
        this.closed = true;
        this.observers = null;
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    Subject.prototype._trySubscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else {
            return _super.prototype._trySubscribe.call(this, subscriber);
        }
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    Subject.prototype._subscribe = function (subscriber) {
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.hasError) {
            subscriber.error(this.thrownError);
            return Subscription_1.Subscription.EMPTY;
        }
        else if (this.isStopped) {
            subscriber.complete();
            return Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            return new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
    };
    /**
     * Creates a new Observable with this Subject as the source. You can do this
     * to create customize Observer-side logic of the Subject and conceal it from
     * code that uses the Observable.
     * @return {Observable} Observable that the Subject casts to
     */
    Subject.prototype.asObservable = function () {
        var observable = new Observable_1.Observable();
        observable.source = this;
        return observable;
    };
    /**@nocollapse */
    Subject.create = function (destination, source) {
        return new AnonymousSubject(destination, source);
    };
    return Subject;
}(Observable_1.Observable));
exports.Subject = Subject;
/**
 * @class AnonymousSubject<T>
 */
var AnonymousSubject = /** @class */ (function (_super) {
    __extends(AnonymousSubject, _super);
    function AnonymousSubject(destination, source) {
        var _this = _super.call(this) || this;
        _this.destination = destination;
        _this.source = source;
        return _this;
    }
    AnonymousSubject.prototype.next = function (value) {
        var destination = this.destination;
        if (destination && destination.next) {
            destination.next(value);
        }
    };
    AnonymousSubject.prototype.error = function (err) {
        var destination = this.destination;
        if (destination && destination.error) {
            this.destination.error(err);
        }
    };
    AnonymousSubject.prototype.complete = function () {
        var destination = this.destination;
        if (destination && destination.complete) {
            this.destination.complete();
        }
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    AnonymousSubject.prototype._subscribe = function (subscriber) {
        var source = this.source;
        if (source) {
            return this.source.subscribe(subscriber);
        }
        else {
            return Subscription_1.Subscription.EMPTY;
        }
    };
    return AnonymousSubject;
}(Subject));
exports.AnonymousSubject = AnonymousSubject;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvU3ViamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBMEM7QUFDMUMsMkNBQTBDO0FBQzFDLCtDQUE4QztBQUU5QywwRUFBeUU7QUFDekUsNkRBQTREO0FBQzVELGdFQUFxRjtBQUVyRjs7R0FFRztBQUNIO0lBQTBDLHFDQUFhO0lBQ3JELDJCQUFzQixXQUF1QjtRQUE3QyxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUNuQjtRQUZxQixpQkFBVyxHQUFYLFdBQVcsQ0FBWTs7SUFFN0MsQ0FBQztJQUNILHdCQUFDO0FBQUQsQ0FBQyxBQUpELENBQTBDLHVCQUFVLEdBSW5EO0FBSlksOENBQWlCO0FBTTlCOzs7Ozs7OztHQVFHO0FBQ0g7SUFBZ0MsMkJBQWE7SUFnQjNDO1FBQUEsWUFDRSxpQkFBTyxTQUNSO1FBWkQsZUFBUyxHQUFrQixFQUFFLENBQUM7UUFFOUIsWUFBTSxHQUFHLEtBQUssQ0FBQztRQUVmLGVBQVMsR0FBRyxLQUFLLENBQUM7UUFFbEIsY0FBUSxHQUFHLEtBQUssQ0FBQztRQUVqQixpQkFBVyxHQUFRLElBQUksQ0FBQzs7SUFJeEIsQ0FBQztJQWhCRCxrQkFBQywyQkFBa0IsQ0FBQyxHQUFwQjtRQUNFLE9BQU8sSUFBSSxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQyxDQUFDO0lBcUJELHNCQUFJLEdBQUosVUFBUSxRQUF3QjtRQUM5QixJQUFNLE9BQU8sR0FBRyxJQUFJLGdCQUFnQixDQUFDLElBQUksRUFBRSxJQUFJ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SSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELGdDQUFLLEdBQUwsVUFBTSxHQUFRO1FBQ0osSUFBQSw4QkFBVyxDQUFVO1FBQzdCLElBQUksV0FBVyxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQsbUNBQVEsR0FBUjtRQUNVLElBQUEsOEJBQVcsQ0FBVTtRQUM3QixJQUFJLFdBQVcsSUFBSSxXQUFXLENBQUMsUUFBUSxFQUFFO1lBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLHFDQUFVLEdBQVYsVUFBVyxVQUF5QjtRQUMxQixJQUFBLG9CQUFNLENBQVU7UUFDeEIsSUFBSSxNQUFNLEVBQUU7WUFDVixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO2FBQU07WUFDTCxPQUFPLDJCQUFZLENBQUMsS0FBSyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUNILHVCQUFDO0FBQUQsQ0FBQyxBQXBDRCxDQUF5QyxPQUFPLEdBb0MvQztBQXBDWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmVyLCBTdWJzY3JpcHRpb25MaWtlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBPYmplY3RVbnN1YnNjcmliZWRFcnJvciB9IGZyb20gJy4vdXRpbC9PYmplY3RVbnN1YnNjcmliZWRFcnJvcic7XG5pbXBvcnQgeyBTdWJqZWN0U3Vic2NyaXB0aW9uIH0gZnJvbSAnLi9TdWJqZWN0U3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IHJ4U3Vic2NyaWJlciBhcyByeFN1YnNjcmliZXJTeW1ib2wgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvcnhTdWJzY3JpYmVyJztcblxuLyoqXG4gKiBAY2xhc3MgU3ViamVjdFN1YnNjcmliZXI8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3RTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3ViamVjdDxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIEEgU3ViamVjdCBpcyBhIHNwZWNpYWwgdHlwZSBvZiBPYnNlcnZhYmxlIHRoYXQgYWxsb3dzIHZhbHVlcyB0byBiZVxuICogbXVsdGljYXN0ZWQgdG8gbWFueSBPYnNlcnZhYmxlcy4gU3ViamVjdHMgYXJlIGxpa2UgRXZlbnRFbWl0dGVycy5cbiAqXG4gKiBFdmVyeSBTdWJqZWN0IGlzIGFuIE9ic2VydmFibGUgYW5kIGFuIE9ic2VydmVyLiBZb3UgY2FuIHN1YnNjcmliZSB0byBhXG4gKiBTdWJqZWN0LCBhbmQgeW91IGNhbiBjYWxsIG5leHQgdG8gZmVlZCB2YWx1ZXMgYXMgd2VsbCBhcyBlcnJvciBhbmQgY29tcGxldGUuXG4gKlxuICogQGNsYXNzIFN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFN1YmplY3Q8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTGlrZSB7XG5cbiAgW3J4U3Vic2NyaWJlclN5bWJvbF0oKSB7XG4gICAgcmV0dXJuIG5ldyBTdWJqZWN0U3Vic2NyaWJlcih0aGlzKTtcbiAgfVxuXG4gIG9ic2VydmVyczogT2JzZXJ2ZXI8VD5bXSA9IFtdO1xuXG4gIGNsb3NlZCA9IGZhbHNlO1xuXG4gIGlzU3RvcHBlZCA9IGZhbHNlO1xuXG4gIGhhc0Vycm9yID0gZmFsc2U7XG5cbiAgdGhyb3duRXJyb3I6IGFueSA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgc3VwZXIoKTtcbiAgfVxuXG4gIC8qKkBub2NvbGxhcHNlICovXG4gIHN0YXRpYyBjcmVhdGU6IEZ1bmN0aW9uID0gPFQ+KGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxUPiwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogQW5vbnltb3VzU3ViamVjdDxUPiA9PiB7XG4gICAgcmV0dXJuIG5ldyBBbm9ueW1vdXNTdWJqZWN0PFQ+KGRlc3RpbmF0aW9uLCBzb3VyY2UpO1xuICB9XG5cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBzdWJqZWN0ID0gbmV3IEFub255bW91c1N1YmplY3QodGhpcywgdGhpcyk7XG4gICAgc3ViamVjdC5vcGVyYXRvciA9IDxhbnk+b3BlcmF0b3I7XG4gICAgcmV0dXJuIDxhbnk+c3ViamVjdDtcbiAgfVxuXG4gIG5leHQodmFsdWU/OiBUKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgICBjb25zdCBsZW4gPSBvYnNlcnZlcnMubGVuZ3RoO1xuICAgICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb3B5W2ldLm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5oYXNFcnJvciA9IHRydWU7XG4gICAgdGhpcy50aHJvd25FcnJvciA9IGVycjtcbiAgICB0aGlzLmlzU3RvcHBlZCA9IHRydWU7XG4gICAgY29uc3QgeyBvYnNlcnZlcnMgfSA9IHRoaXM7XG4gICAgY29uc3QgbGVuID0gb2JzZXJ2ZXJzLmxlbmd0aDtcbiAgICBjb25zdCBjb3B5ID0gb2JzZXJ2ZXJzLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29weVtpXS5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB0aGlzLm9ic2VydmVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9XG4gICAgdGhpcy5pc1N0b3BwZWQgPSB0cnVlO1xuICAgIGNvbnN0IHsgb2JzZXJ2ZXJzIH0gPSB0aGlzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmVycy5sZW5ndGg7XG4gICAgY29uc3QgY29weSA9IG9ic2VydmVycy5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvcHlbaV0uY29tcGxldGUoKTtcbiAgICB9XG4gICAgdGhpcy5vYnNlcnZlcnMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHVuc3Vic2NyaWJlKCkge1xuICAgIHRoaXMuaXNTdG9wcGVkID0gdHJ1ZTtcbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gICAgdGhpcy5vYnNlcnZlcnMgPSBudWxsO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdHJ5U3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBUZWFyZG93bkxvZ2ljIHtcbiAgICBpZiAodGhpcy5jbG9zZWQpIHtcbiAgICAgIHRocm93IG5ldyBPYmplY3RVbnN1YnNjcmliZWRFcnJvcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gc3VwZXIuX3RyeVN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgICByZXR1cm4gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICByZXR1cm4gbmV3IFN1YmplY3RTdWJzY3JpcHRpb24odGhpcywgc3Vic2NyaWJlcik7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgT2JzZXJ2YWJsZSB3aXRoIHRoaXMgU3ViamVjdCBhcyB0aGUgc291cmNlLiBZb3UgY2FuIGRvIHRoaXNcbiAgICogdG8gY3JlYXRlIGN1c3RvbWl6ZSBPYnNlcnZlci1zaWRlIGxvZ2ljIG9mIHRoZSBTdWJqZWN0IGFuZCBjb25jZWFsIGl0IGZyb21cbiAgICogY29kZSB0aGF0IHVzZXMgdGhlIE9ic2VydmFibGUuXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IE9ic2VydmFibGUgdGhhdCB0aGUgU3ViamVjdCBjYXN0cyB0b1xuICAgKi9cbiAgYXNPYnNlcnZhYmxlKCk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IG9ic2VydmFibGUgPSBuZXcgT2JzZXJ2YWJsZTxUPigpO1xuICAgICg8YW55Pm9ic2VydmFibGUpLnNvdXJjZSA9IHRoaXM7XG4gICAgcmV0dXJuIG9ic2VydmFibGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgQW5vbnltb3VzU3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGVzdGluYXRpb24/OiBPYnNlcnZlcjxUPiwgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gIH1cblxuICBuZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgeyBkZXN0aW5hdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24ubmV4dCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZXJyb3IoZXJyOiBhbnkpIHtcbiAgICBjb25zdCB7IGRlc3RpbmF0aW9uIH0gPSB0aGlzO1xuICAgIGlmIChkZXN0aW5hdGlvbiAmJiBkZXN0aW5hdGlvbi5lcnJvcikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBsZXRlKCkge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uLmNvbXBsZXRlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pOiBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0IHsgc291cmNlIH0gPSB0aGlzO1xuICAgIGlmIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLnNvdXJjZS5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfVxuICB9XG59XG4iXX0=