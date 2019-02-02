"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var user_model_1 = require("../shared/user/user.model");
var user_service_1 = require("../shared/user/user.service");
var SignInComponent = /** @class */ (function () {
    function SignInComponent(user, router, userService, elementRef) {
        this.user = user;
        this.router = router;
        this.userService = userService;
        this.elementRef = elementRef;
        this.isLoggingIn = true;
        this.user = new user_model_1.User();
    }
    SignInComponent.prototype.ngOnInit = function () {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#82CC33";
    };
    SignInComponent.prototype.login = function () {
        var _this = this;
        this.userService.login(this.user)
            .then(function () {
            _this.router.navigate(["/home"]);
        })
            .catch(function () {
            alert("Unfortunately we could not find your account " + _this.user.username);
        });
    };
    SignInComponent.prototype.signUp = function () {
        var _this = this;
        this.userService.register(this.user)
            .then(function () {
            alert("Your account was successfully created.");
            _this.toggleDisplay();
        })
            .catch(function () {
            alert("Unfortunately we were unable to create your account");
        });
    };
    SignInComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
    };
    SignInComponent.prototype.submit = function () {
        if (!this.user.username && this.user.password) {
            alert("Please Provide Username");
        }
        else if (this.user.username && !this.user.password) {
            alert("Please Provide Password");
        }
        else if (!this.user.username && !this.user.password) {
            alert("Please Provide Both a Username and a Password");
        }
        else {
            if (this.isLoggingIn) {
                this.login();
            }
            else {
                this.signUp();
            }
        }
    };
    SignInComponent = __decorate([
        core_1.Component({
            selector: 'app-sign-in',
            templateUrl: './sign-in.component.html',
            providers: [user_service_1.UserService, user_model_1.User],
            styleUrls: ['./sign-in.component.css'],
        }),
        __metadata("design:paramtypes", [user_model_1.User,
            router_1.Router,
            user_service_1.UserService,
            core_1.ElementRef])
    ], SignInComponent);
    return SignInComponent;
}());
exports.SignInComponent = SignInComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC9hcHAvc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUF3RTtBQUN4RSwwQ0FBeUM7QUFFekMsd0RBQWlEO0FBQ2pELDREQUEwRDtBQVMxRDtJQUdFLHlCQUNTLElBQVUsRUFDVCxNQUFjLEVBQ2QsV0FBd0IsRUFDeEIsVUFBc0I7UUFIdkIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNULFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBTmhDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBUWpCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBSSxFQUFFLENBQUE7SUFDeEIsQ0FBQztJQUNELGtDQUFRLEdBQVI7UUFDRSxJQUFJLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO0lBQ3JGLENBQUM7SUFDRCwrQkFBSyxHQUFMO1FBQUEsaUJBUUM7UUFQQyxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlCLElBQUksQ0FBQztZQUNKLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUM7WUFDSCxLQUFLLENBQUMsa0RBQWdELEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBVSxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsZ0NBQU0sR0FBTjtRQUFBLGlCQVNDO1FBUkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNqQyxJQUFJLENBQUM7WUFDRixLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUNsRCxLQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDO1lBQ0gsS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsdUNBQWEsR0FBYjtRQUNFLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxnQ0FBTSxHQUFOO1FBQ0UsSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQ3pDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BDO2FBQUssSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQy9DLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BDO2FBQUssSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakQsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDMUQ7YUFBSTtZQUNILElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO2FBQ2Q7U0FDRjtJQUNILENBQUM7SUFsRFUsZUFBZTtRQVAzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLGFBQWE7WUFDdkIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQywwQkFBVyxFQUFFLGlCQUFJLENBQUM7WUFDOUIsU0FBUyxFQUFFLENBQUMseUJBQXlCLENBQUM7U0FDdkMsQ0FBQzt5Q0FNZSxpQkFBSTtZQUNELGVBQU07WUFDRCwwQkFBVztZQUNaLGlCQUFVO09BUHJCLGVBQWUsQ0FtRDNCO0lBQUQsc0JBQUM7Q0FBQSxBQW5ERCxJQW1EQztBQW5EWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3NoYXJlZC91c2VyL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2lnbi1pbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zaWduLWluLmNvbXBvbmVudC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2UsIFVzZXJdLFxuICBzdHlsZVVybHM6IFsnLi9zaWduLWluLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBTaWduSW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBpc0xvZ2dpbmdJbiA9IHRydWU7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB1c2VyOiBVc2VyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICApIHtcbiAgICB0aGlzLnVzZXIgPSBuZXcgVXNlcigpXG4gIH1cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzgyQ0MzM1wiO1xuICB9XG4gIGxvZ2luKCkge1xuICAgIHRoaXMudXNlclNlcnZpY2UubG9naW4odGhpcy51c2VyKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvaG9tZVwiXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KGBVbmZvcnR1bmF0ZWx5IHdlIGNvdWxkIG5vdCBmaW5kIHlvdXIgYWNjb3VudCAke3RoaXMudXNlci51c2VybmFtZX1gKTtcbiAgICAgIH0pO1xuICB9XG4gIHNpZ25VcCgpIHtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMudXNlcilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBhbGVydChcIllvdXIgYWNjb3VudCB3YXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnRvZ2dsZURpc3BsYXkoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KFwiVW5mb3J0dW5hdGVseSB3ZSB3ZXJlIHVuYWJsZSB0byBjcmVhdGUgeW91ciBhY2NvdW50XCIpO1xuICAgICAgfSk7XG4gIH1cbiAgdG9nZ2xlRGlzcGxheSgpIHtcbiAgICB0aGlzLmlzTG9nZ2luZ0luID0gIXRoaXMuaXNMb2dnaW5nSW47XG4gIH1cbiAgc3VibWl0KCkge1xuICAgIGlmKCF0aGlzLnVzZXIudXNlcm5hbWUgJiYgdGhpcy51c2VyLnBhc3N3b3JkKXtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBVc2VybmFtZVwiKTtcbiAgICB9ZWxzZSBpZih0aGlzLnVzZXIudXNlcm5hbWUgJiYgIXRoaXMudXNlci5wYXNzd29yZCl7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIFByb3ZpZGUgUGFzc3dvcmRcIik7XG4gICAgfWVsc2UgaWYoIXRoaXMudXNlci51c2VybmFtZSAmJiAhdGhpcy51c2VyLnBhc3N3b3JkKSB7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIFByb3ZpZGUgQm90aCBhIFVzZXJuYW1lIGFuZCBhIFBhc3N3b3JkXCIpO1xuICAgIH1lbHNle1xuICAgICAgaWYgKHRoaXMuaXNMb2dnaW5nSW4pIHtcbiAgICAgICAgdGhpcy5sb2dpbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaWduVXAoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==