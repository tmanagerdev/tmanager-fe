import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormControl,
  FormGroup,
  UntypedFormGroup,
} from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, debounceTime, map, switchMap, takeUntil, tap } from 'rxjs';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { clearFormArray } from 'src/app/@core/utils';
import { ModalActivityComponent } from './modal-activity/modal-activity.component';

@Component({
  selector: 'app-cart-create-activity',
  templateUrl: './cart-create-activity.component.html',
  styleUrls: ['./cart-create-activity.component.scss'],
})
export class CartCreateActivityComponent {
  _event: any;
  selectedHotel: any = null;
  totalRecords = 0;
  page: number = 0;
  size: number = 6;
  loading: boolean = false;
  selectedActivities: any = [];
  filter: string = '';
  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;

  ref!: DynamicDialogRef;

  searchFilter = new FormControl('');
  //_activityForm: UntypedFormGroup = new FormGroup({});

  @Input() event: any;
  @Input() cityActivities: any = [];
  @Input() activityForm: FormGroup = new FormGroup({});
  @Input() activeIndex: number = 0;
  @Input() set status(value: EStatusCart) {
    if (value) {
      this._status = value;
      if (value !== EStatusCart.DRAFT) {
      }
    }
  }

  @Output() nextStep: EventEmitter<void> = new EventEmitter();
  @Output() prevStep: EventEmitter<void> = new EventEmitter();

  activity$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get activities() {
    return this.activityForm.get('activities') as FormArray;
  }

  get activitiesValue(): any {
    return this.activityForm.get('activities')?.value;
  }

  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadActivities() {
    this.activity$.next();
  }

  onNextStep() {
    this.nextStep.emit();
  }

  onPrevStep() {
    this.prevStep.emit();
  }

  onUpdateActivity(index: number) {
    const activityToUpdate = this.activities.at(index) as FormGroup;

    this.ref = this.dialogService.open(ModalActivityComponent, {
      header: 'Aggiorna attività',
      width: '900px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        activityForm: activityToUpdate,
        isEdit: true,
        index: index + 1,
        activitiesList: this.cityActivities,
      },
    });

    this.ref.onClose.subscribe((activity: FormGroup) => {
      if (activity) {
        this.activities.at(index).setValue({ ...activity.value });
      }
    });
  }

  onDeleteActivity(index: number) {
    this.activities.removeAt(index);
  }

  onAddActivity() {
    const startDate = new Date(this.event.date);
    startDate.setDate(startDate.getDate() - 1);
    startDate.setHours(0, 0, 0, 0);

    const newActivity = new FormGroup({
      startDate: new FormControl(startDate),
      startDateHour: new FormControl(startDate),
      quantity: new FormControl(1),
      id: new FormControl(null),
      name: new FormControl(null),
      description: new FormControl(null),
      price: new FormControl(null),
    });

    this.ref = this.dialogService.open(ModalActivityComponent, {
      header: 'Aggiungi nuova attività',
      width: '900px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: false,
        activityForm: newActivity,
        index: this.activities.length + 1,
        activitiesList: this.cityActivities,
      },
    });

    this.ref.onClose.subscribe((activity: FormGroup) => {
      if (activity) {
        this.activities.push(activity);
      }
    });
  }
}
