import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Emits a value from the source Observable only after a particular time span
 * determined by another Observable has passed without another source emission.
 *
 * <span class="informal">It's like {@link debounceTime}, but the time span of
 * emission silence is determined by a second Observable.</span>
 *
 * ![](debounce.png)
 *
 * `debounce` delays values emitted by the source Observable, but drops previous
 * pending delayed emissions if a new value arrives on the source Observable.
 * This operator keeps track of the most recent value from the source
 * Observable, and spawns a duration Observable by calling the
 * `durationSelector` function. The value is emitted only when the duration
 * Observable emits a value or completes, and if no other value was emitted on
 * the source Observable since the duration Observable was spawned. If a new
 * value appears before the duration Observable emits, the previous value will
 * be dropped and will not be emitted on the output Observable.
 *
 * Like {@link debounceTime}, this is a rate-limiting operator, and also a
 * delay-like operator since output emissions do not necessarily occur at the
 * same time as they did on the source Observable.
 *
 * ## Example
 * Emit the most recent click after a burst of clicks
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(debounce(() => interval(1000)));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounceTime}
 * @see {@link delayWhen}
 * @see {@link throttle}
 *
 * @param {function(value: T): SubscribableOrPromise} durationSelector A function
 * that receives a value from the source Observable, for computing the timeout
 * duration for each source value, returned as an Observable or a Promise.
 * @return {Observable} An Observable that delays the emissions of the source
 * Observable by the specified duration Observable returned by
 * `durationSelector`, and may drop some values if they occur too frequently.
 * @method debounce
 * @owner Observable
 */
export function debounce(durationSelector) {
    return (source) => source.lift(new DebounceOperator(durationSelector));
}
class DebounceOperator {
    constructor(durationSelector) {
        this.durationSelector = durationSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new DebounceSubscriber(subscriber, this.durationSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class DebounceSubscriber extends OuterSubscriber {
    constructor(destination, durationSelector) {
        super(destination);
        this.durationSelector = durationSelector;
        this.hasValue = false;
        this.durationSubscription = null;
    }
    _next(value) {
        try {
            const result = this.durationSelector.call(this, value);
            if (result) {
                this._tryNext(value, result);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    }
    _complete() {
        this.emitValue();
        this.destination.complete();
    }
    _tryNext(value, duration) {
        let subscription = this.durationSubscription;
        this.value = value;
        this.hasValue = true;
        if (subscription) {
            subscription.unsubscribe();
            this.remove(subscription);
        }
        subscription = subscribeToResult(this, duration);
        if (subscription && !subscription.closed) {
            this.add(this.durationSubscription = subscription);
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            const value = this.value;
            const subscription = this.durationSubscription;
            if (subscription) {
                this.durationSubscription = null;
                subscription.unsubscribe();
                this.remove(subscription);
            }
            // This must be done *before* passing the value
            // along to the destination because it's possible for
            // the value to synchronously re-enter this operator
            // recursively if the duration selector Observable
            // emits synchronously
            this.value = null;
            this.hasValue = false;
            super._next(value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVib3VuY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZGVib3VuY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBTUEsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBRXJELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTlEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRDRztBQUNILE1BQU0sVUFBVSxRQUFRLENBQUksZ0JBQTBEO0lBQ3BGLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ3hGLENBQUM7QUFFRCxNQUFNLGdCQUFnQjtJQUNwQixZQUFvQixnQkFBMEQ7UUFBMUQscUJBQWdCLEdBQWhCLGdCQUFnQixDQUEwQztJQUM5RSxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUNyRixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxrQkFBeUIsU0FBUSxlQUFxQjtJQUsxRCxZQUFZLFdBQTBCLEVBQ2xCLGdCQUEwRDtRQUM1RSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFERCxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQTBDO1FBSnRFLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIseUJBQW9CLEdBQWlCLElBQUksQ0FBQztJQUtsRCxDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSTtZQUNGLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1lBRXZELElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2FBQzlCO1NBQ0Y7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVTLFNBQVM7UUFDakIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDOUIsQ0FBQztJQUVPLFFBQVEsQ0FBQyxLQUFRLEVBQUUsUUFBb0M7UUFDN0QsSUFBSSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1FBQzdDLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQUksWUFBWSxFQUFFO1lBQ2hCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQzNCO1FBRUQsWUFBWSxHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQztRQUNqRCxJQUFJLFlBQVksSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUU7WUFDeEMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsWUFBWSxDQUFDLENBQUM7U0FDcEQ7SUFDSCxDQUFDO0lBRUQsVUFBVSxDQUFDLFVBQWEsRUFBRSxVQUFhLEVBQzVCLFVBQWtCLEVBQUUsVUFBa0IsRUFDdEMsUUFBK0I7UUFDeEMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLG9CQUFvQixDQUFDO1lBQy9DLElBQUksWUFBWSxFQUFFO2dCQUNoQixJQUFJLENBQUMsb0JBQW9CLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7Z0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7YUFDM0I7WUFDRCwrQ0FBK0M7WUFDL0MscURBQXFEO1lBQ3JELG9EQUFvRDtZQUNwRCxrREFBa0Q7WUFDbEQsc0JBQXNCO1lBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEI7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFN1YnNjcmliYWJsZU9yUHJvbWlzZSwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuaW1wb3J0IHsgT3V0ZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vT3V0ZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IElubmVyU3Vic2NyaWJlciB9IGZyb20gJy4uL0lubmVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBzdWJzY3JpYmVUb1Jlc3VsdCB9IGZyb20gJy4uL3V0aWwvc3Vic2NyaWJlVG9SZXN1bHQnO1xuXG4vKipcbiAqIEVtaXRzIGEgdmFsdWUgZnJvbSB0aGUgc291cmNlIE9ic2VydmFibGUgb25seSBhZnRlciBhIHBhcnRpY3VsYXIgdGltZSBzcGFuXG4gKiBkZXRlcm1pbmVkIGJ5IGFub3RoZXIgT2JzZXJ2YWJsZSBoYXMgcGFzc2VkIHdpdGhvdXQgYW5vdGhlciBzb3VyY2UgZW1pc3Npb24uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgZGVib3VuY2VUaW1lfSwgYnV0IHRoZSB0aW1lIHNwYW4gb2ZcbiAqIGVtaXNzaW9uIHNpbGVuY2UgaXMgZGV0ZXJtaW5lZCBieSBhIHNlY29uZCBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiAhW10oZGVib3VuY2UucG5nKVxuICpcbiAqIGBkZWJvdW5jZWAgZGVsYXlzIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IGRyb3BzIHByZXZpb3VzXG4gKiBwZW5kaW5nIGRlbGF5ZWQgZW1pc3Npb25zIGlmIGEgbmV3IHZhbHVlIGFycml2ZXMgb24gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogVGhpcyBvcGVyYXRvciBrZWVwcyB0cmFjayBvZiB0aGUgbW9zdCByZWNlbnQgdmFsdWUgZnJvbSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlLCBhbmQgc3Bhd25zIGEgZHVyYXRpb24gT2JzZXJ2YWJsZSBieSBjYWxsaW5nIHRoZVxuICogYGR1cmF0aW9uU2VsZWN0b3JgIGZ1bmN0aW9uLiBUaGUgdmFsdWUgaXMgZW1pdHRlZCBvbmx5IHdoZW4gdGhlIGR1cmF0aW9uXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUgb3IgY29tcGxldGVzLCBhbmQgaWYgbm8gb3RoZXIgdmFsdWUgd2FzIGVtaXR0ZWQgb25cbiAqIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBzaW5jZSB0aGUgZHVyYXRpb24gT2JzZXJ2YWJsZSB3YXMgc3Bhd25lZC4gSWYgYSBuZXdcbiAqIHZhbHVlIGFwcGVhcnMgYmVmb3JlIHRoZSBkdXJhdGlvbiBPYnNlcnZhYmxlIGVtaXRzLCB0aGUgcHJldmlvdXMgdmFsdWUgd2lsbFxuICogYmUgZHJvcHBlZCBhbmQgd2lsbCBub3QgYmUgZW1pdHRlZCBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogTGlrZSB7QGxpbmsgZGVib3VuY2VUaW1lfSwgdGhpcyBpcyBhIHJhdGUtbGltaXRpbmcgb3BlcmF0b3IsIGFuZCBhbHNvIGFcbiAqIGRlbGF5LWxpa2Ugb3BlcmF0b3Igc2luY2Ugb3V0cHV0IGVtaXNzaW9ucyBkbyBub3QgbmVjZXNzYXJpbHkgb2NjdXIgYXQgdGhlXG4gKiBzYW1lIHRpbWUgYXMgdGhleSBkaWQgb24gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgdGhlIG1vc3QgcmVjZW50IGNsaWNrIGFmdGVyIGEgYnVyc3Qgb2YgY2xpY2tzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcmVzdWx0ID0gY2xpY2tzLnBpcGUoZGVib3VuY2UoKCkgPT4gaW50ZXJ2YWwoMTAwMCkpKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBhdWRpdH1cbiAqIEBzZWUge0BsaW5rIGRlYm91bmNlVGltZX1cbiAqIEBzZWUge0BsaW5rIGRlbGF5V2hlbn1cbiAqIEBzZWUge0BsaW5rIHRocm90dGxlfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQpOiBTdWJzY3JpYmFibGVPclByb21pc2V9IGR1cmF0aW9uU2VsZWN0b3IgQSBmdW5jdGlvblxuICogdGhhdCByZWNlaXZlcyBhIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBmb3IgY29tcHV0aW5nIHRoZSB0aW1lb3V0XG4gKiBkdXJhdGlvbiBmb3IgZWFjaCBzb3VyY2UgdmFsdWUsIHJldHVybmVkIGFzIGFuIE9ic2VydmFibGUgb3IgYSBQcm9taXNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGRlbGF5cyB0aGUgZW1pc3Npb25zIG9mIHRoZSBzb3VyY2VcbiAqIE9ic2VydmFibGUgYnkgdGhlIHNwZWNpZmllZCBkdXJhdGlvbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5XG4gKiBgZHVyYXRpb25TZWxlY3RvcmAsIGFuZCBtYXkgZHJvcCBzb21lIHZhbHVlcyBpZiB0aGV5IG9jY3VyIHRvbyBmcmVxdWVudGx5LlxuICogQG1ldGhvZCBkZWJvdW5jZVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlYm91bmNlPFQ+KGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IERlYm91bmNlT3BlcmF0b3IoZHVyYXRpb25TZWxlY3RvcikpO1xufVxuXG5jbGFzcyBEZWJvdW5jZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGR1cmF0aW9uU2VsZWN0b3I6ICh2YWx1ZTogVCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPGFueT4pIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgRGVib3VuY2VTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuZHVyYXRpb25TZWxlY3RvcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBEZWJvdW5jZVN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIHZhbHVlOiBUO1xuICBwcml2YXRlIGhhc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgZHVyYXRpb25TdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiA9IG51bGw7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgZHVyYXRpb25TZWxlY3RvcjogKHZhbHVlOiBUKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8YW55Pikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSB0aGlzLmR1cmF0aW9uU2VsZWN0b3IuY2FsbCh0aGlzLCB2YWx1ZSk7XG5cbiAgICAgIGlmIChyZXN1bHQpIHtcbiAgICAgICAgdGhpcy5fdHJ5TmV4dCh2YWx1ZSwgcmVzdWx0KTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMuZW1pdFZhbHVlKCk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBfdHJ5TmV4dCh2YWx1ZTogVCwgZHVyYXRpb246IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxhbnk+KTogdm9pZCB7XG4gICAgbGV0IHN1YnNjcmlwdGlvbiA9IHRoaXMuZHVyYXRpb25TdWJzY3JpcHRpb247XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuaGFzVmFsdWUgPSB0cnVlO1xuICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5yZW1vdmUoc3Vic2NyaXB0aW9uKTtcbiAgICB9XG5cbiAgICBzdWJzY3JpcHRpb24gPSBzdWJzY3JpYmVUb1Jlc3VsdCh0aGlzLCBkdXJhdGlvbik7XG4gICAgaWYgKHN1YnNjcmlwdGlvbiAmJiAhc3Vic2NyaXB0aW9uLmNsb3NlZCkge1xuICAgICAgdGhpcy5hZGQodGhpcy5kdXJhdGlvblN1YnNjcmlwdGlvbiA9IHN1YnNjcmlwdGlvbik7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmVtaXRWYWx1ZSgpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5lbWl0VmFsdWUoKTtcbiAgfVxuXG4gIGVtaXRWYWx1ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5oYXNWYWx1ZSkge1xuICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLnZhbHVlO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gdGhpcy5kdXJhdGlvblN1YnNjcmlwdGlvbjtcbiAgICAgIGlmIChzdWJzY3JpcHRpb24pIHtcbiAgICAgICAgdGhpcy5kdXJhdGlvblN1YnNjcmlwdGlvbiA9IG51bGw7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICB0aGlzLnJlbW92ZShzdWJzY3JpcHRpb24pO1xuICAgICAgfVxuICAgICAgLy8gVGhpcyBtdXN0IGJlIGRvbmUgKmJlZm9yZSogcGFzc2luZyB0aGUgdmFsdWVcbiAgICAgIC8vIGFsb25nIHRvIHRoZSBkZXN0aW5hdGlvbiBiZWNhdXNlIGl0J3MgcG9zc2libGUgZm9yXG4gICAgICAvLyB0aGUgdmFsdWUgdG8gc3luY2hyb25vdXNseSByZS1lbnRlciB0aGlzIG9wZXJhdG9yXG4gICAgICAvLyByZWN1cnNpdmVseSBpZiB0aGUgZHVyYXRpb24gc2VsZWN0b3IgT2JzZXJ2YWJsZVxuICAgICAgLy8gZW1pdHMgc3luY2hyb25vdXNseVxuICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgICB0aGlzLmhhc1ZhbHVlID0gZmFsc2U7XG4gICAgICBzdXBlci5fbmV4dCh2YWx1ZSk7XG4gICAgfVxuICB9XG59XG4iXX0=