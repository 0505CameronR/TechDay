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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tc3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL3RvLXN0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7R0FNRztBQUNILGlDQUFtQztBQUVuQyx3RUFBd0U7QUFDeEUsNEJBQTRCO0FBQzVCLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQUMsTUFBVztJQUN4Qyw2REFBNkQ7SUFDN0QsSUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUU3RCxJQUFNLHdCQUF3QixHQUFHLGtCQUFVLENBQUMsa0JBQWtCLENBQUMsQ0FBQztJQUNoRSxJQUFNLGNBQWMsR0FBRyxrQkFBVSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzdDLElBQU0sWUFBWSxHQUFHLGtCQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsSUFBTSxtQkFBbUIsR0FBRyxTQUFTLFFBQVE7UUFDM0MsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDOUIsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUN4RCxJQUFJLGdCQUFnQixFQUFFO2dCQUNwQixJQUFJLE9BQU8sZ0JBQWdCLEtBQUssVUFBVSxFQUFFO29CQUMxQyxPQUFPLHdCQUF3QixDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDbEY7cUJBQU07b0JBQ0wsT0FBTyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztpQkFDekQ7YUFDRjtZQUNELElBQUksSUFBSSxLQUFLLE9BQU8sRUFBRTtnQkFDcEIsSUFBTSxhQUFhLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxDQUFDO2dCQUM3QyxJQUFJLGFBQWEsRUFBRTtvQkFDakIsT0FBTyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO2lCQUNqRTthQUNGO1lBQ0QsSUFBSSxJQUFJLEtBQUssS0FBSyxFQUFFO2dCQUNsQixJQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUM7Z0JBQ3pDLElBQUksV0FBVyxFQUFFO29CQUNmLE9BQU8sd0JBQXdCLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxTQUFTLENBQUMsQ0FBQztpQkFDL0Q7YUFDRjtTQUNGO1FBQ0QsT0FBTyx3QkFBd0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3pELENBQUMsQ0FBQztJQUNELG1CQUEyQixDQUFDLHdCQUF3QixDQUFDLEdBQUcsd0JBQXdCLENBQUM7SUFDbEYsUUFBUSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsbUJBQW1CLENBQUM7SUFHbEQsK0RBQStEO0lBQy9ELElBQU0sc0JBQXNCLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUM7SUFDekQsSUFBTSx3QkFBd0IsR0FBRyxrQkFBa0IsQ0FBQztJQUNwRCxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRztRQUMxQixJQUFJLElBQUksWUFBWSxPQUFPLEVBQUU7WUFDM0IsT0FBTyx3QkFBd0IsQ0FBQztTQUNqQztRQUNELE9BQU8sc0JBQXNCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN2RCxDQUFDLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7em9uZVN5bWJvbH0gZnJvbSAnLi91dGlscyc7XG5cbi8vIG92ZXJyaWRlIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyB0byBtYWtlIHpvbmUuanMgcGF0Y2hlZCBmdW5jdGlvblxuLy8gbG9vayBsaWtlIG5hdGl2ZSBmdW5jdGlvblxuWm9uZS5fX2xvYWRfcGF0Y2goJ3RvU3RyaW5nJywgKGdsb2JhbDogYW55KSA9PiB7XG4gIC8vIHBhdGNoIEZ1bmMucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgY29uc3Qgb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nID0gRnVuY3Rpb24ucHJvdG90eXBlLnRvU3RyaW5nO1xuXG4gIGNvbnN0IE9SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTCA9IHpvbmVTeW1ib2woJ09yaWdpbmFsRGVsZWdhdGUnKTtcbiAgY29uc3QgUFJPTUlTRV9TWU1CT0wgPSB6b25lU3ltYm9sKCdQcm9taXNlJyk7XG4gIGNvbnN0IEVSUk9SX1NZTUJPTCA9IHpvbmVTeW1ib2woJ0Vycm9yJyk7XG4gIGNvbnN0IG5ld0Z1bmN0aW9uVG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICBpZiAodHlwZW9mIHRoaXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNvbnN0IG9yaWdpbmFsRGVsZWdhdGUgPSB0aGlzW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF07XG4gICAgICBpZiAob3JpZ2luYWxEZWxlZ2F0ZSkge1xuICAgICAgICBpZiAodHlwZW9mIG9yaWdpbmFsRGVsZWdhdGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmFwcGx5KHRoaXNbT1JJR0lOQUxfREVMRUdBVEVfU1lNQk9MXSwgYXJndW1lbnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9yaWdpbmFsRGVsZWdhdGUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodGhpcyA9PT0gUHJvbWlzZSkge1xuICAgICAgICBjb25zdCBuYXRpdmVQcm9taXNlID0gZ2xvYmFsW1BST01JU0VfU1lNQk9MXTtcbiAgICAgICAgaWYgKG5hdGl2ZVByb21pc2UpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmFwcGx5KG5hdGl2ZVByb21pc2UsIGFyZ3VtZW50cyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzID09PSBFcnJvcikge1xuICAgICAgICBjb25zdCBuYXRpdmVFcnJvciA9IGdsb2JhbFtFUlJPUl9TWU1CT0xdO1xuICAgICAgICBpZiAobmF0aXZlRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nLmFwcGx5KG5hdGl2ZUVycm9yLCBhcmd1bWVudHMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbiAgKG5ld0Z1bmN0aW9uVG9TdHJpbmcgYXMgYW55KVtPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdID0gb3JpZ2luYWxGdW5jdGlvblRvU3RyaW5nO1xuICBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgPSBuZXdGdW5jdGlvblRvU3RyaW5nO1xuXG5cbiAgLy8gcGF0Y2ggT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyB0byBsZXQgdGhlbSBsb29rIGxpa2UgbmF0aXZlXG4gIGNvbnN0IG9yaWdpbmFsT2JqZWN0VG9TdHJpbmcgPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nO1xuICBjb25zdCBQUk9NSVNFX09CSkVDVF9UT19TVFJJTkcgPSAnW29iamVjdCBQcm9taXNlXSc7XG4gIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAodGhpcyBpbnN0YW5jZW9mIFByb21pc2UpIHtcbiAgICAgIHJldHVybiBQUk9NSVNFX09CSkVDVF9UT19TVFJJTkc7XG4gICAgfVxuICAgIHJldHVybiBvcmlnaW5hbE9iamVjdFRvU3RyaW5nLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gIH07XG59KTtcbiJdfQ==