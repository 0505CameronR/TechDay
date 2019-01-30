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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpcy1tZWRpYS1xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvd2ViYXBpcy1tZWRpYS1xdWVyeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDN0UsU0FBUyxnQkFBZ0IsQ0FBQyxLQUFVO1FBQ2xDLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLGFBQWEsRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1lBQ25GLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNsRCxJQUFJLE9BQU8sUUFBUSxLQUFLLFVBQVUsRUFBRTtnQkFDbEMsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLENBQUM7Z0JBQ3BFLFFBQVEsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLG9CQUFvQixDQUFDLENBQUMsR0FBRyxpQkFBaUIsQ0FBQztnQkFDL0QsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO2FBQy9DO2lCQUFNO2dCQUNMLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDbkM7UUFDSCxDQUFDLEVBVDZELENBUzdELENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxTQUFTLG1CQUFtQixDQUFDLEtBQVU7UUFDckMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsVUFBQyxRQUFrQixJQUFLLE9BQUEsVUFBQyxJQUFTLEVBQUUsSUFBVztZQUN0RixJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbEQsSUFBSSxPQUFPLFFBQVEsS0FBSyxVQUFVLEVBQUU7Z0JBQ2xDLElBQU0saUJBQWlCLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUNyRSxJQUFJLGlCQUFpQixFQUFFO29CQUNyQixPQUFPLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLGlCQUFpQixDQUFDLENBQUM7aUJBQy9DO3FCQUFNO29CQUNMLE9BQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ25DO2FBQ0Y7aUJBQU07Z0JBQ0wsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNuQztRQUNILENBQUMsRUFaZ0UsQ0FZaEUsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELElBQUksTUFBTSxDQUFDLGdCQUFnQixDQUFDLEVBQUU7UUFDNUIsSUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsU0FBUyxDQUFDO1FBQ2pELGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLG1CQUFtQixDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzVCO1NBQU0sSUFBSSxNQUFNLENBQUMsWUFBWSxDQUFDLEVBQUU7UUFDL0IsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLFVBQUMsUUFBa0IsSUFBSyxPQUFBLFVBQUMsSUFBUyxFQUFFLElBQVc7WUFDbkYsSUFBTSxHQUFHLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDdkMsSUFBSSxHQUFHLEVBQUU7Z0JBQ1Asd0NBQXdDO2dCQUN4QyxJQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQ2pDLHNEQUFzRDtvQkFDdEQsOERBQThEO29CQUM5RCxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDeEIsbUJBQW1CLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQzNCLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO29CQUN0QixtQkFBbUIsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDMUI7cUJBQU0sSUFBSSxHQUFHLENBQUMsYUFBYSxDQUFDLEVBQUU7b0JBQzdCLHVEQUF1RDtvQkFDdkQsNEJBQTRCO29CQUM1QixnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQztvQkFDdEIsbUJBQW1CLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzFCO2FBQ0Y7WUFDRCxPQUFPLEdBQUcsQ0FBQztRQUNiLENBQUMsRUFwQjZELENBb0I3RCxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ21lZGlhUXVlcnknLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBmdW5jdGlvbiBwYXRjaEFkZExpc3RlbmVyKHByb3RvOiBhbnkpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QocHJvdG8sICdhZGRMaXN0ZW5lcicsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiBudWxsO1xuICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBjb25zdCB3cmFwcGVyZWRDYWxsYmFjayA9IFpvbmUuY3VycmVudC53cmFwKGNhbGxiYWNrLCAnTWVkaWFRdWVyeScpO1xuICAgICAgICBjYWxsYmFja1thcGkuc3ltYm9sKCdtZWRpYVF1ZXJ5Q2FsbGJhY2snKV0gPSB3cmFwcGVyZWRDYWxsYmFjaztcbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmNhbGwoc2VsZiwgd3JhcHBlcmVkQ2FsbGJhY2spO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGF0Y2hSZW1vdmVMaXN0ZW5lcihwcm90bzogYW55KSB7XG4gICAgYXBpLnBhdGNoTWV0aG9kKHByb3RvLCAncmVtb3ZlTGlzdGVuZXInLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSBhcmdzLmxlbmd0aCA+IDAgPyBhcmdzWzBdIDogbnVsbDtcbiAgICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgY29uc3Qgd3JhcHBlcmVkQ2FsbGJhY2sgPSBjYWxsYmFja1thcGkuc3ltYm9sKCdtZWRpYVF1ZXJ5Q2FsbGJhY2snKV07XG4gICAgICAgIGlmICh3cmFwcGVyZWRDYWxsYmFjaykge1xuICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5jYWxsKHNlbGYsIHdyYXBwZXJlZENhbGxiYWNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChnbG9iYWxbJ01lZGlhUXVlcnlMaXN0J10pIHtcbiAgICBjb25zdCBwcm90byA9IGdsb2JhbFsnTWVkaWFRdWVyeUxpc3QnXS5wcm90b3R5cGU7XG4gICAgcGF0Y2hBZGRMaXN0ZW5lcihwcm90byk7XG4gICAgcGF0Y2hSZW1vdmVMaXN0ZW5lcihwcm90byk7XG4gIH0gZWxzZSBpZiAoZ2xvYmFsWydtYXRjaE1lZGlhJ10pIHtcbiAgICBhcGkucGF0Y2hNZXRob2QoZ2xvYmFsLCAnbWF0Y2hNZWRpYScsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICBjb25zdCBtcWwgPSBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgIGlmIChtcWwpIHtcbiAgICAgICAgLy8gdHJ5IHRvIHBhdGNoIE1lZGlhUXVlcnlMaXN0LnByb3RvdHlwZVxuICAgICAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihtcWwpO1xuICAgICAgICBpZiAocHJvdG8gJiYgcHJvdG9bJ2FkZExpc3RlbmVyJ10pIHtcbiAgICAgICAgICAvLyB0cnkgdG8gcGF0Y2ggcHJvdG8sIGRvbid0IG5lZWQgdG8gd29ycnkgYWJvdXQgcGF0Y2hcbiAgICAgICAgICAvLyBtdWx0aXBsZSB0aW1lcywgYmVjYXVzZSwgYXBpLnBhdGNoRXZlbnRUYXJnZXQgd2lsbCBjaGVjayBpdFxuICAgICAgICAgIHBhdGNoQWRkTGlzdGVuZXIocHJvdG8pO1xuICAgICAgICAgIHBhdGNoUmVtb3ZlTGlzdGVuZXIocHJvdG8pO1xuICAgICAgICAgIHBhdGNoQWRkTGlzdGVuZXIobXFsKTtcbiAgICAgICAgICBwYXRjaFJlbW92ZUxpc3RlbmVyKG1xbCk7XG4gICAgICAgIH0gZWxzZSBpZiAobXFsWydhZGRMaXN0ZW5lciddKSB7XG4gICAgICAgICAgLy8gcHJvdG8gbm90IGV4aXN0cywgb3IgcHJvdG8gaGFzIG5vIGFkZExpc3RlbmVyIG1ldGhvZFxuICAgICAgICAgIC8vIHRyeSB0byBwYXRjaCBtcWwgaW5zdGFuY2VcbiAgICAgICAgICBwYXRjaEFkZExpc3RlbmVyKG1xbCk7XG4gICAgICAgICAgcGF0Y2hSZW1vdmVMaXN0ZW5lcihtcWwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gbXFsO1xuICAgIH0pO1xuICB9XG59KTtcbiJdfQ==