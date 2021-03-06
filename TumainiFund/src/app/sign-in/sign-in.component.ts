import { Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService, User],
  styleUrls: ['./sign-in.component.css'],
})

export class SignInComponent implements OnInit {
  isLoggingIn = true;

  public constructor(
    public user: User,
    private router: Router,
    private userService: UserService,
    private elementRef: ElementRef,
  ) {
    this.user = new User()
  }
  ngOnInit() {
    this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#82CC33";
  }
  login() {
    this.userService.login(this.user)
      .then(() => {
        this.router.navigate(["/home"])
      })
      .catch(() => {
          alert(`Unfortunately we could not find your account ${this.user.username}`);
      });
  }
  signUp() {
    this.userService.register(this.user)
      .then(() => {
          alert("Your account was successfully created.");
        this.toggleDisplay();
      })
      .catch(() => {
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
      if (this.isLoggingIn) {
        this.login();
      } else {
        this.signUp()
      }
    }
  }
}