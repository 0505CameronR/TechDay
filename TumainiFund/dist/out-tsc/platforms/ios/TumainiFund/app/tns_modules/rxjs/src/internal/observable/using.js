import { Observable } from '../Observable';
import { from } from './from'; // from from from! LAWL
import { EMPTY } from './empty';
/**
 * Creates an Observable that uses a resource which will be disposed at the same time as the Observable.
 *
 * <span class="informal">Use it when you catch yourself cleaning up after an Observable.</span>
 *
 * `using` is a factory operator, which accepts two functions. First function returns a disposable resource.
 * It can be an arbitrary object that implements `unsubscribe` method. Second function will be injected with
 * that object and should return an Observable. That Observable can use resource object during its execution.
 * Both functions passed to `using` will be called every time someone subscribes - neither an Observable nor
 * resource object will be shared in any way between subscriptions.
 *
 * When Observable returned by `using` is subscribed, Observable returned from the second function will be subscribed
 * as well. All its notifications (nexted values, completion and error events) will be emitted unchanged by the output
 * Observable. If however someone unsubscribes from the Observable or source Observable completes or errors by itself,
 * the `unsubscribe` method on resource object will be called. This can be used to do any necessary clean up, which
 * otherwise would have to be handled by hand. Note that complete or error notifications are not emitted when someone
 * cancels subscription to an Observable via `unsubscribe`, so `using` can be used as a hook, allowing you to make
 * sure that all resources which need to exist during an Observable execution will be disposed at appropriate time.
 *
 * @see {@link defer}
 *
 * @param {function(): ISubscription} resourceFactory A function which creates any resource object
 * that implements `unsubscribe` method.
 * @param {function(resource: ISubscription): Observable<T>} observableFactory A function which
 * creates an Observable, that can use injected resource object.
 * @return {Observable<T>} An Observable that behaves the same as Observable returned by `observableFactory`, but
 * which - when completed, errored or unsubscribed - will also call `unsubscribe` on created resource object.
 */
export function using(resourceFactory, observableFactory) {
    return new Observable(subscriber => {
        let resource;
        try {
            resource = resourceFactory();
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        let result;
        try {
            result = observableFactory(resource);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        const source = result ? from(result) : EMPTY;
        const subscription = source.subscribe(subscriber);
        return () => {
            subscription.unsubscribe();
            if (resource) {
                resource.unsubscribe();
            }
        };
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL3VzaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLFFBQVEsQ0FBQyxDQUFDLHVCQUF1QjtBQUN0RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBRWhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EyQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLGVBQTRDLEVBQzVDLGlCQUFpRjtJQUN4RyxPQUFPLElBQUksVUFBVSxDQUFJLFVBQVUsQ0FBQyxFQUFFO1FBQ3BDLElBQUksUUFBK0IsQ0FBQztRQUVwQyxJQUFJO1lBQ0YsUUFBUSxHQUFHLGVBQWUsRUFBRSxDQUFDO1NBQzlCO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixVQUFVLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sU0FBUyxDQUFDO1NBQ2xCO1FBRUQsSUFBSSxNQUFpQyxDQUFDO1FBQ3RDLElBQUk7WUFDRixNQUFNLEdBQUcsaUJBQWlCLENBQUMsUUFBUSxDQUFDLENBQUM7U0FDdEM7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLFVBQVUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDdEIsT0FBTyxTQUFTLENBQUM7U0FDbEI7UUFFRCxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDO1FBQzdDLE1BQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUM7UUFDbEQsT0FBTyxHQUFHLEVBQUU7WUFDVixZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDM0IsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQ3hCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgVW5zdWJzY3JpYmFibGUsIE9ic2VydmFibGVJbnB1dCB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IGZyb20gfSBmcm9tICcuL2Zyb20nOyAvLyBmcm9tIGZyb20gZnJvbSEgTEFXTFxuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcblxuLyoqXG4gKiBDcmVhdGVzIGFuIE9ic2VydmFibGUgdGhhdCB1c2VzIGEgcmVzb3VyY2Ugd2hpY2ggd2lsbCBiZSBkaXNwb3NlZCBhdCB0aGUgc2FtZSB0aW1lIGFzIHRoZSBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5Vc2UgaXQgd2hlbiB5b3UgY2F0Y2ggeW91cnNlbGYgY2xlYW5pbmcgdXAgYWZ0ZXIgYW4gT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYHVzaW5nYCBpcyBhIGZhY3Rvcnkgb3BlcmF0b3IsIHdoaWNoIGFjY2VwdHMgdHdvIGZ1bmN0aW9ucy4gRmlyc3QgZnVuY3Rpb24gcmV0dXJucyBhIGRpc3Bvc2FibGUgcmVzb3VyY2UuXG4gKiBJdCBjYW4gYmUgYW4gYXJiaXRyYXJ5IG9iamVjdCB0aGF0IGltcGxlbWVudHMgYHVuc3Vic2NyaWJlYCBtZXRob2QuIFNlY29uZCBmdW5jdGlvbiB3aWxsIGJlIGluamVjdGVkIHdpdGhcbiAqIHRoYXQgb2JqZWN0IGFuZCBzaG91bGQgcmV0dXJuIGFuIE9ic2VydmFibGUuIFRoYXQgT2JzZXJ2YWJsZSBjYW4gdXNlIHJlc291cmNlIG9iamVjdCBkdXJpbmcgaXRzIGV4ZWN1dGlvbi5cbiAqIEJvdGggZnVuY3Rpb25zIHBhc3NlZCB0byBgdXNpbmdgIHdpbGwgYmUgY2FsbGVkIGV2ZXJ5IHRpbWUgc29tZW9uZSBzdWJzY3JpYmVzIC0gbmVpdGhlciBhbiBPYnNlcnZhYmxlIG5vclxuICogcmVzb3VyY2Ugb2JqZWN0IHdpbGwgYmUgc2hhcmVkIGluIGFueSB3YXkgYmV0d2VlbiBzdWJzY3JpcHRpb25zLlxuICpcbiAqIFdoZW4gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSBgdXNpbmdgIGlzIHN1YnNjcmliZWQsIE9ic2VydmFibGUgcmV0dXJuZWQgZnJvbSB0aGUgc2Vjb25kIGZ1bmN0aW9uIHdpbGwgYmUgc3Vic2NyaWJlZFxuICogYXMgd2VsbC4gQWxsIGl0cyBub3RpZmljYXRpb25zIChuZXh0ZWQgdmFsdWVzLCBjb21wbGV0aW9uIGFuZCBlcnJvciBldmVudHMpIHdpbGwgYmUgZW1pdHRlZCB1bmNoYW5nZWQgYnkgdGhlIG91dHB1dFxuICogT2JzZXJ2YWJsZS4gSWYgaG93ZXZlciBzb21lb25lIHVuc3Vic2NyaWJlcyBmcm9tIHRoZSBPYnNlcnZhYmxlIG9yIHNvdXJjZSBPYnNlcnZhYmxlIGNvbXBsZXRlcyBvciBlcnJvcnMgYnkgaXRzZWxmLFxuICogdGhlIGB1bnN1YnNjcmliZWAgbWV0aG9kIG9uIHJlc291cmNlIG9iamVjdCB3aWxsIGJlIGNhbGxlZC4gVGhpcyBjYW4gYmUgdXNlZCB0byBkbyBhbnkgbmVjZXNzYXJ5IGNsZWFuIHVwLCB3aGljaFxuICogb3RoZXJ3aXNlIHdvdWxkIGhhdmUgdG8gYmUgaGFuZGxlZCBieSBoYW5kLiBOb3RlIHRoYXQgY29tcGxldGUgb3IgZXJyb3Igbm90aWZpY2F0aW9ucyBhcmUgbm90IGVtaXR0ZWQgd2hlbiBzb21lb25lXG4gKiBjYW5jZWxzIHN1YnNjcmlwdGlvbiB0byBhbiBPYnNlcnZhYmxlIHZpYSBgdW5zdWJzY3JpYmVgLCBzbyBgdXNpbmdgIGNhbiBiZSB1c2VkIGFzIGEgaG9vaywgYWxsb3dpbmcgeW91IHRvIG1ha2VcbiAqIHN1cmUgdGhhdCBhbGwgcmVzb3VyY2VzIHdoaWNoIG5lZWQgdG8gZXhpc3QgZHVyaW5nIGFuIE9ic2VydmFibGUgZXhlY3V0aW9uIHdpbGwgYmUgZGlzcG9zZWQgYXQgYXBwcm9wcmlhdGUgdGltZS5cbiAqXG4gKiBAc2VlIHtAbGluayBkZWZlcn1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IElTdWJzY3JpcHRpb259IHJlc291cmNlRmFjdG9yeSBBIGZ1bmN0aW9uIHdoaWNoIGNyZWF0ZXMgYW55IHJlc291cmNlIG9iamVjdFxuICogdGhhdCBpbXBsZW1lbnRzIGB1bnN1YnNjcmliZWAgbWV0aG9kLlxuICogQHBhcmFtIHtmdW5jdGlvbihyZXNvdXJjZTogSVN1YnNjcmlwdGlvbik6IE9ic2VydmFibGU8VD59IG9ic2VydmFibGVGYWN0b3J5IEEgZnVuY3Rpb24gd2hpY2hcbiAqIGNyZWF0ZXMgYW4gT2JzZXJ2YWJsZSwgdGhhdCBjYW4gdXNlIGluamVjdGVkIHJlc291cmNlIG9iamVjdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBiZWhhdmVzIHRoZSBzYW1lIGFzIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgYG9ic2VydmFibGVGYWN0b3J5YCwgYnV0XG4gKiB3aGljaCAtIHdoZW4gY29tcGxldGVkLCBlcnJvcmVkIG9yIHVuc3Vic2NyaWJlZCAtIHdpbGwgYWxzbyBjYWxsIGB1bnN1YnNjcmliZWAgb24gY3JlYXRlZCByZXNvdXJjZSBvYmplY3QuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB1c2luZzxUPihyZXNvdXJjZUZhY3Rvcnk6ICgpID0+IFVuc3Vic2NyaWJhYmxlIHwgdm9pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICBvYnNlcnZhYmxlRmFjdG9yeTogKHJlc291cmNlOiBVbnN1YnNjcmliYWJsZSB8IHZvaWQpID0+IE9ic2VydmFibGVJbnB1dDxUPiB8IHZvaWQpOiBPYnNlcnZhYmxlPFQ+IHtcbiAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgIGxldCByZXNvdXJjZTogVW5zdWJzY3JpYmFibGUgfCB2b2lkO1xuXG4gICAgdHJ5IHtcbiAgICAgIHJlc291cmNlID0gcmVzb3VyY2VGYWN0b3J5KCk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGxldCByZXN1bHQ6IE9ic2VydmFibGVJbnB1dDxUPiB8IHZvaWQ7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IG9ic2VydmFibGVGYWN0b3J5KHJlc291cmNlKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3Qgc291cmNlID0gcmVzdWx0ID8gZnJvbShyZXN1bHQpIDogRU1QVFk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICBpZiAocmVzb3VyY2UpIHtcbiAgICAgICAgcmVzb3VyY2UudW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KTtcbn1cbiJdfQ==