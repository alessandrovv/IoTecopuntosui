import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCaracteristicasVehiculoModalComponent } from './delete-caracteristicas-vehiculo-modal.component';

describe('DeleteCaracteristicasVehiculoModalComponent', () => {
  let component: DeleteCaracteristicasVehiculoModalComponent;
  let fixture: ComponentFixture<DeleteCaracteristicasVehiculoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteCaracteristicasVehiculoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCaracteristicasVehiculoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
