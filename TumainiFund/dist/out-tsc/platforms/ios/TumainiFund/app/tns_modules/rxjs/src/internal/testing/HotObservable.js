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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiSG90T2JzZXJ2YWJsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL3Ruc19tb2R1bGVzL3J4anMvc3JjL2ludGVybmFsL3Rlc3RpbmcvSG90T2JzZXJ2YWJsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBcUM7QUFFckMsZ0RBQStDO0FBSS9DLCtEQUE4RDtBQUM5RCxtREFBa0Q7QUFFbEQ7Ozs7R0FJRztBQUNIO0lBQXNDLGlDQUFVO0lBTTlDLHVCQUFtQixRQUF1QixFQUM5QixTQUFvQjtRQURoQyxZQUVFLGlCQUFPLFNBRVI7UUFKa0IsY0FBUSxHQUFSLFFBQVEsQ0FBZTtRQUxuQyxtQkFBYSxHQUFzQixFQUFFLENBQUM7UUFRM0MsS0FBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7O0lBQzdCLENBQUM7SUFFRCx5RUFBeUU7SUFDekUsa0NBQVUsR0FBVixVQUFXLFVBQTJCO1FBQ3BDLElBQU0sT0FBTyxHQUFxQixJQUFJLENBQUM7UUFDdkMsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixFQUFFLENBQUM7UUFDM0MsSUFBTSxZQUFZLEdBQUcsSUFBSSwyQkFBWSxFQUFFLENBQUM7UUFDeEMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDJCQUFZLENBQUM7WUFDaEMsT0FBTyxDQUFDLG9CQUFvQixDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3RDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDSixZQUFZLENBQUMsR0FBRyxDQUFDLGlCQUFNLFVBQVUsWUFBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1FBQy9DLE9BQU8sWUFBWSxDQUFDO0lBQ3RCLENBQUM7SUFFRCw2QkFBSyxHQUFMO1FBQ0UsSUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDO1FBQ3JCLElBQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBQy9DLG1DQUFtQztRQUNuQyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsY0FBYyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3ZDLENBQUM7Z0JBQ0MsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdkMsbUJBQW1CO2dCQUNkLE9BQU8sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUN4QixjQUFRLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUNoRCxPQUFPLENBQUMsS0FBSyxDQUNkLENBQUM7WUFDSixDQUFDLENBQUMsRUFBRSxDQUFDO1NBQ047SUFDSCxDQUFDO0lBQ0gsb0JBQUM7QUFBRCxDQUFDLEFBdkNELENBQXNDLGlCQUFPLEdBdUM1QztBQXZDWSxzQ0FBYTtBQXdDMUIseUJBQVcsQ0FBQyxhQUFhLEVBQUUsQ0FBQywyQ0FBb0IsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAnLi4vU3ViamVjdCc7XG5pbXBvcnQgeyBTdWJzY3JpYmVyIH0gZnJvbSAnLi4vU3Vic2NyaWJlcic7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICcuLi9TdWJzY3JpcHRpb24nO1xuaW1wb3J0IHsgU2NoZWR1bGVyIH0gZnJvbSAnLi4vU2NoZWR1bGVyJztcbmltcG9ydCB7IFRlc3RNZXNzYWdlIH0gZnJvbSAnLi9UZXN0TWVzc2FnZSc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2cgfSBmcm9tICcuL1N1YnNjcmlwdGlvbkxvZyc7XG5pbXBvcnQgeyBTdWJzY3JpcHRpb25Mb2dnYWJsZSB9IGZyb20gJy4vU3Vic2NyaXB0aW9uTG9nZ2FibGUnO1xuaW1wb3J0IHsgYXBwbHlNaXhpbnMgfSBmcm9tICcuLi91dGlsL2FwcGx5TWl4aW5zJztcblxuLyoqXG4gKiBXZSBuZWVkIHRoaXMgSlNEb2MgY29tbWVudCBmb3IgYWZmZWN0aW5nIEVTRG9jLlxuICogQGlnbm9yZVxuICogQGV4dGVuZHMge0lnbm9yZWR9XG4gKi9cbmV4cG9ydCBjbGFzcyBIb3RPYnNlcnZhYmxlPFQ+IGV4dGVuZHMgU3ViamVjdDxUPiBpbXBsZW1lbnRzIFN1YnNjcmlwdGlvbkxvZ2dhYmxlIHtcbiAgcHVibGljIHN1YnNjcmlwdGlvbnM6IFN1YnNjcmlwdGlvbkxvZ1tdID0gW107XG4gIHNjaGVkdWxlcjogU2NoZWR1bGVyO1xuICBsb2dTdWJzY3JpYmVkRnJhbWU6ICgpID0+IG51bWJlcjtcbiAgbG9nVW5zdWJzY3JpYmVkRnJhbWU6IChpbmRleDogbnVtYmVyKSA9PiB2b2lkO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXNzYWdlczogVGVzdE1lc3NhZ2VbXSxcbiAgICAgICAgICAgICAgc2NoZWR1bGVyOiBTY2hlZHVsZXIpIHtcbiAgICBzdXBlcigpO1xuICAgIHRoaXMuc2NoZWR1bGVyID0gc2NoZWR1bGVyO1xuICB9XG5cbiAgLyoqIEBkZXByZWNhdGVkIFRoaXMgaXMgYW4gaW50ZXJuYWwgaW1wbGVtZW50YXRpb24gZGV0YWlsLCBkbyBub3QgdXNlLiAqL1xuICBfc3Vic2NyaWJlKHN1YnNjcmliZXI6IFN1YnNjcmliZXI8YW55Pik6IFN1YnNjcmlwdGlvbiB7XG4gICAgY29uc3Qgc3ViamVjdDogSG90T2JzZXJ2YWJsZTxUPiA9IHRoaXM7XG4gICAgY29uc3QgaW5kZXggPSBzdWJqZWN0LmxvZ1N1YnNjcmliZWRGcmFtZSgpO1xuICAgIGNvbnN0IHN1YnNjcmlwdGlvbiA9IG5ldyBTdWJzY3JpcHRpb24oKTtcbiAgICBzdWJzY3JpcHRpb24uYWRkKG5ldyBTdWJzY3JpcHRpb24oKCkgPT4ge1xuICAgICAgc3ViamVjdC5sb2dVbnN1YnNjcmliZWRGcmFtZShpbmRleCk7XG4gICAgfSkpO1xuICAgIHN1YnNjcmlwdGlvbi5hZGQoc3VwZXIuX3N1YnNjcmliZShzdWJzY3JpYmVyKSk7XG4gICAgcmV0dXJuIHN1YnNjcmlwdGlvbjtcbiAgfVxuXG4gIHNldHVwKCkge1xuICAgIGNvbnN0IHN1YmplY3QgPSB0aGlzO1xuICAgIGNvbnN0IG1lc3NhZ2VzTGVuZ3RoID0gc3ViamVjdC5tZXNzYWdlcy5sZW5ndGg7XG4gICAgLyogdHNsaW50OmRpc2FibGU6bm8tdmFyLWtleXdvcmQgKi9cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1lc3NhZ2VzTGVuZ3RoOyBpKyspIHtcbiAgICAgICgoKSA9PiB7XG4gICAgICAgIHZhciBtZXNzYWdlID0gc3ViamVjdC5tZXNzYWdlc1tpXTtcbiAgIC8qIHRzbGludDplbmFibGUgKi9cbiAgICAgICAgc3ViamVjdC5zY2hlZHVsZXIuc2NoZWR1bGUoXG4gICAgICAgICAgKCkgPT4geyBtZXNzYWdlLm5vdGlmaWNhdGlvbi5vYnNlcnZlKHN1YmplY3QpOyB9LFxuICAgICAgICAgIG1lc3NhZ2UuZnJhbWVcbiAgICAgICAgKTtcbiAgICAgIH0pKCk7XG4gICAgfVxuICB9XG59XG5hcHBseU1peGlucyhIb3RPYnNlcnZhYmxlLCBbU3Vic2NyaXB0aW9uTG9nZ2FibGVdKTtcbiJdfQ==