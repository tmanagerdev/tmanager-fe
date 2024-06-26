import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { AuthService } from 'src/app/@core/services/auth.service';

@Component({
  selector: 'app-personal-event-list',
  templateUrl: './personal-event-list.component.html',
  styleUrls: ['./personal-event-list.component.scss'],
})
export class PersonalEventListComponent implements OnInit, OnDestroy {
  events: any = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: any = null;
  loading: boolean = false;
  currentUser: any;

  teamsFilter: FormControl = new FormControl([]);

  events$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  constructor(
    private eventsApiService: EventApiService,
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
            ...(this.filter ? { team: this.filter } : {}),
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

  loadEvents() {
    this.events = [];
    this.loading = true;
    this.events$.next();
  }

  hasCart(event: any) {
    return event.carts && event.carts.length;
  }

  openCart(event: any) {
    // this.hasCart(event)
    //   ? this.router.navigate(['/personal/carts', event.carts[0].id])
    //   :

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

    this.loadEvents();
  }

  onApplyFilters() {
    this.filter = this.teamsFilter.value.map((f: any) => f.id);
    this.loadEvents();
  }
}
