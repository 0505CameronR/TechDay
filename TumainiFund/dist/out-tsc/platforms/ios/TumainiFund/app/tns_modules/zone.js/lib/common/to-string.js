/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { zoneSymbol } from './utils';
// override Function.prototype.toString to make zone.js patched function
// look like native function
Zone.__load_patch('toString', (global) => {
    // patch Func.prototype.toString to let them look like native
    const originalFunctionToString = Function.prototype.toString;
    const ORIGINAL_DELEGATE_SYMBOL = zoneSymbol('OriginalDelegate');
    const PROMISE_SYMBOL = zoneSymbol('Promise');
    const ERROR_SYMBOL = zoneSymbol('Error');
    const newFunctionToString = function toString() {
        if (typeof this === 'function') {
            const originalDelegate = this[ORIGINAL_DELEGATE_SYMBOL];
            if (originalDelegate) {
                if (typeof originalDelegate === 'function') {
                    return originalFunctionToString.call(originalDelegate);
                }
                else {
                    return Object.prototype.toString.call(originalDelegate);
                }
            }
            if (this === Promise) {
                const nativePromise = global[PROMISE_SYMBOL];
                if (nativePromise) {
                    return originalFunctionToString.call(nativePromise);
                }
            }
            if (this === Error) {
                const nativeError = global[ERROR_SYMBOL];
                if (nativeError) {
                    return originalFunctionToString.call(nativeError);
                }
            }
        }
        return originalFunctionToString.call(this);
    };
    newFunctionToString[ORIGINAL_DELEGATE_SYMBOL] = originalFunctionToString;
    Function.prototype.toString = newFunctionToString;
    // patch Object.prototype.toString to let them look like native
    const originalObjectToString = Object.prototype.toString;
    const PROMISE_OBJECT_TO_STRING = '[object Promise]';
    Object.prototype.toString = function () {
        if (this instanceof Promise) {
            return PROMISE_OBJECT_TO_STRING;
        }
        return originalObjectToString.call(this);
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidG8tc3RyaW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL3RvLXN0cmluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sU0FBUyxDQUFDO0FBRW5DLHdFQUF3RTtBQUN4RSw0QkFBNEI7QUFDNUIsSUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxNQUFXLEVBQUUsRUFBRTtJQUM1Qyw2REFBNkQ7SUFDN0QsTUFBTSx3QkFBd0IsR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUU3RCxNQUFNLHdCQUF3QixHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBQ2hFLE1BQU0sY0FBYyxHQUFHLFVBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUM3QyxNQUFNLFlBQVksR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDekMsTUFBTSxtQkFBbUIsR0FBRyxTQUFTLFFBQVE7UUFDM0MsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVLEVBQUU7WUFDOUIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQztZQUN4RCxJQUFJLGdCQUFnQixFQUFFO2dCQUNwQixJQUFJLE9BQU8sZ0JBQWdCLEtBQUssVUFBVSxFQUFFO29CQUMxQyxPQUFPLHdCQUF3QixDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUN4RDtxQkFBTTtvQkFDTCxPQUFPLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO2lCQUN6RDthQUNGO1lBQ0QsSUFBSSxJQUFJLEtBQUssT0FBTyxFQUFFO2dCQUNwQixNQUFNLGFBQWEsR0FBRyxNQUFNLENBQUMsY0FBYyxDQUFDLENBQUM7Z0JBQzdDLElBQUksYUFBYSxFQUFFO29CQUNqQixPQUFPLHdCQUF3QixDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztpQkFDckQ7YUFDRjtZQUNELElBQUksSUFBSSxLQUFLLEtBQUssRUFBRTtnQkFDbEIsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDO2dCQUN6QyxJQUFJLFdBQVcsRUFBRTtvQkFDZixPQUFPLHdCQUF3QixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztpQkFDbkQ7YUFDRjtTQUNGO1FBQ0QsT0FBTyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0MsQ0FBQyxDQUFDO0lBQ0QsbUJBQTJCLENBQUMsd0JBQXdCLENBQUMsR0FBRyx3QkFBd0IsQ0FBQztJQUNsRixRQUFRLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxtQkFBbUIsQ0FBQztJQUdsRCwrREFBK0Q7SUFDL0QsTUFBTSxzQkFBc0IsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN6RCxNQUFNLHdCQUF3QixHQUFHLGtCQUFrQixDQUFDO0lBQ3BELE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHO1FBQzFCLElBQUksSUFBSSxZQUFZLE9BQU8sRUFBRTtZQUMzQixPQUFPLHdCQUF3QixDQUFDO1NBQ2pDO1FBQ0QsT0FBTyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDM0MsQ0FBQyxDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge3pvbmVTeW1ib2x9IGZyb20gJy4vdXRpbHMnO1xuXG4vLyBvdmVycmlkZSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmcgdG8gbWFrZSB6b25lLmpzIHBhdGNoZWQgZnVuY3Rpb25cbi8vIGxvb2sgbGlrZSBuYXRpdmUgZnVuY3Rpb25cblpvbmUuX19sb2FkX3BhdGNoKCd0b1N0cmluZycsIChnbG9iYWw6IGFueSkgPT4ge1xuICAvLyBwYXRjaCBGdW5jLnByb3RvdHlwZS50b1N0cmluZyB0byBsZXQgdGhlbSBsb29rIGxpa2UgbmF0aXZlXG4gIGNvbnN0IG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZyA9IEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZztcblxuICBjb25zdCBPUklHSU5BTF9ERUxFR0FURV9TWU1CT0wgPSB6b25lU3ltYm9sKCdPcmlnaW5hbERlbGVnYXRlJyk7XG4gIGNvbnN0IFBST01JU0VfU1lNQk9MID0gem9uZVN5bWJvbCgnUHJvbWlzZScpO1xuICBjb25zdCBFUlJPUl9TWU1CT0wgPSB6b25lU3ltYm9sKCdFcnJvcicpO1xuICBjb25zdCBuZXdGdW5jdGlvblRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgaWYgKHR5cGVvZiB0aGlzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICBjb25zdCBvcmlnaW5hbERlbGVnYXRlID0gdGhpc1tPUklHSU5BTF9ERUxFR0FURV9TWU1CT0xdO1xuICAgICAgaWYgKG9yaWdpbmFsRGVsZWdhdGUpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBvcmlnaW5hbERlbGVnYXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKG9yaWdpbmFsRGVsZWdhdGUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob3JpZ2luYWxEZWxlZ2F0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0aGlzID09PSBQcm9taXNlKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZVByb21pc2UgPSBnbG9iYWxbUFJPTUlTRV9TWU1CT0xdO1xuICAgICAgICBpZiAobmF0aXZlUHJvbWlzZSkge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChuYXRpdmVQcm9taXNlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRoaXMgPT09IEVycm9yKSB7XG4gICAgICAgIGNvbnN0IG5hdGl2ZUVycm9yID0gZ2xvYmFsW0VSUk9SX1NZTUJPTF07XG4gICAgICAgIGlmIChuYXRpdmVFcnJvcikge1xuICAgICAgICAgIHJldHVybiBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmcuY2FsbChuYXRpdmVFcnJvcik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbmFsRnVuY3Rpb25Ub1N0cmluZy5jYWxsKHRoaXMpO1xuICB9O1xuICAobmV3RnVuY3Rpb25Ub1N0cmluZyBhcyBhbnkpW09SSUdJTkFMX0RFTEVHQVRFX1NZTUJPTF0gPSBvcmlnaW5hbEZ1bmN0aW9uVG9TdHJpbmc7XG4gIEZ1bmN0aW9uLnByb3RvdHlwZS50b1N0cmluZyA9IG5ld0Z1bmN0aW9uVG9TdHJpbmc7XG5cblxuICAvLyBwYXRjaCBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nIHRvIGxldCB0aGVtIGxvb2sgbGlrZSBuYXRpdmVcbiAgY29uc3Qgb3JpZ2luYWxPYmplY3RUb1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XG4gIGNvbnN0IFBST01JU0VfT0JKRUNUX1RPX1NUUklORyA9ICdbb2JqZWN0IFByb21pc2VdJztcbiAgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICh0aGlzIGluc3RhbmNlb2YgUHJvbWlzZSkge1xuICAgICAgcmV0dXJuIFBST01JU0VfT0JKRUNUX1RPX1NUUklORztcbiAgICB9XG4gICAgcmV0dXJuIG9yaWdpbmFsT2JqZWN0VG9TdHJpbmcuY2FsbCh0aGlzKTtcbiAgfTtcbn0pO1xuIl19