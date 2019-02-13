/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis,undefinedVars}
 */
Zone.__load_patch('Error', function (global, Zone, api) {
    /*
     * This code patches Error so that:
     *   - It ignores un-needed stack frames.
     *   - It Shows the associated Zone for reach frame.
     */
    var blacklistedStackFramesSymbol = api.symbol('blacklistedStackFrames');
    var NativeError = global[api.symbol('Error')] = global['Error'];
    // Store the frames which should be removed from the stack frames
    var blackListedStackFrames = {};
    // We must find the frame where Error was created, otherwise we assume we don't understand stack
    var zoneAwareFrame1;
    var zoneAwareFrame2;
    var zoneAwareFrame1WithoutNew;
    var zoneAwareFrame2WithoutNew;
    var zoneAwareFrame3WithoutNew;
    global['Error'] = ZoneAwareError;
    var stackRewrite = 'stackRewrite';
    var blackListedStackFramesPolicy = global['__Zone_Error_BlacklistedStackFrames_policy'] || 'default';
    function buildZoneFrameNames(zoneFrame) {
        var zoneFrameName = { zoneName: zoneFrame.zone.name };
        var result = zoneFrameName;
        while (zoneFrame.parent) {
            zoneFrame = zoneFrame.parent;
            var parentZoneFrameName = { zoneName: zoneFrame.zone.name };
            zoneFrameName.parent = parentZoneFrameName;
            zoneFrameName = parentZoneFrameName;
        }
        return result;
    }
    function buildZoneAwareStackFrames(originalStack, zoneFrame, isZoneFrame) {
        if (isZoneFrame === void 0) { isZoneFrame = true; }
        var frames = originalStack.split('\n');
        var i = 0;
        // Find the first frame
        while (!(frames[i] === zoneAwareFrame1 || frames[i] === zoneAwareFrame2 ||
            frames[i] === zoneAwareFrame1WithoutNew || frames[i] === zoneAwareFrame2WithoutNew ||
            frames[i] === zoneAwareFrame3WithoutNew) &&
            i < frames.length) {
            i++;
        }
        for (; i < frames.length && zoneFrame; i++) {
            var frame = frames[i];
            if (frame.trim()) {
                switch (blackListedStackFrames[frame]) {
                    case 0 /* blackList */:
                        frames.splice(i, 1);
                        i--;
                        break;
                    case 1 /* transition */:
                        if (zoneFrame.parent) {
                            // This is the special frame where zone changed. Print and process it accordingly
                            zoneFrame = zoneFrame.parent;
                        }
                        else {
                            zoneFrame = null;
                        }
                        frames.splice(i, 1);
                        i--;
                        break;
                    default:
                        frames[i] += isZoneFrame ? " [" + zoneFrame.zone.name + "]" :
                            " [" + zoneFrame.zoneName + "]";
                }
            }
        }
        return frames.join('\n');
    }
    /**
     * This is ZoneAwareError which processes the stack frame and cleans up extra frames as well as
     * adds zone information to it.
     */
    function ZoneAwareError() {
        var _this = this;
        // We always have to return native error otherwise the browser console will not work.
        var error = NativeError.apply(this, arguments);
        // Save original stack trace
        var originalStack = error['originalStack'] = error.stack;
        // Process the stack trace and rewrite the frames.
        if (ZoneAwareError[stackRewrite] && originalStack) {
            var zoneFrame = api.currentZoneFrame();
            if (blackListedStackFramesPolicy === 'lazy') {
                // don't handle stack trace now
                error[api.symbol('zoneFrameNames')] = buildZoneFrameNames(zoneFrame);
            }
            else if (blackListedStackFramesPolicy === 'default') {
                try {
                    error.stack = error.zoneAwareStack = buildZoneAwareStackFrames(originalStack, zoneFrame);
                }
                catch (e) {
                    // ignore as some browsers don't allow overriding of stack
                }
            }
        }
        if (this instanceof NativeError && this.constructor != NativeError) {
            // We got called with a `new` operator AND we are subclass of ZoneAwareError
            // in that case we have to copy all of our properties to `this`.
            Object.keys(error).concat('stack', 'message').forEach(function (key) {
                var value = error[key];
                if (value !== undefined) {
                    try {
                        _this[key] = value;
                    }
                    catch (e) {
                        // ignore the assignment in case it is a setter and it throws.
                    }
                }
            });
            return this;
        }
        return error;
    }
    // Copy the prototype so that instanceof operator works as expected
    ZoneAwareError.prototype = NativeError.prototype;
    ZoneAwareError[blacklistedStackFramesSymbol] = blackListedStackFrames;
    ZoneAwareError[stackRewrite] = false;
    var zoneAwareStackSymbol = api.symbol('zoneAwareStack');
    // try to define zoneAwareStack property when blackListed
    // policy is delay
    if (blackListedStackFramesPolicy === 'lazy') {
        Object.defineProperty(ZoneAwareError.prototype, 'zoneAwareStack', {
            configurable: true,
            enumerable: true,
            get: function () {
                if (!this[zoneAwareStackSymbol]) {
                    this[zoneAwareStackSymbol] = buildZoneAwareStackFrames(this.originalStack, this[api.symbol('zoneFrameNames')], false);
                }
                return this[zoneAwareStackSymbol];
            },
            set: function (newStack) {
                this.originalStack = newStack;
                this[zoneAwareStackSymbol] = buildZoneAwareStackFrames(this.originalStack, this[api.symbol('zoneFrameNames')], false);
            }
        });
    }
    // those properties need special handling
    var specialPropertyNames = ['stackTraceLimit', 'captureStackTrace', 'prepareStackTrace'];
    // those properties of NativeError should be set to ZoneAwareError
    var nativeErrorProperties = Object.keys(NativeError);
    if (nativeErrorProperties) {
        nativeErrorProperties.forEach(function (prop) {
            if (specialPropertyNames.filter(function (sp) { return sp === prop; }).length === 0) {
                Object.defineProperty(ZoneAwareError, prop, {
                    get: function () {
                        return NativeError[prop];
                    },
                    set: function (value) {
                        NativeError[prop] = value;
                    }
                });
            }
        });
    }
    if (NativeError.hasOwnProperty('stackTraceLimit')) {
        // Extend default stack limit as we will be removing few frames.
        NativeError.stackTraceLimit = Math.max(NativeError.stackTraceLimit, 15);
        // make sure that ZoneAwareError has the same property which forwards to NativeError.
        Object.defineProperty(ZoneAwareError, 'stackTraceLimit', {
            get: function () {
                return NativeError.stackTraceLimit;
            },
            set: function (value) {
                return NativeError.stackTraceLimit = value;
            }
        });
    }
    if (NativeError.hasOwnProperty('captureStackTrace')) {
        Object.defineProperty(ZoneAwareError, 'captureStackTrace', {
            // add named function here because we need to remove this
            // stack frame when prepareStackTrace below
            value: function zoneCaptureStackTrace(targetObject, constructorOpt) {
                NativeError.captureStackTrace(targetObject, constructorOpt);
            }
        });
    }
    var ZONE_CAPTURESTACKTRACE = 'zoneCaptureStackTrace';
    Object.defineProperty(ZoneAwareError, 'prepareStackTrace', {
        get: function () {
            return NativeError.prepareStackTrace;
        },
        set: function (value) {
            if (!value || typeof value !== 'function') {
                return NativeError.prepareStackTrace = value;
            }
            return NativeError.prepareStackTrace = function (error, structuredStackTrace) {
                // remove additional stack information from ZoneAwareError.captureStackTrace
                if (structuredStackTrace) {
                    for (var i = 0; i < structuredStackTrace.length; i++) {
                        var st = structuredStackTrace[i];
                        // remove the first function which name is zoneCaptureStackTrace
                        if (st.getFunctionName() === ZONE_CAPTURESTACKTRACE) {
                            structuredStackTrace.splice(i, 1);
                            break;
                        }
                    }
                }
                return value.call(this, error, structuredStackTrace);
            };
        }
    });
    if (blackListedStackFramesPolicy === 'disable') {
        // don't need to run detectZone to populate
        // blacklisted stack frames
        return;
    }
    // Now we need to populate the `blacklistedStackFrames` as well as find the
    // run/runGuarded/runTask frames. This is done by creating a detect zone and then threading
    // the execution through all of the above methods so that we can look at the stack trace and
    // find the frames of interest.
    var detectZone = Zone.current.fork({
        name: 'detect',
        onHandleError: function (parentZD, current, target, error) {
            if (error.originalStack && Error === ZoneAwareError) {
                var frames_1 = error.originalStack.split(/\n/);
                var runFrame = false, runGuardedFrame = false, runTaskFrame = false;
                while (frames_1.length) {
                    var frame = frames_1.shift();
                    // On safari it is possible to have stack frame with no line number.
                    // This check makes sure that we don't filter frames on name only (must have
                    // line number or exact equals to `ZoneAwareError`)
                    if (/:\d+:\d+/.test(frame) || frame === 'ZoneAwareError') {
                        // Get rid of the path so that we don't accidentally find function name in path.
                        // In chrome the separator is `(` and `@` in FF and safari
                        // Chrome: at Zone.run (zone.js:100)
                        // Chrome: at Zone.run (http://localhost:9876/base/build/lib/zone.js:100:24)
                        // FireFox: Zone.prototype.run@http://localhost:9876/base/build/lib/zone.js:101:24
                        // Safari: run@http://localhost:9876/base/build/lib/zone.js:101:24
                        var fnName = frame.split('(')[0].split('@')[0];
                        var frameType = 1 /* transition */;
                        if (fnName.indexOf('ZoneAwareError') !== -1) {
                            if (fnName.indexOf('new ZoneAwareError') !== -1) {
                                zoneAwareFrame1 = frame;
                                zoneAwareFrame2 = frame.replace('new ZoneAwareError', 'new Error.ZoneAwareError');
                            }
                            else {
                                zoneAwareFrame1WithoutNew = frame;
                                zoneAwareFrame2WithoutNew = frame.replace('Error.', '');
                                if (frame.indexOf('Error.ZoneAwareError') === -1) {
                                    zoneAwareFrame3WithoutNew =
                                        frame.replace('ZoneAwareError', 'Error.ZoneAwareError');
                                }
                            }
                            blackListedStackFrames[zoneAwareFrame2] = 0 /* blackList */;
                        }
                        if (fnName.indexOf('runGuarded') !== -1) {
                            runGuardedFrame = true;
                        }
                        else if (fnName.indexOf('runTask') !== -1) {
                            runTaskFrame = true;
                        }
                        else if (fnName.indexOf('run') !== -1) {
                            runFrame = true;
                        }
                        else {
                            frameType = 0 /* blackList */;
                        }
                        blackListedStackFrames[frame] = frameType;
                        // Once we find all of the frames we can stop looking.
                        if (runFrame && runGuardedFrame && runTaskFrame) {
                            ZoneAwareError[stackRewrite] = true;
                            break;
                        }
                    }
                }
            }
            return false;
        }
    });
    // carefully constructor a stack frame which contains all of the frames of interest which
    // need to be detected and blacklisted.
    var childDetectZone = detectZone.fork({
        name: 'child',
        onScheduleTask: function (delegate, curr, target, task) {
            return delegate.scheduleTask(target, task);
        },
        onInvokeTask: function (delegate, curr, target, task, applyThis, applyArgs) {
            return delegate.invokeTask(target, task, applyThis, applyArgs);
        },
        onCancelTask: function (delegate, curr, target, task) {
            return delegate.cancelTask(target, task);
        },
        onInvoke: function (delegate, curr, target, callback, applyThis, applyArgs, source) {
            return delegate.invoke(target, callback, applyThis, applyArgs, source);
        }
    });
    // we need to detect all zone related frames, it will
    // exceed default stackTraceLimit, so we set it to
    // larger number here, and restore it after detect finish.
    var originalStackTraceLimit = Error.stackTraceLimit;
    Error.stackTraceLimit = 100;
    // we schedule event/micro/macro task, and invoke them
    // when onSchedule, so we can get all stack traces for
    // all kinds of tasks with one error thrown.
    childDetectZone.run(function () {
        childDetectZone.runGuarded(function () {
            var fakeTransitionTo = function () { };
            childDetectZone.scheduleEventTask(blacklistedStackFramesSymbol, function () {
                childDetectZone.scheduleMacroTask(blacklistedStackFramesSymbol, function () {
                    childDetectZone.scheduleMicroTask(blacklistedStackFramesSymbol, function () {
                        throw new Error();
                    }, undefined, function (t) {
                        t._transitionTo = fakeTransitionTo;
                        t.invoke();
                    });
                    childDetectZone.scheduleMicroTask(blacklistedStackFramesSymbol, function () {
                        throw Error();
                    }, undefined, function (t) {
                        t._transitionTo = fakeTransitionTo;
                        t.invoke();
                    });
                }, undefined, function (t) {
                    t._transitionTo = fakeTransitionTo;
                    t.invoke();
                }, function () { });
            }, undefined, function (t) {
                t._transitionTo = fakeTransitionTo;
                t.invoke();
            }, function () { });
        });
    });
    Error.stackTraceLimit = originalStackTraceLimit;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItcmV3cml0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL2Vycm9yLXJld3JpdGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0g7OztHQUdHO0FBaUJILElBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUN4RTs7OztPQUlHO0lBU0gsSUFBTSw0QkFBNEIsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLENBQUM7SUFDMUUsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbEUsaUVBQWlFO0lBQ2pFLElBQU0sc0JBQXNCLEdBQWlDLEVBQUUsQ0FBQztJQUNoRSxnR0FBZ0c7SUFDaEcsSUFBSSxlQUF1QixDQUFDO0lBQzVCLElBQUksZUFBdUIsQ0FBQztJQUM1QixJQUFJLHlCQUFpQyxDQUFDO0lBQ3RDLElBQUkseUJBQWlDLENBQUM7SUFDdEMsSUFBSSx5QkFBaUMsQ0FBQztJQUV0QyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsY0FBYyxDQUFDO0lBQ2pDLElBQU0sWUFBWSxHQUFHLGNBQWMsQ0FBQztJQUdwQyxJQUFNLDRCQUE0QixHQUM5QixNQUFNLENBQUMsNENBQTRDLENBQUMsSUFBSSxTQUFTLENBQUM7SUFPdEUsU0FBUyxtQkFBbUIsQ0FBQyxTQUFxQjtRQUNoRCxJQUFJLGFBQWEsR0FBa0IsRUFB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QixDQUFDO0FBQ2xELENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge2dsb2JhbFRoaXMsdW5kZWZpbmVkVmFyc31cbiAqL1xuXG4vKipcbiAqIEV4dGVuZCB0aGUgRXJyb3Igd2l0aCBhZGRpdGlvbmFsIGZpZWxkcyBmb3IgcmV3cml0dGVuIHN0YWNrIGZyYW1lc1xuICovXG5pbnRlcmZhY2UgRXJyb3Ige1xuICAvKipcbiAgICogU3RhY2sgdHJhY2Ugd2hlcmUgZXh0cmEgZnJhbWVzIGhhdmUgYmVlbiByZW1vdmVkIGFuZCB6b25lIG5hbWVzIGFkZGVkLlxuICAgKi9cbiAgem9uZUF3YXJlU3RhY2s/OiBzdHJpbmc7XG5cbiAgLyoqXG4gICAqIE9yaWdpbmFsIHN0YWNrIHRyYWNlIHdpdGggbm8gbW9kaWZpY2F0aW9uc1xuICAgKi9cbiAgb3JpZ2luYWxTdGFjaz86IHN0cmluZztcbn1cblxuWm9uZS5fX2xvYWRfcGF0Y2goJ0Vycm9yJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgLypcbiAgICogVGhpcyBjb2RlIHBhdGNoZXMgRXJyb3Igc28gdGhhdDpcbiAgICogICAtIEl0IGlnbm9yZXMgdW4tbmVlZGVkIHN0YWNrIGZyYW1lcy5cbiAgICogICAtIEl0IFNob3dzIHRoZSBhc3NvY2lhdGVkIFpvbmUgZm9yIHJlYWNoIGZyYW1lLlxuICAgKi9cblxuICBjb25zdCBlbnVtIEZyYW1lVHlwZSB7XG4gICAgLy8vIFNraXAgdGhpcyBmcmFtZSB3aGVuIHByaW50aW5nIG91dCBzdGFja1xuICAgIGJsYWNrTGlzdCxcbiAgICAvLy8gVGhpcyBmcmFtZSBtYXJrcyB6b25lIHRyYW5zaXRpb25cbiAgICB0cmFuc2l0aW9uXG4gIH1cblxuICBjb25zdCBibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sID0gYXBpLnN5bWJvbCgnYmxhY2tsaXN0ZWRTdGFja0ZyYW1lcycpO1xuICBjb25zdCBOYXRpdmVFcnJvciA9IGdsb2JhbFthcGkuc3ltYm9sKCdFcnJvcicpXSA9IGdsb2JhbFsnRXJyb3InXTtcbiAgLy8gU3RvcmUgdGhlIGZyYW1lcyB3aGljaCBzaG91bGQgYmUgcmVtb3ZlZCBmcm9tIHRoZSBzdGFjayBmcmFtZXNcbiAgY29uc3QgYmxhY2tMaXN0ZWRTdGFja0ZyYW1lczoge1tmcmFtZTogc3RyaW5nXTogRnJhbWVUeXBlfSA9IHt9O1xuICAvLyBXZSBtdXN0IGZpbmQgdGhlIGZyYW1lIHdoZXJlIEVycm9yIHdhcyBjcmVhdGVkLCBvdGhlcndpc2Ugd2UgYXNzdW1lIHdlIGRvbid0IHVuZGVyc3RhbmQgc3RhY2tcbiAgbGV0IHpvbmVBd2FyZUZyYW1lMTogc3RyaW5nO1xuICBsZXQgem9uZUF3YXJlRnJhbWUyOiBzdHJpbmc7XG4gIGxldCB6b25lQXdhcmVGcmFtZTFXaXRob3V0TmV3OiBzdHJpbmc7XG4gIGxldCB6b25lQXdhcmVGcmFtZTJXaXRob3V0TmV3OiBzdHJpbmc7XG4gIGxldCB6b25lQXdhcmVGcmFtZTNXaXRob3V0TmV3OiBzdHJpbmc7XG5cbiAgZ2xvYmFsWydFcnJvciddID0gWm9uZUF3YXJlRXJyb3I7XG4gIGNvbnN0IHN0YWNrUmV3cml0ZSA9ICdzdGFja1Jld3JpdGUnO1xuXG4gIHR5cGUgQmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeSA9ICdkZWZhdWx0J3wnZGlzYWJsZSd8J2xhenknO1xuICBjb25zdCBibGFja0xpc3RlZFN0YWNrRnJhbWVzUG9saWN5OiBCbGFja0xpc3RlZFN0YWNrRnJhbWVzUG9saWN5ID1cbiAgICAgIGdsb2JhbFsnX19ab25lX0Vycm9yX0JsYWNrbGlzdGVkU3RhY2tGcmFtZXNfcG9saWN5J10gfHwgJ2RlZmF1bHQnO1xuXG4gIGludGVyZmFjZSBab25lRnJhbWVOYW1lIHtcbiAgICB6b25lTmFtZTogc3RyaW5nO1xuICAgIHBhcmVudD86IFpvbmVGcmFtZU5hbWU7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFpvbmVGcmFtZU5hbWVzKHpvbmVGcmFtZTogX1pvbmVGcmFtZSkge1xuICAgIGxldCB6b25lRnJhbWVOYW1lOiBab25lRnJhbWVOYW1lID0ge3pvbmVOYW1lOiB6b25lRnJhbWUuem9uZS5uYW1lfTtcbiAgICBsZXQgcmVzdWx0ID0gem9uZUZyYW1lTmFtZTtcbiAgICB3aGlsZSAoem9uZUZyYW1lLnBhcmVudCkge1xuICAgICAgem9uZUZyYW1lID0gem9uZUZyYW1lLnBhcmVudDtcbiAgICAgIGNvbnN0IHBhcmVudFpvbmVGcmFtZU5hbWUgPSB7em9uZU5hbWU6IHpvbmVGcmFtZS56b25lLm5hbWV9O1xuICAgICAgem9uZUZyYW1lTmFtZS5wYXJlbnQgPSBwYXJlbnRab25lRnJhbWVOYW1lO1xuICAgICAgem9uZUZyYW1lTmFtZSA9IHBhcmVudFpvbmVGcmFtZU5hbWU7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBidWlsZFpvbmVBd2FyZVN0YWNrRnJhbWVzKFxuICAgICAgb3JpZ2luYWxTdGFjazogc3RyaW5nLCB6b25lRnJhbWU6IF9ab25lRnJhbWV8Wm9uZUZyYW1lTmFtZXxudWxsLCBpc1pvbmVGcmFtZSA9IHRydWUpIHtcbiAgICBsZXQgZnJhbWVzOiBzdHJpbmdbXSA9IG9yaWdpbmFsU3RhY2suc3BsaXQoJ1xcbicpO1xuICAgIGxldCBpID0gMDtcbiAgICAvLyBGaW5kIHRoZSBmaXJzdCBmcmFtZVxuICAgIHdoaWxlICghKGZyYW1lc1tpXSA9PT0gem9uZUF3YXJlRnJhbWUxIHx8IGZyYW1lc1tpXSA9PT0gem9uZUF3YXJlRnJhbWUyIHx8XG4gICAgICAgICAgICAgZnJhbWVzW2ldID09PSB6b25lQXdhcmVGcmFtZTFXaXRob3V0TmV3IHx8IGZyYW1lc1tpXSA9PT0gem9uZUF3YXJlRnJhbWUyV2l0aG91dE5ldyB8fFxuICAgICAgICAgICAgIGZyYW1lc1tpXSA9PT0gem9uZUF3YXJlRnJhbWUzV2l0aG91dE5ldykgJiZcbiAgICAgICAgICAgaSA8IGZyYW1lcy5sZW5ndGgpIHtcbiAgICAgIGkrKztcbiAgICB9XG4gICAgZm9yICg7IGkgPCBmcmFtZXMubGVuZ3RoICYmIHpvbmVGcmFtZTsgaSsrKSB7XG4gICAgICBsZXQgZnJhbWUgPSBmcmFtZXNbaV07XG4gICAgICBpZiAoZnJhbWUudHJpbSgpKSB7XG4gICAgICAgIHN3aXRjaCAoYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1tmcmFtZV0pIHtcbiAgICAgICAgICBjYXNlIEZyYW1lVHlwZS5ibGFja0xpc3Q6XG4gICAgICAgICAgICBmcmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSBGcmFtZVR5cGUudHJhbnNpdGlvbjpcbiAgICAgICAgICAgIGlmICh6b25lRnJhbWUucGFyZW50KSB7XG4gICAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIHNwZWNpYWwgZnJhbWUgd2hlcmUgem9uZSBjaGFuZ2VkLiBQcmludCBhbmQgcHJvY2VzcyBpdCBhY2NvcmRpbmdseVxuICAgICAgICAgICAgICB6b25lRnJhbWUgPSB6b25lRnJhbWUucGFyZW50O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgem9uZUZyYW1lID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZyYW1lcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICBpLS07XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgZnJhbWVzW2ldICs9IGlzWm9uZUZyYW1lID8gYCBbJHsoem9uZUZyYW1lIGFzIF9ab25lRnJhbWUpLnpvbmUubmFtZX1dYCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBgIFskeyh6b25lRnJhbWUgYXMgWm9uZUZyYW1lTmFtZSkuem9uZU5hbWV9XWA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZyYW1lcy5qb2luKCdcXG4nKTtcbiAgfVxuICAvKipcbiAgICogVGhpcyBpcyBab25lQXdhcmVFcnJvciB3aGljaCBwcm9jZXNzZXMgdGhlIHN0YWNrIGZyYW1lIGFuZCBjbGVhbnMgdXAgZXh0cmEgZnJhbWVzIGFzIHdlbGwgYXNcbiAgICogYWRkcyB6b25lIGluZm9ybWF0aW9uIHRvIGl0LlxuICAgKi9cbiAgZnVuY3Rpb24gWm9uZUF3YXJlRXJyb3IoKTogRXJyb3Ige1xuICAgIC8vIFdlIGFsd2F5cyBoYXZlIHRvIHJldHVybiBuYXRpdmUgZXJyb3Igb3RoZXJ3aXNlIHRoZSBicm93c2VyIGNvbnNvbGUgd2lsbCBub3Qgd29yay5cbiAgICBsZXQgZXJyb3I6IEVycm9yID0gTmF0aXZlRXJyb3IuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAvLyBTYXZlIG9yaWdpbmFsIHN0YWNrIHRyYWNlXG4gICAgY29uc3Qgb3JpZ2luYWxTdGFjayA9IChlcnJvciBhcyBhbnkpWydvcmlnaW5hbFN0YWNrJ10gPSBlcnJvci5zdGFjaztcblxuICAgIC8vIFByb2Nlc3MgdGhlIHN0YWNrIHRyYWNlIGFuZCByZXdyaXRlIHRoZSBmcmFtZXMuXG4gICAgaWYgKChab25lQXdhcmVFcnJvciBhcyBhbnkpW3N0YWNrUmV3cml0ZV0gJiYgb3JpZ2luYWxTdGFjaykge1xuICAgICAgbGV0IHpvbmVGcmFtZSA9IGFwaS5jdXJyZW50Wm9uZUZyYW1lKCk7XG4gICAgICBpZiAoYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeSA9PT0gJ2xhenknKSB7XG4gICAgICAgIC8vIGRvbid0IGhhbmRsZSBzdGFjayB0cmFjZSBub3dcbiAgICAgICAgKGVycm9yIGFzIGFueSlbYXBpLnN5bWJvbCgnem9uZUZyYW1lTmFtZXMnKV0gPSBidWlsZFpvbmVGcmFtZU5hbWVzKHpvbmVGcmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKGJsYWNrTGlzdGVkU3RhY2tGcmFtZXNQb2xpY3kgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGVycm9yLnN0YWNrID0gZXJyb3Iuem9uZUF3YXJlU3RhY2sgPSBidWlsZFpvbmVBd2FyZVN0YWNrRnJhbWVzKG9yaWdpbmFsU3RhY2ssIHpvbmVGcmFtZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAvLyBpZ25vcmUgYXMgc29tZSBicm93c2VycyBkb24ndCBhbGxvdyBvdmVycmlkaW5nIG9mIHN0YWNrXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIE5hdGl2ZUVycm9yICYmIHRoaXMuY29uc3RydWN0b3IgIT0gTmF0aXZlRXJyb3IpIHtcbiAgICAgIC8vIFdlIGdvdCBjYWxsZWQgd2l0aCBhIGBuZXdgIG9wZXJhdG9yIEFORCB3ZSBhcmUgc3ViY2xhc3Mgb2YgWm9uZUF3YXJlRXJyb3JcbiAgICAgIC8vIGluIHRoYXQgY2FzZSB3ZSBoYXZlIHRvIGNvcHkgYWxsIG9mIG91ciBwcm9wZXJ0aWVzIHRvIGB0aGlzYC5cbiAgICAgIE9iamVjdC5rZXlzKGVycm9yKS5jb25jYXQoJ3N0YWNrJywgJ21lc3NhZ2UnKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSAoZXJyb3IgYXMgYW55KVtrZXldO1xuICAgICAgICBpZiAodmFsdWUgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICB0aGlzW2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAvLyBpZ25vcmUgdGhlIGFzc2lnbm1lbnQgaW4gY2FzZSBpdCBpcyBhIHNldHRlciBhbmQgaXQgdGhyb3dzLlxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgcmV0dXJuIGVycm9yO1xuICB9XG5cbiAgLy8gQ29weSB0aGUgcHJvdG90eXBlIHNvIHRoYXQgaW5zdGFuY2VvZiBvcGVyYXRvciB3b3JrcyBhcyBleHBlY3RlZFxuICBab25lQXdhcmVFcnJvci5wcm90b3R5cGUgPSBOYXRpdmVFcnJvci5wcm90b3R5cGU7XG4gIChab25lQXdhcmVFcnJvciBhcyBhbnkpW2JsYWNrbGlzdGVkU3RhY2tGcmFtZXNTeW1ib2xdID0gYmxhY2tMaXN0ZWRTdGFja0ZyYW1lcztcbiAgKFpvbmVBd2FyZUVycm9yIGFzIGFueSlbc3RhY2tSZXdyaXRlXSA9IGZhbHNlO1xuXG4gIGNvbnN0IHpvbmVBd2FyZVN0YWNrU3ltYm9sID0gYXBpLnN5bWJvbCgnem9uZUF3YXJlU3RhY2snKTtcblxuICAvLyB0cnkgdG8gZGVmaW5lIHpvbmVBd2FyZVN0YWNrIHByb3BlcnR5IHdoZW4gYmxhY2tMaXN0ZWRcbiAgLy8gcG9saWN5IGlzIGRlbGF5XG4gIGlmIChibGFja0xpc3RlZFN0YWNrRnJhbWVzUG9saWN5ID09PSAnbGF6eScpIHtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoWm9uZUF3YXJlRXJyb3IucHJvdG90eXBlLCAnem9uZUF3YXJlU3RhY2snLCB7XG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKCF0aGlzW3pvbmVBd2FyZVN0YWNrU3ltYm9sXSkge1xuICAgICAgICAgIHRoaXNbem9uZUF3YXJlU3RhY2tTeW1ib2xdID0gYnVpbGRab25lQXdhcmVTdGFja0ZyYW1lcyhcbiAgICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFN0YWNrLCB0aGlzW2FwaS5zeW1ib2woJ3pvbmVGcmFtZU5hbWVzJyldLCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXNbem9uZUF3YXJlU3RhY2tTeW1ib2xdO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24obmV3U3RhY2s6IHN0cmluZykge1xuICAgICAgICB0aGlzLm9yaWdpbmFsU3RhY2sgPSBuZXdTdGFjaztcbiAgICAgICAgdGhpc1t6b25lQXdhcmVTdGFja1N5bWJvbF0gPSBidWlsZFpvbmVBd2FyZVN0YWNrRnJhbWVzKFxuICAgICAgICAgICAgdGhpcy5vcmlnaW5hbFN0YWNrLCB0aGlzW2FwaS5zeW1ib2woJ3pvbmVGcmFtZU5hbWVzJyldLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICAvLyB0aG9zZSBwcm9wZXJ0aWVzIG5lZWQgc3BlY2lhbCBoYW5kbGluZ1xuICBjb25zdCBzcGVjaWFsUHJvcGVydHlOYW1lcyA9IFsnc3RhY2tUcmFjZUxpbWl0JywgJ2NhcHR1cmVTdGFja1RyYWNlJywgJ3ByZXBhcmVTdGFja1RyYWNlJ107XG4gIC8vIHRob3NlIHByb3BlcnRpZXMgb2YgTmF0aXZlRXJyb3Igc2hvdWxkIGJlIHNldCB0byBab25lQXdhcmVFcnJvclxuICBjb25zdCBuYXRpdmVFcnJvclByb3BlcnRpZXMgPSBPYmplY3Qua2V5cyhOYXRpdmVFcnJvcik7XG4gIGlmIChuYXRpdmVFcnJvclByb3BlcnRpZXMpIHtcbiAgICBuYXRpdmVFcnJvclByb3BlcnRpZXMuZm9yRWFjaChwcm9wID0+IHtcbiAgICAgIGlmIChzcGVjaWFsUHJvcGVydHlOYW1lcy5maWx0ZXIoc3AgPT4gc3AgPT09IHByb3ApLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoWm9uZUF3YXJlRXJyb3IsIHByb3AsIHtcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIE5hdGl2ZUVycm9yW3Byb3BdO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgTmF0aXZlRXJyb3JbcHJvcF0gPSB2YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKE5hdGl2ZUVycm9yLmhhc093blByb3BlcnR5KCdzdGFja1RyYWNlTGltaXQnKSkge1xuICAgIC8vIEV4dGVuZCBkZWZhdWx0IHN0YWNrIGxpbWl0IGFzIHdlIHdpbGwgYmUgcmVtb3ZpbmcgZmV3IGZyYW1lcy5cbiAgICBOYXRpdmVFcnJvci5zdGFja1RyYWNlTGltaXQgPSBNYXRoLm1heChOYXRpdmVFcnJvci5zdGFja1RyYWNlTGltaXQsIDE1KTtcblxuICAgIC8vIG1ha2Ugc3VyZSB0aGF0IFpvbmVBd2FyZUVycm9yIGhhcyB0aGUgc2FtZSBwcm9wZXJ0eSB3aGljaCBmb3J3YXJkcyB0byBOYXRpdmVFcnJvci5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoWm9uZUF3YXJlRXJyb3IsICdzdGFja1RyYWNlTGltaXQnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gTmF0aXZlRXJyb3Iuc3RhY2tUcmFjZUxpbWl0O1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIE5hdGl2ZUVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgaWYgKE5hdGl2ZUVycm9yLmhhc093blByb3BlcnR5KCdjYXB0dXJlU3RhY2tUcmFjZScpKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFpvbmVBd2FyZUVycm9yLCAnY2FwdHVyZVN0YWNrVHJhY2UnLCB7XG4gICAgICAvLyBhZGQgbmFtZWQgZnVuY3Rpb24gaGVyZSBiZWNhdXNlIHdlIG5lZWQgdG8gcmVtb3ZlIHRoaXNcbiAgICAgIC8vIHN0YWNrIGZyYW1lIHdoZW4gcHJlcGFyZVN0YWNrVHJhY2UgYmVsb3dcbiAgICAgIHZhbHVlOiBmdW5jdGlvbiB6b25lQ2FwdHVyZVN0YWNrVHJhY2UodGFyZ2V0T2JqZWN0OiBPYmplY3QsIGNvbnN0cnVjdG9yT3B0PzogRnVuY3Rpb24pIHtcbiAgICAgICAgTmF0aXZlRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UodGFyZ2V0T2JqZWN0LCBjb25zdHJ1Y3Rvck9wdCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjb25zdCBaT05FX0NBUFRVUkVTVEFDS1RSQUNFID0gJ3pvbmVDYXB0dXJlU3RhY2tUcmFjZSc7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShab25lQXdhcmVFcnJvciwgJ3ByZXBhcmVTdGFja1RyYWNlJywge1xuICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4gTmF0aXZlRXJyb3IucHJlcGFyZVN0YWNrVHJhY2U7XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlIHx8IHR5cGVvZiB2YWx1ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICByZXR1cm4gTmF0aXZlRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBOYXRpdmVFcnJvci5wcmVwYXJlU3RhY2tUcmFjZSA9IGZ1bmN0aW9uKFxuICAgICAgICAgICAgICAgICBlcnJvcjogRXJyb3IsIHN0cnVjdHVyZWRTdGFja1RyYWNlOiB7Z2V0RnVuY3Rpb25OYW1lOiBGdW5jdGlvbn1bXSkge1xuICAgICAgICAvLyByZW1vdmUgYWRkaXRpb25hbCBzdGFjayBpbmZvcm1hdGlvbiBmcm9tIFpvbmVBd2FyZUVycm9yLmNhcHR1cmVTdGFja1RyYWNlXG4gICAgICAgIGlmIChzdHJ1Y3R1cmVkU3RhY2tUcmFjZSkge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RydWN0dXJlZFN0YWNrVHJhY2UubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IHN0ID0gc3RydWN0dXJlZFN0YWNrVHJhY2VbaV07XG4gICAgICAgICAgICAvLyByZW1vdmUgdGhlIGZpcnN0IGZ1bmN0aW9uIHdoaWNoIG5hbWUgaXMgem9uZUNhcHR1cmVTdGFja1RyYWNlXG4gICAgICAgICAgICBpZiAoc3QuZ2V0RnVuY3Rpb25OYW1lKCkgPT09IFpPTkVfQ0FQVFVSRVNUQUNLVFJBQ0UpIHtcbiAgICAgICAgICAgICAgc3RydWN0dXJlZFN0YWNrVHJhY2Uuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlLmNhbGwodGhpcywgZXJyb3IsIHN0cnVjdHVyZWRTdGFja1RyYWNlKTtcbiAgICAgIH07XG4gICAgfVxuICB9KTtcblxuICBpZiAoYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeSA9PT0gJ2Rpc2FibGUnKSB7XG4gICAgLy8gZG9uJ3QgbmVlZCB0byBydW4gZGV0ZWN0Wm9uZSB0byBwb3B1bGF0ZVxuICAgIC8vIGJsYWNrbGlzdGVkIHN0YWNrIGZyYW1lc1xuICAgIHJldHVybjtcbiAgfVxuICAvLyBOb3cgd2UgbmVlZCB0byBwb3B1bGF0ZSB0aGUgYGJsYWNrbGlzdGVkU3RhY2tGcmFtZXNgIGFzIHdlbGwgYXMgZmluZCB0aGVcbiAgLy8gcnVuL3J1bkd1YXJkZWQvcnVuVGFzayBmcmFtZXMuIFRoaXMgaXMgZG9uZSBieSBjcmVhdGluZyBhIGRldGVjdCB6b25lIGFuZCB0aGVuIHRocmVhZGluZ1xuICAvLyB0aGUgZXhlY3V0aW9uIHRocm91Z2ggYWxsIG9mIHRoZSBhYm92ZSBtZXRob2RzIHNvIHRoYXQgd2UgY2FuIGxvb2sgYXQgdGhlIHN0YWNrIHRyYWNlIGFuZFxuICAvLyBmaW5kIHRoZSBmcmFtZXMgb2YgaW50ZXJlc3QuXG5cbiAgbGV0IGRldGVjdFpvbmU6IFpvbmUgPSBab25lLmN1cnJlbnQuZm9yayh7XG4gICAgbmFtZTogJ2RldGVjdCcsXG4gICAgb25IYW5kbGVFcnJvcjogZnVuY3Rpb24oXG4gICAgICAgIHBhcmVudFpEOiBab25lRGVsZWdhdGUsIGN1cnJlbnQ6IFpvbmUsIHRhcmdldDogWm9uZSwgZXJyb3I6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgaWYgKGVycm9yLm9yaWdpbmFsU3RhY2sgJiYgRXJyb3IgPT09IFpvbmVBd2FyZUVycm9yKSB7XG4gICAgICAgIGxldCBmcmFtZXMgPSBlcnJvci5vcmlnaW5hbFN0YWNrLnNwbGl0KC9cXG4vKTtcbiAgICAgICAgbGV0IHJ1bkZyYW1lID0gZmFsc2UsIHJ1bkd1YXJkZWRGcmFtZSA9IGZhbHNlLCBydW5UYXNrRnJhbWUgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKGZyYW1lcy5sZW5ndGgpIHtcbiAgICAgICAgICBsZXQgZnJhbWUgPSBmcmFtZXMuc2hpZnQoKTtcbiAgICAgICAgICAvLyBPbiBzYWZhcmkgaXQgaXMgcG9zc2libGUgdG8gaGF2ZSBzdGFjayBmcmFtZSB3aXRoIG5vIGxpbmUgbnVtYmVyLlxuICAgICAgICAgIC8vIFRoaXMgY2hlY2sgbWFrZXMgc3VyZSB0aGF0IHdlIGRvbid0IGZpbHRlciBmcmFtZXMgb24gbmFtZSBvbmx5IChtdXN0IGhhdmVcbiAgICAgICAgICAvLyBsaW5lIG51bWJlciBvciBleGFjdCBlcXVhbHMgdG8gYFpvbmVBd2FyZUVycm9yYClcbiAgICAgICAgICBpZiAoLzpcXGQrOlxcZCsvLnRlc3QoZnJhbWUpIHx8IGZyYW1lID09PSAnWm9uZUF3YXJlRXJyb3InKSB7XG4gICAgICAgICAgICAvLyBHZXQgcmlkIG9mIHRoZSBwYXRoIHNvIHRoYXQgd2UgZG9uJ3QgYWNjaWRlbnRhbGx5IGZpbmQgZnVuY3Rpb24gbmFtZSBpbiBwYXRoLlxuICAgICAgICAgICAgLy8gSW4gY2hyb21lIHRoZSBzZXBhcmF0b3IgaXMgYChgIGFuZCBgQGAgaW4gRkYgYW5kIHNhZmFyaVxuICAgICAgICAgICAgLy8gQ2hyb21lOiBhdCBab25lLnJ1biAoem9uZS5qczoxMDApXG4gICAgICAgICAgICAvLyBDaHJvbWU6IGF0IFpvbmUucnVuIChodHRwOi8vbG9jYWxob3N0Ojk4NzYvYmFzZS9idWlsZC9saWIvem9uZS5qczoxMDA6MjQpXG4gICAgICAgICAgICAvLyBGaXJlRm94OiBab25lLnByb3RvdHlwZS5ydW5AaHR0cDovL2xvY2FsaG9zdDo5ODc2L2Jhc2UvYnVpbGQvbGliL3pvbmUuanM6MTAxOjI0XG4gICAgICAgICAgICAvLyBTYWZhcmk6IHJ1bkBodHRwOi8vbG9jYWxob3N0Ojk4NzYvYmFzZS9idWlsZC9saWIvem9uZS5qczoxMDE6MjRcbiAgICAgICAgICAgIGxldCBmbk5hbWU6IHN0cmluZyA9IGZyYW1lLnNwbGl0KCcoJylbMF0uc3BsaXQoJ0AnKVswXTtcbiAgICAgICAgICAgIGxldCBmcmFtZVR5cGUgPSBGcmFtZVR5cGUudHJhbnNpdGlvbjtcbiAgICAgICAgICAgIGlmIChmbk5hbWUuaW5kZXhPZignWm9uZUF3YXJlRXJyb3InKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgaWYgKGZuTmFtZS5pbmRleE9mKCduZXcgWm9uZUF3YXJlRXJyb3InKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICB6b25lQXdhcmVGcmFtZTEgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICB6b25lQXdhcmVGcmFtZTIgPSBmcmFtZS5yZXBsYWNlKCduZXcgWm9uZUF3YXJlRXJyb3InLCAnbmV3IEVycm9yLlpvbmVBd2FyZUVycm9yJyk7XG4gICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgem9uZUF3YXJlRnJhbWUxV2l0aG91dE5ldyA9IGZyYW1lO1xuICAgICAgICAgICAgICAgIHpvbmVBd2FyZUZyYW1lMldpdGhvdXROZXcgPSBmcmFtZS5yZXBsYWNlKCdFcnJvci4nLCAnJyk7XG4gICAgICAgICAgICAgICAgaWYgKGZyYW1lLmluZGV4T2YoJ0Vycm9yLlpvbmVBd2FyZUVycm9yJykgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICB6b25lQXdhcmVGcmFtZTNXaXRob3V0TmV3ID1cbiAgICAgICAgICAgICAgICAgICAgICBmcmFtZS5yZXBsYWNlKCdab25lQXdhcmVFcnJvcicsICdFcnJvci5ab25lQXdhcmVFcnJvcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBibGFja0xpc3RlZFN0YWNrRnJhbWVzW3pvbmVBd2FyZUZyYW1lMl0gPSBGcmFtZVR5cGUuYmxhY2tMaXN0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGZuTmFtZS5pbmRleE9mKCdydW5HdWFyZGVkJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHJ1bkd1YXJkZWRGcmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZuTmFtZS5pbmRleE9mKCdydW5UYXNrJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHJ1blRhc2tGcmFtZSA9IHRydWU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGZuTmFtZS5pbmRleE9mKCdydW4nKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgcnVuRnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgZnJhbWVUeXBlID0gRnJhbWVUeXBlLmJsYWNrTGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGJsYWNrTGlzdGVkU3RhY2tGcmFtZXNbZnJhbWVdID0gZnJhbWVUeXBlO1xuICAgICAgICAgICAgLy8gT25jZSB3ZSBmaW5kIGFsbCBvZiB0aGUgZnJhbWVzIHdlIGNhbiBzdG9wIGxvb2tpbmcuXG4gICAgICAgICAgICBpZiAocnVuRnJhbWUgJiYgcnVuR3VhcmRlZEZyYW1lICYmIHJ1blRhc2tGcmFtZSkge1xuICAgICAgICAgICAgICAoWm9uZUF3YXJlRXJyb3IgYXMgYW55KVtzdGFja1Jld3JpdGVdID0gdHJ1ZTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9KSBhcyBab25lO1xuICAvLyBjYXJlZnVsbHkgY29uc3RydWN0b3IgYSBzdGFjayBmcmFtZSB3aGljaCBjb250YWlucyBhbGwgb2YgdGhlIGZyYW1lcyBvZiBpbnRlcmVzdCB3aGljaFxuICAvLyBuZWVkIHRvIGJlIGRldGVjdGVkIGFuZCBibGFja2xpc3RlZC5cblxuICBjb25zdCBjaGlsZERldGVjdFpvbmUgPSBkZXRlY3Rab25lLmZvcmsoe1xuICAgIG5hbWU6ICdjaGlsZCcsXG4gICAgb25TY2hlZHVsZVRhc2s6IGZ1bmN0aW9uKGRlbGVnYXRlLCBjdXJyLCB0YXJnZXQsIHRhc2spIHtcbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICB9LFxuICAgIG9uSW52b2tlVGFzazogZnVuY3Rpb24oZGVsZWdhdGUsIGN1cnIsIHRhcmdldCwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpIHtcbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldCwgdGFzaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MpO1xuICAgIH0sXG4gICAgb25DYW5jZWxUYXNrOiBmdW5jdGlvbihkZWxlZ2F0ZSwgY3VyciwgdGFyZ2V0LCB0YXNrKSB7XG4gICAgICByZXR1cm4gZGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXQsIHRhc2spO1xuICAgIH0sXG4gICAgb25JbnZva2U6IGZ1bmN0aW9uKGRlbGVnYXRlLCBjdXJyLCB0YXJnZXQsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKSB7XG4gICAgICByZXR1cm4gZGVsZWdhdGUuaW52b2tlKHRhcmdldCwgY2FsbGJhY2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gd2UgbmVlZCB0byBkZXRlY3QgYWxsIHpvbmUgcmVsYXRlZCBmcmFtZXMsIGl0IHdpbGxcbiAgLy8gZXhjZWVkIGRlZmF1bHQgc3RhY2tUcmFjZUxpbWl0LCBzbyB3ZSBzZXQgaXQgdG9cbiAgLy8gbGFyZ2VyIG51bWJlciBoZXJlLCBhbmQgcmVzdG9yZSBpdCBhZnRlciBkZXRlY3QgZmluaXNoLlxuICBjb25zdCBvcmlnaW5hbFN0YWNrVHJhY2VMaW1pdCA9IEVycm9yLnN0YWNrVHJhY2VMaW1pdDtcbiAgRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gMTAwO1xuICAvLyB3ZSBzY2hlZHVsZSBldmVudC9taWNyby9tYWNybyB0YXNrLCBhbmQgaW52b2tlIHRoZW1cbiAgLy8gd2hlbiBvblNjaGVkdWxlLCBzbyB3ZSBjYW4gZ2V0IGFsbCBzdGFjayB0cmFjZXMgZm9yXG4gIC8vIGFsbCBraW5kcyBvZiB0YXNrcyB3aXRoIG9uZSBlcnJvciB0aHJvd24uXG4gIGNoaWxkRGV0ZWN0Wm9uZS5ydW4oKCkgPT4ge1xuICAgIGNoaWxkRGV0ZWN0Wm9uZS5ydW5HdWFyZGVkKCgpID0+IHtcbiAgICAgIGNvbnN0IGZha2VUcmFuc2l0aW9uVG8gPSAoKSA9PiB7fTtcbiAgICAgIGNoaWxkRGV0ZWN0Wm9uZS5zY2hlZHVsZUV2ZW50VGFzayhcbiAgICAgICAgICBibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sLFxuICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgIGNoaWxkRGV0ZWN0Wm9uZS5zY2hlZHVsZU1hY3JvVGFzayhcbiAgICAgICAgICAgICAgICBibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sLFxuICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgIGNoaWxkRGV0ZWN0Wm9uZS5zY2hlZHVsZU1pY3JvVGFzayhcbiAgICAgICAgICAgICAgICAgICAgICBibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICh0OiBUYXNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAodCBhcyBhbnkpLl90cmFuc2l0aW9uVG8gPSBmYWtlVHJhbnNpdGlvblRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIGNoaWxkRGV0ZWN0Wm9uZS5zY2hlZHVsZU1pY3JvVGFzayhcbiAgICAgICAgICAgICAgICAgICAgICBibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sLFxuICAgICAgICAgICAgICAgICAgICAgICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IEVycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgICAgKHQ6IFRhc2spID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICh0IGFzIGFueSkuX3RyYW5zaXRpb25UbyA9IGZha2VUcmFuc2l0aW9uVG87XG4gICAgICAgICAgICAgICAgICAgICAgICB0Lmludm9rZSgpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAodCBhcyBhbnkpLl90cmFuc2l0aW9uVG8gPSBmYWtlVHJhbnNpdGlvblRvO1xuICAgICAgICAgICAgICAgICAgdC5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICgpID0+IHt9KTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAodCkgPT4ge1xuICAgICAgICAgICAgKHQgYXMgYW55KS5fdHJhbnNpdGlvblRvID0gZmFrZVRyYW5zaXRpb25UbztcbiAgICAgICAgICAgIHQuaW52b2tlKCk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICAoKSA9PiB7fSk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IG9yaWdpbmFsU3RhY2tUcmFjZUxpbWl0O1xufSk7XG4iXX0=