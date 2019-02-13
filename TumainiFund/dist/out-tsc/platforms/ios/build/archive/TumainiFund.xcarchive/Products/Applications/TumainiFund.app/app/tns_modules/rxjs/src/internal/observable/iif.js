"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var defer_1 = require("./defer");
var empty_1 = require("./empty");
/**
 * Decides at subscription time which Observable will actually be subscribed.
 *
 * <span class="informal">`If` statement for Observables.</span>
 *
 * `iif` accepts a condition function and two Observables. When
 * an Observable returned by the operator is subscribed, condition function will be called.
 * Based on what boolean it returns at that moment, consumer will subscribe either to
 * the first Observable (if condition was true) or to the second (if condition was false). Condition
 * function may also not return anything - in that case condition will be evaluated as false and
 * second Observable will be subscribed.
 *
 * Note that Observables for both cases (true and false) are optional. If condition points to an Observable that
 * was left undefined, resulting stream will simply complete immediately. That allows you to, rather
 * then controlling which Observable will be subscribed, decide at runtime if consumer should have access
 * to given Observable or not.
 *
 * If you have more complex logic that requires decision between more than two Observables, {@link defer}
 * will probably be a better choice. Actually `iif` can be easily implemented with {@link defer}
 * and exists only for convenience and readability reasons.
 *
 *
 * ## Examples
 * ### Change at runtime which Observable will be subscribed
 * ```javascript
 * let subscribeToFirst;
 * const firstOrSecond = iif(
 *   () => subscribeToFirst,
 *   of('first'),
 *   of('second'),
 * );
 *
 * subscribeToFirst = true;
 * firstOrSecond.subscribe(value => console.log(value));
 *
 * // Logs:
 * // "first"
 *
 * subscribeToFirst = false;
 * firstOrSecond.subscribe(value => console.log(value));
 *
 * // Logs:
 * // "second"
 *
 * ```
 *
 * ### Control an access to an Observable
 * ```javascript
 * let accessGranted;
 * const observableIfYouHaveAccess = iif(
 *   () => accessGranted,
 *   of('It seems you have an access...'), // Note that only one Observable is passed to the operator.
 * );
 *
 * accessGranted = true;
 * observableIfYouHaveAccess.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('The end'),
 * );
 *
 * // Logs:
 * // "It seems you have an access..."
 * // "The end"
 *
 * accessGranted = false;
 * observableIfYouHaveAccess.subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('The end'),
 * );
 *
 * // Logs:
 * // "The end"
 * ```
 *
 * @see {@link defer}
 *
 * @param {function(): boolean} condition Condition which Observable should be chosen.
 * @param {Observable} [trueObservable] An Observable that will be subscribed if condition is true.
 * @param {Observable} [falseObservable] An Observable that will be subscribed if condition is false.
 * @return {Observable} Either first or second Observable, depending on condition.
 * @static true
 * @name iif
 * @owner Observable
 */
function iif(condition, trueResult, falseResult) {
    if (trueResult === void 0) { trueResult = empty_1.EMPTY; }
    if (falseResult === void 0) { falseResult = empty_1.EMPTY; }
    return defer_1.defer(function () { return condition() ? trueResult : falseResult; });
}
exports.iif = iif;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWlmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2lpZi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLGlDQUFnQztBQUNoQyxpQ0FBZ0M7QUFHaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxRkc7QUFDSCxTQUFnQixHQUFHLENBQ2pCLFNBQXdCLEVBQ3hCLFVBQTRDLEVBQzVDLFdBQTZDO0lBRDdDLDJCQUFBLEVBQUEsYUFBdUMsYUFBSztJQUM1Qyw0QkFBQSxFQUFBLGNBQXdDLGFBQUs7SUFFN0MsT0FBTyxhQUFLLENBQU0sY0FBTSxPQUFBLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDO0FBQ2xFLENBQUM7QUFORCxrQkFNQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi9kZWZlcic7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIERlY2lkZXMgYXQgc3Vic2NyaXB0aW9uIHRpbWUgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGFjdHVhbGx5IGJlIHN1YnNjcmliZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPmBJZmAgc3RhdGVtZW50IGZvciBPYnNlcnZhYmxlcy48L3NwYW4+XG4gKlxuICogYGlpZmAgYWNjZXB0cyBhIGNvbmRpdGlvbiBmdW5jdGlvbiBhbmQgdHdvIE9ic2VydmFibGVzLiBXaGVuXG4gKiBhbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvcGVyYXRvciBpcyBzdWJzY3JpYmVkLCBjb25kaXRpb24gZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQuXG4gKiBCYXNlZCBvbiB3aGF0IGJvb2xlYW4gaXQgcmV0dXJucyBhdCB0aGF0IG1vbWVudCwgY29uc3VtZXIgd2lsbCBzdWJzY3JpYmUgZWl0aGVyIHRvXG4gKiB0aGUgZmlyc3QgT2JzZXJ2YWJsZSAoaWYgY29uZGl0aW9uIHdhcyB0cnVlKSBvciB0byB0aGUgc2Vjb25kIChpZiBjb25kaXRpb24gd2FzIGZhbHNlKS4gQ29uZGl0aW9uXG4gKiBmdW5jdGlvbiBtYXkgYWxzbyBub3QgcmV0dXJuIGFueXRoaW5nIC0gaW4gdGhhdCBjYXNlIGNvbmRpdGlvbiB3aWxsIGJlIGV2YWx1YXRlZCBhcyBmYWxzZSBhbmRcbiAqIHNlY29uZCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZC5cbiAqXG4gKiBOb3RlIHRoYXQgT2JzZXJ2YWJsZXMgZm9yIGJvdGggY2FzZXMgKHRydWUgYW5kIGZhbHNlKSBhcmUgb3B0aW9uYWwuIElmIGNvbmRpdGlvbiBwb2ludHMgdG8gYW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiB3YXMgbGVmdCB1bmRlZmluZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBzaW1wbHkgY29tcGxldGUgaW1tZWRpYXRlbHkuIFRoYXQgYWxsb3dzIHlvdSB0bywgcmF0aGVyXG4gKiB0aGVuIGNvbnRyb2xsaW5nIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLCBkZWNpZGUgYXQgcnVudGltZSBpZiBjb25zdW1lciBzaG91bGQgaGF2ZSBhY2Nlc3NcbiAqIHRvIGdpdmVuIE9ic2VydmFibGUgb3Igbm90LlxuICpcbiAqIElmIHlvdSBoYXZlIG1vcmUgY29tcGxleCBsb2dpYyB0aGF0IHJlcXVpcmVzIGRlY2lzaW9uIGJldHdlZW4gbW9yZSB0aGFuIHR3byBPYnNlcnZhYmxlcywge0BsaW5rIGRlZmVyfVxuICogd2lsbCBwcm9iYWJseSBiZSBhIGJldHRlciBjaG9pY2UuIEFjdHVhbGx5IGBpaWZgIGNhbiBiZSBlYXNpbHkgaW1wbGVtZW50ZWQgd2l0aCB7QGxpbmsgZGVmZXJ9XG4gKiBhbmQgZXhpc3RzIG9ubHkgZm9yIGNvbnZlbmllbmNlIGFuZCByZWFkYWJpbGl0eSByZWFzb25zLlxuICpcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENoYW5nZSBhdCBydW50aW1lIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgc3Vic2NyaWJlVG9GaXJzdDtcbiAqIGNvbnN0IGZpcnN0T3JTZWNvbmQgPSBpaWYoXG4gKiAgICgpID0+IHN1YnNjcmliZVRvRmlyc3QsXG4gKiAgIG9mKCdmaXJzdCcpLFxuICogICBvZignc2Vjb25kJyksXG4gKiApO1xuICpcbiAqIHN1YnNjcmliZVRvRmlyc3QgPSB0cnVlO1xuICogZmlyc3RPclNlY29uZC5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJmaXJzdFwiXG4gKlxuICogc3Vic2NyaWJlVG9GaXJzdCA9IGZhbHNlO1xuICogZmlyc3RPclNlY29uZC5zdWJzY3JpYmUodmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJzZWNvbmRcIlxuICpcbiAqIGBgYFxuICpcbiAqICMjIyBDb250cm9sIGFuIGFjY2VzcyB0byBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBsZXQgYWNjZXNzR3JhbnRlZDtcbiAqIGNvbnN0IG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3MgPSBpaWYoXG4gKiAgICgpID0+IGFjY2Vzc0dyYW50ZWQsXG4gKiAgIG9mKCdJdCBzZWVtcyB5b3UgaGF2ZSBhbiBhY2Nlc3MuLi4nKSwgLy8gTm90ZSB0aGF0IG9ubHkgb25lIE9ic2VydmFibGUgaXMgcGFzc2VkIHRvIHRoZSBvcGVyYXRvci5cbiAqICk7XG4gKlxuICogYWNjZXNzR3JhbnRlZCA9IHRydWU7XG4gKiBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGUgZW5kJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIkl0IHNlZW1zIHlvdSBoYXZlIGFuIGFjY2Vzcy4uLlwiXG4gKiAvLyBcIlRoZSBlbmRcIlxuICpcbiAqIGFjY2Vzc0dyYW50ZWQgPSBmYWxzZTtcbiAqIG9ic2VydmFibGVJZllvdUhhdmVBY2Nlc3Muc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1RoZSBlbmQnKSxcbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiVGhlIGVuZFwiXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBkZWZlcn1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gd2hpY2ggT2JzZXJ2YWJsZSBzaG91bGQgYmUgY2hvc2VuLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbdHJ1ZU9ic2VydmFibGVdIEFuIE9ic2VydmFibGUgdGhhdCB3aWxsIGJlIHN1YnNjcmliZWQgaWYgY29uZGl0aW9uIGlzIHRydWUuXG4gKiBAcGFyYW0ge09ic2VydmFibGV9IFtmYWxzZU9ic2VydmFibGVdIEFuIE9ic2VydmFibGUgdGhhdCB3aWxsIGJlIHN1YnNjcmliZWQgaWYgY29uZGl0aW9uIGlzIGZhbHNlLlxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gRWl0aGVyIGZpcnN0IG9yIHNlY29uZCBPYnNlcnZhYmxlLCBkZXBlbmRpbmcgb24gY29uZGl0aW9uLlxuICogQHN0YXRpYyB0cnVlXG4gKiBAbmFtZSBpaWZcbiAqIEBvd25lciBPYnNlcnZhYmxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpaWY8VCwgRj4oXG4gIGNvbmRpdGlvbjogKCkgPT4gYm9vbGVhbixcbiAgdHJ1ZVJlc3VsdDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPFQ+ID0gRU1QVFksXG4gIGZhbHNlUmVzdWx0OiBTdWJzY3JpYmFibGVPclByb21pc2U8Rj4gPSBFTVBUWVxuKTogT2JzZXJ2YWJsZTxUfEY+IHtcbiAgcmV0dXJuIGRlZmVyPFR8Rj4oKCkgPT4gY29uZGl0aW9uKCkgPyB0cnVlUmVzdWx0IDogZmFsc2VSZXN1bHQpO1xufVxuIl19