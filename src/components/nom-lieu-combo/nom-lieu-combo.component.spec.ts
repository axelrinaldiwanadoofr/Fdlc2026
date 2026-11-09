import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomLieuComboComponent } from './nom-lieu-combo.component';

describe('NomLieuComboComponent', () => {
  let component: NomLieuComboComponent;
  let fixture: ComponentFixture<NomLieuComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NomLieuComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
