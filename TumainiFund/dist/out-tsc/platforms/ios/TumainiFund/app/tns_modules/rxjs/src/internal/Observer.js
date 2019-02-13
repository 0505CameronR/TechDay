import { config } from './config';
import { hostReportError } from './util/hostReportError';
export const empty = {
    closed: true,
    next(value) { },
    error(err) {
        if (config.useDeprecatedSynchronousErrorHandling) {
            throw err;
        }
        else {
            hostReportError(err);
        }
    },
    complete() { }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9PYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUV6RCxNQUFNLENBQUMsTUFBTSxLQUFLLEdBQWtCO0lBQ2xDLE1BQU0sRUFBRSxJQUFJO0lBQ1osSUFBSSxDQUFDLEtBQVUsSUFBb0IsQ0FBQztJQUNwQyxLQUFLLENBQUMsR0FBUTtRQUNaLElBQUksTUFBTSxDQUFDLHFDQUFxQyxFQUFFO1lBQ2hELE1BQU0sR0FBRyxDQUFDO1NBQ1g7YUFBTTtZQUNMLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFDRCxRQUFRLEtBQW9CLENBQUM7Q0FDOUIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE9ic2VydmVyIH0gZnJvbSAnLi90eXBlcyc7XG5pbXBvcnQgeyBjb25maWcgfSBmcm9tICcuL2NvbmZpZyc7XG5pbXBvcnQgeyBob3N0UmVwb3J0RXJyb3IgfSBmcm9tICcuL3V0aWwvaG9zdFJlcG9ydEVycm9yJztcblxuZXhwb3J0IGNvbnN0IGVtcHR5OiBPYnNlcnZlcjxhbnk+ID0ge1xuICBjbG9zZWQ6IHRydWUsXG4gIG5leHQodmFsdWU6IGFueSk6IHZvaWQgeyAvKiBub29wICovfSxcbiAgZXJyb3IoZXJyOiBhbnkpOiB2b2lkIHtcbiAgICBpZiAoY29uZmlnLnVzZURlcHJlY2F0ZWRTeW5jaHJvbm91c0Vycm9ySGFuZGxpbmcpIHtcbiAgICAgIHRocm93IGVycjtcbiAgICB9IGVsc2Uge1xuICAgICAgaG9zdFJlcG9ydEVycm9yKGVycik7XG4gICAgfVxuICB9LFxuICBjb21wbGV0ZSgpOiB2b2lkIHsgLypub29wKi8gfVxufTtcbiJdfQ==