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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWlmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpQ0FBZ0M7QUFDaEMsaUNBQWdDO0FBR2hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUZHO0FBQ0gsU0FBZ0IsR0FBRyxDQUNqQixTQUF3QixFQUN4QixVQUE0QyxFQUM1QyxXQUE2QztJQUQ3QywyQkFBQSxFQUFBLGFBQXVDLGFBQUs7SUFDNUMsNEJBQUEsRUFBQSxjQUF3QyxhQUFLO0lBRTdDLE9BQU8sYUFBSyxDQUFNLGNBQU0sT0FBQSxTQUFTLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQXRDLENBQXNDLENBQUMsQ0FBQztBQUNsRSxDQUFDO0FBTkQsa0JBTUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBkZWZlciB9IGZyb20gJy4vZGVmZXInO1xuaW1wb3J0IHsgRU1QVFkgfSBmcm9tICcuL2VtcHR5JztcbmltcG9ydCB7IFN1YnNjcmliYWJsZU9yUHJvbWlzZSB9IGZyb20gJy4uL3R5cGVzJztcblxuLyoqXG4gKiBEZWNpZGVzIGF0IHN1YnNjcmlwdGlvbiB0aW1lIHdoaWNoIE9ic2VydmFibGUgd2lsbCBhY3R1YWxseSBiZSBzdWJzY3JpYmVkLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5gSWZgIHN0YXRlbWVudCBmb3IgT2JzZXJ2YWJsZXMuPC9zcGFuPlxuICpcbiAqIGBpaWZgIGFjY2VwdHMgYSBjb25kaXRpb24gZnVuY3Rpb24gYW5kIHR3byBPYnNlcnZhYmxlcy4gV2hlblxuICogYW4gT2JzZXJ2YWJsZSByZXR1cm5lZCBieSB0aGUgb3BlcmF0b3IgaXMgc3Vic2NyaWJlZCwgY29uZGl0aW9uIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkLlxuICogQmFzZWQgb24gd2hhdCBib29sZWFuIGl0IHJldHVybnMgYXQgdGhhdCBtb21lbnQsIGNvbnN1bWVyIHdpbGwgc3Vic2NyaWJlIGVpdGhlciB0b1xuICogdGhlIGZpcnN0IE9ic2VydmFibGUgKGlmIGNvbmRpdGlvbiB3YXMgdHJ1ZSkgb3IgdG8gdGhlIHNlY29uZCAoaWYgY29uZGl0aW9uIHdhcyBmYWxzZSkuIENvbmRpdGlvblxuICogZnVuY3Rpb24gbWF5IGFsc28gbm90IHJldHVybiBhbnl0aGluZyAtIGluIHRoYXQgY2FzZSBjb25kaXRpb24gd2lsbCBiZSBldmFsdWF0ZWQgYXMgZmFsc2UgYW5kXG4gKiBzZWNvbmQgT2JzZXJ2YWJsZSB3aWxsIGJlIHN1YnNjcmliZWQuXG4gKlxuICogTm90ZSB0aGF0IE9ic2VydmFibGVzIGZvciBib3RoIGNhc2VzICh0cnVlIGFuZCBmYWxzZSkgYXJlIG9wdGlvbmFsLiBJZiBjb25kaXRpb24gcG9pbnRzIHRvIGFuIE9ic2VydmFibGUgdGhhdFxuICogd2FzIGxlZnQgdW5kZWZpbmVkLCByZXN1bHRpbmcgc3RyZWFtIHdpbGwgc2ltcGx5IGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBUaGF0IGFsbG93cyB5b3UgdG8sIHJhdGhlclxuICogdGhlbiBjb250cm9sbGluZyB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZCwgZGVjaWRlIGF0IHJ1bnRpbWUgaWYgY29uc3VtZXIgc2hvdWxkIGhhdmUgYWNjZXNzXG4gKiB0byBnaXZlbiBPYnNlcnZhYmxlIG9yIG5vdC5cbiAqXG4gKiBJZiB5b3UgaGF2ZSBtb3JlIGNvbXBsZXggbG9naWMgdGhhdCByZXF1aXJlcyBkZWNpc2lvbiBiZXR3ZWVuIG1vcmUgdGhhbiB0d28gT2JzZXJ2YWJsZXMsIHtAbGluayBkZWZlcn1cbiAqIHdpbGwgcHJvYmFibHkgYmUgYSBiZXR0ZXIgY2hvaWNlLiBBY3R1YWxseSBgaWlmYCBjYW4gYmUgZWFzaWx5IGltcGxlbWVudGVkIHdpdGgge0BsaW5rIGRlZmVyfVxuICogYW5kIGV4aXN0cyBvbmx5IGZvciBjb252ZW5pZW5jZSBhbmQgcmVhZGFiaWxpdHkgcmVhc29ucy5cbiAqXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqICMjIyBDaGFuZ2UgYXQgcnVudGltZSB3aGljaCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZFxuICogYGBgamF2YXNjcmlwdFxuICogbGV0IHN1YnNjcmliZVRvRmlyc3Q7XG4gKiBjb25zdCBmaXJzdE9yU2Vjb25kID0gaWlmKFxuICogICAoKSA9PiBzdWJzY3JpYmVUb0ZpcnN0LFxuICogICBvZignZmlyc3QnKSxcbiAqICAgb2YoJ3NlY29uZCcpLFxuICogKTtcbiAqXG4gKiBzdWJzY3JpYmVUb0ZpcnN0ID0gdHJ1ZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiZmlyc3RcIlxuICpcbiAqIHN1YnNjcmliZVRvRmlyc3QgPSBmYWxzZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwic2Vjb25kXCJcbiAqXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29udHJvbCBhbiBhY2Nlc3MgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogbGV0IGFjY2Vzc0dyYW50ZWQ7XG4gKiBjb25zdCBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzID0gaWlmKFxuICogICAoKSA9PiBhY2Nlc3NHcmFudGVkLFxuICogICBvZignSXQgc2VlbXMgeW91IGhhdmUgYW4gYWNjZXNzLi4uJyksIC8vIE5vdGUgdGhhdCBvbmx5IG9uZSBPYnNlcnZhYmxlIGlzIHBhc3NlZCB0byB0aGUgb3BlcmF0b3IuXG4gKiApO1xuICpcbiAqIGFjY2Vzc0dyYW50ZWQgPSB0cnVlO1xuICogb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2Vzcy5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhlIGVuZCcpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJJdCBzZWVtcyB5b3UgaGF2ZSBhbiBhY2Nlc3MuLi5cIlxuICogLy8gXCJUaGUgZW5kXCJcbiAqXG4gKiBhY2Nlc3NHcmFudGVkID0gZmFsc2U7XG4gKiBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGUgZW5kJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIlRoZSBlbmRcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVmZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHdoaWNoIE9ic2VydmFibGUgc2hvdWxkIGJlIGNob3Nlbi5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW3RydWVPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyB0cnVlLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbZmFsc2VPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyBmYWxzZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEVpdGhlciBmaXJzdCBvciBzZWNvbmQgT2JzZXJ2YWJsZSwgZGVwZW5kaW5nIG9uIGNvbmRpdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaWlmXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWlmPFQsIEY+KFxuICBjb25kaXRpb246ICgpID0+IGJvb2xlYW4sXG4gIHRydWVSZXN1bHQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiA9IEVNUFRZLFxuICBmYWxzZVJlc3VsdDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPEY+ID0gRU1QVFlcbik6IE9ic2VydmFibGU8VHxGPiB7XG4gIHJldHVybiBkZWZlcjxUfEY+KCgpID0+IGNvbmRpdGlvbigpID8gdHJ1ZVJlc3VsdCA6IGZhbHNlUmVzdWx0KTtcbn1cbiJdfQ==