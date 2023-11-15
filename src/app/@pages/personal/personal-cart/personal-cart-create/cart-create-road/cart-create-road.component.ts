import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ModalRoadComponent } from './modal-road/modal-road.component';
import { EStatusCart } from 'src/app/@core/models/cart.model';

@Component({
  selector: 'app-cart-create-road',
  templateUrl: './cart-create-road.component.html',
  styleUrls: ['./cart-create-road.component.scss'],
})
export class CartCreateRoadComponent implements OnInit {
  ref!: DynamicDialogRef;
  firstIndex: number = 0;
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;
  searchControl = new FormControl('');

  @Input() event: any;
  @Input() activeIndex: number = 0;
  @Input() veichles: any = [];
  @Input() roads: any = [];
  @Input() roadForm: FormGroup = new FormGroup({});
  @Input() maxPax = 0;
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
      if (value !== EStatusCart.DRAFT) {
        this.roadForm.get('roadNotes')?.disable();
      }
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  get roadsArray(): FormArray {
    return this.roadForm.get('roads') as FormArray;
  }

  get roadsValue(): any {
    return this.roadForm.get('roads')?.value;
  }

  get search() {
    return this.searchControl.value;
  }

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onUpdateRoad(indexRoads: number) {
    const index = indexRoads + this.firstIndex;
    const roadToUpdate = this.roadsArray.at(index) as FormGroup;

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
        roadsList: this.roads,
        maxPax: this.maxPax,
      },
    });

    this.ref.onClose.subscribe((road: FormGroup) => {
      if (road) {
        this.roadsArray.at(index).setValue({ ...road.value });
      }
    });
  }

  onDeleteRoad(indexRoads: number) {
    this.roadsArray.removeAt(indexRoads + this.firstIndex);
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
      road: new FormControl(null),
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
        index: this.roadsArray.length + 1,
        veichlesList: this.veichles,
        roadsList: this.roads,
        maxPax: this.maxPax,
      },
    });

    this.ref.onClose.subscribe((road: FormGroup) => {
      if (road) {
        this.roadsArray.push(road);
      }
    });
  }
}
