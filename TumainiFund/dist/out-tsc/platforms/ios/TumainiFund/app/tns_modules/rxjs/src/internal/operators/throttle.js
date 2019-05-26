import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
export const defaultThrottleConfig = {
    leading: true,
    trailing: false
};
/**
 * Emits a value from the source Observable, then ignores subsequent source
 * values for a duration determined by another Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link throttleTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * ![](throttle.png)
 *
 * `throttle` emits the source Observable values on the output Observable
 * when its internal timer is disabled, and ignores source values when the timer
 * is enabled. Initially, the timer is disabled. As soon as the first source
 * value arrives, it is forwarded to the output Observable, and then the timer
 * is enabled by calling the `durationSelector` function with the source value,
 * which returns the "duration" Observable. When the duration Observable emits a
 * value or completes, the timer is disabled, and this process repeats for the
 * next source value.
 *
 * ## Example
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { throttle } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(throttle(ev => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttleTime}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration for each source value, returned as an Observable or a Promise.
 * @param {Object} config a configuration object to define `leading` and `trailing` behavior. Defaults
 * to `{ leading: true, trailing: false }`.
 * @return {Observable<T>} An Observable that performs the throttle operation to
 * limit the rate of emissions from the source.
 * @method throttle
 * @owner Observable
 */
export function throttle(durationSelector, config = defaultThrottleConfig) {
    return (source) => source.lift(new ThrottleOperator(durationSelector, config.leading, config.trailing));
}
class ThrottleOperator {
    constructor(durationSelector, leading, trailing) {
        this.durationSelector = durationSelector;
        this.leading = leading;
        this.trailing = trailing;
    }
    call(subscriber, source) {
        return source.subscribe(new ThrottleSubscriber(subscriber, this.durationSelector, this.leading, this.trailing));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc
 * @ignore
 * @extends {Ignored}
 */
class ThrottleSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector, _leading, _trailing) {
        super(destination);
        this.destination = destination;
        this.durationSelector = durationSelector;
        this._leading = _leading;
        this._trailing = _trailing;
        this._hasValue = false;
    }
    _next(value) {
        this._hasValue = true;
        this._sendValue = value;
        if (!this._throttled) {
            if (this._leading) {
                this.send();
            }
            else {
                this.throttle(value);
            }
        }
    }
    send() {
        const { _hasValue, _sendValue } = this;
        if (_hasValue) {
            this.destination.next(_sendValue);
            this.throttle(_sendValue);
        }
        this._hasValue = false;
        this._sendValue = null;
    }
    throttle(value) {
        const duration = this.tryDurationSelector(value);
        if (!!duration) {
            this.add(this._throttled = subscribeToResult(this, duration));
        }
    }
    tryDurationSelector(value) {
        try {
            return this.durationSelector(value);
        }
        catch (err) {
            this.destination.error(err);
            return null;
        }
    }
    throttlingDone() {
        const { _throttled, _trailing } = this;
        if (_throttled) {
            _throttled.unsubscribe();
        }
        this._throttled = null;
        if (_trailing) {
            this.send();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.throttlingDone();
    }
    notifyComplete() {
        this.throttlingDone();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3R0bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGhyb3R0bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBS0EsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBUzlELE1BQU0sQ0FBQyxNQUFNLHFCQUFxQixHQUFtQjtJQUNuRCxPQUFPLEVBQUUsSUFBSTtJQUNiLFFBQVEsRUFBRSxLQUFLO0NBQ2hCLENBQUM7QUFFRjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNHO0FBQ0gsTUFBTSxVQUFVLFFBQVEsQ0FBSSxnQkFBMEQsRUFDMUQsU0FBeUIscUJBQXFCO0lBQ3hFLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQUUsTUFBTSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUN6SCxDQUFDO0FBRUQsTUFBTSxnQkFBZ0I7SUFDcEIsWUFBb0IsZ0JBQTBELEVBQzFELE9BQWdCLEVBQ2hCLFFBQWlCO1FBRmpCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEM7UUFDMUQsWUFBTyxHQUFQLE9BQU8sQ0FBUztRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQ3JDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FDckIsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUN2RixDQUFDO0lBQ0osQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sa0JBQXlCLFNBQVEsZUFBcUI7SUFLMUQsWUFBc0IsV0FBMEIsRUFDNUIsZ0JBQTZELEVBQzdELFFBQWlCLEVBQ2pCLFNBQWtCO1FBQ3BDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUpDLGdCQUFXLEdBQVgsV0FBVyxDQUFlO1FBQzVCLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBNkM7UUFDN0QsYUFBUSxHQUFSLFFBQVEsQ0FBUztRQUNqQixjQUFTLEdBQVQsU0FBUyxDQUFTO1FBTDlCLGNBQVMsR0FBRyxLQUFLLENBQUM7SUFPMUIsQ0FBQztJQUVTLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXhCLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3BCLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtnQkFDakIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2FBQ2I7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0QjtTQUNGO0lBQ0gsQ0FBQztJQUVPLElBQUk7UUFDVixNQUFNLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxHQUFHLElBQUksQ0FBQztRQUN2QyxJQUFJLFNBQVMsRUFBRTtZQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLENBQUM7U0FDM0I7UUFDRCxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztRQUN2QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztJQUN6QixDQUFDO0lBRU8sUUFBUSxDQUFDLEtBQVE7UUFDdkIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxDQUFDLFFBQVEsRUFBRTtZQUNkLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsR0FBRyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQztTQUMvRDtJQUNILENBQUM7SUFFTyxtQkFBbUIsQ0FBQyxLQUFRO1FBQ2xDLElBQUk7WUFDRixPQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUNyQztRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTyxJQUFJLENBQUM7U0FDYjtJQUNILENBQUM7SUFFTyxjQUFjO1FBQ3BCLE1BQU0sRUFBRSxVQUFVLEVBQUUsU0FBUyxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBQ3ZDLElBQUksVUFBVSxFQUFFO1lBQ2QsVUFBVSxDQUFDLFdBQVcsRUFBRSxDQUFDO1NBQzFCO1FBQ0QsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUM7UUFFdkIsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDYjtJQUNILENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDeEIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU3Vic2NyaWJhYmxlT3JQcm9taXNlLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFRocm90dGxlQ29uZmlnIHtcbiAgbGVhZGluZz86IGJvb2xlYW47XG4gIHRyYWlsaW5nPzogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZmF1bHRUaHJvdHRsZUNvbmZpZzogVGhyb3R0bGVDb25maWcgPSB7XG4gIGxlYWRpbmc6IHRydWUsXG4gIHRyYWlsaW5nOiBmYWxzZVxufTtcblxuLyoqXG4gKiBFbWl0cyBhIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0aGVuIGlnbm9yZXMgc3Vic2VxdWVudCBzb3VyY2VcbiAqIHZhbHVlcyBmb3IgYSBkdXJhdGlvbiBkZXRlcm1pbmVkIGJ5IGFub3RoZXIgT2JzZXJ2YWJsZSwgdGhlbiByZXBlYXRzIHRoaXNcbiAqIHByb2Nlc3MuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgdGhyb3R0bGVUaW1lfSwgYnV0IHRoZSBzaWxlbmNpbmdcbiAqIGR1cmF0aW9uIGlzIGRldGVybWluZWQgYnkgYSBzZWNvbmQgT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogIVtdKHRocm90dGxlLnBuZylcbiAqXG4gKiBgdGhyb3R0bGVgIGVtaXRzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB2YWx1ZXMgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlXG4gKiB3aGVuIGl0cyBpbnRlcm5hbCB0aW1lciBpcyBkaXNhYmxlZCwgYW5kIGlnbm9yZXMgc291cmNlIHZhbHVlcyB3aGVuIHRoZSB0aW1lclxuICogaXMgZW5hYmxlZC4gSW5pdGlhbGx5LCB0aGUgdGltZXIgaXMgZGlzYWJsZWQuIEFzIHNvb24gYXMgdGhlIGZpcnN0IHNvdXJjZVxuICogdmFsdWUgYXJyaXZlcywgaXQgaXMgZm9yd2FyZGVkIHRvIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYW5kIHRoZW4gdGhlIHRpbWVyXG4gKiBpcyBlbmFibGVkIGJ5IGNhbGxpbmcgdGhlIGBkdXJhdGlvblNlbGVjdG9yYCBmdW5jdGlvbiB3aXRoIHRoZSBzb3VyY2UgdmFsdWUsXG4gKiB3aGljaCByZXR1cm5zIHRoZSBcImR1cmF0aW9uXCIgT2JzZXJ2YWJsZS4gV2hlbiB0aGUgZHVyYXRpb24gT2JzZXJ2YWJsZSBlbWl0cyBhXG4gKiB2YWx1ZSBvciBjb21wbGV0ZXMsIHRoZSB0aW1lciBpcyBkaXNhYmxlZCwgYW5kIHRoaXMgcHJvY2VzcyByZXBlYXRzIGZvciB0aGVcbiAqIG5leHQgc291cmNlIHZhbHVlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgY2xpY2tzIGF0IGEgcmF0ZSBvZiBhdCBtb3N0IG9uZSBjbGljayBwZXIgc2Vjb25kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQgfSBmcm9tICdyeGpzJztcbiAqIGltcG9ydCB7IHRocm90dGxlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZSh0aHJvdHRsZShldiA9PiBpbnRlcnZhbCgxMDAwKSkpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGF1ZGl0fVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2V9XG4gKiBAc2VlIHtAbGluayBkZWxheVdoZW59XG4gKiBAc2VlIHtAbGluayBzYW1wbGV9XG4gKiBAc2VlIHtAbGluayB0aHJvdHRsZVRpbWV9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZX0gZHVyYXRpb25TZWxlY3RvciBBIGZ1bmN0aW9uXG4gKiB0aGF0IHJlY2VpdmVzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUsIGZvciBjb21wdXRpbmcgdGhlIHNpbGVuY2luZ1xuICogZHVyYXRpb24gZm9yIGVhY2ggc291cmNlIHZhbHVlLCByZXR1cm5lZCBhcyBhbiBPYnNlcnZhYmxlIG9yIGEgUHJvbWlzZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBjb25maWcgYSBjb25maWd1cmF0aW9uIG9iamVjdCB0byBkZWZpbmUgYGxlYWRpbmdgIGFuZCBgdHJhaWxpbmdgIGJlaGF2aW9yLiBEZWZhdWx0c1xuICogdG8gYHsgbGVhZGluZzogdHJ1ZSwgdHJhaWxpbmc6IGZhbHNlIH1gLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IHBlcmZvcm1zIHRoZSB0aHJvdHRsZSBvcGVyYXRpb24gdG9cbiAqIGxpbWl0IHRoZSByYXRlIG9mIGVtaXNzaW9ucyBmcm9tIHRoZSBzb3VyY2UuXG4gKiBAbWV0aG9kIHRocm90dGxlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGhyb3R0bGU8VD4oZHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55PixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc6IFRocm90dGxlQ29uZmlnID0gZGVmYXVsdFRocm90dGxlQ29uZmlnKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBUaHJvdHRsZU9wZXJhdG9yKGR1cmF0aW9uU2VsZWN0b3IsIGNvbmZpZy5sZWFkaW5nLCBjb25maWcudHJhaWxpbmcpKTtcbn1cblxuY2xhc3MgVGhyb3R0bGVPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+LFxuICAgICAgICAgICAgICBwcml2YXRlIGxlYWRpbmc6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdHJhaWxpbmc6IGJvb2xlYW4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShcbiAgICAgIG5ldyBUaHJvdHRsZVN1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy5kdXJhdGlvblNlbGVjdG9yLCB0aGlzLmxlYWRpbmcsIHRoaXMudHJhaWxpbmcpXG4gICAgKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2NcbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBUaHJvdHRsZVN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIF90aHJvdHRsZWQ6IFN1YnNjcmlwdGlvbjtcbiAgcHJpdmF0ZSBfc2VuZFZhbHVlOiBUO1xuICBwcml2YXRlIF9oYXNWYWx1ZSA9IGZhbHNlO1xuXG4gIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxudW1iZXI+LFxuICAgICAgICAgICAgICBwcml2YXRlIF9sZWFkaW5nOiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIF90cmFpbGluZzogYm9vbGVhbikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRoaXMuX2hhc1ZhbHVlID0gdHJ1ZTtcbiAgICB0aGlzLl9zZW5kVmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICghdGhpcy5fdGhyb3R0bGVkKSB7XG4gICAgICBpZiAodGhpcy5fbGVhZGluZykge1xuICAgICAgICB0aGlzLnNlbmQoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudGhyb3R0bGUodmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2VuZCgpIHtcbiAgICBjb25zdCB7IF9oYXNWYWx1ZSwgX3NlbmRWYWx1ZSB9ID0gdGhpcztcbiAgICBpZiAoX2hhc1ZhbHVlKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoX3NlbmRWYWx1ZSk7XG4gICAgICB0aGlzLnRocm90dGxlKF9zZW5kVmFsdWUpO1xuICAgIH1cbiAgICB0aGlzLl9oYXNWYWx1ZSA9IGZhbHNlO1xuICAgIHRoaXMuX3NlbmRWYWx1ZSA9IG51bGw7XG4gIH1cblxuICBwcml2YXRlIHRocm90dGxlKHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgZHVyYXRpb24gPSB0aGlzLnRyeUR1cmF0aW9uU2VsZWN0b3IodmFsdWUpO1xuICAgIGlmICghIWR1cmF0aW9uKSB7XG4gICAgICB0aGlzLmFkZCh0aGlzLl90aHJvdHRsZWQgPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBkdXJhdGlvbikpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgdHJ5RHVyYXRpb25TZWxlY3Rvcih2YWx1ZTogVCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIHRoaXMuZHVyYXRpb25TZWxlY3Rvcih2YWx1ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHRocm90dGxpbmdEb25lKCkge1xuICAgIGNvbnN0IHsgX3Rocm90dGxlZCwgX3RyYWlsaW5nIH0gPSB0aGlzO1xuICAgIGlmIChfdGhyb3R0bGVkKSB7XG4gICAgICBfdGhyb3R0bGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIHRoaXMuX3Rocm90dGxlZCA9IG51bGw7XG5cbiAgICBpZiAoX3RyYWlsaW5nKSB7XG4gICAgICB0aGlzLnNlbmQoKTtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMudGhyb3R0bGluZ0RvbmUoKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMudGhyb3R0bGluZ0RvbmUoKTtcbiAgfVxufVxuIl19