"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ReplaySubject_1 = require("../ReplaySubject");
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
function shareReplay(bufferSize, windowTime, scheduler) {
    if (bufferSize === void 0) { bufferSize = Number.POSITIVE_INFINITY; }
    if (windowTime === void 0) { windowTime = Number.POSITIVE_INFINITY; }
    return function (source) { return source.lift(shareReplayOperator(bufferSize, windowTime, scheduler)); };
}
exports.shareReplay = shareReplay;
function shareReplayOperator(bufferSize, windowTime, scheduler) {
    var subject;
    var refCount = 0;
    var subscription;
    var hasError = false;
    var isComplete = false;
    return function shareReplayOperation(source) {
        refCount++;
        if (!subject || hasError) {
            hasError = false;
            subject = new ReplaySubject_1.ReplaySubject(bufferSize, windowTime, scheduler);
            subscription = source.subscribe({
                next: function (value) { subject.next(value); },
                error: function (err) {
                    hasError = true;
                    subject.error(err);
                },
                complete: function () {
                    isComplete = true;
                    subject.complete();
                },
            });
        }
        var innerSub = subject.subscribe(this);
        return function () {
            refCount--;
            innerSub.unsubscribe();
            if (subscription && refCount === 0 && isComplete) {
                subscription.unsubscribe();
            }
        };
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVSZXBsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zaGFyZVJlcGxheS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGtEQUFpRDtBQUtqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F5Q0c7QUFDSCxTQUFnQixXQUFXLENBQ3pCLFVBQTZDLEVBQzdDLFVBQTZDLEVBQzdDLFNBQXlCO0lBRnpCLDJCQUFBLEVBQUEsYUFBcUIsTUFBTSxDQUFDLGlCQUFpQjtJQUM3QywyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7SUFHN0MsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUMsRUFBbkUsQ0FBbUUsQ0FBQztBQUN4RyxDQUFDO0FBTkQsa0NBTUM7QUFFRCxTQUFTLG1CQUFtQixDQUFJLFVBQW1CLEVBQUUsVUFBbUIsRUFBRSxTQUF5QjtJQUNqRyxJQUFJLE9BQXlCLENBQUM7SUFDOUIsSUFBSSxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ2pCLElBQUksWUFBMEIsQ0FBQztJQUMvQixJQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDckIsSUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDO0lBRXZCLE9BQU8sU0FBUyxvQkFBb0IsQ0FBc0IsTUFBcUI7UUFDN0UsUUFBUSxFQUFFLENBQUM7UUFDWCxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsRUFBRTtZQUN4QixRQUFRLEdBQUcsS0FBSyxDQUFDO1lBQ2pCLE9BQU8sR0FBRyxJQUFJLDZCQUFhLENBQUksVUFBVSxFQUFFLFVBQVUsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNsRSxZQUFZLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQztnQkFDOUIsSUFBSSxZQUFDLEtBQUssSUFBSSxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDcEMsS0FBSyxZQUFDLEdBQUc7b0JBQ1AsUUFBUSxHQUFHLElBQUksQ0FBQztvQkFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDckIsQ0FBQztnQkFDRCxRQUFRO29CQUNOLFVBQVUsR0FBRyxJQUFJLENBQUM7b0JBQ2xCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDckIsQ0FBQzthQUNGLENBQUMsQ0FBQztTQUNKO1FBRUQsSUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUV6QyxPQUFPO1lBQ0wsUUFBUSxFQUFFLENBQUM7WUFDWCxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDdkIsSUFBSSxZQUFZLElBQUksUUFBUSxLQUFLLENBQUMsSUFBSSxVQUFVLEVBQUU7Z0JBQ2hELFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQzthQUM1QjtRQUNILENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztBQUNKLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBSZXBsYXlTdWJqZWN0IH0gZnJvbSAnLi4vUmVwbGF5U3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuXG4vKipcbiAqIFNoYXJlIHNvdXJjZSBhbmQgcmVwbGF5IHNwZWNpZmllZCBudW1iZXIgb2YgZW1pc3Npb25zIG9uIHN1YnNjcmlwdGlvbi5cbiAqXG4gKiBUaGlzIG9wZXJhdG9yIGlzIGEgc3BlY2lhbGl6YXRpb24gb2YgYHJlcGxheWAgdGhhdCBjb25uZWN0cyB0byBhIHNvdXJjZSBvYnNlcnZhYmxlXG4gKiBhbmQgbXVsdGljYXN0cyB0aHJvdWdoIGEgYFJlcGxheVN1YmplY3RgIGNvbnN0cnVjdGVkIHdpdGggdGhlIHNwZWNpZmllZCBhcmd1bWVudHMuXG4gKiBBIHN1Y2Nlc3NmdWxseSBjb21wbGV0ZWQgc291cmNlIHdpbGwgc3RheSBjYWNoZWQgaW4gdGhlIGBzaGFyZVJlcGxheWVkIG9ic2VydmFibGVgIGZvcmV2ZXIsXG4gKiBidXQgYW4gZXJyb3JlZCBzb3VyY2UgY2FuIGJlIHJldHJpZWQuXG4gKlxuICogIyMgV2h5IHVzZSBzaGFyZVJlcGxheT9cbiAqIFlvdSBnZW5lcmFsbHkgd2FudCB0byB1c2UgYHNoYXJlUmVwbGF5YCB3aGVuIHlvdSBoYXZlIHNpZGUtZWZmZWN0cyBvciB0YXhpbmcgY29tcHV0YXRpb25zXG4gKiB0aGF0IHlvdSBkbyBub3Qgd2lzaCB0byBiZSBleGVjdXRlZCBhbW9uZ3N0IG11bHRpcGxlIHN1YnNjcmliZXJzLlxuICogSXQgbWF5IGFsc28gYmUgdmFsdWFibGUgaW4gc2l0dWF0aW9ucyB3aGVyZSB5b3Uga25vdyB5b3Ugd2lsbCBoYXZlIGxhdGUgc3Vic2NyaWJlcnMgdG9cbiAqIGEgc3RyZWFtIHRoYXQgbmVlZCBhY2Nlc3MgdG8gcHJldmlvdXNseSBlbWl0dGVkIHZhbHVlcy5cbiAqIFRoaXMgYWJpbGl0eSB0byByZXBsYXkgdmFsdWVzIG9uIHN1YnNjcmlwdGlvbiBpcyB3aGF0IGRpZmZlcmVudGlhdGVzIHtAbGluayBzaGFyZX0gYW5kIGBzaGFyZVJlcGxheWAuXG4gKlxuICogIVtdKHNoYXJlUmVwbGF5LnBuZylcbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBjb25zdCBvYnMkID0gaW50ZXJ2YWwoMTAwMCk7XG4gKiBjb25zdCBzdWJzY3JpcHRpb24gPSBvYnMkLnBpcGUoXG4gKiAgIHRha2UoNCksXG4gKiAgIHNoYXJlUmVwbGF5KDMpXG4gKiApO1xuICogc3Vic2NyaXB0aW9uLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKCdzb3VyY2UgQTogJywgeCkpO1xuICogc3Vic2NyaXB0aW9uLnN1YnNjcmliZSh5ID0+IGNvbnNvbGUubG9nKCdzb3VyY2UgQjogJywgeSkpO1xuICpcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIHB1Ymxpc2h9XG4gKiBAc2VlIHtAbGluayBzaGFyZX1cbiAqIEBzZWUge0BsaW5rIHB1Ymxpc2hSZXBsYXl9XG4gKlxuICogQHBhcmFtIHtOdW1iZXJ9IFtidWZmZXJTaXplPU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSBlbGVtZW50IGNvdW50IG9mIHRoZSByZXBsYXkgYnVmZmVyLlxuICogQHBhcmFtIHtOdW1iZXJ9IFt3aW5kb3dUaW1lPU51bWJlci5QT1NJVElWRV9JTkZJTklUWV0gTWF4aW11bSB0aW1lIGxlbmd0aCBvZiB0aGUgcmVwbGF5IGJ1ZmZlciBpbiBtaWxsaXNlY29uZHMuXG4gKiBAcGFyYW0ge1NjaGVkdWxlcn0gW3NjaGVkdWxlcl0gU2NoZWR1bGVyIHdoZXJlIGNvbm5lY3RlZCBvYnNlcnZlcnMgd2l0aGluIHRoZSBzZWxlY3RvciBmdW5jdGlvblxuICogd2lsbCBiZSBpbnZva2VkIG9uLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSB0aGF0IGNvbnRhaW5zIHRoZSBlbGVtZW50cyBvZiBhIHNlcXVlbmNlIHByb2R1Y2VkXG4gKiBieSBtdWx0aWNhc3RpbmcgdGhlIHNvdXJjZSBzZXF1ZW5jZSB3aXRoaW4gYSBzZWxlY3RvciBmdW5jdGlvbi5cbiAqIEBtZXRob2Qgc2hhcmVSZXBsYXlcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzaGFyZVJlcGxheTxUPihcbiAgYnVmZmVyU2l6ZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICB3aW5kb3dUaW1lOiBudW1iZXIgPSBOdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFksXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2Vcbik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChzaGFyZVJlcGxheU9wZXJhdG9yKGJ1ZmZlclNpemUsIHdpbmRvd1RpbWUsIHNjaGVkdWxlcikpO1xufVxuXG5mdW5jdGlvbiBzaGFyZVJlcGxheU9wZXJhdG9yPFQ+KGJ1ZmZlclNpemU/OiBudW1iZXIsIHdpbmRvd1RpbWU/OiBudW1iZXIsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpIHtcbiAgbGV0IHN1YmplY3Q6IFJlcGxheVN1YmplY3Q8VD47XG4gIGxldCByZWZDb3VudCA9IDA7XG4gIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgbGV0IGhhc0Vycm9yID0gZmFsc2U7XG4gIGxldCBpc0NvbXBsZXRlID0gZmFsc2U7XG5cbiAgcmV0dXJuIGZ1bmN0aW9uIHNoYXJlUmVwbGF5T3BlcmF0aW9uKHRoaXM6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJlZkNvdW50Kys7XG4gICAgaWYgKCFzdWJqZWN0IHx8IGhhc0Vycm9yKSB7XG4gICAgICBoYXNFcnJvciA9IGZhbHNlO1xuICAgICAgc3ViamVjdCA9IG5ldyBSZXBsYXlTdWJqZWN0PFQ+KGJ1ZmZlclNpemUsIHdpbmRvd1RpbWUsIHNjaGVkdWxlcik7XG4gICAgICBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHtcbiAgICAgICAgbmV4dCh2YWx1ZSkgeyBzdWJqZWN0Lm5leHQodmFsdWUpOyB9LFxuICAgICAgICBlcnJvcihlcnIpIHtcbiAgICAgICAgICBoYXNFcnJvciA9IHRydWU7XG4gICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICB9LFxuICAgICAgICBjb21wbGV0ZSgpIHtcbiAgICAgICAgICBpc0NvbXBsZXRlID0gdHJ1ZTtcbiAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgIH0sXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBpbm5lclN1YiA9IHN1YmplY3Quc3Vic2NyaWJlKHRoaXMpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHJlZkNvdW50LS07XG4gICAgICBpbm5lclN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgaWYgKHN1YnNjcmlwdGlvbiAmJiByZWZDb3VudCA9PT0gMCAmJiBpc0NvbXBsZXRlKSB7XG4gICAgICAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgfVxuICAgIH07XG4gIH07XG59XG4iXX0=