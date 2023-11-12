import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { take, tap } from 'rxjs';
import { EStatusCart } from 'src/app/@core/models/cart.model';
import { ECategoryPeople, IPeople } from 'src/app/@core/models/people.model';
import { TeamPeopleModalComponent } from 'src/app/@pages/team/team-people/team-people-modal/team-people-modal.component';
import { PeopleRoomingService } from '../people-rooming.service';

@Component({
  selector: 'app-cart-create-pax',
  templateUrl: './cart-create-pax.component.html',
  styleUrls: ['./cart-create-pax.component.scss'],
})
export class CartCreatePaxComponent {
  @Input() activeIndex: number = 0;
  @Input() event: any;
  @Input() people: IPeople[] = [];
  @Input() isEdit = false;

  EStatusCart = EStatusCart;
  _status: EStatusCart = EStatusCart.DRAFT;
  ref!: DynamicDialogRef;

  @Output() addNewPeople: EventEmitter<IPeople> = new EventEmitter();
  @Output() removePeople: EventEmitter<IPeople> = new EventEmitter();
  @Output() nextStep: EventEmitter<void> = new EventEmitter();

  get players() {
    return (
      this.people.filter((p) => p.category == ECategoryPeople.PLAYER) ?? []
    ).length;
  }

  get staffs() {
    return (
      this.people.filter((p) => p.category == ECategoryPeople.STAFF) ?? []
    ).length;
  }

  get managers() {
    return (
      this.people.filter((p) => p.category == ECategoryPeople.MANAGER) ?? []
    ).length;
  }

  get equipments() {
    return (
      this.people.filter((p) => p.category == ECategoryPeople.EQUIPMENT) ?? []
    ).length;
  }

  get others() {
    return (
      this.people.filter((p) => p.category == ECategoryPeople.OTHER) ?? []
    ).length;
  }

  get totalPax() {
    return (
      this.players + this.staffs + this.managers + this.equipments + this.others
    );
  }

  constructor(
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public dialogService: DialogService,
    private peopleRoomingService: PeopleRoomingService
  ) {}

  onNextStep() {
    this.nextStep.emit();
  }

  onDeletePeople(people: IPeople) {
    this.confirmationService.confirm({
      message:
        'Sei sicuro di voler rimuovere questo partecipante? Sarà rimosso dalla eventuale stanza in cui era stato posizionato.',
      header: 'Conferma',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.removePeople.emit(people);
      },
    });
  }

  onAddPeople() {
    this.ref = this.dialogService.open(TeamPeopleModalComponent, {
      header: `Aggiungi nuovo membro`,
      width: '600px',
      contentStyle: { overflow: 'visible' },
      baseZIndex: 10001,
      data: {},
    });
    this.ref.onClose.subscribe((newPeople: any) => {
      if (newPeople) {
        this.addNewPeople.emit(newPeople);
      }
    });
  }

  onCloneLast() {
    //   this.cartApiService
    //     .copyLastRooming(this.team)
    //     .pipe(
    //       take(1),
    //       combineLatestWith(this.peopleRoomingService.people$),
    //       tap(([{ data }, people]) => {
    //         clearFormArray(this.rooms);
    //         for (const d of data) {
    //           const room = this.selectedHotel.rooms.find(
    //             (r: any) => r.name === d.roomName
    //           );
    //           const newRoom = new FormGroup({
    //             id: new FormControl(room.id),
    //             hotelId: new FormControl(this.selectedHotel.id),
    //             hotelName: new FormControl(this.selectedHotel.name),
    //             name: new FormControl(room.name),
    //             price: new FormControl(room.price),
    //             numPax: new FormControl(room.numPax),
    //             rooming: new FormArray([]),
    //             uuid: new FormControl(uuidv4()),
    //           });
    //           for (let p of d.people) {
    //             if (p.peopleId) {
    //               p = people.find((person: any) => person.id === p.peopleId);
    //             }
    //             const newPeople = new FormGroup({
    //               people: new FormGroup({
    //                 id: new FormControl(p.id ? p.id : null),
    //                 name: new FormControl(p.id ? p.name : null),
    //                 surname: new FormControl(p.id ? p.surname : null),
    //                 category: new FormControl(p.id ? p.category : null),
    //               }),
    //               name: new FormControl(!p.id ? p.name : null),
    //               surname: new FormControl(!p.id ? p.surname : null),
    //               category: new FormControl(!p.id ? p.category : null),
    //             });
    //             (newRoom.get('rooming') as FormArray).push(newPeople);
    //           }
    //           this.rooms.push(newRoom);
    //         }
    //         this.messageService.add({
    //           severity: 'success',
    //           summary: 'Rooming copiata da ultima trasferta',
    //         });
    //       })
    //     )
    //     .subscribe();
  }
}
