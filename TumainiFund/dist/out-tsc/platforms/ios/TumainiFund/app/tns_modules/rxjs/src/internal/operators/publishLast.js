"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AsyncSubject_1 = require("../AsyncSubject");
var multicast_1 = require("./multicast");
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
 * ```js
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
function publishLast() {
    return function (source) { return multicast_1.multicast(new AsyncSubject_1.AsyncSubject())(source); };
}
exports.publishLast = publishLast;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvcHVibGlzaExhc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxnREFBK0M7QUFDL0MseUNBQXdDO0FBSXhDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFERztBQUVILFNBQWdCLFdBQVc7SUFDekIsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxxQkFBUyxDQUFDLElBQUksMkJBQVksRUFBSyxDQUFDLENBQUMsTUFBTSxDQUFDLEVBQXhDLENBQXdDLENBQUM7QUFDN0UsQ0FBQztBQUZELGtDQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IG11bHRpY2FzdCB9IGZyb20gJy4vbXVsdGljYXN0JztcbmltcG9ydCB7IENvbm5lY3RhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4uL29ic2VydmFibGUvQ29ubmVjdGFibGVPYnNlcnZhYmxlJztcbmltcG9ydCB7IFVuYXJ5RnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhIGNvbm5lY3RhYmxlIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBzaGFyZXMgYSBzaW5nbGUgc3Vic2NyaXB0aW9uIHRvIHRoZVxuICogdW5kZXJseWluZyBzZXF1ZW5jZSBjb250YWluaW5nIG9ubHkgdGhlIGxhc3Qgbm90aWZpY2F0aW9uLlxuICpcbiAqICFbXShwdWJsaXNoTGFzdC5wbmcpXG4gKlxuICogU2ltaWxhciB0byB7QGxpbmsgcHVibGlzaH0sIGJ1dCBpdCB3YWl0cyB1bnRpbCB0aGUgc291cmNlIG9ic2VydmFibGUgY29tcGxldGVzIGFuZCBzdG9yZXNcbiAqIHRoZSBsYXN0IGVtaXR0ZWQgdmFsdWUuXG4gKiBTaW1pbGFybHkgdG8ge0BsaW5rIHB1Ymxpc2hSZXBsYXl9IGFuZCB7QGxpbmsgcHVibGlzaEJlaGF2aW9yfSwgdGhpcyBrZWVwcyBzdG9yaW5nIHRoZSBsYXN0XG4gKiB2YWx1ZSBldmVuIGlmIGl0IGhhcyBubyBtb3JlIHN1YnNjcmliZXJzLiBJZiBzdWJzZXF1ZW50IHN1YnNjcmlwdGlvbnMgaGFwcGVuLCB0aGV5IHdpbGxcbiAqIGltbWVkaWF0ZWx5IGdldCB0aGF0IGxhc3Qgc3RvcmVkIHZhbHVlIGFuZCBjb21wbGV0ZS5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKlxuICogYGBganNcbiAqIGNvbnN0IGNvbm5lY3RhYmxlID1cbiAqICAgaW50ZXJ2YWwoMTAwMClcbiAqICAgICAucGlwZShcbiAqICAgICAgIHRhcCh4ID0+IGNvbnNvbGUubG9nKFwic2lkZSBlZmZlY3RcIiwgeCkpLFxuICogICAgICAgdGFrZSgzKSxcbiAqICAgICAgIHB1Ymxpc2hMYXN0KCkpO1xuICpcbiAqIGNvbm5lY3RhYmxlLnN1YnNjcmliZShcbiAqICAgeCA9PiBjb25zb2xlLmxvZyggIFwiU3ViLiBBXCIsIHgpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coXCJTdWIuIEEgRXJyb3JcIiwgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coIFwiU3ViLiBBIENvbXBsZXRlXCIpKTtcbiAqXG4gKiBjb25uZWN0YWJsZS5zdWJzY3JpYmUoXG4gKiAgIHggPT4gY29uc29sZS5sb2coICBcIlN1Yi4gQlwiLCB4KSxcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKFwiU3ViLiBCIEVycm9yXCIsIGVyciksXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCBcIlN1Yi4gQiBDb21wbGV0ZVwiKSk7XG4gKlxuICogY29ubmVjdGFibGUuY29ubmVjdCgpO1xuICpcbiAqIC8vIFJlc3VsdHM6XG4gKiAvLyAgICBcInNpZGUgZWZmZWN0IDBcIlxuICogLy8gICAgXCJzaWRlIGVmZmVjdCAxXCJcbiAqIC8vICAgIFwic2lkZSBlZmZlY3QgMlwiXG4gKiAvLyAgICBcIlN1Yi4gQSAyXCJcbiAqIC8vICAgIFwiU3ViLiBCIDJcIlxuICogLy8gICAgXCJTdWIuIEEgQ29tcGxldGVcIlxuICogLy8gICAgXCJTdWIuIEIgQ29tcGxldGVcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgQ29ubmVjdGFibGVPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgcHVibGlzaH1cbiAqIEBzZWUge0BsaW5rIHB1Ymxpc2hSZXBsYXl9XG4gKiBAc2VlIHtAbGluayBwdWJsaXNoQmVoYXZpb3J9XG4gKlxuICogQHJldHVybiB7Q29ubmVjdGFibGVPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGFcbiAqIHNlcXVlbmNlIHByb2R1Y2VkIGJ5IG11bHRpY2FzdGluZyB0aGUgc291cmNlIHNlcXVlbmNlLlxuICogQG1ldGhvZCBwdWJsaXNoTGFzdFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcHVibGlzaExhc3Q8VD4oKTogVW5hcnlGdW5jdGlvbjxPYnNlcnZhYmxlPFQ+LCBDb25uZWN0YWJsZU9ic2VydmFibGU8VD4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IG11bHRpY2FzdChuZXcgQXN5bmNTdWJqZWN0PFQ+KCkpKHNvdXJjZSk7XG59XG4iXX0=