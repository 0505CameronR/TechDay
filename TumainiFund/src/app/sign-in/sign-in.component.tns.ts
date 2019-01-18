import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page/page';
import { Page } from 'tns-core-modules/ui/page';

import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService, User],
  styleUrls: ['./sign-in.component.css'],
  moduleId: module.id,
})

export class SignInComponent implements OnInit {
  @ViewChild("password") password: ElementRef;
  feedback: Feedback;
  isLoggingIn = true;
  processing = false;

  public constructor(
    private user: User,
    private router: Router,
    private userService: UserService,
    private page: Page,
  ) {
    page.actionBarHidden = true;
    this.user = new User()
    this.feedback = new Feedback();
  }

  ngOnInit() {}

  login() {
    this.userService.login(this.user)
      .then(() => {
        this.processing = false;
        this.router.navigate(["/home"])
      })
      .catch(() => {
        this.processing = false;
        this.feedback.error({
          message: `Unfortunately we could not find your account: ${this.user.username}`
        });
      });
  }
  submit(args: EventData) {
    this.processing = true;
    if (!this.user.username && this.user.password) {
      this.feedback.error({
        message: "Please Provide Username"
      });
      this.processing = false;
    } else if (this.user.username && !this.user.password) {
      this.feedback.error({
        message: "Please Provide Password"
      });
      this.processing = false;
    } else if (!this.user.username && !this.user.password) {
      this.feedback.error({
        message: "Please Provide Both a Username and a Password"
      });
      this.processing = false;
    } else {
      this.login();
    }
  }
  switchToPass(args: EventData) {
    this.password.nativeElement.focus();
  }
}