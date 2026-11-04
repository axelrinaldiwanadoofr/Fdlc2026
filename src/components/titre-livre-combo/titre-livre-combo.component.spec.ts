import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitreLivreComboComponent } from './titre-livre-combo.component';

describe('TitreLivreComboComponent', () => {
  let component: TitreLivreComboComponent;
  let fixture: ComponentFixture<TitreLivreComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TitreLivreComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
