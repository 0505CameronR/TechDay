import { Component, OnInit } from '@angular/core';
import { SearchBar } from "tns-core-modules/ui/search-bar";

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // moduleId: module.id,
})
export class HomeComponent implements OnInit{
  title = 'TumainiFund';

  constructor() { }

  ngOnInit() {
  }
}