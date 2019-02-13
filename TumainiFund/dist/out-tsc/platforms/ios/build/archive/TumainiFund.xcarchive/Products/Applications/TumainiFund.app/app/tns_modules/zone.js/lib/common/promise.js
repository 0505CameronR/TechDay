Zone.__load_patch('ZoneAwarePromise', function (global, Zone, api) {
    var ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var ObjectDefineProperty = Object.defineProperty;
    function readableObjectToString(obj) {
        if (obj && obj.toString === Object.prototype.toString) {
            var className = obj.constructor && obj.constructor.name;
            return (className ? className : '') + ': ' + JSON.stringify(obj);
        }
        return obj ? obj.toString() : Object.prototype.toString.call(obj);
    }
    var __symbol__ = api.symbol;
    var _uncaughtPromiseErrors = [];
    var symbolPromise = __symbol__('Promise');
    var symbolThen = __symbol__('then');
    var creationTrace = '__creationTrace__';
    api.onUnhandledError = function (e) {
        if (api.showUncaughtError()) {
            var rejection = e && e.rejection;
            if (rejection) {
                console.error('Unhandled Promise rejection:', rejection instanceof Error ? rejection.message : rejection, '; Zone:', e.zone.name, '; Task:', e.task && e.task.source, '; Value:', rejection, rejection instanceof Error ? rejection.stack : undefined);
            }
            else {
                console.error(e);
            }
        }
    };
    api.microtaskDrainDone = function () {
        while (_uncaughtPromiseErrors.length) {
            var _loop_1 = function () {
                var uncaughtPromiseError = _uncaughtPromiseErrors.shift();
                try {
                    uncaughtPromiseError.zone.runGuarded(function () {
                        throw uncaughtPromiseError;
                    });
                }
                catch (error) {
                    handleUnhandledRejection(error);
                }
            };
            while (_uncaughtPromiseErrors.length) {
                _loop_1();
            }
        }
    };
    var UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL = __symbol__('unhandledPromiseRejectionHandler');
    function handleUnhandledRejection(e) {
        api.onUnhandledError(e);
        try {
            var handler = Zone[UNHANDLED_PROMISE_REJECTION_HANDLER_SYMBOL];
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
    var symbolState = __symbol__('state');
    var symbolValue = __symbol__('value');
    var symbolFinally = __symbol__('finally');
    var symbolParentPromiseValue = __symbol__('parentPromiseValue');
    var symbolParentPromiseState = __symbol__('parentPromiseState');
    var source = 'Promise.then';
    var UNRESOLVED = null;
    var RESOLVED = true;
    var REJECTED = false;
    var REJECTED_NO_CATCH = 0;
    function makeResolver(promise, state) {
        return function (v) {
            try {
                resolvePromise(promise, state, v);
            }
            catch (err) {
                resolvePromise(promise, false, err);
            }
            // Do not return value or you will break the Promise spec.
        };
    }
    var once = function () {
        var wasCalled = false;
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
    var TYPE_ERROR = 'Promise resolved with itself';
    var CURRENT_TASK_TRACE_SYMBOL = __symbol__('currentTaskTrace');
    // Promise Resolution
    function resolvePromise(promise, state, value) {
        var onceWrapper = once();
        if (promise === value) {
            throw new TypeError(TYPE_ERROR);
        }
        if (promise[symbolState] === UNRESOLVED) {
            // should only get value.then once based on promise spec.
            var then = null;
            try {
                if (typeof value === 'object' || typeof value === 'function') {
                    then = value && value.then;
                }
            }
            catch (err) {
                onceWrapper(function () {
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
                    onceWrapper(function () {
                        resolvePromise(promise, false, err);
                    })();
                }
            }
            else {
                promise[symbolState] = state;
                var queue = promise[symbolValue];
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
                    var trace = Zone.currentTask && Zone.currentTask.data &&
                        Zone.currentTask.data[creationTrace];
                    if (trace) {
                        // only keep the long stack trace into error when in longStackTraceZone
                        ObjectDefineProperty(value, CURRENT_TASK_TRACE_SYMBOL, { configurable: true, enumerable: false, writable: true, value: trace });
                    }
                }
                for (var i = 0; i < queue.length;) {
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
                        var error_1 = err;
                        error_1.rejection = value;
                        error_1.promise = promise;
                        error_1.zone = Zone.current;
                        error_1.task = Zone.currentTask;
                        _uncaughtPromiseErrors.push(error_1);
                        api.scheduleMicroTask(); // to make sure that it is running
                    }
                }
            }
        }
        // Resolving an already resolved promise is a noop.
        return promise;
    }
    var REJECTION_HANDLED_HANDLER = __symbol__('rejectionHandledHandler');
    function clearRejectedNoCatch(promise) {
        if (promise[symbolState] === REJECTED_NO_CATCH) {
            // if the promise is rejected no catch status
            // and queue.length > 0, means there is a error handler
            // here to handle the rejected promise, we should trigger
            // windows.rejectionhandled eventHandler or nodejs rejectionHandled
            // eventHandler
            try {
                var handler = Zone[REJECTION_HANDLED_HANDLER];
                if (handler && typeof handler === 'function') {
                    handler.call(this, { rejection: promise[symbolValue], promise: promise });
                }
            }
            catch (err) {
            }
            promise[symbolState] = REJECTED;
            for (var i = 0; i < _uncaughtPromiseErrors.length; i++) {
                if (promise === _uncaughtPromiseErrors[i].promise) {
                    _uncaughtPromiseErrors.splice(i, 1);
                }
            }
        }
    }
    function scheduleResolveOrReject(promise, zone, chainPromise, onFulfilled, onRejected) {
        clearRejectedNoCatch(promise);
        var promiseState = promise[symbolState];
        var delegate = promiseState ?
            (typeof onFulfilled === 'function') ? onFulfilled : forwardResolution :
            (typeof onRejected === 'function') ? onRejected : forwardRejection;
        zone.scheduleMicroTask(source, function () {
            try {
                var parentPromiseValue = promise[symbolValue];
                var isFinallyPromise = chainPromise && symbolFinally === chainPromise[symbolFinally];
                if (isFinallyPromise) {
                    // if the promise is generated from finally call, keep parent promise's state and value
                    chainPromise[symbolParentPromiseValue] = parentPromiseValue;
                    chainPromise[symbolParentPromiseState] = promiseState;
                }
                // should not pass value to finally callback
                var value = zone.run(delegate, undefined, isFinallyPromise && delegate !== forwardRejection && delegate !== forwardResolution ?
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
    var ZONE_AWARE_PROMISE_TO_STRING = 'function ZoneAwarePromise() { [native code] }';
    var ZoneAwarePromise = /** @class */ (function () {
        function ZoneAwarePromise(executor) {
            var promise = this;
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
        ZoneAwarePromise.toString = function () {
            return ZONE_AWARE_PROMISE_TO_STRING;
        };
        ZoneAwarePromise.resolve = function (value) {
            return resolvePromise(new this(null), RESOLVED, value);
        };
        ZoneAwarePromise.reject = function (error) {
            return resolvePromise(new this(null), REJECTED, error);
        };
        ZoneAwarePromise.race = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            function onResolve(value) {
                promise && (promise = null || resolve(value));
            }
            function onReject(error) {
                promise && (promise = null || reject(error));
            }
            for (var _i = 0, values_1 = values; _i < values_1.length; _i++) {
                var value = values_1[_i];
                if (!isThenable(value)) {
                    value = this.resolve(value);
                }
                value.then(onResolve, onReject);
            }
            return promise;
        };
        ZoneAwarePromise.all = function (values) {
            var resolve;
            var reject;
            var promise = new this(function (res, rej) {
                resolve = res;
                reject = rej;
            });
            // Start at 2 to prevent prematurely resolving if .then is called immediately.
            var unresolvedCount = 2;
            var valueIndex = 0;
            var resolvedValues = [];
            var _loop_2 = function (value) {
                if (!isThenable(value)) {
                    value = this_1.resolve(value);
                }
                var curValueIndex = valueIndex;
                value.then(function (value) {
                    resolvedValues[curValueIndex] = value;
                    unresolvedCount--;
                    if (unresolvedCount === 0) {
                        resolve(resolvedValues);
                    }
                }, reject);
                unresolvedCount++;
                valueIndex++;
            };
            var this_1 = this;
            for (var _i = 0, values_2 = values; _i < values_2.length; _i++) {
                var value = values_2[_i];
                _loop_2(value);
            }
            // Make the unresolvedCount zero-based again.
            unresolvedCount -= 2;
            if (unresolvedCount === 0) {
                resolve(resolvedValues);
            }
            return promise;
        };
        ZoneAwarePromise.prototype.then = function (onFulfilled, onRejected) {
            var chainPromise = new this.constructor(null);
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFulfilled, onRejected);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFulfilled, onRejected);
            }
            return chainPromise;
        };
        ZoneAwarePromise.prototype.catch = function (onRejected) {
            return this.then(null, onRejected);
        };
        ZoneAwarePromise.prototype.finally = function (onFinally) {
            var chainPromise = new this.constructor(null);
            chainPromise[symbolFinally] = symbolFinally;
            var zone = Zone.current;
            if (this[symbolState] == UNRESOLVED) {
                this[symbolValue].push(zone, chainPromise, onFinally, onFinally);
            }
            else {
                scheduleResolveOrReject(this, zone, chainPromise, onFinally, onFinally);
            }
            return chainPromise;
        };
        return ZoneAwarePromise;
    }());
    // Protect against aggressive optimizers dropping seemingly unused properties.
    // E.g. Closure Compiler in advanced mode.
    ZoneAwarePromise['resolve'] = ZoneAwarePromise.resolve;
    ZoneAwarePromise['reject'] = ZoneAwarePromise.reject;
    ZoneAwarePromise['race'] = ZoneAwarePromise.race;
    ZoneAwarePromise['all'] = ZoneAwarePromise.all;
    var NativePromise = global[symbolPromise] = global['Promise'];
    var ZONE_AWARE_PROMISE = Zone.__symbol__('ZoneAwarePromise');
    var desc = ObjectGetOwnPropertyDescriptor(global, 'Promise');
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
    var symbolThenPatched = __symbol__('thenPatched');
    function patchThen(Ctor) {
        var proto = Ctor.prototype;
        var prop = ObjectGetOwnPropertyDescriptor(proto, 'then');
        if (prop && (prop.writable === false || !prop.configurable)) {
            // check Ctor.prototype.then propertyDescriptor is writable or not
            // in meteor env, writable is false, we should ignore such case
            return;
        }
        var originalThen = proto.then;
        // Keep a reference to the original method.
        proto[symbolThen] = originalThen;
        Ctor.prototype.then = function (onResolve, onReject) {
            var _this = this;
            var wrapped = new ZoneAwarePromise(function (resolve, reject) {
                originalThen.call(_this, resolve, reject);
            });
            return wrapped.then(onResolve, onReject);
        };
        Ctor[symbolThenPatched] = true;
    }
    api.patchThen = patchThen;
    function zoneify(fn) {
        return function () {
            var resultPromise = fn.apply(this, arguments);
            if (resultPromise instanceof ZoneAwarePromise) {
                return resultPromise;
            }
            var ctor = resultPromise.constructor;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL3Byb21pc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBV0EsSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDbkYsSUFBTSw4QkFBOEIsR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUM7SUFDdkUsSUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0lBRW5ELFNBQVMsc0JBQXNCLENBQUMsR0FBUTtRQUN0QyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsUUFBUSxLQUFLLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFO1lBQ3JELElBQU0sU0FBUyxHQUFHLEdBQUcsQ0FBQyxXQUFXLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUM7WUFDMUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNsRTtRQUVELE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNwRSxDQUFDO0lBRUQsSUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQztJQUM5QixJQUFNLHNCQUFz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RUQsR0FBRyxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7SUFFMUIsU0FBUyxPQUFPLENBQUMsRUFBWTtRQUMzQixPQUFPO1lBQ0wsSUFBSSxhQUFhLEdBQUcsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDOUMsSUFBSSxhQUFhLFlBQVksZ0JBQWdCLEVBQUU7Z0JBQzdDLE9BQU8sYUFBYSxDQUFDO2FBQ3RCO1lBQ0QsSUFBSSxJQUFJLEdBQUcsYUFBYSxDQUFDLFdBQVcsQ0FBQztZQUNyQyxJQUFJLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEVBQUU7Z0JBQzVCLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNqQjtZQUNELE9BQU8sYUFBYSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQztJQUNKLENBQUM7SUFFRCxJQUFJLGFBQWEsRUFBRTtRQUNqQixTQUFTLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDMUI7SUFFRCwrRUFBK0U7SUFDOUUsT0FBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxHQUFHLHNCQUFzQixDQUFDO0lBQ3BGLE9BQU8sZ0JBQWdCLENBQUM7QUFDMUIsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbnRlcmZhY2UgUHJvbWlzZTxUPiB7XG4gIGZpbmFsbHk8VT4ob25GaW5hbGx5PzogKCkgPT4gVSB8IFByb21pc2VMaWtlPFU+KTogUHJvbWlzZTxUPjtcbn1cblxuWm9uZS5fX2xvYWRfcGF0Y2goJ1pvbmVBd2FyZVByb21pc2UnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBjb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICBjb25zdCBPYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcblxuICBmdW5jdGlvbiByZWFkYWJsZU9iamVjdFRvU3RyaW5nKG9iajogYW55KSB7XG4gICAgaWYgKG9iaiAmJiBvYmoudG9TdHJpbmcgPT09IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcpIHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IG9iai5jb25zdHJ1Y3RvciAmJiBvYmouY29uc3RydWN0b3IubmFtZTtcbiAgICAgIHJldHVybiAoY2xhc3NOYW1lID8gY2xhc3NOYW1lIDogJycpICsgJzogJyArIEpTT04uc3RyaW5naWZ5KG9iaik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iaiA/IG9iai50b1N0cmluZygpIDogT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaik7XG4gIH1cblxuICBjb25zdCBfX3N5bWJvbF9fID0gYXBpLnN5bWJvbDtcbiAgY29uc3QgX3VuY2F1Z2h0UHJvbWlzZUVycm9yczogVW5jYXVnaHRQcm9taXNlRXJyb3JbXSA9IFtdO1xuICBjb25zdCBzeW1ib2xQcm9taXNlID0gX19zeW1ib2xfXygnUHJvbWlzZScpO1xuICBjb25zdCBzeW1ib2xUaGVuID0gX19zeW1ib2xfXygndGhlbicpO1xuICBjb25zdCBjcmVhdGlvblRyYWNlID0gJ19fY3JlYXRpb25UcmFjZV9fJztcblxuICBhcGkub25VbmhhbmRsZWRFcnJvciA9IChlOiBhbnkpID0+IHtcbiAgICBpZiAoYXBpLnNob3dVbmNhdWdodEVycm9yKCkpIHtcbiAgICAgIGNvbnN0IHJlamVjdGlvbiA9IGUgJiYgZS5yZWplY3Rpb247XG4gICAgICBpZiAocmVqZWN0aW9uKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXG4gICAgICAgICAgICAnVW5oYW5kbGVkIFByb21pc2UgcmVqZWN0aW9uOicsXG4gICAgICAgICAgICByZWplY3Rpb24gaW5zdGFuY2VvZiBFcnJvciA/IHJlamVjdGlvbi5tZXNzYWdlIDogcmVqZWN0aW9uLFxuICAgICAgICAgICAgJzsgWm9uZTonLCAoPFpvbmU+ZS56b25lKS5uYW1lLCAnOyBUYXNrOicsIGUudGFzayAmJiAoPFRhc2s+ZS50YXNrKS5zb3VyY2UsXG4gICAgICAgICAgICAnOyBWYWx1ZTonLCByZWplY3Rpb24sIHJlamVjdGlvbiBpbnN0YW5jZW9mIEVycm9yID8gcmVqZWN0aW9uLnN0YWNrIDogdW5kZWZpbmVkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGFwaS5taWNyb3Rhc2tEcmFpbkRvbmUgPSAoKSA9PiB7XG4gICAgd2hpbGUgKF91bmNhdWdodFByb21pc2VFcnJvcnMubGVuZ3RoKSB7XG4gICAgICB3aGlsZSAoX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgY29uc3QgdW5jYXVnaHRQcm9taXNlRXJyb3I6IFVuY2F1Z2h0UHJvbWlzZUVycm9yID0gX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5zaGlmdCgpITtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICB1bmNhdWdodFByb21pc2VFcnJvci56b25lLnJ1bkd1YXJkZWQoKCkgPT4ge1xuICAgICAgICAgICAgdGhyb3cgdW5jYXVnaHRQcm9taXNlRXJyb3I7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgaGFuZGxlVW5oYW5kbGVkUmVqZWN0aW9uKGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBjb25zdCBVTkhBTkRMRURfUFJPTUlTRV9SRUpFQ1RJT05fSEFORExFUl9TWU1CT0wgPSBfX3N5bWJvbF9fKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpO1xuXG4gIGZ1bmN0aW9uIGhhbmRsZVVuaGFuZGxlZFJlamVjdGlvbihlOiBhbnkpIHtcbiAgICBhcGkub25VbmhhbmRsZWRFcnJvcihlKTtcbiAgICB0cnkge1xuICAgICAgY29uc3QgaGFuZGxlciA9IChab25lIGFzIGFueSlbVU5IQU5ETEVEX1BST01JU0VfUkVKRUNUSU9OX0hBTkRMRVJfU1lNQk9MXTtcbiAgICAgIGlmIChoYW5kbGVyICYmIHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBlKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBpc1RoZW5hYmxlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdmFsdWUgJiYgdmFsdWUudGhlbjtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcndhcmRSZXNvbHV0aW9uKHZhbHVlOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZvcndhcmRSZWplY3Rpb24ocmVqZWN0aW9uOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBab25lQXdhcmVQcm9taXNlLnJlamVjdChyZWplY3Rpb24pO1xuICB9XG5cbiAgY29uc3Qgc3ltYm9sU3RhdGU6IHN0cmluZyA9IF9fc3ltYm9sX18oJ3N0YXRlJyk7XG4gIGNvbnN0IHN5bWJvbFZhbHVlOiBzdHJpbmcgPSBfX3N5bWJvbF9fKCd2YWx1ZScpO1xuICBjb25zdCBzeW1ib2xGaW5hbGx5OiBzdHJpbmcgPSBfX3N5bWJvbF9fKCdmaW5hbGx5Jyk7XG4gIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VWYWx1ZTogc3RyaW5nID0gX19zeW1ib2xfXygncGFyZW50UHJvbWlzZVZhbHVlJyk7XG4gIGNvbnN0IHN5bWJvbFBhcmVudFByb21pc2VTdGF0ZTogc3RyaW5nID0gX19zeW1ib2xfXygncGFyZW50UHJvbWlzZVN0YXRlJyk7XG4gIGNvbnN0IHNvdXJjZTogc3RyaW5nID0gJ1Byb21pc2UudGhlbic7XG4gIGNvbnN0IFVOUkVTT0xWRUQ6IG51bGwgPSBudWxsO1xuICBjb25zdCBSRVNPTFZFRCA9IHRydWU7XG4gIGNvbnN0IFJFSkVDVEVEID0gZmFsc2U7XG4gIGNvbnN0IFJFSkVDVEVEX05PX0NBVENIID0gMDtcblxuICBmdW5jdGlvbiBtYWtlUmVzb2x2ZXIocHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxhbnk+LCBzdGF0ZTogYm9vbGVhbik6ICh2YWx1ZTogYW55KSA9PiB2b2lkIHtcbiAgICByZXR1cm4gKHYpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIHN0YXRlLCB2KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCBmYWxzZSwgZXJyKTtcbiAgICAgIH1cbiAgICAgIC8vIERvIG5vdCByZXR1cm4gdmFsdWUgb3IgeW91IHdpbGwgYnJlYWsgdGhlIFByb21pc2Ugc3BlYy5cbiAgICB9O1xuICB9XG5cbiAgY29uc3Qgb25jZSA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCB3YXNDYWxsZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiBmdW5jdGlvbiB3cmFwcGVyKHdyYXBwZWRGdW5jdGlvbjogRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHdhc0NhbGxlZCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3YXNDYWxsZWQgPSB0cnVlO1xuICAgICAgICB3cmFwcGVkRnVuY3Rpb24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgfTtcbiAgfTtcblxuICBjb25zdCBUWVBFX0VSUk9SID0gJ1Byb21pc2UgcmVzb2x2ZWQgd2l0aCBpdHNlbGYnO1xuICBjb25zdCBDVVJSRU5UX1RBU0tfVFJBQ0VfU1lNQk9MID0gX19zeW1ib2xfXygnY3VycmVudFRhc2tUcmFjZScpO1xuXG4gIC8vIFByb21pc2UgUmVzb2x1dGlvblxuICBmdW5jdGlvbiByZXNvbHZlUHJvbWlzZShcbiAgICAgIHByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55Piwgc3RhdGU6IGJvb2xlYW4sIHZhbHVlOiBhbnkpOiBab25lQXdhcmVQcm9taXNlPGFueT4ge1xuICAgIGNvbnN0IG9uY2VXcmFwcGVyID0gb25jZSgpO1xuICAgIGlmIChwcm9taXNlID09PSB2YWx1ZSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihUWVBFX0VSUk9SKTtcbiAgICB9XG4gICAgaWYgKChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID09PSBVTlJFU09MVkVEKSB7XG4gICAgICAvLyBzaG91bGQgb25seSBnZXQgdmFsdWUudGhlbiBvbmNlIGJhc2VkIG9uIHByb21pc2Ugc3BlYy5cbiAgICAgIGxldCB0aGVuOiBhbnkgPSBudWxsO1xuICAgICAgdHJ5IHtcbiAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgfHwgdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGhlbiA9IHZhbHVlICYmIHZhbHVlLnRoZW47XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBvbmNlV3JhcHBlcigoKSA9PiB7XG4gICAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycik7XG4gICAgICAgIH0pKCk7XG4gICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgfVxuICAgICAgLy8gaWYgKHZhbHVlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkge1xuICAgICAgaWYgKHN0YXRlICE9PSBSRUpFQ1RFRCAmJiB2YWx1ZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UgJiZcbiAgICAgICAgICB2YWx1ZS5oYXNPd25Qcm9wZXJ0eShzeW1ib2xTdGF0ZSkgJiYgdmFsdWUuaGFzT3duUHJvcGVydHkoc3ltYm9sVmFsdWUpICYmXG4gICAgICAgICAgKHZhbHVlIGFzIGFueSlbc3ltYm9sU3RhdGVdICE9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgIGNsZWFyUmVqZWN0ZWROb0NhdGNoKDxQcm9taXNlPGFueT4+dmFsdWUpO1xuICAgICAgICByZXNvbHZlUHJvbWlzZShwcm9taXNlLCAodmFsdWUgYXMgYW55KVtzeW1ib2xTdGF0ZV0sICh2YWx1ZSBhcyBhbnkpW3N5bWJvbFZhbHVlXSk7XG4gICAgICB9IGVsc2UgaWYgKHN0YXRlICE9PSBSRUpFQ1RFRCAmJiB0eXBlb2YgdGhlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHRoZW4uY2FsbChcbiAgICAgICAgICAgICAgdmFsdWUsIG9uY2VXcmFwcGVyKG1ha2VSZXNvbHZlcihwcm9taXNlLCBzdGF0ZSkpLFxuICAgICAgICAgICAgICBvbmNlV3JhcHBlcihtYWtlUmVzb2x2ZXIocHJvbWlzZSwgZmFsc2UpKSk7XG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgIG9uY2VXcmFwcGVyKCgpID0+IHtcbiAgICAgICAgICAgIHJlc29sdmVQcm9taXNlKHByb21pc2UsIGZhbHNlLCBlcnIpO1xuICAgICAgICAgIH0pKCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gc3RhdGU7XG4gICAgICAgIGNvbnN0IHF1ZXVlID0gKHByb21pc2UgYXMgYW55KVtzeW1ib2xWYWx1ZV07XG4gICAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdID0gdmFsdWU7XG5cbiAgICAgICAgaWYgKChwcm9taXNlIGFzIGFueSlbc3ltYm9sRmluYWxseV0gPT09IHN5bWJvbEZpbmFsbHkpIHtcbiAgICAgICAgICAvLyB0aGUgcHJvbWlzZSBpcyBnZW5lcmF0ZWQgYnkgUHJvbWlzZS5wcm90b3R5cGUuZmluYWxseVxuICAgICAgICAgIGlmIChzdGF0ZSA9PT0gUkVTT0xWRUQpIHtcbiAgICAgICAgICAgIC8vIHRoZSBzdGF0ZSBpcyByZXNvbHZlZCwgc2hvdWxkIGlnbm9yZSB0aGUgdmFsdWVcbiAgICAgICAgICAgIC8vIGFuZCB1c2UgcGFyZW50IHByb21pc2UgdmFsdWVcbiAgICAgICAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gKHByb21pc2UgYXMgYW55KVtzeW1ib2xQYXJlbnRQcm9taXNlU3RhdGVdO1xuICAgICAgICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xWYWx1ZV0gPSAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFBhcmVudFByb21pc2VWYWx1ZV07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVjb3JkIHRhc2sgaW5mb3JtYXRpb24gaW4gdmFsdWUgd2hlbiBlcnJvciBvY2N1cnMsIHNvIHdlIGNhblxuICAgICAgICAvLyBkbyBzb21lIGFkZGl0aW9uYWwgd29yayBzdWNoIGFzIHJlbmRlciBsb25nU3RhY2tUcmFjZVxuICAgICAgICBpZiAoc3RhdGUgPT09IFJFSkVDVEVEICYmIHZhbHVlIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICAvLyBjaGVjayBpZiBsb25nU3RhY2tUcmFjZVpvbmUgaXMgaGVyZVxuICAgICAgICAgIGNvbnN0IHRyYWNlID0gWm9uZS5jdXJyZW50VGFzayAmJiBab25lLmN1cnJlbnRUYXNrLmRhdGEgJiZcbiAgICAgICAgICAgICAgKFpvbmUuY3VycmVudFRhc2suZGF0YSBhcyBhbnkpW2NyZWF0aW9uVHJhY2VdO1xuICAgICAgICAgIGlmICh0cmFjZSkge1xuICAgICAgICAgICAgLy8gb25seSBrZWVwIHRoZSBsb25nIHN0YWNrIHRyYWNlIGludG8gZXJyb3Igd2hlbiBpbiBsb25nU3RhY2tUcmFjZVpvbmVcbiAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KFxuICAgICAgICAgICAgICAgIHZhbHVlLCBDVVJSRU5UX1RBU0tfVFJBQ0VfU1lNQk9MLFxuICAgICAgICAgICAgICAgIHtjb25maWd1cmFibGU6IHRydWUsIGVudW1lcmFibGU6IGZhbHNlLCB3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHRyYWNlfSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWV1ZS5sZW5ndGg7KSB7XG4gICAgICAgICAgc2NoZWR1bGVSZXNvbHZlT3JSZWplY3QocHJvbWlzZSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSwgcXVldWVbaSsrXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA9PSAwICYmIHN0YXRlID09IFJFSkVDVEVEKSB7XG4gICAgICAgICAgKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPSBSRUpFQ1RFRF9OT19DQVRDSDtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gdHJ5IHRvIHByaW50IG1vcmUgcmVhZGFibGUgZXJyb3IgbG9nXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgICAgICAgJ1VuY2F1Z2h0IChpbiBwcm9taXNlKTogJyArIHJlYWRhYmxlT2JqZWN0VG9TdHJpbmcodmFsdWUpICtcbiAgICAgICAgICAgICAgICAodmFsdWUgJiYgdmFsdWUuc3RhY2sgPyAnXFxuJyArIHZhbHVlLnN0YWNrIDogJycpKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGNvbnN0IGVycm9yOiBVbmNhdWdodFByb21pc2VFcnJvciA9IGVycjtcbiAgICAgICAgICAgIGVycm9yLnJlamVjdGlvbiA9IHZhbHVlO1xuICAgICAgICAgICAgZXJyb3IucHJvbWlzZSA9IHByb21pc2U7XG4gICAgICAgICAgICBlcnJvci56b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgZXJyb3IudGFzayA9IFpvbmUuY3VycmVudFRhc2shO1xuICAgICAgICAgICAgX3VuY2F1Z2h0UHJvbWlzZUVycm9ycy5wdXNoKGVycm9yKTtcbiAgICAgICAgICAgIGFwaS5zY2hlZHVsZU1pY3JvVGFzaygpOyAgLy8gdG8gbWFrZSBzdXJlIHRoYXQgaXQgaXMgcnVubmluZ1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICAvLyBSZXNvbHZpbmcgYW4gYWxyZWFkeSByZXNvbHZlZCBwcm9taXNlIGlzIGEgbm9vcC5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG4gIGNvbnN0IFJFSkVDVElPTl9IQU5ETEVEX0hBTkRMRVIgPSBfX3N5bWJvbF9fKCdyZWplY3Rpb25IYW5kbGVkSGFuZGxlcicpO1xuICBmdW5jdGlvbiBjbGVhclJlamVjdGVkTm9DYXRjaChwcm9taXNlOiBab25lQXdhcmVQcm9taXNlPGFueT4pOiB2b2lkIHtcbiAgICBpZiAoKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV0gPT09IFJFSkVDVEVEX05PX0NBVENIKSB7XG4gICAgICAvLyBpZiB0aGUgcHJvbWlzZSBpcyByZWplY3RlZCBubyBjYXRjaCBzdGF0dXNcbiAgICAgIC8vIGFuZCBxdWV1ZS5sZW5ndGggPiAwLCBtZWFucyB0aGVyZSBpcyBhIGVycm9yIGhhbmRsZXJcbiAgICAgIC8vIGhlcmUgdG8gaGFuZGxlIHRoZSByZWplY3RlZCBwcm9taXNlLCB3ZSBzaG91bGQgdHJpZ2dlclxuICAgICAgLy8gd2luZG93cy5yZWplY3Rpb25oYW5kbGVkIGV2ZW50SGFuZGxlciBvciBub2RlanMgcmVqZWN0aW9uSGFuZGxlZFxuICAgICAgLy8gZXZlbnRIYW5kbGVyXG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCBoYW5kbGVyID0gKFpvbmUgYXMgYW55KVtSRUpFQ1RJT05fSEFORExFRF9IQU5ETEVSXTtcbiAgICAgICAgaWYgKGhhbmRsZXIgJiYgdHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywge3JlamVjdGlvbjogKHByb21pc2UgYXMgYW55KVtzeW1ib2xWYWx1ZV0sIHByb21pc2U6IHByb21pc2V9KTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB9XG4gICAgICAocHJvbWlzZSBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9IFJFSkVDVEVEO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChwcm9taXNlID09PSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzW2ldLnByb21pc2UpIHtcbiAgICAgICAgICBfdW5jYXVnaHRQcm9taXNlRXJyb3JzLnNwbGljZShpLCAxKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlUmVzb2x2ZU9yUmVqZWN0PFIsIFUxLCBVMj4oXG4gICAgICBwcm9taXNlOiBab25lQXdhcmVQcm9taXNlPGFueT4sIHpvbmU6IEFtYmllbnRab25lLCBjaGFpblByb21pc2U6IFpvbmVBd2FyZVByb21pc2U8YW55PixcbiAgICAgIG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogUikgPT4gVTEpfG51bGx8dW5kZWZpbmVkLFxuICAgICAgb25SZWplY3RlZD86ICgoZXJyb3I6IGFueSkgPT4gVTIpfG51bGx8dW5kZWZpbmVkKTogdm9pZCB7XG4gICAgY2xlYXJSZWplY3RlZE5vQ2F0Y2gocHJvbWlzZSk7XG4gICAgY29uc3QgcHJvbWlzZVN0YXRlID0gKHByb21pc2UgYXMgYW55KVtzeW1ib2xTdGF0ZV07XG4gICAgY29uc3QgZGVsZWdhdGUgPSBwcm9taXNlU3RhdGUgP1xuICAgICAgICAodHlwZW9mIG9uRnVsZmlsbGVkID09PSAnZnVuY3Rpb24nKSA/IG9uRnVsZmlsbGVkIDogZm9yd2FyZFJlc29sdXRpb24gOlxuICAgICAgICAodHlwZW9mIG9uUmVqZWN0ZWQgPT09ICdmdW5jdGlvbicpID8gb25SZWplY3RlZCA6IGZvcndhcmRSZWplY3Rpb247XG4gICAgem9uZS5zY2hlZHVsZU1pY3JvVGFzayhzb3VyY2UsICgpID0+IHtcbiAgICAgIHRyeSB7XG4gICAgICAgIGNvbnN0IHBhcmVudFByb21pc2VWYWx1ZSA9IChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdO1xuICAgICAgICBjb25zdCBpc0ZpbmFsbHlQcm9taXNlID1cbiAgICAgICAgICAgIGNoYWluUHJvbWlzZSAmJiBzeW1ib2xGaW5hbGx5ID09PSAoY2hhaW5Qcm9taXNlIGFzIGFueSlbc3ltYm9sRmluYWxseV07XG4gICAgICAgIGlmIChpc0ZpbmFsbHlQcm9taXNlKSB7XG4gICAgICAgICAgLy8gaWYgdGhlIHByb21pc2UgaXMgZ2VuZXJhdGVkIGZyb20gZmluYWxseSBjYWxsLCBrZWVwIHBhcmVudCBwcm9taXNlJ3Mgc3RhdGUgYW5kIHZhbHVlXG4gICAgICAgICAgKGNoYWluUHJvbWlzZSBhcyBhbnkpW3N5bWJvbFBhcmVudFByb21pc2VWYWx1ZV0gPSBwYXJlbnRQcm9taXNlVmFsdWU7XG4gICAgICAgICAgKGNoYWluUHJvbWlzZSBhcyBhbnkpW3N5bWJvbFBhcmVudFByb21pc2VTdGF0ZV0gPSBwcm9taXNlU3RhdGU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2hvdWxkIG5vdCBwYXNzIHZhbHVlIHRvIGZpbmFsbHkgY2FsbGJhY2tcbiAgICAgICAgY29uc3QgdmFsdWUgPSB6b25lLnJ1bihcbiAgICAgICAgICAgIGRlbGVnYXRlLCB1bmRlZmluZWQsXG4gICAgICAgICAgICBpc0ZpbmFsbHlQcm9taXNlICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVqZWN0aW9uICYmIGRlbGVnYXRlICE9PSBmb3J3YXJkUmVzb2x1dGlvbiA/XG4gICAgICAgICAgICAgICAgW10gOlxuICAgICAgICAgICAgICAgIFtwYXJlbnRQcm9taXNlVmFsdWVdKTtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCB0cnVlLCB2YWx1ZSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAvLyBpZiBlcnJvciBvY2N1cnMsIHNob3VsZCBhbHdheXMgcmV0dXJuIHRoaXMgZXJyb3JcbiAgICAgICAgcmVzb2x2ZVByb21pc2UoY2hhaW5Qcm9taXNlLCBmYWxzZSwgZXJyb3IpO1xuICAgICAgfVxuICAgIH0sIGNoYWluUHJvbWlzZSBhcyBUYXNrRGF0YSk7XG4gIH1cblxuICBjb25zdCBaT05FX0FXQVJFX1BST01JU0VfVE9fU1RSSU5HID0gJ2Z1bmN0aW9uIFpvbmVBd2FyZVByb21pc2UoKSB7IFtuYXRpdmUgY29kZV0gfSc7XG5cbiAgY2xhc3MgWm9uZUF3YXJlUHJvbWlzZTxSPiBpbXBsZW1lbnRzIFByb21pc2U8Uj4ge1xuICAgIHN0YXRpYyB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiBaT05FX0FXQVJFX1BST01JU0VfVE9fU1RSSU5HO1xuICAgIH1cblxuICAgIHN0YXRpYyByZXNvbHZlPFI+KHZhbHVlOiBSKTogUHJvbWlzZTxSPiB7XG4gICAgICByZXR1cm4gcmVzb2x2ZVByb21pc2UoPFpvbmVBd2FyZVByb21pc2U8Uj4+bmV3IHRoaXMobnVsbCBhcyBhbnkpLCBSRVNPTFZFRCwgdmFsdWUpO1xuICAgIH1cblxuICAgIHN0YXRpYyByZWplY3Q8VT4oZXJyb3I6IFUpOiBQcm9taXNlPFU+IHtcbiAgICAgIHJldHVybiByZXNvbHZlUHJvbWlzZSg8Wm9uZUF3YXJlUHJvbWlzZTxVPj5uZXcgdGhpcyhudWxsIGFzIGFueSksIFJFSkVDVEVELCBlcnJvcik7XG4gICAgfVxuXG4gICAgc3RhdGljIHJhY2U8Uj4odmFsdWVzOiBQcm9taXNlTGlrZTxhbnk+W10pOiBQcm9taXNlPFI+IHtcbiAgICAgIGxldCByZXNvbHZlOiAodjogYW55KSA9PiB2b2lkO1xuICAgICAgbGV0IHJlamVjdDogKHY6IGFueSkgPT4gdm9pZDtcbiAgICAgIGxldCBwcm9taXNlOiBhbnkgPSBuZXcgdGhpcygocmVzLCByZWopID0+IHtcbiAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgfSk7XG4gICAgICBmdW5jdGlvbiBvblJlc29sdmUodmFsdWU6IGFueSkge1xuICAgICAgICBwcm9taXNlICYmIChwcm9taXNlID0gbnVsbCB8fCByZXNvbHZlKHZhbHVlKSk7XG4gICAgICB9XG4gICAgICBmdW5jdGlvbiBvblJlamVjdChlcnJvcjogYW55KSB7XG4gICAgICAgIHByb21pc2UgJiYgKHByb21pc2UgPSBudWxsIHx8IHJlamVjdChlcnJvcikpO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgaWYgKCFpc1RoZW5hYmxlKHZhbHVlKSkge1xuICAgICAgICAgIHZhbHVlID0gdGhpcy5yZXNvbHZlKHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZS50aGVuKG9uUmVzb2x2ZSwgb25SZWplY3QpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgfVxuXG4gICAgc3RhdGljIGFsbDxSPih2YWx1ZXM6IGFueSk6IFByb21pc2U8Uj4ge1xuICAgICAgbGV0IHJlc29sdmU6ICh2OiBhbnkpID0+IHZvaWQ7XG4gICAgICBsZXQgcmVqZWN0OiAodjogYW55KSA9PiB2b2lkO1xuICAgICAgbGV0IHByb21pc2UgPSBuZXcgdGhpczxSPigocmVzLCByZWopID0+IHtcbiAgICAgICAgcmVzb2x2ZSA9IHJlcztcbiAgICAgICAgcmVqZWN0ID0gcmVqO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFN0YXJ0IGF0IDIgdG8gcHJldmVudCBwcmVtYXR1cmVseSByZXNvbHZpbmcgaWYgLnRoZW4gaXMgY2FsbGVkIGltbWVkaWF0ZWx5LlxuICAgICAgbGV0IHVucmVzb2x2ZWRDb3VudCA9IDI7XG4gICAgICBsZXQgdmFsdWVJbmRleCA9IDA7XG5cbiAgICAgIGNvbnN0IHJlc29sdmVkVmFsdWVzOiBhbnlbXSA9IFtdO1xuICAgICAgZm9yIChsZXQgdmFsdWUgb2YgdmFsdWVzKSB7XG4gICAgICAgIGlmICghaXNUaGVuYWJsZSh2YWx1ZSkpIHtcbiAgICAgICAgICB2YWx1ZSA9IHRoaXMucmVzb2x2ZSh2YWx1ZSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBjdXJWYWx1ZUluZGV4ID0gdmFsdWVJbmRleDtcbiAgICAgICAgdmFsdWUudGhlbigodmFsdWU6IGFueSkgPT4ge1xuICAgICAgICAgIHJlc29sdmVkVmFsdWVzW2N1clZhbHVlSW5kZXhdID0gdmFsdWU7XG4gICAgICAgICAgdW5yZXNvbHZlZENvdW50LS07XG4gICAgICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICAgICAgcmVzb2x2ZSEocmVzb2x2ZWRWYWx1ZXMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgcmVqZWN0ISk7XG5cbiAgICAgICAgdW5yZXNvbHZlZENvdW50Kys7XG4gICAgICAgIHZhbHVlSW5kZXgrKztcbiAgICAgIH1cblxuICAgICAgLy8gTWFrZSB0aGUgdW5yZXNvbHZlZENvdW50IHplcm8tYmFzZWQgYWdhaW4uXG4gICAgICB1bnJlc29sdmVkQ291bnQgLT0gMjtcblxuICAgICAgaWYgKHVucmVzb2x2ZWRDb3VudCA9PT0gMCkge1xuICAgICAgICByZXNvbHZlIShyZXNvbHZlZFZhbHVlcyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9taXNlO1xuICAgIH1cblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBleGVjdXRvcjpcbiAgICAgICAgICAgIChyZXNvbHZlOiAodmFsdWU/OiBSfFByb21pc2VMaWtlPFI+KSA9PiB2b2lkLCByZWplY3Q6IChlcnJvcj86IGFueSkgPT4gdm9pZCkgPT4gdm9pZCkge1xuICAgICAgY29uc3QgcHJvbWlzZTogWm9uZUF3YXJlUHJvbWlzZTxSPiA9IHRoaXM7XG4gICAgICBpZiAoIShwcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IGJlIGFuIGluc3RhbmNlb2YgUHJvbWlzZS4nKTtcbiAgICAgIH1cbiAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sU3RhdGVdID0gVU5SRVNPTFZFRDtcbiAgICAgIChwcm9taXNlIGFzIGFueSlbc3ltYm9sVmFsdWVdID0gW107ICAvLyBxdWV1ZTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGV4ZWN1dG9yICYmIGV4ZWN1dG9yKG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRVNPTFZFRCksIG1ha2VSZXNvbHZlcihwcm9taXNlLCBSRUpFQ1RFRCkpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgcmVzb2x2ZVByb21pc2UocHJvbWlzZSwgZmFsc2UsIGVycm9yKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGVuPFRSZXN1bHQxID0gUiwgVFJlc3VsdDIgPSBuZXZlcj4oXG4gICAgICAgIG9uRnVsZmlsbGVkPzogKCh2YWx1ZTogUikgPT4gVFJlc3VsdDEgfCBQcm9taXNlTGlrZTxUUmVzdWx0MT4pfHVuZGVmaW5lZHxudWxsLFxuICAgICAgICBvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdDIgfCBQcm9taXNlTGlrZTxUUmVzdWx0Mj4pfHVuZGVmaW5lZHxcbiAgICAgICAgbnVsbCk6IFByb21pc2U8VFJlc3VsdDF8VFJlc3VsdDI+IHtcbiAgICAgIGNvbnN0IGNoYWluUHJvbWlzZTogUHJvbWlzZTxUUmVzdWx0MXxUUmVzdWx0Mj4gPVxuICAgICAgICAgIG5ldyAodGhpcy5jb25zdHJ1Y3RvciBhcyB0eXBlb2YgWm9uZUF3YXJlUHJvbWlzZSkobnVsbCBhcyBhbnkpO1xuICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGlmICgodGhpcyBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICg8YW55W10+KHRoaXMgYXMgYW55KVtzeW1ib2xWYWx1ZV0pLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZ1bGZpbGxlZCwgb25SZWplY3RlZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UsIG9uRnVsZmlsbGVkLCBvblJlamVjdGVkKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgfVxuXG4gICAgY2F0Y2g8VFJlc3VsdCA9IG5ldmVyPihvblJlamVjdGVkPzogKChyZWFzb246IGFueSkgPT4gVFJlc3VsdCB8IFByb21pc2VMaWtlPFRSZXN1bHQ+KXx1bmRlZmluZWR8XG4gICAgICAgICAgICAgICAgICAgICAgICAgICBudWxsKTogUHJvbWlzZTxSfFRSZXN1bHQ+IHtcbiAgICAgIHJldHVybiB0aGlzLnRoZW4obnVsbCwgb25SZWplY3RlZCk7XG4gICAgfVxuXG4gICAgZmluYWxseTxVPihvbkZpbmFsbHk/OiAoKSA9PiBVIHwgUHJvbWlzZUxpa2U8VT4pOiBQcm9taXNlPFI+IHtcbiAgICAgIGNvbnN0IGNoYWluUHJvbWlzZTogUHJvbWlzZTxSfG5ldmVyPiA9XG4gICAgICAgICAgbmV3ICh0aGlzLmNvbnN0cnVjdG9yIGFzIHR5cGVvZiBab25lQXdhcmVQcm9taXNlKShudWxsIGFzIGFueSk7XG4gICAgICAoY2hhaW5Qcm9taXNlIGFzIGFueSlbc3ltYm9sRmluYWxseV0gPSBzeW1ib2xGaW5hbGx5O1xuICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgIGlmICgodGhpcyBhcyBhbnkpW3N5bWJvbFN0YXRlXSA9PSBVTlJFU09MVkVEKSB7XG4gICAgICAgICg8YW55W10+KHRoaXMgYXMgYW55KVtzeW1ib2xWYWx1ZV0pLnB1c2goem9uZSwgY2hhaW5Qcm9taXNlLCBvbkZpbmFsbHksIG9uRmluYWxseSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzY2hlZHVsZVJlc29sdmVPclJlamVjdCh0aGlzLCB6b25lLCBjaGFpblByb21pc2UsIG9uRmluYWxseSwgb25GaW5hbGx5KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGFpblByb21pc2U7XG4gICAgfVxuICB9XG4gIC8vIFByb3RlY3QgYWdhaW5zdCBhZ2dyZXNzaXZlIG9wdGltaXplcnMgZHJvcHBpbmcgc2VlbWluZ2x5IHVudXNlZCBwcm9wZXJ0aWVzLlxuICAvLyBFLmcuIENsb3N1cmUgQ29tcGlsZXIgaW4gYWR2YW5jZWQgbW9kZS5cbiAgWm9uZUF3YXJlUHJvbWlzZVsncmVzb2x2ZSddID0gWm9uZUF3YXJlUHJvbWlzZS5yZXNvbHZlO1xuICBab25lQXdhcmVQcm9taXNlWydyZWplY3QnXSA9IFpvbmVBd2FyZVByb21pc2UucmVqZWN0O1xuICBab25lQXdhcmVQcm9taXNlWydyYWNlJ10gPSBab25lQXdhcmVQcm9taXNlLnJhY2U7XG4gIFpvbmVBd2FyZVByb21pc2VbJ2FsbCddID0gWm9uZUF3YXJlUHJvbWlzZS5hbGw7XG5cbiAgY29uc3QgTmF0aXZlUHJvbWlzZSA9IGdsb2JhbFtzeW1ib2xQcm9taXNlXSA9IGdsb2JhbFsnUHJvbWlzZSddO1xuICBjb25zdCBaT05FX0FXQVJFX1BST01JU0UgPSBab25lLl9fc3ltYm9sX18oJ1pvbmVBd2FyZVByb21pc2UnKTtcblxuICBsZXQgZGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihnbG9iYWwsICdQcm9taXNlJyk7XG4gIGlmICghZGVzYyB8fCBkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgIGRlc2MgJiYgZGVsZXRlIGRlc2Mud3JpdGFibGU7XG4gICAgZGVzYyAmJiBkZWxldGUgZGVzYy52YWx1ZTtcbiAgICBpZiAoIWRlc2MpIHtcbiAgICAgIGRlc2MgPSB7Y29uZmlndXJhYmxlOiB0cnVlLCBlbnVtZXJhYmxlOiB0cnVlfTtcbiAgICB9XG4gICAgZGVzYy5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAgIC8vIGlmIHdlIGFscmVhZHkgc2V0IFpvbmVBd2FyZVByb21pc2UsIHVzZSBwYXRjaGVkIG9uZVxuICAgICAgLy8gb3RoZXJ3aXNlIHJldHVybiBuYXRpdmUgb25lLlxuICAgICAgcmV0dXJuIGdsb2JhbFtaT05FX0FXQVJFX1BST01JU0VdID8gZ2xvYmFsW1pPTkVfQVdBUkVfUFJPTUlTRV0gOiBnbG9iYWxbc3ltYm9sUHJvbWlzZV07XG4gICAgfTtcbiAgICBkZXNjLnNldCA9IGZ1bmN0aW9uKE5ld05hdGl2ZVByb21pc2UpIHtcbiAgICAgIGlmIChOZXdOYXRpdmVQcm9taXNlID09PSBab25lQXdhcmVQcm9taXNlKSB7XG4gICAgICAgIC8vIGlmIHRoZSBOZXdOYXRpdmVQcm9taXNlIGlzIFpvbmVBd2FyZVByb21pc2VcbiAgICAgICAgLy8gc2F2ZSB0byBnbG9iYWxcbiAgICAgICAgZ2xvYmFsW1pPTkVfQVdBUkVfUFJPTUlTRV0gPSBOZXdOYXRpdmVQcm9taXNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaWYgdGhlIE5ld05hdGl2ZVByb21pc2UgaXMgbm90IFpvbmVBd2FyZVByb21pc2VcbiAgICAgICAgLy8gZm9yIGV4YW1wbGU6IGFmdGVyIGxvYWQgem9uZS5qcywgc29tZSBsaWJyYXJ5IGp1c3RcbiAgICAgICAgLy8gc2V0IGVzNi1wcm9taXNlIHRvIGdsb2JhbCwgaWYgd2Ugc2V0IGl0IHRvIGdsb2JhbFxuICAgICAgICAvLyBkaXJlY3RseSwgYXNzZXJ0Wm9uZVBhdGNoZWQgd2lsbCBmYWlsIGFuZCBhbmd1bGFyXG4gICAgICAgIC8vIHdpbGwgbm90IGxvYWRlZCwgc28gd2UganVzdCBzZXQgdGhlIE5ld05hdGl2ZVByb21pc2VcbiAgICAgICAgLy8gdG8gZ2xvYmFsW3N5bWJvbFByb21pc2VdLCBzbyB0aGUgcmVzdWx0IGlzIGp1c3QgbGlrZVxuICAgICAgICAvLyB3ZSBsb2FkIEVTNiBQcm9taXNlIGJlZm9yZSB6b25lLmpzXG4gICAgICAgIGdsb2JhbFtzeW1ib2xQcm9taXNlXSA9IE5ld05hdGl2ZVByb21pc2U7XG4gICAgICAgIGlmICghTmV3TmF0aXZlUHJvbWlzZS5wcm90b3R5cGVbc3ltYm9sVGhlbl0pIHtcbiAgICAgICAgICBwYXRjaFRoZW4oTmV3TmF0aXZlUHJvbWlzZSk7XG4gICAgICAgIH1cbiAgICAgICAgYXBpLnNldE5hdGl2ZVByb21pc2UoTmV3TmF0aXZlUHJvbWlzZSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIE9iamVjdERlZmluZVByb3BlcnR5KGdsb2JhbCwgJ1Byb21pc2UnLCBkZXNjKTtcbiAgfVxuXG4gIGdsb2JhbFsnUHJvbWlzZSddID0gWm9uZUF3YXJlUHJvbWlzZTtcblxuICBjb25zdCBzeW1ib2xUaGVuUGF0Y2hlZCA9IF9fc3ltYm9sX18oJ3RoZW5QYXRjaGVkJyk7XG5cbiAgZnVuY3Rpb24gcGF0Y2hUaGVuKEN0b3I6IEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgcHJvdG8gPSBDdG9yLnByb3RvdHlwZTtcblxuICAgIGNvbnN0IHByb3AgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sICd0aGVuJyk7XG4gICAgaWYgKHByb3AgJiYgKHByb3Aud3JpdGFibGUgPT09IGZhbHNlIHx8ICFwcm9wLmNvbmZpZ3VyYWJsZSkpIHtcbiAgICAgIC8vIGNoZWNrIEN0b3IucHJvdG90eXBlLnRoZW4gcHJvcGVydHlEZXNjcmlwdG9yIGlzIHdyaXRhYmxlIG9yIG5vdFxuICAgICAgLy8gaW4gbWV0ZW9yIGVudiwgd3JpdGFibGUgaXMgZmFsc2UsIHdlIHNob3VsZCBpZ25vcmUgc3VjaCBjYXNlXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgb3JpZ2luYWxUaGVuID0gcHJvdG8udGhlbjtcbiAgICAvLyBLZWVwIGEgcmVmZXJlbmNlIHRvIHRoZSBvcmlnaW5hbCBtZXRob2QuXG4gICAgcHJvdG9bc3ltYm9sVGhlbl0gPSBvcmlnaW5hbFRoZW47XG5cbiAgICBDdG9yLnByb3RvdHlwZS50aGVuID0gZnVuY3Rpb24ob25SZXNvbHZlOiBhbnksIG9uUmVqZWN0OiBhbnkpIHtcbiAgICAgIGNvbnN0IHdyYXBwZWQgPSBuZXcgWm9uZUF3YXJlUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIG9yaWdpbmFsVGhlbi5jYWxsKHRoaXMsIHJlc29sdmUsIHJlamVjdCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB3cmFwcGVkLnRoZW4ob25SZXNvbHZlLCBvblJlamVjdCk7XG4gICAgfTtcbiAgICAoQ3RvciBhcyBhbnkpW3N5bWJvbFRoZW5QYXRjaGVkXSA9IHRydWU7XG4gIH1cblxuICBhcGkucGF0Y2hUaGVuID0gcGF0Y2hUaGVuO1xuXG4gIGZ1bmN0aW9uIHpvbmVpZnkoZm46IEZ1bmN0aW9uKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHJlc3VsdFByb21pc2UgPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgaWYgKHJlc3VsdFByb21pc2UgaW5zdGFuY2VvZiBab25lQXdhcmVQcm9taXNlKSB7XG4gICAgICAgIHJldHVybiByZXN1bHRQcm9taXNlO1xuICAgICAgfVxuICAgICAgbGV0IGN0b3IgPSByZXN1bHRQcm9taXNlLmNvbnN0cnVjdG9yO1xuICAgICAgaWYgKCFjdG9yW3N5bWJvbFRoZW5QYXRjaGVkXSkge1xuICAgICAgICBwYXRjaFRoZW4oY3Rvcik7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmVzdWx0UHJvbWlzZTtcbiAgICB9O1xuICB9XG5cbiAgaWYgKE5hdGl2ZVByb21pc2UpIHtcbiAgICBwYXRjaFRoZW4oTmF0aXZlUHJvbWlzZSk7XG4gIH1cblxuICAvLyBUaGlzIGlzIG5vdCBwYXJ0IG9mIHB1YmxpYyBBUEksIGJ1dCBpdCBpcyB1c2VmdWwgZm9yIHRlc3RzLCBzbyB3ZSBleHBvc2UgaXQuXG4gIChQcm9taXNlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCd1bmNhdWdodFByb21pc2VFcnJvcnMnKV0gPSBfdW5jYXVnaHRQcm9taXNlRXJyb3JzO1xuICByZXR1cm4gWm9uZUF3YXJlUHJvbWlzZTtcbn0pO1xuIl19