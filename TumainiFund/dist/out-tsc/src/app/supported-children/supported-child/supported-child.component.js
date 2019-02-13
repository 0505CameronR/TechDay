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
var SupportedChildComponent = /** @class */ (function () {
    function SupportedChildComponent(route) {
        this.target = route.snapshot.params['child'];
    }
    SupportedChildComponent.prototype.ngOnInit = function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9hcHAvc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZC9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQU9qRDtJQUdFLGlDQUFZLEtBQXFCO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVGLDBDQUFRLEdBQVI7SUFDQSxDQUFDO0lBUlUsdUJBQXVCO1FBTG5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0MsU0FBUyxFQUFFLENBQUMsaUNBQWlDLENBQUM7U0FDL0MsQ0FBQzt5Q0FJbUIsdUJBQWM7T0FIdEIsdUJBQXVCLENBVW5DO0lBQUQsOEJBQUM7Q0FBQSxBQVZELElBVUM7QUFWWSwwREFBdUIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQWN0aXZhdGVkUm91dGUgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdhcHAtc3VwcG9ydGVkLWNoaWxkJyxcbiAgdGVtcGxhdGVVcmw6ICcuL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQuaHRtbCcsXG4gIHN0eWxlVXJsczogWycuL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQuY3NzJ11cbn0pXG5leHBvcnQgY2xhc3MgU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICBwdWJsaWMgdGFyZ2V0O1xuXG4gIGNvbnN0cnVjdG9yKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgIHRoaXMudGFyZ2V0ID0gcm91dGUuc25hcHNob3QucGFyYW1zWydjaGlsZCddO1xuICAgfVxuXG4gIG5nT25Jbml0KCkge1xuICB9XG5cbn1cbiJdfQ==