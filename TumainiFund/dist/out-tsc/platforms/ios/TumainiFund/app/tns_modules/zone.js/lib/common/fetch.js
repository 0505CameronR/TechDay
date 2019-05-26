/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Zone.__load_patch('fetch', (global, Zone, api) => {
    let fetch = global['fetch'];
    if (typeof fetch !== 'function') {
        return;
    }
    const originalFetch = global[api.symbol('fetch')];
    if (originalFetch) {
        // restore unpatched fetch first
        fetch = originalFetch;
    }
    const ZoneAwarePromise = global.Promise;
    const symbolThenPatched = api.symbol('thenPatched');
    const fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    const fetchTaskAborting = api.symbol('fetchTaskAborting');
    const OriginalAbortController = global['AbortController'];
    const supportAbort = typeof OriginalAbortController === 'function';
    let abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            const abortController = new OriginalAbortController();
            const signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', (delegate) => (self, args) => {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        });
    }
    const placeholder = function () { };
    global['fetch'] = function () {
        const args = Array.prototype.slice.call(arguments);
        const options = args.length > 1 ? args[1] : null;
        const signal = options && options.signal;
        return new Promise((res, rej) => {
            const task = Zone.current.scheduleMacroTask('fetch', placeholder, { fetchArgs: args }, () => {
                let fetchPromise;
                let zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    let ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then((resource) => {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, (error) => {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, () => {
                if (!supportAbort) {
                    rej('No AbortController supported, can not cancel fetch');
                    return;
                }
                if (signal && signal.abortController && !signal.aborted &&
                    typeof signal.abortController.abort === 'function' && abortNative) {
                    try {
                        Zone.current[fetchTaskAborting] = true;
                        abortNative.call(signal.abortController);
                    }
                    finally {
                        Zone.current[fetchTaskAborting] = false;
                    }
                }
                else {
                    rej('cancel fetch need a AbortController.signal');
                }
            });
            if (signal && signal.abortController) {
                signal.abortController.task = task;
            }
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vZmV0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0g7OztHQUdHO0FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUk1RSxJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDNUIsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7UUFDL0IsT0FBTztLQUNSO0lBQ0QsTUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNsRCxJQUFJLGFBQWEsRUFBRTtRQUNqQixnQ0FBZ0M7UUFDaEMsS0FBSyxHQUFHLGFBQWEsQ0FBQztLQUN2QjtJQUNELE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN4QyxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEQsTUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUQsTUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUQsTUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMxRCxNQUFNLFlBQVksR0FBRyxPQUFPLHVCQUF1QixLQUFLLFVBQVUsQ0FBQztJQUNuRSxJQUFJLFdBQVcsR0FBa0IsSUFBSSxDQUFDO0lBQ3RDLElBQUksWUFBWSxFQUFFO1FBQ2hCLE1B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Q1QsQ0FBQyxFQUNELEdBQUcsRUFBRTtnQkFDSCxJQUFJLENBQUMsWUFBWSxFQUFFO29CQUNqQixHQUFHLENBQUMsb0RBQW9ELENBQUMsQ0FBQztvQkFDMUQsT0FBTztpQkFDUjtnQkFDRCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsZUFBZSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU87b0JBQ25ELE9BQU8sTUFBTSxDQUFDLGVBQWUsQ0FBQyxLQUFLLEtBQUssVUFBVSxJQUFJLFdBQVcsRUFBRTtvQkFDckUsSUFBSTt3QkFDRCxJQUFJLENBQUMsT0FBZSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsSUFBSSxDQUFDO3dCQUNoRCxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxlQUFlLENBQUMsQ0FBQztxQkFDMUM7NEJBQVM7d0JBQ1AsSUFBSSxDQUFDLE9BQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLEtBQUssQ0FBQztxQkFDbEQ7aUJBQ0Y7cUJBQU07b0JBQ0wsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUM7aUJBQ25EO1lBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDUCxJQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsZUFBZSxFQUFFO2dCQUNwQyxNQUFNLENBQUMsZUFBZSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7YUFDcEM7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge21pc3NpbmdSZXF1aXJlfVxuICovXG5cblpvbmUuX19sb2FkX3BhdGNoKCdmZXRjaCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGludGVyZmFjZSBGZXRjaFRhc2tEYXRhIGV4dGVuZHMgVGFza0RhdGEge1xuICAgIGZldGNoQXJncz86IGFueVtdO1xuICB9XG4gIGxldCBmZXRjaCA9IGdsb2JhbFsnZmV0Y2gnXTtcbiAgaWYgKHR5cGVvZiBmZXRjaCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBvcmlnaW5hbEZldGNoID0gZ2xvYmFsW2FwaS5zeW1ib2woJ2ZldGNoJyldO1xuICBpZiAob3JpZ2luYWxGZXRjaCkge1xuICAgIC8vIHJlc3RvcmUgdW5wYXRjaGVkIGZldGNoIGZpcnN0XG4gICAgZmV0Y2ggPSBvcmlnaW5hbEZldGNoO1xuICB9XG4gIGNvbnN0IFpvbmVBd2FyZVByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbiAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBhcGkuc3ltYm9sKCd0aGVuUGF0Y2hlZCcpO1xuICBjb25zdCBmZXRjaFRhc2tTY2hlZHVsaW5nID0gYXBpLnN5bWJvbCgnZmV0Y2hUYXNrU2NoZWR1bGluZycpO1xuICBjb25zdCBmZXRjaFRhc2tBYm9ydGluZyA9IGFwaS5zeW1ib2woJ2ZldGNoVGFza0Fib3J0aW5nJyk7XG4gIGNvbnN0IE9yaWdpbmFsQWJvcnRDb250cm9sbGVyID0gZ2xvYmFsWydBYm9ydENvbnRyb2xsZXInXTtcbiAgY29uc3Qgc3VwcG9ydEFib3J0ID0gdHlwZW9mIE9yaWdpbmFsQWJvcnRDb250cm9sbGVyID09PSAnZnVuY3Rpb24nO1xuICBsZXQgYWJvcnROYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuICBpZiAoc3VwcG9ydEFib3J0KSB7XG4gICAgZ2xvYmFsWydBYm9ydENvbnRyb2xsZXInXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYWJvcnRDb250cm9sbGVyID0gbmV3IE9yaWdpbmFsQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBjb25zdCBzaWduYWwgPSBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgICAgc2lnbmFsLmFib3J0Q29udHJvbGxlciA9IGFib3J0Q29udHJvbGxlcjtcbiAgICAgIHJldHVybiBhYm9ydENvbnRyb2xsZXI7XG4gICAgfTtcbiAgICBhYm9ydE5hdGl2ZSA9IGFwaS5wYXRjaE1ldGhvZChcbiAgICAgICAgT3JpZ2luYWxBYm9ydENvbnRyb2xsZXIucHJvdG90eXBlLCAnYWJvcnQnLFxuICAgICAgICAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoc2VsZi50YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi50YXNrLnpvbmUuY2FuY2VsVGFzayhzZWxmLnRhc2spO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICB9XG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7fTtcbiAgZ2xvYmFsWydmZXRjaCddID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3MubGVuZ3RoID4gMSA/IGFyZ3NbMV0gOiBudWxsO1xuICAgIGNvbnN0IHNpZ25hbCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zaWduYWw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgY29uc3QgdGFzayA9IFpvbmUuY3VycmVudC5zY2hlZHVsZU1hY3JvVGFzayhcbiAgICAgICAgICAnZmV0Y2gnLCBwbGFjZWhvbGRlciwge2ZldGNoQXJnczogYXJnc30gYXMgRmV0Y2hUYXNrRGF0YSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmV0Y2hQcm9taXNlO1xuICAgICAgICAgICAgbGV0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAoem9uZSBhcyBhbnkpW2ZldGNoVGFza1NjaGVkdWxpbmddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmV0Y2hQcm9taXNlID0gZmV0Y2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICByZWooZXJyb3IpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAoem9uZSBhcyBhbnkpW2ZldGNoVGFza1NjaGVkdWxpbmddID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKGZldGNoUHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpKSB7XG4gICAgICAgICAgICAgIGxldCBjdG9yID0gZmV0Y2hQcm9taXNlLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICBpZiAoIWN0b3Jbc3ltYm9sVGhlblBhdGNoZWRdKSB7XG4gICAgICAgICAgICAgICAgYXBpLnBhdGNoVGhlbihjdG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmV0Y2hQcm9taXNlLnRoZW4oXG4gICAgICAgICAgICAgICAgKHJlc291cmNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSAnbm90U2NoZWR1bGVkJykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmVzKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gJ25vdFNjaGVkdWxlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJlaihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN1cHBvcnRBYm9ydCkge1xuICAgICAgICAgICAgICByZWooJ05vIEFib3J0Q29udHJvbGxlciBzdXBwb3J0ZWQsIGNhbiBub3QgY2FuY2VsIGZldGNoJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaWduYWwgJiYgc2lnbmFsLmFib3J0Q29udHJvbGxlciAmJiAhc2lnbmFsLmFib3J0ZWQgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2lnbmFsLmFib3J0Q29udHJvbGxlci5hYm9ydCA9PT0gJ2Z1bmN0aW9uJyAmJiBhYm9ydE5hdGl2ZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIChab25lLmN1cnJlbnQgYXMgYW55KVtmZXRjaFRhc2tBYm9ydGluZ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFib3J0TmF0aXZlLmNhbGwoc2lnbmFsLmFib3J0Q29udHJvbGxlcik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgKFpvbmUuY3VycmVudCBhcyBhbnkpW2ZldGNoVGFza0Fib3J0aW5nXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWooJ2NhbmNlbCBmZXRjaCBuZWVkIGEgQWJvcnRDb250cm9sbGVyLnNpZ25hbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgaWYgKHNpZ25hbCAmJiBzaWduYWwuYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICAgIHNpZ25hbC5hYm9ydENvbnRyb2xsZXIudGFzayA9IHRhc2s7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTtcbiJdfQ==