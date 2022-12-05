import { TestBed } from '@angular/core/testing';

import { PuntosTransporteServiceService } from './puntos-transporte-service.service';

describe('PuntosTransporteServiceService', () => {
  let service: PuntosTransporteServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuntosTransporteServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
