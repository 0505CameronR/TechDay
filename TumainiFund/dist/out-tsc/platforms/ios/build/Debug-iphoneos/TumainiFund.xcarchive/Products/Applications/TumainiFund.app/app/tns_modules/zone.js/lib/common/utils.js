/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Suppress closure compiler errors about unknown 'Zone' variable
 * @fileoverview
 * @suppress {undefinedVars,globalThis,missingRequire}
 */
// issue #989, to reduce bundle size, use short name
/** Object.getOwnPropertyDescriptor */
export const ObjectGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
/** Object.defineProperty */
export const ObjectDefineProperty = Object.defineProperty;
/** Object.getPrototypeOf */
export const ObjectGetPrototypeOf = Object.getPrototypeOf;
/** Object.create */
export const ObjectCreate = Object.create;
/** Array.prototype.slice */
export const ArraySlice = Array.prototype.slice;
/** addEventListener string const */
export const ADD_EVENT_LISTENER_STR = 'addEventListener';
/** removeEventListener string const */
export const REMOVE_EVENT_LISTENER_STR = 'removeEventListener';
/** zoneSymbol addEventListener */
export const ZONE_SYMBOL_ADD_EVENT_LISTENER = Zone.__symbol__(ADD_EVENT_LISTENER_STR);
/** zoneSymbol removeEventListener */
export const ZONE_SYMBOL_REMOVE_EVENT_LISTENER = Zone.__symbol__(REMOVE_EVENT_LISTENER_STR);
/** true string const */
export const TRUE_STR = 'true';
/** false string const */
export const FALSE_STR = 'false';
/** __zone_symbol__ string const */
export const ZONE_SYMBOL_PREFIX = '__zone_symbol__';
export function wrapWithCurrentZone(callback, source) {
    return Zone.current.wrap(callback, source);
}
export function scheduleMacroTaskWithCurrentZone(source, callback, data, customSchedule, customCancel) {
    return Zone.current.scheduleMacroTask(source, callback, data, customSchedule, customCancel);
}
export const zoneSymbol = Zone.__symbol__;
const isWindowExists = typeof window !== 'undefined';
const internalWindow = isWindowExists ? window : undefined;
const _global = isWindowExists && internalWindow || typeof self === 'object' && self || global;
const REMOVE_ATTRIBUTE = 'removeAttribute';
const NULL_ON_PROP_VALUE = [null];
export function bindArguments(args, source) {
    for (let i = args.length - 1; i >= 0; i--) {
        if (typeof args[i] === 'function') {
            args[i] = wrapWithCurrentZone(args[i], source + '_' + i);
        }
    }
    return args;
}
export function patchPrototype(prototype, fnNames) {
    const source = prototype.constructor['name'];
    for (let i = 0; i < fnNames.length; i++) {
        const name = fnNames[i];
        const delegate = prototype[name];
        if (delegate) {
            const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, name);
            if (!isPropertyWritable(prototypeDesc)) {
                continue;
            }
            prototype[name] = ((delegate) => {
                const patched = function () {
                    return delegate.apply(this, bindArguments(arguments, source + '.' + name));
                };
                attachOriginToPatched(patched, delegate);
                return patched;
            })(delegate);
        }
    }
}
export function isPropertyWritable(propertyDesc) {
    if (!propertyDesc) {
        return true;
    }
    if (propertyDesc.writable === false) {
        return false;
    }
    return !(typeof propertyDesc.get === 'function' && typeof propertyDesc.set === 'undefined');
}
export const isWebWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
export const isNode = (!('nw' in _global) && typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]');
export const isBrowser = !isNode && !isWebWorker && !!(isWindowExists && internalWindow['HTMLElement']);
// we are in electron of nw, so we are both browser and nodejs
// Make sure to access `process` through `_global` so that WebPack does not accidentally browserify
// this code.
export const isMix = typeof _global.process !== 'undefined' &&
    {}.toString.call(_global.process) === '[object process]' && !isWebWorker &&
    !!(isWindowExists && internalWindow['HTMLElement']);
const zoneSymbolEventNames = {};
const wrapFn = function (event) {
    // https://github.com/angular/zone.js/issues/911, in IE, sometimes
    // event will be undefined, so we need to use window.event
    event = event || _global.event;
    if (!event) {
        return;
    }
    let eventNameSymbol = zoneSymbolEventNames[event.type];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[event.type] = zoneSymbol('ON_PROPERTY' + event.type);
    }
    const target = this || event.target || _global;
    const listener = target[eventNameSymbol];
    let result;
    if (isBrowser && target === internalWindow && event.type === 'error') {
        // window.onerror have different signiture
        // https://developer.mozilla.org/en-US/docs/Web/API/GlobalEventHandlers/onerror#window.onerror
        // and onerror callback will prevent default when callback return true
        const errorEvent = event;
        result = listener &&
            listener.call(this, errorEvent.message, errorEvent.filename, errorEvent.lineno, errorEvent.colno, errorEvent.error);
        if (result === true) {
            event.preventDefault();
        }
    }
    else {
        result = listener && listener.apply(this, arguments);
        if (result != undefined && !result) {
            event.preventDefault();
        }
    }
    return result;
};
export function patchProperty(obj, prop, prototype) {
    let desc = ObjectGetOwnPropertyDescriptor(obj, prop);
    if (!desc && prototype) {
        // when patch window object, use prototype to check prop exist or not
        const prototypeDesc = ObjectGetOwnPropertyDescriptor(prototype, prop);
        if (prototypeDesc) {
            desc = { enumerable: true, configurable: true };
        }
    }
    // if the descriptor not exists or is not configurable
    // just return
    if (!desc || !desc.configurable) {
        return;
    }
    const onPropPatchedSymbol = zoneSymbol('on' + prop + 'patched');
    if (obj.hasOwnProperty(onPropPatchedSymbol) && obj[onPropPatchedSymbol]) {
        return;
    }
    // A property descriptor cannot have getter/setter and be writable
    // deleting the writable and value properties avoids this error:
    //
    // TypeError: property descriptors must not specify a value or be writable when a
    // getter or setter has been specified
    delete desc.writable;
    delete desc.value;
    const originalDescGet = desc.get;
    const originalDescSet = desc.set;
    // substr(2) cuz 'onclick' -> 'click', etc
    const eventName = prop.substr(2);
    let eventNameSymbol = zoneSymbolEventNames[eventName];
    if (!eventNameSymbol) {
        eventNameSymbol = zoneSymbolEventNames[eventName] = zoneSymbol('ON_PROPERTY' + eventName);
    }
    desc.set = function (newValue) {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        let target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return;
        }
        let previousValue = target[eventNameSymbol];
        if (previousValue) {
            target.removeEventListener(eventName, wrapFn);
        }
        // issue #978, when onload handler was added before loading zone.js
        // we should remove it with originalDescSet
        if (originalDescSet) {
            originalDescSet.apply(target, NULL_ON_PROP_VALUE);
        }
        if (typeof newValue === 'function') {
            target[eventNameSymbol] = newValue;
            target.addEventListener(eventName, wrapFn, false);
        }
        else {
            target[eventNameSymbol] = null;
        }
    };
    // The getter would return undefined for unassigned properties but the default value of an
    // unassigned property is null
    desc.get = function () {
        // in some of windows's onproperty callback, this is undefined
        // so we need to check it
        let target = this;
        if (!target && obj === _global) {
            target = _global;
        }
        if (!target) {
            return null;
        }
        const listener = target[eventNameSymbol];
        if (listener) {
            return listener;
        }
        else if (originalDescGet) {
            // result will be null when use inline event attribute,
            // such as <button onclick="func();">OK</button>
            // because the onclick function is internal raw uncompiled handler
            // the onclick will be evaluated when first time event was triggered or
            // the property is accessed, https://github.com/angular/zone.js/issues/525
            // so we should use original native get to retrieve the handler
            let value = originalDescGet && originalDescGet.call(this);
            if (value) {
                desc.set.call(this, value);
                if (typeof target[REMOVE_ATTRIBUTE] === 'function') {
                    target.removeAttribute(prop);
                }
                return value;
            }
        }
        return null;
    };
    ObjectDefineProperty(obj, prop, desc);
    obj[onPropPatchedSymbol] = true;
}
export function patchOnProperties(obj, properties, prototype) {
    if (properties) {
        for (let i = 0; i < properties.length; i++) {
            patchProperty(obj, 'on' + properties[i], prototype);
        }
    }
    else {
        const onProperties = [];
        for (const prop in obj) {
            if (prop.substr(0, 2) == 'on') {
                onProperties.push(prop);
            }
        }
        for (let j = 0; j < onProperties.length; j++) {
            patchProperty(obj, onProperties[j], prototype);
        }
    }
}
const originalInstanceKey = zoneSymbol('originalInstance');
// wrap some native API on `window`
export function patchClass(className) {
    const OriginalClass = _global[className];
    if (!OriginalClass)
        return;
    // keep original class in global
    _global[zoneSymbol(className)] = OriginalClass;
    _global[className] = function () {
        const a = bindArguments(arguments, className);
        switch (a.length) {
            case 0:
                this[originalInstanceKey] = new OriginalClass();
                break;
            case 1:
                this[originalInstanceKey] = new OriginalClass(a[0]);
                break;
            case 2:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1]);
                break;
            case 3:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2]);
                break;
            case 4:
                this[originalInstanceKey] = new OriginalClass(a[0], a[1], a[2], a[3]);
                break;
            default:
                throw new Error('Arg list too long.');
        }
    };
    // attach original delegate to patched function
    attachOriginToPatched(_global[className], OriginalClass);
    const instance = new OriginalClass(function () { });
    let prop;
    for (prop in instance) {
        // https://bugs.webkit.org/show_bug.cgi?id=44721
        if (className === 'XMLHttpRequest' && prop === 'responseBlob')
            continue;
        (function (prop) {
            if (typeof instance[prop] === 'function') {
                _global[className].prototype[prop] = function () {
                    return this[originalInstanceKey][prop].apply(this[originalInstanceKey], arguments);
                };
            }
            else {
                ObjectDefineProperty(_global[className].prototype, prop, {
                    set: function (fn) {
                        if (typeof fn === 'function') {
                            this[originalInstanceKey][prop] = wrapWithCurrentZone(fn, className + '.' + prop);
                            // keep callback in wrapped function so we can
                            // use it in Function.prototype.toString to return
                            // the native one.
                            attachOriginToPatched(this[originalInstanceKey][prop], fn);
                        }
                        else {
                            this[originalInstanceKey][prop] = fn;
                        }
                    },
                    get: function () {
                        return this[originalInstanceKey][prop];
                    }
                });
            }
        }(prop));
    }
    for (prop in OriginalClass) {
        if (prop !== 'prototype' && OriginalClass.hasOwnProperty(prop)) {
            _global[className][prop] = OriginalClass[prop];
        }
    }
}
export function copySymbolProperties(src, dest) {
    if (typeof Object.getOwnPropertySymbols !== 'function') {
        return;
    }
    const symbols = Object.getOwnPropertySymbols(src);
    symbols.forEach((symbol) => {
        const desc = Object.getOwnPropertyDescriptor(src, symbol);
        Object.defineProperty(dest, symbol, {
            get: function () {
                return src[symbol];
            },
            set: function (value) {
                if (desc && (!desc.writable || typeof desc.set !== 'function')) {
                    // if src[symbol] is not writable or not have a setter, just return
                    return;
                }
                src[symbol] = value;
            },
            enumerable: desc ? desc.enumerable : true,
            configurable: desc ? desc.configurable : true
        });
    });
}
let shouldCopySymbolProperties = false;
export function setShouldCopySymbolProperties(flag) {
    shouldCopySymbolProperties = flag;
}
export function patchMethod(target, name, patchFn) {
    let proto = target;
    while (proto && !proto.hasOwnProperty(name)) {
        proto = ObjectGetPrototypeOf(proto);
    }
    if (!proto && target[name]) {
        // somehow we did not find it, but we can see it. This happens on IE for Window properties.
        proto = target;
    }
    const delegateName = zoneSymbol(name);
    let delegate = null;
    if (proto && !(delegate = proto[delegateName])) {
        delegate = proto[delegateName] = proto[name];
        // check whether proto[name] is writable
        // some property is readonly in safari, such as HtmlCanvasElement.prototype.toBlob
        const desc = proto && ObjectGetOwnPropertyDescriptor(proto, name);
        if (isPropertyWritable(desc)) {
            const patchDelegate = patchFn(delegate, delegateName, name);
            proto[name] = function () {
                return patchDelegate(this, arguments);
            };
            attachOriginToPatched(proto[name], delegate);
            if (shouldCopySymbolProperties) {
                copySymbolProperties(delegate, proto[name]);
            }
        }
    }
    return delegate;
}
// TODO: @JiaLiPassion, support cancel task later if necessary
export function patchMacroTask(obj, funcName, metaCreator) {
    let setNative = null;
    function scheduleTask(task) {
        const data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, (delegate) => function (self, args) {
        const meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return scheduleMacroTaskWithCurrentZone(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    });
}
export function patchMicroTask(obj, funcName, metaCreator) {
    let setNative = null;
    function scheduleTask(task) {
        const data = task.data;
        data.args[data.cbIdx] = function () {
            task.invoke.apply(this, arguments);
        };
        setNative.apply(data.target, data.args);
        return task;
    }
    setNative = patchMethod(obj, funcName, (delegate) => function (self, args) {
        const meta = metaCreator(self, args);
        if (meta.cbIdx >= 0 && typeof args[meta.cbIdx] === 'function') {
            return Zone.current.scheduleMicroTask(meta.name, args[meta.cbIdx], meta, scheduleTask);
        }
        else {
            // cause an error by calling it directly.
            return delegate.apply(self, args);
        }
    });
}
export function attachOriginToPatched(patched, original) {
    patched[zoneSymbol('OriginalDelegate')] = original;
}
let isDetectedIEOrEdge = false;
let ieOrEdge = false;
export function isIE() {
    try {
        const ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1) {
            return true;
        }
    }
    catch (error) {
    }
    return false;
}
export function isIEOrEdge() {
    if (isDetectedIEOrEdge) {
        return ieOrEdge;
    }
    isDetectedIEOrEdge = true;
    try {
        const ua = internalWindow.navigator.userAgent;
        if (ua.indexOf('MSIE ') !== -1 || ua.indexOf('Trident/') !== -1 || ua.indexOf('Edge/') !== -1) {
            ieOrEdge = true;
        }
        return ieOrEdge;
    }
    catch (error) {
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL0RlYnVnLWlwaG9uZW9zL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0g7Ozs7R0FJRztBQUVILG9EQUFvRDtBQUVwRCxzQ0FBc0M7QUFDdEMsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQzlFLDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzFELDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzFELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQyw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ2hELG9DQUFvQztBQUNwQyxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztBQUN6RCx1Q0FBdUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcscUJBQXFCLENBQUM7QUFDL0Qsa0NBQWtDO0FBQ2xDLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN0RixxQ0FBcUM7QUFDckMsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUcsSUFBSSxDQUFD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QUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM3RixRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO1FBQ0QsT0FBTyxRQUFRLENBQUM7S0FDakI7SUFBQyxPQUFPLEtBQUssRUFBRTtLQUNmO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogU3VwcHJlc3MgY2xvc3VyZSBjb21waWxlciBlcnJvcnMgYWJvdXQgdW5rbm93biAnWm9uZScgdmFyaWFibGVcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7dW5kZWZpbmVkVmFycyxnbG9iYWxUaGlzLG1pc3NpbmdSZXF1aXJlfVxuICovXG5cbi8vIGlzc3VlICM5ODksIHRvIHJlZHVjZSBidW5kbGUgc2l6ZSwgdXNlIHNob3J0IG5hbWVcblxuLyoqIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgKi9cbmV4cG9ydCBjb25zdCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuLyoqIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdERlZmluZVByb3BlcnR5ID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuLyoqIE9iamVjdC5nZXRQcm90b3R5cGVPZiAqL1xuZXhwb3J0IGNvbnN0IE9iamVjdEdldFByb3RvdHlwZU9mID0gT2JqZWN0LmdldFByb3RvdHlwZU9mO1xuLyoqIE9iamVjdC5jcmVhdGUgKi9cbmV4cG9ydCBjb25zdCBPYmplY3RDcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuLyoqIEFycmF5LnByb3RvdHlwZS5zbGljZSAqL1xuZXhwb3J0IGNvbnN0IEFycmF5U2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2U7XG4vKiogYWRkRXZlbnRMaXN0ZW5lciBzdHJpbmcgY29uc3QgKi9cbmV4cG9ydCBjb25zdCBBRERfRVZFTlRfTElTVEVORVJfU1RSID0gJ2FkZEV2ZW50TGlzdGVuZXInO1xuLyoqIHJlbW92ZUV2ZW50TGlzdGVuZXIgc3RyaW5nIGNvbnN0ICovXG5leHBvcnQgY29uc3QgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdyZW1vdmVFdmVudExpc3RlbmVyJztcbi8qKiB6b25lU3ltYm9sIGFkZEV2ZW50TGlzdGVuZXIgKi9cbmV4cG9ydCBjb25zdCBaT05FX1NZTUJPTF9BRERfRVZFTlRfTElTVEVORVIgPSBab25lLl9fc3ltYm9sX18oQUREX0VWRU5UX0xJU1RFTkVSX1NUUik7XG4vKiogem9uZVN5bWJvbCByZW1vdmVFdmVudExpc3RlbmVyICovXG5leHBvcnQgY29uc3QgWk9ORV9TWU1CT0xfUkVNT1ZFX0VWRU5UX0xJU1RFTkVSID0gWm9uZS5fX3N5bWJvbF9fKFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHRydWUgc3RyaW5nIGNvbnN0ICovXG5leHBvcnQgY29uc3QgVFJVRV9TVFIgPSAndHJ1ZSc7XG4vKiogZmFsc2Ugc3RyaW5nIGNvbnN0ICovXG5leHBvcnQgY29uc3QgRkFMU0VfU1RSID0gJ2ZhbHNlJztcbi8qKiBfX3pvbmVfc3ltYm9sX18gc3RyaW5nIGNvbnN0ICovXG5leHBvcnQgY29uc3QgWk9ORV9TWU1CT0xfUFJFRklYID0gJ19fem9uZV9zeW1ib2xfXyc7XG5cbmV4cG9ydCBmdW5jdGlvbiB3cmFwV2l0aEN1cnJlbnRab25lPFQgZXh0ZW5kcyBGdW5jdGlvbj4oY2FsbGJhY2s6IFQsIHNvdXJjZTogc3RyaW5nKTogVCB7XG4gIHJldHVybiBab25lLmN1cnJlbnQud3JhcChjYWxsYmFjaywgc291cmNlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKFxuICAgIHNvdXJjZTogc3RyaW5nLCBjYWxsYmFjazogRnVuY3Rpb24sIGRhdGE/OiBUYXNrRGF0YSwgY3VzdG9tU2NoZWR1bGU/OiAodGFzazogVGFzaykgPT4gdm9pZCxcbiAgICBjdXN0b21DYW5jZWw/OiAodGFzazogVGFzaykgPT4gdm9pZCk6IE1hY3JvVGFzayB7XG4gIHJldHVybiBab25lLmN1cnJlbnQuc2NoZWR1bGVNYWNyb1Rhc2soc291cmNlLCBjYWxsYmFjaywgZGF0YSwgY3VzdG9tU2NoZWR1bGUsIGN1c3RvbUNhbmNlbCk7XG59XG5cbi8vIEhhY2sgc2luY2UgVHlwZVNjcmlwdCBpc24ndCBjb21waWxpbmcgdGhpcyBmb3IgYSB3b3JrZXIuXG5kZWNsYXJlIGNvbnN0IFdvcmtlckdsb2JhbFNjb3BlOiBhbnk7XG5cbmV4cG9ydCBjb25zdCB6b25lU3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fO1xuY29uc3QgaXNXaW5kb3dFeGlzdHMgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJztcbmNvbnN0IGludGVybmFsV2luZG93OiBhbnkgPSBpc1dpbmRvd0V4aXN0cyA/IHdpbmRvdyA6IHVuZGVmaW5lZDtcbmNvbnN0IF9nbG9iYWw6IGFueSA9IGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93IHx8IHR5cGVvZiBzZWxmID09PSAnb2JqZWN0JyAmJiBzZWxmIHx8IGdsb2JhbDtcblxuY29uc3QgUkVNT1ZFX0FUVFJJQlVURSA9ICdyZW1vdmVBdHRyaWJ1dGUnO1xuY29uc3QgTlVMTF9PTl9QUk9QX1ZBTFVFOiBhbnlbXSA9IFtudWxsXTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmRBcmd1bWVudHMoYXJnczogYW55W10sIHNvdXJjZTogc3RyaW5nKTogYW55W10ge1xuICBmb3IgKGxldCBpID0gYXJncy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgIGlmICh0eXBlb2YgYXJnc1tpXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgYXJnc1tpXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUoYXJnc1tpXSwgc291cmNlICsgJ18nICsgaSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBhcmdzO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hQcm90b3R5cGUocHJvdG90eXBlOiBhbnksIGZuTmFtZXM6IHN0cmluZ1tdKSB7XG4gIGNvbnN0IHNvdXJjZSA9IHByb3RvdHlwZS5jb25zdHJ1Y3RvclsnbmFtZSddO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGZuTmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBuYW1lID0gZm5OYW1lc1tpXTtcbiAgICBjb25zdCBkZWxlZ2F0ZSA9IHByb3RvdHlwZVtuYW1lXTtcbiAgICBpZiAoZGVsZWdhdGUpIHtcbiAgICAgIGNvbnN0IHByb3RvdHlwZURlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG90eXBlLCBuYW1lKTtcbiAgICAgIGlmICghaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3RvdHlwZURlc2MpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgcHJvdG90eXBlW25hbWVdID0gKChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IHtcbiAgICAgICAgY29uc3QgcGF0Y2hlZDogYW55ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHRoaXMsIGJpbmRBcmd1bWVudHMoPGFueT5hcmd1bWVudHMsIHNvdXJjZSArICcuJyArIG5hbWUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQsIGRlbGVnYXRlKTtcbiAgICAgICAgcmV0dXJuIHBhdGNoZWQ7XG4gICAgICB9KShkZWxlZ2F0ZSk7XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1Byb3BlcnR5V3JpdGFibGUocHJvcGVydHlEZXNjOiBhbnkpIHtcbiAgaWYgKCFwcm9wZXJ0eURlc2MpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIGlmIChwcm9wZXJ0eURlc2Mud3JpdGFibGUgPT09IGZhbHNlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuICEodHlwZW9mIHByb3BlcnR5RGVzYy5nZXQgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIHByb3BlcnR5RGVzYy5zZXQgPT09ICd1bmRlZmluZWQnKTtcbn1cblxuZXhwb3J0IGNvbnN0IGlzV2ViV29ya2VyOiBib29sZWFuID1cbiAgICAodHlwZW9mIFdvcmtlckdsb2JhbFNjb3BlICE9PSAndW5kZWZpbmVkJyAmJiBzZWxmIGluc3RhbmNlb2YgV29ya2VyR2xvYmFsU2NvcGUpO1xuXG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmV4cG9ydCBjb25zdCBpc05vZGU6IGJvb2xlYW4gPVxuICAgICghKCdudycgaW4gX2dsb2JhbCkgJiYgdHlwZW9mIF9nbG9iYWwucHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiZcbiAgICAge30udG9TdHJpbmcuY2FsbChfZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScpO1xuXG5leHBvcnQgY29uc3QgaXNCcm93c2VyOiBib29sZWFuID1cbiAgICAhaXNOb2RlICYmICFpc1dlYldvcmtlciAmJiAhIShpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvd1snSFRNTEVsZW1lbnQnXSk7XG5cbi8vIHdlIGFyZSBpbiBlbGVjdHJvbiBvZiBudywgc28gd2UgYXJlIGJvdGggYnJvd3NlciBhbmQgbm9kZWpzXG4vLyBNYWtlIHN1cmUgdG8gYWNjZXNzIGBwcm9jZXNzYCB0aHJvdWdoIGBfZ2xvYmFsYCBzbyB0aGF0IFdlYlBhY2sgZG9lcyBub3QgYWNjaWRlbnRhbGx5IGJyb3dzZXJpZnlcbi8vIHRoaXMgY29kZS5cbmV4cG9ydCBjb25zdCBpc01peDogYm9vbGVhbiA9IHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAge30udG9TdHJpbmcuY2FsbChfZ2xvYmFsLnByb2Nlc3MpID09PSAnW29iamVjdCBwcm9jZXNzXScgJiYgIWlzV2ViV29ya2VyICYmXG4gICAgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuXG5jb25zdCB6b25lU3ltYm9sRXZlbnROYW1lczoge1tldmVudE5hbWU6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcblxuY29uc3Qgd3JhcEZuID0gZnVuY3Rpb24oZXZlbnQ6IEV2ZW50KSB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzkxMSwgaW4gSUUsIHNvbWV0aW1lc1xuICAvLyBldmVudCB3aWxsIGJlIHVuZGVmaW5lZCwgc28gd2UgbmVlZCB0byB1c2Ugd2luZG93LmV2ZW50XG4gIGV2ZW50ID0gZXZlbnQgfHwgX2dsb2JhbC5ldmVudDtcbiAgaWYgKCFldmVudCkge1xuICAgIHJldHVybjtcbiAgfVxuICBsZXQgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnQudHlwZV07XG4gIGlmICghZXZlbnROYW1lU3ltYm9sKSB7XG4gICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnQudHlwZV0gPSB6b25lU3ltYm9sKCdPTl9QUk9QRVJUWScgKyBldmVudC50eXBlKTtcbiAgfVxuICBjb25zdCB0YXJnZXQgPSB0aGlzIHx8IGV2ZW50LnRhcmdldCB8fCBfZ2xvYmFsO1xuICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICBsZXQgcmVzdWx0O1xuICBpZiAoaXNCcm93c2VyICYmIHRhcmdldCA9PT0gaW50ZXJuYWxXaW5kb3cgJiYgZXZlbnQudHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIC8vIHdpbmRvdy5vbmVycm9yIGhhdmUgZGlmZmVyZW50IHNpZ25pdHVyZVxuICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9HbG9iYWxFdmVudEhhbmRsZXJzL29uZXJyb3Ijd2luZG93Lm9uZXJyb3JcbiAgICAvLyBhbmQgb25lcnJvciBjYWxsYmFjayB3aWxsIHByZXZlbnQgZGVmYXVsdCB3aGVuIGNhbGxiYWNrIHJldHVybiB0cnVlXG4gICAgY29uc3QgZXJyb3JFdmVudDogRXJyb3JFdmVudCA9IGV2ZW50IGFzIGFueTtcbiAgICByZXN1bHQgPSBsaXN0ZW5lciAmJlxuICAgICAgICBsaXN0ZW5lci5jYWxsKFxuICAgICAgICAgICAgdGhpcywgZXJyb3JFdmVudC5tZXNzYWdlLCBlcnJvckV2ZW50LmZpbGVuYW1lLCBlcnJvckV2ZW50LmxpbmVubywgZXJyb3JFdmVudC5jb2xubyxcbiAgICAgICAgICAgIGVycm9yRXZlbnQuZXJyb3IpO1xuICAgIGlmIChyZXN1bHQgPT09IHRydWUpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJlc3VsdCA9IGxpc3RlbmVyICYmIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHJlc3VsdCAhPSB1bmRlZmluZWQgJiYgIXJlc3VsdCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoUHJvcGVydHkob2JqOiBhbnksIHByb3A6IHN0cmluZywgcHJvdG90eXBlPzogYW55KSB7XG4gIGxldCBkZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gIGlmICghZGVzYyAmJiBwcm90b3R5cGUpIHtcbiAgICAvLyB3aGVuIHBhdGNoIHdpbmRvdyBvYmplY3QsIHVzZSBwcm90b3R5cGUgdG8gY2hlY2sgcHJvcCBleGlzdCBvciBub3RcbiAgICBjb25zdCBwcm90b3R5cGVEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgcHJvcCk7XG4gICAgaWYgKHByb3RvdHlwZURlc2MpIHtcbiAgICAgIGRlc2MgPSB7ZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlfTtcbiAgICB9XG4gIH1cbiAgLy8gaWYgdGhlIGRlc2NyaXB0b3Igbm90IGV4aXN0cyBvciBpcyBub3QgY29uZmlndXJhYmxlXG4gIC8vIGp1c3QgcmV0dXJuXG4gIGlmICghZGVzYyB8fCAhZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBvblByb3BQYXRjaGVkU3ltYm9sID0gem9uZVN5bWJvbCgnb24nICsgcHJvcCArICdwYXRjaGVkJyk7XG4gIGlmIChvYmouaGFzT3duUHJvcGVydHkob25Qcm9wUGF0Y2hlZFN5bWJvbCkgJiYgb2JqW29uUHJvcFBhdGNoZWRTeW1ib2xdKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgLy8gQSBwcm9wZXJ0eSBkZXNjcmlwdG9yIGNhbm5vdCBoYXZlIGdldHRlci9zZXR0ZXIgYW5kIGJlIHdyaXRhYmxlXG4gIC8vIGRlbGV0aW5nIHRoZSB3cml0YWJsZSBhbmQgdmFsdWUgcHJvcGVydGllcyBhdm9pZHMgdGhpcyBlcnJvcjpcbiAgLy9cbiAgLy8gVHlwZUVycm9yOiBwcm9wZXJ0eSBkZXNjcmlwdG9ycyBtdXN0IG5vdCBzcGVjaWZ5IGEgdmFsdWUgb3IgYmUgd3JpdGFibGUgd2hlbiBhXG4gIC8vIGdldHRlciBvciBzZXR0ZXIgaGFzIGJlZW4gc3BlY2lmaWVkXG4gIGRlbGV0ZSBkZXNjLndyaXRhYmxlO1xuICBkZWxldGUgZGVzYy52YWx1ZTtcbiAgY29uc3Qgb3JpZ2luYWxEZXNjR2V0ID0gZGVzYy5nZXQ7XG4gIGNvbnN0IG9yaWdpbmFsRGVzY1NldCA9IGRlc2Muc2V0O1xuXG4gIC8vIHN1YnN0cigyKSBjdXogJ29uY2xpY2snIC0+ICdjbGljaycsIGV0Y1xuICBjb25zdCBldmVudE5hbWUgPSBwcm9wLnN1YnN0cigyKTtcblxuICBsZXQgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXTtcbiAgaWYgKCFldmVudE5hbWVTeW1ib2wpIHtcbiAgICBldmVudE5hbWVTeW1ib2wgPSB6b25lU3ltYm9sRXZlbnROYW1lc1tldmVudE5hbWVdID0gem9uZVN5bWJvbCgnT05fUFJPUEVSVFknICsgZXZlbnROYW1lKTtcbiAgfVxuXG4gIGRlc2Muc2V0ID0gZnVuY3Rpb24obmV3VmFsdWUpIHtcbiAgICAvLyBpbiBzb21lIG9mIHdpbmRvd3MncyBvbnByb3BlcnR5IGNhbGxiYWNrLCB0aGlzIGlzIHVuZGVmaW5lZFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgaXRcbiAgICBsZXQgdGFyZ2V0ID0gdGhpcztcbiAgICBpZiAoIXRhcmdldCAmJiBvYmogPT09IF9nbG9iYWwpIHtcbiAgICAgIHRhcmdldCA9IF9nbG9iYWw7XG4gICAgfVxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCBwcmV2aW91c1ZhbHVlID0gdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF07XG4gICAgaWYgKHByZXZpb3VzVmFsdWUpIHtcbiAgICAgIHRhcmdldC5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuKTtcbiAgICB9XG5cbiAgICAvLyBpc3N1ZSAjOTc4LCB3aGVuIG9ubG9hZCBoYW5kbGVyIHdhcyBhZGRlZCBiZWZvcmUgbG9hZGluZyB6b25lLmpzXG4gICAgLy8gd2Ugc2hvdWxkIHJlbW92ZSBpdCB3aXRoIG9yaWdpbmFsRGVzY1NldFxuICAgIGlmIChvcmlnaW5hbERlc2NTZXQpIHtcbiAgICAgIG9yaWdpbmFsRGVzY1NldC5hcHBseSh0YXJnZXQsIE5VTExfT05fUFJPUF9WQUxVRSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGFyZ2V0W2V2ZW50TmFtZVN5bWJvbF0gPSBuZXdWYWx1ZTtcbiAgICAgIHRhcmdldC5hZGRFdmVudExpc3RlbmVyKGV2ZW50TmFtZSwgd3JhcEZuLCBmYWxzZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRhcmdldFtldmVudE5hbWVTeW1ib2xdID0gbnVsbDtcbiAgICB9XG4gIH07XG5cbiAgLy8gVGhlIGdldHRlciB3b3VsZCByZXR1cm4gdW5kZWZpbmVkIGZvciB1bmFzc2lnbmVkIHByb3BlcnRpZXMgYnV0IHRoZSBkZWZhdWx0IHZhbHVlIG9mIGFuXG4gIC8vIHVuYXNzaWduZWQgcHJvcGVydHkgaXMgbnVsbFxuICBkZXNjLmdldCA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIGluIHNvbWUgb2Ygd2luZG93cydzIG9ucHJvcGVydHkgY2FsbGJhY2ssIHRoaXMgaXMgdW5kZWZpbmVkXG4gICAgLy8gc28gd2UgbmVlZCB0byBjaGVjayBpdFxuICAgIGxldCB0YXJnZXQgPSB0aGlzO1xuICAgIGlmICghdGFyZ2V0ICYmIG9iaiA9PT0gX2dsb2JhbCkge1xuICAgICAgdGFyZ2V0ID0gX2dsb2JhbDtcbiAgICB9XG4gICAgaWYgKCF0YXJnZXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCBsaXN0ZW5lciA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgIGlmIChsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIGxpc3RlbmVyO1xuICAgIH0gZWxzZSBpZiAob3JpZ2luYWxEZXNjR2V0KSB7XG4gICAgICAvLyByZXN1bHQgd2lsbCBiZSBudWxsIHdoZW4gdXNlIGlubGluZSBldmVudCBhdHRyaWJ1dGUsXG4gICAgICAvLyBzdWNoIGFzIDxidXR0b24gb25jbGljaz1cImZ1bmMoKTtcIj5PSzwvYnV0dG9uPlxuICAgICAgLy8gYmVjYXVzZSB0aGUgb25jbGljayBmdW5jdGlvbiBpcyBpbnRlcm5hbCByYXcgdW5jb21waWxlZCBoYW5kbGVyXG4gICAgICAvLyB0aGUgb25jbGljayB3aWxsIGJlIGV2YWx1YXRlZCB3aGVuIGZpcnN0IHRpbWUgZXZlbnQgd2FzIHRyaWdnZXJlZCBvclxuICAgICAgLy8gdGhlIHByb3BlcnR5IGlzIGFjY2Vzc2VkLCBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy81MjVcbiAgICAgIC8vIHNvIHdlIHNob3VsZCB1c2Ugb3JpZ2luYWwgbmF0aXZlIGdldCB0byByZXRyaWV2ZSB0aGUgaGFuZGxlclxuICAgICAgbGV0IHZhbHVlID0gb3JpZ2luYWxEZXNjR2V0ICYmIG9yaWdpbmFsRGVzY0dldC5jYWxsKHRoaXMpO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGRlc2MhLnNldCEuY2FsbCh0aGlzLCB2YWx1ZSk7XG4gICAgICAgIGlmICh0eXBlb2YgdGFyZ2V0W1JFTU9WRV9BVFRSSUJVVEVdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgdGFyZ2V0LnJlbW92ZUF0dHJpYnV0ZShwcm9wKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9O1xuXG4gIE9iamVjdERlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYyk7XG5cbiAgb2JqW29uUHJvcFBhdGNoZWRTeW1ib2xdID0gdHJ1ZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoT25Qcm9wZXJ0aWVzKG9iajogYW55LCBwcm9wZXJ0aWVzOiBzdHJpbmdbXXxudWxsLCBwcm90b3R5cGU/OiBhbnkpIHtcbiAgaWYgKHByb3BlcnRpZXMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHBhdGNoUHJvcGVydHkob2JqLCAnb24nICsgcHJvcGVydGllc1tpXSwgcHJvdG90eXBlKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgY29uc3Qgb25Qcm9wZXJ0aWVzID0gW107XG4gICAgZm9yIChjb25zdCBwcm9wIGluIG9iaikge1xuICAgICAgaWYgKHByb3Auc3Vic3RyKDAsIDIpID09ICdvbicpIHtcbiAgICAgICAgb25Qcm9wZXJ0aWVzLnB1c2gocHJvcCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgb25Qcm9wZXJ0aWVzLmxlbmd0aDsgaisrKSB7XG4gICAgICBwYXRjaFByb3BlcnR5KG9iaiwgb25Qcm9wZXJ0aWVzW2pdLCBwcm90b3R5cGUpO1xuICAgIH1cbiAgfVxufVxuXG5jb25zdCBvcmlnaW5hbEluc3RhbmNlS2V5ID0gem9uZVN5bWJvbCgnb3JpZ2luYWxJbnN0YW5jZScpO1xuXG4vLyB3cmFwIHNvbWUgbmF0aXZlIEFQSSBvbiBgd2luZG93YFxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoQ2xhc3MoY2xhc3NOYW1lOiBzdHJpbmcpIHtcbiAgY29uc3QgT3JpZ2luYWxDbGFzcyA9IF9nbG9iYWxbY2xhc3NOYW1lXTtcbiAgaWYgKCFPcmlnaW5hbENsYXNzKSByZXR1cm47XG4gIC8vIGtlZXAgb3JpZ2luYWwgY2xhc3MgaW4gZ2xvYmFsXG4gIF9nbG9iYWxbem9uZVN5bWJvbChjbGFzc05hbWUpXSA9IE9yaWdpbmFsQ2xhc3M7XG5cbiAgX2dsb2JhbFtjbGFzc05hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgY29uc3QgYSA9IGJpbmRBcmd1bWVudHMoPGFueT5hcmd1bWVudHMsIGNsYXNzTmFtZSk7XG4gICAgc3dpdGNoIChhLmxlbmd0aCkge1xuICAgICAgY2FzZSAwOlxuICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDE6XG4gICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDQ6XG4gICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0gPSBuZXcgT3JpZ2luYWxDbGFzcyhhWzBdLCBhWzFdLCBhWzJdLCBhWzNdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0FyZyBsaXN0IHRvbyBsb25nLicpO1xuICAgIH1cbiAgfTtcblxuICAvLyBhdHRhY2ggb3JpZ2luYWwgZGVsZWdhdGUgdG8gcGF0Y2hlZCBmdW5jdGlvblxuICBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQoX2dsb2JhbFtjbGFzc05hbWVdLCBPcmlnaW5hbENsYXNzKTtcblxuICBjb25zdCBpbnN0YW5jZSA9IG5ldyBPcmlnaW5hbENsYXNzKGZ1bmN0aW9uKCkge30pO1xuXG4gIGxldCBwcm9wO1xuICBmb3IgKHByb3AgaW4gaW5zdGFuY2UpIHtcbiAgICAvLyBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9NDQ3MjFcbiAgICBpZiAoY2xhc3NOYW1lID09PSAnWE1MSHR0cFJlcXVlc3QnICYmIHByb3AgPT09ICdyZXNwb25zZUJsb2InKSBjb250aW51ZTtcbiAgICAoZnVuY3Rpb24ocHJvcCkge1xuICAgICAgaWYgKHR5cGVvZiBpbnN0YW5jZVtwcm9wXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBfZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0uYXBwbHkodGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSwgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KF9nbG9iYWxbY2xhc3NOYW1lXS5wcm90b3R5cGUsIHByb3AsIHtcbiAgICAgICAgICBzZXQ6IGZ1bmN0aW9uKGZuKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGZuID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0gPSB3cmFwV2l0aEN1cnJlbnRab25lKGZuLCBjbGFzc05hbWUgKyAnLicgKyBwcm9wKTtcbiAgICAgICAgICAgICAgLy8ga2VlcCBjYWxsYmFjayBpbiB3cmFwcGVkIGZ1bmN0aW9uIHNvIHdlIGNhblxuICAgICAgICAgICAgICAvLyB1c2UgaXQgaW4gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nIHRvIHJldHVyblxuICAgICAgICAgICAgICAvLyB0aGUgbmF0aXZlIG9uZS5cbiAgICAgICAgICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0sIGZuKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF0gPSBmbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuICAgICAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XVtwcm9wXTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0ocHJvcCkpO1xuICB9XG5cbiAgZm9yIChwcm9wIGluIE9yaWdpbmFsQ2xhc3MpIHtcbiAgICBpZiAocHJvcCAhPT0gJ3Byb3RvdHlwZScgJiYgT3JpZ2luYWxDbGFzcy5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgX2dsb2JhbFtjbGFzc05hbWVdW3Byb3BdID0gT3JpZ2luYWxDbGFzc1twcm9wXTtcbiAgICB9XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNvcHlTeW1ib2xQcm9wZXJ0aWVzKHNyYzogYW55LCBkZXN0OiBhbnkpIHtcbiAgaWYgKHR5cGVvZiAoT2JqZWN0IGFzIGFueSkuZ2V0T3duUHJvcGVydHlTeW1ib2xzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHN5bWJvbHM6IGFueSA9IChPYmplY3QgYXMgYW55KS5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMoc3JjKTtcbiAgc3ltYm9scy5mb3JFYWNoKChzeW1ib2w6IGFueSkgPT4ge1xuICAgIGNvbnN0IGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNyYywgc3ltYm9sKTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGVzdCwgc3ltYm9sLCB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gc3JjW3N5bWJvbF07XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZTogYW55KSB7XG4gICAgICAgIGlmIChkZXNjICYmICghZGVzYy53cml0YWJsZSB8fCB0eXBlb2YgZGVzYy5zZXQgIT09ICdmdW5jdGlvbicpKSB7XG4gICAgICAgICAgLy8gaWYgc3JjW3N5bWJvbF0gaXMgbm90IHdyaXRhYmxlIG9yIG5vdCBoYXZlIGEgc2V0dGVyLCBqdXN0IHJldHVyblxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzcmNbc3ltYm9sXSA9IHZhbHVlO1xuICAgICAgfSxcbiAgICAgIGVudW1lcmFibGU6IGRlc2MgPyBkZXNjLmVudW1lcmFibGUgOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiBkZXNjID8gZGVzYy5jb25maWd1cmFibGUgOiB0cnVlXG4gICAgfSk7XG4gIH0pO1xufVxuXG5sZXQgc2hvdWxkQ29weVN5bWJvbFByb3BlcnRpZXMgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIHNldFNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzKGZsYWc6IGJvb2xlYW4pIHtcbiAgc2hvdWxkQ29weVN5bWJvbFByb3BlcnRpZXMgPSBmbGFnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hNZXRob2QoXG4gICAgdGFyZ2V0OiBhbnksIG5hbWU6IHN0cmluZyxcbiAgICBwYXRjaEZuOiAoZGVsZWdhdGU6IEZ1bmN0aW9uLCBkZWxlZ2F0ZU5hbWU6IHN0cmluZywgbmFtZTogc3RyaW5nKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT5cbiAgICAgICAgYW55KTogRnVuY3Rpb258bnVsbCB7XG4gIGxldCBwcm90byA9IHRhcmdldDtcbiAgd2hpbGUgKHByb3RvICYmICFwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgIHByb3RvID0gT2JqZWN0R2V0UHJvdG90eXBlT2YocHJvdG8pO1xuICB9XG4gIGlmICghcHJvdG8gJiYgdGFyZ2V0W25hbWVdKSB7XG4gICAgLy8gc29tZWhvdyB3ZSBkaWQgbm90IGZpbmQgaXQsIGJ1dCB3ZSBjYW4gc2VlIGl0LiBUaGlzIGhhcHBlbnMgb24gSUUgZm9yIFdpbmRvdyBwcm9wZXJ0aWVzLlxuICAgIHByb3RvID0gdGFyZ2V0O1xuICB9XG5cbiAgY29uc3QgZGVsZWdhdGVOYW1lID0gem9uZVN5bWJvbChuYW1lKTtcbiAgbGV0IGRlbGVnYXRlOiBGdW5jdGlvbnxudWxsID0gbnVsbDtcbiAgaWYgKHByb3RvICYmICEoZGVsZWdhdGUgPSBwcm90b1tkZWxlZ2F0ZU5hbWVdKSkge1xuICAgIGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSA9IHByb3RvW25hbWVdO1xuICAgIC8vIGNoZWNrIHdoZXRoZXIgcHJvdG9bbmFtZV0gaXMgd3JpdGFibGVcbiAgICAvLyBzb21lIHByb3BlcnR5IGlzIHJlYWRvbmx5IGluIHNhZmFyaSwgc3VjaCBhcyBIdG1sQ2FudmFzRWxlbWVudC5wcm90b3R5cGUudG9CbG9iXG4gICAgY29uc3QgZGVzYyA9IHByb3RvICYmIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSk7XG4gICAgaWYgKGlzUHJvcGVydHlXcml0YWJsZShkZXNjKSkge1xuICAgICAgY29uc3QgcGF0Y2hEZWxlZ2F0ZSA9IHBhdGNoRm4oZGVsZWdhdGUhLCBkZWxlZ2F0ZU5hbWUsIG5hbWUpO1xuICAgICAgcHJvdG9bbmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHBhdGNoRGVsZWdhdGUodGhpcywgYXJndW1lbnRzIGFzIGFueSk7XG4gICAgICB9O1xuICAgICAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHByb3RvW25hbWVdLCBkZWxlZ2F0ZSk7XG4gICAgICBpZiAoc2hvdWxkQ29weVN5bWJvbFByb3BlcnRpZXMpIHtcbiAgICAgICAgY29weVN5bWJvbFByb3BlcnRpZXMoZGVsZWdhdGUsIHByb3RvW25hbWVdKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlbGVnYXRlO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIE1hY3JvVGFza01ldGEgZXh0ZW5kcyBUYXNrRGF0YSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdGFyZ2V0OiBhbnk7XG4gIGNiSWR4OiBudW1iZXI7XG4gIGFyZ3M6IGFueVtdO1xufVxuXG4vLyBUT0RPOiBASmlhTGlQYXNzaW9uLCBzdXBwb3J0IGNhbmNlbCB0YXNrIGxhdGVyIGlmIG5lY2Vzc2FyeVxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoTWFjcm9UYXNrKFxuICAgIG9iajogYW55LCBmdW5jTmFtZTogc3RyaW5nLCBtZXRhQ3JlYXRvcjogKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IE1hY3JvVGFza01ldGEpIHtcbiAgbGV0IHNldE5hdGl2ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2s6IFRhc2spIHtcbiAgICBjb25zdCBkYXRhID0gPE1hY3JvVGFza01ldGE+dGFzay5kYXRhO1xuICAgIGRhdGEuYXJnc1tkYXRhLmNiSWR4XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHNldE5hdGl2ZSEuYXBwbHkoZGF0YS50YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cblxuICBzZXROYXRpdmUgPSBwYXRjaE1ldGhvZChvYmosIGZ1bmNOYW1lLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbihzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3QgbWV0YSA9IG1ldGFDcmVhdG9yKHNlbGYsIGFyZ3MpO1xuICAgIGlmIChtZXRhLmNiSWR4ID49IDAgJiYgdHlwZW9mIGFyZ3NbbWV0YS5jYklkeF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZShtZXRhLm5hbWUsIGFyZ3NbbWV0YS5jYklkeF0sIG1ldGEsIHNjaGVkdWxlVGFzayk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGNhdXNlIGFuIGVycm9yIGJ5IGNhbGxpbmcgaXQgZGlyZWN0bHkuXG4gICAgICByZXR1cm4gZGVsZWdhdGUuYXBwbHkoc2VsZiwgYXJncyk7XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNaWNyb1Rhc2tNZXRhIGV4dGVuZHMgVGFza0RhdGEge1xuICBuYW1lOiBzdHJpbmc7XG4gIHRhcmdldDogYW55O1xuICBjYklkeDogbnVtYmVyO1xuICBhcmdzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoTWljcm9UYXNrKFxuICAgIG9iajogYW55LCBmdW5jTmFtZTogc3RyaW5nLCBtZXRhQ3JlYXRvcjogKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IE1pY3JvVGFza01ldGEpIHtcbiAgbGV0IHNldE5hdGl2ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2s6IFRhc2spIHtcbiAgICBjb25zdCBkYXRhID0gPE1hY3JvVGFza01ldGE+dGFzay5kYXRhO1xuICAgIGRhdGEuYXJnc1tkYXRhLmNiSWR4XSA9IGZ1bmN0aW9uKCkge1xuICAgICAgdGFzay5pbnZva2UuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9O1xuICAgIHNldE5hdGl2ZSEuYXBwbHkoZGF0YS50YXJnZXQsIGRhdGEuYXJncyk7XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cblxuICBzZXROYXRpdmUgPSBwYXRjaE1ldGhvZChvYmosIGZ1bmNOYW1lLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbihzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSB7XG4gICAgY29uc3QgbWV0YSA9IG1ldGFDcmVhdG9yKHNlbGYsIGFyZ3MpO1xuICAgIGlmIChtZXRhLmNiSWR4ID49IDAgJiYgdHlwZW9mIGFyZ3NbbWV0YS5jYklkeF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBab25lLmN1cnJlbnQuc2NoZWR1bGVNaWNyb1Rhc2sobWV0YS5uYW1lLCBhcmdzW21ldGEuY2JJZHhdLCBtZXRhLCBzY2hlZHVsZVRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdHRhY2hPcmlnaW5Ub1BhdGNoZWQocGF0Y2hlZDogRnVuY3Rpb24sIG9yaWdpbmFsOiBhbnkpIHtcbiAgKHBhdGNoZWQgYXMgYW55KVt6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyldID0gb3JpZ2luYWw7XG59XG5cbmxldCBpc0RldGVjdGVkSUVPckVkZ2UgPSBmYWxzZTtcbmxldCBpZU9yRWRnZSA9IGZhbHNlO1xuXG5leHBvcnQgZnVuY3Rpb24gaXNJRSgpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCB1YSA9IGludGVybmFsV2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgaWYgKHVhLmluZGV4T2YoJ01TSUUgJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgIT09IC0xKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJRU9yRWRnZSgpIHtcbiAgaWYgKGlzRGV0ZWN0ZWRJRU9yRWRnZSkge1xuICAgIHJldHVybiBpZU9yRWRnZTtcbiAgfVxuXG4gIGlzRGV0ZWN0ZWRJRU9yRWRnZSA9IHRydWU7XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1YSA9IGludGVybmFsV2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQ7XG4gICAgaWYgKHVhLmluZGV4T2YoJ01TSUUgJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ1RyaWRlbnQvJykgIT09IC0xIHx8IHVhLmluZGV4T2YoJ0VkZ2UvJykgIT09IC0xKSB7XG4gICAgICBpZU9yRWRnZSA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiBpZU9yRWRnZTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgfVxufVxuIl19