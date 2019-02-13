"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
require("../zone-spec/async-test");
Zone.__load_patch('asynctest', function (global, Zone, api) {
    /**
     * Wraps a test function in an asynchronous test zone. The test will automatically
     * complete when all asynchronous calls within this zone are done.
     */
    Zone[api.symbol('asyncTest')] = function asyncTest(fn) {
        // If we're running using the Jasmine test framework, adapt to call the 'done'
        // function when asynchronous activity is finished.
        if (global.jasmine) {
            // Not using an arrow function to preserve context passed from call site
            return function (done) {
                if (!done) {
                    // if we run beforeEach in @angular/core/testing/testing_internal then we get no done
                    // fake it here and assume sync.
                    done = function () { };
                    done.fail = function (e) {
                        throw e;
                    };
                }
                runInTestZone(fn, this, done, function (err) {
                    if (typeof err === 'string') {
                        return done.fail(new Error(err));
                    }
                    else {
                        done.fail(err);
                    }
                });
            };
        }
        // Otherwise, return a promise which will resolve when asynchronous activity
        // is finished. This will be correctly consumed by the Mocha framework with
        // it('...', async(myFn)); or can be used in a custom framework.
        // Not using an arrow function to preserve context passed from call site
        return function () {
            var _this = this;
            return new Promise(function (finishCallback, failCallback) {
                runInTestZone(fn, _this, finishCallback, failCallback);
            });
        };
    };
    function runInTestZone(fn, context, finishCallback, failCallback) {
        var currentZone = Zone.current;
        var AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
        if (AsyncTestZoneSpec === undefined) {
            throw new Error('AsyncTestZoneSpec is needed for the async() test helper but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/async-test.js');
        }
        var ProxyZoneSpec = Zone['ProxyZoneSpec'];
        if (ProxyZoneSpec === undefined) {
            throw new Error('ProxyZoneSpec is needed for the async() test helper but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/proxy.js');
        }
        var proxyZoneSpec = ProxyZoneSpec.get();
        ProxyZoneSpec.assertPresent();
        // We need to create the AsyncTestZoneSpec outside the ProxyZone.
        // If we do it in ProxyZone then we will get to infinite recursion.
        var proxyZone = Zone.current.getZoneWith('ProxyZoneSpec');
        var previousDelegate = proxyZoneSpec.getDelegate();
        proxyZone.parent.run(function () {
            var testZoneSpec = new AsyncTestZoneSpec(function () {
                // Need to restore the original zone.
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's
                    // sill this one. Otherwise, assume
                    // it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                testZoneSpec.unPatchPromiseForTest();
                currentZone.run(function () {
                    finishCallback();
                });
            }, function (error) {
                // Need to restore the original zone.
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                testZoneSpec.unPatchPromiseForTest();
                currentZone.run(function () {
                    failCallback(error);
                });
            }, 'test');
            proxyZoneSpec.setDelegate(testZoneSpec);
            testZoneSpec.patchPromiseForTest();
        });
        return Zone.current.runGuarded(fn, context);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtdGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvdGVzdGluZy9hc3luYy10ZXN0aW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsbUNBQWlDO0FBRWpDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUM1RTs7O09BR0c7SUFDRixJQUFZLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxHQUFHLFNBQVMsU0FBUyxDQUFDLEVBQVk7UUFDdEUsOEVBQThFO1FBQzlFLG1EQUFtRDtRQUNuRCxJQUFJLE1BQU0sQ0FBQyxPQUFPLEVBQUU7WUFDbEIsd0VBQXdFO1lBQ3hFLE9BQU8sVUFBUyxJQUFTO2dCQUN2QixJQUFJLENBQUMsSUFBSSxFQUFFO29CQUNULHFGQUFxRjtvQkFDckYsZ0NBQWdDO29CQUNoQyxJQUFJLEdBQUcsY0FBWSxDQUFDLENBQUM7b0JBQ3JCLElBQUksQ0FBQyxJQUFJLEdBQUcsVUFBUyxDQUFNO3dCQUN6QixNQUFNLENBQUMsQ0FBQztvQkFDVixDQUFDLENBQUM7aUJBQ0g7Z0JBQ0QsYUFBYSxDQUFDLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFVBQUMsR0FBUTtvQkFDckMsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7d0JBQzNCLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBUyxHQUFHLENBQUMsQ0FBQyxDQUFDO3FCQUMxQzt5QkFBTTt3QkFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUNoQjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQztTQUNIO1FBQ0QsNEVBQTRFO1FBQzVFLDJFQUEyRTtRQUMzRSxnRUFBZ0U7UUFDaEUsd0VBQXdFO1FBQ3hFLE9BQU87WUFBQSxpQkFJTjtZQUhDLE9BQU8sSUFBSSxPQUFPLENBQU8sVUFBQyxjQUFjLEVBQUUsWUFBWTtnQkFDcEQsYUFBYSxDQUFDLEVBQUUsRUFBRSxLQUFJLEVBQUUsY0FBYyxFQUFFLFlBQVksQ0FBQyxDQUFDO1lBQ3hELENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQyxDQUFDO0lBRUYsU0FBUyxhQUFhLENBQ2xCLEVBQVksRUFBRSxPQUFZLEVBQUUsY0FBd0IsRUFBRSxZQUFzQjtRQUM5RSxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ2pDLElBQU0saUJBQWlCLEdBQUksSUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7UUFDN0QsSUFBSSxpQkFBaUIsS0FBSyxTQUFTLEVBQUU7WUFDbkMsTUFBTSxJQUFJLEtBQUssQ0FDWCxrRkFBa0Y7Z0JBQ2xGLDRFQUE0RSxDQUFDLENBQUM7U0FDbkY7UUFDRCxJQUFNLGFBQWEsR0FBSSxJQUFZLENBQUMsZUFBZSxDQUdsRCxDQUFDO1FBQ0YsSUFBSSxhQUFhLEtBQUssU0FBUyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxLQUFLLENBQ1gsOEVBQThFO2dCQUM5RSx1RUFBdUUsQ0FBQyxDQUFDO1NBQzlFO1FBQ0QsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQzFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUM5QixpRUFBaUU7UUFDakUsbUVBQW1FO1FBQ25FLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQzVELElBQU0sZ0JBQWdCLEdBQUcsYUFBYSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3JELFNBQVUsQ0FBQyxNQUFPLENBQUMsR0FBRyxDQUFDO1lBQ3JCLElBQU0sWUFBWSxHQUFhLElBQUksaUJBQWlCLENBQ2hEO2dCQUNFLHFDQUFxQztnQkFDckMsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksWUFBWSxFQUFFO29CQUMvQyxtQ0FBbUM7b0JBQ25DLG1DQUFtQztvQkFDbkMsV0FBVztvQkFDWCxhQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzdDO2dCQUNBLFlBQW9CLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDOUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztvQkFDZCxjQUFjLEVBQUUsQ0FBQztnQkFDbkIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQ0QsVUFBQyxLQUFVO2dCQUNULHFDQUFxQztnQkFDckMsSUFBSSxhQUFhLENBQUMsV0FBVyxFQUFFLElBQUksWUFBWSxFQUFFO29CQUMvQyw2RUFBNkU7b0JBQzdFLGFBQWEsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDN0M7Z0JBQ0EsWUFBb0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO2dCQUM5QyxXQUFXLENBQUMsR0FBRyxDQUFDO29CQUNkLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztnQkFDdEIsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLEVBQ0QsTUFBTSxDQUFDLENBQUM7WUFDWixhQUFhLENBQUMsV0FBVyxDQUFDLFlBQVksQ0FBQyxDQUFDO1lBQ3ZDLFlBQW9CLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7QUFDSCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCAnLi4vem9uZS1zcGVjL2FzeW5jLXRlc3QnO1xuXG5ab25lLl9fbG9hZF9wYXRjaCgnYXN5bmN0ZXN0JywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgLyoqXG4gICAqIFdyYXBzIGEgdGVzdCBmdW5jdGlvbiBpbiBhbiBhc3luY2hyb25vdXMgdGVzdCB6b25lLiBUaGUgdGVzdCB3aWxsIGF1dG9tYXRpY2FsbHlcbiAgICogY29tcGxldGUgd2hlbiBhbGwgYXN5bmNocm9ub3VzIGNhbGxzIHdpdGhpbiB0aGlzIHpvbmUgYXJlIGRvbmUuXG4gICAqL1xuICAoWm9uZSBhcyBhbnkpW2FwaS5zeW1ib2woJ2FzeW5jVGVzdCcpXSA9IGZ1bmN0aW9uIGFzeW5jVGVzdChmbjogRnVuY3Rpb24pOiAoZG9uZTogYW55KSA9PiBhbnkge1xuICAgIC8vIElmIHdlJ3JlIHJ1bm5pbmcgdXNpbmcgdGhlIEphc21pbmUgdGVzdCBmcmFtZXdvcmssIGFkYXB0IHRvIGNhbGwgdGhlICdkb25lJ1xuICAgIC8vIGZ1bmN0aW9uIHdoZW4gYXN5bmNocm9ub3VzIGFjdGl2aXR5IGlzIGZpbmlzaGVkLlxuICAgIGlmIChnbG9iYWwuamFzbWluZSkge1xuICAgICAgLy8gTm90IHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHRvIHByZXNlcnZlIGNvbnRleHQgcGFzc2VkIGZyb20gY2FsbCBzaXRlXG4gICAgICByZXR1cm4gZnVuY3Rpb24oZG9uZTogYW55KSB7XG4gICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgIC8vIGlmIHdlIHJ1biBiZWZvcmVFYWNoIGluIEBhbmd1bGFyL2NvcmUvdGVzdGluZy90ZXN0aW5nX2ludGVybmFsIHRoZW4gd2UgZ2V0IG5vIGRvbmVcbiAgICAgICAgICAvLyBmYWtlIGl0IGhlcmUgYW5kIGFzc3VtZSBzeW5jLlxuICAgICAgICAgIGRvbmUgPSBmdW5jdGlvbigpIHt9O1xuICAgICAgICAgIGRvbmUuZmFpbCA9IGZ1bmN0aW9uKGU6IGFueSkge1xuICAgICAgICAgICAgdGhyb3cgZTtcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJ1bkluVGVzdFpvbmUoZm4sIHRoaXMsIGRvbmUsIChlcnI6IGFueSkgPT4ge1xuICAgICAgICAgIGlmICh0eXBlb2YgZXJyID09PSAnc3RyaW5nJykge1xuICAgICAgICAgICAgcmV0dXJuIGRvbmUuZmFpbChuZXcgRXJyb3IoPHN0cmluZz5lcnIpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9uZS5mYWlsKGVycik7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH07XG4gICAgfVxuICAgIC8vIE90aGVyd2lzZSwgcmV0dXJuIGEgcHJvbWlzZSB3aGljaCB3aWxsIHJlc29sdmUgd2hlbiBhc3luY2hyb25vdXMgYWN0aXZpdHlcbiAgICAvLyBpcyBmaW5pc2hlZC4gVGhpcyB3aWxsIGJlIGNvcnJlY3RseSBjb25zdW1lZCBieSB0aGUgTW9jaGEgZnJhbWV3b3JrIHdpdGhcbiAgICAvLyBpdCgnLi4uJywgYXN5bmMobXlGbikpOyBvciBjYW4gYmUgdXNlZCBpbiBhIGN1c3RvbSBmcmFtZXdvcmsuXG4gICAgLy8gTm90IHVzaW5nIGFuIGFycm93IGZ1bmN0aW9uIHRvIHByZXNlcnZlIGNvbnRleHQgcGFzc2VkIGZyb20gY2FsbCBzaXRlXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChmaW5pc2hDYWxsYmFjaywgZmFpbENhbGxiYWNrKSA9PiB7XG4gICAgICAgIHJ1bkluVGVzdFpvbmUoZm4sIHRoaXMsIGZpbmlzaENhbGxiYWNrLCBmYWlsQ2FsbGJhY2spO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfTtcblxuICBmdW5jdGlvbiBydW5JblRlc3Rab25lKFxuICAgICAgZm46IEZ1bmN0aW9uLCBjb250ZXh0OiBhbnksIGZpbmlzaENhbGxiYWNrOiBGdW5jdGlvbiwgZmFpbENhbGxiYWNrOiBGdW5jdGlvbikge1xuICAgIGNvbnN0IGN1cnJlbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAgIGNvbnN0IEFzeW5jVGVzdFpvbmVTcGVjID0gKFpvbmUgYXMgYW55KVsnQXN5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgICBpZiAoQXN5bmNUZXN0Wm9uZVNwZWMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdBc3luY1Rlc3Rab25lU3BlYyBpcyBuZWVkZWQgZm9yIHRoZSBhc3luYygpIHRlc3QgaGVscGVyIGJ1dCBjb3VsZCBub3QgYmUgZm91bmQuICcgK1xuICAgICAgICAgICdQbGVhc2UgbWFrZSBzdXJlIHRoYXQgeW91ciBlbnZpcm9ubWVudCBpbmNsdWRlcyB6b25lLmpzL2Rpc3QvYXN5bmMtdGVzdC5qcycpO1xuICAgIH1cbiAgICBjb25zdCBQcm94eVpvbmVTcGVjID0gKFpvbmUgYXMgYW55KVsnUHJveHlab25lU3BlYyddIGFzIHtcbiAgICAgIGdldCgpOiB7c2V0RGVsZWdhdGUoc3BlYzogWm9uZVNwZWMpOiB2b2lkOyBnZXREZWxlZ2F0ZSgpOiBab25lU3BlYzt9O1xuICAgICAgYXNzZXJ0UHJlc2VudDogKCkgPT4gdm9pZDtcbiAgICB9O1xuICAgIGlmIChQcm94eVpvbmVTcGVjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnUHJveHlab25lU3BlYyBpcyBuZWVkZWQgZm9yIHRoZSBhc3luYygpIHRlc3QgaGVscGVyIGJ1dCBjb3VsZCBub3QgYmUgZm91bmQuICcgK1xuICAgICAgICAgICdQbGVhc2UgbWFrZSBzdXJlIHRoYXQgeW91ciBlbnZpcm9ubWVudCBpbmNsdWRlcyB6b25lLmpzL2Rpc3QvcHJveHkuanMnKTtcbiAgICB9XG4gICAgY29uc3QgcHJveHlab25lU3BlYyA9IFByb3h5Wm9uZVNwZWMuZ2V0KCk7XG4gICAgUHJveHlab25lU3BlYy5hc3NlcnRQcmVzZW50KCk7XG4gICAgLy8gV2UgbmVlZCB0byBjcmVhdGUgdGhlIEFzeW5jVGVzdFpvbmVTcGVjIG91dHNpZGUgdGhlIFByb3h5Wm9uZS5cbiAgICAvLyBJZiB3ZSBkbyBpdCBpbiBQcm94eVpvbmUgdGhlbiB3ZSB3aWxsIGdldCB0byBpbmZpbml0ZSByZWN1cnNpb24uXG4gICAgY29uc3QgcHJveHlab25lID0gWm9uZS5jdXJyZW50LmdldFpvbmVXaXRoKCdQcm94eVpvbmVTcGVjJyk7XG4gICAgY29uc3QgcHJldmlvdXNEZWxlZ2F0ZSA9IHByb3h5Wm9uZVNwZWMuZ2V0RGVsZWdhdGUoKTtcbiAgICBwcm94eVpvbmUhLnBhcmVudCEucnVuKCgpID0+IHtcbiAgICAgIGNvbnN0IHRlc3Rab25lU3BlYzogWm9uZVNwZWMgPSBuZXcgQXN5bmNUZXN0Wm9uZVNwZWMoXG4gICAgICAgICAgKCkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byByZXN0b3JlIHRoZSBvcmlnaW5hbCB6b25lLlxuICAgICAgICAgICAgaWYgKHByb3h5Wm9uZVNwZWMuZ2V0RGVsZWdhdGUoKSA9PSB0ZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgICAgLy8gT25seSByZXNldCB0aGUgem9uZSBzcGVjIGlmIGl0J3NcbiAgICAgICAgICAgICAgLy8gc2lsbCB0aGlzIG9uZS4gT3RoZXJ3aXNlLCBhc3N1bWVcbiAgICAgICAgICAgICAgLy8gaXQncyBPSy5cbiAgICAgICAgICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZShwcmV2aW91c0RlbGVnYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICh0ZXN0Wm9uZVNwZWMgYXMgYW55KS51blBhdGNoUHJvbWlzZUZvclRlc3QoKTtcbiAgICAgICAgICAgIGN1cnJlbnRab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIGZpbmlzaENhbGxiYWNrKCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIChlcnJvcjogYW55KSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIHpvbmUuXG4gICAgICAgICAgICBpZiAocHJveHlab25lU3BlYy5nZXREZWxlZ2F0ZSgpID09IHRlc3Rab25lU3BlYykge1xuICAgICAgICAgICAgICAvLyBPbmx5IHJlc2V0IHRoZSB6b25lIHNwZWMgaWYgaXQncyBzaWxsIHRoaXMgb25lLiBPdGhlcndpc2UsIGFzc3VtZSBpdCdzIE9LLlxuICAgICAgICAgICAgICBwcm94eVpvbmVTcGVjLnNldERlbGVnYXRlKHByZXZpb3VzRGVsZWdhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKHRlc3Rab25lU3BlYyBhcyBhbnkpLnVuUGF0Y2hQcm9taXNlRm9yVGVzdCgpO1xuICAgICAgICAgICAgY3VycmVudFpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgZmFpbENhbGxiYWNrKGVycm9yKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgJ3Rlc3QnKTtcbiAgICAgIHByb3h5Wm9uZVNwZWMuc2V0RGVsZWdhdGUodGVzdFpvbmVTcGVjKTtcbiAgICAgICh0ZXN0Wm9uZVNwZWMgYXMgYW55KS5wYXRjaFByb21pc2VGb3JUZXN0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIFpvbmUuY3VycmVudC5ydW5HdWFyZGVkKGZuLCBjb250ZXh0KTtcbiAgfVxufSk7Il19