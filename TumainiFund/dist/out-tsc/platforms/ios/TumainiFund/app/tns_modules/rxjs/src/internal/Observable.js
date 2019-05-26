import { canReportError } from './util/canReportError';
import { toSubscriber } from './util/toSubscriber';
import { observable as Symbol_observable } from '../internal/symbol/observable';
import { pipeFromArray } from './util/pipe';
import { config } from './config';
/**
 * A representation of any set of values over any amount of time. This is the most basic building block
 * of RxJS.
 *
 * @class Observable<T>
 */
export class Observable {
    /**
     * @constructor
     * @param {Function} subscribe the function that is called when the Observable is
     * initially subscribed to. This function is given a Subscriber, to which new values
     * can be `next`ed, or an `error` method can be called to raise an error, or
     * `complete` can be called to notify of a successful completion.
     */
    constructor(subscribe) {
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
    lift(operator) {
        const observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    }
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
    subscribe(observerOrNext, error, complete) {
        const { operator } = this;
        const sink = toSubscriber(observerOrNext, error, complete);
        if (operator) {
            sink.add(operator.call(sink, this.source));
        }
        else {
            sink.add(this.source || (config.useDeprecatedSynchronousErrorHandling && !sink.syncErrorThrowable) ?
                this._subscribe(sink) :
                this._trySubscribe(sink));
        }
        if (config.useDeprecatedSynchronousErrorHandling) {
            if (sink.syncErrorThrowable) {
                sink.syncErrorThrowable = false;
                if (sink.syncErrorThrown) {
                    throw sink.syncErrorValue;
                }
            }
        }
        return sink;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    _trySubscribe(sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            if (config.useDeprecatedSynchronousErrorHandling) {
                sink.syncErrorThrown = true;
                sink.syncErrorValue = err;
            }
            if (canReportError(sink)) {
                sink.error(err);
            }
            else {
                console.warn(err);
            }
        }
    }
    /**
     * @method forEach
     * @param {Function} next a handler for each value emitted by the observable
     * @param {PromiseConstructor} [promiseCtor] a constructor function used to instantiate the Promise
     * @return {Promise} a promise that either resolves on observable completion or
     *  rejects with the handled error
     */
    forEach(next, promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            // Must be declared in a separate statement to avoid a RefernceError when
            // accessing subscription below in the closure due to Temporal Dead Zone.
            let subscription;
            subscription = this.subscribe((value) => {
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
    }
    /** @internal This is an internal implementation detail, do not use. */
    _subscribe(subscriber) {
        const { source } = this;
        return source && source.subscribe(subscriber);
    }
    /**
     * An interop point defined by the es7-observable spec https://github.com/zenparsing/es-observable
     * @method Symbol.observable
     * @return {Observable} this instance of the observable
     */
    [Symbol_observable]() {
        return this;
    }
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
    pipe(...operations) {
        if (operations.length === 0) {
            return this;
        }
        return pipeFromArray(operations)(this);
    }
    /* tslint:enable:max-line-length */
    toPromise(promiseCtor) {
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor((resolve, reject) => {
            let value;
            this.subscribe((x) => value = x, (err) => reject(err), () => resolve(value));
        });
    }
}
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
 * @deprecated use new Observable() instead
 */
Observable.create = (subscribe) => {
    return new Observable(subscribe);
};
/**
 * Decides between a passed promise constructor from consuming code,
 * A default configured promise constructor, and the native promise
 * constructor and returns it. If nothing can be found, it will throw
 * an error.
 * @param promiseCtor The optional promise constructor to passed by consuming code
 */
function getPromiseCtor(promiseCtor) {
    if (!promiseCtor) {
        promiseCtor = config.Promise || Promise;
    }
    if (!promiseCtor) {
        throw new Error('no Promise impl found');
    }
    return promiseCtor;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzZXJ2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL09ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBSUEsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUduRCxPQUFPLEVBQUUsVUFBVSxJQUFJLGlCQUFpQixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDaEYsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUM1QyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRWxDOzs7OztHQUtHO0FBQ0gsTUFBTSxPQUFPLFVBQVU7SUFXckI7Ozs7OztPQU1HO0lBQ0gsWUFBWSxTQUE2RTtRQWhCekYsMkRBQTJEO1FBQ3BELGNBQVMsR0FBWSxLQUFLLENBQUM7UUFnQmhDLElBQUksU0FBUyxFQUFFO1lBQ2IsSUFBSSxDQUFDLFVBQVUsR0FBRyxTQUFTLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBa0JEOzs7Ozs7T0FNRztJQUNILElBQUksQ0FBSSxRQUF3QjtRQUM5QixNQUFNLFVBQVUsR0FBRyxJQUFJLFVBQVUsRUFBSyxDQUFDO1FBQ3ZDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLFVBQVUsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1FBQy9CLE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFVRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O09B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WyJpbXBvcnQgeyBPcGVyYXRvciB9IGZyb20gJy4vT3BlcmF0b3InO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBUZWFyZG93bkxvZ2ljLCBPcGVyYXRvckZ1bmN0aW9uLCBQYXJ0aWFsT2JzZXJ2ZXIsIFN1YnNjcmliYWJsZSB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgY2FuUmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvY2FuUmVwb3J0RXJyb3InO1xuaW1wb3J0IHsgdG9TdWJzY3JpYmVyIH0gZnJvbSAnLi91dGlsL3RvU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpaWYgfSBmcm9tICcuL29ic2VydmFibGUvaWlmJztcbmltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICcuL29ic2VydmFibGUvdGhyb3dFcnJvcic7XG5pbXBvcnQgeyBvYnNlcnZhYmxlIGFzIFN5bWJvbF9vYnNlcnZhYmxlIH0gZnJvbSAnLi4vaW50ZXJuYWwvc3ltYm9sL29ic2VydmFibGUnO1xuaW1wb3J0IHsgcGlwZUZyb21BcnJheSB9IGZyb20gJy4vdXRpbC9waXBlJztcbmltcG9ydCB7IGNvbmZpZyB9IGZyb20gJy4vY29uZmlnJztcblxuLyoqXG4gKiBBIHJlcHJlc2VudGF0aW9uIG9mIGFueSBzZXQgb2YgdmFsdWVzIG92ZXIgYW55IGFtb3VudCBvZiB0aW1lLiBUaGlzIGlzIHRoZSBtb3N0IGJhc2ljIGJ1aWxkaW5nIGJsb2NrXG4gKiBvZiBSeEpTLlxuICpcbiAqIEBjbGFzcyBPYnNlcnZhYmxlPFQ+XG4gKi9cbmV4cG9ydCBjbGFzcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaWJhYmxlPFQ+IHtcblxuICAvKiogSW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlIGRpcmVjdGx5LiAqL1xuICBwdWJsaWMgX2lzU2NhbGFyOiBib29sZWFuID0gZmFsc2U7XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBzb3VyY2U6IE9ic2VydmFibGU8YW55PjtcblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIG9wZXJhdG9yOiBPcGVyYXRvcjxhbnksIFQ+O1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gc3Vic2NyaWJlIHRoZSBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aGVuIHRoZSBPYnNlcnZhYmxlIGlzXG4gICAqIGluaXRpYWxseSBzdWJzY3JpYmVkIHRvLiBUaGlzIGZ1bmN0aW9uIGlzIGdpdmVuIGEgU3Vic2NyaWJlciwgdG8gd2hpY2ggbmV3IHZhbHVlc1xuICAgKiBjYW4gYmUgYG5leHRgZWQsIG9yIGFuIGBlcnJvcmAgbWV0aG9kIGNhbiBiZSBjYWxsZWQgdG8gcmFpc2UgYW4gZXJyb3IsIG9yXG4gICAqIGBjb21wbGV0ZWAgY2FuIGJlIGNhbGxlZCB0byBub3RpZnkgb2YgYSBzdWNjZXNzZnVsIGNvbXBsZXRpb24uXG4gICAqL1xuICBjb25zdHJ1Y3RvcihzdWJzY3JpYmU/OiAodGhpczogT2JzZXJ2YWJsZTxUPiwgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPikgPT4gVGVhcmRvd25Mb2dpYykge1xuICAgIGlmIChzdWJzY3JpYmUpIHtcbiAgICAgIHRoaXMuX3N1YnNjcmliZSA9IHN1YnNjcmliZTtcbiAgICB9XG4gIH1cblxuICAvLyBIQUNLOiBTaW5jZSBUeXBlU2NyaXB0IGluaGVyaXRzIHN0YXRpYyBwcm9wZXJ0aWVzIHRvbywgd2UgaGF2ZSB0b1xuICAvLyBmaWdodCBhZ2FpbnN0IFR5cGVTY3JpcHQgaGVyZSBzbyBTdWJqZWN0IGNhbiBoYXZlIGEgZGlmZmVyZW50IHN0YXRpYyBjcmVhdGUgc2lnbmF0dXJlXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IGNvbGQgT2JzZXJ2YWJsZSBieSBjYWxsaW5nIHRoZSBPYnNlcnZhYmxlIGNvbnN0cnVjdG9yXG4gICAqIEBzdGF0aWMgdHJ1ZVxuICAgKiBAb3duZXIgT2JzZXJ2YWJsZVxuICAgKiBAbWV0aG9kIGNyZWF0ZVxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBzdWJzY3JpYmU/IHRoZSBzdWJzY3JpYmVyIGZ1bmN0aW9uIHRvIGJlIHBhc3NlZCB0byB0aGUgT2JzZXJ2YWJsZSBjb25zdHJ1Y3RvclxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSBhIG5ldyBjb2xkIG9ic2VydmFibGVcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgdXNlIG5ldyBPYnNlcnZhYmxlKCkgaW5zdGVhZFxuICAgKi9cbiAgc3RhdGljIGNyZWF0ZTogRnVuY3Rpb24gPSA8VD4oc3Vic2NyaWJlPzogKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD4pID0+IFRlYXJkb3duTG9naWMpID0+IHtcbiAgICByZXR1cm4gbmV3IE9ic2VydmFibGU8VD4oc3Vic2NyaWJlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbmV3IE9ic2VydmFibGUsIHdpdGggdGhpcyBPYnNlcnZhYmxlIGFzIHRoZSBzb3VyY2UsIGFuZCB0aGUgcGFzc2VkXG4gICAqIG9wZXJhdG9yIGRlZmluZWQgYXMgdGhlIG5ldyBvYnNlcnZhYmxlJ3Mgb3BlcmF0b3IuXG4gICAqIEBtZXRob2QgbGlmdFxuICAgKiBAcGFyYW0ge09wZXJhdG9yfSBvcGVyYXRvciB0aGUgb3BlcmF0b3IgZGVmaW5pbmcgdGhlIG9wZXJhdGlvbiB0byB0YWtlIG9uIHRoZSBvYnNlcnZhYmxlXG4gICAqIEByZXR1cm4ge09ic2VydmFibGV9IGEgbmV3IG9ic2VydmFibGUgd2l0aCB0aGUgT3BlcmF0b3IgYXBwbGllZFxuICAgKi9cbiAgbGlmdDxSPihvcGVyYXRvcjogT3BlcmF0b3I8VCwgUj4pOiBPYnNlcnZhYmxlPFI+IHtcbiAgICBjb25zdCBvYnNlcnZhYmxlID0gbmV3IE9ic2VydmFibGU8Uj4oKTtcbiAgICBvYnNlcnZhYmxlLnNvdXJjZSA9IHRoaXM7XG4gICAgb2JzZXJ2YWJsZS5vcGVyYXRvciA9IG9wZXJhdG9yO1xuICAgIHJldHVybiBvYnNlcnZhYmxlO1xuICB9XG5cbiAgc3Vic2NyaWJlKG9ic2VydmVyPzogUGFydGlhbE9ic2VydmVyPFQ+KTogU3Vic2NyaXB0aW9uO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYSBjb21wbGV0ZSBjYWxsYmFjayAqL1xuICBzdWJzY3JpYmUobmV4dDogbnVsbCB8IHVuZGVmaW5lZCwgZXJyb3I6IG51bGwgfCB1bmRlZmluZWQsIGNvbXBsZXRlOiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYW4gZXJyb3IgY2FsbGJhY2sgKi9cbiAgc3Vic2NyaWJlKG5leHQ6IG51bGwgfCB1bmRlZmluZWQsIGVycm9yOiAoZXJyb3I6IGFueSkgPT4gdm9pZCwgY29tcGxldGU/OiAoKSA9PiB2b2lkKTogU3Vic2NyaXB0aW9uO1xuICAvKiogQGRlcHJlY2F0ZWQgVXNlIGFuIG9ic2VydmVyIGluc3RlYWQgb2YgYSBjb21wbGV0ZSBjYWxsYmFjayAqL1xuICBzdWJzY3JpYmUobmV4dDogKHZhbHVlOiBUKSA9PiB2b2lkLCBlcnJvcjogbnVsbCB8IHVuZGVmaW5lZCwgY29tcGxldGU6ICgpID0+IHZvaWQpOiBTdWJzY3JpcHRpb247XG4gIHN1YnNjcmliZShuZXh0PzogKHZhbHVlOiBUKSA9PiB2b2lkLCBlcnJvcj86IChlcnJvcjogYW55KSA9PiB2b2lkLCBjb21wbGV0ZT86ICgpID0+IHZvaWQpOiBTdWJzY3JpcHRpb247XG4gIC8qKlxuICAgKiBJbnZva2VzIGFuIGV4ZWN1dGlvbiBvZiBhbiBPYnNlcnZhYmxlIGFuZCByZWdpc3RlcnMgT2JzZXJ2ZXIgaGFuZGxlcnMgZm9yIG5vdGlmaWNhdGlvbnMgaXQgd2lsbCBlbWl0LlxuICAgKlxuICAgKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VXNlIGl0IHdoZW4geW91IGhhdmUgYWxsIHRoZXNlIE9ic2VydmFibGVzLCBidXQgc3RpbGwgbm90aGluZyBpcyBoYXBwZW5pbmcuPC9zcGFuPlxuICAgKlxuICAgKiBgc3Vic2NyaWJlYCBpcyBub3QgYSByZWd1bGFyIG9wZXJhdG9yLCBidXQgYSBtZXRob2QgdGhhdCBjYWxscyBPYnNlcnZhYmxlJ3MgaW50ZXJuYWwgYHN1YnNjcmliZWAgZnVuY3Rpb24uIEl0XG4gICAqIG1pZ2h0IGJlIGZvciBleGFtcGxlIGEgZnVuY3Rpb24gdGhhdCB5b3UgcGFzc2VkIHRvIE9ic2VydmFibGUncyBjb25zdHJ1Y3RvciwgYnV0IG1vc3Qgb2YgdGhlIHRpbWUgaXQgaXNcbiAgICogYSBsaWJyYXJ5IGltcGxlbWVudGF0aW9uLCB3aGljaCBkZWZpbmVzIHdoYXQgd2lsbCBiZSBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUsIGFuZCB3aGVuIGl0IGJlIHdpbGwgZW1pdHRlZC4gVGhpcyBtZWFuc1xuICAgKiB0aGF0IGNhbGxpbmcgYHN1YnNjcmliZWAgaXMgYWN0dWFsbHkgdGhlIG1vbWVudCB3aGVuIE9ic2VydmFibGUgc3RhcnRzIGl0cyB3b3JrLCBub3Qgd2hlbiBpdCBpcyBjcmVhdGVkLCBhcyBpdCBpcyBvZnRlblxuICAgKiB0aGUgdGhvdWdodC5cbiAgICpcbiAgICogQXBhcnQgZnJvbSBzdGFydGluZyB0aGUgZXhlY3V0aW9uIG9mIGFuIE9ic2VydmFibGUsIHRoaXMgbWV0aG9kIGFsbG93cyB5b3UgdG8gbGlzdGVuIGZvciB2YWx1ZXNcbiAgICogdGhhdCBhbiBPYnNlcnZhYmxlIGVtaXRzLCBhcyB3ZWxsIGFzIGZvciB3aGVuIGl0IGNvbXBsZXRlcyBvciBlcnJvcnMuIFlvdSBjYW4gYWNoaWV2ZSB0aGlzIGluIHR3b1xuICAgKiBvZiB0aGUgZm9sbG93aW5nIHdheXMuXG4gICAqXG4gICAqIFRoZSBmaXJzdCB3YXkgaXMgY3JlYXRpbmcgYW4gb2JqZWN0IHRoYXQgaW1wbGVtZW50cyB7QGxpbmsgT2JzZXJ2ZXJ9IGludGVyZmFjZS4gSXQgc2hvdWxkIGhhdmUgbWV0aG9kc1xuICAgKiBkZWZpbmVkIGJ5IHRoYXQgaW50ZXJmYWNlLCBidXQgbm90ZSB0aGF0IGl0IHNob3VsZCBiZSBqdXN0IGEgcmVndWxhciBKYXZhU2NyaXB0IG9iamVjdCwgd2hpY2ggeW91IGNhbiBjcmVhdGVcbiAgICogeW91cnNlbGYgaW4gYW55IHdheSB5b3Ugd2FudCAoRVM2IGNsYXNzLCBjbGFzc2ljIGZ1bmN0aW9uIGNvbnN0cnVjdG9yLCBvYmplY3QgbGl0ZXJhbCBldGMuKS4gSW4gcGFydGljdWxhciBkb1xuICAgKiBub3QgYXR0ZW1wdCB0byB1c2UgYW55IFJ4SlMgaW1wbGVtZW50YXRpb24gZGV0YWlscyB0byBjcmVhdGUgT2JzZXJ2ZXJzIC0geW91IGRvbid0IG5lZWQgdGhlbS4gUmVtZW1iZXIgYWxzb1xuICAgKiB0aGF0IHlvdXIgb2JqZWN0IGRvZXMgbm90IGhhdmUgdG8gaW1wbGVtZW50IGFsbCBtZXRob2RzLiBJZiB5b3UgZmluZCB5b3Vyc2VsZiBjcmVhdGluZyBhIG1ldGhvZCB0aGF0IGRvZXNuJ3RcbiAgICogZG8gYW55dGhpbmcsIHlvdSBjYW4gc2ltcGx5IG9taXQgaXQuIE5vdGUgaG93ZXZlciwgaWYgdGhlIGBlcnJvcmAgbWV0aG9kIGlzIG5vdCBwcm92aWRlZCwgYWxsIGVycm9ycyB3aWxsXG4gICAqIGJlIGxlZnQgdW5jYXVnaHQuXG4gICAqXG4gICAqIFRoZSBzZWNvbmQgd2F5IGlzIHRvIGdpdmUgdXAgb24gT2JzZXJ2ZXIgb2JqZWN0IGFsdG9nZXRoZXIgYW5kIHNpbXBseSBwcm92aWRlIGNhbGxiYWNrIGZ1bmN0aW9ucyBpbiBwbGFjZSBvZiBpdHMgbWV0aG9kcy5cbiAgICogVGhpcyBtZWFucyB5b3UgY2FuIHByb3ZpZGUgdGhyZWUgZnVuY3Rpb25zIGFzIGFyZ3VtZW50cyB0byBgc3Vic2NyaWJlYCwgd2hlcmUgdGhlIGZpcnN0IGZ1bmN0aW9uIGlzIGVxdWl2YWxlbnRcbiAgICogb2YgYSBgbmV4dGAgbWV0aG9kLCB0aGUgc2Vjb25kIG9mIGFuIGBlcnJvcmAgbWV0aG9kIGFuZCB0aGUgdGhpcmQgb2YgYSBgY29tcGxldGVgIG1ldGhvZC4gSnVzdCBhcyBpbiBjYXNlIG9mIE9ic2VydmVyLFxuICAgKiBpZiB5b3UgZG8gbm90IG5lZWQgdG8gbGlzdGVuIGZvciBzb21ldGhpbmcsIHlvdSBjYW4gb21pdCBhIGZ1bmN0aW9uLCBwcmVmZXJhYmx5IGJ5IHBhc3NpbmcgYHVuZGVmaW5lZGAgb3IgYG51bGxgLFxuICAgKiBzaW5jZSBgc3Vic2NyaWJlYCByZWNvZ25pemVzIHRoZXNlIGZ1bmN0aW9ucyBieSB3aGVyZSB0aGV5IHdlcmUgcGxhY2VkIGluIGZ1bmN0aW9uIGNhbGwuIFdoZW4gaXQgY29tZXNcbiAgICogdG8gYGVycm9yYCBmdW5jdGlvbiwganVzdCBhcyBiZWZvcmUsIGlmIG5vdCBwcm92aWRlZCwgZXJyb3JzIGVtaXR0ZWQgYnkgYW4gT2JzZXJ2YWJsZSB3aWxsIGJlIHRocm93bi5cbiAgICpcbiAgICogV2hpY2hldmVyIHN0eWxlIG9mIGNhbGxpbmcgYHN1YnNjcmliZWAgeW91IHVzZSwgaW4gYm90aCBjYXNlcyBpdCByZXR1cm5zIGEgU3Vic2NyaXB0aW9uIG9iamVjdC5cbiAgICogVGhpcyBvYmplY3QgYWxsb3dzIHlvdSB0byBjYWxsIGB1bnN1YnNjcmliZWAgb24gaXQsIHdoaWNoIGluIHR1cm4gd2lsbCBzdG9wIHRoZSB3b3JrIHRoYXQgYW4gT2JzZXJ2YWJsZSBkb2VzIGFuZCB3aWxsIGNsZWFuXG4gICAqIHVwIGFsbCByZXNvdXJjZXMgdGhhdCBhbiBPYnNlcnZhYmxlIHVzZWQuIE5vdGUgdGhhdCBjYW5jZWxsaW5nIGEgc3Vic2NyaXB0aW9uIHdpbGwgbm90IGNhbGwgYGNvbXBsZXRlYCBjYWxsYmFja1xuICAgKiBwcm92aWRlZCB0byBgc3Vic2NyaWJlYCBmdW5jdGlvbiwgd2hpY2ggaXMgcmVzZXJ2ZWQgZm9yIGEgcmVndWxhciBjb21wbGV0aW9uIHNpZ25hbCB0aGF0IGNvbWVzIGZyb20gYW4gT2JzZXJ2YWJsZS5cbiAgICpcbiAgICogUmVtZW1iZXIgdGhhdCBjYWxsYmFja3MgcHJvdmlkZWQgdG8gYHN1YnNjcmliZWAgYXJlIG5vdCBndWFyYW50ZWVkIHRvIGJlIGNhbGxlZCBhc3luY2hyb25vdXNseS5cbiAgICogSXQgaXMgYW4gT2JzZXJ2YWJsZSBpdHNlbGYgdGhhdCBkZWNpZGVzIHdoZW4gdGhlc2UgZnVuY3Rpb25zIHdpbGwgYmUgY2FsbGVkLiBGb3IgZXhhbXBsZSB7QGxpbmsgb2Z9XG4gICAqIGJ5IGRlZmF1bHQgZW1pdHMgYWxsIGl0cyB2YWx1ZXMgc3luY2hyb25vdXNseS4gQWx3YXlzIGNoZWNrIGRvY3VtZW50YXRpb24gZm9yIGhvdyBnaXZlbiBPYnNlcnZhYmxlXG4gICAqIHdpbGwgYmVoYXZlIHdoZW4gc3Vic2NyaWJlZCBhbmQgaWYgaXRzIGRlZmF1bHQgYmVoYXZpb3IgY2FuIGJlIG1vZGlmaWVkIHdpdGggYSBgc2NoZWR1bGVyYC5cbiAgICpcbiAgICogIyMgRXhhbXBsZVxuICAgKiAjIyMgU3Vic2NyaWJlIHdpdGggYW4gT2JzZXJ2ZXJcbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBzdW1PYnNlcnZlciA9IHtcbiAgICogICBzdW06IDAsXG4gICAqICAgbmV4dCh2YWx1ZSkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ0FkZGluZzogJyArIHZhbHVlKTtcbiAgICogICAgIHRoaXMuc3VtID0gdGhpcy5zdW0gKyB2YWx1ZTtcbiAgICogICB9LFxuICAgKiAgIGVycm9yKCkgeyAvLyBXZSBhY3R1YWxseSBjb3VsZCBqdXN0IHJlbW92ZSB0aGlzIG1ldGhvZCxcbiAgICogICB9LCAgICAgICAgLy8gc2luY2Ugd2UgZG8gbm90IHJlYWxseSBjYXJlIGFib3V0IGVycm9ycyByaWdodCBub3cuXG4gICAqICAgY29tcGxldGUoKSB7XG4gICAqICAgICBjb25zb2xlLmxvZygnU3VtIGVxdWFsczogJyArIHRoaXMuc3VtKTtcbiAgICogICB9XG4gICAqIH07XG4gICAqXG4gICAqIFJ4Lk9ic2VydmFibGUub2YoMSwgMiwgMykgLy8gU3luY2hyb25vdXNseSBlbWl0cyAxLCAyLCAzIGFuZCB0aGVuIGNvbXBsZXRlcy5cbiAgICogLnN1YnNjcmliZShzdW1PYnNlcnZlcik7XG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIFwiQWRkaW5nOiAxXCJcbiAgICogLy8gXCJBZGRpbmc6IDJcIlxuICAgKiAvLyBcIkFkZGluZzogM1wiXG4gICAqIC8vIFwiU3VtIGVxdWFsczogNlwiXG4gICAqIGBgYFxuICAgKlxuICAgKiAjIyMgU3Vic2NyaWJlIHdpdGggZnVuY3Rpb25zXG4gICAqIGBgYGphdmFzY3JpcHRcbiAgICogbGV0IHN1bSA9IDA7XG4gICAqXG4gICAqIFJ4Lk9ic2VydmFibGUub2YoMSwgMiwgMylcbiAgICogLnN1YnNjcmliZShcbiAgICogICBmdW5jdGlvbih2YWx1ZSkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ0FkZGluZzogJyArIHZhbHVlKTtcbiAgICogICAgIHN1bSA9IHN1bSArIHZhbHVlO1xuICAgKiAgIH0sXG4gICAqICAgdW5kZWZpbmVkLFxuICAgKiAgIGZ1bmN0aW9uKCkge1xuICAgKiAgICAgY29uc29sZS5sb2coJ1N1bSBlcXVhbHM6ICcgKyBzdW0pO1xuICAgKiAgIH1cbiAgICogKTtcbiAgICpcbiAgICogLy8gTG9nczpcbiAgICogLy8gXCJBZGRpbmc6IDFcIlxuICAgKiAvLyBcIkFkZGluZzogMlwiXG4gICAqIC8vIFwiQWRkaW5nOiAzXCJcbiAgICogLy8gXCJTdW0gZXF1YWxzOiA2XCJcbiAgICogYGBgXG4gICAqXG4gICAqICMjIyBDYW5jZWwgYSBzdWJzY3JpcHRpb25cbiAgICogYGBgamF2YXNjcmlwdFxuICAgKiBjb25zdCBzdWJzY3JpcHRpb24gPSBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMDApLnN1YnNjcmliZShcbiAgICogICBudW0gPT4gY29uc29sZS5sb2cobnVtKSxcbiAgICogICB1bmRlZmluZWQsXG4gICAqICAgKCkgPT4gY29uc29sZS5sb2coJ2NvbXBsZXRlZCEnKSAvLyBXaWxsIG5vdCBiZSBjYWxsZWQsIGV2ZW5cbiAgICogKTsgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHdoZW4gY2FuY2VsbGluZyBzdWJzY3JpcHRpb25cbiAgICpcbiAgICpcbiAgICogc2V0VGltZW91dCgoKSA9PiB7XG4gICAqICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAqICAgY29uc29sZS5sb2coJ3Vuc3Vic2NyaWJlZCEnKTtcbiAgICogfSwgMjUwMCk7XG4gICAqXG4gICAqIC8vIExvZ3M6XG4gICAqIC8vIDAgYWZ0ZXIgMXNcbiAgICogLy8gMSBhZnRlciAyc1xuICAgKiAvLyBcInVuc3Vic2NyaWJlZCFcIiBhZnRlciAyLjVzXG4gICAqIGBgYFxuICAgKlxuICAgKiBAcGFyYW0ge09ic2VydmVyfEZ1bmN0aW9ufSBvYnNlcnZlck9yTmV4dCAob3B0aW9uYWwpIEVpdGhlciBhbiBvYnNlcnZlciB3aXRoIG1ldGhvZHMgdG8gYmUgY2FsbGVkLFxuICAgKiAgb3IgdGhlIGZpcnN0IG9mIHRocmVlIHBvc3NpYmxlIGhhbmRsZXJzLCB3aGljaCBpcyB0aGUgaGFuZGxlciBmb3IgZWFjaCB2YWx1ZSBlbWl0dGVkIGZyb20gdGhlIHN1YnNjcmliZWRcbiAgICogIE9ic2VydmFibGUuXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGVycm9yIChvcHRpb25hbCkgQSBoYW5kbGVyIGZvciBhIHRlcm1pbmFsIGV2ZW50IHJlc3VsdGluZyBmcm9tIGFuIGVycm9yLiBJZiBubyBlcnJvciBoYW5kbGVyIGlzIHByb3ZpZGVkLFxuICAgKiAgdGhlIGVycm9yIHdpbGwgYmUgdGhyb3duIGFzIHVuaGFuZGxlZC5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29tcGxldGUgKG9wdGlvbmFsKSBBIGhhbmRsZXIgZm9yIGEgdGVybWluYWwgZXZlbnQgcmVzdWx0aW5nIGZyb20gc3VjY2Vzc2Z1bCBjb21wbGV0aW9uLlxuICAgKiBAcmV0dXJuIHtJU3Vic2NyaXB0aW9ufSBhIHN1YnNjcmlwdGlvbiByZWZlcmVuY2UgdG8gdGhlIHJlZ2lzdGVyZWQgaGFuZGxlcnNcbiAgICogQG1ldGhvZCBzdWJzY3JpYmVcbiAgICovXG4gIHN1YnNjcmliZShvYnNlcnZlck9yTmV4dD86IFBhcnRpYWxPYnNlcnZlcjxUPiB8ICgodmFsdWU6IFQpID0+IHZvaWQpLFxuICAgICAgICAgICAgZXJyb3I/OiAoZXJyb3I6IGFueSkgPT4gdm9pZCxcbiAgICAgICAgICAgIGNvbXBsZXRlPzogKCkgPT4gdm9pZCk6IFN1YnNjcmlwdGlvbiB7XG5cbiAgICBjb25zdCB7IG9wZXJhdG9yIH0gPSB0aGlzO1xuICAgIGNvbnN0IHNpbmsgPSB0b1N1YnNjcmliZXIob2JzZXJ2ZXJPck5leHQsIGVycm9yLCBjb21wbGV0ZSk7XG5cbiAgICBpZiAob3BlcmF0b3IpIHtcbiAgICAgIHNpbmsuYWRkKG9wZXJhdG9yLmNhbGwoc2luaywgdGhpcy5zb3VyY2UpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc2luay5hZGQoXG4gICAgICAgIHRoaXMuc291cmNlIHx8IChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZyAmJiAhc2luay5zeW5jRXJyb3JUaHJvd2FibGUpID9cbiAgICAgICAgdGhpcy5fc3Vic2NyaWJlKHNpbmspIDpcbiAgICAgICAgdGhpcy5fdHJ5U3Vic2NyaWJlKHNpbmspXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmIChjb25maWcudXNlRGVwcmVjYXRlZFN5bmNocm9ub3VzRXJyb3JIYW5kbGluZykge1xuICAgICAgaWYgKHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlKSB7XG4gICAgICAgIHNpbmsuc3luY0Vycm9yVGhyb3dhYmxlID0gZmFsc2U7XG4gICAgICAgIGlmIChzaW5rLnN5bmNFcnJvclRocm93bikge1xuICAgICAgICAgIHRocm93IHNpbmsuc3luY0Vycm9yVmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2luaztcbiAgfVxuXG4gIC8qKiBAZGVwcmVjYXRlZCBUaGlzIGlzIGFuIGludGVybmFsIGltcGxlbWVudGF0aW9uIGRldGFpbCwgZG8gbm90IHVzZS4gKi9cbiAgX3RyeVN1YnNjcmliZShzaW5rOiBTdWJzY3JpYmVyPFQ+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLl9zdWJzY3JpYmUoc2luayk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgICAgc2luay5zeW5jRXJyb3JUaHJvd24gPSB0cnVlO1xuICAgICAgICBzaW5rLnN5bmNFcnJvclZhbHVlID0gZXJyO1xuICAgICAgfVxuICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHNpbmspKSB7XG4gICAgICAgIHNpbmsuZXJyb3IoZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAbWV0aG9kIGZvckVhY2hcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gbmV4dCBhIGhhbmRsZXIgZm9yIGVhY2ggdmFsdWUgZW1pdHRlZCBieSB0aGUgb2JzZXJ2YWJsZVxuICAgKiBAcGFyYW0ge1Byb21pc2VDb25zdHJ1Y3Rvcn0gW3Byb21pc2VDdG9yXSBhIGNvbnN0cnVjdG9yIGZ1bmN0aW9uIHVzZWQgdG8gaW5zdGFudGlhdGUgdGhlIFByb21pc2VcbiAgICogQHJldHVybiB7UHJvbWlzZX0gYSBwcm9taXNlIHRoYXQgZWl0aGVyIHJlc29sdmVzIG9uIG9ic2VydmFibGUgY29tcGxldGlvbiBvclxuICAgKiAgcmVqZWN0cyB3aXRoIHRoZSBoYW5kbGVkIGVycm9yXG4gICAqL1xuICBmb3JFYWNoKG5leHQ6ICh2YWx1ZTogVCkgPT4gdm9pZCwgcHJvbWlzZUN0b3I/OiBQcm9taXNlQ29uc3RydWN0b3JMaWtlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcHJvbWlzZUN0b3IgPSBnZXRQcm9taXNlQ3Rvcihwcm9taXNlQ3Rvcik7XG5cbiAgICByZXR1cm4gbmV3IHByb21pc2VDdG9yPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIC8vIE11c3QgYmUgZGVjbGFyZWQgaW4gYSBzZXBhcmF0ZSBzdGF0ZW1lbnQgdG8gYXZvaWQgYSBSZWZlcm5jZUVycm9yIHdoZW5cbiAgICAgIC8vIGFjY2Vzc2luZyBzdWJzY3JpcHRpb24gYmVsb3cgaW4gdGhlIGNsb3N1cmUgZHVlIHRvIFRlbXBvcmFsIERlYWQgWm9uZS5cbiAgICAgIGxldCBzdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcbiAgICAgIHN1YnNjcmlwdGlvbiA9IHRoaXMuc3Vic2NyaWJlKCh2YWx1ZSkgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIG5leHQodmFsdWUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICBpZiAoc3Vic2NyaXB0aW9uKSB7XG4gICAgICAgICAgICBzdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sIHJlamVjdCwgcmVzb2x2ZSk7XG4gICAgfSkgYXMgUHJvbWlzZTx2b2lkPjtcbiAgfVxuXG4gIC8qKiBAaW50ZXJuYWwgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KTogVGVhcmRvd25Mb2dpYyB7XG4gICAgY29uc3QgeyBzb3VyY2UgfSA9IHRoaXM7XG4gICAgcmV0dXJuIHNvdXJjZSAmJiBzb3VyY2Uuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICB9XG5cbiAgLy8gYGlmYCBhbmQgYHRocm93YCBhcmUgc3BlY2lhbCBzbm93IGZsYWtlcywgdGhlIGNvbXBpbGVyIHNlZXMgdGhlbSBhcyByZXNlcnZlZCB3b3Jkcy4gRGVwcmVjYXRlZCBpblxuICAvLyBmYXZvciBvZiBpaWYgYW5kIHRocm93RXJyb3IgZnVuY3Rpb25zLlxuICAvKipcbiAgICogQG5vY29sbGFwc2VcbiAgICogQGRlcHJlY2F0ZWQgSW4gZmF2b3Igb2YgaWlmIGNyZWF0aW9uIGZ1bmN0aW9uOiBpbXBvcnQgeyBpaWYgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyBpZjogdHlwZW9mIGlpZjtcbiAgLyoqXG4gICAqIEBub2NvbGxhcHNlXG4gICAqIEBkZXByZWNhdGVkIEluIGZhdm9yIG9mIHRocm93RXJyb3IgY3JlYXRpb24gZnVuY3Rpb246IGltcG9ydCB7IHRocm93RXJyb3IgfSBmcm9tICdyeGpzJztcbiAgICovXG4gIHN0YXRpYyB0aHJvdzogdHlwZW9mIHRocm93RXJyb3I7XG5cbiAgLyoqXG4gICAqIEFuIGludGVyb3AgcG9pbnQgZGVmaW5lZCBieSB0aGUgZXM3LW9ic2VydmFibGUgc3BlYyBodHRwczovL2dpdGh1Yi5jb20vemVucGFyc2luZy9lcy1vYnNlcnZhYmxlXG4gICAqIEBtZXRob2QgU3ltYm9sLm9ic2VydmFibGVcbiAgICogQHJldHVybiB7T2JzZXJ2YWJsZX0gdGhpcyBpbnN0YW5jZSBvZiB0aGUgb2JzZXJ2YWJsZVxuICAgKi9cbiAgW1N5bWJvbF9vYnNlcnZhYmxlXSgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuICBwaXBlKCk6IE9ic2VydmFibGU8VD47XG4gIHBpcGU8QT4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+KTogT2JzZXJ2YWJsZTxBPjtcbiAgcGlwZTxBLCBCPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPik6IE9ic2VydmFibGU8Qj47XG4gIHBpcGU8QSwgQiwgQz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPik6IE9ic2VydmFibGU8Qz47XG4gIHBpcGU8QSwgQiwgQywgRD4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+KTogT2JzZXJ2YWJsZTxEPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPik6IE9ic2VydmFibGU8RT47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRj4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPik6IE9ic2VydmFibGU8Rj47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRz4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+KTogT2JzZXJ2YWJsZTxHPjtcbiAgcGlwZTxBLCBCLCBDLCBELCBFLCBGLCBHLCBIPihvcDE6IE9wZXJhdG9yRnVuY3Rpb248VCwgQT4sIG9wMjogT3BlcmF0b3JGdW5jdGlvbjxBLCBCPiwgb3AzOiBPcGVyYXRvckZ1bmN0aW9uPEIsIEM+LCBvcDQ6IE9wZXJhdG9yRnVuY3Rpb248QywgRD4sIG9wNTogT3BlcmF0b3JGdW5jdGlvbjxELCBFPiwgb3A2OiBPcGVyYXRvckZ1bmN0aW9uPEUsIEY+LCBvcDc6IE9wZXJhdG9yRnVuY3Rpb248RiwgRz4sIG9wODogT3BlcmF0b3JGdW5jdGlvbjxHLCBIPik6IE9ic2VydmFibGU8SD47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPik6IE9ic2VydmFibGU8ST47XG4gIHBpcGU8QSwgQiwgQywgRCwgRSwgRiwgRywgSCwgST4ob3AxOiBPcGVyYXRvckZ1bmN0aW9uPFQsIEE+LCBvcDI6IE9wZXJhdG9yRnVuY3Rpb248QSwgQj4sIG9wMzogT3BlcmF0b3JGdW5jdGlvbjxCLCBDPiwgb3A0OiBPcGVyYXRvckZ1bmN0aW9uPEMsIEQ+LCBvcDU6IE9wZXJhdG9yRnVuY3Rpb248RCwgRT4sIG9wNjogT3BlcmF0b3JGdW5jdGlvbjxFLCBGPiwgb3A3OiBPcGVyYXRvckZ1bmN0aW9uPEYsIEc+LCBvcDg6IE9wZXJhdG9yRnVuY3Rpb248RywgSD4sIG9wOTogT3BlcmF0b3JGdW5jdGlvbjxILCBJPiwgLi4ub3BlcmF0aW9uczogT3BlcmF0b3JGdW5jdGlvbjxhbnksIGFueT5bXSk6IE9ic2VydmFibGU8e30+O1xuICAvKiB0c2xpbnQ6ZW5hYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuXG4gIC8qKlxuICAgKiBVc2VkIHRvIHN0aXRjaCB0b2dldGhlciBmdW5jdGlvbmFsIG9wZXJhdG9ycyBpbnRvIGEgY2hhaW4uXG4gICAqIEBtZXRob2QgcGlwZVxuICAgKiBAcmV0dXJuIHtPYnNlcnZhYmxlfSB0aGUgT2JzZXJ2YWJsZSByZXN1bHQgb2YgYWxsIG9mIHRoZSBvcGVyYXRvcnMgaGF2aW5nXG4gICAqIGJlZW4gY2FsbGVkIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgcGFzc2VkIGluLlxuICAgKlxuICAgKiAjIyMgRXhhbXBsZVxuICAgKiBgYGBqYXZhc2NyaXB0XG4gICAqIGltcG9ydCB7IG1hcCwgZmlsdGVyLCBzY2FuIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICAgKlxuICAgKiBSeC5PYnNlcnZhYmxlLmludGVydmFsKDEwMDApXG4gICAqICAgLnBpcGUoXG4gICAqICAgICBmaWx0ZXIoeCA9PiB4ICUgMiA9PT0gMCksXG4gICAqICAgICBtYXAoeCA9PiB4ICsgeCksXG4gICAqICAgICBzY2FuKChhY2MsIHgpID0+IGFjYyArIHgpXG4gICAqICAgKVxuICAgKiAgIC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSlcbiAgICogYGBgXG4gICAqL1xuICBwaXBlKC4uLm9wZXJhdGlvbnM6IE9wZXJhdG9yRnVuY3Rpb248YW55LCBhbnk+W10pOiBPYnNlcnZhYmxlPGFueT4ge1xuICAgIGlmIChvcGVyYXRpb25zLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMgYXMgYW55O1xuICAgIH1cblxuICAgIHJldHVybiBwaXBlRnJvbUFycmF5KG9wZXJhdGlvbnMpKHRoaXMpO1xuICB9XG5cbiAgLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+KTogUHJvbWlzZTxUPjtcbiAgdG9Qcm9taXNlPFQ+KHRoaXM6IE9ic2VydmFibGU8VD4sIFByb21pc2VDdG9yOiB0eXBlb2YgUHJvbWlzZSk6IFByb21pc2U8VD47XG4gIHRvUHJvbWlzZTxUPih0aGlzOiBPYnNlcnZhYmxlPFQ+LCBQcm9taXNlQ3RvcjogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD47XG4gIC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbiAgdG9Qcm9taXNlKHByb21pc2VDdG9yPzogUHJvbWlzZUNvbnN0cnVjdG9yTGlrZSk6IFByb21pc2U8VD4ge1xuICAgIHByb21pc2VDdG9yID0gZ2V0UHJvbWlzZUN0b3IocHJvbWlzZUN0b3IpO1xuXG4gICAgcmV0dXJuIG5ldyBwcm9taXNlQ3RvcigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICBsZXQgdmFsdWU6IGFueTtcbiAgICAgIHRoaXMuc3Vic2NyaWJlKCh4OiBUKSA9PiB2YWx1ZSA9IHgsIChlcnI6IGFueSkgPT4gcmVqZWN0KGVyciksICgpID0+IHJlc29sdmUodmFsdWUpKTtcbiAgICB9KSBhcyBQcm9taXNlPFQ+O1xuICB9XG59XG5cbi8qKlxuICogRGVjaWRlcyBiZXR3ZWVuIGEgcGFzc2VkIHByb21pc2UgY29uc3RydWN0b3IgZnJvbSBjb25zdW1pbmcgY29kZSxcbiAqIEEgZGVmYXVsdCBjb25maWd1cmVkIHByb21pc2UgY29uc3RydWN0b3IsIGFuZCB0aGUgbmF0aXZlIHByb21pc2VcbiAqIGNvbnN0cnVjdG9yIGFuZCByZXR1cm5zIGl0LiBJZiBub3RoaW5nIGNhbiBiZSBmb3VuZCwgaXQgd2lsbCB0aHJvd1xuICogYW4gZXJyb3IuXG4gKiBAcGFyYW0gcHJvbWlzZUN0b3IgVGhlIG9wdGlvbmFsIHByb21pc2UgY29uc3RydWN0b3IgdG8gcGFzc2VkIGJ5IGNvbnN1bWluZyBjb2RlXG4gKi9cbmZ1bmN0aW9uIGdldFByb21pc2VDdG9yKHByb21pc2VDdG9yOiBQcm9taXNlQ29uc3RydWN0b3JMaWtlIHwgdW5kZWZpbmVkKSB7XG4gIGlmICghcHJvbWlzZUN0b3IpIHtcbiAgICBwcm9taXNlQ3RvciA9IGNvbmZpZy5Qcm9taXNlIHx8IFByb21pc2U7XG4gIH1cblxuICBpZiAoIXByb21pc2VDdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdubyBQcm9taXNlIGltcGwgZm91bmQnKTtcbiAgfVxuXG4gIHJldHVybiBwcm9taXNlQ3Rvcjtcbn1cbiJdfQ==