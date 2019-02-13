/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('notification', function (global, Zone, api) {
    var Notification = global['Notification'];
    if (!Notification || !Notification.prototype) {
        return;
    }
    var desc = Object.getOwnPropertyDescriptor(Notification.prototype, 'onerror');
    if (!desc || !desc.configurable) {
        return;
    }
    api.patchOnProperties(Notification.prototype, null);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpcy1ub3RpZmljYXRpb24uanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvd2ViYXBpcy1ub3RpZmljYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsSUFBSSxDQUFDLFlBQVksQ0FBQyxjQUFjLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEdBQWlCO0lBQy9FLElBQU0sWUFBWSxHQUFHLE1BQU0sQ0FBQyxjQUFjLENBQUMsQ0FBQztJQUM1QyxJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRTtRQUM1QyxPQUFPO0tBQ1I7SUFDRCxJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsd0JBQXdCLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNoRixJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRTtRQUMvQixPQUFPO0tBQ1I7SUFDRCxHQUFHLENBQUMsaUJBQWlCLENBQUMsWUFBWSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUN0RCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdub3RpZmljYXRpb24nLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICBjb25zdCBOb3RpZmljYXRpb24gPSBnbG9iYWxbJ05vdGlmaWNhdGlvbiddO1xuICBpZiAoIU5vdGlmaWNhdGlvbiB8fCAhTm90aWZpY2F0aW9uLnByb3RvdHlwZSkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihOb3RpZmljYXRpb24ucHJvdG90eXBlLCAnb25lcnJvcicpO1xuICBpZiAoIWRlc2MgfHwgIWRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGFwaS5wYXRjaE9uUHJvcGVydGllcyhOb3RpZmljYXRpb24ucHJvdG90eXBlLCBudWxsKTtcbn0pO1xuIl19