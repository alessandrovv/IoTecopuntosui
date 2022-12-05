import { TestBed } from '@angular/core/testing';

import { ReporteMovimientosService } from './reporte-movimientos.service';

describe('ReporteMovimientosService', () => {
  let service: ReporteMovimientosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteMovimientosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
