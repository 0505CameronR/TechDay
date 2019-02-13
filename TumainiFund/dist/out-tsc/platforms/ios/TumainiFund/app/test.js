// This file is required by karma.conf.js and loads recursively all the .spec and framework files
import 'zone.js/dist/zone-testing';
import { getTestBed } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';
// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsaUdBQWlHO0FBRWpHLE9BQU8sMkJBQTJCLENBQUM7QUFDbkMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ25ELE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsNkJBQTZCLEVBQzlCLE1BQU0sMkNBQTJDLENBQUM7QUFJbkQscURBQXFEO0FBQ3JELFVBQVUsRUFBRSxDQUFDLG1CQUFtQixDQUM5QiwyQkFBMkIsRUFDM0IsNkJBQTZCLEVBQUUsQ0FDaEMsQ0FBQztBQUNGLDhCQUE4QjtBQUM5QixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsYUFBYSxDQUFDLENBQUM7QUFDM0Qsd0JBQXdCO0FBQ3hCLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBUaGlzIGZpbGUgaXMgcmVxdWlyZWQgYnkga2FybWEuY29uZi5qcyBhbmQgbG9hZHMgcmVjdXJzaXZlbHkgYWxsIHRoZSAuc3BlYyBhbmQgZnJhbWV3b3JrIGZpbGVzXG5cbmltcG9ydCAnem9uZS5qcy9kaXN0L3pvbmUtdGVzdGluZyc7XG5pbXBvcnQgeyBnZXRUZXN0QmVkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZS90ZXN0aW5nJztcbmltcG9ydCB7XG4gIEJyb3dzZXJEeW5hbWljVGVzdGluZ01vZHVsZSxcbiAgcGxhdGZvcm1Ccm93c2VyRHluYW1pY1Rlc3Rpbmdcbn0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci1keW5hbWljL3Rlc3RpbmcnO1xuXG5kZWNsYXJlIGNvbnN0IHJlcXVpcmU6IGFueTtcblxuLy8gRmlyc3QsIGluaXRpYWxpemUgdGhlIEFuZ3VsYXIgdGVzdGluZyBlbnZpcm9ubWVudC5cbmdldFRlc3RCZWQoKS5pbml0VGVzdEVudmlyb25tZW50KFxuICBCcm93c2VyRHluYW1pY1Rlc3RpbmdNb2R1bGUsXG4gIHBsYXRmb3JtQnJvd3NlckR5bmFtaWNUZXN0aW5nKClcbik7XG4vLyBUaGVuIHdlIGZpbmQgYWxsIHRoZSB0ZXN0cy5cbmNvbnN0IGNvbnRleHQgPSByZXF1aXJlLmNvbnRleHQoJy4vJywgdHJ1ZSwgL1xcLnNwZWNcXC50cyQvKTtcbi8vIEFuZCBsb2FkIHRoZSBtb2R1bGVzLlxuY29udGV4dC5rZXlzKCkubWFwKGNvbnRleHQpO1xuIl19