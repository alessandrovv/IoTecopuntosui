import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteVencimientoComponent } from './reporte-vencimiento.component';

describe('ReporteVencimientoComponent', () => {
  let component: ReporteVencimientoComponent;
  let fixture: ComponentFixture<ReporteVencimientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteVencimientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteVencimientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
