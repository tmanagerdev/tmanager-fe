import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';

@Component({
  selector: 'app-personal-cart-edit',
  templateUrl: './personal-cart-edit.component.html',
  styleUrls: ['./personal-cart-edit.component.scss'],
})
export class PersonalCartEditComponent implements OnInit, OnDestroy {
  cartId: number;

  cart$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService
  ) {
    this.cartId = this.route.snapshot.params['id'];
    this.cart$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.cartApiService.findOne(this.cartId)),
        tap((cart) => this.patchForm(cart))
      )
      .subscribe();
  }

  ngOnInit() {
    this.loadCart();
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCart() {
    this.cart$.next();
  }

  patchForm(cart: any) {
    console.log('esegui patch', cart);
  }
}
