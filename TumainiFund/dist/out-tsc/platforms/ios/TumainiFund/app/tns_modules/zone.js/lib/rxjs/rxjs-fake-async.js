"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
Zone.__load_patch('rxjs.Scheduler.now', function (global, Zone, api) {
    api.patchMethod(rxjs_1.Scheduler, 'now', function (delegate) { return function (self, args) {
        return Date.now.apply(self, args);
    }; });
    api.patchMethod(rxjs_1.asyncScheduler, 'now', function (delegate) { return function (self, args) {
        return Date.now.apply(self, args);
    }; });
    api.patchMethod(rxjs_1.asapScheduler, 'now', function (delegate) { return function (self, args) {
        return Date.now.apply(self, args);
    }; });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicnhqcy1mYWtlLWFzeW5jLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvcnhqcy9yeGpzLWZha2UtYXN5bmMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCw2QkFBOEQ7QUFFOUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxvQkFBb0IsRUFBRSxVQUFDLE1BQVcsRUFBRSxJQUFjLEVBQUUsR0FBaUI7SUFDckYsR0FBRyxDQUFDLFdBQVcsQ0FBQyxnQkFBUyxFQUFFLEtBQUssRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1FBQy9FLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUMsRUFGeUQsQ0FFekQsQ0FBQyxDQUFDO0lBQ0gsR0FBRyxDQUFDLFdBQVcsQ0FBQyxxQkFBYyxFQUFFLEtBQUssRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1FBQ3BGLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUMsRUFGOEQsQ0FFOUQsQ0FBQyxDQUFDO0lBQ0gsR0FBRyxDQUFDLFdBQVcsQ0FBQyxvQkFBYSxFQUFFLEtBQUssRUFBRSxVQUFDLFFBQWtCLElBQUssT0FBQSxVQUFDLElBQVMsRUFBRSxJQUFXO1FBQ25GLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ3BDLENBQUMsRUFGNkQsQ0FFN0QsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7YXNhcFNjaGVkdWxlciwgYXN5bmNTY2hlZHVsZXIsIFNjaGVkdWxlcn0gZnJvbSAncnhqcyc7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdyeGpzLlNjaGVkdWxlci5ub3cnLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBhcGkucGF0Y2hNZXRob2QoU2NoZWR1bGVyLCAnbm93JywgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3cuYXBwbHkoc2VsZiwgYXJncyk7XG4gIH0pO1xuICBhcGkucGF0Y2hNZXRob2QoYXN5bmNTY2hlZHVsZXIsICdub3cnLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgIHJldHVybiBEYXRlLm5vdy5hcHBseShzZWxmLCBhcmdzKTtcbiAgfSk7XG4gIGFwaS5wYXRjaE1ldGhvZChhc2FwU2NoZWR1bGVyLCAnbm93JywgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICByZXR1cm4gRGF0ZS5ub3cuYXBwbHkoc2VsZiwgYXJncyk7XG4gIH0pO1xufSk7XG4iXX0=