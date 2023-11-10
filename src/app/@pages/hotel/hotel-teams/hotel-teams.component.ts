import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { HotelApiService } from 'src/app/@core/api/hotel-api.service';
import { HotelTeamsModalComponent } from './hotel-teams-modal/hotel-teams-modal.component';
import { ITeam } from 'src/app/@core/models/team.model';

@Component({
  selector: 'app-hotel-teams',
  templateUrl: './hotel-teams.component.html',
  styleUrls: ['./hotel-teams.component.scss'],
})
export class HotelTeamsComponent {
  hotelId: number = 0;
  hotel: any;
  totalRecords: number = 0;
  loading: boolean = false;

  hotel$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private hotelApiService: HotelApiService,
    private route: ActivatedRoute,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService
  ) {
    this.hotelId = this.route.snapshot.params['id'];

    this.hotel$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.hotelApiService.findOne(this.hotelId)),
        tap((data) => {
          this.loading = false;
          this.hotel = { ...data };
          this.totalRecords = this.hotel.teams.length;
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
    if (this.hotel && this.hotel.teams) {
      this.hotel.teams = [];
    }
    this.loading = true;
    this.hotel$.next();
  }

  create() {
    this.ref = this.dialogService.open(HotelTeamsModalComponent, {
      header: `Associa nuova squadra`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((team: any) => {
      if (team) {
        this.hotelApiService
          .addTeam(this.hotelId, team.id)
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
        this.hotelApiService
          .removeTeam(this.hotelId, team.id)
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

  backToHotels() {
    this.router.navigate(['/hotel']);
  }
}
