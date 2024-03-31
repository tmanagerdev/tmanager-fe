import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-cart-create-road',
  templateUrl: './cart-create-road.component.html',
  styleUrls: ['./cart-create-road.component.scss'],
})
export class CartCreateRoadComponent implements OnInit {
  ref!: DynamicDialogRef;
  firstIndex: number = 0;
  searchControl = new FormControl('');
  qtaOptions = [...Array(21).keys()];
  coordRoadToDelete: any;
  _isDisabledCart: boolean = false;

  @Input() event: any;
  @Input() activeIndex: number = 0;
  @Input() veichles: any = [];
  @Input() roadForm: FormGroup = new FormGroup({});
  @Input() maxPax = 0;

  @Input() set isDisabledCart(value: boolean) {
    if (value) {
      this._isDisabledCart = value;
      if (this._isDisabledCart) {
        this.roadForm.get('roadNotes')?.disable();

        for (const c of this.roadsArray.controls) {
          const roads = c.get('roads') as FormArray;
          for (const rc of roads.controls) {
            rc.get('startDate')?.disable();
            rc.get('startDateHour')?.disable();
            const veichles = rc.get('veichles') as FormArray;
            for (const vc of veichles.controls) {
              vc.get('quantity')?.disable();
            }
          }
        }
      }
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  items: MenuItem[] = [
    {
      label: 'Elimina',
      icon: 'pi pi-trash',
      command: () => {
        const road = this.roadsArray.value.findIndex(
          (ar: any) => ar.id === this.coordRoadToDelete.roadId
        );
        const array = this.roadsArray.at(road).get('roads') as FormArray;
        array.removeAt(this.coordRoadToDelete.index);
      },
    },
  ];

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

  onAddRoad(road: any) {
    const startDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);
    const newRoad = new FormGroup({
      startDate: new FormControl(startDate),
      startDateHour: new FormControl(startDate),
      roadId: new FormControl(road.value.id),
      veichles: new FormArray([]),
    });
    const veichlesArray = newRoad.get('veichles') as FormArray;
    for (const rv of road.value.roadsVeichles) {
      const group = new FormGroup({
        veichle: new FormControl(rv.veichle.name),
        veichleId: new FormControl(rv.veichle.id),
        roadVeichleId: new FormControl(rv.id),
        price: new FormControl(rv.price),
        quantity: new FormControl(0),
      });
      veichlesArray.push(group);
    }

    const roadsArray = road.get('roads') as FormArray;
    roadsArray.push(newRoad);
  }

  getRoads(road: any) {
    return this.roadsValue.filter((r: any) => r.road.id === road.id);
  }

  onToggleMenu(roadId: number, index: any, menu: any, event: any) {
    this.coordRoadToDelete = { roadId, index };
    menu.toggle(event);
  }

  getRoadFG(road: any) {
    return road as FormGroup;
  }

  getRoadFA(road: any) {
    return road.get('roads') as FormArray;
  }

  getVeichlesFG(road: any) {
    return road as FormGroup;
  }

  getVeichlesFA(road: any) {
    return road.get('veichles') as FormArray;
  }
}
