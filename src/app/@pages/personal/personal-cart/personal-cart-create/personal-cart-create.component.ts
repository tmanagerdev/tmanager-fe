import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { MenuItem, Message, MessageService } from 'primeng/api';
import { AuthService } from 'src/app/@core/services/auth.service';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { Subject, forkJoin, iif, map, switchMap, takeUntil, tap } from 'rxjs';
import { clearFormArray, uuidv4 } from 'src/app/@core/utils';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { PeopleRoomingService } from './people-rooming.service';
import { ECategoryPeople, IPeople } from 'src/app/@core/models/people.model';
import { EStatusCart, ICart } from 'src/app/@core/models/cart.model';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { IEvent } from 'src/app/@core/models/event.model';
import { RoadApiService } from 'src/app/@core/api/road-api.service';
import { MealApiService } from 'src/app/@core/api/meal-api.service';

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
      label: 'Pasti',
    },
    {
      label: 'Attività',
    },
    {
      label: 'Trasporti',
    },
    {
      label: 'Riepilogo',
    },
  ];
  activeIndex: number = 0;
  currentUser: any;
  event!: Partial<IEvent>;
  city: any;
  hotels: any;
  veichles: any;
  hotelMeals: any;
  activities: any;
  roads: any;
  meals: any;
  EStatusCart = EStatusCart;
  status: EStatusCart = EStatusCart.DRAFT;
  messages: Message[] | undefined;
  selectedHotel: any = null;
  people: IPeople[] = [];
  cart!: Partial<ICart>;

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
    equipments: new FormControl(null),
    others: new FormControl(null),
    activities: new FormArray([]),
    rooms: new FormArray([]),
    roads: new FormArray([]),
    meals: new FormArray([]),
    people: new FormArray([]),
    genericNotes: new FormControl(null),
    accomodationNotes: new FormControl(null),
    roadNotes: new FormControl(null),
  });
  accomodationForm: FormGroup = new FormGroup({
    hotel: new FormGroup({
      id: new FormControl(null),
      name: new FormControl(null),
      rooms: new FormControl(null),
      meals: new FormControl(null),
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
  mealForm: FormGroup = new FormGroup({
    meals: new FormArray<any>([]),
  });
  activityForm: FormGroup = new FormGroup({
    activities: new FormArray<any>([]),
  });

  event$: Subject<void> = new Subject();
  hotel$: Subject<void> = new Subject();
  cart$: Subject<void> = new Subject();
  save$: Subject<any> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rooms() {
    return this.cartForm.get('rooms') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService,
    private eventApiService: EventApiService,
    private hotelApiService: HotelApiService,
    private veichleApiService: VeichleApiService,
    private roadApiService: RoadApiService,
    private activityApiService: ActivityApiService,
    private mealApiService: MealApiService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public peopleRoomingService: PeopleRoomingService
  ) {
    this.isEdit = route.snapshot.data['isEdit'];
    this.currentUser = this.authService.currentUser;

    if (!!this.isEdit) {
      this.cartId = this.route.snapshot.params['id'];
      this.cart$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(() => this.cartApiService.findOne(this.cartId)),
          tap((cart) => {
            this.cart = { ...cart };
            this.patchFormEdit();
            this.event = { ...cart.event };
            this.status = cart.status!;
            this.city = { ...this.event.home?.city };
          }),
          switchMap(() =>
            forkJoin({
              hotels: this.hotelApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              veichles: this.veichleApiService
                .findAll({ take: 500, page: 1 })
                .pipe(map((data) => data.data)),
              roads: this.roadApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              activities: this.activityApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              meals: this.mealApiService
                .findAll({
                  take: 500,
                  page: 1,
                })
                .pipe(map((data) => data.data)),
            }).pipe(
              tap(({ hotels, veichles, roads, activities, meals }) => {
                this.hotels = [...hotels];
                this.veichles = [...veichles];
                this.roads = [...roads];
                this.activities = [...activities];
                this.meals = [...meals];

                this.selectedHotel = this.hotels.find(
                  (h: any) =>
                    h.id ===
                    this.accomodationForm.get('hotel')?.get('id')?.value
                );
              })
            )
          )
          //switchMap(() => this.eventApiService.findOne(this.eventId)),
          //tap((event) => {
          //this.event = { ...event };
          //this.city = { ...this.event.home?.city };

          //})
          // switchMap(() =>
          //   this.hotelApiService.findAll({
          //     take: 200,
          //     page: 1,
          //     city: this.event.home?.city.id,
          //   })
          // ),
          // map((data) => data.data),
          // tap((hotels) => {
          //   this.hotels = [...hotels];
          //   this.selectedHotel = this.hotels.find(
          //     (h: any) =>
          //       h.id === this.accomodationForm.get('hotel')?.get('id')?.value
          //   );
          //   this.hotelMeals = [...(this.selectedHotel.meals ?? [])];
          //   console.log('this hotel meals', this.hotelMeals);
          // }),
          // switchMap(() =>
          //   this.veichleApiService.findAll({
          //     city: this.city.id,
          //   })
          // ),
          // tap((veichles: any) => (this.veichles = [...veichles])),
          // switchMap(() =>
          //   this.activityApiService.findAll({
          //     take: 500,
          //     page: 1,
          //     city: this.city.id,
          //   })
          // ),
          // map((data) => data.data),
          // tap((activities) => (this.cityActivities = [...activities]))
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
            this.city = { ...this.event.home?.city };
            this.people = [...(this.event.away?.people ?? [])];
            this.peopleRoomingService.initPeople(
              this.event.away?.people ?? [],
              []
            );
          }),
          switchMap(() =>
            forkJoin({
              hotels: this.hotelApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              veichles: this.veichleApiService
                .findAll({ take: 500, page: 1 })
                .pipe(map((data) => data.data)),
              roads: this.roadApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              activities: this.activityApiService
                .findAll({
                  take: 500,
                  page: 1,
                  teams: [this.event.home?.id],
                })
                .pipe(map((data) => data.data)),
              meals: this.mealApiService
                .findAll({
                  take: 500,
                  page: 1,
                })
                .pipe(map((data) => data.data)),
            }).pipe(
              tap(({ hotels, veichles, roads, activities, meals }) => {
                this.hotels = [...hotels];
                this.veichles = [...veichles];
                this.roads = [...roads];
                this.activities = [...activities];
                this.meals = [...meals];
              })
            )
          )
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

    this.messages = [
      {
        severity: 'warn',
        summary: 'Attezione!',
        detail:
          'Questa trasferta è stata presa in carico da TMANAGER, puoi modificare solo gli ospiti delle stanze',
      },
    ];
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
    if (this.activeIndex <= 5) {
      this.activeIndex++;
    }
    if (this.activeIndex == 5) {
      this.populateCartForm();
    }
  }

  onActiveIndexChange(event: number) {
    this.activeIndex = event;
    if (this.activeIndex == 5) {
      this.populateCartForm();
    }
  }

  onAddNewPax(pax: IPeople) {
    const peopleCopy = [...this.people, pax];
    this.people = [...peopleCopy];
    this.peopleRoomingService.updatePeople(pax, 'ADD');
  }

  onRemovePax(pax: IPeople) {
    const peopleCopy = this.people.filter(
      (p) => !this.peopleRoomingService.checkPaxAreEquals(p, pax)
    );
    this.people = [...peopleCopy];
    this.peopleRoomingService.updatePeople(pax, 'REMOVE');

    const rooms = (this.accomodationForm.get('rooms') as FormArray).value;
    const indexRoom = rooms.findIndex((room: any) =>
      room.rooming.some((r: any) =>
        this.peopleRoomingService.checkPaxAreEquals(r, pax)
      )
    );

    if (indexRoom > -1) {
      const indexRooming = rooms[indexRoom].rooming.findIndex((r: any) =>
        this.peopleRoomingService.checkPaxAreEquals(r, pax)
      );

      (
        (this.accomodationForm.get('rooms') as FormArray)
          .at(indexRoom)
          .get('rooming') as FormArray
      ).removeAt(indexRooming);
    }
  }

  onChangeSelectedHotel(hotel: any) {
    clearFormArray(this.mealForm.get('meals') as FormArray);
    clearFormArray(this.accomodationForm.get('rooms') as FormArray);

    this.selectedHotel = { ...hotel };
  }

  onCopyRooming(data: any) {
    clearFormArray(this.rooms);

    let setHotel = false;

    for (const d of data.rooming) {
      if (!setHotel) {
        setHotel = true;
        const hotel = this.hotels.find((h: any) => h.id === d.hotelId);
        this.selectedHotel = { ...hotel };
      }

      const room = this.selectedHotel.rooms.find(
        (r: any) => r.name === d.roomName
      );
      const newRoom = new FormGroup({
        id: new FormControl(room.id),
        hotelId: new FormControl(this.selectedHotel.id),
        hotelName: new FormControl(this.selectedHotel.name),
        name: new FormControl(room.name),
        price: new FormControl(room.price),
        numPax: new FormControl(room.numPax),
        rooming: new FormArray([]),
        uuid: new FormControl(uuidv4()),
      });
      for (let p of d.people) {
        const newPeople = new FormGroup({
          name: new FormControl(p.name),
          surname: new FormControl(p.surname),
          category: new FormControl(p.category),
        });
        (newRoom.get('rooming') as FormArray).push(newPeople);
      }
      (this.accomodationForm.get('rooms') as FormArray).push(newRoom);
    }

    this.people = [...data.people];

    let roomings: any = [];
    for (const room of (this.accomodationForm.get('rooms') as FormArray)
      .value) {
      for (const rooming of room.rooming) {
        roomings = [...roomings, rooming];
      }
    }
    this.peopleRoomingService.initPeople(this.people ?? [], roomings);

    this.messageService.add({
      severity: 'success',
      summary: 'Rooming copiata da ultima trasferta',
    });
  }

  onSaveCart() {
    const cart = { ...this.cartForm.value };
    console.log('SAVE CART', cart);
    this.save$.next(cart);
  }

  /**
   * Chiamato quando apri la pagina di edit
   * serve a popolare i form per le tab a partire dal
   * carrello recuperato dalle API
   */
  patchFormEdit() {
    console.log('patchFormEdit', this.cart);
    // PATCH CART FORM
    this.cartForm.get('genericNotes')?.setValue(this.cart.genericNotes);
    // PATCH PAX FORM
    const { players, managers, staffs, equipments, others, people } = this.cart;
    this.people = [...(people ?? [])];

    // PATCH ACCOMODATION FORM
    const startDate = this.cart.startDate
      ? new Date(this.cart.startDate)
      : null;
    const endDate = this.cart.endDate ? new Date(this.cart.endDate) : null;
    this.accomodationForm.patchValue({
      startDate,
      endDate,
      accomodationNotes: this.cart.accomodationNotes,
    });
    if (this.cart.rooms && this.cart.rooms.length) {
      const { id, name } = this.cart.rooms[0].room?.hotel;
      this.accomodationForm.patchValue({ hotel: { id, name } });
      const accomodationRooms = this.accomodationForm.get('rooms') as FormArray;
      for (const r of this.cart.rooms) {
        const room = new FormGroup({
          id: new FormControl(r.room?.id),
          name: new FormControl(r.room?.name),
          price: new FormControl(r.room?.price),
          numPax: new FormControl(r.room?.numPax),
          rooming: new FormArray([]),
          hotelId: new FormControl(r.room?.hotel.id),
          hotelName: new FormControl(r.room?.hotel.name),
          uuid: new FormControl(uuidv4()),
        });

        for (const cartRooming of r!.rooming!) {
          const rooming = new FormGroup({
            name: new FormControl(cartRooming.name),
            surname: new FormControl(cartRooming.surname),
            category: new FormControl(cartRooming.category),
          });
          (room.get('rooming') as FormArray).push(rooming);
        }
        accomodationRooms.push(room);
      }
    }

    let roomings: any = [];
    for (const room of (this.accomodationForm.get('rooms') as FormArray)
      .value) {
      for (const rooming of room.rooming) {
        roomings = [...roomings, rooming];
      }
    }
    this.peopleRoomingService.initPeople(this.cart.people ?? [], roomings);

    // PATCH MEAL FORM
    if (this.cart.meals && this.cart.meals.length) {
      const mealsOnCarts = this.cart.meals.reduce((group: any, meal: any) => {
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
      const meals = this.mealForm.get('meals') as FormArray;
      for (const m of mealsOnCarts) {
        console.log('m', m);
        const room = new FormGroup({
          id: new FormControl(m.mealId),
          quantity: new FormControl(m.quantity),
          price: new FormControl(m.price),
          startDate: new FormControl(new Date(m.startDate)),
          mealId: new FormControl(m.mealId),
          ...(m.configIds.length < 2
            ? {
                configId: new FormControl(m.configIds[0].configId),
                configIds: new FormControl([]),
              }
            : {
                configId: new FormControl(null),
                configIds: new FormControl(
                  m.configIds.map((c: any) => c.configId)
                ),
              }),
          ...(m.configIds.length < 2
            ? {
                name: new FormControl(
                  `${m.mealName} - ${m.configIds[0].configName}`
                ),
              }
            : {
                name: new FormControl(
                  `${m.mealName} - ${m.configIds
                    .map((c: any) => c.configName)
                    .join(', ')}`
                ),
              }),
          description: new FormControl(null),
        });
        meals.push(room);
      }
    }

    // PATCH ROADS FORM
    this.roadForm.patchValue({
      roadNotes: this.cart.roadNotes,
    });
    if (this.cart.roads && this.cart.roads.length) {
      const roads = this.roadForm.get('roads') as FormArray;
      for (const r of this.cart.roads) {
        const road = new FormGroup({
          startDate: new FormControl(new Date(r.startDate!)),
          startDateHour: new FormControl(new Date(r.startDate!)),
          quantity: new FormControl(r.quantity),
          road: new FormGroup({
            price: new FormControl(r.road?.price),
            from: new FormControl(r.road?.from),
            to: new FormControl(r.road?.to),
            id: new FormControl(r.road?.id),
          }),
          veichle: new FormGroup({
            id: new FormControl(r.veichle?.id),
            name: new FormControl(r.veichle?.name),
          }),
          createdAt: new FormControl(r.createdAt!),
          updatedAt: new FormControl(r.updatedAt!),
        });

        roads.push(road);
      }
    }

    // PATCH ACTIVITY FORM
    if (this.cart.activities && this.cart.activities.length) {
      const actvitiyActivities = this.activityForm.get(
        'activities'
      ) as FormArray;
      for (const a of this.cart.activities) {
        const activity = new FormGroup({
          id: new FormControl(a.activity?.id),
          name: new FormControl(a.activity?.name),
          description: new FormControl(a.activity?.description),
          price: new FormControl(a.activity?.price),
          quantity: new FormControl(a.quantity),
          startDate: new FormControl(new Date(a.startDate!)),
        });
        actvitiyActivities.push(activity);
      }
    }

    console.log('AFTER PATCH CART');
    console.log('ACCOMODATION', this.accomodationForm.value);
    console.log('MEAL', this.mealForm.value);
    console.log('ACTIVITY', this.activityForm.value);
    console.log('ROAD', this.roadForm.value);
  }

  /**
   * Chiamato prima di salvare il carrello
   * prende i sotto form delle tab e popola
   * il form principale del carrello
   */
  populateCartForm() {
    this.cartForm.patchValue({
      players: (
        this.people.filter((p) => p.category == ECategoryPeople.PLAYER) ?? []
      ).length,
      staffs: (
        this.people.filter((p) => p.category == ECategoryPeople.STAFF) ?? []
      ).length,
      managers: (
        this.people.filter((p) => p.category == ECategoryPeople.MANAGER) ?? []
      ).length,
      equipments: (
        this.people.filter((p) => p.category == ECategoryPeople.EQUIPMENT) ?? []
      ).length,
      others: (
        this.people.filter((p) => p.category == ECategoryPeople.OTHER) ?? []
      ).length,
    });

    this.cartForm.get('event')?.get('id')?.setValue(this.event.id);
    this.cartForm.get('event')?.get('date')?.setValue(this.event.date);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('id')
      ?.setValue(this.event.home?.id);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('name')
      ?.setValue(this.event.home?.name);
    this.cartForm
      .get('event')
      ?.get('away')
      ?.get('id')
      ?.setValue(this.event.away?.id);
    this.cartForm
      .get('event')
      ?.get('away')
      ?.get('name')
      ?.setValue(this.event.away?.name);

    this.cartForm.get('team')?.get('id')?.setValue(this.event.away?.id);
    this.cartForm.get('team')?.get('name')?.setValue(this.event.away?.name);

    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('city')
      ?.get('id')
      ?.setValue(this.event.home?.city.id);
    this.cartForm
      .get('event')
      ?.get('home')
      ?.get('city')
      ?.get('name')
      ?.setValue(this.event.home?.city.name);

    const { startDate, endDate, accomodationNotes } =
      this.accomodationForm.value;
    this.cartForm.get('startDate')?.setValue(startDate);
    this.cartForm.get('endDate')?.setValue(endDate);
    this.cartForm.get('accomodationNotes')?.setValue(accomodationNotes);

    const accomodationRooms = this.accomodationForm.get('rooms') as FormArray;
    const roadRoads = this.roadForm.get('roads') as FormArray;
    const activiyActivities = this.activityForm.get('activities') as FormArray;
    const mealMeals = this.mealForm.get('meals') as FormArray;

    // POPULATE PEOPLE
    clearFormArray(this.cartForm.get('people') as FormArray);
    for (const p of this.people) {
      const cartPeople = this.cartForm.get('people') as FormArray;
      cartPeople.push(
        new FormGroup({
          birthDate: new FormControl(p.birthDate),
          birthPlace: new FormControl(p.birthPlace),
          category: new FormControl(p.category),
          docExpiredAt: new FormControl(p.docExpiredAt),
          docNumber: new FormControl(p.docNumber),
          name: new FormControl(p.name),
          surname: new FormControl(p.surname),
        })
      );
    }

    // PUPOLATE ROOMS
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

    // POPULATE ROADS
    const { roadNotes } = this.roadForm.value;
    this.cartForm.get('roadNotes')?.setValue(roadNotes);
    clearFormArray(this.cartForm.get('roads') as FormArray);
    for (const r of roadRoads.value) {
      console.log('R', r);
      const cartRoads = this.cartForm.get('roads') as FormArray;
      cartRoads.push(
        new FormGroup({
          roadId: new FormControl(r.road.id),
          quantity: new FormControl(r.quantity),
          startDate: new FormControl(r.startDate),
          veichleId: new FormControl(r.veichle.id),
          veichle: new FormControl(r.veichle.name),
          from: new FormControl(r.road.from),
          to: new FormControl(r.road.to),
          price: new FormControl(r.road.price),
        })
      );
    }

    // POPULATE ACTIVITIES
    clearFormArray(this.cartForm.get('activities') as FormArray);
    for (const a of activiyActivities.value) {
      const cartActivities = this.cartForm.get('activities') as FormArray;
      cartActivities.push(
        new FormGroup({
          activityId: new FormControl(a.id),
          name: new FormControl(a.name),
          description: new FormControl(a.description),
          price: new FormControl(a.price),
          quantity: new FormControl(a.quantity),
          startDate: new FormControl(a.startDate),
        })
      );
    }

    // POPULATE MEALS
    clearFormArray(this.cartForm.get('meals') as FormArray);
    for (const m of mealMeals.value) {
      const cartMeals = this.cartForm.get('meals') as FormArray;
      if (m.configIds && m.configIds.length) {
        for (const config of m.configIds) {
          cartMeals.push(
            new FormGroup({
              mealId: new FormControl(m.mealId),
              configId: new FormControl(config),
              quantity: new FormControl(m.quantity),
              startDate: new FormControl(m.startDate),
              name: new FormControl(m.name),
              description: new FormControl(m.description),
              price: new FormControl(m.price),
            })
          );
        }
      } else {
        cartMeals.push(
          new FormGroup({
            mealId: new FormControl(m.mealId),
            configId: new FormControl(m.configId),
            quantity: new FormControl(m.quantity),
            startDate: new FormControl(m.startDate),
            name: new FormControl(m.name),
            description: new FormControl(m.description),
            price: new FormControl(m.price),
          })
        );
      }
    }

    console.log('CREAZIONE CART', this.cartForm.value);
  }
}
