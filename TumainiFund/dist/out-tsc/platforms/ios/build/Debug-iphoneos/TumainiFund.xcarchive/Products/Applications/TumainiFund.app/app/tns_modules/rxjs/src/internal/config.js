let _enable_super_gross_mode_that_will_cause_bad_things = false;
/**
 * The global configuration object for RxJS, used to configure things
 * like what Promise contructor should used to create Promises
 */
export const config = {
    /**
     * The promise constructor used by default for methods such as
     * {@link toPromise} and {@link forEach}
     */
    Promise: undefined,
    /**
     * If true, turns on synchronous error rethrowing, which is a deprecated behavior
     * in v6 and higher. This behavior enables bad patterns like wrapping a subscribe
     * call in a try/catch block. It also enables producer interference, a nasty bug
     * where a multicast can be broken for all observers by a downstream consumer with
     * an unhandled error. DO NOT USE THIS FLAG UNLESS IT'S NEEDED TO BY TIME
     * FOR MIGRATION REASONS.
     */
    set useDeprecatedSynchronousErrorHandling(value) {
        if (value) {
            const error = new Error();
            console.warn('DEPRECATED! RxJS was set to use deprecated synchronous error handling behavior by code at: \n' + error.stack);
        }
        else if (_enable_super_gross_mode_that_will_cause_bad_things) {
            console.log('RxJS: Back to a better error behavior. Thank you. <3');
        }
        _enable_super_gross_mode_that_will_cause_bad_things = value;
    },
    get useDeprecatedSynchronousErrorHandling() {
        return _enable_super_gross_mode_that_will_cause_bad_things;
    },
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29uZmlnLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvY29uZmlnLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLElBQUksbURBQW1ELEdBQUcsS0FBSyxDQUFDO0FBRWhFOzs7R0FHRztBQUNILE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBRztJQUNwQjs7O09BR0c7SUFDSCxPQUFPLEVBQUUsU0FBbUM7SUFFNUM7Ozs7Ozs7T0FPRztJQUNILElBQUkscUNBQXFDLENBQUMsS0FBYztRQUN0RCxJQUFJLEtBQUssRUFBRTtZQUNULE1BQU0sS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7WUFDMUIsT0FBTyxDQUFDLElBQUksQ0FBQywrRkFBK0YsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDN0g7YUFBTSxJQUFJLG1EQUFtRCxFQUFFO1lBQzlELE9BQU8sQ0FBQyxHQUFHLENBQUMsc0RBQXNELENBQUMsQ0FBQztTQUNyRTtRQUNELG1EQUFtRCxHQUFHLEtBQUssQ0FBQztJQUM5RCxDQUFDO0lBRUQsSUFBSSxxQ0FBcUM7UUFDdkMsT0FBTyxtREFBbUQsQ0FBQztJQUM3RCxDQUFDO0NBQ0YsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImxldCBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3MgPSBmYWxzZTtcblxuLyoqXG4gKiBUaGUgZ2xvYmFsIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBSeEpTLCB1c2VkIHRvIGNvbmZpZ3VyZSB0aGluZ3NcbiAqIGxpa2Ugd2hhdCBQcm9taXNlIGNvbnRydWN0b3Igc2hvdWxkIHVzZWQgdG8gY3JlYXRlIFByb21pc2VzXG4gKi9cbmV4cG9ydCBjb25zdCBjb25maWcgPSB7XG4gIC8qKlxuICAgKiBUaGUgcHJvbWlzZSBjb25zdHJ1Y3RvciB1c2VkIGJ5IGRlZmF1bHQgZm9yIG1ldGhvZHMgc3VjaCBhc1xuICAgKiB7QGxpbmsgdG9Qcm9taXNlfSBhbmQge0BsaW5rIGZvckVhY2h9XG4gICAqL1xuICBQcm9taXNlOiB1bmRlZmluZWQgYXMgUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSxcblxuICAvKipcbiAgICogSWYgdHJ1ZSwgdHVybnMgb24gc3luY2hyb25vdXMgZXJyb3IgcmV0aHJvd2luZywgd2hpY2ggaXMgYSBkZXByZWNhdGVkIGJlaGF2aW9yXG4gICAqIGluIHY2IGFuZCBoaWdoZXIuIFRoaXMgYmVoYXZpb3IgZW5hYmxlcyBiYWQgcGF0dGVybnMgbGlrZSB3cmFwcGluZyBhIHN1YnNjcmliZVxuICAgKiBjYWxsIGluIGEgdHJ5L2NhdGNoIGJsb2NrLiBJdCBhbHNvIGVuYWJsZXMgcHJvZHVjZXIgaW50ZXJmZXJlbmNlLCBhIG5hc3R5IGJ1Z1xuICAgKiB3aGVyZSBhIG11bHRpY2FzdCBjYW4gYmUgYnJva2VuIGZvciBhbGwgb2JzZXJ2ZXJzIGJ5IGEgZG93bnN0cmVhbSBjb25zdW1lciB3aXRoXG4gICAqIGFuIHVuaGFuZGxlZCBlcnJvci4gRE8gTk9UIFVTRSBUSElTIEZMQUcgVU5MRVNTIElUJ1MgTkVFREVEIFRPIEJZIFRJTUVcbiAgICogRk9SIE1JR1JBVElPTiBSRUFTT05TLlxuICAgKi9cbiAgc2V0IHVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIGNvbnN0IGVycm9yID0gbmV3IEVycm9yKCk7XG4gICAgICBjb25zb2xlLndhcm4oJ0RFUFJFQ0FURUQhIFJ4SlMgd2FzIHNldCB0byB1c2UgZGVwcmVjYXRlZCBzeW5jaHJvbm91cyBlcnJvciBoYW5kbGluZyBiZWhhdmlvciBieSBjb2RlIGF0OiBcXG4nICsgZXJyb3Iuc3RhY2spO1xuICAgIH0gZWxzZSBpZiAoX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzKSB7XG4gICAgICBjb25zb2xlLmxvZygnUnhKUzogQmFjayB0byBhIGJldHRlciBlcnJvciBiZWhhdmlvci4gVGhhbmsgeW91LiA8MycpO1xuICAgIH1cbiAgICBfZW5hYmxlX3N1cGVyX2dyb3NzX21vZGVfdGhhdF93aWxsX2NhdXNlX2JhZF90aGluZ3MgPSB2YWx1ZTtcbiAgfSxcblxuICBnZXQgdXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZygpIHtcbiAgICByZXR1cm4gX2VuYWJsZV9zdXBlcl9ncm9zc19tb2RlX3RoYXRfd2lsbF9jYXVzZV9iYWRfdGhpbmdzO1xuICB9LFxufTtcbiJdfQ==