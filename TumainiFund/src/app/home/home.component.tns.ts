import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ActionItem, ActionBar } from "tns-core-modules/ui/action-bar";
import { Kinvey, User } from 'kinvey-nativescript-sdk';
import {View} from "tns-core-modules/ui/core/view";
import { Page } from 'tns-core-modules/ui/page/page';


@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // moduleId: module.id,
})
export class HomeComponent implements OnInit{
  @ViewChild("navbar") navbar: ElementRef;

  private activeUser = Kinvey.User.getActiveUser();
  private user: String;
  constructor(page:Page) { 
    page.actionBarHidden = true;
    this.user = this.activeUser.username;
  }

  ngOnInit() {
    // if (isIOS) helpers.blurNav(this.navbar.nativeElement);
  }
  
}

// export function blurNav(navbar) {
//   let navBounds = navbar.ios.bounds;
//   var navEffectView = UIVisualEffectView.alloc().initWithEffect(UIBlurEffect.effectWithStyle(UIBlurEffectStyleLight));
//   navEffectView.frame = {
//       origin: { x: navBounds.origin.x, y: navBounds.origin.y - 20 },
//       size: { width: navBounds.size.width, height: navBounds.size.height + 20 }
//   };
//   navEffectView.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
//   navbar.ios.addSubview(navEffectView);
//   navbar.ios.sendSubviewToBack(navEffectView);

// }