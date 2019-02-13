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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFOUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBRXRGLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDUixNQUFNLEVBQUUsZUFBZTtJQUN2QixTQUFTLEVBQUUsa0NBQWtDO0NBQ2hELENBQUMsQ0FBQztBQW1CSCxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO0NBQUksQ0FBQTtBQUFiLFNBQVM7SUFqQnJCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLFlBQVk7WUFDWixhQUFhO1lBQ2IsZUFBZTtZQUNmLDBCQUEwQjtZQUMxQix1QkFBdUI7U0FDeEI7UUFDRCxPQUFPLEVBQUU7WUFDUCxhQUFhO1lBQ2IsZ0JBQWdCO1lBQ2hCLFdBQVc7U0FDWjtRQUNELFNBQVMsRUFBRSxFQUNWO1FBQ0QsU0FBUyxFQUFFLENBQUMsWUFBWSxDQUFDO0tBQzFCLENBQUM7R0FDVyxTQUFTLENBQUk7U0FBYixTQUFTIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJyb3dzZXJNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuXG5pbXBvcnQgeyBBcHBSb3V0aW5nTW9kdWxlIH0gZnJvbSAnLi9hcHAtcm91dGluZy5tb2R1bGUnO1xuaW1wb3J0IHsgQXBwQ29tcG9uZW50IH0gZnJvbSAnLi9hcHAuY29tcG9uZW50JztcbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2hvbWUvaG9tZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2lnbkluQ29tcG9uZW50IH0gZnJvbSAnLi9zaWduLWluL3NpZ24taW4uY29tcG9uZW50JztcblxuaW1wb3J0IHsgS2ludmV5IH0gZnJvbSAna2ludmV5LWFuZ3VsYXIyLXNkayc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZHJlbkNvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZHJlbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQgfSBmcm9tICcuL3N1cHBvcnRlZC1jaGlsZC9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50JztcblxuS2ludmV5LmluaXQoe1xuICAgIGFwcEtleTogJ2tpZF9TMWtMRFJrejQnLFxuICAgIGFwcFNlY3JldDogJzhlNjFiYzcwNzRiNzQ0ZDc5OTVjMmM1MTA0MmM5ODkwJ1xufSk7XG5cbkBOZ01vZHVsZSh7XG4gIGRlY2xhcmF0aW9uczogW1xuICAgIEFwcENvbXBvbmVudCxcbiAgICBIb21lQ29tcG9uZW50LFxuICAgIFNpZ25JbkNvbXBvbmVudCxcbiAgICBTdXBwb3J0ZWRDaGlsZHJlbkNvbXBvbmVudCxcbiAgICBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCxcbiAgXSxcbiAgaW1wb3J0czogW1xuICAgIEJyb3dzZXJNb2R1bGUsXG4gICAgQXBwUm91dGluZ01vZHVsZSxcbiAgICBGb3Jtc01vZHVsZSxcbiAgXSxcbiAgcHJvdmlkZXJzOiBbXG4gIF0sXG4gIGJvb3RzdHJhcDogW0FwcENvbXBvbmVudF1cbn0pXG5leHBvcnQgY2xhc3MgQXBwTW9kdWxlIHsgfSJdfQ==