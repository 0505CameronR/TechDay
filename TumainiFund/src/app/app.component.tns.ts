import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { RadSideDrawerComponent } from "nativescript-ui-sidedrawer/angular";
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { DockLayout } from "tns-core-modules/ui/layouts/dock-layout"
import { isIOS, isAndroid, EventData } from "tns-core-modules/ui/page/page";
import { Router } from "@angular/router";
import { screen } from "tns-core-modules/platform";
declare var UISearchBarStyle: any;
declare var UIImage: any;
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit {
    @ViewChild("Menu") public menu: DockLayout;

    private _mainContentText: string;
    public menuSize: number;

    constructor(
        private _changeDetectionRef: ChangeDetectorRef,
        private router: Router,
    ) {
    }

    @ViewChild("radSideDrawer") private drawerComponent: RadSideDrawerComponent;
    public drawer: RadSideDrawer;

    ngAfterViewInit() {
        this.drawer = this.drawerComponent.sideDrawer;
        this._changeDetectionRef.detectChanges();

        if (isIOS) {
            // This disables the swipe gesture to open menu
            this.drawer.ios.defaultSideDrawer.allowEdgeSwipe = false;

            // You can set other properties the same way, to style your RadSideDrawer for iOS. 
            // Such as:
            // ios.defaultSideDrawer.style.dimOpacity;
            // ios.defaultSideDrawer.style.shadowOpacity; 
            // ios.defaultSideDrawer.style.shadowRadius;
            // ios.defaultSideDrawer.transitionDuration;
        }
    }

    onLoaded() {
        if (isAndroid) {
            // This disables the swipe gesture to open menu, by setting the treshhold to '0'
            this.drawer.android.setTouchTargetThreshold(0);
        }
    }

    ngOnInit() {
        this.mainContentText = "SideDrawer for NativeScript can be easily setup in the HTML definition of your page by defining tkDrawerContent and tkMainContent. The component has a default transition and position and also exposes notifications related to changes in its state. Swipe from left to open side drawer.";
        this.menuSize = screen.mainScreen.heightDIPs;
    }

    get mainContentText() {
        return this._mainContentText;
    }

    set mainContentText(value: string) {
        this._mainContentText = value;
    }

    public openDrawer() {
        this.drawer.toggleDrawerState();
    }

    public onCloseDrawerTap() {
        this.drawer.closeDrawer();
    }

    @ViewChild("searchBar") searchBar: ElementRef;

    public searchBarLoaded(args) {
        let searchBar = <SearchBar>args.object
        if (isIOS) {
            var nativeSearchBar = searchBar.nativeView;
            nativeSearchBar.searchBarStyle = UISearchBarStyle.Prominent;
            nativeSearchBar.backgroundImage = UIImage.new();
        }
    }
    public goHome(args: EventData) {
        if (this.router.url != "/home") {
            this.router.navigate(["/home"])
        } else {
            console.dir(this.router.url)
        }
    }

    public isSignIn() {
        if (this.router.url == "/sign-in") {
            return "collapsed";
        } else {
            return "visible";
        }
    }
}