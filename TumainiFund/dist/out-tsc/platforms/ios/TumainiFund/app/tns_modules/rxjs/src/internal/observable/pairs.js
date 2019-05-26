import { Observable } from '../Observable';
import { Subscription } from '../Subscription';
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
 * import { pairs } from 'rxjs';
 *
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
 * // ["foo", 42],
 * // ["bar", 56],
 * // ["baz", 78],
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
export function pairs(obj, scheduler) {
    if (!scheduler) {
        return new Observable(subscriber => {
            const keys = Object.keys(obj);
            for (let i = 0; i < keys.length && !subscriber.closed; i++) {
                const key = keys[i];
                if (obj.hasOwnProperty(key)) {
                    subscriber.next([key, obj[key]]);
                }
            }
            subscriber.complete();
        });
    }
    else {
        return new Observable(subscriber => {
            const keys = Object.keys(obj);
            const subscription = new Subscription();
            subscription.add(scheduler.schedule(dispatch, 0, { keys, index: 0, subscriber, subscription, obj }));
            return subscription;
        });
    }
}
/** @internal */
export function dispatch(state) {
    const { keys, index, subscriber, subscription, obj } = state;
    if (!subscriber.closed) {
        if (index < keys.length) {
            const key = keys[index];
            subscriber.next([key, obj[key]]);
            subscription.add(this.schedule({ keys, index: index + 1, subscriber, subscription, obj }));
        }
        else {
            subscriber.complete();
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStDRztBQUNILE1BQU0sVUFBVSxLQUFLLENBQUksR0FBVyxFQUFFLFNBQXlCO0lBQzdELElBQUksQ0FBQyxTQUFTLEVBQUU7UUFDZCxPQUFPLElBQUksVUFBVSxDQUFjLFVBQVUsQ0FBQyxFQUFFO1lBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO2dCQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BCLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtvQkFDM0IsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNsQzthQUNGO1lBQ0QsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7U0FBTTtRQUNMLE9BQU8sSUFBSSxVQUFVLENBQWMsVUFBVSxDQUFDLEVBQUU7WUFDOUMsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM5QixNQUFNLFlBQVksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO1lBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQ2QsU0FBUyxDQUFDLFFBQVEsQ0FDZixRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEUsT0FBTyxZQUFZLENBQUM7UUFDdEIsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUM7QUFFRCxnQkFBZ0I7QUFDaEIsTUFBTSxVQUFVLFFBQVEsQ0FDSSxLQUFzSDtJQUNoSixNQUFNLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxHQUFHLEtBQUssQ0FBQztJQUM3RCxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUN0QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFO1lBQ3ZCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUN4QixVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDakMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEdBQUcsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQzVGO2FBQU07WUFDTCxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDdkI7S0FDRjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuXG4vKipcbiAqIENvbnZlcnQgYW4gb2JqZWN0IGludG8gYW4gT2JzZXJ2YWJsZSBvZiBgW2tleSwgdmFsdWVdYCBwYWlycy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VHVybiBlbnRyaWVzIG9mIGFuIG9iamVjdCBpbnRvIGEgc3RyZWFtLjwvc3Bhbj5cbiAqXG4gKiA8aW1nIHNyYz1cIi4vaW1nL3BhaXJzLnBuZ1wiIHdpZHRoPVwiMTAwJVwiPlxuICpcbiAqIGBwYWlyc2AgdGFrZXMgYW4gYXJiaXRyYXJ5IG9iamVjdCBhbmQgcmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgYXJyYXlzLiBFYWNoXG4gKiBlbWl0dGVkIGFycmF5IGhhcyBleGFjdGx5IHR3byBlbGVtZW50cyAtIHRoZSBmaXJzdCBpcyBhIGtleSBmcm9tIHRoZSBvYmplY3RcbiAqIGFuZCB0aGUgc2Vjb25kIGlzIGEgdmFsdWUgY29ycmVzcG9uZGluZyB0byB0aGF0IGtleS4gS2V5cyBhcmUgZXh0cmFjdGVkIGZyb21cbiAqIGFuIG9iamVjdCB2aWEgYE9iamVjdC5rZXlzYCBmdW5jdGlvbiwgd2hpY2ggbWVhbnMgdGhhdCB0aGV5IHdpbGwgYmUgb25seVxuICogZW51bWVyYWJsZSBrZXlzIHRoYXQgYXJlIHByZXNlbnQgb24gYW4gb2JqZWN0IGRpcmVjdGx5IC0gbm90IG9uZXMgaW5oZXJpdGVkXG4gKiB2aWEgcHJvdG90eXBlIGNoYWluLlxuICpcbiAqIEJ5IGRlZmF1bHQgdGhlc2UgYXJyYXlzIGFyZSBlbWl0dGVkIHN5bmNocm9ub3VzbHkuIFRvIGNoYW5nZSB0aGF0IHlvdSBjYW5cbiAqIHBhc3MgYSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gYXMgYSBzZWNvbmQgYXJndW1lbnQgdG8gYHBhaXJzYC5cbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Db252ZXJ0cyBhIGphdmFzY3JpcHQgb2JqZWN0IHRvIGFuIE9ic2VydmFibGU8L2NhcHRpb24+XG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBwYWlycyB9IGZyb20gJ3J4anMnO1xuICpcbiAqIGNvbnN0IG9iaiA9IHtcbiAqICAgZm9vOiA0MixcbiAqICAgYmFyOiA1NixcbiAqICAgYmF6OiA3OFxuICogfTtcbiAqXG4gKiBwYWlycyhvYmopXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQhJylcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFtcImZvb1wiLCA0Ml0sXG4gKiAvLyBbXCJiYXJcIiwgNTZdLFxuICogLy8gW1wiYmF6XCIsIDc4XSxcbiAqIC8vIFwidGhlIGVuZCFcIlxuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iaiBUaGUgb2JqZWN0IHRvIGluc3BlY3QgYW5kIHR1cm4gaW50byBhblxuICogT2JzZXJ2YWJsZSBzZXF1ZW5jZS5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBBbiBvcHRpb25hbCBJU2NoZWR1bGVyIHRvIHNjaGVkdWxlXG4gKiB3aGVuIHJlc3VsdGluZyBPYnNlcnZhYmxlIHdpbGwgZW1pdCB2YWx1ZXMuXG4gKiBAcmV0dXJucyB7KE9ic2VydmFibGU8QXJyYXk8c3RyaW5nfFQ+Pil9IEFuIG9ic2VydmFibGUgc2VxdWVuY2Ugb2ZcbiAqIFtrZXksIHZhbHVlXSBwYWlycyBmcm9tIHRoZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYWlyczxUPihvYmo6IE9iamVjdCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8W3N0cmluZywgVF0+IHtcbiAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8W3N0cmluZywgVF0+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoICYmICFzdWJzY3JpYmVyLmNsb3NlZDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IGtleXNbaV07XG4gICAgICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgIHN1YnNjcmliZXIubmV4dChba2V5LCBvYmpba2V5XV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdWJzY3JpYmVyLmNvbXBsZXRlKCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFtzdHJpbmcsIFRdPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyhvYmopO1xuICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgICAgc3Vic2NyaXB0aW9uLmFkZChcbiAgICAgICAgc2NoZWR1bGVyLnNjaGVkdWxlPHsga2V5czogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W3N0cmluZywgVF0+LCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiwgb2JqOiBPYmplY3QgfT5cbiAgICAgICAgICAoZGlzcGF0Y2gsIDAsIHsga2V5cywgaW5kZXg6IDAsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0pKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfSk7XG4gIH1cbn1cblxuLyoqIEBpbnRlcm5hbCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxhbnk+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0YXRlOiB7IGtleXM6IHN0cmluZ1tdLCBpbmRleDogbnVtYmVyLCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFtzdHJpbmcsIFRdPiwgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb24sIG9iajogT2JqZWN0IH0pIHtcbiAgY29uc3QgeyBrZXlzLCBpbmRleCwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSA9IHN0YXRlO1xuICBpZiAoIXN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgaWYgKGluZGV4IDwga2V5cy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IGtleSA9IGtleXNbaW5kZXhdO1xuICAgICAgc3Vic2NyaWJlci5uZXh0KFtrZXksIG9ialtrZXldXSk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKHRoaXMuc2NoZWR1bGUoeyBrZXlzLCBpbmRleDogaW5kZXggKyAxLCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==