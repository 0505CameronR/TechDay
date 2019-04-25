import { Subscription } from '../Subscription';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
/**
 * Buffers the source Observable values starting from an emission from
 * `openings` and ending when the output of `closingSelector` emits.
 *
 * <span class="informal">Collects values from the past as an array. Starts
 * collecting only when `opening` emits, and calls the `closingSelector`
 * function to get an Observable that tells when to close the buffer.</span>
 *
 * ![](bufferToggle.png)
 *
 * Buffers values from the source by opening the buffer via signals from an
 * Observable provided to `openings`, and closing and sending the buffers when
 * a Subscribable or Promise returned by the `closingSelector` function emits.
 *
 * ## Example
 *
 * Every other second, emit the click events from the next 500ms
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const openings = interval(1000);
 * const buffered = clicks.pipe(bufferToggle(openings, i =>
 *   i % 2 ? interval(500) : empty()
 * ));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferCount}
 * @see {@link bufferTime}
 * @see {@link bufferWhen}
 * @see {@link windowToggle}
 *
 * @param {SubscribableOrPromise<O>} openings A Subscribable or Promise of notifications to start new
 * buffers.
 * @param {function(value: O): SubscribableOrPromise} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns a Subscribable or Promise,
 * which, when it emits, signals that the associated buffer should be emitted
 * and cleared.
 * @return {Observable<T[]>} An observable of arrays of buffered values.
 * @method bufferToggle
 * @owner Observable
 */
export function bufferToggle(openings, closingSelector) {
    return function bufferToggleOperatorFunction(source) {
        return source.lift(new BufferToggleOperator(openings, closingSelector));
    };
}
class BufferToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new BufferToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferToggleSubscriber extends OuterSubscriber {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(subscribeToResult(this, openings));
    }
    _next(value) {
        const contexts = this.contexts;
        const len = contexts.length;
        for (let i = 0; i < len; i++) {
            contexts[i].buffer.push(value);
        }
    }
    _error(err) {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._error(err);
    }
    _complete() {
        const contexts = this.contexts;
        while (contexts.length > 0) {
            const context = contexts.shift();
            this.destination.next(context.buffer);
            context.subscription.unsubscribe();
            context.buffer = null;
            context.subscription = null;
        }
        this.contexts = null;
        super._complete();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        outerValue ? this.closeBuffer(outerValue) : this.openBuffer(innerValue);
    }
    notifyComplete(innerSub) {
        this.closeBuffer(innerSub.context);
    }
    openBuffer(value) {
        try {
            const closingSelector = this.closingSelector;
            const closingNotifier = closingSelector.call(this, value);
            if (closingNotifier) {
                this.trySubscribe(closingNotifier);
            }
        }
        catch (err) {
            this._error(err);
        }
    }
    closeBuffer(context) {
        const contexts = this.contexts;
        if (contexts && context) {
            const { buffer, subscription } = context;
            this.destination.next(buffer);
            contexts.splice(contexts.indexOf(context), 1);
            this.remove(subscription);
            subscription.unsubscribe();
        }
    }
    trySubscribe(closingNotifier) {
        const contexts = this.contexts;
        const buffer = [];
        const subscription = new Subscription();
        const context = { buffer, subscription };
        contexts.push(context);
        const innerSubscription = subscribeToResult(this, closingNotifier, context);
        if (!innerSubscription || innerSubscription.closed) {
            this.closeBuffer(context);
        }
        else {
            innerSubscription.context = context;
            this.add(innerSubscription);
            subscription.add(innerSubscription);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyVG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2J1ZmZlclRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBSXJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQ0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixRQUFrQyxFQUNsQyxlQUF5RDtJQUV6RCxPQUFPLFNBQVMsNEJBQTRCLENBQUMsTUFBcUI7UUFDaEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQU8sUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sb0JBQW9CO0lBRXhCLFlBQW9CLFFBQWtDLEVBQ2xDLGVBQXlEO1FBRHpELGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUEwQztJQUM3RSxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQTJCLEVBQUUsTUFBVztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFD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QUFZLENBQUMsR0FBRyxDQUFDLGlCQUFpQixDQUFDLENBQUM7U0FDckM7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIHN0YXJ0aW5nIGZyb20gYW4gZW1pc3Npb24gZnJvbVxuICogYG9wZW5pbmdzYCBhbmQgZW5kaW5nIHdoZW4gdGhlIG91dHB1dCBvZiBgY2xvc2luZ1NlbGVjdG9yYCBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29sbGVjdHMgdmFsdWVzIGZyb20gdGhlIHBhc3QgYXMgYW4gYXJyYXkuIFN0YXJ0c1xuICogY29sbGVjdGluZyBvbmx5IHdoZW4gYG9wZW5pbmdgIGVtaXRzLCBhbmQgY2FsbHMgdGhlIGBjbG9zaW5nU2VsZWN0b3JgXG4gKiBmdW5jdGlvbiB0byBnZXQgYW4gT2JzZXJ2YWJsZSB0aGF0IHRlbGxzIHdoZW4gdG8gY2xvc2UgdGhlIGJ1ZmZlci48L3NwYW4+XG4gKlxuICogIVtdKGJ1ZmZlclRvZ2dsZS5wbmcpXG4gKlxuICogQnVmZmVycyB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIGJ5IG9wZW5pbmcgdGhlIGJ1ZmZlciB2aWEgc2lnbmFscyBmcm9tIGFuXG4gKiBPYnNlcnZhYmxlIHByb3ZpZGVkIHRvIGBvcGVuaW5nc2AsIGFuZCBjbG9zaW5nIGFuZCBzZW5kaW5nIHRoZSBidWZmZXJzIHdoZW5cbiAqIGEgU3Vic2NyaWJhYmxlIG9yIFByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGBjbG9zaW5nU2VsZWN0b3JgIGZ1bmN0aW9uIGVtaXRzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBFdmVyeSBvdGhlciBzZWNvbmQsIGVtaXQgdGhlIGNsaWNrIGV2ZW50cyBmcm9tIHRoZSBuZXh0IDUwMG1zXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IG9wZW5pbmdzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBidWZmZXJlZCA9IGNsaWNrcy5waXBlKGJ1ZmZlclRvZ2dsZShvcGVuaW5ncywgaSA9PlxuICogICBpICUgMiA/IGludGVydmFsKDUwMCkgOiBlbXB0eSgpXG4gKiApKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlckNvdW50fVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVGltZX1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcldoZW59XG4gKiBAc2VlIHtAbGluayB3aW5kb3dUb2dnbGV9XG4gKlxuICogQHBhcmFtIHtTdWJzY3JpYmFibGVPclByb21pc2U8Tz59IG9wZW5pbmdzIEEgU3Vic2NyaWJhYmxlIG9yIFByb21pc2Ugb2Ygbm90aWZpY2F0aW9ucyB0byBzdGFydCBuZXdcbiAqIGJ1ZmZlcnMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBPKTogU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiB0aGUgdmFsdWUgZW1pdHRlZCBieSB0aGUgYG9wZW5pbmdzYCBvYnNlcnZhYmxlIGFuZCByZXR1cm5zIGEgU3Vic2NyaWJhYmxlIG9yIFByb21pc2UsXG4gKiB3aGljaCwgd2hlbiBpdCBlbWl0cywgc2lnbmFscyB0aGF0IHRoZSBhc3NvY2lhdGVkIGJ1ZmZlciBzaG91bGQgYmUgZW1pdHRlZFxuICogYW5kIGNsZWFyZWQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFRbXT59IEFuIG9ic2VydmFibGUgb2YgYXJyYXlzIG9mIGJ1ZmZlcmVkIHZhbHVlcy5cbiAqIEBtZXRob2QgYnVmZmVyVG9nZ2xlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gYnVmZmVyVG9nZ2xlPFQsIE8+KFxuICBvcGVuaW5nczogU3Vic2NyaWJhYmxlT3JQcm9taXNlPE8+LFxuICBjbG9zaW5nU2VsZWN0b3I6ICh2YWx1ZTogTykgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT5cbik6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPiB7XG4gIHJldHVybiBmdW5jdGlvbiBidWZmZXJUb2dnbGVPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgQnVmZmVyVG9nZ2xlT3BlcmF0b3I8VCwgTz4ob3BlbmluZ3MsIGNsb3NpbmdTZWxlY3RvcikpO1xuICB9O1xufVxuXG5jbGFzcyBCdWZmZXJUb2dnbGVPcGVyYXRvcjxULCBPPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFRbXT4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3BlbmluZ3M6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxPPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICh2YWx1ZTogTykgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUW10+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEJ1ZmZlclRvZ2dsZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5vcGVuaW5ncywgdGhpcy5jbG9zaW5nU2VsZWN0b3IpKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQnVmZmVyQ29udGV4dDxUPiB7XG4gIGJ1ZmZlcjogVFtdO1xuICBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEJ1ZmZlclRvZ2dsZVN1YnNjcmliZXI8VCwgTz4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgTz4ge1xuICBwcml2YXRlIGNvbnRleHRzOiBBcnJheTxCdWZmZXJDb250ZXh0PFQ+PiA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFRbXT4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb3BlbmluZ3M6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxPPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjbG9zaW5nU2VsZWN0b3I6ICh2YWx1ZTogTykgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4gfCB2b2lkKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMuYWRkKHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIG9wZW5pbmdzKSk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG4gICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnRleHRzW2ldLmJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2Vycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dHMgPSB0aGlzLmNvbnRleHRzO1xuICAgIHdoaWxlIChjb250ZXh0cy5sZW5ndGggPiAwKSB7XG4gICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHMuc2hpZnQoKTtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICBjb250ZXh0LmJ1ZmZlciA9IG51bGw7XG4gICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuY29udGV4dHMgPSBudWxsO1xuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG4gICAgd2hpbGUgKGNvbnRleHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5zaGlmdCgpO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGNvbnRleHQuYnVmZmVyKTtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICBjb250ZXh0LmJ1ZmZlciA9IG51bGw7XG4gICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgfVxuICAgIHRoaXMuY29udGV4dHMgPSBudWxsO1xuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBhbnksIGlubmVyVmFsdWU6IE8sXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBPPik6IHZvaWQge1xuICAgIG91dGVyVmFsdWUgPyB0aGlzLmNsb3NlQnVmZmVyKG91dGVyVmFsdWUpIDogdGhpcy5vcGVuQnVmZmVyKGlubmVyVmFsdWUpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBPPik6IHZvaWQge1xuICAgIHRoaXMuY2xvc2VCdWZmZXIoKDxhbnk+IGlubmVyU3ViKS5jb250ZXh0KTtcbiAgfVxuXG4gIHByaXZhdGUgb3BlbkJ1ZmZlcih2YWx1ZTogTyk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBjbG9zaW5nU2VsZWN0b3IgPSB0aGlzLmNsb3NpbmdTZWxlY3RvcjtcbiAgICAgIGNvbnN0IGNsb3NpbmdOb3RpZmllciA9IGNsb3NpbmdTZWxlY3Rvci5jYWxsKHRoaXMsIHZhbHVlKTtcbiAgICAgIGlmIChjbG9zaW5nTm90aWZpZXIpIHtcbiAgICAgICAgdGhpcy50cnlTdWJzY3JpYmUoY2xvc2luZ05vdGlmaWVyKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuX2Vycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbG9zZUJ1ZmZlcihjb250ZXh0OiBCdWZmZXJDb250ZXh0PFQ+KTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dHMgPSB0aGlzLmNvbnRleHRzO1xuXG4gICAgaWYgKGNvbnRleHRzICYmIGNvbnRleHQpIHtcbiAgICAgIGNvbnN0IHsgYnVmZmVyLCBzdWJzY3JpcHRpb24gfSA9IGNvbnRleHQ7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICAgIGNvbnRleHRzLnNwbGljZShjb250ZXh0cy5pbmRleE9mKGNvbnRleHQpLCAxKTtcbiAgICAgIHRoaXMucmVtb3ZlKHN1YnNjcmlwdGlvbik7XG4gICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRyeVN1YnNjcmliZShjbG9zaW5nTm90aWZpZXI6IGFueSk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcblxuICAgIGNvbnN0IGJ1ZmZlcjogQXJyYXk8VD4gPSBbXTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgY29uc3QgY29udGV4dCA9IHsgYnVmZmVyLCBzdWJzY3JpcHRpb24gfTtcbiAgICBjb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuXG4gICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIsIDxhbnk+Y29udGV4dCk7XG5cbiAgICBpZiAoIWlubmVyU3Vic2NyaXB0aW9uIHx8IGlubmVyU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5jbG9zZUJ1ZmZlcihjb250ZXh0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKDxhbnk+IGlubmVyU3Vic2NyaXB0aW9uKS5jb250ZXh0ID0gY29udGV4dDtcblxuICAgICAgdGhpcy5hZGQoaW5uZXJTdWJzY3JpcHRpb24pO1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgfVxuICB9XG59XG4iXX0=