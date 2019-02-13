var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-angular2-sdk";
let UserService = class UserService {
    constructor() { }
    register(user) {
        return new Promise((resolve, reject) => {
            Kinvey.User.logout()
                .then(() => {
                Kinvey.User.signup({ username: user.username, password: user.password })
                    .then(resolve)
                    .catch((error) => { this.handleErrors(error); reject(); });
            })
                .catch((error) => { this.handleErrors(error); reject(); });
        });
    }
    login(user) {
        return new Promise((resolve, reject) => {
            Kinvey.User.logout()
                .then(() => {
                Kinvey.User.login(user.username, user.password)
                    .then(resolve)
                    .catch((error) => { this.handleErrors(error); reject(); });
            })
                .catch((error) => { this.handleErrors(error); reject(); });
        });
    }
    handleErrors(error) {
        console.error(error.message);
        return error.message;
    }
};
UserService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], UserService);
export { UserService };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvYXBwL3NoYXJlZC91c2VyL3VzZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUs3QyxJQUFhLFdBQVcsR0FBeEIsTUFBYSxXQUFXO0lBQ3BCLGdCQUFnQixDQUFDO0lBRWpCLFFBQVEsQ0FBQyxJQUFVO1FBQ2YsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtZQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtpQkFDakIsSUFBSSxDQUFDLEdBQUcsRUFBRTtnQkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7cUJBQ3JFLElBQUksQ0FBQyxPQUFPLENBQUM7cUJBQ2IsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtZQUM5RCxDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFFLEVBQUUsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM5RCxDQUFDLENBQUMsQ0FBQztJQUNULENBQUM7SUFFRCxLQUFLLENBQUMsSUFBVTtRQUNaLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7aUJBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO3FCQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUNiLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUQsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDNUQsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsWUFBWSxDQUFDLEtBQXVCO1FBQ2hDLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdCLE9BQU8sS0FBSyxDQUFDLE9BQU8sQ0FBQztJQUN2QixDQUFDO0NBQ04sQ0FBQTtBQS9CWSxXQUFXO0lBRHZCLFVBQVUsRUFBRTs7R0FDQSxXQUFXLENBK0J2QjtTQS9CWSxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5cbmltcG9ydCB7IEtpbnZleSB9IGZyb20gXCJraW52ZXktYW5ndWxhcjItc2RrXCI7XG5cbmltcG9ydCB7IFVzZXIgfSBmcm9tIFwiLi91c2VyLm1vZGVsXCI7XG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBVc2VyU2VydmljZSB7XG4gICAgY29uc3RydWN0b3IoKSB7IH1cblxuICAgIHJlZ2lzdGVyKHVzZXI6IFVzZXIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIEtpbnZleS5Vc2VyLmxvZ291dCgpXG4gICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBLaW52ZXkuVXNlci5zaWdudXAoeyB1c2VybmFtZTogdXNlci51c2VybmFtZSwgcGFzc3dvcmQ6IHVzZXIucGFzc3dvcmQgfSlcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcbiAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBsb2dpbih1c2VyOiBVc2VyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBLaW52ZXkuVXNlci5sb2dvdXQoKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgS2ludmV5LlVzZXIubG9naW4odXNlci51c2VybmFtZSwgdXNlci5wYXNzd29yZClcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlc29sdmUpXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHsgdGhpcy5oYW5kbGVFcnJvcnMoZXJyb3IpOyByZWplY3QoKTsgfSlcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGhhbmRsZUVycm9ycyhlcnJvcjogS2ludmV5LkJhc2VFcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yLm1lc3NhZ2UpO1xuICAgICAgICByZXR1cm4gZXJyb3IubWVzc2FnZTtcbiAgICAgIH1cbn0iXX0=