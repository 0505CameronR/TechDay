import { HomeComponent } from './home/home.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { SupportedChildrenComponent } from './supported-children/supported-children.component';
import { SupportedChildComponent } from './supported-child/supported-child.component';
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
    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL2FwcC9hcHAucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDL0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFHdEYsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFXO0lBQzFCO1FBQ0ksSUFBSSxFQUFFLEVBQUU7UUFDUixVQUFVLEVBQUUsVUFBVTtRQUN0QixTQUFTLEVBQUUsTUFBTTtLQUNwQjtJQUNEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixTQUFTLEVBQUUsYUFBYTtLQUMzQjtJQUNEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixTQUFTLEVBQUUsZUFBZTtLQUM3QjtJQUNEO1FBQ0ksSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixTQUFTLEVBQUUsMEJBQTBCO0tBQ3hDO0lBQ0Q7UUFDSSxJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLFNBQVMsRUFBRSx1QkFBdUI7S0FDckM7SUFDRDs7Ozs7T0FLRztJQUNIOzs7OztPQUtHO0lBQ0g7Ozs7O09BS0c7SUFDSDs7Ozs7T0FLRztJQUNIOzs7OztPQUtHO0NBQ04sQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFJvdXRlcyB9IGZyb20gJ0Bhbmd1bGFyL3JvdXRlcic7XG5cbmltcG9ydCB7IEhvbWVDb21wb25lbnQgfSBmcm9tICcuL2hvbWUvaG9tZS5jb21wb25lbnQnO1xuaW1wb3J0IHsgU2lnbkluQ29tcG9uZW50IH0gZnJvbSAnLi9zaWduLWluL3NpZ24taW4uY29tcG9uZW50JztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGRyZW4vc3VwcG9ydGVkLWNoaWxkcmVuLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkL3N1cHBvcnRlZC1jaGlsZC5jb21wb25lbnQnO1xuXG5cbmV4cG9ydCBjb25zdCByb3V0ZXM6IFJvdXRlcyA9IFtcbiAgICB7XG4gICAgICAgIHBhdGg6ICcnLFxuICAgICAgICByZWRpcmVjdFRvOiAnL3NpZ24taW4nLFxuICAgICAgICBwYXRoTWF0Y2g6ICdmdWxsJyxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJ2hvbWUnLFxuICAgICAgICBjb21wb25lbnQ6IEhvbWVDb21wb25lbnQsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdzaWduLWluJyxcbiAgICAgICAgY29tcG9uZW50OiBTaWduSW5Db21wb25lbnQsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdzdXBwb3J0ZWQtY2hpbGRyZW4nLFxuICAgICAgICBjb21wb25lbnQ6IFN1cHBvcnRlZENoaWxkcmVuQ29tcG9uZW50LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnc3VwcG9ydGVkLWNoaWxkLzpjaGlsZCcsXG4gICAgICAgIGNvbXBvbmVudDogU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQsXG4gICAgfVxuICAgIC8qXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdoZWFkcy1vZi1mYW1pbHknLFxuICAgICAgICAgY29tcG9uZW50OiBIZWFkc09mRmFtaWx5Q29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3Nwb25zb3JzJyxcbiAgICAgICAgIGNvbXBvbmVudDogU3BvbnNvcnNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbiAgICAvKlxuICAgICB7XG4gICAgICAgICBwYXRoOiAnc2Nob29scycsXG4gICAgICAgICBjb21wb25lbnQ6IFNjaG9vbHNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbiAgICAvKlxuICAgICB7XG4gICAgICAgICBwYXRoOiAncGFyaXNoLXdvcmtlcnMnLFxuICAgICAgICAgY29tcG9uZW50OiBQYXJpc2hXb3JrZXJzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ2Fzc2lnbmVkLW9mZmljZXMnLFxuICAgICAgICAgY29tcG9uZW50OiBBc3NpZ25lZE9mZmljZXNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbl07XG4iXX0=