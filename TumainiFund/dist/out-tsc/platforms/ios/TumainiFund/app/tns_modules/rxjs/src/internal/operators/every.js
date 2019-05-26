import { Subscriber } from '../Subscriber';
/**
 * Returns an Observable that emits whether or not every item of the source satisfies the condition specified.
 *
 * ## Example
 * A simple example emitting true if all elements are less than 5, false otherwise
 * ```javascript
 * import { of } from 'rxjs';
 * import { every } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlcnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZXZlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBRUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUczQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFDSCxNQUFNLFVBQVUsS0FBSyxDQUFJLFNBQXNFLEVBQ3RFLE9BQWE7SUFDcEMsT0FBTyxDQUFDLE1BQXFCLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsU0FBUyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQy9GLENBQUM7QUFFRCxNQUFNLGFBQWE7SUFDakIsWUFBb0IsU0FBc0UsRUFDdEUsT0FBYSxFQUNiLE1BQXNCO1FBRnRCLGNBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFlBQU8sR0FBUCxPQUFPLENBQU07UUFDYixXQUFNLEdBQU4sTUFBTSxDQUFnQjtJQUMxQyxDQUFDO0lBRUQsSUFBSSxDQUFDLFFBQTZCLEVBQUUsTUFBVztRQUM3QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxlQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztJQUNwRyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxlQUFtQixTQUFRLFVBQWE7SUFHNUMsWUFBWSxXQUE4QixFQUN0QixTQUFzRSxFQUN0RSxPQUFZLEVBQ1osTUFBc0I7UUFDeEMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBSEQsY0FBUyxHQUFULFNBQVMsQ0FBNkQ7UUFDdEUsWUFBTyxHQUFQLE9BQU8sQ0FBSztRQUNaLFdBQU0sR0FBTixNQUFNLENBQWdCO1FBTGxDLFVBQUssR0FBVyxDQUFDLENBQUM7UUFPeEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksSUFBSSxDQUFDO0lBQ2pDLENBQUM7SUFFTyxjQUFjLENBQUMsZUFBd0I7UUFDN0MsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRVMsS0FBSyxDQUFDLEtBQVE7UUFDdEIsSUFBSSxNQUFNLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUk7WUFDRixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUM5RTtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsT0FBTztTQUNSO1FBRUQsSUFBSSxDQUFDLE1BQU0sRUFBRTtZQUNYLElBQUksQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDNUI7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FDRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgT2JzZXJ2ZXIsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogUmV0dXJucyBhbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgd2hldGhlciBvciBub3QgZXZlcnkgaXRlbSBvZiB0aGUgc291cmNlIHNhdGlzZmllcyB0aGUgY29uZGl0aW9uIHNwZWNpZmllZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBBIHNpbXBsZSBleGFtcGxlIGVtaXR0aW5nIHRydWUgaWYgYWxsIGVsZW1lbnRzIGFyZSBsZXNzIHRoYW4gNSwgZmFsc2Ugb3RoZXJ3aXNlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBvZiB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0IHsgZXZlcnkgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG4gKlxuICogIG9mKDEsIDIsIDMsIDQsIDUsIDYpLnBpcGUoXG4gKiAgICAgZXZlcnkoeCA9PiB4IDwgNSksXG4gKiApXG4gKiAuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpOyAvLyAtPiBmYWxzZVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gcHJlZGljYXRlIEEgZnVuY3Rpb24gZm9yIGRldGVybWluaW5nIGlmIGFuIGl0ZW0gbWVldHMgYSBzcGVjaWZpZWQgY29uZGl0aW9uLlxuICogQHBhcmFtIHthbnl9IFt0aGlzQXJnXSBPcHRpb25hbCBvYmplY3QgdG8gdXNlIGZvciBgdGhpc2AgaW4gdGhlIGNhbGxiYWNrLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSBvZiBib29sZWFucyB0aGF0IGRldGVybWluZXMgaWYgYWxsIGl0ZW1zIG9mIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSBtZWV0IHRoZSBjb25kaXRpb24gc3BlY2lmaWVkLlxuICogQG1ldGhvZCBldmVyeVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGV2ZXJ5PFQ+KHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgYm9vbGVhbj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IEV2ZXJ5T3BlcmF0b3IocHJlZGljYXRlLCB0aGlzQXJnLCBzb3VyY2UpKTtcbn1cblxuY2xhc3MgRXZlcnlPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIGJvb2xlYW4+IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRoaXNBcmc/OiBhbnksXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlPzogT2JzZXJ2YWJsZTxUPikge1xuICB9XG5cbiAgY2FsbChvYnNlcnZlcjogU3Vic2NyaWJlcjxib29sZWFuPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBFdmVyeVN1YnNjcmliZXIob2JzZXJ2ZXIsIHRoaXMucHJlZGljYXRlLCB0aGlzLnRoaXNBcmcsIHRoaXMuc291cmNlKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmNsYXNzIEV2ZXJ5U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBPYnNlcnZlcjxib29sZWFuPixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICBwcml2YXRlIHRoaXNBcmc6IGFueSxcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U/OiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMudGhpc0FyZyA9IHRoaXNBcmcgfHwgdGhpcztcbiAgfVxuXG4gIHByaXZhdGUgbm90aWZ5Q29tcGxldGUoZXZlcnlWYWx1ZU1hdGNoOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGV2ZXJ5VmFsdWVNYXRjaCk7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5jb21wbGV0ZSgpO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgbGV0IHJlc3VsdCA9IGZhbHNlO1xuICAgIHRyeSB7XG4gICAgICByZXN1bHQgPSB0aGlzLnByZWRpY2F0ZS5jYWxsKHRoaXMudGhpc0FyZywgdmFsdWUsIHRoaXMuaW5kZXgrKywgdGhpcy5zb3VyY2UpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGlmICghcmVzdWx0KSB7XG4gICAgICB0aGlzLm5vdGlmeUNvbXBsZXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIHRoaXMubm90aWZ5Q29tcGxldGUodHJ1ZSk7XG4gIH1cbn1cbiJdfQ==