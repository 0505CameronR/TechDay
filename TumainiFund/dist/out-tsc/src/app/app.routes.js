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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLnJvdXRlcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9hcHAvYXBwLnJvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFFQSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDdEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQzlELE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLG1EQUFtRCxDQUFDO0FBQy9GLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZDQUE2QyxDQUFDO0FBR3RGLE1BQU0sQ0FBQyxNQUFNLE1BQU0sR0FBVztJQUMxQjtRQUNJLElBQUksRUFBRSxFQUFFO1FBQ1IsVUFBVSxFQUFFLFVBQVU7UUFDdEIsU0FBUyxFQUFFLE1BQU07S0FDcEI7SUFDRDtRQUNJLElBQUksRUFBRSxNQUFNO1FBQ1osU0FBUyxFQUFFLGFBQWE7S0FDM0I7SUFDRDtRQUNJLElBQUksRUFBRSxTQUFTO1FBQ2YsU0FBUyxFQUFFLGVBQWU7S0FDN0I7SUFDRDtRQUNJLElBQUksRUFBRSxvQkFBb0I7UUFDMUIsU0FBUyxFQUFFLDBCQUEwQjtLQUN4QztJQUNEO1FBQ0ksSUFBSSxFQUFFLHdCQUF3QjtRQUM5QixTQUFTLEVBQUUsdUJBQXVCO0tBQ3JDO0lBQ0Q7Ozs7O09BS0c7SUFDSDs7Ozs7T0FLRztJQUNIOzs7OztPQUtHO0lBQ0g7Ozs7O09BS0c7SUFDSDs7Ozs7T0FLRztDQUNOLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBSb3V0ZXMgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBIb21lQ29tcG9uZW50IH0gZnJvbSAnLi9ob21lL2hvbWUuY29tcG9uZW50JztcbmltcG9ydCB7IFNpZ25JbkNvbXBvbmVudCB9IGZyb20gJy4vc2lnbi1pbi9zaWduLWluLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBTdXBwb3J0ZWRDaGlsZHJlbkNvbXBvbmVudCB9IGZyb20gJy4vc3VwcG9ydGVkLWNoaWxkcmVuL3N1cHBvcnRlZC1jaGlsZHJlbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgU3VwcG9ydGVkQ2hpbGRDb21wb25lbnQgfSBmcm9tICcuL3N1cHBvcnRlZC1jaGlsZC9zdXBwb3J0ZWQtY2hpbGQuY29tcG9uZW50JztcblxuXG5leHBvcnQgY29uc3Qgcm91dGVzOiBSb3V0ZXMgPSBbXG4gICAge1xuICAgICAgICBwYXRoOiAnJyxcbiAgICAgICAgcmVkaXJlY3RUbzogJy9zaWduLWluJyxcbiAgICAgICAgcGF0aE1hdGNoOiAnZnVsbCcsXG4gICAgfSxcbiAgICB7XG4gICAgICAgIHBhdGg6ICdob21lJyxcbiAgICAgICAgY29tcG9uZW50OiBIb21lQ29tcG9uZW50LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnc2lnbi1pbicsXG4gICAgICAgIGNvbXBvbmVudDogU2lnbkluQ29tcG9uZW50LFxuICAgIH0sXG4gICAge1xuICAgICAgICBwYXRoOiAnc3VwcG9ydGVkLWNoaWxkcmVuJyxcbiAgICAgICAgY29tcG9uZW50OiBTdXBwb3J0ZWRDaGlsZHJlbkNvbXBvbmVudCxcbiAgICB9LFxuICAgIHtcbiAgICAgICAgcGF0aDogJ3N1cHBvcnRlZC1jaGlsZC86Y2hpbGQnLFxuICAgICAgICBjb21wb25lbnQ6IFN1cHBvcnRlZENoaWxkQ29tcG9uZW50LFxuICAgIH1cbiAgICAvKlxuICAgICB7XG4gICAgICAgICBwYXRoOiAnaGVhZHMtb2YtZmFtaWx5JyxcbiAgICAgICAgIGNvbXBvbmVudDogSGVhZHNPZkZhbWlseUNvbXBvbmVudCxcbiAgICAgfVxuICAgICAqL1xuICAgIC8qXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdzcG9uc29ycycsXG4gICAgICAgICBjb21wb25lbnQ6IFNwb25zb3JzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3NjaG9vbHMnLFxuICAgICAgICAgY29tcG9uZW50OiBTY2hvb2xzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG4gICAgLypcbiAgICAge1xuICAgICAgICAgcGF0aDogJ3BhcmlzaC13b3JrZXJzJyxcbiAgICAgICAgIGNvbXBvbmVudDogUGFyaXNoV29ya2Vyc0NvbXBvbmVudCxcbiAgICAgfVxuICAgICAqL1xuICAgIC8qXG4gICAgIHtcbiAgICAgICAgIHBhdGg6ICdhc3NpZ25lZC1vZmZpY2VzJyxcbiAgICAgICAgIGNvbXBvbmVudDogQXNzaWduZWRPZmZpY2VzQ29tcG9uZW50LFxuICAgICB9XG4gICAgICovXG5dO1xuIl19