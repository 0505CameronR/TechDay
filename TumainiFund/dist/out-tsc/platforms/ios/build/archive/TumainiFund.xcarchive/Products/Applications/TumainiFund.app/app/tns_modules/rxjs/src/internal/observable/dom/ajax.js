"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AjaxObservable_1 = require("./AjaxObservable");
/**
 * There is an ajax operator on the Rx object.
 *
 * It creates an observable for an Ajax request with either a request object with
 * url, headers, etc or a string for a URL.
 *
 * ## Using ajax.getJSON() to fetch data from API.
 * ```javascript
 * import { ajax } from 'rxjs/ajax';
 * import { map, catchError } from 'rxjs/operators';
 *
 * const obs$ = ajax.getJSON(`https://api.github.com/users?per_page=5`).pipe(
 *   map(userResponse => console.log('users: ', userResponse)),
 *   catchError(error => console.log('error: ', error))
 * ));
 * ```
 */
exports.ajax = AjaxObservable_1.AjaxObservable.create;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvb2JzZXJ2YWJsZS9kb20vYWpheC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1EQUF3RTtBQUN4RTs7Ozs7Ozs7Ozs7Ozs7OztHQWdCRztBQUNVLFFBQUEsSUFBSSxHQUF1QiwrQkFBYyxDQUFDLE1BQU0sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ICBBamF4T2JzZXJ2YWJsZSwgQWpheENyZWF0aW9uTWV0aG9kICB9IGZyb20gJy4vQWpheE9ic2VydmFibGUnO1xuLyoqXG4gKiBUaGVyZSBpcyBhbiBhamF4IG9wZXJhdG9yIG9uIHRoZSBSeCBvYmplY3QuXG4gKlxuICogSXQgY3JlYXRlcyBhbiBvYnNlcnZhYmxlIGZvciBhbiBBamF4IHJlcXVlc3Qgd2l0aCBlaXRoZXIgYSByZXF1ZXN0IG9iamVjdCB3aXRoXG4gKiB1cmwsIGhlYWRlcnMsIGV0YyBvciBhIHN0cmluZyBmb3IgYSBVUkwuXG4gKlxuICogIyMgVXNpbmcgYWpheC5nZXRKU09OKCkgdG8gZmV0Y2ggZGF0YSBmcm9tIEFQSS5cbiAqIGBgYGphdmFzY3JpcHRcbiAqIGltcG9ydCB7IGFqYXggfSBmcm9tICdyeGpzL2FqYXgnO1xuICogaW1wb3J0IHsgbWFwLCBjYXRjaEVycm9yIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuICpcbiAqIGNvbnN0IG9icyQgPSBhamF4LmdldEpTT04oYGh0dHBzOi8vYXBpLmdpdGh1Yi5jb20vdXNlcnM/cGVyX3BhZ2U9NWApLnBpcGUoXG4gKiAgIG1hcCh1c2VyUmVzcG9uc2UgPT4gY29uc29sZS5sb2coJ3VzZXJzOiAnLCB1c2VyUmVzcG9uc2UpKSxcbiAqICAgY2F0Y2hFcnJvcihlcnJvciA9PiBjb25zb2xlLmxvZygnZXJyb3I6ICcsIGVycm9yKSlcbiAqICkpO1xuICogYGBgXG4gKi9cbmV4cG9ydCBjb25zdCBhamF4OiBBamF4Q3JlYXRpb25NZXRob2QgPSBBamF4T2JzZXJ2YWJsZS5jcmVhdGU7Il19