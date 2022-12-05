import { TestBed } from '@angular/core/testing';

import { ClaseMaterialService } from './clase-material.service';

describe('ClaseMaterialService', () => {
  let service: ClaseMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClaseMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
