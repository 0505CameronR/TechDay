/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('jsonp', function (global, Zone, api) {
    var noop = function () { };
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
        var noop = function () { };
        [options.successFuncName, options.failedFuncName].forEach(function (methodName) {
            if (!methodName) {
                return;
            }
            var oriFunc = global[methodName];
            if (oriFunc) {
                api.patchMethod(global, methodName, function (delegate) { return function (self, args) {
                    var task = global[api.symbol('jsonTask')];
                    if (task) {
                        task.callback = delegate;
                        return task.invoke.apply(self, args);
                    }
                    else {
                        return delegate.apply(self, args);
                    }
                }; });
            }
            else {
                Object.defineProperty(global, methodName, {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return function () {
                            var task = global[api.symbol('jsonpTask')];
                            var target = this ? this : global;
                            var delegate = global[api.symbol("jsonp" + methodName + "callback")];
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
                        this[api.symbol("jsonp" + methodName + "callback")] = callback;
                    }
                });
            }
        });
        api.patchMethod(options.jsonp, options.sendFuncName, function (delegate) { return function (self, args) {
            global[api.symbol('jsonpTask')] =
                Zone.current.scheduleMacroTask('jsonp', noop, {}, function (task) {
                    return delegate.apply(self, args);
                }, noop);
        }; });
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2V4dHJhL2pzb25wLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUN4RSxJQUFNLElBQUksR0FBRyxjQUFZLENBQUMsQ0FBQztJQUMzQiwwREFBMEQ7SUFDMUQsNERBQTREO0lBQzVELHNEQUFzRDtJQUN0RCwwQ0FBMEM7SUFDMUMseURBQXlEO0lBQ3pELGdEQUFnRDtJQUNoRCx1Q0FBdUM7SUFDdkMscUNBQXFDO0lBQ3BDLElBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsU0FBUyxVQUFVLENBQUMsT0FBWTtRQUN4RSxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLEVBQUU7WUFDdkQsT0FBTztTQUNSO1FBQ0QsSUFBTSxJQUFJLEdBQUcsY0FBWSxDQUFDLENBQUM7UUFFM0IsQ0FBQyxPQUFPLENBQUMsZUFBZSxFQUFFLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBQSxVQUFVO1lBQ2xFLElBQUksQ0FBQyxVQUFVLEVBQUU7Z0JBQ2YsT0FBTzthQUNSO1lBRUQsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLElBQUksT0FBTyxFQUFFO2dCQUNYLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO29CQUNqRixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO29CQUM1QyxJQUFJLElBQUksRUFBRTt3QkFDUixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQzt3QkFDekIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ3RDO3lCQUFNO3dCQUNMLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7cUJBQ25DO2dCQUNILENBQUMsRUFSMkQsQ0FRM0QsQ0FBQyxDQUFDO2FBQ0o7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFO29CQUN4QyxZQUFZLEVBQUUsSUFBSTtvQkFDbEIsVUFBVSxFQUFFLElBQUk7b0JBQ2hCLEdBQUcsRUFBRTt3QkFDSCxPQUFPOzRCQUNMLElBQU0sSUFBSSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7NEJBQzdDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUM7NEJBQ3BDLElBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVEsVUFBVSxhQUFVLENBQUMsQ0FBQyxDQUFDOzRCQUVsRSxJQUFJLElBQUksRUFBRTtnQ0FDUixJQUFJLFFBQVEsRUFBRTtvQ0FDWixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztpQ0FDMUI7Z0NBQ0QsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7Z0NBQzVDLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDOzZCQUMzQztpQ0FBTTtnQ0FDTCxJQUFJLFFBQVEsRUFBRTtvQ0FDWixPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lDQUN4Qzs2QkFDRjs0QkFDRCxPQUFPLElBQUksQ0FBQzt3QkFDZCxDQUFDLENBQUM7b0JBQ0osQ0FBQztvQkFDRCxHQUFHLEVBQUUsVUFBUyxRQUFrQjt3QkFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBUSxVQUFVLGFBQVUsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO29CQUM1RCxDQUFDO2lCQUNGLENBQUMsQ0FBQzthQUNKO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCxHQUFHLENBQUMsV0FBVyxDQUNYLE9BQU8sQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLFlBQVksRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1lBQ2xGLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO2dCQUMzQixJQUFJLENBQUMsT0FBTyxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLFVBQUMsSUFBVTtvQkFDM0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDcEMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxFQUw0RCxDQUs1RCxDQUFDLENBQUM7SUFDVCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdqc29ucCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAvLyBiZWNhdXNlIGpzb25wIGlzIG5vdCBhIHN0YW5kYXJkIGFwaSwgdGhlcmUgYXJlIGEgbG90IG9mXG4gIC8vIGltcGxlbWVudGF0aW9ucywgc28gem9uZS5qcyBqdXN0IHByb3ZpZGUgYSBoZWxwZXIgdXRpbCB0b1xuICAvLyBwYXRjaCB0aGUganNvbnAgc2VuZCBhbmQgb25TdWNjZXNzL29uRXJyb3IgY2FsbGJhY2tcbiAgLy8gdGhlIG9wdGlvbnMgaXMgYW4gb2JqZWN0IHdoaWNoIGNvbnRhaW5zXG4gIC8vIC0ganNvbnAsIHRoZSBqc29ucCBvYmplY3Qgd2hpY2ggaG9sZCB0aGUgc2VuZCBmdW5jdGlvblxuICAvLyAtIHNlbmRGdW5jTmFtZSwgdGhlIG5hbWUgb2YgdGhlIHNlbmQgZnVuY3Rpb25cbiAgLy8gLSBzdWNjZXNzRnVuY05hbWUsIHN1Y2Nlc3MgZnVuYyBuYW1lXG4gIC8vIC0gZmFpbGVkRnVuY05hbWUsIGZhaWxlZCBmdW5jIG5hbWVcbiAgKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ2pzb25wJyldID0gZnVuY3Rpb24gcGF0Y2hKc29ucChvcHRpb25zOiBhbnkpIHtcbiAgICBpZiAoIW9wdGlvbnMgfHwgIW9wdGlvbnMuanNvbnAgfHwgIW9wdGlvbnMuc2VuZEZ1bmNOYW1lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuXG4gICAgW29wdGlvbnMuc3VjY2Vzc0Z1bmNOYW1lLCBvcHRpb25zLmZhaWxlZEZ1bmNOYW1lXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgaWYgKCFtZXRob2ROYW1lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgb3JpRnVuYyA9IGdsb2JhbFttZXRob2ROYW1lXTtcbiAgICAgIGlmIChvcmlGdW5jKSB7XG4gICAgICAgIGFwaS5wYXRjaE1ldGhvZChnbG9iYWwsIG1ldGhvZE5hbWUsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgY29uc3QgdGFzayA9IGdsb2JhbFthcGkuc3ltYm9sKCdqc29uVGFzaycpXTtcbiAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgdGFzay5jYWxsYmFjayA9IGRlbGVnYXRlO1xuICAgICAgICAgICAgcmV0dXJuIHRhc2suaW52b2tlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwsIG1ldGhvZE5hbWUsIHtcbiAgICAgICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gZ2xvYmFsW2FwaS5zeW1ib2woJ2pzb25wVGFzaycpXTtcbiAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyA/IHRoaXMgOiBnbG9iYWw7XG4gICAgICAgICAgICAgIGNvbnN0IGRlbGVnYXRlID0gZ2xvYmFsW2FwaS5zeW1ib2woYGpzb25wJHttZXRob2ROYW1lfWNhbGxiYWNrYCldO1xuXG4gICAgICAgICAgICAgIGlmICh0YXNrKSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICB0YXNrLmNhbGxiYWNrID0gZGVsZWdhdGU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGdsb2JhbFthcGkuc3ltYm9sKCdqc29ucFRhc2snKV0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbihjYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgIHRoaXNbYXBpLnN5bWJvbChganNvbnAke21ldGhvZE5hbWV9Y2FsbGJhY2tgKV0gPSBjYWxsYmFjaztcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICBvcHRpb25zLmpzb25wLCBvcHRpb25zLnNlbmRGdW5jTmFtZSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICBnbG9iYWxbYXBpLnN5bWJvbCgnanNvbnBUYXNrJyldID1cbiAgICAgICAgICAgICAgWm9uZS5jdXJyZW50LnNjaGVkdWxlTWFjcm9UYXNrKCdqc29ucCcsIG5vb3AsIHt9LCAodGFzazogVGFzaykgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICAgICAgfSwgbm9vcCk7XG4gICAgICAgIH0pO1xuICB9O1xufSk7XG4iXX0=