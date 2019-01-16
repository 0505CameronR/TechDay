import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component.tns';
import { SignInComponent } from './sign-in/sign-in.component.tns';

const tnsRoutes: Routes = [
    {
        path: '',
        redirectTo: '/sign-in',
        pathMatch: 'full',
    },
    {
        path: 'home',
        component: HomeComponent,
    },
    {
        path: 'sign-in',
        component: SignInComponent,
    }
];

@NgModule({
    imports:[NativeScriptRouterModule.forRoot(tnsRoutes)],
    exports: [NativeScriptRouterModule]
})

export class AppRoutingModule {

}
