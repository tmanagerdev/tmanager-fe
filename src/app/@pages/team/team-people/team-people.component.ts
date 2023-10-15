import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, forkJoin, switchMap, take, takeUntil, tap } from 'rxjs';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { TeamPeopleModalComponent } from './team-people-modal/team-people-modal.component';

@Component({
  selector: 'app-team-people',
  templateUrl: './team-people.component.html',
  styleUrls: ['./team-people.component.scss'],
})
export class TeamPeopleComponent {
  teamId: number = 0;
  people: any;
  team: any;
  totalRecords: number = 0;
  loading: boolean = false;

  people$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private teamApiService: TeamApiService,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private router: Router
  ) {
    this.teamId = this.route.snapshot.params['id'];

    this.people$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          forkJoin([
            this.teamApiService.findOne(this.teamId),
            this.teamApiService.findPeople(this.teamId),
          ])
        ),
        tap(([team, people]) => {
          this.loading = false;
          this.people = [...people.data];
          this.team = { ...team };
          this.totalRecords = this.people.length;
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadTeam();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadTeam(): void {
    if (this.people) {
      this.people = [];
    }
    this.loading = true;
    this.people$.next();
  }

  create() {
    this.ref = this.dialogService.open(TeamPeopleModalComponent, {
      header: `Aggiungi nuovo membro`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });
    this.ref.onClose.subscribe((newPeople: any) => {
      if (newPeople) {
        this.teamApiService
          .createPeople({ ...newPeople, team: Number(this.teamId) })
          .pipe(
            take(1),
            tap((data) => {
              this.loadTeam();
              this.messageService.add({
                severity: 'success',
                summary: 'Membro aggiunto',
                detail: newPeople.surname,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(people: any) {
    this.ref = this.dialogService.open(TeamPeopleModalComponent, {
      header: `Aggiorna membro`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: true,
        people,
      },
    });
    this.ref.onClose.subscribe((newPeople: any) => {
      if (newPeople) {
        this.teamApiService
          .updatePeople(people.id, newPeople)
          .pipe(
            take(1),
            tap((data) => {
              this.loadTeam();
              this.messageService.add({
                severity: 'success',
                summary: 'Membro aggiornato',
                detail: newPeople.surname,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(people: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler rimuovere questo membro?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.teamApiService
          .deletePeople(people.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadTeam();
              this.messageService.add({
                severity: 'success',
                summary: 'Membro rimosso',
                detail: people.surname,
              });
            })
          )
          .subscribe();
      },
    });
  }

  backToTeams() {
    this.router.navigate(['team']);
  }
}
