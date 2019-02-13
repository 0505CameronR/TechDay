import { Component, OnInit } from '@angular/core';
import { Feedback } from 'nativescript-feedback';
import { Router } from '@angular/router';
import { Page } from 'tns-core-modules/ui/page/page';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';
import { Text } from '../shared/text';

@Component({
	selector: 'app-supported-children',
	templateUrl: './supported-children.component.html',
	styleUrls: ['./supported-children.component.css']
})
export class SupportedChildrenComponent implements OnInit {
	public supportedChildren: Array<Object> = new SupportedChildrenService().defaultSupportedChildren;
	public Text = Text;
	constructor(private page: Page,
		private router: Router,
		private feedback: Feedback,
	) {
		this.page.actionBarHidden = true;
	}

	ngOnInit() {
	}

	public viewChild(target){
		this.router.navigate(['/supported-child/',target])
	}
}
