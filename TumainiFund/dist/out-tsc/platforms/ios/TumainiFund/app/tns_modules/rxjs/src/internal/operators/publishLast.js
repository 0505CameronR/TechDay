import { AsyncSubject } from '../AsyncSubject';
import { multicast } from './multicast';
/**
 * Returns a connectable observable sequence that shares a single subscription to the
 * underlying sequence containing only the last notification.
 *
 * ![](publishLast.png)
 *
 * Similar to {@link publish}, but it waits until the source observable completes and stores
 * the last emitted value.
 * Similarly to {@link publishReplay} and {@link publishBehavior}, this keeps storing the last
 * value even if it has no more subscribers. If subsequent subscriptions happen, they will
 * immediately get that last stored value and complete.
 *
 * ## Example
 *
 * ```javascript
 * import { interval } from 'rxjs';
 * import { publishLast, tap, take } from 'rxjs/operators';
 *
 * const connectable =
 *   interval(1000)
 *     .pipe(
 *       tap(x => console.log("side effect", x)),
 *       take(3),
 *       publishLast());
 *
 * connectable.subscribe(
 *   x => console.log(  "Sub. A", x),
 *   err => console.log("Sub. A Error", err),
 *   () => console.log( "Sub. A Complete"));
 *
 * connectable.subscribe(
 *   x => console.log(  "Sub. B", x),
 *   err => console.log("Sub. B Error", err),
 *   () => console.log( "Sub. B Complete"));
 *
 * connectable.connect();
 *
 * // Results:
 * //    "side effect 0"
 * //    "side effect 1"
 * //    "side effect 2"
 * //    "Sub. A 2"
 * //    "Sub. B 2"
 * //    "Sub. A Complete"
 * //    "Sub. B Complete"
 * ```
 *
 * @see {@link ConnectableObservable}
 * @see {@link publish}
 * @see {@link publishReplay}
 * @see {@link publishBehavior}
 *
 * @return {ConnectableObservable} An observable sequence that contains the elements of a
 * sequence produced by multicasting the source sequence.
 * @method publishLast
 * @owner Observable
 */
export function publishLast() {
    return (source) => multicast(new AsyncSubject())(source);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcHVibGlzaExhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxhQUFhLENBQUM7QUFJeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0RHO0FBRUgsTUFBTSxVQUFVLFdBQVc7SUFDekIsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLFNBQVMsQ0FBQyxJQUFJLFlBQVksRUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDN0UsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBtdWx0aWNhc3QgfSBmcm9tICcuL211bHRpY2FzdCc7XG5pbXBvcnQgeyBDb25uZWN0YWJsZU9ic2VydmFibGUgfSBmcm9tICcuLi9vYnNlcnZhYmxlL0Nvbm5lY3RhYmxlT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBVbmFyeUZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIFJldHVybnMgYSBjb25uZWN0YWJsZSBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgc2hhcmVzIGEgc2luZ2xlIHN1YnNjcmlwdGlvbiB0byB0aGVcbiAqIHVuZGVybHlpbmcgc2VxdWVuY2UgY29udGFpbmluZyBvbmx5IHRoZSBsYXN0IG5vdGlmaWNhdGlvbi5cbiAqXG4gKiAhW10ocHVibGlzaExhc3QucG5nKVxuICpcbiAqIFNpbWlsYXIgdG8ge0BsaW5rIHB1Ymxpc2h9LCBidXQgaXQgd2FpdHMgdW50aWwgdGhlIHNvdXJjZSBvYnNlcnZhYmxlIGNvbXBsZXRlcyBhbmQgc3RvcmVzXG4gKiB0aGUgbGFzdCBlbWl0dGVkIHZhbHVlLlxuICogU2ltaWxhcmx5IHRvIHtAbGluayBwdWJsaXNoUmVwbGF5fSBhbmQge0BsaW5rIHB1Ymxpc2hCZWhhdmlvcn0sIHRoaXMga2VlcHMgc3RvcmluZyB0aGUgbGFzdFxuICogdmFsdWUgZXZlbiBpZiBpdCBoYXMgbm8gbW9yZSBzdWJzY3JpYmVycy4gSWYgc3Vic2VxdWVudCBzdWJzY3JpcHRpb25zIGhhcHBlbiwgdGhleSB3aWxsXG4gKiBpbW1lZGlhdGVseSBnZXQgdGhhdCBsYXN0IHN0b3JlZCB2YWx1ZSBhbmQgY29tcGxldGUuXG4gKlxuICogIyMgRXhhbXBsZVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGludGVydmFsIH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBwdWJsaXNoTGFzdCwgdGFwLCB0YWtlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IGNvbm5lY3RhYmxlID1cbiAqICAgaW50ZXJ2YWwoMTAwMClcbiAqICAgICAucGlwZShcbiAqICAgICAgIHRhcCh4ID0+IGNvbnNvbGUubG9nKFwic2lkZSBlZmZlY3RcIiwgeCkpLFxuICogICAgICAgdGFrZSgzKSxcbiAqICAgICAgIHB1Ymxpc2hMYXN0KCkpO1xuICpcbiAqIGNvbm5lY3RhYmxlLnN1YnNjcmliZShcbiAqICAgeCA9PiBjb25zb2xlLmxvZyggIFwiU3ViLiBBXCIsIHgpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coXCJTdWIuIEEgRXJyb3JcIiwgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coIFwiU3ViLiBBIENvbXBsZXRlXCIpKTtcbiAqXG4gKiBjb25uZWN0YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHggPT4gY29uc29sZS5sb2coICBcIlN1Yi4gQlwiLCB4KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKFwiU3ViLiBCIEVycm9yXCIsIGVyciksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCBcIlN1Yi4gQiBDb21wbGV0ZVwiKSk7XG4gKlxuICogY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICpcbiAqIC8vIFJlc3VsdHM6XG4gKiAvLyAgICBcInNpZGUgZWZmZWN0IDBcIlxuICogLy8gICAgXCJzaWRlIGVmZmVjdCAxXCJcbiAqIC8vICAgIFwic2lkZSBlZmZlY3QgMlwiXG4gKiAvLyAgICBcIlN1Yi4gQSAyXCJcbiAqIC8vICAgIFwiU3ViLiBCIDJcIlxuICogLy8gICAgXCJTdWIuIEEgQ29tcGxldGVcIlxuICogLy8gICAgXCJTdWIuIEIgQ29tcGxldGVcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgQ29ubmVjdGFibGVPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgcHVibGlzaH1cbiAqIEBzZWUge0BsaW5rIHB1Ymxpc2hSZXBsYXl9XG4gKiBAc2VlIHtAbGluayBwdWJsaXNoQmVoYXZpb3J9XG4gKlxuICogQHJldHVybiB7Q29ubmVjdGFibGVPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGFcbiAqIHNlcXVlbmNlIHByb2R1Y2VkIGJ5IG11bHRpY2FzdGluZyB0aGUgc291cmNlIHNlcXVlbmNlLlxuICogQG1ldGhvZCBwdWJsaXNoTGFzdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaExhc3Q8VD4oKTogVW5hcnlGdW5jdGlvbjxPYnNlcnZhYmxlPFQ+LCBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IG11bHRpY2FzdChuZXcgQXN5bmNTdWJqZWN0PFQ+KCkpKHNvdXJjZSk7XG59XG4iXX0=