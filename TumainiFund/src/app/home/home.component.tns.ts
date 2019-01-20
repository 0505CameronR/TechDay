import { Component, OnInit } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ActionItem } from "tns-core-modules/ui/action-bar";
import { Kinvey } from 'kinvey-nativescript-sdk';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // moduleId: module.id,
})
export class HomeComponent implements OnInit{
  private activeUser = Kinvey.User.getActiveUser();
  user = this.activeUser.username;

  constructor() { }

  ngOnInit() {}
}