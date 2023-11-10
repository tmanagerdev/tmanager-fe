import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { IDropdownFilters } from 'src/app/@core/models/base.model';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { ITeam } from 'src/app/@core/models/team.model';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
  selector: 'app-personal-cart-list',
  templateUrl: './personal-cart-list.component.html',
  styleUrls: ['./personal-cart-list.component.scss'],
})
export class PersonalCartListComponent implements OnInit {
  events: any = [];
  teams: Partial<ITeam>[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  startDateFilter?: Date;
  endDateFilter?: Date;
  sort: any = null;
  loading: boolean = false;
  currentUser: any;
  EStatusCart = EStatusCart;

  teamHomeFilter = new UntypedFormControl('');
  dateFilter = new UntypedFormControl('');
  teamsFilter: FormControl = new FormControl([]);

  events$: Subject<void> = new Subject();
  teams$: Subject<string> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get teamHomeFilterId() {
    return this.teamHomeFilter.value ? this.teamHomeFilter.value.id : null;
  }

  constructor(
    private cartsApiService: CartApiService,
    private eventsApiService: EventApiService,
    private teamApiService: TeamApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.events$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.eventsApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { away: this.filter } : {}),
            ...(this.teamHomeFilterId ? { home: this.teamHomeFilterId } : {}),
            ...(this.startDateFilter
              ? { startDate: this.startDateFilter.toISOString() }
              : {}),
            ...(this.endDateFilter
              ? { endDate: this.endDateFilter.toISOString() }
              : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.events = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.teams$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap((name) =>
          this.teamApiService.findAll({
            page: 1,
            take: 50,
            ...(name ? { name } : {}),
          })
        ),
        tap(({ data }) => {
          this.teams = [...data];
        })
      )
      .subscribe();

    this.currentUser = this.authService.currentUser;
  }

  ngOnInit() {}

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  loadCarts() {
    this.events = [];
    this.loading = true;
    this.events$.next();
  }

  openViewCart(cart: any) {
    this.router.navigate(['/personal/carts', cart.id]);
  }

  openCreateCart(event: any) {
    this.router.navigate(['/personal/carts/new', event.id]);
  }

  onChangePage(event: any) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder,
      };
    } else {
      this.sort = null;
    }

    this.loadCarts();
  }

  onApplyFilters() {
    this.filter = this.teamsFilter.value?.id ?? '';
    this.startDateFilter =
      this.dateFilter.value && this.dateFilter.value[0]
        ? this.dateFilter.value[0]
        : '';
    this.endDateFilter =
      this.dateFilter.value && this.dateFilter.value[1]
        ? this.dateFilter.value[1]
        : '';
    this.loadCarts();
  }

  complete(cart: any) {
    this.confirmationService.confirm({
      message:
        'Una volta confermata la trasferta non potrà più essere modificata e verrà inviata una mail al nostro staff. Si intende procedere?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartsApiService
          .update(cart.id, { status: EStatusCart.PENDING })
          .pipe(
            take(1),
            tap(() => {
              this.loadCarts();
              this.messageService.add({
                severity: 'success',
                summary: 'Trasferta confermata',
                detail: 'Verrà inviata una mail di notifica al nostro staff',
              });
            })
          )
          .subscribe();
      },
    });
  }

  onAddCart() {
    console.log('custom cart');
  }

  onFilterTeam({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredTeams(filter);
    }
  }

  loadFilteredTeams(name: string) {
    this.teams$.next(name);
  }

  onFilterDate(event: any) {
    console.log(event);
  }
}
