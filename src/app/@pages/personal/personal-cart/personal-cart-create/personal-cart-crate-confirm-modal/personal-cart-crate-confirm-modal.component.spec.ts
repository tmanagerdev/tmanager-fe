import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalCartCrateConfirmModalComponent } from './personal-cart-crate-confirm-modal.component';

describe('PersonalCartCrateConfirmModalComponent', () => {
  let component: PersonalCartCrateConfirmModalComponent;
  let fixture: ComponentFixture<PersonalCartCrateConfirmModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalCartCrateConfirmModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalCartCrateConfirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
