import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsignarRolEmpresaComponent } from './asignar-rol-empresa.component';

describe('AsignarRolEmpresaComponent', () => {
  let component: AsignarRolEmpresaComponent;
  let fixture: ComponentFixture<AsignarRolEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsignarRolEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignarRolEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
