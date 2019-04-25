import { Subject } from '../Subject';
import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
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
                retries = tryCatch(this.notifier)(errors);
                if (retries === errorObject) {
                    return super.error(errorObject.e);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmV0cnlXaGVuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3JldHJ5V2hlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBRXJDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUM1QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFFbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBSTlEOzs7Ozs7Ozs7Ozs7O0dBYUc7QUFDSCxNQUFNLFVBQVUsU0FBUyxDQUFJLFFBQXNEO0lBQ2pGLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksaUJBQWlCLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDekYsQ0FBQztBQUVELE1BQU0saUJBQWlCO0lBQ3JCLFlBQXNCLFFBQXNELEVBQ3RELE1BQXFCO1FBRHJCLGFBQVEsR0FBUixRQUFRLENBQThDO1FBQ3RELFdBQU0sR0FBTixNQUFNLENBQWU7SUFDM0MsQ0FBQztJQUVELElBQUksQ0FBQyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksbUJBQW1CLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDM0YsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sbUJBQTBCLFNBQVEsZUFBcUI7SUFNM0QsWUFBWSxXQUEwQixFQUNsQixRQUFzRCxFQUN0RCxNQUFxQjtRQUN2QyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFGRCxhQUFRLEdBQVIsUUFBUSxDQUE4QztRQUN0RCxXQUFNLEdBQU4sTUFBTSxDQUFlO0lBRXpDLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBUTtRQUNaLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBRW5CLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7WUFDekIsSUFBSSxPQUFPLEdBQVEsSUFBSSxDQUFDLE9BQU8sQ0FBQztZQUNoQyxJQUFJLG1CQUFtQixHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztZQUVuRCxJQUFJLENBQUMsT0FBTyxFQUFFO2dCQUNaLE1BQU0sR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO2dCQUN2QixPQUFPLEdBQUcsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDMUMsSUFBSSxPQUFPLEtBQUssV0FBVyxFQUFFO29CQUMzQixPQUFPLEtBQUssQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNuQztnQkFDRCxtQkFBbUIsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7YUFDeEQ7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQ25CLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7YUFDakM7WUFFRCxJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztZQUU5QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUNyQixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztZQUN2QixJQUFJLENBQUMsbUJBQW1CLEdBQUcsbUJBQW1CLENBQUM7WUFFL0MsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsQjtJQUNILENBQUM7SUFFRCx5RUFBeUU7SUFDekUsWUFBWTtRQUNWLE1BQU0sRUFBRSxNQUFNLEVBQUUsbUJBQW1CLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDN0MsSUFBSSxNQUFNLEVBQUU7WUFDVixNQUFNLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7U0FDcEI7UUFDRCxJQUFJLG1CQUFtQixFQUFFO1lBQ3ZCLG1CQUFtQixDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2xDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUM7U0FDakM7UUFDRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQztJQUN0QixDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsTUFBTSxFQUFFLFlBQVksRUFBRSxHQUFHLElBQUksQ0FBQztRQUU5QixJQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztRQUN6QixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztRQUM5QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUVqQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgbWlycm9ycyB0aGUgc291cmNlIE9ic2VydmFibGUgd2l0aCB0aGUgZXhjZXB0aW9uIG9mIGFuIGBlcnJvcmAuIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZVxuICogY2FsbHMgYGVycm9yYCwgdGhpcyBtZXRob2Qgd2lsbCBlbWl0IHRoZSBUaHJvd2FibGUgdGhhdCBjYXVzZWQgdGhlIGVycm9yIHRvIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGZyb20gYG5vdGlmaWVyYC5cbiAqIElmIHRoYXQgT2JzZXJ2YWJsZSBjYWxscyBgY29tcGxldGVgIG9yIGBlcnJvcmAgdGhlbiB0aGlzIG1ldGhvZCB3aWxsIGNhbGwgYGNvbXBsZXRlYCBvciBgZXJyb3JgIG9uIHRoZSBjaGlsZFxuICogc3Vic2NyaXB0aW9uLiBPdGhlcndpc2UgdGhpcyBtZXRob2Qgd2lsbCByZXN1YnNjcmliZSB0byB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKlxuICogIVtdKHJldHJ5V2hlbi5wbmcpXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihlcnJvcnM6IE9ic2VydmFibGUpOiBPYnNlcnZhYmxlfSBub3RpZmllciAtIFJlY2VpdmVzIGFuIE9ic2VydmFibGUgb2Ygbm90aWZpY2F0aW9ucyB3aXRoIHdoaWNoIGFcbiAqIHVzZXIgY2FuIGBjb21wbGV0ZWAgb3IgYGVycm9yYCwgYWJvcnRpbmcgdGhlIHJldHJ5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gVGhlIHNvdXJjZSBPYnNlcnZhYmxlIG1vZGlmaWVkIHdpdGggcmV0cnkgbG9naWMuXG4gKiBAbWV0aG9kIHJldHJ5V2hlblxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJldHJ5V2hlbjxUPihub3RpZmllcjogKGVycm9yczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFJldHJ5V2hlbk9wZXJhdG9yKG5vdGlmaWVyLCBzb3VyY2UpKTtcbn1cblxuY2xhc3MgUmV0cnlXaGVuT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBub3RpZmllcjogKGVycm9yczogT2JzZXJ2YWJsZTxhbnk+KSA9PiBPYnNlcnZhYmxlPGFueT4sXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgUmV0cnlXaGVuU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm5vdGlmaWVyLCB0aGlzLnNvdXJjZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBSZXRyeVdoZW5TdWJzY3JpYmVyPFQsIFI+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIFI+IHtcblxuICBwcml2YXRlIGVycm9yczogU3ViamVjdDxhbnk+O1xuICBwcml2YXRlIHJldHJpZXM6IE9ic2VydmFibGU8YW55PjtcbiAgcHJpdmF0ZSByZXRyaWVzU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgbm90aWZpZXI6IChlcnJvcnM6IE9ic2VydmFibGU8YW55PikgPT4gT2JzZXJ2YWJsZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIGVycm9yKGVycjogYW55KSB7XG4gICAgaWYgKCF0aGlzLmlzU3RvcHBlZCkge1xuXG4gICAgICBsZXQgZXJyb3JzID0gdGhpcy5lcnJvcnM7XG4gICAgICBsZXQgcmV0cmllczogYW55ID0gdGhpcy5yZXRyaWVzO1xuICAgICAgbGV0IHJldHJpZXNTdWJzY3JpcHRpb24gPSB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb247XG5cbiAgICAgIGlmICghcmV0cmllcykge1xuICAgICAgICBlcnJvcnMgPSBuZXcgU3ViamVjdCgpO1xuICAgICAgICByZXRyaWVzID0gdHJ5Q2F0Y2godGhpcy5ub3RpZmllcikoZXJyb3JzKTtcbiAgICAgICAgaWYgKHJldHJpZXMgPT09IGVycm9yT2JqZWN0KSB7XG4gICAgICAgICAgcmV0dXJuIHN1cGVyLmVycm9yKGVycm9yT2JqZWN0LmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHJpZXNTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCByZXRyaWVzKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZXJyb3JzID0gbnVsbDtcbiAgICAgICAgdGhpcy5yZXRyaWVzU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICAgIH1cblxuICAgICAgdGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCk7XG5cbiAgICAgIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICAgICAgdGhpcy5yZXRyaWVzID0gcmV0cmllcztcbiAgICAgIHRoaXMucmV0cmllc1N1YnNjcmlwdGlvbiA9IHJldHJpZXNTdWJzY3JpcHRpb247XG5cbiAgICAgIGVycm9ycy5uZXh0KGVycik7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfdW5zdWJzY3JpYmUoKSB7XG4gICAgY29uc3QgeyBlcnJvcnMsIHJldHJpZXNTdWJzY3JpcHRpb24gfSA9IHRoaXM7XG4gICAgaWYgKGVycm9ycykge1xuICAgICAgZXJyb3JzLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLmVycm9ycyA9IG51bGw7XG4gICAgfVxuICAgIGlmIChyZXRyaWVzU3Vic2NyaXB0aW9uKSB7XG4gICAgICByZXRyaWVzU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnJldHJpZXNTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cbiAgICB0aGlzLnJldHJpZXMgPSBudWxsO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICBjb25zdCB7IF91bnN1YnNjcmliZSB9ID0gdGhpcztcblxuICAgIHRoaXMuX3Vuc3Vic2NyaWJlID0gbnVsbDtcbiAgICB0aGlzLl91bnN1YnNjcmliZUFuZFJlY3ljbGUoKTtcbiAgICB0aGlzLl91bnN1YnNjcmliZSA9IF91bnN1YnNjcmliZTtcblxuICAgIHRoaXMuc291cmNlLnN1YnNjcmliZSh0aGlzKTtcbiAgfVxufVxuIl19