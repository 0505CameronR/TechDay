/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Promise for async/fakeAsync zoneSpec test
 * can support async operation which not supported by zone.js
 * such as
 * it ('test jsonp in AsyncZone', async() => {
 *   new Promise(res => {
 *     jsonp(url, (data) => {
 *       // success callback
 *       res(data);
 *     });
 *   }).then((jsonpResult) => {
 *     // get jsonp result.
 *
 *     // user will expect AsyncZoneSpec wait for
 *     // then, but because jsonp is not zone aware
 *     // AsyncZone will finish before then is called.
 *   });
 * });
 */
Zone.__load_patch('promisefortest', function (global, Zone, api) {
    var symbolState = api.symbol('state');
    var UNRESOLVED = null;
    var symbolParentUnresolved = api.symbol('parentUnresolved');
    // patch Promise.prototype.then to keep an internal
    // number for tracking unresolved chained promise
    // we will decrease this number when the parent promise
    // being resolved/rejected and chained promise was
    // scheduled as a microTask.
    // so we can know such kind of chained promise still
    // not resolved in AsyncTestZone
    Promise[api.symbol('patchPromiseForTest')] = function patchPromiseForTest() {
        var oriThen = Promise[Zone.__symbol__('ZonePromiseThen')];
        if (oriThen) {
            return;
        }
        oriThen = Promise[Zone.__symbol__('ZonePromiseThen')] = Promise.prototype.then;
        Promise.prototype.then = function () {
            var chained = oriThen.apply(this, arguments);
            if (this[symbolState] === UNRESOLVED) {
                // parent promise is unresolved.
                var asyncTestZoneSpec = Zone.current.get('AsyncTestZoneSpec');
                if (asyncTestZoneSpec) {
                    asyncTestZoneSpec.unresolvedChainedPromiseCount++;
                    chained[symbolParentUnresolved] = true;
                }
            }
            return chained;
        };
    };
    Promise[api.symbol('unPatchPromiseForTest')] = function unpatchPromiseForTest() {
        // restore origin then
        var oriThen = Promise[Zone.__symbol__('ZonePromiseThen')];
        if (oriThen) {
            Promise.prototype.then = oriThen;
            Promise[Zone.__symbol__('ZonePromiseThen')] = undefined;
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS10ZXN0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvdGVzdGluZy9wcm9taXNlLXRlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWtCRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCO0lBQ2pGLElBQU0sV0FBVyxHQUFXLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDaEQsSUFBTSxVQUFVLEdBQVMsSUFBSSxDQUFDO0lBQzlCLElBQU0sc0JBQXNCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBRTlELG1EQUFtRDtJQUNuRCxpREFBaUQ7SUFDakQsdURBQXVEO0lBQ3ZELGtEQUFrRDtJQUNsRCw0QkFBNEI7SUFDNUIsb0RBQW9EO0lBQ3BELGdDQUFnQztJQUMvQixPQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLEdBQUcsU0FBUyxtQkFBbUI7UUFDaEYsSUFBSSxPQUFPLEdBQUksT0FBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ25FLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTztTQUNSO1FBQ0QsT0FBTyxHQUFJLE9BQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQztRQUN4RixPQUFPLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRztZQUN2QixJQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztZQUMvQyxJQUFJLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxVQUFVLEVBQUU7Z0JBQ3BDLGdDQUFnQztnQkFDaEMsSUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO2dCQUNoRSxJQUFJLGlCQUFpQixFQUFFO29CQUNyQixpQkFBaUIsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDO29CQUNsRCxPQUFPLENBQUMsc0JBQXNCLENBQUMsR0FBRyxJQUFJLENBQUM7aUJBQ3hDO2FBQ0Y7WUFDRCxPQUFPLE9BQU8sQ0FBQztRQUNqQixDQUFDLENBQUM7SUFDSixDQUFDLENBQUM7SUFFRCxPQUFlLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLEdBQUcsU0FBUyxxQkFBcUI7UUFDcEYsc0JBQXNCO1FBQ3RCLElBQU0sT0FBTyxHQUFJLE9BQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztRQUNyRSxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztZQUNoQyxPQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLEdBQUcsU0FBUyxDQUFDO1NBQ2xFO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogUHJvbWlzZSBmb3IgYXN5bmMvZmFrZUFzeW5jIHpvbmVTcGVjIHRlc3RcbiAqIGNhbiBzdXBwb3J0IGFzeW5jIG9wZXJhdGlvbiB3aGljaCBub3Qgc3VwcG9ydGVkIGJ5IHpvbmUuanNcbiAqIHN1Y2ggYXNcbiAqIGl0ICgndGVzdCBqc29ucCBpbiBBc3luY1pvbmUnLCBhc3luYygpID0+IHtcbiAqICAgbmV3IFByb21pc2UocmVzID0+IHtcbiAqICAgICBqc29ucCh1cmwsIChkYXRhKSA9PiB7XG4gKiAgICAgICAvLyBzdWNjZXNzIGNhbGxiYWNrXG4gKiAgICAgICByZXMoZGF0YSk7XG4gKiAgICAgfSk7XG4gKiAgIH0pLnRoZW4oKGpzb25wUmVzdWx0KSA9PiB7XG4gKiAgICAgLy8gZ2V0IGpzb25wIHJlc3VsdC5cbiAqXG4gKiAgICAgLy8gdXNlciB3aWxsIGV4cGVjdCBBc3luY1pvbmVTcGVjIHdhaXQgZm9yXG4gKiAgICAgLy8gdGhlbiwgYnV0IGJlY2F1c2UganNvbnAgaXMgbm90IHpvbmUgYXdhcmVcbiAqICAgICAvLyBBc3luY1pvbmUgd2lsbCBmaW5pc2ggYmVmb3JlIHRoZW4gaXMgY2FsbGVkLlxuICogICB9KTtcbiAqIH0pO1xuICovXG5ab25lLl9fbG9hZF9wYXRjaCgncHJvbWlzZWZvcnRlc3QnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBjb25zdCBzeW1ib2xTdGF0ZTogc3RyaW5nID0gYXBpLnN5bWJvbCgnc3RhdGUnKTtcbiAgY29uc3QgVU5SRVNPTFZFRDogbnVsbCA9IG51bGw7XG4gIGNvbnN0IHN5bWJvbFBhcmVudFVucmVzb2x2ZWQgPSBhcGkuc3ltYm9sKCdwYXJlbnRVbnJlc29sdmVkJyk7XG5cbiAgLy8gcGF0Y2ggUHJvbWlzZS5wcm90b3R5cGUudGhlbiB0byBrZWVwIGFuIGludGVybmFsXG4gIC8vIG51bWJlciBmb3IgdHJhY2tpbmcgdW5yZXNvbHZlZCBjaGFpbmVkIHByb21pc2VcbiAgLy8gd2Ugd2lsbCBkZWNyZWFzZSB0aGlzIG51bWJlciB3aGVuIHRoZSBwYXJlbnQgcHJvbWlzZVxuICAvLyBiZWluZyByZXNvbHZlZC9yZWplY3RlZCBhbmQgY2hhaW5lZCBwcm9taXNlIHdhc1xuICAvLyBzY2hlZHVsZWQgYXMgYSBtaWNyb1Rhc2suXG4gIC8vIHNvIHdlIGNhbiBrbm93IHN1Y2gga2luZCBvZiBjaGFpbmVkIHByb21pc2Ugc3RpbGxcbiAgLy8gbm90IHJlc29sdmVkIGluIEFzeW5jVGVzdFpvbmVcbiAgKFByb21pc2UgYXMgYW55KVthcGkuc3ltYm9sKCdwYXRjaFByb21pc2VGb3JUZXN0JyldID0gZnVuY3Rpb24gcGF0Y2hQcm9taXNlRm9yVGVzdCgpIHtcbiAgICBsZXQgb3JpVGhlbiA9IChQcm9taXNlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdab25lUHJvbWlzZVRoZW4nKV07XG4gICAgaWYgKG9yaVRoZW4pIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb3JpVGhlbiA9IChQcm9taXNlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdab25lUHJvbWlzZVRoZW4nKV0gPSBQcm9taXNlLnByb3RvdHlwZS50aGVuO1xuICAgIFByb21pc2UucHJvdG90eXBlLnRoZW4gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IGNoYWluZWQgPSBvcmlUaGVuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICBpZiAodGhpc1tzeW1ib2xTdGF0ZV0gPT09IFVOUkVTT0xWRUQpIHtcbiAgICAgICAgLy8gcGFyZW50IHByb21pc2UgaXMgdW5yZXNvbHZlZC5cbiAgICAgICAgY29uc3QgYXN5bmNUZXN0Wm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgICBpZiAoYXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICBhc3luY1Rlc3Rab25lU3BlYy51bnJlc29sdmVkQ2hhaW5lZFByb21pc2VDb3VudCsrO1xuICAgICAgICAgIGNoYWluZWRbc3ltYm9sUGFyZW50VW5yZXNvbHZlZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gY2hhaW5lZDtcbiAgICB9O1xuICB9O1xuXG4gIChQcm9taXNlIGFzIGFueSlbYXBpLnN5bWJvbCgndW5QYXRjaFByb21pc2VGb3JUZXN0JyldID0gZnVuY3Rpb24gdW5wYXRjaFByb21pc2VGb3JUZXN0KCkge1xuICAgIC8vIHJlc3RvcmUgb3JpZ2luIHRoZW5cbiAgICBjb25zdCBvcmlUaGVuID0gKFByb21pc2UgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ1pvbmVQcm9taXNlVGhlbicpXTtcbiAgICBpZiAob3JpVGhlbikge1xuICAgICAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IG9yaVRoZW47XG4gICAgICAoUHJvbWlzZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnWm9uZVByb21pc2VUaGVuJyldID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfTtcbn0pOyJdfQ==