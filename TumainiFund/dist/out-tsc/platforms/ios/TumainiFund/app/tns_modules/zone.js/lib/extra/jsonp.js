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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbnAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9leHRyYS9qc29ucC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDeEUsSUFBTSxJQUFJLEdBQUcsY0FBWSxDQUFDLENBQUM7SUFDM0IsMERBQTBEO0lBQzFELDREQUE0RDtJQUM1RCxzREFBc0Q7SUFDdEQsMENBQTBDO0lBQzFDLHlEQUF5RDtJQUN6RCxnREFBZ0Q7SUFDaEQsdUNBQXVDO0lBQ3ZDLHFDQUFxQztJQUNwQyxJQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLFNBQVMsVUFBVSxDQUFDLE9BQVk7UUFDeEUsSUFBSSxDQUFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFO1lBQ3ZELE9BQU87U0FDUjtRQUNELElBQU0sSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO1FBRTNCLENBQUMsT0FBTyxDQUFDLGVBQWUsRUFBRSxPQUFPLENBQUMsY0FBYyxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQUEsVUFBVTtZQUNsRSxJQUFJLENBQUMsVUFBVSxFQUFFO2dCQUNmLE9BQU87YUFDUjtZQUVELElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUNuQyxJQUFJLE9BQU8sRUFBRTtnQkFDWCxHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsVUFBQyxJQUFTLEVBQUUsSUFBVztvQkFDakYsSUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQztvQkFDNUMsSUFBSSxJQUFJLEVBQUU7d0JBQ1IsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7d0JBQ3pCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUN0Qzt5QkFBTTt3QkFDTCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3FCQUNuQztnQkFDSCxDQUFDLEVBUjJELENBUTNELENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRTtvQkFDeEMsWUFBWSxFQUFFLElBQUk7b0JBQ2xCLFVBQVUsRUFBRSxJQUFJO29CQUNoQixHQUFHLEVBQUU7d0JBQ0gsT0FBTzs0QkFDTCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDOzRCQUM3QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDOzRCQUNwQyxJQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxVQUFRLFVBQVUsYUFBVSxDQUFDLENBQUMsQ0FBQzs0QkFFbEUsSUFBSSxJQUFJLEVBQUU7Z0NBQ1IsSUFBSSxRQUFRLEVBQUU7b0NBQ1osSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7aUNBQzFCO2dDQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO2dDQUM1QyxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzs2QkFDM0M7aUNBQU07Z0NBQ0wsSUFBSSxRQUFRLEVBQUU7b0NBQ1osT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztpQ0FDeEM7NkJBQ0Y7NEJBQ0QsT0FBTyxJQUFJLENBQUM7d0JBQ2QsQ0FBQyxDQUFDO29CQUNKLENBQUM7b0JBQ0QsR0FBRyxFQUFFLFVBQVMsUUFBa0I7d0JBQzlCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVEsVUFBVSxhQUFVLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztvQkFDNUQsQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsR0FBRyxDQUFDLFdBQVcsQ0FDWCxPQUFPLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxZQUFZLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsVUFBQyxJQUFTLEVBQUUsSUFBVztZQUNsRixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztnQkFDM0IsSUFBSSxDQUFDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxVQUFDLElBQVU7b0JBQzNELE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQ3BDLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNmLENBQUMsRUFMNEQsQ0FLNUQsQ0FBQyxDQUFDO0lBQ1QsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5ab25lLl9fbG9hZF9wYXRjaCgnanNvbnAnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBjb25zdCBub29wID0gZnVuY3Rpb24oKSB7fTtcbiAgLy8gYmVjYXVzZSBqc29ucCBpcyBub3QgYSBzdGFuZGFyZCBhcGksIHRoZXJlIGFyZSBhIGxvdCBvZlxuICAvLyBpbXBsZW1lbnRhdGlvbnMsIHNvIHpvbmUuanMganVzdCBwcm92aWRlIGEgaGVscGVyIHV0aWwgdG9cbiAgLy8gcGF0Y2ggdGhlIGpzb25wIHNlbmQgYW5kIG9uU3VjY2Vzcy9vbkVycm9yIGNhbGxiYWNrXG4gIC8vIHRoZSBvcHRpb25zIGlzIGFuIG9iamVjdCB3aGljaCBjb250YWluc1xuICAvLyAtIGpzb25wLCB0aGUganNvbnAgb2JqZWN0IHdoaWNoIGhvbGQgdGhlIHNlbmQgZnVuY3Rpb25cbiAgLy8gLSBzZW5kRnVuY05hbWUsIHRoZSBuYW1lIG9mIHRoZSBzZW5kIGZ1bmN0aW9uXG4gIC8vIC0gc3VjY2Vzc0Z1bmNOYW1lLCBzdWNjZXNzIGZ1bmMgbmFtZVxuICAvLyAtIGZhaWxlZEZ1bmNOYW1lLCBmYWlsZWQgZnVuYyBuYW1lXG4gIChab25lIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdqc29ucCcpXSA9IGZ1bmN0aW9uIHBhdGNoSnNvbnAob3B0aW9uczogYW55KSB7XG4gICAgaWYgKCFvcHRpb25zIHx8ICFvcHRpb25zLmpzb25wIHx8ICFvcHRpb25zLnNlbmRGdW5jTmFtZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBub29wID0gZnVuY3Rpb24oKSB7fTtcblxuICAgIFtvcHRpb25zLnN1Y2Nlc3NGdW5jTmFtZSwgb3B0aW9ucy5mYWlsZWRGdW5jTmFtZV0uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgIGlmICghbWV0aG9kTmFtZSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IG9yaUZ1bmMgPSBnbG9iYWxbbWV0aG9kTmFtZV07XG4gICAgICBpZiAob3JpRnVuYykge1xuICAgICAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLCBtZXRob2ROYW1lLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICAgIGNvbnN0IHRhc2sgPSBnbG9iYWxbYXBpLnN5bWJvbCgnanNvblRhc2snKV07XG4gICAgICAgICAgaWYgKHRhc2spIHtcbiAgICAgICAgICAgIHRhc2suY2FsbGJhY2sgPSBkZWxlZ2F0ZTtcbiAgICAgICAgICAgIHJldHVybiB0YXNrLmludm9rZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZ2xvYmFsLCBtZXRob2ROYW1lLCB7XG4gICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9IGdsb2JhbFthcGkuc3ltYm9sKCdqc29ucFRhc2snKV07XG4gICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgPyB0aGlzIDogZ2xvYmFsO1xuICAgICAgICAgICAgICBjb25zdCBkZWxlZ2F0ZSA9IGdsb2JhbFthcGkuc3ltYm9sKGBqc29ucCR7bWV0aG9kTmFtZX1jYWxsYmFja2ApXTtcblxuICAgICAgICAgICAgICBpZiAodGFzaykge1xuICAgICAgICAgICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgdGFzay5jYWxsYmFjayA9IGRlbGVnYXRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBnbG9iYWxbYXBpLnN5bWJvbCgnanNvbnBUYXNrJyldID0gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIHJldHVybiB0YXNrLmludm9rZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmIChkZWxlZ2F0ZSkge1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24oY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICB0aGlzW2FwaS5zeW1ib2woYGpzb25wJHttZXRob2ROYW1lfWNhbGxiYWNrYCldID0gY2FsbGJhY2s7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIGFwaS5wYXRjaE1ldGhvZChcbiAgICAgICAgb3B0aW9ucy5qc29ucCwgb3B0aW9ucy5zZW5kRnVuY05hbWUsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgZ2xvYmFsW2FwaS5zeW1ib2woJ2pzb25wVGFzaycpXSA9XG4gICAgICAgICAgICAgIFpvbmUuY3VycmVudC5zY2hlZHVsZU1hY3JvVGFzaygnanNvbnAnLCBub29wLCB7fSwgKHRhc2s6IFRhc2spID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgICAgIH0sIG5vb3ApO1xuICAgICAgICB9KTtcbiAgfTtcbn0pO1xuIl19