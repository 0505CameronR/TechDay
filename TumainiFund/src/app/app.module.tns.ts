import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { Kinvey } from 'kinvey-nativescript-sdk';
import { Feedback } from 'nativescript-feedback';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';

Kinvey.init({
	appKey: 'kid_S1kLDRkz4',
	appSecret: '8e61bc7074b744d7995c2c51042c9890'
});

// Uncomment and add to NgModule imports  if you need to use the HTTP wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';


@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		SignInComponent,
	],
	imports: [
		NativeScriptModule,
		AppRoutingModule,
		NativeScriptFormsModule,
		NativeScriptUISideDrawerModule,
	],
	providers: [],
	bootstrap: [AppComponent],
	schemas: [NO_ERRORS_SCHEMA]
})
export class AppModule { }
