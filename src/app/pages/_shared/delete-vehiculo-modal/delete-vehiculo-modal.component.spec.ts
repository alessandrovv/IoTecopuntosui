import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteVehiculoModalComponent } from './delete-vehiculo-modal.component';

describe('DeleteVehiculoModalComponent', () => {
  let component: DeleteVehiculoModalComponent;
  let fixture: ComponentFixture<DeleteVehiculoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteVehiculoModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteVehiculoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
