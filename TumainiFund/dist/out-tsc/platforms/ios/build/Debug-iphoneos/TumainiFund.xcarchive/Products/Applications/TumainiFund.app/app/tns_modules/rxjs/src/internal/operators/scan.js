import { Subscriber } from '../Subscriber';
/* tslint:enable:max-line-length */
/**
 * Applies an accumulator function over the source Observable, and returns each
 * intermediate result, with an optional seed value.
 *
 * <span class="informal">It's like {@link reduce}, but emits the current
 * accumulation whenever the source emits a value.</span>
 *
 * ![](scan.png)
 *
 * Combines together all values emitted on the source, using an accumulator
 * function that knows how to join a new source value into the accumulation from
 * the past. Is similar to {@link reduce}, but emits the intermediate
 * accumulations.
 *
 * Returns an Observable that applies a specified `accumulator` function to each
 * item emitted by the source Observable. If a `seed` value is specified, then
 * that value will be used as the initial value for the accumulator. If no seed
 * value is specified, the first item of the source is used as the seed.
 *
 * ## Example
 * Count the number of click events
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const ones = clicks.pipe(mapTo(1));
 * const seed = 0;
 * const count = ones.pipe(scan((acc, one) => acc + one, seed));
 * count.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link expand}
 * @see {@link mergeScan}
 * @see {@link reduce}
 *
 * @param {function(acc: R, value: T, index: number): R} accumulator
 * The accumulator function called on each source value.
 * @param {T|R} [seed] The initial accumulation value.
 * @return {Observable<R>} An observable of the accumulated values.
 * @method scan
 * @owner Observable
 */
export function scan(accumulator, seed) {
    let hasSeed = false;
    // providing a seed of `undefined` *should* be valid and trigger
    // hasSeed! so don't use `seed !== undefined` checks!
    // For this reason, we have to check it here at the original call site
    // otherwise inside Operator/Subscriber we won't know if `undefined`
    // means they didn't provide anything or if they literally provided `undefined`
    if (arguments.length >= 2) {
        hasSeed = true;
    }
    return function scanOperatorFunction(source) {
        return source.lift(new ScanOperator(accumulator, seed, hasSeed));
    };
}
class ScanOperator {
    constructor(accumulator, seed, hasSeed = false) {
        this.accumulator = accumulator;
        this.seed = seed;
        this.hasSeed = hasSeed;
    }
    call(subscriber, source) {
        return source.subscribe(new ScanSubscriber(subscriber, this.accumulator, this.seed, this.hasSeed));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class ScanSubscriber extends Subscriber {
    constructor(destination, accumulator, _seed, hasSeed) {
        super(destination);
        this.accumulator = accumulator;
        this._seed = _seed;
        this.hasSeed = hasSeed;
        this.index = 0;
    }
    get seed() {
        return this._seed;
    }
    set seed(value) {
        this.hasSeed = true;
        this._seed = value;
    }
    _next(value) {
        if (!this.hasSeed) {
            this.seed = value;
            this.destination.next(value);
        }
        else {
            return this._tryNext(value);
        }
    }
    _tryNext(value) {
        const index = this.index++;
        let result;
        try {
            result = this.accumulator(this.seed, value, index);
        }
        catch (err) {
            this.destination.error(err);
        }
        this.seed = result;
        this.destination.next(result);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2Nhbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9zY2FuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFPM0MsbUNBQW1DO0FBRW5DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Q0c7QUFDSCxNQUFNLFVBQVUsSUFBSSxDQUFPLFdBQW1ELEVBQUUsSUFBWTtJQUMxRixJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUM7SUFDcEIsZ0VBQWdFO0lBQ2hFLHFEQUFxRDtJQUNyRCxzRUFBc0U7SUFDdEUsb0VBQW9FO0lBQ3BFLCtFQUErRTtJQUMvRSxJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3pCLE9BQU8sR0FBRyxJQUFJLENBQUM7S0FDaEI7SUFFRCxPQUFPLFNBQVMsb0JBQW9CLENBQUMsTUFBcUI7UUFDeEQsT0FBTyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNuRSxDQUFDLENBQUM7QUFDSixDQUFDO0FBRUQsTUFBTSxZQUFZO0lBQ2hCLFlBQW9CLFdBQW1ELEVBQVUsSUFBWSxFQUFVLFVBQW1CLEtBQUs7UUFBM0csZ0JBQVcsR0FBWCxXQUFXLENBQXdDO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBUTtRQUFVLFlBQU8sR0FBUCxPQUFPLENBQWlCO0lBQUcsQ0FBQztJQUVuSSxJQUFJLENBQUMsVUFBeUIsRUFBRSxNQUFXO1FBQ3pDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLGNBQWMsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3JHLENBQUM7Q0FDRjtBQUVEOzs7O0dBSUc7QUFDSCxNQUFNLGNBQXFCLFNBQVEsVUFBYTtJQVk5QyxZQUFZLFdBQTBCLEVBQVUsV0FBbUQsRUFBVSxLQUFZLEVBQ3JHLE9BQWdCO1FBQ2xDLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUYyQixnQkFBVyxHQUFYLFdBQVcsQ0FBd0M7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFPO1FBQ3JHLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFaNUIsVUFBSyxHQUFXLENBQUMsQ0FBQztJQWMxQixDQUFDO0lBWkQsSUFBSSxJQUFJO1FBQ04sT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDO0lBQ3BCLENBQUM7SUFFRCxJQUFJLElBQUksQ0FBQyxLQUFZO1FBQ25CLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0lBQ3JCLENBQUM7SUFPUyxLQUFLLENBQUMsS0FBUTtRQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM5QjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCO0lBQ0gsQ0FBQztJQUVPLFFBQVEsQ0FBQyxLQUFRO1FBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQixJQUFJLE1BQVcsQ0FBQztRQUNoQixJQUFJO1lBQ0YsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUksSUFBSSxDQUFDLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDdkQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzdCO1FBQ0QsSUFBSSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7UUFDbkIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDaEMsQ0FBQztDQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuZXhwb3J0IGZ1bmN0aW9uIHNjYW48VD4oYWNjdW11bGF0b3I6IChhY2M6IFQsIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBULCBzZWVkPzogVCk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBzY2FuPFQ+KGFjY3VtdWxhdG9yOiAoYWNjOiBUW10sIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBUW10sIHNlZWQ/OiBUW10pOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbXT47XG5leHBvcnQgZnVuY3Rpb24gc2NhbjxULCBSPihhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsIHNlZWQ/OiBSKTogT3BlcmF0b3JGdW5jdGlvbjxULCBSPjtcbi8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbi8qKlxuICogQXBwbGllcyBhbiBhY2N1bXVsYXRvciBmdW5jdGlvbiBvdmVyIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYW5kIHJldHVybnMgZWFjaFxuICogaW50ZXJtZWRpYXRlIHJlc3VsdCwgd2l0aCBhbiBvcHRpb25hbCBzZWVkIHZhbHVlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGxpa2Uge0BsaW5rIHJlZHVjZX0sIGJ1dCBlbWl0cyB0aGUgY3VycmVudFxuICogYWNjdW11bGF0aW9uIHdoZW5ldmVyIHRoZSBzb3VyY2UgZW1pdHMgYSB2YWx1ZS48L3NwYW4+XG4gKlxuICogIVtdKHNjYW4ucG5nKVxuICpcbiAqIENvbWJpbmVzIHRvZ2V0aGVyIGFsbCB2YWx1ZXMgZW1pdHRlZCBvbiB0aGUgc291cmNlLCB1c2luZyBhbiBhY2N1bXVsYXRvclxuICogZnVuY3Rpb24gdGhhdCBrbm93cyBob3cgdG8gam9pbiBhIG5ldyBzb3VyY2UgdmFsdWUgaW50byB0aGUgYWNjdW11bGF0aW9uIGZyb21cbiAqIHRoZSBwYXN0LiBJcyBzaW1pbGFyIHRvIHtAbGluayByZWR1Y2V9LCBidXQgZW1pdHMgdGhlIGludGVybWVkaWF0ZVxuICogYWNjdW11bGF0aW9ucy5cbiAqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBhcHBsaWVzIGEgc3BlY2lmaWVkIGBhY2N1bXVsYXRvcmAgZnVuY3Rpb24gdG8gZWFjaFxuICogaXRlbSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS4gSWYgYSBgc2VlZGAgdmFsdWUgaXMgc3BlY2lmaWVkLCB0aGVuXG4gKiB0aGF0IHZhbHVlIHdpbGwgYmUgdXNlZCBhcyB0aGUgaW5pdGlhbCB2YWx1ZSBmb3IgdGhlIGFjY3VtdWxhdG9yLiBJZiBubyBzZWVkXG4gKiB2YWx1ZSBpcyBzcGVjaWZpZWQsIHRoZSBmaXJzdCBpdGVtIG9mIHRoZSBzb3VyY2UgaXMgdXNlZCBhcyB0aGUgc2VlZC5cbiAqXG4gKiAjIyBFeGFtcGxlXG4gKiBDb3VudCB0aGUgbnVtYmVyIG9mIGNsaWNrIGV2ZW50c1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IG9uZXMgPSBjbGlja3MucGlwZShtYXBUbygxKSk7XG4gKiBjb25zdCBzZWVkID0gMDtcbiAqIGNvbnN0IGNvdW50ID0gb25lcy5waXBlKHNjYW4oKGFjYywgb25lKSA9PiBhY2MgKyBvbmUsIHNlZWQpKTtcbiAqIGNvdW50LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGV4cGFuZH1cbiAqIEBzZWUge0BsaW5rIG1lcmdlU2Nhbn1cbiAqIEBzZWUge0BsaW5rIHJlZHVjZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKGFjYzogUiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpOiBSfSBhY2N1bXVsYXRvclxuICogVGhlIGFjY3VtdWxhdG9yIGZ1bmN0aW9uIGNhbGxlZCBvbiBlYWNoIHNvdXJjZSB2YWx1ZS5cbiAqIEBwYXJhbSB7VHxSfSBbc2VlZF0gVGhlIGluaXRpYWwgYWNjdW11bGF0aW9uIHZhbHVlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxSPn0gQW4gb2JzZXJ2YWJsZSBvZiB0aGUgYWNjdW11bGF0ZWQgdmFsdWVzLlxuICogQG1ldGhvZCBzY2FuXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2NhbjxULCBSPihhY2N1bXVsYXRvcjogKGFjYzogUiwgdmFsdWU6IFQsIGluZGV4OiBudW1iZXIpID0+IFIsIHNlZWQ/OiBUIHwgUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICBsZXQgaGFzU2VlZCA9IGZhbHNlO1xuICAvLyBwcm92aWRpbmcgYSBzZWVkIG9mIGB1bmRlZmluZWRgICpzaG91bGQqIGJlIHZhbGlkIGFuZCB0cmlnZ2VyXG4gIC8vIGhhc1NlZWQhIHNvIGRvbid0IHVzZSBgc2VlZCAhPT0gdW5kZWZpbmVkYCBjaGVja3MhXG4gIC8vIEZvciB0aGlzIHJlYXNvbiwgd2UgaGF2ZSB0byBjaGVjayBpdCBoZXJlIGF0IHRoZSBvcmlnaW5hbCBjYWxsIHNpdGVcbiAgLy8gb3RoZXJ3aXNlIGluc2lkZSBPcGVyYXRvci9TdWJzY3JpYmVyIHdlIHdvbid0IGtub3cgaWYgYHVuZGVmaW5lZGBcbiAgLy8gbWVhbnMgdGhleSBkaWRuJ3QgcHJvdmlkZSBhbnl0aGluZyBvciBpZiB0aGV5IGxpdGVyYWxseSBwcm92aWRlZCBgdW5kZWZpbmVkYFxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+PSAyKSB7XG4gICAgaGFzU2VlZCA9IHRydWU7XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gc2Nhbk9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KTogT2JzZXJ2YWJsZTxSPiB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBTY2FuT3BlcmF0b3IoYWNjdW11bGF0b3IsIHNlZWQsIGhhc1NlZWQpKTtcbiAgfTtcbn1cblxuY2xhc3MgU2Nhbk9wZXJhdG9yPFQsIFI+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgUj4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGFjY3VtdWxhdG9yOiAoYWNjOiBSLCB2YWx1ZTogVCwgaW5kZXg6IG51bWJlcikgPT4gUiwgcHJpdmF0ZSBzZWVkPzogVCB8IFIsIHByaXZhdGUgaGFzU2VlZDogYm9vbGVhbiA9IGZhbHNlKSB7fVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBTY2FuU3Vic2NyaWJlcihzdWJzY3JpYmVyLCB0aGlzLmFjY3VtdWxhdG9yLCB0aGlzLnNlZWQsIHRoaXMuaGFzU2VlZCkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBTY2FuU3Vic2NyaWJlcjxULCBSPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGluZGV4OiBudW1iZXIgPSAwO1xuXG4gIGdldCBzZWVkKCk6IFQgfCBSIHtcbiAgICByZXR1cm4gdGhpcy5fc2VlZDtcbiAgfVxuXG4gIHNldCBzZWVkKHZhbHVlOiBUIHwgUikge1xuICAgIHRoaXMuaGFzU2VlZCA9IHRydWU7XG4gICAgdGhpcy5fc2VlZCA9IHZhbHVlO1xuICB9XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8Uj4sIHByaXZhdGUgYWNjdW11bGF0b3I6IChhY2M6IFIsIHZhbHVlOiBULCBpbmRleDogbnVtYmVyKSA9PiBSLCBwcml2YXRlIF9zZWVkOiBUIHwgUixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBoYXNTZWVkOiBib29sZWFuKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmhhc1NlZWQpIHtcbiAgICAgIHRoaXMuc2VlZCA9IHZhbHVlO1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuX3RyeU5leHQodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgX3RyeU5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCBpbmRleCA9IHRoaXMuaW5kZXgrKztcbiAgICBsZXQgcmVzdWx0OiBhbnk7XG4gICAgdHJ5IHtcbiAgICAgIHJlc3VsdCA9IHRoaXMuYWNjdW11bGF0b3IoPFI+dGhpcy5zZWVkLCB2YWx1ZSwgaW5kZXgpO1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5lcnJvcihlcnIpO1xuICAgIH1cbiAgICB0aGlzLnNlZWQgPSByZXN1bHQ7XG4gICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KHJlc3VsdCk7XG4gIH1cbn1cbiJdfQ==