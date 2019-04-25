/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import '../zone-spec/async-test';
Zone.__load_patch('asynctest', (global, Zone, api) => {
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
                runInTestZone(fn, this, done, (err) => {
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
            return new Promise((finishCallback, failCallback) => {
                runInTestZone(fn, this, finishCallback, failCallback);
            });
        };
    };
    function runInTestZone(fn, context, finishCallback, failCallback) {
        const currentZone = Zone.current;
        const AsyncTestZoneSpec = Zone['AsyncTestZoneSpec'];
        if (AsyncTestZoneSpec === undefined) {
            throw new Error('AsyncTestZoneSpec is needed for the async() test helper but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/async-test.js');
        }
        const ProxyZoneSpec = Zone['ProxyZoneSpec'];
        if (ProxyZoneSpec === undefined) {
            throw new Error('ProxyZoneSpec is needed for the async() test helper but could not be found. ' +
                'Please make sure that your environment includes zone.js/dist/proxy.js');
        }
        const proxyZoneSpec = ProxyZoneSpec.get();
        ProxyZoneSpec.assertPresent();
        // We need to create the AsyncTestZoneSpec outside the ProxyZone.
        // If we do it in ProxyZone then we will get to infinite recursion.
        const proxyZone = Zone.current.getZoneWith('ProxyZoneSpec');
        const previousDelegate = proxyZoneSpec.getDelegate();
        proxyZone.parent.run(() => {
            const testZoneSpec = new AsyncTestZoneSpec(() => {
                // Need to restore the original zone.
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's
                    // sill this one. Otherwise, assume
                    // it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                testZoneSpec.unPatchPromiseForTest();
                currentZone.run(() => {
                    finishCallback();
                });
            }, (error) => {
                // Need to restore the original zone.
                if (proxyZoneSpec.getDelegate() == testZoneSpec) {
                    // Only reset the zone spec if it's sill this one. Otherwise, assume it's OK.
                    proxyZoneSpec.setDelegate(previousDelegate);
                }
                testZoneSpec.unPatchPromiseForTest();
                currentZone.run(() => {
                    failCallback(error);
                });
            }, 'test');
            proxyZoneSpec.setDelegate(testZoneSpec);
            testZoneSpec.patchPromiseForTest();
        });
        return Zone.current.runGuarded(fn, context);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXN5bmMtdGVzdGluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL3Rlc3RpbmcvYXN5bmMtdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLHlCQUF5QixDQUFDO0FBRWpDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLENBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQixFQUFFLEVBQUU7SUFDaEY7OztPQUdHO0lBQ0YsSUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsR0FBRyxTQUFTLFNBQVMsQ0FBQyxFQUFZO1FBQ3RFLDhFQUE4RTtRQUM5RSxtREFBbUQ7UUFDbkQsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO1lBQ2xCLHdFQUF3RTtZQUN4RSxPQUFPLFVBQVMsSUFBUztnQkFDdkIsSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDVCxxRkFBcUY7b0JBQ3JGLGdDQUFnQztvQkFDaEMsSUFBSSxHQUFHLGNBQVksQ0FBQyxDQUFDO29CQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLFVBQVMsQ0FBTTt3QkFDekIsTUFBTSxDQUFDLENBQUM7b0JBQ1YsQ0FBQyxDQUFDO2lCQUNIO2dCQUNELGFBQWEsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLEdBQVEsRUFBRSxFQUFFO29CQUN6QyxJQUFJLE9BQU8sR0FBRyxLQUFLLFFBQVEsRUFBRTt3QkFDM0IsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxDQUFTLEdBQUcs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QUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICcuLi96b25lLXNwZWMvYXN5bmMtdGVzdCc7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdhc3luY3Rlc3QnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICAvKipcbiAgICogV3JhcHMgYSB0ZXN0IGZ1bmN0aW9uIGluIGFuIGFzeW5jaHJvbm91cyB0ZXN0IHpvbmUuIFRoZSB0ZXN0IHdpbGwgYXV0b21hdGljYWxseVxuICAgKiBjb21wbGV0ZSB3aGVuIGFsbCBhc3luY2hyb25vdXMgY2FsbHMgd2l0aGluIHRoaXMgem9uZSBhcmUgZG9uZS5cbiAgICovXG4gIChab25lIGFzIGFueSlbYXBpLnN5bWJvbCgnYXN5bmNUZXN0JyldID0gZnVuY3Rpb24gYXN5bmNUZXN0KGZuOiBGdW5jdGlvbik6IChkb25lOiBhbnkpID0+IGFueSB7XG4gICAgLy8gSWYgd2UncmUgcnVubmluZyB1c2luZyB0aGUgSmFzbWluZSB0ZXN0IGZyYW1ld29yaywgYWRhcHQgdG8gY2FsbCB0aGUgJ2RvbmUnXG4gICAgLy8gZnVuY3Rpb24gd2hlbiBhc3luY2hyb25vdXMgYWN0aXZpdHkgaXMgZmluaXNoZWQuXG4gICAgaWYgKGdsb2JhbC5qYXNtaW5lKSB7XG4gICAgICAvLyBOb3QgdXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gdG8gcHJlc2VydmUgY29udGV4dCBwYXNzZWQgZnJvbSBjYWxsIHNpdGVcbiAgICAgIHJldHVybiBmdW5jdGlvbihkb25lOiBhbnkpIHtcbiAgICAgICAgaWYgKCFkb25lKSB7XG4gICAgICAgICAgLy8gaWYgd2UgcnVuIGJlZm9yZUVhY2ggaW4gQGFuZ3VsYXIvY29yZS90ZXN0aW5nL3Rlc3RpbmdfaW50ZXJuYWwgdGhlbiB3ZSBnZXQgbm8gZG9uZVxuICAgICAgICAgIC8vIGZha2UgaXQgaGVyZSBhbmQgYXNzdW1lIHN5bmMuXG4gICAgICAgICAgZG9uZSA9IGZ1bmN0aW9uKCkge307XG4gICAgICAgICAgZG9uZS5mYWlsID0gZnVuY3Rpb24oZTogYW55KSB7XG4gICAgICAgICAgICB0aHJvdyBlO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcnVuSW5UZXN0Wm9uZShmbiwgdGhpcywgZG9uZSwgKGVycjogYW55KSA9PiB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBlcnIgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICByZXR1cm4gZG9uZS5mYWlsKG5ldyBFcnJvcig8c3RyaW5nPmVycikpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb25lLmZhaWwoZXJyKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfTtcbiAgICB9XG4gICAgLy8gT3RoZXJ3aXNlLCByZXR1cm4gYSBwcm9taXNlIHdoaWNoIHdpbGwgcmVzb2x2ZSB3aGVuIGFzeW5jaHJvbm91cyBhY3Rpdml0eVxuICAgIC8vIGlzIGZpbmlzaGVkLiBUaGlzIHdpbGwgYmUgY29ycmVjdGx5IGNvbnN1bWVkIGJ5IHRoZSBNb2NoYSBmcmFtZXdvcmsgd2l0aFxuICAgIC8vIGl0KCcuLi4nLCBhc3luYyhteUZuKSk7IG9yIGNhbiBiZSB1c2VkIGluIGEgY3VzdG9tIGZyYW1ld29yay5cbiAgICAvLyBOb3QgdXNpbmcgYW4gYXJyb3cgZnVuY3Rpb24gdG8gcHJlc2VydmUgY29udGV4dCBwYXNzZWQgZnJvbSBjYWxsIHNpdGVcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKGZpbmlzaENhbGxiYWNrLCBmYWlsQ2FsbGJhY2spID0+IHtcbiAgICAgICAgcnVuSW5UZXN0Wm9uZShmbiwgdGhpcywgZmluaXNoQ2FsbGJhY2ssIGZhaWxDYWxsYmFjayk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9O1xuXG4gIGZ1bmN0aW9uIHJ1bkluVGVzdFpvbmUoXG4gICAgICBmbjogRnVuY3Rpb24sIGNvbnRleHQ6IGFueSwgZmluaXNoQ2FsbGJhY2s6IEZ1bmN0aW9uLCBmYWlsQ2FsbGJhY2s6IEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgY3VycmVudFpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgY29uc3QgQXN5bmNUZXN0Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydBc3luY1Rlc3Rab25lU3BlYyddO1xuICAgIGlmIChBc3luY1Rlc3Rab25lU3BlYyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXG4gICAgICAgICAgJ0FzeW5jVGVzdFpvbmVTcGVjIGlzIG5lZWRlZCBmb3IgdGhlIGFzeW5jKCkgdGVzdCBoZWxwZXIgYnV0IGNvdWxkIG5vdCBiZSBmb3VuZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSBtYWtlIHN1cmUgdGhhdCB5b3VyIGVudmlyb25tZW50IGluY2x1ZGVzIHpvbmUuanMvZGlzdC9hc3luYy10ZXN0LmpzJyk7XG4gICAgfVxuICAgIGNvbnN0IFByb3h5Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydQcm94eVpvbmVTcGVjJ10gYXMge1xuICAgICAgZ2V0KCk6IHtzZXREZWxlZ2F0ZShzcGVjOiBab25lU3BlYyk6IHZvaWQ7IGdldERlbGVnYXRlKCk6IFpvbmVTcGVjO307XG4gICAgICBhc3NlcnRQcmVzZW50OiAoKSA9PiB2b2lkO1xuICAgIH07XG4gICAgaWYgKFByb3h5Wm9uZVNwZWMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgICdQcm94eVpvbmVTcGVjIGlzIG5lZWRlZCBmb3IgdGhlIGFzeW5jKCkgdGVzdCBoZWxwZXIgYnV0IGNvdWxkIG5vdCBiZSBmb3VuZC4gJyArXG4gICAgICAgICAgJ1BsZWFzZSBtYWtlIHN1cmUgdGhhdCB5b3VyIGVudmlyb25tZW50IGluY2x1ZGVzIHpvbmUuanMvZGlzdC9wcm94eS5qcycpO1xuICAgIH1cbiAgICBjb25zdCBwcm94eVpvbmVTcGVjID0gUHJveHlab25lU3BlYy5nZXQoKTtcbiAgICBQcm94eVpvbmVTcGVjLmFzc2VydFByZXNlbnQoKTtcbiAgICAvLyBXZSBuZWVkIHRvIGNyZWF0ZSB0aGUgQXN5bmNUZXN0Wm9uZVNwZWMgb3V0c2lkZSB0aGUgUHJveHlab25lLlxuICAgIC8vIElmIHdlIGRvIGl0IGluIFByb3h5Wm9uZSB0aGVuIHdlIHdpbGwgZ2V0IHRvIGluZmluaXRlIHJlY3Vyc2lvbi5cbiAgICBjb25zdCBwcm94eVpvbmUgPSBab25lLmN1cnJlbnQuZ2V0Wm9uZVdpdGgoJ1Byb3h5Wm9uZVNwZWMnKTtcbiAgICBjb25zdCBwcmV2aW91c0RlbGVnYXRlID0gcHJveHlab25lU3BlYy5nZXREZWxlZ2F0ZSgpO1xuICAgIHByb3h5Wm9uZSEucGFyZW50IS5ydW4oKCkgPT4ge1xuICAgICAgY29uc3QgdGVzdFpvbmVTcGVjOiBab25lU3BlYyA9IG5ldyBBc3luY1Rlc3Rab25lU3BlYyhcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAvLyBOZWVkIHRvIHJlc3RvcmUgdGhlIG9yaWdpbmFsIHpvbmUuXG4gICAgICAgICAgICBpZiAocHJveHlab25lU3BlYy5nZXREZWxlZ2F0ZSgpID09IHRlc3Rab25lU3BlYykge1xuICAgICAgICAgICAgICAvLyBPbmx5IHJlc2V0IHRoZSB6b25lIHNwZWMgaWYgaXQnc1xuICAgICAgICAgICAgICAvLyBzaWxsIHRoaXMgb25lLiBPdGhlcndpc2UsIGFzc3VtZVxuICAgICAgICAgICAgICAvLyBpdCdzIE9LLlxuICAgICAgICAgICAgICBwcm94eVpvbmVTcGVjLnNldERlbGVnYXRlKHByZXZpb3VzRGVsZWdhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgKHRlc3Rab25lU3BlYyBhcyBhbnkpLnVuUGF0Y2hQcm9taXNlRm9yVGVzdCgpO1xuICAgICAgICAgICAgY3VycmVudFpvbmUucnVuKCgpID0+IHtcbiAgICAgICAgICAgICAgZmluaXNoQ2FsbGJhY2soKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKGVycm9yOiBhbnkpID0+IHtcbiAgICAgICAgICAgIC8vIE5lZWQgdG8gcmVzdG9yZSB0aGUgb3JpZ2luYWwgem9uZS5cbiAgICAgICAgICAgIGlmIChwcm94eVpvbmVTcGVjLmdldERlbGVnYXRlKCkgPT0gdGVzdFpvbmVTcGVjKSB7XG4gICAgICAgICAgICAgIC8vIE9ubHkgcmVzZXQgdGhlIHpvbmUgc3BlYyBpZiBpdCdzIHNpbGwgdGhpcyBvbmUuIE90aGVyd2lzZSwgYXNzdW1lIGl0J3MgT0suXG4gICAgICAgICAgICAgIHByb3h5Wm9uZVNwZWMuc2V0RGVsZWdhdGUocHJldmlvdXNEZWxlZ2F0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAodGVzdFpvbmVTcGVjIGFzIGFueSkudW5QYXRjaFByb21pc2VGb3JUZXN0KCk7XG4gICAgICAgICAgICBjdXJyZW50Wm9uZS5ydW4oKCkgPT4ge1xuICAgICAgICAgICAgICBmYWlsQ2FsbGJhY2soZXJyb3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAndGVzdCcpO1xuICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZSh0ZXN0Wm9uZVNwZWMpO1xuICAgICAgKHRlc3Rab25lU3BlYyBhcyBhbnkpLnBhdGNoUHJvbWlzZUZvclRlc3QoKTtcbiAgICB9KTtcbiAgICByZXR1cm4gWm9uZS5jdXJyZW50LnJ1bkd1YXJkZWQoZm4sIGNvbnRleHQpO1xuICB9XG59KTsiXX0=