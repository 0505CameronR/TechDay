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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50bnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL1R1bWFpbmlGdW5kL2FwcC9hcHAvc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZC9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50LnRucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBaUQ7QUFDakQsaUhBQTBHO0FBTzFHO0lBS0UsaUNBQVksS0FBcUI7UUFGMUIsc0JBQWlCLEdBQWtCLElBQUkseURBQXdCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQztRQUdoRyxJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9DLEtBQWEsVUFBc0IsRUFBdEIsS0FBQSxJQUFJLENBQUMsaUJBQWlCLEVBQXRCLGNBQXNCLEVBQXRCLElBQXNCLEVBQUM7WUFBaEMsSUFBSSxDQUFDLFNBQUE7WUFDUCxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7WUFDN0IsNEJBQTRCO1lBQzVCLElBQUk7WUFDSixxQkFBcUI7WUFDckIsSUFBSTtTQUNMO0lBQ0YsQ0FBQztJQUVGLDBDQUFRLEdBQVI7UUFDRSxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUM1QixDQUFDO0lBbEJVLHVCQUF1QjtRQUxuQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO1NBQy9DLENBQUM7eUNBTW1CLHVCQUFjO09BTHRCLHVCQUF1QixDQW1CbkM7SUFBRCw4QkFBQztDQUFBLEFBbkJELElBbUJDO0FBbkJZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZHJlblNlcnZpY2UgfSBmcm9tICcuLi8uLi9zaGFyZWQvc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZHJlbi5zZXJ2aWNlLnRucyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zdXBwb3J0ZWQtY2hpbGQnLFxuICB0ZW1wbGF0ZVVybDogJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHB1YmxpYyB0YXJnZXRJZDtcbiAgcHVibGljIHRhcmdldDtcbiAgcHVibGljIHN1cHBvcnRlZENoaWxkcmVuOiBBcnJheTxPYmplY3Q+ID0gbmV3IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSgpLmRlZmF1bHRTdXBwb3J0ZWRDaGlsZHJlbjtcblxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aGlzLnRhcmdldElkID0gcm91dGUuc25hcHNob3QucGFyYW1zWydjaGlsZCddO1xuICAgIGZvcihsZXQgaSBvZiB0aGlzLnN1cHBvcnRlZENoaWxkcmVuKXtcbiAgICAgIGNvbnNvbGUubG9nKGksIHRoaXMudGFyZ2V0SWQpXG4gICAgICAvLyBpZihpLmlkID09IHRoaXMudGFyZ2V0SWQpXG4gICAgICAvLyB7XG4gICAgICAvLyAgIHRoaXMudGFyZ2V0ID0gaTtcbiAgICAgIC8vIH1cbiAgICB9XG4gICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gICAgY29uc29sZS5sb2codGhpcy50YXJnZXRJZClcbiAgfVxufVxuIl19