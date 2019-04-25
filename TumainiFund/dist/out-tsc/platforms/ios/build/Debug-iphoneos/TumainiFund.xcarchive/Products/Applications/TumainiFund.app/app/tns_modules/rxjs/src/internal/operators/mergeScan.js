import { tryCatch } from '../util/tryCatch';
import { errorObject } from '../util/errorObject';
import { subscribeToResult } from '../util/subscribeToResult';
import { OuterSubscriber } from '../OuterSubscriber';
import { InnerSubscriber } from '../InnerSubscriber';
/**
 * Applies an accumulator function over the source Observable where the
 * accumulator function itself returns an Observable, then each intermediate
 * Observable returned is merged into the output Observable.
 *
 * <span class="informal">It's like {@link scan}, but the Observables returned
 * by the accumulator are merged into the outer Observable.</span>
 *
 * ## Example
 * Count the number of click events
 * ```javascript
 * const click$ = fromEvent(document, 'click');
 * const one$ = click$.pipe(mapTo(1));
 * const seed = 0;
 * const count$ = one$.pipe(
 *   mergeScan((acc, one) => of(acc + one), seed),
 * );
 * count$.subscribe(x => console.log(x));
 *
 * // Results:
 * 1
 * 2
 * 3
 * 4
 * // ...and so on for each click
 * ```
 *
 * @param {function(acc: R, value: T): Observable<R>} accumulator
 * The accumulator function called on each source value.
 * @param seed The initial accumulation value.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of
 * input Observables being subscribed to concurrently.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method mergeScan
 * @owner Observable
 */
export function mergeScan(accumulator, seed, concurrent = Number.POSITIVE_INFINITY) {
    return (source) => source.lift(new MergeScanOperator(accumulator, seed, concurrent));
}
export class MergeScanOperator {
    constructor(accumulator, seed, concurrent) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.concurrent = concurrent;
    }
    call(subscriber, source) {
        return source.subscribe(new MergeScanSubscriber(subscriber, this.accumulator, this.seed, this.concurrent));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class MergeScanSubscriber extends OuterSubscriber {
    constructor(destination, accumulator, acc, concurrent) {
        super(destination);
        this.accumulator = accumulator;
        this.acc = acc;
        this.concurrent = concurrent;
        this.hasValue = false;
        this.hasCompleted = false;
        this.buffer = [];
        this.active = 0;
        this.index = 0;
    }
    _next(value) {
        if (this.active < this.concurrent) {
            const index = this.index++;
            const ish = tryCatch(this.accumulator)(this.acc, value);
            const destination = this.destination;
            if (ish === errorObject) {
                destination.error(errorObject.e);
            }
            else {
                this.active++;
                this._innerSub(ish, value, index);
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    _innerSub(ish, value, index) {
        const innerSubscriber = new InnerSubscriber(this, undefined, undefined);
        const destination = this.destination;
        destination.add(innerSubscriber);
        subscribeToResult(this, ish, value, index, innerSubscriber);
    }
    _complete() {
        this.hasCompleted = true;
        if (this.active === 0 && this.buffer.length === 0) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        const { destination } = this;
        this.acc = innerValue;
        this.hasValue = true;
        destination.next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        const destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer.length > 0) {
            this._next(buffer.shift());
        }
        else if (this.active === 0 && this.hasCompleted) {
            if (this.hasValue === false) {
                this.destination.next(this.acc);
            }
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVyZ2VTY2FuLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL21lcmdlU2Nhbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFHckQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUNHO0FBQ0gsTUFBTSxVQUFVLFNBQVMsQ0FBTyxXQUFxRCxFQUNyRCxJQUFPLEVBQ1AsYUFBcUIsTUFBTSxDQUFDLGlCQUFpQjtJQUMzRSxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGlCQUFpQixDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUN0RyxDQUFDO0FBRUQsTUFBTSxPQUFPLGlCQUFpQjtJQUM1QixZQUFvQixXQUFxRCxFQUNyRCxJQUFPLEVBQ1AsVUFBa0I7UUFGbEIsZ0JBQVcsR0FBWCxXQUFXLENBQTBDO1FBQ3JELFNBQUksR0FBSixJQUFJLENBQUc7UUFDUCxlQUFVLEdBQVYsVUFBVSxDQUFRO0lBQ3RDLENBQUM7SUFF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QUFRLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVELGNBQWMsQ0FBQyxRQUFzQjtRQUNuQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxXQUEyQixDQUFDO1FBQ3JELFdBQVcsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ2QsSUFBSSxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUNyQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1NBQzVCO2FBQU0sSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ2pELElBQUksSUFBSSxDQUFDLFFBQVEsS0FBSyxLQUFLLEVBQUU7Z0JBQzNCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQzthQUNqQztZQUNELElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyB0cnlDYXRjaCB9IGZyb20gJy4uL3V0aWwvdHJ5Q2F0Y2gnO1xuaW1wb3J0IHsgZXJyb3JPYmplY3QgfSBmcm9tICcuLi91dGlsL2Vycm9yT2JqZWN0JztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IE9ic2VydmFibGVJbnB1dCwgT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBBcHBsaWVzIGFuIGFjY3VtdWxhdG9yIGZ1bmN0aW9uIG92ZXIgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdoZXJlIHRoZVxuICogYWNjdW11bGF0b3IgZnVuY3Rpb24gaXRzZWxmIHJldHVybnMgYW4gT2JzZXJ2YWJsZSwgdGhlbiBlYWNoIGludGVybWVkaWF0ZVxuICogT2JzZXJ2YWJsZSByZXR1cm5lZCBpcyBtZXJnZWQgaW50byB0aGUgb3V0cHV0IE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MgbGlrZSB7QGxpbmsgc2Nhbn0sIGJ1dCB0aGUgT2JzZXJ2YWJsZXMgcmV0dXJuZWRcbiAqIGJ5IHRoZSBhY2N1bXVsYXRvciBhcmUgbWVyZ2VkIGludG8gdGhlIG91dGVyIE9ic2VydmFibGUuPC9zcGFuPlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2xpY2sgZXZlbnRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGljayQgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3Qgb25lJCA9IGNsaWNrJC5waXBlKG1hcFRvKDEpKTtcbiAqIGNvbnN0IHNlZWQgPSAwO1xuICogY29uc3QgY291bnQkID0gb25lJC5waXBlKFxuICogICBtZXJnZVNjYW4oKGFjYywgb25lKSA9PiBvZihhY2MgKyBvbmUpLCBzZWVkKSxcbiAqICk7XG4gKiBjb3VudCQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHM6XG4gKiAxXG4gKiAyXG4gKiAzXG4gKiA0XG4gKiAvLyAuLi5hbmQgc28gb24gZm9yIGVhY2ggY2xpY2tcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oYWNjOiBSLCB2YWx1ZTogVCk6IE9ic2VydmFibGU8Uj59IGFjY3VtdWxhdG9yXG4gKiBUaGUgYWNjdW11bGF0b3IgZnVuY3Rpb24gY2FsbGVkIG9uIGVhY2ggc291cmNlIHZhbHVlLlxuICogQHBhcmFtIHNlZWQgVGhlIGluaXRpYWwgYWNjdW11bGF0aW9uIHZhbHVlLlxuICogQHBhcmFtIHtudW1iZXJ9IFtjb25jdXJyZW50PU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBudW1iZXIgb2ZcbiAqIGlucHV0IE9ic2VydmFibGVzIGJlaW5nIHN1YnNjcmliZWQgdG8gY29uY3VycmVudGx5LlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxSPn0gQW4gb2JzZXJ2YWJsZSBvZiB0aGUgYWNjdW11bGF0ZWQgdmFsdWVzLlxuICogQG1ldGhvZCBtZXJnZVNjYW5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZXJnZVNjYW48VCwgUj4oYWNjdW11bGF0b3I6IChhY2M6IFIsIHZhbHVlOiBUKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlZWQ6IFIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmN1cnJlbnQ6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IE1lcmdlU2Nhbk9wZXJhdG9yKGFjY3VtdWxhdG9yLCBzZWVkLCBjb25jdXJyZW50KSk7XG59XG5cbmV4cG9ydCBjbGFzcyBNZXJnZVNjYW5PcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzZWVkOiBSLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IE1lcmdlU2NhblN1YnNjcmliZXIoXG4gICAgICBzdWJzY3JpYmVyLCB0aGlzLmFjY3VtdWxhdG9yLCB0aGlzLnNlZWQsIHRoaXMuY29uY3VycmVudFxuICAgICkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgTWVyZ2VTY2FuU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiB7XG4gIHByaXZhdGUgaGFzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBidWZmZXI6IE9ic2VydmFibGU8YW55PltdID0gW107XG4gIHByaXZhdGUgYWN0aXZlOiBudW1iZXIgPSAwO1xuICBwcm90ZWN0ZWQgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgYWNjdW11bGF0b3I6IChhY2M6IFIsIHZhbHVlOiBUKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgYWNjOiBSLFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYWN0aXZlIDwgdGhpcy5jb25jdXJyZW50KSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICAgIGNvbnN0IGlzaCA9IHRyeUNhdGNoKHRoaXMuYWNjdW11bGF0b3IpKHRoaXMuYWNjLCB2YWx1ZSk7XG4gICAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG4gICAgICBpZiAoaXNoID09PSBlcnJvck9iamVjdCkge1xuICAgICAgICBkZXN0aW5hdGlvbi5lcnJvcihlcnJvck9iamVjdC5lKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuYWN0aXZlKys7XG4gICAgICAgIHRoaXMuX2lubmVyU3ViKGlzaCwgdmFsdWUsIGluZGV4KTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5idWZmZXIucHVzaCh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBfaW5uZXJTdWIoaXNoOiBhbnksIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgaW5uZXJTdWJzY3JpYmVyID0gbmV3IElubmVyU3Vic2NyaWJlcih0aGlzLCB1bmRlZmluZWQsIHVuZGVmaW5lZCk7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5hZGQoaW5uZXJTdWJzY3JpYmVyKTtcbiAgICBzdWJzY3JpYmVUb1Jlc3VsdDxULCBSPih0aGlzLCBpc2gsIHZhbHVlLCBpbmRleCwgaW5uZXJTdWJzY3JpYmVyKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5oYXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCAmJiB0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDApIHtcbiAgICAgIGlmICh0aGlzLmhhc1ZhbHVlID09PSBmYWxzZSkge1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy5hY2MpO1xuICAgICAgfVxuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHsgZGVzdGluYXRpb24gfSA9IHRoaXM7XG4gICAgdGhpcy5hY2MgPSBpbm5lclZhbHVlO1xuICAgIHRoaXMuaGFzVmFsdWUgPSB0cnVlO1xuICAgIGRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5yZW1vdmUoaW5uZXJTdWIpO1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLl9uZXh0KGJ1ZmZlci5zaGlmdCgpKTtcbiAgICB9IGVsc2UgaWYgKHRoaXMuYWN0aXZlID09PSAwICYmIHRoaXMuaGFzQ29tcGxldGVkKSB7XG4gICAgICBpZiAodGhpcy5oYXNWYWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHRoaXMuYWNjKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==