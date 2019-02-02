/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('socketio', function (global, Zone, api) {
    Zone[Zone.__symbol__('socketio')] = function patchSocketIO(io) {
        // patch io.Socket.prototype event listener related method
        api.patchEventTarget(global, [io.Socket.prototype], {
            useG: false,
            chkDup: false,
            rt: true,
            diff: function (task, delegate) {
                return task.callback === delegate;
            }
        });
        // also patch io.Socket.prototype.on/off/removeListener/removeAllListeners
        io.Socket.prototype.on = io.Socket.prototype.addEventListener;
        io.Socket.prototype.off = io.Socket.prototype.removeListener =
            io.Socket.prototype.removeAllListeners = io.Socket.prototype.removeEventListener;
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ja2V0LWlvLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvZXh0cmEvc29ja2V0LWlvLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUMxRSxJQUFZLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQyxHQUFHLFNBQVMsYUFBYSxDQUFDLEVBQU87UUFDekUsMERBQTBEO1FBQzFELEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxFQUFFO1lBQ2xELElBQUksRUFBRSxLQUFLO1lBQ1gsTUFBTSxFQUFFLEtBQUs7WUFDYixFQUFFLEVBQUUsSUFBSTtZQUNSLElBQUksRUFBRSxVQUFDLElBQVMsRUFBRSxRQUFhO2dCQUM3QixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxDQUFDO1lBQ3BDLENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCwwRUFBMEU7UUFDMUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDO1FBQzlELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjO1lBQ3hELEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLGtCQUFrQixHQUFHLEVBQUUsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDO0lBQ3ZGLENBQUMsQ0FBQztBQUNKLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuWm9uZS5fX2xvYWRfcGF0Y2goJ3NvY2tldGlvJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgKFpvbmUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ3NvY2tldGlvJyldID0gZnVuY3Rpb24gcGF0Y2hTb2NrZXRJTyhpbzogYW55KSB7XG4gICAgLy8gcGF0Y2ggaW8uU29ja2V0LnByb3RvdHlwZSBldmVudCBsaXN0ZW5lciByZWxhdGVkIG1ldGhvZFxuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KGdsb2JhbCwgW2lvLlNvY2tldC5wcm90b3R5cGVdLCB7XG4gICAgICB1c2VHOiBmYWxzZSxcbiAgICAgIGNoa0R1cDogZmFsc2UsXG4gICAgICBydDogdHJ1ZSxcbiAgICAgIGRpZmY6ICh0YXNrOiBhbnksIGRlbGVnYXRlOiBhbnkpID0+IHtcbiAgICAgICAgcmV0dXJuIHRhc2suY2FsbGJhY2sgPT09IGRlbGVnYXRlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIGFsc28gcGF0Y2ggaW8uU29ja2V0LnByb3RvdHlwZS5vbi9vZmYvcmVtb3ZlTGlzdGVuZXIvcmVtb3ZlQWxsTGlzdGVuZXJzXG4gICAgaW8uU29ja2V0LnByb3RvdHlwZS5vbiA9IGlvLlNvY2tldC5wcm90b3R5cGUuYWRkRXZlbnRMaXN0ZW5lcjtcbiAgICBpby5Tb2NrZXQucHJvdG90eXBlLm9mZiA9IGlvLlNvY2tldC5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgICAgICBpby5Tb2NrZXQucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGlvLlNvY2tldC5wcm90b3R5cGUucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcbiAgfTtcbn0pO1xuIl19