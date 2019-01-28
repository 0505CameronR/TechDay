import { Component, OnInit } from '@angular/core';
import { Kinvey } from 'kinvey-nativescript-sdk';

@Component({
    selector: 'ns-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    moduleId: module.id,
})
export class HomeComponent {
    private activeUser = Kinvey.User.getActiveUser();
    public user = this.activeUser.username;
    constructor(
    ) {
    }
}