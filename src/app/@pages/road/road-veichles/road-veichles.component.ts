import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { RoadApiService } from 'src/app/@core/api/road-api.service';
import { RoadVeichlesModalComponent } from './road-veichles-modal/road-veichles-modal.component';

@Component({
  selector: 'app-road-veichles',
  templateUrl: './road-veichles.component.html',
  styleUrls: ['./road-veichles.component.scss'],
})
export class RoadVeichlesComponent {
  roadId: number = 0;
  road: any;
  totalRecords: number = 0;
  loading: boolean = false;

  roadsVeichles$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private roadApiService: RoadApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.roadId = this.route.snapshot.params['id'];

    this.roadsVeichles$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.roadApiService.findOne(this.roadId)),
        tap((data) => {
          this.loading = false;
          this.road = { ...data };
          this.totalRecords = this.road.roadsVeichles.length;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadRoadsVeichles();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadRoadsVeichles(): void {
    if (this.road) {
      this.road.roadsVeichles = [];
    }
    this.loading = true;
    this.roadsVeichles$.next();
  }

  create() {
    this.ref = this.dialogService.open(RoadVeichlesModalComponent, {
      header: `Aggiungi veicolo`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((roadVeichle) => {
      if (roadVeichle) {
        console.log('roadVeichle', roadVeichle);
        this.roadApiService
          .addRoadVeichle(
            this.roadId,
            roadVeichle.veichle.id,
            roadVeichle.price
          )
          .pipe(
            take(1),
            tap((data) => {
              this.loadRoadsVeichles();
              this.messageService.add({
                severity: 'success',
                summary: 'Veicolo aggiunto',
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(roadVeichleId: number) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler rimuovere questo veicolo?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roadApiService
          .removeRoadVeichle(roadVeichleId)
          .pipe(
            take(1),
            tap(() => {
              this.loadRoadsVeichles();
              this.messageService.add({
                severity: 'success',
                summary: 'Veicolo rimosso',
              });
            })
          )
          .subscribe();
      },
    });
  }

  backToRoads() {
    this.router.navigate(['/road']);
  }
}
