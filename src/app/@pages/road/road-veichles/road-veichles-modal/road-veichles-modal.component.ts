import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { IVeichle } from 'src/app/@core/models/veichle.model';

@Component({
  selector: 'app-road-veichles-modal',
  templateUrl: './road-veichles-modal.component.html',
  styleUrls: ['./road-veichles-modal.component.scss'],
})
export class RoadVeichlesModalComponent {
  roadVeichle: any;
  isEdit: boolean = false;
  veichles: Partial<IVeichle>[] = [];

  roadVeichleForm: FormGroup = new FormGroup({
    price: new FormControl('', Validators.required),
    veichle: new FormControl('', Validators.required),
  });

  veichles$: Subject<string> = new Subject();
  destroy$: Subject<void> = new Subject();

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private veichleApiService: VeichleApiService
  ) {
    if (this.config.data) {
      this.roadVeichle = this.config.data.roadVeichle;
      this.isEdit = this.config.data.isEdit;
      if (this.isEdit) {
        this.roadVeichleForm.patchValue(this.roadVeichle);
        this.veichles.push({ ...this.roadVeichle.veichle });
      }
    }

    this.veichles$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((name) =>
          this.veichleApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.veichles = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSave() {
    if (this.roadVeichleForm.valid) {
      const roadVeichle = this.roadVeichleForm.value;
      this.ref.close(roadVeichle);
    }
  }

  loadFilteredVeichles(name: string) {
    this.veichles$.next(name);
  }

  onFilterVeichles({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredVeichles(filter);
    }
  }
}
