import { Component, OnInit } from '@angular/core';
import { Feedback } from 'nativescript-feedback';
import { Router } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page/page';

@Component({
	selector: 'app-supported-children',
	templateUrl: './supported-children.component.html',
	styleUrls: ['./supported-children.component.css']
})
export class SupportedChildrenComponent implements OnInit {
	public supportedChildren = [
		{
			id: 0,
			first_name: "test 1",
			last_name: "test 1",
			age: 1,
			last_field: "unknown",
		},
		{
			id: 1,
			first_name: "test 2",
			last_name: "test 2",
			age: 2,
			last_field: "unknown",
		},
		{
			id: 2,
			first_name: "test 3",
			last_name: "test 3",
			age: 3,
			last_field: "unknown",
		},
		{
			id: 3,
			first_name: "test 4",
			last_name: "test 4",
			age: 4,
			last_field: "unknown",
		},
		{
			id: 4,
			first_name: "test 5",
			last_name: "test 5",
			age: 5,
			last_field: "unknown",
		},
	]

	constructor(private page: Page,
		private router: Router,
		private feedback: Feedback,
	) {
		this.page.actionBarHidden = true;
	}

	ngOnInit() {
	}

}
