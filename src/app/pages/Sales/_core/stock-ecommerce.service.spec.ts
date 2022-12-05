import { TestBed } from '@angular/core/testing';

import { StockEcommerceService } from './stock-ecommerce.service';

describe('StockEcommerceService', () => {
  let service: StockEcommerceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StockEcommerceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
