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
var define_property_1 = require("./define-property");
function patchCallbacks(target, targetName, method, callbacks) {
    var symbol = Zone.__symbol__(method);
    if (target[symbol]) {
        return;
    }
    var nativeDelegate = target[symbol] = target[method];
    target[method] = function (name, opts, options) {
        if (opts && opts.prototype) {
            callbacks.forEach(function (callback) {
                var source = targetName + "." + method + "::" + callback;
                var prototype = opts.prototype;
                if (prototype.hasOwnProperty(callback)) {
                    var descriptor = utils_1.ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = utils_1.wrapWithCurrentZone(descriptor.value, source);
                        define_property_1._redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else {
                        prototype[callback] = utils_1.wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = utils_1.wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    utils_1.attachOriginToPatched(target[method], nativeDelegate);
}
function registerElementPatch(_global) {
    if ((!utils_1.isBrowser && !utils_1.isMix) || !('registerElement' in _global.document)) {
        return;
    }
    var callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    patchCallbacks(document, 'Document', 'registerElement', callbacks);
}
exports.registerElementPatch = registerElementPatch;
function patchCustomElements(_global) {
    if ((!utils_1.isBrowser && !utils_1.isMix) || !('customElements' in _global)) {
        return;
    }
    var callbacks = ['connectedCallback', 'disconnectedCallback', 'adoptedCallback', 'attributeChangedCallback'];
    patchCallbacks(_global.customElements, 'customElements', 'define', callbacks);
}
exports.patchCustomElements = patchCustomElements;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXItZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9yZWdpc3Rlci1lbGVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgseUNBQTZIO0FBRTdILHFEQUFvRDtBQUVwRCxTQUFTLGNBQWMsQ0FBQyxNQUFXLEVBQUUsVUFBa0IsRUFBRSxNQUFjLEVBQUUsU0FBbUI7SUFDMUYsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNsQixPQUFPO0tBQ1I7SUFDRCxJQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFTLElBQVMsRUFBRSxJQUFTLEVBQUUsT0FBYTtRQUMzRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRO2dCQUNqQyxJQUFNLE1BQU0sR0FBTSxVQUFVLFNBQUksTUFBTSxPQUFJLEdBQUcsUUFBUSxDQUFDO2dCQUN0RCxJQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQyxJQUFJLFNBQVMsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQ3RDLElBQU0sVUFBVSxHQUFHLHNDQUE4QixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDdkUsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTt3QkFDbEMsVUFBVSxDQUFDLEtBQUssR0FBRywyQkFBbUIsQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLE1BQU0sQ0FBQyxDQUFDO3dCQUNqRSxtQ0FBaUIsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztxQkFDekQ7eUJBQU07d0JBQ0wsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLDJCQUFtQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztxQkFDeEU7aUJBQ0Y7cUJBQU0sSUFBSSxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUU7b0JBQzlCLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRywyQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ3hFO1lBQ0gsQ0FBQyxDQUFDLENBQUM7U0FDSjtRQUVELE9BQU8sY0FBYyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDLENBQUM7SUFFRiw2QkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDeEQsQ0FBQztBQUVELFNBQWdCLG9CQUFvQixDQUFDLE9BQVk7SUFDL0MsSUFBSSxDQUFDLENBQUMsaUJBQVMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxpQkFBaUIsSUFBVSxPQUFRLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDN0UsT0FBTztLQUNSO0lBRUQsSUFBTSxTQUFTLEdBQ1gsQ0FBQyxpQkFBaUIsRUFBRSxrQkFBa0IsRUFBRSxrQkFBa0IsRUFBRSwwQkFBMEIsQ0FBQyxDQUFDO0lBRTVGLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBVSxFQUFFLGlCQUFpQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ3JFLENBQUM7QUFURCxvREFTQztBQUVELFNBQWdCLG1CQUFtQixDQUFDLE9BQVk7SUFDOUMsSUFBSSxDQUFDLENBQUMsaUJBQVMsSUFBSSxDQUFDLGFBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxnQkFBZ0IsSUFBSSxPQUFPLENBQUMsRUFBRTtRQUM1RCxPQUFPO0tBQ1I7SUFFRCxJQUFNLFNBQVMsR0FDWCxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixFQUFFLGlCQUFpQixFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFFakcsY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsZ0JBQWdCLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2hGLENBQUM7QUFURCxrREFTQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHthdHRhY2hPcmlnaW5Ub1BhdGNoZWQsIGlzQnJvd3NlciwgaXNNaXgsIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciwgd3JhcFdpdGhDdXJyZW50Wm9uZX0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcblxuaW1wb3J0IHtfcmVkZWZpbmVQcm9wZXJ0eX0gZnJvbSAnLi9kZWZpbmUtcHJvcGVydHknO1xuXG5mdW5jdGlvbiBwYXRjaENhbGxiYWNrcyh0YXJnZXQ6IGFueSwgdGFyZ2V0TmFtZTogc3RyaW5nLCBtZXRob2Q6IHN0cmluZywgY2FsbGJhY2tzOiBzdHJpbmdbXSkge1xuICBjb25zdCBzeW1ib2wgPSBab25lLl9fc3ltYm9sX18obWV0aG9kKTtcbiAgaWYgKHRhcmdldFtzeW1ib2xdKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IG5hdGl2ZURlbGVnYXRlID0gdGFyZ2V0W3N5bWJvbF0gPSB0YXJnZXRbbWV0aG9kXTtcbiAgdGFyZ2V0W21ldGhvZF0gPSBmdW5jdGlvbihuYW1lOiBhbnksIG9wdHM6IGFueSwgb3B0aW9ucz86IGFueSkge1xuICAgIGlmIChvcHRzICYmIG9wdHMucHJvdG90eXBlKSB7XG4gICAgICBjYWxsYmFja3MuZm9yRWFjaChmdW5jdGlvbihjYWxsYmFjaykge1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBgJHt0YXJnZXROYW1lfS4ke21ldGhvZH06OmAgKyBjYWxsYmFjaztcbiAgICAgICAgY29uc3QgcHJvdG90eXBlID0gb3B0cy5wcm90b3R5cGU7XG4gICAgICAgIGlmIChwcm90b3R5cGUuaGFzT3duUHJvcGVydHkoY2FsbGJhY2spKSB7XG4gICAgICAgICAgY29uc3QgZGVzY3JpcHRvciA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90b3R5cGUsIGNhbGxiYWNrKTtcbiAgICAgICAgICBpZiAoZGVzY3JpcHRvciAmJiBkZXNjcmlwdG9yLnZhbHVlKSB7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gd3JhcFdpdGhDdXJyZW50Wm9uZShkZXNjcmlwdG9yLnZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgX3JlZGVmaW5lUHJvcGVydHkob3B0cy5wcm90b3R5cGUsIGNhbGxiYWNrLCBkZXNjcmlwdG9yKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJvdG90eXBlW2NhbGxiYWNrXSA9IHdyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSB3cmFwV2l0aEN1cnJlbnRab25lKHByb3RvdHlwZVtjYWxsYmFja10sIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiBuYXRpdmVEZWxlZ2F0ZS5jYWxsKHRhcmdldCwgbmFtZSwgb3B0cywgb3B0aW9ucyk7XG4gIH07XG5cbiAgYXR0YWNoT3JpZ2luVG9QYXRjaGVkKHRhcmdldFttZXRob2RdLCBuYXRpdmVEZWxlZ2F0ZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckVsZW1lbnRQYXRjaChfZ2xvYmFsOiBhbnkpIHtcbiAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgISgncmVnaXN0ZXJFbGVtZW50JyBpbiAoPGFueT5fZ2xvYmFsKS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjYWxsYmFja3MgPVxuICAgICAgWydjcmVhdGVkQ2FsbGJhY2snLCAnYXR0YWNoZWRDYWxsYmFjaycsICdkZXRhY2hlZENhbGxiYWNrJywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayddO1xuXG4gIHBhdGNoQ2FsbGJhY2tzKGRvY3VtZW50LCAnRG9jdW1lbnQnLCAncmVnaXN0ZXJFbGVtZW50JywgY2FsbGJhY2tzKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoQ3VzdG9tRWxlbWVudHMoX2dsb2JhbDogYW55KSB7XG4gIGlmICgoIWlzQnJvd3NlciAmJiAhaXNNaXgpIHx8ICEoJ2N1c3RvbUVsZW1lbnRzJyBpbiBfZ2xvYmFsKSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNhbGxiYWNrcyA9XG4gICAgICBbJ2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Rpc2Nvbm5lY3RlZENhbGxiYWNrJywgJ2Fkb3B0ZWRDYWxsYmFjaycsICdhdHRyaWJ1dGVDaGFuZ2VkQ2FsbGJhY2snXTtcblxuICBwYXRjaENhbGxiYWNrcyhfZ2xvYmFsLmN1c3RvbUVsZW1lbnRzLCAnY3VzdG9tRWxlbWVudHMnLCAnZGVmaW5lJywgY2FsbGJhY2tzKTtcbn1cbiJdfQ==