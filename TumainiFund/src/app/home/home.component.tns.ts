import { Component } from '@angular/core';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Router } from '@angular/router';
import { Feedback } from 'nativescript-feedback';
import { EventData, Page } from 'tns-core-modules/ui/page/page';
import { routes } from "../app.routes";

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent {
    public allocatedSchoolText: String = `Allocated Schools`;
    public allocatedChildrenText: String = `Allocated Children`;
    public signOutText: String = `Sign Out`;
    private activeUser: Kinvey.User = Kinvey.User.getActiveUser();;
    public user: String = this.activeUser.username;
    public userWelcomeText: String = `Welcome:\n${this.user}`;

    constructor(private page: Page,
        private router: Router,
        private feedback: Feedback,
    ) {
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
        this.feedback = new Feedback();
    }

    public signOut(args: EventData) {
        console.log("Sign Out")
        Kinvey.User.logout().then(() =>
            this.router.navigate(["/sign-in"]))
    }

    public navigateFromHome(destination) {
        if (destination in routes) {
            this.router.navigate([destination])
        } else {
            this.feedback.warning({
                message: `The Feature ${destination.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")} Hasn't Been Implemented Yet`
            })
        }
    }
}