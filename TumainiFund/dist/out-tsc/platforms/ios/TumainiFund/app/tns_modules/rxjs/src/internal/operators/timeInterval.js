"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("../scheduler/async");
var scan_1 = require("./scan");
var defer_1 = require("../observable/defer");
var map_1 = require("./map");
function timeInterval(scheduler) {
    if (scheduler === void 0) { scheduler = async_1.async; }
    return function (source) { return defer_1.defer(function () {
        return source.pipe(
        // HACK: the typings seem off with scan
        scan_1.scan(function (_a, value) {
            var current = _a.current;
            return ({ value: value, current: scheduler.now(), last: current });
        }, { current: scheduler.now(), value: undefined, last: undefined }), map_1.map(function (_a) {
            var current = _a.current, last = _a.last, value = _a.value;
            return new TimeInterval(value, current - last);
        }));
    }); };
}
exports.timeInterval = timeInterval;
var TimeInterval = /** @class */ (function () {
    function TimeInterval(value, interval) {
        this.value = value;
        this.interval = interval;
    }
    return TimeInterval;
}());
exports.TimeInterval = TimeInterval;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZUludGVydmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb3BlcmF0b3JzL3RpbWVJbnRlcnZhbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLDRDQUEyQztBQUUzQywrQkFBOEI7QUFDOUIsNkNBQTRDO0FBQzVDLDZCQUE0QjtBQUU1QixTQUFnQixZQUFZLENBQUksU0FBZ0M7SUFBaEMsMEJBQUEsRUFBQSxZQUEyQixhQUFLO0lBQzlELE9BQU8sVUFBQyxNQUFxQixJQUFLLE9BQUEsYUFBSyxDQUFDO1FBQ3RDLE9BQU8sTUFBTSxDQUFDLElBQUk7UUFDaEIsdUNBQXVDO1FBQ3ZDLFdBQUksQ0FDRixVQUFDLEVBQVcsRUFBRSxLQUFLO2dCQUFoQixvQkFBTztZQUFjLE9BQUEsQ0FBQyxFQUFFLEtBQUssT0FBQSxFQUFFLE9BQU8sRUFBRSxTQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDO1FBQXBELENBQW9ELEVBQzVFLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFHLElBQUksRUFBRSxTQUFTLEVBQUUsQ0FDMUQsRUFDUixTQUFHLENBQXVCLFVBQUMsRUFBd0I7Z0JBQXRCLG9CQUFPLEVBQUUsY0FBSSxFQUFFLGdCQUFLO1lBQU8sT0FBQSxJQUFJLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxHQUFHLElBQUksQ0FBQztRQUF2QyxDQUF1QyxDQUFDLENBQ2pHLENBQUM7SUFDSixDQUFDLENBQUMsRUFUZ0MsQ0FTaEMsQ0FBQztBQUNMLENBQUM7QUFYRCxvQ0FXQztBQUVEO0lBQ0Usc0JBQW1CLEtBQVEsRUFBUyxRQUFnQjtRQUFqQyxVQUFLLEdBQUwsS0FBSyxDQUFHO1FBQVMsYUFBUSxHQUFSLFFBQVEsQ0FBUTtJQUFHLENBQUM7SUFDMUQsbUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLG9DQUFZIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBhc3luYyB9IGZyb20gJy4uL3NjaGVkdWxlci9hc3luYyc7XG5pbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBPcGVyYXRvckZ1bmN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgc2NhbiB9IGZyb20gJy4vc2Nhbic7XG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4uL29ic2VydmFibGUvZGVmZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi9tYXAnO1xuXG5leHBvcnQgZnVuY3Rpb24gdGltZUludGVydmFsPFQ+KHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZSA9IGFzeW5jKTogT3BlcmF0b3JGdW5jdGlvbjxULCBUaW1lSW50ZXJ2YWw8VD4+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IGRlZmVyKCgpID0+IHtcbiAgICByZXR1cm4gc291cmNlLnBpcGUoXG4gICAgICAvLyBIQUNLOiB0aGUgdHlwaW5ncyBzZWVtIG9mZiB3aXRoIHNjYW5cbiAgICAgIHNjYW4oXG4gICAgICAgICh7IGN1cnJlbnQgfSwgdmFsdWUpID0+ICh7IHZhbHVlLCBjdXJyZW50OiBzY2hlZHVsZXIubm93KCksIGxhc3Q6IGN1cnJlbnQgfSksXG4gICAgICAgIHsgY3VycmVudDogc2NoZWR1bGVyLm5vdygpLCB2YWx1ZTogdW5kZWZpbmVkLCAgbGFzdDogdW5kZWZpbmVkIH1cbiAgICAgICkgYXMgYW55LFxuICAgICAgbWFwPGFueSwgVGltZUludGVydmFsPFQ+PigoeyBjdXJyZW50LCBsYXN0LCB2YWx1ZSB9KSA9PiBuZXcgVGltZUludGVydmFsKHZhbHVlLCBjdXJyZW50IC0gbGFzdCkpLFxuICAgICk7XG4gIH0pO1xufVxuXG5leHBvcnQgY2xhc3MgVGltZUludGVydmFsPFQ+IHtcbiAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBULCBwdWJsaWMgaW50ZXJ2YWw6IG51bWJlcikge31cbn1cbiJdfQ==