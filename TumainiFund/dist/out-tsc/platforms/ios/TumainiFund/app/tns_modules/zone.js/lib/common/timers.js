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
 * @suppress {missingRequire}
 */
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
var taskSymbol = utils_1.zoneSymbol('zoneTask');
function patchTimer(window, setName, cancelName, nameSuffix) {
    var setNative = null;
    var clearNative = null;
    setName += nameSuffix;
    cancelName += nameSuffix;
    var tasksByHandleId = {};
    function scheduleTask(task) {
        var data = task.data;
        function timer() {
            try {
                task.invoke.apply(this, arguments);
            }
            finally {
                // issue-934, task will be cancelled
                // even it is a periodic task such as
                // setInterval
                if (!(task.data && task.data.isPeriodic)) {
                    if (typeof data.handleId === 'number') {
                        // in non-nodejs env, we remove timerId
                        // from local cache
                        delete tasksByHandleId[data.handleId];
                    }
                    else if (data.handleId) {
                        // Node returns complex objects as handleIds
                        // we remove task reference from timer object
                        data.handleId[taskSymbol] = null;
                    }
                }
            }
        }
        data.args[0] = timer;
        data.handleId = setNative.apply(window, data.args);
        return task;
    }
    function clearTask(task) {
        return clearNative(task.data.handleId);
    }
    setNative =
        utils_1.patchMethod(window, setName, function (delegate) { return function (self, args) {
            if (typeof args[0] === 'function') {
                var options = {
                    isPeriodic: nameSuffix === 'Interval',
                    delay: (nameSuffix === 'Timeout' || nameSuffix === 'Interval') ? args[1] || 0 :
                        undefined,
                    args: args
                };
                var task = utils_1.scheduleMacroTaskWithCurrentZone(setName, args[0], options, scheduleTask, clearTask);
                if (!task) {
                    return task;
                }
                // Node.js must additionally support the ref and unref functions.
                var handle = task.data.handleId;
                if (typeof handle === 'number') {
                    // for non nodejs env, we save handleId: task
                    // mapping in local cache for clearTimeout
                    tasksByHandleId[handle] = task;
                }
                else if (handle) {
                    // for nodejs env, we save task
                    // reference in timerId Object for clearTimeout
                    handle[taskSymbol] = task;
                }
                // check whether handle is null, because some polyfill or browser
                // may return undefined from setTimeout/setInterval/setImmediate/requestAnimationFrame
                if (handle && handle.ref && handle.unref && typeof handle.ref === 'function' &&
                    typeof handle.unref === 'function') {
                    task.ref = handle.ref.bind(handle);
                    task.unref = handle.unref.bind(handle);
                }
                if (typeof handle === 'number' || handle) {
                    return handle;
                }
                return task;
            }
            else {
                // cause an error by calling it directly.
                return delegate.apply(window, args);
            }
        }; });
    clearNative =
        utils_1.patchMethod(window, cancelName, function (delegate) { return function (self, args) {
            var id = args[0];
            var task;
            if (typeof id === 'number') {
                // non nodejs env.
                task = tasksByHandleId[id];
            }
            else {
                // nodejs env.
                task = id && id[taskSymbol];
                // other environments.
                if (!task) {
                    task = id;
                }
            }
            if (task && typeof task.type === 'string') {
                if (task.state !== 'notScheduled' &&
                    (task.cancelFn && task.data.isPeriodic || task.runCount === 0)) {
                    if (typeof id === 'number') {
                        delete tasksByHandleId[id];
                    }
                    else if (id) {
                        id[taskSymbol] = null;
                    }
                    // Do not cancel already canceled functions
                    task.zone.cancelTask(task);
                }
            }
            else {
                // cause an error by calling it directly.
                delegate.apply(window, args);
            }
        }; });
}
exports.patchTimer = patchTimer;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvdG5zX21vZHVsZXMvem9uZS5qcy9saWIvY29tbW9uL3RpbWVycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7OztHQU1HO0FBQ0g7OztHQUdHOztBQUVILGlDQUFrRjtBQUVsRixJQUFNLFVBQVUsR0FBRyxrQkFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBTzFDLFNBQWdCLFVBQVUsQ0FBQyxNQUFXLEVBQUUsT0FBZSxFQUFFLFVBQWtCLEVBQUUsVUFBa0I7SUFDN0YsSUFBSSxTQUFTLEdBQWtCLElBQUksQ0FBQztJQUNwQyxJQUFJLFdBQVcsR0FBa0IsSUFBSSxDQUFDO0lBQ3RDLE9BQU8sSUFBSSxVQUFVLENBQUM7SUFDdEIsVUFBVSxJQUFJLFVBQVUsQ0FBQztJQUV6QixJQUFNLGVBQWUsR0FBeUIsRUFBRSxDQUFDO0lBRWpELFNBQVMsWUFBWSxDQUFDLElBQVU7UUFDOUIsSUFBTSxJQUFJLEdBQWlCLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDckMsU0FBUyxLQUFLO1lBQ1osSUFBSTtnQkFDRixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7YUFDcEM7b0JBQVM7Z0JBQ1Isb0NBQW9DO2dCQUNwQyxxQ0FBcUM7Z0JBQ3JDLGNBQWM7Z0JBQ2QsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFO29CQUN4QyxJQUFJLE9BQU8sSUFBSSxDQUFDLFFBQVEsS0FBSyxRQUFRLEVBQUU7d0JBQ3JDLHVDQUF1Qzt3QkFDdkMsbUJBQW1CO3dCQUNuQixPQUFPLGVBQWUsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7cUJBQ3ZDO3lCQUFNLElB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dCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuXG5pbXBvcnQge3BhdGNoTWV0aG9kLCBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZSwgem9uZVN5bWJvbH0gZnJvbSAnLi91dGlscyc7XG5cbmNvbnN0IHRhc2tTeW1ib2wgPSB6b25lU3ltYm9sKCd6b25lVGFzaycpO1xuXG5pbnRlcmZhY2UgVGltZXJPcHRpb25zIGV4dGVuZHMgVGFza0RhdGEge1xuICBoYW5kbGVJZD86IG51bWJlcjtcbiAgYXJnczogYW55W107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaFRpbWVyKHdpbmRvdzogYW55LCBzZXROYW1lOiBzdHJpbmcsIGNhbmNlbE5hbWU6IHN0cmluZywgbmFtZVN1ZmZpeDogc3RyaW5nKSB7XG4gIGxldCBzZXROYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuICBsZXQgY2xlYXJOYXRpdmU6IEZ1bmN0aW9ufG51bGwgPSBudWxsO1xuICBzZXROYW1lICs9IG5hbWVTdWZmaXg7XG4gIGNhbmNlbE5hbWUgKz0gbmFtZVN1ZmZpeDtcblxuICBjb25zdCB0YXNrc0J5SGFuZGxlSWQ6IHtbaWQ6IG51bWJlcl06IFRhc2t9ID0ge307XG5cbiAgZnVuY3Rpb24gc2NoZWR1bGVUYXNrKHRhc2s6IFRhc2spIHtcbiAgICBjb25zdCBkYXRhID0gPFRpbWVyT3B0aW9ucz50YXNrLmRhdGE7XG4gICAgZnVuY3Rpb24gdGltZXIoKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0YXNrLmludm9rZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgLy8gaXNzdWUtOTM0LCB0YXNrIHdpbGwgYmUgY2FuY2VsbGVkXG4gICAgICAgIC8vIGV2ZW4gaXQgaXMgYSBwZXJpb2RpYyB0YXNrIHN1Y2ggYXNcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWxcbiAgICAgICAgaWYgKCEodGFzay5kYXRhICYmIHRhc2suZGF0YS5pc1BlcmlvZGljKSkge1xuICAgICAgICAgIGlmICh0eXBlb2YgZGF0YS5oYW5kbGVJZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGluIG5vbi1ub2RlanMgZW52LCB3ZSByZW1vdmUgdGltZXJJZFxuICAgICAgICAgICAgLy8gZnJvbSBsb2NhbCBjYWNoZVxuICAgICAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVJZFtkYXRhLmhhbmRsZUlkXTtcbiAgICAgICAgICB9IGVsc2UgaWYgKGRhdGEuaGFuZGxlSWQpIHtcbiAgICAgICAgICAgIC8vIE5vZGUgcmV0dXJucyBjb21wbGV4IG9iamVjdHMgYXMgaGFuZGxlSWRzXG4gICAgICAgICAgICAvLyB3ZSByZW1vdmUgdGFzayByZWZlcmVuY2UgZnJvbSB0aW1lciBvYmplY3RcbiAgICAgICAgICAgIChkYXRhLmhhbmRsZUlkIGFzIGFueSlbdGFza1N5bWJvbF0gPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBkYXRhLmFyZ3NbMF0gPSB0aW1lcjtcbiAgICBkYXRhLmhhbmRsZUlkID0gc2V0TmF0aXZlIS5hcHBseSh3aW5kb3csIGRhdGEuYXJncyk7XG4gICAgcmV0dXJuIHRhc2s7XG4gIH1cblxuICBmdW5jdGlvbiBjbGVhclRhc2sodGFzazogVGFzaykge1xuICAgIHJldHVybiBjbGVhck5hdGl2ZSEoKDxUaW1lck9wdGlvbnM+dGFzay5kYXRhKS5oYW5kbGVJZCk7XG4gIH1cblxuICBzZXROYXRpdmUgPVxuICAgICAgcGF0Y2hNZXRob2Qod2luZG93LCBzZXROYW1lLCAoZGVsZWdhdGU6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbihzZWxmOiBhbnksIGFyZ3M6IGFueVtdKSB7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGNvbnN0IG9wdGlvbnM6IFRpbWVyT3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGlzUGVyaW9kaWM6IG5hbWVTdWZmaXggPT09ICdJbnRlcnZhbCcsXG4gICAgICAgICAgICBkZWxheTogKG5hbWVTdWZmaXggPT09ICdUaW1lb3V0JyB8fCBuYW1lU3VmZml4ID09PSAnSW50ZXJ2YWwnKSA/IGFyZ3NbMV0gfHwgMCA6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICAgIGFyZ3M6IGFyZ3NcbiAgICAgICAgICB9O1xuICAgICAgICAgIGNvbnN0IHRhc2sgPVxuICAgICAgICAgICAgICBzY2hlZHVsZU1hY3JvVGFza1dpdGhDdXJyZW50Wm9uZShzZXROYW1lLCBhcmdzWzBdLCBvcHRpb25zLCBzY2hlZHVsZVRhc2ssIGNsZWFyVGFzayk7XG4gICAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTm9kZS5qcyBtdXN0IGFkZGl0aW9uYWxseSBzdXBwb3J0IHRoZSByZWYgYW5kIHVucmVmIGZ1bmN0aW9ucy5cbiAgICAgICAgICBjb25zdCBoYW5kbGU6IGFueSA9ICg8VGltZXJPcHRpb25zPnRhc2suZGF0YSkuaGFuZGxlSWQ7XG4gICAgICAgICAgaWYgKHR5cGVvZiBoYW5kbGUgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICAvLyBmb3Igbm9uIG5vZGVqcyBlbnYsIHdlIHNhdmUgaGFuZGxlSWQ6IHRhc2tcbiAgICAgICAgICAgIC8vIG1hcHBpbmcgaW4gbG9jYWwgY2FjaGUgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgdGFza3NCeUhhbmRsZUlkW2hhbmRsZV0gPSB0YXNrO1xuICAgICAgICAgIH0gZWxzZSBpZiAoaGFuZGxlKSB7XG4gICAgICAgICAgICAvLyBmb3Igbm9kZWpzIGVudiwgd2Ugc2F2ZSB0YXNrXG4gICAgICAgICAgICAvLyByZWZlcmVuY2UgaW4gdGltZXJJZCBPYmplY3QgZm9yIGNsZWFyVGltZW91dFxuICAgICAgICAgICAgaGFuZGxlW3Rhc2tTeW1ib2xdID0gdGFzaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgICAvLyBjaGVjayB3aGV0aGVyIGhhbmRsZSBpcyBudWxsLCBiZWNhdXNlIHNvbWUgcG9seWZpbGwgb3IgYnJvd3NlclxuICAgICAgICAgIC8vIG1heSByZXR1cm4gdW5kZWZpbmVkIGZyb20gc2V0VGltZW91dC9zZXRJbnRlcnZhbC9zZXRJbW1lZGlhdGUvcmVxdWVzdEFuaW1hdGlvbkZyYW1lXG4gICAgICAgICAgaWYgKGhhbmRsZSAmJiBoYW5kbGUucmVmICYmIGhhbmRsZS51bnJlZiAmJiB0eXBlb2YgaGFuZGxlLnJlZiA9PT0gJ2Z1bmN0aW9uJyAmJlxuICAgICAgICAgICAgICB0eXBlb2YgaGFuZGxlLnVucmVmID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAoPGFueT50YXNrKS5yZWYgPSAoPGFueT5oYW5kbGUpLnJlZi5iaW5kKGhhbmRsZSk7XG4gICAgICAgICAgICAoPGFueT50YXNrKS51bnJlZiA9ICg8YW55PmhhbmRsZSkudW5yZWYuYmluZChoYW5kbGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZSA9PT0gJ251bWJlcicgfHwgaGFuZGxlKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFzaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgIHJldHVybiBkZWxlZ2F0ZS5hcHBseSh3aW5kb3csIGFyZ3MpO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICBjbGVhck5hdGl2ZSA9XG4gICAgICBwYXRjaE1ldGhvZCh3aW5kb3csIGNhbmNlbE5hbWUsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IGZ1bmN0aW9uKHNlbGY6IGFueSwgYXJnczogYW55W10pIHtcbiAgICAgICAgY29uc3QgaWQgPSBhcmdzWzBdO1xuICAgICAgICBsZXQgdGFzazogVGFzaztcbiAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAvLyBub24gbm9kZWpzIGVudi5cbiAgICAgICAgICB0YXNrID0gdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBub2RlanMgZW52LlxuICAgICAgICAgIHRhc2sgPSBpZCAmJiBpZFt0YXNrU3ltYm9sXTtcbiAgICAgICAgICAvLyBvdGhlciBlbnZpcm9ubWVudHMuXG4gICAgICAgICAgaWYgKCF0YXNrKSB7XG4gICAgICAgICAgICB0YXNrID0gaWQ7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICh0YXNrICYmIHR5cGVvZiB0YXNrLnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgaWYgKHRhc2suc3RhdGUgIT09ICdub3RTY2hlZHVsZWQnICYmXG4gICAgICAgICAgICAgICh0YXNrLmNhbmNlbEZuICYmIHRhc2suZGF0YSEuaXNQZXJpb2RpYyB8fCB0YXNrLnJ1bkNvdW50ID09PSAwKSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBpZCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgICAgZGVsZXRlIHRhc2tzQnlIYW5kbGVJZFtpZF07XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGlkKSB7XG4gICAgICAgICAgICAgIGlkW3Rhc2tTeW1ib2xdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIERvIG5vdCBjYW5jZWwgYWxyZWFkeSBjYW5jZWxlZCBmdW5jdGlvbnNcbiAgICAgICAgICAgIHRhc2suem9uZS5jYW5jZWxUYXNrKHRhc2spO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBjYXVzZSBhbiBlcnJvciBieSBjYWxsaW5nIGl0IGRpcmVjdGx5LlxuICAgICAgICAgIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xufVxuIl19