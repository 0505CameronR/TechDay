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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhcmVSZXBsYXkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvc2hhcmVSZXBsYXkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxrREFBaUQ7QUFLakQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBQ0gsU0FBZ0IsV0FBVyxDQUN6QixVQUE2QyxFQUM3QyxVQUE2QyxFQUM3QyxTQUF5QjtJQUZ6QiwyQkFBQSxFQUFBLGFBQXFCLE1BQU0sQ0FBQyxpQkFBaUI7SUFDN0MsMkJBQUEsRUFBQSxhQUFxQixNQUFNLENBQUMsaUJBQWlCO0lBRzdDLE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsTUFBTSxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxVQUFVLEVBQUUsVUFBVSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQW5FLENBQW1FLENBQUM7QUFDeEcsQ0FBQztBQU5ELGtDQU1DO0FBRUQsU0FBUyxtQkFBbUIsQ0FBSSxVQUFtQixFQUFFLFVBQW1CLEVBQUUsU0FBeUI7SUFDakcsSUFBSSxPQUF5QixDQUFDO0lBQzlCLElBQUksUUFBUSxHQUFHLENBQUMsQ0FBQztJQUNqQixJQUFJLFlBQTBCLENBQUM7SUFDL0IsSUFBSSxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLElBQUksVUFBVSxHQUFHLEtBQUssQ0FBQztJQUV2QixPQUFPLFNBQVMsb0JBQW9CLENBQXNCLE1BQXFCO1FBQzdFLFFBQVEsRUFBRSxDQUFDO1FBQ1gsSUFBSSxDQUFDLE9BQU8sSUFBSSxRQUFRLEVBQUU7WUFDeEIsUUFBUSxHQUFHLEtBQUssQ0FBQztZQUNqQixPQUFPLEdBQUcsSUFBSSw2QkFBYSxDQUFJLFVBQVUsRUFBRSxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDbEUsWUFBWSxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQzlCLElBQUksWUFBQyxLQUFLLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3BDLEtBQUssWUFBQyxHQUFHO29CQUNQLFFBQVEsR0FBRyxJQUFJLENBQUM7b0JBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7Z0JBQ0QsUUFBUTtvQkFDTixVQUFVLEdBQUcsSUFBSSxDQUFDO29CQUNsQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBQ3JCLENBQUM7YUFDRixDQUFDLENBQUM7U0FDSjtRQUVELElBQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFekMsT0FBTztZQUNMLFFBQVEsRUFBRSxDQUFDO1lBQ1gsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ3ZCLElBQUksWUFBWSxJQUFJLFFBQVEsS0FBSyxDQUFDLElBQUksVUFBVSxFQUFFO2dCQUNoRCxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUM7YUFDNUI7UUFDSCxDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCB9IGZyb20gJy4uL1JlcGxheVN1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcblxuLyoqXG4gKiBTaGFyZSBzb3VyY2UgYW5kIHJlcGxheSBzcGVjaWZpZWQgbnVtYmVyIG9mIGVtaXNzaW9ucyBvbiBzdWJzY3JpcHRpb24uXG4gKlxuICogVGhpcyBvcGVyYXRvciBpcyBhIHNwZWNpYWxpemF0aW9uIG9mIGByZXBsYXlgIHRoYXQgY29ubmVjdHMgdG8gYSBzb3VyY2Ugb2JzZXJ2YWJsZVxuICogYW5kIG11bHRpY2FzdHMgdGhyb3VnaCBhIGBSZXBsYXlTdWJqZWN0YCBjb25zdHJ1Y3RlZCB3aXRoIHRoZSBzcGVjaWZpZWQgYXJndW1lbnRzLlxuICogQSBzdWNjZXNzZnVsbHkgY29tcGxldGVkIHNvdXJjZSB3aWxsIHN0YXkgY2FjaGVkIGluIHRoZSBgc2hhcmVSZXBsYXllZCBvYnNlcnZhYmxlYCBmb3JldmVyLFxuICogYnV0IGFuIGVycm9yZWQgc291cmNlIGNhbiBiZSByZXRyaWVkLlxuICpcbiAqICMjIFdoeSB1c2Ugc2hhcmVSZXBsYXk/XG4gKiBZb3UgZ2VuZXJhbGx5IHdhbnQgdG8gdXNlIGBzaGFyZVJlcGxheWAgd2hlbiB5b3UgaGF2ZSBzaWRlLWVmZmVjdHMgb3IgdGF4aW5nIGNvbXB1dGF0aW9uc1xuICogdGhhdCB5b3UgZG8gbm90IHdpc2ggdG8gYmUgZXhlY3V0ZWQgYW1vbmdzdCBtdWx0aXBsZSBzdWJzY3JpYmVycy5cbiAqIEl0IG1heSBhbHNvIGJlIHZhbHVhYmxlIGluIHNpdHVhdGlvbnMgd2hlcmUgeW91IGtub3cgeW91IHdpbGwgaGF2ZSBsYXRlIHN1YnNjcmliZXJzIHRvXG4gKiBhIHN0cmVhbSB0aGF0IG5lZWQgYWNjZXNzIHRvIHByZXZpb3VzbHkgZW1pdHRlZCB2YWx1ZXMuXG4gKiBUaGlzIGFiaWxpdHkgdG8gcmVwbGF5IHZhbHVlcyBvbiBzdWJzY3JpcHRpb24gaXMgd2hhdCBkaWZmZXJlbnRpYXRlcyB7QGxpbmsgc2hhcmV9IGFuZCBgc2hhcmVSZXBsYXlgLlxuICpcbiAqICFbXShzaGFyZVJlcGxheS5wbmcpXG4gKlxuICogIyMgRXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3Qgb2JzJCA9IGludGVydmFsKDEwMDApO1xuICogY29uc3Qgc3Vic2NyaXB0aW9uID0gb2JzJC5waXBlKFxuICogICB0YWtlKDQpLFxuICogICBzaGFyZVJlcGxheSgzKVxuICogKTtcbiAqIHN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZygnc291cmNlIEE6ICcsIHgpKTtcbiAqIHN1YnNjcmlwdGlvbi5zdWJzY3JpYmUoeSA9PiBjb25zb2xlLmxvZygnc291cmNlIEI6ICcsIHkpKTtcbiAqXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBwdWJsaXNofVxuICogQHNlZSB7QGxpbmsgc2hhcmV9XG4gKiBAc2VlIHtAbGluayBwdWJsaXNoUmVwbGF5fVxuICpcbiAqIEBwYXJhbSB7TnVtYmVyfSBbYnVmZmVyU2l6ZT1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gZWxlbWVudCBjb3VudCBvZiB0aGUgcmVwbGF5IGJ1ZmZlci5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbd2luZG93VGltZT1OdW1iZXIuUE9TSVRJVkVfSU5GSU5JVFldIE1heGltdW0gdGltZSBsZW5ndGggb2YgdGhlIHJlcGxheSBidWZmZXIgaW4gbWlsbGlzZWNvbmRzLlxuICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIFNjaGVkdWxlciB3aGVyZSBjb25uZWN0ZWQgb2JzZXJ2ZXJzIHdpdGhpbiB0aGUgc2VsZWN0b3IgZnVuY3Rpb25cbiAqIHdpbGwgYmUgaW52b2tlZCBvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIG9ic2VydmFibGUgc2VxdWVuY2UgdGhhdCBjb250YWlucyB0aGUgZWxlbWVudHMgb2YgYSBzZXF1ZW5jZSBwcm9kdWNlZFxuICogYnkgbXVsdGljYXN0aW5nIHRoZSBzb3VyY2Ugc2VxdWVuY2Ugd2l0aGluIGEgc2VsZWN0b3IgZnVuY3Rpb24uXG4gKiBAbWV0aG9kIHNoYXJlUmVwbGF5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2hhcmVSZXBsYXk8VD4oXG4gIGJ1ZmZlclNpemU6IG51bWJlciA9IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSxcbiAgd2luZG93VGltZTogbnVtYmVyID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZLFxuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlXG4pOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQoc2hhcmVSZXBsYXlPcGVyYXRvcihidWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzY2hlZHVsZXIpKTtcbn1cblxuZnVuY3Rpb24gc2hhcmVSZXBsYXlPcGVyYXRvcjxUPihidWZmZXJTaXplPzogbnVtYmVyLCB3aW5kb3dUaW1lPzogbnVtYmVyLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKSB7XG4gIGxldCBzdWJqZWN0OiBSZXBsYXlTdWJqZWN0PFQ+O1xuICBsZXQgcmVmQ291bnQgPSAwO1xuICBsZXQgc3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XG4gIGxldCBoYXNFcnJvciA9IGZhbHNlO1xuICBsZXQgaXNDb21wbGV0ZSA9IGZhbHNlO1xuXG4gIHJldHVybiBmdW5jdGlvbiBzaGFyZVJlcGxheU9wZXJhdGlvbih0aGlzOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IE9ic2VydmFibGU8VD4pIHtcbiAgICByZWZDb3VudCsrO1xuICAgIGlmICghc3ViamVjdCB8fCBoYXNFcnJvcikge1xuICAgICAgaGFzRXJyb3IgPSBmYWxzZTtcbiAgICAgIHN1YmplY3QgPSBuZXcgUmVwbGF5U3ViamVjdDxUPihidWZmZXJTaXplLCB3aW5kb3dUaW1lLCBzY2hlZHVsZXIpO1xuICAgICAgc3Vic2NyaXB0aW9uID0gc291cmNlLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQodmFsdWUpIHsgc3ViamVjdC5uZXh0KHZhbHVlKTsgfSxcbiAgICAgICAgZXJyb3IoZXJyKSB7XG4gICAgICAgICAgaGFzRXJyb3IgPSB0cnVlO1xuICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgfSxcbiAgICAgICAgY29tcGxldGUoKSB7XG4gICAgICAgICAgaXNDb21wbGV0ZSA9IHRydWU7XG4gICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgY29uc3QgaW5uZXJTdWIgPSBzdWJqZWN0LnN1YnNjcmliZSh0aGlzKTtcblxuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICByZWZDb3VudC0tO1xuICAgICAgaW5uZXJTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgIGlmIChzdWJzY3JpcHRpb24gJiYgcmVmQ291bnQgPT09IDAgJiYgaXNDb21wbGV0ZSkge1xuICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9O1xufVxuIl19