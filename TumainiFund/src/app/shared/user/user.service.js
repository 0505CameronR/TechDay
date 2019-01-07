"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var kinvey_nativescript_sdk_1 = require("kinvey-nativescript-sdk");
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.register = function (user) {
        var _this = this;
        // return this.http.post(
        //     Config.apiUrl + "user/" + Config.appKey,
        //     JSON.stringify({
        //         username: user.username,
        //         password: user.password
        //     }),
        //     { headers: this.getCommonHeaders() }
        // ).pipe(
        //     catchError(this.handleErrors)
        // );
        return new Promise(function (resolve, reject) {
            kinvey_nativescript_sdk_1.Kinvey.User.logout()
                .then(function () {
                kinvey_nativescript_sdk_1.Kinvey.User.signup({ username: user.username, password: user.password })
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    UserService.prototype.login = function (user) {
        var _this = this;
        // return this.http.post(
        //     Config.apiUrl + "user/" + Config.appKey + "/login",
        //     JSON.stringify({
        //         username: user.username,
        //         password: user.password
        //     }),
        //     { headers: this.getCommonHeaders() }
        // ).pipe(
        //     map(response => response.json()),
        //     tap(data => {
        //         Config.token = data._kmd.authtoken
        //     }),
        //     catchError(this.handleErrors)
        // );
        return new Promise(function (resolve, reject) {
            kinvey_nativescript_sdk_1.Kinvey.User.logout()
                .then(function () {
                kinvey_nativescript_sdk_1.Kinvey.User.login(user.username, user.password)
                    .then(resolve)
                    .catch(function (error) { _this.handleErrors(error); reject(); });
            })
                .catch(function (error) { _this.handleErrors(error); reject(); });
        });
    };
    // getCommonHeaders() {
    //     let headers = new Headers();
    //     headers.append("Content-Type", "application/json");
    //     headers.append("Authorization", Config.authHeader);
    //     return headers;
    // }
    // handleErrors(error: Response) {
    //     console.log(JSON.stringify(error.json()));
    //     return Observable.throw(error);
    // }
    UserService.prototype.handleErrors = function (error) {
        console.error(error.message);
        return error.message;
    };
    UserService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsidXNlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQTJDO0FBQzNDLHNDQUF3RDtBQUl4RCxtRUFBaUQ7QUFLakQ7SUFDSSxxQkFBb0IsSUFBVTtRQUFWLFNBQUksR0FBSixJQUFJLENBQU07SUFBSSxDQUFDO0lBRW5DLDhCQUFRLEdBQVIsVUFBUyxJQUFVO1FBQW5CLGlCQW9CQztRQW5CRyx5QkFBeUI7UUFDekIsK0NBQStDO1FBQy9DLHVCQUF1QjtRQUN2QixtQ0FBbUM7UUFDbkMsa0NBQWtDO1FBQ2xDLFVBQVU7UUFDViwyQ0FBMkM7UUFDM0MsVUFBVTtRQUNWLG9DQUFvQztRQUNwQyxLQUFLO1FBQ0wsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLGdDQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtpQkFDakIsSUFBSSxDQUFDO2dCQUNKLGdDQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLFVBQUMsS0FBSyxJQUFPLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlELENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxLQUFLLElBQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQsMkJBQUssR0FBTCxVQUFNLElBQVU7UUFBaEIsaUJBd0JDO1FBdkJHLHlCQUF5QjtRQUN6QiwwREFBMEQ7UUFDMUQsdUJBQXVCO1FBQ3ZCLG1DQUFtQztRQUNuQyxrQ0FBa0M7UUFDbEMsVUFBVTtRQUNWLDJDQUEyQztRQUMzQyxVQUFVO1FBQ1Ysd0NBQXdDO1FBQ3hDLG9CQUFvQjtRQUNwQiw2Q0FBNkM7UUFDN0MsVUFBVTtRQUNWLG9DQUFvQztRQUNwQyxLQUFLO1FBQ0wsT0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQy9CLGdDQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtpQkFDakIsSUFBSSxDQUFDO2dCQUNKLGdDQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUM7cUJBQzVDLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLFVBQUMsS0FBSyxJQUFPLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlELENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsVUFBQyxLQUFLLElBQU8sS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsdUJBQXVCO0lBQ3ZCLG1DQUFtQztJQUNuQywwREFBMEQ7SUFDMUQsMERBQTBEO0lBQzFELHNCQUFzQjtJQUN0QixJQUFJO0lBRUosa0NBQWtDO0lBQ2xDLGlEQUFpRDtJQUNqRCxzQ0FBc0M7SUFDdEMsSUFBSTtJQUNKLGtDQUFZLEdBQVosVUFBYSxLQUF1QjtRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztJQWpFTSxXQUFXO1FBRHZCLGlCQUFVLEVBQUU7eUNBRWlCLFdBQUk7T0FEckIsV0FBVyxDQWtFdkI7SUFBRCxrQkFBQztDQUFBLEFBbEVELElBa0VDO0FBbEVZLGtDQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XHJcbmltcG9ydCB7IEh0dHAsIEhlYWRlcnMsIFJlc3BvbnNlIH0gZnJvbSBcIkBhbmd1bGFyL2h0dHBcIjtcclxuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gXCJyeGpzXCI7XHJcbmltcG9ydCB7IGNhdGNoRXJyb3IsIG1hcCwgdGFwIH0gZnJvbSBcInJ4anMvb3BlcmF0b3JzXCI7XHJcblxyXG5pbXBvcnQgeyBLaW52ZXkgfSBmcm9tIFwia2ludmV5LW5hdGl2ZXNjcmlwdC1zZGtcIjtcclxuXHJcbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi91c2VyLm1vZGVsXCI7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHApIHsgfVxyXG5cclxuICAgIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcclxuICAgICAgICAvLyByZXR1cm4gdGhpcy5odHRwLnBvc3QoXHJcbiAgICAgICAgLy8gICAgIENvbmZpZy5hcGlVcmwgKyBcInVzZXIvXCIgKyBDb25maWcuYXBwS2V5LFxyXG4gICAgICAgIC8vICAgICBKU09OLnN0cmluZ2lmeSh7XHJcbiAgICAgICAgLy8gICAgICAgICB1c2VybmFtZTogdXNlci51c2VybmFtZSxcclxuICAgICAgICAvLyAgICAgICAgIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkXHJcbiAgICAgICAgLy8gICAgIH0pLFxyXG4gICAgICAgIC8vICAgICB7IGhlYWRlcnM6IHRoaXMuZ2V0Q29tbW9uSGVhZGVycygpIH1cclxuICAgICAgICAvLyApLnBpcGUoXHJcbiAgICAgICAgLy8gICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBLaW52ZXkuVXNlci5sb2dvdXQoKVxyXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIEtpbnZleS5Vc2VyLnNpZ251cCh7IHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLCBwYXNzd29yZDogdXNlci5wYXNzd29yZCB9KVxyXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxyXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXHJcbiAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dpbih1c2VyOiBVc2VyKSB7XHJcbiAgICAgICAgLy8gcmV0dXJuIHRoaXMuaHR0cC5wb3N0KFxyXG4gICAgICAgIC8vICAgICBDb25maWcuYXBpVXJsICsgXCJ1c2VyL1wiICsgQ29uZmlnLmFwcEtleSArIFwiL2xvZ2luXCIsXHJcbiAgICAgICAgLy8gICAgIEpTT04uc3RyaW5naWZ5KHtcclxuICAgICAgICAvLyAgICAgICAgIHVzZXJuYW1lOiB1c2VyLnVzZXJuYW1lLFxyXG4gICAgICAgIC8vICAgICAgICAgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmRcclxuICAgICAgICAvLyAgICAgfSksXHJcbiAgICAgICAgLy8gICAgIHsgaGVhZGVyczogdGhpcy5nZXRDb21tb25IZWFkZXJzKCkgfVxyXG4gICAgICAgIC8vICkucGlwZShcclxuICAgICAgICAvLyAgICAgbWFwKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSksXHJcbiAgICAgICAgLy8gICAgIHRhcChkYXRhID0+IHtcclxuICAgICAgICAvLyAgICAgICAgIENvbmZpZy50b2tlbiA9IGRhdGEuX2ttZC5hdXRodG9rZW5cclxuICAgICAgICAvLyAgICAgfSksXHJcbiAgICAgICAgLy8gICAgIGNhdGNoRXJyb3IodGhpcy5oYW5kbGVFcnJvcnMpXHJcbiAgICAgICAgLy8gKTtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBLaW52ZXkuVXNlci5sb2dvdXQoKVxyXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIEtpbnZleS5Vc2VyLmxvZ2luKHVzZXIudXNlcm5hbWUsIHVzZXIucGFzc3dvcmQpXHJcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXHJcbiAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gZ2V0Q29tbW9uSGVhZGVycygpIHtcclxuICAgIC8vICAgICBsZXQgaGVhZGVycyA9IG5ldyBIZWFkZXJzKCk7XHJcbiAgICAvLyAgICAgaGVhZGVycy5hcHBlbmQoXCJDb250ZW50LVR5cGVcIiwgXCJhcHBsaWNhdGlvbi9qc29uXCIpO1xyXG4gICAgLy8gICAgIGhlYWRlcnMuYXBwZW5kKFwiQXV0aG9yaXphdGlvblwiLCBDb25maWcuYXV0aEhlYWRlcik7XHJcbiAgICAvLyAgICAgcmV0dXJuIGhlYWRlcnM7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gaGFuZGxlRXJyb3JzKGVycm9yOiBSZXNwb25zZSkge1xyXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KGVycm9yLmpzb24oKSkpO1xyXG4gICAgLy8gICAgIHJldHVybiBPYnNlcnZhYmxlLnRocm93KGVycm9yKTtcclxuICAgIC8vIH1cclxuICAgIGhhbmRsZUVycm9ycyhlcnJvcjogS2ludmV5LkJhc2VFcnJvcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IubWVzc2FnZSk7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2U7XHJcbiAgICAgIH1cclxufSJdfQ==