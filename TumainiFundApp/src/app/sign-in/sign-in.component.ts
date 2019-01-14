import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Page, EventData } from 'tns-core-modules/ui/page/page';

import { getString, setString } from "tns-core-modules/application-settings";
import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'ns-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService],
  styleUrls: ['./sign-in.component.css'],
  moduleId: module.id,
})
export class SignInComponent implements OnInit {
  user: User;
  isLoggingIn = true;

  public constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.user = new User()
    this.user.username = getString("username");
    this.user.password = getString("password");
  }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.user)
      .then(() => {
        setString("username",this.user.username);
        setString("password",this.user.password);
        this.router.navigate(["/home"])
      })
      .catch(() => {
        alert("Unfortunately we could not find your account" + this.user.username)
      });
  }

  signUp() {
    // FIXME: Need to move to web version
    this.userService.register(this.user)
      .then(() => {
          alert("Your account was successfully created.");
          setString("username",this.user.username);
          setString("password",this.user.password);
          this.toggleDisplay();
        })
        .catch(() => {
          alert("Unfortunately we were unable to create your account.")
        });
  }

  toggleDisplay(){
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit(args: EventData) {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp()
    }
  }

}
