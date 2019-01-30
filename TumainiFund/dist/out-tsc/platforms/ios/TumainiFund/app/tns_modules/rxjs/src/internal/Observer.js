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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC90bnNfbW9kdWxlcy9yeGpzL3NyYy9pbnRlcm5hbC9PYnNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLG1DQUFrQztBQUNsQywwREFBeUQ7QUFFNUMsUUFBQSxLQUFLLEdBQWtCO0lBQ2xDLE1BQU0sRUFBRSxJQUFJO0lBQ1osSUFBSSxFQUFKLFVBQUssS0FBVSxJQUFvQixDQUFDO0lBQ3BDLEtBQUssRUFBTCxVQUFNLEdBQVE7UUFDWixJQUFJLGVBQU0sQ0FBQyxxQ0FBcUMsRUFBRTtZQUNoRCxNQUFNLEdBQUcsQ0FBQztTQUNYO2FBQU07WUFDTCxpQ0FBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ3RCO0lBQ0gsQ0FBQztJQUNELFFBQVEsRUFBUixjQUE0QixDQUFDO0NBQzlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBPYnNlcnZlciB9IGZyb20gJy4vdHlwZXMnO1xuaW1wb3J0IHsgY29uZmlnIH0gZnJvbSAnLi9jb25maWcnO1xuaW1wb3J0IHsgaG9zdFJlcG9ydEVycm9yIH0gZnJvbSAnLi91dGlsL2hvc3RSZXBvcnRFcnJvcic7XG5cbmV4cG9ydCBjb25zdCBlbXB0eTogT2JzZXJ2ZXI8YW55PiA9IHtcbiAgY2xvc2VkOiB0cnVlLFxuICBuZXh0KHZhbHVlOiBhbnkpOiB2b2lkIHsgLyogbm9vcCAqL30sXG4gIGVycm9yKGVycjogYW55KTogdm9pZCB7XG4gICAgaWYgKGNvbmZpZy51c2VEZXByZWNhdGVkU3luY2hyb25vdXNFcnJvckhhbmRsaW5nKSB7XG4gICAgICB0aHJvdyBlcnI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhvc3RSZXBvcnRFcnJvcihlcnIpO1xuICAgIH1cbiAgfSxcbiAgY29tcGxldGUoKTogdm9pZCB7IC8qbm9vcCovIH1cbn07XG4iXX0=