import { TestBed } from '@angular/core/testing';

import { CaracteristicasVehiculoService } from './caracteristicas-vehiculo.service';

describe('CaracteristicasVehiculoService', () => {
  let service: CaracteristicasVehiculoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristicasVehiculoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
