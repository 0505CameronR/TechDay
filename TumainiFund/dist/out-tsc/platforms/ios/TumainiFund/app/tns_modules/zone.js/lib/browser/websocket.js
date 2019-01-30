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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCwyQ0FBa0Q7QUFDbEQseUNBQStKO0FBRS9KLG9FQUFvRTtBQUNwRSxTQUFnQixLQUFLLENBQUMsR0FBaUIsRUFBRSxPQUFZO0lBQ25ELElBQU0sRUFBRSxHQUFTLE9BQVEsQ0FBQyxTQUFTLENBQUM7SUFDcEMseUZBQXlGO0lBQ3pGLGlFQUFpRTtJQUNqRSxJQUFJLENBQU8sT0FBUSxDQUFDLFdBQVcsRUFBRTtRQUMvQix5QkFBZ0IsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxFQUFFLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztLQUMzQztJQUNLLE9BQVEsQ0FBQyxTQUFTLEdBQUcsVUFBUyxDQUFNLEVBQUUsQ0FBTTtRQUNoRCxJQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMvRCxJQUFJLFdBQWdCLENBQUM7UUFFckIsSUFBSSxnQkFBcUIsQ0FBQztRQUUxQixnR0FBZ0c7UUFDaEcsSUFBTSxhQUFhLEdBQUcsc0NBQThCLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQzFFLElBQUksYUFBYSxJQUFJLGFBQWEsQ0FBQyxZQUFZLEtBQUssS0FBSyxFQUFFO1lBQ3pELFdBQVcsR0FBRyxvQkFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ25DLGtGQUFrRjtZQUNsRiwwRUFBMEU7WUFDMUUsMkJBQTJCO1lBQzNCLGdCQUFnQixHQUFHLE1BQU0sQ0FBQztZQUMxQixDQUFDLDhCQUFzQixFQUFFLGlDQUF5QixFQUFFLE1BQU0sRUFBRSxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFDekUsUUFBUTtnQkFDVixXQUFXLENBQUMsUUFBUSxDQUFDLEdBQUc7b0JBQ3RCLElBQU0sSUFBSSxHQUFHLGtCQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLFFBQVEsS0FBSyw4QkFBc0IsSUFBSSxRQUFRLEtBQUssaUNBQXlCLEVBQUU7d0JBQ2pGLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQzt3QkFDeEQsSUFBSSxTQUFTLEVBQUU7NEJBQ2IsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEdBQUcsU0FBUyxDQUFDLENBQUM7NEJBQ2xFLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7eUJBQ3REO3FCQUNGO29CQUNELE9BQU8sTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBQzlDLENBQUMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLCtCQUErQjtZQUMvQixXQUFXLEdBQUcsTUFBTSxDQUFDO1NBQ3RCO1FBRUQseUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUN4RixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRixJQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0MsS0FBSyxJQUFNLElBQUksSUFBSSxFQUFFLEVBQUU7UUFDckIsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQztBQUNILENBQUM7QUFoREQsc0JBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge3BhdGNoRXZlbnRUYXJnZXR9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHtBRERfRVZFTlRfTElTVEVORVJfU1RSLCBBcnJheVNsaWNlLCBPYmplY3RDcmVhdGUsIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciwgcGF0Y2hPblByb3BlcnRpZXMsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFJ9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cbi8vIHdlIGhhdmUgdG8gcGF0Y2ggdGhlIGluc3RhbmNlIHNpbmNlIHRoZSBwcm90byBpcyBub24tY29uZmlndXJhYmxlXG5leHBvcnQgZnVuY3Rpb24gYXBwbHkoYXBpOiBfWm9uZVByaXZhdGUsIF9nbG9iYWw6IGFueSkge1xuICBjb25zdCBXUyA9ICg8YW55Pl9nbG9iYWwpLldlYlNvY2tldDtcbiAgLy8gT24gU2FmYXJpIHdpbmRvdy5FdmVudFRhcmdldCBkb2Vzbid0IGV4aXN0IHNvIG5lZWQgdG8gcGF0Y2ggV1MgYWRkL3JlbW92ZUV2ZW50TGlzdGVuZXJcbiAgLy8gT24gb2xkZXIgQ2hyb21lLCBubyBuZWVkIHNpbmNlIEV2ZW50VGFyZ2V0IHdhcyBhbHJlYWR5IHBhdGNoZWRcbiAgaWYgKCEoPGFueT5fZ2xvYmFsKS5FdmVudFRhcmdldCkge1xuICAgIHBhdGNoRXZlbnRUYXJnZXQoX2dsb2JhbCwgW1dTLnByb3RvdHlwZV0pO1xuICB9XG4gICg8YW55Pl9nbG9iYWwpLldlYlNvY2tldCA9IGZ1bmN0aW9uKHg6IGFueSwgeTogYW55KSB7XG4gICAgY29uc3Qgc29ja2V0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBuZXcgV1MoeCwgeSkgOiBuZXcgV1MoeCk7XG4gICAgbGV0IHByb3h5U29ja2V0OiBhbnk7XG5cbiAgICBsZXQgcHJveHlTb2NrZXRQcm90bzogYW55O1xuXG4gICAgLy8gU2FmYXJpIDcuMCBoYXMgbm9uLWNvbmZpZ3VyYWJsZSBvd24gJ29ubWVzc2FnZScgYW5kIGZyaWVuZHMgcHJvcGVydGllcyBvbiB0aGUgc29ja2V0IGluc3RhbmNlXG4gICAgY29uc3Qgb25tZXNzYWdlRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb2NrZXQsICdvbm1lc3NhZ2UnKTtcbiAgICBpZiAob25tZXNzYWdlRGVzYyAmJiBvbm1lc3NhZ2VEZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgIHByb3h5U29ja2V0ID0gT2JqZWN0Q3JlYXRlKHNvY2tldCk7XG4gICAgICAvLyBzb2NrZXQgaGF2ZSBvd24gcHJvcGVydHkgZGVzY3JpcHRvciAnb25vcGVuJywgJ29ubWVzc2FnZScsICdvbmNsb3NlJywgJ29uZXJyb3InXG4gICAgICAvLyBidXQgcHJveHlTb2NrZXQgbm90LCBzbyB3ZSB3aWxsIGtlZXAgc29ja2V0IGFzIHByb3RvdHlwZSBhbmQgcGFzcyBpdCB0b1xuICAgICAgLy8gcGF0Y2hPblByb3BlcnRpZXMgbWV0aG9kXG4gICAgICBwcm94eVNvY2tldFByb3RvID0gc29ja2V0O1xuICAgICAgW0FERF9FVkVOVF9MSVNURU5FUl9TVFIsIFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIsICdzZW5kJywgJ2Nsb3NlJ10uZm9yRWFjaChmdW5jdGlvbihcbiAgICAgICAgICBwcm9wTmFtZSkge1xuICAgICAgICBwcm94eVNvY2tldFtwcm9wTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICBjb25zdCBhcmdzID0gQXJyYXlTbGljZS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICAgICAgaWYgKHByb3BOYW1lID09PSBBRERfRVZFTlRfTElTVEVORVJfU1RSIHx8IHByb3BOYW1lID09PSBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSKSB7XG4gICAgICAgICAgICBjb25zdCBldmVudE5hbWUgPSBhcmdzLmxlbmd0aCA+IDAgPyBhcmdzWzBdIDogdW5kZWZpbmVkO1xuICAgICAgICAgICAgaWYgKGV2ZW50TmFtZSkge1xuICAgICAgICAgICAgICBjb25zdCBwcm9wZXJ0eVN5bWJvbCA9IFpvbmUuX19zeW1ib2xfXygnT05fUFJPUEVSVFknICsgZXZlbnROYW1lKTtcbiAgICAgICAgICAgICAgc29ja2V0W3Byb3BlcnR5U3ltYm9sXSA9IHByb3h5U29ja2V0W3Byb3BlcnR5U3ltYm9sXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHNvY2tldFtwcm9wTmFtZV0uYXBwbHkoc29ja2V0LCBhcmdzKTtcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyB3ZSBjYW4gcGF0Y2ggdGhlIHJlYWwgc29ja2V0XG4gICAgICBwcm94eVNvY2tldCA9IHNvY2tldDtcbiAgICB9XG5cbiAgICBwYXRjaE9uUHJvcGVydGllcyhwcm94eVNvY2tldCwgWydjbG9zZScsICdlcnJvcicsICdtZXNzYWdlJywgJ29wZW4nXSwgcHJveHlTb2NrZXRQcm90byk7XG4gICAgcmV0dXJuIHByb3h5U29ja2V0O1xuICB9O1xuXG4gIGNvbnN0IGdsb2JhbFdlYlNvY2tldCA9IF9nbG9iYWxbJ1dlYlNvY2tldCddO1xuICBmb3IgKGNvbnN0IHByb3AgaW4gV1MpIHtcbiAgICBnbG9iYWxXZWJTb2NrZXRbcHJvcF0gPSBXU1twcm9wXTtcbiAgfVxufVxuIl19