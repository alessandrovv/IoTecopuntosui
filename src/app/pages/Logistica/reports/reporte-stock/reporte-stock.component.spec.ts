import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteStockComponent } from './reporte-stock.component';

describe('ReporteStockComponent', () => {
  let component: ReporteStockComponent;
  let fixture: ComponentFixture<ReporteStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReporteStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReporteStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
