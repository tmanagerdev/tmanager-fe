import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';
import { LayoutComponent } from './@ui/layout/layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'activity',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/activity/activity.module').then(
            (m) => m.ActivityModule
          ),
      },
      {
        path: 'calendar',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'cart',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'city',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/city/city.module').then((m) => m.CityModule),
      },

      {
        path: 'team',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/team/team.module').then((m) => m.TeamModule),
      },
      {
        path: 'user',
        canLoad: [AuthGuard],
        loadChildren: () =>
          import('./@pages/user/user.module').then((m) => m.UserModule),
      },
      {
        path: '',
        redirectTo: 'city',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {})],
  exports: [RouterModule],
})
export class AppRoutingModule {}
