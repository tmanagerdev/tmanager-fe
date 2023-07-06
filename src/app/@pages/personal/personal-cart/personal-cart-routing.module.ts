import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonalCartListComponent } from './personal-cart-list/personal-cart-list.component';
import { PersonalCartViewComponent } from './personal-cart-view/personal-cart-view.component';
import { PersonalCartCreateComponent } from './personal-cart-create/personal-cart-create.component';

const routes: Routes = [
  {
    path: '',
    component: PersonalCartListComponent,
  },
  {
    path: 'new/:id',
    component: PersonalCartCreateComponent,
    data: {
      isEdit: false,
    },
  },
  {
    path: 'edit/:id',
    component: PersonalCartCreateComponent,
    data: {
      isEdit: true,
    },
  },
  {
    path: ':id',
    component: PersonalCartViewComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonalCartRoutingModule {}
