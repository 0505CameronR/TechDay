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
import { ADD_EVENT_LISTENER_STR, attachOriginToPatched, FALSE_STR, isNode, ObjectGetPrototypeOf, REMOVE_EVENT_LISTENER_STR, TRUE_STR, ZONE_SYMBOL_PREFIX, zoneSymbol } from './utils';
let passiveSupported = false;
if (typeof window !== 'undefined') {
    try {
        const options = Object.defineProperty({}, 'passive', {
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
const OPTIMIZED_ZONE_EVENT_TASK_DATA = {
    useG: true
};
export const zoneSymbolEventNames = {};
export const globalSources = {};
const EVENT_NAME_SYMBOL_REGX = /^__zone_symbol__(\w+)(true|false)$/;
const IMMEDIATE_PROPAGATION_SYMBOL = ('__zone_symbol__propagationStopped');
export function patchEventTarget(_global, apis, patchOptions) {
    const ADD_EVENT_LISTENER = (patchOptions && patchOptions.add) || ADD_EVENT_LISTENER_STR;
    const REMOVE_EVENT_LISTENER = (patchOptions && patchOptions.rm) || REMOVE_EVENT_LISTENER_STR;
    const LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.listeners) || 'eventListeners';
    const REMOVE_ALL_LISTENERS_EVENT_LISTENER = (patchOptions && patchOptions.rmAll) || 'removeAllListeners';
    const zoneSymbolAddEventListener = zoneSymbol(ADD_EVENT_LISTENER);
    const ADD_EVENT_LISTENER_SOURCE = '.' + ADD_EVENT_LISTENER + ':';
    const PREPEND_EVENT_LISTENER = 'prependListener';
    const PREPEND_EVENT_LISTENER_SOURCE = '.' + PREPEND_EVENT_LISTENER + ':';
    const invokeTask = function (task, target, event) {
        // for better performance, check isRemoved which is set
        // by removeEventListener
        if (task.isRemoved) {
            return;
        }
        const delegate = task.callback;
        if (typeof delegate === 'object' && delegate.handleEvent) {
            // create the bind version of handleEvent when invoke
            task.callback = (event) => delegate.handleEvent(event);
            task.originalDelegate = delegate;
        }
        // invoke static task.invoke
        task.invoke(task, target, [event]);
        const options = task.options;
        if (options && typeof options === 'object' && options.once) {
            // if options.once is true, after invoke once remove listener here
            // only browser need to do this, nodejs eventEmitter will cal removeListener
            // inside EventEmitter.once
            const delegate = task.originalDelegate ? task.originalDelegate : task.callback;
            target[REMOVE_EVENT_LISTENER].call(target, event.type, delegate, options);
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = false
    const globalZoneAwareCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        const target = this || event.target || _global;
        const tasks = target[zoneSymbolEventNames[event.type][FALSE_STR]];
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
                const copyTasks = tasks.slice();
                for (let i = 0; i < copyTasks.length; i++) {
                    if (event && event[IMMEDIATE_PROPAGATION_SYMBOL] === true) {
                        break;
                    }
                    invokeTask(copyTasks[i], target, event);
                }
            }
        }
    };
    // global shared zoneAwareCallback to handle all event callback with capture = true
    const globalZoneAwareCaptureCallback = function (event) {
        // https://github.com/angular/zone.js/issues/911, in IE, sometimes
        // event will be undefined, so we need to use window.event
        event = event || _global.event;
        if (!event) {
            return;
        }
        // event.target is needed for Samsung TV and SourceBuffer
        // || global is needed https://github.com/angular/zone.js/issues/190
        const target = this || event.target || _global;
        const tasks = target[zoneSymbolEventNames[event.type][TRUE_STR]];
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
                const copyTasks = tasks.slice();
                for (let i = 0; i < copyTasks.length; i++) {
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
        let useGlobalCallback = true;
        if (patchOptions && patchOptions.useG !== undefined) {
            useGlobalCallback = patchOptions.useG;
        }
        const validateHandler = patchOptions && patchOptions.vh;
        let checkDuplicate = true;
        if (patchOptions && patchOptions.chkDup !== undefined) {
            checkDuplicate = patchOptions.chkDup;
        }
        let returnTarget = false;
        if (patchOptions && patchOptions.rt !== undefined) {
            returnTarget = patchOptions.rt;
        }
        let proto = obj;
        while (proto && !proto.hasOwnProperty(ADD_EVENT_LISTENER)) {
            proto = ObjectGetPrototypeOf(proto);
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
        const eventNameToString = patchOptions && patchOptions.eventNameToString;
        // a shared global taskData to pass data for scheduleEventTask
        // so we do not need to create a new object just for pass some data
        const taskData = {};
        const nativeAddEventListener = proto[zoneSymbolAddEventListener] = proto[ADD_EVENT_LISTENER];
        const nativeRemoveEventListener = proto[zoneSymbol(REMOVE_EVENT_LISTENER)] =
            proto[REMOVE_EVENT_LISTENER];
        const nativeListeners = proto[zoneSymbol(LISTENERS_EVENT_LISTENER)] =
            proto[LISTENERS_EVENT_LISTENER];
        const nativeRemoveAllListeners = proto[zoneSymbol(REMOVE_ALL_LISTENERS_EVENT_LISTENER)] =
            proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER];
        let nativePrependEventListener;
        if (patchOptions && patchOptions.prepend) {
            nativePrependEventListener = proto[zoneSymbol(patchOptions.prepend)] =
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
        const customScheduleGlobal = function (task) {
            // if there is already a task for the eventName + capture,
            // just return, because we use the shared globalZoneAwareCallback here.
            if (taskData.isExisting) {
                return;
            }
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, taskData.capture ? globalZoneAwareCaptureCallback : globalZoneAwareCallback, taskData.options);
        };
        const customCancelGlobal = function (task) {
            // if task is not marked as isRemoved, this call is directly
            // from Zone.prototype.cancelTask, we should remove the task
            // from tasksList of target first
            if (!task.isRemoved) {
                const symbolEventNames = zoneSymbolEventNames[task.eventName];
                let symbolEventName;
                if (symbolEventNames) {
                    symbolEventName = symbolEventNames[task.capture ? TRUE_STR : FALSE_STR];
                }
                const existingTasks = symbolEventName && task.target[symbolEventName];
                if (existingTasks) {
                    for (let i = 0; i < existingTasks.length; i++) {
                        const existingTask = existingTasks[i];
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
        const customScheduleNonGlobal = function (task) {
            checkIsPassive(task);
            return nativeAddEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        const customSchedulePrepend = function (task) {
            return nativePrependEventListener.call(taskData.target, taskData.eventName, task.invoke, taskData.options);
        };
        const customCancelNonGlobal = function (task) {
            return nativeRemoveEventListener.call(task.target, task.eventName, task.invoke, task.options);
        };
        const customSchedule = useGlobalCallback ? customScheduleGlobal : customScheduleNonGlobal;
        const customCancel = useGlobalCallback ? customCancelGlobal : customCancelNonGlobal;
        const compareTaskCallbackVsDelegate = function (task, delegate) {
            const typeOfDelegate = typeof delegate;
            return (typeOfDelegate === 'function' && task.callback === delegate) ||
                (typeOfDelegate === 'object' && task.originalDelegate === delegate);
        };
        const compare = (patchOptions && patchOptions.diff) ? patchOptions.diff : compareTaskCallbackVsDelegate;
        const blackListedEvents = Zone[Zone.__symbol__('BLACK_LISTED_EVENTS')];
        const makeAddListener = function (nativeListener, addSource, customScheduleFn, customCancelFn, returnTarget = false, prepend = false) {
            return function () {
                const target = this || _global;
                const eventName = arguments[0];
                let delegate = arguments[1];
                if (!delegate) {
                    return nativeListener.apply(this, arguments);
                }
                if (isNode && eventName === 'uncaughtException') {
                    // don't patch uncaughtException of nodejs to prevent endless loop
                    return nativeListener.apply(this, arguments);
                }
                // don't create the bind delegate function for handleEvent
                // case here to improve addEventListener performance
                // we will create the bind delegate when invoke
                let isHandleEvent = false;
                if (typeof delegate !== 'function') {
                    if (!delegate.handleEvent) {
                        return nativeListener.apply(this, arguments);
                    }
                    isHandleEvent = true;
                }
                if (validateHandler && !validateHandler(nativeListener, delegate, target, arguments)) {
                    return;
                }
                const options = arguments[2];
                if (blackListedEvents) {
                    // check black list
                    for (let i = 0; i < blackListedEvents.length; i++) {
                        if (eventName === blackListedEvents[i]) {
                            return nativeListener.apply(this, arguments);
                        }
                    }
                }
                let capture;
                let once = false;
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
                const zone = Zone.current;
                const symbolEventNames = zoneSymbolEventNames[eventName];
                let symbolEventName;
                if (!symbolEventNames) {
                    // the code is duplicate, but I just want to get some better performance
                    const falseEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + FALSE_STR;
                    const trueEventName = (eventNameToString ? eventNameToString(eventName) : eventName) + TRUE_STR;
                    const symbol = ZONE_SYMBOL_PREFIX + falseEventName;
                    const symbolCapture = ZONE_SYMBOL_PREFIX + trueEventName;
                    zoneSymbolEventNames[eventName] = {};
                    zoneSymbolEventNames[eventName][FALSE_STR] = symbol;
                    zoneSymbolEventNames[eventName][TRUE_STR] = symbolCapture;
                    symbolEventName = capture ? symbolCapture : symbol;
                }
                else {
                    symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
                }
                let existingTasks = target[symbolEventName];
                let isExisting = false;
                if (existingTasks) {
                    // already have task registered
                    isExisting = true;
                    if (checkDuplicate) {
                        for (let i = 0; i < existingTasks.length; i++) {
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
                let source;
                const constructorName = target.constructor['name'];
                const targetSource = globalSources[constructorName];
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
                const data = useGlobalCallback ? OPTIMIZED_ZONE_EVENT_TASK_DATA : undefined;
                // keep taskData into data to allow onScheduleEventTask to access the task information
                if (data) {
                    data.taskData = taskData;
                }
                const task = zone.scheduleEventTask(source, delegate, data, customScheduleFn, customCancelFn);
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
            const target = this || _global;
            const eventName = arguments[0];
            const options = arguments[2];
            let capture;
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
            const delegate = arguments[1];
            if (!delegate) {
                return nativeRemoveEventListener.apply(this, arguments);
            }
            if (validateHandler &&
                !validateHandler(nativeRemoveEventListener, delegate, target, arguments)) {
                return;
            }
            const symbolEventNames = zoneSymbolEventNames[eventName];
            let symbolEventName;
            if (symbolEventNames) {
                symbolEventName = symbolEventNames[capture ? TRUE_STR : FALSE_STR];
            }
            const existingTasks = symbolEventName && target[symbolEventName];
            if (existingTasks) {
                for (let i = 0; i < existingTasks.length; i++) {
                    const existingTask = existingTasks[i];
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
            const target = this || _global;
            const eventName = arguments[0];
            const listeners = [];
            const tasks = findEventTasks(target, eventNameToString ? eventNameToString(eventName) : eventName);
            for (let i = 0; i < tasks.length; i++) {
                const task = tasks[i];
                let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                listeners.push(delegate);
            }
            return listeners;
        };
        proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER] = function () {
            const target = this || _global;
            const eventName = arguments[0];
            if (!eventName) {
                const keys = Object.keys(target);
                for (let i = 0; i < keys.length; i++) {
                    const prop = keys[i];
                    const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
                    let evtName = match && match[1];
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
                const symbolEventNames = zoneSymbolEventNames[eventName];
                if (symbolEventNames) {
                    const symbolEventName = symbolEventNames[FALSE_STR];
                    const symbolCaptureEventName = symbolEventNames[TRUE_STR];
                    const tasks = target[symbolEventName];
                    const captureTasks = target[symbolCaptureEventName];
                    if (tasks) {
                        const removeTasks = tasks.slice();
                        for (let i = 0; i < removeTasks.length; i++) {
                            const task = removeTasks[i];
                            let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
                            this[REMOVE_EVENT_LISTENER].call(this, eventName, delegate, task.options);
                        }
                    }
                    if (captureTasks) {
                        const removeTasks = captureTasks.slice();
                        for (let i = 0; i < removeTasks.length; i++) {
                            const task = removeTasks[i];
                            let delegate = task.originalDelegate ? task.originalDelegate : task.callback;
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
        attachOriginToPatched(proto[ADD_EVENT_LISTENER], nativeAddEventListener);
        attachOriginToPatched(proto[REMOVE_EVENT_LISTENER], nativeRemoveEventListener);
        if (nativeRemoveAllListeners) {
            attachOriginToPatched(proto[REMOVE_ALL_LISTENERS_EVENT_LISTENER], nativeRemoveAllListeners);
        }
        if (nativeListeners) {
            attachOriginToPatched(proto[LISTENERS_EVENT_LISTENER], nativeListeners);
        }
        return true;
    }
    let results = [];
    for (let i = 0; i < apis.length; i++) {
        results[i] = patchEventTargetMethods(apis[i], patchOptions);
    }
    return results;
}
export function findEventTasks(target, eventName) {
    const foundTasks = [];
    for (let prop in target) {
        const match = EVENT_NAME_SYMBOL_REGX.exec(prop);
        let evtName = match && match[1];
        if (evtName && (!eventName || evtName === eventName)) {
            const tasks = target[prop];
            if (tasks) {
                for (let i = 0; i < tasks.length; i++) {
                    foundTasks.push(tasks[i]);
                }
            }
        }
    }
    return foundTasks;
}
export function patchEventPrototype(global, api) {
    const Event = global['Event'];
    if (Event && Event.prototype) {
        api.patchMethod(Event.prototype, 'stopImmediatePropagation', (delegate) => function (self, args) {
            self[IMMEDIATE_PROPAGATION_SYMBOL] = true;
            // we need to call the native stopImmediatePropagation
            // in case in some hybrid application, some part of
            // application will be controlled by zone, some are not
            delegate && delegate.apply(self, args);
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZXZlbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL2V2ZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsc0JBQXNCLEVBQUUscUJBQXFCLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSx5QkFBeUIsRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUsVUFBVSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBUXBMLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0FBRTdCLElBQUksT0FBTyxNQUFNLEtBQUssV0FBVyxFQUFFO0lBQ2pDLElBQUk7UUFDRixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUU7WUFDbkQsR0FBRyxFQUFFO2dCQUNILGdCQUFnQixHQUFHLElBQUksQ0FBQztZQUMxQixDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsTUFBTSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sRUFBRSxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDdEQ7SUFBQyxPQUFPLEdBQUcsRUFBRTtRQUNaLGdCQUFnQixHQUFHLEtBQUssQ0FBQztLQUMxQjtDQUNGO0FBRUQsb0VBQW9FO0FBQ3BFLE1BQU0sOEJBQThCLEdBQWtCO0lBQ3BELElBQUksRUFBRSxJQUFJO0NBQ1gsQ0FBQztBQUVGLE1BQU0sQ0FBQyxNQUFNLG9CQUFvQixHQUFRLEVBQUUsQ0FBQztBQUM1QyxNQUFNLENBQUMsTUFBTSxhQUFhLEdBQVEsRUFBRSxDQUFDO0FBRXJDLE1B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QUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNoRCxJQUFJLE9BQU8sR0FBRyxLQUFLLElBQUksS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksT0FBTyxJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksT0FBTyxLQUFLLFNBQVMsQ0FBQyxFQUFFO1lBQ3BELE1BQU0sS0FBSyxHQUFRLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNoQyxJQUFJLEtBQUssRUFBRTtnQkFDVCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtvQkFDckMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDM0I7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxPQUFPLFVBQVUsQ0FBQztBQUNwQixDQUFDO0FBRUQsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE1BQVcsRUFBRSxHQUFpQjtJQUNoRSxNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUIsSUFBSSxLQUFLLElBQUksS0FBSyxDQUFDLFNBQVMsRUFBRTtRQUM1QixHQUFHLENBQUMsV0FBVyxDQUNYLEtBQUssQ0FBQyxTQUFTLEVBQUUsMEJBQTBCLEVBQzNDLENBQUMsUUFBa0IsRUFBRSxFQUFFLENBQUMsVUFBUyxJQUFTLEVBQUUsSUFBVztZQUNyRCxJQUFJLENBQUMsNEJBQTRCLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDMUMsc0RBQXNEO1lBQ3RELG1EQUFtRDtZQUNuRCx1REFBdUQ7WUFDdkQsUUFBUSxJQUFJLFFBQVEsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0tBQ1I7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge21pc3NpbmdSZXF1aXJlfVxuICovXG5cbmltcG9ydCB7QUREX0VWRU5UX0xJU1RFTkVSX1NUUiwgYXR0YWNoT3JpZ2luVG9QYXRjaGVkLCBGQUxTRV9TVFIsIGlzTm9kZSwgT2JqZWN0R2V0UHJvdG90eXBlT2YsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIsIFRSVUVfU1RSLCBaT05FX1NZTUJPTF9QUkVGSVgsIHpvbmVTeW1ib2x9IGZyb20gJy4vdXRpbHMnO1xuXG4vKiogQGludGVybmFsICoqL1xuaW50ZXJmYWNlIEV2ZW50VGFza0RhdGEgZXh0ZW5kcyBUYXNrRGF0YSB7XG4gIC8vIHVzZSBnbG9iYWwgY2FsbGJhY2sgb3Igbm90XG4gIHJlYWRvbmx5IHVzZUc/OiBib29sZWFuO1xufVxuXG5sZXQgcGFzc2l2ZVN1cHBvcnRlZCA9IGZhbHNlO1xuXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvcHRpb25zID0gT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAncGFzc2l2ZScsIHtcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHBhc3NpdmVTdXBwb3J0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Rlc3QnLCBvcHRpb25zLCBvcHRpb25zKTtcbiAgICB3aW5kb3cucmVtb3ZlRXZlbnRMaXN0ZW5lcigndGVzdCcsIG9wdGlvbnMsIG9wdGlvbnMpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgICBwYXNzaXZlU3VwcG9ydGVkID0gZmFsc2U7XG4gIH1cbn1cblxuLy8gYW4gaWRlbnRpZmllciB0byB0ZWxsIFpvbmVUYXNrIGRvIG5vdCBjcmVhdGUgYSBuZXcgaW52b2tlIGNsb3N1cmVcbmNvbnN0IE9QVElNSVpFRF9aT05FX0VWRU5UX1RBU0tfREFUQTogRXZlbnRUYXNrRGF0YSA9IHtcbiAgdXNlRzogdHJ1ZVxufTtcblxuZXhwb3J0IGNvbnN0IHpvbmVTeW1ib2xFdmVudE5hbWVzOiBhbnkgPSB7fTtcbmV4cG9ydCBjb25zdCBnbG9iYWxTb3VyY2VzOiBhbnkgPSB7fTtcblxuY29uc3QgRVZFTlRfTkFNRV9TWU1CT0xfUkVHWCA9IC9eX196b25lX3N5bWJvbF9fKFxcdyspKHRydWV8ZmFsc2UpJC87XG5jb25zdCBJTU1FRElBVEVfUFJPUEFHQVRJT05fU1lNQk9MID0gKCdfX3pvbmVfc3ltYm9sX19wcm9wYWdhdGlvblN0b3BwZWQnKTtcblxuZXhwb3J0IGludGVyZmFjZSBQYXRjaEV2ZW50VGFyZ2V0T3B0aW9ucyB7XG4gIC8vIHZhbGlkYXRlSGFuZGxlclxuICB2aD86IChuYXRpdmVEZWxlZ2F0ZTogYW55LCBkZWxlZ2F0ZTogYW55LCB0YXJnZXQ6IGFueSwgYXJnczogYW55KSA9PiBib29sZWFuO1xuICAvLyBhZGRFdmVudExpc3RlbmVyIGZ1bmN0aW9uIG5hbWVcbiAgYWRkPzogc3RyaW5nO1xuICAvLyByZW1vdmVFdmVudExpc3RlbmVyIGZ1bmN0aW9uIG5hbWVcbiAgcm0/OiBzdHJpbmc7XG4gIC8vIHByZXBlbmRFdmVudExpc3RlbmVyIGZ1bmN0aW9uIG5hbWVcbiAgcHJlcGVuZD86IHN0cmluZztcbiAgLy8gbGlzdGVuZXJzIGZ1bmN0aW9uIG5hbWVcbiAgbGlzdGVuZXJzPzogc3RyaW5nO1xuICAvLyByZW1vdmVBbGxMaXN0ZW5lcnMgZnVuY3Rpb24gbmFtZVxuICBybUFsbD86IHN0cmluZztcbiAgLy8gdXNlR2xvYmFsQ2FsbGJhY2sgZmxhZ1xuICB1c2VHPzogYm9vbGVhbjtcbiAgLy8gY2hlY2sgZHVwbGljYXRlIGZsYWcgd2hlbiBhZGRFdmVudExpc3RlbmVyXG4gIGNoa0R1cD86IGJvb2xlYW47XG4gIC8vIHJldHVybiB0YXJnZXQgZmxhZyB3aGVuIGFkZEV2ZW50TGlzdGVuZXJcbiAgcnQ/OiBib29sZWFuO1xuICAvLyBldmVudCBjb21wYXJlIGhhbmRsZXJcbiAgZGlmZj86ICh0YXNrOiBhbnksIGRlbGVnYXRlOiBhbnkpID0+IGJvb2xlYW47XG4gIC8vIHN1cHBvcnQgcGFzc2l2ZSBvciBub3RcbiAgc3VwcG9ydFBhc3NpdmU/OiBib29sZWFuO1xuICAvLyBnZXQgc3RyaW5nIGZyb20gZXZlbnROYW1lIChpbiBub2RlanMsIGV2ZW50TmFtZSBtYXliZSBTeW1ib2wpXG4gIGV2ZW50TmFtZVRvU3RyaW5nPzogKGV2ZW50TmFtZTogYW55KSA9PiBzdHJpbmc7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaEV2ZW50VGFyZ2V0KFxuICAgIF9nbG9iYWw6IGFueSwgYXBpczogYW55W10sIHBhdGNoT3B0aW9ucz86IFBhdGNoRXZlbnRUYXJnZXRPcHRpb25zKSB7XG4gIGNvbnN0IEFERF9FVkVOVF9MSVNURU5FUiA9IChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmFkZCkgfHwgQUREX0VWRU5UX0xJU1RFTkVSX1NUUjtcbiAgY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucm0pIHx8IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFI7XG5cbiAgY29uc3QgTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSID0gKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMubGlzdGVuZXJzKSB8fCAnZXZlbnRMaXN0ZW5lcnMnO1xuICBjb25zdCBSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUiA9XG4gICAgICAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5ybUFsbCkgfHwgJ3JlbW92ZUFsbExpc3RlbmVycyc7XG5cbiAgY29uc3Qgem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXIgPSB6b25lU3ltYm9sKEFERF9FVkVOVF9MSVNURU5FUik7XG5cbiAgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSX1NPVVJDRSA9ICcuJyArIEFERF9FVkVOVF9MSVNURU5FUiArICc6JztcblxuICBjb25zdCBQUkVQRU5EX0VWRU5UX0xJU1RFTkVSID0gJ3ByZXBlbmRMaXN0ZW5lcic7XG4gIGNvbnN0IFBSRVBFTkRfRVZFTlRfTElTVEVORVJfU09VUkNFID0gJy4nICsgUFJFUEVORF9FVkVOVF9MSVNURU5FUiArICc6JztcblxuICBjb25zdCBpbnZva2VUYXNrID0gZnVuY3Rpb24odGFzazogYW55LCB0YXJnZXQ6IGFueSwgZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gZm9yIGJldHRlciBwZXJmb3JtYW5jZSwgY2hlY2sgaXNSZW1vdmVkIHdoaWNoIGlzIHNldFxuICAgIC8vIGJ5IHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICBpZiAodGFzay5pc1JlbW92ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGVsZWdhdGUgPSB0YXNrLmNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2YgZGVsZWdhdGUgPT09ICdvYmplY3QnICYmIGRlbGVnYXRlLmhhbmRsZUV2ZW50KSB7XG4gICAgICAvLyBjcmVhdGUgdGhlIGJpbmQgdmVyc2lvbiBvZiBoYW5kbGVFdmVudCB3aGVuIGludm9rZVxuICAgICAgdGFzay5jYWxsYmFjayA9IChldmVudDogRXZlbnQpID0+IGRlbGVnYXRlLmhhbmRsZUV2ZW50KGV2ZW50KTtcbiAgICAgIHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA9IGRlbGVnYXRlO1xuICAgIH1cbiAgICAvLyBpbnZva2Ugc3RhdGljIHRhc2suaW52b2tlXG4gICAgdGFzay5pbnZva2UodGFzaywgdGFyZ2V0LCBbZXZlbnRdKTtcbiAgICBjb25zdCBvcHRpb25zID0gdGFzay5vcHRpb25zO1xuICAgIGlmIChvcHRpb25zICYmIHR5cGVvZiBvcHRpb25zID09PSAnb2JqZWN0JyAmJiBvcHRpb25zLm9uY2UpIHtcbiAgICAgIC8vIGlmIG9wdGlvbnMub25jZSBpcyB0cnVlLCBhZnRlciBpbnZva2Ugb25jZSByZW1vdmUgbGlzdGVuZXIgaGVyZVxuICAgICAgLy8gb25seSBicm93c2VyIG5lZWQgdG8gZG8gdGhpcywgbm9kZWpzIGV2ZW50RW1pdHRlciB3aWxsIGNhbCByZW1vdmVMaXN0ZW5lclxuICAgICAgLy8gaW5zaWRlIEV2ZW50RW1pdHRlci5vbmNlXG4gICAgICBjb25zdCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICB0YXJnZXRbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRhcmdldCwgZXZlbnQudHlwZSwgZGVsZWdhdGUsIG9wdGlvbnMpO1xuICAgIH1cbiAgfTtcblxuICAvLyBnbG9iYWwgc2hhcmVkIHpvbmVBd2FyZUNhbGxiYWNrIHRvIGhhbmRsZSBhbGwgZXZlbnQgY2FsbGJhY2sgd2l0aCBjYXB0dXJlID0gZmFsc2VcbiAgY29uc3QgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgPSBmdW5jdGlvbihldmVudDogRXZlbnQpIHtcbiAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy85MTEsIGluIElFLCBzb21ldGltZXNcbiAgICAvLyBldmVudCB3aWxsIGJlIHVuZGVmaW5lZCwgc28gd2UgbmVlZCB0byB1c2Ugd2luZG93LmV2ZW50XG4gICAgZXZlbnQgPSBldmVudCB8fCBfZ2xvYmFsLmV2ZW50O1xuICAgIGlmICghZXZlbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgLy8gZXZlbnQudGFyZ2V0IGlzIG5lZWRlZCBmb3IgU2Ftc3VuZyBUViBhbmQgU291cmNlQnVmZmVyXG4gICAgLy8gfHwgZ2xvYmFsIGlzIG5lZWRlZCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy8xOTBcbiAgICBjb25zdCB0YXJnZXQ6IGFueSA9IHRoaXMgfHwgZXZlbnQudGFyZ2V0IHx8IF9nbG9iYWw7XG4gICAgY29uc3QgdGFza3MgPSB0YXJnZXRbem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnQudHlwZV1bRkFMU0VfU1RSXV07XG4gICAgaWYgKHRhc2tzKSB7XG4gICAgICAvLyBpbnZva2UgYWxsIHRhc2tzIHdoaWNoIGF0dGFjaGVkIHRvIGN1cnJlbnQgdGFyZ2V0IHdpdGggZ2l2ZW4gZXZlbnQudHlwZSBhbmQgY2FwdHVyZSA9IGZhbHNlXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgaWYgdGFzay5sZW5ndGggPT09IDEsIGp1c3QgaW52b2tlXG4gICAgICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGludm9rZVRhc2sodGFza3NbMF0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvODM2XG4gICAgICAgIC8vIGNvcHkgdGhlIHRhc2tzIGFycmF5IGJlZm9yZSBpbnZva2UsIHRvIGF2b2lkXG4gICAgICAgIC8vIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgb3Igb3RoZXIgbGlzdGVuZXJcbiAgICAgICAgY29uc3QgY29weVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5VGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZXZlbnQgJiYgKGV2ZW50IGFzIGFueSlbSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTF0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnZva2VUYXNrKGNvcHlUYXNrc1tpXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgLy8gZ2xvYmFsIHNoYXJlZCB6b25lQXdhcmVDYWxsYmFjayB0byBoYW5kbGUgYWxsIGV2ZW50IGNhbGxiYWNrIHdpdGggY2FwdHVyZSA9IHRydWVcbiAgY29uc3QgZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrID0gZnVuY3Rpb24oZXZlbnQ6IEV2ZW50KSB7XG4gICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvOTExLCBpbiBJRSwgc29tZXRpbWVzXG4gICAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICAgIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgICBpZiAoIWV2ZW50KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIC8vIGV2ZW50LnRhcmdldCBpcyBuZWVkZWQgZm9yIFNhbXN1bmcgVFYgYW5kIFNvdXJjZUJ1ZmZlclxuICAgIC8vIHx8IGdsb2JhbCBpcyBuZWVkZWQgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvMTkwXG4gICAgY29uc3QgdGFyZ2V0OiBhbnkgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3pvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdW1RSVUVfU1RSXV07XG4gICAgaWYgKHRhc2tzKSB7XG4gICAgICAvLyBpbnZva2UgYWxsIHRhc2tzIHdoaWNoIGF0dGFjaGVkIHRvIGN1cnJlbnQgdGFyZ2V0IHdpdGggZ2l2ZW4gZXZlbnQudHlwZSBhbmQgY2FwdHVyZSA9IGZhbHNlXG4gICAgICAvLyBmb3IgcGVyZm9ybWFuY2UgY29uY2VybiwgaWYgdGFzay5sZW5ndGggPT09IDEsIGp1c3QgaW52b2tlXG4gICAgICBpZiAodGFza3MubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIGludm9rZVRhc2sodGFza3NbMF0sIHRhcmdldCwgZXZlbnQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvODM2XG4gICAgICAgIC8vIGNvcHkgdGhlIHRhc2tzIGFycmF5IGJlZm9yZSBpbnZva2UsIHRvIGF2b2lkXG4gICAgICAgIC8vIHRoZSBjYWxsYmFjayB3aWxsIHJlbW92ZSBpdHNlbGYgb3Igb3RoZXIgbGlzdGVuZXJcbiAgICAgICAgY29uc3QgY29weVRhc2tzID0gdGFza3Muc2xpY2UoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjb3B5VGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAoZXZlbnQgJiYgKGV2ZW50IGFzIGFueSlbSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTF0gPT09IHRydWUpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpbnZva2VUYXNrKGNvcHlUYXNrc1tpXSwgdGFyZ2V0LCBldmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG5cbiAgZnVuY3Rpb24gcGF0Y2hFdmVudFRhcmdldE1ldGhvZHMob2JqOiBhbnksIHBhdGNoT3B0aW9ucz86IFBhdGNoRXZlbnRUYXJnZXRPcHRpb25zKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBsZXQgdXNlR2xvYmFsQ2FsbGJhY2sgPSB0cnVlO1xuICAgIGlmIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLnVzZUcgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdXNlR2xvYmFsQ2FsbGJhY2sgPSBwYXRjaE9wdGlvbnMudXNlRztcbiAgICB9XG4gICAgY29uc3QgdmFsaWRhdGVIYW5kbGVyID0gcGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy52aDtcblxuICAgIGxldCBjaGVja0R1cGxpY2F0ZSA9IHRydWU7XG4gICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuY2hrRHVwICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNoZWNrRHVwbGljYXRlID0gcGF0Y2hPcHRpb25zLmNoa0R1cDtcbiAgICB9XG5cbiAgICBsZXQgcmV0dXJuVGFyZ2V0ID0gZmFsc2U7XG4gICAgaWYgKHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMucnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuVGFyZ2V0ID0gcGF0Y2hPcHRpb25zLnJ0O1xuICAgIH1cblxuICAgIGxldCBwcm90byA9IG9iajtcbiAgICB3aGlsZSAocHJvdG8gJiYgIXByb3RvLmhhc093blByb3BlcnR5KEFERF9FVkVOVF9MSVNURU5FUikpIHtcbiAgICAgIHByb3RvID0gT2JqZWN0R2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICAgIH1cbiAgICBpZiAoIXByb3RvICYmIG9ialtBRERfRVZFTlRfTElTVEVORVJdKSB7XG4gICAgICAvLyBzb21laG93IHdlIGRpZCBub3QgZmluZCBpdCwgYnV0IHdlIGNhbiBzZWUgaXQuIFRoaXMgaGFwcGVucyBvbiBJRSBmb3IgV2luZG93IHByb3BlcnRpZXMuXG4gICAgICBwcm90byA9IG9iajtcbiAgICB9XG5cbiAgICBpZiAoIXByb3RvKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGlmIChwcm90b1t6b25lU3ltYm9sQWRkRXZlbnRMaXN0ZW5lcl0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICBjb25zdCBldmVudE5hbWVUb1N0cmluZyA9IHBhdGNoT3B0aW9ucyAmJiBwYXRjaE9wdGlvbnMuZXZlbnROYW1lVG9TdHJpbmc7XG5cbiAgICAvLyBhIHNoYXJlZCBnbG9iYWwgdGFza0RhdGEgdG8gcGFzcyBkYXRhIGZvciBzY2hlZHVsZUV2ZW50VGFza1xuICAgIC8vIHNvIHdlIGRvIG5vdCBuZWVkIHRvIGNyZWF0ZSBhIG5ldyBvYmplY3QganVzdCBmb3IgcGFzcyBzb21lIGRhdGFcbiAgICBjb25zdCB0YXNrRGF0YTogYW55ID0ge307XG5cbiAgICBjb25zdCBuYXRpdmVBZGRFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbEFkZEV2ZW50TGlzdGVuZXJdID0gcHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXTtcbiAgICBjb25zdCBuYXRpdmVSZW1vdmVFdmVudExpc3RlbmVyID0gcHJvdG9bem9uZVN5bWJvbChSRU1PVkVfRVZFTlRfTElTVEVORVIpXSA9XG4gICAgICAgIHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl07XG5cbiAgICBjb25zdCBuYXRpdmVMaXN0ZW5lcnMgPSBwcm90b1t6b25lU3ltYm9sKExJU1RFTkVSU19FVkVOVF9MSVNURU5FUildID1cbiAgICAgICAgcHJvdG9bTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXTtcbiAgICBjb25zdCBuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMgPSBwcm90b1t6b25lU3ltYm9sKFJFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSKV0gPVxuICAgICAgICBwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl07XG5cbiAgICBsZXQgbmF0aXZlUHJlcGVuZEV2ZW50TGlzdGVuZXI6IGFueTtcbiAgICBpZiAocGF0Y2hPcHRpb25zICYmIHBhdGNoT3B0aW9ucy5wcmVwZW5kKSB7XG4gICAgICBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lciA9IHByb3RvW3pvbmVTeW1ib2wocGF0Y2hPcHRpb25zLnByZXBlbmQpXSA9XG4gICAgICAgICAgcHJvdG9bcGF0Y2hPcHRpb25zLnByZXBlbmRdO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNoZWNrSXNQYXNzaXZlKHRhc2s6IFRhc2spIHtcbiAgICAgIGlmICghcGFzc2l2ZVN1cHBvcnRlZCAmJiB0eXBlb2YgdGFza0RhdGEub3B0aW9ucyAhPT0gJ2Jvb2xlYW4nICYmXG4gICAgICAgICAgdHlwZW9mIHRhc2tEYXRhLm9wdGlvbnMgIT09ICd1bmRlZmluZWQnICYmIHRhc2tEYXRhLm9wdGlvbnMgIT09IG51bGwpIHtcbiAgICAgICAgLy8gb3B0aW9ucyBpcyBhIG5vbi1udWxsIG5vbi11bmRlZmluZWQgb2JqZWN0XG4gICAgICAgIC8vIHBhc3NpdmUgaXMgbm90IHN1cHBvcnRlZFxuICAgICAgICAvLyBkb24ndCBwYXNzIG9wdGlvbnMgYXMgb2JqZWN0XG4gICAgICAgIC8vIGp1c3QgcGFzcyBjYXB0dXJlIGFzIGEgYm9vbGVhblxuICAgICAgICAodGFzayBhcyBhbnkpLm9wdGlvbnMgPSAhIXRhc2tEYXRhLm9wdGlvbnMuY2FwdHVyZTtcbiAgICAgICAgdGFza0RhdGEub3B0aW9ucyA9ICh0YXNrIGFzIGFueSkub3B0aW9ucztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBjb25zdCBjdXN0b21TY2hlZHVsZUdsb2JhbCA9IGZ1bmN0aW9uKHRhc2s6IFRhc2spIHtcbiAgICAgIC8vIGlmIHRoZXJlIGlzIGFscmVhZHkgYSB0YXNrIGZvciB0aGUgZXZlbnROYW1lICsgY2FwdHVyZSxcbiAgICAgIC8vIGp1c3QgcmV0dXJuLCBiZWNhdXNlIHdlIHVzZSB0aGUgc2hhcmVkIGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrIGhlcmUuXG4gICAgICBpZiAodGFza0RhdGEuaXNFeGlzdGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjaGVja0lzUGFzc2l2ZSh0YXNrKTtcbiAgICAgIHJldHVybiBuYXRpdmVBZGRFdmVudExpc3RlbmVyLmNhbGwoXG4gICAgICAgICAgdGFza0RhdGEudGFyZ2V0LCB0YXNrRGF0YS5ldmVudE5hbWUsXG4gICAgICAgICAgdGFza0RhdGEuY2FwdHVyZSA/IGdsb2JhbFpvbmVBd2FyZUNhcHR1cmVDYWxsYmFjayA6IGdsb2JhbFpvbmVBd2FyZUNhbGxiYWNrLFxuICAgICAgICAgIHRhc2tEYXRhLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjdXN0b21DYW5jZWxHbG9iYWwgPSBmdW5jdGlvbih0YXNrOiBhbnkpIHtcbiAgICAgIC8vIGlmIHRhc2sgaXMgbm90IG1hcmtlZCBhcyBpc1JlbW92ZWQsIHRoaXMgY2FsbCBpcyBkaXJlY3RseVxuICAgICAgLy8gZnJvbSBab25lLnByb3RvdHlwZS5jYW5jZWxUYXNrLCB3ZSBzaG91bGQgcmVtb3ZlIHRoZSB0YXNrXG4gICAgICAvLyBmcm9tIHRhc2tzTGlzdCBvZiB0YXJnZXQgZmlyc3RcbiAgICAgIGlmICghdGFzay5pc1JlbW92ZWQpIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW3Rhc2suZXZlbnROYW1lXTtcbiAgICAgICAgbGV0IHN5bWJvbEV2ZW50TmFtZTtcbiAgICAgICAgaWYgKHN5bWJvbEV2ZW50TmFtZXMpIHtcbiAgICAgICAgICBzeW1ib2xFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW3Rhc2suY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2tzID0gc3ltYm9sRXZlbnROYW1lICYmIHRhc2sudGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgIGlmIChleGlzdGluZ1Rhc2tzKSB7XG4gICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2sgPSBleGlzdGluZ1Rhc2tzW2ldO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFzayA9PT0gdGFzaykge1xuICAgICAgICAgICAgICBleGlzdGluZ1Rhc2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgICAgLy8gc2V0IGlzUmVtb3ZlZCB0byBkYXRhIGZvciBmYXN0ZXIgaW52b2tlVGFzayBjaGVja1xuICAgICAgICAgICAgICB0YXNrLmlzUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgIGlmIChleGlzdGluZ1Rhc2tzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBnbG9iYWxab25lQXdhcmVDYWxsYmFjayBhbmQgcmVtb3ZlIHRoZSB0YXNrIGNhY2hlIGZyb20gdGFyZ2V0XG4gICAgICAgICAgICAgICAgdGFzay5hbGxSZW1vdmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0YXNrLnRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlmIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgLy8gd2Ugd2lsbCByZWFsbHkgcmVtb3ZlIHRoZSBnbG9iYWwgZXZlbnQgY2FsbGJhY2ssXG4gICAgICAvLyBpZiBub3QsIHJldHVyblxuICAgICAgaWYgKCF0YXNrLmFsbFJlbW92ZWQpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbChcbiAgICAgICAgICB0YXNrLnRhcmdldCwgdGFzay5ldmVudE5hbWUsXG4gICAgICAgICAgdGFzay5jYXB0dXJlID8gZ2xvYmFsWm9uZUF3YXJlQ2FwdHVyZUNhbGxiYWNrIDogZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2ssIHRhc2sub3B0aW9ucyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlTm9uR2xvYmFsID0gZnVuY3Rpb24odGFzazogVGFzaykge1xuICAgICAgY2hlY2tJc1Bhc3NpdmUodGFzayk7XG4gICAgICByZXR1cm4gbmF0aXZlQWRkRXZlbnRMaXN0ZW5lci5jYWxsKFxuICAgICAgICAgIHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN1c3RvbVNjaGVkdWxlUHJlcGVuZCA9IGZ1bmN0aW9uKHRhc2s6IFRhc2spIHtcbiAgICAgIHJldHVybiBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lci5jYWxsKFxuICAgICAgICAgIHRhc2tEYXRhLnRhcmdldCwgdGFza0RhdGEuZXZlbnROYW1lLCB0YXNrLmludm9rZSwgdGFza0RhdGEub3B0aW9ucyk7XG4gICAgfTtcblxuICAgIGNvbnN0IGN1c3RvbUNhbmNlbE5vbkdsb2JhbCA9IGZ1bmN0aW9uKHRhc2s6IGFueSkge1xuICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuY2FsbCh0YXNrLnRhcmdldCwgdGFzay5ldmVudE5hbWUsIHRhc2suaW52b2tlLCB0YXNrLm9wdGlvbnMpO1xuICAgIH07XG5cbiAgICBjb25zdCBjdXN0b21TY2hlZHVsZSA9IHVzZUdsb2JhbENhbGxiYWNrID8gY3VzdG9tU2NoZWR1bGVHbG9iYWwgOiBjdXN0b21TY2hlZHVsZU5vbkdsb2JhbDtcbiAgICBjb25zdCBjdXN0b21DYW5jZWwgPSB1c2VHbG9iYWxDYWxsYmFjayA/IGN1c3RvbUNhbmNlbEdsb2JhbCA6IGN1c3RvbUNhbmNlbE5vbkdsb2JhbDtcblxuICAgIGNvbnN0IGNvbXBhcmVUYXNrQ2FsbGJhY2tWc0RlbGVnYXRlID0gZnVuY3Rpb24odGFzazogYW55LCBkZWxlZ2F0ZTogYW55KSB7XG4gICAgICBjb25zdCB0eXBlT2ZEZWxlZ2F0ZSA9IHR5cGVvZiBkZWxlZ2F0ZTtcbiAgICAgIHJldHVybiAodHlwZU9mRGVsZWdhdGUgPT09ICdmdW5jdGlvbicgJiYgdGFzay5jYWxsYmFjayA9PT0gZGVsZWdhdGUpIHx8XG4gICAgICAgICAgKHR5cGVPZkRlbGVnYXRlID09PSAnb2JqZWN0JyAmJiB0YXNrLm9yaWdpbmFsRGVsZWdhdGUgPT09IGRlbGVnYXRlKTtcbiAgICB9O1xuXG4gICAgY29uc3QgY29tcGFyZSA9XG4gICAgICAgIChwYXRjaE9wdGlvbnMgJiYgcGF0Y2hPcHRpb25zLmRpZmYpID8gcGF0Y2hPcHRpb25zLmRpZmYgOiBjb21wYXJlVGFza0NhbGxiYWNrVnNEZWxlZ2F0ZTtcblxuICAgIGNvbnN0IGJsYWNrTGlzdGVkRXZlbnRzOiBzdHJpbmdbXSA9IChab25lIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdCTEFDS19MSVNURURfRVZFTlRTJyldO1xuXG4gICAgY29uc3QgbWFrZUFkZExpc3RlbmVyID0gZnVuY3Rpb24oXG4gICAgICAgIG5hdGl2ZUxpc3RlbmVyOiBhbnksIGFkZFNvdXJjZTogc3RyaW5nLCBjdXN0b21TY2hlZHVsZUZuOiBhbnksIGN1c3RvbUNhbmNlbEZuOiBhbnksXG4gICAgICAgIHJldHVyblRhcmdldCA9IGZhbHNlLCBwcmVwZW5kID0gZmFsc2UpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgICBjb25zdCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICAgIGxldCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKCFkZWxlZ2F0ZSkge1xuICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpc05vZGUgJiYgZXZlbnROYW1lID09PSAndW5jYXVnaHRFeGNlcHRpb24nKSB7XG4gICAgICAgICAgLy8gZG9uJ3QgcGF0Y2ggdW5jYXVnaHRFeGNlcHRpb24gb2Ygbm9kZWpzIHRvIHByZXZlbnQgZW5kbGVzcyBsb29wXG4gICAgICAgICAgcmV0dXJuIG5hdGl2ZUxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkb24ndCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgZnVuY3Rpb24gZm9yIGhhbmRsZUV2ZW50XG4gICAgICAgIC8vIGNhc2UgaGVyZSB0byBpbXByb3ZlIGFkZEV2ZW50TGlzdGVuZXIgcGVyZm9ybWFuY2VcbiAgICAgICAgLy8gd2Ugd2lsbCBjcmVhdGUgdGhlIGJpbmQgZGVsZWdhdGUgd2hlbiBpbnZva2VcbiAgICAgICAgbGV0IGlzSGFuZGxlRXZlbnQgPSBmYWxzZTtcbiAgICAgICAgaWYgKHR5cGVvZiBkZWxlZ2F0ZSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmICghZGVsZWdhdGUuaGFuZGxlRXZlbnQpIHtcbiAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpc0hhbmRsZUV2ZW50ID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh2YWxpZGF0ZUhhbmRsZXIgJiYgIXZhbGlkYXRlSGFuZGxlcihuYXRpdmVMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG9wdGlvbnMgPSBhcmd1bWVudHNbMl07XG5cbiAgICAgICAgaWYgKGJsYWNrTGlzdGVkRXZlbnRzKSB7XG4gICAgICAgICAgLy8gY2hlY2sgYmxhY2sgbGlzdFxuICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYmxhY2tMaXN0ZWRFdmVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChldmVudE5hbWUgPT09IGJsYWNrTGlzdGVkRXZlbnRzW2ldKSB7XG4gICAgICAgICAgICAgIHJldHVybiBuYXRpdmVMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjYXB0dXJlO1xuICAgICAgICBsZXQgb25jZSA9IGZhbHNlO1xuICAgICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMgPT09IHRydWUpIHtcbiAgICAgICAgICBjYXB0dXJlID0gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zID09PSBmYWxzZSkge1xuICAgICAgICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjYXB0dXJlID0gb3B0aW9ucyA/ICEhb3B0aW9ucy5jYXB0dXJlIDogZmFsc2U7XG4gICAgICAgICAgb25jZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMub25jZSA6IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3Qgem9uZSA9IFpvbmUuY3VycmVudDtcbiAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgIGxldCBzeW1ib2xFdmVudE5hbWU7XG4gICAgICAgIGlmICghc3ltYm9sRXZlbnROYW1lcykge1xuICAgICAgICAgIC8vIHRoZSBjb2RlIGlzIGR1cGxpY2F0ZSwgYnV0IEkganVzdCB3YW50IHRvIGdldCBzb21lIGJldHRlciBwZXJmb3JtYW5jZVxuICAgICAgICAgIGNvbnN0IGZhbHNlRXZlbnROYW1lID1cbiAgICAgICAgICAgICAgKGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSkgKyBGQUxTRV9TVFI7XG4gICAgICAgICAgY29uc3QgdHJ1ZUV2ZW50TmFtZSA9XG4gICAgICAgICAgICAgIChldmVudE5hbWVUb1N0cmluZyA/IGV2ZW50TmFtZVRvU3RyaW5nKGV2ZW50TmFtZSkgOiBldmVudE5hbWUpICsgVFJVRV9TVFI7XG4gICAgICAgICAgY29uc3Qgc3ltYm9sID0gWk9ORV9TWU1CT0xfUFJFRklYICsgZmFsc2VFdmVudE5hbWU7XG4gICAgICAgICAgY29uc3Qgc3ltYm9sQ2FwdHVyZSA9IFpPTkVfU1lNQk9MX1BSRUZJWCArIHRydWVFdmVudE5hbWU7XG4gICAgICAgICAgem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHt9O1xuICAgICAgICAgIHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV1bRkFMU0VfU1RSXSA9IHN5bWJvbDtcbiAgICAgICAgICB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdW1RSVUVfU1RSXSA9IHN5bWJvbENhcHR1cmU7XG4gICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gY2FwdHVyZSA/IHN5bWJvbENhcHR1cmUgOiBzeW1ib2w7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tjYXB0dXJlID8gVFJVRV9TVFIgOiBGQUxTRV9TVFJdO1xuICAgICAgICB9XG4gICAgICAgIGxldCBleGlzdGluZ1Rhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgIGxldCBpc0V4aXN0aW5nID0gZmFsc2U7XG4gICAgICAgIGlmIChleGlzdGluZ1Rhc2tzKSB7XG4gICAgICAgICAgLy8gYWxyZWFkeSBoYXZlIHRhc2sgcmVnaXN0ZXJlZFxuICAgICAgICAgIGlzRXhpc3RpbmcgPSB0cnVlO1xuICAgICAgICAgIGlmIChjaGVja0R1cGxpY2F0ZSkge1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBleGlzdGluZ1Rhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGlmIChjb21wYXJlKGV4aXN0aW5nVGFza3NbaV0sIGRlbGVnYXRlKSkge1xuICAgICAgICAgICAgICAgIC8vIHNhbWUgY2FsbGJhY2ssIHNhbWUgY2FwdHVyZSwgc2FtZSBldmVudCBuYW1lLCBqdXN0IHJldHVyblxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBleGlzdGluZ1Rhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV0gPSBbXTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgc291cmNlO1xuICAgICAgICBjb25zdCBjb25zdHJ1Y3Rvck5hbWUgPSB0YXJnZXQuY29uc3RydWN0b3JbJ25hbWUnXTtcbiAgICAgICAgY29uc3QgdGFyZ2V0U291cmNlID0gZ2xvYmFsU291cmNlc1tjb25zdHJ1Y3Rvck5hbWVdO1xuICAgICAgICBpZiAodGFyZ2V0U291cmNlKSB7XG4gICAgICAgICAgc291cmNlID0gdGFyZ2V0U291cmNlW2V2ZW50TmFtZV07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFzb3VyY2UpIHtcbiAgICAgICAgICBzb3VyY2UgPSBjb25zdHJ1Y3Rvck5hbWUgKyBhZGRTb3VyY2UgK1xuICAgICAgICAgICAgICAoZXZlbnROYW1lVG9TdHJpbmcgPyBldmVudE5hbWVUb1N0cmluZyhldmVudE5hbWUpIDogZXZlbnROYW1lKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBkbyBub3QgY3JlYXRlIGEgbmV3IG9iamVjdCBhcyB0YXNrLmRhdGEgdG8gcGFzcyB0aG9zZSB0aGluZ3NcbiAgICAgICAgLy8ganVzdCB1c2UgdGhlIGdsb2JhbCBzaGFyZWQgb25lXG4gICAgICAgIHRhc2tEYXRhLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgIC8vIGlmIGFkZEV2ZW50TGlzdGVuZXIgd2l0aCBvbmNlIG9wdGlvbnMsIHdlIGRvbid0IHBhc3MgaXQgdG9cbiAgICAgICAgICAvLyBuYXRpdmUgYWRkRXZlbnRMaXN0ZW5lciwgaW5zdGVhZCB3ZSBrZWVwIHRoZSBvbmNlIHNldHRpbmdcbiAgICAgICAgICAvLyBhbmQgaGFuZGxlIG91cnNlbHZlcy5cbiAgICAgICAgICB0YXNrRGF0YS5vcHRpb25zLm9uY2UgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB0YXNrRGF0YS50YXJnZXQgPSB0YXJnZXQ7XG4gICAgICAgIHRhc2tEYXRhLmNhcHR1cmUgPSBjYXB0dXJlO1xuICAgICAgICB0YXNrRGF0YS5ldmVudE5hbWUgPSBldmVudE5hbWU7XG4gICAgICAgIHRhc2tEYXRhLmlzRXhpc3RpbmcgPSBpc0V4aXN0aW5nO1xuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB1c2VHbG9iYWxDYWxsYmFjayA/IE9QVElNSVpFRF9aT05FX0VWRU5UX1RBU0tfREFUQSA6IHVuZGVmaW5lZDtcblxuICAgICAgICAvLyBrZWVwIHRhc2tEYXRhIGludG8gZGF0YSB0byBhbGxvdyBvblNjaGVkdWxlRXZlbnRUYXNrIHRvIGFjY2VzcyB0aGUgdGFzayBpbmZvcm1hdGlvblxuICAgICAgICBpZiAoZGF0YSkge1xuICAgICAgICAgIChkYXRhIGFzIGFueSkudGFza0RhdGEgPSB0YXNrRGF0YTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHRhc2s6IGFueSA9XG4gICAgICAgICAgICB6b25lLnNjaGVkdWxlRXZlbnRUYXNrKHNvdXJjZSwgZGVsZWdhdGUsIGRhdGEsIGN1c3RvbVNjaGVkdWxlRm4sIGN1c3RvbUNhbmNlbEZuKTtcblxuICAgICAgICAvLyBzaG91bGQgY2xlYXIgdGFza0RhdGEudGFyZ2V0IHRvIGF2b2lkIG1lbW9yeSBsZWFrXG4gICAgICAgIC8vIGlzc3VlLCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8yMDQ0MlxuICAgICAgICB0YXNrRGF0YS50YXJnZXQgPSBudWxsO1xuXG4gICAgICAgIC8vIG5lZWQgdG8gY2xlYXIgdXAgdGFza0RhdGEgYmVjYXVzZSBpdCBpcyBhIGdsb2JhbCBvYmplY3RcbiAgICAgICAgaWYgKGRhdGEpIHtcbiAgICAgICAgICAoZGF0YSBhcyBhbnkpLnRhc2tEYXRhID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhhdmUgdG8gc2F2ZSB0aG9zZSBpbmZvcm1hdGlvbiB0byB0YXNrIGluIGNhc2VcbiAgICAgICAgLy8gYXBwbGljYXRpb24gbWF5IGNhbGwgdGFzay56b25lLmNhbmNlbFRhc2soKSBkaXJlY3RseVxuICAgICAgICBpZiAob25jZSkge1xuICAgICAgICAgIG9wdGlvbnMub25jZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCEoIXBhc3NpdmVTdXBwb3J0ZWQgJiYgdHlwZW9mIHRhc2sub3B0aW9ucyA9PT0gJ2Jvb2xlYW4nKSkge1xuICAgICAgICAgIC8vIGlmIG5vdCBzdXBwb3J0IHBhc3NpdmUsIGFuZCB3ZSBwYXNzIGFuIG9wdGlvbiBvYmplY3RcbiAgICAgICAgICAvLyB0byBhZGRFdmVudExpc3RlbmVyLCB3ZSBzaG91bGQgc2F2ZSB0aGUgb3B0aW9ucyB0byB0YXNrXG4gICAgICAgICAgdGFzay5vcHRpb25zID0gb3B0aW9ucztcbiAgICAgICAgfVxuICAgICAgICB0YXNrLnRhcmdldCA9IHRhcmdldDtcbiAgICAgICAgdGFzay5jYXB0dXJlID0gY2FwdHVyZTtcbiAgICAgICAgdGFzay5ldmVudE5hbWUgPSBldmVudE5hbWU7XG4gICAgICAgIGlmIChpc0hhbmRsZUV2ZW50KSB7XG4gICAgICAgICAgLy8gc2F2ZSBvcmlnaW5hbCBkZWxlZ2F0ZSBmb3IgY29tcGFyZSB0byBjaGVjayBkdXBsaWNhdGVcbiAgICAgICAgICAodGFzayBhcyBhbnkpLm9yaWdpbmFsRGVsZWdhdGUgPSBkZWxlZ2F0ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIXByZXBlbmQpIHtcbiAgICAgICAgICBleGlzdGluZ1Rhc2tzLnB1c2godGFzayk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZXhpc3RpbmdUYXNrcy51bnNoaWZ0KHRhc2spO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJldHVyblRhcmdldCkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXQ7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIHByb3RvW0FERF9FVkVOVF9MSVNURU5FUl0gPSBtYWtlQWRkTGlzdGVuZXIoXG4gICAgICAgIG5hdGl2ZUFkZEV2ZW50TGlzdGVuZXIsIEFERF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwsXG4gICAgICAgIHJldHVyblRhcmdldCk7XG4gICAgaWYgKG5hdGl2ZVByZXBlbmRFdmVudExpc3RlbmVyKSB7XG4gICAgICBwcm90b1tQUkVQRU5EX0VWRU5UX0xJU1RFTkVSXSA9IG1ha2VBZGRMaXN0ZW5lcihcbiAgICAgICAgICBuYXRpdmVQcmVwZW5kRXZlbnRMaXN0ZW5lciwgUFJFUEVORF9FVkVOVF9MSVNURU5FUl9TT1VSQ0UsIGN1c3RvbVNjaGVkdWxlUHJlcGVuZCxcbiAgICAgICAgICBjdXN0b21DYW5jZWwsIHJldHVyblRhcmdldCwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgcHJvdG9bUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuICAgICAgY29uc3QgZXZlbnROYW1lID0gYXJndW1lbnRzWzBdO1xuICAgICAgY29uc3Qgb3B0aW9ucyA9IGFyZ3VtZW50c1syXTtcblxuICAgICAgbGV0IGNhcHR1cmU7XG4gICAgICBpZiAob3B0aW9ucyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGNhcHR1cmUgPSBmYWxzZTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gdHJ1ZSkge1xuICAgICAgICBjYXB0dXJlID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAob3B0aW9ucyA9PT0gZmFsc2UpIHtcbiAgICAgICAgY2FwdHVyZSA9IGZhbHNlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY2FwdHVyZSA9IG9wdGlvbnMgPyAhIW9wdGlvbnMuY2FwdHVyZSA6IGZhbHNlO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBkZWxlZ2F0ZSA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmICghZGVsZWdhdGUpIHtcbiAgICAgICAgcmV0dXJuIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgaWYgKHZhbGlkYXRlSGFuZGxlciAmJlxuICAgICAgICAgICF2YWxpZGF0ZUhhbmRsZXIobmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lciwgZGVsZWdhdGUsIHRhcmdldCwgYXJndW1lbnRzKSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHN5bWJvbEV2ZW50TmFtZXMgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdO1xuICAgICAgbGV0IHN5bWJvbEV2ZW50TmFtZTtcbiAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgIHN5bWJvbEV2ZW50TmFtZSA9IHN5bWJvbEV2ZW50TmFtZXNbY2FwdHVyZSA/IFRSVUVfU1RSIDogRkFMU0VfU1RSXTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IGV4aXN0aW5nVGFza3MgPSBzeW1ib2xFdmVudE5hbWUgJiYgdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICBpZiAoZXhpc3RpbmdUYXNrcykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGV4aXN0aW5nVGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBjb25zdCBleGlzdGluZ1Rhc2sgPSBleGlzdGluZ1Rhc2tzW2ldO1xuICAgICAgICAgIGlmIChjb21wYXJlKGV4aXN0aW5nVGFzaywgZGVsZWdhdGUpKSB7XG4gICAgICAgICAgICBleGlzdGluZ1Rhc2tzLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIC8vIHNldCBpc1JlbW92ZWQgdG8gZGF0YSBmb3IgZmFzdGVyIGludm9rZVRhc2sgY2hlY2tcbiAgICAgICAgICAgIChleGlzdGluZ1Rhc2sgYXMgYW55KS5pc1JlbW92ZWQgPSB0cnVlO1xuICAgICAgICAgICAgaWYgKGV4aXN0aW5nVGFza3MubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgIC8vIGFsbCB0YXNrcyBmb3IgdGhlIGV2ZW50TmFtZSArIGNhcHR1cmUgaGF2ZSBnb25lLFxuICAgICAgICAgICAgICAvLyByZW1vdmUgZ2xvYmFsWm9uZUF3YXJlQ2FsbGJhY2sgYW5kIHJlbW92ZSB0aGUgdGFzayBjYWNoZSBmcm9tIHRhcmdldFxuICAgICAgICAgICAgICAoZXhpc3RpbmdUYXNrIGFzIGFueSkuYWxsUmVtb3ZlZCA9IHRydWU7XG4gICAgICAgICAgICAgIHRhcmdldFtzeW1ib2xFdmVudE5hbWVdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4aXN0aW5nVGFzay56b25lLmNhbmNlbFRhc2soZXhpc3RpbmdUYXNrKTtcbiAgICAgICAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgICAgICAgcmV0dXJuIHRhcmdldDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIC8vIGlzc3VlIDkzMCwgZGlkbid0IGZpbmQgdGhlIGV2ZW50IG5hbWUgb3IgY2FsbGJhY2tcbiAgICAgIC8vIGZyb20gem9uZSBrZXB0IGV4aXN0aW5nVGFza3MsIHRoZSBjYWxsYmFjayBtYXliZVxuICAgICAgLy8gYWRkZWQgb3V0c2lkZSBvZiB6b25lLCB3ZSBuZWVkIHRvIGNhbGwgbmF0aXZlIHJlbW92ZUV2ZW50TGlzdGVuZXJcbiAgICAgIC8vIHRvIHRyeSB0byByZW1vdmUgaXQuXG4gICAgICByZXR1cm4gbmF0aXZlUmVtb3ZlRXZlbnRMaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH07XG5cbiAgICBwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdID0gZnVuY3Rpb24oKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IF9nbG9iYWw7XG4gICAgICBjb25zdCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG5cbiAgICAgIGNvbnN0IGxpc3RlbmVyczogYW55W10gPSBbXTtcbiAgICAgIGNvbnN0IHRhc2tzID1cbiAgICAgICAgICBmaW5kRXZlbnRUYXNrcyh0YXJnZXQsIGV2ZW50TmFtZVRvU3RyaW5nID8gZXZlbnROYW1lVG9TdHJpbmcoZXZlbnROYW1lKSA6IGV2ZW50TmFtZSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGFza3MubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgY29uc3QgdGFzazogYW55ID0gdGFza3NbaV07XG4gICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgIGxpc3RlbmVycy5wdXNoKGRlbGVnYXRlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBsaXN0ZW5lcnM7XG4gICAgfTtcblxuICAgIHByb3RvW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBfZ2xvYmFsO1xuXG4gICAgICBjb25zdCBldmVudE5hbWUgPSBhcmd1bWVudHNbMF07XG4gICAgICBpZiAoIWV2ZW50TmFtZSkge1xuICAgICAgICBjb25zdCBrZXlzID0gT2JqZWN0LmtleXModGFyZ2V0KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgY29uc3QgcHJvcCA9IGtleXNbaV07XG4gICAgICAgICAgY29uc3QgbWF0Y2ggPSBFVkVOVF9OQU1FX1NZTUJPTF9SRUdYLmV4ZWMocHJvcCk7XG4gICAgICAgICAgbGV0IGV2dE5hbWUgPSBtYXRjaCAmJiBtYXRjaFsxXTtcbiAgICAgICAgICAvLyBpbiBub2RlanMgRXZlbnRFbWl0dGVyLCByZW1vdmVMaXN0ZW5lciBldmVudCBpc1xuICAgICAgICAgIC8vIHVzZWQgZm9yIG1vbml0b3JpbmcgdGhlIHJlbW92ZUxpc3RlbmVyIGNhbGwsXG4gICAgICAgICAgLy8gc28ganVzdCBrZWVwIHJlbW92ZUxpc3RlbmVyIGV2ZW50TGlzdGVuZXIgdW50aWxcbiAgICAgICAgICAvLyBhbGwgb3RoZXIgZXZlbnRMaXN0ZW5lcnMgYXJlIHJlbW92ZWRcbiAgICAgICAgICBpZiAoZXZ0TmFtZSAmJiBldnROYW1lICE9PSAncmVtb3ZlTGlzdGVuZXInKSB7XG4gICAgICAgICAgICB0aGlzW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2dE5hbWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyByZW1vdmUgcmVtb3ZlTGlzdGVuZXIgbGlzdGVuZXIgZmluYWxseVxuICAgICAgICB0aGlzW1JFTU9WRV9BTExfTElTVEVORVJTX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsICdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lcyA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gICAgICAgIGlmIChzeW1ib2xFdmVudE5hbWVzKSB7XG4gICAgICAgICAgY29uc3Qgc3ltYm9sRXZlbnROYW1lID0gc3ltYm9sRXZlbnROYW1lc1tGQUxTRV9TVFJdO1xuICAgICAgICAgIGNvbnN0IHN5bWJvbENhcHR1cmVFdmVudE5hbWUgPSBzeW1ib2xFdmVudE5hbWVzW1RSVUVfU1RSXTtcblxuICAgICAgICAgIGNvbnN0IHRhc2tzID0gdGFyZ2V0W3N5bWJvbEV2ZW50TmFtZV07XG4gICAgICAgICAgY29uc3QgY2FwdHVyZVRhc2tzID0gdGFyZ2V0W3N5bWJvbENhcHR1cmVFdmVudE5hbWVdO1xuXG4gICAgICAgICAgaWYgKHRhc2tzKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVUYXNrcyA9IHRhc2tzLnNsaWNlKCk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbW92ZVRhc2tzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHRhc2sgPSByZW1vdmVUYXNrc1tpXTtcbiAgICAgICAgICAgICAgbGV0IGRlbGVnYXRlID0gdGFzay5vcmlnaW5hbERlbGVnYXRlID8gdGFzay5vcmlnaW5hbERlbGVnYXRlIDogdGFzay5jYWxsYmFjaztcbiAgICAgICAgICAgICAgdGhpc1tSRU1PVkVfRVZFTlRfTElTVEVORVJdLmNhbGwodGhpcywgZXZlbnROYW1lLCBkZWxlZ2F0ZSwgdGFzay5vcHRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY2FwdHVyZVRhc2tzKSB7XG4gICAgICAgICAgICBjb25zdCByZW1vdmVUYXNrcyA9IGNhcHR1cmVUYXNrcy5zbGljZSgpO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByZW1vdmVUYXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICBjb25zdCB0YXNrID0gcmVtb3ZlVGFza3NbaV07XG4gICAgICAgICAgICAgIGxldCBkZWxlZ2F0ZSA9IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA/IHRhc2sub3JpZ2luYWxEZWxlZ2F0ZSA6IHRhc2suY2FsbGJhY2s7XG4gICAgICAgICAgICAgIHRoaXNbUkVNT1ZFX0VWRU5UX0xJU1RFTkVSXS5jYWxsKHRoaXMsIGV2ZW50TmFtZSwgZGVsZWdhdGUsIHRhc2sub3B0aW9ucyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChyZXR1cm5UYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG4gICAgfTtcblxuICAgIC8vIGZvciBuYXRpdmUgdG9TdHJpbmcgcGF0Y2hcbiAgICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocHJvdG9bQUREX0VWRU5UX0xJU1RFTkVSXSwgbmF0aXZlQWRkRXZlbnRMaXN0ZW5lcik7XG4gICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW1JFTU9WRV9FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZVJlbW92ZUV2ZW50TGlzdGVuZXIpO1xuICAgIGlmIChuYXRpdmVSZW1vdmVBbGxMaXN0ZW5lcnMpIHtcbiAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tSRU1PVkVfQUxMX0xJU1RFTkVSU19FVkVOVF9MSVNURU5FUl0sIG5hdGl2ZVJlbW92ZUFsbExpc3RlbmVycyk7XG4gICAgfVxuICAgIGlmIChuYXRpdmVMaXN0ZW5lcnMpIHtcbiAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tMSVNURU5FUlNfRVZFTlRfTElTVEVORVJdLCBuYXRpdmVMaXN0ZW5lcnMpO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGxldCByZXN1bHRzOiBhbnlbXSA9IFtdO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFwaXMubGVuZ3RoOyBpKyspIHtcbiAgICByZXN1bHRzW2ldID0gcGF0Y2hFdmVudFRhcmdldE1ldGhvZHMoYXBpc1tpXSwgcGF0Y2hPcHRpb25zKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHRzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmluZEV2ZW50VGFza3ModGFyZ2V0OiBhbnksIGV2ZW50TmFtZTogc3RyaW5nKTogVGFza1tdIHtcbiAgY29uc3QgZm91bmRUYXNrczogYW55W10gPSBbXTtcbiAgZm9yIChsZXQgcHJvcCBpbiB0YXJnZXQpIHtcbiAgICBjb25zdCBtYXRjaCA9IEVWRU5UX05BTUVfU1lNQk9MX1JFR1guZXhlYyhwcm9wKTtcbiAgICBsZXQgZXZ0TmFtZSA9IG1hdGNoICYmIG1hdGNoWzFdO1xuICAgIGlmIChldnROYW1lICYmICghZXZlbnROYW1lIHx8IGV2dE5hbWUgPT09IGV2ZW50TmFtZSkpIHtcbiAgICAgIGNvbnN0IHRhc2tzOiBhbnkgPSB0YXJnZXRbcHJvcF07XG4gICAgICBpZiAodGFza3MpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0YXNrcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGZvdW5kVGFza3MucHVzaCh0YXNrc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGZvdW5kVGFza3M7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaEV2ZW50UHJvdG90eXBlKGdsb2JhbDogYW55LCBhcGk6IF9ab25lUHJpdmF0ZSkge1xuICBjb25zdCBFdmVudCA9IGdsb2JhbFsnRXZlbnQnXTtcbiAgaWYgKEV2ZW50ICYmIEV2ZW50LnByb3RvdHlwZSkge1xuICAgIGFwaS5wYXRjaE1ldGhvZChcbiAgICAgICAgRXZlbnQucHJvdG90eXBlLCAnc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uJyxcbiAgICAgICAgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24oc2VsZjogYW55LCBhcmdzOiBhbnlbXSkge1xuICAgICAgICAgIHNlbGZbSU1NRURJQVRFX1BST1BBR0FUSU9OX1NZTUJPTF0gPSB0cnVlO1xuICAgICAgICAgIC8vIHdlIG5lZWQgdG8gY2FsbCB0aGUgbmF0aXZlIHN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblxuICAgICAgICAgIC8vIGluIGNhc2UgaW4gc29tZSBoeWJyaWQgYXBwbGljYXRpb24sIHNvbWUgcGFydCBvZlxuICAgICAgICAgIC8vIGFwcGxpY2F0aW9uIHdpbGwgYmUgY29udHJvbGxlZCBieSB6b25lLCBzb21lIGFyZSBub3RcbiAgICAgICAgICBkZWxlZ2F0ZSAmJiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICAgICAgfSk7XG4gIH1cbn1cbiJdfQ==