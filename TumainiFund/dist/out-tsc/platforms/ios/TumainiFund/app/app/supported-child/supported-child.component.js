var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SupportedChildrenService } from '../shared/supported-children/supported-children.service';
let SupportedChildComponent = class SupportedChildComponent {
    constructor(route) {
        this.supportedChildren = new SupportedChildrenService().defaultSupportedChildren;
        this.targetId = route.snapshot.params['child'];
        for (let i of this.supportedChildren) {
            console.log(i, this.targetId);
            if (i.id == this.targetId) {
                this.target = i;
            }
        }
    }
    ngOnInit() {
        console.log(this.targetId);
    }
};
SupportedChildComponent = __decorate([
    Component({
        selector: 'app-supported-child',
        templateUrl: './supported-child.component.html',
        styleUrls: ['./supported-child.component.css']
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], SupportedChildComponent);
export { SupportedChildComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL2FwcC9zdXBwb3J0ZWQtY2hpbGQvc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQU9uRyxJQUFhLHVCQUF1QixHQUFwQyxNQUFhLHVCQUF1QjtJQUtsQyxZQUFZLEtBQXFCO1FBRjFCLHNCQUFpQixHQUFpQixJQUFJLHdCQUF3QixFQUFFLENBQUMsd0JBQXdCLENBQUM7UUFHL0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDN0IsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzVCLENBQUM7Q0FDRixDQUFBO0FBbEJZLHVCQUF1QjtJQUxuQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUscUJBQXFCO1FBQy9CLFdBQVcsRUFBRSxrQ0FBa0M7UUFDL0MsU0FBUyxFQUFFLENBQUMsaUNBQWlDLENBQUM7S0FDL0MsQ0FBQztxQ0FNbUIsY0FBYztHQUx0Qix1QkFBdUIsQ0FrQm5DO1NBbEJZLHVCQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBDaGlsZCB9IGZyb20gJy4uL3NoYXJlZC9zdXBwb3J0ZWQtY2hpbGRyZW4vY2hpbGQubW9kZWwnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlIH0gZnJvbSAnLi4vc2hhcmVkL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGRyZW4uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zdXBwb3J0ZWQtY2hpbGQnLFxuICB0ZW1wbGF0ZVVybDogJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHB1YmxpYyB0YXJnZXRJZDtcbiAgcHVibGljIHRhcmdldDtcbiAgcHVibGljIHN1cHBvcnRlZENoaWxkcmVuOiBBcnJheTxDaGlsZD4gPSBuZXcgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlKCkuZGVmYXVsdFN1cHBvcnRlZENoaWxkcmVuO1xuXG4gIGNvbnN0cnVjdG9yKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgIHRoaXMudGFyZ2V0SWQgPSByb3V0ZS5zbmFwc2hvdC5wYXJhbXNbJ2NoaWxkJ107XG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnN1cHBvcnRlZENoaWxkcmVuKSB7XG4gICAgICBjb25zb2xlLmxvZyhpLCB0aGlzLnRhcmdldElkKVxuICAgICAgaWYgKGkuaWQgPT0gdGhpcy50YXJnZXRJZCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy50YXJnZXRJZClcbiAgfVxufVxuIl19