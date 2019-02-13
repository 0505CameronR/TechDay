"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Subscriber_1 = require("../Subscriber");
/**
 * Determines whether the ErrorObserver is closed or stopped or has a
 * destination that is closed or stopped - in which case errors will
 * need to be reported via a different mechanism.
 * @param observer the observer
 */
function canReportError(observer) {
    while (observer) {
        var _a = observer, closed_1 = _a.closed, destination = _a.destination, isStopped = _a.isStopped;
        if (closed_1 || isStopped) {
            return false;
        }
        else if (destination && destination instanceof Subscriber_1.Subscriber) {
            observer = destination;
        }
        else {
            observer = null;
        }
    }
    return true;
}
exports.canReportError = canReportError;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuUmVwb3J0RXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3V0aWwvY2FuUmVwb3J0RXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBMkM7QUFHM0M7Ozs7O0dBS0c7QUFDSCxTQUFnQixjQUFjLENBQUMsUUFBd0M7SUFDckUsT0FBTyxRQUFRLEVBQUU7UUFDVCxJQUFBLGFBQW9ELEVBQWxELG9CQUFNLEVBQUUsNEJBQVcsRUFBRSx3QkFBNkIsQ0FBQztRQUMzRCxJQUFJLFFBQU0sSUFBSSxTQUFTLEVBQUU7WUFDdkIsT0FBTyxLQUFLLENBQUM7U0FDZDthQUFNLElBQUksV0FBVyxJQUFJLFdBQVcsWUFBWSx1QkFBVSxFQUFFO1lBQzNELFFBQVEsR0FBRyxXQUFXLENBQUM7U0FDeEI7YUFBTTtZQUNMLFFBQVEsR0FBRyxJQUFJLENBQUM7U0FDakI7S0FDRjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQVpELHdDQVlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJy4uL1N1YmplY3QnO1xuXG4vKipcbiAqIERldGVybWluZXMgd2hldGhlciB0aGUgRXJyb3JPYnNlcnZlciBpcyBjbG9zZWQgb3Igc3RvcHBlZCBvciBoYXMgYVxuICogZGVzdGluYXRpb24gdGhhdCBpcyBjbG9zZWQgb3Igc3RvcHBlZCAtIGluIHdoaWNoIGNhc2UgZXJyb3JzIHdpbGxcbiAqIG5lZWQgdG8gYmUgcmVwb3J0ZWQgdmlhIGEgZGlmZmVyZW50IG1lY2hhbmlzbS5cbiAqIEBwYXJhbSBvYnNlcnZlciB0aGUgb2JzZXJ2ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNhblJlcG9ydEVycm9yKG9ic2VydmVyOiBTdWJzY3JpYmVyPGFueT4gfCBTdWJqZWN0PGFueT4pOiBib29sZWFuIHtcbiAgd2hpbGUgKG9ic2VydmVyKSB7XG4gICAgY29uc3QgeyBjbG9zZWQsIGRlc3RpbmF0aW9uLCBpc1N0b3BwZWQgfSA9IG9ic2VydmVyIGFzIGFueTtcbiAgICBpZiAoY2xvc2VkIHx8IGlzU3RvcHBlZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gZWxzZSBpZiAoZGVzdGluYXRpb24gJiYgZGVzdGluYXRpb24gaW5zdGFuY2VvZiBTdWJzY3JpYmVyKSB7XG4gICAgICBvYnNlcnZlciA9IGRlc3RpbmF0aW9uO1xuICAgIH0gZWxzZSB7XG4gICAgICBvYnNlcnZlciA9IG51bGw7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuIl19