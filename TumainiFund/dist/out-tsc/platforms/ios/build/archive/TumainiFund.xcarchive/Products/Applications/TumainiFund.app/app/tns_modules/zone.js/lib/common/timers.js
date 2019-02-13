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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZXJzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi9jb21tb24vdGltZXJzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7Ozs7O0dBTUc7QUFDSDs7O0dBR0c7O0FBRUgsaUNBQWtGO0FBRWxGLElBQU0sVUFBVSxHQUFHLGtCQUFVLENBQUMsVUFBVSxDQUFDLENBQUM7QUFPMUMsU0FBZ0IsVUFBVSxDQUFDLE1BQVcsRUFBRSxPQUFlLEVBQUUsVUFBa0IsRUFBRSxVQUFrQjtJQUM3RixJQUFJLFNBQVMsR0FBa0IsSUFBSSxDQUFDO0lBQ3BDLElBQUksV0FBVyxHQUFrQixJQUFJLENBQUM7SUFDdEMsT0FBTyxJQUFJLFVBQVUsQ0FBQztJQUN0QixVQUFVLElBQUksVUFBVSxDQUFDO0lBRXpCLElBQU0sZUFBZSxHQUF5QixFQUFFLENBQUM7SUFFakQsU0FBUyxZQUFZLENBQUMsSUFBVTtRQUM5QixJQUFNLElBQUksR0FBaUIsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNyQyxTQUFTLEtBQUs7WUFDWixJQUFJO2dCQUNGLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxTQUFTLENBQUMsQ0FBQzthQUNwQztvQkFBUztnQkFDUixvQ0FBb0M7Z0JBQ3BDLHFDQUFxQztnQkFDckMsY0FBYztnQkFDZCxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7b0JBQ3hDLElBQUksT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLFFBQVEsRUFBRTt3QkFDckMsdUNBQXVD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Q0FBQztBQUNULENBQUM7QUFqSEQsZ0NBaUhDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuLyoqXG4gKiBAZmlsZW92ZXJ2aWV3XG4gKiBAc3VwcHJlc3Mge21pc3NpbmdSZXF1aXJlfVxuICovXG5cbmltcG9ydCB7cGF0Y2hNZXRob2QsIHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lLCB6b25lU3ltYm9sfSBmcm9tICcuL3V0aWxzJztcblxuY29uc3QgdGFza1N5bWJvbCA9IHpvbmVTeW1ib2woJ3pvbmVUYXNrJyk7XG5cbmludGVyZmFjZSBUaW1lck9wdGlvbnMgZXh0ZW5kcyBUYXNrRGF0YSB7XG4gIGhhbmRsZUlkPzogbnVtYmVyO1xuICBhcmdzOiBhbnlbXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBhdGNoVGltZXIod2luZG93OiBhbnksIHNldE5hbWU6IHN0cmluZywgY2FuY2VsTmFtZTogc3RyaW5nLCBuYW1lU3VmZml4OiBzdHJpbmcpIHtcbiAgbGV0IHNldE5hdGl2ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG4gIGxldCBjbGVhck5hdGl2ZTogRnVuY3Rpb258bnVsbCA9IG51bGw7XG4gIHNldE5hbWUgKz0gbmFtZVN1ZmZpeDtcbiAgY2FuY2VsTmFtZSArPSBuYW1lU3VmZml4O1xuXG4gIGNvbnN0IHRhc2tzQnlIYW5kbGVJZDoge1tpZDogbnVtYmVyXTogVGFza30gPSB7fTtcblxuICBmdW5jdGlvbiBzY2hlZHVsZVRhc2sodGFzazogVGFzaykge1xuICAgIGNvbnN0IGRhdGEgPSA8VGltZXJPcHRpb25zPnRhc2suZGF0YTtcbiAgICBmdW5jdGlvbiB0aW1lcigpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHRhc2suaW52b2tlLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgICB9IGZpbmFsbHkge1xuICAgICAgICAvLyBpc3N1ZS05MzQsIHRhc2sgd2lsbCBiZSBjYW5jZWxsZWRcbiAgICAgICAgLy8gZXZlbiBpdCBpcyBhIHBlcmlvZGljIHRhc2sgc3VjaCBhc1xuICAgICAgICAvLyBzZXRJbnRlcnZhbFxuICAgICAgICBpZiAoISh0YXNrLmRhdGEgJiYgdGFzay5kYXRhLmlzUGVyaW9kaWMpKSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkYXRhLmhhbmRsZUlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgLy8gaW4gbm9uLW5vZGVqcyBlbnYsIHdlIHJlbW92ZSB0aW1lcklkXG4gICAgICAgICAgICAvLyBmcm9tIGxvY2FsIGNhY2hlXG4gICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW2RhdGEuaGFuZGxlSWRdO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZGF0YS5oYW5kbGVJZCkge1xuICAgICAgICAgICAgLy8gTm9kZSByZXR1cm5zIGNvbXBsZXggb2JqZWN0cyBhcyBoYW5kbGVJZHNcbiAgICAgICAgICAgIC8vIHdlIHJlbW92ZSB0YXNrIHJlZmVyZW5jZSBmcm9tIHRpbWVyIG9iamVjdFxuICAgICAgICAgICAgKGRhdGEuaGFuZGxlSWQgYXMgYW55KVt0YXNrU3ltYm9sXSA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGRhdGEuYXJnc1swXSA9IHRpbWVyO1xuICAgIGRhdGEuaGFuZGxlSWQgPSBzZXROYXRpdmUhLmFwcGx5KHdpbmRvdywgZGF0YS5hcmdzKTtcbiAgICByZXR1cm4gdGFzaztcbiAgfVxuXG4gIGZ1bmN0aW9uIGNsZWFyVGFzayh0YXNrOiBUYXNrKSB7XG4gICAgcmV0dXJuIGNsZWFyTmF0aXZlISgoPFRpbWVyT3B0aW9ucz50YXNrLmRhdGEpLmhhbmRsZUlkKTtcbiAgfVxuXG4gIHNldE5hdGl2ZSA9XG4gICAgICBwYXRjaE1ldGhvZCh3aW5kb3csIHNldE5hbWUsIChkZWxlZ2F0ZTogRnVuY3Rpb24pID0+IGZ1bmN0aW9uKHNlbGY6IGFueSwgYXJnczogYW55W10pIHtcbiAgICAgICAgaWYgKHR5cGVvZiBhcmdzWzBdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgY29uc3Qgb3B0aW9uczogVGltZXJPcHRpb25zID0ge1xuICAgICAgICAgICAgaXNQZXJpb2RpYzogbmFtZVN1ZmZpeCA9PT0gJ0ludGVydmFsJyxcbiAgICAgICAgICAgIGRlbGF5OiAobmFtZVN1ZmZpeCA9PT0gJ1RpbWVvdXQnIHx8IG5hbWVTdWZmaXggPT09ICdJbnRlcnZhbCcpID8gYXJnc1sxXSB8fCAwIDpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgYXJnczogYXJnc1xuICAgICAgICAgIH07XG4gICAgICAgICAgY29uc3QgdGFzayA9XG4gICAgICAgICAgICAgIHNjaGVkdWxlTWFjcm9UYXNrV2l0aEN1cnJlbnRab25lKHNldE5hbWUsIGFyZ3NbMF0sIG9wdGlvbnMsIHNjaGVkdWxlVGFzaywgY2xlYXJUYXNrKTtcbiAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBOb2RlLmpzIG11c3QgYWRkaXRpb25hbGx5IHN1cHBvcnQgdGhlIHJlZiBhbmQgdW5yZWYgZnVuY3Rpb25zLlxuICAgICAgICAgIGNvbnN0IGhhbmRsZTogYW55ID0gKDxUaW1lck9wdGlvbnM+dGFzay5kYXRhKS5oYW5kbGVJZDtcbiAgICAgICAgICBpZiAodHlwZW9mIGhhbmRsZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIC8vIGZvciBub24gbm9kZWpzIGVudiwgd2Ugc2F2ZSBoYW5kbGVJZDogdGFza1xuICAgICAgICAgICAgLy8gbWFwcGluZyBpbiBsb2NhbCBjYWNoZSBmb3IgY2xlYXJUaW1lb3V0XG4gICAgICAgICAgICB0YXNrc0J5SGFuZGxlSWRbaGFuZGxlXSA9IHRhc2s7XG4gICAgICAgICAgfSBlbHNlIGlmIChoYW5kbGUpIHtcbiAgICAgICAgICAgIC8vIGZvciBub2RlanMgZW52LCB3ZSBzYXZlIHRhc2tcbiAgICAgICAgICAgIC8vIHJlZmVyZW5jZSBpbiB0aW1lcklkIE9iamVjdCBmb3IgY2xlYXJUaW1lb3V0XG4gICAgICAgICAgICBoYW5kbGVbdGFza1N5bWJvbF0gPSB0YXNrO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIGNoZWNrIHdoZXRoZXIgaGFuZGxlIGlzIG51bGwsIGJlY2F1c2Ugc29tZSBwb2x5ZmlsbCBvciBicm93c2VyXG4gICAgICAgICAgLy8gbWF5IHJldHVybiB1bmRlZmluZWQgZnJvbSBzZXRUaW1lb3V0L3NldEludGVydmFsL3NldEltbWVkaWF0ZS9yZXF1ZXN0QW5pbWF0aW9uRnJhbWVcbiAgICAgICAgICBpZiAoaGFuZGxlICYmIGhhbmRsZS5yZWYgJiYgaGFuZGxlLnVucmVmICYmIHR5cGVvZiBoYW5kbGUucmVmID09PSAnZnVuY3Rpb24nICYmXG4gICAgICAgICAgICAgIHR5cGVvZiBoYW5kbGUudW5yZWYgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICg8YW55PnRhc2spLnJlZiA9ICg8YW55PmhhbmRsZSkucmVmLmJpbmQoaGFuZGxlKTtcbiAgICAgICAgICAgICg8YW55PnRhc2spLnVucmVmID0gKDxhbnk+aGFuZGxlKS51bnJlZi5iaW5kKGhhbmRsZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgaGFuZGxlID09PSAnbnVtYmVyJyB8fCBoYW5kbGUpIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiB0YXNrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhdXNlIGFuIGVycm9yIGJ5IGNhbGxpbmcgaXQgZGlyZWN0bHkuXG4gICAgICAgICAgcmV0dXJuIGRlbGVnYXRlLmFwcGx5KHdpbmRvdywgYXJncyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gIGNsZWFyTmF0aXZlID1cbiAgICAgIHBhdGNoTWV0aG9kKHdpbmRvdywgY2FuY2VsTmFtZSwgKGRlbGVnYXRlOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24oc2VsZjogYW55LCBhcmdzOiBhbnlbXSkge1xuICAgICAgICBjb25zdCBpZCA9IGFyZ3NbMF07XG4gICAgICAgIGxldCB0YXNrOiBUYXNrO1xuICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIC8vIG5vbiBub2RlanMgZW52LlxuICAgICAgICAgIHRhc2sgPSB0YXNrc0J5SGFuZGxlSWRbaWRdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIG5vZGVqcyBlbnYuXG4gICAgICAgICAgdGFzayA9IGlkICYmIGlkW3Rhc2tTeW1ib2xdO1xuICAgICAgICAgIC8vIG90aGVyIGVudmlyb25tZW50cy5cbiAgICAgICAgICBpZiAoIXRhc2spIHtcbiAgICAgICAgICAgIHRhc2sgPSBpZDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHRhc2sgJiYgdHlwZW9mIHRhc2sudHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICBpZiAodGFzay5zdGF0ZSAhPT0gJ25vdFNjaGVkdWxlZCcgJiZcbiAgICAgICAgICAgICAgKHRhc2suY2FuY2VsRm4gJiYgdGFzay5kYXRhIS5pc1BlcmlvZGljIHx8IHRhc2sucnVuQ291bnQgPT09IDApKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGlkID09PSAnbnVtYmVyJykge1xuICAgICAgICAgICAgICBkZWxldGUgdGFza3NCeUhhbmRsZUlkW2lkXTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaWQpIHtcbiAgICAgICAgICAgICAgaWRbdGFza1N5bWJvbF0gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gRG8gbm90IGNhbmNlbCBhbHJlYWR5IGNhbmNlbGVkIGZ1bmN0aW9uc1xuICAgICAgICAgICAgdGFzay56b25lLmNhbmNlbFRhc2sodGFzayk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIGNhdXNlIGFuIGVycm9yIGJ5IGNhbGxpbmcgaXQgZGlyZWN0bHkuXG4gICAgICAgICAgZGVsZWdhdGUuYXBwbHkod2luZG93LCBhcmdzKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG59XG4iXX0=