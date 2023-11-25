import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { compareDates } from 'src/app/@core/utils';

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

  totalPax: number = 0;
  hotel: string = '';
  rooms: any = [];
  roads: any = [];
  meals: any = [];
  roadsGroupByDate: any[] = [];
  total: number = 0;
  isDownloading: boolean = false;
  EStatusCart = EStatusCart;
  fromBackoffice = false;

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

  get activities() {
    return this.cart?.activities;
  }

  get status(): EStatusCart {
    return this.cart?.status;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.cartId = this.route.snapshot.params['id'];
    this.fromBackoffice = this.route.snapshot.data['fromBackoffice'];

    this.cart$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.cartApiService.findOne(this.cartId)),
        tap((cart) => {
          this.cart = { ...cart };

          this.totalPax =
            this.cart?.players +
            this.cart?.staffs +
            this.cart?.managers +
            this.cart?.equipments +
            this.cart?.others;
          this.hotel =
            this.cart?.rooms && this.cart?.rooms.length
              ? this.cart?.rooms[0].room.hotel.name
              : '';

          this.rooms = this.cart?.rooms.reduce((group: any, room: any) => {
            const { name, price } = room.room;
            const index = group.findIndex((g: any) => g.name === name);
            if (index > -1) {
              group[index].quantity++;
            } else {
              group.push({ name, price, quantity: 1 });
            }
            return group;
          }, []);

          this.meals = this.cart.meals.reduce((group: any, meal: any) => {
            const { quantity, startDate, description, price } = meal;
            const { id: configId, name: configName } = meal.meal;

            const { id: mealId, name: mealName } = meal.meal.meal;
            const index = group.findIndex((g: any) => g.mealId === mealId);
            if (index > -1) {
              group[index].configIds.push({ configId, configName });
            } else {
              group.push({
                mealId,
                mealName,
                configIds: [{ configId, configName }],
                quantity,
                startDate,
                description,
                price,
              });
            }
            return group;
          }, []);

          const totalAccomodation = this.rooms.reduce((acc: any, room: any) => {
            return acc + room.price * room.quantity * 100;
          }, 0);
          const totalActivity = this.activities.reduce(
            (acc: any, activity: any) => {
              return acc + activity.quantity * activity.activity.price * 100;
            },
            0
          );
          const totalRoads = this.cart?.roads.reduce((acc: any, road: any) => {
            return acc + road.road.price * road.quantity * 100;
          }, 0);
          const totalMeal = this.meals.reduce((acc: any, meal: any) => {
            return acc + meal.quantity * meal.price * 100;
          }, 0);

          this.total =
            totalAccomodation / 100 +
            totalActivity / 100 +
            totalRoads / 100 +
            totalMeal / 100;

          this.roads = this.cart?.roads;
        })
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
    this.fromBackoffice
      ? this.router.navigate(['cart', 'edit', this.cart.id])
      : this.router.navigate(['personal', 'carts', 'edit', this.cart.id]);
  }

  complete() {
    this.confirmationService.confirm({
      message:
        'Una volta confermata la trasferta non potrà più essere modificata e verrà inviata una mail al nostro staff. Si intende procedere?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartApiService
          .update(this.cart.id, { status: EStatusCart.PENDING })
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

  download() {
    this.isDownloading = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Download iniziato',
      detail: ' Il file verrà scaricato nel browser tra qualche secondo!',
    });
    this.cartApiService
      .downloadPdf(this.cartId)
      .pipe(
        take(1),
        tap((data) => {
          this.isDownloading = false;
          var downloadURL = window.URL.createObjectURL(data);
          var link = document.createElement('a');
          link.href = downloadURL;
          link.download = `trasferta_${this.city.name}.pdf`;
          link.click();
        })
      )
      .subscribe();
  }

  backToCarts() {
    this.fromBackoffice
      ? this.router.navigate(['cart'])
      : this.router.navigate(['personal', 'carts']);
  }
}
