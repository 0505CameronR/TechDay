"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var nativescript_module_1 = require("nativescript-angular/nativescript.module");
var forms_1 = require("nativescript-angular/forms");
var http_1 = require("nativescript-angular/http");
var app_routing_module_1 = require("./app-routing.module");
var app_component_1 = require("./app.component");
var sign_in_component_1 = require("./sign-in/sign-in.component");
var home_component_1 = require("./home/home.component");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            bootstrap: [
                app_component_1.AppComponent
            ],
            imports: [
                nativescript_module_1.NativeScriptModule,
                app_routing_module_1.AppRoutingModule,
                forms_1.NativeScriptFormsModule,
                http_1.NativeScriptHttpModule
            ],
            declarations: [
                app_component_1.AppComponent,
                sign_in_component_1.SignInComponent,
                home_component_1.HomeComponent
            ],
            schemas: [
                core_1.NO_ERRORS_SCHEMA
            ]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBbUU7QUFDbkUsZ0ZBQThFO0FBQzlFLG9EQUFxRTtBQUNyRSxrREFBa0U7QUFFbEUsMkRBQXdEO0FBQ3hELGlEQUErQztBQUMvQyxpRUFBOEQ7QUFDOUQsd0RBQXNEO0FBcUJ0RDtJQUFBO0lBQXlCLENBQUM7SUFBYixTQUFTO1FBbkJyQixlQUFRLENBQUM7WUFDTixTQUFTLEVBQUU7Z0JBQ1AsNEJBQVk7YUFDZjtZQUNELE9BQU8sRUFBRTtnQkFDTCx3Q0FBa0I7Z0JBQ2xCLHFDQUFnQjtnQkFDaEIsK0JBQXVCO2dCQUN2Qiw2QkFBc0I7YUFDekI7WUFDRCxZQUFZLEVBQUU7Z0JBQ1YsNEJBQVk7Z0JBQ1osbUNBQWU7Z0JBQ2YsOEJBQWE7YUFDaEI7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsdUJBQWdCO2FBQ25CO1NBQ0osQ0FBQztPQUNXLFNBQVMsQ0FBSTtJQUFELGdCQUFDO0NBQUEsQUFBMUIsSUFBMEI7QUFBYiw4QkFBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlLCBOT19FUlJPUlNfU0NIRU1BLCBPbkluaXQgfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRNb2R1bGUgfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvbmF0aXZlc2NyaXB0Lm1vZHVsZVwiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSB9IGZyb20gXCJuYXRpdmVzY3JpcHQtYW5ndWxhci9mb3Jtc1wiO1xyXG5pbXBvcnQgeyBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlfSBmcm9tIFwibmF0aXZlc2NyaXB0LWFuZ3VsYXIvaHR0cFwiO1xyXG5cclxuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gXCIuL2FwcC1yb3V0aW5nLm1vZHVsZVwiO1xyXG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tIFwiLi9hcHAuY29tcG9uZW50XCI7XHJcbmltcG9ydCB7IFNpZ25JbkNvbXBvbmVudCB9IGZyb20gJy4vc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2hvbWUvaG9tZS5jb21wb25lbnQnO1xyXG5cclxuQE5nTW9kdWxlKHtcclxuICAgIGJvb3RzdHJhcDogW1xyXG4gICAgICAgIEFwcENvbXBvbmVudFxyXG4gICAgXSxcclxuICAgIGltcG9ydHM6IFtcclxuICAgICAgICBOYXRpdmVTY3JpcHRNb2R1bGUsXHJcbiAgICAgICAgQXBwUm91dGluZ01vZHVsZSxcclxuICAgICAgICBOYXRpdmVTY3JpcHRGb3Jtc01vZHVsZSxcclxuICAgICAgICBOYXRpdmVTY3JpcHRIdHRwTW9kdWxlXHJcbiAgICBdLFxyXG4gICAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICAgICAgQXBwQ29tcG9uZW50LFxyXG4gICAgICAgIFNpZ25JbkNvbXBvbmVudCxcclxuICAgICAgICBIb21lQ29tcG9uZW50XHJcbiAgICBdLFxyXG4gICAgc2NoZW1hczogW1xyXG4gICAgICAgIE5PX0VSUk9SU19TQ0hFTUFcclxuICAgIF1cclxufSlcclxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH1cclxuIl19