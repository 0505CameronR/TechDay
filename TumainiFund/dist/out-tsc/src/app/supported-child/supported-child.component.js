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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFakQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0seURBQXlELENBQUM7QUFPbkcsSUFBYSx1QkFBdUIsR0FBcEMsTUFBYSx1QkFBdUI7SUFLbEMsWUFBWSxLQUFxQjtRQUYxQixzQkFBaUIsR0FBaUIsSUFBSSx3QkFBd0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1FBRy9GLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzdCLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNqQjtTQUNGO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM1QixDQUFDO0NBQ0YsQ0FBQTtBQWxCWSx1QkFBdUI7SUFMbkMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLHFCQUFxQjtRQUMvQixXQUFXLEVBQUUsa0NBQWtDO1FBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO0tBQy9DLENBQUM7cUNBTW1CLGNBQWM7R0FMdEIsdUJBQXVCLENBa0JuQztTQWxCWSx1QkFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQ2hpbGQgfSBmcm9tICcuLi9zaGFyZWQvc3VwcG9ydGVkLWNoaWxkcmVuL2NoaWxkLm1vZGVsJztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSB9IGZyb20gJy4uL3NoYXJlZC9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc3VwcG9ydGVkLWNoaWxkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBwdWJsaWMgdGFyZ2V0SWQ7XG4gIHB1YmxpYyB0YXJnZXQ7XG4gIHB1YmxpYyBzdXBwb3J0ZWRDaGlsZHJlbjogQXJyYXk8Q2hpbGQ+ID0gbmV3IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSgpLmRlZmF1bHRTdXBwb3J0ZWRDaGlsZHJlbjtcblxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aGlzLnRhcmdldElkID0gcm91dGUuc25hcHNob3QucGFyYW1zWydjaGlsZCddO1xuICAgIGZvciAobGV0IGkgb2YgdGhpcy5zdXBwb3J0ZWRDaGlsZHJlbikge1xuICAgICAgY29uc29sZS5sb2coaSwgdGhpcy50YXJnZXRJZClcbiAgICAgIGlmIChpLmlkID09IHRoaXMudGFyZ2V0SWQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0SWQpXG4gIH1cbn1cbiJdfQ==