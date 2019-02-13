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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL2FwcC9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxzQ0FBa0Q7QUFDbEQsMENBQWlEO0FBT2pEO0lBR0UsaUNBQVksS0FBcUI7UUFDL0IsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUYsMENBQVEsR0FBUjtJQUNBLENBQUM7SUFSVSx1QkFBdUI7UUFMbkMsZ0JBQVMsQ0FBQztZQUNULFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsV0FBVyxFQUFFLGtDQUFrQztZQUMvQyxTQUFTLEVBQUUsQ0FBQyxpQ0FBaUMsQ0FBQztTQUMvQyxDQUFDO3lDQUltQix1QkFBYztPQUh0Qix1QkFBdUIsQ0FVbkM7SUFBRCw4QkFBQztDQUFBLEFBVkQsSUFVQztBQVZZLDBEQUF1QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgT25Jbml0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ2FwcC1zdXBwb3J0ZWQtY2hpbGQnLFxuICB0ZW1wbGF0ZVVybDogJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5odG1sJyxcbiAgc3R5bGVVcmxzOiBbJy4vc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5jc3MnXVxufSlcbmV4cG9ydCBjbGFzcyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XG4gIHB1YmxpYyB0YXJnZXQ7XG5cbiAgY29uc3RydWN0b3Iocm91dGU6IEFjdGl2YXRlZFJvdXRlKSB7XG4gICAgdGhpcy50YXJnZXQgPSByb3V0ZS5zbmFwc2hvdC5wYXJhbXNbJ2NoaWxkJ107XG4gICB9XG5cbiAgbmdPbkluaXQoKSB7XG4gIH1cblxufVxuIl19