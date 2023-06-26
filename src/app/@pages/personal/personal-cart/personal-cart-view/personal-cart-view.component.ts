import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';

@Component({
  selector: 'app-personal-cart-view',
  templateUrl: './personal-cart-view.component.html',
  styleUrls: ['./personal-cart-view.component.scss'],
})
export class PersonalCartViewComponent {
  cartId: number;
  cart: any;

  cart$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get awayTeam() {
    return this.cart?.team;
  }

  get homeTeam() {
    return this.cart?.event.home.team;
  }

  get city() {
    return this.cart?.event.home.city;
  }

  get eventDate() {
    return this.cart?.event.date;
  }

  get totalPax() {
    return this.cart?.players + this.cart?.staffs + this.cart?.managers;
  }

  get hotel() {
    return this.cart?.rooms[0].room.hotel.name;
  }

  get rooms() {
    return this.cart?.rooms;
  }

  get roads() {
    return this.cart?.roads;
  }

  get activities() {
    return this.cart?.activities;
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
        tap((cart) => (this.cart = { ...cart }))
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
}
