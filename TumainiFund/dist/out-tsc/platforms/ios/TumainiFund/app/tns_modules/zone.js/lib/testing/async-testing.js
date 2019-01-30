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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtdGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3Rlc3RpbmcvYXN5bmMtdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILG1DQUFpQztBQUVqQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDNUU7OztPQUdHO0lBQ0YsSUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxFQUFZO1FBQ3RFLDhFQUE4RTtRQUM5RSxtREFBbUQ7UUFDbkQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ2xCLHdFQUF3RTtZQUN4RSxPQUFPLFVBQVMsSUFBUztnQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDVCxxRkFBcUY7b0JBQ3JGLGdDQUFnQztvQkFDaEMsSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVMsQ0FBTTt3QkFDekIsTUFBTSxDQUFDLENBQUM7b0JBQ1YsQ0FBQyxDQUFDO2lCQUNIO2dCQUNELGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxVQUFDLEdBQVE7b0JBQ3JDLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO3dCQUMzQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLENBQVMsR0FBRyxDQUFDLENBQUMsQ0FBQztxQkFDMUM7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztxQkFDaEI7Z0JBQ0gsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUM7U0FDSDtRQUNELDRFQUE0RTtRQUM1RSwyRUFBMkU7UUFDM0UsZ0VBQWdFO1FBQ2hFLHdFQUF3RTtRQUN4RSxPQUFPO1lBQUEsaUJBSU47WUFIQyxPQUFPLElBQUksT0FBTyxDQUFPLFVBQUMsY0FBYyxFQUFFLFlBQVk7Z0JBQ3BELGFBQWEsQ0FBQyxFQUFFLEVBQUUsS0FBSSxFQUFFLGNBQWMsRUFBRSxZQUFZLENBQUMsQ0FBQztZQUN4RCxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVGLFNBQVMsYUFBYSxDQUNsQixFQUFZLEVBQUUsT0FBWSxFQUFFLGNBQXdCLEVBQUUsWUFBc0I7UUFDOUUsSUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQztRQUNqQyxJQUFNLGlCQUFpQixHQUFJLElBQVksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQzdELElBQUksaUJBQWlCLEtBQUssU0FBUyxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQ1gsa0ZBQWtGO2dCQUNsRiw0RUFBNEUsQ0FBQyxDQUFDO1NBQ25GO1FBQ0QsSUFBTSxhQUFhLEdBQUksSUFBWSxDQUFDLGVBQWUsQ0FHbEQsQ0FBQztRQUNGLElBQUksYUFBYSxLQUFLLFNBQVMsRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUNYLDhFQUE4RTtnQkFDOUUsdUVBQXVFLENBQUMsQ0FBQztTQUM5RTtRQUNELElBQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUMxQyxhQUFhLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDOUIsaUVBQWlFO1FBQ2pFLG1FQUFtRTtRQUNuRSxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUM1RCxJQUFNLGdCQUFnQixHQUFHLGFBQWEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNyRCxTQUFVLENBQUMsTUFBTyxDQUFDLEdBQUcsQ0FBQztZQUNyQixJQUFNLFlBQVksR0FBYSxJQUFJLGlCQUFpQixDQUNoRDtnQkFDRSxxQ0FBcUM7Z0JBQ3JDLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLFlBQVksRUFBRTtvQkFDL0MsbUNBQW1DO29CQUNuQyxtQ0FBbUM7b0JBQ25DLFdBQVc7b0JBQ1gsYUFBYSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUM3QztnQkFDQSxZQUFvQixDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzlDLFdBQVcsQ0FBQyxHQUFHLENBQUM7b0JBQ2QsY0FBYyxFQUFFLENBQUM7Z0JBQ25CLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUNELFVBQUMsS0FBVTtnQkFDVCxxQ0FBcUM7Z0JBQ3JDLElBQUksYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLFlBQVksRUFBRTtvQkFDL0MsNkVBQTZFO29CQUM3RSxhQUFhLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUM7aUJBQzdDO2dCQUNBLFlBQW9CLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDOUMsV0FBVyxDQUFDLEdBQUcsQ0FBQztvQkFDZCxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3RCLENBQUMsQ0FBQyxDQUFDO1lBQ0wsQ0FBQyxFQUNELE1BQU0sQ0FBQyxDQUFDO1lBQ1osYUFBYSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQztZQUN2QyxZQUFvQixDQUFDLG1CQUFtQixFQUFFLENBQUM7UUFDOUMsQ0FBQyxDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0FBQ0gsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQgJy4uL3pvbmUtc3BlYy9hc3luYy10ZXN0JztcblxuWm9uZS5fX2xvYWRfcGF0Y2goJ2FzeW5jdGVzdCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIC8qKlxuICAgKiBXcmFwcyBhIHRlc3QgZnVuY3Rpb24gaW4gYW4gYXN5bmNocm9ub3VzIHRlc3Qgem9uZS4gVGhlIHRlc3Qgd2lsbCBhdXRvbWF0aWNhbGx5XG4gICAqIGNvbXBsZXRlIHdoZW4gYWxsIGFzeW5jaHJvbm91cyBjYWxscyB3aXRoaW4gdGhpcyB6b25lIGFyZSBkb25lLlxuICAgKi9cbiAgKFpvbmUgYXMgYW55KVthcGkuc3ltYm9sKCdhc3luY1Rlc3QnKV0gPSBmdW5jdGlvbiBhc3luY1Rlc3QoZm46IEZ1bmN0aW9uKTogKGRvbmU6IGFueSkgPT4gYW55IHtcbiAgICAvLyBJZiB3ZSdyZSBydW5uaW5nIHVzaW5nIHRoZSBKYXNtaW5lIHRlc3QgZnJhbWV3b3JrLCBhZGFwdCB0byBjYWxsIHRoZSAnZG9uZSdcbiAgICAvLyBmdW5jdGlvbiB3aGVuIGFzeW5jaHJvbm91cyBhY3Rpdml0eSBpcyBmaW5pc2hlZC5cbiAgICBpZiAoZ2xvYmFsLmphc21pbmUpIHtcbiAgICAgIC8vIE5vdCB1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB0byBwcmVzZXJ2ZSBjb250ZXh0IHBhc3NlZCBmcm9tIGNhbGwgc2l0ZVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uKGRvbmU6IGFueSkge1xuICAgICAgICBpZiAoIWRvbmUpIHtcbiAgICAgICAgICAvLyBpZiB3ZSBydW4gYmVmb3JlRWFjaCBpbiBAYW5ndWxhci9jb3JlL3Rlc3RpbmcvdGVzdGluZ19pbnRlcm5hbCB0aGVuIHdlIGdldCBubyBkb25lXG4gICAgICAgICAgLy8gZmFrZSBpdCBoZXJlIGFuZCBhc3N1bWUgc3luYy5cbiAgICAgICAgICBkb25lID0gZnVuY3Rpb24oKSB7fTtcbiAgICAgICAgICBkb25lLmZhaWwgPSBmdW5jdGlvbihlOiBhbnkpIHtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBydW5JblRlc3Rab25lKGZuLCB0aGlzLCBkb25lLCAoZXJyOiBhbnkpID0+IHtcbiAgICAgICAgICBpZiAodHlwZW9mIGVyciA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIHJldHVybiBkb25lLmZhaWwobmV3IEVycm9yKDxzdHJpbmc+ZXJyKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRvbmUuZmFpbChlcnIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9O1xuICAgIH1cbiAgICAvLyBPdGhlcndpc2UsIHJldHVybiBhIHByb21pc2Ugd2hpY2ggd2lsbCByZXNvbHZlIHdoZW4gYXN5bmNocm9ub3VzIGFjdGl2aXR5XG4gICAgLy8gaXMgZmluaXNoZWQuIFRoaXMgd2lsbCBiZSBjb3JyZWN0bHkgY29uc3VtZWQgYnkgdGhlIE1vY2hhIGZyYW1ld29yayB3aXRoXG4gICAgLy8gaXQoJy4uLicsIGFzeW5jKG15Rm4pKTsgb3IgY2FuIGJlIHVzZWQgaW4gYSBjdXN0b20gZnJhbWV3b3JrLlxuICAgIC8vIE5vdCB1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB0byBwcmVzZXJ2ZSBjb250ZXh0IHBhc3NlZCBmcm9tIGNhbGwgc2l0ZVxuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigoZmluaXNoQ2FsbGJhY2ssIGZhaWxDYWxsYmFjaykgPT4ge1xuICAgICAgICBydW5JblRlc3Rab25lKGZuLCB0aGlzLCBmaW5pc2hDYWxsYmFjaywgZmFpbENhbGxiYWNrKTtcbiAgICAgIH0pO1xuICAgIH07XG4gIH07XG5cbiAgZnVuY3Rpb24gcnVuSW5UZXN0Wm9uZShcbiAgICAgIGZuOiBGdW5jdGlvbiwgY29udGV4dDogYW55LCBmaW5pc2hDYWxsYmFjazogRnVuY3Rpb24sIGZhaWxDYWxsYmFjazogRnVuY3Rpb24pIHtcbiAgICBjb25zdCBjdXJyZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgICBjb25zdCBBc3luY1Rlc3Rab25lU3BlYyA9IChab25lIGFzIGFueSlbJ0FzeW5jVGVzdFpvbmVTcGVjJ107XG4gICAgaWYgKEFzeW5jVGVzdFpvbmVTcGVjID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAnQXN5bmNUZXN0Wm9uZVNwZWMgaXMgbmVlZGVkIGZvciB0aGUgYXN5bmMoKSB0ZXN0IGhlbHBlciBidXQgY291bGQgbm90IGJlIGZvdW5kLiAnICtcbiAgICAgICAgICAnUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHlvdXIgZW52aXJvbm1lbnQgaW5jbHVkZXMgem9uZS5qcy9kaXN0L2FzeW5jLXRlc3QuanMnKTtcbiAgICB9XG4gICAgY29uc3QgUHJveHlab25lU3BlYyA9IChab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXSBhcyB7XG4gICAgICBnZXQoKToge3NldERlbGVnYXRlKHNwZWM6IFpvbmVTcGVjKTogdm9pZDsgZ2V0RGVsZWdhdGUoKTogWm9uZVNwZWM7fTtcbiAgICAgIGFzc2VydFByZXNlbnQ6ICgpID0+IHZvaWQ7XG4gICAgfTtcbiAgICBpZiAoUHJveHlab25lU3BlYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ1Byb3h5Wm9uZVNwZWMgaXMgbmVlZGVkIGZvciB0aGUgYXN5bmMoKSB0ZXN0IGhlbHBlciBidXQgY291bGQgbm90IGJlIGZvdW5kLiAnICtcbiAgICAgICAgICAnUGxlYXNlIG1ha2Ugc3VyZSB0aGF0IHlvdXIgZW52aXJvbm1lbnQgaW5jbHVkZXMgem9uZS5qcy9kaXN0L3Byb3h5LmpzJyk7XG4gICAgfVxuICAgIGNvbnN0IHByb3h5Wm9uZVNwZWMgPSBQcm94eVpvbmVTcGVjLmdldCgpO1xuICAgIFByb3h5Wm9uZVNwZWMuYXNzZXJ0UHJlc2VudCgpO1xuICAgIC8vIFdlIG5lZWQgdG8gY3JlYXRlIHRoZSBBc3luY1Rlc3Rab25lU3BlYyBvdXRzaWRlIHRoZSBQcm94eVpvbmUuXG4gICAgLy8gSWYgd2UgZG8gaXQgaW4gUHJveHlab25lIHRoZW4gd2Ugd2lsbCBnZXQgdG8gaW5maW5pdGUgcmVjdXJzaW9uLlxuICAgIGNvbnN0IHByb3h5Wm9uZSA9IFpvbmUuY3VycmVudC5nZXRab25lV2l0aCgnUHJveHlab25lU3BlYycpO1xuICAgIGNvbnN0IHByZXZpb3VzRGVsZWdhdGUgPSBwcm94eVpvbmVTcGVjLmdldERlbGVnYXRlKCk7XG4gICAgcHJveHlab25lIS5wYXJlbnQhLnJ1bigoKSA9PiB7XG4gICAgICBjb25zdCB0ZXN0Wm9uZVNwZWM6IFpvbmVTcGVjID0gbmV3IEFzeW5jVGVzdFpvbmVTcGVjKFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgem9uZS5cbiAgICAgICAgICAgIGlmIChwcm94eVpvbmVTcGVjLmdldERlbGVnYXRlKCkgPT0gdGVzdFpvbmVTcGVjKSB7XG4gICAgICAgICAgICAgIC8vIE9ubHkgcmVzZXQgdGhlIHpvbmUgc3BlYyBpZiBpdCdzXG4gICAgICAgICAgICAgIC8vIHNpbGwgdGhpcyBvbmUuIE90aGVyd2lzZSwgYXNzdW1lXG4gICAgICAgICAgICAgIC8vIGl0J3MgT0suXG4gICAgICAgICAgICAgIHByb3h5Wm9uZVNwZWMuc2V0RGVsZWdhdGUocHJldmlvdXNEZWxlZ2F0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAodGVzdFpvbmVTcGVjIGFzIGFueSkudW5QYXRjaFByb21pc2VGb3JUZXN0KCk7XG4gICAgICAgICAgICBjdXJyZW50Wm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICBmaW5pc2hDYWxsYmFjaygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoZXJyb3I6IGFueSkgPT4ge1xuICAgICAgICAgICAgLy8gTmVlZCB0byByZXN0b3JlIHRoZSBvcmlnaW5hbCB6b25lLlxuICAgICAgICAgICAgaWYgKHByb3h5Wm9uZVNwZWMuZ2V0RGVsZWdhdGUoKSA9PSB0ZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgICAgLy8gT25seSByZXNldCB0aGUgem9uZSBzcGVjIGlmIGl0J3Mgc2lsbCB0aGlzIG9uZS4gT3RoZXJ3aXNlLCBhc3N1bWUgaXQncyBPSy5cbiAgICAgICAgICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZShwcmV2aW91c0RlbGVnYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICh0ZXN0Wm9uZVNwZWMgYXMgYW55KS51blBhdGNoUHJvbWlzZUZvclRlc3QoKTtcbiAgICAgICAgICAgIGN1cnJlbnRab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgICAgIGZhaWxDYWxsYmFjayhlcnJvcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgICd0ZXN0Jyk7XG4gICAgICBwcm94eVpvbmVTcGVjLnNldERlbGVnYXRlKHRlc3Rab25lU3BlYyk7XG4gICAgICAodGVzdFpvbmVTcGVjIGFzIGFueSkucGF0Y2hQcm9taXNlRm9yVGVzdCgpO1xuICAgIH0pO1xuICAgIHJldHVybiBab25lLmN1cnJlbnQucnVuR3VhcmRlZChmbiwgY29udGV4dCk7XG4gIH1cbn0pOyJdfQ==