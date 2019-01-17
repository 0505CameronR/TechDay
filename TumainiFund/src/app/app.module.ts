import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';

import { Kinvey } from 'kinvey-angular2-sdk';

Kinvey.init({
    appKey: 'kid_S1kLDRkz4',
    appSecret: '8e61bc7074b744d7995c2c51042c9890'
});

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
