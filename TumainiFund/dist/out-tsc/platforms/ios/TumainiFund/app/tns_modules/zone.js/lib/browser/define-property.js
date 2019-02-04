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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVmaW5lLXByb3BlcnR5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9kZWZpbmUtcHJvcGVydHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx5Q0FBMkM7QUFDM0M7OztHQUdHO0FBRUgsSUFBTSxlQUFlLEdBQUksTUFBYyxDQUFDLGtCQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUM7QUFDOUYsSUFBTSx5QkFBeUIsR0FBSSxNQUFjLENBQUMsa0JBQVUsQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0lBQ3JGLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQztBQUNwQyxJQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQzlCLElBQU0sa0JBQWtCLEdBQUcsa0JBQVUsQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXpELFNBQWdCLGFBQWE7SUFDM0IsTUFBTSxDQUFDLGNBQWMsR0FBRyxVQUFTLEdBQVEsRUFBRSxJQUFZLEVBQUUsSUFBUztRQUNoRSxJQUFJLGdCQUFnQixDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBRTtZQUMvQixNQUFNLElBQUksU0FBUyxDQUFDLHdDQUF3QyxHQUFHLElBQUksR0FBRyxRQUFRLEdBQUcsR0FBRyxDQUFDLENBQUM7U0FDdkY7UUFDRCxJQUFNLHdCQUF3QixHQUFHLElBQUksQ0FBQyxZQUFZLENBQUM7UUFDbkQsSUFBSSxJQUFJLEtBQUssV0FBVyxFQUFFO1lBQ3hCLElBQUksR0FBRyxpQkFBaUIsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQzNDO1FBQ0QsT0FBTyxrQkFBa0IsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUks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ZCxDQUFDO0FBRUQsU0FBUyxrQkFBa0IsQ0FBQyxHQUFRLEVBQUUsSUFBWSxFQUFFLElBQVMsRUFBRSx3QkFBNkI7SUFDMUYsSUFBSTtRQUNGLE9BQU8sZUFBZSxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDekM7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNkLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNyQiw2RkFBNkY7WUFDN0YscUNBQXFDO1lBQ3JDLElBQUksT0FBTyx3QkFBd0IsSUFBSSxXQUFXLEVBQUU7Z0JBQ2xELE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQzthQUMxQjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsWUFBWSxHQUFHLHdCQUF3QixDQUFDO2FBQzlDO1lBQ0QsSUFBSTtnQkFDRixPQUFPLGVBQWUsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ3pDO1lBQUMsT0FBTyxLQUFLLEVBQUU7Z0JBQ2QsSUFBSSxRQUFRLEdBQWdCLElBQUksQ0FBQztnQkFDakMsSUFBSTtvQkFDRixRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztpQkFDakM7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ2QsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztpQkFDNUI7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBNEIsSUFBSSwyQkFBc0IsUUFBUSxxQkFDdEUsR0FBRyxvQ0FBK0IsS0FBTyxDQUFDLENBQUM7YUFDaEQ7U0FDRjthQUFNO1lBQ0wsTUFBTSxLQUFLLENBQUM7U0FDYjtLQUNGO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHt6b25lU3ltYm9sfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuLypcbiAqIFRoaXMgaXMgbmVjZXNzYXJ5IGZvciBDaHJvbWUgYW5kIENocm9tZSBtb2JpbGUsIHRvIGVuYWJsZVxuICogdGhpbmdzIGxpa2UgcmVkZWZpbmluZyBgY3JlYXRlZENhbGxiYWNrYCBvbiBhbiBlbGVtZW50LlxuICovXG5cbmNvbnN0IF9kZWZpbmVQcm9wZXJ0eSA9IChPYmplY3QgYXMgYW55KVt6b25lU3ltYm9sKCdkZWZpbmVQcm9wZXJ0eScpXSA9IE9iamVjdC5kZWZpbmVQcm9wZXJ0eTtcbmNvbnN0IF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSAoT2JqZWN0IGFzIGFueSlbem9uZVN5bWJvbCgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJyldID1cbiAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuY29uc3QgX2NyZWF0ZSA9IE9iamVjdC5jcmVhdGU7XG5jb25zdCB1bmNvbmZpZ3VyYWJsZXNLZXkgPSB6b25lU3ltYm9sKCd1bmNvbmZpZ3VyYWJsZXMnKTtcblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5UGF0Y2goKSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uKG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSkge1xuICAgIGlmIChpc1VuY29uZmlndXJhYmxlKG9iaiwgcHJvcCkpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Nhbm5vdCBhc3NpZ24gdG8gcmVhZCBvbmx5IHByb3BlcnR5IFxcJycgKyBwcm9wICsgJ1xcJyBvZiAnICsgb2JqKTtcbiAgICB9XG4gICAgY29uc3Qgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnID0gZGVzYy5jb25maWd1cmFibGU7XG4gICAgaWYgKHByb3AgIT09ICdwcm90b3R5cGUnKSB7XG4gICAgICBkZXNjID0gcmV3cml0ZURlc2NyaXB0b3Iob2JqLCBwcm9wLCBkZXNjKTtcbiAgICB9XG4gICAgcmV0dXJuIF90cnlEZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MsIG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZyk7XG4gIH07XG5cbiAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMgPSBmdW5jdGlvbihvYmosIHByb3BzKSB7XG4gICAgT2JqZWN0LmtleXMocHJvcHMpLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgcHJvcHNbcHJvcF0pO1xuICAgIH0pO1xuICAgIHJldHVybiBvYmo7XG4gIH07XG5cbiAgT2JqZWN0LmNyZWF0ZSA9IDxhbnk+ZnVuY3Rpb24ob2JqOiBhbnksIHByb3RvOiBhbnkpIHtcbiAgICBpZiAodHlwZW9mIHByb3RvID09PSAnb2JqZWN0JyAmJiAhT2JqZWN0LmlzRnJvemVuKHByb3RvKSkge1xuICAgICAgT2JqZWN0LmtleXMocHJvdG8pLmZvckVhY2goZnVuY3Rpb24ocHJvcCkge1xuICAgICAgICBwcm90b1twcm9wXSA9IHJld3JpdGVEZXNjcmlwdG9yKG9iaiwgcHJvcCwgcHJvdG9bcHJvcF0pO1xuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBfY3JlYXRlKG9iaiwgcHJvdG8pO1xuICB9O1xuXG4gIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbihvYmosIHByb3ApIHtcbiAgICBjb25zdCBkZXNjID0gX2dldE93blByb3BlcnR5RGVzY3JpcHRvcihvYmosIHByb3ApO1xuICAgIGlmIChkZXNjICYmIGlzVW5jb25maWd1cmFibGUob2JqLCBwcm9wKSkge1xuICAgICAgZGVzYy5jb25maWd1cmFibGUgPSBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIGRlc2M7XG4gIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBfcmVkZWZpbmVQcm9wZXJ0eShvYmo6IGFueSwgcHJvcDogc3RyaW5nLCBkZXNjOiBhbnkpIHtcbiAgY29uc3Qgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnID0gZGVzYy5jb25maWd1cmFibGU7XG4gIGRlc2MgPSByZXdyaXRlRGVzY3JpcHRvcihvYmosIHByb3AsIGRlc2MpO1xuICByZXR1cm4gX3RyeURlZmluZVByb3BlcnR5KG9iaiwgcHJvcCwgZGVzYywgb3JpZ2luYWxDb25maWd1cmFibGVGbGFnKTtcbn1cblxuZnVuY3Rpb24gaXNVbmNvbmZpZ3VyYWJsZShvYmo6IGFueSwgcHJvcDogYW55KSB7XG4gIHJldHVybiBvYmogJiYgb2JqW3VuY29uZmlndXJhYmxlc0tleV0gJiYgb2JqW3VuY29uZmlndXJhYmxlc0tleV1bcHJvcF07XG59XG5cbmZ1bmN0aW9uIHJld3JpdGVEZXNjcmlwdG9yKG9iajogYW55LCBwcm9wOiBzdHJpbmcsIGRlc2M6IGFueSkge1xuICAvLyBpc3N1ZS05MjcsIGlmIHRoZSBkZXNjIGlzIGZyb3plbiwgZG9uJ3QgdHJ5IHRvIGNoYW5nZSB0aGUgZGVzY1xuICBpZiAoIU9iamVjdC5pc0Zyb3plbihkZXNjKSkge1xuICAgIGRlc2MuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgfVxuICBpZiAoIWRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgLy8gaXNzdWUtOTI3LCBpZiB0aGUgb2JqIGlzIGZyb3plbiwgZG9uJ3QgdHJ5IHRvIHNldCB0aGUgZGVzYyB0byBvYmpcbiAgICBpZiAoIW9ialt1bmNvbmZpZ3VyYWJsZXNLZXldICYmICFPYmplY3QuaXNGcm96ZW4ob2JqKSkge1xuICAgICAgX2RlZmluZVByb3BlcnR5KG9iaiwgdW5jb25maWd1cmFibGVzS2V5LCB7d3JpdGFibGU6IHRydWUsIHZhbHVlOiB7fX0pO1xuICAgIH1cbiAgICBpZiAob2JqW3VuY29uZmlndXJhYmxlc0tleV0pIHtcbiAgICAgIG9ialt1bmNvbmZpZ3VyYWJsZXNLZXldW3Byb3BdID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGRlc2M7XG59XG5cbmZ1bmN0aW9uIF90cnlEZWZpbmVQcm9wZXJ0eShvYmo6IGFueSwgcHJvcDogc3RyaW5nLCBkZXNjOiBhbnksIG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZzogYW55KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIF9kZWZpbmVQcm9wZXJ0eShvYmosIHByb3AsIGRlc2MpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChkZXNjLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgLy8gSW4gY2FzZSBvZiBlcnJvcnMsIHdoZW4gdGhlIGNvbmZpZ3VyYWJsZSBmbGFnIHdhcyBsaWtlbHkgc2V0IGJ5IHJld3JpdGVEZXNjcmlwdG9yKCksIGxldCdzXG4gICAgICAvLyByZXRyeSB3aXRoIHRoZSBvcmlnaW5hbCBmbGFnIHZhbHVlXG4gICAgICBpZiAodHlwZW9mIG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZyA9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBkZWxldGUgZGVzYy5jb25maWd1cmFibGU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBkZXNjLmNvbmZpZ3VyYWJsZSA9IG9yaWdpbmFsQ29uZmlndXJhYmxlRmxhZztcbiAgICAgIH1cbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBfZGVmaW5lUHJvcGVydHkob2JqLCBwcm9wLCBkZXNjKTtcbiAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGxldCBkZXNjSnNvbjogc3RyaW5nfG51bGwgPSBudWxsO1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGRlc2NKc29uID0gSlNPTi5zdHJpbmdpZnkoZGVzYyk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgZGVzY0pzb24gPSBkZXNjLnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coYEF0dGVtcHRpbmcgdG8gY29uZmlndXJlICcke3Byb3B9JyB3aXRoIGRlc2NyaXB0b3IgJyR7ZGVzY0pzb259JyBvbiBvYmplY3QgJyR7XG4gICAgICAgICAgICBvYmp9JyBhbmQgZ290IGVycm9yLCBnaXZpbmcgdXA6ICR7ZXJyb3J9YCk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfVxufVxuIl19