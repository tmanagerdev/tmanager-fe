import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { Subject, debounceTime, map, switchMap, takeUntil, tap } from 'rxjs';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { clearFormArray } from 'src/app/@core/utils';

@Component({
  selector: 'app-cart-create-activity',
  templateUrl: './cart-create-activity.component.html',
  styleUrls: ['./cart-create-activity.component.scss'],
})
export class CartCreateActivityComponent {
  _event: any;
  activities: any = [];
  selectedHotel: any = null;
  totalRecords = 0;
  page: number = 0;
  size: number = 6;
  loading: boolean = false;
  selectedActivities: any = [];
  filter: string = '';

  searchFilter = new FormControl('');
  _activityForm: UntypedFormGroup = new FormGroup({});

  @Input() activeIndex: number = 0;
  @Input() set event(event: any) {
    if (event) {
      this._event = event;
      this.loadActivities();
    }
  }
  @Input() set activityForm(value: FormGroup) {
    if (value) {
      this._activityForm = value;
      this.selectedActivities = value.get('activities')?.value;
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  activity$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get activitiesArray() {
    return this._activityForm.get('activities') as FormArray;
  }

  constructor(private activityApiService: ActivityApiService) {
    this.activity$
      .pipe(
        takeUntil(this.unsubscribe$),
        tap(() => (this.loading = true)),
        switchMap(() =>
          this.activityApiService.findAll({
            ...(this.filter ? { name: this.filter } : {}),
            take: this.size,
            page: this.page + 1,
            city: this._event.home.city.id,
          })
        ),
        tap(({ data, total }) => {
          this.activities = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadActivities();
        })
      )
      .subscribe();
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadActivities() {
    this.activity$.next();
  }

  onNextStep() {
    clearFormArray(this.activitiesArray);
    console.log('loop selected', this.selectedActivities.length);
    for (const a of this.selectedActivities) {
      this.activitiesArray.push(
        new FormGroup({
          id: new FormControl(a.id),
          name: new FormControl(a.name),
          description: new FormControl(a.description),
          price: new FormControl(a.price),
          note: new FormControl(''),
        })
      );
    }
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onChangePage(event: any) {
    this.page = event.first! / event.rows! || 0;

    if (this._event) {
      this.loadActivities();
    }
  }

  onSelectActivity(activity: any) {
    if (this.selectedActivities.find((a: any) => a.id === activity.id)) {
      this.selectedActivities = this.selectedActivities.filter(
        (item: any) => item.id !== activity.id
      );
    } else {
      this.selectedActivities.push(activity);
    }
  }

  checkIfSelected(id: number) {
    return this.selectedActivities.find((a: any) => a.id === id);
  }
}
