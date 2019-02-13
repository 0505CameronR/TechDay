/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('fetch', function (global, Zone, api) {
    var fetch = global['fetch'];
    var ZoneAwarePromise = global.Promise;
    var symbolThenPatched = api.symbol('thenPatched');
    var fetchTaskScheduling = api.symbol('fetchTaskScheduling');
    var fetchTaskAborting = api.symbol('fetchTaskAborting');
    if (typeof fetch !== 'function') {
        return;
    }
    var OriginalAbortController = global['AbortController'];
    var supportAbort = typeof OriginalAbortController === 'function';
    var abortNative = null;
    if (supportAbort) {
        global['AbortController'] = function () {
            var abortController = new OriginalAbortController();
            var signal = abortController.signal;
            signal.abortController = abortController;
            return abortController;
        };
        abortNative = api.patchMethod(OriginalAbortController.prototype, 'abort', function (delegate) { return function (self, args) {
            if (self.task) {
                return self.task.zone.cancelTask(self.task);
            }
            return delegate.apply(self, args);
        }; });
    }
    var placeholder = function () { };
    global['fetch'] = function () {
        var _this = this;
        var args = Array.prototype.slice.call(arguments);
        var options = args.length > 1 ? args[1] : null;
        var signal = options && options.signal;
        return new Promise(function (res, rej) {
            var task = Zone.current.scheduleMacroTask('fetch', placeholder, args, function () {
                var fetchPromise;
                var zone = Zone.current;
                try {
                    zone[fetchTaskScheduling] = true;
                    fetchPromise = fetch.apply(_this, args);
                }
                catch (error) {
                    rej(error);
                    return;
                }
                finally {
                    zone[fetchTaskScheduling] = false;
                }
                if (!(fetchPromise instanceof ZoneAwarePromise)) {
                    var ctor = fetchPromise.constructor;
                    if (!ctor[symbolThenPatched]) {
                        api.patchThen(ctor);
                    }
                }
                fetchPromise.then(function (resource) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    res(resource);
                }, function (error) {
                    if (task.state !== 'notScheduled') {
                        task.invoke();
                    }
                    rej(error);
                });
            }, function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmV0Y2guanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2NvbW1vbi9mZXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDeEUsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlCLElBQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUN4QyxJQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDcEQsSUFBTSxtQkFBbUIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUM7SUFDOUQsSUFBTSxpQkFBaUIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLENBQUM7SUFDMUQsSUFBSSxPQUFPLEtBQUssS0FBSyxVQUFVLEVBQUU7UUFDL0IsT0FBTztLQUNSO0lBQ0QsSUFBTSx1QkFBdUIsR0FBRyxNQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUMxRCxJQUFNLFlBQVksR0FBRyxPQUFPLHVCQUF1QixLQUFLLFVBQVUsQ0FBQztJQUNuRSxJQUFJLFdBQVcsR0FBa0IsSUFBSSxDQUFDO0lBQ3RDLElBQUksWUFBWSxFQUFFO1FBQ2hCLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHO1lBQzFCLElBQU0sZUFBZSxHQUFHLElBQUksdUJBQXVCLEVBQUUsQ0FBQztZQUN0RCxJQUFNLE1B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QUFDLE1BQU0sQ0FBQyxPQUFPO29CQUNuRCxPQUFPLE1BQU0sQ0FBQyxlQUFlLENBQUMsS0FBSyxLQUFLLFVBQVUsSUFBSSxXQUFXLEVBQUU7b0JBQ3JFLElBQUk7d0JBQ0QsSUFBSSxDQUFDLE9BQWUsQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLElBQUksQ0FBQzt3QkFDaEQsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsZUFBZSxDQUFDLENBQUM7cUJBQzFDOzRCQUFTO3dCQUNQLElBQUksQ0FBQyxPQUFlLENBQUMsaUJBQWlCLENBQUMsR0FBRyxLQUFLLENBQUM7cUJBQ2xEO2lCQUNGO3FCQUFNO29CQUNMLEdBQUcsQ0FBQyw0Q0FBNEMsQ0FBQyxDQUFDO2lCQUNuRDtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ1AsSUFBSSxNQUFNLElBQUksTUFBTSxDQUFDLGVBQWUsRUFBRTtnQkFDcEMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO2FBQ3BDO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuWm9uZS5fX2xvYWRfcGF0Y2goJ2ZldGNoJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3QgZmV0Y2ggPSBnbG9iYWxbJ2ZldGNoJ107XG4gIGNvbnN0IFpvbmVBd2FyZVByb21pc2UgPSBnbG9iYWwuUHJvbWlzZTtcbiAgY29uc3Qgc3ltYm9sVGhlblBhdGNoZWQgPSBhcGkuc3ltYm9sKCd0aGVuUGF0Y2hlZCcpO1xuICBjb25zdCBmZXRjaFRhc2tTY2hlZHVsaW5nID0gYXBpLnN5bWJvbCgnZmV0Y2hUYXNrU2NoZWR1bGluZycpO1xuICBjb25zdCBmZXRjaFRhc2tBYm9ydGluZyA9IGFwaS5zeW1ib2woJ2ZldGNoVGFza0Fib3J0aW5nJyk7XG4gIGlmICh0eXBlb2YgZmV0Y2ggIT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgT3JpZ2luYWxBYm9ydENvbnRyb2xsZXIgPSBnbG9iYWxbJ0Fib3J0Q29udHJvbGxlciddO1xuICBjb25zdCBzdXBwb3J0QWJvcnQgPSB0eXBlb2YgT3JpZ2luYWxBYm9ydENvbnRyb2xsZXIgPT09ICdmdW5jdGlvbic7XG4gIGxldCBhYm9ydE5hdGl2ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG4gIGlmIChzdXBwb3J0QWJvcnQpIHtcbiAgICBnbG9iYWxbJ0Fib3J0Q29udHJvbGxlciddID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCBhYm9ydENvbnRyb2xsZXIgPSBuZXcgT3JpZ2luYWxBYm9ydENvbnRyb2xsZXIoKTtcbiAgICAgIGNvbnN0IHNpZ25hbCA9IGFib3J0Q29udHJvbGxlci5zaWduYWw7XG4gICAgICBzaWduYWwuYWJvcnRDb250cm9sbGVyID0gYWJvcnRDb250cm9sbGVyO1xuICAgICAgcmV0dXJuIGFib3J0Q29udHJvbGxlcjtcbiAgICB9O1xuICAgIGFib3J0TmF0aXZlID0gYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICBPcmlnaW5hbEFib3J0Q29udHJvbGxlci5wcm90b3R5cGUsICdhYm9ydCcsXG4gICAgICAgIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueSkgPT4ge1xuICAgICAgICAgIGlmIChzZWxmLnRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiBzZWxmLnRhc2suem9uZS5jYW5jZWxUYXNrKHNlbGYudGFzayk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gIH1cbiAgY29uc3QgcGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHt9O1xuICBnbG9iYWxbJ2ZldGNoJ10gPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICBjb25zdCBvcHRpb25zID0gYXJncy5sZW5ndGggPiAxID8gYXJnc1sxXSA6IG51bGw7XG4gICAgY29uc3Qgc2lnbmFsID0gb3B0aW9ucyAmJiBvcHRpb25zLnNpZ25hbDtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlcywgcmVqKSA9PiB7XG4gICAgICBjb25zdCB0YXNrID0gWm9uZS5jdXJyZW50LnNjaGVkdWxlTWFjcm9UYXNrKFxuICAgICAgICAgICdmZXRjaCcsIHBsYWNlaG9sZGVyLCBhcmdzLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGxldCBmZXRjaFByb21pc2U7XG4gICAgICAgICAgICBsZXQgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICh6b25lIGFzIGFueSlbZmV0Y2hUYXNrU2NoZWR1bGluZ10gPSB0cnVlO1xuICAgICAgICAgICAgICBmZXRjaFByb21pc2UgPSBmZXRjaC5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgIHJlaihlcnJvcik7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICh6b25lIGFzIGFueSlbZmV0Y2hUYXNrU2NoZWR1bGluZ10gPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCEoZmV0Y2hQcm9taXNlIGluc3RhbmNlb2YgWm9uZUF3YXJlUHJvbWlzZSkpIHtcbiAgICAgICAgICAgICAgbGV0IGN0b3IgPSBmZXRjaFByb21pc2UuY29uc3RydWN0b3I7XG4gICAgICAgICAgICAgIGlmICghY3RvcltzeW1ib2xUaGVuUGF0Y2hlZF0pIHtcbiAgICAgICAgICAgICAgICBhcGkucGF0Y2hUaGVuKGN0b3IpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmZXRjaFByb21pc2UudGhlbihcbiAgICAgICAgICAgICAgICAocmVzb3VyY2U6IGFueSkgPT4ge1xuICAgICAgICAgICAgICAgICAgaWYgKHRhc2suc3RhdGUgIT09ICdub3RTY2hlZHVsZWQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRhc2suaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICByZXMocmVzb3VyY2UpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgIGlmICh0YXNrLnN0YXRlICE9PSAnbm90U2NoZWR1bGVkJykge1xuICAgICAgICAgICAgICAgICAgICB0YXNrLmludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgcmVqKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGlmICghc3VwcG9ydEFib3J0KSB7XG4gICAgICAgICAgICAgIHJlaignTm8gQWJvcnRDb250cm9sbGVyIHN1cHBvcnRlZCwgY2FuIG5vdCBjYW5jZWwgZmV0Y2gnKTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNpZ25hbCAmJiBzaWduYWwuYWJvcnRDb250cm9sbGVyICYmICFzaWduYWwuYWJvcnRlZCAmJlxuICAgICAgICAgICAgICAgIHR5cGVvZiBzaWduYWwuYWJvcnRDb250cm9sbGVyLmFib3J0ID09PSAnZnVuY3Rpb24nICYmIGFib3J0TmF0aXZlKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgKFpvbmUuY3VycmVudCBhcyBhbnkpW2ZldGNoVGFza0Fib3J0aW5nXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgYWJvcnROYXRpdmUuY2FsbChzaWduYWwuYWJvcnRDb250cm9sbGVyKTtcbiAgICAgICAgICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgICAgICAgICAoWm9uZS5jdXJyZW50IGFzIGFueSlbZmV0Y2hUYXNrQWJvcnRpbmddID0gZmFsc2U7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHJlaignY2FuY2VsIGZldGNoIG5lZWQgYSBBYm9ydENvbnRyb2xsZXIuc2lnbmFsJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICBpZiAoc2lnbmFsICYmIHNpZ25hbC5hYm9ydENvbnRyb2xsZXIpIHtcbiAgICAgICAgc2lnbmFsLmFib3J0Q29udHJvbGxlci50YXNrID0gdGFzaztcbiAgICAgIH1cbiAgICB9KTtcbiAgfTtcbn0pOyJdfQ==