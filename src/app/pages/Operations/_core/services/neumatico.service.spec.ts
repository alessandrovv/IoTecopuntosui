import { TestBed } from '@angular/core/testing';

import { NeumaticoService } from './neumatico.service';

describe('NeumaticoService', () => {
  let service: NeumaticoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NeumaticoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
