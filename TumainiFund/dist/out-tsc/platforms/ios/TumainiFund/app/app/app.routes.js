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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BsYXRmb3Jtcy9pb3MvVHVtYWluaUZ1bmQvYXBwL2FwcC9hcHAucm91dGVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUVBLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDOUQsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sbURBQW1ELENBQUM7QUFDL0YsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sNkNBQTZDLENBQUM7QUFDdEYsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sMkNBQTJDLENBQUM7QUFDbEYsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sNkNBQTZDLENBQUE7QUFFcEYsTUFBTSxDQUFDLE1BQU0sTUFBTSxHQUFXO0lBQzFCO1FBQ0ksSUFBSSxFQUFFLEVBQUU7UUFDUixVQUFVLEVBQUUsVUFBVTtRQUN0QixTQUFTLEVBQUUsTUFBTTtLQUNwQjtJQUNEO1FBQ0ksSUFBSSxFQUFFLE1BQU07UUFDWixTQUFTLEVBQUUsYUFBYTtLQUMzQjtJQUNEO1FBQ0ksSUFBSSxFQUFFLFNBQVM7UUFDZixTQUFTLEVBQUUsZUFBZTtLQUM3QjtJQUNEO1FBQ0ksSUFBSSxFQUFFLG9CQUFvQjtRQUMxQixTQUFTLEVBQUUsMEJBQTBCO0tBQ3hDO0lBQ0Q7UUFDSSxJQUFJLEVBQUUsd0JBQXdCO1FBQzlCLFNBQVMsRUFBRSx1QkFBdUI7S0FDckM7SUFDQTtRQUNJLElBQUksRUFBRSxpQkFBaUI7UUFDdkIsU0FBUyxFQUFFLHNCQUFzQjtLQUNwQztJQUNEO1FBQ0ksSUFBSSxFQUFFLGdCQUFnQjtRQUN0QixTQUFTLEVBQUUscUJBQXFCO0tBQ25DO0lBQ0Y7Ozs7O09BS0c7SUFDSDs7Ozs7T0FLRztJQUNIOzs7OztPQUtHO0lBQ0g7Ozs7O09BS0c7Q0FDTixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgUm91dGVzIH0gZnJvbSAnQGFuZ3VsYXIvcm91dGVyJztcblxuaW1wb3J0IHsgSG9tZUNvbXBvbmVudCB9IGZyb20gJy4vaG9tZS9ob21lLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTaWduSW5Db21wb25lbnQgfSBmcm9tICcuL3NpZ24taW4vc2lnbi1pbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRyZW5Db21wb25lbnQgfSBmcm9tICcuL3N1cHBvcnRlZC1jaGlsZHJlbi9zdXBwb3J0ZWQtY2hpbGRyZW4uY29tcG9uZW50JztcbmltcG9ydCB7IFN1cHBvcnRlZENoaWxkQ29tcG9uZW50IH0gZnJvbSAnLi9zdXBwb3J0ZWQtY2hpbGQvc3VwcG9ydGVkLWNoaWxkLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIZWFkT2ZGYW1pbHlDb21wb25lbnQgfSBmcm9tICcuL2hlYWQtb2YtZmFtaWx5L2hlYWQtb2YtZmFtaWx5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBIZWFkc09mRmFtaWx5Q29tcG9uZW50IH0gZnJvbSAnLi9oZWFkcy1vZi1mYW1pbHkvaGVhZHMtb2YtZmFtaWx5LmNvbXBvbmVudCdcblxuZXhwb3J0IGNvbnN0IHJvdXRlczogUm91dGVzID0gW1xuICAgIHtcbiAgICAgICAgcGF0aDogJycsXG4gICAgICAgIHJlZGlyZWN0VG86ICcvc2lnbi1pbicsXG4gICAgICAgIHBhdGhNYXRjaDogJ2Z1bGwnLFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnaG9tZScsXG4gICAgICAgIGNvbXBvbmVudDogSG9tZUNvbXBvbmVudCxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJ3NpZ24taW4nLFxuICAgICAgICBjb21wb25lbnQ6IFNpZ25JbkNvbXBvbmVudCxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJ3N1cHBvcnRlZC1jaGlsZHJlbicsXG4gICAgICAgIGNvbXBvbmVudDogU3VwcG9ydGVkQ2hpbGRyZW5Db21wb25lbnQsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdzdXBwb3J0ZWQtY2hpbGQvOmNoaWxkJyxcbiAgICAgICAgY29tcG9uZW50OiBTdXBwb3J0ZWRDaGlsZENvbXBvbmVudCxcbiAgICB9LFxuICAgICB7XG4gICAgICAgICBwYXRoOiAnaGVhZHMtb2YtZmFtaWx5JyxcbiAgICAgICAgIGNvbXBvbmVudDogSGVhZHNPZkZhbWlseUNvbXBvbmVudCxcbiAgICAgfSxcbiAgICAge1xuICAgICAgICAgcGF0aDogJ2hlYWQtb2YtZmFtaWx5JyxcbiAgICAgICAgIGNvbXBvbmVudDogSGVhZE9mRmFtaWx5Q29tcG9uZW50LFxuICAgICB9XG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3Nwb25zb3JzJyxcbiAgICAgICAgIGNvbXBvbmVudDogU3BvbnNvcnNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbiAgICAvKlxuICAgICB7XG4gICAgICAgICBwYXRoOiAnc2Nob29scycsXG4gICAgICAgICBjb21wb25lbnQ6IFNjaG9vbHNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbiAgICAvKlxuICAgICB7XG4gICAgICAgICBwYXRoOiAncGFyaXNoLXdvcmtlcnMnLFxuICAgICAgICAgY29tcG9uZW50OiBQYXJpc2hXb3JrZXJzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ2Fzc2lnbmVkLW9mZmljZXMnLFxuICAgICAgICAgY29tcG9uZW50OiBBc3NpZ25lZE9mZmljZXNDb21wb25lbnQsXG4gICAgIH1cbiAgICAgKi9cbl07XG4iXX0=