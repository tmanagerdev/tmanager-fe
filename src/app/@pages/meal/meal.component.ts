import { Component, DestroyRef, inject } from '@angular/core';
import { Subject, map, switchMap, take, tap } from 'rxjs';
import { MealApiService } from 'src/app/@core/api/meal-api.service';
import { IMeal, IMealConfig } from 'src/app/@core/models/meal.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MealModalComponent } from './meal-modal/meal-modal.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MealConfigModalComponent } from './meal-config-modal/meal-config-modal.component';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.scss'],
})
export class MealComponent {
  meals: any;
  private destroyRef = inject(DestroyRef);
  ref!: DynamicDialogRef;

  meals$: Subject<void> = new Subject();

  constructor(
    private mealApiService: MealApiService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.meals$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => this.mealApiService.findAll({ take: 200, page: 1 })),
        map((data) => data.data),
        tap((data) => (this.meals = [...data]))
      )
      .subscribe();
  }

  ngOnInit() {
    this.loadMeals();
  }

  loadMeals() {
    this.meals$.next();
  }

  create() {
    this.ref = this.dialogService.open(MealModalComponent, {
      header: `Crea nuovo pasto`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newMeal: IMeal) => {
      if (newMeal) {
        this.mealApiService
          .create(newMeal)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto creato',
                detail: newMeal.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(meal: IMeal) {
    this.ref = this.dialogService.open(MealModalComponent, {
      header: `Aggiorna ${meal.name}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        meal,
        isEdit: true,
      },
    });

    this.ref.onClose.subscribe((newMeal: IMeal) => {
      if (newMeal) {
        this.mealApiService
          .update(meal.id, newMeal)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto aggiornato',
                detail: newMeal.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(meal: Partial<IMeal>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo pasto?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mealApiService
          .delete(meal.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto eliminato',
                detail: meal.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  createConfig(meal: IMeal) {
    this.ref = this.dialogService.open(MealConfigModalComponent, {
      header: `Aggiungi tipologia`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((config: IMealConfig) => {
      if (config) {
        this.mealApiService
          .createConfig(meal.id, config)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Tipologia pasto aggiunta',
                detail: config.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  updateConfig(config: IMealConfig) {
    this.ref = this.dialogService.open(MealConfigModalComponent, {
      header: `Aggiorna ${config.name}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        config,
        isEdit: true,
      },
    });

    this.ref.onClose.subscribe((newConfig: IMealConfig) => {
      if (newConfig) {
        this.mealApiService
          .updateConfig(config.id, newConfig)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Pasto aggiornato',
                detail: newConfig.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  removeConfig(mconfig: Partial<IMealConfig>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa tipologia pasto?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.mealApiService
          .deleteConfig(mconfig.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadMeals();
              this.messageService.add({
                severity: 'success',
                summary: 'Tipologia pasto eliminata',
                detail: mconfig.name,
              });
            })
          )
          .subscribe();
      },
    });
  }
}
