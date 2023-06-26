import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { cartForm } from '../personal-cart.utils';

@Component({
  selector: 'app-personal-cart-edit',
  templateUrl: './personal-cart-edit.component.html',
  styleUrls: ['./personal-cart-edit.component.scss'],
})
export class PersonalCartEditComponent implements OnInit, OnDestroy {
  cartId: number;

  cart$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  cartForm: FormGroup = cartForm;

  get activities() {
    return this.cartForm.get('activities') as FormArray;
  }

  get rooms() {
    return this.cartForm.get('rooms') as FormArray;
  }

  get roads() {
    return this.cartForm.get('roads') as FormArray;
  }

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
    this.cartForm.patchValue(cart);

    for (const a of cart.activities) {
      this.activities.push(
        new FormGroup({
          activityId: new FormControl(a.activity.id),
          cartActivityId: new FormControl(a.id),
          note: new FormControl(a.note),
          name: new FormControl(a.activity.name),
          description: new FormControl(a.activity.description),
          price: new FormControl(a.activity.price),
        })
      );
    }

    for (const r of cart.rooms) {
      this.rooms.push(
        new FormGroup({
          roomId: new FormControl(r.room.id),
          cartRoomId: new FormControl(r.id),
          quantity: new FormControl(r.quantity),
          name: new FormControl(r.room.name),
          price: new FormControl(r.room.price),
          hotelName: new FormControl(r.room.hotel.name),
          hotelId: new FormControl(r.room.hotel.id),
        })
      );
    }

    for (const r of cart.roads) {
      const roadForm = new FormGroup({
        id: new FormControl(r.id),
        from: new FormControl(r.from),
        to: new FormControl(r.to),
        veichles: new FormArray([]),
      });

      for (const v of r.veichles) {
        const veichleForm = new FormGroup({
          id: new FormControl(v.id),
          name: new FormControl(v.veichle.name),
        });
        const array = roadForm.get('veichles') as FormArray;
        array.push(veichleForm);
      }

      this.roads.push(roadForm);
    }

    console.log('VALUE', this.cartForm.value);
  }
}
