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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFpcnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3BhaXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHM0MsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRS9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2Q0c7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLEdBQVcsRUFBRSxTQUF5QjtJQUM3RCxJQUFJLENBQUMsU0FBUyxFQUFFO1FBQ2QsT0FBTyxJQUFJLFVBQVUsQ0FBYyxVQUFVLENBQUMsRUFBRTtZQUM5QyxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzlCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtnQkFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQzNCLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDbEM7YUFDRjtZQUNELFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQztLQUNKO1NBQU07UUFDTCxPQUFPLElBQUksVUFBVSxDQUFjLFVBQVUsQ0FBQyxFQUFFO1lBQzlDLE1BQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDOUIsTUFBTSxZQUFZLEdBQUcsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUN4QyxZQUFZLENBQUMsR0FBRyxDQUNkLFNBQVMsQ0FBQyxRQUFRLENBQ2YsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLFVBQVUsRUFBRSxZQUFZLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sWUFBWSxDQUFDO1FBQ3RCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDO0FBRUQsZ0JBQWdCO0FBQ2hCLE1BQU0sVUFBVSxRQUFRLENBQ0ksS0FBc0g7SUFDaEosTUFBTSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxHQUFHLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDN0QsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEVBQUU7UUFDdEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUN2QixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDeEIsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUM1RjthQUFNO1lBQ0wsVUFBVSxDQUFDLFFBQVEsRUFBRSxDQUFDO1NBQ3ZCO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcblxuLyoqXG4gKiBDb252ZXJ0IGFuIG9iamVjdCBpbnRvIGFuIE9ic2VydmFibGUgb2YgYFtrZXksIHZhbHVlXWAgcGFpcnMuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlR1cm4gZW50cmllcyBvZiBhbiBvYmplY3QgaW50byBhIHN0cmVhbS48L3NwYW4+XG4gKlxuICogPGltZyBzcmM9XCIuL2ltZy9wYWlycy5wbmdcIiB3aWR0aD1cIjEwMCVcIj5cbiAqXG4gKiBgcGFpcnNgIHRha2VzIGFuIGFyYml0cmFyeSBvYmplY3QgYW5kIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGFycmF5cy4gRWFjaFxuICogZW1pdHRlZCBhcnJheSBoYXMgZXhhY3RseSB0d28gZWxlbWVudHMgLSB0aGUgZmlyc3QgaXMgYSBrZXkgZnJvbSB0aGUgb2JqZWN0XG4gKiBhbmQgdGhlIHNlY29uZCBpcyBhIHZhbHVlIGNvcnJlc3BvbmRpbmcgdG8gdGhhdCBrZXkuIEtleXMgYXJlIGV4dHJhY3RlZCBmcm9tXG4gKiBhbiBvYmplY3QgdmlhIGBPYmplY3Qua2V5c2AgZnVuY3Rpb24sIHdoaWNoIG1lYW5zIHRoYXQgdGhleSB3aWxsIGJlIG9ubHlcbiAqIGVudW1lcmFibGUga2V5cyB0aGF0IGFyZSBwcmVzZW50IG9uIGFuIG9iamVjdCBkaXJlY3RseSAtIG5vdCBvbmVzIGluaGVyaXRlZFxuICogdmlhIHByb3RvdHlwZSBjaGFpbi5cbiAqXG4gKiBCeSBkZWZhdWx0IHRoZXNlIGFycmF5cyBhcmUgZW1pdHRlZCBzeW5jaHJvbm91c2x5LiBUbyBjaGFuZ2UgdGhhdCB5b3UgY2FuXG4gKiBwYXNzIGEge0BsaW5rIFNjaGVkdWxlckxpa2V9IGFzIGEgc2Vjb25kIGFyZ3VtZW50IHRvIGBwYWlyc2AuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+Q29udmVydHMgYSBqYXZhc2NyaXB0IG9iamVjdCB0byBhbiBPYnNlcnZhYmxlPC9jYXB0aW9uPlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JqID0ge1xuICogICBmb286IDQyLFxuICogICBiYXI6IDU2LFxuICogICBiYXo6IDc4XG4gKiB9O1xuICpcbiAqIHBhaXJzKG9iailcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gW1wiZm9vXCI6IDQyXSxcbiAqIC8vIFtcImJhclwiOiA1Nl0sXG4gKiAvLyBbXCJiYXpcIjogNzhdLFxuICogLy8gXCJ0aGUgZW5kIVwiXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqIFRoZSBvYmplY3QgdG8gaW5zcGVjdCBhbmQgdHVybiBpbnRvIGFuXG4gKiBPYnNlcnZhYmxlIHNlcXVlbmNlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIEFuIG9wdGlvbmFsIElTY2hlZHVsZXIgdG8gc2NoZWR1bGVcbiAqIHdoZW4gcmVzdWx0aW5nIE9ic2VydmFibGUgd2lsbCBlbWl0IHZhbHVlcy5cbiAqIEByZXR1cm5zIHsoT2JzZXJ2YWJsZTxBcnJheTxzdHJpbmd8VD4+KX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBvZlxuICogW2tleSwgdmFsdWVdIHBhaXJzIGZyb20gdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHBhaXJzPFQ+KG9iajogT2JqZWN0LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4ge1xuICBpZiAoIXNjaGVkdWxlcikge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxbc3RyaW5nLCBUXT4oc3Vic2NyaWJlciA9PiB7XG4gICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXMob2JqKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGggJiYgIXN1YnNjcmliZXIuY2xvc2VkOyBpKyspIHtcbiAgICAgICAgY29uc3Qga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgc3Vic2NyaWJlci5uZXh0KFtrZXksIG9ialtrZXldXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8W3N0cmluZywgVF0+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKG9iaik7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKFxuICAgICAgICBzY2hlZHVsZXIuc2NoZWR1bGU8eyBrZXlzOiBzdHJpbmdbXSwgaW5kZXg6IG51bWJlciwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxbc3RyaW5nLCBUXT4sIHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uLCBvYmo6IE9iamVjdCB9PlxuICAgICAgICAgIChkaXNwYXRjaCwgMCwgeyBrZXlzLCBpbmRleDogMCwgc3Vic2NyaWJlciwgc3Vic2NyaXB0aW9uLCBvYmogfSkpO1xuICAgICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgICB9KTtcbiAgfVxufVxuXG4vKiogQGludGVybmFsICovXG5leHBvcnQgZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPGFueT4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGU6IHsga2V5czogc3RyaW5nW10sIGluZGV4OiBudW1iZXIsIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8W3N0cmluZywgVF0+LCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbiwgb2JqOiBPYmplY3QgfSkge1xuICBjb25zdCB7IGtleXMsIGluZGV4LCBzdWJzY3JpYmVyLCBzdWJzY3JpcHRpb24sIG9iaiB9ID0gc3RhdGU7XG4gIGlmICghc3Vic2NyaWJlci5jbG9zZWQpIHtcbiAgICBpZiAoaW5kZXggPCBrZXlzLmxlbmd0aCkge1xuICAgICAgY29uc3Qga2V5ID0ga2V5c1tpbmRleF07XG4gICAgICBzdWJzY3JpYmVyLm5leHQoW2tleSwgb2JqW2tleV1dKTtcbiAgICAgIHN1YnNjcmlwdGlvbi5hZGQodGhpcy5zY2hlZHVsZSh7IGtleXMsIGluZGV4OiBpbmRleCArIDEsIHN1YnNjcmliZXIsIHN1YnNjcmlwdGlvbiwgb2JqIH0pKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgIH1cbiAgfVxufVxuIl19