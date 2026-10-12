import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListeExposantsPagePage } from './liste-exposants-page.page';

describe('ListeExposantsPagePage', () => {
  let component: ListeExposantsPagePage;
  let fixture: ComponentFixture<ListeExposantsPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListeExposantsPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
