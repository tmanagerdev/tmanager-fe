import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CityApiService } from 'src/app/@core/api/city-api.service';

@Component({
  selector: 'app-veichle-modal',
  templateUrl: './veichle-modal.component.html',
  styleUrls: ['./veichle-modal.component.scss'],
})
export class VeichleModalComponent {
  veichle: any;
  isEdit: boolean = false;
  cities: any[] = [];

  veichleForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
  });

  cities$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private cityApiService: CityApiService
  ) {
    if (this.config.data) {
      this.veichle = this.config.data.veichle;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.veichleForm.patchValue(this.veichle);
        this.cities.push({ ...this.veichle.city });
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
    if (this.veichleForm.valid) {
      const { city, ...veichle } = this.veichleForm.value;
      this.ref.close({ ...veichle, city: city.id });
    }
  }

  loadFilteredCities(name: string) {
    this.cities$.next(name);
  }

  onFilterCities({ filter }: any) {
    if (filter) {
      this.loadFilteredCities(filter);
    }
  }
}
