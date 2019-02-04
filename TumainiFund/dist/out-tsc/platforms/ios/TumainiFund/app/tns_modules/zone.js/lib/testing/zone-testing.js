"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
// load test related files into bundle in correct order
require("../zone-spec/long-stack-trace");
require("../zone-spec/proxy");
require("../zone-spec/sync-test");
require("../jasmine/jasmine");
require("./async-testing");
require("./fake-async");
require("./promise-testing");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9uZS10ZXN0aW5nLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvdGVzdGluZy96b25lLXRlc3RpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7Ozs7R0FNRzs7QUFFSCx1REFBdUQ7QUFDdkQseUNBQXVDO0FBQ3ZDLDhCQUE0QjtBQUM1QixrQ0FBZ0M7QUFDaEMsOEJBQTRCO0FBQzVCLDJCQUF5QjtBQUN6Qix3QkFBc0I7QUFDdEIsNkJBQTJCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG4vLyBsb2FkIHRlc3QgcmVsYXRlZCBmaWxlcyBpbnRvIGJ1bmRsZSBpbiBjb3JyZWN0IG9yZGVyXG5pbXBvcnQgJy4uL3pvbmUtc3BlYy9sb25nLXN0YWNrLXRyYWNlJztcbmltcG9ydCAnLi4vem9uZS1zcGVjL3Byb3h5JztcbmltcG9ydCAnLi4vem9uZS1zcGVjL3N5bmMtdGVzdCc7XG5pbXBvcnQgJy4uL2phc21pbmUvamFzbWluZSc7XG5pbXBvcnQgJy4vYXN5bmMtdGVzdGluZyc7XG5pbXBvcnQgJy4vZmFrZS1hc3luYyc7XG5pbXBvcnQgJy4vcHJvbWlzZS10ZXN0aW5nJzsiXX0=