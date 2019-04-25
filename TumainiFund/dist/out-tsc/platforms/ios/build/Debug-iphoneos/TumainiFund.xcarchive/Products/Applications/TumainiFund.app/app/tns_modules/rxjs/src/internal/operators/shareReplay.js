import { ReplaySubject } from '../ReplaySubject';
/**
 * Share source and replay specified number of emissions on subscription.
 *
 * This operator is a specialization of `replay` that connects to a source observable
 * and multicasts through a `ReplaySubject` constructed with the specified arguments.
 * A successfully completed source will stay cached in the `shareReplayed observable` forever,
 * but an errored source can be retried.
 *
 * ## Why use shareReplay?
 * You generally want to use `shareReplay` when you have side-effects or taxing computations
 * that you do not wish to be executed amongst multiple subscribers.
 * It may also be valuable in situations where you know you will have late subscribers to
 * a stream that need access to previously emitted values.
 * This ability to replay values on subscription is what differentiates {@link share} and `shareReplay`.
 *
 * ![](shareReplay.png)
 *
 * ## Example
 * ```javascript
 * const obs$ = interval(1000);
 * const subscription = obs$.pipe(
 *   take(4),
 *   shareReplay(3)
 * );
 * subscription.subscribe(x => console.log('source A: ', x));
 * subscription.subscribe(y => console.log('source B: ', y));
 *
 * ```
 *
 * @see {@link publish}
 * @see {@link share}
 * @see {@link publishReplay}
 *
 * @param {Number} [bufferSize=Number.POSITIVE_INFINITY] Maximum element count of the replay buffer.
 * @param {Number} [windowTime=Number.POSITIVE_INFINITY] Maximum time length of the replay buffer in milliseconds.
 * @param {Scheduler} [scheduler] Scheduler where connected observers within the selector function
 * will be invoked on.
 * @return {Observable} An observable sequence that contains the elements of a sequence produced
 * by multicasting the source sequence within a selector function.
 * @method shareReplay
 * @owner Observable
 */
export function shareReplay(bufferSize = Number.POSITIVE_INFINITY, windowTime = Number.POSITIVE_INFINITY, scheduler) {
    return (source) => source.lift(shareReplayOperator(bufferSize, windowTime, scheduler));
}
function shareReplayOperator(bufferSize, windowTime, scheduler) {
    let subject;
    let refCount = 0;
    let subscription;
    let hasError = false;
    let isComplete = false;
    return function shareReplayOperation(source) {
        refCount++;
        if (!subject || hasError) {
            hasError = false;
            subject = new ReplaySubject(bufferSize, windowTime, scheduler);
            subscription = source.subscribe({
                next(value) { subject.next(value); },
                error(err) {
                    hasError = true;
                    subject.error(err);
                },
                complete() {
                    isComplete = true;
                    subject.complete();
                },
            });
        }
        const innerSub = subject.subscribe(this);
        return () => {
            refCount--;
            innerSub.unsubscribe();
            if (subscription && refCount === 0 && isComplete) {
                subscription.unsubscribe();
            }
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVSZXBsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2hhcmVSZXBsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBS2pEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXlDRztBQUNILE1BQU0sVUFBVSxXQUFXLENBQ3pCLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUIsRUFDN0MsYUFBcUIsTUFBTSxDQUFDLGlCQUFpQixFQUM3QyxTQUF5QjtJQUV6QixPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDeEcsQ0FBQztBQUVELFNBQVMsbUJBQW1CLENBQUksVUFBbUIsRUFBRSxVQUFtQixFQUFFLFNBQXlCO0lBQ2pHLElBQUksT0FBeUIsQ0FBQztJQUM5QixJQUFJLFFBQVEsR0FBRyxDQUFDLENBQUM7SUFDakIsSUFBSSxZQUEwQixDQUFDO0lBQy9CLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQztJQUNyQixJQUFJLFVBQVUsR0FBRyxLQUFLLENBQUM7SUFFdkIsT0FBTyxTQUFTLG9CQUFvQixDQUFzQixNQUFxQjtRQUM3RSxRQUFRLEVBQUUsQ0FBQztRQUNYLElBQUksQ0FBQyxPQUFPLElBQUksUUFBUSxFQUFFO1lBQ3hCLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDakIsT0FBTyxHQUFHLElBQUksYUFBYSxDQUFJLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEUsWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQzlCLElBQUksQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLEtBQUssQ0FBQyxHQUFHO29CQUNQLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsUUFBUTtvQkFDTixVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUNsQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtRQUVELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsT0FBTyxHQUFHLEVBQUU7WUFDVixRQUFRLEVBQUUsQ0FBQztZQUNYLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUN2QixJQUFJLFlBQVksSUFBSSxRQUFRLEtBQUssQ0FBQyxJQUFJLFVBQVUsRUFBRTtnQkFDaEQsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDO2FBQzVCO1FBQ0gsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0FBQ0osQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IFJlcGxheVN1YmplY3QgfSBmcm9tICcuLi9SZXBsYXlTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogU2hhcmUgc291cmNlIGFuZCByZXBsYXkgc3BlY2lmaWVkIG51bWJlciBvZiBlbWlzc2lvbnMgb24gc3Vic2NyaXB0aW9uLlxuICpcbiAqIFRoaXMgb3BlcmF0b3IgaXMgYSBzcGVjaWFsaXphdGlvbiBvZiBgcmVwbGF5YCB0aGF0IGNvbm5lY3RzIHRvIGEgc291cmNlIG9ic2VydmFibGVcbiAqIGFuZCBtdWx0aWNhc3RzIHRocm91Z2ggYSBgUmVwbGF5U3ViamVjdGAgY29uc3RydWN0ZWQgd2l0aCB0aGUgc3BlY2lmaWVkIGFyZ3VtZW50cy5cbiAqIEEgc3VjY2Vzc2Z1bGx5IGNvbXBsZXRlZCBzb3VyY2Ugd2lsbCBzdGF5IGNhY2hlZCBpbiB0aGUgYHNoYXJlUmVwbGF5ZWQgb2JzZXJ2YWJsZWAgZm9yZXZlcixcbiAqIGJ1dCBhbiBlcnJvcmVkIHNvdXJjZSBjYW4gYmUgcmV0cmllZC5cbiAqXG4gKiAjIyBXaHkgdXNlIHNoYXJlUmVwbGF5P1xuICogWW91IGdlbmVyYWxseSB3YW50IHRvIHVzZSBgc2hhcmVSZXBsYXlgIHdoZW4geW91IGhhdmUgc2lkZS1lZmZlY3RzIG9yIHRheGluZyBjb21wdXRhdGlvbnNcbiAqIHRoYXQgeW91IGRvIG5vdCB3aXNoIHRvIGJlIGV4ZWN1dGVkIGFtb25nc3QgbXVsdGlwbGUgc3Vic2NyaWJlcnMuXG4gKiBJdCBtYXkgYWxzbyBiZSB2YWx1YWJsZSBpbiBzaXR1YXRpb25zIHdoZXJlIHlvdSBrbm93IHlvdSB3aWxsIGhhdmUgbGF0ZSBzdWJzY3JpYmVycyB0b1xuICogYSBzdHJlYW0gdGhhdCBuZWVkIGFjY2VzcyB0byBwcmV2aW91c2x5IGVtaXR0ZWQgdmFsdWVzLlxuICogVGhpcyBhYmlsaXR5IHRvIHJlcGxheSB2YWx1ZXMgb24gc3Vic2NyaXB0aW9uIGlzIHdoYXQgZGlmZmVyZW50aWF0ZXMge0BsaW5rIHNoYXJlfSBhbmQgYHNoYXJlUmVwbGF5YC5cbiAqXG4gKiAhW10oc2hhcmVSZXBsYXkucG5nKVxuICpcbiAqICMjIEV4YW1wbGVcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IG9icyQgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG9icyQucGlwZShcbiAqICAgdGFrZSg0KSxcbiAqICAgc2hhcmVSZXBsYXkoMylcbiAqICk7XG4gKiBzdWJzY3JpcHRpb24uc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coJ3NvdXJjZSBBOiAnLCB4KSk7XG4gKiBzdWJzY3JpcHRpb24uc3Vic2NyaWJlKHkgPT4gY29uc29sZS5sb2coJ3NvdXJjZSBCOiAnLCB5KSk7XG4gKlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgcHVibGlzaH1cbiAqIEBzZWUge0BsaW5rIHNoYXJlfVxuICogQHNlZSB7QGxpbmsgcHVibGlzaFJlcGxheX1cbiAqXG4gKiBAcGFyYW0ge051bWJlcn0gW2J1ZmZlclNpemU9TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXSBNYXhpbXVtIGVsZW1lbnQgY291bnQgb2YgdGhlIHJlcGxheSBidWZmZXIuXG4gKiBAcGFyYW0ge051bWJlcn0gW3dpbmRvd1RpbWU9TnVtYmVyLlBPU0lUSVZFX0lORklOSVRZXSBNYXhpbXVtIHRpbWUgbGVuZ3RoIG9mIHRoZSByZXBsYXkgYnVmZmVyIGluIG1pbGxpc2Vjb25kcy5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyfSBbc2NoZWR1bGVyXSBTY2hlZHVsZXIgd2hlcmUgY29ubmVjdGVkIG9ic2VydmVycyB3aXRoaW4gdGhlIHNlbGVjdG9yIGZ1bmN0aW9uXG4gKiB3aWxsIGJlIGludm9rZWQgb24uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBvYnNlcnZhYmxlIHNlcXVlbmNlIHRoYXQgY29udGFpbnMgdGhlIGVsZW1lbnRzIG9mIGEgc2VxdWVuY2UgcHJvZHVjZWRcbiAqIGJ5IG11bHRpY2FzdGluZyB0aGUgc291cmNlIHNlcXVlbmNlIHdpdGhpbiBhIHNlbGVjdG9yIGZ1bmN0aW9uLlxuICogQG1ldGhvZCBzaGFyZVJlcGxheVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNoYXJlUmVwbGF5PFQ+KFxuICBidWZmZXJTaXplOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIHdpbmRvd1RpbWU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZVxuKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KHNoYXJlUmVwbGF5T3BlcmF0b3IoYnVmZmVyU2l6ZSwgd2luZG93VGltZSwgc2NoZWR1bGVyKSk7XG59XG5cbmZ1bmN0aW9uIHNoYXJlUmVwbGF5T3BlcmF0b3I8VD4oYnVmZmVyU2l6ZT86IG51bWJlciwgd2luZG93VGltZT86IG51bWJlciwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSkge1xuICBsZXQgc3ViamVjdDogUmVwbGF5U3ViamVjdDxUPjtcbiAgbGV0IHJlZkNvdW50ID0gMDtcbiAgbGV0IHN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xuICBsZXQgaGFzRXJyb3IgPSBmYWxzZTtcbiAgbGV0IGlzQ29tcGxldGUgPSBmYWxzZTtcblxuICByZXR1cm4gZnVuY3Rpb24gc2hhcmVSZXBsYXlPcGVyYXRpb24odGhpczogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmVmQ291bnQrKztcbiAgICBpZiAoIXN1YmplY3QgfHwgaGFzRXJyb3IpIHtcbiAgICAgIGhhc0Vycm9yID0gZmFsc2U7XG4gICAgICBzdWJqZWN0ID0gbmV3IFJlcGxheVN1YmplY3Q8VD4oYnVmZmVyU2l6ZSwgd2luZG93VGltZSwgc2NoZWR1bGVyKTtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHNvdXJjZS5zdWJzY3JpYmUoe1xuICAgICAgICBuZXh0KHZhbHVlKSB7IHN1YmplY3QubmV4dCh2YWx1ZSk7IH0sXG4gICAgICAgIGVycm9yKGVycikge1xuICAgICAgICAgIGhhc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgIH0sXG4gICAgICAgIGNvbXBsZXRlKCkge1xuICAgICAgICAgIGlzQ29tcGxldGUgPSB0cnVlO1xuICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgfSxcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGNvbnN0IGlubmVyU3ViID0gc3ViamVjdC5zdWJzY3JpYmUodGhpcyk7XG5cbiAgICByZXR1cm4gKCkgPT4ge1xuICAgICAgcmVmQ291bnQtLTtcbiAgICAgIGlubmVyU3ViLnVuc3Vic2NyaWJlKCk7XG4gICAgICBpZiAoc3Vic2NyaXB0aW9uICYmIHJlZkNvdW50ID09PSAwICYmIGlzQ29tcGxldGUpIHtcbiAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cbiJdfQ==