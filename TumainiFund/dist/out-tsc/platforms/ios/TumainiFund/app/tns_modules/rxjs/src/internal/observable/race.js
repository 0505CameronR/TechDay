import { isArray } from '../util/isArray';
import { fromArray } from './fromArray';
import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Returns an Observable that mirrors the first source Observable to emit an item.
 *
 * ## Example
 * ### Subscribes to the observable that was the first to start emitting.
 *
 * ```javascript
 * import { race, interval } from 'rxjs';
 * import { mapTo } from 'rxjs/operators';
 *
 * const obs1 = interval(1000).pipe(mapTo('fast one'));
 * const obs2 = interval(3000).pipe(mapTo('medium one'));
 * const obs3 = interval(5000).pipe(mapTo('slow one'));
 *
 * race(obs3, obs1, obs2)
 * .subscribe(
 *   winner => console.log(winner)
 * );
 *
 * // result:
 * // a series of 'fast one'
 * ```
 *
 * @param {...Observables} ...observables sources used to race for which Observable emits first.
 * @return {Observable} an Observable that mirrors the output of the first Observable to emit an item.
 * @static true
 * @name race
 * @owner Observable
 */
export function race(...observables) {
    // if the only argument is an array, it was most likely called with
    // `race([obs1, obs2, ...])`
    if (observables.length === 1) {
        if (isArray(observables[0])) {
            observables = observables[0];
        }
        else {
            return observables[0];
        }
    }
    return fromArray(observables, undefined).lift(new RaceOperator());
}
export class RaceOperator {
    call(subscriber, source) {
        return source.subscribe(new RaceSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
export class RaceSubscriber extends OuterSubscriber {
    constructor(destination) {
        super(destination);
        this.hasFirst = false;
        this.observables = [];
        this.subscriptions = [];
    }
    _next(observable) {
        this.observables.push(observable);
    }
    _complete() {
        const observables = this.observables;
        const len = observables.length;
        if (len === 0) {
            this.destination.complete();
        }
        else {
            for (let i = 0; i < len && !this.hasFirst; i++) {
                let observable = observables[i];
                let subscription = subscribeToResult(this, observable, observable, i);
                if (this.subscriptions) {
                    this.subscriptions.push(subscription);
                }
                this.add(subscription);
            }
            this.observables = null;
        }
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        if (!this.hasFirst) {
            this.hasFirst = true;
            for (let i = 0; i < this.subscriptions.length; i++) {
                if (i !== outerIndex) {
                    let subscription = this.subscriptions[i];
                    subscription.unsubscribe();
                    this.remove(subscription);
                }
            }
            this.subscriptions = null;
        }
        this.destination.next(innerValue);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvcmFjZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUt4QyxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFjOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFJLEdBQUcsV0FBb0Q7SUFDN0UsbUVBQW1FO0lBQ25FLDRCQUE0QjtJQUM1QixJQUFJLFdBQVcsQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFO1FBQzVCLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQzNCLFdBQVcsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFzQixDQUFDO1NBQ25EO2FBQU07WUFDTCxPQUFPLFdBQVcsQ0FBQyxDQUFDLENBQWtCLENBQUM7U0FDeEM7S0FDRjtJQUVELE9BQU8sU0FBUyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxZQUFZLEVBQUssQ0FBQyxDQUFDO0FBQ3ZFLENBQUM7QUFFRCxNQUFNLE9BQU8sWUFBWTtJQUN2QixJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sY0FBa0IsU0FBUSxlQUFxQjtJQUsxRCxZQUFZLFdBQTBCO1FBQ3BDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUxiLGFBQVEsR0FBWSxLQUFLLENBQUM7UUFDMUIsZ0JBQVcsR0FBc0IsRUFBRSxDQUFDO1FBQ3BDLGtCQUFhLEdBQW1CLEVBQUUsQ0FBQztJQUkzQyxDQUFDO0lBRVMsS0FBSyxDQUFDLFVBQWU7UUFDN0IsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVTLFNBQVM7UUFDakIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQztRQUNyQyxNQUFNLEdBQUcsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBRS9CLElBQUksR0FBRyxLQUFLLENBQUMsRUFBRTtZQUNiLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDN0I7YUFBTTtZQUNMLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUM5QyxJQUFJLFVBQVUsR0FBRyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hDLElBQUksWUFBWSxHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsVUFBaUIsRUFBRSxDQUFDLENBQUMsQ0FBQztnQkFFN0UsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO29CQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsQ0FBQztpQkFDdkM7Z0JBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQzthQUN4QjtZQUNELElBQUksQ0FBQyxXQUFXLEdBQUcsSUFBSSxDQUFDO1NBQ3pCO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxVQUFhLEVBQUUsVUFBYSxFQUM1QixVQUFrQixFQUFFLFVBQWtCLEVBQ3RDLFFBQStCO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO1lBRXJCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDbEQsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO29CQUNwQixJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUV6QyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7b0JBQzNCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7aUJBQzNCO2FBQ0Y7WUFFRCxJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztTQUMzQjtRQUVELElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi9mcm9tQXJyYXknO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IE91dGVyU3Vic2NyaWJlciB9IGZyb20gJy4uL091dGVyU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBJbm5lclN1YnNjcmliZXIgfSBmcm9tICcuLi9Jbm5lclN1YnNjcmliZXInO1xuaW1wb3J0IHsgc3Vic2NyaWJlVG9SZXN1bHQgfSBmcm9tICcuLi91dGlsL3N1YnNjcmliZVRvUmVzdWx0JztcblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxBLCBCPihhOiBPYnNlcnZhYmxlPEE+LCBiOiBPYnNlcnZhYmxlPEI+KTogT2JzZXJ2YWJsZTxBPiB8IE9ic2VydmFibGU8Qj47XG5leHBvcnQgZnVuY3Rpb24gcmFjZTxBLCBCLCBDPihhOiBPYnNlcnZhYmxlPEE+LCBiOiBPYnNlcnZhYmxlPEI+LCBjOiBPYnNlcnZhYmxlPEM+KTogT2JzZXJ2YWJsZTxBPiB8IE9ic2VydmFibGU8Qj4gfCBPYnNlcnZhYmxlPEM+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8QSwgQiwgQywgRD4oYTogT2JzZXJ2YWJsZTxBPiwgYjogT2JzZXJ2YWJsZTxCPiwgYzogT2JzZXJ2YWJsZTxDPiwgZDogT2JzZXJ2YWJsZTxEPik6IE9ic2VydmFibGU8QT4gfCBPYnNlcnZhYmxlPEI+IHwgT2JzZXJ2YWJsZTxDPiB8IE9ic2VydmFibGU8RD47XG5leHBvcnQgZnVuY3Rpb24gcmFjZTxBLCBCLCBDLCBELCBFPihhOiBPYnNlcnZhYmxlPEE+LCBiOiBPYnNlcnZhYmxlPEI+LCBjOiBPYnNlcnZhYmxlPEM+LCBkOiBPYnNlcnZhYmxlPEQ+LCBlOiBPYnNlcnZhYmxlPEU+KTogT2JzZXJ2YWJsZTxBPiB8IE9ic2VydmFibGU8Qj4gfCBPYnNlcnZhYmxlPEM+IHwgT2JzZXJ2YWJsZTxEPiB8IE9ic2VydmFibGU8RT47XG4vLyB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aFxuXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPihvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxUPltdKTogT2JzZXJ2YWJsZTxUPjtcbmV4cG9ydCBmdW5jdGlvbiByYWNlKG9ic2VydmFibGVzOiBPYnNlcnZhYmxlPGFueT5bXSk6IE9ic2VydmFibGU8e30+O1xuZXhwb3J0IGZ1bmN0aW9uIHJhY2U8VD4oLi4ub2JzZXJ2YWJsZXM6IE9ic2VydmFibGU8VD5bXSk6IE9ic2VydmFibGU8VD47XG5leHBvcnQgZnVuY3Rpb24gcmFjZSguLi5vYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10pOiBPYnNlcnZhYmxlPHt9PjtcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBmaXJzdCBzb3VyY2UgT2JzZXJ2YWJsZSB0byBlbWl0IGFuIGl0ZW0uXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFN1YnNjcmliZXMgdG8gdGhlIG9ic2VydmFibGUgdGhhdCB3YXMgdGhlIGZpcnN0IHRvIHN0YXJ0IGVtaXR0aW5nLlxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IHJhY2UsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBtYXBUbyB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnMxID0gaW50ZXJ2YWwoMTAwMCkucGlwZShtYXBUbygnZmFzdCBvbmUnKSk7XG4gKiBjb25zdCBvYnMyID0gaW50ZXJ2YWwoMzAwMCkucGlwZShtYXBUbygnbWVkaXVtIG9uZScpKTtcbiAqIGNvbnN0IG9iczMgPSBpbnRlcnZhbCg1MDAwKS5waXBlKG1hcFRvKCdzbG93IG9uZScpKTtcbiAqXG4gKiByYWNlKG9iczMsIG9iczEsIG9iczIpXG4gKiAuc3Vic2NyaWJlKFxuICogICB3aW5uZXIgPT4gY29uc29sZS5sb2cod2lubmVyKVxuICogKTtcbiAqXG4gKiAvLyByZXN1bHQ6XG4gKiAvLyBhIHNlcmllcyBvZiAnZmFzdCBvbmUnXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gey4uLk9ic2VydmFibGVzfSAuLi5vYnNlcnZhYmxlcyBzb3VyY2VzIHVzZWQgdG8gcmFjZSBmb3Igd2hpY2ggT2JzZXJ2YWJsZSBlbWl0cyBmaXJzdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBvdXRwdXQgb2YgdGhlIGZpcnN0IE9ic2VydmFibGUgdG8gZW1pdCBhbiBpdGVtLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSByYWNlXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmFjZTxUPiguLi5vYnNlcnZhYmxlczogKE9ic2VydmFibGU8YW55PltdIHwgT2JzZXJ2YWJsZTxhbnk+KVtdKTogT2JzZXJ2YWJsZTxUPiB7XG4gIC8vIGlmIHRoZSBvbmx5IGFyZ3VtZW50IGlzIGFuIGFycmF5LCBpdCB3YXMgbW9zdCBsaWtlbHkgY2FsbGVkIHdpdGhcbiAgLy8gYHJhY2UoW29iczEsIG9iczIsIC4uLl0pYFxuICBpZiAob2JzZXJ2YWJsZXMubGVuZ3RoID09PSAxKSB7XG4gICAgaWYgKGlzQXJyYXkob2JzZXJ2YWJsZXNbMF0pKSB7XG4gICAgICBvYnNlcnZhYmxlcyA9IG9ic2VydmFibGVzWzBdIGFzIE9ic2VydmFibGU8YW55PltdO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gb2JzZXJ2YWJsZXNbMF0gYXMgT2JzZXJ2YWJsZTxUPjtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnJvbUFycmF5KG9ic2VydmFibGVzLCB1bmRlZmluZWQpLmxpZnQobmV3IFJhY2VPcGVyYXRvcjxUPigpKTtcbn1cblxuZXhwb3J0IGNsYXNzIFJhY2VPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFQ+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBSYWNlU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBSYWNlU3Vic2NyaWJlcjxUPiBleHRlbmRzIE91dGVyU3Vic2NyaWJlcjxULCBUPiB7XG4gIHByaXZhdGUgaGFzRmlyc3Q6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBvYnNlcnZhYmxlczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXTtcbiAgcHJpdmF0ZSBzdWJzY3JpcHRpb25zOiBTdWJzY3JpcHRpb25bXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KG9ic2VydmFibGU6IGFueSk6IHZvaWQge1xuICAgIHRoaXMub2JzZXJ2YWJsZXMucHVzaChvYnNlcnZhYmxlKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKSB7XG4gICAgY29uc3Qgb2JzZXJ2YWJsZXMgPSB0aGlzLm9ic2VydmFibGVzO1xuICAgIGNvbnN0IGxlbiA9IG9ic2VydmFibGVzLmxlbmd0aDtcblxuICAgIGlmIChsZW4gPT09IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW4gJiYgIXRoaXMuaGFzRmlyc3Q7IGkrKykge1xuICAgICAgICBsZXQgb2JzZXJ2YWJsZSA9IG9ic2VydmFibGVzW2ldO1xuICAgICAgICBsZXQgc3Vic2NyaXB0aW9uID0gc3Vic2NyaWJlVG9SZXN1bHQodGhpcywgb2JzZXJ2YWJsZSwgb2JzZXJ2YWJsZSBhcyBhbnksIGkpO1xuXG4gICAgICAgIGlmICh0aGlzLnN1YnNjcmlwdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbnMucHVzaChzdWJzY3JpcHRpb24pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuYWRkKHN1YnNjcmlwdGlvbik7XG4gICAgICB9XG4gICAgICB0aGlzLm9ic2VydmFibGVzID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBub3RpZnlOZXh0KG91dGVyVmFsdWU6IFQsIGlubmVyVmFsdWU6IFQsXG4gICAgICAgICAgICAgb3V0ZXJJbmRleDogbnVtYmVyLCBpbm5lckluZGV4OiBudW1iZXIsXG4gICAgICAgICAgICAgaW5uZXJTdWI6IElubmVyU3Vic2NyaWJlcjxULCBUPik6IHZvaWQge1xuICAgIGlmICghdGhpcy5oYXNGaXJzdCkge1xuICAgICAgdGhpcy5oYXNGaXJzdCA9IHRydWU7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5zdWJzY3JpcHRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChpICE9PSBvdXRlckluZGV4KSB7XG4gICAgICAgICAgbGV0IHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaXB0aW9uc1tpXTtcblxuICAgICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgICAgIHRoaXMucmVtb3ZlKHN1YnNjcmlwdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoaW5uZXJWYWx1ZSk7XG4gIH1cbn1cbiJdfQ==