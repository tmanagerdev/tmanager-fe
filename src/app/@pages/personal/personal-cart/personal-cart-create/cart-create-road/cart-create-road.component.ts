import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { ModalRoadComponent } from './modal-road/modal-road.component';

@Component({
  selector: 'app-cart-create-road',
  templateUrl: './cart-create-road.component.html',
  styleUrls: ['./cart-create-road.component.scss'],
})
export class CartCreateRoadComponent implements OnInit {
  veichles: any = [];
  ref!: DynamicDialogRef;

  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() roadForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  veichle$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get roads(): any {
    return this.roadForm.get('roads') as FormArray;
  }

  constructor(
    private veichleApiService: VeichleApiService,
    private dialogService: DialogService
  ) {
    this.veichle$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.veichleApiService.findAll({
            take: 200,
            page: 1,
          })
        ),
        map((data) => data.data),
        tap((veichles) => (this.veichles = [...veichles]))
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadVeichles();
  }

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
    const roadToUpdate = this.roads.at(indexRoads) as FormGroup;
    console.log('roadToUpdate', roadToUpdate.value);

    this.ref = this.dialogService.open(ModalRoadComponent, {
      header: 'Aggiorna tratta',
      width: '700px',
      height: '700px',
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
      console.log('road', road);
      // if (road) {
      //   this.roads.push(road);
      // }
    });
  }

  onDeleteRoad(indexRoads: number) {
    this.roads.removeAt(indexRoads);
  }

  onAddRoad() {
    const startDate = new Date(this.event.date);
    const endDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    endDate.setDate(endDate.getDate() - 1);
    endDate.setHours(0, 0, 0, 0);

    const newRoad = new FormGroup({
      from: new FormControl(null),
      to: new FormControl(null),
      startDate: new FormControl(startDate),
      endDate: new FormControl(endDate),
      veichles: new FormArray([]),
    });

    console.log('new Road', newRoad.value);

    const newVeichle = new FormGroup({
      veichle: new FormControl(null),
      quantity: new FormControl(null),
    });

    (newRoad.get('veichles') as FormArray)?.push(newVeichle);

    this.ref = this.dialogService.open(ModalRoadComponent, {
      header: 'Aggiungi nuova tratta',
      width: '700px',
      height: '700px',
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
      console.log('road', road);
      if (road) {
        this.roads.push(road);
      }
    });
  }
}
