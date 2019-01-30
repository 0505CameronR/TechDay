"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
/**
 * Convert an object into an Observable of `[key, value]` pairs.
 *
 * <span class="informal">Turn entries of an object into a stream.</span>
 *
 * <img src="./img/pairs.png" width="100%">
 *
 * `pairs` takes an arbitrary object and returns an Observable that emits arrays. Each
 * emitted array has exactly two elements - the first is a key from the object
 * and the second is a value corresponding to that key. Keys are extracted from
 * an object via `Object.keys` function, which means that they will be only
 * enumerable keys that are present on an object directly - not ones inherited
 * via prototype chain.
 *
 * By default these arrays are emitted synchronously. To change that you can
 * pass a {@link SchedulerLike} as a second argument to `pairs`.
 *
 * @example <caption>Converts a javascript object to an Observable</caption>
 * ```javascript
 * const obj = {
 *   foo: 42,
 *   bar: 56,
 *   baz: 78
 * };
 *
 * pairs(obj)
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('the end!')
 * );
 *
 * // Logs:
 * // ["foo": 42],
 * // ["bar": 56],
 * // ["baz": 78],
 * // "the end!"
 * ```
 *
 * @param {Object} obj The object to inspect and turn into an
 * Observable sequence.
 * @param {Scheduler} [scheduler] An optional IScheduler to schedule
 * when resulting Observable will emit values.
 * @returns {(Observable<Array<string|T>>)} An observable sequence of
 * [key, value] pairs from the object.
 */
function pairs(obj, scheduler) {
    if (!scheduler) {
        return new Observable_1.Observable(function (subscriber) {
            var keys = Object.keys(obj);
            for (var i = 0; i < keys.length && !subscriber.closed; i++) {
                var key = keys[i];
                if (obj.hasOwnProperty(key)) {
                    subscriber.next([key, obj[key]]);
                }
            }
            subscriber.complete();
        });
    }
    else {
        return new Observable_1.Observable(function (subscriber) {
            var keys = Object.keys(obj);
            var subscription = new Subscription_1.Subscription();
            subscription.add(scheduler.schedule(dispatch, 0, { keys: keys, index: 0, subscriber: subscriber, subscription: subscription, obj: obj }));
            return subscription;
        });
    }
}
exports.pairs = pairs;
/** @internal */
function dispatch(state) {
    var keys = state.keys, index = state.index, subscriber = state.subscriber, subscription = state.subscription, obj = state.obj;
    if (!subscriber.closed) {
        if (index < keys.length) {
            var key = keys[index];
            subscriber.next([key, obj[key]]);
            subscription.add(this.schedule({ keys: keys, index: index + 1, subscriber: subscriber, subscription: subscription, obj: obj }));
        }
        else {
            subscriber.complete();
        }
    }
}
exports.dispatch = dispatch;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRzNDLGdEQUErQztBQUUvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBNkNHO0FBQ0gsU0FBZ0IsS0FBSyxDQUFJLEdBQVcsRUFBRSxTQUF5QjtJQUM3RCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLHVCQUFVLENBQWMsVUFBQSxVQUFVO1lBQzNDLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxRCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDM0IsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQzthQUNGO1lBQ0QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLE9BQU8sSUFBSSx1QkFBVSxDQUFjLFVBQUEsVUFBVTtZQUMzQyxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLElBQU0sWUFBWSxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFDO1lBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQ2QsU0FBUyxDQUFDLFFBQVEsQ0FDZixRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxNQUFBLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxVQUFVLFlBQUEsRUFBRSxZQUFZLGNBQUEsRUFBRSxHQUFHLEtBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUN0RSxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQztBQXRCRCxzQkFzQkM7QUFFRCxnQkFBZ0I7QUFDaEIsU0FBZ0IsUUFBUSxDQUNJLEtBQXNIO0lBQ3hJLElBQUEsaUJBQUksRUFBRSxtQkFBSyxFQUFFLDZCQUFVLEVBQUUsaUNBQVksRUFBRSxlQUFHLENBQVc7SUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QixJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksTUFBQSxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLFVBQVUsWUFBQSxFQUFFLFlBQVksY0FBQSxFQUFFLEdBQUcsS0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzVGO2FBQU07WUFDTCxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7S0FDRjtBQUNILENBQUM7QUFaRCw0QkFZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5cbi8qKlxuICogQ29udmVydCBhbiBvYmplY3QgaW50byBhbiBPYnNlcnZhYmxlIG9mIGBba2V5LCB2YWx1ZV1gIHBhaXJzLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5UdXJuIGVudHJpZXMgb2YgYW4gb2JqZWN0IGludG8gYSBzdHJlYW0uPC9zcGFuPlxuICpcbiAqIDxpbWcgc3JjPVwiLi9pbWcvcGFpcnMucG5nXCIgd2lkdGg9XCIxMDAlXCI+XG4gKlxuICogYHBhaXJzYCB0YWtlcyBhbiBhcmJpdHJhcnkgb2JqZWN0IGFuZCByZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyBhcnJheXMuIEVhY2hcbiAqIGVtaXR0ZWQgYXJyYXkgaGFzIGV4YWN0bHkgdHdvIGVsZW1lbnRzIC0gdGhlIGZpcnN0IGlzIGEga2V5IGZyb20gdGhlIG9iamVjdFxuICogYW5kIHRoZSBzZWNvbmQgaXMgYSB2YWx1ZSBjb3JyZXNwb25kaW5nIHRvIHRoYXQga2V5LiBLZXlzIGFyZSBleHRyYWN0ZWQgZnJvbVxuICogYW4gb2JqZWN0IHZpYSBgT2JqZWN0LmtleXNgIGZ1bmN0aW9uLCB3aGljaCBtZWFucyB0aGF0IHRoZXkgd2lsbCBiZSBvbmx5XG4gKiBlbnVtZXJhYmxlIGtleXMgdGhhdCBhcmUgcHJlc2VudCBvbiBhbiBvYmplY3QgZGlyZWN0bHkgLSBub3Qgb25lcyBpbmhlcml0ZWRcbiAqIHZpYSBwcm90b3R5cGUgY2hhaW4uXG4gKlxuICogQnkgZGVmYXVsdCB0aGVzZSBhcnJheXMgYXJlIGVtaXR0ZWQgc3luY2hyb25vdXNseS4gVG8gY2hhbmdlIHRoYXQgeW91IGNhblxuICogcGFzcyBhIHtAbGluayBTY2hlZHVsZXJMaWtlfSBhcyBhIHNlY29uZCBhcmd1bWVudCB0byBgcGFpcnNgLlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPkNvbnZlcnRzIGEgamF2YXNjcmlwdCBvYmplY3QgdG8gYW4gT2JzZXJ2YWJsZTwvY2FwdGlvbj5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG9iaiA9IHtcbiAqICAgZm9vOiA0MixcbiAqICAgYmFyOiA1NixcbiAqICAgYmF6OiA3OFxuICogfTtcbiAqXG4gKiBwYWlycyhvYmopXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFtcImZvb1wiOiA0Ml0sXG4gKiAvLyBbXCJiYXJcIjogNTZdLFxuICogLy8gW1wiYmF6XCI6IDc4XSxcbiAqIC8vIFwidGhlIGVuZCFcIlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGluc3BlY3QgYW5kIHR1cm4gaW50byBhblxuICogT2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBBbiBvcHRpb25hbCBJU2NoZWR1bGVyIHRvIHNjaGVkdWxlXG4gKiB3aGVuIHJlc3VsdGluZyBPYnNlcnZhYmxlIHdpbGwgZW1pdCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7KE9ic2VydmFibGU8QXJyYXk8c3RyaW5nfFQ+Pil9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugb2ZcbiAqIFtrZXksIHZhbHVlXSBwYWlycyBmcm9tIHRoZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWlyczxUPihvYmo6IE9iamVjdCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W3N0cmluZywgVF0+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8W3N0cmluZywgVF0+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChba2V5LCBvYmpba2V5XV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlPHsga2V5czogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W3N0cmluZywgVF0+LCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiwgb2JqOiBPYmplY3QgfT5cbiAgICAgICAgICAoZGlzcGF0Y2gsIDAsIHsga2V5cywgaW5kZXg6IDAsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0pKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGtleXM6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFtzdHJpbmcsIFRdPiwgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24sIG9iajogT2JqZWN0IH0pIHtcbiAgY29uc3QgeyBrZXlzLCBpbmRleCwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSA9IHN0YXRlO1xuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgaWYgKGluZGV4IDwga2V5cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgc3Vic2NyaWJlci5uZXh0KFtrZXksIG9ialtrZXldXSk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKHRoaXMuc2NoZWR1bGUoeyBrZXlzLCBpbmRleDogaW5kZXggKyAxLCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==