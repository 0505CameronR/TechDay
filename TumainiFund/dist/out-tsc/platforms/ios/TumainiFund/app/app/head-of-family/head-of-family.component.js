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
let HeadOfFamilyComponent = class HeadOfFamilyComponent {
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
HeadOfFamilyComponent = __decorate([
    Component({
        selector: 'app-head-of-family',
        templateUrl: './head-of-family.html',
        styleUrls: ['./head-of-family.component.css']
    }),
    __metadata("design:paramtypes", [ActivatedRoute])
], HeadOfFamilyComponent);
export { HeadOfFamilyComponent };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC1vZi1mYW1pbHkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGxhdGZvcm1zL2lvcy9UdW1haW5pRnVuZC9hcHAvYXBwL2hlYWQtb2YtZmFtaWx5L2hlYWQtb2YtZmFtaWx5LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFVLE1BQU0sZUFBZSxDQUFDO0FBQ2xELE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRCxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSx5REFBeUQsQ0FBQztBQU9uRyxJQUFhLHFCQUFxQixHQUFsQyxNQUFhLHFCQUFxQjtJQUtoQyxZQUFZLEtBQXFCO1FBRjFCLHNCQUFpQixHQUFpQixJQUFJLHdCQUF3QixFQUFFLENBQUMsd0JBQXdCLENBQUM7UUFHL0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFLLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUNwQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDN0IsSUFBSSxDQUFDLENBQUMsRUFBRSxJQUFJLElBQUksQ0FBQyxRQUFRLEVBQUU7Z0JBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO2FBQ2pCO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsUUFBUTtRQUNOLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzVCLENBQUM7Q0FDRixDQUFBO0FBbEJZLHFCQUFxQjtJQUxqQyxTQUFTLENBQUM7UUFDVCxRQUFRLEVBQUUsb0JBQW9CO1FBQzlCLFdBQVcsRUFBRSx1QkFBdUI7UUFDcEMsU0FBUyxFQUFFLENBQUMsZ0NBQWdDLENBQUM7S0FDOUMsQ0FBQztxQ0FNbUIsY0FBYztHQUx0QixxQkFBcUIsQ0FrQmpDO1NBbEJZLHFCQUFxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBDaGlsZCB9IGZyb20gJy4uL3NoYXJlZC9zdXBwb3J0ZWQtY2hpbGRyZW4vY2hpbGQubW9kZWwnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlIH0gZnJvbSAnLi4vc2hhcmVkL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGRyZW4uc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1oZWFkLW9mLWZhbWlseScsXG4gIHRlbXBsYXRlVXJsOiAnLi9oZWFkLW9mLWZhbWlseS5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vaGVhZC1vZi1mYW1pbHkuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIEhlYWRPZkZhbWlseUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHB1YmxpYyB0YXJnZXRJZDtcbiAgcHVibGljIHRhcmdldDtcbiAgcHVibGljIHN1cHBvcnRlZENoaWxkcmVuOiBBcnJheTxDaGlsZD4gPSBuZXcgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlKCkuZGVmYXVsdFN1cHBvcnRlZENoaWxkcmVuO1xuXG4gIGNvbnN0cnVjdG9yKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgIHRoaXMudGFyZ2V0SWQgPSByb3V0ZS5zbmFwc2hvdC5wYXJhbXNbJ2NoaWxkJ107XG4gICAgZm9yIChsZXQgaSBvZiB0aGlzLnN1cHBvcnRlZENoaWxkcmVuKSB7XG4gICAgICBjb25zb2xlLmxvZyhpLCB0aGlzLnRhcmdldElkKVxuICAgICAgaWYgKGkuaWQgPT0gdGhpcy50YXJnZXRJZCkge1xuICAgICAgICB0aGlzLnRhcmdldCA9IGk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy50YXJnZXRJZClcbiAgfVxufVxuIl19