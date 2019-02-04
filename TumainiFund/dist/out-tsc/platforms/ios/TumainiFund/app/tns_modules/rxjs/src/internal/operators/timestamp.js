"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var map_1 = require("./map");
/**
 * @param scheduler
 * @return {Observable<Timestamp<any>>|WebSocketSubject<T>|Observable<T>}
 * @method timestamp
 * @owner Observable
 */
function timestamp(scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return map_1.map(function (value) { return new Timestamp(value, scheduler.now()); });
    // return (source: Observable<T>) => source.lift(new TimestampOperator(scheduler));
}
exports.timestamp = timestamp;
var Timestamp = /** @class */ (function () {
    function Timestamp(value, timestamp) {
        this.value = value;
        this.timestamp = timestamp;
    }
    return Timestamp;
}());
exports.Timestamp = Timestamp;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXN0YW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3RpbWVzdGFtcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUUzQyw2QkFBNEI7QUFFNUI7Ozs7O0dBS0c7QUFDSCxTQUFnQixTQUFTLENBQUksU0FBZ0M7SUFBaEMsMEJBQUEsRUFBQSxZQUEyQixhQUFLO0lBQzNELE9BQU8sU0FBRyxDQUFDLFVBQUMsS0FBUSxJQUFLLE9BQUEsSUFBSSxTQUFTLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFyQyxDQUFxQyxDQUFDLENBQUM7SUFDaEUsbUZBQW1GO0FBQ3JGLENBQUM7QUFIRCw4QkFHQztBQUVEO0lBQ0UsbUJBQW1CLEtBQVEsRUFBUyxTQUFpQjtRQUFsQyxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBUTtJQUNyRCxDQUFDO0lBQ0gsZ0JBQUM7QUFBRCxDQUFDLEFBSEQsSUFHQztBQUhZLDhCQUFTIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBTY2hlZHVsZXJMaWtlLCBUaW1lc3RhbXAgYXMgVGltZXN0YW1wSW50ZXJmYWNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuXG4vKipcbiAqIEBwYXJhbSBzY2hlZHVsZXJcbiAqIEByZXR1cm4ge09ic2VydmFibGU8VGltZXN0YW1wPGFueT4+fFdlYlNvY2tldFN1YmplY3Q8VD58T2JzZXJ2YWJsZTxUPn1cbiAqIEBtZXRob2QgdGltZXN0YW1wXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdGltZXN0YW1wPFQ+KHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUaW1lc3RhbXA8VD4+IHtcbiAgcmV0dXJuIG1hcCgodmFsdWU6IFQpID0+IG5ldyBUaW1lc3RhbXAodmFsdWUsIHNjaGVkdWxlci5ub3coKSkpO1xuICAvLyByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gc291cmNlLmxpZnQobmV3IFRpbWVzdGFtcE9wZXJhdG9yKHNjaGVkdWxlcikpO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZXN0YW1wPFQ+IGltcGxlbWVudHMgVGltZXN0YW1wSW50ZXJmYWNlPFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBULCBwdWJsaWMgdGltZXN0YW1wOiBudW1iZXIpIHtcbiAgfVxufVxuIl19