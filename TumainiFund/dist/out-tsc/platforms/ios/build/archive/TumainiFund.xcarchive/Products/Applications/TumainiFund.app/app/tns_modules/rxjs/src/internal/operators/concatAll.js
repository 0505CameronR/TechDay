"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mergeAll_1 = require("./mergeAll");
/**
 * Converts a higher-order Observable into a first-order Observable by
 * concatenating the inner Observables in order.
 *
 * <span class="informal">Flattens an Observable-of-Observables by putting one
 * inner Observable after the other.</span>
 *
 * ![](concatAll.png)
 *
 * Joins every Observable emitted by the source (a higher-order Observable), in
 * a serial fashion. It subscribes to each inner Observable only after the
 * previous inner Observable has completed, and merges all of their values into
 * the returned observable.
 *
 * __Warning:__ If the source Observable emits Observables quickly and
 * endlessly, and the inner Observables it emits generally complete slower than
 * the source emits, you can run into memory issues as the incoming Observables
 * collect in an unbounded buffer.
 *
 * Note: `concatAll` is equivalent to `mergeAll` with concurrency parameter set
 * to `1`.
 *
 * ## Example
 *
 * For each click event, tick every second from 0 to 3, with no concurrency
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const higherOrder = clicks.pipe(
 *   map(ev => interval(1000).pipe(take(4))),
 * );
 * const firstOrder = higherOrder.pipe(concatAll());
 * firstOrder.subscribe(x => console.log(x));
 *
 * // Results in the following:
 * // (results are not concurrent)
 * // For every click on the "document" it will emit values 0 to 3 spaced
 * // on a 1000ms interval
 * // one click = 1000ms-> 0 -1000ms-> 1 -1000ms-> 2 -1000ms-> 3
 * ```
 *
 * @see {@link combineAll}
 * @see {@link concat}
 * @see {@link concatMap}
 * @see {@link concatMapTo}
 * @see {@link exhaust}
 * @see {@link mergeAll}
 * @see {@link switchAll}
 * @see {@link switchMap}
 * @see {@link zipAll}
 *
 * @return {Observable} An Observable emitting values from all the inner
 * Observables concatenated.
 * @method concatAll
 * @owner Observable
 */
function concatAll() {
    return mergeAll_1.mergeAll(1);
}
exports.concatAll = concatAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uY2F0QWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvY29uY2F0QWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsdUNBQXNDO0FBTXRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FzREc7QUFDSCxTQUFnQixTQUFTO0lBQ3ZCLE9BQU8sbUJBQVEsQ0FBSSxDQUFDLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBRkQsOEJBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IG1lcmdlQWxsIH0gZnJvbSAnLi9tZXJnZUFsbCc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdEFsbDxSPigpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG5cbi8qKlxuICogQ29udmVydHMgYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSBpbnRvIGEgZmlyc3Qtb3JkZXIgT2JzZXJ2YWJsZSBieVxuICogY29uY2F0ZW5hdGluZyB0aGUgaW5uZXIgT2JzZXJ2YWJsZXMgaW4gb3JkZXIuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkZsYXR0ZW5zIGFuIE9ic2VydmFibGUtb2YtT2JzZXJ2YWJsZXMgYnkgcHV0dGluZyBvbmVcbiAqIGlubmVyIE9ic2VydmFibGUgYWZ0ZXIgdGhlIG90aGVyLjwvc3Bhbj5cbiAqXG4gKiAhW10oY29uY2F0QWxsLnBuZylcbiAqXG4gKiBKb2lucyBldmVyeSBPYnNlcnZhYmxlIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSAoYSBoaWdoZXItb3JkZXIgT2JzZXJ2YWJsZSksIGluXG4gKiBhIHNlcmlhbCBmYXNoaW9uLiBJdCBzdWJzY3JpYmVzIHRvIGVhY2ggaW5uZXIgT2JzZXJ2YWJsZSBvbmx5IGFmdGVyIHRoZVxuICogcHJldmlvdXMgaW5uZXIgT2JzZXJ2YWJsZSBoYXMgY29tcGxldGVkLCBhbmQgbWVyZ2VzIGFsbCBvZiB0aGVpciB2YWx1ZXMgaW50b1xuICogdGhlIHJldHVybmVkIG9ic2VydmFibGUuXG4gKlxuICogX19XYXJuaW5nOl9fIElmIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBlbWl0cyBPYnNlcnZhYmxlcyBxdWlja2x5IGFuZFxuICogZW5kbGVzc2x5LCBhbmQgdGhlIGlubmVyIE9ic2VydmFibGVzIGl0IGVtaXRzIGdlbmVyYWxseSBjb21wbGV0ZSBzbG93ZXIgdGhhblxuICogdGhlIHNvdXJjZSBlbWl0cywgeW91IGNhbiBydW4gaW50byBtZW1vcnkgaXNzdWVzIGFzIHRoZSBpbmNvbWluZyBPYnNlcnZhYmxlc1xuICogY29sbGVjdCBpbiBhbiB1bmJvdW5kZWQgYnVmZmVyLlxuICpcbiAqIE5vdGU6IGBjb25jYXRBbGxgIGlzIGVxdWl2YWxlbnQgdG8gYG1lcmdlQWxsYCB3aXRoIGNvbmN1cnJlbmN5IHBhcmFtZXRlciBzZXRcbiAqIHRvIGAxYC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogRm9yIGVhY2ggY2xpY2sgZXZlbnQsIHRpY2sgZXZlcnkgc2Vjb25kIGZyb20gMCB0byAzLCB3aXRoIG5vIGNvbmN1cnJlbmN5XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgaGlnaGVyT3JkZXIgPSBjbGlja3MucGlwZShcbiAqICAgbWFwKGV2ID0+IGludGVydmFsKDEwMDApLnBpcGUodGFrZSg0KSkpLFxuICogKTtcbiAqIGNvbnN0IGZpcnN0T3JkZXIgPSBoaWdoZXJPcmRlci5waXBlKGNvbmNhdEFsbCgpKTtcbiAqIGZpcnN0T3JkZXIuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZzpcbiAqIC8vIChyZXN1bHRzIGFyZSBub3QgY29uY3VycmVudClcbiAqIC8vIEZvciBldmVyeSBjbGljayBvbiB0aGUgXCJkb2N1bWVudFwiIGl0IHdpbGwgZW1pdCB2YWx1ZXMgMCB0byAzIHNwYWNlZFxuICogLy8gb24gYSAxMDAwbXMgaW50ZXJ2YWxcbiAqIC8vIG9uZSBjbGljayA9IDEwMDBtcy0+IDAgLTEwMDBtcy0+IDEgLTEwMDBtcy0+IDIgLTEwMDBtcy0+IDNcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGNvbWJpbmVBbGx9XG4gKiBAc2VlIHtAbGluayBjb25jYXR9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXB9XG4gKiBAc2VlIHtAbGluayBjb25jYXRNYXBUb31cbiAqIEBzZWUge0BsaW5rIGV4aGF1c3R9XG4gKiBAc2VlIHtAbGluayBtZXJnZUFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaEFsbH1cbiAqIEBzZWUge0BsaW5rIHN3aXRjaE1hcH1cbiAqIEBzZWUge0BsaW5rIHppcEFsbH1cbiAqXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIGVtaXR0aW5nIHZhbHVlcyBmcm9tIGFsbCB0aGUgaW5uZXJcbiAqIE9ic2VydmFibGVzIGNvbmNhdGVuYXRlZC5cbiAqIEBtZXRob2QgY29uY2F0QWxsXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gY29uY2F0QWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248T2JzZXJ2YWJsZUlucHV0PFQ+LCBUPiB7XG4gIHJldHVybiBtZXJnZUFsbDxUPigxKTtcbn1cbiJdfQ==