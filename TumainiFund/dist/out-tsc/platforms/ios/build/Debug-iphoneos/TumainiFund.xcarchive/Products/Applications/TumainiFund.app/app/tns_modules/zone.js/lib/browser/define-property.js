/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { zoneSymbol } from '../common/utils';
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXByb3BlcnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9EZWJ1Zy1pcGhvbmVvcy9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9kZWZpbmUtcHJvcGVydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBQzNDOzs7R0FHRztBQUVILE1BQU0sZUFBZSxHQUFJLE1BQWMsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDOUYsTUFBTSx5QkFBeUIsR0FBSSxNQUFjLENBQUMsVUFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDckYsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ3BDLE1BQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDOUIsTUFBTSxrQkFBa0IsR0FBRyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztBQUV6RCxNQUFNLFVBQVUsYUFBYTtJQUMzQixNQUFNLENBQUMsY0FBYyxHQUFHLFVBQVMsR0FBUSxFQUFFLElBQVksRUFBRSxJQUFTO1FBQ2hFLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUN2RjtRQUNELE1BQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRCxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7WUFD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bmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3pvbmVTeW1ib2x9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG4vKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgZm9yIENocm9tZSBhbmQgQ2hyb21lIG1vYmlsZSwgdG8gZW5hYmxlXG4gKiB0aGluZ3MgbGlrZSByZWRlZmluaW5nIGBjcmVhdGVkQ2FsbGJhY2tgIG9uIGFuIGVsZW1lbnQuXG4gKi9cblxuY29uc3QgX2RlZmluZVByb3BlcnR5ID0gKE9iamVjdCBhcyBhbnkpW3pvbmVTeW1ib2woJ2RlZmluZVByb3BlcnR5JyldID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuY29uc3QgX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IChPYmplY3QgYXMgYW55KVt6b25lU3ltYm9sKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InKV0gPVxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5jb25zdCBfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbmNvbnN0IHVuY29uZmlndXJhYmxlc0tleSA9IHpvbmVTeW1ib2woJ3VuY29uZmlndXJhYmxlcycpO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHlQYXRjaCgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55KSB7XG4gICAgaWYgKGlzVW5jb25maWd1cmFibGUob2JqLCBwcm9wKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGFzc2lnbiB0byByZWFkIG9ubHkgcHJvcGVydHkgXFwnJyArIHByb3AgKyAnXFwnIG9mICcgKyBvYmopO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcgPSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgICBpZiAocHJvcCAhPT0gJ3Byb3RvdHlwZScpIHtcbiAgICAgIGRlc2MgPSByZXdyaXRlRGVzY3JpcHRvcihvYmosIHByb3AsIGRlc2MpO1xuICAgIH1cbiAgICByZXR1cm4gX3RyeURlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYywgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcbiAgICBPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBwcm9wc1twcm9wXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICBPYmplY3QuY3JlYXRlID0gPGFueT5mdW5jdGlvbihvYmo6IGFueSwgcHJvdG86IGFueSkge1xuICAgIGlmICh0eXBlb2YgcHJvdG8gPT09ICdvYmplY3QnICYmICFPYmplY3QuaXNGcm96ZW4ocHJvdG8pKSB7XG4gICAgICBPYmplY3Qua2V5cyhwcm90bykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgIHByb3RvW3Byb3BdID0gcmV3cml0ZURlc2NyaXB0b3Iob2JqLCBwcm9wLCBwcm90b1twcm9wXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIF9jcmVhdGUob2JqLCBwcm90byk7XG4gIH07XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkge1xuICAgIGNvbnN0IGRlc2MgPSBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gICAgaWYgKGRlc2MgJiYgaXNVbmNvbmZpZ3VyYWJsZShvYmosIHByb3ApKSB7XG4gICAgICBkZXNjLmNvbmZpZ3VyYWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGVzYztcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9yZWRlZmluZVByb3BlcnR5KG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSkge1xuICBjb25zdCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcgPSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgZGVzYyA9IHJld3JpdGVEZXNjcmlwdG9yKG9iaiwgcHJvcCwgZGVzYyk7XG4gIHJldHVybiBfdHJ5RGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjLCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcpO1xufVxuXG5mdW5jdGlvbiBpc1VuY29uZmlndXJhYmxlKG9iajogYW55LCBwcm9wOiBhbnkpIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmpbdW5jb25maWd1cmFibGVzS2V5XSAmJiBvYmpbdW5jb25maWd1cmFibGVzS2V5XVtwcm9wXTtcbn1cblxuZnVuY3Rpb24gcmV3cml0ZURlc2NyaXB0b3Iob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55KSB7XG4gIC8vIGlzc3VlLTkyNywgaWYgdGhlIGRlc2MgaXMgZnJvemVuLCBkb24ndCB0cnkgdG8gY2hhbmdlIHRoZSBkZXNjXG4gIGlmICghT2JqZWN0LmlzRnJvemVuKGRlc2MpKSB7XG4gICAgZGVzYy5jb25maWd1cmFibGUgPSB0cnVlO1xuICB9XG4gIGlmICghZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAvLyBpc3N1ZS05MjcsIGlmIHRoZSBvYmogaXMgZnJvemVuLCBkb24ndCB0cnkgdG8gc2V0IHRoZSBkZXNjIHRvIG9ialxuICAgIGlmICghb2JqW3VuY29uZmlndXJhYmxlc0tleV0gJiYgIU9iamVjdC5pc0Zyb3plbihvYmopKSB7XG4gICAgICBfZGVmaW5lUHJvcGVydHkob2JqLCB1bmNvbmZpZ3VyYWJsZXNLZXksIHt3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHt9fSk7XG4gICAgfVxuICAgIGlmIChvYmpbdW5jb25maWd1cmFibGVzS2V5XSkge1xuICAgICAgb2JqW3VuY29uZmlndXJhYmxlc0tleV1bcHJvcF0gPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn1cblxuZnVuY3Rpb24gX3RyeURlZmluZVByb3BlcnR5KG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSwgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gX2RlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAvLyBJbiBjYXNlIG9mIGVycm9ycywgd2hlbiB0aGUgY29uZmlndXJhYmxlIGZsYWcgd2FzIGxpa2VseSBzZXQgYnkgcmV3cml0ZURlc2NyaXB0b3IoKSwgbGV0J3NcbiAgICAgIC8vIHJldHJ5IHdpdGggdGhlIG9yaWdpbmFsIGZsYWcgdmFsdWVcbiAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxDb25maWd1cmFibGVGbGFnID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlbGV0ZSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc2MuY29uZmlndXJhYmxlID0gb3JpZ2luYWxDb25maWd1cmFibGVGbGFnO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIF9kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbGV0IGRlc2NKc29uOiBzdHJpbmd8bnVsbCA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGVzY0pzb24gPSBKU09OLnN0cmluZ2lmeShkZXNjKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBkZXNjSnNvbiA9IGRlc2MudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBjb25maWd1cmUgJyR7cHJvcH0nIHdpdGggZGVzY3JpcHRvciAnJHtkZXNjSnNvbn0nIG9uIG9iamVjdCAnJHtcbiAgICAgICAgICAgIG9ian0nIGFuZCBnb3QgZXJyb3IsIGdpdmluZyB1cDogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=