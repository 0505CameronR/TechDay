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
var application_settings_1 = require("tns-core-modules/application-settings");
var user_model_1 = require("../shared/user/user.model");
var user_service_1 = require("../shared/user/user.service");
var SignInComponent = /** @class */ (function () {
    function SignInComponent(router, userService) {
        this.router = router;
        this.userService = userService;
        this.isLoggingIn = true;
        this.user = new user_model_1.User();
        this.user.username = application_settings_1.getString("username");
        this.user.password = application_settings_1.getString("password");
    }
    SignInComponent.prototype.ngOnInit = function () {
    };
    SignInComponent.prototype.login = function () {
        var _this = this;
        this.userService.login(this.user)
            .then(function () {
            application_settings_1.setString("username", _this.user.username);
            application_settings_1.setString("password", _this.user.password);
            _this.router.navigate(["/home"]);
        })
            .catch(function () {
            alert("Unfortunately we could not find your account" + _this.user.username);
        });
    };
    SignInComponent.prototype.signUp = function () {
        var _this = this;
        // FIXME: Need to move to web version
        this.userService.register(this.user)
            .then(function () {
            alert("Your account was successfully created.");
            application_settings_1.setString("username", _this.user.username);
            application_settings_1.setString("password", _this.user.password);
            _this.toggleDisplay();
        })
            .catch(function () {
            alert("Unfortunately we were unable to create your account.");
        });
    };
    SignInComponent.prototype.toggleDisplay = function () {
        this.isLoggingIn = !this.isLoggingIn;
    };
    SignInComponent.prototype.submit = function (args) {
        if (this.isLoggingIn) {
            this.login();
        }
        else {
            this.signUp();
        }
    };
    SignInComponent = __decorate([
        core_1.Component({
            selector: 'ns-sign-in',
            templateUrl: './sign-in.component.html',
            providers: [user_service_1.UserService],
            styleUrls: ['./sign-in.component.css'],
            moduleId: module.id,
        }),
        __metadata("design:paramtypes", [router_1.Router,
            user_service_1.UserService])
    ], SignInComponent);
    return SignInComponent;
}());
exports.SignInComponent = SignInComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kQXBwL2FwcC9hcHAvc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBeUM7QUFHekMsOEVBQTZFO0FBQzdFLHdEQUFpRDtBQUNqRCw0REFBMEQ7QUFTMUQ7SUFJRSx5QkFDVSxNQUFjLEVBQ2QsV0FBd0I7UUFEeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBSmxDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBTWpCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBSSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0NBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxrQ0FBUSxHQUFSO0lBQ0EsQ0FBQztJQUVELCtCQUFLLEdBQUw7UUFBQSxpQkFVQztRQVRDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDOUIsSUFBSSxDQUFDO1lBQ0osZ0NBQVMsQ0FBQyxVQUFVLEVBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxnQ0FBUyxDQUFDLFVBQVUsRUFBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUM7WUFDTCxLQUFLLENBQUMsOENBQThDLEdBQUcsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtRQUM1RSxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxnQ0FBTSxHQUFOO1FBQUEsaUJBWUM7UUFYQyxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNqQyxJQUFJLENBQUM7WUFDRixLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUNoRCxnQ0FBUyxDQUFDLFVBQVUsRUFBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLGdDQUFTLENBQUMsVUFBVSxFQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQztZQUNMLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELHVDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsZ0NBQU0sR0FBTixVQUFPLElBQWU7UUFDcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDZDtJQUNILENBQUM7SUFuRFUsZUFBZTtRQVAzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1lBQ3RDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO3lDQU1rQixlQUFNO1lBQ0QsMEJBQVc7T0FOdkIsZUFBZSxDQXFEM0I7SUFBRCxzQkFBQztDQUFBLEFBckRELElBcURDO0FBckRZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFBhZ2UsIEV2ZW50RGF0YSB9IGZyb20gJ3Rucy1jb3JlLW1vZHVsZXMvdWkvcGFnZS9wYWdlJztcblxuaW1wb3J0IHsgZ2V0U3RyaW5nLCBzZXRTdHJpbmcgfSBmcm9tIFwidG5zLWNvcmUtbW9kdWxlcy9hcHBsaWNhdGlvbi1zZXR0aW5nc1wiO1xuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3NoYXJlZC91c2VyL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICducy1zaWduLWluJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpZ24taW4uY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtVc2VyU2VydmljZV0sXG4gIHN0eWxlVXJsczogWycuL3NpZ24taW4uY29tcG9uZW50LmNzcyddLFxuICBtb2R1bGVJZDogbW9kdWxlLmlkLFxufSlcbmV4cG9ydCBjbGFzcyBTaWduSW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICB1c2VyOiBVc2VyO1xuICBpc0xvZ2dpbmdJbiA9IHRydWU7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2VcbiAgKSB7XG4gICAgdGhpcy51c2VyID0gbmV3IFVzZXIoKVxuICAgIHRoaXMudXNlci51c2VybmFtZSA9IGdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xuICAgIHRoaXMudXNlci5wYXNzd29yZCA9IGdldFN0cmluZyhcInBhc3N3b3JkXCIpO1xuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxuICBsb2dpbigpIHtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLmxvZ2luKHRoaXMudXNlcilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgc2V0U3RyaW5nKFwidXNlcm5hbWVcIix0aGlzLnVzZXIudXNlcm5hbWUpO1xuICAgICAgICBzZXRTdHJpbmcoXCJwYXNzd29yZFwiLHRoaXMudXNlci5wYXNzd29yZCk7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9ob21lXCJdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgIGFsZXJ0KFwiVW5mb3J0dW5hdGVseSB3ZSBjb3VsZCBub3QgZmluZCB5b3VyIGFjY291bnRcIiArIHRoaXMudXNlci51c2VybmFtZSlcbiAgICAgIH0pO1xuICB9XG5cbiAgc2lnblVwKCkge1xuICAgIC8vIEZJWE1FOiBOZWVkIHRvIG1vdmUgdG8gd2ViIHZlcnNpb25cbiAgICB0aGlzLnVzZXJTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMudXNlcilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBhbGVydChcIllvdXIgYWNjb3VudCB3YXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQuXCIpO1xuICAgICAgICAgIHNldFN0cmluZyhcInVzZXJuYW1lXCIsdGhpcy51c2VyLnVzZXJuYW1lKTtcbiAgICAgICAgICBzZXRTdHJpbmcoXCJwYXNzd29yZFwiLHRoaXMudXNlci5wYXNzd29yZCk7XG4gICAgICAgICAgdGhpcy50b2dnbGVEaXNwbGF5KCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJVbmZvcnR1bmF0ZWx5IHdlIHdlcmUgdW5hYmxlIHRvIGNyZWF0ZSB5b3VyIGFjY291bnQuXCIpXG4gICAgICAgIH0pO1xuICB9XG5cbiAgdG9nZ2xlRGlzcGxheSgpe1xuICAgIHRoaXMuaXNMb2dnaW5nSW4gPSAhdGhpcy5pc0xvZ2dpbmdJbjtcbiAgfVxuICBzdWJtaXQoYXJnczogRXZlbnREYXRhKSB7XG4gICAgaWYgKHRoaXMuaXNMb2dnaW5nSW4pIHtcbiAgICAgIHRoaXMubG9naW4oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zaWduVXAoKVxuICAgIH1cbiAgfVxuXG59XG4iXX0=