import { Subject } from '../Subject';
import { multicast } from './multicast';
/* tslint:enable:max-line-length */
/**
 * Returns a ConnectableObservable, which is a variety of Observable that waits until its connect method is called
 * before it begins emitting items to those Observers that have subscribed to it.
 *
 * <span class="informal">Makes a cold Observable hot</span>
 *
 * ![](publish.png)
 *
 * ## Examples
 * Make source$ hot by applying publish operator, then merge each inner observable into a single one
 * and subscribe.
 * ```typescript
 * import { of, zip, interval, merge } from "rxjs";
 * import { map, publish } from "rxjs/operators";
 *
 * const source$ = zip(
 *    interval(2000),
 *       of(1, 2, 3, 4, 5, 6, 7, 8, 9),
 *    ).pipe(
 *       map(values => values[1])
 *    );
 *
 * source$.pipe(
 *    publish(multicasted$ => {
 *       return merge(
 *          multicasted$.pipe(tap(x => console.log('Stream 1:', x))),
 *          multicasted$.pipe(tap(x => console.log('Stream 2:', x))),
 *          multicasted$.pipe(tap(x => console.log('Stream 3:', x))),
 *       );
 *    })).subscribe();
 *
 /* Results every two seconds
 * Stream 1: 1
 * Stream 2: 1
 * Stream 3: 1
 *
 * ...
 *
 * Stream 1: 9
 * Stream 2: 9
 * Stream 3: 9
 * ```
 *
 * @param {Function} [selector] - Optional selector function which can use the multicasted source sequence as many times
 * as needed, without causing multiple subscriptions to the source sequence.
 * Subscribers to the given source will receive all notifications of the source from the time of the subscription on.
 * @return A ConnectableObservable that upon connection causes the source Observable to emit items to its Observers.
 * @method publish
 * @owner Observable
 *
 *
 */
export function publish(selector) {
    return selector ?
        multicast(() => new Subject(), selector) :
        multicast(new Subject());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9wdWJsaXNoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxZQUFZLENBQUM7QUFDckMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQVF4QyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1ERztBQUNILE1BQU0sVUFBVSxPQUFPLENBQU8sUUFBaUM7SUFDN0QsT0FBTyxRQUFRLENBQUMsQ0FBQztRQUNmLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLE9BQU8sRUFBSyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7UUFDN0MsU0FBUyxDQUFDLElBQUksT0FBTyxFQUFLLENBQUMsQ0FBQztBQUNoQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuaW1wb3J0IHsgbXVsdGljYXN0IH0gZnJvbSAnLi9tdWx0aWNhc3QnO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBPcGVyYXRvckZ1bmN0aW9uLCBVbmFyeUZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXQsIE9ic2VydmVkVmFsdWVPZiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaDxUPigpOiBVbmFyeUZ1bmN0aW9uPE9ic2VydmFibGU8VD4sIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPj47XG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaDxULCBPIGV4dGVuZHMgT2JzZXJ2YWJsZUlucHV0PGFueT4+KHNlbGVjdG9yOiAoc2hhcmVkOiBPYnNlcnZhYmxlPFQ+KSA9PiBPKTogT3BlcmF0b3JGdW5jdGlvbjxULCBPYnNlcnZlZFZhbHVlT2Y8Tz4+O1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2g8VD4oc2VsZWN0b3I6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogUmV0dXJucyBhIENvbm5lY3RhYmxlT2JzZXJ2YWJsZSwgd2hpY2ggaXMgYSB2YXJpZXR5IG9mIE9ic2VydmFibGUgdGhhdCB3YWl0cyB1bnRpbCBpdHMgY29ubmVjdCBtZXRob2QgaXMgY2FsbGVkXG4gKiBiZWZvcmUgaXQgYmVnaW5zIGVtaXR0aW5nIGl0ZW1zIHRvIHRob3NlIE9ic2VydmVycyB0aGF0IGhhdmUgc3Vic2NyaWJlZCB0byBpdC5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+TWFrZXMgYSBjb2xkIE9ic2VydmFibGUgaG90PC9zcGFuPlxuICpcbiAqICFbXShwdWJsaXNoLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogTWFrZSBzb3VyY2UkIGhvdCBieSBhcHBseWluZyBwdWJsaXNoIG9wZXJhdG9yLCB0aGVuIG1lcmdlIGVhY2ggaW5uZXIgb2JzZXJ2YWJsZSBpbnRvIGEgc2luZ2xlIG9uZVxuICogYW5kIHN1YnNjcmliZS5cbiAqIGBgYHR5cGVzY3JpcHRcbiAqIGltcG9ydCB7IG9mLCB6aXAsIGludGVydmFsLCBtZXJnZSB9IGZyb20gXCJyeGpzXCI7XG4gKiBpbXBvcnQgeyBtYXAsIHB1Ymxpc2ggfSBmcm9tIFwicnhqcy9vcGVyYXRvcnNcIjtcbiAqXG4gKiBjb25zdCBzb3VyY2UkID0gemlwKFxuICogICAgaW50ZXJ2YWwoMjAwMCksXG4gKiAgICAgICBvZigxLCAyLCAzLCA0LCA1LCA2LCA3LCA4LCA5KSxcbiAqICAgICkucGlwZShcbiAqICAgICAgIG1hcCh2YWx1ZXMgPT4gdmFsdWVzWzFdKVxuICogICAgKTtcbiAqXG4gKiBzb3VyY2UkLnBpcGUoXG4gKiAgICBwdWJsaXNoKG11bHRpY2FzdGVkJCA9PiB7XG4gKiAgICAgICByZXR1cm4gbWVyZ2UoXG4gKiAgICAgICAgICBtdWx0aWNhc3RlZCQucGlwZSh0YXAoeCA9PiBjb25zb2xlLmxvZygnU3RyZWFtIDE6JywgeCkpKSxcbiAqICAgICAgICAgIG11bHRpY2FzdGVkJC5waXBlKHRhcCh4ID0+IGNvbnNvbGUubG9nKCdTdHJlYW0gMjonLCB4KSkpLFxuICogICAgICAgICAgbXVsdGljYXN0ZWQkLnBpcGUodGFwKHggPT4gY29uc29sZS5sb2coJ1N0cmVhbSAzOicsIHgpKSksXG4gKiAgICAgICApO1xuICogICAgfSkpLnN1YnNjcmliZSgpO1xuICpcbiAvKiBSZXN1bHRzIGV2ZXJ5IHR3byBzZWNvbmRzXG4gKiBTdHJlYW0gMTogMVxuICogU3RyZWFtIDI6IDFcbiAqIFN0cmVhbSAzOiAxXG4gKlxuICogLi4uXG4gKlxuICogU3RyZWFtIDE6IDlcbiAqIFN0cmVhbSAyOiA5XG4gKiBTdHJlYW0gMzogOVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gW3NlbGVjdG9yXSAtIE9wdGlvbmFsIHNlbGVjdG9yIGZ1bmN0aW9uIHdoaWNoIGNhbiB1c2UgdGhlIG11bHRpY2FzdGVkIHNvdXJjZSBzZXF1ZW5jZSBhcyBtYW55IHRpbWVzXG4gKiBhcyBuZWVkZWQsIHdpdGhvdXQgY2F1c2luZyBtdWx0aXBsZSBzdWJzY3JpcHRpb25zIHRvIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gKiBTdWJzY3JpYmVycyB0byB0aGUgZ2l2ZW4gc291cmNlIHdpbGwgcmVjZWl2ZSBhbGwgbm90aWZpY2F0aW9ucyBvZiB0aGUgc291cmNlIGZyb20gdGhlIHRpbWUgb2YgdGhlIHN1YnNjcmlwdGlvbiBvbi5cbiAqIEByZXR1cm4gQSBDb25uZWN0YWJsZU9ic2VydmFibGUgdGhhdCB1cG9uIGNvbm5lY3Rpb24gY2F1c2VzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0byBlbWl0IGl0ZW1zIHRvIGl0cyBPYnNlcnZlcnMuXG4gKiBAbWV0aG9kIHB1Ymxpc2hcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKlxuICpcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHB1Ymxpc2g8VCwgUj4oc2VsZWN0b3I/OiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHwgT3BlcmF0b3JGdW5jdGlvbjxULCBSPiB7XG4gIHJldHVybiBzZWxlY3RvciA/XG4gICAgbXVsdGljYXN0KCgpID0+IG5ldyBTdWJqZWN0PFQ+KCksIHNlbGVjdG9yKSA6XG4gICAgbXVsdGljYXN0KG5ldyBTdWJqZWN0PFQ+KCkpO1xufVxuIl19