import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsquemaComisionesComponent } from './esquema-comisiones.component';

describe('EsquemaComisionesComponent', () => {
  let component: EsquemaComisionesComponent;
  let fixture: ComponentFixture<EsquemaComisionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsquemaComisionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EsquemaComisionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
