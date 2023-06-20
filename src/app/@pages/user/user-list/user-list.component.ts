import { Component } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { tap, take } from 'rxjs';
import { UserApiService } from 'src/app/@core/api/user-api.service';
import { UserModalComponent } from '../user-modal/user-modal.component';
import { EntityListComponent } from 'src/app/@shared/entity-list/entity-list.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent extends EntityListComponent {
  ref!: DynamicDialogRef;

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userApiService: UserApiService,
    public dialogService: DialogService
  ) {
    super();

    super.apiFetch$ = this.userApiService.findAll({
      page: this.page + 1,
      take: this.size,
      ...(this.filter ? { email: this.filter } : {}),
      ...(this.sort && this.sort.field
        ? { sortField: this.sort.field, sortOrder: this.sort.order }
        : {}),
    });

    super.cellsNumber = 8;
  }

  create() {
    this.ref = this.dialogService.open(UserModalComponent, {
      header: `Crea nuovo utente`,
      width: '600px',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10001,
      data: {},
    });

    this.ref.onClose.subscribe((newUser: any) => {
      if (newUser) {
        this.userApiService
          .create(newUser)
          .pipe(
            take(1),
            tap((data) => {
              this.loadData();
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
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10001,
      data: {
        user,
      },
    });

    this.ref.onClose.subscribe((newUser: any) => {
      if (newUser) {
        this.userApiService
          .update(user.id, newUser)
          .pipe(
            take(1),
            tap((data) => {
              this.loadData();
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
              this.loadData();
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
