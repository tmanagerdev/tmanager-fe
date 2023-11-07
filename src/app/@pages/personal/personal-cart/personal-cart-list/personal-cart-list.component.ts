import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
  selector: 'app-personal-cart-list',
  templateUrl: './personal-cart-list.component.html',
  styleUrls: ['./personal-cart-list.component.scss'],
})
export class PersonalCartListComponent implements OnInit {
  carts: any = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;
  currentUser: any;
  EStatusCart = EStatusCart;

  teamsFilter: FormControl = new FormControl([]);

  carts$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private cartsApiService: CartApiService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router,
    private authService: AuthService,
    private cd: ChangeDetectorRef
  ) {
    this.carts$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.cartsApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { team: this.filter } : {}),
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
    this.carts = [];
    this.loading = true;
    this.carts$.next();
  }

  openCart(cart: any) {
    this.router.navigate(['/personal/carts', cart.id]);
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
    this.filter = this.teamsFilter.value.map((f: any) => f.id);
    this.loadCarts();
  }

  complete(cart: any) {
    console.log('qui??');
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
}
