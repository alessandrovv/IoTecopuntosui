import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarAsesorComercialComponent } from './eliminar-asesor-comercial.component';

describe('EliminarAsesorComercialComponent', () => {
  let component: EliminarAsesorComercialComponent;
  let fixture: ComponentFixture<EliminarAsesorComercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EliminarAsesorComercialComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarAsesorComercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
