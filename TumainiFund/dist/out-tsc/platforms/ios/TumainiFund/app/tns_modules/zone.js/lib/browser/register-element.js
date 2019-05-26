/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export function registerElementPatch(_global, api) {
    const { isBrowser, isMix } = api.getGlobalObjects();
    if ((!isBrowser && !isMix) || !('registerElement' in _global.document)) {
        return;
    }
    const callbacks = ['createdCallback', 'attachedCallback', 'detachedCallback', 'attributeChangedCallback'];
    api.patchCallbacks(api, document, 'Document', 'registerElement', callbacks);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVnaXN0ZXItZWxlbWVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvcmVnaXN0ZXItZWxlbWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxNQUFNLFVBQVUsb0JBQW9CLENBQUMsT0FBWSxFQUFFLEdBQWlCO0lBQ2xFLE1BQU0sRUFBQyxTQUFTLEVBQUUsS0FBSyxFQUFDLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixFQUFHLENBQUM7SUFDbkQsSUFBSSxDQUFDLENBQUMsU0FBUyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLGlCQUFpQixJQUFVLE9BQVEsQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUM3RSxPQUFPO0tBQ1I7SUFFRCxNQUFNLFNBQVMsR0FDWCxDQUFDLGlCQUFpQixFQUFFLGtCQUFrQixFQUFFLGtCQUFrQixFQUFFLDBCQUEwQixDQUFDLENBQUM7SUFFNUYsR0FBRyxDQUFDLGNBQWMsQ0FBQyxHQUFHLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxTQUFTLENBQUMsQ0FBQztBQUM5RSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJFbGVtZW50UGF0Y2goX2dsb2JhbDogYW55LCBhcGk6IF9ab25lUHJpdmF0ZSkge1xuICBjb25zdCB7aXNCcm93c2VyLCBpc01peH0gPSBhcGkuZ2V0R2xvYmFsT2JqZWN0cygpITtcbiAgaWYgKCghaXNCcm93c2VyICYmICFpc01peCkgfHwgISgncmVnaXN0ZXJFbGVtZW50JyBpbiAoPGFueT5fZ2xvYmFsKS5kb2N1bWVudCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBjYWxsYmFja3MgPVxuICAgICAgWydjcmVhdGVkQ2FsbGJhY2snLCAnYXR0YWNoZWRDYWxsYmFjaycsICdkZXRhY2hlZENhbGxiYWNrJywgJ2F0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayddO1xuXG4gIGFwaS5wYXRjaENhbGxiYWNrcyhhcGksIGRvY3VtZW50LCAnRG9jdW1lbnQnLCAncmVnaXN0ZXJFbGVtZW50JywgY2FsbGJhY2tzKTtcbn1cbiJdfQ==