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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZUludGVydmFsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZUludGVydmFsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBRUEsNENBQTJDO0FBRTNDLCtCQUE4QjtBQUM5Qiw2Q0FBNEM7QUFDNUMsNkJBQTRCO0FBRTVCLFNBQWdCLFlBQVksQ0FBSSxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDOUQsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxhQUFLLENBQUM7UUFDdEMsT0FBTyxNQUFNLENBQUMsSUFBSTtRQUNoQix1Q0FBdUM7UUFDdkMsV0FBSSxDQUNGLFVBQUMsRUFBVyxFQUFFLEtBQUs7Z0JBQWhCLG9CQUFPO1lBQWMsT0FBQSxDQUFDLEVBQUUsS0FBSyxPQUFBLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUM7UUFBcEQsQ0FBb0QsRUFDNUUsRUFBRSxPQUFPLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUcsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUMxRCxFQUNSLFNBQUcsQ0FBdUIsVUFBQyxFQUF3QjtnQkFBdEIsb0JBQU8sRUFBRSxjQUFJLEVBQUUsZ0JBQUs7WUFBTyxPQUFBLElBQUksWUFBWSxDQUFDLEtBQUssRUFBRSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQXZDLENBQXVDLENBQUMsQ0FDakcsQ0FBQztJQUNKLENBQUMsQ0FBQyxFQVRnQyxDQVNoQyxDQUFDO0FBQ0wsQ0FBQztBQVhELG9DQVdDO0FBRUQ7SUFDRSxzQkFBbUIsS0FBUSxFQUFTLFFBQWdCO1FBQWpDLFVBQUssR0FBTCxLQUFLLENBQUc7UUFBUyxhQUFRLEdBQVIsUUFBUSxDQUFRO0lBQUcsQ0FBQztJQUMxRCxtQkFBQztBQUFELENBQUMsQUFGRCxJQUVDO0FBRlksb0NBQVkiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IFNjaGVkdWxlckxpa2UsIE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBzY2FuIH0gZnJvbSAnLi9zY2FuJztcbmltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi4vb2JzZXJ2YWJsZS9kZWZlcic7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5cbmV4cG9ydCBmdW5jdGlvbiB0aW1lSW50ZXJ2YWw8VD4oc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRpbWVJbnRlcnZhbDxUPj4ge1xuICByZXR1cm4gKHNvdXJjZTogT2JzZXJ2YWJsZTxUPikgPT4gZGVmZXIoKCkgPT4ge1xuICAgIHJldHVybiBzb3VyY2UucGlwZShcbiAgICAgIC8vIEhBQ0s6IHRoZSB0eXBpbmdzIHNlZW0gb2ZmIHdpdGggc2NhblxuICAgICAgc2NhbihcbiAgICAgICAgKHsgY3VycmVudCB9LCB2YWx1ZSkgPT4gKHsgdmFsdWUsIGN1cnJlbnQ6IHNjaGVkdWxlci5ub3coKSwgbGFzdDogY3VycmVudCB9KSxcbiAgICAgICAgeyBjdXJyZW50OiBzY2hlZHVsZXIubm93KCksIHZhbHVlOiB1bmRlZmluZWQsICBsYXN0OiB1bmRlZmluZWQgfVxuICAgICAgKSBhcyBhbnksXG4gICAgICBtYXA8YW55LCBUaW1lSW50ZXJ2YWw8VD4+KCh7IGN1cnJlbnQsIGxhc3QsIHZhbHVlIH0pID0+IG5ldyBUaW1lSW50ZXJ2YWwodmFsdWUsIGN1cnJlbnQgLSBsYXN0KSksXG4gICAgKTtcbiAgfSk7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lSW50ZXJ2YWw8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IFQsIHB1YmxpYyBpbnRlcnZhbDogbnVtYmVyKSB7fVxufVxuIl19