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
  /*
  {
      path: 'supported-children',
      component: SupportedChildrenComponent,
  }
  */
 /*
  {
      path: 'heads-of-family',
      component: HeadsOfFamilyComponent,
  }
  */
 /*
  {
      path: 'sponsors',
      component: SponsorsComponent,
  }
  */
 /*
  {
      path: 'schools',
      component: SchoolsComponent,
  }
  */
 /*
  {
      path: 'parish-workers',
      component: ParishWorkersComponent,
  }
  */
 /*
  {
      path: 'assigned-offices',
      component: AssignedOfficesComponent,
  }
  */
];
