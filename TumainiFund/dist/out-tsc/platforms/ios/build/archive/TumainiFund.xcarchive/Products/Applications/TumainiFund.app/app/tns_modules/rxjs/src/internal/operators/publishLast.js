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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHVibGlzaExhc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9wdWJsaXNoTGFzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGdEQUErQztBQUMvQyx5Q0FBd0M7QUFJeEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcURHO0FBRUgsU0FBZ0IsV0FBVztJQUN6QixPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLHFCQUFTLENBQUMsSUFBSSwyQkFBWSxFQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBeEMsQ0FBd0MsQ0FBQztBQUM3RSxDQUFDO0FBRkQsa0NBRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuLi9Bc3luY1N1YmplY3QnO1xuaW1wb3J0IHsgbXVsdGljYXN0IH0gZnJvbSAnLi9tdWx0aWNhc3QnO1xuaW1wb3J0IHsgQ29ubmVjdGFibGVPYnNlcnZhYmxlIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9Db25uZWN0YWJsZU9ic2VydmFibGUnO1xuaW1wb3J0IHsgVW5hcnlGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGEgY29ubmVjdGFibGUgb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IHNoYXJlcyBhIHNpbmdsZSBzdWJzY3JpcHRpb24gdG8gdGhlXG4gKiB1bmRlcmx5aW5nIHNlcXVlbmNlIGNvbnRhaW5pbmcgb25seSB0aGUgbGFzdCBub3RpZmljYXRpb24uXG4gKlxuICogIVtdKHB1Ymxpc2hMYXN0LnBuZylcbiAqXG4gKiBTaW1pbGFyIHRvIHtAbGluayBwdWJsaXNofSwgYnV0IGl0IHdhaXRzIHVudGlsIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMgYW5kIHN0b3Jlc1xuICogdGhlIGxhc3QgZW1pdHRlZCB2YWx1ZS5cbiAqIFNpbWlsYXJseSB0byB7QGxpbmsgcHVibGlzaFJlcGxheX0gYW5kIHtAbGluayBwdWJsaXNoQmVoYXZpb3J9LCB0aGlzIGtlZXBzIHN0b3JpbmcgdGhlIGxhc3RcbiAqIHZhbHVlIGV2ZW4gaWYgaXQgaGFzIG5vIG1vcmUgc3Vic2NyaWJlcnMuIElmIHN1YnNlcXVlbnQgc3Vic2NyaXB0aW9ucyBoYXBwZW4sIHRoZXkgd2lsbFxuICogaW1tZWRpYXRlbHkgZ2V0IHRoYXQgbGFzdCBzdG9yZWQgdmFsdWUgYW5kIGNvbXBsZXRlLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqXG4gKiBgYGBqc1xuICogY29uc3QgY29ubmVjdGFibGUgPVxuICogICBpbnRlcnZhbCgxMDAwKVxuICogICAgIC5waXBlKFxuICogICAgICAgdGFwKHggPT4gY29uc29sZS5sb2coXCJzaWRlIGVmZmVjdFwiLCB4KSksXG4gKiAgICAgICB0YWtlKDMpLFxuICogICAgICAgcHVibGlzaExhc3QoKSk7XG4gKlxuICogY29ubmVjdGFibGUuc3Vic2NyaWJlKFxuICogICB4ID0+IGNvbnNvbGUubG9nKCAgXCJTdWIuIEFcIiwgeCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZyhcIlN1Yi4gQSBFcnJvclwiLCBlcnIpLFxuICogICAoKSA9PiBjb25zb2xlLmxvZyggXCJTdWIuIEEgQ29tcGxldGVcIikpO1xuICpcbiAqIGNvbm5lY3RhYmxlLnN1YnNjcmliZShcbiAqICAgeCA9PiBjb25zb2xlLmxvZyggIFwiU3ViLiBCXCIsIHgpLFxuICogICBlcnIgPT4gY29uc29sZS5sb2coXCJTdWIuIEIgRXJyb3JcIiwgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coIFwiU3ViLiBCIENvbXBsZXRlXCIpKTtcbiAqXG4gKiBjb25uZWN0YWJsZS5jb25uZWN0KCk7XG4gKlxuICogLy8gUmVzdWx0czpcbiAqIC8vICAgIFwic2lkZSBlZmZlY3QgMFwiXG4gKiAvLyAgICBcInNpZGUgZWZmZWN0IDFcIlxuICogLy8gICAgXCJzaWRlIGVmZmVjdCAyXCJcbiAqIC8vICAgIFwiU3ViLiBBIDJcIlxuICogLy8gICAgXCJTdWIuIEIgMlwiXG4gKiAvLyAgICBcIlN1Yi4gQSBDb21wbGV0ZVwiXG4gKiAvLyAgICBcIlN1Yi4gQiBDb21wbGV0ZVwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBDb25uZWN0YWJsZU9ic2VydmFibGV9XG4gKiBAc2VlIHtAbGluayBwdWJsaXNofVxuICogQHNlZSB7QGxpbmsgcHVibGlzaFJlcGxheX1cbiAqIEBzZWUge0BsaW5rIHB1Ymxpc2hCZWhhdmlvcn1cbiAqXG4gKiBAcmV0dXJuIHtDb25uZWN0YWJsZU9ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYVxuICogc2VxdWVuY2UgcHJvZHVjZWQgYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2UuXG4gKiBAbWV0aG9kIHB1Ymxpc2hMYXN0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5cbmV4cG9ydCBmdW5jdGlvbiBwdWJsaXNoTGFzdDxUPigpOiBVbmFyeUZ1bmN0aW9uPE9ic2VydmFibGU8VD4sIENvbm5lY3RhYmxlT2JzZXJ2YWJsZTxUPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gbXVsdGljYXN0KG5ldyBBc3luY1N1YmplY3Q8VD4oKSkoc291cmNlKTtcbn1cbiJdfQ==