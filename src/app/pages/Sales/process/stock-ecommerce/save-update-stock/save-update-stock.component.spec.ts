import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateStockComponent } from './save-update-stock.component';

describe('SaveUpdateStockComponent', () => {
  let component: SaveUpdateStockComponent;
  let fixture: ComponentFixture<SaveUpdateStockComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateStockComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateStockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
