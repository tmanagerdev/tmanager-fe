import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  accomodationForm,
  cartForm,
  paxForm,
  roadForm,
} from '../personal-cart.utils';
import { FormArray, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartApiService } from 'src/app/@core/api/carts-api.service';
import { MenuItem } from 'primeng/api';
import { AuthService } from 'src/app/@core/services/auth.service';
import { EventApiService } from 'src/app/@core/api/events-api.service';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-personal-cart-create',
  templateUrl: './personal-cart-create.component.html',
  styleUrls: ['./personal-cart-create.component.scss'],
})
export class PersonalCartCreateComponent implements OnInit, OnDestroy {
  eventId: number = 0;
  items: MenuItem[] = [
    {
      label: 'Partecipanti',
    },
    {
      label: 'Alloggio',
    },
    {
      label: 'Autonoleggio e tratte',
    },
    {
      label: 'Attività',
    },
  ];
  activeIndex: number = 2;
  currentUser: any;
  event: any;

  cartForm: FormGroup = cartForm;
  paxForm: FormGroup = paxForm;
  accomodationForm: FormGroup = accomodationForm;
  roadForm: FormGroup = roadForm;

  event$: Subject<void> = new Subject();
  unsubscribe$: Subject<void> = new Subject();

  get activities() {
    return this.cartForm.get('activities') as FormArray;
  }

  get rooms() {
    return this.cartForm.get('rooms') as FormArray;
  }

  get roads() {
    return this.cartForm.get('roads') as FormArray;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartApiService: CartApiService,
    private eventApiService: EventApiService,
    private authService: AuthService
  ) {
    this.eventId = this.route.snapshot.params['id'];
    this.currentUser = this.authService.currentUser;

    this.event$
      .pipe(
        takeUntil(this.unsubscribe$),
        switchMap(() => this.eventApiService.findOne(this.eventId)),
        tap((event) => {
          this.event = { ...event };
        })
      )
      .subscribe();
  }

  ngOnInit(): void {
    this.loadEvent();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  loadEvent() {
    this.event$.next();
  }

  onPrevStep() {
    this.activeIndex--;
  }

  onNextStep() {
    if (this.activeIndex < 3) {
      this.activeIndex++;
      console.log('PAXFORM VALUE', this.paxForm.value);
      console.log('ACCOMODATIONFORM VALUE', this.accomodationForm.value);
      console.log('ROADFORM VALUE', this.roadForm.value);
    } else {
      console.log('CREAZIONE CART');
    }
  }
}
