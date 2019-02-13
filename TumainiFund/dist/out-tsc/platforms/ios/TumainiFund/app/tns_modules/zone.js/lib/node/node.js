/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import './node_util';
import './events';
import './fs';
import { findEventTasks } from '../common/events';
import { patchTimer } from '../common/timers';
import { ArraySlice, isMix, patchMacroTask, patchMicroTask } from '../common/utils';
const set = 'set';
const clear = 'clear';
Zone.__load_patch('node_timers', (global, Zone) => {
    // Timers
    let globalUseTimeoutFromTimer = false;
    try {
        const timers = require('timers');
        let globalEqualTimersTimeout = global.setTimeout === timers.setTimeout;
        if (!globalEqualTimersTimeout && !isMix) {
            // 1. if isMix, then we are in mix environment such as Electron
            // we should only patch timers.setTimeout because global.setTimeout
            // have been patched
            // 2. if global.setTimeout not equal timers.setTimeout, check
            // whether global.setTimeout use timers.setTimeout or not
            const originSetTimeout = timers.setTimeout;
            timers.setTimeout = function () {
                globalUseTimeoutFromTimer = true;
                return originSetTimeout.apply(this, arguments);
            };
            const detectTimeout = global.setTimeout(() => { }, 100);
            clearTimeout(detectTimeout);
            timers.setTimeout = originSetTimeout;
        }
        patchTimer(timers, set, clear, 'Timeout');
        patchTimer(timers, set, clear, 'Interval');
        patchTimer(timers, set, clear, 'Immediate');
    }
    catch (error) {
        // timers module not exists, for example, when we using nativeScript
        // timers is not available
    }
    if (isMix) {
        // if we are in mix environment, such as Electron,
        // the global.setTimeout has already been patched,
        // so we just patch timers.setTimeout
        return;
    }
    if (!globalUseTimeoutFromTimer) {
        // 1. global setTimeout equals timers setTimeout
        // 2. or global don't use timers setTimeout(maybe some other library patch setTimeout)
        // 3. or load timers module error happens, we should patch global setTimeout
        patchTimer(global, set, clear, 'Timeout');
        patchTimer(global, set, clear, 'Interval');
        patchTimer(global, set, clear, 'Immediate');
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
Zone.__load_patch('nextTick', () => {
    // patch nextTick as microTask
    patchMicroTask(process, 'nextTick', (self, args) => {
        return {
            name: 'process.nextTick',
            args: args,
            cbIdx: (args.length > 0 && typeof args[0] === 'function') ? 0 : -1,
            target: process
        };
    });
});
Zone.__load_patch('handleUnhandledPromiseRejection', (global, Zone, api) => {
    Zone[api.symbol('unhandledPromiseRejectionHandler')] =
        findProcessPromiseRejectionHandler('unhandledRejection');
    Zone[api.symbol('rejectionHandledHandler')] =
        findProcessPromiseRejectionHandler('rejectionHandled');
    // handle unhandled promise rejection
    function findProcessPromiseRejectionHandler(evtName) {
        return function (e) {
            const eventTasks = findEventTasks(process, evtName);
            eventTasks.forEach(eventTask => {
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
Zone.__load_patch('crypto', () => {
    let crypto;
    try {
        crypto = require('crypto');
    }
    catch (err) {
    }
    // use the generic patchMacroTask to patch crypto
    if (crypto) {
        const methodNames = ['randomBytes', 'pbkdf2'];
        methodNames.forEach(name => {
            patchMacroTask(crypto, name, (self, args) => {
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
Zone.__load_patch('console', (global, Zone) => {
    const consoleMethods = ['dir', 'log', 'info', 'error', 'warn', 'assert', 'debug', 'timeEnd', 'trace'];
    consoleMethods.forEach((m) => {
        const originalMethod = console[Zone.__symbol__(m)] = console[m];
        if (originalMethod) {
            console[m] = function () {
                const args = ArraySlice.call(arguments);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm9kZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3pvbmUuanMvbGliL25vZGUvbm9kZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLGFBQWEsQ0FBQztBQUNyQixPQUFPLFVBQVUsQ0FBQztBQUNsQixPQUFPLE1BQU0sQ0FBQztBQUVkLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxrQkFBa0IsQ0FBQztBQUNoRCxPQUFPLEVBQUMsVUFBVSxFQUFDLE1BQU0sa0JBQWtCLENBQUM7QUFDNUMsT0FBTyxFQUFDLFVBQVUsRUFBRSxLQUFLLEVBQUUsY0FBYyxFQUFFLGNBQWMsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRWxGLE1BQU0sR0FBRyxHQUFHLEtBQUssQ0FBQztBQUNsQixNQUFNLEtBQUssR0FBRyxPQUFPLENBQUM7QUFFdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxNQUFXLEVBQUUsSUFBYyxFQUFFLEVBQUU7SUFDL0QsU0FBUztJQUNULElBQUkseUJBQXlCLEdBQUcsS0FBSyxDQUFDO0lBQ3RDLElBQUk7UUFDRixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsSUFBSSx3QkFBd0IsR0FBRyxNQUFNLENBQUMsVUFBVSxLQUFLLE1BQU0sQ0FBQyxVQUFVLENBQUM7UUFDdkUsSUFBSSxDQUFDLHdCQUF3QixJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ3ZDLCtEQUErRDtZQUMvRCxtRUFBbUU7WUFDbkUsb0JBQW9CO1lBQ3BCLDZEQUE2RDtZQUM3RCx5REFBeUQ7WUFDekQsTUFBTSxnQkFBZ0IsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDO1lBQzNDLE1BQU0sQ0FBQyxVQUFVLEdBQUc7Z0JBQ2xCLHlCQUF5QixHQUFH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QUFDLENBQUMsQ0FBQztBQUNMLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQgJy4vbm9kZV91dGlsJztcbmltcG9ydCAnLi9ldmVudHMnO1xuaW1wb3J0ICcuL2ZzJztcblxuaW1wb3J0IHtmaW5kRXZlbnRUYXNrc30gZnJvbSAnLi4vY29tbW9uL2V2ZW50cyc7XG5pbXBvcnQge3BhdGNoVGltZXJ9IGZyb20gJy4uL2NvbW1vbi90aW1lcnMnO1xuaW1wb3J0IHtBcnJheVNsaWNlLCBpc01peCwgcGF0Y2hNYWNyb1Rhc2ssIHBhdGNoTWljcm9UYXNrfSBmcm9tICcuLi9jb21tb24vdXRpbHMnO1xuXG5jb25zdCBzZXQgPSAnc2V0JztcbmNvbnN0IGNsZWFyID0gJ2NsZWFyJztcblxuWm9uZS5fX2xvYWRfcGF0Y2goJ25vZGVfdGltZXJzJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSkgPT4ge1xuICAvLyBUaW1lcnNcbiAgbGV0IGdsb2JhbFVzZVRpbWVvdXRGcm9tVGltZXIgPSBmYWxzZTtcbiAgdHJ5IHtcbiAgICBjb25zdCB0aW1lcnMgPSByZXF1aXJlKCd0aW1lcnMnKTtcbiAgICBsZXQgZ2xvYmFsRXF1YWxUaW1lcnNUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQgPT09IHRpbWVycy5zZXRUaW1lb3V0O1xuICAgIGlmICghZ2xvYmFsRXF1YWxUaW1lcnNUaW1lb3V0ICYmICFpc01peCkge1xuICAgICAgLy8gMS4gaWYgaXNNaXgsIHRoZW4gd2UgYXJlIGluIG1peCBlbnZpcm9ubWVudCBzdWNoIGFzIEVsZWN0cm9uXG4gICAgICAvLyB3ZSBzaG91bGQgb25seSBwYXRjaCB0aW1lcnMuc2V0VGltZW91dCBiZWNhdXNlIGdsb2JhbC5zZXRUaW1lb3V0XG4gICAgICAvLyBoYXZlIGJlZW4gcGF0Y2hlZFxuICAgICAgLy8gMi4gaWYgZ2xvYmFsLnNldFRpbWVvdXQgbm90IGVxdWFsIHRpbWVycy5zZXRUaW1lb3V0LCBjaGVja1xuICAgICAgLy8gd2hldGhlciBnbG9iYWwuc2V0VGltZW91dCB1c2UgdGltZXJzLnNldFRpbWVvdXQgb3Igbm90XG4gICAgICBjb25zdCBvcmlnaW5TZXRUaW1lb3V0ID0gdGltZXJzLnNldFRpbWVvdXQ7XG4gICAgICB0aW1lcnMuc2V0VGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBnbG9iYWxVc2VUaW1lb3V0RnJvbVRpbWVyID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG9yaWdpblNldFRpbWVvdXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgIH07XG4gICAgICBjb25zdCBkZXRlY3RUaW1lb3V0ID0gZ2xvYmFsLnNldFRpbWVvdXQoKCkgPT4ge30sIDEwMCk7XG4gICAgICBjbGVhclRpbWVvdXQoZGV0ZWN0VGltZW91dCk7XG4gICAgICB0aW1lcnMuc2V0VGltZW91dCA9IG9yaWdpblNldFRpbWVvdXQ7XG4gICAgfVxuICAgIHBhdGNoVGltZXIodGltZXJzLCBzZXQsIGNsZWFyLCAnVGltZW91dCcpO1xuICAgIHBhdGNoVGltZXIodGltZXJzLCBzZXQsIGNsZWFyLCAnSW50ZXJ2YWwnKTtcbiAgICBwYXRjaFRpbWVyKHRpbWVycywgc2V0LCBjbGVhciwgJ0ltbWVkaWF0ZScpO1xuICB9IGNhdGNoIChlcnJvcikge1xuICAgIC8vIHRpbWVycyBtb2R1bGUgbm90IGV4aXN0cywgZm9yIGV4YW1wbGUsIHdoZW4gd2UgdXNpbmcgbmF0aXZlU2NyaXB0XG4gICAgLy8gdGltZXJzIGlzIG5vdCBhdmFpbGFibGVcbiAgfVxuICBpZiAoaXNNaXgpIHtcbiAgICAvLyBpZiB3ZSBhcmUgaW4gbWl4IGVudmlyb25tZW50LCBzdWNoIGFzIEVsZWN0cm9uLFxuICAgIC8vIHRoZSBnbG9iYWwuc2V0VGltZW91dCBoYXMgYWxyZWFkeSBiZWVuIHBhdGNoZWQsXG4gICAgLy8gc28gd2UganVzdCBwYXRjaCB0aW1lcnMuc2V0VGltZW91dFxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoIWdsb2JhbFVzZVRpbWVvdXRGcm9tVGltZXIpIHtcbiAgICAvLyAxLiBnbG9iYWwgc2V0VGltZW91dCBlcXVhbHMgdGltZXJzIHNldFRpbWVvdXRcbiAgICAvLyAyLiBvciBnbG9iYWwgZG9uJ3QgdXNlIHRpbWVycyBzZXRUaW1lb3V0KG1heWJlIHNvbWUgb3RoZXIgbGlicmFyeSBwYXRjaCBzZXRUaW1lb3V0KVxuICAgIC8vIDMuIG9yIGxvYWQgdGltZXJzIG1vZHVsZSBlcnJvciBoYXBwZW5zLCB3ZSBzaG91bGQgcGF0Y2ggZ2xvYmFsIHNldFRpbWVvdXRcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ1RpbWVvdXQnKTtcbiAgICBwYXRjaFRpbWVyKGdsb2JhbCwgc2V0LCBjbGVhciwgJ0ludGVydmFsJyk7XG4gICAgcGF0Y2hUaW1lcihnbG9iYWwsIHNldCwgY2xlYXIsICdJbW1lZGlhdGUnKTtcbiAgfSBlbHNlIHtcbiAgICAvLyBnbG9iYWwgdXNlIHRpbWVycyBzZXRUaW1lb3V0LCBidXQgbm90IGVxdWFsc1xuICAgIC8vIHRoaXMgaGFwcGVucyB3aGVuIHVzZSBub2RlanMgdjAuMTAueCwgZ2xvYmFsIHNldFRpbWVvdXQgd2lsbFxuICAgIC8vIHVzZSBhIGxhenkgbG9hZCB2ZXJzaW9uIG9mIHRpbWVycyBzZXRUaW1lb3V0XG4gICAgLy8gd2Ugc2hvdWxkIG5vdCBkb3VibGUgcGF0Y2ggdGltZXIncyBzZXRUaW1lb3V0XG4gICAgLy8gc28gd2Ugb25seSBzdG9yZSB0aGUgX19zeW1ib2xfXyBmb3IgY29uc2lzdGVuY3lcbiAgICBnbG9iYWxbWm9uZS5fX3N5bWJvbF9fKCdzZXRUaW1lb3V0JyldID0gZ2xvYmFsLnNldFRpbWVvdXQ7XG4gICAgZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnc2V0SW50ZXJ2YWwnKV0gPSBnbG9iYWwuc2V0SW50ZXJ2YWw7XG4gICAgZ2xvYmFsW1pvbmUuX19zeW1ib2xfXygnc2V0SW1tZWRpYXRlJyldID0gZ2xvYmFsLnNldEltbWVkaWF0ZTtcbiAgfVxufSk7XG5cbi8vIHBhdGNoIHByb2Nlc3MgcmVsYXRlZCBtZXRob2RzXG5ab25lLl9fbG9hZF9wYXRjaCgnbmV4dFRpY2snLCAoKSA9PiB7XG4gIC8vIHBhdGNoIG5leHRUaWNrIGFzIG1pY3JvVGFza1xuICBwYXRjaE1pY3JvVGFzayhwcm9jZXNzLCAnbmV4dFRpY2snLCAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgIHJldHVybiB7XG4gICAgICBuYW1lOiAncHJvY2Vzcy5uZXh0VGljaycsXG4gICAgICBhcmdzOiBhcmdzLFxuICAgICAgY2JJZHg6IChhcmdzLmxlbmd0aCA+IDAgJiYgdHlwZW9mIGFyZ3NbMF0gPT09ICdmdW5jdGlvbicpID8gMCA6IC0xLFxuICAgICAgdGFyZ2V0OiBwcm9jZXNzXG4gICAgfTtcbiAgfSk7XG59KTtcblxuWm9uZS5fX2xvYWRfcGF0Y2goXG4gICAgJ2hhbmRsZVVuaGFuZGxlZFByb21pc2VSZWplY3Rpb24nLCAoZ2xvYmFsOiBhbnksIFpvbmU6IFpvbmVUeXBlLCBhcGk6IF9ab25lUHJpdmF0ZSkgPT4ge1xuICAgICAgKFpvbmUgYXMgYW55KVthcGkuc3ltYm9sKCd1bmhhbmRsZWRQcm9taXNlUmVqZWN0aW9uSGFuZGxlcicpXSA9XG4gICAgICAgICAgZmluZFByb2Nlc3NQcm9taXNlUmVqZWN0aW9uSGFuZGxlcigndW5oYW5kbGVkUmVqZWN0aW9uJyk7XG5cbiAgICAgIChab25lIGFzIGFueSlbYXBpLnN5bWJvbCgncmVqZWN0aW9uSGFuZGxlZEhhbmRsZXInKV0gPVxuICAgICAgICAgIGZpbmRQcm9jZXNzUHJvbWlzZVJlamVjdGlvbkhhbmRsZXIoJ3JlamVjdGlvbkhhbmRsZWQnKTtcblxuICAgICAgLy8gaGFuZGxlIHVuaGFuZGxlZCBwcm9taXNlIHJlamVjdGlvblxuICAgICAgZnVuY3Rpb24gZmluZFByb2Nlc3NQcm9taXNlUmVqZWN0aW9uSGFuZGxlcihldnROYW1lOiBzdHJpbmcpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGU6IGFueSkge1xuICAgICAgICAgIGNvbnN0IGV2ZW50VGFza3MgPSBmaW5kRXZlbnRUYXNrcyhwcm9jZXNzLCBldnROYW1lKTtcbiAgICAgICAgICBldmVudFRhc2tzLmZvckVhY2goZXZlbnRUYXNrID0+IHtcbiAgICAgICAgICAgIC8vIHByb2Nlc3MgaGFzIGFkZGVkIHVuaGFuZGxlZHJlamVjdGlvbiBldmVudCBsaXN0ZW5lclxuICAgICAgICAgICAgLy8gdHJpZ2dlciB0aGUgZXZlbnQgbGlzdGVuZXJcbiAgICAgICAgICAgIGlmIChldnROYW1lID09PSAndW5oYW5kbGVkUmVqZWN0aW9uJykge1xuICAgICAgICAgICAgICBldmVudFRhc2suaW52b2tlKGUucmVqZWN0aW9uLCBlLnByb21pc2UpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChldnROYW1lID09PSAncmVqZWN0aW9uSGFuZGxlZCcpIHtcbiAgICAgICAgICAgICAgZXZlbnRUYXNrLmludm9rZShlLnByb21pc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0pO1xuXG5cbi8vIENyeXB0b1xuWm9uZS5fX2xvYWRfcGF0Y2goJ2NyeXB0bycsICgpID0+IHtcbiAgbGV0IGNyeXB0bzogYW55O1xuICB0cnkge1xuICAgIGNyeXB0byA9IHJlcXVpcmUoJ2NyeXB0bycpO1xuICB9IGNhdGNoIChlcnIpIHtcbiAgfVxuXG4gIC8vIHVzZSB0aGUgZ2VuZXJpYyBwYXRjaE1hY3JvVGFzayB0byBwYXRjaCBjcnlwdG9cbiAgaWYgKGNyeXB0bykge1xuICAgIGNvbnN0IG1ldGhvZE5hbWVzID0gWydyYW5kb21CeXRlcycsICdwYmtkZjInXTtcbiAgICBtZXRob2ROYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xuICAgICAgcGF0Y2hNYWNyb1Rhc2soY3J5cHRvLCBuYW1lLCAoc2VsZjogYW55LCBhcmdzOiBhbnlbXSkgPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG5hbWU6ICdjcnlwdG8uJyArIG5hbWUsXG4gICAgICAgICAgYXJnczogYXJncyxcbiAgICAgICAgICBjYklkeDogKGFyZ3MubGVuZ3RoID4gMCAmJiB0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSA/XG4gICAgICAgICAgICAgIGFyZ3MubGVuZ3RoIC0gMSA6XG4gICAgICAgICAgICAgIC0xLFxuICAgICAgICAgIHRhcmdldDogY3J5cHRvXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxufSk7XG5cblpvbmUuX19sb2FkX3BhdGNoKCdjb25zb2xlJywgKGdsb2JhbDogYW55LCBab25lOiBab25lVHlwZSkgPT4ge1xuICBjb25zdCBjb25zb2xlTWV0aG9kcyA9XG4gICAgICBbJ2RpcicsICdsb2cnLCAnaW5mbycsICdlcnJvcicsICd3YXJuJywgJ2Fzc2VydCcsICdkZWJ1ZycsICd0aW1lRW5kJywgJ3RyYWNlJ107XG4gIGNvbnNvbGVNZXRob2RzLmZvckVhY2goKG06IHN0cmluZykgPT4ge1xuICAgIGNvbnN0IG9yaWdpbmFsTWV0aG9kID0gKGNvbnNvbGUgYXMgYW55KVtab25lLl9fc3ltYm9sX18obSldID0gKGNvbnNvbGUgYXMgYW55KVttXTtcbiAgICBpZiAob3JpZ2luYWxNZXRob2QpIHtcbiAgICAgIChjb25zb2xlIGFzIGFueSlbbV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3QgYXJncyA9IEFycmF5U2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBpZiAoWm9uZS5jdXJyZW50ID09PSBab25lLnJvb3QpIHtcbiAgICAgICAgICByZXR1cm4gb3JpZ2luYWxNZXRob2QuYXBwbHkodGhpcywgYXJncyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIFpvbmUucm9vdC5ydW4ob3JpZ2luYWxNZXRob2QsIHRoaXMsIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfSk7XG59KTtcbiJdfQ==