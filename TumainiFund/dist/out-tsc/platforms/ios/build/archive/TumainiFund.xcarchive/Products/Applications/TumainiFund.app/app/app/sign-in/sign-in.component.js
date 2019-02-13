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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL2FwcC9zaWduLWluL3NpZ24taW4uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQXdFO0FBQ3hFLDBDQUF5QztBQUV6Qyx3REFBaUQ7QUFDakQsNERBQTBEO0FBUzFEO0lBR0UseUJBQ1MsSUFBVSxFQUNULE1BQWMsRUFDZCxXQUF3QixFQUN4QixVQUFzQjtRQUh2QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFOaEMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFRakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGlCQUFJLEVBQUUsQ0FBQTtJQUN4QixDQUFDO0lBQ0Qsa0NBQVEsR0FBUjtRQUNFLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7SUFDckYsQ0FBQztJQUNELCtCQUFLLEdBQUw7UUFBQSxpQkFRQztRQVBDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDOUIsSUFBSSxDQUFDO1lBQ0osS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBQ2pDLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQztZQUNILEtBQUssQ0FBQyxrREFBZ0QsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFVLENBQUMsQ0FBQztRQUNoRixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxnQ0FBTSxHQUFOO1FBQUEsaUJBU0M7UUFSQyxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ2pDLElBQUksQ0FBQztZQUNGLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ2xELEtBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUM7WUFDSCxLQUFLLENBQUMscURBQXFELENBQUMsQ0FBQztRQUNqRSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCx1Q0FBYSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFdBQVcsR0FBRyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7SUFDdkMsQ0FBQztJQUNELGdDQUFNLEdBQU47UUFDRSxJQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7WUFDekMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDcEM7YUFBSyxJQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUM7WUFDL0MsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7U0FDcEM7YUFBSyxJQUFHLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqRCxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQztTQUMxRDthQUFJO1lBQ0gsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNwQixJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7YUFDZDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7YUFDZDtTQUNGO0lBQ0gsQ0FBQztJQWxEVSxlQUFlO1FBUDNCLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUsYUFBYTtZQUN2QixXQUFXLEVBQUUsMEJBQTBCO1lBQ3ZDLFNBQVMsRUFBRSxDQUFDLDBCQUFXLEVBQUUsaUJBQUksQ0FBQztZQUM5QixTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztTQUN2QyxDQUFDO3lDQU1lLGlCQUFJO1lBQ0QsZUFBTTtZQUNELDBCQUFXO1lBQ1osaUJBQVU7T0FQckIsZUFBZSxDQW1EM0I7SUFBRCxzQkFBQztDQUFBLEFBbkRELElBbURDO0FBbkRZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vc2hhcmVkL3VzZXIvdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uL3NoYXJlZC91c2VyL3VzZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zaWduLWluJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpZ24taW4uY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtVc2VyU2VydmljZSwgVXNlcl0sXG4gIHN0eWxlVXJsczogWycuL3NpZ24taW4uY29tcG9uZW50LmNzcyddLFxufSlcblxuZXhwb3J0IGNsYXNzIFNpZ25JbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGlzTG9nZ2luZ0luID0gdHJ1ZTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVzZXI6IFVzZXIsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICkge1xuICAgIHRoaXMudXNlciA9IG5ldyBVc2VyKClcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODJDQzMzXCI7XG4gIH1cbiAgbG9naW4oKSB7XG4gICAgdGhpcy51c2VyU2VydmljZS5sb2dpbih0aGlzLnVzZXIpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9ob21lXCJdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoYFVuZm9ydHVuYXRlbHkgd2UgY291bGQgbm90IGZpbmQgeW91ciBhY2NvdW50ICR7dGhpcy51c2VyLnVzZXJuYW1lfWApO1xuICAgICAgfSk7XG4gIH1cbiAgc2lnblVwKCkge1xuICAgIHRoaXMudXNlclNlcnZpY2UucmVnaXN0ZXIodGhpcy51c2VyKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KFwiWW91ciBhY2NvdW50IHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZC5cIik7XG4gICAgICAgIHRoaXMudG9nZ2xlRGlzcGxheSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJVbmZvcnR1bmF0ZWx5IHdlIHdlcmUgdW5hYmxlIHRvIGNyZWF0ZSB5b3VyIGFjY291bnRcIik7XG4gICAgICB9KTtcbiAgfVxuICB0b2dnbGVEaXNwbGF5KCkge1xuICAgIHRoaXMuaXNMb2dnaW5nSW4gPSAhdGhpcy5pc0xvZ2dpbmdJbjtcbiAgfVxuICBzdWJtaXQoKSB7XG4gICAgaWYoIXRoaXMudXNlci51c2VybmFtZSAmJiB0aGlzLnVzZXIucGFzc3dvcmQpe1xuICAgICAgICBhbGVydChcIlBsZWFzZSBQcm92aWRlIFVzZXJuYW1lXCIpO1xuICAgIH1lbHNlIGlmKHRoaXMudXNlci51c2VybmFtZSAmJiAhdGhpcy51c2VyLnBhc3N3b3JkKXtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBQYXNzd29yZFwiKTtcbiAgICB9ZWxzZSBpZighdGhpcy51c2VyLnVzZXJuYW1lICYmICF0aGlzLnVzZXIucGFzc3dvcmQpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBCb3RoIGEgVXNlcm5hbWUgYW5kIGEgUGFzc3dvcmRcIik7XG4gICAgfWVsc2V7XG4gICAgICBpZiAodGhpcy5pc0xvZ2dpbmdJbikge1xuICAgICAgICB0aGlzLmxvZ2luKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpZ25VcCgpXG4gICAgICB9XG4gICAgfVxuICB9XG59Il19