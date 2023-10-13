import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { ModalRoadComponent } from './modal-road/modal-road.component';
import { EStatusCart } from 'src/app/@core/models/cart.model';

@Component({
  selector: 'app-cart-create-road',
  templateUrl: './cart-create-road.component.html',
  styleUrls: ['./cart-create-road.component.scss'],
})
export class CartCreateRoadComponent implements OnInit {
  veichles: any = [];
  ref!: DynamicDialogRef;
  totalRecords = 0;
  page: number = 0;
  size: number = 5;
  city: number = 0;
  _event: any;
  firstIndex: number = 0;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;

  searchControl = new FormControl('');

  @Input() set event(value: any) {
    this._event = value;
    this.city = value.home.city.id;
    this.loadVeichles();
  }

  @Input() activeIndex: number = 0;
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
      if (value !== EStatusCart.DRAFT) {
        this.roadForm.get('roadNotes')?.disable();
      }
    }
  }
  @Input() roadForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  veichle$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get roads(): FormArray {
    return this.roadForm.get('roads') as FormArray;
  }

  get roadsValue(): any {
    return this.roadForm.get('roads')?.value;
  }

  get search() {
    return this.searchControl.value;
  }

  get event() {
    return this._event;
  }

  constructor(
    private veichleApiService: VeichleApiService,
    private dialogService: DialogService
  ) {
    this.veichle$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.veichleApiService.findAllRoad({
            ...(this.search ? { search: this.search } : null),
            ...(this.city ? { city: this.city } : null),
          })
        ),
        tap((veichles: any) => (this.veichles = [...veichles]))
      )
      .subscribe();
  }

  ngOnInit(): void {}

  loadVeichles() {
    this.veichle$.next();
  }

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onUpdateRoad(indexRoads: number) {
    const index = indexRoads + this.firstIndex;
    const roadToUpdate = this.roads.at(index) as FormGroup;

    this.ref = this.dialogService.open(ModalRoadComponent, {
      header: 'Aggiorna tratta',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        roadForm: roadToUpdate,
        isEdit: true,
        index: indexRoads + 1,
        veichlesList: this.veichles,
      },
    });

    this.ref.onClose.subscribe((road: FormGroup) => {
      if (road) {
        this.roads.at(index).setValue({ ...road.value });
      }
    });
  }

  onDeleteRoad(indexRoads: number) {
    this.roads.removeAt(indexRoads + this.firstIndex);
  }

  onAddRoad() {
    const startDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    const newRoad = new FormGroup({
      startDate: new FormControl(startDate),
      startDateHour: new FormControl(startDate),
      veichle: new FormControl(null),
      quantity: new FormControl(1),
      id: new FormControl(null),
      price: new FormControl(null),
      from: new FormControl(null),
      to: new FormControl(null),
      veichleId: new FormControl(null),
      createdAt: new FormControl(null),
      updatedAt: new FormControl(null),
    });

    this.ref = this.dialogService.open(ModalRoadComponent, {
      header: 'Aggiungi nuova tratta',
      width: '700px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: false,
        roadForm: newRoad,
        index: this.roads.length + 1,
        veichlesList: this.veichles,
      },
    });

    this.ref.onClose.subscribe((road: FormGroup) => {
      if (road) {
        this.roads.push(road);
      }
    });
  }

  onPage({ first, rows }: any) {
    this.firstIndex = first;
  }
}
