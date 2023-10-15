import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { VeichleApiService } from 'src/app/@core/api/veichle-api.service';
import { VeichleRoadsModalComponent } from './veichle-roads-modal/veichle-roads-modal.component';

@Component({
  selector: 'app-veichle-roads',
  templateUrl: './veichle-roads.component.html',
  styleUrls: ['./veichle-roads.component.scss'],
})
export class VeichleRoadsComponent {
  veichleId: number = 0;
  veichle: any;
  totalRecords: number = 0;
  loading: boolean = false;

  veichle$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private veichleApiService: VeichleApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.veichleId = this.route.snapshot.params['id'];

    this.veichle$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.veichleApiService.findOne(this.veichleId)),
        tap((data) => {
          this.loading = false;
          this.veichle = { ...data };
          this.totalRecords = this.veichle.roads.length;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadVeichle();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadVeichle(): void {
    if (this.veichle && this.veichle.roads) {
      this.veichle.roads = [];
    }
    this.loading = true;
    this.veichle$.next();
  }

  create() {
    this.ref = this.dialogService.open(VeichleRoadsModalComponent, {
      header: `Crea nuova tratta`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });
    this.ref.onClose.subscribe((newRoad: any) => {
      if (newRoad) {
        this.veichleApiService
          .createRoad(this.veichleId, newRoad)
          .pipe(
            take(1),
            tap((data) => {
              this.loadVeichle();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta creata',
                detail: newRoad.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(road: any) {
    this.ref = this.dialogService.open(VeichleRoadsModalComponent, {
      header: `Aggiorna tratta`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: true,
        road,
      },
    });
    this.ref.onClose.subscribe((newRoad: any) => {
      if (newRoad) {
        this.veichleApiService
          .updateRoad(road.id, newRoad)
          .pipe(
            take(1),
            tap((data) => {
              this.loadVeichle();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta aggiornata',
                detail: newRoad.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(road: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa tratta?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.veichleApiService
          .deleteRoad(road.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadVeichle();
              this.messageService.add({
                severity: 'success',
                summary: 'Tratta eliminata',
                detail: road.name,
              });
            })
          )
          .subscribe();
      },
    });
  }

  backToVeichles() {
    this.router.navigate(['/veichle']);
  }
}
