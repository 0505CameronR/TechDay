"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var home_component_1 = require("./home/home.component");
var sign_in_component_1 = require("./sign-in/sign-in.component");
exports.routes = [
    {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: home_component_1.HomeComponent,
    },
    {
        path: 'sign-in',
        component: sign_in_component_1.SignInComponent,
    },
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9hcHAvYXBwLnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHdEQUFzRDtBQUN0RCxpRUFBOEQ7QUFFakQsUUFBQSxNQUFNLEdBQVc7SUFDNUI7UUFDSSxJQUFJLEVBQUUsRUFBRTtRQUNSLFVBQVUsRUFBRSxVQUFVO1FBQ3RCLFNBQVMsRUFBRSxNQUFNO0tBQ3BCO0lBQ0Q7UUFDSSxJQUFJLEVBQUUsTUFBTTtRQUNaLFNBQVMsRUFBRSw4QkFBYTtLQUMzQjtJQUNEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixTQUFTLEVBQUUsbUNBQWU7S0FDN0I7Q0FDRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vaG9tZS9ob21lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWduSW5Db21wb25lbnQgfSBmcm9tICcuL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQnO1xuXG5leHBvcnQgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXG4gIHtcbiAgICAgIHBhdGg6ICcnLFxuICAgICAgcmVkaXJlY3RUbzogJy9zaWduLWluJyxcbiAgICAgIHBhdGhNYXRjaDogJ2Z1bGwnLFxuICB9LFxuICB7XG4gICAgICBwYXRoOiAnaG9tZScsXG4gICAgICBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQsXG4gIH0sXG4gIHtcbiAgICAgIHBhdGg6ICdzaWduLWluJyxcbiAgICAgIGNvbXBvbmVudDogU2lnbkluQ29tcG9uZW50LFxuICB9LFxuXTtcbiJdfQ==