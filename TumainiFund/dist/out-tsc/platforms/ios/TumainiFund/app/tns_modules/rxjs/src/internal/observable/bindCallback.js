import { Observable } from '../Observable';
import { AsyncSubject } from '../AsyncSubject';
import { map } from '../operators/map';
import { canReportError } from '../util/canReportError';
import { isArray } from '../util/isArray';
import { isScheduler } from '../util/isScheduler';
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
 * import { bindCallback } from 'rxjs';
 * import * as jQuery from 'jquery';
 *
 * // Suppose we have jQuery.getJSON('/my/url', callback)
 * const getJSONAsObservable = bindCallback(jQuery.getJSON);
 * const result = getJSONAsObservable('/my/url');
 * result.subscribe(x => console.log(x), e => console.error(e));
 * ```
 *
 * ### Receive an array of arguments passed to a callback
 * ```javascript
 * import { bindCallback } from 'rxjs';
 *
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
 * import { bindCallback } from 'rxjs';
 *
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
 * import { bindCallback } from 'rxjs';
 *
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
export function bindCallback(callbackFunc, resultSelector, scheduler) {
    if (resultSelector) {
        if (isScheduler(resultSelector)) {
            scheduler = resultSelector;
        }
        else {
            // DEPRECATED PATH
            return (...args) => bindCallback(callbackFunc, scheduler)(...args).pipe(map((args) => isArray(args) ? resultSelector(...args) : resultSelector(args)));
        }
    }
    return function (...args) {
        const context = this;
        let subject;
        const params = {
            context,
            subject,
            callbackFunc,
            scheduler,
        };
        return new Observable(subscriber => {
            if (!scheduler) {
                if (!subject) {
                    subject = new AsyncSubject();
                    const handler = (...innerArgs) => {
                        subject.next(innerArgs.length <= 1 ? innerArgs[0] : innerArgs);
                        subject.complete();
                    };
                    try {
                        callbackFunc.apply(context, [...args, handler]);
                    }
                    catch (err) {
                        if (canReportError(subject)) {
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
                const state = {
                    args, subscriber, params,
                };
                return scheduler.schedule(dispatch, 0, state);
            }
        });
    };
}
function dispatch(state) {
    const self = this;
    const { args, subscriber, params } = state;
    const { callbackFunc, context, scheduler } = params;
    let { subject } = params;
    if (!subject) {
        subject = params.subject = new AsyncSubject();
        const handler = (...innerArgs) => {
            const value = innerArgs.length <= 1 ? innerArgs[0] : innerArgs;
            this.add(scheduler.schedule(dispatchNext, 0, { value, subject }));
        };
        try {
            callbackFunc.apply(context, [...args, handler]);
        }
        catch (err) {
            subject.error(err);
        }
    }
    this.add(subject.subscribe(subscriber));
}
function dispatchNext(state) {
    const { value, subject } = state;
    subject.next(value);
    subject.complete();
}
function dispatchError(state) {
    const { err, subject } = state;
    subject.error(err);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmluZENhbGxiYWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9iaW5kQ2FsbGJhY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0EsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFL0MsT0FBTyxFQUFFLEdBQUcsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDMUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBK0NsRCxnQ0FBZ0M7QUFFaEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBMEhHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FDMUIsWUFBc0IsRUFDdEIsY0FBdUMsRUFDdkMsU0FBeUI7SUFFekIsSUFBSSxjQUFjLEVBQUU7UUFDbEIsSUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLEVBQUU7WUFDL0IsU0FBUyxHQUFHLGNBQWMsQ0FBQztTQUM1QjthQUFNO1lBQ0wsa0JBQWtCO1lBQ2xCLE9BQU8sQ0FBQyxHQUFHLElBQVcsRUFBRSxFQUFFLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksQ0FDNUUsR0FBRyxDQUFDLENBQUMsSUFB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U0FDakQ7UUFBQyxPQUFPLEdBQUcsRUFBRTtZQUNaLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDcEI7S0FDRjtJQUVELElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO0FBQzFDLENBQUM7QUFPRCxTQUFTLFlBQVksQ0FBeUMsS0FBbUI7SUFDL0UsTUFBTSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsR0FBRyxLQUFLLENBQUM7SUFDakMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwQixPQUFPLENBQUMsUUFBUSxFQUFFLENBQUM7QUFDckIsQ0FBQztBQU9ELFNBQVMsYUFBYSxDQUEwQyxLQUFvQjtJQUNsRixNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxHQUFHLEtBQUssQ0FBQztJQUMvQixPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3JCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTY2hlZHVsZXJMaWtlLCBTY2hlZHVsZXJBY3Rpb24gfSBmcm9tICcuLi90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBBc3luY1N1YmplY3QgfSBmcm9tICcuLi9Bc3luY1N1YmplY3QnO1xuaW1wb3J0IHsgU3Vic2NyaWJlciB9IGZyb20gJy4uL1N1YnNjcmliZXInO1xuaW1wb3J0IHsgbWFwIH0gZnJvbSAnLi4vb3BlcmF0b3JzL21hcCc7XG5pbXBvcnQgeyBjYW5SZXBvcnRFcnJvciB9IGZyb20gJy4uL3V0aWwvY2FuUmVwb3J0RXJyb3InO1xuaW1wb3J0IHsgaXNBcnJheSB9IGZyb20gJy4uL3V0aWwvaXNBcnJheSc7XG5pbXBvcnQgeyBpc1NjaGVkdWxlciB9IGZyb20gJy4uL3V0aWwvaXNTY2hlZHVsZXInO1xuXG4vLyB0c2xpbnQ6ZGlzYWJsZTptYXgtbGluZS1sZW5ndGhcbi8qKiBAZGVwcmVjYXRlZCByZXN1bHRTZWxlY3RvciBpcyBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgYSBtYXBwaW5nIGZ1bmN0aW9uLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IEZ1bmN0aW9uLCByZXN1bHRTZWxlY3RvcjogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzLCByZXM0OiBSNCwgLi4uYXJnczogYW55W10pID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMykgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPFIxPihjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKHJlczE6IFIxKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6ICgpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjayhjYWxsYmFja0Z1bmM6IChjYWxsYmFjazogKCkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMikgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyKSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMywgUjQ+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPGFueVtdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgUjEsIFIyLCBSMz4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPFtSMSwgUjIsIFIzXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIFIxLCBSMj4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMpID0+IE9ic2VydmFibGU8W1IxLCBSMl0+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBSMT4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMykgPT4gT2JzZXJ2YWJsZTxSMT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzKSA9PiBPYnNlcnZhYmxlPHZvaWQ+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzLCBSND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxhbnlbXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBSMSwgUjIsIFIzPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyLCBSM10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgUjEsIFIyPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0KSA9PiBPYnNlcnZhYmxlPFtSMSwgUjJdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIFIxPihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQpID0+IE9ic2VydmFibGU8UjE+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBND4oY2FsbGJhY2tGdW5jOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCkgPT4gT2JzZXJ2YWJsZTx2b2lkPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjMsIFI0PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAocmVzMTogUjEsIHJlczI6IFIyLCByZXMzOiBSMywgcmVzNDogUjQsIC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8YW55W10+O1xuZXhwb3J0IGZ1bmN0aW9uIGJpbmRDYWxsYmFjazxBMSwgQTIsIEEzLCBBNCwgQTUsIFIxLCBSMiwgUjM+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIsIHJlczM6IFIzKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8W1IxLCBSMiwgUjNdPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1LCBSMSwgUjI+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSwgcmVzMjogUjIpID0+IGFueSkgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSkgPT4gT2JzZXJ2YWJsZTxbUjEsIFIyXT47XG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrPEExLCBBMiwgQTMsIEE0LCBBNSwgUjE+KGNhbGxiYWNrRnVuYzogKGFyZzE6IEExLCBhcmcyOiBBMiwgYXJnMzogQTMsIGFyZzQ6IEE0LCBhcmc1OiBBNSwgY2FsbGJhY2s6IChyZXMxOiBSMSkgPT4gYW55KSA9PiBhbnksIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoYXJnMTogQTEsIGFyZzI6IEEyLCBhcmczOiBBMywgYXJnNDogQTQsIGFyZzU6IEE1KSA9PiBPYnNlcnZhYmxlPFIxPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QTEsIEEyLCBBMywgQTQsIEE1PihjYWxsYmFja0Z1bmM6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUsIGNhbGxiYWNrOiAoKSA9PiBhbnkpID0+IGFueSwgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IChhcmcxOiBBMSwgYXJnMjogQTIsIGFyZzM6IEEzLCBhcmc0OiBBNCwgYXJnNTogQTUpID0+IE9ic2VydmFibGU8dm9pZD47XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgocmVzdWx0OiBSKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSPjtcbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8QSwgUj4oY2FsbGJhY2tGdW5jOiAoLi4uYXJnczogQXJyYXk8QSB8ICgoLi4ucmVzdWx0czogUltdKSA9PiBhbnkpPikgPT4gYW55LCBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogKC4uLmFyZ3M6IEFbXSkgPT4gT2JzZXJ2YWJsZTxSW10+O1xuXG5leHBvcnQgZnVuY3Rpb24gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiAoLi4uYXJnczogYW55W10pID0+IE9ic2VydmFibGU8YW55PjtcblxuLy8gdHNsaW50OmVuYWJsZTptYXgtbGluZS1sZW5ndGhcblxuLyoqXG4gKiBDb252ZXJ0cyBhIGNhbGxiYWNrIEFQSSB0byBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhbiBPYnNlcnZhYmxlLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwiaW5mb3JtYWxcIj5HaXZlIGl0IGEgZnVuY3Rpb24gYGZgIG9mIHR5cGUgYGYoeCwgY2FsbGJhY2spYCBhbmRcbiAqIGl0IHdpbGwgcmV0dXJuIGEgZnVuY3Rpb24gYGdgIHRoYXQgd2hlbiBjYWxsZWQgYXMgYGcoeClgIHdpbGwgb3V0cHV0IGFuXG4gKiBPYnNlcnZhYmxlLjwvc3Bhbj5cbiAqXG4gKiBgYmluZENhbGxiYWNrYCBpcyBub3QgYW4gb3BlcmF0b3IgYmVjYXVzZSBpdHMgaW5wdXQgYW5kIG91dHB1dCBhcmUgbm90XG4gKiBPYnNlcnZhYmxlcy4gVGhlIGlucHV0IGlzIGEgZnVuY3Rpb24gYGZ1bmNgIHdpdGggc29tZSBwYXJhbWV0ZXJzLiBUaGVcbiAqIGxhc3QgcGFyYW1ldGVyIG11c3QgYmUgYSBjYWxsYmFjayBmdW5jdGlvbiB0aGF0IGBmdW5jYCBjYWxscyB3aGVuIGl0IGlzXG4gKiBkb25lLlxuICpcbiAqIFRoZSBvdXRwdXQgb2YgYGJpbmRDYWxsYmFja2AgaXMgYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzYW1lIHBhcmFtZXRlcnNcbiAqIGFzIGBmdW5jYCwgZXhjZXB0IHRoZSBsYXN0IG9uZSAodGhlIGNhbGxiYWNrKS4gV2hlbiB0aGUgb3V0cHV0IGZ1bmN0aW9uXG4gKiBpcyBjYWxsZWQgd2l0aCBhcmd1bWVudHMgaXQgd2lsbCByZXR1cm4gYW4gT2JzZXJ2YWJsZS4gSWYgZnVuY3Rpb24gYGZ1bmNgXG4gKiBjYWxscyBpdHMgY2FsbGJhY2sgd2l0aCBvbmUgYXJndW1lbnQsIHRoZSBPYnNlcnZhYmxlIHdpbGwgZW1pdCB0aGF0IHZhbHVlLlxuICogSWYgb24gdGhlIG90aGVyIGhhbmQgdGhlIGNhbGxiYWNrIGlzIGNhbGxlZCB3aXRoIG11bHRpcGxlIHZhbHVlcyB0aGUgcmVzdWx0aW5nXG4gKiBPYnNlcnZhYmxlIHdpbGwgZW1pdCBhbiBhcnJheSB3aXRoIHNhaWQgdmFsdWVzIGFzIGFyZ3VtZW50cy5cbiAqXG4gKiBJdCBpcyAqKnZlcnkgaW1wb3J0YW50KiogdG8gcmVtZW1iZXIgdGhhdCBpbnB1dCBmdW5jdGlvbiBgZnVuY2AgaXMgbm90IGNhbGxlZFxuICogd2hlbiB0aGUgb3V0cHV0IGZ1bmN0aW9uIGlzLCBidXQgcmF0aGVyIHdoZW4gdGhlIE9ic2VydmFibGUgcmV0dXJuZWQgYnkgdGhlIG91dHB1dFxuICogZnVuY3Rpb24gaXMgc3Vic2NyaWJlZC4gVGhpcyBtZWFucyBpZiBgZnVuY2AgbWFrZXMgYW4gQUpBWCByZXF1ZXN0LCB0aGF0IHJlcXVlc3RcbiAqIHdpbGwgYmUgbWFkZSBldmVyeSB0aW1lIHNvbWVvbmUgc3Vic2NyaWJlcyB0byB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGUsIGJ1dCBub3QgYmVmb3JlLlxuICpcbiAqIFRoZSBsYXN0IG9wdGlvbmFsIHBhcmFtZXRlciAtIGBzY2hlZHVsZXJgIC0gY2FuIGJlIHVzZWQgdG8gY29udHJvbCB3aGVuIHRoZSBjYWxsXG4gKiB0byBgZnVuY2AgaGFwcGVucyBhZnRlciBzb21lb25lIHN1YnNjcmliZXMgdG8gT2JzZXJ2YWJsZSwgYXMgd2VsbCBhcyB3aGVuIHJlc3VsdHNcbiAqIHBhc3NlZCB0byBjYWxsYmFjayB3aWxsIGJlIGVtaXR0ZWQuIEJ5IGRlZmF1bHQsIHRoZSBzdWJzY3JpcHRpb24gdG8gYW4gT2JzZXJ2YWJsZSBjYWxscyBgZnVuY2BcbiAqIHN5bmNocm9ub3VzbHksIGJ1dCB1c2luZyB7QGxpbmsgYXN5bmNTY2hlZHVsZXJ9IGFzIHRoZSBsYXN0IHBhcmFtZXRlciB3aWxsIGRlZmVyIHRoZSBjYWxsIHRvIGBmdW5jYCxcbiAqIGp1c3QgbGlrZSB3cmFwcGluZyB0aGUgY2FsbCBpbiBgc2V0VGltZW91dGAgd2l0aCBhIHRpbWVvdXQgb2YgYDBgIHdvdWxkLiBJZiB5b3Ugd2VyZSB0byB1c2UgdGhlIGFzeW5jIFNjaGVkdWxlclxuICogYW5kIGNhbGwgYHN1YnNjcmliZWAgb24gdGhlIG91dHB1dCBPYnNlcnZhYmxlLCBhbGwgZnVuY3Rpb24gY2FsbHMgdGhhdCBhcmUgY3VycmVudGx5IGV4ZWN1dGluZ1xuICogd2lsbCBlbmQgYmVmb3JlIGBmdW5jYCBpcyBpbnZva2VkLlxuICpcbiAqIEJ5IGRlZmF1bHQsIHJlc3VsdHMgcGFzc2VkIHRvIHRoZSBjYWxsYmFjayBhcmUgZW1pdHRlZCBpbW1lZGlhdGVseSBhZnRlciBgZnVuY2AgaW52b2tlcyB0aGUgY2FsbGJhY2suXG4gKiBJbiBwYXJ0aWN1bGFyLCBpZiB0aGUgY2FsbGJhY2sgaXMgY2FsbGVkIHN5bmNocm9ub3VzbHksIHRoZW4gdGhlIHN1YnNjcmlwdGlvbiBvZiB0aGUgcmVzdWx0aW5nIE9ic2VydmFibGVcbiAqIHdpbGwgY2FsbCB0aGUgYG5leHRgIGZ1bmN0aW9uIHN5bmNocm9ub3VzbHkgYXMgd2VsbC4gIElmIHlvdSB3YW50IHRvIGRlZmVyIHRoYXQgY2FsbCxcbiAqIHlvdSBtYXkgdXNlIHtAbGluayBhc3luY1NjaGVkdWxlcn0ganVzdCBhcyBiZWZvcmUuICBUaGlzIG1lYW5zIHRoYXQgYnkgdXNpbmcgYFNjaGVkdWxlci5hc3luY2AgeW91IGNhblxuICogZW5zdXJlIHRoYXQgYGZ1bmNgIGFsd2F5cyBjYWxscyBpdHMgY2FsbGJhY2sgYXN5bmNocm9ub3VzbHksIHRodXMgYXZvaWRpbmcgdGVycmlmeWluZyBaYWxnby5cbiAqXG4gKiBOb3RlIHRoYXQgdGhlIE9ic2VydmFibGUgY3JlYXRlZCBieSB0aGUgb3V0cHV0IGZ1bmN0aW9uIHdpbGwgYWx3YXlzIGVtaXQgYSBzaW5nbGUgdmFsdWVcbiAqIGFuZCB0aGVuIGNvbXBsZXRlIGltbWVkaWF0ZWx5LiBJZiBgZnVuY2AgY2FsbHMgdGhlIGNhbGxiYWNrIG11bHRpcGxlIHRpbWVzLCB2YWx1ZXMgZnJvbSBzdWJzZXF1ZW50XG4gKiBjYWxscyB3aWxsIG5vdCBhcHBlYXIgaW4gdGhlIHN0cmVhbS4gSWYgeW91IG5lZWQgdG8gbGlzdGVuIGZvciBtdWx0aXBsZSBjYWxscyxcbiAqICB5b3UgcHJvYmFibHkgd2FudCB0byB1c2Uge0BsaW5rIGZyb21FdmVudH0gb3Ige0BsaW5rIGZyb21FdmVudFBhdHRlcm59IGluc3RlYWQuXG4gKlxuICogSWYgYGZ1bmNgIGRlcGVuZHMgb24gc29tZSBjb250ZXh0IChgdGhpc2AgcHJvcGVydHkpIGFuZCBpcyBub3QgYWxyZWFkeSBib3VuZCwgdGhlIGNvbnRleHQgb2YgYGZ1bmNgXG4gKiB3aWxsIGJlIHRoZSBjb250ZXh0IHRoYXQgdGhlIG91dHB1dCBmdW5jdGlvbiBoYXMgYXQgY2FsbCB0aW1lLiBJbiBwYXJ0aWN1bGFyLCBpZiBgZnVuY2BcbiAqIGlzIGNhbGxlZCBhcyBhIG1ldGhvZCBvZiBzb21lIG9iamVjIGFuZCBpZiBgZnVuY2AgaXMgbm90IGFscmVhZHkgYm91bmQsIGluIG9yZGVyIHRvIHByZXNlcnZlIHRoZSBjb250ZXh0XG4gKiBpdCBpcyByZWNvbW1lbmRlZCB0aGF0IHRoZSBjb250ZXh0IG9mIHRoZSBvdXRwdXQgZnVuY3Rpb24gaXMgc2V0IHRvIHRoYXQgb2JqZWN0IGFzIHdlbGwuXG4gKlxuICogSWYgdGhlIGlucHV0IGZ1bmN0aW9uIGNhbGxzIGl0cyBjYWxsYmFjayBpbiB0aGUgXCJub2RlIHN0eWxlXCIgKGkuZS4gZmlyc3QgYXJndW1lbnQgdG8gY2FsbGJhY2sgaXNcbiAqIG9wdGlvbmFsIGVycm9yIHBhcmFtZXRlciBzaWduYWxpbmcgd2hldGhlciB0aGUgY2FsbCBmYWlsZWQgb3Igbm90KSwge0BsaW5rIGJpbmROb2RlQ2FsbGJhY2t9XG4gKiBwcm92aWRlcyBjb252ZW5pZW50IGVycm9yIGhhbmRsaW5nIGFuZCBwcm9iYWJseSBpcyBhIGJldHRlciBjaG9pY2UuXG4gKiBgYmluZENhbGxiYWNrYCB3aWxsIHRyZWF0IHN1Y2ggZnVuY3Rpb25zIHRoZSBzYW1lIGFzIGFueSBvdGhlciBhbmQgZXJyb3IgcGFyYW1ldGVyc1xuICogKHdoZXRoZXIgcGFzc2VkIG9yIG5vdCkgd2lsbCBhbHdheXMgYmUgaW50ZXJwcmV0ZWQgYXMgcmVndWxhciBjYWxsYmFjayBhcmd1bWVudC5cbiAqXG4gKiAjIyBFeGFtcGxlc1xuICpcbiAqICMjIyBDb252ZXJ0IGpRdWVyeSdzIGdldEpTT04gdG8gYW4gT2JzZXJ2YWJsZSBBUElcbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGJpbmRDYWxsYmFjayB9IGZyb20gJ3J4anMnO1xuICogaW1wb3J0ICogYXMgalF1ZXJ5IGZyb20gJ2pxdWVyeSc7XG4gKlxuICogLy8gU3VwcG9zZSB3ZSBoYXZlIGpRdWVyeS5nZXRKU09OKCcvbXkvdXJsJywgY2FsbGJhY2spXG4gKiBjb25zdCBnZXRKU09OQXNPYnNlcnZhYmxlID0gYmluZENhbGxiYWNrKGpRdWVyeS5nZXRKU09OKTtcbiAqIGNvbnN0IHJlc3VsdCA9IGdldEpTT05Bc09ic2VydmFibGUoJy9teS91cmwnKTtcbiAqIHJlc3VsdC5zdWJzY3JpYmUoeCA9PiBjb25zb2xlLmxvZyh4KSwgZSA9PiBjb25zb2xlLmVycm9yKGUpKTtcbiAqIGBgYFxuICpcbiAqICMjIyBSZWNlaXZlIGFuIGFycmF5IG9mIGFyZ3VtZW50cyBwYXNzZWQgdG8gYSBjYWxsYmFja1xuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgYmluZENhbGxiYWNrIH0gZnJvbSAncnhqcyc7XG4gKlxuICogc29tZUZ1bmN0aW9uKChhLCBiLCBjKSA9PiB7XG4gKiAgIGNvbnNvbGUubG9nKGEpOyAvLyA1XG4gKiAgIGNvbnNvbGUubG9nKGIpOyAvLyAnc29tZSBzdHJpbmcnXG4gKiAgIGNvbnNvbGUubG9nKGMpOyAvLyB7c29tZVByb3BlcnR5OiAnc29tZVZhbHVlJ31cbiAqIH0pO1xuICpcbiAqIGNvbnN0IGJvdW5kU29tZUZ1bmN0aW9uID0gYmluZENhbGxiYWNrKHNvbWVGdW5jdGlvbik7XG4gKiBib3VuZFNvbWVGdW5jdGlvbigpLnN1YnNjcmliZSh2YWx1ZXMgPT4ge1xuICogICBjb25zb2xlLmxvZyh2YWx1ZXMpIC8vIFs1LCAnc29tZSBzdHJpbmcnLCB7c29tZVByb3BlcnR5OiAnc29tZVZhbHVlJ31dXG4gKiB9KTtcbiAqIGBgYFxuICpcbiAqICMjIyBDb21wYXJlIGJlaGF2aW91ciB3aXRoIGFuZCB3aXRob3V0IGFzeW5jIFNjaGVkdWxlclxuICogYGBgamF2YXNjcmlwdFxuICogaW1wb3J0IHsgYmluZENhbGxiYWNrIH0gZnJvbSAncnhqcyc7XG4gKlxuICogZnVuY3Rpb24gaUNhbGxNeUNhbGxiYWNrU3luY2hyb25vdXNseShjYikge1xuICogICBjYigpO1xuICogfVxuICpcbiAqIGNvbnN0IGJvdW5kU3luY0ZuID0gYmluZENhbGxiYWNrKGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHkpO1xuICogY29uc3QgYm91bmRBc3luY0ZuID0gYmluZENhbGxiYWNrKGlDYWxsTXlDYWxsYmFja1N5bmNocm9ub3VzbHksIG51bGwsIFJ4LlNjaGVkdWxlci5hc3luYyk7XG4gKlxuICogYm91bmRTeW5jRm4oKS5zdWJzY3JpYmUoKCkgPT4gY29uc29sZS5sb2coJ0kgd2FzIHN5bmMhJykpO1xuICogYm91bmRBc3luY0ZuKCkuc3Vic2NyaWJlKCgpID0+IGNvbnNvbGUubG9nKCdJIHdhcyBhc3luYyEnKSk7XG4gKiBjb25zb2xlLmxvZygnVGhpcyBoYXBwZW5lZC4uLicpO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyBJIHdhcyBzeW5jIVxuICogLy8gVGhpcyBoYXBwZW5lZC4uLlxuICogLy8gSSB3YXMgYXN5bmMhXG4gKiBgYGBcbiAqXG4gKiAjIyMgVXNlIGJpbmRDYWxsYmFjayBvbiBhbiBvYmplY3QgbWV0aG9kXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBiaW5kQ2FsbGJhY2sgfSBmcm9tICdyeGpzJztcbiAqXG4gKiBjb25zdCBib3VuZE1ldGhvZCA9IGJpbmRDYWxsYmFjayhzb21lT2JqZWN0Lm1ldGhvZFdpdGhDYWxsYmFjayk7XG4gKiBib3VuZE1ldGhvZC5jYWxsKHNvbWVPYmplY3QpIC8vIG1ha2Ugc3VyZSBtZXRob2RXaXRoQ2FsbGJhY2sgaGFzIGFjY2VzcyB0byBzb21lT2JqZWN0XG4gKiAuc3Vic2NyaWJlKHN1YnNjcmliZXIpO1xuICogYGBgXG4gKlxuICogQHNlZSB7QGxpbmsgYmluZE5vZGVDYWxsYmFja31cbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKlxuICogQHBhcmFtIHtmdW5jdGlvbn0gZnVuYyBBIGZ1bmN0aW9uIHdpdGggYSBjYWxsYmFjayBhcyB0aGUgbGFzdCBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge1NjaGVkdWxlckxpa2V9IFtzY2hlZHVsZXJdIFRoZSBzY2hlZHVsZXIgb24gd2hpY2ggdG8gc2NoZWR1bGUgdGhlXG4gKiBjYWxsYmFja3MuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbiguLi5wYXJhbXM6ICopOiBPYnNlcnZhYmxlfSBBIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgdGhlXG4gKiBPYnNlcnZhYmxlIHRoYXQgZGVsaXZlcnMgdGhlIHNhbWUgdmFsdWVzIHRoZSBjYWxsYmFjayB3b3VsZCBkZWxpdmVyLlxuICogQG5hbWUgYmluZENhbGxiYWNrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQ2FsbGJhY2s8VD4oXG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb24sXG4gIHJlc3VsdFNlbGVjdG9yPzogRnVuY3Rpb258U2NoZWR1bGVyTGlrZSxcbiAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZVxuKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBPYnNlcnZhYmxlPFQ+IHtcbiAgaWYgKHJlc3VsdFNlbGVjdG9yKSB7XG4gICAgaWYgKGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yKSkge1xuICAgICAgc2NoZWR1bGVyID0gcmVzdWx0U2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIERFUFJFQ0FURUQgUEFUSFxuICAgICAgcmV0dXJuICguLi5hcmdzOiBhbnlbXSkgPT4gYmluZENhbGxiYWNrKGNhbGxiYWNrRnVuYywgc2NoZWR1bGVyKSguLi5hcmdzKS5waXBlKFxuICAgICAgICBtYXAoKGFyZ3MpID0+IGlzQXJyYXkoYXJncykgPyByZXN1bHRTZWxlY3RvciguLi5hcmdzKSA6IHJlc3VsdFNlbGVjdG9yKGFyZ3MpKSxcbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZ1bmN0aW9uICh0aGlzOiBhbnksIC4uLmFyZ3M6IGFueVtdKTogT2JzZXJ2YWJsZTxUPiB7XG4gICAgY29uc3QgY29udGV4dCA9IHRoaXM7XG4gICAgbGV0IHN1YmplY3Q6IEFzeW5jU3ViamVjdDxUPjtcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICBjb250ZXh0LFxuICAgICAgc3ViamVjdCxcbiAgICAgIGNhbGxiYWNrRnVuYyxcbiAgICAgIHNjaGVkdWxlcixcbiAgICB9O1xuICAgIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICAgIGlmICghc2NoZWR1bGVyKSB7XG4gICAgICAgIGlmICghc3ViamVjdCkge1xuICAgICAgICAgIHN1YmplY3QgPSBuZXcgQXN5bmNTdWJqZWN0PFQ+KCk7XG4gICAgICAgICAgY29uc3QgaGFuZGxlciA9ICguLi5pbm5lckFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBzdWJqZWN0Lm5leHQoaW5uZXJBcmdzLmxlbmd0aCA8PSAxID8gaW5uZXJBcmdzWzBdIDogaW5uZXJBcmdzKTtcbiAgICAgICAgICAgIHN1YmplY3QuY29tcGxldGUoKTtcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGNhbGxiYWNrRnVuYy5hcHBseShjb250ZXh0LCBbLi4uYXJncywgaGFuZGxlcl0pO1xuICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgaWYgKGNhblJlcG9ydEVycm9yKHN1YmplY3QpKSB7XG4gICAgICAgICAgICAgIHN1YmplY3QuZXJyb3IoZXJyKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUud2FybihlcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzdGF0ZTogRGlzcGF0Y2hTdGF0ZTxUPiA9IHtcbiAgICAgICAgICBhcmdzLCBzdWJzY3JpYmVyLCBwYXJhbXMsXG4gICAgICAgIH07XG4gICAgICAgIHJldHVybiBzY2hlZHVsZXIuc2NoZWR1bGU8RGlzcGF0Y2hTdGF0ZTxUPj4oZGlzcGF0Y2gsIDAsIHN0YXRlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn1cblxuaW50ZXJmYWNlIERpc3BhdGNoU3RhdGU8VD4ge1xuICBhcmdzOiBhbnlbXTtcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgcGFyYW1zOiBQYXJhbXNDb250ZXh0PFQ+O1xufVxuXG5pbnRlcmZhY2UgUGFyYW1zQ29udGV4dDxUPiB7XG4gIGNhbGxiYWNrRnVuYzogRnVuY3Rpb247XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyTGlrZTtcbiAgY29udGV4dDogYW55O1xuICBzdWJqZWN0OiBBc3luY1N1YmplY3Q8VD47XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxEaXNwYXRjaFN0YXRlPFQ+Piwgc3RhdGU6IERpc3BhdGNoU3RhdGU8VD4pIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGNvbnN0IHsgYXJncywgc3Vic2NyaWJlciwgcGFyYW1zIH0gPSBzdGF0ZTtcbiAgY29uc3QgeyBjYWxsYmFja0Z1bmMsIGNvbnRleHQsIHNjaGVkdWxlciB9ID0gcGFyYW1zO1xuICBsZXQgeyBzdWJqZWN0IH0gPSBwYXJhbXM7XG4gIGlmICghc3ViamVjdCkge1xuICAgIHN1YmplY3QgPSBwYXJhbXMuc3ViamVjdCA9IG5ldyBBc3luY1N1YmplY3Q8VD4oKTtcblxuICAgIGNvbnN0IGhhbmRsZXIgPSAoLi4uaW5uZXJBcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgdmFsdWUgPSBpbm5lckFyZ3MubGVuZ3RoIDw9IDEgPyBpbm5lckFyZ3NbMF0gOiBpbm5lckFyZ3M7XG4gICAgICB0aGlzLmFkZChzY2hlZHVsZXIuc2NoZWR1bGU8TmV4dFN0YXRlPFQ+PihkaXNwYXRjaE5leHQsIDAsIHsgdmFsdWUsIHN1YmplY3QgfSkpO1xuICAgIH07XG5cbiAgICB0cnkge1xuICAgICAgY2FsbGJhY2tGdW5jLmFwcGx5KGNvbnRleHQsIFsuLi5hcmdzLCBoYW5kbGVyXSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJqZWN0LmVycm9yKGVycik7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5hZGQoc3ViamVjdC5zdWJzY3JpYmUoc3Vic2NyaWJlcikpO1xufVxuXG5pbnRlcmZhY2UgTmV4dFN0YXRlPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICB2YWx1ZTogVDtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hOZXh0PFQ+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxOZXh0U3RhdGU8VD4+LCBzdGF0ZTogTmV4dFN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgdmFsdWUsIHN1YmplY3QgfSA9IHN0YXRlO1xuICBzdWJqZWN0Lm5leHQodmFsdWUpO1xuICBzdWJqZWN0LmNvbXBsZXRlKCk7XG59XG5cbmludGVyZmFjZSBFcnJvclN0YXRlPFQ+IHtcbiAgc3ViamVjdDogQXN5bmNTdWJqZWN0PFQ+O1xuICBlcnI6IGFueTtcbn1cblxuZnVuY3Rpb24gZGlzcGF0Y2hFcnJvcjxUPih0aGlzOiBTY2hlZHVsZXJBY3Rpb248RXJyb3JTdGF0ZTxUPj4sIHN0YXRlOiBFcnJvclN0YXRlPFQ+KSB7XG4gIGNvbnN0IHsgZXJyLCBzdWJqZWN0IH0gPSBzdGF0ZTtcbiAgc3ViamVjdC5lcnJvcihlcnIpO1xufVxuIl19