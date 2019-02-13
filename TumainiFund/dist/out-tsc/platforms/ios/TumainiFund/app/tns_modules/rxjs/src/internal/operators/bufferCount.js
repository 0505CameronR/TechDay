import { Subscriber } from '../Subscriber';
/**
 * Buffers the source Observable values until the size hits the maximum
 * `bufferSize` given.
 *
 * <span class="informal">Collects values from the past as an array, and emits
 * that array only when its size reaches `bufferSize`.</span>
 *
 * ![](bufferCount.png)
 *
 * Buffers a number of values from the source Observable by `bufferSize` then
 * emits the buffer and clears it, and starts a new buffer each
 * `startBufferEvery` values. If `startBufferEvery` is not provided or is
 * `null`, then new buffers are started immediately at the start of the source
 * and when each buffer closes and is emitted.
 *
 * ## Examples
 *
 * Emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * On every click, emit the last two click events as an array
 *
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2, 1));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link buffer}
 * @see {@link bufferTime}
 * @see {@link bufferToggle}
 * @see {@link bufferWhen}
 * @see {@link pairwise}
 * @see {@link windowCount}
 *
 * @param {number} bufferSize The maximum size of the buffer emitted.
 * @param {number} [startBufferEvery] Interval at which to start a new buffer.
 * For example if `startBufferEvery` is `2`, then a new buffer will be started
 * on every other value from the source. A new buffer is started at the
 * beginning of the source by default.
 * @return {Observable<T[]>} An Observable of arrays of buffered values.
 * @method bufferCount
 * @owner Observable
 */
export function bufferCount(bufferSize, startBufferEvery = null) {
    return function bufferCountOperatorFunction(source) {
        return source.lift(new BufferCountOperator(bufferSize, startBufferEvery));
    };
}
class BufferCountOperator {
    constructor(bufferSize, startBufferEvery) {
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        if (!startBufferEvery || bufferSize === startBufferEvery) {
            this.subscriberClass = BufferCountSubscriber;
        }
        else {
            this.subscriberClass = BufferSkipCountSubscriber;
        }
    }
    call(subscriber, source) {
        return source.subscribe(new this.subscriberClass(subscriber, this.bufferSize, this.startBufferEvery));
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferCountSubscriber extends Subscriber {
    constructor(destination, bufferSize) {
        super(destination);
        this.bufferSize = bufferSize;
        this.buffer = [];
    }
    _next(value) {
        const buffer = this.buffer;
        buffer.push(value);
        if (buffer.length == this.bufferSize) {
            this.destination.next(buffer);
            this.buffer = [];
        }
    }
    _complete() {
        const buffer = this.buffer;
        if (buffer.length > 0) {
            this.destination.next(buffer);
        }
        super._complete();
    }
}
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
class BufferSkipCountSubscriber extends Subscriber {
    constructor(destination, bufferSize, startBufferEvery) {
        super(destination);
        this.bufferSize = bufferSize;
        this.startBufferEvery = startBufferEvery;
        this.buffers = [];
        this.count = 0;
    }
    _next(value) {
        const { bufferSize, startBufferEvery, buffers, count } = this;
        this.count++;
        if (count % startBufferEvery === 0) {
            buffers.push([]);
        }
        for (let i = buffers.length; i--;) {
            const buffer = buffers[i];
            buffer.push(value);
            if (buffer.length === bufferSize) {
                buffers.splice(i, 1);
                this.destination.next(buffer);
            }
        }
    }
    _complete() {
        const { buffers, destination } = this;
        while (buffers.length > 0) {
            let buffer = buffers.shift();
            if (buffer.length > 0) {
                destination.next(buffer);
            }
        }
        super._complete();
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyQ291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyQ291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBZ0RHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBSSxVQUFrQixFQUFFLG1CQUEyQixJQUFJO0lBQ2hGLE9BQU8sU0FBUywyQkFBMkIsQ0FBQyxNQUFxQjtRQUMvRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLG1CQUFtQjtJQUd2QixZQUFvQixVQUFrQixFQUFVLGdCQUF3QjtRQUFwRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1FBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7WUFDeEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxxQkFBcUIsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyx5QkFBeUIsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxxQkFBeUIsU0FBUSxVQUFhO0lBR2xELFlBQVksV0FBNEIsRUFBVSxVQUFrQjtRQUNsRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFENkIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUY1RCxXQUFNLEdBQVEsRUFBRSxDQUFDO0lBSXpCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFDRCxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0seUJBQTZCLFNBQVEsVUFBYTtJQUl0RCxZQUFZLFdBQTRCLEVBQVUsVUFBa0IsRUFBVSxnQkFBd0I7UUFDcEcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRDZCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFIOUYsWUFBTyxHQUFlLEVBQUUsQ0FBQztRQUN6QixVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBSTFCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFOUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbEI7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUk7WUFDbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQy9CO1NBQ0Y7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUV0QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7UUFDRCxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJ1ZmZlcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyB1bnRpbCB0aGUgc2l6ZSBoaXRzIHRoZSBtYXhpbXVtXG4gKiBgYnVmZmVyU2l6ZWAgZ2l2ZW4uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbGxlY3RzIHZhbHVlcyBmcm9tIHRoZSBwYXN0IGFzIGFuIGFycmF5LCBhbmQgZW1pdHNcbiAqIHRoYXQgYXJyYXkgb25seSB3aGVuIGl0cyBzaXplIHJlYWNoZXMgYGJ1ZmZlclNpemVgLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyQ291bnQucG5nKVxuICpcbiAqIEJ1ZmZlcnMgYSBudW1iZXIgb2YgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGBidWZmZXJTaXplYCB0aGVuXG4gKiBlbWl0cyB0aGUgYnVmZmVyIGFuZCBjbGVhcnMgaXQsIGFuZCBzdGFydHMgYSBuZXcgYnVmZmVyIGVhY2hcbiAqIGBzdGFydEJ1ZmZlckV2ZXJ5YCB2YWx1ZXMuIElmIGBzdGFydEJ1ZmZlckV2ZXJ5YCBpcyBub3QgcHJvdmlkZWQgb3IgaXNcbiAqIGBudWxsYCwgdGhlbiBuZXcgYnVmZmVycyBhcmUgc3RhcnRlZCBpbW1lZGlhdGVseSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNvdXJjZVxuICogYW5kIHdoZW4gZWFjaCBidWZmZXIgY2xvc2VzIGFuZCBpcyBlbWl0dGVkLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogRW1pdCB0aGUgbGFzdCB0d28gY2xpY2sgZXZlbnRzIGFzIGFuIGFycmF5XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGJ1ZmZlcmVkID0gY2xpY2tzLnBpcGUoYnVmZmVyQ291bnQoMikpO1xuICogYnVmZmVyZWQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCkpO1xuICogYGBgXG4gKlxuICogT24gZXZlcnkgY2xpY2ssIGVtaXQgdGhlIGxhc3QgdHdvIGNsaWNrIGV2ZW50cyBhcyBhbiBhcnJheVxuICpcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCBidWZmZXJlZCA9IGNsaWNrcy5waXBlKGJ1ZmZlckNvdW50KDIsIDEpKTtcbiAqIGJ1ZmZlcmVkLnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJ1ZmZlcn1cbiAqIEBzZWUge0BsaW5rIGJ1ZmZlclRpbWV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUb2dnbGV9XG4gKiBAc2VlIHtAbGluayBidWZmZXJXaGVufVxuICogQHNlZSB7QGxpbmsgcGFpcndpc2V9XG4gKiBAc2VlIHtAbGluayB3aW5kb3dDb3VudH1cbiAqXG4gKiBAcGFyYW0ge251bWJlcn0gYnVmZmVyU2l6ZSBUaGUgbWF4aW11bSBzaXplIG9mIHRoZSBidWZmZXIgZW1pdHRlZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbc3RhcnRCdWZmZXJFdmVyeV0gSW50ZXJ2YWwgYXQgd2hpY2ggdG8gc3RhcnQgYSBuZXcgYnVmZmVyLlxuICogRm9yIGV4YW1wbGUgaWYgYHN0YXJ0QnVmZmVyRXZlcnlgIGlzIGAyYCwgdGhlbiBhIG5ldyBidWZmZXIgd2lsbCBiZSBzdGFydGVkXG4gKiBvbiBldmVyeSBvdGhlciB2YWx1ZSBmcm9tIHRoZSBzb3VyY2UuIEEgbmV3IGJ1ZmZlciBpcyBzdGFydGVkIGF0IHRoZVxuICogYmVnaW5uaW5nIG9mIHRoZSBzb3VyY2UgYnkgZGVmYXVsdC5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VFtdPn0gQW4gT2JzZXJ2YWJsZSBvZiBhcnJheXMgb2YgYnVmZmVyZWQgdmFsdWVzLlxuICogQG1ldGhvZCBidWZmZXJDb3VudFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1ZmZlckNvdW50PFQ+KGJ1ZmZlclNpemU6IG51bWJlciwgc3RhcnRCdWZmZXJFdmVyeTogbnVtYmVyID0gbnVsbCk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVFtdPiB7XG4gIHJldHVybiBmdW5jdGlvbiBidWZmZXJDb3VudE9wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPFQ+KSB7XG4gICAgcmV0dXJuIHNvdXJjZS5saWZ0KG5ldyBCdWZmZXJDb3VudE9wZXJhdG9yPFQ+KGJ1ZmZlclNpemUsIHN0YXJ0QnVmZmVyRXZlcnkpKTtcbiAgfTtcbn1cblxuY2xhc3MgQnVmZmVyQ291bnRPcGVyYXRvcjxUPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFRbXT4ge1xuICBwcml2YXRlIHN1YnNjcmliZXJDbGFzczogYW55O1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyLCBwcml2YXRlIHN0YXJ0QnVmZmVyRXZlcnk6IG51bWJlcikge1xuICAgIGlmICghc3RhcnRCdWZmZXJFdmVyeSB8fCBidWZmZXJTaXplID09PSBzdGFydEJ1ZmZlckV2ZXJ5KSB7XG4gICAgICB0aGlzLnN1YnNjcmliZXJDbGFzcyA9IEJ1ZmZlckNvdW50U3Vic2NyaWJlcjtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zdWJzY3JpYmVyQ2xhc3MgPSBCdWZmZXJTa2lwQ291bnRTdWJzY3JpYmVyO1xuICAgIH1cbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUW10+LCBzb3VyY2U6IGFueSk6IFRlYXJkb3duTG9naWMge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyB0aGlzLnN1YnNjcmliZXJDbGFzcyhzdWJzY3JpYmVyLCB0aGlzLmJ1ZmZlclNpemUsIHRoaXMuc3RhcnRCdWZmZXJFdmVyeSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJDb3VudFN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJpdmF0ZSBidWZmZXI6IFRbXSA9IFtdO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFRbXT4sIHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHZhbHVlOiBUKTogdm9pZCB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5idWZmZXI7XG5cbiAgICBidWZmZXIucHVzaCh2YWx1ZSk7XG5cbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA9PSB0aGlzLmJ1ZmZlclNpemUpIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgdGhpcy5idWZmZXIgPSBbXTtcbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuICAgIGlmIChidWZmZXIubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5kZXN0aW5hdGlvbi5uZXh0KGJ1ZmZlcik7XG4gICAgfVxuICAgIHN1cGVyLl9jb21wbGV0ZSgpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBCdWZmZXJTa2lwQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgYnVmZmVyczogQXJyYXk8VFtdPiA9IFtdO1xuICBwcml2YXRlIGNvdW50OiBudW1iZXIgPSAwO1xuXG4gIGNvbnN0cnVjdG9yKGRlc3RpbmF0aW9uOiBTdWJzY3JpYmVyPFRbXT4sIHByaXZhdGUgYnVmZmVyU2l6ZTogbnVtYmVyLCBwcml2YXRlIHN0YXJ0QnVmZmVyRXZlcnk6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYnVmZmVyU2l6ZSwgc3RhcnRCdWZmZXJFdmVyeSwgYnVmZmVycywgY291bnQgfSA9IHRoaXM7XG5cbiAgICB0aGlzLmNvdW50Kys7XG4gICAgaWYgKGNvdW50ICUgc3RhcnRCdWZmZXJFdmVyeSA9PT0gMCkge1xuICAgICAgYnVmZmVycy5wdXNoKFtdKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBpID0gYnVmZmVycy5sZW5ndGg7IGktLTsgKSB7XG4gICAgICBjb25zdCBidWZmZXIgPSBidWZmZXJzW2ldO1xuICAgICAgYnVmZmVyLnB1c2godmFsdWUpO1xuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPT09IGJ1ZmZlclNpemUpIHtcbiAgICAgICAgYnVmZmVycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBfY29tcGxldGUoKTogdm9pZCB7XG4gICAgY29uc3QgeyBidWZmZXJzLCBkZXN0aW5hdGlvbiB9ID0gdGhpcztcblxuICAgIHdoaWxlIChidWZmZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGxldCBidWZmZXIgPSBidWZmZXJzLnNoaWZ0KCk7XG4gICAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgICAgZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgICAgfVxuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxuXG59XG4iXX0=