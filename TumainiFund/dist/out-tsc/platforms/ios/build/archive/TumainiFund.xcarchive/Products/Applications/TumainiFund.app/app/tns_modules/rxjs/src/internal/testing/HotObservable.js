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
var Subject_1 = require("../Subject");
var Subscription_1 = require("../Subscription");
var SubscriptionLoggable_1 = require("./SubscriptionLoggable");
var applyMixins_1 = require("../util/applyMixins");
/**
 * We need this JSDoc comment for affecting ESDoc.
 * @ignore
 * @extends {Ignored}
 */
var HotObservable = /** @class */ (function (_super) {
    __extends(HotObservable, _super);
    function HotObservable(messages, scheduler) {
        var _this = _super.call(this) || this;
        _this.messages = messages;
        _this.subscriptions = [];
        _this.scheduler = scheduler;
        return _this;
    }
    /** @deprecated This is an internal implementation detail, do not use. */
    HotObservable.prototype._subscribe = function (subscriber) {
        var subject = this;
        var index = subject.logSubscribedFrame();
        var subscription = new Subscription_1.Subscription();
        subscription.add(new Subscription_1.Subscription(function () {
            subject.logUnsubscribedFrame(index);
        }));
        subscription.add(_super.prototype._subscribe.call(this, subscriber));
        return subscription;
    };
    HotObservable.prototype.setup = function () {
        var subject = this;
        var messagesLength = subject.messages.length;
        /* tslint:disable:no-var-keyword */
        for (var i = 0; i < messagesLength; i++) {
            (function () {
                var message = subject.messages[i];
                /* tslint:enable */
                subject.scheduler.schedule(function () { message.notification.observe(subject); }, message.frame);
            })();
        }
    };
    return HotObservable;
}(Subject_1.Subject));
exports.HotObservable = HotObservable;
applyMixins_1.applyMixins(HotObservable, [SubscriptionLoggable_1.SubscriptionLoggable]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90T2JzZXJ2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvdG5zX21vZHVsZXMvcnhqcy9zcmMvaW50ZXJuYWwvdGVzdGluZy9Ib3RPYnNlcnZhYmxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNDQUFxQztBQUVyQyxnREFBK0M7QUFJL0MsK0RBQThEO0FBQzlELG1EQUFrRDtBQUVsRDs7OztHQUlHO0FBQ0g7SUFBc0MsaUNBQVU7SUFNOUMsdUJBQW1CLFFBQXVCLEVBQzlCLFNBQW9CO1FBRGhDLFlBRUUsaUJBQU8sU0FFUjtRQUprQixjQUFRLEdBQVIsUUFBUSxDQUFlO1FBTG5DLG1CQUFhLEdBQXNCLEVBQUUsQ0FBQztRQVEzQyxLQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQzs7SUFDN0IsQ0FBQztJQUVELHlFQUF5RTtJQUN6RSxrQ0FBVSxHQUFWLFVBQVcsVUFBMkI7UUFDcEMsSUFBTSxPQUFPLEdBQXFCLElBQUksQ0FBQztRQUN2QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMzQyxJQUFNLFlBQVksR0FBRyxJQUFJLDJCQUFZLEVBQUUsQ0FBQztRQUN4QyxZQUFZLENBQUMsR0FBRyxDQUFDLElBQUksMkJBQVksQ0FBQztZQUNoQyxPQUFPLENBQUMsb0JBQW9CLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDdEMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNKLFlBQVksQ0FBQyxHQUFHLENBQUMsaUJBQU0sVUFBVSxZQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7UUFDL0MsT0FBTyxZQUFZLENBQUM7SUFDdEIsQ0FBQztJQUVELDZCQUFLLEdBQUw7UUFDRSxJQUFNLE9BQU8sR0FBRyxJQUFJLENBQUM7UUFDckIsSUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFDL0MsbUNBQW1DO1FBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxjQUFjLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdkMsQ0FBQztnQkFDQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN2QyxtQkFBbUI7Z0JBQ2QsT0FBTyxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQ3hCLGNBQVEsT0FBTyxDQUFDLFlBQVksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQ2hELE9BQU8sQ0FBQyxLQUFLLENBQ2QsQ0FBQztZQUNKLENBQUMsQ0FBQyxFQUFFLENBQUM7U0FDTjtJQUNILENBQUM7SUFDSCxvQkFBQztBQUFELENBQUMsQUF2Q0QsQ0FBc0MsaUJBQU8sR0F1QzVDO0FBdkNZLHNDQUFhO0FBd0MxQix5QkFBVyxDQUFDLGFBQWEsRUFBRSxDQUFDLDJDQUFvQixDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFN1YmplY3QgfSBmcm9tICcuLi9TdWJqZWN0JztcbmltcG9ydCB7IFN1YnNjcmliZXIgfSBmcm9tICcuLi9TdWJzY3JpYmVyJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJy4uL1N1YnNjcmlwdGlvbic7XG5pbXBvcnQgeyBTY2hlZHVsZXIgfSBmcm9tICcuLi9TY2hlZHVsZXInO1xuaW1wb3J0IHsgVGVzdE1lc3NhZ2UgfSBmcm9tICcuL1Rlc3RNZXNzYWdlJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxvZyB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nJztcbmltcG9ydCB7IFN1YnNjcmlwdGlvbkxvZ2dhYmxlIH0gZnJvbSAnLi9TdWJzY3JpcHRpb25Mb2dnYWJsZSc7XG5pbXBvcnQgeyBhcHBseU1peGlucyB9IGZyb20gJy4uL3V0aWwvYXBwbHlNaXhpbnMnO1xuXG4vKipcbiAqIFdlIG5lZWQgdGhpcyBKU0RvYyBjb21tZW50IGZvciBhZmZlY3RpbmcgRVNEb2MuXG4gKiBAaWdub3JlXG4gKiBAZXh0ZW5kcyB7SWdub3JlZH1cbiAqL1xuZXhwb3J0IGNsYXNzIEhvdE9ic2VydmFibGU8VD4gZXh0ZW5kcyBTdWJqZWN0PFQ+IGltcGxlbWVudHMgU3Vic2NyaXB0aW9uTG9nZ2FibGUge1xuICBwdWJsaWMgc3Vic2NyaXB0aW9uczogU3Vic2NyaXB0aW9uTG9nW10gPSBbXTtcbiAgc2NoZWR1bGVyOiBTY2hlZHVsZXI7XG4gIGxvZ1N1YnNjcmliZWRGcmFtZTogKCkgPT4gbnVtYmVyO1xuICBsb2dVbnN1YnNjcmliZWRGcmFtZTogKGluZGV4OiBudW1iZXIpID0+IHZvaWQ7XG5cbiAgY29uc3RydWN0b3IocHVibGljIG1lc3NhZ2VzOiBUZXN0TWVzc2FnZVtdLFxuICAgICAgICAgICAgICBzY2hlZHVsZXI6IFNjaGVkdWxlcikge1xuICAgIHN1cGVyKCk7XG4gICAgdGhpcy5zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gIH1cblxuICAvKiogQGRlcHJlY2F0ZWQgVGhpcyBpcyBhbiBpbnRlcm5hbCBpbXBsZW1lbnRhdGlvbiBkZXRhaWwsIGRvIG5vdCB1c2UuICovXG4gIF9zdWJzY3JpYmUoc3Vic2NyaWJlcjogU3Vic2NyaWJlcjxhbnk+KTogU3Vic2NyaXB0aW9uIHtcbiAgICBjb25zdCBzdWJqZWN0OiBIb3RPYnNlcnZhYmxlPFQ+ID0gdGhpcztcbiAgICBjb25zdCBpbmRleCA9IHN1YmplY3QubG9nU3Vic2NyaWJlZEZyYW1lKCk7XG4gICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbigpO1xuICAgIHN1YnNjcmlwdGlvbi5hZGQobmV3IFN1YnNjcmlwdGlvbigoKSA9PiB7XG4gICAgICBzdWJqZWN0LmxvZ1Vuc3Vic2NyaWJlZEZyYW1lKGluZGV4KTtcbiAgICB9KSk7XG4gICAgc3Vic2NyaXB0aW9uLmFkZChzdXBlci5fc3Vic2NyaWJlKHN1YnNjcmliZXIpKTtcbiAgICByZXR1cm4gc3Vic2NyaXB0aW9uO1xuICB9XG5cbiAgc2V0dXAoKSB7XG4gICAgY29uc3Qgc3ViamVjdCA9IHRoaXM7XG4gICAgY29uc3QgbWVzc2FnZXNMZW5ndGggPSBzdWJqZWN0Lm1lc3NhZ2VzLmxlbmd0aDtcbiAgICAvKiB0c2xpbnQ6ZGlzYWJsZTpuby12YXIta2V5d29yZCAqL1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWVzc2FnZXNMZW5ndGg7IGkrKykge1xuICAgICAgKCgpID0+IHtcbiAgICAgICAgdmFyIG1lc3NhZ2UgPSBzdWJqZWN0Lm1lc3NhZ2VzW2ldO1xuICAgLyogdHNsaW50OmVuYWJsZSAqL1xuICAgICAgICBzdWJqZWN0LnNjaGVkdWxlci5zY2hlZHVsZShcbiAgICAgICAgICAoKSA9PiB7IG1lc3NhZ2Uubm90aWZpY2F0aW9uLm9ic2VydmUoc3ViamVjdCk7IH0sXG4gICAgICAgICAgbWVzc2FnZS5mcmFtZVxuICAgICAgICApO1xuICAgICAgfSkoKTtcbiAgICB9XG4gIH1cbn1cbmFwcGx5TWl4aW5zKEhvdE9ic2VydmFibGUsIFtTdWJzY3JpcHRpb25Mb2dnYWJsZV0pO1xuIl19