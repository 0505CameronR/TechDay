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
var kinvey_angular2_sdk_1 = require("kinvey-angular2-sdk");
var UserService = /** @class */ (function () {
    function UserService() {
    }
    UserService.prototype.register = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            kinvey_angular2_sdk_1.Kinvey.User.logout()
                .then(function () {
                kinvey_angular2_sdk_1.Kinvey.User.signup({ username: user.username, password: user.password })
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    UserService.prototype.login = function (user) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            kinvey_angular2_sdk_1.Kinvey.User.logout()
                .then(function () {
                kinvey_angular2_sdk_1.Kinvey.User.login(user.username, user.password)
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    UserService.prototype.handleErrors = function (error) {
        console.error(error.message);
        return error.message;
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9idWlsZC9hcmNoaXZlL1R1bWFpbmlGdW5kLnhjYXJjaGl2ZS9Qcm9kdWN0cy9BcHBsaWNhdGlvbnMvVHVtYWluaUZ1bmQuYXBwL2FwcC9hcHAvc2hhcmVkL3VzZXIvdXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQTJDO0FBRTNDLDJEQUE2QztBQUs3QztJQUNJO0lBQWdCLENBQUM7SUFFakIsOEJBQVEsR0FBUixVQUFTLElBQVU7UUFBbkIsaUJBVUM7UUFURyxPQUFPLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDL0IsNEJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2lCQUNqQixJQUFJLENBQUM7Z0JBQ0osNEJBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztxQkFDckUsSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFDYixLQUFLLENBQUMsVUFBQyxLQUFLLElBQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUQsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxVQUFDLEtBQUssSUFBTyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCwyQkFBSyxHQUFMLFVBQU0sSUFBVTtRQUFoQixpQkFVQztRQVRHLE9BQU8sSUFBSSxPQUFPLENBQUMsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUMvQiw0QkFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7aUJBQ2pCLElBQUksQ0FBQztnQkFDSiw0QkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO3FCQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUNiLEtBQUssQ0FBQyxVQUFDLEtBQUssSUFBTyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM5RCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLFVBQUMsS0FBSyxJQUFPLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELGtDQUFZLEdBQVosVUFBYSxLQUF1QjtRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztJQTlCTSxXQUFXO1FBRHZCLGlCQUFVLEVBQUU7O09BQ0EsV0FBVyxDQStCdkI7SUFBRCxrQkFBQztDQUFBLEFBL0JELElBK0JDO0FBL0JZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IEtpbnZleSB9IGZyb20gXCJraW52ZXktYW5ndWxhcjItc2RrXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi91c2VyLm1vZGVsXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIEtpbnZleS5Vc2VyLmxvZ291dCgpXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBLaW52ZXkuVXNlci5zaWdudXAoeyB1c2VybmFtZTogdXNlci51c2VybmFtZSwgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQgfSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcbiAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBLaW52ZXkuVXNlci5sb2dvdXQoKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgS2ludmV5LlVzZXIubG9naW4odXNlci51c2VybmFtZSwgdXNlci5wYXNzd29yZClcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUVycm9ycyhlcnJvcjogS2ludmV5LkJhc2VFcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gZXJyb3IubWVzc2FnZTtcbiAgICAgIH1cbn0iXX0=