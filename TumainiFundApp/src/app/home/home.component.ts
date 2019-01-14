import { Component, OnInit } from '@angular/core';
import { getString } from 'tns-core-modules/application-settings/application-settings';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  moduleId: module.id,
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  user=getString("username");
}
