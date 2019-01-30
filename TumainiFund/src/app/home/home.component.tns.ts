import { Component } from '@angular/core';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Router } from '@angular/router';
import { Feedback } from 'nativescript-feedback';
import { EventData } from 'tns-core-modules/ui/page/page';

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent {
    private activeUser = Kinvey.User.getActiveUser();
    public user = this.activeUser.username;
    public userWelcomeText = `Welcome:\n${this.user}`;
    public allocatedSchoolText = `Allocated Schools`;
    public allocatedChildrenText = `Allocated Children`;
    public signOutText = `Sign Out`;
    private feedback: Feedback;
    constructor(
        private router: Router,
    ) {
    }

    signOut(args: EventData) {
        const promise = Kinvey.User.logout()
            .then(() => {
                this.router.navigate(["/sign-in"])
            }).catch((error: Kinvey.BaseError) => {
                this.feedback.error({
                    message: `Unfortunately we could not sign out: ${this.user}`,
                });
            });
    }
}