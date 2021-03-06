/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('shadydom', function (global, Zone, api) {
    // https://github.com/angular/zone.js/issues/782
    // in web components, shadydom will patch addEventListener/removeEventListener of
    // Node.prototype and WindowPrototype, this will have conflict with zone.js
    // so zone.js need to patch them again.
    var windowPrototype = Object.getPrototypeOf(window);
    if (windowPrototype && windowPrototype.hasOwnProperty('addEventListener')) {
        windowPrototype[Zone.__symbol__('addEventListener')] = null;
        windowPrototype[Zone.__symbol__('removeEventListener')] = null;
        api.patchEventTarget(global, [windowPrototype]);
    }
    if (Node.prototype.hasOwnProperty('addEventListener')) {
        Node.prototype[Zone.__symbol__('addEventListener')] = null;
        Node.prototype[Zone.__symbol__('removeEventListener')] = null;
        api.patchEventTarget(global, [Node.prototype]);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hhZHlkb20uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9icm93c2VyL3NoYWR5ZG9tLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUMzRSxnREFBZ0Q7SUFDaEQsaUZBQWlGO0lBQ2pGLDJFQUEyRTtJQUMzRSx1Q0FBdUM7SUFDdkMsSUFBTSxlQUFlLEdBQUcsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxJQUFJLGVBQWUsSUFBSSxlQUFlLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDeEUsZUFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLGtCQUFrQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDcEUsZUFBdUIsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLHFCQUFxQixDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7UUFDeEUsR0FBRyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sRUFBRSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7S0FDakQ7SUFDRCxJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLGtCQUFrQixDQUFDLEVBQUU7UUFDcEQsSUFBSSxDQUFDLFNBQWlCLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO1FBQ25FLElBQUksQ0FBQyxTQUFpQixDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUN2RSxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7S0FDaEQ7QUFDSCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdzaGFkeWRvbScsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL3pvbmUuanMvaXNzdWVzLzc4MlxuICAvLyBpbiB3ZWIgY29tcG9uZW50cywgc2hhZHlkb20gd2lsbCBwYXRjaCBhZGRFdmVudExpc3RlbmVyL3JlbW92ZUV2ZW50TGlzdGVuZXIgb2ZcbiAgLy8gTm9kZS5wcm90b3R5cGUgYW5kIFdpbmRvd1Byb3RvdHlwZSwgdGhpcyB3aWxsIGhhdmUgY29uZmxpY3Qgd2l0aCB6b25lLmpzXG4gIC8vIHNvIHpvbmUuanMgbmVlZCB0byBwYXRjaCB0aGVtIGFnYWluLlxuICBjb25zdCB3aW5kb3dQcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yod2luZG93KTtcbiAgaWYgKHdpbmRvd1Byb3RvdHlwZSAmJiB3aW5kb3dQcm90b3R5cGUuaGFzT3duUHJvcGVydHkoJ2FkZEV2ZW50TGlzdGVuZXInKSkge1xuICAgICh3aW5kb3dQcm90b3R5cGUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ2FkZEV2ZW50TGlzdGVuZXInKV0gPSBudWxsO1xuICAgICh3aW5kb3dQcm90b3R5cGUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ3JlbW92ZUV2ZW50TGlzdGVuZXInKV0gPSBudWxsO1xuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KGdsb2JhbCwgW3dpbmRvd1Byb3RvdHlwZV0pO1xuICB9XG4gIGlmIChOb2RlLnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSgnYWRkRXZlbnRMaXN0ZW5lcicpKSB7XG4gICAgKE5vZGUucHJvdG90eXBlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKCdhZGRFdmVudExpc3RlbmVyJyldID0gbnVsbDtcbiAgICAoTm9kZS5wcm90b3R5cGUgYXMgYW55KVtab25lLl9fc3ltYm9sX18oJ3JlbW92ZUV2ZW50TGlzdGVuZXInKV0gPSBudWxsO1xuICAgIGFwaS5wYXRjaEV2ZW50VGFyZ2V0KGdsb2JhbCwgW05vZGUucHJvdG90eXBlXSk7XG4gIH1cbn0pO1xuIl19