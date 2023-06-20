import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './@ui/layout/layout.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { AutoLoginGuard } from './@core/guards/auto-login.guard';

const routes: Routes = [
  {
    path: 'auth',
    canLoad: [AutoLoginGuard],
    loadChildren: () =>
      import('./@pages/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'activity',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/activity/activity.module').then(
            (m) => m.ActivityModule
          ),
      },
      {
        path: 'calendar',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'cart',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'city',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/city/city.module').then((m) => m.CityModule),
      },
      {
        path: 'league',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/league/league.module').then((m) => m.LeagueModule),
      },
      {
        path: 'team',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/team/team.module').then((m) => m.TeamModule),
      },
      {
        path: 'user',
        canActivate: [AuthGuard],
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
