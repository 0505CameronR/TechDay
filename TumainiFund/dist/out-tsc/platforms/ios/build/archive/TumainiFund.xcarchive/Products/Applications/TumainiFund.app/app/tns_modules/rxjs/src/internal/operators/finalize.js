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
var Subscription_1 = require("../Subscription");
/**
 * Returns an Observable that mirrors the source Observable, but will call a specified function when
 * the source terminates on complete or error.
 * @param {function} callback Function to be called when source terminates.
 * @return {Observable} An Observable that mirrors the source, but will call the specified function on termination.
 * @method finally
 * @owner Observable
 */
function finalize(callback) {
    return function (source) { return source.lift(new FinallyOperator(callback)); };
}
exports.finalize = finalize;
var FinallyOperator = /** @class */ (function () {
    function FinallyOperator(callback) {
        this.callback = callback;
    }
    FinallyOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new FinallySubscriber(subscriber, this.callback));
    };
    return FinallyOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var FinallySubscriber = /** @class */ (function (_super) {
    __extends(FinallySubscriber, _super);
    function FinallySubscriber(destination, callback) {
        var _this = _super.call(this, destination) || this;
        _this.add(new Subscription_1.Subscription(callback));
        return _this;
    }
    return FinallySubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluYWxpemUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29wZXJhdG9ycy9maW5hbGl6ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFDQSw0Q0FBMkM7QUFDM0MsZ0RBQStDO0FBSS9DOzs7Ozs7O0dBT0c7QUFDSCxTQUFnQixRQUFRLENBQUksUUFBb0I7SUFDOUMsT0FBTyxVQUFDLE1BQXFCLElBQUssT0FBQSxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQTFDLENBQTBDLENBQUM7QUFDL0UsQ0FBQztBQUZELDRCQUVDO0FBRUQ7SUFDRSx5QkFBb0IsUUFBb0I7UUFBcEIsYUFBUSxHQUFSLFFBQVEsQ0FBWTtJQUN4QyxDQUFDO0lBRUQsOEJBQUksR0FBSixVQUFLLFVBQXlCLEVBQUUsTUFBVztRQUN6QyxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDNUUsQ0FBQztJQUNILHNCQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFFRDs7OztHQUlHO0FBQ0g7SUFBbUMscUNBQWE7SUFDOUMsMkJBQVksV0FBMEIsRUFBRSxRQUFvQjtRQUE1RCxZQUNFLGtCQUFNLFdBQVcsQ0FBQyxTQUVuQjtRQURDLEtBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSwyQkFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7O0lBQ3ZDLENBQUM7SUFDSCx3QkFBQztBQUFELENBQUMsQUFMRCxDQUFtQyx1QkFBVSxHQUs1QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IE1vbm9UeXBlT3BlcmF0b3JGdW5jdGlvbiwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBSZXR1cm5zIGFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBzb3VyY2UgT2JzZXJ2YWJsZSwgYnV0IHdpbGwgY2FsbCBhIHNwZWNpZmllZCBmdW5jdGlvbiB3aGVuXG4gKiB0aGUgc291cmNlIHRlcm1pbmF0ZXMgb24gY29tcGxldGUgb3IgZXJyb3IuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayBGdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiBzb3VyY2UgdGVybWluYXRlcy5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEFuIE9ic2VydmFibGUgdGhhdCBtaXJyb3JzIHRoZSBzb3VyY2UsIGJ1dCB3aWxsIGNhbGwgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiBvbiB0ZXJtaW5hdGlvbi5cbiAqIEBtZXRob2QgZmluYWxseVxuICogQG93bmVyIE9ic2VydmFibGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpbmFsaXplPFQ+KGNhbGxiYWNrOiAoKSA9PiB2b2lkKTogTW9ub1R5cGVPcGVyYXRvckZ1bmN0aW9uPFQ+IHtcbiAgcmV0dXJuIChzb3VyY2U6IE9ic2VydmFibGU8VD4pID0+IHNvdXJjZS5saWZ0KG5ldyBGaW5hbGx5T3BlcmF0b3IoY2FsbGJhY2spKTtcbn1cblxuY2xhc3MgRmluYWxseU9wZXJhdG9yPFQ+IGltcGxlbWVudHMgT3BlcmF0b3I8VCwgVD4ge1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gIH1cblxuICBjYWxsKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4sIHNvdXJjZTogYW55KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgcmV0dXJuIHNvdXJjZS5zdWJzY3JpYmUobmV3IEZpbmFsbHlTdWJzY3JpYmVyKHN1YnNjcmliZXIsIHRoaXMuY2FsbGJhY2spKTtcbiAgfVxufVxuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuY2xhc3MgRmluYWxseVN1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgY29uc3RydWN0b3IoZGVzdGluYXRpb246IFN1YnNjcmliZXI8VD4sIGNhbGxiYWNrOiAoKSA9PiB2b2lkKSB7XG4gICAgc3VwZXIoZGVzdGluYXRpb24pO1xuICAgIHRoaXMuYWRkKG5ldyBTdWJzY3JpcHRpb24oY2FsbGJhY2spKTtcbiAgfVxufVxuIl19