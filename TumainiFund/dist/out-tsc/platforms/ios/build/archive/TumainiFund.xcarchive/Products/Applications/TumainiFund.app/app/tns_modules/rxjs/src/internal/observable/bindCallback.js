"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var AsyncSubject_1 = require("../AsyncSubject");
var map_1 = require("../operators/map");
var canReportError_1 = require("../util/canReportError");
var isArray_1 = require("../util/isArray");
var isScheduler_1 = require("../util/isScheduler");
// tslint:enable:max-line-length
/**
 * Converts a callback API to a function that returns an Observable.
 *
 * <span class="informal">Give it a function `f` of type `f(x, callback)` and
 * it will return a function `g` that when called as `g(x)` will output an
 * Observable.</span>
 *
 * `bindCallback` is not an operator because its input and output are not
 * Observables. The input is a function `func` with some parameters. The
 * last parameter must be a callback function that `func` calls when it is
 * done.
 *
 * The output of `bindCallback` is a function that takes the same parameters
 * as `func`, except the last one (the callback). When the output function
 * is called with arguments it will return an Observable. If function `func`
 * calls its callback with one argument, the Observable will emit that value.
 * If on the other hand the callback is called with multiple values the resulting
 * Observable will emit an array with said values as arguments.
 *
 * It is **very important** to remember that input function `func` is not called
 * when the output function is, but rather when the Observable returned by the output
 * function is subscribed. This means if `func` makes an AJAX request, that request
 * will be made every time someone subscribes to the resulting Observable, but not before.
 *
 * The last optional parameter - `scheduler` - can be used to control when the call
 * to `func` happens after someone subscribes to Observable, as well as when results
 * passed to callback will be emitted. By default, the subscription to an Observable calls `func`
 * synchronously, but using {@link asyncScheduler} as the last parameter will defer the call to `func`,
 * just like wrapping the call in `setTimeout` with a timeout of `0` would. If you were to use the async Scheduler
 * and call `subscribe` on the output Observable, all function calls that are currently executing
 * will end before `func` is invoked.
 *
 * By default, results passed to the callback are emitted immediately after `func` invokes the callback.
 * In particular, if the callback is called synchronously, then the subscription of the resulting Observable
 * will call the `next` function synchronously as well.  If you want to defer that call,
 * you may use {@link asyncScheduler} just as before.  This means that by using `Scheduler.async` you can
 * ensure that `func` always calls its callback asynchronously, thus avoiding terrifying Zalgo.
 *
 * Note that the Observable created by the output function will always emit a single value
 * and then complete immediately. If `func` calls the callback multiple times, values from subsequent
 * calls will not appear in the stream. If you need to listen for multiple calls,
 *  you probably want to use {@link fromEvent} or {@link fromEventPattern} instead.
 *
 * If `func` depends on some context (`this` property) and is not already bound, the context of `func`
 * will be the context that the output function has at call time. In particular, if `func`
 * is called as a method of some objec and if `func` is not already bound, in order to preserve the context
 * it is recommended that the context of the output function is set to that object as well.
 *
 * If the input function calls its callback in the "node style" (i.e. first argument to callback is
 * optional error parameter signaling whether the call failed or not), {@link bindNodeCallback}
 * provides convenient error handling and probably is a better choice.
 * `bindCallback` will treat such functions the same as any other and error parameters
 * (whether passed or not) will always be interpreted as regular callback argument.
 *
 * ## Examples
 *
 * ### Convert jQuery's getJSON to an Observable API
 * ```javascript
 * // Suppose we have jQuery.getJSON('/my/url', callback)
 * const getJSONAsObservable = bindCallback(jQuery.getJSON);
 * const result = getJSONAsObservable('/my/url');
 * result.subscribe(x => console.log(x), e => console.error(e));
 * ```
 *
 * ### Receive an array of arguments passed to a callback
 * ```javascript
 * someFunction((a, b, c) => {
 *   console.log(a); // 5
 *   console.log(b); // 'some string'
 *   console.log(c); // {someProperty: 'someValue'}
 * });
 *
 * const boundSomeFunction = bindCallback(someFunction);
 * boundSomeFunction().subscribe(values => {
 *   console.log(values) // [5, 'some string', {someProperty: 'someValue'}]
 * });
 * ```
 *
 * ### Compare behaviour with and without async Scheduler
 * ```javascript
 * function iCallMyCallbackSynchronously(cb) {
 *   cb();
 * }
 *
 * const boundSyncFn = bindCallback(iCallMyCallbackSynchronously);
 * const boundAsyncFn = bindCallback(iCallMyCallbackSynchronously, null, Rx.Scheduler.async);
 *
 * boundSyncFn().subscribe(() => console.log('I was sync!'));
 * boundAsyncFn().subscribe(() => console.log('I was async!'));
 * console.log('This happened...');
 *
 * // Logs:
 * // I was sync!
 * // This happened...
 * // I was async!
 * ```
 *
 * ### Use bindCallback on an object method
 * ```javascript
 * const boundMethod = bindCallback(someObject.methodWithCallback);
 * boundMethod.call(someObject) // make sure methodWithCallback has access to someObject
 * .subscribe(subscriber);
 * ```
 *
 * @see {@link bindNodeCallback}
 * @see {@link from}
 *
 * @param {function} func A function with a callback as the last parameter.
 * @param {SchedulerLike} [scheduler] The scheduler on which to schedule the
 * callbacks.
 * @return {function(...params: *): Observable} A function which returns the
 * Observable that delivers the same values the callback would deliver.
 * @name bindCallback
 */
function bindCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if (isScheduler_1.isScheduler(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            // DEPRECATED PATH
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return bindCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
            };
        }
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var context = this;
        var subject;
        var params = {
            context: context,
            subject: subject,
            callbackFunc: callbackFunc,
            scheduler: scheduler,
        };
        return new Observable_1.Observable(function (subscriber) {
            if (!scheduler) {
                if (!subject) {
                    subject = new AsyncSubject_1.AsyncSubject();
                    var handler = function () {
                        var innerArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            innerArgs[_i] = arguments[_i];
                        }
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, args.concat([handler]));
                    }
                    catch (err) {
                        if (canReportError_1.canReportError(subject)) {
                            subject.error(err);
                        }
                        else {
                            console.warn(err);
                        }
                    }
                }
                return subject.subscribe(subscriber);
            }
            else {
                var state = {
                    args: args, subscriber: subscriber, params: params,
                };
                return scheduler.schedule(dispatch, 0, state);
            }
        });
    };
}
exports.bindCallback = bindCallback;
function dispatch(state) {
    var _this = this;
    var self = this;
    var args = state.args, subscriber = state.subscriber, params = state.params;
    var callbackFunc = params.callbackFunc, context = params.context, scheduler = params.scheduler;
    var subject = params.subject;
    if (!subject) {
        subject = params.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function () {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i] = arguments[_i];
            }
            var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
            _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
        };
        try {
            callbackFunc.apply(context, args.concat([handler]));
        }
        catch (err) {
            subject.error(err);
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(state) {
    var value = state.value, subject = state.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(state) {
    var err = state.err, subject = state.subject;
    subject.error(err);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZENhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2JpbmRDYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLDRDQUEyQztBQUMzQyxnREFBK0M7QUFFL0Msd0NBQXVDO0FBQ3ZDLHlEQUF3RDtBQUN4RCwyQ0FBMEM7QUFDMUMsbURBQWtEO0FBK0NsRCxnQ0FBZ0M7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUhHO0FBQ0gsU0FBZ0IsWUFBWSxDQUMxQixZQUFzQixFQUN0QixjQUF1QyxFQUN2QyxTQUF5QjtJQUV6QixJQUFJLGNBQWMsRUFBRTtRQUNsQixJQUFJLHlCQUFXLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0IsU0FBUyxHQUFHLGNBQWMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsa0JBQWtCO1lBQ2xCLE9BQU87Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFBSyxPQUFBLFlBQVksQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGVBQUksSUFBSSxFQUFFLElBQUksQ0FDNUUsU0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQUEsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxlQUFJLElBQUksRUFBRSxDQUFDLENBQUMsY0FBYyxD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QUFNLElBQUksU0FBRSxPQUFPLEdBQUUsQ0FBQztTQUNqRDtRQUFDLE9BQU8sR0FBRyxFQUFFO1lBQ1osT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUNwQjtLQUNGO0lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQU9ELFNBQVMsWUFBWSxDQUF5QyxLQUFtQjtJQUN2RSxJQUFBLG1CQUFLLEVBQUUsdUJBQU8sQ0FBVztJQUNqQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNyQixDQUFDO0FBT0QsU0FBUyxhQUFhLENBQTBDLEtBQW9CO0lBQzFFLElBQUEsZUFBRyxFQUFFLHVCQUFPLENBQVc7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgU2NoZWR1bGVyTGlrZSwgU2NoZWR1bGVyQWN0aW9uIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgY2FuUmVwb3J0RXJyb3IgfSBmcm9tICcuLi91dGlsL2NhblJlcG9ydEVycm9yJztcbmltcG9ydCB7IGlzQXJyYXkgfSBmcm9tICcuLi91dGlsL2lzQXJyYXknO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcblxuLy8gdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgbm8gbG9uZ2VyIHN1cHBvcnRlZCwgdXNlIGEgbWFwcGluZyBmdW5jdGlvbi4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8UjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMT4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6ICgpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKHJlc3VsdDogUikgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8Uj47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEEsIFI+KGNhbGxiYWNrRnVuYzogKC4uLmFyZ3M6IEFycmF5PEEgfCAoKC4uLnJlc3VsdHM6IFJbXSkgPT4gYW55KT4pID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBBW10pID0+IE9ic2VydmFibGU8UltdPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbi8vIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoXG5cbi8qKlxuICogQ29udmVydHMgYSBjYWxsYmFjayBBUEkgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW4gT2JzZXJ2YWJsZS5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+R2l2ZSBpdCBhIGZ1bmN0aW9uIGBmYCBvZiB0eXBlIGBmKHgsIGNhbGxiYWNrKWAgYW5kXG4gKiBpdCB3aWxsIHJldHVybiBhIGZ1bmN0aW9uIGBnYCB0aGF0IHdoZW4gY2FsbGVkIGFzIGBnKHgpYCB3aWxsIG91dHB1dCBhblxuICogT2JzZXJ2YWJsZS48L3NwYW4+XG4gKlxuICogYGJpbmRDYWxsYmFja2AgaXMgbm90IGFuIG9wZXJhdG9yIGJlY2F1c2UgaXRzIGlucHV0IGFuZCBvdXRwdXQgYXJlIG5vdFxuICogT2JzZXJ2YWJsZXMuIFRoZSBpbnB1dCBpcyBhIGZ1bmN0aW9uIGBmdW5jYCB3aXRoIHNvbWUgcGFyYW1ldGVycy4gVGhlXG4gKiBsYXN0IHBhcmFtZXRlciBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBgZnVuY2AgY2FsbHMgd2hlbiBpdCBpc1xuICogZG9uZS5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIGBiaW5kQ2FsbGJhY2tgIGlzIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc2FtZSBwYXJhbWV0ZXJzXG4gKiBhcyBgZnVuY2AsIGV4Y2VwdCB0aGUgbGFzdCBvbmUgKHRoZSBjYWxsYmFjaykuIFdoZW4gdGhlIG91dHB1dCBmdW5jdGlvblxuICogaXMgY2FsbGVkIHdpdGggYXJndW1lbnRzIGl0IHdpbGwgcmV0dXJuIGFuIE9ic2VydmFibGUuIElmIGZ1bmN0aW9uIGBmdW5jYFxuICogY2FsbHMgaXRzIGNhbGxiYWNrIHdpdGggb25lIGFyZ3VtZW50LCB0aGUgT2JzZXJ2YWJsZSB3aWxsIGVtaXQgdGhhdCB2YWx1ZS5cbiAqIElmIG9uIHRoZSBvdGhlciBoYW5kIHRoZSBjYWxsYmFjayBpcyBjYWxsZWQgd2l0aCBtdWx0aXBsZSB2YWx1ZXMgdGhlIHJlc3VsdGluZ1xuICogT2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBzYWlkIHZhbHVlcyBhcyBhcmd1bWVudHMuXG4gKlxuICogSXQgaXMgKip2ZXJ5IGltcG9ydGFudCoqIHRvIHJlbWVtYmVyIHRoYXQgaW5wdXQgZnVuY3Rpb24gYGZ1bmNgIGlzIG5vdCBjYWxsZWRcbiAqIHdoZW4gdGhlIG91dHB1dCBmdW5jdGlvbiBpcywgYnV0IHJhdGhlciB3aGVuIHRoZSBPYnNlcnZhYmxlIHJldHVybmVkIGJ5IHRoZSBvdXRwdXRcbiAqIGZ1bmN0aW9uIGlzIHN1YnNjcmliZWQuIFRoaXMgbWVhbnMgaWYgYGZ1bmNgIG1ha2VzIGFuIEFKQVggcmVxdWVzdCwgdGhhdCByZXF1ZXN0XG4gKiB3aWxsIGJlIG1hZGUgZXZlcnkgdGltZSBzb21lb25lIHN1YnNjcmliZXMgdG8gdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlLCBidXQgbm90IGJlZm9yZS5cbiAqXG4gKiBUaGUgbGFzdCBvcHRpb25hbCBwYXJhbWV0ZXIgLSBgc2NoZWR1bGVyYCAtIGNhbiBiZSB1c2VkIHRvIGNvbnRyb2wgd2hlbiB0aGUgY2FsbFxuICogdG8gYGZ1bmNgIGhhcHBlbnMgYWZ0ZXIgc29tZW9uZSBzdWJzY3JpYmVzIHRvIE9ic2VydmFibGUsIGFzIHdlbGwgYXMgd2hlbiByZXN1bHRzXG4gKiBwYXNzZWQgdG8gY2FsbGJhY2sgd2lsbCBiZSBlbWl0dGVkLiBCeSBkZWZhdWx0LCB0aGUgc3Vic2NyaXB0aW9uIHRvIGFuIE9ic2VydmFibGUgY2FsbHMgYGZ1bmNgXG4gKiBzeW5jaHJvbm91c2x5LCBidXQgdXNpbmcge0BsaW5rIGFzeW5jU2NoZWR1bGVyfSBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIgd2lsbCBkZWZlciB0aGUgY2FsbCB0byBgZnVuY2AsXG4gKiBqdXN0IGxpa2Ugd3JhcHBpbmcgdGhlIGNhbGwgaW4gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYCB3b3VsZC4gSWYgeW91IHdlcmUgdG8gdXNlIHRoZSBhc3luYyBTY2hlZHVsZXJcbiAqIGFuZCBjYWxsIGBzdWJzY3JpYmVgIG9uIHRoZSBvdXRwdXQgT2JzZXJ2YWJsZSwgYWxsIGZ1bmN0aW9uIGNhbGxzIHRoYXQgYXJlIGN1cnJlbnRseSBleGVjdXRpbmdcbiAqIHdpbGwgZW5kIGJlZm9yZSBgZnVuY2AgaXMgaW52b2tlZC5cbiAqXG4gKiBCeSBkZWZhdWx0LCByZXN1bHRzIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgYXJlIGVtaXR0ZWQgaW1tZWRpYXRlbHkgYWZ0ZXIgYGZ1bmNgIGludm9rZXMgdGhlIGNhbGxiYWNrLlxuICogSW4gcGFydGljdWxhciwgaWYgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCBzeW5jaHJvbm91c2x5LCB0aGVuIHRoZSBzdWJzY3JpcHRpb24gb2YgdGhlIHJlc3VsdGluZyBPYnNlcnZhYmxlXG4gKiB3aWxsIGNhbGwgdGhlIGBuZXh0YCBmdW5jdGlvbiBzeW5jaHJvbm91c2x5IGFzIHdlbGwuICBJZiB5b3Ugd2FudCB0byBkZWZlciB0aGF0IGNhbGwsXG4gKiB5b3UgbWF5IHVzZSB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGp1c3QgYXMgYmVmb3JlLiAgVGhpcyBtZWFucyB0aGF0IGJ5IHVzaW5nIGBTY2hlZHVsZXIuYXN5bmNgIHlvdSBjYW5cbiAqIGVuc3VyZSB0aGF0IGBmdW5jYCBhbHdheXMgY2FsbHMgaXRzIGNhbGxiYWNrIGFzeW5jaHJvbm91c2x5LCB0aHVzIGF2b2lkaW5nIHRlcnJpZnlpbmcgWmFsZ28uXG4gKlxuICogTm90ZSB0aGF0IHRoZSBPYnNlcnZhYmxlIGNyZWF0ZWQgYnkgdGhlIG91dHB1dCBmdW5jdGlvbiB3aWxsIGFsd2F5cyBlbWl0IGEgc2luZ2xlIHZhbHVlXG4gKiBhbmQgdGhlbiBjb21wbGV0ZSBpbW1lZGlhdGVseS4gSWYgYGZ1bmNgIGNhbGxzIHRoZSBjYWxsYmFjayBtdWx0aXBsZSB0aW1lcywgdmFsdWVzIGZyb20gc3Vic2VxdWVudFxuICogY2FsbHMgd2lsbCBub3QgYXBwZWFyIGluIHRoZSBzdHJlYW0uIElmIHlvdSBuZWVkIHRvIGxpc3RlbiBmb3IgbXVsdGlwbGUgY2FsbHMsXG4gKiAgeW91IHByb2JhYmx5IHdhbnQgdG8gdXNlIHtAbGluayBmcm9tRXZlbnR9IG9yIHtAbGluayBmcm9tRXZlbnRQYXR0ZXJufSBpbnN0ZWFkLlxuICpcbiAqIElmIGBmdW5jYCBkZXBlbmRzIG9uIHNvbWUgY29udGV4dCAoYHRoaXNgIHByb3BlcnR5KSBhbmQgaXMgbm90IGFscmVhZHkgYm91bmQsIHRoZSBjb250ZXh0IG9mIGBmdW5jYFxuICogd2lsbCBiZSB0aGUgY29udGV4dCB0aGF0IHRoZSBvdXRwdXQgZnVuY3Rpb24gaGFzIGF0IGNhbGwgdGltZS4gSW4gcGFydGljdWxhciwgaWYgYGZ1bmNgXG4gKiBpcyBjYWxsZWQgYXMgYSBtZXRob2Qgb2Ygc29tZSBvYmplYyBhbmQgaWYgYGZ1bmNgIGlzIG5vdCBhbHJlYWR5IGJvdW5kLCBpbiBvcmRlciB0byBwcmVzZXJ2ZSB0aGUgY29udGV4dFxuICogaXQgaXMgcmVjb21tZW5kZWQgdGhhdCB0aGUgY29udGV4dCBvZiB0aGUgb3V0cHV0IGZ1bmN0aW9uIGlzIHNldCB0byB0aGF0IG9iamVjdCBhcyB3ZWxsLlxuICpcbiAqIElmIHRoZSBpbnB1dCBmdW5jdGlvbiBjYWxscyBpdHMgY2FsbGJhY2sgaW4gdGhlIFwibm9kZSBzdHlsZVwiIChpLmUuIGZpcnN0IGFyZ3VtZW50IHRvIGNhbGxiYWNrIGlzXG4gKiBvcHRpb25hbCBlcnJvciBwYXJhbWV0ZXIgc2lnbmFsaW5nIHdoZXRoZXIgdGhlIGNhbGwgZmFpbGVkIG9yIG5vdCksIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogcHJvdmlkZXMgY29udmVuaWVudCBlcnJvciBoYW5kbGluZyBhbmQgcHJvYmFibHkgaXMgYSBiZXR0ZXIgY2hvaWNlLlxuICogYGJpbmRDYWxsYmFja2Agd2lsbCB0cmVhdCBzdWNoIGZ1bmN0aW9ucyB0aGUgc2FtZSBhcyBhbnkgb3RoZXIgYW5kIGVycm9yIHBhcmFtZXRlcnNcbiAqICh3aGV0aGVyIHBhc3NlZCBvciBub3QpIHdpbGwgYWx3YXlzIGJlIGludGVycHJldGVkIGFzIHJlZ3VsYXIgY2FsbGJhY2sgYXJndW1lbnQuXG4gKlxuICogIyMgRXhhbXBsZXNcbiAqXG4gKiAjIyMgQ29udmVydCBqUXVlcnkncyBnZXRKU09OIHRvIGFuIE9ic2VydmFibGUgQVBJXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiAvLyBTdXBwb3NlIHdlIGhhdmUgalF1ZXJ5LmdldEpTT04oJy9teS91cmwnLCBjYWxsYmFjaylcbiAqIGNvbnN0IGdldEpTT05Bc09ic2VydmFibGUgPSBiaW5kQ2FsbGJhY2soalF1ZXJ5LmdldEpTT04pO1xuICogY29uc3QgcmVzdWx0ID0gZ2V0SlNPTkFzT2JzZXJ2YWJsZSgnL215L3VybCcpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICogYGBgXG4gKlxuICogIyMjIFJlY2VpdmUgYW4gYXJyYXkgb2YgYXJndW1lbnRzIHBhc3NlZCB0byBhIGNhbGxiYWNrXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oKGEsIGIsIGMpID0+IHtcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqICAgY29uc29sZS5sb2coYik7IC8vICdzb21lIHN0cmluZydcbiAqICAgY29uc29sZS5sb2coYyk7IC8vIHtzb21lUHJvcGVydHk6ICdzb21lVmFsdWUnfVxuICogfSk7XG4gKlxuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKCkuc3Vic2NyaWJlKHZhbHVlcyA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKHZhbHVlcykgLy8gWzUsICdzb21lIHN0cmluZycsIHtzb21lUHJvcGVydHk6ICdzb21lVmFsdWUnfV1cbiAqIH0pO1xuICogYGBgXG4gKlxuICogIyMjIENvbXBhcmUgYmVoYXZpb3VyIHdpdGggYW5kIHdpdGhvdXQgYXN5bmMgU2NoZWR1bGVyXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBmdW5jdGlvbiBpQ2FsbE15Q2FsbGJhY2tTeW5jaHJvbm91c2x5KGNiKSB7XG4gKiAgIGNiKCk7XG4gKiB9XG4gKlxuICogY29uc3QgYm91bmRTeW5jRm4gPSBiaW5kQ2FsbGJhY2soaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseSk7XG4gKiBjb25zdCBib3VuZEFzeW5jRm4gPSBiaW5kQ2FsbGJhY2soaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseSwgbnVsbCwgUnguU2NoZWR1bGVyLmFzeW5jKTtcbiAqXG4gKiBib3VuZFN5bmNGbigpLnN1YnNjcmliZSgoKSA9PiBjb25zb2xlLmxvZygnSSB3YXMgc3luYyEnKSk7XG4gKiBib3VuZEFzeW5jRm4oKS5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ0kgd2FzIGFzeW5jIScpKTtcbiAqIGNvbnNvbGUubG9nKCdUaGlzIGhhcHBlbmVkLi4uJyk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIEkgd2FzIHN5bmMhXG4gKiAvLyBUaGlzIGhhcHBlbmVkLi4uXG4gKiAvLyBJIHdhcyBhc3luYyFcbiAqIGBgYFxuICpcbiAqICMjIyBVc2UgYmluZENhbGxiYWNrIG9uIGFuIG9iamVjdCBtZXRob2RcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGNvbnN0IGJvdW5kTWV0aG9kID0gYmluZENhbGxiYWNrKHNvbWVPYmplY3QubWV0aG9kV2l0aENhbGxiYWNrKTtcbiAqIGJvdW5kTWV0aG9kLmNhbGwoc29tZU9iamVjdCkgLy8gbWFrZSBzdXJlIG1ldGhvZFdpdGhDYWxsYmFjayBoYXMgYWNjZXNzIHRvIHNvbWVPYmplY3RcbiAqIC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBiaW5kTm9kZUNhbGxiYWNrfVxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBmdW5jIEEgZnVuY3Rpb24gd2l0aCBhIGNhbGxiYWNrIGFzIHRoZSBsYXN0IHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gVGhlIHNjaGVkdWxlciBvbiB3aGljaCB0byBzY2hlZHVsZSB0aGVcbiAqIGNhbGxiYWNrcy5cbiAqIEByZXR1cm4ge2Z1bmN0aW9uKC4uLnBhcmFtczogKik6IE9ic2VydmFibGV9IEEgZnVuY3Rpb24gd2hpY2ggcmV0dXJucyB0aGVcbiAqIE9ic2VydmFibGUgdGhhdCBkZWxpdmVycyB0aGUgc2FtZSB2YWx1ZXMgdGhlIGNhbGxiYWNrIHdvdWxkIGRlbGl2ZXIuXG4gKiBAbmFtZSBiaW5kQ2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxUPihcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbixcbiAgcmVzdWx0U2VsZWN0b3I/OiBGdW5jdGlvbnxTY2hlZHVsZXJMaWtlLFxuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlXG4pOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8VD4ge1xuICBpZiAocmVzdWx0U2VsZWN0b3IpIHtcbiAgICBpZiAoaXNTY2hlZHVsZXIocmVzdWx0U2VsZWN0b3IpKSB7XG4gICAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3RvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gREVQUkVDQVRFRCBQQVRIXG4gICAgICByZXR1cm4gKC4uLmFyZ3M6IGFueVtdKSA9PiBiaW5kQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCBzY2hlZHVsZXIpKC4uLmFyZ3MpLnBpcGUoXG4gICAgICAgIG1hcCgoYXJncykgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpLFxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKHRoaXM6IGFueSwgLi4uYXJnczogYW55W10pOiBPYnNlcnZhYmxlPFQ+IHtcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcztcbiAgICBsZXQgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICAgIGNvbnN0IHBhcmFtcyA9IHtcbiAgICAgIGNvbnRleHQsXG4gICAgICBzdWJqZWN0LFxuICAgICAgY2FsbGJhY2tGdW5jLFxuICAgICAgc2NoZWR1bGVyLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcbiAgICAgICAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIHN1YmplY3QubmV4dChpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2FuUmVwb3J0RXJyb3Ioc3ViamVjdCkpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN0YXRlOiBEaXNwYXRjaFN0YXRlPFQ+ID0ge1xuICAgICAgICAgIGFyZ3MsIHN1YnNjcmliZXIsIHBhcmFtcyxcbiAgICAgICAgfTtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaFN0YXRlPFQ+PihkaXNwYXRjaCwgMCwgc3RhdGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hTdGF0ZTxUPiB7XG4gIGFyZ3M6IGFueVtdO1xuICBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPFQ+O1xuICBwYXJhbXM6IFBhcmFtc0NvbnRleHQ8VD47XG59XG5cbmludGVyZmFjZSBQYXJhbXNDb250ZXh0PFQ+IHtcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbjtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlO1xuICBjb250ZXh0OiBhbnk7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoU3RhdGU8VD4+LCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPikge1xuICBjb25zdCBzZWxmID0gdGhpcztcbiAgY29uc3QgeyBhcmdzLCBzdWJzY3JpYmVyLCBwYXJhbXMgfSA9IHN0YXRlO1xuICBjb25zdCB7IGNhbGxiYWNrRnVuYywgY29udGV4dCwgc2NoZWR1bGVyIH0gPSBwYXJhbXM7XG4gIGxldCB7IHN1YmplY3QgfSA9IHBhcmFtcztcbiAgaWYgKCFzdWJqZWN0KSB7XG4gICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncztcbiAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxOZXh0U3RhdGU8VD4+KGRpc3BhdGNoTmV4dCwgMCwgeyB2YWx1ZSwgc3ViamVjdCB9KSk7XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICB9XG4gIH1cblxuICB0aGlzLmFkZChzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKSk7XG59XG5cbmludGVyZmFjZSBOZXh0U3RhdGU8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIHZhbHVlOiBUO1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaE5leHQ8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPE5leHRTdGF0ZTxUPj4sIHN0YXRlOiBOZXh0U3RhdGU8VD4pIHtcbiAgY29uc3QgeyB2YWx1ZSwgc3ViamVjdCB9ID0gc3RhdGU7XG4gIHN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIHN1YmplY3QuY29tcGxldGUoKTtcbn1cblxuaW50ZXJmYWNlIEVycm9yU3RhdGU8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGVycjogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxFcnJvclN0YXRlPFQ+Piwgc3RhdGU6IEVycm9yU3RhdGU8VD4pIHtcbiAgY29uc3QgeyBlcnIsIHN1YmplY3QgfSA9IHN0YXRlO1xuICBzdWJqZWN0LmVycm9yKGVycik7XG59XG4iXX0=