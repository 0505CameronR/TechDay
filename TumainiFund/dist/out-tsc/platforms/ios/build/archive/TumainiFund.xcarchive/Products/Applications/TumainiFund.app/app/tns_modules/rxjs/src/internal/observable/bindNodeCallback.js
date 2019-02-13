"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var AsyncSubject_1 = require("../AsyncSubject");
var map_1 = require("../operators/map");
var canReportError_1 = require("../util/canReportError");
var isScheduler_1 = require("../util/isScheduler");
var isArray_1 = require("../util/isArray");
/**
 * Converts a Node.js-style callback API to a function that returns an
 * Observable.
 *
 * <span class="informal">It's just like {@link bindCallback}, but the
 * callback is expected to be of type `callback(error, result)`.</span>
 *
 * `bindNodeCallback` is not an operator because its input and output are not
 * Observables. The input is a function `func` with some parameters, but the
 * last parameter must be a callback function that `func` calls when it is
 * done. The callback function is expected to follow Node.js conventions,
 * where the first argument to the callback is an error object, signaling
 * whether call was successful. If that object is passed to callback, it means
 * something went wrong.
 *
 * The output of `bindNodeCallback` is a function that takes the same
 * parameters as `func`, except the last one (the callback). When the output
 * function is called with arguments, it will return an Observable.
 * If `func` calls its callback with error parameter present, Observable will
 * error with that value as well. If error parameter is not passed, Observable will emit
 * second parameter. If there are more parameters (third and so on),
 * Observable will emit an array with all arguments, except first error argument.
 *
 * Note that `func` will not be called at the same time output function is,
 * but rather whenever resulting Observable is subscribed. By default call to
 * `func` will happen synchronously after subscription, but that can be changed
 * with proper `scheduler` provided as optional third parameter. {@link SchedulerLike}
 * can also control when values from callback will be emitted by Observable.
 * To find out more, check out documentation for {@link bindCallback}, where
 * {@link SchedulerLike} works exactly the same.
 *
 * As in {@link bindCallback}, context (`this` property) of input function will be set to context
 * of returned function, when it is called.
 *
 * After Observable emits value, it will complete immediately. This means
 * even if `func` calls callback again, values from second and consecutive
 * calls will never appear on the stream. If you need to handle functions
 * that call callbacks multiple times, check out {@link fromEvent} or
 * {@link fromEventPattern} instead.
 *
 * Note that `bindNodeCallback` can be used in non-Node.js environments as well.
 * "Node.js-style" callbacks are just a convention, so if you write for
 * browsers or any other environment and API you use implements that callback style,
 * `bindNodeCallback` can be safely used on that API functions as well.
 *
 * Remember that Error object passed to callback does not have to be an instance
 * of JavaScript built-in `Error` object. In fact, it does not even have to an object.
 * Error parameter of callback function is interpreted as "present", when value
 * of that parameter is truthy. It could be, for example, non-zero number, non-empty
 * string or boolean `true`. In all of these cases resulting Observable would error
 * with that value. This means usually regular style callbacks will fail very often when
 * `bindNodeCallback` is used. If your Observable errors much more often then you
 * would expect, check if callback really is called in Node.js-style and, if not,
 * switch to {@link bindCallback} instead.
 *
 * Note that even if error parameter is technically present in callback, but its value
 * is falsy, it still won't appear in array emitted by Observable.
 *
 * ## Examples
 * ###  Read a file from the filesystem and get the data as an Observable
 * ```javascript
 * import * as fs from 'fs';
 * const readFileAsObservable = bindNodeCallback(fs.readFile);
 * const result = readFileAsObservable('./roadNames.txt', 'utf8');
 * result.subscribe(x => console.log(x), e => console.error(e));
 * ```
 *
 * ### Use on function calling callback with multiple arguments
 * ```javascript
 * someFunction((err, a, b) => {
 *   console.log(err); // null
 *   console.log(a); // 5
 *   console.log(b); // "some string"
 * });
 * const boundSomeFunction = bindNodeCallback(someFunction);
 * boundSomeFunction()
 * .subscribe(value => {
 *   console.log(value); // [5, "some string"]
 * });
 * ```
 *
 * ### Use on function calling callback in regular style
 * ```javascript
 * someFunction(a => {
 *   console.log(a); // 5
 * });
 * const boundSomeFunction = bindNodeCallback(someFunction);
 * boundSomeFunction()
 * .subscribe(
 *   value => {}             // never gets called
 *   err => console.log(err) // 5
 * );
 * ```
 *
 * @see {@link bindCallback}
 * @see {@link from}
 *
 * @param {function} func Function with a Node.js-style callback as the last parameter.
 * @param {SchedulerLike} [scheduler] The scheduler on which to schedule the
 * callbacks.
 * @return {function(...params: *): Observable} A function which returns the
 * Observable that delivers the same values the Node.js callback would
 * deliver.
 * @name bindNodeCallback
 */
function bindNodeCallback(callbackFunc, resultSelector, scheduler) {
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
                return bindNodeCallback(callbackFunc, scheduler).apply(void 0, args).pipe(map_1.map(function (args) { return isArray_1.isArray(args) ? resultSelector.apply(void 0, args) : resultSelector(args); }));
            };
        }
    }
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var params = {
            subject: undefined,
            args: args,
            callbackFunc: callbackFunc,
            scheduler: scheduler,
            context: this,
        };
        return new Observable_1.Observable(function (subscriber) {
            var context = params.context;
            var subject = params.subject;
            if (!scheduler) {
                if (!subject) {
                    subject = params.subject = new AsyncSubject_1.AsyncSubject();
                    var handler = function () {
                        var innerArgs = [];
                        for (var _i = 0; _i < arguments.length; _i++) {
                            innerArgs[_i] = arguments[_i];
                        }
                        var err = innerArgs.shift();
                        if (err) {
                            subject.error(err);
                            return;
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
                return scheduler.schedule(dispatch, 0, { params: params, subscriber: subscriber, context: context });
            }
        });
    };
}
exports.bindNodeCallback = bindNodeCallback;
function dispatch(state) {
    var _this = this;
    var params = state.params, subscriber = state.subscriber, context = state.context;
    var callbackFunc = params.callbackFunc, args = params.args, scheduler = params.scheduler;
    var subject = params.subject;
    if (!subject) {
        subject = params.subject = new AsyncSubject_1.AsyncSubject();
        var handler = function () {
            var innerArgs = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                innerArgs[_i] = arguments[_i];
            }
            var err = innerArgs.shift();
            if (err) {
                _this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
            }
            else {
                var value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
                _this.add(scheduler.schedule(dispatchNext, 0, { value: value, subject: subject }));
            }
        };
        try {
            callbackFunc.apply(context, args.concat([handler]));
        }
        catch (err) {
            this.add(scheduler.schedule(dispatchError, 0, { err: err, subject: subject }));
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(arg) {
    var value = arg.value, subject = arg.subject;
    subject.next(value);
    subject.complete();
}
function dispatchError(arg) {
    var err = arg.err, subject = arg.subject;
    subject.error(err);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZE5vZGVDYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kTm9kZUNhbGxiYWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUcvQyx3Q0FBdUM7QUFDdkMseURBQXdEO0FBQ3hELG1EQUFrRDtBQUNsRCwyQ0FBMEM7QUEyQzFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXdHRztBQUNILFNBQWdCLGdCQUFnQixDQUM5QixZQUFzQixFQUN0QixjQUFzQyxFQUN0QyxTQUF5QjtJQUd6QixJQUFJLGNBQWMsRUFBRTtRQUNsQixJQUFJLHlCQUFXLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0IsU0FBUyxHQUFHLGNBQWMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsa0JBQWtCO1lBQ2xCLE9BQU87Z0JBQUMsY0FBYztxQkFBZCxVQUFjLEVBQWQscUJBQWMsRUFBZCxJQUFjO29CQUFkLHlCQUFjOztnQkFBSyxPQUFBLGdCQUFnQixDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsZUFBSSxJQUFJLEVBQUUsSUFBSSxDQUNoRixTQUFHLENBQUMsVUFBQSxJQUFJLElBQUksT0FBQSxpQkFBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxjQUFjLGVBQUksSUFBSSxFQUFFLENBQUMsQ0FBQyxjQUFjLENBQUMsSUFBSSxD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Q0FBQyxDQUFDLENBQUM7YUFDdkY7aUJBQU07Z0JBQ0wsSUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO2dCQUMvRCxLQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQXFCLFlBQVksRUFBRSxDQUFDLEVBQUUsRUFBRSxLQUFLLE9BQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQzthQUN2RjtRQUNILENBQUMsQ0FBQztRQUVGLElBQUk7WUFDRixZQUFZLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBTSxJQUFJLFNBQUUsT0FBTyxHQUFFLENBQUM7U0FDakQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBc0IsYUFBYSxFQUFFLENBQUMsRUFBRSxFQUFFLEdBQUcsS0FBQSxFQUFFLE9BQU8sU0FBQSxFQUFFLENBQUMsQ0FBQyxDQUFDO1NBQ3ZGO0tBQ0Y7SUFFRCxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBT0QsU0FBUyxZQUFZLENBQUksR0FBdUI7SUFDdEMsSUFBQSxpQkFBSyxFQUFFLHFCQUFPLENBQVM7SUFDL0IsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDckIsQ0FBQztBQU9ELFNBQVMsYUFBYSxDQUFJLEdBQXdCO0lBQ3hDLElBQUEsYUFBRyxFQUFFLHFCQUFPLENBQVM7SUFDN0IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNyQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgQXN5bmNTdWJqZWN0IH0gZnJvbSAnLi4vQXN5bmNTdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFNjaGVkdWxlckFjdGlvbiwgU2NoZWR1bGVyTGlrZSB9IGZyb20gJy4uL3R5cGVzJztcbmltcG9ydCB7IG1hcCB9IGZyb20gJy4uL29wZXJhdG9ycy9tYXAnO1xuaW1wb3J0IHsgY2FuUmVwb3J0RXJyb3IgfSBmcm9tICcuLi91dGlsL2NhblJlcG9ydEVycm9yJztcbmltcG9ydCB7IGlzU2NoZWR1bGVyIH0gZnJvbSAnLi4vdXRpbC9pc1NjaGVkdWxlcic7XG5pbXBvcnQgeyBpc0FycmF5IH0gZnJvbSAnLi4vdXRpbC9pc0FycmF5JztcblxuLyogdHNsaW50OmRpc2FibGU6bWF4LWxpbmUtbGVuZ3RoICovXG4vKiogQGRlcHJlY2F0ZWQgcmVzdWx0U2VsZWN0b3IgaXMgZGVwcmVjYXRlZCwgcGlwZSB0byBtYXAgaW5zdGVhZCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9uLCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueT47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjEsIFIyPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMT4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMikgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjsgLyogdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGggKi9cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiBGdW5jdGlvbiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG4vKipcbiAqIENvbnZlcnRzIGEgTm9kZS5qcy1zdHlsZSBjYWxsYmFjayBBUEkgdG8gYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYW5cbiAqIE9ic2VydmFibGUuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJpbmZvcm1hbFwiPkl0J3MganVzdCBsaWtlIHtAbGluayBiaW5kQ2FsbGJhY2t9LCBidXQgdGhlXG4gKiBjYWxsYmFjayBpcyBleHBlY3RlZCB0byBiZSBvZiB0eXBlIGBjYWxsYmFjayhlcnJvciwgcmVzdWx0KWAuPC9zcGFuPlxuICpcbiAqIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyBub3QgYW4gb3BlcmF0b3IgYmVjYXVzZSBpdHMgaW5wdXQgYW5kIG91dHB1dCBhcmUgbm90XG4gKiBPYnNlcnZhYmxlcy4gVGhlIGlucHV0IGlzIGEgZnVuY3Rpb24gYGZ1bmNgIHdpdGggc29tZSBwYXJhbWV0ZXJzLCBidXQgdGhlXG4gKiBsYXN0IHBhcmFtZXRlciBtdXN0IGJlIGEgY2FsbGJhY2sgZnVuY3Rpb24gdGhhdCBgZnVuY2AgY2FsbHMgd2hlbiBpdCBpc1xuICogZG9uZS4gVGhlIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGV4cGVjdGVkIHRvIGZvbGxvdyBOb2RlLmpzIGNvbnZlbnRpb25zLFxuICogd2hlcmUgdGhlIGZpcnN0IGFyZ3VtZW50IHRvIHRoZSBjYWxsYmFjayBpcyBhbiBlcnJvciBvYmplY3QsIHNpZ25hbGluZ1xuICogd2hldGhlciBjYWxsIHdhcyBzdWNjZXNzZnVsLiBJZiB0aGF0IG9iamVjdCBpcyBwYXNzZWQgdG8gY2FsbGJhY2ssIGl0IG1lYW5zXG4gKiBzb21ldGhpbmcgd2VudCB3cm9uZy5cbiAqXG4gKiBUaGUgb3V0cHV0IG9mIGBiaW5kTm9kZUNhbGxiYWNrYCBpcyBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIHNhbWVcbiAqIHBhcmFtZXRlcnMgYXMgYGZ1bmNgLCBleGNlcHQgdGhlIGxhc3Qgb25lICh0aGUgY2FsbGJhY2spLiBXaGVuIHRoZSBvdXRwdXRcbiAqIGZ1bmN0aW9uIGlzIGNhbGxlZCB3aXRoIGFyZ3VtZW50cywgaXQgd2lsbCByZXR1cm4gYW4gT2JzZXJ2YWJsZS5cbiAqIElmIGBmdW5jYCBjYWxscyBpdHMgY2FsbGJhY2sgd2l0aCBlcnJvciBwYXJhbWV0ZXIgcHJlc2VudCwgT2JzZXJ2YWJsZSB3aWxsXG4gKiBlcnJvciB3aXRoIHRoYXQgdmFsdWUgYXMgd2VsbC4gSWYgZXJyb3IgcGFyYW1ldGVyIGlzIG5vdCBwYXNzZWQsIE9ic2VydmFibGUgd2lsbCBlbWl0XG4gKiBzZWNvbmQgcGFyYW1ldGVyLiBJZiB0aGVyZSBhcmUgbW9yZSBwYXJhbWV0ZXJzICh0aGlyZCBhbmQgc28gb24pLFxuICogT2JzZXJ2YWJsZSB3aWxsIGVtaXQgYW4gYXJyYXkgd2l0aCBhbGwgYXJndW1lbnRzLCBleGNlcHQgZmlyc3QgZXJyb3IgYXJndW1lbnQuXG4gKlxuICogTm90ZSB0aGF0IGBmdW5jYCB3aWxsIG5vdCBiZSBjYWxsZWQgYXQgdGhlIHNhbWUgdGltZSBvdXRwdXQgZnVuY3Rpb24gaXMsXG4gKiBidXQgcmF0aGVyIHdoZW5ldmVyIHJlc3VsdGluZyBPYnNlcnZhYmxlIGlzIHN1YnNjcmliZWQuIEJ5IGRlZmF1bHQgY2FsbCB0b1xuICogYGZ1bmNgIHdpbGwgaGFwcGVuIHN5bmNocm9ub3VzbHkgYWZ0ZXIgc3Vic2NyaXB0aW9uLCBidXQgdGhhdCBjYW4gYmUgY2hhbmdlZFxuICogd2l0aCBwcm9wZXIgYHNjaGVkdWxlcmAgcHJvdmlkZWQgYXMgb3B0aW9uYWwgdGhpcmQgcGFyYW1ldGVyLiB7QGxpbmsgU2NoZWR1bGVyTGlrZX1cbiAqIGNhbiBhbHNvIGNvbnRyb2wgd2hlbiB2YWx1ZXMgZnJvbSBjYWxsYmFjayB3aWxsIGJlIGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZS5cbiAqIFRvIGZpbmQgb3V0IG1vcmUsIGNoZWNrIG91dCBkb2N1bWVudGF0aW9uIGZvciB7QGxpbmsgYmluZENhbGxiYWNrfSwgd2hlcmVcbiAqIHtAbGluayBTY2hlZHVsZXJMaWtlfSB3b3JrcyBleGFjdGx5IHRoZSBzYW1lLlxuICpcbiAqIEFzIGluIHtAbGluayBiaW5kQ2FsbGJhY2t9LCBjb250ZXh0IChgdGhpc2AgcHJvcGVydHkpIG9mIGlucHV0IGZ1bmN0aW9uIHdpbGwgYmUgc2V0IHRvIGNvbnRleHRcbiAqIG9mIHJldHVybmVkIGZ1bmN0aW9uLCB3aGVuIGl0IGlzIGNhbGxlZC5cbiAqXG4gKiBBZnRlciBPYnNlcnZhYmxlIGVtaXRzIHZhbHVlLCBpdCB3aWxsIGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBUaGlzIG1lYW5zXG4gKiBldmVuIGlmIGBmdW5jYCBjYWxscyBjYWxsYmFjayBhZ2FpbiwgdmFsdWVzIGZyb20gc2Vjb25kIGFuZCBjb25zZWN1dGl2ZVxuICogY2FsbHMgd2lsbCBuZXZlciBhcHBlYXIgb24gdGhlIHN0cmVhbS4gSWYgeW91IG5lZWQgdG8gaGFuZGxlIGZ1bmN0aW9uc1xuICogdGhhdCBjYWxsIGNhbGxiYWNrcyBtdWx0aXBsZSB0aW1lcywgY2hlY2sgb3V0IHtAbGluayBmcm9tRXZlbnR9IG9yXG4gKiB7QGxpbmsgZnJvbUV2ZW50UGF0dGVybn0gaW5zdGVhZC5cbiAqXG4gKiBOb3RlIHRoYXQgYGJpbmROb2RlQ2FsbGJhY2tgIGNhbiBiZSB1c2VkIGluIG5vbi1Ob2RlLmpzIGVudmlyb25tZW50cyBhcyB3ZWxsLlxuICogXCJOb2RlLmpzLXN0eWxlXCIgY2FsbGJhY2tzIGFyZSBqdXN0IGEgY29udmVudGlvbiwgc28gaWYgeW91IHdyaXRlIGZvclxuICogYnJvd3NlcnMgb3IgYW55IG90aGVyIGVudmlyb25tZW50IGFuZCBBUEkgeW91IHVzZSBpbXBsZW1lbnRzIHRoYXQgY2FsbGJhY2sgc3R5bGUsXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgY2FuIGJlIHNhZmVseSB1c2VkIG9uIHRoYXQgQVBJIGZ1bmN0aW9ucyBhcyB3ZWxsLlxuICpcbiAqIFJlbWVtYmVyIHRoYXQgRXJyb3Igb2JqZWN0IHBhc3NlZCB0byBjYWxsYmFjayBkb2VzIG5vdCBoYXZlIHRvIGJlIGFuIGluc3RhbmNlXG4gKiBvZiBKYXZhU2NyaXB0IGJ1aWx0LWluIGBFcnJvcmAgb2JqZWN0LiBJbiBmYWN0LCBpdCBkb2VzIG5vdCBldmVuIGhhdmUgdG8gYW4gb2JqZWN0LlxuICogRXJyb3IgcGFyYW1ldGVyIG9mIGNhbGxiYWNrIGZ1bmN0aW9uIGlzIGludGVycHJldGVkIGFzIFwicHJlc2VudFwiLCB3aGVuIHZhbHVlXG4gKiBvZiB0aGF0IHBhcmFtZXRlciBpcyB0cnV0aHkuIEl0IGNvdWxkIGJlLCBmb3IgZXhhbXBsZSwgbm9uLXplcm8gbnVtYmVyLCBub24tZW1wdHlcbiAqIHN0cmluZyBvciBib29sZWFuIGB0cnVlYC4gSW4gYWxsIG9mIHRoZXNlIGNhc2VzIHJlc3VsdGluZyBPYnNlcnZhYmxlIHdvdWxkIGVycm9yXG4gKiB3aXRoIHRoYXQgdmFsdWUuIFRoaXMgbWVhbnMgdXN1YWxseSByZWd1bGFyIHN0eWxlIGNhbGxiYWNrcyB3aWxsIGZhaWwgdmVyeSBvZnRlbiB3aGVuXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgaXMgdXNlZC4gSWYgeW91ciBPYnNlcnZhYmxlIGVycm9ycyBtdWNoIG1vcmUgb2Z0ZW4gdGhlbiB5b3VcbiAqIHdvdWxkIGV4cGVjdCwgY2hlY2sgaWYgY2FsbGJhY2sgcmVhbGx5IGlzIGNhbGxlZCBpbiBOb2RlLmpzLXN0eWxlIGFuZCwgaWYgbm90LFxuICogc3dpdGNoIHRvIHtAbGluayBiaW5kQ2FsbGJhY2t9IGluc3RlYWQuXG4gKlxuICogTm90ZSB0aGF0IGV2ZW4gaWYgZXJyb3IgcGFyYW1ldGVyIGlzIHRlY2huaWNhbGx5IHByZXNlbnQgaW4gY2FsbGJhY2ssIGJ1dCBpdHMgdmFsdWVcbiAqIGlzIGZhbHN5LCBpdCBzdGlsbCB3b24ndCBhcHBlYXIgaW4gYXJyYXkgZW1pdHRlZCBieSBPYnNlcnZhYmxlLlxuICpcbiAqICMjIEV4YW1wbGVzXG4gKiAjIyMgIFJlYWQgYSBmaWxlIGZyb20gdGhlIGZpbGVzeXN0ZW0gYW5kIGdldCB0aGUgZGF0YSBhcyBhbiBPYnNlcnZhYmxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgKiBhcyBmcyBmcm9tICdmcyc7XG4gKiBjb25zdCByZWFkRmlsZUFzT2JzZXJ2YWJsZSA9IGJpbmROb2RlQ2FsbGJhY2soZnMucmVhZEZpbGUpO1xuICogY29uc3QgcmVzdWx0ID0gcmVhZEZpbGVBc09ic2VydmFibGUoJy4vcm9hZE5hbWVzLnR4dCcsICd1dGY4Jyk7XG4gKiByZXN1bHQuc3Vic2NyaWJlKHggPT4gY29uc29sZS5sb2coeCksIGUgPT4gY29uc29sZS5lcnJvcihlKSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIG9uIGZ1bmN0aW9uIGNhbGxpbmcgY2FsbGJhY2sgd2l0aCBtdWx0aXBsZSBhcmd1bWVudHNcbiAqIGBgYGphdmFzY3JpcHRcbiAqIHNvbWVGdW5jdGlvbigoZXJyLCBhLCBiKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGVycik7IC8vIG51bGxcbiAqICAgY29uc29sZS5sb2coYSk7IC8vIDVcbiAqICAgY29uc29sZS5sb2coYik7IC8vIFwic29tZSBzdHJpbmdcIlxuICogfSk7XG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmROb2RlQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKClcbiAqIC5zdWJzY3JpYmUodmFsdWUgPT4ge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZSk7IC8vIFs1LCBcInNvbWUgc3RyaW5nXCJdXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBVc2Ugb24gZnVuY3Rpb24gY2FsbGluZyBjYWxsYmFjayBpbiByZWd1bGFyIHN0eWxlXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oYSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiB9KTtcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZE5vZGVDYWxsYmFjayhzb21lRnVuY3Rpb24pO1xuICogYm91bmRTb21lRnVuY3Rpb24oKVxuICogLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4ge30gICAgICAgICAgICAgLy8gbmV2ZXIgZ2V0cyBjYWxsZWRcbiAqICAgZXJyID0+IGNvbnNvbGUubG9nKGVycikgLy8gNVxuICogKTtcbiAqIGBgYFxuICpcbiAqIEBzZWUge0BsaW5rIGJpbmRDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyBGdW5jdGlvbiB3aXRoIGEgTm9kZS5qcy1zdHlsZSBjYWxsYmFjayBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFRoZSBzY2hlZHVsZXIgb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlXG4gKiBjYWxsYmFja3MuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5wYXJhbXM6ICopOiBPYnNlcnZhYmxlfSBBIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlXG4gKiBPYnNlcnZhYmxlIHRoYXQgZGVsaXZlcnMgdGhlIHNhbWUgdmFsdWVzIHRoZSBOb2RlLmpzIGNhbGxiYWNrIHdvdWxkXG4gKiBkZWxpdmVyLlxuICogQG5hbWUgYmluZE5vZGVDYWxsYmFja1xuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxUPihcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbixcbiAgcmVzdWx0U2VsZWN0b3I6IEZ1bmN0aW9ufFNjaGVkdWxlckxpa2UsXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2Vcbik6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxUPiB7XG5cbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgaWYgKGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gYmluZE5vZGVDYWxsYmFjayhjYWxsYmFja0Z1bmMsIHNjaGVkdWxlcikoLi4uYXJncykucGlwZShcbiAgICAgICAgbWFwKGFyZ3MgPT4gaXNBcnJheShhcmdzKSA/IHJlc3VsdFNlbGVjdG9yKC4uLmFyZ3MpIDogcmVzdWx0U2VsZWN0b3IoYXJncykpXG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbih0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgcGFyYW1zOiBQYXJhbXNTdGF0ZTxUPiA9IHtcbiAgICAgIHN1YmplY3Q6IHVuZGVmaW5lZCxcbiAgICAgIGFyZ3MsXG4gICAgICBjYWxsYmFja0Z1bmMsXG4gICAgICBzY2hlZHVsZXIsXG4gICAgICBjb250ZXh0OiB0aGlzLFxuICAgIH07XG4gICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPFQ+KHN1YnNjcmliZXIgPT4ge1xuICAgICAgY29uc3QgeyBjb250ZXh0IH0gPSBwYXJhbXM7XG4gICAgICBsZXQgeyBzdWJqZWN0IH0gPSBwYXJhbXM7XG4gICAgICBpZiAoIXNjaGVkdWxlcikge1xuICAgICAgICBpZiAoIXN1YmplY3QpIHtcbiAgICAgICAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcnIgPSBpbm5lckFyZ3Muc2hpZnQoKTtcblxuICAgICAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgc3ViamVjdC5uZXh0KGlubmVyQXJncy5sZW5ndGggPD0gMSA/IGlubmVyQXJnc1swXSA6IGlubmVyQXJncyk7XG4gICAgICAgICAgICBzdWJqZWN0LmNvbXBsZXRlKCk7XG4gICAgICAgICAgfTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIGlmIChjYW5SZXBvcnRFcnJvcihzdWJqZWN0KSkge1xuICAgICAgICAgICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICBjb25zb2xlLndhcm4oZXJyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaFN0YXRlPFQ+PihkaXNwYXRjaCwgMCwgeyBwYXJhbXMsIHN1YnNjcmliZXIsIGNvbnRleHQgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmludGVyZmFjZSBEaXNwYXRjaFN0YXRlPFQ+IHtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgY29udGV4dDogYW55O1xuICBwYXJhbXM6IFBhcmFtc1N0YXRlPFQ+O1xufVxuXG5pbnRlcmZhY2UgUGFyYW1zU3RhdGU8VD4ge1xuICBjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uO1xuICBhcmdzOiBhbnlbXTtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXJMaWtlO1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGNvbnRleHQ6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2g8VD4odGhpczogU2NoZWR1bGVyQWN0aW9uPERpc3BhdGNoU3RhdGU8VD4+LCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPikge1xuICBjb25zdCB7IHBhcmFtcywgc3Vic2NyaWJlciwgY29udGV4dCB9ID0gc3RhdGU7XG4gIGNvbnN0IHsgY2FsbGJhY2tGdW5jLCBhcmdzLCBzY2hlZHVsZXIgfSA9IHBhcmFtcztcbiAgbGV0IHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdDtcblxuICBpZiAoIXN1YmplY3QpIHtcbiAgICBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG5cbiAgICBjb25zdCBoYW5kbGVyID0gKC4uLmlubmVyQXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IGVyciA9IGlubmVyQXJncy5zaGlmdCgpO1xuICAgICAgaWYgKGVycikge1xuICAgICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hFcnJvckFyZzxUPj4oZGlzcGF0Y2hFcnJvciwgMCwgeyBlcnIsIHN1YmplY3QgfSkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSBpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3M7XG4gICAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaE5leHRBcmc8VD4+KGRpc3BhdGNoTmV4dCwgMCwgeyB2YWx1ZSwgc3ViamVjdCB9KSk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHRyeSB7XG4gICAgICBjYWxsYmFja0Z1bmMuYXBwbHkoY29udGV4dCwgWy4uLmFyZ3MsIGhhbmRsZXJdKTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIHRoaXMuYWRkKHNjaGVkdWxlci5zY2hlZHVsZTxEaXNwYXRjaEVycm9yQXJnPFQ+PihkaXNwYXRjaEVycm9yLCAwLCB7IGVyciwgc3ViamVjdCB9KSk7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGQoc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hOZXh0QXJnPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICB2YWx1ZTogVDtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hOZXh0PFQ+KGFyZzogRGlzcGF0Y2hOZXh0QXJnPFQ+KSB7XG4gIGNvbnN0IHsgdmFsdWUsIHN1YmplY3QgfSA9IGFyZztcbiAgc3ViamVjdC5uZXh0KHZhbHVlKTtcbiAgc3ViamVjdC5jb21wbGV0ZSgpO1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hFcnJvckFyZzxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgZXJyOiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoRXJyb3I8VD4oYXJnOiBEaXNwYXRjaEVycm9yQXJnPFQ+KSB7XG4gIGNvbnN0IHsgZXJyLCBzdWJqZWN0IH0gPSBhcmc7XG4gIHN1YmplY3QuZXJyb3IoZXJyKTtcbn1cbiJdfQ==