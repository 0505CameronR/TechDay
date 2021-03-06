"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function UnsubscriptionErrorImpl(errors) {
    Error.call(this);
    this.message = errors ?
        errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ') : '';
    this.name = 'UnsubscriptionError';
    this.errors = errors;
    return this;
}
UnsubscriptionErrorImpl.prototype = Object.create(Error.prototype);
/**
 * An error thrown when one or more errors have occurred during the
 * `unsubscribe` of a {@link Subscription}.
 */
exports.UnsubscriptionError = UnsubscriptionErrorImpl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVW5zdWJzY3JpcHRpb25FcnJvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3V0aWwvVW5zdWJzY3JpcHRpb25FcnJvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLFNBQVMsdUJBQXVCLENBQVksTUFBYTtJQUN2RCxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ2pCLElBQUksQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLENBQUM7UUFDcEIsTUFBTSxDQUFDLE1BQU0saURBQ2hCLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBQyxHQUFHLEVBQUUsQ0FBQyxJQUFLLE9BQUcsQ0FBQyxHQUFHLENBQUMsVUFBSyxHQUFHLENBQUMsUUFBUSxFQUFJLEVBQTdCLENBQTZCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMxRSxJQUFJLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDO0lBQ2xDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO0lBQ3JCLE9BQU8sSUFBSSxDQUFDO0FBQ2QsQ0FBQztBQUVELHVCQUF1QixDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUVuRTs7O0dBR0c7QUFDVSxRQUFBLG1CQUFtQixHQUE0Qix1QkFBOEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBpbnRlcmZhY2UgVW5zdWJzY3JpcHRpb25FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgcmVhZG9ubHkgZXJyb3JzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBVbnN1YnNjcmlwdGlvbkVycm9yQ3RvciB7XG4gIG5ldyhlcnJvcnM6IGFueVtdKTogVW5zdWJzY3JpcHRpb25FcnJvcjtcbn1cblxuZnVuY3Rpb24gVW5zdWJzY3JpcHRpb25FcnJvckltcGwodGhpczogYW55LCBlcnJvcnM6IGFueVtdKSB7XG4gIEVycm9yLmNhbGwodGhpcyk7XG4gIHRoaXMubWVzc2FnZSA9IGVycm9ycyA/XG4gIGAke2Vycm9ycy5sZW5ndGh9IGVycm9ycyBvY2N1cnJlZCBkdXJpbmcgdW5zdWJzY3JpcHRpb246XG4ke2Vycm9ycy5tYXAoKGVyciwgaSkgPT4gYCR7aSArIDF9KSAke2Vyci50b1N0cmluZygpfWApLmpvaW4oJ1xcbiAgJyl9YCA6ICcnO1xuICB0aGlzLm5hbWUgPSAnVW5zdWJzY3JpcHRpb25FcnJvcic7XG4gIHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuICByZXR1cm4gdGhpcztcbn1cblxuVW5zdWJzY3JpcHRpb25FcnJvckltcGwucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShFcnJvci5wcm90b3R5cGUpO1xuXG4vKipcbiAqIEFuIGVycm9yIHRocm93biB3aGVuIG9uZSBvciBtb3JlIGVycm9ycyBoYXZlIG9jY3VycmVkIGR1cmluZyB0aGVcbiAqIGB1bnN1YnNjcmliZWAgb2YgYSB7QGxpbmsgU3Vic2NyaXB0aW9ufS5cbiAqL1xuZXhwb3J0IGNvbnN0IFVuc3Vic2NyaXB0aW9uRXJyb3I6IFVuc3Vic2NyaXB0aW9uRXJyb3JDdG9yID0gVW5zdWJzY3JpcHRpb25FcnJvckltcGwgYXMgYW55OyJdfQ==