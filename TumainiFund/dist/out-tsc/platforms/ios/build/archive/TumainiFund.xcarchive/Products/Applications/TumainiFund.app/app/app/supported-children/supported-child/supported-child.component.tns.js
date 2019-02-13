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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudC50bnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9wbGF0Zm9ybXMvaW9zL2J1aWxkL2FyY2hpdmUvVHVtYWluaUZ1bmQueGNhcmNoaXZlL1Byb2R1Y3RzL0FwcGxpY2F0aW9ucy9UdW1haW5pRnVuZC5hcHAvYXBwL2FwcC9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQudG5zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsc0NBQWtEO0FBQ2xELDBDQUFpRDtBQUNqRCxpSEFBMEc7QUFPMUc7SUFLRSxpQ0FBWSxLQUFxQjtRQUYxQixzQkFBaUIsR0FBa0IsSUFBSSx5REFBd0IsRUFBRSxDQUFDLHdCQUF3QixDQUFDO1FBR2hHLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsS0FBYSxVQUFzQixFQUF0QixLQUFBLElBQUksQ0FBQyxpQkFBaUIsRUFBdEIsY0FBc0IsRUFBdEIsSUFBc0IsRUFBQztZQUFoQyxJQUFJLENBQUMsU0FBQTtZQUNQLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM3Qiw0QkFBNEI7WUFDNUIsSUFBSTtZQUNKLHFCQUFxQjtZQUNyQixJQUFJO1NBQ0w7SUFDRixDQUFDO0lBRUYsMENBQVEsR0FBUjtRQUNFLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzVCLENBQUM7SUFsQlUsdUJBQXVCO1FBTG5DLGdCQUFTLENBQUM7WUFDVCxRQUFRLEVBQUUscUJBQXFCO1lBQy9CLFdBQVcsRUFBRSxrQ0FBa0M7WUFDL0MsU0FBUyxFQUFFLENBQUMsaUNBQWlDLENBQUM7U0FDL0MsQ0FBQzt5Q0FNbUIsdUJBQWM7T0FMdEIsdUJBQXVCLENBbUJuQztJQUFELDhCQUFDO0NBQUEsQUFuQkQsSUFtQkM7QUFuQlksMERBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEFjdGl2YXRlZFJvdXRlIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuU2VydmljZSB9IGZyb20gJy4uLy4uL3NoYXJlZC9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLnNlcnZpY2UudG5zJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnYXBwLXN1cHBvcnRlZC1jaGlsZCcsXG4gIHRlbXBsYXRlVXJsOiAnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50Lmh0bWwnLFxuICBzdHlsZVVybHM6IFsnLi9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50LmNzcyddXG59KVxuZXhwb3J0IGNsYXNzIFN1cHBvcnRlZENoaWxkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgcHVibGljIHRhcmdldElkO1xuICBwdWJsaWMgdGFyZ2V0O1xuICBwdWJsaWMgc3VwcG9ydGVkQ2hpbGRyZW46IEFycmF5PE9iamVjdD4gPSBuZXcgU3VwcG9ydGVkQ2hpbGRyZW5TZXJ2aWNlKCkuZGVmYXVsdFN1cHBvcnRlZENoaWxkcmVuO1xuXG4gIGNvbnN0cnVjdG9yKHJvdXRlOiBBY3RpdmF0ZWRSb3V0ZSkge1xuICAgIHRoaXMudGFyZ2V0SWQgPSByb3V0ZS5zbmFwc2hvdC5wYXJhbXNbJ2NoaWxkJ107XG4gICAgZm9yKGxldCBpIG9mIHRoaXMuc3VwcG9ydGVkQ2hpbGRyZW4pe1xuICAgICAgY29uc29sZS5sb2coaSwgdGhpcy50YXJnZXRJZClcbiAgICAgIC8vIGlmKGkuaWQgPT0gdGhpcy50YXJnZXRJZClcbiAgICAgIC8vIHtcbiAgICAgIC8vICAgdGhpcy50YXJnZXQgPSBpO1xuICAgICAgLy8gfVxuICAgIH1cbiAgIH1cblxuICBuZ09uSW5pdCgpIHtcbiAgICBjb25zb2xlLmxvZyh0aGlzLnRhcmdldElkKVxuICB9XG59XG4iXX0=