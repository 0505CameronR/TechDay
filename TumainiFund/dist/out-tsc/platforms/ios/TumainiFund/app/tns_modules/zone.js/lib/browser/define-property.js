/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
const zoneSymbol = Zone.__symbol__;
const _defineProperty = Object[zoneSymbol('defineProperty')] = Object.defineProperty;
const _getOwnPropertyDescriptor = Object[zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
const _create = Object.create;
const unconfigurablesKey = zoneSymbol('unconfigurables');
export function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        const originalConfigurableFlag = desc.configurable;
        if (prop !== 'prototype') {
            desc = rewriteDescriptor(obj, prop, desc);
        }
        return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
    };
    Object.defineProperties = function (obj, props) {
        Object.keys(props).forEach(function (prop) {
            Object.defineProperty(obj, prop, props[prop]);
        });
        return obj;
    };
    Object.create = function (obj, proto) {
        if (typeof proto === 'object' && !Object.isFrozen(proto)) {
            Object.keys(proto).forEach(function (prop) {
                proto[prop] = rewriteDescriptor(obj, prop, proto[prop]);
            });
        }
        return _create(obj, proto);
    };
    Object.getOwnPropertyDescriptor = function (obj, prop) {
        const desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
export function _redefineProperty(obj, prop, desc) {
    const originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
function isUnconfigurable(obj, prop) {
    return obj && obj[unconfigurablesKey] && obj[unconfigurablesKey][prop];
}
function rewriteDescriptor(obj, prop, desc) {
    // issue-927, if the desc is frozen, don't try to change the desc
    if (!Object.isFrozen(desc)) {
        desc.configurable = true;
    }
    if (!desc.configurable) {
        // issue-927, if the obj is frozen, don't try to set the desc to obj
        if (!obj[unconfigurablesKey] && !Object.isFrozen(obj)) {
            _defineProperty(obj, unconfigurablesKey, { writable: true, value: {} });
        }
        if (obj[unconfigurablesKey]) {
            obj[unconfigurablesKey][prop] = true;
        }
    }
    return desc;
}
function _tryDefineProperty(obj, prop, desc, originalConfigurableFlag) {
    try {
        return _defineProperty(obj, prop, desc);
    }
    catch (error) {
        if (desc.configurable) {
            // In case of errors, when the configurable flag was likely set by rewriteDescriptor(), let's
            // retry with the original flag value
            if (typeof originalConfigurableFlag == 'undefined') {
                delete desc.configurable;
            }
            else {
                desc.configurable = originalConfigurableFlag;
            }
            try {
                return _defineProperty(obj, prop, desc);
            }
            catch (error) {
                let descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log(`Attempting to configure '${prop}' with descriptor '${descJson}' on object '${obj}' and got error, giving up: ${error}`);
            }
        }
        else {
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXByb3BlcnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9kZWZpbmUtcHJvcGVydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUg7OztHQUdHO0FBRUgsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztBQUNuQyxNQUFNLGVBQWUsR0FBSSxNQUFjLENBQUMsVUFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDO0FBQzlGLE1BQU0seUJBQXlCLEdBQUksTUFBYyxDQUFDLFVBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3JGLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztBQUNwQyxNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzlCLE1BQU0sa0JBQWtCLEdBQUcsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFekQsTUFBTSxVQUFVLGFBQWE7SUFDM0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxVQUFTLEdBQVEsRUFBRSxJQUFZLEVBQUUsSUFBUztRQUNoRSxJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDdkY7UUFDRCxNQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbkQsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQ3hCLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxrQkFBa0IsQ0FB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QUFDO0FBQ2QsQ0FBQztBQUVELFNBQVMsa0JBQWtCLENBQUMsR0FBUSxFQUFFLElBQVksRUFBRSxJQUFTLEVBQUUsd0JBQTZCO0lBQzFGLElBQUk7UUFDRixPQUFPLGVBQWUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pDO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDZCxJQUFJLElBQUksQ0FBQyxZQUFZLEVBQUU7WUFDckIsNkZBQTZGO1lBQzdGLHFDQUFxQztZQUNyQyxJQUFJLE9BQU8sd0JBQXdCLElBQUksV0FBVyxFQUFFO2dCQUNsRCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUM7YUFDMUI7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLFlBQVksR0FBRyx3QkFBd0IsQ0FBQzthQUM5QztZQUNELElBQUk7Z0JBQ0YsT0FBTyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQzthQUN6QztZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLElBQUksUUFBUSxHQUFnQixJQUFJLENBQUM7Z0JBQ2pDLElBQUk7b0JBQ0YsUUFBUSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7aUJBQ2pDO2dCQUFDLE9BQU8sS0FBSyxFQUFFO29CQUNkLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7aUJBQzVCO2dCQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsNEJBQTRCLElBQUksc0JBQXNCLFFBQVEsZ0JBQ3RFLEdBQUcsK0JBQStCLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDaEQ7U0FDRjthQUFNO1lBQ0wsTUFBTSxLQUFLLENBQUM7U0FDYjtLQUNGO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuLypcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBDaHJvbWUgYW5kIENocm9tZSBtb2JpbGUsIHRvIGVuYWJsZVxuICogdGhpbmdzIGxpa2UgcmVkZWZpbmluZyBgY3JlYXRlZENhbGxiYWNrYCBvbiBhbiBlbGVtZW50LlxuICovXG5cbmNvbnN0IHpvbmVTeW1ib2wgPSBab25lLl9fc3ltYm9sX187XG5jb25zdCBfZGVmaW5lUHJvcGVydHkgPSAoT2JqZWN0IGFzIGFueSlbem9uZVN5bWJvbCgnZGVmaW5lUHJvcGVydHknKV0gPSBPYmplY3QuZGVmaW5lUHJvcGVydHk7XG5jb25zdCBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gKE9iamVjdCBhcyBhbnkpW3pvbmVTeW1ib2woJ2dldE93blByb3BlcnR5RGVzY3JpcHRvcicpXSA9XG4gICAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbmNvbnN0IF9jcmVhdGUgPSBPYmplY3QuY3JlYXRlO1xuY29uc3QgdW5jb25maWd1cmFibGVzS2V5ID0gem9uZVN5bWJvbCgndW5jb25maWd1cmFibGVzJyk7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eVBhdGNoKCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbihvYmo6IGFueSwgcHJvcDogc3RyaW5nLCBkZXNjOiBhbnkpIHtcbiAgICBpZiAoaXNVbmNvbmZpZ3VyYWJsZShvYmosIHByb3ApKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdDYW5ub3QgYXNzaWduIHRvIHJlYWQgb25seSBwcm9wZXJ0eSBcXCcnICsgcHJvcCArICdcXCcgb2YgJyArIG9iaik7XG4gICAgfVxuICAgIGNvbnN0IG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZyA9IGRlc2MuY29uZmlndXJhYmxlO1xuICAgIGlmIChwcm9wICE9PSAncHJvdG90eXBlJykge1xuICAgICAgZGVzYyA9IHJld3JpdGVEZXNjcmlwdG9yKG9iaiwgcHJvcCwgZGVzYyk7XG4gICAgfVxuICAgIHJldHVybiBfdHJ5RGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjLCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcpO1xuICB9O1xuXG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24ob2JqLCBwcm9wcykge1xuICAgIE9iamVjdC5rZXlzKHByb3BzKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIHByb3BzW3Byb3BdKTtcbiAgICB9KTtcbiAgICByZXR1cm4gb2JqO1xuICB9O1xuXG4gIE9iamVjdC5jcmVhdGUgPSA8YW55PmZ1bmN0aW9uKG9iajogYW55LCBwcm90bzogYW55KSB7XG4gICAgaWYgKHR5cGVvZiBwcm90byA9PT0gJ29iamVjdCcgJiYgIU9iamVjdC5pc0Zyb3plbihwcm90bykpIHtcbiAgICAgIE9iamVjdC5rZXlzKHByb3RvKS5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgICAgcHJvdG9bcHJvcF0gPSByZXdyaXRlRGVzY3JpcHRvcihvYmosIHByb3AsIHByb3RvW3Byb3BdKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgICByZXR1cm4gX2NyZWF0ZShvYmosIHByb3RvKTtcbiAgfTtcblxuICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gZnVuY3Rpb24ob2JqLCBwcm9wKSB7XG4gICAgY29uc3QgZGVzYyA9IF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqLCBwcm9wKTtcbiAgICBpZiAoZGVzYyAmJiBpc1VuY29uZmlndXJhYmxlKG9iaiwgcHJvcCkpIHtcbiAgICAgIGRlc2MuY29uZmlndXJhYmxlID0gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBkZXNjO1xuICB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gX3JlZGVmaW5lUHJvcGVydHkob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55KSB7XG4gIGNvbnN0IG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZyA9IGRlc2MuY29uZmlndXJhYmxlO1xuICBkZXNjID0gcmV3cml0ZURlc2NyaXB0b3Iob2JqLCBwcm9wLCBkZXNjKTtcbiAgcmV0dXJuIF90cnlEZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MsIG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZyk7XG59XG5cbmZ1bmN0aW9uIGlzVW5jb25maWd1cmFibGUob2JqOiBhbnksIHByb3A6IGFueSkge1xuICByZXR1cm4gb2JqICYmIG9ialt1bmNvbmZpZ3VyYWJsZXNLZXldICYmIG9ialt1bmNvbmZpZ3VyYWJsZXNLZXldW3Byb3BdO1xufVxuXG5mdW5jdGlvbiByZXdyaXRlRGVzY3JpcHRvcihvYmo6IGFueSwgcHJvcDogc3RyaW5nLCBkZXNjOiBhbnkpIHtcbiAgLy8gaXNzdWUtOTI3LCBpZiB0aGUgZGVzYyBpcyBmcm96ZW4sIGRvbid0IHRyeSB0byBjaGFuZ2UgdGhlIGRlc2NcbiAgaWYgKCFPYmplY3QuaXNGcm96ZW4oZGVzYykpIHtcbiAgICBkZXNjLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gIH1cbiAgaWYgKCFkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgIC8vIGlzc3VlLTkyNywgaWYgdGhlIG9iaiBpcyBmcm96ZW4sIGRvbid0IHRyeSB0byBzZXQgdGhlIGRlc2MgdG8gb2JqXG4gICAgaWYgKCFvYmpbdW5jb25maWd1cmFibGVzS2V5XSAmJiAhT2JqZWN0LmlzRnJvemVuKG9iaikpIHtcbiAgICAgIF9kZWZpbmVQcm9wZXJ0eShvYmosIHVuY29uZmlndXJhYmxlc0tleSwge3dyaXRhYmxlOiB0cnVlLCB2YWx1ZToge319KTtcbiAgICB9XG4gICAgaWYgKG9ialt1bmNvbmZpZ3VyYWJsZXNLZXldKSB7XG4gICAgICBvYmpbdW5jb25maWd1cmFibGVzS2V5XVtwcm9wXSA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBkZXNjO1xufVxuXG5mdW5jdGlvbiBfdHJ5RGVmaW5lUHJvcGVydHkob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55LCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWc6IGFueSkge1xuICB0cnkge1xuICAgIHJldHVybiBfZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICBpZiAoZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAgIC8vIEluIGNhc2Ugb2YgZXJyb3JzLCB3aGVuIHRoZSBjb25maWd1cmFibGUgZmxhZyB3YXMgbGlrZWx5IHNldCBieSByZXdyaXRlRGVzY3JpcHRvcigpLCBsZXQnc1xuICAgICAgLy8gcmV0cnkgd2l0aCB0aGUgb3JpZ2luYWwgZmxhZyB2YWx1ZVxuICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcgPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgZGVsZXRlIGRlc2MuY29uZmlndXJhYmxlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZGVzYy5jb25maWd1cmFibGUgPSBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWc7XG4gICAgICB9XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gX2RlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYyk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBsZXQgZGVzY0pzb246IHN0cmluZ3xudWxsID0gbnVsbDtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBkZXNjSnNvbiA9IEpTT04uc3RyaW5naWZ5KGRlc2MpO1xuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICAgIGRlc2NKc29uID0gZGVzYy50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGBBdHRlbXB0aW5nIHRvIGNvbmZpZ3VyZSAnJHtwcm9wfScgd2l0aCBkZXNjcmlwdG9yICcke2Rlc2NKc29ufScgb24gb2JqZWN0ICcke1xuICAgICAgICAgICAgb2JqfScgYW5kIGdvdCBlcnJvciwgZ2l2aW5nIHVwOiAke2Vycm9yfWApO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cbiJdfQ==