/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { bindArguments, patchMethod, patchOnProperties, setShouldCopySymbolProperties } from '../common/utils';
Zone.__load_patch('node_util', (global, Zone, api) => {
    api.patchOnProperties = patchOnProperties;
    api.patchMethod = patchMethod;
    api.bindArguments = bindArguments;
    setShouldCopySymbolProperties(true);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZV91dGlsLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvbm9kZS9ub2RlX3V0aWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUUsaUJBQWlCLEVBQUUsNkJBQTZCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU3RyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxDQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUIsRUFBRSxFQUFFO0lBQ2hGLEdBQUcsQ0FBQyxpQkFBaUIsR0FBRyxpQkFBaUIsQ0FBQztJQUMxQyxHQUFHLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUM5QixHQUFHLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQztJQUNsQyw2QkFBNkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0IHtiaW5kQXJndW1lbnRzLCBwYXRjaE1ldGhvZCwgcGF0Y2hPblByb3BlcnRpZXMsIHNldFNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5ab25lLl9fbG9hZF9wYXRjaCgnbm9kZV91dGlsJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgYXBpLnBhdGNoT25Qcm9wZXJ0aWVzID0gcGF0Y2hPblByb3BlcnRpZXM7XG4gIGFwaS5wYXRjaE1ldGhvZCA9IHBhdGNoTWV0aG9kO1xuICBhcGkuYmluZEFyZ3VtZW50cyA9IGJpbmRBcmd1bWVudHM7XG4gIHNldFNob3VsZENvcHlTeW1ib2xQcm9wZXJ0aWVzKHRydWUpO1xufSk7XG4iXX0=