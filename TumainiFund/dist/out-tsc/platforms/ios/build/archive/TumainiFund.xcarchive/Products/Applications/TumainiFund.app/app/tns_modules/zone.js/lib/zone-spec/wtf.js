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
(function (global) {
    // Detect and setup WTF.
    var wtfTrace = null;
    var wtfEvents = null;
    var wtfEnabled = (function () {
        var wtf = global['wtf'];
        if (wtf) {
            wtfTrace = wtf.trace;
            if (wtfTrace) {
                wtfEvents = wtfTrace.events;
                return true;
            }
        }
        return false;
    })();
    var WtfZoneSpec = /** @class */ (function () {
        function WtfZoneSpec() {
            this.name = 'WTF';
        }
        WtfZoneSpec.prototype.onFork = function (parentZoneDelegate, currentZone, targetZone, zoneSpec) {
            var retValue = parentZoneDelegate.fork(targetZone, zoneSpec);
            WtfZoneSpec.forkInstance(zonePathName(targetZone), retValue.name);
            return retValue;
        };
        WtfZoneSpec.prototype.onInvoke = function (parentZoneDelegate, currentZone, targetZone, delegate, applyThis, applyArgs, source) {
            var src = source || 'unknown';
            var scope = WtfZoneSpec.invokeScope[src];
            if (!scope) {
                scope = WtfZoneSpec.invokeScope[src] =
                    wtfEvents.createScope("Zone:invoke:" + source + "(ascii zone)");
            }
            return wtfTrace.leaveScope(scope(zonePathName(targetZone)), parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs, source));
        };
        WtfZoneSpec.prototype.onHandleError = function (parentZoneDelegate, currentZone, targetZone, error) {
            return parentZoneDelegate.handleError(targetZone, error);
        };
        WtfZoneSpec.prototype.onScheduleTask = function (parentZoneDelegate, currentZone, targetZone, task) {
            var key = task.type + ':' + task.source;
            var instance = WtfZoneSpec.scheduleInstance[key];
            if (!instance) {
                instance = WtfZoneSpec.scheduleInstance[key] =
                    wtfEvents.createInstance("Zone:schedule:" + key + "(ascii zone, any data)");
            }
            var retValue = parentZoneDelegate.scheduleTask(targetZone, task);
            instance(zonePathName(targetZone), shallowObj(task.data, 2));
            return retValue;
        };
        WtfZoneSpec.prototype.onInvokeTask = function (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs) {
            var source = task.source;
            var scope = WtfZoneSpec.invokeTaskScope[source];
            if (!scope) {
                scope = WtfZoneSpec.invokeTaskScope[source] =
                    wtfEvents.createScope("Zone:invokeTask:" + source + "(ascii zone)");
            }
            return wtfTrace.leaveScope(scope(zonePathName(targetZone)), parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs));
        };
        WtfZoneSpec.prototype.onCancelTask = function (parentZoneDelegate, currentZone, targetZone, task) {
            var key = task.source;
            var instance = WtfZoneSpec.cancelInstance[key];
            if (!instance) {
                instance = WtfZoneSpec.cancelInstance[key] =
                    wtfEvents.createInstance("Zone:cancel:" + key + "(ascii zone, any options)");
            }
            var retValue = parentZoneDelegate.cancelTask(targetZone, task);
            instance(zonePathName(targetZone), shallowObj(task.data, 2));
            return retValue;
        };
        WtfZoneSpec.forkInstance = wtfEnabled ? wtfEvents.createInstance('Zone:fork(ascii zone, ascii newZone)') : null;
        WtfZoneSpec.scheduleInstance = {};
        WtfZoneSpec.cancelInstance = {};
        WtfZoneSpec.invokeScope = {};
        WtfZoneSpec.invokeTaskScope = {};
        return WtfZoneSpec;
    }());
    function shallowObj(obj, depth) {
        if (!obj || !depth)
            return null;
        var out = {};
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                var value = obj[key];
                switch (typeof value) {
                    case 'object':
                        var name_1 = value && value.constructor && value.constructor.name;
                        value = name_1 == Object.name ? shallowObj(value, depth - 1) : name_1;
                        break;
                    case 'function':
                        value = value.name || undefined;
                        break;
                }
                out[key] = value;
            }
        }
        return out;
    }
    function zonePathName(zone) {
        var name = zone.name;
        var localZone = zone.parent;
        while (localZone != null) {
            name = localZone.name + '::' + name;
            localZone = localZone.parent;
        }
        return name;
    }
    Zone['wtfZoneSpec'] = !wtfEnabled ? null : new WtfZoneSpec();
})(typeof window === 'object' && window || typeof self === 'object' && self || global);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3RmLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC90bnNfbW9kdWxlcy96b25lLmpzL2xpYi96b25lLXNwZWMvd3RmLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNIOzs7R0FHRztBQUVILENBQUMsVUFBUyxNQUFXO0lBb0JyQix3QkFBd0I7SUFDeEIsSUFBSSxRQUFRLEdBQWtCLElBQUksQ0FBQztJQUNuQyxJQUFJLFNBQVMsR0FBbUIsSUFBSSxDQUFDO0lBQ3JDLElBQU0sVUFBVSxHQUFZLENBQUM7UUFDM0IsSUFBTSxHQUFHLEdBQVEsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQy9CLElBQUksR0FBRyxFQUFFO1lBQ1AsUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUM7WUFDckIsSUFBSSxRQUFRLEVBQUU7Z0JBQ1osU0FBUyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUM7Z0JBQzVCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtRQUNELE9BQU8sS0FBSyxDQUFDO0lBQ2YsQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUVMO1FBQUE7WUFDRSxTQUFJLEdBQVcsS0FBSyxDQUFDO1FBNEV2QixDQUFDO1FBbkVDLDRCQUFNLEdBQU4sVUFBTyxrQkFBZ0MsRUFBRSxXQUFpQixFQUFFLFVBQWdCLEVBQUUsUUFBa0I7WUFFOUYsSUFBTSxRQUFRLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvRCxXQUFXLENBQUMsWUFBYSxDQUFDLFlBQVksQ0FBQyxVQUFVLENBQUMsRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7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Q0FBQyxXQUFZLENBQUMsSUFBSSxDQUFDO3dCQUN6RSxLQUFLLEdBQUcsTUFBSSxJQUFVLE1BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFJLENBQUM7d0JBQ3pFLE1BQU07b0JBQ1IsS0FBSyxVQUFVO3dCQUNiLEtBQUssR0FBRyxLQUFLLENBQUMsSUFBSSxJQUFJLFNBQVMsQ0FBQzt3QkFDaEMsTUFBTTtpQkFDVDtnQkFDRCxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2FBQ2xCO1NBQ0Y7UUFDRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7SUFFRCxTQUFTLFlBQVksQ0FBQyxJQUFVO1FBQzlCLElBQUksSUFBSSxHQUFXLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDN0IsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUM1QixPQUFPLFNBQVMsSUFBSSxJQUFJLEVBQUU7WUFDeEIsSUFBSSxHQUFHLFNBQVMsQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNwQyxTQUFTLEdBQUcsU0FBUyxDQUFDLE1BQU0sQ0FBQztTQUM5QjtRQUNELE9BQU8sSUFBSSxDQUFDO0lBQ2QsQ0FBQztJQUVBLElBQVksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFdBQVcsRUFBRSxDQUFDO0FBQ3RFLENBQUMsQ0FBQyxDQUFDLE9BQU8sTUFBTSxLQUFLLFFBQVEsSUFBSSxNQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksSUFBSSxNQUFNLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgSW5jLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbi8qKlxuICogQGZpbGVvdmVydmlld1xuICogQHN1cHByZXNzIHttaXNzaW5nUmVxdWlyZX1cbiAqL1xuXG4oZnVuY3Rpb24oZ2xvYmFsOiBhbnkpIHtcbmludGVyZmFjZSBXdGYge1xuICB0cmFjZTogV3RmVHJhY2U7XG59XG5pbnRlcmZhY2UgV3RmU2NvcGUge31cbmludGVyZmFjZSBXdGZSYW5nZSB7fVxuaW50ZXJmYWNlIFd0ZlRyYWNlIHtcbiAgZXZlbnRzOiBXdGZFdmVudHM7XG4gIGxlYXZlU2NvcGUoc2NvcGU6IFd0ZlNjb3BlLCByZXR1cm5WYWx1ZT86IGFueSk6IHZvaWQ7XG4gIGJlZ2luVGltZVJhbmdlKHJhbmdlVHlwZTogc3RyaW5nLCBhY3Rpb246IHN0cmluZyk6IFd0ZlJhbmdlO1xuICBlbmRUaW1lUmFuZ2UocmFuZ2U6IFd0ZlJhbmdlKTogdm9pZDtcbn1cbmludGVyZmFjZSBXdGZFdmVudHMge1xuICBjcmVhdGVTY29wZShzaWduYXR1cmU6IHN0cmluZywgZmxhZ3M/OiBhbnkpOiBXdGZTY29wZUZuO1xuICBjcmVhdGVJbnN0YW5jZShzaWduYXR1cmU6IHN0cmluZywgZmxhZ3M/OiBhbnkpOiBXdGZFdmVudEZuO1xufVxuXG50eXBlIFd0ZlNjb3BlRm4gPSAoLi4uYXJnczogYW55W10pID0+IFd0ZlNjb3BlO1xudHlwZSBXdGZFdmVudEZuID0gKC4uLmFyZ3M6IGFueVtdKSA9PiBhbnk7XG5cbi8vIERldGVjdCBhbmQgc2V0dXAgV1RGLlxubGV0IHd0ZlRyYWNlOiBXdGZUcmFjZXxudWxsID0gbnVsbDtcbmxldCB3dGZFdmVudHM6IFd0ZkV2ZW50c3xudWxsID0gbnVsbDtcbmNvbnN0IHd0ZkVuYWJsZWQ6IGJvb2xlYW4gPSAoZnVuY3Rpb24oKTogYm9vbGVhbiB7XG4gIGNvbnN0IHd0ZjogV3RmID0gZ2xvYmFsWyd3dGYnXTtcbiAgaWYgKHd0Zikge1xuICAgIHd0ZlRyYWNlID0gd3RmLnRyYWNlO1xuICAgIGlmICh3dGZUcmFjZSkge1xuICAgICAgd3RmRXZlbnRzID0gd3RmVHJhY2UuZXZlbnRzO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiBmYWxzZTtcbn0pKCk7XG5cbmNsYXNzIFd0ZlpvbmVTcGVjIGltcGxlbWVudHMgWm9uZVNwZWMge1xuICBuYW1lOiBzdHJpbmcgPSAnV1RGJztcblxuICBzdGF0aWMgZm9ya0luc3RhbmNlID1cbiAgICAgIHd0ZkVuYWJsZWQgPyB3dGZFdmVudHMhLmNyZWF0ZUluc3RhbmNlKCdab25lOmZvcmsoYXNjaWkgem9uZSwgYXNjaWkgbmV3Wm9uZSknKSA6IG51bGw7XG4gIHN0YXRpYyBzY2hlZHVsZUluc3RhbmNlOiB7W2tleTogc3RyaW5nXTogV3RmRXZlbnRGbn0gPSB7fTtcbiAgc3RhdGljIGNhbmNlbEluc3RhbmNlOiB7W2tleTogc3RyaW5nXTogV3RmRXZlbnRGbn0gPSB7fTtcbiAgc3RhdGljIGludm9rZVNjb3BlOiB7W2tleTogc3RyaW5nXTogV3RmRXZlbnRGbn0gPSB7fTtcbiAgc3RhdGljIGludm9rZVRhc2tTY29wZToge1trZXk6IHN0cmluZ106IFd0ZkV2ZW50Rm59ID0ge307XG5cbiAgb25Gb3JrKHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgem9uZVNwZWM6IFpvbmVTcGVjKTpcbiAgICAgIFpvbmUge1xuICAgIGNvbnN0IHJldFZhbHVlID0gcGFyZW50Wm9uZURlbGVnYXRlLmZvcmsodGFyZ2V0Wm9uZSwgem9uZVNwZWMpO1xuICAgIFd0ZlpvbmVTcGVjLmZvcmtJbnN0YW5jZSEoem9uZVBhdGhOYW1lKHRhcmdldFpvbmUpLCByZXRWYWx1ZS5uYW1lKTtcbiAgICByZXR1cm4gcmV0VmFsdWU7XG4gIH1cblxuICBvbkludm9rZShcbiAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZTogWm9uZURlbGVnYXRlLCBjdXJyZW50Wm9uZTogWm9uZSwgdGFyZ2V0Wm9uZTogWm9uZSwgZGVsZWdhdGU6IEZ1bmN0aW9uLFxuICAgICAgYXBwbHlUaGlzOiBhbnksIGFwcGx5QXJncz86IGFueVtdLCBzb3VyY2U/OiBzdHJpbmcpOiBhbnkge1xuICAgIGNvbnN0IHNyYyA9IHNvdXJjZSB8fCAndW5rbm93bic7XG4gICAgbGV0IHNjb3BlID0gV3RmWm9uZVNwZWMuaW52b2tlU2NvcGVbc3JjXTtcbiAgICBpZiAoIXNjb3BlKSB7XG4gICAgICBzY29wZSA9IFd0ZlpvbmVTcGVjLmludm9rZVNjb3BlW3NyY10gPVxuICAgICAgICAgIHd0ZkV2ZW50cyEuY3JlYXRlU2NvcGUoYFpvbmU6aW52b2tlOiR7c291cmNlfShhc2NpaSB6b25lKWApO1xuICAgIH1cbiAgICByZXR1cm4gd3RmVHJhY2UhLmxlYXZlU2NvcGUoXG4gICAgICAgIHNjb3BlKHpvbmVQYXRoTmFtZSh0YXJnZXRab25lKSksXG4gICAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2UodGFyZ2V0Wm9uZSwgZGVsZWdhdGUsIGFwcGx5VGhpcywgYXBwbHlBcmdzLCBzb3VyY2UpKTtcbiAgfVxuXG5cbiAgb25IYW5kbGVFcnJvcihwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIGVycm9yOiBhbnkpOlxuICAgICAgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHBhcmVudFpvbmVEZWxlZ2F0ZS5oYW5kbGVFcnJvcih0YXJnZXRab25lLCBlcnJvcik7XG4gIH1cblxuICBvblNjaGVkdWxlVGFzayhwYXJlbnRab25lRGVsZWdhdGU6IFpvbmVEZWxlZ2F0ZSwgY3VycmVudFpvbmU6IFpvbmUsIHRhcmdldFpvbmU6IFpvbmUsIHRhc2s6IFRhc2spOlxuICAgICAgYW55IHtcbiAgICBjb25zdCBrZXkgPSB0YXNrLnR5cGUgKyAnOicgKyB0YXNrLnNvdXJjZTtcbiAgICBsZXQgaW5zdGFuY2UgPSBXdGZab25lU3BlYy5zY2hlZHVsZUluc3RhbmNlW2tleV07XG4gICAgaWYgKCFpbnN0YW5jZSkge1xuICAgICAgaW5zdGFuY2UgPSBXdGZab25lU3BlYy5zY2hlZHVsZUluc3RhbmNlW2tleV0gPVxuICAgICAgICAgIHd0ZkV2ZW50cyEuY3JlYXRlSW5zdGFuY2UoYFpvbmU6c2NoZWR1bGU6JHtrZXl9KGFzY2lpIHpvbmUsIGFueSBkYXRhKWApO1xuICAgIH1cbiAgICBjb25zdCByZXRWYWx1ZSA9IHBhcmVudFpvbmVEZWxlZ2F0ZS5zY2hlZHVsZVRhc2sodGFyZ2V0Wm9uZSwgdGFzayk7XG4gICAgaW5zdGFuY2Uoem9uZVBhdGhOYW1lKHRhcmdldFpvbmUpLCBzaGFsbG93T2JqKHRhc2suZGF0YSwgMikpO1xuICAgIHJldHVybiByZXRWYWx1ZTtcbiAgfVxuXG5cbiAgb25JbnZva2VUYXNrKFxuICAgICAgcGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrLFxuICAgICAgYXBwbHlUaGlzPzogYW55LCBhcHBseUFyZ3M/OiBhbnlbXSk6IGFueSB7XG4gICAgY29uc3Qgc291cmNlID0gdGFzay5zb3VyY2U7XG4gICAgbGV0IHNjb3BlID0gV3RmWm9uZVNwZWMuaW52b2tlVGFza1Njb3BlW3NvdXJjZV07XG4gICAgaWYgKCFzY29wZSkge1xuICAgICAgc2NvcGUgPSBXdGZab25lU3BlYy5pbnZva2VUYXNrU2NvcGVbc291cmNlXSA9XG4gICAgICAgICAgd3RmRXZlbnRzIS5jcmVhdGVTY29wZShgWm9uZTppbnZva2VUYXNrOiR7c291cmNlfShhc2NpaSB6b25lKWApO1xuICAgIH1cbiAgICByZXR1cm4gd3RmVHJhY2UhLmxlYXZlU2NvcGUoXG4gICAgICAgIHNjb3BlKHpvbmVQYXRoTmFtZSh0YXJnZXRab25lKSksXG4gICAgICAgIHBhcmVudFpvbmVEZWxlZ2F0ZS5pbnZva2VUYXNrKHRhcmdldFpvbmUsIHRhc2ssIGFwcGx5VGhpcywgYXBwbHlBcmdzKSk7XG4gIH1cblxuICBvbkNhbmNlbFRhc2socGFyZW50Wm9uZURlbGVnYXRlOiBab25lRGVsZWdhdGUsIGN1cnJlbnRab25lOiBab25lLCB0YXJnZXRab25lOiBab25lLCB0YXNrOiBUYXNrKTpcbiAgICAgIGFueSB7XG4gICAgY29uc3Qga2V5ID0gdGFzay5zb3VyY2U7XG4gICAgbGV0IGluc3RhbmNlID0gV3RmWm9uZVNwZWMuY2FuY2VsSW5zdGFuY2Vba2V5XTtcbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICBpbnN0YW5jZSA9IFd0ZlpvbmVTcGVjLmNhbmNlbEluc3RhbmNlW2tleV0gPVxuICAgICAgICAgIHd0ZkV2ZW50cyEuY3JlYXRlSW5zdGFuY2UoYFpvbmU6Y2FuY2VsOiR7a2V5fShhc2NpaSB6b25lLCBhbnkgb3B0aW9ucylgKTtcbiAgICB9XG4gICAgY29uc3QgcmV0VmFsdWUgPSBwYXJlbnRab25lRGVsZWdhdGUuY2FuY2VsVGFzayh0YXJnZXRab25lLCB0YXNrKTtcbiAgICBpbnN0YW5jZSh6b25lUGF0aE5hbWUodGFyZ2V0Wm9uZSksIHNoYWxsb3dPYmoodGFzay5kYXRhLCAyKSk7XG4gICAgcmV0dXJuIHJldFZhbHVlO1xuICB9XG59XG5cbmZ1bmN0aW9uIHNoYWxsb3dPYmoob2JqOiB7W2s6IHN0cmluZ106IGFueX18dW5kZWZpbmVkLCBkZXB0aDogbnVtYmVyKTogYW55IHtcbiAgaWYgKCFvYmogfHwgIWRlcHRoKSByZXR1cm4gbnVsbDtcbiAgY29uc3Qgb3V0OiB7W2s6IHN0cmluZ106IGFueX0gPSB7fTtcbiAgZm9yIChjb25zdCBrZXkgaW4gb2JqKSB7XG4gICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBsZXQgdmFsdWUgPSBvYmpba2V5XTtcbiAgICAgIHN3aXRjaCAodHlwZW9mIHZhbHVlKSB7XG4gICAgICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICAgICAgY29uc3QgbmFtZSA9IHZhbHVlICYmIHZhbHVlLmNvbnN0cnVjdG9yICYmICg8YW55PnZhbHVlLmNvbnN0cnVjdG9yKS5uYW1lO1xuICAgICAgICAgIHZhbHVlID0gbmFtZSA9PSAoPGFueT5PYmplY3QpLm5hbWUgPyBzaGFsbG93T2JqKHZhbHVlLCBkZXB0aCAtIDEpIDogbmFtZTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgICAgIHZhbHVlID0gdmFsdWUubmFtZSB8fCB1bmRlZmluZWQ7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBvdXRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuXG5mdW5jdGlvbiB6b25lUGF0aE5hbWUoem9uZTogWm9uZSkge1xuICBsZXQgbmFtZTogc3RyaW5nID0gem9uZS5uYW1lO1xuICBsZXQgbG9jYWxab25lID0gem9uZS5wYXJlbnQ7XG4gIHdoaWxlIChsb2NhbFpvbmUgIT0gbnVsbCkge1xuICAgIG5hbWUgPSBsb2NhbFpvbmUubmFtZSArICc6OicgKyBuYW1lO1xuICAgIGxvY2FsWm9uZSA9IGxvY2FsWm9uZS5wYXJlbnQ7XG4gIH1cbiAgcmV0dXJuIG5hbWU7XG59XG5cbihab25lIGFzIGFueSlbJ3d0ZlpvbmVTcGVjJ10gPSAhd3RmRW5hYmxlZCA/IG51bGwgOiBuZXcgV3RmWm9uZVNwZWMoKTtcbn0pKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnICYmIHdpbmRvdyB8fCB0eXBlb2Ygc2VsZiA9PT0gJ29iamVjdCcgJiYgc2VsZiB8fCBnbG9iYWwpO1xuIl19