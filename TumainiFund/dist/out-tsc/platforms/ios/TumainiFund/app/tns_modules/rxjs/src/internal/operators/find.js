"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/**
 * Emits only the first value emitted by the source Observable that meets some
 * condition.
 *
 * <span class="informal">Finds the first value that passes some test and emits
 * that.</span>
 *
 * ![](find.png)
 *
 * `find` searches for the first item in the source Observable that matches the
 * specified condition embodied by the `predicate`, and returns the first
 * occurrence in the source. Unlike {@link first}, the `predicate` is required
 * in `find`, and does not emit an error if a valid value is not found.
 *
 * ## Example
 * Find and emit the first click that happens on a DIV element
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const result = clicks.pipe(find(ev => ev.target.tagName === 'DIV'));
 * result.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link filter}
 * @see {@link first}
 * @see {@link findIndex}
 * @see {@link take}
 *
 * @param {function(value: T, index: number, source: Observable<T>): boolean} predicate
 * A function called with each item to test for condition matching.
 * @param {any} [thisArg] An optional argument to determine the value of `this`
 * in the `predicate` function.
 * @return {Observable<T>} An Observable of the first item that matches the
 * condition.
 * @method find
 * @owner Observable
 */
function find(predicate, thisArg) {
    if (typeof predicate !== 'function') {
        throw new TypeError('predicate is not a function');
    }
    return function (source) { return source.lift(new FindValueOperator(predicate, source, false, thisArg)); };
}
exports.find = find;
var FindValueOperator = /** @class */ (function () {
    function FindValueOperator(predicate, source, yieldIndex, thisArg) {
        this.predicate = predicate;
        this.source = source;
        this.yieldIndex = yieldIndex;
        this.thisArg = thisArg;
    }
    FindValueOperator.prototype.call = function (observer, source) {
        return source.subscribe(new FindValueSubscriber(observer, this.predicate, this.source, this.yieldIndex, this.thisArg));
    };
    return FindValueOperator;
}());
exports.FindValueOperator = FindValueOperator;
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FindValueSubscriber = /** @class */ (function (_super) {
    __extends(FindValueSubscriber, _super);
    function FindValueSubscriber(destination, predicate, source, yieldIndex, thisArg) {
        var _this = _super.call(this, destination) || this;
        _this.predicate = predicate;
        _this.source = source;
        _this.yieldIndex = yieldIndex;
        _this.thisArg = thisArg;
        _this.index = 0;
        return _this;
    }
    FindValueSubscriber.prototype.notifyComplete = function (value) {
        var destination = this.destination;
        destination.next(value);
        destination.complete();
        this.unsubscribe();
    };
    FindValueSubscriber.prototype._next = function (value) {
        var _a = this, predicate = _a.predicate, thisArg = _a.thisArg;
        var index = this.index++;
        try {
            var result = predicate.call(thisArg || this, value, index, this.source);
            if (result) {
                this.notifyComplete(this.yieldIndex ? index : value);
            }
        }
        catch (err) {
            this.destination.error(err);
        }
    };
    FindValueSubscriber.prototype._complete = function () {
        this.notifyComplete(this.yieldIndex ? -1 : undefined);
    };
    return FindValueSubscriber;
}(Subscriber_1.Subscriber));
exports.FindValueSubscriber = FindValueSubscriber;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9maW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUVBLDRDQUF5QztBQU96Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQ0c7QUFDSCxTQUFnQixJQUFJLENBQUksU0FBc0UsRUFDdEUsT0FBYTtJQUNuQyxJQUFJLE9BQU8sU0FBUyxLQUFLLFVBQVUsRUFBRTtRQUNuQyxNQUFNLElBQUksU0FBUyxDQUFDLDZCQUE2QixDQUFDLENBQUM7S0FDcEQ7SUFDRCxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBOEIsRUFBbEcsQ0FBa0csQ0FBQztBQUN2SSxDQUFDO0FBTkQsb0JBTUM7QUFFRDtJQUNFLDJCQUFvQixTQUFzRSxFQUN0RSxNQUFxQixFQUNyQixVQUFtQixFQUNuQixPQUFhO1FBSGIsY0FBUyxHQUFULFNBQVMsQ0FBNkQ7UUFDdEUsV0FBTSxHQUFOLE1BQU0sQ0FBZTtRQUNyQixlQUFVLEdBQVYsVUFBVSxDQUFTO1FBQ25CLFlBQU8sR0FBUCxPQUFPLENBQU07SUFDakMsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxRQUF1QixFQUFFLE1BQVc7UUFDdkMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksbUJBQW1CLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pILENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFWRCxJQVVDO0FBVlksOENBQWlCO0FBWTlCOzs7O0dBSUc7QUFDSDtJQUE0Qyx1Q0FBYTtJQUd2RCw2QkFBWSxXQUEwQixFQUNsQixTQUFzRSxFQUN0RSxNQUFxQixFQUNyQixVQUFtQixFQUNuQixPQUFhO1FBSmpDLFlBS0Usa0JBQU0sV0FBVyxDQUFDLFNBQ25CO1FBTG1CLGVBQVMsR0FBVCxTQUFTLENBQTZEO1FBQ3RFLFlBQU0sR0FBTixNQUFNLENBQWU7UUFDckIsZ0JBQVUsR0FBVixVQUFVLENBQVM7UUFDbkIsYUFBTyxHQUFQLE9BQU8sQ0FBTTtRQU56QixXQUFLLEdBQVcsQ0FBQyxDQUFDOztJQVExQixDQUFDO0lBRU8sNENBQWMsR0FBdEIsVUFBdUIsS0FBVTtRQUMvQixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO1FBRXJDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsV0FBVyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRVMsbUNBQUssR0FBZixVQUFnQixLQUFRO1FBQ2hCLElBQUEsU0FBMkIsRUFBMUIsd0JBQVMsRUFBRSxvQkFBZSxDQUFDO1FBQ2xDLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUMzQixJQUFJO1lBQ0YsSUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLElBQUksQ0FBQyxPQUFPLElBQUksSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzFFLElBQUksTUFBTSxFQUFFO2dCQUNWLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUN0RDtTQUNGO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUM3QjtJQUNILENBQUM7SUFFUyx1Q0FBUyxHQUFuQjtRQUNFLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3hELENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFuQ0QsQ0FBNEMsdUJBQVUsR0FtQ3JEO0FBbkNZLGtEQUFtQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T2JzZXJ2YWJsZX0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQge09wZXJhdG9yfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQge1N1YnNjcmliZXJ9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHtPcGVyYXRvckZ1bmN0aW9ufSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kPFQsIFMgZXh0ZW5kcyBUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiB2YWx1ZSBpcyBTLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNBcmc/OiBhbnkpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFMgfCB1bmRlZmluZWQ+O1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmQ8VD4ocHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNBcmc/OiBhbnkpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFQgfCB1bmRlZmluZWQ+O1xuLyoqXG4gKiBFbWl0cyBvbmx5IHRoZSBmaXJzdCB2YWx1ZSBlbWl0dGVkIGJ5IHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IG1lZXRzIHNvbWVcbiAqIGNvbmRpdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+RmluZHMgdGhlIGZpcnN0IHZhbHVlIHRoYXQgcGFzc2VzIHNvbWUgdGVzdCBhbmQgZW1pdHNcbiAqIHRoYXQuPC9zcGFuPlxuICpcbiAqICFbXShmaW5kLnBuZylcbiAqXG4gKiBgZmluZGAgc2VhcmNoZXMgZm9yIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSB0aGF0IG1hdGNoZXMgdGhlXG4gKiBzcGVjaWZpZWQgY29uZGl0aW9uIGVtYm9kaWVkIGJ5IHRoZSBgcHJlZGljYXRlYCwgYW5kIHJldHVybnMgdGhlIGZpcnN0XG4gKiBvY2N1cnJlbmNlIGluIHRoZSBzb3VyY2UuIFVubGlrZSB7QGxpbmsgZmlyc3R9LCB0aGUgYHByZWRpY2F0ZWAgaXMgcmVxdWlyZWRcbiAqIGluIGBmaW5kYCwgYW5kIGRvZXMgbm90IGVtaXQgYW4gZXJyb3IgaWYgYSB2YWxpZCB2YWx1ZSBpcyBub3QgZm91bmQuXG4gKlxuICogIyMgRXhhbXBsZVxuICogRmluZCBhbmQgZW1pdCB0aGUgZmlyc3QgY2xpY2sgdGhhdCBoYXBwZW5zIG9uIGEgRElWIGVsZW1lbnRcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGNsaWNrcyA9IGZyb21FdmVudChkb2N1bWVudCwgJ2NsaWNrJyk7XG4gKiBjb25zdCByZXN1bHQgPSBjbGlja3MucGlwZShmaW5kKGV2ID0+IGV2LnRhcmdldC50YWdOYW1lID09PSAnRElWJykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGZpbHRlcn1cbiAqIEBzZWUge0BsaW5rIGZpcnN0fVxuICogQHNlZSB7QGxpbmsgZmluZEluZGV4fVxuICogQHNlZSB7QGxpbmsgdGFrZX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pOiBib29sZWFufSBwcmVkaWNhdGVcbiAqIEEgZnVuY3Rpb24gY2FsbGVkIHdpdGggZWFjaCBpdGVtIHRvIHRlc3QgZm9yIGNvbmRpdGlvbiBtYXRjaGluZy5cbiAqIEBwYXJhbSB7YW55fSBbdGhpc0FyZ10gQW4gb3B0aW9uYWwgYXJndW1lbnQgdG8gZGV0ZXJtaW5lIHRoZSB2YWx1ZSBvZiBgdGhpc2BcbiAqIGluIHRoZSBgcHJlZGljYXRlYCBmdW5jdGlvbi5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IEFuIE9ic2VydmFibGUgb2YgdGhlIGZpcnN0IGl0ZW0gdGhhdCBtYXRjaGVzIHRoZVxuICogY29uZGl0aW9uLlxuICogQG1ldGhvZCBmaW5kXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZmluZDxUPihwcmVkaWNhdGU6ICh2YWx1ZTogVCwgaW5kZXg6IG51bWJlciwgc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBib29sZWFuLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpc0FyZz86IGFueSk6IE9wZXJhdG9yRnVuY3Rpb248VCwgVCB8IHVuZGVmaW5lZD4ge1xuICBpZiAodHlwZW9mIHByZWRpY2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ3ByZWRpY2F0ZSBpcyBub3QgYSBmdW5jdGlvbicpO1xuICB9XG4gIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgRmluZFZhbHVlT3BlcmF0b3IocHJlZGljYXRlLCBzb3VyY2UsIGZhbHNlLCB0aGlzQXJnKSkgYXMgT2JzZXJ2YWJsZTxUIHwgdW5kZWZpbmVkPjtcbn1cblxuZXhwb3J0IGNsYXNzIEZpbmRWYWx1ZU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVCB8IG51bWJlciB8IHVuZGVmaW5lZD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHByZWRpY2F0ZTogKHZhbHVlOiBULCBpbmRleDogbnVtYmVyLCBzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgc291cmNlOiBPYnNlcnZhYmxlPFQ+LFxuICAgICAgICAgICAgICBwcml2YXRlIHlpZWxkSW5kZXg6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIHByaXZhdGUgdGhpc0FyZz86IGFueSkge1xuICB9XG5cbiAgY2FsbChvYnNlcnZlcjogU3Vic2NyaWJlcjxUPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBGaW5kVmFsdWVTdWJzY3JpYmVyKG9ic2VydmVyLCB0aGlzLnByZWRpY2F0ZSwgdGhpcy5zb3VyY2UsIHRoaXMueWllbGRJbmRleCwgdGhpcy50aGlzQXJnKSk7XG4gIH1cbn1cblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBGaW5kVmFsdWVTdWJzY3JpYmVyPFQ+IGV4dGVuZHMgU3Vic2NyaWJlcjxUPiB7XG4gIHByaXZhdGUgaW5kZXg6IG51bWJlciA9IDA7XG5cbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgcHJlZGljYXRlOiAodmFsdWU6IFQsIGluZGV4OiBudW1iZXIsIHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSBzb3VyY2U6IE9ic2VydmFibGU8VD4sXG4gICAgICAgICAgICAgIHByaXZhdGUgeWllbGRJbmRleDogYm9vbGVhbixcbiAgICAgICAgICAgICAgcHJpdmF0ZSB0aGlzQXJnPzogYW55KSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICB9XG5cbiAgcHJpdmF0ZSBub3RpZnlDb21wbGV0ZSh2YWx1ZTogYW55KTogdm9pZCB7XG4gICAgY29uc3QgZGVzdGluYXRpb24gPSB0aGlzLmRlc3RpbmF0aW9uO1xuXG4gICAgZGVzdGluYXRpb24ubmV4dCh2YWx1ZSk7XG4gICAgZGVzdGluYXRpb24uY29tcGxldGUoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlKCk7XG4gIH1cblxuICBwcm90ZWN0ZWQgX25leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICBjb25zdCB7cHJlZGljYXRlLCB0aGlzQXJnfSA9IHRoaXM7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmluZGV4Kys7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IHByZWRpY2F0ZS5jYWxsKHRoaXNBcmcgfHwgdGhpcywgdmFsdWUsIGluZGV4LCB0aGlzLnNvdXJjZSk7XG4gICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgIHRoaXMubm90aWZ5Q29tcGxldGUodGhpcy55aWVsZEluZGV4ID8gaW5kZXggOiB2YWx1ZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmRlc3RpbmF0aW9uLmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgcHJvdGVjdGVkIF9jb21wbGV0ZSgpOiB2b2lkIHtcbiAgICB0aGlzLm5vdGlmeUNvbXBsZXRlKHRoaXMueWllbGRJbmRleCA/IC0xIDogdW5kZWZpbmVkKTtcbiAgfVxufVxuIl19