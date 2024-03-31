import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCartCreateComponent } from '../personal/personal-cart/personal-cart-create/personal-cart-create.component';
import { PersonalCartViewComponent } from '../personal/personal-cart/personal-cart-view/personal-cart-view.component';
import { CartListComponent } from './cart-list/cart-list.component';

const routes: Routes = [
  {
    path: '',
    component: CartListComponent,
  },
  {
    path: 'edit/:id',
    component: PersonalCartCreateComponent,
    data: {
      isEdit: true,
      fromBackoffice: true,
    },
  },
  {
    path: ':id',
    component: PersonalCartViewComponent,
    data: {
      fromBackoffice: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CartRoutingModule {}
