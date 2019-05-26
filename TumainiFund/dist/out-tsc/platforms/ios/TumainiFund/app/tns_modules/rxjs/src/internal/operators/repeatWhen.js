import { Subject } from '../Subject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that mirrors the source Observable with the exception of a `complete`. If the source
 * Observable calls `complete`, this method will emit to the Observable returned from `notifier`. If that Observable
 * calls `complete` or `error`, then this method will call `complete` or `error` on the child subscription. Otherwise
 * this method will resubscribe to the source Observable.
 *
 * ![](repeatWhen.png)
 *
 * @param {function(notifications: Observable): Observable} notifier - Receives an Observable of notifications with
 * which a user can `complete` or `error`, aborting the repetition.
 * @return {Observable} The source Observable modified with repeat logic.
 * @method repeatWhen
 * @owner Observable
 */
export function repeatWhen(notifier) {
    return (source) => source.lift(new RepeatWhenOperator(notifier));
}
class RepeatWhenOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        return source.subscribe(new RepeatWhenSubscriber(subscriber, this.notifier, source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RepeatWhenSubscriber extends OuterSubscriber {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
        this.sourceIsBeingSubscribedTo = true;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.sourceIsBeingSubscribedTo = true;
        this.source.subscribe(this);
    }
    notifyComplete(innerSub) {
        if (this.sourceIsBeingSubscribedTo === false) {
            return super.complete();
        }
    }
    complete() {
        this.sourceIsBeingSubscribedTo = false;
        if (!this.isStopped) {
            if (!this.retries) {
                this.subscribeToRetries();
            }
            if (!this.retriesSubscription || this.retriesSubscription.closed) {
                return super.complete();
            }
            this._unsubscribeAndRecycle();
            this.notifications.next();
        }
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const { notifications, retriesSubscription } = this;
        if (notifications) {
            notifications.unsubscribe();
            this.notifications = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribeAndRecycle() {
        const { _unsubscribe } = this;
        this._unsubscribe = null;
        super._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        return this;
    }
    subscribeToRetries() {
        this.notifications = new Subject();
        let retries;
        try {
            const { notifier } = this;
            retries = notifier(this.notifications);
        }
        catch (e) {
            return super.complete();
        }
        this.retries = retries;
        this.retriesSubscription = subscribeToResult(this, retries);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0V2hlbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9yZXBlYXRXaGVuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUdBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFHckMsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSTlEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLFVBQVUsVUFBVSxDQUFJLFFBQTZEO0lBQ3pGLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksa0JBQWtCLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNsRixDQUFDO0FBRUQsTUFBTSxrQkFBa0I7SUFDdEIsWUFBc0IsUUFBNkQ7UUFBN0QsYUFBUSxHQUFSLFFBQVEsQ0FBcUQ7SUFDbkYsQ0FBQztJQUVELElBQUksQ0FBQyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksb0JBQW9CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUN2RixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxvQkFBMkIsU0FBUSxlQUFxQjtJQU81RCxZQUFZLFdBQTBCLEVBQ2xCLFFBQTZELEVBQzdELE1BQXFCO1FBQ3ZDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUZELGFBQVEsR0FBUixRQUFRLENBQXFEO1FBQzdELFdBQU0sR0FBTixNQUFNLENBQWU7UUFKakMsOEJBQXlCLEdBQVksSUFBSSxDQUFDO0lBTWxELENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMseUJBQXlCLEdBQUcsSUFBSSxDQUFDO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7SUFFRCxjQUFjLENBQUMsUUFBK0I7UUFDNUMsSUFBSSxJQUFJLENBQUMseUJBQXlCLEtBQUssS0FBSyxFQUFFO1lBQzVDLE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMseUJBQXlCLEdBQUcsS0FBSyxDQUFDO1FBRXZDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNqQixJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQzthQUMzQjtZQUNELElBQUksQ0FBQyxJQUFJLENBQUMsbUJBQW1CLElBQUksSUFBSSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRTtnQkFDaEUsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDekI7WUFFRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUM5QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQzNCO0lBQ0gsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsTUFBTSxFQUFFLGFBQWEsRUFBRSxtQkFBbUIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUNwRCxJQUFJLGFBQWEsRUFBRTtZQUNqQixhQUFhLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDNUIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUM7U0FDM0I7UUFDRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQseUVBQXlFO0lBQ3pFLHNCQUFzQjtRQUNwQixNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRTlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLEtBQUssQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBRWpDLE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDbkMsSUFBSSxPQUFPLENBQUM7UUFDWixJQUFJO1lBQ0YsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztZQUMxQixPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUN4QztRQUFDLE9BQU8sQ0FBQyxFQUFFO1lBQ1YsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztRQUN2QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlELENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGEgYGNvbXBsZXRlYC4gSWYgdGhlIHNvdXJjZVxuICogT2JzZXJ2YWJsZSBjYWxscyBgY29tcGxldGVgLCB0aGlzIG1ldGhvZCB3aWxsIGVtaXQgdG8gdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSBgbm90aWZpZXJgLiBJZiB0aGF0IE9ic2VydmFibGVcbiAqIGNhbGxzIGBjb21wbGV0ZWAgb3IgYGVycm9yYCwgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGNhbGwgYGNvbXBsZXRlYCBvciBgZXJyb3JgIG9uIHRoZSBjaGlsZCBzdWJzY3JpcHRpb24uIE90aGVyd2lzZVxuICogdGhpcyBtZXRob2Qgd2lsbCByZXN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogIVtdKHJlcGVhdFdoZW4ucG5nKVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24obm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZSk6IE9ic2VydmFibGV9IG5vdGlmaWVyIC0gUmVjZWl2ZXMgYW4gT2JzZXJ2YWJsZSBvZiBub3RpZmljYXRpb25zIHdpdGhcbiAqIHdoaWNoIGEgdXNlciBjYW4gYGNvbXBsZXRlYCBvciBgZXJyb3JgLCBhYm9ydGluZyB0aGUgcmVwZXRpdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IFRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBtb2RpZmllZCB3aXRoIHJlcGVhdCBsb2dpYy5cbiAqIEBtZXRob2QgcmVwZWF0V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlcGVhdFdoZW48VD4obm90aWZpZXI6IChub3RpZmljYXRpb25zOiBPYnNlcnZhYmxlPGFueT4pID0+IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgUmVwZWF0V2hlbk9wZXJhdG9yKG5vdGlmaWVyKSk7XG59XG5cbmNsYXNzIFJlcGVhdFdoZW5PcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJvdGVjdGVkIG5vdGlmaWVyOiAobm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmVwZWF0V2hlblN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5ub3RpZmllciwgc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFJlcGVhdFdoZW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIG5vdGlmaWNhdGlvbnM6IFN1YmplY3Q8YW55PjtcbiAgcHJpdmF0ZSByZXRyaWVzOiBPYnNlcnZhYmxlPGFueT47XG4gIHByaXZhdGUgcmV0cmllc1N1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBwcml2YXRlIHNvdXJjZUlzQmVpbmdTdWJzY3JpYmVkVG86IGJvb2xlYW4gPSB0cnVlO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIG5vdGlmaWVyOiAobm90aWZpY2F0aW9uczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLnNvdXJjZUlzQmVpbmdTdWJzY3JpYmVkVG8gPSB0cnVlO1xuICAgIHRoaXMuc291cmNlLnN1YnNjcmliZSh0aGlzKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvID09PSBmYWxzZSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgY29tcGxldGUoKSB7XG4gICAgdGhpcy5zb3VyY2VJc0JlaW5nU3Vic2NyaWJlZFRvID0gZmFsc2U7XG5cbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBpZiAoIXRoaXMucmV0cmllcykge1xuICAgICAgICB0aGlzLnN1YnNjcmliZVRvUmV0cmllcygpO1xuICAgICAgfVxuICAgICAgaWYgKCF0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gfHwgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgICByZXR1cm4gc3VwZXIuY29tcGxldGUoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG4gICAgICB0aGlzLm5vdGlmaWNhdGlvbnMubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgbm90aWZpY2F0aW9ucywgcmV0cmllc1N1YnNjcmlwdGlvbiB9ID0gdGhpcztcbiAgICBpZiAobm90aWZpY2F0aW9ucykge1xuICAgICAgbm90aWZpY2F0aW9ucy51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5ub3RpZmljYXRpb25zID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHJldHJpZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHJldHJpZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMucmV0cmllcyA9IG51bGw7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTogU3Vic2NyaWJlcjxUPiB7XG4gICAgY29uc3QgeyBfdW5zdWJzY3JpYmUgfSA9IHRoaXM7XG5cbiAgICB0aGlzLl91bnN1YnNjcmliZSA9IG51bGw7XG4gICAgc3VwZXIuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlID0gX3Vuc3Vic2NyaWJlO1xuXG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBwcml2YXRlIHN1YnNjcmliZVRvUmV0cmllcygpIHtcbiAgICB0aGlzLm5vdGlmaWNhdGlvbnMgPSBuZXcgU3ViamVjdCgpO1xuICAgIGxldCByZXRyaWVzO1xuICAgIHRyeSB7XG4gICAgICBjb25zdCB7IG5vdGlmaWVyIH0gPSB0aGlzO1xuICAgICAgcmV0cmllcyA9IG5vdGlmaWVyKHRoaXMubm90aWZpY2F0aW9ucyk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgfVxuICAgIHRoaXMucmV0cmllcyA9IHJldHJpZXM7XG4gICAgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgcmV0cmllcyk7XG4gIH1cbn1cbiJdfQ==