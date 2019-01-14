"use strict";
/**
 * This file includes polyfills needed by Angular and is loaded before the app.
 * You can add your own extra polyfills to this file.
 *
 * This file is divided into 2 sections:
 *   1. Browser polyfills. These are applied before loading ZoneJS and are sorted by browsers.
 *   2. Application imports. Files imported after ZoneJS that should be loaded before your main
 *      file.
 *
 * The current setup is for so-called "evergreen" browsers; the last versions of browsers that
 * automatically update themselves. This includes Safari >= 10, Chrome >= 55 (including Opera),
 * Edge >= 13 on the desktop, and iOS 10 and Chrome on mobile.
 *
 * Learn more in https://angular.io/docs/ts/latest/guide/browser-support.html
 */
Object.defineProperty(exports, "__esModule", { value: true });
/***************************************************************************************************
 * BROWSER POLYFILLS
 */
/** IE9, IE10 and IE11 requires all of the following polyfills. **/
// import 'core-js/es6/symbol';
// import 'core-js/es6/object';
// import 'core-js/es6/function';
// import 'core-js/es6/parse-int';
// import 'core-js/es6/parse-float';
// import 'core-js/es6/number';
// import 'core-js/es6/math';
// import 'core-js/es6/string';
// import 'core-js/es6/date';
// import 'core-js/es6/array';
// import 'core-js/es6/regexp';
// import 'core-js/es6/map';
// import 'core-js/es6/weak-map';
// import 'core-js/es6/set';
/** IE10 and IE11 requires the following for NgClass support on SVG elements */
// import 'classlist.js';  // Run `npm install --save classlist.js`.
/** IE10 and IE11 requires the following for the Reflect API. */
// import 'core-js/es6/reflect';
/** Evergreen browsers require these. **/
// Used for reflect-metadata in JIT. If you use AOT (and only Angular decorators), you can remove.
require("core-js/es7/reflect");
/**
 * Web Animations `@angular/platform-browser/animations`
 * Only required if AnimationBuilder is used within the application and using IE/Edge or Safari.
 * Standard animation support in Angular DOES NOT require any polyfills (as of Angular 6.0).
 **/
// import 'web-animations-js';  // Run `npm install --save web-animations-js`.
/**
 * By default, zone.js will patch all possible macroTask and DomEvents
 * user can disable parts of macroTask/DomEvents patch by setting following flags
 */
// (window as any).__Zone_disable_requestAnimationFrame = true; // disable patch requestAnimationFrame
// (window as any).__Zone_disable_on_property = true; // disable patch onProperty such as onclick
// (window as any).__zone_symbol__BLACK_LISTED_EVENTS = ['scroll', 'mousemove']; // disable patch specified eventNames
/*
* in IE/Edge developer tools, the addEventListener will also be wrapped by zone.js
* with the following flag, it will bypass `zone.js` patch for IE/Edge
*/
// (window as any).__Zone_enable_cross_context_check = true;
/***************************************************************************************************
 * Zone JS is required by default for Angular itself.
 */
require("zone.js/dist/zone"); // Included with Angular CLI.
/***************************************************************************************************
 * APPLICATION IMPORTS
 */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWZpbGxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZEFwcC9hcHAvcG9seWZpbGxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7Ozs7Ozs7Ozs7R0FjRzs7QUFFSDs7R0FFRztBQUVILG1FQUFtRTtBQUNuRSwrQkFBK0I7QUFDL0IsK0JBQStCO0FBQy9CLGlDQUFpQztBQUNqQyxrQ0FBa0M7QUFDbEMsb0NBQW9DO0FBQ3BDLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0IsK0JBQStCO0FBQy9CLDZCQUE2QjtBQUM3Qiw4QkFBOEI7QUFDOUIsK0JBQStCO0FBQy9CLDRCQUE0QjtBQUM1QixpQ0FBaUM7QUFDakMsNEJBQTRCO0FBRTVCLCtFQUErRTtBQUMvRSxvRUFBb0U7QUFFcEUsZ0VBQWdFO0FBQ2hFLGdDQUFnQztBQUdoQyx5Q0FBeUM7QUFDekMsa0dBQWtHO0FBQ2xHLCtCQUE2QjtBQUc3Qjs7OztJQUlJO0FBQ0osOEVBQThFO0FBRTlFOzs7R0FHRztBQUVGLHNHQUFzRztBQUN0RyxpR0FBaUc7QUFDakcsc0hBQXNIO0FBRXRIOzs7RUFHRTtBQUNILDREQUE0RDtBQUU1RDs7R0FFRztBQUNILDZCQUEyQixDQUFFLDZCQUE2QjtBQUkxRDs7R0FFRyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVGhpcyBmaWxlIGluY2x1ZGVzIHBvbHlmaWxscyBuZWVkZWQgYnkgQW5ndWxhciBhbmQgaXMgbG9hZGVkIGJlZm9yZSB0aGUgYXBwLlxuICogWW91IGNhbiBhZGQgeW91ciBvd24gZXh0cmEgcG9seWZpbGxzIHRvIHRoaXMgZmlsZS5cbiAqXG4gKiBUaGlzIGZpbGUgaXMgZGl2aWRlZCBpbnRvIDIgc2VjdGlvbnM6XG4gKiAgIDEuIEJyb3dzZXIgcG9seWZpbGxzLiBUaGVzZSBhcmUgYXBwbGllZCBiZWZvcmUgbG9hZGluZyBab25lSlMgYW5kIGFyZSBzb3J0ZWQgYnkgYnJvd3NlcnMuXG4gKiAgIDIuIEFwcGxpY2F0aW9uIGltcG9ydHMuIEZpbGVzIGltcG9ydGVkIGFmdGVyIFpvbmVKUyB0aGF0IHNob3VsZCBiZSBsb2FkZWQgYmVmb3JlIHlvdXIgbWFpblxuICogICAgICBmaWxlLlxuICpcbiAqIFRoZSBjdXJyZW50IHNldHVwIGlzIGZvciBzby1jYWxsZWQgXCJldmVyZ3JlZW5cIiBicm93c2VyczsgdGhlIGxhc3QgdmVyc2lvbnMgb2YgYnJvd3NlcnMgdGhhdFxuICogYXV0b21hdGljYWxseSB1cGRhdGUgdGhlbXNlbHZlcy4gVGhpcyBpbmNsdWRlcyBTYWZhcmkgPj0gMTAsIENocm9tZSA+PSA1NSAoaW5jbHVkaW5nIE9wZXJhKSxcbiAqIEVkZ2UgPj0gMTMgb24gdGhlIGRlc2t0b3AsIGFuZCBpT1MgMTAgYW5kIENocm9tZSBvbiBtb2JpbGUuXG4gKlxuICogTGVhcm4gbW9yZSBpbiBodHRwczovL2FuZ3VsYXIuaW8vZG9jcy90cy9sYXRlc3QvZ3VpZGUvYnJvd3Nlci1zdXBwb3J0Lmh0bWxcbiAqL1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBCUk9XU0VSIFBPTFlGSUxMU1xuICovXG5cbi8qKiBJRTksIElFMTAgYW5kIElFMTEgcmVxdWlyZXMgYWxsIG9mIHRoZSBmb2xsb3dpbmcgcG9seWZpbGxzLiAqKi9cbi8vIGltcG9ydCAnY29yZS1qcy9lczYvc3ltYm9sJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvb2JqZWN0Jztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvZnVuY3Rpb24nO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9wYXJzZS1pbnQnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9wYXJzZS1mbG9hdCc7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L251bWJlcic7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L21hdGgnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9zdHJpbmcnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9kYXRlJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvYXJyYXknO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9yZWdleHAnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9tYXAnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi93ZWFrLW1hcCc7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L3NldCc7XG5cbi8qKiBJRTEwIGFuZCBJRTExIHJlcXVpcmVzIHRoZSBmb2xsb3dpbmcgZm9yIE5nQ2xhc3Mgc3VwcG9ydCBvbiBTVkcgZWxlbWVudHMgKi9cbi8vIGltcG9ydCAnY2xhc3NsaXN0LmpzJzsgIC8vIFJ1biBgbnBtIGluc3RhbGwgLS1zYXZlIGNsYXNzbGlzdC5qc2AuXG5cbi8qKiBJRTEwIGFuZCBJRTExIHJlcXVpcmVzIHRoZSBmb2xsb3dpbmcgZm9yIHRoZSBSZWZsZWN0IEFQSS4gKi9cbi8vIGltcG9ydCAnY29yZS1qcy9lczYvcmVmbGVjdCc7XG5cblxuLyoqIEV2ZXJncmVlbiBicm93c2VycyByZXF1aXJlIHRoZXNlLiAqKi9cbi8vIFVzZWQgZm9yIHJlZmxlY3QtbWV0YWRhdGEgaW4gSklULiBJZiB5b3UgdXNlIEFPVCAoYW5kIG9ubHkgQW5ndWxhciBkZWNvcmF0b3JzKSwgeW91IGNhbiByZW1vdmUuXG5pbXBvcnQgJ2NvcmUtanMvZXM3L3JlZmxlY3QnO1xuXG5cbi8qKlxuICogV2ViIEFuaW1hdGlvbnMgYEBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvYW5pbWF0aW9uc2BcbiAqIE9ubHkgcmVxdWlyZWQgaWYgQW5pbWF0aW9uQnVpbGRlciBpcyB1c2VkIHdpdGhpbiB0aGUgYXBwbGljYXRpb24gYW5kIHVzaW5nIElFL0VkZ2Ugb3IgU2FmYXJpLlxuICogU3RhbmRhcmQgYW5pbWF0aW9uIHN1cHBvcnQgaW4gQW5ndWxhciBET0VTIE5PVCByZXF1aXJlIGFueSBwb2x5ZmlsbHMgKGFzIG9mIEFuZ3VsYXIgNi4wKS5cbiAqKi9cbi8vIGltcG9ydCAnd2ViLWFuaW1hdGlvbnMtanMnOyAgLy8gUnVuIGBucG0gaW5zdGFsbCAtLXNhdmUgd2ViLWFuaW1hdGlvbnMtanNgLlxuXG4vKipcbiAqIEJ5IGRlZmF1bHQsIHpvbmUuanMgd2lsbCBwYXRjaCBhbGwgcG9zc2libGUgbWFjcm9UYXNrIGFuZCBEb21FdmVudHNcbiAqIHVzZXIgY2FuIGRpc2FibGUgcGFydHMgb2YgbWFjcm9UYXNrL0RvbUV2ZW50cyBwYXRjaCBieSBzZXR0aW5nIGZvbGxvd2luZyBmbGFnc1xuICovXG5cbiAvLyAod2luZG93IGFzIGFueSkuX19ab25lX2Rpc2FibGVfcmVxdWVzdEFuaW1hdGlvbkZyYW1lID0gdHJ1ZTsgLy8gZGlzYWJsZSBwYXRjaCByZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAvLyAod2luZG93IGFzIGFueSkuX19ab25lX2Rpc2FibGVfb25fcHJvcGVydHkgPSB0cnVlOyAvLyBkaXNhYmxlIHBhdGNoIG9uUHJvcGVydHkgc3VjaCBhcyBvbmNsaWNrXG4gLy8gKHdpbmRvdyBhcyBhbnkpLl9fem9uZV9zeW1ib2xfX0JMQUNLX0xJU1RFRF9FVkVOVFMgPSBbJ3Njcm9sbCcsICdtb3VzZW1vdmUnXTsgLy8gZGlzYWJsZSBwYXRjaCBzcGVjaWZpZWQgZXZlbnROYW1lc1xuXG4gLypcbiAqIGluIElFL0VkZ2UgZGV2ZWxvcGVyIHRvb2xzLCB0aGUgYWRkRXZlbnRMaXN0ZW5lciB3aWxsIGFsc28gYmUgd3JhcHBlZCBieSB6b25lLmpzXG4gKiB3aXRoIHRoZSBmb2xsb3dpbmcgZmxhZywgaXQgd2lsbCBieXBhc3MgYHpvbmUuanNgIHBhdGNoIGZvciBJRS9FZGdlXG4gKi9cbi8vICh3aW5kb3cgYXMgYW55KS5fX1pvbmVfZW5hYmxlX2Nyb3NzX2NvbnRleHRfY2hlY2sgPSB0cnVlO1xuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBab25lIEpTIGlzIHJlcXVpcmVkIGJ5IGRlZmF1bHQgZm9yIEFuZ3VsYXIgaXRzZWxmLlxuICovXG5pbXBvcnQgJ3pvbmUuanMvZGlzdC96b25lJzsgIC8vIEluY2x1ZGVkIHdpdGggQW5ndWxhciBDTEkuXG5cblxuXG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gKiBBUFBMSUNBVElPTiBJTVBPUlRTXG4gKi9cbiJdfQ==