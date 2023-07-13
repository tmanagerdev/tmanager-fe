import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
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
    return this.cart?.event.away;
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

  get total() {
    const totalAccomodation = this.rooms.reduce((acc: any, room: any) => {
      return acc + room.room.price * room.quantity * 100;
    }, 0);
    const totalActivity = this.activities.reduce((acc: any, activity: any) => {
      return acc + activity.activity.price * 100;
    }, 0);

    return totalAccomodation / 100 + totalActivity / 100;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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

  update() {
    this.router.navigate(['personal', 'carts', 'edit', this.cart.id]);
  }

  complete() {
    this.confirmationService.confirm({
      message:
        'Una volta confermata la trasferta non potrà più essere modificata e verrà inviata una mail al nostro staff. Si intende procedere?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartApiService
          .update(this.cart.id, { isCompleted: true })
          .pipe(
            take(1),
            tap(() => {
              this.loadCart();
              this.messageService.add({
                severity: 'success',
                summary: 'Trasferta confermata',
                detail: 'Verrà inviata una mail di notifica al nostro staff',
              });
            })
          )
          .subscribe();
      },
    });
  }
}
