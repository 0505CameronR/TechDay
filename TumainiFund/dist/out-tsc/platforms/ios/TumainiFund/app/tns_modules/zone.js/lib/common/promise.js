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
                promise && (promise = null || resolve(value));
            }
            function onReject(error) {
                promise && (promise = null || reject(error));
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
    }
    // This is not part of public API, but it is useful for tests, so we expose it.
    Promise[Zone.__symbol__('uncaughtPromiseErrors')] = _uncaughtPromiseErrors;
    return ZoneAwarePromise;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2NvbW1vbi9wcm9taXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVdBLElBQUksQ0FBQyxZQUFZLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUN2RixNQUFNLDhCQUE4QixHQUFHLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztJQUN2RSxNQUFNLG9CQUFvQixHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7SUFFbkQsU0FBUyxzQkFBc0IsQ0FBQyxHQUFRO1FBQ3RDLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxRQUFRLEtBQUssTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEVBQUU7WUFDckQsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLFdBQVcsSUFBSSxHQUFHLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQztZQUMxRCxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2xFO1FBRUQsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDO0lBQzlCLE1BQU0sc0JBQXNCLEdBQTJCLEVBQUUsQ0FBQztJQUMxRCxNQUFNLGFBQWEsR0FBRyxVQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFD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Q0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQzlDLElBQUksYUFBYSxZQUFZLGdCQUFnQixFQUFFO2dCQUM3QyxPQUFPLGFBQWEsQ0FBQzthQUN0QjtZQUNELElBQUksSUFBSSxHQUFHLGFBQWEsQ0FBQyxXQUFXLENBQUM7WUFDckMsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxFQUFFO2dCQUM1QixTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDakI7WUFDRCxPQUFPLGFBQWEsQ0FBQztRQUN2QixDQUFDLENBQUM7SUFDSixDQUFDO0lBRUQsSUFBSSxhQUFhLEVBQUU7UUFDakIsU0FBUyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQzFCO0lBRUQsK0VBQStFO0lBQzlFLE9BQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHVCQUF1QixDQUFDLENBQUMsR0FBRyxzQkFBc0IsQ0FBQztJQUNwRixPQUFPLGdCQUFnQixDQUFDO0FBQzFCLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW50ZXJmYWNlIFByb21pc2U8VD4ge1xuICBmaW5hbGx5PFU+KG9uRmluYWxseT86ICgpID0+IFUgfCBQcm9taXNlTGlrZTxVPik6IFByb21pc2U8VD47XG59XG5cblpvbmUuX19sb2FkX3BhdGNoKCdab25lQXdhcmVQcm9taXNlJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgY29uc3QgT2JqZWN0RGVmaW5lUHJvcGVydHkgPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5cbiAgZnVuY3Rpb24gcmVhZGFibGVPYmplY3RUb1N0cmluZyhvYmo6IGFueSkge1xuICAgIGlmIChvYmogJiYgb2JqLnRvU3RyaW5nID09PSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKSB7XG4gICAgICBjb25zdCBjbGFzc05hbWUgPSBvYmouY29uc3RydWN0b3IgJiYgb2JqLmNvbnN0cnVjdG9yLm5hbWU7XG4gICAgICByZXR1cm4gKGNsYXNzTmFtZSA/IGNsYXNzTmFtZSA6ICcnKSArICc6ICcgKyBKU09OLnN0cmluZ2lmeShvYmopO1xuICAgIH1cblxuICAgIHJldHVybiBvYmogPyBvYmoudG9TdHJpbmcoKSA6IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopO1xuICB9XG5cbiAgY29uc3QgX19zeW1ib2xfXyA9IGFwaS5zeW1ib2w7XG4gIGNvbnN0IF91bmNhdWdodFByb21pc2VFcnJvcnM6IFVuY2F1Z2h0UHJvbWlzZUVycm9yW10gPSBbXTtcbiAgY29uc3Qgc3ltYm9sUHJvbWlzZSA9IF9fc3ltYm9sX18oJ1Byb21pc2UnKTtcbiAgY29uc3Qgc3ltYm9sVGhlbiA9IF9fc3ltYm9sX18oJ3RoZW4nKTtcbiAgY29uc3QgY3JlYXRpb25UcmFjZSA9ICdfX2NyZWF0aW9uVHJhY2VfXyc7XG5cbiAgYXBpLm9uVW5oYW5kbGVkRXJyb3IgPSAoZTogYW55KSA9PiB7XG4gICAgaWYgKGFwaS5zaG93VW5jYXVnaHRFcnJvcigpKSB7XG4gICAgICBjb25zdCByZWplY3Rpb24gPSBlICYmIGUucmVqZWN0aW9uO1xuICAgICAgaWYgKHJlamVjdGlvbikge1xuICAgICAgICBjb25zb2xlLmVycm9yKFxuICAgICAgICAgICAgJ1VuaGFuZGxlZCBQcm9taXNlIHJlamVjdGlvbjonLFxuICAgICAgICAgICAgcmVqZWN0aW9uIGluc3RhbmNlb2YgRXJyb3IgPyByZWplY3Rpb24ubWVzc2FnZSA6IHJlamVjdGlvbixcbiAgICAgICAgICAgICc7IFpvbmU6JywgKDxab25lPmUuem9uZSkubmFtZSwgJzsgVGFzazonLCBlLnRhc2sgJiYgKDxUYXNrPmUudGFzaykuc291cmNlLFxuICAgICAgICAgICAgJzsgVmFsdWU6JywgcmVqZWN0aW9uLCByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5zdGFjayA6IHVuZGVmaW5lZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBhcGkubWljcm90YXNrRHJhaW5Eb25lID0gKCkgPT4ge1xuICAgIHdoaWxlIChfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aCkge1xuICAgICAgd2hpbGUgKF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoKSB7XG4gICAgICAgIGNvbnN0IHVuY2F1Z2h0UHJvbWlzZUVycm9yOiBVbmNhdWdodFByb21pc2VFcnJvciA9IF91bmNhdWdodFByb21pc2VFcnJvcnMuc2hpZnQoKSE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdW5jYXVnaHRQcm9taXNlRXJyb3Iuem9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgICAgIHRocm93IHVuY2F1Z2h0UHJvbWlzZUVycm9yO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbihlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgY29uc3QgVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MID0gX19zeW1ib2xfXygndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKTtcblxuICBmdW5jdGlvbiBoYW5kbGVVbmhhbmRsZWRSZWplY3Rpb24oZTogYW55KSB7XG4gICAgYXBpLm9uVW5oYW5kbGVkRXJyb3IoZSk7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IGhhbmRsZXIgPSAoWm9uZSBhcyBhbnkpW1VOSEFORExFRF9QUk9NSVNFX1JFSkVDVElPTl9IQU5ETEVSX1NZTUJPTF07XG4gICAgICBpZiAoaGFuZGxlciAmJiB0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgZSk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gaXNUaGVuYWJsZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlICYmIHZhbHVlLnRoZW47XG4gIH1cblxuICBmdW5jdGlvbiBmb3J3YXJkUmVzb2x1dGlvbih2YWx1ZTogYW55KTogYW55IHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiBmb3J3YXJkUmVqZWN0aW9uKHJlamVjdGlvbjogYW55KTogYW55IHtcbiAgICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZS5yZWplY3QocmVqZWN0aW9uKTtcbiAgfVxuXG4gIGNvbnN0IHN5bWJvbFN0YXRlOiBzdHJpbmcgPSBfX3N5bWJvbF9fKCdzdGF0ZScpO1xuICBjb25zdCBzeW1ib2xWYWx1ZTogc3RyaW5nID0gX19zeW1ib2xfXygndmFsdWUnKTtcbiAgY29uc3Qgc3ltYm9sRmluYWxseTogc3RyaW5nID0gX19zeW1ib2xfXygnZmluYWxseScpO1xuICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWU6IHN0cmluZyA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VWYWx1ZScpO1xuICBjb25zdCBzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGU6IHN0cmluZyA9IF9fc3ltYm9sX18oJ3BhcmVudFByb21pc2VTdGF0ZScpO1xuICBjb25zdCBzb3VyY2U6IHN0cmluZyA9ICdQcm9taXNlLnRoZW4nO1xuICBjb25zdCBVTlJFU09MVkVEOiBudWxsID0gbnVsbDtcbiAgY29uc3QgUkVTT0xWRUQgPSB0cnVlO1xuICBjb25zdCBSRUpFQ1RFRCA9IGZhbHNlO1xuICBjb25zdCBSRUpFQ1RFRF9OT19DQVRDSCA9IDA7XG5cbiAgZnVuY3Rpb24gbWFrZVJlc29sdmVyKHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55Piwgc3RhdGU6IGJvb2xlYW4pOiAodmFsdWU6IGFueSkgPT4gdm9pZCB7XG4gICAgcmV0dXJuICh2KSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBzdGF0ZSwgdik7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICB9XG4gICAgICAvLyBEbyBub3QgcmV0dXJuIHZhbHVlIG9yIHlvdSB3aWxsIGJyZWFrIHRoZSBQcm9taXNlIHNwZWMuXG4gICAgfTtcbiAgfVxuXG4gIGNvbnN0IG9uY2UgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgd2FzQ2FsbGVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlcih3cmFwcGVkRnVuY3Rpb246IEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh3YXNDYWxsZWQpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgd2FzQ2FsbGVkID0gdHJ1ZTtcbiAgICAgICAgd3JhcHBlZEZ1bmN0aW9uLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH07XG4gIH07XG5cbiAgY29uc3QgVFlQRV9FUlJPUiA9ICdQcm9taXNlIHJlc29sdmVkIHdpdGggaXRzZWxmJztcbiAgY29uc3QgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCA9IF9fc3ltYm9sX18oJ2N1cnJlbnRUYXNrVHJhY2UnKTtcblxuICAvLyBQcm9taXNlIFJlc29sdXRpb25cbiAgZnVuY3Rpb24gcmVzb2x2ZVByb21pc2UoXG4gICAgICBwcm9taXNlOiBab25lQXdhcmVQcm9taXNlPGFueT4sIHN0YXRlOiBib29sZWFuLCB2YWx1ZTogYW55KTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+IHtcbiAgICBjb25zdCBvbmNlV3JhcHBlciA9IG9uY2UoKTtcbiAgICBpZiAocHJvbWlzZSA9PT0gdmFsdWUpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoVFlQRV9FUlJPUik7XG4gICAgfVxuICAgIGlmICgocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PT0gVU5SRVNPTFZFRCkge1xuICAgICAgLy8gc2hvdWxkIG9ubHkgZ2V0IHZhbHVlLnRoZW4gb25jZSBiYXNlZCBvbiBwcm9taXNlIHNwZWMuXG4gICAgICBsZXQgdGhlbjogYW55ID0gbnVsbDtcbiAgICAgIHRyeSB7XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRoZW4gPSB2YWx1ZSAmJiB2YWx1ZS50aGVuO1xuICAgICAgICB9XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgb25jZVdyYXBwZXIoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnIpO1xuICAgICAgICB9KSgpO1xuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIC8vIGlmICh2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpIHtcbiAgICAgIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdmFsdWUgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlICYmXG4gICAgICAgICAgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sU3RhdGUpICYmIHZhbHVlLmhhc093blByb3BlcnR5KHN5bWJvbFZhbHVlKSAmJlxuICAgICAgICAgICh2YWx1ZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSAhPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICBjbGVhclJlamVjdGVkTm9DYXRjaCg8UHJvbWlzZTxhbnk+PnZhbHVlKTtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgKHZhbHVlIGFzIGFueSlbc3ltYm9sU3RhdGVdLCAodmFsdWUgYXMgYW55KVtzeW1ib2xWYWx1ZV0pO1xuICAgICAgfSBlbHNlIGlmIChzdGF0ZSAhPT0gUkVKRUNURUQgJiYgdHlwZW9mIHRoZW4gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB0aGVuLmNhbGwoXG4gICAgICAgICAgICAgIHZhbHVlLCBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgc3RhdGUpKSxcbiAgICAgICAgICAgICAgb25jZVdyYXBwZXIobWFrZVJlc29sdmVyKHByb21pc2UsIGZhbHNlKSkpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBvbmNlV3JhcHBlcigoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgICAgICB9KSgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9IHN0YXRlO1xuICAgICAgICBjb25zdCBxdWV1ZSA9IChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdO1xuICAgICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXSA9IHZhbHVlO1xuXG4gICAgICAgIGlmICgocHJvbWlzZSBhcyBhbnkpW3N5bWJvbEZpbmFsbHldID09PSBzeW1ib2xGaW5hbGx5KSB7XG4gICAgICAgICAgLy8gdGhlIHByb21pc2UgaXMgZ2VuZXJhdGVkIGJ5IFByb21pc2UucHJvdG90eXBlLmZpbmFsbHlcbiAgICAgICAgICBpZiAoc3RhdGUgPT09IFJFU09MVkVEKSB7XG4gICAgICAgICAgICAvLyB0aGUgc3RhdGUgaXMgcmVzb2x2ZWQsIHNob3VsZCBpZ25vcmUgdGhlIHZhbHVlXG4gICAgICAgICAgICAvLyBhbmQgdXNlIHBhcmVudCBwcm9taXNlIHZhbHVlXG4gICAgICAgICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9IChwcm9taXNlIGFzIGFueSlbc3ltYm9sUGFyZW50UHJvbWlzZVN0YXRlXTtcbiAgICAgICAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdID0gKHByb21pc2UgYXMgYW55KVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHJlY29yZCB0YXNrIGluZm9ybWF0aW9uIGluIHZhbHVlIHdoZW4gZXJyb3Igb2NjdXJzLCBzbyB3ZSBjYW5cbiAgICAgICAgLy8gZG8gc29tZSBhZGRpdGlvbmFsIHdvcmsgc3VjaCBhcyByZW5kZXIgbG9uZ1N0YWNrVHJhY2VcbiAgICAgICAgaWYgKHN0YXRlID09PSBSRUpFQ1RFRCAmJiB2YWx1ZSBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgICAgLy8gY2hlY2sgaWYgbG9uZ1N0YWNrVHJhY2Vab25lIGlzIGhlcmVcbiAgICAgICAgICBjb25zdCB0cmFjZSA9IFpvbmUuY3VycmVudFRhc2sgJiYgWm9uZS5jdXJyZW50VGFzay5kYXRhICYmXG4gICAgICAgICAgICAgIChab25lLmN1cnJlbnRUYXNrLmRhdGEgYXMgYW55KVtjcmVhdGlvblRyYWNlXTtcbiAgICAgICAgICBpZiAodHJhY2UpIHtcbiAgICAgICAgICAgIC8vIG9ubHkga2VlcCB0aGUgbG9uZyBzdGFjayB0cmFjZSBpbnRvIGVycm9yIHdoZW4gaW4gbG9uZ1N0YWNrVHJhY2Vab25lXG4gICAgICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICB2YWx1ZSwgQ1VSUkVOVF9UQVNLX1RSQUNFX1NZTUJPTCxcbiAgICAgICAgICAgICAgICB7Y29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiBmYWxzZSwgd3JpdGFibGU6IHRydWUsIHZhbHVlOiB0cmFjZX0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcXVldWUubGVuZ3RoOykge1xuICAgICAgICAgIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0KHByb21pc2UsIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10sIHF1ZXVlW2krK10pO1xuICAgICAgICB9XG4gICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPT0gMCAmJiBzdGF0ZSA9PSBSRUpFQ1RFRCkge1xuICAgICAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gUkVKRUNURURfTk9fQ0FUQ0g7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIHRyeSB0byBwcmludCBtb3JlIHJlYWRhYmxlIGVycm9yIGxvZ1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICAgICAgICdVbmNhdWdodCAoaW4gcHJvbWlzZSk6ICcgKyByZWFkYWJsZU9iamVjdFRvU3RyaW5nKHZhbHVlKSArXG4gICAgICAgICAgICAgICAgKHZhbHVlICYmIHZhbHVlLnN0YWNrID8gJ1xcbicgKyB2YWx1ZS5zdGFjayA6ICcnKSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBjb25zdCBlcnJvcjogVW5jYXVnaHRQcm9taXNlRXJyb3IgPSBlcnI7XG4gICAgICAgICAgICBlcnJvci5yZWplY3Rpb24gPSB2YWx1ZTtcbiAgICAgICAgICAgIGVycm9yLnByb21pc2UgPSBwcm9taXNlO1xuICAgICAgICAgICAgZXJyb3Iuem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgIGVycm9yLnRhc2sgPSBab25lLmN1cnJlbnRUYXNrITtcbiAgICAgICAgICAgIF91bmNhdWdodFByb21pc2VFcnJvcnMucHVzaChlcnJvcik7XG4gICAgICAgICAgICBhcGkuc2NoZWR1bGVNaWNyb1Rhc2soKTsgIC8vIHRvIG1ha2Ugc3VyZSB0aGF0IGl0IGlzIHJ1bm5pbmdcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy8gUmVzb2x2aW5nIGFuIGFscmVhZHkgcmVzb2x2ZWQgcHJvbWlzZSBpcyBhIG5vb3AuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuICBjb25zdCBSRUpFQ1RJT05fSEFORExFRF9IQU5ETEVSID0gX19zeW1ib2xfXygncmVqZWN0aW9uSGFuZGxlZEhhbmRsZXInKTtcbiAgZnVuY3Rpb24gY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+KTogdm9pZCB7XG4gICAgaWYgKChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID09PSBSRUpFQ1RFRF9OT19DQVRDSCkge1xuICAgICAgLy8gaWYgdGhlIHByb21pc2UgaXMgcmVqZWN0ZWQgbm8gY2F0Y2ggc3RhdHVzXG4gICAgICAvLyBhbmQgcXVldWUubGVuZ3RoID4gMCwgbWVhbnMgdGhlcmUgaXMgYSBlcnJvciBoYW5kbGVyXG4gICAgICAvLyBoZXJlIHRvIGhhbmRsZSB0aGUgcmVqZWN0ZWQgcHJvbWlzZSwgd2Ugc2hvdWxkIHRyaWdnZXJcbiAgICAgIC8vIHdpbmRvd3MucmVqZWN0aW9uaGFuZGxlZCBldmVudEhhbmRsZXIgb3Igbm9kZWpzIHJlamVjdGlvbkhhbmRsZWRcbiAgICAgIC8vIGV2ZW50SGFuZGxlclxuICAgICAgdHJ5IHtcbiAgICAgICAgY29uc3QgaGFuZGxlciA9IChab25lIGFzIGFueSlbUkVKRUNUSU9OX0hBTkRMRURfSEFORExFUl07XG4gICAgICAgIGlmIChoYW5kbGVyICYmIHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIHtyZWplY3Rpb246IChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdLCBwcm9taXNlOiBwcm9taXNlfSk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgfVxuICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRDtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocHJvbWlzZSA9PT0gX3VuY2F1Z2h0UHJvbWlzZUVycm9yc1tpXS5wcm9taXNlKSB7XG4gICAgICAgICAgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBzY2hlZHVsZVJlc29sdmVPclJlamVjdDxSLCBVMSwgVTI+KFxuICAgICAgcHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+LCB6b25lOiBBbWJpZW50Wm9uZSwgY2hhaW5Qcm9taXNlOiBab25lQXdhcmVQcm9taXNlPGFueT4sXG4gICAgICBvbkZ1bGZpbGxlZD86ICgodmFsdWU6IFIpID0+IFUxKXxudWxsfHVuZGVmaW5lZCxcbiAgICAgIG9uUmVqZWN0ZWQ/OiAoKGVycm9yOiBhbnkpID0+IFUyKXxudWxsfHVuZGVmaW5lZCk6IHZvaWQge1xuICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKHByb21pc2UpO1xuICAgIGNvbnN0IHByb21pc2VTdGF0ZSA9IChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdO1xuICAgIGNvbnN0IGRlbGVnYXRlID0gcHJvbWlzZVN0YXRlID9cbiAgICAgICAgKHR5cGVvZiBvbkZ1bGZpbGxlZCA9PT0gJ2Z1bmN0aW9uJykgPyBvbkZ1bGZpbGxlZCA6IGZvcndhcmRSZXNvbHV0aW9uIDpcbiAgICAgICAgKHR5cGVvZiBvblJlamVjdGVkID09PSAnZnVuY3Rpb24nKSA/IG9uUmVqZWN0ZWQgOiBmb3J3YXJkUmVqZWN0aW9uO1xuICAgIHpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soc291cmNlLCAoKSA9PiB7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBwYXJlbnRQcm9taXNlVmFsdWUgPSAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXTtcbiAgICAgICAgY29uc3QgaXNGaW5hbGx5UHJvbWlzZSA9XG4gICAgICAgICAgICBjaGFpblByb21pc2UgJiYgc3ltYm9sRmluYWxseSA9PT0gKGNoYWluUHJvbWlzZSBhcyBhbnkpW3N5bWJvbEZpbmFsbHldO1xuICAgICAgICBpZiAoaXNGaW5hbGx5UHJvbWlzZSkge1xuICAgICAgICAgIC8vIGlmIHRoZSBwcm9taXNlIGlzIGdlbmVyYXRlZCBmcm9tIGZpbmFsbHkgY2FsbCwga2VlcCBwYXJlbnQgcHJvbWlzZSdzIHN0YXRlIGFuZCB2YWx1ZVxuICAgICAgICAgIChjaGFpblByb21pc2UgYXMgYW55KVtzeW1ib2xQYXJlbnRQcm9taXNlVmFsdWVdID0gcGFyZW50UHJvbWlzZVZhbHVlO1xuICAgICAgICAgIChjaGFpblByb21pc2UgYXMgYW55KVtzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGVdID0gcHJvbWlzZVN0YXRlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHNob3VsZCBub3QgcGFzcyB2YWx1ZSB0byBmaW5hbGx5IGNhbGxiYWNrXG4gICAgICAgIGNvbnN0IHZhbHVlID0gem9uZS5ydW4oXG4gICAgICAgICAgICBkZWxlZ2F0ZSwgdW5kZWZpbmVkLFxuICAgICAgICAgICAgaXNGaW5hbGx5UHJvbWlzZSAmJiBkZWxlZ2F0ZSAhPT0gZm9yd2FyZFJlamVjdGlvbiAmJiBkZWxlZ2F0ZSAhPT0gZm9yd2FyZFJlc29sdXRpb24gP1xuICAgICAgICAgICAgICAgIFtdIDpcbiAgICAgICAgICAgICAgICBbcGFyZW50UHJvbWlzZVZhbHVlXSk7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKGNoYWluUHJvbWlzZSwgdHJ1ZSwgdmFsdWUpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgLy8gaWYgZXJyb3Igb2NjdXJzLCBzaG91bGQgYWx3YXlzIHJldHVybiB0aGlzIGVycm9yXG4gICAgICAgIHJlc29sdmVQcm9taXNlKGNoYWluUHJvbWlzZSwgZmFsc2UsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9LCBjaGFpblByb21pc2UgYXMgVGFza0RhdGEpO1xuICB9XG5cbiAgY29uc3QgWk9ORV9BV0FSRV9QUk9NSVNFX1RPX1NUUklORyA9ICdmdW5jdGlvbiBab25lQXdhcmVQcm9taXNlKCkgeyBbbmF0aXZlIGNvZGVdIH0nO1xuXG4gIGNsYXNzIFpvbmVBd2FyZVByb21pc2U8Uj4gaW1wbGVtZW50cyBQcm9taXNlPFI+IHtcbiAgICBzdGF0aWMgdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gWk9ORV9BV0FSRV9QUk9NSVNFX1RPX1NUUklORztcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVzb2x2ZTxSPih2YWx1ZTogUik6IFByb21pc2U8Uj4ge1xuICAgICAgcmV0dXJuIHJlc29sdmVQcm9taXNlKDxab25lQXdhcmVQcm9taXNlPFI+Pm5ldyB0aGlzKG51bGwgYXMgYW55KSwgUkVTT0xWRUQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgcmVqZWN0PFU+KGVycm9yOiBVKTogUHJvbWlzZTxVPiB7XG4gICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2UoPFpvbmVBd2FyZVByb21pc2U8VT4+bmV3IHRoaXMobnVsbCBhcyBhbnkpLCBSRUpFQ1RFRCwgZXJyb3IpO1xuICAgIH1cblxuICAgIHN0YXRpYyByYWNlPFI+KHZhbHVlczogUHJvbWlzZUxpa2U8YW55PltdKTogUHJvbWlzZTxSPiB7XG4gICAgICBsZXQgcmVzb2x2ZTogKHY6IGFueSkgPT4gdm9pZDtcbiAgICAgIGxldCByZWplY3Q6ICh2OiBhbnkpID0+IHZvaWQ7XG4gICAgICBsZXQgcHJvbWlzZTogYW55ID0gbmV3IHRoaXMoKHJlcywgcmVqKSA9PiB7XG4gICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgIH0pO1xuICAgICAgZnVuY3Rpb24gb25SZXNvbHZlKHZhbHVlOiBhbnkpIHtcbiAgICAgICAgcHJvbWlzZSAmJiAocHJvbWlzZSA9IG51bGwgfHwgcmVzb2x2ZSh2YWx1ZSkpO1xuICAgICAgfVxuICAgICAgZnVuY3Rpb24gb25SZWplY3QoZXJyb3I6IGFueSkge1xuICAgICAgICBwcm9taXNlICYmIChwcm9taXNlID0gbnVsbCB8fCByZWplY3QoZXJyb3IpKTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgIGlmICghaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgdmFsdWUudGhlbihvblJlc29sdmUsIG9uUmVqZWN0KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIHN0YXRpYyBhbGw8Uj4odmFsdWVzOiBhbnkpOiBQcm9taXNlPFI+IHtcbiAgICAgIGxldCByZXNvbHZlOiAodjogYW55KSA9PiB2b2lkO1xuICAgICAgbGV0IHJlamVjdDogKHY6IGFueSkgPT4gdm9pZDtcbiAgICAgIGxldCBwcm9taXNlID0gbmV3IHRoaXM8Uj4oKHJlcywgcmVqKSA9PiB7XG4gICAgICAgIHJlc29sdmUgPSByZXM7XG4gICAgICAgIHJlamVjdCA9IHJlajtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBTdGFydCBhdCAyIHRvIHByZXZlbnQgcHJlbWF0dXJlbHkgcmVzb2x2aW5nIGlmIC50aGVuIGlzIGNhbGxlZCBpbW1lZGlhdGVseS5cbiAgICAgIGxldCB1bnJlc29sdmVkQ291bnQgPSAyO1xuICAgICAgbGV0IHZhbHVlSW5kZXggPSAwO1xuXG4gICAgICBjb25zdCByZXNvbHZlZFZhbHVlczogYW55W10gPSBbXTtcbiAgICAgIGZvciAobGV0IHZhbHVlIG9mIHZhbHVlcykge1xuICAgICAgICBpZiAoIWlzVGhlbmFibGUodmFsdWUpKSB7XG4gICAgICAgICAgdmFsdWUgPSB0aGlzLnJlc29sdmUodmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgY3VyVmFsdWVJbmRleCA9IHZhbHVlSW5kZXg7XG4gICAgICAgIHZhbHVlLnRoZW4oKHZhbHVlOiBhbnkpID0+IHtcbiAgICAgICAgICByZXNvbHZlZFZhbHVlc1tjdXJWYWx1ZUluZGV4XSA9IHZhbHVlO1xuICAgICAgICAgIHVucmVzb2x2ZWRDb3VudC0tO1xuICAgICAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgICAgIHJlc29sdmUhKHJlc29sdmVkVmFsdWVzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHJlamVjdCEpO1xuXG4gICAgICAgIHVucmVzb2x2ZWRDb3VudCsrO1xuICAgICAgICB2YWx1ZUluZGV4Kys7XG4gICAgICB9XG5cbiAgICAgIC8vIE1ha2UgdGhlIHVucmVzb2x2ZWRDb3VudCB6ZXJvLWJhc2VkIGFnYWluLlxuICAgICAgdW5yZXNvbHZlZENvdW50IC09IDI7XG5cbiAgICAgIGlmICh1bnJlc29sdmVkQ291bnQgPT09IDApIHtcbiAgICAgICAgcmVzb2x2ZSEocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZXhlY3V0b3I6XG4gICAgICAgICAgICAocmVzb2x2ZTogKHZhbHVlPzogUnxQcm9taXNlTGlrZTxSPikgPT4gdm9pZCwgcmVqZWN0OiAoZXJyb3I/OiBhbnkpID0+IHZvaWQpID0+IHZvaWQpIHtcbiAgICAgIGNvbnN0IHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8Uj4gPSB0aGlzO1xuICAgICAgaWYgKCEocHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignTXVzdCBiZSBhbiBpbnN0YW5jZW9mIFByb21pc2UuJyk7XG4gICAgICB9XG4gICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9IFVOUkVTT0xWRUQ7XG4gICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFZhbHVlXSA9IFtdOyAgLy8gcXVldWU7XG4gICAgICB0cnkge1xuICAgICAgICBleGVjdXRvciAmJiBleGVjdXRvcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgUkVTT0xWRUQpLCBtYWtlUmVzb2x2ZXIocHJvbWlzZSwgUkVKRUNURUQpKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnJvcik7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhlbjxUUmVzdWx0MSA9IFIsIFRSZXN1bHQyID0gbmV2ZXI+KFxuICAgICAgICBvbkZ1bGZpbGxlZD86ICgodmFsdWU6IFIpID0+IFRSZXN1bHQxIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDE+KXx1bmRlZmluZWR8bnVsbCxcbiAgICAgICAgb25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQyIHwgUHJvbWlzZUxpa2U8VFJlc3VsdDI+KXx1bmRlZmluZWR8XG4gICAgICAgIG51bGwpOiBQcm9taXNlPFRSZXN1bHQxfFRSZXN1bHQyPiB7XG4gICAgICBjb25zdCBjaGFpblByb21pc2U6IFByb21pc2U8VFJlc3VsdDF8VFJlc3VsdDI+ID1cbiAgICAgICAgICBuZXcgKHRoaXMuY29uc3RydWN0b3IgYXMgdHlwZW9mIFpvbmVBd2FyZVByb21pc2UpKG51bGwgYXMgYW55KTtcbiAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICBpZiAoKHRoaXMgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAoPGFueVtdPih0aGlzIGFzIGFueSlbc3ltYm9sVmFsdWVdKS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GdWxmaWxsZWQsIG9uUmVqZWN0ZWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW5Qcm9taXNlO1xuICAgIH1cblxuICAgIGNhdGNoPFRSZXN1bHQgPSBuZXZlcj4ob25SZWplY3RlZD86ICgocmVhc29uOiBhbnkpID0+IFRSZXN1bHQgfCBQcm9taXNlTGlrZTxUUmVzdWx0Pil8dW5kZWZpbmVkfFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVsbCk6IFByb21pc2U8UnxUUmVzdWx0PiB7XG4gICAgICByZXR1cm4gdGhpcy50aGVuKG51bGwsIG9uUmVqZWN0ZWQpO1xuICAgIH1cblxuICAgIGZpbmFsbHk8VT4ob25GaW5hbGx5PzogKCkgPT4gVSB8IFByb21pc2VMaWtlPFU+KTogUHJvbWlzZTxSPiB7XG4gICAgICBjb25zdCBjaGFpblByb21pc2U6IFByb21pc2U8UnxuZXZlcj4gPVxuICAgICAgICAgIG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgWm9uZUF3YXJlUHJvbWlzZSkobnVsbCBhcyBhbnkpO1xuICAgICAgKGNoYWluUHJvbWlzZSBhcyBhbnkpW3N5bWJvbEZpbmFsbHldID0gc3ltYm9sRmluYWxseTtcbiAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICBpZiAoKHRoaXMgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAoPGFueVtdPih0aGlzIGFzIGFueSlbc3ltYm9sVmFsdWVdKS5wdXNoKHpvbmUsIGNoYWluUHJvbWlzZSwgb25GaW5hbGx5LCBvbkZpbmFsbHkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QodGhpcywgem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW5Qcm9taXNlO1xuICAgIH1cbiAgfVxuICAvLyBQcm90ZWN0IGFnYWluc3QgYWdncmVzc2l2ZSBvcHRpbWl6ZXJzIGRyb3BwaW5nIHNlZW1pbmdseSB1bnVzZWQgcHJvcGVydGllcy5cbiAgLy8gRS5nLiBDbG9zdXJlIENvbXBpbGVyIGluIGFkdmFuY2VkIG1vZGUuXG4gIFpvbmVBd2FyZVByb21pc2VbJ3Jlc29sdmUnXSA9IFpvbmVBd2FyZVByb21pc2UucmVzb2x2ZTtcbiAgWm9uZUF3YXJlUHJvbWlzZVsncmVqZWN0J10gPSBab25lQXdhcmVQcm9taXNlLnJlamVjdDtcbiAgWm9uZUF3YXJlUHJvbWlzZVsncmFjZSddID0gWm9uZUF3YXJlUHJvbWlzZS5yYWNlO1xuICBab25lQXdhcmVQcm9taXNlWydhbGwnXSA9IFpvbmVBd2FyZVByb21pc2UuYWxsO1xuXG4gIGNvbnN0IE5hdGl2ZVByb21pc2UgPSBnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBnbG9iYWxbJ1Byb21pc2UnXTtcbiAgY29uc3QgWk9ORV9BV0FSRV9QUk9NSVNFID0gWm9uZS5fX3N5bWJvbF9fKCdab25lQXdhcmVQcm9taXNlJyk7XG5cbiAgbGV0IGRlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZ2xvYmFsLCAnUHJvbWlzZScpO1xuICBpZiAoIWRlc2MgfHwgZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICBkZXNjICYmIGRlbGV0ZSBkZXNjLndyaXRhYmxlO1xuICAgIGRlc2MgJiYgZGVsZXRlIGRlc2MudmFsdWU7XG4gICAgaWYgKCFkZXNjKSB7XG4gICAgICBkZXNjID0ge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgZW51bWVyYWJsZTogdHJ1ZX07XG4gICAgfVxuICAgIGRlc2MuZ2V0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAvLyBpZiB3ZSBhbHJlYWR5IHNldCBab25lQXdhcmVQcm9taXNlLCB1c2UgcGF0Y2hlZCBvbmVcbiAgICAgIC8vIG90aGVyd2lzZSByZXR1cm4gbmF0aXZlIG9uZS5cbiAgICAgIHJldHVybiBnbG9iYWxbWk9ORV9BV0FSRV9QUk9NSVNFXSA/IGdsb2JhbFtaT05FX0FXQVJFX1BST01JU0VdIDogZ2xvYmFsW3N5bWJvbFByb21pc2VdO1xuICAgIH07XG4gICAgZGVzYy5zZXQgPSBmdW5jdGlvbihOZXdOYXRpdmVQcm9taXNlKSB7XG4gICAgICBpZiAoTmV3TmF0aXZlUHJvbWlzZSA9PT0gWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICAvLyBpZiB0aGUgTmV3TmF0aXZlUHJvbWlzZSBpcyBab25lQXdhcmVQcm9taXNlXG4gICAgICAgIC8vIHNhdmUgdG8gZ2xvYmFsXG4gICAgICAgIGdsb2JhbFtaT05FX0FXQVJFX1BST01JU0VdID0gTmV3TmF0aXZlUHJvbWlzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGlmIHRoZSBOZXdOYXRpdmVQcm9taXNlIGlzIG5vdCBab25lQXdhcmVQcm9taXNlXG4gICAgICAgIC8vIGZvciBleGFtcGxlOiBhZnRlciBsb2FkIHpvbmUuanMsIHNvbWUgbGlicmFyeSBqdXN0XG4gICAgICAgIC8vIHNldCBlczYtcHJvbWlzZSB0byBnbG9iYWwsIGlmIHdlIHNldCBpdCB0byBnbG9iYWxcbiAgICAgICAgLy8gZGlyZWN0bHksIGFzc2VydFpvbmVQYXRjaGVkIHdpbGwgZmFpbCBhbmQgYW5ndWxhclxuICAgICAgICAvLyB3aWxsIG5vdCBsb2FkZWQsIHNvIHdlIGp1c3Qgc2V0IHRoZSBOZXdOYXRpdmVQcm9taXNlXG4gICAgICAgIC8vIHRvIGdsb2JhbFtzeW1ib2xQcm9taXNlXSwgc28gdGhlIHJlc3VsdCBpcyBqdXN0IGxpa2VcbiAgICAgICAgLy8gd2UgbG9hZCBFUzYgUHJvbWlzZSBiZWZvcmUgem9uZS5qc1xuICAgICAgICBnbG9iYWxbc3ltYm9sUHJvbWlzZV0gPSBOZXdOYXRpdmVQcm9taXNlO1xuICAgICAgICBpZiAoIU5ld05hdGl2ZVByb21pc2UucHJvdG90eXBlW3N5bWJvbFRoZW5dKSB7XG4gICAgICAgICAgcGF0Y2hUaGVuKE5ld05hdGl2ZVByb21pc2UpO1xuICAgICAgICB9XG4gICAgICAgIGFwaS5zZXROYXRpdmVQcm9taXNlKE5ld05hdGl2ZVByb21pc2UpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShnbG9iYWwsICdQcm9taXNlJywgZGVzYyk7XG4gIH1cblxuICBnbG9iYWxbJ1Byb21pc2UnXSA9IFpvbmVBd2FyZVByb21pc2U7XG5cbiAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBfX3N5bWJvbF9fKCd0aGVuUGF0Y2hlZCcpO1xuXG4gIGZ1bmN0aW9uIHBhdGNoVGhlbihDdG9yOiBGdW5jdGlvbikge1xuICAgIGNvbnN0IHByb3RvID0gQ3Rvci5wcm90b3R5cGU7XG5cbiAgICBjb25zdCBwcm9wID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCAndGhlbicpO1xuICAgIGlmIChwcm9wICYmIChwcm9wLndyaXRhYmxlID09PSBmYWxzZSB8fCAhcHJvcC5jb25maWd1cmFibGUpKSB7XG4gICAgICAvLyBjaGVjayBDdG9yLnByb3RvdHlwZS50aGVuIHByb3BlcnR5RGVzY3JpcHRvciBpcyB3cml0YWJsZSBvciBub3RcbiAgICAgIC8vIGluIG1ldGVvciBlbnYsIHdyaXRhYmxlIGlzIGZhbHNlLCB3ZSBzaG91bGQgaWdub3JlIHN1Y2ggY2FzZVxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IG9yaWdpbmFsVGhlbiA9IHByb3RvLnRoZW47XG4gICAgLy8gS2VlcCBhIHJlZmVyZW5jZSB0byB0aGUgb3JpZ2luYWwgbWV0aG9kLlxuICAgIHByb3RvW3N5bWJvbFRoZW5dID0gb3JpZ2luYWxUaGVuO1xuXG4gICAgQ3Rvci5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKG9uUmVzb2x2ZTogYW55LCBvblJlamVjdDogYW55KSB7XG4gICAgICBjb25zdCB3cmFwcGVkID0gbmV3IFpvbmVBd2FyZVByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICBvcmlnaW5hbFRoZW4uY2FsbCh0aGlzLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gd3JhcHBlZC50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgIH07XG4gICAgKEN0b3IgYXMgYW55KVtzeW1ib2xUaGVuUGF0Y2hlZF0gPSB0cnVlO1xuICB9XG5cbiAgYXBpLnBhdGNoVGhlbiA9IHBhdGNoVGhlbjtcblxuICBmdW5jdGlvbiB6b25laWZ5KGZuOiBGdW5jdGlvbikge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIGxldCByZXN1bHRQcm9taXNlID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmIChyZXN1bHRQcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIGxldCBjdG9yID0gcmVzdWx0UHJvbWlzZS5jb25zdHJ1Y3RvcjtcbiAgICAgIGlmICghY3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0pIHtcbiAgICAgICAgcGF0Y2hUaGVuKGN0b3IpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdFByb21pc2U7XG4gICAgfTtcbiAgfVxuXG4gIGlmIChOYXRpdmVQcm9taXNlKSB7XG4gICAgcGF0Y2hUaGVuKE5hdGl2ZVByb21pc2UpO1xuICB9XG5cbiAgLy8gVGhpcyBpcyBub3QgcGFydCBvZiBwdWJsaWMgQVBJLCBidXQgaXQgaXMgdXNlZnVsIGZvciB0ZXN0cywgc28gd2UgZXhwb3NlIGl0LlxuICAoUHJvbWlzZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygndW5jYXVnaHRQcm9taXNlRXJyb3JzJyldID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycztcbiAgcmV0dXJuIFpvbmVBd2FyZVByb21pc2U7XG59KTtcbiJdfQ==