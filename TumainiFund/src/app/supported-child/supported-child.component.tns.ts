import { Component, OnInit, ViewChildren, QueryList, ElementRef, Directive, ContentChildren, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';
import { Child } from '../shared/supported-children/child.model';
import { Page } from 'tns-core-modules/ui/page/page';
import { Text } from '../shared/text';
var view = require("tns-core-modules/ui/core/view");

@Component({
	selector: 'app-supported-child',
	templateUrl: './supported-child.component.html',
	styleUrls: ['./supported-child.component.css']
})

export class SupportedChildComponent implements OnInit {
	public targetId;
	public target: Child;
	public thing: Child;
	public supportedChildren: Array<Child> = new SupportedChildrenService().defaultSupportedChildren;
	public dataAvailable: Boolean = false;
	public Text = Text;

	/**
	 * Date Pickers by ID
	 * 
	 * List Pickers by ID
	 * 
	 * ViewChildren of Labels by ID
	 * ViewChildren of Edits by ID
	 * 
	 * ViewChildren of Buttons by ID
	 */
	@ViewChildren('datePicker') datePickers: QueryList<ElementRef>
	@ViewChildren('listPicker') listPickers: QueryList<ElementRef>

	@ViewChildren('label') textFieldLabels: QueryList<ElementRef>
	@ViewChildren('textField') textFieldTextFields: QueryList<ElementRef>

	@ViewChildren('editButton') editButtons: QueryList<ElementRef>


	public gender: Array<String> = ["Male", "Female", "Other"]
	public school: Object = {
		level: ["education high"],
		books: ["Yes", "No"]
	}
	public personal_status: Array<String> = ["Single"]
	public hygiene_kits: Array<String> = ["Yes", "No"]
	public medical_support: Array<String> = ["Yes", "No"]
	public transport_to_clinic: Array<String> = ["Yes", "No"]

	constructor(
		public route: ActivatedRoute,
		public page: Page,
	) {
		this.page.actionBarHidden = true;
	}

	ngOnInit() {
		this.targetId = this.route.snapshot.params['child'];
		for (let i of this.supportedChildren) {
			if (i.id == this.targetId) {
				this.target = i;
			}
		}
	}

	listPickerButtonStatus = false
	listPickerButton(labelID, pickerID, buttonID, status = this.listPickerButtonStatus) {
		if (status) { // If Editing Is Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.listPickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericEditButton
				}
			})
			this.listPickerButtonStatus = true
		} else { // If Editing Isn't Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.listPickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.datePickerButtonStatus = false
		}
	}

	datePickerButtonStatus = false
	datePickerButton(labelID, pickerID, buttonID, status = this.datePickerButtonStatus) {
		if (status) { // If Editing Is Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.datePickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericEditButton
				}
			})
			this.datePickerButtonStatus = true
		} else { // If Editing Isn't Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.datePickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.datePickerButtonStatus = false
		}
	}

	textFieldButtonStatus = false;
	textFieldButton(labelID, editID, buttonID, status = this.textFieldButtonStatus) {
		if (status) { // If Editing Is Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.textFieldTextFields.forEach((i) => {
				if (i.nativeElement.id == editID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericEditButton
				}
			})
			this.textFieldButtonStatus = true
		} else { // If Editing Isn't Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			this.textFieldTextFields.forEach((i) => {
				if (i.nativeElement.id == editID) {
					i.nativeElement.visibility = "visible"
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.textFieldButtonStatus = false
		}
	}
}
