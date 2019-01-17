import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  moduleId: module.id,
})
export class HomeComponent implements OnInit {
  title = 'TumainiFund';

  constructor() { }

  ngOnInit() {
  }
}