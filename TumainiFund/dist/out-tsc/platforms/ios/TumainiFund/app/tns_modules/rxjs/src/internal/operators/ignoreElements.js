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
/**
 * Ignores all items emitted by the source Observable and only passes calls of `complete` or `error`.
 *
 * ![](ignoreElements.png)
 *
 * ## Examples
 * ### Ignores emitted values, reacts to observable's completion.
 * ```javascript
 * of('you', 'talking', 'to', 'me').pipe(
 *   ignoreElements(),
 * )
 * .subscribe(
 *   word => console.log(word),
 *   err => console.log('error:', err),
 *   () => console.log('the end'),
 * );
 * // result:
 * // 'the end'
 * ```
 * @return {Observable} An empty Observable that only calls `complete`
 * or `error`, based on which one is called by the source Observable.
 * @method ignoreElements
 * @owner Observable
 */
function ignoreElements() {
    return function ignoreElementsOperatorFunction(source) {
        return source.lift(new IgnoreElementsOperator());
    };
}
exports.ignoreElements = ignoreElements;
var IgnoreElementsOperator = /** @class */ (function () {
    function IgnoreElementsOperator() {
    }
    IgnoreElementsOperator.prototype.call = function (subscriber, source) {
        return source.subscribe(new IgnoreElementsSubscriber(subscriber));
    };
    return IgnoreElementsOperator;
}());
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var IgnoreElementsSubscriber = /** @class */ (function (_super) {
    __extends(IgnoreElementsSubscriber, _super);
    function IgnoreElementsSubscriber() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    IgnoreElementsSubscriber.prototype._next = function (unused) {
        // Do nothing
    };
    return IgnoreElementsSubscriber;
}(Subscriber_1.Subscriber));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWdub3JlRWxlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vcGVyYXRvcnMvaWdub3JlRWxlbWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBRUEsNENBQTJDO0FBRzNDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVCRztBQUNILFNBQWdCLGNBQWM7SUFDNUIsT0FBTyxTQUFTLDhCQUE4QixDQUFDLE1BQXVCO1FBQ3BFLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLHNCQUFzQixFQUFFLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBSkQsd0NBSUM7QUFFRDtJQUFBO0lBSUEsQ0FBQztJQUhDLHFDQUFJLEdBQUosVUFBSyxVQUF5QixFQUFFLE1BQVc7UUFDekMsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksd0JBQXdCLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBQ0gsNkJBQUM7QUFBRCxDQUFDLEFBSkQsSUFJQztBQUVEOzs7O0dBSUc7QUFDSDtJQUEwQyw0Q0FBYTtJQUF2RDs7SUFJQSxDQUFDO0lBSFcsd0NBQUssR0FBZixVQUFnQixNQUFTO1FBQ3ZCLGFBQWE7SUFDZixDQUFDO0lBQ0gsK0JBQUM7QUFBRCxDQUFDLEFBSkQsQ0FBMEMsdUJBQVUsR0FJbkQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4uL09wZXJhdG9yJztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IE9wZXJhdG9yRnVuY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5cbi8qKlxuICogSWdub3JlcyBhbGwgaXRlbXMgZW1pdHRlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUgYW5kIG9ubHkgcGFzc2VzIGNhbGxzIG9mIGBjb21wbGV0ZWAgb3IgYGVycm9yYC5cbiAqXG4gKiAhW10oaWdub3JlRWxlbWVudHMucG5nKVxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgSWdub3JlcyBlbWl0dGVkIHZhbHVlcywgcmVhY3RzIHRvIG9ic2VydmFibGUncyBjb21wbGV0aW9uLlxuICogYGBgamF2YXNjcmlwdFxuICogb2YoJ3lvdScsICd0YWxraW5nJywgJ3RvJywgJ21lJykucGlwZShcbiAqICAgaWdub3JlRWxlbWVudHMoKSxcbiAqIClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHdvcmQgPT4gY29uc29sZS5sb2cod29yZCksXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZygnZXJyb3I6JywgZXJyKSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQnKSxcbiAqICk7XG4gKiAvLyByZXN1bHQ6XG4gKiAvLyAndGhlIGVuZCdcbiAqIGBgYFxuICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gZW1wdHkgT2JzZXJ2YWJsZSB0aGF0IG9ubHkgY2FsbHMgYGNvbXBsZXRlYFxuICogb3IgYGVycm9yYCwgYmFzZWQgb24gd2hpY2ggb25lIGlzIGNhbGxlZCBieSB0aGUgc291cmNlIE9ic2VydmFibGUuXG4gKiBAbWV0aG9kIGlnbm9yZUVsZW1lbnRzXG4gKiBAb3duZXIgT2JzZXJ2YWJsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaWdub3JlRWxlbWVudHMoKTogT3BlcmF0b3JGdW5jdGlvbjxhbnksIG5ldmVyPiB7XG4gIHJldHVybiBmdW5jdGlvbiBpZ25vcmVFbGVtZW50c09wZXJhdG9yRnVuY3Rpb24oc291cmNlOiBPYnNlcnZhYmxlPGFueT4pIHtcbiAgICByZXR1cm4gc291cmNlLmxpZnQobmV3IElnbm9yZUVsZW1lbnRzT3BlcmF0b3IoKSk7XG4gIH07XG59XG5cbmNsYXNzIElnbm9yZUVsZW1lbnRzT3BlcmF0b3I8VCwgUj4gaW1wbGVtZW50cyBPcGVyYXRvcjxULCBSPiB7XG4gIGNhbGwoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxSPiwgc291cmNlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBzb3VyY2Uuc3Vic2NyaWJlKG5ldyBJZ25vcmVFbGVtZW50c1N1YnNjcmliZXIoc3Vic2NyaWJlcikpO1xuICB9XG59XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5jbGFzcyBJZ25vcmVFbGVtZW50c1N1YnNjcmliZXI8VD4gZXh0ZW5kcyBTdWJzY3JpYmVyPFQ+IHtcbiAgcHJvdGVjdGVkIF9uZXh0KHVudXNlZDogVCk6IHZvaWQge1xuICAgIC8vIERvIG5vdGhpbmdcbiAgfVxufVxuIl19