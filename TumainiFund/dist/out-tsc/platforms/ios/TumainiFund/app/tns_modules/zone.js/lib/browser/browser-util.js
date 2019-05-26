/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export function patchCallbacks(api, target, targetName, method, callbacks) {
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
                    const descriptor = api.ObjectGetOwnPropertyDescriptor(prototype, callback);
                    if (descriptor && descriptor.value) {
                        descriptor.value = api.wrapWithCurrentZone(descriptor.value, source);
                        api._redefineProperty(opts.prototype, callback, descriptor);
                    }
                    else if (prototype[callback]) {
                        prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
                    }
                }
                else if (prototype[callback]) {
                    prototype[callback] = api.wrapWithCurrentZone(prototype[callback], source);
                }
            });
        }
        return nativeDelegate.call(target, name, opts, options);
    };
    api.attachOriginToPatched(target[method], nativeDelegate);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci11dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9icm93c2VyLXV0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsTUFBTSxVQUFVLGNBQWMsQ0FDMUIsR0FBaUIsRUFBRSxNQUFXLEVBQUUsVUFBa0IsRUFBRSxNQUFjLEVBQUUsU0FBbUI7SUFDekYsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN2QyxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRTtRQUNsQixPQUFPO0tBQ1I7SUFDRCxNQUFNLGNBQWMsR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ3ZELE1BQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxVQUFTLElBQVMsRUFBRSxJQUFTLEVBQUUsT0FBYTtRQUMzRCxJQUFJLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQzFCLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBUyxRQUFRO2dCQUNqQyxNQUFNLE1BQU0sR0FBRyxHQUFHLFVBQVUsSUFBSSxNQUFNLElBQUksR0FBRyxRQUFRLENBQUM7Z0JBQ3RELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pDLElBQUksU0FBUyxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtvQkFDdEMsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLDhCQUE4QixDQUFDLFNBQVMsRUFBRSxRQUFRLENBQUMsQ0FBQztvQkFDM0UsSUFBSSxVQUFVLElBQUksVUFBVSxDQUFDLEtBQUssRUFBRTt3QkFDbEMsVUFBVSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsbUJBQW1CLENBQUMsVUFBVSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQzt3QkFDckUsR0FBRyxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsUUFBUSxFQUFFLFVBQVUsQ0FBQyxDQUFDO3FCQUM3RDt5QkFBTSxJQUFJLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRTt3QkFDOUIsU0FBUyxDQUFDLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7cUJBQzVFO2lCQUNGO3FCQUFNLElBQUksU0FBUyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUM5QixTQUFTLENBQUMsUUFBUSxDQUFDLEdBQUcsR0FBRyxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQztpQkFDNUU7WUFDSCxDQUFDLENBQUMsQ0FBQztTQUNKO1FBRUQsT0FBTyxjQUFjLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzFELENBQUMsQ0FBQztJQUVGLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsY0FBYyxDQUFDLENBQUM7QUFDNUQsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaENhbGxiYWNrcyhcbiAgICBhcGk6IF9ab25lUHJpdmF0ZSwgdGFyZ2V0OiBhbnksIHRhcmdldE5hbWU6IHN0cmluZywgbWV0aG9kOiBzdHJpbmcsIGNhbGxiYWNrczogc3RyaW5nW10pIHtcbiAgY29uc3Qgc3ltYm9sID0gWm9uZS5fX3N5bWJvbF9fKG1ldGhvZCk7XG4gIGlmICh0YXJnZXRbc3ltYm9sXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBuYXRpdmVEZWxlZ2F0ZSA9IHRhcmdldFtzeW1ib2xdID0gdGFyZ2V0W21ldGhvZF07XG4gIHRhcmdldFttZXRob2RdID0gZnVuY3Rpb24obmFtZTogYW55LCBvcHRzOiBhbnksIG9wdGlvbnM/OiBhbnkpIHtcbiAgICBpZiAob3B0cyAmJiBvcHRzLnByb3RvdHlwZSkge1xuICAgICAgY2FsbGJhY2tzLmZvckVhY2goZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3Qgc291cmNlID0gYCR7dGFyZ2V0TmFtZX0uJHttZXRob2R9OjpgICsgY2FsbGJhY2s7XG4gICAgICAgIGNvbnN0IHByb3RvdHlwZSA9IG9wdHMucHJvdG90eXBlO1xuICAgICAgICBpZiAocHJvdG90eXBlLmhhc093blByb3BlcnR5KGNhbGxiYWNrKSkge1xuICAgICAgICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBhcGkuT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvdHlwZSwgY2FsbGJhY2spO1xuICAgICAgICAgIGlmIChkZXNjcmlwdG9yICYmIGRlc2NyaXB0b3IudmFsdWUpIHtcbiAgICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShkZXNjcmlwdG9yLnZhbHVlLCBzb3VyY2UpO1xuICAgICAgICAgICAgYXBpLl9yZWRlZmluZVByb3BlcnR5KG9wdHMucHJvdG90eXBlLCBjYWxsYmFjaywgZGVzY3JpcHRvcik7XG4gICAgICAgICAgfSBlbHNlIGlmIChwcm90b3R5cGVbY2FsbGJhY2tdKSB7XG4gICAgICAgICAgICBwcm90b3R5cGVbY2FsbGJhY2tdID0gYXBpLndyYXBXaXRoQ3VycmVudFpvbmUocHJvdG90eXBlW2NhbGxiYWNrXSwgc291cmNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAocHJvdG90eXBlW2NhbGxiYWNrXSkge1xuICAgICAgICAgIHByb3RvdHlwZVtjYWxsYmFja10gPSBhcGkud3JhcFdpdGhDdXJyZW50Wm9uZShwcm90b3R5cGVbY2FsbGJhY2tdLCBzb3VyY2UpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gbmF0aXZlRGVsZWdhdGUuY2FsbCh0YXJnZXQsIG5hbWUsIG9wdHMsIG9wdGlvbnMpO1xuICB9O1xuXG4gIGFwaS5hdHRhY2hPcmlnaW5Ub1BhdGNoZWQodGFyZ2V0W21ldGhvZF0sIG5hdGl2ZURlbGVnYXRlKTtcbn1cbiJdfQ==