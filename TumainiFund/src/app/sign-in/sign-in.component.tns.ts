import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page/page';
import { Page } from 'tns-core-modules/ui/page';

import { Text } from '../shared/text';
import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

import { Feedback } from "nativescript-feedback";
import { Kinvey } from 'kinvey-nativescript-sdk';

import { FingerprintAuth, BiometricIDAvailableResult } from "nativescript-fingerprint-auth";

@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	providers: [UserService, User],
	styleUrls: ['./sign-in.component.css'],
	moduleId: module.id,
})

export class SignInComponent implements OnInit {
	@ViewChild("password") private password: ElementRef;
	feedback: Feedback;
	isLoggingIn = true;
	processing = false;
	bioType = null;
	bioOn = "hidden";
	private bioValues;
	private fingerprintAuth: FingerprintAuth;
	public Text = Text;

	public constructor(
		public user: User,
		private router: Router,
		private userService: UserService,
		private page: Page,
	) {
		this.user = new User();
		this.feedback = new Feedback();
		this.fingerprintAuth = new FingerprintAuth();
		this.fingerprintAuth.available().then((result: BiometricIDAvailableResult) => {
			this.bioValues = result;
		})
		this.page.actionBarHidden = true;
		this.page.enableSwipeBackNavigation = false;
	};
	
	ngOnInit() {
		if (this.bioValues.face) {
			this.bioType = this.Text.signInBioFaceButton;
		} else if (this.bioValues.touch) {
			this.bioType = this.Text.signInBioFingerButton;
		}
		if (Kinvey.User.getActiveUser()) {
			Kinvey.User.getActiveUser().me();
			this.user.username = Kinvey.User.getActiveUser().username;
			this.bioOn = "visible";
		};
	};

	public switchToPass(args: EventData) {
		this.password.nativeElement.focus();
	}

	public submit(args: EventData) {
		this.processing = true;
		if (!this.user.username && this.user.password) {
			this.feedback.error({
				message: this.Text.feedbackMissingUsername
			});
			this.processing = false;
		} else if (this.user.username && !this.user.password) {
			this.feedback.error({
				message: this.Text.feedbackMissingPassword
			});
			this.processing = false;
		} else if (!this.user.username && !this.user.password) {
			this.feedback.error({
				message: this.Text.feedbackMissingUsernamePassword
			});
			this.processing = false;
		} else {
			this.feedback.info({
				message: `${this.Text.feedbackSigningIn} ${this.user.username}`
			})
			this.login();
		}
	}

	private login() {
		this.userService.login(this.user)
			.then(() => {
				this.processing = false;
				this.feedback.success({
					message: `${this.Text.feedbackSignedIn} ${this.user.username}`
				})
				this.router.navigate(["/home"])
			})
			.catch(() => {
				this.processing = false;
				this.feedback.error({
					message: `${this.Text.feedbackSignInError} ${this.user.username}`
				});
			});
	}

	public touchID() {
		this.fingerprintAuth.verifyFingerprint(
			{
				title: this.Text.bioTitle, // optional title (used only on Android)
				message: `${this.Text.bioMessage} '${this.user.username}'`,
				authenticationValidityDuration: 10, // optional (used on Android, default 5)
				useCustomAndroidUI: false // set to true to use a different authentication screen (see below)
			})
			.then(() => {
				this.router.navigate(["/home"])
			})
	}

}