"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Observable_1 = require("../Observable");
var Subscription_1 = require("../Subscription");
var SubscriptionLoggable_1 = require("./SubscriptionLoggable");
var applyMixins_1 = require("../util/applyMixins");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var ColdObservable = /** @class */ (function (_super) {
    __extends(ColdObservable, _super);
    function ColdObservable(messages, scheduler) {
        var _this = _super.call(this, function (subscriber) {
            var observable = this;
            var index = observable.logSubscribedFrame();
            var subscription = new Subscription_1.Subscription();
            subscription.add(new Subscription_1.Subscription(function () {
                observable.logUnsubscribedFrame(index);
            }));
            observable.scheduleMessages(subscriber);
            return subscription;
        }) || this;
        _this.messages = messages;
        _this.subscriptions = [];
        _this.scheduler = scheduler;
        return _this;
    }
    ColdObservable.prototype.scheduleMessages = function (subscriber) {
        var messagesLength = this.messages.length;
        for (var i = 0; i < messagesLength; i++) {
            var message = this.messages[i];
            subscriber.add(this.scheduler.schedule(function (_a) {
                var message = _a.message, subscriber = _a.subscriber;
                message.notification.observe(subscriber);
            }, message.frame, { message: message, subscriber: subscriber }));
        }
    };
    return ColdObservable;
}(Observable_1.Observable));
exports.ColdObservable = ColdObservable;
applyMixins_1.applyMixins(ColdObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiQ29sZE9ic2VydmFibGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3Rlc3RpbmcvQ29sZE9ic2VydmFibGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNENBQTJDO0FBQzNDLGdEQUErQztBQUkvQywrREFBOEQ7QUFDOUQsbURBQWtEO0FBR2xEOzs7O0dBSUc7QUFDSDtJQUF1QyxrQ0FBYTtJQU1sRCx3QkFBbUIsUUFBdUIsRUFDOUIsU0FBb0I7UUFEaEMsWUFFRSxrQkFBTSxVQUErQixVQUEyQjtZQUM5RCxJQUFNLFVBQVUsR0FBc0IsSUFBVyxDQUFDO1lBQ2xELElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO1lBQzlDLElBQU0sWUFBWSxHQUFHLElBQUksMkJBQVksRUFBRSxDQUFDO1lBQ3hDLFlBQVksQ0FBQyxHQUFHLENBQUMsSUFBSSwyQkFBWSxDQUFDO2dCQUNoQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNKLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUN4QyxPQUFPLFlBQVksQ0FBQztRQUN0QixDQUFDLENBQUMsU0FFSDtRQWJrQixjQUFRLEdBQVIsUUFBUSxDQUFlO1FBTG5DLG1CQUFhLEdBQXNCLEVBQUUsQ0FBQztRQWlCM0MsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0lBQzdCLENBQUM7SUFFRCx5Q0FBZ0IsR0FBaEIsVUFBaUIsVUFBMkI7UUFDMUMsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDNUMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLGNBQWMsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN2QyxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2pDLFVBQVUsQ0FBQyxHQUFHLENBQ1osSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsVUFBQyxFQUF1QjtvQkFBckIsb0JBQU8sRUFBRSwwQkFBVTtnQkFBUyxPQUFPLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQztZQUFDLENBQUMsRUFDaEcsT0FBTyxDQUFDLEtBQUssRUFDYixFQUFFLE9BQU8sU0FBQSxFQUFFLFVBQVUsWUFBQSxFQUFFLENBQUMsQ0FDM0IsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUNILHFCQUFDO0FBQUQsQ0FBQyxBQWhDRCxDQUF1Qyx1QkFBVSxHQWdDaEQ7QUFoQ1ksd0NBQWM7QUFpQzNCLHlCQUFXLENBQUMsY0FBYyxFQUFFLENBQUMsMkNBQW9CLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJy4uL09ic2VydmFibGUnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAnLi4vU3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IFNjaGVkdWxlciB9IGZyb20gJy4uL1NjaGVkdWxlcic7XG5pbXBvcnQgeyBUZXN0TWVzc2FnZSB9IGZyb20gJy4vVGVzdE1lc3NhZ2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2cnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uTG9nZ2FibGUgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZ2dhYmxlJztcbmltcG9ydCB7IGFwcGx5TWl4aW5zIH0gZnJvbSAnLi4vdXRpbC9hcHBseU1peGlucyc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5cbi8qKlxuICogV2UgbmVlZCB0aGlzIEpTRG9jIGNvbW1lbnQgZm9yIGFmZmVjdGluZyBFU0RvYy5cbiAqIEBpZ25vcmVcbiAqIEBleHRlbmRzIHtJZ25vcmVkfVxuICovXG5leHBvcnQgY2xhc3MgQ29sZE9ic2VydmFibGU8VD4gZXh0ZW5kcyBPYnNlcnZhYmxlPFQ+IGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTG9nZ2FibGUge1xuICBwdWJsaWMgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uTG9nW10gPSBbXTtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXI7XG4gIGxvZ1N1YnNjcmliZWRGcmFtZTogKCkgPT4gbnVtYmVyO1xuICBsb2dVbnN1YnNjcmliZWRGcmFtZTogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG1lc3NhZ2VzOiBUZXN0TWVzc2FnZVtdLFxuICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlcikge1xuICAgIHN1cGVyKGZ1bmN0aW9uICh0aGlzOiBPYnNlcnZhYmxlPFQ+LCBzdWJzY3JpYmVyOiBTdWJzY3JpYmVyPGFueT4pIHtcbiAgICAgIGNvbnN0IG9ic2VydmFibGU6IENvbGRPYnNlcnZhYmxlPFQ+ID0gdGhpcyBhcyBhbnk7XG4gICAgICBjb25zdCBpbmRleCA9IG9ic2VydmFibGUubG9nU3Vic2NyaWJlZEZyYW1lKCk7XG4gICAgICBjb25zdCBzdWJzY3JpcHRpb24gPSBuZXcgU3Vic2NyaXB0aW9uKCk7XG4gICAgICBzdWJzY3JpcHRpb24uYWRkKG5ldyBTdWJzY3JpcHRpb24oKCkgPT4ge1xuICAgICAgICBvYnNlcnZhYmxlLmxvZ1Vuc3Vic2NyaWJlZEZyYW1lKGluZGV4KTtcbiAgICAgIH0pKTtcbiAgICAgIG9ic2VydmFibGUuc2NoZWR1bGVNZXNzYWdlcyhzdWJzY3JpYmVyKTtcbiAgICAgIHJldHVybiBzdWJzY3JpcHRpb247XG4gICAgfSk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gIH1cblxuICBzY2hlZHVsZU1lc3NhZ2VzKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pikge1xuICAgIGNvbnN0IG1lc3NhZ2VzTGVuZ3RoID0gdGhpcy5tZXNzYWdlcy5sZW5ndGg7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtZXNzYWdlc0xlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5tZXNzYWdlc1tpXTtcbiAgICAgIHN1YnNjcmliZXIuYWRkKFxuICAgICAgICB0aGlzLnNjaGVkdWxlci5zY2hlZHVsZSgoeyBtZXNzYWdlLCBzdWJzY3JpYmVyIH0pID0+IHsgbWVzc2FnZS5ub3RpZmljYXRpb24ub2JzZXJ2ZShzdWJzY3JpYmVyKTsgfSxcbiAgICAgICAgICBtZXNzYWdlLmZyYW1lLFxuICAgICAgICAgIHsgbWVzc2FnZSwgc3Vic2NyaWJlciB9KVxuICAgICAgKTtcbiAgICB9XG4gIH1cbn1cbmFwcGx5TWl4aW5zKENvbGRPYnNlcnZhYmxlLCBbU3Vic2NyaXB0aW9uTG9nZ2FibGVdKTtcbiJdfQ==