import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { ServiceApiService } from 'src/app/@core/api/service-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';

@Component({
  selector: 'app-hotel-service-modal',
  templateUrl: './hotel-service-modal.component.html',
  styleUrls: ['./hotel-service-modal.component.scss'],
})
export class HotelServiceModalComponent {
  service: any;
  services: Partial<any>[] = [];

  isEdit: boolean = false;

  service$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  serviceControl: FormControl = new FormControl('', Validators.required);

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private serviceApiService: ServiceApiService
  ) {
    if (this.config.data) {
      this.service = this.config.data.service;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.serviceControl.patchValue(this.service);
      }
    }

    this.service$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.serviceApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.services = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.serviceControl.valid) {
      const service = { ...this.serviceControl.value };
      this.ref.close(service);
    }
  }

  loadFilteredServices(name: string) {
    this.service$.next(name);
  }

  onFilterTeam({ filter }: IDropdownFilters) {
    if (filter && filter.length > 2) {
      this.loadFilteredServices(filter);
    }
  }
}
