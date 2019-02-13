"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * @fileoverview
 * @suppress {globalThis}
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../common/utils");
var webSocketPatch = require("./websocket");
var globalEventHandlersEventNames = [
    'abort',
    'animationcancel',
    'animationend',
    'animationiteration',
    'auxclick',
    'beforeinput',
    'blur',
    'cancel',
    'canplay',
    'canplaythrough',
    'change',
    'compositionstart',
    'compositionupdate',
    'compositionend',
    'cuechange',
    'click',
    'close',
    'contextmenu',
    'curechange',
    'dblclick',
    'drag',
    'dragend',
    'dragenter',
    'dragexit',
    'dragleave',
    'dragover',
    'drop',
    'durationchange',
    'emptied',
    'ended',
    'error',
    'focus',
    'focusin',
    'focusout',
    'gotpointercapture',
    'input',
    'invalid',
    'keydown',
    'keypress',
    'keyup',
    'load',
    'loadstart',
    'loadeddata',
    'loadedmetadata',
    'lostpointercapture',
    'mousedown',
    'mouseenter',
    'mouseleave',
    'mousemove',
    'mouseout',
    'mouseover',
    'mouseup',
    'mousewheel',
    'orientationchange',
    'pause',
    'play',
    'playing',
    'pointercancel',
    'pointerdown',
    'pointerenter',
    'pointerleave',
    'pointerlockchange',
    'mozpointerlockchange',
    'webkitpointerlockerchange',
    'pointerlockerror',
    'mozpointerlockerror',
    'webkitpointerlockerror',
    'pointermove',
    'pointout',
    'pointerover',
    'pointerup',
    'progress',
    'ratechange',
    'reset',
    'resize',
    'scroll',
    'seeked',
    'seeking',
    'select',
    'selectionchange',
    'selectstart',
    'show',
    'sort',
    'stalled',
    'submit',
    'suspend',
    'timeupdate',
    'volumechange',
    'touchcancel',
    'touchmove',
    'touchstart',
    'touchend',
    'transitioncancel',
    'transitionend',
    'waiting',
    'wheel'
];
var documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
var windowEventNames = [
    'absolutedeviceorientation',
    'afterinput',
    'afterprint',
    'appinstalled',
    'beforeinstallprompt',
    'beforeprint',
    'beforeunload',
    'devicelight',
    'devicemotion',
    'deviceorientation',
    'deviceorientationabsolute',
    'deviceproximity',
    'hashchange',
    'languagechange',
    'message',
    'mozbeforepaint',
    'offline',
    'online',
    'paint',
    'pageshow',
    'pagehide',
    'popstate',
    'rejectionhandled',
    'storage',
    'unhandledrejection',
    'unload',
    'userproximity',
    'vrdisplyconnected',
    'vrdisplaydisconnected',
    'vrdisplaypresentchange'
];
var htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
var mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
var ieElementEventNames = [
    'activate',
    'afterupdate',
    'ariarequest',
    'beforeactivate',
    'beforedeactivate',
    'beforeeditfocus',
    'beforeupdate',
    'cellchange',
    'controlselect',
    'dataavailable',
    'datasetchanged',
    'datasetcomplete',
    'errorupdate',
    'filterchange',
    'layoutcomplete',
    'losecapture',
    'move',
    'moveend',
    'movestart',
    'propertychange',
    'resizeend',
    'resizestart',
    'rowenter',
    'rowexit',
    'rowsdelete',
    'rowsinserted',
    'command',
    'compassneedscalibration',
    'deactivate',
    'help',
    'mscontentzoom',
    'msmanipulationstatechanged',
    'msgesturechange',
    'msgesturedoubletap',
    'msgestureend',
    'msgesturehold',
    'msgesturestart',
    'msgesturetap',
    'msgotpointercapture',
    'msinertiastart',
    'mslostpointercapture',
    'mspointercancel',
    'mspointerdown',
    'mspointerenter',
    'mspointerhover',
    'mspointerleave',
    'mspointermove',
    'mspointerout',
    'mspointerover',
    'mspointerup',
    'pointerout',
    'mssitemodejumplistitemremoved',
    'msthumbnailclick',
    'stop',
    'storagecommit'
];
var webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
var formEventNames = ['autocomplete', 'autocompleteerror'];
var detailEventNames = ['toggle'];
var frameEventNames = ['load'];
var frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
var marqueeEventNames = ['bounce', 'finish', 'start'];
var XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
var IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
var websocketEventNames = ['close', 'error', 'open', 'message'];
var workerEventNames = ['error', 'message'];
exports.eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    var tip = ignoreProperties.filter(function (ip) { return ip.target === target; });
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    var targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(function (op) { return targetIgnoreProperties.indexOf(op) === -1; });
}
function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    var filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    utils_1.patchOnProperties(target, filteredProperties, prototype);
}
exports.patchFilteredProperties = patchFilteredProperties;
function propertyDescriptorPatch(api, _global) {
    if (utils_1.isNode && !utils_1.isMix) {
        return;
    }
    var supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        var ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (utils_1.isBrowser) {
            var internalWindow = window;
            var ignoreErrorProperties = utils_1.isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, exports.eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, utils_1.ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, exports.eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, exports.eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, exports.eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, exports.eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            var HTMLMarqueeElement_1 = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement_1) {
                patchFilteredProperties(HTMLMarqueeElement_1.prototype, marqueeEventNames, ignoreProperties);
            }
            var Worker_1 = internalWindow['Worker'];
            if (Worker_1) {
                patchFilteredProperties(Worker_1.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        var XMLHttpRequestEventTarget_1 = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget_1) {
            patchFilteredProperties(XMLHttpRequestEventTarget_1 && XMLHttpRequestEventTarget_1.prototype, XMLHttpRequestEventNames, ignoreProperties);
        }
        if (typeof IDBIndex !== 'undefined') {
            patchFilteredProperties(IDBIndex.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBOpenDBRequest.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBDatabase.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBTransaction.prototype, IDBIndexEventNames, ignoreProperties);
            patchFilteredProperties(IDBCursor.prototype, IDBIndexEventNames, ignoreProperties);
        }
        if (supportsWebSocket) {
            patchFilteredProperties(WebSocket.prototype, websocketEventNames, ignoreProperties);
        }
    }
    else {
        // Safari, Android browsers (Jelly Bean)
        patchViaCapturingAllTheEvents();
        utils_1.patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            webSocketPatch.apply(api, _global);
        }
    }
}
exports.propertyDescriptorPatch = propertyDescriptorPatch;
function canPatchViaPropertyDescriptor() {
    if ((utils_1.isBrowser || utils_1.isMix) && !utils_1.ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        var desc = utils_1.ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    var ON_READY_STATE_CHANGE = 'onreadystatechange';
    var XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    var xhrDesc = utils_1.ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        utils_1.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        var req = new XMLHttpRequest();
        var result = !!req.onreadystatechange;
        // restore original desc
        utils_1.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        var SYMBOL_FAKE_ONREADYSTATECHANGE_1 = utils_1.zoneSymbol('fake');
        utils_1.ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE_1];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE_1] = value;
            }
        });
        var req = new XMLHttpRequest();
        var detectFunc = function () { };
        req.onreadystatechange = detectFunc;
        var result = req[SYMBOL_FAKE_ONREADYSTATECHANGE_1] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
var unboundKey = utils_1.zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    var _loop_1 = function (i) {
        var property = exports.eventNames[i];
        var onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            var elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = utils_1.wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    };
    for (var i = 0; i < exports.eventNames.length; i++) {
        _loop_1(i);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktZGVzY3JpcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvYnJvd3Nlci9wcm9wZXJ0eS1kZXNjcmlwdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSDs7O0dBR0c7O0FBRUgseUNBQTJNO0FBRTNNLDRDQUE4QztBQUU5QyxJQUFNLDZCQUE2QixHQUFHO0lBQ3BDLE9BQU87SUFDUCxpQkFBaUI7SUFDakIsY0FBYztJQUNkLG9CQUFvQjtJQUNwQixVQUFVO0lBQ1YsYUFBYTtJQUNiLE1BQU07SUFDTixRQUFRO0lBQ1IsU0FBUztJQUNULGdCQUFnQjtJQUNoQixRQUFRO0lBQ1Isa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsV0FBVztJQUNYLE9BQU87SUFDUCxPQUFPO0lBQ1AsYUFBYTtJQUNiLFlBQVk7SUFDWixVQUFVO0lBQ1YsTUFBTTtJQUNOLFNBQVM7SUFDVCxXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsTUFBTTtJQUNOLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFDVixtQkFBbUI7SUFDbkIsT0FBTztJQUNQLFNBQVM7SUFDVCxTQUFTO0lBQ1QsVUFBVTtJQUNWLE9BQU87SUFDUCxNQUFNO0lBQ04sV0FBVztJQUNYLFlBQVk7SUFDWixnQkFBZ0I7SUFDaEIsb0JBQW9CO0lBQ3BCLFdBQVc7SUFDWCxZQUFZO0lBQ1osWUFBWTtJQUNaLFdBQVc7SUFDWCxVQUFVO0lB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QUMsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDO2FBQ3JEO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDO2FBQ2xDO1lBQ0QsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ25ELEtBQUssR0FBRywyQkFBbUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3JELEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3pCO2dCQUNELEdBQUcsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO2FBQ3pCO1FBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQW5CRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsa0JBQVUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFO2dCQUFqQyxDQUFDO0tBbUJUO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHtnbG9iYWxUaGlzfVxuICovXG5cbmltcG9ydCB7aXNCcm93c2VyLCBpc0lFLCBpc01peCwgaXNOb2RlLCBPYmplY3REZWZpbmVQcm9wZXJ0eSwgT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLCBPYmplY3RHZXRQcm90b3R5cGVPZiwgcGF0Y2hDbGFzcywgcGF0Y2hPblByb3BlcnRpZXMsIHdyYXBXaXRoQ3VycmVudFpvbmUsIHpvbmVTeW1ib2x9IGZyb20gJy4uL2NvbW1vbi91dGlscyc7XG5cbmltcG9ydCAqIGFzIHdlYlNvY2tldFBhdGNoIGZyb20gJy4vd2Vic29ja2V0JztcblxuY29uc3QgZ2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TmFtZXMgPSBbXG4gICdhYm9ydCcsXG4gICdhbmltYXRpb25jYW5jZWwnLFxuICAnYW5pbWF0aW9uZW5kJyxcbiAgJ2FuaW1hdGlvbml0ZXJhdGlvbicsXG4gICdhdXhjbGljaycsXG4gICdiZWZvcmVpbnB1dCcsXG4gICdibHVyJyxcbiAgJ2NhbmNlbCcsXG4gICdjYW5wbGF5JyxcbiAgJ2NhbnBsYXl0aHJvdWdoJyxcbiAgJ2NoYW5nZScsXG4gICdjb21wb3NpdGlvbnN0YXJ0JyxcbiAgJ2NvbXBvc2l0aW9udXBkYXRlJyxcbiAgJ2NvbXBvc2l0aW9uZW5kJyxcbiAgJ2N1ZWNoYW5nZScsXG4gICdjbGljaycsXG4gICdjbG9zZScsXG4gICdjb250ZXh0bWVudScsXG4gICdjdXJlY2hhbmdlJyxcbiAgJ2RibGNsaWNrJyxcbiAgJ2RyYWcnLFxuICAnZHJhZ2VuZCcsXG4gICdkcmFnZW50ZXInLFxuICAnZHJhZ2V4aXQnLFxuICAnZHJhZ2xlYXZlJyxcbiAgJ2RyYWdvdmVyJyxcbiAgJ2Ryb3AnLFxuICAnZHVyYXRpb25jaGFuZ2UnLFxuICAnZW1wdGllZCcsXG4gICdlbmRlZCcsXG4gICdlcnJvcicsXG4gICdmb2N1cycsXG4gICdmb2N1c2luJyxcbiAgJ2ZvY3Vzb3V0JyxcbiAgJ2dvdHBvaW50ZXJjYXB0dXJlJyxcbiAgJ2lucHV0JyxcbiAgJ2ludmFsaWQnLFxuICAna2V5ZG93bicsXG4gICdrZXlwcmVzcycsXG4gICdrZXl1cCcsXG4gICdsb2FkJyxcbiAgJ2xvYWRzdGFydCcsXG4gICdsb2FkZWRkYXRhJyxcbiAgJ2xvYWRlZG1ldGFkYXRhJyxcbiAgJ2xvc3Rwb2ludGVyY2FwdHVyZScsXG4gICdtb3VzZWRvd24nLFxuICAnbW91c2VlbnRlcicsXG4gICdtb3VzZWxlYXZlJyxcbiAgJ21vdXNlbW92ZScsXG4gICdtb3VzZW91dCcsXG4gICdtb3VzZW92ZXInLFxuICAnbW91c2V1cCcsXG4gICdtb3VzZXdoZWVsJyxcbiAgJ29yaWVudGF0aW9uY2hhbmdlJyxcbiAgJ3BhdXNlJyxcbiAgJ3BsYXknLFxuICAncGxheWluZycsXG4gICdwb2ludGVyY2FuY2VsJyxcbiAgJ3BvaW50ZXJkb3duJyxcbiAgJ3BvaW50ZXJlbnRlcicsXG4gICdwb2ludGVybGVhdmUnLFxuICAncG9pbnRlcmxvY2tjaGFuZ2UnLFxuICAnbW96cG9pbnRlcmxvY2tjaGFuZ2UnLFxuICAnd2Via2l0cG9pbnRlcmxvY2tlcmNoYW5nZScsXG4gICdwb2ludGVybG9ja2Vycm9yJyxcbiAgJ21venBvaW50ZXJsb2NrZXJyb3InLFxuICAnd2Via2l0cG9pbnRlcmxvY2tlcnJvcicsXG4gICdwb2ludGVybW92ZScsXG4gICdwb2ludG91dCcsXG4gICdwb2ludGVyb3ZlcicsXG4gICdwb2ludGVydXAnLFxuICAncHJvZ3Jlc3MnLFxuICAncmF0ZWNoYW5nZScsXG4gICdyZXNldCcsXG4gICdyZXNpemUnLFxuICAnc2Nyb2xsJyxcbiAgJ3NlZWtlZCcsXG4gICdzZWVraW5nJyxcbiAgJ3NlbGVjdCcsXG4gICdzZWxlY3Rpb25jaGFuZ2UnLFxuICAnc2VsZWN0c3RhcnQnLFxuICAnc2hvdycsXG4gICdzb3J0JyxcbiAgJ3N0YWxsZWQnLFxuICAnc3VibWl0JyxcbiAgJ3N1c3BlbmQnLFxuICAndGltZXVwZGF0ZScsXG4gICd2b2x1bWVjaGFuZ2UnLFxuICAndG91Y2hjYW5jZWwnLFxuICAndG91Y2htb3ZlJyxcbiAgJ3RvdWNoc3RhcnQnLFxuICAndG91Y2hlbmQnLFxuICAndHJhbnNpdGlvbmNhbmNlbCcsXG4gICd0cmFuc2l0aW9uZW5kJyxcbiAgJ3dhaXRpbmcnLFxuICAnd2hlZWwnXG5dO1xuY29uc3QgZG9jdW1lbnRFdmVudE5hbWVzID0gW1xuICAnYWZ0ZXJzY3JpcHRleGVjdXRlJywgJ2JlZm9yZXNjcmlwdGV4ZWN1dGUnLCAnRE9NQ29udGVudExvYWRlZCcsICdmcmVlemUnLCAnZnVsbHNjcmVlbmNoYW5nZScsXG4gICdtb3pmdWxsc2NyZWVuY2hhbmdlJywgJ3dlYmtpdGZ1bGxzY3JlZW5jaGFuZ2UnLCAnbXNmdWxsc2NyZWVuY2hhbmdlJywgJ2Z1bGxzY3JlZW5lcnJvcicsXG4gICdtb3pmdWxsc2NyZWVuZXJyb3InLCAnd2Via2l0ZnVsbHNjcmVlbmVycm9yJywgJ21zZnVsbHNjcmVlbmVycm9yJywgJ3JlYWR5c3RhdGVjaGFuZ2UnLFxuICAndmlzaWJpbGl0eWNoYW5nZScsICdyZXN1bWUnXG5dO1xuY29uc3Qgd2luZG93RXZlbnROYW1lcyA9IFtcbiAgJ2Fic29sdXRlZGV2aWNlb3JpZW50YXRpb24nLFxuICAnYWZ0ZXJpbnB1dCcsXG4gICdhZnRlcnByaW50JyxcbiAgJ2FwcGluc3RhbGxlZCcsXG4gICdiZWZvcmVpbnN0YWxscHJvbXB0JyxcbiAgJ2JlZm9yZXByaW50JyxcbiAgJ2JlZm9yZXVubG9hZCcsXG4gICdkZXZpY2VsaWdodCcsXG4gICdkZXZpY2Vtb3Rpb24nLFxuICAnZGV2aWNlb3JpZW50YXRpb24nLFxuICAnZGV2aWNlb3JpZW50YXRpb25hYnNvbHV0ZScsXG4gICdkZXZpY2Vwcm94aW1pdHknLFxuICAnaGFzaGNoYW5nZScsXG4gICdsYW5ndWFnZWNoYW5nZScsXG4gICdtZXNzYWdlJyxcbiAgJ21vemJlZm9yZXBhaW50JyxcbiAgJ29mZmxpbmUnLFxuICAnb25saW5lJyxcbiAgJ3BhaW50JyxcbiAgJ3BhZ2VzaG93JyxcbiAgJ3BhZ2VoaWRlJyxcbiAgJ3BvcHN0YXRlJyxcbiAgJ3JlamVjdGlvbmhhbmRsZWQnLFxuICAnc3RvcmFnZScsXG4gICd1bmhhbmRsZWRyZWplY3Rpb24nLFxuICAndW5sb2FkJyxcbiAgJ3VzZXJwcm94aW1pdHknLFxuICAndnJkaXNwbHljb25uZWN0ZWQnLFxuICAndnJkaXNwbGF5ZGlzY29ubmVjdGVkJyxcbiAgJ3ZyZGlzcGxheXByZXNlbnRjaGFuZ2UnXG5dO1xuY29uc3QgaHRtbEVsZW1lbnRFdmVudE5hbWVzID0gW1xuICAnYmVmb3JlY29weScsICdiZWZvcmVjdXQnLCAnYmVmb3JlcGFzdGUnLCAnY29weScsICdjdXQnLCAncGFzdGUnLCAnZHJhZ3N0YXJ0JywgJ2xvYWRlbmQnLFxuICAnYW5pbWF0aW9uc3RhcnQnLCAnc2VhcmNoJywgJ3RyYW5zaXRpb25ydW4nLCAndHJhbnNpdGlvbnN0YXJ0JywgJ3dlYmtpdGFuaW1hdGlvbmVuZCcsXG4gICd3ZWJraXRhbmltYXRpb25pdGVyYXRpb24nLCAnd2Via2l0YW5pbWF0aW9uc3RhcnQnLCAnd2Via2l0dHJhbnNpdGlvbmVuZCdcbl07XG5jb25zdCBtZWRpYUVsZW1lbnRFdmVudE5hbWVzID1cbiAgICBbJ2VuY3J5cHRlZCcsICd3YWl0aW5nZm9ya2V5JywgJ21zbmVlZGtleScsICdtb3ppbnRlcnJ1cHRiZWdpbicsICdtb3ppbnRlcnJ1cHRlbmQnXTtcbmNvbnN0IGllRWxlbWVudEV2ZW50TmFtZXMgPSBbXG4gICdhY3RpdmF0ZScsXG4gICdhZnRlcnVwZGF0ZScsXG4gICdhcmlhcmVxdWVzdCcsXG4gICdiZWZvcmVhY3RpdmF0ZScsXG4gICdiZWZvcmVkZWFjdGl2YXRlJyxcbiAgJ2JlZm9yZWVkaXRmb2N1cycsXG4gICdiZWZvcmV1cGRhdGUnLFxuICAnY2VsbGNoYW5nZScsXG4gICdjb250cm9sc2VsZWN0JyxcbiAgJ2RhdGFhdmFpbGFibGUnLFxuICAnZGF0YXNldGNoYW5nZWQnLFxuICAnZGF0YXNldGNvbXBsZXRlJyxcbiAgJ2Vycm9ydXBkYXRlJyxcbiAgJ2ZpbHRlcmNoYW5nZScsXG4gICdsYXlvdXRjb21wbGV0ZScsXG4gICdsb3NlY2FwdHVyZScsXG4gICdtb3ZlJyxcbiAgJ21vdmVlbmQnLFxuICAnbW92ZXN0YXJ0JyxcbiAgJ3Byb3BlcnR5Y2hhbmdlJyxcbiAgJ3Jlc2l6ZWVuZCcsXG4gICdyZXNpemVzdGFydCcsXG4gICdyb3dlbnRlcicsXG4gICdyb3dleGl0JyxcbiAgJ3Jvd3NkZWxldGUnLFxuICAncm93c2luc2VydGVkJyxcbiAgJ2NvbW1hbmQnLFxuICAnY29tcGFzc25lZWRzY2FsaWJyYXRpb24nLFxuICAnZGVhY3RpdmF0ZScsXG4gICdoZWxwJyxcbiAgJ21zY29udGVudHpvb20nLFxuICAnbXNtYW5pcHVsYXRpb25zdGF0ZWNoYW5nZWQnLFxuICAnbXNnZXN0dXJlY2hhbmdlJyxcbiAgJ21zZ2VzdHVyZWRvdWJsZXRhcCcsXG4gICdtc2dlc3R1cmVlbmQnLFxuICAnbXNnZXN0dXJlaG9sZCcsXG4gICdtc2dlc3R1cmVzdGFydCcsXG4gICdtc2dlc3R1cmV0YXAnLFxuICAnbXNnb3Rwb2ludGVyY2FwdHVyZScsXG4gICdtc2luZXJ0aWFzdGFydCcsXG4gICdtc2xvc3Rwb2ludGVyY2FwdHVyZScsXG4gICdtc3BvaW50ZXJjYW5jZWwnLFxuICAnbXNwb2ludGVyZG93bicsXG4gICdtc3BvaW50ZXJlbnRlcicsXG4gICdtc3BvaW50ZXJob3ZlcicsXG4gICdtc3BvaW50ZXJsZWF2ZScsXG4gICdtc3BvaW50ZXJtb3ZlJyxcbiAgJ21zcG9pbnRlcm91dCcsXG4gICdtc3BvaW50ZXJvdmVyJyxcbiAgJ21zcG9pbnRlcnVwJyxcbiAgJ3BvaW50ZXJvdXQnLFxuICAnbXNzaXRlbW9kZWp1bXBsaXN0aXRlbXJlbW92ZWQnLFxuICAnbXN0aHVtYm5haWxjbGljaycsXG4gICdzdG9wJyxcbiAgJ3N0b3JhZ2Vjb21taXQnXG5dO1xuY29uc3Qgd2ViZ2xFdmVudE5hbWVzID0gWyd3ZWJnbGNvbnRleHRyZXN0b3JlZCcsICd3ZWJnbGNvbnRleHRsb3N0JywgJ3dlYmdsY29udGV4dGNyZWF0aW9uZXJyb3InXTtcbmNvbnN0IGZvcm1FdmVudE5hbWVzID0gWydhdXRvY29tcGxldGUnLCAnYXV0b2NvbXBsZXRlZXJyb3InXTtcbmNvbnN0IGRldGFpbEV2ZW50TmFtZXMgPSBbJ3RvZ2dsZSddO1xuY29uc3QgZnJhbWVFdmVudE5hbWVzID0gWydsb2FkJ107XG5jb25zdCBmcmFtZVNldEV2ZW50TmFtZXMgPSBbJ2JsdXInLCAnZXJyb3InLCAnZm9jdXMnLCAnbG9hZCcsICdyZXNpemUnLCAnc2Nyb2xsJywgJ21lc3NhZ2VlcnJvciddO1xuY29uc3QgbWFycXVlZUV2ZW50TmFtZXMgPSBbJ2JvdW5jZScsICdmaW5pc2gnLCAnc3RhcnQnXTtcblxuY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudE5hbWVzID0gW1xuICAnbG9hZHN0YXJ0JywgJ3Byb2dyZXNzJywgJ2Fib3J0JywgJ2Vycm9yJywgJ2xvYWQnLCAncHJvZ3Jlc3MnLCAndGltZW91dCcsICdsb2FkZW5kJyxcbiAgJ3JlYWR5c3RhdGVjaGFuZ2UnXG5dO1xuY29uc3QgSURCSW5kZXhFdmVudE5hbWVzID1cbiAgICBbJ3VwZ3JhZGVuZWVkZWQnLCAnY29tcGxldGUnLCAnYWJvcnQnLCAnc3VjY2VzcycsICdlcnJvcicsICdibG9ja2VkJywgJ3ZlcnNpb25jaGFuZ2UnLCAnY2xvc2UnXTtcbmNvbnN0IHdlYnNvY2tldEV2ZW50TmFtZXMgPSBbJ2Nsb3NlJywgJ2Vycm9yJywgJ29wZW4nLCAnbWVzc2FnZSddO1xuY29uc3Qgd29ya2VyRXZlbnROYW1lcyA9IFsnZXJyb3InLCAnbWVzc2FnZSddO1xuXG5leHBvcnQgY29uc3QgZXZlbnROYW1lcyA9IGdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE5hbWVzLmNvbmNhdChcbiAgICB3ZWJnbEV2ZW50TmFtZXMsIGZvcm1FdmVudE5hbWVzLCBkZXRhaWxFdmVudE5hbWVzLCBkb2N1bWVudEV2ZW50TmFtZXMsIHdpbmRvd0V2ZW50TmFtZXMsXG4gICAgaHRtbEVsZW1lbnRFdmVudE5hbWVzLCBpZUVsZW1lbnRFdmVudE5hbWVzKTtcblxuZXhwb3J0IGludGVyZmFjZSBJZ25vcmVQcm9wZXJ0eSB7XG4gIHRhcmdldDogYW55O1xuICBpZ25vcmVQcm9wZXJ0aWVzOiBzdHJpbmdbXTtcbn1cblxuZnVuY3Rpb24gZmlsdGVyUHJvcGVydGllcyhcbiAgICB0YXJnZXQ6IGFueSwgb25Qcm9wZXJ0aWVzOiBzdHJpbmdbXSwgaWdub3JlUHJvcGVydGllczogSWdub3JlUHJvcGVydHlbXSk6IHN0cmluZ1tdIHtcbiAgaWYgKCFpZ25vcmVQcm9wZXJ0aWVzIHx8IGlnbm9yZVByb3BlcnRpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9uUHJvcGVydGllcztcbiAgfVxuXG4gIGNvbnN0IHRpcDogSWdub3JlUHJvcGVydHlbXSA9IGlnbm9yZVByb3BlcnRpZXMuZmlsdGVyKGlwID0+IGlwLnRhcmdldCA9PT0gdGFyZ2V0KTtcbiAgaWYgKCF0aXAgfHwgdGlwLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvblByb3BlcnRpZXM7XG4gIH1cblxuICBjb25zdCB0YXJnZXRJZ25vcmVQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IHRpcFswXS5pZ25vcmVQcm9wZXJ0aWVzO1xuICByZXR1cm4gb25Qcm9wZXJ0aWVzLmZpbHRlcihvcCA9PiB0YXJnZXRJZ25vcmVQcm9wZXJ0aWVzLmluZGV4T2Yob3ApID09PSAtMSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICB0YXJnZXQ6IGFueSwgb25Qcm9wZXJ0aWVzOiBzdHJpbmdbXSwgaWdub3JlUHJvcGVydGllczogSWdub3JlUHJvcGVydHlbXSwgcHJvdG90eXBlPzogYW55KSB7XG4gIC8vIGNoZWNrIHdoZXRoZXIgdGFyZ2V0IGlzIGF2YWlsYWJsZSwgc29tZXRpbWVzIHRhcmdldCB3aWxsIGJlIHVuZGVmaW5lZFxuICAvLyBiZWNhdXNlIGRpZmZlcmVudCBicm93c2VyIG9yIHNvbWUgM3JkIHBhcnR5IHBsdWdpbi5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc3QgZmlsdGVyZWRQcm9wZXJ0aWVzOiBzdHJpbmdbXSA9IGZpbHRlclByb3BlcnRpZXModGFyZ2V0LCBvblByb3BlcnRpZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICBwYXRjaE9uUHJvcGVydGllcyh0YXJnZXQsIGZpbHRlcmVkUHJvcGVydGllcywgcHJvdG90eXBlKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHByb3BlcnR5RGVzY3JpcHRvclBhdGNoKGFwaTogX1pvbmVQcml2YXRlLCBfZ2xvYmFsOiBhbnkpIHtcbiAgaWYgKGlzTm9kZSAmJiAhaXNNaXgpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCBzdXBwb3J0c1dlYlNvY2tldCA9IHR5cGVvZiBXZWJTb2NrZXQgIT09ICd1bmRlZmluZWQnO1xuICBpZiAoY2FuUGF0Y2hWaWFQcm9wZXJ0eURlc2NyaXB0b3IoKSkge1xuICAgIGNvbnN0IGlnbm9yZVByb3BlcnRpZXM6IElnbm9yZVByb3BlcnR5W10gPSBfZ2xvYmFsWydfX1pvbmVfaWdub3JlX29uX3Byb3BlcnRpZXMnXTtcbiAgICAvLyBmb3IgYnJvd3NlcnMgdGhhdCB3ZSBjYW4gcGF0Y2ggdGhlIGRlc2NyaXB0b3I6ICBDaHJvbWUgJiBGaXJlZm94XG4gICAgaWYgKGlzQnJvd3Nlcikge1xuICAgICAgY29uc3QgaW50ZXJuYWxXaW5kb3c6IGFueSA9IHdpbmRvdztcbiAgICAgIGNvbnN0IGlnbm9yZUVycm9yUHJvcGVydGllcyA9XG4gICAgICAgICAgaXNJRSA/IFt7dGFyZ2V0OiBpbnRlcm5hbFdpbmRvdywgaWdub3JlUHJvcGVydGllczogWydlcnJvciddfV0gOiBbXTtcbiAgICAgIC8vIGluIElFL0VkZ2UsIG9uUHJvcCBub3QgZXhpc3QgaW4gd2luZG93IG9iamVjdCwgYnV0IGluIFdpbmRvd1Byb3RvdHlwZVxuICAgICAgLy8gc28gd2UgbmVlZCB0byBwYXNzIFdpbmRvd1Byb3RvdHlwZSB0byBjaGVjayBvblByb3AgZXhpc3Qgb3Igbm90XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICAgICAgICBpbnRlcm5hbFdpbmRvdywgZXZlbnROYW1lcy5jb25jYXQoWydtZXNzYWdlZXJyb3InXSksXG4gICAgICAgICAgaWdub3JlUHJvcGVydGllcyA/IGlnbm9yZVByb3BlcnRpZXMuY29uY2F0KGlnbm9yZUVycm9yUHJvcGVydGllcykgOiBpZ25vcmVQcm9wZXJ0aWVzLFxuICAgICAgICAgIE9iamVjdEdldFByb3RvdHlwZU9mKGludGVybmFsV2luZG93KSk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhEb2N1bWVudC5wcm90b3R5cGUsIGV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuXG4gICAgICBpZiAodHlwZW9mIGludGVybmFsV2luZG93WydTVkdFbGVtZW50J10gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgICAgICAgICAgaW50ZXJuYWxXaW5kb3dbJ1NWR0VsZW1lbnQnXS5wcm90b3R5cGUsIGV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoRWxlbWVudC5wcm90b3R5cGUsIGV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSFRNTEVsZW1lbnQucHJvdG90eXBlLCBldmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEhUTUxNZWRpYUVsZW1lbnQucHJvdG90eXBlLCBtZWRpYUVsZW1lbnRFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgICAgICAgIEhUTUxGcmFtZVNldEVsZW1lbnQucHJvdG90eXBlLCB3aW5kb3dFdmVudE5hbWVzLmNvbmNhdChmcmFtZVNldEV2ZW50TmFtZXMpLFxuICAgICAgICAgIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgSFRNTEJvZHlFbGVtZW50LnByb3RvdHlwZSwgd2luZG93RXZlbnROYW1lcy5jb25jYXQoZnJhbWVTZXRFdmVudE5hbWVzKSwgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhIVE1MRnJhbWVFbGVtZW50LnByb3RvdHlwZSwgZnJhbWVFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEhUTUxJRnJhbWVFbGVtZW50LnByb3RvdHlwZSwgZnJhbWVFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcblxuICAgICAgY29uc3QgSFRNTE1hcnF1ZWVFbGVtZW50ID0gaW50ZXJuYWxXaW5kb3dbJ0hUTUxNYXJxdWVlRWxlbWVudCddO1xuICAgICAgaWYgKEhUTUxNYXJxdWVlRWxlbWVudCkge1xuICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhIVE1MTWFycXVlZUVsZW1lbnQucHJvdG90eXBlLCBtYXJxdWVlRXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgICBjb25zdCBXb3JrZXIgPSBpbnRlcm5hbFdpbmRvd1snV29ya2VyJ107XG4gICAgICBpZiAoV29ya2VyKSB7XG4gICAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFdvcmtlci5wcm90b3R5cGUsIHdvcmtlckV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgIH1cbiAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUsIFhNTEh0dHBSZXF1ZXN0RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgY29uc3QgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCA9IF9nbG9iYWxbJ1hNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQnXTtcbiAgICBpZiAoWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCkge1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCAmJiBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0LnByb3RvdHlwZSxcbiAgICAgICAgICBYTUxIdHRwUmVxdWVzdEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIElEQkluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCSW5kZXgucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCUmVxdWVzdC5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJPcGVuREJSZXF1ZXN0LnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQkRhdGFiYXNlLnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQlRyYW5zYWN0aW9uLnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQkN1cnNvci5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgfVxuICAgIGlmIChzdXBwb3J0c1dlYlNvY2tldCkge1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoV2ViU29ja2V0LnByb3RvdHlwZSwgd2Vic29ja2V0RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIFNhZmFyaSwgQW5kcm9pZCBicm93c2VycyAoSmVsbHkgQmVhbilcbiAgICBwYXRjaFZpYUNhcHR1cmluZ0FsbFRoZUV2ZW50cygpO1xuICAgIHBhdGNoQ2xhc3MoJ1hNTEh0dHBSZXF1ZXN0Jyk7XG4gICAgaWYgKHN1cHBvcnRzV2ViU29ja2V0KSB7XG4gICAgICB3ZWJTb2NrZXRQYXRjaC5hcHBseShhcGksIF9nbG9iYWwpO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBjYW5QYXRjaFZpYVByb3BlcnR5RGVzY3JpcHRvcigpIHtcbiAgaWYgKChpc0Jyb3dzZXIgfHwgaXNNaXgpICYmICFPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoSFRNTEVsZW1lbnQucHJvdG90eXBlLCAnb25jbGljaycpICYmXG4gICAgICB0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAvLyBXZWJLaXQgaHR0cHM6Ly9idWdzLndlYmtpdC5vcmcvc2hvd19idWcuY2dpP2lkPTEzNDM2NFxuICAgIC8vIElETCBpbnRlcmZhY2UgYXR0cmlidXRlcyBhcmUgbm90IGNvbmZpZ3VyYWJsZVxuICAgIGNvbnN0IGRlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoRWxlbWVudC5wcm90b3R5cGUsICdvbmNsaWNrJyk7XG4gICAgaWYgKGRlc2MgJiYgIWRlc2MuY29uZmlndXJhYmxlKSByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBjb25zdCBPTl9SRUFEWV9TVEFURV9DSEFOR0UgPSAnb25yZWFkeXN0YXRlY2hhbmdlJztcbiAgY29uc3QgWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUgPSBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGU7XG5cbiAgY29uc3QgeGhyRGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgT05fUkVBRFlfU1RBVEVfQ0hBTkdFKTtcblxuICAvLyBhZGQgZW51bWVyYWJsZSBhbmQgY29uZmlndXJhYmxlIGhlcmUgYmVjYXVzZSBpbiBvcGVyYVxuICAvLyBieSBkZWZhdWx0IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vbnJlYWR5c3RhdGVjaGFuZ2UgaXMgdW5kZWZpbmVkXG4gIC8vIHdpdGhvdXQgYWRkaW5nIGVudW1lcmFibGUgYW5kIGNvbmZpZ3VyYWJsZSB3aWxsIGNhdXNlIG9ucmVhZHlzdGF0ZWNoYW5nZVxuICAvLyBub24tY29uZmlndXJhYmxlXG4gIC8vIGFuZCBpZiBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub25yZWFkeXN0YXRlY2hhbmdlIGlzIHVuZGVmaW5lZCxcbiAgLy8gd2Ugc2hvdWxkIHNldCBhIHJlYWwgZGVzYyBpbnN0ZWFkIGEgZmFrZSBvbmVcbiAgaWYgKHhockRlc2MpIHtcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgT05fUkVBRFlfU1RBVEVfQ0hBTkdFLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgY29uc3QgcmVzdWx0ID0gISFyZXEub25yZWFkeXN0YXRlY2hhbmdlO1xuICAgIC8vIHJlc3RvcmUgb3JpZ2luYWwgZGVzY1xuICAgIE9iamVjdERlZmluZVByb3BlcnR5KFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCBPTl9SRUFEWV9TVEFURV9DSEFOR0UsIHhockRlc2MgfHwge30pO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgU1lNQk9MX0ZBS0VfT05SRUFEWVNUQVRFQ0hBTkdFID0gem9uZVN5bWJvbCgnZmFrZScpO1xuICAgIE9iamVjdERlZmluZVByb3BlcnR5KFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCBPTl9SRUFEWV9TVEFURV9DSEFOR0UsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpc1tTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgdGhpc1tTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgcmVxID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgY29uc3QgZGV0ZWN0RnVuYyA9ICgpID0+IHt9O1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBkZXRlY3RGdW5jO1xuICAgIGNvbnN0IHJlc3VsdCA9IChyZXEgYXMgYW55KVtTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0VdID09PSBkZXRlY3RGdW5jO1xuICAgIHJlcS5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBudWxsIGFzIGFueTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9XG59XG5cbmNvbnN0IHVuYm91bmRLZXkgPSB6b25lU3ltYm9sKCd1bmJvdW5kJyk7XG5cbi8vIFdoZW5ldmVyIGFueSBldmVudExpc3RlbmVyIGZpcmVzLCB3ZSBjaGVjayB0aGUgZXZlbnRMaXN0ZW5lciB0YXJnZXQgYW5kIGFsbCBwYXJlbnRzXG4vLyBmb3IgYG9ud2hhdGV2ZXJgIHByb3BlcnRpZXMgYW5kIHJlcGxhY2UgdGhlbSB3aXRoIHpvbmUtYm91bmQgZnVuY3Rpb25zXG4vLyAtIENocm9tZSAoZm9yIG5vdylcbmZ1bmN0aW9uIHBhdGNoVmlhQ2FwdHVyaW5nQWxsVGhlRXZlbnRzKCkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGV2ZW50TmFtZXMubGVuZ3RoOyBpKyspIHtcbiAgICBjb25zdCBwcm9wZXJ0eSA9IGV2ZW50TmFtZXNbaV07XG4gICAgY29uc3Qgb25wcm9wZXJ0eSA9ICdvbicgKyBwcm9wZXJ0eTtcbiAgICBzZWxmLmFkZEV2ZW50TGlzdGVuZXIocHJvcGVydHksIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICBsZXQgZWx0OiBhbnkgPSA8Tm9kZT5ldmVudC50YXJnZXQsIGJvdW5kLCBzb3VyY2U7XG4gICAgICBpZiAoZWx0KSB7XG4gICAgICAgIHNvdXJjZSA9IGVsdC5jb25zdHJ1Y3RvclsnbmFtZSddICsgJy4nICsgb25wcm9wZXJ0eTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNvdXJjZSA9ICd1bmtub3duLicgKyBvbnByb3BlcnR5O1xuICAgICAgfVxuICAgICAgd2hpbGUgKGVsdCkge1xuICAgICAgICBpZiAoZWx0W29ucHJvcGVydHldICYmICFlbHRbb25wcm9wZXJ0eV1bdW5ib3VuZEtleV0pIHtcbiAgICAgICAgICBib3VuZCA9IHdyYXBXaXRoQ3VycmVudFpvbmUoZWx0W29ucHJvcGVydHldLCBzb3VyY2UpO1xuICAgICAgICAgIGJvdW5kW3VuYm91bmRLZXldID0gZWx0W29ucHJvcGVydHldO1xuICAgICAgICAgIGVsdFtvbnByb3BlcnR5XSA9IGJvdW5kO1xuICAgICAgICB9XG4gICAgICAgIGVsdCA9IGVsdC5wYXJlbnRFbGVtZW50O1xuICAgICAgfVxuICAgIH0sIHRydWUpO1xuICB9XG59XG4iXX0=