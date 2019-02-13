import { fromArray } from '../observable/fromArray';
import { scalar } from '../observable/scalar';
import { empty } from '../observable/empty';
import { concat as concatStatic } from '../observable/concat';
import { isScheduler } from '../util/isScheduler';
/* tslint:enable:max-line-length */
/**
 * Returns an Observable that emits the items you specify as arguments after it finishes emitting
 * items emitted by the source Observable.
 *
 * ![](endWith.png)
 *
 * ## Example
 * ### After the source observable completes, appends an emission and then completes too.
 *
 * ```javascript
 * of('hi', 'how are you?', 'sorry, I have to go now').pipe(
 *   endWith('goodbye!'),
 * )
 * .subscribe(word => console.log(word));
 * // result:
 * // 'hi'
 * // 'how are you?'
 * // 'sorry, I have to go now'
 * // 'goodbye!'
 * ```
 *
 * @param {...T} values - Items you want the modified Observable to emit last.
 * @param {SchedulerLike} [scheduler] - A {@link SchedulerLike} to use for scheduling
 * the emissions of the `next` notifications.
 * @return {Observable} An Observable that emits the items emitted by the source Observable
 *  and then emits the items in the specified Iterable.
 * @method endWith
 * @owner Observable
 */
export function endWith(...array) {
    return (source) => {
        let scheduler = array[array.length - 1];
        if (isScheduler(scheduler)) {
            array.pop();
        }
        else {
            scheduler = null;
        }
        const len = array.length;
        if (len === 1 && !scheduler) {
            return concatStatic(source, scalar(array[0]));
        }
        else if (len > 0) {
            return concatStatic(source, fromArray(array, scheduler));
        }
        else {
            return concatStatic(source, empty(scheduler));
        }
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZW5kV2l0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9lbmRXaXRoLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNwRCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUMsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzVDLE9BQU8sRUFBRSxNQUFNLElBQUksWUFBWSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDOUQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBWWxELG1DQUFtQztBQUVuQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQUNILE1BQU0sVUFBVSxPQUFPLENBQUksR0FBRyxLQUErQjtJQUMzRCxPQUFPLENBQUMsTUFBcUIsRUFBRSxFQUFFO1FBQy9CLElBQUksU0FBUyxHQUFrQixLQUFLLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN2RCxJQUFJLFdBQVcsQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUMxQixLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDYjthQUFNO1lBQ0wsU0FBUyxHQUFHLElBQUksQ0FBQztTQUNsQjtRQUVELE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDekIsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzNCLE9BQU8sWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBTSxDQUFDLENBQUMsQ0FBQztTQUNwRDthQUFNLElBQUksR0FBRyxHQUFHLENBQUMsRUFBRTtZQUNsQixPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUUsU0FBUyxDQUFDLEtBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxDQUFDO1NBQ2pFO2FBQU07WUFDTCxPQUFPLFlBQVksQ0FBSSxNQUFNLEVBQUUsS0FBSyxDQUFDLFNBQVMsQ0FBUSxDQUFDLENBQUM7U0FDekQ7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgZnJvbUFycmF5IH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9mcm9tQXJyYXknO1xuaW1wb3J0IHsgc2NhbGFyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9zY2FsYXInO1xuaW1wb3J0IHsgZW1wdHkgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2VtcHR5JztcbmltcG9ydCB7IGNvbmNhdCBhcyBjb25jYXRTdGF0aWMgfSBmcm9tICcuLi9vYnNlcnZhYmxlL2NvbmNhdCc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKiB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGggKi9cbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZW5kV2l0aDxUPih2MTogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCB2MjogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCB2MjogVCwgdjM6IFQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZW5kV2l0aDxUPih2MTogVCwgdjI6IFQsIHYzOiBULCB2NDogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCB2MjogVCwgdjM6IFQsIHY0OiBULCB2NTogVCwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPjtcbmV4cG9ydCBmdW5jdGlvbiBlbmRXaXRoPFQ+KHYxOiBULCB2MjogVCwgdjM6IFQsIHY0OiBULCB2NTogVCwgdjY6IFQsIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD47XG5leHBvcnQgZnVuY3Rpb24gZW5kV2l0aDxUPiguLi5hcnJheTogQXJyYXk8VCB8IFNjaGVkdWxlckxpa2U+KTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+O1xuLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbXMgeW91IHNwZWNpZnkgYXMgYXJndW1lbnRzIGFmdGVyIGl0IGZpbmlzaGVzIGVtaXR0aW5nXG4gKiBpdGVtcyBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiAhW10oZW5kV2l0aC5wbmcpXG4gKlxuICogIyMgRXhhbXBsZVxuICogIyMjIEFmdGVyIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMsIGFwcGVuZHMgYW4gZW1pc3Npb24gYW5kIHRoZW4gY29tcGxldGVzIHRvby5cbiAqXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBvZignaGknLCAnaG93IGFyZSB5b3U/JywgJ3NvcnJ5LCBJIGhhdmUgdG8gZ28gbm93JykucGlwZShcbiAqICAgZW5kV2l0aCgnZ29vZGJ5ZSEnKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUod29yZCA9PiBjb25zb2xlLmxvZyh3b3JkKSk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAnaGknXG4gKiAvLyAnaG93IGFyZSB5b3U/J1xuICogLy8gJ3NvcnJ5LCBJIGhhdmUgdG8gZ28gbm93J1xuICogLy8gJ2dvb2RieWUhJ1xuICogYGBgXG4gKlxuICogQHBhcmFtIHsuLi5UfSB2YWx1ZXMgLSBJdGVtcyB5b3Ugd2FudCB0aGUgbW9kaWZpZWQgT2JzZXJ2YWJsZSB0byBlbWl0IGxhc3QuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIC0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gdG8gdXNlIGZvciBzY2hlZHVsaW5nXG4gKiB0aGUgZW1pc3Npb25zIG9mIHRoZSBgbmV4dGAgbm90aWZpY2F0aW9ucy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBlbWl0cyB0aGUgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGVcbiAqICBhbmQgdGhlbiBlbWl0cyB0aGUgaXRlbXMgaW4gdGhlIHNwZWNpZmllZCBJdGVyYWJsZS5cbiAqIEBtZXRob2QgZW5kV2l0aFxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGVuZFdpdGg8VD4oLi4uYXJyYXk6IEFycmF5PFQgfCBTY2hlZHVsZXJMaWtlPik6IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbjxUPiB7XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB7XG4gICAgbGV0IHNjaGVkdWxlciA9IDxTY2hlZHVsZXJMaWtlPmFycmF5W2FycmF5Lmxlbmd0aCAtIDFdO1xuICAgIGlmIChpc1NjaGVkdWxlcihzY2hlZHVsZXIpKSB7XG4gICAgICBhcnJheS5wb3AoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2NoZWR1bGVyID0gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgaWYgKGxlbiA9PT0gMSAmJiAhc2NoZWR1bGVyKSB7XG4gICAgICByZXR1cm4gY29uY2F0U3RhdGljKHNvdXJjZSwgc2NhbGFyKGFycmF5WzBdIGFzIFQpKTtcbiAgICB9IGVsc2UgaWYgKGxlbiA+IDApIHtcbiAgICAgIHJldHVybiBjb25jYXRTdGF0aWMoc291cmNlLCBmcm9tQXJyYXkoYXJyYXkgYXMgVFtdLCBzY2hlZHVsZXIpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGNvbmNhdFN0YXRpYzxUPihzb3VyY2UsIGVtcHR5KHNjaGVkdWxlcikgYXMgYW55KTtcbiAgICB9XG4gIH07XG59XG4iXX0=