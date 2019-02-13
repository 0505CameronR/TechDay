"use strict";
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
Object.defineProperty(exports, "__esModule", { value: true });
require("./node_util");
require("./events");
require("./fs");
var events_1 = require("../common/events");
var timers_1 = require("../common/timers");
var utils_1 = require("../common/utils");
var set = 'set';
var clear = 'clear';
Zone.__load_patch('node_timers', function (global, Zone) {
    // Timers
    var globalUseTimeoutFromTimer = false;
    try {
        var timers = require('timers');
        var globalEqualTimersTimeout = global.setTimeout === timers.setTimeout;
        if (!globalEqualTimersTimeout && !utils_1.isMix) {
            // 1. if isMix, then we are in mix environment such as Electron
            // we should only patch timers.setTimeout because global.setTimeout
            // have been patched
            // 2. if global.setTimeout not equal timers.setTimeout, check
            // whether global.setTimeout use timers.setTimeout or not
            var originSetTimeout_1 = timers.setTimeout;
            timers.setTimeout = function () {
                globalUseTimeoutFromTimer = true;
                return originSetTimeout_1.apply(this, arguments);
            };
            var detectTimeout = global.setTimeout(function () { }, 100);
            clearTimeout(detectTimeout);
            timers.setTimeout = originSetTimeout_1;
        }
        timers_1.patchTimer(timers, set, clear, 'Timeout');
        timers_1.patchTimer(timers, set, clear, 'Interval');
        timers_1.patchTimer(timers, set, clear, 'Immediate');
    }
    catch (error) {
        // timers module not exists, for example, when we using nativeScript
        // timers is not available
    }
    if (utils_1.isMix) {
        // if we are in mix environment, such as Electron,
        // the global.setTimeout has already been patched,
        // so we just patch timers.setTimeout
        return;
    }
    if (!globalUseTimeoutFromTimer) {
        // 1. global setTimeout equals timers setTimeout
        // 2. or global don't use timers setTimeout(maybe some other library patch setTimeout)
        // 3. or load timers module error happens, we should patch global setTimeout
        timers_1.patchTimer(global, set, clear, 'Timeout');
        timers_1.patchTimer(global, set, clear, 'Interval');
        timers_1.patchTimer(global, set, clear, 'Immediate');
    }
    else {
        // global use timers setTimeout, but not equals
        // this happens when use nodejs v0.10.x, global setTimeout will
        // use a lazy load version of timers setTimeout
        // we should not double patch timer's setTimeout
        // so we only store the __symbol__ for consistency
        global[Zone.__symbol__('setTimeout')] = global.setTimeout;
        global[Zone.__symbol__('setInterval')] = global.setInterval;
        global[Zone.__symbol__('setImmediate')] = global.setImmediate;
    }
});
// patch process related methods
Zone.__load_patch('nextTick', function () {
    // patch nextTick as microTask
    utils_1.patchMicroTask(process, 'nextTick', function (self, args) {
        return {
            name: 'process.nextTick',
            args: args,
            cbIdx: (args.length > 0 && typeof args[0] === 'function') ? 0 : -1,
            target: process
        };
    });
});
Zone.__load_patch('handleUnhandledPromiseRejection', function (global, Zone, api) {
    Zone[api.symbol('unhandledPromiseRejectionHandler')] =
        findProcessPromiseRejectionHandler('unhandledRejection');
    Zone[api.symbol('rejectionHandledHandler')] =
        findProcessPromiseRejectionHandler('rejectionHandled');
    // handle unhandled promise rejection
    function findProcessPromiseRejectionHandler(evtName) {
        return function (e) {
            var eventTasks = events_1.findEventTasks(process, evtName);
            eventTasks.forEach(function (eventTask) {
                // process has added unhandledrejection event listener
                // trigger the event listener
                if (evtName === 'unhandledRejection') {
                    eventTask.invoke(e.rejection, e.promise);
                }
                else if (evtName === 'rejectionHandled') {
                    eventTask.invoke(e.promise);
                }
            });
        };
    }
});
// Crypto
Zone.__load_patch('crypto', function () {
    var crypto;
    try {
        crypto = require('crypto');
    }
    catch (err) {
    }
    // use the generic patchMacroTask to patch crypto
    if (crypto) {
        var methodNames = ['randomBytes', 'pbkdf2'];
        methodNames.forEach(function (name) {
            utils_1.patchMacroTask(crypto, name, function (self, args) {
                return {
                    name: 'crypto.' + name,
                    args: args,
                    cbIdx: (args.length > 0 && typeof args[args.length - 1] === 'function') ?
                        args.length - 1 :
                        -1,
                    target: crypto
                };
            });
        });
    }
});
Zone.__load_patch('console', function (global, Zone) {
    var consoleMethods = ['dir', 'log', 'info', 'error', 'warn', 'assert', 'debug', 'timeEnd', 'trace'];
    consoleMethods.forEach(function (m) {
        var originalMethod = console[Zone.__symbol__(m)] = console[m];
        if (originalMethod) {
            console[m] = function () {
                var args = utils_1.ArraySlice.call(arguments);
                if (Zone.current === Zone.root) {
                    return originalMethod.apply(this, args);
                }
                else {
                    return Zone.root.run(originalMethod, this, args);
                }
            };
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvbm9kZS9ub2RlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7O0FBRUgsdUJBQXFCO0FBQ3JCLG9CQUFrQjtBQUNsQixnQkFBYztBQUVkLDJDQUFnRDtBQUNoRCwyQ0FBNEM7QUFDNUMseUNBQWtGO0FBRWxGLElBQU0sR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNsQixJQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFFdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBYztJQUMzRCxTQUFTO0lBQ1QsSUFBSSx5QkFBeUIsR0FBRyxLQUFLLENBQUM7SUFDdEMsSUFBSTtRQUNGLElBQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUNqQyxJQUFJLHdCQUF3QixHQUFHLE1BQU0sQ0FBQyxVQUFVLEtBQUssTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUN2RSxJQUFJLENBQUMsd0JBQXdCLElBQUksQ0FBQyxhQUFLLEVBQUU7WUFDdkMsK0RBQStEO1lBQy9ELG1FQUFtRTtZQUNuRSxvQkFBb0I7WUFDcEIsNkRBQTZEO1lBQzdELHlEQUF5RDtZQUN6RCxJQUFNLGtCQUFnQixHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7WUFDM0MsTUFBTSxDQUFDLFVBQVUsR0FBRztnQkFDbEIseUJBQXlCLEdBQUcsSUFBSSxDQUFDO2dCQUNqQyxPQUFPLGtCQUFnQixDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDakQs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Q04sTUFBTSxFQUFFLE1BQU07aUJBQ2YsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLFlBQVksQ0FBQyxTQUFTLEVBQUUsVUFBQyxNQUFXLEVBQUUsSUFBYztJQUN2RCxJQUFNLGNBQWMsR0FDaEIsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLEVBQUUsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ25GLGNBQWMsQ0FBQyxPQUFPLENBQUMsVUFBQyxDQUFTO1FBQy9CLElBQU0sY0FBYyxHQUFJLE9BQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUksT0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xGLElBQUksY0FBYyxFQUFFO1lBQ2pCLE9BQWUsQ0FBQyxDQUFDLENBQUMsR0FBRztnQkFDcEIsSUFBTSxJQUFJLEdBQUcsa0JBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7Z0JBQ3hDLElBQUksSUFBSSxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsSUFBSSxFQUFFO29CQUM5QixPQUFPLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUN6QztxQkFBTTtvQkFDTCxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7aUJBQ2xEO1lBQ0gsQ0FBQyxDQUFDO1NBQ0g7SUFDSCxDQUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgJy4vbm9kZV91dGlsJztcbmltcG9ydCAnLi9ldmVudHMnO1xuaW1wb3J0ICcuL2ZzJztcblxuaW1wb3J0IHtmaW5kRXZlbnRUYXNrc30gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQge3BhdGNoVGltZXJ9IGZyb20gJy4uL2NvbW1vbi90aW1lcnMnO1xuaW1wb3J0IHtBcnJheVNsaWNlLCBpc01peCwgcGF0Y2hNYWNyb1Rhc2ssIHBhdGNoTWljcm9UYXNrfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5jb25zdCBzZXQgPSAnc2V0JztcbmNvbnN0IGNsZWFyID0gJ2NsZWFyJztcblxuWm9uZS5fX2xvYWRfcGF0Y2goJ25vZGVfdGltZXJzJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSkgPT4ge1xuICAvLyBUaW1lcnNcbiAgbGV0IGdsb2JhbFVzZVRpbWVvdXRGcm9tVGltZXIgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lcnMgPSByZXF1aXJlKCd0aW1lcnMnKTtcbiAgICBsZXQgZ2xvYmFsRXF1YWxUaW1lcnNUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQgPT09IHRpbWVycy5zZXRUaW1lb3V0O1xuICAgIGlmICghZ2xvYmFsRXF1YWxUaW1lcnNUaW1lb3V0ICYmICFpc01peCkge1xuICAgICAgLy8gMS4gaWYgaXNNaXgsIHRoZW4gd2UgYXJlIGluIG1peCBlbnZpcm9ubWVudCBzdWNoIGFzIEVsZWN0cm9uXG4gICAgICAvLyB3ZSBzaG91bGQgb25seSBwYXRjaCB0aW1lcnMuc2V0VGltZW91dCBiZWNhdXNlIGdsb2JhbC5zZXRUaW1lb3V0XG4gICAgICAvLyBoYXZlIGJlZW4gcGF0Y2hlZFxuICAgICAgLy8gMi4gaWYgZ2xvYmFsLnNldFRpbWVvdXQgbm90IGVxdWFsIHRpbWVycy5zZXRUaW1lb3V0LCBjaGVja1xuICAgICAgLy8gd2hldGhlciBnbG9iYWwuc2V0VGltZW91dCB1c2UgdGltZXJzLnNldFRpbWVvdXQgb3Igbm90XG4gICAgICBjb25zdCBvcmlnaW5TZXRUaW1lb3V0ID0gdGltZXJzLnNldFRpbWVvdXQ7XG4gICAgICB0aW1lcnMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBnbG9iYWxVc2VUaW1lb3V0RnJvbVRpbWVyID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG9yaWdpblNldFRpbWVvdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBkZXRlY3RUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQoKCkgPT4ge30sIDEwMCk7XG4gICAgICBjbGVhclRpbWVvdXQoZGV0ZWN0VGltZW91dCk7XG4gICAgICB0aW1lcnMuc2V0VGltZW91dCA9IG9yaWdpblNldFRpbWVvdXQ7XG4gICAgfVxuICAgIHBhdGNoVGltZXIodGltZXJzLCBzZXQsIGNsZWFyLCAnVGltZW91dCcpO1xuICAgIHBhdGNoVGltZXIodGltZXJzLCBzZXQsIGNsZWFyLCAnSW50ZXJ2YWwnKTtcbiAgICBwYXRjaFRpbWVyKHRpbWVycywgc2V0LCBjbGVhciwgJ0ltbWVkaWF0ZScpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIHRpbWVycyBtb2R1bGUgbm90IGV4aXN0cywgZm9yIGV4YW1wbGUsIHdoZW4gd2UgdXNpbmcgbmF0aXZlU2NyaXB0XG4gICAgLy8gdGltZXJzIGlzIG5vdCBhdmFpbGFibGVcbiAgfVxuICBpZiAoaXNNaXgpIHtcbiAgICAvLyBpZiB3ZSBhcmUgaW4gbWl4IGVudmlyb25tZW50LCBzdWNoIGFzIEVsZWN0cm9uLFxuICAgIC8vIHRoZSBnbG9iYWwuc2V0VGltZW91dCBoYXMgYWxyZWFkeSBiZWVuIHBhdGNoZWQsXG4gICAgLy8gc28gd2UganVzdCBwYXRjaCB0aW1lcnMuc2V0VGltZW91dFxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWdsb2JhbFVzZVRpbWVvdXRGcm9tVGltZXIpIHtcbiAgICAvLyAxLiBnbG9iYWwgc2V0VGltZW91dCBlcXVhbHMgdGltZXJzIHNldFRpbWVvdXRcbiAgICAvLyAyLiBvciBnbG9iYWwgZG9uJ3QgdXNlIHRpbWVycyBzZXRUaW1lb3V0KG1heWJlIHNvbWUgb3RoZXIgbGlicmFyeSBwYXRjaCBzZXRUaW1lb3V0KVxuICAgIC8vIDMuIG9yIGxvYWQgdGltZXJzIG1vZHVsZSBlcnJvciBoYXBwZW5zLCB3ZSBzaG91bGQgcGF0Y2ggZ2xvYmFsIHNldFRpbWVvdXRcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ1RpbWVvdXQnKTtcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ0ludGVydmFsJyk7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdJbW1lZGlhdGUnKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBnbG9iYWwgdXNlIHRpbWVycyBzZXRUaW1lb3V0LCBidXQgbm90IGVxdWFsc1xuICAgIC8vIHRoaXMgaGFwcGVucyB3aGVuIHVzZSBub2RlanMgdjAuMTAueCwgZ2xvYmFsIHNldFRpbWVvdXQgd2lsbFxuICAgIC8vIHVzZSBhIGxhenkgbG9hZCB2ZXJzaW9uIG9mIHRpbWVycyBzZXRUaW1lb3V0XG4gICAgLy8gd2Ugc2hvdWxkIG5vdCBkb3VibGUgcGF0Y2ggdGltZXIncyBzZXRUaW1lb3V0XG4gICAgLy8gc28gd2Ugb25seSBzdG9yZSB0aGUgX19zeW1ib2xfXyBmb3IgY29uc2lzdGVuY3lcbiAgICBnbG9iYWxbWm9uZS5fX3N5bWJvbF9fKCdzZXRUaW1lb3V0JyldID0gZ2xvYmFsLnNldFRpbWVvdXQ7XG4gICAgZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnc2V0SW50ZXJ2YWwnKV0gPSBnbG9iYWwuc2V0SW50ZXJ2YWw7XG4gICAgZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnc2V0SW1tZWRpYXRlJyldID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbiAgfVxufSk7XG5cbi8vIHBhdGNoIHByb2Nlc3MgcmVsYXRlZCBtZXRob2RzXG5ab25lLl9fbG9hZF9wYXRjaCgnbmV4dFRpY2snLCAoKSA9PiB7XG4gIC8vIHBhdGNoIG5leHRUaWNrIGFzIG1pY3JvVGFza1xuICBwYXRjaE1pY3JvVGFzayhwcm9jZXNzLCAnbmV4dFRpY2snLCAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAncHJvY2Vzcy5uZXh0VGljaycsXG4gICAgICBhcmdzOiBhcmdzLFxuICAgICAgY2JJZHg6IChhcmdzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpID8gMCA6IC0xLFxuICAgICAgdGFyZ2V0OiBwcm9jZXNzXG4gICAgfTtcbiAgfSk7XG59KTtcblxuWm9uZS5fX2xvYWRfcGF0Y2goXG4gICAgJ2hhbmRsZVVuaGFuZGxlZFByb21pc2VSZWplY3Rpb24nLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICAgICAgKFpvbmUgYXMgYW55KVthcGkuc3ltYm9sKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpXSA9XG4gICAgICAgICAgZmluZFByb2Nlc3NQcm9taXNlUmVqZWN0aW9uSGFuZGxlcigndW5oYW5kbGVkUmVqZWN0aW9uJyk7XG5cbiAgICAgIChab25lIGFzIGFueSlbYXBpLnN5bWJvbCgncmVqZWN0aW9uSGFuZGxlZEhhbmRsZXInKV0gPVxuICAgICAgICAgIGZpbmRQcm9jZXNzUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3JlamVjdGlvbkhhbmRsZWQnKTtcblxuICAgICAgLy8gaGFuZGxlIHVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvblxuICAgICAgZnVuY3Rpb24gZmluZFByb2Nlc3NQcm9taXNlUmVqZWN0aW9uSGFuZGxlcihldnROYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGU6IGFueSkge1xuICAgICAgICAgIGNvbnN0IGV2ZW50VGFza3MgPSBmaW5kRXZlbnRUYXNrcyhwcm9jZXNzLCBldnROYW1lKTtcbiAgICAgICAgICBldmVudFRhc2tzLmZvckVhY2goZXZlbnRUYXNrID0+IHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgaGFzIGFkZGVkIHVuaGFuZGxlZHJlamVjdGlvbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgLy8gdHJpZ2dlciB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIGlmIChldnROYW1lID09PSAndW5oYW5kbGVkUmVqZWN0aW9uJykge1xuICAgICAgICAgICAgICBldmVudFRhc2suaW52b2tlKGUucmVqZWN0aW9uLCBlLnByb21pc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldnROYW1lID09PSAncmVqZWN0aW9uSGFuZGxlZCcpIHtcbiAgICAgICAgICAgICAgZXZlbnRUYXNrLmludm9rZShlLnByb21pc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG5cbi8vIENyeXB0b1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2NyeXB0bycsICgpID0+IHtcbiAgbGV0IGNyeXB0bzogYW55O1xuICB0cnkge1xuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgfVxuXG4gIC8vIHVzZSB0aGUgZ2VuZXJpYyBwYXRjaE1hY3JvVGFzayB0byBwYXRjaCBjcnlwdG9cbiAgaWYgKGNyeXB0bykge1xuICAgIGNvbnN0IG1ldGhvZE5hbWVzID0gWydyYW5kb21CeXRlcycsICdwYmtkZjInXTtcbiAgICBtZXRob2ROYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgcGF0Y2hNYWNyb1Rhc2soY3J5cHRvLCBuYW1lLCAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6ICdjcnlwdG8uJyArIG5hbWUsXG4gICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICBjYklkeDogKGFyZ3MubGVuZ3RoID4gMCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICAgIGFyZ3MubGVuZ3RoIC0gMSA6XG4gICAgICAgICAgICAgIC0xLFxuICAgICAgICAgIHRhcmdldDogY3J5cHRvXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdjb25zb2xlJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSkgPT4ge1xuICBjb25zdCBjb25zb2xlTWV0aG9kcyA9XG4gICAgICBbJ2RpcicsICdsb2cnLCAnaW5mbycsICdlcnJvcicsICd3YXJuJywgJ2Fzc2VydCcsICdkZWJ1ZycsICd0aW1lRW5kJywgJ3RyYWNlJ107XG4gIGNvbnNvbGVNZXRob2RzLmZvckVhY2goKG06IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gKGNvbnNvbGUgYXMgYW55KVtab25lLl9fc3ltYm9sX18obSldID0gKGNvbnNvbGUgYXMgYW55KVttXTtcbiAgICBpZiAob3JpZ2luYWxNZXRob2QpIHtcbiAgICAgIChjb25zb2xlIGFzIGFueSlbbV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IEFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBpZiAoWm9uZS5jdXJyZW50ID09PSBab25lLnJvb3QpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFpvbmUucm9vdC5ydW4ob3JpZ2luYWxNZXRob2QsIHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==