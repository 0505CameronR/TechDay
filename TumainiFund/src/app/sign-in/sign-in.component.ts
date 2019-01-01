import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Page, EventData } from 'tns-core-modules/ui/page/page';

@Component({
  selector: 'ns-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  moduleId: module.id,
})
export class SignInComponent implements OnInit {

  public constructor(
    private router: Router,
    private page: Page
  ) { }

  ngOnInit() {
    this.page.backgroundColor = '#82CC33';
  }

  Home(args: EventData){
    this.router.navigate(['home']);
  }
}
