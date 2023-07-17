import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent {
  activity: any;
  isEdit: boolean = false;
  cities: any[] = [];

  activityForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    city: new FormControl(''),
    startDate: new FormControl(new Date()),
    endDate: new FormControl(new Date()),
    price: new FormControl(null),
  });

  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cityApiService: CityApiService
  ) {
    if (this.config.data) {
      this.activity = this.config.data.activity;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.activityForm.patchValue({
          ...this.activity,
          startDate: new Date(this.activity.startDate),
          endDate: new Date(this.activity.endDate),
        });
        this.cities.push({ ...this.activity.city });
      }
    }

    this.cities$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.cityApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.cities = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.activityForm.valid) {
      const activity = this.activityForm.value;
      this.ref.close(activity);
    }
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }

  onFilterCities({ filter }: any) {
    if (filter && filter.length > 3) {
      this.loadFilteredCities(filter);
    }
  }
}
