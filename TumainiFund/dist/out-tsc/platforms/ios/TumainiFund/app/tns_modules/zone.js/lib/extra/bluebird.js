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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmx1ZWJpcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9leHRyYS9ibHVlYmlyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDM0UsMkRBQTJEO0lBQzNELHlEQUF5RDtJQUN6RCwwREFBMEQ7SUFDMUQsOERBQThEO0lBQzlELDREQUE0RDtJQUM1RCxJQUFNLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDM0IsSUFBWSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUMsR0FBRyxTQUFTLGFBQWEsQ0FBQyxRQUFhO1FBQzdFLHVFQUF1RTtRQUN2RSxJQUFNLFlBQVksR0FBYSxDQUFDLE1BQU0sRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDN0QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7WUFDdkIsR0FBRyxDQUFDLFdBQVcsQ0FDWCxRQUFRLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO2dCQUN2RSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO3dDQUNqQixDQUFDO29CQUNSLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDckIsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7d0JBQzlCLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRzs0QkFDUixJQUFNLE9BQU8sR0FBUSxJQUFJLENBQUM7NEJBQzFCLElBQU0sT0FBTyxHQUFRLFNBQVMsQ0FBQzs0QkFDL0IsT0FBTyxJQUFJLFFBQVEsQ0FBQyxVQUFDLEdBQVEsRUFBRSxHQUFRO2dDQUNyQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsY0FBYyxFQUFFO29DQUNyQyxJQUFJO3dDQUNGLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDO3FDQUNuQztvQ0FBQyxPQUFPLEtBQUssRUFBRTt3Q0FDZCxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7cUNBQ1o7Z0NBQ0gsQ0FBQyxDQUFDLENBQUM7NEJBQ0wsQ0FBQyxDQUFDLENBQUM7d0JBQ0wsQ0FBQyxDQUFDO3FCQUNIO2dCQUNILENBQUM7Z0JBakJELEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTs0QkFBM0IsQ0FBQztpQkFpQlQ7Z0JBQ0QsT0FBTyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNwQyxDQUFDLEVBckJpRCxDQXFCakQsQ0FBQyxDQUFDO1FBQ1QsQ0FBQyxDQUFDLENBQUM7UUFFSCxRQUFRLENBQUMsNEJBQTRCLENBQUMsVUFBUyxDQUFNLEVBQUUsT0FBWTtZQUNqRSxJQUFJO2dCQUNGLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO29CQUN0QixNQUFNLENBQUMsQ0FBQztnQkFDVixDQUFDLENBQUMsQ0FBQzthQUNKO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1osR0FBRyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDO2FBQzNCO1FBQ0gsQ0FBQyxDQUFDLENBQUM7UUFFSCwwQkFBMEI7UUFDMUIsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQztJQUNwRCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdibHVlYmlyZCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIC8vIFRPRE86IEBKaWFMaVBhc3Npb24sIHdlIGNhbiBhdXRvbWF0aWNhbGx5IHBhdGNoIGJsdWViaXJkXG4gIC8vIGlmIGdsb2JhbC5Qcm9taXNlID0gQmx1ZWJpcmQsIGJ1dCBzb21ldGltZXMgaW4gbm9kZWpzLFxuICAvLyBnbG9iYWwuUHJvbWlzZSBpcyBub3QgQmx1ZWJpcmQsIGFuZCBCbHVlYmlyZCBpcyBqdXN0IGJlXG4gIC8vIHVzZWQgYnkgb3RoZXIgbGlicmFyaWVzIHN1Y2ggYXMgc2VxdWVsaXplLCBzbyBJIHRoaW5rIGl0IGlzXG4gIC8vIHNhZmUgdG8ganVzdCBleHBvc2UgYSBtZXRob2QgdG8gcGF0Y2ggQmx1ZWJpcmQgZXhwbGljaXRseVxuICBjb25zdCBCTFVFQklSRCA9ICdibHVlYmlyZCc7XG4gIChab25lIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKEJMVUVCSVJEKV0gPSBmdW5jdGlvbiBwYXRjaEJsdWViaXJkKEJsdWViaXJkOiBhbnkpIHtcbiAgICAvLyBwYXRjaCBtZXRob2Qgb2YgQmx1ZWJpcmQucHJvdG90eXBlIHdoaWNoIG5vdCB1c2luZyBgdGhlbmAgaW50ZXJuYWxseVxuICAgIGNvbnN0IGJsdWViaXJkQXBpczogc3RyaW5nW10gPSBbJ3RoZW4nLCAnc3ByZWFkJywgJ2ZpbmFsbHknXTtcbiAgICBibHVlYmlyZEFwaXMuZm9yRWFjaChiYXBpID0+IHtcbiAgICAgIGFwaS5wYXRjaE1ldGhvZChcbiAgICAgICAgICBCbHVlYmlyZC5wcm90b3R5cGUsIGJhcGksIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiB7XG4gICAgICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcmdzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGZ1bmMgPSBhcmdzW2ldO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGZ1bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICBhcmdzW2ldID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCBhcmdTZWxmOiBhbnkgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgY29uc3QgYXJnQXJnczogYW55ID0gYXJndW1lbnRzO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBCbHVlYmlyZCgocmVzOiBhbnksIHJlajogYW55KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIHpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soJ1Byb21pc2UudGhlbicsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzKGZ1bmMuYXBwbHkoYXJnU2VsZiwgYXJnQXJncykpO1xuICAgICAgICAgICAgICAgICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWooZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBCbHVlYmlyZC5vblBvc3NpYmx5VW5oYW5kbGVkUmVqZWN0aW9uKGZ1bmN0aW9uKGU6IGFueSwgcHJvbWlzZTogYW55KSB7XG4gICAgICB0cnkge1xuICAgICAgICBab25lLmN1cnJlbnQucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgICAgYXBpLm9uVW5oYW5kbGVkRXJyb3IoZXJyKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG92ZXJyaWRlIGdsb2JhbCBwcm9taXNlXG4gICAgZ2xvYmFsW2FwaS5zeW1ib2woJ1pvbmVBd2FyZVByb21pc2UnKV0gPSBCbHVlYmlyZDtcbiAgfTtcbn0pO1xuIl19