/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@angular/compiler/src/compiler_facade_interface", ["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var R3ResolvedDependencyType;
    (function (R3ResolvedDependencyType) {
        R3ResolvedDependencyType[R3ResolvedDependencyType["Token"] = 0] = "Token";
        R3ResolvedDependencyType[R3ResolvedDependencyType["Attribute"] = 1] = "Attribute";
        R3ResolvedDependencyType[R3ResolvedDependencyType["Injector"] = 2] = "Injector";
    })(R3ResolvedDependencyType = exports.R3ResolvedDependencyType || (exports.R3ResolvedDependencyType = {}));
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvbXBpbGVyL3NyYy9jb21waWxlcl9mYWNhZGVfaW50ZXJmYWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRzs7Ozs7Ozs7Ozs7O0lBaURILElBQVksd0JBSVg7SUFKRCxXQUFZLHdCQUF3QjtRQUNsQyx5RUFBUyxDQUFBO1FBQ1QsaUZBQWEsQ0FBQTtRQUNiLCtFQUFZLENBQUE7SUFDZCxDQUFDLEVBSlcsd0JBQXdCLEdBQXhCLGdDQUF3QixLQUF4QixnQ0FBd0IsUUFJbkMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cblxuLyoqXG4gKiBBIHNldCBvZiBpbnRlcmZhY2VzIHdoaWNoIGFyZSBzaGFyZWQgYmV0d2VlbiBgQGFuZ3VsYXIvY29yZWAgYW5kIGBAYW5ndWxhci9jb21waWxlcmAgdG8gYWxsb3dcbiAqIGZvciBsYXRlIGJpbmRpbmcgb2YgYEBhbmd1bGFyL2NvbXBpbGVyYCBmb3IgSklUIHB1cnBvc2VzLlxuICpcbiAqIFRoaXMgZmlsZSBoYXMgdHdvIGNvcGllcy4gUGxlYXNlIGVuc3VyZSB0aGF0IHRoZXkgYXJlIGluIHN5bmM6XG4gKiAgLSBwYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZS50cyAgICAgICAgICAgICAobWFzdGVyKVxuICogIC0gcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9qaXQvY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZS50cyAgICAgKGNvcHkpXG4gKlxuICogUGxlYXNlIGVuc3VyZSB0aGF0IHRoZSB0d28gZmlsZXMgYXJlIGluIHN5bmMgdXNpbmcgdGhpcyBjb21tYW5kOlxuICogYGBgXG4gKiBjcCBwYWNrYWdlcy9jb21waWxlci9zcmMvY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZS50cyBcXFxuICogICAgcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy9qaXQvY29tcGlsZXJfZmFjYWRlX2ludGVyZmFjZS50c1xuICogYGBgXG4gKi9cblxuZXhwb3J0IGludGVyZmFjZSBFeHBvcnRlZENvbXBpbGVyRmFjYWRlIHsgybVjb21waWxlckZhY2FkZTogQ29tcGlsZXJGYWNhZGU7IH1cblxuZXhwb3J0IGludGVyZmFjZSBDb21waWxlckZhY2FkZSB7XG4gIGNvbXBpbGVQaXBlKGFuZ3VsYXJDb3JlRW52OiBDb3JlRW52aXJvbm1lbnQsIHNvdXJjZU1hcFVybDogc3RyaW5nLCBtZXRhOiBSM1BpcGVNZXRhZGF0YUZhY2FkZSk6XG4gICAgICBhbnk7XG4gIGNvbXBpbGVJbmplY3RhYmxlKFxuICAgICAgYW5ndWxhckNvcmVFbnY6IENvcmVFbnZpcm9ubWVudCwgc291cmNlTWFwVXJsOiBzdHJpbmcsIG1ldGE6IFIzSW5qZWN0YWJsZU1ldGFkYXRhRmFjYWRlKTogYW55O1xuICBjb21waWxlSW5qZWN0b3IoXG4gICAgICBhbmd1bGFyQ29yZUVudjogQ29yZUVudmlyb25tZW50LCBzb3VyY2VNYXBVcmw6IHN0cmluZywgbWV0YTogUjNJbmplY3Rvck1ldGFkYXRhRmFjYWRlKTogYW55O1xuICBjb21waWxlTmdNb2R1bGUoXG4gICAgICBhbmd1bGFyQ29yZUVudjogQ29yZUVudmlyb25tZW50LCBzb3VyY2VNYXBVcmw6IHN0cmluZywgbWV0YTogUjNOZ01vZHVsZU1ldGFkYXRhRmFjYWRlKTogYW55O1xuICBjb21waWxlRGlyZWN0aXZlKFxuICAgICAgYW5ndWxhckNvcmVFbnY6IENvcmVFbnZpcm9ubWVudCwgc291cmNlTWFwVXJsOiBzdHJpbmcsIG1ldGE6IFIzRGlyZWN0aXZlTWV0YWRhdGFGYWNhZGUpOiBhbnk7XG4gIGNvbXBpbGVDb21wb25lbnQoXG4gICAgICBhbmd1bGFyQ29yZUVudjogQ29yZUVudmlyb25tZW50LCBzb3VyY2VNYXBVcmw6IHN0cmluZywgbWV0YTogUjNDb21wb25lbnRNZXRhZGF0YUZhY2FkZSk6IGFueTtcblxuICBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU6IHR5cGVvZiBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29yZUVudmlyb25tZW50IHsgW25hbWU6IHN0cmluZ106IEZ1bmN0aW9uOyB9XG5cbmV4cG9ydCB0eXBlIFN0cmluZ01hcCA9IHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nO1xufTtcblxuZXhwb3J0IHR5cGUgU3RyaW5nTWFwV2l0aFJlbmFtZSA9IHtcbiAgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgW3N0cmluZywgc3RyaW5nXTtcbn07XG5cbmV4cG9ydCB0eXBlIFByb3ZpZGVyID0gYW55O1xuXG5leHBvcnQgZW51bSBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGUge1xuICBUb2tlbiA9IDAsXG4gIEF0dHJpYnV0ZSA9IDEsXG4gIEluamVjdG9yID0gMixcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZSB7XG4gIHRva2VuOiBhbnk7XG4gIHJlc29sdmVkOiBSM1Jlc29sdmVkRGVwZW5kZW5jeVR5cGU7XG4gIGhvc3Q6IGJvb2xlYW47XG4gIG9wdGlvbmFsOiBib29sZWFuO1xuICBzZWxmOiBib29sZWFuO1xuICBza2lwU2VsZjogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM1BpcGVNZXRhZGF0YUZhY2FkZSB7XG4gIG5hbWU6IHN0cmluZztcbiAgdHlwZTogYW55O1xuICBwaXBlTmFtZTogc3RyaW5nO1xuICBkZXBzOiBSM0RlcGVuZGVuY3lNZXRhZGF0YUZhY2FkZVtdfG51bGw7XG4gIHB1cmU6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNJbmplY3RhYmxlTWV0YWRhdGFGYWNhZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IGFueTtcbiAgY3RvckRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlW118bnVsbDtcbiAgcHJvdmlkZWRJbjogYW55O1xuICB1c2VDbGFzcz86IGFueTtcbiAgdXNlRmFjdG9yeT86IGFueTtcbiAgdXNlRXhpc3Rpbmc/OiBhbnk7XG4gIHVzZVZhbHVlPzogYW55O1xuICB1c2VyRGVwcz86IFIzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlW107XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgUjNOZ01vZHVsZU1ldGFkYXRhRmFjYWRlIHtcbiAgdHlwZTogYW55O1xuICBib290c3RyYXA6IEZ1bmN0aW9uW107XG4gIGRlY2xhcmF0aW9uczogRnVuY3Rpb25bXTtcbiAgaW1wb3J0czogRnVuY3Rpb25bXTtcbiAgZXhwb3J0czogRnVuY3Rpb25bXTtcbiAgZW1pdElubGluZTogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSM0luamVjdG9yTWV0YWRhdGFGYWNhZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IGFueTtcbiAgZGVwczogUjNEZXBlbmRlbmN5TWV0YWRhdGFGYWNhZGVbXXxudWxsO1xuICBwcm92aWRlcnM6IGFueTtcbiAgaW1wb3J0czogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzRGlyZWN0aXZlTWV0YWRhdGFGYWNhZGUge1xuICBuYW1lOiBzdHJpbmc7XG4gIHR5cGU6IGFueTtcbiAgdHlwZUFyZ3VtZW50Q291bnQ6IG51bWJlcjtcbiAgdHlwZVNvdXJjZVNwYW46IG51bGw7XG4gIGRlcHM6IFIzRGVwZW5kZW5jeU1ldGFkYXRhRmFjYWRlW118bnVsbDtcbiAgc2VsZWN0b3I6IHN0cmluZ3xudWxsO1xuICBxdWVyaWVzOiBSM1F1ZXJ5TWV0YWRhdGFGYWNhZGVbXTtcbiAgaG9zdDoge1trZXk6IHN0cmluZ106IHN0cmluZ307XG4gIHByb3BNZXRhZGF0YToge1trZXk6IHN0cmluZ106IGFueVtdfTtcbiAgbGlmZWN5Y2xlOiB7dXNlc09uQ2hhbmdlczogYm9vbGVhbjt9O1xuICBpbnB1dHM6IHN0cmluZ1tdO1xuICBvdXRwdXRzOiBzdHJpbmdbXTtcbiAgdXNlc0luaGVyaXRhbmNlOiBib29sZWFuO1xuICBleHBvcnRBczogc3RyaW5nfG51bGw7XG4gIHByb3ZpZGVyczogUHJvdmlkZXJbXXxudWxsO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFIzQ29tcG9uZW50TWV0YWRhdGFGYWNhZGUgZXh0ZW5kcyBSM0RpcmVjdGl2ZU1ldGFkYXRhRmFjYWRlIHtcbiAgdGVtcGxhdGU6IHN0cmluZztcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogYm9vbGVhbjtcbiAgYW5pbWF0aW9uczogYW55W118dW5kZWZpbmVkO1xuICB2aWV3UXVlcmllczogUjNRdWVyeU1ldGFkYXRhRmFjYWRlW107XG4gIHBpcGVzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBkaXJlY3RpdmVzOiBNYXA8c3RyaW5nLCBhbnk+O1xuICBzdHlsZXM6IHN0cmluZ1tdO1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbjtcbiAgdmlld1Byb3ZpZGVyczogUHJvdmlkZXJbXXxudWxsO1xufVxuXG5leHBvcnQgdHlwZSBWaWV3RW5jYXBzdWxhdGlvbiA9IG51bWJlcjtcblxuZXhwb3J0IGludGVyZmFjZSBSM1F1ZXJ5TWV0YWRhdGFGYWNhZGUge1xuICBwcm9wZXJ0eU5hbWU6IHN0cmluZztcbiAgZmlyc3Q6IGJvb2xlYW47XG4gIHByZWRpY2F0ZTogYW55fHN0cmluZ1tdO1xuICBkZXNjZW5kYW50czogYm9vbGVhbjtcbiAgcmVhZDogYW55fG51bGw7XG59XG4iXX0=