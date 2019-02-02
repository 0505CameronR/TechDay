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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWpheC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL29ic2VydmFibGUvZG9tL2FqYXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtREFBd0U7QUFDeEU7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDVSxRQUFBLElBQUksR0FBdUIsK0JBQWMsQ0FBQyxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyAgQWpheE9ic2VydmFibGUsIEFqYXhDcmVhdGlvbk1ldGhvZCAgfSBmcm9tICcuL0FqYXhPYnNlcnZhYmxlJztcbi8qKlxuICogVGhlcmUgaXMgYW4gYWpheCBvcGVyYXRvciBvbiB0aGUgUnggb2JqZWN0LlxuICpcbiAqIEl0IGNyZWF0ZXMgYW4gb2JzZXJ2YWJsZSBmb3IgYW4gQWpheCByZXF1ZXN0IHdpdGggZWl0aGVyIGEgcmVxdWVzdCBvYmplY3Qgd2l0aFxuICogdXJsLCBoZWFkZXJzLCBldGMgb3IgYSBzdHJpbmcgZm9yIGEgVVJMLlxuICpcbiAqICMjIFVzaW5nIGFqYXguZ2V0SlNPTigpIHRvIGZldGNoIGRhdGEgZnJvbSBBUEkuXG4gKiBgYGBqYXZhc2NyaXB0XG4gKiBpbXBvcnQgeyBhamF4IH0gZnJvbSAncnhqcy9hamF4JztcbiAqIGltcG9ydCB7IG1hcCwgY2F0Y2hFcnJvciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqXG4gKiBjb25zdCBvYnMkID0gYWpheC5nZXRKU09OKGBodHRwczovL2FwaS5naXRodWIuY29tL3VzZXJzP3Blcl9wYWdlPTVgKS5waXBlKFxuICogICBtYXAodXNlclJlc3BvbnNlID0+IGNvbnNvbGUubG9nKCd1c2VyczogJywgdXNlclJlc3BvbnNlKSksXG4gKiAgIGNhdGNoRXJyb3IoZXJyb3IgPT4gY29uc29sZS5sb2coJ2Vycm9yOiAnLCBlcnJvcikpXG4gKiApKTtcbiAqIGBgYFxuICovXG5leHBvcnQgY29uc3QgYWpheDogQWpheENyZWF0aW9uTWV0aG9kID0gQWpheE9ic2VydmFibGUuY3JlYXRlOyJdfQ==