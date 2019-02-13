import { Component } from '@angular/core';
import { Kinvey } from 'kinvey-nativescript-sdk';
import { Router } from '@angular/router';
import { Feedback } from 'nativescript-feedback';
import { EventData, Page } from 'tns-core-modules/ui/page/page';
import { routes } from "../app.routes";
import { Text } from "../shared/text";

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent {
    private activeUser: Kinvey.User = Kinvey.User.getActiveUser();;
    public user: String = this.activeUser.username;
    public Text = Text;
    public homeWelcome;

    constructor(private page: Page,
        private router: Router,
        private feedback: Feedback,
    ) {
        this.page.actionBarHidden = true;
        this.page.enableSwipeBackNavigation = false;
        this.feedback = new Feedback();
        this.homeWelcome = `${this.Text.homeWelcome}${this.user}`
    }

    public signOut(args: EventData) {
        this.feedback.info({
            message: `${this.Text.feedbackSigningIn} ${this.user}`
        })
        Kinvey.User.logout().then(() => (
            this.feedback.success({
                message: `${this.user} ${this.Text.feedbackSignedOut}`
            }),
            this.router.navigate(["/sign-in"])))
    }

    public navigate(destination) {
        destination = destination.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
        let flag: Boolean = false;
        for (let curRoute in routes) {
            if (destination == routes[curRoute].path) {
                flag = true;
                break;
            }
        }
        if (flag) {
            if (this.router.url == destination) {
                this.feedback.info({
                    message: `${this.Text.feedbackSameLocation} ${destination}`
                })
            } else {
                this.router.navigate([destination])
            }
        } else {
            this.feedback.warning({
                message: `${this.Text.feedbackNotImplemented_1} ${destination} ${this.Text.feedbackNotImplemented_2}`
            })
        }
    }
}