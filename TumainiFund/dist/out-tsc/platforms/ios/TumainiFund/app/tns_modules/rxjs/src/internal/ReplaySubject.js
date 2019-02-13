import { Subject } from './Subject';
import { queue } from './scheduler/queue';
import { Subscription } from './Subscription';
import { ObserveOnSubscriber } from './operators/observeOn';
import { ObjectUnsubscribedError } from './util/ObjectUnsubscribedError';
import { SubjectSubscription } from './SubjectSubscription';
/**
 * A variant of Subject that "replays" or emits old values to new subscribers.
 * It buffers a set number of values and will emit those values immediately to
 * any new subscribers in addition to emitting new values to existing subscribers.
 *
 * @class ReplaySubject<T>
 */
export class ReplaySubject extends Subject {
    constructor(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
        super();
        this.scheduler = scheduler;
        this._events = [];
        this._infiniteTimeWindow = false;
        this._bufferSize = bufferSize < 1 ? 1 : bufferSize;
        this._windowTime = windowTime < 1 ? 1 : windowTime;
        if (windowTime === Number.POSITIVE_INFINITY) {
            this._infiniteTimeWindow = true;
            this.next = this.nextInfiniteTimeWindow;
        }
        else {
            this.next = this.nextTimeWindow;
        }
    }
    nextInfiniteTimeWindow(value) {
        const _events = this._events;
        _events.push(value);
        // Since this method is invoked in every next() call than the buffer
        // can overgrow the max size only by one item
        if (_events.length > this._bufferSize) {
            _events.shift();
        }
        super.next(value);
    }
    nextTimeWindow(value) {
        this._events.push(new ReplayEvent(this._getNow(), value));
        this._trimBufferThenGetEvents();
        super.next(value);
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        // When `_infiniteTimeWindow === true` then the buffer is already trimmed
        const _infiniteTimeWindow = this._infiniteTimeWindow;
        const _events = _infiniteTimeWindow ? this._events : this._trimBufferThenGetEvents();
        const scheduler = this.scheduler;
        const len = _events.length;
        let subscription;
        if (this.closed) {
            throw new ObjectUnsubscribedError();
        }
        else if (this.isStopped || this.hasError) {
            subscription = Subscription.EMPTY;
        }
        else {
            this.observers.push(subscriber);
            subscription = new SubjectSubscription(this, subscriber);
        }
        if (scheduler) {
            subscriber.add(subscriber = new ObserveOnSubscriber(subscriber, scheduler));
        }
        if (_infiniteTimeWindow) {
            for (let i = 0; i < len && !subscriber.closed; i++) {
                subscriber.next(_events[i]);
            }
        }
        else {
            for (let i = 0; i < len && !subscriber.closed; i++) {
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
    }
    _getNow() {
        return (this.scheduler || queue).now();
    }
    _trimBufferThenGetEvents() {
        const now = this._getNow();
        const _bufferSize = this._bufferSize;
        const _windowTime = this._windowTime;
        const _events = this._events;
        const eventsCount = _events.length;
        let spliceCount = 0;
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
    }
}
class ReplayEvent {
    constructor(time, value) {
        this.time = time;
        this.value = value;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVwbGF5U3ViamVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL1JlcGxheVN1YmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLFdBQVcsQ0FBQztBQUVwQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzlDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLGdDQUFnQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzVEOzs7Ozs7R0FNRztBQUNILE1BQU0sT0FBTyxhQUFpQixTQUFRLE9BQVU7SUFNOUMsWUFBWSxhQUFxQixNQUFNLENBQUMsaUJBQWlCLEVBQzdDLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUIsRUFDckMsU0FBeUI7UUFDM0MsS0FBSyxFQUFFLENBQUM7UUFEVSxjQUFTLEdBQVQsU0FBUyxDQUFnQjtRQVByQyxZQUFPLEdBQTJCLEVBQUUsQ0FBQztRQUdyQyx3QkFBbUIsR0FBWSxLQUFLLENBQUM7UUFNM0MsSUFBSSxDQUFDLFdBQVcsR0FBRyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1FBRW5ELElBQUksVUFBVSxLQUFLLE1BQU0sQ0FBQyxpQkFBaUIsRUFBRTtZ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LEtBQUssQ0FBRztJQUNoRCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi9TdWJqZWN0JztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UgfSBmcm9tICcuL3R5cGVzJztcbmltcG9ydCB7IHF1ZXVlIH0gZnJvbSAnLi9zY2hlZHVsZXIvcXVldWUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPYnNlcnZlT25TdWJzY3JpYmVyIH0gZnJvbSAnLi9vcGVyYXRvcnMvb2JzZXJ2ZU9uJztcbmltcG9ydCB7IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yIH0gZnJvbSAnLi91dGlsL09iamVjdFVuc3Vic2NyaWJlZEVycm9yJztcbmltcG9ydCB7IFN1YmplY3RTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YmplY3RTdWJzY3JpcHRpb24nO1xuLyoqXG4gKiBBIHZhcmlhbnQgb2YgU3ViamVjdCB0aGF0IFwicmVwbGF5c1wiIG9yIGVtaXRzIG9sZCB2YWx1ZXMgdG8gbmV3IHN1YnNjcmliZXJzLlxuICogSXQgYnVmZmVycyBhIHNldCBudW1iZXIgb2YgdmFsdWVzIGFuZCB3aWxsIGVtaXQgdGhvc2UgdmFsdWVzIGltbWVkaWF0ZWx5IHRvXG4gKiBhbnkgbmV3IHN1YnNjcmliZXJzIGluIGFkZGl0aW9uIHRvIGVtaXR0aW5nIG5ldyB2YWx1ZXMgdG8gZXhpc3Rpbmcgc3Vic2NyaWJlcnMuXG4gKlxuICogQGNsYXNzIFJlcGxheVN1YmplY3Q8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIFJlcGxheVN1YmplY3Q8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IHtcbiAgcHJpdmF0ZSBfZXZlbnRzOiAoUmVwbGF5RXZlbnQ8VD4gfCBUKVtdID0gW107XG4gIHByaXZhdGUgX2J1ZmZlclNpemU6IG51bWJlcjtcbiAgcHJpdmF0ZSBfd2luZG93VGltZTogbnVtYmVyO1xuICBwcml2YXRlIF9pbmZpbml0ZVRpbWVXaW5kb3c6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihidWZmZXJTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gICAgICAgICAgICAgIHdpbmRvd1RpbWU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gICAgc3VwZXIoKTtcbiAgICB0aGlzLl9idWZmZXJTaXplID0gYnVmZmVyU2l6ZSA8IDEgPyAxIDogYnVmZmVyU2l6ZTtcbiAgICB0aGlzLl93aW5kb3dUaW1lID0gd2luZG93VGltZSA8IDEgPyAxIDogd2luZG93VGltZTtcblxuICAgIGlmICh3aW5kb3dUaW1lID09PSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuX2luZmluaXRlVGltZVdpbmRvdyA9IHRydWU7XG4gICAgICB0aGlzLm5leHQgPSB0aGlzLm5leHRJbmZpbml0ZVRpbWVXaW5kb3c7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubmV4dCA9IHRoaXMubmV4dFRpbWVXaW5kb3c7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBuZXh0SW5maW5pdGVUaW1lV2luZG93KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgX2V2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICBfZXZlbnRzLnB1c2godmFsdWUpO1xuICAgIC8vIFNpbmNlIHRoaXMgbWV0aG9kIGlzIGludm9rZWQgaW4gZXZlcnkgbmV4dCgpIGNhbGwgdGhhbiB0aGUgYnVmZmVyXG4gICAgLy8gY2FuIG92ZXJncm93IHRoZSBtYXggc2l6ZSBvbmx5IGJ5IG9uZSBpdGVtXG4gICAgaWYgKF9ldmVudHMubGVuZ3RoID4gdGhpcy5fYnVmZmVyU2l6ZSkge1xuICAgICAgX2V2ZW50cy5zaGlmdCgpO1xuICAgIH1cblxuICAgIHN1cGVyLm5leHQodmFsdWUpO1xuICB9XG5cbiAgcHJpdmF0ZSBuZXh0VGltZVdpbmRvdyh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuX2V2ZW50cy5wdXNoKG5ldyBSZXBsYXlFdmVudCh0aGlzLl9nZXROb3coKSwgdmFsdWUpKTtcbiAgICB0aGlzLl90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpO1xuXG4gICAgc3VwZXIubmV4dCh2YWx1ZSk7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPik6IFN1YnNjcmlwdGlvbiB7XG4gICAgLy8gV2hlbiBgX2luZmluaXRlVGltZVdpbmRvdyA9PT0gdHJ1ZWAgdGhlbiB0aGUgYnVmZmVyIGlzIGFscmVhZHkgdHJpbW1lZFxuICAgIGNvbnN0IF9pbmZpbml0ZVRpbWVXaW5kb3cgPSB0aGlzLl9pbmZpbml0ZVRpbWVXaW5kb3c7XG4gICAgY29uc3QgX2V2ZW50cyA9IF9pbmZpbml0ZVRpbWVXaW5kb3cgPyB0aGlzLl9ldmVudHMgOiB0aGlzLl90cmltQnVmZmVyVGhlbkdldEV2ZW50cygpO1xuICAgIGNvbnN0IHNjaGVkdWxlciA9IHRoaXMuc2NoZWR1bGVyO1xuICAgIGNvbnN0IGxlbiA9IF9ldmVudHMubGVuZ3RoO1xuICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcblxuICAgIGlmICh0aGlzLmNsb3NlZCkge1xuICAgICAgdGhyb3cgbmV3IE9iamVjdFVuc3Vic2NyaWJlZEVycm9yKCk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzU3RvcHBlZCB8fCB0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub2JzZXJ2ZXJzLnB1c2goc3Vic2NyaWJlcik7XG4gICAgICBzdWJzY3JpcHRpb24gPSBuZXcgU3ViamVjdFN1YnNjcmlwdGlvbih0aGlzLCBzdWJzY3JpYmVyKTtcbiAgICB9XG5cbiAgICBpZiAoc2NoZWR1bGVyKSB7XG4gICAgICBzdWJzY3JpYmVyLmFkZChzdWJzY3JpYmVyID0gbmV3IE9ic2VydmVPblN1YnNjcmliZXI8VD4oc3Vic2NyaWJlciwgc2NoZWR1bGVyKSk7XG4gICAgfVxuXG4gICAgaWYgKF9pbmZpbml0ZVRpbWVXaW5kb3cpIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIHN1YnNjcmliZXIubmV4dCg8VD5fZXZlbnRzW2ldKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgc3Vic2NyaWJlci5uZXh0KCg8UmVwbGF5RXZlbnQ8VD4+X2V2ZW50c1tpXSkudmFsdWUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLmhhc0Vycm9yKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKHRoaXMudGhyb3duRXJyb3IpO1xuICAgIH0gZWxzZSBpZiAodGhpcy5pc1N0b3BwZWQpIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgX2dldE5vdygpOiBudW1iZXIge1xuICAgIHJldHVybiAodGhpcy5zY2hlZHVsZXIgfHwgcXVldWUpLm5vdygpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJpbUJ1ZmZlclRoZW5HZXRFdmVudHMoKTogUmVwbGF5RXZlbnQ8VD5bXSB7XG4gICAgY29uc3Qgbm93ID0gdGhpcy5fZ2V0Tm93KCk7XG4gICAgY29uc3QgX2J1ZmZlclNpemUgPSB0aGlzLl9idWZmZXJTaXplO1xuICAgIGNvbnN0IF93aW5kb3dUaW1lID0gdGhpcy5fd2luZG93VGltZTtcbiAgICBjb25zdCBfZXZlbnRzID0gPFJlcGxheUV2ZW50PFQ+W10+dGhpcy5fZXZlbnRzO1xuXG4gICAgY29uc3QgZXZlbnRzQ291bnQgPSBfZXZlbnRzLmxlbmd0aDtcbiAgICBsZXQgc3BsaWNlQ291bnQgPSAwO1xuXG4gICAgLy8gVHJpbSBldmVudHMgdGhhdCBmYWxsIG91dCBvZiB0aGUgdGltZSB3aW5kb3cuXG4gICAgLy8gU3RhcnQgYXQgdGhlIGZyb250IG9mIHRoZSBsaXN0LiBCcmVhayBlYXJseSBvbmNlXG4gICAgLy8gd2UgZW5jb3VudGVyIGFuIGV2ZW50IHRoYXQgZmFsbHMgd2l0aGluIHRoZSB3aW5kb3cuXG4gICAgd2hpbGUgKHNwbGljZUNvdW50IDwgZXZlbnRzQ291bnQpIHtcbiAgICAgIGlmICgobm93IC0gX2V2ZW50c1tzcGxpY2VDb3VudF0udGltZSkgPCBfd2luZG93VGltZSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHNwbGljZUNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50c0NvdW50ID4gX2J1ZmZlclNpemUpIHtcbiAgICAgIHNwbGljZUNvdW50ID0gTWF0aC5tYXgoc3BsaWNlQ291bnQsIGV2ZW50c0NvdW50IC0gX2J1ZmZlclNpemUpO1xuICAgIH1cblxuICAgIGlmIChzcGxpY2VDb3VudCA+IDApIHtcbiAgICAgIF9ldmVudHMuc3BsaWNlKDAsIHNwbGljZUNvdW50KTtcbiAgICB9XG5cbiAgICByZXR1cm4gX2V2ZW50cztcbiAgfVxuXG59XG5cbmNsYXNzIFJlcGxheUV2ZW50PFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHRpbWU6IG51bWJlciwgcHVibGljIHZhbHVlOiBUKSB7XG4gIH1cbn1cbiJdfQ==