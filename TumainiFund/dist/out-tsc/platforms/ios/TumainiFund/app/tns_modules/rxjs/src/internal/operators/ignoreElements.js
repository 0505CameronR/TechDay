import { Subscriber } from '../Subscriber';
/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * ![](ignoreElements.png)
 *
 * ## Examples
 * ### Ignores emitted values, reacts to observable's completion.
 * ```javascript
 * import { of } from 'rxjs';
 * import { ifnoreElements } from 'rxjs/operators';
 *
 * of('you', 'talking', 'to', 'me').pipe(
 *   ignoreElements(),
 * )
 * .subscribe(
 *   word => console.log(word),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'the end'
 * ```
 * @return {Observable} An empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
export function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
class IgnoreElementsOperator {
    call(subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class IgnoreElementsSubscriber extends Subscriber {
    _next(unused) {
        // Do nothing
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvaWdub3JlRWxlbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDSCxNQUFNLFVBQVUsY0FBYztJQUM1QixPQUFPLFNBQVMsOEJBQThCLENBQUMsTUFBdUI7UUFDcEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLHNCQUFzQjtJQUMxQixJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sd0JBQTRCLFNBQVEsVUFBYTtJQUMzQyxLQUFLLENBQUMsTUFBUztRQUN2QixhQUFhO0lBQ2YsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIElnbm9yZXMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBvbmx5IHBhc3NlcyBjYWxscyBvZiBgY29tcGxldGVgIG9yIGBlcnJvcmAuXG4gKlxuICogIVtdKGlnbm9yZUVsZW1lbnRzLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIElnbm9yZXMgZW1pdHRlZCB2YWx1ZXMsIHJlYWN0cyB0byBvYnNlcnZhYmxlJ3MgY29tcGxldGlvbi5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IG9mIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBpZm5vcmVFbGVtZW50cyB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBvZigneW91JywgJ3RhbGtpbmcnLCAndG8nLCAnbWUnKS5waXBlKFxuICogICBpZ25vcmVFbGVtZW50cygpLFxuICogKVxuICogLnN1YnNjcmliZShcbiAqICAgd29yZCA9PiBjb25zb2xlLmxvZyh3b3JkKSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKCdlcnJvcjonLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCcpLFxuICogKTtcbiAqIC8vIHJlc3VsdDpcbiAqIC8vICd0aGUgZW5kJ1xuICogYGBgXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBlbXB0eSBPYnNlcnZhYmxlIHRoYXQgb25seSBjYWxscyBgY29tcGxldGVgXG4gKiBvciBgZXJyb3JgLCBiYXNlZCBvbiB3aGljaCBvbmUgaXMgY2FsbGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEBtZXRob2QgaWdub3JlRWxlbWVudHNcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpZ25vcmVFbGVtZW50cygpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgbmV2ZXI+IHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGlnbm9yZUVsZW1lbnRzT3BlcmF0b3JGdW5jdGlvbihzb3VyY2U6IE9ic2VydmFibGU8YW55Pikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgSWdub3JlRWxlbWVudHNPcGVyYXRvcigpKTtcbiAgfTtcbn1cblxuY2xhc3MgSWdub3JlRWxlbWVudHNPcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFI+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IElnbm9yZUVsZW1lbnRzU3Vic2NyaWJlcihzdWJzY3JpYmVyKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIElnbm9yZUVsZW1lbnRzU3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcm90ZWN0ZWQgX25leHQodW51c2VkOiBUKTogdm9pZCB7XG4gICAgLy8gRG8gbm90aGluZ1xuICB9XG59XG4iXX0=