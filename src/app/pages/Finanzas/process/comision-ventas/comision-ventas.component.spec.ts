import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComisionVentasComponent } from './comision-ventas.component';

describe('ComisionVentasComponent', () => {
  let component: ComisionVentasComponent;
  let fixture: ComponentFixture<ComisionVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComisionVentasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComisionVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
