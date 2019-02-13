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
    ['beforeEach', 'afterEach'].forEach(methodName => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiamFzbWluZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2phc21pbmUvamFzbWluZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxZQUFZLENBQUM7QUFDYixDQUFDLEdBQUcsRUFBRTtJQUNKLE1BQU0sU0FBUyxHQUFHLFVBQVMsQ0FBTSxFQUFFLENBQU07UUFDdkMsS0FBSyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQ2YsSUFBSSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztnQkFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLFNBQVMsRUFBRTtZQUNULElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLENBQUM7UUFDRCxDQUFDLENBQUMsU0FBUyxHQUFHLENBQUMsS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsRUFBRSxJQUFLLEVBQVUsRUFBRSxDQUFDLENBQUM7SUFDbEcsQ0FBQyxDQUFDO0lBQ0YsTUFBTSxPQUFPLEdBQ1QsT0FBTyxNQUFNLEtBQUssV0FBVyxJQUFJLE1BQU0sSUFBSSxPQUFPLElBQUksS0FBSyxXQUFXLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQztJQUM3RixzRkFBc0Y7SUFDdEYsK0VBQStFO0lBQy9FLElBQUksQ0FBQyxJQUFJO1FBQUUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQy9DLElBQUksT0FBTyxPQUFPLElBQUksV0FBVztRQUFFLE1BQU0sSUFBSSxL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SSxDQUFDLENBQUM7YUFDckM7UUFDSCxDQUFDLENBQUM7UUFDRixPQUFPLGVBQWUsQ0FBQztJQUN6QixDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsQ0FBQztBQUNsQixDQUFDLENBQUMsRUFBRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG4oKCkgPT4ge1xuICBjb25zdCBfX2V4dGVuZHMgPSBmdW5jdGlvbihkOiBhbnksIGI6IGFueSkge1xuICAgIGZvciAoY29uc3QgcCBpbiBiKVxuICAgICAgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdO1xuICAgIGZ1bmN0aW9uIF9fKCkge1xuICAgICAgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7XG4gICAgfVxuICAgIGQucHJvdG90eXBlID0gYiA9PT0gbnVsbCA/IE9iamVjdC5jcmVhdGUoYikgOiAoKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlKSwgbmV3IChfXyBhcyBhbnkpKCkpO1xuICB9O1xuICBjb25zdCBfZ2xvYmFsOiBhbnkgPVxuICAgICAgdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93IHx8IHR5cGVvZiBzZWxmICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIHx8IGdsb2JhbDtcbiAgLy8gUGF0Y2ggamFzbWluZSdzIGRlc2NyaWJlL2l0L2JlZm9yZUVhY2gvYWZ0ZXJFYWNoIGZ1bmN0aW9ucyBzbyB0ZXN0IGNvZGUgYWx3YXlzIHJ1bnNcbiAgLy8gaW4gYSB0ZXN0Wm9uZSAoUHJveHlab25lKS4gKFNlZTogYW5ndWxhci96b25lLmpzIzkxICYgYW5ndWxhci9hbmd1bGFyIzEwNTAzKVxuICBpZiAoIVpvbmUpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogem9uZS5qcycpO1xuICBpZiAodHlwZW9mIGphc21pbmUgPT0gJ3VuZGVmaW5lZCcpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogamFzbWluZS5qcycpO1xuICBpZiAoKGphc21pbmUgYXMgYW55KVsnX196b25lX3BhdGNoX18nXSlcbiAgICB0aHJvdyBuZXcgRXJyb3IoYCdqYXNtaW5lJyBoYXMgYWxyZWFkeSBiZWVuIHBhdGNoZWQgd2l0aCAnWm9uZScuYCk7XG4gIChqYXNtaW5lIGFzIGFueSlbJ19fem9uZV9wYXRjaF9fJ10gPSB0cnVlO1xuXG4gIGNvbnN0IFN5bmNUZXN0Wm9uZVNwZWM6IHtuZXcgKG5hbWU6IHN0cmluZyk6IFpvbmVTcGVjfSA9IChab25lIGFzIGFueSlbJ1N5bmNUZXN0Wm9uZVNwZWMnXTtcbiAgY29uc3QgUHJveHlab25lU3BlYzoge25ldyAoKTogWm9uZVNwZWN9ID0gKFpvbmUgYXMgYW55KVsnUHJveHlab25lU3BlYyddO1xuICBpZiAoIVN5bmNUZXN0Wm9uZVNwZWMpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogU3luY1Rlc3Rab25lU3BlYycpO1xuICBpZiAoIVByb3h5Wm9uZVNwZWMpIHRocm93IG5ldyBFcnJvcignTWlzc2luZzogUHJveHlab25lU3BlYycpO1xuXG4gIGNvbnN0IGFtYmllbnRab25lID0gWm9uZS5jdXJyZW50O1xuICAvLyBDcmVhdGUgYSBzeW5jaHJvbm91cy1vbmx5IHpvbmUgaW4gd2hpY2ggdG8gcnVuIGBkZXNjcmliZWAgYmxvY2tzIGluIG9yZGVyIHRvIHJhaXNlIGFuXG4gIC8vIGVycm9yIGlmIGFueSBhc3luY2hyb25vdXMgb3BlcmF0aW9ucyBhcmUgYXR0ZW1wdGVkIGluc2lkZSBvZiBhIGBkZXNjcmliZWAgYnV0IG91dHNpZGUgb2ZcbiAgLy8gYSBgYmVmb3JlRWFjaGAgb3IgYGl0YC5cbiAgY29uc3Qgc3luY1pvbmUgPSBhbWJpZW50Wm9uZS5mb3JrKG5ldyBTeW5jVGVzdFpvbmVTcGVjKCdqYXNtaW5lLmRlc2NyaWJlJykpO1xuXG4gIGNvbnN0IHN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXztcblxuICAvLyB3aGV0aGVyIHBhdGNoIGphc21pbmUgY2xvY2sgd2hlbiBpbiBmYWtlQXN5bmNcbiAgY29uc3QgZW5hYmxlQ2xvY2tQYXRjaCA9IF9nbG9iYWxbc3ltYm9sKCdmYWtlQXN5bmNQYXRjaExvY2snKV0gPT09IHRydWU7XG5cbiAgLy8gTW9ua2V5IHBhdGNoIGFsbCBvZiB0aGUgamFzbWluZSBEU0wgc28gdGhhdCBlYWNoIGZ1bmN0aW9uIHJ1bnMgaW4gYXBwcm9wcmlhdGUgem9uZS5cbiAgY29uc3QgamFzbWluZUVudjogYW55ID0gamFzbWluZS5nZXRFbnYoKTtcbiAgWydkZXNjcmliZScsICd4ZGVzY3JpYmUnLCAnZmRlc2NyaWJlJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oZGVzY3JpcHRpb246IHN0cmluZywgc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbikge1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmNhbGwodGhpcywgZGVzY3JpcHRpb24sIHdyYXBEZXNjcmliZUluWm9uZShzcGVjRGVmaW5pdGlvbnMpKTtcbiAgICB9O1xuICB9KTtcbiAgWydpdCcsICd4aXQnLCAnZml0J10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W3N5bWJvbChtZXRob2ROYW1lKV0gPSBvcmlnaW5hbEphc21pbmVGbjtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oXG4gICAgICAgIGRlc2NyaXB0aW9uOiBzdHJpbmcsIHNwZWNEZWZpbml0aW9uczogRnVuY3Rpb24sIHRpbWVvdXQ6IG51bWJlcikge1xuICAgICAgYXJndW1lbnRzWzFdID0gd3JhcFRlc3RJblpvbmUoc3BlY0RlZmluaXRpb25zKTtcbiAgICAgIHJldHVybiBvcmlnaW5hbEphc21pbmVGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG4gIH0pO1xuICBbJ2JlZm9yZUVhY2gnLCAnYWZ0ZXJFYWNoJ10uZm9yRWFjaChtZXRob2ROYW1lID0+IHtcbiAgICBsZXQgb3JpZ2luYWxKYXNtaW5lRm46IEZ1bmN0aW9uID0gamFzbWluZUVudlttZXRob2ROYW1lXTtcbiAgICBqYXNtaW5lRW52W3N5bWJvbChtZXRob2ROYW1lKV0gPSBvcmlnaW5hbEphc21pbmVGbjtcbiAgICBqYXNtaW5lRW52W21ldGhvZE5hbWVdID0gZnVuY3Rpb24oc3BlY0RlZmluaXRpb25zOiBGdW5jdGlvbiwgdGltZW91dDogbnVtYmVyKSB7XG4gICAgICBhcmd1bWVudHNbMF0gPSB3cmFwVGVzdEluWm9uZShzcGVjRGVmaW5pdGlvbnMpO1xuICAgICAgcmV0dXJuIG9yaWdpbmFsSmFzbWluZUZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgfSk7XG5cbiAgLy8gbmVlZCB0byBwYXRjaCBqYXNtaW5lLmNsb2NrKCkubW9ja0RhdGUgYW5kIGphc21pbmUuY2xvY2soKS50aWNrKCkgc29cbiAgLy8gdGhleSBjYW4gd29yayBwcm9wZXJseSBpbiBGYWtlQXN5bmNUZXN0XG4gIGNvbnN0IG9yaWdpbmFsQ2xvY2tGbjogRnVuY3Rpb24gPSAoKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrJyldID0gamFzbWluZVsnY2xvY2snXSk7XG4gIChqYXNtaW5lIGFzIGFueSlbJ2Nsb2NrJ10gPSBmdW5jdGlvbigpIHtcbiAgICBjb25zdCBjbG9jayA9IG9yaWdpbmFsQ2xvY2tGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmICghY2xvY2tbc3ltYm9sKCdwYXRjaGVkJyldKSB7XG4gICAgICBjbG9ja1tzeW1ib2woJ3BhdGNoZWQnKV0gPSBzeW1ib2woJ3BhdGNoZWQnKTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsVGljayA9IChjbG9ja1tzeW1ib2woJ3RpY2snKV0gPSBjbG9jay50aWNrKTtcbiAgICAgIGNsb2NrLnRpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgZmFrZUFzeW5jWm9uZVNwZWMgPSBab25lLmN1cnJlbnQuZ2V0KCdGYWtlQXN5bmNUZXN0Wm9uZVNwZWMnKTtcbiAgICAgICAgaWYgKGZha2VBc3luY1pvbmVTcGVjKSB7XG4gICAgICAgICAgcmV0dXJuIGZha2VBc3luY1pvbmVTcGVjLnRpY2suYXBwbHkoZmFrZUFzeW5jWm9uZVNwZWMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9yaWdpbmFsVGljay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIGNvbnN0IG9yaWdpbmFsTW9ja0RhdGUgPSAoY2xvY2tbc3ltYm9sKCdtb2NrRGF0ZScpXSA9IGNsb2NrLm1vY2tEYXRlKTtcbiAgICAgIGNsb2NrLm1vY2tEYXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGZha2VBc3luY1pvbmVTcGVjID0gWm9uZS5jdXJyZW50LmdldCgnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJyk7XG4gICAgICAgIGlmIChmYWtlQXN5bmNab25lU3BlYykge1xuICAgICAgICAgIGNvbnN0IGRhdGVUaW1lID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgPyBhcmd1bWVudHNbMF0gOiBuZXcgRGF0ZSgpO1xuICAgICAgICAgIHJldHVybiBmYWtlQXN5bmNab25lU3BlYy5zZXRDdXJyZW50UmVhbFRpbWUuYXBwbHkoXG4gICAgICAgICAgICAgIGZha2VBc3luY1pvbmVTcGVjLFxuICAgICAgICAgICAgICBkYXRlVGltZSAmJiB0eXBlb2YgZGF0ZVRpbWUuZ2V0VGltZSA9PT0gJ2Z1bmN0aW9uJyA/IFtkYXRlVGltZS5nZXRUaW1lKCldIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcmlnaW5hbE1vY2tEYXRlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgLy8gZm9yIGF1dG8gZ28gaW50byBmYWtlQXN5bmMgZmVhdHVyZSwgd2UgbmVlZCB0aGUgZmxhZyB0byBlbmFibGUgaXRcbiAgICAgIGlmIChlbmFibGVDbG9ja1BhdGNoKSB7XG4gICAgICAgIFsnaW5zdGFsbCcsICd1bmluc3RhbGwnXS5mb3JFYWNoKG1ldGhvZE5hbWUgPT4ge1xuICAgICAgICAgIGNvbnN0IG9yaWdpbmFsQ2xvY2tGbjogRnVuY3Rpb24gPSAoY2xvY2tbc3ltYm9sKG1ldGhvZE5hbWUpXSA9IGNsb2NrW21ldGhvZE5hbWVdKTtcbiAgICAgICAgICBjbG9ja1ttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc3QgRmFrZUFzeW5jVGVzdFpvbmVTcGVjID0gKFpvbmUgYXMgYW55KVsnRmFrZUFzeW5jVGVzdFpvbmVTcGVjJ107XG4gICAgICAgICAgICBpZiAoRmFrZUFzeW5jVGVzdFpvbmVTcGVjKSB7XG4gICAgICAgICAgICAgIChqYXNtaW5lIGFzIGFueSlbc3ltYm9sKCdjbG9ja0luc3RhbGxlZCcpXSA9ICdpbnN0YWxsJyA9PT0gbWV0aG9kTmFtZTtcbiAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9yaWdpbmFsQ2xvY2tGbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gY2xvY2s7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldHMgYSBmdW5jdGlvbiB3cmFwcGluZyB0aGUgYm9keSBvZiBhIEphc21pbmUgYGRlc2NyaWJlYCBibG9jayB0byBleGVjdXRlIGluIGFcbiAgICogc3luY2hyb25vdXMtb25seSB6b25lLlxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcERlc2NyaWJlSW5ab25lKGRlc2NyaWJlQm9keTogRnVuY3Rpb24pOiBGdW5jdGlvbiB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHN5bmNab25lLnJ1bihkZXNjcmliZUJvZHksIHRoaXMsIChhcmd1bWVudHMgYXMgYW55KSBhcyBhbnlbXSk7XG4gICAgfTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJ1bkluVGVzdFpvbmUodGVzdEJvZHk6IEZ1bmN0aW9uLCBhcHBseVRoaXM6IGFueSwgcXVldWVSdW5uZXI6IGFueSwgZG9uZT86IEZ1bmN0aW9uKSB7XG4gICAgY29uc3QgaXNDbG9ja0luc3RhbGxlZCA9ICEhKGphc21pbmUgYXMgYW55KVtzeW1ib2woJ2Nsb2NrSW5zdGFsbGVkJyldO1xuICAgIGNvbnN0IHRlc3RQcm94eVpvbmVTcGVjID0gcXVldWVSdW5uZXIudGVzdFByb3h5Wm9uZVNwZWM7XG4gICAgY29uc3QgdGVzdFByb3h5Wm9uZSA9IHF1ZXVlUnVubmVyLnRlc3RQcm94eVpvbmU7XG4gICAgbGV0IGxhc3REZWxlZ2F0ZTtcbiAgICBpZiAoaXNDbG9ja0luc3RhbGxlZCAmJiBlbmFibGVDbG9ja1BhdGNoKSB7XG4gICAgICAvLyBhdXRvIHJ1biBhIGZha2VBc3luY1xuICAgICAgY29uc3QgZmFrZUFzeW5jTW9kdWxlID0gKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ2Zha2VBc3luY1Rlc3QnKV07XG4gICAgICBpZiAoZmFrZUFzeW5jTW9kdWxlICYmIHR5cGVvZiBmYWtlQXN5bmNNb2R1bGUuZmFrZUFzeW5jID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRlc3RCb2R5ID0gZmFrZUFzeW5jTW9kdWxlLmZha2VBc3luYyh0ZXN0Qm9keSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChkb25lKSB7XG4gICAgICByZXR1cm4gdGVzdFByb3h5Wm9uZS5ydW4odGVzdEJvZHksIGFwcGx5VGhpcywgW2RvbmVdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRlc3RQcm94eVpvbmUucnVuKHRlc3RCb2R5LCBhcHBseVRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBHZXRzIGEgZnVuY3Rpb24gd3JhcHBpbmcgdGhlIGJvZHkgb2YgYSBKYXNtaW5lIGBpdC9iZWZvcmVFYWNoL2FmdGVyRWFjaGAgYmxvY2sgdG9cbiAgICogZXhlY3V0ZSBpbiBhIFByb3h5Wm9uZSB6b25lLlxuICAgKiBUaGlzIHdpbGwgcnVuIGluIGB0ZXN0UHJveHlab25lYC4gVGhlIGB0ZXN0UHJveHlab25lYCB3aWxsIGJlIHJlc2V0IGJ5IHRoZSBgWm9uZVF1ZXVlUnVubmVyYFxuICAgKi9cbiAgZnVuY3Rpb24gd3JhcFRlc3RJblpvbmUodGVzdEJvZHk6IEZ1bmN0aW9uKTogRnVuY3Rpb24ge1xuICAgIC8vIFRoZSBgZG9uZWAgY2FsbGJhY2sgaXMgb25seSBwYXNzZWQgdGhyb3VnaCBpZiB0aGUgZnVuY3Rpb24gZXhwZWN0cyBhdCBsZWFzdCBvbmUgYXJndW1lbnQuXG4gICAgLy8gTm90ZSB3ZSBoYXZlIHRvIG1ha2UgYSBmdW5jdGlvbiB3aXRoIGNvcnJlY3QgbnVtYmVyIG9mIGFyZ3VtZW50cywgb3RoZXJ3aXNlIGphc21pbmUgd2lsbFxuICAgIC8vIHRoaW5rIHRoYXQgYWxsIGZ1bmN0aW9ucyBhcmUgc3luYyBvciBhc3luYy5cbiAgICByZXR1cm4gKHRlc3RCb2R5ICYmICh0ZXN0Qm9keS5sZW5ndGggPyBmdW5jdGlvbihkb25lOiBGdW5jdGlvbikge1xuICAgICAgICAgICAgICByZXR1cm4gcnVuSW5UZXN0Wm9uZSh0ZXN0Qm9keSwgdGhpcywgdGhpcy5xdWV1ZVJ1bm5lciwgZG9uZSk7XG4gICAgICAgICAgICB9IDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHJldHVybiBydW5JblRlc3Rab25lKHRlc3RCb2R5LCB0aGlzLCB0aGlzLnF1ZXVlUnVubmVyKTtcbiAgICAgICAgICAgIH0pKTtcbiAgfVxuICBpbnRlcmZhY2UgUXVldWVSdW5uZXIge1xuICAgIGV4ZWN1dGUoKTogdm9pZDtcbiAgfVxuICBpbnRlcmZhY2UgUXVldWVSdW5uZXJBdHRycyB7XG4gICAgcXVldWVhYmxlRm5zOiB7Zm46IEZ1bmN0aW9ufVtdO1xuICAgIG9uQ29tcGxldGU6ICgpID0+IHZvaWQ7XG4gICAgY2xlYXJTdGFjazogKGZuOiBhbnkpID0+IHZvaWQ7XG4gICAgb25FeGNlcHRpb246IChlcnJvcjogYW55KSA9PiB2b2lkO1xuICAgIGNhdGNoRXhjZXB0aW9uOiAoKSA9PiBib29sZWFuO1xuICAgIHVzZXJDb250ZXh0OiBhbnk7XG4gICAgdGltZW91dDoge3NldFRpbWVvdXQ6IEZ1bmN0aW9uOyBjbGVhclRpbWVvdXQ6IEZ1bmN0aW9ufTtcbiAgICBmYWlsOiAoKSA9PiB2b2lkO1xuICB9XG5cbiAgY29uc3QgUXVldWVSdW5uZXIgPSAoamFzbWluZSBhcyBhbnkpLlF1ZXVlUnVubmVyIGFzIHtcbiAgICBuZXcgKGF0dHJzOiBRdWV1ZVJ1bm5lckF0dHJzKTogUXVldWVSdW5uZXI7XG4gIH07XG4gIChqYXNtaW5lIGFzIGFueSkuUXVldWVSdW5uZXIgPSAoZnVuY3Rpb24oX3N1cGVyKSB7XG4gICAgX19leHRlbmRzKFpvbmVRdWV1ZVJ1bm5lciwgX3N1cGVyKTtcbiAgICBmdW5jdGlvbiBab25lUXVldWVSdW5uZXIoYXR0cnM6IHtcbiAgICAgIG9uQ29tcGxldGU6IEZ1bmN0aW9uO1xuICAgICAgdXNlckNvbnRleHQ/OiBhbnk7XG4gICAgICB0aW1lb3V0Pzoge3NldFRpbWVvdXQ6IEZ1bmN0aW9uOyBjbGVhclRpbWVvdXQ6IEZ1bmN0aW9ufTtcbiAgICAgIG9uRXhjZXB0aW9uPzogKGVycm9yOiBhbnkpID0+IHZvaWQ7XG4gICAgfSkge1xuICAgICAgYXR0cnMub25Db21wbGV0ZSA9IChmbiA9PiAoKSA9PiB7XG4gICAgICAgIC8vIEFsbCBmdW5jdGlvbnMgYXJlIGRvbmUsIGNsZWFyIHRoZSB0ZXN0IHpvbmUuXG4gICAgICAgIHRoaXMudGVzdFByb3h5Wm9uZSA9IG51bGw7XG4gICAgICAgIHRoaXMudGVzdFByb3h5Wm9uZVNwZWMgPSBudWxsO1xuICAgICAgICBhbWJpZW50Wm9uZS5zY2hlZHVsZU1pY3JvVGFzaygnamFzbWluZS5vbkNvbXBsZXRlJywgZm4pO1xuICAgICAgfSkoYXR0cnMub25Db21wbGV0ZSk7XG5cbiAgICAgIGNvbnN0IG5hdGl2ZVNldFRpbWVvdXQgPSBfZ2xvYmFsWydfX3pvbmVfc3ltYm9sX19zZXRUaW1lb3V0J107XG4gICAgICBjb25zdCBuYXRpdmVDbGVhclRpbWVvdXQgPSBfZ2xvYmFsWydfX3pvbmVfc3ltYm9sX19jbGVhclRpbWVvdXQnXTtcbiAgICAgIGlmIChuYXRpdmVTZXRUaW1lb3V0KSB7XG4gICAgICAgIC8vIHNob3VsZCBydW4gc2V0VGltZW91dCBpbnNpZGUgamFzbWluZSBvdXRzaWRlIG9mIHpvbmVcbiAgICAgICAgYXR0cnMudGltZW91dCA9IHtcbiAgICAgICAgICBzZXRUaW1lb3V0OiBuYXRpdmVTZXRUaW1lb3V0ID8gbmF0aXZlU2V0VGltZW91dCA6IF9nbG9iYWwuc2V0VGltZW91dCxcbiAgICAgICAgICBjbGVhclRpbWVvdXQ6IG5hdGl2ZUNsZWFyVGltZW91dCA/IG5hdGl2ZUNsZWFyVGltZW91dCA6IF9nbG9iYWwuY2xlYXJUaW1lb3V0XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIGNyZWF0ZSBhIHVzZXJDb250ZXh0IHRvIGhvbGQgdGhlIHF1ZXVlUnVubmVyIGl0c2VsZlxuICAgICAgLy8gc28gd2UgY2FuIGFjY2VzcyB0aGUgdGVzdFByb3h5IGluIGl0L3hpdC9iZWZvcmVFYWNoIC4uLlxuICAgICAgaWYgKChqYXNtaW5lIGFzIGFueSkuVXNlckNvbnRleHQpIHtcbiAgICAgICAgaWYgKCFhdHRycy51c2VyQ29udGV4dCkge1xuICAgICAgICAgIGF0dHJzLnVzZXJDb250ZXh0ID0gbmV3IChqYXNtaW5lIGFzIGFueSkuVXNlckNvbnRleHQoKTtcbiAgICAgICAgfVxuICAgICAgICBhdHRycy51c2VyQ29udGV4dC5xdWV1ZVJ1bm5lciA9IHRoaXM7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIWF0dHJzLnVzZXJDb250ZXh0KSB7XG4gICAgICAgICAgYXR0cnMudXNlckNvbnRleHQgPSB7fTtcbiAgICAgICAgfVxuICAgICAgICBhdHRycy51c2VyQ29udGV4dC5xdWV1ZVJ1bm5lciA9IHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIHBhdGNoIGF0dHJzLm9uRXhjZXB0aW9uXG4gICAgICBjb25zdCBvbkV4Y2VwdGlvbiA9IGF0dHJzLm9uRXhjZXB0aW9uO1xuICAgICAgYXR0cnMub25FeGNlcHRpb24gPSBmdW5jdGlvbihlcnJvcjogYW55KSB7XG4gICAgICAgIGlmIChlcnJvciAmJlxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9PT1cbiAgICAgICAgICAgICAgICAnVGltZW91dCAtIEFzeW5jIGNhbGxiYWNrIHdhcyBub3QgaW52b2tlZCB3aXRoaW4gdGltZW91dCBzcGVjaWZpZWQgYnkgamFzbWluZS5ERUZBVUxUX1RJTUVPVVRfSU5URVJWQUwuJykge1xuICAgICAgICAgIC8vIGphc21pbmUgdGltZW91dCwgd2UgY2FuIG1ha2UgdGhlIGVycm9yIG1lc3NhZ2UgbW9yZVxuICAgICAgICAgIC8vIHJlYXNvbmFibGUgdG8gdGVsbCB3aGF0IHRhc2tzIGFyZSBwZW5kaW5nXG4gICAgICAgICAgY29uc3QgcHJveHlab25lU3BlYzogYW55ID0gdGhpcyAmJiB0aGlzLnRlc3RQcm94eVpvbmVTcGVjO1xuICAgICAgICAgIGlmIChwcm94eVpvbmVTcGVjKSB7XG4gICAgICAgICAgICBjb25zdCBwZW5kaW5nVGFza3NJbmZvID0gcHJveHlab25lU3BlYy5nZXRBbmRDbGVhclBlbmRpbmdUYXNrc0luZm8oKTtcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgKz0gcGVuZGluZ1Rhc2tzSW5mbztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9uRXhjZXB0aW9uKSB7XG4gICAgICAgICAgb25FeGNlcHRpb24uY2FsbCh0aGlzLCBlcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIF9zdXBlci5jYWxsKHRoaXMsIGF0dHJzKTtcbiAgICB9XG4gICAgWm9uZVF1ZXVlUnVubmVyLnByb3RvdHlwZS5leGVjdXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICBsZXQgem9uZTogWm9uZXxudWxsID0gWm9uZS5jdXJyZW50O1xuICAgICAgbGV0IGlzQ2hpbGRPZkFtYmllbnRab25lID0gZmFsc2U7XG4gICAgICB3aGlsZSAoem9uZSkge1xuICAgICAgICBpZiAoem9uZSA9PT0gYW1iaWVudFpvbmUpIHtcbiAgICAgICAgICBpc0NoaWxkT2ZBbWJpZW50Wm9uZSA9IHRydWU7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgem9uZSA9IHpvbmUucGFyZW50O1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzQ2hpbGRPZkFtYmllbnRab25lKSB0aHJvdyBuZXcgRXJyb3IoJ1VuZXhwZWN0ZWQgWm9uZTogJyArIFpvbmUuY3VycmVudC5uYW1lKTtcblxuICAgICAgLy8gVGhpcyBpcyB0aGUgem9uZSB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIHJ1bm5pbmcgaW5kaXZpZHVhbCB0ZXN0cy5cbiAgICAgIC8vIEl0IHdpbGwgYmUgYSBwcm94eSB6b25lLCBzbyB0aGF0IHRoZSB0ZXN0cyBmdW5jdGlvbiBjYW4gcmV0cm9hY3RpdmVseSBpbnN0YWxsXG4gICAgICAvLyBkaWZmZXJlbnQgem9uZXMuXG4gICAgICAvLyBFeGFtcGxlOlxuICAgICAgLy8gICAtIEluIGJlZm9yZUVhY2goKSBkbyBjaGlsZFpvbmUgPSBab25lLmN1cnJlbnQuZm9yayguLi4pO1xuICAgICAgLy8gICAtIEluIGl0KCkgdHJ5IHRvIGRvIGZha2VBc3luYygpLiBUaGUgaXNzdWUgaXMgdGhhdCBiZWNhdXNlIHRoZSBiZWZvcmVFYWNoIGZvcmtlZCB0aGVcbiAgICAgIC8vICAgICB6b25lIG91dHNpZGUgb2YgZmFrZUFzeW5jIGl0IHdpbGwgYmUgYWJsZSB0byBlc2NhcGUgdGhlIGZha2VBc3luYyBydWxlcy5cbiAgICAgIC8vICAgLSBCZWNhdXNlIFByb3h5Wm9uZSBpcyBwYXJlbnQgZm8gYGNoaWxkWm9uZWAgZmFrZUFzeW5jIGNhbiByZXRyb2FjdGl2ZWx5IGFkZFxuICAgICAgLy8gICAgIGZha2VBc3luYyBiZWhhdmlvciB0byB0aGUgY2hpbGRab25lLlxuXG4gICAgICB0aGlzLnRlc3RQcm94eVpvbmVTcGVjID0gbmV3IFByb3h5Wm9uZVNwZWMoKTtcbiAgICAgIHRoaXMudGVzdFByb3h5Wm9uZSA9IGFtYmllbnRab25lLmZvcmsodGhpcy50ZXN0UHJveHlab25lU3BlYyk7XG4gICAgICBpZiAoIVpvbmUuY3VycmVudFRhc2spIHtcbiAgICAgICAgLy8gaWYgd2UgYXJlIG5vdCBydW5uaW5nIGluIGEgdGFzayB0aGVuIGlmIHNvbWVvbmUgd291bGQgcmVnaXN0ZXIgYVxuICAgICAgICAvLyBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIgYW5kIHRoZW4gY2FsbGluZyBlbGVtZW50LmNsaWNrKCkgdGhlXG4gICAgICAgIC8vIGFkZEV2ZW50TGlzdGVuZXIgY2FsbGJhY2sgd291bGQgdGhpbmsgdGhhdCBpdCBpcyB0aGUgdG9wIG1vc3QgdGFzayBhbmQgd291bGRcbiAgICAgICAgLy8gZHJhaW4gdGhlIG1pY3JvdGFzayBxdWV1ZSBvbiBlbGVtZW50LmNsaWNrKCkgd2hpY2ggd291bGQgYmUgaW5jb3JyZWN0LlxuICAgICAgICAvLyBGb3IgdGhpcyByZWFzb24gd2UgYWx3YXlzIGZvcmNlIGEgdGFzayB3aGVuIHJ1bm5pbmcgamFzbWluZSB0ZXN0cy5cbiAgICAgICAgWm9uZS5jdXJyZW50LnNjaGVkdWxlTWljcm9UYXNrKFxuICAgICAgICAgICAgJ2phc21pbmUuZXhlY3V0ZSgpLmZvcmNlVGFzaycsICgpID0+IFF1ZXVlUnVubmVyLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcykpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3N1cGVyLnByb3RvdHlwZS5leGVjdXRlLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfTtcbiAgICByZXR1cm4gWm9uZVF1ZXVlUnVubmVyO1xuICB9KShRdWV1ZVJ1bm5lcik7XG59KSgpO1xuIl19