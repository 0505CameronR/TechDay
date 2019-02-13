"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ArgumentOutOfRangeError_1 = require("../util/ArgumentOutOfRangeError");
var filter_1 = require("./filter");
var throwIfEmpty_1 = require("./throwIfEmpty");
var defaultIfEmpty_1 = require("./defaultIfEmpty");
var take_1 = require("./take");
/**
 * Emits the single value at the specified `index` in a sequence of emissions
 * from the source Observable.
 *
 * <span class="informal">Emits only the i-th value, then completes.</span>
 *
 * ![](elementAt.png)
 *
 * `elementAt` returns an Observable that emits the item at the specified
 * `index` in the source Observable, or a default value if that `index` is out
 * of range and the `default` argument is provided. If the `default` argument is
 * not given and the `index` is out of range, the output Observable will emit an
 * `ArgumentOutOfRangeError` error.
 *
 * ## Example
 * Emit only the third click event
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(elementAt(2));
 * result.subscribe(x => console.log(x));
 *
 * // Results in:
 * // click 1 = nothing
 * // click 2 = nothing
 * // click 3 = MouseEvent object logged to console
 * ```
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link skip}
 * @see {@link single}
 * @see {@link take}
 *
 * @throws {ArgumentOutOfRangeError} When using `elementAt(i)`, it delivers an
 * ArgumentOutOrRangeError to the Observer's `error` callback if `i < 0` or the
 * Observable has completed before emitting the i-th `next` notification.
 *
 * @param {number} index Is the number `i` for the i-th source emission that has
 * happened since the subscription, starting from the number `0`.
 * @param {T} [defaultValue] The default value returned for missing indices.
 * @return {Observable} An Observable that emits a single item, if it is found.
 * Otherwise, will emit the default value if given. If not, then emits an error.
 * @method elementAt
 * @owner Observable
 */
function elementAt(index, defaultValue) {
    if (index < 0) {
        throw new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError();
    }
    var hasDefaultValue = arguments.length >= 2;
    return function (source) { return source.pipe(filter_1.filter(function (v, i) { return i === index; }), take_1.take(1), hasDefaultValue
        ? defaultIfEmpty_1.defaultIfEmpty(defaultValue)
        : throwIfEmpty_1.throwIfEmpty(function () { return new ArgumentOutOfRangeError_1.ArgumentOutOfRangeError(); })); };
}
exports.elementAt = elementAt;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxlbWVudEF0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvZWxlbWVudEF0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsMkVBQTBFO0FBRzFFLG1DQUFrQztBQUNsQywrQ0FBOEM7QUFDOUMsbURBQWtEO0FBQ2xELCtCQUE4QjtBQUU5Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Q0c7QUFDSCxTQUFnQixTQUFTLENBQUksS0FBYSxFQUFFLFlBQWdCO0lBQzFELElBQUksS0FBSyxHQUFHLENBQUMsRUFBRTtRQUFFLE1BQU0sSUFBSSxpREFBdUIsRUFBRSxDQUFDO0tBQUU7SUFDdkQsSUFBTSxlQUFlLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUM7SUFDOUMsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUMzQyxlQUFNLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLE9BQUEsQ0FBQyxLQUFLLEtBQUssRUFBWCxDQUFXLENBQUMsRUFDN0IsV0FBSSxDQUFDLENBQUMsQ0FBQyxFQUNQLGVBQWU7UUFDYixDQUFDLENBQUMsK0JBQWMsQ0FBQyxZQUFZLENBQUM7UUFDOUIsQ0FBQyxDQUFDLDJCQUFZLENBQUMsY0FBTSxPQUFBLElBQUksaURBQXVCLEVBQUUsRUFBN0IsQ0FBNkIsQ0FBQyxDQUN0RCxFQU5pQyxDQU1qQyxDQUFDO0FBQ0osQ0FBQztBQVZELDhCQVVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvciB9IGZyb20gJy4uL3V0aWwvQXJndW1lbnRPdXRPZlJhbmdlRXJyb3InO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgZmlsdGVyIH0gZnJvbSAnLi9maWx0ZXInO1xuaW1wb3J0IHsgdGhyb3dJZkVtcHR5IH0gZnJvbSAnLi90aHJvd0lmRW1wdHknO1xuaW1wb3J0IHsgZGVmYXVsdElmRW1wdHkgfSBmcm9tICcuL2RlZmF1bHRJZkVtcHR5JztcbmltcG9ydCB7IHRha2UgfSBmcm9tICcuL3Rha2UnO1xuXG4vKipcbiAqIEVtaXRzIHRoZSBzaW5nbGUgdmFsdWUgYXQgdGhlIHNwZWNpZmllZCBgaW5kZXhgIGluIGEgc2VxdWVuY2Ugb2YgZW1pc3Npb25zXG4gKiBmcm9tIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RW1pdHMgb25seSB0aGUgaS10aCB2YWx1ZSwgdGhlbiBjb21wbGV0ZXMuPC9zcGFuPlxuICpcbiAqICFbXShlbGVtZW50QXQucG5nKVxuICpcbiAqIGBlbGVtZW50QXRgIHJldHVybnMgYW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHRoZSBpdGVtIGF0IHRoZSBzcGVjaWZpZWRcbiAqIGBpbmRleGAgaW4gdGhlIHNvdXJjZSBPYnNlcnZhYmxlLCBvciBhIGRlZmF1bHQgdmFsdWUgaWYgdGhhdCBgaW5kZXhgIGlzIG91dFxuICogb2YgcmFuZ2UgYW5kIHRoZSBgZGVmYXVsdGAgYXJndW1lbnQgaXMgcHJvdmlkZWQuIElmIHRoZSBgZGVmYXVsdGAgYXJndW1lbnQgaXNcbiAqIG5vdCBnaXZlbiBhbmQgdGhlIGBpbmRleGAgaXMgb3V0IG9mIHJhbmdlLCB0aGUgb3V0cHV0IE9ic2VydmFibGUgd2lsbCBlbWl0IGFuXG4gKiBgQXJndW1lbnRPdXRPZlJhbmdlRXJyb3JgIGVycm9yLlxuICpcbiAqICMjIEV4YW1wbGVcbiAqIEVtaXQgb25seSB0aGUgdGhpcmQgY2xpY2sgZXZlbnRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShlbGVtZW50QXQoMikpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqXG4gKiAvLyBSZXN1bHRzIGluOlxuICogLy8gY2xpY2sgMSA9IG5vdGhpbmdcbiAqIC8vIGNsaWNrIDIgPSBub3RoaW5nXG4gKiAvLyBjbGljayAzID0gTW91c2VFdmVudCBvYmplY3QgbG9nZ2VkIHRvIGNvbnNvbGVcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZpcnN0fVxuICogQHNlZSB7QGxpbmsgbGFzdH1cbiAqIEBzZWUge0BsaW5rIHNraXB9XG4gKiBAc2VlIHtAbGluayBzaW5nbGV9XG4gKiBAc2VlIHtAbGluayB0YWtlfVxuICpcbiAqIEB0aHJvd3Mge0FyZ3VtZW50T3V0T2ZSYW5nZUVycm9yfSBXaGVuIHVzaW5nIGBlbGVtZW50QXQoaSlgLCBpdCBkZWxpdmVycyBhblxuICogQXJndW1lbnRPdXRPclJhbmdlRXJyb3IgdG8gdGhlIE9ic2VydmVyJ3MgYGVycm9yYCBjYWxsYmFjayBpZiBgaSA8IDBgIG9yIHRoZVxuICogT2JzZXJ2YWJsZSBoYXMgY29tcGxldGVkIGJlZm9yZSBlbWl0dGluZyB0aGUgaS10aCBgbmV4dGAgbm90aWZpY2F0aW9uLlxuICpcbiAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBJcyB0aGUgbnVtYmVyIGBpYCBmb3IgdGhlIGktdGggc291cmNlIGVtaXNzaW9uIHRoYXQgaGFzXG4gKiBoYXBwZW5lZCBzaW5jZSB0aGUgc3Vic2NyaXB0aW9uLCBzdGFydGluZyBmcm9tIHRoZSBudW1iZXIgYDBgLlxuICogQHBhcmFtIHtUfSBbZGVmYXVsdFZhbHVlXSBUaGUgZGVmYXVsdCB2YWx1ZSByZXR1cm5lZCBmb3IgbWlzc2luZyBpbmRpY2VzLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIGEgc2luZ2xlIGl0ZW0sIGlmIGl0IGlzIGZvdW5kLlxuICogT3RoZXJ3aXNlLCB3aWxsIGVtaXQgdGhlIGRlZmF1bHQgdmFsdWUgaWYgZ2l2ZW4uIElmIG5vdCwgdGhlbiBlbWl0cyBhbiBlcnJvci5cbiAqIEBtZXRob2QgZWxlbWVudEF0XG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZWxlbWVudEF0PFQ+KGluZGV4OiBudW1iZXIsIGRlZmF1bHRWYWx1ZT86IFQpOiBNb25vVHlwZU9wZXJhdG9yRnVuY3Rpb248VD4ge1xuICBpZiAoaW5kZXggPCAwKSB7IHRocm93IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcigpOyB9XG4gIGNvbnN0IGhhc0RlZmF1bHRWYWx1ZSA9IGFyZ3VtZW50cy5sZW5ndGggPj0gMjtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5waXBlKFxuICAgIGZpbHRlcigodiwgaSkgPT4gaSA9PT0gaW5kZXgpLFxuICAgIHRha2UoMSksXG4gICAgaGFzRGVmYXVsdFZhbHVlXG4gICAgICA/IGRlZmF1bHRJZkVtcHR5KGRlZmF1bHRWYWx1ZSlcbiAgICAgIDogdGhyb3dJZkVtcHR5KCgpID0+IG5ldyBBcmd1bWVudE91dE9mUmFuZ2VFcnJvcigpKSxcbiAgKTtcbn1cbiJdfQ==