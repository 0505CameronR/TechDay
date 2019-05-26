import { switchMap } from './switchMap';
import { identity } from '../util/identity';
/**
 * Converts a higher-order Observable into a first-order Observable
 * producing values only from the most recent observable sequence
 *
 * <span class="informal">Flattens an Observable-of-Observables.</span>
 *
 * ![](switchAll.png)
 *
 * `switchAll` subscribes to a source that is an observable of observables, also known as a
 * "higher-order observable" (or `Observable<Observable<T>>`). It subscribes to the most recently
 * provided "inner observable" emitted by the source, unsubscribing from any previously subscribed
 * to inner observable, such that only the most recent inner observable may be subscribed to at
 * any point in time. The resulting observable returned by `switchAll` will only complete if the
 * source observable completes, *and* any currently subscribed to inner observable also has completed,
 * if there are any.
 *
 * ## Examples
 * Spawn a new interval observable for each click event, but for every new
 * click, cancel the previous interval and subscribe to the new one.
 *
 * ```ts
 * import { fromEvent, interval } from 'rxjs';
 * import { switchAll, map } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click').pipe(tap(() => console.log('click')));
 * const source = clicks.pipe(map((ev) => interval(1000)));
 *
 * source.pipe(
 *   switchAll()
 * ).subscribe(x => console.log(x));
 *
 /* Output
 *  click
 *  1
 *  2
 *  3
 *  4
 *  ...
 *  click
 *  1
 *  2
 *  3
 *  ...
 *  click
 *  ...
 * ```
 *
 * @see {@link combineAll}
 * @see {@link concatAll}
 * @see {@link exhaust}
 * @see {@link switchMap}
 * @see {@link switchMapTo}
 * @see {@link mergeAll}
 */
export function switchAll() {
    return switchMap(identity);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3dpdGNoQWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3N3aXRjaEFsbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQ3hDLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxrQkFBa0IsQ0FBQztBQUs1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxREc7QUFFSCxNQUFNLFVBQVUsU0FBUztJQUN2QixPQUFPLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXR9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IHN3aXRjaE1hcCB9IGZyb20gJy4vc3dpdGNoTWFwJztcbmltcG9ydCB7IGlkZW50aXR5IH0gZnJvbSAnLi4vdXRpbC9pZGVudGl0eSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBzd2l0Y2hBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIHN3aXRjaEFsbDxSPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG5cbi8qKlxuICogQ29udmVydHMgYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSBpbnRvIGEgZmlyc3Qtb3JkZXIgT2JzZXJ2YWJsZVxuICogcHJvZHVjaW5nIHZhbHVlcyBvbmx5IGZyb20gdGhlIG1vc3QgcmVjZW50IG9ic2VydmFibGUgc2VxdWVuY2VcbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmxhdHRlbnMgYW4gT2JzZXJ2YWJsZS1vZi1PYnNlcnZhYmxlcy48L3NwYW4+XG4gKlxuICogIVtdKHN3aXRjaEFsbC5wbmcpXG4gKlxuICogYHN3aXRjaEFsbGAgc3Vic2NyaWJlcyB0byBhIHNvdXJjZSB0aGF0IGlzIGFuIG9ic2VydmFibGUgb2Ygb2JzZXJ2YWJsZXMsIGFsc28ga25vd24gYXMgYVxuICogXCJoaWdoZXItb3JkZXIgb2JzZXJ2YWJsZVwiIChvciBgT2JzZXJ2YWJsZTxPYnNlcnZhYmxlPFQ+PmApLiBJdCBzdWJzY3JpYmVzIHRvIHRoZSBtb3N0IHJlY2VudGx5XG4gKiBwcm92aWRlZCBcImlubmVyIG9ic2VydmFibGVcIiBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UsIHVuc3Vic2NyaWJpbmcgZnJvbSBhbnkgcHJldmlvdXNseSBzdWJzY3JpYmVkXG4gKiB0byBpbm5lciBvYnNlcnZhYmxlLCBzdWNoIHRoYXQgb25seSB0aGUgbW9zdCByZWNlbnQgaW5uZXIgb2JzZXJ2YWJsZSBtYXkgYmUgc3Vic2NyaWJlZCB0byBhdFxuICogYW55IHBvaW50IGluIHRpbWUuIFRoZSByZXN1bHRpbmcgb2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgc3dpdGNoQWxsYCB3aWxsIG9ubHkgY29tcGxldGUgaWYgdGhlXG4gKiBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMsICphbmQqIGFueSBjdXJyZW50bHkgc3Vic2NyaWJlZCB0byBpbm5lciBvYnNlcnZhYmxlIGFsc28gaGFzIGNvbXBsZXRlZCxcbiAqIGlmIHRoZXJlIGFyZSBhbnkuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqIFNwYXduIGEgbmV3IGludGVydmFsIG9ic2VydmFibGUgZm9yIGVhY2ggY2xpY2sgZXZlbnQsIGJ1dCBmb3IgZXZlcnkgbmV3XG4gKiBjbGljaywgY2FuY2VsIHRoZSBwcmV2aW91cyBpbnRlcnZhbCBhbmQgc3Vic2NyaWJlIHRvIHRoZSBuZXcgb25lLlxuICpcbiAqIGBgYHRzXG4gKiBpbXBvcnQgeyBmcm9tRXZlbnQsIGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBzd2l0Y2hBbGwsIG1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpLnBpcGUodGFwKCgpID0+IGNvbnNvbGUubG9nKCdjbGljaycpKSk7XG4gKiBjb25zdCBzb3VyY2UgPSBjbGlja3MucGlwZShtYXAoKGV2KSA9PiBpbnRlcnZhbCgxMDAwKSkpO1xuICpcbiAqIHNvdXJjZS5waXBlKFxuICogICBzd2l0Y2hBbGwoKVxuICogKS5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuIC8qIE91dHB1dFxuICogIGNsaWNrXG4gKiAgMVxuICogIDJcbiAqICAzXG4gKiAgNFxuICogIC4uLlxuICogIGNsaWNrXG4gKiAgMVxuICogIDJcbiAqICAzXG4gKiAgLi4uXG4gKiAgY2xpY2tcbiAqICAuLi5cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXRBbGx9XG4gKiBAc2VlIHtAbGluayBleGhhdXN0fVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwfVxuICogQHNlZSB7QGxpbmsgc3dpdGNoTWFwVG99XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gc3dpdGNoQWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPiB7XG4gIHJldHVybiBzd2l0Y2hNYXAoaWRlbnRpdHkpO1xufSJdfQ==