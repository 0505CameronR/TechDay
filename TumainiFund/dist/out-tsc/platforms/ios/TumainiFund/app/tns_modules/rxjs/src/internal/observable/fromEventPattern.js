"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var isArray_1 = require("../util/isArray");
var isFunction_1 = require("../util/isFunction");
var map_1 = require("../operators/map");
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
function fromEventPattern(addHandler, removeHandler, resultSelector) {
    if (resultSelector) {
        // DEPRECATED PATH
        return fromEventPattern(addHandler, removeHandler).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
    }
    return new Observable_1.Observable(function (subscriber) {
        var handler = function () {
            var e = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                e[_i] = arguments[_i];
            }
            return subscriber.next(e.length === 1 ? e[0] : e);
        };
        var retValue;
        try {
            retValue = addHandler(handler);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!isFunction_1.isFunction(removeHandler)) {
            return undefined;
        }
        return function () { return removeHandler(handler, retValue); };
    });
}
exports.fromEventPattern = fromEventPattern;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJvbUV2ZW50UGF0dGVybi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZnJvbUV2ZW50UGF0dGVybi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUMzQywyQ0FBMEM7QUFDMUMsaURBQWdEO0FBRWhELHdDQUF1QztBQU12QyxtQ0FBbUM7QUFFbkM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdIRztBQUVILFNBQWdCLGdCQUFnQixDQUFJLFVBQXNDLEVBQ3RDLGFBQXlELEVBQ3pELGNBQXNDO0lBRXhFLElBQUksY0FBYyxFQUFFO1FBQ2xCLGtCQUFrQjtRQUNsQixPQUFPLGdCQUFnQixDQUFJLFVBQVUsRUFBRSxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQ3hELFNBQUcsQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLGlCQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLGNBQWMsZUFBSSxJQUFJLEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBOUQsQ0FBOEQsQ0FBQyxDQUM1RSxDQUFDO0tBQ0g7SUFFRCxPQUFPLElBQUksdUJBQVUsQ0FBVSxVQUFBLFVBQVU7UUFDdkMsSUFBTSxPQUFPLEdBQUc7WUFBQyxXQUFTO2lCQUFULFVBQVMsRUFBVCxxQkFBUyxFQUFULElBQVM7Z0JBQVQsc0JBQVM7O1lBQUssT0FBQSxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUExQyxDQUEwQyxDQUFDO1FBRTFFLElBQUksUUFBYSxDQUFDO1FBQ2xCLElBQUk7WUFDRixRQUFRLEdBQUcsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1NBQ2hDO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxDQUFDLHVCQUFVLENBQUMsYUFBYSxDQUFDLEVBQUU7WUFDOUIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxPQUFPLGNBQU0sT0FBQSxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxFQUFoQyxDQUFnQyxDQUFFO0lBQ2pELENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQTVCRCw0Q0E0QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcbmltcG9ydCB7IGlzRnVuY3Rpb24gfSBmcm9tICcuLi91dGlsL2lzRnVuY3Rpb24nO1xuaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAnLi9mcm9tRXZlbnQnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiBhbnksIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCk6IE9ic2VydmFibGU8VD47XG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3Igbm8gbG9uZ2VyIHN1cHBvcnRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZyb21FdmVudFBhdHRlcm48VD4oYWRkSGFuZGxlcjogKGhhbmRsZXI6IEZ1bmN0aW9uKSA9PiBhbnksIHJlbW92ZUhhbmRsZXI/OiAoaGFuZGxlcjogRnVuY3Rpb24sIHNpZ25hbD86IGFueSkgPT4gdm9pZCwgcmVzdWx0U2VsZWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgZnJvbSBhbiBhcmJpdHJhcnkgQVBJIGZvciByZWdpc3RlcmluZyBldmVudCBoYW5kbGVycy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+V2hlbiB0aGF0IG1ldGhvZCBmb3IgYWRkaW5nIGV2ZW50IGhhbmRsZXIgd2FzIHNvbWV0aGluZyB7QGxpbmsgZnJvbUV2ZW50fVxuICogd2FzIG5vdCBwcmVwYXJlZCBmb3IuPC9zcGFuPlxuICpcbiAqICFbXShmcm9tRXZlbnRQYXR0ZXJuLnBuZylcbiAqXG4gKiBgZnJvbUV2ZW50UGF0dGVybmAgYWxsb3dzIHlvdSB0byBjb252ZXJ0IGludG8gYW4gT2JzZXJ2YWJsZSBhbnkgQVBJIHRoYXQgc3VwcG9ydHMgcmVnaXN0ZXJpbmcgaGFuZGxlciBmdW5jdGlvbnNcbiAqIGZvciBldmVudHMuIEl0IGlzIHNpbWlsYXIgdG8ge0BsaW5rIGZyb21FdmVudH0sIGJ1dCBmYXJcbiAqIG1vcmUgZmxleGlibGUuIEluIGZhY3QsIGFsbCB1c2UgY2FzZXMgb2Yge0BsaW5rIGZyb21FdmVudH0gY291bGQgYmUgZWFzaWx5IGhhbmRsZWQgYnlcbiAqIGBmcm9tRXZlbnRQYXR0ZXJuYCAoYWx0aG91Z2ggaW4gc2xpZ2h0bHkgbW9yZSB2ZXJib3NlIHdheSkuXG4gKlxuICogVGhpcyBvcGVyYXRvciBhY2NlcHRzIGFzIGEgZmlyc3QgYXJndW1lbnQgYW4gYGFkZEhhbmRsZXJgIGZ1bmN0aW9uLCB3aGljaCB3aWxsIGJlIGluamVjdGVkIHdpdGhcbiAqIGhhbmRsZXIgcGFyYW1ldGVyLiBUaGF0IGhhbmRsZXIgaXMgYWN0dWFsbHkgYW4gZXZlbnQgaGFuZGxlciBmdW5jdGlvbiB0aGF0IHlvdSBub3cgY2FuIHBhc3NcbiAqIHRvIEFQSSBleHBlY3RpbmcgaXQuIGBhZGRIYW5kbGVyYCB3aWxsIGJlIGNhbGxlZCB3aGVuZXZlciBPYnNlcnZhYmxlXG4gKiByZXR1cm5lZCBieSB0aGUgb3BlcmF0b3IgaXMgc3Vic2NyaWJlZCwgc28gcmVnaXN0ZXJpbmcgaGFuZGxlciBpbiBBUEkgd2lsbCBub3RcbiAqIG5lY2Vzc2FyaWx5IGhhcHBlbiB3aGVuIGBmcm9tRXZlbnRQYXR0ZXJuYCBpcyBjYWxsZWQuXG4gKlxuICogQWZ0ZXIgcmVnaXN0cmF0aW9uLCBldmVyeSB0aW1lIGFuIGV2ZW50IHRoYXQgd2UgbGlzdGVuIHRvIGhhcHBlbnMsXG4gKiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IGBmcm9tRXZlbnRQYXR0ZXJuYCB3aWxsIGVtaXQgdmFsdWUgdGhhdCBldmVudCBoYW5kbGVyXG4gKiBmdW5jdGlvbiB3YXMgY2FsbGVkIHdpdGguIE5vdGUgdGhhdCBpZiBldmVudCBoYW5kbGVyIHdhcyBjYWxsZWQgd2l0aCBtb3JlXG4gKiB0aGVuIG9uZSBhcmd1bWVudCwgc2Vjb25kIGFuZCBmb2xsb3dpbmcgYXJndW1lbnRzIHdpbGwgbm90IGFwcGVhciBpbiB0aGUgT2JzZXJ2YWJsZS5cbiAqXG4gKiBJZiBBUEkgeW91IGFyZSB1c2luZyBhbGxvd3MgdG8gdW5yZWdpc3RlciBldmVudCBoYW5kbGVycyBhcyB3ZWxsLCB5b3UgY2FuIHBhc3MgdG8gYGZyb21FdmVudFBhdHRlcm5gXG4gKiBhbm90aGVyIGZ1bmN0aW9uIC0gYHJlbW92ZUhhbmRsZXJgIC0gYXMgYSBzZWNvbmQgcGFyYW1ldGVyLiBJdCB3aWxsIGJlIGluamVjdGVkXG4gKiB3aXRoIHRoZSBzYW1lIGhhbmRsZXIgZnVuY3Rpb24gYXMgYmVmb3JlLCB3aGljaCBub3cgeW91IGNhbiB1c2UgdG8gdW5yZWdpc3RlclxuICogaXQgZnJvbSB0aGUgQVBJLiBgcmVtb3ZlSGFuZGxlcmAgd2lsbCBiZSBjYWxsZWQgd2hlbiBjb25zdW1lciBvZiByZXN1bHRpbmcgT2JzZXJ2YWJsZVxuICogdW5zdWJzY3JpYmVzIGZyb20gaXQuXG4gKlxuICogSW4gc29tZSBBUElzIHVucmVnaXN0ZXJpbmcgaXMgYWN0dWFsbHkgaGFuZGxlZCBkaWZmZXJlbnRseS4gTWV0aG9kIHJlZ2lzdGVyaW5nIGFuIGV2ZW50IGhhbmRsZXJcbiAqIHJldHVybnMgc29tZSBraW5kIG9mIHRva2VuLCB3aGljaCBpcyBsYXRlciB1c2VkIHRvIGlkZW50aWZ5IHdoaWNoIGZ1bmN0aW9uIHNob3VsZFxuICogYmUgdW5yZWdpc3RlcmVkIG9yIGl0IGl0c2VsZiBoYXMgbWV0aG9kIHRoYXQgdW5yZWdpc3RlcnMgZXZlbnQgaGFuZGxlci5cbiAqIElmIHRoYXQgaXMgdGhlIGNhc2Ugd2l0aCB5b3VyIEFQSSwgbWFrZSBzdXJlIHRva2VuIHJldHVybmVkXG4gKiBieSByZWdpc3RlcmluZyBtZXRob2QgaXMgcmV0dXJuZWQgYnkgYGFkZEhhbmRsZXJgLiBUaGVuIGl0IHdpbGwgYmUgcGFzc2VkXG4gKiBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgcmVtb3ZlSGFuZGxlcmAsIHdoZXJlIHlvdSB3aWxsIGJlIGFibGUgdG8gdXNlIGl0LlxuICpcbiAqIElmIHlvdSBuZWVkIGFjY2VzcyB0byBhbGwgZXZlbnQgaGFuZGxlciBwYXJhbWV0ZXJzIChub3Qgb25seSB0aGUgZmlyc3Qgb25lKSxcbiAqIG9yIHlvdSBuZWVkIHRvIHRyYW5zZm9ybSB0aGVtIGluIGFueSB3YXksIHlvdSBjYW4gY2FsbCBgZnJvbUV2ZW50UGF0dGVybmAgd2l0aCBvcHRpb25hbFxuICogdGhpcmQgcGFyYW1ldGVyIC0gcHJvamVjdCBmdW5jdGlvbiB3aGljaCB3aWxsIGFjY2VwdCBhbGwgYXJndW1lbnRzIHBhc3NlZCB0b1xuICogZXZlbnQgaGFuZGxlciB3aGVuIGl0IGlzIGNhbGxlZC4gV2hhdGV2ZXIgaXMgcmV0dXJuZWQgZnJvbSBwcm9qZWN0IGZ1bmN0aW9uIHdpbGwgYXBwZWFyIG9uXG4gKiByZXN1bHRpbmcgc3RyZWFtIGluc3RlYWQgb2YgdXN1YWwgZXZlbnQgaGFuZGxlcnMgZmlyc3QgYXJndW1lbnQuIFRoaXMgbWVhbnNcbiAqIHRoYXQgZGVmYXVsdCBwcm9qZWN0IGNhbiBiZSB0aG91Z2h0IG9mIGFzIGZ1bmN0aW9uIHRoYXQgdGFrZXMgaXRzIGZpcnN0IHBhcmFtZXRlclxuICogYW5kIGlnbm9yZXMgdGhlIHJlc3QuXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIEVtaXRzIGNsaWNrcyBoYXBwZW5pbmcgb24gdGhlIERPTSBkb2N1bWVudFxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGZ1bmN0aW9uIGFkZENsaWNrSGFuZGxlcihoYW5kbGVyKSB7XG4gKiAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgaGFuZGxlcik7XG4gKiB9XG4gKlxuICogZnVuY3Rpb24gcmVtb3ZlQ2xpY2tIYW5kbGVyKGhhbmRsZXIpIHtcbiAqICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2xpY2snLCBoYW5kbGVyKTtcbiAqIH1cbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBhZGRDbGlja0hhbmRsZXIsXG4gKiAgIHJlbW92ZUNsaWNrSGFuZGxlclxuICogKTtcbiAqIGNsaWNrcy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gV2hlbmV2ZXIgeW91IGNsaWNrIGFueXdoZXJlIGluIHRoZSBicm93c2VyLCBET00gTW91c2VFdmVudFxuICogLy8gb2JqZWN0IHdpbGwgYmUgbG9nZ2VkLlxuICogYGBgXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFVzZSB3aXRoIEFQSSB0aGF0IHJldHVybnMgY2FuY2VsbGF0aW9uIHRva2VuXG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgdG9rZW4gPSBzb21lQVBJLnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGZ1bmN0aW9uKCkge30pO1xuICogc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKHRva2VuKTsgLy8gdGhpcyBBUElzIGNhbmNlbGxhdGlvbiBtZXRob2QgYWNjZXB0c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gbm90IGhhbmRsZXIgaXRzZWxmLCBidXQgc3BlY2lhbCB0b2tlbi5cbiAqXG4gKiBjb25zdCBzb21lQVBJT2JzZXJ2YWJsZSA9IGZyb21FdmVudFBhdHRlcm4oXG4gKiAgIGZ1bmN0aW9uKGhhbmRsZXIpIHsgcmV0dXJuIHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlcik7IH0sIC8vIE5vdGUgdGhhdCB3ZSByZXR1cm4gdGhlIHRva2VuIGhlcmUuLi5cbiAqICAgZnVuY3Rpb24oaGFuZGxlciwgdG9rZW4pIHsgc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKHRva2VuKTsgfSAgLy8gLi4udG8gdGhlbiB1c2UgaXQgaGVyZS5cbiAqICk7XG4gKiBgYGBcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgVXNlIHdpdGggcHJvamVjdCBmdW5jdGlvblxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoKGV2ZW50VHlwZSwgZXZlbnRNZXNzYWdlKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGV2ZW50VHlwZSwgZXZlbnRNZXNzYWdlKTsgLy8gTG9ncyBcIkVWRU5UX1RZUEVcIiBcIkVWRU5UX01FU1NBR0VcIiB0byBjb25zb2xlLlxuICogfSk7XG4gKlxuICogY29uc3Qgc29tZUFQSU9ic2VydmFibGUgPSBmcm9tRXZlbnRQYXR0ZXJuKFxuICogICBoYW5kbGVyID0+IHNvbWVBUEkucmVnaXN0ZXJFdmVudEhhbmRsZXIoaGFuZGxlciksXG4gKiAgIGhhbmRsZXIgPT4gc29tZUFQSS51bnJlZ2lzdGVyRXZlbnRIYW5kbGVyKGhhbmRsZXIpXG4gKiAgIChldmVudFR5cGUsIGV2ZW50TWVzc2FnZSkgPT4gZXZlbnRUeXBlICsgXCIgLS0tIFwiICsgZXZlbnRNZXNzYWdlIC8vIHdpdGhvdXQgdGhhdCBmdW5jdGlvbiBvbmx5IFwiRVZFTlRfVFlQRVwiXG4gKiApOyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3b3VsZCBiZSBlbWl0dGVkIGJ5IHRoZSBPYnNlcnZhYmxlXG4gKlxuICogc29tZUFQSU9ic2VydmFibGUuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiRVZFTlRfVFlQRSAtLS0gRVZFTlRfTUVTU0FHRVwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tRXZlbnR9XG4gKiBAc2VlIHtAbGluayBiaW5kQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb24oaGFuZGxlcjogRnVuY3Rpb24pOiBhbnl9IGFkZEhhbmRsZXIgQSBmdW5jdGlvbiB0aGF0IHRha2VzXG4gKiBhIGBoYW5kbGVyYCBmdW5jdGlvbiBhcyBhcmd1bWVudCBhbmQgYXR0YWNoZXMgaXQgc29tZWhvdyB0byB0aGUgYWN0dWFsXG4gKiBzb3VyY2Ugb2YgZXZlbnRzLlxuICogQHBhcmFtIHtmdW5jdGlvbihoYW5kbGVyOiBGdW5jdGlvbiwgdG9rZW4/OiBhbnkpOiB2b2lkfSBbcmVtb3ZlSGFuZGxlcl0gQSBmdW5jdGlvbiB0aGF0XG4gKiB0YWtlcyBhIGBoYW5kbGVyYCBmdW5jdGlvbiBhcyBhbiBhcmd1bWVudCBhbmQgcmVtb3ZlcyBpdCBmcm9tIHRoZSBldmVudCBzb3VyY2UuIElmIGBhZGRIYW5kbGVyYFxuICogcmV0dXJucyBzb21lIGtpbmQgb2YgdG9rZW4sIGByZW1vdmVIYW5kbGVyYCBmdW5jdGlvbiB3aWxsIGhhdmUgaXQgYXMgYSBzZWNvbmQgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtmdW5jdGlvbiguLi5hcmdzOiBhbnkpOiBUfSBbcHJvamVjdF0gQSBmdW5jdGlvbiB0b1xuICogdHJhbnNmb3JtIHJlc3VsdHMuIEl0IHRha2VzIHRoZSBhcmd1bWVudHMgZnJvbSB0aGUgZXZlbnQgaGFuZGxlciBhbmRcbiAqIHNob3VsZCByZXR1cm4gYSBzaW5nbGUgdmFsdWUuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFQ+fSBPYnNlcnZhYmxlIHdoaWNoLCB3aGVuIGFuIGV2ZW50IGhhcHBlbnMsIGVtaXRzIGZpcnN0IHBhcmFtZXRlclxuICogcGFzc2VkIHRvIHJlZ2lzdGVyZWQgZXZlbnQgaGFuZGxlci4gQWx0ZXJuYXRpdmVseSBpdCBlbWl0cyB3aGF0ZXZlciBwcm9qZWN0IGZ1bmN0aW9uIHJldHVybnNcbiAqIGF0IHRoYXQgbW9tZW50LlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBmcm9tRXZlbnRQYXR0ZXJuXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBmcm9tRXZlbnRQYXR0ZXJuPFQ+KGFkZEhhbmRsZXI6IChoYW5kbGVyOiBGdW5jdGlvbikgPT4gYW55LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVtb3ZlSGFuZGxlcj86IChoYW5kbGVyOiBGdW5jdGlvbiwgc2lnbmFsPzogYW55KSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I/OiAoLi4uYXJnczogYW55W10pID0+IFQpOiBPYnNlcnZhYmxlPFQgfCBUW10+IHtcblxuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICByZXR1cm4gZnJvbUV2ZW50UGF0dGVybjxUPihhZGRIYW5kbGVyLCByZW1vdmVIYW5kbGVyKS5waXBlKFxuICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUIHwgVFtdPihzdWJzY3JpYmVyID0+IHtcbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmU6IFRbXSkgPT4gc3Vic2NyaWJlci5uZXh0KGUubGVuZ3RoID09PSAxID8gZVswXSA6IGUpO1xuXG4gICAgbGV0IHJldFZhbHVlOiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJldFZhbHVlID0gYWRkSGFuZGxlcihoYW5kbGVyKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgaWYgKCFpc0Z1bmN0aW9uKHJlbW92ZUhhbmRsZXIpKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiAoKSA9PiByZW1vdmVIYW5kbGVyKGhhbmRsZXIsIHJldFZhbHVlKSA7XG4gIH0pO1xufVxuIl19