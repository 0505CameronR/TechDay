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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2lnbi1pbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvYXBwL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxVQUFVLEVBQVksTUFBTSxlQUFlLENBQUM7QUFDeEUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBRXpDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFTMUQsSUFBYSxlQUFlLEdBQTVCLE1BQWEsZUFBZTtJQUcxQixZQUNTLElBQVUsRUFDVCxNQUFjLEVBQ2QsV0FBd0IsRUFDeEIsVUFBc0I7UUFIdkIsU0FBSSxHQUFKLElBQUksQ0FBTTtRQUNULFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxnQkFBVyxHQUFYLFdBQVcsQ0FBYTtRQUN4QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBTmhDLGdCQUFXLEdBQUcsSUFBSSxDQUFDO1FBUWpCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQTtJQUN4QixDQUFDO0lBQ0QsUUFBUTtRQUNOLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsR0FBRyxTQUFTLENBQUM7SUFDckYsQ0FBQztJQUNELEtBQUs7UUFDSCxJQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQzlCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUE7UUFDakMsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNSLEtBQUssQ0FBQyxnREFBZ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQ2hGLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELE1BQU07UUFDSixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO2FBQ2pDLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDUCxLQUFLLENBQUMsd0NBQXdDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7UUFDdkIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLEdBQUcsRUFBRTtZQUNSLEtBQUssQ0FBQyxxREFBcUQsQ0FBQyxDQUFDO1FBQ2pFLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELGFBQWE7UUFDWCxJQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQztJQUN2QyxDQUFDO0lBQ0QsTUFBTTtRQUNKLElBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUN6QyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwQzthQUFLLElBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBQztZQUMvQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUNwQzthQUFLLElBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2pELEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO1NBQzFEO2FBQUk7WUFDSCxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUU7Z0JBQ3BCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQzthQUNkO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQTthQUNkO1NBQ0Y7SUFDSCxDQUFDO0NBQ0YsQ0FBQTtBQW5EWSxlQUFlO0lBUDNCLFNBQVMsQ0FBQztRQUNULFFBQVEsRUFBRSxhQUFhO1FBQ3ZCLFdBQVcsRUFBRSwwQkFBMEI7UUFDdkMsU0FBUyxFQUFFLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQztRQUM5QixTQUFTLEVBQUUsQ0FBQyx5QkFBeUIsQ0FBQztLQUN2QyxDQUFDO3FDQU1lLElBQUk7UUFDRCxNQUFNO1FBQ0QsV0FBVztRQUNaLFVBQVU7R0FQckIsZUFBZSxDQW1EM0I7U0FuRFksZUFBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0LCBFbGVtZW50UmVmLCBWaWV3Q2hpbGR9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgUm91dGVyIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgVXNlciB9IGZyb20gJy4uL3NoYXJlZC91c2VyL3VzZXIubW9kZWwnO1xuaW1wb3J0IHsgVXNlclNlcnZpY2UgfSBmcm9tICcuLi9zaGFyZWQvdXNlci91c2VyLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc2lnbi1pbicsXG4gIHRlbXBsYXRlVXJsOiAnLi9zaWduLWluLmNvbXBvbmVudC5odG1sJyxcbiAgcHJvdmlkZXJzOiBbVXNlclNlcnZpY2UsIFVzZXJdLFxuICBzdHlsZVVybHM6IFsnLi9zaWduLWluLmNvbXBvbmVudC5jc3MnXSxcbn0pXG5cbmV4cG9ydCBjbGFzcyBTaWduSW5Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBpc0xvZ2dpbmdJbiA9IHRydWU7XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyB1c2VyOiBVc2VyLFxuICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIsXG4gICAgcHJpdmF0ZSB1c2VyU2VydmljZTogVXNlclNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICApIHtcbiAgICB0aGlzLnVzZXIgPSBuZXcgVXNlcigpXG4gIH1cbiAgbmdPbkluaXQoKSB7XG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQub3duZXJEb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwiIzgyQ0MzM1wiO1xuICB9XG4gIGxvZ2luKCkge1xuICAgIHRoaXMudXNlclNlcnZpY2UubG9naW4odGhpcy51c2VyKVxuICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLnJvdXRlci5uYXZpZ2F0ZShbXCIvaG9tZVwiXSlcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KGBVbmZvcnR1bmF0ZWx5IHdlIGNvdWxkIG5vdCBmaW5kIHlvdXIgYWNjb3VudCAke3RoaXMudXNlci51c2VybmFtZX1gKTtcbiAgICAgIH0pO1xuICB9XG4gIHNpZ25VcCgpIHtcbiAgICB0aGlzLnVzZXJTZXJ2aWNlLnJlZ2lzdGVyKHRoaXMudXNlcilcbiAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICBhbGVydChcIllvdXIgYWNjb3VudCB3YXMgc3VjY2Vzc2Z1bGx5IGNyZWF0ZWQuXCIpO1xuICAgICAgICB0aGlzLnRvZ2dsZURpc3BsYXkoKTtcbiAgICAgIH0pXG4gICAgICAuY2F0Y2goKCkgPT4ge1xuICAgICAgICAgIGFsZXJ0KFwiVW5mb3J0dW5hdGVseSB3ZSB3ZXJlIHVuYWJsZSB0byBjcmVhdGUgeW91ciBhY2NvdW50XCIpO1xuICAgICAgfSk7XG4gIH1cbiAgdG9nZ2xlRGlzcGxheSgpIHtcbiAgICB0aGlzLmlzTG9nZ2luZ0luID0gIXRoaXMuaXNMb2dnaW5nSW47XG4gIH1cbiAgc3VibWl0KCkge1xuICAgIGlmKCF0aGlzLnVzZXIudXNlcm5hbWUgJiYgdGhpcy51c2VyLnBhc3N3b3JkKXtcbiAgICAgICAgYWxlcnQoXCJQbGVhc2UgUHJvdmlkZSBVc2VybmFtZVwiKTtcbiAgICB9ZWxzZSBpZih0aGlzLnVzZXIudXNlcm5hbWUgJiYgIXRoaXMudXNlci5wYXNzd29yZCl7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIFByb3ZpZGUgUGFzc3dvcmRcIik7XG4gICAgfWVsc2UgaWYoIXRoaXMudXNlci51c2VybmFtZSAmJiAhdGhpcy51c2VyLnBhc3N3b3JkKSB7XG4gICAgICAgIGFsZXJ0KFwiUGxlYXNlIFByb3ZpZGUgQm90aCBhIFVzZXJuYW1lIGFuZCBhIFBhc3N3b3JkXCIpO1xuICAgIH1lbHNle1xuICAgICAgaWYgKHRoaXMuaXNMb2dnaW5nSW4pIHtcbiAgICAgICAgdGhpcy5sb2dpbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5zaWduVXAoKVxuICAgICAgfVxuICAgIH1cbiAgfVxufSJdfQ==