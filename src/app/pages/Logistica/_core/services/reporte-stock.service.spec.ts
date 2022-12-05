import { TestBed } from '@angular/core/testing';

import { ReporteStockService } from './reporte-stock.service';

describe('ReporteStockService', () => {
  let service: ReporteStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
