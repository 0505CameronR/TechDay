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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXNlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUUzQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFLN0MsSUFBYSxXQUFXLEdBQXhCLE1BQWEsV0FBVztJQUNwQixnQkFBZ0IsQ0FBQztJQUVqQixRQUFRLENBQUMsSUFBVTtRQUNmLE9BQU8sSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUU7aUJBQ2pCLElBQUksQ0FBQyxHQUFHLEVBQUU7Z0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO3FCQUNyRSxJQUFJLENBQUMsT0FBTyxDQUFDO3FCQUNiLEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7WUFDOUQsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUQsQ0FBQyxDQUFDLENBQUM7SUFDVCxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQVU7UUFDWixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFO2lCQUNqQixJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQztxQkFDNUMsSUFBSSxDQUFDLE9BQU8sQ0FBQztxQkFDYixLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1lBQzlELENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQzVELENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELFlBQVksQ0FBQyxLQUF1QjtRQUNoQyxPQUFPLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUM3QixPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUM7SUFDdkIsQ0FBQztDQUNOLENBQUE7QUEvQlksV0FBVztJQUR2QixVQUFVLEVBQUU7O0dBQ0EsV0FBVyxDQStCdkI7U0EvQlksV0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5pbXBvcnQgeyBLaW52ZXkgfSBmcm9tIFwia2ludmV5LWFuZ3VsYXIyLXNka1wiO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSBcIi4vdXNlci5tb2RlbFwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVXNlclNlcnZpY2Uge1xuICAgIGNvbnN0cnVjdG9yKCkgeyB9XG5cbiAgICByZWdpc3Rlcih1c2VyOiBVc2VyKSB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBLaW52ZXkuVXNlci5sb2dvdXQoKVxuICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgS2ludmV5LlVzZXIuc2lnbnVwKHsgdXNlcm5hbWU6IHVzZXIudXNlcm5hbWUsIHBhc3N3b3JkOiB1c2VyLnBhc3N3b3JkIH0pXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4geyB0aGlzLmhhbmRsZUVycm9ycyhlcnJvcik7IHJlamVjdCgpOyB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9naW4odXNlcjogVXNlcikge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgS2ludmV5LlVzZXIubG9nb3V0KClcbiAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIEtpbnZleS5Vc2VyLmxvZ2luKHVzZXIudXNlcm5hbWUsIHVzZXIucGFzc3dvcmQpXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXNvbHZlKVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKChlcnJvcikgPT4geyB0aGlzLmhhbmRsZUVycm9ycyhlcnJvcik7IHJlamVjdCgpOyB9KVxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7IHRoaXMuaGFuZGxlRXJyb3JzKGVycm9yKTsgcmVqZWN0KCk7IH0pXG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBoYW5kbGVFcnJvcnMoZXJyb3I6IEtpbnZleS5CYXNlRXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnJvci5tZXNzYWdlKTtcbiAgICAgICAgcmV0dXJuIGVycm9yLm1lc3NhZ2U7XG4gICAgICB9XG59Il19