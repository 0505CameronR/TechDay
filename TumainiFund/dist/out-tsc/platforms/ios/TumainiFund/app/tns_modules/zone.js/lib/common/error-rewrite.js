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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXJyb3ItcmV3cml0ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2NvbW1vbi9lcnJvci1yZXdyaXRlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNIOzs7R0FHRztBQWlCSCxJQUFJLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDeEU7Ozs7T0FJRztJQVNILElBQU0sNEJBQTRCLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0lBQzFFLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2xFLGlFQUFpRTtJQUNqRSxJQUFNLHNCQUFzQixHQUFpQyxFQUFFLENBQUM7SUFDaEUsZ0dBQWdHO0lBQ2hHLElBQUksZUFBdUIsQ0FBQztJQUM1QixJQUFJLGVBQXVCLENBQUM7SUFDNUIsSUFBSSx5QkFBaUMsQ0FBQztJQUN0QyxJQUFJLHlCQUFpQyxDQUFDO0lBQ3RDLElBQUkseUJBQWlDLENBQUM7SUFFdEMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFHLGNBQWMsQ0FBQztJQUNqQyxJQUFNLFlBQVksR0FBRyxjQUFjLENBQUM7SUFHcEMsSUFBTSw0QkFBNEIsR0FDOUIsTUFBTSxDQUFDLDRDQUE0QyxDQUFDLElBQUksU0FBUyxDQUFDO0lBT3RFLFNBQVMsbUJBQW1CLENBQUMsU0FBcUI7UUFDaEQsSUFBSSxhQUFhLEdBQWtCLEVBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFDLENBQUM7UUFDbkUsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFD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dCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHtnbG9iYWxUaGlzLHVuZGVmaW5lZFZhcnN9XG4gKi9cblxuLyoqXG4gKiBFeHRlbmQgdGhlIEVycm9yIHdpdGggYWRkaXRpb25hbCBmaWVsZHMgZm9yIHJld3JpdHRlbiBzdGFjayBmcmFtZXNcbiAqL1xuaW50ZXJmYWNlIEVycm9yIHtcbiAgLyoqXG4gICAqIFN0YWNrIHRyYWNlIHdoZXJlIGV4dHJhIGZyYW1lcyBoYXZlIGJlZW4gcmVtb3ZlZCBhbmQgem9uZSBuYW1lcyBhZGRlZC5cbiAgICovXG4gIHpvbmVBd2FyZVN0YWNrPzogc3RyaW5nO1xuXG4gIC8qKlxuICAgKiBPcmlnaW5hbCBzdGFjayB0cmFjZSB3aXRoIG5vIG1vZGlmaWNhdGlvbnNcbiAgICovXG4gIG9yaWdpbmFsU3RhY2s/OiBzdHJpbmc7XG59XG5cblpvbmUuX19sb2FkX3BhdGNoKCdFcnJvcicsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIC8qXG4gICAqIFRoaXMgY29kZSBwYXRjaGVzIEVycm9yIHNvIHRoYXQ6XG4gICAqICAgLSBJdCBpZ25vcmVzIHVuLW5lZWRlZCBzdGFjayBmcmFtZXMuXG4gICAqICAgLSBJdCBTaG93cyB0aGUgYXNzb2NpYXRlZCBab25lIGZvciByZWFjaCBmcmFtZS5cbiAgICovXG5cbiAgY29uc3QgZW51bSBGcmFtZVR5cGUge1xuICAgIC8vLyBTa2lwIHRoaXMgZnJhbWUgd2hlbiBwcmludGluZyBvdXQgc3RhY2tcbiAgICBibGFja0xpc3QsXG4gICAgLy8vIFRoaXMgZnJhbWUgbWFya3Mgem9uZSB0cmFuc2l0aW9uXG4gICAgdHJhbnNpdGlvblxuICB9XG5cbiAgY29uc3QgYmxhY2tsaXN0ZWRTdGFja0ZyYW1lc1N5bWJvbCA9IGFwaS5zeW1ib2woJ2JsYWNrbGlzdGVkU3RhY2tGcmFtZXMnKTtcbiAgY29uc3QgTmF0aXZlRXJyb3IgPSBnbG9iYWxbYXBpLnN5bWJvbCgnRXJyb3InKV0gPSBnbG9iYWxbJ0Vycm9yJ107XG4gIC8vIFN0b3JlIHRoZSBmcmFtZXMgd2hpY2ggc2hvdWxkIGJlIHJlbW92ZWQgZnJvbSB0aGUgc3RhY2sgZnJhbWVzXG4gIGNvbnN0IGJsYWNrTGlzdGVkU3RhY2tGcmFtZXM6IHtbZnJhbWU6IHN0cmluZ106IEZyYW1lVHlwZX0gPSB7fTtcbiAgLy8gV2UgbXVzdCBmaW5kIHRoZSBmcmFtZSB3aGVyZSBFcnJvciB3YXMgY3JlYXRlZCwgb3RoZXJ3aXNlIHdlIGFzc3VtZSB3ZSBkb24ndCB1bmRlcnN0YW5kIHN0YWNrXG4gIGxldCB6b25lQXdhcmVGcmFtZTE6IHN0cmluZztcbiAgbGV0IHpvbmVBd2FyZUZyYW1lMjogc3RyaW5nO1xuICBsZXQgem9uZUF3YXJlRnJhbWUxV2l0aG91dE5ldzogc3RyaW5nO1xuICBsZXQgem9uZUF3YXJlRnJhbWUyV2l0aG91dE5ldzogc3RyaW5nO1xuICBsZXQgem9uZUF3YXJlRnJhbWUzV2l0aG91dE5ldzogc3RyaW5nO1xuXG4gIGdsb2JhbFsnRXJyb3InXSA9IFpvbmVBd2FyZUVycm9yO1xuICBjb25zdCBzdGFja1Jld3JpdGUgPSAnc3RhY2tSZXdyaXRlJztcblxuICB0eXBlIEJsYWNrTGlzdGVkU3RhY2tGcmFtZXNQb2xpY3kgPSAnZGVmYXVsdCd8J2Rpc2FibGUnfCdsYXp5JztcbiAgY29uc3QgYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeTogQmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeSA9XG4gICAgICBnbG9iYWxbJ19fWm9uZV9FcnJvcl9CbGFja2xpc3RlZFN0YWNrRnJhbWVzX3BvbGljeSddIHx8ICdkZWZhdWx0JztcblxuICBpbnRlcmZhY2UgWm9uZUZyYW1lTmFtZSB7XG4gICAgem9uZU5hbWU6IHN0cmluZztcbiAgICBwYXJlbnQ/OiBab25lRnJhbWVOYW1lO1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRab25lRnJhbWVOYW1lcyh6b25lRnJhbWU6IF9ab25lRnJhbWUpIHtcbiAgICBsZXQgem9uZUZyYW1lTmFtZTogWm9uZUZyYW1lTmFtZSA9IHt6b25lTmFtZTogem9uZUZyYW1lLnpvbmUubmFtZX07XG4gICAgbGV0IHJlc3VsdCA9IHpvbmVGcmFtZU5hbWU7XG4gICAgd2hpbGUgKHpvbmVGcmFtZS5wYXJlbnQpIHtcbiAgICAgIHpvbmVGcmFtZSA9IHpvbmVGcmFtZS5wYXJlbnQ7XG4gICAgICBjb25zdCBwYXJlbnRab25lRnJhbWVOYW1lID0ge3pvbmVOYW1lOiB6b25lRnJhbWUuem9uZS5uYW1lfTtcbiAgICAgIHpvbmVGcmFtZU5hbWUucGFyZW50ID0gcGFyZW50Wm9uZUZyYW1lTmFtZTtcbiAgICAgIHpvbmVGcmFtZU5hbWUgPSBwYXJlbnRab25lRnJhbWVOYW1lO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG5cbiAgZnVuY3Rpb24gYnVpbGRab25lQXdhcmVTdGFja0ZyYW1lcyhcbiAgICAgIG9yaWdpbmFsU3RhY2s6IHN0cmluZywgem9uZUZyYW1lOiBfWm9uZUZyYW1lfFpvbmVGcmFtZU5hbWV8bnVsbCwgaXNab25lRnJhbWUgPSB0cnVlKSB7XG4gICAgbGV0IGZyYW1lczogc3RyaW5nW10gPSBvcmlnaW5hbFN0YWNrLnNwbGl0KCdcXG4nKTtcbiAgICBsZXQgaSA9IDA7XG4gICAgLy8gRmluZCB0aGUgZmlyc3QgZnJhbWVcbiAgICB3aGlsZSAoIShmcmFtZXNbaV0gPT09IHpvbmVBd2FyZUZyYW1lMSB8fCBmcmFtZXNbaV0gPT09IHpvbmVBd2FyZUZyYW1lMiB8fFxuICAgICAgICAgICAgIGZyYW1lc1tpXSA9PT0gem9uZUF3YXJlRnJhbWUxV2l0aG91dE5ldyB8fCBmcmFtZXNbaV0gPT09IHpvbmVBd2FyZUZyYW1lMldpdGhvdXROZXcgfHxcbiAgICAgICAgICAgICBmcmFtZXNbaV0gPT09IHpvbmVBd2FyZUZyYW1lM1dpdGhvdXROZXcpICYmXG4gICAgICAgICAgIGkgPCBmcmFtZXMubGVuZ3RoKSB7XG4gICAgICBpKys7XG4gICAgfVxuICAgIGZvciAoOyBpIDwgZnJhbWVzLmxlbmd0aCAmJiB6b25lRnJhbWU7IGkrKykge1xuICAgICAgbGV0IGZyYW1lID0gZnJhbWVzW2ldO1xuICAgICAgaWYgKGZyYW1lLnRyaW0oKSkge1xuICAgICAgICBzd2l0Y2ggKGJsYWNrTGlzdGVkU3RhY2tGcmFtZXNbZnJhbWVdKSB7XG4gICAgICAgICAgY2FzZSBGcmFtZVR5cGUuYmxhY2tMaXN0OlxuICAgICAgICAgICAgZnJhbWVzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgRnJhbWVUeXBlLnRyYW5zaXRpb246XG4gICAgICAgICAgICBpZiAoem9uZUZyYW1lLnBhcmVudCkge1xuICAgICAgICAgICAgICAvLyBUaGlzIGlzIHRoZSBzcGVjaWFsIGZyYW1lIHdoZXJlIHpvbmUgY2hhbmdlZC4gUHJpbnQgYW5kIHByb2Nlc3MgaXQgYWNjb3JkaW5nbHlcbiAgICAgICAgICAgICAgem9uZUZyYW1lID0gem9uZUZyYW1lLnBhcmVudDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHpvbmVGcmFtZSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmcmFtZXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaS0tO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIGZyYW1lc1tpXSArPSBpc1pvbmVGcmFtZSA/IGAgWyR7KHpvbmVGcmFtZSBhcyBfWm9uZUZyYW1lKS56b25lLm5hbWV9XWAgOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYCBbJHsoem9uZUZyYW1lIGFzIFpvbmVGcmFtZU5hbWUpLnpvbmVOYW1lfV1gO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmcmFtZXMuam9pbignXFxuJyk7XG4gIH1cbiAgLyoqXG4gICAqIFRoaXMgaXMgWm9uZUF3YXJlRXJyb3Igd2hpY2ggcHJvY2Vzc2VzIHRoZSBzdGFjayBmcmFtZSBhbmQgY2xlYW5zIHVwIGV4dHJhIGZyYW1lcyBhcyB3ZWxsIGFzXG4gICAqIGFkZHMgem9uZSBpbmZvcm1hdGlvbiB0byBpdC5cbiAgICovXG4gIGZ1bmN0aW9uIFpvbmVBd2FyZUVycm9yKCk6IEVycm9yIHtcbiAgICAvLyBXZSBhbHdheXMgaGF2ZSB0byByZXR1cm4gbmF0aXZlIGVycm9yIG90aGVyd2lzZSB0aGUgYnJvd3NlciBjb25zb2xlIHdpbGwgbm90IHdvcmsuXG4gICAgbGV0IGVycm9yOiBFcnJvciA9IE5hdGl2ZUVycm9yLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgLy8gU2F2ZSBvcmlnaW5hbCBzdGFjayB0cmFjZVxuICAgIGNvbnN0IG9yaWdpbmFsU3RhY2sgPSAoZXJyb3IgYXMgYW55KVsnb3JpZ2luYWxTdGFjayddID0gZXJyb3Iuc3RhY2s7XG5cbiAgICAvLyBQcm9jZXNzIHRoZSBzdGFjayB0cmFjZSBhbmQgcmV3cml0ZSB0aGUgZnJhbWVzLlxuICAgIGlmICgoWm9uZUF3YXJlRXJyb3IgYXMgYW55KVtzdGFja1Jld3JpdGVdICYmIG9yaWdpbmFsU3RhY2spIHtcbiAgICAgIGxldCB6b25lRnJhbWUgPSBhcGkuY3VycmVudFpvbmVGcmFtZSgpO1xuICAgICAgaWYgKGJsYWNrTGlzdGVkU3RhY2tGcmFtZXNQb2xpY3kgPT09ICdsYXp5Jykge1xuICAgICAgICAvLyBkb24ndCBoYW5kbGUgc3RhY2sgdHJhY2Ugbm93XG4gICAgICAgIChlcnJvciBhcyBhbnkpW2FwaS5zeW1ib2woJ3pvbmVGcmFtZU5hbWVzJyldID0gYnVpbGRab25lRnJhbWVOYW1lcyh6b25lRnJhbWUpO1xuICAgICAgfSBlbHNlIGlmIChibGFja0xpc3RlZFN0YWNrRnJhbWVzUG9saWN5ID09PSAnZGVmYXVsdCcpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBlcnJvci5zdGFjayA9IGVycm9yLnpvbmVBd2FyZVN0YWNrID0gYnVpbGRab25lQXdhcmVTdGFja0ZyYW1lcyhvcmlnaW5hbFN0YWNrLCB6b25lRnJhbWUpO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaWdub3JlIGFzIHNvbWUgYnJvd3NlcnMgZG9uJ3QgYWxsb3cgb3ZlcnJpZGluZyBvZiBzdGFja1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHRoaXMgaW5zdGFuY2VvZiBOYXRpdmVFcnJvciAmJiB0aGlzLmNvbnN0cnVjdG9yICE9IE5hdGl2ZUVycm9yKSB7XG4gICAgICAvLyBXZSBnb3QgY2FsbGVkIHdpdGggYSBgbmV3YCBvcGVyYXRvciBBTkQgd2UgYXJlIHN1YmNsYXNzIG9mIFpvbmVBd2FyZUVycm9yXG4gICAgICAvLyBpbiB0aGF0IGNhc2Ugd2UgaGF2ZSB0byBjb3B5IGFsbCBvZiBvdXIgcHJvcGVydGllcyB0byBgdGhpc2AuXG4gICAgICBPYmplY3Qua2V5cyhlcnJvcikuY29uY2F0KCdzdGFjaycsICdtZXNzYWdlJykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gKGVycm9yIGFzIGFueSlba2V5XTtcbiAgICAgICAgaWYgKHZhbHVlICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgdGhpc1trZXldID0gdmFsdWU7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gaWdub3JlIHRoZSBhc3NpZ25tZW50IGluIGNhc2UgaXQgaXMgYSBzZXR0ZXIgYW5kIGl0IHRocm93cy5cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHJldHVybiBlcnJvcjtcbiAgfVxuXG4gIC8vIENvcHkgdGhlIHByb3RvdHlwZSBzbyB0aGF0IGluc3RhbmNlb2Ygb3BlcmF0b3Igd29ya3MgYXMgZXhwZWN0ZWRcbiAgWm9uZUF3YXJlRXJyb3IucHJvdG90eXBlID0gTmF0aXZlRXJyb3IucHJvdG90eXBlO1xuICAoWm9uZUF3YXJlRXJyb3IgYXMgYW55KVtibGFja2xpc3RlZFN0YWNrRnJhbWVzU3ltYm9sXSA9IGJsYWNrTGlzdGVkU3RhY2tGcmFtZXM7XG4gIChab25lQXdhcmVFcnJvciBhcyBhbnkpW3N0YWNrUmV3cml0ZV0gPSBmYWxzZTtcblxuICBjb25zdCB6b25lQXdhcmVTdGFja1N5bWJvbCA9IGFwaS5zeW1ib2woJ3pvbmVBd2FyZVN0YWNrJyk7XG5cbiAgLy8gdHJ5IHRvIGRlZmluZSB6b25lQXdhcmVTdGFjayBwcm9wZXJ0eSB3aGVuIGJsYWNrTGlzdGVkXG4gIC8vIHBvbGljeSBpcyBkZWxheVxuICBpZiAoYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1BvbGljeSA9PT0gJ2xhenknKSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFpvbmVBd2FyZUVycm9yLnByb3RvdHlwZSwgJ3pvbmVBd2FyZVN0YWNrJywge1xuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICghdGhpc1t6b25lQXdhcmVTdGFja1N5bWJvbF0pIHtcbiAgICAgICAgICB0aGlzW3pvbmVBd2FyZVN0YWNrU3ltYm9sXSA9IGJ1aWxkWm9uZUF3YXJlU3RhY2tGcmFtZXMoXG4gICAgICAgICAgICAgIHRoaXMub3JpZ2luYWxTdGFjaywgdGhpc1thcGkuc3ltYm9sKCd6b25lRnJhbWVOYW1lcycpXSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzW3pvbmVBd2FyZVN0YWNrU3ltYm9sXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKG5ld1N0YWNrOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5vcmlnaW5hbFN0YWNrID0gbmV3U3RhY2s7XG4gICAgICAgIHRoaXNbem9uZUF3YXJlU3RhY2tTeW1ib2xdID0gYnVpbGRab25lQXdhcmVTdGFja0ZyYW1lcyhcbiAgICAgICAgICAgIHRoaXMub3JpZ2luYWxTdGFjaywgdGhpc1thcGkuc3ltYm9sKCd6b25lRnJhbWVOYW1lcycpXSwgZmFsc2UpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgLy8gdGhvc2UgcHJvcGVydGllcyBuZWVkIHNwZWNpYWwgaGFuZGxpbmdcbiAgY29uc3Qgc3BlY2lhbFByb3BlcnR5TmFtZXMgPSBbJ3N0YWNrVHJhY2VMaW1pdCcsICdjYXB0dXJlU3RhY2tUcmFjZScsICdwcmVwYXJlU3RhY2tUcmFjZSddO1xuICAvLyB0aG9zZSBwcm9wZXJ0aWVzIG9mIE5hdGl2ZUVycm9yIHNob3VsZCBiZSBzZXQgdG8gWm9uZUF3YXJlRXJyb3JcbiAgY29uc3QgbmF0aXZlRXJyb3JQcm9wZXJ0aWVzID0gT2JqZWN0LmtleXMoTmF0aXZlRXJyb3IpO1xuICBpZiAobmF0aXZlRXJyb3JQcm9wZXJ0aWVzKSB7XG4gICAgbmF0aXZlRXJyb3JQcm9wZXJ0aWVzLmZvckVhY2gocHJvcCA9PiB7XG4gICAgICBpZiAoc3BlY2lhbFByb3BlcnR5TmFtZXMuZmlsdGVyKHNwID0+IHNwID09PSBwcm9wKS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFpvbmVBd2FyZUVycm9yLCBwcm9wLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBOYXRpdmVFcnJvcltwcm9wXTtcbiAgICAgICAgICB9LFxuICAgICAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgIE5hdGl2ZUVycm9yW3Byb3BdID0gdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChOYXRpdmVFcnJvci5oYXNPd25Qcm9wZXJ0eSgnc3RhY2tUcmFjZUxpbWl0JykpIHtcbiAgICAvLyBFeHRlbmQgZGVmYXVsdCBzdGFjayBsaW1pdCBhcyB3ZSB3aWxsIGJlIHJlbW92aW5nIGZldyBmcmFtZXMuXG4gICAgTmF0aXZlRXJyb3Iuc3RhY2tUcmFjZUxpbWl0ID0gTWF0aC5tYXgoTmF0aXZlRXJyb3Iuc3RhY2tUcmFjZUxpbWl0LCAxNSk7XG5cbiAgICAvLyBtYWtlIHN1cmUgdGhhdCBab25lQXdhcmVFcnJvciBoYXMgdGhlIHNhbWUgcHJvcGVydHkgd2hpY2ggZm9yd2FyZHMgdG8gTmF0aXZlRXJyb3IuXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFpvbmVBd2FyZUVycm9yLCAnc3RhY2tUcmFjZUxpbWl0Jywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIE5hdGl2ZUVycm9yLnN0YWNrVHJhY2VMaW1pdDtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBOYXRpdmVFcnJvci5zdGFja1RyYWNlTGltaXQgPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIGlmIChOYXRpdmVFcnJvci5oYXNPd25Qcm9wZXJ0eSgnY2FwdHVyZVN0YWNrVHJhY2UnKSkge1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShab25lQXdhcmVFcnJvciwgJ2NhcHR1cmVTdGFja1RyYWNlJywge1xuICAgICAgLy8gYWRkIG5hbWVkIGZ1bmN0aW9uIGhlcmUgYmVjYXVzZSB3ZSBuZWVkIHRvIHJlbW92ZSB0aGlzXG4gICAgICAvLyBzdGFjayBmcmFtZSB3aGVuIHByZXBhcmVTdGFja1RyYWNlIGJlbG93XG4gICAgICB2YWx1ZTogZnVuY3Rpb24gem9uZUNhcHR1cmVTdGFja1RyYWNlKHRhcmdldE9iamVjdDogT2JqZWN0LCBjb25zdHJ1Y3Rvck9wdD86IEZ1bmN0aW9uKSB7XG4gICAgICAgIE5hdGl2ZUVycm9yLmNhcHR1cmVTdGFja1RyYWNlKHRhcmdldE9iamVjdCwgY29uc3RydWN0b3JPcHQpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgY29uc3QgWk9ORV9DQVBUVVJFU1RBQ0tUUkFDRSA9ICd6b25lQ2FwdHVyZVN0YWNrVHJhY2UnO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkoWm9uZUF3YXJlRXJyb3IsICdwcmVwYXJlU3RhY2tUcmFjZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIE5hdGl2ZUVycm9yLnByZXBhcmVTdGFja1RyYWNlO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgaWYgKCF2YWx1ZSB8fCB0eXBlb2YgdmFsdWUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcmV0dXJuIE5hdGl2ZUVycm9yLnByZXBhcmVTdGFja1RyYWNlID0gdmFsdWU7XG4gICAgICB9XG4gICAgICByZXR1cm4gTmF0aXZlRXJyb3IucHJlcGFyZVN0YWNrVHJhY2UgPSBmdW5jdGlvbihcbiAgICAgICAgICAgICAgICAgZXJyb3I6IEVycm9yLCBzdHJ1Y3R1cmVkU3RhY2tUcmFjZToge2dldEZ1bmN0aW9uTmFtZTogRnVuY3Rpb259W10pIHtcbiAgICAgICAgLy8gcmVtb3ZlIGFkZGl0aW9uYWwgc3RhY2sgaW5mb3JtYXRpb24gZnJvbSBab25lQXdhcmVFcnJvci5jYXB0dXJlU3RhY2tUcmFjZVxuICAgICAgICBpZiAoc3RydWN0dXJlZFN0YWNrVHJhY2UpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHN0cnVjdHVyZWRTdGFja1RyYWNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBzdCA9IHN0cnVjdHVyZWRTdGFja1RyYWNlW2ldO1xuICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSBmaXJzdCBmdW5jdGlvbiB3aGljaCBuYW1lIGlzIHpvbmVDYXB0dXJlU3RhY2tUcmFjZVxuICAgICAgICAgICAgaWYgKHN0LmdldEZ1bmN0aW9uTmFtZSgpID09PSBaT05FX0NBUFRVUkVTVEFDS1RSQUNFKSB7XG4gICAgICAgICAgICAgIHN0cnVjdHVyZWRTdGFja1RyYWNlLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZS5jYWxsKHRoaXMsIGVycm9yLCBzdHJ1Y3R1cmVkU3RhY2tUcmFjZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG5cbiAgaWYgKGJsYWNrTGlzdGVkU3RhY2tGcmFtZXNQb2xpY3kgPT09ICdkaXNhYmxlJykge1xuICAgIC8vIGRvbid0IG5lZWQgdG8gcnVuIGRldGVjdFpvbmUgdG8gcG9wdWxhdGVcbiAgICAvLyBibGFja2xpc3RlZCBzdGFjayBmcmFtZXNcbiAgICByZXR1cm47XG4gIH1cbiAgLy8gTm93IHdlIG5lZWQgdG8gcG9wdWxhdGUgdGhlIGBibGFja2xpc3RlZFN0YWNrRnJhbWVzYCBhcyB3ZWxsIGFzIGZpbmQgdGhlXG4gIC8vIHJ1bi9ydW5HdWFyZGVkL3J1blRhc2sgZnJhbWVzLiBUaGlzIGlzIGRvbmUgYnkgY3JlYXRpbmcgYSBkZXRlY3Qgem9uZSBhbmQgdGhlbiB0aHJlYWRpbmdcbiAgLy8gdGhlIGV4ZWN1dGlvbiB0aHJvdWdoIGFsbCBvZiB0aGUgYWJvdmUgbWV0aG9kcyBzbyB0aGF0IHdlIGNhbiBsb29rIGF0IHRoZSBzdGFjayB0cmFjZSBhbmRcbiAgLy8gZmluZCB0aGUgZnJhbWVzIG9mIGludGVyZXN0LlxuXG4gIGxldCBkZXRlY3Rab25lOiBab25lID0gWm9uZS5jdXJyZW50LmZvcmsoe1xuICAgIG5hbWU6ICdkZXRlY3QnLFxuICAgIG9uSGFuZGxlRXJyb3I6IGZ1bmN0aW9uKFxuICAgICAgICBwYXJlbnRaRDogWm9uZURlbGVnYXRlLCBjdXJyZW50OiBab25lLCB0YXJnZXQ6IFpvbmUsIGVycm9yOiBhbnkpOiBib29sZWFuIHtcbiAgICAgIGlmIChlcnJvci5vcmlnaW5hbFN0YWNrICYmIEVycm9yID09PSBab25lQXdhcmVFcnJvcikge1xuICAgICAgICBsZXQgZnJhbWVzID0gZXJyb3Iub3JpZ2luYWxTdGFjay5zcGxpdCgvXFxuLyk7XG4gICAgICAgIGxldCBydW5GcmFtZSA9IGZhbHNlLCBydW5HdWFyZGVkRnJhbWUgPSBmYWxzZSwgcnVuVGFza0ZyYW1lID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChmcmFtZXMubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGZyYW1lID0gZnJhbWVzLnNoaWZ0KCk7XG4gICAgICAgICAgLy8gT24gc2FmYXJpIGl0IGlzIHBvc3NpYmxlIHRvIGhhdmUgc3RhY2sgZnJhbWUgd2l0aCBubyBsaW5lIG51bWJlci5cbiAgICAgICAgICAvLyBUaGlzIGNoZWNrIG1ha2VzIHN1cmUgdGhhdCB3ZSBkb24ndCBmaWx0ZXIgZnJhbWVzIG9uIG5hbWUgb25seSAobXVzdCBoYXZlXG4gICAgICAgICAgLy8gbGluZSBudW1iZXIgb3IgZXhhY3QgZXF1YWxzIHRvIGBab25lQXdhcmVFcnJvcmApXG4gICAgICAgICAgaWYgKC86XFxkKzpcXGQrLy50ZXN0KGZyYW1lKSB8fCBmcmFtZSA9PT0gJ1pvbmVBd2FyZUVycm9yJykge1xuICAgICAgICAgICAgLy8gR2V0IHJpZCBvZiB0aGUgcGF0aCBzbyB0aGF0IHdlIGRvbid0IGFjY2lkZW50YWxseSBmaW5kIGZ1bmN0aW9uIG5hbWUgaW4gcGF0aC5cbiAgICAgICAgICAgIC8vIEluIGNocm9tZSB0aGUgc2VwYXJhdG9yIGlzIGAoYCBhbmQgYEBgIGluIEZGIGFuZCBzYWZhcmlcbiAgICAgICAgICAgIC8vIENocm9tZTogYXQgWm9uZS5ydW4gKHpvbmUuanM6MTAwKVxuICAgICAgICAgICAgLy8gQ2hyb21lOiBhdCBab25lLnJ1biAoaHR0cDovL2xvY2FsaG9zdDo5ODc2L2Jhc2UvYnVpbGQvbGliL3pvbmUuanM6MTAwOjI0KVxuICAgICAgICAgICAgLy8gRmlyZUZveDogWm9uZS5wcm90b3R5cGUucnVuQGh0dHA6Ly9sb2NhbGhvc3Q6OTg3Ni9iYXNlL2J1aWxkL2xpYi96b25lLmpzOjEwMToyNFxuICAgICAgICAgICAgLy8gU2FmYXJpOiBydW5AaHR0cDovL2xvY2FsaG9zdDo5ODc2L2Jhc2UvYnVpbGQvbGliL3pvbmUuanM6MTAxOjI0XG4gICAgICAgICAgICBsZXQgZm5OYW1lOiBzdHJpbmcgPSBmcmFtZS5zcGxpdCgnKCcpWzBdLnNwbGl0KCdAJylbMF07XG4gICAgICAgICAgICBsZXQgZnJhbWVUeXBlID0gRnJhbWVUeXBlLnRyYW5zaXRpb247XG4gICAgICAgICAgICBpZiAoZm5OYW1lLmluZGV4T2YoJ1pvbmVBd2FyZUVycm9yJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIGlmIChmbk5hbWUuaW5kZXhPZignbmV3IFpvbmVBd2FyZUVycm9yJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgem9uZUF3YXJlRnJhbWUxID0gZnJhbWU7XG4gICAgICAgICAgICAgICAgem9uZUF3YXJlRnJhbWUyID0gZnJhbWUucmVwbGFjZSgnbmV3IFpvbmVBd2FyZUVycm9yJywgJ25ldyBFcnJvci5ab25lQXdhcmVFcnJvcicpO1xuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHpvbmVBd2FyZUZyYW1lMVdpdGhvdXROZXcgPSBmcmFtZTtcbiAgICAgICAgICAgICAgICB6b25lQXdhcmVGcmFtZTJXaXRob3V0TmV3ID0gZnJhbWUucmVwbGFjZSgnRXJyb3IuJywgJycpO1xuICAgICAgICAgICAgICAgIGlmIChmcmFtZS5pbmRleE9mKCdFcnJvci5ab25lQXdhcmVFcnJvcicpID09PSAtMSkge1xuICAgICAgICAgICAgICAgICAgem9uZUF3YXJlRnJhbWUzV2l0aG91dE5ldyA9XG4gICAgICAgICAgICAgICAgICAgICAgZnJhbWUucmVwbGFjZSgnWm9uZUF3YXJlRXJyb3InLCAnRXJyb3IuWm9uZUF3YXJlRXJyb3InKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYmxhY2tMaXN0ZWRTdGFja0ZyYW1lc1t6b25lQXdhcmVGcmFtZTJdID0gRnJhbWVUeXBlLmJsYWNrTGlzdDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChmbk5hbWUuaW5kZXhPZigncnVuR3VhcmRlZCcpICE9PSAtMSkge1xuICAgICAgICAgICAgICBydW5HdWFyZGVkRnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmbk5hbWUuaW5kZXhPZigncnVuVGFzaycpICE9PSAtMSkge1xuICAgICAgICAgICAgICBydW5UYXNrRnJhbWUgPSB0cnVlO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChmbk5hbWUuaW5kZXhPZigncnVuJykgIT09IC0xKSB7XG4gICAgICAgICAgICAgIHJ1bkZyYW1lID0gdHJ1ZTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGZyYW1lVHlwZSA9IEZyYW1lVHlwZS5ibGFja0xpc3Q7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBibGFja0xpc3RlZFN0YWNrRnJhbWVzW2ZyYW1lXSA9IGZyYW1lVHlwZTtcbiAgICAgICAgICAgIC8vIE9uY2Ugd2UgZmluZCBhbGwgb2YgdGhlIGZyYW1lcyB3ZSBjYW4gc3RvcCBsb29raW5nLlxuICAgICAgICAgICAgaWYgKHJ1bkZyYW1lICYmIHJ1bkd1YXJkZWRGcmFtZSAmJiBydW5UYXNrRnJhbWUpIHtcbiAgICAgICAgICAgICAgKFpvbmVBd2FyZUVycm9yIGFzIGFueSlbc3RhY2tSZXdyaXRlXSA9IHRydWU7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfSkgYXMgWm9uZTtcbiAgLy8gY2FyZWZ1bGx5IGNvbnN0cnVjdG9yIGEgc3RhY2sgZnJhbWUgd2hpY2ggY29udGFpbnMgYWxsIG9mIHRoZSBmcmFtZXMgb2YgaW50ZXJlc3Qgd2hpY2hcbiAgLy8gbmVlZCB0byBiZSBkZXRlY3RlZCBhbmQgYmxhY2tsaXN0ZWQuXG5cbiAgY29uc3QgY2hpbGREZXRlY3Rab25lID0gZGV0ZWN0Wm9uZS5mb3JrKHtcbiAgICBuYW1lOiAnY2hpbGQnLFxuICAgIG9uU2NoZWR1bGVUYXNrOiBmdW5jdGlvbihkZWxlZ2F0ZSwgY3VyciwgdGFyZ2V0LCB0YXNrKSB7XG4gICAgICByZXR1cm4gZGVsZWdhdGUuc2NoZWR1bGVUYXNrKHRhcmdldCwgdGFzayk7XG4gICAgfSxcbiAgICBvbkludm9rZVRhc2s6IGZ1bmN0aW9uKGRlbGVnYXRlLCBjdXJyLCB0YXJnZXQsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSB7XG4gICAgICByZXR1cm4gZGVsZWdhdGUuaW52b2tlVGFzayh0YXJnZXQsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKTtcbiAgICB9LFxuICAgIG9uQ2FuY2VsVGFzazogZnVuY3Rpb24oZGVsZWdhdGUsIGN1cnIsIHRhcmdldCwgdGFzaykge1xuICAgICAgcmV0dXJuIGRlbGVnYXRlLmNhbmNlbFRhc2sodGFyZ2V0LCB0YXNrKTtcbiAgICB9LFxuICAgIG9uSW52b2tlOiBmdW5jdGlvbihkZWxlZ2F0ZSwgY3VyciwgdGFyZ2V0LCBjYWxsYmFjaywgYXBwbHlUaGlzLCBhcHBseUFyZ3MsIHNvdXJjZSkge1xuICAgICAgcmV0dXJuIGRlbGVnYXRlLmludm9rZSh0YXJnZXQsIGNhbGxiYWNrLCBhcHBseVRoaXMsIGFwcGx5QXJncywgc291cmNlKTtcbiAgICB9XG4gIH0pO1xuXG4gIC8vIHdlIG5lZWQgdG8gZGV0ZWN0IGFsbCB6b25lIHJlbGF0ZWQgZnJhbWVzLCBpdCB3aWxsXG4gIC8vIGV4Y2VlZCBkZWZhdWx0IHN0YWNrVHJhY2VMaW1pdCwgc28gd2Ugc2V0IGl0IHRvXG4gIC8vIGxhcmdlciBudW1iZXIgaGVyZSwgYW5kIHJlc3RvcmUgaXQgYWZ0ZXIgZGV0ZWN0IGZpbmlzaC5cbiAgY29uc3Qgb3JpZ2luYWxTdGFja1RyYWNlTGltaXQgPSBFcnJvci5zdGFja1RyYWNlTGltaXQ7XG4gIEVycm9yLnN0YWNrVHJhY2VMaW1pdCA9IDEwMDtcbiAgLy8gd2Ugc2NoZWR1bGUgZXZlbnQvbWljcm8vbWFjcm8gdGFzaywgYW5kIGludm9rZSB0aGVtXG4gIC8vIHdoZW4gb25TY2hlZHVsZSwgc28gd2UgY2FuIGdldCBhbGwgc3RhY2sgdHJhY2VzIGZvclxuICAvLyBhbGwga2luZHMgb2YgdGFza3Mgd2l0aCBvbmUgZXJyb3IgdGhyb3duLlxuICBjaGlsZERldGVjdFpvbmUucnVuKCgpID0+IHtcbiAgICBjaGlsZERldGVjdFpvbmUucnVuR3VhcmRlZCgoKSA9PiB7XG4gICAgICBjb25zdCBmYWtlVHJhbnNpdGlvblRvID0gKCkgPT4ge307XG4gICAgICBjaGlsZERldGVjdFpvbmUuc2NoZWR1bGVFdmVudFRhc2soXG4gICAgICAgICAgYmxhY2tsaXN0ZWRTdGFja0ZyYW1lc1N5bWJvbCxcbiAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICBjaGlsZERldGVjdFpvbmUuc2NoZWR1bGVNYWNyb1Rhc2soXG4gICAgICAgICAgICAgICAgYmxhY2tsaXN0ZWRTdGFja0ZyYW1lc1N5bWJvbCxcbiAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICBjaGlsZERldGVjdFpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soXG4gICAgICAgICAgICAgICAgICAgICAgYmxhY2tsaXN0ZWRTdGFja0ZyYW1lc1N5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAodDogVGFzaykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgKHQgYXMgYW55KS5fdHJhbnNpdGlvblRvID0gZmFrZVRyYW5zaXRpb25UbztcbiAgICAgICAgICAgICAgICAgICAgICAgIHQuaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICBjaGlsZERldGVjdFpvbmUuc2NoZWR1bGVNaWNyb1Rhc2soXG4gICAgICAgICAgICAgICAgICAgICAgYmxhY2tsaXN0ZWRTdGFja0ZyYW1lc1N5bWJvbCxcbiAgICAgICAgICAgICAgICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBFcnJvcigpO1xuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgICAgICAgICAgICh0OiBUYXNrKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAodCBhcyBhbnkpLl90cmFuc2l0aW9uVG8gPSBmYWtlVHJhbnNpdGlvblRvO1xuICAgICAgICAgICAgICAgICAgICAgICAgdC5pbnZva2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAodCkgPT4ge1xuICAgICAgICAgICAgICAgICAgKHQgYXMgYW55KS5fdHJhbnNpdGlvblRvID0gZmFrZVRyYW5zaXRpb25UbztcbiAgICAgICAgICAgICAgICAgIHQuaW52b2tlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAoKSA9PiB7fSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICB1bmRlZmluZWQsXG4gICAgICAgICAgKHQpID0+IHtcbiAgICAgICAgICAgICh0IGFzIGFueSkuX3RyYW5zaXRpb25UbyA9IGZha2VUcmFuc2l0aW9uVG87XG4gICAgICAgICAgICB0Lmludm9rZSgpO1xuICAgICAgICAgIH0sXG4gICAgICAgICAgKCkgPT4ge30pO1xuICAgIH0pO1xuICB9KTtcblxuICBFcnJvci5zdGFja1RyYWNlTGltaXQgPSBvcmlnaW5hbFN0YWNrVHJhY2VMaW1pdDtcbn0pO1xuIl19