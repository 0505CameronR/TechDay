"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
var utils_1 = require("./utils");
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', function (global) {
    // patch Func.prototype.toString to let them look like native
    var originalFunctionToString = Function.prototype.toString;
    var ORIGINAL_DELEGATE_SYMBOL = utils_1.zoneSymbol('OriginalDelegate');
    var PROMISE_SYMBOL = utils_1.zoneSymbol('Promise');
    var ERROR_SYMBOL = utils_1.zoneSymbol('Error');
    var newFunctionToString = function toString() {
        if (typeof this === 'function') {
            var originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.apply(this[ORIGINAL_DELEGATE_SYMBOL], arguments);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                var nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.apply(nativePromise, arguments);
                }
            }
            if (this === Error) {
                var nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.apply(nativeError, arguments);
                }
            }
        }
        return originalFunctionToString.apply(this, arguments);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    var originalObjectToString = Object.prototype.toString;
    var PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.apply(this, arguments);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tc3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vdG8tc3RyaW5nLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUE7Ozs7OztHQU1HO0FBQ0gsaUNBQW1DO0FBRW5DLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsVUFBQyxNQUFXO0lBQ3hDLDZEQUE2RDtJQUM3RCxJQUFNLHdCQUF3QixHQUFHLFFBQVEsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDO0lBRTdELElBQU0sd0JBQXdCLEdBQUcsa0JBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hFLElBQU0sY0FBYyxHQUFHLGtCQUFVLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDN0MsSUFBTSxZQUFZLEdBQUcsa0JBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxJQUFNLG1CQUFtQixHQUFHLFNBQVMsUUFBUTtRQUMzQyxJQUFJLE9BQU8sSUFBSSxLQUFLLFVBQVUsRUFBRTtZQUM5QixJQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO1lBQ3hELElBQUksZ0JBQWdCLEVBQUU7Z0JBQ3BCLElBQUksT0FBTyxnQkFBZ0IsS0FBSyxVQUFVLEVBQUU7b0JBQzFDLE9BQU8sd0JBQXdCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUNsRjtxQkFBTTtvQkFDTCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUN6RDthQUNGO1lBQ0QsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUNwQixJQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzdDLElBQUksYUFBYSxFQUFFO29CQUNqQixPQUFPLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7aUJBQ2pFO2FBQ0Y7WUFDRCxJQUFJLElBQUksS0FBSyxLQUFLLEVBQUU7Z0JBQ2xCLElBQU0sV0FBVyxHQUFHLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQztnQkFDekMsSUFBSSxXQUFXLEVBQUU7b0JBQ2YsT0FBTyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsV0FBVyxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUMvRDthQUNGO1NBQ0Y7UUFDRCxPQUFPLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDO0lBQ0QsbUJBQTJCLENBQUMsd0JBQXdCLENBQUMsR0FBRyx3QkFBd0IsQ0FBQztJQUNsRixRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQztJQUdsRCwrREFBK0Q7SUFDL0QsSUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN6RCxJQUFNLHdCQUF3QixHQUFHLGtCQUFrQixDQUFDO0lBQ3BELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHO1FBQzFCLElBQUksSUFBSSxZQUFZLE9BQU8sRUFBRTtZQUMzQixPQUFPLHdCQUF3QixDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3ZELENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHt6b25lU3ltYm9sfSBmcm9tICcuL3V0aWxzJztcblxuLy8gb3ZlcnJpZGUgRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nIHRvIG1ha2Ugem9uZS5qcyBwYXRjaGVkIGZ1bmN0aW9uXG4vLyBsb29rIGxpa2UgbmF0aXZlIGZ1bmN0aW9uXG5ab25lLl9fbG9hZF9wYXRjaCgndG9TdHJpbmcnLCAoZ2xvYmFsOiBhbnkpID0+IHtcbiAgLy8gcGF0Y2ggRnVuYy5wcm90b3R5cGUudG9TdHJpbmcgdG8gbGV0IHRoZW0gbG9vayBsaWtlIG5hdGl2ZVxuICBjb25zdCBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG5cbiAgY29uc3QgT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MID0gem9uZVN5bWJvbCgnT3JpZ2luYWxEZWxlZ2F0ZScpO1xuICBjb25zdCBQUk9NSVNFX1NZTUJPTCA9IHpvbmVTeW1ib2woJ1Byb21pc2UnKTtcbiAgY29uc3QgRVJST1JfU1lNQk9MID0gem9uZVN5bWJvbCgnRXJyb3InKTtcbiAgY29uc3QgbmV3RnVuY3Rpb25Ub1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIGlmICh0eXBlb2YgdGhpcyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY29uc3Qgb3JpZ2luYWxEZWxlZ2F0ZSA9IHRoaXNbT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MXTtcbiAgICAgIGlmIChvcmlnaW5hbERlbGVnYXRlKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygb3JpZ2luYWxEZWxlZ2F0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuYXBwbHkodGhpc1tPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdLCBhcmd1bWVudHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3JpZ2luYWxEZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzID09PSBQcm9taXNlKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZVByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV9TWU1CT0xdO1xuICAgICAgICBpZiAobmF0aXZlUHJvbWlzZSkge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuYXBwbHkobmF0aXZlUHJvbWlzZSwgYXJndW1lbnRzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMgPT09IEVycm9yKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVycm9yID0gZ2xvYmFsW0VSUk9SX1NZTUJPTF07XG4gICAgICAgIGlmIChuYXRpdmVFcnJvcikge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuYXBwbHkobmF0aXZlRXJyb3IsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICB9O1xuICAobmV3RnVuY3Rpb25Ub1N0cmluZyBhcyBhbnkpW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF0gPSBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmc7XG4gIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IG5ld0Z1bmN0aW9uVG9TdHJpbmc7XG5cblxuICAvLyBwYXRjaCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgY29uc3Qgb3JpZ2luYWxPYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGNvbnN0IFBST01JU0VfT0JKRUNUX1RPX1NUUklORyA9ICdbb2JqZWN0IFByb21pc2VdJztcbiAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgcmV0dXJuIFBST01JU0VfT0JKRUNUX1RPX1NUUklORztcbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbmFsT2JqZWN0VG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn0pO1xuIl19