import { Component } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableLazyLoadEvent } from 'primeng/table';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { TeamApiService } from 'src/app/@core/api/team-api.service';
import { UserApiService } from 'src/app/@core/api/user-api.service';
import { IDropdownFilters, ISort } from 'src/app/@core/models/base.model';
import {
  EStatusCart,
  ICart,
  statusCart,
} from 'src/app/@core/models/cart.model';
import { ITeam } from 'src/app/@core/models/team.model';
import { IUser } from 'src/app/@core/models/user.model';

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss'],
})
export class CartListComponent {
  carts: Partial<ICart>[] = [];
  teams: Partial<ITeam>[] = [];
  users: Partial<IUser>[] = [];

  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;
  filterActive: boolean = false;
  statusCart = statusCart;
  EStatusCart = EStatusCart;

  teamFilter = new UntypedFormControl('');
  userFilter = new UntypedFormControl('');
  statusFilter = new UntypedFormControl('');
  completeFilter = new UntypedFormControl(false);

  cities$: Subject<string> = new Subject();
  users$: Subject<string> = new Subject();
  teams$: Subject<string> = new Subject();
  carts$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  get teamFilterId() {
    return this.teamFilter.value ? this.teamFilter.value.id : null;
  }

  get userFilterId() {
    return this.userFilter.value ? this.userFilter.value.id : null;
  }

  get statusFilterValue() {
    return this.statusFilter.value ? this.statusFilter.value.value : null;
  }

  get filterIcon(): string {
    return this.filterActive ? 'pi pi-filter-fill' : 'pi pi-filter';
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cartApiService: CartApiService,
    private userApiService: UserApiService,
    private teamApiService: TeamApiService,
    public dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carts$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.cartApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
            ...(this.userFilterId ? { user: this.userFilterId } : {}),
            ...(this.teamFilterId ? { team: this.teamFilterId } : {}),
            ...(this.statusFilterValue
              ? { status: this.statusFilterValue }
              : {}),
            ...(this.completeFilter.value
              ? { complete: this.completeFilter.value }
              : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.carts = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.teams$
      .pipe(
        takeUntil(this.destroy$),
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

    this.users$
      .pipe(
        takeUntil(this.destroy$),
        switchMap((email) =>
          this.userApiService.findAll({
            page: 1,
            take: 50,
            ...(email ? { email } : {}),
          })
        ),
        tap(({ data }) => {
          this.users = [...data];
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCarts() {
    this.loading = true;
    this.carts = [];
    this.carts$.next();
  }

  onChangePage(event: TableLazyLoadEvent) {
    this.page = event.first! / event.rows! || 0;

    if (event.sortField) {
      this.sort = {
        field: event.sortField,
        order: event.sortOrder ?? 0,
      };
    } else {
      this.sort = null;
    }

    this.loadCarts();
  }

  detail(cart: Partial<ICart>) {
    this.router.navigate(['cart', cart.id]);
  }

  update(cart: Partial<ICart>) {
    this.router.navigate(['cart', 'edit', cart.id]);
  }

  remove(cart: Partial<ICart>) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questa trasferta?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartApiService
          .delete(cart.id!)
          .pipe(
            take(1),
            tap(() => {
              this.loadCarts();
              this.messageService.add({
                severity: 'success',
                summary: 'Trasferta eliminata',
              });
            })
          )
          .subscribe();
      },
    });
  }

  updateStatus(cart: Partial<ICart>, status: EStatusCart) {
    const messages = {
      [EStatusCart.CANCELLED]:
        'Sei sicuro di voler annullare questa trasferta?',
      [EStatusCart.CONFIRMED]:
        'Sei sicuro di voler confermare questa trasferta?',
      [EStatusCart.DEPOSIT]:
        "Sei sicuro di voler confermare il pagamento dell'acconto?",
      [EStatusCart.COMPLETED]:
        'Sei sicuro di voler completare questa trasferta?',
      [EStatusCart.DRAFT]: '',
      [EStatusCart.PENDING]: '',
    };
    this.confirmationService.confirm({
      message: messages[status],
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.cartApiService
          .update(cart.id!, { status, onlyStatus: true })
          .pipe(
            take(1),
            tap(() => {
              this.loadCarts();
              this.messageService.add({
                severity: 'success',
                summary: 'Operazione completata',
              });
            })
          )
          .subscribe();
      },
    });
  }

  applyFilters() {
    this.filterActive = true;
    this.loadCarts();
  }

  resetFilters() {
    this.filterActive = false;
    this.userFilter.setValue(null);
    this.teamFilter.setValue(null);
    this.completeFilter.setValue(false);
    this.loadCarts();
  }

  onFilterTeam({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredTeams(filter);
    }
  }

  loadFilteredTeams(name: string) {
    this.teams$.next(name);
  }

  onFilterUser({ filter }: IDropdownFilters) {
    if (filter) {
      this.loadFilteredUsers(filter);
    }
  }

  loadFilteredUsers(name: string) {
    this.users$.next(name);
  }
}
