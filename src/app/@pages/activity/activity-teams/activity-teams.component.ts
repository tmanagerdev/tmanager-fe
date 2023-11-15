import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { ActivityApiService } from 'src/app/@core/api/activity-api.service';
import { IActivity } from 'src/app/@core/models/activity.model';
import { ActivityTeamsModalComponent } from './activity-teams-modal/activity-teams-modal.component';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-activity-teams',
  templateUrl: './activity-teams.component.html',
  styleUrls: ['./activity-teams.component.scss'],
})
export class ActivityTeamsComponent {
  activityId: number = 0;
  activity?: Partial<IActivity>;
  totalRecords: number = 0;
  loading: boolean = false;

  activity$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private activityApiService: ActivityApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.activityId = this.route.snapshot.params['id'];

    this.activity$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.activityApiService.findOne(this.activityId)),
        tap((data) => {
          this.loading = false;
          this.activity = { ...data };
          this.totalRecords = this.activity?.teams?.length ?? 0;
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
    if (this.activity && this.activity.teams) {
      this.activity.teams = [];
    }
    this.loading = true;
    this.activity$.next();
  }

  create() {
    this.ref = this.dialogService.open(ActivityTeamsModalComponent, {
      header: `Associa nuova squadra`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((team: ITeam) => {
      if (team) {
        this.activityApiService
          .addTeam(this.activityId, team.id)
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
        this.activityApiService
          .removeTeam(this.activityId, team.id)
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

  backToActivities() {
    this.router.navigate(['/activity']);
  }
}
