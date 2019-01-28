import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Page, EventData } from 'tns-core-modules/ui/page/page';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { isAndroid, isIOS, device, screen } from "tns-core-modules/platform";
import { Router } from '@angular/router';
declare var UISearchBarStyle: any;
declare var UIImage: any;
@Component({
    selector: 'ns-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
    moduleId: module.id,
})
export class HeaderComponent {
    @ViewChild("searchBar") searchBar: ElementRef;
    constructor(
        page: Page,
        private router: Router,
    ) {
        page.actionBarHidden = true;
    }
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
}