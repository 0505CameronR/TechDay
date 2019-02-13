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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXN0YW1wLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvdGltZXN0YW1wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsNENBQTJDO0FBRTNDLDZCQUE0QjtBQUU1Qjs7Ozs7R0FLRztBQUNILFNBQWdCLFNBQVMsQ0FBSSxTQUFnQztJQUFoQywwQkFBQSxFQUFBLFlBQTJCLGFBQUs7SUFDM0QsT0FBTyxTQUFHLENBQUMsVUFBQyxLQUFRLElBQUssT0FBQSxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztJQUNoRSxtRkFBbUY7QUFDckYsQ0FBQztBQUhELDhCQUdDO0FBRUQ7SUFDRSxtQkFBbUIsS0FBUSxFQUFTLFNBQWlCO1FBQWxDLFVBQUssR0FBTCxLQUFLLENBQUc7UUFBUyxjQUFTLEdBQVQsU0FBUyxDQUFRO0lBQ3JELENBQUM7SUFDSCxnQkFBQztBQUFELENBQUMsQUFIRCxJQUdDO0FBSFksOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJcbmltcG9ydCB7IGFzeW5jIH0gZnJvbSAnLi4vc2NoZWR1bGVyL2FzeW5jJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24sIFNjaGVkdWxlckxpa2UsIFRpbWVzdGFtcCBhcyBUaW1lc3RhbXBJbnRlcmZhY2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuL21hcCc7XG5cbi8qKlxuICogQHBhcmFtIHNjaGVkdWxlclxuICogQHJldHVybiB7T2JzZXJ2YWJsZTxUaW1lc3RhbXA8YW55Pj58V2ViU29ja2V0U3ViamVjdDxUPnxPYnNlcnZhYmxlPFQ+fVxuICogQG1ldGhvZCB0aW1lc3RhbXBcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0aW1lc3RhbXA8VD4oc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlID0gYXN5bmMpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFRpbWVzdGFtcDxUPj4ge1xuICByZXR1cm4gbWFwKCh2YWx1ZTogVCkgPT4gbmV3IFRpbWVzdGFtcCh2YWx1ZSwgc2NoZWR1bGVyLm5vdygpKSk7XG4gIC8vIHJldHVybiAoc291cmNlOiBPYnNlcnZhYmxlPFQ+KSA9PiBzb3VyY2UubGlmdChuZXcgVGltZXN0YW1wT3BlcmF0b3Ioc2NoZWR1bGVyKSk7XG59XG5cbmV4cG9ydCBjbGFzcyBUaW1lc3RhbXA8VD4gaW1wbGVtZW50cyBUaW1lc3RhbXBJbnRlcmZhY2U8VD4ge1xuICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsdWU6IFQsIHB1YmxpYyB0aW1lc3RhbXA6IG51bWJlcikge1xuICB9XG59XG4iXX0=