import { fromArray } from './fromArray';
import { isArray } from '../util/isArray';
import { Subscriber } from '../Subscriber';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
import { iterator as Symbol_iterator } from '../../internal/symbol/iterator';
/* tslint:enable:max-line-length */
/**
 * Combines multiple Observables to create an Observable whose values are calculated from the values, in order, of each
 * of its input Observables.
 *
 * If the last parameter is a function, this function is used to compute the created value from the input values.
 * Otherwise, an array of the input values is returned.
 *
 * ## Example
 * Combine age and name from different sources
 * ```javascript
 * import { zip, of } from 'rxjs';
 * import { map } from 'rxjs/operators';
 *
 * let age$ = of<number>(27, 25, 29);
 * let name$ = of<string>('Foo', 'Bar', 'Beer');
 * let isDev$ = of<boolean>(true, true, false);
 *
 * zip(age$, name$, isDev$).pipe(
 *   map(([age, name, isDev]) => ({ age, name, isDev })),
 * )
 * .subscribe(x => console.log(x));
 *
 * // outputs
 * // { age: 27, name: 'Foo', isDev: true }
 * // { age: 25, name: 'Bar', isDev: true }
 * // { age: 29, name: 'Beer', isDev: false }
 * ```
 * @param observables
 * @return {Observable<R>}
 * @static true
 * @name zip
 * @owner Observable
 */
export function zip(...observables) {
    const resultSelector = observables[observables.length - 1];
    if (typeof resultSelector === 'function') {
        observables.pop();
    }
    return fromArray(observables, undefined).lift(new ZipOperator(resultSelector));
}
export class ZipOperator {
    constructor(resultSelector) {
        this.resultSelector = resultSelector;
    }
    call(subscriber, source) {
        return source.subscribe(new ZipSubscriber(subscriber, this.resultSelector));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class ZipSubscriber extends Subscriber {
    constructor(destination, resultSelector, values = Object.create(null)) {
        super(destination);
        this.iterators = [];
        this.active = 0;
        this.resultSelector = (typeof resultSelector === 'function') ? resultSelector : null;
        this.values = values;
    }
    _next(value) {
        const iterators = this.iterators;
        if (isArray(value)) {
            iterators.push(new StaticArrayIterator(value));
        }
        else if (typeof value[Symbol_iterator] === 'function') {
            iterators.push(new StaticIterator(value[Symbol_iterator]()));
        }
        else {
            iterators.push(new ZipBufferIterator(this.destination, this, value));
        }
    }
    _complete() {
        const iterators = this.iterators;
        const len = iterators.length;
        this.unsubscribe();
        if (len === 0) {
            this.destination.complete();
            return;
        }
        this.active = len;
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (iterator.stillUnsubscribed) {
                const destination = this.destination;
                destination.add(iterator.subscribe(iterator, i));
            }
            else {
                this.active--; // not an observable
            }
        }
    }
    notifyInactive() {
        this.active--;
        if (this.active === 0) {
            this.destination.complete();
        }
    }
    checkIterators() {
        const iterators = this.iterators;
        const len = iterators.length;
        const destination = this.destination;
        // abort if not all of them have values
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            if (typeof iterator.hasValue === 'function' && !iterator.hasValue()) {
                return;
            }
        }
        let shouldComplete = false;
        const args = [];
        for (let i = 0; i < len; i++) {
            let iterator = iterators[i];
            let result = iterator.next();
            // check to see if it's completed now that you've gotten
            // the next value.
            if (iterator.hasCompleted()) {
                shouldComplete = true;
            }
            if (result.done) {
                destination.complete();
                return;
            }
            args.push(result.value);
        }
        if (this.resultSelector) {
            this._tryresultSelector(args);
        }
        else {
            destination.next(args);
        }
        if (shouldComplete) {
            destination.complete();
        }
    }
    _tryresultSelector(args) {
        let result;
        try {
            result = this.resultSelector.apply(this, args);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        this.destination.next(result);
    }
}
class StaticIterator {
    constructor(iterator) {
        this.iterator = iterator;
        this.nextResult = iterator.next();
    }
    hasValue() {
        return true;
    }
    next() {
        const result = this.nextResult;
        this.nextResult = this.iterator.next();
        return result;
    }
    hasCompleted() {
        const nextResult = this.nextResult;
        return nextResult && nextResult.done;
    }
}
class StaticArrayIterator {
    constructor(array) {
        this.array = array;
        this.index = 0;
        this.length = 0;
        this.length = array.length;
    }
    [Symbol_iterator]() {
        return this;
    }
    next(value) {
        const i = this.index++;
        const array = this.array;
        return i < this.length ? { value: array[i], done: false } : { value: null, done: true };
    }
    hasValue() {
        return this.array.length > this.index;
    }
    hasCompleted() {
        return this.array.length === this.index;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ZipBufferIterator extends OuterSubscriber {
    constructor(destination, parent, observable) {
        super(destination);
        this.parent = parent;
        this.observable = observable;
        this.stillUnsubscribed = true;
        this.buffer = [];
        this.isComplete = false;
    }
    [Symbol_iterator]() {
        return this;
    }
    // NOTE: there is actually a name collision here with Subscriber.next and Iterator.next
    //    this is legit because `next()` will never be called by a subscription in this case.
    next() {
        const buffer = this.buffer;
        if (buffer.length === 0 && this.isComplete) {
            return { value: null, done: true };
        }
        else {
            return { value: buffer.shift(), done: false };
        }
    }
    hasValue() {
        return this.buffer.length > 0;
    }
    hasCompleted() {
        return this.buffer.length === 0 && this.isComplete;
    }
    notifyComplete() {
        if (this.buffer.length > 0) {
            this.isComplete = true;
            this.parent.notifyInactive();
        }
        else {
            this.destination.complete();
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.buffer.push(innerValue);
        this.parent.checkIterators();
    }
    subscribe(value, index) {
        return subscribeToResult(this, this.observable, this, index);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS96aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUN4QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHMUMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFFBQVEsSUFBSSxlQUFlLEVBQUUsTUFBTSxnQ0FBZ0MsQ0FBQztBQWdDN0UsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWdDRztBQUNILE1BQU0sVUFBVSxHQUFHLENBQ2pCLEdBQUcsV0FBZ0U7SUFFbkUsTUFBTSxjQUFjLEdBQWdDLFdBQVcsQ0FBQyxXQUFXLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ3hGLElBQUksT0FBTyxjQUFjLEtBQUssVUFBVSxFQUFFO1FBQ3hDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUNuQjtJQUNELE9BQU8sU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztBQUNqRixDQUFDO0FBRUQsTUFBTSxPQUFPLFdBQVc7SUFJdEIsWUFBWSxjQUE2QztRQUN2RCxJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUN2QyxDQUFDO0lBRUQsSUFBSSxDQUFDLFVBQXlCLEVB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T0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUMsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDO1NBQy9DO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRUQsWUFBWTtRQUNWLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDckQsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxDQUFDO1NBQzlCO2FBQU07WUFDTCxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUFhLEVBQUUsVUFBZSxFQUM5QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELFNBQVMsQ0FBQyxLQUFVLEVBQUUsS0FBYTtRQUNqQyxPQUFPLGlCQUFpQixDQUFXLElBQUksRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLENBQUMsQ0FBQztJQUN6RSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBmcm9tQXJyYXkgfSBmcm9tICcuL2Zyb21BcnJheSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZUlucHV0LCBQYXJ0aWFsT2JzZXJ2ZXIsIE9ic2VydmVkVmFsdWVPZiB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5pbXBvcnQgeyBpdGVyYXRvciBhcyBTeW1ib2xfaXRlcmF0b3IgfSBmcm9tICcuLi8uLi9pbnRlcm5hbC9zeW1ib2wvaXRlcmF0b3InO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPE8xIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4sIFI+KHYxOiBPMSwgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPikgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxPMSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMiBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBSPih2MTogTzEsIHYyOiBPMiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgdjI6IE9ic2VydmVkVmFsdWVPZjxPMj4pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8TzEgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzIgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzMgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgUj4odjE6IE8xLCB2MjogTzIsIHYzOiBPMywgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgdjI6IE9ic2VydmVkVmFsdWVPZjxPMj4sIHYzOiBPYnNlcnZlZFZhbHVlT2Y8TzM+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCBwaXBlIHRvIG1hcCBpbnN0ZWFkICovXG5leHBvcnQgZnVuY3Rpb24gemlwPE8xIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4sIE8yIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4sIE8zIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4sIE80IGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4sIFI+KHYxOiBPMSwgdjI6IE8yLCB2MzogTzMsIHY0OiBPNCwgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgdjI6IE9ic2VydmVkVmFsdWVPZjxPMj4sIHYzOiBPYnNlcnZlZFZhbHVlT2Y8TzM+LCB2NDogT2JzZXJ2ZWRWYWx1ZU9mPE80PikgPT4gUik6IE9ic2VydmFibGU8Uj47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxPMSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMiBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPNCBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPNSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBSPih2MTogTzEsIHYyOiBPMiwgdjM6IE8zLCB2NDogTzQsIHY1OiBPNSwgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgdjI6IE9ic2VydmVkVmFsdWVPZjxPMj4sIHYzOiBPYnNlcnZlZFZhbHVlT2Y8TzM+LCB2NDogT2JzZXJ2ZWRWYWx1ZU9mPE80PiwgdjU6IE9ic2VydmVkVmFsdWVPZjxPNT4pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8TzEgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzIgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzMgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzQgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzUgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzYgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgUj4odjE6IE8xLCB2MjogTzIsIHYzOiBPMywgdjQ6IE80LCB2NTogTzUsIHY2OiBPNiwgcmVzdWx0U2VsZWN0b3I6ICh2MTogT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgdjI6IE9ic2VydmVkVmFsdWVPZjxPMj4sIHYzOiBPYnNlcnZlZFZhbHVlT2Y8TzM+LCB2NDogT2JzZXJ2ZWRWYWx1ZU9mPE80PiwgdjU6IE9ic2VydmVkVmFsdWVPZjxPNT4sIHY2OiBPYnNlcnZlZFZhbHVlT2Y8TzY+KSA9PiBSKTogT2JzZXJ2YWJsZTxSPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxPMSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMiBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+Pih2MTogTzEsIHYyOiBPMik6IE9ic2VydmFibGU8W09ic2VydmVkVmFsdWVPZjxPMT4sIE9ic2VydmVkVmFsdWVPZjxPMj5dPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8TzEgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzIgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzMgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55Pj4odjE6IE8xLCB2MjogTzIsIHYzOiBPMyk6IE9ic2VydmFibGU8W09ic2VydmVkVmFsdWVPZjxPMT4sIE9ic2VydmVkVmFsdWVPZjxPMj4sIE9ic2VydmVkVmFsdWVPZjxPMz5dPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8TzEgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzIgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzMgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzQgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55Pj4odjE6IE8xLCB2MjogTzIsIHYzOiBPMywgdjQ6IE80KTogT2JzZXJ2YWJsZTxbT2JzZXJ2ZWRWYWx1ZU9mPE8xPiwgT2JzZXJ2ZWRWYWx1ZU9mPE8yPiwgT2JzZXJ2ZWRWYWx1ZU9mPE8zPiwgT2JzZXJ2ZWRWYWx1ZU9mPE80Pl0+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcDxPMSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMiBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPMyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPNCBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBPNSBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+Pih2MTogTzEsIHYyOiBPMiwgdjM6IE8zLCB2NDogTzQsIHY1OiBPNSk6IE9ic2VydmFibGU8W09ic2VydmVkVmFsdWVPZjxPMT4sIE9ic2VydmVkVmFsdWVPZjxPMj4sIE9ic2VydmVkVmFsdWVPZjxPMz4sIE9ic2VydmVkVmFsdWVPZjxPND4sIE9ic2VydmVkVmFsdWVPZjxPNT5dPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8TzEgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzIgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzMgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzQgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzUgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgTzYgZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55Pj4odjE6IE8xLCB2MjogTzIsIHYzOiBPMywgdjQ6IE80LCB2NTogTzUsIHY2OiBPNik6IE9ic2VydmFibGU8W09ic2VydmVkVmFsdWVPZjxPMT4sIE9ic2VydmVkVmFsdWVPZjxPMj4sIE9ic2VydmVkVmFsdWVPZjxPMz4sIE9ic2VydmVkVmFsdWVPZjxPND4sIE9ic2VydmVkVmFsdWVPZjxPNT4sIE9ic2VydmVkVmFsdWVPZjxPNj5dPjtcblxuZXhwb3J0IGZ1bmN0aW9uIHppcDxPIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4+KGFycmF5OiBPW10pOiBPYnNlcnZhYmxlPE9ic2VydmVkVmFsdWVPZjxPPltdPjtcbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10pOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8TyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBSPihhcnJheTogT1tdLCByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogT2JzZXJ2ZWRWYWx1ZU9mPE8+W10pID0+IFIpOiBPYnNlcnZhYmxlPFI+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8Uj4oYXJyYXk6IE9ic2VydmFibGVJbnB1dDxhbnk+W10sIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBhbnlbXSkgPT4gUik6IE9ic2VydmFibGU8Uj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXA8TyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+PiguLi5vYnNlcnZhYmxlczogT1tdKTogT2JzZXJ2YWJsZTxPYnNlcnZlZFZhbHVlT2Y8Tz5bXT47XG5leHBvcnQgZnVuY3Rpb24gemlwPE8gZXh0ZW5kcyBPYnNlcnZhYmxlSW5wdXQ8YW55PiwgUj4oLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE8gfCAoKC4uLnZhbHVlczogT2JzZXJ2ZWRWYWx1ZU9mPE8+W10pID0+IFIpPik6IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gemlwPFI+KC4uLm9ic2VydmFibGVzOiBBcnJheTxPYnNlcnZhYmxlSW5wdXQ8YW55PiB8ICgoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSKT4pOiBPYnNlcnZhYmxlPFI+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDb21iaW5lcyBtdWx0aXBsZSBPYnNlcnZhYmxlcyB0byBjcmVhdGUgYW4gT2JzZXJ2YWJsZSB3aG9zZSB2YWx1ZXMgYXJlIGNhbGN1bGF0ZWQgZnJvbSB0aGUgdmFsdWVzLCBpbiBvcmRlciwgb2YgZWFjaFxuICogb2YgaXRzIGlucHV0IE9ic2VydmFibGVzLlxuICpcbiAqIElmIHRoZSBsYXN0IHBhcmFtZXRlciBpcyBhIGZ1bmN0aW9uLCB0aGlzIGZ1bmN0aW9uIGlzIHVzZWQgdG8gY29tcHV0ZSB0aGUgY3JlYXRlZCB2YWx1ZSBmcm9tIHRoZSBpbnB1dCB2YWx1ZXMuXG4gKiBPdGhlcndpc2UsIGFuIGFycmF5IG9mIHRoZSBpbnB1dCB2YWx1ZXMgaXMgcmV0dXJuZWQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogQ29tYmluZSBhZ2UgYW5kIG5hbWUgZnJvbSBkaWZmZXJlbnQgc291cmNlc1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgemlwLCBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgbWFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGxldCBhZ2UkID0gb2Y8bnVtYmVyPigyNywgMjUsIDI5KTtcbiAqIGxldCBuYW1lJCA9IG9mPHN0cmluZz4oJ0ZvbycsICdCYXInLCAnQmVlcicpO1xuICogbGV0IGlzRGV2JCA9IG9mPGJvb2xlYW4+KHRydWUsIHRydWUsIGZhbHNlKTtcbiAqXG4gKiB6aXAoYWdlJCwgbmFtZSQsIGlzRGV2JCkucGlwZShcbiAqICAgbWFwKChbYWdlLCBuYW1lLCBpc0Rldl0pID0+ICh7IGFnZSwgbmFtZSwgaXNEZXYgfSkpLFxuICogKVxuICogLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBvdXRwdXRzXG4gKiAvLyB7IGFnZTogMjcsIG5hbWU6ICdGb28nLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjUsIG5hbWU6ICdCYXInLCBpc0RldjogdHJ1ZSB9XG4gKiAvLyB7IGFnZTogMjksIG5hbWU6ICdCZWVyJywgaXNEZXY6IGZhbHNlIH1cbiAqIGBgYFxuICogQHBhcmFtIG9ic2VydmFibGVzXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFI+fVxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSB6aXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB6aXA8TyBleHRlbmRzIE9ic2VydmFibGVJbnB1dDxhbnk+LCBSPihcbiAgLi4ub2JzZXJ2YWJsZXM6IEFycmF5PE8gfCAoKC4uLnZhbHVlczogT2JzZXJ2ZWRWYWx1ZU9mPE8+W10pID0+IFIpPlxuKTogT2JzZXJ2YWJsZTxPYnNlcnZlZFZhbHVlT2Y8Tz5bXXxSPiB7XG4gIGNvbnN0IHJlc3VsdFNlbGVjdG9yID0gPCgoLi4ueXM6IEFycmF5PGFueT4pID0+IFIpPiBvYnNlcnZhYmxlc1tvYnNlcnZhYmxlcy5sZW5ndGggLSAxXTtcbiAgaWYgKHR5cGVvZiByZXN1bHRTZWxlY3RvciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9ic2VydmFibGVzLnBvcCgpO1xuICB9XG4gIHJldHVybiBmcm9tQXJyYXkob2JzZXJ2YWJsZXMsIHVuZGVmaW5lZCkubGlmdChuZXcgWmlwT3BlcmF0b3IocmVzdWx0U2VsZWN0b3IpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFppcE9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuXG4gIHJlc3VsdFNlbGVjdG9yOiAoLi4udmFsdWVzOiBBcnJheTxhbnk+KSA9PiBSO1xuXG4gIGNvbnN0cnVjdG9yKHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUikge1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSByZXN1bHRTZWxlY3RvcjtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBaaXBTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMucmVzdWx0U2VsZWN0b3IpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIFppcFN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSB2YWx1ZXM6IGFueTtcbiAgcHJpdmF0ZSByZXN1bHRTZWxlY3RvcjogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUjtcbiAgcHJpdmF0ZSBpdGVyYXRvcnM6IExvb2tBaGVhZEl0ZXJhdG9yPGFueT5bXSA9IFtdO1xuICBwcml2YXRlIGFjdGl2ZSA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sXG4gICAgICAgICAgICAgIHJlc3VsdFNlbGVjdG9yPzogKC4uLnZhbHVlczogQXJyYXk8YW55PikgPT4gUixcbiAgICAgICAgICAgICAgdmFsdWVzOiBhbnkgPSBPYmplY3QuY3JlYXRlKG51bGwpKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMucmVzdWx0U2VsZWN0b3IgPSAodHlwZW9mIHJlc3VsdFNlbGVjdG9yID09PSAnZnVuY3Rpb24nKSA/IHJlc3VsdFNlbGVjdG9yIDogbnVsbDtcbiAgICB0aGlzLnZhbHVlcyA9IHZhbHVlcztcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogYW55KSB7XG4gICAgY29uc3QgaXRlcmF0b3JzID0gdGhpcy5pdGVyYXRvcnM7XG4gICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICBpdGVyYXRvcnMucHVzaChuZXcgU3RhdGljQXJyYXlJdGVyYXRvcih2YWx1ZSkpO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHZhbHVlW1N5bWJvbF9pdGVyYXRvcl0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGl0ZXJhdG9ycy5wdXNoKG5ldyBTdGF0aWNJdGVyYXRvcih2YWx1ZVtTeW1ib2xfaXRlcmF0b3JdKCkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaXRlcmF0b3JzLnB1c2gobmV3IFppcEJ1ZmZlckl0ZXJhdG9yKHRoaXMuZGVzdGluYXRpb24sIHRoaXMsIHZhbHVlKSk7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpIHtcbiAgICBjb25zdCBpdGVyYXRvcnMgPSB0aGlzLml0ZXJhdG9ycztcbiAgICBjb25zdCBsZW4gPSBpdGVyYXRvcnMubGVuZ3RoO1xuXG4gICAgdGhpcy51bnN1YnNjcmliZSgpO1xuXG4gICAgaWYgKGxlbiA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuYWN0aXZlID0gbGVuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGxldCBpdGVyYXRvcjogWmlwQnVmZmVySXRlcmF0b3I8YW55LCBhbnk+ID0gPGFueT5pdGVyYXRvcnNbaV07XG4gICAgICBpZiAoaXRlcmF0b3Iuc3RpbGxVbnN1YnNjcmliZWQpIHtcbiAgICAgICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uIGFzIFN1YnNjcmlwdGlvbjtcbiAgICAgICAgZGVzdGluYXRpb24uYWRkKGl0ZXJhdG9yLnN1YnNjcmliZShpdGVyYXRvciwgaSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmUtLTsgLy8gbm90IGFuIG9ic2VydmFibGVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBub3RpZnlJbmFjdGl2ZSgpIHtcbiAgICB0aGlzLmFjdGl2ZS0tO1xuICAgIGlmICh0aGlzLmFjdGl2ZSA9PT0gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIGNoZWNrSXRlcmF0b3JzKCkge1xuICAgIGNvbnN0IGl0ZXJhdG9ycyA9IHRoaXMuaXRlcmF0b3JzO1xuICAgIGNvbnN0IGxlbiA9IGl0ZXJhdG9ycy5sZW5ndGg7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgLy8gYWJvcnQgaWYgbm90IGFsbCBvZiB0aGVtIGhhdmUgdmFsdWVzXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgbGV0IGl0ZXJhdG9yID0gaXRlcmF0b3JzW2ldO1xuICAgICAgaWYgKHR5cGVvZiBpdGVyYXRvci5oYXNWYWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiAhaXRlcmF0b3IuaGFzVmFsdWUoKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHNob3VsZENvbXBsZXRlID0gZmFsc2U7XG4gICAgY29uc3QgYXJnczogYW55W10gPSBbXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBsZXQgaXRlcmF0b3IgPSBpdGVyYXRvcnNbaV07XG4gICAgICBsZXQgcmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuXG4gICAgICAvLyBjaGVjayB0byBzZWUgaWYgaXQncyBjb21wbGV0ZWQgbm93IHRoYXQgeW91J3ZlIGdvdHRlblxuICAgICAgLy8gdGhlIG5leHQgdmFsdWUuXG4gICAgICBpZiAoaXRlcmF0b3IuaGFzQ29tcGxldGVkKCkpIHtcbiAgICAgICAgc2hvdWxkQ29tcGxldGUgPSB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAocmVzdWx0LmRvbmUpIHtcbiAgICAgICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcmdzLnB1c2gocmVzdWx0LnZhbHVlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5yZXN1bHRTZWxlY3Rvcikge1xuICAgICAgdGhpcy5fdHJ5cmVzdWx0U2VsZWN0b3IoYXJncyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlc3RpbmF0aW9uLm5leHQoYXJncyk7XG4gICAgfVxuXG4gICAgaWYgKHNob3VsZENvbXBsZXRlKSB7XG4gICAgICBkZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfdHJ5cmVzdWx0U2VsZWN0b3IoYXJnczogYW55W10pIHtcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucmVzdWx0U2VsZWN0b3IuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChyZXN1bHQpO1xuICB9XG59XG5cbmludGVyZmFjZSBMb29rQWhlYWRJdGVyYXRvcjxUPiBleHRlbmRzIEl0ZXJhdG9yPFQ+IHtcbiAgaGFzVmFsdWUoKTogYm9vbGVhbjtcbiAgaGFzQ29tcGxldGVkKCk6IGJvb2xlYW47XG59XG5cbmNsYXNzIFN0YXRpY0l0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIG5leHRSZXN1bHQ6IEl0ZXJhdG9yUmVzdWx0PFQ+O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KSB7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gaXRlcmF0b3IubmV4dCgpO1xuICB9XG5cbiAgaGFzVmFsdWUoKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBuZXh0KCk6IEl0ZXJhdG9yUmVzdWx0PFQ+IHtcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLm5leHRSZXN1bHQ7XG4gICAgdGhpcy5uZXh0UmVzdWx0ID0gdGhpcy5pdGVyYXRvci5uZXh0KCk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGhhc0NvbXBsZXRlZCgpIHtcbiAgICBjb25zdCBuZXh0UmVzdWx0ID0gdGhpcy5uZXh0UmVzdWx0O1xuICAgIHJldHVybiBuZXh0UmVzdWx0ICYmIG5leHRSZXN1bHQuZG9uZTtcbiAgfVxufVxuXG5jbGFzcyBTdGF0aWNBcnJheUl0ZXJhdG9yPFQ+IGltcGxlbWVudHMgTG9va0FoZWFkSXRlcmF0b3I8VD4ge1xuICBwcml2YXRlIGluZGV4ID0gMDtcbiAgcHJpdmF0ZSBsZW5ndGggPSAwO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYXJyYXk6IFRbXSkge1xuICAgIHRoaXMubGVuZ3RoID0gYXJyYXkubGVuZ3RoO1xuICB9XG5cbiAgW1N5bWJvbF9pdGVyYXRvcl0oKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBuZXh0KHZhbHVlPzogYW55KTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGkgPSB0aGlzLmluZGV4Kys7XG4gICAgY29uc3QgYXJyYXkgPSB0aGlzLmFycmF5O1xuICAgIHJldHVybiBpIDwgdGhpcy5sZW5ndGggPyB7IHZhbHVlOiBhcnJheVtpXSwgZG9uZTogZmFsc2UgfSA6IHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmFycmF5Lmxlbmd0aCA+IHRoaXMuaW5kZXg7XG4gIH1cblxuICBoYXNDb21wbGV0ZWQoKSB7XG4gICAgcmV0dXJuIHRoaXMuYXJyYXkubGVuZ3RoID09PSB0aGlzLmluZGV4O1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBaaXBCdWZmZXJJdGVyYXRvcjxULCBSPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBSPiBpbXBsZW1lbnRzIExvb2tBaGVhZEl0ZXJhdG9yPFQ+IHtcbiAgc3RpbGxVbnN1YnNjcmliZWQgPSB0cnVlO1xuICBidWZmZXI6IFRbXSA9IFtdO1xuICBpc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFBhcnRpYWxPYnNlcnZlcjxUPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwYXJlbnQ6IFppcFN1YnNjcmliZXI8VCwgUj4sXG4gICAgICAgICAgICAgIHByaXZhdGUgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIFtTeW1ib2xfaXRlcmF0b3JdKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gTk9URTogdGhlcmUgaXMgYWN0dWFsbHkgYSBuYW1lIGNvbGxpc2lvbiBoZXJlIHdpdGggU3Vic2NyaWJlci5uZXh0IGFuZCBJdGVyYXRvci5uZXh0XG4gIC8vICAgIHRoaXMgaXMgbGVnaXQgYmVjYXVzZSBgbmV4dCgpYCB3aWxsIG5ldmVyIGJlIGNhbGxlZCBieSBhIHN1YnNjcmlwdGlvbiBpbiB0aGlzIGNhc2UuXG4gIG5leHQoKTogSXRlcmF0b3JSZXN1bHQ8VD4ge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID09PSAwICYmIHRoaXMuaXNDb21wbGV0ZSkge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IG51bGwsIGRvbmU6IHRydWUgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHsgdmFsdWU6IGJ1ZmZlci5zaGlmdCgpLCBkb25lOiBmYWxzZSB9O1xuICAgIH1cbiAgfVxuXG4gIGhhc1ZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPiAwO1xuICB9XG5cbiAgaGFzQ29tcGxldGVkKCkge1xuICAgIHJldHVybiB0aGlzLmJ1ZmZlci5sZW5ndGggPT09IDAgJiYgdGhpcy5pc0NvbXBsZXRlO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKSB7XG4gICAgaWYgKHRoaXMuYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICB0aGlzLnBhcmVudC5ub3RpZnlJbmFjdGl2ZSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBhbnksXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBSPik6IHZvaWQge1xuICAgIHRoaXMuYnVmZmVyLnB1c2goaW5uZXJWYWx1ZSk7XG4gICAgdGhpcy5wYXJlbnQuY2hlY2tJdGVyYXRvcnMoKTtcbiAgfVxuXG4gIHN1YnNjcmliZSh2YWx1ZTogYW55LCBpbmRleDogbnVtYmVyKSB7XG4gICAgcmV0dXJuIHN1YnNjcmliZVRvUmVzdWx0PGFueSwgYW55Pih0aGlzLCB0aGlzLm9ic2VydmFibGUsIHRoaXMsIGluZGV4KTtcbiAgfVxufVxuIl19