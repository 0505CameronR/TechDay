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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0g7OztHQUdHOztBQUVILGlDQUFvTDtBQVFwTCxJQUFJLGdCQUFnQixHQUFHLEtBQUssQ0FBQztBQUU3QixJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsRUFBRTtJQUNqQyxJQUFJO1FBQ0YsSUFBTSxPQUFPLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFO1lBQ25ELEdBQUcsRUFBRTtnQkFDSCxnQkFBZ0IsR0FBRyxJQUFJLENBQUM7WUFDMUIsQ0FBQztTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ2xELE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQ3REO0lBQUMsT0FBTyxHQUFHLEVBQUU7UUFDWixnQkFBZ0IsR0FBRyxLQUFLLENBQUM7S0FDMUI7Q0FDRjtBQUVELG9FQUFvRTtBQUNwRSxJQUFNLDhCQUE4QixHQUFrQjtJQUNwRCxJQUFJLEVBQUUsSUFBSTtDQUNYLENBQUM7QUFFVyxRQUFBLG9CQUFvQixHQUFRLEVBQUUsQ0FBQztBQUMvQixRQUFBLGFBQWEsR0FBUSxFQUFFLENBQUM7QUFFckMsSUFBTSxzQkFBc0IsR0FBRyxvQ0FBb0MsQ0FBQztBQUNwRSxJQUFNLDRCQUE0QixHQUFHLENBQUMsbUNBQW1DLENBQUMsQ0FBQztBQTZCM0UsU0FBZ0IsZ0JBQWdCLENBQzVCLE9BQVksRUFBRSxJQUFXLEVBQUUsWUFBc0M7SUFDbkUsSUFBTSxr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QUMsQ0FBQztRQUNoQyxJQUFJLE9BQU8sSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLE9BQU8sS0FBSyxTQUFTLENBQUMsRUFBRTtZQUNwRCxJQUFNLEtBQUssR0FBUSxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDaEMsSUFBSSxLQUFLLEVBQUU7Z0JBQ1QsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7b0JBQ3JDLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQzNCO2FBQ0Y7U0FDRjtLQUNGO0lBQ0QsT0FBTyxVQUFVLENBQUM7QUFDcEIsQ0FBQztBQWZELHdDQWVDO0FBRUQsU0FBZ0IsbUJBQW1CLENBQUMsTUFBVyxFQUFFLEdBQWlCO0lBQ2hFLElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixJQUFJLEtBQUssSUFBSSxLQUFLLENBQUMsU0FBUyxFQUFFO1FBQzVCLEdBQUcsQ0FBQyxXQUFXLENBQ1gsS0FBSyxDQUFDLFNBQVMsRUFBRSwwQkFBMEIsRUFDM0MsVUFBQyxRQUFrQixJQUFLLE9BQUEsVUFBUyxJQUFTLEVBQUUsSUFBVztZQUNyRCxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUMsc0RBQXNEO1lBQ3RELG1EQUFtRDtZQUNuRCx1REFBdUQ7WUFDdkQsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsRUFOdUIsQ0FNdkIsQ0FBQyxDQUFDO0tBQ1I7QUFDSCxDQUFDO0FBYkQsa0RBYUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7bWlzc2luZ1JlcXVpcmV9XG4gKi9cblxuaW1wb3J0IHtBRERfRVZFTlRfTElTVEVORVJfU1RSLCBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQsIEZBTFNFX1NUUiwgaXNOb2RlLCBPYmplY3RHZXRQcm90b3R5cGVPZiwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiwgVFJVRV9TVFIsIFpPTkVfU1lNQk9MX1BSRUZJWCwgem9uZVN5bWJvbH0gZnJvbSAnLi91dGlscyc7XG5cbi8qKiBAaW50ZXJuYWwgKiovXG5pbnRlcmZhY2UgRXZlbnRUYXNrRGF0YSBleHRlbmRzIFRhc2tEYXRhIHtcbiAgLy8gdXNlIGdsb2JhbCBjYWxsYmFjayBvciBub3RcbiAgcmVhZG9ubHkgdXNlRz86IGJvb2xlYW47XG59XG5cbmxldCBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2U7XG5cbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJykge1xuICB0cnkge1xuICAgIGNvbnN0IG9wdGlvbnMgPSBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdwYXNzaXZlJywge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcGFzc2l2ZVN1cHBvcnRlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigndGVzdCcsIG9wdGlvbnMsIG9wdGlvbnMpO1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCd0ZXN0Jywgb3B0aW9ucywgb3B0aW9ucyk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHBhc3NpdmVTdXBwb3J0ZWQgPSBmYWxzZTtcbiAgfVxufVxuXG4vLyBhbiBpZGVudGlmaWVyIHRvIHRlbGwgWm9uZVRhc2sgZG8gbm90IGNyZWF0ZSBhIG5ldyBpbnZva2UgY2xvc3VyZVxuY29uc3QgT1BUSU1JWkVEX1pPTkVfRVZFTlRfVEFTS19EQVRBOiBFdmVudFRhc2tEYXRhID0ge1xuICB1c2VHOiB0cnVlXG59O1xuXG5leHBvcnQgY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXM6IGFueSA9IHt9O1xuZXhwb3J0IGNvbnN0IGdsb2JhbFNvdXJjZXM6IGFueSA9IHt9O1xuXG5jb25zdCBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYID0gL15fX3pvbmVfc3ltYm9sX18oXFx3KykodHJ1ZXxmYWxzZSkkLztcbmNvbnN0IElNTUVESUFURV9QUk9QQUdBVElPTl9TWU1CT0wgPSAoJ19fem9uZV9zeW1ib2xfX3Byb3BhZ2F0aW9uU3RvcHBlZCcpO1xuXG5leHBvcnQgaW50ZXJmYWNlIFBhdGNoRXZlbnRUYXJnZXRPcHRpb25zIHtcbiAgLy8gdmFsaWRhdGVIYW5kbGVyXG4gIHZoPzogKG5hdGl2ZURlbGVnYXRlOiBhbnksIGRlbGVnYXRlOiBhbnksIHRhcmdldDogYW55LCBhcmdzOiBhbnkpID0+IGJvb2xlYW47XG4gIC8vIGFkZEV2ZW50TGlzdGVuZXIgZnVuY3Rpb24gbmFtZVxuICBhZGQ/OiBzdHJpbmc7XG4gIC8vIHJlbW92ZUV2ZW50TGlzdGVuZXIgZnVuY3Rpb24gbmFtZVxuICBybT86IHN0cmluZztcbiAgLy8gcHJlcGVuZEV2ZW50TGlzdGVuZXIgZnVuY3Rpb24gbmFtZVxuICBwcmVwZW5kPzogc3RyaW5nO1xuICAvLyBsaXN0ZW5lcnMgZnVuY3Rpb24gbmFtZVxuICBsaXN0ZW5lcnM/OiBzdHJpbmc7XG4gIC8vIHJlbW92ZUFsbExpc3RlbmVycyBmdW5jdGlvbiBuYW1lXG4gIHJtQWxsPzogc3RyaW5nO1xuICAvLyB1c2VHbG9iYWxDYWxsYmFjayBmbGFnXG4gIHVzZUc/OiBib29sZWFuO1xuICAvLyBjaGVjayBkdXBsaWNhdGUgZmxhZyB3aGVuIGFkZEV2ZW50TGlzdGVuZXJcbiAgY2hrRHVwPzogYm9vbGVhbjtcbiAgLy8gcmV0dXJuIHRhcmdldCBmbGFnIHdoZW4gYWRkRXZlbnRMaXN0ZW5lclxuICBydD86IGJvb2xlYW47XG4gIC8vIGV2ZW50IGNvbXBhcmUgaGFuZGxlclxuICBkaWZmPzogKHRhc2s6IGFueSwgZGVsZWdhdGU6IGFueSkgPT4gYm9vbGVhbjtcbiAgLy8gc3VwcG9ydCBwYXNzaXZlIG9yIG5vdFxuICBzdXBwb3J0UGFzc2l2ZT86IGJvb2xlYW47XG4gIC8vIGdldCBzdHJpbmcgZnJvbSBldmVudE5hbWUgKGluIG5vZGVqcywgZXZlbnROYW1lIG1heWJlIFN5bWJvbClcbiAgZXZlbnROYW1lVG9TdHJpbmc/OiAoZXZlbnROYW1lOiBhbnkpID0+IHN0cmluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRXZlbnRUYXJnZXQoXG4gICAgX2dsb2JhbDogYW55LCBhcGlzOiBhbnlbXSwgcGF0Y2hPcHRpb25zPzogUGF0Y2hFdmVudFRhcmdldE9wdGlvbnMpIHtcbiAgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuYWRkKSB8fCBBRERfRVZFTlRfTElTVEVORVJfU1RSO1xuICBjb25zdCBSRU1PVkVfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ybSkgfHwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUjtcblxuICBjb25zdCBMSVNURU5FUlNfRVZFTlRfTElTVEVORVIgPSAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5saXN0ZW5lcnMpIHx8ICdldmVudExpc3RlbmVycyc7XG4gIGNvbnN0IFJFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSID1cbiAgICAgIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnJtQWxsKSB8fCAncmVtb3ZlQWxsTGlzdGVuZXJzJztcblxuICBjb25zdCB6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lciA9IHpvbmVTeW1ib2woQUREX0VWRU5UX0xJU1RFTkVSKTtcblxuICBjb25zdCBBRERfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy4nICsgQUREX0VWRU5UX0xJU1RFTkVSICsgJzonO1xuXG4gIGNvbnN0IFBSRVBFTkRfRVZFTlRfTElTVEVORVIgPSAncHJlcGVuZExpc3RlbmVyJztcbiAgY29uc3QgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UgPSAnLicgKyBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSICsgJzonO1xuXG4gIGNvbnN0IGludm9rZVRhc2sgPSBmdW5jdGlvbih0YXNrOiBhbnksIHRhcmdldDogYW55LCBldmVudDogRXZlbnQpIHtcbiAgICAvLyBmb3IgYmV0dGVyIHBlcmZvcm1hbmNlLCBjaGVjayBpc1JlbW92ZWQgd2hpY2ggaXMgc2V0XG4gICAgLy8gYnkgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgIGlmICh0YXNrLmlzUmVtb3ZlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2suY2FsbGJhY2s7XG4gICAgaWYgKHR5cGVvZiBkZWxlZ2F0ZSA9PT0gJ29iamVjdCcgJiYgZGVsZWdhdGUuaGFuZGxlRXZlbnQpIHtcbiAgICAgIC8vIGNyZWF0ZSB0aGUgYmluZCB2ZXJzaW9uIG9mIGhhbmRsZUV2ZW50IHdoZW4gaW52b2tlXG4gICAgICB0YXNrLmNhbGxiYWNrID0gKGV2ZW50OiBFdmVudCkgPT4gZGVsZWdhdGUuaGFuZGxlRXZlbnQoZXZlbnQpO1xuICAgICAgdGFzay5vcmlnaW5hbERlbGVnYXRlID0gZGVsZWdhdGU7XG4gICAgfVxuICAgIC8vIGludm9rZSBzdGF0aWMgdGFzay5pbnZva2VcbiAgICB0YXNrLmludm9rZSh0YXNrLCB0YXJnZXQsIFtldmVudF0pO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0YXNrLm9wdGlvbnM7XG4gICAgaWYgKG9wdGlvbnMgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdvYmplY3QnICYmIG9wdGlvbnMub25jZSkge1xuICAgICAgLy8gaWYgb3B0aW9ucy5vbmNlIGlzIHRydWUsIGFmdGVyIGludm9rZSBvbmNlIHJlbW92ZSBsaXN0ZW5lciBoZXJlXG4gICAgICAvLyBvbmx5IGJyb3dzZXIgbmVlZCB0byBkbyB0aGlzLCBub2RlanMgZXZlbnRFbWl0dGVyIHdpbGwgY2FsIHJlbW92ZUxpc3RlbmVyXG4gICAgICAvLyBpbnNpZGUgRXZlbnRFbWl0dGVyLm9uY2VcbiAgICAgIGNvbnN0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgIHRhcmdldFtSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGFyZ2V0LCBldmVudC50eXBlLCBkZWxlZ2F0ZSwgb3B0aW9ucyk7XG4gICAgfVxuICB9O1xuXG4gIC8vIGdsb2JhbCBzaGFyZWQgem9uZUF3YXJlQ2FsbGJhY2sgdG8gaGFuZGxlIGFsbCBldmVudCBjYWxsYmFjayB3aXRoIGNhcHR1cmUgPSBmYWxzZVxuICBjb25zdCBnbG9iYWxab25lQXdhcmVDYWxsYmFjayA9IGZ1bmN0aW9uKGV2ZW50OiBFdmVudCkge1xuICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzkxMSwgaW4gSUUsIHNvbWV0aW1lc1xuICAgIC8vIGV2ZW50IHdpbGwgYmUgdW5kZWZpbmVkLCBzbyB3ZSBuZWVkIHRvIHVzZSB3aW5kb3cuZXZlbnRcbiAgICBldmVudCA9IGV2ZW50IHx8IF9nbG9iYWwuZXZlbnQ7XG4gICAgaWYgKCFldmVudCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICAvLyBldmVudC50YXJnZXQgaXMgbmVlZGVkIGZvciBTYW1zdW5nIFRWIGFuZCBTb3VyY2VCdWZmZXJcbiAgICAvLyB8fCBnbG9iYWwgaXMgbmVlZGVkIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzE5MFxuICAgIGNvbnN0IHRhcmdldDogYW55ID0gdGhpcyB8fCBldmVudC50YXJnZXQgfHwgX2dsb2JhbDtcbiAgICBjb25zdCB0YXNrcyA9IHRhcmdldFt6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudC50eXBlXVtGQUxTRV9TVFJdXTtcbiAgICBpZiAodGFza3MpIHtcbiAgICAgIC8vIGludm9rZSBhbGwgdGFza3Mgd2hpY2ggYXR0YWNoZWQgdG8gY3VycmVudCB0YXJnZXQgd2l0aCBnaXZlbiBldmVudC50eXBlIGFuZCBjYXB0dXJlID0gZmFsc2VcbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBpZiB0YXNrLmxlbmd0aCA9PT0gMSwganVzdCBpbnZva2VcbiAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrc1swXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy84MzZcbiAgICAgICAgLy8gY29weSB0aGUgdGFza3MgYXJyYXkgYmVmb3JlIGludm9rZSwgdG8gYXZvaWRcbiAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHdpbGwgcmVtb3ZlIGl0c2VsZiBvciBvdGhlciBsaXN0ZW5lclxuICAgICAgICBjb25zdCBjb3B5VGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHlUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChldmVudCAmJiAoZXZlbnQgYXMgYW55KVtJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludm9rZVRhc2soY29weVRhc2tzW2ldLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICAvLyBnbG9iYWwgc2hhcmVkIHpvbmVBd2FyZUNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgZXZlbnQgY2FsbGJhY2sgd2l0aCBjYXB0dXJlID0gdHJ1ZVxuICBjb25zdCBnbG9iYWxab25lQXdhcmVDYXB0dXJlQ2FsbGJhY2sgPSBmdW5jdGlvbihldmVudDogRXZlbnQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy85MTEsIGluIElFLCBzb21ldGltZXNcbiAgICAvLyBldmVudCB3aWxsIGJlIHVuZGVmaW5lZCwgc28gd2UgbmVlZCB0byB1c2Ugd2luZG93LmV2ZW50XG4gICAgZXZlbnQgPSBldmVudCB8fCBfZ2xvYmFsLmV2ZW50O1xuICAgIGlmICghZXZlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZXZlbnQudGFyZ2V0IGlzIG5lZWRlZCBmb3IgU2Ftc3VuZyBUViBhbmQgU291cmNlQnVmZmVyXG4gICAgLy8gfHwgZ2xvYmFsIGlzIG5lZWRlZCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy8xOTBcbiAgICBjb25zdCB0YXJnZXQ6IGFueSA9IHRoaXMgfHwgZXZlbnQudGFyZ2V0IHx8IF9nbG9iYWw7XG4gICAgY29uc3QgdGFza3MgPSB0YXJnZXRbem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnQudHlwZV1bVFJVRV9TVFJdXTtcbiAgICBpZiAodGFza3MpIHtcbiAgICAgIC8vIGludm9rZSBhbGwgdGFza3Mgd2hpY2ggYXR0YWNoZWQgdG8gY3VycmVudCB0YXJnZXQgd2l0aCBnaXZlbiBldmVudC50eXBlIGFuZCBjYXB0dXJlID0gZmFsc2VcbiAgICAgIC8vIGZvciBwZXJmb3JtYW5jZSBjb25jZXJuLCBpZiB0YXNrLmxlbmd0aCA9PT0gMSwganVzdCBpbnZva2VcbiAgICAgIGlmICh0YXNrcy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgaW52b2tlVGFzayh0YXNrc1swXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy84MzZcbiAgICAgICAgLy8gY29weSB0aGUgdGFza3MgYXJyYXkgYmVmb3JlIGludm9rZSwgdG8gYXZvaWRcbiAgICAgICAgLy8gdGhlIGNhbGxiYWNrIHdpbGwgcmVtb3ZlIGl0c2VsZiBvciBvdGhlciBsaXN0ZW5lclxuICAgICAgICBjb25zdCBjb3B5VGFza3MgPSB0YXNrcy5zbGljZSgpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvcHlUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChldmVudCAmJiAoZXZlbnQgYXMgYW55KVtJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICAgIGludm9rZVRhc2soY29weVRhc2tzW2ldLCB0YXJnZXQsIGV2ZW50KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfTtcblxuICBmdW5jdGlvbiBwYXRjaEV2ZW50VGFyZ2V0TWV0aG9kcyhvYmo6IGFueSwgcGF0Y2hPcHRpb25zPzogUGF0Y2hFdmVudFRhcmdldE9wdGlvbnMpIHtcbiAgICBpZiAoIW9iaikge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGxldCB1c2VHbG9iYWxDYWxsYmFjayA9IHRydWU7XG4gICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMudXNlRyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB1c2VHbG9iYWxDYWxsYmFjayA9IHBhdGNoT3B0aW9ucy51c2VHO1xuICAgIH1cbiAgICBjb25zdCB2YWxpZGF0ZUhhbmRsZXIgPSBwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnZoO1xuXG4gICAgbGV0IGNoZWNrRHVwbGljYXRlID0gdHJ1ZTtcbiAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5jaGtEdXAgIT09IHVuZGVmaW5lZCkge1xuICAgICAgY2hlY2tEdXBsaWNhdGUgPSBwYXRjaE9wdGlvbnMuY2hrRHVwO1xuICAgIH1cblxuICAgIGxldCByZXR1cm5UYXJnZXQgPSBmYWxzZTtcbiAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ydCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm5UYXJnZXQgPSBwYXRjaE9wdGlvbnMucnQ7XG4gICAgfVxuXG4gICAgbGV0IHByb3RvID0gb2JqO1xuICAgIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkoQUREX0VWRU5UX0xJU1RFTkVSKSkge1xuICAgICAgcHJvdG8gPSBPYmplY3RHZXRQcm90b3R5cGVPZihwcm90byk7XG4gICAgfVxuICAgIGlmICghcHJvdG8gJiYgb2JqW0FERF9FVkVOVF9MSVNURU5FUl0pIHtcbiAgICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICAgIHByb3RvID0gb2JqO1xuICAgIH1cblxuICAgIGlmICghcHJvdG8pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHByb3RvW3pvbmVTeW1ib2xBZGRFdmVudExpc3RlbmVyXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIGNvbnN0IGV2ZW50TmFtZVRvU3RyaW5nID0gcGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ldmVudE5hbWVUb1N0cmluZztcblxuICAgIC8vIGEgc2hhcmVkIGdsb2JhbCB0YXNrRGF0YSB0byBwYXNzIGRhdGEgZm9yIHNjaGVkdWxlRXZlbnRUYXNrXG4gICAgLy8gc28gd2UgZG8gbm90IG5lZWQgdG8gY3JlYXRlIGEgbmV3IG9iamVjdCBqdXN0IGZvciBwYXNzIHNvbWUgZGF0YVxuICAgIGNvbnN0IHRhc2tEYXRhOiBhbnkgPSB7fTtcblxuICAgIGNvbnN0IG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lcl0gPSBwcm90b1tBRERfRVZFTlRfTElTVEVORVJdO1xuICAgIGNvbnN0IG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIgPSBwcm90b1t6b25lU3ltYm9sKFJFTU9WRV9FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXTtcblxuICAgIGNvbnN0IG5hdGl2ZUxpc3RlbmVycyA9IHByb3RvW3pvbmVTeW1ib2woTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICBwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdO1xuICAgIGNvbnN0IG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycyA9IHByb3RvW3pvbmVTeW1ib2woUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXTtcblxuICAgIGxldCBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lcjogYW55O1xuICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnByZXBlbmQpIHtcbiAgICAgIG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbChwYXRjaE9wdGlvbnMucHJlcGVuZCldID1cbiAgICAgICAgICBwcm90b1twYXRjaE9wdGlvbnMucHJlcGVuZF07XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2hlY2tJc1Bhc3NpdmUodGFzazogVGFzaykge1xuICAgICAgaWYgKCFwYXNzaXZlU3VwcG9ydGVkICYmIHR5cGVvZiB0YXNrRGF0YS5vcHRpb25zICE9PSAnYm9vbGVhbicgJiZcbiAgICAgICAgICB0eXBlb2YgdGFza0RhdGEub3B0aW9ucyAhPT0gJ3VuZGVmaW5lZCcgJiYgdGFza0RhdGEub3B0aW9ucyAhPT0gbnVsbCkge1xuICAgICAgICAvLyBvcHRpb25zIGlzIGEgbm9uLW51bGwgbm9uLXVuZGVmaW5lZCBvYmplY3RcbiAgICAgICAgLy8gcGFzc2l2ZSBpcyBub3Qgc3VwcG9ydGVkXG4gICAgICAgIC8vIGRvbid0IHBhc3Mgb3B0aW9ucyBhcyBvYmplY3RcbiAgICAgICAgLy8ganVzdCBwYXNzIGNhcHR1cmUgYXMgYSBib29sZWFuXG4gICAgICAgICh0YXNrIGFzIGFueSkub3B0aW9ucyA9ICEhdGFza0RhdGEub3B0aW9ucy5jYXB0dXJlO1xuICAgICAgICB0YXNrRGF0YS5vcHRpb25zID0gKHRhc2sgYXMgYW55KS5vcHRpb25zO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlR2xvYmFsID0gZnVuY3Rpb24odGFzazogVGFzaykge1xuICAgICAgLy8gaWYgdGhlcmUgaXMgYWxyZWFkeSBhIHRhc2sgZm9yIHRoZSBldmVudE5hbWUgKyBjYXB0dXJlLFxuICAgICAgLy8ganVzdCByZXR1cm4sIGJlY2F1c2Ugd2UgdXNlIHRoZSBzaGFyZWQgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgaGVyZS5cbiAgICAgIGlmICh0YXNrRGF0YS5pc0V4aXN0aW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGNoZWNrSXNQYXNzaXZlKHRhc2spO1xuICAgICAgcmV0dXJuIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIuY2FsbChcbiAgICAgICAgICB0YXNrRGF0YS50YXJnZXQsIHRhc2tEYXRhLmV2ZW50TmFtZSxcbiAgICAgICAgICB0YXNrRGF0YS5jYXB0dXJlID8gZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrIDogZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2ssXG4gICAgICAgICAgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN1c3RvbUNhbmNlbEdsb2JhbCA9IGZ1bmN0aW9uKHRhc2s6IGFueSkge1xuICAgICAgLy8gaWYgdGFzayBpcyBub3QgbWFya2VkIGFzIGlzUmVtb3ZlZCwgdGhpcyBjYWxsIGlzIGRpcmVjdGx5XG4gICAgICAvLyBmcm9tIFpvbmUucHJvdG90eXBlLmNhbmNlbFRhc2ssIHdlIHNob3VsZCByZW1vdmUgdGhlIHRhc2tcbiAgICAgIC8vIGZyb20gdGFza3NMaXN0IG9mIHRhcmdldCBmaXJzdFxuICAgICAgaWYgKCF0YXNrLmlzUmVtb3ZlZCkge1xuICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbdGFzay5ldmVudE5hbWVdO1xuICAgICAgICBsZXQgc3ltYm9sRXZlbnROYW1lO1xuICAgICAgICBpZiAoc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbdGFzay5jYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFzay50YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrID09PSB0YXNrKSB7XG4gICAgICAgICAgICAgIGV4aXN0aW5nVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAvLyBzZXQgaXNSZW1vdmVkIHRvIGRhdGEgZm9yIGZhc3RlciBpbnZva2VUYXNrIGNoZWNrXG4gICAgICAgICAgICAgIHRhc2suaXNSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrIGFuZCByZW1vdmUgdGhlIHRhc2sgY2FjaGUgZnJvbSB0YXJnZXRcbiAgICAgICAgICAgICAgICB0YXNrLmFsbFJlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaWYgYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAvLyB3ZSB3aWxsIHJlYWxseSByZW1vdmUgdGhlIGdsb2JhbCBldmVudCBjYWxsYmFjayxcbiAgICAgIC8vIGlmIG5vdCwgcmV0dXJuXG4gICAgICBpZiAoIXRhc2suYWxsUmVtb3ZlZCkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKFxuICAgICAgICAgIHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSxcbiAgICAgICAgICB0YXNrLmNhcHR1cmUgPyBnbG9iYWxab25lQXdhcmVDYXB0dXJlQ2FsbGJhY2sgOiBnbG9iYWxab25lQXdhcmVDYWxsYmFjaywgdGFzay5vcHRpb25zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3VzdG9tU2NoZWR1bGVOb25HbG9iYWwgPSBmdW5jdGlvbih0YXNrOiBUYXNrKSB7XG4gICAgICBjaGVja0lzUGFzc2l2ZSh0YXNrKTtcbiAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwoXG4gICAgICAgICAgdGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3VzdG9tU2NoZWR1bGVQcmVwZW5kID0gZnVuY3Rpb24odGFzazogVGFzaykge1xuICAgICAgcmV0dXJuIG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyLmNhbGwoXG4gICAgICAgICAgdGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrRGF0YS5vcHRpb25zKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY3VzdG9tQ2FuY2VsTm9uR2xvYmFsID0gZnVuY3Rpb24odGFzazogYW55KSB7XG4gICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5jYWxsKHRhc2sudGFyZ2V0LCB0YXNrLmV2ZW50TmFtZSwgdGFzay5pbnZva2UsIHRhc2sub3B0aW9ucyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlID0gdXNlR2xvYmFsQ2FsbGJhY2sgPyBjdXN0b21TY2hlZHVsZUdsb2JhbCA6IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsO1xuICAgIGNvbnN0IGN1c3RvbUNhbmNlbCA9IHVzZUdsb2JhbENhbGxiYWNrID8gY3VzdG9tQ2FuY2VsR2xvYmFsIDogY3VzdG9tQ2FuY2VsTm9uR2xvYmFsO1xuXG4gICAgY29uc3QgY29tcGFyZVRhc2tDYWxsYmFja1ZzRGVsZWdhdGUgPSBmdW5jdGlvbih0YXNrOiBhbnksIGRlbGVnYXRlOiBhbnkpIHtcbiAgICAgIGNvbnN0IHR5cGVPZkRlbGVnYXRlID0gdHlwZW9mIGRlbGVnYXRlO1xuICAgICAgcmV0dXJuICh0eXBlT2ZEZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0YXNrLmNhbGxiYWNrID09PSBkZWxlZ2F0ZSkgfHxcbiAgICAgICAgICAodHlwZU9mRGVsZWdhdGUgPT09ICdvYmplY3QnICYmIHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA9PT0gZGVsZWdhdGUpO1xuICAgIH07XG5cbiAgICBjb25zdCBjb21wYXJlID1cbiAgICAgICAgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuZGlmZikgPyBwYXRjaE9wdGlvbnMuZGlmZiA6IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlO1xuXG4gICAgY29uc3QgYmxhY2tMaXN0ZWRFdmVudHM6IHN0cmluZ1tdID0gKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ0JMQUNLX0xJU1RFRF9FVkVOVFMnKV07XG5cbiAgICBjb25zdCBtYWtlQWRkTGlzdGVuZXIgPSBmdW5jdGlvbihcbiAgICAgICAgbmF0aXZlTGlzdGVuZXI6IGFueSwgYWRkU291cmNlOiBzdHJpbmcsIGN1c3RvbVNjaGVkdWxlRm46IGFueSwgY3VzdG9tQ2FuY2VsRm46IGFueSxcbiAgICAgICAgcmV0dXJuVGFyZ2V0ID0gZmFsc2UsIHByZXBlbmQgPSBmYWxzZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgICAgbGV0IGRlbGVnYXRlID0gYXJndW1lbnRzWzFdO1xuICAgICAgICBpZiAoIWRlbGVnYXRlKSB7XG4gICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGlzTm9kZSAmJiBldmVudE5hbWUgPT09ICd1bmNhdWdodEV4Y2VwdGlvbicpIHtcbiAgICAgICAgICAvLyBkb24ndCBwYXRjaCB1bmNhdWdodEV4Y2VwdGlvbiBvZiBub2RlanMgdG8gcHJldmVudCBlbmRsZXNzIGxvb3BcbiAgICAgICAgICByZXR1cm4gbmF0aXZlTGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGRvbid0IGNyZWF0ZSB0aGUgYmluZCBkZWxlZ2F0ZSBmdW5jdGlvbiBmb3IgaGFuZGxlRXZlbnRcbiAgICAgICAgLy8gY2FzZSBoZXJlIHRvIGltcHJvdmUgYWRkRXZlbnRMaXN0ZW5lciBwZXJmb3JtYW5jZVxuICAgICAgICAvLyB3ZSB3aWxsIGNyZWF0ZSB0aGUgYmluZCBkZWxlZ2F0ZSB3aGVuIGludm9rZVxuICAgICAgICBsZXQgaXNIYW5kbGVFdmVudCA9IGZhbHNlO1xuICAgICAgICBpZiAodHlwZW9mIGRlbGVnYXRlICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKCFkZWxlZ2F0ZS5oYW5kbGVFdmVudCkge1xuICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlzSGFuZGxlRXZlbnQgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHZhbGlkYXRlSGFuZGxlciAmJiAhdmFsaWRhdGVIYW5kbGVyKG5hdGl2ZUxpc3RlbmVyLCBkZWxlZ2F0ZSwgdGFyZ2V0LCBhcmd1bWVudHMpKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgICBpZiAoYmxhY2tMaXN0ZWRFdmVudHMpIHtcbiAgICAgICAgICAvLyBjaGVjayBibGFjayBsaXN0XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBibGFja0xpc3RlZEV2ZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSA9PT0gYmxhY2tMaXN0ZWRFdmVudHNbaV0pIHtcbiAgICAgICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGNhcHR1cmU7XG4gICAgICAgIGxldCBvbmNlID0gZmFsc2U7XG4gICAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBjYXB0dXJlID0gZmFsc2U7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICAgIGNhcHR1cmUgPSB0cnVlO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09IGZhbHNlKSB7XG4gICAgICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNhcHR1cmUgPSBvcHRpb25zID8gISFvcHRpb25zLmNhcHR1cmUgOiBmYWxzZTtcbiAgICAgICAgICBvbmNlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5vbmNlIDogZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB6b25lID0gWm9uZS5jdXJyZW50O1xuICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgbGV0IHN5bWJvbEV2ZW50TmFtZTtcbiAgICAgICAgaWYgKCFzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgLy8gdGhlIGNvZGUgaXMgZHVwbGljYXRlLCBidXQgSSBqdXN0IHdhbnQgdG8gZ2V0IHNvbWUgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgICAgICAgY29uc3QgZmFsc2VFdmVudE5hbWUgPVxuICAgICAgICAgICAgICAoZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKSArIEZBTFNFX1NUUjtcbiAgICAgICAgICBjb25zdCB0cnVlRXZlbnROYW1lID1cbiAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSkgKyBUUlVFX1NUUjtcbiAgICAgICAgICBjb25zdCBzeW1ib2wgPSBaT05FX1NZTUJPTF9QUkVGSVggKyBmYWxzZUV2ZW50TmFtZTtcbiAgICAgICAgICBjb25zdCBzeW1ib2xDYXB0dXJlID0gWk9ORV9TWU1CT0xfUFJFRklYICsgdHJ1ZUV2ZW50TmFtZTtcbiAgICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdID0ge307XG4gICAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXVtGQUxTRV9TVFJdID0gc3ltYm9sO1xuICAgICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bVFJVRV9TVFJdID0gc3ltYm9sQ2FwdHVyZTtcbiAgICAgICAgICBzeW1ib2xFdmVudE5hbWUgPSBjYXB0dXJlID8gc3ltYm9sQ2FwdHVyZSA6IHN5bWJvbDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW2NhcHR1cmUgPyBUUlVFX1NUUiA6IEZBTFNFX1NUUl07XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGV4aXN0aW5nVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgbGV0IGlzRXhpc3RpbmcgPSBmYWxzZTtcbiAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MpIHtcbiAgICAgICAgICAvLyBhbHJlYWR5IGhhdmUgdGFzayByZWdpc3RlcmVkXG4gICAgICAgICAgaXNFeGlzdGluZyA9IHRydWU7XG4gICAgICAgICAgaWYgKGNoZWNrRHVwbGljYXRlKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgaWYgKGNvbXBhcmUoZXhpc3RpbmdUYXNrc1tpXSwgZGVsZWdhdGUpKSB7XG4gICAgICAgICAgICAgICAgLy8gc2FtZSBjYWxsYmFjaywgc2FtZSBjYXB0dXJlLCBzYW1lIGV2ZW50IG5hbWUsIGp1c3QgcmV0dXJuXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGV4aXN0aW5nVGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXSA9IFtdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBzb3VyY2U7XG4gICAgICAgIGNvbnN0IGNvbnN0cnVjdG9yTmFtZSA9IHRhcmdldC5jb25zdHJ1Y3RvclsnbmFtZSddO1xuICAgICAgICBjb25zdCB0YXJnZXRTb3VyY2UgPSBnbG9iYWxTb3VyY2VzW2NvbnN0cnVjdG9yTmFtZV07XG4gICAgICAgIGlmICh0YXJnZXRTb3VyY2UpIHtcbiAgICAgICAgICBzb3VyY2UgPSB0YXJnZXRTb3VyY2VbZXZlbnROYW1lXTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXNvdXJjZSkge1xuICAgICAgICAgIHNvdXJjZSA9IGNvbnN0cnVjdG9yTmFtZSArIGFkZFNvdXJjZSArXG4gICAgICAgICAgICAgIChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpO1xuICAgICAgICB9XG4gICAgICAgIC8vIGRvIG5vdCBjcmVhdGUgYSBuZXcgb2JqZWN0IGFzIHRhc2suZGF0YSB0byBwYXNzIHRob3NlIHRoaW5nc1xuICAgICAgICAvLyBqdXN0IHVzZSB0aGUgZ2xvYmFsIHNoYXJlZCBvbmVcbiAgICAgICAgdGFza0RhdGEub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgLy8gaWYgYWRkRXZlbnRMaXN0ZW5lciB3aXRoIG9uY2Ugb3B0aW9ucywgd2UgZG9uJ3QgcGFzcyBpdCB0b1xuICAgICAgICAgIC8vIG5hdGl2ZSBhZGRFdmVudExpc3RlbmVyLCBpbnN0ZWFkIHdlIGtlZXAgdGhlIG9uY2Ugc2V0dGluZ1xuICAgICAgICAgIC8vIGFuZCBoYW5kbGUgb3Vyc2VsdmVzLlxuICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMub25jZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHRhc2tEYXRhLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdGFza0RhdGEuY2FwdHVyZSA9IGNhcHR1cmU7XG4gICAgICAgIHRhc2tEYXRhLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgdGFza0RhdGEuaXNFeGlzdGluZyA9IGlzRXhpc3Rpbmc7XG5cbiAgICAgICAgY29uc3QgZGF0YSA9IHVzZUdsb2JhbENhbGxiYWNrID8gT1BUSU1JWkVEX1pPTkVfRVZFTlRfVEFTS19EQVRBIDogdW5kZWZpbmVkO1xuXG4gICAgICAgIC8vIGtlZXAgdGFza0RhdGEgaW50byBkYXRhIHRvIGFsbG93IG9uU2NoZWR1bGVFdmVudFRhc2sgdG8gYWNjZXNzIHRoZSB0YXNrIGluZm9ybWF0aW9uXG4gICAgICAgIGlmIChkYXRhKSB7XG4gICAgICAgICAgKGRhdGEgYXMgYW55KS50YXNrRGF0YSA9IHRhc2tEYXRhO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGFzazogYW55ID1cbiAgICAgICAgICAgIHpvbmUuc2NoZWR1bGVFdmVudFRhc2soc291cmNlLCBkZWxlZ2F0ZSwgZGF0YSwgY3VzdG9tU2NoZWR1bGVGbiwgY3VzdG9tQ2FuY2VsRm4pO1xuXG4gICAgICAgIC8vIHNob3VsZCBjbGVhciB0YXNrRGF0YS50YXJnZXQgdG8gYXZvaWQgbWVtb3J5IGxlYWtcbiAgICAgICAgLy8gaXNzdWUsIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzIwNDQyXG4gICAgICAgIHRhc2tEYXRhLnRhcmdldCA9IG51bGw7XG5cbiAgICAgICAgLy8gbmVlZCB0byBjbGVhciB1cCB0YXNrRGF0YSBiZWNhdXNlIGl0IGlzIGEgZ2xvYmFsIG9iamVjdFxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIChkYXRhIGFzIGFueSkudGFza0RhdGEgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGF2ZSB0byBzYXZlIHRob3NlIGluZm9ybWF0aW9uIHRvIHRhc2sgaW4gY2FzZVxuICAgICAgICAvLyBhcHBsaWNhdGlvbiBtYXkgY2FsbCB0YXNrLnpvbmUuY2FuY2VsVGFzaygpIGRpcmVjdGx5XG4gICAgICAgIGlmIChvbmNlKSB7XG4gICAgICAgICAgb3B0aW9ucy5vbmNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoISghcGFzc2l2ZVN1cHBvcnRlZCAmJiB0eXBlb2YgdGFzay5vcHRpb25zID09PSAnYm9vbGVhbicpKSB7XG4gICAgICAgICAgLy8gaWYgbm90IHN1cHBvcnQgcGFzc2l2ZSwgYW5kIHdlIHBhc3MgYW4gb3B0aW9uIG9iamVjdFxuICAgICAgICAgIC8vIHRvIGFkZEV2ZW50TGlzdGVuZXIsIHdlIHNob3VsZCBzYXZlIHRoZSBvcHRpb25zIHRvIHRhc2tcbiAgICAgICAgICB0YXNrLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICB9XG4gICAgICAgIHRhc2sudGFyZ2V0ID0gdGFyZ2V0O1xuICAgICAgICB0YXNrLmNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICB0YXNrLmV2ZW50TmFtZSA9IGV2ZW50TmFtZTtcbiAgICAgICAgaWYgKGlzSGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAvLyBzYXZlIG9yaWdpbmFsIGRlbGVnYXRlIGZvciBjb21wYXJlIHRvIGNoZWNrIGR1cGxpY2F0ZVxuICAgICAgICAgICh0YXNrIGFzIGFueSkub3JpZ2luYWxEZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgICAgICB9XG4gICAgICAgIGlmICghcHJlcGVuZCkge1xuICAgICAgICAgIGV4aXN0aW5nVGFza3MucHVzaCh0YXNrKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGlzdGluZ1Rhc2tzLnVuc2hpZnQodGFzayk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocmV0dXJuVGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgcHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihcbiAgICAgICAgbmF0aXZlQWRkRXZlbnRMaXN0ZW5lciwgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCxcbiAgICAgICAgcmV0dXJuVGFyZ2V0KTtcbiAgICBpZiAobmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIHByb3RvW1BSRVBFTkRfRVZFTlRfTElTVEVORVJdID0gbWFrZUFkZExpc3RlbmVyKFxuICAgICAgICAgIG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyLCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSwgY3VzdG9tU2NoZWR1bGVQcmVwZW5kLFxuICAgICAgICAgIGN1c3RvbUNhbmNlbCwgcmV0dXJuVGFyZ2V0LCB0cnVlKTtcbiAgICB9XG5cbiAgICBwcm90b1tSRU1PVkVfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICBjb25zdCBvcHRpb25zID0gYXJndW1lbnRzWzJdO1xuXG4gICAgICBsZXQgY2FwdHVyZTtcbiAgICAgIGlmIChvcHRpb25zID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSB0cnVlKSB7XG4gICAgICAgIGNhcHR1cmUgPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSBmYWxzZSkge1xuICAgICAgICBjYXB0dXJlID0gZmFsc2U7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjYXB0dXJlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5jYXB0dXJlIDogZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGRlbGVnYXRlID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuXG4gICAgICBpZiAodmFsaWRhdGVIYW5kbGVyICYmXG4gICAgICAgICAgIXZhbGlkYXRlSGFuZGxlcihuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLCBkZWxlZ2F0ZSwgdGFyZ2V0LCBhcmd1bWVudHMpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICBsZXQgc3ltYm9sRXZlbnROYW1lO1xuICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tjYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgfVxuICAgICAgY29uc3QgZXhpc3RpbmdUYXNrcyA9IHN5bWJvbEV2ZW50TmFtZSAmJiB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgIGlmIChleGlzdGluZ1Rhc2tzKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZXhpc3RpbmdUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGNvbnN0IGV4aXN0aW5nVGFzayA9IGV4aXN0aW5nVGFza3NbaV07XG4gICAgICAgICAgaWYgKGNvbXBhcmUoZXhpc3RpbmdUYXNrLCBkZWxlZ2F0ZSkpIHtcbiAgICAgICAgICAgIGV4aXN0aW5nVGFza3Muc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgKGV4aXN0aW5nVGFzayBhcyBhbnkpLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICBpZiAoZXhpc3RpbmdUYXNrcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgLy8gYWxsIHRhc2tzIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSBoYXZlIGdvbmUsXG4gICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgIChleGlzdGluZ1Rhc2sgYXMgYW55KS5hbGxSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhpc3RpbmdUYXNrLnpvbmUuY2FuY2VsVGFzayhleGlzdGluZ1Rhc2spO1xuICAgICAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgICAgICByZXR1cm4gdGFyZ2V0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgLy8gaXNzdWUgOTMwLCBkaWRuJ3QgZmluZCB0aGUgZXZlbnQgbmFtZSBvciBjYWxsYmFja1xuICAgICAgLy8gZnJvbSB6b25lIGtlcHQgZXhpc3RpbmdUYXNrcywgdGhlIGNhbGxiYWNrIG1heWJlXG4gICAgICAvLyBhZGRlZCBvdXRzaWRlIG9mIHpvbmUsIHdlIG5lZWQgdG8gY2FsbCBuYXRpdmUgcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAgICAgLy8gdG8gdHJ5IHRvIHJlbW92ZSBpdC5cbiAgICAgIHJldHVybiBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcblxuICAgIHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0gPSBmdW5jdGlvbigpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IHRoaXMgfHwgX2dsb2JhbDtcbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcblxuICAgICAgY29uc3QgbGlzdGVuZXJzOiBhbnlbXSA9IFtdO1xuICAgICAgY29uc3QgdGFza3MgPVxuICAgICAgICAgIGZpbmRFdmVudFRhc2tzKHRhcmdldCwgZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBjb25zdCB0YXNrOiBhbnkgPSB0YXNrc1tpXTtcbiAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgbGlzdGVuZXJzLnB1c2goZGVsZWdhdGUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGxpc3RlbmVycztcbiAgICB9O1xuXG4gICAgcHJvdG9bUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG5cbiAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3VtZW50c1swXTtcbiAgICAgIGlmICghZXZlbnROYW1lKSB7XG4gICAgICAgIGNvbnN0IGtleXMgPSBPYmplY3Qua2V5cyh0YXJnZXQpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBwcm9wID0ga2V5c1tpXTtcbiAgICAgICAgICBjb25zdCBtYXRjaCA9IEVWRU5UX05BTUVfU1lNQk9MX1JFR1guZXhlYyhwcm9wKTtcbiAgICAgICAgICBsZXQgZXZ0TmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdO1xuICAgICAgICAgIC8vIGluIG5vZGVqcyBFdmVudEVtaXR0ZXIsIHJlbW92ZUxpc3RlbmVyIGV2ZW50IGlzXG4gICAgICAgICAgLy8gdXNlZCBmb3IgbW9uaXRvcmluZyB0aGUgcmVtb3ZlTGlzdGVuZXIgY2FsbCxcbiAgICAgICAgICAvLyBzbyBqdXN0IGtlZXAgcmVtb3ZlTGlzdGVuZXIgZXZlbnRMaXN0ZW5lciB1bnRpbFxuICAgICAgICAgIC8vIGFsbCBvdGhlciBldmVudExpc3RlbmVycyBhcmUgcmVtb3ZlZFxuICAgICAgICAgIGlmIChldnROYW1lICYmIGV2dE5hbWUgIT09ICdyZW1vdmVMaXN0ZW5lcicpIHtcbiAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZ0TmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIHJlbW92ZSByZW1vdmVMaXN0ZW5lciBsaXN0ZW5lciBmaW5hbGx5XG4gICAgICAgIHRoaXNbUkVNT1ZFX0FMTF9MSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWVzID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICBjb25zdCBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW0ZBTFNFX1NUUl07XG4gICAgICAgICAgY29uc3Qgc3ltYm9sQ2FwdHVyZUV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbVFJVRV9TVFJdO1xuXG4gICAgICAgICAgY29uc3QgdGFza3MgPSB0YXJnZXRbc3ltYm9sRXZlbnROYW1lXTtcbiAgICAgICAgICBjb25zdCBjYXB0dXJlVGFza3MgPSB0YXJnZXRbc3ltYm9sQ2FwdHVyZUV2ZW50TmFtZV07XG5cbiAgICAgICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVtb3ZlVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgY29uc3QgdGFzayA9IHJlbW92ZVRhc2tzW2ldO1xuICAgICAgICAgICAgICBsZXQgZGVsZWdhdGUgPSB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPyB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgOiB0YXNrLmNhbGxiYWNrO1xuICAgICAgICAgICAgICB0aGlzW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0uY2FsbCh0aGlzLCBldmVudE5hbWUsIGRlbGVnYXRlLCB0YXNrLm9wdGlvbnMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjYXB0dXJlVGFza3MpIHtcbiAgICAgICAgICAgIGNvbnN0IHJlbW92ZVRhc2tzID0gY2FwdHVyZVRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSByZW1vdmVUYXNrc1tpXTtcbiAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgdGFzay5vcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLy8gZm9yIG5hdGl2ZSB0b1N0cmluZyBwYXRjaFxuICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tBRERfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVBZGRFdmVudExpc3RlbmVyKTtcbiAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lcik7XG4gICAgaWYgKG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycykge1xuICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlUmVtb3ZlQWxsTGlzdGVuZXJzKTtcbiAgICB9XG4gICAgaWYgKG5hdGl2ZUxpc3RlbmVycykge1xuICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZUxpc3RlbmVycyk7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbGV0IHJlc3VsdHM6IGFueVtdID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYXBpcy5sZW5ndGg7IGkrKykge1xuICAgIHJlc3VsdHNbaV0gPSBwYXRjaEV2ZW50VGFyZ2V0TWV0aG9kcyhhcGlzW2ldLCBwYXRjaE9wdGlvbnMpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdHM7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaW5kRXZlbnRUYXNrcyh0YXJnZXQ6IGFueSwgZXZlbnROYW1lOiBzdHJpbmcpOiBUYXNrW10ge1xuICBjb25zdCBmb3VuZFRhc2tzOiBhbnlbXSA9IFtdO1xuICBmb3IgKGxldCBwcm9wIGluIHRhcmdldCkge1xuICAgIGNvbnN0IG1hdGNoID0gRVZFTlRfTkFNRV9TWU1CT0xfUkVHWC5leGVjKHByb3ApO1xuICAgIGxldCBldnROYW1lID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gICAgaWYgKGV2dE5hbWUgJiYgKCFldmVudE5hbWUgfHwgZXZ0TmFtZSA9PT0gZXZlbnROYW1lKSkge1xuICAgICAgY29uc3QgdGFza3M6IGFueSA9IHRhcmdldFtwcm9wXTtcbiAgICAgIGlmICh0YXNrcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgZm91bmRUYXNrcy5wdXNoKHRhc2tzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZm91bmRUYXNrcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRXZlbnRQcm90b3R5cGUoZ2xvYmFsOiBhbnksIGFwaTogX1pvbmVQcml2YXRlKSB7XG4gIGNvbnN0IEV2ZW50ID0gZ2xvYmFsWydFdmVudCddO1xuICBpZiAoRXZlbnQgJiYgRXZlbnQucHJvdG90eXBlKSB7XG4gICAgYXBpLnBhdGNoTWV0aG9kKFxuICAgICAgICBFdmVudC5wcm90b3R5cGUsICdzdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24nLFxuICAgICAgICAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbihzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSB7XG4gICAgICAgICAgc2VsZltJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MXSA9IHRydWU7XG4gICAgICAgICAgLy8gd2UgbmVlZCB0byBjYWxsIHRoZSBuYXRpdmUgc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXG4gICAgICAgICAgLy8gaW4gY2FzZSBpbiBzb21lIGh5YnJpZCBhcHBsaWNhdGlvbiwgc29tZSBwYXJ0IG9mXG4gICAgICAgICAgLy8gYXBwbGljYXRpb24gd2lsbCBiZSBjb250cm9sbGVkIGJ5IHpvbmUsIHNvbWUgYXJlIG5vdFxuICAgICAgICAgIGRlbGVnYXRlICYmIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgICAgICB9KTtcbiAgfVxufVxuIl19