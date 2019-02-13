import { tap } from './tap';
import { EmptyError } from '../util/EmptyError';
/**
 * If the source observable completes without emitting a value, it will emit
 * an error. The error will be created at that time by the optional
 * `errorFactory` argument, otherwise, the error will be {@link EmptyError}.
 *
 * ![](throwIfEmpty.png)
 *
 * ## Example
 * ```javascript
 * const click$ = fromEvent(button, 'click');
 *
 * clicks$.pipe(
 *   takeUntil(timer(1000)),
 *   throwIfEmpty(
 *     () => new Error('the button was not clicked within 1 second')
 *   ),
 * )
 * .subscribe({
 *   next() { console.log('The button was clicked'); },
 *   error(err) { console.error(err); },
 * });
 * ```
 *
 * @param {Function} [errorFactory] A factory function called to produce the
 * error to be thrown when the source observable completes without emitting a
 * value.
 */
export const throwIfEmpty = (errorFactory = defaultErrorFactory) => tap({
    hasValue: false,
    next() { this.hasValue = true; },
    complete() {
        if (!this.hasValue) {
            throw errorFactory();
        }
    }
});
function defaultErrorFactory() {
    return new EmptyError();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGhyb3dJZkVtcHR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3Rocm93SWZFbXB0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sT0FBTyxDQUFDO0FBQzVCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUdoRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQ3ZCLENBQUksZUFBNEIsbUJBQW1CLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBSTtJQUM3RCxRQUFRLEVBQUUsS0FBSztJQUNmLElBQUksS0FBSyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDaEMsUUFBUTtRQUNOLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2xCLE1BQU0sWUFBWSxFQUFFLENBQUM7U0FDdEI7SUFDSCxDQUFDO0NBQ0ssQ0FBQyxDQUFDO0FBRVosU0FBUyxtQkFBbUI7SUFDMUIsT0FBTyxJQUFJLFVBQVUsRUFBRSxDQUFDO0FBQzFCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyB0YXAgfSBmcm9tICcuL3RhcCc7XG5pbXBvcnQgeyBFbXB0eUVycm9yIH0gZnJvbSAnLi4vdXRpbC9FbXB0eUVycm9yJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBJZiB0aGUgc291cmNlIG9ic2VydmFibGUgY29tcGxldGVzIHdpdGhvdXQgZW1pdHRpbmcgYSB2YWx1ZSwgaXQgd2lsbCBlbWl0XG4gKiBhbiBlcnJvci4gVGhlIGVycm9yIHdpbGwgYmUgY3JlYXRlZCBhdCB0aGF0IHRpbWUgYnkgdGhlIG9wdGlvbmFsXG4gKiBgZXJyb3JGYWN0b3J5YCBhcmd1bWVudCwgb3RoZXJ3aXNlLCB0aGUgZXJyb3Igd2lsbCBiZSB7QGxpbmsgRW1wdHlFcnJvcn0uXG4gKlxuICogIVtdKHRocm93SWZFbXB0eS5wbmcpXG4gKlxuICogIyMgRXhhbXBsZVxuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2skID0gZnJvbUV2ZW50KGJ1dHRvbiwgJ2NsaWNrJyk7XG4gKlxuICogY2xpY2tzJC5waXBlKFxuICogICB0YWtlVW50aWwodGltZXIoMTAwMCkpLFxuICogICB0aHJvd0lmRW1wdHkoXG4gKiAgICAgKCkgPT4gbmV3IEVycm9yKCd0aGUgYnV0dG9uIHdhcyBub3QgY2xpY2tlZCB3aXRoaW4gMSBzZWNvbmQnKVxuICogICApLFxuICogKVxuICogLnN1YnNjcmliZSh7XG4gKiAgIG5leHQoKSB7IGNvbnNvbGUubG9nKCdUaGUgYnV0dG9uIHdhcyBjbGlja2VkJyk7IH0sXG4gKiAgIGVycm9yKGVycikgeyBjb25zb2xlLmVycm9yKGVycik7IH0sXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtlcnJvckZhY3RvcnldIEEgZmFjdG9yeSBmdW5jdGlvbiBjYWxsZWQgdG8gcHJvZHVjZSB0aGVcbiAqIGVycm9yIHRvIGJlIHRocm93biB3aGVuIHRoZSBzb3VyY2Ugb2JzZXJ2YWJsZSBjb21wbGV0ZXMgd2l0aG91dCBlbWl0dGluZyBhXG4gKiB2YWx1ZS5cbiAqL1xuZXhwb3J0IGNvbnN0IHRocm93SWZFbXB0eSA9XG4gIDxUPihlcnJvckZhY3Rvcnk6ICgoKSA9PiBhbnkpID0gZGVmYXVsdEVycm9yRmFjdG9yeSkgPT4gdGFwPFQ+KHtcbiAgICBoYXNWYWx1ZTogZmFsc2UsXG4gICAgbmV4dCgpIHsgdGhpcy5oYXNWYWx1ZSA9IHRydWU7IH0sXG4gICAgY29tcGxldGUoKSB7XG4gICAgICBpZiAoIXRoaXMuaGFzVmFsdWUpIHtcbiAgICAgICAgdGhyb3cgZXJyb3JGYWN0b3J5KCk7XG4gICAgICB9XG4gICAgfVxuICB9IGFzIGFueSk7XG5cbmZ1bmN0aW9uIGRlZmF1bHRFcnJvckZhY3RvcnkoKSB7XG4gIHJldHVybiBuZXcgRW1wdHlFcnJvcigpO1xufVxuIl19