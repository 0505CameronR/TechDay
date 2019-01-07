"use strict";
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
            alert("Unfortunately we could not find your account.");
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzaWduLWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCwwQ0FBeUM7QUFHekMsOEVBQTZFO0FBQzdFLHdEQUFpRDtBQUNqRCw0REFBMEQ7QUFTMUQ7SUFJRSx5QkFDVSxNQUFjLEVBQ2QsV0FBd0I7UUFEeEIsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBSmxDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBTWpCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxpQkFBSSxFQUFFLENBQUE7UUFDdEIsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsZ0NBQVMsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxnQ0FBUyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxrQ0FBUSxHQUFSO0lBQ0EsQ0FBQztJQUVELCtCQUFLLEdBQUw7UUFBQSxpQkFVQztRQVRDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDOUIsSUFBSSxDQUFDO1lBQ0osZ0NBQVMsQ0FBQyxVQUFVLEVBQUMsS0FBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUN6QyxnQ0FBUyxDQUFDLFVBQVUsRUFBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLEtBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUM7WUFDTCxLQUFLLENBQUMsK0NBQStDLENBQUMsQ0FBQTtRQUN4RCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFFRCxnQ0FBTSxHQUFOO1FBQUEsaUJBWUM7UUFYQyxxQ0FBcUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQzthQUNqQyxJQUFJLENBQUM7WUFDRixLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUNoRCxnQ0FBUyxDQUFDLFVBQVUsRUFBQyxLQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLGdDQUFTLENBQUMsVUFBVSxFQUFDLEtBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDekMsS0FBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQ3ZCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQztZQUNMLEtBQUssQ0FBQyxzREFBc0QsQ0FBQyxDQUFBO1FBQy9ELENBQUMsQ0FBQyxDQUFDO0lBQ1QsQ0FBQztJQUVELHVDQUFhLEdBQWI7UUFDRSxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsZ0NBQU0sR0FBTixVQUFPLElBQWU7UUFDcEIsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUNkO2FBQU07WUFDTCxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUE7U0FDZDtJQUNILENBQUM7SUFuRFUsZUFBZTtRQVAzQixnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLFlBQVk7WUFDdEIsV0FBVyxFQUFFLDBCQUEwQjtZQUN2QyxTQUFTLEVBQUUsQ0FBQywwQkFBVyxDQUFDO1lBQ3hCLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO1lBQ3RDLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtTQUNwQixDQUFDO3lDQU1rQixlQUFNO1lBQ0QsMEJBQVc7T0FOdkIsZUFBZSxDQXFEM0I7SUFBRCxzQkFBQztDQUFBLEFBckRELElBcURDO0FBckRZLDBDQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIFZpZXdDaGlsZCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xyXG5pbXBvcnQgeyBQYWdlLCBFdmVudERhdGEgfSBmcm9tICd0bnMtY29yZS1tb2R1bGVzL3VpL3BhZ2UvcGFnZSc7XHJcblxyXG5pbXBvcnQgeyBnZXRTdHJpbmcsIHNldFN0cmluZyB9IGZyb20gXCJ0bnMtY29yZS1tb2R1bGVzL2FwcGxpY2F0aW9uLXNldHRpbmdzXCI7XHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLm1vZGVsJztcclxuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICducy1zaWduLWluJyxcclxuICB0ZW1wbGF0ZVVybDogJy4vc2lnbi1pbi5jb21wb25lbnQuaHRtbCcsXHJcbiAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2VdLFxyXG4gIHN0eWxlVXJsczogWycuL3NpZ24taW4uY29tcG9uZW50LmNzcyddLFxyXG4gIG1vZHVsZUlkOiBtb2R1bGUuaWQsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBTaWduSW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIHVzZXI6IFVzZXI7XHJcbiAgaXNMb2dnaW5nSW4gPSB0cnVlO1xyXG5cclxuICBwdWJsaWMgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIHJvdXRlcjogUm91dGVyLFxyXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2VcclxuICApIHtcclxuICAgIHRoaXMudXNlciA9IG5ldyBVc2VyKClcclxuICAgIHRoaXMudXNlci51c2VybmFtZSA9IGdldFN0cmluZyhcInVzZXJuYW1lXCIpO1xyXG4gICAgdGhpcy51c2VyLnBhc3N3b3JkID0gZ2V0U3RyaW5nKFwicGFzc3dvcmRcIik7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICB9XHJcblxyXG4gIGxvZ2luKCkge1xyXG4gICAgdGhpcy51c2VyU2VydmljZS5sb2dpbih0aGlzLnVzZXIpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBzZXRTdHJpbmcoXCJ1c2VybmFtZVwiLHRoaXMudXNlci51c2VybmFtZSk7XHJcbiAgICAgICAgc2V0U3RyaW5nKFwicGFzc3dvcmRcIix0aGlzLnVzZXIucGFzc3dvcmQpO1xyXG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9ob21lXCJdKVxyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKCkgPT4ge1xyXG4gICAgICAgIGFsZXJ0KFwiVW5mb3J0dW5hdGVseSB3ZSBjb3VsZCBub3QgZmluZCB5b3VyIGFjY291bnQuXCIpXHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc2lnblVwKCkge1xyXG4gICAgLy8gRklYTUU6IE5lZWQgdG8gbW92ZSB0byB3ZWIgdmVyc2lvblxyXG4gICAgdGhpcy51c2VyU2VydmljZS5yZWdpc3Rlcih0aGlzLnVzZXIpXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgIGFsZXJ0KFwiWW91ciBhY2NvdW50IHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZC5cIik7XHJcbiAgICAgICAgICBzZXRTdHJpbmcoXCJ1c2VybmFtZVwiLHRoaXMudXNlci51c2VybmFtZSk7XHJcbiAgICAgICAgICBzZXRTdHJpbmcoXCJwYXNzd29yZFwiLHRoaXMudXNlci5wYXNzd29yZCk7XHJcbiAgICAgICAgICB0aGlzLnRvZ2dsZURpc3BsYXkoKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaCgoKSA9PiB7XHJcbiAgICAgICAgICBhbGVydChcIlVuZm9ydHVuYXRlbHkgd2Ugd2VyZSB1bmFibGUgdG8gY3JlYXRlIHlvdXIgYWNjb3VudC5cIilcclxuICAgICAgICB9KTtcclxuICB9XHJcblxyXG4gIHRvZ2dsZURpc3BsYXkoKXtcclxuICAgIHRoaXMuaXNMb2dnaW5nSW4gPSAhdGhpcy5pc0xvZ2dpbmdJbjtcclxuICB9XHJcbiAgc3VibWl0KGFyZ3M6IEV2ZW50RGF0YSkge1xyXG4gICAgaWYgKHRoaXMuaXNMb2dnaW5nSW4pIHtcclxuICAgICAgdGhpcy5sb2dpbigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaWduVXAoKVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbn1cclxuIl19