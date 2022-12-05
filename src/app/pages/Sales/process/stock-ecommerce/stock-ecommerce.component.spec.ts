import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockEcommerceComponent } from './stock-ecommerce.component';

describe('StockEcommerceComponent', () => {
  let component: StockEcommerceComponent;
  let fixture: ComponentFixture<StockEcommerceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StockEcommerceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StockEcommerceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
