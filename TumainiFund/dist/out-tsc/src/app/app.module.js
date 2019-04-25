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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLm1vZHVsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLm1vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pDLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFN0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFOUQsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQzdDLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3JGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBRWxGLE1BQU0sQ0FBQyxJQUFJLENBQUM7SUFDUixNQUFNLEVBQUUsZUFBZTtJQUN2QixTQUFTLEVBQUUsa0NBQWtDO0NBQ2hELENBQUMsQ0FBQztBQXFCSCxJQUFhLFNBQVMsR0FBdEIsTUFBYSxTQUFTO0NBQUksQ0FBQTtBQUFiLFNBQVM7SUFuQnJCLFFBQVEsQ0FBQztRQUNSLFlBQVksRUFBRTtZQUNaLFlBQVk7WUFDWixhQUFhO1lBQ2IsZUFBZTtZQUNmLDBCQUEwQjtZQUMxQix1QkFBdUI7WUFDdkIscUJBQXFCO1lBQ3ZCLHNCQUFzQjtTQUNyQjtRQUNELE9BQU8sRUFBRTtZQUNQLGFBQWE7WUFDYixnQkFBZ0I7WUFDaEIsV0FBVztTQUNaO1FBQ0QsU0FBUyxFQUFFLEVBQ1Y7UUFDRCxTQUFTLEVBQUUsQ0FBQyxZQUFZLENBQUM7S0FDMUIsQ0FBQztHQUNXLFNBQVMsQ0FBSTtTQUFiLFNBQVMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBOZ01vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQnJvd3Nlck1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXInO1xuaW1wb3J0IHsgRm9ybXNNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5cbmltcG9ydCB7IEFwcFJvdXRpbmdNb2R1bGUgfSBmcm9tICcuL2FwcC1yb3V0aW5nLm1vZHVsZSc7XG5pbXBvcnQgeyBBcHBDb21wb25lbnQgfSBmcm9tICcuL2FwcC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vaG9tZS9ob21lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWduSW5Db21wb25lbnQgfSBmcm9tICcuL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBLaW52ZXkgfSBmcm9tICdraW52ZXktYW5ndWxhcjItc2RrJztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZHNPZkZhbWlseUNvbXBvbmVudCB9IGZyb20gJy4vaGVhZHMtb2YtZmFtaWx5L2hlYWRzLW9mLWZhbWlseS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZE9mRmFtaWx5Q29tcG9uZW50IH0gZnJvbSAnLi9oZWFkLW9mLWZhbWlseS9oZWFkLW9mLWZhbWlseS5jb21wb25lbnQnO1xuXG5LaW52ZXkuaW5pdCh7XG4gICAgYXBwS2V5OiAna2lkX1Mxa0xEUmt6NCcsXG4gICAgYXBwU2VjcmV0OiAnOGU2MWJjNzA3NGI3NDRkNzk5NWMyYzUxMDQyYzk4OTAnXG59KTtcblxuQE5nTW9kdWxlKHtcbiAgZGVjbGFyYXRpb25zOiBbXG4gICAgQXBwQ29tcG9uZW50LFxuICAgIEhvbWVDb21wb25lbnQsXG4gICAgU2lnbkluQ29tcG9uZW50LFxuICAgIFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50LFxuICAgIFN1cHBvcnRlZENoaWxkQ29tcG9uZW50LFxuICAgIEhlYWRPZkZhbWlseUNvbXBvbmVudCxcblx0XHRIZWFkc09mRmFtaWx5Q29tcG9uZW50LFxuICBdLFxuICBpbXBvcnRzOiBbXG4gICAgQnJvd3Nlck1vZHVsZSxcbiAgICBBcHBSb3V0aW5nTW9kdWxlLFxuICAgIEZvcm1zTW9kdWxlLFxuICBdLFxuICBwcm92aWRlcnM6IFtcbiAgXSxcbiAgYm9vdHN0cmFwOiBbQXBwQ29tcG9uZW50XVxufSlcbmV4cG9ydCBjbGFzcyBBcHBNb2R1bGUgeyB9Il19