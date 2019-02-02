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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZE5vZGVDYWxsYmFjay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvYmluZE5vZGVDYWxsYmFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDRDQUEyQztBQUMzQyxnREFBK0M7QUFHL0Msd0NBQXVDO0FBQ3ZDLHlEQUF3RDtBQUN4RCxtREFBa0Q7QUFDbEQsMkNBQTBDO0FBMkMxQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3R0c7QUFDSCxTQUFnQixnQkFBZ0IsQ0FDOUIsWUFBc0IsRUFDdEIsY0FBc0MsRUFDdEMsU0FBeUI7SUFHekIsSUFBSSxjQUFjLEVBQUU7UUFDbEIsSUFBSSx5QkFBVyxDQUFDLGNBQWMsQ0FBQyxFQUFFO1lBQy9CLFNBQVMsR0FBRyxjQUFjLENBQUM7U0FDNUI7YUFBTTtZQUNMLGtCQUFrQjtZQUNsQixPQUFPO2dCQUFDLGNBQWM7cUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztvQkFBZCx5QkFBYzs7Z0JBQUssT0FBQSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsU0FBUyxDQUFDLGVBQUksSUFBSSxFQUFFLElBQUksQ0FDaEYsU0FBRyxDQUFDLFVBQUEsSUFBSSxJQUFJLE9BQUEsaUJBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxlQUFJLElBQUksRUFBRSxDQUFDLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUE5RCxDQUE4RCxDQUFDLENBQzVFO1lBRjBCLENBRTFCLENBQUM7U0FDSDtLQUNGO0lBRUQsT0FBTztRQUFvQixjQUFjO2FB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LENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztnQkFDL0QsS0FBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFxQixZQUFZLEVBQUUsQ0FBQyxFQUFFLEVBQUUsS0FBSyxPQUFBLEVBQUUsT0FBTyxTQUFBLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDdkY7UUFDSCxDQUFDLENBQUM7UUFFRixJQUFJO1lBQ0YsWUFBWSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQU0sSUFBSSxTQUFFLE9BQU8sR0FBRSxDQUFDO1NBQ2pEO1FBQUMsT0FBTyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQXNCLGFBQWEsRUFBRSxDQUFDLEVBQUUsRUFBRSxHQUFHLEtBQUEsRUFBRSxPQUFPLFNBQUEsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN2RjtLQUNGO0lBRUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQU9ELFNBQVMsWUFBWSxDQUFJLEdBQXVCO0lBQ3RDLElBQUEsaUJBQUssRUFBRSxxQkFBTyxDQUFTO0lBQy9CLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQ3JCLENBQUM7QUFPRCxTQUFTLGFBQWEsQ0FBSSxHQUF3QjtJQUN4QyxJQUFBLGFBQUcsRUFBRSxxQkFBTyxDQUFTO0lBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDckIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICcuLi9PYnNlcnZhYmxlJztcbmltcG9ydCB7IEFzeW5jU3ViamVjdCB9IGZyb20gJy4uL0FzeW5jU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTY2hlZHVsZXJBY3Rpb24sIFNjaGVkdWxlckxpa2UgfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBtYXAgfSBmcm9tICcuLi9vcGVyYXRvcnMvbWFwJztcbmltcG9ydCB7IGNhblJlcG9ydEVycm9yIH0gZnJvbSAnLi4vdXRpbC9jYW5SZXBvcnRFcnJvcic7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5cbi8qIHRzbGludDpkaXNhYmxlOm1heC1saW5lLWxlbmd0aCAqL1xuLyoqIEBkZXByZWNhdGVkIHJlc3VsdFNlbGVjdG9yIGlzIGRlcHJlY2F0ZWQsIHBpcGUgdG8gbWFwIGluc3RlYWQgKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbiwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnk+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICguLi5hcmdzOiBhbnlbXSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8UjE+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChlcnI6IGFueSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoZXJyOiBhbnkpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZE5vZGVDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMsIHJlczQ6IFI0LCAuLi5hcmdzOiBhbnlbXSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoZXJyOiBhbnksIHJlczE6IFIxLCByZXMyOiBSMiwgcmVzMzogUjMpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChlcnI6IGFueSwgcmVzMTogUjEsIHJlczI6IFIyKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55LCByZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1LCBjYWxsYmFjazogKGVycjogYW55KSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8dm9pZD47IC8qIHRzbGludDplbmFibGU6bWF4LWxpbmUtbGVuZ3RoICovXG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kTm9kZUNhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55W10+O1xuLyoqXG4gKiBDb252ZXJ0cyBhIE5vZGUuanMtc3R5bGUgY2FsbGJhY2sgQVBJIHRvIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGFuXG4gKiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5JdCdzIGp1c3QgbGlrZSB7QGxpbmsgYmluZENhbGxiYWNrfSwgYnV0IHRoZVxuICogY2FsbGJhY2sgaXMgZXhwZWN0ZWQgdG8gYmUgb2YgdHlwZSBgY2FsbGJhY2soZXJyb3IsIHJlc3VsdClgLjwvc3Bhbj5cbiAqXG4gKiBgYmluZE5vZGVDYWxsYmFja2AgaXMgbm90IGFuIG9wZXJhdG9yIGJlY2F1c2UgaXRzIGlucHV0IGFuZCBvdXRwdXQgYXJlIG5vdFxuICogT2JzZXJ2YWJsZXMuIFRoZSBpbnB1dCBpcyBhIGZ1bmN0aW9uIGBmdW5jYCB3aXRoIHNvbWUgcGFyYW1ldGVycywgYnV0IHRoZVxuICogbGFzdCBwYXJhbWV0ZXIgbXVzdCBiZSBhIGNhbGxiYWNrIGZ1bmN0aW9uIHRoYXQgYGZ1bmNgIGNhbGxzIHdoZW4gaXQgaXNcbiAqIGRvbmUuIFRoZSBjYWxsYmFjayBmdW5jdGlvbiBpcyBleHBlY3RlZCB0byBmb2xsb3cgTm9kZS5qcyBjb252ZW50aW9ucyxcbiAqIHdoZXJlIHRoZSBmaXJzdCBhcmd1bWVudCB0byB0aGUgY2FsbGJhY2sgaXMgYW4gZXJyb3Igb2JqZWN0LCBzaWduYWxpbmdcbiAqIHdoZXRoZXIgY2FsbCB3YXMgc3VjY2Vzc2Z1bC4gSWYgdGhhdCBvYmplY3QgaXMgcGFzc2VkIHRvIGNhbGxiYWNrLCBpdCBtZWFuc1xuICogc29tZXRoaW5nIHdlbnQgd3JvbmcuXG4gKlxuICogVGhlIG91dHB1dCBvZiBgYmluZE5vZGVDYWxsYmFja2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzYW1lXG4gKiBwYXJhbWV0ZXJzIGFzIGBmdW5jYCwgZXhjZXB0IHRoZSBsYXN0IG9uZSAodGhlIGNhbGxiYWNrKS4gV2hlbiB0aGUgb3V0cHV0XG4gKiBmdW5jdGlvbiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMsIGl0IHdpbGwgcmV0dXJuIGFuIE9ic2VydmFibGUuXG4gKiBJZiBgZnVuY2AgY2FsbHMgaXRzIGNhbGxiYWNrIHdpdGggZXJyb3IgcGFyYW1ldGVyIHByZXNlbnQsIE9ic2VydmFibGUgd2lsbFxuICogZXJyb3Igd2l0aCB0aGF0IHZhbHVlIGFzIHdlbGwuIElmIGVycm9yIHBhcmFtZXRlciBpcyBub3QgcGFzc2VkLCBPYnNlcnZhYmxlIHdpbGwgZW1pdFxuICogc2Vjb25kIHBhcmFtZXRlci4gSWYgdGhlcmUgYXJlIG1vcmUgcGFyYW1ldGVycyAodGhpcmQgYW5kIHNvIG9uKSxcbiAqIE9ic2VydmFibGUgd2lsbCBlbWl0IGFuIGFycmF5IHdpdGggYWxsIGFyZ3VtZW50cywgZXhjZXB0IGZpcnN0IGVycm9yIGFyZ3VtZW50LlxuICpcbiAqIE5vdGUgdGhhdCBgZnVuY2Agd2lsbCBub3QgYmUgY2FsbGVkIGF0IHRoZSBzYW1lIHRpbWUgb3V0cHV0IGZ1bmN0aW9uIGlzLFxuICogYnV0IHJhdGhlciB3aGVuZXZlciByZXN1bHRpbmcgT2JzZXJ2YWJsZSBpcyBzdWJzY3JpYmVkLiBCeSBkZWZhdWx0IGNhbGwgdG9cbiAqIGBmdW5jYCB3aWxsIGhhcHBlbiBzeW5jaHJvbm91c2x5IGFmdGVyIHN1YnNjcmlwdGlvbiwgYnV0IHRoYXQgY2FuIGJlIGNoYW5nZWRcbiAqIHdpdGggcHJvcGVyIGBzY2hlZHVsZXJgIHByb3ZpZGVkIGFzIG9wdGlvbmFsIHRoaXJkIHBhcmFtZXRlci4ge0BsaW5rIFNjaGVkdWxlckxpa2V9XG4gKiBjYW4gYWxzbyBjb250cm9sIHdoZW4gdmFsdWVzIGZyb20gY2FsbGJhY2sgd2lsbCBiZSBlbWl0dGVkIGJ5IE9ic2VydmFibGUuXG4gKiBUbyBmaW5kIG91dCBtb3JlLCBjaGVjayBvdXQgZG9jdW1lbnRhdGlvbiBmb3Ige0BsaW5rIGJpbmRDYWxsYmFja30sIHdoZXJlXG4gKiB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gd29ya3MgZXhhY3RseSB0aGUgc2FtZS5cbiAqXG4gKiBBcyBpbiB7QGxpbmsgYmluZENhbGxiYWNrfSwgY29udGV4dCAoYHRoaXNgIHByb3BlcnR5KSBvZiBpbnB1dCBmdW5jdGlvbiB3aWxsIGJlIHNldCB0byBjb250ZXh0XG4gKiBvZiByZXR1cm5lZCBmdW5jdGlvbiwgd2hlbiBpdCBpcyBjYWxsZWQuXG4gKlxuICogQWZ0ZXIgT2JzZXJ2YWJsZSBlbWl0cyB2YWx1ZSwgaXQgd2lsbCBjb21wbGV0ZSBpbW1lZGlhdGVseS4gVGhpcyBtZWFuc1xuICogZXZlbiBpZiBgZnVuY2AgY2FsbHMgY2FsbGJhY2sgYWdhaW4sIHZhbHVlcyBmcm9tIHNlY29uZCBhbmQgY29uc2VjdXRpdmVcbiAqIGNhbGxzIHdpbGwgbmV2ZXIgYXBwZWFyIG9uIHRoZSBzdHJlYW0uIElmIHlvdSBuZWVkIHRvIGhhbmRsZSBmdW5jdGlvbnNcbiAqIHRoYXQgY2FsbCBjYWxsYmFja3MgbXVsdGlwbGUgdGltZXMsIGNoZWNrIG91dCB7QGxpbmsgZnJvbUV2ZW50fSBvclxuICoge0BsaW5rIGZyb21FdmVudFBhdHRlcm59IGluc3RlYWQuXG4gKlxuICogTm90ZSB0aGF0IGBiaW5kTm9kZUNhbGxiYWNrYCBjYW4gYmUgdXNlZCBpbiBub24tTm9kZS5qcyBlbnZpcm9ubWVudHMgYXMgd2VsbC5cbiAqIFwiTm9kZS5qcy1zdHlsZVwiIGNhbGxiYWNrcyBhcmUganVzdCBhIGNvbnZlbnRpb24sIHNvIGlmIHlvdSB3cml0ZSBmb3JcbiAqIGJyb3dzZXJzIG9yIGFueSBvdGhlciBlbnZpcm9ubWVudCBhbmQgQVBJIHlvdSB1c2UgaW1wbGVtZW50cyB0aGF0IGNhbGxiYWNrIHN0eWxlLFxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGNhbiBiZSBzYWZlbHkgdXNlZCBvbiB0aGF0IEFQSSBmdW5jdGlvbnMgYXMgd2VsbC5cbiAqXG4gKiBSZW1lbWJlciB0aGF0IEVycm9yIG9iamVjdCBwYXNzZWQgdG8gY2FsbGJhY2sgZG9lcyBub3QgaGF2ZSB0byBiZSBhbiBpbnN0YW5jZVxuICogb2YgSmF2YVNjcmlwdCBidWlsdC1pbiBgRXJyb3JgIG9iamVjdC4gSW4gZmFjdCwgaXQgZG9lcyBub3QgZXZlbiBoYXZlIHRvIGFuIG9iamVjdC5cbiAqIEVycm9yIHBhcmFtZXRlciBvZiBjYWxsYmFjayBmdW5jdGlvbiBpcyBpbnRlcnByZXRlZCBhcyBcInByZXNlbnRcIiwgd2hlbiB2YWx1ZVxuICogb2YgdGhhdCBwYXJhbWV0ZXIgaXMgdHJ1dGh5LiBJdCBjb3VsZCBiZSwgZm9yIGV4YW1wbGUsIG5vbi16ZXJvIG51bWJlciwgbm9uLWVtcHR5XG4gKiBzdHJpbmcgb3IgYm9vbGVhbiBgdHJ1ZWAuIEluIGFsbCBvZiB0aGVzZSBjYXNlcyByZXN1bHRpbmcgT2JzZXJ2YWJsZSB3b3VsZCBlcnJvclxuICogd2l0aCB0aGF0IHZhbHVlLiBUaGlzIG1lYW5zIHVzdWFsbHkgcmVndWxhciBzdHlsZSBjYWxsYmFja3Mgd2lsbCBmYWlsIHZlcnkgb2Z0ZW4gd2hlblxuICogYGJpbmROb2RlQ2FsbGJhY2tgIGlzIHVzZWQuIElmIHlvdXIgT2JzZXJ2YWJsZSBlcnJvcnMgbXVjaCBtb3JlIG9mdGVuIHRoZW4geW91XG4gKiB3b3VsZCBleHBlY3QsIGNoZWNrIGlmIGNhbGxiYWNrIHJlYWxseSBpcyBjYWxsZWQgaW4gTm9kZS5qcy1zdHlsZSBhbmQsIGlmIG5vdCxcbiAqIHN3aXRjaCB0byB7QGxpbmsgYmluZENhbGxiYWNrfSBpbnN0ZWFkLlxuICpcbiAqIE5vdGUgdGhhdCBldmVuIGlmIGVycm9yIHBhcmFtZXRlciBpcyB0ZWNobmljYWxseSBwcmVzZW50IGluIGNhbGxiYWNrLCBidXQgaXRzIHZhbHVlXG4gKiBpcyBmYWxzeSwgaXQgc3RpbGwgd29uJ3QgYXBwZWFyIGluIGFycmF5IGVtaXR0ZWQgYnkgT2JzZXJ2YWJsZS5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICogIyMjICBSZWFkIGEgZmlsZSBmcm9tIHRoZSBmaWxlc3lzdGVtIGFuZCBnZXQgdGhlIGRhdGEgYXMgYW4gT2JzZXJ2YWJsZVxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0ICogYXMgZnMgZnJvbSAnZnMnO1xuICogY29uc3QgcmVhZEZpbGVBc09ic2VydmFibGUgPSBiaW5kTm9kZUNhbGxiYWNrKGZzLnJlYWRGaWxlKTtcbiAqIGNvbnN0IHJlc3VsdCA9IHJlYWRGaWxlQXNPYnNlcnZhYmxlKCcuL3JvYWROYW1lcy50eHQnLCAndXRmOCcpO1xuICogcmVzdWx0LnN1YnNjcmliZSh4ID0+IGNvbnNvbGUubG9nKHgpLCBlID0+IGNvbnNvbGUuZXJyb3IoZSkpO1xuICogYGBgXG4gKlxuICogIyMjIFVzZSBvbiBmdW5jdGlvbiBjYWxsaW5nIGNhbGxiYWNrIHdpdGggbXVsdGlwbGUgYXJndW1lbnRzXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBzb21lRnVuY3Rpb24oKGVyciwgYSwgYikgPT4ge1xuICogICBjb25zb2xlLmxvZyhlcnIpOyAvLyBudWxsXG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiAgIGNvbnNvbGUubG9nKGIpOyAvLyBcInNvbWUgc3RyaW5nXCJcbiAqIH0pO1xuICogY29uc3QgYm91bmRTb21lRnVuY3Rpb24gPSBiaW5kTm9kZUNhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpXG4gKiAuc3Vic2NyaWJlKHZhbHVlID0+IHtcbiAqICAgY29uc29sZS5sb2codmFsdWUpOyAvLyBbNSwgXCJzb21lIHN0cmluZ1wiXVxuICogfSk7XG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIG9uIGZ1bmN0aW9uIGNhbGxpbmcgY2FsbGJhY2sgaW4gcmVndWxhciBzdHlsZVxuICogYGBgamF2YXNjcmlwdFxuICogc29tZUZ1bmN0aW9uKGEgPT4ge1xuICogICBjb25zb2xlLmxvZyhhKTsgLy8gNVxuICogfSk7XG4gKiBjb25zdCBib3VuZFNvbWVGdW5jdGlvbiA9IGJpbmROb2RlQ2FsbGJhY2soc29tZUZ1bmN0aW9uKTtcbiAqIGJvdW5kU29tZUZ1bmN0aW9uKClcbiAqIC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IHt9ICAgICAgICAgICAgIC8vIG5ldmVyIGdldHMgY2FsbGVkXG4gKiAgIGVyciA9PiBjb25zb2xlLmxvZyhlcnIpIC8vIDVcbiAqICk7XG4gKiBgYGBcbiAqXG4gKiBAc2VlIHtAbGluayBiaW5kQ2FsbGJhY2t9XG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IGZ1bmMgRnVuY3Rpb24gd2l0aCBhIE5vZGUuanMtc3R5bGUgY2FsbGJhY2sgYXMgdGhlIGxhc3QgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtTY2hlZHVsZXJMaWtlfSBbc2NoZWR1bGVyXSBUaGUgc2NoZWR1bGVyIG9uIHdoaWNoIHRvIHNjaGVkdWxlIHRoZVxuICogY2FsbGJhY2tzLlxuICogQHJldHVybiB7ZnVuY3Rpb24oLi4ucGFyYW1zOiAqKTogT2JzZXJ2YWJsZX0gQSBmdW5jdGlvbiB3aGljaCByZXR1cm5zIHRoZVxuICogT2JzZXJ2YWJsZSB0aGF0IGRlbGl2ZXJzIHRoZSBzYW1lIHZhbHVlcyB0aGUgTm9kZS5qcyBjYWxsYmFjayB3b3VsZFxuICogZGVsaXZlci5cbiAqIEBuYW1lIGJpbmROb2RlQ2FsbGJhY2tcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmROb2RlQ2FsbGJhY2s8VD4oXG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sXG4gIHJlc3VsdFNlbGVjdG9yOiBGdW5jdGlvbnxTY2hlZHVsZXJMaWtlLFxuICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlXG4pOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8VD4ge1xuXG4gIGlmIChyZXN1bHRTZWxlY3Rvcikge1xuICAgIGlmIChpc1NjaGVkdWxlcihyZXN1bHRTZWxlY3RvcikpIHtcbiAgICAgIHNjaGVkdWxlciA9IHJlc3VsdFNlbGVjdG9yO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBERVBSRUNBVEVEIFBBVEhcbiAgICAgIHJldHVybiAoLi4uYXJnczogYW55W10pID0+IGJpbmROb2RlQ2FsbGJhY2soY2FsbGJhY2tGdW5jLCBzY2hlZHVsZXIpKC4uLmFyZ3MpLnBpcGUoXG4gICAgICAgIG1hcChhcmdzID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKVxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24odGhpczogYW55LCAuLi5hcmdzOiBhbnlbXSk6IE9ic2VydmFibGU8VD4ge1xuICAgIGNvbnN0IHBhcmFtczogUGFyYW1zU3RhdGU8VD4gPSB7XG4gICAgICBzdWJqZWN0OiB1bmRlZmluZWQsXG4gICAgICBhcmdzLFxuICAgICAgY2FsbGJhY2tGdW5jLFxuICAgICAgc2NoZWR1bGVyLFxuICAgICAgY29udGV4dDogdGhpcyxcbiAgICB9O1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGNvbnN0IHsgY29udGV4dCB9ID0gcGFyYW1zO1xuICAgICAgbGV0IHsgc3ViamVjdCB9ID0gcGFyYW1zO1xuICAgICAgaWYgKCFzY2hlZHVsZXIpIHtcbiAgICAgICAgaWYgKCFzdWJqZWN0KSB7XG4gICAgICAgICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuICAgICAgICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgZXJyID0gaW5uZXJBcmdzLnNoaWZ0KCk7XG5cbiAgICAgICAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN1YmplY3QubmV4dChpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3MpO1xuICAgICAgICAgICAgc3ViamVjdC5jb21wbGV0ZSgpO1xuICAgICAgICAgIH07XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICBpZiAoY2FuUmVwb3J0RXJyb3Ioc3ViamVjdCkpIHtcbiAgICAgICAgICAgICAgc3ViamVjdC5lcnJvcihlcnIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgY29uc29sZS53YXJuKGVycik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdWJqZWN0LnN1YnNjcmliZShzdWJzY3JpYmVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hTdGF0ZTxUPj4oZGlzcGF0Y2gsIDAsIHsgcGFyYW1zLCBzdWJzY3JpYmVyLCBjb250ZXh0IH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xufVxuXG5pbnRlcmZhY2UgRGlzcGF0Y2hTdGF0ZTxUPiB7XG4gIHN1YnNjcmliZXI6IFN1YnNjcmliZXI8VD47XG4gIGNvbnRleHQ6IGFueTtcbiAgcGFyYW1zOiBQYXJhbXNTdGF0ZTxUPjtcbn1cblxuaW50ZXJmYWNlIFBhcmFtc1N0YXRlPFQ+IHtcbiAgY2FsbGJhY2tGdW5jOiBGdW5jdGlvbjtcbiAgYXJnczogYW55W107XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZTtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBjb250ZXh0OiBhbnk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEaXNwYXRjaFN0YXRlPFQ+Piwgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4pIHtcbiAgY29uc3QgeyBwYXJhbXMsIHN1YnNjcmliZXIsIGNvbnRleHQgfSA9IHN0YXRlO1xuICBjb25zdCB7IGNhbGxiYWNrRnVuYywgYXJncywgc2NoZWR1bGVyIH0gPSBwYXJhbXM7XG4gIGxldCBzdWJqZWN0ID0gcGFyYW1zLnN1YmplY3Q7XG5cbiAgaWYgKCFzdWJqZWN0KSB7XG4gICAgc3ViamVjdCA9IHBhcmFtcy5zdWJqZWN0ID0gbmV3IEFzeW5jU3ViamVjdDxUPigpO1xuXG4gICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBlcnIgPSBpbm5lckFyZ3Muc2hpZnQoKTtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgdGhpcy5hZGQoc2NoZWR1bGVyLnNjaGVkdWxlPERpc3BhdGNoRXJyb3JBcmc8VD4+KGRpc3BhdGNoRXJyb3IsIDAsIHsgZXJyLCBzdWJqZWN0IH0pKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzO1xuICAgICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hOZXh0QXJnPFQ+PihkaXNwYXRjaE5leHQsIDAsIHsgdmFsdWUsIHN1YmplY3QgfSkpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hFcnJvckFyZzxUPj4oZGlzcGF0Y2hFcnJvciwgMCwgeyBlcnIsIHN1YmplY3QgfSkpO1xuICAgIH1cbiAgfVxuXG4gIHRoaXMuYWRkKHN1YmplY3Quc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoTmV4dEFyZzxUPiB7XG4gIHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgdmFsdWU6IFQ7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoTmV4dDxUPihhcmc6IERpc3BhdGNoTmV4dEFyZzxUPikge1xuICBjb25zdCB7IHZhbHVlLCBzdWJqZWN0IH0gPSBhcmc7XG4gIHN1YmplY3QubmV4dCh2YWx1ZSk7XG4gIHN1YmplY3QuY29tcGxldGUoKTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoRXJyb3JBcmc8VD4ge1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG4gIGVycjogYW55O1xufVxuXG5mdW5jdGlvbiBkaXNwYXRjaEVycm9yPFQ+KGFyZzogRGlzcGF0Y2hFcnJvckFyZzxUPikge1xuICBjb25zdCB7IGVyciwgc3ViamVjdCB9ID0gYXJnO1xuICBzdWJqZWN0LmVycm9yKGVycik7XG59XG4iXX0=