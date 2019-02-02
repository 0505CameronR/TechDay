"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var noop_1 = require("../util/noop");
/**
 * An Observable that emits no items to the Observer and never completes.
 *
 * ![](never.png)
 *
 * A simple Observable that emits neither values nor errors nor the completion
 * notification. It can be used for testing purposes or for composing with other
 * Observables. Please note that by never emitting a complete notification, this
 * Observable keeps the subscription from being disposed automatically.
 * Subscriptions need to be manually disposed.
 *
 * ##  Example
 * ### Emit the number 7, then never emit anything else (not even complete)
 * ```javascript
 * function info() {
 *   console.log('Will not be called');
 * }
 * const result = NEVER.pipe(startWith(7));
 * result.subscribe(x => console.log(x), info, info);
 *
 * ```
 *
 * @see {@link Observable}
 * @see {@link index/EMPTY}
 * @see {@link of}
 * @see {@link throwError}
 */
exports.NEVER = new Observable_1.Observable(noop_1.noop);
/**
 * @deprecated Deprecated in favor of using {@link NEVER} constant.
 */
function never() {
    return exports.NEVER;
}
exports.never = never;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmV2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL25ldmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLHFDQUFvQztBQUVwQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDVSxRQUFBLEtBQUssR0FBRyxJQUFJLHVCQUFVLENBQVEsV0FBSSxDQUFDLENBQUM7QUFFakQ7O0dBRUc7QUFDSCxTQUFnQixLQUFLO0lBQ25CLE9BQU8sYUFBSyxDQUFDO0FBQ2YsQ0FBQztBQUZELHNCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgbm9vcCB9IGZyb20gJy4uL3V0aWwvbm9vcCc7XG5cbi8qKlxuICogQW4gT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5vIGl0ZW1zIHRvIHRoZSBPYnNlcnZlciBhbmQgbmV2ZXIgY29tcGxldGVzLlxuICpcbiAqICFbXShuZXZlci5wbmcpXG4gKlxuICogQSBzaW1wbGUgT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIG5laXRoZXIgdmFsdWVzIG5vciBlcnJvcnMgbm9yIHRoZSBjb21wbGV0aW9uXG4gKiBub3RpZmljYXRpb24uIEl0IGNhbiBiZSB1c2VkIGZvciB0ZXN0aW5nIHB1cnBvc2VzIG9yIGZvciBjb21wb3Npbmcgd2l0aCBvdGhlclxuICogT2JzZXJ2YWJsZXMuIFBsZWFzZSBub3RlIHRoYXQgYnkgbmV2ZXIgZW1pdHRpbmcgYSBjb21wbGV0ZSBub3RpZmljYXRpb24sIHRoaXNcbiAqIE9ic2VydmFibGUga2VlcHMgdGhlIHN1YnNjcmlwdGlvbiBmcm9tIGJlaW5nIGRpc3Bvc2VkIGF1dG9tYXRpY2FsbHkuXG4gKiBTdWJzY3JpcHRpb25zIG5lZWQgdG8gYmUgbWFudWFsbHkgZGlzcG9zZWQuXG4gKlxuICogIyMgIEV4YW1wbGVcbiAqICMjIyBFbWl0IHRoZSBudW1iZXIgNywgdGhlbiBuZXZlciBlbWl0IGFueXRoaW5nIGVsc2UgKG5vdCBldmVuIGNvbXBsZXRlKVxuICogYGBgamF2YXNjcmlwdFxuICogZnVuY3Rpb24gaW5mbygpIHtcbiAqICAgY29uc29sZS5sb2coJ1dpbGwgbm90IGJlIGNhbGxlZCcpO1xuICogfVxuICogY29uc3QgcmVzdWx0ID0gTkVWRVIucGlwZShzdGFydFdpdGgoNykpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBpbmZvLCBpbmZvKTtcbiAqXG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICogQHNlZSB7QGxpbmsgaW5kZXgvRU1QVFl9XG4gKiBAc2VlIHtAbGluayBvZn1cbiAqIEBzZWUge0BsaW5rIHRocm93RXJyb3J9XG4gKi9cbmV4cG9ydCBjb25zdCBORVZFUiA9IG5ldyBPYnNlcnZhYmxlPG5ldmVyPihub29wKTtcblxuLyoqXG4gKiBAZGVwcmVjYXRlZCBEZXByZWNhdGVkIGluIGZhdm9yIG9mIHVzaW5nIHtAbGluayBORVZFUn0gY29uc3RhbnQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBuZXZlciAoKSB7XG4gIHJldHVybiBORVZFUjtcbn1cbiJdfQ==