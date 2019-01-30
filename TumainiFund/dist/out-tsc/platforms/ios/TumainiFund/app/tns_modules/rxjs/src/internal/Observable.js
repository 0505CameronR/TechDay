"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var canReportError_1 = require("./util/canReportError");
var toSubscriber_1 = require("./util/toSubscriber");
var observable_1 = require("../internal/symbol/observable");
var pipe_1 = require("./util/pipe");
var config_1 = require("./config");
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
var Observable = /** @class */ (function () {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    function Observable(subscribe) {
        /** Internal implementation detail, do not use directly. */
        this._isScalar = false;
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    /**
     * Creates a new Observable, with this Observable as the source, and the passed
     * operator defined as the new observable's operator.
     * @method lift
     * @param {Operator} operator the operator defining the operation to take on the observable
     * @return {Observable} a new observable with the Operator applied
     */
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    /**
     * Invokes an execution of an Observable and registers Observer handlers for notifications it will emit.
     *
     * <span class="informal">Use it when you have all these Observables, but still nothing is happening.</span>
     *
     * `subscribe` is not a regular operator, but a method that calls Observable's internal `subscribe` function. It
     * might be for example a function that you passed to Observable's constructor, but most of the time it is
     * a library implementation, which defines what will be emitted by an Observable, and when it be will emitted. This means
     * that calling `subscribe` is actually the moment when Observable starts its work, not when it is created, as it is often
     * the thought.
     *
     * Apart from starting the execution of an Observable, this method allows you to listen for values
     * that an Observable emits, as well as for when it completes or errors. You can achieve this in two
     * of the following ways.
     *
     * The first way is creating an object that implements {@link Observer} interface. It should have methods
     * defined by that interface, but note that it should be just a regular JavaScript object, which you can create
     * yourself in any way you want (ES6 class, classic function constructor, object literal etc.). In particular do
     * not attempt to use any RxJS implementation details to create Observers - you don't need them. Remember also
     * that your object does not have to implement all methods. If you find yourself creating a method that doesn't
     * do anything, you can simply omit it. Note however, if the `error` method is not provided, all errors will
     * be left uncaught.
     *
     * The second way is to give up on Observer object altogether and simply provide callback functions in place of its methods.
     * This means you can provide three functions as arguments to `subscribe`, where the first function is equivalent
     * of a `next` method, the second of an `error` method and the third of a `complete` method. Just as in case of Observer,
     * if you do not need to listen for something, you can omit a function, preferably by passing `undefined` or `null`,
     * since `subscribe` recognizes these functions by where they were placed in function call. When it comes
     * to `error` function, just as before, if not provided, errors emitted by an Observable will be thrown.
     *
     * Whichever style of calling `subscribe` you use, in both cases it returns a Subscription object.
     * This object allows you to call `unsubscribe` on it, which in turn will stop the work that an Observable does and will clean
     * up all resources that an Observable used. Note that cancelling a subscription will not call `complete` callback
     * provided to `subscribe` function, which is reserved for a regular completion signal that comes from an Observable.
     *
     * Remember that callbacks provided to `subscribe` are not guaranteed to be called asynchronously.
     * It is an Observable itself that decides when these functions will be called. For example {@link of}
     * by default emits all its values synchronously. Always check documentation for how given Observable
     * will behave when subscribed and if its default behavior can be modified with a `scheduler`.
     *
     * ## Example
     * ### Subscribe with an Observer
     * ```javascript
     * const sumObserver = {
     *   sum: 0,
     *   next(value) {
     *     console.log('Adding: ' + value);
     *     this.sum = this.sum + value;
     *   },
     *   error() { // We actually could just remove this method,
     *   },        // since we do not really care about errors right now.
     *   complete() {
     *     console.log('Sum equals: ' + this.sum);
     *   }
     * };
     *
     * Rx.Observable.of(1, 2, 3) // Synchronously emits 1, 2, 3 and then completes.
     * .subscribe(sumObserver);
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     * ```
     *
     * ### Subscribe with functions
     * ```javascript
     * let sum = 0;
     *
     * Rx.Observable.of(1, 2, 3)
     * .subscribe(
     *   function(value) {
     *     console.log('Adding: ' + value);
     *     sum = sum + value;
     *   },
     *   undefined,
     *   function() {
     *     console.log('Sum equals: ' + sum);
     *   }
     * );
     *
     * // Logs:
     * // "Adding: 1"
     * // "Adding: 2"
     * // "Adding: 3"
     * // "Sum equals: 6"
     * ```
     *
     * ### Cancel a subscription
     * ```javascript
     * const subscription = Rx.Observable.interval(1000).subscribe(
     *   num => console.log(num),
     *   undefined,
     *   () => console.log('completed!') // Will not be called, even
     * );                                // when cancelling subscription
     *
     *
     * setTimeout(() => {
     *   subscription.unsubscribe();
     *   console.log('unsubscribed!');
     * }, 2500);
     *
     * // Logs:
     * // 0 after 1s
     * // 1 after 2s
     * // "unsubscribed!" after 2.5s
     * ```
     *
     * @param {Observer|Function} observerOrNext (optional) Either an observer with methods to be called,
     *  or the first of three possible handlers, which is the handler for each value emitted from the subscribed
     *  Observable.
     * @param {Function} error (optional) A handler for a terminal event resulting from an error. If no error handler is provided,
     *  the error will be thrown as unhandled.
     * @param {Function} complete (optional) A handler for a terminal event resulting from successful completion.
     * @return {ISubscription} a subscription reference to the registered handlers
     * @method subscribe
     */
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var operator = this.operator;
        var sink = toSubscriber_1.toSubscriber(observerOrNext, error, complete);
        if (operator) {
            operator.call(sink, this.source);
        }
        else {
            sink.add(this.source || (config_1.config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    };
    /** @deprecated This is an internal implementation detail, do not use. */
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config_1.config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError_1.canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    };
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [promiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            var subscription;
            subscription = _this.subscribe(function (value) {
                try {
                    next(value);
                }
                catch (err) {
                    reject(err);
                    if (subscription) {
                        subscription.unsubscribe();
                    }
                }
            }, reject, resolve);
        });
    };
    /** @internal This is an internal implementation detail, do not use. */
    Observable.prototype._subscribe = function (subscriber) {
        var source = this.source;
        return source && source.subscribe(subscriber);
    };
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    Observable.prototype[observable_1.observable] = function () {
        return this;
    };
    /* tslint:enable:max-line-length */
    /**
     * Used to stitch together functional operators into a chain.
     * @method pipe
     * @return {Observable} the Observable result of all of the operators having
     * been called in the order they were passed in.
     *
     * ### Example
     * ```javascript
     * import { map, filter, scan } from 'rxjs/operators';
     *
     * Rx.Observable.interval(1000)
     *   .pipe(
     *     filter(x => x % 2 === 0),
     *     map(x => x + x),
     *     scan((acc, x) => acc + x)
     *   )
     *   .subscribe(x => console.log(x))
     * ```
     */
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        if (operations.length === 0) {
            return this;
        }
        return pipe_1.pipeFromArray(operations)(this);
    };
    /* tslint:enable:max-line-length */
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return value = x; }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    // HACK: Since TypeScript inherits static properties too, we have to
    // fight against TypeScript here so Subject can have a different static create signature
    /**
     * Creates a new cold Observable by calling the Observable constructor
     * @static true
     * @owner Observable
     * @method create
     * @param {Function} subscribe? the subscriber function to be passed to the Observable constructor
     * @return {Observable} a new cold observable
     * @nocollapse
     */
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());
exports.Observable = Observable;
/**
 * Decides between a passed promise constructor from consuming code,
 * A default configured promise constructor, and the native promise
 * constructor and returns it. If nothing can be found, it will throw
 * an error.
 * @param promiseCtor The optional promise constructor to passed by consuming code
 */
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config_1.config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzZXJ2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL09ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSx3REFBdUQ7QUFDdkQsb0RBQW1EO0FBR25ELDREQUFnRjtBQUNoRixvQ0FBNEM7QUFDNUMsbUNBQWtDO0FBRWxDOzs7OztHQUtHO0FBQ0g7SUFXRTs7Ozs7O09BTUc7SUFDSCxvQkFBWSxTQUE2RTtRQWhCekYsMkRBQTJEO1FBQ3BELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFnQmhDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBaUJEOzs7Ozs7T0FNRztJQUNILHlCQUFJLEdBQUosVUFBUSxRQUF3QjtRQUM5QixJQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBSyxDQUFDO1FBQ3ZDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQy9CLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFJRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09BcUhHO0lBQ0gsOEJBQVMsR0FBVCxVQUFVLGNBQTBELEVBQzFELEtBQTRCLEVBQzVCLFFBQXFCO1FBRXJCLElBQUEsd0JBQVEsQ0FBVTtRQUMxQixJQUFNLElBQUksR0FBRywyQkFBWSxDQUFDLGNBQWMsRUFBRSxLQUFLLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFFM0QsSUFBSSxRQUFRLEVBQUU7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QUMsQ0FBQztJQUN6QyxDQUFDO0lBTUQsbUNBQW1DO0lBRW5DLDhCQUFTLEdBQVQsVUFBVSxXQUFvQztRQUE5QyxpQkFPQztRQU5DLFdBQVcsR0FBRyxjQUFjLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFMUMsT0FBTyxJQUFJLFdBQVcsQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3JDLElBQUksS0FBVSxDQUFDO1lBQ2YsS0FBSSxDQUFDLFNBQVMsQ0FBQyxVQUFDLENBQUksSUFBSyxPQUFBLEtBQUssR0FBRyxDQUFDLEVBQVQsQ0FBUyxFQUFFLFVBQUMsR0FBUSxJQUFLLE9BQUEsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFYLENBQVcsRUFBRSxjQUFNLE9BQUEsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFkLENBQWMsQ0FBQyxDQUFDO1FBQ3ZGLENBQUMsQ0FBZSxDQUFDO0lBQ25CLENBQUM7SUFoVEQsb0VBQW9FO0lBQ3BFLHdGQUF3RjtJQUN4Rjs7Ozs7Ozs7T0FRRztJQUNJLGlCQUFNLEdBQWEsVUFBSSxTQUF3RDtRQUNwRixPQUFPLElBQUksVUFBVSxDQUFJLFNBQVMsQ0FBQyxDQUFDO0lBQ3RDLENBQUMsQ0FBQTtJQW9TSCxpQkFBQztDQUFBLEFBelVELElBeVVDO0FBelVZLGdDQUFVO0FBMlV2Qjs7Ozs7O0dBTUc7QUFDSCxTQUFTLGNBQWMsQ0FBQyxXQUErQztJQUNyRSxJQUFJLENBQUMsV0FBVyxFQUFFO1FBQ2hCLFdBQVcsR0FBRyxlQUFNLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQztLQUN6QztJQUVELElBQUksQ0FBQyxXQUFXLEVBQUU7UUFDaEIsTUFBTSxJQUFJLEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0tBQzFDO0lBRUQsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9wZXJhdG9yIH0gZnJvbSAnLi9PcGVyYXRvcic7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFRlYXJkb3duTG9naWMsIE9wZXJhdG9yRnVuY3Rpb24sIFBhcnRpYWxPYnNlcnZlciwgU3Vic2NyaWJhYmxlIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBjYW5SZXBvcnRFcnJvciB9IGZyb20gJy4vdXRpbC9jYW5SZXBvcnRFcnJvcic7XG5pbXBvcnQgeyB0b1N1YnNjcmliZXIgfSBmcm9tICcuL3V0aWwvdG9TdWJzY3JpYmVyJztcbmltcG9ydCB7IGlpZiB9IGZyb20gJy4vb2JzZXJ2YWJsZS9paWYnO1xuaW1wb3J0IHsgdGhyb3dFcnJvciB9IGZyb20gJy4vb2JzZXJ2YWJsZS90aHJvd0Vycm9yJztcbmltcG9ydCB7IG9ic2VydmFibGUgYXMgU3ltYm9sX29ic2VydmFibGUgfSBmcm9tICcuLi9pbnRlcm5hbC9zeW1ib2wvb2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBwaXBlRnJvbUFycmF5IH0gZnJvbSAnLi91dGlsL3BpcGUnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuXG4vKipcbiAqIEEgcmVwcmVzZW50YXRpb24gb2YgYW55IHNldCBvZiB2YWx1ZXMgb3ZlciBhbnkgYW1vdW50IG9mIHRpbWUuIFRoaXMgaXMgdGhlIG1vc3QgYmFzaWMgYnVpbGRpbmcgYmxvY2tcbiAqIG9mIFJ4SlMuXG4gKlxuICogQGNsYXNzIE9ic2VydmFibGU8VD5cbiAqL1xuZXhwb3J0IGNsYXNzIE9ic2VydmFibGU8VD4gaW1wbGVtZW50cyBTdWJzY3JpYmFibGU8VD4ge1xuXG4gIC8qKiBJbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UgZGlyZWN0bHkuICovXG4gIHB1YmxpYyBfaXNTY2FsYXI6IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIHNvdXJjZTogT2JzZXJ2YWJsZTxhbnk+O1xuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgb3BlcmF0b3I6IE9wZXJhdG9yPGFueSwgVD47XG5cbiAgLyoqXG4gICAqIEBjb25zdHJ1Y3RvclxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmUgdGhlIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdoZW4gdGhlIE9ic2VydmFibGUgaXNcbiAgICogaW5pdGlhbGx5IHN1YnNjcmliZWQgdG8uIFRoaXMgZnVuY3Rpb24gaXMgZ2l2ZW4gYSBTdWJzY3JpYmVyLCB0byB3aGljaCBuZXcgdmFsdWVzXG4gICAqIGNhbiBiZSBgbmV4dGBlZCwgb3IgYW4gYGVycm9yYCBtZXRob2QgY2FuIGJlIGNhbGxlZCB0byByYWlzZSBhbiBlcnJvciwgb3JcbiAgICogYGNvbXBsZXRlYCBjYW4gYmUgY2FsbGVkIHRvIG5vdGlmeSBvZiBhIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHN1YnNjcmliZT86ICh0aGlzOiBPYnNlcnZhYmxlPFQ+LCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+KSA9PiBUZWFyZG93bkxvZ2ljKSB7XG4gICAgaWYgKHN1YnNjcmliZSkge1xuICAgICAgdGhpcy5fc3Vic2NyaWJlID0gc3Vic2NyaWJlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhBQ0s6IFNpbmNlIFR5cGVTY3JpcHQgaW5oZXJpdHMgc3RhdGljIHByb3BlcnRpZXMgdG9vLCB3ZSBoYXZlIHRvXG4gIC8vIGZpZ2h0IGFnYWluc3QgVHlwZVNjcmlwdCBoZXJlIHNvIFN1YmplY3QgY2FuIGhhdmUgYSBkaWZmZXJlbnQgc3RhdGljIGNyZWF0ZSBzaWduYXR1cmVcbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBuZXcgY29sZCBPYnNlcnZhYmxlIGJ5IGNhbGxpbmcgdGhlIE9ic2VydmFibGUgY29uc3RydWN0b3JcbiAgICogQHN0YXRpYyB0cnVlXG4gICAqIEBvd25lciBPYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgY3JlYXRlXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHN1YnNjcmliZT8gdGhlIHN1YnNjcmliZXIgZnVuY3Rpb24gdG8gYmUgcGFzc2VkIHRvIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IGNvbGQgb2JzZXJ2YWJsZVxuICAgKiBAbm9jb2xsYXBzZVxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oc3Vic2NyaWJlPzogKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IFRlYXJkb3duTG9naWMpID0+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9ic2VydmFibGUsIHdpdGggdGhpcyBPYnNlcnZhYmxlIGFzIHRoZSBzb3VyY2UsIGFuZCB0aGUgcGFzc2VkXG4gICAqIG9wZXJhdG9yIGRlZmluZWQgYXMgdGhlIG5ldyBvYnNlcnZhYmxlJ3Mgb3BlcmF0b3IuXG4gICAqIEBtZXRob2QgbGlmdFxuICAgKiBAcGFyYW0ge09wZXJhdG9yfSBvcGVyYXRvciB0aGUgb3BlcmF0b3IgZGVmaW5pbmcgdGhlIG9wZXJhdGlvbiB0byB0YWtlIG9uIHRoZSBvYnNlcnZhYmxlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IG9ic2VydmFibGUgd2l0aCB0aGUgT3BlcmF0b3IgYXBwbGllZFxuICAgKi9cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8Uj4oKTtcbiAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgb2JzZXJ2YWJsZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgc3Vic2NyaWJlKG9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+KTogU3Vic2NyaXB0aW9uO1xuICBzdWJzY3JpYmUobmV4dD86ICh2YWx1ZTogVCkgPT4gdm9pZCwgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xuICAvKipcbiAgICogSW52b2tlcyBhbiBleGVjdXRpb24gb2YgYW4gT2JzZXJ2YWJsZSBhbmQgcmVnaXN0ZXJzIE9ic2VydmVyIGhhbmRsZXJzIGZvciBub3RpZmljYXRpb25zIGl0IHdpbGwgZW1pdC5cbiAgICpcbiAgICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPlVzZSBpdCB3aGVuIHlvdSBoYXZlIGFsbCB0aGVzZSBPYnNlcnZhYmxlcywgYnV0IHN0aWxsIG5vdGhpbmcgaXMgaGFwcGVuaW5nLjwvc3Bhbj5cbiAgICpcbiAgICogYHN1YnNjcmliZWAgaXMgbm90IGEgcmVndWxhciBvcGVyYXRvciwgYnV0IGEgbWV0aG9kIHRoYXQgY2FsbHMgT2JzZXJ2YWJsZSdzIGludGVybmFsIGBzdWJzY3JpYmVgIGZ1bmN0aW9uLiBJdFxuICAgKiBtaWdodCBiZSBmb3IgZXhhbXBsZSBhIGZ1bmN0aW9uIHRoYXQgeW91IHBhc3NlZCB0byBPYnNlcnZhYmxlJ3MgY29uc3RydWN0b3IsIGJ1dCBtb3N0IG9mIHRoZSB0aW1lIGl0IGlzXG4gICAqIGEgbGlicmFyeSBpbXBsZW1lbnRhdGlvbiwgd2hpY2ggZGVmaW5lcyB3aGF0IHdpbGwgYmUgZW1pdHRlZCBieSBhbiBPYnNlcnZhYmxlLCBhbmQgd2hlbiBpdCBiZSB3aWxsIGVtaXR0ZWQuIFRoaXMgbWVhbnNcbiAgICogdGhhdCBjYWxsaW5nIGBzdWJzY3JpYmVgIGlzIGFjdHVhbGx5IHRoZSBtb21lbnQgd2hlbiBPYnNlcnZhYmxlIHN0YXJ0cyBpdHMgd29yaywgbm90IHdoZW4gaXQgaXMgY3JlYXRlZCwgYXMgaXQgaXMgb2Z0ZW5cbiAgICogdGhlIHRob3VnaHQuXG4gICAqXG4gICAqIEFwYXJ0IGZyb20gc3RhcnRpbmcgdGhlIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlLCB0aGlzIG1ldGhvZCBhbGxvd3MgeW91IHRvIGxpc3RlbiBmb3IgdmFsdWVzXG4gICAqIHRoYXQgYW4gT2JzZXJ2YWJsZSBlbWl0cywgYXMgd2VsbCBhcyBmb3Igd2hlbiBpdCBjb21wbGV0ZXMgb3IgZXJyb3JzLiBZb3UgY2FuIGFjaGlldmUgdGhpcyBpbiB0d29cbiAgICogb2YgdGhlIGZvbGxvd2luZyB3YXlzLlxuICAgKlxuICAgKiBUaGUgZmlyc3Qgd2F5IGlzIGNyZWF0aW5nIGFuIG9iamVjdCB0aGF0IGltcGxlbWVudHMge0BsaW5rIE9ic2VydmVyfSBpbnRlcmZhY2UuIEl0IHNob3VsZCBoYXZlIG1ldGhvZHNcbiAgICogZGVmaW5lZCBieSB0aGF0IGludGVyZmFjZSwgYnV0IG5vdGUgdGhhdCBpdCBzaG91bGQgYmUganVzdCBhIHJlZ3VsYXIgSmF2YVNjcmlwdCBvYmplY3QsIHdoaWNoIHlvdSBjYW4gY3JlYXRlXG4gICAqIHlvdXJzZWxmIGluIGFueSB3YXkgeW91IHdhbnQgKEVTNiBjbGFzcywgY2xhc3NpYyBmdW5jdGlvbiBjb25zdHJ1Y3Rvciwgb2JqZWN0IGxpdGVyYWwgZXRjLikuIEluIHBhcnRpY3VsYXIgZG9cbiAgICogbm90IGF0dGVtcHQgdG8gdXNlIGFueSBSeEpTIGltcGxlbWVudGF0aW9uIGRldGFpbHMgdG8gY3JlYXRlIE9ic2VydmVycyAtIHlvdSBkb24ndCBuZWVkIHRoZW0uIFJlbWVtYmVyIGFsc29cbiAgICogdGhhdCB5b3VyIG9iamVjdCBkb2VzIG5vdCBoYXZlIHRvIGltcGxlbWVudCBhbGwgbWV0aG9kcy4gSWYgeW91IGZpbmQgeW91cnNlbGYgY3JlYXRpbmcgYSBtZXRob2QgdGhhdCBkb2Vzbid0XG4gICAqIGRvIGFueXRoaW5nLCB5b3UgY2FuIHNpbXBseSBvbWl0IGl0LiBOb3RlIGhvd2V2ZXIsIGlmIHRoZSBgZXJyb3JgIG1ldGhvZCBpcyBub3QgcHJvdmlkZWQsIGFsbCBlcnJvcnMgd2lsbFxuICAgKiBiZSBsZWZ0IHVuY2F1Z2h0LlxuICAgKlxuICAgKiBUaGUgc2Vjb25kIHdheSBpcyB0byBnaXZlIHVwIG9uIE9ic2VydmVyIG9iamVjdCBhbHRvZ2V0aGVyIGFuZCBzaW1wbHkgcHJvdmlkZSBjYWxsYmFjayBmdW5jdGlvbnMgaW4gcGxhY2Ugb2YgaXRzIG1ldGhvZHMuXG4gICAqIFRoaXMgbWVhbnMgeW91IGNhbiBwcm92aWRlIHRocmVlIGZ1bmN0aW9ucyBhcyBhcmd1bWVudHMgdG8gYHN1YnNjcmliZWAsIHdoZXJlIHRoZSBmaXJzdCBmdW5jdGlvbiBpcyBlcXVpdmFsZW50XG4gICAqIG9mIGEgYG5leHRgIG1ldGhvZCwgdGhlIHNlY29uZCBvZiBhbiBgZXJyb3JgIG1ldGhvZCBhbmQgdGhlIHRoaXJkIG9mIGEgYGNvbXBsZXRlYCBtZXRob2QuIEp1c3QgYXMgaW4gY2FzZSBvZiBPYnNlcnZlcixcbiAgICogaWYgeW91IGRvIG5vdCBuZWVkIHRvIGxpc3RlbiBmb3Igc29tZXRoaW5nLCB5b3UgY2FuIG9taXQgYSBmdW5jdGlvbiwgcHJlZmVyYWJseSBieSBwYXNzaW5nIGB1bmRlZmluZWRgIG9yIGBudWxsYCxcbiAgICogc2luY2UgYHN1YnNjcmliZWAgcmVjb2duaXplcyB0aGVzZSBmdW5jdGlvbnMgYnkgd2hlcmUgdGhleSB3ZXJlIHBsYWNlZCBpbiBmdW5jdGlvbiBjYWxsLiBXaGVuIGl0IGNvbWVzXG4gICAqIHRvIGBlcnJvcmAgZnVuY3Rpb24sIGp1c3QgYXMgYmVmb3JlLCBpZiBub3QgcHJvdmlkZWQsIGVycm9ycyBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUgd2lsbCBiZSB0aHJvd24uXG4gICAqXG4gICAqIFdoaWNoZXZlciBzdHlsZSBvZiBjYWxsaW5nIGBzdWJzY3JpYmVgIHlvdSB1c2UsIGluIGJvdGggY2FzZXMgaXQgcmV0dXJucyBhIFN1YnNjcmlwdGlvbiBvYmplY3QuXG4gICAqIFRoaXMgb2JqZWN0IGFsbG93cyB5b3UgdG8gY2FsbCBgdW5zdWJzY3JpYmVgIG9uIGl0LCB3aGljaCBpbiB0dXJuIHdpbGwgc3RvcCB0aGUgd29yayB0aGF0IGFuIE9ic2VydmFibGUgZG9lcyBhbmQgd2lsbCBjbGVhblxuICAgKiB1cCBhbGwgcmVzb3VyY2VzIHRoYXQgYW4gT2JzZXJ2YWJsZSB1c2VkLiBOb3RlIHRoYXQgY2FuY2VsbGluZyBhIHN1YnNjcmlwdGlvbiB3aWxsIG5vdCBjYWxsIGBjb21wbGV0ZWAgY2FsbGJhY2tcbiAgICogcHJvdmlkZWQgdG8gYHN1YnNjcmliZWAgZnVuY3Rpb24sIHdoaWNoIGlzIHJlc2VydmVkIGZvciBhIHJlZ3VsYXIgY29tcGxldGlvbiBzaWduYWwgdGhhdCBjb21lcyBmcm9tIGFuIE9ic2VydmFibGUuXG4gICAqXG4gICAqIFJlbWVtYmVyIHRoYXQgY2FsbGJhY2tzIHByb3ZpZGVkIHRvIGBzdWJzY3JpYmVgIGFyZSBub3QgZ3VhcmFudGVlZCB0byBiZSBjYWxsZWQgYXN5bmNocm9ub3VzbHkuXG4gICAqIEl0IGlzIGFuIE9ic2VydmFibGUgaXRzZWxmIHRoYXQgZGVjaWRlcyB3aGVuIHRoZXNlIGZ1bmN0aW9ucyB3aWxsIGJlIGNhbGxlZC4gRm9yIGV4YW1wbGUge0BsaW5rIG9mfVxuICAgKiBieSBkZWZhdWx0IGVtaXRzIGFsbCBpdHMgdmFsdWVzIHN5bmNocm9ub3VzbHkuIEFsd2F5cyBjaGVjayBkb2N1bWVudGF0aW9uIGZvciBob3cgZ2l2ZW4gT2JzZXJ2YWJsZVxuICAgKiB3aWxsIGJlaGF2ZSB3aGVuIHN1YnNjcmliZWQgYW5kIGlmIGl0cyBkZWZhdWx0IGJlaGF2aW9yIGNhbiBiZSBtb2RpZmllZCB3aXRoIGEgYHNjaGVkdWxlcmAuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGFuIE9ic2VydmVyXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3VtT2JzZXJ2ZXIgPSB7XG4gICAqICAgc3VtOiAwLFxuICAgKiAgIG5leHQodmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICB0aGlzLnN1bSA9IHRoaXMuc3VtICsgdmFsdWU7XG4gICAqICAgfSxcbiAgICogICBlcnJvcigpIHsgLy8gV2UgYWN0dWFsbHkgY291bGQganVzdCByZW1vdmUgdGhpcyBtZXRob2QsXG4gICAqICAgfSwgICAgICAgIC8vIHNpbmNlIHdlIGRvIG5vdCByZWFsbHkgY2FyZSBhYm91dCBlcnJvcnMgcmlnaHQgbm93LlxuICAgKiAgIGNvbXBsZXRlKCkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1N1bSBlcXVhbHM6ICcgKyB0aGlzLnN1bSk7XG4gICAqICAgfVxuICAgKiB9O1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpIC8vIFN5bmNocm9ub3VzbHkgZW1pdHMgMSwgMiwgMyBhbmQgdGhlbiBjb21wbGV0ZXMuXG4gICAqIC5zdWJzY3JpYmUoc3VtT2JzZXJ2ZXIpO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyBcIkFkZGluZzogMVwiXG4gICAqIC8vIFwiQWRkaW5nOiAyXCJcbiAgICogLy8gXCJBZGRpbmc6IDNcIlxuICAgKiAvLyBcIlN1bSBlcXVhbHM6IDZcIlxuICAgKiBgYGBcbiAgICpcbiAgICogIyMjIFN1YnNjcmliZSB3aXRoIGZ1bmN0aW9uc1xuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGxldCBzdW0gPSAwO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLm9mKDEsIDIsIDMpXG4gICAqIC5zdWJzY3JpYmUoXG4gICAqICAgZnVuY3Rpb24odmFsdWUpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdBZGRpbmc6ICcgKyB2YWx1ZSk7XG4gICAqICAgICBzdW0gPSBzdW0gKyB2YWx1ZTtcbiAgICogICB9LFxuICAgKiAgIHVuZGVmaW5lZCxcbiAgICogICBmdW5jdGlvbigpIHtcbiAgICogICAgIGNvbnNvbGUubG9nKCdTdW0gZXF1YWxzOiAnICsgc3VtKTtcbiAgICogICB9XG4gICAqICk7XG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIFwiQWRkaW5nOiAxXCJcbiAgICogLy8gXCJBZGRpbmc6IDJcIlxuICAgKiAvLyBcIkFkZGluZzogM1wiXG4gICAqIC8vIFwiU3VtIGVxdWFsczogNlwiXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgQ2FuY2VsIGEgc3Vic2NyaXB0aW9uXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogY29uc3Qgc3Vic2NyaXB0aW9uID0gUnguT2JzZXJ2YWJsZS5pbnRlcnZhbCgxMDAwKS5zdWJzY3JpYmUoXG4gICAqICAgbnVtID0+IGNvbnNvbGUubG9nKG51bSksXG4gICAqICAgdW5kZWZpbmVkLFxuICAgKiAgICgpID0+IGNvbnNvbGUubG9nKCdjb21wbGV0ZWQhJykgLy8gV2lsbCBub3QgYmUgY2FsbGVkLCBldmVuXG4gICAqICk7ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyB3aGVuIGNhbmNlbGxpbmcgc3Vic2NyaXB0aW9uXG4gICAqXG4gICAqXG4gICAqIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgKiAgIHN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgKiAgIGNvbnNvbGUubG9nKCd1bnN1YnNjcmliZWQhJyk7XG4gICAqIH0sIDI1MDApO1xuICAgKlxuICAgKiAvLyBMb2dzOlxuICAgKiAvLyAwIGFmdGVyIDFzXG4gICAqIC8vIDEgYWZ0ZXIgMnNcbiAgICogLy8gXCJ1bnN1YnNjcmliZWQhXCIgYWZ0ZXIgMi41c1xuICAgKiBgYGBcbiAgICpcbiAgICogQHBhcmFtIHtPYnNlcnZlcnxGdW5jdGlvbn0gb2JzZXJ2ZXJPck5leHQgKG9wdGlvbmFsKSBFaXRoZXIgYW4gb2JzZXJ2ZXIgd2l0aCBtZXRob2RzIHRvIGJlIGNhbGxlZCxcbiAgICogIG9yIHRoZSBmaXJzdCBvZiB0aHJlZSBwb3NzaWJsZSBoYW5kbGVycywgd2hpY2ggaXMgdGhlIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBmcm9tIHRoZSBzdWJzY3JpYmVkXG4gICAqICBPYnNlcnZhYmxlLlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBlcnJvciAob3B0aW9uYWwpIEEgaGFuZGxlciBmb3IgYSB0ZXJtaW5hbCBldmVudCByZXN1bHRpbmcgZnJvbSBhbiBlcnJvci4gSWYgbm8gZXJyb3IgaGFuZGxlciBpcyBwcm92aWRlZCxcbiAgICogIHRoZSBlcnJvciB3aWxsIGJlIHRocm93biBhcyB1bmhhbmRsZWQuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBsZXRlIChvcHRpb25hbCkgQSBoYW5kbGVyIGZvciBhIHRlcm1pbmFsIGV2ZW50IHJlc3VsdGluZyBmcm9tIHN1Y2Nlc3NmdWwgY29tcGxldGlvbi5cbiAgICogQHJldHVybiB7SVN1YnNjcmlwdGlvbn0gYSBzdWJzY3JpcHRpb24gcmVmZXJlbmNlIHRvIHRoZSByZWdpc3RlcmVkIGhhbmRsZXJzXG4gICAqIEBtZXRob2Qgc3Vic2NyaWJlXG4gICAqL1xuICBzdWJzY3JpYmUob2JzZXJ2ZXJPck5leHQ/OiBQYXJ0aWFsT2JzZXJ2ZXI8VD4gfCAoKHZhbHVlOiBUKSA9PiB2b2lkKSxcbiAgICAgICAgICAgIGVycm9yPzogKGVycm9yOiBhbnkpID0+IHZvaWQsXG4gICAgICAgICAgICBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpcHRpb24ge1xuXG4gICAgY29uc3QgeyBvcGVyYXRvciB9ID0gdGhpcztcbiAgICBjb25zdCBzaW5rID0gdG9TdWJzY3JpYmVyKG9ic2VydmVyT3JOZXh0LCBlcnJvciwgY29tcGxldGUpO1xuXG4gICAgaWYgKG9wZXJhdG9yKSB7XG4gICAgICBvcGVyYXRvci5jYWxsKHNpbmssIHRoaXMuc291cmNlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2luay5hZGQoXG4gICAgICAgIHRoaXMuc291cmNlIHx8IChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZyAmJiAhc2luay5zeW5jRXJyb3JUaHJvd2FibGUpID9cbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKHNpbmspIDpcbiAgICAgICAgdGhpcy5fdHJ5U3Vic2NyaWJlKHNpbmspXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgaWYgKHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93bikge1xuICAgICAgICAgIHRocm93IHNpbmsuc3luY0Vycm9yVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2luaztcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3RyeVN1YnNjcmliZShzaW5rOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoc2luayk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgc2luay5zeW5jRXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICBzaW5rLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgfVxuICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHNpbmspKSB7XG4gICAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGZvckVhY2hcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dCBhIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcGFyYW0ge1Byb21pc2VDb25zdHJ1Y3Rvcn0gW3Byb21pc2VDdG9yXSBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIFByb21pc2VcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgZWl0aGVyIHJlc29sdmVzIG9uIG9ic2VydmFibGUgY29tcGxldGlvbiBvclxuICAgKiAgcmVqZWN0cyB3aXRoIHRoZSBoYW5kbGVkIGVycm9yXG4gICAqL1xuICBmb3JFYWNoKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcHJvbWlzZUN0b3I/OiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG5cbiAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE11c3QgYmUgZGVjbGFyZWQgaW4gYSBzZXBhcmF0ZSBzdGF0ZW1lbnQgdG8gYXZvaWQgYSBSZWZlcm5jZUVycm9yIHdoZW5cbiAgICAgIC8vIGFjY2Vzc2luZyBzdWJzY3JpcHRpb24gYmVsb3cgaW4gdGhlIGNsb3N1cmUgZHVlIHRvIFRlbXBvcmFsIERlYWQgWm9uZS5cbiAgICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSkgYXMgUHJvbWlzZTx2b2lkPjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgcmV0dXJuIHNvdXJjZSAmJiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgLy8gYGlmYCBhbmQgYHRocm93YCBhcmUgc3BlY2lhbCBzbm93IGZsYWtlcywgdGhlIGNvbXBpbGVyIHNlZXMgdGhlbSBhcyByZXNlcnZlZCB3b3Jkcy4gRGVwcmVjYXRlZCBpblxuICAvLyBmYXZvciBvZiBpaWYgYW5kIHRocm93RXJyb3IgZnVuY3Rpb25zLlxuICAvKipcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgSW4gZmF2b3Igb2YgaWlmIGNyZWF0aW9uIGZ1bmN0aW9uOiBpbXBvcnQgeyBpaWYgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyBpZjogdHlwZW9mIGlpZjtcbiAgLyoqXG4gICAqIEBub2NvbGxhcHNlXG4gICAqIEBkZXByZWNhdGVkIEluIGZhdm9yIG9mIHRocm93RXJyb3IgY3JlYXRpb24gZnVuY3Rpb246IGltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyB0aHJvdzogdHlwZW9mIHRocm93RXJyb3I7XG5cbiAgLyoqXG4gICAqIEFuIGludGVyb3AgcG9pbnQgZGVmaW5lZCBieSB0aGUgZXM3LW9ic2VydmFibGUgc3BlYyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1vYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgU3ltYm9sLm9ic2VydmFibGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhpcyBpbnN0YW5jZSBvZiB0aGUgb2JzZXJ2YWJsZVxuICAgKi9cbiAgW1N5bWJvbF9vYnNlcnZhYmxlXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICBwaXBlKCk6IE9ic2VydmFibGU8VD47XG4gIHBpcGU8QT4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+KTogT2JzZXJ2YWJsZTxBPjtcbiAgcGlwZTxBLCBCPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPik6IE9ic2VydmFibGU8Qj47XG4gIHBpcGU8QSwgQiwgQz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPik6IE9ic2VydmFibGU8Qz47XG4gIHBpcGU8QSwgQiwgQywgRD4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+KTogT2JzZXJ2YWJsZTxEPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPik6IE9ic2VydmFibGU8RT47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRj4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPik6IE9ic2VydmFibGU8Rj47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+KTogT2JzZXJ2YWJsZTxHPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4sIG9wODogT3BlcmF0b3JGdW5jdGlvbjxHLCBIPik6IE9ic2VydmFibGU8SD47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPik6IE9ic2VydmFibGU8ST47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPiwgLi4ub3BlcmF0aW9uczogT3BlcmF0b3JGdW5jdGlvbjxhbnksIGFueT5bXSk6IE9ic2VydmFibGU8e30+O1xuICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN0aXRjaCB0b2dldGhlciBmdW5jdGlvbmFsIG9wZXJhdG9ycyBpbnRvIGEgY2hhaW4uXG4gICAqIEBtZXRob2QgcGlwZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSB0aGUgT2JzZXJ2YWJsZSByZXN1bHQgb2YgYWxsIG9mIHRoZSBvcGVyYXRvcnMgaGF2aW5nXG4gICAqIGJlZW4gY2FsbGVkIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgcGFzc2VkIGluLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGltcG9ydCB7IG1hcCwgZmlsdGVyLCBzY2FuIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMDApXG4gICAqICAgLnBpcGUoXG4gICAqICAgICBmaWx0ZXIoeCA9PiB4ICUgMiA9PT0gMCksXG4gICAqICAgICBtYXAoeCA9PiB4ICsgeCksXG4gICAqICAgICBzY2FuKChhY2MsIHgpID0+IGFjYyArIHgpXG4gICAqICAgKVxuICAgKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSlcbiAgICogYGBgXG4gICAqL1xuICBwaXBlKC4uLm9wZXJhdGlvbnM6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBhbnk+W10pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMgYXMgYW55O1xuICAgIH1cblxuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KG9wZXJhdGlvbnMpKHRoaXMpO1xuICB9XG5cbiAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+KTogUHJvbWlzZTxUPjtcbiAgdG9Qcm9taXNlPFQ+KHRoaXM6IE9ic2VydmFibGU8VD4sIFByb21pc2VDdG9yOiB0eXBlb2YgUHJvbWlzZSk6IFByb21pc2U8VD47XG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+LCBQcm9taXNlQ3RvcjogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD47XG4gIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbiAgdG9Qcm9taXNlKHByb21pc2VDdG9yPzogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD4ge1xuICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IGFueTtcbiAgICAgIHRoaXMuc3Vic2NyaWJlKCh4OiBUKSA9PiB2YWx1ZSA9IHgsIChlcnI6IGFueSkgPT4gcmVqZWN0KGVyciksICgpID0+IHJlc29sdmUodmFsdWUpKTtcbiAgICB9KSBhcyBQcm9taXNlPFQ+O1xuICB9XG59XG5cbi8qKlxuICogRGVjaWRlcyBiZXR3ZWVuIGEgcGFzc2VkIHByb21pc2UgY29uc3RydWN0b3IgZnJvbSBjb25zdW1pbmcgY29kZSxcbiAqIEEgZGVmYXVsdCBjb25maWd1cmVkIHByb21pc2UgY29uc3RydWN0b3IsIGFuZCB0aGUgbmF0aXZlIHByb21pc2VcbiAqIGNvbnN0cnVjdG9yIGFuZCByZXR1cm5zIGl0LiBJZiBub3RoaW5nIGNhbiBiZSBmb3VuZCwgaXQgd2lsbCB0aHJvd1xuICogYW4gZXJyb3IuXG4gKiBAcGFyYW0gcHJvbWlzZUN0b3IgVGhlIG9wdGlvbmFsIHByb21pc2UgY29uc3RydWN0b3IgdG8gcGFzc2VkIGJ5IGNvbnN1bWluZyBjb2RlXG4gKi9cbmZ1bmN0aW9uIGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yOiBQcm9taXNlQ29uc3RydWN0b3JMaWtlIHwgdW5kZWZpbmVkKSB7XG4gIGlmICghcHJvbWlzZUN0b3IpIHtcbiAgICBwcm9taXNlQ3RvciA9IGNvbmZpZy5Qcm9taXNlIHx8IFByb21pc2U7XG4gIH1cblxuICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBQcm9taXNlIGltcGwgZm91bmQnKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlQ3Rvcjtcbn1cbiJdfQ==