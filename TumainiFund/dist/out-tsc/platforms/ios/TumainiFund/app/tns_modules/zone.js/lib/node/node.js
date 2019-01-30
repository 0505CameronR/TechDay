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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL25vZGUvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HOztBQUVILHVCQUFxQjtBQUNyQixvQkFBa0I7QUFDbEIsZ0JBQWM7QUFFZCwyQ0FBZ0Q7QUFDaEQsMkNBQTRDO0FBQzVDLHlDQUFrRjtBQUVsRixJQUFNLEdBQUcsR0FBRyxLQUFLLENBQUM7QUFDbEIsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDO0FBRXRCLElBQUksQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWM7SUFDM0QsU0FBUztJQUNULElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLElBQUk7UUFDRixJQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdkUsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsYUFBSyxFQUFFO1lBQ3ZDLCtEQUErRDtZQUMvRCxtRUFBbUU7WUFDbkUsb0JBQW9CO1lBQ3BCLDZEQUE2RDtZQUM3RCx5REFBeUQ7WUFDekQsSUFBTSxrQkFBZ0IsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxVQUFVLEdBQUc7Z0JBQ2xCLHlCQUF5QixHQUFHLElBQUksQ0FBQztnQkFDakMsT0FBTyxrQkFBZ0IsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBQ2pELENBQUMsQ0FBQztZQUNGLElBQU0sYUFBYSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUMsY0FBTyxDQUFDLEVBQUUsR0FBRyxDQUFDLENB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SCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxFQUFFLFVBQUMsTUFBVyxFQUFFLElBQWM7SUFDdkQsSUFBTSxjQUFjLEdBQ2hCLENBQUMsS0FBSyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNuRixjQUFjLENBQUMsT0FBTyxDQUFDLFVBQUMsQ0FBUztRQUMvQixJQUFNLGNBQWMsR0FBSSxPQUFlLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFJLE9BQWUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNsRixJQUFJLGNBQWMsRUFBRTtZQUNqQixPQUFlLENBQUMsQ0FBQyxDQUFDLEdBQUc7Z0JBQ3BCLElBQU0sSUFBSSxHQUFHLGtCQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLElBQUksQ0FBQyxPQUFPLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRTtvQkFDOUIsT0FBTyxjQUFjLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztpQkFDekM7cUJBQU07b0JBQ0wsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO2lCQUNsRDtZQUNILENBQUMsQ0FBQztTQUNIO0lBQ0gsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuaW1wb3J0ICcuL25vZGVfdXRpbCc7XG5pbXBvcnQgJy4vZXZlbnRzJztcbmltcG9ydCAnLi9mcyc7XG5cbmltcG9ydCB7ZmluZEV2ZW50VGFza3N9IGZyb20gJy4uL2NvbW1vbi9ldmVudHMnO1xuaW1wb3J0IHtwYXRjaFRpbWVyfSBmcm9tICcuLi9jb21tb24vdGltZXJzJztcbmltcG9ydCB7QXJyYXlTbGljZSwgaXNNaXgsIHBhdGNoTWFjcm9UYXNrLCBwYXRjaE1pY3JvVGFza30gZnJvbSAnLi4vY29tbW9uL3V0aWxzJztcblxuY29uc3Qgc2V0ID0gJ3NldCc7XG5jb25zdCBjbGVhciA9ICdjbGVhcic7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdub2RlX3RpbWVycycsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUpID0+IHtcbiAgLy8gVGltZXJzXG4gIGxldCBnbG9iYWxVc2VUaW1lb3V0RnJvbVRpbWVyID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdGltZXJzID0gcmVxdWlyZSgndGltZXJzJyk7XG4gICAgbGV0IGdsb2JhbEVxdWFsVGltZXJzVGltZW91dCA9IGdsb2JhbC5zZXRUaW1lb3V0ID09PSB0aW1lcnMuc2V0VGltZW91dDtcbiAgICBpZiAoIWdsb2JhbEVxdWFsVGltZXJzVGltZW91dCAmJiAhaXNNaXgpIHtcbiAgICAgIC8vIDEuIGlmIGlzTWl4LCB0aGVuIHdlIGFyZSBpbiBtaXggZW52aXJvbm1lbnQgc3VjaCBhcyBFbGVjdHJvblxuICAgICAgLy8gd2Ugc2hvdWxkIG9ubHkgcGF0Y2ggdGltZXJzLnNldFRpbWVvdXQgYmVjYXVzZSBnbG9iYWwuc2V0VGltZW91dFxuICAgICAgLy8gaGF2ZSBiZWVuIHBhdGNoZWRcbiAgICAgIC8vIDIuIGlmIGdsb2JhbC5zZXRUaW1lb3V0IG5vdCBlcXVhbCB0aW1lcnMuc2V0VGltZW91dCwgY2hlY2tcbiAgICAgIC8vIHdoZXRoZXIgZ2xvYmFsLnNldFRpbWVvdXQgdXNlIHRpbWVycy5zZXRUaW1lb3V0IG9yIG5vdFxuICAgICAgY29uc3Qgb3JpZ2luU2V0VGltZW91dCA9IHRpbWVycy5zZXRUaW1lb3V0O1xuICAgICAgdGltZXJzLnNldFRpbWVvdXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgZ2xvYmFsVXNlVGltZW91dEZyb21UaW1lciA9IHRydWU7XG4gICAgICAgIHJldHVybiBvcmlnaW5TZXRUaW1lb3V0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgICAgY29uc3QgZGV0ZWN0VGltZW91dCA9IGdsb2JhbC5zZXRUaW1lb3V0KCgpID0+IHt9LCAxMDApO1xuICAgICAgY2xlYXJUaW1lb3V0KGRldGVjdFRpbWVvdXQpO1xuICAgICAgdGltZXJzLnNldFRpbWVvdXQgPSBvcmlnaW5TZXRUaW1lb3V0O1xuICAgIH1cbiAgICBwYXRjaFRpbWVyKHRpbWVycywgc2V0LCBjbGVhciwgJ1RpbWVvdXQnKTtcbiAgICBwYXRjaFRpbWVyKHRpbWVycywgc2V0LCBjbGVhciwgJ0ludGVydmFsJyk7XG4gICAgcGF0Y2hUaW1lcih0aW1lcnMsIHNldCwgY2xlYXIsICdJbW1lZGlhdGUnKTtcbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAvLyB0aW1lcnMgbW9kdWxlIG5vdCBleGlzdHMsIGZvciBleGFtcGxlLCB3aGVuIHdlIHVzaW5nIG5hdGl2ZVNjcmlwdFxuICAgIC8vIHRpbWVycyBpcyBub3QgYXZhaWxhYmxlXG4gIH1cbiAgaWYgKGlzTWl4KSB7XG4gICAgLy8gaWYgd2UgYXJlIGluIG1peCBlbnZpcm9ubWVudCwgc3VjaCBhcyBFbGVjdHJvbixcbiAgICAvLyB0aGUgZ2xvYmFsLnNldFRpbWVvdXQgaGFzIGFscmVhZHkgYmVlbiBwYXRjaGVkLFxuICAgIC8vIHNvIHdlIGp1c3QgcGF0Y2ggdGltZXJzLnNldFRpbWVvdXRcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKCFnbG9iYWxVc2VUaW1lb3V0RnJvbVRpbWVyKSB7XG4gICAgLy8gMS4gZ2xvYmFsIHNldFRpbWVvdXQgZXF1YWxzIHRpbWVycyBzZXRUaW1lb3V0XG4gICAgLy8gMi4gb3IgZ2xvYmFsIGRvbid0IHVzZSB0aW1lcnMgc2V0VGltZW91dChtYXliZSBzb21lIG90aGVyIGxpYnJhcnkgcGF0Y2ggc2V0VGltZW91dClcbiAgICAvLyAzLiBvciBsb2FkIHRpbWVycyBtb2R1bGUgZXJyb3IgaGFwcGVucywgd2Ugc2hvdWxkIHBhdGNoIGdsb2JhbCBzZXRUaW1lb3V0XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdUaW1lb3V0Jyk7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdJbnRlcnZhbCcpO1xuICAgIHBhdGNoVGltZXIoZ2xvYmFsLCBzZXQsIGNsZWFyLCAnSW1tZWRpYXRlJyk7XG4gIH0gZWxzZSB7XG4gICAgLy8gZ2xvYmFsIHVzZSB0aW1lcnMgc2V0VGltZW91dCwgYnV0IG5vdCBlcXVhbHNcbiAgICAvLyB0aGlzIGhhcHBlbnMgd2hlbiB1c2Ugbm9kZWpzIHYwLjEwLngsIGdsb2JhbCBzZXRUaW1lb3V0IHdpbGxcbiAgICAvLyB1c2UgYSBsYXp5IGxvYWQgdmVyc2lvbiBvZiB0aW1lcnMgc2V0VGltZW91dFxuICAgIC8vIHdlIHNob3VsZCBub3QgZG91YmxlIHBhdGNoIHRpbWVyJ3Mgc2V0VGltZW91dFxuICAgIC8vIHNvIHdlIG9ubHkgc3RvcmUgdGhlIF9fc3ltYm9sX18gZm9yIGNvbnNpc3RlbmN5XG4gICAgZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnc2V0VGltZW91dCcpXSA9IGdsb2JhbC5zZXRUaW1lb3V0O1xuICAgIGdsb2JhbFtab25lLl9fc3ltYm9sX18oJ3NldEludGVydmFsJyldID0gZ2xvYmFsLnNldEludGVydmFsO1xuICAgIGdsb2JhbFtab25lLl9fc3ltYm9sX18oJ3NldEltbWVkaWF0ZScpXSA9IGdsb2JhbC5zZXRJbW1lZGlhdGU7XG4gIH1cbn0pO1xuXG4vLyBwYXRjaCBwcm9jZXNzIHJlbGF0ZWQgbWV0aG9kc1xuWm9uZS5fX2xvYWRfcGF0Y2goJ25leHRUaWNrJywgKCkgPT4ge1xuICAvLyBwYXRjaCBuZXh0VGljayBhcyBtaWNyb1Rhc2tcbiAgcGF0Y2hNaWNyb1Rhc2socHJvY2VzcywgJ25leHRUaWNrJywgKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ3Byb2Nlc3MubmV4dFRpY2snLFxuICAgICAgYXJnczogYXJncyxcbiAgICAgIGNiSWR4OiAoYXJncy5sZW5ndGggPiAwICYmIHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSA/IDAgOiAtMSxcbiAgICAgIHRhcmdldDogcHJvY2Vzc1xuICAgIH07XG4gIH0pO1xufSk7XG5cblpvbmUuX19sb2FkX3BhdGNoKFxuICAgICdoYW5kbGVVbmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSwgYXBpOiBfWm9uZVByaXZhdGUpID0+IHtcbiAgICAgIChab25lIGFzIGFueSlbYXBpLnN5bWJvbCgndW5oYW5kbGVkUHJvbWlzZVJlamVjdGlvbkhhbmRsZXInKV0gPVxuICAgICAgICAgIGZpbmRQcm9jZXNzUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3VuaGFuZGxlZFJlamVjdGlvbicpO1xuXG4gICAgICAoWm9uZSBhcyBhbnkpW2FwaS5zeW1ib2woJ3JlamVjdGlvbkhhbmRsZWRIYW5kbGVyJyldID1cbiAgICAgICAgICBmaW5kUHJvY2Vzc1Byb21pc2VSZWplY3Rpb25IYW5kbGVyKCdyZWplY3Rpb25IYW5kbGVkJyk7XG5cbiAgICAgIC8vIGhhbmRsZSB1bmhhbmRsZWQgcHJvbWlzZSByZWplY3Rpb25cbiAgICAgIGZ1bmN0aW9uIGZpbmRQcm9jZXNzUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoZXZ0TmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihlOiBhbnkpIHtcbiAgICAgICAgICBjb25zdCBldmVudFRhc2tzID0gZmluZEV2ZW50VGFza3MocHJvY2VzcywgZXZ0TmFtZSk7XG4gICAgICAgICAgZXZlbnRUYXNrcy5mb3JFYWNoKGV2ZW50VGFzayA9PiB7XG4gICAgICAgICAgICAvLyBwcm9jZXNzIGhhcyBhZGRlZCB1bmhhbmRsZWRyZWplY3Rpb24gZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIC8vIHRyaWdnZXIgdGhlIGV2ZW50IGxpc3RlbmVyXG4gICAgICAgICAgICBpZiAoZXZ0TmFtZSA9PT0gJ3VuaGFuZGxlZFJlamVjdGlvbicpIHtcbiAgICAgICAgICAgICAgZXZlbnRUYXNrLmludm9rZShlLnJlamVjdGlvbiwgZS5wcm9taXNlKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoZXZ0TmFtZSA9PT0gJ3JlamVjdGlvbkhhbmRsZWQnKSB7XG4gICAgICAgICAgICAgIGV2ZW50VGFzay5pbnZva2UoZS5wcm9taXNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9KTtcblxuXG4vLyBDcnlwdG9cblpvbmUuX19sb2FkX3BhdGNoKCdjcnlwdG8nLCAoKSA9PiB7XG4gIGxldCBjcnlwdG86IGFueTtcbiAgdHJ5IHtcbiAgICBjcnlwdG8gPSByZXF1aXJlKCdjcnlwdG8nKTtcbiAgfSBjYXRjaCAoZXJyKSB7XG4gIH1cblxuICAvLyB1c2UgdGhlIGdlbmVyaWMgcGF0Y2hNYWNyb1Rhc2sgdG8gcGF0Y2ggY3J5cHRvXG4gIGlmIChjcnlwdG8pIHtcbiAgICBjb25zdCBtZXRob2ROYW1lcyA9IFsncmFuZG9tQnl0ZXMnLCAncGJrZGYyJ107XG4gICAgbWV0aG9kTmFtZXMuZm9yRWFjaChuYW1lID0+IHtcbiAgICAgIHBhdGNoTWFjcm9UYXNrKGNyeXB0bywgbmFtZSwgKHNlbGY6IGFueSwgYXJnczogYW55W10pID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBuYW1lOiAnY3J5cHRvLicgKyBuYW1lLFxuICAgICAgICAgIGFyZ3M6IGFyZ3MsXG4gICAgICAgICAgY2JJZHg6IChhcmdzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGFyZ3NbYXJncy5sZW5ndGggLSAxXSA9PT0gJ2Z1bmN0aW9uJykgP1xuICAgICAgICAgICAgICBhcmdzLmxlbmd0aCAtIDEgOlxuICAgICAgICAgICAgICAtMSxcbiAgICAgICAgICB0YXJnZXQ6IGNyeXB0b1xuICAgICAgICB9O1xuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cbn0pO1xuXG5ab25lLl9fbG9hZF9wYXRjaCgnY29uc29sZScsIChnbG9iYWw6IGFueSwgWm9uZTogWm9uZVR5cGUpID0+IHtcbiAgY29uc3QgY29uc29sZU1ldGhvZHMgPVxuICAgICAgWydkaXInLCAnbG9nJywgJ2luZm8nLCAnZXJyb3InLCAnd2FybicsICdhc3NlcnQnLCAnZGVidWcnLCAndGltZUVuZCcsICd0cmFjZSddO1xuICBjb25zb2xlTWV0aG9kcy5mb3JFYWNoKChtOiBzdHJpbmcpID0+IHtcbiAgICBjb25zdCBvcmlnaW5hbE1ldGhvZCA9IChjb25zb2xlIGFzIGFueSlbWm9uZS5fX3N5bWJvbF9fKG0pXSA9IChjb25zb2xlIGFzIGFueSlbbV07XG4gICAgaWYgKG9yaWdpbmFsTWV0aG9kKSB7XG4gICAgICAoY29uc29sZSBhcyBhbnkpW21dID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IGFyZ3MgPSBBcnJheVNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgaWYgKFpvbmUuY3VycmVudCA9PT0gWm9uZS5yb290KSB7XG4gICAgICAgICAgcmV0dXJuIG9yaWdpbmFsTWV0aG9kLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBab25lLnJvb3QucnVuKG9yaWdpbmFsTWV0aG9kLCB0aGlzLCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH0pO1xufSk7XG4iXX0=