/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('jsonp', (global, Zone, api) => {
    const noop = function () { };
    // because jsonp is not a standard api, there are a lot of
    // implementations, so zone.js just provide a helper util to
    // patch the jsonp send and onSuccess/onError callback
    // the options is an object which contains
    // - jsonp, the jsonp object which hold the send function
    // - sendFuncName, the name of the send function
    // - successFuncName, success func name
    // - failedFuncName, failed func name
    Zone[Zone.__symbol__('jsonp')] = function patchJsonp(options) {
        if (!options || !options.jsonp || !options.sendFuncName) {
            return;
        }
        const noop = function () { };
        [options.successFuncName, options.failedFuncName].forEach(methodName => {
            if (!methodName) {
                return;
            }
            const oriFunc = global[methodName];
            if (oriFunc) {
                api.patchMethod(global, methodName, (delegate) => (self, args) => {
                    const task = global[api.symbol('jsonTask')];
                    if (task) {
                        task.callback = delegate;
                        return task.invoke.apply(self, args);
                    }
                    else {
                        return delegate.apply(self, args);
                    }
                });
            }
            else {
                Object.defineProperty(global, methodName, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return function () {
                            const task = global[api.symbol('jsonpTask')];
                            const target = this ? this : global;
                            const delegate = global[api.symbol(`jsonp${methodName}callback`)];
                            if (task) {
                                if (delegate) {
                                    task.callback = delegate;
                                }
                                global[api.symbol('jsonpTask')] = undefined;
                                return task.invoke.apply(this, arguments);
                            }
                            else {
                                if (delegate) {
                                    return delegate.apply(this, arguments);
                                }
                            }
                            return null;
                        };
                    },
                    set: function (callback) {
                        this[api.symbol(`jsonp${methodName}callback`)] = callback;
                    }
                });
            }
        });
        api.patchMethod(options.jsonp, options.sendFuncName, (delegate) => (self, args) => {
            global[api.symbol('jsonpTask')] =
                Zone.current.scheduleMacroTask('jsonp', noop, {}, (task) => {
                    return delegate.apply(self, args);
                }, noop);
        });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9leHRyYS9qc29ucC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxDQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUIsRUFBRSxFQUFFO0lBQzVFLE1BQU0sSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO0lBQzNCLDBEQUEwRDtJQUMxRCw0REFBNEQ7SUFDNUQsc0RBQXNEO0lBQ3RELDBDQUEwQztJQUMxQyx5REFBeUQ7SUFDekQsZ0RBQWdEO0lBQ2hELHVDQUF1QztJQUN2QyxxQ0FBcUM7SUFDcEMsSUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxTQUFTLFVBQVUsQ0FBQyxPQUFZO1FBQ3hFLElBQUksQ0FBQyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUN2RCxPQUFPO1NBQ1I7UUFDRCxNQUFNLElBQUksR0FBRyxjQUFZLENBQUMsQ0FBQztRQUUzQixDQUFDLE9BQU8sQ0FBQyxlQUFlLEVBQUUsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNyRSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE9BQU87YUFDUjtZQUVELE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuQyxJQUFJLE9BQU8sRUFBRTtnQkFDWCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQVMsRUFBRSxJQUFXLEVBQUUsRUFBRTtvQkFDckYsTUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7d0JBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN0Qzt5QkFBTTt3QkFDTCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNuQztnQkFDSCxDQUFDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtvQkFDeEMsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixHQUFHLEVBQUU7d0JBQ0gsT0FBTzs0QkFDTCxNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUM3QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOzRCQUNwQyxNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLFVBQVUsVUFBVSxDQUFDLENBQUMsQ0FBQzs0QkFFbEUsSUFBSSxJQUFJLEVBQUU7Z0NBQ1IsSUFBSSxRQUFRLEVBQUU7b0NBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7aUNBQzFCO2dDQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dDQUM1QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzs2QkFDM0M7aUNBQU07Z0NBQ0wsSUFBSSxRQUFRLEVBQUU7b0NBQ1osT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztpQ0FDeEM7NkJBQ0Y7NEJBQ0QsT0FBTyxJQUFJLENBQUM7d0JBQ2QsQ0FBQyxDQUFDO29CQUNKLENBQUM7b0JBQ0QsR0FBRyxFQUFFLFVBQVMsUUFBa0I7d0JBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsVUFBVSxVQUFVLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztvQkFDNUQsQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLFdBQVcsQ0FDWCxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsQ0FBQyxRQUFrQixFQUFFLEVBQUUsQ0FBQyxDQUFDLElBQVMsRUFBRSxJQUFXLEVBQUUsRUFBRTtZQUN0RixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFDLElBQVUsRUFBRSxFQUFFO29CQUMvRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUNwQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFDZixDQUFDLENBQUMsQ0FBQztJQUNULENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2pzb25wJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gIC8vIGJlY2F1c2UganNvbnAgaXMgbm90IGEgc3RhbmRhcmQgYXBpLCB0aGVyZSBhcmUgYSBsb3Qgb2ZcbiAgLy8gaW1wbGVtZW50YXRpb25zLCBzbyB6b25lLmpzIGp1c3QgcHJvdmlkZSBhIGhlbHBlciB1dGlsIHRvXG4gIC8vIHBhdGNoIHRoZSBqc29ucCBzZW5kIGFuZCBvblN1Y2Nlc3Mvb25FcnJvciBjYWxsYmFja1xuICAvLyB0aGUgb3B0aW9ucyBpcyBhbiBvYmplY3Qgd2hpY2ggY29udGFpbnNcbiAgLy8gLSBqc29ucCwgdGhlIGpzb25wIG9iamVjdCB3aGljaCBob2xkIHRoZSBzZW5kIGZ1bmN0aW9uXG4gIC8vIC0gc2VuZEZ1bmNOYW1lLCB0aGUgbmFtZSBvZiB0aGUgc2VuZCBmdW5jdGlvblxuICAvLyAtIHN1Y2Nlc3NGdW5jTmFtZSwgc3VjY2VzcyBmdW5jIG5hbWVcbiAgLy8gLSBmYWlsZWRGdW5jTmFtZSwgZmFpbGVkIGZ1bmMgbmFtZVxuICAoWm9uZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnanNvbnAnKV0gPSBmdW5jdGlvbiBwYXRjaEpzb25wKG9wdGlvbnM6IGFueSkge1xuICAgIGlmICghb3B0aW9ucyB8fCAhb3B0aW9ucy5qc29ucCB8fCAhb3B0aW9ucy5zZW5kRnVuY05hbWUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgbm9vcCA9IGZ1bmN0aW9uKCkge307XG5cbiAgICBbb3B0aW9ucy5zdWNjZXNzRnVuY05hbWUsIG9wdGlvbnMuZmFpbGVkRnVuY05hbWVdLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICBpZiAoIW1ldGhvZE5hbWUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBvcmlGdW5jID0gZ2xvYmFsW21ldGhvZE5hbWVdO1xuICAgICAgaWYgKG9yaUZ1bmMpIHtcbiAgICAgICAgYXBpLnBhdGNoTWV0aG9kKGdsb2JhbCwgbWV0aG9kTmFtZSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICBjb25zdCB0YXNrID0gZ2xvYmFsW2FwaS5zeW1ib2woJ2pzb25UYXNrJyldO1xuICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICB0YXNrLmNhbGxiYWNrID0gZGVsZWdhdGU7XG4gICAgICAgICAgICByZXR1cm4gdGFzay5pbnZva2UuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGdsb2JhbCwgbWV0aG9kTmFtZSwge1xuICAgICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSBnbG9iYWxbYXBpLnN5bWJvbCgnanNvbnBUYXNrJyldO1xuICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzID8gdGhpcyA6IGdsb2JhbDtcbiAgICAgICAgICAgICAgY29uc3QgZGVsZWdhdGUgPSBnbG9iYWxbYXBpLnN5bWJvbChganNvbnAke21ldGhvZE5hbWV9Y2FsbGJhY2tgKV07XG5cbiAgICAgICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICAgIHRhc2suY2FsbGJhY2sgPSBkZWxlZ2F0ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZ2xvYmFsW2FwaS5zeW1ib2woJ2pzb25wVGFzaycpXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgfSxcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGNhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgICAgICAgICAgdGhpc1thcGkuc3ltYm9sKGBqc29ucCR7bWV0aG9kTmFtZX1jYWxsYmFja2ApXSA9IGNhbGxiYWNrO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBhcGkucGF0Y2hNZXRob2QoXG4gICAgICAgIG9wdGlvbnMuanNvbnAsIG9wdGlvbnMuc2VuZEZ1bmNOYW1lLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgIGdsb2JhbFthcGkuc3ltYm9sKCdqc29ucFRhc2snKV0gPVxuICAgICAgICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNYWNyb1Rhc2soJ2pzb25wJywgbm9vcCwge30sICh0YXNrOiBUYXNrKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgICAgICB9LCBub29wKTtcbiAgICAgICAgfSk7XG4gIH07XG59KTtcbiJdfQ==