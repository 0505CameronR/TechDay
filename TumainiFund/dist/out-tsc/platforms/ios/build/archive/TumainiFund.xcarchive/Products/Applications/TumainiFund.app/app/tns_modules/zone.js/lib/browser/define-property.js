"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
/*
 * This is necessary for Chrome and Chrome mobile, to enable
 * things like redefining `createdCallback` on an element.
 */
var _defineProperty = Object[utils_1.zoneSymbol('defineProperty')] = Object.defineProperty;
var _getOwnPropertyDescriptor = Object[utils_1.zoneSymbol('getOwnPropertyDescriptor')] =
    Object.getOwnPropertyDescriptor;
var _create = Object.create;
var unconfigurablesKey = utils_1.zoneSymbol('unconfigurables');
function propertyPatch() {
    Object.defineProperty = function (obj, prop, desc) {
        if (isUnconfigurable(obj, prop)) {
            throw new TypeError('Cannot assign to read only property \'' + prop + '\' of ' + obj);
        }
        var originalConfigurableFlag = desc.configurable;
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
        var desc = _getOwnPropertyDescriptor(obj, prop);
        if (desc && isUnconfigurable(obj, prop)) {
            desc.configurable = false;
        }
        return desc;
    };
}
exports.propertyPatch = propertyPatch;
function _redefineProperty(obj, prop, desc) {
    var originalConfigurableFlag = desc.configurable;
    desc = rewriteDescriptor(obj, prop, desc);
    return _tryDefineProperty(obj, prop, desc, originalConfigurableFlag);
}
exports._redefineProperty = _redefineProperty;
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
                var descJson = null;
                try {
                    descJson = JSON.stringify(desc);
                }
                catch (error) {
                    descJson = desc.toString();
                }
                console.log("Attempting to configure '" + prop + "' with descriptor '" + descJson + "' on object '" + obj + "' and got error, giving up: " + error);
            }
        }
        else {
            throw error;
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXByb3BlcnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9icm93c2VyL2RlZmluZS1wcm9wZXJ0eS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHlDQUEyQztBQUMzQzs7O0dBR0c7QUFFSCxJQUFNLGVBQWUsR0FBSSxNQUFjLENBQUMsa0JBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQztBQUM5RixJQUFNLHlCQUF5QixHQUFJLE1BQWMsQ0FBQyxrQkFBVSxDQUFDLDBCQUEwQixDQUFDLENBQUM7SUFDckYsTUFBTSxDQUFDLHdCQUF3QixDQUFDO0FBQ3BDLElBQU0sT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUM7QUFDOUIsSUFBTSxrQkFBa0IsR0FBRyxrQkFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUM7QUFFekQsU0FBZ0IsYUFBYTtJQUMzQixNQUFNLENBQUMsY0FBYyxHQUFHLFVBQVMsR0FBUSxFQUFFLElBQVksRUFBRSxJQUFTO1FBQ2hFLElBQUksZ0JBQWdCLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxFQUFFO1lBQy9CLE1BQU0sSUFBSSxTQUFTLENBQUMsd0NBQXdDLEdBQUcsSUFBSSxHQUFHLFFBQVEsR0FBRyxHQUFHLENBQUMsQ0FBQztTQUN2RjtRQUNELElBQU0sd0JBQXdCLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQztRQUNuRCxJQUFJLElBQUksS0FBSyxXQUFXLEVBQUU7WUFDeEIsSUFBSSxHQUFHLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxJ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LGtCQUFrQixDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO1NBQ3RDO0tBQ0Y7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxTQUFTLGtCQUFrQixDQUFDLEdBQVEsRUFBRSxJQUFZLEVBQUUsSUFBUyxFQUFFLHdCQUE2QjtJQUMxRixJQUFJO1FBQ0YsT0FBTyxlQUFlLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztLQUN6QztJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ2QsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ3JCLDZGQUE2RjtZQUM3RixxQ0FBcUM7WUFDckMsSUFBSSxPQUFPLHdCQUF3QixJQUFJLFdBQVcsRUFBRTtnQkFDbEQsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDO2FBQzFCO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxZQUFZLEdBQUcsd0JBQXdCLENBQUM7YUFDOUM7WUFDRCxJQUFJO2dCQUNGLE9BQU8sZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7YUFDekM7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxJQUFJLFFBQVEsR0FBZ0IsSUFBSSxDQUFDO2dCQUNqQyxJQUFJO29CQUNGLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO2lCQUNqQztnQkFBQyxPQUFPLEtBQUssRUFBRTtvQkFDZCxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUM1QjtnQkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE0QixJQUFJLDJCQUFzQixRQUFRLHFCQUN0RSxHQUFHLG9DQUErQixLQUFPLENBQUMsQ0FBQzthQUNoRDtTQUNGO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQztTQUNiO0tBQ0Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3pvbmVTeW1ib2x9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG4vKlxuICogVGhpcyBpcyBuZWNlc3NhcnkgZm9yIENocm9tZSBhbmQgQ2hyb21lIG1vYmlsZSwgdG8gZW5hYmxlXG4gKiB0aGluZ3MgbGlrZSByZWRlZmluaW5nIGBjcmVhdGVkQ2FsbGJhY2tgIG9uIGFuIGVsZW1lbnQuXG4gKi9cblxuY29uc3QgX2RlZmluZVByb3BlcnR5ID0gKE9iamVjdCBhcyBhbnkpW3pvbmVTeW1ib2woJ2RlZmluZVByb3BlcnR5JyldID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuY29uc3QgX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IChPYmplY3QgYXMgYW55KVt6b25lU3ltYm9sKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InKV0gPVxuICAgIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5jb25zdCBfY3JlYXRlID0gT2JqZWN0LmNyZWF0ZTtcbmNvbnN0IHVuY29uZmlndXJhYmxlc0tleSA9IHpvbmVTeW1ib2woJ3VuY29uZmlndXJhYmxlcycpO1xuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHlQYXRjaCgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5ID0gZnVuY3Rpb24ob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55KSB7XG4gICAgaWYgKGlzVW5jb25maWd1cmFibGUob2JqLCBwcm9wKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQ2Fubm90IGFzc2lnbiB0byByZWFkIG9ubHkgcHJvcGVydHkgXFwnJyArIHByb3AgKyAnXFwnIG9mICcgKyBvYmopO1xuICAgIH1cbiAgICBjb25zdCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcgPSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgICBpZiAocHJvcCAhPT0gJ3Byb3RvdHlwZScpIHtcbiAgICAgIGRlc2MgPSByZXdyaXRlRGVzY3JpcHRvcihvYmosIHByb3AsIGRlc2MpO1xuICAgIH1cbiAgICByZXR1cm4gX3RyeURlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYywgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnKTtcbiAgfTtcblxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uKG9iaiwgcHJvcHMpIHtcbiAgICBPYmplY3Qua2V5cyhwcm9wcykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBwcm9wc1twcm9wXSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIG9iajtcbiAgfTtcblxuICBPYmplY3QuY3JlYXRlID0gPGFueT5mdW5jdGlvbihvYmo6IGFueSwgcHJvdG86IGFueSkge1xuICAgIGlmICh0eXBlb2YgcHJvdG8gPT09ICdvYmplY3QnICYmICFPYmplY3QuaXNGcm96ZW4ocHJvdG8pKSB7XG4gICAgICBPYmplY3Qua2V5cyhwcm90bykuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICAgIHByb3RvW3Byb3BdID0gcmV3cml0ZURlc2NyaXB0b3Iob2JqLCBwcm9wLCBwcm90b1twcm9wXSk7XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIF9jcmVhdGUob2JqLCBwcm90byk7XG4gIH07XG5cbiAgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkge1xuICAgIGNvbnN0IGRlc2MgPSBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iaiwgcHJvcCk7XG4gICAgaWYgKGRlc2MgJiYgaXNVbmNvbmZpZ3VyYWJsZShvYmosIHByb3ApKSB7XG4gICAgICBkZXNjLmNvbmZpZ3VyYWJsZSA9IGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gZGVzYztcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIF9yZWRlZmluZVByb3BlcnR5KG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSkge1xuICBjb25zdCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcgPSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgZGVzYyA9IHJld3JpdGVEZXNjcmlwdG9yKG9iaiwgcHJvcCwgZGVzYyk7XG4gIHJldHVybiBfdHJ5RGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjLCBvcmlnaW5hbENvbmZpZ3VyYWJsZUZsYWcpO1xufVxuXG5mdW5jdGlvbiBpc1VuY29uZmlndXJhYmxlKG9iajogYW55LCBwcm9wOiBhbnkpIHtcbiAgcmV0dXJuIG9iaiAmJiBvYmpbdW5jb25maWd1cmFibGVzS2V5XSAmJiBvYmpbdW5jb25maWd1cmFibGVzS2V5XVtwcm9wXTtcbn1cblxuZnVuY3Rpb24gcmV3cml0ZURlc2NyaXB0b3Iob2JqOiBhbnksIHByb3A6IHN0cmluZywgZGVzYzogYW55KSB7XG4gIC8vIGlzc3VlLTkyNywgaWYgdGhlIGRlc2MgaXMgZnJvemVuLCBkb24ndCB0cnkgdG8gY2hhbmdlIHRoZSBkZXNjXG4gIGlmICghT2JqZWN0LmlzRnJvemVuKGRlc2MpKSB7XG4gICAgZGVzYy5jb25maWd1cmFibGUgPSB0cnVlO1xuICB9XG4gIGlmICghZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAvLyBpc3N1ZS05MjcsIGlmIHRoZSBvYmogaXMgZnJvemVuLCBkb24ndCB0cnkgdG8gc2V0IHRoZSBkZXNjIHRvIG9ialxuICAgIGlmICghb2JqW3VuY29uZmlndXJhYmxlc0tleV0gJiYgIU9iamVjdC5pc0Zyb3plbihvYmopKSB7XG4gICAgICBfZGVmaW5lUHJvcGVydHkob2JqLCB1bmNvbmZpZ3VyYWJsZXNLZXksIHt3cml0YWJsZTogdHJ1ZSwgdmFsdWU6IHt9fSk7XG4gICAgfVxuICAgIGlmIChvYmpbdW5jb25maWd1cmFibGVzS2V5XSkge1xuICAgICAgb2JqW3VuY29uZmlndXJhYmxlc0tleV1bcHJvcF0gPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZGVzYztcbn1cblxuZnVuY3Rpb24gX3RyeURlZmluZVByb3BlcnR5KG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSwgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnOiBhbnkpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gX2RlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYyk7XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAvLyBJbiBjYXNlIG9mIGVycm9ycywgd2hlbiB0aGUgY29uZmlndXJhYmxlIGZsYWcgd2FzIGxpa2VseSBzZXQgYnkgcmV3cml0ZURlc2NyaXB0b3IoKSwgbGV0J3NcbiAgICAgIC8vIHJldHJ5IHdpdGggdGhlIG9yaWdpbmFsIGZsYWcgdmFsdWVcbiAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxDb25maWd1cmFibGVGbGFnID09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGRlbGV0ZSBkZXNjLmNvbmZpZ3VyYWJsZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlc2MuY29uZmlndXJhYmxlID0gb3JpZ2luYWxDb25maWd1cmFibGVGbGFnO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuIF9kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgbGV0IGRlc2NKc29uOiBzdHJpbmd8bnVsbCA9IG51bGw7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZGVzY0pzb24gPSBKU09OLnN0cmluZ2lmeShkZXNjKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICBkZXNjSnNvbiA9IGRlc2MudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmxvZyhgQXR0ZW1wdGluZyB0byBjb25maWd1cmUgJyR7cHJvcH0nIHdpdGggZGVzY3JpcHRvciAnJHtkZXNjSnNvbn0nIG9uIG9iamVjdCAnJHtcbiAgICAgICAgICAgIG9ian0nIGFuZCBnb3QgZXJyb3IsIGdpdmluZyB1cDogJHtlcnJvcn1gKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9XG59XG4iXX0=