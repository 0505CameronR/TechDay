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
    public userWelcomeText: String = `Welcome:\n${this.user}`;
    
    constructor(private page: Page,
        private router: Router,
        ) {
            this.page.actionBarHidden = true;
        }

    public signOut(args: EventData) {
        console.log("Sign Out")
        Kinvey.User.logout().then(() =>
        this.router.navigate(["/sign-in"]))
    }
}