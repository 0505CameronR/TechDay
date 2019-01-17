import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService],
  styleUrls: ['./sign-in.component.css'],
})
export class SignInComponent implements OnInit {
  user: User;
  isLoggingIn = true;

  public constructor(
    private router: Router,
    private userService: UserService
  ) {
    this.user = new User()
  }

  ngOnInit() {
  }

  login() {
    this.userService.login(this.user)
      .then(() => {
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
          this.toggleDisplay();
        })
        .catch(() => {
          alert("Unfortunately we were unable to create your account.")
        });
  }

  toggleDisplay(){
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit() {
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp()
    }
  }

}
