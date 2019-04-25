import { Observable } from './internal/Observable';
import './internal/observable/dom/MiscJSDoc';
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @extends {Ignored}
 * @hide true
 */
export class ObservableDoc {
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
    static create(onSubscription) {
        return new Observable(onSubscription);
    }
}
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
export class ObserverDoc {
    constructor() {
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
    next(value) {
        return void 0;
    }
    /**
     * The callback to receive notifications of type `error` from the Observable,
     * with an attached {@link Error}. Notifies the Observer that the Observable
     * has experienced an error condition.
     * @param {any} err The `error` exception.
     * @return {void}
     */
    error(err) {
        return void 0;
    }
    /**
     * The callback to receive a valueless notification of type `complete` from
     * the Observable. Notifies the Observer that the Observable has finished
     * sending push-based notifications.
     * @return {void}
     */
    complete() {
        return void 0;
    }
}
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
export class SubscribableOrPromiseDoc {
}
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
export class ObservableInputDoc {
}
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
export class TeardownLogicDoc {
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlzY0pTRG9jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvTWlzY0pTRG9jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNuRCxPQUFPLHFDQUFxQyxDQUFDO0FBRTdDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sYUFBYTtJQUN4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7T0F1SEc7SUFDSCxNQUFNLENBQUMsTUFBTSxDQUFJLGNBQTJEO1FBQzFFLE9BQU8sSUFBSSxVQUFVLENBQUksY0FBYyxDQUFDLENBQUM7SUFDM0MsQ0FBQztDQUNGO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBQ0gsTUFBTSxPQUFPLFdBQVc7SUFBeEI7UUFDRTs7OztXQUlHO1FBQ0gsV0FBTSxHQUFZLEtBQUssQ0FBQztJQTZCMUIsQ0FBQztJQTVCQzs7Ozs7T0FLRztJQUNILElBQUksQ0FBQyxLQUFRO1FBQ1gsT0FBTyxLQUFLLENBQUMsQ0FBQztJQUNoQixDQUFDO0lBQ0Q7Ozs7OztPQU1HO0lBQ0gsS0FBSyxDQUFDLEdBQVE7UUFDWixPQUFPLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLENBQUM7SUFDRDs7Ozs7T0FLRztJQUNILFFBQVE7UUFDTixPQUFPLEtBQUssQ0FBQyxDQUFDO0lBQ2hCLENBQUM7Q0FDRjtBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUZHO0FBQ0gsTUFBTSxPQUFPLHdCQUF3QjtDQUVwQztBQUVEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EySEc7QUFDSCxNQUFNLE9BQU8sa0JBQWtCO0NBRTlCO0FBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEJHO0FBQ0gsTUFBTSxPQUFPLGdCQUFnQjtDQUU1QiIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gKiBUaGlzIGZpbGUgYW5kIGl0cyBkZWZpbml0aW9ucyBhcmUgbmVlZGVkIGp1c3Qgc28gdGhhdCBFU0RvYyBzZWVzIHRoZXNlXG4gKiBKU0RvYyBkb2N1bWVudGF0aW9uIGNvbW1lbnRzLiBPcmlnaW5hbGx5IHRoZXkgd2VyZSBtZWFudCBmb3Igc29tZSBUeXBlU2NyaXB0XG4gKiBpbnRlcmZhY2VzLCBidXQgVHlwZVNjcmlwdCBzdHJpcHMgYXdheSBKU0RvYyBjb21tZW50cyBuZWFyIGludGVyZmFjZXMuIEhlbmNlLFxuICogd2UgbmVlZCB0aGVzZSBib2d1cyBjbGFzc2VzLCB3aGljaCBhcmUgbm90IHN0cmlwcGVkIGF3YXkuIFRoaXMgZmlsZSBvbiB0aGVcbiAqIG90aGVyIGhhbmQsIGlzIG5vdCBpbmNsdWRlZCBpbiB0aGUgcmVsZWFzZSBidW5kbGUuXG4gKi9cbmltcG9ydCB7IE9ic2VydmVyLCBUZWFyZG93bkxvZ2ljIH0gZnJvbSAnLi9pbnRlcm5hbC90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi9pbnRlcm5hbC9PYnNlcnZhYmxlJztcbmltcG9ydCAnLi9pbnRlcm5hbC9vYnNlcnZhYmxlL2RvbS9NaXNjSlNEb2MnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqIEBoaWRlIHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGVEb2Mge1xuICAvKipcbiAgICogQ3JlYXRlcyBhIG5ldyBPYnNlcnZhYmxlLCB0aGF0IHdpbGwgZXhlY3V0ZSB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uIHdoZW4gYW5cbiAgICoge0BsaW5rIE9ic2VydmVyfSBzdWJzY3JpYmVzIHRvIGl0LlxuICAgKlxuICAgKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+Q3JlYXRlIGN1c3RvbSBPYnNlcnZhYmxlLCB0aGF0IGRvZXMgd2hhdGV2ZXIgeW91IGxpa2UuPC9zcGFuPlxuICAgKlxuICAgKiAhW10oY3JlYXRlLnBuZylcbiAgICpcbiAgICogYGNyZWF0ZWAgY29udmVydHMgYW4gYG9uU3Vic2NyaXB0aW9uYCBmdW5jdGlvbiB0byBhbiBhY3R1YWwgT2JzZXJ2YWJsZS5cbiAgICogV2hlbmV2ZXIgc29tZW9uZSBzdWJzY3JpYmVzIHRvIHRoYXQgT2JzZXJ2YWJsZSwgdGhlIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXG4gICAqIHdpdGggYW4ge0BsaW5rIE9ic2VydmVyfSBpbnN0YW5jZSBhcyBhIGZpcnN0IGFuZCBvbmx5IHBhcmFtZXRlci4gYG9uU3Vic2NyaXB0aW9uYCBzaG91bGRcbiAgICogdGhlbiBpbnZva2UgdGhlIE9ic2VydmVycyBgbmV4dGAsIGBlcnJvcmAgYW5kIGBjb21wbGV0ZWAgbWV0aG9kcy5cbiAgICpcbiAgICogQ2FsbGluZyBgbmV4dGAgd2l0aCBhIHZhbHVlIHdpbGwgZW1pdCB0aGF0IHZhbHVlIHRvIHRoZSBvYnNlcnZlci4gQ2FsbGluZyBgY29tcGxldGVgXG4gICAqIG1lYW5zIHRoYXQgT2JzZXJ2YWJsZSBmaW5pc2hlZCBlbWl0dGluZyBhbmQgd2lsbCBub3QgZG8gYW55dGhpbmcgZWxzZS5cbiAgICogQ2FsbGluZyBgZXJyb3JgIG1lYW5zIHRoYXQgc29tZXRoaW5nIHdlbnQgd3JvbmcgLSB2YWx1ZSBwYXNzZWQgdG8gYGVycm9yYCBtZXRob2Qgc2hvdWxkXG4gICAqIHByb3ZpZGUgZGV0YWlscyBvbiB3aGF0IGV4YWN0bHkgaGFwcGVuZWQuXG4gICAqXG4gICAqIEEgd2VsbC1mb3JtZWQgT2JzZXJ2YWJsZSBjYW4gZW1pdCBhcyBtYW55IHZhbHVlcyBhcyBpdCBuZWVkcyB2aWEgYG5leHRgIG1ldGhvZCxcbiAgICogYnV0IGBjb21wbGV0ZWAgYW5kIGBlcnJvcmAgbWV0aG9kcyBjYW4gYmUgY2FsbGVkIG9ubHkgb25jZSBhbmQgbm90aGluZyBlbHNlIGNhbiBiZSBjYWxsZWRcbiAgICogdGhlcmVhZnRlci4gSWYgeW91IHRyeSB0byBpbnZva2UgYG5leHRgLCBgY29tcGxldGVgIG9yIGBlcnJvcmAgbWV0aG9kcyBhZnRlciBjcmVhdGVkXG4gICAqIE9ic2VydmFibGUgYWxyZWFkeSBjb21wbGV0ZWQgb3IgZW5kZWQgd2l0aCBhbiBlcnJvciwgdGhlc2UgY2FsbHMgd2lsbCBiZSBpZ25vcmVkIHRvXG4gICAqIHByZXNlcnZlIHNvIGNhbGxlZCAqT2JzZXJ2YWJsZSBDb250cmFjdCouIE5vdGUgdGhhdCB5b3UgYXJlIG5vdCByZXF1aXJlZCB0byBjYWxsXG4gICAqIGBjb21wbGV0ZWAgYXQgYW55IHBvaW50IC0gaXQgaXMgcGVyZmVjdGx5IGZpbmUgdG8gY3JlYXRlIGFuIE9ic2VydmFibGUgdGhhdCBuZXZlciBlbmRzLFxuICAgKiBkZXBlbmRpbmcgb24geW91ciBuZWVkcy5cbiAgICpcbiAgICogYG9uU3Vic2NyaXB0aW9uYCBjYW4gb3B0aW9uYWxseSByZXR1cm4gZWl0aGVyIGEgZnVuY3Rpb24gb3IgYW4gb2JqZWN0IHdpdGhcbiAgICogYHVuc3Vic2NyaWJlYCBtZXRob2QuIEluIGJvdGggY2FzZXMgZnVuY3Rpb24gb3IgbWV0aG9kIHdpbGwgYmUgY2FsbGVkIHdoZW5cbiAgICogc3Vic2NyaXB0aW9uIHRvIE9ic2VydmFibGUgaXMgYmVpbmcgY2FuY2VsbGVkIGFuZCBzaG91bGQgYmUgdXNlZCB0byBjbGVhbiB1cCBhbGxcbiAgICogcmVzb3VyY2VzLiBTbywgZm9yIGV4YW1wbGUsIGlmIHlvdSBhcmUgdXNpbmcgYHNldFRpbWVvdXRgIGluIHlvdXIgY3VzdG9tXG4gICAqIE9ic2VydmFibGUsIHdoZW4gc29tZW9uZSB1bnN1YnNjcmliZXMsIHlvdSBjYW4gY2xlYXIgcGxhbm5lZCB0aW1lb3V0LCBzbyB0aGF0XG4gICAqIGl0IGRvZXMgbm90IGZpcmUgbmVlZGxlc3NseSBhbmQgYnJvd3NlciAob3Igb3RoZXIgZW52aXJvbm1lbnQpIGRvZXMgbm90IHdhc3RlXG4gICAqIGNvbXB1dGluZyBwb3dlciBvbiB0aW1pbmcgZXZlbnQgdGhhdCBubyBvbmUgd2lsbCBsaXN0ZW4gdG8gYW55d2F5cy5cbiAgICpcbiAgICogTW9zdCBvZiB0aGUgdGltZXMgeW91IHNob3VsZCBub3QgbmVlZCB0byB1c2UgYGNyZWF0ZWAsIGJlY2F1c2UgZXhpc3RpbmdcbiAgICogb3BlcmF0b3JzIGFsbG93IHlvdSB0byBjcmVhdGUgYW4gT2JzZXJ2YWJsZSBmb3IgbW9zdCBvZiB0aGUgdXNlIGNhc2VzLlxuICAgKiBUaGF0IGJlaW5nIHNhaWQsIGBjcmVhdGVgIGlzIGxvdy1sZXZlbCBtZWNoYW5pc20gYWxsb3dpbmcgeW91IHRvIGNyZWF0ZVxuICAgKiBhbnkgT2JzZXJ2YWJsZSwgaWYgeW91IGhhdmUgdmVyeSBzcGVjaWZpYyBuZWVkcy5cbiAgICpcbiAgICogKipUeXBlU2NyaXB0IHNpZ25hdHVyZSBpc3N1ZSoqXG4gICAqXG4gICAqIEJlY2F1c2UgT2JzZXJ2YWJsZSBleHRlbmRzIGNsYXNzIHdoaWNoIGFscmVhZHkgaGFzIGRlZmluZWQgc3RhdGljIGBjcmVhdGVgIGZ1bmN0aW9uLFxuICAgKiBidXQgd2l0aCBkaWZmZXJlbnQgdHlwZSBzaWduYXR1cmUsIGl0IHdhcyBpbXBvc3NpYmxlIHRvIGFzc2lnbiBwcm9wZXIgc2lnbmF0dXJlIHRvXG4gICAqIGBPYnNlcnZhYmxlLmNyZWF0ZWAuIEJlY2F1c2Ugb2YgdGhhdCwgaXQgaGFzIHZlcnkgZ2VuZXJhbCB0eXBlIGBGdW5jdGlvbmAgYW5kIHRodXNcbiAgICogZnVuY3Rpb24gcGFzc2VkIHRvIGBjcmVhdGVgIHdpbGwgbm90IGJlIHR5cGUgY2hlY2tlZCwgdW5sZXNzIHlvdSBleHBsaWNpdGx5IHN0YXRlXG4gICAqIHdoYXQgc2lnbmF0dXJlIGl0IHNob3VsZCBoYXZlLlxuICAgKlxuICAgKiBXaGVuIHVzaW5nIFR5cGVTY3JpcHQgd2UgcmVjb21tZW5kIHRvIGRlY2xhcmUgdHlwZSBzaWduYXR1cmUgb2YgZnVuY3Rpb24gcGFzc2VkIHRvXG4gICAqIGBjcmVhdGVgIGFzIGAob2JzZXJ2ZXI6IE9ic2VydmVyKSA9PiBUZWFyZG93bkxvZ2ljYCwgd2hlcmUge0BsaW5rIE9ic2VydmVyfVxuICAgKiBhbmQge0BsaW5rIFRlYXJkb3duTG9naWN9IGFyZSBpbnRlcmZhY2VzIHByb3ZpZGVkIGJ5IHRoZSBsaWJyYXJ5LlxuICAgKlxuICAgKiBAZXhhbXBsZSA8Y2FwdGlvbj5FbWl0IHRocmVlIG51bWJlcnMsIHRoZW4gY29tcGxldGUuPC9jYXB0aW9uPlxuICAgKiB2YXIgb2JzZXJ2YWJsZSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKGZ1bmN0aW9uIChvYnNlcnZlcikge1xuICAgKiAgIG9ic2VydmVyLm5leHQoMSk7XG4gICAqICAgb2JzZXJ2ZXIubmV4dCgyKTtcbiAgICogICBvYnNlcnZlci5uZXh0KDMpO1xuICAgKiAgIG9ic2VydmVyLmNvbXBsZXRlKCk7XG4gICAqIH0pO1xuICAgKiBvYnNlcnZhYmxlLnN1YnNjcmliZShcbiAgICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gICAqICAgZXJyID0+IHt9LFxuICAgKiAgICgpID0+IGNvbnNvbGUubG9nKCd0aGlzIGlzIHRoZSBlbmQnKVxuICAgKiApO1xuICAgKlxuICAgKiAvLyBMb2dzXG4gICAqIC8vIDFcbiAgICogLy8gMlxuICAgKiAvLyAzXG4gICAqIC8vIFwidGhpcyBpcyB0aGUgZW5kXCJcbiAgICpcbiAgICpcbiAgICogQGV4YW1wbGUgPGNhcHRpb24+RW1pdCBhbiBlcnJvcjwvY2FwdGlvbj5cbiAgICogY29uc3Qgb2JzZXJ2YWJsZSA9IFJ4Lk9ic2VydmFibGUuY3JlYXRlKChvYnNlcnZlcikgPT4ge1xuICAgKiAgIG9ic2VydmVyLmVycm9yKCdzb21ldGhpbmcgd2VudCByZWFsbHkgd3JvbmcuLi4nKTtcbiAgICogfSk7XG4gICAqXG4gICAqIG9ic2VydmFibGUuc3Vic2NyaWJlKFxuICAgKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSwgLy8gd2lsbCBuZXZlciBiZSBjYWxsZWRcbiAgICogICBlcnIgPT4gY29uc29sZS5sb2coZXJyKSxcbiAgICogICAoKSA9PiBjb25zb2xlLmxvZygnY29tcGxldGUnKSAvLyB3aWxsIG5ldmVyIGJlIGNhbGxlZFxuICAgKiApO1xuICAgKlxuICAgKiAvLyBMb2dzXG4gICAqIC8vIFwic29tZXRoaW5nIHdlbnQgcmVhbGx5IHdyb25nLi4uXCJcbiAgICpcbiAgICpcbiAgICogQGV4YW1wbGUgPGNhcHRpb24+UmV0dXJuIHVuc3Vic2NyaWJlIGZ1bmN0aW9uPC9jYXB0aW9uPlxuICAgKlxuICAgKiBjb25zdCBvYnNlcnZhYmxlID0gUnguT2JzZXJ2YWJsZS5jcmVhdGUob2JzZXJ2ZXIgPT4ge1xuICAgKiAgIGNvbnN0IGlkID0gc2V0VGltZW91dCgoKSA9PiBvYnNlcnZlci5uZXh0KCcuLi4nKSwgNTAwMCk7IC8vIGVtaXQgdmFsdWUgYWZ0ZXIgNXNcbiAgICpcbiAgICogICByZXR1cm4gKCkgPT4geyBjbGVhclRpbWVvdXQoaWQpOyBjb25zb2xlLmxvZygnY2xlYXJlZCEnKTsgfTtcbiAgICogfSk7XG4gICAqXG4gICAqIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG9ic2VydmFibGUuc3Vic2NyaWJlKHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSk7XG4gICAqXG4gICAqIHNldFRpbWVvdXQoKCkgPT4gc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCksIDMwMDApOyAvLyBjYW5jZWwgc3Vic2NyaXB0aW9uIGFmdGVyIDNzXG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIFwiY2xlYXJlZCFcIiBhZnRlciAzc1xuICAgKlxuICAgKiAvLyBOZXZlciBsb2dzIFwiLi4uXCJcbiAgICpcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgZW1wdHl9XG4gICAqIEBzZWUge0BsaW5rIG5ldmVyfVxuICAgKiBAc2VlIHtAbGluayBvZn1cbiAgICogQHNlZSB7QGxpbmsgdGhyb3d9XG4gICAqXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24ob2JzZXJ2ZXI6IE9ic2VydmVyKTogVGVhcmRvd25Mb2dpY30gb25TdWJzY3JpcHRpb24gQVxuICAgKiBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgYW4gT2JzZXJ2ZXIsIGFuZCBpbnZva2VzIGl0cyBgbmV4dGAsXG4gICAqIGBlcnJvcmAsIGFuZCBgY29tcGxldGVgIG1ldGhvZHMgYXMgYXBwcm9wcmlhdGUsIGFuZCBvcHRpb25hbGx5IHJldHVybnMgc29tZVxuICAgKiBsb2dpYyBmb3IgY2xlYW5pbmcgdXAgcmVzb3VyY2VzLlxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBBbiBPYnNlcnZhYmxlIHRoYXQsIHdoZW5ldmVyIHN1YnNjcmliZWQsIHdpbGwgZXhlY3V0ZSB0aGVcbiAgICogc3BlY2lmaWVkIGZ1bmN0aW9uLlxuICAgKiBAc3RhdGljIHRydWVcbiAgICogQG5hbWUgY3JlYXRlXG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBub2NvbGxhcHNlXG4gICAqL1xuICBzdGF0aWMgY3JlYXRlPFQ+KG9uU3Vic2NyaXB0aW9uOiA8Uj4ob2JzZXJ2ZXI6IE9ic2VydmVyPFI+KSA9PiBUZWFyZG93bkxvZ2ljKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KG9uU3Vic2NyaXB0aW9uKTtcbiAgfVxufVxuXG4vKipcbiAqIEFuIGludGVyZmFjZSBmb3IgYSBjb25zdW1lciBvZiBwdXNoLWJhc2VkIG5vdGlmaWNhdGlvbnMgZGVsaXZlcmVkIGJ5IGFuXG4gKiB7QGxpbmsgT2JzZXJ2YWJsZX0uXG4gKlxuICogYGBgdHNcbiAqIGludGVyZmFjZSBPYnNlcnZlcjxUPiB7XG4gKiAgIGNsb3NlZD86IGJvb2xlYW47XG4gKiAgIG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZDtcbiAqICAgZXJyb3I6IChlcnI6IGFueSkgPT4gdm9pZDtcbiAqICAgY29tcGxldGU6ICgpID0+IHZvaWQ7XG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBBbiBvYmplY3QgY29uZm9ybWluZyB0byB0aGUgT2JzZXJ2ZXIgaW50ZXJmYWNlIGlzIHVzdWFsbHlcbiAqIGdpdmVuIHRvIHRoZSBgb2JzZXJ2YWJsZS5zdWJzY3JpYmUob2JzZXJ2ZXIpYCBtZXRob2QsIGFuZCB0aGUgT2JzZXJ2YWJsZSB3aWxsXG4gKiBjYWxsIHRoZSBPYnNlcnZlcidzIGBuZXh0KHZhbHVlKWAgbWV0aG9kIHRvIHByb3ZpZGUgbm90aWZpY2F0aW9ucy4gQVxuICogd2VsbC1iZWhhdmVkIE9ic2VydmFibGUgd2lsbCBjYWxsIGFuIE9ic2VydmVyJ3MgYGNvbXBsZXRlKClgIG1ldGhvZCBleGFjdGx5XG4gKiBvbmNlIG9yIHRoZSBPYnNlcnZlcidzIGBlcnJvcihlcnIpYCBtZXRob2QgZXhhY3RseSBvbmNlLCBhcyB0aGUgbGFzdFxuICogbm90aWZpY2F0aW9uIGRlbGl2ZXJlZC5cbiAqXG4gKiBAaW50ZXJmYWNlXG4gKiBAbmFtZSBPYnNlcnZlclxuICogQG5vaW1wb3J0IHRydWVcbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmVyRG9jPFQ+IHtcbiAgLyoqXG4gICAqIEFuIG9wdGlvbmFsIGZsYWcgdG8gaW5kaWNhdGUgd2hldGhlciB0aGlzIE9ic2VydmVyLCB3aGVuIHVzZWQgYXMgYVxuICAgKiBzdWJzY3JpYmVyLCBoYXMgYWxyZWFkeSBiZWVuIHVuc3Vic2NyaWJlZCBmcm9tIGl0cyBPYnNlcnZhYmxlLlxuICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICovXG4gIGNsb3NlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAvKipcbiAgICogVGhlIGNhbGxiYWNrIHRvIHJlY2VpdmUgbm90aWZpY2F0aW9ucyBvZiB0eXBlIGBuZXh0YCBmcm9tIHRoZSBPYnNlcnZhYmxlLFxuICAgKiB3aXRoIGEgdmFsdWUuIFRoZSBPYnNlcnZhYmxlIG1heSBjYWxsIHRoaXMgbWV0aG9kIDAgb3IgbW9yZSB0aW1lcy5cbiAgICogQHBhcmFtIHtUfSB2YWx1ZSBUaGUgYG5leHRgIHZhbHVlLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgbmV4dCh2YWx1ZTogVCk6IHZvaWQge1xuICAgIHJldHVybiB2b2lkIDA7XG4gIH1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0byByZWNlaXZlIG5vdGlmaWNhdGlvbnMgb2YgdHlwZSBgZXJyb3JgIGZyb20gdGhlIE9ic2VydmFibGUsXG4gICAqIHdpdGggYW4gYXR0YWNoZWQge0BsaW5rIEVycm9yfS4gTm90aWZpZXMgdGhlIE9ic2VydmVyIHRoYXQgdGhlIE9ic2VydmFibGVcbiAgICogaGFzIGV4cGVyaWVuY2VkIGFuIGVycm9yIGNvbmRpdGlvbi5cbiAgICogQHBhcmFtIHthbnl9IGVyciBUaGUgYGVycm9yYCBleGNlcHRpb24uXG4gICAqIEByZXR1cm4ge3ZvaWR9XG4gICAqL1xuICBlcnJvcihlcnI6IGFueSk6IHZvaWQge1xuICAgIHJldHVybiB2b2lkIDA7XG4gIH1cbiAgLyoqXG4gICAqIFRoZSBjYWxsYmFjayB0byByZWNlaXZlIGEgdmFsdWVsZXNzIG5vdGlmaWNhdGlvbiBvZiB0eXBlIGBjb21wbGV0ZWAgZnJvbVxuICAgKiB0aGUgT2JzZXJ2YWJsZS4gTm90aWZpZXMgdGhlIE9ic2VydmVyIHRoYXQgdGhlIE9ic2VydmFibGUgaGFzIGZpbmlzaGVkXG4gICAqIHNlbmRpbmcgcHVzaC1iYXNlZCBub3RpZmljYXRpb25zLlxuICAgKiBAcmV0dXJuIHt2b2lkfVxuICAgKi9cbiAgY29tcGxldGUoKTogdm9pZCB7XG4gICAgcmV0dXJuIHZvaWQgMDtcbiAgfVxufVxuXG4vKipcbiAqIGBTdWJzY3JpYmFibGVPclByb21pc2VgIGludGVyZmFjZSBkZXNjcmliZXMgdmFsdWVzIHRoYXQgYmVoYXZlIGxpa2UgZWl0aGVyXG4gKiBPYnNlcnZhYmxlcyBvciBQcm9taXNlcy4gRXZlcnkgb3BlcmF0b3IgdGhhdCBhY2NlcHRzIGFyZ3VtZW50cyBhbm5vdGF0ZWRcbiAqIHdpdGggdGhpcyBpbnRlcmZhY2UsIGNhbiBiZSBhbHNvIHVzZWQgd2l0aCBwYXJhbWV0ZXJzIHRoYXQgYXJlIG5vdCBuZWNlc3NhcmlseVxuICogUnhKUyBPYnNlcnZhYmxlcy5cbiAqXG4gKiBGb2xsb3dpbmcgdHlwZXMgb2YgdmFsdWVzIG1pZ2h0IGJlIHBhc3NlZCB0byBvcGVyYXRvcnMgZXhwZWN0aW5nIHRoaXMgaW50ZXJmYWNlOlxuICpcbiAqICMjIE9ic2VydmFibGVcbiAqXG4gKiBSeEpTIHtAbGluayBPYnNlcnZhYmxlfSBpbnN0YW5jZS5cbiAqXG4gKiAjIyBPYnNlcnZhYmxlLWxpa2UgKFN1YnNjcmliYWJsZSlcbiAqXG4gKiBUaGlzIG1pZ2h0IGJlIGFueSBvYmplY3QgdGhhdCBoYXMgYFN5bWJvbC5vYnNlcnZhYmxlYCBtZXRob2QuIFRoaXMgbWV0aG9kLFxuICogd2hlbiBjYWxsZWQsIHNob3VsZCByZXR1cm4gb2JqZWN0IHdpdGggYHN1YnNjcmliZWAgbWV0aG9kIG9uIGl0LCB3aGljaCBzaG91bGRcbiAqIGJlaGF2ZSB0aGUgc2FtZSBhcyBSeEpTIGBPYnNlcnZhYmxlLnN1YnNjcmliZWAuXG4gKlxuICogYFN5bWJvbC5vYnNlcnZhYmxlYCBpcyBwYXJ0IG9mIGh0dHBzOi8vZ2l0aHViLmNvbS90YzM5L3Byb3Bvc2FsLW9ic2VydmFibGUgcHJvcG9zYWwuXG4gKiBTaW5jZSBjdXJyZW50bHkgaXQgaXMgbm90IHN1cHBvcnRlZCBuYXRpdmVseSwgYW5kIGV2ZXJ5IHN5bWJvbCBpcyBlcXVhbCBvbmx5IHRvIGl0c2VsZixcbiAqIHlvdSBzaG91bGQgdXNlIGh0dHBzOi8vZ2l0aHViLmNvbS9ibGVzaC9zeW1ib2wtb2JzZXJ2YWJsZSBwb2x5ZmlsbCwgd2hlbiBpbXBsZW1lbnRpbmdcbiAqIGN1c3RvbSBPYnNlcnZhYmxlLWxpa2VzLlxuICpcbiAqICoqVHlwZVNjcmlwdCBTdWJzY3JpYmFibGUgaW50ZXJmYWNlIGlzc3VlKipcbiAqXG4gKiBBbHRob3VnaCBUeXBlU2NyaXB0IGludGVyZmFjZSBjbGFpbXMgdGhhdCBTdWJzY3JpYmFibGUgaXMgYW4gb2JqZWN0IHRoYXQgaGFzIGBzdWJzY3JpYmVgXG4gKiBtZXRob2QgZGVjbGFyZWQgZGlyZWN0bHkgb24gaXQsIHBhc3NpbmcgY3VzdG9tIG9iamVjdHMgdGhhdCBoYXZlIGBzdWJzY3JpYmVgXG4gKiBtZXRob2QgYnV0IG5vdCBgU3ltYm9sLm9ic2VydmFibGVgIG1ldGhvZCB3aWxsIGZhaWwgYXQgcnVudGltZS4gQ29udmVyc2VseSwgcGFzc2luZ1xuICogb2JqZWN0cyB3aXRoIGBTeW1ib2wub2JzZXJ2YWJsZWAgYnV0IHdpdGhvdXQgYHN1YnNjcmliZWAgd2lsbCBmYWlsIGF0IGNvbXBpbGUgdGltZVxuICogKGlmIHlvdSB1c2UgVHlwZVNjcmlwdCkuXG4gKlxuICogVHlwZVNjcmlwdCBoYXMgcHJvYmxlbSBzdXBwb3J0aW5nIGludGVyZmFjZXMgd2l0aCBtZXRob2RzIGRlZmluZWQgYXMgc3ltYm9sXG4gKiBwcm9wZXJ0aWVzLiBUbyBnZXQgYXJvdW5kIHRoYXQsIHlvdSBzaG91bGQgaW1wbGVtZW50IGBzdWJzY3JpYmVgIGRpcmVjdGx5IG9uXG4gKiBwYXNzZWQgb2JqZWN0LCBhbmQgbWFrZSBgU3ltYm9sLm9ic2VydmFibGVgIG1ldGhvZCBzaW1wbHkgcmV0dXJuIGB0aGlzYC4gVGhhdCB3YXlcbiAqIGV2ZXJ5dGhpbmcgd2lsbCB3b3JrIGFzIGV4cGVjdGVkLCBhbmQgY29tcGlsZXIgd2lsbCBub3QgY29tcGxhaW4uIElmIHlvdSByZWFsbHlcbiAqIGRvIG5vdCB3YW50IHRvIHB1dCBgc3Vic2NyaWJlYCBkaXJlY3RseSBvbiB5b3VyIG9iamVjdCwgeW91IHdpbGwgaGF2ZSB0byB0eXBlIGNhc3RcbiAqIGl0IHRvIGBhbnlgLCBiZWZvcmUgcGFzc2luZyBpdCB0byBhbiBvcGVyYXRvci5cbiAqXG4gKiBXaGVuIHRoaXMgaXNzdWUgaXMgcmVzb2x2ZWQsIFN1YnNjcmliYWJsZSBpbnRlcmZhY2Ugd2lsbCBvbmx5IHBlcm1pdCBPYnNlcnZhYmxlLWxpa2VcbiAqIG9iamVjdHMgd2l0aCBgU3ltYm9sLm9ic2VydmFibGVgIGRlZmluZWQsIG5vIG1hdHRlciBpZiB0aGV5IHRoZW1zZWx2ZXMgaW1wbGVtZW50XG4gKiBgc3Vic2NyaWJlYCBtZXRob2Qgb3Igbm90LlxuICpcbiAqICMjIEVTNiBQcm9taXNlXG4gKlxuICogUHJvbWlzZSBjYW4gYmUgaW50ZXJwcmV0ZWQgYXMgT2JzZXJ2YWJsZSB0aGF0IGVtaXRzIHZhbHVlIGFuZCBjb21wbGV0ZXNcbiAqIHdoZW4gaXQgaXMgcmVzb2x2ZWQgb3IgZXJyb3JzIHdoZW4gaXQgaXMgcmVqZWN0ZWQuXG4gKlxuICogIyMgUHJvbWlzZS1saWtlIChUaGVuYWJsZSlcbiAqXG4gKiBQcm9taXNlcyBwYXNzZWQgdG8gb3BlcmF0b3JzIGRvIG5vdCBoYXZlIHRvIGJlIG5hdGl2ZSBFUzYgUHJvbWlzZXMuXG4gKiBUaGV5IGNhbiBiZSBpbXBsZW1lbnRhdGlvbnMgZnJvbSBwb3B1bGFyIFByb21pc2UgbGlicmFyaWVzLCBwb2x5ZmlsbHNcbiAqIG9yIGV2ZW4gY3VzdG9tIG9uZXMuIFRoZXkganVzdCBuZWVkIHRvIGhhdmUgYHRoZW5gIG1ldGhvZCB0aGF0IHdvcmtzXG4gKiBhcyB0aGUgc2FtZSBhcyBFUzYgUHJvbWlzZSBgdGhlbmAuXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIG1lcmdlIGFuZCB0aGVuIG1hcCB3aXRoIG5vbi1SeEpTIG9ic2VydmFibGU8L2NhcHRpb24+XG4gKiBjb25zdCBub25SeEpTT2JzZXJ2YWJsZSA9IHtcbiAqICAgc3Vic2NyaWJlKG9ic2VydmVyKSB7XG4gKiAgICAgb2JzZXJ2ZXIubmV4dCgxMDAwKTtcbiAqICAgICBvYnNlcnZlci5jb21wbGV0ZSgpO1xuICogICB9LFxuICogICBbU3ltYm9sLm9ic2VydmFibGVdKCkge1xuICogICAgIHJldHVybiB0aGlzO1xuICogICB9XG4gKiB9O1xuICpcbiAqIFJ4Lk9ic2VydmFibGUubWVyZ2Uobm9uUnhKU09ic2VydmFibGUpXG4gKiAubWFwKHZhbHVlID0+IFwiVGhpcyB2YWx1ZSBpcyBcIiArIHZhbHVlKVxuICogLnN1YnNjcmliZShyZXN1bHQgPT4gY29uc29sZS5sb2cocmVzdWx0KSk7IC8vIExvZ3MgXCJUaGlzIHZhbHVlIGlzIDEwMDBcIlxuICpcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2UgY29tYmluZUxhdGVzdCB3aXRoIEVTNiBQcm9taXNlPC9jYXB0aW9uPlxuICogUnguT2JzZXJ2YWJsZS5jb21iaW5lTGF0ZXN0KFByb21pc2UucmVzb2x2ZSg1KSwgUHJvbWlzZS5yZXNvbHZlKDEwKSwgUHJvbWlzZS5yZXNvbHZlKDE1KSlcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGhlIGVuZCEnKVxuICogKTtcbiAqIC8vIExvZ3NcbiAqIC8vIFs1LCAxMCwgMTVdXG4gKiAvLyBcInRoZSBlbmQhXCJcbiAqXG4gKlxuICogQGludGVyZmFjZVxuICogQG5hbWUgU3Vic2NyaWJhYmxlT3JQcm9taXNlXG4gKiBAbm9pbXBvcnQgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgU3Vic2NyaWJhYmxlT3JQcm9taXNlRG9jPFQ+IHtcblxufVxuXG4vKipcbiAqIGBPYnNlcnZhYmxlSW5wdXRgIGludGVyZmFjZSBkZXNjcmliZXMgYWxsIHZhbHVlcyB0aGF0IGFyZSBlaXRoZXIgYW5cbiAqIHtAbGluayBTdWJzY3JpYmFibGVPclByb21pc2V9IG9yIHNvbWUga2luZCBvZiBjb2xsZWN0aW9uIG9mIHZhbHVlcyB0aGF0XG4gKiBjYW4gYmUgdHJhbnNmb3JtZWQgdG8gT2JzZXJ2YWJsZSBlbWl0dGluZyB0aGF0IHZhbHVlcy4gRXZlcnkgb3BlcmF0b3IgdGhhdFxuICogYWNjZXB0cyBhcmd1bWVudHMgYW5ub3RhdGVkIHdpdGggdGhpcyBpbnRlcmZhY2UsIGNhbiBiZSBhbHNvIHVzZWQgd2l0aFxuICogcGFyYW1ldGVycyB0aGF0IGFyZSBub3QgbmVjZXNzYXJpbHkgUnhKUyBPYnNlcnZhYmxlcy5cbiAqXG4gKiBgT2JzZXJ2YWJsZUlucHV0YCBleHRlbmRzIHtAbGluayBTdWJzY3JpYmFibGVPclByb21pc2V9IHdpdGggZm9sbG93aW5nIHR5cGVzOlxuICpcbiAqICMjIEFycmF5XG4gKlxuICogQXJyYXlzIGNhbiBiZSBpbnRlcnByZXRlZCBhcyBvYnNlcnZhYmxlcyB0aGF0IGVtaXQgYWxsIHZhbHVlcyBpbiBhcnJheSBvbmUgYnkgb25lLFxuICogZnJvbSBsZWZ0IHRvIHJpZ2h0LCBhbmQgdGhlbiBjb21wbGV0ZSBpbW1lZGlhdGVseS5cbiAqXG4gKiAjIyBBcnJheS1saWtlXG4gKlxuICogQXJyYXlzIHBhc3NlZCB0byBvcGVyYXRvcnMgZG8gbm90IGhhdmUgdG8gYmUgYnVpbHQtaW4gSmF2YVNjcmlwdCBBcnJheXMuIFRoZXlcbiAqIGNhbiBiZSBhbHNvLCBmb3IgZXhhbXBsZSwgYGFyZ3VtZW50c2AgcHJvcGVydHkgYXZhaWxhYmxlIGluc2lkZSBldmVyeSBmdW5jdGlvbixcbiAqIFtET00gTm9kZUxpc3RdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL3BsL2RvY3MvV2ViL0FQSS9Ob2RlTGlzdCksXG4gKiBvciwgYWN0dWFsbHksIGFueSBvYmplY3QgdGhhdCBoYXMgYGxlbmd0aGAgcHJvcGVydHkgKHdoaWNoIGlzIGEgbnVtYmVyKVxuICogYW5kIHN0b3JlcyB2YWx1ZXMgdW5kZXIgbm9uLW5lZ2F0aXZlICh6ZXJvIGFuZCB1cCkgaW50ZWdlcnMuXG4gKlxuICogIyMgRVM2IEl0ZXJhYmxlXG4gKlxuICogT3BlcmF0b3JzIHdpbGwgYWNjZXB0IGJvdGggYnVpbHQtaW4gYW5kIGN1c3RvbSBFUzYgSXRlcmFibGVzLCBieSB0cmVhdGluZyB0aGVtIGFzXG4gKiBvYnNlcnZhYmxlcyB0aGF0IGVtaXQgYWxsIGl0cyB2YWx1ZXMgaW4gb3JkZXIgb2YgaXRlcmF0aW9uIGFuZCB0aGVuIGNvbXBsZXRlXG4gKiB3aGVuIGl0ZXJhdGlvbiBlbmRzLiBOb3RlIHRoYXQgY29udHJhcnkgdG8gYXJyYXlzLCBJdGVyYWJsZXMgZG8gbm90IGhhdmUgdG9cbiAqIG5lY2Vzc2FyaWx5IGJlIGZpbml0ZSwgc28gY3JlYXRpbmcgT2JzZXJ2YWJsZXMgdGhhdCBuZXZlciBjb21wbGV0ZSBpcyBwb3NzaWJsZSBhcyB3ZWxsLlxuICpcbiAqIE5vdGUgdGhhdCB5b3UgY2FuIG1ha2UgaXRlcmF0b3IgYW4gaW5zdGFuY2Ugb2YgSXRlcmFibGUgYnkgaGF2aW5nIGl0IHJldHVybiBpdHNlbGZcbiAqIGluIGBTeW1ib2wuaXRlcmF0b3JgIG1ldGhvZC4gSXQgbWVhbnMgdGhhdCBldmVyeSBvcGVyYXRvciBhY2NlcHRpbmcgSXRlcmFibGVzIGFjY2VwdHMsXG4gKiB0aG91Z2ggaW5kaXJlY3RseSwgaXRlcmF0b3JzIHRoZW1zZWx2ZXMgYXMgd2VsbC4gQWxsIG5hdGl2ZSBFUzYgaXRlcmF0b3JzIGFyZSBpbnN0YW5jZXNcbiAqIG9mIEl0ZXJhYmxlIGJ5IGRlZmF1bHQsIHNvIHlvdSBkbyBub3QgaGF2ZSB0byBpbXBsZW1lbnQgdGhlaXIgYFN5bWJvbC5pdGVyYXRvcmAgbWV0aG9kXG4gKiB5b3Vyc2VsZi5cbiAqXG4gKiAqKlR5cGVTY3JpcHQgSXRlcmFibGUgaW50ZXJmYWNlIGlzc3VlKipcbiAqXG4gKiBUeXBlU2NyaXB0IGBPYnNlcnZhYmxlSW5wdXRgIGludGVyZmFjZSBhY3R1YWxseSBsYWNrcyB0eXBlIHNpZ25hdHVyZSBmb3IgSXRlcmFibGVzLFxuICogYmVjYXVzZSBvZiBpc3N1ZXMgaXQgY2F1c2VkIGluIHNvbWUgcHJvamVjdHMgKHNlZSBbdGhpcyBpc3N1ZV0oaHR0cHM6Ly9naXRodWIuY29tL1JlYWN0aXZlWC9yeGpzL2lzc3Vlcy8yMzA2KSkuXG4gKiBJZiB5b3Ugd2FudCB0byB1c2UgSXRlcmFibGUgYXMgYXJndW1lbnQgZm9yIG9wZXJhdG9yLCBjYXN0IGl0IHRvIGBhbnlgIGZpcnN0LlxuICogUmVtZW1iZXIgb2YgY291cnNlIHRoYXQsIGJlY2F1c2Ugb2YgY2FzdGluZywgeW91IGhhdmUgdG8geW91cnNlbGYgZW5zdXJlIHRoYXQgcGFzc2VkXG4gKiBhcmd1bWVudCByZWFsbHkgaW1wbGVtZW50cyBzYWlkIGludGVyZmFjZS5cbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIG1lcmdlIHdpdGggYXJyYXlzPC9jYXB0aW9uPlxuICogUnguT2JzZXJ2YWJsZS5tZXJnZShbMSwgMl0sIFs0XSwgWzUsIDZdKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd0YSBkYW0hJylcbiAqICk7XG4gKlxuICogLy8gTG9nc1xuICogLy8gMVxuICogLy8gMlxuICogLy8gM1xuICogLy8gNFxuICogLy8gNVxuICogLy8gNlxuICogLy8gXCJ0YSBkYW0hXCJcbiAqXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIG1lcmdlIHdpdGggYXJyYXktbGlrZTwvY2FwdGlvbj5cbiAqIFJ4Lk9ic2VydmFibGUubWVyZ2UoezA6IDEsIDE6IDIsIGxlbmd0aDogMn0sIHswOiAzLCBsZW5ndGg6IDF9KVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCduaWNlLCBodWg/JylcbiAqICk7XG4gKlxuICogLy8gTG9nc1xuICogLy8gMVxuICogLy8gMlxuICogLy8gM1xuICogLy8gXCJuaWNlLCBodWg/XCJcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2UgbWVyZ2Ugd2l0aCBhbiBJdGVyYWJsZSAoTWFwKTwvY2FwdGlvbj5cbiAqIGNvbnN0IGZpcnN0TWFwID0gbmV3IE1hcChbWzEsICdhJ10sIFsyLCAnYiddXSk7XG4gKiBjb25zdCBzZWNvbmRNYXAgPSBuZXcgTWFwKFtbMywgJ2MnXSwgWzQsICdkJ11dKTtcbiAqXG4gKiBSeC5PYnNlcnZhYmxlLm1lcmdlKFxuICogICBmaXJzdE1hcCwgICAgICAgICAgLy8gcGFzcyBJdGVyYWJsZVxuICogICBzZWNvbmRNYXAudmFsdWVzKCkgLy8gcGFzcyBpdGVyYXRvciwgd2hpY2ggaXMgaXRzZWxmIGFuIEl0ZXJhYmxlXG4gKiApLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCd5dXAhJylcbiAqICk7XG4gKlxuICogLy8gTG9nc1xuICogLy8gWzEsIFwiYVwiXVxuICogLy8gWzIsIFwiYlwiXVxuICogLy8gXCJjXCJcbiAqIC8vIFwiZFwiXG4gKiAvLyBcInl1cCFcIlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSBmcm9tIHdpdGggZ2VuZXJhdG9yIChyZXR1cm5pbmcgaW5maW5pdGUgaXRlcmF0b3IpPC9jYXB0aW9uPlxuICogLy8gaW5maW5pdGUgc3RyZWFtIG9mIGluY3JlbWVudGluZyBudW1iZXJzXG4gKiBjb25zdCBpbmZpbml0ZSA9IGZ1bmN0aW9uKiAoKSB7XG4gKiAgIGxldCBpID0gMDtcbiAqXG4gKiAgIHdoaWxlICh0cnVlKSB7XG4gKiAgICAgeWllbGQgaSsrO1xuICogICB9XG4gKiB9O1xuICpcbiAqIFJ4Lk9ic2VydmFibGUuZnJvbShpbmZpbml0ZSgpKVxuICogLnRha2UoMykgLy8gb25seSB0YWtlIDMsIGNhdXNlIHRoaXMgaXMgaW5maW5pdGVcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygndGEgZGFtIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3NcbiAqIC8vIDBcbiAqIC8vIDFcbiAqIC8vIDJcbiAqIC8vIFwidGEgZGFtIVwiXG4gKlxuICogQGludGVyZmFjZVxuICogQG5hbWUgT2JzZXJ2YWJsZUlucHV0XG4gKiBAbm9pbXBvcnQgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgT2JzZXJ2YWJsZUlucHV0RG9jPFQ+IHtcblxufVxuXG4vKipcbiAqXG4gKiBUaGlzIGludGVyZmFjZSBkZXNjcmliZXMgd2hhdCBzaG91bGQgYmUgcmV0dXJuZWQgYnkgZnVuY3Rpb24gcGFzc2VkIHRvIE9ic2VydmFibGVcbiAqIGNvbnN0cnVjdG9yIG9yIHN0YXRpYyB7QGxpbmsgY3JlYXRlfSBmdW5jdGlvbi4gVmFsdWUgb2YgdGhhdCBpbnRlcmZhY2Ugd2lsbCBiZSB1c2VkXG4gKiB0byBjYW5jZWwgc3Vic2NyaXB0aW9uIGZvciBnaXZlbiBPYnNlcnZhYmxlLlxuICpcbiAqIGBUZWFyZG93bkxvZ2ljYCBjYW4gYmU6XG4gKlxuICogIyMgRnVuY3Rpb25cbiAqXG4gKiBGdW5jdGlvbiB0aGF0IHRha2VzIG5vIHBhcmFtZXRlcnMuIFdoZW4gY29uc3VtZXIgb2YgY3JlYXRlZCBPYnNlcnZhYmxlIGNhbGxzIGB1bnN1YnNjcmliZWAsXG4gKiB0aGF0IGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkXG4gKlxuICogIyMgQW5vbnltb3VzU3Vic2NyaXB0aW9uXG4gKlxuICogYEFub255bW91c1N1YnNjcmlwdGlvbmAgaXMgc2ltcGx5IGFuIG9iamVjdCB3aXRoIGB1bnN1YnNjcmliZWAgbWV0aG9kIG9uIGl0LiBUaGF0IG1ldGhvZFxuICogd2lsbCB3b3JrIHRoZSBzYW1lIGFzIGZ1bmN0aW9uXG4gKlxuICogIyMgdm9pZFxuICpcbiAqIElmIGNyZWF0ZWQgT2JzZXJ2YWJsZSBkb2VzIG5vdCBoYXZlIGFueSByZXNvdXJjZXMgdG8gY2xlYW4gdXAsIGZ1bmN0aW9uIGRvZXMgbm90IGhhdmUgdG9cbiAqIHJldHVybiBhbnl0aGluZy5cbiAqXG4gKiBAaW50ZXJmYWNlXG4gKiBAbmFtZSBUZWFyZG93bkxvZ2ljXG4gKiBAbm9pbXBvcnQgdHJ1ZVxuICovXG5leHBvcnQgY2xhc3MgVGVhcmRvd25Mb2dpY0RvYyB7XG5cbn1cbiJdfQ==