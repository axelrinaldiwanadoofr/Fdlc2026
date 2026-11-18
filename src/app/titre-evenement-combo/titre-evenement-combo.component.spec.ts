import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitreEvenementComboComponent } from './titre-evenement-combo.component';

describe('TitreEvenementComboComponent', () => {
  let component: TitreEvenementComboComponent;
  let fixture: ComponentFixture<TitreEvenementComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TitreEvenementComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
