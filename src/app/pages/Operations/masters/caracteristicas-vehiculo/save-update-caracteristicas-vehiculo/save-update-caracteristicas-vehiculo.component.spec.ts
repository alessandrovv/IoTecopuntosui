import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateCaracteristicasVehiculoComponent } from './save-update-caracteristicas-vehiculo.component';

describe('SaveUpdateCaracteristicasVehiculoComponent', () => {
  let component: SaveUpdateCaracteristicasVehiculoComponent;
  let fixture: ComponentFixture<SaveUpdateCaracteristicasVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateCaracteristicasVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateCaracteristicasVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
