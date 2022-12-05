import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicaMaterialComponent } from './caracteristica-material.component';

describe('CaracteristicaMaterialComponent', () => {
  let component: CaracteristicaMaterialComponent;
  let fixture: ComponentFixture<CaracteristicaMaterialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracteristicaMaterialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaracteristicaMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
