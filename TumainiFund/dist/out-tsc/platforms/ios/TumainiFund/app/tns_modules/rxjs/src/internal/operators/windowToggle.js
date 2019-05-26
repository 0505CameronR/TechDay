import { Subject } from '../Subject';
import { Subscription } from '../Subscription';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Branch out the source Observable values as a nested Observable starting from
 * an emission from `openings` and ending when the output of `closingSelector`
 * emits.
 *
 * <span class="informal">It's like {@link bufferToggle}, but emits a nested
 * Observable instead of an array.</span>
 *
 * ![](windowToggle.png)
 *
 * Returns an Observable that emits windows of items it collects from the source
 * Observable. The output Observable emits windows that contain those items
 * emitted by the source Observable between the time when the `openings`
 * Observable emits an item and when the Observable returned by
 * `closingSelector` emits an item.
 *
 * ## Example
 * Every other second, emit the click events from the next 500ms
 * ```javascript
 * import { fromEvent, interval } from 'rxjs';
 * import { windowToggle, mergeAll } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const openings = interval(1000);
 * const result = clicks.pipe(
 *   windowToggle(openings, i => i % 2 ? interval(500) : empty()),
 *   mergeAll(),
 * );
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link window}
 * @see {@link windowCount}
 * @see {@link windowTime}
 * @see {@link windowWhen}
 * @see {@link bufferToggle}
 *
 * @param {Observable<O>} openings An observable of notifications to start new
 * windows.
 * @param {function(value: O): Observable} closingSelector A function that takes
 * the value emitted by the `openings` observable and returns an Observable,
 * which, when it emits (either `next` or `complete`), signals that the
 * associated window should complete.
 * @return {Observable<Observable<T>>} An observable of windows, which in turn
 * are Observables.
 * @method windowToggle
 * @owner Observable
 */
export function windowToggle(openings, closingSelector) {
    return (source) => source.lift(new WindowToggleOperator(openings, closingSelector));
}
class WindowToggleOperator {
    constructor(openings, closingSelector) {
        this.openings = openings;
        this.closingSelector = closingSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new WindowToggleSubscriber(subscriber, this.openings, this.closingSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class WindowToggleSubscriber extends OuterSubscriber {
    constructor(destination, openings, closingSelector) {
        super(destination);
        this.openings = openings;
        this.closingSelector = closingSelector;
        this.contexts = [];
        this.add(this.openSubscription = subscribeToResult(this, openings, openings));
    }
    _next(value) {
        const { contexts } = this;
        if (contexts) {
            const len = contexts.length;
            for (let i = 0; i < len; i++) {
                contexts[i].window.next(value);
            }
        }
    }
    _error(err) {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.error(err);
                context.subscription.unsubscribe();
            }
        }
        super._error(err);
    }
    _complete() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.complete();
                context.subscription.unsubscribe();
            }
        }
        super._complete();
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _unsubscribe() {
        const { contexts } = this;
        this.contexts = null;
        if (contexts) {
            const len = contexts.length;
            let index = -1;
            while (++index < len) {
                const context = contexts[index];
                context.window.unsubscribe();
                context.subscription.unsubscribe();
            }
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (outerValue === this.openings) {
            let closingNotifier;
            try {
                const { closingSelector } = this;
                closingNotifier = closingSelector(innerValue);
            }
            catch (e) {
                return this.error(e);
            }
            const window = new Subject();
            const subscription = new Subscription();
            const context = { window, subscription };
            this.contexts.push(context);
            const innerSubscription = subscribeToResult(this, closingNotifier, context);
            if (innerSubscription.closed) {
                this.closeWindow(this.contexts.length - 1);
            }
            else {
                innerSubscription.context = context;
                subscription.add(innerSubscription);
            }
            this.destination.next(window);
        }
        else {
            this.closeWindow(this.contexts.indexOf(outerValue));
        }
    }
    notifyError(err) {
        this.error(err);
    }
    notifyComplete(inner) {
        if (inner !== this.openSubscription) {
            this.closeWindow(this.contexts.indexOf(inner.context));
        }
    }
    closeWindow(index) {
        if (index === -1) {
            return;
        }
        const { contexts } = this;
        const context = contexts[index];
        const { window, subscription } = context;
        contexts.splice(index, 1);
        window.complete();
        subscription.unsubscribe();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2luZG93VG9nZ2xlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3dpbmRvd1RvZ2dsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sWUFBWSxDQUFDO0FBQ3JDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMvQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBK0NHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBTyxRQUF1QixFQUN2QixlQUFrRDtJQUNuRixPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLG9CQUFvQixDQUFPLFFBQVEsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO0FBQzNHLENBQUM7QUFFRCxNQUFNLG9CQUFvQjtJQUV4QixZQUFvQixRQUF1QixFQUN2QixlQUFrRDtRQURsRCxhQUFRLEdBQVIsUUFBUSxDQUFlO1FBQ3ZCLG9CQUFlLEdBQWYsZUFBZSxDQUFtQztJQUN0RSxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXFDLEVBQUUsTUFBVztRQUNyRCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxzQkFBc0IsQ0FDaEQsVUFBVSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FDaEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBT0Q7Ozs7R0FJRztBQUNILE1BQU0sc0JBQTZCLFNBQVEs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QixJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxjQUFjLENBQUMsS0FBbUI7UUFDaEMsSUFBSSxLQUFLLEtBQUssSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ25DLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQVEsS0FBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRU8sV0FBVyxDQUFDLEtBQWE7UUFDL0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7WUFDaEIsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFFLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQztRQUMxQixNQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDaEMsTUFBTSxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsR0FBRyxPQUFPLENBQUM7UUFDekMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDMUIsTUFBTSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2xCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM3QixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJyYW5jaCBvdXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyBhcyBhIG5lc3RlZCBPYnNlcnZhYmxlIHN0YXJ0aW5nIGZyb21cbiAqIGFuIGVtaXNzaW9uIGZyb20gYG9wZW5pbmdzYCBhbmQgZW5kaW5nIHdoZW4gdGhlIG91dHB1dCBvZiBgY2xvc2luZ1NlbGVjdG9yYFxuICogZW1pdHMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfSwgYnV0IGVtaXRzIGEgbmVzdGVkXG4gKiBPYnNlcnZhYmxlIGluc3RlYWQgb2YgYW4gYXJyYXkuPC9zcGFuPlxuICpcbiAqICFbXSh3aW5kb3dUb2dnbGUucG5nKVxuICpcbiAqIFJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHdpbmRvd3Mgb2YgaXRlbXMgaXQgY29sbGVjdHMgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLiBUaGUgb3V0cHV0IE9ic2VydmFibGUgZW1pdHMgd2luZG93cyB0aGF0IGNvbnRhaW4gdGhvc2UgaXRlbXNcbiAqIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJldHdlZW4gdGhlIHRpbWUgd2hlbiB0aGUgYG9wZW5pbmdzYFxuICogT2JzZXJ2YWJsZSBlbWl0cyBhbiBpdGVtIGFuZCB3aGVuIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGJ5XG4gKiBgY2xvc2luZ1NlbGVjdG9yYCBlbWl0cyBhbiBpdGVtLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEV2ZXJ5IG90aGVyIHNlY29uZCwgZW1pdCB0aGUgY2xpY2sgZXZlbnRzIGZyb20gdGhlIG5leHQgNTAwbXNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGZyb21FdmVudCwgaW50ZXJ2YWwgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHdpbmRvd1RvZ2dsZSwgbWVyZ2VBbGwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IG9wZW5pbmdzID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShcbiAqICAgd2luZG93VG9nZ2xlKG9wZW5pbmdzLCBpID0+IGkgJSAyID8gaW50ZXJ2YWwoNTAwKSA6IGVtcHR5KCkpLFxuICogICBtZXJnZUFsbCgpLFxuICogKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayB3aW5kb3d9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dDb3VudH1cbiAqIEBzZWUge0BsaW5rIHdpbmRvd1RpbWV9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dXaGVufVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfVxuICpcbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZTxPPn0gb3BlbmluZ3MgQW4gb2JzZXJ2YWJsZSBvZiBub3RpZmljYXRpb25zIHRvIHN0YXJ0IG5ld1xuICogd2luZG93cy5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IE8pOiBPYnNlcnZhYmxlfSBjbG9zaW5nU2VsZWN0b3IgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiB0aGUgdmFsdWUgZW1pdHRlZCBieSB0aGUgYG9wZW5pbmdzYCBvYnNlcnZhYmxlIGFuZCByZXR1cm5zIGFuIE9ic2VydmFibGUsXG4gKiB3aGljaCwgd2hlbiBpdCBlbWl0cyAoZWl0aGVyIGBuZXh0YCBvciBgY29tcGxldGVgKSwgc2lnbmFscyB0aGF0IHRoZVxuICogYXNzb2NpYXRlZCB3aW5kb3cgc2hvdWxkIGNvbXBsZXRlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+Pn0gQW4gb2JzZXJ2YWJsZSBvZiB3aW5kb3dzLCB3aGljaCBpbiB0dXJuXG4gKiBhcmUgT2JzZXJ2YWJsZXMuXG4gKiBAbWV0aG9kIHdpbmRvd1RvZ2dsZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHdpbmRvd1RvZ2dsZTxULCBPPihvcGVuaW5nczogT2JzZXJ2YWJsZTxPPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIE9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBXaW5kb3dUb2dnbGVPcGVyYXRvcjxULCBPPihvcGVuaW5ncywgY2xvc2luZ1NlbGVjdG9yKSk7XG59XG5cbmNsYXNzIFdpbmRvd1RvZ2dsZU9wZXJhdG9yPFQsIE8+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgT2JzZXJ2YWJsZTxUPj4ge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgb3BlbmluZ3M6IE9ic2VydmFibGU8Tz4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxPYnNlcnZhYmxlPFQ+Piwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBXaW5kb3dUb2dnbGVTdWJzY3JpYmVyKFxuICAgICAgc3Vic2NyaWJlciwgdGhpcy5vcGVuaW5ncywgdGhpcy5jbG9zaW5nU2VsZWN0b3JcbiAgICApKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgV2luZG93Q29udGV4dDxUPiB7XG4gIHdpbmRvdzogU3ViamVjdDxUPjtcbiAgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBXaW5kb3dUb2dnbGVTdWJzY3JpYmVyPFQsIE8+IGV4dGVuZHMgT3V0ZXJTdWJzY3JpYmVyPFQsIGFueT4ge1xuICBwcml2YXRlIGNvbnRleHRzOiBXaW5kb3dDb250ZXh0PFQ+W10gPSBbXTtcbiAgcHJpdmF0ZSBvcGVuU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8T2JzZXJ2YWJsZTxUPj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb3BlbmluZ3M6IE9ic2VydmFibGU8Tz4sXG4gICAgICAgICAgICAgIHByaXZhdGUgY2xvc2luZ1NlbGVjdG9yOiAob3BlblZhbHVlOiBPKSA9PiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy5hZGQodGhpcy5vcGVuU3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb3BlbmluZ3MsIG9wZW5pbmdzIGFzIGFueSkpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgY29uc3QgeyBjb250ZXh0cyB9ID0gdGhpcztcbiAgICBpZiAoY29udGV4dHMpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29udGV4dHNbaV0ud2luZG93Lm5leHQodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfZXJyb3IoZXJyOiBhbnkpIHtcblxuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG5cbiAgICBpZiAoY29udGV4dHMpIHtcbiAgICAgIGNvbnN0IGxlbiA9IGNvbnRleHRzLmxlbmd0aDtcbiAgICAgIGxldCBpbmRleCA9IC0xO1xuXG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaW5kZXhdO1xuICAgICAgICBjb250ZXh0LndpbmRvdy5lcnJvcihlcnIpO1xuICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHN1cGVyLl9lcnJvcihlcnIpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCB7IGNvbnRleHRzIH0gPSB0aGlzO1xuICAgIHRoaXMuY29udGV4dHMgPSBudWxsO1xuICAgIGlmIChjb250ZXh0cykge1xuICAgICAgY29uc3QgbGVuID0gY29udGV4dHMubGVuZ3RoO1xuICAgICAgbGV0IGluZGV4ID0gLTE7XG4gICAgICB3aGlsZSAoKytpbmRleCA8IGxlbikge1xuICAgICAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaW5kZXhdO1xuICAgICAgICBjb250ZXh0LndpbmRvdy5jb21wbGV0ZSgpO1xuICAgICAgICBjb250ZXh0LnN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3Vuc3Vic2NyaWJlKCkge1xuICAgIGNvbnN0IHsgY29udGV4dHMgfSA9IHRoaXM7XG4gICAgdGhpcy5jb250ZXh0cyA9IG51bGw7XG4gICAgaWYgKGNvbnRleHRzKSB7XG4gICAgICBjb25zdCBsZW4gPSBjb250ZXh0cy5sZW5ndGg7XG4gICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgIHdoaWxlICgrK2luZGV4IDwgbGVuKSB7XG4gICAgICAgIGNvbnN0IGNvbnRleHQgPSBjb250ZXh0c1tpbmRleF07XG4gICAgICAgIGNvbnRleHQud2luZG93LnVuc3Vic2NyaWJlKCk7XG4gICAgICAgIGNvbnRleHQuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBhbnksIGlubmVyVmFsdWU6IGFueSxcbiAgICAgICAgICAgICBvdXRlckluZGV4OiBudW1iZXIsIGlubmVySW5kZXg6IG51bWJlcixcbiAgICAgICAgICAgICBpbm5lclN1YjogSW5uZXJTdWJzY3JpYmVyPFQsIGFueT4pOiB2b2lkIHtcblxuICAgIGlmIChvdXRlclZhbHVlID09PSB0aGlzLm9wZW5pbmdzKSB7XG4gICAgICBsZXQgY2xvc2luZ05vdGlmaWVyO1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgeyBjbG9zaW5nU2VsZWN0b3IgfSA9IHRoaXM7XG4gICAgICAgIGNsb3NpbmdOb3RpZmllciA9IGNsb3NpbmdTZWxlY3Rvcihpbm5lclZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZXJyb3IoZSk7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHdpbmRvdyA9IG5ldyBTdWJqZWN0PFQ+KCk7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBjb25zdCBjb250ZXh0ID0geyB3aW5kb3csIHN1YnNjcmlwdGlvbiB9O1xuICAgICAgdGhpcy5jb250ZXh0cy5wdXNoKGNvbnRleHQpO1xuICAgICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBjbG9zaW5nTm90aWZpZXIsIGNvbnRleHQgYXMgYW55KTtcblxuICAgICAgaWYgKGlubmVyU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgICB0aGlzLmNsb3NlV2luZG93KHRoaXMuY29udGV4dHMubGVuZ3RoIC0gMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAoPGFueT5pbm5lclN1YnNjcmlwdGlvbikuY29udGV4dCA9IGNvbnRleHQ7XG4gICAgICAgIHN1YnNjcmlwdGlvbi5hZGQoaW5uZXJTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQod2luZG93KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5jbG9zZVdpbmRvdyh0aGlzLmNvbnRleHRzLmluZGV4T2Yob3V0ZXJWYWx1ZSkpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeUVycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgdGhpcy5lcnJvcihlcnIpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoaW5uZXI6IFN1YnNjcmlwdGlvbik6IHZvaWQge1xuICAgIGlmIChpbm5lciAhPT0gdGhpcy5vcGVuU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLmNsb3NlV2luZG93KHRoaXMuY29udGV4dHMuaW5kZXhPZigoPGFueT4gaW5uZXIpLmNvbnRleHQpKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsb3NlV2luZG93KGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBjb250ZXh0cyB9ID0gdGhpcztcbiAgICBjb25zdCBjb250ZXh0ID0gY29udGV4dHNbaW5kZXhdO1xuICAgIGNvbnN0IHsgd2luZG93LCBzdWJzY3JpcHRpb24gfSA9IGNvbnRleHQ7XG4gICAgY29udGV4dHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICB3aW5kb3cuY29tcGxldGUoKTtcbiAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19