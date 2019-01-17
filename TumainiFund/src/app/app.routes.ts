import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';

export const routes: Routes = [
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
  },
];
