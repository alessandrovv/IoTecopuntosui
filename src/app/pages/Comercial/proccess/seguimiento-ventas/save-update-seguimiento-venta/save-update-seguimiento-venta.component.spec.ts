import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveUpdateSeguimientoVentaComponent } from './save-update-seguimiento-venta.component';

describe('SaveUpdateSeguimientoVentaComponent', () => {
  let component: SaveUpdateSeguimientoVentaComponent;
  let fixture: ComponentFixture<SaveUpdateSeguimientoVentaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveUpdateSeguimientoVentaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveUpdateSeguimientoVentaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
