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
 * import { fromEvent, interval, empty } from 'rxjs';
 * import { bufferToggle } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyVG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2J1ZmZlclRvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBSXJEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q0c7QUFDSCxNQUFNLFVBQVUsWUFBWSxDQUMxQixRQUFrQyxFQUNsQyxlQUF5RDtJQUV6RCxPQUFPLFNBQVMsNEJBQTRCLENBQUMsTUFBcUI7UUFDaEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksb0JBQW9CLENBQU8sUUFBUSxFQUFFLGVBQWUsQ0FBQyxDQUFDLENBQUM7SUFDaEYsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVELE1BQU0sb0JBQW9CO0lBRXhCLFlBQW9CLFFBQWtDLEVBQ2xDLGVBQXlEO1FBRHpELGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLG9CQUFlLEdBQWYsZUFBZSxDQUEwQztJQUM3RSxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQTJCLEVBQUUsTUFBVztRQUMzQyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBc0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztJQUN2RyxDQUFDO0NBQ0Y7QUFPRDs7OztHQUlHO0FBQ0gsTUFBTSxzQkFBNkIsU0FBUSxlQUFxQjtJQUc5RCxZQUFZLFdB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cnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogQnVmZmVycyB0aGUgc291cmNlIE9ic2VydmFibGUgdmFsdWVzIHN0YXJ0aW5nIGZyb20gYW4gZW1pc3Npb24gZnJvbVxuICogYG9wZW5pbmdzYCBhbmQgZW5kaW5nIHdoZW4gdGhlIG91dHB1dCBvZiBgY2xvc2luZ1NlbGVjdG9yYCBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q29sbGVjdHMgdmFsdWVzIGZyb20gdGhlIHBhc3QgYXMgYW4gYXJyYXkuIFN0YXJ0c1xuICogY29sbGVjdGluZyBvbmx5IHdoZW4gYG9wZW5pbmdgIGVtaXRzLCBhbmQgY2FsbHMgdGhlIGBjbG9zaW5nU2VsZWN0b3JgXG4gKiBmdW5jdGlvbiB0byBnZXQgYW4gT2JzZXJ2YWJsZSB0aGF0IHRlbGxzIHdoZW4gdG8gY2xvc2UgdGhlIGJ1ZmZlci48L3NwYW4+XG4gKlxuICogIVtdKGJ1ZmZlclRvZ2dsZS5wbmcpXG4gKlxuICogQnVmZmVycyB2YWx1ZXMgZnJvbSB0aGUgc291cmNlIGJ5IG9wZW5pbmcgdGhlIGJ1ZmZlciB2aWEgc2lnbmFscyBmcm9tIGFuXG4gKiBPYnNlcnZhYmxlIHByb3ZpZGVkIHRvIGBvcGVuaW5nc2AsIGFuZCBjbG9zaW5nIGFuZCBzZW5kaW5nIHRoZSBidWZmZXJzIHdoZW5cbiAqIGEgU3Vic2NyaWJhYmxlIG9yIFByb21pc2UgcmV0dXJuZWQgYnkgdGhlIGBjbG9zaW5nU2VsZWN0b3JgIGZ1bmN0aW9uIGVtaXRzLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBFdmVyeSBvdGhlciBzZWNvbmQsIGVtaXQgdGhlIGNsaWNrIGV2ZW50cyBmcm9tIHRoZSBuZXh0IDUwMG1zXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50LCBpbnRlcnZhbCwgZW1wdHkgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IGJ1ZmZlclRvZ2dsZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgb3BlbmluZ3MgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyVG9nZ2xlKG9wZW5pbmdzLCBpID0+XG4gKiAgIGkgJSAyID8gaW50ZXJ2YWwoNTAwKSA6IGVtcHR5KClcbiAqICkpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYnVmZmVyfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyQ291bnR9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUaW1lfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RvZ2dsZX1cbiAqXG4gKiBAcGFyYW0ge1N1YnNjcmliYWJsZU9yUHJvbWlzZTxPPn0gb3BlbmluZ3MgQSBTdWJzY3JpYmFibGUgb3IgUHJvbWlzZSBvZiBub3RpZmljYXRpb25zIHRvIHN0YXJ0IG5ld1xuICogYnVmZmVycy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IE8pOiBTdWJzY3JpYmFibGVPclByb21pc2V9IGNsb3NpbmdTZWxlY3RvciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIHRoZSB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBgb3BlbmluZ3NgIG9ic2VydmFibGUgYW5kIHJldHVybnMgYSBTdWJzY3JpYmFibGUgb3IgUHJvbWlzZSxcbiAqIHdoaWNoLCB3aGVuIGl0IGVtaXRzLCBzaWduYWxzIHRoYXQgdGhlIGFzc29jaWF0ZWQgYnVmZmVyIHNob3VsZCBiZSBlbWl0dGVkXG4gKiBhbmQgY2xlYXJlZC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gb2JzZXJ2YWJsZSBvZiBhcnJheXMgb2YgYnVmZmVyZWQgdmFsdWVzLlxuICogQG1ldGhvZCBidWZmZXJUb2dnbGVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJUb2dnbGU8VCwgTz4oXG4gIG9wZW5pbmdzOiBTdWJzY3JpYmFibGVPclByb21pc2U8Tz4sXG4gIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PlxuKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUW10+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGJ1ZmZlclRvZ2dsZU9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJUb2dnbGVPcGVyYXRvcjxULCBPPihvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSk7XG4gIH07XG59XG5cbmNsYXNzIEJ1ZmZlclRvZ2dsZU9wZXJhdG9yPFQsIE8+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVFtdPiB7XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBvcGVuaW5nczogU3Vic2NyaWJhYmxlT3JQcm9taXNlPE8+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFRbXT4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQnVmZmVyVG9nZ2xlU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLm9wZW5pbmdzLCB0aGlzLmNsb3NpbmdTZWxlY3RvcikpO1xuICB9XG59XG5cbmludGVyZmFjZSBCdWZmZXJDb250ZXh0PFQ+IHtcbiAgYnVmZmVyOiBUW107XG4gIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyVG9nZ2xlU3Vic2NyaWJlcjxULCBPPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBPPiB7XG4gIHByaXZhdGUgY29udGV4dHM6IEFycmF5PEJ1ZmZlckNvbnRleHQ8VD4+ID0gW107XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VFtdPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBvcGVuaW5nczogU3Vic2NyaWJhYmxlT3JQcm9taXNlPE8+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNsb3NpbmdTZWxlY3RvcjogKHZhbHVlOiBPKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PiB8IHZvaWQpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQoc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb3BlbmluZ3MpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcbiAgICBjb25zdCBsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29udGV4dHNbaV0uYnVmZmVyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG4gICAgd2hpbGUgKGNvbnRleHRzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0cy5zaGlmdCgpO1xuICAgICAgY29udGV4dC5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGNvbnRleHQuYnVmZmVyID0gbnVsbDtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgc3VwZXIuX2Vycm9yKGVycik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGNvbnRleHRzID0gdGhpcy5jb250ZXh0cztcbiAgICB3aGlsZSAoY29udGV4dHMubGVuZ3RoID4gMCkge1xuICAgICAgY29uc3QgY29udGV4dCA9IGNvbnRleHRzLnNoaWZ0KCk7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoY29udGV4dC5idWZmZXIpO1xuICAgICAgY29udGV4dC5zdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIGNvbnRleHQuYnVmZmVyID0gbnVsbDtcbiAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IGFueSwgaW5uZXJWYWx1ZTogTyxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIE8+KTogdm9pZCB7XG4gICAgb3V0ZXJWYWx1ZSA/IHRoaXMuY2xvc2VCdWZmZXIob3V0ZXJWYWx1ZSkgOiB0aGlzLm9wZW5CdWZmZXIoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIE8+KTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZUJ1ZmZlcigoPGFueT4gaW5uZXJTdWIpLmNvbnRleHQpO1xuICB9XG5cbiAgcHJpdmF0ZSBvcGVuQnVmZmVyKHZhbHVlOiBPKTogdm9pZCB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGNsb3NpbmdTZWxlY3RvciA9IHRoaXMuY2xvc2luZ1NlbGVjdG9yO1xuICAgICAgY29uc3QgY2xvc2luZ05vdGlmaWVyID0gY2xvc2luZ1NlbGVjdG9yLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgaWYgKGNsb3NpbmdOb3RpZmllcikge1xuICAgICAgICB0aGlzLnRyeVN1YnNjcmliZShjbG9zaW5nTm90aWZpZXIpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5fZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlQnVmZmVyKGNvbnRleHQ6IEJ1ZmZlckNvbnRleHQ8VD4pOiB2b2lkIHtcbiAgICBjb25zdCBjb250ZXh0cyA9IHRoaXMuY29udGV4dHM7XG5cbiAgICBpZiAoY29udGV4dHMgJiYgY29udGV4dCkge1xuICAgICAgY29uc3QgeyBidWZmZXIsIHN1YnNjcmlwdGlvbiB9ID0gY29udGV4dDtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgY29udGV4dHMuc3BsaWNlKGNvbnRleHRzLmluZGV4T2YoY29udGV4dCksIDEpO1xuICAgICAgdGhpcy5yZW1vdmUoc3Vic2NyaXB0aW9uKTtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5U3Vic2NyaWJlKGNsb3NpbmdOb3RpZmllcjogYW55KTogdm9pZCB7XG4gICAgY29uc3QgY29udGV4dHMgPSB0aGlzLmNvbnRleHRzO1xuXG4gICAgY29uc3QgYnVmZmVyOiBBcnJheTxUPiA9IFtdO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBjb25zdCBjb250ZXh0ID0geyBidWZmZXIsIHN1YnNjcmlwdGlvbiB9O1xuICAgIGNvbnRleHRzLnB1c2goY29udGV4dCk7XG5cbiAgICBjb25zdCBpbm5lclN1YnNjcmlwdGlvbiA9IHN1YnNjcmliZVRvUmVzdWx0KHRoaXMsIGNsb3NpbmdOb3RpZmllciwgPGFueT5jb250ZXh0KTtcblxuICAgIGlmICghaW5uZXJTdWJzY3JpcHRpb24gfHwgaW5uZXJTdWJzY3JpcHRpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLmNsb3NlQnVmZmVyKGNvbnRleHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICAoPGFueT4gaW5uZXJTdWJzY3JpcHRpb24pLmNvbnRleHQgPSBjb250ZXh0O1xuXG4gICAgICB0aGlzLmFkZChpbm5lclN1YnNjcmlwdGlvbik7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKGlubmVyU3Vic2NyaXB0aW9uKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==