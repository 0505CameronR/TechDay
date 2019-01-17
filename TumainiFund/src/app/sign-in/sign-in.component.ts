// import { Component, OnInit } from '@angular/core';
// import { Router } from '@angular/router';
// import { User } from '../shared/user/user.model';
// import { UserService } from '../shared/user/user.service';

// @Component({
//   selector: 'app-sign-in',
//   templateUrl: './sign-in.component.html',
//   providers: [UserService],
//   styleUrls: ['./sign-in.component.css'],
// })
// export class SignInComponent implements OnInit {
//   user: User;
//   isLoggingIn = true;

//   public constructor(
//     private router: Router,
//     private userService: UserService
//   ) {
//     this.user = new User()
//   }

//   ngOnInit() {
//   }

//   login() {
//     this.userService.login(this.user)
//       .then(() => {
//         this.router.navigate(["/home"])
//       })
//       .catch(() => {
//         alert("Unfortunately we could not find your account" + this.user.username)
//       });
//   }

//   signUp() {
//     // FIXME: Need to move to web version
//     this.userService.register(this.user)
//       .then(() => {
//           alert("Your account was successfully created.");
//           this.toggleDisplay();
//         })
//         .catch(() => {
//           alert("Unfortunately we were unable to create your account.")
//         });
//   }

//   toggleDisplay(){
//     this.isLoggingIn = !this.isLoggingIn;
//   }
//   submit() {
//     if (this.isLoggingIn) {
//       this.login();
//     } else {
//       this.signUp()
//     }
//   }

// }

import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

// import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService, User],
  styleUrls: ['./sign-in.component.css'],
  // moduleId: module.id,
})

export class SignInComponent implements OnInit {
  // @ViewChild("password") password: ElementRef;
  // feedback: Feedback;
  isLoggingIn = true;
  // processing = false;

  public constructor(
    private user: User,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef,
    // private page: Page,
  ) {
    // page.actionBarHidden = true;
    this.user = new User()
    // this.feedback = new Feedback();
  }
  ngOnInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#82CC33";
  }
  login() {
    this.userService.login(this.user)
      .then(() => {
        // this.processing = false;
        this.router.navigate(["/home"])
      })
      .catch(() => {
        // this.processing = false;
          alert(`Unfortunately we could not find your account ${this.user.username}`);
      });
  }
  signUp() {
    // FIXME: Need to move to web version
    this.userService.register(this.user)
      .then(() => {
        // this.processing = false;
          alert("Your account was successfully created.");
        this.toggleDisplay();
      })
      .catch(() => {
        // this.processing = false;
          alert("Unfortunately we were unable to create your account");
      });
  }
  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit() {
    if(!this.user.username && this.user.password){
        alert("Please Provide Username");
    }else if(this.user.username && !this.user.password){
        alert("Please Provide Password");
    }else if(!this.user.username && !this.user.password) {
        alert("Please Provide Both a Username and a Password");
    }else{
      // this.processing = true;
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.signUp()
      }
    }
  }
}