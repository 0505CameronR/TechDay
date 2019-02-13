var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../shared/user/user.model';
import { UserService } from '../shared/user/user.service';
let SignInComponent = class SignInComponent {
    constructor(user, router, userService, elementRef) {
        this.user = user;
        this.router = router;
        this.userService = userService;
        this.elementRef = elementRef;
        this.isLoggingIn = true;
        this.user = new User();
    }
    ngOnInit() {
        this.elementRef.nativeElement.ownerDocument.body.style.backgroundColor = "#82CC33";
    }
    login() {
        this.userService.login(this.user)
            .then(() => {
            this.router.navigate(["/home"]);
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
        if (!this.user.username && this.user.password) {
            alert("Please Provide Username");
        }
        else if (this.user.username && !this.user.password) {
            alert("Please Provide Password");
        }
        else if (!this.user.username && !this.user.password) {
            alert("Please Provide Both a Username and a Password");
        }
        else {
            if (this.isLoggingIn) {
                this.login();
            }
            else {
                this.signUp();
            }
        }
    }
};
SignInComponent = __decorate([
    Component({
        selector: 'app-sign-in',
        templateUrl: './sign-in.component.html',
        providers: [UserService, User],
        styleUrls: ['./sign-in.component.css'],
    }),
    __metadata("design:paramtypes", [User,
        Router,
        UserService,
        ElementRef])
], SignInComponent);
export { SignInComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC9hcHAvc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUN4RSxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFekMsT0FBTyxFQUFFLElBQUksRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ2pELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQVMxRCxJQUFhLGVBQWUsR0FBNUIsTUFBYSxlQUFlO0lBRzFCLFlBQ1MsSUFBVSxFQUNULE1BQWMsRUFDZCxXQUF3QixFQUN4QixVQUFzQjtRQUh2QixTQUFJLEdBQUosSUFBSSxDQUFNO1FBQ1QsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNkLGdCQUFXLEdBQVgsV0FBVyxDQUFhO1FBQ3hCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFOaEMsZ0JBQVcsR0FBRyxJQUFJLENBQUM7UUFRakIsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFBO0lBQ3hCLENBQUM7SUFDRCxRQUFRO1FBQ04sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxHQUFHLFNBQVMsQ0FBQztJQUNyRixDQUFDO0lBQ0QsS0FBSztRQUNILElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUNqQyxDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ1IsS0FBSyxDQUFDLGdEQUFnRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7UUFDaEYsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsTUFBTTtRQUNKLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7YUFDakMsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNQLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO1lBQ2xELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN2QixDQUFDLENBQUM7YUFDRCxLQUFLLENBQUMsR0FBRyxFQUFFO1lBQ1IsS0FBSyxDQUFDLHFEQUFxRCxDQUFDLENBQUM7UUFDakUsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBQ0QsYUFBYTtRQUNYLElBQUksQ0FBQyxXQUFXLEdBQUcsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDO0lBQ3ZDLENBQUM7SUFDRCxNQUFNO1FBQ0osSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQ3pDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BDO2FBQUssSUFBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFDO1lBQy9DLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO1NBQ3BDO2FBQUssSUFBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUU7WUFDakQsS0FBSyxDQUFDLCtDQUErQyxDQUFDLENBQUM7U0FDMUQ7YUFBSTtZQUNILElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDcEIsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO2FBQ2Q7aUJBQU07Z0JBQ0wsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFBO2FBQ2Q7U0FDRjtJQUNILENBQUM7Q0FDRixDQUFBO0FBbkRZLGVBQWU7SUFQM0IsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLGFBQWE7UUFDdkIsV0FBVyxFQUFFLDBCQUEwQjtRQUN2QyxTQUFTLEVBQUUsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDO1FBQzlCLFNBQVMsRUFBRSxDQUFDLHlCQUF5QixDQUFDO0tBQ3ZDLENBQUM7cUNBTWUsSUFBSTtRQUNELE1BQU07UUFDRCxXQUFXO1FBQ1osVUFBVTtHQVByQixlQUFlLENBbUQzQjtTQW5EWSxlQUFlIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQsIEVsZW1lbnRSZWYsIFZpZXdDaGlsZH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBVc2VyIH0gZnJvbSAnLi4vc2hhcmVkL3VzZXIvdXNlci5tb2RlbCc7XG5pbXBvcnQgeyBVc2VyU2VydmljZSB9IGZyb20gJy4uL3NoYXJlZC91c2VyL3VzZXIuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zaWduLWluJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3NpZ24taW4uY29tcG9uZW50Lmh0bWwnLFxuICBwcm92aWRlcnM6IFtVc2VyU2VydmljZSwgVXNlcl0sXG4gIHN0eWxlVXJsczogWycuL3NpZ24taW4uY29tcG9uZW50LmNzcyddLFxufSlcblxuZXhwb3J0IGNsYXNzIFNpZ25JbkNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIGlzTG9nZ2luZ0luID0gdHJ1ZTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoXG4gICAgcHVibGljIHVzZXI6IFVzZXIsXG4gICAgcHJpdmF0ZSByb3V0ZXI6IFJvdXRlcixcbiAgICBwcml2YXRlIHVzZXJTZXJ2aWNlOiBVc2VyU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICkge1xuICAgIHRoaXMudXNlciA9IG5ldyBVc2VyKClcbiAgfVxuICBuZ09uSW5pdCgpIHtcbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5vd25lckRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCIjODJDQzMzXCI7XG4gIH1cbiAgbG9naW4oKSB7XG4gICAgdGhpcy51c2VyU2VydmljZS5sb2dpbih0aGlzLnVzZXIpXG4gICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgIHRoaXMucm91dGVyLm5hdmlnYXRlKFtcIi9ob21lXCJdKVxuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoYFVuZm9ydHVuYXRlbHkgd2UgY291bGQgbm90IGZpbmQgeW91ciBhY2NvdW50ICR7dGhpcy51c2VyLnVzZXJuYW1lfWApO1xuICAgICAgfSk7XG4gIH1cbiAgc2lnblVwKCkge1xuICAgIHRoaXMudXNlclNlcnZpY2UucmVnaXN0ZXIodGhpcy51c2VyKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KFwiWW91ciBhY2NvdW50IHdhcyBzdWNjZXNzZnVsbHkgY3JlYXRlZC5cIik7XG4gICAgICAgIHRoaXMudG9nZ2xlRGlzcGxheSgpO1xuICAgICAgfSlcbiAgICAgIC5jYXRjaCgoKSA9PiB7XG4gICAgICAgICAgYWxlcnQoXCJVbmZvcnR1bmF0ZWx5IHdlIHdlcmUgdW5hYmxlIHRvIGNyZWF0ZSB5b3VyIGFjY291bnRcIik7XG4gICAgICB9KTtcbiAgfVxuICB0b2dnbGVEaXNwbGF5KCkge1xuICAgIHRoaXMuaXNMb2dnaW5nSW4gPSAhdGhpcy5pc0xvZ2dpbmdJbjtcbiAgfVxuICBzdWJtaXQoKSB7XG4gICAgaWYoIXRoaXMudXNlci51c2VybmFtZSAmJiB0aGlzLnVzZXIucGFzc3dvcmQpe1xuICAgICAgICBhbGVydChcIlBsZWFzZSBQcm92aWRlIFVzZXJuYW1lXCIpO1xuICAgIH1lbHNlIGlmKHRoaXMudXNlci51c2VybmFtZSAmJiAhdGhpcy51c2VyLnBhc3N3b3JkKXtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBQYXNzd29yZFwiKTtcbiAgICB9ZWxzZSBpZighdGhpcy51c2VyLnVzZXJuYW1lICYmICF0aGlzLnVzZXIucGFzc3dvcmQpIHtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBCb3RoIGEgVXNlcm5hbWUgYW5kIGEgUGFzc3dvcmRcIik7XG4gICAgfWVsc2V7XG4gICAgICBpZiAodGhpcy5pc0xvZ2dpbmdJbikge1xuICAgICAgICB0aGlzLmxvZ2luKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNpZ25VcCgpXG4gICAgICB9XG4gICAgfVxuICB9XG59Il19