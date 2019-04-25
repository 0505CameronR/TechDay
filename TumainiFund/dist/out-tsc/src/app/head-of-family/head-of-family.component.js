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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGVhZC1vZi1mYW1pbHkuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2FwcC9oZWFkLW9mLWZhbWlseS9oZWFkLW9mLWZhbWlseS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsT0FBTyxFQUFFLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFFakQsT0FBTyxFQUFFLHdCQUF3QixFQUFFLE1BQU0seURBQXlELENBQUM7QUFPbkcsSUFBYSxxQkFBcUIsR0FBbEMsTUFBYSxxQkFBcUI7SUFLaEMsWUFBWSxLQUFxQjtRQUYxQixzQkFBaUIsR0FBaUIsSUFBSSx3QkFBd0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1FBRy9GLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsS0FBSyxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzdCLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxJQUFJLENBQUMsUUFBUSxFQUFFO2dCQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQzthQUNqQjtTQUNGO0lBQ0gsQ0FBQztJQUVELFFBQVE7UUFDTixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM1QixDQUFDO0NBQ0YsQ0FBQTtBQWxCWSxxQkFBcUI7SUFMakMsU0FBUyxDQUFDO1FBQ1QsUUFBUSxFQUFFLG9CQUFvQjtRQUM5QixXQUFXLEVBQUUsdUJBQXVCO1FBQ3BDLFNBQVMsRUFBRSxDQUFDLGdDQUFnQyxDQUFDO0tBQzlDLENBQUM7cUNBTW1CLGNBQWM7R0FMdEIscUJBQXFCLENBa0JqQztTQWxCWSxxQkFBcUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgQ2hpbGQgfSBmcm9tICcuLi9zaGFyZWQvc3VwcG9ydGVkLWNoaWxkcmVuL2NoaWxkLm1vZGVsJztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSB9IGZyb20gJy4uL3NoYXJlZC9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLnNlcnZpY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtaGVhZC1vZi1mYW1pbHknLFxuICB0ZW1wbGF0ZVVybDogJy4vaGVhZC1vZi1mYW1pbHkuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL2hlYWQtb2YtZmFtaWx5LmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBIZWFkT2ZGYW1pbHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBwdWJsaWMgdGFyZ2V0SWQ7XG4gIHB1YmxpYyB0YXJnZXQ7XG4gIHB1YmxpYyBzdXBwb3J0ZWRDaGlsZHJlbjogQXJyYXk8Q2hpbGQ+ID0gbmV3IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSgpLmRlZmF1bHRTdXBwb3J0ZWRDaGlsZHJlbjtcblxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aGlzLnRhcmdldElkID0gcm91dGUuc25hcHNob3QucGFyYW1zWydjaGlsZCddO1xuICAgIGZvciAobGV0IGkgb2YgdGhpcy5zdXBwb3J0ZWRDaGlsZHJlbikge1xuICAgICAgY29uc29sZS5sb2coaSwgdGhpcy50YXJnZXRJZClcbiAgICAgIGlmIChpLmlkID09IHRoaXMudGFyZ2V0SWQpIHtcbiAgICAgICAgdGhpcy50YXJnZXQgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0SWQpXG4gIH1cbn1cbiJdfQ==