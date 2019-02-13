import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Child } from '../shared/supported-children/child.model';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';

@Component({
  selector: 'app-supported-child',
  templateUrl: './supported-child.component.html',
  styleUrls: ['./supported-child.component.css']
})
export class SupportedChildComponent implements OnInit {
  public targetId;
  public target;
  public supportedChildren: Array<Child> = new SupportedChildrenService().defaultSupportedChildren;

  constructor(route: ActivatedRoute) {
    this.targetId = route.snapshot.params['child'];
    for (let i of this.supportedChildren) {
      console.log(i, this.targetId)
      if (i.id == this.targetId) {
        this.target = i;
      }
    }
  }

  ngOnInit() {
    console.log(this.targetId)
  }
}
