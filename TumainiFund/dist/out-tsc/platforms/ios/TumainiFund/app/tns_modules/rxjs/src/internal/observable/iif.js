import { defer } from './defer';
import { EMPTY } from './empty';
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
 * import { iif, of } from 'rxjs';
 *
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
export function iif(condition, trueResult = EMPTY, falseResult = EMPTY) {
    return defer(() => condition() ? trueResult : falseResult);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWlmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9paWYudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLFNBQVMsQ0FBQztBQUNoQyxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sU0FBUyxDQUFDO0FBR2hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Rkc7QUFDSCxNQUFNLFVBQVUsR0FBRyxDQUNqQixTQUF3QixFQUN4QixhQUF1QyxLQUFLLEVBQzVDLGNBQXdDLEtBQUs7SUFFN0MsT0FBTyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDN0QsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IGRlZmVyIH0gZnJvbSAnLi9kZWZlcic7XG5pbXBvcnQgeyBFTVBUWSB9IGZyb20gJy4vZW1wdHknO1xuaW1wb3J0IHsgU3Vic2NyaWJhYmxlT3JQcm9taXNlIH0gZnJvbSAnLi4vdHlwZXMnO1xuXG4vKipcbiAqIERlY2lkZXMgYXQgc3Vic2NyaXB0aW9uIHRpbWUgd2hpY2ggT2JzZXJ2YWJsZSB3aWxsIGFjdHVhbGx5IGJlIHN1YnNjcmliZWQuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPmBJZmAgc3RhdGVtZW50IGZvciBPYnNlcnZhYmxlcy48L3NwYW4+XG4gKlxuICogYGlpZmAgYWNjZXB0cyBhIGNvbmRpdGlvbiBmdW5jdGlvbiBhbmQgdHdvIE9ic2VydmFibGVzLiBXaGVuXG4gKiBhbiBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvcGVyYXRvciBpcyBzdWJzY3JpYmVkLCBjb25kaXRpb24gZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQuXG4gKiBCYXNlZCBvbiB3aGF0IGJvb2xlYW4gaXQgcmV0dXJucyBhdCB0aGF0IG1vbWVudCwgY29uc3VtZXIgd2lsbCBzdWJzY3JpYmUgZWl0aGVyIHRvXG4gKiB0aGUgZmlyc3QgT2JzZXJ2YWJsZSAoaWYgY29uZGl0aW9uIHdhcyB0cnVlKSBvciB0byB0aGUgc2Vjb25kIChpZiBjb25kaXRpb24gd2FzIGZhbHNlKS4gQ29uZGl0aW9uXG4gKiBmdW5jdGlvbiBtYXkgYWxzbyBub3QgcmV0dXJuIGFueXRoaW5nIC0gaW4gdGhhdCBjYXNlIGNvbmRpdGlvbiB3aWxsIGJlIGV2YWx1YXRlZCBhcyBmYWxzZSBhbmRcbiAqIHNlY29uZCBPYnNlcnZhYmxlIHdpbGwgYmUgc3Vic2NyaWJlZC5cbiAqXG4gKiBOb3RlIHRoYXQgT2JzZXJ2YWJsZXMgZm9yIGJvdGggY2FzZXMgKHRydWUgYW5kIGZhbHNlKSBhcmUgb3B0aW9uYWwuIElmIGNvbmRpdGlvbiBwb2ludHMgdG8gYW4gT2JzZXJ2YWJsZSB0aGF0XG4gKiB3YXMgbGVmdCB1bmRlZmluZWQsIHJlc3VsdGluZyBzdHJlYW0gd2lsbCBzaW1wbHkgY29tcGxldGUgaW1tZWRpYXRlbHkuIFRoYXQgYWxsb3dzIHlvdSB0bywgcmF0aGVyXG4gKiB0aGVuIGNvbnRyb2xsaW5nIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkLCBkZWNpZGUgYXQgcnVudGltZSBpZiBjb25zdW1lciBzaG91bGQgaGF2ZSBhY2Nlc3NcbiAqIHRvIGdpdmVuIE9ic2VydmFibGUgb3Igbm90LlxuICpcbiAqIElmIHlvdSBoYXZlIG1vcmUgY29tcGxleCBsb2dpYyB0aGF0IHJlcXVpcmVzIGRlY2lzaW9uIGJldHdlZW4gbW9yZSB0aGFuIHR3byBPYnNlcnZhYmxlcywge0BsaW5rIGRlZmVyfVxuICogd2lsbCBwcm9iYWJseSBiZSBhIGJldHRlciBjaG9pY2UuIEFjdHVhbGx5IGBpaWZgIGNhbiBiZSBlYXNpbHkgaW1wbGVtZW50ZWQgd2l0aCB7QGxpbmsgZGVmZXJ9XG4gKiBhbmQgZXhpc3RzIG9ubHkgZm9yIGNvbnZlbmllbmNlIGFuZCByZWFkYWJpbGl0eSByZWFzb25zLlxuICpcbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjIENoYW5nZSBhdCBydW50aW1lIHdoaWNoIE9ic2VydmFibGUgd2lsbCBiZSBzdWJzY3JpYmVkXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBpaWYsIG9mIH0gZnJvbSAncnhqcyc7XG4gKlxuICogbGV0IHN1YnNjcmliZVRvRmlyc3Q7XG4gKiBjb25zdCBmaXJzdE9yU2Vjb25kID0gaWlmKFxuICogICAoKSA9PiBzdWJzY3JpYmVUb0ZpcnN0LFxuICogICBvZignZmlyc3QnKSxcbiAqICAgb2YoJ3NlY29uZCcpLFxuICogKTtcbiAqXG4gKiBzdWJzY3JpYmVUb0ZpcnN0ID0gdHJ1ZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwiZmlyc3RcIlxuICpcbiAqIHN1YnNjcmliZVRvRmlyc3QgPSBmYWxzZTtcbiAqIGZpcnN0T3JTZWNvbmQuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIFwic2Vjb25kXCJcbiAqXG4gKiBgYGBcbiAqXG4gKiAjIyMgQ29udHJvbCBhbiBhY2Nlc3MgdG8gYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogbGV0IGFjY2Vzc0dyYW50ZWQ7XG4gKiBjb25zdCBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzID0gaWlmKFxuICogICAoKSA9PiBhY2Nlc3NHcmFudGVkLFxuICogICBvZignSXQgc2VlbXMgeW91IGhhdmUgYW4gYWNjZXNzLi4uJyksIC8vIE5vdGUgdGhhdCBvbmx5IG9uZSBPYnNlcnZhYmxlIGlzIHBhc3NlZCB0byB0aGUgb3BlcmF0b3IuXG4gKiApO1xuICpcbiAqIGFjY2Vzc0dyYW50ZWQgPSB0cnVlO1xuICogb2JzZXJ2YWJsZUlmWW91SGF2ZUFjY2Vzcy5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnVGhlIGVuZCcpLFxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gXCJJdCBzZWVtcyB5b3UgaGF2ZSBhbiBhY2Nlc3MuLi5cIlxuICogLy8gXCJUaGUgZW5kXCJcbiAqXG4gKiBhY2Nlc3NHcmFudGVkID0gZmFsc2U7XG4gKiBvYnNlcnZhYmxlSWZZb3VIYXZlQWNjZXNzLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdUaGUgZW5kJyksXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBcIlRoZSBlbmRcIlxuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgZGVmZXJ9XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbigpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHdoaWNoIE9ic2VydmFibGUgc2hvdWxkIGJlIGNob3Nlbi5cbiAqIEBwYXJhbSB7T2JzZXJ2YWJsZX0gW3RydWVPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyB0cnVlLlxuICogQHBhcmFtIHtPYnNlcnZhYmxlfSBbZmFsc2VPYnNlcnZhYmxlXSBBbiBPYnNlcnZhYmxlIHRoYXQgd2lsbCBiZSBzdWJzY3JpYmVkIGlmIGNvbmRpdGlvbiBpcyBmYWxzZS5cbiAqIEByZXR1cm4ge09ic2VydmFibGV9IEVpdGhlciBmaXJzdCBvciBzZWNvbmQgT2JzZXJ2YWJsZSwgZGVwZW5kaW5nIG9uIGNvbmRpdGlvbi5cbiAqIEBzdGF0aWMgdHJ1ZVxuICogQG5hbWUgaWlmXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWlmPFQsIEY+KFxuICBjb25kaXRpb246ICgpID0+IGJvb2xlYW4sXG4gIHRydWVSZXN1bHQ6IFN1YnNjcmliYWJsZU9yUHJvbWlzZTxUPiA9IEVNUFRZLFxuICBmYWxzZVJlc3VsdDogU3Vic2NyaWJhYmxlT3JQcm9taXNlPEY+ID0gRU1QVFlcbik6IE9ic2VydmFibGU8VHxGPiB7XG4gIHJldHVybiBkZWZlcigoKSA9PiBjb25kaXRpb24oKSA/IHRydWVSZXN1bHQgOiBmYWxzZVJlc3VsdCk7XG59XG4iXX0=