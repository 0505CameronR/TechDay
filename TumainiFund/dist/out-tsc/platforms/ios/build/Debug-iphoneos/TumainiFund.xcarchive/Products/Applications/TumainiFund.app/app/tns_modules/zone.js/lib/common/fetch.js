/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', (global, Zone, api) => {
    const fetch = global['fetch'];
    const ZoneAwarePromise = global.Promise;
    const symbolThenPatched = api.symbol('thenPatched');
    const fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    const fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
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
            const task = Zone.current.scheduleMacroTask('fetch', placeholder, args, () => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vZmV0Y2gudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCLEVBQUUsRUFBRTtJQUM1RSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3hDLE1BQU0saUJBQWlCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQztJQUNwRCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUM5RCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsbUJBQW1CLENBQUMsQ0FBQztJQUMxRCxJQUFJLE9BQU8sS0FBSyxLQUFLLFVBQVUsRUFBRTtRQUMvQixPQUFPO0tBQ1I7SUFDRCxNQUFNLHVCQUF1QixHQUFHLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0lBQzFELE1BQU0sWUFBWSxHQUFHLE9BQU8sdUJBQXVCLEtBQUssVUFBVSxDQUFDO0lBQ25FLElBQUksV0FBVyxHQUFrQixJQUFJLENBQUM7SUFDdEMsSUFBSSxZQUFZLEVBQUU7UUFDaEIsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUc7WUFDMUIsTUFBTSxlQUFlLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxD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QUMxRCxPQUFPO2lCQUNSO2dCQUNELElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxlQUFlLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBTztvQkFDbkQsT0FBTyxNQUFNLENBQUMsZUFBZSxDQUFDLEtBQUssS0FBSyxVQUFVLElBQUksV0FBVyxFQUFFO29CQUNyRSxJQUFJO3dCQUNELElBQUksQ0FBQyxPQUFlLENBQUMsaUJBQWlCLENBQUMsR0FBRyxJQUFJLENBQUM7d0JBQ2hELFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxDQUFDO3FCQUMxQzs0QkFBUzt3QkFDUCxJQUFJLENBQUMsT0FBZSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsS0FBSyxDQUFDO3FCQUNsRDtpQkFDRjtxQkFBTTtvQkFDTCxHQUFHLENBQUMsNENBQTRDLENBQUMsQ0FBQztpQkFDbkQ7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUNQLElBQUksTUFBTSxJQUFJLE1BQU0sQ0FBQyxlQUFlLEVBQUU7Z0JBQ3BDLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzthQUNwQztRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblpvbmUuX19sb2FkX3BhdGNoKCdmZXRjaCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IGZldGNoID0gZ2xvYmFsWydmZXRjaCddO1xuICBjb25zdCBab25lQXdhcmVQcm9taXNlID0gZ2xvYmFsLlByb21pc2U7XG4gIGNvbnN0IHN5bWJvbFRoZW5QYXRjaGVkID0gYXBpLnN5bWJvbCgndGhlblBhdGNoZWQnKTtcbiAgY29uc3QgZmV0Y2hUYXNrU2NoZWR1bGluZyA9IGFwaS5zeW1ib2woJ2ZldGNoVGFza1NjaGVkdWxpbmcnKTtcbiAgY29uc3QgZmV0Y2hUYXNrQWJvcnRpbmcgPSBhcGkuc3ltYm9sKCdmZXRjaFRhc2tBYm9ydGluZycpO1xuICBpZiAodHlwZW9mIGZldGNoICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IE9yaWdpbmFsQWJvcnRDb250cm9sbGVyID0gZ2xvYmFsWydBYm9ydENvbnRyb2xsZXInXTtcbiAgY29uc3Qgc3VwcG9ydEFib3J0ID0gdHlwZW9mIE9yaWdpbmFsQWJvcnRDb250cm9sbGVyID09PSAnZnVuY3Rpb24nO1xuICBsZXQgYWJvcnROYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuICBpZiAoc3VwcG9ydEFib3J0KSB7XG4gICAgZ2xvYmFsWydBYm9ydENvbnRyb2xsZXInXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgYWJvcnRDb250cm9sbGVyID0gbmV3IE9yaWdpbmFsQWJvcnRDb250cm9sbGVyKCk7XG4gICAgICBjb25zdCBzaWduYWwgPSBhYm9ydENvbnRyb2xsZXIuc2lnbmFsO1xuICAgICAgc2lnbmFsLmFib3J0Q29udHJvbGxlciA9IGFib3J0Q29udHJvbGxlcjtcbiAgICAgIHJldHVybiBhYm9ydENvbnRyb2xsZXI7XG4gICAgfTtcbiAgICBhYm9ydE5hdGl2ZSA9IGFwaS5wYXRjaE1ldGhvZChcbiAgICAgICAgT3JpZ2luYWxBYm9ydENvbnRyb2xsZXIucHJvdG90eXBlLCAnYWJvcnQnLFxuICAgICAgICAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAoc2VsZi50YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gc2VsZi50YXNrLnpvbmUuY2FuY2VsVGFzayhzZWxmLnRhc2spO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICB9XG4gIGNvbnN0IHBsYWNlaG9sZGVyID0gZnVuY3Rpb24oKSB7fTtcbiAgZ2xvYmFsWydmZXRjaCddID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3MubGVuZ3RoID4gMSA/IGFyZ3NbMV0gOiBudWxsO1xuICAgIGNvbnN0IHNpZ25hbCA9IG9wdGlvbnMgJiYgb3B0aW9ucy5zaWduYWw7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXMsIHJlaikgPT4ge1xuICAgICAgY29uc3QgdGFzayA9IFpvbmUuY3VycmVudC5zY2hlZHVsZU1hY3JvVGFzayhcbiAgICAgICAgICAnZmV0Y2gnLCBwbGFjZWhvbGRlciwgYXJncyxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgZmV0Y2hQcm9taXNlO1xuICAgICAgICAgICAgbGV0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAoem9uZSBhcyBhbnkpW2ZldGNoVGFza1NjaGVkdWxpbmddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgZmV0Y2hQcm9taXNlID0gZmV0Y2guYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICByZWooZXJyb3IpO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAoem9uZSBhcyBhbnkpW2ZldGNoVGFza1NjaGVkdWxpbmddID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICghKGZldGNoUHJvbWlzZSBpbnN0YW5jZW9mIFpvbmVBd2FyZVByb21pc2UpKSB7XG4gICAgICAgICAgICAgIGxldCBjdG9yID0gZmV0Y2hQcm9taXNlLmNvbnN0cnVjdG9yO1xuICAgICAgICAgICAgICBpZiAoIWN0b3Jbc3ltYm9sVGhlblBhdGNoZWRdKSB7XG4gICAgICAgICAgICAgICAgYXBpLnBhdGNoVGhlbihjdG9yKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZmV0Y2hQcm9taXNlLnRoZW4oXG4gICAgICAgICAgICAgICAgKHJlc291cmNlOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSAnbm90U2NoZWR1bGVkJykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmVzKHJlc291cmNlKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gJ25vdFNjaGVkdWxlZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGFzay5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIHJlaihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBpZiAoIXN1cHBvcnRBYm9ydCkge1xuICAgICAgICAgICAgICByZWooJ05vIEFib3J0Q29udHJvbGxlciBzdXBwb3J0ZWQsIGNhbiBub3QgY2FuY2VsIGZldGNoJyk7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChzaWduYWwgJiYgc2lnbmFsLmFib3J0Q29udHJvbGxlciAmJiAhc2lnbmFsLmFib3J0ZWQgJiZcbiAgICAgICAgICAgICAgICB0eXBlb2Ygc2lnbmFsLmFib3J0Q29udHJvbGxlci5hYm9ydCA9PT0gJ2Z1bmN0aW9uJyAmJiBhYm9ydE5hdGl2ZSkge1xuICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIChab25lLmN1cnJlbnQgYXMgYW55KVtmZXRjaFRhc2tBYm9ydGluZ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgIGFib3J0TmF0aXZlLmNhbGwoc2lnbmFsLmFib3J0Q29udHJvbGxlcik7XG4gICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgKFpvbmUuY3VycmVudCBhcyBhbnkpW2ZldGNoVGFza0Fib3J0aW5nXSA9IGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICByZWooJ2NhbmNlbCBmZXRjaCBuZWVkIGEgQWJvcnRDb250cm9sbGVyLnNpZ25hbCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgaWYgKHNpZ25hbCAmJiBzaWduYWwuYWJvcnRDb250cm9sbGVyKSB7XG4gICAgICAgIHNpZ25hbC5hYm9ydENvbnRyb2xsZXIudGFzayA9IHRhc2s7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59KTsiXX0=