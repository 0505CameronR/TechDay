/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
import * as webSocketPatch from './websocket';
export function propertyDescriptorLegacyPatch(api, _global) {
    const { isNode, isMix } = api.getGlobalObjects();
    if (isNode && !isMix) {
        return;
    }
    const supportsWebSocket = typeof WebSocket !== 'undefined';
    if (!canPatchViaPropertyDescriptor(api)) {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents(api);
        api.patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            webSocketPatch.apply(api, _global);
        }
        Zone[api.symbol('patchEvents')] = true;
    }
}
function canPatchViaPropertyDescriptor(api) {
    const { isBrowser, isMix } = api.getGlobalObjects();
    if ((isBrowser || isMix) &&
        !api.ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        const desc = api.ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    const ON_READY_STATE_CHANGE = 'onreadystatechange';
    const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    const xhrDesc = api.ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        const req = new XMLHttpRequest();
        const result = !!req.onreadystatechange;
        // restore original desc
        api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        const SYMBOL_FAKE_ONREADYSTATECHANGE = api.symbol('fake');
        api.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE] = value;
            }
        });
        const req = new XMLHttpRequest();
        const detectFunc = () => { };
        req.onreadystatechange = detectFunc;
        const result = req[SYMBOL_FAKE_ONREADYSTATECHANGE] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents(api) {
    const { eventNames } = api.getGlobalObjects();
    const unboundKey = api.symbol('unbound');
    for (let i = 0; i < eventNames.length; i++) {
        const property = eventNames[i];
        const onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            let elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = api.wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktZGVzY3JpcHRvci1sZWdhY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9icm93c2VyL3Byb3BlcnR5LWRlc2NyaXB0b3ItbGVnYWN5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNIOzs7R0FHRztBQUVILE9BQU8sS0FBSyxjQUFjLE1BQU0sYUFBYSxDQUFDO0FBRTlDLE1BQU0sVUFBVSw2QkFBNkIsQ0FBQyxHQUFpQixFQUFFLE9BQVk7SUFDM0UsTUFBTSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLEVBQUcsQ0FBQztJQUNoRCxJQUFJLE1BQU0sSUFBSSxDQUFDLEtBQUssRUFBRTtRQUNwQixPQUFPO0tBQ1I7SUFFRCxNQUFNLGlCQUFpQixHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztJQUMzRCxJQUFJLENBQUMsNkJBQTZCLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDdkMsd0NBQXdDO1FBQ3hDLDZCQUE2QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ25DLEdBQUcsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUNqQyxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLGNBQWMsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3BDO1FBQ0EsSUFBWSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7S0FDakQ7QUFDSCxDQUFDO0FBRUQsU0FBUyw2QkFBNkIsQ0FBQyxHQUFpQjtJQUN0RCxNQUFNLEVBQUMsU0FBUyxFQUFFLEtBQUssRUFBQyxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRyxDQUFDO0lBQ25ELElBQUks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QUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVMsS0FBSztZQUM1QyxJQUFJLEdBQUcsR0FBYyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDakQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQzthQUNyRDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQzthQUNsQztZQUNELE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNuRCxLQUFLLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDekQsS0FBSyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDcEMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDekI7Z0JBQ0QsR0FBRyxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUM7YUFDekI7UUFDSCxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7S0FDVjtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7Z2xvYmFsVGhpc31cbiAqL1xuXG5pbXBvcnQgKiBhcyB3ZWJTb2NrZXRQYXRjaCBmcm9tICcuL3dlYnNvY2tldCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eURlc2NyaXB0b3JMZWdhY3lQYXRjaChhcGk6IF9ab25lUHJpdmF0ZSwgX2dsb2JhbDogYW55KSB7XG4gIGNvbnN0IHtpc05vZGUsIGlzTWl4fSA9IGFwaS5nZXRHbG9iYWxPYmplY3RzKCkhO1xuICBpZiAoaXNOb2RlICYmICFpc01peCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN1cHBvcnRzV2ViU29ja2V0ID0gdHlwZW9mIFdlYlNvY2tldCAhPT0gJ3VuZGVmaW5lZCc7XG4gIGlmICghY2FuUGF0Y2hWaWFQcm9wZXJ0eURlc2NyaXB0b3IoYXBpKSkge1xuICAgIC8vIFNhZmFyaSwgQW5kcm9pZCBicm93c2VycyAoSmVsbHkgQmVhbilcbiAgICBwYXRjaFZpYUNhcHR1cmluZ0FsbFRoZUV2ZW50cyhhcGkpO1xuICAgIGFwaS5wYXRjaENsYXNzKCdYTUxIdHRwUmVxdWVzdCcpO1xuICAgIGlmIChzdXBwb3J0c1dlYlNvY2tldCkge1xuICAgICAgd2ViU29ja2V0UGF0Y2guYXBwbHkoYXBpLCBfZ2xvYmFsKTtcbiAgICB9XG4gICAgKFpvbmUgYXMgYW55KVthcGkuc3ltYm9sKCdwYXRjaEV2ZW50cycpXSA9IHRydWU7XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FuUGF0Y2hWaWFQcm9wZXJ0eURlc2NyaXB0b3IoYXBpOiBfWm9uZVByaXZhdGUpIHtcbiAgY29uc3Qge2lzQnJvd3NlciwgaXNNaXh9ID0gYXBpLmdldEdsb2JhbE9iamVjdHMoKSE7XG4gIGlmICgoaXNCcm93c2VyIHx8IGlzTWl4KSAmJlxuICAgICAgIWFwaS5PYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnb25jbGljaycpICYmXG4gICAgICB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBXZWJLaXQgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNDM2NFxuICAgIC8vIElETCBpbnRlcmZhY2UgYXR0cmlidXRlcyBhcmUgbm90IGNvbmZpZ3VyYWJsZVxuICAgIGNvbnN0IGRlc2MgPSBhcGkuT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnQucHJvdG90eXBlLCAnb25jbGljaycpO1xuICAgIGlmIChkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSkgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgT05fUkVBRFlfU1RBVEVfQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gIGNvbnN0IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuXG4gIGNvbnN0IHhockRlc2MgPVxuICAgICAgYXBpLk9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgT05fUkVBRFlfU1RBVEVfQ0hBTkdFKTtcblxuICAvLyBhZGQgZW51bWVyYWJsZSBhbmQgY29uZmlndXJhYmxlIGhlcmUgYmVjYXVzZSBpbiBvcGVyYVxuICAvLyBieSBkZWZhdWx0IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vbnJlYWR5c3RhdGVjaGFuZ2UgaXMgdW5kZWZpbmVkXG4gIC8vIHdpdGhvdXQgYWRkaW5nIGVudW1lcmFibGUgYW5kIGNvbmZpZ3VyYWJsZSB3aWxsIGNhdXNlIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyBub24tY29uZmlndXJhYmxlXG4gIC8vIGFuZCBpZiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub25yZWFkeXN0YXRlY2hhbmdlIGlzIHVuZGVmaW5lZCxcbiAgLy8gd2Ugc2hvdWxkIHNldCBhIHJlYWwgZGVzYyBpbnN0ZWFkIGEgZmFrZSBvbmVcbiAgaWYgKHhockRlc2MpIHtcbiAgICBhcGkuT2JqZWN0RGVmaW5lUHJvcGVydHkoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9ICEhcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAvLyByZXN0b3JlIG9yaWdpbmFsIGRlc2NcbiAgICBhcGkuT2JqZWN0RGVmaW5lUHJvcGVydHkoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSwgeGhyRGVzYyB8fCB7fSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0UgPSBhcGkuc3ltYm9sKCdmYWtlJyk7XG4gICAgYXBpLk9iamVjdERlZmluZVByb3BlcnR5KFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCBPTl9SRUFEWV9TVEFURV9DSEFOR0UsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpc1tTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpc1tTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgY29uc3QgZGV0ZWN0RnVuYyA9ICgpID0+IHt9O1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBkZXRlY3RGdW5jO1xuICAgIGNvbnN0IHJlc3VsdCA9IChyZXEgYXMgYW55KVtTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdID09PSBkZXRlY3RGdW5jO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsIGFzIGFueTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbi8vIFdoZW5ldmVyIGFueSBldmVudExpc3RlbmVyIGZpcmVzLCB3ZSBjaGVjayB0aGUgZXZlbnRMaXN0ZW5lciB0YXJnZXQgYW5kIGFsbCBwYXJlbnRzXG4vLyBmb3IgYG9ud2hhdGV2ZXJgIHByb3BlcnRpZXMgYW5kIHJlcGxhY2UgdGhlbSB3aXRoIHpvbmUtYm91bmQgZnVuY3Rpb25zXG4vLyAtIENocm9tZSAoZm9yIG5vdylcbmZ1bmN0aW9uIHBhdGNoVmlhQ2FwdHVyaW5nQWxsVGhlRXZlbnRzKGFwaTogX1pvbmVQcml2YXRlKSB7XG4gIGNvbnN0IHtldmVudE5hbWVzfSA9IGFwaS5nZXRHbG9iYWxPYmplY3RzKCkhO1xuICBjb25zdCB1bmJvdW5kS2V5ID0gYXBpLnN5bWJvbCgndW5ib3VuZCcpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IGV2ZW50TmFtZXNbaV07XG4gICAgY29uc3Qgb25wcm9wZXJ0eSA9ICdvbicgKyBwcm9wZXJ0eTtcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIocHJvcGVydHksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgZWx0OiBhbnkgPSA8Tm9kZT5ldmVudC50YXJnZXQsIGJvdW5kLCBzb3VyY2U7XG4gICAgICBpZiAoZWx0KSB7XG4gICAgICAgIHNvdXJjZSA9IGVsdC5jb25zdHJ1Y3RvclsnbmFtZSddICsgJy4nICsgb25wcm9wZXJ0eTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZSA9ICd1bmtub3duLicgKyBvbnByb3BlcnR5O1xuICAgICAgfVxuICAgICAgd2hpbGUgKGVsdCkge1xuICAgICAgICBpZiAoZWx0W29ucHJvcGVydHldICYmICFlbHRbb25wcm9wZXJ0eV1bdW5ib3VuZEtleV0pIHtcbiAgICAgICAgICBib3VuZCA9IGFwaS53cmFwV2l0aEN1cnJlbnRab25lKGVsdFtvbnByb3BlcnR5XSwgc291cmNlKTtcbiAgICAgICAgICBib3VuZFt1bmJvdW5kS2V5XSA9IGVsdFtvbnByb3BlcnR5XTtcbiAgICAgICAgICBlbHRbb25wcm9wZXJ0eV0gPSBib3VuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHQgPSBlbHQucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICB9LCB0cnVlKTtcbiAgfVxufVxuIl19