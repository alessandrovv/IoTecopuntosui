import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteMovimientosComponent } from './reporte-movimientos.component';

describe('ReporteMovimientosComponent', () => {
  let component: ReporteMovimientosComponent;
  let fixture: ComponentFixture<ReporteMovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteMovimientosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteMovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
