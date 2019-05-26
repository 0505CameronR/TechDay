import { OuterSubscriber } from '../OuterSubscriber';
import { subscribeToResult } from '../util/subscribeToResult';
/**
 * Emits the most recently emitted value from the source Observable whenever
 * another Observable, the `notifier`, emits.
 *
 * <span class="informal">It's like {@link sampleTime}, but samples whenever
 * the `notifier` Observable emits something.</span>
 *
 * ![](sample.png)
 *
 * Whenever the `notifier` Observable emits a value or completes, `sample`
 * looks at the source Observable and emits whichever value it has most recently
 * emitted since the previous sampling, unless the source has not emitted
 * anything since the previous sampling. The `notifier` is subscribed to as soon
 * as the output Observable is subscribed.
 *
 * ## Example
 * On every click, sample the most recent "seconds" timer
 * ```javascript
 * import { fromEvent, interval } from 'rxjs';
 * import { sample } from 'rxjs/operators';
 *
 * const seconds = interval(1000);
 * const clicks = fromEvent(document, 'click');
 * const result = seconds.pipe(sample(clicks));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link audit}
 * @see {@link debounce}
 * @see {@link sampleTime}
 * @see {@link throttle}
 *
 * @param {Observable<any>} notifier The Observable to use for sampling the
 * source Observable.
 * @return {Observable<T>} An Observable that emits the results of sampling the
 * values emitted by the source Observable whenever the notifier Observable
 * emits value or completes.
 * @method sample
 * @owner Observable
 */
export function sample(notifier) {
    return (source) => source.lift(new SampleOperator(notifier));
}
class SampleOperator {
    constructor(notifier) {
        this.notifier = notifier;
    }
    call(subscriber, source) {
        const sampleSubscriber = new SampleSubscriber(subscriber);
        const subscription = source.subscribe(sampleSubscriber);
        subscription.add(subscribeToResult(sampleSubscriber, this.notifier));
        return subscription;
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class SampleSubscriber extends OuterSubscriber {
    constructor() {
        super(...arguments);
        this.hasValue = false;
    }
    _next(value) {
        this.value = value;
        this.hasValue = true;
    }
    notifyNext(outerValue, innerValue, outerIndex, innerIndex, innerSub) {
        this.emitValue();
    }
    notifyComplete() {
        this.emitValue();
    }
    emitValue() {
        if (this.hasValue) {
            this.hasValue = false;
            this.destination.next(this.value);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2FtcGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3NhbXBsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHQSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFFckQsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFJOUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVDRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUksUUFBeUI7SUFDakQsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsTUFBTSxjQUFjO0lBQ2xCLFlBQW9CLFFBQXlCO1FBQXpCLGFBQVEsR0FBUixRQUFRLENBQWlCO0lBQzdDLENBQUM7SUFFRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMxRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDeEQsWUFBWSxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztRQUNyRSxPQUFPLFlBQVksQ0FBQztJQUN0QixDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxnQkFBdUIsU0FBUSxlQUFxQjtJQUExRDs7UUFFVSxhQUFRLEdBQVksS0FBSyxDQUFDO0lBdUJwQyxDQUFDO0lBckJXLEtBQUssQ0FBQyxLQUFRO1FBQ3RCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO0lBQ3ZCLENBQUM7SUFFRCxVQUFVLENBQUMsVUFBYSxFQUFFLFVBQWEsRUFDNUIsVUFBa0IsRUFBRSxVQUFrQixFQUN0QyxRQUErQjtRQUN4QyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbkIsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7WUFDdEIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ25DO0lBQ0gsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPdXRlclN1YnNjcmliZXIgfSBmcm9tICcuLi9PdXRlclN1YnNjcmliZXInO1xuaW1wb3J0IHsgSW5uZXJTdWJzY3JpYmVyIH0gZnJvbSAnLi4vSW5uZXJTdWJzY3JpYmVyJztcbmltcG9ydCB7IHN1YnNjcmliZVRvUmVzdWx0IH0gZnJvbSAnLi4vdXRpbC9zdWJzY3JpYmVUb1Jlc3VsdCc7XG5cbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBFbWl0cyB0aGUgbW9zdCByZWNlbnRseSBlbWl0dGVkIHZhbHVlIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHdoZW5ldmVyXG4gKiBhbm90aGVyIE9ic2VydmFibGUsIHRoZSBgbm90aWZpZXJgLCBlbWl0cy5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+SXQncyBsaWtlIHtAbGluayBzYW1wbGVUaW1lfSwgYnV0IHNhbXBsZXMgd2hlbmV2ZXJcbiAqIHRoZSBgbm90aWZpZXJgIE9ic2VydmFibGUgZW1pdHMgc29tZXRoaW5nLjwvc3Bhbj5cbiAqXG4gKiAhW10oc2FtcGxlLnBuZylcbiAqXG4gKiBXaGVuZXZlciB0aGUgYG5vdGlmaWVyYCBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUgb3IgY29tcGxldGVzLCBgc2FtcGxlYFxuICogbG9va3MgYXQgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGFuZCBlbWl0cyB3aGljaGV2ZXIgdmFsdWUgaXQgaGFzIG1vc3QgcmVjZW50bHlcbiAqIGVtaXR0ZWQgc2luY2UgdGhlIHByZXZpb3VzIHNhbXBsaW5nLCB1bmxlc3MgdGhlIHNvdXJjZSBoYXMgbm90IGVtaXR0ZWRcbiAqIGFueXRoaW5nIHNpbmNlIHRoZSBwcmV2aW91cyBzYW1wbGluZy4gVGhlIGBub3RpZmllcmAgaXMgc3Vic2NyaWJlZCB0byBhcyBzb29uXG4gKiBhcyB0aGUgb3V0cHV0IE9ic2VydmFibGUgaXMgc3Vic2NyaWJlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBPbiBldmVyeSBjbGljaywgc2FtcGxlIHRoZSBtb3N0IHJlY2VudCBcInNlY29uZHNcIiB0aW1lclxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50LCBpbnRlcnZhbCB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgc2FtcGxlIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IHNlY29uZHMgPSBpbnRlcnZhbCgxMDAwKTtcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBzZWNvbmRzLnBpcGUoc2FtcGxlKGNsaWNrcykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGF1ZGl0fVxuICogQHNlZSB7QGxpbmsgZGVib3VuY2V9XG4gKiBAc2VlIHtAbGluayBzYW1wbGVUaW1lfVxuICogQHNlZSB7QGxpbmsgdGhyb3R0bGV9XG4gKlxuICogQHBhcmFtIHtPYnNlcnZhYmxlPGFueT59IG5vdGlmaWVyIFRoZSBPYnNlcnZhYmxlIHRvIHVzZSBmb3Igc2FtcGxpbmcgdGhlXG4gKiBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgcmVzdWx0cyBvZiBzYW1wbGluZyB0aGVcbiAqIHZhbHVlcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB3aGVuZXZlciB0aGUgbm90aWZpZXIgT2JzZXJ2YWJsZVxuICogZW1pdHMgdmFsdWUgb3IgY29tcGxldGVzLlxuICogQG1ldGhvZCBzYW1wbGVcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBzYW1wbGU8VD4obm90aWZpZXI6IE9ic2VydmFibGU8YW55Pik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgU2FtcGxlT3BlcmF0b3Iobm90aWZpZXIpKTtcbn1cblxuY2xhc3MgU2FtcGxlT3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUPiB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbm90aWZpZXI6IE9ic2VydmFibGU8YW55Pikge1xuICB9XG5cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIGNvbnN0IHNhbXBsZVN1YnNjcmliZXIgPSBuZXcgU2FtcGxlU3Vic2NyaWJlcihzdWJzY3JpYmVyKTtcbiAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBzb3VyY2Uuc3Vic2NyaWJlKHNhbXBsZVN1YnNjcmliZXIpO1xuICAgIHN1YnNjcmlwdGlvbi5hZGQoc3Vic2NyaWJlVG9SZXN1bHQoc2FtcGxlU3Vic2NyaWJlciwgdGhpcy5ub3RpZmllcikpO1xuICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFNhbXBsZVN1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBPdXRlclN1YnNjcmliZXI8VCwgUj4ge1xuICBwcml2YXRlIHZhbHVlOiBUO1xuICBwcml2YXRlIGhhc1ZhbHVlOiBib29sZWFuID0gZmFsc2U7XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMuaGFzVmFsdWUgPSB0cnVlO1xuICB9XG5cbiAgbm90aWZ5TmV4dChvdXRlclZhbHVlOiBULCBpbm5lclZhbHVlOiBSLFxuICAgICAgICAgICAgIG91dGVySW5kZXg6IG51bWJlciwgaW5uZXJJbmRleDogbnVtYmVyLFxuICAgICAgICAgICAgIGlubmVyU3ViOiBJbm5lclN1YnNjcmliZXI8VCwgUj4pOiB2b2lkIHtcbiAgICB0aGlzLmVtaXRWYWx1ZSgpO1xuICB9XG5cbiAgbm90aWZ5Q29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5lbWl0VmFsdWUoKTtcbiAgfVxuXG4gIGVtaXRWYWx1ZSgpIHtcbiAgICBpZiAodGhpcy5oYXNWYWx1ZSkge1xuICAgICAgdGhpcy5oYXNWYWx1ZSA9IGZhbHNlO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHRoaXMudmFsdWUpO1xuICAgIH1cbiAgfVxufVxuIl19