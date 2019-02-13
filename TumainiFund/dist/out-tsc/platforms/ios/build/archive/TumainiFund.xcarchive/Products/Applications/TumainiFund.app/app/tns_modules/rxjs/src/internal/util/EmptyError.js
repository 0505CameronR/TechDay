"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function EmptyErrorImpl() {
    Error.call(this);
    this.message = 'no elements in sequence';
    this.name = 'EmptyError';
    return this;
}
EmptyErrorImpl.prototype = Object.create(Error.prototype);
/**
 * An error thrown when an Observable or a sequence was queried but has no
 * elements.
 *
 * @see {@link first}
 * @see {@link last}
 * @see {@link single}
 *
 * @class EmptyError
 */
exports.EmptyError = EmptyErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiRW1wdHlFcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdXRpbC9FbXB0eUVycm9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsU0FBUyxjQUFjO0lBQ3JCLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyx5QkFBeUIsQ0FBQztJQUN6QyxJQUFJLENBQUMsSUFBSSxHQUFHLFlBQVksQ0FBQztJQUN6QixPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxjQUFjLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTFEOzs7Ozs7Ozs7R0FTRztBQUNVLFFBQUEsVUFBVSxHQUFtQixjQUFxQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBFbXB0eUVycm9yIGV4dGVuZHMgRXJyb3Ige1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEVtcHR5RXJyb3JDdG9yIHtcbiAgbmV3KCk6IEVtcHR5RXJyb3I7XG59XG5cbmZ1bmN0aW9uIEVtcHR5RXJyb3JJbXBsKHRoaXM6IGFueSkge1xuICBFcnJvci5jYWxsKHRoaXMpO1xuICB0aGlzLm1lc3NhZ2UgPSAnbm8gZWxlbWVudHMgaW4gc2VxdWVuY2UnO1xuICB0aGlzLm5hbWUgPSAnRW1wdHlFcnJvcic7XG4gIHJldHVybiB0aGlzO1xufVxuXG5FbXB0eUVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gYW4gT2JzZXJ2YWJsZSBvciBhIHNlcXVlbmNlIHdhcyBxdWVyaWVkIGJ1dCBoYXMgbm9cbiAqIGVsZW1lbnRzLlxuICpcbiAqIEBzZWUge0BsaW5rIGZpcnN0fVxuICogQHNlZSB7QGxpbmsgbGFzdH1cbiAqIEBzZWUge0BsaW5rIHNpbmdsZX1cbiAqXG4gKiBAY2xhc3MgRW1wdHlFcnJvclxuICovXG5leHBvcnQgY29uc3QgRW1wdHlFcnJvcjogRW1wdHlFcnJvckN0b3IgPSBFbXB0eUVycm9ySW1wbCBhcyBhbnk7Il19