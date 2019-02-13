import { Subscriber } from '../Subscriber';
import { empty } from '../observable/empty';
/**
 * Returns an Observable that repeats the stream of items emitted by the source Observable at most count times.
 *
 * ![](repeat.png)
 *
 * @param {number} [count] The number of times the source Observable items are repeated, a count of 0 will yield
 * an empty Observable.
 * @return {Observable} An Observable that repeats the stream of items emitted by the source Observable at most
 * count times.
 * @method repeat
 * @owner Observable
 */
export function repeat(count = -1) {
    return (source) => {
        if (count === 0) {
            return empty();
        }
        else if (count < 0) {
            return source.lift(new RepeatOperator(-1, source));
        }
        else {
            return source.lift(new RepeatOperator(count - 1, source));
        }
    };
}
class RepeatOperator {
    constructor(count, source) {
        this.count = count;
        this.source = source;
    }
    call(subscriber, source) {
        return source.subscribe(new RepeatSubscriber(subscriber, this.count, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class RepeatSubscriber extends Subscriber {
    constructor(destination, count, source) {
        super(destination);
        this.count = count;
        this.source = source;
    }
    complete() {
        if (!this.isStopped) {
            const { source, count } = this;
            if (count === 0) {
                return super.complete();
            }
            else if (count > -1) {
                this.count = count - 1;
            }
            source.subscribe(this._unsubscribeAndRecycle());
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVwZWF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3JlcGVhdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxLQUFLLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUc1Qzs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxNQUFNLENBQUksUUFBZ0IsQ0FBQyxDQUFDO0lBQzFDLE9BQU8sQ0FBQyxNQUFxQixFQUFFLEVBQUU7UUFDL0IsSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO1lBQ2YsT0FBTyxLQUFLLEVBQUUsQ0FBQztTQUNoQjthQUFNLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtZQUNwQixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxjQUFjLENBQUMsQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUNwRDthQUFNO1lBQ0wsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksY0FBYyxDQUFDLEtBQUssR0FBRyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQztTQUMzRDtJQUNILENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLGNBQWM7SUFDbEIsWUFBb0IsS0FBYSxFQUNiLE1BQXFCO1FBRHJCLFVBQUssR0FBTCxLQUFLLENBQVE7UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFlO0lBQ3pDLENBQUM7SUFDRCxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JGLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGdCQUFvQixTQUFRLFVBQWE7SUFDN0MsWUFBWSxXQUE0QixFQUNwQixLQUFhLEVBQ2IsTUFBcUI7UUFDdkMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRkQsVUFBSyxHQUFMLEtBQUssQ0FBUTtRQUNiLFdBQU0sR0FBTixNQUFNLENBQWU7SUFFekMsQ0FBQztJQUNELFFBQVE7UUFDTixJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNuQixNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLElBQUksQ0FBQztZQUMvQixJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7Z0JBQ2YsT0FBTyxLQUFLLENBQUMsUUFBUSxFQUFFLENBQUM7YUFDekI7aUJBQU0sSUFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDLEVBQUU7Z0JBQ3JCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsQ0FBQzthQUN4QjtZQUNELE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUMsQ0FBQztTQUNqRDtJQUNILENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCByZXBlYXRzIHRoZSBzdHJlYW0gb2YgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYXQgbW9zdCBjb3VudCB0aW1lcy5cbiAqXG4gKiAhW10ocmVwZWF0LnBuZylcbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gW2NvdW50XSBUaGUgbnVtYmVyIG9mIHRpbWVzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBpdGVtcyBhcmUgcmVwZWF0ZWQsIGEgY291bnQgb2YgMCB3aWxsIHlpZWxkXG4gKiBhbiBlbXB0eSBPYnNlcnZhYmxlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IHJlcGVhdHMgdGhlIHN0cmVhbSBvZiBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBhdCBtb3N0XG4gKiBjb3VudCB0aW1lcy5cbiAqIEBtZXRob2QgcmVwZWF0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gcmVwZWF0PFQ+KGNvdW50OiBudW1iZXIgPSAtMSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgaWYgKGNvdW50ID09PSAwKSB7XG4gICAgICByZXR1cm4gZW1wdHkoKTtcbiAgICB9IGVsc2UgaWYgKGNvdW50IDwgMCkge1xuICAgICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBSZXBlYXRPcGVyYXRvcigtMSwgc291cmNlKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgUmVwZWF0T3BlcmF0b3IoY291bnQgLSAxLCBzb3VyY2UpKTtcbiAgICB9XG4gIH07XG59XG5cbmNsYXNzIFJlcGVhdE9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNvdW50OiBudW1iZXIsXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cbiAgY2FsbChzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBSZXBlYXRTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY291bnQsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIFJlcGVhdFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8YW55PixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb3VudDogbnVtYmVyLFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuICBjb21wbGV0ZSgpIHtcbiAgICBpZiAoIXRoaXMuaXNTdG9wcGVkKSB7XG4gICAgICBjb25zdCB7IHNvdXJjZSwgY291bnQgfSA9IHRoaXM7XG4gICAgICBpZiAoY291bnQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNvbXBsZXRlKCk7XG4gICAgICB9IGVsc2UgaWYgKGNvdW50ID4gLTEpIHtcbiAgICAgICAgdGhpcy5jb3VudCA9IGNvdW50IC0gMTtcbiAgICAgIH1cbiAgICAgIHNvdXJjZS5zdWJzY3JpYmUodGhpcy5fdW5zdWJzY3JpYmVBbmRSZWN5Y2xlKCkpO1xuICAgIH1cbiAgfVxufVxuIl19