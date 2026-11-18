import { describe, beforeEach, it, expect } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeLieuComboComponent } from './app-type-lieu-combo.component';

describe('TypeLieuComboComponent', () => {
  let component: TypeLieuComboComponent;
  let fixture: ComponentFixture<TypeLieuComboComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeLieuComboComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});