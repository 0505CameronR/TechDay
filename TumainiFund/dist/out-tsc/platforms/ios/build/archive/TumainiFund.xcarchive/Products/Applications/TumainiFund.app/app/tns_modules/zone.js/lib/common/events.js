"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {missingRequire}
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        var options = Object.defineProperty({}, 'passive', {
            get: function () {
                passiveSupported = true;
            }
        });
        window.addEventListener('test', options, options);
        window.removeEventListener('test', options, options);
    }
    catch (err) {
        passiveSupported = false;
    }
}
// an identifier to tell ZoneTask do not create a new invoke closure
var OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
exports.zoneSymbolEventNames = {};
exports.globalSources = {};
var EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
var IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
function patchEventTarget(_global, apis, patchOptions) {
    var ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || utils_1.ADD_EVENT_LISTENER_STR;
    var REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || utils_1.REMOVE_EVENT_LISTENER_STR;
    var LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    var REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    var zoneSymbolAddEventListener = utils_1.zoneSymbol(ADD_EVENT_LISTENER);
    var ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    var PREPEND_EVENT_LISTENER = 'prependListener';
    var PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    var invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        var delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = function (event) { return delegate.handleEvent(event); };
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        var options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            var delegate_1 = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate_1, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    var globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[exports.zoneSymbolEventNames[event.type][utils_1.FALSE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    var globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        var target = this || event.target || _global;
        var tasks = target[exports.zoneSymbolEventNames[event.type][utils_1.TRUE_STR]];
        if (tasks) {
            // invoke all tasks which attached to current target with given event.type and capture = false
            // for performance concern, if task.length === 1, just invoke
            if (tasks.length === 1) {
                invokeTask(tasks[0], target, event);
            }
            else {
                // https://github.com/angular/zone.js/issues/836
                // copy the tasks array before invoke, to avoid
                // the callback will remove itself or other listener
                var copyTasks = tasks.slice();
                for (var i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    function patchEventTargetMethods(obj, patchOptions) {
        if (!obj) {
            return false;
        }
        var useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        var validateHandler = patchOptions && patchOptions.vh;
        var checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        var returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        var proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = utils_1.ObjectGetPrototypeOf(proto);
        }
        if (!proto && obj[ADD_EVENT_LISTENER]) {
            // somehow we did not find it, but we can see it. This happens on IE for Window properties.
            proto = obj;
        }
        if (!proto) {
            return false;
        }
        if (proto[zoneSymbolAddEventListener]) {
            return false;
        }
        var eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        var taskData = {};
        var nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        var nativeRemoveEventListener = proto[utils_1.zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        var nativeListeners = proto[utils_1.zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        var nativeRemoveAllListeners = proto[utils_1.zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        var nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[utils_1.zoneSymbol(patchOptions.prepend)] =
                proto[patchOptions.prepend];
        }
        function checkIsPassive(task) {
            if (!passiveSupported && typeof taskData.options !== 'boolean' &&
                typeof taskData.options !== 'undefined' && taskData.options !== null) {
                // options is a non-null non-undefined object
                // passive is not supported
                // don't pass options as object
                // just pass capture as a boolean
                task.options = !!taskData.options.capture;
                taskData.options = task.options;
            }
        }
        var customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        var customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                var symbolEventNames = exports.zoneSymbolEventNames[task.eventName];
                var symbolEventName = void 0;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? utils_1.TRUE_STR : utils_1.FALSE_STR];
                }
                var existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (var i = 0; i < existingTasks.length; i++) {
                        var existingTask = existingTasks[i];
                        if (existingTask === task) {
                            existingTasks.splice(i, 1);
                            // set isRemoved to data for faster invokeTask check
                            task.isRemoved = true;
                            if (existingTasks.length === 0) {
                                // all tasks for the eventName + capture have gone,
                                // remove globalZoneAwareCallback and remove the task cache from target
                                task.allRemoved = true;
                                task.target[symbolEventName] = null;
                            }
                            break;
                        }
                    }
                }
            }
            // if all tasks for the eventName + capture have gone,
            // we will really remove the global event callback,
            // if not, return
            if (!task.allRemoved) {
                return;
            }
            return nativeRemoveEventListener.call(task.target, task.eventName, task.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, task.options);
        };
        var customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        var customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        var customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        var customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        var compareTaskCallbackVsDelegate = function (task, delegate) {
            var typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        var compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        var blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        var makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget, prepend) {
            if (returnTarget === void 0) { returnTarget = false; }
            if (prepend === void 0) { prepend = false; }
            return function () {
                var target = this || _global;
                var eventName = arguments[0];
                var delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (utils_1.isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                var isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                var options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (var i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                var capture;
                var once = false;
                if (options === undefined) {
                    capture = false;
                }
                else if (options === true) {
                    capture = true;
                }
                else if (options === false) {
                    capture = false;
                }
                else {
                    capture = options ? !!options.capture : false;
                    once = options ? !!options.once : false;
                }
                var zone = Zone.current;
                var symbolEventNames = exports.zoneSymbolEventNames[eventName];
                var symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    var falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + utils_1.FALSE_STR;
                    var trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + utils_1.TRUE_STR;
                    var symbol = utils_1.ZONE_SYMBOL_PREFIX + falseEventName;
                    var symbolCapture = utils_1.ZONE_SYMBOL_PREFIX + trueEventName;
                    exports.zoneSymbolEventNames[eventName] = {};
                    exports.zoneSymbolEventNames[eventName][utils_1.FALSE_STR] = symbol;
                    exports.zoneSymbolEventNames[eventName][utils_1.TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? utils_1.TRUE_STR : utils_1.FALSE_STR];
                }
                var existingTasks = target[symbolEventName];
                var isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (var i = 0; i < existingTasks.length; i++) {
                            if (compare(existingTasks[i], delegate)) {
                                // same callback, same capture, same event name, just return
                                return;
                            }
                        }
                    }
                }
                else {
                    existingTasks = target[symbolEventName] = [];
                }
                var source;
                var constructorName = target.constructor['name'];
                var targetSource = exports.globalSources[constructorName];
                if (targetSource) {
                    source = targetSource[eventName];
                }
                if (!source) {
                    source = constructorName + addSource +
                        (eventNameToString ? eventNameToString(eventName) : eventName);
                }
                // do not create a new object as task.data to pass those things
                // just use the global shared one
                taskData.options = options;
                if (once) {
                    // if addEventListener with once options, we don't pass it to
                    // native addEventListener, instead we keep the once setting
                    // and handle ourselves.
                    taskData.options.once = false;
                }
                taskData.target = target;
                taskData.capture = capture;
                taskData.eventName = eventName;
                taskData.isExisting = isExisting;
                var data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                var task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
                // should clear taskData.target to avoid memory leak
                // issue, https://github.com/angular/angular/issues/20442
                taskData.target = null;
                // need to clear up taskData because it is a global object
                if (data) {
                    data.taskData = null;
                }
                // have to save those information to task in case
                // application may call task.zone.cancelTask() directly
                if (once) {
                    options.once = true;
                }
                if (!(!passiveSupported && typeof task.options === 'boolean')) {
                    // if not support passive, and we pass an option object
                    // to addEventListener, we should save the options to task
                    task.options = options;
                }
                task.target = target;
                task.capture = capture;
                task.eventName = eventName;
                if (isHandleEvent) {
                    // save original delegate for compare to check duplicate
                    task.originalDelegate = delegate;
                }
                if (!prepend) {
                    existingTasks.push(task);
                }
                else {
                    existingTasks.unshift(task);
                }
                if (returnTarget) {
                    return target;
                }
            };
        };
        proto[ADD_EVENT_LISTENER] = makeAddListener(nativeAddEventListener, ADD_EVENT_LISTENER_SOURCE, customSchedule, customCancel, returnTarget);
        if (nativePrependEventListener) {
            proto[PREPEND_EVENT_LISTENER] = makeAddListener(nativePrependEventListener, PREPEND_EVENT_LISTENER_SOURCE, customSchedulePrepend, customCancel, returnTarget, true);
        }
        proto[REMOVE_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var options = arguments[2];
            var capture;
            if (options === undefined) {
                capture = false;
            }
            else if (options === true) {
                capture = true;
            }
            else if (options === false) {
                capture = false;
            }
            else {
                capture = options ? !!options.capture : false;
            }
            var delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            var symbolEventNames = exports.zoneSymbolEventNames[eventName];
            var symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? utils_1.TRUE_STR : utils_1.FALSE_STR];
            }
            var existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (var i = 0; i < existingTasks.length; i++) {
                    var existingTask = existingTasks[i];
                    if (compare(existingTask, delegate)) {
                        existingTasks.splice(i, 1);
                        // set isRemoved to data for faster invokeTask check
                        existingTask.isRemoved = true;
                        if (existingTasks.length === 0) {
                            // all tasks for the eventName + capture have gone,
                            // remove globalZoneAwareCallback and remove the task cache from target
                            existingTask.allRemoved = true;
                            target[symbolEventName] = null;
                        }
                        existingTask.zone.cancelTask(existingTask);
                        if (returnTarget) {
                            return target;
                        }
                        return;
                    }
                }
            }
            // issue 930, didn't find the event name or callback
            // from zone kept existingTasks, the callback maybe
            // added outside of zone, we need to call native removeEventListener
            // to try to remove it.
            return nativeRemoveEventListener.apply(this, arguments);
        };
        proto[LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            var listeners = [];
            var tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (var i = 0; i < tasks.length; i++) {
                var task = tasks[i];
                var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            var target = this || _global;
            var eventName = arguments[0];
            if (!eventName) {
                var keys = Object.keys(target);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    var evtName = match && match[1];
                    // in nodejs EventEmitter, removeListener event is
                    // used for monitoring the removeListener call,
                    // so just keep removeListener eventListener until
                    // all other eventListeners are removed
                    if (evtName && evtName !== 'removeListener') {
                        this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, evtName);
                    }
                }
                // remove removeListener listener finally
                this[REMOVE_ALL_LISTENERS_EVENT_LISTENER].call(this, 'removeListener');
            }
            else {
                var symbolEventNames = exports.zoneSymbolEventNames[eventName];
                if (symbolEventNames) {
                    var symbolEventName = symbolEventNames[utils_1.FALSE_STR];
                    var symbolCaptureEventName = symbolEventNames[utils_1.TRUE_STR];
                    var tasks = target[symbolEventName];
                    var captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        var removeTasks = tasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        var removeTasks = captureTasks.slice();
                        for (var i = 0; i < removeTasks.length; i++) {
                            var task = removeTasks[i];
                            var delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                }
            }
            if (returnTarget) {
                return this;
            }
        };
        // for native toString patch
        utils_1.attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        utils_1.attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            utils_1.attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            utils_1.attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    var results = [];
    for (var i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
exports.patchEventTarget = patchEventTarget;
function findEventTasks(target, eventName) {
    var foundTasks = [];
    for (var prop in target) {
        var match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        var evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            var tasks = target[prop];
            if (tasks) {
                for (var i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
exports.findEventTasks = findEventTasks;
function patchEventPrototype(global, api) {
    var Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', function (delegate) { return function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        }; });
    }
}
exports.patchEventPrototype = patchEventPrototype;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vZXZlbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSDs7O0dBR0c7O0FBRUgsaUNBQW9MO0FBUXBMLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRTdCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO0lBQ2pDLElBQUk7UUFDRixJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUU7WUFDbkQsR0FBRyxFQUFFO2dCQUNILGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUMxQixDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLGdCQUFnQixHQUFHLEtBQUssQ0FBQztLQUMxQjtDQUNGO0FBRUQsb0VBQW9FO0FBQ3BFLElBQU0sOEJBQThCLEdBQWtCO0lBQ3BELElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUVXLFFBQUEsb0JBQW9CLEdBQVEsRUFBRSxDQUFDO0FBQy9CLFFBQUEsYUFBYSxHQUFRLEVBQUUsQ0FBQztBQUVyQyxJQUFNLHNCQUFzQixHQUFHLG9DQUFvQyxDQUFDO0FBQ3BFLElBQU0sNEJBQTRCLEdBQUcsQ0FBQyxtQ0FB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b29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuXG5pbXBvcnQge0FERF9FVkVOVF9MSVNURU5FUl9TVFIsIGF0dGFjaE9yaWdpblRvUGF0Y2hlZCwgRkFMU0VfU1RSLCBpc05vZGUsIE9iamVjdEdldFByb3RvdHlwZU9mLCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSLCBUUlVFX1NUUiwgWk9ORV9TWU1CT0xfUFJFRklYLCB6b25lU3ltYm9sfSBmcm9tICcuL3V0aWxzJztcblxuLyoqIEBpbnRlcm5hbCAqKi9cbmludGVyZmFjZSBFdmVudFRhc2tEYXRhIGV4dGVuZHMgVGFza0RhdGEge1xuICAvLyB1c2UgZ2xvYmFsIGNhbGxiYWNrIG9yIG5vdFxuICByZWFkb25seSB1c2VHPzogYm9vbGVhbjtcbn1cblxubGV0IHBhc3NpdmVTdXBwb3J0ZWQgPSBmYWxzZTtcblxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnKSB7XG4gIHRyeSB7XG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh7fSwgJ3Bhc3NpdmUnLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBwYXNzaXZlU3VwcG9ydGVkID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBvcHRpb25zLCBvcHRpb25zKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuICB9XG59XG5cbi8vIGFuIGlkZW50aWZpZXIgdG8gdGVsbCBab25lVGFzayBkbyBub3QgY3JlYXRlIGEgbmV3IGludm9rZSBjbG9zdXJlXG5jb25zdCBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEE6IEV2ZW50VGFza0RhdGEgPSB7XG4gIHVzZUc6IHRydWVcbn07XG5cbmV4cG9ydCBjb25zdCB6b25lU3ltYm9sRXZlbnROYW1lczogYW55ID0ge307XG5leHBvcnQgY29uc3QgZ2xvYmFsU291cmNlczogYW55ID0ge307XG5cbmNvbnN0IEVWRU5UX05BTUVfU1lNQk9MX1JFR1ggPSAvXl9fem9uZV9zeW1ib2xfXyhcXHcrKSh0cnVlfGZhbHNlKSQvO1xuY29uc3QgSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTCA9ICgnX196b25lX3N5bWJvbF9fcHJvcGFnYXRpb25TdG9wcGVkJyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUGF0Y2hFdmVudFRhcmdldE9wdGlvbnMge1xuICAvLyB2YWxpZGF0ZUhhbmRsZXJcbiAgdmg/OiAobmF0aXZlRGVsZWdhdGU6IGFueSwgZGVsZWdhdGU6IGFueSwgdGFyZ2V0OiBhbnksIGFyZ3M6IGFueSkgPT4gYm9vbGVhbjtcbiAgLy8gYWRkRXZlbnRMaXN0ZW5lciBmdW5jdGlvbiBuYW1lXG4gIGFkZD86IHN0cmluZztcbiAgLy8gcmVtb3ZlRXZlbnRMaXN0ZW5lciBmdW5jdGlvbiBuYW1lXG4gIHJtPzogc3RyaW5nO1xuICAvLyBwcmVwZW5kRXZlbnRMaXN0ZW5lciBmdW5jdGlvbiBuYW1lXG4gIHByZXBlbmQ/OiBzdHJpbmc7XG4gIC8vIGxpc3RlbmVycyBmdW5jdGlvbiBuYW1lXG4gIGxpc3RlbmVycz86IHN0cmluZztcbiAgLy8gcmVtb3ZlQWxsTGlzdGVuZXJzIGZ1bmN0aW9uIG5hbWVcbiAgcm1BbGw/OiBzdHJpbmc7XG4gIC8vIHVzZUdsb2JhbENhbGxiYWNrIGZsYWdcbiAgdXNlRz86IGJvb2xlYW47XG4gIC8vIGNoZWNrIGR1cGxpY2F0ZSBmbGFnIHdoZW4gYWRkRXZlbnRMaXN0ZW5lclxuICBjaGtEdXA/OiBib29sZWFuO1xuICAvLyByZXR1cm4gdGFyZ2V0IGZsYWcgd2hlbiBhZGRFdmVudExpc3RlbmVyXG4gIHJ0PzogYm9vbGVhbjtcbiAgLy8gZXZlbnQgY29tcGFyZSBoYW5kbGVyXG4gIGRpZmY/OiAodGFzazogYW55LCBkZWxlZ2F0ZTogYW55KSA9PiBib29sZWFuO1xuICAvLyBzdXBwb3J0IHBhc3NpdmUgb3Igbm90XG4gIHN1cHBvcnRQYXNzaXZlPzogYm9vbGVhbjtcbiAgLy8gZ2V0IHN0cmluZyBmcm9tIGV2ZW50TmFtZSAoaW4gbm9kZWpzLCBldmVudE5hbWUgbWF5YmUgU3ltYm9sKVxuICBldmVudE5hbWVUb1N0cmluZz86IChldmVudE5hbWU6IGFueSkgPT4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hFdmVudFRhcmdldChcbiAgICBfZ2xvYmFsOiBhbnksIGFwaXM6IGFueVtdLCBwYXRjaE9wdGlvbnM/OiBQYXRjaEV2ZW50VGFyZ2V0T3B0aW9ucykge1xuICBjb25zdCBBRERfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5hZGQpIHx8IEFERF9FVkVOVF9MSVNURU5FUl9TVFI7XG4gIGNvbnN0IFJFTU9WRV9FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtKSB8fCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSO1xuXG4gIGNvbnN0IExJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmxpc3RlbmVycykgfHwgJ2V2ZW50TGlzdGVuZXJzJztcbiAgY29uc3QgUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVIgPVxuICAgICAgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucm1BbGwpIHx8ICdyZW1vdmVBbGxMaXN0ZW5lcnMnO1xuXG4gIGNvbnN0IHpvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyID0gem9uZVN5bWJvbChBRERfRVZFTlRfTElTVEVORVIpO1xuXG4gIGNvbnN0IEFERF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UgPSAnLicgKyBBRERfRVZFTlRfTElTVEVORVIgKyAnOic7XG5cbiAgY29uc3QgUFJFUEVORF9FVkVOVF9MSVNURU5FUiA9ICdwcmVwZW5kTGlzdGVuZXInO1xuICBjb25zdCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSA9ICcuJyArIFBSRVBFTkRfRVZFTlRfTElTVEVORVIgKyAnOic7XG5cbiAgY29uc3QgaW52b2tlVGFzayA9IGZ1bmN0aW9uKHRhc2s6IGFueSwgdGFyZ2V0OiBhbnksIGV2ZW50OiBFdmVudCkge1xuICAgIC8vIGZvciBiZXR0ZXIgcGVyZm9ybWFuY2UsIGNoZWNrIGlzUmVtb3ZlZCB3aGljaCBpcyBzZXRcbiAgICAvLyBieSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgaWYgKHRhc2suaXNSZW1vdmVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IGRlbGVnYXRlID0gdGFzay5jYWxsYmFjaztcbiAgICBpZiAodHlwZW9mIGRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiBkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgLy8gY3JlYXRlIHRoZSBiaW5kIHZlcnNpb24gb2YgaGFuZGxlRXZlbnQgd2hlbiBpbnZva2VcbiAgICAgIHRhc2suY2FsbGJhY2sgPSAoZXZlbnQ6IEV2ZW50KSA9PiBkZWxlZ2F0ZS5oYW5kbGVFdmVudChldmVudCk7XG4gICAgICB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICB9XG4gICAgLy8gaW52b2tlIHN0YXRpYyB0YXNrLmludm9rZVxuICAgIHRhc2suaW52b2tlKHRhc2ssIHRhcmdldCwgW2V2ZW50XSk7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHRhc2sub3B0aW9ucztcbiAgICBpZiAob3B0aW9ucyAmJiB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgJiYgb3B0aW9ucy5vbmNlKSB7XG4gICAgICAvLyBpZiBvcHRpb25zLm9uY2UgaXMgdHJ1ZSwgYWZ0ZXIgaW52b2tlIG9uY2UgcmVtb3ZlIGxpc3RlbmVyIGhlcmVcbiAgICAgIC8vIG9ubHkgYnJvd3NlciBuZWVkIHRvIGRvIHRoaXMsIG5vZGVqcyBldmVudEVtaXR0ZXIgd2lsbCBjYWwgcmVtb3ZlTGlzdGVuZXJcbiAgICAgIC8vIGluc2lkZSBFdmVudEVtaXR0ZXIub25jZVxuICAgICAgY29uc3QgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgdGFyZ2V0W1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0YXJnZXQsIGV2ZW50LnR5cGUsIGRlbGVnYXRlLCBvcHRpb25zKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gZ2xvYmFsIHNoYXJlZCB6b25lQXdhcmVDYWxsYmFjayB0byBoYW5kbGUgYWxsIGV2ZW50IGNhbGxiYWNrIHdpdGggY2FwdHVyZSA9IGZhbHNlXG4gIGNvbnN0IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrID0gZnVuY3Rpb24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGV2ZW50LnRhcmdldCBpcyBuZWVkZWQgZm9yIFNhbXN1bmcgVFYgYW5kIFNvdXJjZUJ1ZmZlclxuICAgIC8vIHx8IGdsb2JhbCBpcyBuZWVkZWQgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvMTkwXG4gICAgY29uc3QgdGFyZ2V0OiBhbnkgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3pvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdW0ZBTFNFX1NUUl1dO1xuICAgIGlmICh0YXNrcykge1xuICAgICAgLy8gaW52b2tlIGFsbCB0YXNrcyB3aGljaCBhdHRhY2hlZCB0byBjdXJyZW50IHRhcmdldCB3aXRoIGdpdmVuIGV2ZW50LnR5cGUgYW5kIGNhcHR1cmUgPSBmYWxzZVxuICAgICAgLy8gZm9yIHBlcmZvcm1hbmNlIGNvbmNlcm4sIGlmIHRhc2subGVuZ3RoID09PSAxLCBqdXN0IGludm9rZVxuICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpbnZva2VUYXNrKHRhc2tzWzBdLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzgzNlxuICAgICAgICAvLyBjb3B5IHRoZSB0YXNrcyBhcnJheSBiZWZvcmUgaW52b2tlLCB0byBhdm9pZFxuICAgICAgICAvLyB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIG9yIG90aGVyIGxpc3RlbmVyXG4gICAgICAgIGNvbnN0IGNvcHlUYXNrcyA9IHRhc2tzLnNsaWNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29weVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGV2ZW50ICYmIChldmVudCBhcyBhbnkpW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID09PSB0cnVlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaW52b2tlVGFzayhjb3B5VGFza3NbaV0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIC8vIGdsb2JhbCBzaGFyZWQgem9uZUF3YXJlQ2FsbGJhY2sgdG8gaGFuZGxlIGFsbCBldmVudCBjYWxsYmFjayB3aXRoIGNhcHR1cmUgPSB0cnVlXG4gIGNvbnN0IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzkxMSwgaW4gSUUsIHNvbWV0aW1lc1xuICAgIC8vIGV2ZW50IHdpbGwgYmUgdW5kZWZpbmVkLCBzbyB3ZSBuZWVkIHRvIHVzZSB3aW5kb3cuZXZlbnRcbiAgICBldmVudCA9IGV2ZW50IHx8IF9nbG9iYWwuZXZlbnQ7XG4gICAgaWYgKCFldmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBldmVudC50YXJnZXQgaXMgbmVlZGVkIGZvciBTYW1zdW5nIFRWIGFuZCBTb3VyY2VCdWZmZXJcbiAgICAvLyB8fCBnbG9iYWwgaXMgbmVlZGVkIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzE5MFxuICAgIGNvbnN0IHRhcmdldDogYW55ID0gdGhpcyB8fCBldmVudC50YXJnZXQgfHwgX2dsb2JhbDtcbiAgICBjb25zdCB0YXNrcyA9IHRhcmdldFt6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudC50eXBlXVtUUlVFX1NUUl1dO1xuICAgIGlmICh0YXNrcykge1xuICAgICAgLy8gaW52b2tlIGFsbCB0YXNrcyB3aGljaCBhdHRhY2hlZCB0byBjdXJyZW50IHRhcmdldCB3aXRoIGdpdmVuIGV2ZW50LnR5cGUgYW5kIGNhcHR1cmUgPSBmYWxzZVxuICAgICAgLy8gZm9yIHBlcmZvcm1hbmNlIGNvbmNlcm4sIGlmIHRhc2subGVuZ3RoID09PSAxLCBqdXN0IGludm9rZVxuICAgICAgaWYgKHRhc2tzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICBpbnZva2VUYXNrKHRhc2tzWzBdLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzgzNlxuICAgICAgICAvLyBjb3B5IHRoZSB0YXNrcyBhcnJheSBiZWZvcmUgaW52b2tlLCB0byBhdm9pZFxuICAgICAgICAvLyB0aGUgY2FsbGJhY2sgd2lsbCByZW1vdmUgaXRzZWxmIG9yIG90aGVyIGxpc3RlbmVyXG4gICAgICAgIGNvbnN0IGNvcHlUYXNrcyA9IHRhc2tzLnNsaWNlKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY29weVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKGV2ZW50ICYmIChldmVudCBhcyBhbnkpW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID09PSB0cnVlKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgICAgaW52b2tlVGFzayhjb3B5VGFza3NbaV0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9O1xuXG4gIGZ1bmN0aW9uIHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKG9iajogYW55LCBwYXRjaE9wdGlvbnM/OiBQYXRjaEV2ZW50VGFyZ2V0T3B0aW9ucykge1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgbGV0IHVzZUdsb2JhbENhbGxiYWNrID0gdHJ1ZTtcbiAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy51c2VHICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHVzZUdsb2JhbENhbGxiYWNrID0gcGF0Y2hPcHRpb25zLnVzZUc7XG4gICAgfVxuICAgIGNvbnN0IHZhbGlkYXRlSGFuZGxlciA9IHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudmg7XG5cbiAgICBsZXQgY2hlY2tEdXBsaWNhdGUgPSB0cnVlO1xuICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmNoa0R1cCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjaGVja0R1cGxpY2F0ZSA9IHBhdGNoT3B0aW9ucy5jaGtEdXA7XG4gICAgfVxuXG4gICAgbGV0IHJldHVyblRhcmdldCA9IGZhbHNlO1xuICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJ0ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVyblRhcmdldCA9IHBhdGNoT3B0aW9ucy5ydDtcbiAgICB9XG5cbiAgICBsZXQgcHJvdG8gPSBvYmo7XG4gICAgd2hpbGUgKHByb3RvICYmICFwcm90by5oYXNPd25Qcm9wZXJ0eShBRERfRVZFTlRfTElTVEVORVIpKSB7XG4gICAgICBwcm90byA9IE9iamVjdEdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgICB9XG4gICAgaWYgKCFwcm90byAmJiBvYmpbQUREX0VWRU5UX0xJU1RFTkVSXSkge1xuICAgICAgLy8gc29tZWhvdyB3ZSBkaWQgbm90IGZpbmQgaXQsIGJ1dCB3ZSBjYW4gc2VlIGl0LiBUaGlzIGhhcHBlbnMgb24gSUUgZm9yIFdpbmRvdyBwcm9wZXJ0aWVzLlxuICAgICAgcHJvdG8gPSBvYmo7XG4gICAgfVxuXG4gICAgaWYgKCFwcm90bykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBpZiAocHJvdG9bem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXJdKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3QgZXZlbnROYW1lVG9TdHJpbmcgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmV2ZW50TmFtZVRvU3RyaW5nO1xuXG4gICAgLy8gYSBzaGFyZWQgZ2xvYmFsIHRhc2tEYXRhIHRvIHBhc3MgZGF0YSBmb3Igc2NoZWR1bGVFdmVudFRhc2tcbiAgICAvLyBzbyB3ZSBkbyBub3QgbmVlZCB0byBjcmVhdGUgYSBuZXcgb2JqZWN0IGp1c3QgZm9yIHBhc3Mgc29tZSBkYXRhXG4gICAgY29uc3QgdGFza0RhdGE6IGFueSA9IHt9O1xuXG4gICAgY29uc3QgbmF0aXZlQWRkRXZlbnRMaXN0ZW5lciA9IHByb3RvW3pvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyXSA9IHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl07XG4gICAgY29uc3QgbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lciA9IHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICBwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdO1xuXG4gICAgY29uc3QgbmF0aXZlTGlzdGVuZXJzID0gcHJvdG9bem9uZVN5bWJvbChMSVNURU5FUlNfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl07XG4gICAgY29uc3QgbmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzID0gcHJvdG9bem9uZVN5bWJvbChSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgcHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdO1xuXG4gICAgbGV0IG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyOiBhbnk7XG4gICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucHJlcGVuZCkge1xuICAgICAgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sKHBhdGNoT3B0aW9ucy5wcmVwZW5kKV0gPVxuICAgICAgICAgIHByb3RvW3BhdGNoT3B0aW9ucy5wcmVwZW5kXTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGVja0lzUGFzc2l2ZSh0YXNrOiBUYXNrKSB7XG4gICAgICBpZiAoIXBhc3NpdmVTdXBwb3J0ZWQgJiYgdHlwZW9mIHRhc2tEYXRhLm9wdGlvbnMgIT09ICdib29sZWFuJyAmJlxuICAgICAgICAgIHR5cGVvZiB0YXNrRGF0YS5vcHRpb25zICE9PSAndW5kZWZpbmVkJyAmJiB0YXNrRGF0YS5vcHRpb25zICE9PSBudWxsKSB7XG4gICAgICAgIC8vIG9wdGlvbnMgaXMgYSBub24tbnVsbCBub24tdW5kZWZpbmVkIG9iamVjdFxuICAgICAgICAvLyBwYXNzaXZlIGlzIG5vdCBzdXBwb3J0ZWRcbiAgICAgICAgLy8gZG9uJ3QgcGFzcyBvcHRpb25zIGFzIG9iamVjdFxuICAgICAgICAvLyBqdXN0IHBhc3MgY2FwdHVyZSBhcyBhIGJvb2xlYW5cbiAgICAgICAgKHRhc2sgYXMgYW55KS5vcHRpb25zID0gISF0YXNrRGF0YS5vcHRpb25zLmNhcHR1cmU7XG4gICAgICAgIHRhc2tEYXRhLm9wdGlvbnMgPSAodGFzayBhcyBhbnkpLm9wdGlvbnM7XG4gICAgICB9XG4gICAgfVxuXG4gICAgY29uc3QgY3VzdG9tU2NoZWR1bGVHbG9iYWwgPSBmdW5jdGlvbih0YXNrOiBUYXNrKSB7XG4gICAgICAvLyBpZiB0aGVyZSBpcyBhbHJlYWR5IGEgdGFzayBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUsXG4gICAgICAvLyBqdXN0IHJldHVybiwgYmVjYXVzZSB3ZSB1c2UgdGhlIHNoYXJlZCBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBoZXJlLlxuICAgICAgaWYgKHRhc2tEYXRhLmlzRXhpc3RpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgY2hlY2tJc1Bhc3NpdmUodGFzayk7XG4gICAgICByZXR1cm4gbmF0aXZlQWRkRXZlbnRMaXN0ZW5lci5jYWxsKFxuICAgICAgICAgIHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLFxuICAgICAgICAgIHRhc2tEYXRhLmNhcHR1cmUgPyBnbG9iYWxab25lQXdhcmVDYXB0dXJlQ2FsbGJhY2sgOiBnbG9iYWxab25lQXdhcmVDYWxsYmFjayxcbiAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3VzdG9tQ2FuY2VsR2xvYmFsID0gZnVuY3Rpb24odGFzazogYW55KSB7XG4gICAgICAvLyBpZiB0YXNrIGlzIG5vdCBtYXJrZWQgYXMgaXNSZW1vdmVkLCB0aGlzIGNhbGwgaXMgZGlyZWN0bHlcbiAgICAgIC8vIGZyb20gWm9uZS5wcm90b3R5cGUuY2FuY2VsVGFzaywgd2Ugc2hvdWxkIHJlbW92ZSB0aGUgdGFza1xuICAgICAgLy8gZnJvbSB0YXNrc0xpc3Qgb2YgdGFyZ2V0IGZpcnN0XG4gICAgICBpZiAoIXRhc2suaXNSZW1vdmVkKSB7XG4gICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1t0YXNrLmV2ZW50TmFtZV07XG4gICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1t0YXNrLmNhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrcyA9IHN5bWJvbEV2ZW50TmFtZSAmJiB0YXNrLnRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrID0gZXhpc3RpbmdUYXNrc1tpXTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2sgPT09IHRhc2spIHtcbiAgICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgIC8vIHNldCBpc1JlbW92ZWQgdG8gZGF0YSBmb3IgZmFzdGVyIGludm9rZVRhc2sgY2hlY2tcbiAgICAgICAgICAgICAgdGFzay5pc1JlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgYW5kIHJlbW92ZSB0aGUgdGFzayBjYWNoZSBmcm9tIHRhcmdldFxuICAgICAgICAgICAgICAgIHRhc2suYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGFzay50YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpZiBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgIC8vIHdlIHdpbGwgcmVhbGx5IHJlbW92ZSB0aGUgZ2xvYmFsIGV2ZW50IGNhbGxiYWNrLFxuICAgICAgLy8gaWYgbm90LCByZXR1cm5cbiAgICAgIGlmICghdGFzay5hbGxSZW1vdmVkKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLmNhbGwoXG4gICAgICAgICAgdGFzay50YXJnZXQsIHRhc2suZXZlbnROYW1lLFxuICAgICAgICAgIHRhc2suY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLCB0YXNrLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjdXN0b21TY2hlZHVsZU5vbkdsb2JhbCA9IGZ1bmN0aW9uKHRhc2s6IFRhc2spIHtcbiAgICAgIGNoZWNrSXNQYXNzaXZlKHRhc2spO1xuICAgICAgcmV0dXJuIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIuY2FsbChcbiAgICAgICAgICB0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2tEYXRhLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjdXN0b21TY2hlZHVsZVByZXBlbmQgPSBmdW5jdGlvbih0YXNrOiBUYXNrKSB7XG4gICAgICByZXR1cm4gbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIuY2FsbChcbiAgICAgICAgICB0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2tEYXRhLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjdXN0b21DYW5jZWxOb25HbG9iYWwgPSBmdW5jdGlvbih0YXNrOiBhbnkpIHtcbiAgICAgIHJldHVybiBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLmNhbGwodGFzay50YXJnZXQsIHRhc2suZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFzay5vcHRpb25zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3VzdG9tU2NoZWR1bGUgPSB1c2VHbG9iYWxDYWxsYmFjayA/IGN1c3RvbVNjaGVkdWxlR2xvYmFsIDogY3VzdG9tU2NoZWR1bGVOb25HbG9iYWw7XG4gICAgY29uc3QgY3VzdG9tQ2FuY2VsID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21DYW5jZWxHbG9iYWwgOiBjdXN0b21DYW5jZWxOb25HbG9iYWw7XG5cbiAgICBjb25zdCBjb21wYXJlVGFza0NhbGxiYWNrVnNEZWxlZ2F0ZSA9IGZ1bmN0aW9uKHRhc2s6IGFueSwgZGVsZWdhdGU6IGFueSkge1xuICAgICAgY29uc3QgdHlwZU9mRGVsZWdhdGUgPSB0eXBlb2YgZGVsZWdhdGU7XG4gICAgICByZXR1cm4gKHR5cGVPZkRlbGVnYXRlID09PSAnZnVuY3Rpb24nICYmIHRhc2suY2FsbGJhY2sgPT09IGRlbGVnYXRlKSB8fFxuICAgICAgICAgICh0eXBlT2ZEZWxlZ2F0ZSA9PT0gJ29iamVjdCcgJiYgdGFzay5vcmlnaW5hbERlbGVnYXRlID09PSBkZWxlZ2F0ZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGNvbXBhcmUgPVxuICAgICAgICAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5kaWZmKSA/IHBhdGNoT3B0aW9ucy5kaWZmIDogY29tcGFyZVRhc2tDYWxsYmFja1ZzRGVsZWdhdGU7XG5cbiAgICBjb25zdCBibGFja0xpc3RlZEV2ZW50czogc3RyaW5nW10gPSAoWm9uZSBhcyBhbnkpW1pvbmUuX19zeW1ib2xfXygnQkxBQ0tfTElTVEVEX0VWRU5UUycpXTtcblxuICAgIGNvbnN0IG1ha2VBZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKFxuICAgICAgICBuYXRpdmVMaXN0ZW5lcjogYW55LCBhZGRTb3VyY2U6IHN0cmluZywgY3VzdG9tU2NoZWR1bGVGbjogYW55LCBjdXN0b21DYW5jZWxGbjogYW55LFxuICAgICAgICByZXR1cm5UYXJnZXQgPSBmYWxzZSwgcHJlcGVuZCA9IGZhbHNlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgICAgY29uc3QgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgICBsZXQgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICAgIGlmICghZGVsZWdhdGUpIHtcbiAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoaXNOb2RlICYmIGV2ZW50TmFtZSA9PT0gJ3VuY2F1Z2h0RXhjZXB0aW9uJykge1xuICAgICAgICAgIC8vIGRvbid0IHBhdGNoIHVuY2F1Z2h0RXhjZXB0aW9uIG9mIG5vZGVqcyB0byBwcmV2ZW50IGVuZGxlc3MgbG9vcFxuICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZG9uJ3QgY3JlYXRlIHRoZSBiaW5kIGRlbGVnYXRlIGZ1bmN0aW9uIGZvciBoYW5kbGVFdmVudFxuICAgICAgICAvLyBjYXNlIGhlcmUgdG8gaW1wcm92ZSBhZGRFdmVudExpc3RlbmVyIHBlcmZvcm1hbmNlXG4gICAgICAgIC8vIHdlIHdpbGwgY3JlYXRlIHRoZSBiaW5kIGRlbGVnYXRlIHdoZW4gaW52b2tlXG4gICAgICAgIGxldCBpc0hhbmRsZUV2ZW50ID0gZmFsc2U7XG4gICAgICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoIWRlbGVnYXRlLmhhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaXNIYW5kbGVFdmVudCA9IHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodmFsaWRhdGVIYW5kbGVyICYmICF2YWxpZGF0ZUhhbmRsZXIobmF0aXZlTGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBvcHRpb25zID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICAgIGlmIChibGFja0xpc3RlZEV2ZW50cykge1xuICAgICAgICAgIC8vIGNoZWNrIGJsYWNrIGxpc3RcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGJsYWNrTGlzdGVkRXZlbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lID09PSBibGFja0xpc3RlZEV2ZW50c1tpXSkge1xuICAgICAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FwdHVyZTtcbiAgICAgICAgbGV0IG9uY2UgPSBmYWxzZTtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSB0cnVlKSB7XG4gICAgICAgICAgY2FwdHVyZSA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICBjYXB0dXJlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY2FwdHVyZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuY2FwdHVyZSA6IGZhbHNlO1xuICAgICAgICAgIG9uY2UgPSBvcHRpb25zID8gISFvcHRpb25zLm9uY2UgOiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHpvbmUgPSBab25lLmN1cnJlbnQ7XG4gICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICBsZXQgc3ltYm9sRXZlbnROYW1lO1xuICAgICAgICBpZiAoIXN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICAvLyB0aGUgY29kZSBpcyBkdXBsaWNhdGUsIGJ1dCBJIGp1c3Qgd2FudCB0byBnZXQgc29tZSBiZXR0ZXIgcGVyZm9ybWFuY2VcbiAgICAgICAgICBjb25zdCBmYWxzZUV2ZW50TmFtZSA9XG4gICAgICAgICAgICAgIChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpICsgRkFMU0VfU1RSO1xuICAgICAgICAgIGNvbnN0IHRydWVFdmVudE5hbWUgPVxuICAgICAgICAgICAgICAoZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKSArIFRSVUVfU1RSO1xuICAgICAgICAgIGNvbnN0IHN5bWJvbCA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIGZhbHNlRXZlbnROYW1lO1xuICAgICAgICAgIGNvbnN0IHN5bWJvbENhcHR1cmUgPSBaT05FX1NZTUJPTF9QUkVGSVggKyB0cnVlRXZlbnROYW1lO1xuICAgICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV0gPSB7fTtcbiAgICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW0ZBTFNFX1NUUl0gPSBzeW1ib2w7XG4gICAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtUUlVFX1NUUl0gPSBzeW1ib2xDYXB0dXJlO1xuICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IGNhcHR1cmUgPyBzeW1ib2xDYXB0dXJlIDogc3ltYm9sO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgZXhpc3RpbmdUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgICBsZXQgaXNFeGlzdGluZyA9IGZhbHNlO1xuICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICAgIC8vIGFscmVhZHkgaGF2ZSB0YXNrIHJlZ2lzdGVyZWRcbiAgICAgICAgICBpc0V4aXN0aW5nID0gdHJ1ZTtcbiAgICAgICAgICBpZiAoY2hlY2tEdXBsaWNhdGUpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBpZiAoY29tcGFyZShleGlzdGluZ1Rhc2tzW2ldLCBkZWxlZ2F0ZSkpIHtcbiAgICAgICAgICAgICAgICAvLyBzYW1lIGNhbGxiYWNrLCBzYW1lIGNhcHR1cmUsIHNhbWUgZXZlbnQgbmFtZSwganVzdCByZXR1cm5cbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpc3RpbmdUYXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gW107XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNvdXJjZTtcbiAgICAgICAgY29uc3QgY29uc3RydWN0b3JOYW1lID0gdGFyZ2V0LmNvbnN0cnVjdG9yWyduYW1lJ107XG4gICAgICAgIGNvbnN0IHRhcmdldFNvdXJjZSA9IGdsb2JhbFNvdXJjZXNbY29uc3RydWN0b3JOYW1lXTtcbiAgICAgICAgaWYgKHRhcmdldFNvdXJjZSkge1xuICAgICAgICAgIHNvdXJjZSA9IHRhcmdldFNvdXJjZVtldmVudE5hbWVdO1xuICAgICAgICB9XG4gICAgICAgIGlmICghc291cmNlKSB7XG4gICAgICAgICAgc291cmNlID0gY29uc3RydWN0b3JOYW1lICsgYWRkU291cmNlICtcbiAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gZG8gbm90IGNyZWF0ZSBhIG5ldyBvYmplY3QgYXMgdGFzay5kYXRhIHRvIHBhc3MgdGhvc2UgdGhpbmdzXG4gICAgICAgIC8vIGp1c3QgdXNlIHRoZSBnbG9iYWwgc2hhcmVkIG9uZVxuICAgICAgICB0YXNrRGF0YS5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICAvLyBpZiBhZGRFdmVudExpc3RlbmVyIHdpdGggb25jZSBvcHRpb25zLCB3ZSBkb24ndCBwYXNzIGl0IHRvXG4gICAgICAgICAgLy8gbmF0aXZlIGFkZEV2ZW50TGlzdGVuZXIsIGluc3RlYWQgd2Uga2VlcCB0aGUgb25jZSBzZXR0aW5nXG4gICAgICAgICAgLy8gYW5kIGhhbmRsZSBvdXJzZWx2ZXMuXG4gICAgICAgICAgdGFza0RhdGEub3B0aW9ucy5vbmNlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0YXNrRGF0YS5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgdGFza0RhdGEuZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICB0YXNrRGF0YS5pc0V4aXN0aW5nID0gaXNFeGlzdGluZztcblxuICAgICAgICBjb25zdCBkYXRhID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBPUFRJTUlaRURfWk9ORV9FVkVOVF9UQVNLX0RBVEEgOiB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8ga2VlcCB0YXNrRGF0YSBpbnRvIGRhdGEgdG8gYWxsb3cgb25TY2hlZHVsZUV2ZW50VGFzayB0byBhY2Nlc3MgdGhlIHRhc2sgaW5mb3JtYXRpb25cbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAoZGF0YSBhcyBhbnkpLnRhc2tEYXRhID0gdGFza0RhdGE7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0YXNrOiBhbnkgPVxuICAgICAgICAgICAgem9uZS5zY2hlZHVsZUV2ZW50VGFzayhzb3VyY2UsIGRlbGVnYXRlLCBkYXRhLCBjdXN0b21TY2hlZHVsZUZuLCBjdXN0b21DYW5jZWxGbik7XG5cbiAgICAgICAgLy8gc2hvdWxkIGNsZWFyIHRhc2tEYXRhLnRhcmdldCB0byBhdm9pZCBtZW1vcnkgbGVha1xuICAgICAgICAvLyBpc3N1ZSwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvYW5ndWxhci9pc3N1ZXMvMjA0NDJcbiAgICAgICAgdGFza0RhdGEudGFyZ2V0ID0gbnVsbDtcblxuICAgICAgICAvLyBuZWVkIHRvIGNsZWFyIHVwIHRhc2tEYXRhIGJlY2F1c2UgaXQgaXMgYSBnbG9iYWwgb2JqZWN0XG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgKGRhdGEgYXMgYW55KS50YXNrRGF0YSA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoYXZlIHRvIHNhdmUgdGhvc2UgaW5mb3JtYXRpb24gdG8gdGFzayBpbiBjYXNlXG4gICAgICAgIC8vIGFwcGxpY2F0aW9uIG1heSBjYWxsIHRhc2suem9uZS5jYW5jZWxUYXNrKCkgZGlyZWN0bHlcbiAgICAgICAgaWYgKG9uY2UpIHtcbiAgICAgICAgICBvcHRpb25zLm9uY2UgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghKCFwYXNzaXZlU3VwcG9ydGVkICYmIHR5cGVvZiB0YXNrLm9wdGlvbnMgPT09ICdib29sZWFuJykpIHtcbiAgICAgICAgICAvLyBpZiBub3Qgc3VwcG9ydCBwYXNzaXZlLCBhbmQgd2UgcGFzcyBhbiBvcHRpb24gb2JqZWN0XG4gICAgICAgICAgLy8gdG8gYWRkRXZlbnRMaXN0ZW5lciwgd2Ugc2hvdWxkIHNhdmUgdGhlIG9wdGlvbnMgdG8gdGFza1xuICAgICAgICAgIHRhc2sub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIH1cbiAgICAgICAgdGFzay50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRhc2suY2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgIHRhc2suZXZlbnROYW1lID0gZXZlbnROYW1lO1xuICAgICAgICBpZiAoaXNIYW5kbGVFdmVudCkge1xuICAgICAgICAgIC8vIHNhdmUgb3JpZ2luYWwgZGVsZWdhdGUgZm9yIGNvbXBhcmUgdG8gY2hlY2sgZHVwbGljYXRlXG4gICAgICAgICAgKHRhc2sgYXMgYW55KS5vcmlnaW5hbERlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwcmVwZW5kKSB7XG4gICAgICAgICAgZXhpc3RpbmdUYXNrcy5wdXNoKHRhc2spO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXN0aW5nVGFza3MudW5zaGlmdCh0YXNrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBwcm90b1tBRERfRVZFTlRfTElTVEVORVJdID0gbWFrZUFkZExpc3RlbmVyKFxuICAgICAgICBuYXRpdmVBZGRFdmVudExpc3RlbmVyLCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFLCBjdXN0b21TY2hlZHVsZSwgY3VzdG9tQ2FuY2VsLFxuICAgICAgICByZXR1cm5UYXJnZXQpO1xuICAgIGlmIChuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lcikge1xuICAgICAgcHJvdG9bUFJFUEVORF9FVkVOVF9MSVNURU5FUl0gPSBtYWtlQWRkTGlzdGVuZXIoXG4gICAgICAgICAgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIsIFBSRVBFTkRfRVZFTlRfTElTVEVORVJfU09VUkNFLCBjdXN0b21TY2hlZHVsZVByZXBlbmQsXG4gICAgICAgICAgY3VzdG9tQ2FuY2VsLCByZXR1cm5UYXJnZXQsIHRydWUpO1xuICAgIH1cblxuICAgIHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG5cbiAgICAgIGxldCBjYXB0dXJlO1xuICAgICAgaWYgKG9wdGlvbnMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBjYXB0dXJlID0gZmFsc2U7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICAgICAgY2FwdHVyZSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNhcHR1cmUgPSBvcHRpb25zID8gISFvcHRpb25zLmNhcHR1cmUgOiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZGVsZWdhdGUgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgIHJldHVybiBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9XG5cbiAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiZcbiAgICAgICAgICAhdmFsaWRhdGVIYW5kbGVyKG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIsIGRlbGVnYXRlLCB0YXJnZXQsIGFyZ3VtZW50cykpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW2NhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICB9XG4gICAgICBjb25zdCBleGlzdGluZ1Rhc2tzID0gc3ltYm9sRXZlbnROYW1lICYmIHRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgZXhpc3RpbmdUYXNrID0gZXhpc3RpbmdUYXNrc1tpXTtcbiAgICAgICAgICBpZiAoY29tcGFyZShleGlzdGluZ1Rhc2ssIGRlbGVnYXRlKSkge1xuICAgICAgICAgICAgZXhpc3RpbmdUYXNrcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAvLyBzZXQgaXNSZW1vdmVkIHRvIGRhdGEgZm9yIGZhc3RlciBpbnZva2VUYXNrIGNoZWNrXG4gICAgICAgICAgICAoZXhpc3RpbmdUYXNrIGFzIGFueSkuaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAvLyBhbGwgdGFza3MgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlIGhhdmUgZ29uZSxcbiAgICAgICAgICAgICAgLy8gcmVtb3ZlIGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrIGFuZCByZW1vdmUgdGhlIHRhc2sgY2FjaGUgZnJvbSB0YXJnZXRcbiAgICAgICAgICAgICAgKGV4aXN0aW5nVGFzayBhcyBhbnkpLmFsbFJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleGlzdGluZ1Rhc2suem9uZS5jYW5jZWxUYXNrKGV4aXN0aW5nVGFzayk7XG4gICAgICAgICAgICBpZiAocmV0dXJuVGFyZ2V0KSB7XG4gICAgICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgICAvLyBpc3N1ZSA5MzAsIGRpZG4ndCBmaW5kIHRoZSBldmVudCBuYW1lIG9yIGNhbGxiYWNrXG4gICAgICAvLyBmcm9tIHpvbmUga2VwdCBleGlzdGluZ1Rhc2tzLCB0aGUgY2FsbGJhY2sgbWF5YmVcbiAgICAgIC8vIGFkZGVkIG91dHNpZGUgb2Ygem9uZSwgd2UgbmVlZCB0byBjYWxsIG5hdGl2ZSByZW1vdmVFdmVudExpc3RlbmVyXG4gICAgICAvLyB0byB0cnkgdG8gcmVtb3ZlIGl0LlxuICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuXG4gICAgcHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgY29uc3QgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuXG4gICAgICBjb25zdCBsaXN0ZW5lcnM6IGFueVtdID0gW107XG4gICAgICBjb25zdCB0YXNrcyA9XG4gICAgICAgICAgZmluZEV2ZW50VGFza3ModGFyZ2V0LCBldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGNvbnN0IHRhc2s6IGFueSA9IHRhc2tzW2ldO1xuICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICBsaXN0ZW5lcnMucHVzaChkZWxlZ2F0ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICBwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcblxuICAgICAgY29uc3QgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgaWYgKCFldmVudE5hbWUpIHtcbiAgICAgICAgY29uc3Qga2V5cyA9IE9iamVjdC5rZXlzKHRhcmdldCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IHByb3AgPSBrZXlzW2ldO1xuICAgICAgICAgIGNvbnN0IG1hdGNoID0gRVZFTlRfTkFNRV9TWU1CT0xfUkVHWC5leGVjKHByb3ApO1xuICAgICAgICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgICAgICAgLy8gaW4gbm9kZWpzIEV2ZW50RW1pdHRlciwgcmVtb3ZlTGlzdGVuZXIgZXZlbnQgaXNcbiAgICAgICAgICAvLyB1c2VkIGZvciBtb25pdG9yaW5nIHRoZSByZW1vdmVMaXN0ZW5lciBjYWxsLFxuICAgICAgICAgIC8vIHNvIGp1c3Qga2VlcCByZW1vdmVMaXN0ZW5lciBldmVudExpc3RlbmVyIHVudGlsXG4gICAgICAgICAgLy8gYWxsIG90aGVyIGV2ZW50TGlzdGVuZXJzIGFyZSByZW1vdmVkXG4gICAgICAgICAgaWYgKGV2dE5hbWUgJiYgZXZ0TmFtZSAhPT0gJ3JlbW92ZUxpc3RlbmVyJykge1xuICAgICAgICAgICAgdGhpc1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldnROYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmVtb3ZlIHJlbW92ZUxpc3RlbmVyIGxpc3RlbmVyIGZpbmFsbHlcbiAgICAgICAgdGhpc1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCAncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbRkFMU0VfU1RSXTtcbiAgICAgICAgICBjb25zdCBzeW1ib2xDYXB0dXJlRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tUUlVFX1NUUl07XG5cbiAgICAgICAgICBjb25zdCB0YXNrcyA9IHRhcmdldFtzeW1ib2xFdmVudE5hbWVdO1xuICAgICAgICAgIGNvbnN0IGNhcHR1cmVUYXNrcyA9IHRhcmdldFtzeW1ib2xDYXB0dXJlRXZlbnROYW1lXTtcblxuICAgICAgICAgIGlmICh0YXNrcykge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlVGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcmVtb3ZlVGFza3NbaV07XG4gICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGNhcHR1cmVUYXNrcykge1xuICAgICAgICAgICAgY29uc3QgcmVtb3ZlVGFza3MgPSBjYXB0dXJlVGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlbW92ZVRhc2tzW2ldO1xuICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldmVudE5hbWUsIGRlbGVnYXRlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocmV0dXJuVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuICAgIH07XG5cbiAgICAvLyBmb3IgbmF0aXZlIHRvU3RyaW5nIHBhdGNoXG4gICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIpO1xuICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyKTtcbiAgICBpZiAobmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzKSB7XG4gICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMpO1xuICAgIH1cbiAgICBpZiAobmF0aXZlTGlzdGVuZXJzKSB7XG4gICAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlTGlzdGVuZXJzKTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBsZXQgcmVzdWx0czogYW55W10gPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgcmVzdWx0c1tpXSA9IHBhdGNoRXZlbnRUYXJnZXRNZXRob2RzKGFwaXNbaV0sIHBhdGNoT3B0aW9ucyk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0cztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmRFdmVudFRhc2tzKHRhcmdldDogYW55LCBldmVudE5hbWU6IHN0cmluZyk6IFRhc2tbXSB7XG4gIGNvbnN0IGZvdW5kVGFza3M6IGFueVtdID0gW107XG4gIGZvciAobGV0IHByb3AgaW4gdGFyZ2V0KSB7XG4gICAgY29uc3QgbWF0Y2ggPSBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYLmV4ZWMocHJvcCk7XG4gICAgbGV0IGV2dE5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICBpZiAoZXZ0TmFtZSAmJiAoIWV2ZW50TmFtZSB8fCBldnROYW1lID09PSBldmVudE5hbWUpKSB7XG4gICAgICBjb25zdCB0YXNrczogYW55ID0gdGFyZ2V0W3Byb3BdO1xuICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBmb3VuZFRhc2tzLnB1c2godGFza3NbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBmb3VuZFRhc2tzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hFdmVudFByb3RvdHlwZShnbG9iYWw6IGFueSwgYXBpOiBfWm9uZVByaXZhdGUpIHtcbiAgY29uc3QgRXZlbnQgPSBnbG9iYWxbJ0V2ZW50J107XG4gIGlmIChFdmVudCAmJiBFdmVudC5wcm90b3R5cGUpIHtcbiAgICBhcGkucGF0Y2hNZXRob2QoXG4gICAgICAgIEV2ZW50LnByb3RvdHlwZSwgJ3N0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbicsXG4gICAgICAgIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IGZ1bmN0aW9uKHNlbGY6IGFueSwgYXJnczogYW55W10pIHtcbiAgICAgICAgICBzZWxmW0lNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0xdID0gdHJ1ZTtcbiAgICAgICAgICAvLyB3ZSBuZWVkIHRvIGNhbGwgdGhlIG5hdGl2ZSBzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb25cbiAgICAgICAgICAvLyBpbiBjYXNlIGluIHNvbWUgaHlicmlkIGFwcGxpY2F0aW9uLCBzb21lIHBhcnQgb2ZcbiAgICAgICAgICAvLyBhcHBsaWNhdGlvbiB3aWxsIGJlIGNvbnRyb2xsZWQgYnkgem9uZSwgc29tZSBhcmUgbm90XG4gICAgICAgICAgZGVsZWdhdGUgJiYgZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgICAgIH0pO1xuICB9XG59XG4iXX0=