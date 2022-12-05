import { TestBed } from '@angular/core/testing';

import { CategoriaMaterialService } from './categoria-material.service';

describe('CategoriaMaterialService', () => {
  let service: CategoriaMaterialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaMaterialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
