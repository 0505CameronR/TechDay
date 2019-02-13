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
 * Emits the given constant value on the output Observable every time the source
 * Observable emits a value.
 *
 * <span class="informal">Like {@link map}, but it maps every source value to
 * the same output value every time.</span>
 *
 * ![](mapTo.png)
 *
 * Takes a constant `value` as argument, and emits that whenever the source
 * Observable emits a value. In other words, ignores the actual source value,
 * and simply uses the emission moment to know when to emit the given `value`.
 *
 * ## Example
 * Map every click to the string 'Hi'
 * ```javascript
 * const clicks = fromEvent(document, 'click');
 * const greetings = clicks.pipe(mapTo('Hi'));
 * greetings.subscribe(x => console.log(x));
 * ```
 *
 * @see {@link map}
 *
 * @param {any} value The value to map each source value to.
 * @return {Observable} An Observable that emits the given `value` every time
 * the source Observable emits something.
 * @method mapTo
 * @owner Observable
 */
function mapTo(value) {
    return function (source) { return source.lift(new MapToOperator(value)); };
}
exports.mapTo = mapTo;
var MapToOperator = /** @class */ (function () {
    function MapToOperator(value) {
        this.value = value;
    }
    MapToOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new MapToSubscriber(subscriber, this.value));
    };
    return MapToOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var MapToSubscriber = /** @class */ (function (_super) {
    __extends(MapToSubscriber, _super);
    function MapToSubscriber(destination, value) {
        var _this = _super.call(this, destination) || this;
        _this.value = value;
        return _this;
    }
    MapToSubscriber.prototype._next = function (x) {
        this.destination.next(this.value);
    };
    return MapToSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwVG8uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9tYXBUby50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFJM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E0Qkc7QUFDSCxTQUFnQixLQUFLLENBQU8sS0FBUTtJQUNsQyxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBckMsQ0FBcUMsQ0FBQztBQUMxRSxDQUFDO0FBRkQsc0JBRUM7QUFFRDtJQUlFLHVCQUFZLEtBQVE7UUFDbEIsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7SUFDckIsQ0FBQztJQUVELDRCQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksZUFBZSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBWEQsSUFXQztBQUVEOzs7O0dBSUc7QUFDSDtJQUFvQyxtQ0FBYTtJQUkvQyx5QkFBWSxXQUEwQixFQUFFLEtBQVE7UUFBaEQsWUFDRSxrQkFBTSxXQUFXLENBQUMsU0FFbkI7UUFEQyxLQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQzs7SUFDckIsQ0FBQztJQUVTLCtCQUFLLEdBQWYsVUFBZ0IsQ0FBSTtRQUNsQixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVpELENBQW9DLHVCQUFVLEdBWTdDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT3BlcmF0b3IgfSBmcm9tICcuLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIEVtaXRzIHRoZSBnaXZlbiBjb25zdGFudCB2YWx1ZSBvbiB0aGUgb3V0cHV0IE9ic2VydmFibGUgZXZlcnkgdGltZSB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkxpa2Uge0BsaW5rIG1hcH0sIGJ1dCBpdCBtYXBzIGV2ZXJ5IHNvdXJjZSB2YWx1ZSB0b1xuICogdGhlIHNhbWUgb3V0cHV0IHZhbHVlIGV2ZXJ5IHRpbWUuPC9zcGFuPlxuICpcbiAqICFbXShtYXBUby5wbmcpXG4gKlxuICogVGFrZXMgYSBjb25zdGFudCBgdmFsdWVgIGFzIGFyZ3VtZW50LCBhbmQgZW1pdHMgdGhhdCB3aGVuZXZlciB0aGUgc291cmNlXG4gKiBPYnNlcnZhYmxlIGVtaXRzIGEgdmFsdWUuIEluIG90aGVyIHdvcmRzLCBpZ25vcmVzIHRoZSBhY3R1YWwgc291cmNlIHZhbHVlLFxuICogYW5kIHNpbXBseSB1c2VzIHRoZSBlbWlzc2lvbiBtb21lbnQgdG8ga25vdyB3aGVuIHRvIGVtaXQgdGhlIGdpdmVuIGB2YWx1ZWAuXG4gKlxuICogIyMgRXhhbXBsZVxuICogTWFwIGV2ZXJ5IGNsaWNrIHRvIHRoZSBzdHJpbmcgJ0hpJ1xuICogYGBgamF2YXNjcmlwdFxuICogY29uc3QgY2xpY2tzID0gZnJvbUV2ZW50KGRvY3VtZW50LCAnY2xpY2snKTtcbiAqIGNvbnN0IGdyZWV0aW5ncyA9IGNsaWNrcy5waXBlKG1hcFRvKCdIaScpKTtcbiAqIGdyZWV0aW5ncy5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBtYXB9XG4gKlxuICogQHBhcmFtIHthbnl9IHZhbHVlIFRoZSB2YWx1ZSB0byBtYXAgZWFjaCBzb3VyY2UgdmFsdWUgdG8uXG4gKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQgZW1pdHMgdGhlIGdpdmVuIGB2YWx1ZWAgZXZlcnkgdGltZVxuICogdGhlIHNvdXJjZSBPYnNlcnZhYmxlIGVtaXRzIHNvbWV0aGluZy5cbiAqIEBtZXRob2QgbWFwVG9cbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtYXBUbzxULCBSPih2YWx1ZTogUik6IE9wZXJhdG9yRnVuY3Rpb248VCwgUj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IE1hcFRvT3BlcmF0b3IodmFsdWUpKTtcbn1cblxuY2xhc3MgTWFwVG9PcGVyYXRvcjxULCBSPiBpbXBsZW1lbnRzIE9wZXJhdG9yPFQsIFI+IHtcblxuICB2YWx1ZTogUjtcblxuICBjb25zdHJ1Y3Rvcih2YWx1ZTogUikge1xuICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgfVxuXG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBNYXBUb1N1YnNjcmliZXIoc3Vic2NyaWJlciwgdGhpcy52YWx1ZSkpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBNYXBUb1N1YnNjcmliZXI8VCwgUj4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcblxuICB2YWx1ZTogUjtcblxuICBjb25zdHJ1Y3RvcihkZXN0aW5hdGlvbjogU3Vic2NyaWJlcjxSPiwgdmFsdWU6IFIpIHtcbiAgICBzdXBlcihkZXN0aW5hdGlvbik7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICB9XG5cbiAgcHJvdGVjdGVkIF9uZXh0KHg6IFQpIHtcbiAgICB0aGlzLmRlc3RpbmF0aW9uLm5leHQodGhpcy52YWx1ZSk7XG4gIH1cbn1cbiJdfQ==