function TimeoutErrorImpl() {
    Error.call(this);
    this.message = 'Timeout has occurred';
    this.name = 'TimeoutError';
    return this;
}
TimeoutErrorImpl.prototype = Object.create(Error.prototype);
/**
 * An error thrown when duetime elapses.
 *
 * @see {@link operators/timeout}
 *
 * @class TimeoutError
 */
export const TimeoutError = TimeoutErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVGltZW91dEVycm9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdXRpbC9UaW1lb3V0RXJyb3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBT0EsU0FBUyxnQkFBZ0I7SUFDdkIsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQixJQUFJLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDO0lBQ3RDLElBQUksQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDO0lBQzNCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELGdCQUFnQixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUU1RDs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxZQUFZLEdBQXFCLGdCQUF1QixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGludGVyZmFjZSBUaW1lb3V0RXJyb3IgZXh0ZW5kcyBFcnJvciB7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgVGltZW91dEVycm9yQ3RvciB7XG4gIG5ldygpOiBUaW1lb3V0RXJyb3I7XG59XG5cbmZ1bmN0aW9uIFRpbWVvdXRFcnJvckltcGwodGhpczogYW55KSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9ICdUaW1lb3V0IGhhcyBvY2N1cnJlZCc7XG4gIHRoaXMubmFtZSA9ICdUaW1lb3V0RXJyb3InO1xuICByZXR1cm4gdGhpcztcbn1cblxuVGltZW91dEVycm9ySW1wbC5wcm90b3R5cGUgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cbi8qKlxuICogQW4gZXJyb3IgdGhyb3duIHdoZW4gZHVldGltZSBlbGFwc2VzLlxuICpcbiAqIEBzZWUge0BsaW5rIG9wZXJhdG9ycy90aW1lb3V0fVxuICpcbiAqIEBjbGFzcyBUaW1lb3V0RXJyb3JcbiAqL1xuZXhwb3J0IGNvbnN0IFRpbWVvdXRFcnJvcjogVGltZW91dEVycm9yQ3RvciA9IFRpbWVvdXRFcnJvckltcGwgYXMgYW55O1xuIl19