"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var supported_children_service_tns_1 = require("../../shared/supported-children/supported-children.service.tns");
var SupportedChildComponent = /** @class */ (function () {
    function SupportedChildComponent(route) {
        this.supportedChildren = new supported_children_service_tns_1.SupportedChildrenService().defaultSupportedChildren;
        this.targetId = route.snapshot.params['child'];
        for (var _i = 0, _a = this.supportedChildren; _i < _a.length; _i++) {
            var i = _a[_i];
            console.log(i, this.targetId);
            // if(i.id == this.targetId)
            // {
            //   this.target = i;
            // }
        }
    }
    SupportedChildComponent.prototype.ngOnInit = function () {
        console.log(this.targetId);
    };
    SupportedChildComponent = __decorate([
        core_1.Component({
            selector: 'app-supported-child',
            templateUrl: './supported-child.component.html',
            styleUrls: ['./supported-child.component.css']
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute])
    ], SupportedChildComponent);
    return SupportedChildComponent;
}());
exports.SupportedChildComponent = SupportedChildComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50bnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBwL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGQvc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50bnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQWlEO0FBQ2pELGlIQUEwRztBQVExRztJQUtFLGlDQUFZLEtBQXFCO1FBRjFCLHNCQUFpQixHQUFpQixJQUFJLHlEQUF3QixFQUFFLENBQUMsd0JBQXdCLENBQUM7UUFHL0YsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQyxLQUFhLFVBQXNCLEVBQXRCLEtBQUEsSUFBSSxDQUFDLGlCQUFpQixFQUF0QixjQUFzQixFQUF0QixJQUFzQixFQUFDO1lBQWhDLElBQUksQ0FBQyxTQUFBO1lBQ1AsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzdCLDRCQUE0QjtZQUM1QixJQUFJO1lBQ0oscUJBQXFCO1lBQ3JCLElBQUk7U0FDTDtJQUNGLENBQUM7SUFFRiwwQ0FBUSxHQUFSO1FBQ0UsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDNUIsQ0FBQztJQWxCVSx1QkFBdUI7UUFMbkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxTQUFTLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztTQUMvQyxDQUFDO3lDQU1tQix1QkFBYztPQUx0Qix1QkFBdUIsQ0FtQm5DO0lBQUQsOEJBQUM7Q0FBQSxBQW5CRCxJQW1CQztBQW5CWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2hhcmVkL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGRyZW4uc2VydmljZS50bnMnO1xuaW1wb3J0IHsgQ2hpbGQgfSBmcm9tICd+L2FwcC9zaGFyZWQvc3VwcG9ydGVkLWNoaWxkcmVuL2NoaWxkLm1vZGVsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXN1cHBvcnRlZC1jaGlsZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFN1cHBvcnRlZENoaWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHVibGljIHRhcmdldElkO1xuICBwdWJsaWMgdGFyZ2V0O1xuICBwdWJsaWMgc3VwcG9ydGVkQ2hpbGRyZW46IEFycmF5PENoaWxkPiA9IG5ldyBTdXBwb3J0ZWRDaGlsZHJlblNlcnZpY2UoKS5kZWZhdWx0U3VwcG9ydGVkQ2hpbGRyZW47XG5cbiAgY29uc3RydWN0b3Iocm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgdGhpcy50YXJnZXRJZCA9IHJvdXRlLnNuYXBzaG90LnBhcmFtc1snY2hpbGQnXTtcbiAgICBmb3IobGV0IGkgb2YgdGhpcy5zdXBwb3J0ZWRDaGlsZHJlbil7XG4gICAgICBjb25zb2xlLmxvZyhpLCB0aGlzLnRhcmdldElkKVxuICAgICAgLy8gaWYoaS5pZCA9PSB0aGlzLnRhcmdldElkKVxuICAgICAgLy8ge1xuICAgICAgLy8gICB0aGlzLnRhcmdldCA9IGk7XG4gICAgICAvLyB9XG4gICAgfVxuICAgfVxuXG4gIG5nT25Jbml0KCkge1xuICAgIGNvbnNvbGUubG9nKHRoaXMudGFyZ2V0SWQpXG4gIH1cbn1cbiJdfQ==