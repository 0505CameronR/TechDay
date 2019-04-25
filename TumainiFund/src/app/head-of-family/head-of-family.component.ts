import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Child } from '../shared/supported-children/child.model';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';

@Component({
  selector: 'app-head-of-family',
  templateUrl: './head-of-family.html',
  styleUrls: ['./head-of-family.component.css']
})
export class HeadOfFamilyComponent implements OnInit {
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
