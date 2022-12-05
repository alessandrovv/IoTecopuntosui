import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoVentasComponent } from './seguimiento-ventas.component';

describe('SeguimientoVentasComponent', () => {
  let component: SeguimientoVentasComponent;
  let fixture: ComponentFixture<SeguimientoVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
