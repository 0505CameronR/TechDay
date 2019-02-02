"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("./internal/Observable");
require("./internal/observable/dom/MiscJSDoc");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
var ObservableDoc = /** @class */ (function () {
    function ObservableDoc() {
    }
    /**
     * Creates a new Observable, that will execute the specified function when an
     * {@link Observer} subscribes to it.
     *
     * <span class="informal">Create custom Observable, that does whatever you like.</span>
     *
     * ![](create.png)
     *
     * `create` converts an `onSubscription` function to an actual Observable.
     * Whenever someone subscribes to that Observable, the function will be called
     * with an {@link Observer} instance as a first and only parameter. `onSubscription` should
     * then invoke the Observers `next`, `error` and `complete` methods.
     *
     * Calling `next` with a value will emit that value to the observer. Calling `complete`
     * means that Observable finished emitting and will not do anything else.
     * Calling `error` means that something went wrong - value passed to `error` method should
     * provide details on what exactly happened.
     *
     * A well-formed Observable can emit as many values as it needs via `next` method,
     * but `complete` and `error` methods can be called only once and nothing else can be called
     * thereafter. If you try to invoke `next`, `complete` or `error` methods after created
     * Observable already completed or ended with an error, these calls will be ignored to
     * preserve so called *Observable Contract*. Note that you are not required to call
     * `complete` at any point - it is perfectly fine to create an Observable that never ends,
     * depending on your needs.
     *
     * `onSubscription` can optionally return either a function or an object with
     * `unsubscribe` method. In both cases function or method will be called when
     * subscription to Observable is being cancelled and should be used to clean up all
     * resources. So, for example, if you are using `setTimeout` in your custom
     * Observable, when someone unsubscribes, you can clear planned timeout, so that
     * it does not fire needlessly and browser (or other environment) does not waste
     * computing power on timing event that no one will listen to anyways.
     *
     * Most of the times you should not need to use `create`, because existing
     * operators allow you to create an Observable for most of the use cases.
     * That being said, `create` is low-level mechanism allowing you to create
     * any Observable, if you have very specific needs.
     *
     * **TypeScript signature issue**
     *
     * Because Observable extends class which already has defined static `create` function,
     * but with different type signature, it was impossible to assign proper signature to
     * `Observable.create`. Because of that, it has very general type `Function` and thus
     * function passed to `create` will not be type checked, unless you explicitly state
     * what signature it should have.
     *
     * When using TypeScript we recommend to declare type signature of function passed to
     * `create` as `(observer: Observer) => TeardownLogic`, where {@link Observer}
     * and {@link TeardownLogic} are interfaces provided by the library.
     *
     * @example <caption>Emit three numbers, then complete.</caption>
     * var observable = Rx.Observable.create(function (observer) {
     *   observer.next(1);
     *   observer.next(2);
     *   observer.next(3);
     *   observer.complete();
     * });
     * observable.subscribe(
     *   value => console.log(value),
     *   err => {},
     *   () => console.log('this is the end')
     * );
     *
     * // Logs
     * // 1
     * // 2
     * // 3
     * // "this is the end"
     *
     *
     * @example <caption>Emit an error</caption>
     * const observable = Rx.Observable.create((observer) => {
     *   observer.error('something went really wrong...');
     * });
     *
     * observable.subscribe(
     *   value => console.log(value), // will never be called
     *   err => console.log(err),
     *   () => console.log('complete') // will never be called
     * );
     *
     * // Logs
     * // "something went really wrong..."
     *
     *
     * @example <caption>Return unsubscribe function</caption>
     *
     * const observable = Rx.Observable.create(observer => {
     *   const id = setTimeout(() => observer.next('...'), 5000); // emit value after 5s
     *
     *   return () => { clearTimeout(id); console.log('cleared!'); };
     * });
     *
     * const subscription = observable.subscribe(value => console.log(value));
     *
     * setTimeout(() => subscription.unsubscribe(), 3000); // cancel subscription after 3s
     *
     * // Logs:
     * // "cleared!" after 3s
     *
     * // Never logs "..."
     *
     *
     * @see {@link empty}
     * @see {@link never}
     * @see {@link of}
     * @see {@link throw}
     *
     * @param {function(observer: Observer): TeardownLogic} onSubscription A
     * function that accepts an Observer, and invokes its `next`,
     * `error`, and `complete` methods as appropriate, and optionally returns some
     * logic for cleaning up resources.
     * @return {Observable} An Observable that, whenever subscribed, will execute the
     * specified function.
     * @static true
     * @name create
     * @owner Observable
     * @nocollapse
     */
    ObservableDoc.create = function (onSubscription) {
        return new Observable_1.Observable(onSubscription);
    };
    return ObservableDoc;
}());
exports.ObservableDoc = ObservableDoc;
/**
 * An interface for a consumer of push-based notifications delivered by an
 * {@link Observable}.
 *
 * ```ts
 * interface Observer<T> {
 *   closed?: boolean;
 *   next: (value: T) => void;
 *   error: (err: any) => void;
 *   complete: () => void;
 * }
 * ```
 *
 * An object conforming to the Observer interface is usually
 * given to the `observable.subscribe(observer)` method, and the Observable will
 * call the Observer's `next(value)` method to provide notifications. A
 * well-behaved Observable will call an Observer's `complete()` method exactly
 * once or the Observer's `error(err)` method exactly once, as the last
 * notification delivered.
 *
 * @interface
 * @name Observer
 * @noimport true
 */
var ObserverDoc = /** @class */ (function () {
    function ObserverDoc() {
        /**
         * An optional flag to indicate whether this Observer, when used as a
         * subscriber, has already been unsubscribed from its Observable.
         * @type {boolean}
         */
        this.closed = false;
    }
    /**
     * The callback to receive notifications of type `next` from the Observable,
     * with a value. The Observable may call this method 0 or more times.
     * @param {T} value The `next` value.
     * @return {void}
     */
    ObserverDoc.prototype.next = function (value) {
        return void 0;
    };
    /**
     * The callback to receive notifications of type `error` from the Observable,
     * with an attached {@link Error}. Notifies the Observer that the Observable
     * has experienced an error condition.
     * @param {any} err The `error` exception.
     * @return {void}
     */
    ObserverDoc.prototype.error = function (err) {
        return void 0;
    };
    /**
     * The callback to receive a valueless notification of type `complete` from
     * the Observable. Notifies the Observer that the Observable has finished
     * sending push-based notifications.
     * @return {void}
     */
    ObserverDoc.prototype.complete = function () {
        return void 0;
    };
    return ObserverDoc;
}());
exports.ObserverDoc = ObserverDoc;
/**
 * `SubscribableOrPromise` interface describes values that behave like either
 * Observables or Promises. Every operator that accepts arguments annotated
 * with this interface, can be also used with parameters that are not necessarily
 * RxJS Observables.
 *
 * Following types of values might be passed to operators expecting this interface:
 *
 * ## Observable
 *
 * RxJS {@link Observable} instance.
 *
 * ## Observable-like (Subscribable)
 *
 * This might be any object that has `Symbol.observable` method. This method,
 * when called, should return object with `subscribe` method on it, which should
 * behave the same as RxJS `Observable.subscribe`.
 *
 * `Symbol.observable` is part of https://github.com/tc39/proposal-observable proposal.
 * Since currently it is not supported natively, and every symbol is equal only to itself,
 * you should use https://github.com/blesh/symbol-observable polyfill, when implementing
 * custom Observable-likes.
 *
 * **TypeScript Subscribable interface issue**
 *
 * Although TypeScript interface claims that Subscribable is an object that has `subscribe`
 * method declared directly on it, passing custom objects that have `subscribe`
 * method but not `Symbol.observable` method will fail at runtime. Conversely, passing
 * objects with `Symbol.observable` but without `subscribe` will fail at compile time
 * (if you use TypeScript).
 *
 * TypeScript has problem supporting interfaces with methods defined as symbol
 * properties. To get around that, you should implement `subscribe` directly on
 * passed object, and make `Symbol.observable` method simply return `this`. That way
 * everything will work as expected, and compiler will not complain. If you really
 * do not want to put `subscribe` directly on your object, you will have to type cast
 * it to `any`, before passing it to an operator.
 *
 * When this issue is resolved, Subscribable interface will only permit Observable-like
 * objects with `Symbol.observable` defined, no matter if they themselves implement
 * `subscribe` method or not.
 *
 * ## ES6 Promise
 *
 * Promise can be interpreted as Observable that emits value and completes
 * when it is resolved or errors when it is rejected.
 *
 * ## Promise-like (Thenable)
 *
 * Promises passed to operators do not have to be native ES6 Promises.
 * They can be implementations from popular Promise libraries, polyfills
 * or even custom ones. They just need to have `then` method that works
 * as the same as ES6 Promise `then`.
 *
 * @example <caption>Use merge and then map with non-RxJS observable</caption>
 * const nonRxJSObservable = {
 *   subscribe(observer) {
 *     observer.next(1000);
 *     observer.complete();
 *   },
 *   [Symbol.observable]() {
 *     return this;
 *   }
 * };
 *
 * Rx.Observable.merge(nonRxJSObservable)
 * .map(value => "This value is " + value)
 * .subscribe(result => console.log(result)); // Logs "This value is 1000"
 *
 *
 * @example <caption>Use combineLatest with ES6 Promise</caption>
 * Rx.Observable.combineLatest(Promise.resolve(5), Promise.resolve(10), Promise.resolve(15))
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('the end!')
 * );
 * // Logs
 * // [5, 10, 15]
 * // "the end!"
 *
 *
 * @interface
 * @name SubscribableOrPromise
 * @noimport true
 */
var SubscribableOrPromiseDoc = /** @class */ (function () {
    function SubscribableOrPromiseDoc() {
    }
    return SubscribableOrPromiseDoc;
}());
exports.SubscribableOrPromiseDoc = SubscribableOrPromiseDoc;
/**
 * `ObservableInput` interface describes all values that are either an
 * {@link SubscribableOrPromise} or some kind of collection of values that
 * can be transformed to Observable emitting that values. Every operator that
 * accepts arguments annotated with this interface, can be also used with
 * parameters that are not necessarily RxJS Observables.
 *
 * `ObservableInput` extends {@link SubscribableOrPromise} with following types:
 *
 * ## Array
 *
 * Arrays can be interpreted as observables that emit all values in array one by one,
 * from left to right, and then complete immediately.
 *
 * ## Array-like
 *
 * Arrays passed to operators do not have to be built-in JavaScript Arrays. They
 * can be also, for example, `arguments` property available inside every function,
 * [DOM NodeList](https://developer.mozilla.org/pl/docs/Web/API/NodeList),
 * or, actually, any object that has `length` property (which is a number)
 * and stores values under non-negative (zero and up) integers.
 *
 * ## ES6 Iterable
 *
 * Operators will accept both built-in and custom ES6 Iterables, by treating them as
 * observables that emit all its values in order of iteration and then complete
 * when iteration ends. Note that contrary to arrays, Iterables do not have to
 * necessarily be finite, so creating Observables that never complete is possible as well.
 *
 * Note that you can make iterator an instance of Iterable by having it return itself
 * in `Symbol.iterator` method. It means that every operator accepting Iterables accepts,
 * though indirectly, iterators themselves as well. All native ES6 iterators are instances
 * of Iterable by default, so you do not have to implement their `Symbol.iterator` method
 * yourself.
 *
 * **TypeScript Iterable interface issue**
 *
 * TypeScript `ObservableInput` interface actually lacks type signature for Iterables,
 * because of issues it caused in some projects (see [this issue](https://github.com/ReactiveX/rxjs/issues/2306)).
 * If you want to use Iterable as argument for operator, cast it to `any` first.
 * Remember of course that, because of casting, you have to yourself ensure that passed
 * argument really implements said interface.
 *
 *
 * @example <caption>Use merge with arrays</caption>
 * Rx.Observable.merge([1, 2], [4], [5, 6])
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('ta dam!')
 * );
 *
 * // Logs
 * // 1
 * // 2
 * // 3
 * // 4
 * // 5
 * // 6
 * // "ta dam!"
 *
 *
 * @example <caption>Use merge with array-like</caption>
 * Rx.Observable.merge({0: 1, 1: 2, length: 2}, {0: 3, length: 1})
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('nice, huh?')
 * );
 *
 * // Logs
 * // 1
 * // 2
 * // 3
 * // "nice, huh?"
 *
 * @example <caption>Use merge with an Iterable (Map)</caption>
 * const firstMap = new Map([[1, 'a'], [2, 'b']]);
 * const secondMap = new Map([[3, 'c'], [4, 'd']]);
 *
 * Rx.Observable.merge(
 *   firstMap,          // pass Iterable
 *   secondMap.values() // pass iterator, which is itself an Iterable
 * ).subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('yup!')
 * );
 *
 * // Logs
 * // [1, "a"]
 * // [2, "b"]
 * // "c"
 * // "d"
 * // "yup!"
 *
 * @example <caption>Use from with generator (returning infinite iterator)</caption>
 * // infinite stream of incrementing numbers
 * const infinite = function* () {
 *   let i = 0;
 *
 *   while (true) {
 *     yield i++;
 *   }
 * };
 *
 * Rx.Observable.from(infinite())
 * .take(3) // only take 3, cause this is infinite
 * .subscribe(
 *   value => console.log(value),
 *   err => {},
 *   () => console.log('ta dam!')
 * );
 *
 * // Logs
 * // 0
 * // 1
 * // 2
 * // "ta dam!"
 *
 * @interface
 * @name ObservableInput
 * @noimport true
 */
var ObservableInputDoc = /** @class */ (function () {
    function ObservableInputDoc() {
    }
    return ObservableInputDoc;
}());
exports.ObservableInputDoc = ObservableInputDoc;
/**
 *
 * This interface describes what should be returned by function passed to Observable
 * constructor or static {@link create} function. Value of that interface will be used
 * to cancel subscription for given Observable.
 *
 * `TeardownLogic` can be:
 *
 * ## Function
 *
 * Function that takes no parameters. When consumer of created Observable calls `unsubscribe`,
 * that function will be called
 *
 * ## AnonymousSubscription
 *
 * `AnonymousSubscription` is simply an object with `unsubscribe` method on it. That method
 * will work the same as function
 *
 * ## void
 *
 * If created Observable does not have any resources to clean up, function does not have to
 * return anything.
 *
 * @interface
 * @name TeardownLogic
 * @noimport true
 */
var TeardownLogicDoc = /** @class */ (function () {
    function TeardownLogicDoc() {
    }
    return TeardownLogicDoc;
}());
exports.TeardownLogicDoc = TeardownLogicDoc;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY0pTRG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvTWlzY0pTRG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsb0RBQW1EO0FBQ25ELCtDQUE2QztBQUU3Qzs7OztHQUlHO0FBQ0g7SUFBQTtJQTRIQSxDQUFDO0lBM0hDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztPQXVIRztJQUNJLG9CQUFNLEdBQWIsVUFBaUIsY0FBMkQ7UUFDMUUsT0FBTyxJQUFJLHVCQUFVLENBQUksY0FBYyxDQUFDLENBQUM7SUFDM0MsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTVIRCxJQTRIQztBQTVIWSxzQ0FBYTtBQThIMUI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0g7SUFBQTtRQUNFOzs7O1dBSUc7UUFDSCxXQUFNLEdBQVksS0FBSyxDQUFDO0lBNkIxQixDQUFDO0lBNUJDOzs7OztPQUtHO0lBQ0gsMEJBQUksR0FBSixVQUFLLEtBQVE7UUFDWCxPQUFPLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRDs7Ozs7O09BTUc7SUFDSCwyQkFBSyxHQUFMLFVBQU0sR0FBUTtRQUNaLE9BQU8sS0FBSyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNEOzs7OztPQUtHO0lBQ0gsOEJBQVEsR0FBUjtRQUNFLE9BQU8sS0FBSyxDQUFDLENBQUM7SUFDaEIsQ0FBQztJQUNILGtCQUFDO0FBQUQsQ0FBQyxBQW5DRCxJQW1DQztBQW5DWSxrQ0FBVztBQXFDeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxRkc7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELCtCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw0REFBd0I7QUFJckM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJIRztBQUNIO0lBQUE7SUFFQSxDQUFDO0lBQUQseUJBQUM7QUFBRCxDQUFDLEFBRkQsSUFFQztBQUZZLGdEQUFrQjtBQUkvQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQkc7QUFDSDtJQUFBO0lBRUEsQ0FBQztJQUFELHVCQUFDO0FBQUQsQ0FBQyxBQUZELElBRUM7QUFGWSw0Q0FBZ0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKlxuICogVGhpcyBmaWxlIGFuZCBpdHMgZGVmaW5pdGlvbnMgYXJlIG5lZWRlZCBqdXN0IHNvIHRoYXQgRVNEb2Mgc2VlcyB0aGVzZVxuICogSlNEb2MgZG9jdW1lbnRhdGlvbiBjb21tZW50cy4gT3JpZ2luYWxseSB0aGV5IHdlcmUgbWVhbnQgZm9yIHNvbWUgVHlwZVNjcmlwdFxuICogaW50ZXJmYWNlcywgYnV0IFR5cGVTY3JpcHQgc3RyaXBzIGF3YXkgSlNEb2MgY29tbWVudHMgbmVhciBpbnRlcmZhY2VzLiBIZW5jZSxcbiAqIHdlIG5lZWQgdGhlc2UgYm9ndXMgY2xhc3Nlcywgd2hpY2ggYXJlIG5vdCBzdHJpcHBlZCBhd2F5LiBUaGlzIGZpbGUgb24gdGhlXG4gKiBvdGhlciBoYW5kLCBpcyBub3QgaW5jbHVkZWQgaW4gdGhlIHJlbGVhc2UgYnVuZGxlLlxuICovXG5pbXBvcnQgeyBPYnNlcnZlciwgVGVhcmRvd25Mb2dpYyB9IGZyb20gJy4vaW50ZXJuYWwvdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4vaW50ZXJuYWwvT2JzZXJ2YWJsZSc7XG5pbXBvcnQgJy4vaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vTWlzY0pTRG9jJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKiBAaGlkZSB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlRG9jIHtcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgT2JzZXJ2YWJsZSwgdGhhdCB3aWxsIGV4ZWN1dGUgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiB3aGVuIGFuXG4gICAqIHtAbGluayBPYnNlcnZlcn0gc3Vic2NyaWJlcyB0byBpdC5cbiAgICpcbiAgICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkNyZWF0ZSBjdXN0b20gT2JzZXJ2YWJsZSwgdGhhdCBkb2VzIHdoYXRldmVyIHlvdSBsaWtlLjwvc3Bhbj5cbiAgICpcbiAgICogIVtdKGNyZWF0ZS5wbmcpXG4gICAqXG4gICAqIGBjcmVhdGVgIGNvbnZlcnRzIGFuIGBvblN1YnNjcmlwdGlvbmAgZnVuY3Rpb24gdG8gYW4gYWN0dWFsIE9ic2VydmFibGUuXG4gICAqIFdoZW5ldmVyIHNvbWVvbmUgc3Vic2NyaWJlcyB0byB0aGF0IE9ic2VydmFibGUsIHRoZSBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxuICAgKiB3aXRoIGFuIHtAbGluayBPYnNlcnZlcn0gaW5zdGFuY2UgYXMgYSBmaXJzdCBhbmQgb25seSBwYXJhbWV0ZXIuIGBvblN1YnNjcmlwdGlvbmAgc2hvdWxkXG4gICAqIHRoZW4gaW52b2tlIHRoZSBPYnNlcnZlcnMgYG5leHRgLCBgZXJyb3JgIGFuZCBgY29tcGxldGVgIG1ldGhvZHMuXG4gICAqXG4gICAqIENhbGxpbmcgYG5leHRgIHdpdGggYSB2YWx1ZSB3aWxsIGVtaXQgdGhhdCB2YWx1ZSB0byB0aGUgb2JzZXJ2ZXIuIENhbGxpbmcgYGNvbXBsZXRlYFxuICAgKiBtZWFucyB0aGF0IE9ic2VydmFibGUgZmluaXNoZWQgZW1pdHRpbmcgYW5kIHdpbGwgbm90IGRvIGFueXRoaW5nIGVsc2UuXG4gICAqIENhbGxpbmcgYGVycm9yYCBtZWFucyB0aGF0IHNvbWV0aGluZyB3ZW50IHdyb25nIC0gdmFsdWUgcGFzc2VkIHRvIGBlcnJvcmAgbWV0aG9kIHNob3VsZFxuICAgKiBwcm92aWRlIGRldGFpbHMgb24gd2hhdCBleGFjdGx5IGhhcHBlbmVkLlxuICAgKlxuICAgKiBBIHdlbGwtZm9ybWVkIE9ic2VydmFibGUgY2FuIGVtaXQgYXMgbWFueSB2YWx1ZXMgYXMgaXQgbmVlZHMgdmlhIGBuZXh0YCBtZXRob2QsXG4gICAqIGJ1dCBgY29tcGxldGVgIGFuZCBgZXJyb3JgIG1ldGhvZHMgY2FuIGJlIGNhbGxlZCBvbmx5IG9uY2UgYW5kIG5vdGhpbmcgZWxzZSBjYW4gYmUgY2FsbGVkXG4gICAqIHRoZXJlYWZ0ZXIuIElmIHlvdSB0cnkgdG8gaW52b2tlIGBuZXh0YCwgYGNvbXBsZXRlYCBvciBgZXJyb3JgIG1ldGhvZHMgYWZ0ZXIgY3JlYXRlZFxuICAgKiBPYnNlcnZhYmxlIGFscmVhZHkgY29tcGxldGVkIG9yIGVuZGVkIHdpdGggYW4gZXJyb3IsIHRoZXNlIGNhbGxzIHdpbGwgYmUgaWdub3JlZCB0b1xuICAgKiBwcmVzZXJ2ZSBzbyBjYWxsZWQgKk9ic2VydmFibGUgQ29udHJhY3QqLiBOb3RlIHRoYXQgeW91IGFyZSBub3QgcmVxdWlyZWQgdG8gY2FsbFxuICAgKiBgY29tcGxldGVgIGF0IGFueSBwb2ludCAtIGl0IGlzIHBlcmZlY3RseSBmaW5lIHRvIGNyZWF0ZSBhbiBPYnNlcnZhYmxlIHRoYXQgbmV2ZXIgZW5kcyxcbiAgICogZGVwZW5kaW5nIG9uIHlvdXIgbmVlZHMuXG4gICAqXG4gICAqIGBvblN1YnNjcmlwdGlvbmAgY2FuIG9wdGlvbmFsbHkgcmV0dXJuIGVpdGhlciBhIGZ1bmN0aW9uIG9yIGFuIG9iamVjdCB3aXRoXG4gICAqIGB1bnN1YnNjcmliZWAgbWV0aG9kLiBJbiBib3RoIGNhc2VzIGZ1bmN0aW9uIG9yIG1ldGhvZCB3aWxsIGJlIGNhbGxlZCB3aGVuXG4gICAqIHN1YnNjcmlwdGlvbiB0byBPYnNlcnZhYmxlIGlzIGJlaW5nIGNhbmNlbGxlZCBhbmQgc2hvdWxkIGJlIHVzZWQgdG8gY2xlYW4gdXAgYWxsXG4gICAqIHJlc291cmNlcy4gU28sIGZvciBleGFtcGxlLCBpZiB5b3UgYXJlIHVzaW5nIGBzZXRUaW1lb3V0YCBpbiB5b3VyIGN1c3RvbVxuICAgKiBPYnNlcnZhYmxlLCB3aGVuIHNvbWVvbmUgdW5zdWJzY3JpYmVzLCB5b3UgY2FuIGNsZWFyIHBsYW5uZWQgdGltZW91dCwgc28gdGhhdFxuICAgKiBpdCBkb2VzIG5vdCBmaXJlIG5lZWRsZXNzbHkgYW5kIGJyb3dzZXIgKG9yIG90aGVyIGVudmlyb25tZW50KSBkb2VzIG5vdCB3YXN0ZVxuICAgKiBjb21wdXRpbmcgcG93ZXIgb24gdGltaW5nIGV2ZW50IHRoYXQgbm8gb25lIHdpbGwgbGlzdGVuIHRvIGFueXdheXMuXG4gICAqXG4gICAqIE1vc3Qgb2YgdGhlIHRpbWVzIHlvdSBzaG91bGQgbm90IG5lZWQgdG8gdXNlIGBjcmVhdGVgLCBiZWNhdXNlIGV4aXN0aW5nXG4gICAqIG9wZXJhdG9ycyBhbGxvdyB5b3UgdG8gY3JlYXRlIGFuIE9ic2VydmFibGUgZm9yIG1vc3Qgb2YgdGhlIHVzZSBjYXNlcy5cbiAgICogVGhhdCBiZWluZyBzYWlkLCBgY3JlYXRlYCBpcyBsb3ctbGV2ZWwgbWVjaGFuaXNtIGFsbG93aW5nIHlvdSB0byBjcmVhdGVcbiAgICogYW55IE9ic2VydmFibGUsIGlmIHlvdSBoYXZlIHZlcnkgc3BlY2lmaWMgbmVlZHMuXG4gICAqXG4gICAqICoqVHlwZVNjcmlwdCBzaWduYXR1cmUgaXNzdWUqKlxuICAgKlxuICAgKiBCZWNhdXNlIE9ic2VydmFibGUgZXh0ZW5kcyBjbGFzcyB3aGljaCBhbHJlYWR5IGhhcyBkZWZpbmVkIHN0YXRpYyBgY3JlYXRlYCBmdW5jdGlvbixcbiAgICogYnV0IHdpdGggZGlmZmVyZW50IHR5cGUgc2lnbmF0dXJlLCBpdCB3YXMgaW1wb3NzaWJsZSB0byBhc3NpZ24gcHJvcGVyIHNpZ25hdHVyZSB0b1xuICAgKiBgT2JzZXJ2YWJsZS5jcmVhdGVgLiBCZWNhdXNlIG9mIHRoYXQsIGl0IGhhcyB2ZXJ5IGdlbmVyYWwgdHlwZSBgRnVuY3Rpb25gIGFuZCB0aHVzXG4gICAqIGZ1bmN0aW9uIHBhc3NlZCB0byBgY3JlYXRlYCB3aWxsIG5vdCBiZSB0eXBlIGNoZWNrZWQsIHVubGVzcyB5b3UgZXhwbGljaXRseSBzdGF0ZVxuICAgKiB3aGF0IHNpZ25hdHVyZSBpdCBzaG91bGQgaGF2ZS5cbiAgICpcbiAgICogV2hlbiB1c2luZyBUeXBlU2NyaXB0IHdlIHJlY29tbWVuZCB0byBkZWNsYXJlIHR5cGUgc2lnbmF0dXJlIG9mIGZ1bmN0aW9uIHBhc3NlZCB0b1xuICAgKiBgY3JlYXRlYCBhcyBgKG9ic2VydmVyOiBPYnNlcnZlcikgPT4gVGVhcmRvd25Mb2dpY2AsIHdoZXJlIHtAbGluayBPYnNlcnZlcn1cbiAgICogYW5kIHtAbGluayBUZWFyZG93bkxvZ2ljfSBhcmUgaW50ZXJmYWNlcyBwcm92aWRlZCBieSB0aGUgbGlicmFyeS5cbiAgICpcbiAgICogQGV4YW1wbGUgPGNhcHRpb24+RW1pdCB0aHJlZSBudW1iZXJzLCB0aGVuIGNvbXBsZXRlLjwvY2FwdGlvbj5cbiAgICogdmFyIG9ic2VydmFibGUgPSBSeC5PYnNlcnZhYmxlLmNyZWF0ZShmdW5jdGlvbiAob2JzZXJ2ZXIpIHtcbiAgICogICBvYnNlcnZlci5uZXh0KDEpO1xuICAgKiAgIG9ic2VydmVyLm5leHQoMik7XG4gICAqICAgb2JzZXJ2ZXIubmV4dCgzKTtcbiAgICogICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICAgKiB9KTtcbiAgICogb2JzZXJ2YWJsZS5zdWJzY3JpYmUoXG4gICAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICAgKiAgIGVyciA9PiB7fSxcbiAgICogICAoKSA9PiBjb25zb2xlLmxvZygndGhpcyBpcyB0aGUgZW5kJylcbiAgICogKTtcbiAgICpcbiAgICogLy8gTG9nc1xuICAgKiAvLyAxXG4gICAqIC8vIDJcbiAgICogLy8gM1xuICAgKiAvLyBcInRoaXMgaXMgdGhlIGVuZFwiXG4gICAqXG4gICAqXG4gICAqIEBleGFtcGxlIDxjYXB0aW9uPkVtaXQgYW4gZXJyb3I8L2NhcHRpb24+XG4gICAqIGNvbnN0IG9ic2VydmFibGUgPSBSeC5PYnNlcnZhYmxlLmNyZWF0ZSgob2JzZXJ2ZXIpID0+IHtcbiAgICogICBvYnNlcnZlci5lcnJvcignc29tZXRoaW5nIHdlbnQgcmVhbGx5IHdyb25nLi4uJyk7XG4gICAqIH0pO1xuICAgKlxuICAgKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksIC8vIHdpbGwgbmV2ZXIgYmUgY2FsbGVkXG4gICAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVyciksXG4gICAqICAgKCkgPT4gY29uc29sZS5sb2coJ2NvbXBsZXRlJykgLy8gd2lsbCBuZXZlciBiZSBjYWxsZWRcbiAgICogKTtcbiAgICpcbiAgICogLy8gTG9nc1xuICAgKiAvLyBcInNvbWV0aGluZyB3ZW50IHJlYWxseSB3cm9uZy4uLlwiXG4gICAqXG4gICAqXG4gICAqIEBleGFtcGxlIDxjYXB0aW9uPlJldHVybiB1bnN1YnNjcmliZSBmdW5jdGlvbjwvY2FwdGlvbj5cbiAgICpcbiAgICogY29uc3Qgb2JzZXJ2YWJsZSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHtcbiAgICogICBjb25zdCBpZCA9IHNldFRpbWVvdXQoKCkgPT4gb2JzZXJ2ZXIubmV4dCgnLi4uJyksIDUwMDApOyAvLyBlbWl0IHZhbHVlIGFmdGVyIDVzXG4gICAqXG4gICAqICAgcmV0dXJuICgpID0+IHsgY2xlYXJUaW1lb3V0KGlkKTsgY29uc29sZS5sb2coJ2NsZWFyZWQhJyk7IH07XG4gICAqIH0pO1xuICAgKlxuICAgKiBjb25zdCBzdWJzY3JpcHRpb24gPSBvYnNlcnZhYmxlLnN1YnNjcmliZSh2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSkpO1xuICAgKlxuICAgKiBzZXRUaW1lb3V0KCgpID0+IHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpLCAzMDAwKTsgLy8gY2FuY2VsIHN1YnNjcmlwdGlvbiBhZnRlciAzc1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcImNsZWFyZWQhXCIgYWZ0ZXIgM3NcbiAgICpcbiAgICogLy8gTmV2ZXIgbG9ncyBcIi4uLlwiXG4gICAqXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGVtcHR5fVxuICAgKiBAc2VlIHtAbGluayBuZXZlcn1cbiAgICogQHNlZSB7QGxpbmsgb2Z9XG4gICAqIEBzZWUge0BsaW5rIHRocm93fVxuICAgKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKG9ic2VydmVyOiBPYnNlcnZlcik6IFRlYXJkb3duTG9naWN9IG9uU3Vic2NyaXB0aW9uIEFcbiAgICogZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGFuIE9ic2VydmVyLCBhbmQgaW52b2tlcyBpdHMgYG5leHRgLFxuICAgKiBgZXJyb3JgLCBhbmQgYGNvbXBsZXRlYCBtZXRob2RzIGFzIGFwcHJvcHJpYXRlLCBhbmQgb3B0aW9uYWxseSByZXR1cm5zIHNvbWVcbiAgICogbG9naWMgZm9yIGNsZWFuaW5nIHVwIHJlc291cmNlcy5cbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gQW4gT2JzZXJ2YWJsZSB0aGF0LCB3aGVuZXZlciBzdWJzY3JpYmVkLCB3aWxsIGV4ZWN1dGUgdGhlXG4gICAqIHNwZWNpZmllZCBmdW5jdGlvbi5cbiAgICogQHN0YXRpYyB0cnVlXG4gICAqIEBuYW1lIGNyZWF0ZVxuICAgKiBAb3duZXIgT2JzZXJ2YWJsZVxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTxUPihvblN1YnNjcmlwdGlvbjogPFI+KG9ic2VydmVyOiBPYnNlcnZlcjxSPikgPT4gVGVhcmRvd25Mb2dpYyk6IE9ic2VydmFibGU8VD4ge1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihvblN1YnNjcmlwdGlvbik7XG4gIH1cbn1cblxuLyoqXG4gKiBBbiBpbnRlcmZhY2UgZm9yIGEgY29uc3VtZXIgb2YgcHVzaC1iYXNlZCBub3RpZmljYXRpb25zIGRlbGl2ZXJlZCBieSBhblxuICoge0BsaW5rIE9ic2VydmFibGV9LlxuICpcbiAqIGBgYHRzXG4gKiBpbnRlcmZhY2UgT2JzZXJ2ZXI8VD4ge1xuICogICBjbG9zZWQ/OiBib29sZWFuO1xuICogICBuZXh0OiAodmFsdWU6IFQpID0+IHZvaWQ7XG4gKiAgIGVycm9yOiAoZXJyOiBhbnkpID0+IHZvaWQ7XG4gKiAgIGNvbXBsZXRlOiAoKSA9PiB2b2lkO1xuICogfVxuICogYGBgXG4gKlxuICogQW4gb2JqZWN0IGNvbmZvcm1pbmcgdG8gdGhlIE9ic2VydmVyIGludGVyZmFjZSBpcyB1c3VhbGx5XG4gKiBnaXZlbiB0byB0aGUgYG9ic2VydmFibGUuc3Vic2NyaWJlKG9ic2VydmVyKWAgbWV0aG9kLCBhbmQgdGhlIE9ic2VydmFibGUgd2lsbFxuICogY2FsbCB0aGUgT2JzZXJ2ZXIncyBgbmV4dCh2YWx1ZSlgIG1ldGhvZCB0byBwcm92aWRlIG5vdGlmaWNhdGlvbnMuIEFcbiAqIHdlbGwtYmVoYXZlZCBPYnNlcnZhYmxlIHdpbGwgY2FsbCBhbiBPYnNlcnZlcidzIGBjb21wbGV0ZSgpYCBtZXRob2QgZXhhY3RseVxuICogb25jZSBvciB0aGUgT2JzZXJ2ZXIncyBgZXJyb3IoZXJyKWAgbWV0aG9kIGV4YWN0bHkgb25jZSwgYXMgdGhlIGxhc3RcbiAqIG5vdGlmaWNhdGlvbiBkZWxpdmVyZWQuXG4gKlxuICogQGludGVyZmFjZVxuICogQG5hbWUgT2JzZXJ2ZXJcbiAqIEBub2ltcG9ydCB0cnVlXG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZlckRvYzxUPiB7XG4gIC8qKlxuICAgKiBBbiBvcHRpb25hbCBmbGFnIHRvIGluZGljYXRlIHdoZXRoZXIgdGhpcyBPYnNlcnZlciwgd2hlbiB1c2VkIGFzIGFcbiAgICogc3Vic2NyaWJlciwgaGFzIGFscmVhZHkgYmVlbiB1bnN1YnNjcmliZWQgZnJvbSBpdHMgT2JzZXJ2YWJsZS5cbiAgICogQHR5cGUge2Jvb2xlYW59XG4gICAqL1xuICBjbG9zZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgb2YgdHlwZSBgbmV4dGAgZnJvbSB0aGUgT2JzZXJ2YWJsZSxcbiAgICogd2l0aCBhIHZhbHVlLiBUaGUgT2JzZXJ2YWJsZSBtYXkgY2FsbCB0aGlzIG1ldGhvZCAwIG9yIG1vcmUgdGltZXMuXG4gICAqIEBwYXJhbSB7VH0gdmFsdWUgVGhlIGBuZXh0YCB2YWx1ZS5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIG5leHQodmFsdWU6IFQpOiB2b2lkIHtcbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgdG8gcmVjZWl2ZSBub3RpZmljYXRpb25zIG9mIHR5cGUgYGVycm9yYCBmcm9tIHRoZSBPYnNlcnZhYmxlLFxuICAgKiB3aXRoIGFuIGF0dGFjaGVkIHtAbGluayBFcnJvcn0uIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0IHRoZSBPYnNlcnZhYmxlXG4gICAqIGhhcyBleHBlcmllbmNlZCBhbiBlcnJvciBjb25kaXRpb24uXG4gICAqIEBwYXJhbSB7YW55fSBlcnIgVGhlIGBlcnJvcmAgZXhjZXB0aW9uLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICByZXR1cm4gdm9pZCAwO1xuICB9XG4gIC8qKlxuICAgKiBUaGUgY2FsbGJhY2sgdG8gcmVjZWl2ZSBhIHZhbHVlbGVzcyBub3RpZmljYXRpb24gb2YgdHlwZSBgY29tcGxldGVgIGZyb21cbiAgICogdGhlIE9ic2VydmFibGUuIE5vdGlmaWVzIHRoZSBPYnNlcnZlciB0aGF0IHRoZSBPYnNlcnZhYmxlIGhhcyBmaW5pc2hlZFxuICAgKiBzZW5kaW5nIHB1c2gtYmFzZWQgbm90aWZpY2F0aW9ucy5cbiAgICogQHJldHVybiB7dm9pZH1cbiAgICovXG4gIGNvbXBsZXRlKCk6IHZvaWQge1xuICAgIHJldHVybiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBgU3Vic2NyaWJhYmxlT3JQcm9taXNlYCBpbnRlcmZhY2UgZGVzY3JpYmVzIHZhbHVlcyB0aGF0IGJlaGF2ZSBsaWtlIGVpdGhlclxuICogT2JzZXJ2YWJsZXMgb3IgUHJvbWlzZXMuIEV2ZXJ5IG9wZXJhdG9yIHRoYXQgYWNjZXB0cyBhcmd1bWVudHMgYW5ub3RhdGVkXG4gKiB3aXRoIHRoaXMgaW50ZXJmYWNlLCBjYW4gYmUgYWxzbyB1c2VkIHdpdGggcGFyYW1ldGVycyB0aGF0IGFyZSBub3QgbmVjZXNzYXJpbHlcbiAqIFJ4SlMgT2JzZXJ2YWJsZXMuXG4gKlxuICogRm9sbG93aW5nIHR5cGVzIG9mIHZhbHVlcyBtaWdodCBiZSBwYXNzZWQgdG8gb3BlcmF0b3JzIGV4cGVjdGluZyB0aGlzIGludGVyZmFjZTpcbiAqXG4gKiAjIyBPYnNlcnZhYmxlXG4gKlxuICogUnhKUyB7QGxpbmsgT2JzZXJ2YWJsZX0gaW5zdGFuY2UuXG4gKlxuICogIyMgT2JzZXJ2YWJsZS1saWtlIChTdWJzY3JpYmFibGUpXG4gKlxuICogVGhpcyBtaWdodCBiZSBhbnkgb2JqZWN0IHRoYXQgaGFzIGBTeW1ib2wub2JzZXJ2YWJsZWAgbWV0aG9kLiBUaGlzIG1ldGhvZCxcbiAqIHdoZW4gY2FsbGVkLCBzaG91bGQgcmV0dXJuIG9iamVjdCB3aXRoIGBzdWJzY3JpYmVgIG1ldGhvZCBvbiBpdCwgd2hpY2ggc2hvdWxkXG4gKiBiZWhhdmUgdGhlIHNhbWUgYXMgUnhKUyBgT2JzZXJ2YWJsZS5zdWJzY3JpYmVgLlxuICpcbiAqIGBTeW1ib2wub2JzZXJ2YWJsZWAgaXMgcGFydCBvZiBodHRwczovL2dpdGh1Yi5jb20vdGMzOS9wcm9wb3NhbC1vYnNlcnZhYmxlIHByb3Bvc2FsLlxuICogU2luY2UgY3VycmVudGx5IGl0IGlzIG5vdCBzdXBwb3J0ZWQgbmF0aXZlbHksIGFuZCBldmVyeSBzeW1ib2wgaXMgZXF1YWwgb25seSB0byBpdHNlbGYsXG4gKiB5b3Ugc2hvdWxkIHVzZSBodHRwczovL2dpdGh1Yi5jb20vYmxlc2gvc3ltYm9sLW9ic2VydmFibGUgcG9seWZpbGwsIHdoZW4gaW1wbGVtZW50aW5nXG4gKiBjdXN0b20gT2JzZXJ2YWJsZS1saWtlcy5cbiAqXG4gKiAqKlR5cGVTY3JpcHQgU3Vic2NyaWJhYmxlIGludGVyZmFjZSBpc3N1ZSoqXG4gKlxuICogQWx0aG91Z2ggVHlwZVNjcmlwdCBpbnRlcmZhY2UgY2xhaW1zIHRoYXQgU3Vic2NyaWJhYmxlIGlzIGFuIG9iamVjdCB0aGF0IGhhcyBgc3Vic2NyaWJlYFxuICogbWV0aG9kIGRlY2xhcmVkIGRpcmVjdGx5IG9uIGl0LCBwYXNzaW5nIGN1c3RvbSBvYmplY3RzIHRoYXQgaGF2ZSBgc3Vic2NyaWJlYFxuICogbWV0aG9kIGJ1dCBub3QgYFN5bWJvbC5vYnNlcnZhYmxlYCBtZXRob2Qgd2lsbCBmYWlsIGF0IHJ1bnRpbWUuIENvbnZlcnNlbHksIHBhc3NpbmdcbiAqIG9iamVjdHMgd2l0aCBgU3ltYm9sLm9ic2VydmFibGVgIGJ1dCB3aXRob3V0IGBzdWJzY3JpYmVgIHdpbGwgZmFpbCBhdCBjb21waWxlIHRpbWVcbiAqIChpZiB5b3UgdXNlIFR5cGVTY3JpcHQpLlxuICpcbiAqIFR5cGVTY3JpcHQgaGFzIHByb2JsZW0gc3VwcG9ydGluZyBpbnRlcmZhY2VzIHdpdGggbWV0aG9kcyBkZWZpbmVkIGFzIHN5bWJvbFxuICogcHJvcGVydGllcy4gVG8gZ2V0IGFyb3VuZCB0aGF0LCB5b3Ugc2hvdWxkIGltcGxlbWVudCBgc3Vic2NyaWJlYCBkaXJlY3RseSBvblxuICogcGFzc2VkIG9iamVjdCwgYW5kIG1ha2UgYFN5bWJvbC5vYnNlcnZhYmxlYCBtZXRob2Qgc2ltcGx5IHJldHVybiBgdGhpc2AuIFRoYXQgd2F5XG4gKiBldmVyeXRoaW5nIHdpbGwgd29yayBhcyBleHBlY3RlZCwgYW5kIGNvbXBpbGVyIHdpbGwgbm90IGNvbXBsYWluLiBJZiB5b3UgcmVhbGx5XG4gKiBkbyBub3Qgd2FudCB0byBwdXQgYHN1YnNjcmliZWAgZGlyZWN0bHkgb24geW91ciBvYmplY3QsIHlvdSB3aWxsIGhhdmUgdG8gdHlwZSBjYXN0XG4gKiBpdCB0byBgYW55YCwgYmVmb3JlIHBhc3NpbmcgaXQgdG8gYW4gb3BlcmF0b3IuXG4gKlxuICogV2hlbiB0aGlzIGlzc3VlIGlzIHJlc29sdmVkLCBTdWJzY3JpYmFibGUgaW50ZXJmYWNlIHdpbGwgb25seSBwZXJtaXQgT2JzZXJ2YWJsZS1saWtlXG4gKiBvYmplY3RzIHdpdGggYFN5bWJvbC5vYnNlcnZhYmxlYCBkZWZpbmVkLCBubyBtYXR0ZXIgaWYgdGhleSB0aGVtc2VsdmVzIGltcGxlbWVudFxuICogYHN1YnNjcmliZWAgbWV0aG9kIG9yIG5vdC5cbiAqXG4gKiAjIyBFUzYgUHJvbWlzZVxuICpcbiAqIFByb21pc2UgY2FuIGJlIGludGVycHJldGVkIGFzIE9ic2VydmFibGUgdGhhdCBlbWl0cyB2YWx1ZSBhbmQgY29tcGxldGVzXG4gKiB3aGVuIGl0IGlzIHJlc29sdmVkIG9yIGVycm9ycyB3aGVuIGl0IGlzIHJlamVjdGVkLlxuICpcbiAqICMjIFByb21pc2UtbGlrZSAoVGhlbmFibGUpXG4gKlxuICogUHJvbWlzZXMgcGFzc2VkIHRvIG9wZXJhdG9ycyBkbyBub3QgaGF2ZSB0byBiZSBuYXRpdmUgRVM2IFByb21pc2VzLlxuICogVGhleSBjYW4gYmUgaW1wbGVtZW50YXRpb25zIGZyb20gcG9wdWxhciBQcm9taXNlIGxpYnJhcmllcywgcG9seWZpbGxzXG4gKiBvciBldmVuIGN1c3RvbSBvbmVzLiBUaGV5IGp1c3QgbmVlZCB0byBoYXZlIGB0aGVuYCBtZXRob2QgdGhhdCB3b3Jrc1xuICogYXMgdGhlIHNhbWUgYXMgRVM2IFByb21pc2UgYHRoZW5gLlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSBtZXJnZSBhbmQgdGhlbiBtYXAgd2l0aCBub24tUnhKUyBvYnNlcnZhYmxlPC9jYXB0aW9uPlxuICogY29uc3Qgbm9uUnhKU09ic2VydmFibGUgPSB7XG4gKiAgIHN1YnNjcmliZShvYnNlcnZlcikge1xuICogICAgIG9ic2VydmVyLm5leHQoMTAwMCk7XG4gKiAgICAgb2JzZXJ2ZXIuY29tcGxldGUoKTtcbiAqICAgfSxcbiAqICAgW1N5bWJvbC5vYnNlcnZhYmxlXSgpIHtcbiAqICAgICByZXR1cm4gdGhpcztcbiAqICAgfVxuICogfTtcbiAqXG4gKiBSeC5PYnNlcnZhYmxlLm1lcmdlKG5vblJ4SlNPYnNlcnZhYmxlKVxuICogLm1hcCh2YWx1ZSA9PiBcIlRoaXMgdmFsdWUgaXMgXCIgKyB2YWx1ZSlcbiAqIC5zdWJzY3JpYmUocmVzdWx0ID0+IGNvbnNvbGUubG9nKHJlc3VsdCkpOyAvLyBMb2dzIFwiVGhpcyB2YWx1ZSBpcyAxMDAwXCJcbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIGNvbWJpbmVMYXRlc3Qgd2l0aCBFUzYgUHJvbWlzZTwvY2FwdGlvbj5cbiAqIFJ4Lk9ic2VydmFibGUuY29tYmluZUxhdGVzdChQcm9taXNlLnJlc29sdmUoNSksIFByb21pc2UucmVzb2x2ZSgxMCksIFByb21pc2UucmVzb2x2ZSgxNSkpXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RoZSBlbmQhJylcbiAqICk7XG4gKiAvLyBMb2dzXG4gKiAvLyBbNSwgMTAsIDE1XVxuICogLy8gXCJ0aGUgZW5kIVwiXG4gKlxuICpcbiAqIEBpbnRlcmZhY2VcbiAqIEBuYW1lIFN1YnNjcmliYWJsZU9yUHJvbWlzZVxuICogQG5vaW1wb3J0IHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIFN1YnNjcmliYWJsZU9yUHJvbWlzZURvYzxUPiB7XG5cbn1cblxuLyoqXG4gKiBgT2JzZXJ2YWJsZUlucHV0YCBpbnRlcmZhY2UgZGVzY3JpYmVzIGFsbCB2YWx1ZXMgdGhhdCBhcmUgZWl0aGVyIGFuXG4gKiB7QGxpbmsgU3Vic2NyaWJhYmxlT3JQcm9taXNlfSBvciBzb21lIGtpbmQgb2YgY29sbGVjdGlvbiBvZiB2YWx1ZXMgdGhhdFxuICogY2FuIGJlIHRyYW5zZm9ybWVkIHRvIE9ic2VydmFibGUgZW1pdHRpbmcgdGhhdCB2YWx1ZXMuIEV2ZXJ5IG9wZXJhdG9yIHRoYXRcbiAqIGFjY2VwdHMgYXJndW1lbnRzIGFubm90YXRlZCB3aXRoIHRoaXMgaW50ZXJmYWNlLCBjYW4gYmUgYWxzbyB1c2VkIHdpdGhcbiAqIHBhcmFtZXRlcnMgdGhhdCBhcmUgbm90IG5lY2Vzc2FyaWx5IFJ4SlMgT2JzZXJ2YWJsZXMuXG4gKlxuICogYE9ic2VydmFibGVJbnB1dGAgZXh0ZW5kcyB7QGxpbmsgU3Vic2NyaWJhYmxlT3JQcm9taXNlfSB3aXRoIGZvbGxvd2luZyB0eXBlczpcbiAqXG4gKiAjIyBBcnJheVxuICpcbiAqIEFycmF5cyBjYW4gYmUgaW50ZXJwcmV0ZWQgYXMgb2JzZXJ2YWJsZXMgdGhhdCBlbWl0IGFsbCB2YWx1ZXMgaW4gYXJyYXkgb25lIGJ5IG9uZSxcbiAqIGZyb20gbGVmdCB0byByaWdodCwgYW5kIHRoZW4gY29tcGxldGUgaW1tZWRpYXRlbHkuXG4gKlxuICogIyMgQXJyYXktbGlrZVxuICpcbiAqIEFycmF5cyBwYXNzZWQgdG8gb3BlcmF0b3JzIGRvIG5vdCBoYXZlIHRvIGJlIGJ1aWx0LWluIEphdmFTY3JpcHQgQXJyYXlzLiBUaGV5XG4gKiBjYW4gYmUgYWxzbywgZm9yIGV4YW1wbGUsIGBhcmd1bWVudHNgIHByb3BlcnR5IGF2YWlsYWJsZSBpbnNpZGUgZXZlcnkgZnVuY3Rpb24sXG4gKiBbRE9NIE5vZGVMaXN0XShodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9wbC9kb2NzL1dlYi9BUEkvTm9kZUxpc3QpLFxuICogb3IsIGFjdHVhbGx5LCBhbnkgb2JqZWN0IHRoYXQgaGFzIGBsZW5ndGhgIHByb3BlcnR5ICh3aGljaCBpcyBhIG51bWJlcilcbiAqIGFuZCBzdG9yZXMgdmFsdWVzIHVuZGVyIG5vbi1uZWdhdGl2ZSAoemVybyBhbmQgdXApIGludGVnZXJzLlxuICpcbiAqICMjIEVTNiBJdGVyYWJsZVxuICpcbiAqIE9wZXJhdG9ycyB3aWxsIGFjY2VwdCBib3RoIGJ1aWx0LWluIGFuZCBjdXN0b20gRVM2IEl0ZXJhYmxlcywgYnkgdHJlYXRpbmcgdGhlbSBhc1xuICogb2JzZXJ2YWJsZXMgdGhhdCBlbWl0IGFsbCBpdHMgdmFsdWVzIGluIG9yZGVyIG9mIGl0ZXJhdGlvbiBhbmQgdGhlbiBjb21wbGV0ZVxuICogd2hlbiBpdGVyYXRpb24gZW5kcy4gTm90ZSB0aGF0IGNvbnRyYXJ5IHRvIGFycmF5cywgSXRlcmFibGVzIGRvIG5vdCBoYXZlIHRvXG4gKiBuZWNlc3NhcmlseSBiZSBmaW5pdGUsIHNvIGNyZWF0aW5nIE9ic2VydmFibGVzIHRoYXQgbmV2ZXIgY29tcGxldGUgaXMgcG9zc2libGUgYXMgd2VsbC5cbiAqXG4gKiBOb3RlIHRoYXQgeW91IGNhbiBtYWtlIGl0ZXJhdG9yIGFuIGluc3RhbmNlIG9mIEl0ZXJhYmxlIGJ5IGhhdmluZyBpdCByZXR1cm4gaXRzZWxmXG4gKiBpbiBgU3ltYm9sLml0ZXJhdG9yYCBtZXRob2QuIEl0IG1lYW5zIHRoYXQgZXZlcnkgb3BlcmF0b3IgYWNjZXB0aW5nIEl0ZXJhYmxlcyBhY2NlcHRzLFxuICogdGhvdWdoIGluZGlyZWN0bHksIGl0ZXJhdG9ycyB0aGVtc2VsdmVzIGFzIHdlbGwuIEFsbCBuYXRpdmUgRVM2IGl0ZXJhdG9ycyBhcmUgaW5zdGFuY2VzXG4gKiBvZiBJdGVyYWJsZSBieSBkZWZhdWx0LCBzbyB5b3UgZG8gbm90IGhhdmUgdG8gaW1wbGVtZW50IHRoZWlyIGBTeW1ib2wuaXRlcmF0b3JgIG1ldGhvZFxuICogeW91cnNlbGYuXG4gKlxuICogKipUeXBlU2NyaXB0IEl0ZXJhYmxlIGludGVyZmFjZSBpc3N1ZSoqXG4gKlxuICogVHlwZVNjcmlwdCBgT2JzZXJ2YWJsZUlucHV0YCBpbnRlcmZhY2UgYWN0dWFsbHkgbGFja3MgdHlwZSBzaWduYXR1cmUgZm9yIEl0ZXJhYmxlcyxcbiAqIGJlY2F1c2Ugb2YgaXNzdWVzIGl0IGNhdXNlZCBpbiBzb21lIHByb2plY3RzIChzZWUgW3RoaXMgaXNzdWVdKGh0dHBzOi8vZ2l0aHViLmNvbS9SZWFjdGl2ZVgvcnhqcy9pc3N1ZXMvMjMwNikpLlxuICogSWYgeW91IHdhbnQgdG8gdXNlIEl0ZXJhYmxlIGFzIGFyZ3VtZW50IGZvciBvcGVyYXRvciwgY2FzdCBpdCB0byBgYW55YCBmaXJzdC5cbiAqIFJlbWVtYmVyIG9mIGNvdXJzZSB0aGF0LCBiZWNhdXNlIG9mIGNhc3RpbmcsIHlvdSBoYXZlIHRvIHlvdXJzZWxmIGVuc3VyZSB0aGF0IHBhc3NlZFxuICogYXJndW1lbnQgcmVhbGx5IGltcGxlbWVudHMgc2FpZCBpbnRlcmZhY2UuXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSBtZXJnZSB3aXRoIGFycmF5czwvY2FwdGlvbj5cbiAqIFJ4Lk9ic2VydmFibGUubWVyZ2UoWzEsIDJdLCBbNF0sIFs1LCA2XSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGEgZGFtIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3NcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIDNcbiAqIC8vIDRcbiAqIC8vIDVcbiAqIC8vIDZcbiAqIC8vIFwidGEgZGFtIVwiXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSBtZXJnZSB3aXRoIGFycmF5LWxpa2U8L2NhcHRpb24+XG4gKiBSeC5PYnNlcnZhYmxlLm1lcmdlKHswOiAxLCAxOiAyLCBsZW5ndGg6IDJ9LCB7MDogMywgbGVuZ3RoOiAxfSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnbmljZSwgaHVoPycpXG4gKiApO1xuICpcbiAqIC8vIExvZ3NcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIDNcbiAqIC8vIFwibmljZSwgaHVoP1wiXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIG1lcmdlIHdpdGggYW4gSXRlcmFibGUgKE1hcCk8L2NhcHRpb24+XG4gKiBjb25zdCBmaXJzdE1hcCA9IG5ldyBNYXAoW1sxLCAnYSddLCBbMiwgJ2InXV0pO1xuICogY29uc3Qgc2Vjb25kTWFwID0gbmV3IE1hcChbWzMsICdjJ10sIFs0LCAnZCddXSk7XG4gKlxuICogUnguT2JzZXJ2YWJsZS5tZXJnZShcbiAqICAgZmlyc3RNYXAsICAgICAgICAgIC8vIHBhc3MgSXRlcmFibGVcbiAqICAgc2Vjb25kTWFwLnZhbHVlcygpIC8vIHBhc3MgaXRlcmF0b3IsIHdoaWNoIGlzIGl0c2VsZiBhbiBJdGVyYWJsZVxuICogKS5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygneXVwIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3NcbiAqIC8vIFsxLCBcImFcIl1cbiAqIC8vIFsyLCBcImJcIl1cbiAqIC8vIFwiY1wiXG4gKiAvLyBcImRcIlxuICogLy8gXCJ5dXAhXCJcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2UgZnJvbSB3aXRoIGdlbmVyYXRvciAocmV0dXJuaW5nIGluZmluaXRlIGl0ZXJhdG9yKTwvY2FwdGlvbj5cbiAqIC8vIGluZmluaXRlIHN0cmVhbSBvZiBpbmNyZW1lbnRpbmcgbnVtYmVyc1xuICogY29uc3QgaW5maW5pdGUgPSBmdW5jdGlvbiogKCkge1xuICogICBsZXQgaSA9IDA7XG4gKlxuICogICB3aGlsZSAodHJ1ZSkge1xuICogICAgIHlpZWxkIGkrKztcbiAqICAgfVxuICogfTtcbiAqXG4gKiBSeC5PYnNlcnZhYmxlLmZyb20oaW5maW5pdGUoKSlcbiAqIC50YWtlKDMpIC8vIG9ubHkgdGFrZSAzLCBjYXVzZSB0aGlzIGlzIGluZmluaXRlXG4gKiAuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ3RhIGRhbSEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzXG4gKiAvLyAwXG4gKiAvLyAxXG4gKiAvLyAyXG4gKiAvLyBcInRhIGRhbSFcIlxuICpcbiAqIEBpbnRlcmZhY2VcbiAqIEBuYW1lIE9ic2VydmFibGVJbnB1dFxuICogQG5vaW1wb3J0IHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGVJbnB1dERvYzxUPiB7XG5cbn1cblxuLyoqXG4gKlxuICogVGhpcyBpbnRlcmZhY2UgZGVzY3JpYmVzIHdoYXQgc2hvdWxkIGJlIHJldHVybmVkIGJ5IGZ1bmN0aW9uIHBhc3NlZCB0byBPYnNlcnZhYmxlXG4gKiBjb25zdHJ1Y3RvciBvciBzdGF0aWMge0BsaW5rIGNyZWF0ZX0gZnVuY3Rpb24uIFZhbHVlIG9mIHRoYXQgaW50ZXJmYWNlIHdpbGwgYmUgdXNlZFxuICogdG8gY2FuY2VsIHN1YnNjcmlwdGlvbiBmb3IgZ2l2ZW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiBgVGVhcmRvd25Mb2dpY2AgY2FuIGJlOlxuICpcbiAqICMjIEZ1bmN0aW9uXG4gKlxuICogRnVuY3Rpb24gdGhhdCB0YWtlcyBubyBwYXJhbWV0ZXJzLiBXaGVuIGNvbnN1bWVyIG9mIGNyZWF0ZWQgT2JzZXJ2YWJsZSBjYWxscyBgdW5zdWJzY3JpYmVgLFxuICogdGhhdCBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZFxuICpcbiAqICMjIEFub255bW91c1N1YnNjcmlwdGlvblxuICpcbiAqIGBBbm9ueW1vdXNTdWJzY3JpcHRpb25gIGlzIHNpbXBseSBhbiBvYmplY3Qgd2l0aCBgdW5zdWJzY3JpYmVgIG1ldGhvZCBvbiBpdC4gVGhhdCBtZXRob2RcbiAqIHdpbGwgd29yayB0aGUgc2FtZSBhcyBmdW5jdGlvblxuICpcbiAqICMjIHZvaWRcbiAqXG4gKiBJZiBjcmVhdGVkIE9ic2VydmFibGUgZG9lcyBub3QgaGF2ZSBhbnkgcmVzb3VyY2VzIHRvIGNsZWFuIHVwLCBmdW5jdGlvbiBkb2VzIG5vdCBoYXZlIHRvXG4gKiByZXR1cm4gYW55dGhpbmcuXG4gKlxuICogQGludGVyZmFjZVxuICogQG5hbWUgVGVhcmRvd25Mb2dpY1xuICogQG5vaW1wb3J0IHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIFRlYXJkb3duTG9naWNEb2Mge1xuXG59XG4iXX0=