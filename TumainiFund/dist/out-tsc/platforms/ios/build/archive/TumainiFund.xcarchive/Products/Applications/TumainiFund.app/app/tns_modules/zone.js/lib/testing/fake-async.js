"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
require("../zone-spec/fake-async-test");
Zone.__load_patch('fakeasync', function (global, Zone, api) {
    var FakeAsyncTestZoneSpec = Zone && Zone['FakeAsyncTestZoneSpec'];
    var ProxyZoneSpec = Zone && Zone['ProxyZoneSpec'];
    var _fakeAsyncTestZoneSpec = null;
    /**
     * Clears out the shared fake async zone for a test.
     * To be called in a global `beforeEach`.
     *
     * @experimental
     */
    function resetFakeAsyncZone() {
        if (_fakeAsyncTestZoneSpec) {
            _fakeAsyncTestZoneSpec.unlockDatePatch();
        }
        _fakeAsyncTestZoneSpec = null;
        // in node.js testing we may not have ProxyZoneSpec in which case there is nothing to reset.
        ProxyZoneSpec && ProxyZoneSpec.assertPresent().resetDelegate();
    }
    /**
     * Wraps a function to be executed in the fakeAsync zone:
     * - microtasks are manually executed by calling `flushMicrotasks()`,
     * - timers are synchronous, `tick()` simulates the asynchronous passage of time.
     *
     * If there are any pending timers at the end of the function, an exception will be thrown.
     *
     * Can be used to wrap inject() calls.
     *
     * ## Example
     *
     * {@example core/testing/ts/fake_async.ts region='basic'}
     *
     * @param fn
     * @returns The function wrapped to be executed in the fakeAsync zone
     *
     * @experimental
     */
    function fakeAsync(fn) {
        // Not using an arrow function to preserve context passed from call site
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var proxyZoneSpec = ProxyZoneSpec.assertPresent();
            if (Zone.current.get('FakeAsyncTestZoneSpec')) {
                throw new Error('fakeAsync() calls can not be nested');
            }
            try {
                // in case jasmine.clock init a fakeAsyncTestZoneSpec
                if (!_fakeAsyncTestZoneSpec) {
                    if (proxyZoneSpec.getDelegate() instanceof FakeAsyncTestZoneSpec) {
                        throw new Error('fakeAsync() calls can not be nested');
                    }
                    _fakeAsyncTestZoneSpec = new FakeAsyncTestZoneSpec();
                }
                var res = void 0;
                var lastProxyZoneSpec = proxyZoneSpec.getDelegate();
                proxyZoneSpec.setDelegate(_fakeAsyncTestZoneSpec);
                _fakeAsyncTestZoneSpec.lockDatePatch();
                try {
                    res = fn.apply(this, args);
                    flushMicrotasks();
                }
                finally {
                    proxyZoneSpec.setDelegate(lastProxyZoneSpec);
                }
                if (_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length > 0) {
                    throw new Error(_fakeAsyncTestZoneSpec.pendingPeriodicTimers.length + " " +
                        "periodic timer(s) still in the queue.");
                }
                if (_fakeAsyncTestZoneSpec.pendingTimers.length > 0) {
                    throw new Error(_fakeAsyncTestZoneSpec.pendingTimers.length + " timer(s) still in the queue.");
                }
                return res;
            }
            finally {
                resetFakeAsyncZone();
            }
        };
    }
    function _getFakeAsyncZoneSpec() {
        if (_fakeAsyncTestZoneSpec == null) {
            _fakeAsyncTestZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
            if (_fakeAsyncTestZoneSpec == null) {
                throw new Error('The code should be running in the fakeAsync zone to call this function');
            }
        }
        return _fakeAsyncTestZoneSpec;
    }
    /**
     * Simulates the asynchronous passage of time for the timers in the fakeAsync zone.
     *
     * The microtasks queue is drained at the very start of this function and after any timer callback
     * has been executed.
     *
     * ## Example
     *
     * {@example core/testing/ts/fake_async.ts region='basic'}
     *
     * @experimental
     */
    function tick(millis) {
        if (millis === void 0) { millis = 0; }
        _getFakeAsyncZoneSpec().tick(millis);
    }
    /**
     * Simulates the asynchronous passage of time for the timers in the fakeAsync zone by
     * draining the macrotask queue until it is empty. The returned value is the milliseconds
     * of time that would have been elapsed.
     *
     * @param maxTurns
     * @returns The simulated time elapsed, in millis.
     *
     * @experimental
     */
    function flush(maxTurns) {
        return _getFakeAsyncZoneSpec().flush(maxTurns);
    }
    /**
     * Discard all remaining periodic tasks.
     *
     * @experimental
     */
    function discardPeriodicTasks() {
        var zoneSpec = _getFakeAsyncZoneSpec();
        var pendingTimers = zoneSpec.pendingPeriodicTimers;
        zoneSpec.pendingPeriodicTimers.length = 0;
    }
    /**
     * Flush any pending microtasks.
     *
     * @experimental
     */
    function flushMicrotasks() {
        _getFakeAsyncZoneSpec().flushMicrotasks();
    }
    Zone[api.symbol('fakeAsyncTest')] =
        { resetFakeAsyncZone: resetFakeAsyncZone, flushMicrotasks: flushMicrotasks, discardPeriodicTasks: discardPeriodicTasks, tick: tick, flush: flush, fakeAsync: fakeAsync };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFrZS1hc3luYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvdGVzdGluZy9mYWtlLWFzeW5jLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsd0NBQXNDO0FBRXRDLElBQUksQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUM1RSxJQUFNLHFCQUFxQixHQUFHLElBQUksSUFBSyxJQUFZLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUk3RSxJQUFNLGFBQWEsR0FDZixJQUFJLElBQUssSUFBWSxDQUFDLGVBQWUsQ0FBQyxDQUFDO0lBRTNDLElBQUksc0JBQXNCLEdBQVEsSUFBSSxDQUFDO0lBRXZDOzs7OztPQUtHO0lBQ0gsU0FBUyxrQkFBa0I7UUFDekIsSUFBSSxzQkFBc0IsRUFBRTtZQUMxQixzQkFBc0IsQ0FBQyxlQUFlLEVBQUUsQ0FBQztTQUMxQztRQUNELHNCQUFzQixHQUFHLElBQUksQ0FBQztRQUM5Qiw0RkFBNEY7UUFDNUYsYUFBYSxJQUFJLGFBQWEsQ0FBQyxhQUFhLEVBQUUsQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUNqRSxDQUFDO0lBRUQ7Ozs7Ozs7Ozs7Ozs7Ozs7O09BaUJHO0lBQ0gsU0FBUyxTQUFTLENBQUMsRUFBWTtRQUM3Qix3RUFBd0U7UUFDeEUsT0FBTztZQUFTLGNBQWM7aUJBQWQsVUFBYyxFQUFkLHFCQUFjLEVBQWQsSUFBYztnQkFBZCx5QkFBYzs7WUFDNUIsSUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3BE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QUEsRUFBRSxJQUFJLE1BQUEsRUFBRSxLQUFLLE9BQUEsRUFBRSxTQUFTLFdBQUEsRUFBQyxDQUFDO0FBQzFGLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0ICcuLi96b25lLXNwZWMvZmFrZS1hc3luYy10ZXN0JztcblxuWm9uZS5fX2xvYWRfcGF0Y2goJ2Zha2Vhc3luYycsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IEZha2VBc3luY1Rlc3Rab25lU3BlYyA9IFpvbmUgJiYgKFpvbmUgYXMgYW55KVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ107XG4gIHR5cGUgUHJveHlab25lU3BlYyA9IHtcbiAgICBzZXREZWxlZ2F0ZShkZWxlZ2F0ZVNwZWM6IFpvbmVTcGVjKTogdm9pZDsgZ2V0RGVsZWdhdGUoKTogWm9uZVNwZWM7IHJlc2V0RGVsZWdhdGUoKTogdm9pZDtcbiAgfTtcbiAgY29uc3QgUHJveHlab25lU3BlYzoge2dldCgpOiBQcm94eVpvbmVTcGVjOyBhc3NlcnRQcmVzZW50OiAoKSA9PiBQcm94eVpvbmVTcGVjfSA9XG4gICAgICBab25lICYmIChab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXTtcblxuICBsZXQgX2Zha2VBc3luY1Rlc3Rab25lU3BlYzogYW55ID0gbnVsbDtcblxuICAvKipcbiAgICogQ2xlYXJzIG91dCB0aGUgc2hhcmVkIGZha2UgYXN5bmMgem9uZSBmb3IgYSB0ZXN0LlxuICAgKiBUbyBiZSBjYWxsZWQgaW4gYSBnbG9iYWwgYGJlZm9yZUVhY2hgLlxuICAgKlxuICAgKiBAZXhwZXJpbWVudGFsXG4gICAqL1xuICBmdW5jdGlvbiByZXNldEZha2VBc3luY1pvbmUoKSB7XG4gICAgaWYgKF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgIF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWMudW5sb2NrRGF0ZVBhdGNoKCk7XG4gICAgfVxuICAgIF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSBudWxsO1xuICAgIC8vIGluIG5vZGUuanMgdGVzdGluZyB3ZSBtYXkgbm90IGhhdmUgUHJveHlab25lU3BlYyBpbiB3aGljaCBjYXNlIHRoZXJlIGlzIG5vdGhpbmcgdG8gcmVzZXQuXG4gICAgUHJveHlab25lU3BlYyAmJiBQcm94eVpvbmVTcGVjLmFzc2VydFByZXNlbnQoKS5yZXNldERlbGVnYXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogV3JhcHMgYSBmdW5jdGlvbiB0byBiZSBleGVjdXRlZCBpbiB0aGUgZmFrZUFzeW5jIHpvbmU6XG4gICAqIC0gbWljcm90YXNrcyBhcmUgbWFudWFsbHkgZXhlY3V0ZWQgYnkgY2FsbGluZyBgZmx1c2hNaWNyb3Rhc2tzKClgLFxuICAgKiAtIHRpbWVycyBhcmUgc3luY2hyb25vdXMsIGB0aWNrKClgIHNpbXVsYXRlcyB0aGUgYXN5bmNocm9ub3VzIHBhc3NhZ2Ugb2YgdGltZS5cbiAgICpcbiAgICogSWYgdGhlcmUgYXJlIGFueSBwZW5kaW5nIHRpbWVycyBhdCB0aGUgZW5kIG9mIHRoZSBmdW5jdGlvbiwgYW4gZXhjZXB0aW9uIHdpbGwgYmUgdGhyb3duLlxuICAgKlxuICAgKiBDYW4gYmUgdXNlZCB0byB3cmFwIGluamVjdCgpIGNhbGxzLlxuICAgKlxuICAgKiAjIyBFeGFtcGxlXG4gICAqXG4gICAqIHtAZXhhbXBsZSBjb3JlL3Rlc3RpbmcvdHMvZmFrZV9hc3luYy50cyByZWdpb249J2Jhc2ljJ31cbiAgICpcbiAgICogQHBhcmFtIGZuXG4gICAqIEByZXR1cm5zIFRoZSBmdW5jdGlvbiB3cmFwcGVkIHRvIGJlIGV4ZWN1dGVkIGluIHRoZSBmYWtlQXN5bmMgem9uZVxuICAgKlxuICAgKiBAZXhwZXJpbWVudGFsXG4gICAqL1xuICBmdW5jdGlvbiBmYWtlQXN5bmMoZm46IEZ1bmN0aW9uKTogKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnkge1xuICAgIC8vIE5vdCB1c2luZyBhbiBhcnJvdyBmdW5jdGlvbiB0byBwcmVzZXJ2ZSBjb250ZXh0IHBhc3NlZCBmcm9tIGNhbGwgc2l0ZVxuICAgIHJldHVybiBmdW5jdGlvbiguLi5hcmdzOiBhbnlbXSkge1xuICAgICAgY29uc3QgcHJveHlab25lU3BlYyA9IFByb3h5Wm9uZVNwZWMuYXNzZXJ0UHJlc2VudCgpO1xuICAgICAgaWYgKFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignZmFrZUFzeW5jKCkgY2FsbHMgY2FuIG5vdCBiZSBuZXN0ZWQnKTtcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIGluIGNhc2UgamFzbWluZS5jbG9jayBpbml0IGEgZmFrZUFzeW5jVGVzdFpvbmVTcGVjXG4gICAgICAgIGlmICghX2Zha2VBc3luY1Rlc3Rab25lU3BlYykge1xuICAgICAgICAgIGlmIChwcm94eVpvbmVTcGVjLmdldERlbGVnYXRlKCkgaW5zdGFuY2VvZiBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignZmFrZUFzeW5jKCkgY2FsbHMgY2FuIG5vdCBiZSBuZXN0ZWQnKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBfZmFrZUFzeW5jVGVzdFpvbmVTcGVjID0gbmV3IEZha2VBc3luY1Rlc3Rab25lU3BlYygpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IHJlczogYW55O1xuICAgICAgICBjb25zdCBsYXN0UHJveHlab25lU3BlYyA9IHByb3h5Wm9uZVNwZWMuZ2V0RGVsZWdhdGUoKTtcbiAgICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZShfZmFrZUFzeW5jVGVzdFpvbmVTcGVjKTtcbiAgICAgICAgX2Zha2VBc3luY1Rlc3Rab25lU3BlYy5sb2NrRGF0ZVBhdGNoKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgcmVzID0gZm4uYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgICAgZmx1c2hNaWNyb3Rhc2tzKCk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgcHJveHlab25lU3BlYy5zZXREZWxlZ2F0ZShsYXN0UHJveHlab25lU3BlYyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoX2Zha2VBc3luY1Rlc3Rab25lU3BlYy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYCR7X2Zha2VBc3luY1Rlc3Rab25lU3BlYy5wZW5kaW5nUGVyaW9kaWNUaW1lcnMubGVuZ3RofSBgICtcbiAgICAgICAgICAgICAgYHBlcmlvZGljIHRpbWVyKHMpIHN0aWxsIGluIHRoZSBxdWV1ZS5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChfZmFrZUFzeW5jVGVzdFpvbmVTcGVjLnBlbmRpbmdUaW1lcnMubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgYCR7X2Zha2VBc3luY1Rlc3Rab25lU3BlYy5wZW5kaW5nVGltZXJzLmxlbmd0aH0gdGltZXIocykgc3RpbGwgaW4gdGhlIHF1ZXVlLmApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICByZXNldEZha2VBc3luY1pvbmUoKTtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gX2dldEZha2VBc3luY1pvbmVTcGVjKCk6IGFueSB7XG4gICAgaWYgKF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPT0gbnVsbCkge1xuICAgICAgX2Zha2VBc3luY1Rlc3Rab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgaWYgKF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPT0gbnVsbCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoZSBjb2RlIHNob3VsZCBiZSBydW5uaW5nIGluIHRoZSBmYWtlQXN5bmMgem9uZSB0byBjYWxsIHRoaXMgZnVuY3Rpb24nKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIF9mYWtlQXN5bmNUZXN0Wm9uZVNwZWM7XG4gIH1cblxuICAvKipcbiAgICogU2ltdWxhdGVzIHRoZSBhc3luY2hyb25vdXMgcGFzc2FnZSBvZiB0aW1lIGZvciB0aGUgdGltZXJzIGluIHRoZSBmYWtlQXN5bmMgem9uZS5cbiAgICpcbiAgICogVGhlIG1pY3JvdGFza3MgcXVldWUgaXMgZHJhaW5lZCBhdCB0aGUgdmVyeSBzdGFydCBvZiB0aGlzIGZ1bmN0aW9uIGFuZCBhZnRlciBhbnkgdGltZXIgY2FsbGJhY2tcbiAgICogaGFzIGJlZW4gZXhlY3V0ZWQuXG4gICAqXG4gICAqICMjIEV4YW1wbGVcbiAgICpcbiAgICoge0BleGFtcGxlIGNvcmUvdGVzdGluZy90cy9mYWtlX2FzeW5jLnRzIHJlZ2lvbj0nYmFzaWMnfVxuICAgKlxuICAgKiBAZXhwZXJpbWVudGFsXG4gICAqL1xuICBmdW5jdGlvbiB0aWNrKG1pbGxpczogbnVtYmVyID0gMCk6IHZvaWQge1xuICAgIF9nZXRGYWtlQXN5bmNab25lU3BlYygpLnRpY2sobWlsbGlzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaW11bGF0ZXMgdGhlIGFzeW5jaHJvbm91cyBwYXNzYWdlIG9mIHRpbWUgZm9yIHRoZSB0aW1lcnMgaW4gdGhlIGZha2VBc3luYyB6b25lIGJ5XG4gICAqIGRyYWluaW5nIHRoZSBtYWNyb3Rhc2sgcXVldWUgdW50aWwgaXQgaXMgZW1wdHkuIFRoZSByZXR1cm5lZCB2YWx1ZSBpcyB0aGUgbWlsbGlzZWNvbmRzXG4gICAqIG9mIHRpbWUgdGhhdCB3b3VsZCBoYXZlIGJlZW4gZWxhcHNlZC5cbiAgICpcbiAgICogQHBhcmFtIG1heFR1cm5zXG4gICAqIEByZXR1cm5zIFRoZSBzaW11bGF0ZWQgdGltZSBlbGFwc2VkLCBpbiBtaWxsaXMuXG4gICAqXG4gICAqIEBleHBlcmltZW50YWxcbiAgICovXG4gIGZ1bmN0aW9uIGZsdXNoKG1heFR1cm5zPzogbnVtYmVyKTogbnVtYmVyIHtcbiAgICByZXR1cm4gX2dldEZha2VBc3luY1pvbmVTcGVjKCkuZmx1c2gobWF4VHVybnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2NhcmQgYWxsIHJlbWFpbmluZyBwZXJpb2RpYyB0YXNrcy5cbiAgICpcbiAgICogQGV4cGVyaW1lbnRhbFxuICAgKi9cbiAgZnVuY3Rpb24gZGlzY2FyZFBlcmlvZGljVGFza3MoKTogdm9pZCB7XG4gICAgY29uc3Qgem9uZVNwZWMgPSBfZ2V0RmFrZUFzeW5jWm9uZVNwZWMoKTtcbiAgICBjb25zdCBwZW5kaW5nVGltZXJzID0gem9uZVNwZWMucGVuZGluZ1BlcmlvZGljVGltZXJzO1xuICAgIHpvbmVTcGVjLnBlbmRpbmdQZXJpb2RpY1RpbWVycy5sZW5ndGggPSAwO1xuICB9XG5cbiAgLyoqXG4gICAqIEZsdXNoIGFueSBwZW5kaW5nIG1pY3JvdGFza3MuXG4gICAqXG4gICAqIEBleHBlcmltZW50YWxcbiAgICovXG4gIGZ1bmN0aW9uIGZsdXNoTWljcm90YXNrcygpOiB2b2lkIHtcbiAgICBfZ2V0RmFrZUFzeW5jWm9uZVNwZWMoKS5mbHVzaE1pY3JvdGFza3MoKTtcbiAgfVxuICAoWm9uZSBhcyBhbnkpW2FwaS5zeW1ib2woJ2Zha2VBc3luY1Rlc3QnKV0gPVxuICAgICAge3Jlc2V0RmFrZUFzeW5jWm9uZSwgZmx1c2hNaWNyb3Rhc2tzLCBkaXNjYXJkUGVyaW9kaWNUYXNrcywgdGljaywgZmx1c2gsIGZha2VBc3luY307XG59KTsiXX0=