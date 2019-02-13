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
var queue_1 = require("./scheduler/queue");
var Subscription_1 = require("./Subscription");
var observeOn_1 = require("./operators/observeOn");
var ObjectUnsubscribedError_1 = require("./util/ObjectUnsubscribedError");
var SubjectSubscription_1 = require("./SubjectSubscription");
/**
 * A variant of Subject that "replays" or emits old values to new subscribers.
 * It buffers a set number of values and will emit those values immediately to
 * any new subscribers in addition to emitting new values to existing subscribers.
 *
 * @class ReplaySubject<T>
 */
var ReplaySubject = /** @class */ (function (_super) {
    __extends(ReplaySubject, _super);
    function ReplaySubject(bufferSize, windowTime, scheduler) {
        if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
        if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
        var _this = _super.call(this) || this;
        _this.scheduler = scheduler;
        _this._events = [];
        _this._infiniteTimeWindow = false;
        _this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        _this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            _this._infiniteTimeWindow = true;
            _this.next = _this.nextInfiniteTimeWindow;
        }
        else {
            _this.next = _this.nextTimeWindow;
        }
        return _this;
    }
    ReplaySubject.prototype.nextInfiniteTimeWindow = function (value) {
        var _events = this._events;
        _events.push(value);
        // Since this method is invoked in every next() call than the buffer
        // can overgrow the max size only by one item
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        _super.prototype.next.call(this, value);
    };
    ReplaySubject.prototype.nextTimeWindow = function (value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        _super.prototype.next.call(this, value);
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    ReplaySubject.prototype._subscribe = function (subscriber) {
        // When `_infiniteTimeWindow === true` then the buffer is already trimmed
        var _infiniteTimeWindow = this._infiniteTimeWindow;
        var _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        var scheduler = this.scheduler;
        var len = _events.length;
        var subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError_1.ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription_1.Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription_1.SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new observeOn_1.ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (var i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i].value);
            }
        }
        if (this.hasError) {
            subscriber.error(this.thrownError);
        }
        else if (this.isStopped) {
            subscriber.complete();
        }
        return subscription;
    };
    ReplaySubject.prototype._getNow = function () {
        return (this.scheduler || queue_1.queue).now();
    };
    ReplaySubject.prototype._trimBufferThenGetEvents = function () {
        var now = this._getNow();
        var _bufferSize = this._bufferSize;
        var _windowTime = this._windowTime;
        var _events = this._events;
        var eventsCount = _events.length;
        var spliceCount = 0;
        // Trim events that fall out of the time window.
        // Start at the front of the list. Break early once
        // we encounter an event that falls within the window.
        while (spliceCount < eventsCount) {
            if ((now - _events[spliceCount].time) < _windowTime) {
                break;
            }
            spliceCount++;
        }
        if (eventsCount > _bufferSize) {
            spliceCount = Math.max(spliceCount, eventsCount - _bufferSize);
        }
        if (spliceCount > 0) {
            _events.splice(0, spliceCount);
        }
        return _events;
    };
    return ReplaySubject;
}(Subject_1.Subject));
exports.ReplaySubject = ReplaySubject;
var ReplayEvent = /** @class */ (function () {
    function ReplayEvent(time, value) {
        this.time = time;
        this.value = value;
    }
    return ReplayEvent;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGF5U3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvUmVwbGF5U3ViamVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQ0FBb0M7QUFFcEMsMkNBQTBDO0FBRTFDLCtDQUE4QztBQUM5QyxtREFBNEQ7QUFDNUQsMEVBQXlFO0FBQ3pFLDZEQUE0RDtBQUM1RDs7Ozs7O0dBTUc7QUFDSDtJQUFzQyxpQ0FBVTtJQU05Qyx1QkFBWSxVQUE2QyxFQUM3QyxVQUE2QyxFQUNyQyxTQUF5QjtRQUZqQywyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7UUFDN0MsMkJBQUEsRUFBQSxhQUFxQixNQUFNLENBQUMsaUJBQWlCO1FBRHpELFlBR0UsaUJBQU8sU0FVUjtRQVhtQixlQUFTLEdBQVQsU0FBUyxDQUFnQjtRQVByQyxhQUFPLEdBQTJCLEVBQUUsQ0FBQztRQUdyQyx5QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFNM0MsS0FBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNuRCxLQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBRW5ELElBQUksVUFBVSxLQUFLLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZQUMzQyxLQUFJLENBQUMsbUJBQW1CLEdBQUcsSUFBSSxDQUFDO1lBQ2hDLEtBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSSxDQUFDLHNCQUFzQixDQUFDO1NBQ3pDO2FBQU07WUFDTCxLQUFJLENBQUMsSUFBSSxHQUFHLEtBQUksQ0FBQyxjQUFjLENBQUM7U0FDakM7O0lBQ0gsQ0FBQztJQUVPLDhDQUFzQixHQUE5QixVQUErQixLQUFRO1FBQ3JDLElBQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDN0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwQixvRUFBb0U7UUFDcEUsNkNBQTZDO1FBQzdDLElBQUksT0FBTyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNqQjtRQUVELGlCQUFNLElBQUksWUFBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixDQUFDO0lBRU8sc0NBQWMsR0FBdEIsVUFBdUIsS0FBUTtRQUM3QixJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUVoQyxpQkFBTSxJQUFJLFlBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxrQ0FBVSxHQUFWLFVBQVcsVUFBeUI7UUFDbEMseUVBQXlFO1FBQ3pFLElBQU0sbUJBQW1CLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO1FBQ3JELElBQU0sT0FBTyxHQUFHLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsd0JBQXdCLEVBQUUsQ0FBQztRQUNyRixJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQ2pDLElBQU0sR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDM0IsSUFBSSxZQUEwQixDQUFDO1FBRS9CLElBQUksSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNmLE1BQU0sSUFBSSxpREFBdUIsRUFBRSxDQUFDO1NBQ3JDO2FBQU0sSUFBSSxJQUFJLENBQUMsU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDMUMsWUFBWSxHQUFHLDJCQUFZLENBQUMsS0FBSyxDQUFDO1NBQ25DO2FBQU07WUFDTCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNoQyxZQUFZLEdBQUcsSUFBSSx5Q0FBbUIsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUM7U0FDMUQ7UUFFRCxJQUFJLFNBQVMsRUFBRTtZQUNiLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHLElBQUksK0JBQW1CLENBQUksVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7U0FDaEY7UUFFRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFJLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ2hDO1NBQ0Y7YUFBTTtZQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUNsRCxVQUFVLENBQUMsSUFBSSxDQUFrQixPQUFPLENBQUMsQ0FBQyxDQUFFLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckQ7U0FDRjtRQUVELElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUNwQzthQUFNLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUN6QixVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7UUFFRCxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0lBRUQsK0JBQU8sR0FBUDtRQUNFLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLGFBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3pDLENBQUM7SUFFTyxnREFBd0IsR0FBaEM7UUFDRSxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBQ3JDLElBQU0sT0FBTyxHQUFxQixJQUFJLENBQUMsT0FBTyxDQUFDO1FBRS9DLElBQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7UUFDbkMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBRXBCLGdEQUFnRDtRQUNoRCxtREFBbUQ7UUFDbkQsc0RBQXNEO1FBQ3RELE9BQU8sV0FBVyxHQUFHLFdBQVcsRUFBRTtZQUNoQyxJQUFJLENBQUMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxXQUFXLEVBQUU7Z0JBQ25ELE1BQU07YUFDUDtZQUNELFdBQVcsRUFBRSxDQUFDO1NBQ2Y7UUFFRCxJQUFJLFdBQVcsR0FBRyxXQUFXLEVBQUU7WUFDN0IsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQztTQUNoRTtRQUVELElBQUksV0FBVyxHQUFHLENBQUMsRUFBRTtZQUNuQixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxXQUFXLENBQUMsQ0FBQztTQUNoQztRQUVELE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7SUFFSCxvQkFBQztBQUFELENBQUMsQUFuSEQsQ0FBc0MsaUJBQU8sR0FtSDVDO0FBbkhZLHNDQUFhO0FBcUgxQjtJQUNFLHFCQUFtQixJQUFZLEVBQVMsS0FBUTtRQUE3QixTQUFJLEdBQUosSUFBSSxDQUFRO1FBQVMsVUFBSyxHQUFMLEtBQUssQ0FBRztJQUNoRCxDQUFDO0lBQ0gsa0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuL1N1YmplY3QnO1xuaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgcXVldWUgfSBmcm9tICcuL3NjaGVkdWxlci9xdWV1ZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmVPblN1YnNjcmliZXIgfSBmcm9tICcuL29wZXJhdG9ycy9vYnNlcnZlT24nO1xuaW1wb3J0IHsgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IgfSBmcm9tICcuL3V0aWwvT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3InO1xuaW1wb3J0IHsgU3ViamVjdFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3ViamVjdFN1YnNjcmlwdGlvbic7XG4vKipcbiAqIEEgdmFyaWFudCBvZiBTdWJqZWN0IHRoYXQgXCJyZXBsYXlzXCIgb3IgZW1pdHMgb2xkIHZhbHVlcyB0byBuZXcgc3Vic2NyaWJlcnMuXG4gKiBJdCBidWZmZXJzIGEgc2V0IG51bWJlciBvZiB2YWx1ZXMgYW5kIHdpbGwgZW1pdCB0aG9zZSB2YWx1ZXMgaW1tZWRpYXRlbHkgdG9cbiAqIGFueSBuZXcgc3Vic2NyaWJlcnMgaW4gYWRkaXRpb24gdG8gZW1pdHRpbmcgbmV3IHZhbHVlcyB0byBleGlzdGluZyBzdWJzY3JpYmVycy5cbiAqXG4gKiBAY2xhc3MgUmVwbGF5U3ViamVjdDxUPlxuICovXG5leHBvcnQgY2xhc3MgUmVwbGF5U3ViamVjdDxUPiBleHRlbmRzIFN1YmplY3Q8VD4ge1xuICBwcml2YXRlIF9ldmVudHM6IChSZXBsYXlFdmVudDxUPiB8IFQpW10gPSBbXTtcbiAgcHJpdmF0ZSBfYnVmZmVyU2l6ZTogbnVtYmVyO1xuICBwcml2YXRlIF93aW5kb3dUaW1lOiBudW1iZXI7XG4gIHByaXZhdGUgX2luZmluaXRlVGltZVdpbmRvdzogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKGJ1ZmZlclNpemU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgd2luZG93VGltZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICBwcml2YXRlIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuX2J1ZmZlclNpemUgPSBidWZmZXJTaXplIDwgMSA/IDEgOiBidWZmZXJTaXplO1xuICAgIHRoaXMuX3dpbmRvd1RpbWUgPSB3aW5kb3dUaW1lIDwgMSA/IDEgOiB3aW5kb3dUaW1lO1xuXG4gICAgaWYgKHdpbmRvd1RpbWUgPT09IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSkge1xuICAgICAgdGhpcy5faW5maW5pdGVUaW1lV2luZG93ID0gdHJ1ZTtcbiAgICAgIHRoaXMubmV4dCA9IHRoaXMubmV4dEluZmluaXRlVGltZVdpbmRvdztcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5uZXh0ID0gdGhpcy5uZXh0VGltZVdpbmRvdztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG5leHRJbmZpbml0ZVRpbWVXaW5kb3codmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBfZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgIF9ldmVudHMucHVzaCh2YWx1ZSk7XG4gICAgLy8gU2luY2UgdGhpcyBtZXRob2QgaXMgaW52b2tlZCBpbiBldmVyeSBuZXh0KCkgY2FsbCB0aGFuIHRoZSBidWZmZXJcbiAgICAvLyBjYW4gb3Zlcmdyb3cgdGhlIG1heCBzaXplIG9ubHkgYnkgb25lIGl0ZW1cbiAgICBpZiAoX2V2ZW50cy5sZW5ndGggPiB0aGlzLl9idWZmZXJTaXplKSB7XG4gICAgICBfZXZlbnRzLnNoaWZ0KCk7XG4gICAgfVxuXG4gICAgc3VwZXIubmV4dCh2YWx1ZSk7XG4gIH1cblxuICBwcml2YXRlIG5leHRUaW1lV2luZG93KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy5fZXZlbnRzLnB1c2gobmV3IFJlcGxheUV2ZW50KHRoaXMuX2dldE5vdygpLCB2YWx1ZSkpO1xuICAgIHRoaXMuX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk7XG5cbiAgICBzdXBlci5uZXh0KHZhbHVlKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3N1YnNjcmliZShzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KTogU3Vic2NyaXB0aW9uIHtcbiAgICAvLyBXaGVuIGBfaW5maW5pdGVUaW1lV2luZG93ID09PSB0cnVlYCB0aGVuIHRoZSBidWZmZXIgaXMgYWxyZWFkeSB0cmltbWVkXG4gICAgY29uc3QgX2luZmluaXRlVGltZVdpbmRvdyA9IHRoaXMuX2luZmluaXRlVGltZVdpbmRvdztcbiAgICBjb25zdCBfZXZlbnRzID0gX2luZmluaXRlVGltZVdpbmRvdyA/IHRoaXMuX2V2ZW50cyA6IHRoaXMuX3RyaW1CdWZmZXJUaGVuR2V0RXZlbnRzKCk7XG4gICAgY29uc3Qgc2NoZWR1bGVyID0gdGhpcy5zY2hlZHVsZXI7XG4gICAgY29uc3QgbGVuID0gX2V2ZW50cy5sZW5ndGg7XG4gICAgbGV0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuXG4gICAgaWYgKHRoaXMuY2xvc2VkKSB7XG4gICAgICB0aHJvdyBuZXcgT2JqZWN0VW5zdWJzY3JpYmVkRXJyb3IoKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuaXNTdG9wcGVkIHx8IHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5vYnNlcnZlcnMucHVzaChzdWJzY3JpYmVyKTtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJqZWN0U3Vic2NyaXB0aW9uKHRoaXMsIHN1YnNjcmliZXIpO1xuICAgIH1cblxuICAgIGlmIChzY2hlZHVsZXIpIHtcbiAgICAgIHN1YnNjcmliZXIuYWRkKHN1YnNjcmliZXIgPSBuZXcgT2JzZXJ2ZU9uU3Vic2NyaWJlcjxUPihzdWJzY3JpYmVyLCBzY2hlZHVsZXIpKTtcbiAgICB9XG5cbiAgICBpZiAoX2luZmluaXRlVGltZVdpbmRvdykge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KDxUPl9ldmVudHNbaV0pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbiAmJiAhc3Vic2NyaWJlci5jbG9zZWQ7IGkrKykge1xuICAgICAgICBzdWJzY3JpYmVyLm5leHQoKDxSZXBsYXlFdmVudDxUPj5fZXZlbnRzW2ldKS52YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaGFzRXJyb3IpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IodGhpcy50aHJvd25FcnJvcik7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH1cblxuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cblxuICBfZ2V0Tm93KCk6IG51bWJlciB7XG4gICAgcmV0dXJuICh0aGlzLnNjaGVkdWxlciB8fCBxdWV1ZSkubm93KCk7XG4gIH1cblxuICBwcml2YXRlIF90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpOiBSZXBsYXlFdmVudDxUPltdIHtcbiAgICBjb25zdCBub3cgPSB0aGlzLl9nZXROb3coKTtcbiAgICBjb25zdCBfYnVmZmVyU2l6ZSA9IHRoaXMuX2J1ZmZlclNpemU7XG4gICAgY29uc3QgX3dpbmRvd1RpbWUgPSB0aGlzLl93aW5kb3dUaW1lO1xuICAgIGNvbnN0IF9ldmVudHMgPSA8UmVwbGF5RXZlbnQ8VD5bXT50aGlzLl9ldmVudHM7XG5cbiAgICBjb25zdCBldmVudHNDb3VudCA9IF9ldmVudHMubGVuZ3RoO1xuICAgIGxldCBzcGxpY2VDb3VudCA9IDA7XG5cbiAgICAvLyBUcmltIGV2ZW50cyB0aGF0IGZhbGwgb3V0IG9mIHRoZSB0aW1lIHdpbmRvdy5cbiAgICAvLyBTdGFydCBhdCB0aGUgZnJvbnQgb2YgdGhlIGxpc3QuIEJyZWFrIGVhcmx5IG9uY2VcbiAgICAvLyB3ZSBlbmNvdW50ZXIgYW4gZXZlbnQgdGhhdCBmYWxscyB3aXRoaW4gdGhlIHdpbmRvdy5cbiAgICB3aGlsZSAoc3BsaWNlQ291bnQgPCBldmVudHNDb3VudCkge1xuICAgICAgaWYgKChub3cgLSBfZXZlbnRzW3NwbGljZUNvdW50XS50aW1lKSA8IF93aW5kb3dUaW1lKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgc3BsaWNlQ291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoZXZlbnRzQ291bnQgPiBfYnVmZmVyU2l6ZSkge1xuICAgICAgc3BsaWNlQ291bnQgPSBNYXRoLm1heChzcGxpY2VDb3VudCwgZXZlbnRzQ291bnQgLSBfYnVmZmVyU2l6ZSk7XG4gICAgfVxuXG4gICAgaWYgKHNwbGljZUNvdW50ID4gMCkge1xuICAgICAgX2V2ZW50cy5zcGxpY2UoMCwgc3BsaWNlQ291bnQpO1xuICAgIH1cblxuICAgIHJldHVybiBfZXZlbnRzO1xuICB9XG5cbn1cblxuY2xhc3MgUmVwbGF5RXZlbnQ8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdGltZTogbnVtYmVyLCBwdWJsaWMgdmFsdWU6IFQpIHtcbiAgfVxufVxuIl19