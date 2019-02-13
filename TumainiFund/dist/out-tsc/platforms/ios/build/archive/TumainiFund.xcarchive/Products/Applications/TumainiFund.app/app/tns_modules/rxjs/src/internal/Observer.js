"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var hostReportError_1 = require("./util/hostReportError");
exports.empty = {
    closed: true,
    next: function (value) { },
    error: function (err) {
        if (config_1.config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError_1.hostReportError(err);
        }
    },
    complete: function () { }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL09ic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsbUNBQWtDO0FBQ2xDLDBEQUF5RDtBQUU1QyxRQUFBLEtBQUssR0FBa0I7SUFDbEMsTUFBTSxFQUFFLElBQUk7SUFDWixJQUFJLEVBQUosVUFBSyxLQUFVLElBQW9CLENBQUM7SUFDcEMsS0FBSyxFQUFMLFVBQU0sR0FBUTtRQUNaLElBQUksZUFBTSxDQUFDLHFDQUFxQyxFQUFFO1lBQ2hELE1BQU0sR0FBRyxDQUFDO1NBQ1g7YUFBTTtZQUNMLGlDQUFlLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdEI7SUFDSCxDQUFDO0lBQ0QsUUFBUSxFQUFSLGNBQTRCLENBQUM7Q0FDOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvaG9zdFJlcG9ydEVycm9yJztcblxuZXhwb3J0IGNvbnN0IGVtcHR5OiBPYnNlcnZlcjxhbnk+ID0ge1xuICBjbG9zZWQ6IHRydWUsXG4gIG5leHQodmFsdWU6IGFueSk6IHZvaWQgeyAvKiBub29wICovfSxcbiAgZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgfVxuICB9LFxuICBjb21wbGV0ZSgpOiB2b2lkIHsgLypub29wKi8gfVxufTtcbiJdfQ==