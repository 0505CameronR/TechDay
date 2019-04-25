import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SupportedChildrenComponent } from './supported-children/supported-children.component';
import { SupportedChildComponent } from './supported-child/supported-child.component';
import { HeadOfFamilyComponent } from './head-of-family/head-of-family.component';
import { HeadsOfFamilyComponent } from './heads-of-family/heads-of-family.component';
export const routes = [
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
    {
        path: 'supported-children',
        component: SupportedChildrenComponent,
    },
    {
        path: 'supported-child/:child',
        component: SupportedChildComponent,
    },
    {
        path: 'heads-of-family',
        component: HeadsOfFamilyComponent,
    },
    {
        path: 'head-of-family',
        component: HeadOfFamilyComponent,
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBQ3RGLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLDJDQUEyQyxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLDZDQUE2QyxDQUFBO0FBRXBGLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBVztJQUMxQjtRQUNJLElBQUksRUFBRSxFQUFFO1FBQ1IsVUFBVSxFQUFFLFVBQVU7UUFDdEIsU0FBUyxFQUFFLE1BQU07S0FDcEI7SUFDRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLGFBQWE7S0FDM0I7SUFDRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsU0FBUyxFQUFFLGVBQWU7S0FDN0I7SUFDRDtRQUNJLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsU0FBUyxFQUFFLDBCQUEwQjtLQUN4QztJQUNEO1FBQ0ksSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixTQUFTLEVBQUUsdUJBQXVCO0tBQ3JDO0lBQ0E7UUFDSSxJQUFJLEVBQUUsaUJBQWlCO1FBQ3ZCLFNBQVMsRUFBRSxzQkFBc0I7S0FDcEM7SUFDRDtRQUNJLElBQUksRUFBRSxnQkFBZ0I7UUFDdEIsU0FBUyxFQUFFLHFCQUFxQjtLQUNuQztJQUNGOzs7OztPQUtHO0lBQ0g7Ozs7O09BS0c7SUFDSDs7Ozs7T0FLRztJQUNIOzs7OztPQUtHO0NBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2hvbWUvaG9tZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2lnbkluQ29tcG9uZW50IH0gZnJvbSAnLi9zaWduLWluL3NpZ24taW4uY29tcG9uZW50JztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZE9mRmFtaWx5Q29tcG9uZW50IH0gZnJvbSAnLi9oZWFkLW9mLWZhbWlseS9oZWFkLW9mLWZhbWlseS5jb21wb25lbnQnO1xuaW1wb3J0IHsgSGVhZHNPZkZhbWlseUNvbXBvbmVudCB9IGZyb20gJy4vaGVhZHMtb2YtZmFtaWx5L2hlYWRzLW9mLWZhbWlseS5jb21wb25lbnQnXG5cbmV4cG9ydCBjb25zdCByb3V0ZXM6IFJvdXRlcyA9IFtcbiAgICB7XG4gICAgICAgIHBhdGg6ICcnLFxuICAgICAgICByZWRpcmVjdFRvOiAnL3NpZ24taW4nLFxuICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJ2hvbWUnLFxuICAgICAgICBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdzaWduLWluJyxcbiAgICAgICAgY29tcG9uZW50OiBTaWduSW5Db21wb25lbnQsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdzdXBwb3J0ZWQtY2hpbGRyZW4nLFxuICAgICAgICBjb21wb25lbnQ6IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnc3VwcG9ydGVkLWNoaWxkLzpjaGlsZCcsXG4gICAgICAgIGNvbXBvbmVudDogU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQsXG4gICAgfSxcbiAgICAge1xuICAgICAgICAgcGF0aDogJ2hlYWRzLW9mLWZhbWlseScsXG4gICAgICAgICBjb21wb25lbnQ6IEhlYWRzT2ZGYW1pbHlDb21wb25lbnQsXG4gICAgIH0sXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdoZWFkLW9mLWZhbWlseScsXG4gICAgICAgICBjb21wb25lbnQ6IEhlYWRPZkZhbWlseUNvbXBvbmVudCxcbiAgICAgfVxuICAgIC8qXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdzcG9uc29ycycsXG4gICAgICAgICBjb21wb25lbnQ6IFNwb25zb3JzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3NjaG9vbHMnLFxuICAgICAgICAgY29tcG9uZW50OiBTY2hvb2xzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3BhcmlzaC13b3JrZXJzJyxcbiAgICAgICAgIGNvbXBvbmVudDogUGFyaXNoV29ya2Vyc0NvbXBvbmVudCxcbiAgICAgfVxuICAgICAqL1xuICAgIC8qXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdhc3NpZ25lZC1vZmZpY2VzJyxcbiAgICAgICAgIGNvbXBvbmVudDogQXNzaWduZWRPZmZpY2VzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG5dO1xuIl19