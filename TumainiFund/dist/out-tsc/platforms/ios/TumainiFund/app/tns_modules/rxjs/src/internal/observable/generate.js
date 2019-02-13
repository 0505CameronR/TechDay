import { Observable } from '../Observable';
import { identity } from '../util/identity';
import { isScheduler } from '../util/isScheduler';
export function generate(initialStateOrOptions, condition, iterate, resultSelectorOrObservable, scheduler) {
    let resultSelector;
    let initialState;
    if (arguments.length == 1) {
        const options = initialStateOrOptions;
        initialState = options.initialState;
        condition = options.condition;
        iterate = options.iterate;
        resultSelector = options.resultSelector || identity;
        scheduler = options.scheduler;
    }
    else if (resultSelectorOrObservable === undefined || isScheduler(resultSelectorOrObservable)) {
        initialState = initialStateOrOptions;
        resultSelector = identity;
        scheduler = resultSelectorOrObservable;
    }
    else {
        initialState = initialStateOrOptions;
        resultSelector = resultSelectorOrObservable;
    }
    return new Observable(subscriber => {
        let state = initialState;
        if (scheduler) {
            return scheduler.schedule(dispatch, 0, {
                subscriber,
                iterate,
                condition,
                resultSelector,
                state
            });
        }
        do {
            if (condition) {
                let conditionResult;
                try {
                    conditionResult = condition(state);
                }
                catch (err) {
                    subscriber.error(err);
                    return undefined;
                }
                if (!conditionResult) {
                    subscriber.complete();
                    break;
                }
            }
            let value;
            try {
                value = resultSelector(state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
            subscriber.next(value);
            if (subscriber.closed) {
                break;
            }
            try {
                state = iterate(state);
            }
            catch (err) {
                subscriber.error(err);
                return undefined;
            }
        } while (true);
        return undefined;
    });
}
function dispatch(state) {
    const { subscriber, condition } = state;
    if (subscriber.closed) {
        return undefined;
    }
    if (state.needIterate) {
        try {
            state.state = state.iterate(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
    }
    else {
        state.needIterate = true;
    }
    if (condition) {
        let conditionResult;
        try {
            conditionResult = condition(state.state);
        }
        catch (err) {
            subscriber.error(err);
            return undefined;
        }
        if (!conditionResult) {
            subscriber.complete();
            return undefined;
        }
        if (subscriber.closed) {
            return undefined;
        }
    }
    let value;
    try {
        value = state.resultSelector(state.state);
    }
    catch (err) {
        subscriber.error(err);
        return undefined;
    }
    if (subscriber.closed) {
        return undefined;
    }
    subscriber.next(value);
    if (subscriber.closed) {
        return undefined;
    }
    return this.schedule(state);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9vYnNlcnZhYmxlL2dlbmVyYXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRTVDLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQThQbEQsTUFBTSxVQUFVLFFBQVEsQ0FBTyxxQkFBZ0QsRUFDaEQsU0FBNEIsRUFDNUIsT0FBd0IsRUFDeEIsMEJBQStELEVBQy9ELFNBQXlCO0lBRXRELElBQUksY0FBZ0MsQ0FBQztJQUNyQyxJQUFJLFlBQWUsQ0FBQztJQUVwQixJQUFJLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3pCLE1BQU0sT0FBTyxHQUFHLHFCQUE4QyxDQUFDO1FBQy9ELFlBQVksR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDO1FBQ3BDLFNBQVMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDO1FBQzlCLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO1FBQzFCLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYyxJQUFJLFFBQTRCLENBQUM7UUFDeEUsU0FBUyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7S0FDL0I7U0FBTSxJQUFJLDBCQUEwQixLQUFLLFNBQVMsSUFBSSxXQUFXLENBQUMsMEJBQTBCLENBQUMsRUFBRTtRQUM5RixZQUFZLEdBQUcscUJBQTBCLENBQUM7UUFDMUMsY0FBYyxHQUFHLFFBQTRCLENBQUM7UUFDOUMsU0FBUyxHQUFHLDBCQUEyQyxDQUFDO0tBQ3pEO1NBQU07UUFDTCxZQUFZLEdBQUcscUJBQTBC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Y0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUMzQztJQUFDLE9BQU8sR0FBRyxFQUFFO1FBQ1osVUFBVSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN0QixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELElBQUksVUFBVSxDQUFDLE1BQU0sRUFBRTtRQUNyQixPQUFPLFNBQVMsQ0FBQztLQUNsQjtJQUNELFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsSUFBSSxVQUFVLENBQUMsTUFBTSxFQUFFO1FBQ3JCLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDO0FBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAnLi4vT2JzZXJ2YWJsZSc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBpZGVudGl0eSB9IGZyb20gJy4uL3V0aWwvaWRlbnRpdHknO1xuaW1wb3J0IHsgU2NoZWR1bGVyQWN0aW9uLCBTY2hlZHVsZXJMaWtlIH0gZnJvbSAnLi4vdHlwZXMnO1xuaW1wb3J0IHsgaXNTY2hlZHVsZXIgfSBmcm9tICcuLi91dGlsL2lzU2NoZWR1bGVyJztcblxuZXhwb3J0IHR5cGUgQ29uZGl0aW9uRnVuYzxTPiA9IChzdGF0ZTogUykgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIEl0ZXJhdGVGdW5jPFM+ID0gKHN0YXRlOiBTKSA9PiBTO1xuZXhwb3J0IHR5cGUgUmVzdWx0RnVuYzxTLCBUPiA9IChzdGF0ZTogUykgPT4gVDtcblxuaW50ZXJmYWNlIFNjaGVkdWxlclN0YXRlPFQsIFM+IHtcbiAgbmVlZEl0ZXJhdGU/OiBib29sZWFuO1xuICBzdGF0ZTogUztcbiAgc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxUPjtcbiAgY29uZGl0aW9uPzogQ29uZGl0aW9uRnVuYzxTPjtcbiAgaXRlcmF0ZTogSXRlcmF0ZUZ1bmM8Uz47XG4gIHJlc3VsdFNlbGVjdG9yOiBSZXN1bHRGdW5jPFMsIFQ+O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIEdlbmVyYXRlQmFzZU9wdGlvbnM8Uz4ge1xuICAvKipcbiAgICogSW5pdGlhbCBzdGF0ZS5cbiAgICovXG4gIGluaXRpYWxTdGF0ZTogUztcbiAgLyoqXG4gICAqIENvbmRpdGlvbiBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgc3RhdGUgYW5kIHJldHVybnMgYm9vbGVhbi5cbiAgICogV2hlbiBpdCByZXR1cm5zIGZhbHNlLCB0aGUgZ2VuZXJhdG9yIHN0b3BzLlxuICAgKiBJZiBub3Qgc3BlY2lmaWVkLCBhIGdlbmVyYXRvciBuZXZlciBzdG9wcy5cbiAgICovXG4gIGNvbmRpdGlvbj86IENvbmRpdGlvbkZ1bmM8Uz47XG4gIC8qKlxuICAgKiBJdGVyYXRlIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBuZXcgc3RhdGUuXG4gICAqL1xuICBpdGVyYXRlOiBJdGVyYXRlRnVuYzxTPjtcbiAgLyoqXG4gICAqIFNjaGVkdWxlckxpa2UgdG8gdXNlIGZvciBnZW5lcmF0aW9uIHByb2Nlc3MuXG4gICAqIEJ5IGRlZmF1bHQsIGEgZ2VuZXJhdG9yIHN0YXJ0cyBpbW1lZGlhdGVseS5cbiAgICovXG4gIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJhdGVPcHRpb25zPFQsIFM+IGV4dGVuZHMgR2VuZXJhdGVCYXNlT3B0aW9uczxTPiB7XG4gIC8qKlxuICAgKiBSZXN1bHQgc2VsZWN0aW9uIGZ1bmN0aW9uIHRoYXQgYWNjZXB0cyBzdGF0ZSBhbmQgcmV0dXJucyBhIHZhbHVlIHRvIGVtaXQuXG4gICAqL1xuICByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPjtcbn1cblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gb2JzZXJ2YWJsZSBzZXF1ZW5jZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHByb2R1Y2luZyB0aGUgc2VxdWVuY2UncyBlbGVtZW50cywgdXNpbmcgdGhlIHNwZWNpZmllZCBzY2hlZHVsZXJcbiAqIHRvIHNlbmQgb3V0IG9ic2VydmVyIG1lc3NhZ2VzLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKDAsIHggPT4geCA8IDEwLCB4ID0+IHggKyAxLCB4ID0+IHgpO1xuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzaW5nIGFzYXAgc2NoZWR1bGVyLCBwcm9kdWNlcyBzZXF1ZW5jZSBvZiAyLCAzLCA1LCB0aGVuIGNvbXBsZXRlcy48L2NhcHRpb24+XG4gKiBjb25zdCByZXMgPSBnZW5lcmF0ZSgxLCB4ID0+IHggPCA1LCB4ID0+ICAqIDIsIHggPT4geCArIDEsIGFzYXApO1xuICpcbiAqIEBzZWUge0BsaW5rIGZyb219XG4gKiBAc2VlIHtAbGluayBPYnNlcnZhYmxlfVxuICpcbiAqIEBwYXJhbSB7U30gaW5pdGlhbFN0YXRlIEluaXRpYWwgc3RhdGUuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IGJvb2xlYW59IGNvbmRpdGlvbiBDb25kaXRpb24gdG8gdGVybWluYXRlIGdlbmVyYXRpb24gKHVwb24gcmV0dXJuaW5nIGZhbHNlKS5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogU30gaXRlcmF0ZSBJdGVyYXRpb24gc3RlcCBmdW5jdGlvbi5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24gKHN0YXRlOiBTKTogVH0gcmVzdWx0U2VsZWN0b3IgU2VsZWN0b3IgZnVuY3Rpb24gZm9yIHJlc3VsdHMgcHJvZHVjZWQgaW4gdGhlIHNlcXVlbmNlLiAoZGVwcmVjYXRlZClcbiAqIEBwYXJhbSB7U2NoZWR1bGVyTGlrZX0gW3NjaGVkdWxlcl0gQSB7QGxpbmsgU2NoZWR1bGVyTGlrZX0gb24gd2hpY2ggdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcC4gSWYgbm90IHByb3ZpZGVkLCBkZWZhdWx0cyB0byBlbWl0IGltbWVkaWF0ZWx5LlxuICogQHJldHVybnMge09ic2VydmFibGU8VD59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbiAgZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFQsIFM+KGluaXRpYWxTdGF0ZTogUyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmRpdGlvbjogQ29uZGl0aW9uRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0U2VsZWN0b3I6IFJlc3VsdEZ1bmM8UywgVD4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzY2hlZHVsZXI/OiBTY2hlZHVsZXJMaWtlKTogT2JzZXJ2YWJsZTxUPjtcblxuLyoqXG4gKiBHZW5lcmF0ZXMgYW4gT2JzZXJ2YWJsZSBieSBydW5uaW5nIGEgc3RhdGUtZHJpdmVuIGxvb3BcbiAqIHRoYXQgZW1pdHMgYW4gZWxlbWVudCBvbiBlYWNoIGl0ZXJhdGlvbi5cbiAqXG4gKiA8c3BhbiBjbGFzcz1cImluZm9ybWFsXCI+VXNlIGl0IGluc3RlYWQgb2YgbmV4dGluZyB2YWx1ZXMgaW4gYSBmb3IgbG9vcC48L3NwYW4+XG4gKlxuICogPGltZyBzcmM9XCIuL2ltZy9nZW5lcmF0ZS5wbmdcIiB3aWR0aD1cIjEwMCVcIj5cbiAqXG4gKiBgZ2VuZXJhdGVgIGFsbG93cyB5b3UgdG8gY3JlYXRlIHN0cmVhbSBvZiB2YWx1ZXMgZ2VuZXJhdGVkIHdpdGggYSBsb29wIHZlcnkgc2ltaWxhciB0b1xuICogdHJhZGl0aW9uYWwgZm9yIGxvb3AuIEZpcnN0IGFyZ3VtZW50IG9mIGBnZW5lcmF0ZWAgaXMgYSBiZWdpbm5pbmcgdmFsdWUuIFNlY29uZCBhcmd1bWVudFxuICogaXMgYSBmdW5jdGlvbiB0aGF0IGFjY2VwdHMgdGhpcyB2YWx1ZSBhbmQgdGVzdHMgaWYgc29tZSBjb25kaXRpb24gc3RpbGwgaG9sZHMuIElmIGl0IGRvZXMsXG4gKiBsb29wIGNvbnRpbnVlcywgaWYgbm90LCBpdCBzdG9wcy4gVGhpcmQgdmFsdWUgaXMgYSBmdW5jdGlvbiB3aGljaCB0YWtlcyBwcmV2aW91c2x5IGRlZmluZWRcbiAqIHZhbHVlIGFuZCBtb2RpZmllcyBpdCBpbiBzb21lIHdheSBvbiBlYWNoIGl0ZXJhdGlvbi4gTm90ZSBob3cgdGhlc2UgdGhyZWUgcGFyYW1ldGVyc1xuICogYXJlIGRpcmVjdCBlcXVpdmFsZW50cyBvZiB0aHJlZSBleHByZXNzaW9ucyBpbiByZWd1bGFyIGZvciBsb29wOiBmaXJzdCBleHByZXNzaW9uXG4gKiBpbml0aWFsaXplcyBzb21lIHN0YXRlIChmb3IgZXhhbXBsZSBudW1lcmljIGluZGV4KSwgc2Vjb25kIHRlc3RzIGlmIGxvb3AgY2FuIG1ha2UgbmV4dFxuICogaXRlcmF0aW9uIChmb3IgZXhhbXBsZSBpZiBpbmRleCBpcyBsb3dlciB0aGFuIDEwKSBhbmQgdGhpcmQgc3RhdGVzIGhvdyBkZWZpbmVkIHZhbHVlXG4gKiB3aWxsIGJlIG1vZGlmaWVkIG9uIGV2ZXJ5IHN0ZXAgKGluZGV4IHdpbGwgYmUgaW5jcmVtZW50ZWQgYnkgb25lKS5cbiAqXG4gKiBSZXR1cm4gdmFsdWUgb2YgYSBgZ2VuZXJhdGVgIG9wZXJhdG9yIGlzIGFuIE9ic2VydmFibGUgdGhhdCBvbiBlYWNoIGxvb3AgaXRlcmF0aW9uXG4gKiBlbWl0cyBhIHZhbHVlLiBGaXJzdCwgY29uZGl0aW9uIGZ1bmN0aW9uIGlzIHJhbi4gSWYgaXQgcmV0dXJuZWQgdHJ1ZSwgT2JzZXJ2YWJsZVxuICogZW1pdHMgY3VycmVudGx5IHN0b3JlZCB2YWx1ZSAoaW5pdGlhbCB2YWx1ZSBhdCB0aGUgZmlyc3QgaXRlcmF0aW9uKSBhbmQgdGhlbiB1cGRhdGVzXG4gKiB0aGF0IHZhbHVlIHdpdGggaXRlcmF0ZSBmdW5jdGlvbi4gSWYgYXQgc29tZSBwb2ludCBjb25kaXRpb24gcmV0dXJuZWQgZmFsc2UsIE9ic2VydmFibGVcbiAqIGNvbXBsZXRlcyBhdCB0aGF0IG1vbWVudC5cbiAqXG4gKiBPcHRpb25hbGx5IHlvdSBjYW4gcGFzcyBmb3VydGggcGFyYW1ldGVyIHRvIGBnZW5lcmF0ZWAgLSBhIHJlc3VsdCBzZWxlY3RvciBmdW5jdGlvbiB3aGljaCBhbGxvd3MgeW91XG4gKiB0byBpbW1lZGlhdGVseSBtYXAgdmFsdWUgdGhhdCB3b3VsZCBub3JtYWxseSBiZSBlbWl0dGVkIGJ5IGFuIE9ic2VydmFibGUuXG4gKlxuICogSWYgeW91IGZpbmQgdGhyZWUgYW5vbnltb3VzIGZ1bmN0aW9ucyBpbiBgZ2VuZXJhdGVgIGNhbGwgaGFyZCB0byByZWFkLCB5b3UgY2FuIHByb3ZpZGVcbiAqIHNpbmdsZSBvYmplY3QgdG8gdGhlIG9wZXJhdG9yIGluc3RlYWQuIFRoYXQgb2JqZWN0IGhhcyBwcm9wZXJ0aWVzOiBgaW5pdGlhbFN0YXRlYCxcbiAqIGBjb25kaXRpb25gLCBgaXRlcmF0ZWAgYW5kIGByZXN1bHRTZWxlY3RvcmAsIHdoaWNoIHNob3VsZCBoYXZlIHJlc3BlY3RpdmUgdmFsdWVzIHRoYXQgeW91XG4gKiB3b3VsZCBub3JtYWxseSBwYXNzIHRvIGBnZW5lcmF0ZWAuIGByZXN1bHRTZWxlY3RvcmAgaXMgc3RpbGwgb3B0aW9uYWwsIGJ1dCB0aGF0IGZvcm1cbiAqIG9mIGNhbGxpbmcgYGdlbmVyYXRlYCBhbGxvd3MgeW91IHRvIG9taXQgYGNvbmRpdGlvbmAgYXMgd2VsbC4gSWYgeW91IG9taXQgaXQsIHRoYXQgbWVhbnNcbiAqIGNvbmRpdGlvbiBhbHdheXMgaG9sZHMsIHNvIG91dHB1dCBPYnNlcnZhYmxlIHdpbGwgbmV2ZXIgY29tcGxldGUuXG4gKlxuICogQm90aCBmb3JtcyBvZiBgZ2VuZXJhdGVgIGNhbiBvcHRpb25hbGx5IGFjY2VwdCBhIHNjaGVkdWxlci4gSW4gY2FzZSBvZiBtdWx0aS1wYXJhbWV0ZXIgY2FsbCxcbiAqIHNjaGVkdWxlciBzaW1wbHkgY29tZXMgYXMgYSBsYXN0IGFyZ3VtZW50IChubyBtYXR0ZXIgaWYgdGhlcmUgaXMgcmVzdWx0U2VsZWN0b3JcbiAqIGZ1bmN0aW9uIG9yIG5vdCkuIEluIGNhc2Ugb2Ygc2luZ2xlLXBhcmFtZXRlciBjYWxsLCB5b3UgY2FuIHByb3ZpZGUgaXQgYXMgYVxuICogYHNjaGVkdWxlcmAgcHJvcGVydHkgb24gb2JqZWN0IHBhc3NlZCB0byB0aGUgb3BlcmF0b3IuIEluIGJvdGggY2FzZXMgc2NoZWR1bGVyIGRlY2lkZXMgd2hlblxuICogbmV4dCBpdGVyYXRpb24gb2YgdGhlIGxvb3Agd2lsbCBoYXBwZW4gYW5kIHRoZXJlZm9yZSB3aGVuIG5leHQgdmFsdWUgd2lsbCBiZSBlbWl0dGVkXG4gKiBieSB0aGUgT2JzZXJ2YWJsZS4gRm9yIGV4YW1wbGUgdG8gZW5zdXJlIHRoYXQgZWFjaCB2YWx1ZSBpcyBwdXNoZWQgdG8gdGhlIG9ic2VydmVyXG4gKiBvbiBzZXBhcmF0ZSB0YXNrIGluIGV2ZW50IGxvb3AsIHlvdSBjb3VsZCB1c2UgYGFzeW5jYCBzY2hlZHVsZXIuIE5vdGUgdGhhdFxuICogYnkgZGVmYXVsdCAod2hlbiBubyBzY2hlZHVsZXIgaXMgcGFzc2VkKSB2YWx1ZXMgYXJlIHNpbXBseSBlbWl0dGVkIHN5bmNocm9ub3VzbHkuXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSB3aXRoIGNvbmRpdGlvbiBhbmQgaXRlcmF0ZSBmdW5jdGlvbnMuPC9jYXB0aW9uPlxuICogY29uc3QgZ2VuZXJhdGVkID0gZ2VuZXJhdGUoMCwgeCA9PiB4IDwgMywgeCA9PiB4ICsgMSk7XG4gKlxuICogZ2VuZXJhdGVkLnN1YnNjcmliZShcbiAqICAgdmFsdWUgPT4gY29uc29sZS5sb2codmFsdWUpLFxuICogICBlcnIgPT4ge30sXG4gKiAgICgpID0+IGNvbnNvbGUubG9nKCdZbyEnKVxuICogKTtcbiAqXG4gKiAvLyBMb2dzOlxuICogLy8gMFxuICogLy8gMVxuICogLy8gMlxuICogLy8gXCJZbyFcIlxuICpcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Vc2Ugd2l0aCBjb25kaXRpb24sIGl0ZXJhdGUgYW5kIHJlc3VsdFNlbGVjdG9yIGZ1bmN0aW9ucy48L2NhcHRpb24+XG4gKiBjb25zdCBnZW5lcmF0ZWQgPSBnZW5lcmF0ZSgwLCB4ID0+IHggPCAzLCB4ID0+IHggKyAxLCB4ID0+IHggKiAxMDAwKTtcbiAqXG4gKiBnZW5lcmF0ZWQuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1lvIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwXG4gKiAvLyAxMDAwXG4gKiAvLyAyMDAwXG4gKiAvLyBcIllvIVwiXG4gKlxuICpcbiAqIEBleGFtcGxlIDxjYXB0aW9uPlVzZSB3aXRoIG9wdGlvbnMgb2JqZWN0LjwvY2FwdGlvbj5cbiAqIGNvbnN0IGdlbmVyYXRlZCA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBjb25kaXRpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlIDwgMzsgfSxcbiAqICAgaXRlcmF0ZSh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKyAxOyB9LFxuICogICByZXN1bHRTZWxlY3Rvcih2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKiAxMDAwOyB9XG4gKiB9KTtcbiAqXG4gKiBnZW5lcmF0ZWQuc3Vic2NyaWJlKFxuICogICB2YWx1ZSA9PiBjb25zb2xlLmxvZyh2YWx1ZSksXG4gKiAgIGVyciA9PiB7fSxcbiAqICAgKCkgPT4gY29uc29sZS5sb2coJ1lvIScpXG4gKiApO1xuICpcbiAqIC8vIExvZ3M6XG4gKiAvLyAwXG4gKiAvLyAxMDAwXG4gKiAvLyAyMDAwXG4gKiAvLyBcIllvIVwiXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+VXNlIG9wdGlvbnMgb2JqZWN0IHdpdGhvdXQgY29uZGl0aW9uIGZ1bmN0aW9uLjwvY2FwdGlvbj5cbiAqIGNvbnN0IGdlbmVyYXRlZCA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBpdGVyYXRlKHZhbHVlKSB7IHJldHVybiB2YWx1ZSArIDE7IH0sXG4gKiAgIHJlc3VsdFNlbGVjdG9yKHZhbHVlKSB7IHJldHVybiB2YWx1ZSAqIDEwMDA7IH1cbiAqIH0pO1xuICpcbiAqIGdlbmVyYXRlZC5zdWJzY3JpYmUoXG4gKiAgIHZhbHVlID0+IGNvbnNvbGUubG9nKHZhbHVlKSxcbiAqICAgZXJyID0+IHt9LFxuICogICAoKSA9PiBjb25zb2xlLmxvZygnWW8hJykgLy8gVGhpcyB3aWxsIG5ldmVyIHJ1bi5cbiAqICk7XG4gKlxuICogLy8gTG9nczpcbiAqIC8vIDBcbiAqIC8vIDEwMDBcbiAqIC8vIDIwMDBcbiAqIC8vIDMwMDBcbiAqIC8vIC4uLmFuZCBuZXZlciBzdG9wcy5cbiAqXG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIGNyZWF0ZX1cbiAqXG4gKiBAcGFyYW0ge1N9IGluaXRpYWxTdGF0ZSBJbml0aWFsIHN0YXRlLlxuICogQHBhcmFtIHtmdW5jdGlvbiAoc3RhdGU6IFMpOiBib29sZWFufSBjb25kaXRpb24gQ29uZGl0aW9uIHRvIHRlcm1pbmF0ZSBnZW5lcmF0aW9uICh1cG9uIHJldHVybmluZyBmYWxzZSkuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IFN9IGl0ZXJhdGUgSXRlcmF0aW9uIHN0ZXAgZnVuY3Rpb24uXG4gKiBAcGFyYW0ge2Z1bmN0aW9uIChzdGF0ZTogUyk6IFR9IFtyZXN1bHRTZWxlY3Rvcl0gU2VsZWN0b3IgZnVuY3Rpb24gZm9yIHJlc3VsdHMgcHJvZHVjZWQgaW4gdGhlIHNlcXVlbmNlLlxuICogQHBhcmFtIHtTY2hlZHVsZXJ9IFtzY2hlZHVsZXJdIEEge0BsaW5rIFNjaGVkdWxlcn0gb24gd2hpY2ggdG8gcnVuIHRoZSBnZW5lcmF0b3IgbG9vcC4gSWYgbm90IHByb3ZpZGVkLCBkZWZhdWx0cyB0byBlbWl0dGluZyBpbW1lZGlhdGVseS5cbiAqIEByZXR1cm4ge09ic2VydmFibGU8VD59IFRoZSBnZW5lcmF0ZWQgc2VxdWVuY2UuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZW5lcmF0ZTxTPihpbml0aWFsU3RhdGU6IFMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZGl0aW9uOiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGU6IEl0ZXJhdGVGdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVkdWxlcj86IFNjaGVkdWxlckxpa2UpOiBPYnNlcnZhYmxlPFM+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKiBUaGUgb3ZlcmxvYWQgYWNjZXB0cyBvcHRpb25zIG9iamVjdCB0aGF0IG1pZ2h0IGNvbnRhaW4gaW5pdGlhbCBzdGF0ZSwgaXRlcmF0ZSxcbiAqIGNvbmRpdGlvbiBhbmQgc2NoZWR1bGVyLlxuICpcbiAqICFbXShnZW5lcmF0ZS5wbmcpXG4gKlxuICogQGV4YW1wbGUgPGNhcHRpb24+UHJvZHVjZXMgc2VxdWVuY2Ugb2YgMCwgMSwgMiwgLi4uIDksIHRoZW4gY29tcGxldGVzLjwvY2FwdGlvbj5cbiAqIGNvbnN0IHJlcyA9IGdlbmVyYXRlKHtcbiAqICAgaW5pdGlhbFN0YXRlOiAwLFxuICogICBjb25kaXRpb246IHggPT4geCA8IDEwLFxuICogICBpdGVyYXRlOiB4ID0+IHggKyAxLFxuICogfSk7XG4gKlxuICogQHNlZSB7QGxpbmsgZnJvbX1cbiAqIEBzZWUge0BsaW5rIE9ic2VydmFibGV9XG4gKlxuICogQHBhcmFtIHtHZW5lcmF0ZUJhc2VPcHRpb25zPFM+fSBvcHRpb25zIE9iamVjdCB0aGF0IG11c3QgY29udGFpbiBpbml0aWFsU3RhdGUsIGl0ZXJhdGUgYW5kIG1pZ2h0IGNvbnRhaW4gY29uZGl0aW9uIGFuZCBzY2hlZHVsZXIuXG4gKiBAcmV0dXJucyB7T2JzZXJ2YWJsZTxTPn0gVGhlIGdlbmVyYXRlZCBzZXF1ZW5jZS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFM+KG9wdGlvbnM6IEdlbmVyYXRlQmFzZU9wdGlvbnM8Uz4pOiBPYnNlcnZhYmxlPFM+O1xuXG4vKipcbiAqIEdlbmVyYXRlcyBhbiBvYnNlcnZhYmxlIHNlcXVlbmNlIGJ5IHJ1bm5pbmcgYSBzdGF0ZS1kcml2ZW4gbG9vcFxuICogcHJvZHVjaW5nIHRoZSBzZXF1ZW5jZSdzIGVsZW1lbnRzLCB1c2luZyB0aGUgc3BlY2lmaWVkIHNjaGVkdWxlclxuICogdG8gc2VuZCBvdXQgb2JzZXJ2ZXIgbWVzc2FnZXMuXG4gKiBUaGUgb3ZlcmxvYWQgYWNjZXB0cyBvcHRpb25zIG9iamVjdCB0aGF0IG1pZ2h0IGNvbnRhaW4gaW5pdGlhbCBzdGF0ZSwgaXRlcmF0ZSxcbiAqIGNvbmRpdGlvbiwgcmVzdWx0IHNlbGVjdG9yIGFuZCBzY2hlZHVsZXIuXG4gKlxuICogIVtdKGdlbmVyYXRlLnBuZylcbiAqXG4gKiBAZXhhbXBsZSA8Y2FwdGlvbj5Qcm9kdWNlcyBzZXF1ZW5jZSBvZiAwLCAxLCAyLCAuLi4gOSwgdGhlbiBjb21wbGV0ZXMuPC9jYXB0aW9uPlxuICogY29uc3QgcmVzID0gZ2VuZXJhdGUoe1xuICogICBpbml0aWFsU3RhdGU6IDAsXG4gKiAgIGNvbmRpdGlvbjogeCA9PiB4IDwgMTAsXG4gKiAgIGl0ZXJhdGU6IHggPT4geCArIDEsXG4gKiAgIHJlc3VsdFNlbGVjdG9yOiB4ID0+IHgsXG4gKiB9KTtcbiAqXG4gKiBAc2VlIHtAbGluayBmcm9tfVxuICogQHNlZSB7QGxpbmsgT2JzZXJ2YWJsZX1cbiAqXG4gKiBAcGFyYW0ge0dlbmVyYXRlT3B0aW9uczxULCBTPn0gb3B0aW9ucyBPYmplY3QgdGhhdCBtdXN0IGNvbnRhaW4gaW5pdGlhbFN0YXRlLCBpdGVyYXRlLCByZXN1bHRTZWxlY3RvciBhbmQgbWlnaHQgY29udGFpbiBjb25kaXRpb24gYW5kIHNjaGVkdWxlci5cbiAqIEByZXR1cm5zIHtPYnNlcnZhYmxlPFQ+fSBUaGUgZ2VuZXJhdGVkIHNlcXVlbmNlLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGU8VCwgUz4ob3B0aW9uczogR2VuZXJhdGVPcHRpb25zPFQsIFM+KTogT2JzZXJ2YWJsZTxUPjtcblxuZXhwb3J0IGZ1bmN0aW9uIGdlbmVyYXRlPFQsIFM+KGluaXRpYWxTdGF0ZU9yT3B0aW9uczogUyB8IEdlbmVyYXRlT3B0aW9uczxULCBTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25kaXRpb24/OiBDb25kaXRpb25GdW5jPFM+LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZXJhdGU/OiBJdGVyYXRlRnVuYzxTPixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZT86IChSZXN1bHRGdW5jPFMsIFQ+KSB8IFNjaGVkdWxlckxpa2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2NoZWR1bGVyPzogU2NoZWR1bGVyTGlrZSk6IE9ic2VydmFibGU8VD4ge1xuXG4gIGxldCByZXN1bHRTZWxlY3RvcjogUmVzdWx0RnVuYzxTLCBUPjtcbiAgbGV0IGluaXRpYWxTdGF0ZTogUztcblxuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxKSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBHZW5lcmF0ZU9wdGlvbnM8VCwgUz47XG4gICAgaW5pdGlhbFN0YXRlID0gb3B0aW9ucy5pbml0aWFsU3RhdGU7XG4gICAgY29uZGl0aW9uID0gb3B0aW9ucy5jb25kaXRpb247XG4gICAgaXRlcmF0ZSA9IG9wdGlvbnMuaXRlcmF0ZTtcbiAgICByZXN1bHRTZWxlY3RvciA9IG9wdGlvbnMucmVzdWx0U2VsZWN0b3IgfHwgaWRlbnRpdHkgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgICBzY2hlZHVsZXIgPSBvcHRpb25zLnNjaGVkdWxlcjtcbiAgfSBlbHNlIGlmIChyZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSA9PT0gdW5kZWZpbmVkIHx8IGlzU2NoZWR1bGVyKHJlc3VsdFNlbGVjdG9yT3JPYnNlcnZhYmxlKSkge1xuICAgIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBTO1xuICAgIHJlc3VsdFNlbGVjdG9yID0gaWRlbnRpdHkgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgICBzY2hlZHVsZXIgPSByZXN1bHRTZWxlY3Rvck9yT2JzZXJ2YWJsZSBhcyBTY2hlZHVsZXJMaWtlO1xuICB9IGVsc2Uge1xuICAgIGluaXRpYWxTdGF0ZSA9IGluaXRpYWxTdGF0ZU9yT3B0aW9ucyBhcyBTO1xuICAgIHJlc3VsdFNlbGVjdG9yID0gcmVzdWx0U2VsZWN0b3JPck9ic2VydmFibGUgYXMgUmVzdWx0RnVuYzxTLCBUPjtcbiAgfVxuXG4gIHJldHVybiBuZXcgT2JzZXJ2YWJsZTxUPihzdWJzY3JpYmVyID0+IHtcbiAgICBsZXQgc3RhdGUgPSBpbml0aWFsU3RhdGU7XG4gICAgaWYgKHNjaGVkdWxlcikge1xuICAgICAgcmV0dXJuIHNjaGVkdWxlci5zY2hlZHVsZTxTY2hlZHVsZXJTdGF0ZTxULCBTPj4oZGlzcGF0Y2gsIDAsIHtcbiAgICAgICAgc3Vic2NyaWJlcixcbiAgICAgICAgaXRlcmF0ZSxcbiAgICAgICAgY29uZGl0aW9uLFxuICAgICAgICByZXN1bHRTZWxlY3RvcixcbiAgICAgICAgc3RhdGVcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGRvIHtcbiAgICAgIGlmIChjb25kaXRpb24pIHtcbiAgICAgICAgbGV0IGNvbmRpdGlvblJlc3VsdDogYm9vbGVhbjtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb25kaXRpb25SZXN1bHQgPSBjb25kaXRpb24oc3RhdGUpO1xuICAgICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNvbmRpdGlvblJlc3VsdCkge1xuICAgICAgICAgIHN1YnNjcmliZXIuY29tcGxldGUoKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGV0IHZhbHVlOiBUO1xuICAgICAgdHJ5IHtcbiAgICAgICAgdmFsdWUgPSByZXN1bHRTZWxlY3RvcihzdGF0ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgICAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgICAgIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHN0YXRlID0gaXRlcmF0ZShzdGF0ZSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgc3Vic2NyaWJlci5lcnJvcihlcnIpO1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0gd2hpbGUgKHRydWUpO1xuXG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGRpc3BhdGNoPFQsIFM+KHRoaXM6IFNjaGVkdWxlckFjdGlvbjxTY2hlZHVsZXJTdGF0ZTxULCBTPj4sIHN0YXRlOiBTY2hlZHVsZXJTdGF0ZTxULCBTPikge1xuICBjb25zdCB7IHN1YnNjcmliZXIsIGNvbmRpdGlvbiB9ID0gc3RhdGU7XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgaWYgKHN0YXRlLm5lZWRJdGVyYXRlKSB7XG4gICAgdHJ5IHtcbiAgICAgIHN0YXRlLnN0YXRlID0gc3RhdGUuaXRlcmF0ZShzdGF0ZS5zdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBzdGF0ZS5uZWVkSXRlcmF0ZSA9IHRydWU7XG4gIH1cbiAgaWYgKGNvbmRpdGlvbikge1xuICAgIGxldCBjb25kaXRpb25SZXN1bHQ6IGJvb2xlYW47XG4gICAgdHJ5IHtcbiAgICAgIGNvbmRpdGlvblJlc3VsdCA9IGNvbmRpdGlvbihzdGF0ZS5zdGF0ZSk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBzdWJzY3JpYmVyLmVycm9yKGVycik7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBpZiAoIWNvbmRpdGlvblJlc3VsdCkge1xuICAgICAgc3Vic2NyaWJlci5jb21wbGV0ZSgpO1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG4gICAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBsZXQgdmFsdWU6IFQ7XG4gIHRyeSB7XG4gICAgdmFsdWUgPSBzdGF0ZS5yZXN1bHRTZWxlY3RvcihzdGF0ZS5zdGF0ZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHN1YnNjcmliZXIuZXJyb3IoZXJyKTtcbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChzdWJzY3JpYmVyLmNsb3NlZCkge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbiAgc3Vic2NyaWJlci5uZXh0KHZhbHVlKTtcbiAgaWYgKHN1YnNjcmliZXIuY2xvc2VkKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuICByZXR1cm4gdGhpcy5zY2hlZHVsZShzdGF0ZSk7XG59XG4iXX0=