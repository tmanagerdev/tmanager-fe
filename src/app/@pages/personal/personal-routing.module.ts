import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // {
  //   path: 'events',
  //   loadChildren: () =>
  //     import('./personal-event/personal-event.module').then(
  //       (m) => m.PersonalEventModule
  //     ),
  // },
  {
    path: 'carts',
    loadChildren: () =>
      import('./personal-cart/personal-cart.module').then(
        (m) => m.PersonalCartModule
      ),
  },
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalRoutingModule {}
