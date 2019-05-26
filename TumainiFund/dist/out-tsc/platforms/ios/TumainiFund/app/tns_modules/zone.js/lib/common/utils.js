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
    }
    catch (error) {
    }
    return ieOrEdge;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0g7Ozs7R0FJRztBQUVILG9EQUFvRDtBQUNwRCxzQ0FBc0M7QUFDdEMsTUFBTSxDQUFDLE1BQU0sOEJBQThCLEdBQUcsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQzlFLDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzFELDRCQUE0QjtBQUM1QixNQUFNLENBQUMsTUFBTSxvQkFBb0IsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzFELG9CQUFvQjtBQUNwQixNQUFNLENBQUMsTUFBTSxZQUFZLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQyw0QkFBNEI7QUFDNUIsTUFBTSxDQUFDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO0FBQ2hELG9DQUFvQztBQUNwQyxNQUFNLENBQUMsTUFBTSxzQkFBc0IsR0FBRyxrQkFBa0IsQ0FBQztBQUN6RCx1Q0FBdUM7QUFDdkMsTUFBTSxDQUFDLE1BQU0seUJBQXlCLEdBQUcscUJBQXFCLENBQUM7QUFDL0Qsa0NBQWtDO0FBQ2xDLE1BQU0sQ0FBQyxNQUFNLDhCQUE4QixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUN0RixxQ0FBcUM7QUFDckMsTUFBTSxDQUFDLE1BQU0saUNBQWlDLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0FBQzVGLHdCQUF3QjtBQUN4QixNQUFNLENBQUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDO0FB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QUFDLElBQUksRUFBRSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtZQUM3RixRQUFRLEdBQUcsSUFBSSxDQUFDO1NBQ2pCO0tBQ0Y7SUFBQyxPQUFPLEtBQUssRUFBRTtLQUNmO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogU3VwcHJlc3MgY2xvc3VyZSBjb21waWxlciBlcnJvcnMgYWJvdXQgdW5rbm93biAnWm9uZScgdmFyaWFibGVcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7dW5kZWZpbmVkVmFycyxnbG9iYWxUaGlzLG1pc3NpbmdSZXF1aXJlfVxuICovXG5cbi8vIGlzc3VlICM5ODksIHRvIHJlZHVjZSBidW5kbGUgc2l6ZSwgdXNlIHNob3J0IG5hbWVcbi8qKiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yICovXG5leHBvcnQgY29uc3QgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbi8qKiBPYmplY3QuZGVmaW5lUHJvcGVydHkgKi9cbmV4cG9ydCBjb25zdCBPYmplY3REZWZpbmVQcm9wZXJ0eSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbi8qKiBPYmplY3QuZ2V0UHJvdG90eXBlT2YgKi9cbmV4cG9ydCBjb25zdCBPYmplY3RHZXRQcm90b3R5cGVPZiA9IE9iamVjdC5nZXRQcm90b3R5cGVPZjtcbi8qKiBPYmplY3QuY3JlYXRlICovXG5leHBvcnQgY29uc3QgT2JqZWN0Q3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbi8qKiBBcnJheS5wcm90b3R5cGUuc2xpY2UgKi9cbmV4cG9ydCBjb25zdCBBcnJheVNsaWNlID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xuLyoqIGFkZEV2ZW50TGlzdGVuZXIgc3RyaW5nIGNvbnN0ICovXG5leHBvcnQgY29uc3QgQUREX0VWRU5UX0xJU1RFTkVSX1NUUiA9ICdhZGRFdmVudExpc3RlbmVyJztcbi8qKiByZW1vdmVFdmVudExpc3RlbmVyIHN0cmluZyBjb25zdCAqL1xuZXhwb3J0IGNvbnN0IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIgPSAncmVtb3ZlRXZlbnRMaXN0ZW5lcic7XG4vKiogem9uZVN5bWJvbCBhZGRFdmVudExpc3RlbmVyICovXG5leHBvcnQgY29uc3QgWk9ORV9TWU1CT0xfQUREX0VWRU5UX0xJU1RFTkVSID0gWm9uZS5fX3N5bWJvbF9fKEFERF9FVkVOVF9MSVNURU5FUl9TVFIpO1xuLyoqIHpvbmVTeW1ib2wgcmVtb3ZlRXZlbnRMaXN0ZW5lciAqL1xuZXhwb3J0IGNvbnN0IFpPTkVfU1lNQk9MX1JFTU9WRV9FVkVOVF9MSVNURU5FUiA9IFpvbmUuX19zeW1ib2xfXyhSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSKTtcbi8qKiB0cnVlIHN0cmluZyBjb25zdCAqL1xuZXhwb3J0IGNvbnN0IFRSVUVfU1RSID0gJ3RydWUnO1xuLyoqIGZhbHNlIHN0cmluZyBjb25zdCAqL1xuZXhwb3J0IGNvbnN0IEZBTFNFX1NUUiA9ICdmYWxzZSc7XG4vKiogX196b25lX3N5bWJvbF9fIHN0cmluZyBjb25zdCAqL1xuZXhwb3J0IGNvbnN0IFpPTkVfU1lNQk9MX1BSRUZJWCA9ICdfX3pvbmVfc3ltYm9sX18nO1xuXG5leHBvcnQgZnVuY3Rpb24gd3JhcFdpdGhDdXJyZW50Wm9uZTxUIGV4dGVuZHMgRnVuY3Rpb24+KGNhbGxiYWNrOiBULCBzb3VyY2U6IHN0cmluZyk6IFQge1xuICByZXR1cm4gWm9uZS5jdXJyZW50LndyYXAoY2FsbGJhY2ssIHNvdXJjZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZShcbiAgICBzb3VyY2U6IHN0cmluZywgY2FsbGJhY2s6IEZ1bmN0aW9uLCBkYXRhPzogVGFza0RhdGEsIGN1c3RvbVNjaGVkdWxlPzogKHRhc2s6IFRhc2spID0+IHZvaWQsXG4gICAgY3VzdG9tQ2FuY2VsPzogKHRhc2s6IFRhc2spID0+IHZvaWQpOiBNYWNyb1Rhc2sge1xuICByZXR1cm4gWm9uZS5jdXJyZW50LnNjaGVkdWxlTWFjcm9UYXNrKHNvdXJjZSwgY2FsbGJhY2ssIGRhdGEsIGN1c3RvbVNjaGVkdWxlLCBjdXN0b21DYW5jZWwpO1xufVxuXG4vLyBIYWNrIHNpbmNlIFR5cGVTY3JpcHQgaXNuJ3QgY29tcGlsaW5nIHRoaXMgZm9yIGEgd29ya2VyLlxuZGVjbGFyZSBjb25zdCBXb3JrZXJHbG9iYWxTY29wZTogYW55O1xuXG5leHBvcnQgY29uc3Qgem9uZVN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXztcbmNvbnN0IGlzV2luZG93RXhpc3RzID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCc7XG5jb25zdCBpbnRlcm5hbFdpbmRvdzogYW55ID0gaXNXaW5kb3dFeGlzdHMgPyB3aW5kb3cgOiB1bmRlZmluZWQ7XG5jb25zdCBfZ2xvYmFsOiBhbnkgPSBpc1dpbmRvd0V4aXN0cyAmJiBpbnRlcm5hbFdpbmRvdyB8fCB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZiB8fCBnbG9iYWw7XG5cbmNvbnN0IFJFTU9WRV9BVFRSSUJVVEUgPSAncmVtb3ZlQXR0cmlidXRlJztcbmNvbnN0IE5VTExfT05fUFJPUF9WQUxVRTogW2FueV0gPSBbbnVsbF07XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kQXJndW1lbnRzKGFyZ3M6IGFueVtdLCBzb3VyY2U6IHN0cmluZyk6IGFueVtdIHtcbiAgZm9yIChsZXQgaSA9IGFyZ3MubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICBpZiAodHlwZW9mIGFyZ3NbaV0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGFyZ3NbaV0gPSB3cmFwV2l0aEN1cnJlbnRab25lKGFyZ3NbaV0sIHNvdXJjZSArICdfJyArIGkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gYXJncztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoUHJvdG90eXBlKHByb3RvdHlwZTogYW55LCBmbk5hbWVzOiBzdHJpbmdbXSkge1xuICBjb25zdCBzb3VyY2UgPSBwcm90b3R5cGUuY29uc3RydWN0b3JbJ25hbWUnXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBmbk5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgbmFtZSA9IGZuTmFtZXNbaV07XG4gICAgY29uc3QgZGVsZWdhdGUgPSBwcm90b3R5cGVbbmFtZV07XG4gICAgaWYgKGRlbGVnYXRlKSB7XG4gICAgICBjb25zdCBwcm90b3R5cGVEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgbmFtZSk7XG4gICAgICBpZiAoIWlzUHJvcGVydHlXcml0YWJsZShwcm90b3R5cGVEZXNjKSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHByb3RvdHlwZVtuYW1lXSA9ICgoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiB7XG4gICAgICAgIGNvbnN0IHBhdGNoZWQ6IGFueSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh0aGlzLCBiaW5kQXJndW1lbnRzKDxhbnk+YXJndW1lbnRzLCBzb3VyY2UgKyAnLicgKyBuYW1lKSk7XG4gICAgICAgIH07XG4gICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwYXRjaGVkLCBkZWxlZ2F0ZSk7XG4gICAgICAgIHJldHVybiBwYXRjaGVkO1xuICAgICAgfSkoZGVsZWdhdGUpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9wZXJ0eVdyaXRhYmxlKHByb3BlcnR5RGVzYzogYW55KSB7XG4gIGlmICghcHJvcGVydHlEZXNjKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBpZiAocHJvcGVydHlEZXNjLndyaXRhYmxlID09PSBmYWxzZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiAhKHR5cGVvZiBwcm9wZXJ0eURlc2MuZ2V0ID09PSAnZnVuY3Rpb24nICYmIHR5cGVvZiBwcm9wZXJ0eURlc2Muc2V0ID09PSAndW5kZWZpbmVkJyk7XG59XG5cbmV4cG9ydCBjb25zdCBpc1dlYldvcmtlcjogYm9vbGVhbiA9XG4gICAgKHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZiBpbnN0YW5jZW9mIFdvcmtlckdsb2JhbFNjb3BlKTtcblxuLy8gTWFrZSBzdXJlIHRvIGFjY2VzcyBgcHJvY2Vzc2AgdGhyb3VnaCBgX2dsb2JhbGAgc28gdGhhdCBXZWJQYWNrIGRvZXMgbm90IGFjY2lkZW50YWxseSBicm93c2VyaWZ5XG4vLyB0aGlzIGNvZGUuXG5leHBvcnQgY29uc3QgaXNOb2RlOiBib29sZWFuID1cbiAgICAoISgnbncnIGluIF9nbG9iYWwpICYmIHR5cGVvZiBfZ2xvYmFsLnByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmXG4gICAgIHt9LnRvU3RyaW5nLmNhbGwoX2dsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nKTtcblxuZXhwb3J0IGNvbnN0IGlzQnJvd3NlcjogYm9vbGVhbiA9XG4gICAgIWlzTm9kZSAmJiAhaXNXZWJXb3JrZXIgJiYgISEoaXNXaW5kb3dFeGlzdHMgJiYgaW50ZXJuYWxXaW5kb3dbJ0hUTUxFbGVtZW50J10pO1xuXG4vLyB3ZSBhcmUgaW4gZWxlY3Ryb24gb2YgbncsIHNvIHdlIGFyZSBib3RoIGJyb3dzZXIgYW5kIG5vZGVqc1xuLy8gTWFrZSBzdXJlIHRvIGFjY2VzcyBgcHJvY2Vzc2AgdGhyb3VnaCBgX2dsb2JhbGAgc28gdGhhdCBXZWJQYWNrIGRvZXMgbm90IGFjY2lkZW50YWxseSBicm93c2VyaWZ5XG4vLyB0aGlzIGNvZGUuXG5leHBvcnQgY29uc3QgaXNNaXg6IGJvb2xlYW4gPSB0eXBlb2YgX2dsb2JhbC5wcm9jZXNzICE9PSAndW5kZWZpbmVkJyAmJlxuICAgIHt9LnRvU3RyaW5nLmNhbGwoX2dsb2JhbC5wcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmICFpc1dlYldvcmtlciAmJlxuICAgICEhKGlzV2luZG93RXhpc3RzICYmIGludGVybmFsV2luZG93WydIVE1MRWxlbWVudCddKTtcblxuY29uc3Qgem9uZVN5bWJvbEV2ZW50TmFtZXM6IHtbZXZlbnROYW1lOiBzdHJpbmddOiBzdHJpbmd9ID0ge307XG5cbmNvbnN0IHdyYXBGbiA9IGZ1bmN0aW9uKGV2ZW50OiBFdmVudCkge1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci96b25lLmpzL2lzc3Vlcy85MTEsIGluIElFLCBzb21ldGltZXNcbiAgLy8gZXZlbnQgd2lsbCBiZSB1bmRlZmluZWQsIHNvIHdlIG5lZWQgdG8gdXNlIHdpbmRvdy5ldmVudFxuICBldmVudCA9IGV2ZW50IHx8IF9nbG9iYWwuZXZlbnQ7XG4gIGlmICghZXZlbnQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdO1xuICBpZiAoIWV2ZW50TmFtZVN5bWJvbCkge1xuICAgIGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50LnR5cGVdID0gem9uZVN5bWJvbCgnT05fUFJPUEVSVFknICsgZXZlbnQudHlwZSk7XG4gIH1cbiAgY29uc3QgdGFyZ2V0ID0gdGhpcyB8fCBldmVudC50YXJnZXQgfHwgX2dsb2JhbDtcbiAgY29uc3QgbGlzdGVuZXIgPSB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXTtcbiAgbGV0IHJlc3VsdDtcbiAgaWYgKGlzQnJvd3NlciAmJiB0YXJnZXQgPT09IGludGVybmFsV2luZG93ICYmIGV2ZW50LnR5cGUgPT09ICdlcnJvcicpIHtcbiAgICAvLyB3aW5kb3cub25lcnJvciBoYXZlIGRpZmZlcmVudCBzaWduaXR1cmVcbiAgICAvLyBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9BUEkvR2xvYmFsRXZlbnRIYW5kbGVycy9vbmVycm9yI3dpbmRvdy5vbmVycm9yXG4gICAgLy8gYW5kIG9uZXJyb3IgY2FsbGJhY2sgd2lsbCBwcmV2ZW50IGRlZmF1bHQgd2hlbiBjYWxsYmFjayByZXR1cm4gdHJ1ZVxuICAgIGNvbnN0IGVycm9yRXZlbnQ6IEVycm9yRXZlbnQgPSBldmVudCBhcyBhbnk7XG4gICAgcmVzdWx0ID0gbGlzdGVuZXIgJiZcbiAgICAgICAgbGlzdGVuZXIuY2FsbChcbiAgICAgICAgICAgIHRoaXMsIGVycm9yRXZlbnQubWVzc2FnZSwgZXJyb3JFdmVudC5maWxlbmFtZSwgZXJyb3JFdmVudC5saW5lbm8sIGVycm9yRXZlbnQuY29sbm8sXG4gICAgICAgICAgICBlcnJvckV2ZW50LmVycm9yKTtcbiAgICBpZiAocmVzdWx0ID09PSB0cnVlKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXN1bHQgPSBsaXN0ZW5lciAmJiBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIGlmIChyZXN1bHQgIT0gdW5kZWZpbmVkICYmICFyZXN1bHQpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaFByb3BlcnR5KG9iajogYW55LCBwcm9wOiBzdHJpbmcsIHByb3RvdHlwZT86IGFueSkge1xuICBsZXQgZGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuICBpZiAoIWRlc2MgJiYgcHJvdG90eXBlKSB7XG4gICAgLy8gd2hlbiBwYXRjaCB3aW5kb3cgb2JqZWN0LCB1c2UgcHJvdG90eXBlIHRvIGNoZWNrIHByb3AgZXhpc3Qgb3Igbm90XG4gICAgY29uc3QgcHJvdG90eXBlRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIHByb3ApO1xuICAgIGlmIChwcm90b3R5cGVEZXNjKSB7XG4gICAgICBkZXNjID0ge2VudW1lcmFibGU6IHRydWUsIGNvbmZpZ3VyYWJsZTogdHJ1ZX07XG4gICAgfVxuICB9XG4gIC8vIGlmIHRoZSBkZXNjcmlwdG9yIG5vdCBleGlzdHMgb3IgaXMgbm90IGNvbmZpZ3VyYWJsZVxuICAvLyBqdXN0IHJldHVyblxuICBpZiAoIWRlc2MgfHwgIWRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgb25Qcm9wUGF0Y2hlZFN5bWJvbCA9IHpvbmVTeW1ib2woJ29uJyArIHByb3AgKyAncGF0Y2hlZCcpO1xuICBpZiAob2JqLmhhc093blByb3BlcnR5KG9uUHJvcFBhdGNoZWRTeW1ib2wpICYmIG9ialtvblByb3BQYXRjaGVkU3ltYm9sXSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIC8vIEEgcHJvcGVydHkgZGVzY3JpcHRvciBjYW5ub3QgaGF2ZSBnZXR0ZXIvc2V0dGVyIGFuZCBiZSB3cml0YWJsZVxuICAvLyBkZWxldGluZyB0aGUgd3JpdGFibGUgYW5kIHZhbHVlIHByb3BlcnRpZXMgYXZvaWRzIHRoaXMgZXJyb3I6XG4gIC8vXG4gIC8vIFR5cGVFcnJvcjogcHJvcGVydHkgZGVzY3JpcHRvcnMgbXVzdCBub3Qgc3BlY2lmeSBhIHZhbHVlIG9yIGJlIHdyaXRhYmxlIHdoZW4gYVxuICAvLyBnZXR0ZXIgb3Igc2V0dGVyIGhhcyBiZWVuIHNwZWNpZmllZFxuICBkZWxldGUgZGVzYy53cml0YWJsZTtcbiAgZGVsZXRlIGRlc2MudmFsdWU7XG4gIGNvbnN0IG9yaWdpbmFsRGVzY0dldCA9IGRlc2MuZ2V0O1xuICBjb25zdCBvcmlnaW5hbERlc2NTZXQgPSBkZXNjLnNldDtcblxuICAvLyBzdWJzdHIoMikgY3V6ICdvbmNsaWNrJyAtPiAnY2xpY2snLCBldGNcbiAgY29uc3QgZXZlbnROYW1lID0gcHJvcC5zdWJzdHIoMik7XG5cbiAgbGV0IGV2ZW50TmFtZVN5bWJvbCA9IHpvbmVTeW1ib2xFdmVudE5hbWVzW2V2ZW50TmFtZV07XG4gIGlmICghZXZlbnROYW1lU3ltYm9sKSB7XG4gICAgZXZlbnROYW1lU3ltYm9sID0gem9uZVN5bWJvbEV2ZW50TmFtZXNbZXZlbnROYW1lXSA9IHpvbmVTeW1ib2woJ09OX1BST1BFUlRZJyArIGV2ZW50TmFtZSk7XG4gIH1cblxuICBkZXNjLnNldCA9IGZ1bmN0aW9uKG5ld1ZhbHVlKSB7XG4gICAgLy8gaW4gc29tZSBvZiB3aW5kb3dzJ3Mgb25wcm9wZXJ0eSBjYWxsYmFjaywgdGhpcyBpcyB1bmRlZmluZWRcbiAgICAvLyBzbyB3ZSBuZWVkIHRvIGNoZWNrIGl0XG4gICAgbGV0IHRhcmdldCA9IHRoaXM7XG4gICAgaWYgKCF0YXJnZXQgJiYgb2JqID09PSBfZ2xvYmFsKSB7XG4gICAgICB0YXJnZXQgPSBfZ2xvYmFsO1xuICAgIH1cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgcHJldmlvdXNWYWx1ZSA9IHRhcmdldFtldmVudE5hbWVTeW1ib2xdO1xuICAgIGlmIChwcmV2aW91c1ZhbHVlKSB7XG4gICAgICB0YXJnZXQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHdyYXBGbik7XG4gICAgfVxuXG4gICAgLy8gaXNzdWUgIzk3OCwgd2hlbiBvbmxvYWQgaGFuZGxlciB3YXMgYWRkZWQgYmVmb3JlIGxvYWRpbmcgem9uZS5qc1xuICAgIC8vIHdlIHNob3VsZCByZW1vdmUgaXQgd2l0aCBvcmlnaW5hbERlc2NTZXRcbiAgICBpZiAob3JpZ2luYWxEZXNjU2V0KSB7XG4gICAgICBvcmlnaW5hbERlc2NTZXQuYXBwbHkodGFyZ2V0LCBOVUxMX09OX1BST1BfVkFMVUUpO1xuICAgIH1cblxuICAgIGlmICh0eXBlb2YgbmV3VmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRhcmdldFtldmVudE5hbWVTeW1ib2xdID0gbmV3VmFsdWU7XG4gICAgICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudE5hbWUsIHdyYXBGbiwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXSA9IG51bGw7XG4gICAgfVxuICB9O1xuXG4gIC8vIFRoZSBnZXR0ZXIgd291bGQgcmV0dXJuIHVuZGVmaW5lZCBmb3IgdW5hc3NpZ25lZCBwcm9wZXJ0aWVzIGJ1dCB0aGUgZGVmYXVsdCB2YWx1ZSBvZiBhblxuICAvLyB1bmFzc2lnbmVkIHByb3BlcnR5IGlzIG51bGxcbiAgZGVzYy5nZXQgPSBmdW5jdGlvbigpIHtcbiAgICAvLyBpbiBzb21lIG9mIHdpbmRvd3MncyBvbnByb3BlcnR5IGNhbGxiYWNrLCB0aGlzIGlzIHVuZGVmaW5lZFxuICAgIC8vIHNvIHdlIG5lZWQgdG8gY2hlY2sgaXRcbiAgICBsZXQgdGFyZ2V0ID0gdGhpcztcbiAgICBpZiAoIXRhcmdldCAmJiBvYmogPT09IF9nbG9iYWwpIHtcbiAgICAgIHRhcmdldCA9IF9nbG9iYWw7XG4gICAgfVxuICAgIGlmICghdGFyZ2V0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgY29uc3QgbGlzdGVuZXIgPSB0YXJnZXRbZXZlbnROYW1lU3ltYm9sXTtcbiAgICBpZiAobGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBsaXN0ZW5lcjtcbiAgICB9IGVsc2UgaWYgKG9yaWdpbmFsRGVzY0dldCkge1xuICAgICAgLy8gcmVzdWx0IHdpbGwgYmUgbnVsbCB3aGVuIHVzZSBpbmxpbmUgZXZlbnQgYXR0cmlidXRlLFxuICAgICAgLy8gc3VjaCBhcyA8YnV0dG9uIG9uY2xpY2s9XCJmdW5jKCk7XCI+T0s8L2J1dHRvbj5cbiAgICAgIC8vIGJlY2F1c2UgdGhlIG9uY2xpY2sgZnVuY3Rpb24gaXMgaW50ZXJuYWwgcmF3IHVuY29tcGlsZWQgaGFuZGxlclxuICAgICAgLy8gdGhlIG9uY2xpY2sgd2lsbCBiZSBldmFsdWF0ZWQgd2hlbiBmaXJzdCB0aW1lIGV2ZW50IHdhcyB0cmlnZ2VyZWQgb3JcbiAgICAgIC8vIHRoZSBwcm9wZXJ0eSBpcyBhY2Nlc3NlZCwgaHR0cHM6Ly9naXRodWIuY29tL2FuZ3VsYXIvem9uZS5qcy9pc3N1ZXMvNTI1XG4gICAgICAvLyBzbyB3ZSBzaG91bGQgdXNlIG9yaWdpbmFsIG5hdGl2ZSBnZXQgdG8gcmV0cmlldmUgdGhlIGhhbmRsZXJcbiAgICAgIGxldCB2YWx1ZSA9IG9yaWdpbmFsRGVzY0dldCAmJiBvcmlnaW5hbERlc2NHZXQuY2FsbCh0aGlzKTtcbiAgICAgIGlmICh2YWx1ZSkge1xuICAgICAgICBkZXNjIS5zZXQhLmNhbGwodGhpcywgdmFsdWUpO1xuICAgICAgICBpZiAodHlwZW9mIHRhcmdldFtSRU1PVkVfQVRUUklCVVRFXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHRhcmdldC5yZW1vdmVBdHRyaWJ1dGUocHJvcCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcblxuICBPYmplY3REZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuXG4gIG9ialtvblByb3BQYXRjaGVkU3ltYm9sXSA9IHRydWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaE9uUHJvcGVydGllcyhvYmo6IGFueSwgcHJvcGVydGllczogc3RyaW5nW118bnVsbCwgcHJvdG90eXBlPzogYW55KSB7XG4gIGlmIChwcm9wZXJ0aWVzKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBwYXRjaFByb3BlcnR5KG9iaiwgJ29uJyArIHByb3BlcnRpZXNbaV0sIHByb3RvdHlwZSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGNvbnN0IG9uUHJvcGVydGllcyA9IFtdO1xuICAgIGZvciAoY29uc3QgcHJvcCBpbiBvYmopIHtcbiAgICAgIGlmIChwcm9wLnN1YnN0cigwLCAyKSA9PSAnb24nKSB7XG4gICAgICAgIG9uUHJvcGVydGllcy5wdXNoKHByb3ApO1xuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG9uUHJvcGVydGllcy5sZW5ndGg7IGorKykge1xuICAgICAgcGF0Y2hQcm9wZXJ0eShvYmosIG9uUHJvcGVydGllc1tqXSwgcHJvdG90eXBlKTtcbiAgICB9XG4gIH1cbn1cblxuY29uc3Qgb3JpZ2luYWxJbnN0YW5jZUtleSA9IHpvbmVTeW1ib2woJ29yaWdpbmFsSW5zdGFuY2UnKTtcblxuLy8gd3JhcCBzb21lIG5hdGl2ZSBBUEkgb24gYHdpbmRvd2BcbmV4cG9ydCBmdW5jdGlvbiBwYXRjaENsYXNzKGNsYXNzTmFtZTogc3RyaW5nKSB7XG4gIGNvbnN0IE9yaWdpbmFsQ2xhc3MgPSBfZ2xvYmFsW2NsYXNzTmFtZV07XG4gIGlmICghT3JpZ2luYWxDbGFzcykgcmV0dXJuO1xuICAvLyBrZWVwIG9yaWdpbmFsIGNsYXNzIGluIGdsb2JhbFxuICBfZ2xvYmFsW3pvbmVTeW1ib2woY2xhc3NOYW1lKV0gPSBPcmlnaW5hbENsYXNzO1xuXG4gIF9nbG9iYWxbY2xhc3NOYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgIGNvbnN0IGEgPSBiaW5kQXJndW1lbnRzKDxhbnk+YXJndW1lbnRzLCBjbGFzc05hbWUpO1xuICAgIHN3aXRjaCAoYS5sZW5ndGgpIHtcbiAgICAgIGNhc2UgMDpcbiAgICAgICAgdGhpc1tvcmlnaW5hbEluc3RhbmNlS2V5XSA9IG5ldyBPcmlnaW5hbENsYXNzKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAxOlxuICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSwgYVsyXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSA0OlxuICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldID0gbmV3IE9yaWdpbmFsQ2xhc3MoYVswXSwgYVsxXSwgYVsyXSwgYVszXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBcmcgbGlzdCB0b28gbG9uZy4nKTtcbiAgICB9XG4gIH07XG5cbiAgLy8gYXR0YWNoIG9yaWdpbmFsIGRlbGVnYXRlIHRvIHBhdGNoZWQgZnVuY3Rpb25cbiAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKF9nbG9iYWxbY2xhc3NOYW1lXSwgT3JpZ2luYWxDbGFzcyk7XG5cbiAgY29uc3QgaW5zdGFuY2UgPSBuZXcgT3JpZ2luYWxDbGFzcyhmdW5jdGlvbigpIHt9KTtcblxuICBsZXQgcHJvcDtcbiAgZm9yIChwcm9wIGluIGluc3RhbmNlKSB7XG4gICAgLy8gaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTQ0NzIxXG4gICAgaWYgKGNsYXNzTmFtZSA9PT0gJ1hNTEh0dHBSZXF1ZXN0JyAmJiBwcm9wID09PSAncmVzcG9uc2VCbG9iJykgY29udGludWU7XG4gICAgKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIGlmICh0eXBlb2YgaW5zdGFuY2VbcHJvcF0gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgX2dsb2JhbFtjbGFzc05hbWVdLnByb3RvdHlwZVtwcm9wXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLmFwcGx5KHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV0sIGFyZ3VtZW50cyk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShfZ2xvYmFsW2NsYXNzTmFtZV0ucHJvdG90eXBlLCBwcm9wLCB7XG4gICAgICAgICAgc2V0OiBmdW5jdGlvbihmbikge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBmbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdID0gd3JhcFdpdGhDdXJyZW50Wm9uZShmbiwgY2xhc3NOYW1lICsgJy4nICsgcHJvcCk7XG4gICAgICAgICAgICAgIC8vIGtlZXAgY2FsbGJhY2sgaW4gd3JhcHBlZCBmdW5jdGlvbiBzbyB3ZSBjYW5cbiAgICAgICAgICAgICAgLy8gdXNlIGl0IGluIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyB0byByZXR1cm5cbiAgICAgICAgICAgICAgLy8gdGhlIG5hdGl2ZSBvbmUuXG4gICAgICAgICAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZCh0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdLCBmbik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzW29yaWdpbmFsSW5zdGFuY2VLZXldW3Byb3BdID0gZm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSxcbiAgICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbb3JpZ2luYWxJbnN0YW5jZUtleV1bcHJvcF07XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KHByb3ApKTtcbiAgfVxuXG4gIGZvciAocHJvcCBpbiBPcmlnaW5hbENsYXNzKSB7XG4gICAgaWYgKHByb3AgIT09ICdwcm90b3R5cGUnICYmIE9yaWdpbmFsQ2xhc3MuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgIF9nbG9iYWxbY2xhc3NOYW1lXVtwcm9wXSA9IE9yaWdpbmFsQ2xhc3NbcHJvcF07XG4gICAgfVxuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjb3B5U3ltYm9sUHJvcGVydGllcyhzcmM6IGFueSwgZGVzdDogYW55KSB7XG4gIGlmICh0eXBlb2YgKE9iamVjdCBhcyBhbnkpLmdldE93blByb3BlcnR5U3ltYm9scyAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBzeW1ib2xzOiBhbnkgPSAoT2JqZWN0IGFzIGFueSkuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHNyYyk7XG4gIHN5bWJvbHMuZm9yRWFjaCgoc3ltYm9sOiBhbnkpID0+IHtcbiAgICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzcmMsIHN5bWJvbCk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGRlc3QsIHN5bWJvbCwge1xuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHNyY1tzeW1ib2xdO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWU6IGFueSkge1xuICAgICAgICBpZiAoZGVzYyAmJiAoIWRlc2Mud3JpdGFibGUgfHwgdHlwZW9mIGRlc2Muc2V0ICE9PSAnZnVuY3Rpb24nKSkge1xuICAgICAgICAgIC8vIGlmIHNyY1tzeW1ib2xdIGlzIG5vdCB3cml0YWJsZSBvciBub3QgaGF2ZSBhIHNldHRlciwganVzdCByZXR1cm5cbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgc3JjW3N5bWJvbF0gPSB2YWx1ZTtcbiAgICAgIH0sXG4gICAgICBlbnVtZXJhYmxlOiBkZXNjID8gZGVzYy5lbnVtZXJhYmxlIDogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogZGVzYyA/IGRlc2MuY29uZmlndXJhYmxlIDogdHJ1ZVxuICAgIH0pO1xuICB9KTtcbn1cblxubGV0IHNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBzZXRTaG91bGRDb3B5U3ltYm9sUHJvcGVydGllcyhmbGFnOiBib29sZWFuKSB7XG4gIHNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzID0gZmxhZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoTWV0aG9kKFxuICAgIHRhcmdldDogYW55LCBuYW1lOiBzdHJpbmcsXG4gICAgcGF0Y2hGbjogKGRlbGVnYXRlOiBGdW5jdGlvbiwgZGVsZWdhdGVOYW1lOiBzdHJpbmcsIG5hbWU6IHN0cmluZykgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+XG4gICAgICAgIGFueSk6IEZ1bmN0aW9ufG51bGwge1xuICBsZXQgcHJvdG8gPSB0YXJnZXQ7XG4gIHdoaWxlIChwcm90byAmJiAhcHJvdG8uaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICBwcm90byA9IE9iamVjdEdldFByb3RvdHlwZU9mKHByb3RvKTtcbiAgfVxuICBpZiAoIXByb3RvICYmIHRhcmdldFtuYW1lXSkge1xuICAgIC8vIHNvbWVob3cgd2UgZGlkIG5vdCBmaW5kIGl0LCBidXQgd2UgY2FuIHNlZSBpdC4gVGhpcyBoYXBwZW5zIG9uIElFIGZvciBXaW5kb3cgcHJvcGVydGllcy5cbiAgICBwcm90byA9IHRhcmdldDtcbiAgfVxuXG4gIGNvbnN0IGRlbGVnYXRlTmFtZSA9IHpvbmVTeW1ib2wobmFtZSk7XG4gIGxldCBkZWxlZ2F0ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG4gIGlmIChwcm90byAmJiAhKGRlbGVnYXRlID0gcHJvdG9bZGVsZWdhdGVOYW1lXSkpIHtcbiAgICBkZWxlZ2F0ZSA9IHByb3RvW2RlbGVnYXRlTmFtZV0gPSBwcm90b1tuYW1lXTtcbiAgICAvLyBjaGVjayB3aGV0aGVyIHByb3RvW25hbWVdIGlzIHdyaXRhYmxlXG4gICAgLy8gc29tZSBwcm9wZXJ0eSBpcyByZWFkb25seSBpbiBzYWZhcmksIHN1Y2ggYXMgSHRtbENhbnZhc0VsZW1lbnQucHJvdG90eXBlLnRvQmxvYlxuICAgIGNvbnN0IGRlc2MgPSBwcm90byAmJiBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpO1xuICAgIGlmIChpc1Byb3BlcnR5V3JpdGFibGUoZGVzYykpIHtcbiAgICAgIGNvbnN0IHBhdGNoRGVsZWdhdGUgPSBwYXRjaEZuKGRlbGVnYXRlISwgZGVsZWdhdGVOYW1lLCBuYW1lKTtcbiAgICAgIHByb3RvW25hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwYXRjaERlbGVnYXRlKHRoaXMsIGFyZ3VtZW50cyBhcyBhbnkpO1xuICAgICAgfTtcbiAgICAgIGF0dGFjaE9yaWdpblRvUGF0Y2hlZChwcm90b1tuYW1lXSwgZGVsZWdhdGUpO1xuICAgICAgaWYgKHNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzKSB7XG4gICAgICAgIGNvcHlTeW1ib2xQcm9wZXJ0aWVzKGRlbGVnYXRlLCBwcm90b1tuYW1lXSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBkZWxlZ2F0ZTtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBNYWNyb1Rhc2tNZXRhIGV4dGVuZHMgVGFza0RhdGEge1xuICBuYW1lOiBzdHJpbmc7XG4gIHRhcmdldDogYW55O1xuICBjYklkeDogbnVtYmVyO1xuICBhcmdzOiBhbnlbXTtcbn1cblxuLy8gVE9ETzogQEppYUxpUGFzc2lvbiwgc3VwcG9ydCBjYW5jZWwgdGFzayBsYXRlciBpZiBuZWNlc3NhcnlcbmV4cG9ydCBmdW5jdGlvbiBwYXRjaE1hY3JvVGFzayhcbiAgICBvYmo6IGFueSwgZnVuY05hbWU6IHN0cmluZywgbWV0YUNyZWF0b3I6IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiBNYWNyb1Rhc2tNZXRhKSB7XG4gIGxldCBzZXROYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrOiBUYXNrKSB7XG4gICAgY29uc3QgZGF0YSA9IDxNYWNyb1Rhc2tNZXRhPnRhc2suZGF0YTtcbiAgICBkYXRhLmFyZ3NbZGF0YS5jYklkeF0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBzZXROYXRpdmUhLmFwcGx5KGRhdGEudGFyZ2V0LCBkYXRhLmFyZ3MpO1xuICAgIHJldHVybiB0YXNrO1xuICB9XG5cbiAgc2V0TmF0aXZlID0gcGF0Y2hNZXRob2Qob2JqLCBmdW5jTmFtZSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24oc2VsZjogYW55LCBhcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IG1ldGEgPSBtZXRhQ3JlYXRvcihzZWxmLCBhcmdzKTtcbiAgICBpZiAobWV0YS5jYklkeCA+PSAwICYmIHR5cGVvZiBhcmdzW21ldGEuY2JJZHhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gc2NoZWR1bGVNYWNyb1Rhc2tXaXRoQ3VycmVudFpvbmUobWV0YS5uYW1lLCBhcmdzW21ldGEuY2JJZHhdLCBtZXRhLCBzY2hlZHVsZVRhc2spO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWljcm9UYXNrTWV0YSBleHRlbmRzIFRhc2tEYXRhIHtcbiAgbmFtZTogc3RyaW5nO1xuICB0YXJnZXQ6IGFueTtcbiAgY2JJZHg6IG51bWJlcjtcbiAgYXJnczogYW55W107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaE1pY3JvVGFzayhcbiAgICBvYmo6IGFueSwgZnVuY05hbWU6IHN0cmluZywgbWV0YUNyZWF0b3I6IChzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSA9PiBNaWNyb1Rhc2tNZXRhKSB7XG4gIGxldCBzZXROYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuXG4gIGZ1bmN0aW9uIHNjaGVkdWxlVGFzayh0YXNrOiBUYXNrKSB7XG4gICAgY29uc3QgZGF0YSA9IDxNYWNyb1Rhc2tNZXRhPnRhc2suZGF0YTtcbiAgICBkYXRhLmFyZ3NbZGF0YS5jYklkeF0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfTtcbiAgICBzZXROYXRpdmUhLmFwcGx5KGRhdGEudGFyZ2V0LCBkYXRhLmFyZ3MpO1xuICAgIHJldHVybiB0YXNrO1xuICB9XG5cbiAgc2V0TmF0aXZlID0gcGF0Y2hNZXRob2Qob2JqLCBmdW5jTmFtZSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24oc2VsZjogYW55LCBhcmdzOiBhbnlbXSkge1xuICAgIGNvbnN0IG1ldGEgPSBtZXRhQ3JlYXRvcihzZWxmLCBhcmdzKTtcbiAgICBpZiAobWV0YS5jYklkeCA+PSAwICYmIHR5cGVvZiBhcmdzW21ldGEuY2JJZHhdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gWm9uZS5jdXJyZW50LnNjaGVkdWxlTWljcm9UYXNrKG1ldGEubmFtZSwgYXJnc1ttZXRhLmNiSWR4XSwgbWV0YSwgc2NoZWR1bGVUYXNrKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gY2F1c2UgYW4gZXJyb3IgYnkgY2FsbGluZyBpdCBkaXJlY3RseS5cbiAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseShzZWxmLCBhcmdzKTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHBhdGNoZWQ6IEZ1bmN0aW9uLCBvcmlnaW5hbDogYW55KSB7XG4gIChwYXRjaGVkIGFzIGFueSlbem9uZVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpXSA9IG9yaWdpbmFsO1xufVxuXG5sZXQgaXNEZXRlY3RlZElFT3JFZGdlID0gZmFsc2U7XG5sZXQgaWVPckVkZ2UgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzSUUoKSB7XG4gIHRyeSB7XG4gICAgY29uc3QgdWEgPSBpbnRlcm5hbFdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGlmICh1YS5pbmRleE9mKCdNU0lFICcpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzSUVPckVkZ2UoKSB7XG4gIGlmIChpc0RldGVjdGVkSUVPckVkZ2UpIHtcbiAgICByZXR1cm4gaWVPckVkZ2U7XG4gIH1cblxuICBpc0RldGVjdGVkSUVPckVkZ2UgPSB0cnVlO1xuXG4gIHRyeSB7XG4gICAgY29uc3QgdWEgPSBpbnRlcm5hbFdpbmRvdy5uYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGlmICh1YS5pbmRleE9mKCdNU0lFICcpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdUcmlkZW50LycpICE9PSAtMSB8fCB1YS5pbmRleE9mKCdFZGdlLycpICE9PSAtMSkge1xuICAgICAgaWVPckVkZ2UgPSB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgfVxuICByZXR1cm4gaWVPckVkZ2U7XG59XG4iXX0=