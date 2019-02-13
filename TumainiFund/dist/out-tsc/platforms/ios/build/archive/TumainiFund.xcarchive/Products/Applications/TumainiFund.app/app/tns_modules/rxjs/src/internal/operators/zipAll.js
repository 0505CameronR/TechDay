"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zip_1 = require("../observable/zip");
function zipAll(project) {
    return function (source) { return source.lift(new zip_1.ZipOperator(project)); };
}
exports.zipAll = zipAll;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiemlwQWxsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvemlwQWxsLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQWdEO0FBU2hELFNBQWdCLE1BQU0sQ0FBTyxPQUFzQztJQUNqRSxPQUFPLFVBQUMsTUFBcUIsSUFBSyxPQUFBLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxpQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQXJDLENBQXFDLENBQUM7QUFDMUUsQ0FBQztBQUZELHdCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgWmlwT3BlcmF0b3IgfSBmcm9tICcuLi9vYnNlcnZhYmxlL3ppcCc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvckZ1bmN0aW9uLCBPYnNlcnZhYmxlSW5wdXQgfSBmcm9tICcuLi90eXBlcyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXBBbGw8VD4oKTogT3BlcmF0b3JGdW5jdGlvbjxPYnNlcnZhYmxlSW5wdXQ8VD4sIFRbXT47XG5leHBvcnQgZnVuY3Rpb24gemlwQWxsPFQ+KCk6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBUW10+O1xuZXhwb3J0IGZ1bmN0aW9uIHppcEFsbDxULCBSPihwcm9qZWN0OiAoLi4udmFsdWVzOiBUW10pID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPE9ic2VydmFibGVJbnB1dDxUPiwgUj47XG5leHBvcnQgZnVuY3Rpb24gemlwQWxsPFI+KHByb2plY3Q6ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPGFueSwgUj47XG5cbmV4cG9ydCBmdW5jdGlvbiB6aXBBbGw8VCwgUj4ocHJvamVjdD86ICguLi52YWx1ZXM6IEFycmF5PGFueT4pID0+IFIpOiBPcGVyYXRvckZ1bmN0aW9uPFQsIFI+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBaaXBPcGVyYXRvcihwcm9qZWN0KSk7XG59XG4iXX0=