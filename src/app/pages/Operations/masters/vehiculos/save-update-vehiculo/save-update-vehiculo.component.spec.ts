import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateVehiculoComponent } from './save-update-vehiculo.component';

describe('SaveUpdateVehiculoComponent', () => {
  let component: SaveUpdateVehiculoComponent;
  let fixture: ComponentFixture<SaveUpdateVehiculoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateVehiculoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateVehiculoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
