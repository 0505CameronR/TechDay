"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var home_component_1 = require("./home/home.component");
var sign_in_component_1 = require("./sign-in/sign-in.component");
var kinvey_angular2_sdk_1 = require("kinvey-angular2-sdk");
var supported_children_component_1 = require("./supported-children/supported-children.component");
var supported_child_component_1 = require("./supported-children/supported-child/supported-child.component");
kinvey_angular2_sdk_1.Kinvey.init({
    appKey: 'kid_S1kLDRkz4',
    appSecret: '8e61bc7074b744d7995c2c51042c9890'
});
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                sign_in_component_1.SignInComponent,
                supported_children_component_1.SupportedChildrenComponent,
                supported_child_component_1.SupportedChildComponent,
            ],
            imports: [
                platform_browser_1.BrowserModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.FormsModule,
            ],
            providers: [],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvYnVpbGQvYXJjaGl2ZS9UdW1haW5pRnVuZC54Y2FyY2hpdmUvUHJvZHVjdHMvQXBwbGljYXRpb25zL1R1bWFpbmlGdW5kLmFwcC9hcHAvYXBwL2FwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7QUFBQSxzQ0FBeUM7QUFDekMsOERBQTBEO0FBQzFELHdDQUE2QztBQUU3QywyREFBd0Q7QUFDeEQsaURBQStDO0FBQy9DLHdEQUFzRDtBQUN0RCxpRUFBOEQ7QUFFOUQsMkRBQTZDO0FBQzdDLGtHQUErRjtBQUMvRiw0R0FBeUc7QUFFekcsNEJBQU0sQ0FBQyxJQUFJLENBQUM7SUFDUixNQUFNLEVBQUUsZUFBZTtJQUN2QixTQUFTLEVBQUUsa0NBQWtDO0NBQ2hELENBQUMsQ0FBQztBQW1CSDtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBakJyQixlQUFRLENBQUM7WUFDUixZQUFZLEVBQUU7Z0JBQ1osNEJBQVk7Z0JBQ1osOEJBQWE7Z0JBQ2IsbUNBQWU7Z0JBQ2YseURBQTBCO2dCQUMxQixtREFBdUI7YUFDeEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ1AsZ0NBQWE7Z0JBQ2IscUNBQWdCO2dCQUNoQixtQkFBVzthQUNaO1lBQ0QsU0FBUyxFQUFFLEVBQ1Y7WUFDRCxTQUFTLEVBQUUsQ0FBQyw0QkFBWSxDQUFDO1NBQzFCLENBQUM7T0FDVyxTQUFTLENBQUk7SUFBRCxnQkFBQztDQUFBLEFBQTFCLElBQTBCO0FBQWIsOEJBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tICcuL2FwcC1yb3V0aW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vaG9tZS9ob21lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWduSW5Db21wb25lbnQgfSBmcm9tICcuL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBLaW52ZXkgfSBmcm9tICdraW52ZXktYW5ndWxhcjItc2RrJztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZC9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50JztcblxuS2ludmV5LmluaXQoe1xuICAgIGFwcEtleTogJ2tpZF9TMWtMRFJrejQnLFxuICAgIGFwcFNlY3JldDogJzhlNjFiYzcwNzRiNzQ0ZDc5OTVjMmM1MTA0MmM5ODkwJ1xufSk7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFwcENvbXBvbmVudCxcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIFNpZ25JbkNvbXBvbmVudCxcbiAgICBTdXBwb3J0ZWRDaGlsZHJlbkNvbXBvbmVudCxcbiAgICBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gIF0sXG4gIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfVxuXG4iXX0=