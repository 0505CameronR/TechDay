import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout"
import { isIOS, isAndroid, EventData, Page, View, backgroundSpanUnderStatusBarProperty } from "tns-core-modules/ui/page/page";
import { Router, Route, Routes } from "@angular/router";
import { routes } from "./app.routes";
import { Feedback } from "nativescript-feedback";

declare var UISearchBarStyle: any;
declare var UIImage: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild("radSideDrawer") private drawerComponent: RadSideDrawerComponent;
    private _mainContentText: string;
    public drawer: RadSideDrawer;

    constructor(
        public page: Page,
        private feedback: Feedback,
        private _changeDetectionRef: ChangeDetectorRef,
        private router: Router,
    ) {
        this.feedback = new Feedback();
    }

    ngOnInit() {
        this.mainContentText = "SideDrawer for NativeScript can be easily setup in the HTML definition of your page by defining tkDrawerContent and tkMainContent. The component has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.";
    }

    onLoaded() {
        if (isAndroid) {
            this.drawer.android.setTouchTargetThreshold(0);
        }
    }

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();
        if (isIOS) {
            this.drawer.ios.defaultSideDrawer.allowEdgeSwipe = false;
        }
    }

    get mainContentText() {
        return this._mainContentText;
    }

    set mainContentText(value: string) {
        this._mainContentText = value;
    }

    public toggleDrawer() {
        this.drawer.toggleDrawerState();
    }

    public openDrawer() {
        this.drawer.showDrawer();
    }

    public closeDrawer() {
        this.drawer.closeDrawer();
    }

    public isSignIn() {
        if (this.router.url == "/sign-in") {
            return "collapsed";
        } else {
            return "visible";
        }
    }

    public navigate(destination) {
        destination = destination.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
        let current= this.router.url.replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, "")
        let flag:Boolean = false;
        for(let curRoute in routes){
            if(destination == routes[curRoute].path){
                flag = true;
                break;
            }
        }
        if (flag) {
            if (current == destination) {
                this.feedback.info({
                    message: `You're Already At: ${destination}`
                })
            } else {
                this.router.navigate([destination])
            }
        } else {
            this.feedback.warning({
                message: `The Feature ${destination} Hasn't Been Implemented Yet`
            })
        }
    }
}
