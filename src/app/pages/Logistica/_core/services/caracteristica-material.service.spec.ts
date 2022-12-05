import { TestBed } from '@angular/core/testing';

import { CaracteristicaMaterialService } from './caracteristica-material.service';

describe('CaracteristicaMaterialService', () => {
  let service: CaracteristicaMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaracteristicaMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
