/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Zone.__load_patch('RTCPeerConnection', function (global, Zone, api) {
    var RTCPeerConnection = global['RTCPeerConnection'];
    if (!RTCPeerConnection) {
        return;
    }
    var addSymbol = api.symbol('addEventListener');
    var removeSymbol = api.symbol('removeEventListener');
    RTCPeerConnection.prototype.addEventListener = RTCPeerConnection.prototype[addSymbol];
    RTCPeerConnection.prototype.removeEventListener = RTCPeerConnection.prototype[removeSymbol];
    // RTCPeerConnection extends EventTarget, so we must clear the symbol
    // to allow patch RTCPeerConnection.prototype.addEventListener again
    RTCPeerConnection.prototype[addSymbol] = null;
    RTCPeerConnection.prototype[removeSymbol] = null;
    api.patchEventTarget(global, [RTCPeerConnection.prototype], { useG: false });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViYXBpcy1ydGMtcGVlci1jb25uZWN0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9icm93c2VyL3dlYmFwaXMtcnRjLXBlZXItY29ubmVjdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxJQUFJLENBQUMsWUFBWSxDQUFDLG1CQUFtQixFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWMsRUFBRSxHQUFpQjtJQUNwRixJQUFNLGlCQUFpQixHQUFHLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0lBQ3RELElBQUksQ0FBQyxpQkFBaUIsRUFBRTtRQUN0QixPQUFPO0tBQ1I7SUFFRCxJQUFNLFNBQVMsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7SUFDakQsSUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO0lBRXZELGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxpQkFBaUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDdEYsaUJBQWlCLENBQUMsU0FBUyxDQUFDLG1CQUFtQixHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUU1RixxRUFBcUU7SUFDckUsb0VBQW9FO0lBQ3BFLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDOUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLElBQUksQ0FBQztJQUVqRCxHQUFHLENBQUMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFLENBQUMsaUJBQWlCLENBQUMsU0FBUyxDQUFDLEVBQUUsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFDLENBQUMsQ0FBQztBQUM3RSxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblpvbmUuX19sb2FkX3BhdGNoKCdSVENQZWVyQ29ubmVjdGlvbicsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUsIGFwaTogX1pvbmVQcml2YXRlKSA9PiB7XG4gIGNvbnN0IFJUQ1BlZXJDb25uZWN0aW9uID0gZ2xvYmFsWydSVENQZWVyQ29ubmVjdGlvbiddO1xuICBpZiAoIVJUQ1BlZXJDb25uZWN0aW9uKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgYWRkU3ltYm9sID0gYXBpLnN5bWJvbCgnYWRkRXZlbnRMaXN0ZW5lcicpO1xuICBjb25zdCByZW1vdmVTeW1ib2wgPSBhcGkuc3ltYm9sKCdyZW1vdmVFdmVudExpc3RlbmVyJyk7XG5cbiAgUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgPSBSVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGVbYWRkU3ltYm9sXTtcbiAgUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLnJlbW92ZUV2ZW50TGlzdGVuZXIgPSBSVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGVbcmVtb3ZlU3ltYm9sXTtcblxuICAvLyBSVENQZWVyQ29ubmVjdGlvbiBleHRlbmRzIEV2ZW50VGFyZ2V0LCBzbyB3ZSBtdXN0IGNsZWFyIHRoZSBzeW1ib2xcbiAgLy8gdG8gYWxsb3cgcGF0Y2ggUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlLmFkZEV2ZW50TGlzdGVuZXIgYWdhaW5cbiAgUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlW2FkZFN5bWJvbF0gPSBudWxsO1xuICBSVENQZWVyQ29ubmVjdGlvbi5wcm90b3R5cGVbcmVtb3ZlU3ltYm9sXSA9IG51bGw7XG5cbiAgYXBpLnBhdGNoRXZlbnRUYXJnZXQoZ2xvYmFsLCBbUlRDUGVlckNvbm5lY3Rpb24ucHJvdG90eXBlXSwge3VzZUc6IGZhbHNlfSk7XG59KTtcbiJdfQ==