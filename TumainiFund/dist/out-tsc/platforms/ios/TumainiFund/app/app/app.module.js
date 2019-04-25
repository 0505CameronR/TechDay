var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { Kinvey } from 'kinvey-angular2-sdk';
import { SupportedChildrenComponent } from './supported-children/supported-children.component';
import { SupportedChildComponent } from './supported-child/supported-child.component';
import { HeadsOfFamilyComponent } from './heads-of-family/heads-of-family.component';
import { HeadOfFamilyComponent } from './head-of-family/head-of-family.component';
Kinvey.init({
    appKey: 'kid_S1kLDRkz4',
    appSecret: '8e61bc7074b744d7995c2c51042c9890'
});
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [
            AppComponent,
            HomeComponent,
            SignInComponent,
            SupportedChildrenComponent,
            SupportedChildComponent,
            HeadOfFamilyComponent,
            HeadsOfFamilyComponent,
        ],
        imports: [
            BrowserModule,
            AppRoutingModule,
            FormsModule,
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
], AppModule);
export { AppModule };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL2FwcC9hcHAubW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDekMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQzFELE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU3QyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUN4RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDN0MsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDL0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDckYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFFbEYsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNSLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLFNBQVMsRUFBRSxrQ0FBa0M7Q0FDaEQsQ0FBQyxDQUFDO0FBcUJILElBQWEsU0FBUyxHQUF0QixNQUFhLFNBQVM7Q0FBSSxDQUFBO0FBQWIsU0FBUztJQW5CckIsUUFBUSxDQUFDO1FBQ1IsWUFBWSxFQUFFO1lBQ1osWUFBWTtZQUNaLGFBQWE7WUFDYixlQUFlO1lBQ2YsMEJBQTBCO1lBQzFCLHVCQUF1QjtZQUN2QixxQkFBcUI7WUFDdkIsc0JBQXNCO1NBQ3JCO1FBQ0QsT0FBTyxFQUFFO1lBQ1AsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQixXQUFXO1NBQ1o7UUFDRCxTQUFTLEVBQUUsRUFDVjtRQUNELFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQztLQUMxQixDQUFDO0dBQ1csU0FBUyxDQUFJO1NBQWIsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBCcm93c2VyTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcblxuaW1wb3J0IHsgQXBwUm91dGluZ01vZHVsZSB9IGZyb20gJy4vYXBwLXJvdXRpbmcubW9kdWxlJztcbmltcG9ydCB7IEFwcENvbXBvbmVudCB9IGZyb20gJy4vYXBwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSAnLi9ob21lL2hvbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFNpZ25JbkNvbXBvbmVudCB9IGZyb20gJy4vc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IEtpbnZleSB9IGZyb20gJ2tpbnZleS1hbmd1bGFyMi1zZGsnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRyZW5Db21wb25lbnQgfSBmcm9tICcuL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGRyZW4uY29tcG9uZW50JztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGQvc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIZWFkc09mRmFtaWx5Q29tcG9uZW50IH0gZnJvbSAnLi9oZWFkcy1vZi1mYW1pbHkvaGVhZHMtb2YtZmFtaWx5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIZWFkT2ZGYW1pbHlDb21wb25lbnQgfSBmcm9tICcuL2hlYWQtb2YtZmFtaWx5L2hlYWQtb2YtZmFtaWx5LmNvbXBvbmVudCc7XG5cbktpbnZleS5pbml0KHtcbiAgICBhcHBLZXk6ICdraWRfUzFrTERSa3o0JyxcbiAgICBhcHBTZWNyZXQ6ICc4ZTYxYmM3MDc0Yjc0NGQ3OTk1YzJjNTEwNDJjOTg5MCdcbn0pO1xuXG5ATmdNb2R1bGUoe1xuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBBcHBDb21wb25lbnQsXG4gICAgSG9tZUNvbXBvbmVudCxcbiAgICBTaWduSW5Db21wb25lbnQsXG4gICAgU3VwcG9ydGVkQ2hpbGRyZW5Db21wb25lbnQsXG4gICAgU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQsXG4gICAgSGVhZE9mRmFtaWx5Q29tcG9uZW50LFxuXHRcdEhlYWRzT2ZGYW1pbHlDb21wb25lbnQsXG4gIF0sXG4gIGltcG9ydHM6IFtcbiAgICBCcm93c2VyTW9kdWxlLFxuICAgIEFwcFJvdXRpbmdNb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gIF0sXG4gIHByb3ZpZGVyczogW1xuICBdLFxuICBib290c3RyYXA6IFtBcHBDb21wb25lbnRdXG59KVxuZXhwb3J0IGNsYXNzIEFwcE1vZHVsZSB7IH0iXX0=