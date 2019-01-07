import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";
import { Observable } from "rxjs";
import { catchError, map, tap } from "rxjs/operators";

import { Kinvey } from "kinvey-nativescript-sdk";

import { User } from "./user.model";

@Injectable()
export class UserService {
    constructor(private http: Http) { }

    register(user: User) {
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
    handleErrors(error: Kinvey.BaseError) {
        console.error(error.message);
        return error.message;
      }
}