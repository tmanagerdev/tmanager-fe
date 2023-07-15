import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';

@Component({
  selector: 'app-hotel-modal',
  templateUrl: './hotel-modal.component.html',
  styleUrls: ['./hotel-modal.component.scss'],
})
export class HotelModalComponent {
  hotel: any;
  isEdit: boolean = false;
  cities: any[] = [];

  hotelForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    city: new FormControl(''),
  });

  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cityApiService: CityApiService
  ) {
    if (this.config.data) {
      this.hotel = this.config.data.hotel;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.hotelForm.patchValue(this.hotel);
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
    if (this.hotelForm.valid) {
      const { city, ...hotel } = this.hotelForm.value;
      this.ref.close({ ...hotel, city: city.id });
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
