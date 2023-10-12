import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { MenuItem, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/@core/services/auth.service';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { Subject, iif, switchMap, takeUntil, tap } from 'rxjs';
import { clearFormArray, uuidv4 } from 'src/app/@core/utils';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PersonalCartCrateConfirmModalComponent } from './personal-cart-crate-confirm-modal/personal-cart-crate-confirm-modal.component';
import { CartCreateAccomodationsService } from './cart-create-accomodations/cart-create-accomodations.service';
import { ECategoryPeople } from 'src/app/@core/models/people.model';

@Component({
  selector: 'app-personal-cart-create',
  templateUrl: './personal-cart-create.component.html',
  styleUrls: ['./personal-cart-create.component.scss'],
})
export class PersonalCartCreateComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  cartId: number = 0;
  isEdit: boolean = false;
  items: MenuItem[] = [
    {
      label: 'Partecipanti',
    },
    {
      label: 'Alloggio',
    },
    {
      label: 'Attività',
    },
    {
      label: 'Bus-Auto-Trasporti',
    },
    {
      label: 'Riepilogo',
    },
  ];
  activeIndex: number = 0;
  currentUser: any;
  event: any;

  cartForm: FormGroup = new FormGroup({
    team: new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
    }),
    event: new FormGroup({
      id: new FormControl(null),
      date: new FormControl(null),
      away: new FormGroup({
        id: new FormControl(null),
        name: new FormControl(null),
      }),
      home: new FormGroup({
        id: new FormControl(null),
        name: new FormControl(null),
        city: new FormGroup({
          id: new FormControl(null),
          name: new FormControl(null),
        }),
      }),
    }),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    isCompleted: new FormControl(null),
    players: new FormControl(null),
    staffs: new FormControl(null),
    managers: new FormControl(null),
    activities: new FormArray([]),
    rooms: new FormArray([]),
    roads: new FormArray([]),
    genericNotes: new FormControl(null),
    accomodationNotes: new FormControl(null),
    roadNotes: new FormControl(null),
  });
  paxForm: FormGroup = new FormGroup({
    players: new FormControl(null),
    staffs: new FormControl(null),
    managers: new FormControl(null),
    equipments: new FormControl(null),
    others: new FormControl(null),
  });
  accomodationForm: FormGroup = new FormGroup({
    hotel: new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      rooms: new FormControl(null),
    }),
    startDate: new FormControl(null),
    endDate: new FormControl(null),
    rooms: new FormArray<any>([]),
    roomings: new FormArray<any>([]),
    accomodationNotes: new FormControl(null),
  });
  roadForm: FormGroup = new FormGroup({
    roads: new FormArray<any>([]),
    roadNotes: new FormControl(null),
  });
  activityForm: FormGroup = new FormGroup({
    activities: new FormArray<any>([]),
  });

  event$: Subject<void> = new Subject();
  cart$: Subject<void> = new Subject();
  save$: Subject<any> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

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
    private cartApiService: CartApiService,
    private eventApiService: EventApiService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public accomodationService: CartCreateAccomodationsService
  ) {
    this.isEdit = route.snapshot.data['isEdit'];
    this.currentUser = this.authService.currentUser;

    if (!!this.isEdit) {
      this.cartId = this.route.snapshot.params['id'];
      this.cart$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(() => this.cartApiService.findOne(this.cartId)),
          tap((cart) => this.patchFormEdit(cart)),
          tap((cart) => (this.eventId = cart.event.id)),
          switchMap(() => this.eventApiService.findOne(this.eventId)),
          tap((event) => {
            this.event = { ...event };
            let roomings: any = [];
            for (const room of (this.accomodationForm.get('rooms') as FormArray)
              .value) {
              for (const rooming of room.rooming) {
                if (rooming.people && rooming.people.id) {
                  roomings = [...roomings, rooming.people.id];
                }
              }
            }
            this.accomodationService.initPeople(
              this.event.away.people ?? [],
              roomings
            );
          })
        )
        .subscribe();
    } else {
      this.eventId = this.route.snapshot.params['id'];
      this.event$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(() => this.eventApiService.findOne(this.eventId)),
          tap((event) => {
            this.event = { ...event };
            this.accomodationService.initPeople(
              this.event.away.people ?? [],
              []
            );
            this.setPax();
          })
        )
        .subscribe();
    }

    this.save$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((cart) =>
          iif(
            () => this.isEdit,
            this.cartApiService.update(this.cartId, cart),
            this.cartApiService.create(cart)
          )
        ),
        tap((cartSaved) => {
          setTimeout(
            () =>
              this.messageService.add({
                severity: 'success',
                summary: 'Trasferta salvata',
                detail: 'La trasferta è stata salvata correttamente',
              }),
            100
          );
          this.router.navigate(['personal', 'carts', cartSaved.id]);
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    !!this.isEdit ? this.loadCart() : this.loadEvent();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadEvent() {
    this.event$.next();
  }

  loadCart() {
    this.cart$.next();
  }

  onPrevStep() {
    this.activeIndex--;
  }

  onNextStep() {
    if (this.activeIndex <= 4) {
      this.activeIndex++;
    }
    if (this.activeIndex == 4) {
      this.populateCartForm();
    }
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    if (this.activeIndex == 4) {
      this.populateCartForm();
    }
  }

  setPax() {
    const keyBinding = [
      { key: 'players', category: ECategoryPeople.PLAYER },
      { key: 'staffs', category: ECategoryPeople.STAFF },
      { key: 'managers', category: ECategoryPeople.MANAGER },
      { key: 'equipments', category: ECategoryPeople.EQUIPMENT },
      { key: 'others', category: ECategoryPeople.OTHER },
    ];

    for (const k of keyBinding) {
      this.paxForm
        .get(k.key)
        ?.setValue(
          this.event.away.people.filter((p: any) => p.category === k.category)
            .length ?? 0
        );
    }
  }

  onSaveCart() {
    const cart = { ...this.cartForm.value };

    this.ref = this.dialogService.open(PersonalCartCrateConfirmModalComponent, {
      header: this.isEdit ? 'Aggiornamento trasferta' : 'Creazione trasferta',
      width: '450px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
    });

    this.ref.onClose.subscribe((action: string) => {
      switch (action) {
        case 'confirm':
          cart.isCompleted = true;
          break;
        default:
          break;
      }

      this.save$.next(cart);
    });
  }

  /**
   * Chiamato quando apri la pagina di edit
   * serve a popolare i form per le tab a partire dal
   * carrello recuperato dalle API
   */
  patchFormEdit(cart: any) {
    console.log('patchFormEdit', cart);
    // PATCH CART FORM
    this.cartForm.get('genericNotes')?.setValue(cart.genericNotes);
    // PATCH PAX FORM
    const { players, managers, staffs } = cart;
    this.paxForm.patchValue({ players, managers, staffs });

    // PATCH ACCOMODATION FORM
    const startDate = cart.startDate ? new Date(cart.startDate) : null;
    const endDate = cart.endDate ? new Date(cart.endDate) : null;
    this.accomodationForm.patchValue({
      startDate,
      endDate,
      accomodationNotes: cart.accomodationNotes,
    });
    if (cart.rooms && cart.rooms.length) {
      const { id, name } = cart.rooms[0].room.hotel;
      this.accomodationForm.patchValue({ hotel: { id, name } });
      const accomodationRooms = this.accomodationForm.get('rooms') as FormArray;
      for (const r of cart.rooms) {
        const room = new FormGroup({
          id: new FormControl(r.room.id),
          name: new FormControl(r.room.name),
          price: new FormControl(r.room.price),
          numPax: new FormControl(r.room.numPax),
          rooming: new FormArray([]),
          hotelId: new FormControl(r.room.hotel.id),
          hotelName: new FormControl(r.room.hotel.name),
          uuid: new FormControl(uuidv4()),
        });

        for (const cartRooming of r.rooming) {
          const rooming = new FormGroup({
            people: new FormGroup({
              id: new FormControl(
                cartRooming.people ? cartRooming.people.id : null
              ),
              name: new FormControl(
                cartRooming.people ? cartRooming.people.name : null
              ),
              surname: new FormControl(
                cartRooming.people ? cartRooming.people.surname : null
              ),
              category: new FormControl(
                cartRooming.people ? cartRooming.people.category : null
              ),
            }),
            name: new FormControl(cartRooming.name),
            surname: new FormControl(cartRooming.surname),
            category: new FormControl(cartRooming.category),
          });
          (room.get('rooming') as FormArray).push(rooming);
        }
        accomodationRooms.push(room);
      }
    }

    // PATCH ROADS FORM
    this.roadForm.patchValue({
      roadNotes: cart.roadNotes,
    });
    if (cart.roads && cart.roads.length) {
      const roads = this.roadForm.get('roads') as FormArray;
      for (const r of cart.roads) {
        const road = new FormGroup({
          id: new FormControl(r.road.id),
          startDate: new FormControl(new Date(r.startDate)),
          startDateHour: new FormControl(new Date(r.startDate)),
          price: new FormControl(r.road.price),
          from: new FormControl(r.road.from),
          to: new FormControl(r.road.to),
          quantity: new FormControl(r.quantity),
          veichleId: new FormControl(r.road.veichle.id),
          veichle: new FormControl(r.road.veichle.name),
          createdAt: new FormControl(r.road.createdAt),
          updatedAt: new FormControl(r.road.updatedAt),
        });

        roads.push(road);
      }
    }

    // PATCH ACTIVITY FORM
    if (cart.activities && cart.activities.length) {
      const actvitiyActivities = this.activityForm.get(
        'activities'
      ) as FormArray;
      for (const a of cart.activities) {
        const activity = new FormGroup({
          id: new FormControl(a.activity.id),
          name: new FormControl(a.activity.name),
          description: new FormControl(a.activity.description),
          price: new FormControl(a.activity.price),
          note: new FormControl(a.note),
        });
        actvitiyActivities.push(activity);
      }
    }

    console.log('after patch cart', this.cartForm.value);
  }

  /**
   * Chiamato prima di salvare il carrello
   * prende i sotto form delle tab e popola
   * il form principale del carrello
   */
  populateCartForm() {
    console.log('populate cart form');
    this.cartForm.patchValue(this.paxForm.value);

    this.cartForm.get('event')?.get('id')?.setValue(this.event.id);
    this.cartForm.get('event')?.get('date')?.setValue(this.event.date);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('id')
      ?.setValue(this.event.home.id);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('name')
      ?.setValue(this.event.home.name);
    this.cartForm
      .get('event')
      ?.get('away')
      ?.get('id')
      ?.setValue(this.event.away.id);
    this.cartForm
      .get('event')
      ?.get('away')
      ?.get('name')
      ?.setValue(this.event.away.name);

    this.cartForm.get('team')?.get('id')?.setValue(this.event.away.id);
    this.cartForm.get('team')?.get('name')?.setValue(this.event.away.name);

    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('city')
      ?.get('id')
      ?.setValue(this.event.home.city.id);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('city')
      ?.get('name')
      ?.setValue(this.event.home.city.name);

    const { startDate, endDate, accomodationNotes } =
      this.accomodationForm.value;
    this.cartForm.get('startDate')?.setValue(startDate);
    this.cartForm.get('endDate')?.setValue(endDate);
    this.cartForm.get('accomodationNotes')?.setValue(accomodationNotes);

    const accomodationRooms = this.accomodationForm.get('rooms') as FormArray;
    const roadRoads = this.roadForm.get('roads') as FormArray;
    const activiyActivities = this.activityForm.get('activities') as FormArray;

    clearFormArray(this.cartForm.get('rooms') as FormArray);
    for (const r of accomodationRooms.value) {
      const cartRooms = this.cartForm.get('rooms') as FormArray;
      cartRooms.push(
        new FormGroup({
          roomId: new FormControl(r.id),
          name: new FormControl(r.name),
          price: new FormControl(r.price),
          rooming: new FormControl(
            r.rooming.map((r: any) => {
              return r.people && r.people.id
                ? { peopleId: r.people.id }
                : { name: r.name, surname: r.surname, category: r.category };
            })
          ),
          hotelId: new FormControl(r.hotelId),
          hotelName: new FormControl(r.hotelName),
        })
      );
    }

    const { roadNotes } = this.roadForm.value;
    this.cartForm.get('roadNotes')?.setValue(roadNotes);
    clearFormArray(this.cartForm.get('roads') as FormArray);
    for (const r of roadRoads.value) {
      const cartRoads = this.cartForm.get('roads') as FormArray;
      cartRoads.push(
        new FormGroup({
          roadId: new FormControl(r.id),
          quantity: new FormControl(r.quantity),
          startDate: new FormControl(r.startDate),
          veichleName: new FormControl(r.veichle),
          from: new FormControl(r.from),
          to: new FormControl(r.to),
          price: new FormControl(r.price),
        })
      );
    }

    clearFormArray(this.cartForm.get('activities') as FormArray);
    for (const a of activiyActivities.value) {
      const cartActivities = this.cartForm.get('activities') as FormArray;

      cartActivities.push(
        new FormGroup({
          activityId: new FormControl(a.id),
          name: new FormControl(a.name),
          description: new FormControl(a.description),
          price: new FormControl(a.price),
          note: new FormControl(a.note),
        })
      );
    }

    console.log('CREAZIONE CART', this.cartForm.value);
  }
}
