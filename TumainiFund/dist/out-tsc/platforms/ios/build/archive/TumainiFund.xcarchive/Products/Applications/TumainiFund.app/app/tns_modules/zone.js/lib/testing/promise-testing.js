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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvbWlzZS10ZXN0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi90ZXN0aW5nL3Byb21pc2UtdGVzdGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBa0JHO0FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxnQkFBZ0IsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDakYsSUFBTSxXQUFXLEdBQVcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNoRCxJQUFNLFVBQVUsR0FBUyxJQUFJLENBQUM7SUFDOUIsSUFBTSxzQkFBc0IsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFFOUQsbURBQW1EO0lBQ25ELGlEQUFpRDtJQUNqRCx1REFBdUQ7SUFDdkQsa0RBQWtEO0lBQ2xELDRCQUE0QjtJQUM1QixvREFBb0Q7SUFDcEQsZ0NBQWdDO0lBQy9CLE9BQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxTQUFTLG1CQUFtQjtRQUNoRixJQUFJLE9BQU8sR0FBSSxPQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUM7UUFDbkUsSUFBSSxPQUFPLEVBQUU7WUFDWCxPQUFPO1NBQ1I7UUFDRCxPQUFPLEdBQUksT0FBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDO1FBQ3hGLE9BQU8sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO1lBQ3ZCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQy9DLElBQUksSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLFVBQVUsRUFBRTtnQkFDcEMsZ0NBQWdDO2dCQUNoQyxJQUFNLGlCQUFpQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFDLENBQUM7Z0JBQ2hFLElBQUksaUJBQWlCLEVBQUU7b0JBQ3JCLGlCQUFpQixDQUFDLDZCQUE2QixFQUFFLENBQUM7b0JBQ2xELE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLElBQUksQ0FBQztpQkFDeEM7YUFDRjtZQUNELE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQztJQUNKLENBQUMsQ0FBQztJQUVELE9BQWUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLHVCQUF1QixDQUFDLENBQUMsR0FBRyxTQUFTLHFCQUFxQjtRQUNwRixzQkFBc0I7UUFDdEIsSUFBTSxPQUFPLEdBQUksT0FBZSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDO1FBQ3JFLElBQUksT0FBTyxFQUFFO1lBQ1gsT0FBTyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1lBQ2hDLE9BQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxTQUFTLENBQUM7U0FDbEU7SUFDSCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLyoqXG4gKiBQcm9taXNlIGZvciBhc3luYy9mYWtlQXN5bmMgem9uZVNwZWMgdGVzdFxuICogY2FuIHN1cHBvcnQgYXN5bmMgb3BlcmF0aW9uIHdoaWNoIG5vdCBzdXBwb3J0ZWQgYnkgem9uZS5qc1xuICogc3VjaCBhc1xuICogaXQgKCd0ZXN0IGpzb25wIGluIEFzeW5jWm9uZScsIGFzeW5jKCkgPT4ge1xuICogICBuZXcgUHJvbWlzZShyZXMgPT4ge1xuICogICAgIGpzb25wKHVybCwgKGRhdGEpID0+IHtcbiAqICAgICAgIC8vIHN1Y2Nlc3MgY2FsbGJhY2tcbiAqICAgICAgIHJlcyhkYXRhKTtcbiAqICAgICB9KTtcbiAqICAgfSkudGhlbigoanNvbnBSZXN1bHQpID0+IHtcbiAqICAgICAvLyBnZXQganNvbnAgcmVzdWx0LlxuICpcbiAqICAgICAvLyB1c2VyIHdpbGwgZXhwZWN0IEFzeW5jWm9uZVNwZWMgd2FpdCBmb3JcbiAqICAgICAvLyB0aGVuLCBidXQgYmVjYXVzZSBqc29ucCBpcyBub3Qgem9uZSBhd2FyZVxuICogICAgIC8vIEFzeW5jWm9uZSB3aWxsIGZpbmlzaCBiZWZvcmUgdGhlbiBpcyBjYWxsZWQuXG4gKiAgIH0pO1xuICogfSk7XG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdwcm9taXNlZm9ydGVzdCcsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IHN5bWJvbFN0YXRlOiBzdHJpbmcgPSBhcGkuc3ltYm9sKCdzdGF0ZScpO1xuICBjb25zdCBVTlJFU09MVkVEOiBudWxsID0gbnVsbDtcbiAgY29uc3Qgc3ltYm9sUGFyZW50VW5yZXNvbHZlZCA9IGFwaS5zeW1ib2woJ3BhcmVudFVucmVzb2x2ZWQnKTtcblxuICAvLyBwYXRjaCBQcm9taXNlLnByb3RvdHlwZS50aGVuIHRvIGtlZXAgYW4gaW50ZXJuYWxcbiAgLy8gbnVtYmVyIGZvciB0cmFja2luZyB1bnJlc29sdmVkIGNoYWluZWQgcHJvbWlzZVxuICAvLyB3ZSB3aWxsIGRlY3JlYXNlIHRoaXMgbnVtYmVyIHdoZW4gdGhlIHBhcmVudCBwcm9taXNlXG4gIC8vIGJlaW5nIHJlc29sdmVkL3JlamVjdGVkIGFuZCBjaGFpbmVkIHByb21pc2Ugd2FzXG4gIC8vIHNjaGVkdWxlZCBhcyBhIG1pY3JvVGFzay5cbiAgLy8gc28gd2UgY2FuIGtub3cgc3VjaCBraW5kIG9mIGNoYWluZWQgcHJvbWlzZSBzdGlsbFxuICAvLyBub3QgcmVzb2x2ZWQgaW4gQXN5bmNUZXN0Wm9uZVxuICAoUHJvbWlzZSBhcyBhbnkpW2FwaS5zeW1ib2woJ3BhdGNoUHJvbWlzZUZvclRlc3QnKV0gPSBmdW5jdGlvbiBwYXRjaFByb21pc2VGb3JUZXN0KCkge1xuICAgIGxldCBvcmlUaGVuID0gKFByb21pc2UgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ1pvbmVQcm9taXNlVGhlbicpXTtcbiAgICBpZiAob3JpVGhlbikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvcmlUaGVuID0gKFByb21pc2UgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ1pvbmVQcm9taXNlVGhlbicpXSA9IFByb21pc2UucHJvdG90eXBlLnRoZW47XG4gICAgUHJvbWlzZS5wcm90b3R5cGUudGhlbiA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgY2hhaW5lZCA9IG9yaVRoZW4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIGlmICh0aGlzW3N5bWJvbFN0YXRlXSA9PT0gVU5SRVNPTFZFRCkge1xuICAgICAgICAvLyBwYXJlbnQgcHJvbWlzZSBpcyB1bnJlc29sdmVkLlxuICAgICAgICBjb25zdCBhc3luY1Rlc3Rab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0FzeW5jVGVzdFpvbmVTcGVjJyk7XG4gICAgICAgIGlmIChhc3luY1Rlc3Rab25lU3BlYykge1xuICAgICAgICAgIGFzeW5jVGVzdFpvbmVTcGVjLnVucmVzb2x2ZWRDaGFpbmVkUHJvbWlzZUNvdW50Kys7XG4gICAgICAgICAgY2hhaW5lZFtzeW1ib2xQYXJlbnRVbnJlc29sdmVkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBjaGFpbmVkO1xuICAgIH07XG4gIH07XG5cbiAgKFByb21pc2UgYXMgYW55KVthcGkuc3ltYm9sKCd1blBhdGNoUHJvbWlzZUZvclRlc3QnKV0gPSBmdW5jdGlvbiB1bnBhdGNoUHJvbWlzZUZvclRlc3QoKSB7XG4gICAgLy8gcmVzdG9yZSBvcmlnaW4gdGhlblxuICAgIGNvbnN0IG9yaVRoZW4gPSAoUHJvbWlzZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnWm9uZVByb21pc2VUaGVuJyldO1xuICAgIGlmIChvcmlUaGVuKSB7XG4gICAgICBQcm9taXNlLnByb3RvdHlwZS50aGVuID0gb3JpVGhlbjtcbiAgICAgIChQcm9taXNlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdab25lUHJvbWlzZVRoZW4nKV0gPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9O1xufSk7Il19