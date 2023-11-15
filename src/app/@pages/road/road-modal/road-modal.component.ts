import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { ICity } from 'src/app/@core/models/city.model';
import { IRoad } from 'src/app/@core/models/road.model';

@Component({
  selector: 'app-road-modal',
  templateUrl: './road-modal.component.html',
  styleUrls: ['./road-modal.component.scss'],
})
export class RoadModalComponent {
  road: Partial<IRoad> = {};
  isEdit: boolean = false;
  cities: Partial<ICity>[] = [];

  roadForm: FormGroup = new FormGroup({
    from: new FormControl('', Validators.required),
    to: new FormControl('', Validators.required),
    city: new FormControl(''),
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
      this.road = this.config.data.road;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.roadForm.patchValue(this.road);
        this.cities.push({ ...this.road.city });
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
    if (this.roadForm.valid) {
      const road = this.roadForm.value;
      this.ref.close(road);
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
