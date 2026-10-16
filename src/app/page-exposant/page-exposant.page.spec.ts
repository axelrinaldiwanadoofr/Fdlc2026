import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageExposantPage } from './page-exposant.page';

describe('PageExposantPage', () => {
  let component: PageExposantPage;
  let fixture: ComponentFixture<PageExposantPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageExposantPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
