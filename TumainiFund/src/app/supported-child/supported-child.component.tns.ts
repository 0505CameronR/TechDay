import { Component, OnInit, ViewChildren, QueryList, ElementRef, Directive, ContentChildren, AfterViewInit, Renderer2 } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';
import { Child } from '../shared/supported-children/child.model';
import { Page } from 'tns-core-modules/ui/page/page';
import { Text } from '../shared/text';
import { DatePicker } from 'tns-core-modules/ui/date-picker'
import { ListPicker } from 'tns-core-modules/ui/list-picker'
import { Label } from 'tns-core-modules/ui/label'
import { TextField } from 'tns-core-modules/ui/text-field'
import { Button } from 'tns-core-modules/ui/button'
import { Renderer3 } from '@angular/core/src/render3/interfaces/renderer';
import { text } from '@angular/core/src/render3';
var view = require("tns-core-modules/ui/core/view");

@Component({
	selector: 'app-supported-child',
	templateUrl: './supported-child.component.html',
	styleUrls: ['./supported-child.component.css']
})

export class SupportedChildComponent implements OnInit, AfterViewInit {
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

	@ViewChildren('labelField') textFieldLabels: QueryList<ElementRef>
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
	public textFieldButtonStatus;
	public listPickerButtonStatus;
	public datePickerButtonStatus;

	constructor(
		public route: ActivatedRoute,
		public page: Page,
		public renderer: Renderer2,
	) {
		this.page.actionBarHidden = true;
		this.textFieldButtonStatus = false;
		this.listPickerButtonStatus = false;
		this.datePickerButtonStatus = false
	}

	ngOnInit() {
		this.targetId = this.route.snapshot.params['child'];
		for (let i of this.supportedChildren) {
			if (i.id == this.targetId) {
				this.target = i;
			}
		}
	}

	ngAfterViewInit() {
		/*console.log("datePickers")
		console.log(this.datePickers.toArray())
		console.log("listPickers")
		console.log(this.listPickers.toArray())
		console.log("textFieldLabels")
		console.log(this.textFieldLabels.toArray())
		console.log("textFieldTextFields")
		console.log(this.textFieldTextFields.toArray())
		console.log("editButtons")
		console.log(this.editButtons.toArray())*/
	}

	listPickerButton(labelID, pickerID, buttonID, status = this.listPickerButtonStatus) {
		console.log(view.getViewByID(labelID).visibility)
		view.getViewByID(labelID).visibility="collapse"
		console.log(view.getViewByID(labelID).visibility)
		console.log(view.getViewByID(pickerID).visibility)
		view.getViewByID(pickerID).visibility="visible"
		console.log(view.getViewByID(pickerID).visibility)
		console.log(view.getViewByID(buttonID).text)
		view.getViewByID(buttonID).text=this.Text.genericDoneButton
		console.log(view.getViewByID(buttonID).text)
		/*//if (status) { // If Editing Is Active
		this.textFieldLabels.forEach((i) => {
			if (i.nativeElement.id == labelID) {
				console.log(i.nativeElement.visibility)
				i.nativeElement.visibility = "visible"
				console.log(i.nativeElement.visibility)
			}
		})
		this.listPickers.forEach((i) => {
			if (i.nativeElement.id == pickerID) {
				console.log(i.nativeElement.visibility)
				i.nativeElement.visibility = "collapse"
				console.log(i.nativeElement.visibility)
			}
		})
		//console.log(buttonID)
		this.editButtons.forEach((i) => {
			if (i.nativeElement.id == buttonID) {
				console.log(i.nativeElement.text)
				this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
				console.log(i.nativeElement.text)
			}
		})*/
	} /*else { // If Editing Isn't Active
			console.dir(this.textFieldLabels.toArray())
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			console.dir(this.listPickers.toArray())
			this.listPickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "visible"
				}
			})
			console.dir(this.editButtons.toArray())
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.listPickerButtonStatus = false
		}
	}*/

	datePickerButton(labelID, pickerID, buttonID, status = this.datePickerButtonStatus) {
		console.log(view.getViewByID(labelID).visibility)
		view.getViewByID(labelID).visibility="collapse"
		console.log(view.getViewByID(labelID).visibility)
		console.log(view.getViewByID(pickerID).visibility)
		view.getViewByID(pickerID).visibility="visible"
		console.log(view.getViewByID(pickerID).visibility)
		console.log(view.getViewByID(buttonID).text)
		view.getViewByID(buttonID).text=this.Text.genericDoneButton
		console.log(view.getViewByID(buttonID).text)
		//if (status) { // If Editing Is Active
		/*this.textFieldLabels.forEach((i) => {
			if (i.nativeElement.id == labelID) {
				console.log(i.nativeElement.visibility)
				i.nativeElement.visibility = "visible"
				console.log(i.nativeElement.visibility)
				//console.log(i.nativeElement.text)
			}
		})
		this.datePickers.forEach((i) => {
			if (i.nativeElement.id == pickerID) {
				console.log(i.nativeElement.visibility)
				i.nativeElement.visibility = "collapse"
				console.log(i.nativeElement.visibility)
			}
		})
		this.editButtons.forEach((i) => {
			if (i.nativeElement.id == buttonID) {
				console.log(i.nativeElement.text)
				this.renderer.setProperty(i.nativeElement.text, "text", this.Text.genericEditButton)
				console.log(i.nativeElement.text)
				//console.log(i.nativeElement.text)
			}
		})*/
	} /*else { // If Editing Isn't Active
			console.dir(this.textFieldLabels.toArray())
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			console.dir(this.datePickers.toArray())
			this.datePickers.forEach((i) => {
				if (i.nativeElement.id == pickerID) {
					i.nativeElement.visibility = "visible"
				}
			})
			console.dir(this.editButtons.toArray())
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.datePickerButtonStatus = false
		}
	}*/

	textFieldButton(labelID, editID, buttonID, status = this.textFieldButtonStatus) {
		console.log(view.getViewByID(labelID).visibility)
		view.getViewByID(labelID).visibility="collapse"
		console.log(view.getViewByID(labelID).visibility)
		console.log(view.getViewByID(editID).visibility)
		view.getViewByID(editID).visibility="visible"
		console.log(view.getViewByID(editID).visibility)
		console.log(view.getViewByID(buttonID).text)
		view.getViewByID(buttonID).text=this.Text.genericDoneButton
		console.log(view.getViewByID(buttonID).text)
		if (status) { // If Editing Is Active
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					console.log(i.nativeElement.visibility)
					i.nativeElement.visibility = "collapse"
					console.log(i.nativeElement.visibility)
					//console.log(i.nativeElement.text)
				}
			})
			this.textFieldTextFields.forEach((i) => {
				if (i.nativeElement.id == editID) {
					console.log(i.nativeElement.visibility)
					i.nativeElement.visibility = "visible"
					console.log(i.nativeElement.visibility)
					//console.log(i.nativeElement.text)
				}
			})
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					console.log(i.nativeElement.text)
					this.renderer.setProperty(i.nativeElement.text, "innerHTML", this.Text.genericEditButton)
					console.log(i.nativeElement.text)
				}
		})
		} else { // If Editing Isn't Active
			console.dir(this.textFieldLabels.toArray())
			this.textFieldLabels.forEach((i) => {
				if (i.nativeElement.id == labelID) {
					i.nativeElement.visibility = "collapse"
				}
			})
			console.dir(this.textFieldTextFields.toArray())
			this.textFieldTextFields.forEach((i) => {
				if (i.nativeElement.id == editID) {
					i.nativeElement.visibility = "visible"
				}
			})
			console.dir(this.editButtons.toArray())
			this.editButtons.forEach((i) => {
				if (i.nativeElement.id == buttonID) {
					i.nativeElement.Text = this.Text.genericDoneButton
				}
			})
			this.textFieldButtonStatus = false
		}
	}
}
