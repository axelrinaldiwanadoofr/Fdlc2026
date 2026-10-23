import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomPersonneComboComponent } from './nom-personne-combo.component';

describe('NomPersonneComboComponent', () => {
  let component: NomPersonneComboComponent;
  let fixture: ComponentFixture<NomPersonneComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NomPersonneComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
