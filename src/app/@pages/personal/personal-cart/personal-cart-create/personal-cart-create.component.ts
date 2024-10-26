import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import {
  Subject,
  forkJoin,
  iif,
  map,
  switchMap,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { MealApiService } from 'src/app/@core/api/meal-api.service';
import { RoadApiService } from 'src/app/@core/api/road-api.service';
import { ServiceApiService } from 'src/app/@core/api/service-api.service';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { EStatusCart, ICart } from 'src/app/@core/models/cart.model';
import { IEvent } from 'src/app/@core/models/event.model';
import { ECategoryPeople, IPeople } from 'src/app/@core/models/people.model';
import { AuthService } from 'src/app/@core/services/auth.service';
import { clearFormArray, uuidv4 } from 'src/app/@core/utils';
import { PeopleRoomingService } from './people-rooming.service';

@Component({
  selector: 'app-personal-cart-create',
  templateUrl: './personal-cart-create.component.html',
  styleUrls: ['./personal-cart-create.component.scss'],
})
export class PersonalCartCreateComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  cartId: number = 0;
  isEdit: boolean = false;
  fromBackoffice: boolean = false;
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
  services: any;
  veichles: any;
  hotelMeals: any;
  activities: any;
  roads: any;
  //roadsGroupByName: any;
  meals: any;
  EStatusCart = EStatusCart;
  status: EStatusCart = EStatusCart.DRAFT;
  isDisabledCart: boolean = false;
  isDisabledRooming: boolean = false;
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
    total: new FormControl(null),
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

  get roadsFormArray() {
    return this.roadForm.get('roads') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService,
    private eventApiService: EventApiService,
    private hotelApiService: HotelApiService,
    private serviceApiService: ServiceApiService,
    private veichleApiService: VeichleApiService,
    private roadApiService: RoadApiService,
    private activityApiService: ActivityApiService,
    private mealApiService: MealApiService,
    private authService: AuthService,
    private messageService: MessageService,
    public dialogService: DialogService,
    public peopleRoomingService: PeopleRoomingService,
    private confirmationService: ConfirmationService
  ) {
    this.isEdit = route.snapshot.data['isEdit'];
    this.fromBackoffice = route.snapshot.data['fromBackoffice'];
    this.currentUser = this.authService.currentUser;

    if (!!this.isEdit) {
      this.cartId = this.route.snapshot.params['id'];
      this.cart$
        .pipe(
          takeUntil(this.unsubscribe$),
          switchMap(() => this.cartApiService.findOne(this.cartId)),
          tap((cart) => {
            this.cart = { ...cart };
            this.event = { ...cart.event };
            this.status = cart.status!;
            this.isDisabledCart =
              this.status !== EStatusCart.DRAFT &&
              this.currentUser.role !== 'ADMIN';
            this.isDisabledRooming =
              this.status !== EStatusCart.DRAFT &&
              this.status !== EStatusCart.PENDING &&
              this.currentUser.role !== 'ADMIN';

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
              services: this.serviceApiService
                .findAll({
                  take: 500,
                  page: 1,
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
              tap(
                ({ hotels, services, veichles, roads, activities, meals }) => {
                  this.hotels = [...hotels];
                  this.services = [...services];
                  this.veichles = [...veichles];
                  this.roads = [...roads];
                  this.activities = [...activities];
                  this.meals = [...meals];

                  if (this.cart.rooms && this.cart.rooms.length) {
                    this.selectedHotel = this.hotels.find(
                      (h: any) => h.id === this.cart.rooms![0].room?.hotel.id
                    );
                  }

                  for (const r of roads) {
                    const rGroup = new FormGroup({
                      id: new FormControl(r.id),
                      from: new FormControl(r.from),
                      to: new FormControl(r.to),
                      roadsVeichles: new FormControl(r.roadsVeichles),
                      roads: new FormArray([]),
                    });
                    this.roadsFormArray.push(rGroup);
                  }

                  this.patchFormEdit();
                }
              )
            )
          )
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
              services: this.serviceApiService
                .findAll({
                  take: 500,
                  page: 1,
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
              tap(
                ({ hotels, services, veichles, roads, activities, meals }) => {
                  this.hotels = [...hotels];
                  this.services = [...services];
                  this.veichles = [...veichles];
                  this.roads = [...roads];
                  this.activities = [...activities];
                  this.meals = [...meals];

                  for (const r of roads) {
                    const rGroup = new FormGroup({
                      id: new FormControl(r.id),
                      from: new FormControl(r.from),
                      to: new FormControl(r.to),
                      roadsVeichles: new FormControl(r.roadsVeichles),
                      roads: new FormArray([]),
                    });
                    this.roadsFormArray.push(rGroup);
                  }
                }
              )
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

          this.fromBackoffice
            ? this.router.navigate(['cart', cartSaved.id])
            : this.router.navigate(['personal', 'carts', cartSaved.id]);
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
        const { quantity, startDate, description } = meal;
        const { id: configId, name: configName } = meal.meal;
        const { id: mealId, name: mealName, price: mealPrice } = meal.meal.meal;
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
            price: mealPrice,
          });
        }
        return group;
      }, []);
      const meals = this.mealForm.get('meals') as FormArray;
      for (const m of mealsOnCarts) {
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
          description: new FormControl(m.description),
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
        const roadId = r.roadsVeichles.road.id;
        const road = roads.value.find((road: any) => road.id === roadId);
        const roadIndex = roads.value.findIndex(
          (road: any) => road.id === roadId
        );
        if (road.roads && road.roads.length) {
          const roadsArray = roads.at(roadIndex).get('roads') as FormArray;
          const roadInThisDate = roadsArray.value.findIndex((ra: any) => {
            return (
              ra.startDate.getTime() ===
              new Date(r.startDate as string).getTime()
            );
          });
          if (roadInThisDate > -1) {
            const roadsDate = roadsArray.at(roadInThisDate);
            const veichleIndex = roadsDate.value.veichles.findIndex(
              (v: any) => v.veichleId === r.roadsVeichles.veichle.id
            );
            const veichlesArray = roadsDate.get('veichles') as FormArray;
            veichlesArray.at(veichleIndex).patchValue({ quantity: r.quantity });
          } else {
            const newRoad = new FormGroup({
              startDate: new FormControl(new Date(r.startDate as string)),
              startDateHour: new FormControl(new Date(r.startDate as string)),
              roadId: new FormControl(roadId),
              veichles: new FormArray([]),
            });
            const veichlesArray = newRoad.get('veichles') as FormArray;
            for (const rv of road.roadsVeichles) {
              const group = new FormGroup({
                veichle: new FormControl(rv.veichle.name),
                veichleId: new FormControl(rv.veichle.id),
                roadVeichleId: new FormControl(rv.id),
                price: new FormControl(rv.price),
                quantity: new FormControl(
                  r.roadsVeichles.veichle.id === rv.veichle.id ? r.quantity : 0
                ),
              });
              veichlesArray.push(group);
            }
            const roadsArray = roads.at(roadIndex).get('roads') as FormArray;
            roadsArray.push(newRoad);
          }
        } else {
          const newRoad = new FormGroup({
            startDate: new FormControl(new Date(r.startDate as string)),
            startDateHour: new FormControl(new Date(r.startDate as string)),
            roadId: new FormControl(roadId),
            veichles: new FormArray([]),
          });
          const veichlesArray = newRoad.get('veichles') as FormArray;
          for (const rv of road.roadsVeichles) {
            const group = new FormGroup({
              veichle: new FormControl(rv.veichle.name),
              veichleId: new FormControl(rv.veichle.id),
              roadVeichleId: new FormControl(rv.id),
              price: new FormControl(rv.price),
              quantity: new FormControl(
                r.roadsVeichles.veichle.id === rv.veichle.id ? r.quantity : 0
              ),
            });
            veichlesArray.push(group);
          }
          const roadsArray = roads.at(roadIndex).get('roads') as FormArray;
          roadsArray.push(newRoad);
        }
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
   * Chiamato quando apro lo step del recap
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
              return { name: r.name, surname: r.surname, category: r.category };
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
      if (r.roads && r.roads.length) {
        for (const road of r.roads) {
          for (const roadVeichle of road.veichles) {
            if (roadVeichle.quantity) {
              const cartRoads = this.cartForm.get('roads') as FormArray;
              const startDateHour = new Date(road.startDateHour).getHours();
              const startDateMinute = new Date(road.startDateHour).getMinutes();
              const startDate = new Date(road.startDate);
              startDate.setHours(startDateHour, startDateMinute);
              cartRoads.push(
                new FormGroup({
                  roadVeichleId: new FormControl(roadVeichle.roadVeichleId),
                  quantity: new FormControl(roadVeichle.quantity),
                  startDate: new FormControl(startDate),
                  veichle: new FormControl(roadVeichle.veichle),
                  from: new FormControl(r.from),
                  to: new FormControl(r.to),
                  price: new FormControl(roadVeichle.price),
                })
              );
            }
          }
        }
      }
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

  updateStatus(status: EStatusCart) {
    const messages = {
      [EStatusCart.CANCELLED]:
        'Sei sicuro di voler annullare questa trasferta?',
      [EStatusCart.CONFIRMED]:
        'Sei sicuro di voler confermare questa trasferta?',
      [EStatusCart.DEPOSIT]:
        "Sei sicuro di voler confermare il pagamento dell'acconto?",
      [EStatusCart.COMPLETED]:
        'Sei sicuro di voler completare questa trasferta?',
      [EStatusCart.DRAFT]: '',
      [EStatusCart.PENDING]: '',
    };
    this.confirmationService.confirm({
      message: messages[status],
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartApiService
          .update(this.cartId, { status, onlyStatus: true })
          .pipe(
            take(1),
            tap(() => {
              setTimeout(
                () =>
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Operazione completata',
                  }),
                100
              );
              this.router.navigate(['cart', this.cartId]);
            })
          )
          .subscribe();
      },
    });
  }

  backToCart() {
    this.fromBackoffice
      ? this.router.navigate(['cart', this.cartId])
      : this.cartId
      ? this.router.navigate(['personal', 'carts', this.cartId])
      : this.router.navigate(['personal', 'carts']);
  }
}
