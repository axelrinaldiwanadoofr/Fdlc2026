import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeExposantComponent } from './liste-exposant.component';

describe('ListeExposantComponent', () => {
  let component: ListeExposantComponent;
  let fixture: ComponentFixture<ListeExposantComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeExposantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
