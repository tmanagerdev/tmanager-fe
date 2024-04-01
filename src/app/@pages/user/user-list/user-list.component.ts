import { Component } from '@angular/core';
import {
  MessageService,
  ConfirmationService,
  LazyLoadEvent,
} from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { tap, take, Subject, debounceTime, takeUntil, switchMap } from 'rxjs';
import { UserApiService } from 'src/app/@core/api/user-api.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { FormControl } from '@angular/forms';
import { TableLazyLoadEvent } from 'primeng/table';
import { ISort } from 'src/app/@core/models/base.model';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent {
  users: any[] = [];
  totalRecords: number = 0;
  page: number = 0;
  size: number = 10;
  filter: string = '';
  sort: ISort | null = null;
  loading: boolean = false;
  items = [
    {
      items: [
        {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: (user: any) => {
            this.update(user);
          },
        },
        {
          label: 'Delete',
          icon: 'pi pi-times',
          command: (user: any) => {
            this.remove(user);
          },
        },
      ],
    },
  ];

  searchFilter = new FormControl('');

  users$: Subject<void> = new Subject();
  destroy$: Subject<void> = new Subject();

  ref!: DynamicDialogRef;

  get rowsArray(): number[] {
    return Array(4);
  }

  get cellsArray(): number[] {
    return Array(8);
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userApiService: UserApiService,
    public dialogService: DialogService
  ) {}

  ngOnInit() {
    this.users$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.userApiService.findAll({
            page: this.page + 1,
            take: this.size,
            ...(this.filter ? { email: this.filter } : {}),
            ...(this.sort && this.sort.field
              ? { sortField: this.sort.field, sortOrder: this.sort.order }
              : {}),
          })
        ),
        tap(({ data, total }) => {
          this.users = [...data];
          this.totalRecords = total;
          this.loading = false;
        })
      )
      .subscribe();

    this.searchFilter.valueChanges
      .pipe(
        debounceTime(500),
        tap((val) => {
          this.filter = val || '';
          this.loadUsers();
        })
      )
      .subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers() {
    this.loading = true;
    this.users = [];
    this.users$.next();
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

    this.loadUsers();
  }

  create() {
    this.ref = this.dialogService.open(UserModalComponent, {
      header: `Crea nuovo utente`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        isEdit: false,
      },
    });

    this.ref.onClose.subscribe((newUser: any) => {
      if (newUser) {
        this.userApiService
          .create(newUser)
          .pipe(
            take(1),
            tap((data) => {
              this.loadUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Utente creato',
                detail: data.email,
              });
            })
          )
          .subscribe();
      }
    });
  }

  update(user: any) {
    this.ref = this.dialogService.open(UserModalComponent, {
      header: `Aggiorna ${user.email}`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {
        user,
        isEdit: true,
      },
    });

    this.ref.onClose.subscribe((newUser: any) => {
      if (newUser) {
        this.userApiService
          .update(user.id, newUser)
          .pipe(
            take(1),
            tap((data) => {
              this.loadUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Utente aggiornato',
                detail: data.email,
              });
            })
          )
          .subscribe();
      }
    });
  }

  remove(user: any) {
    this.confirmationService.confirm({
      message: 'Sei sicuro di voler eliminare questo utente?',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userApiService
          .delete(user.id)
          .pipe(
            take(1),
            tap(() => {
              this.loadUsers();
              this.messageService.add({
                severity: 'success',
                summary: 'Utente eliminato',
                detail: user.email,
              });
            })
          )
          .subscribe();
      },
    });
  }
}
