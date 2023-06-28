import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Subject, map, switchMap, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';

@Component({
  selector: 'app-cart-create-road',
  templateUrl: './cart-create-road.component.html',
  styleUrls: ['./cart-create-road.component.scss'],
})
export class CartCreateRoadComponent implements OnInit {
  veichles: any = [];

  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() roadForm: FormGroup = new FormGroup({});

  @Output() nextStep: EventEmitter<number> = new EventEmitter();
  @Output() prevStep: EventEmitter<number> = new EventEmitter();

  veichle$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get roads(): any {
    return this.roadForm.get('roads') as FormArray;
  }

  constructor(private veichleApiService: VeichleApiService) {
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
    console.log(this.roads.value);
    //this.nextStep.emit(this.activeIndex);
  }

  onPrevStep() {
    this.prevStep.emit(this.activeIndex);
  }

  onAddRoad() {
    const newRoad = new FormGroup({
      from: new FormControl(null),
      to: new FormControl(null),
      startDate: new FormControl(null),
      veichles: new FormArray([]),
    });

    const newVeichle = new FormGroup({
      veichle: new FormControl(null),
      quantity: new FormControl(null),
    });

    (newRoad.get('veichles') as FormArray)?.push(newVeichle);

    this.roads.push(newRoad);
  }

  onAddVeichle(indexRoads: number) {
    const veichle = this.roads.at(indexRoads).get('veichles') as FormArray;
    const newVeichle = new FormGroup({
      veichle: new FormControl(null),
      quantity: new FormControl(null),
    });
    veichle.push(newVeichle);
  }

  onRemoveVeichle(indexRoads: number, indexVeichle: number) {
    const veichle = this.roads.at(indexRoads).get('veichles') as FormArray;
    veichle.removeAt(indexVeichle);
  }
}
