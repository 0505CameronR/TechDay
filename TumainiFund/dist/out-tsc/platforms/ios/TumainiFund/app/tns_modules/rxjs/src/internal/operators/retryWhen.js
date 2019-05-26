import { Subject } from '../Subject';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that mirrors the source Observable with the exception of an `error`. If the source Observable
 * calls `error`, this method will emit the Throwable that caused the error to the Observable returned from `notifier`.
 * If that Observable calls `complete` or `error` then this method will call `complete` or `error` on the child
 * subscription. Otherwise this method will resubscribe to the source Observable.
 *
 * ![](retryWhen.png)
 *
 * @param {function(errors: Observable): Observable} notifier - Receives an Observable of notifications with which a
 * user can `complete` or `error`, aborting the retry.
 * @return {Observable} The source Observable modified with retry logic.
 * @method retryWhen
 * @owner Observable
 */
export function retryWhen(notifier) {
    return (source) => source.lift(new RetryWhenOperator(notifier, source));
}
class RetryWhenOperator {
    constructor(notifier, source) {
        this.notifier = notifier;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new RetryWhenSubscriber(subscriber, this.notifier, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RetryWhenSubscriber extends OuterSubscriber {
    constructor(destination, notifier, source) {
        super(destination);
        this.notifier = notifier;
        this.source = source;
    }
    error(err) {
        if (!this.isStopped) {
            let errors = this.errors;
            let retries = this.retries;
            let retriesSubscription = this.retriesSubscription;
            if (!retries) {
                errors = new Subject();
                try {
                    const { notifier } = this;
                    retries = notifier(errors);
                }
                catch (e) {
                    return super.error(e);
                }
                retriesSubscription = subscribeToResult(this, retries);
            }
            else {
                this.errors = null;
                this.retriesSubscription = null;
            }
            this._unsubscribeAndRecycle();
            this.errors = errors;
            this.retries = retries;
            this.retriesSubscription = retriesSubscription;
            errors.next(err);
        }
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const { errors, retriesSubscription } = this;
        if (errors) {
            errors.unsubscribe();
            this.errors = null;
        }
        if (retriesSubscription) {
            retriesSubscription.unsubscribe();
            this.retriesSubscription = null;
        }
        this.retries = null;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { _unsubscribe } = this;
        this._unsubscribe = null;
        this._unsubscribeAndRecycle();
        this._unsubscribe = _unsubscribe;
        this.source.subscribe(this);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3JldHJ5V2hlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBR3JDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUVyRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUk5RDs7Ozs7Ozs7Ozs7OztHQWFHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBSSxRQUFzRDtJQUNqRixPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFFBQVEsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ3pGLENBQUM7QUFFRCxNQUFNLGlCQUFpQjtJQUNyQixZQUFzQixRQUFzRCxFQUN0RCxNQUFxQjtRQURyQixhQUFRLEdBQVIsUUFBUSxDQUE4QztRQUN0RCxXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQzNDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQzNGLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLG1CQUEwQixTQUFRLGVBQXFCO0lBTTNELFlBQVksV0FBMEIsRUFDbEIsUUFBc0QsRUFDdEQsTUFBcUI7UUFDdkMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRkQsYUFBUSxHQUFSLFFBQVEsQ0FBOEM7UUFDdEQsV0FBTSxHQUFOLE1BQU0sQ0FBZTtJQUV6QyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQVE7UUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUVuQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1lBQ3pCLElBQUksT0FBTyxHQUFRLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDaEMsSUFBSSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFFbkQsSUFBSSxDQUFDLE9BQU8sRUFBRTtnQkFDWixNQUFNLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztnQkFDdkIsSUFBSTtvQkFDRixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDO29CQUMxQixPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2lCQUM1QjtnQkFBQyxPQUFPLENBQUMsRUFBRTtvQkFDVixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELG1CQUFtQixHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzthQUN4RDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztnQkFDbkIsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQzthQUNqQztZQUVELElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBRTlCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQztZQUUvQyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xCO0lBQ0gsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxZQUFZO1FBQ1YsTUFBTSxFQUFFLE1BQU0sRUFBRSxtQkFBbUIsRUFBRSxHQUFHLElBQUksQ0FBQztRQUM3QyxJQUFJLE1BQU0sRUFBRTtZQUNWLE1BQU0sQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQztTQUNwQjtRQUNELElBQUksbUJBQW1CLEVBQUU7WUFDdkIsbUJBQW1CLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDbEMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQztTQUNqQztRQUNELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ3RCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxNQUFNLEVBQUUsWUFBWSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRTlCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1FBQzlCLElBQUksQ0FBQyxZQUFZLEdBQUcsWUFBWSxDQUFDO1FBRWpDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGFuIGBlcnJvcmAuIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogY2FsbHMgYGVycm9yYCwgdGhpcyBtZXRob2Qgd2lsbCBlbWl0IHRoZSBUaHJvd2FibGUgdGhhdCBjYXVzZWQgdGhlIGVycm9yIHRvIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gYG5vdGlmaWVyYC5cbiAqIElmIHRoYXQgT2JzZXJ2YWJsZSBjYWxscyBgY29tcGxldGVgIG9yIGBlcnJvcmAgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGNhbGwgYGNvbXBsZXRlYCBvciBgZXJyb3JgIG9uIHRoZSBjaGlsZFxuICogc3Vic2NyaXB0aW9uLiBPdGhlcndpc2UgdGhpcyBtZXRob2Qgd2lsbCByZXN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogIVtdKHJldHJ5V2hlbi5wbmcpXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihlcnJvcnM6IE9ic2VydmFibGUpOiBPYnNlcnZhYmxlfSBub3RpZmllciAtIFJlY2VpdmVzIGFuIE9ic2VydmFibGUgb2Ygbm90aWZpY2F0aW9ucyB3aXRoIHdoaWNoIGFcbiAqIHVzZXIgY2FuIGBjb21wbGV0ZWAgb3IgYGVycm9yYCwgYWJvcnRpbmcgdGhlIHJldHJ5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBPYnNlcnZhYmxlIG1vZGlmaWVkIHdpdGggcmV0cnkgbG9naWMuXG4gKiBAbWV0aG9kIHJldHJ5V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5V2hlbjxUPihub3RpZmllcjogKGVycm9yczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFJldHJ5V2hlbk9wZXJhdG9yKG5vdGlmaWVyLCBzb3VyY2UpKTtcbn1cblxuY2xhc3MgUmV0cnlXaGVuT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBub3RpZmllcjogKGVycm9yczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmV0cnlXaGVuU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm5vdGlmaWVyLCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBSZXRyeVdoZW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIGVycm9yczogU3ViamVjdDxhbnk+O1xuICBwcml2YXRlIHJldHJpZXM6IE9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSByZXRyaWVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgbm90aWZpZXI6IChlcnJvcnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuXG4gICAgICBsZXQgZXJyb3JzID0gdGhpcy5lcnJvcnM7XG4gICAgICBsZXQgcmV0cmllczogYW55ID0gdGhpcy5yZXRyaWVzO1xuICAgICAgbGV0IHJldHJpZXNTdWJzY3JpcHRpb24gPSB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb247XG5cbiAgICAgIGlmICghcmV0cmllcykge1xuICAgICAgICBlcnJvcnMgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNvbnN0IHsgbm90aWZpZXIgfSA9IHRoaXM7XG4gICAgICAgICAgcmV0cmllcyA9IG5vdGlmaWVyKGVycm9ycyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICByZXR1cm4gc3VwZXIuZXJyb3IoZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0cmllc1N1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIHJldHJpZXMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5lcnJvcnMgPSBudWxsO1xuICAgICAgICB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgICAgfVxuXG4gICAgICB0aGlzLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTtcblxuICAgICAgdGhpcy5lcnJvcnMgPSBlcnJvcnM7XG4gICAgICB0aGlzLnJldHJpZXMgPSByZXRyaWVzO1xuICAgICAgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uID0gcmV0cmllc1N1YnNjcmlwdGlvbjtcblxuICAgICAgZXJyb3JzLm5leHQoZXJyKTtcbiAgICB9XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF91bnN1YnNjcmliZSgpIHtcbiAgICBjb25zdCB7IGVycm9ycywgcmV0cmllc1N1YnNjcmlwdGlvbiB9ID0gdGhpcztcbiAgICBpZiAoZXJyb3JzKSB7XG4gICAgICBlcnJvcnMudW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuZXJyb3JzID0gbnVsbDtcbiAgICB9XG4gICAgaWYgKHJldHJpZXNTdWJzY3JpcHRpb24pIHtcbiAgICAgIHJldHJpZXNTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMucmV0cmllcyA9IG51bGw7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHsgX3Vuc3Vic2NyaWJlIH0gPSB0aGlzO1xuXG4gICAgdGhpcy5fdW5zdWJzY3JpYmUgPSBudWxsO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlQW5kUmVjeWNsZSgpO1xuICAgIHRoaXMuX3Vuc3Vic2NyaWJlID0gX3Vuc3Vic2NyaWJlO1xuXG4gICAgdGhpcy5zb3VyY2Uuc3Vic2NyaWJlKHRoaXMpO1xuICB9XG59XG4iXX0=