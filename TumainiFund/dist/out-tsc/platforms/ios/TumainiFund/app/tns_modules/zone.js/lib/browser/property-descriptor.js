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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktZGVzY3JpcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvcHJvcGVydHktZGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0g7OztHQUdHOztBQUVILHlDQUEyTTtBQUUzTSw0Q0FBOEM7QUFFOUMsSUFBTSw2QkFBNkIsR0FBRztJQUNwQyxPQUFPO0lBQ1AsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCxvQkFBb0I7SUFDcEIsVUFBVTtJQUNWLGFBQWE7SUFDYixNQUFNO0lBQ04sUUFBUTtJQUNSLFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsUUFBUTtJQUNSLGtCQUFrQjtJQUNsQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLFdBQVc7SUFDWCxPQUFPO0lBQ1AsT0FBTztJQUNQLGFBQWE7SUFDYixZQUFZO0lBQ1osVUFBVTtJQUNWLE1BQU07SUFDTixTQUFTO0lBQ1QsV0FBVztJQUNYLFVBQVU7SUFDVixXQUFXO0lBQ1gsVUFBVTtJQUNWLE1BQU07SUFDTixnQkFBZ0I7SUFDaEIsU0FBUztJQUNULE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFNBQVM7SUFDVCxVQUFVO0lBQ1YsbUJBQW1CO0lBQ25CLE9BQU87SUFDUCxTQUFTO0lBQ1QsU0FBUztJQUNULFVBQVU7SUFDVixPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLG9CQUFvQjtJQUNwQixXQUFXO0lBQ1gsWUFBWTtJQUNaLFlBQVk7SUFDWixXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxTQUFTO0lBQ1QsWUFBWTtJQUNaLG1CQUFtQjtJQUNuQixPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCxlQUFlO0lBQ2YsYUFBYTtJQUNiLGNBQWM7SUFDZCxjQUFjO0lBQ2QsbUJBQW1CO0lBQ25CLHNCQUFzQjtJQUN0QiwyQkFBMkI7SUFDM0Isa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQix3QkFBd0I7SUFDeEIsYUFBYTtJQUNiLFVBQVU7SUFDVixhQUFhO0lBQ2IsV0FBVztJQUNYLFVBQVU7SUFDVixZQUFZO0lBQ1osT0FBTztJQUNQLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFNBQVM7SUFDVCxRQUFRO0lBQ1IsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixNQUFNO0lBQ04sTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsU0FBUztJQUNULFlBQVk7SUFDWixjQUFjO0lBQ2QsYUFBYTtJQUNiLFdBQVc7SUFDWCxZQUFZO0lBQ1osVUFBVTtJQUNWLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2YsU0FBUztJQUNULE9BQU87Q0FDUixDQUFDO0FBQ0YsSUFBTSxrQkFBa0IsR0FBRztJQUN6QixvQkFBb0IsRUFBRSxxQkFBcUIsRUFBRSxrQkFBa0IsRUFBRSxRQUFRLEVBQUUsa0JBQWtCO0lBQzdGLHFCQUFxQixFQUFFLHdCQUF3QixFQUFFLG9CQUFvQixFQUFFLGlCQUFpQjtJQUN4RixvQkFBb0IsRUFBRSx1QkFBdUIsRUFBRSxtQkFBbUIsRUFBRSxrQkFBa0I7SUFDdEYsa0JBQWtCLEVBQUUsUUFBUTtDQUM3QixDQUFDO0FBQ0YsSUFBTSxnQkFBZ0IsR0FBRztJQUN2QiwyQkFBMkI7SUFDM0IsWUFBWTtJQUNaLFlBQVk7SUFDWixjQUFjO0lBQ2QscUJBQXFCO0lBQ3JCLGFBQWE7SUFDYixjQUFjO0lBQ2QsYUFBYTtJQUNiLGNBQWM7SUFDZCxtQkFBbUI7SUFDbkIsMkJBQTJCO0lBQzNCLGlCQUFpQjtJQUNqQixZQUFZO0lBQ1osZ0JBQWdCO0lBQ2hCLFNBQVM7SUFDVCxnQkFBZ0I7SUFDaEIsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO0lBQ1AsVUFBVTtJQUNWLFVBQVU7SUFDVixVQUFVO0lBQ1Ysa0JBQWtCO0lBQ2xCLFNBQVM7SUFDVCxvQkFBb0I7SUFDcEIsUUFBUTtJQUNSLGVBQWU7SUFDZixtQkFBbUI7SUFDbkIsdUJBQXVCO0lBQ3ZCLHdCQUF3QjtDQUN6QixDQUFDO0FBQ0YsSUFBTSxxQkFBcUIsR0FBRztJQUM1QixZQUFZLEVBQUUsV0FBVyxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxXQUFXLEVBQUUsU0FBUztJQUN4RixnQkFBZ0IsRUFBRSxRQUFRLEVBQUUsZUFBZSxFQUFFLGlCQUFpQixFQUFFLG9CQUFvQjtJQUNwRiwwQkFBMEIsRUFBRSxzQkFBc0IsRUFBRSxxQkFBcUI7Q0FDMUUsQ0FBQztBQUNGLElBQU0sc0JBQXNCLEdBQ3hCLENBQUMsV0FBVyxFQUFFLGVBQWUsRUFBRSxXQUFXLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztBQUN4RixJQUFNLG1CQUFtQixHQUFHO0lBQzFCLFVBQVU7SUFDVixhQUFhO0lBQ2IsYUFBYTtJQUNiLGdCQUFnQjtJQUNoQixrQkFBa0I7SUFDbEIsaUJBQWlCO0lBQ2pCLGNBQWM7SUFDZCxZQUFZO0lBQ1osZUFBZTtJQUNmLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsaUJBQWlCO0lBQ2pCLGFBQWE7SUFDYixjQUFjO0lBQ2QsZ0JBQWdCO0lBQ2hCLGFBQWE7SUFDYixNQUFNO0lBQ04sU0FBUztJQUNULFdBQVc7SUFDWCxnQkFBZ0I7SUFDaEIsV0FBVztJQUNYLGFBQWE7SUFDYixVQUFVO0lBQ1YsU0FBUztJQUNULFlBQVk7SUFDWixjQUFjO0lBQ2QsU0FBUztJQUNULHlCQUF5QjtJQUN6QixZQUFZO0lBQ1osTUFBTTtJQUNOLGVBQWU7SUFDZiw0QkFBNEI7SUFDNUIsaUJBQWlCO0lBQ2pCLG9CQUFvQjtJQUNwQixjQUFjO0lBQ2QsZUFBZTtJQUNmLGdCQUFnQjtJQUNoQixjQUFjO0lBQ2QscUJBQXFCO0lBQ3JCLGdCQUFnQjtJQUNoQixzQkFBc0I7SUFDdEIsaUJBQWlCO0lBQ2pCLGVBQWU7SUFDZixnQkFBZ0I7SUFDaEIsZ0JBQWdCO0lBQ2hCLGdCQUFnQjtJQUNoQixlQUFlO0lBQ2YsY0FBYztJQUNkLGVBQWU7SUFDZixhQUFhO0lBQ2IsWUFBWTtJQUNaLCtCQUErQjtJQUMvQixrQkFBa0I7SUFDbEIsTUFBTTtJQUNOLGVBQWU7Q0FDaEIsQ0FBQztBQUNGLElBQU0sZUFBZSxHQUFHLENBQUMsc0JBQXNCLEVBQUUsa0JBQWtCLEVBQUUsMkJBQTJCLENBQUMsQ0FBQztBQUNsRyxJQUFNLGNBQWMsR0FBRyxDQUFDLGNBQWMsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBQzdELElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxJQUFNLGVBQWUsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2pDLElBQU0sa0JBQWtCLEdBQUcsQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxjQUFjLENBQUMsQ0FBQztBQUNsRyxJQUFNLGlCQUFpQixHQUFHLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztBQUV4RCxJQUFNLHdCQUF3QixHQUFHO0lBQy9CLFdBQVcsRUFBRSxVQUFVLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLFNBQVMsRUFBRSxTQUFTO0lBQ25GLGtCQUFrQjtDQUNuQixDQUFDO0FBQ0YsSUFBTSxrQkFBa0IsR0FDcEIsQ0FBQyxlQUFlLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsT0FBTyxDQUFDLENBQUM7QUFDcEcsSUFBTSxtQkFBbUIsR0FBRyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQ2xFLElBQU0sZ0JBQWdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLENBQUM7QUFFakMsUUFBQSxVQUFVLEdBQUcsNkJBQTZCLENBQUMsTUFBTSxDQUMxRCxlQUFlLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixFQUN2RixxQkFBcUIsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO0FBT2hELFNBQVMsZ0JBQWdCLENBQ3JCLE1BQVcsRUFBRSxZQUFzQixFQUFFLGdCQUFrQztJQUN6RSxJQUFJLENBQUMsZ0JBQWdCLElBQUksZ0JBQWdCLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtRQUN0RCxPQUFPLFlBQVksQ0FBQztLQUNyQjtJQUVELElBQU0sR0FBRyxHQUFxQixnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxFQUFFLENBQUMsTUFBTSxLQUFLLE1BQU0sRUFBcEIsQ0FBb0IsQ0FBQyxDQUFDO0lBQ2xGLElBQUksQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7UUFDNUIsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFFRCxJQUFNLHNCQUFzQixHQUFhLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQztJQUNqRSxPQUFPLFlBQVksQ0FBQyxNQUFNLENBQUMsVUFBQSxFQUFFLElBQUksT0FBQSxzQkFBc0IsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQXpDLENBQXlDLENBQUMsQ0FBQztBQUM5RSxDQUFDO0FBRUQsU0FBZ0IsdUJBQXVCLENBQ25DLE1BQVcsRUFBRSxZQUFzQixFQUFFLGdCQUFrQyxFQUFFLFNBQWU7SUFDMUYsd0VBQXdFO0lBQ3hFLHNEQUFzRDtJQUN0RCxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsT0FBTztLQUNSO0lBQ0QsSUFBTSxrQkFBa0IsR0FBYSxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDOUYseUJBQWlCLENBQUMsTUFBTSxFQUFFLGtCQUFrQixFQUFFLFNBQVMsQ0FBQyxDQUFDO0FBQzNELENBQUM7QUFURCwwREFTQztBQUVELFNBQWdCLHVCQUF1QixDQUFDLEdBQWlCLEVBQUUsT0FBWTtJQUNyRSxJQUFJLGNBQU0sSUFBSSxDQUFDLGFBQUssRUFBRTtRQUNwQixPQUFPO0tBQ1I7SUFFRCxJQUFNLGlCQUFpQixHQUFHLE9BQU8sU0FBUyxLQUFLLFdBQVcsQ0FBQztJQUMzRCxJQUFJLDZCQUE2QixFQUFFLEVBQUU7UUFDbkMsSUFBTSxnQkFBZ0IsR0FBcUIsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7UUFDbEYsbUVBQW1FO1FBQ25FLElBQUksaUJBQVMsRUFBRTtZQUNiLElBQU0sY0FBYyxHQUFRLE1BQU0sQ0FBQztZQUNuQyxJQUFNLHFCQUFxQixHQUN2QixZQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBQyxNQUFNLEVBQUUsY0FBYyxFQUFFLGdCQUFnQixFQUFFLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDeEUsd0VBQXdFO1lBQ3hFLGtFQUFrRTtZQUNsRSx1QkFBdUIsQ0FDbkIsY0FBYyxFQUFFLGtCQUFVLENBQUMsTUFBTSxDQUFDLENBQUMsY0FBYyxDQUFDLENBQUMsRUFDbkQsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxnQkFBZ0IsRUFDcEYsNEJBQW9CLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztZQUMxQyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLGtCQUFVLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUUxRSxJQUFJLE9BQU8sY0FBYyxDQUFDLFlBQVksQ0FBQyxLQUFLLFdBQVcsRUFBRTtnQkFDdkQsdUJBQXVCLENBQ25CLGNBQWMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLEVBQUUsa0JBQVUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO2FBQzNFO1lBQ0QsdUJBQXVCLENBQUMsT0FBTyxDQUFDLFNBQVMsRUFBRSxrQkFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDekUsdUJBQXVCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxrQkFBVSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDN0UsdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLHNCQUFzQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDOUYsdUJBQXVCLENBQ25CLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsRUFDMUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN0Qix1QkFBdUIsQ0FDbkIsZUFBZSxDQUFDLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsa0JBQWtCLENBQUMsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQzlGLHVCQUF1QixDQUFDLGdCQUFnQixDQUFDLFNBQVMsRUFBRSxlQUFlLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN2Rix1QkFBdUIsQ0FBQyxpQkFBaUIsQ0FBQyxTQUFTLEVBQUUsZUFBZSxFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFFeEYsSUFBTSxvQkFBa0IsR0FBRyxjQUFjLENBQUMsb0JBQW9CLENBQUMsQ0FBQztZQUNoRSxJQUFJLG9CQUFrQixFQUFFO2dCQUN0Qix1QkFBdUIsQ0FBQyxvQkFBa0IsQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQzthQUM1RjtZQUNELElBQU0sUUFBTSxHQUFHLGNBQWMsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN4QyxJQUFJLFFBQU0sRUFBRTtnQkFDVix1QkFBdUIsQ0FBQyxRQUFNLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7YUFDL0U7U0FDRjtRQUNELHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUM5RixJQUFNLDJCQUF5QixHQUFHLE9BQU8sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksMkJBQXlCLEVBQUU7WUFDN0IsdUJBQXVCLENBQ25CLDJCQUF5QixJQUFJLDJCQUF5QixDQUFDLFNBQVMsRUFDaEUsd0JBQXdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUNqRDtRQUNELElBQUksT0FBTyxRQUFRLEtBQUssV0FBVyxFQUFFO1lBQ25DLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUNsRix1QkFBdUIsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDcEYsdUJBQXVCLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7WUFDMUYsdUJBQXVCLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDO1lBQ3JGLHVCQUF1QixDQUFDLGNBQWMsQ0FBQyxTQUFTLEVBQUUsa0JBQWtCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUN4Rix1QkFBdUIsQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLGtCQUFrQixFQUFFLGdCQUFnQixDQUFDLENBQUM7U0FDcEY7UUFDRCxJQUFJLGlCQUFpQixFQUFFO1lBQ3JCLHVCQUF1QixDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztTQUNyRjtLQUNGO1NBQU07UUFDTCx3Q0FBd0M7UUFDeEMsNkJBQTZCLEVBQUUsQ0FBQztRQUNoQyxrQkFBVSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFDN0IsSUFBSSxpQkFBaUIsRUFBRTtZQUNyQixjQUFjLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUNwQztLQUNGO0FBQ0gsQ0FBQztBQXZFRCwwREF1RUM7QUFFRCxTQUFTLDZCQUE2QjtJQUNwQyxJQUFJLENBQUMsaUJBQVMsSUFBSSxhQUFLLENBQUMsSUFBSSxDQUFDLHNDQUE4QixDQUFDLFdBQVcsQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDO1FBQ3pGLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtRQUNsQyx3REFBd0Q7UUFDeEQsZ0RBQWdEO1FBQ2hELElBQU0sSUFBSSxHQUFHLHNDQUE4QixDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDMUUsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWTtZQUFFLE9BQU8sS0FBSyxDQUFDO0tBQzlDO0lBRUQsSUFBTSxxQkFBcUIsR0FBRyxvQkFBb0IsQ0FBQztJQUNuRCxJQUFNLHVCQUF1QixHQUFHLGNBQWMsQ0FBQyxTQUFTLENBQUM7SUFFekQsSUFBTSxPQUFPLEdBQUcsc0NBQThCLENBQUMsdUJBQXVCLEVBQUUscUJBQXFCLENBQUMsQ0FBQztJQUUvRix3REFBd0Q7SUFDeEQsc0VBQXNFO0lBQ3RFLDJFQUEyRTtJQUMzRSxtQkFBbUI7SUFDbkIsbUVBQW1FO0lBQ25FLCtDQUErQztJQUMvQyxJQUFJLE9BQU8sRUFBRTtRQUNYLDRCQUFvQixDQUFDLHVCQUF1QixFQUFFLHFCQUFxQixFQUFFO1lBQ25FLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLEdBQUcsRUFBRTtnQkFDSCxPQUFPLElBQUksQ0FBQztZQUNkLENBQUM7U0FDRixDQUFDLENBQUM7UUFDSCxJQUFNLEdBQUcsR0FBRyxJQUFJLGNBQWMsRUFBRSxDQUFDO1FBQ2pDLElBQU0sTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7UUFDeEMsd0JBQXdCO1FBQ3hCLDRCQUFvQixDQUFDLHVCQUF1QixFQUFFLHFCQUFxQixFQUFFLE9BQU8sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUNwRixPQUFPLE1BQU0sQ0FBQztLQUNmO1NBQU07UUFDTCxJQUFNLGdDQUE4QixHQUFHLGtCQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDMUQsNEJBQW9CLENBQUMsdUJBQXVCLEVBQUUscUJBQXFCLEVBQUU7WUFDbkUsVUFBVSxFQUFFLElBQUk7WUFDaEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsR0FBRyxFQUFFO2dCQUNILE9BQU8sSUFBSSxDQUFDLGdDQUE4QixDQUFDLENBQUM7WUFDOUMsQ0FBQztZQUNELEdBQUcsRUFBRSxVQUFTLEtBQUs7Z0JBQ2pCLElBQUksQ0FBQyxnQ0FBOEIsQ0FBQyxHQUFHLEtBQUssQ0FBQztZQUMvQyxDQUFDO1NBQ0YsQ0FBQyxDQUFDO1FBQ0gsSUFBTSxHQUFHLEdBQUcsSUFBSSxjQUFjLEVBQUUsQ0FBQztRQUNqQyxJQUFNLFVBQVUsR0FBRyxjQUFPLENBQUMsQ0FBQztRQUM1QixHQUFHLENBQUMsa0JBQWtCLEdBQUcsVUFBVSxDQUFDO1FBQ3BDLElBQU0sTUFBTSxHQUFJLEdBQVcsQ0FBQyxnQ0FBOEIsQ0FBQyxLQUFLLFVBQVUsQ0FBQztRQUMzRSxHQUFHLENBQUMsa0JBQWtCLEdBQUcsSUFBVyxDQUFDO1FBQ3JDLE9BQU8sTUFBTSxDQUFDO0tBQ2Y7QUFDSCxDQUFDO0FBRUQsSUFBTSxVQUFVLEdBQUcsa0JBQVUsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUV6QyxzRkFBc0Y7QUFDdEYseUVBQXlFO0FBQ3pFLHFCQUFxQjtBQUNyQixTQUFTLDZCQUE2Qjs0QkFDM0IsQ0FBQztRQUNSLElBQU0sUUFBUSxHQUFHLGtCQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBTSxVQUFVLEdBQUcsSUFBSSxHQUFHLFFBQVEsQ0FBQztRQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsUUFBUSxFQUFFLFVBQVMsS0FBSztZQUM1QyxJQUFJLEdBQUcsR0FBYyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLENBQUM7WUFDakQsSUFBSSxHQUFHLEVBQUU7Z0JBQ1AsTUFBTSxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxHQUFHLFVBQVUsQ0FBQzthQUNyRDtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsVUFBVSxHQUFHLFVBQVUsQ0FBQzthQUNsQztZQUNELE9BQU8sR0FBRyxFQUFFO2dCQUNWLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUNuRCxLQUFLLEdBQUcsMkJBQW1CLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDO29CQUNyRCxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO29CQUNwQyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsS0FBSyxDQUFDO2lCQUN6QjtnQkFDRCxHQUFHLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQzthQUN6QjtRQUNILENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNYLENBQUM7SUFuQkQsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGtCQUFVLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRTtnQkFBakMsQ0FBQztLQW1CVDtBQUNILENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vKipcbiAqIEBmaWxlb3ZlcnZpZXdcbiAqIEBzdXBwcmVzcyB7Z2xvYmFsVGhpc31cbiAqL1xuXG5pbXBvcnQge2lzQnJvd3NlciwgaXNJRSwgaXNNaXgsIGlzTm9kZSwgT2JqZWN0RGVmaW5lUHJvcGVydHksIE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvciwgT2JqZWN0R2V0UHJvdG90eXBlT2YsIHBhdGNoQ2xhc3MsIHBhdGNoT25Qcm9wZXJ0aWVzLCB3cmFwV2l0aEN1cnJlbnRab25lLCB6b25lU3ltYm9sfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5pbXBvcnQgKiBhcyB3ZWJTb2NrZXRQYXRjaCBmcm9tICcuL3dlYnNvY2tldCc7XG5cbmNvbnN0IGdsb2JhbEV2ZW50SGFuZGxlcnNFdmVudE5hbWVzID0gW1xuICAnYWJvcnQnLFxuICAnYW5pbWF0aW9uY2FuY2VsJyxcbiAgJ2FuaW1hdGlvbmVuZCcsXG4gICdhbmltYXRpb25pdGVyYXRpb24nLFxuICAnYXV4Y2xpY2snLFxuICAnYmVmb3JlaW5wdXQnLFxuICAnYmx1cicsXG4gICdjYW5jZWwnLFxuICAnY2FucGxheScsXG4gICdjYW5wbGF5dGhyb3VnaCcsXG4gICdjaGFuZ2UnLFxuICAnY29tcG9zaXRpb25zdGFydCcsXG4gICdjb21wb3NpdGlvbnVwZGF0ZScsXG4gICdjb21wb3NpdGlvbmVuZCcsXG4gICdjdWVjaGFuZ2UnLFxuICAnY2xpY2snLFxuICAnY2xvc2UnLFxuICAnY29udGV4dG1lbnUnLFxuICAnY3VyZWNoYW5nZScsXG4gICdkYmxjbGljaycsXG4gICdkcmFnJyxcbiAgJ2RyYWdlbmQnLFxuICAnZHJhZ2VudGVyJyxcbiAgJ2RyYWdleGl0JyxcbiAgJ2RyYWdsZWF2ZScsXG4gICdkcmFnb3ZlcicsXG4gICdkcm9wJyxcbiAgJ2R1cmF0aW9uY2hhbmdlJyxcbiAgJ2VtcHRpZWQnLFxuICAnZW5kZWQnLFxuICAnZXJyb3InLFxuICAnZm9jdXMnLFxuICAnZm9jdXNpbicsXG4gICdmb2N1c291dCcsXG4gICdnb3Rwb2ludGVyY2FwdHVyZScsXG4gICdpbnB1dCcsXG4gICdpbnZhbGlkJyxcbiAgJ2tleWRvd24nLFxuICAna2V5cHJlc3MnLFxuICAna2V5dXAnLFxuICAnbG9hZCcsXG4gICdsb2Fkc3RhcnQnLFxuICAnbG9hZGVkZGF0YScsXG4gICdsb2FkZWRtZXRhZGF0YScsXG4gICdsb3N0cG9pbnRlcmNhcHR1cmUnLFxuICAnbW91c2Vkb3duJyxcbiAgJ21vdXNlZW50ZXInLFxuICAnbW91c2VsZWF2ZScsXG4gICdtb3VzZW1vdmUnLFxuICAnbW91c2VvdXQnLFxuICAnbW91c2VvdmVyJyxcbiAgJ21vdXNldXAnLFxuICAnbW91c2V3aGVlbCcsXG4gICdvcmllbnRhdGlvbmNoYW5nZScsXG4gICdwYXVzZScsXG4gICdwbGF5JyxcbiAgJ3BsYXlpbmcnLFxuICAncG9pbnRlcmNhbmNlbCcsXG4gICdwb2ludGVyZG93bicsXG4gICdwb2ludGVyZW50ZXInLFxuICAncG9pbnRlcmxlYXZlJyxcbiAgJ3BvaW50ZXJsb2NrY2hhbmdlJyxcbiAgJ21venBvaW50ZXJsb2NrY2hhbmdlJyxcbiAgJ3dlYmtpdHBvaW50ZXJsb2NrZXJjaGFuZ2UnLFxuICAncG9pbnRlcmxvY2tlcnJvcicsXG4gICdtb3pwb2ludGVybG9ja2Vycm9yJyxcbiAgJ3dlYmtpdHBvaW50ZXJsb2NrZXJyb3InLFxuICAncG9pbnRlcm1vdmUnLFxuICAncG9pbnRvdXQnLFxuICAncG9pbnRlcm92ZXInLFxuICAncG9pbnRlcnVwJyxcbiAgJ3Byb2dyZXNzJyxcbiAgJ3JhdGVjaGFuZ2UnLFxuICAncmVzZXQnLFxuICAncmVzaXplJyxcbiAgJ3Njcm9sbCcsXG4gICdzZWVrZWQnLFxuICAnc2Vla2luZycsXG4gICdzZWxlY3QnLFxuICAnc2VsZWN0aW9uY2hhbmdlJyxcbiAgJ3NlbGVjdHN0YXJ0JyxcbiAgJ3Nob3cnLFxuICAnc29ydCcsXG4gICdzdGFsbGVkJyxcbiAgJ3N1Ym1pdCcsXG4gICdzdXNwZW5kJyxcbiAgJ3RpbWV1cGRhdGUnLFxuICAndm9sdW1lY2hhbmdlJyxcbiAgJ3RvdWNoY2FuY2VsJyxcbiAgJ3RvdWNobW92ZScsXG4gICd0b3VjaHN0YXJ0JyxcbiAgJ3RvdWNoZW5kJyxcbiAgJ3RyYW5zaXRpb25jYW5jZWwnLFxuICAndHJhbnNpdGlvbmVuZCcsXG4gICd3YWl0aW5nJyxcbiAgJ3doZWVsJ1xuXTtcbmNvbnN0IGRvY3VtZW50RXZlbnROYW1lcyA9IFtcbiAgJ2FmdGVyc2NyaXB0ZXhlY3V0ZScsICdiZWZvcmVzY3JpcHRleGVjdXRlJywgJ0RPTUNvbnRlbnRMb2FkZWQnLCAnZnJlZXplJywgJ2Z1bGxzY3JlZW5jaGFuZ2UnLFxuICAnbW96ZnVsbHNjcmVlbmNoYW5nZScsICd3ZWJraXRmdWxsc2NyZWVuY2hhbmdlJywgJ21zZnVsbHNjcmVlbmNoYW5nZScsICdmdWxsc2NyZWVuZXJyb3InLFxuICAnbW96ZnVsbHNjcmVlbmVycm9yJywgJ3dlYmtpdGZ1bGxzY3JlZW5lcnJvcicsICdtc2Z1bGxzY3JlZW5lcnJvcicsICdyZWFkeXN0YXRlY2hhbmdlJyxcbiAgJ3Zpc2liaWxpdHljaGFuZ2UnLCAncmVzdW1lJ1xuXTtcbmNvbnN0IHdpbmRvd0V2ZW50TmFtZXMgPSBbXG4gICdhYnNvbHV0ZWRldmljZW9yaWVudGF0aW9uJyxcbiAgJ2FmdGVyaW5wdXQnLFxuICAnYWZ0ZXJwcmludCcsXG4gICdhcHBpbnN0YWxsZWQnLFxuICAnYmVmb3JlaW5zdGFsbHByb21wdCcsXG4gICdiZWZvcmVwcmludCcsXG4gICdiZWZvcmV1bmxvYWQnLFxuICAnZGV2aWNlbGlnaHQnLFxuICAnZGV2aWNlbW90aW9uJyxcbiAgJ2RldmljZW9yaWVudGF0aW9uJyxcbiAgJ2RldmljZW9yaWVudGF0aW9uYWJzb2x1dGUnLFxuICAnZGV2aWNlcHJveGltaXR5JyxcbiAgJ2hhc2hjaGFuZ2UnLFxuICAnbGFuZ3VhZ2VjaGFuZ2UnLFxuICAnbWVzc2FnZScsXG4gICdtb3piZWZvcmVwYWludCcsXG4gICdvZmZsaW5lJyxcbiAgJ29ubGluZScsXG4gICdwYWludCcsXG4gICdwYWdlc2hvdycsXG4gICdwYWdlaGlkZScsXG4gICdwb3BzdGF0ZScsXG4gICdyZWplY3Rpb25oYW5kbGVkJyxcbiAgJ3N0b3JhZ2UnLFxuICAndW5oYW5kbGVkcmVqZWN0aW9uJyxcbiAgJ3VubG9hZCcsXG4gICd1c2VycHJveGltaXR5JyxcbiAgJ3ZyZGlzcGx5Y29ubmVjdGVkJyxcbiAgJ3ZyZGlzcGxheWRpc2Nvbm5lY3RlZCcsXG4gICd2cmRpc3BsYXlwcmVzZW50Y2hhbmdlJ1xuXTtcbmNvbnN0IGh0bWxFbGVtZW50RXZlbnROYW1lcyA9IFtcbiAgJ2JlZm9yZWNvcHknLCAnYmVmb3JlY3V0JywgJ2JlZm9yZXBhc3RlJywgJ2NvcHknLCAnY3V0JywgJ3Bhc3RlJywgJ2RyYWdzdGFydCcsICdsb2FkZW5kJyxcbiAgJ2FuaW1hdGlvbnN0YXJ0JywgJ3NlYXJjaCcsICd0cmFuc2l0aW9ucnVuJywgJ3RyYW5zaXRpb25zdGFydCcsICd3ZWJraXRhbmltYXRpb25lbmQnLFxuICAnd2Via2l0YW5pbWF0aW9uaXRlcmF0aW9uJywgJ3dlYmtpdGFuaW1hdGlvbnN0YXJ0JywgJ3dlYmtpdHRyYW5zaXRpb25lbmQnXG5dO1xuY29uc3QgbWVkaWFFbGVtZW50RXZlbnROYW1lcyA9XG4gICAgWydlbmNyeXB0ZWQnLCAnd2FpdGluZ2ZvcmtleScsICdtc25lZWRrZXknLCAnbW96aW50ZXJydXB0YmVnaW4nLCAnbW96aW50ZXJydXB0ZW5kJ107XG5jb25zdCBpZUVsZW1lbnRFdmVudE5hbWVzID0gW1xuICAnYWN0aXZhdGUnLFxuICAnYWZ0ZXJ1cGRhdGUnLFxuICAnYXJpYXJlcXVlc3QnLFxuICAnYmVmb3JlYWN0aXZhdGUnLFxuICAnYmVmb3JlZGVhY3RpdmF0ZScsXG4gICdiZWZvcmVlZGl0Zm9jdXMnLFxuICAnYmVmb3JldXBkYXRlJyxcbiAgJ2NlbGxjaGFuZ2UnLFxuICAnY29udHJvbHNlbGVjdCcsXG4gICdkYXRhYXZhaWxhYmxlJyxcbiAgJ2RhdGFzZXRjaGFuZ2VkJyxcbiAgJ2RhdGFzZXRjb21wbGV0ZScsXG4gICdlcnJvcnVwZGF0ZScsXG4gICdmaWx0ZXJjaGFuZ2UnLFxuICAnbGF5b3V0Y29tcGxldGUnLFxuICAnbG9zZWNhcHR1cmUnLFxuICAnbW92ZScsXG4gICdtb3ZlZW5kJyxcbiAgJ21vdmVzdGFydCcsXG4gICdwcm9wZXJ0eWNoYW5nZScsXG4gICdyZXNpemVlbmQnLFxuICAncmVzaXplc3RhcnQnLFxuICAncm93ZW50ZXInLFxuICAncm93ZXhpdCcsXG4gICdyb3dzZGVsZXRlJyxcbiAgJ3Jvd3NpbnNlcnRlZCcsXG4gICdjb21tYW5kJyxcbiAgJ2NvbXBhc3NuZWVkc2NhbGlicmF0aW9uJyxcbiAgJ2RlYWN0aXZhdGUnLFxuICAnaGVscCcsXG4gICdtc2NvbnRlbnR6b29tJyxcbiAgJ21zbWFuaXB1bGF0aW9uc3RhdGVjaGFuZ2VkJyxcbiAgJ21zZ2VzdHVyZWNoYW5nZScsXG4gICdtc2dlc3R1cmVkb3VibGV0YXAnLFxuICAnbXNnZXN0dXJlZW5kJyxcbiAgJ21zZ2VzdHVyZWhvbGQnLFxuICAnbXNnZXN0dXJlc3RhcnQnLFxuICAnbXNnZXN0dXJldGFwJyxcbiAgJ21zZ290cG9pbnRlcmNhcHR1cmUnLFxuICAnbXNpbmVydGlhc3RhcnQnLFxuICAnbXNsb3N0cG9pbnRlcmNhcHR1cmUnLFxuICAnbXNwb2ludGVyY2FuY2VsJyxcbiAgJ21zcG9pbnRlcmRvd24nLFxuICAnbXNwb2ludGVyZW50ZXInLFxuICAnbXNwb2ludGVyaG92ZXInLFxuICAnbXNwb2ludGVybGVhdmUnLFxuICAnbXNwb2ludGVybW92ZScsXG4gICdtc3BvaW50ZXJvdXQnLFxuICAnbXNwb2ludGVyb3ZlcicsXG4gICdtc3BvaW50ZXJ1cCcsXG4gICdwb2ludGVyb3V0JyxcbiAgJ21zc2l0ZW1vZGVqdW1wbGlzdGl0ZW1yZW1vdmVkJyxcbiAgJ21zdGh1bWJuYWlsY2xpY2snLFxuICAnc3RvcCcsXG4gICdzdG9yYWdlY29tbWl0J1xuXTtcbmNvbnN0IHdlYmdsRXZlbnROYW1lcyA9IFsnd2ViZ2xjb250ZXh0cmVzdG9yZWQnLCAnd2ViZ2xjb250ZXh0bG9zdCcsICd3ZWJnbGNvbnRleHRjcmVhdGlvbmVycm9yJ107XG5jb25zdCBmb3JtRXZlbnROYW1lcyA9IFsnYXV0b2NvbXBsZXRlJywgJ2F1dG9jb21wbGV0ZWVycm9yJ107XG5jb25zdCBkZXRhaWxFdmVudE5hbWVzID0gWyd0b2dnbGUnXTtcbmNvbnN0IGZyYW1lRXZlbnROYW1lcyA9IFsnbG9hZCddO1xuY29uc3QgZnJhbWVTZXRFdmVudE5hbWVzID0gWydibHVyJywgJ2Vycm9yJywgJ2ZvY3VzJywgJ2xvYWQnLCAncmVzaXplJywgJ3Njcm9sbCcsICdtZXNzYWdlZXJyb3InXTtcbmNvbnN0IG1hcnF1ZWVFdmVudE5hbWVzID0gWydib3VuY2UnLCAnZmluaXNoJywgJ3N0YXJ0J107XG5cbmNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnROYW1lcyA9IFtcbiAgJ2xvYWRzdGFydCcsICdwcm9ncmVzcycsICdhYm9ydCcsICdlcnJvcicsICdsb2FkJywgJ3Byb2dyZXNzJywgJ3RpbWVvdXQnLCAnbG9hZGVuZCcsXG4gICdyZWFkeXN0YXRlY2hhbmdlJ1xuXTtcbmNvbnN0IElEQkluZGV4RXZlbnROYW1lcyA9XG4gICAgWyd1cGdyYWRlbmVlZGVkJywgJ2NvbXBsZXRlJywgJ2Fib3J0JywgJ3N1Y2Nlc3MnLCAnZXJyb3InLCAnYmxvY2tlZCcsICd2ZXJzaW9uY2hhbmdlJywgJ2Nsb3NlJ107XG5jb25zdCB3ZWJzb2NrZXRFdmVudE5hbWVzID0gWydjbG9zZScsICdlcnJvcicsICdvcGVuJywgJ21lc3NhZ2UnXTtcbmNvbnN0IHdvcmtlckV2ZW50TmFtZXMgPSBbJ2Vycm9yJywgJ21lc3NhZ2UnXTtcblxuZXhwb3J0IGNvbnN0IGV2ZW50TmFtZXMgPSBnbG9iYWxFdmVudEhhbmRsZXJzRXZlbnROYW1lcy5jb25jYXQoXG4gICAgd2ViZ2xFdmVudE5hbWVzLCBmb3JtRXZlbnROYW1lcywgZGV0YWlsRXZlbnROYW1lcywgZG9jdW1lbnRFdmVudE5hbWVzLCB3aW5kb3dFdmVudE5hbWVzLFxuICAgIGh0bWxFbGVtZW50RXZlbnROYW1lcywgaWVFbGVtZW50RXZlbnROYW1lcyk7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSWdub3JlUHJvcGVydHkge1xuICB0YXJnZXQ6IGFueTtcbiAgaWdub3JlUHJvcGVydGllczogc3RyaW5nW107XG59XG5cbmZ1bmN0aW9uIGZpbHRlclByb3BlcnRpZXMoXG4gICAgdGFyZ2V0OiBhbnksIG9uUHJvcGVydGllczogc3RyaW5nW10sIGlnbm9yZVByb3BlcnRpZXM6IElnbm9yZVByb3BlcnR5W10pOiBzdHJpbmdbXSB7XG4gIGlmICghaWdub3JlUHJvcGVydGllcyB8fCBpZ25vcmVQcm9wZXJ0aWVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBvblByb3BlcnRpZXM7XG4gIH1cblxuICBjb25zdCB0aXA6IElnbm9yZVByb3BlcnR5W10gPSBpZ25vcmVQcm9wZXJ0aWVzLmZpbHRlcihpcCA9PiBpcC50YXJnZXQgPT09IHRhcmdldCk7XG4gIGlmICghdGlwIHx8IHRpcC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICB9XG5cbiAgY29uc3QgdGFyZ2V0SWdub3JlUHJvcGVydGllczogc3RyaW5nW10gPSB0aXBbMF0uaWdub3JlUHJvcGVydGllcztcbiAgcmV0dXJuIG9uUHJvcGVydGllcy5maWx0ZXIob3AgPT4gdGFyZ2V0SWdub3JlUHJvcGVydGllcy5pbmRleE9mKG9wKSA9PT0gLTEpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgdGFyZ2V0OiBhbnksIG9uUHJvcGVydGllczogc3RyaW5nW10sIGlnbm9yZVByb3BlcnRpZXM6IElnbm9yZVByb3BlcnR5W10sIHByb3RvdHlwZT86IGFueSkge1xuICAvLyBjaGVjayB3aGV0aGVyIHRhcmdldCBpcyBhdmFpbGFibGUsIHNvbWV0aW1lcyB0YXJnZXQgd2lsbCBiZSB1bmRlZmluZWRcbiAgLy8gYmVjYXVzZSBkaWZmZXJlbnQgYnJvd3NlciBvciBzb21lIDNyZCBwYXJ0eSBwbHVnaW4uXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IGZpbHRlcmVkUHJvcGVydGllczogc3RyaW5nW10gPSBmaWx0ZXJQcm9wZXJ0aWVzKHRhcmdldCwgb25Qcm9wZXJ0aWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgcGF0Y2hPblByb3BlcnRpZXModGFyZ2V0LCBmaWx0ZXJlZFByb3BlcnRpZXMsIHByb3RvdHlwZSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwcm9wZXJ0eURlc2NyaXB0b3JQYXRjaChhcGk6IF9ab25lUHJpdmF0ZSwgX2dsb2JhbDogYW55KSB7XG4gIGlmIChpc05vZGUgJiYgIWlzTWl4KSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3Qgc3VwcG9ydHNXZWJTb2NrZXQgPSB0eXBlb2YgV2ViU29ja2V0ICE9PSAndW5kZWZpbmVkJztcbiAgaWYgKGNhblBhdGNoVmlhUHJvcGVydHlEZXNjcmlwdG9yKCkpIHtcbiAgICBjb25zdCBpZ25vcmVQcm9wZXJ0aWVzOiBJZ25vcmVQcm9wZXJ0eVtdID0gX2dsb2JhbFsnX19ab25lX2lnbm9yZV9vbl9wcm9wZXJ0aWVzJ107XG4gICAgLy8gZm9yIGJyb3dzZXJzIHRoYXQgd2UgY2FuIHBhdGNoIHRoZSBkZXNjcmlwdG9yOiAgQ2hyb21lICYgRmlyZWZveFxuICAgIGlmIChpc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IGludGVybmFsV2luZG93OiBhbnkgPSB3aW5kb3c7XG4gICAgICBjb25zdCBpZ25vcmVFcnJvclByb3BlcnRpZXMgPVxuICAgICAgICAgIGlzSUUgPyBbe3RhcmdldDogaW50ZXJuYWxXaW5kb3csIGlnbm9yZVByb3BlcnRpZXM6IFsnZXJyb3InXX1dIDogW107XG4gICAgICAvLyBpbiBJRS9FZGdlLCBvblByb3Agbm90IGV4aXN0IGluIHdpbmRvdyBvYmplY3QsIGJ1dCBpbiBXaW5kb3dQcm90b3R5cGVcbiAgICAgIC8vIHNvIHdlIG5lZWQgdG8gcGFzcyBXaW5kb3dQcm90b3R5cGUgdG8gY2hlY2sgb25Qcm9wIGV4aXN0IG9yIG5vdFxuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgaW50ZXJuYWxXaW5kb3csIGV2ZW50TmFtZXMuY29uY2F0KFsnbWVzc2FnZWVycm9yJ10pLFxuICAgICAgICAgIGlnbm9yZVByb3BlcnRpZXMgPyBpZ25vcmVQcm9wZXJ0aWVzLmNvbmNhdChpZ25vcmVFcnJvclByb3BlcnRpZXMpIDogaWdub3JlUHJvcGVydGllcyxcbiAgICAgICAgICBPYmplY3RHZXRQcm90b3R5cGVPZihpbnRlcm5hbFdpbmRvdykpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoRG9jdW1lbnQucHJvdG90eXBlLCBldmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcblxuICAgICAgaWYgKHR5cGVvZiBpbnRlcm5hbFdpbmRvd1snU1ZHRWxlbWVudCddICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICAgICAgICAgIGludGVybmFsV2luZG93WydTVkdFbGVtZW50J10ucHJvdG90eXBlLCBldmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIH1cbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEVsZW1lbnQucHJvdG90eXBlLCBldmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgZXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhIVE1MTWVkaWFFbGVtZW50LnByb3RvdHlwZSwgbWVkaWFFbGVtZW50RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICAgICAgICBIVE1MRnJhbWVTZXRFbGVtZW50LnByb3RvdHlwZSwgd2luZG93RXZlbnROYW1lcy5jb25jYXQoZnJhbWVTZXRFdmVudE5hbWVzKSxcbiAgICAgICAgICBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgICAgICAgIEhUTUxCb2R5RWxlbWVudC5wcm90b3R5cGUsIHdpbmRvd0V2ZW50TmFtZXMuY29uY2F0KGZyYW1lU2V0RXZlbnROYW1lcyksIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSFRNTEZyYW1lRWxlbWVudC5wcm90b3R5cGUsIGZyYW1lRXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhIVE1MSUZyYW1lRWxlbWVudC5wcm90b3R5cGUsIGZyYW1lRXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG5cbiAgICAgIGNvbnN0IEhUTUxNYXJxdWVlRWxlbWVudCA9IGludGVybmFsV2luZG93WydIVE1MTWFycXVlZUVsZW1lbnQnXTtcbiAgICAgIGlmIChIVE1MTWFycXVlZUVsZW1lbnQpIHtcbiAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSFRNTE1hcnF1ZWVFbGVtZW50LnByb3RvdHlwZSwgbWFycXVlZUV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgfVxuICAgICAgY29uc3QgV29ya2VyID0gaW50ZXJuYWxXaW5kb3dbJ1dvcmtlciddO1xuICAgICAgaWYgKFdvcmtlcikge1xuICAgICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhXb3JrZXIucHJvdG90eXBlLCB3b3JrZXJFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLCBYTUxIdHRwUmVxdWVzdEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIGNvbnN0IFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgPSBfZ2xvYmFsWydYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0J107XG4gICAgaWYgKFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQpIHtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQgJiYgWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldC5wcm90b3R5cGUsXG4gICAgICAgICAgWE1MSHR0cFJlcXVlc3RFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgaWYgKHR5cGVvZiBJREJJbmRleCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQkluZGV4LnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQlJlcXVlc3QucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCT3BlbkRCUmVxdWVzdC5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJEYXRhYmFzZS5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJUcmFuc2FjdGlvbi5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJDdXJzb3IucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIH1cbiAgICBpZiAoc3VwcG9ydHNXZWJTb2NrZXQpIHtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFdlYlNvY2tldC5wcm90b3R5cGUsIHdlYnNvY2tldEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICAvLyBTYWZhcmksIEFuZHJvaWQgYnJvd3NlcnMgKEplbGx5IEJlYW4pXG4gICAgcGF0Y2hWaWFDYXB0dXJpbmdBbGxUaGVFdmVudHMoKTtcbiAgICBwYXRjaENsYXNzKCdYTUxIdHRwUmVxdWVzdCcpO1xuICAgIGlmIChzdXBwb3J0c1dlYlNvY2tldCkge1xuICAgICAgd2ViU29ja2V0UGF0Y2guYXBwbHkoYXBpLCBfZ2xvYmFsKTtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gY2FuUGF0Y2hWaWFQcm9wZXJ0eURlc2NyaXB0b3IoKSB7XG4gIGlmICgoaXNCcm93c2VyIHx8IGlzTWl4KSAmJiAhT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEhUTUxFbGVtZW50LnByb3RvdHlwZSwgJ29uY2xpY2snKSAmJlxuICAgICAgdHlwZW9mIEVsZW1lbnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgLy8gV2ViS2l0IGh0dHBzOi8vYnVncy53ZWJraXQub3JnL3Nob3dfYnVnLmNnaT9pZD0xMzQzNjRcbiAgICAvLyBJREwgaW50ZXJmYWNlIGF0dHJpYnV0ZXMgYXJlIG5vdCBjb25maWd1cmFibGVcbiAgICBjb25zdCBkZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKEVsZW1lbnQucHJvdG90eXBlLCAnb25jbGljaycpO1xuICAgIGlmIChkZXNjICYmICFkZXNjLmNvbmZpZ3VyYWJsZSkgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgY29uc3QgT05fUkVBRFlfU1RBVEVfQ0hBTkdFID0gJ29ucmVhZHlzdGF0ZWNoYW5nZSc7XG4gIGNvbnN0IFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlID0gWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlO1xuXG4gIGNvbnN0IHhockRlc2MgPSBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSk7XG5cbiAgLy8gYWRkIGVudW1lcmFibGUgYW5kIGNvbmZpZ3VyYWJsZSBoZXJlIGJlY2F1c2UgaW4gb3BlcmFcbiAgLy8gYnkgZGVmYXVsdCBYTUxIdHRwUmVxdWVzdC5wcm90b3R5cGUub25yZWFkeXN0YXRlY2hhbmdlIGlzIHVuZGVmaW5lZFxuICAvLyB3aXRob3V0IGFkZGluZyBlbnVtZXJhYmxlIGFuZCBjb25maWd1cmFibGUgd2lsbCBjYXVzZSBvbnJlYWR5c3RhdGVjaGFuZ2VcbiAgLy8gbm9uLWNvbmZpZ3VyYWJsZVxuICAvLyBhbmQgaWYgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLm9ucmVhZHlzdGF0ZWNoYW5nZSBpcyB1bmRlZmluZWQsXG4gIC8vIHdlIHNob3VsZCBzZXQgYSByZWFsIGRlc2MgaW5zdGVhZCBhIGZha2Ugb25lXG4gIGlmICh4aHJEZXNjKSB7XG4gICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGNvbnN0IHJlc3VsdCA9ICEhcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZTtcbiAgICAvLyByZXN0b3JlIG9yaWdpbmFsIGRlc2NcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgT05fUkVBRFlfU1RBVEVfQ0hBTkdFLCB4aHJEZXNjIHx8IHt9KTtcbiAgICByZXR1cm4gcmVzdWx0O1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IFNZTUJPTF9GQUtFX09OUkVBRFlTVEFURUNIQU5HRSA9IHpvbmVTeW1ib2woJ2Zha2UnKTtcbiAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSwgT05fUkVBRFlfU1RBVEVfQ0hBTkdFLCB7XG4gICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXNbU1lNQk9MX0ZBS0VfT05SRUFEWVNUQVRFQ0hBTkdFXTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHRoaXNbU1lNQk9MX0ZBS0VfT05SRUFEWVNUQVRFQ0hBTkdFXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IHJlcSA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGNvbnN0IGRldGVjdEZ1bmMgPSAoKSA9PiB7fTtcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gZGV0ZWN0RnVuYztcbiAgICBjb25zdCByZXN1bHQgPSAocmVxIGFzIGFueSlbU1lNQk9MX0ZBS0VfT05SRUFEWVNUQVRFQ0hBTkdFXSA9PT0gZGV0ZWN0RnVuYztcbiAgICByZXEub25yZWFkeXN0YXRlY2hhbmdlID0gbnVsbCBhcyBhbnk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxufVxuXG5jb25zdCB1bmJvdW5kS2V5ID0gem9uZVN5bWJvbCgndW5ib3VuZCcpO1xuXG4vLyBXaGVuZXZlciBhbnkgZXZlbnRMaXN0ZW5lciBmaXJlcywgd2UgY2hlY2sgdGhlIGV2ZW50TGlzdGVuZXIgdGFyZ2V0IGFuZCBhbGwgcGFyZW50c1xuLy8gZm9yIGBvbndoYXRldmVyYCBwcm9wZXJ0aWVzIGFuZCByZXBsYWNlIHRoZW0gd2l0aCB6b25lLWJvdW5kIGZ1bmN0aW9uc1xuLy8gLSBDaHJvbWUgKGZvciBub3cpXG5mdW5jdGlvbiBwYXRjaFZpYUNhcHR1cmluZ0FsbFRoZUV2ZW50cygpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBldmVudE5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgcHJvcGVydHkgPSBldmVudE5hbWVzW2ldO1xuICAgIGNvbnN0IG9ucHJvcGVydHkgPSAnb24nICsgcHJvcGVydHk7XG4gICAgc2VsZi5hZGRFdmVudExpc3RlbmVyKHByb3BlcnR5LCBmdW5jdGlvbihldmVudCkge1xuICAgICAgbGV0IGVsdDogYW55ID0gPE5vZGU+ZXZlbnQudGFyZ2V0LCBib3VuZCwgc291cmNlO1xuICAgICAgaWYgKGVsdCkge1xuICAgICAgICBzb3VyY2UgPSBlbHQuY29uc3RydWN0b3JbJ25hbWUnXSArICcuJyArIG9ucHJvcGVydHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzb3VyY2UgPSAndW5rbm93bi4nICsgb25wcm9wZXJ0eTtcbiAgICAgIH1cbiAgICAgIHdoaWxlIChlbHQpIHtcbiAgICAgICAgaWYgKGVsdFtvbnByb3BlcnR5XSAmJiAhZWx0W29ucHJvcGVydHldW3VuYm91bmRLZXldKSB7XG4gICAgICAgICAgYm91bmQgPSB3cmFwV2l0aEN1cnJlbnRab25lKGVsdFtvbnByb3BlcnR5XSwgc291cmNlKTtcbiAgICAgICAgICBib3VuZFt1bmJvdW5kS2V5XSA9IGVsdFtvbnByb3BlcnR5XTtcbiAgICAgICAgICBlbHRbb25wcm9wZXJ0eV0gPSBib3VuZDtcbiAgICAgICAgfVxuICAgICAgICBlbHQgPSBlbHQucGFyZW50RWxlbWVudDtcbiAgICAgIH1cbiAgICB9LCB0cnVlKTtcbiAgfVxufVxuIl19