/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { attachOriginToPatched, isBrowser, isMix, ObjectGetOwnPropertyDescriptor, wrapWithCurrentZone } from '../common/utils';
import { _redefineProperty } from './define-property';
function patchCallbacks(target, targetName, method, callbacks) {
    const symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    const nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                const source = `${targetName}.${method}::` + callback;
                const prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    const descriptor = ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = wrapWithCurrentZone(descriptor.value, source);
                        _redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    attachOriginToPatched(target[method], nativeDelegate);
}
export function registerElementPatch(_global) {
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    const callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
export function patchCustomElements(_global) {
    if ((!isBrowser && !isMix) || !('customElements' in _global)) {
        return;
    }
    const callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXItZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvcmVnaXN0ZXItZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMscUJBQXFCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSw4QkFBOEIsRUFBRSxtQkFBbUIsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRTdILE9BQU8sRUFBQyxpQkFBaUIsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBRXBELFNBQVMsY0FBYyxDQUFDLE1BQVcsRUFBRSxVQUFrQixFQUFFLE1BQWMsRUFBRSxTQUFtQjtJQUMxRixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZDLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ2xCLE9BQU87S0FDUjtJQUNELE1BQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkQsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLFVBQVMsSUFBUyxFQUFFLElBQVMsRUFBRSxPQUFhO1FBQzNELElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUU7WUFDMUIsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFTLFFBQVE7Z0JBQ2pDLE1BQU0sTUFBTSxHQUFHLEdBQUcsVUFBVSxJQUFJLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQztnQkFDdEQsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakMsSUFBSSxTQUFTLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUN0QyxNQUFNLFVBQVUsR0FBRyw4QkFBOEIsQ0FBQyxTQUFTLEVBQUUsUUFBUSxDQUFDLENBQUM7b0JBQ3ZFLElBQUksVUFBVSxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUU7d0JBQ2xDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDakUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQ3pEO3lCQUFNO3dCQUNMLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7cUJBQ3hFO2lCQUNGO3FCQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM5QixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUN4RTtZQUNILENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDMUQsQ0FBQyxDQUFDO0lBRUYscUJBQXFCLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxFQUFFLGNBQWMsQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRCxNQUFNLFVBQVUsb0JBQW9CLENBQUMsT0FBWTtJQUMvQyxJQUFJLENBQUMsQ0FBQyxTQUFTLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsaUJBQWlCLElBQVUsT0FBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQzdFLE9BQU87S0FDUjtJQUVELE1BQU0sU0FBUyxHQUNYLENBQUMsaUJBQWlCLEVBQUUsa0JBQWtCLEVBQUUsa0JBQWtCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUU1RixjQUFjLENBQUMsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUNyRSxDQUFDO0FBRUQsTUFBTSxVQUFVLG1CQUFtQixDQUFDLE9BQVk7SUFDOUMsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGdCQUFnQixJQUFJLE9BQU8sQ0FBQyxFQUFFO1FBQzVELE9BQU87S0FDUjtJQUVELE1BQU0sU0FBUyxHQUNYLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLEVBQUUsaUJBQWlCLEVBQUUsMEJBQTBCLENBQUMsQ0FBQztJQUVqRyxjQUFjLENBQUMsT0FBTyxDQUFDLGNBQWMsRUFBRSxnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFDaEYsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthdHRhY2hPcmlnaW5Ub1BhdGNoZWQsIGlzQnJvd3NlciwgaXNNaXgsIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciwgd3JhcFdpdGhDdXJyZW50Wm9uZX0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcblxuaW1wb3J0IHtfcmVkZWZpbmVQcm9wZXJ0eX0gZnJvbSAnLi9kZWZpbmUtcHJvcGVydHknO1xuXG5mdW5jdGlvbiBwYXRjaENhbGxiYWNrcyh0YXJnZXQ6IGFueSwgdGFyZ2V0TmFtZTogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgY2FsbGJhY2tzOiBzdHJpbmdbXSkge1xuICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX18obWV0aG9kKTtcbiAgaWYgKHRhcmdldFtzeW1ib2xdKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IG5hdGl2ZURlbGVnYXRlID0gdGFyZ2V0W3N5bWJvbF0gPSB0YXJnZXRbbWV0aG9kXTtcbiAgdGFyZ2V0W21ldGhvZF0gPSBmdW5jdGlvbihuYW1lOiBhbnksIG9wdHM6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIGlmIChvcHRzICYmIG9wdHMucHJvdG90eXBlKSB7XG4gICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBgJHt0YXJnZXROYW1lfS4ke21ldGhvZH06OmAgKyBjYWxsYmFjaztcbiAgICAgICAgY29uc3QgcHJvdG90eXBlID0gb3B0cy5wcm90b3R5cGU7XG4gICAgICAgIGlmIChwcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2FsbGJhY2spKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gd3JhcFdpdGhDdXJyZW50Wm9uZShkZXNjcmlwdG9yLnZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgX3JlZGVmaW5lUHJvcGVydHkob3B0cy5wcm90b3R5cGUsIGNhbGxiYWNrLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSB3cmFwV2l0aEN1cnJlbnRab25lKHByb3RvdHlwZVtjYWxsYmFja10sIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuYXRpdmVEZWxlZ2F0ZS5jYWxsKHRhcmdldCwgbmFtZSwgb3B0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRhcmdldFttZXRob2RdLCBuYXRpdmVEZWxlZ2F0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckVsZW1lbnRQYXRjaChfZ2xvYmFsOiBhbnkpIHtcbiAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgISgncmVnaXN0ZXJFbGVtZW50JyBpbiAoPGFueT5fZ2xvYmFsKS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjYWxsYmFja3MgPVxuICAgICAgWydjcmVhdGVkQ2FsbGJhY2snLCAnYXR0YWNoZWRDYWxsYmFjaycsICdkZXRhY2hlZENhbGxiYWNrJywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayddO1xuXG4gIHBhdGNoQ2FsbGJhY2tzKGRvY3VtZW50LCAnRG9jdW1lbnQnLCAncmVnaXN0ZXJFbGVtZW50JywgY2FsbGJhY2tzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoQ3VzdG9tRWxlbWVudHMoX2dsb2JhbDogYW55KSB7XG4gIGlmICgoIWlzQnJvd3NlciAmJiAhaXNNaXgpIHx8ICEoJ2N1c3RvbUVsZW1lbnRzJyBpbiBfZ2xvYmFsKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNhbGxiYWNrcyA9XG4gICAgICBbJ2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Fkb3B0ZWRDYWxsYmFjaycsICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snXTtcblxuICBwYXRjaENhbGxiYWNrcyhfZ2xvYmFsLmN1c3RvbUVsZW1lbnRzLCAnY3VzdG9tRWxlbWVudHMnLCAnZGVmaW5lJywgY2FsbGJhY2tzKTtcbn1cbiJdfQ==