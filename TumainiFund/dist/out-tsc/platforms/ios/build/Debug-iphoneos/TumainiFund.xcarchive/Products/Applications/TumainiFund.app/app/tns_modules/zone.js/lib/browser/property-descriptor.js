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
import { isBrowser, isIE, isMix, isNode, ObjectDefineProperty, ObjectGetOwnPropertyDescriptor, ObjectGetPrototypeOf, patchClass, patchOnProperties, wrapWithCurrentZone, zoneSymbol } from '../common/utils';
import * as webSocketPatch from './websocket';
const globalEventHandlersEventNames = [
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
const documentEventNames = [
    'afterscriptexecute', 'beforescriptexecute', 'DOMContentLoaded', 'freeze', 'fullscreenchange',
    'mozfullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange', 'fullscreenerror',
    'mozfullscreenerror', 'webkitfullscreenerror', 'msfullscreenerror', 'readystatechange',
    'visibilitychange', 'resume'
];
const windowEventNames = [
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
const htmlElementEventNames = [
    'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'dragstart', 'loadend',
    'animationstart', 'search', 'transitionrun', 'transitionstart', 'webkitanimationend',
    'webkitanimationiteration', 'webkitanimationstart', 'webkittransitionend'
];
const mediaElementEventNames = ['encrypted', 'waitingforkey', 'msneedkey', 'mozinterruptbegin', 'mozinterruptend'];
const ieElementEventNames = [
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
const webglEventNames = ['webglcontextrestored', 'webglcontextlost', 'webglcontextcreationerror'];
const formEventNames = ['autocomplete', 'autocompleteerror'];
const detailEventNames = ['toggle'];
const frameEventNames = ['load'];
const frameSetEventNames = ['blur', 'error', 'focus', 'load', 'resize', 'scroll', 'messageerror'];
const marqueeEventNames = ['bounce', 'finish', 'start'];
const XMLHttpRequestEventNames = [
    'loadstart', 'progress', 'abort', 'error', 'load', 'progress', 'timeout', 'loadend',
    'readystatechange'
];
const IDBIndexEventNames = ['upgradeneeded', 'complete', 'abort', 'success', 'error', 'blocked', 'versionchange', 'close'];
const websocketEventNames = ['close', 'error', 'open', 'message'];
const workerEventNames = ['error', 'message'];
export const eventNames = globalEventHandlersEventNames.concat(webglEventNames, formEventNames, detailEventNames, documentEventNames, windowEventNames, htmlElementEventNames, ieElementEventNames);
function filterProperties(target, onProperties, ignoreProperties) {
    if (!ignoreProperties || ignoreProperties.length === 0) {
        return onProperties;
    }
    const tip = ignoreProperties.filter(ip => ip.target === target);
    if (!tip || tip.length === 0) {
        return onProperties;
    }
    const targetIgnoreProperties = tip[0].ignoreProperties;
    return onProperties.filter(op => targetIgnoreProperties.indexOf(op) === -1);
}
export function patchFilteredProperties(target, onProperties, ignoreProperties, prototype) {
    // check whether target is available, sometimes target will be undefined
    // because different browser or some 3rd party plugin.
    if (!target) {
        return;
    }
    const filteredProperties = filterProperties(target, onProperties, ignoreProperties);
    patchOnProperties(target, filteredProperties, prototype);
}
export function propertyDescriptorPatch(api, _global) {
    if (isNode && !isMix) {
        return;
    }
    const supportsWebSocket = typeof WebSocket !== 'undefined';
    if (canPatchViaPropertyDescriptor()) {
        const ignoreProperties = _global['__Zone_ignore_on_properties'];
        // for browsers that we can patch the descriptor:  Chrome & Firefox
        if (isBrowser) {
            const internalWindow = window;
            const ignoreErrorProperties = isIE ? [{ target: internalWindow, ignoreProperties: ['error'] }] : [];
            // in IE/Edge, onProp not exist in window object, but in WindowPrototype
            // so we need to pass WindowPrototype to check onProp exist or not
            patchFilteredProperties(internalWindow, eventNames.concat(['messageerror']), ignoreProperties ? ignoreProperties.concat(ignoreErrorProperties) : ignoreProperties, ObjectGetPrototypeOf(internalWindow));
            patchFilteredProperties(Document.prototype, eventNames, ignoreProperties);
            if (typeof internalWindow['SVGElement'] !== 'undefined') {
                patchFilteredProperties(internalWindow['SVGElement'].prototype, eventNames, ignoreProperties);
            }
            patchFilteredProperties(Element.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLElement.prototype, eventNames, ignoreProperties);
            patchFilteredProperties(HTMLMediaElement.prototype, mediaElementEventNames, ignoreProperties);
            patchFilteredProperties(HTMLFrameSetElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLBodyElement.prototype, windowEventNames.concat(frameSetEventNames), ignoreProperties);
            patchFilteredProperties(HTMLFrameElement.prototype, frameEventNames, ignoreProperties);
            patchFilteredProperties(HTMLIFrameElement.prototype, frameEventNames, ignoreProperties);
            const HTMLMarqueeElement = internalWindow['HTMLMarqueeElement'];
            if (HTMLMarqueeElement) {
                patchFilteredProperties(HTMLMarqueeElement.prototype, marqueeEventNames, ignoreProperties);
            }
            const Worker = internalWindow['Worker'];
            if (Worker) {
                patchFilteredProperties(Worker.prototype, workerEventNames, ignoreProperties);
            }
        }
        patchFilteredProperties(XMLHttpRequest.prototype, XMLHttpRequestEventNames, ignoreProperties);
        const XMLHttpRequestEventTarget = _global['XMLHttpRequestEventTarget'];
        if (XMLHttpRequestEventTarget) {
            patchFilteredProperties(XMLHttpRequestEventTarget && XMLHttpRequestEventTarget.prototype, XMLHttpRequestEventNames, ignoreProperties);
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
        patchClass('XMLHttpRequest');
        if (supportsWebSocket) {
            webSocketPatch.apply(api, _global);
        }
    }
}
function canPatchViaPropertyDescriptor() {
    if ((isBrowser || isMix) && !ObjectGetOwnPropertyDescriptor(HTMLElement.prototype, 'onclick') &&
        typeof Element !== 'undefined') {
        // WebKit https://bugs.webkit.org/show_bug.cgi?id=134364
        // IDL interface attributes are not configurable
        const desc = ObjectGetOwnPropertyDescriptor(Element.prototype, 'onclick');
        if (desc && !desc.configurable)
            return false;
    }
    const ON_READY_STATE_CHANGE = 'onreadystatechange';
    const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    const xhrDesc = ObjectGetOwnPropertyDescriptor(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE);
    // add enumerable and configurable here because in opera
    // by default XMLHttpRequest.prototype.onreadystatechange is undefined
    // without adding enumerable and configurable will cause onreadystatechange
    // non-configurable
    // and if XMLHttpRequest.prototype.onreadystatechange is undefined,
    // we should set a real desc instead a fake one
    if (xhrDesc) {
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return true;
            }
        });
        const req = new XMLHttpRequest();
        const result = !!req.onreadystatechange;
        // restore original desc
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, xhrDesc || {});
        return result;
    }
    else {
        const SYMBOL_FAKE_ONREADYSTATECHANGE = zoneSymbol('fake');
        ObjectDefineProperty(XMLHttpRequestPrototype, ON_READY_STATE_CHANGE, {
            enumerable: true,
            configurable: true,
            get: function () {
                return this[SYMBOL_FAKE_ONREADYSTATECHANGE];
            },
            set: function (value) {
                this[SYMBOL_FAKE_ONREADYSTATECHANGE] = value;
            }
        });
        const req = new XMLHttpRequest();
        const detectFunc = () => { };
        req.onreadystatechange = detectFunc;
        const result = req[SYMBOL_FAKE_ONREADYSTATECHANGE] === detectFunc;
        req.onreadystatechange = null;
        return result;
    }
}
const unboundKey = zoneSymbol('unbound');
// Whenever any eventListener fires, we check the eventListener target and all parents
// for `onwhatever` properties and replace them with zone-bound functions
// - Chrome (for now)
function patchViaCapturingAllTheEvents() {
    for (let i = 0; i < eventNames.length; i++) {
        const property = eventNames[i];
        const onproperty = 'on' + property;
        self.addEventListener(property, function (event) {
            let elt = event.target, bound, source;
            if (elt) {
                source = elt.constructor['name'] + '.' + onproperty;
            }
            else {
                source = 'unknown.' + onproperty;
            }
            while (elt) {
                if (elt[onproperty] && !elt[onproperty][unboundKey]) {
                    bound = wrapWithCurrentZone(elt[onproperty], source);
                    bound[unboundKey] = elt[onproperty];
                    elt[onproperty] = bound;
                }
                elt = elt.parentElement;
            }
        }, true);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktZGVzY3JpcHRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvRGVidWctaXBob25lb3MvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL2Jyb3dzZXIvcHJvcGVydHktZGVzY3JpcHRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDs7O0dBR0c7QUFFSCxPQUFPLEVBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLG9CQUFvQixFQUFFLDhCQUE4QixFQUFFLG9CQUFvQixFQUFFLFVBQVUsRUFBRSxpQkFBaUIsRUFBRSxtQkFBbUIsRUFBRSxVQUFVLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUUzTSxPQUFPLEtBQUssY0FBYyxNQUFNLGFBQWEsQ0FBQztBQUU5QyxNQUFNLDZCQUE2QixHQUFHO0lBQ3BDLE9BQU87SUFDUCxpQkFBaUI7SUFDakIsY0FBYztJQUNkLG9CQUFvQjtJQUNwQixVQUFVO0lBQ1YsYUFBYTtJQUNiLE1BQU07SUFDTixRQUFRO0lBQ1IsU0FBUztJQUNULGdCQUFnQjtJQUNoQixRQUFRO0lBQ1Isa0JBQWtCO0lBQ2xCLG1CQUFtQjtJQUNuQixnQkFBZ0I7SUFDaEIsV0FBVztJQUNYLE9BQU87SUFDUCxPQUFPO0lBQ1AsYUFBYTtJQUNiLFlBQVk7SUFDWixVQUFVO0lBQ1YsTUFBTTtJQUNOLFNBQVM7SUFDVCxXQUFXO0lBQ1gsVUFBVTtJQUNWLFdBQVc7SUFDWCxVQUFVO0lBQ1YsTUFBTTtJQUNOLGdCQUFnQjtJQUNoQixTQUFTO0lBQ1QsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULFVBQVU7SUFD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QUFNLFVBQVUsR0FBRyxJQUFJLEdBQUcsUUFBUSxDQUFDO1FBQ25DLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxRQUFRLEVBQUUsVUFBUyxLQUFLO1lBQzVDLElBQUksR0FBRyxHQUFjLEtBQUssQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE1BQU0sQ0FBQztZQUNqRCxJQUFJLEdBQUcsRUFBRTtnQkFDUCxNQUFNLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsR0FBRyxHQUFHLEdBQUcsVUFBVSxDQUFDO2FBQ3JEO2lCQUFNO2dCQUNMLE1BQU0sR0FBRyxVQUFVLEdBQUcsVUFBVSxDQUFDO2FBQ2xDO1lBQ0QsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ25ELEtBQUssR0FBRyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUM7b0JBQ3JELEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7b0JBQ3BDLEdBQUcsQ0FBQyxVQUFVLENBQUMsR0FBRyxLQUFLLENBQUM7aUJBQ3pCO2dCQUNELEdBQUcsR0FBRyxHQUFHLENBQUMsYUFBYSxDQUFDO2FBQ3pCO1FBQ0gsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ1Y7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge2dsb2JhbFRoaXN9XG4gKi9cblxuaW1wb3J0IHtpc0Jyb3dzZXIsIGlzSUUsIGlzTWl4LCBpc05vZGUsIE9iamVjdERlZmluZVByb3BlcnR5LCBPYmplY3RHZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsIE9iamVjdEdldFByb3RvdHlwZU9mLCBwYXRjaENsYXNzLCBwYXRjaE9uUHJvcGVydGllcywgd3JhcFdpdGhDdXJyZW50Wm9uZSwgem9uZVN5bWJvbH0gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcblxuaW1wb3J0ICogYXMgd2ViU29ja2V0UGF0Y2ggZnJvbSAnLi93ZWJzb2NrZXQnO1xuXG5jb25zdCBnbG9iYWxFdmVudEhhbmRsZXJzRXZlbnROYW1lcyA9IFtcbiAgJ2Fib3J0JyxcbiAgJ2FuaW1hdGlvbmNhbmNlbCcsXG4gICdhbmltYXRpb25lbmQnLFxuICAnYW5pbWF0aW9uaXRlcmF0aW9uJyxcbiAgJ2F1eGNsaWNrJyxcbiAgJ2JlZm9yZWlucHV0JyxcbiAgJ2JsdXInLFxuICAnY2FuY2VsJyxcbiAgJ2NhbnBsYXknLFxuICAnY2FucGxheXRocm91Z2gnLFxuICAnY2hhbmdlJyxcbiAgJ2NvbXBvc2l0aW9uc3RhcnQnLFxuICAnY29tcG9zaXRpb251cGRhdGUnLFxuICAnY29tcG9zaXRpb25lbmQnLFxuICAnY3VlY2hhbmdlJyxcbiAgJ2NsaWNrJyxcbiAgJ2Nsb3NlJyxcbiAgJ2NvbnRleHRtZW51JyxcbiAgJ2N1cmVjaGFuZ2UnLFxuICAnZGJsY2xpY2snLFxuICAnZHJhZycsXG4gICdkcmFnZW5kJyxcbiAgJ2RyYWdlbnRlcicsXG4gICdkcmFnZXhpdCcsXG4gICdkcmFnbGVhdmUnLFxuICAnZHJhZ292ZXInLFxuICAnZHJvcCcsXG4gICdkdXJhdGlvbmNoYW5nZScsXG4gICdlbXB0aWVkJyxcbiAgJ2VuZGVkJyxcbiAgJ2Vycm9yJyxcbiAgJ2ZvY3VzJyxcbiAgJ2ZvY3VzaW4nLFxuICAnZm9jdXNvdXQnLFxuICAnZ290cG9pbnRlcmNhcHR1cmUnLFxuICAnaW5wdXQnLFxuICAnaW52YWxpZCcsXG4gICdrZXlkb3duJyxcbiAgJ2tleXByZXNzJyxcbiAgJ2tleXVwJyxcbiAgJ2xvYWQnLFxuICAnbG9hZHN0YXJ0JyxcbiAgJ2xvYWRlZGRhdGEnLFxuICAnbG9hZGVkbWV0YWRhdGEnLFxuICAnbG9zdHBvaW50ZXJjYXB0dXJlJyxcbiAgJ21vdXNlZG93bicsXG4gICdtb3VzZWVudGVyJyxcbiAgJ21vdXNlbGVhdmUnLFxuICAnbW91c2Vtb3ZlJyxcbiAgJ21vdXNlb3V0JyxcbiAgJ21vdXNlb3ZlcicsXG4gICdtb3VzZXVwJyxcbiAgJ21vdXNld2hlZWwnLFxuICAnb3JpZW50YXRpb25jaGFuZ2UnLFxuICAncGF1c2UnLFxuICAncGxheScsXG4gICdwbGF5aW5nJyxcbiAgJ3BvaW50ZXJjYW5jZWwnLFxuICAncG9pbnRlcmRvd24nLFxuICAncG9pbnRlcmVudGVyJyxcbiAgJ3BvaW50ZXJsZWF2ZScsXG4gICdwb2ludGVybG9ja2NoYW5nZScsXG4gICdtb3pwb2ludGVybG9ja2NoYW5nZScsXG4gICd3ZWJraXRwb2ludGVybG9ja2VyY2hhbmdlJyxcbiAgJ3BvaW50ZXJsb2NrZXJyb3InLFxuICAnbW96cG9pbnRlcmxvY2tlcnJvcicsXG4gICd3ZWJraXRwb2ludGVybG9ja2Vycm9yJyxcbiAgJ3BvaW50ZXJtb3ZlJyxcbiAgJ3BvaW50b3V0JyxcbiAgJ3BvaW50ZXJvdmVyJyxcbiAgJ3BvaW50ZXJ1cCcsXG4gICdwcm9ncmVzcycsXG4gICdyYXRlY2hhbmdlJyxcbiAgJ3Jlc2V0JyxcbiAgJ3Jlc2l6ZScsXG4gICdzY3JvbGwnLFxuICAnc2Vla2VkJyxcbiAgJ3NlZWtpbmcnLFxuICAnc2VsZWN0JyxcbiAgJ3NlbGVjdGlvbmNoYW5nZScsXG4gICdzZWxlY3RzdGFydCcsXG4gICdzaG93JyxcbiAgJ3NvcnQnLFxuICAnc3RhbGxlZCcsXG4gICdzdWJtaXQnLFxuICAnc3VzcGVuZCcsXG4gICd0aW1ldXBkYXRlJyxcbiAgJ3ZvbHVtZWNoYW5nZScsXG4gICd0b3VjaGNhbmNlbCcsXG4gICd0b3VjaG1vdmUnLFxuICAndG91Y2hzdGFydCcsXG4gICd0b3VjaGVuZCcsXG4gICd0cmFuc2l0aW9uY2FuY2VsJyxcbiAgJ3RyYW5zaXRpb25lbmQnLFxuICAnd2FpdGluZycsXG4gICd3aGVlbCdcbl07XG5jb25zdCBkb2N1bWVudEV2ZW50TmFtZXMgPSBbXG4gICdhZnRlcnNjcmlwdGV4ZWN1dGUnLCAnYmVmb3Jlc2NyaXB0ZXhlY3V0ZScsICdET01Db250ZW50TG9hZGVkJywgJ2ZyZWV6ZScsICdmdWxsc2NyZWVuY2hhbmdlJyxcbiAgJ21vemZ1bGxzY3JlZW5jaGFuZ2UnLCAnd2Via2l0ZnVsbHNjcmVlbmNoYW5nZScsICdtc2Z1bGxzY3JlZW5jaGFuZ2UnLCAnZnVsbHNjcmVlbmVycm9yJyxcbiAgJ21vemZ1bGxzY3JlZW5lcnJvcicsICd3ZWJraXRmdWxsc2NyZWVuZXJyb3InLCAnbXNmdWxsc2NyZWVuZXJyb3InLCAncmVhZHlzdGF0ZWNoYW5nZScsXG4gICd2aXNpYmlsaXR5Y2hhbmdlJywgJ3Jlc3VtZSdcbl07XG5jb25zdCB3aW5kb3dFdmVudE5hbWVzID0gW1xuICAnYWJzb2x1dGVkZXZpY2VvcmllbnRhdGlvbicsXG4gICdhZnRlcmlucHV0JyxcbiAgJ2FmdGVycHJpbnQnLFxuICAnYXBwaW5zdGFsbGVkJyxcbiAgJ2JlZm9yZWluc3RhbGxwcm9tcHQnLFxuICAnYmVmb3JlcHJpbnQnLFxuICAnYmVmb3JldW5sb2FkJyxcbiAgJ2RldmljZWxpZ2h0JyxcbiAgJ2RldmljZW1vdGlvbicsXG4gICdkZXZpY2VvcmllbnRhdGlvbicsXG4gICdkZXZpY2VvcmllbnRhdGlvbmFic29sdXRlJyxcbiAgJ2RldmljZXByb3hpbWl0eScsXG4gICdoYXNoY2hhbmdlJyxcbiAgJ2xhbmd1YWdlY2hhbmdlJyxcbiAgJ21lc3NhZ2UnLFxuICAnbW96YmVmb3JlcGFpbnQnLFxuICAnb2ZmbGluZScsXG4gICdvbmxpbmUnLFxuICAncGFpbnQnLFxuICAncGFnZXNob3cnLFxuICAncGFnZWhpZGUnLFxuICAncG9wc3RhdGUnLFxuICAncmVqZWN0aW9uaGFuZGxlZCcsXG4gICdzdG9yYWdlJyxcbiAgJ3VuaGFuZGxlZHJlamVjdGlvbicsXG4gICd1bmxvYWQnLFxuICAndXNlcnByb3hpbWl0eScsXG4gICd2cmRpc3BseWNvbm5lY3RlZCcsXG4gICd2cmRpc3BsYXlkaXNjb25uZWN0ZWQnLFxuICAndnJkaXNwbGF5cHJlc2VudGNoYW5nZSdcbl07XG5jb25zdCBodG1sRWxlbWVudEV2ZW50TmFtZXMgPSBbXG4gICdiZWZvcmVjb3B5JywgJ2JlZm9yZWN1dCcsICdiZWZvcmVwYXN0ZScsICdjb3B5JywgJ2N1dCcsICdwYXN0ZScsICdkcmFnc3RhcnQnLCAnbG9hZGVuZCcsXG4gICdhbmltYXRpb25zdGFydCcsICdzZWFyY2gnLCAndHJhbnNpdGlvbnJ1bicsICd0cmFuc2l0aW9uc3RhcnQnLCAnd2Via2l0YW5pbWF0aW9uZW5kJyxcbiAgJ3dlYmtpdGFuaW1hdGlvbml0ZXJhdGlvbicsICd3ZWJraXRhbmltYXRpb25zdGFydCcsICd3ZWJraXR0cmFuc2l0aW9uZW5kJ1xuXTtcbmNvbnN0IG1lZGlhRWxlbWVudEV2ZW50TmFtZXMgPVxuICAgIFsnZW5jcnlwdGVkJywgJ3dhaXRpbmdmb3JrZXknLCAnbXNuZWVka2V5JywgJ21vemludGVycnVwdGJlZ2luJywgJ21vemludGVycnVwdGVuZCddO1xuY29uc3QgaWVFbGVtZW50RXZlbnROYW1lcyA9IFtcbiAgJ2FjdGl2YXRlJyxcbiAgJ2FmdGVydXBkYXRlJyxcbiAgJ2FyaWFyZXF1ZXN0JyxcbiAgJ2JlZm9yZWFjdGl2YXRlJyxcbiAgJ2JlZm9yZWRlYWN0aXZhdGUnLFxuICAnYmVmb3JlZWRpdGZvY3VzJyxcbiAgJ2JlZm9yZXVwZGF0ZScsXG4gICdjZWxsY2hhbmdlJyxcbiAgJ2NvbnRyb2xzZWxlY3QnLFxuICAnZGF0YWF2YWlsYWJsZScsXG4gICdkYXRhc2V0Y2hhbmdlZCcsXG4gICdkYXRhc2V0Y29tcGxldGUnLFxuICAnZXJyb3J1cGRhdGUnLFxuICAnZmlsdGVyY2hhbmdlJyxcbiAgJ2xheW91dGNvbXBsZXRlJyxcbiAgJ2xvc2VjYXB0dXJlJyxcbiAgJ21vdmUnLFxuICAnbW92ZWVuZCcsXG4gICdtb3Zlc3RhcnQnLFxuICAncHJvcGVydHljaGFuZ2UnLFxuICAncmVzaXplZW5kJyxcbiAgJ3Jlc2l6ZXN0YXJ0JyxcbiAgJ3Jvd2VudGVyJyxcbiAgJ3Jvd2V4aXQnLFxuICAncm93c2RlbGV0ZScsXG4gICdyb3dzaW5zZXJ0ZWQnLFxuICAnY29tbWFuZCcsXG4gICdjb21wYXNzbmVlZHNjYWxpYnJhdGlvbicsXG4gICdkZWFjdGl2YXRlJyxcbiAgJ2hlbHAnLFxuICAnbXNjb250ZW50em9vbScsXG4gICdtc21hbmlwdWxhdGlvbnN0YXRlY2hhbmdlZCcsXG4gICdtc2dlc3R1cmVjaGFuZ2UnLFxuICAnbXNnZXN0dXJlZG91YmxldGFwJyxcbiAgJ21zZ2VzdHVyZWVuZCcsXG4gICdtc2dlc3R1cmVob2xkJyxcbiAgJ21zZ2VzdHVyZXN0YXJ0JyxcbiAgJ21zZ2VzdHVyZXRhcCcsXG4gICdtc2dvdHBvaW50ZXJjYXB0dXJlJyxcbiAgJ21zaW5lcnRpYXN0YXJ0JyxcbiAgJ21zbG9zdHBvaW50ZXJjYXB0dXJlJyxcbiAgJ21zcG9pbnRlcmNhbmNlbCcsXG4gICdtc3BvaW50ZXJkb3duJyxcbiAgJ21zcG9pbnRlcmVudGVyJyxcbiAgJ21zcG9pbnRlcmhvdmVyJyxcbiAgJ21zcG9pbnRlcmxlYXZlJyxcbiAgJ21zcG9pbnRlcm1vdmUnLFxuICAnbXNwb2ludGVyb3V0JyxcbiAgJ21zcG9pbnRlcm92ZXInLFxuICAnbXNwb2ludGVydXAnLFxuICAncG9pbnRlcm91dCcsXG4gICdtc3NpdGVtb2RlanVtcGxpc3RpdGVtcmVtb3ZlZCcsXG4gICdtc3RodW1ibmFpbGNsaWNrJyxcbiAgJ3N0b3AnLFxuICAnc3RvcmFnZWNvbW1pdCdcbl07XG5jb25zdCB3ZWJnbEV2ZW50TmFtZXMgPSBbJ3dlYmdsY29udGV4dHJlc3RvcmVkJywgJ3dlYmdsY29udGV4dGxvc3QnLCAnd2ViZ2xjb250ZXh0Y3JlYXRpb25lcnJvciddO1xuY29uc3QgZm9ybUV2ZW50TmFtZXMgPSBbJ2F1dG9jb21wbGV0ZScsICdhdXRvY29tcGxldGVlcnJvciddO1xuY29uc3QgZGV0YWlsRXZlbnROYW1lcyA9IFsndG9nZ2xlJ107XG5jb25zdCBmcmFtZUV2ZW50TmFtZXMgPSBbJ2xvYWQnXTtcbmNvbnN0IGZyYW1lU2V0RXZlbnROYW1lcyA9IFsnYmx1cicsICdlcnJvcicsICdmb2N1cycsICdsb2FkJywgJ3Jlc2l6ZScsICdzY3JvbGwnLCAnbWVzc2FnZWVycm9yJ107XG5jb25zdCBtYXJxdWVlRXZlbnROYW1lcyA9IFsnYm91bmNlJywgJ2ZpbmlzaCcsICdzdGFydCddO1xuXG5jb25zdCBYTUxIdHRwUmVxdWVzdEV2ZW50TmFtZXMgPSBbXG4gICdsb2Fkc3RhcnQnLCAncHJvZ3Jlc3MnLCAnYWJvcnQnLCAnZXJyb3InLCAnbG9hZCcsICdwcm9ncmVzcycsICd0aW1lb3V0JywgJ2xvYWRlbmQnLFxuICAncmVhZHlzdGF0ZWNoYW5nZSdcbl07XG5jb25zdCBJREJJbmRleEV2ZW50TmFtZXMgPVxuICAgIFsndXBncmFkZW5lZWRlZCcsICdjb21wbGV0ZScsICdhYm9ydCcsICdzdWNjZXNzJywgJ2Vycm9yJywgJ2Jsb2NrZWQnLCAndmVyc2lvbmNoYW5nZScsICdjbG9zZSddO1xuY29uc3Qgd2Vic29ja2V0RXZlbnROYW1lcyA9IFsnY2xvc2UnLCAnZXJyb3InLCAnb3BlbicsICdtZXNzYWdlJ107XG5jb25zdCB3b3JrZXJFdmVudE5hbWVzID0gWydlcnJvcicsICdtZXNzYWdlJ107XG5cbmV4cG9ydCBjb25zdCBldmVudE5hbWVzID0gZ2xvYmFsRXZlbnRIYW5kbGVyc0V2ZW50TmFtZXMuY29uY2F0KFxuICAgIHdlYmdsRXZlbnROYW1lcywgZm9ybUV2ZW50TmFtZXMsIGRldGFpbEV2ZW50TmFtZXMsIGRvY3VtZW50RXZlbnROYW1lcywgd2luZG93RXZlbnROYW1lcyxcbiAgICBodG1sRWxlbWVudEV2ZW50TmFtZXMsIGllRWxlbWVudEV2ZW50TmFtZXMpO1xuXG5leHBvcnQgaW50ZXJmYWNlIElnbm9yZVByb3BlcnR5IHtcbiAgdGFyZ2V0OiBhbnk7XG4gIGlnbm9yZVByb3BlcnRpZXM6IHN0cmluZ1tdO1xufVxuXG5mdW5jdGlvbiBmaWx0ZXJQcm9wZXJ0aWVzKFxuICAgIHRhcmdldDogYW55LCBvblByb3BlcnRpZXM6IHN0cmluZ1tdLCBpZ25vcmVQcm9wZXJ0aWVzOiBJZ25vcmVQcm9wZXJ0eVtdKTogc3RyaW5nW10ge1xuICBpZiAoIWlnbm9yZVByb3BlcnRpZXMgfHwgaWdub3JlUHJvcGVydGllcy5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gb25Qcm9wZXJ0aWVzO1xuICB9XG5cbiAgY29uc3QgdGlwOiBJZ25vcmVQcm9wZXJ0eVtdID0gaWdub3JlUHJvcGVydGllcy5maWx0ZXIoaXAgPT4gaXAudGFyZ2V0ID09PSB0YXJnZXQpO1xuICBpZiAoIXRpcCB8fCB0aXAubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG9uUHJvcGVydGllcztcbiAgfVxuXG4gIGNvbnN0IHRhcmdldElnbm9yZVByb3BlcnRpZXM6IHN0cmluZ1tdID0gdGlwWzBdLmlnbm9yZVByb3BlcnRpZXM7XG4gIHJldHVybiBvblByb3BlcnRpZXMuZmlsdGVyKG9wID0+IHRhcmdldElnbm9yZVByb3BlcnRpZXMuaW5kZXhPZihvcCkgPT09IC0xKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgIHRhcmdldDogYW55LCBvblByb3BlcnRpZXM6IHN0cmluZ1tdLCBpZ25vcmVQcm9wZXJ0aWVzOiBJZ25vcmVQcm9wZXJ0eVtdLCBwcm90b3R5cGU/OiBhbnkpIHtcbiAgLy8gY2hlY2sgd2hldGhlciB0YXJnZXQgaXMgYXZhaWxhYmxlLCBzb21ldGltZXMgdGFyZ2V0IHdpbGwgYmUgdW5kZWZpbmVkXG4gIC8vIGJlY2F1c2UgZGlmZmVyZW50IGJyb3dzZXIgb3Igc29tZSAzcmQgcGFydHkgcGx1Z2luLlxuICBpZiAoIXRhcmdldCkge1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zdCBmaWx0ZXJlZFByb3BlcnRpZXM6IHN0cmluZ1tdID0gZmlsdGVyUHJvcGVydGllcyh0YXJnZXQsIG9uUHJvcGVydGllcywgaWdub3JlUHJvcGVydGllcyk7XG4gIHBhdGNoT25Qcm9wZXJ0aWVzKHRhcmdldCwgZmlsdGVyZWRQcm9wZXJ0aWVzLCBwcm90b3R5cGUpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJvcGVydHlEZXNjcmlwdG9yUGF0Y2goYXBpOiBfWm9uZVByaXZhdGUsIF9nbG9iYWw6IGFueSkge1xuICBpZiAoaXNOb2RlICYmICFpc01peCkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHN1cHBvcnRzV2ViU29ja2V0ID0gdHlwZW9mIFdlYlNvY2tldCAhPT0gJ3VuZGVmaW5lZCc7XG4gIGlmIChjYW5QYXRjaFZpYVByb3BlcnR5RGVzY3JpcHRvcigpKSB7XG4gICAgY29uc3QgaWdub3JlUHJvcGVydGllczogSWdub3JlUHJvcGVydHlbXSA9IF9nbG9iYWxbJ19fWm9uZV9pZ25vcmVfb25fcHJvcGVydGllcyddO1xuICAgIC8vIGZvciBicm93c2VycyB0aGF0IHdlIGNhbiBwYXRjaCB0aGUgZGVzY3JpcHRvcjogIENocm9tZSAmIEZpcmVmb3hcbiAgICBpZiAoaXNCcm93c2VyKSB7XG4gICAgICBjb25zdCBpbnRlcm5hbFdpbmRvdzogYW55ID0gd2luZG93O1xuICAgICAgY29uc3QgaWdub3JlRXJyb3JQcm9wZXJ0aWVzID1cbiAgICAgICAgICBpc0lFID8gW3t0YXJnZXQ6IGludGVybmFsV2luZG93LCBpZ25vcmVQcm9wZXJ0aWVzOiBbJ2Vycm9yJ119XSA6IFtdO1xuICAgICAgLy8gaW4gSUUvRWRnZSwgb25Qcm9wIG5vdCBleGlzdCBpbiB3aW5kb3cgb2JqZWN0LCBidXQgaW4gV2luZG93UHJvdG90eXBlXG4gICAgICAvLyBzbyB3ZSBuZWVkIHRvIHBhc3MgV2luZG93UHJvdG90eXBlIHRvIGNoZWNrIG9uUHJvcCBleGlzdCBvciBub3RcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFxuICAgICAgICAgIGludGVybmFsV2luZG93LCBldmVudE5hbWVzLmNvbmNhdChbJ21lc3NhZ2VlcnJvciddKSxcbiAgICAgICAgICBpZ25vcmVQcm9wZXJ0aWVzID8gaWdub3JlUHJvcGVydGllcy5jb25jYXQoaWdub3JlRXJyb3JQcm9wZXJ0aWVzKSA6IGlnbm9yZVByb3BlcnRpZXMsXG4gICAgICAgICAgT2JqZWN0R2V0UHJvdG90eXBlT2YoaW50ZXJuYWxXaW5kb3cpKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKERvY3VtZW50LnByb3RvdHlwZSwgZXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG5cbiAgICAgIGlmICh0eXBlb2YgaW50ZXJuYWxXaW5kb3dbJ1NWR0VsZW1lbnQnXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgICBpbnRlcm5hbFdpbmRvd1snU1ZHRWxlbWVudCddLnByb3RvdHlwZSwgZXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhFbGVtZW50LnByb3RvdHlwZSwgZXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhIVE1MRWxlbWVudC5wcm90b3R5cGUsIGV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSFRNTE1lZGlhRWxlbWVudC5wcm90b3R5cGUsIG1lZGlhRWxlbWVudEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoXG4gICAgICAgICAgSFRNTEZyYW1lU2V0RWxlbWVudC5wcm90b3R5cGUsIHdpbmRvd0V2ZW50TmFtZXMuY29uY2F0KGZyYW1lU2V0RXZlbnROYW1lcyksXG4gICAgICAgICAgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICAgICAgICBIVE1MQm9keUVsZW1lbnQucHJvdG90eXBlLCB3aW5kb3dFdmVudE5hbWVzLmNvbmNhdChmcmFtZVNldEV2ZW50TmFtZXMpLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEhUTUxGcmFtZUVsZW1lbnQucHJvdG90eXBlLCBmcmFtZUV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSFRNTElGcmFtZUVsZW1lbnQucHJvdG90eXBlLCBmcmFtZUV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuXG4gICAgICBjb25zdCBIVE1MTWFycXVlZUVsZW1lbnQgPSBpbnRlcm5hbFdpbmRvd1snSFRNTE1hcnF1ZWVFbGVtZW50J107XG4gICAgICBpZiAoSFRNTE1hcnF1ZWVFbGVtZW50KSB7XG4gICAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKEhUTUxNYXJxdWVlRWxlbWVudC5wcm90b3R5cGUsIG1hcnF1ZWVFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIH1cbiAgICAgIGNvbnN0IFdvcmtlciA9IGludGVybmFsV2luZG93WydXb3JrZXInXTtcbiAgICAgIGlmIChXb3JrZXIpIHtcbiAgICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoV29ya2VyLnByb3RvdHlwZSwgd29ya2VyRXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICB9XG4gICAgfVxuICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZSwgWE1MSHR0cFJlcXVlc3RFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICBjb25zdCBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0ID0gX2dsb2JhbFsnWE1MSHR0cFJlcXVlc3RFdmVudFRhcmdldCddO1xuICAgIGlmIChYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0KSB7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhcbiAgICAgICAgICBYTUxIdHRwUmVxdWVzdEV2ZW50VGFyZ2V0ICYmIFhNTEh0dHBSZXF1ZXN0RXZlbnRUYXJnZXQucHJvdG90eXBlLFxuICAgICAgICAgIFhNTEh0dHBSZXF1ZXN0RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgfVxuICAgIGlmICh0eXBlb2YgSURCSW5kZXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJJbmRleC5wcm90b3R5cGUsIElEQkluZGV4RXZlbnROYW1lcywgaWdub3JlUHJvcGVydGllcyk7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhJREJSZXF1ZXN0LnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICAgIHBhdGNoRmlsdGVyZWRQcm9wZXJ0aWVzKElEQk9wZW5EQlJlcXVlc3QucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCRGF0YWJhc2UucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCVHJhbnNhY3Rpb24ucHJvdG90eXBlLCBJREJJbmRleEV2ZW50TmFtZXMsIGlnbm9yZVByb3BlcnRpZXMpO1xuICAgICAgcGF0Y2hGaWx0ZXJlZFByb3BlcnRpZXMoSURCQ3Vyc29yLnByb3RvdHlwZSwgSURCSW5kZXhFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICB9XG4gICAgaWYgKHN1cHBvcnRzV2ViU29ja2V0KSB7XG4gICAgICBwYXRjaEZpbHRlcmVkUHJvcGVydGllcyhXZWJTb2NrZXQucHJvdG90eXBlLCB3ZWJzb2NrZXRFdmVudE5hbWVzLCBpZ25vcmVQcm9wZXJ0aWVzKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgLy8gU2FmYXJpLCBBbmRyb2lkIGJyb3dzZXJzIChKZWxseSBCZWFuKVxuICAgIHBhdGNoVmlhQ2FwdHVyaW5nQWxsVGhlRXZlbnRzKCk7XG4gICAgcGF0Y2hDbGFzcygnWE1MSHR0cFJlcXVlc3QnKTtcbiAgICBpZiAoc3VwcG9ydHNXZWJTb2NrZXQpIHtcbiAgICAgIHdlYlNvY2tldFBhdGNoLmFwcGx5KGFwaSwgX2dsb2JhbCk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGNhblBhdGNoVmlhUHJvcGVydHlEZXNjcmlwdG9yKCkge1xuICBpZiAoKGlzQnJvd3NlciB8fCBpc01peCkgJiYgIU9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihIVE1MRWxlbWVudC5wcm90b3R5cGUsICdvbmNsaWNrJykgJiZcbiAgICAgIHR5cGVvZiBFbGVtZW50ICE9PSAndW5kZWZpbmVkJykge1xuICAgIC8vIFdlYktpdCBodHRwczovL2J1Z3Mud2Via2l0Lm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MTM0MzY0XG4gICAgLy8gSURMIGludGVyZmFjZSBhdHRyaWJ1dGVzIGFyZSBub3QgY29uZmlndXJhYmxlXG4gICAgY29uc3QgZGVzYyA9IE9iamVjdEdldE93blByb3BlcnR5RGVzY3JpcHRvcihFbGVtZW50LnByb3RvdHlwZSwgJ29uY2xpY2snKTtcbiAgICBpZiAoZGVzYyAmJiAhZGVzYy5jb25maWd1cmFibGUpIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGNvbnN0IE9OX1JFQURZX1NUQVRFX0NIQU5HRSA9ICdvbnJlYWR5c3RhdGVjaGFuZ2UnO1xuICBjb25zdCBYTUxIdHRwUmVxdWVzdFByb3RvdHlwZSA9IFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZTtcblxuICBjb25zdCB4aHJEZXNjID0gT2JqZWN0R2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCBPTl9SRUFEWV9TVEFURV9DSEFOR0UpO1xuXG4gIC8vIGFkZCBlbnVtZXJhYmxlIGFuZCBjb25maWd1cmFibGUgaGVyZSBiZWNhdXNlIGluIG9wZXJhXG4gIC8vIGJ5IGRlZmF1bHQgWE1MSHR0cFJlcXVlc3QucHJvdG90eXBlLm9ucmVhZHlzdGF0ZWNoYW5nZSBpcyB1bmRlZmluZWRcbiAgLy8gd2l0aG91dCBhZGRpbmcgZW51bWVyYWJsZSBhbmQgY29uZmlndXJhYmxlIHdpbGwgY2F1c2Ugb25yZWFkeXN0YXRlY2hhbmdlXG4gIC8vIG5vbi1jb25maWd1cmFibGVcbiAgLy8gYW5kIGlmIFhNTEh0dHBSZXF1ZXN0LnByb3RvdHlwZS5vbnJlYWR5c3RhdGVjaGFuZ2UgaXMgdW5kZWZpbmVkLFxuICAvLyB3ZSBzaG91bGQgc2V0IGEgcmVhbCBkZXNjIGluc3RlYWQgYSBmYWtlIG9uZVxuICBpZiAoeGhyRGVzYykge1xuICAgIE9iamVjdERlZmluZVByb3BlcnR5KFhNTEh0dHBSZXF1ZXN0UHJvdG90eXBlLCBPTl9SRUFEWV9TVEFURV9DSEFOR0UsIHtcbiAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBjb25zdCByZXN1bHQgPSAhIXJlcS5vbnJlYWR5c3RhdGVjaGFuZ2U7XG4gICAgLy8gcmVzdG9yZSBvcmlnaW5hbCBkZXNjXG4gICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSwgeGhyRGVzYyB8fCB7fSk7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBTWU1CT0xfRkFLRV9PTlJFQURZU1RBVEVDSEFOR0UgPSB6b25lU3ltYm9sKCdmYWtlJyk7XG4gICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoWE1MSHR0cFJlcXVlc3RQcm90b3R5cGUsIE9OX1JFQURZX1NUQVRFX0NIQU5HRSwge1xuICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgIGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzW1NZTUJPTF9GQUtFX09OUkVBRFlTVEFURUNIQU5HRV07XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB0aGlzW1NZTUJPTF9GQUtFX09OUkVBRFlTVEFURUNIQU5HRV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBjb25zdCByZXEgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcbiAgICBjb25zdCBkZXRlY3RGdW5jID0gKCkgPT4ge307XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGRldGVjdEZ1bmM7XG4gICAgY29uc3QgcmVzdWx0ID0gKHJlcSBhcyBhbnkpW1NZTUJPTF9GQUtFX09OUkVBRFlTVEFURUNIQU5HRV0gPT09IGRldGVjdEZ1bmM7XG4gICAgcmVxLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IG51bGwgYXMgYW55O1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbn1cblxuY29uc3QgdW5ib3VuZEtleSA9IHpvbmVTeW1ib2woJ3VuYm91bmQnKTtcblxuLy8gV2hlbmV2ZXIgYW55IGV2ZW50TGlzdGVuZXIgZmlyZXMsIHdlIGNoZWNrIHRoZSBldmVudExpc3RlbmVyIHRhcmdldCBhbmQgYWxsIHBhcmVudHNcbi8vIGZvciBgb253aGF0ZXZlcmAgcHJvcGVydGllcyBhbmQgcmVwbGFjZSB0aGVtIHdpdGggem9uZS1ib3VuZCBmdW5jdGlvbnNcbi8vIC0gQ2hyb21lIChmb3Igbm93KVxuZnVuY3Rpb24gcGF0Y2hWaWFDYXB0dXJpbmdBbGxUaGVFdmVudHMoKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZXZlbnROYW1lcy5sZW5ndGg7IGkrKykge1xuICAgIGNvbnN0IHByb3BlcnR5ID0gZXZlbnROYW1lc1tpXTtcbiAgICBjb25zdCBvbnByb3BlcnR5ID0gJ29uJyArIHByb3BlcnR5O1xuICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcihwcm9wZXJ0eSwgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgIGxldCBlbHQ6IGFueSA9IDxOb2RlPmV2ZW50LnRhcmdldCwgYm91bmQsIHNvdXJjZTtcbiAgICAgIGlmIChlbHQpIHtcbiAgICAgICAgc291cmNlID0gZWx0LmNvbnN0cnVjdG9yWyduYW1lJ10gKyAnLicgKyBvbnByb3BlcnR5O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc291cmNlID0gJ3Vua25vd24uJyArIG9ucHJvcGVydHk7XG4gICAgICB9XG4gICAgICB3aGlsZSAoZWx0KSB7XG4gICAgICAgIGlmIChlbHRbb25wcm9wZXJ0eV0gJiYgIWVsdFtvbnByb3BlcnR5XVt1bmJvdW5kS2V5XSkge1xuICAgICAgICAgIGJvdW5kID0gd3JhcFdpdGhDdXJyZW50Wm9uZShlbHRbb25wcm9wZXJ0eV0sIHNvdXJjZSk7XG4gICAgICAgICAgYm91bmRbdW5ib3VuZEtleV0gPSBlbHRbb25wcm9wZXJ0eV07XG4gICAgICAgICAgZWx0W29ucHJvcGVydHldID0gYm91bmQ7XG4gICAgICAgIH1cbiAgICAgICAgZWx0ID0gZWx0LnBhcmVudEVsZW1lbnQ7XG4gICAgICB9XG4gICAgfSwgdHJ1ZSk7XG4gIH1cbn1cbiJdfQ==