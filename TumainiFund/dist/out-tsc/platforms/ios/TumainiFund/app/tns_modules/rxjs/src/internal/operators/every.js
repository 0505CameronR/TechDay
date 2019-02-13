import { Subscriber } from '../Subscriber';
/**
 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
 *
 * ## Example
 * A simple example emitting true if all elements are less than 5, false otherwise
 * ```javascript
 *  of(1, 2, 3, 4, 5, 6).pipe(
 *     every(x => x < 5),
 * )
 * .subscribe(x => console.log(x)); // -> false
 * ```
 *
 * @param {function} predicate A function for determining if an item meets a specified condition.
 * @param {any} [thisArg] Optional object to use for `this` in the callback.
 * @return {Observable} An Observable of booleans that determines if all items of the source Observable meet the condition specified.
 * @method every
 * @owner Observable
 */
export function every(predicate, thisArg) {
    return (source) => source.lift(new EveryOperator(predicate, thisArg, source));
}
class EveryOperator {
    constructor(predicate, thisArg, source) {
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
    }
    call(observer, source) {
        return source.subscribe(new EverySubscriber(observer, this.predicate, this.thisArg, this.source));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class EverySubscriber extends Subscriber {
    constructor(destination, predicate, thisArg, source) {
        super(destination);
        this.predicate = predicate;
        this.thisArg = thisArg;
        this.source = source;
        this.index = 0;
        this.thisArg = thisArg || this;
    }
    notifyComplete(everyValueMatch) {
        this.destination.next(everyValueMatch);
        this.destination.complete();
    }
    _next(value) {
        let result = false;
        try {
            result = this.predicate.call(this.thisArg, value, this.index++, this.source);
        }
        catch (err) {
            this.destination.error(err);
            return;
        }
        if (!result) {
            this.notifyComplete(false);
        }
    }
    _complete() {
        this.notifyComplete(true);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZXZlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLFNBQXNFLEVBQ3RFLE9BQWE7SUFDcEMsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQy9GLENBQUM7QUFFRCxNQUFNLGFBQWE7SUFDakIsWUFBb0IsU0FBc0UsRUFDdEUsT0FBYSxFQUNiLE1BQXNCO1FBRnRCLGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFlBQU8sR0FBUCxPQUFPLENBQU07UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFnQjtJQUMxQyxDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQTZCLEVBQUUsTUFBVztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxlQUFtQixTQUFRLFVBQWE7SUFHNUMsWUFBWSxXQUE4QixFQUN0QixTQUFzRSxFQUN0RSxPQUFZLEVBQ1osTUFBc0I7UUFDeEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSEQsY0FBUyxHQUFULFNBQVMsQ0FBNkQ7UUFDdEUsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUNaLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBTGxDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFPeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFTyxjQUFjLENBQUMsZUFBd0I7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUk7WUFDRixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5RTtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hldGhlciBvciBub3QgZXZlcnkgaXRlbSBvZiB0aGUgc291cmNlIHNhdGlzZmllcyB0aGUgY29uZGl0aW9uIHNwZWNpZmllZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBBIHNpbXBsZSBleGFtcGxlIGVtaXR0aW5nIHRydWUgaWYgYWxsIGVsZW1lbnRzIGFyZSBsZXNzIHRoYW4gNSwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAgb2YoMSwgMiwgMywgNCwgNSwgNikucGlwZShcbiAqICAgICBldmVyeSh4ID0+IHggPCA1KSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7IC8vIC0+IGZhbHNlXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBwcmVkaWNhdGUgQSBmdW5jdGlvbiBmb3IgZGV0ZXJtaW5pbmcgaWYgYW4gaXRlbSBtZWV0cyBhIHNwZWNpZmllZCBjb25kaXRpb24uXG4gKiBAcGFyYW0ge2FueX0gW3RoaXNBcmddIE9wdGlvbmFsIG9iamVjdCB0byB1c2UgZm9yIGB0aGlzYCBpbiB0aGUgY2FsbGJhY2suXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIG9mIGJvb2xlYW5zIHRoYXQgZGV0ZXJtaW5lcyBpZiBhbGwgaXRlbXMgb2YgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIG1lZXQgdGhlIGNvbmRpdGlvbiBzcGVjaWZpZWQuXG4gKiBAbWV0aG9kIGV2ZXJ5XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZXZlcnk8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzQXJnPzogYW55KTogT3BlcmF0b3JGdW5jdGlvbjxULCBib29sZWFuPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRXZlcnlPcGVyYXRvcihwcmVkaWNhdGUsIHRoaXNBcmcsIHNvdXJjZSkpO1xufVxuXG5jbGFzcyBFdmVyeU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgYm9vbGVhbj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdGhpc0FyZz86IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gIH1cblxuICBjYWxsKG9ic2VydmVyOiBTdWJzY3JpYmVyPGJvb2xlYW4+LCBzb3VyY2U6IGFueSk6IGFueSB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEV2ZXJ5U3Vic2NyaWJlcihvYnNlcnZlciwgdGhpcy5wcmVkaWNhdGUsIHRoaXMudGhpc0FyZywgdGhpcy5zb3VyY2UpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRXZlcnlTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IE9ic2VydmVyPGJvb2xlYW4+LFxuICAgICAgICAgICAgICBwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdGhpc0FyZzogYW55LFxuICAgICAgICAgICAgICBwcml2YXRlIHNvdXJjZT86IE9ic2VydmFibGU8VD4pIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy50aGlzQXJnID0gdGhpc0FyZyB8fCB0aGlzO1xuICB9XG5cbiAgcHJpdmF0ZSBub3RpZnlDb21wbGV0ZShldmVyeVZhbHVlTWF0Y2g6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoZXZlcnlWYWx1ZU1hdGNoKTtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLmNvbXBsZXRlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMucHJlZGljYXRlLmNhbGwodGhpcy50aGlzQXJnLCB2YWx1ZSwgdGhpcy5pbmRleCsrLCB0aGlzLnNvdXJjZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKCFyZXN1bHQpIHtcbiAgICAgIHRoaXMubm90aWZ5Q29tcGxldGUoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgdGhpcy5ub3RpZnlDb21wbGV0ZSh0cnVlKTtcbiAgfVxufVxuIl19