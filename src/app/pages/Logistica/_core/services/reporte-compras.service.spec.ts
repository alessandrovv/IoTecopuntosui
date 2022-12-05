import { TestBed } from '@angular/core/testing';

import { ReporteComprasService } from './reporte-compras.service';

describe('ReporteComprasService', () => {
  let service: ReporteComprasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReporteComprasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
