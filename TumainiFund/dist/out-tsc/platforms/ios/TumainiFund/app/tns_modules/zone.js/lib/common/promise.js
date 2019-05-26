/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('ZoneAwarePromise', (global, Zone, api) => {
    const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    const ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            const className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    const __symbol__ = api.symbol;
    const _uncaughtPromiseErrors = [];
    const symbolPromise = __symbol__('Promise');
    const symbolThen = __symbol__('then');
    const creationTrace = '__creationTrace__';
    api.onUnhandledError = (e) => {
        if (api.showUncaughtError()) {
            const rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = () => {
        while (_uncaughtPromiseErrors.length) {
            while (_uncaughtPromiseErrors.length) {
                const uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(() => {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            }
        }
    };
    const UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            const handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
            if (handler && typeof handler === 'function') {
                handler.call(this, e);
            }
        }
        catch (err) {
        }
    }
    function isThenable(value) {
        return value && value.then;
    }
    function forwardResolution(value) {
        return value;
    }
    function forwardRejection(rejection) {
        return ZoneAwarePromise.reject(rejection);
    }
    const symbolState = __symbol__('state');
    const symbolValue = __symbol__('value');
    const symbolFinally = __symbol__('finally');
    const symbolParentPromiseValue = __symbol__('parentPromiseValue');
    const symbolParentPromiseState = __symbol__('parentPromiseState');
    const source = 'Promise.then';
    const UNRESOLVED = null;
    const RESOLVED = true;
    const REJECTED = false;
    const REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return (v) => {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    const once = function () {
        let wasCalled = false;
        return function wrapper(wrappedFunction) {
            return function () {
                if (wasCalled) {
                    return;
                }
                wasCalled = true;
                wrappedFunction.apply(null, arguments);
            };
        };
    };
    const TYPE_ERROR = 'Promise resolved with itself';
    const CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        const onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            let then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(() => {
                    resolvePromise(promise, false, err);
                })();
                return promise;
            }
            // if (value instanceof ZoneAwarePromise) {
            if (state !== REJECTED && value instanceof ZoneAwarePromise &&
                value.hasOwnProperty(symbolState) && value.hasOwnProperty(symbolValue) &&
                value[symbolState] !== UNRESOLVED) {
                clearRejectedNoCatch(value);
                resolvePromise(promise, value[symbolState], value[symbolValue]);
            }
            else if (state !== REJECTED && typeof then === 'function') {
                try {
                    then.call(value, onceWrapper(makeResolver(promise, state)), onceWrapper(makeResolver(promise, false)));
                }
                catch (err) {
                    onceWrapper(() => {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                const queue = promise[symbolValue];
                promise[symbolValue] = value;
                if (promise[symbolFinally] === symbolFinally) {
                    // the promise is generated by Promise.prototype.finally
                    if (state === RESOLVED) {
                        // the state is resolved, should ignore the value
                        // and use parent promise value
                        promise[symbolState] = promise[symbolParentPromiseState];
                        promise[symbolValue] = promise[symbolParentPromiseValue];
                    }
                }
                // record task information in value when error occurs, so we can
                // do some additional work such as render longStackTrace
                if (state === REJECTED && value instanceof Error) {
                    // check if longStackTraceZone is here
                    const trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (let i = 0; i < queue.length;) {
                    scheduleResolveOrReject(promise, queue[i++], queue[i++], queue[i++], queue[i++]);
                }
                if (queue.length == 0 && state == REJECTED) {
                    promise[symbolState] = REJECTED_NO_CATCH;
                    try {
                        // try to print more readable error log
                        throw new Error('Uncaught (in promise): ' + readableObjectToString(value) +
                            (value && value.stack ? '\n' + value.stack : ''));
                    }
                    catch (err) {
                        const error = err;
                        error.rejection = value;
                        error.promise = promise;
                        error.zone = Zone.current;
                        error.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    const REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                const handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (let i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        const promiseState = promise[symbolState];
        const delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, () => {
            try {
                const parentPromiseValue = promise[symbolValue];
                const isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                const value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
                    [] :
                    [parentPromiseValue]);
                resolvePromise(chainPromise, true, value);
            }
            catch (error) {
                // if error occurs, should always return this error
                resolvePromise(chainPromise, false, error);
            }
        }, chainPromise);
    }
    const ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    class ZoneAwarePromise {
        constructor(executor) {
            const promise = this;
            if (!(promise instanceof ZoneAwarePromise)) {
                throw new Error('Must be an instanceof Promise.');
            }
            promise[symbolState] = UNRESOLVED;
            promise[symbolValue] = []; // queue;
            try {
                executor && executor(makeResolver(promise, RESOLVED), makeResolver(promise, REJECTED));
            }
            catch (error) {
                resolvePromise(promise, false, error);
            }
        }
        static toString() {
            return ZONE_AWARE_PROMISE_TO_STRING;
        }
        static resolve(value) {
            return resolvePromise(new this(null), RESOLVED, value);
        }
        static reject(error) {
            return resolvePromise(new this(null), REJECTED, error);
        }
        static race(values) {
            let resolve;
            let reject;
            let promise = new this((res, rej) => {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                resolve(value);
            }
            function onReject(error) {
                reject(error);
            }
            for (let value of values) {
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then(onResolve, onReject);
            }
            return promise;
        }
        static all(values) {
            let resolve;
            let reject;
            let promise = new this((res, rej) => {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            let unresolvedCount = 2;
            let valueIndex = 0;
            const resolvedValues = [];
            for (let value of values) {
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                const curValueIndex = valueIndex;
                value.then((value) => {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        }
        get [Symbol.toStringTag]() {
            return 'Promise';
        }
        then(onFulfilled, onRejected) {
            const chainPromise = new this.constructor(null);
            const zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        }
        catch(onRejected) {
            return this.then(null, onRejected);
        }
        finally(onFinally) {
            const chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            const zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        }
    }
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    const NativePromise = global[symbolPromise] = global['Promise'];
    const ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    let desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
    if (!desc || desc.configurable) {
        desc && delete desc.writable;
        desc && delete desc.value;
        if (!desc) {
            desc = { configurable: true, enumerable: true };
        }
        desc.get = function () {
            // if we already set ZoneAwarePromise, use patched one
            // otherwise return native one.
            return global[ZONE_AWARE_PROMISE] ? global[ZONE_AWARE_PROMISE] : global[symbolPromise];
        };
        desc.set = function (NewNativePromise) {
            if (NewNativePromise === ZoneAwarePromise) {
                // if the NewNativePromise is ZoneAwarePromise
                // save to global
                global[ZONE_AWARE_PROMISE] = NewNativePromise;
            }
            else {
                // if the NewNativePromise is not ZoneAwarePromise
                // for example: after load zone.js, some library just
                // set es6-promise to global, if we set it to global
                // directly, assertZonePatched will fail and angular
                // will not loaded, so we just set the NewNativePromise
                // to global[symbolPromise], so the result is just like
                // we load ES6 Promise before zone.js
                global[symbolPromise] = NewNativePromise;
                if (!NewNativePromise.prototype[symbolThen]) {
                    patchThen(NewNativePromise);
                }
                api.setNativePromise(NewNativePromise);
            }
        };
        ObjectDefineProperty(global, 'Promise', desc);
    }
    global['Promise'] = ZoneAwarePromise;
    const symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        const proto = Ctor.prototype;
        const prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        const originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            const wrapped = new ZoneAwarePromise((resolve, reject) => {
                originalThen.call(this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    function zoneify(fn) {
        return function () {
            let resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            let ctor = resultPromise.constructor;
            if (!ctor[symbolThenPatched]) {
                patchThen(ctor);
            }
            return resultPromise;
        };
    }
    if (NativePromise) {
        patchThen(NativePromise);
        const fetch = global['fetch'];
        if (typeof fetch == 'function') {
            global[api.symbol('fetch')] = fetch;
            global['fetch'] = zoneify(fetch);
        }
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2NvbW1vbi9wcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUN2RixNQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztJQUN2RSxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFFbkQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFRO1FBQ3RDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDckQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMxRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzlCLE1BQU0sc0JBQXNCLEdBQTJCLEVBQUUsQ0FBQztJQUMxRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FB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RUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDOUMsSUFBSSxhQUFhLFlBQVksZ0JBQWdCLEVBQUU7Z0JBQzdDLE9BQU8sYUFBYSxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQztZQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQjtZQUNELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLGFBQWEsRUFBRTtRQUNqQixTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7UUFDekIsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzlCLElBQUksT0FBTyxLQUFLLElBQUksVUFBVSxFQUFFO1lBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO1lBQ3BDLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDbEM7S0FDRjtJQUVELCtFQUErRTtJQUM5RSxPQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsc0JBQXNCLENBQUM7SUFDcEYsT0FBTyxnQkFBZ0IsQ0FBQztBQUMxQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdab25lQXdhcmVQcm9taXNlJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbiAgZnVuY3Rpb24gcmVhZGFibGVPYmplY3RUb1N0cmluZyhvYmo6IGFueSkge1xuICAgIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICByZXR1cm4gKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6ICcnKSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgIH1cblxuICAgIHJldHVybiBvYmogPyBvYmoudG9TdHJpbmcoKSA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICB9XG5cbiAgY29uc3QgX19zeW1ib2xfXyA9IGFwaS5zeW1ib2w7XG4gIGNvbnN0IF91bmNhdWdodFByb21pc2VFcnJvcnM6IFVuY2F1Z2h0UHJvbWlzZUVycm9yW10gPSBbXTtcbiAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgY29uc3Qgc3ltYm9sVGhlbiA9IF9fc3ltYm9sX18oJ3RoZW4nKTtcbiAgY29uc3QgY3JlYXRpb25UcmFjZSA9ICdfX2NyZWF0aW9uVHJhY2VfXyc7XG5cbiAgYXBpLm9uVW5oYW5kbGVkRXJyb3IgPSAoZTogYW55KSA9PiB7XG4gICAgaWYgKGFwaS5zaG93VW5jYXVnaHRFcnJvcigpKSB7XG4gICAgICBjb25zdCByZWplY3Rpb24gPSBlICYmIGUucmVqZWN0aW9uO1xuICAgICAgaWYgKHJlamVjdGlvbikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgJ1VuaGFuZGxlZCBQcm9taXNlIHJlamVjdGlvbjonLFxuICAgICAgICAgICAgcmVqZWN0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyByZWplY3Rpb24ubWVzc2FnZSA6IHJlamVjdGlvbixcbiAgICAgICAgICAgICc7IFpvbmU6JywgKDxab25lPmUuem9uZSkubmFtZSwgJzsgVGFzazonLCBlLnRhc2sgJiYgKDxUYXNrPmUudGFzaykuc291cmNlLFxuICAgICAgICAgICAgJzsgVmFsdWU6JywgcmVqZWN0aW9uLCByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5zdGFjayA6IHVuZGVmaW5lZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBhcGkubWljcm90YXNrRHJhaW5Eb25lID0gKCkgPT4ge1xuICAgIHdoaWxlIChfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgd2hpbGUgKF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHVuY2F1Z2h0UHJvbWlzZUVycm9yOiBVbmNhdWdodFByb21pc2VFcnJvciA9IF91bmNhdWdodFByb21pc2VFcnJvcnMuc2hpZnQoKSE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3Iuem9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgICAgIHRocm93IHVuY2F1Z2h0UHJvbWlzZUVycm9yO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MID0gX19zeW1ib2xfXygndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKTtcblxuICBmdW5jdGlvbiBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZTogYW55KSB7XG4gICAgYXBpLm9uVW5oYW5kbGVkRXJyb3IoZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoWm9uZSBhcyBhbnkpW1VOSEFORExFRF9QUk9NSVNFX1JFSkVDVElPTl9IQU5ETEVSX1NZTUJPTF07XG4gICAgICBpZiAoaGFuZGxlciAmJiB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XG4gIH1cblxuICBmdW5jdGlvbiBmb3J3YXJkUmVzb2x1dGlvbih2YWx1ZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmb3J3YXJkUmVqZWN0aW9uKHJlamVjdGlvbjogYW55KTogYW55IHtcbiAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZS5yZWplY3QocmVqZWN0aW9uKTtcbiAgfVxuXG4gIGNvbnN0IHN5bWJvbFN0YXRlOiBzdHJpbmcgPSBfX3N5bWJvbF9fKCdzdGF0ZScpO1xuICBjb25zdCBzeW1ib2xWYWx1ZTogc3RyaW5nID0gX19zeW1ib2xfXygndmFsdWUnKTtcbiAgY29uc3Qgc3ltYm9sRmluYWxseTogc3RyaW5nID0gX19zeW1ib2xfXygnZmluYWxseScpO1xuICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWU6IHN0cmluZyA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VWYWx1ZScpO1xuICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGU6IHN0cmluZyA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VTdGF0ZScpO1xuICBjb25zdCBzb3VyY2U6IHN0cmluZyA9ICdQcm9taXNlLnRoZW4nO1xuICBjb25zdCBVTlJFU09MVkVEOiBudWxsID0gbnVsbDtcbiAgY29uc3QgUkVTT0xWRUQgPSB0cnVlO1xuICBjb25zdCBSRUpFQ1RFRCA9IGZhbHNlO1xuICBjb25zdCBSRUpFQ1RFRF9OT19DQVRDSCA9IDA7XG5cbiAgZnVuY3Rpb24gbWFrZVJlc29sdmVyKHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55Piwgc3RhdGU6IGJvb2xlYW4pOiAodmFsdWU6IGFueSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuICh2KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBzdGF0ZSwgdik7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICB9XG4gICAgICAvLyBEbyBub3QgcmV0dXJuIHZhbHVlIG9yIHlvdSB3aWxsIGJyZWFrIHRoZSBQcm9taXNlIHNwZWMuXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG9uY2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgd2FzQ2FsbGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlcih3cmFwcGVkRnVuY3Rpb246IEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh3YXNDYWxsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2FzQ2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgd3JhcHBlZEZ1bmN0aW9uLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG4gIH07XG5cbiAgY29uc3QgVFlQRV9FUlJPUiA9ICdQcm9taXNlIHJlc29sdmVkIHdpdGggaXRzZWxmJztcbiAgY29uc3QgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCA9IF9fc3ltYm9sX18oJ2N1cnJlbnRUYXNrVHJhY2UnKTtcblxuICAvLyBQcm9taXNlIFJlc29sdXRpb25cbiAgZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UoXG4gICAgICBwcm9taXNlOiBab25lQXdhcmVQcm9taXNlPGFueT4sIHN0YXRlOiBib29sZWFuLCB2YWx1ZTogYW55KTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoVFlQRV9FUlJPUik7XG4gICAgfVxuICAgIGlmICgocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PT0gVU5SRVNPTFZFRCkge1xuICAgICAgLy8gc2hvdWxkIG9ubHkgZ2V0IHZhbHVlLnRoZW4gb25jZSBiYXNlZCBvbiBwcm9taXNlIHNwZWMuXG4gICAgICBsZXQgdGhlbjogYW55ID0gbnVsbDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoZW4gPSB2YWx1ZSAmJiB2YWx1ZS50aGVuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnIpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIC8vIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlICYmXG4gICAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sU3RhdGUpICYmIHZhbHVlLmhhc093blByb3BlcnR5KHN5bWJvbFZhbHVlKSAmJlxuICAgICAgICAgICh2YWx1ZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSAhPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICBjbGVhclJlamVjdGVkTm9DYXRjaCg8UHJvbWlzZTxhbnk+PnZhbHVlIGFzIGFueSk7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsICh2YWx1ZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSwgKHZhbHVlIGFzIGFueSlbc3ltYm9sVmFsdWVdKTtcbiAgICAgIH0gZWxzZSBpZiAoc3RhdGUgIT09IFJFSkVDVEVEICYmIHR5cGVvZiB0aGVuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdGhlbi5jYWxsKFxuICAgICAgICAgICAgICB2YWx1ZSwgb25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIHN0YXRlKSksXG4gICAgICAgICAgICAgIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBmYWxzZSkpKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgICAgfSkoKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPSBzdGF0ZTtcbiAgICAgICAgY29uc3QgcXVldWUgPSAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXTtcbiAgICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xWYWx1ZV0gPSB2YWx1ZTtcblxuICAgICAgICBpZiAoKHByb21pc2UgYXMgYW55KVtzeW1ib2xGaW5hbGx5XSA9PT0gc3ltYm9sRmluYWxseSkge1xuICAgICAgICAgIC8vIHRoZSBwcm9taXNlIGlzIGdlbmVyYXRlZCBieSBQcm9taXNlLnByb3RvdHlwZS5maW5hbGx5XG4gICAgICAgICAgaWYgKHN0YXRlID09PSBSRVNPTFZFRCkge1xuICAgICAgICAgICAgLy8gdGhlIHN0YXRlIGlzIHJlc29sdmVkLCBzaG91bGQgaWdub3JlIHRoZSB2YWx1ZVxuICAgICAgICAgICAgLy8gYW5kIHVzZSBwYXJlbnQgcHJvbWlzZSB2YWx1ZVxuICAgICAgICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPSAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFBhcmVudFByb21pc2VTdGF0ZV07XG4gICAgICAgICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXSA9IChwcm9taXNlIGFzIGFueSlbc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyByZWNvcmQgdGFzayBpbmZvcm1hdGlvbiBpbiB2YWx1ZSB3aGVuIGVycm9yIG9jY3Vycywgc28gd2UgY2FuXG4gICAgICAgIC8vIGRvIHNvbWUgYWRkaXRpb25hbCB3b3JrIHN1Y2ggYXMgcmVuZGVyIGxvbmdTdGFja1RyYWNlXG4gICAgICAgIGlmIChzdGF0ZSA9PT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICAgIC8vIGNoZWNrIGlmIGxvbmdTdGFja1RyYWNlWm9uZSBpcyBoZXJlXG4gICAgICAgICAgY29uc3QgdHJhY2UgPSBab25lLmN1cnJlbnRUYXNrICYmIFpvbmUuY3VycmVudFRhc2suZGF0YSAmJlxuICAgICAgICAgICAgICAoWm9uZS5jdXJyZW50VGFzay5kYXRhIGFzIGFueSlbY3JlYXRpb25UcmFjZV07XG4gICAgICAgICAgaWYgKHRyYWNlKSB7XG4gICAgICAgICAgICAvLyBvbmx5IGtlZXAgdGhlIGxvbmcgc3RhY2sgdHJhY2UgaW50byBlcnJvciB3aGVuIGluIGxvbmdTdGFja1RyYWNlWm9uZVxuICAgICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoXG4gICAgICAgICAgICAgICAgdmFsdWUsIENVUlJFTlRfVEFTS19UUkFDRV9TWU1CT0wsXG4gICAgICAgICAgICAgICAge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogZmFsc2UsIHdyaXRhYmxlOiB0cnVlLCB2YWx1ZTogdHJhY2V9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHF1ZXVlLmxlbmd0aDspIHtcbiAgICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdChwcm9taXNlLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdLCBxdWV1ZVtpKytdKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocXVldWUubGVuZ3RoID09IDAgJiYgc3RhdGUgPT0gUkVKRUNURUQpIHtcbiAgICAgICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9IFJFSkVDVEVEX05PX0NBVENIO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyB0cnkgdG8gcHJpbnQgbW9yZSByZWFkYWJsZSBlcnJvciBsb2dcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAnVW5jYXVnaHQgKGluIHByb21pc2UpOiAnICsgcmVhZGFibGVPYmplY3RUb1N0cmluZyh2YWx1ZSkgK1xuICAgICAgICAgICAgICAgICh2YWx1ZSAmJiB2YWx1ZS5zdGFjayA/ICdcXG4nICsgdmFsdWUuc3RhY2sgOiAnJykpO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgY29uc3QgZXJyb3I6IFVuY2F1Z2h0UHJvbWlzZUVycm9yID0gZXJyO1xuICAgICAgICAgICAgZXJyb3IucmVqZWN0aW9uID0gdmFsdWU7XG4gICAgICAgICAgICBlcnJvci5wcm9taXNlID0gcHJvbWlzZTtcbiAgICAgICAgICAgIGVycm9yLnpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICBlcnJvci50YXNrID0gWm9uZS5jdXJyZW50VGFzayE7XG4gICAgICAgICAgICBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLnB1c2goZXJyb3IpO1xuICAgICAgICAgICAgYXBpLnNjaGVkdWxlTWljcm9UYXNrKCk7ICAvLyB0byBtYWtlIHN1cmUgdGhhdCBpdCBpcyBydW5uaW5nXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vIFJlc29sdmluZyBhbiBhbHJlYWR5IHJlc29sdmVkIHByb21pc2UgaXMgYSBub29wLlxuICAgIHJldHVybiBwcm9taXNlO1xuICB9XG5cbiAgY29uc3QgUkVKRUNUSU9OX0hBTkRMRURfSEFORExFUiA9IF9fc3ltYm9sX18oJ3JlamVjdGlvbkhhbmRsZWRIYW5kbGVyJyk7XG4gIGZ1bmN0aW9uIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55Pik6IHZvaWQge1xuICAgIGlmICgocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PT0gUkVKRUNURURfTk9fQ0FUQ0gpIHtcbiAgICAgIC8vIGlmIHRoZSBwcm9taXNlIGlzIHJlamVjdGVkIG5vIGNhdGNoIHN0YXR1c1xuICAgICAgLy8gYW5kIHF1ZXVlLmxlbmd0aCA+IDAsIG1lYW5zIHRoZXJlIGlzIGEgZXJyb3IgaGFuZGxlclxuICAgICAgLy8gaGVyZSB0byBoYW5kbGUgdGhlIHJlamVjdGVkIHByb21pc2UsIHdlIHNob3VsZCB0cmlnZ2VyXG4gICAgICAvLyB3aW5kb3dzLnJlamVjdGlvbmhhbmRsZWQgZXZlbnRIYW5kbGVyIG9yIG5vZGVqcyByZWplY3Rpb25IYW5kbGVkXG4gICAgICAvLyBldmVudEhhbmRsZXJcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoWm9uZSBhcyBhbnkpW1JFSkVDVElPTl9IQU5ETEVEX0hBTkRMRVJdO1xuICAgICAgICBpZiAoaGFuZGxlciAmJiB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCB7cmVqZWN0aW9uOiAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXSwgcHJvbWlzZTogcHJvbWlzZX0pO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIH1cbiAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gUkVKRUNURUQ7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHByb21pc2UgPT09IF91bmNhdWdodFByb21pc2VFcnJvcnNbaV0ucHJvbWlzZSkge1xuICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMuc3BsaWNlKGksIDEpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVSZXNvbHZlT3JSZWplY3Q8UiwgVTEsIFUyPihcbiAgICAgIHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55Piwgem9uZTogQW1iaWVudFpvbmUsIGNoYWluUHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+LFxuICAgICAgb25GdWxmaWxsZWQ/OiAoKHZhbHVlOiBSKSA9PiBVMSl8bnVsbHx1bmRlZmluZWQsXG4gICAgICBvblJlamVjdGVkPzogKChlcnJvcjogYW55KSA9PiBVMil8bnVsbHx1bmRlZmluZWQpOiB2b2lkIHtcbiAgICBjbGVhclJlamVjdGVkTm9DYXRjaChwcm9taXNlKTtcbiAgICBjb25zdCBwcm9taXNlU3RhdGUgPSAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXTtcbiAgICBjb25zdCBkZWxlZ2F0ZSA9IHByb21pc2VTdGF0ZSA/XG4gICAgICAgICh0eXBlb2Ygb25GdWxmaWxsZWQgPT09ICdmdW5jdGlvbicpID8gb25GdWxmaWxsZWQgOiBmb3J3YXJkUmVzb2x1dGlvbiA6XG4gICAgICAgICh0eXBlb2Ygb25SZWplY3RlZCA9PT0gJ2Z1bmN0aW9uJykgPyBvblJlamVjdGVkIDogZm9yd2FyZFJlamVjdGlvbjtcbiAgICB6b25lLnNjaGVkdWxlTWljcm9UYXNrKHNvdXJjZSwgKCkgPT4ge1xuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgcGFyZW50UHJvbWlzZVZhbHVlID0gKHByb21pc2UgYXMgYW55KVtzeW1ib2xWYWx1ZV07XG4gICAgICAgIGNvbnN0IGlzRmluYWxseVByb21pc2UgPVxuICAgICAgICAgICAgY2hhaW5Qcm9taXNlICYmIHN5bWJvbEZpbmFsbHkgPT09IChjaGFpblByb21pc2UgYXMgYW55KVtzeW1ib2xGaW5hbGx5XTtcbiAgICAgICAgaWYgKGlzRmluYWxseVByb21pc2UpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgcHJvbWlzZSBpcyBnZW5lcmF0ZWQgZnJvbSBmaW5hbGx5IGNhbGwsIGtlZXAgcGFyZW50IHByb21pc2UncyBzdGF0ZSBhbmQgdmFsdWVcbiAgICAgICAgICAoY2hhaW5Qcm9taXNlIGFzIGFueSlbc3ltYm9sUGFyZW50UHJvbWlzZVZhbHVlXSA9IHBhcmVudFByb21pc2VWYWx1ZTtcbiAgICAgICAgICAoY2hhaW5Qcm9taXNlIGFzIGFueSlbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXSA9IHByb21pc2VTdGF0ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBzaG91bGQgbm90IHBhc3MgdmFsdWUgdG8gZmluYWxseSBjYWxsYmFja1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHpvbmUucnVuKFxuICAgICAgICAgICAgZGVsZWdhdGUsIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGlzRmluYWxseVByb21pc2UgJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZWplY3Rpb24gJiYgZGVsZWdhdGUgIT09IGZvcndhcmRSZXNvbHV0aW9uID9cbiAgICAgICAgICAgICAgICBbXSA6XG4gICAgICAgICAgICAgICAgW3BhcmVudFByb21pc2VWYWx1ZV0pO1xuICAgICAgICByZXNvbHZlUHJvbWlzZShjaGFpblByb21pc2UsIHRydWUsIHZhbHVlKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIC8vIGlmIGVycm9yIG9jY3Vycywgc2hvdWxkIGFsd2F5cyByZXR1cm4gdGhpcyBlcnJvclxuICAgICAgICByZXNvbHZlUHJvbWlzZShjaGFpblByb21pc2UsIGZhbHNlLCBlcnJvcik7XG4gICAgICB9XG4gICAgfSwgY2hhaW5Qcm9taXNlIGFzIFRhc2tEYXRhKTtcbiAgfVxuXG4gIGNvbnN0IFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkcgPSAnZnVuY3Rpb24gWm9uZUF3YXJlUHJvbWlzZSgpIHsgW25hdGl2ZSBjb2RlXSB9JztcblxuICBjbGFzcyBab25lQXdhcmVQcm9taXNlPFI+IGltcGxlbWVudHMgUHJvbWlzZTxSPiB7XG4gICAgc3RhdGljIHRvU3RyaW5nKCkge1xuICAgICAgcmV0dXJuIFpPTkVfQVdBUkVfUFJPTUlTRV9UT19TVFJJTkc7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlc29sdmU8Uj4odmFsdWU6IFIpOiBQcm9taXNlPFI+IHtcbiAgICAgIHJldHVybiByZXNvbHZlUHJvbWlzZSg8Wm9uZUF3YXJlUHJvbWlzZTxSPj5uZXcgdGhpcyhudWxsIGFzIGFueSksIFJFU09MVkVELCB2YWx1ZSk7XG4gICAgfVxuXG4gICAgc3RhdGljIHJlamVjdDxVPihlcnJvcjogVSk6IFByb21pc2U8VT4ge1xuICAgICAgcmV0dXJuIHJlc29sdmVQcm9taXNlKDxab25lQXdhcmVQcm9taXNlPFU+Pm5ldyB0aGlzKG51bGwgYXMgYW55KSwgUkVKRUNURUQsIGVycm9yKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmFjZTxSPih2YWx1ZXM6IFByb21pc2VMaWtlPGFueT5bXSk6IFByb21pc2U8Uj4ge1xuICAgICAgbGV0IHJlc29sdmU6ICh2OiBhbnkpID0+IHZvaWQ7XG4gICAgICBsZXQgcmVqZWN0OiAodjogYW55KSA9PiB2b2lkO1xuICAgICAgbGV0IHByb21pc2U6IGFueSA9IG5ldyB0aGlzKChyZXMsIHJlaikgPT4ge1xuICAgICAgICByZXNvbHZlID0gcmVzO1xuICAgICAgICByZWplY3QgPSByZWo7XG4gICAgICB9KTtcbiAgICAgIGZ1bmN0aW9uIG9uUmVzb2x2ZSh2YWx1ZTogYW55KSB7XG4gICAgICAgIHJlc29sdmUodmFsdWUpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gb25SZWplY3QoZXJyb3I6IGFueSkge1xuICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIGFsbDxSPih2YWx1ZXM6IGFueSk6IFByb21pc2U8Uj4ge1xuICAgICAgbGV0IHJlc29sdmU6ICh2OiBhbnkpID0+IHZvaWQ7XG4gICAgICBsZXQgcmVqZWN0OiAodjogYW55KSA9PiB2b2lkO1xuICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpczxSPigocmVzLCByZWopID0+IHtcbiAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFN0YXJ0IGF0IDIgdG8gcHJldmVudCBwcmVtYXR1cmVseSByZXNvbHZpbmcgaWYgLnRoZW4gaXMgY2FsbGVkIGltbWVkaWF0ZWx5LlxuICAgICAgbGV0IHVucmVzb2x2ZWRDb3VudCA9IDI7XG4gICAgICBsZXQgdmFsdWVJbmRleCA9IDA7XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkVmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgIGlmICghaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJWYWx1ZUluZGV4ID0gdmFsdWVJbmRleDtcbiAgICAgICAgdmFsdWUudGhlbigodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSEocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgcmVqZWN0ISk7XG5cbiAgICAgICAgdW5yZXNvbHZlZENvdW50Kys7XG4gICAgICAgIHZhbHVlSW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSB0aGUgdW5yZXNvbHZlZENvdW50IHplcm8tYmFzZWQgYWdhaW4uXG4gICAgICB1bnJlc29sdmVkQ291bnQgLT0gMjtcblxuICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXNvbHZlIShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBleGVjdXRvcjpcbiAgICAgICAgICAgIChyZXNvbHZlOiAodmFsdWU/OiBSfFByb21pc2VMaWtlPFI+KSA9PiB2b2lkLCByZWplY3Q6IChlcnJvcj86IGFueSkgPT4gdm9pZCkgPT4gdm9pZCkge1xuICAgICAgY29uc3QgcHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxSPiA9IHRoaXM7XG4gICAgICBpZiAoIShwcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IGJlIGFuIGluc3RhbmNlb2YgUHJvbWlzZS4nKTtcbiAgICAgIH1cbiAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gVU5SRVNPTFZFRDtcbiAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdID0gW107ICAvLyBxdWV1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4ZWN1dG9yICYmIGV4ZWN1dG9yKG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRVNPTFZFRCksIG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRUpFQ1RFRCkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBnZXRbU3ltYm9sLnRvU3RyaW5nVGFnXSgpIHtcbiAgICAgIHJldHVybiAnUHJvbWlzZScgYXMgYW55O1xuICAgIH1cblxuICAgIHRoZW48VFJlc3VsdDEgPSBSLCBUUmVzdWx0MiA9IG5ldmVyPihcbiAgICAgICAgb25GdWxmaWxsZWQ/OiAoKHZhbHVlOiBSKSA9PiBUUmVzdWx0MSB8IFByb21pc2VMaWtlPFRSZXN1bHQxPil8dW5kZWZpbmVkfG51bGwsXG4gICAgICAgIG9uUmVqZWN0ZWQ/OiAoKHJlYXNvbjogYW55KSA9PiBUUmVzdWx0MiB8IFByb21pc2VMaWtlPFRSZXN1bHQyPil8dW5kZWZpbmVkfFxuICAgICAgICBudWxsKTogUHJvbWlzZTxUUmVzdWx0MXxUUmVzdWx0Mj4ge1xuICAgICAgY29uc3QgY2hhaW5Qcm9taXNlOiBQcm9taXNlPFRSZXN1bHQxfFRSZXN1bHQyPiA9XG4gICAgICAgICAgbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBab25lQXdhcmVQcm9taXNlKShudWxsIGFzIGFueSk7XG4gICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgaWYgKCh0aGlzIGFzIGFueSlbc3ltYm9sU3RhdGVdID09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgKDxhbnlbXT4odGhpcyBhcyBhbnkpW3N5bWJvbFZhbHVlXSkucHVzaCh6b25lLCBjaGFpblByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHRoaXMsIHpvbmUsIGNoYWluUHJvbWlzZSBhcyBhbnksIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgfVxuXG4gICAgY2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdCB8IFByb21pc2VMaWtlPFRSZXN1bHQ+KXx1bmRlZmluZWR8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsKTogUHJvbWlzZTxSfFRSZXN1bHQ+IHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgfVxuXG4gICAgZmluYWxseTxVPihvbkZpbmFsbHk/OiAoKSA9PiBVIHwgUHJvbWlzZUxpa2U8VT4pOiBQcm9taXNlPFI+IHtcbiAgICAgIGNvbnN0IGNoYWluUHJvbWlzZTogUHJvbWlzZTxSfG5ldmVyPiA9XG4gICAgICAgICAgbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBab25lQXdhcmVQcm9taXNlKShudWxsIGFzIGFueSk7XG4gICAgICAoY2hhaW5Qcm9taXNlIGFzIGFueSlbc3ltYm9sRmluYWxseV0gPSBzeW1ib2xGaW5hbGx5O1xuICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGlmICgodGhpcyBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICg8YW55W10+KHRoaXMgYXMgYW55KVtzeW1ib2xWYWx1ZV0pLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UgYXMgYW55LCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW5Qcm9taXNlO1xuICAgIH1cbiAgfVxuICAvLyBQcm90ZWN0IGFnYWluc3QgYWdncmVzc2l2ZSBvcHRpbWl6ZXJzIGRyb3BwaW5nIHNlZW1pbmdseSB1bnVzZWQgcHJvcGVydGllcy5cbiAgLy8gRS5nLiBDbG9zdXJlIENvbXBpbGVyIGluIGFkdmFuY2VkIG1vZGUuXG4gIFpvbmVBd2FyZVByb21pc2VbJ3Jlc29sdmUnXSA9IFpvbmVBd2FyZVByb21pc2UucmVzb2x2ZTtcbiAgWm9uZUF3YXJlUHJvbWlzZVsncmVqZWN0J10gPSBab25lQXdhcmVQcm9taXNlLnJlamVjdDtcbiAgWm9uZUF3YXJlUHJvbWlzZVsncmFjZSddID0gWm9uZUF3YXJlUHJvbWlzZS5yYWNlO1xuICBab25lQXdhcmVQcm9taXNlWydhbGwnXSA9IFpvbmVBd2FyZVByb21pc2UuYWxsO1xuXG4gIGNvbnN0IE5hdGl2ZVByb21pc2UgPSBnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBnbG9iYWxbJ1Byb21pc2UnXTtcbiAgY29uc3QgWk9ORV9BV0FSRV9QUk9NSVNFID0gWm9uZS5fX3N5bWJvbF9fKCdab25lQXdhcmVQcm9taXNlJyk7XG5cbiAgbGV0IGRlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2xvYmFsLCAnUHJvbWlzZScpO1xuICBpZiAoIWRlc2MgfHwgZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICBkZXNjICYmIGRlbGV0ZSBkZXNjLndyaXRhYmxlO1xuICAgIGRlc2MgJiYgZGVsZXRlIGRlc2MudmFsdWU7XG4gICAgaWYgKCFkZXNjKSB7XG4gICAgICBkZXNjID0ge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZX07XG4gICAgfVxuICAgIGRlc2MuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBpZiB3ZSBhbHJlYWR5IHNldCBab25lQXdhcmVQcm9taXNlLCB1c2UgcGF0Y2hlZCBvbmVcbiAgICAgIC8vIG90aGVyd2lzZSByZXR1cm4gbmF0aXZlIG9uZS5cbiAgICAgIHJldHVybiBnbG9iYWxbWk9ORV9BV0FSRV9QUk9NSVNFXSA/IGdsb2JhbFtaT05FX0FXQVJFX1BST01JU0VdIDogZ2xvYmFsW3N5bWJvbFByb21pc2VdO1xuICAgIH07XG4gICAgZGVzYy5zZXQgPSBmdW5jdGlvbihOZXdOYXRpdmVQcm9taXNlKSB7XG4gICAgICBpZiAoTmV3TmF0aXZlUHJvbWlzZSA9PT0gWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAvLyBpZiB0aGUgTmV3TmF0aXZlUHJvbWlzZSBpcyBab25lQXdhcmVQcm9taXNlXG4gICAgICAgIC8vIHNhdmUgdG8gZ2xvYmFsXG4gICAgICAgIGdsb2JhbFtaT05FX0FXQVJFX1BST01JU0VdID0gTmV3TmF0aXZlUHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHRoZSBOZXdOYXRpdmVQcm9taXNlIGlzIG5vdCBab25lQXdhcmVQcm9taXNlXG4gICAgICAgIC8vIGZvciBleGFtcGxlOiBhZnRlciBsb2FkIHpvbmUuanMsIHNvbWUgbGlicmFyeSBqdXN0XG4gICAgICAgIC8vIHNldCBlczYtcHJvbWlzZSB0byBnbG9iYWwsIGlmIHdlIHNldCBpdCB0byBnbG9iYWxcbiAgICAgICAgLy8gZGlyZWN0bHksIGFzc2VydFpvbmVQYXRjaGVkIHdpbGwgZmFpbCBhbmQgYW5ndWxhclxuICAgICAgICAvLyB3aWxsIG5vdCBsb2FkZWQsIHNvIHdlIGp1c3Qgc2V0IHRoZSBOZXdOYXRpdmVQcm9taXNlXG4gICAgICAgIC8vIHRvIGdsb2JhbFtzeW1ib2xQcm9taXNlXSwgc28gdGhlIHJlc3VsdCBpcyBqdXN0IGxpa2VcbiAgICAgICAgLy8gd2UgbG9hZCBFUzYgUHJvbWlzZSBiZWZvcmUgem9uZS5qc1xuICAgICAgICBnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBOZXdOYXRpdmVQcm9taXNlO1xuICAgICAgICBpZiAoIU5ld05hdGl2ZVByb21pc2UucHJvdG90eXBlW3N5bWJvbFRoZW5dKSB7XG4gICAgICAgICAgcGF0Y2hUaGVuKE5ld05hdGl2ZVByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIGFwaS5zZXROYXRpdmVQcm9taXNlKE5ld05hdGl2ZVByb21pc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShnbG9iYWwsICdQcm9taXNlJywgZGVzYyk7XG4gIH1cblxuICBnbG9iYWxbJ1Byb21pc2UnXSA9IFpvbmVBd2FyZVByb21pc2U7XG5cbiAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBfX3N5bWJvbF9fKCd0aGVuUGF0Y2hlZCcpO1xuXG4gIGZ1bmN0aW9uIHBhdGNoVGhlbihDdG9yOiBGdW5jdGlvbikge1xuICAgIGNvbnN0IHByb3RvID0gQ3Rvci5wcm90b3R5cGU7XG5cbiAgICBjb25zdCBwcm9wID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCAndGhlbicpO1xuICAgIGlmIChwcm9wICYmIChwcm9wLndyaXRhYmxlID09PSBmYWxzZSB8fCAhcHJvcC5jb25maWd1cmFibGUpKSB7XG4gICAgICAvLyBjaGVjayBDdG9yLnByb3RvdHlwZS50aGVuIHByb3BlcnR5RGVzY3JpcHRvciBpcyB3cml0YWJsZSBvciBub3RcbiAgICAgIC8vIGluIG1ldGVvciBlbnYsIHdyaXRhYmxlIGlzIGZhbHNlLCB3ZSBzaG91bGQgaWdub3JlIHN1Y2ggY2FzZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsVGhlbiA9IHByb3RvLnRoZW47XG4gICAgLy8gS2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgIHByb3RvW3N5bWJvbFRoZW5dID0gb3JpZ2luYWxUaGVuO1xuXG4gICAgQ3Rvci5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uUmVzb2x2ZTogYW55LCBvblJlamVjdDogYW55KSB7XG4gICAgICBjb25zdCB3cmFwcGVkID0gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBvcmlnaW5hbFRoZW4uY2FsbCh0aGlzLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gd3JhcHBlZC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgIH07XG4gICAgKEN0b3IgYXMgYW55KVtzeW1ib2xUaGVuUGF0Y2hlZF0gPSB0cnVlO1xuICB9XG5cbiAgYXBpLnBhdGNoVGhlbiA9IHBhdGNoVGhlbjtcblxuICBmdW5jdGlvbiB6b25laWZ5KGZuOiBGdW5jdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCByZXN1bHRQcm9taXNlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmIChyZXN1bHRQcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIGxldCBjdG9yID0gcmVzdWx0UHJvbWlzZS5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmICghY3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0pIHtcbiAgICAgICAgcGF0Y2hUaGVuKGN0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChOYXRpdmVQcm9taXNlKSB7XG4gICAgcGF0Y2hUaGVuKE5hdGl2ZVByb21pc2UpO1xuICAgIGNvbnN0IGZldGNoID0gZ2xvYmFsWydmZXRjaCddO1xuICAgIGlmICh0eXBlb2YgZmV0Y2ggPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgZ2xvYmFsW2FwaS5zeW1ib2woJ2ZldGNoJyldID0gZmV0Y2g7XG4gICAgICBnbG9iYWxbJ2ZldGNoJ10gPSB6b25laWZ5KGZldGNoKTtcbiAgICB9XG4gIH1cblxuICAvLyBUaGlzIGlzIG5vdCBwYXJ0IG9mIHB1YmxpYyBBUEksIGJ1dCBpdCBpcyB1c2VmdWwgZm9yIHRlc3RzLCBzbyB3ZSBleHBvc2UgaXQuXG4gIChQcm9taXNlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCd1bmNhdWdodFByb21pc2VFcnJvcnMnKV0gPSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzO1xuICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZTtcbn0pO1xuIl19