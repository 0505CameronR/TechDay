import { Injectable } from "@angular/core";
import { Kinvey } from "kinvey-nativescript-sdk";
import { User } from "./user.model";


@Injectable()
export class UserService {
	constructor(){}
	
	public login(user: User) {
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

	private handleErrors(error: Kinvey.BaseError) {
		console.error(error.message);
		return error.message;
	}
}