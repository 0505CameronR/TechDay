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
 * import { fromEvent } from 'rxjs';
 * import { bufferCount } from 'rxjs/operators';
 *
 * const clicks = fromEvent(document, 'click');
 * const buffered = clicks.pipe(bufferCount(2));
 * buffered.subscribe(x => console.log(x));
 * ```
 *
 * On every click, emit the last two click events as an array
 *
 * ```javascript
 * import { fromEvent } from 'rxjs';
 * import { bufferCount } from 'rxjs/operators';
 *
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVmZmVyQ291bnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvYnVmZmVyQ291bnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkzQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBc0RHO0FBQ0gsTUFBTSxVQUFVLFdBQVcsQ0FBSSxVQUFrQixFQUFFLG1CQUEyQixJQUFJO0lBQ2hGLE9BQU8sU0FBUywyQkFBMkIsQ0FBQyxNQUFxQjtRQUMvRCxPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxtQkFBbUIsQ0FBSSxVQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUMsQ0FBQztBQUNKLENBQUM7QUFFRCxNQUFNLG1CQUFtQjtJQUd2QixZQUFvQixVQUFrQixFQUFVLGdCQUF3QjtRQUFwRCxlQUFVLEdBQVYsVUFBVSxDQUFRO1FBQVUscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO1FBQ3RFLElBQUksQ0FBQyxnQkFBZ0IsSUFBSSxVQUFVLEtBQUssZ0JBQWdCLEVBQUU7WUFDeEQsSUFBSSxDQUFDLGVBQWUsR0FBRyxxQkFBcUIsQ0FBQztTQUM5QzthQUFNO1lBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyx5QkFBeUIsQ0FBQztTQUNsRDtJQUNILENBQUM7SUFFRCxJQUFJLENBQUMsVUFBMkIsRUFBRSxNQUFXO1FBQzNDLE9BQU8sTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztJQUN4RyxDQUFDO0NBQ0Y7QUFFRDs7OztHQUlHO0FBQ0gsTUFBTSxxQkFBeUIsU0FBUSxVQUFhO0lBR2xELFlBQVksV0FBNEIsRUFBVSxVQUFrQjtRQUNsRSxLQUFLLENBQUMsV0FBVyxDQUFDLENBQUM7UUFENkIsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUY1RCxXQUFNLEdBQVEsRUFBRSxDQUFDO0lBSXpCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBRTNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7WUFDcEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7U0FDbEI7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO1FBQzNCLElBQUksTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDckIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFDRCxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQUNGO0FBRUQ7Ozs7R0FJRztBQUNILE1BQU0seUJBQTZCLFNBQVEsVUFBYTtJQUl0RCxZQUFZLFdBQTRCLEVBQVUsVUFBa0IsRUFBVSxnQkFBd0I7UUFDcEcsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRDZCLGVBQVUsR0FBVixVQUFVLENBQVE7UUFBVSxxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQVE7UUFIOUYsWUFBTyxHQUFlLEVBQUUsQ0FBQztRQUN6QixVQUFLLEdBQVcsQ0FBQyxDQUFDO0lBSTFCLENBQUM7SUFFUyxLQUFLLENBQUMsS0FBUTtRQUN0QixNQUFNLEVBQUUsVUFBVSxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFFOUQsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2IsSUFBSSxLQUFLLEdBQUcsZ0JBQWdCLEtBQUssQ0FBQyxFQUFFO1lBQ2xDLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7U0FDbEI7UUFFRCxLQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUk7WUFDbEMsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzFCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbkIsSUFBSSxNQUFNLENBQUMsTUFBTSxLQUFLLFVBQVUsRUFBRTtnQkFDaEMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JCLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQy9CO1NBQ0Y7SUFDSCxDQUFDO0lBRVMsU0FBUztRQUNqQixNQUFNLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQztRQUV0QyxPQUFPLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1lBQ3pCLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUM3QixJQUFJLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUNyQixXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO2FBQzFCO1NBQ0Y7UUFDRCxLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztDQUVGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEJ1ZmZlcnMgdGhlIHNvdXJjZSBPYnNlcnZhYmxlIHZhbHVlcyB1bnRpbCB0aGUgc2l6ZSBoaXRzIHRoZSBtYXhpbXVtXG4gKiBgYnVmZmVyU2l6ZWAgZ2l2ZW4uXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNvbGxlY3RzIHZhbHVlcyBmcm9tIHRoZSBwYXN0IGFzIGFuIGFycmF5LCBhbmQgZW1pdHNcbiAqIHRoYXQgYXJyYXkgb25seSB3aGVuIGl0cyBzaXplIHJlYWNoZXMgYGJ1ZmZlclNpemVgLjwvc3Bhbj5cbiAqXG4gKiAhW10oYnVmZmVyQ291bnQucG5nKVxuICpcbiAqIEJ1ZmZlcnMgYSBudW1iZXIgb2YgdmFsdWVzIGZyb20gdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGJ5IGBidWZmZXJTaXplYCB0aGVuXG4gKiBlbWl0cyB0aGUgYnVmZmVyIGFuZCBjbGVhcnMgaXQsIGFuZCBzdGFydHMgYSBuZXcgYnVmZmVyIGVhY2hcbiAqIGBzdGFydEJ1ZmZlckV2ZXJ5YCB2YWx1ZXMuIElmIGBzdGFydEJ1ZmZlckV2ZXJ5YCBpcyBub3QgcHJvdmlkZWQgb3IgaXNcbiAqIGBudWxsYCwgdGhlbiBuZXcgYnVmZmVycyBhcmUgc3RhcnRlZCBpbW1lZGlhdGVseSBhdCB0aGUgc3RhcnQgb2YgdGhlIHNvdXJjZVxuICogYW5kIHdoZW4gZWFjaCBidWZmZXIgY2xvc2VzIGFuZCBpcyBlbWl0dGVkLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKlxuICogRW1pdCB0aGUgbGFzdCB0d28gY2xpY2sgZXZlbnRzIGFzIGFuIGFycmF5XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBidWZmZXJDb3VudCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJDb3VudCgyKSk7XG4gKiBidWZmZXJlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBPbiBldmVyeSBjbGljaywgZW1pdCB0aGUgbGFzdCB0d28gY2xpY2sgZXZlbnRzIGFzIGFuIGFycmF5XG4gKlxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgZnJvbUV2ZW50IH0gZnJvbSAncnhqcyc7XG4gKiBpbXBvcnQgeyBidWZmZXJDb3VudCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBjbGlja3MgPSBmcm9tRXZlbnQoZG9jdW1lbnQsICdjbGljaycpO1xuICogY29uc3QgYnVmZmVyZWQgPSBjbGlja3MucGlwZShidWZmZXJDb3VudCgyLCAxKSk7XG4gKiBidWZmZXJlZC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBidWZmZXJ9XG4gKiBAc2VlIHtAbGluayBidWZmZXJUaW1lfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyVG9nZ2xlfVxuICogQHNlZSB7QGxpbmsgYnVmZmVyV2hlbn1cbiAqIEBzZWUge0BsaW5rIHBhaXJ3aXNlfVxuICogQHNlZSB7QGxpbmsgd2luZG93Q291bnR9XG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IGJ1ZmZlclNpemUgVGhlIG1heGltdW0gc2l6ZSBvZiB0aGUgYnVmZmVyIGVtaXR0ZWQuXG4gKiBAcGFyYW0ge251bWJlcn0gW3N0YXJ0QnVmZmVyRXZlcnldIEludGVydmFsIGF0IHdoaWNoIHRvIHN0YXJ0IGEgbmV3IGJ1ZmZlci5cbiAqIEZvciBleGFtcGxlIGlmIGBzdGFydEJ1ZmZlckV2ZXJ5YCBpcyBgMmAsIHRoZW4gYSBuZXcgYnVmZmVyIHdpbGwgYmUgc3RhcnRlZFxuICogb24gZXZlcnkgb3RoZXIgdmFsdWUgZnJvbSB0aGUgc291cmNlLiBBIG5ldyBidWZmZXIgaXMgc3RhcnRlZCBhdCB0aGVcbiAqIGJlZ2lubmluZyBvZiB0aGUgc291cmNlIGJ5IGRlZmF1bHQuXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlPFRbXT59IEFuIE9ic2VydmFibGUgb2YgYXJyYXlzIG9mIGJ1ZmZlcmVkIHZhbHVlcy5cbiAqIEBtZXRob2QgYnVmZmVyQ291bnRcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBidWZmZXJDb3VudDxUPihidWZmZXJTaXplOiBudW1iZXIsIHN0YXJ0QnVmZmVyRXZlcnk6IG51bWJlciA9IG51bGwpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRbXT4ge1xuICByZXR1cm4gZnVuY3Rpb24gYnVmZmVyQ291bnRPcGVyYXRvckZ1bmN0aW9uKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikge1xuICAgIHJldHVybiBzb3VyY2UubGlmdChuZXcgQnVmZmVyQ291bnRPcGVyYXRvcjxUPihidWZmZXJTaXplLCBzdGFydEJ1ZmZlckV2ZXJ5KSk7XG4gIH07XG59XG5cbmNsYXNzIEJ1ZmZlckNvdW50T3BlcmF0b3I8VD4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBUW10+IHtcbiAgcHJpdmF0ZSBzdWJzY3JpYmVyQ2xhc3M6IGFueTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGJ1ZmZlclNpemU6IG51bWJlciwgcHJpdmF0ZSBzdGFydEJ1ZmZlckV2ZXJ5OiBudW1iZXIpIHtcbiAgICBpZiAoIXN0YXJ0QnVmZmVyRXZlcnkgfHwgYnVmZmVyU2l6ZSA9PT0gc3RhcnRCdWZmZXJFdmVyeSkge1xuICAgICAgdGhpcy5zdWJzY3JpYmVyQ2xhc3MgPSBCdWZmZXJDb3VudFN1YnNjcmliZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc3Vic2NyaWJlckNsYXNzID0gQnVmZmVyU2tpcENvdW50U3Vic2NyaWJlcjtcbiAgICB9XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VFtdPiwgc291cmNlOiBhbnkpOiBUZWFyZG93bkxvZ2ljIHtcbiAgICByZXR1cm4gc291cmNlLnN1YnNjcmliZShuZXcgdGhpcy5zdWJzY3JpYmVyQ2xhc3Moc3Vic2NyaWJlciwgdGhpcy5idWZmZXJTaXplLCB0aGlzLnN0YXJ0QnVmZmVyRXZlcnkpKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyQ291bnRTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgYnVmZmVyOiBUW10gPSBbXTtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUW10+LCBwcml2YXRlIGJ1ZmZlclNpemU6IG51bWJlcikge1xuICAgIHN1cGVyKGRlc3RpbmF0aW9uKTtcbiAgfVxuXG4gIHByb3RlY3RlZCBfbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIGNvbnN0IGJ1ZmZlciA9IHRoaXMuYnVmZmVyO1xuXG4gICAgYnVmZmVyLnB1c2godmFsdWUpO1xuXG4gICAgaWYgKGJ1ZmZlci5sZW5ndGggPT0gdGhpcy5idWZmZXJTaXplKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICAgIHRoaXMuYnVmZmVyID0gW107XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBidWZmZXIgPSB0aGlzLmJ1ZmZlcjtcbiAgICBpZiAoYnVmZmVyLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuZGVzdGluYXRpb24ubmV4dChidWZmZXIpO1xuICAgIH1cbiAgICBzdXBlci5fY29tcGxldGUoKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgQnVmZmVyU2tpcENvdW50U3Vic2NyaWJlcjxUPiBleHRlbmRzIFN1YnNjcmliZXI8VD4ge1xuICBwcml2YXRlIGJ1ZmZlcnM6IEFycmF5PFRbXT4gPSBbXTtcbiAgcHJpdmF0ZSBjb3VudDogbnVtYmVyID0gMDtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxUW10+LCBwcml2YXRlIGJ1ZmZlclNpemU6IG51bWJlciwgcHJpdmF0ZSBzdGFydEJ1ZmZlckV2ZXJ5OiBudW1iZXIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCB7IGJ1ZmZlclNpemUsIHN0YXJ0QnVmZmVyRXZlcnksIGJ1ZmZlcnMsIGNvdW50IH0gPSB0aGlzO1xuXG4gICAgdGhpcy5jb3VudCsrO1xuICAgIGlmIChjb3VudCAlIHN0YXJ0QnVmZmVyRXZlcnkgPT09IDApIHtcbiAgICAgIGJ1ZmZlcnMucHVzaChbXSk7XG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IGJ1ZmZlcnMubGVuZ3RoOyBpLS07ICkge1xuICAgICAgY29uc3QgYnVmZmVyID0gYnVmZmVyc1tpXTtcbiAgICAgIGJ1ZmZlci5wdXNoKHZhbHVlKTtcbiAgICAgIGlmIChidWZmZXIubGVuZ3RoID09PSBidWZmZXJTaXplKSB7XG4gICAgICAgIGJ1ZmZlcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcm90ZWN0ZWQgX2NvbXBsZXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IHsgYnVmZmVycywgZGVzdGluYXRpb24gfSA9IHRoaXM7XG5cbiAgICB3aGlsZSAoYnVmZmVycy5sZW5ndGggPiAwKSB7XG4gICAgICBsZXQgYnVmZmVyID0gYnVmZmVycy5zaGlmdCgpO1xuICAgICAgaWYgKGJ1ZmZlci5sZW5ndGggPiAwKSB7XG4gICAgICAgIGRlc3RpbmF0aW9uLm5leHQoYnVmZmVyKTtcbiAgICAgIH1cbiAgICB9XG4gICAgc3VwZXIuX2NvbXBsZXRlKCk7XG4gIH1cblxufVxuIl19