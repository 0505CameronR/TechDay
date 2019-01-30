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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWZpbGxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vc3JjL3BvbHlmaWxscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7Ozs7Ozs7Ozs7O0dBY0c7O0FBRUg7O0dBRUc7QUFFSCxtRUFBbUU7QUFDbkUsK0JBQStCO0FBQy9CLCtCQUErQjtBQUMvQixpQ0FBaUM7QUFDakMsa0NBQWtDO0FBQ2xDLG9DQUFvQztBQUNwQywrQkFBK0I7QUFDL0IsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQiw2QkFBNkI7QUFDN0IsOEJBQThCO0FBQzlCLCtCQUErQjtBQUMvQiw0QkFBNEI7QUFDNUIsaUNBQWlDO0FBQ2pDLDRCQUE0QjtBQUU1QiwrRUFBK0U7QUFDL0Usb0VBQW9FO0FBRXBFLGdFQUFnRTtBQUNoRSxnQ0FBZ0M7QUFHaEMseUNBQXlDO0FBQ3pDLGtHQUFrRztBQUNsRywrQkFBNkI7QUFHN0I7Ozs7SUFJSTtBQUNKLDhFQUE4RTtBQUU5RTs7O0dBR0c7QUFFRixzR0FBc0c7QUFDdEcsaUdBQWlHO0FBQ2pHLHNIQUFzSDtBQUV0SDs7O0VBR0U7QUFDSCw0REFBNEQ7QUFFNUQ7O0dBRUc7QUFDSCw2QkFBMkIsQ0FBRSw2QkFBNkI7QUFJMUQ7O0dBRUciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFRoaXMgZmlsZSBpbmNsdWRlcyBwb2x5ZmlsbHMgbmVlZGVkIGJ5IEFuZ3VsYXIgYW5kIGlzIGxvYWRlZCBiZWZvcmUgdGhlIGFwcC5cbiAqIFlvdSBjYW4gYWRkIHlvdXIgb3duIGV4dHJhIHBvbHlmaWxscyB0byB0aGlzIGZpbGUuXG4gKlxuICogVGhpcyBmaWxlIGlzIGRpdmlkZWQgaW50byAyIHNlY3Rpb25zOlxuICogICAxLiBCcm93c2VyIHBvbHlmaWxscy4gVGhlc2UgYXJlIGFwcGxpZWQgYmVmb3JlIGxvYWRpbmcgWm9uZUpTIGFuZCBhcmUgc29ydGVkIGJ5IGJyb3dzZXJzLlxuICogICAyLiBBcHBsaWNhdGlvbiBpbXBvcnRzLiBGaWxlcyBpbXBvcnRlZCBhZnRlciBab25lSlMgdGhhdCBzaG91bGQgYmUgbG9hZGVkIGJlZm9yZSB5b3VyIG1haW5cbiAqICAgICAgZmlsZS5cbiAqXG4gKiBUaGUgY3VycmVudCBzZXR1cCBpcyBmb3Igc28tY2FsbGVkIFwiZXZlcmdyZWVuXCIgYnJvd3NlcnM7IHRoZSBsYXN0IHZlcnNpb25zIG9mIGJyb3dzZXJzIHRoYXRcbiAqIGF1dG9tYXRpY2FsbHkgdXBkYXRlIHRoZW1zZWx2ZXMuIFRoaXMgaW5jbHVkZXMgU2FmYXJpID49IDEwLCBDaHJvbWUgPj0gNTUgKGluY2x1ZGluZyBPcGVyYSksXG4gKiBFZGdlID49IDEzIG9uIHRoZSBkZXNrdG9wLCBhbmQgaU9TIDEwIGFuZCBDaHJvbWUgb24gbW9iaWxlLlxuICpcbiAqIExlYXJuIG1vcmUgaW4gaHR0cHM6Ly9hbmd1bGFyLmlvL2RvY3MvdHMvbGF0ZXN0L2d1aWRlL2Jyb3dzZXItc3VwcG9ydC5odG1sXG4gKi9cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQlJPV1NFUiBQT0xZRklMTFNcbiAqL1xuXG4vKiogSUU5LCBJRTEwIGFuZCBJRTExIHJlcXVpcmVzIGFsbCBvZiB0aGUgZm9sbG93aW5nIHBvbHlmaWxscy4gKiovXG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L3N5bWJvbCc7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L29iamVjdCc7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L2Z1bmN0aW9uJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvcGFyc2UtaW50Jztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvcGFyc2UtZmxvYXQnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9udW1iZXInO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9tYXRoJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvc3RyaW5nJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvZGF0ZSc7XG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L2FycmF5Jztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvcmVnZXhwJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvbWFwJztcbi8vIGltcG9ydCAnY29yZS1qcy9lczYvd2Vhay1tYXAnO1xuLy8gaW1wb3J0ICdjb3JlLWpzL2VzNi9zZXQnO1xuXG4vKiogSUUxMCBhbmQgSUUxMSByZXF1aXJlcyB0aGUgZm9sbG93aW5nIGZvciBOZ0NsYXNzIHN1cHBvcnQgb24gU1ZHIGVsZW1lbnRzICovXG4vLyBpbXBvcnQgJ2NsYXNzbGlzdC5qcyc7ICAvLyBSdW4gYG5wbSBpbnN0YWxsIC0tc2F2ZSBjbGFzc2xpc3QuanNgLlxuXG4vKiogSUUxMCBhbmQgSUUxMSByZXF1aXJlcyB0aGUgZm9sbG93aW5nIGZvciB0aGUgUmVmbGVjdCBBUEkuICovXG4vLyBpbXBvcnQgJ2NvcmUtanMvZXM2L3JlZmxlY3QnO1xuXG5cbi8qKiBFdmVyZ3JlZW4gYnJvd3NlcnMgcmVxdWlyZSB0aGVzZS4gKiovXG4vLyBVc2VkIGZvciByZWZsZWN0LW1ldGFkYXRhIGluIEpJVC4gSWYgeW91IHVzZSBBT1QgKGFuZCBvbmx5IEFuZ3VsYXIgZGVjb3JhdG9ycyksIHlvdSBjYW4gcmVtb3ZlLlxuaW1wb3J0ICdjb3JlLWpzL2VzNy9yZWZsZWN0JztcblxuXG4vKipcbiAqIFdlYiBBbmltYXRpb25zIGBAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnNgXG4gKiBPbmx5IHJlcXVpcmVkIGlmIEFuaW1hdGlvbkJ1aWxkZXIgaXMgdXNlZCB3aXRoaW4gdGhlIGFwcGxpY2F0aW9uIGFuZCB1c2luZyBJRS9FZGdlIG9yIFNhZmFyaS5cbiAqIFN0YW5kYXJkIGFuaW1hdGlvbiBzdXBwb3J0IGluIEFuZ3VsYXIgRE9FUyBOT1QgcmVxdWlyZSBhbnkgcG9seWZpbGxzIChhcyBvZiBBbmd1bGFyIDYuMCkuXG4gKiovXG4vLyBpbXBvcnQgJ3dlYi1hbmltYXRpb25zLWpzJzsgIC8vIFJ1biBgbnBtIGluc3RhbGwgLS1zYXZlIHdlYi1hbmltYXRpb25zLWpzYC5cblxuLyoqXG4gKiBCeSBkZWZhdWx0LCB6b25lLmpzIHdpbGwgcGF0Y2ggYWxsIHBvc3NpYmxlIG1hY3JvVGFzayBhbmQgRG9tRXZlbnRzXG4gKiB1c2VyIGNhbiBkaXNhYmxlIHBhcnRzIG9mIG1hY3JvVGFzay9Eb21FdmVudHMgcGF0Y2ggYnkgc2V0dGluZyBmb2xsb3dpbmcgZmxhZ3NcbiAqL1xuXG4gLy8gKHdpbmRvdyBhcyBhbnkpLl9fWm9uZV9kaXNhYmxlX3JlcXVlc3RBbmltYXRpb25GcmFtZSA9IHRydWU7IC8vIGRpc2FibGUgcGF0Y2ggcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gLy8gKHdpbmRvdyBhcyBhbnkpLl9fWm9uZV9kaXNhYmxlX29uX3Byb3BlcnR5ID0gdHJ1ZTsgLy8gZGlzYWJsZSBwYXRjaCBvblByb3BlcnR5IHN1Y2ggYXMgb25jbGlja1xuIC8vICh3aW5kb3cgYXMgYW55KS5fX3pvbmVfc3ltYm9sX19CTEFDS19MSVNURURfRVZFTlRTID0gWydzY3JvbGwnLCAnbW91c2Vtb3ZlJ107IC8vIGRpc2FibGUgcGF0Y2ggc3BlY2lmaWVkIGV2ZW50TmFtZXNcblxuIC8qXG4gKiBpbiBJRS9FZGdlIGRldmVsb3BlciB0b29scywgdGhlIGFkZEV2ZW50TGlzdGVuZXIgd2lsbCBhbHNvIGJlIHdyYXBwZWQgYnkgem9uZS5qc1xuICogd2l0aCB0aGUgZm9sbG93aW5nIGZsYWcsIGl0IHdpbGwgYnlwYXNzIGB6b25lLmpzYCBwYXRjaCBmb3IgSUUvRWRnZVxuICovXG4vLyAod2luZG93IGFzIGFueSkuX19ab25lX2VuYWJsZV9jcm9zc19jb250ZXh0X2NoZWNrID0gdHJ1ZTtcblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogWm9uZSBKUyBpcyByZXF1aXJlZCBieSBkZWZhdWx0IGZvciBBbmd1bGFyIGl0c2VsZi5cbiAqL1xuaW1wb3J0ICd6b25lLmpzL2Rpc3Qvem9uZSc7ICAvLyBJbmNsdWRlZCB3aXRoIEFuZ3VsYXIgQ0xJLlxuXG5cblxuLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICogQVBQTElDQVRJT04gSU1QT1JUU1xuICovXG4iXX0=