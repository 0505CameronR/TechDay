import { Injectable } from "@angular/core";

import { Kinvey } from "kinvey-angular2-sdk";

import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor() { }

    register(user: User) {
        return new Promise((resolve, reject) => {
            Kinvey.User.logout()
              .then(() => {
                Kinvey.User.signup({ username: user.username, password: user.password })
                  .then(resolve)
                  .catch((error) => { this.handleErrors(error); reject(); })
              })
              .catch((error) => { this.handleErrors(error); reject(); })
          });
    }

    login(user: User) {
        return new Promise((resolve, reject) => {
            Kinvey.User.logout()
              .then(() => {
                Kinvey.User.login(user.username, user.password)
                  .then(resolve)
                  .catch((error) => { this.handleErrors(error); reject(); })
              })
              .catch((error) => { this.handleErrors(error); reject(); })
            });
    }

    handleErrors(error: Kinvey.BaseError) {
        console.error(error.message);
        return error.message;
      }
}