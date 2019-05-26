import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Ignores source values for a duration determined by another Observable, then
 * emits the most recent value from the source Observable, then repeats this
 * process.
 *
 * <span class="informal">It's like {@link auditTime}, but the silencing
 * duration is determined by a second Observable.</span>
 *
 * ![](audit.png)
 *
 * `audit` is similar to `throttle`, but emits the last value from the silenced
 * time window, instead of the first value. `audit` emits the most recent value
 * from the source Observable on the output Observable as soon as its internal
 * timer becomes disabled, and ignores source values while the timer is enabled.
 * Initially, the timer is disabled. As soon as the first source value arrives,
 * the timer is enabled by calling the `durationSelector` function with the
 * source value, which returns the "duration" Observable. When the duration
 * Observable emits a value or completes, the timer is disabled, then the most
 * recent source value is emitted on the output Observable, and this process
 * repeats for the next source value.
 *
 * ## Example
 *
 * Emit clicks at a rate of at most one click per second
 * ```javascript
 * import { fromEvent, interval } from 'rxjs';
 * import { audit } from 'rxjs/operators'
 *
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(audit(ev => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 * @see {@link auditTime}
 * @see {@link debounce}
 * @see {@link delayWhen}
 * @see {@link sample}
 * @see {@link throttle}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the silencing
 * duration, returned as an Observable or a Promise.
 * @return {Observable<T>} An Observable that performs rate-limiting of
 * emissions from the source Observable.
 * @method audit
 * @owner Observable
 */
export function audit(durationSelector) {
    return function auditOperatorFunction(source) {
        return source.lift(new AuditOperator(durationSelector));
    };
}
class AuditOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new AuditSubscriber(subscriber, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class AuditSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
        if (!this.throttled) {
            let duration;
            try {
                const { durationSelector } = this;
                duration = durationSelector(value);
            }
            catch (err) {
                return this.destination.error(err);
            }
            const innerSubscription = subscribeToResult(this, duration);
            if (!innerSubscription || innerSubscription.closed) {
                this.clearThrottle();
            }
            else {
                this.add(this.throttled = innerSubscription);
            }
        }
    }
    clearThrottle() {
        const { value, hasValue, throttled } = this;
        if (throttled) {
            this.remove(throttled);
            this.throttled = null;
            throttled.unsubscribe();
        }
        if (hasValue) {
            this.value = null;
            this.hasValue = false;
            this.destination.next(value);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex) {
        this.clearThrottle();
    }
    notifyComplete() {
        this.clearThrottle();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXVkaXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYXVkaXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3JELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLGdCQUEwRDtJQUNqRixPQUFPLFNBQVMscUJBQXFCLENBQUMsTUFBcUI7UUFDekQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxhQUFhO0lBQ2pCLFlBQW9CLGdCQUEwRDtRQUExRCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTBDO0lBQzlFLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGVBQWUsQ0FBTyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN4RixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxlQUFzQixTQUFRLGVBQXFCO0lBTXZELFlBQVksV0FBMEIsRUFDbEIsZ0JBQTBEO1FBQzVFLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQURELHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBMEM7UUFKdEUsYUFBUSxHQUFZLEtBQUssQ0FBQztJQU1sQyxDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDbkIsSUFBSSxRQUFRLENBQUM7WUFDYixJQUFJO2dCQUNGLE1BQU0sRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLElBQUksQ0FBQztnQkFDbEMsUUFBUSxHQUFHLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ3BDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osT0FBTyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNwQztZQUNELE1BQU0saUJBQWlCLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1lBQzVELElBQUksQ0FBQyxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxNQUFNLEVBQUU7Z0JBQ2xELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQzthQUN0QjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLEdBQUcsaUJBQWlCLENBQUMsQ0FBQzthQUM5QztTQUNGO0lBQ0gsQ0FBQztJQUVELGFBQWE7UUFDWCxNQUFNLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDNUMsSUFBSSxTQUFTLEVBQUU7WUFDYixJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLFNBQVMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUN6QjtRQUNELElBQUksUUFBUSxFQUFFO1lBQ1osSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7WUFDbEIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDOUI7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFhLEVBQUUsVUFBa0IsRUFBRSxVQUFrQjtRQUM3RSxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDdkIsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTdWJzY3JpYmFibGVPclByb21pc2UsIFRlYXJkb3duTG9naWMgfSBmcm9tICcuLi90eXBlcyc7XG5cbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG4vKipcbiAqIElnbm9yZXMgc291cmNlIHZhbHVlcyBmb3IgYSBkdXJhdGlvbiBkZXRlcm1pbmVkIGJ5IGFub3RoZXIgT2JzZXJ2YWJsZSwgdGhlblxuICogZW1pdHMgdGhlIG1vc3QgcmVjZW50IHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCB0aGVuIHJlcGVhdHMgdGhpc1xuICogcHJvY2Vzcy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBhdWRpdFRpbWV9LCBidXQgdGhlIHNpbGVuY2luZ1xuICogZHVyYXRpb24gaXMgZGV0ZXJtaW5lZCBieSBhIHNlY29uZCBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10oYXVkaXQucG5nKVxuICpcbiAqIGBhdWRpdGAgaXMgc2ltaWxhciB0byBgdGhyb3R0bGVgLCBidXQgZW1pdHMgdGhlIGxhc3QgdmFsdWUgZnJvbSB0aGUgc2lsZW5jZWRcbiAqIHRpbWUgd2luZG93LCBpbnN0ZWFkIG9mIHRoZSBmaXJzdCB2YWx1ZS4gYGF1ZGl0YCBlbWl0cyB0aGUgbW9zdCByZWNlbnQgdmFsdWVcbiAqIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSBhcyBzb29uIGFzIGl0cyBpbnRlcm5hbFxuICogdGltZXIgYmVjb21lcyBkaXNhYmxlZCwgYW5kIGlnbm9yZXMgc291cmNlIHZhbHVlcyB3aGlsZSB0aGUgdGltZXIgaXMgZW5hYmxlZC5cbiAqIEluaXRpYWxseSwgdGhlIHRpbWVyIGlzIGRpc2FibGVkLiBBcyBzb29uIGFzIHRoZSBmaXJzdCBzb3VyY2UgdmFsdWUgYXJyaXZlcyxcbiAqIHRoZSB0aW1lciBpcyBlbmFibGVkIGJ5IGNhbGxpbmcgdGhlIGBkdXJhdGlvblNlbGVjdG9yYCBmdW5jdGlvbiB3aXRoIHRoZVxuICogc291cmNlIHZhbHVlLCB3aGljaCByZXR1cm5zIHRoZSBcImR1cmF0aW9uXCIgT2JzZXJ2YWJsZS4gV2hlbiB0aGUgZHVyYXRpb25cbiAqIE9ic2VydmFibGUgZW1pdHMgYSB2YWx1ZSBvciBjb21wbGV0ZXMsIHRoZSB0aW1lciBpcyBkaXNhYmxlZCwgdGhlbiB0aGUgbW9zdFxuICogcmVjZW50IHNvdXJjZSB2YWx1ZSBpcyBlbWl0dGVkIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYW5kIHRoaXMgcHJvY2Vzc1xuICogcmVwZWF0cyBmb3IgdGhlIG5leHQgc291cmNlIHZhbHVlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBFbWl0IGNsaWNrcyBhdCBhIHJhdGUgb2YgYXQgbW9zdCBvbmUgY2xpY2sgcGVyIHNlY29uZFxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50LCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgYXVkaXQgfSBmcm9tICdyeGpzL29wZXJhdG9ycydcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoYXVkaXQoZXYgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqIEBzZWUge0BsaW5rIGF1ZGl0VGltZX1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlfVxuICogQHNlZSB7QGxpbmsgZGVsYXlXaGVufVxuICogQHNlZSB7QGxpbmsgc2FtcGxlfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGV9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbih2YWx1ZTogVCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZX0gZHVyYXRpb25TZWxlY3RvciBBIGZ1bmN0aW9uXG4gKiB0aGF0IHJlY2VpdmVzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUsIGZvciBjb21wdXRpbmcgdGhlIHNpbGVuY2luZ1xuICogZHVyYXRpb24sIHJldHVybmVkIGFzIGFuIE9ic2VydmFibGUgb3IgYSBQcm9taXNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUPn0gQW4gT2JzZXJ2YWJsZSB0aGF0IHBlcmZvcm1zIHJhdGUtbGltaXRpbmcgb2ZcbiAqIGVtaXNzaW9ucyBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgYXVkaXRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdWRpdDxUPihkdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGF1ZGl0T3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IEF1ZGl0T3BlcmF0b3IoZHVyYXRpb25TZWxlY3RvcikpO1xuICB9O1xufVxuXG5jbGFzcyBBdWRpdE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgQXVkaXRTdWJzY3JpYmVyPFQsIFQ+KHN1YnNjcmliZXIsIHRoaXMuZHVyYXRpb25TZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBBdWRpdFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuXG4gIHByaXZhdGUgdmFsdWU6IFQ7XG4gIHByaXZhdGUgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB0aHJvdHRsZWQ6IFN1YnNjcmlwdGlvbjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBkdXJhdGlvblNlbGVjdG9yOiAodmFsdWU6IFQpID0+IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuaGFzVmFsdWUgPSB0cnVlO1xuICAgIGlmICghdGhpcy50aHJvdHRsZWQpIHtcbiAgICAgIGxldCBkdXJhdGlvbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHsgZHVyYXRpb25TZWxlY3RvciB9ID0gdGhpcztcbiAgICAgICAgZHVyYXRpb24gPSBkdXJhdGlvblNlbGVjdG9yKHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXR1cm4gdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgfVxuICAgICAgY29uc3QgaW5uZXJTdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBkdXJhdGlvbik7XG4gICAgICBpZiAoIWlubmVyU3Vic2NyaXB0aW9uIHx8IGlubmVyU3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgICB0aGlzLmNsZWFyVGhyb3R0bGUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWRkKHRoaXMudGhyb3R0bGVkID0gaW5uZXJTdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGNsZWFyVGhyb3R0bGUoKSB7XG4gICAgY29uc3QgeyB2YWx1ZSwgaGFzVmFsdWUsIHRocm90dGxlZCB9ID0gdGhpcztcbiAgICBpZiAodGhyb3R0bGVkKSB7XG4gICAgICB0aGlzLnJlbW92ZSh0aHJvdHRsZWQpO1xuICAgICAgdGhpcy50aHJvdHRsZWQgPSBudWxsO1xuICAgICAgdGhyb3R0bGVkLnVuc3Vic2NyaWJlKCk7XG4gICAgfVxuICAgIGlmIChoYXNWYWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICB0aGlzLmhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG5vdGlmeU5leHQob3V0ZXJWYWx1ZTogVCwgaW5uZXJWYWx1ZTogUiwgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyVGhyb3R0bGUoKTtcbiAgfVxuXG4gIG5vdGlmeUNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJUaHJvdHRsZSgpO1xuICB9XG59XG4iXX0=