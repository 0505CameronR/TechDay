import { Component } from '@angular/core';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Router } from '@angular/router';
import { Feedback } from 'nativescript-feedback';
import { EventData, Page } from 'tns-core-modules/ui/page/page';

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
    private feedback: Feedback;
    private router: Router;
    public userWelcomeText: String = `Welcome:\n${this.user}`;
    
    constructor(private page: Page,
        ) {
            this.page.actionBarHidden = true;
        }

    public signOut(args: EventData) {
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