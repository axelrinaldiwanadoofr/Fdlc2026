import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PageLieuPage } from './page-lieu.page';

describe('PageLieuPage', () => {
  let component: PageLieuPage;
  let fixture: ComponentFixture<PageLieuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PageLieuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
