import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './@ui/layout/layout.component';
import { AuthGuard } from './@core/guards/auth.guard';
import { AutoLoginGuard } from './@core/guards/auto-login.guard';
import { AdminGuard } from './@core/guards/admin.guard';

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
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/activity/activity.module').then(
            (m) => m.ActivityModule
          ),
      },
      {
        path: 'calendar',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/calendar/calendar.module').then(
            (m) => m.CalendarModule
          ),
      },
      {
        path: 'cart',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/cart/cart.module').then((m) => m.CartModule),
      },
      {
        path: 'city',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/city/city.module').then((m) => m.CityModule),
      },
      {
        path: 'league',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/league/league.module').then((m) => m.LeagueModule),
      },
      {
        path: 'personal',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./@pages/personal/personal.module').then(
            (m) => m.PersonalModule
          ),
      },
      {
        path: 'team',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/team/team.module').then((m) => m.TeamModule),
      },
      {
        path: 'user',
        canActivate: [AuthGuard, AdminGuard],
        loadChildren: () =>
          import('./@pages/user/user.module').then((m) => m.UserModule),
      },
      {
        path: '',
        redirectTo: 'personal',
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
