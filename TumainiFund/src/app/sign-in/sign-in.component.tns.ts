import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { EventData } from 'tns-core-modules/ui/page/page';

import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  providers: [UserService, User],
  styleUrls: ['./sign-in.component.css'],
  moduleId: module.id,
})
export class SignInComponent implements OnInit {
  isLoggingIn = true;
  processing = false;

  public constructor(
    private user: User,
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
        this.processing = false;
        this.router.navigate(["/home"])
      })
      .catch(() => {
        this.processing = false;
        alert(`Unfortunately we could not find your account ${this.user.username}`)
      });
  }
  signUp() {
    // FIXME: Need to move to web version
    this.userService.register(this.user)
      .then(() => {
        this.processing = false;
        alert("Your account was successfully created.");
        this.toggleDisplay();
      })
      .catch(() => {
        this.processing = false;
        alert("Unfortunately we were unable to create your account.")
      });
  }
  toggleDisplay() {
    this.isLoggingIn = !this.isLoggingIn;
  }
  submit(args: EventData) {
    this.processing = true;
    if (this.isLoggingIn) {
      this.login();
    } else {
      this.signUp()
    }
  }
}