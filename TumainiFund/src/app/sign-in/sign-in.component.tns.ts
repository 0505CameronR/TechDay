import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
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
  ngOnInit() {
  }
  login() {
    this.userService.login(this.user)
      .then(() => {
        this.processing = false;
        this.router.navigate(["/home"])
      })
      .catch(() => {
        this.processing = false;
        this.feedback.error({
          message: `Unfortunately we could not find your account ${this.user.username}`
        });
      });
  }
  signUp() {
    // FIXME: Need to move to web version
    this.userService.register(this.user)
      .then(() => {
        this.processing = false;
        this.feedback.success({
          message: "Your account was successfully created."
        });
        this.toggleDisplay();
      })
      .catch(() => {
        this.processing = false;
        this.feedback.error({
          message: "Unfortunately we were unable to create your account"
        });
      });
  }
  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit(args: EventData) {
    if(!this.user.username && this.user.password){
      this.feedback.error({
        message: "Please Provide Username"
      });
    }else if(this.user.username && !this.user.password){
      this.feedback.error({
        message: "Please Provide Password"
      });
    }else if(!this.user.username && !this.user.password) {
      this.feedback.error({
        message: "Please Provide Both a Username and a Password"
      });
    }else{
      this.processing = true;
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.signUp()
      }
    }
  }
  switchToPass(args: EventData) {
    this.password.nativeElement.focus();
  }
}