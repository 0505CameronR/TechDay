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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2RlZmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRTNDLCtCQUE4QixDQUFDLE1BQU07QUFDckMsaUNBQWdDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBOENHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFJLGlCQUF3RDtJQUMvRSxPQUFPLElBQUksdUJBQVUsQ0FBQyxVQUFBLFVBQVU7UUFDOUIsSUFBSSxLQUFzQyxDQUFDO1FBQzNDLElBQUk7WUFDRixLQUFLLEdBQUcsaUJBQWlCLEVBQUUsQ0FBQztTQUM3QjtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN0QixPQUFPLFNBQVMsQ0FBQztTQUNsQjtRQUNELElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxhQUFLLEVBQUUsQ0FBQztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBWkQsc0JBWUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmFibGVPclByb21pc2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBmcm9tIH0gZnJvbSAnLi9mcm9tJzsgLy8gbG9sXG5pbXBvcnQgeyBlbXB0eSB9IGZyb20gJy4vZW1wdHknO1xuXG4vKipcbiAqIENyZWF0ZXMgYW4gT2JzZXJ2YWJsZSB0aGF0LCBvbiBzdWJzY3JpYmUsIGNhbGxzIGFuIE9ic2VydmFibGUgZmFjdG9yeSB0b1xuICogbWFrZSBhbiBPYnNlcnZhYmxlIGZvciBlYWNoIG5ldyBPYnNlcnZlci5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q3JlYXRlcyB0aGUgT2JzZXJ2YWJsZSBsYXppbHksIHRoYXQgaXMsIG9ubHkgd2hlbiBpdFxuICogaXMgc3Vic2NyaWJlZC5cbiAqIDwvc3Bhbj5cbiAqXG4gKiAhW10oZGVmZXIucG5nKVxuICpcbiAqIGBkZWZlcmAgYWxsb3dzIHlvdSB0byBjcmVhdGUgdGhlIE9ic2VydmFibGUgb25seSB3aGVuIHRoZSBPYnNlcnZlclxuICogc3Vic2NyaWJlcywgYW5kIGNyZWF0ZSBhIGZyZXNoIE9ic2VydmFibGUgZm9yIGVhY2ggT2JzZXJ2ZXIuIEl0IHdhaXRzIHVudGlsXG4gKiBhbiBPYnNlcnZlciBzdWJzY3JpYmVzIHRvIGl0LCBhbmQgdGhlbiBpdCBnZW5lcmF0ZXMgYW4gT2JzZXJ2YWJsZSxcbiAqIHR5cGljYWxseSB3aXRoIGFuIE9ic2VydmFibGUgZmFjdG9yeSBmdW5jdGlvbi4gSXQgZG9lcyB0aGlzIGFmcmVzaCBmb3IgZWFjaFxuICogc3Vic2NyaWJlciwgc28gYWx0aG91Z2ggZWFjaCBzdWJzY3JpYmVyIG1heSB0aGluayBpdCBpcyBzdWJzY3JpYmluZyB0byB0aGVcbiAqIHNhbWUgT2JzZXJ2YWJsZSwgaW4gZmFjdCBlYWNoIHN1YnNjcmliZXIgZ2V0cyBpdHMgb3duIGluZGl2aWR1YWxcbiAqIE9ic2VydmFibGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIFN1YnNjcmliZSB0byBlaXRoZXIgYW4gT2JzZXJ2YWJsZSBvZiBjbGlja3Mgb3IgYW4gT2JzZXJ2YWJsZSBvZiBpbnRlcnZhbCwgYXQgcmFuZG9tXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBjbGlja3NPckludGVydmFsID0gZGVmZXIoZnVuY3Rpb24gKCkge1xuICogICByZXR1cm4gTWF0aC5yYW5kb20oKSA+IDAuNVxuICogICAgID8gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKVxuICogICAgIDogaW50ZXJ2YWwoMTAwMCk7XG4gKiB9KTtcbiAqIGNsaWNrc09ySW50ZXJ2YWwuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICpcbiAqIC8vIFJlc3VsdHMgaW4gdGhlIGZvbGxvd2luZyBiZWhhdmlvcjpcbiAqIC8vIElmIHRoZSByZXN1bHQgb2YgTWF0aC5yYW5kb20oKSBpcyBncmVhdGVyIHRoYW4gMC41IGl0IHdpbGwgbGlzdGVuXG4gKiAvLyBmb3IgY2xpY2tzIGFueXdoZXJlIG9uIHRoZSBcImRvY3VtZW50XCI7IHdoZW4gZG9jdW1lbnQgaXMgY2xpY2tlZCBpdFxuICogLy8gd2lsbCBsb2cgYSBNb3VzZUV2ZW50IG9iamVjdCB0byB0aGUgY29uc29sZS4gSWYgdGhlIHJlc3VsdCBpcyBsZXNzXG4gKiAvLyB0aGFuIDAuNSBpdCB3aWxsIGVtaXQgYXNjZW5kaW5nIG51bWJlcnMsIG9uZSBldmVyeSBzZWNvbmQoMTAwMG1zKS5cbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBTdWJzY3JpYmFibGVPclByb21pc2V9IG9ic2VydmFibGVGYWN0b3J5IFRoZSBPYnNlcnZhYmxlXG4gKiBmYWN0b3J5IGZ1bmN0aW9uIHRvIGludm9rZSBmb3IgZWFjaCBPYnNlcnZlciB0aGF0IHN1YnNjcmliZXMgdG8gdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS4gTWF5IGFsc28gcmV0dXJuIGEgUHJvbWlzZSwgd2hpY2ggd2lsbCBiZSBjb252ZXJ0ZWQgb24gdGhlIGZseVxuICogdG8gYW4gT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgd2hvc2UgT2JzZXJ2ZXJzJyBzdWJzY3JpcHRpb25zIHRyaWdnZXJcbiAqIGFuIGludm9jYXRpb24gb2YgdGhlIGdpdmVuIE9ic2VydmFibGUgZmFjdG9yeSBmdW5jdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgZGVmZXJcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBkZWZlcjxUPihvYnNlcnZhYmxlRmFjdG9yeTogKCkgPT4gU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+IHwgdm9pZCk6IE9ic2VydmFibGU8VD4ge1xuICByZXR1cm4gbmV3IE9ic2VydmFibGUoc3Vic2NyaWJlciA9PiB7XG4gICAgbGV0IGlucHV0OiBTdWJzY3JpYmFibGVPclByb21pc2U8VD4gfCB2b2lkO1xuICAgIHRyeSB7XG4gICAgICBpbnB1dCA9IG9ic2VydmFibGVGYWN0b3J5KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBjb25zdCBzb3VyY2UgPSBpbnB1dCA/IGZyb20oaW5wdXQpIDogZW1wdHkoKTtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgfSk7XG59Il19