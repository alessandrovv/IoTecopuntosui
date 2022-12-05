import { TestBed } from '@angular/core/testing';

import { DocumentoCompraService } from './documento-compra.service';

describe('DocumentoCompraService', () => {
  let service: DocumentoCompraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentoCompraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
