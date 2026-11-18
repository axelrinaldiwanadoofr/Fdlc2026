import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebutEvenementComboComponent } from './debut-evenement-combo.component';

describe('DebutEvenementComboComponent', () => {
  let component: DebutEvenementComboComponent;
  let fixture: ComponentFixture<DebutEvenementComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DebutEvenementComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
