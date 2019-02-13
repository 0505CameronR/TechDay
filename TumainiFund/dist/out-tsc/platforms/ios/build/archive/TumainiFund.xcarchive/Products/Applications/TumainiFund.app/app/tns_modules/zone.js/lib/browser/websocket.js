"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("../common/events");
var utils_1 = require("../common/utils");
// we have to patch the instance since the proto is non-configurable
function apply(api, _global) {
    var WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        events_1.patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        var socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        var proxySocket;
        var proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        var onmessageDesc = utils_1.ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = utils_1.ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [utils_1.ADD_EVENT_LISTENER_STR, utils_1.REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    var args = utils_1.ArraySlice.call(arguments);
                    if (propName === utils_1.ADD_EVENT_LISTENER_STR || propName === utils_1.REMOVE_EVENT_LISTENER_STR) {
                        var eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            var propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
                            socket[propertySymbol] = proxySocket[propertySymbol];
                        }
                    }
                    return socket[propName].apply(socket, args);
                };
            });
        }
        else {
            // we can patch the real socket
            proxySocket = socket;
        }
        utils_1.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    var globalWebSocket = _global['WebSocket'];
    for (var prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}
exports.apply = apply;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9icm93c2VyL3dlYnNvY2tldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILDJDQUFrRDtBQUNsRCx5Q0FBK0o7QUFFL0osb0VBQW9FO0FBQ3BFLFNBQWdCLEtBQUssQ0FBQyxHQUFpQixFQUFFLE9BQVk7SUFDbkQsSUFBTSxFQUFFLEdBQVMsT0FBUSxDQUFDLFNBQVMsQ0FBQztJQUNwQyx5RkFBeUY7SUFDekYsaUVBQWlFO0lBQ2pFLElBQUksQ0FBTyxPQUFRLENBQUMsV0FBVyxFQUFFO1FBQy9CLHlCQUFnQixDQUFDLE9BQU8sRUFBRSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO0tBQzNDO0lBQ0ssT0FBUSxDQUFDLFNBQVMsR0FBRyxVQUFTLENBQU0sRUFBRSxDQUFNO1FBQ2hELElBQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELElBQUksV0FBZ0IsQ0FBQztRQUVyQixJQUFJLGdCQUFxQixDQUFDO1FBRTFCLGdHQUFnRztRQUNoRyxJQUFNLGFBQWEsR0FBRyxzQ0FBOEIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDMUUsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxLQUFLLEVBQUU7WUFDekQsV0FBVyxHQUFHLG9CQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDbkMsa0ZBQWtGO1lBQ2xGLDBFQUEwRTtZQUMxRSwyQkFBMkI7WUFDM0IsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1lBQzFCLENBQUMsOEJBQXNCLEVBQUUsaUNBQXlCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUN6RSxRQUFRO2dCQUNWLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRztvQkFDdEIsSUFBTSxJQUFJLEdBQUcsa0JBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3hDLElBQUksUUFBUSxLQUFLLDhCQUFzQixJQUFJLFFBQVEsS0FBSyxpQ0FBeUIsRUFBRTt3QkFDakYsSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUN4RCxJQUFJLFNBQVMsRUFBRTs0QkFDYixJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQzs0QkFDbEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDdEQ7cUJBQ0Y7b0JBQ0QsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsK0JBQStCO1lBQy9CLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDdEI7UUFFRCx5QkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1FBQ3hGLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUMsQ0FBQztJQUVGLElBQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUM3QyxLQUFLLElBQU0sSUFBSSxJQUFJLEVBQUUsRUFBRTtRQUNyQixlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xDO0FBQ0gsQ0FBQztBQWhERCxzQkFnREMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7cGF0Y2hFdmVudFRhcmdldH0gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQge0FERF9FVkVOVF9MSVNURU5FUl9TVFIsIEFycmF5U2xpY2UsIE9iamVjdENyZWF0ZSwgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLCBwYXRjaE9uUHJvcGVydGllcywgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUn0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcblxuLy8gd2UgaGF2ZSB0byBwYXRjaCB0aGUgaW5zdGFuY2Ugc2luY2UgdGhlIHByb3RvIGlzIG5vbi1jb25maWd1cmFibGVcbmV4cG9ydCBmdW5jdGlvbiBhcHBseShhcGk6IF9ab25lUHJpdmF0ZSwgX2dsb2JhbDogYW55KSB7XG4gIGNvbnN0IFdTID0gKDxhbnk+X2dsb2JhbCkuV2ViU29ja2V0O1xuICAvLyBPbiBTYWZhcmkgd2luZG93LkV2ZW50VGFyZ2V0IGRvZXNuJ3QgZXhpc3Qgc28gbmVlZCB0byBwYXRjaCBXUyBhZGQvcmVtb3ZlRXZlbnRMaXN0ZW5lclxuICAvLyBPbiBvbGRlciBDaHJvbWUsIG5vIG5lZWQgc2luY2UgRXZlbnRUYXJnZXQgd2FzIGFscmVhZHkgcGF0Y2hlZFxuICBpZiAoISg8YW55Pl9nbG9iYWwpLkV2ZW50VGFyZ2V0KSB7XG4gICAgcGF0Y2hFdmVudFRhcmdldChfZ2xvYmFsLCBbV1MucHJvdG90eXBlXSk7XG4gIH1cbiAgKDxhbnk+X2dsb2JhbCkuV2ViU29ja2V0ID0gZnVuY3Rpb24oeDogYW55LCB5OiBhbnkpIHtcbiAgICBjb25zdCBzb2NrZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IG5ldyBXUyh4LCB5KSA6IG5ldyBXUyh4KTtcbiAgICBsZXQgcHJveHlTb2NrZXQ6IGFueTtcblxuICAgIGxldCBwcm94eVNvY2tldFByb3RvOiBhbnk7XG5cbiAgICAvLyBTYWZhcmkgNy4wIGhhcyBub24tY29uZmlndXJhYmxlIG93biAnb25tZXNzYWdlJyBhbmQgZnJpZW5kcyBwcm9wZXJ0aWVzIG9uIHRoZSBzb2NrZXQgaW5zdGFuY2VcbiAgICBjb25zdCBvbm1lc3NhZ2VEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvY2tldCwgJ29ubWVzc2FnZScpO1xuICAgIGlmIChvbm1lc3NhZ2VEZXNjICYmIG9ubWVzc2FnZURlc2MuY29uZmlndXJhYmxlID09PSBmYWxzZSkge1xuICAgICAgcHJveHlTb2NrZXQgPSBPYmplY3RDcmVhdGUoc29ja2V0KTtcbiAgICAgIC8vIHNvY2tldCBoYXZlIG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yICdvbm9wZW4nLCAnb25tZXNzYWdlJywgJ29uY2xvc2UnLCAnb25lcnJvcidcbiAgICAgIC8vIGJ1dCBwcm94eVNvY2tldCBub3QsIHNvIHdlIHdpbGwga2VlcCBzb2NrZXQgYXMgcHJvdG90eXBlIGFuZCBwYXNzIGl0IHRvXG4gICAgICAvLyBwYXRjaE9uUHJvcGVydGllcyBtZXRob2RcbiAgICAgIHByb3h5U29ja2V0UHJvdG8gPSBzb2NrZXQ7XG4gICAgICBbQUREX0VWRU5UX0xJU1RFTkVSX1NUUiwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUiwgJ3NlbmQnLCAnY2xvc2UnXS5mb3JFYWNoKGZ1bmN0aW9uKFxuICAgICAgICAgIHByb3BOYW1lKSB7XG4gICAgICAgIHByb3h5U29ja2V0W3Byb3BOYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgPT09IEFERF9FVkVOVF9MSVNURU5FUl9TVFIgfHwgcHJvcE5hbWUgPT09IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5U3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKCdPTl9QUk9QRVJUWScgKyBldmVudE5hbWUpO1xuICAgICAgICAgICAgICBzb2NrZXRbcHJvcGVydHlTeW1ib2xdID0gcHJveHlTb2NrZXRbcHJvcGVydHlTeW1ib2xdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc29ja2V0W3Byb3BOYW1lXS5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdlIGNhbiBwYXRjaCB0aGUgcmVhbCBzb2NrZXRcbiAgICAgIHByb3h5U29ja2V0ID0gc29ja2V0O1xuICAgIH1cblxuICAgIHBhdGNoT25Qcm9wZXJ0aWVzKHByb3h5U29ja2V0LCBbJ2Nsb3NlJywgJ2Vycm9yJywgJ21lc3NhZ2UnLCAnb3BlbiddLCBwcm94eVNvY2tldFByb3RvKTtcbiAgICByZXR1cm4gcHJveHlTb2NrZXQ7XG4gIH07XG5cbiAgY29uc3QgZ2xvYmFsV2ViU29ja2V0ID0gX2dsb2JhbFsnV2ViU29ja2V0J107XG4gIGZvciAoY29uc3QgcHJvcCBpbiBXUykge1xuICAgIGdsb2JhbFdlYlNvY2tldFtwcm9wXSA9IFdTW3Byb3BdO1xuICB9XG59XG4iXX0=