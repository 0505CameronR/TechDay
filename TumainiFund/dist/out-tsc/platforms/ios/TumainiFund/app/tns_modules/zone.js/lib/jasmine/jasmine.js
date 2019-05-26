/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
'use strict';
(() => {
    const __extends = function (d, b) {
        for (const p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p];
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
    const _global = typeof window !== 'undefined' && window || typeof self !== 'undefined' && self || global;
    // Patch jasmine's describe/it/beforeEach/afterEach functions so test code always runs
    // in a testZone (ProxyZone). (See: angular/zone.js#91 & angular/angular#10503)
    if (!Zone)
        throw new Error('Missing: zone.js');
    if (typeof jasmine == 'undefined')
        throw new Error('Missing: jasmine.js');
    if (jasmine['__zone_patch__'])
        throw new Error(`'jasmine' has already been patched with 'Zone'.`);
    jasmine['__zone_patch__'] = true;
    const SyncTestZoneSpec = Zone['SyncTestZoneSpec'];
    const ProxyZoneSpec = Zone['ProxyZoneSpec'];
    if (!SyncTestZoneSpec)
        throw new Error('Missing: SyncTestZoneSpec');
    if (!ProxyZoneSpec)
        throw new Error('Missing: ProxyZoneSpec');
    const ambientZone = Zone.current;
    // Create a synchronous-only zone in which to run `describe` blocks in order to raise an
    // error if any asynchronous operations are attempted inside of a `describe` but outside of
    // a `beforeEach` or `it`.
    const syncZone = ambientZone.fork(new SyncTestZoneSpec('jasmine.describe'));
    const symbol = Zone.__symbol__;
    // whether patch jasmine clock when in fakeAsync
    const enableClockPatch = _global[symbol('fakeAsyncPatchLock')] === true;
    const ignoreUnhandledRejection = _global[symbol('ignoreUnhandledRejection')] === true;
    if (!ignoreUnhandledRejection) {
        const globalErrors = jasmine.GlobalErrors;
        if (globalErrors && !jasmine[symbol('GlobalErrors')]) {
            jasmine[symbol('GlobalErrors')] = globalErrors;
            jasmine.GlobalErrors = function () {
                const instance = new globalErrors();
                const originalInstall = instance.install;
                if (originalInstall && !instance[symbol('install')]) {
                    instance[symbol('install')] = originalInstall;
                    instance.install = function () {
                        const originalHandlers = process.listeners('unhandledRejection');
                        const r = originalInstall.apply(this, arguments);
                        process.removeAllListeners('unhandledRejection');
                        if (originalHandlers) {
                            originalHandlers.forEach(h => process.on('unhandledRejection', h));
                        }
                        return r;
                    };
                }
                return instance;
            };
        }
    }
    // Monkey patch all of the jasmine DSL so that each function runs in appropriate zone.
    const jasmineEnv = jasmine.getEnv();
    ['describe', 'xdescribe', 'fdescribe'].forEach(methodName => {
        let originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[methodName] = function (description, specDefinitions) {
            return originalJasmineFn.call(this, description, wrapDescribeInZone(specDefinitions));
        };
    });
    ['it', 'xit', 'fit'].forEach(methodName => {
        let originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (description, specDefinitions, timeout) {
            arguments[1] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    ['beforeEach', 'afterEach', 'beforeAll', 'afterAll'].forEach(methodName => {
        let originalJasmineFn = jasmineEnv[methodName];
        jasmineEnv[symbol(methodName)] = originalJasmineFn;
        jasmineEnv[methodName] = function (specDefinitions, timeout) {
            arguments[0] = wrapTestInZone(specDefinitions);
            return originalJasmineFn.apply(this, arguments);
        };
    });
    // need to patch jasmine.clock().mockDate and jasmine.clock().tick() so
    // they can work properly in FakeAsyncTest
    const originalClockFn = (jasmine[symbol('clock')] = jasmine['clock']);
    jasmine['clock'] = function () {
        const clock = originalClockFn.apply(this, arguments);
        if (!clock[symbol('patched')]) {
            clock[symbol('patched')] = symbol('patched');
            const originalTick = (clock[symbol('tick')] = clock.tick);
            clock.tick = function () {
                const fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    return fakeAsyncZoneSpec.tick.apply(fakeAsyncZoneSpec, arguments);
                }
                return originalTick.apply(this, arguments);
            };
            const originalMockDate = (clock[symbol('mockDate')] = clock.mockDate);
            clock.mockDate = function () {
                const fakeAsyncZoneSpec = Zone.current.get('FakeAsyncTestZoneSpec');
                if (fakeAsyncZoneSpec) {
                    const dateTime = arguments.length > 0 ? arguments[0] : new Date();
                    return fakeAsyncZoneSpec.setCurrentRealTime.apply(fakeAsyncZoneSpec, dateTime && typeof dateTime.getTime === 'function' ? [dateTime.getTime()] :
                        arguments);
                }
                return originalMockDate.apply(this, arguments);
            };
            // for auto go into fakeAsync feature, we need the flag to enable it
            if (enableClockPatch) {
                ['install', 'uninstall'].forEach(methodName => {
                    const originalClockFn = (clock[symbol(methodName)] = clock[methodName]);
                    clock[methodName] = function () {
                        const FakeAsyncTestZoneSpec = Zone['FakeAsyncTestZoneSpec'];
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
        const isClockInstalled = !!jasmine[symbol('clockInstalled')];
        const testProxyZoneSpec = queueRunner.testProxyZoneSpec;
        const testProxyZone = queueRunner.testProxyZone;
        let lastDelegate;
        if (isClockInstalled && enableClockPatch) {
            // auto run a fakeAsync
            const fakeAsyncModule = Zone[Zone.__symbol__('fakeAsyncTest')];
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
    const QueueRunner = jasmine.QueueRunner;
    jasmine.QueueRunner = (function (_super) {
        __extends(ZoneQueueRunner, _super);
        function ZoneQueueRunner(attrs) {
            attrs.onComplete = (fn => () => {
                // All functions are done, clear the test zone.
                this.testProxyZone = null;
                this.testProxyZoneSpec = null;
                ambientZone.scheduleMicroTask('jasmine.onComplete', fn);
            })(attrs.onComplete);
            const nativeSetTimeout = _global['__zone_symbol__setTimeout'];
            const nativeClearTimeout = _global['__zone_symbol__clearTimeout'];
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
            const onException = attrs.onException;
            attrs.onException = function (error) {
                if (error &&
                    error.message ===
                        'Timeout - Async callback was not invoked within timeout specified by jasmine.DEFAULT_TIMEOUT_INTERVAL.') {
                    // jasmine timeout, we can make the error message more
                    // reasonable to tell what tasks are pending
                    const proxyZoneSpec = this && this.testProxyZoneSpec;
                    if (proxyZoneSpec) {
                        const pendingTasksInfo = proxyZoneSpec.getAndClearPendingTasksInfo();
                        try {
                            // try catch here in case error.message is not writable
                            error.message += pendingTasksInfo;
                        }
                        catch (err) {
                        }
                    }
                }
                if (onException) {
                    onException.call(this, error);
                }
            };
            _super.call(this, attrs);
        }
        ZoneQueueRunner.prototype.execute = function () {
            let zone = Zone.current;
            let isChildOfAmbientZone = false;
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
                Zone.current.scheduleMicroTask('jasmine.execute().forceTask', () => QueueRunner.prototype.execute.call(this));
            }
            else {
                _super.prototype.execute.call(this);
            }
        };
        return ZoneQueueRunner;
    })(QueueRunner);
})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2phc21pbmUvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxZQUFZLENBQUM7QUFDYixDQUFDLEdBQUcsRUFBRTtJQUNKLE1BQU0sU0FBUyxHQUFHLFVBQVMsQ0FBTSxFQUFFLENBQU07UUFDdkMsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFNBQVMsRUFBRTtZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFLLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDbEcsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxPQUFPLEdBQ1QsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQztJQUM3RixzRkFBc0Y7SUFDdEYsK0VBQStFO0lBQy9FLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9DLElBQUksT0FBTyxPQUFPLElBQUksV0FBVztRQUFFLE1BQU0sSUFBSSxL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T0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2FBQ3BGO2lCQUFNO2dCQUNMLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNyQztRQUNILENBQUMsQ0FBQztRQUNGLE9BQU8sZUFBZSxDQUFDO0lBQ3pCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ2xCLENBQUMsQ0FBQyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbid1c2Ugc3RyaWN0JztcbigoKSA9PiB7XG4gIGNvbnN0IF9fZXh0ZW5kcyA9IGZ1bmN0aW9uKGQ6IGFueSwgYjogYW55KSB7XG4gICAgZm9yIChjb25zdCBwIGluIGIpXG4gICAgICBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07XG4gICAgZnVuY3Rpb24gX18oKSB7XG4gICAgICB0aGlzLmNvbnN0cnVjdG9yID0gZDtcbiAgICB9XG4gICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6ICgoX18ucHJvdG90eXBlID0gYi5wcm90b3R5cGUpLCBuZXcgKF9fIGFzIGFueSkoKSk7XG4gIH07XG4gIGNvbnN0IF9nbG9iYWw6IGFueSA9XG4gICAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cgfHwgdHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnICYmIHNlbGYgfHwgZ2xvYmFsO1xuICAvLyBQYXRjaCBqYXNtaW5lJ3MgZGVzY3JpYmUvaXQvYmVmb3JlRWFjaC9hZnRlckVhY2ggZnVuY3Rpb25zIHNvIHRlc3QgY29kZSBhbHdheXMgcnVuc1xuICAvLyBpbiBhIHRlc3Rab25lIChQcm94eVpvbmUpLiAoU2VlOiBhbmd1bGFyL3pvbmUuanMjOTEgJiBhbmd1bGFyL2FuZ3VsYXIjMTA1MDMpXG4gIGlmICghWm9uZSkgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiB6b25lLmpzJyk7XG4gIGlmICh0eXBlb2YgamFzbWluZSA9PSAndW5kZWZpbmVkJykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBqYXNtaW5lLmpzJyk7XG4gIGlmICgoamFzbWluZSBhcyBhbnkpWydfX3pvbmVfcGF0Y2hfXyddKVxuICAgIHRocm93IG5ldyBFcnJvcihgJ2phc21pbmUnIGhhcyBhbHJlYWR5IGJlZW4gcGF0Y2hlZCB3aXRoICdab25lJy5gKTtcbiAgKGphc21pbmUgYXMgYW55KVsnX196b25lX3BhdGNoX18nXSA9IHRydWU7XG5cbiAgY29uc3QgU3luY1Rlc3Rab25lU3BlYzoge25ldyAobmFtZTogc3RyaW5nKTogWm9uZVNwZWN9ID0gKFpvbmUgYXMgYW55KVsnU3luY1Rlc3Rab25lU3BlYyddO1xuICBjb25zdCBQcm94eVpvbmVTcGVjOiB7bmV3ICgpOiBab25lU3BlY30gPSAoWm9uZSBhcyBhbnkpWydQcm94eVpvbmVTcGVjJ107XG4gIGlmICghU3luY1Rlc3Rab25lU3BlYykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBTeW5jVGVzdFpvbmVTcGVjJyk7XG4gIGlmICghUHJveHlab25lU3BlYykgdGhyb3cgbmV3IEVycm9yKCdNaXNzaW5nOiBQcm94eVpvbmVTcGVjJyk7XG5cbiAgY29uc3QgYW1iaWVudFpvbmUgPSBab25lLmN1cnJlbnQ7XG4gIC8vIENyZWF0ZSBhIHN5bmNocm9ub3VzLW9ubHkgem9uZSBpbiB3aGljaCB0byBydW4gYGRlc2NyaWJlYCBibG9ja3MgaW4gb3JkZXIgdG8gcmFpc2UgYW5cbiAgLy8gZXJyb3IgaWYgYW55IGFzeW5jaHJvbm91cyBvcGVyYXRpb25zIGFyZSBhdHRlbXB0ZWQgaW5zaWRlIG9mIGEgYGRlc2NyaWJlYCBidXQgb3V0c2lkZSBvZlxuICAvLyBhIGBiZWZvcmVFYWNoYCBvciBgaXRgLlxuICBjb25zdCBzeW5jWm9uZSA9IGFtYmllbnRab25lLmZvcmsobmV3IFN5bmNUZXN0Wm9uZVNwZWMoJ2phc21pbmUuZGVzY3JpYmUnKSk7XG5cbiAgY29uc3Qgc3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fO1xuXG4gIC8vIHdoZXRoZXIgcGF0Y2ggamFzbWluZSBjbG9jayB3aGVuIGluIGZha2VBc3luY1xuICBjb25zdCBlbmFibGVDbG9ja1BhdGNoID0gX2dsb2JhbFtzeW1ib2woJ2Zha2VBc3luY1BhdGNoTG9jaycpXSA9PT0gdHJ1ZTtcblxuICBjb25zdCBpZ25vcmVVbmhhbmRsZWRSZWplY3Rpb24gPSBfZ2xvYmFsW3N5bWJvbCgnaWdub3JlVW5oYW5kbGVkUmVqZWN0aW9uJyldID09PSB0cnVlO1xuXG4gIGlmICghaWdub3JlVW5oYW5kbGVkUmVqZWN0aW9uKSB7XG4gICAgY29uc3QgZ2xvYmFsRXJyb3JzID0gKGphc21pbmUgYXMgYW55KS5HbG9iYWxFcnJvcnM7XG4gICAgaWYgKGdsb2JhbEVycm9ycyAmJiAhKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ0dsb2JhbEVycm9ycycpXSkge1xuICAgICAgKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ0dsb2JhbEVycm9ycycpXSA9IGdsb2JhbEVycm9ycztcbiAgICAgIChqYXNtaW5lIGFzIGFueSkuR2xvYmFsRXJyb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGluc3RhbmNlID0gbmV3IGdsb2JhbEVycm9ycygpO1xuICAgICAgICBjb25zdCBvcmlnaW5hbEluc3RhbGwgPSBpbnN0YW5jZS5pbnN0YWxsO1xuICAgICAgICBpZiAob3JpZ2luYWxJbnN0YWxsICYmICFpbnN0YW5jZVtzeW1ib2woJ2luc3RhbGwnKV0pIHtcbiAgICAgICAgICBpbnN0YW5jZVtzeW1ib2woJ2luc3RhbGwnKV0gPSBvcmlnaW5hbEluc3RhbGw7XG4gICAgICAgICAgaW5zdGFuY2UuaW5zdGFsbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxIYW5kbGVycyA9IHByb2Nlc3MubGlzdGVuZXJzKCd1bmhhbmRsZWRSZWplY3Rpb24nKTtcbiAgICAgICAgICAgIGNvbnN0IHIgPSBvcmlnaW5hbEluc3RhbGwuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIHByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzKCd1bmhhbmRsZWRSZWplY3Rpb24nKTtcbiAgICAgICAgICAgIGlmIChvcmlnaW5hbEhhbmRsZXJzKSB7XG4gICAgICAgICAgICAgIG9yaWdpbmFsSGFuZGxlcnMuZm9yRWFjaChoID0+IHByb2Nlc3Mub24oJ3VuaGFuZGxlZFJlamVjdGlvbicsIGgpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlO1xuICAgICAgfTtcbiAgICB9XG4gIH1cblxuICAvLyBNb25rZXkgcGF0Y2ggYWxsIG9mIHRoZSBqYXNtaW5lIERTTCBzbyB0aGF0IGVhY2ggZnVuY3Rpb24gcnVucyBpbiBhcHByb3ByaWF0ZSB6b25lLlxuICBjb25zdCBqYXNtaW5lRW52OiBhbnkgPSBqYXNtaW5lLmdldEVudigpO1xuICBbJ2Rlc2NyaWJlJywgJ3hkZXNjcmliZScsICdmZGVzY3JpYmUnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihkZXNjcmlwdGlvbjogc3RyaW5nLCBzcGVjRGVmaW5pdGlvbnM6IEZ1bmN0aW9uKSB7XG4gICAgICByZXR1cm4gb3JpZ2luYWxKYXNtaW5lRm4uY2FsbCh0aGlzLCBkZXNjcmlwdGlvbiwgd3JhcERlc2NyaWJlSW5ab25lKHNwZWNEZWZpbml0aW9ucykpO1xuICAgIH07XG4gIH0pO1xuICBbJ2l0JywgJ3hpdCcsICdmaXQnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgIGxldCBvcmlnaW5hbEphc21pbmVGbjogRnVuY3Rpb24gPSBqYXNtaW5lRW52W21ldGhvZE5hbWVdO1xuICAgIGphc21pbmVFbnZbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IG9yaWdpbmFsSmFzbWluZUZuO1xuICAgIGphc21pbmVFbnZbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbihcbiAgICAgICAgZGVzY3JpcHRpb246IHN0cmluZywgc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbiwgdGltZW91dDogbnVtYmVyKSB7XG4gICAgICBhcmd1bWVudHNbMV0gPSB3cmFwVGVzdEluWm9uZShzcGVjRGVmaW5pdGlvbnMpO1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG4gIFsnYmVmb3JlRWFjaCcsICdhZnRlckVhY2gnLCAnYmVmb3JlQWxsJywgJ2FmdGVyQWxsJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W3N5bWJvbChtZXRob2ROYW1lKV0gPSBvcmlnaW5hbEphc21pbmVGbjtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbiwgdGltZW91dDogbnVtYmVyKSB7XG4gICAgICBhcmd1bWVudHNbMF0gPSB3cmFwVGVzdEluWm9uZShzcGVjRGVmaW5pdGlvbnMpO1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gbmVlZCB0byBwYXRjaCBqYXNtaW5lLmNsb2NrKCkubW9ja0RhdGUgYW5kIGphc21pbmUuY2xvY2soKS50aWNrKCkgc29cbiAgLy8gdGhleSBjYW4gd29yayBwcm9wZXJseSBpbiBGYWtlQXN5bmNUZXN0XG4gIGNvbnN0IG9yaWdpbmFsQ2xvY2tGbjogRnVuY3Rpb24gPSAoKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrJyldID0gamFzbWluZVsnY2xvY2snXSk7XG4gIChqYXNtaW5lIGFzIGFueSlbJ2Nsb2NrJ10gPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjbG9jayA9IG9yaWdpbmFsQ2xvY2tGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICghY2xvY2tbc3ltYm9sKCdwYXRjaGVkJyldKSB7XG4gICAgICBjbG9ja1tzeW1ib2woJ3BhdGNoZWQnKV0gPSBzeW1ib2woJ3BhdGNoZWQnKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVGljayA9IChjbG9ja1tzeW1ib2woJ3RpY2snKV0gPSBjbG9jay50aWNrKTtcbiAgICAgIGNsb2NrLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZmFrZUFzeW5jWm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICAgICAgaWYgKGZha2VBc3luY1pvbmVTcGVjKSB7XG4gICAgICAgICAgcmV0dXJuIGZha2VBc3luY1pvbmVTcGVjLnRpY2suYXBwbHkoZmFrZUFzeW5jWm9uZVNwZWMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsVGljay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsTW9ja0RhdGUgPSAoY2xvY2tbc3ltYm9sKCdtb2NrRGF0ZScpXSA9IGNsb2NrLm1vY2tEYXRlKTtcbiAgICAgIGNsb2NrLm1vY2tEYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGZha2VBc3luY1pvbmVTcGVjID0gWm9uZS5jdXJyZW50LmdldCgnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJyk7XG4gICAgICAgIGlmIChmYWtlQXN5bmNab25lU3BlYykge1xuICAgICAgICAgIGNvbnN0IGRhdGVUaW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiBuZXcgRGF0ZSgpO1xuICAgICAgICAgIHJldHVybiBmYWtlQXN5bmNab25lU3BlYy5zZXRDdXJyZW50UmVhbFRpbWUuYXBwbHkoXG4gICAgICAgICAgICAgIGZha2VBc3luY1pvbmVTcGVjLFxuICAgICAgICAgICAgICBkYXRlVGltZSAmJiB0eXBlb2YgZGF0ZVRpbWUuZ2V0VGltZSA9PT0gJ2Z1bmN0aW9uJyA/IFtkYXRlVGltZS5nZXRUaW1lKCldIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE1vY2tEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgLy8gZm9yIGF1dG8gZ28gaW50byBmYWtlQXN5bmMgZmVhdHVyZSwgd2UgbmVlZCB0aGUgZmxhZyB0byBlbmFibGUgaXRcbiAgICAgIGlmIChlbmFibGVDbG9ja1BhdGNoKSB7XG4gICAgICAgIFsnaW5zdGFsbCcsICd1bmluc3RhbGwnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IG9yaWdpbmFsQ2xvY2tGbjogRnVuY3Rpb24gPSAoY2xvY2tbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IGNsb2NrW21ldGhvZE5hbWVdKTtcbiAgICAgICAgICBjbG9ja1ttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgRmFrZUFzeW5jVGVzdFpvbmVTcGVjID0gKFpvbmUgYXMgYW55KVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ107XG4gICAgICAgICAgICBpZiAoRmFrZUFzeW5jVGVzdFpvbmVTcGVjKSB7XG4gICAgICAgICAgICAgIChqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9ja0luc3RhbGxlZCcpXSA9ICdpbnN0YWxsJyA9PT0gbWV0aG9kTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsQ2xvY2tGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvY2s7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgYSBmdW5jdGlvbiB3cmFwcGluZyB0aGUgYm9keSBvZiBhIEphc21pbmUgYGRlc2NyaWJlYCBibG9jayB0byBleGVjdXRlIGluIGFcbiAgICogc3luY2hyb25vdXMtb25seSB6b25lLlxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcERlc2NyaWJlSW5ab25lKGRlc2NyaWJlQm9keTogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN5bmNab25lLnJ1bihkZXNjcmliZUJvZHksIHRoaXMsIChhcmd1bWVudHMgYXMgYW55KSBhcyBhbnlbXSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkluVGVzdFpvbmUodGVzdEJvZHk6IEZ1bmN0aW9uLCBhcHBseVRoaXM6IGFueSwgcXVldWVSdW5uZXI6IGFueSwgZG9uZT86IEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgaXNDbG9ja0luc3RhbGxlZCA9ICEhKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrSW5zdGFsbGVkJyldO1xuICAgIGNvbnN0IHRlc3RQcm94eVpvbmVTcGVjID0gcXVldWVSdW5uZXIudGVzdFByb3h5Wm9uZVNwZWM7XG4gICAgY29uc3QgdGVzdFByb3h5Wm9uZSA9IHF1ZXVlUnVubmVyLnRlc3RQcm94eVpvbmU7XG4gICAgbGV0IGxhc3REZWxlZ2F0ZTtcbiAgICBpZiAoaXNDbG9ja0luc3RhbGxlZCAmJiBlbmFibGVDbG9ja1BhdGNoKSB7XG4gICAgICAvLyBhdXRvIHJ1biBhIGZha2VBc3luY1xuICAgICAgY29uc3QgZmFrZUFzeW5jTW9kdWxlID0gKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ2Zha2VBc3luY1Rlc3QnKV07XG4gICAgICBpZiAoZmFrZUFzeW5jTW9kdWxlICYmIHR5cGVvZiBmYWtlQXN5bmNNb2R1bGUuZmFrZUFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRlc3RCb2R5ID0gZmFrZUFzeW5jTW9kdWxlLmZha2VBc3luYyh0ZXN0Qm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkb25lKSB7XG4gICAgICByZXR1cm4gdGVzdFByb3h5Wm9uZS5ydW4odGVzdEJvZHksIGFwcGx5VGhpcywgW2RvbmVdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRlc3RQcm94eVpvbmUucnVuKHRlc3RCb2R5LCBhcHBseVRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIGJvZHkgb2YgYSBKYXNtaW5lIGBpdC9iZWZvcmVFYWNoL2FmdGVyRWFjaGAgYmxvY2sgdG9cbiAgICogZXhlY3V0ZSBpbiBhIFByb3h5Wm9uZSB6b25lLlxuICAgKiBUaGlzIHdpbGwgcnVuIGluIGB0ZXN0UHJveHlab25lYC4gVGhlIGB0ZXN0UHJveHlab25lYCB3aWxsIGJlIHJlc2V0IGJ5IHRoZSBgWm9uZVF1ZXVlUnVubmVyYFxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcFRlc3RJblpvbmUodGVzdEJvZHk6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIC8vIFRoZSBgZG9uZWAgY2FsbGJhY2sgaXMgb25seSBwYXNzZWQgdGhyb3VnaCBpZiB0aGUgZnVuY3Rpb24gZXhwZWN0cyBhdCBsZWFzdCBvbmUgYXJndW1lbnQuXG4gICAgLy8gTm90ZSB3ZSBoYXZlIHRvIG1ha2UgYSBmdW5jdGlvbiB3aXRoIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cywgb3RoZXJ3aXNlIGphc21pbmUgd2lsbFxuICAgIC8vIHRoaW5rIHRoYXQgYWxsIGZ1bmN0aW9ucyBhcmUgc3luYyBvciBhc3luYy5cbiAgICByZXR1cm4gKHRlc3RCb2R5ICYmICh0ZXN0Qm9keS5sZW5ndGggPyBmdW5jdGlvbihkb25lOiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keSwgdGhpcywgdGhpcy5xdWV1ZVJ1bm5lciwgZG9uZSk7XG4gICAgICAgICAgICB9IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBydW5JblRlc3Rab25lKHRlc3RCb2R5LCB0aGlzLCB0aGlzLnF1ZXVlUnVubmVyKTtcbiAgICAgICAgICAgIH0pKTtcbiAgfVxuICBpbnRlcmZhY2UgUXVldWVSdW5uZXIge1xuICAgIGV4ZWN1dGUoKTogdm9pZDtcbiAgfVxuICBpbnRlcmZhY2UgUXVldWVSdW5uZXJBdHRycyB7XG4gICAgcXVldWVhYmxlRm5zOiB7Zm46IEZ1bmN0aW9ufVtdO1xuICAgIGNsZWFyU3RhY2s6IChmbjogYW55KSA9PiB2b2lkO1xuICAgIGNhdGNoRXhjZXB0aW9uOiAoKSA9PiBib29sZWFuO1xuICAgIGZhaWw6ICgpID0+IHZvaWQ7XG4gICAgb25Db21wbGV0ZTogKCkgPT4gdm9pZDtcbiAgICBvbkV4Y2VwdGlvbjogKGVycm9yOiBhbnkpID0+IHZvaWQ7XG4gICAgdXNlckNvbnRleHQ6IGFueTtcbiAgICB0aW1lb3V0OiB7c2V0VGltZW91dDogRnVuY3Rpb247IGNsZWFyVGltZW91dDogRnVuY3Rpb259O1xuICB9XG5cbiAgY29uc3QgUXVldWVSdW5uZXIgPSAoamFzbWluZSBhcyBhbnkpLlF1ZXVlUnVubmVyIGFzIHtcbiAgICBuZXcgKGF0dHJzOiBRdWV1ZVJ1bm5lckF0dHJzKTogUXVldWVSdW5uZXI7XG4gIH07XG4gIChqYXNtaW5lIGFzIGFueSkuUXVldWVSdW5uZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFpvbmVRdWV1ZVJ1bm5lciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBab25lUXVldWVSdW5uZXIoYXR0cnM6IFF1ZXVlUnVubmVyQXR0cnMpIHtcbiAgICAgIGF0dHJzLm9uQ29tcGxldGUgPSAoZm4gPT4gKCkgPT4ge1xuICAgICAgICAvLyBBbGwgZnVuY3Rpb25zIGFyZSBkb25lLCBjbGVhciB0aGUgdGVzdCB6b25lLlxuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmUgPSBudWxsO1xuICAgICAgICB0aGlzLnRlc3RQcm94eVpvbmVTcGVjID0gbnVsbDtcbiAgICAgICAgYW1iaWVudFpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soJ2phc21pbmUub25Db21wbGV0ZScsIGZuKTtcbiAgICAgIH0pKGF0dHJzLm9uQ29tcGxldGUpO1xuXG4gICAgICBjb25zdCBuYXRpdmVTZXRUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fc2V0VGltZW91dCddO1xuICAgICAgY29uc3QgbmF0aXZlQ2xlYXJUaW1lb3V0ID0gX2dsb2JhbFsnX196b25lX3N5bWJvbF9fY2xlYXJUaW1lb3V0J107XG4gICAgICBpZiAobmF0aXZlU2V0VGltZW91dCkge1xuICAgICAgICAvLyBzaG91bGQgcnVuIHNldFRpbWVvdXQgaW5zaWRlIGphc21pbmUgb3V0c2lkZSBvZiB6b25lXG4gICAgICAgIGF0dHJzLnRpbWVvdXQgPSB7XG4gICAgICAgICAgc2V0VGltZW91dDogbmF0aXZlU2V0VGltZW91dCA/IG5hdGl2ZVNldFRpbWVvdXQgOiBfZ2xvYmFsLnNldFRpbWVvdXQsXG4gICAgICAgICAgY2xlYXJUaW1lb3V0OiBuYXRpdmVDbGVhclRpbWVvdXQgPyBuYXRpdmVDbGVhclRpbWVvdXQgOiBfZ2xvYmFsLmNsZWFyVGltZW91dFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICAvLyBjcmVhdGUgYSB1c2VyQ29udGV4dCB0byBob2xkIHRoZSBxdWV1ZVJ1bm5lciBpdHNlbGZcbiAgICAgIC8vIHNvIHdlIGNhbiBhY2Nlc3MgdGhlIHRlc3RQcm94eSBpbiBpdC94aXQvYmVmb3JlRWFjaCAuLi5cbiAgICAgIGlmICgoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KSB7XG4gICAgICAgIGlmICghYXR0cnMudXNlckNvbnRleHQpIHtcbiAgICAgICAgICBhdHRycy51c2VyQ29udGV4dCA9IG5ldyAoamFzbWluZSBhcyBhbnkpLlVzZXJDb250ZXh0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKCFhdHRycy51c2VyQ29udGV4dCkge1xuICAgICAgICAgIGF0dHJzLnVzZXJDb250ZXh0ID0ge307XG4gICAgICAgIH1cbiAgICAgICAgYXR0cnMudXNlckNvbnRleHQucXVldWVSdW5uZXIgPSB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBwYXRjaCBhdHRycy5vbkV4Y2VwdGlvblxuICAgICAgY29uc3Qgb25FeGNlcHRpb24gPSBhdHRycy5vbkV4Y2VwdGlvbjtcbiAgICAgIGF0dHJzLm9uRXhjZXB0aW9uID0gZnVuY3Rpb24oZXJyb3I6IGFueSkge1xuICAgICAgICBpZiAoZXJyb3IgJiZcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPT09XG4gICAgICAgICAgICAgICAgJ1RpbWVvdXQgLSBBc3luYyBjYWxsYmFjayB3YXMgbm90IGludm9rZWQgd2l0aGluIHRpbWVvdXQgc3BlY2lmaWVkIGJ5IGphc21pbmUuREVGQVVMVF9USU1FT1VUX0lOVEVSVkFMLicpIHtcbiAgICAgICAgICAvLyBqYXNtaW5lIHRpbWVvdXQsIHdlIGNhbiBtYWtlIHRoZSBlcnJvciBtZXNzYWdlIG1vcmVcbiAgICAgICAgICAvLyByZWFzb25hYmxlIHRvIHRlbGwgd2hhdCB0YXNrcyBhcmUgcGVuZGluZ1xuICAgICAgICAgIGNvbnN0IHByb3h5Wm9uZVNwZWM6IGFueSA9IHRoaXMgJiYgdGhpcy50ZXN0UHJveHlab25lU3BlYztcbiAgICAgICAgICBpZiAocHJveHlab25lU3BlYykge1xuICAgICAgICAgICAgY29uc3QgcGVuZGluZ1Rhc2tzSW5mbyA9IHByb3h5Wm9uZVNwZWMuZ2V0QW5kQ2xlYXJQZW5kaW5nVGFza3NJbmZvKCk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAvLyB0cnkgY2F0Y2ggaGVyZSBpbiBjYXNlIGVycm9yLm1lc3NhZ2UgaXMgbm90IHdyaXRhYmxlXG4gICAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgKz0gcGVuZGluZ1Rhc2tzSW5mbztcbiAgICAgICAgICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAob25FeGNlcHRpb24pIHtcbiAgICAgICAgICBvbkV4Y2VwdGlvbi5jYWxsKHRoaXMsIGVycm9yKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgX3N1cGVyLmNhbGwodGhpcywgYXR0cnMpO1xuICAgIH1cbiAgICBab25lUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCB6b25lOiBab25lfG51bGwgPSBab25lLmN1cnJlbnQ7XG4gICAgICBsZXQgaXNDaGlsZE9mQW1iaWVudFpvbmUgPSBmYWxzZTtcbiAgICAgIHdoaWxlICh6b25lKSB7XG4gICAgICAgIGlmICh6b25lID09PSBhbWJpZW50Wm9uZSkge1xuICAgICAgICAgIGlzQ2hpbGRPZkFtYmllbnRab25lID0gdHJ1ZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB6b25lID0gem9uZS5wYXJlbnQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNDaGlsZE9mQW1iaWVudFpvbmUpIHRocm93IG5ldyBFcnJvcignVW5leHBlY3RlZCBab25lOiAnICsgWm9uZS5jdXJyZW50Lm5hbWUpO1xuXG4gICAgICAvLyBUaGlzIGlzIHRoZSB6b25lIHdoaWNoIHdpbGwgYmUgdXNlZCBmb3IgcnVubmluZyBpbmRpdmlkdWFsIHRlc3RzLlxuICAgICAgLy8gSXQgd2lsbCBiZSBhIHByb3h5IHpvbmUsIHNvIHRoYXQgdGhlIHRlc3RzIGZ1bmN0aW9uIGNhbiByZXRyb2FjdGl2ZWx5IGluc3RhbGxcbiAgICAgIC8vIGRpZmZlcmVudCB6b25lcy5cbiAgICAgIC8vIEV4YW1wbGU6XG4gICAgICAvLyAgIC0gSW4gYmVmb3JlRWFjaCgpIGRvIGNoaWxkWm9uZSA9IFpvbmUuY3VycmVudC5mb3JrKC4uLik7XG4gICAgICAvLyAgIC0gSW4gaXQoKSB0cnkgdG8gZG8gZmFrZUFzeW5jKCkuIFRoZSBpc3N1ZSBpcyB0aGF0IGJlY2F1c2UgdGhlIGJlZm9yZUVhY2ggZm9ya2VkIHRoZVxuICAgICAgLy8gICAgIHpvbmUgb3V0c2lkZSBvZiBmYWtlQXN5bmMgaXQgd2lsbCBiZSBhYmxlIHRvIGVzY2FwZSB0aGUgZmFrZUFzeW5jIHJ1bGVzLlxuICAgICAgLy8gICAtIEJlY2F1c2UgUHJveHlab25lIGlzIHBhcmVudCBmbyBgY2hpbGRab25lYCBmYWtlQXN5bmMgY2FuIHJldHJvYWN0aXZlbHkgYWRkXG4gICAgICAvLyAgICAgZmFrZUFzeW5jIGJlaGF2aW9yIHRvIHRoZSBjaGlsZFpvbmUuXG5cbiAgICAgIHRoaXMudGVzdFByb3h5Wm9uZVNwZWMgPSBuZXcgUHJveHlab25lU3BlYygpO1xuICAgICAgdGhpcy50ZXN0UHJveHlab25lID0gYW1iaWVudFpvbmUuZm9yayh0aGlzLnRlc3RQcm94eVpvbmVTcGVjKTtcbiAgICAgIGlmICghWm9uZS5jdXJyZW50VGFzaykge1xuICAgICAgICAvLyBpZiB3ZSBhcmUgbm90IHJ1bm5pbmcgaW4gYSB0YXNrIHRoZW4gaWYgc29tZW9uZSB3b3VsZCByZWdpc3RlciBhXG4gICAgICAgIC8vIGVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lciBhbmQgdGhlbiBjYWxsaW5nIGVsZW1lbnQuY2xpY2soKSB0aGVcbiAgICAgICAgLy8gYWRkRXZlbnRMaXN0ZW5lciBjYWxsYmFjayB3b3VsZCB0aGluayB0aGF0IGl0IGlzIHRoZSB0b3AgbW9zdCB0YXNrIGFuZCB3b3VsZFxuICAgICAgICAvLyBkcmFpbiB0aGUgbWljcm90YXNrIHF1ZXVlIG9uIGVsZW1lbnQuY2xpY2soKSB3aGljaCB3b3VsZCBiZSBpbmNvcnJlY3QuXG4gICAgICAgIC8vIEZvciB0aGlzIHJlYXNvbiB3ZSBhbHdheXMgZm9yY2UgYSB0YXNrIHdoZW4gcnVubmluZyBqYXNtaW5lIHRlc3RzLlxuICAgICAgICBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2soXG4gICAgICAgICAgICAnamFzbWluZS5leGVjdXRlKCkuZm9yY2VUYXNrJywgKCkgPT4gUXVldWVSdW5uZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBfc3VwZXIucHJvdG90eXBlLmV4ZWN1dGUuY2FsbCh0aGlzKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJldHVybiBab25lUXVldWVSdW5uZXI7XG4gIH0pKFF1ZXVlUnVubmVyKTtcbn0pKCk7XG4iXX0=