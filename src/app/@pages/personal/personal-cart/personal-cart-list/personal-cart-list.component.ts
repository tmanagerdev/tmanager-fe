import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
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

  teamsFilter: FormControl = new FormControl([]);

  carts$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private cartsApiService: CartApiService,
    private router: Router,
    private authService: AuthService
  ) {
    this.carts$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() =>
          this.cartsApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { name: this.filter } : {}),
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

  ngOnInit() {
    this.loadCarts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadCarts() {
    this.carts = [];
    this.loading = true;
    this.carts$.next();
  }

  openCart(cart: any) {
    this.router.navigate(['/personal/carts', cart.id]);
  }

  onChangePage(event: any) {}

  onApplyFilters() {
    console.log('filter', this.teamsFilter.value);
  }
}
