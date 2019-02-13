/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('mediaQuery', function (global, Zone, api) {
    function patchAddListener(proto) {
        api.patchMethod(proto, 'addListener', function (delegate) { return function (self, args) {
            var callback = args.length > 0 ? args[0] : null;
            if (typeof callback === 'function') {
                var wrapperedCallback = Zone.current.wrap(callback, 'MediaQuery');
                callback[api.symbol('mediaQueryCallback')] = wrapperedCallback;
                return delegate.call(self, wrapperedCallback);
            }
            else {
                return delegate.apply(self, args);
            }
        }; });
    }
    function patchRemoveListener(proto) {
        api.patchMethod(proto, 'removeListener', function (delegate) { return function (self, args) {
            var callback = args.length > 0 ? args[0] : null;
            if (typeof callback === 'function') {
                var wrapperedCallback = callback[api.symbol('mediaQueryCallback')];
                if (wrapperedCallback) {
                    return delegate.call(self, wrapperedCallback);
                }
                else {
                    return delegate.apply(self, args);
                }
            }
            else {
                return delegate.apply(self, args);
            }
        }; });
    }
    if (global['MediaQueryList']) {
        var proto = global['MediaQueryList'].prototype;
        patchAddListener(proto);
        patchRemoveListener(proto);
    }
    else if (global['matchMedia']) {
        api.patchMethod(global, 'matchMedia', function (delegate) { return function (self, args) {
            var mql = delegate.apply(self, args);
            if (mql) {
                // try to patch MediaQueryList.prototype
                var proto = Object.getPrototypeOf(mql);
                if (proto && proto['addListener']) {
                    // try to patch proto, don't need to worry about patch
                    // multiple times, because, api.patchEventTarget will check it
                    patchAddListener(proto);
                    patchRemoveListener(proto);
                    patchAddListener(mql);
                    patchRemoveListener(mql);
                }
                else if (mql['addListener']) {
                    // proto not exists, or proto has no addListener method
                    // try to patch mql instance
                    patchAddListener(mql);
                    patchRemoveListener(mql);
                }
            }
            return mql;
        }; });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpcy1tZWRpYS1xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci93ZWJhcGlzLW1lZGlhLXF1ZXJ5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUM3RSxTQUFTLGdCQUFnQixDQUFDLEtBQVU7UUFDbEMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxFQUFFLFVBQUMsUUFBa0IsSUFBSyxPQUFBLFVBQUMsSUFBUyxFQUFFLElBQVc7WUFDbkYsSUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ2xELElBQUksT0FBTyxRQUFRLEtBQUssVUFBVSxFQUFFO2dCQUNsQyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxZQUFZLENBQUMsQ0FBQztnQkFDcEUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxHQUFHLGlCQUFpQixDQUFDO2dCQUMvRCxPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7YUFDL0M7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNuQztRQUNILENBQUMsRUFUNkQsQ0FTN0QsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELFNBQVMsbUJBQW1CLENBQUMsS0FBVTtRQUNyQyxHQUFHLENBQUMsV0FBVyxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1lBQ3RGLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNsRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDbEMsSUFBTSxpQkFBaUIsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLElBQUksaUJBQWlCLEVBQUU7b0JBQ3JCLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztpQkFDL0M7cUJBQU07b0JBQ0wsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDbkM7YUFDRjtpQkFBTTtnQkFDTCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxFQVpnRSxDQVloRSxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsSUFBSSxNQUFNLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUM1QixJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxTQUFTLENBQUM7UUFDakQsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEIsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUI7U0FBTSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRTtRQUMvQixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxZQUFZLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsVUFBQyxJQUFTLEVBQUUsSUFBVztZQUNuRixJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUN2QyxJQUFJLEdBQUcsRUFBRTtnQkFDUCx3Q0FBd0M7Z0JBQ3hDLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7Z0JBQ3pDLElBQUksS0FBSyxJQUFJLEtBQUssQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDakMsc0RBQXNEO29CQUN0RCw4REFBOEQ7b0JBQzlELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO29CQUN4QixtQkFBbUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDM0IsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQ3RCLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2lCQUMxQjtxQkFBTSxJQUFJLEdBQUcsQ0FBQyxhQUFhLENBQUMsRUFBRTtvQkFDN0IsdURBQXVEO29CQUN2RCw0QkFBNEI7b0JBQzVCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDMUI7YUFDRjtZQUNELE9BQU8sR0FBRyxDQUFDO1FBQ2IsQ0FBQyxFQXBCNkQsQ0FvQjdELENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5ab25lLl9fbG9hZF9wYXRjaCgnbWVkaWFRdWVyeScsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGZ1bmN0aW9uIHBhdGNoQWRkTGlzdGVuZXIocHJvdG86IGFueSkge1xuICAgIGFwaS5wYXRjaE1ldGhvZChwcm90bywgJ2FkZExpc3RlbmVyJywgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gYXJncy5sZW5ndGggPiAwID8gYXJnc1swXSA6IG51bGw7XG4gICAgICBpZiAodHlwZW9mIGNhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIGNvbnN0IHdyYXBwZXJlZENhbGxiYWNrID0gWm9uZS5jdXJyZW50LndyYXAoY2FsbGJhY2ssICdNZWRpYVF1ZXJ5Jyk7XG4gICAgICAgIGNhbGxiYWNrW2FwaS5zeW1ib2woJ21lZGlhUXVlcnlDYWxsYmFjaycpXSA9IHdyYXBwZXJlZENhbGxiYWNrO1xuICAgICAgICByZXR1cm4gZGVsZWdhdGUuY2FsbChzZWxmLCB3cmFwcGVyZWRDYWxsYmFjayk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBwYXRjaFJlbW92ZUxpc3RlbmVyKHByb3RvOiBhbnkpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QocHJvdG8sICdyZW1vdmVMaXN0ZW5lcicsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiBudWxsO1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCB3cmFwcGVyZWRDYWxsYmFjayA9IGNhbGxiYWNrW2FwaS5zeW1ib2woJ21lZGlhUXVlcnlDYWxsYmFjaycpXTtcbiAgICAgICAgaWYgKHdyYXBwZXJlZENhbGxiYWNrKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNhbGwoc2VsZiwgd3JhcHBlcmVkQ2FsbGJhY2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKGdsb2JhbFsnTWVkaWFRdWVyeUxpc3QnXSkge1xuICAgIGNvbnN0IHByb3RvID0gZ2xvYmFsWydNZWRpYVF1ZXJ5TGlzdCddLnByb3RvdHlwZTtcbiAgICBwYXRjaEFkZExpc3RlbmVyKHByb3RvKTtcbiAgICBwYXRjaFJlbW92ZUxpc3RlbmVyKHByb3RvKTtcbiAgfSBlbHNlIGlmIChnbG9iYWxbJ21hdGNoTWVkaWEnXSkge1xuICAgIGFwaS5wYXRjaE1ldGhvZChnbG9iYWwsICdtYXRjaE1lZGlhJywgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgIGNvbnN0IG1xbCA9IGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgaWYgKG1xbCkge1xuICAgICAgICAvLyB0cnkgdG8gcGF0Y2ggTWVkaWFRdWVyeUxpc3QucHJvdG90eXBlXG4gICAgICAgIGNvbnN0IHByb3RvID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG1xbCk7XG4gICAgICAgIGlmIChwcm90byAmJiBwcm90b1snYWRkTGlzdGVuZXInXSkge1xuICAgICAgICAgIC8vIHRyeSB0byBwYXRjaCBwcm90bywgZG9uJ3QgbmVlZCB0byB3b3JyeSBhYm91dCBwYXRjaFxuICAgICAgICAgIC8vIG11bHRpcGxlIHRpbWVzLCBiZWNhdXNlLCBhcGkucGF0Y2hFdmVudFRhcmdldCB3aWxsIGNoZWNrIGl0XG4gICAgICAgICAgcGF0Y2hBZGRMaXN0ZW5lcihwcm90byk7XG4gICAgICAgICAgcGF0Y2hSZW1vdmVMaXN0ZW5lcihwcm90byk7XG4gICAgICAgICAgcGF0Y2hBZGRMaXN0ZW5lcihtcWwpO1xuICAgICAgICAgIHBhdGNoUmVtb3ZlTGlzdGVuZXIobXFsKTtcbiAgICAgICAgfSBlbHNlIGlmIChtcWxbJ2FkZExpc3RlbmVyJ10pIHtcbiAgICAgICAgICAvLyBwcm90byBub3QgZXhpc3RzLCBvciBwcm90byBoYXMgbm8gYWRkTGlzdGVuZXIgbWV0aG9kXG4gICAgICAgICAgLy8gdHJ5IHRvIHBhdGNoIG1xbCBpbnN0YW5jZVxuICAgICAgICAgIHBhdGNoQWRkTGlzdGVuZXIobXFsKTtcbiAgICAgICAgICBwYXRjaFJlbW92ZUxpc3RlbmVyKG1xbCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBtcWw7XG4gICAgfSk7XG4gIH1cbn0pO1xuIl19