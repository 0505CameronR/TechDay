/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('bluebird', function (global, Zone, api) {
    // TODO: @JiaLiPassion, we can automatically patch bluebird
    // if global.Promise = Bluebird, but sometimes in nodejs,
    // global.Promise is not Bluebird, and Bluebird is just be
    // used by other libraries such as sequelize, so I think it is
    // safe to just expose a method to patch Bluebird explicitly
    var BLUEBIRD = 'bluebird';
    Zone[Zone.__symbol__(BLUEBIRD)] = function patchBluebird(Bluebird) {
        // patch method of Bluebird.prototype which not using `then` internally
        var bluebirdApis = ['then', 'spread', 'finally'];
        bluebirdApis.forEach(function (bapi) {
            api.patchMethod(Bluebird.prototype, bapi, function (delegate) { return function (self, args) {
                var zone = Zone.current;
                var _loop_1 = function (i) {
                    var func = args[i];
                    if (typeof func === 'function') {
                        args[i] = function () {
                            var argSelf = this;
                            var argArgs = arguments;
                            return new Bluebird(function (res, rej) {
                                zone.scheduleMicroTask('Promise.then', function () {
                                    try {
                                        res(func.apply(argSelf, argArgs));
                                    }
                                    catch (error) {
                                        rej(error);
                                    }
                                });
                            });
                        };
                    }
                };
                for (var i = 0; i < args.length; i++) {
                    _loop_1(i);
                }
                return delegate.apply(self, args);
            }; });
        });
        Bluebird.onPossiblyUnhandledRejection(function (e, promise) {
            try {
                Zone.current.runGuarded(function () {
                    throw e;
                });
            }
            catch (err) {
                api.onUnhandledError(err);
            }
        });
        // override global promise
        global[api.symbol('ZoneAwarePromise')] = Bluebird;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmx1ZWJpcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2V4dHJhL2JsdWViaXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUMzRSwyREFBMkQ7SUFDM0QseURBQXlEO0lBQ3pELDBEQUEwRDtJQUMxRCw4REFBOEQ7SUFDOUQsNERBQTREO0lBQzVELElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUMzQixJQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLFNBQVMsYUFBYSxDQUFDLFFBQWE7UUFDN0UsdUVBQXVFO1FBQ3ZFLElBQU0sWUFBWSxHQUFhLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUM3RCxZQUFZLENBQUMsT0FBTyxDQUFDLFVBQUEsSUFBSTtZQUN2QixHQUFHLENBQUMsV0FBVyxDQUNYLFFBQVEsQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLFVBQUMsUUFBa0IsSUFBSyxPQUFBLFVBQUMsSUFBUyxFQUFFLElBQVc7Z0JBQ3ZFLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7d0NBQ2pCLENBQUM7b0JBQ1IsSUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO29CQUNyQixJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTt3QkFDOUIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHOzRCQUNSLElBQU0sT0FBTyxHQUFRLElBQUksQ0FBQzs0QkFDMUIsSUFBTSxPQUFPLEdBQVEsU0FBUyxDQUFDOzRCQUMvQixPQUFPLElBQUksUUFBUSxDQUFDLFVBQUMsR0FBUSxFQUFFLEdBQVE7Z0NBQ3JDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLEVBQUU7b0NBQ3JDLElBQUk7d0NBQ0YsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7cUNBQ25DO29DQUFDLE9BQU8sS0FBSyxFQUFFO3dDQUNkLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztxQ0FDWjtnQ0FDSCxDQUFDLENBQUMsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQzt3QkFDTCxDQUFDLENBQUM7cUJBQ0g7Z0JBQ0gsQ0FBQztnQkFqQkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFOzRCQUEzQixDQUFDO2lCQWlCVDtnQkFDRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3BDLENBQUMsRUFyQmlELENBcUJqRCxDQUFDLENBQUM7UUFDVCxDQUFDLENBQUMsQ0FBQztRQUVILFFBQVEsQ0FBQyw0QkFBNEIsQ0FBQyxVQUFTLENBQU0sRUFBRSxPQUFZO1lBQ2pFLElBQUk7Z0JBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUM7b0JBQ3RCLE1BQU0sQ0FBQyxDQUFDO2dCQUNWLENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDWixHQUFHLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDM0I7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUVILDBCQUEwQjtRQUMxQixNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDO0lBQ3BELENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2JsdWViaXJkJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgLy8gVE9ETzogQEppYUxpUGFzc2lvbiwgd2UgY2FuIGF1dG9tYXRpY2FsbHkgcGF0Y2ggYmx1ZWJpcmRcbiAgLy8gaWYgZ2xvYmFsLlByb21pc2UgPSBCbHVlYmlyZCwgYnV0IHNvbWV0aW1lcyBpbiBub2RlanMsXG4gIC8vIGdsb2JhbC5Qcm9taXNlIGlzIG5vdCBCbHVlYmlyZCwgYW5kIEJsdWViaXJkIGlzIGp1c3QgYmVcbiAgLy8gdXNlZCBieSBvdGhlciBsaWJyYXJpZXMgc3VjaCBhcyBzZXF1ZWxpemUsIHNvIEkgdGhpbmsgaXQgaXNcbiAgLy8gc2FmZSB0byBqdXN0IGV4cG9zZSBhIG1ldGhvZCB0byBwYXRjaCBCbHVlYmlyZCBleHBsaWNpdGx5XG4gIGNvbnN0IEJMVUVCSVJEID0gJ2JsdWViaXJkJztcbiAgKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oQkxVRUJJUkQpXSA9IGZ1bmN0aW9uIHBhdGNoQmx1ZWJpcmQoQmx1ZWJpcmQ6IGFueSkge1xuICAgIC8vIHBhdGNoIG1ldGhvZCBvZiBCbHVlYmlyZC5wcm90b3R5cGUgd2hpY2ggbm90IHVzaW5nIGB0aGVuYCBpbnRlcm5hbGx5XG4gICAgY29uc3QgYmx1ZWJpcmRBcGlzOiBzdHJpbmdbXSA9IFsndGhlbicsICdzcHJlYWQnLCAnZmluYWxseSddO1xuICAgIGJsdWViaXJkQXBpcy5mb3JFYWNoKGJhcGkgPT4ge1xuICAgICAgYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICAgIEJsdWViaXJkLnByb3RvdHlwZSwgYmFwaSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgZnVuYyA9IGFyZ3NbaV07XG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgZnVuYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgIGFyZ3NbaV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgIGNvbnN0IGFyZ1NlbGY6IGFueSA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICBjb25zdCBhcmdBcmdzOiBhbnkgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEJsdWViaXJkKChyZXM6IGFueSwgcmVqOiBhbnkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgem9uZS5zY2hlZHVsZU1pY3JvVGFzaygnUHJvbWlzZS50aGVuJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXMoZnVuYy5hcHBseShhcmdTZWxmLCBhcmdBcmdzKSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlaihlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIEJsdWViaXJkLm9uUG9zc2libHlVbmhhbmRsZWRSZWplY3Rpb24oZnVuY3Rpb24oZTogYW55LCBwcm9taXNlOiBhbnkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIFpvbmUuY3VycmVudC5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICBhcGkub25VbmhhbmRsZWRFcnJvcihlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gb3ZlcnJpZGUgZ2xvYmFsIHByb21pc2VcbiAgICBnbG9iYWxbYXBpLnN5bWJvbCgnWm9uZUF3YXJlUHJvbWlzZScpXSA9IEJsdWViaXJkO1xuICB9O1xufSk7XG4iXX0=