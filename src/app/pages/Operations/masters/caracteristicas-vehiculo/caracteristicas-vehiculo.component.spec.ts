import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaracteristicasVehiculoComponent } from './caracteristicas-vehiculo.component';

describe('CaracteristicasVehiculoComponent', () => {
  let component: CaracteristicasVehiculoComponent;
  let fixture: ComponentFixture<CaracteristicasVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CaracteristicasVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaracteristicasVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
