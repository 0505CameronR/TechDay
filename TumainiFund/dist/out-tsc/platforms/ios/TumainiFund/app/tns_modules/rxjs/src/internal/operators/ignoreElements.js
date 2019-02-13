import { Subscriber } from '../Subscriber';
/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * ![](ignoreElements.png)
 *
 * ## Examples
 * ### Ignores emitted values, reacts to observable's completion.
 * ```javascript
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvaWdub3JlRWxlbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFDSCxNQUFNLFVBQVUsY0FBYztJQUM1QixPQUFPLFNBQVMsOEJBQThCLENBQUMsTUFBdUI7UUFDcEUsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksc0JBQXNCLEVBQUUsQ0FBQyxDQUFDO0lBQ25ELENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLHNCQUFzQjtJQUMxQixJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLHdCQUF3QixDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7SUFDcEUsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0sd0JBQTRCLFNBQVEsVUFBYTtJQUMzQyxLQUFLLENBQUMsTUFBUztRQUN2QixhQUFhO0lBQ2YsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIElnbm9yZXMgYWxsIGl0ZW1zIGVtaXR0ZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBvbmx5IHBhc3NlcyBjYWxscyBvZiBgY29tcGxldGVgIG9yIGBlcnJvcmAuXG4gKlxuICogIVtdKGlnbm9yZUVsZW1lbnRzLnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIElnbm9yZXMgZW1pdHRlZCB2YWx1ZXMsIHJlYWN0cyB0byBvYnNlcnZhYmxlJ3MgY29tcGxldGlvbi5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIG9mKCd5b3UnLCAndGFsa2luZycsICd0bycsICdtZScpLnBpcGUoXG4gKiAgIGlnbm9yZUVsZW1lbnRzKCksXG4gKiApXG4gKiAuc3Vic2NyaWJlKFxuICogICB3b3JkID0+IGNvbnNvbGUubG9nKHdvcmQpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coJ2Vycm9yOicsIGVyciksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd0aGUgZW5kJyksXG4gKiApO1xuICogLy8gcmVzdWx0OlxuICogLy8gJ3RoZSBlbmQnXG4gKiBgYGBcbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIGVtcHR5IE9ic2VydmFibGUgdGhhdCBvbmx5IGNhbGxzIGBjb21wbGV0ZWBcbiAqIG9yIGBlcnJvcmAsIGJhc2VkIG9uIHdoaWNoIG9uZSBpcyBjYWxsZWQgYnkgdGhlIHNvdXJjZSBPYnNlcnZhYmxlLlxuICogQG1ldGhvZCBpZ25vcmVFbGVtZW50c1xuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZUVsZW1lbnRzKCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBuZXZlcj4ge1xuICByZXR1cm4gZnVuY3Rpb24gaWdub3JlRWxlbWVudHNPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxhbnk+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBJZ25vcmVFbGVtZW50c09wZXJhdG9yKCkpO1xuICB9O1xufVxuXG5jbGFzcyBJZ25vcmVFbGVtZW50c09wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8Uj4sIHNvdXJjZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgSWdub3JlRWxlbWVudHNTdWJzY3JpYmVyKHN1YnNjcmliZXIpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgSWdub3JlRWxlbWVudHNTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByb3RlY3RlZCBfbmV4dCh1bnVzZWQ6IFQpOiB2b2lkIHtcbiAgICAvLyBEbyBub3RoaW5nXG4gIH1cbn1cbiJdfQ==