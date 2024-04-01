import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { IActivity } from 'src/app/@core/models/activity.model';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { ICity } from 'src/app/@core/models/city.model';

@Component({
  selector: 'app-activity-modal',
  templateUrl: './activity-modal.component.html',
  styleUrls: ['./activity-modal.component.scss'],
})
export class ActivityModalComponent {
  activity: Partial<IActivity> = {};
  isEdit: boolean = false;
  cities: Partial<ICity>[] = [];

  activityForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl(''),
    city: new FormControl(''),
    enabled: new FormControl(false),
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
        this.activityForm.patchValue(this.activity);
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

  onFilterCities({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredCities(filter);
    }
  }
}
