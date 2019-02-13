/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
'use strict';
(function () {
    var __extends = function (d, b) {
        for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
    var _global = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
    // Patch jasmine's describe/it/beforeEach/afterEach functions so test code always runs
    // in a testZone (ProxyZone). (See: angular/zone.js#91 & angular/angular#10503)
    if (!Zone)
        throw new Error('Missing: zone.js');
    if (typeof jasmine == 'undefined')
        throw new Error('Missing: jasmine.js');
    if (jasmine['__zone_patch__'])
        throw new Error("'jasmine' has already been patched with 'Zone'.");
    jasmine['__zone_patch__'] = true;
    var SyncTestZoneSpec = Zone['SyncTestZoneSpec'];
    var ProxyZoneSpec = Zone['ProxyZoneSpec'];
    if (!SyncTestZoneSpec)
        throw new Error('Missing: SyncTestZoneSpec');
    if (!ProxyZoneSpec)
        throw new Error('Missing: ProxyZoneSpec');
    var ambientZone = Zone.current;
    // Create a synchronous-only zone in which to run `describe` blocks in order to raise an
    // error if any asynchronous operations are attempted inside of a `describe` but outside of
    // a `beforeEach` or `it`.
    var syncZone = ambientZone.fork(new SyncTestZoneSpec('jasmine.describe'));
    var symbol = Zone.__symbol__;
    // whether patch jasmine clock when in fakeAsync
    var enableClockPatch = _global[symbol('fakeAsyncPatchLock')] === true;
    // Monkey patch all of the jasmine DSL so that each function runs in appropriate zone.
    var jasmineEnv = jasmine.getEnv();
    ['describe', 'xdescribe', 'fdescribe'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[methodName] = function (description, specDefinitions) {
            return originalJasmineFn.call(this, description, wrapDescribeInZone(specDefinitions));
        };
    });
    ['it', 'xit', 'fit'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (description, specDefinitions, timeout) {
            arguments[1] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    ['beforeEach', 'afterEach'].forEach(function (methodName) {
        var originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (specDefinitions, timeout) {
            arguments[0] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    // need to patch jasmine.clock().mockDate and jasmine.clock().tick() so
    // they can work properly in FakeAsyncTest
    var originalClockFn = (jasmine[symbol('clock')] = jasmine['clock']);
    jasmine['clock'] = function () {
        var clock = originalClockFn.apply(this, arguments);
        if (!clock[symbol('patched')]) {
            clock[symbol('patched')] = symbol('patched');
            var originalTick_1 = (clock[symbol('tick')] = clock.tick);
            clock.tick = function () {
                var fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    return fakeAsyncZoneSpec.tick.apply(fakeAsyncZoneSpec, arguments);
                }
                return originalTick_1.apply(this, arguments);
            };
            var originalMockDate_1 = (clock[symbol('mockDate')] = clock.mockDate);
            clock.mockDate = function () {
                var fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    var dateTime = arguments.length > 0 ? arguments[0] : new Date();
                    return fakeAsyncZoneSpec.setCurrentRealTime.apply(fakeAsyncZoneSpec, dateTime && typeof dateTime.getTime === 'function' ? [dateTime.getTime()] :
                        arguments);
                }
                return originalMockDate_1.apply(this, arguments);
            };
            // for auto go into fakeAsync feature, we need the flag to enable it
            if (enableClockPatch) {
                ['install', 'uninstall'].forEach(function (methodName) {
                    var originalClockFn = (clock[symbol(methodName)] = clock[methodName]);
                    clock[methodName] = function () {
                        var FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
                        if (FakeAsyncTestZoneSpec) {
                            jasmine[symbol('clockInstalled')] = 'install' === methodName;
                            return;
                        }
                        return originalClockFn.apply(this, arguments);
                    };
                });
            }
        }
        return clock;
    };
    /**
     * Gets a function wrapping the body of a Jasmine `describe` block to execute in a
     * synchronous-only zone.
     */
    function wrapDescribeInZone(describeBody) {
        return function () {
            return syncZone.run(describeBody, this, arguments);
        };
    }
    function runInTestZone(testBody, applyThis, queueRunner, done) {
        var isClockInstalled = !!jasmine[symbol('clockInstalled')];
        var testProxyZoneSpec = queueRunner.testProxyZoneSpec;
        var testProxyZone = queueRunner.testProxyZone;
        var lastDelegate;
        if (isClockInstalled && enableClockPatch) {
            // auto run a fakeAsync
            var fakeAsyncModule = Zone[Zone.__symbol__('fakeAsyncTest')];
            if (fakeAsyncModule && typeof fakeAsyncModule.fakeAsync === 'function') {
                testBody = fakeAsyncModule.fakeAsync(testBody);
            }
        }
        if (done) {
            return testProxyZone.run(testBody, applyThis, [done]);
        }
        else {
            return testProxyZone.run(testBody, applyThis);
        }
    }
    /**
     * Gets a function wrapping the body of a Jasmine `it/beforeEach/afterEach` block to
     * execute in a ProxyZone zone.
     * This will run in `testProxyZone`. The `testProxyZone` will be reset by the `ZoneQueueRunner`
     */
    function wrapTestInZone(testBody) {
        // The `done` callback is only passed through if the function expects at least one argument.
        // Note we have to make a function with correct number of arguments, otherwise jasmine will
        // think that all functions are sync or async.
        return (testBody && (testBody.length ? function (done) {
            return runInTestZone(testBody, this, this.queueRunner, done);
        } : function () {
            return runInTestZone(testBody, this, this.queueRunner);
        }));
    }
    var QueueRunner = jasmine.QueueRunner;
    jasmine.QueueRunner = (function (_super) {
        __extends(ZoneQueueRunner, _super);
        function ZoneQueueRunner(attrs) {
            var _this = this;
            attrs.onComplete = (function (fn) { return function () {
                // All functions are done, clear the test zone.
                _this.testProxyZone = null;
                _this.testProxyZoneSpec = null;
                ambientZone.scheduleMicroTask('jasmine.onComplete', fn);
            }; })(attrs.onComplete);
            var nativeSetTimeout = _global['__zone_symbol__setTimeout'];
            var nativeClearTimeout = _global['__zone_symbol__clearTimeout'];
            if (nativeSetTimeout) {
                // should run setTimeout inside jasmine outside of zone
                attrs.timeout = {
                    setTimeout: nativeSetTimeout ? nativeSetTimeout : _global.setTimeout,
                    clearTimeout: nativeClearTimeout ? nativeClearTimeout : _global.clearTimeout
                };
            }
            // create a userContext to hold the queueRunner itself
            // so we can access the testProxy in it/xit/beforeEach ...
            if (jasmine.UserContext) {
                if (!attrs.userContext) {
                    attrs.userContext = new jasmine.UserContext();
                }
                attrs.userContext.queueRunner = this;
            }
            else {
                if (!attrs.userContext) {
                    attrs.userContext = {};
                }
                attrs.userContext.queueRunner = this;
            }
            // patch attrs.onException
            var onException = attrs.onException;
            attrs.onException = function (error) {
                if (error &&
                    error.message ===
                        'Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.') {
                    // jasmine timeout, we can make the error message more
                    // reasonable to tell what tasks are pending
                    var proxyZoneSpec = this && this.testProxyZoneSpec;
                    if (proxyZoneSpec) {
                        var pendingTasksInfo = proxyZoneSpec.getAndClearPendingTasksInfo();
                        error.message += pendingTasksInfo;
                    }
                }
                if (onException) {
                    onException.call(this, error);
                }
            };
            _super.call(this, attrs);
        }
        ZoneQueueRunner.prototype.execute = function () {
            var _this = this;
            var zone = Zone.current;
            var isChildOfAmbientZone = false;
            while (zone) {
                if (zone === ambientZone) {
                    isChildOfAmbientZone = true;
                    break;
                }
                zone = zone.parent;
            }
            if (!isChildOfAmbientZone)
                throw new Error('Unexpected Zone: ' + Zone.current.name);
            // This is the zone which will be used for running individual tests.
            // It will be a proxy zone, so that the tests function can retroactively install
            // different zones.
            // Example:
            //   - In beforeEach() do childZone = Zone.current.fork(...);
            //   - In it() try to do fakeAsync(). The issue is that because the beforeEach forked the
            //     zone outside of fakeAsync it will be able to escape the fakeAsync rules.
            //   - Because ProxyZone is parent fo `childZone` fakeAsync can retroactively add
            //     fakeAsync behavior to the childZone.
            this.testProxyZoneSpec = new ProxyZoneSpec();
            this.testProxyZone = ambientZone.fork(this.testProxyZoneSpec);
            if (!Zone.currentTask) {
                // if we are not running in a task then if someone would register a
                // element.addEventListener and then calling element.click() the
                // addEventListener callback would think that it is the top most task and would
                // drain the microtask queue on element.click() which would be incorrect.
                // For this reason we always force a task when running jasmine tests.
                Zone.current.scheduleMicroTask('jasmine.execute().forceTask', function () { return QueueRunner.prototype.execute.call(_this); });
            }
            else {
                _super.prototype.execute.call(this);
            }
        };
        return ZoneQueueRunner;
    })(QueueRunner);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvamFzbWluZS9qYXNtaW5lLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUVILFlBQVksQ0FBQztBQUNiLENBQUM7SUFDQyxJQUFNLFNBQVMsR0FBRyxVQUFTLENBQU0sRUFBRSxDQUFNO1FBQ3ZDLEtBQUssSUFBTSxDQUFDLElBQUksQ0FBQztZQUNmLElBQUksQ0FBQyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7Z0JBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN2QyxTQUFTLEVBQUU7WUFDVCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQztRQUN2QixDQUFDO1FBQ0QsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsU0FBUyxDQUFDLEVBQUUsSUFBSyxFQUFVLEVBQUUsQ0FBQyxDQUFDO0lBQ2xHLENBQUMsQ0FBQztJQUNGLElBQU0sT0FBTyxHQUNULE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssV0FBVyxJQUFJLElBQUksSUFBSSxNQUFNLENBQUM7SUFDN0Ysc0ZBQXNGO0lBQ3RGLCtFQUErRTtJQUMvRSxJQUFJLENBQUMsSUFBSTtRQUFFLE1BQU0sSUFBSSxLQUFLLENB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QUF4QyxDQUF3QyxDQUFDLENBQUM7YUFDcEY7aUJBQU07Z0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JDO1FBQ0gsQ0FBQyxDQUFDO1FBQ0YsT0FBTyxlQUFlLENBQUM7SUFDekIsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDbEIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuKCgpID0+IHtcbiAgY29uc3QgX19leHRlbmRzID0gZnVuY3Rpb24oZDogYW55LCBiOiBhbnkpIHtcbiAgICBmb3IgKGNvbnN0IHAgaW4gYilcbiAgICAgIGlmIChiLmhhc093blByb3BlcnR5KHApKSBkW3BdID0gYltwXTtcbiAgICBmdW5jdGlvbiBfXygpIHtcbiAgICAgIHRoaXMuY29uc3RydWN0b3IgPSBkO1xuICAgIH1cbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSksIG5ldyAoX18gYXMgYW55KSgpKTtcbiAgfTtcbiAgY29uc3QgX2dsb2JhbDogYW55ID1cbiAgICAgIHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdyB8fCB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiB8fCBnbG9iYWw7XG4gIC8vIFBhdGNoIGphc21pbmUncyBkZXNjcmliZS9pdC9iZWZvcmVFYWNoL2FmdGVyRWFjaCBmdW5jdGlvbnMgc28gdGVzdCBjb2RlIGFsd2F5cyBydW5zXG4gIC8vIGluIGEgdGVzdFpvbmUgKFByb3h5Wm9uZSkuIChTZWU6IGFuZ3VsYXIvem9uZS5qcyM5MSAmIGFuZ3VsYXIvYW5ndWxhciMxMDUwMylcbiAgaWYgKCFab25lKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IHpvbmUuanMnKTtcbiAgaWYgKHR5cGVvZiBqYXNtaW5lID09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IGphc21pbmUuanMnKTtcbiAgaWYgKChqYXNtaW5lIGFzIGFueSlbJ19fem9uZV9wYXRjaF9fJ10pXG4gICAgdGhyb3cgbmV3IEVycm9yKGAnamFzbWluZScgaGFzIGFscmVhZHkgYmVlbiBwYXRjaGVkIHdpdGggJ1pvbmUnLmApO1xuICAoamFzbWluZSBhcyBhbnkpWydfX3pvbmVfcGF0Y2hfXyddID0gdHJ1ZTtcblxuICBjb25zdCBTeW5jVGVzdFpvbmVTcGVjOiB7bmV3IChuYW1lOiBzdHJpbmcpOiBab25lU3BlY30gPSAoWm9uZSBhcyBhbnkpWydTeW5jVGVzdFpvbmVTcGVjJ107XG4gIGNvbnN0IFByb3h5Wm9uZVNwZWM6IHtuZXcgKCk6IFpvbmVTcGVjfSA9IChab25lIGFzIGFueSlbJ1Byb3h5Wm9uZVNwZWMnXTtcbiAgaWYgKCFTeW5jVGVzdFpvbmVTcGVjKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IFN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgaWYgKCFQcm94eVpvbmVTcGVjKSB0aHJvdyBuZXcgRXJyb3IoJ01pc3Npbmc6IFByb3h5Wm9uZVNwZWMnKTtcblxuICBjb25zdCBhbWJpZW50Wm9uZSA9IFpvbmUuY3VycmVudDtcbiAgLy8gQ3JlYXRlIGEgc3luY2hyb25vdXMtb25seSB6b25lIGluIHdoaWNoIHRvIHJ1biBgZGVzY3JpYmVgIGJsb2NrcyBpbiBvcmRlciB0byByYWlzZSBhblxuICAvLyBlcnJvciBpZiBhbnkgYXN5bmNocm9ub3VzIG9wZXJhdGlvbnMgYXJlIGF0dGVtcHRlZCBpbnNpZGUgb2YgYSBgZGVzY3JpYmVgIGJ1dCBvdXRzaWRlIG9mXG4gIC8vIGEgYGJlZm9yZUVhY2hgIG9yIGBpdGAuXG4gIGNvbnN0IHN5bmNab25lID0gYW1iaWVudFpvbmUuZm9yayhuZXcgU3luY1Rlc3Rab25lU3BlYygnamFzbWluZS5kZXNjcmliZScpKTtcblxuICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX187XG5cbiAgLy8gd2hldGhlciBwYXRjaCBqYXNtaW5lIGNsb2NrIHdoZW4gaW4gZmFrZUFzeW5jXG4gIGNvbnN0IGVuYWJsZUNsb2NrUGF0Y2ggPSBfZ2xvYmFsW3N5bWJvbCgnZmFrZUFzeW5jUGF0Y2hMb2NrJyldID09PSB0cnVlO1xuXG4gIC8vIE1vbmtleSBwYXRjaCBhbGwgb2YgdGhlIGphc21pbmUgRFNMIHNvIHRoYXQgZWFjaCBmdW5jdGlvbiBydW5zIGluIGFwcHJvcHJpYXRlIHpvbmUuXG4gIGNvbnN0IGphc21pbmVFbnY6IGFueSA9IGphc21pbmUuZ2V0RW52KCk7XG4gIFsnZGVzY3JpYmUnLCAneGRlc2NyaWJlJywgJ2ZkZXNjcmliZSddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKGRlc2NyaXB0aW9uOiBzdHJpbmcsIHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24pIHtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5jYWxsKHRoaXMsIGRlc2NyaXB0aW9uLCB3cmFwRGVzY3JpYmVJblpvbmUoc3BlY0RlZmluaXRpb25zKSk7XG4gICAgfTtcbiAgfSk7XG4gIFsnaXQnLCAneGl0JywgJ2ZpdCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudltzeW1ib2wobWV0aG9kTmFtZSldID0gb3JpZ2luYWxKYXNtaW5lRm47XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKFxuICAgICAgICBkZXNjcmlwdGlvbjogc3RyaW5nLCBzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICAgIGFyZ3VtZW50c1sxXSA9IHdyYXBUZXN0SW5ab25lKHNwZWNEZWZpbml0aW9ucyk7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcbiAgWydiZWZvcmVFYWNoJywgJ2FmdGVyRWFjaCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgbGV0IG9yaWdpbmFsSmFzbWluZUZuOiBGdW5jdGlvbiA9IGphc21pbmVFbnZbbWV0aG9kTmFtZV07XG4gICAgamFzbWluZUVudltzeW1ib2wobWV0aG9kTmFtZSldID0gb3JpZ2luYWxKYXNtaW5lRm47XG4gICAgamFzbWluZUVudlttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24sIHRpbWVvdXQ6IG51bWJlcikge1xuICAgICAgYXJndW1lbnRzWzBdID0gd3JhcFRlc3RJblpvbmUoc3BlY0RlZmluaXRpb25zKTtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuXG4gIC8vIG5lZWQgdG8gcGF0Y2ggamFzbWluZS5jbG9jaygpLm1vY2tEYXRlIGFuZCBqYXNtaW5lLmNsb2NrKCkudGljaygpIHNvXG4gIC8vIHRoZXkgY2FuIHdvcmsgcHJvcGVybHkgaW4gRmFrZUFzeW5jVGVzdFxuICBjb25zdCBvcmlnaW5hbENsb2NrRm46IEZ1bmN0aW9uID0gKChqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9jaycpXSA9IGphc21pbmVbJ2Nsb2NrJ10pO1xuICAoamFzbWluZSBhcyBhbnkpWydjbG9jayddID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgY2xvY2sgPSBvcmlnaW5hbENsb2NrRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAoIWNsb2NrW3N5bWJvbCgncGF0Y2hlZCcpXSkge1xuICAgICAgY2xvY2tbc3ltYm9sKCdwYXRjaGVkJyldID0gc3ltYm9sKCdwYXRjaGVkJyk7XG4gICAgICBjb25zdCBvcmlnaW5hbFRpY2sgPSAoY2xvY2tbc3ltYm9sKCd0aWNrJyldID0gY2xvY2sudGljayk7XG4gICAgICBjbG9jay50aWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGZha2VBc3luY1pvbmVTcGVjID0gWm9uZS5jdXJyZW50LmdldCgnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJyk7XG4gICAgICAgIGlmIChmYWtlQXN5bmNab25lU3BlYykge1xuICAgICAgICAgIHJldHVybiBmYWtlQXN5bmNab25lU3BlYy50aWNrLmFwcGx5KGZha2VBc3luY1pvbmVTcGVjLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbFRpY2suYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBvcmlnaW5hbE1vY2tEYXRlID0gKGNsb2NrW3N5bWJvbCgnbW9ja0RhdGUnKV0gPSBjbG9jay5tb2NrRGF0ZSk7XG4gICAgICBjbG9jay5tb2NrRGF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBmYWtlQXN5bmNab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgICBpZiAoZmFrZUFzeW5jWm9uZVNwZWMpIHtcbiAgICAgICAgICBjb25zdCBkYXRlVGltZSA9IGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogbmV3IERhdGUoKTtcbiAgICAgICAgICByZXR1cm4gZmFrZUFzeW5jWm9uZVNwZWMuc2V0Q3VycmVudFJlYWxUaW1lLmFwcGx5KFxuICAgICAgICAgICAgICBmYWtlQXN5bmNab25lU3BlYyxcbiAgICAgICAgICAgICAgZGF0ZVRpbWUgJiYgdHlwZW9mIGRhdGVUaW1lLmdldFRpbWUgPT09ICdmdW5jdGlvbicgPyBbZGF0ZVRpbWUuZ2V0VGltZSgpXSA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxNb2NrRGF0ZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIC8vIGZvciBhdXRvIGdvIGludG8gZmFrZUFzeW5jIGZlYXR1cmUsIHdlIG5lZWQgdGhlIGZsYWcgdG8gZW5hYmxlIGl0XG4gICAgICBpZiAoZW5hYmxlQ2xvY2tQYXRjaCkge1xuICAgICAgICBbJ2luc3RhbGwnLCAndW5pbnN0YWxsJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICAgICAgICBjb25zdCBvcmlnaW5hbENsb2NrRm46IEZ1bmN0aW9uID0gKGNsb2NrW3N5bWJvbChtZXRob2ROYW1lKV0gPSBjbG9ja1ttZXRob2ROYW1lXSk7XG4gICAgICAgICAgY2xvY2tbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnN0IEZha2VBc3luY1Rlc3Rab25lU3BlYyA9IChab25lIGFzIGFueSlbJ0Zha2VBc3luY1Rlc3Rab25lU3BlYyddO1xuICAgICAgICAgICAgaWYgKEZha2VBc3luY1Rlc3Rab25lU3BlYykge1xuICAgICAgICAgICAgICAoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2tJbnN0YWxsZWQnKV0gPSAnaW5zdGFsbCcgPT09IG1ldGhvZE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvcmlnaW5hbENsb2NrRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNsb2NrO1xuICB9O1xuXG4gIC8qKlxuICAgKiBHZXRzIGEgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIGJvZHkgb2YgYSBKYXNtaW5lIGBkZXNjcmliZWAgYmxvY2sgdG8gZXhlY3V0ZSBpbiBhXG4gICAqIHN5bmNocm9ub3VzLW9ubHkgem9uZS5cbiAgICovXG4gIGZ1bmN0aW9uIHdyYXBEZXNjcmliZUluWm9uZShkZXNjcmliZUJvZHk6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiBzeW5jWm9uZS5ydW4oZGVzY3JpYmVCb2R5LCB0aGlzLCAoYXJndW1lbnRzIGFzIGFueSkgYXMgYW55W10pO1xuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBydW5JblRlc3Rab25lKHRlc3RCb2R5OiBGdW5jdGlvbiwgYXBwbHlUaGlzOiBhbnksIHF1ZXVlUnVubmVyOiBhbnksIGRvbmU/OiBGdW5jdGlvbikge1xuICAgIGNvbnN0IGlzQ2xvY2tJbnN0YWxsZWQgPSAhIShqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9ja0luc3RhbGxlZCcpXTtcbiAgICBjb25zdCB0ZXN0UHJveHlab25lU3BlYyA9IHF1ZXVlUnVubmVyLnRlc3RQcm94eVpvbmVTcGVjO1xuICAgIGNvbnN0IHRlc3RQcm94eVpvbmUgPSBxdWV1ZVJ1bm5lci50ZXN0UHJveHlab25lO1xuICAgIGxldCBsYXN0RGVsZWdhdGU7XG4gICAgaWYgKGlzQ2xvY2tJbnN0YWxsZWQgJiYgZW5hYmxlQ2xvY2tQYXRjaCkge1xuICAgICAgLy8gYXV0byBydW4gYSBmYWtlQXN5bmNcbiAgICAgIGNvbnN0IGZha2VBc3luY01vZHVsZSA9IChab25lIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdmYWtlQXN5bmNUZXN0JyldO1xuICAgICAgaWYgKGZha2VBc3luY01vZHVsZSAmJiB0eXBlb2YgZmFrZUFzeW5jTW9kdWxlLmZha2VBc3luYyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0ZXN0Qm9keSA9IGZha2VBc3luY01vZHVsZS5mYWtlQXN5bmModGVzdEJvZHkpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoZG9uZSkge1xuICAgICAgcmV0dXJuIHRlc3RQcm94eVpvbmUucnVuKHRlc3RCb2R5LCBhcHBseVRoaXMsIFtkb25lXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0ZXN0UHJveHlab25lLnJ1bih0ZXN0Qm9keSwgYXBwbHlUaGlzKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0cyBhIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSBib2R5IG9mIGEgSmFzbWluZSBgaXQvYmVmb3JlRWFjaC9hZnRlckVhY2hgIGJsb2NrIHRvXG4gICAqIGV4ZWN1dGUgaW4gYSBQcm94eVpvbmUgem9uZS5cbiAgICogVGhpcyB3aWxsIHJ1biBpbiBgdGVzdFByb3h5Wm9uZWAuIFRoZSBgdGVzdFByb3h5Wm9uZWAgd2lsbCBiZSByZXNldCBieSB0aGUgYFpvbmVRdWV1ZVJ1bm5lcmBcbiAgICovXG4gIGZ1bmN0aW9uIHdyYXBUZXN0SW5ab25lKHRlc3RCb2R5OiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICAvLyBUaGUgYGRvbmVgIGNhbGxiYWNrIGlzIG9ubHkgcGFzc2VkIHRocm91Z2ggaWYgdGhlIGZ1bmN0aW9uIGV4cGVjdHMgYXQgbGVhc3Qgb25lIGFyZ3VtZW50LlxuICAgIC8vIE5vdGUgd2UgaGF2ZSB0byBtYWtlIGEgZnVuY3Rpb24gd2l0aCBjb3JyZWN0IG51bWJlciBvZiBhcmd1bWVudHMsIG90aGVyd2lzZSBqYXNtaW5lIHdpbGxcbiAgICAvLyB0aGluayB0aGF0IGFsbCBmdW5jdGlvbnMgYXJlIHN5bmMgb3IgYXN5bmMuXG4gICAgcmV0dXJuICh0ZXN0Qm9keSAmJiAodGVzdEJvZHkubGVuZ3RoID8gZnVuY3Rpb24oZG9uZTogRnVuY3Rpb24pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJ1bkluVGVzdFpvbmUodGVzdEJvZHksIHRoaXMsIHRoaXMucXVldWVSdW5uZXIsIGRvbmUpO1xuICAgICAgICAgICAgfSA6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICByZXR1cm4gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keSwgdGhpcywgdGhpcy5xdWV1ZVJ1bm5lcik7XG4gICAgICAgICAgICB9KSk7XG4gIH1cbiAgaW50ZXJmYWNlIFF1ZXVlUnVubmVyIHtcbiAgICBleGVjdXRlKCk6IHZvaWQ7XG4gIH1cbiAgaW50ZXJmYWNlIFF1ZXVlUnVubmVyQXR0cnMge1xuICAgIHF1ZXVlYWJsZUZuczoge2ZuOiBGdW5jdGlvbn1bXTtcbiAgICBvbkNvbXBsZXRlOiAoKSA9PiB2b2lkO1xuICAgIGNsZWFyU3RhY2s6IChmbjogYW55KSA9PiB2b2lkO1xuICAgIG9uRXhjZXB0aW9uOiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgICBjYXRjaEV4Y2VwdGlvbjogKCkgPT4gYm9vbGVhbjtcbiAgICB1c2VyQ29udGV4dDogYW55O1xuICAgIHRpbWVvdXQ6IHtzZXRUaW1lb3V0OiBGdW5jdGlvbjsgY2xlYXJUaW1lb3V0OiBGdW5jdGlvbn07XG4gICAgZmFpbDogKCkgPT4gdm9pZDtcbiAgfVxuXG4gIGNvbnN0IFF1ZXVlUnVubmVyID0gKGphc21pbmUgYXMgYW55KS5RdWV1ZVJ1bm5lciBhcyB7XG4gICAgbmV3IChhdHRyczogUXVldWVSdW5uZXJBdHRycyk6IFF1ZXVlUnVubmVyO1xuICB9O1xuICAoamFzbWluZSBhcyBhbnkpLlF1ZXVlUnVubmVyID0gKGZ1bmN0aW9uKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhab25lUXVldWVSdW5uZXIsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gWm9uZVF1ZXVlUnVubmVyKGF0dHJzOiB7XG4gICAgICBvbkNvbXBsZXRlOiBGdW5jdGlvbjtcbiAgICAgIHVzZXJDb250ZXh0PzogYW55O1xuICAgICAgdGltZW91dD86IHtzZXRUaW1lb3V0OiBGdW5jdGlvbjsgY2xlYXJUaW1lb3V0OiBGdW5jdGlvbn07XG4gICAgICBvbkV4Y2VwdGlvbj86IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAgIH0pIHtcbiAgICAgIGF0dHJzLm9uQ29tcGxldGUgPSAoZm4gPT4gKCkgPT4ge1xuICAgICAgICAvLyBBbGwgZnVuY3Rpb25zIGFyZSBkb25lLCBjbGVhciB0aGUgdGVzdCB6b25lLlxuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmVTcGVjID0gbnVsbDtcbiAgICAgICAgYW1iaWVudFpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soJ2phc21pbmUub25Db21wbGV0ZScsIGZuKTtcbiAgICAgIH0pKGF0dHJzLm9uQ29tcGxldGUpO1xuXG4gICAgICBjb25zdCBuYXRpdmVTZXRUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fc2V0VGltZW91dCddO1xuICAgICAgY29uc3QgbmF0aXZlQ2xlYXJUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fY2xlYXJUaW1lb3V0J107XG4gICAgICBpZiAobmF0aXZlU2V0VGltZW91dCkge1xuICAgICAgICAvLyBzaG91bGQgcnVuIHNldFRpbWVvdXQgaW5zaWRlIGphc21pbmUgb3V0c2lkZSBvZiB6b25lXG4gICAgICAgIGF0dHJzLnRpbWVvdXQgPSB7XG4gICAgICAgICAgc2V0VGltZW91dDogbmF0aXZlU2V0VGltZW91dCA/IG5hdGl2ZVNldFRpbWVvdXQgOiBfZ2xvYmFsLnNldFRpbWVvdXQsXG4gICAgICAgICAgY2xlYXJUaW1lb3V0OiBuYXRpdmVDbGVhclRpbWVvdXQgPyBuYXRpdmVDbGVhclRpbWVvdXQgOiBfZ2xvYmFsLmNsZWFyVGltZW91dFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBjcmVhdGUgYSB1c2VyQ29udGV4dCB0byBob2xkIHRoZSBxdWV1ZVJ1bm5lciBpdHNlbGZcbiAgICAgIC8vIHNvIHdlIGNhbiBhY2Nlc3MgdGhlIHRlc3RQcm94eSBpbiBpdC94aXQvYmVmb3JlRWFjaCAuLi5cbiAgICAgIGlmICgoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KSB7XG4gICAgICAgIGlmICghYXR0cnMudXNlckNvbnRleHQpIHtcbiAgICAgICAgICBhdHRycy51c2VyQ29udGV4dCA9IG5ldyAoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFhdHRycy51c2VyQ29udGV4dCkge1xuICAgICAgICAgIGF0dHJzLnVzZXJDb250ZXh0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBwYXRjaCBhdHRycy5vbkV4Y2VwdGlvblxuICAgICAgY29uc3Qgb25FeGNlcHRpb24gPSBhdHRycy5vbkV4Y2VwdGlvbjtcbiAgICAgIGF0dHJzLm9uRXhjZXB0aW9uID0gZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICBpZiAoZXJyb3IgJiZcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT09XG4gICAgICAgICAgICAgICAgJ1RpbWVvdXQgLSBBc3luYyBjYWxsYmFjayB3YXMgbm90IGludm9rZWQgd2l0aGluIHRpbWVvdXQgc3BlY2lmaWVkIGJ5IGphc21pbmUuREVGQVVMVF9USU1FT1VUX0lOVEVSVkFMLicpIHtcbiAgICAgICAgICAvLyBqYXNtaW5lIHRpbWVvdXQsIHdlIGNhbiBtYWtlIHRoZSBlcnJvciBtZXNzYWdlIG1vcmVcbiAgICAgICAgICAvLyByZWFzb25hYmxlIHRvIHRlbGwgd2hhdCB0YXNrcyBhcmUgcGVuZGluZ1xuICAgICAgICAgIGNvbnN0IHByb3h5Wm9uZVNwZWM6IGFueSA9IHRoaXMgJiYgdGhpcy50ZXN0UHJveHlab25lU3BlYztcbiAgICAgICAgICBpZiAocHJveHlab25lU3BlYykge1xuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1Rhc2tzSW5mbyA9IHByb3h5Wm9uZVNwZWMuZ2V0QW5kQ2xlYXJQZW5kaW5nVGFza3NJbmZvKCk7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlICs9IHBlbmRpbmdUYXNrc0luZm87XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChvbkV4Y2VwdGlvbikge1xuICAgICAgICAgIG9uRXhjZXB0aW9uLmNhbGwodGhpcywgZXJyb3IpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBfc3VwZXIuY2FsbCh0aGlzLCBhdHRycyk7XG4gICAgfVxuICAgIFpvbmVRdWV1ZVJ1bm5lci5wcm90b3R5cGUuZXhlY3V0ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHpvbmU6IFpvbmV8bnVsbCA9IFpvbmUuY3VycmVudDtcbiAgICAgIGxldCBpc0NoaWxkT2ZBbWJpZW50Wm9uZSA9IGZhbHNlO1xuICAgICAgd2hpbGUgKHpvbmUpIHtcbiAgICAgICAgaWYgKHpvbmUgPT09IGFtYmllbnRab25lKSB7XG4gICAgICAgICAgaXNDaGlsZE9mQW1iaWVudFpvbmUgPSB0cnVlO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHpvbmUgPSB6b25lLnBhcmVudDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0NoaWxkT2ZBbWJpZW50Wm9uZSkgdGhyb3cgbmV3IEVycm9yKCdVbmV4cGVjdGVkIFpvbmU6ICcgKyBab25lLmN1cnJlbnQubmFtZSk7XG5cbiAgICAgIC8vIFRoaXMgaXMgdGhlIHpvbmUgd2hpY2ggd2lsbCBiZSB1c2VkIGZvciBydW5uaW5nIGluZGl2aWR1YWwgdGVzdHMuXG4gICAgICAvLyBJdCB3aWxsIGJlIGEgcHJveHkgem9uZSwgc28gdGhhdCB0aGUgdGVzdHMgZnVuY3Rpb24gY2FuIHJldHJvYWN0aXZlbHkgaW5zdGFsbFxuICAgICAgLy8gZGlmZmVyZW50IHpvbmVzLlxuICAgICAgLy8gRXhhbXBsZTpcbiAgICAgIC8vICAgLSBJbiBiZWZvcmVFYWNoKCkgZG8gY2hpbGRab25lID0gWm9uZS5jdXJyZW50LmZvcmsoLi4uKTtcbiAgICAgIC8vICAgLSBJbiBpdCgpIHRyeSB0byBkbyBmYWtlQXN5bmMoKS4gVGhlIGlzc3VlIGlzIHRoYXQgYmVjYXVzZSB0aGUgYmVmb3JlRWFjaCBmb3JrZWQgdGhlXG4gICAgICAvLyAgICAgem9uZSBvdXRzaWRlIG9mIGZha2VBc3luYyBpdCB3aWxsIGJlIGFibGUgdG8gZXNjYXBlIHRoZSBmYWtlQXN5bmMgcnVsZXMuXG4gICAgICAvLyAgIC0gQmVjYXVzZSBQcm94eVpvbmUgaXMgcGFyZW50IGZvIGBjaGlsZFpvbmVgIGZha2VBc3luYyBjYW4gcmV0cm9hY3RpdmVseSBhZGRcbiAgICAgIC8vICAgICBmYWtlQXN5bmMgYmVoYXZpb3IgdG8gdGhlIGNoaWxkWm9uZS5cblxuICAgICAgdGhpcy50ZXN0UHJveHlab25lU3BlYyA9IG5ldyBQcm94eVpvbmVTcGVjKCk7XG4gICAgICB0aGlzLnRlc3RQcm94eVpvbmUgPSBhbWJpZW50Wm9uZS5mb3JrKHRoaXMudGVzdFByb3h5Wm9uZVNwZWMpO1xuICAgICAgaWYgKCFab25lLmN1cnJlbnRUYXNrKSB7XG4gICAgICAgIC8vIGlmIHdlIGFyZSBub3QgcnVubmluZyBpbiBhIHRhc2sgdGhlbiBpZiBzb21lb25lIHdvdWxkIHJlZ2lzdGVyIGFcbiAgICAgICAgLy8gZWxlbWVudC5hZGRFdmVudExpc3RlbmVyIGFuZCB0aGVuIGNhbGxpbmcgZWxlbWVudC5jbGljaygpIHRoZVxuICAgICAgICAvLyBhZGRFdmVudExpc3RlbmVyIGNhbGxiYWNrIHdvdWxkIHRoaW5rIHRoYXQgaXQgaXMgdGhlIHRvcCBtb3N0IHRhc2sgYW5kIHdvdWxkXG4gICAgICAgIC8vIGRyYWluIHRoZSBtaWNyb3Rhc2sgcXVldWUgb24gZWxlbWVudC5jbGljaygpIHdoaWNoIHdvdWxkIGJlIGluY29ycmVjdC5cbiAgICAgICAgLy8gRm9yIHRoaXMgcmVhc29uIHdlIGFsd2F5cyBmb3JjZSBhIHRhc2sgd2hlbiBydW5uaW5nIGphc21pbmUgdGVzdHMuXG4gICAgICAgIFpvbmUuY3VycmVudC5zY2hlZHVsZU1pY3JvVGFzayhcbiAgICAgICAgICAgICdqYXNtaW5lLmV4ZWN1dGUoKS5mb3JjZVRhc2snLCAoKSA9PiBRdWV1ZVJ1bm5lci5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF9zdXBlci5wcm90b3R5cGUuZXhlY3V0ZS5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH07XG4gICAgcmV0dXJuIFpvbmVRdWV1ZVJ1bm5lcjtcbiAgfSkoUXVldWVSdW5uZXIpO1xufSkoKTtcbiJdfQ==