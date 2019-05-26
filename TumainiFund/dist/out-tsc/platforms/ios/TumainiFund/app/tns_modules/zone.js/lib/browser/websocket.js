/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
// we have to patch the instance since the proto is non-configurable
export function apply(api, _global) {
    const { ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR } = api.getGlobalObjects();
    const WS = _global.WebSocket;
    // On Safari window.EventTarget doesn't exist so need to patch WS add/removeEventListener
    // On older Chrome, no need since EventTarget was already patched
    if (!_global.EventTarget) {
        api.patchEventTarget(_global, [WS.prototype]);
    }
    _global.WebSocket = function (x, y) {
        const socket = arguments.length > 1 ? new WS(x, y) : new WS(x);
        let proxySocket;
        let proxySocketProto;
        // Safari 7.0 has non-configurable own 'onmessage' and friends properties on the socket instance
        const onmessageDesc = api.ObjectGetOwnPropertyDescriptor(socket, 'onmessage');
        if (onmessageDesc && onmessageDesc.configurable === false) {
            proxySocket = api.ObjectCreate(socket);
            // socket have own property descriptor 'onopen', 'onmessage', 'onclose', 'onerror'
            // but proxySocket not, so we will keep socket as prototype and pass it to
            // patchOnProperties method
            proxySocketProto = socket;
            [ADD_EVENT_LISTENER_STR, REMOVE_EVENT_LISTENER_STR, 'send', 'close'].forEach(function (propName) {
                proxySocket[propName] = function () {
                    const args = api.ArraySlice.call(arguments);
                    if (propName === ADD_EVENT_LISTENER_STR || propName === REMOVE_EVENT_LISTENER_STR) {
                        const eventName = args.length > 0 ? args[0] : undefined;
                        if (eventName) {
                            const propertySymbol = Zone.__symbol__('ON_PROPERTY' + eventName);
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
        api.patchOnProperties(proxySocket, ['close', 'error', 'message', 'open'], proxySocketProto);
        return proxySocket;
    };
    const globalWebSocket = _global['WebSocket'];
    for (const prop in WS) {
        globalWebSocket[prop] = WS[prop];
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2Vic29ja2V0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci93ZWJzb2NrZXQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsb0VBQW9FO0FBQ3BFLE1BQU0sVUFBVSxLQUFLLENBQUMsR0FBaUIsRUFBRSxPQUFZO0lBQ25ELE1BQU0sRUFBQyxzQkFBc0IsRUFBRSx5QkFBeUIsRUFBQyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDO0lBQ3BGLE1BQU0sRUFBRSxHQUFTLE9BQVEsQ0FBQyxTQUFTLENBQUM7SUFDcEMseUZBQXlGO0lBQ3pGLGlFQUFpRTtJQUNqRSxJQUFJLENBQU8sT0FBUSxDQUFDLFdBQVcsRUFBRTtRQUMvQixHQUFHLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDL0M7SUFDSyxPQUFRLENBQUMsU0FBUyxHQUFHLFVBQVMsQ0FBTSxFQUFFLENBQU07UUFDaEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0QsSUFBSSxXQUFnQixDQUFDO1FBRXJCLElBQUksZ0JBQXFCLENBQUM7UUFFMUIsZ0dBQWdHO1FBQ2hHLE1BQU0sYUFBYSxHQUFHLEdBQUcsQ0FBQyw4QkFBOEIsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDOUUsSUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLFlBQVksS0FBSyxLQUFLLEVBQUU7WUFDekQsV0FBVyxHQUFHLEdBQUcsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDdkMsa0ZBQWtGO1lBQ2xGLDBFQUEwRTtZQUMxRSwyQkFBMkI7WUFDM0IsZ0JBQWdCLEdBQUcsTUFBTSxDQUFDO1lBQzFCLENBQUMsc0JBQXNCLEVBQUUseUJBQXlCLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUN6RSxRQUFRO2dCQUNWLFdBQVcsQ0FBQyxRQUFRLENBQUMsR0FBRztvQkFDdEIsTUFBTSxJQUFJLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQzVDLElBQUksUUFBUSxLQUFLLHNCQUFzQixJQUFJLFFBQVEsS0FBSyx5QkFBeUIsRUFBRTt3QkFDakYsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDO3dCQUN4RCxJQUFJLFNBQVMsRUFBRTs0QkFDYixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUMsQ0FBQzs0QkFDbEUsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxjQUFjLENBQUMsQ0FBQzt5QkFDdEQ7cUJBQ0Y7b0JBQ0QsT0FBTyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztnQkFDOUMsQ0FBQyxDQUFDO1lBQ0osQ0FBQyxDQUFDLENBQUM7U0FDSjthQUFNO1lBQ0wsK0JBQStCO1lBQy9CLFdBQVcsR0FBRyxNQUFNLENBQUM7U0FDdEI7UUFFRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM1RixPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDLENBQUM7SUFFRixNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7SUFDN0MsS0FBSyxNQUFNLElBQUksSUFBSSxFQUFFLEVBQUU7UUFDckIsZUFBZSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQztBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8vIHdlIGhhdmUgdG8gcGF0Y2ggdGhlIGluc3RhbmNlIHNpbmNlIHRoZSBwcm90byBpcyBub24tY29uZmlndXJhYmxlXG5leHBvcnQgZnVuY3Rpb24gYXBwbHkoYXBpOiBfWm9uZVByaXZhdGUsIF9nbG9iYWw6IGFueSkge1xuICBjb25zdCB7QUREX0VWRU5UX0xJU1RFTkVSX1NUUiwgUkVNT1ZFX0VWRU5UX0xJU1RFTkVSX1NUUn0gPSBhcGkuZ2V0R2xvYmFsT2JqZWN0cygpITtcbiAgY29uc3QgV1MgPSAoPGFueT5fZ2xvYmFsKS5XZWJTb2NrZXQ7XG4gIC8vIE9uIFNhZmFyaSB3aW5kb3cuRXZlbnRUYXJnZXQgZG9lc24ndCBleGlzdCBzbyBuZWVkIHRvIHBhdGNoIFdTIGFkZC9yZW1vdmVFdmVudExpc3RlbmVyXG4gIC8vIE9uIG9sZGVyIENocm9tZSwgbm8gbmVlZCBzaW5jZSBFdmVudFRhcmdldCB3YXMgYWxyZWFkeSBwYXRjaGVkXG4gIGlmICghKDxhbnk+X2dsb2JhbCkuRXZlbnRUYXJnZXQpIHtcbiAgICBhcGkucGF0Y2hFdmVudFRhcmdldChfZ2xvYmFsLCBbV1MucHJvdG90eXBlXSk7XG4gIH1cbiAgKDxhbnk+X2dsb2JhbCkuV2ViU29ja2V0ID0gZnVuY3Rpb24oeDogYW55LCB5OiBhbnkpIHtcbiAgICBjb25zdCBzb2NrZXQgPSBhcmd1bWVudHMubGVuZ3RoID4gMSA/IG5ldyBXUyh4LCB5KSA6IG5ldyBXUyh4KTtcbiAgICBsZXQgcHJveHlTb2NrZXQ6IGFueTtcblxuICAgIGxldCBwcm94eVNvY2tldFByb3RvOiBhbnk7XG5cbiAgICAvLyBTYWZhcmkgNy4wIGhhcyBub24tY29uZmlndXJhYmxlIG93biAnb25tZXNzYWdlJyBhbmQgZnJpZW5kcyBwcm9wZXJ0aWVzIG9uIHRoZSBzb2NrZXQgaW5zdGFuY2VcbiAgICBjb25zdCBvbm1lc3NhZ2VEZXNjID0gYXBpLk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb2NrZXQsICdvbm1lc3NhZ2UnKTtcbiAgICBpZiAob25tZXNzYWdlRGVzYyAmJiBvbm1lc3NhZ2VEZXNjLmNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgIHByb3h5U29ja2V0ID0gYXBpLk9iamVjdENyZWF0ZShzb2NrZXQpO1xuICAgICAgLy8gc29ja2V0IGhhdmUgb3duIHByb3BlcnR5IGRlc2NyaXB0b3IgJ29ub3BlbicsICdvbm1lc3NhZ2UnLCAnb25jbG9zZScsICdvbmVycm9yJ1xuICAgICAgLy8gYnV0IHByb3h5U29ja2V0IG5vdCwgc28gd2Ugd2lsbCBrZWVwIHNvY2tldCBhcyBwcm90b3R5cGUgYW5kIHBhc3MgaXQgdG9cbiAgICAgIC8vIHBhdGNoT25Qcm9wZXJ0aWVzIG1ldGhvZFxuICAgICAgcHJveHlTb2NrZXRQcm90byA9IHNvY2tldDtcbiAgICAgIFtBRERfRVZFTlRfTElTVEVORVJfU1RSLCBSRU1PVkVfRVZFTlRfTElTVEVORVJfU1RSLCAnc2VuZCcsICdjbG9zZSddLmZvckVhY2goZnVuY3Rpb24oXG4gICAgICAgICAgcHJvcE5hbWUpIHtcbiAgICAgICAgcHJveHlTb2NrZXRbcHJvcE5hbWVdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY29uc3QgYXJncyA9IGFwaS5BcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICBpZiAocHJvcE5hbWUgPT09IEFERF9FVkVOVF9MSVNURU5FUl9TVFIgfHwgcHJvcE5hbWUgPT09IFJFTU9WRV9FVkVOVF9MSVNURU5FUl9TVFIpIHtcbiAgICAgICAgICAgIGNvbnN0IGV2ZW50TmFtZSA9IGFyZ3MubGVuZ3RoID4gMCA/IGFyZ3NbMF0gOiB1bmRlZmluZWQ7XG4gICAgICAgICAgICBpZiAoZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAgIGNvbnN0IHByb3BlcnR5U3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKCdPTl9QUk9QRVJUWScgKyBldmVudE5hbWUpO1xuICAgICAgICAgICAgICBzb2NrZXRbcHJvcGVydHlTeW1ib2xdID0gcHJveHlTb2NrZXRbcHJvcGVydHlTeW1ib2xdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gc29ja2V0W3Byb3BOYW1lXS5hcHBseShzb2NrZXQsIGFyZ3MpO1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIHdlIGNhbiBwYXRjaCB0aGUgcmVhbCBzb2NrZXRcbiAgICAgIHByb3h5U29ja2V0ID0gc29ja2V0O1xuICAgIH1cblxuICAgIGFwaS5wYXRjaE9uUHJvcGVydGllcyhwcm94eVNvY2tldCwgWydjbG9zZScsICdlcnJvcicsICdtZXNzYWdlJywgJ29wZW4nXSwgcHJveHlTb2NrZXRQcm90byk7XG4gICAgcmV0dXJuIHByb3h5U29ja2V0O1xuICB9O1xuXG4gIGNvbnN0IGdsb2JhbFdlYlNvY2tldCA9IF9nbG9iYWxbJ1dlYlNvY2tldCddO1xuICBmb3IgKGNvbnN0IHByb3AgaW4gV1MpIHtcbiAgICBnbG9iYWxXZWJTb2NrZXRbcHJvcF0gPSBXU1twcm9wXTtcbiAgfVxufVxuIl19