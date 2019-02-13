"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var from_1 = require("./from"); // lol
var empty_1 = require("./empty");
/**
 * Creates an Observable that, on subscribe, calls an Observable factory to
 * make an Observable for each new Observer.
 *
 * <span class="informal">Creates the Observable lazily, that is, only when it
 * is subscribed.
 * </span>
 *
 * ![](defer.png)
 *
 * `defer` allows you to create the Observable only when the Observer
 * subscribes, and create a fresh Observable for each Observer. It waits until
 * an Observer subscribes to it, and then it generates an Observable,
 * typically with an Observable factory function. It does this afresh for each
 * subscriber, so although each subscriber may think it is subscribing to the
 * same Observable, in fact each subscriber gets its own individual
 * Observable.
 *
 * ## Example
 * ### Subscribe to either an Observable of clicks or an Observable of interval, at random
 * ```javascript
 * const clicksOrInterval = defer(function () {
 *   return Math.random() > 0.5
 *     ? fromEvent(document, 'click')
 *     : interval(1000);
 * });
 * clicksOrInterval.subscribe(x => console.log(x));
 *
 * // Results in the following behavior:
 * // If the result of Math.random() is greater than 0.5 it will listen
 * // for clicks anywhere on the "document"; when document is clicked it
 * // will log a MouseEvent object to the console. If the result is less
 * // than 0.5 it will emit ascending numbers, one every second(1000ms).
 * ```
 *
 * @see {@link Observable}
 *
 * @param {function(): SubscribableOrPromise} observableFactory The Observable
 * factory function to invoke for each Observer that subscribes to the output
 * Observable. May also return a Promise, which will be converted on the fly
 * to an Observable.
 * @return {Observable} An Observable whose Observers' subscriptions trigger
 * an invocation of the given Observable factory function.
 * @static true
 * @name defer
 * @owner Observable
 */
function defer(observableFactory) {
    return new Observable_1.Observable(function (subscriber) {
        var input;
        try {
            input = observableFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        var source = input ? from_1.from(input) : empty_1.empty();
        return source.subscribe(subscriber);
    });
}
exports.defer = defer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZGVmZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFFM0MsK0JBQThCLENBQUMsTUFBTTtBQUNyQyxpQ0FBZ0M7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E4Q0c7QUFDSCxTQUFnQixLQUFLLENBQUksaUJBQXdEO0lBQy9FLE9BQU8sSUFBSSx1QkFBVSxDQUFDLFVBQUEsVUFBVTtRQUM5QixJQUFJLEtBQXNDLENBQUM7UUFDM0MsSUFBSTtZQUNGLEtBQUssR0FBRyxpQkFBaUIsRUFBRSxDQUFDO1NBQzdCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBQ0QsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQyxXQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLGFBQUssRUFBRSxDQUFDO1FBQzdDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUN0QyxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFaRCxzQkFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFN1YnNjcmliYWJsZU9yUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nOyAvLyBsb2xcbmltcG9ydCB7IGVtcHR5IH0gZnJvbSAnLi9lbXB0eSc7XG5cbi8qKlxuICogQ3JlYXRlcyBhbiBPYnNlcnZhYmxlIHRoYXQsIG9uIHN1YnNjcmliZSwgY2FsbHMgYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IHRvXG4gKiBtYWtlIGFuIE9ic2VydmFibGUgZm9yIGVhY2ggbmV3IE9ic2VydmVyLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5DcmVhdGVzIHRoZSBPYnNlcnZhYmxlIGxhemlseSwgdGhhdCBpcywgb25seSB3aGVuIGl0XG4gKiBpcyBzdWJzY3JpYmVkLlxuICogPC9zcGFuPlxuICpcbiAqICFbXShkZWZlci5wbmcpXG4gKlxuICogYGRlZmVyYCBhbGxvd3MgeW91IHRvIGNyZWF0ZSB0aGUgT2JzZXJ2YWJsZSBvbmx5IHdoZW4gdGhlIE9ic2VydmVyXG4gKiBzdWJzY3JpYmVzLCBhbmQgY3JlYXRlIGEgZnJlc2ggT2JzZXJ2YWJsZSBmb3IgZWFjaCBPYnNlcnZlci4gSXQgd2FpdHMgdW50aWxcbiAqIGFuIE9ic2VydmVyIHN1YnNjcmliZXMgdG8gaXQsIGFuZCB0aGVuIGl0IGdlbmVyYXRlcyBhbiBPYnNlcnZhYmxlLFxuICogdHlwaWNhbGx5IHdpdGggYW4gT2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLiBJdCBkb2VzIHRoaXMgYWZyZXNoIGZvciBlYWNoXG4gKiBzdWJzY3JpYmVyLCBzbyBhbHRob3VnaCBlYWNoIHN1YnNjcmliZXIgbWF5IHRoaW5rIGl0IGlzIHN1YnNjcmliaW5nIHRvIHRoZVxuICogc2FtZSBPYnNlcnZhYmxlLCBpbiBmYWN0IGVhY2ggc3Vic2NyaWJlciBnZXRzIGl0cyBvd24gaW5kaXZpZHVhbFxuICogT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiAjIyMgU3Vic2NyaWJlIHRvIGVpdGhlciBhbiBPYnNlcnZhYmxlIG9mIGNsaWNrcyBvciBhbiBPYnNlcnZhYmxlIG9mIGludGVydmFsLCBhdCByYW5kb21cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrc09ySW50ZXJ2YWwgPSBkZWZlcihmdW5jdGlvbiAoKSB7XG4gKiAgIHJldHVybiBNYXRoLnJhbmRvbSgpID4gMC41XG4gKiAgICAgPyBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpXG4gKiAgICAgOiBpbnRlcnZhbCgxMDAwKTtcbiAqIH0pO1xuICogY2xpY2tzT3JJbnRlcnZhbC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKlxuICogLy8gUmVzdWx0cyBpbiB0aGUgZm9sbG93aW5nIGJlaGF2aW9yOlxuICogLy8gSWYgdGhlIHJlc3VsdCBvZiBNYXRoLnJhbmRvbSgpIGlzIGdyZWF0ZXIgdGhhbiAwLjUgaXQgd2lsbCBsaXN0ZW5cbiAqIC8vIGZvciBjbGlja3MgYW55d2hlcmUgb24gdGhlIFwiZG9jdW1lbnRcIjsgd2hlbiBkb2N1bWVudCBpcyBjbGlja2VkIGl0XG4gKiAvLyB3aWxsIGxvZyBhIE1vdXNlRXZlbnQgb2JqZWN0IHRvIHRoZSBjb25zb2xlLiBJZiB0aGUgcmVzdWx0IGlzIGxlc3NcbiAqIC8vIHRoYW4gMC41IGl0IHdpbGwgZW1pdCBhc2NlbmRpbmcgbnVtYmVycywgb25lIGV2ZXJ5IHNlY29uZCgxMDAwbXMpLlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IFN1YnNjcmliYWJsZU9yUHJvbWlzZX0gb2JzZXJ2YWJsZUZhY3RvcnkgVGhlIE9ic2VydmFibGVcbiAqIGZhY3RvcnkgZnVuY3Rpb24gdG8gaW52b2tlIGZvciBlYWNoIE9ic2VydmVyIHRoYXQgc3Vic2NyaWJlcyB0byB0aGUgb3V0cHV0XG4gKiBPYnNlcnZhYmxlLiBNYXkgYWxzbyByZXR1cm4gYSBQcm9taXNlLCB3aGljaCB3aWxsIGJlIGNvbnZlcnRlZCBvbiB0aGUgZmx5XG4gKiB0byBhbiBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB3aG9zZSBPYnNlcnZlcnMnIHN1YnNjcmlwdGlvbnMgdHJpZ2dlclxuICogYW4gaW52b2NhdGlvbiBvZiB0aGUgZ2l2ZW4gT2JzZXJ2YWJsZSBmYWN0b3J5IGZ1bmN0aW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBkZWZlclxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlZmVyPFQ+KG9ic2VydmFibGVGYWN0b3J5OiAoKSA9PiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gfCB2b2lkKTogT2JzZXJ2YWJsZTxUPiB7XG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZShzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgaW5wdXQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiB8IHZvaWQ7XG4gICAgdHJ5IHtcbiAgICAgIGlucHV0ID0gb2JzZXJ2YWJsZUZhY3RvcnkoKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGNvbnN0IHNvdXJjZSA9IGlucHV0ID8gZnJvbShpbnB1dCkgOiBlbXB0eSgpO1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9KTtcbn0iXX0=