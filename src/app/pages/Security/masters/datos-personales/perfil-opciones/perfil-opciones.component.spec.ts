import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilOpcionesComponent } from './perfil-opciones.component';

describe('PerfilOpcionesComponent', () => {
  let component: PerfilOpcionesComponent;
  let fixture: ComponentFixture<PerfilOpcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerfilOpcionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilOpcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
