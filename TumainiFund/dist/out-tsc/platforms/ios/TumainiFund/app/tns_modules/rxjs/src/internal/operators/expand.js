import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/* tslint:enable:max-line-length */
/**
 * Recursively projects each source value to an Observable which is merged in
 * the output Observable.
 *
 * <span class="informal">It's similar to {@link mergeMap}, but applies the
 * projection function to every source value as well as every output value.
 * It's recursive.</span>
 *
 * ![](expand.png)
 *
 * Returns an Observable that emits items based on applying a function that you
 * supply to each item emitted by the source Observable, where that function
 * returns an Observable, and then merging those resulting Observables and
 * emitting the results of this merger. *Expand* will re-emit on the output
 * Observable every source value. Then, each output value is given to the
 * `project` function which returns an inner Observable to be merged on the
 * output Observable. Those output values resulting from the projection are also
 * given to the `project` function to produce new output values. This is how
 * *expand* behaves recursively.
 *
 * ## Example
 * Start emitting the powers of two on every click, at most 10 of them
 * ```javascript
 * import { fromEvent, of } from 'rxjs';
 * import { expand, mapTo, delay, take } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const powersOfTwo = clicks.pipe(
 *   mapTo(1),
 *   expand(x => of(2 * x).pipe(delay(1000))),
 *   take(10),
 * );
 * powersOfTwo.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link mergeMap}
 * @see {@link mergeScan}
 *
 * @param {function(value: T, index: number) => Observable} project A function
 * that, when applied to an item emitted by the source or the output Observable,
 * returns an Observable.
 * @param {number} [concurrent=Number.POSITIVE_INFINITY] Maximum number of input
 * Observables being subscribed to concurrently.
 * @param {SchedulerLike} [scheduler=null] The {@link SchedulerLike} to use for subscribing to
 * each projected inner Observable.
 * @return {Observable} An Observable that emits the source values and also
 * result of applying the projection function to each value emitted on the
 * output Observable and and merging the results of the Observables obtained
 * from this transformation.
 * @method expand
 * @owner Observable
 */
export function expand(project, concurrent = Number.POSITIVE_INFINITY, scheduler = undefined) {
    concurrent = (concurrent || 0) < 1 ? Number.POSITIVE_INFINITY : concurrent;
    return (source) => source.lift(new ExpandOperator(project, concurrent, scheduler));
}
export class ExpandOperator {
    constructor(project, concurrent, scheduler) {
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
    }
    call(subscriber, source) {
        return source.subscribe(new ExpandSubscriber(subscriber, this.project, this.concurrent, this.scheduler));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class ExpandSubscriber extends OuterSubscriber {
    constructor(destination, project, concurrent, scheduler) {
        super(destination);
        this.project = project;
        this.concurrent = concurrent;
        this.scheduler = scheduler;
        this.index = 0;
        this.active = 0;
        this.hasCompleted = false;
        if (concurrent < Number.POSITIVE_INFINITY) {
            this.buffer = [];
        }
    }
    static dispatch(arg) {
        const { subscriber, result, value, index } = arg;
        subscriber.subscribeToProjection(result, value, index);
    }
    _next(value) {
        const destination = this.destination;
        if (destination.closed) {
            this._complete();
            return;
        }
        const index = this.index++;
        if (this.active < this.concurrent) {
            destination.next(value);
            try {
                const { project } = this;
                const result = project(value, index);
                if (!this.scheduler) {
                    this.subscribeToProjection(result, value, index);
                }
                else {
                    const state = { subscriber: this, result, value, index };
                    const destination = this.destination;
                    destination.add(this.scheduler.schedule(ExpandSubscriber.dispatch, 0, state));
                }
            }
            catch (e) {
                destination.error(e);
            }
        }
        else {
            this.buffer.push(value);
        }
    }
    subscribeToProjection(result, value, index) {
        this.active++;
        const destination = this.destination;
        destination.add(subscribeToResult(this, result, value, index));
    }
    _complete() {
        this.hasCompleted = true;
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
        this.unsubscribe();
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this._next(innerValue);
    }
    notifyComplete(innerSub) {
        const buffer = this.buffer;
        const destination = this.destination;
        destination.remove(innerSub);
        this.active--;
        if (buffer && buffer.length > 0) {
            this._next(buffer.shift());
        }
        if (this.hasCompleted && this.active === 0) {
            this.destination.complete();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXhwYW5kLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL2V4cGFuZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFJQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFNOUQsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtREc7QUFDSCxNQUFNLFVBQVUsTUFBTSxDQUFPLE9BQXdELEVBQ3hELGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUIsRUFDN0MsWUFBMkIsU0FBUztJQUMvRCxVQUFVLEdBQUcsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQztJQUUzRSxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLGNBQWMsQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDcEcsQ0FBQztBQUVELE1BQU0sT0FBTyxjQUFjO0lBQ3pCLFlBQW9CLE9BQXdELEVBQ3hELFVBQWtCLEVBQ2xCLFNBQXdCO1FBRnhCLFlBQU8sR0FBUCxPQUFPLENBQWlEO1FBQ3hELGVBQVUsR0FBVixVQUFVLENBQVE7UUFDbEIsY0FBUyxHQUFULFNBQVMsQ0FBZTtJQUM1QyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxV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O1FBQ3pCLElBQUksSUFBSSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxjQUFjLENBQUMsUUFBc0I7UUFDbkMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBMkIsQ0FBQztRQUNyRCxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztRQUNkLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7U0FDNUI7UUFDRCxJQUFJLElBQUksQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDMUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztTQUM3QjtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgT3BlcmF0b3JGdW5jdGlvbiwgT2JzZXJ2YWJsZUlucHV0LCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBleHBhbmQ8VCwgUj4ocHJvamVjdDogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBPYnNlcnZhYmxlSW5wdXQ8Uj4sIGNvbmN1cnJlbnQ/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+O1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZDxUPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxUPiwgY29uY3VycmVudD86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvamVjdHMgZWFjaCBzb3VyY2UgdmFsdWUgdG8gYW4gT2JzZXJ2YWJsZSB3aGljaCBpcyBtZXJnZWQgaW5cbiAqIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBzaW1pbGFyIHRvIHtAbGluayBtZXJnZU1hcH0sIGJ1dCBhcHBsaWVzIHRoZVxuICogcHJvamVjdGlvbiBmdW5jdGlvbiB0byBldmVyeSBzb3VyY2UgdmFsdWUgYXMgd2VsbCBhcyBldmVyeSBvdXRwdXQgdmFsdWUuXG4gKiBJdCdzIHJlY3Vyc2l2ZS48L3NwYW4+XG4gKlxuICogIVtdKGV4cGFuZC5wbmcpXG4gKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgaXRlbXMgYmFzZWQgb24gYXBwbHlpbmcgYSBmdW5jdGlvbiB0aGF0IHlvdVxuICogc3VwcGx5IHRvIGVhY2ggaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgd2hlcmUgdGhhdCBmdW5jdGlvblxuICogcmV0dXJucyBhbiBPYnNlcnZhYmxlLCBhbmQgdGhlbiBtZXJnaW5nIHRob3NlIHJlc3VsdGluZyBPYnNlcnZhYmxlcyBhbmRcbiAqIGVtaXR0aW5nIHRoZSByZXN1bHRzIG9mIHRoaXMgbWVyZ2VyLiAqRXhwYW5kKiB3aWxsIHJlLWVtaXQgb24gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZSBldmVyeSBzb3VyY2UgdmFsdWUuIFRoZW4sIGVhY2ggb3V0cHV0IHZhbHVlIGlzIGdpdmVuIHRvIHRoZVxuICogYHByb2plY3RgIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gaW5uZXIgT2JzZXJ2YWJsZSB0byBiZSBtZXJnZWQgb24gdGhlXG4gKiBvdXRwdXQgT2JzZXJ2YWJsZS4gVGhvc2Ugb3V0cHV0IHZhbHVlcyByZXN1bHRpbmcgZnJvbSB0aGUgcHJvamVjdGlvbiBhcmUgYWxzb1xuICogZ2l2ZW4gdG8gdGhlIGBwcm9qZWN0YCBmdW5jdGlvbiB0byBwcm9kdWNlIG5ldyBvdXRwdXQgdmFsdWVzLiBUaGlzIGlzIGhvd1xuICogKmV4cGFuZCogYmVoYXZlcyByZWN1cnNpdmVseS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBTdGFydCBlbWl0dGluZyB0aGUgcG93ZXJzIG9mIHR3byBvbiBldmVyeSBjbGljaywgYXQgbW9zdCAxMCBvZiB0aGVtXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQsIG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBleHBhbmQsIG1hcFRvLCBkZWxheSwgdGFrZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgcG93ZXJzT2ZUd28gPSBjbGlja3MucGlwZShcbiAqICAgbWFwVG8oMSksXG4gKiAgIGV4cGFuZCh4ID0+IG9mKDIgKiB4KS5waXBlKGRlbGF5KDEwMDApKSksXG4gKiAgIHRha2UoMTApLFxuICogKTtcbiAqIHBvd2Vyc09mVHdvLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIG1lcmdlTWFwfVxuICogQHNlZSB7QGxpbmsgbWVyZ2VTY2FufVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24odmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGV9IHByb2plY3QgQSBmdW5jdGlvblxuICogdGhhdCwgd2hlbiBhcHBsaWVkIHRvIGFuIGl0ZW0gZW1pdHRlZCBieSB0aGUgc291cmNlIG9yIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSxcbiAqIHJldHVybnMgYW4gT2JzZXJ2YWJsZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbY29uY3VycmVudD1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gbnVtYmVyIG9mIGlucHV0XG4gKiBPYnNlcnZhYmxlcyBiZWluZyBzdWJzY3JpYmVkIHRvIGNvbmN1cnJlbnRseS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcj1udWxsXSBUaGUge0BsaW5rIFNjaGVkdWxlckxpa2V9IHRvIHVzZSBmb3Igc3Vic2NyaWJpbmcgdG9cbiAqIGVhY2ggcHJvamVjdGVkIGlubmVyIE9ic2VydmFibGUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIHNvdXJjZSB2YWx1ZXMgYW5kIGFsc29cbiAqIHJlc3VsdCBvZiBhcHBseWluZyB0aGUgcHJvamVjdGlvbiBmdW5jdGlvbiB0byBlYWNoIHZhbHVlIGVtaXR0ZWQgb24gdGhlXG4gKiBvdXRwdXQgT2JzZXJ2YWJsZSBhbmQgYW5kIG1lcmdpbmcgdGhlIHJlc3VsdHMgb2YgdGhlIE9ic2VydmFibGVzIG9idGFpbmVkXG4gKiBmcm9tIHRoaXMgdHJhbnNmb3JtYXRpb24uXG4gKiBAbWV0aG9kIGV4cGFuZFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV4cGFuZDxULCBSPihwcm9qZWN0OiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IE9ic2VydmFibGVJbnB1dDxSPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uY3VycmVudDogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UgPSB1bmRlZmluZWQpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgY29uY3VycmVudCA9IChjb25jdXJyZW50IHx8IDApIDwgMSA/IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSA6IGNvbmN1cnJlbnQ7XG5cbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBFeHBhbmRPcGVyYXRvcihwcm9qZWN0LCBjb25jdXJyZW50LCBzY2hlZHVsZXIpKTtcbn1cblxuZXhwb3J0IGNsYXNzIEV4cGFuZE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBFeHBhbmRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucHJvamVjdCwgdGhpcy5jb25jdXJyZW50LCB0aGlzLnNjaGVkdWxlcikpO1xuICB9XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaEFyZzxULCBSPiB7XG4gIHN1YnNjcmliZXI6IEV4cGFuZFN1YnNjcmliZXI8VCwgUj47XG4gIHJlc3VsdDogT2JzZXJ2YWJsZUlucHV0PFI+O1xuICB2YWx1ZTogYW55O1xuICBpbmRleDogbnVtYmVyO1xufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEV4cGFuZFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuICBwcml2YXRlIGFjdGl2ZTogbnVtYmVyID0gMDtcbiAgcHJpdmF0ZSBoYXNDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBidWZmZXI6IGFueVtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByb2plY3Q6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gT2JzZXJ2YWJsZUlucHV0PFI+LFxuICAgICAgICAgICAgICBwcml2YXRlIGNvbmN1cnJlbnQ6IG51bWJlcixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzY2hlZHVsZXI6IFNjaGVkdWxlckxpa2UpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgaWYgKGNvbmN1cnJlbnQgPCBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFkpIHtcbiAgICAgIHRoaXMuYnVmZmVyID0gW107XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzdGF0aWMgZGlzcGF0Y2g8VCwgUj4oYXJnOiBEaXNwYXRjaEFyZzxULCBSPik6IHZvaWQge1xuICAgIGNvbnN0IHtzdWJzY3JpYmVyLCByZXN1bHQsIHZhbHVlLCBpbmRleH0gPSBhcmc7XG4gICAgc3Vic2NyaWJlci5zdWJzY3JpYmVUb1Byb2plY3Rpb24ocmVzdWx0LCB2YWx1ZSwgaW5kZXgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBhbnkpOiB2b2lkIHtcbiAgICBjb25zdCBkZXN0aW5hdGlvbiA9IHRoaXMuZGVzdGluYXRpb247XG5cbiAgICBpZiAoZGVzdGluYXRpb24uY2xvc2VkKSB7XG4gICAgICB0aGlzLl9jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5pbmRleCsrO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA8IHRoaXMuY29uY3VycmVudCkge1xuICAgICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCB7IHByb2plY3QgfSA9IHRoaXM7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IHByb2plY3QodmFsdWUsIGluZGV4KTtcbiAgICAgICAgaWYgKCF0aGlzLnNjaGVkdWxlcikge1xuICAgICAgICAgIHRoaXMuc3Vic2NyaWJlVG9Qcm9qZWN0aW9uKHJlc3VsdCwgdmFsdWUsIGluZGV4KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zdCBzdGF0ZTogRGlzcGF0Y2hBcmc8VCwgUj4gPSB7IHN1YnNjcmliZXI6IHRoaXMsIHJlc3VsdCwgdmFsdWUsIGluZGV4IH07XG4gICAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICAgICAgICBkZXN0aW5hdGlvbi5hZGQodGhpcy5zY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hBcmc8VCwgUj4+KEV4cGFuZFN1YnNjcmliZXIuZGlzcGF0Y2gsIDAsIHN0YXRlKSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZGVzdGluYXRpb24uZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYnVmZmVyLnB1c2godmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlVG9Qcm9qZWN0aW9uKHJlc3VsdDogYW55LCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZlKys7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5hZGQoc3Vic2NyaWJlVG9SZXN1bHQ8VCwgUj4odGhpcywgcmVzdWx0LCB2YWx1ZSwgaW5kZXgpKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5oYXNDb21wbGV0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLmhhc0NvbXBsZXRlZCAmJiB0aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFIsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuX25leHQoaW5uZXJWYWx1ZSk7XG4gIH1cblxuICBub3RpZnlDb21wbGV0ZShpbm5lclN1YjogU3Vic2NyaXB0aW9uKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICBkZXN0aW5hdGlvbi5yZW1vdmUoaW5uZXJTdWIpO1xuICAgIHRoaXMuYWN0aXZlLS07XG4gICAgaWYgKGJ1ZmZlciAmJiBidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5fbmV4dChidWZmZXIuc2hpZnQoKSk7XG4gICAgfVxuICAgIGlmICh0aGlzLmhhc0NvbXBsZXRlZCAmJiB0aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19