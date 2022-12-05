import { TestBed } from '@angular/core/testing';

import { NotaAlmacenService } from './nota-almacen.service';

describe('NotaAlmacenService', () => {
  let service: NotaAlmacenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotaAlmacenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
