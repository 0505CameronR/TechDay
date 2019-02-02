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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBd0U7QUFDeEUsMENBQXlDO0FBRXpDLHdEQUFpRDtBQUNqRCw0REFBMEQ7QUFTMUQ7SUFHRSx5QkFDUyxJQUFVLEVBQ1QsTUFBYyxFQUNkLFdBQXdCLEVBQ3hCLFVBQXNCO1FBSHZCLFNBQUksR0FBSixJQUFJLENBQU07UUFDVCxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsZ0JBQVcsR0FBWCxXQUFXLENBQWE7UUFDeEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQU5oQyxnQkFBVyxHQUFHLElBQUksQ0FBQztRQVFqQixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksaUJBQUksRUFBRSxDQUFBO0lBQ3hCLENBQUM7SUFDRCxrQ0FBUSxHQUFSO1FBQ0UsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUNyRixDQUFDO0lBQ0QsK0JBQUssR0FBTDtRQUFBLGlCQVFDO1FBUEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUM5QixJQUFJLENBQUM7WUFDSixLQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDakMsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDO1lBQ0gsS0FBSyxDQUFDLGtEQUFnRCxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVUsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELGdDQUFNLEdBQU47UUFBQSxpQkFTQztRQVJDLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDakMsSUFBSSxDQUFDO1lBQ0YsS0FBSyxDQUFDLHdDQUF3QyxDQUFDLENBQUM7WUFDbEQsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQztZQUNILEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELHVDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsZ0NBQU0sR0FBTjtRQUNFLElBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUN6QyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwQzthQUFLLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUMvQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwQzthQUFLLElBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pELEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQzFEO2FBQUk7WUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTthQUNkO1NBQ0Y7SUFDSCxDQUFDO0lBbERVLGVBQWU7UUFQM0IsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxhQUFhO1lBQ3ZCLFdBQVcsRUFBRSwwQkFBMEI7WUFDdkMsU0FBUyxFQUFFLENBQUMsMEJBQVcsRUFBRSxpQkFBSSxDQUFDO1lBQzlCLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1NBQ3ZDLENBQUM7eUNBTWUsaUJBQUk7WUFDRCxlQUFNO1lBQ0QsMEJBQVc7WUFDWixpQkFBVTtPQVByQixlQUFlLENBbUQzQjtJQUFELHNCQUFDO0NBQUEsQUFuREQsSUFtREM7QUFuRFksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgRWxlbWVudFJlZiwgVmlld0NoaWxkfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLm1vZGVsJztcbmltcG9ydCB7IFVzZXJTZXJ2aWNlIH0gZnJvbSAnLi4vc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXNpZ24taW4nLFxuICB0ZW1wbGF0ZVVybDogJy4vc2lnbi1pbi5jb21wb25lbnQuaHRtbCcsXG4gIHByb3ZpZGVyczogW1VzZXJTZXJ2aWNlLCBVc2VyXSxcbiAgc3R5bGVVcmxzOiBbJy4vc2lnbi1pbi5jb21wb25lbnQuY3NzJ10sXG59KVxuXG5leHBvcnQgY2xhc3MgU2lnbkluQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgaXNMb2dnaW5nSW4gPSB0cnVlO1xuXG4gIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgdXNlcjogVXNlcixcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxuICAgIHByaXZhdGUgdXNlclNlcnZpY2U6IFVzZXJTZXJ2aWNlLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgKSB7XG4gICAgdGhpcy51c2VyID0gbmV3IFVzZXIoKVxuICB9XG4gIG5nT25Jbml0KCkge1xuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50Lm93bmVyRG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcIiM4MkNDMzNcIjtcbiAgfVxuICBsb2dpbigpIHtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmxvZ2luKHRoaXMudXNlcilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoW1wiL2hvbWVcIl0pXG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICBhbGVydChgVW5mb3J0dW5hdGVseSB3ZSBjb3VsZCBub3QgZmluZCB5b3VyIGFjY291bnQgJHt0aGlzLnVzZXIudXNlcm5hbWV9YCk7XG4gICAgICB9KTtcbiAgfVxuICBzaWduVXAoKSB7XG4gICAgdGhpcy51c2VyU2VydmljZS5yZWdpc3Rlcih0aGlzLnVzZXIpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJZb3VyIGFjY291bnQgd2FzIHN1Y2Nlc3NmdWxseSBjcmVhdGVkLlwiKTtcbiAgICAgICAgdGhpcy50b2dnbGVEaXNwbGF5KCk7XG4gICAgICB9KVxuICAgICAgLmNhdGNoKCgpID0+IHtcbiAgICAgICAgICBhbGVydChcIlVuZm9ydHVuYXRlbHkgd2Ugd2VyZSB1bmFibGUgdG8gY3JlYXRlIHlvdXIgYWNjb3VudFwiKTtcbiAgICAgIH0pO1xuICB9XG4gIHRvZ2dsZURpc3BsYXkoKSB7XG4gICAgdGhpcy5pc0xvZ2dpbmdJbiA9ICF0aGlzLmlzTG9nZ2luZ0luO1xuICB9XG4gIHN1Ym1pdCgpIHtcbiAgICBpZighdGhpcy51c2VyLnVzZXJuYW1lICYmIHRoaXMudXNlci5wYXNzd29yZCl7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIFByb3ZpZGUgVXNlcm5hbWVcIik7XG4gICAgfWVsc2UgaWYodGhpcy51c2VyLnVzZXJuYW1lICYmICF0aGlzLnVzZXIucGFzc3dvcmQpe1xuICAgICAgICBhbGVydChcIlBsZWFzZSBQcm92aWRlIFBhc3N3b3JkXCIpO1xuICAgIH1lbHNlIGlmKCF0aGlzLnVzZXIudXNlcm5hbWUgJiYgIXRoaXMudXNlci5wYXNzd29yZCkge1xuICAgICAgICBhbGVydChcIlBsZWFzZSBQcm92aWRlIEJvdGggYSBVc2VybmFtZSBhbmQgYSBQYXNzd29yZFwiKTtcbiAgICB9ZWxzZXtcbiAgICAgIGlmICh0aGlzLmlzTG9nZ2luZ0luKSB7XG4gICAgICAgIHRoaXMubG9naW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuc2lnblVwKClcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0iXX0=