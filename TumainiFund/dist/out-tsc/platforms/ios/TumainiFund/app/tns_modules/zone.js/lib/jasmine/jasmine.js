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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2phc21pbmUvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxZQUFZLENBQUM7QUFDYixDQUFDO0lBQ0MsSUFBTSxTQUFTLEdBQUcsVUFBUyxDQUFNLEVBQUUsQ0FBTTtRQUN2QyxLQUFLLElBQU0sQ0FBQyxJQUFJLENBQUM7WUFDZixJQUFJLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO2dCQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsU0FBUyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUM7UUFDdkIsQ0FBQztRQUNELENBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUFFLElBQUssRUFBVSxFQUFFLENBQUMsQ0FBQztJQUNsRyxDQUFDLENBQUM7SUFDRixJQUFNLE9BQU8sR0FDVCxPQUFPLE1BQU0sS0FBSyxXQUFXLElBQUksTUFBTSxJQUFJLE9BQU8sSUFBSSxLQUFLLFdBQVcsSUFBSSxJQUFJLElBQUksTUFBTSxDQUFDO0lBQzdGLHNGQUFzRjtJQUN0RiwrRUFBK0U7SUFDL0UsSUFBSSxDQUFDLElBQUk7UUFBRSxNQUFNLElBQUksS0FBSyxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDL0MsSUFBSSxPQUFPLE9BQU8sSUFBSSxXQUFXO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxx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QyxJQUFJLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUMsQ0FBQztRQUNGLE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcbigoKSA9PiB7XG4gIGNvbnN0IF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGQ6IGFueSwgYjogYW55KSB7XG4gICAgZm9yIChjb25zdCBwIGluIGIpXG4gICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gZDtcbiAgICB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6ICgoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUpLCBuZXcgKF9fIGFzIGFueSkoKSk7XG4gIH07XG4gIGNvbnN0IF9nbG9iYWw6IGFueSA9XG4gICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgfHwgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgfHwgZ2xvYmFsO1xuICAvLyBQYXRjaCBqYXNtaW5lJ3MgZGVzY3JpYmUvaXQvYmVmb3JlRWFjaC9hZnRlckVhY2ggZnVuY3Rpb25zIHNvIHRlc3QgY29kZSBhbHdheXMgcnVuc1xuICAvLyBpbiBhIHRlc3Rab25lIChQcm94eVpvbmUpLiAoU2VlOiBhbmd1bGFyL3pvbmUuanMjOTEgJiBhbmd1bGFyL2FuZ3VsYXIjMTA1MDMpXG4gIGlmICghWm9uZSkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiB6b25lLmpzJyk7XG4gIGlmICh0eXBlb2YgamFzbWluZSA9PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBqYXNtaW5lLmpzJyk7XG4gIGlmICgoamFzbWluZSBhcyBhbnkpWydfX3pvbmVfcGF0Y2hfXyddKVxuICAgIHRocm93IG5ldyBFcnJvcihgJ2phc21pbmUnIGhhcyBhbHJlYWR5IGJlZW4gcGF0Y2hlZCB3aXRoICdab25lJy5gKTtcbiAgKGphc21pbmUgYXMgYW55KVsnX196b25lX3BhdGNoX18nXSA9IHRydWU7XG5cbiAgY29uc3QgU3luY1Rlc3Rab25lU3BlYzoge25ldyAobmFtZTogc3RyaW5nKTogWm9uZVNwZWN9ID0gKFpvbmUgYXMgYW55KVsnU3luY1Rlc3Rab25lU3BlYyddO1xuICBjb25zdCBQcm94eVpvbmVTcGVjOiB7bmV3ICgpOiBab25lU3BlY30gPSAoWm9uZSBhcyBhbnkpWydQcm94eVpvbmVTcGVjJ107XG4gIGlmICghU3luY1Rlc3Rab25lU3BlYykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBTeW5jVGVzdFpvbmVTcGVjJyk7XG4gIGlmICghUHJveHlab25lU3BlYykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBQcm94eVpvbmVTcGVjJyk7XG5cbiAgY29uc3QgYW1iaWVudFpvbmUgPSBab25lLmN1cnJlbnQ7XG4gIC8vIENyZWF0ZSBhIHN5bmNocm9ub3VzLW9ubHkgem9uZSBpbiB3aGljaCB0byBydW4gYGRlc2NyaWJlYCBibG9ja3MgaW4gb3JkZXIgdG8gcmFpc2UgYW5cbiAgLy8gZXJyb3IgaWYgYW55IGFzeW5jaHJvbm91cyBvcGVyYXRpb25zIGFyZSBhdHRlbXB0ZWQgaW5zaWRlIG9mIGEgYGRlc2NyaWJlYCBidXQgb3V0c2lkZSBvZlxuICAvLyBhIGBiZWZvcmVFYWNoYCBvciBgaXRgLlxuICBjb25zdCBzeW5jWm9uZSA9IGFtYmllbnRab25lLmZvcmsobmV3IFN5bmNUZXN0Wm9uZVNwZWMoJ2phc21pbmUuZGVzY3JpYmUnKSk7XG5cbiAgY29uc3Qgc3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fO1xuXG4gIC8vIHdoZXRoZXIgcGF0Y2ggamFzbWluZSBjbG9jayB3aGVuIGluIGZha2VBc3luY1xuICBjb25zdCBlbmFibGVDbG9ja1BhdGNoID0gX2dsb2JhbFtzeW1ib2woJ2Zha2VBc3luY1BhdGNoTG9jaycpXSA9PT0gdHJ1ZTtcblxuICAvLyBNb25rZXkgcGF0Y2ggYWxsIG9mIHRoZSBqYXNtaW5lIERTTCBzbyB0aGF0IGVhY2ggZnVuY3Rpb24gcnVucyBpbiBhcHByb3ByaWF0ZSB6b25lLlxuICBjb25zdCBqYXNtaW5lRW52OiBhbnkgPSBqYXNtaW5lLmdldEVudigpO1xuICBbJ2Rlc2NyaWJlJywgJ3hkZXNjcmliZScsICdmZGVzY3JpYmUnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihkZXNjcmlwdGlvbjogc3RyaW5nLCBzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uY2FsbCh0aGlzLCBkZXNjcmlwdGlvbiwgd3JhcERlc2NyaWJlSW5ab25lKHNwZWNEZWZpbml0aW9ucykpO1xuICAgIH07XG4gIH0pO1xuICBbJ2l0JywgJ3hpdCcsICdmaXQnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IG9yaWdpbmFsSmFzbWluZUZuO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZywgc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbiwgdGltZW91dDogbnVtYmVyKSB7XG4gICAgICBhcmd1bWVudHNbMV0gPSB3cmFwVGVzdEluWm9uZShzcGVjRGVmaW5pdGlvbnMpO1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG4gIFsnYmVmb3JlRWFjaCcsICdhZnRlckVhY2gnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IG9yaWdpbmFsSmFzbWluZUZuO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uLCB0aW1lb3V0OiBudW1iZXIpIHtcbiAgICAgIGFyZ3VtZW50c1swXSA9IHdyYXBUZXN0SW5ab25lKHNwZWNEZWZpbml0aW9ucyk7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICB9KTtcblxuICAvLyBuZWVkIHRvIHBhdGNoIGphc21pbmUuY2xvY2soKS5tb2NrRGF0ZSBhbmQgamFzbWluZS5jbG9jaygpLnRpY2soKSBzb1xuICAvLyB0aGV5IGNhbiB3b3JrIHByb3Blcmx5IGluIEZha2VBc3luY1Rlc3RcbiAgY29uc3Qgb3JpZ2luYWxDbG9ja0ZuOiBGdW5jdGlvbiA9ICgoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2snKV0gPSBqYXNtaW5lWydjbG9jayddKTtcbiAgKGphc21pbmUgYXMgYW55KVsnY2xvY2snXSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGNsb2NrID0gb3JpZ2luYWxDbG9ja0ZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKCFjbG9ja1tzeW1ib2woJ3BhdGNoZWQnKV0pIHtcbiAgICAgIGNsb2NrW3N5bWJvbCgncGF0Y2hlZCcpXSA9IHN5bWJvbCgncGF0Y2hlZCcpO1xuICAgICAgY29uc3Qgb3JpZ2luYWxUaWNrID0gKGNsb2NrW3N5bWJvbCgndGljaycpXSA9IGNsb2NrLnRpY2spO1xuICAgICAgY2xvY2sudGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCBmYWtlQXN5bmNab25lU3BlYyA9IFpvbmUuY3VycmVudC5nZXQoJ0Zha2VBc3luY1Rlc3Rab25lU3BlYycpO1xuICAgICAgICBpZiAoZmFrZUFzeW5jWm9uZVNwZWMpIHtcbiAgICAgICAgICByZXR1cm4gZmFrZUFzeW5jWm9uZVNwZWMudGljay5hcHBseShmYWtlQXN5bmNab25lU3BlYywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3JpZ2luYWxUaWNrLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgY29uc3Qgb3JpZ2luYWxNb2NrRGF0ZSA9IChjbG9ja1tzeW1ib2woJ21vY2tEYXRlJyldID0gY2xvY2subW9ja0RhdGUpO1xuICAgICAgY2xvY2subW9ja0RhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZmFrZUFzeW5jWm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICAgICAgaWYgKGZha2VBc3luY1pvbmVTcGVjKSB7XG4gICAgICAgICAgY29uc3QgZGF0ZVRpbWUgPSBhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IG5ldyBEYXRlKCk7XG4gICAgICAgICAgcmV0dXJuIGZha2VBc3luY1pvbmVTcGVjLnNldEN1cnJlbnRSZWFsVGltZS5hcHBseShcbiAgICAgICAgICAgICAgZmFrZUFzeW5jWm9uZVNwZWMsXG4gICAgICAgICAgICAgIGRhdGVUaW1lICYmIHR5cGVvZiBkYXRlVGltZS5nZXRUaW1lID09PSAnZnVuY3Rpb24nID8gW2RhdGVUaW1lLmdldFRpbWUoKV0gOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsTW9ja0RhdGUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICAvLyBmb3IgYXV0byBnbyBpbnRvIGZha2VBc3luYyBmZWF0dXJlLCB3ZSBuZWVkIHRoZSBmbGFnIHRvIGVuYWJsZSBpdFxuICAgICAgaWYgKGVuYWJsZUNsb2NrUGF0Y2gpIHtcbiAgICAgICAgWydpbnN0YWxsJywgJ3VuaW5zdGFsbCddLmZvckVhY2gobWV0aG9kTmFtZSA9PiB7XG4gICAgICAgICAgY29uc3Qgb3JpZ2luYWxDbG9ja0ZuOiBGdW5jdGlvbiA9IChjbG9ja1tzeW1ib2wobWV0aG9kTmFtZSldID0gY2xvY2tbbWV0aG9kTmFtZV0pO1xuICAgICAgICAgIGNsb2NrW21ldGhvZE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zdCBGYWtlQXN5bmNUZXN0Wm9uZVNwZWMgPSAoWm9uZSBhcyBhbnkpWydGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgICAgICAgICAgIGlmIChGYWtlQXN5bmNUZXN0Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgICAgKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrSW5zdGFsbGVkJyldID0gJ2luc3RhbGwnID09PSBtZXRob2ROYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gb3JpZ2luYWxDbG9ja0ZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjbG9jaztcbiAgfTtcblxuICAvKipcbiAgICogR2V0cyBhIGZ1bmN0aW9uIHdyYXBwaW5nIHRoZSBib2R5IG9mIGEgSmFzbWluZSBgZGVzY3JpYmVgIGJsb2NrIHRvIGV4ZWN1dGUgaW4gYVxuICAgKiBzeW5jaHJvbm91cy1vbmx5IHpvbmUuXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwRGVzY3JpYmVJblpvbmUoZGVzY3JpYmVCb2R5OiBGdW5jdGlvbik6IEZ1bmN0aW9uIHtcbiAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gc3luY1pvbmUucnVuKGRlc2NyaWJlQm9keSwgdGhpcywgKGFyZ3VtZW50cyBhcyBhbnkpIGFzIGFueVtdKTtcbiAgICB9O1xuICB9XG5cbiAgZnVuY3Rpb24gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keTogRnVuY3Rpb24sIGFwcGx5VGhpczogYW55LCBxdWV1ZVJ1bm5lcjogYW55LCBkb25lPzogRnVuY3Rpb24pIHtcbiAgICBjb25zdCBpc0Nsb2NrSW5zdGFsbGVkID0gISEoamFzbWluZSBhcyBhbnkpW3N5bWJvbCgnY2xvY2tJbnN0YWxsZWQnKV07XG4gICAgY29uc3QgdGVzdFByb3h5Wm9uZVNwZWMgPSBxdWV1ZVJ1bm5lci50ZXN0UHJveHlab25lU3BlYztcbiAgICBjb25zdCB0ZXN0UHJveHlab25lID0gcXVldWVSdW5uZXIudGVzdFByb3h5Wm9uZTtcbiAgICBsZXQgbGFzdERlbGVnYXRlO1xuICAgIGlmIChpc0Nsb2NrSW5zdGFsbGVkICYmIGVuYWJsZUNsb2NrUGF0Y2gpIHtcbiAgICAgIC8vIGF1dG8gcnVuIGEgZmFrZUFzeW5jXG4gICAgICBjb25zdCBmYWtlQXN5bmNNb2R1bGUgPSAoWm9uZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnZmFrZUFzeW5jVGVzdCcpXTtcbiAgICAgIGlmIChmYWtlQXN5bmNNb2R1bGUgJiYgdHlwZW9mIGZha2VBc3luY01vZHVsZS5mYWtlQXN5bmMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGVzdEJvZHkgPSBmYWtlQXN5bmNNb2R1bGUuZmFrZUFzeW5jKHRlc3RCb2R5KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKGRvbmUpIHtcbiAgICAgIHJldHVybiB0ZXN0UHJveHlab25lLnJ1bih0ZXN0Qm9keSwgYXBwbHlUaGlzLCBbZG9uZV0pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGVzdFByb3h5Wm9uZS5ydW4odGVzdEJvZHksIGFwcGx5VGhpcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEdldHMgYSBmdW5jdGlvbiB3cmFwcGluZyB0aGUgYm9keSBvZiBhIEphc21pbmUgYGl0L2JlZm9yZUVhY2gvYWZ0ZXJFYWNoYCBibG9jayB0b1xuICAgKiBleGVjdXRlIGluIGEgUHJveHlab25lIHpvbmUuXG4gICAqIFRoaXMgd2lsbCBydW4gaW4gYHRlc3RQcm94eVpvbmVgLiBUaGUgYHRlc3RQcm94eVpvbmVgIHdpbGwgYmUgcmVzZXQgYnkgdGhlIGBab25lUXVldWVSdW5uZXJgXG4gICAqL1xuICBmdW5jdGlvbiB3cmFwVGVzdEluWm9uZSh0ZXN0Qm9keTogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgLy8gVGhlIGBkb25lYCBjYWxsYmFjayBpcyBvbmx5IHBhc3NlZCB0aHJvdWdoIGlmIHRoZSBmdW5jdGlvbiBleHBlY3RzIGF0IGxlYXN0IG9uZSBhcmd1bWVudC5cbiAgICAvLyBOb3RlIHdlIGhhdmUgdG8gbWFrZSBhIGZ1bmN0aW9uIHdpdGggY29ycmVjdCBudW1iZXIgb2YgYXJndW1lbnRzLCBvdGhlcndpc2UgamFzbWluZSB3aWxsXG4gICAgLy8gdGhpbmsgdGhhdCBhbGwgZnVuY3Rpb25zIGFyZSBzeW5jIG9yIGFzeW5jLlxuICAgIHJldHVybiAodGVzdEJvZHkgJiYgKHRlc3RCb2R5Lmxlbmd0aCA/IGZ1bmN0aW9uKGRvbmU6IEZ1bmN0aW9uKSB7XG4gICAgICAgICAgICAgIHJldHVybiBydW5JblRlc3Rab25lKHRlc3RCb2R5LCB0aGlzLCB0aGlzLnF1ZXVlUnVubmVyLCBkb25lKTtcbiAgICAgICAgICAgIH0gOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHJ1bkluVGVzdFpvbmUodGVzdEJvZHksIHRoaXMsIHRoaXMucXVldWVSdW5uZXIpO1xuICAgICAgICAgICAgfSkpO1xuICB9XG4gIGludGVyZmFjZSBRdWV1ZVJ1bm5lciB7XG4gICAgZXhlY3V0ZSgpOiB2b2lkO1xuICB9XG4gIGludGVyZmFjZSBRdWV1ZVJ1bm5lckF0dHJzIHtcbiAgICBxdWV1ZWFibGVGbnM6IHtmbjogRnVuY3Rpb259W107XG4gICAgb25Db21wbGV0ZTogKCkgPT4gdm9pZDtcbiAgICBjbGVhclN0YWNrOiAoZm46IGFueSkgPT4gdm9pZDtcbiAgICBvbkV4Y2VwdGlvbjogKGVycm9yOiBhbnkpID0+IHZvaWQ7XG4gICAgY2F0Y2hFeGNlcHRpb246ICgpID0+IGJvb2xlYW47XG4gICAgdXNlckNvbnRleHQ6IGFueTtcbiAgICB0aW1lb3V0OiB7c2V0VGltZW91dDogRnVuY3Rpb247IGNsZWFyVGltZW91dDogRnVuY3Rpb259O1xuICAgIGZhaWw6ICgpID0+IHZvaWQ7XG4gIH1cblxuICBjb25zdCBRdWV1ZVJ1bm5lciA9IChqYXNtaW5lIGFzIGFueSkuUXVldWVSdW5uZXIgYXMge1xuICAgIG5ldyAoYXR0cnM6IFF1ZXVlUnVubmVyQXR0cnMpOiBRdWV1ZVJ1bm5lcjtcbiAgfTtcbiAgKGphc21pbmUgYXMgYW55KS5RdWV1ZVJ1bm5lciA9IChmdW5jdGlvbihfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoWm9uZVF1ZXVlUnVubmVyLCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIFpvbmVRdWV1ZVJ1bm5lcihhdHRyczoge1xuICAgICAgb25Db21wbGV0ZTogRnVuY3Rpb247XG4gICAgICB1c2VyQ29udGV4dD86IGFueTtcbiAgICAgIHRpbWVvdXQ/OiB7c2V0VGltZW91dDogRnVuY3Rpb247IGNsZWFyVGltZW91dDogRnVuY3Rpb259O1xuICAgICAgb25FeGNlcHRpb24/OiAoZXJyb3I6IGFueSkgPT4gdm9pZDtcbiAgICB9KSB7XG4gICAgICBhdHRycy5vbkNvbXBsZXRlID0gKGZuID0+ICgpID0+IHtcbiAgICAgICAgLy8gQWxsIGZ1bmN0aW9ucyBhcmUgZG9uZSwgY2xlYXIgdGhlIHRlc3Qgem9uZS5cbiAgICAgICAgdGhpcy50ZXN0UHJveHlab25lID0gbnVsbDtcbiAgICAgICAgdGhpcy50ZXN0UHJveHlab25lU3BlYyA9IG51bGw7XG4gICAgICAgIGFtYmllbnRab25lLnNjaGVkdWxlTWljcm9UYXNrKCdqYXNtaW5lLm9uQ29tcGxldGUnLCBmbik7XG4gICAgICB9KShhdHRycy5vbkNvbXBsZXRlKTtcblxuICAgICAgY29uc3QgbmF0aXZlU2V0VGltZW91dCA9IF9nbG9iYWxbJ19fem9uZV9zeW1ib2xfX3NldFRpbWVvdXQnXTtcbiAgICAgIGNvbnN0IG5hdGl2ZUNsZWFyVGltZW91dCA9IF9nbG9iYWxbJ19fem9uZV9zeW1ib2xfX2NsZWFyVGltZW91dCddO1xuICAgICAgaWYgKG5hdGl2ZVNldFRpbWVvdXQpIHtcbiAgICAgICAgLy8gc2hvdWxkIHJ1biBzZXRUaW1lb3V0IGluc2lkZSBqYXNtaW5lIG91dHNpZGUgb2Ygem9uZVxuICAgICAgICBhdHRycy50aW1lb3V0ID0ge1xuICAgICAgICAgIHNldFRpbWVvdXQ6IG5hdGl2ZVNldFRpbWVvdXQgPyBuYXRpdmVTZXRUaW1lb3V0IDogX2dsb2JhbC5zZXRUaW1lb3V0LFxuICAgICAgICAgIGNsZWFyVGltZW91dDogbmF0aXZlQ2xlYXJUaW1lb3V0ID8gbmF0aXZlQ2xlYXJUaW1lb3V0IDogX2dsb2JhbC5jbGVhclRpbWVvdXRcbiAgICAgICAgfTtcbiAgICAgIH1cblxuICAgICAgLy8gY3JlYXRlIGEgdXNlckNvbnRleHQgdG8gaG9sZCB0aGUgcXVldWVSdW5uZXIgaXRzZWxmXG4gICAgICAvLyBzbyB3ZSBjYW4gYWNjZXNzIHRoZSB0ZXN0UHJveHkgaW4gaXQveGl0L2JlZm9yZUVhY2ggLi4uXG4gICAgICBpZiAoKGphc21pbmUgYXMgYW55KS5Vc2VyQ29udGV4dCkge1xuICAgICAgICBpZiAoIWF0dHJzLnVzZXJDb250ZXh0KSB7XG4gICAgICAgICAgYXR0cnMudXNlckNvbnRleHQgPSBuZXcgKGphc21pbmUgYXMgYW55KS5Vc2VyQ29udGV4dCgpO1xuICAgICAgICB9XG4gICAgICAgIGF0dHJzLnVzZXJDb250ZXh0LnF1ZXVlUnVubmVyID0gdGhpcztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghYXR0cnMudXNlckNvbnRleHQpIHtcbiAgICAgICAgICBhdHRycy51c2VyQ29udGV4dCA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGF0dHJzLnVzZXJDb250ZXh0LnF1ZXVlUnVubmVyID0gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gcGF0Y2ggYXR0cnMub25FeGNlcHRpb25cbiAgICAgIGNvbnN0IG9uRXhjZXB0aW9uID0gYXR0cnMub25FeGNlcHRpb247XG4gICAgICBhdHRycy5vbkV4Y2VwdGlvbiA9IGZ1bmN0aW9uKGVycm9yOiBhbnkpIHtcbiAgICAgICAgaWYgKGVycm9yICYmXG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID09PVxuICAgICAgICAgICAgICAgICdUaW1lb3V0IC0gQXN5bmMgY2FsbGJhY2sgd2FzIG5vdCBpbnZva2VkIHdpdGhpbiB0aW1lb3V0IHNwZWNpZmllZCBieSBqYXNtaW5lLkRFRkFVTFRfVElNRU9VVF9JTlRFUlZBTC4nKSB7XG4gICAgICAgICAgLy8gamFzbWluZSB0aW1lb3V0LCB3ZSBjYW4gbWFrZSB0aGUgZXJyb3IgbWVzc2FnZSBtb3JlXG4gICAgICAgICAgLy8gcmVhc29uYWJsZSB0byB0ZWxsIHdoYXQgdGFza3MgYXJlIHBlbmRpbmdcbiAgICAgICAgICBjb25zdCBwcm94eVpvbmVTcGVjOiBhbnkgPSB0aGlzICYmIHRoaXMudGVzdFByb3h5Wm9uZVNwZWM7XG4gICAgICAgICAgaWYgKHByb3h5Wm9uZVNwZWMpIHtcbiAgICAgICAgICAgIGNvbnN0IHBlbmRpbmdUYXNrc0luZm8gPSBwcm94eVpvbmVTcGVjLmdldEFuZENsZWFyUGVuZGluZ1Rhc2tzSW5mbygpO1xuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSArPSBwZW5kaW5nVGFza3NJbmZvO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob25FeGNlcHRpb24pIHtcbiAgICAgICAgICBvbkV4Y2VwdGlvbi5jYWxsKHRoaXMsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgX3N1cGVyLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH1cbiAgICBab25lUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB6b25lOiBab25lfG51bGwgPSBab25lLmN1cnJlbnQ7XG4gICAgICBsZXQgaXNDaGlsZE9mQW1iaWVudFpvbmUgPSBmYWxzZTtcbiAgICAgIHdoaWxlICh6b25lKSB7XG4gICAgICAgIGlmICh6b25lID09PSBhbWJpZW50Wm9uZSkge1xuICAgICAgICAgIGlzQ2hpbGRPZkFtYmllbnRab25lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB6b25lID0gem9uZS5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaGlsZE9mQW1iaWVudFpvbmUpIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBab25lOiAnICsgWm9uZS5jdXJyZW50Lm5hbWUpO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSB6b25lIHdoaWNoIHdpbGwgYmUgdXNlZCBmb3IgcnVubmluZyBpbmRpdmlkdWFsIHRlc3RzLlxuICAgICAgLy8gSXQgd2lsbCBiZSBhIHByb3h5IHpvbmUsIHNvIHRoYXQgdGhlIHRlc3RzIGZ1bmN0aW9uIGNhbiByZXRyb2FjdGl2ZWx5IGluc3RhbGxcbiAgICAgIC8vIGRpZmZlcmVudCB6b25lcy5cbiAgICAgIC8vIEV4YW1wbGU6XG4gICAgICAvLyAgIC0gSW4gYmVmb3JlRWFjaCgpIGRvIGNoaWxkWm9uZSA9IFpvbmUuY3VycmVudC5mb3JrKC4uLik7XG4gICAgICAvLyAgIC0gSW4gaXQoKSB0cnkgdG8gZG8gZmFrZUFzeW5jKCkuIFRoZSBpc3N1ZSBpcyB0aGF0IGJlY2F1c2UgdGhlIGJlZm9yZUVhY2ggZm9ya2VkIHRoZVxuICAgICAgLy8gICAgIHpvbmUgb3V0c2lkZSBvZiBmYWtlQXN5bmMgaXQgd2lsbCBiZSBhYmxlIHRvIGVzY2FwZSB0aGUgZmFrZUFzeW5jIHJ1bGVzLlxuICAgICAgLy8gICAtIEJlY2F1c2UgUHJveHlab25lIGlzIHBhcmVudCBmbyBgY2hpbGRab25lYCBmYWtlQXN5bmMgY2FuIHJldHJvYWN0aXZlbHkgYWRkXG4gICAgICAvLyAgICAgZmFrZUFzeW5jIGJlaGF2aW9yIHRvIHRoZSBjaGlsZFpvbmUuXG5cbiAgICAgIHRoaXMudGVzdFByb3h5Wm9uZVNwZWMgPSBuZXcgUHJveHlab25lU3BlYygpO1xuICAgICAgdGhpcy50ZXN0UHJveHlab25lID0gYW1iaWVudFpvbmUuZm9yayh0aGlzLnRlc3RQcm94eVpvbmVTcGVjKTtcbiAgICAgIGlmICghWm9uZS5jdXJyZW50VGFzaykge1xuICAgICAgICAvLyBpZiB3ZSBhcmUgbm90IHJ1bm5pbmcgaW4gYSB0YXNrIHRoZW4gaWYgc29tZW9uZSB3b3VsZCByZWdpc3RlciBhXG4gICAgICAgIC8vIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBhbmQgdGhlbiBjYWxsaW5nIGVsZW1lbnQuY2xpY2soKSB0aGVcbiAgICAgICAgLy8gYWRkRXZlbnRMaXN0ZW5lciBjYWxsYmFjayB3b3VsZCB0aGluayB0aGF0IGl0IGlzIHRoZSB0b3AgbW9zdCB0YXNrIGFuZCB3b3VsZFxuICAgICAgICAvLyBkcmFpbiB0aGUgbWljcm90YXNrIHF1ZXVlIG9uIGVsZW1lbnQuY2xpY2soKSB3aGljaCB3b3VsZCBiZSBpbmNvcnJlY3QuXG4gICAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiB3ZSBhbHdheXMgZm9yY2UgYSB0YXNrIHdoZW4gcnVubmluZyBqYXNtaW5lIHRlc3RzLlxuICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soXG4gICAgICAgICAgICAnamFzbWluZS5leGVjdXRlKCkuZm9yY2VUYXNrJywgKCkgPT4gUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBab25lUXVldWVSdW5uZXI7XG4gIH0pKFF1ZXVlUnVubmVyKTtcbn0pKCk7XG4iXX0=