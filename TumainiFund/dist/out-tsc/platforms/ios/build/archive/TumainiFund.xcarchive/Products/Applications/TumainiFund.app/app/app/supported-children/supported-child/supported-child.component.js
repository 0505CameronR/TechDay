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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvYXBwL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGQvc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLHNDQUFrRDtBQUNsRCwwQ0FBaUQ7QUFPakQ7SUFHRSxpQ0FBWSxLQUFxQjtRQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRiwwQ0FBUSxHQUFSO0lBQ0EsQ0FBQztJQVJVLHVCQUF1QjtRQUxuQyxnQkFBUyxDQUFDO1lBQ1QsUUFBUSxFQUFFLHFCQUFxQjtZQUMvQixXQUFXLEVBQUUsa0NBQWtDO1lBQy9DLFNBQVMsRUFBRSxDQUFDLGlDQUFpQyxDQUFDO1NBQy9DLENBQUM7eUNBSW1CLHVCQUFjO09BSHRCLHVCQUF1QixDQVVuQztJQUFELDhCQUFDO0NBQUEsQUFWRCxJQVVDO0FBVlksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXN1cHBvcnRlZC1jaGlsZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFN1cHBvcnRlZENoaWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHVibGljIHRhcmdldDtcblxuICBjb25zdHJ1Y3Rvcihyb3V0ZTogQWN0aXZhdGVkUm91dGUpIHtcbiAgICB0aGlzLnRhcmdldCA9IHJvdXRlLnNuYXBzaG90LnBhcmFtc1snY2hpbGQnXTtcbiAgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgfVxuXG59XG4iXX0=