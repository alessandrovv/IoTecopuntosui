/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SeguimientoVisitaComercialComponent } from './seguimiento-visita-comercial.component';

describe('SeguimientoVisitaComercialComponent', () => {
  let component: SeguimientoVisitaComercialComponent;
  let fixture: ComponentFixture<SeguimientoVisitaComercialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeguimientoVisitaComercialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoVisitaComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
