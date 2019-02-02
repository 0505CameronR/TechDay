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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FuUmVwb3J0RXJyb3IuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC91dGlsL2NhblJlcG9ydEVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBRzNDOzs7OztHQUtHO0FBQ0gsU0FBZ0IsY0FBYyxDQUFDLFFBQXdDO0lBQ3JFLE9BQU8sUUFBUSxFQUFFO1FBQ1QsSUFBQSxhQUFvRCxFQUFsRCxvQkFBTSxFQUFFLDRCQUFXLEVBQUUsd0JBQTZCLENBQUM7UUFDM0QsSUFBSSxRQUFNLElBQUksU0FBUyxFQUFFO1lBQ3ZCLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7YUFBTSxJQUFJLFdBQVcsSUFBSSxXQUFXLFlBQVksdUJBQVUsRUFBRTtZQUMzRCxRQUFRLEdBQUcsV0FBVyxDQUFDO1NBQ3hCO2FBQU07WUFDTCxRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFaRCx3Q0FZQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcblxuLyoqXG4gKiBEZXRlcm1pbmVzIHdoZXRoZXIgdGhlIEVycm9yT2JzZXJ2ZXIgaXMgY2xvc2VkIG9yIHN0b3BwZWQgb3IgaGFzIGFcbiAqIGRlc3RpbmF0aW9uIHRoYXQgaXMgY2xvc2VkIG9yIHN0b3BwZWQgLSBpbiB3aGljaCBjYXNlIGVycm9ycyB3aWxsXG4gKiBuZWVkIHRvIGJlIHJlcG9ydGVkIHZpYSBhIGRpZmZlcmVudCBtZWNoYW5pc20uXG4gKiBAcGFyYW0gb2JzZXJ2ZXIgdGhlIG9ic2VydmVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjYW5SZXBvcnRFcnJvcihvYnNlcnZlcjogU3Vic2NyaWJlcjxhbnk+IHwgU3ViamVjdDxhbnk+KTogYm9vbGVhbiB7XG4gIHdoaWxlIChvYnNlcnZlcikge1xuICAgIGNvbnN0IHsgY2xvc2VkLCBkZXN0aW5hdGlvbiwgaXNTdG9wcGVkIH0gPSBvYnNlcnZlciBhcyBhbnk7XG4gICAgaWYgKGNsb3NlZCB8fCBpc1N0b3BwZWQpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGRlc3RpbmF0aW9uICYmIGRlc3RpbmF0aW9uIGluc3RhbmNlb2YgU3Vic2NyaWJlcikge1xuICAgICAgb2JzZXJ2ZXIgPSBkZXN0aW5hdGlvbjtcbiAgICB9IGVsc2Uge1xuICAgICAgb2JzZXJ2ZXIgPSBudWxsO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbiJdfQ==