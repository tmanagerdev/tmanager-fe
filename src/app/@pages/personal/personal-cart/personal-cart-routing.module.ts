import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCartListComponent } from './personal-cart-list/personal-cart-list.component';
import { PersonalCartEditComponent } from './personal-cart-edit/personal-cart-edit.component';
import { PersonalCartViewComponent } from './personal-cart-view/personal-cart-view.component';
import { PersonalCartCreateComponent } from './personal-cart-create/personal-cart-create.component';
import { CartCreatePaxComponent } from './personal-cart-create/cart-create-pax/cart-create-pax.component';
import { CartCreateAccomodationsComponent } from './personal-cart-create/cart-create-accomodations/cart-create-accomodations.component';
import { CartCreateRoadComponent } from './personal-cart-create/cart-create-road/cart-create-road.component';
import { CartCreateActivityComponent } from './personal-cart-create/cart-create-activity/cart-create-activity.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalCartListComponent,
  },
  {
    path: 'new/:id',
    component: PersonalCartCreateComponent,
  },
  {
    path: ':id',
    component: PersonalCartViewComponent,
    children: [
      {
        path: 'edit',
        component: PersonalCartEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalCartRoutingModule {}
