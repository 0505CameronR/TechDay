import { Observable } from '../Observable';
import { isArray } from '../util/isArray';
import { isFunction } from '../util/isFunction';
import { map } from '../operators/map';
/* tslint:enable:max-line-length */
/**
 * Creates an Observable from an arbitrary API for registering event handlers.
 *
 * <span class="informal">When that method for adding event handler was something {@link fromEvent}
 * was not prepared for.</span>
 *
 * ![](fromEventPattern.png)
 *
 * `fromEventPattern` allows you to convert into an Observable any API that supports registering handler functions
 * for events. It is similar to {@link fromEvent}, but far
 * more flexible. In fact, all use cases of {@link fromEvent} could be easily handled by
 * `fromEventPattern` (although in slightly more verbose way).
 *
 * This operator accepts as a first argument an `addHandler` function, which will be injected with
 * handler parameter. That handler is actually an event handler function that you now can pass
 * to API expecting it. `addHandler` will be called whenever Observable
 * returned by the operator is subscribed, so registering handler in API will not
 * necessarily happen when `fromEventPattern` is called.
 *
 * After registration, every time an event that we listen to happens,
 * Observable returned by `fromEventPattern` will emit value that event handler
 * function was called with. Note that if event handler was called with more
 * then one argument, second and following arguments will not appear in the Observable.
 *
 * If API you are using allows to unregister event handlers as well, you can pass to `fromEventPattern`
 * another function - `removeHandler` - as a second parameter. It will be injected
 * with the same handler function as before, which now you can use to unregister
 * it from the API. `removeHandler` will be called when consumer of resulting Observable
 * unsubscribes from it.
 *
 * In some APIs unregistering is actually handled differently. Method registering an event handler
 * returns some kind of token, which is later used to identify which function should
 * be unregistered or it itself has method that unregisters event handler.
 * If that is the case with your API, make sure token returned
 * by registering method is returned by `addHandler`. Then it will be passed
 * as a second argument to `removeHandler`, where you will be able to use it.
 *
 * If you need access to all event handler parameters (not only the first one),
 * or you need to transform them in any way, you can call `fromEventPattern` with optional
 * third parameter - project function which will accept all arguments passed to
 * event handler when it is called. Whatever is returned from project function will appear on
 * resulting stream instead of usual event handlers first argument. This means
 * that default project can be thought of as function that takes its first parameter
 * and ignores the rest.
 *
 * ## Example
 * ### Emits clicks happening on the DOM document
 *
 * ```javascript
 * import { fromEventPattern } from 'rxjs';
 *
 * function addClickHandler(handler) {
 *   document.addEventListener('click', handler);
 * }
 *
 * function removeClickHandler(handler) {
 *   document.removeEventListener('click', handler);
 * }
 *
 * const clicks = fromEventPattern(
 *   addClickHandler,
 *   removeClickHandler
 * );
 * clicks.subscribe(x => console.log(x));
 *
 * // Whenever you click anywhere in the browser, DOM MouseEvent
 * // object will be logged.
 * ```
 *
 * ## Example
 * ### Use with API that returns cancellation token
 *
 * ```javascript
 * import { fromEventPattern } from 'rxjs';
 *
 * const token = someAPI.registerEventHandler(function() {});
 * someAPI.unregisterEventHandler(token); // this APIs cancellation method accepts
 *                                        // not handler itself, but special token.
 *
 * const someAPIObservable = fromEventPattern(
 *   function(handler) { return someAPI.registerEventHandler(handler); }, // Note that we return the token here...
 *   function(handler, token) { someAPI.unregisterEventHandler(token); }  // ...to then use it here.
 * );
 * ```
 *
 * ## Example
 * ### Use with project function
 *
 * ```javascript
 * import { fromEventPattern } from 'rxjs';
 *
 * someAPI.registerEventHandler((eventType, eventMessage) => {
 *   console.log(eventType, eventMessage); // Logs "EVENT_TYPE" "EVENT_MESSAGE" to console.
 * });
 *
 * const someAPIObservable = fromEventPattern(
 *   handler => someAPI.registerEventHandler(handler),
 *   handler => someAPI.unregisterEventHandler(handler)
 *   (eventType, eventMessage) => eventType + " --- " + eventMessage // without that function only "EVENT_TYPE"
 * );                                                                // would be emitted by the Observable
 *
 * someAPIObservable.subscribe(value => console.log(value));
 *
 * // Logs:
 * // "EVENT_TYPE --- EVENT_MESSAGE"
 * ```
 *
 * @see {@link fromEvent}
 * @see {@link bindCallback}
 * @see {@link bindNodeCallback}
 *
 * @param {function(handler: Function): any} addHandler A function that takes
 * a `handler` function as argument and attaches it somehow to the actual
 * source of events.
 * @param {function(handler: Function, token?: any): void} [removeHandler] A function that
 * takes a `handler` function as an argument and removes it from the event source. If `addHandler`
 * returns some kind of token, `removeHandler` function will have it as a second parameter.
 * @param {function(...args: any): T} [project] A function to
 * transform results. It takes the arguments from the event handler and
 * should return a single value.
 * @return {Observable<T>} Observable which, when an event happens, emits first parameter
 * passed to registered event handler. Alternatively it emits whatever project function returns
 * at that moment.
 * @static true
 * @name fromEventPattern
 * @owner Observable
 */
export function fromEventPattern(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
        // DEPRECATED PATH
        return fromEventPattern(addHandler, removeHandler).pipe(map(args => isArray(args) ? resultSelector(...args) : resultSelector(args)));
    }
    return new Observable(subscriber => {
        const handler = (...e) => subscriber.next(e.length === 1 ? e[0] : e);
        let retValue;
        try {
            retValue = addHandler(handler);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!isFunction(removeHandler)) {
            return undefined;
        }
        return () => removeHandler(handler, retValue);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbUV2ZW50UGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbUV2ZW50UGF0dGVybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMxQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFaEQsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBTXZDLG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOEhHO0FBRUgsTUFBTSxVQUFVLGdCQUFnQixDQUFJLFVBQThDLEVBQzlDLGFBQWlFLEVBQ2pFLGNBQXNDO0lBRXhFLElBQUksY0FBYyxFQUFFO1FBQ2xCLGtCQUFrQjtRQUNsQixPQUFPLGdCQUFnQixDQUFJLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQ3hELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUM1RSxDQUFDO0tBQ0g7SUFFRCxPQUFPLElBQUksVUFBVSxDQUFVLFVBQVUsQ0FBQyxFQUFFO1FBQzFDLE1BQU0sT0FBTyxHQUFHLENBQUMsR0FBRyxDQUFNLEVBQUUsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFMUUsSUFBSSxRQUFhLENBQUM7UUFDbEIsSUFBSTtZQUNGLFFBQVEsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7U0FDaEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxFQUFFO1lBQzlCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsT0FBTyxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFFO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNGdW5jdGlvbiB9IGZyb20gJy4uL3V0aWwvaXNGdW5jdGlvbic7XG5pbXBvcnQgeyBOb2RlRXZlbnRIYW5kbGVyIH0gZnJvbSAnLi9mcm9tRXZlbnQnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IGFueSwgcmVtb3ZlSGFuZGxlcj86IChoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyLCBzaWduYWw/OiBhbnkpID0+IHZvaWQpOiBPYnNlcnZhYmxlPFQ+O1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIG5vIGxvbmdlciBzdXBwb3J0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBOb2RlRXZlbnRIYW5kbGVyKSA9PiBhbnksIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlciwgc2lnbmFsPzogYW55KSA9PiB2b2lkLCByZXN1bHRTZWxlY3Rvcj86ICguLi5hcmdzOiBhbnlbXSkgPT4gVCk6IE9ic2VydmFibGU8VD47XG4vKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSBmcm9tIGFuIGFyYml0cmFyeSBBUEkgZm9yIHJlZ2lzdGVyaW5nIGV2ZW50IGhhbmRsZXJzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5XaGVuIHRoYXQgbWV0aG9kIGZvciBhZGRpbmcgZXZlbnQgaGFuZGxlciB3YXMgc29tZXRoaW5nIHtAbGluayBmcm9tRXZlbnR9XG4gKiB3YXMgbm90IHByZXBhcmVkIGZvci48L3NwYW4+XG4gKlxuICogIVtdKGZyb21FdmVudFBhdHRlcm4ucG5nKVxuICpcbiAqIGBmcm9tRXZlbnRQYXR0ZXJuYCBhbGxvd3MgeW91IHRvIGNvbnZlcnQgaW50byBhbiBPYnNlcnZhYmxlIGFueSBBUEkgdGhhdCBzdXBwb3J0cyByZWdpc3RlcmluZyBoYW5kbGVyIGZ1bmN0aW9uc1xuICogZm9yIGV2ZW50cy4gSXQgaXMgc2ltaWxhciB0byB7QGxpbmsgZnJvbUV2ZW50fSwgYnV0IGZhclxuICogbW9yZSBmbGV4aWJsZS4gSW4gZmFjdCwgYWxsIHVzZSBjYXNlcyBvZiB7QGxpbmsgZnJvbUV2ZW50fSBjb3VsZCBiZSBlYXNpbHkgaGFuZGxlZCBieVxuICogYGZyb21FdmVudFBhdHRlcm5gIChhbHRob3VnaCBpbiBzbGlnaHRseSBtb3JlIHZlcmJvc2Ugd2F5KS5cbiAqXG4gKiBUaGlzIG9wZXJhdG9yIGFjY2VwdHMgYXMgYSBmaXJzdCBhcmd1bWVudCBhbiBgYWRkSGFuZGxlcmAgZnVuY3Rpb24sIHdoaWNoIHdpbGwgYmUgaW5qZWN0ZWQgd2l0aFxuICogaGFuZGxlciBwYXJhbWV0ZXIuIFRoYXQgaGFuZGxlciBpcyBhY3R1YWxseSBhbiBldmVudCBoYW5kbGVyIGZ1bmN0aW9uIHRoYXQgeW91IG5vdyBjYW4gcGFzc1xuICogdG8gQVBJIGV4cGVjdGluZyBpdC4gYGFkZEhhbmRsZXJgIHdpbGwgYmUgY2FsbGVkIHdoZW5ldmVyIE9ic2VydmFibGVcbiAqIHJldHVybmVkIGJ5IHRoZSBvcGVyYXRvciBpcyBzdWJzY3JpYmVkLCBzbyByZWdpc3RlcmluZyBoYW5kbGVyIGluIEFQSSB3aWxsIG5vdFxuICogbmVjZXNzYXJpbHkgaGFwcGVuIHdoZW4gYGZyb21FdmVudFBhdHRlcm5gIGlzIGNhbGxlZC5cbiAqXG4gKiBBZnRlciByZWdpc3RyYXRpb24sIGV2ZXJ5IHRpbWUgYW4gZXZlbnQgdGhhdCB3ZSBsaXN0ZW4gdG8gaGFwcGVucyxcbiAqIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgYGZyb21FdmVudFBhdHRlcm5gIHdpbGwgZW1pdCB2YWx1ZSB0aGF0IGV2ZW50IGhhbmRsZXJcbiAqIGZ1bmN0aW9uIHdhcyBjYWxsZWQgd2l0aC4gTm90ZSB0aGF0IGlmIGV2ZW50IGhhbmRsZXIgd2FzIGNhbGxlZCB3aXRoIG1vcmVcbiAqIHRoZW4gb25lIGFyZ3VtZW50LCBzZWNvbmQgYW5kIGZvbGxvd2luZyBhcmd1bWVudHMgd2lsbCBub3QgYXBwZWFyIGluIHRoZSBPYnNlcnZhYmxlLlxuICpcbiAqIElmIEFQSSB5b3UgYXJlIHVzaW5nIGFsbG93cyB0byB1bnJlZ2lzdGVyIGV2ZW50IGhhbmRsZXJzIGFzIHdlbGwsIHlvdSBjYW4gcGFzcyB0byBgZnJvbUV2ZW50UGF0dGVybmBcbiAqIGFub3RoZXIgZnVuY3Rpb24gLSBgcmVtb3ZlSGFuZGxlcmAgLSBhcyBhIHNlY29uZCBwYXJhbWV0ZXIuIEl0IHdpbGwgYmUgaW5qZWN0ZWRcbiAqIHdpdGggdGhlIHNhbWUgaGFuZGxlciBmdW5jdGlvbiBhcyBiZWZvcmUsIHdoaWNoIG5vdyB5b3UgY2FuIHVzZSB0byB1bnJlZ2lzdGVyXG4gKiBpdCBmcm9tIHRoZSBBUEkuIGByZW1vdmVIYW5kbGVyYCB3aWxsIGJlIGNhbGxlZCB3aGVuIGNvbnN1bWVyIG9mIHJlc3VsdGluZyBPYnNlcnZhYmxlXG4gKiB1bnN1YnNjcmliZXMgZnJvbSBpdC5cbiAqXG4gKiBJbiBzb21lIEFQSXMgdW5yZWdpc3RlcmluZyBpcyBhY3R1YWxseSBoYW5kbGVkIGRpZmZlcmVudGx5LiBNZXRob2QgcmVnaXN0ZXJpbmcgYW4gZXZlbnQgaGFuZGxlclxuICogcmV0dXJucyBzb21lIGtpbmQgb2YgdG9rZW4sIHdoaWNoIGlzIGxhdGVyIHVzZWQgdG8gaWRlbnRpZnkgd2hpY2ggZnVuY3Rpb24gc2hvdWxkXG4gKiBiZSB1bnJlZ2lzdGVyZWQgb3IgaXQgaXRzZWxmIGhhcyBtZXRob2QgdGhhdCB1bnJlZ2lzdGVycyBldmVudCBoYW5kbGVyLlxuICogSWYgdGhhdCBpcyB0aGUgY2FzZSB3aXRoIHlvdXIgQVBJLCBtYWtlIHN1cmUgdG9rZW4gcmV0dXJuZWRcbiAqIGJ5IHJlZ2lzdGVyaW5nIG1ldGhvZCBpcyByZXR1cm5lZCBieSBgYWRkSGFuZGxlcmAuIFRoZW4gaXQgd2lsbCBiZSBwYXNzZWRcbiAqIGFzIGEgc2Vjb25kIGFyZ3VtZW50IHRvIGByZW1vdmVIYW5kbGVyYCwgd2hlcmUgeW91IHdpbGwgYmUgYWJsZSB0byB1c2UgaXQuXG4gKlxuICogSWYgeW91IG5lZWQgYWNjZXNzIHRvIGFsbCBldmVudCBoYW5kbGVyIHBhcmFtZXRlcnMgKG5vdCBvbmx5IHRoZSBmaXJzdCBvbmUpLFxuICogb3IgeW91IG5lZWQgdG8gdHJhbnNmb3JtIHRoZW0gaW4gYW55IHdheSwgeW91IGNhbiBjYWxsIGBmcm9tRXZlbnRQYXR0ZXJuYCB3aXRoIG9wdGlvbmFsXG4gKiB0aGlyZCBwYXJhbWV0ZXIgLSBwcm9qZWN0IGZ1bmN0aW9uIHdoaWNoIHdpbGwgYWNjZXB0IGFsbCBhcmd1bWVudHMgcGFzc2VkIHRvXG4gKiBldmVudCBoYW5kbGVyIHdoZW4gaXQgaXMgY2FsbGVkLiBXaGF0ZXZlciBpcyByZXR1cm5lZCBmcm9tIHByb2plY3QgZnVuY3Rpb24gd2lsbCBhcHBlYXIgb25cbiAqIHJlc3VsdGluZyBzdHJlYW0gaW5zdGVhZCBvZiB1c3VhbCBldmVudCBoYW5kbGVycyBmaXJzdCBhcmd1bWVudC4gVGhpcyBtZWFuc1xuICogdGhhdCBkZWZhdWx0IHByb2plY3QgY2FuIGJlIHRob3VnaHQgb2YgYXMgZnVuY3Rpb24gdGhhdCB0YWtlcyBpdHMgZmlyc3QgcGFyYW1ldGVyXG4gKiBhbmQgaWdub3JlcyB0aGUgcmVzdC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgRW1pdHMgY2xpY2tzIGhhcHBlbmluZyBvbiB0aGUgRE9NIGRvY3VtZW50XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50UGF0dGVybiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGZ1bmN0aW9uIGFkZENsaWNrSGFuZGxlcihoYW5kbGVyKSB7XG4gKiAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gcmVtb3ZlQ2xpY2tIYW5kbGVyKGhhbmRsZXIpIHtcbiAqICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAqIH1cbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBhZGRDbGlja0hhbmRsZXIsXG4gKiAgIHJlbW92ZUNsaWNrSGFuZGxlclxuICogKTtcbiAqIGNsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gV2hlbmV2ZXIgeW91IGNsaWNrIGFueXdoZXJlIGluIHRoZSBicm93c2VyLCBET00gTW91c2VFdmVudFxuICogLy8gb2JqZWN0IHdpbGwgYmUgbG9nZ2VkLlxuICogYGBgXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFVzZSB3aXRoIEFQSSB0aGF0IHJldHVybnMgY2FuY2VsbGF0aW9uIHRva2VuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50UGF0dGVybiB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IHRva2VuID0gc29tZUFQSS5yZWdpc3RlckV2ZW50SGFuZGxlcihmdW5jdGlvbigpIHt9KTtcbiAqIHNvbWVBUEkudW5yZWdpc3RlckV2ZW50SGFuZGxlcih0b2tlbik7IC8vIHRoaXMgQVBJcyBjYW5jZWxsYXRpb24gbWV0aG9kIGFjY2VwdHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG5vdCBoYW5kbGVyIGl0c2VsZiwgYnV0IHNwZWNpYWwgdG9rZW4uXG4gKlxuICogY29uc3Qgc29tZUFQSU9ic2VydmFibGUgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBmdW5jdGlvbihoYW5kbGVyKSB7IHJldHVybiBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGhhbmRsZXIpOyB9LCAvLyBOb3RlIHRoYXQgd2UgcmV0dXJuIHRoZSB0b2tlbiBoZXJlLi4uXG4gKiAgIGZ1bmN0aW9uKGhhbmRsZXIsIHRva2VuKSB7IHNvbWVBUEkudW5yZWdpc3RlckV2ZW50SGFuZGxlcih0b2tlbik7IH0gIC8vIC4uLnRvIHRoZW4gdXNlIGl0IGhlcmUuXG4gKiApO1xuICogYGBgXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFVzZSB3aXRoIHByb2plY3QgZnVuY3Rpb25cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBmcm9tRXZlbnRQYXR0ZXJuIH0gZnJvbSAncnhqcyc7XG4gKlxuICogc29tZUFQSS5yZWdpc3RlckV2ZW50SGFuZGxlcigoZXZlbnRUeXBlLCBldmVudE1lc3NhZ2UpID0+IHtcbiAqICAgY29uc29sZS5sb2coZXZlbnRUeXBlLCBldmVudE1lc3NhZ2UpOyAvLyBMb2dzIFwiRVZFTlRfVFlQRVwiIFwiRVZFTlRfTUVTU0FHRVwiIHRvIGNvbnNvbGUuXG4gKiB9KTtcbiAqXG4gKiBjb25zdCBzb21lQVBJT2JzZXJ2YWJsZSA9IGZyb21FdmVudFBhdHRlcm4oXG4gKiAgIGhhbmRsZXIgPT4gc29tZUFQSS5yZWdpc3RlckV2ZW50SGFuZGxlcihoYW5kbGVyKSxcbiAqICAgaGFuZGxlciA9PiBzb21lQVBJLnVucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlcilcbiAqICAgKGV2ZW50VHlwZSwgZXZlbnRNZXNzYWdlKSA9PiBldmVudFR5cGUgKyBcIiAtLS0gXCIgKyBldmVudE1lc3NhZ2UgLy8gd2l0aG91dCB0aGF0IGZ1bmN0aW9uIG9ubHkgXCJFVkVOVF9UWVBFXCJcbiAqICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdvdWxkIGJlIGVtaXR0ZWQgYnkgdGhlIE9ic2VydmFibGVcbiAqXG4gKiBzb21lQVBJT2JzZXJ2YWJsZS5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJFVkVOVF9UWVBFIC0tLSBFVkVOVF9NRVNTQUdFXCJcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZyb21FdmVudH1cbiAqIEBzZWUge0BsaW5rIGJpbmRDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbik6IGFueX0gYWRkSGFuZGxlciBBIGZ1bmN0aW9uIHRoYXQgdGFrZXNcbiAqIGEgYGhhbmRsZXJgIGZ1bmN0aW9uIGFzIGFyZ3VtZW50IGFuZCBhdHRhY2hlcyBpdCBzb21laG93IHRvIHRoZSBhY3R1YWxcbiAqIHNvdXJjZSBvZiBldmVudHMuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGhhbmRsZXI6IEZ1bmN0aW9uLCB0b2tlbj86IGFueSk6IHZvaWR9IFtyZW1vdmVIYW5kbGVyXSBBIGZ1bmN0aW9uIHRoYXRcbiAqIHRha2VzIGEgYGhhbmRsZXJgIGZ1bmN0aW9uIGFzIGFuIGFyZ3VtZW50IGFuZCByZW1vdmVzIGl0IGZyb20gdGhlIGV2ZW50IHNvdXJjZS4gSWYgYGFkZEhhbmRsZXJgXG4gKiByZXR1cm5zIHNvbWUga2luZCBvZiB0b2tlbiwgYHJlbW92ZUhhbmRsZXJgIGZ1bmN0aW9uIHdpbGwgaGF2ZSBpdCBhcyBhIHNlY29uZCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKC4uLmFyZ3M6IGFueSk6IFR9IFtwcm9qZWN0XSBBIGZ1bmN0aW9uIHRvXG4gKiB0cmFuc2Zvcm0gcmVzdWx0cy4gSXQgdGFrZXMgdGhlIGFyZ3VtZW50cyBmcm9tIHRoZSBldmVudCBoYW5kbGVyIGFuZFxuICogc2hvdWxkIHJldHVybiBhIHNpbmdsZSB2YWx1ZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IE9ic2VydmFibGUgd2hpY2gsIHdoZW4gYW4gZXZlbnQgaGFwcGVucywgZW1pdHMgZmlyc3QgcGFyYW1ldGVyXG4gKiBwYXNzZWQgdG8gcmVnaXN0ZXJlZCBldmVudCBoYW5kbGVyLiBBbHRlcm5hdGl2ZWx5IGl0IGVtaXRzIHdoYXRldmVyIHByb2plY3QgZnVuY3Rpb24gcmV0dXJuc1xuICogYXQgdGhhdCBtb21lbnQuXG4gKiBAc3RhdGljIHRydWVcbiAqIEBuYW1lIGZyb21FdmVudFBhdHRlcm5cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IE5vZGVFdmVudEhhbmRsZXIpID0+IGFueSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogTm9kZUV2ZW50SGFuZGxlciwgc2lnbmFsPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQgfCBUW10+IHtcblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyLCByZW1vdmVIYW5kbGVyKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUIHwgVFtdPihzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmU6IFRbXSkgPT4gc3Vic2NyaWJlci5uZXh0KGUubGVuZ3RoID09PSAxID8gZVswXSA6IGUpO1xuXG4gICAgbGV0IHJldFZhbHVlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJldFZhbHVlID0gYWRkSGFuZGxlcihoYW5kbGVyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHJlbW92ZUhhbmRsZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiByZW1vdmVIYW5kbGVyKGhhbmRsZXIsIHJldFZhbHVlKSA7XG4gIH0pO1xufVxuIl19