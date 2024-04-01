import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { RoadApiService } from 'src/app/@core/api/road-api.service';
import { IRoad } from 'src/app/@core/models/road.model';
import { RoadTeamsModalComponent } from './road-teams-modal/road-teams-modal.component';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-road-teams',
  templateUrl: './road-teams.component.html',
  styleUrls: ['./road-teams.component.scss'],
})
export class RoadTeamsComponent {
  roadId: number = 0;
  road?: Partial<IRoad>;
  totalRecords: number = 0;
  loading: boolean = false;

  road$: Subject<void> = new Subject();
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

    this.road$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.roadApiService.findOne(this.roadId)),
        tap((data) => {
          this.loading = false;
          this.road = { ...data };
          this.totalRecords = this.road?.teams?.length ?? 0;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadHotel();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadHotel(): void {
    if (this.road && this.road.teams) {
      this.road.teams = [];
    }
    this.loading = true;
    this.road$.next();
  }

  create() {
    this.ref = this.dialogService.open(RoadTeamsModalComponent, {
      header: `Associa nuova squadra`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((team: ITeam) => {
      if (team) {
        this.roadApiService
          .addTeam(this.roadId, team.id)
          .pipe(
            take(1),
            tap((data) => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra aggiunta',
                detail: data.name,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(team: ITeam) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler rimuovere questa squadra?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.roadApiService
          .removeTeam(this.roadId, team.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadHotel();
              this.messageService.add({
                severity: 'success',
                summary: 'Squadra disassociata',
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
